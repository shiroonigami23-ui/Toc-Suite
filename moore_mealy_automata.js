import { MACHINE } from './moore_mealy_state.js';
import { addLogMessage } from './utils.js';

/**
 * Validates the structure of a Mealy or Moore machine.
 * @returns {{type: 'success'|'error'|'info', message: string}}
 */
export function validateAutomaton() {
    if (!MACHINE || !Array.isArray(MACHINE.states) || !Array.isArray(MACHINE.transitions)) {
        return { type: 'error', message: 'Invalid machine structure.' };
    }

    const { states, transitions, type } = MACHINE;
    const stateIds = new Set(states.map(s => s.id));
    
    if (states.length === 0) {
        return { type: 'info', message: 'Canvas is empty. Add states to begin.' };
    }

    // --- RULE 1: Initial State Check (Must be exactly one, for determinism) ---
    const initialStates = states.filter(s => s.initial);
    if (initialStates.length !== 1) {
        return { type: 'error', message: `${type} Rule: Must have exactly one initial state.` };
    }

    // --- RULE 2: Transition Integrity Check ---
    for (const t of transitions) {
        if (!stateIds.has(t.from) || !stateIds.has(t.to)) {
            return { type: 'error', message: `Transition refers to a non-existent state (${t.from} or ${t.to}).` };
        }
        if (t.symbol === '' || t.symbol === 'ε') {
             return { type: 'error', message: `Transition Rule: ${type} machines do not permit $\\epsilon$-transitions.` };
        }
    }

    // --- Determine Input Alphabet for Total Function Check ---
    const inputAlphabet = [...new Set(transitions.map(t => t.symbol))];
    if (inputAlphabet.length === 0) {
        return { type: 'error', message: 'No input symbols defined in transitions.' };
    }


    for (const state of states) {
        const outgoingTransitions = transitions.filter(tr => tr.from === state.id);
        const outgoingSymbols = new Set(outgoingTransitions.map(t => t.symbol));
        
        // --- RULE 3: Total Function & Determinism Check ---
        for (const symbol of inputAlphabet) {
            const transitionsForSymbol = outgoingTransitions.filter(t => t.symbol === symbol);
            if (transitionsForSymbol.length === 0) {
                 return { type: 'error', message: `Determinism Rule: State ${state.id} is missing a transition for input '${symbol}'.`};
            }
            if (transitionsForSymbol.length > 1) {
                // This shouldn't happen if we enforce single symbol input per transition, but check for safety.
                 return { type: 'error', message: `Determinism Rule: State ${state.id} has multiple transitions for input '${symbol}'.`};
            }
        }
        
        // --- RULE 4: Machine Type Specific Output Check ---
        if (type === 'MOORE') {
            if (!state.output || state.output.length === 0) {
                return { type: 'error', message: `Moore Rule: State ${state.id} must define a Moore Output ($\lambda(q)$).` };
            }
            // Moore states don't have accepting, so we check for unexpected properties
            if (state.accepting !== undefined && state.accepting !== false) {
                 return { type: 'info', message: `Moore machines do not use accepting states. Please remove the 'Final' property from ${state.id}.` };
            }
        } else if (type === 'MEALY') {
            for (const t of outgoingTransitions) {
                if (!t.output || t.output.length === 0) {
                    return { type: 'error', message: `Mealy Rule: Transition (${t.from} $\\to$ ${t.to} on '${t.symbol}') must define a Mealy Output $\gamma(q, a)$.` };
                }
            }
            // Mealy states also don't have accepting
             if (state.accepting !== undefined && state.accepting !== false) {
                 return { type: 'info', message: `Mealy machines do not use accepting states. Please remove the 'Final' property from ${state.id}.` };
            }
        }
    }

    return { type: 'success', message: `${type} is Valid (Deterministic and Total).` };
}


