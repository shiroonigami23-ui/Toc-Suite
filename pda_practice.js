/**
 * pda_practice.js
 * Logic for generating PDA exercises and validating user answers.
 */

import { PDA_PRACTICE_BANK } from './pda_practice_bank.js';
import { MACHINE, setMachine, pushUndo } from './pda_state.js';
import { runPdaSimulation } from './pda_simulation.js';
import { addLogMessage, customAlert } from './utils.js';
import { animatePdaDrawing } from './pda_animation.js';

let currentPractice = null;

export function generatePractice(level = 'easy') {
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
    
    // Expanded test suite to cover Part 1 through Part 19
    const testStrings = [
        "", "a", "b", "c", "0", "1", "ab", "ba", "01", "10", 
        "aabb", "aaabbb", "abc", "aabbcc", "(( ))", "()", "()()",
        "0011", "1100", "aba", "a#a", "aa#aa", "[[ ]]", "{[ ]}"
    ];
    
    const alphabet = currentPractice.solution.alphabet;
    let passed = true;
    let failString = "";

    for (const test of testStrings) {
        // Only test strings that fit the specific problem's alphabet
        const isValidInput = test.split('').every(char => alphabet.includes(char));
        
        if (isValidInput) {
            const userResult = runPdaSimulation(test, MACHINE);
            const solResult = runPdaSimulation(test, currentPractice.solution);

            if (userResult.success !== solResult.success) {
                passed = false;
                failString = test;
                break;
            }
        }
    }

    if (passed) {
        customAlert("Success!", `Machine validated for ${currentPractice.title}!`);
        addLogMessage("Validation Complete: All internal test cases passed.", 'check-circle');
    } else {
        customAlert("Incorrect", `Failed on input: "${failString || 'ε'}"`);
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