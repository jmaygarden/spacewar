function rk4_intialize(state, t, forces) {
    var tmp = forces(state, t);
    return {
        velocity: state.velocity,
        angularVelocity: state.angularVelocity,
        force: tmp.force,
        torque: tmp.torque
    };
}

function rk4_evaluate(state, t, dt, derivative, forces) {
    var tmp = [0, 0];

    V2.scale(derivative.velocity, dt, tmp);
    V2.add(state.position, tmp, state.position);
    V2.scale(derivative.force, dt, tmp);
    V2.add(state.momentum, tmp, state.momentum);
    state.orientation += derivative.angularVelocity * dt;
    state.angularMomentum += derivative.torque * dt;
    state.recalculate();

    tmp = forces(state, t + dt);
    return {
        velocity: state.velocity,
        angularVelocity: state.angularVelocity,
        force: tmp.force,
        torque: tmp.torque
    };
}

function PhysicsState() {
    // primary
    this.position = [0, 0];
    this.momentum = [0, 0];
    this.orientation = 0;
    this.angularMomentum = 0;

    // secondary
    this.velocity = [0, 0];
    this.direction = [0, 0];
    this.angularVelocity = 0;

    // constant
    this.mass = 1;
    this.inverseMass = 1;
    this.inertia = 1;
    this.inverseInertia = 1;
}

PhysicsState.prototype = {
    recalculate: function() {
        V2.scale(this.momentum, this.inverseMass, this.velocity);
        this.direction[0] = Math.cos(this.orientation);
        this.direction[1] = Math.sin(this.orientation);
        this.angularVelocity = this.angularMomentum * this.inverseInertia;
    },

    integrate: function(t, dt, forces) {
        var a = rk4_intialize(this, t, forces);
        var b = rk4_evaluate(this, t, 0.5 * dt, a, forces);
        var c = rk4_evaluate(this, t, 0.5 * dt, b, forces);
        var d = rk4_evaluate(this, t, dt, c, forces);

        this.position[0] += dt / 6.0 * (a.velocity[0] + 2.0 * (b.velocity[0] + c.velocity[0]) + d.velocity[0]);
        this.position[1] += dt / 6.0 * (a.velocity[1] + 2.0 * (b.velocity[1] + c.velocity[1]) + d.velocity[1]);
        this.momentum[0] += dt / 6.0 * (a.force[0] + 2.0 * (b.force[0] + c.force[0]) + d.force[0]);
        this.momentum[1] += dt / 6.0 * (a.force[1] + 2.0 * (b.force[1] + c.force[1]) + d.force[1]);
        this.orientation += dt / 6.0 * (a.angularVelocity + 2.0 * (b.angularVelocity + c.angularVelocity) + d.angularVelocity);
        this.angularMomentum += dt / 6.0 * (a.torque + 2.0 * (b.torque + c.torque) + d.torque);
        this.recalculate()
    }
}

function Set() {
    this.list = [];
}

Set.prototype = {
    add: function (obj) {
        this.list.push(obj);
    },

    remove: function (obj) {
        for (var i = 0; i < this.list.length; ++i) {
            if (this.list[i] == obj) {
                this.list.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    foreach: function (f) {
        for (var i = 0; i < this.list.length; ++i) {
            f(this.list[i], i, this)
        }
    },
};

function load_images(sources, onload) {
    var img = {}, i = 0, len = 0;
    for (var key in sources) {
        ++len;
        img[key] = new Image();
        img[key].onload = function() {
            if (++i >= len) {
                onload();
            }
        };
        img[key].src = sources[key];
    }
    return img;
}

