/**
 * tm_validator.js
 * Performs structural checks based on TM type.
 */
import { MACHINE } from './tm_state.js';
import { addLogMessage } from './utils.js';

export function validateTm() {
    const vLine = document.getElementById('tmValidationLine');
    const errors = [];

    // 1. Universal Checks
    if (!MACHINE.states.find(s => s.initial)) errors.push("Missing Initial State.");
    if (!MACHINE.states.find(s => s.accepting)) errors.push("Missing Halt (Accept) State.");

    // 2. Mode-Specific Checks
    if (MACHINE.type === 'STANDARD') {
        const nonDet = findNonDeterminism();
        if (nonDet) errors.push(`Non-determinism found in state ${nonDet}. Switch to NTM mode or fix.`);
    }

    if (MACHINE.type === 'MULTI_TAPE') {
        const invalidTrans = MACHINE.transitions.find(t => !t.reads || t.reads.length !== MACHINE.numTapes);
        if (invalidTrans) errors.push("Transitions must match the number of tapes.");
    }

    // 3. UI Feedback
    if (errors.length > 0) {
        vLine.innerHTML = `<span style="color:#ef4444;"><i data-lucide="alert-circle" style="width:14px; vertical-align:middle;"></i> ${errors[0]}</span>`;
        addLogMessage(`Validation Failed: ${errors.join(' ')}`, 'alert-triangle');
    } else {
        vLine.innerHTML = `<span style="color:#10b981;"><i data-lucide="check" style="width:14px; vertical-align:middle;"></i> Valid ${MACHINE.type}</span>`;
        addLogMessage("Structure Validation Passed.", 'check');
    }
    
    if (window.lucide) lucide.createIcons();
}

function findNonDeterminism() {
    const seen = new Set();
    for (const t of MACHINE.transitions) {
        const key = `${t.from}-${t.read}`;
        if (seen.has(key)) return t.from;
        seen.add(key);
    }
    return null;
}