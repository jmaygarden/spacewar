import Vector2 from './vector2';
import RK4 from './rk4';

function PhysicsState() {
  // primary
  this.position = new Vector2();
  this.momentum = new Vector2();
  this.orientation = 0;
  this.angularMomentum = 0;

  // secondary
  this.velocity = new Vector2();
  this.direction = new Vector2();
  this.angularVelocity = 0;

  // constant
  this.mass = 1;
  this.inverseMass = 1;
  this.inertia = 1;
  this.inverseInertia = 1;
}

PhysicsState.prototype = {
  recalculate: function() {
    this.velocity.set(this.momentum).scale(this.inverseMass);
    this.direction.x = Math.cos(this.orientation);
    this.direction.y = Math.sin(this.orientation);
    this.angularVelocity = this.angularMomentum * this.inverseInertia;
  },

  integrate: function(t, dt, forces) {
    var a = RK4.intialize(this, t, forces);
    var b = RK4.evaluate(this, t, 0.5 * dt, a, forces);
    var c = RK4.evaluate(this, t, 0.5 * dt, b, forces);
    var d = RK4.evaluate(this, t, dt, c, forces);

    this.position.x += dt / 6.0 * (a.velocity.x + 2.0 * (b.velocity.x + c.velocity.x) + d.velocity.x);
    this.position.y += dt / 6.0 * (a.velocity.y + 2.0 * (b.velocity.y + c.velocity.y) + d.velocity.y);
    this.momentum.x += dt / 6.0 * (a.force.x + 2.0 * (b.force.x + c.force.x) + d.force.x);
    this.momentum.y += dt / 6.0 * (a.force.y + 2.0 * (b.force.y + c.force.y) + d.force.y);
    this.orientation += dt / 6.0 * (a.angularVelocity + 2.0 * (b.angularVelocity + c.angularVelocity) + d.angularVelocity);
    this.angularMomentum += dt / 6.0 * (a.torque + 2.0 * (b.torque + c.torque) + d.torque);
    this.recalculate()
  }
}

export default PhysicsState;

