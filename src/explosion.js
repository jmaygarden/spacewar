function explosion_init(ctx) {
  Burst.prototype.gradient = ctx.createRadialGradient(0, 0, 0, 1, 0, 15);
  Burst.prototype.gradient.addColorStop(0.0, "rgba(190,105,90,1)");
  Burst.prototype.gradient.addColorStop(0.25, "rgba(5,30,80,0.4)");
  Burst.prototype.gradient.addColorStop(1, "rgba(10,0,40,0)");
}

function Explosion(position, size) {
  this.position = position;
  this.size = size;
  this.set = new Set();

  var burst = new Burst(this.set, this.size);
  this.set.add(burst);
}

Explosion.prototype = {
  addBurst: function () {
    var burst = new Burst(this.set, (Math.random() * 0.4 + 0.6) * this.size);
    var dx = Math.random();
    dx *= dx;
    dx *= (Math.random() < 0.5 ? -1 : 1);
    burst.position[0] = dx * this.size;
    dx = Math.random();
    dx *= dx;
    dx *= (Math.random() < 0.5 ? -1 : 1);
    burst.position[1] = dx * this.size;
    this.set.add(burst);
  },

  update: function (t, dt) {
    if (null == this.startTime) {
      this.startTime = t;
    }
    var elapsed = t - this.startTime;
    if (elapsed > Math.random() + 0.05) {
      this.startTime = t;
      this.addBurst();
    }

    this.set.foreach(function(burst) {
      burst.update(t, dt);
    });
  },

  render: function (ctx) {
    ctx.save();
    ctx.translate(this.position[0], this.position[1]);
    this.set.foreach(function(burst) {
      burst.render(ctx);
    });
    ctx.restore();
  },
};

