// core/build/finite.js — DFA / NFA / ε-NFA output for regular languages.
//   DFA   : the minimal DFA from the English reader (complete, trap state kept)
//   NFA   : Glushkov (position) automaton of a regular expression for the language, when
//           that is smaller than the DFA; otherwise the minimal DFA (a DFA is an NFA)
//   ε-NFA : Thompson's construction for short expressions, or ε-branches into one machine
//           per alternative of an "or" description
// The result is always checked for exact language equality with the reader's DFA.

import * as FA from '../fa.js';
import { parseRegex, regexToEnfa, regexToDfa } from '../regex.js';

const esc = (w) => w.split('').join('');
const sigmaRe = (A) => `(${A.join('|')})`;

/** A regular expression for simple single-condition descriptions (unions allowed). */
export function regexFromReading(r) {
  if (r.regex) return r.regex.replace(/Σ/g, sigmaRe(r.alphabet));
  const S = sigmaRe(r.alphabet) + '*';
  const parts = [];
  const ok = r.clauses.filter(c => c.intent !== 'FILLER');
  if (!ok.length) return null;
  // the reader splits disjuncts on "or"; when there are as many clauses as disjuncts we can union them
  for (const c of ok) {
    if (c.negated || !c.slots) return null;
    const s = c.slots;
    switch (c.intent) {
      case 'STARTS': parts.push(`${esc(s.w)}${S}`); break;
      case 'ENDS': parts.push(`${S}${esc(s.w)}`); break;
      case 'CONTAINS': parts.push(`${S}${esc(s.w)}${S}`); break;
      case 'EXACT': parts.push(s.w.split('|').map(esc).join('|')); break;
      case 'NTH_END': parts.push(`${S}${s.c}${sigmaRe(r.alphabet).repeat(s.n - 1)}`); break;
      case 'NTH_START': parts.push(`${sigmaRe(r.alphabet).repeat(s.n - 1)}${s.c}${S}`); break;
      default: return null;
    }
  }
  const src = parts.length > 1 ? parts.map(p => `(${p})`).join('|') : parts[0];
  try {
    const d = regexToDfa(src, r.alphabet);
    return FA.compare(d, r.dfa).equivalent ? src : null;
  } catch { return null; }
}

/** Glushkov / position automaton: ε-free NFA with one state per symbol occurrence (+ start). */
export function glushkov(src, alphabet) {
  const ast = parseRegex(src);
  const pos = [];   // symbol of each position
  const walk = (n) => {
    switch (n.t) {
      case 'eps': return { nullable: true, first: [], last: [], follow: [] };
      case 'empty': return { nullable: false, first: [], last: [], follow: [], empty: true };
      case 'sym': { const p = pos.length; pos.push(n.c); return { nullable: false, first: [p], last: [p], follow: [] }; }
      case 'or': {
        const a = walk(n.a), b = walk(n.b);
        return { nullable: a.nullable || b.nullable, first: [...a.first, ...b.first], last: [...a.last, ...b.last], follow: [...a.follow, ...b.follow] };
      }
      case 'cat': {
        const a = walk(n.a), b = walk(n.b);
        const follow = [...a.follow, ...b.follow];
        for (const x of a.last) for (const y of b.first) follow.push([x, y]);
        return { nullable: a.nullable && b.nullable, first: a.nullable ? [...a.first, ...b.first] : a.first, last: b.nullable ? [...a.last, ...b.last] : b.last, follow };
      }
      case 'star': {
        const a = walk(n.a);
        const follow = [...a.follow];
        for (const x of a.last) for (const y of a.first) follow.push([x, y]);
        return { nullable: true, first: a.first, last: a.last, follow };
      }
      default: throw new Error('bad regex node');
    }
  };
  const r = walk(ast);
  const id = (p) => 'q' + (p + 1);
  const states = [{ id: 'q0', initial: true, accepting: r.nullable }, ...pos.map((_, p) => ({ id: id(p), initial: false, accepting: r.last.includes(p) }))];
  const key = new Set();
  const transitions = [];
  const add = (from, to, symbol) => { const k = `${from}>${to}>${symbol}`; if (!key.has(k)) { key.add(k); transitions.push({ from, to, symbol }); } };
  for (const p of r.first) add('q0', id(p), pos[p]);
  for (const [x, y] of r.follow) add(id(x), id(y), pos[y]);
  return { type: 'NFA', states, transitions, alphabet: [...new Set([...(alphabet || []), ...pos])].sort() };
}

