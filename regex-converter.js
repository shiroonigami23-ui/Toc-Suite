// regex-converter.js

// State counter for creating unique state IDs
let stateCounter = 0;

/**
 * Creates a new state ID.
 * @returns {string} A new state ID (e.g., 's3').
 */
function newStateId() {
    return 's' + stateCounter++;
}

/**
 * Creates a basic NFA component structure (start/end state references).
 * @returns {{start: string, end: string, states: Array, transitions: Array}}
 */
function createBaseNfa() {
    return {
        start: newStateId(),
        end: newStateId(),
        states: [],
        transitions: []
    };
}

/**
 * Creates an epsilon NFA for a single literal symbol.
 *  * @param {string} symbol The input symbol.
 * @returns {object} The complete ENFA component.
 */
export function createSymbolNfa(symbol) {
    const nfa = createBaseNfa();
    nfa.transitions.push({ from: nfa.start, to: nfa.end, symbol: symbol });
    // States need full properties for the machine object later
    nfa.states.push({ id: nfa.start, initial: false, accepting: false, x: 0, y: 0 });
    nfa.states.push({ id: nfa.end, initial: false, accepting: false, x: 0, y: 0 });
    return nfa;
}

/**
 * Creates an epsilon NFA for the Concatenation operation (R1 R2).
 *  * @param {object} nfa1 The NFA for the first part (R1).
 * @param {object} nfa2 The NFA for the second part (R2).
 * @returns {object} The complete ENFA component.
 */
export function createConcatenationNfa(nfa1, nfa2) {
    const newNfa = {
        start: nfa1.start,
        end: nfa2.end,
        states: [...nfa1.states, ...nfa2.states],
        transitions: [...nfa1.transitions, ...nfa2.transitions]
    };

    // Add epsilon transition from the end of R1 to the start of R2
    newNfa.transitions.push({ from: nfa1.end, to: nfa2.start, symbol: "" });

    // Since R1's end is no longer final and R2's start is no longer initial in the combined machine:
    newNfa.states.find(s => s.id === nfa1.end).accepting = false;
    newNfa.states.find(s => s.id === nfa2.start).initial = false;
    
    // Clean up temporary initial/final flags for non-starting/ending states
    newNfa.states.forEach(s => {
        if (s.id !== newNfa.start && s.id !== newNfa.end) {
            s.initial = false;
            s.accepting = false;
        }
    });

    return newNfa;
}

/**
 * THE MAIN ENTRY POINT: Converts a regular expression string into a final ENFA machine.
 * This is currently a placeholder for a full shunting-yard/tree-based parser.
 * @param {string} regex The regular expression string.
 * @returns {object} The complete ENFA machine structure.
 */
export function parseRegexAndBuildEnfa(regex) {
    stateCounter = 0;
    
    if (regex.length === 1 && /[a-z0-9]/.test(regex)) {
        // Handle single symbol (e.g., 'a')
        const nfa = createSymbolNfa(regex);
        nfa.states.find(s => s.id === nfa.start).initial = true;
        nfa.states.find(s => s.id === nfa.end).accepting = true;
        
        return {
            type: 'ENFA',
            states: nfa.states,
            transitions: nfa.transitions,
            alphabet: [regex]
        };
    }
    
    // --- TEMPORARY DEMO FOR CONCATENATION ---
    if (regex === 'ab') {
        const nfaA = createSymbolNfa('a');
        const nfaB = createSymbolNfa('b');
        const concatenated = createConcatenationNfa(nfaA, nfaB);
        
        concatenated.states.find(s => s.id === concatenated.start).initial = true;
        concatenated.states.find(s => s.id === concatenated.end).accepting = true;
        
        return {
            type: 'ENFA',
            states: concatenated.states,
            transitions: concatenated.transitions,
            alphabet: ['a', 'b']
        };
    }

    throw new Error(`The regex converter can currently only handle single characters (e.g., 'a') or the hardcoded concatenation example ('ab'). Full implementation requires a proper parser.`);
}
