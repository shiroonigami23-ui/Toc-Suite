/**
 * pda_validator.js
 * Consolidated Logic for PDA auditing and deterministic conversion.
 */

export function validatePda(machine) {
    const { states, transitions, type, acceptanceMode, initialStackSymbol } = machine;

    if (!Array.isArray(states) || states.length === 0) {
        return { type: 'error', message: 'No states defined.' };
    }
    if (!Array.isArray(transitions)) {
        return { type: 'error', message: 'Transitions are missing or invalid.' };
    }

    const initialStates = states.filter((s) => s.initial);
    if (initialStates.length === 0) return { type: 'error', message: 'Missing initial state.' };
    if (initialStates.length > 1) return { type: 'error', message: 'Only one initial state is allowed.' };

    if (!String(initialStackSymbol || '').trim()) {
        return { type: 'error', message: 'Initial stack symbol is required.' };
    }

    if (acceptanceMode === 'FINAL_STATE' || acceptanceMode === 'BOTH') {
        const accepting = states.filter((s) => s.accepting).length;
        if (accepting === 0) return { type: 'error', message: 'No accepting state found for selected acceptance mode.' };
    }

    const malformed = transitions.find((t) =>
        !t || !t.from || !t.to || t.symbol == null || t.pop == null || t.push == null
    );
    if (malformed) {
        return { type: 'error', message: 'Malformed transition found (from/to/symbol/pop/push required).' };
    }

    const invalidChars = transitions.find((t) => {
        const symbol = String(t.symbol || '');
        const pop = String(t.pop || '');
        return (symbol !== 'eps' && symbol !== 'Îµ' && symbol.length > 1) ||
               (pop !== 'eps' && pop !== 'Îµ' && pop.length > 1);
    });
    if (invalidChars) {
        return { type: 'error', message: 'Transitions must use one-symbol input/pop values (or epsilon).' };
    }

    if (String(type || '').includes('EPS_FREE')) {
        const epsInput = transitions.find((t) => {
            const symbol = String(t.symbol || '').trim().toLowerCase();
            return symbol === '' || symbol === 'eps' || symbol === 'Îµ';
        });
        if (epsInput) {
            return { type: 'error', message: 'Epsilon-free mode disallows epsilon input transitions.' };
        }
    }

    // Reachability audit
    const reachable = new Set();
    const queue = [initialStates[0].id];
    reachable.add(initialStates[0].id);
    while (queue.length > 0) {
        const curr = queue.shift();
        transitions
            .filter((t) => t.from === curr)
            .forEach((t) => {
                if (!reachable.has(t.to)) {
                    reachable.add(t.to);
                    queue.push(t.to);
                }
            });
    }
    if (reachable.size < states.length) {
        return { type: 'warning', message: 'Unreachable states detected.' };
    }

    if (String(type || '').startsWith('DPDA')) {
        const conflicts = findNonDeterministicConflicts(machine);
        if (conflicts.length > 0) {
            return { type: 'error', message: `DPDA violation: branching logic in ${conflicts[0].key}` };
        }
    }

    return { type: 'success', message: 'PDA validated: structure and mode constraints satisfied.' };
}

export function convertToDeterministic(machine) {
    if (String(machine.type || '').startsWith('DPDA')) {
        return { success: true, message: 'Already deterministic.' };
    }

    const uniqueTransitions = [];
    const seen = new Set();
    let removed = 0;

    machine.transitions.forEach((t) => {
        const key = `${t.from}|${t.symbol}|${t.pop}|${t.to}|${t.push}`;
        if (!seen.has(key)) {
            uniqueTransitions.push(t);
            seen.add(key);
        } else {
            removed += 1;
        }
    });

    machine.transitions = uniqueTransitions;
    const conflicts = findNonDeterministicConflicts(machine);
    if (conflicts.length > 0) {
        return {
            success: false,
            message: 'Inherent non-determinism detected. Manual adjustment required.'
        };
    }

    if (String(machine.type || '').includes('EPS_FREE')) {
        machine.type = 'DPDA_EPS_FREE';
    } else {
        machine.type = 'DPDA';
    }
    return { success: true, message: `Deterministic conversion complete. Removed ${removed} redundant rule(s).` };
}

function isEpsilon(symbol) {
    const s = String(symbol || '').trim().toLowerCase();
    return s === '' || s === 'eps' || s === 'Îµ';
}

function findNonDeterministicConflicts(machine) {
    const conflicts = [];
    const exactSeen = new Map();
    const epsVsSymbolByPop = new Map();

    machine.transitions.forEach((t) => {
        const exactKey = `${t.from}|${t.symbol}|${t.pop}`;
        if (exactSeen.has(exactKey)) {
            conflicts.push({ key: exactKey, t });
        } else {
            exactSeen.set(exactKey, t);
        }

        // DPDA restriction: for same (state,pop), epsilon-input cannot coexist with symbol-input transitions.
        const popKey = `${t.from}|${t.pop}`;
        const kind = isEpsilon(t.symbol) ? 'eps' : 'sym';
        if (!epsVsSymbolByPop.has(popKey)) epsVsSymbolByPop.set(popKey, new Set());
        const kinds = epsVsSymbolByPop.get(popKey);
        kinds.add(kind);
        if (kinds.has('eps') && kinds.has('sym')) {
            conflicts.push({ key: `${popKey}|eps-vs-symbol`, t });
        }
    });

    return conflicts;
}
