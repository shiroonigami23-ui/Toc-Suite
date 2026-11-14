// core/learn.js — learn a DFA from example strings (RPNI, red–blue state merging).
//
// Builds a prefix-tree acceptor from the accepted (+) and rejected (−) samples, then greedily
// merges states in canonical (shortlex) order whenever the merge stays consistent with every
// sample. With a characteristic sample it provably finds the target's minimal DFA; with fewer
// examples it returns the smallest-looking consistent machine, which is always 100% consistent
// with what you gave it.

import { minimize, accepts, tokens } from './fa.js';

class Tree {
  constructor() { this.child = [new Map()]; this.label = [0]; }   // label: 1 accept, -1 reject, 0 unknown
  add(word, lab) {
    let q = 0;
    for (const a of word) {
      if (!this.child[q].has(a)) { this.child.push(new Map()); this.label.push(0); this.child[q].set(a, this.child.length - 1); }
      q = this.child[q].get(a);
    }
    if (this.label[q] && this.label[q] !== lab) return false;
    this.label[q] = lab;
    return true;
  }
}

/** Folding merge on a copy; returns the new state or null if inconsistent. */
function tryMerge(st, red, blue) {
  const rep = [...st.rep];
  const label = [...st.label];
  const child = st.child.map(m => new Map(m));
  const find = (x) => { while (rep[x] !== x) { rep[x] = rep[rep[x]]; x = rep[x]; } return x; };
  // redirect the parent edge of blue to red
  const [p, a] = st.parent[blue];
  child[find(p)].set(a, red);
  const stack = [[red, blue]];
  while (stack.length) {
    let [r, b] = stack.pop();
    r = find(r); b = find(b);
    if (r === b) continue;
    if (label[r] && label[b] && label[r] !== label[b]) return null;
    if (!label[r]) label[r] = label[b];
    rep[b] = r;
    for (const [sym, cb] of child[b]) {
      if (child[r].has(sym)) stack.push([child[r].get(sym), cb]);
      else child[r].set(sym, cb);
    }
  }
  return { rep, label, child, parent: st.parent };
}

/**
 * @param {string[]} positive accepted examples ('' = empty string)
 * @param {string[]} negative rejected examples
 * @param {string[]} [alphabet] defaults to the symbols seen
 * @returns {{ok:boolean, dfa?:object, error?:string, stats?:object}}
 */
export function learnDfa(positive, negative, alphabet) {
  const sigma = alphabet && alphabet.length ? [...alphabet] : [...new Set([...positive, ...negative].join(''))].sort();
  const tok = w => tokens(w === 'ε' ? '' : w, sigma);
  const tree = new Tree();
  for (const w of positive) if (!tree.add(tok(w), 1)) return { ok: false, error: `"${w || 'ε'}" is listed as both accepted and rejected.` };
  for (const w of negative) if (!tree.add(tok(w), -1)) return { ok: false, error: `"${w || 'ε'}" is listed as both accepted and rejected.` };
  if (!positive.length) return { ok: true, dfa: minimize({ alphabet: sigma, start: 0, accept: [false], delta: [sigma.map(() => 0)] }), stats: { merges: 0 } };

  // Shortlex order of tree nodes = BFS with sorted symbols.
  const n = tree.child.length;
  const order = [0];
  const parent = new Array(n);
  for (let i = 0; i < order.length; i++) {
    for (const a of [...tree.child[order[i]].keys()].sort((x, y) => sigma.indexOf(x) - sigma.indexOf(y))) {
      const c = tree.child[order[i]].get(a);
      parent[c] = [order[i], a];
      order.push(c);
    }
  }
  const rank = new Map(order.map((q, i) => [q, i]));
  let st = { rep: [...Array(n).keys()], label: [...tree.label], child: tree.child.map(m => new Map(m)), parent };
  const find = (s, x) => { while (s.rep[x] !== x) x = s.rep[x]; return x; };
  const red = [0];
  let merges = 0;
  for (;;) {
    // blue = children of red states that are not red themselves, in shortlex order
    const blueSet = new Set();
    for (const r of red) for (const c of st.child[find(st, r)].values()) { const fc = find(st, c); if (!red.includes(fc)) blueSet.add(fc); }
    const blue = [...blueSet].sort((x, y) => rank.get(x) - rank.get(y));
    if (!blue.length) break;
    const b = blue[0];
    let merged = false;
    for (const r of red) {
      const next = tryMerge(st, find(st, r), b);
      if (next) { st = next; merged = true; merges++; break; }
    }
    if (!merged) red.push(b);
  }

  // Read off the quotient automaton; unknown labels become rejecting; missing moves → dead.
  const states = red.map(r => find(st, r));
  const idx = new Map(states.map((q, i) => [q, i]));
  const dead = states.length;
  const delta = states.map(q => sigma.map(a => (st.child[q].has(a) ? idx.get(find(st, st.child[q].get(a))) ?? dead : dead)));
  delta.push(sigma.map(() => dead));
  const accept = [...states.map(q => st.label[q] === 1), false];
  const dfa = minimize({ alphabet: sigma, start: idx.get(find(st, 0)), accept, delta });
  const bad = [...positive.filter(w => !accepts(dfa, tok(w))), ...negative.filter(w => accepts(dfa, tok(w)))];
  return { ok: bad.length === 0, dfa, error: bad.length ? `internal: inconsistent on ${bad.join(', ')}` : undefined, stats: { treeStates: n, merges, states: dfa.delta.length } };
}

/** Parse a textarea of examples: lines like "+ ab", "- ba", "ab ✓", "ba ✗", "ab, yes". */
export function parseExamples(text) {
  const pos = [], neg = [];
  for (const raw of String(text).split(/\n|;/)) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    if ((m = line.match(/^([+✓✔]|accept|yes|y)\s*[:,]?\s*(.*)$/i))) pos.push(clean(m[2]));
    else if ((m = line.match(/^([-−✗✘x]|reject|no|n)\s*[:,]?\s*(.*)$/i))) neg.push(clean(m[2]));
    else if ((m = line.match(/^(.*?)\s*[:,]?\s*([+✓✔]|accept|yes)$/i))) pos.push(clean(m[1]));
    else if ((m = line.match(/^(.*?)\s*[:,]?\s*([-−✗✘]|reject|no)$/i))) neg.push(clean(m[1]));
  }
  return { positive: pos, negative: neg };
}
const clean = s => { const t = s.trim().replace(/^["']|["']$/g, ''); return t === 'ε' || t === 'eps' || t === '""' ? '' : t; };