/** Thompson's construction without the extra states for concatenation and star. */
export function compactThompson(src, alphabet) {
  const ast = parseRegex(src);
  let n = 0;
  const trans = [];
  const st = () => n++;
  const build = (node) => {
    switch (node.t) {
      case 'eps': { const s = st(); return [s, s]; }
      case 'empty': { const s = st(), f = st(); return [s, f]; }
      case 'sym': { const s = st(), f = st(); trans.push([s, f, node.c]); return [s, f]; }
      case 'cat': { const A = build(node.a), B = build(node.b); trans.push([A[1], B[0], 'ε']); return [A[0], B[1]]; }
      case 'or': { const s = st(), f = st(); const A = build(node.a), B = build(node.b); trans.push([s, A[0], 'ε'], [s, B[0], 'ε'], [A[1], f, 'ε'], [B[1], f, 'ε']); return [s, f]; }
      case 'star': { const s = st(); const A = build(node.a); trans.push([s, A[0], 'ε'], [A[1], s, 'ε']); return [s, s]; }
      default: throw new Error('bad regex node');
    }
  };
  const [s, f] = build(ast);
  return {
    type: 'ENFA',
    states: Array.from({ length: n }, (_, i) => ({ id: 'q' + i, initial: i === s, accepting: i === f })),
    transitions: trans.map(([a, b, c]) => ({ from: 'q' + a, to: 'q' + b, symbol: c })),
    alphabet: [...new Set([...(alphabet || []), ...trans.map(t => t[2]).filter(c => c !== 'ε')])].sort(),
  };
}

/** Greedily merge pairs of states while the language stays exactly the same. */
export function reduceNfa(m, dfa, { keepEps = false } = {}) {
  let cur = m;
  const same = (x) => FA.compare(FA.toMinimalDfa(x, dfa.alphabet), dfa).equivalent;
  for (let changed = true; changed;) {
    changed = false;
    const ids = cur.states.map(s => s.id);
    outer: for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i], b = ids[j];
      const keep = cur.states.find(s => s.id === a), drop = cur.states.find(s => s.id === b);
      const seen = new Set();
      const transitions = [];
      for (const t of cur.transitions) {
        const x = { ...t, from: t.from === b ? a : t.from, to: t.to === b ? a : t.to };
        if (x.from === x.to && FA.isEpsilon(x.symbol)) continue;
        const k = `${x.from}>${x.to}>${x.symbol}`;
        if (!seen.has(k)) { seen.add(k); transitions.push(x); }
      }
      const cand = {
        ...cur,
        states: cur.states.filter(s => s.id !== b).map(s => (s.id === a ? { ...s, initial: keep.initial || drop.initial, accepting: keep.accepting || drop.accepting } : s)),
        transitions,
      };
      if (cand.states.filter(s => s.initial).length !== 1) continue;
      if (keepEps && !transitions.some(t => FA.isEpsilon(t.symbol))) continue;
      if (same(cand)) { cur = cand; changed = true; break outer; }
    }
  }
  return renumber(trim(cur));
}

/** Drop states that cannot reach an accepting state (keeps the start state). */
function trim(m) {
  const acc = new Set(m.states.filter(s => s.accepting).map(s => s.id));
  for (let ch = true; ch;) { ch = false; for (const t of m.transitions) if (acc.has(t.to) && !acc.has(t.from)) { acc.add(t.from); ch = true; } }
  const start = m.states.find(s => s.initial).id;
  acc.add(start);
  return { ...m, states: m.states.filter(s => acc.has(s.id)), transitions: m.transitions.filter(t => acc.has(t.from) && acc.has(t.to)) };
}

