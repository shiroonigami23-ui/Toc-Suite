/**
 * pda_simulation.js
 * Non-deterministic simulation engine for Pushdown Automata.
 */

import { addLogMessage } from '../shared/utils.js';

export function runPdaSimulation(inputString, machine, { maxConfigs = 60000, silent = false } = {}) {
    const { states, transitions, initialStackSymbol, acceptanceMode } = machine;
    const initialState = states.find((s) => s.initial);

    if (!initialState) return { success: false, message: 'No initial state defined.' };

    const mode = String(acceptanceMode || 'FINAL_STATE').toUpperCase();
    const accepting = new Set(states.filter((s) => s.accepting).map((s) => s.id));
    const byFrom = new Map();
    for (const t of transitions) {
        if (!byFrom.has(t.from)) byFrom.set(t.from, []);
        byFrom.get(t.from).push(t);
    }
    // A PDA can grow its stack forever on ε-moves; no accepting run needs a stack much
    // taller than the remaining input, so taller configurations are pruned.
    const maxPush = Math.max(1, ...transitions.map((t) => (isEpsilon(t.push) ? 0 : String(t.push).length)));
    const stackCap = (remaining) => remaining * maxPush + 2 * states.length + 4;

    // Breadth-first search over configurations (state, input position, stack), each visited once.
    const queue = [{ state: initialState.id, pos: 0, stack: [initialStackSymbol || 'Z'], parent: null, transition: null }];
    const seen = new Set();
    let head = 0;
    let truncated = false;

    while (head < queue.length) {
        if (head >= maxConfigs) { truncated = true; break; }
        const node = queue[head++];
        const key = `${node.state}|${node.pos}|${node.stack.join('\u0001')}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const inputDone = node.pos === inputString.length;
        const byFinal = accepting.has(node.state);
        const byEmptyStack = node.stack.length === 0;
        const accepted =
            mode === 'EMPTY_STACK' ? (inputDone && byEmptyStack) :
            mode === 'BOTH' ? (inputDone && byFinal && byEmptyStack) :
            (inputDone && byFinal);

        if (accepted) return { success: true, path: buildPath(node, inputString) };

        const currentSymbol = inputDone ? null : inputString[node.pos];
        const stackTop = node.stack.length > 0 ? node.stack[node.stack.length - 1] : null;

        for (const t of byFrom.get(node.state) || []) {
            const epsIn = isEpsilon(t.symbol);
            if (!epsIn && t.symbol !== currentSymbol) continue;
            const nextStack = node.stack.slice();
            if (!isEpsilon(t.pop)) {
                if (stackTop !== t.pop) continue;
                nextStack.pop();
            }
            if (!isEpsilon(t.push)) {
                const symbols = String(t.push).split('');
                for (let i = symbols.length - 1; i >= 0; i -= 1) nextStack.push(symbols[i]);
            }
            const pos = epsIn ? node.pos : node.pos + 1;
            if (nextStack.length > stackCap(inputString.length - pos)) { truncated = true; continue; }
            queue.push({ state: t.to, pos, stack: nextStack, parent: node, transition: t });
        }
    }

    if (!silent) {
        addLogMessage(truncated && head >= maxConfigs ? 'PDA simulation stopped: search limit reached.' : 'PDA simulation rejected input.', truncated && head >= maxConfigs ? 'timer' : 'x-circle');
    }
    return {
        success: false,
        message: truncated && head >= maxConfigs ? 'Search limit reached (possible infinite ε-loop).' : 'Input string rejected by PDA logic.'
    };
}

function buildPath(node, input) {
    const chain = [];
    for (let n = node; n; n = n.parent) chain.push(n);
    chain.reverse();
    const path = [];
    for (let i = 0; i < chain.length - 1; i++) {
        const n = chain[i];
        const t = chain[i + 1].transition;
        path.push({ state: n.state, input: t.symbol || 'eps', stack: [...n.stack], transition: t, remaining: input.slice(n.pos) });
    }
    const last = chain[chain.length - 1];
    path.push({ state: last.state, input: 'eps', stack: [...last.stack], remaining: '' });
    return path;
}

function isEpsilon(v) {
    const s = String(v || '').trim().toLowerCase();
    return s === '' || s === 'eps' || s === 'epsilon' || s === 'ε' || s === 'ϵ' || s === 'λ' || s === '_epsilon_' || s === 'îµ';
}
