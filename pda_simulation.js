
/**
 * pda_simulation.js
 * Non-deterministic simulation engine for Pushdown Automata.
 */

import { addLogMessage } from './utils.js';

/**
 * Runs a string through the PDA.
 * @param {string} inputString - The input to test.
 * @param {object} machine - The PDA machine object.
 * @returns {object} Result containing success boolean and the path taken.
 */
export function runPdaSimulation(inputString, machine) {
    const { states, transitions, initialStackSymbol } = machine;
    const initialState = states.find(s => s.initial);
    
    if (!initialState) return { success: false, message: "No initial state defined." };

    // A configuration is [currentStateId, remainingInput, stackArray]
    let queue = [{
        state: initialState.id,
        input: inputString,
        stack: [initialStackSymbol || 'Z'],
        path: []
    }];

    const MAX_STEPS = 500; // Prevent infinite loops in epsilon-cycles
    let steps = 0;

    while (queue.length > 0 && steps < MAX_STEPS) {
        steps++;
        const { state, input, stack, path } = queue.shift();

        // Check for acceptance: current state is accepting AND input is exhausted
        const currentStateObj = states.find(s => s.id === state);
        if (input.length === 0 && currentStateObj.accepting) {
            return { success: true, path: [...path, { state, input: 'ε', stack: [...stack] }] };
        }

        // Find applicable transitions (consuming input OR epsilon transitions)
        const currentSymbol = input.length > 0 ? input[0] : null;
        const stackTop = stack.length > 0 ? stack[stack.length - 1] : null;

        const possibleTransitions = transitions.filter(t => {
            const matchInput = (t.symbol === currentSymbol || t.symbol === '' || t.symbol === 'ε');
            const matchStack = (t.pop === stackTop || t.pop === '' || t.pop === 'ε');
            return t.from === state && matchInput && matchStack;
        });

        for (const t of possibleTransitions) {
            const nextStack = [...stack];
            
            // 1. Pop operation
            if (t.pop && t.pop !== 'ε') {
                nextStack.pop();
            }

            // 2. Push operation (Right-to-left push so the first char is top)
            if (t.push && t.push !== 'ε') {
                const toPush = t.push.split('').reverse();
                toPush.forEach(char => nextStack.push(char));
            }

            const nextInput = (t.symbol && t.symbol !== 'ε') ? input.substring(1) : input;

            queue.push({
                state: t.to,
                input: nextInput,
                stack: nextStack,
                path: [...path, { state, input: t.symbol || 'ε', stack: [...stack], transition: t }]
            });
        }
    }

    return { success: false, message: steps >= MAX_STEPS ? "Simulation timed out (possible infinite loop)." : "String rejected." };
}