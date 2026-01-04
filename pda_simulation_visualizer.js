/**
 * pda_simulation_visualizer.js
 * Renders the stack trace and supports both auto-animation and manual stepping.
 */

import { addLogMessage } from './utils.js';
import { MACHINE } from './pda_state.js'; // Added for transition indexing

// Export state variables so pda_ui.js can monitor simulation progress
export let currentPath = [];
export let currentIndex = -1;

/**
 * Updates the visual stack container in the sidebar.
 * @param {string[]} stack - The current stack array from the simulation.
 */
export function updateStackUI(stack) {
    const stackContainer = document.getElementById('pdaStackDisplay');
    const stackTopDisplay = document.getElementById('currentStackTop');
    if (!stackContainer) return;

    // Clear previous visual items
    stackContainer.innerHTML = '';
    
    // Reverse because the stack grows upwards visually
    const reversedStack = [...stack].reverse();
    
    // Update Persistent Header
    if (stackTopDisplay) {
        stackTopDisplay.textContent = reversedStack.length > 0 ? reversedStack[0] : 'Empty';
    }

    // Populate Sidebar Visualizer
    reversedStack.forEach((symbol, index) => {
        const item = document.createElement('div');
        item.className = 'stack-item';
        
        // Highlight top-most item
        if (index === 0) item.classList.add('stack-top');
        
        item.textContent = symbol;
        stackContainer.appendChild(item);
    });
}

/**
 * Initializes a new path for simulation.
 */
export function setSimulationPath(path) {
    currentPath = path;
    currentIndex = -1;
    document.querySelectorAll('.state-active').forEach(c => c.classList.remove('state-active'));
}

/**
 * Executes a single step in the simulation.
 * Highlights both the canvas state and the Logic Table row.
 */
export function stepSimulation() {
    if (!currentPath || currentPath.length === 0) return false;
    
    if (currentIndex >= currentPath.length - 1) {
        addLogMessage("Simulation complete.", "check-circle");
        return false;
    }

    // 1. Reset Canvas Highlights
    document.querySelectorAll('.state-active').forEach(c => c.classList.remove('state-active'));

    // 2. Retrieve Step Data
    currentIndex++;
    const step = currentPath[currentIndex];
    const { state, input, stack, transition } = step;
    
    // 3. Highlight Canvas State
    const stateEl = document.querySelector(`g[data-id="${state}"] circle`);
    if (stateEl) stateEl.classList.add('state-active');
    
    // 4. Update Stack UI
    updateStackUI(stack);
    
    // --- 5. LOGIC TABLE HIGHLIGHTING (New) ---
    // Match the current transition to find its index in the modal table
    if (transition) {
        const transIdx = MACHINE.transitions.findIndex(t => 
            t.from === transition.from && 
            t.symbol === transition.symbol && 
            t.pop === transition.pop &&
            t.push === transition.push
        );
        
        if (transIdx !== -1) {
            import('./pda_logic_table.js').then(m => m.highlightPdaTableRow(transIdx));
        }
    }
    
    // 6. Logging
    let msg = `Step ${currentIndex + 1}: State <strong>${state}</strong> | Read '<strong>${input || 'ε'}</strong>'`;
    if (transition) {
        msg += ` | Pop '${transition.pop}', Push '${transition.push}'`;
    }
    
    addLogMessage(msg, 'arrow-right');
    return true;
}

/**
 * Automatically animates the path.
 */
export async function animatePdaPath(path, delay = 1000) {
    setSimulationPath(path);
    while (currentIndex < currentPath.length - 1) {
        const stepped = stepSimulation();
        if (!stepped) break;
        await new Promise(r => setTimeout(r, delay));
    }
}