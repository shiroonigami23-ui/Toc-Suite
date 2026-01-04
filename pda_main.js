/**
 * pda_main.js
 * Entry point for the PDA Studio module.
 */

import { initializeState, setRenderFunction } from './pda_state.js';
import { initializePdaUI } from './pda_ui.js';
import { renderAll } from './pda_renderer.js';
import { generatePractice } from './pda_practice.js';

/**
 * Initializes the PDA Studio environment.
 */
export function initializePDA() {
    console.log("Initializing PDA Studio...");
    
    // 1. Set up the state management and rendering link
    setRenderFunction(renderAll);
    
    // 2. Initialize the UI interactions
    initializePdaUI();

    // 3. Clear the canvas for a fresh start
    renderAll();
   
    // 4. Register global helper for library loading
    window.loadPdaFromObject = async (machineData) => {
        const { setMachine } = await import('./pda_state.js');
        setMachine(machineData);
        renderAll();
    };

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

