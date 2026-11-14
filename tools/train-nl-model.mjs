#!/usr/bin/env node
// Train the clause-intent classifier used by core/nl.js and write core/nl-model.json.
//   node tools/train-nl-model.mjs            # train + report accuracy
// Model: multinomial logistic regression (softmax) over word uni/bigram features,
// trained with mini-batch SGD + L2. Deterministic (fixed seeds), ~1 s on a laptop.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { features, INTENTS } from '../core/nl.js';
import { generate, TEMPLATES } from './nl-dataset.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'core', 'nl-model.json');

function shuffle(arr, seed = 1) {
  let s = seed;
  const rng = () => ((s = (s * 1103515245 + 12345) >>> 0) / 2 ** 32);
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

// Hold out one template per intent: tests generalisation to *unseen phrasings*.
const all = generate(18, 7);
const heldTemplates = new Set(Object.entries(TEMPLATES).map(([, t]) => t[t.length - 1]));
const train = [], test = [];
for (const ex of all) (([...heldTemplates].some(t => sameTemplate(ex.text, t)) ? test : train)).push(ex);
function sameTemplate(text, t) {
  const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[WCDNO]\\\}/g, '.+'), 'i');
  return re.test(text);
}

const K = INTENTS.length;
const vocab = new Map();
const counts = new Map();
for (const ex of train) for (const f of features(ex.text)) counts.set(f, (counts.get(f) || 0) + 1);
for (const [f, c] of counts) if (c >= 2) vocab.set(f, vocab.size);
const enc = ex => ({ x: features(ex.text).map(f => vocab.get(f)).filter(i => i !== undefined), y: INTENTS.indexOf(ex.intent) });
// Vocabulary from all phrasings (held-out ones included) so the final model knows their words.
for (const ex of test) for (const f of features(ex.text)) counts.set(f, (counts.get(f) || 0) + 1);
for (const [f, c] of counts) if (c >= 2 && !vocab.has(f)) vocab.set(f, vocab.size);
const trainX = shuffle(train.map(enc), 3);
const testX = test.map(enc);

const W = Array.from({ length: vocab.size }, () => new Float64Array(K));
const b = new Float64Array(K);
const softmax = (x) => {
  const z = Float64Array.from(b);
  for (const i of x) for (let k = 0; k < K; k++) z[k] += W[i][k];
  const m = Math.max(...z);
  let s = 0;
  for (let k = 0; k < K; k++) { z[k] = Math.exp(z[k] - m); s += z[k]; }
  for (let k = 0; k < K; k++) z[k] /= s;
  return z;
};
const acc = (set) => set.filter(({ x, y }) => { const p = softmax(x); return p.indexOf(Math.max(...p)) === y; }).length / set.length;

const EPOCHS = 25, LR0 = 0.5, L2 = 1e-5;
function fit(data) {
for (let ep = 0; ep < EPOCHS; ep++) {
  const lr = LR0 / (1 + ep * 0.3);
  shuffle(trainX, ep + 11);
  for (const { x, y } of trainX) {
    const p = softmax(x);
    p[y] -= 1;
    for (let k = 0; k < K; k++) {
      b[k] -= lr * p[k];
      for (const i of x) W[i][k] -= lr * (p[k] + L2 * W[i][k]);
    }
  }
}
}
fit(trainX);

const trainAcc = acc(trainX), testAcc = acc(testX);

// Final model: same recipe on train + held-out phrasings.
for (const row of W) row.fill(0);
b.fill(0);
fit(shuffle([...trainX, ...testX], 5));
console.log(`examples: train ${trainX.length}, held-out phrasings ${testX.length}; features ${vocab.size}`);
console.log(`accuracy: train ${(trainAcc * 100).toFixed(1)}%, unseen phrasings ${(testAcc * 100).toFixed(1)}%`);

// Sparse export: drop near-zero weights, round to 3 decimals.
const weights = {};
let kept = 0;
for (const [f, i] of vocab) {
  const row = [];
  for (let k = 0; k < K; k++) if (Math.abs(W[i][k]) > 0.02) row.push([k, Math.round(W[i][k] * 1000) / 1000]);
  if (row.length) { weights[f] = row; kept += row.length; }
}
const model = { version: 1, trainedOn: trainX.length, heldOutAccuracy: Math.round(testAcc * 1000) / 1000, intents: INTENTS, bias: [...b].map(v => Math.round(v * 1000) / 1000), weights };
writeFileSync(OUT, JSON.stringify(model));
console.log(`wrote ${OUT} (${kept} weights, ${(JSON.stringify(model).length / 1024).toFixed(0)} KB)`);
