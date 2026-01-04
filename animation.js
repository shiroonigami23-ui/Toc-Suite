// FIX: Changed import to be generic or use the global setter defined by main studio code
// We must assume the correct setMachine is available globally or injected by the main loader.
// Given the file structure, we'll import FA state and rely on MM files to override/re-import logic.

import { setMachine } from './state.js'; // Assuming this is for FA context by default
import { renderAll } from './renderer.js';
import { sleep, addLogMessage } from './utils.js';

const ANIMATION_DELAY = 1500; 

/**
 * Animates the drawing of a finite automaton, logging each step.
 * It intelligently handles properties for FA (accepting) and Mealy/Moore (output).
 * * NOTE: When this function is called from the Moore/Mealy context (via moore_mealy_file.js), 
 * the moore_mealy_renderer/state dependencies must handle their own context.
 * * @param {object} machineToDraw The machine object to animate.
 */
export async function animateMachineDrawing(machineToDraw) {
    // Determine which setMachine function to use based on the context/type
    // We will use the globally available setter if possible, otherwise default to FA state.
    const machineSetter = (machineToDraw.type === 'MEALY' || machineToDraw.type === 'MOORE') 
        ? (window.setMmMachine || setMachine) // Assuming MM studio will expose setMmMachine globally
        : setMachine; 

    const originalType = machineToDraw.type || 'DFA';
    const log = document.getElementById('stepLog');
    if(log) log.innerHTML = ''; 
    
    addLogMessage(`Starting ${originalType} construction...`, 'zap');
    
    let tempMachine = { 
        type: originalType, 
        states: [], 
        transitions: [], 
        alphabet: machineToDraw.alphabet || [] 
    };
    machineSetter({...tempMachine});
    renderAll();
    await sleep(500);

    const isOutputMachine = originalType === 'MEALY' || originalType === 'MOORE';

    // --- State Animation Loop ---
    for (const state of machineToDraw.states) {
        let message = `Adding state <strong>${state.id}</strong>`;
        if (state.initial) message += " (Initial)";

        if (isOutputMachine && state.output) {
            message += ` (Output: <b>${state.output}</b>)`;
        } else if (state.accepting) {
            message += " (Final)";
        }
        addLogMessage(message, 'plus-circle');

        tempMachine.states.push(state);
        machineSetter({...tempMachine});
        renderAll();
        
        const stateG = document.querySelector(`g[data-id="${state.id}"] circle`);
        if (stateG) stateG.classList.add('state-drawing');
        
        await sleep(ANIMATION_DELAY);
    }
    
    // --- Transition Animation Loop ---
    for (const transition of machineToDraw.transitions) {
        const { from, to, symbol, output } = transition;
        
        let logMessage = `Drawing transition <strong>${from}</strong> → <strong>${to}</strong> on symbol '<strong>${symbol || 'ε'}</strong>'`;
        
        if (isOutputMachine && output) {
            logMessage += ` / Output: <b>${output}</b>`;
        }
        
        addLogMessage(logMessage, 'git-branch');
        
        tempMachine.transitions.push(transition);
        machineSetter({...tempMachine});
        renderAll();
        
        // This is a robust way to select the rendered path (which doesn't have the symbol attribute directly)
        const path = document.querySelector(`#edges .transition-path[data-from="${from}"][data-to="${to}"]`);
        if (path) {
            path.classList.add('transition-drawing');
        }
        
        await sleep(ANIMATION_DELAY);
    }
    
    await sleep(1500);

    machineSetter(machineToDraw);
    renderAll(); 
    addLogMessage('Construction complete!', 'check-circle');
}