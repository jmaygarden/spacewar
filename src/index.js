import Map from './map';

const TIMESTEP = 33;

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
