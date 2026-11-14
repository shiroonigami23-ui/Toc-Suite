// core/build/mm.js — Moore and Mealy machines from descriptions.
//
//   "output 1 whenever the input so far ends with 101, otherwise 0"  → condition on the prefix
//        read so far, built with the English reader's DFA (Moore: output per state, Mealy:
//        output per transition), then minimised as a transducer
//   "sequence detector for 1011 (non-overlapping)"
//   "remainder of the binary number read so far mod 3", "number of a's mod 4"
//   complement, 2's complement / increment (least significant bit first), unit delay,
//   change detector, serial binary adder, symbol-for-symbol replacement
// Each machine is checked against an independent output function on all short inputs.

import * as FA from '../fa.js';

const D = (s) => String(s);

// ------------------------------------------------------------------ generic helpers

/** Mealy machine from a step function over a finite state set. */
function mealyFrom(alphabet, states, start, step, names) {
  const id = (s) => names?.(s) ?? 'q' + states.indexOf(s);
  return {
    type: 'MEALY', alphabet: [...alphabet],
    states: states.map(s => ({ id: id(s), initial: s === start })),
    transitions: states.flatMap(s => alphabet.map(a => { const [t, o] = step(s, a); return { from: id(s), to: id(t), symbol: a, output: D(o) }; })),
  };
}

/** Moore machine from a step function and an output function. */
function mooreFrom(alphabet, states, start, step, out) {
  const id = (s) => 'q' + states.indexOf(s);
  return {
    type: 'MOORE', alphabet: [...alphabet],
    states: states.map(s => ({ id: id(s), initial: s === start, output: D(out(s)) })),
    transitions: states.flatMap(s => alphabet.map(a => ({ from: id(s), to: id(step(s, a)), symbol: a }))),
  };
}

/** Partition refinement for Moore (by output) or Mealy (by output per symbol). */
export function minimizeTransducer(m) {
  const reach = new Set([m.states.find(s => s.initial).id]);
  for (let ch = true; ch;) { ch = false; for (const t of m.transitions) if (reach.has(t.from) && !reach.has(t.to)) { reach.add(t.to); ch = true; } }
  const states = m.states.filter(s => reach.has(s.id));
  const A = m.alphabet;
  const tr = new Map(m.transitions.map(t => [t.from + '\u0000' + t.symbol, t]));
  const sig0 = (s) => (m.type === 'MOORE' ? s.output : A.map(a => tr.get(s.id + '\u0000' + a)?.output ?? '∅').join('\u0001'));
  let cls = new Map(states.map(s => [s.id, sig0(s)]));
  for (;;) {
    const sig = (s) => cls.get(s.id) + '|' + A.map(a => { const t = tr.get(s.id + '\u0000' + a); return t ? cls.get(t.to) : '∅'; }).join(',');
    const keys = new Map();
    const next = new Map(states.map(s => { const k = sig(s); if (!keys.has(k)) keys.set(k, 'c' + keys.size); return [s.id, keys.get(k)]; }));
    const count = new Set(next.values()).size;
    if (count === new Set(cls.values()).size) { cls = next; break; }
    cls = next;
  }
  // representatives in BFS order from the start
  const start = m.states.find(s => s.initial).id;
  const order = [];
  const seen = new Set();
  const q = [start];
  while (q.length) {
    const s = q.shift();
    const c = cls.get(s);
    if (seen.has(c)) continue;
    seen.add(c);
    order.push(s);
    for (const a of A) { const t = tr.get(s + '\u0000' + a); if (t && !seen.has(cls.get(t.to))) q.push(t.to); }
  }
  const name = new Map(order.map((s, i) => [cls.get(s), 'q' + i]));
  const rep = new Map(order.map(s => [cls.get(s), s]));
  return {
    ...m,
    states: order.map(s => { const st = m.states.find(x => x.id === s); return { id: name.get(cls.get(s)), initial: s === start, ...(m.type === 'MOORE' ? { output: st.output } : {}) }; }),
    transitions: [...rep.values()].flatMap(s => A.map(a => tr.get(s + '\u0000' + a)).filter(Boolean).map(t => ({ from: name.get(cls.get(t.from)), to: name.get(cls.get(t.to)), symbol: t.symbol, ...(m.type === 'MEALY' ? { output: t.output } : {}) }))),
  };
}

