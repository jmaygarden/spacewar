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

    explosion_init(this.ctx);

    this.ships = [
      new Ship(state[0], 'red', {left:65, thrust:83, right:68}),
      new Ship(state[1], 'blue', {left:100, thrust:101, right:102}),
    ];

    this.explosion = new Explosion([100, 100], 4);

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
    var ctx = this.ctx;

    ctx.fillRect(0, 0, this.width, this.height);
    ctx.drawImage(img["planet"],
      this.planetOffset[0],
      this.planetOffset[1]);
    for (var i = 0; i < this.ships.length; ++i)
      this.ships[i].render(ctx)
    this.explosion.render(ctx);
  },

  update: function(t, dt) {
    for (var i = 0; i < this.ships.length; ++i)
      this.ships[i].update(t, dt)
    this.explosion.update(t, dt);
  },

  worldWrap: function(x) {
    while (x[0] > Map.width)     { x[0] -= Map.width; }
    while (x[0] < 0)             { x[0] += Map.width; }
    while (x[1] > Map.height)    { x[1] -= Map.height; }
    while (x[1] < 0)             { x[1] += Map.height; }
  },
};


