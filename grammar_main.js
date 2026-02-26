import { parseRegexAndBuildEnfa } from './regex-converter.js';
import { consumePendingImportedMachine, setPendingImportedMachine } from './machine_router.js';

const EPSILON_SYMBOL = 'ε';
const EPSILON_TOKENS = new Set(['eps', 'esp', 'epsilon', 'e', 'ε', 'îµ', 'lambda', 'lamda', 'λ']);
const PENDING_PDA_KEY = 'tocPendingPdaMachine';
const PENDING_MM_PROMPT_KEY = 'tocPendingMmPromptV1';
const PENDING_TM_PROMPT_KEY = 'tocPendingTmPromptV1';
const ACTIVE_ROUTE_KEY = 'tocActiveRoute';

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

function normalizeSymbolToken(token) {
  const normalized = String(token || '')
    .replaceAll('Îµ', EPSILON_SYMBOL)
    .replaceAll('ϵ', EPSILON_SYMBOL)
    .trim();
  if (!normalized) return '';
  const unquoted = normalized.replace(/^['"](.+)['"]$/, '$1').trim();
  return unquoted || normalized;
}

function isEpsilonToken(token) {
  return EPSILON_TOKENS.has(normalizeSymbolToken(token).toLowerCase());
}

function displaySymbol(symbol) {
  if (symbol === '') return EPSILON_SYMBOL;
  return isEpsilonToken(symbol) ? EPSILON_SYMBOL : normalizeSymbolToken(symbol);
}

function tokenizeAlternative(rhs) {
  const raw = rhs.trim();
  if (!raw) return [];
  if (raw.includes(' ')) {
    return raw.split(/\s+/).map(normalizeSymbolToken).filter(Boolean);
  }

  const compact = normalizeSymbolToken(raw);
  if (isEpsilonToken(compact)) return [EPSILON_SYMBOL];

  const tokens = [];
  let idx = 0;
  while (idx < compact.length) {
    const chunk = compact.slice(idx);
    const nt = chunk.match(/^[A-Z][A-Z0-9_]*/);
    if (nt) {
      tokens.push(nt[0]);
      idx += nt[0].length;
      continue;
    }
    const term = chunk.match(/^[a-z][a-z0-9_]*/);
    if (term) {
      tokens.push(normalizeSymbolToken(term[0]));
      idx += term[0].length;
      continue;
    }
    tokens.push(normalizeSymbolToken(chunk[0]));
    idx += 1;
  }
  return tokens.filter(Boolean);
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
      const tokens = tokenizeAlternative(alt).map((t) => (isEpsilonToken(t) ? EPSILON_SYMBOL : t));
      const isEps = tokens.length === 1 && isEpsilonToken(tokens[0]);
      rules.push({ lhs, rhs: isEps ? [] : tokens.filter((t) => !isEpsilonToken(t)) });
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
      const newStep = `${lhs} -> ${rhs.length ? rhs.join(' ') : EPSILON_SYMBOL}`;
      next.steps.push(newStep);

      const newChildren = [];
      if (rhs.length === 0) {
        const epsId = next.nextNodeId;
        next.nextNodeId += 1;
        next.nodes[epsId] = { id: epsId, symbol: EPSILON_SYMBOL, children: [] };
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

function setRlRelStatus(html, isError = false) {
  const el = byId('rlRelStatus');
  if (!el) return;
  el.style.color = isError ? '#b91c1c' : '#0f766e';
  el.innerHTML = html;
}

function renderNpdaJson(npda) {
  byId('grammarNpdaJson').textContent = JSON.stringify(npda, null, 2);
}

function tabSwitch(tab) {
  ['rl', 'rel', 'steps', 'npda', 'table', 'tree', 'derivation'].forEach((id) => {
    const panel = byId(`grammarTab${id[0].toUpperCase()}${id.slice(1)}`);
    if (panel) panel.style.display = id === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.grammar-tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
}

function inferRlFallbackRows(rlInput, targetMachine) {
  const rl = String(rlInput || '');
  const symbols = Array.from(new Set((rl.match(/[a-z0-9]/gi) || []).map((s) => s.toLowerCase())));
  const sigma = symbols.length ? symbols : ['a', 'b'];
  const rows = [];
  const target = String(targetMachine || 'FA').toUpperCase();
  const hasUnion = rl.includes('|');
  const hasStar = rl.includes('*');

  if (hasUnion && sigma.length >= 2) {
    rows.push({ from: 'q0', symbol: sigma[0], to: 'q1', role: 'union branch A' });
    rows.push({ from: 'q0', symbol: sigma[1], to: 'q2', role: 'union branch B' });
    rows.push({ from: 'q1', symbol: EPSILON_SYMBOL, to: 'qf', role: 'accept branch A' });
    rows.push({ from: 'q2', symbol: EPSILON_SYMBOL, to: 'qf', role: 'accept branch B' });
  } else {
    sigma.forEach((sym, idx) => {
      rows.push({
        from: `q${idx}`,
        symbol: sym,
        to: `q${idx + 1}`,
        role: idx === sigma.length - 1 ? 'consume and reach accept frontier' : 'consume symbol'
      });
    });
  }

  if (hasStar) {
    const loopState = rows.length ? rows[rows.length - 1].to : 'q0';
    rows.push({ from: loopState, symbol: sigma[0], to: loopState, role: 'Kleene-star loop' });
  }

  if (target === 'MM') {
    return rows.map((row, idx) => ({
      ...row,
      role: `${row.role}; output y${(idx % 3) + 1}`
    }));
  }
  return rows;
}

function buildRlTransitionRows(rlInput, targetMachine) {
  const rl = String(rlInput || '').trim();
  const target = String(targetMachine || 'FA').toUpperCase();
  if (!rl) return [];

  try {
    const machine = parseRegexAndBuildEnfa(rl);
    if (machine && Array.isArray(machine.transitions) && machine.transitions.length) {
      const rows = machine.transitions.map((tr) => ({
        from: tr.from,
        symbol: displaySymbol(tr.symbol),
        to: tr.to,
        role: tr.symbol === '' ? 'epsilon transition' : 'symbol transition'
      }));

      const accepting = Array.isArray(machine.states)
        ? machine.states.filter((s) => s.accepting).map((s) => s.id)
        : [];
      accepting.forEach((stateId) => {
        rows.push({
          from: stateId,
          symbol: EPSILON_SYMBOL,
          to: stateId,
          role: 'accepting state'
        });
      });

      if (target === 'MM') {
        return rows.map((row, idx) => ({
          ...row,
          role: `${row.role}; output y${(idx % 3) + 1}`
        }));
      }
      return rows;
    }
  } catch (_e) {
    // fall through to heuristic rows for unsupported regex syntax
  }

  return inferRlFallbackRows(rl, target);
}

function buildRelTransitionRows(relInput) {
  const rel = String(relInput || '').trim();
  const symbols = Array.from(new Set((rel.match(/[a-z0-9]/gi) || []).map((s) => s.toLowerCase()))).slice(0, 4);
  const sigma = symbols.length ? symbols : ['a', 'b'];
  const blank = 'B';
  const hasCompare = /ww|compare|match|equal/.test(rel.toLowerCase());
  const hasEnumerate = /enumer|list|generate/.test(rel.toLowerCase());
  const hasHalt = /halt|stop|accept|reject/.test(rel.toLowerCase());

  const rows = [
    { state: 'q_start', read: sigma[0], write: 'X', move: 'R', next: 'q_scan', role: 'mark next unprocessed symbol' },
    { state: 'q_scan', read: sigma[0], write: sigma[0], move: 'R', next: 'q_scan', role: 'scan right over tape' },
    { state: 'q_scan', read: sigma[1] || sigma[0], write: sigma[1] || sigma[0], move: 'R', next: 'q_scan', role: 'scan right over tape' },
    { state: 'q_scan', read: blank, write: blank, move: 'L', next: hasCompare ? 'q_compare' : 'q_back', role: 'reach boundary and switch mode' },
    { state: hasCompare ? 'q_compare' : 'q_back', read: sigma[0], write: sigma[0], move: 'L', next: 'q_back', role: hasCompare ? 'compare mirrored symbol' : 'rewind to marker' },
    { state: 'q_back', read: 'X', write: 'X', move: 'R', next: hasEnumerate ? 'q_enum' : 'q_next', role: 'return to next cycle entry' },
    { state: hasEnumerate ? 'q_enum' : 'q_next', read: sigma[0], write: sigma[0], move: 'R', next: 'q_next', role: hasEnumerate ? 'enumerate candidate string' : 'continue simulation' },
    { state: 'q_next', read: blank, write: blank, move: 'S', next: hasHalt ? 'q_accept' : 'q_loop', role: hasHalt ? 'halt on satisfied condition' : 'keep exploring branches' }
  ];

  if (!hasHalt) {
    rows.push({ state: 'q_loop', read: blank, write: blank, move: 'R', next: 'q_loop', role: 'non-halting exploration branch' });
  }
  rows.push({ state: 'q_accept', read: blank, write: blank, move: 'S', next: 'q_accept', role: 'accept configuration' });

  return rows;
}

function buildFallbackFaMachineFromRl(rlInput) {
  const rows = inferRlFallbackRows(rlInput, 'FA');
  const statesInOrder = [];
  const seen = new Set();
  rows.forEach((row) => {
    if (!seen.has(row.from)) {
      seen.add(row.from);
      statesInOrder.push(row.from);
    }
    if (!seen.has(row.to)) {
      seen.add(row.to);
      statesInOrder.push(row.to);
    }
  });

  if (!seen.has('q0')) statesInOrder.unshift('q0');
  const initialId = statesInOrder.includes('q0') ? 'q0' : statesInOrder[0];
  const accepting = new Set();
  if (statesInOrder.includes('qf')) accepting.add('qf');
  if (rows.length) accepting.add(rows[rows.length - 1].to);
  if (!accepting.size && statesInOrder.length) accepting.add(statesInOrder[statesInOrder.length - 1]);

  return {
    type: 'ENFA',
    states: statesInOrder.map((id, idx) => ({
      id,
      initial: id === initialId,
      accepting: accepting.has(id),
      x: 170 + (idx * 150),
      y: 250 + ((idx % 2) * 120)
    })),
    transitions: rows.map((row) => ({
      from: row.from,
      to: row.to,
      symbol: row.symbol === EPSILON_SYMBOL ? '' : String(row.symbol || '')
    })),
    alphabet: Array.from(new Set(rows.map((row) => row.symbol).filter((s) => s && s !== EPSILON_SYMBOL)))
  };
}

function buildFaMachineForImport(rlInput) {
  const rl = String(rlInput || '').trim();
  try {
    return { machine: parseRegexAndBuildEnfa(rl), fallback: false };
  } catch (_e) {
    return { machine: buildFallbackFaMachineFromRl(rl), fallback: true };
  }
}

function buildTmMachineFromRel(relInput) {
  const rel = String(relInput || '').trim();
  const rows = buildRelTransitionRows(rel);
  const stateIds = [];
  const seen = new Set();
  rows.forEach((row) => {
    if (!seen.has(row.state)) {
      seen.add(row.state);
      stateIds.push(row.state);
    }
    if (!seen.has(row.next)) {
      seen.add(row.next);
      stateIds.push(row.next);
    }
  });

  const initialId = stateIds.includes('q_start') ? 'q_start' : stateIds[0];
  const accepting = new Set(stateIds.filter((id) => /accept/i.test(id)));

  return {
    type: rows.some((row) => row.move === 'S') ? 'STAY_OPTION' : 'STANDARD',
    title: 'REL-derived machine from Grammar Studio',
    numTapes: 1,
    boundMode: 'UNBOUNDED',
    blankSymbol: 'B',
    alphabet: Array.from(new Set(rows.flatMap((row) => [row.read, row.write]).filter((s) => s && s !== 'B'))),
    tapeAlphabet: Array.from(new Set(['B', ...rows.flatMap((row) => [row.read, row.write]).filter(Boolean)])),
    states: stateIds.map((id, idx) => ({
      id,
      initial: id === initialId,
      accepting: accepting.has(id),
      x: 180 + (idx * 155),
      y: 250 + ((idx % 2) * 120)
    })),
    transitions: rows.map((row) => ({
      from: row.state,
      to: row.next,
      read: row.read,
      write: row.write,
      move: row.move
    }))
  };
}

function buildRlPlan(rlInput, targetMachine) {
  const rl = String(rlInput || '').trim();
  const normalized = rl.toLowerCase();
  const hasUnion = normalized.includes('|') || normalized.includes(' or ');
  const hasStar = normalized.includes('*');
  const hasParen = normalized.includes('(') || normalized.includes(')');
  const hasConcat = /[a-z0-9]\s*[a-z0-9]/i.test(rl.replaceAll('|', ' '));
  const target = String(targetMachine || 'FA').toUpperCase();

  const notes = [
    `Input regex: ${rl}`,
    hasUnion ? 'Union branch detected.' : 'No explicit union branch detected.',
    hasStar ? 'Kleene closure branch detected.' : 'No Kleene closure branch detected.',
    hasParen ? 'Grouped expression detected.' : 'No grouping tokens detected.',
    hasConcat ? 'Concatenation pattern detected.' : 'Concatenation pattern not obvious in input.'
  ];

  const steps = [
    'Normalize RL expression and tokenize operators.',
    'Build e-NFA fragments for symbol, union, concatenation, and star constructs.',
    'Merge fragments into one entry/exit automaton graph.',
    'Resolve epsilon closures and validate accepting reachability.',
    target === 'MM'
      ? 'Project recognizer into Mealy/Moore workflow by attaching output behavior to accepted paths.'
      : 'Open FA workspace with generated machine model for testing and minimization.'
  ];

  return {
    headline: `RL conversion plan ready for ${target}.`,
    inputClass: 'Regular Language (RL)',
    targetMachine: target === 'MM' ? 'Mealy/Moore Studio' : 'FA Studio',
    complexity: 'Finite-state construct. Determinization/minimization may expand states.',
    notes,
    steps,
    transitions: buildRlTransitionRows(rl, target)
  };
}

function buildRelPlan(relInput) {
  const rel = String(relInput || '').trim();
  const normalized = rel.toLowerCase();
  const hasEnumerate = normalized.includes('enumer') || normalized.includes('list');
  const hasHalting = normalized.includes('halt') || normalized.includes('stop');
  const hasCopyOrCompare = normalized.includes('copy') || normalized.includes('compare') || normalized.includes('ww');

  const notes = [
    `REL description: ${rel}`,
    hasEnumerate ? 'Enumeration intent detected.' : 'No explicit enumeration phrase detected.',
    hasHalting ? 'Halting condition mention detected.' : 'Halting condition should be defined explicitly.',
    hasCopyOrCompare ? 'Copy/compare behavior hint detected.' : 'Consider adding explicit compare/copy behavior in TM design.'
  ];

  const steps = [
    'Formalize REL acceptance objective and tape alphabet.',
    'Design TM state blocks for scan, write, move, and verify loops.',
    'Define accept/reject/loop branches and guard conditions.',
    'Validate transitions for every tape symbol in active states.',
    'Open TM workspace and implement transition table with step testing.'
  ];

  return {
    headline: 'REL conversion plan ready for TM.',
    inputClass: 'Recursively Enumerable Language (REL)',
    targetMachine: 'Turing Machine Studio',
    complexity: 'General recursive behavior. Ensure halting and rejection paths are intentional.',
    notes,
    steps,
    transitions: buildRelTransitionRows(rel)
  };
}

function renderRlTransitionTable(rows) {
  const body = byId('rlTransitionTableBody');
  if (!body) return;
  body.innerHTML = '';
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escHtml(row.from)}</td>
      <td>${escHtml(displaySymbol(row.symbol))}</td>
      <td>${escHtml(row.to)}</td>
      <td>${escHtml(row.role)}</td>
    `;
    body.appendChild(tr);
  });
}

function renderRelTransitionTable(rows) {
  const body = byId('relTransitionTableBody');
  if (!body) return;
  body.innerHTML = '';
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escHtml(row.state)}</td>
      <td>${escHtml(displaySymbol(row.read))}</td>
      <td>${escHtml(displaySymbol(row.write))}</td>
      <td>${escHtml(row.move)}</td>
      <td>${escHtml(row.next)}</td>
      <td>${escHtml(row.role)}</td>
    `;
    body.appendChild(tr);
  });
}

async function animatePlanSteps(lines, hostId) {
  const host = byId(hostId);
  if (!host) return;
  host.innerHTML = '';
  for (let i = 0; i < lines.length; i += 1) {
    const card = document.createElement('div');
    card.style.cssText = 'padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;background:#ffffff;margin-bottom:8px;';
    card.innerHTML = `<strong>Step ${i + 1}:</strong> ${escHtml(lines[i])}`;
    host.appendChild(card);
    card.style.background = '#eff6ff';
    await new Promise((resolve) => setTimeout(resolve, 280));
    card.style.background = '#ffffff';
    host.scrollTop = host.scrollHeight;
  }
}

async function renderRlPlan(plan) {
  byId('rlConversionHeadline').textContent = plan.headline;
  byId('rlInputClass').textContent = plan.inputClass;
  byId('rlTargetMachine').textContent = plan.targetMachine;
  byId('rlComplexityNote').textContent = plan.complexity;

  const checklist = byId('rlConversionChecklist');
  checklist.innerHTML = '';
  plan.notes.forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    checklist.appendChild(li);
  });

  renderRlTransitionTable(plan.transitions || []);
  tabSwitch('rl');
  await animatePlanSteps(plan.steps, 'rlConversionSteps');
}

async function renderRelPlan(plan) {
  byId('relConversionHeadline').textContent = plan.headline;
  byId('relInputClass').textContent = plan.inputClass;
  byId('relTargetMachine').textContent = plan.targetMachine;
  byId('relComplexityNote').textContent = plan.complexity;

  const checklist = byId('relConversionChecklist');
  checklist.innerHTML = '';
  plan.notes.forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    checklist.appendChild(li);
  });

  renderRelTransitionTable(plan.transitions || []);
  tabSwitch('rel');
  await animatePlanSteps(plan.steps, 'relConversionSteps');
}

