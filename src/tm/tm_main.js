/**
 * tm_main.js
 * Entry point for initializing the Turing Machine environment.
 */

import { initializeTmUI } from './tm_ui.js';
import { updateTapeUI } from './tm_visualizer.js';
import { MACHINE } from './tm_state.js';

export function initializeTM() {
    console.log("Initializing Turing Machine Studio...");
    
    // Initialize UI and Canvas
    initializeTmUI();
    
    // FIX: Pass an array of arrays for the tape and an array for head indices
    // to match the Multi-Tape logic in tm_visualizer.js
    updateTapeUI([['B']], [0]);
    
    // Setup initial log
    const log = document.getElementById('stepLog');
    if (log) log.innerHTML = 'TM Studio Active. Define states and Read/Write/Move transitions.';
}