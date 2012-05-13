/*
 * Copyright (C) 2012 Judge Maygarden (wtfpl.jmaygarden@safersignup.com)
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 */

var GRAVITY_INTENSITY = 10, GRAVITY_SCALE = 4;
var PLANET_RADIUS = 20;
var SHIP_WIDTH = 10, SHIP_HEIGHT = 15;
var TIMESTEP = 33;
var MAX_VELOCITY = 50;

function Ship(state, color, keys) {
    this.state = state;
    this.color = color;
    this.keys = keys;
}

Ship.prototype = {
    geometry: [
        [-1 * SHIP_HEIGHT/2, -1 * SHIP_WIDTH/2],
        [-1 * SHIP_HEIGHT/2, SHIP_WIDTH/2],
        [SHIP_HEIGHT/2, 0]
        ],
    m: 1,
    thrust: 5,
    turn: 1,

    render: function (ctx) {
        ctx.save();
        ctx.translate(this.state.position[0], this.state.position[1]);
        ctx.rotate(this.state.orientation);
        ctx.drawPolygon(this.geometry);
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'gray'
        ctx.stroke();
        ctx.restore();
    },

    forces: function (state, t) {
        var thrust = [0, 0], force = [0, 0], torque = 0;

        // linear thrust
        V2.scale(state.direction, this.thrust, thrust);
        if (Map.keystate[this.keys.thrust])
            V2.add(force, thrust, force);
        V2.add(force, Map.gravity(state), force);

        // angular torque and damping
        if (Map.keystate[this.keys.left])
            torque -= this.turn;
        else if (Map.keystate[this.keys.right])
            torque += this.turn;
        torque -= state.angularMomentum;

        return { force: force, torque: torque };
    },

    update: function (t, dt) {
        var ship = this;

        this.state.integrate(t, dt, function (state, t) {
            return ship.forces(state, t);
        });

        //  cap a maximum velocity so things don't get out of hand
        if (V2.length(this.state.velocity) > MAX_VELOCITY) {
            V2.normalize(this.state.momentum, this.state.momentum);
            V2.scale(this.state.momentum, this.state.mass * MAX_VELOCITY, this.state.momentum);
            this.state.recalculate();
        }

        Map.bind(this.state.position)
    },
}

var Map = {
    ctx: null,
    width: 0,
    height: 0,
    ships: null,
    gravityCenter: [0, 0],
    gravitySlope: 1,
    gravityIntercept: 1,
    planetOffset: [0, 0],
    init: function(canvas) {
        var map = this, state = null, distance = 160, ndistance;

        this.ctx = canvas.getContext('2d');
        this.ctx.drawPolygon = function(v) {
            this.beginPath();
            this.moveTo(v[0][0], v[0][1]);
            for (var i = 1; i < v.length; ++i) {
                this.lineTo(v[i][0], v[i][1]);
            }
            this.closePath();
        }

        this.width = canvas.width;
        this.height = canvas.height;
        this.gravityCenter[0] = this.width / 2;
        this.gravityCenter[1] = this.height / 2;
        this.gravitySlope = GRAVITY_SCALE / Math.sqrt(this.width * this.height);
        ndistance = this.gravitySlope * distance + this.gravityIntercept;

        this.planetOffset[0] = this.gravityCenter[0] - img["planet"].width / 2;
        this.planetOffset[1] = this.gravityCenter[1] - img["planet"].height / 2;

        state = [new PhysicsState(), new PhysicsState];

        state[0].position[0] = this.gravityCenter[0] - distance;
        state[0].position[1] = this.gravityCenter[1];
        state[0].momentum[1] = -3 * GRAVITY_INTENSITY / ndistance;
        state[0].orientation = 3 * Math.PI / 2;
        state[0].recalculate();

        state[1].position[0] = this.gravityCenter[0] + distance;
        state[1].position[1] = this.gravityCenter[1];
        state[1].momentum[1] = -state[0].momentum[1];
        state[1].orientation = Math.PI - state[0].orientation;
        state[1].recalculate();

        this.ships = [
            new Ship(state[0], 'red', {left:65, thrust:83, right:68}),
            new Ship(state[1], 'blue', {left:100, thrust:101, right:102}),
            ];

        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.clip();

        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';

        this.keystate = new Array();
        document.onkeydown = function(event) {
            map.keystate[event.keyCode] = true;
        };
        document.onkeyup = function(event) {
            map.keystate[event.keyCode] = false;
        };
    },
    gravity: function(state) {
        var v = V2.sub(this.gravityCenter, state.position),
            d = V2.length(v),
            a;
        if (PLANET_RADIUS > d)
            return [0, 0];
        d = this.gravitySlope * d + this.gravityIntercept;
        a = GRAVITY_INTENSITY / (d * d);
        return V2.scale(V2.normalize(v, v), a, v);
    },
    render: function() {
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.drawImage(img["planet"], this.planetOffset[0], this.planetOffset[1]);

        for (var i = 0; i < this.ships.length; ++i)
            this.ships[i].render(this.ctx)
    },
    update: function(t, dt) {
        for (var i = 0; i < this.ships.length; ++i)
            this.ships[i].update(t, dt)
    },
    bind: function(x) {
        while (x[0] > Map.width)     { x[0] -= Map.width; }
        while (x[0] < 0)             { x[0] += Map.width; }
        while (x[1] > Map.height)    { x[1] -= Map.height; }
        while (x[1] < 0)             { x[1] += Map.height; }
    },
}

var img = load_images(
    {
        planet:"planet.png",
    },
    function() {
        setInterval((function() {
            var next = (new Date).getTime();
            var dt = TIMESTEP / 1000, max = 10;

            Map.init(document.getElementById('canvas'));

            function update() {
                Map.update((new Date).getTime() / 1000.0, dt)
            }

            function render() {
                Map.render()
            }

            render();

            return function() {
                var i = 0;

                while ((new Date).getTime() > next && i < max) {
                    update();
                    next += TIMESTEP;
                    i++;
                }

                if (0 < i)
                    render();
            }
        })(), 0);
    });
