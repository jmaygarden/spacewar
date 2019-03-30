class Vector2 {
  constructor(x, y) {
    switch (typeof x) {
      case 'number':
        this.data = [ x, y ];
        break;

      case 'object':
        if (Array.isArray(x)) {
          this.data = x;
        } else {
          this.data = [ ...x.data ];
        }
        break;

      default:
        this.data = [ 0, 0 ];
        break;
    }
  }

  get x() {
    return this.data[0];
  }

  get y() {
    return this.data[1];
  }

  set x(value) {
    this.data[0] = value;
  }

  set y(value) {
    this.data[1] = value;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;

    return this;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;

    return this;
  }

  scale(k) {
    this.x *= k;
    this.y *= k;

    return this;
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  get length() {
    return Math.sqrt(this.lengthSquared);
  }

  normalize() {
    let length = this.length;

    if (1e-6 > length) {
      return this;
    }

    this.x /= length;
    this.y /= length;

    return this;
  }
}

module.exports = Vector2;
