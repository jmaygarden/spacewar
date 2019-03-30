import Map from './map';
import { Vector2 } from './lib';

const SHIP_WIDTH = 10;
const SHIP_HEIGHT = 15;
const MAX_VELOCITY = 50;

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
    // linear thrust
    const thrust = new Vector2(state.direction).scale(this.thrust);
    let force = new Vector2();
    if (Map.keystate[this.keys.thrust]) {
      force.add(thrust);
    }
    force.add(Map.gravity(state));

    // angular torque and damping
    let torque = 0;
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
    if (this.state.velocity.length > MAX_VELOCITY) {
      this.state.momentum.normalize();
      this.state.momentum.scale(this.state.mass * MAX_VELOCITY);
      this.state.recalculate();
    }

    Map.worldWrap(this.state.position)
  },
};

export default Ship;

