// core/regex.js — textbook regular expressions → ε-NFA (Thompson) → minimal DFA.
// Syntax: symbols are single letters/digits; union is `+` or `|`; `*` star; `?` optional;
// parentheses; `ε` (or `eps`) for the empty string; `∅` for the empty language.
// Whitespace is ignored. Concatenation is implicit: (a+b)*abb

import { determinize, minimize, EPS } from './fa.js';

class Parser {
  constructor(src) {
    this.s = String(src).replace(/eps(ilon)?/g, EPS).replace(/λ/g, EPS).replace(/\s+/g, '');
    this.i = 0;
  }
  peek() { return this.s[this.i]; }
  eat(c) { if (this.s[this.i] === c) { this.i++; return true; } return false; }
  fail(msg) { throw new SyntaxError(`${msg} at position ${this.i + 1} in "${this.s}"`); }

  parse() {
    if (this.s.length === 0) return { t: 'eps' };
    const node = this.union();
    if (this.i < this.s.length) this.fail(`Unexpected '${this.peek()}'`);
    return node;
  }
  union() {
    let left = this.concat();
    while (this.peek() === '+' || this.peek() === '|') {
      this.i++;
      left = { t: 'or', a: left, b: this.concat() };
    }
    return left;
  }
  concat() {
    let node = null;
    while (this.i < this.s.length && !['+', '|', ')'].includes(this.peek())) {
      const f = this.postfix();
      node = node ? { t: 'cat', a: node, b: f } : f;
    }
    if (!node) this.fail('Missing operand');
    return node;
  }
  postfix() {
    let node = this.atom();
    for (;;) {
      if (this.eat('*')) node = { t: 'star', a: node };
      else if (this.eat('?')) node = { t: 'or', a: node, b: { t: 'eps' } };
      else if (this.peek() === '^' && this.s[this.i + 1] === '+') { this.i += 2; node = { t: 'cat', a: node, b: { t: 'star', a: node } }; }
      else break;
    }
    return node;
  }
  atom() {
    const c = this.peek();
    if (c === undefined) this.fail('Unexpected end');
    if (this.eat('(')) {
      if (this.eat(')')) return { t: 'eps' };
      const n = this.union();
      if (!this.eat(')')) this.fail("Missing ')'");
      return n;
    }
    if (c === EPS) { this.i++; return { t: 'eps' }; }
    if (c === '∅') { this.i++; return { t: 'empty' }; }
    if (/[A-Za-z0-9#$@&]/.test(c)) { this.i++; return { t: 'sym', c }; }
    this.fail(`Unexpected '${c}'`);
  }
}

export function parseRegex(src) {
  return new Parser(src).parse();
}

/** Thompson construction → app-format ε-NFA (states q0..qn). */
export function regexToEnfa(src) {
  const ast = parseRegex(src);
  let n = 0;
  const trans = [];
  const st = () => n++;
  const build = (node) => {
    const s = st(), f = st();
    switch (node.t) {
      case 'eps': trans.push([s, f, EPS]); break;
      case 'empty': break;
      case 'sym': trans.push([s, f, node.c]); break;
      case 'cat': {
        const A = build(node.a), B = build(node.b);
        trans.push([s, A[0], EPS], [A[1], B[0], EPS], [B[1], f, EPS]);
        break;
      }
      case 'or': {
        const A = build(node.a), B = build(node.b);
        trans.push([s, A[0], EPS], [s, B[0], EPS], [A[1], f, EPS], [B[1], f, EPS]);
        break;
      }
      case 'star': {
        const A = build(node.a);
        trans.push([s, f, EPS], [s, A[0], EPS], [A[1], A[0], EPS], [A[1], f, EPS]);
        break;
      }
      default: throw new Error('bad node ' + node.t);
    }
    return [s, f];
  };
  const [s, f] = build(ast);
  const states = Array.from({ length: n }, (_, i) => ({ id: 'q' + i, initial: i === s, accepting: i === f }));
  const transitions = trans.map(([a, b, c]) => ({ from: 'q' + a, to: 'q' + b, symbol: c }));
  const alphabet = [...new Set(trans.map(t => t[2]).filter(c => c !== EPS))].sort();
  return { type: 'ENFA', states, transitions, alphabet };
}

/** Regex → minimal complete DFA (internal format). */
export function regexToDfa(src, alphabet) {
  const enfa = regexToEnfa(src);
  const sigma = alphabet ? [...new Set([...alphabet, ...enfa.alphabet])].sort() : enfa.alphabet;
  return minimize(determinize(enfa, sigma));
}
