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
    let thrust = [0, 0]
    let force = [0, 0]
    let torque = 0;

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

    Map.worldWrap(this.state.position)
  },
};