function renderLogicTables(grammar, npda) {
  const rulesBody = byId('grammarRulesTableBody');
  const transitionsBody = byId('grammarTransitionTableBody');
  if (!rulesBody || !transitionsBody) return;

  rulesBody.innerHTML = '';
  grammar.rules.forEach((rule, idx) => {
    const row = document.createElement('tr');
    const rhs = rule.rhs.length ? rule.rhs.map((s) => displaySymbol(s)).join(' ') : EPSILON_SYMBOL;
    const kind = rule.rhs.length === 0 ? 'epsilon' : (rule.rhs.every((s) => isNonTerminal(s)) ? 'non-terminal expansion' : 'mixed/terminal');
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escHtml(rule.lhs)} -> ${escHtml(rhs)}</td>
      <td>${escHtml(kind)}</td>
    `;
    rulesBody.appendChild(row);
  });

  transitionsBody.innerHTML = '';
  npda.transitions.forEach((tr, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escHtml(tr.from)}</td>
      <td>${escHtml(displaySymbol(tr.symbol))}</td>
      <td>${escHtml(displaySymbol(tr.pop))}</td>
      <td>${escHtml(displaySymbol(tr.push))}</td>
      <td>${escHtml(tr.to)}</td>
    `;
    transitionsBody.appendChild(row);
  });
}

