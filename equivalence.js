import { convertEnfaToNfa, convertNfaToDfa, minimizeDfa } from './automata.js';

/**
 * A helper function to get a machine into a DFA format, ready for minimization.
 * This is an async function because the underlying conversions are now async.
 * @param {object} machine The machine to convert.
 * @param {string[]} [forcedAlphabet] - An optional alphabet to enforce.
 * @returns {Promise<object>} A DFA representation of the machine.
 */
async function toDfa(machine, forcedAlphabet = null) {
    const silentStep = async () => {};
    
    // Ensure the machine object has the alphabet for the conversion functions to use
    const machineWithAlphabet = { ...machine, alphabet: forcedAlphabet || machine.alphabet };

    switch(machine.type) {
        case 'DFA':
            // Even if it's a DFA, we might need to complete it over a larger alphabet
            // The easiest way is to just run it through the NFA->DFA conversion
            return await convertNfaToDfa(machineWithAlphabet, silentStep);
        case 'NFA':
            return await convertNfaToDfa(machineWithAlphabet, silentStep);
        case 'ENFA':
            const nfa = await convertEnfaToNfa(machineWithAlphabet, silentStep);
            // Pass the alphabet along to the next conversion step
            nfa.alphabet = machineWithAlphabet.alphabet;
            return await convertNfaToDfa(nfa, silentStep);
        default:
            throw new Error(`Unknown machine type for conversion: ${machine.type}`);
    }
}

function areIsomorphic(dfaA, dfaB) {
    if (dfaA.states.length !== dfaB.states.length) return false;
    
    // --- FIX: Make alphabet check more robust and use a combined alphabet for the loop ---
    const alphabetA = new Set(dfaA.alphabet || []);
    const alphabetB = new Set(dfaB.alphabet || []);
    if (alphabetA.size !== alphabetB.size || ![...alphabetA].every(symbol => alphabetB.has(symbol))) {
        // This can happen if one machine is fundamentally different. It's a valid early exit.
        console.warn("Isomorphism check failed: Alphabets do not match.", dfaA.alphabet, dfaB.alphabet);
        return false;
    }
    const alphabet = [...alphabetA]; // Use one of the now-guaranteed-to-be-identical alphabets.

    if (dfaA.states.filter(s => s.accepting).length !== dfaB.states.filter(s => s.accepting).length) return false;

    const initialA = dfaA.states.find(s => s.initial);
    const initialB = dfaB.states.find(s => s.initial);

    if (!initialA || !initialB) return false;

    const visitedA = new Set();
    const mapAtoB = new Map();
    const queue = [[initialA.id, initialB.id]];

    visitedA.add(initialA.id);
    mapAtoB.set(initialA.id, initialB.id);

    while (queue.length > 0) {
        const [idA, idB] = queue.shift();
        const stateA = dfaA.states.find(s => s.id === idA);
        const stateB = dfaB.states.find(s => s.id === idB);

        if (stateA.accepting !== stateB.accepting) return false;

        for (const symbol of alphabet) {
            const transA = dfaA.transitions.find(t => t.from === idA && t.symbol === symbol);
            const transB = dfaB.transitions.find(t => t.from === idB && t.symbol === symbol);

            // If one has a transition for the symbol and the other doesn't, they are not isomorphic.
            if (!transA !== !transB) return false;
            
            if (transA && transB) {
                 const nextIdA = transA.to;
                const nextIdB = transB.to;

                if (mapAtoB.has(nextIdA)) {
                    if (mapAtoB.get(nextIdA) !== nextIdB) {
                        return false; // Inconsistent mapping
                    }
                } else {
                    mapAtoB.set(nextIdA, nextIdB);
                    visitedA.add(nextIdA);
                    queue.push([nextIdA, nextIdB]);
                }
            }
        }
    }

    return visitedA.size === dfaA.states.length;
}


/**
 * The main function to check for logical equivalence between two automata.
 * @param {object} machineA The first automaton.
 * @param {object} machineB The second automaton.
 * @returns {Promise<boolean>} A promise that resolves to true if they are equivalent.
 */
export async function areEquivalent(machineA, machineB) {
    try {
        const silentStep = async () => {};

        // --- FIX: Establish a single, master alphabet from the solution (machineB) or a union ---
        const alphabetA = Array.from(new Set(machineA.transitions.map(t => t.symbol).filter(Boolean)));
        const alphabetB = machineB.alphabet || Array.from(new Set(machineB.transitions.map(t => t.symbol).filter(Boolean)));
        const combinedAlphabet = [...new Set([...alphabetA, ...alphabetB])];

        // Convert both machines to DFA format, forcing them to be complete over the combined alphabet
        const dfaA = await toDfa(machineA, combinedAlphabet);
        const dfaB = await toDfa(machineB, combinedAlphabet);

        // Minimize both DFAs.
        const minDfaA = await minimizeDfa(dfaA, silentStep);
        const minDfaB = await minimizeDfa(dfaB, silentStep);

        // Check if the minimized DFAs are isomorphic.
        return areIsomorphic(minDfaA, minDfaB);
    } catch (e) {
        console.error("Equivalence check failed:", e);
        return false;
    }
}
