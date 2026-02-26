// regex-converter.js

let stateCounter = 0;

function newStateId() {
  return `s${stateCounter++}`;
}

function makeState(id) {
  return { id, initial: false, accepting: false, x: 0, y: 0 };
}

function makeFragment(start, end, states, transitions) {
  return { start, end, states, transitions };
}

function createEpsilonFragment() {
  const start = newStateId();
  const end = newStateId();
  return makeFragment(
    start,
    end,
    [makeState(start), makeState(end)],
    [{ from: start, to: end, symbol: '' }]
  );
}

export function createSymbolNfa(symbol) {
  const start = newStateId();
  const end = newStateId();
  return makeFragment(
    start,
    end,
    [makeState(start), makeState(end)],
    [{ from: start, to: end, symbol: String(symbol || '') }]
  );
}

export function createConcatenationNfa(nfa1, nfa2) {
  return makeFragment(
    nfa1.start,
    nfa2.end,
    [...nfa1.states, ...nfa2.states],
    [...nfa1.transitions, ...nfa2.transitions, { from: nfa1.end, to: nfa2.start, symbol: '' }]
  );
}

function createUnionNfa(nfa1, nfa2) {
  const start = newStateId();
  const end = newStateId();
  return makeFragment(
    start,
    end,
    [makeState(start), makeState(end), ...nfa1.states, ...nfa2.states],
    [
      ...nfa1.transitions,
      ...nfa2.transitions,
      { from: start, to: nfa1.start, symbol: '' },
      { from: start, to: nfa2.start, symbol: '' },
      { from: nfa1.end, to: end, symbol: '' },
      { from: nfa2.end, to: end, symbol: '' }
    ]
  );
}

function createStarNfa(nfa) {
  const start = newStateId();
  const end = newStateId();
  return makeFragment(
    start,
    end,
    [makeState(start), makeState(end), ...nfa.states],
    [
      ...nfa.transitions,
      { from: start, to: nfa.start, symbol: '' },
      { from: start, to: end, symbol: '' },
      { from: nfa.end, to: nfa.start, symbol: '' },
      { from: nfa.end, to: end, symbol: '' }
    ]
  );
}

function normalizeRegexInput(regex) {
  const raw = String(regex || '').trim();
  if (!raw) throw new Error('Regex input is empty.');
  return raw.replace(/\bor\b/gi, '|').replace(/\s+/g, '');
}

function tokenize(regex) {
  const src = normalizeRegexInput(regex);
  const tokens = [];
  let i = 0;

  while (i < src.length) {
    const ch = src[i];
    const rest = src.slice(i).toLowerCase();

    if (ch === '(') {
      tokens.push({ type: 'LPAREN' });
      i += 1;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN' });
      i += 1;
      continue;
    }
    if (ch === '|') {
      tokens.push({ type: 'UNION' });
      i += 1;
      continue;
    }
    if (ch === '*') {
      tokens.push({ type: 'STAR' });
      i += 1;
      continue;
    }
    if (ch === '.') {
      tokens.push({ type: 'CONCAT' });
      i += 1;
      continue;
    }
    if (ch === 'e' && rest.startsWith('epsilon')) {
      tokens.push({ type: 'EPS' });
      i += 7;
      continue;
    }
    if (ch === 'e' && rest.startsWith('eps')) {
      tokens.push({ type: 'EPS' });
      i += 3;
      continue;
    }
    if (ch === 'l' && rest.startsWith('lambda')) {
      tokens.push({ type: 'EPS' });
      i += 6;
      continue;
    }
    if (ch === 'ε' || ch === 'ϵ' || ch === 'λ') {
      tokens.push({ type: 'EPS' });
      i += 1;
      continue;
    }
    if (/[a-z0-9_]/i.test(ch)) {
      tokens.push({ type: 'SYMBOL', value: ch });
      i += 1;
      continue;
    }

    throw new Error(`Unsupported regex token '${ch}'`);
  }

  const expanded = [];
  const needsConcat = (left, right) => {
    const leftOk = ['SYMBOL', 'EPS', 'RPAREN', 'STAR'].includes(left.type);
    const rightOk = ['SYMBOL', 'EPS', 'LPAREN'].includes(right.type);
    return leftOk && rightOk;
  };

  for (let idx = 0; idx < tokens.length; idx += 1) {
    const cur = tokens[idx];
    const prev = expanded.length ? expanded[expanded.length - 1] : null;
    if (prev && needsConcat(prev, cur)) {
      expanded.push({ type: 'CONCAT' });
    }
    expanded.push(cur);
  }

  return expanded;
}

