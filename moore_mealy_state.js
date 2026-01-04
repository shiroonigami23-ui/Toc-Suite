// --- Single Source of Truth for Mealy/Moore Application State ---

import { renderAll as mmRenderAll } from './moore_mealy_renderer.js'; // Import the correct renderer

export let MACHINE = {};
export let UNDO_STACK = [];
export let REDO_STACK = [];
export let CURRENT_MODE = 'addclick';
export let TRANS_FROM = null;
export let CURRENT_PRACTICE = null;

// The simulation state now tracks input, current output string, and steps.
export const simState = {
    input: '',
    output: '',
    steps: [],
    index: 0,
    timer: null,
};

// This will hold the renderAll function from moore_mealy_renderer.js.
let renderFunction = mmRenderAll;

/**
 * Injects the main render function into the state module.
 * @param {function} fn The renderAll function.
 */
export function setRenderFunction(fn) {
    renderFunction = fn;
}

// --- State Mutation Functions ---

export function setMachine(newMachine) {
    MACHINE = newMachine;
}

export function setCurrentMode(mode) {
    CURRENT_MODE = mode;
}

export function setTransFrom(stateId) {
    TRANS_FROM = stateId;
}

export function setCurrentPractice(practice) {
    CURRENT_PRACTICE = practice;
}

export function pushUndo(updateUIFunction) {
    // Only push the machine state for undo/redo
    UNDO_STACK.push(JSON.parse(JSON.stringify(MACHINE)));
    REDO_STACK.length = 0;
    // updateUIFunction is updateUndoRedoButtons from the UI module.
    if (updateUIFunction) updateUIFunction(); 
}

/**
 * Performs an undo operation and updates the UI buttons.
 * @param {function} updateUIFunction Function to update undo/redo buttons.
 */
export function doUndo(updateUIFunction) {
    if (UNDO_STACK.length > 0) {
        REDO_STACK.push(JSON.parse(JSON.stringify(MACHINE)));
        setMachine(UNDO_STACK.pop());
        renderFunction();
        if (updateUIFunction) updateUIFunction();
    }
}

/**
 * Performs a redo operation and updates the UI buttons.
 * @param {function} updateUIFunction Function to update undo/redo buttons.
 */
export function doRedo(updateUIFunction) {
    if (REDO_STACK.length > 0) {
        UNDO_STACK.push(JSON.parse(JSON.stringify(MACHINE)));
        setMachine(REDO_STACK.pop());
        renderFunction();
        if (updateUIFunction) updateUIFunction();
    }
}

/**
 * Initializes the state for the Mealy/Moore Studio.
 * Moore is the default starting type.
 * @param {function} updateUIFunction 
 */
export function initializeState(updateUIFunction) {
    setMachine({
        type: 'MOORE', // Default to Moore Machine
        states: [],
        transitions: [],
        inputAlphabet: [],
        outputAlphabet: []
    });
    UNDO_STACK = [];
    REDO_STACK = [];
    setCurrentMode('addclick');
    setTransFrom(null);
    setCurrentPractice(null);
    simState.steps = [];
    simState.index = 0;
    simState.input = '';
    simState.output = '';
    if (simState.timer) clearTimeout(simState.timer);
    simState.timer = null;
    
    // Ensure the render function is correctly pointing to the local one on init
    setRenderFunction(mmRenderAll);

    if (updateUIFunction) updateUIFunction();
}