/** Mealy → Moore: one Moore state per (state, last output). `first` is λ(q0). */
export function mealyToMoore(m, first) {
  const A = m.alphabet;
  const tr = new Map(m.transitions.map(t => [t.from + '\u0000' + t.symbol, t]));
  const start = m.states.find(s => s.initial).id;
  const key = (s, o) => s + '\u0001' + o;
  const states = new Map([[key(start, first), { s: start, o: first }]]);
  const q = [key(start, first)];
  const trans = [];
  while (q.length) {
    const k = q.shift();
    const { s } = states.get(k);
    for (const a of A) {
      const t = tr.get(s + '\u0000' + a);
      if (!t) continue;
      const nk = key(t.to, t.output);
      if (!states.has(nk)) { states.set(nk, { s: t.to, o: t.output }); q.push(nk); }
      trans.push({ from: k, to: nk, symbol: a });
    }
  }
  const ids = new Map([...states.keys()].map((k, i) => [k, 'q' + i]));
  return minimizeTransducer({
    type: 'MOORE', alphabet: [...A],
    states: [...states.entries()].map(([k, v], i) => ({ id: ids.get(k), initial: i === 0, output: v.o })),
    transitions: trans.map(t => ({ from: ids.get(t.from), to: ids.get(t.to), symbol: t.symbol })),
  });
}

/** Moore/Mealy that outputs `yes` when the prefix read so far is in L(dfa), else `no`. */
export function fromDfa(dfa, kind, yes = '1', no = '0') {
  const n = dfa.delta.length;
  const states = [...Array(n).keys()];
  const step = (q, a) => dfa.delta[q][dfa.alphabet.indexOf(a)];
  const m = kind === 'MOORE'
    ? mooreFrom(dfa.alphabet, states, dfa.start, step, q => (dfa.accept[q] ? yes : no))
    : mealyFrom(dfa.alphabet, states, dfa.start, (q, a) => { const r = step(q, a); return [r, dfa.accept[r] ? yes : no]; });
  return minimizeTransducer(m);
}

// ------------------------------------------------------------------ reading the description

