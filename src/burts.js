function Burst(set, size) {
  this.set = set;
  this.size = size;
}

Burst.prototype = {
  position: [0, 0],

  update: function (t, dt) {
    if (null == this.startTime) {
      this.startTime = t;
    }
    var elapsed = Math.min(0.5, t - this.startTime);
    if (elapsed == 0.5) {
      this.set.remove(this);
    }
    var factor = 1.25 * 0.48 * Math.PI;
    this.scale = 1 + this.size * Math.tan(elapsed * factor);
    if (isNaN(this.scale)) {
      this.scale = 60000;
    }
  },

  render: function (ctx) {
    ctx.save();
    ctx.translate(this.position[0], this.position[1]);
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2, false);
    ctx.fillStyle = this.gradient;
    ctx.globalCompositeOperation = "lighter";
    ctx.fill();
    ctx.restore();
  },
};

