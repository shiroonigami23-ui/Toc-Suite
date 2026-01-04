/**
 * pda_state.js
 * Manages the state and history for the Pushdown Automata (PDA) module.
 */

export let MACHINE = {
    type: 'PDA',
    states: [],
    transitions: [],
    alphabet: [],
    stackAlphabet: [],
    initialStackSymbol: 'Z'
};

let undoStack = [];
let redoStack = [];
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
    undoStack.push(JSON.stringify(MACHINE));
    redoStack = []; // Clear redo on new action
    if (updateUIFn) updateUIFn();
}

export function undo(updateUIFn) {
    if (undoStack.length === 0) return;
    redoStack.push(JSON.stringify(MACHINE));
    MACHINE = JSON.parse(undoStack.pop());
    renderCallback();
    if (updateUIFn) updateUIFn();
}

export function redo(updateUIFn) {
    if (redoStack.length === 0) return;
    undoStack.push(JSON.stringify(MACHINE));
    MACHINE = JSON.parse(redoStack.pop());
    renderCallback();
    if (updateUIFn) updateUIFn();
}

/**
 * Resets the machine to an empty state.
 */
export function resetMachine() {
    MACHINE = {
        type: 'PDA',
        states: [],
        transitions: [],
        alphabet: [],
        stackAlphabet: [],
        initialStackSymbol: 'Z'
    };
    undoStack = [];
    redoStack = [];
    renderCallback();
}
/**
 * Initializes the state for the PDA module.
 */
export function initializeState() {
    MACHINE = {
        type: 'PDA',
        states: [],
        transitions: [],
        alphabet: [],
        stackAlphabet: [],
        initialStackSymbol: 'Z'
    };
    undoStack = [];
    redoStack = [];
    if (renderCallback) renderCallback();
}