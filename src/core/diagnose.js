// core/diagnose.js — explain *why* a drawn automaton is wrong, not just *that* it is.
//
// final mode  : language comparison with the shortest wrongly-accepted and wrongly-rejected
//               strings, the path the student's machine takes on them, and state-level hints.
// guided mode : the student is drawing step by step; missing transitions are "not drawn yet",
//               so only certain mistakes are reported, plus progress (target states covered).

import * as FA from './fa.js';

const show = (w) => (w.length ? w.join('') : 'ε');

/** Deterministic view of a drawn machine: Map id -> Map symbol -> [targets]. */
function graph(machine) {
  const g = new Map((machine.states || []).map(s => [s.id, new Map()]));
  for (const t of machine.transitions || []) {
    if (!g.has(t.from) || !g.has(t.to)) continue;
    for (const s of FA.splitSymbols(t.symbol)) {
      if (!g.get(t.from).has(s)) g.get(t.from).set(s, []);
      g.get(t.from).get(s).push(t.to);
    }
  }
  return g;
}

/** Shortest word w with δ_target(p, w) accepted XOR δ_target(q, w) accepted. */
function distinguishing(dfa, p, q) {
  const prev = new Map([[p + ',' + q, null]]);
  const queue = [[p, q]];
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    if (!!dfa.accept[x] !== !!dfa.accept[y]) {
      const w = [];
      let k = x + ',' + y;
      while (prev.get(k)) { const [pk, a] = prev.get(k); w.unshift(a); k = pk; }
      return w;
    }
    dfa.alphabet.forEach((a, j) => {
      const nx = dfa.delta[x][j], ny = dfa.delta[y][j], k = nx + ',' + ny;
      if (!prev.has(k)) { prev.set(k, [x + ',' + y, a]); queue.push([nx, ny]); }
    });
  }
  return null;
}

/** Run the drawn machine on a word (deterministic part only), returning the visited state ids. */
export function trace(machine, word) {
  const g = graph(machine);
  const start = (machine.states || []).find(s => s.initial);
  if (!start) return { path: [], stuck: true };
  const path = [start.id];
  let q = start.id;
  for (const a of word) {
    const nxt = g.get(q)?.get(a);
    if (!nxt || !nxt.length) return { path, stuck: true, stuckOn: a };
    q = nxt[0];
    path.push(q);
  }
  const s = machine.states.find(x => x.id === q);
  return { path, stuck: false, accepting: !!s?.accepting };
}

/**
 * Map each drawn state to the target states it is "standing for", by walking the drawn edges
 * from the start in lock-step with the target DFA. Returns { map: Map(id -> Map(targetState -> accessWord)) }.
 */
function correspondence(machine, target) {
  const g = graph(machine);
  const start = (machine.states || []).find(s => s.initial);
  const map = new Map((machine.states || []).map(s => [s.id, new Map()]));
  if (!start) return { map, edges: [] };
  const sym = new Map(target.alphabet.map((a, i) => [a, i]));
  const queue = [[start.id, target.start, []]];
  map.get(start.id).set(target.start, []);
  const edges = [];
  for (let i = 0; i < queue.length; i++) {
    const [u, t, w] = queue[i];
    for (const [a, vs] of g.get(u)) {
      if (a === FA.EPS || !sym.has(a)) continue;
      const nt = target.delta[t][sym.get(a)];
      for (const v of vs) {
        edges.push({ from: u, symbol: a, to: v, targetFrom: t, targetTo: nt, word: [...w, a] });
        if (!map.get(v).has(nt)) { map.get(v).set(nt, [...w, a]); queue.push([v, nt, [...w, a]]); }
      }
    }
  }
  return { map, edges };
}

/**
 * @param {object} machine  drawn app machine
 * @param {object} target   minimal complete DFA (internal format) of the intended language
 * @param {{mode?: 'final'|'guided'}} [opts]
 * @returns {{correct:boolean, progress:number, hints:{level:'error'|'warn'|'info'|'success', message:string, states?:string[], word?:string}[]}}
 */
