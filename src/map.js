import {
  PhysicsState,
  Vector2
} from './lib';
import Ship from './ship';
import PlanetImage from './assets/planet.png';

const img = {
  planet: new Image()
};

img.planet.src = PlanetImage;

const GRAVITY_INTENSITY = 10;
const GRAVITY_SCALE = 4;
const PLANET_RADIUS = 20;

const Map = {
  ctx: null,
  width: 0,
  height: 0,
  ships: null,
  gravityCenter: new Vector2(),
  gravitySlope: 1,
  gravityIntercept: 1,
  planetOffset: new Vector2(),
  init: function(canvas) {
    var map = this, state = null, distance = 160, ndistance;

    this.ctx = canvas.getContext('2d');
    this.ctx.drawPolygon = function(v) {
      this.beginPath();
      this.moveTo(v[0].x, v[0].y);
      for (var i = 1; i < v.length; ++i) {
        this.lineTo(v[i].x, v[i].y);
      }
      this.closePath();
    }

    this.width = canvas.width;
    this.height = canvas.height;
    this.gravityCenter.x = this.width / 2;
    this.gravityCenter.y = this.height / 2;
    this.gravitySlope = GRAVITY_SCALE / Math.sqrt(this.width * this.height);
    ndistance = this.gravitySlope * distance + this.gravityIntercept;

    this.planetOffset.x = this.gravityCenter.x - img["planet"].width / 2;
    this.planetOffset.y = this.gravityCenter.y - img["planet"].height / 2;

    state = [new PhysicsState(), new PhysicsState()];

    state[0].position.x = this.gravityCenter.x - distance;
    state[0].position.y = this.gravityCenter.y;
    state[0].momentum.y = -3 * GRAVITY_INTENSITY / ndistance;
    state[0].orientation = 3 * Math.PI / 2;
    state[0].recalculate();

    state[1].position.x = this.gravityCenter.x + distance;
    state[1].position.y = this.gravityCenter.y;
    state[1].momentum.y = -state[0].momentum.y;
    state[1].orientation = Math.PI - state[0].orientation;
    state[1].recalculate();

    //explosion_init(this.ctx);

    this.ships = [
      new Ship(state[0], 'red', {left:65, thrust:83, right:68}),
      new Ship(state[1], 'blue', {left:100, thrust:101, right:102}),
    ];

    //this.explosion = new Explosion([100, 100], 4);

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
    const v = new Vector2(this.gravityCenter).sub(state.position);
    let d = v.length;
    let a;

    if (PLANET_RADIUS > d) {
      return new Vector2();
    }
    d = this.gravitySlope * d + this.gravityIntercept;
    a = GRAVITY_INTENSITY / (d * d);

    return v.normalize().scale(a);
  },

  render: function() {
    var ctx = this.ctx;

    ctx.fillRect(0, 0, this.width, this.height);
    ctx.drawImage(img["planet"],
      this.planetOffset.x,
      this.planetOffset.y);
    for (var i = 0; i < this.ships.length; ++i)
      this.ships[i].render(ctx)
    //this.explosion.render(ctx);
  },

  update: function(t, dt) {
    for (var i = 0; i < this.ships.length; ++i)
      this.ships[i].update(t, dt)
    //this.explosion.update(t, dt);
  },

  worldWrap: function(x) {
    while (x.x > Map.width)     { x.x -= Map.width; }
    while (x.x < 0)             { x.x += Map.width; }
    while (x.y > Map.height)    { x.y -= Map.height; }
    while (x.y < 0)             { x.y += Map.height; }
  },
};

export default Map;
