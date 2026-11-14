// core/fa.js — pure finite-automata algorithms (no DOM). Used by the studios and the Assistant.
//
// Internal DFA format (compact, fast):
//   { alphabet: string[], start: number, accept: boolean[], delta: number[][] }   delta[state][symbolIndex] -> state
// App machine format (what the studios store and render):
//   { type, states: [{id, initial, accepting, x, y}], transitions: [{from, to, symbol}], alphabet }
//
// A transition symbol may be a comma list ("a,b") in drawn machines; it is split everywhere.

export const EPS = 'ε';

export function isEpsilon(sym) {
  return sym === '' || sym === EPS || sym === 'eps' || sym === 'epsilon' || sym === 'λ' || sym === 'ϵ' || sym === '_EPSILON_';
}

/** Split "a,b" / "a, b" labels into individual symbols. */
export function splitSymbols(label) {
  if (label === undefined || label === null) return [EPS];
  const s = String(label);
  if (s === '' ) return [EPS];
  return s.split(',').map(x => x.trim()).map(x => (isEpsilon(x) ? EPS : x)).filter(x => x.length > 0);
}

/** Alphabet of an app machine: declared alphabet ∪ symbols used on transitions (ε excluded). */
export function machineAlphabet(machine) {
  const set = new Set((machine.alphabet || []).map(String).filter(a => a && !isEpsilon(a)));
  for (const t of machine.transitions || []) {
    for (const s of splitSymbols(t.symbol)) if (s !== EPS) set.add(s);
  }
  return [...set].sort();
}

// ------------------------------------------------------------------ NFA → DFA

/** Subset construction from an app machine (DFA/NFA/ε-NFA). Result is complete over `alphabet`. */
export function determinize(machine, alphabet = machineAlphabet(machine)) {
  const ids = (machine.states || []).map(s => s.id);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const n = ids.length;
  const eps = Array.from({ length: n }, () => []);
  const move = Array.from({ length: n }, () => new Map());
  for (const t of machine.transitions || []) {
    const a = idx.get(t.from), b = idx.get(t.to);
    if (a === undefined || b === undefined) continue;
    for (const s of splitSymbols(t.symbol)) {
      if (s === EPS) eps[a].push(b);
      else {
        if (!move[a].has(s)) move[a].set(s, []);
        move[a].get(s).push(b);
      }
    }
  }
  const closure = (set) => {
    const out = new Set(set);
    const stack = [...set];
    while (stack.length) {
      const q = stack.pop();
      for (const r of eps[q]) if (!out.has(r)) { out.add(r); stack.push(r); }
    }
    return [...out].sort((x, y) => x - y);
  };
  const acceptingNfa = new Set((machine.states || []).filter(s => s.accepting).map(s => idx.get(s.id)));
  const starts = (machine.states || []).filter(s => s.initial).map(s => idx.get(s.id));
  const keyOf = (arr) => arr.join(',');
  const startSet = closure(starts);
  const sets = [startSet];
  const keys = new Map([[keyOf(startSet), 0]]);
  const delta = [];
  for (let i = 0; i < sets.length; i++) {
    const row = [];
    for (const sym of alphabet) {
      const next = new Set();
      for (const q of sets[i]) for (const r of (move[q].get(sym) || [])) next.add(r);
      const cl = closure([...next]);
      const k = keyOf(cl);
      if (!keys.has(k)) { keys.set(k, sets.length); sets.push(cl); }
      row.push(keys.get(k));
    }
    delta.push(row);
  }
  const accept = sets.map(set => set.some(q => acceptingNfa.has(q)));
  const labels = sets.map(set => '{' + set.map(q => ids[q]).join(',') + '}');
  return { alphabet: [...alphabet], start: 0, accept, delta, labels };
}