export function diagnose(machine, target, { mode = 'final' } = {}) {
  const hints = [];
  const add = (level, message, extra = {}) => hints.push({ level, message, ...extra });
  const states = machine.states || [];
  const dead = FA.deadStates(target);
  const liveTargets = target.delta.map((_, q) => q).filter(q => !dead[q] && FA.reachable(target).includes(q));

  if (!states.length) {
    add('info', `Start by adding the initial state. The smallest DFA for this language has ${liveTargets.length} state${liveTargets.length === 1 ? '' : 's'}${dead.some(Boolean) ? ' (+ an optional trap state)' : ''}.`);
    return { correct: false, progress: 0, hints };
  }
  const sigma = target.alphabet;
  const used = FA.machineAlphabet(machine).filter(a => !sigma.includes(a));
  if (used.length) add('error', `Symbol${used.length > 1 ? 's' : ''} ${used.map(x => `'${x}'`).join(', ')} ${used.length > 1 ? 'are' : 'is'} not in Σ = {${sigma.join(', ')}}.`);

  // Structural problems (in guided mode, missing moves are just "not drawn yet").
  for (const i of FA.structuralIssues({ ...machine, type: machine.type || 'DFA' })) {
    if (i.kind === 'missing' && mode === 'guided') continue;
    if (i.kind === 'unreachable' && mode === 'guided') continue;
    add(i.kind === 'missing' ? 'warn' : 'error', i.message, { states: i.state ? [i.state] : undefined });
  }

  const { map, edges } = correspondence(machine, target);
  const covered = new Set();
  for (const ts of map.values()) for (const t of ts.keys()) if (!dead[t]) covered.add(t);
  const progress = liveTargets.length ? Math.min(1, covered.size / liveTargets.length) : 1;

  // State doing two different jobs.
  let conflict = false;
  for (const [u, ts] of map) {
    const list = [...ts.entries()];
    if (list.length < 2) continue;
    const [t1, w1] = list[0];
    const pair = list.slice(1).find(([t2]) => t2 !== t1);
    if (!pair) continue;
    conflict = true;
    const [t2, w2] = pair;
    const d = distinguishing(target, t1, t2);
    const culprit = edges.find(e => e.to === u && e.targetTo === t2 && e.word.join('') === w2.join(''));
    add('error',
      `${u} is used for two different situations: after "${show(w1)}" and after "${show(w2)}". ` +
      (d ? `They must be different states, because "${show(w1)}${d.join('')}" and "${show(w2)}${d.join('')}" need different answers.` : ''),
      { states: [u], word: show(w2), edge: culprit ? { from: culprit.from, to: culprit.to, symbol: culprit.symbol } : undefined });
  }

  // Accepting flags that are certainly wrong.
  for (const [u, ts] of map) {
    if (ts.size !== 1) continue;
    const [t, w] = [...ts.entries()][0];
    const s = states.find(x => x.id === u);
    if (!!s.accepting !== !!target.accept[t]) {
      add('error', s.accepting
        ? `${u} is marked accepting, but "${show(w)}" (which ends in ${u}) should be rejected.`
        : `${u} should be accepting: "${show(w)}" ends in ${u} and must be accepted.`, { states: [u], word: show(w) });
    }
    if (dead[t] && !s.accepting && mode === 'guided') add('info', `${u} is a trap: once there, nothing can be accepted. That's fine (or you can just leave those moves out).`, { states: [u] });
  }

  // Whole-language check.
  let correct = false;
  if (!hints.some(h => h.level === 'error')) {
    const user = FA.toMinimalDfa(machine, sigma);
    const cmp = FA.compare(user, target);
    correct = cmp.equivalent;
    if (correct) {
      const extra = FA.toMinimalDfa(machine, sigma).delta.length;
      const drawnLive = states.length;
      add('success', `Correct! Your automaton accepts exactly the right language.${drawnLive > liveTargets.length + (dead.some(Boolean) ? 1 : 0) ? ` It works, but it could be done with ${liveTargets.length} state${liveTargets.length > 1 ? 's' : ''}${dead.some(Boolean) ? ' (+ trap)' : ''} — try Minimize.` : ''}`);
      void extra;
    } else if (mode === 'final' || progress >= 1) {
      const wrongAcc = FA.shortestAccepted(FA.product(user, target, 'diff'));
      const wrongRej = FA.shortestAccepted(FA.product(target, user, 'diff'));
      if (wrongAcc) { const tr = trace(machine, wrongAcc); add('error', `Accepts "${show(wrongAcc)}", which should be rejected (path: ${tr.path.join(' → ')}).`, { states: tr.path, word: show(wrongAcc) }); }
      if (wrongRej) { const tr = trace(machine, wrongRej); add('error', `Rejects "${show(wrongRej)}", which should be accepted (${tr.stuck ? `no move on '${tr.stuckOn}' from ${tr.path[tr.path.length - 1]}` : `path: ${tr.path.join(' → ')}`}).`, { states: tr.path, word: show(wrongRej) }); }
    }
  }
  if (mode === 'guided' && !correct && !conflict && !hints.some(h => h.level === 'error')) {
    const missing = liveTargets.length - covered.size;
    // Suggest the next useful move: the shortest word reaching an uncovered target state.
    const g = graph(machine);
    let nextTip = null;
    for (const [u, ts] of map) {
      for (const [t, w] of ts) {
        target.alphabet.forEach((a, j) => {
          if (nextTip || dead[target.delta[t][j]]) return;
          if (!g.get(u).has(a)) nextTip = `Next: what should happen from ${u} on '${a}' (after reading "${show([...w, a])}")?`;
        });
      }
    }
    add('info', `${covered.size}/${liveTargets.length} required states in place${missing > 0 ? ` — ${missing} more to go` : ''}. ${nextTip || ''}`.trim());
  }
  return { correct, progress, hints };
}
