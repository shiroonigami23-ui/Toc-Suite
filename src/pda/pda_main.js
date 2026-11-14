/**
 * pda_main.js
 * Entry point for the PDA Studio module.
 */

import { initializeState, setRenderFunction, setMachine } from './pda_state.js';
import { initializePdaUI } from './pda_ui.js';
import { renderAll } from './pda_renderer.js';
import { generatePractice } from './pda_practice.js';

const PENDING_PDA_KEY = 'tocPendingPdaMachine';

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

    // 5. Optional import bridge from Grammar Studio
    try {
        const pending = localStorage.getItem(PENDING_PDA_KEY);
        if (pending) {
            const parsed = JSON.parse(pending);
            setMachine(parsed);
            renderAll();
            localStorage.removeItem(PENDING_PDA_KEY);
        }
    } catch (_e) {
        // Ignore malformed pending import
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

