/**
 * pda_animation.js
 * Handles animated drawing of PDA machines and conversions.
 */

import { setMachine } from './pda_state.js';
import { renderAll } from './pda_renderer.js';
import { sleep, addLogMessage } from './utils.js';

const ANIMATION_DELAY = 1500;

/**
 * Animates the drawing of a PDA, adding states and transitions one by one.
 */
export async function animatePdaDrawing(machineToDraw) {
    const log = document.getElementById('stepLog');
    if (log) log.innerHTML = '';
    
    addLogMessage(`Starting PDA construction: <strong>${machineToDraw.type}</strong>`, 'zap');

    let tempMachine = {
        type: machineToDraw.type,
        states: [],
        transitions: [],
        alphabet: machineToDraw.alphabet || [],
        stackAlphabet: machineToDraw.stackAlphabet || [],
        initialStackSymbol: machineToDraw.initialStackSymbol || 'Z'
    };

    setMachine({ ...tempMachine });
    renderAll();
    await sleep(500);

    // --- State Animation Loop ---
    for (const state of machineToDraw.states) {
        let message = `Adding state <strong>${state.id}</strong>`;
        if (state.initial) message += " (Initial)";
        if (state.accepting) message += " (Final)";
        
        addLogMessage(message, 'plus-circle');

        tempMachine.states.push(state);
        setMachine({ ...tempMachine });
        renderAll();

        const stateG = document.querySelector(`g[data-id="${state.id}"] circle`);
        if (stateG) stateG.classList.add('state-drawing');

        await sleep(ANIMATION_DELAY);
    }

    // --- Transition Animation Loop ---
    for (const transition of machineToDraw.transitions) {
        const { from, to, symbol, pop, push } = transition;
        
        let logMessage = `Drawing: <strong>${from}</strong> → <strong>${to}</strong> on '<strong>${symbol || 'ε'}</strong>'`;
        logMessage += ` | Pop: <b>${pop || 'ε'}</b>, Push: <b>${push || 'ε'}</b>`;
        
        addLogMessage(logMessage, 'git-branch');

        tempMachine.transitions.push(transition);
        setMachine({ ...tempMachine });
        renderAll();

        // Selector targets the edges based on the data attributes set by pda_renderer.js
        const path = document.querySelector(`#edges .transition-path[data-from="${from}"][data-to="${to}"]`);
        if (path) {
            path.classList.add('transition-drawing');
        }

        await sleep(ANIMATION_DELAY);
    }

    await sleep(1500);
    setMachine(machineToDraw);
    renderAll();
    addLogMessage('Construction complete!', 'check-circle');
}