/**
 * Converts a Moore Machine to an equivalent Mealy Machine.
 * This is done by creating a new Mealy machine where the output of any transition
 * leading to a state 'q' is set to the Moore output of 'q'.
 * * NOTE: The Moore output for the initial state $q_0$ must be defined, but since
 * a Moore machine outputs one symbol more than the input, this initial output
 * is often ignored in Mealy equivalence. Here, we perform the mechanical conversion.
 *
 * @param {object} mooreMachine The Moore machine object.
 * @param {function} stepCallback Function to call after each step (for animation).
 * @returns {Promise<object>} The equivalent Mealy machine.
 */
export async function convertMooreToMealy(mooreMachine, stepCallback = async () => {}) {
    const mm = JSON.parse(JSON.stringify(mooreMachine));

    await stepCallback(mm, "Starting Moore $\\to$ Mealy conversion. States remain the same.");
    
    mm.type = 'MEALY';
    mm.transitions = [];

    // Map all states in the Moore machine for easy lookup
    const mooreStatesMap = new Map(mm.states.map(s => [s.id, s]));
    
    // Use the original Moore transitions to build the new Mealy transitions
    const originalTransitions = mooreMachine.transitions;

    for (const t of originalTransitions) {
        // In the Moore machine, the output is defined by the destination state.
        const destinationState = mooreStatesMap.get(t.to);
        
        // The output of the Mealy transition is the Moore output of the destination state.
        const output = destinationState.output;

        if (!output) {
            throw new Error(`Moore state ${t.to} is missing an output ($\lambda$). Conversion failed.`);
        }
        
        const newTransition = {
            from: t.from,
            to: t.to,
            symbol: t.symbol, // The input symbol remains the same
            output: output     // The new Mealy output is $\lambda(q_{\\text{dest}})$
        };
        
        mm.transitions.push(newTransition);

        await stepCallback(mm, `Converted $\\delta(q_{\\text{from}}, a) = q_{\\text{to}}$ to $\\gamma(q_{\\text{from}}, a) = ${output}$ for input '<strong>${t.symbol}</strong>'.`);
    }

    // Moore states defined their output directly on the state; Mealy states do not.
    // Clean up the output property from states after copying it to transitions.
    mm.states.forEach(s => delete s.output);

    await stepCallback(mm, "Conversion complete. State outputs ($\lambda$) have been moved to transition outputs ($\gamma$).");

    // The final machine has the original states and the new Mealy transitions
    return mm;
}


/**
 * Converts a Mealy Machine to an equivalent Moore Machine with animation support.
 */
export async function convertMealyToMoore(machine, stepCallback = async () => {}) {
    const newStates = [];
    const newTransitions = [];
    const stateMapping = new Map();

    await stepCallback(machine, "Analyzing Mealy transitions for state-output pairs...");

    // 1. Identify all unique (State, Output) pairs
    machine.states.forEach(s => {
        const incomingOutputs = [...new Set(
            machine.transitions.filter(t => t.to === s.id).map(t => t.output)
        )];
        
        if (s.initial && incomingOutputs.length === 0) incomingOutputs.push('0');

        incomingOutputs.forEach(out => {
            const newId = `${s.id}_${out}`;
            newStates.push({
                id: newId, x: s.x, y: s.y,
                initial: s.initial && out === '0',
                output: out
            });
            stateMapping.set(`${s.id}|${out}`, newId);
        });
    });

    const intermediateMachine = { ...machine, states: newStates, transitions: [] };
    await stepCallback(intermediateMachine, `Split states into ${newStates.length} Moore states based on unique outputs.`);

    // 2. Build Moore Transitions
    machine.transitions.forEach(t => {
        newStates.filter(ns => ns.id.startsWith(t.from)).forEach(sourceNS => {
            const targetNSId = stateMapping.get(`${t.to}|${t.output}`);
            newTransitions.push({
                from: sourceNS.id,
                to: targetNSId,
                symbol: t.symbol
            });
        });
    });

    const finalResult = { type: 'MOORE', states: newStates, transitions: newTransitions };
    await stepCallback(finalResult, "Reconstructed transitions between new Moore states.");

    return finalResult;
}