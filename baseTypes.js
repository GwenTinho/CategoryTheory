/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
const str = (s) => {
  if (typeof s !== 'string') throw new TypeError('s is not a string');
  return s;
};

const repeat = (s) => {
  s = str(s);
  return s + s;
};

// a function with a contract on the input or output is called a guarded function

const iden = (x) => x;

// every function is guarded by the identity

// any function A to B has its inputs pass one first contract on A and one contract on B

const typeOf = (type) => {
  type = str(type);
  return (p) => {
    if (typeof p !== type) throw new TypeError(`p is not a ${type}`);
    return p;
  };
};

// defining the other contracts:
const bool = typeOf('boolean');
const obj = typeOf('object');
const num = typeOf('number');
const undef = typeOf('undefined');

const arr = (p) => {
  if (!Array.isArray(p)) throw new TypeError('p should be an array');
  return p;
};

// contract to check arr of some type
const arrOf = (contract) => (array) => arr(array).map(contract);

// notice the contract on the input and the contract on the output
const inc = (x) => {
  x = num(x);
  return num(x + 1);
};

class Maybe {
  getOrElse(x) {
    if (x instanceof Some) return this.x;
    return x;
  }
}

class None extends Maybe {
  toString() {
    return 'None';
  }
}

const none = new None();

class Some extends Maybe {
  constructor(x) {
    super();
    this.x = x;
  }

  toString() {
    return `Some(${this.x})`;
  }
}

const some = (x) => new Some(x);

const maybe = (c) => (m) => {
  if (m instanceof None) return m;
  if (m instanceof Some) return some(c(m.x));
  throw new TypeError('m not of type None or Some');
};

const arrOfUnit = (c) => (x) => arrOf(c)([c(x)]);

const maybeUnit = (c) => (x) => maybe(c)(some(c(x)));

const arrOfFlatten = (c) => (aax) => arrOf(c)(arrOf(arrOf(c))(aax).reduce((acc, curr) => acc.concat(curr), []));

const maybeFlatten = (c) => (mmx) => {
  mmx = maybe(maybe(c))(mmx);
  if (mmx instanceof Some) {
    mmx = mmx.x;
  }
  return maybe(c)(mmx);
};

// terrible terrible terrible style but im following an 8 y/o yt series what can you expect
// ill change it once i fully grasp where he's going
Array.unit = (x) => [x];
Array.flatten = (c) => {
  if (c === undefined) {
    return iden;
  }
  return arrOfFlatten(c)(this);
};

Maybe.unit = some;
Maybe.flatten = (c) => {
  if (c === undefined) {
    return iden;
  }
  return maybeFlatten(c)(this);
};

const twice = (functor) => (c) => functor(functor(c));
const once = iden;
const zero = (functor) => (c) => c;
