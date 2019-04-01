import Map from './map';

const TIMESTEP = 33;
const DT = TIMESTEP / 1000;
const MAX_ITERATIONS = 10;

class Game {
  constructor() {
    Map.init(document.getElementById('canvas'));
    Map.render();
    window.Map = Map;

    this.timestamp = 0;
    this.requestId = requestAnimationFrame((timestamp) => {
      this.timestamp = timestamp;
      this.requestId = requestAnimationFrame(
        (timestamp) => this.update(timestamp)
      );
    });
  }

  update(timestamp) {
    let delta = timestamp - this.timestamp;

    while (delta > TIMESTEP) {
      Map.update(timestamp, DT);
      delta -= TIMESTEP;
    }

    this.timestamp = timestamp - delta;

    Map.render();

    this.requestId = requestAnimationFrame(
      (timestamp) => this.update(timestamp)
    );
  }
}

const game = new Game();
