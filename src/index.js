const Vector2 = require('./lib/vector2');
const images = {
  planet: require('./assets/planet.png
};

const GRAVITY_INTENSITY = 10, GRAVITY_SCALE = 4;
const PLANET_RADIUS = 20;
const SHIP_WIDTH = 10, SHIP_HEIGHT = 15;
const TIMESTEP = 33;
const MAX_VELOCITY = 50;

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
