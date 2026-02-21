const EPSILON_TOKENS = new Set(['eps', 'epsilon', 'e', 'ε', 'lambda', 'λ']);
const PENDING_PDA_KEY = 'tocPendingPdaMachine';

let latestGrammar = null;
let latestNpda = null;

function byId(id) {
  return document.getElementById(id);
}

function escHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isNonTerminal(token) {
  return /^[A-Z][A-Z0-9_]*$/.test(token);
}

function tokenizeAlternative(rhs) {
  const raw = rhs.trim();
  if (!raw) return [];
  if (raw.includes(' ')) return raw.split(/\s+/).filter(Boolean);
  return raw.split('');
}

function parseGrammar(text, startSymbolRaw) {
  const rules = [];
  const lines = String(text || '').split(/\r?\n/);

  for (const originalLine of lines) {
    const line = originalLine.replace(/#.*/, '').replace(/\/\/.*/, '').trim();
    if (!line) continue;

    const match = line.match(/^([A-Z][A-Z0-9_]*)\s*->\s*(.+)$/);
    if (!match) {
      throw new Error(`Invalid rule format: ${originalLine}`);
    }

    const lhs = match[1].trim();
    const rhsPart = match[2].trim();
    const alternatives = rhsPart.split('|').map((a) => a.trim()).filter(Boolean);
    if (!alternatives.length) {
      throw new Error(`No alternatives found for ${lhs}`);
    }

    for (const alt of alternatives) {
      const tokens = tokenizeAlternative(alt);
      const isEps = tokens.length === 1 && EPSILON_TOKENS.has(tokens[0].toLowerCase());
      rules.push({ lhs, rhs: isEps ? [] : tokens });
    }
  }

  if (!rules.length) throw new Error('Grammar is empty.');

  const nonTerminals = new Set(rules.map((r) => r.lhs));
  const terminals = new Set();

  for (const rule of rules) {
    for (const sym of rule.rhs) {
      if (!isNonTerminal(sym)) terminals.add(sym);
    }
  }

  const grouped = new Map();
  for (const rule of rules) {
    if (!grouped.has(rule.lhs)) grouped.set(rule.lhs, []);
    grouped.get(rule.lhs).push(rule.rhs);
  }

  const startSymbol = String(startSymbolRaw || '').trim() || rules[0].lhs;
  if (!nonTerminals.has(startSymbol)) {
    throw new Error(`Start symbol ${startSymbol} is not defined in grammar.`);
  }

  return { rules, grouped, nonTerminals, terminals, startSymbol };
}

function sententialToString(sentential) {
  return sentential.join('');
}

function firstNonTerminalIndex(sentential) {
  return sentential.findIndex((s) => isNonTerminal(s));
}

function computeMinLen(grouped, nonTerminals) {
  const minLen = {};
  nonTerminals.forEach((nt) => { minLen[nt] = Infinity; });

  for (let i = 0; i < 100; i += 1) {
    let changed = false;
    nonTerminals.forEach((nt) => {
      const prods = grouped.get(nt) || [];
      for (const rhs of prods) {
        let total = 0;
        let valid = true;
        for (const sym of rhs) {
          if (isNonTerminal(sym)) {
            if (!Number.isFinite(minLen[sym])) {
              valid = false;
              break;
            }
            total += minLen[sym];
          } else {
            total += sym.length;
          }
        }
        if (valid && total < minLen[nt]) {
          minLen[nt] = total;
          changed = true;
        }
      }
    });
    if (!changed) break;
  }
  return minLen;
}

function estimateMinLength(sentential, minLen) {
  let total = 0;
  for (const sym of sentential) {
    if (isNonTerminal(sym)) {
      const m = minLen[sym];
      if (!Number.isFinite(m)) return Infinity;
      total += m;
    } else {
      total += sym.length;
    }
  }
  return total;
}

function prefixAndSuffixCompatible(sentential, target) {
  let prefix = '';
  for (const sym of sentential) {
    if (isNonTerminal(sym)) break;
    prefix += sym;
  }
  if (!target.startsWith(prefix)) return false;

  let suffix = '';
  for (let i = sentential.length - 1; i >= 0; i -= 1) {
    const sym = sentential[i];
    if (isNonTerminal(sym)) break;
    suffix = sym + suffix;
  }
  if (!target.endsWith(suffix)) return false;

  return true;
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function deriveLeftmost(grammar, target) {
  const minLen = computeMinLen(grammar.grouped, grammar.nonTerminals);
  const rootId = 1;

  const initial = {
    sentential: [grammar.startSymbol],
    frontier: [rootId],
    nodes: {
      [rootId]: { id: rootId, symbol: grammar.startSymbol, children: [] }
    },
    nextNodeId: 2,
    steps: []
  };

  const q = [initial];
  const visited = new Set();
  const maxNodes = 4500;
  const maxDepth = 28;
  let expanded = 0;

  while (q.length && expanded < maxNodes) {
    const cur = q.shift();
    expanded += 1;

    const key = `${cur.sentential.join(' ')}|${cur.steps.length}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const idx = firstNonTerminalIndex(cur.sentential);
    if (idx === -1) {
      if (sententialToString(cur.sentential) === target) {
        return { success: true, result: cur };
      }
      continue;
    }

    if (cur.steps.length >= maxDepth) continue;

    if (!prefixAndSuffixCompatible(cur.sentential, target)) continue;

    const minPossible = estimateMinLength(cur.sentential, minLen);
    if (minPossible > target.length) continue;

    const lhs = cur.sentential[idx];
    const rules = grammar.grouped.get(lhs) || [];
    const targetNodeId = cur.frontier[idx];

    for (const rhs of rules) {
      const next = cloneState(cur);
      const newStep = `${lhs} -> ${rhs.length ? rhs.join(' ') : 'ε'}`;
      next.steps.push(newStep);

      const newChildren = [];
      if (rhs.length === 0) {
        const epsId = next.nextNodeId;
        next.nextNodeId += 1;
        next.nodes[epsId] = { id: epsId, symbol: 'ε', children: [] };
        newChildren.push(epsId);
      } else {
        for (const sym of rhs) {
          const cid = next.nextNodeId;
          next.nextNodeId += 1;
          next.nodes[cid] = { id: cid, symbol: sym, children: [] };
          newChildren.push(cid);
        }
      }

      next.nodes[targetNodeId].children = newChildren;

      const newSentential = [
        ...next.sentential.slice(0, idx),
        ...rhs,
        ...next.sentential.slice(idx + 1)
      ];

      const newFrontier = [
        ...next.frontier.slice(0, idx),
        ...newChildren.filter((id) => isNonTerminal(next.nodes[id].symbol)),
        ...next.frontier.slice(idx + 1)
      ];

      next.sentential = newSentential;
      next.frontier = newFrontier;

      if (estimateMinLength(newSentential, minLen) <= target.length + 2) {
        q.push(next);
      }
    }
  }

  return { success: false, reason: 'No parse found within bounded derivation depth.' };
}

function layoutTree(nodes, rootId) {
  const pos = {};
  let cursorX = 70;
  const xGap = 70;
  const yGap = 90;

  function visit(id, depth) {
    const node = nodes[id];
    if (!node || !node.children || !node.children.length) {
      pos[id] = { x: cursorX, y: 50 + depth * yGap };
      cursorX += xGap;
      return;
    }
    const childXs = [];
    for (const child of node.children) {
      visit(child, depth + 1);
      childXs.push(pos[child].x);
    }
    const x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    pos[id] = { x, y: 50 + depth * yGap };
  }

  visit(rootId, 0);
  return pos;
}

function renderParseTree(state) {
  const svg = byId('parseTreeSvg');
  svg.innerHTML = '';

  const nodes = state.nodes;
  const rootId = 1;
  const positions = layoutTree(nodes, rootId);

  let maxX = 0;
  let maxY = 0;
  Object.values(positions).forEach((p) => {
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });

  svg.setAttribute('width', String(Math.max(1200, maxX + 120)));
  svg.setAttribute('height', String(Math.max(520, maxY + 120)));

  Object.keys(nodes).forEach((id) => {
    const node = nodes[id];
    const p = positions[id];
    if (!node || !p) return;
    for (const childId of node.children) {
      const c = positions[childId];
      if (!c) continue;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(p.x));
      line.setAttribute('y1', String(p.y));
      line.setAttribute('x2', String(c.x));
      line.setAttribute('y2', String(c.y));
      line.setAttribute('stroke', '#64748b');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    }
  });

  Object.keys(nodes).forEach((id) => {
    const node = nodes[id];
    const p = positions[id];
    if (!node || !p) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(p.x));
    circle.setAttribute('cy', String(p.y));
    circle.setAttribute('r', '22');
    circle.setAttribute('fill', '#ffffff');
    circle.setAttribute('stroke', isNonTerminal(node.symbol) ? '#2563eb' : '#10b981');
    circle.setAttribute('stroke-width', '3');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(p.x));
    text.setAttribute('y', String(p.y + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', '700');
    text.textContent = node.symbol;

    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
  });
}

function buildNpda(grammar) {
  const stackStart = 'Z';
  const states = [
    { id: 'q_start', initial: true, accepting: false, x: 220, y: 230 },
    { id: 'q_loop', initial: false, accepting: false, x: 520, y: 230 },
    { id: 'q_accept', initial: false, accepting: true, x: 820, y: 230 }
  ];

  const transitions = [];
  transitions.push({ from: 'q_start', to: 'q_loop', symbol: '', pop: stackStart, push: `${grammar.startSymbol}${stackStart}` });

  grammar.rules.forEach((r) => {
    transitions.push({
      from: 'q_loop',
      to: 'q_loop',
      symbol: '',
      pop: r.lhs,
      push: r.rhs.length ? r.rhs.join('') : ''
    });
  });

  grammar.terminals.forEach((t) => {
    transitions.push({ from: 'q_loop', to: 'q_loop', symbol: t, pop: t, push: '' });
  });

  transitions.push({ from: 'q_loop', to: 'q_accept', symbol: '', pop: stackStart, push: stackStart });

  return {
    type: 'PDA',
    states,
    transitions,
    alphabet: Array.from(grammar.terminals),
    stackAlphabet: Array.from(new Set([stackStart, ...Array.from(grammar.nonTerminals), ...Array.from(grammar.terminals)])),
    initialStackSymbol: stackStart,
    acceptanceMode: 'FINAL_STATE'
  };
}

function setStatus(html, isError = false) {
  const el = byId('grammarStatus');
  el.style.color = isError ? '#b91c1c' : '#0f766e';
  el.innerHTML = html;
}

function renderNpdaJson(npda) {
  byId('grammarNpdaJson').textContent = JSON.stringify(npda, null, 2);
}

function tabSwitch(tab) {
  ['steps', 'npda', 'tree', 'derivation'].forEach((id) => {
    byId(`grammarTab${id[0].toUpperCase()}${id.slice(1)}`).style.display = id === tab ? 'block' : 'none';
  });
}

function buildConversionSteps(grammar, npda) {
  const steps = [];
  steps.push('Initialize NPDA states: q_start, q_loop, q_accept.');
  steps.push(`Push start symbol ${grammar.startSymbol} above stack marker Z.`);
  grammar.rules.forEach((r) => {
    steps.push(`Add expansion transition: (${r.lhs} -> ${r.rhs.length ? r.rhs.join(' ') : 'ε'}).`);
  });
  grammar.terminals.forEach((t) => {
    steps.push(`Add terminal match transition for '${t}'.`);
  });
  steps.push(`Finalize acceptance transition to q_accept. Total transitions: ${npda.transitions.length}.`);
  return steps;
}

async function animateSteps(lines) {
  const log = byId('grammarStepLog');
  log.innerHTML = '';
  for (let i = 0; i < lines.length; i += 1) {
    const card = document.createElement('div');
    card.style.cssText = 'padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;background:#ffffff;margin-bottom:8px;';
    card.innerHTML = `<strong>Step ${i + 1}:</strong> ${escHtml(lines[i])}`;
    log.appendChild(card);
    card.style.background = '#eff6ff';
    await new Promise((resolve) => setTimeout(resolve, 380));
    card.style.background = '#ffffff';
    log.scrollTop = log.scrollHeight;
  }
}

function validateGrammarFlow() {
  const grammarText = byId('grammarInput').value;
  const startSymbol = byId('grammarStart').value;
  latestGrammar = parseGrammar(grammarText, startSymbol);
  setStatus(`Valid CFG. Non-terminals: <strong>${Array.from(latestGrammar.nonTerminals).join(', ')}</strong> | Terminals: <strong>${Array.from(latestGrammar.terminals).join(', ') || '(none)'}</strong>`);
  return latestGrammar;
}

function createNpdaFlow() {
  const grammar = latestGrammar || validateGrammarFlow();
  latestNpda = buildNpda(grammar);
  renderNpdaJson(latestNpda);
  return { grammar, npda: latestNpda };
}

async function animateConversionFlow() {
  const { grammar, npda } = createNpdaFlow();
  tabSwitch('steps');
  await animateSteps(buildConversionSteps(grammar, npda));
  setStatus('Conversion animation complete. NPDA generated.');
}

function parseTreeFlow() {
  const grammar = latestGrammar || validateGrammarFlow();
  const target = byId('parseTarget').value.trim();
  if (!target) throw new Error('Target string is required.');

  const result = deriveLeftmost(grammar, target);
  if (!result.success) throw new Error(result.reason || 'No parse tree could be generated.');

  renderParseTree(result.result);
  tabSwitch('tree');

  const list = byId('grammarDerivationList');
  list.innerHTML = '';
  const first = document.createElement('li');
  first.textContent = grammar.startSymbol;
  list.appendChild(first);

  let current = grammar.startSymbol;
  result.result.steps.forEach((s) => {
    const [lhs, rhsRaw] = s.split('->').map((v) => v.trim());
    const rhsText = rhsRaw === 'ε' ? '' : rhsRaw.replace(/\s+/g, '');
    const idx = current.indexOf(lhs);
    if (idx >= 0) {
      current = `${current.slice(0, idx)}${rhsText}${current.slice(idx + lhs.length)}`;
    }
    const li = document.createElement('li');
    li.textContent = `${s}    =>    ${current || 'ε'}`;
    list.appendChild(li);
  });

  setStatus(`Parse tree generated for string: <strong>${escHtml(target)}</strong>`);
}

function downloadNpdaFlow() {
  if (!latestNpda) createNpdaFlow();
  const blob = new Blob([JSON.stringify(latestNpda, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'grammar_generated_pda.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function openInPdaFlow() {
  if (!latestNpda) createNpdaFlow();
  localStorage.setItem(PENDING_PDA_KEY, JSON.stringify(latestNpda));
  window.location.href = 'index.html#pda';
}

function init() {
  document.querySelectorAll('.grammar-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => tabSwitch(btn.getAttribute('data-tab')));
  });

  byId('grammarBackBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  byId('grammarValidateBtn').addEventListener('click', () => {
    try {
      validateGrammarFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('grammarBuildBtn').addEventListener('click', () => {
    try {
      createNpdaFlow();
      tabSwitch('npda');
      setStatus('NPDA JSON generated.');
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('grammarAnimateBtn').addEventListener('click', async () => {
    try {
      await animateConversionFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('parseGenerateBtn').addEventListener('click', () => {
    try {
      parseTreeFlow();
      tabSwitch('derivation');
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('grammarDownloadBtn').addEventListener('click', () => {
    try {
      downloadNpdaFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('grammarOpenPdaBtn').addEventListener('click', () => {
    try {
      openInPdaFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  try {
    validateGrammarFlow();
    createNpdaFlow();
  } catch (_e) {
    // keep UI interactive even with malformed default input
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
