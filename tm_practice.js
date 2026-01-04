/**
 * tm_practice.js
 * Logic for generating challenges, checking answers, and 
 * animating solutions for the Turing Machine Studio.
 */

import { TM_PRACTICE_BANK } from './tm_practice_bank.js';
import { animateTmDrawing } from './tm_animation.js';
import { runTmSimulation } from './tm_simulation.js';
import { addLogMessage, customAlert } from './utils.js';
import { MACHINE } from './tm_state.js';

let currentChallenge = null;

/**
 * Generates a challenge based on the selected difficulty level.
 */
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
    }
    
    addLogMessage(`New Challenge: <strong>${currentChallenge.title}</strong> generated.`, 'puzzle');
}

/**
 * Animates the solution machine from the practice bank onto the canvas.
 */
export async function showTmSolution() {
    if (!currentChallenge) {
        customAlert("No Practice Found", "Please generate a challenge first.");
        return;
    }

    addLogMessage(`Loading solution for: <strong>${currentChallenge.title}</strong>...`, 'wand-2');
    
    // We use the same high-level animation logic as the Library and File loader
    await animateTmDrawing(currentChallenge.machine);
    
    addLogMessage("Solution constructed successfully.", 'check-circle');
}

/**
 * Checks the user's current machine against test cases (if defined).
 * Note: TM verification usually involves running standard strings.
 */
export function checkTmAnswer() {
    if (!currentChallenge) return;

    // For TM, we typically validate against a set of known test strings
    const testCases = currentChallenge.testCases || [];
    if (testCases.length === 0) {
        customAlert("Manual Verification", "Compare your logic with the 'Show Solution' machine.");
        return;
    }

    addLogMessage("Running automated verification...", 'loader');
    
    let passCount = 0;
    testCases.forEach(tc => {
        const result = runTmSimulation(tc.input, MACHINE);
        if (result.success === tc.expected) passCount++;
    });

    if (passCount === testCases.length) {
        customAlert("Success!", "Your machine correctly handles all test cases.");
        addLogMessage("Verification Passed: 100% Accuracy.", 'check-circle');
    } else {
        customAlert("Verification Failed", `Machine passed ${passCount}/${testCases.length} tests.`);
        addLogMessage("Verification Failed: Please refine your transitions.", 'alert-triangle');
    }
}