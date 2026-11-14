/**
 * pda_practice.js
 * Logic for generating PDA exercises and validating user answers.
 */

// The bank (~80 KB) is loaded the first time a practice problem is requested, not with the studio.
let bankPromise = null;
const loadBank = () => (bankPromise ??= import('../../data/practice/pda_practice_bank.js').then(m => m.PDA_PRACTICE_BANK));
import { MACHINE, setMachine, pushUndo } from './pda_state.js';
import { runPdaSimulation } from './pda_simulation.js';
import { addLogMessage, customAlert } from '../shared/utils.js';
import { animatePdaDrawing } from './pda_animation.js';

let currentPractice = null;

export async function generatePractice(level = 'easy') {
    const PDA_PRACTICE_BANK = await loadBank();
    const filtered = PDA_PRACTICE_BANK.filter(p => p.level === level);
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    currentPractice = selected;

    const display = document.getElementById('practiceBox');
    if (display) {
        // Apply Content and the PDA indigo glow class
        display.innerHTML = `
            <div class="practice-card">
                <h4>${selected.title}</h4>
                <p>${selected.description}</p>
                <small><strong>Goal:</strong> ${selected.instruction}</small>
            </div>
        `;
        display.className = 'practice-pda-active';
    }
    addLogMessage(`New Practice Loaded: ${selected.title}`, 'zap');
}

/**
 * pda_practice.js - Enhanced Validation
 */
export async function checkAnswer() {
    if (!currentPractice) {
        customAlert("No Practice", "Please generate a practice problem first.");
        return;
    }

    addLogMessage("Comparing your PDA with the reference solution...", 'loader');
    
    // Every string up to length 6 over the problem's own alphabet (a few thousand at most),
    // so a PDA that is only right on a handful of "typical" inputs cannot pass.
    const alphabet = currentPractice.solution.alphabet ||
        [...new Set(currentPractice.solution.transitions.map(t => t.symbol).filter(Boolean))];
    const maxLen = alphabet.length >= 4 ? 5 : 6;
    const testStrings = [''];
    for (let layer = [''], n = 1; n <= maxLen; n++) {
        layer = layer.flatMap(p => alphabet.map(c => p + c));
        testStrings.push(...layer);
    }
    let passed = true;
    let failString = "";
    let expected = false;

    for (const test of testStrings) {
        const userResult = runPdaSimulation(test, MACHINE, { silent: true });
        const solResult = runPdaSimulation(test, currentPractice.solution, { silent: true });
        if (userResult.success !== solResult.success) {
            passed = false;
            failString = test;
            expected = solResult.success;
            break;
        }
    }

    if (passed) {
        customAlert("Success!", `Machine validated for ${currentPractice.title}!`);
        addLogMessage("Validation Complete: All internal test cases passed.", 'check-circle');
    } else {
        customAlert("Incorrect", `On input "${failString || 'ε'}" your PDA ${expected ? 'rejects' : 'accepts'} it, but it should ${expected ? 'accept' : 'reject'} it.`);
        addLogMessage(`Mismatch found on "${failString || 'ε'}"`, 'x-circle');
    }
}

/**
 * Loads the solution for the current practice problem onto the canvas.
 */
export async function showSolution() {
    if (!currentPractice) {
        customAlert("No Practice", "Please generate a practice problem first.");
        return;
    }

    // Import the animator dynamically to avoid circular dependencies
    const { animatePdaDrawing } = await import('./pda_animation.js');

    // Save current state to undo stack before overwriting
    pushUndo();

    // Detailed Logs for the start of the process
    addLogMessage(`Initializing solution for: <strong>${currentPractice.title}</strong>`, 'info');
    
    // Start the animated construction
    await animatePdaDrawing(currentPractice.solution);

    // Final guidance logs
    addLogMessage(`Alphabet: {${currentPractice.solution.alphabet.join(', ')}}`, 'list');
    addLogMessage("Use the 'Testing' panel to run strings against this solution.", 'help-circle');
    
    customAlert("Solution Loaded", "The reference PDA has been drawn on the canvas.");
}