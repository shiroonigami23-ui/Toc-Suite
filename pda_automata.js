/**
 * pda_automata.js
 * Logic for validation and conversion of PDA types.
 */

/**
 * Attempts to convert an NPDA to a DPDA.
 * Strategy: Identifies states with overlapping (symbol, pop) pairs 
 * and suggests merging or re-routing if they go to the same state.
 */
export function convertToDeterministic(machine) {
    if (String(machine.type || '').startsWith('DPDA')) return { success: true, message: "Already DPDA" };

    const conflicts = findNonDeterministicConflicts(machine);
    
    if (conflicts.length === 0) {
        machine.type = String(machine.type || '').includes('EPS_FREE') ? 'DPDA_EPS_FREE' : 'DPDA';
        return { success: true, message: "Successfully converted to DPDA." };
    }

    // Attempting automatic fix: If multiple transitions for (state, symbol, pop) 
    // point to the same 'to' state, we merge them.
    let fixedCount = 0;
    const uniqueTransitions = [];
    const seen = new Set();

    machine.transitions.forEach(t => {
        const key = `${t.from}|${t.symbol}|${t.pop}|${t.to}|${t.push}`;
        if (!seen.has(key)) {
            uniqueTransitions.push(t);
            seen.add(key);
        } else {
            fixedCount++;
        }
    });

    machine.transitions = uniqueTransitions;

    if (findNonDeterministicConflicts(machine).length > 0) {
        return { 
            success: false, 
            message: "Inherent non-determinism detected. Manual adjustment required to satisfy DPDA constraints." 
        };
    }

    machine.type = String(machine.type || '').includes('EPS_FREE') ? 'DPDA_EPS_FREE' : 'DPDA';
    return { success: true, message: `Redundant transitions removed. Machine is now DPDA.` };
}

function findNonDeterministicConflicts(machine) {
    const conflicts = [];
    const seen = new Map();

    machine.transitions.forEach(t => {
        const key = `${t.from}|${t.symbol}|${t.pop}`;
        if (seen.has(key)) {
            conflicts.push({ key, t });
        } else {
            seen.set(key, t);
        }
    });
    return conflicts;
}

export function validatePda(machine) {
    if (machine.states.length === 0) return { type: 'error', message: "No states defined." };
    if (!machine.states.some(s => s.initial)) return { type: 'error', message: "No initial state." };
    
    if (String(machine.type || '').startsWith('DPDA')) {
        const conflicts = findNonDeterministicConflicts(machine);
        if (conflicts.length > 0) {
            return { type: 'warning', message: "DPDA has non-deterministic conflicts." };
        }
    }

    return { type: 'success', message: "PDA structure is valid." };
}