/** Output symbols: "outputs 1 … otherwise 0", "output Y/N", "prints A else B". */
export function readOutputs(t) {
  const yes = (t.match(/\b(?:outputs?|prints?|emits?|produces?|gives?|writes?|says?)\s+(?:a |an |the (?:symbol|value|letter|bit) )?['"]?([a-z0-9])['"]?(?=[\s,.;]|$)/i) || [])[1];
  const no = (t.match(/\b(?:otherwise|else|or else|elsewhere|in all other cases|and)\s+(?:it )?(?:outputs?|prints?|emits?|produces?|gives?|writes?)?\s*['"]?([a-z0-9])['"]?(?=[\s,.;)]|$)/i) || [])[1]
    || (t.match(/\boutputs?\s+['"]?[a-z0-9]['"]?\s*\/\s*['"]?([a-z0-9])['"]?/i) || [])[1];
  const slash = t.match(/\boutputs?\s+['"]?([a-z0-9])['"]?\s*\/\s*['"]?([a-z0-9])['"]?/i);
  if (slash) return { yes: slash[1], no: slash[2] };
  const y = yes ?? '1';
  return { yes: y, no: no && no !== y ? no : y === '1' ? '0' : y === 'y' ? 'n' : y === 'Y' ? 'N' : y === 'a' ? 'b' : y === 'A' ? 'B' : y === 'x' ? 'n' : '0' };
}

/**
 * Pull the condition on the input-so-far out of a Moore/Mealy description and rewrite it as an
 * English language description the DFA reader understands. Returns null if none found.
 */
export function conditionText(t) {
  let s = t.toLowerCase().replace(/[“”"]/g, "'");
  let nonOverlap = /\bnon[- ]?overlapping\b/.test(s);
  const seq = s.match(/\b(?:sequence|pattern) detector (?:for|of|that detects|to detect)?\s*(?:the )?(?:sequence |pattern |string )?'?([a-z0-9]+)'?/) ||
    s.match(/\b(?:detects?|detecting|recogni[sz]es?|spots?) (?:the |an? )?(?:sequence|pattern|string|substring|occurrences? of)?\s*'?([a-z0-9]{2,})'?/) ||
    s.match(/\b(?:last|previous|most recent) (?:\w+ )?(?:inputs?|symbols?|bits?|characters?) (?:are|were|is|equal|form|spell)\s*'?([a-z0-9]+)'?/) ||
    s.match(/\b(?:has just|just) (?:read|seen|received) '?([a-z0-9]+)'?/);
  if (seq) return { cond: `ending with ${seq[1]}`, pattern: seq[1], nonOverlap };
  const m = s.match(/\b(?:when|whenever|if|iff|only if|each time|every time|while|as long as|provided)\b\s+(.*?)(?:,?\s*(?:and\s+)?(?:otherwise|else|or else|in all other cases)\b.*)?$/);
  if (!m) return null;
  let cond = m[1]
    .replace(/\b(?:it|the machine)\s+/g, '')
    .replace(/\b(?:outputs?|prints?)\s+['"]?[a-z0-9]['"]?.*$/, '')
    .replace(/\bthe (?:input|string|prefix)(?: read)?(?: so far)?\s+(?:has|contains)\b/, 'containing')
    .replace(/\b(?:the )?(?:input|string|prefix|word)\s+(?:read\s+)?(?:so far|until now|up to now|seen so far)\s*/g, '')
    .replace(/\b(?:so far|until now|up to now|seen so far|read so far)\b/g, '')
    .replace(/\bhas (?:seen|read|received)\b/g, 'containing')
    .replace(/\bthe input\b/g, '')
    .trim();
  if (!cond) return null;
  return { cond, nonOverlap };
}

/** remainder / counter machines */
export function readRemainder(t) {
  const s = t.toLowerCase();
  const k = +((s.match(/\b(?:mod(?:ulo)?|divided by|remainder (?:of|when)[^.]*?(?:by|mod))\s*(\d+)/) || [])[1] || 0);
  if (!k || k > 10 || !/\bremainder|\bresidue|\bmod(?:ulo)?\b/.test(s)) return null;
  const count = s.match(/\b(?:number|count) of\s+'?([a-z0-9])'?(?:'s|s)?\b/);
  if (count) return { kind: 'count', k, sym: count[1] };
  const base = /\bdecimal\b/.test(s) ? 10 : /\bternary\b/.test(s) ? 3 : 2;
  return { kind: 'value', k, base };
}

// ------------------------------------------------------------------ constructions

export function remainderMachine(spec, kind, alphabet) {
  const states = [...Array(spec.k).keys()];
  const digits = alphabet.map(a => (/^\d$/.test(a) ? +a : alphabet.indexOf(a)));
  const step = spec.kind === 'value'
    ? (r, a) => (r * spec.base + digits[alphabet.indexOf(a)]) % spec.k
    : (r, a) => (a === spec.sym ? (r + 1) % spec.k : r);
  return kind === 'MOORE'
    ? mooreFrom(alphabet, states, 0, step, r => r)
    : mealyFrom(alphabet, states, 0, (r, a) => { const x = step(r, a); return [x, x]; });
}
export function remainderOracle(spec, kind, alphabet) {
  const digits = (a) => (/^\d$/.test(a) ? +a : alphabet.indexOf(a));
  return (w) => {
    let r = 0, out = kind === 'MOORE' ? '0' : '';
    for (const a of w) { r = spec.kind === 'value' ? (r * spec.base + digits(a)) % spec.k : (a === spec.sym ? (r + 1) % spec.k : r); out += r; }
    return out;
  };
}

/** Non-overlapping detector: KMP automaton that restarts after each match. */
export function detectorDfa(pattern, alphabet) {
  const m = pattern.length;
  const step = (q, a) => {
    if (q === m) q = 0;
    const s = pattern.slice(0, q) + a;
    for (let len = Math.min(m, s.length); len >= 0; len--) if (pattern.startsWith(s.slice(s.length - len))) return len;
    return 0;
  };
  return { alphabet: [...alphabet], start: 0, accept: [...Array(m + 1).keys()].map(q => q === m), delta: [...Array(m + 1).keys()].map(q => alphabet.map(a => step(q, a))) };
}

/** Transducer tasks (complement, 2's complement, increment, delay, change, same, serial adder). */
export function opMachine(op, kind, outs = {}) {
  const flip = (c) => (c === '0' ? '1' : '0');
  let mealy, first = '0', oracle;
  switch (op) {
    case 'complement':
      mealy = mealyFrom(['0', '1'], [0], 0, (s, a) => [0, flip(a)]);
      oracle = (w) => [...w].map(flip).join('');
      break;
    case 'twos':
      mealy = mealyFrom(['0', '1'], [0, 1], 0, (s, a) => (s === 0 ? [a === '1' ? 1 : 0, a] : [1, flip(a)]));
      oracle = (w) => { let seen = false, o = ''; for (const a of w) { o += seen ? flip(a) : a; if (a === '1') seen = true; } return o; };
      break;
    case 'inc':
      mealy = mealyFrom(['0', '1'], [1, 0], 1, (c, a) => { const s = +a + c; return [s >> 1, s & 1]; }, (c) => (c ? 'carry' : 'done'));
      oracle = (w) => { let c = 1, o = ''; for (const a of w) { const s = +a + c; o += s & 1; c = s >> 1; } return o; };
      break;
    case 'delay':
      mealy = mealyFrom(['0', '1'], ['0', '1'], '0', (s, a) => [a, s]);
      oracle = (w) => ('0' + w).slice(0, w.length);
      break;
    case 'change':
      mealy = mealyFrom(['0', '1'], ['s', '0', '1'], 's', (s, a) => [a, s === 's' || s === a ? '0' : '1']);
      oracle = (w) => [...w].map((a, i) => (i > 0 && w[i - 1] !== a ? '1' : '0')).join('');
      break;
    case 'same':
      mealy = mealyFrom(['0', '1'], ['s', '0', '1'], 's', (s, a) => [a, s === a ? '1' : '0']);
      oracle = (w) => [...w].map((a, i) => (i > 0 && w[i - 1] === a ? '1' : '0')).join('');
      break;
    case 'serialadd': {
      const A = ['00', '01', '10', '11'];
      mealy = mealyFrom(A, [0, 1], 0, (c, a) => { const s = +a[0] + +a[1] + c; return [s >> 1, s & 1]; }, (c) => (c ? 'carry' : 'nocarry'));
      oracle = (w) => { let c = 0, o = ''; for (const a of w) { const s = +a[0] + +a[1] + c; o += s & 1; c = s >> 1; } return o; };
      break;
    }
    default: return null;
  }
  mealy = minimizeTransducer(mealy);
  if (kind === 'MEALY') return { machine: mealy, oracle };
  first = outs.first ?? '0';
  return { machine: mealyToMoore(mealy, first), oracle: (w) => first + oracle(w) };
}

/** Prefix-condition oracle for a DFA (overlapping) or a pattern detector. */
export function prefixOracle(dfa, kind, yes, no) {
  return (w) => {
    let q = dfa.start, out = kind === 'MOORE' ? (dfa.accept[q] ? yes : no) : '';
    for (const a of w) { q = dfa.delta[q][dfa.alphabet.indexOf(a)]; out += dfa.accept[q] ? yes : no; }
    return out;
  };
}
export function nonOverlapOracle(pattern, kind, yes, no) {
  return (w) => {
    let buf = '', out = kind === 'MOORE' ? (pattern === '' ? yes : no) : '';
    for (const a of w) { buf += a; if (buf.endsWith(pattern)) { out += yes; buf = ''; } else out += no; }
    return out;
  };
}

export { FA };