function renumber(m) {
  const order = [m.states.find(s => s.initial), ...m.states.filter(s => !s.initial)];
  const map = new Map(order.map((s, i) => [s.id, 'q' + i]));
  return { ...m, states: order.map(s => ({ ...s, id: map.get(s.id) })), transitions: m.transitions.map(t => ({ ...t, from: map.get(t.from), to: map.get(t.to) })) };
}

/**
 * Build a finite automaton of the requested type for a reading `r` of the English reader.
 * @returns {{ machine, how: string }}
 */
export function buildFinite(r, type, { keepDead = true, title } = {}) {
  const dfaMachine = FA.toAppMachine(r.dfa, { keepDead, title });
  if (type === 'DFA') return { machine: dfaMachine, how: `minimal DFA (${dfaMachine.states.length} states${keepDead ? ', complete' : ''})` };
  const src = regexFromReading(r);
  const dfaSize = FA.toAppMachine(r.dfa, { keepDead: false }).states.length;
  const pretty = (x) => x.replace(new RegExp(sigmaRe(r.alphabet).replace(/[()|]/g, '\\$&'), 'g'), 'Σ');
  if (type === 'NFA') {
    if (src) {
      const g = reduceNfa(renumber(trim(glushkov(src, r.alphabet))), r.dfa);
      if (g.states.length < dfaSize || (g.states.length === dfaSize && g.transitions.length < FA.toAppMachine(r.dfa, { keepDead: false }).transitions.length)) {
        return { machine: { ...g, title }, how: `position (Glushkov) automaton of ${pretty(src)}, with equivalent states merged` };
      }
    }
    const m = FA.toAppMachine(r.dfa, { keepDead: false, title });
    return { machine: { ...m, type: 'NFA' }, how: 'the minimal DFA without its trap state (every DFA is an NFA, and no smaller NFA was found)' };
  }
  // ε-NFA
  if (src) {
    let th = renumber(trim(compactThompson(src, r.alphabet)));
    if (th.states.length > 10) th = reduceNfa(th, r.dfa, { keepEps: true });
    if (th.states.length <= 16) return { machine: { ...th, type: 'ENFA', alphabet: r.alphabet, title }, how: `Thompson-style construction for ${pretty(src)}` };
  }
  // one machine per "or" alternative, joined by ε-moves from a new start state
  const alts = r.alternatives || [];
  if (alts.length > 1) {
    const states = [{ id: 'q0', initial: true, accepting: false }];
    const transitions = [];
    let k = 1;
    for (const d of alts) {
      const m = FA.toAppMachine(d, { keepDead: false });
      const map = new Map(m.states.map(s => [s.id, 'q' + k++]));
      for (const s of m.states) states.push({ id: map.get(s.id), initial: false, accepting: s.accepting });
      for (const t of m.transitions) transitions.push({ from: map.get(t.from), to: map.get(t.to), symbol: t.symbol });
      transitions.push({ from: 'q0', to: map.get(m.states.find(s => s.initial).id), symbol: 'ε' });
    }
    return { machine: { type: 'ENFA', title, alphabet: r.alphabet, states, transitions }, how: 'one automaton per alternative, joined by ε-moves' };
  }
  const m = FA.toAppMachine(r.dfa, { keepDead: false, title });
  return { machine: { ...m, type: 'ENFA' }, how: 'the minimal DFA (no ε-moves are needed for this language)' };
}

/** Exact check: the machine's language equals the reading's DFA. */
export function verifyFinite(machine, dfa) {
  const d = FA.toMinimalDfa(machine, dfa.alphabet);
  return FA.compare(d, dfa);
}