/** Make a DFA total over `alphabet` (adds a dead state if needed) and re-index symbols. */
export function withAlphabet(dfa, alphabet) {
  const pos = new Map(dfa.alphabet.map((a, i) => [a, i]));
  const n = dfa.delta.length;
  let dead = -1;
  const delta = dfa.delta.map(row => alphabet.map(a => {
    const j = pos.get(a);
    if (j === undefined || row[j] === undefined || row[j] < 0) { if (dead < 0) dead = n; return dead; }
    return row[j];
  }));
  const accept = [...dfa.accept];
  if (dead >= 0) { delta.push(alphabet.map(() => dead)); accept.push(false); }
  return { alphabet: [...alphabet], start: dfa.start, accept, delta };
}

export function accepts(dfa, word) {
  let q = dfa.start;
  const pos = new Map(dfa.alphabet.map((a, i) => [a, i]));
  for (const ch of tokens(word, dfa.alphabet)) {
    const j = pos.get(ch);
    if (j === undefined) return false;
    q = dfa.delta[q][j];
    if (q === undefined || q < 0) return false;
  }
  return !!dfa.accept[q];
}

/** Split a word into symbols; supports multi-character symbols by greedy longest match. */
export function tokens(word, alphabet) {
  if (Array.isArray(word)) return word;
  const w = String(word ?? '');
  if (w === '' || isEpsilon(w)) return [];
  if (alphabet.every(a => a.length === 1)) return [...w];
  const sorted = [...alphabet].sort((a, b) => b.length - a.length);
  const out = [];
  let i = 0;
  while (i < w.length) {
    const m = sorted.find(a => w.startsWith(a, i));
    if (!m) { out.push(w[i]); i++; } else { out.push(m); i += m.length; }
  }
  return out;
}

// ------------------------------------------------------------------ minimisation

export function reachable(dfa) {
  const seen = new Set([dfa.start]);
  const order = [dfa.start];
  for (let i = 0; i < order.length; i++) {
    for (const r of dfa.delta[order[i]]) if (!seen.has(r)) { seen.add(r); order.push(r); }
  }
  return order;
}

/** Minimal complete DFA (Moore partition refinement), states renumbered in BFS order from start. */
export function minimize(dfa) {
  const order = reachable(dfa);
  const k = dfa.alphabet.length;
  // Partition refinement: block id per state, iterate until stable.
  let block = new Map(order.map(q => [q, dfa.accept[q] ? 1 : 0]));
  for (;;) {
    const sig = new Map();
    const next = new Map();
    for (const q of order) {
      const key = block.get(q) + '|' + dfa.delta[q].map(r => block.get(r)).join(',');
      if (!sig.has(key)) sig.set(key, sig.size);
      next.set(q, sig.get(key));
    }
    const before = new Set(block.values()).size;
    block = next;
    if (sig.size === before) break;
  }
  // Build quotient in BFS order so state numbering is canonical.
  const startB = block.get(dfa.start);
  const newId = new Map([[startB, 0]]);
  const repr = [dfa.start];
  for (let i = 0; i < repr.length; i++) {
    for (let j = 0; j < k; j++) {
      const b = block.get(dfa.delta[repr[i]][j]);
      if (!newId.has(b)) { newId.set(b, repr.length); repr.push(dfa.delta[repr[i]][j]); }
    }
  }
  return {
    alphabet: [...dfa.alphabet],
    start: 0,
    accept: repr.map(q => !!dfa.accept[q]),
    delta: repr.map(q => dfa.delta[q].map(r => newId.get(block.get(r)))),
  };
}

// ------------------------------------------------------------------ boolean operations

function unify(a, b) {
  const alphabet = [...new Set([...a.alphabet, ...b.alphabet])].sort();
  return [withAlphabet(a, alphabet), withAlphabet(b, alphabet), alphabet];
}

