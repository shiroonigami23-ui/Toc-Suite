/**
 * tm_state.js
 * Central state management for the Turing Machine Studio.
 */

import { renderAll } from './tm_renderer.js';

export let MACHINE = {
    type: 'STANDARD', // Default mode
    numTapes: 1,      // Number of parallel tapes
    states: [],
    transitions: [],
    alphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', 'B'],
    blankSymbol: 'B'
};

export let undoStack = [];
export let redoStack = [];

// --- Tape State Management ---
// Declared as exports so they can be accessed by tm_ui.js and tm_visualizer.js
export let tapes = [['B']]; 
export let headIndices = [0];

/**
 * Updates the global machine object and triggers a re-render.
 */
export function setMachine(newMachine) {
    MACHINE = { ...MACHINE, ...newMachine };
    renderAll();
}

/**
 * Configures the machine for Multi-Tape mode.
 * Initializes parallel tape arrays and head positions.
 */
export function setNumTapes(k) {
    MACHINE.numTapes = k;
    tapes = Array.from({ length: k }, () => ['B']);
    headIndices = Array.from({ length: k }, () => 0);
    renderAll();
}

/**
 * Resets the machine to an empty state.
 */
export function resetMachine() {
    MACHINE = {
        type: 'STANDARD',
        numTapes: 1,
        states: [],
        transitions: [],
        alphabet: ['0', '1'],
        tapeAlphabet: ['0', '1', 'B'],
        blankSymbol: 'B'
    };
    tapes = [['B']];
    headIndices = [0];
    undoStack = [];
    redoStack = [];
    updateUndoRedoButtons();
}

/**
 * Pushes the current state to the undo stack.
 */
export function pushUndo() {
    undoStack.push(JSON.parse(JSON.stringify(MACHINE)));
    redoStack = [];
    updateUndoRedoButtons();
}

/**
 * Updates the visual state (disabled/enabled) of undo/redo buttons.
 */
export function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('tmUndoBtn');
    const redoBtn = document.getElementById('tmRedoBtn');
    
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

export function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(JSON.parse(JSON.stringify(MACHINE)));
    const previous = undoStack.pop();
    setMachine(previous);
    updateUndoRedoButtons();
}

export function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(JSON.parse(JSON.stringify(MACHINE)));
    const next = redoStack.pop();
    setMachine(next);
    updateUndoRedoButtons();
}