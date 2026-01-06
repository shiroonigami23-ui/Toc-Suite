/**
 * pda_simulation.js
 * Non-deterministic simulation engine for Pushdown Automata.
 */

import { addLogMessage } from './utils.js';

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

    const MAX_STEPS = 1000; // Increased for complex grammars
    let steps = 0;

    while (queue.length > 0 && steps < MAX_STEPS) {
        steps++;
        const { state, input, stack, path } = queue.shift();

        // 1. Acceptance Condition: Input exhausted AND Current State is Accepting
        const currentStateObj = states.find(s => s.id === state);
        if (input.length === 0 && currentStateObj.accepting) {
            return { success: true, path: [...path, { state, input: 'ε', stack: [...stack] }] };
        }

        // 2. Identify current environment
        const currentSymbol = input.length > 0 ? input[0] : null;
        const stackTop = stack.length > 0 ? stack[stack.length - 1] : null;

        // 3. ARCHITECTURAL FIX: Strict Transition Filtering
        const possibleTransitions = transitions.filter(t => {
            // Check Input Match (Symbol or Epsilon)
            const matchInput = (t.symbol === currentSymbol || t.symbol === 'ε' || t.symbol === '');
            
            // STRICT STACK MATCH: 
            // If transition specifies a pop symbol, it MUST match the stack top.
            // If transition specifies ε, it doesn't care about the stack top.
            const matchStack = (t.pop === 'ε' || t.pop === '' || t.pop === stackTop);
            
            return t.from === state && matchInput && matchStack;
        });

        for (const t of possibleTransitions) {
            const nextStack = [...stack];
            
            // 4. EXECUTE POP: Only pop if a specific symbol (not ε) was required
            if (t.pop && t.pop !== 'ε') {
                if (nextStack.length === 0 || nextStack[nextStack.length - 1] !== t.pop) {
                    continue; // Double-safety: skip if stack was unexpectedly empty or mismatched
                }
                nextStack.pop();
            }

            // 5. EXECUTE PUSH: Standard PDA logic (Right-to-left)
            if (t.push && t.push !== 'ε') {
                const symbols = t.push.split('');
                // To keep the first character of the string at the TOP of the stack:
                // We reverse the string and push characters one by one.
                for (let i = symbols.length - 1; i >= 0; i--) {
                    nextStack.push(symbols[i]);
                }
            }

            // 6. Consuming input only if transition was not ε
            const nextInput = (t.symbol && t.symbol !== 'ε') ? input.substring(1) : input;

            queue.push({
                state: t.to,
                input: nextInput,
                stack: nextStack,
                path: [...path, { state, input: t.symbol || 'ε', stack: [...stack], transition: t }]
            });
        }
    }

    return { 
        success: false, 
        message: steps >= MAX_STEPS ? "Possible infinite loop detected." : "Input string rejected by PDA logic." 
    };
}