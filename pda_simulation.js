/**
 * pda_simulation.js
 * Non-deterministic simulation engine for Pushdown Automata.
 */

import { addLogMessage } from './utils.js';

export function runPdaSimulation(inputString, machine) {
    const { states, transitions, initialStackSymbol, acceptanceMode } = machine;
    const initialState = states.find((s) => s.initial);

    if (!initialState) return { success: false, message: 'No initial state defined.' };

    let queue = [{
        state: initialState.id,
        input: inputString,
        stack: [initialStackSymbol || 'Z'],
        path: []
    }];

    const MAX_STEPS = 1000;
    let steps = 0;

    while (queue.length > 0 && steps < MAX_STEPS) {
        steps += 1;
        const { state, input, stack, path } = queue.shift();

        const currentStateObj = states.find((s) => s.id === state);
        const inputDone = input.length === 0;
        const byFinal = !!currentStateObj?.accepting;
        const byEmptyStack = stack.length === 0;
        const mode = String(acceptanceMode || 'FINAL_STATE').toUpperCase();
        const accepted =
            mode === 'EMPTY_STACK' ? (inputDone && byEmptyStack) :
            mode === 'BOTH' ? (inputDone && byFinal && byEmptyStack) :
            (inputDone && byFinal);

        if (accepted) {
            return { success: true, path: [...path, { state, input: 'eps', stack: [...stack] }] };
        }

        const currentSymbol = input.length > 0 ? input[0] : null;
        const stackTop = stack.length > 0 ? stack[stack.length - 1] : null;

        const possibleTransitions = transitions.filter((t) => {
            const matchInput = (t.symbol === currentSymbol || isEpsilon(t.symbol));
            const matchStack = (isEpsilon(t.pop) || t.pop === stackTop);
            return t.from === state && matchInput && matchStack;
        });

        for (const t of possibleTransitions) {
            const nextStack = [...stack];

            if (!isEpsilon(t.pop)) {
                if (nextStack.length === 0 || nextStack[nextStack.length - 1] !== t.pop) {
                    continue;
                }
                nextStack.pop();
            }

            if (!isEpsilon(t.push)) {
                const symbols = String(t.push).split('');
                for (let i = symbols.length - 1; i >= 0; i -= 1) {
                    nextStack.push(symbols[i]);
                }
            }

            const nextInput = !isEpsilon(t.symbol) ? input.substring(1) : input;

            queue.push({
                state: t.to,
                input: nextInput,
                stack: nextStack,
                path: [...path, { state, input: t.symbol || 'eps', stack: [...stack], transition: t }]
            });
        }
    }

    const timeout = steps >= MAX_STEPS;
    addLogMessage(timeout ? 'PDA simulation stopped: step limit reached.' : 'PDA simulation rejected input.', timeout ? 'timer' : 'x-circle');
    return {
        success: false,
        message: timeout ? 'Possible infinite loop detected.' : 'Input string rejected by PDA logic.'
    };
}

function isEpsilon(v) {
    const s = String(v || '').trim().toLowerCase();
    return s === '' || s === 'eps' || s === 'ε' || s === 'îµ';
}
