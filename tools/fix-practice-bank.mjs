// Rebuilds the stored solution of every practice question listed in tests/practice-truth.mjs
// whose stored machine disagrees with the ground truth. Run: node tools/fix-practice-bank.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import * as FA from '../core/fa.js';
import { regexToDfa } from '../core/regex.js';
import { parseDescription } from '../core/nl.js';
import { withLayout } from '../core/layout.js';
import { TRUTH, words } from '../tests/practice-truth.mjs';

const file = new URL('../practice-bank.js', import.meta.url);
globalThis.window = {};
await import(file.href);
const bank = window.PRACTICE_BANK;
const model = JSON.parse(readFileSync(new URL('../core/nl-model.json', import.meta.url)));

let fixed = 0;
for (const [key, t] of Object.entries(TRUTH)) {
  const [mode, level, i] = key.split('/');
  const q = bank[mode][level][+i];
  const sigma = [...t.sigma];
  const wrong = [...words(sigma, 8)].find(w => FA.accepts(FA.toMinimalDfa(q.machine, sigma), [...w]) !== t.pred(w));
  if (wrong === undefined) continue;
  const dfa = t.regex ? regexToDfa(t.regex, sigma) : parseDescription(t.text, model).dfa;
  const bad = [...words(sigma, 8)].find(w => FA.accepts(dfa, [...w]) !== t.pred(w));
  if (bad !== undefined) throw new Error(`${key}: truth machine disagrees with its predicate on "${bad}"`);
  const machine = withLayout(FA.toAppMachine(FA.minimize(dfa), { keepDead: mode === 'DFA' }));
  q.machine = { states: machine.states, transitions: machine.transitions, alphabet: sigma };
  q.sol = `${machine.states.length} states (minimal${mode === 'DFA' ? ' complete DFA' : ' DFA, trap state omitted'})`;
  console.log(`fixed ${key} (was wrong on "${wrong || 'ε'}")`);
  fixed++;
}
if (fixed) {
  writeFileSync(file, `// Practice questions and reference solutions. Solutions are checked by tests/audit-fa.test.mjs.\nwindow.PRACTICE_BANK = ${JSON.stringify(bank, null, 2)};\n`);
}
console.log(`${fixed} solution(s) rebuilt.`);