/** Product automaton with an acceptance combiner (and / or / xor / diff). */
export function product(a0, b0, op) {
  const [a, b, alphabet] = unify(a0, b0);
  const f = { and: (x, y) => x && y, or: (x, y) => x || y, xor: (x, y) => x !== y, diff: (x, y) => x && !y }[op] || op;
  const key = (p, q) => p * b.delta.length + q;
  const ids = new Map([[key(a.start, b.start), 0]]);
  const pairs = [[a.start, b.start]];
  const delta = [];
  for (let i = 0; i < pairs.length; i++) {
    const [p, q] = pairs[i];
    delta.push(alphabet.map((_, j) => {
      const np = a.delta[p][j], nq = b.delta[q][j];
      const kk = key(np, nq);
      if (!ids.has(kk)) { ids.set(kk, pairs.length); pairs.push([np, nq]); }
      return ids.get(kk);
    }));
  }
  return { alphabet, start: 0, accept: pairs.map(([p, q]) => !!f(a.accept[p], b.accept[q])), delta, pairs };
}

export const intersect = (a, b) => minimize(product(a, b, 'and'));
export const union = (a, b) => minimize(product(a, b, 'or'));
export const difference = (a, b) => minimize(product(a, b, 'diff'));
export function complement(dfa, alphabet = dfa.alphabet) {
  const t = withAlphabet(dfa, alphabet);
  return minimize({ ...t, accept: t.accept.map(x => !x) });
}

/** Shortest word accepted by the DFA (BFS), or null if the language is empty. */
export function shortestAccepted(dfa) {
  const prev = new Map([[dfa.start, null]]);
  const queue = [dfa.start];
  for (let i = 0; i < queue.length; i++) {
    const q = queue[i];
    if (dfa.accept[q]) {
      const word = [];
      let cur = q;
      while (prev.get(cur)) { const [p, sym] = prev.get(cur); word.unshift(sym); cur = p; }
      return word;
    }
    dfa.delta[q].forEach((r, j) => {
      if (!prev.has(r)) { prev.set(r, [q, dfa.alphabet[j]]); queue.push(r); }
    });
  }
  return null;
}

export const isEmpty = (dfa) => shortestAccepted(dfa) === null;

/**
 * Compare two DFAs. Returns { equivalent, counterexample, acceptedBy }:
 * counterexample is the shortest word on which they disagree; acceptedBy is 'a' or 'b'.
 */
export function compare(a, b) {
  const x = product(a, b, 'xor');
  const w = shortestAccepted(x);
  if (!w) return { equivalent: true, counterexample: null, acceptedBy: null };
  const [aa] = unify(a, b);
  return { equivalent: false, counterexample: w, acceptedBy: accepts(aa, w) ? 'a' : 'b' };
}

/** Enumerate accepted words in shortlex order (for previews), up to `limit` words / `maxLen`. */
export function sampleWords(dfa, { limit = 8, maxLen = 8, accepted = true } = {}) {
  const out = [];
  let frontier = [[dfa.start, []]];
  for (let len = 0; len <= maxLen && out.length < limit; len++) {
    const next = [];
    for (const [q, w] of frontier) {
      if (!!dfa.accept[q] === accepted && out.length < limit) out.push(w.join(''));
      if (len < maxLen) dfa.delta[q].forEach((r, j) => next.push([r, [...w, dfa.alphabet[j]]]));
    }
    frontier = next;
    if (frontier.length > 20000) break;
  }
  return out;
}

// ------------------------------------------------------------------ conversions to/from the app

/** App machine (any FA type) → minimal complete DFA over `alphabet`. */
export function toMinimalDfa(machine, alphabet = machineAlphabet(machine)) {
  return minimize(determinize(machine, alphabet));
}

/** Is the dead (non-accepting sink) state of a DFA? */
export function deadStates(dfa) {
  const n = dfa.delta.length;
  const canAccept = new Array(n).fill(false);
  dfa.accept.forEach((x, i) => { if (x) canAccept[i] = true; });
  let changed = true;
  while (changed) {
    changed = false;
    for (let q = 0; q < n; q++) if (!canAccept[q] && dfa.delta[q].some(r => canAccept[r])) { canAccept[q] = true; changed = true; }
  }
  return canAccept.map(x => !x);
}

