/**
 * pda_modal.js
 * Logic for the 3-tuple transition entry in PDA Studio.
 */

import { MACHINE, pushUndo } from './pda_state.js';
import { renderAll } from './pda_renderer.js';

export function openPdaTransitionModal(fromId, toId) {
    const modal = document.getElementById('pdaTransitionModal');
    const fromInput = document.getElementById('pdaTransFrom');
    const toInput = document.getElementById('pdaTransTo');
    
    if (!modal || !fromInput || !toInput) return;

    fromInput.value = fromId;
    toInput.value = toId;
    
    // Clear previous inputs
    document.getElementById('pdaTransSymbol').value = '';
    document.getElementById('pdaTransPop').value = '';
    document.getElementById('pdaTransPush').value = '';

    modal.style.display = 'flex';
}

export function savePdaTransition() {
    const from = document.getElementById('pdaTransFrom').value;
    const to = document.getElementById('pdaTransTo').value;
    const symbol = document.getElementById('pdaTransSymbol').value;
    const pop = document.getElementById('pdaTransPop').value;
    const push = document.getElementById('pdaTransPush').value;

    pushUndo();

    MACHINE.transitions.push({
        from,
        to,
        symbol: symbol || '', // empty for epsilon
        pop: pop || '',       // empty for epsilon
        push: push || ''      // empty for epsilon
    });

    document.getElementById('pdaTransitionModal').style.display = 'none';
    renderAll();
}