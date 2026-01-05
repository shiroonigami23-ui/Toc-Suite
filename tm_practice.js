/**
 * tm_practice.js
 * Logic for generating challenges and performing automatic 
 * logical validation for the Turing Machine Studio.
 */

import { TM_PRACTICE_BANK } from './tm_practice_bank.js';
import { animateTmDrawing } from './tm_animation.js';
import { runTmSimulation } from './tm_simulation.js';
import { addLogMessage, customAlert } from './utils.js';
import { MACHINE } from './tm_state.js';

let currentChallenge = null;

export function generateTmPractice(level) {
    const bank = TM_PRACTICE_BANK[level] || TM_PRACTICE_BANK.easy;
    currentChallenge = bank[Math.floor(Math.random() * bank.length)];

    const practiceBox = document.getElementById('practiceBox');
    if (practiceBox) {
        practiceBox.innerHTML = `
            <div style="padding:10px; border-left:4px solid #10b981; background:#f0fdf4;">
                <strong style="display:block; color:#065f46; margin-bottom:4px;">${currentChallenge.title}</strong>
                <p style="font-size:0.85em; margin:0; color:#374151;">${currentChallenge.description}</p>
            </div>
        `;
        // Apply the signature Emerald glow
        practiceBox.className = 'practice-tm-active';
    }
    
    addLogMessage(`New Challenge: <strong>${currentChallenge.title}</strong> generated.`, 'puzzle');
}

/**
 * ARCHITECTURAL FIX: Automated Comparative Validation
 * Returns a detailed result object to the UI handler.
 */
export async function checkTmAnswer(userMachine) {
    if (!currentChallenge) {
        return { success: false, failedString: "No challenge active", expected: false };
    }

    addLogMessage("Running automated logic verification...", 'loader');

    // 1. Get primary test cases from the bank
    let testCases = currentChallenge.testCases || [];

    // 2. ENHANCEMENT: If no test cases, perform comparative testing
    // This compares the user's machine behavior against the solution machine
    if (testCases.length === 0 && currentChallenge.machine) {
        const testInputs = ["", "0", "1", "00", "11", "01", "10", "000", "111", "010", "101"];
        testCases = testInputs.map(input => {
            const solResult = runTmSimulation(input, currentChallenge.machine);
            return { input, expected: solResult.success };
        });
    }

    // 3. Execution Loop
    for (const tc of testCases) {
        const result = runTmSimulation(tc.input, userMachine);
        
        if (result.success !== tc.expected) {
            // Log the specific mismatch for the user
            addLogMessage(`Mismatch found on input: "${tc.input || 'ε'}"`, 'x-circle');
            return { 
                success: false, 
                failedString: tc.input || 'ε', 
                expected: tc.expected 
            };
        }
    }

    // 4. Success State
    return { success: true };
}

export async function showTmSolution() {
    if (!currentChallenge) {
        customAlert("No Practice Found", "Please generate a challenge first.");
        return;
    }

    addLogMessage(`Loading solution for: <strong>${currentChallenge.title}</strong>...`, 'wand-2');
    await animateTmDrawing(currentChallenge.machine);
    addLogMessage("Solution constructed successfully.", 'check-circle');
}