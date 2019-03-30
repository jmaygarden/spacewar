import Vector2 from './vector2';

function intialize(state, t, forces) {
  var tmp = forces(state, t);
  return {
    velocity: state.velocity,
    angularVelocity: state.angularVelocity,
    force: tmp.force,
    torque: tmp.torque
  };
}

function evaluate(state, t, dt, derivative, forces) {
  let tmp = new Vector2(derivative.velocity).scale(dt);

  state.position.add(tmp);
  tmp = new Vector2(derivative.force).scale(dt);
  state.momentum.add(tmp);
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

const RK4 = { intialize, evaluate };

export default RK4;
