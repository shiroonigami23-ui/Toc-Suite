/**
 * pda_validator.js
 * Consolidated Logic for PDA Auditing and Deterministic Conversion.
 */

/**
 * 1. COMPREHENSIVE AUDIT (The "Better" Validation)
 */
export function validatePda(machine) {
    const { states, transitions, type } = machine;

    if (states.length === 0) return { type: 'error', message: "No states defined." };
    
    // Initial State Check
    const initialStates = states.filter(s => s.initial);
    if (initialStates.length === 0) return { type: 'error', message: "Missing Initial State (→)." };

    // Reachability Check (BFS)
    const reachable = new Set();
    const queue = [initialStates[0].id];
    reachable.add(initialStates[0].id);
    while (queue.length > 0) {
        const curr = queue.shift();
        transitions.filter(t => t.from === curr).forEach(t => {
            if (!reachable.has(t.to)) {
                reachable.add(t.to);
                queue.push(t.to);
            }
        });
    }
    if (reachable.size < states.length) {
        return { type: 'warning', message: "Warning: Unreachable states detected on canvas." };
    }

    // Determinism Audit
    if (type === 'DPDA') {
        const conflicts = findNonDeterministicConflicts(machine);
        if (conflicts.length > 0) {
            return { type: 'error', message: `DPDA Violation: Branching logic found in ${conflicts[0].key}` };
        }
    }

    return { type: 'success', message: "PDA Logic Validated: Structurally Sound." };
}

/**
 * 2. AUTOMATIC CONVERSION (The Builder Logic)
 */
export function convertToDeterministic(machine) {
    if (machine.type === 'DPDA') return { success: true, message: "Already DPDA" };

    const uniqueTransitions = [];
    const seen = new Set();
    let removed = 0;

    machine.transitions.forEach(t => {
        const key = `${t.from}|${t.symbol}|${t.pop}|${t.to}|${t.push}`;
        if (!seen.has(key)) {
            uniqueTransitions.push(t);
            seen.add(key);
        } else {
            removed++;
        }
    });

    machine.transitions = uniqueTransitions;
    const conflicts = findNonDeterministicConflicts(machine);

    if (conflicts.length > 0) {
        return { 
            success: false, 
            message: "Inherent non-determinism detected. Manual adjustment of branching paths required." 
        };
    }

    machine.type = 'DPDA';
    return { success: true, message: `Redundant rules cleared. Machine converted to DPDA.` };
}

/**
 * Helper: Formal Determinism Conflict Finder
 */
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