/**
 * Internal DFA → app machine. Dead states are dropped unless `keepDead` (a partial DFA is the
 * usual textbook drawing); states are named q0..qn in BFS order.
 */
export function toAppMachine(dfa, { keepDead = false, title = 'Untitled Automaton', prefix = 'q' } = {}) {
  const dead = deadStates(dfa);
  const keep = dfa.delta.map((_, q) => keepDead || !dead[q] || q === dfa.start);
  const name = new Map();
  let c = 0;
  for (const q of reachable(dfa)) if (keep[q]) name.set(q, prefix + (c++));
  const states = [...name.entries()].map(([q, id]) => ({ id, initial: q === dfa.start, accepting: !!dfa.accept[q] }));
  const grouped = new Map();
  for (const [q, from] of name) {
    dfa.delta[q].forEach((r, j) => {
      if (!name.has(r)) return;
      const key = from + '>' + name.get(r);
      if (!grouped.has(key)) grouped.set(key, { from, to: name.get(r), symbols: [] });
      grouped.get(key).symbols.push(dfa.alphabet[j]);
    });
  }
  // One transition object per symbol: the studios' validators and simulators expect single symbols.
  const transitions = [];
  for (const g of grouped.values()) for (const s of g.symbols) transitions.push({ from: g.from, to: g.to, symbol: s });
  return { type: 'DFA', title, alphabet: [...dfa.alphabet], states, transitions };
}

/** Basic structural problems of a drawn machine, independent of any target language. */
export function structuralIssues(machine) {
  const issues = [];
  const ids = new Set((machine.states || []).map(s => s.id));
  const initials = (machine.states || []).filter(s => s.initial);
  if (!machine.states || machine.states.length === 0) return [{ kind: 'empty', message: 'The canvas is empty.' }];
  if (initials.length === 0) issues.push({ kind: 'no-initial', message: 'No initial state is marked.' });
  if (initials.length > 1 && machine.type === 'DFA') issues.push({ kind: 'many-initial', message: 'A DFA must have exactly one initial state.' });
  const alphabet = machineAlphabet(machine);
  for (const s of machine.states) {
    const out = new Map();
    for (const t of machine.transitions || []) {
      if (t.from !== s.id) continue;
      if (!ids.has(t.to)) issues.push({ kind: 'dangling', state: s.id, message: `A transition from ${s.id} points to a missing state.` });
      for (const sym of splitSymbols(t.symbol)) {
        if (sym === EPS && machine.type === 'DFA') issues.push({ kind: 'epsilon', state: s.id, message: `${s.id} has an ε-move, which a DFA can't have.` });
        if (sym === EPS) continue;
        if (out.has(sym) && out.get(sym) !== t.to && machine.type === 'DFA')
          issues.push({ kind: 'nondeterministic', state: s.id, symbol: sym, message: `${s.id} has two different moves on '${sym}'.` });
        out.set(sym, t.to);
      }
    }
    if (machine.type === 'DFA') {
      const missing = alphabet.filter(a => !out.has(a));
      if (missing.length) issues.push({ kind: 'missing', state: s.id, symbols: missing, message: `${s.id} has no move on ${missing.map(m => `'${m}'`).join(', ')} (that input will be rejected).` });
    }
  }
  if (initials.length) {
    const seen = new Set([initials[0].id]);
    const st = [initials[0].id];
    while (st.length) {
      const q = st.pop();
      for (const t of machine.transitions || []) if (t.from === q && !seen.has(t.to)) { seen.add(t.to); st.push(t.to); }
    }
    for (const s of machine.states) if (!seen.has(s.id)) issues.push({ kind: 'unreachable', state: s.id, message: `${s.id} can never be reached from the start state.` });
  }
  return issues;
}