function buildConversionSteps(grammar, npda) {
  const steps = [];
  steps.push('Initialize NPDA states: q_start, q_loop, q_accept.');
  steps.push(`Push start symbol ${grammar.startSymbol} above stack marker Z.`);
  grammar.rules.forEach((r) => {
    steps.push(`Add expansion transition: (${r.lhs} -> ${r.rhs.length ? r.rhs.map((s) => displaySymbol(s)).join(' ') : EPSILON_SYMBOL}).`);
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
  const terminalText = Array.from(latestGrammar.terminals).map((s) => displaySymbol(s)).join(', ') || '(none)';
  setStatus(`Valid CFG. Non-terminals: <strong>${Array.from(latestGrammar.nonTerminals).join(', ')}</strong> | Terminals: <strong>${terminalText}</strong>`);
  return latestGrammar;
}

function createNpdaFlow() {
  const grammar = latestGrammar || validateGrammarFlow();
  latestNpda = buildNpda(grammar);
  renderLogicTables(grammar, latestNpda);
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
  const rawTarget = byId('parseTarget').value.trim();
  if (!rawTarget) throw new Error('Target string is required.');
  const target = isEpsilonToken(rawTarget) ? '' : rawTarget;

  const result = deriveLeftmost(grammar, target);
  if (!result.success) throw new Error(result.reason || 'No parse tree could be generated.');

  renderParseTree(result.result);
  tabSwitch('tree');

  const list = byId('grammarDerivationList');
  const timeline = byId('grammarDerivationTimeline');
  list.innerHTML = '';
  if (timeline) timeline.innerHTML = '';
  const first = document.createElement('li');
  first.textContent = grammar.startSymbol;
  list.appendChild(first);
  if (timeline) {
    const startCard = document.createElement('div');
    startCard.style.cssText = 'padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;background:#ffffff;margin-bottom:8px;';
    startCard.innerHTML = `<strong>Step 0:</strong> Start with ${escHtml(grammar.startSymbol)}`;
    timeline.appendChild(startCard);
  }

  let current = grammar.startSymbol;
  result.result.steps.forEach((s) => {
    const [lhs, rhsRaw] = s.split('->').map((v) => v.trim());
    const rhsText = rhsRaw === EPSILON_SYMBOL ? '' : rhsRaw.replace(/\s+/g, '');
    const idx = current.indexOf(lhs);
    if (idx >= 0) {
      current = `${current.slice(0, idx)}${rhsText}${current.slice(idx + lhs.length)}`;
    }
    const li = document.createElement('li');
    li.textContent = `${s}    =>    ${current || EPSILON_SYMBOL}`;
    list.appendChild(li);
    if (timeline) {
      const card = document.createElement('div');
      card.style.cssText = 'padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;background:#ffffff;margin-bottom:8px;';
      card.innerHTML = `<strong>Step ${list.children.length - 1}:</strong> ${escHtml(s)} <br/><span style="color:#0f766e;font-weight:600;">${escHtml(current || EPSILON_SYMBOL)}</span>`;
      timeline.appendChild(card);
    }
  });

  setStatus(`Parse tree generated for string: <strong>${escHtml(target || EPSILON_SYMBOL)}</strong>`);
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

function openRoute(route) {
  const safeRoute = String(route || '').toLowerCase();
  try {
    sessionStorage.setItem(ACTIVE_ROUTE_KEY, safeRoute);
  } catch (_e) {}
  window.location.href = safeRoute === 'grammar' ? 'grammar_studio.html' : `index.html#${safeRoute}`;
}

function stashCrossPrompt(key, text) {
  const cleaned = String(text || '').trim();
  if (!cleaned) return;
  try {
    localStorage.setItem(key, cleaned);
  } catch (_e) {}
}

function openInPdaFlow() {
  if (!latestNpda) createNpdaFlow();
  localStorage.setItem(PENDING_PDA_KEY, JSON.stringify(latestNpda));
  openRoute('pda');
}

function regexToFaFlow() {
  const regex = byId('grammarRegexInput').value.trim();
  if (!regex) throw new Error('Enter a regex first.');
  const { machine } = buildFaMachineForImport(regex);
  setPendingImportedMachine('fa', machine);
  openRoute('fa');
}

function rlToFaFlow() {
  const rl = byId('rlInput').value.trim();
  if (!rl) throw new Error('Enter RL input first.');
  const { machine, fallback } = buildFaMachineForImport(rl);
  setPendingImportedMachine('fa', machine);
  if (fallback) {
    setRlRelStatus('Used fallback RL-to-FA conversion skeleton. You can refine transitions after opening FA.');
  }
  openRoute('fa');
}

async function previewRlToFaFlow() {
  const rl = byId('rlInput').value.trim();
  if (!rl) throw new Error('Enter RL input first.');
  const plan = buildRlPlan(rl, 'FA');
  await renderRlPlan(plan);
  setRlRelStatus('RL to FA conversion plan generated. Review steps and open FA when ready.');
}

function rlToMmFlow() {
  const rl = byId('rlInput').value.trim();
  if (!rl) throw new Error('Enter RL input first.');
  stashCrossPrompt(PENDING_MM_PROMPT_KEY, `RL input from Grammar: ${rl}`);
  openRoute('mm');
}

async function previewRlToMmFlow() {
  const rl = byId('rlInput').value.trim();
  if (!rl) throw new Error('Enter RL input first.');
  const plan = buildRlPlan(rl, 'MM');
  await renderRlPlan(plan);
  setRlRelStatus('RL to Mealy/Moore conversion plan generated. Review architecture before switching studio.');
}

function openFaFlow() {
  openRoute('fa');
}

function openMmFlow() {
  openRoute('mm');
}

function openTmFlow() {
  openRoute('tm');
}

function relToTmFlow() {
  const rel = byId('relInput').value.trim();
  if (!rel) throw new Error('Enter REL input first.');
  const tmMachine = buildTmMachineFromRel(rel);
  setPendingImportedMachine('tm', tmMachine);
  stashCrossPrompt(PENDING_TM_PROMPT_KEY, `REL input from Grammar: ${rel}`);
  openRoute('tm');
}

async function previewRelToTmFlow() {
  const rel = byId('relInput').value.trim();
  if (!rel) throw new Error('Enter REL input first.');
  const plan = buildRelPlan(rel);
  await renderRelPlan(plan);
  setRlRelStatus('REL to TM conversion plan generated. Validate the workflow and then open TM.');
}

function cfgLemmaGuideFlow() {
  const lang = byId('cfgLanguageInput').value.trim() || 'L';
  const witness = byId('cfgWitnessInput').value.trim() || 'w';
  const split = byId('cfgSplitInput').value.trim() || 'w = uvxyz';
  const output = byId('cfgLemmaOutput');
  output.innerHTML = [
    `Assume <strong>${escHtml(lang)}</strong> is context-free and pumping length is p.`,
    `Pick witness <strong>${escHtml(witness)}</strong> with |w| >= p.`,
    `For every split <strong>${escHtml(split)}</strong> with |vxy| <= p and |vy| > 0,`,
    'choose i=0 or i=2 and show uv^i x y^i z is not in the language.',
    'Contradiction implies language is not context-free (or refine witness if contradiction fails).'
  ].join('<br/>');
}

function hydratePendingGrammarImport() {
  const pendingGrammar = consumePendingImportedMachine('grammar');
  if (!pendingGrammar) return;
  if (Array.isArray(pendingGrammar.rules) && pendingGrammar.startSymbol) {
    const lines = pendingGrammar.rules.map((r) => `${r.lhs} -> ${r.rhs && r.rhs.length ? r.rhs.map((s) => displaySymbol(s)).join(' ') : EPSILON_SYMBOL}`);
    byId('grammarInput').value = lines.join('\n');
    byId('grammarStart').value = pendingGrammar.startSymbol;
    setStatus('Imported grammar JSON from cross-studio loader.');
  }
}

function init() {
  document.querySelectorAll('.grammar-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => tabSwitch(btn.getAttribute('data-tab')));
  });

  byId('grammarBackBtn').addEventListener('click', () => {
    try {
      sessionStorage.removeItem(ACTIVE_ROUTE_KEY);
    } catch (_e) {}
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
      tabSwitch('tree');
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

  byId('grammarRegexToFaBtn').addEventListener('click', () => {
    try {
      regexToFaFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('grammarOpenTmBtn').addEventListener('click', () => {
    try {
      openTmFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  byId('rlOpenFaBtn')?.addEventListener('click', () => {
    try {
      rlToFaFlow();
    } catch (err) {
      setRlRelStatus(escHtml(err.message), true);
    }
  });

  byId('rlOpenMmBtn')?.addEventListener('click', () => {
    try {
      rlToMmFlow();
    } catch (err) {
      setRlRelStatus(escHtml(err.message), true);
    }
  });

  byId('relOpenTmBtn')?.addEventListener('click', () => {
    try {
      relToTmFlow();
    } catch (err) {
      setRlRelStatus(escHtml(err.message), true);
    }
  });

  byId('rlPreviewFaBtn')?.addEventListener('click', async () => {
    try {
      await previewRlToFaFlow();
    } catch (err) {
      setRlRelStatus(escHtml(err.message), true);
    }
  });

  byId('rlPreviewMmBtn')?.addEventListener('click', async () => {
    try {
      await previewRlToMmFlow();
    } catch (err) {
      setRlRelStatus(escHtml(err.message), true);
    }
  });

  byId('relPreviewTmBtn')?.addEventListener('click', async () => {
    try {
      await previewRelToTmFlow();
    } catch (err) {
      setRlRelStatus(escHtml(err.message), true);
    }
  });

  byId('switchToFaBtn')?.addEventListener('click', () => openFaFlow());
  byId('switchToMmBtn')?.addEventListener('click', () => openMmFlow());
  byId('switchToPdaBtn')?.addEventListener('click', () => openInPdaFlow());
  byId('switchToTmBtn')?.addEventListener('click', () => openTmFlow());

  byId('cfgLemmaGuideBtn').addEventListener('click', () => {
    try {
      cfgLemmaGuideFlow();
    } catch (err) {
      setStatus(escHtml(err.message), true);
    }
  });

  document.addEventListener('keydown', (e) => {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
    if (!(e.ctrlKey && e.altKey)) return;
    const key = e.key.toLowerCase();
    if (!['1', '2', '3', '4', '5'].includes(key)) return;
    e.preventDefault();
    if (key === '1') openFaFlow();
    if (key === '2') openMmFlow();
    if (key === '3') openInPdaFlow();
    if (key === '4') openTmFlow();
    if (key === '5') tabSwitch('steps');
  });

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  try {
    hydratePendingGrammarImport();
    validateGrammarFlow();
    createNpdaFlow();
    tabSwitch('steps');
  } catch (_e) {
    // keep UI interactive even with malformed default input
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


