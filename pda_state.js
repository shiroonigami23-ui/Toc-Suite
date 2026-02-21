/**
 * pda_state.js
 * Manages the state and history for the Pushdown Automata (PDA) module.
 */

export let MACHINE = {
    type: 'NPDA',
    states: [],
    transitions: [],
    alphabet: [],
    stackAlphabet: [],
    initialStackSymbol: 'Z',
    acceptanceMode: 'FINAL_STATE'
};

// FIX: Export these using Uppercase to match the other studio modules
export let UNDO_STACK = [];
export let REDO_STACK = [];

let renderCallback = () => {};


export function setRenderFunction(fn) {
    renderCallback = fn;
}

export function setMachine(newMachine) {
    MACHINE = JSON.parse(JSON.stringify(newMachine));
    renderCallback();
}

/**
 * Pushes the current state into the undo stack.
 * @param {function} updateUIFn - Optional callback to update UI elements like buttons.
 */
export function pushUndo(updateUIFn) {
    UNDO_STACK.push(JSON.stringify(MACHINE)); // Changed to UNDO_STACK
    REDO_STACK = []; // Changed to REDO_STACK
    if (updateUIFn) updateUIFn();
}

export function undo(updateUIFn) {
    if (UNDO_STACK.length === 0) return; // Changed to UNDO_STACK
    REDO_STACK.push(JSON.stringify(MACHINE)); // Changed to REDO_STACK
    MACHINE = JSON.parse(UNDO_STACK.pop()); // Changed to UNDO_STACK
    renderCallback();
    if (updateUIFn) updateUIFn();
}

export function redo(updateUIFn) {
    if (REDO_STACK.length === 0) return; // Changed to REDO_STACK
    UNDO_STACK.push(JSON.stringify(MACHINE)); // Changed to UNDO_STACK
    MACHINE = JSON.parse(REDO_STACK.pop()); // Changed to REDO_STACK
    renderCallback();
    if (updateUIFn) updateUIFn();
}

export function resetMachine() {
    MACHINE = {
        type: 'NPDA',
        states: [],
        transitions: [],
        alphabet: [],
        stackAlphabet: [],
        initialStackSymbol: 'Z',
        acceptanceMode: 'FINAL_STATE'
    };
    UNDO_STACK = []; // Changed to UNDO_STACK
    REDO_STACK = []; // Changed to REDO_STACK
    renderCallback();
}
/**
 * Initializes the state for the PDA module.
 */
export function initializeState() {
    MACHINE = {
        type: 'NPDA',
        states: [],
        transitions: [],
        alphabet: [],
        stackAlphabet: [],
        initialStackSymbol: 'Z',
        acceptanceMode: 'FINAL_STATE'
    };
    UNDO_STACK = [];
    REDO_STACK = [];
    if (renderCallback) renderCallback();
}
