// Generates the automaton diagrams used by the study guide and the books (Graphviz DOT → SVG/PNG).
// Every machine is built by the app's own engine (src/core), so the figures are correct by construction.
// Run: node tools/docs/figures.mjs   (needs the `dot` binary from Graphviz)
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as FA from '../../src/core/fa.js';
import { regexToDfa, regexToEnfa } from '../../src/core/regex.js';
import { parseDescription } from '../../src/core/nl.js';

const out = new URL('../../docs/figures/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const model = JSON.parse(readFileSync(new URL('../../src/core/nl-model.json', import.meta.url)));
const esc = (s) => String(s).replace(/"/g, '\\"');

function dot(machine, { label = (t) => t.symbol || 'ε', title = '', rankdir = 'LR', output = null } = {}) {
  const lines = [`digraph G {`, `  rankdir=${rankdir}; bgcolor="white"; pad=0.2; nodesep=0.45; ranksep=0.55;`,
    `  node [shape=circle fontname="Inter" fontsize=13 color="#4338ca" penwidth=1.6 fontcolor="#1e1b4b" style=filled fillcolor="#eef2ff" width=0.55 fixedsize=false];`,
    `  edge [fontname="Inter" fontsize=11 color="#64748b" fontcolor="#334155" arrowsize=0.7];`,
    `  __start [shape=point width=0.06 color="#4338ca"];`];
  for (const s of machine.states) {
    const shape = s.accepting ? 'doublecircle' : 'circle';
    const lab = output ? `${s.id}\\n${output(s)}` : s.id;
    lines.push(`  "${esc(s.id)}" [shape=${shape} label="${esc(lab)}"${s.accepting ? ' fillcolor="#fef3c7" color="#b45309"' : ''}];`);
  }
  const start = machine.states.find(s => s.initial);
  if (start) lines.push(`  __start -> "${esc(start.id)}";`);
  const grouped = new Map();
  for (const t of machine.transitions) {
    const k = `${t.from}\u0000${t.to}`;
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k).push(label(t));
  }
  for (const [k, labs] of grouped) {
    const [a, b] = k.split('\u0000');
    lines.push(`  "${esc(a)}" -> "${esc(b)}" [label="${esc([...new Set(labs)].join(', '))}"];`);
  }
  if (title) lines.push(`  labelloc="t"; label="${esc(title)}"; fontname="Inter"; fontsize=13;`);
  lines.push('}');
  return lines.join('\n');
}
function render(name, src) {
  writeFileSync(out + name + '.dot', src);
  execFileSync('dot', ['-Tsvg', out + name + '.dot', '-o', out + name + '.svg']);
  execFileSync('dot', ['-Tpng', '-Gdpi=170', out + name + '.dot', '-o', out + name + '.png']);
}
const dfaFromRegex = (re, sigma, keepDead = false) => FA.toAppMachine(FA.minimize(regexToDfa(re, sigma)), { keepDead });
const fromEnglish = (text, keepDead = false) => FA.toAppMachine(FA.minimize(parseDescription(text, model).dfa), { keepDead });

// --- Finite automata
render('dfa-ends-abb', dot(dfaFromRegex('(a|b)*abb', ['a', 'b'], true)));
render('dfa-even-a', dot(fromEnglish('strings over {a,b} with an even number of a')));
render('dfa-div3', dot(fromEnglish('binary numbers divisible by 3', true)));
render('dfa-contains-aba', dot(fromEnglish('strings over {a,b} that contain aba', true)));
render('dfa-second-last-1', dot(fromEnglish('binary strings where the second symbol from the end is 1', true)));
const nfaEndsAbb = { states: [{ id: 'q0', initial: true }, { id: 'q1' }, { id: 'q2' }, { id: 'q3', accepting: true }],
  transitions: [{ from: 'q0', to: 'q0', symbol: 'a' }, { from: 'q0', to: 'q0', symbol: 'b' }, { from: 'q0', to: 'q1', symbol: 'a' }, { from: 'q1', to: 'q2', symbol: 'b' }, { from: 'q2', to: 'q3', symbol: 'b' }] };
render('nfa-ends-abb', dot(nfaEndsAbb));
const enfa = { states: [{ id: 'q0', initial: true }, { id: 'q1' }, { id: 'q2', accepting: true }],
  transitions: [{ from: 'q0', to: 'q0', symbol: 'a' }, { from: 'q0', to: 'q0', symbol: 'b' }, { from: 'q0', to: 'q1', symbol: 'a' }, { from: 'q0', to: 'q1', symbol: 'ε' }, { from: 'q1', to: 'q2', symbol: 'b' }] };
render('enfa-example', dot(enfa));
render('enfa-removed', dot(FA.removeEpsilon({ ...enfa, alphabet: ['a', 'b'] })));
// subset construction with readable subset names ({q0,q1}, …)
{
  const sub = FA.determinize(nfaEndsAbb, ['a', 'b']);
  const app = { states: sub.labels.map((l, i) => ({ id: l === '{}' ? '∅' : l, initial: i === sub.start, accepting: sub.accept[i] })), transitions: [] };
  sub.delta.forEach((row, i) => row.forEach((j, k) => app.transitions.push({ from: app.states[i].id, to: app.states[j].id, symbol: sub.alphabet[k] })));
  render('subset-ends-abb', dot(app));
}
// minimisation: a deliberately redundant DFA and its minimal form
const redundant = { states: [{ id: 'A', initial: true }, { id: 'B' }, { id: 'C' }, { id: 'D', accepting: true }, { id: 'E', accepting: true }],
  transitions: [['A', 'a', 'B'], ['A', 'b', 'C'], ['B', 'a', 'B'], ['B', 'b', 'D'], ['C', 'a', 'B'], ['C', 'b', 'C'], ['D', 'a', 'B'], ['D', 'b', 'E'], ['E', 'a', 'B'], ['E', 'b', 'E']].map(([from, symbol, to]) => ({ from, to, symbol })) };
render('min-before', dot(redundant));
render('min-after', dot(FA.toAppMachine(FA.toMinimalDfa(redundant, ['a', 'b']), { keepDead: true })));
// Thompson construction for ab*
render('thompson-ab-star', dot(regexToEnfa('ab*'), { rankdir: 'LR' }));
// --- Mealy / Moore
const mooreParity = { states: [{ id: 'even', initial: true, output: '0' }, { id: 'odd', output: '1' }],
  transitions: [{ from: 'even', to: 'odd', symbol: '1' }, { from: 'odd', to: 'even', symbol: '1' }, { from: 'even', to: 'even', symbol: '0' }, { from: 'odd', to: 'odd', symbol: '0' }] };
render('moore-parity', dot(mooreParity, { output: s => `out ${s.output}` }));
const mealyChange = { states: [{ id: 'last0', initial: true }, { id: 'last1' }],
  transitions: [{ from: 'last0', to: 'last0', symbol: '0', output: 'S' }, { from: 'last0', to: 'last1', symbol: '1', output: 'X' }, { from: 'last1', to: 'last1', symbol: '1', output: 'S' }, { from: 'last1', to: 'last0', symbol: '0', output: 'X' }] };
render('mealy-change', dot(mealyChange, { label: t => `${t.symbol}/${t.output}` }));
// --- PDA and TM (from the verified practice/library data)
const pdaLib = JSON.parse(readFileSync(new URL('../../data/libraries/pda_library.json', import.meta.url)));
const anbn = pdaLib.find(e => /Equality/i.test(e.title));
render('pda-anbn', dot(anbn.machine || anbn, { label: t => `${t.symbol || 'ε'}, ${t.pop || 'ε'} → ${t.push || 'ε'}` }));
const tmLib = JSON.parse(readFileSync(new URL('../../data/libraries/tm_library.json', import.meta.url)));
const inc = tmLib.find(e => /ncrement/.test(e.title));
render('tm-increment', dot(inc.machine || inc, { label: t => `${t.read}→${t.write},${t.move}` }));
console.log('figures written to docs/figures/');

// --- Architecture and pipeline diagrams (hand-written DOT)
const box = 'node [shape=box style="rounded,filled" fontname="Inter" fontsize=12 color="#cbd5e1" fillcolor="#f8fafc" penwidth=1.2]; edge [fontname="Inter" fontsize=10 color="#64748b" fontcolor="#475569" arrowsize=0.7];';
render('architecture', `digraph A { rankdir=TB; bgcolor="white"; compound=true; newrank=true; ${box}
  subgraph cluster_ui { label="Pages (static HTML)"; fontname="Inter"; fontsize=12; color="#e2e8f0"; style="rounded";
    index [label="index.html\\nsplash + studio shell"]; grammar [label="pages/grammar_studio.html"]; settings [label="pages/splash_settings.html\\nhelp · policies"]; }
  subgraph cluster_app { label="src/ — ES modules, no build step"; fontname="Inter"; fontsize=12; color="#c7d2fe"; style="rounded";
    main [label="app/unified_main.js\\nrouter · studio loader · snapshots" fillcolor="#eef2ff" color="#818cf8"];
    fa [label="fa/  DFA · NFA · ε-NFA"]; mm [label="mm/  Mealy · Moore"]; pda [label="pda/  PDA · NPDA"]; tm [label="tm/  TM · multi-tape · NTM · LBA"]; gram [label="grammar/  CFG → NPDA · regex"];
    assist [label="assistant/  Automata Assistant" fillcolor="#ecfdf5" color="#34d399"];
    core [label="core/  pure engine\\ndeterminize · minimize · product · equivalence\\nregex · RPNI · layout · diagnosis · NL model" fillcolor="#fff7ed" color="#fb923c"];
    shared [label="shared/  utils · animation timing · shortcuts\\nicons · paths · assignment client"]; }
  subgraph cluster_data { label="data/"; fontname="Inter"; fontsize=12; color="#fde68a"; style="rounded";
    practice [label="practice/  FA · MM · PDA · TM banks"]; libs [label="libraries/  *.json (built by CI)"]; automata [label="automata/  source machines"]; inbox [label="inbox/  submissions to sort"]; }
  functions [label="netlify/functions\\nsave-to-db · assignments · review · push-to-github" fillcolor="#f0f9ff" color="#38bdf8"];
  db [label="Postgres (Neon)" shape=cylinder fillcolor="#f0f9ff" color="#38bdf8"];
  index -> main; grammar -> gram; main -> fa; main -> mm; main -> pda; main -> tm; fa -> assist; assist -> core; fa -> core [label="checks"]; mm -> core [style=dashed];
  fa -> shared [style=dotted arrowhead=none]; practice -> fa [style=dashed]; libs -> main [style=dashed]; automata -> libs [label="GitHub Actions"]; inbox -> automata [label="sort + validate"];
  main -> functions [label="submit"]; functions -> db; functions -> inbox [label="push"]; }`);
render('assistant-pipeline', `digraph P { rankdir=TB; nodesep=0.3; ranksep=0.32; bgcolor="white"; ${box}
  text [label="English sentence\\n\\"binary strings ending in 01\\nwith an even number of 1s\\""]; norm [label="normalise\\nquotes · Σ · ordinals"]; split [label="split into clauses\\nand / or / but not"];
  clf [label="intent classifier\\nlogistic regression\\n(uni+bigram features)" fillcolor="#ecfdf5" color="#34d399"]; slots [label="slot extraction\\nsymbols · numbers"];
  prim [label="exact primitive DFAs\\nKMP · counters · mod · nth-from-end" fillcolor="#fff7ed" color="#fb923c"]; comb [label="product constructions\\n∩ ∪ complement"]; min [label="minimise + lay out"]; out [label="DFA on the canvas\\n+ how it was read"];
  text -> norm -> split -> clf -> slots -> prim -> comb -> min -> out; }`);
render('library-pipeline', `digraph L { rankdir=LR; bgcolor="white"; ${box}
  student [label="Student saves\\nor submits"]; fn [label="Netlify function\\npush-to-github"]; inbox [label="data/inbox/*.json"]; action [label="GitHub Action\\nbuild-library.yml" fillcolor="#eef2ff" color="#818cf8"];
  sorted [label="data/automata/{fa,mm,pda,tm}/"]; libs [label="data/libraries/*.json"]; app [label="Library panel\\nin every studio"];
  student -> fn -> inbox -> action; action -> sorted [label="validate · dedupe · sort"]; sorted -> action [style=dashed]; action -> libs [label="rebuild"]; libs -> app; }`);
render('chomsky', `digraph C { rankdir=TB; bgcolor="white"; node [shape=box style="rounded,filled" fontname="Inter" fontsize=12 penwidth=1.2]; edge [color="#94a3b8" arrowhead=none];
  re [label="Recursively enumerable — Turing machines (TM studio)" fillcolor="#fee2e2" color="#f87171"];
  cs [label="Context-sensitive — linear-bounded automata (TM studio, LBA mode)" fillcolor="#ffedd5" color="#fb923c"];
  cf [label="Context-free — pushdown automata, CFGs (PDA + Grammar studios)" fillcolor="#fef9c3" color="#facc15"];
  rg [label="Regular — DFA, NFA, ε-NFA, regular expressions (FA studio)" fillcolor="#dcfce7" color="#4ade80"];
  tr [label="Finite-state transducers — Mealy and Moore machines (MM studio)" fillcolor="#e0f2fe" color="#38bdf8"];
  re -> cs -> cf -> rg; rg -> tr [style=dashed label=" same memory, with output" fontname="Inter" fontsize=10]; }`);
console.log('diagrams written');