function toPostfix(tokens) {
  const output = [];
  const stack = [];
  const precedence = { UNION: 1, CONCAT: 2, STAR: 3 };

  tokens.forEach((token) => {
    if (token.type === 'SYMBOL' || token.type === 'EPS') {
      output.push(token);
      return;
    }
    if (token.type === 'LPAREN') {
      stack.push(token);
      return;
    }
    if (token.type === 'RPAREN') {
      while (stack.length && stack[stack.length - 1].type !== 'LPAREN') {
        output.push(stack.pop());
      }
      if (!stack.length) throw new Error('Unbalanced parentheses in regex.');
      stack.pop();
      return;
    }

    while (
      stack.length &&
      stack[stack.length - 1].type !== 'LPAREN' &&
      precedence[stack[stack.length - 1].type] >= precedence[token.type]
    ) {
      output.push(stack.pop());
    }
    stack.push(token);
  });

  while (stack.length) {
    const op = stack.pop();
    if (op.type === 'LPAREN' || op.type === 'RPAREN') {
      throw new Error('Unbalanced parentheses in regex.');
    }
    output.push(op);
  }

  return output;
}

function buildFromPostfix(postfix) {
  const st = [];

  postfix.forEach((token) => {
    if (token.type === 'SYMBOL') {
      st.push(createSymbolNfa(token.value));
      return;
    }
    if (token.type === 'EPS') {
      st.push(createEpsilonFragment());
      return;
    }
    if (token.type === 'STAR') {
      if (st.length < 1) throw new Error('Invalid regex: missing operand for *');
      const a = st.pop();
      st.push(createStarNfa(a));
      return;
    }
    if (token.type === 'CONCAT') {
      if (st.length < 2) throw new Error('Invalid regex: missing operands for concatenation');
      const right = st.pop();
      const left = st.pop();
      st.push(createConcatenationNfa(left, right));
      return;
    }
    if (token.type === 'UNION') {
      if (st.length < 2) throw new Error('Invalid regex: missing operands for union');
      const right = st.pop();
      const left = st.pop();
      st.push(createUnionNfa(left, right));
      return;
    }
  });

  if (st.length !== 1) throw new Error('Invalid regex: could not resolve expression.');
  return st[0];
}

function layoutStates(states, transitions, startId) {
  const stateMap = new Map(states.map((s) => [s.id, s]));
  const outgoing = new Map();
  transitions.forEach((tr) => {
    if (!outgoing.has(tr.from)) outgoing.set(tr.from, []);
    outgoing.get(tr.from).push(tr.to);
  });

  const levels = new Map();
  const q = [startId];
  levels.set(startId, 0);

  while (q.length) {
    const cur = q.shift();
    const lvl = levels.get(cur) ?? 0;
    const next = outgoing.get(cur) || [];
    next.forEach((to) => {
      if (!levels.has(to)) {
        levels.set(to, lvl + 1);
        q.push(to);
      }
    });
  }

  let fallbackLevel = Math.max(0, ...Array.from(levels.values()));
  states.forEach((s) => {
    if (!levels.has(s.id)) {
      fallbackLevel += 1;
      levels.set(s.id, fallbackLevel);
    }
  });

  const grouped = new Map();
  states.forEach((s) => {
    const lvl = levels.get(s.id) ?? 0;
    if (!grouped.has(lvl)) grouped.set(lvl, []);
    grouped.get(lvl).push(s.id);
  });

  Array.from(grouped.keys()).sort((a, b) => a - b).forEach((lvl) => {
    const ids = grouped.get(lvl);
    ids.forEach((id, idx) => {
      const node = stateMap.get(id);
      node.x = 160 + (lvl * 170);
      node.y = 180 + (idx * 110);
    });
  });
}

export function parseRegexAndBuildEnfa(regex) {
  stateCounter = 0;
  const tokens = tokenize(regex);
  const postfix = toPostfix(tokens);
  const nfa = buildFromPostfix(postfix);

  nfa.states.forEach((s) => {
    s.initial = s.id === nfa.start;
    s.accepting = s.id === nfa.end;
  });

  layoutStates(nfa.states, nfa.transitions, nfa.start);

  return {
    type: 'ENFA',
    states: nfa.states,
    transitions: nfa.transitions,
    alphabet: Array.from(new Set(nfa.transitions.map((t) => t.symbol).filter((s) => s !== '')))
  };
}
