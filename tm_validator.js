/**
 * tm_validator.js
 * Structural checks based on TM mode.
 */
import { MACHINE } from './tm_state.js';
import { addLogMessage } from './utils.js';

export function validateTm() {
    const vLine = document.getElementById('tmValidationLine');
    const errors = [];
    const type = String(MACHINE.type || 'STANDARD');
    const deterministicModes = ['STANDARD', 'STAY_OPTION', 'LBA'];

    if (!Array.isArray(MACHINE.states) || MACHINE.states.length === 0) errors.push('No states defined.');
    if (!MACHINE.states.find((s) => s.initial)) errors.push('Missing initial state.');
    if (!MACHINE.states.find((s) => s.accepting)) errors.push('Missing halt (accept) state.');

    const stateIds = MACHINE.states.map((s) => s.id);
    const dupState = stateIds.find((id, idx) => stateIds.indexOf(id) !== idx);
    if (dupState) errors.push(`Duplicate state id found: ${dupState}`);

    const invalidStateRef = MACHINE.transitions.find((t) => !stateIds.includes(t.from) || !stateIds.includes(t.to));
    if (invalidStateRef) errors.push('Transition references unknown state.');

    if (type === 'MULTI_TAPE') {
        const expected = Number(MACHINE.numTapes || 1);
        const bad = MACHINE.transitions.find((t) =>
            !Array.isArray(t.reads) || !Array.isArray(t.writes) || !Array.isArray(t.moves) ||
            t.reads.length !== expected || t.writes.length !== expected || t.moves.length !== expected
        );
        if (bad) errors.push('Each multi-tape transition must define reads/writes/moves for every tape.');
    } else {
        const malformed = MACHINE.transitions.find((t) =>
            t.read == null || t.write == null || !t.move
        );
        if (malformed) errors.push('Single-tape transitions require read, write, and move.');

        const invalidSymbol = MACHINE.transitions.find((t) =>
            String(t.read || '').length !== 1 || String(t.write || '').length !== 1
        );
        if (invalidSymbol) errors.push('Read/write symbols must be single-character.');

        const allowedMoves = type === 'STAY_OPTION' ? ['L', 'R', 'S'] : ['L', 'R'];
        const invalidMove = MACHINE.transitions.find((t) => !allowedMoves.includes(t.move));
        if (invalidMove) errors.push(`Invalid move "${invalidMove.move}" for mode ${type}.`);
    }

    if (deterministicModes.includes(type)) {
        const nonDet = findNonDeterminism(type);
        if (nonDet) errors.push(`Non-determinism found at ${nonDet}. Use NTM mode or fix transitions.`);
    }

    if (errors.length > 0) {
        if (vLine) {
            vLine.innerHTML = `<span style="color:#ef4444;"><i data-lucide="alert-circle" style="width:14px; vertical-align:middle;"></i> ${errors[0]}</span>`;
        }
        addLogMessage(`TM validation failed: ${errors.join(' ')}`, 'alert-triangle');
    } else {
        if (vLine) {
            vLine.innerHTML = `<span style="color:#10b981;"><i data-lucide="check" style="width:14px; vertical-align:middle;"></i> Valid ${type}</span>`;
        }
        addLogMessage(`TM validation passed (${type}).`, 'check');
    }

    if (window.lucide) lucide.createIcons();
}

function findNonDeterminism(type) {
    const seen = new Set();
    for (const t of MACHINE.transitions) {
        const key = type === 'MULTI_TAPE'
            ? `${t.from}-${(t.reads || []).join('|')}`
            : `${t.from}-${t.read}`;
        if (seen.has(key)) return key;
        seen.add(key);
    }
    return null;
}
