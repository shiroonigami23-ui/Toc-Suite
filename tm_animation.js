/**
 * tm_animation.js
 * Handles the step-by-step construction animation for Turing Machines.
 * Provides a visual "building" effect used by the Library and Show Solution features.
 */

import { setMachine } from './tm_state.js';
import { renderAll } from './tm_renderer.js';
import { addLogMessage } from './utils.js';

/**
 * Animates the drawing of a Turing Machine.
 * @param {object} machineToDraw - The full machine configuration to animate.
 * @param {number} delay - Milliseconds between each construction step.
 */
export async function animateTmDrawing(machineToDraw, delay = 800) {
    // 1. Clear the current machine state to start from a blank canvas
    let tempMachine = { 
        type: 'TM', 
        states: [], 
        transitions: [], 
        alphabet: machineToDraw.alphabet || ['0', '1'],
        tapeAlphabet: machineToDraw.tapeAlphabet || ['0', '1', 'B'],
        blankSymbol: machineToDraw.blankSymbol || 'B'
    };
    
    setMachine({...tempMachine});
    const logContainer = document.getElementById('stepLog');
    if (logContainer) logContainer.innerHTML = '<strong>Initiating TM Construction...</strong>';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 2. Animate State Addition
    for (const state of machineToDraw.states) {
        tempMachine.states.push({ ...state });
        setMachine({...tempMachine}); // Updates internal state and triggers render
        
        // Add a visual pulse to the newly added state
        const stateEl = document.querySelector(`.state-group[data-id="${state.id}"]`);
        if (stateEl) stateEl.classList.add('state-animating');
        
        addLogMessage(`Adding state: <strong>${state.id}</strong>${state.initial ? ' (Initial)' : ''}${state.accepting ? ' (Halt)' : ''}`, 'plus-circle');
        await sleep(delay);
    }

    // 3. Animate Transition Addition
    for (const trans of machineToDraw.transitions) {
        tempMachine.transitions.push({ ...trans });
        setMachine({...tempMachine});
        
        addLogMessage(`Drawing transition: <strong>${trans.from} → ${trans.to}</strong> (Read: ${trans.read}; Write: ${trans.write}, Move: ${trans.move})`, 'git-branch');
        await sleep(delay);
    }

    // 4. Finalize and Cleanup
    document.querySelectorAll('.state-animating').forEach(el => el.classList.remove('state-animating'));
    addLogMessage("Turing Machine construction complete.", 'check-circle');
}