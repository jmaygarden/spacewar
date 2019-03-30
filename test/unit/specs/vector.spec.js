const Vector2 = require('lib/vector2');
const tolerance = 1e-6;

test('construction', () => {
  let v;

  v = new Vector2(-1.5, 1);
  expect(typeof v).toBe('object');
  expect(v.x).toBe(-1.5);
  expect(v.y).toBe(1);

  v = new Vector2([-1.5, 1]);
  expect(typeof v).toBe('object');
  expect(v.x).toBe(-1.5);
  expect(v.y).toBe(1);

  v = new Vector2(v);
  expect(typeof v).toBe('object');
  expect(v.x).toBe(-1.5);
  expect(v.y).toBe(1);

  v = new Vector2();
  expect(typeof v).toBe('object');
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);

});

test('accessors', () => {
  const v = new Vector2(-2.5, 2.5);

  expect(v.x).toBe(-2.5);
  expect(v.y).toBe(2.5);
});

test('add', () => {
  const a = new Vector2(-2.5, 2.5);
  const b = new Vector2(2.5, 2.5);
  const c = new Vector2(a).add(b);

  expect(a.x).toBe(-2.5);
  expect(a.y).toBe(2.5);

  expect(b.x).toBe(2.5);
  expect(b.y).toBe(2.5);

  expect(c.x).toBe(0.0);
  expect(c.y).toBe(5.0);

  expect(a !== c).toBe(true);
  expect(b !== c).toBe(true);
});


test('sub', () => {
  const a = new Vector2(-2.5, 2.5);
  const b = new Vector2(2.5, 2.5);
  const c = new Vector2(a).sub(b);

  expect(a.x).toBe(-2.5);
  expect(a.y).toBe(2.5);

  expect(b.x).toBe(2.5);
  expect(b.y).toBe(2.5);

  expect(c.x).toBe(-5.0);
  expect(c.y).toBe(0.0);

  expect(a !== c).toBe(true);
  expect(b !== c).toBe(true);
});

test('scale', () => {
  const a = new Vector2(1, 2);
  const b = new Vector2(a).scale(2);

  expect(a.x).toBe(1);
  expect(a.y).toBe(2);

  expect(b.x).toBe(2);
  expect(b.y).toBe(4);

  expect(a !== b).toBe(true);
});

test('normalize', () => {
  const a = new Vector2(2, 2);
  const b = new Vector2(a).normalize();
  const c = Math.sqrt(2) / 2;

  expect(a.x).toBe(2);
  expect(a.y).toBe(2);

  expect(Math.abs(b.x - c) < tolerance).toBe(true);
  expect(Math.abs(b.y - c) < tolerance).toBe(true);

  expect(Math.abs(b.length - 1) < tolerance).toBe(true);

  expect(a !== b).toBe(true);
});

