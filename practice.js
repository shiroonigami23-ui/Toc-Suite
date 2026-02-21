import { MACHINE, CURRENT_PRACTICE, pushUndo, setCurrentPractice } from './state.js';
import { animateMachineDrawing } from './animation.js';
import { setValidationMessage, addLogMessage } from './utils.js';
import { areEquivalent } from './equivalence.js';

let practiceBankPromise = null;

async function ensurePracticeBankLoaded() {
    if (typeof window.PRACTICE_BANK !== 'undefined') return;
    if (!practiceBankPromise) {
        practiceBankPromise = import('./practice-bank.js');
    }
    await practiceBankPromise;
}

export async function generatePractice() {
    const practiceBox = document.getElementById('practiceBox');
    const modeSelect = document.getElementById('modeSelect');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    
    const mode = modeSelect ? modeSelect.value.split('_TO_')[0] : 'DFA';
    const level = document.getElementById('practiceMode').value;

    await ensurePracticeBankLoaded();
    if (typeof window.PRACTICE_BANK === 'undefined') {
        practiceBox.textContent = "Practice bank not loaded.";
        return;
    }

    const bank = window.PRACTICE_BANK[mode]?.[level];

    if (!bank || bank.length === 0) {
        practiceBox.textContent = `No ${level} questions for ${mode} mode.`;
        if (checkAnswerBtn) checkAnswerBtn.hidden = true; 
        return;
    }

    const newPractice = bank[Math.floor(Math.random() * bank.length)];
    setCurrentPractice(newPractice);
    
    // Apply Content and the FA blue glow class
    practiceBox.innerHTML = `<strong>${mode} | ${level}</strong><div style="margin-top:8px">${newPractice.q}</div>`;
    practiceBox.className = 'practice-fa-active'; 
    
    if (checkAnswerBtn) checkAnswerBtn.hidden = false;
}

export function showSolution(updateUIFunction) {
    if (!CURRENT_PRACTICE || !CURRENT_PRACTICE.machine) {
        setValidationMessage('No practice generated or solution unavailable.', 'error');
        return;
    }
    pushUndo(updateUIFunction);

    const modeSelect = document.getElementById('modeSelect');
    const correctType = modeSelect ? modeSelect.value.split('_TO_')[0] : 'DFA';

    const solutionMachine = {
        ...JSON.parse(JSON.stringify(CURRENT_PRACTICE.machine)),
        type: correctType 
    };
    
    animateMachineDrawing(solutionMachine);

    if(modeSelect) {
        modeSelect.value = correctType;
    }
}

export function resetPractice() {
    setCurrentPractice(null);
    const practiceBox = document.getElementById('practiceBox');
    
    if (practiceBox) {
        practiceBox.textContent = 'No practice generated yet.';
        // ARCHITECTURAL FIX: Clear the FA blue glow class
        practiceBox.className = ''; 
    }

    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    if (checkAnswerBtn) {
        checkAnswerBtn.hidden = true; // Hide button on reset
    }
}


/**
 * Checks if the user's machine on the canvas is logically equivalent to the practice solution.
 */
export async function checkAnswer() {
    if (!CURRENT_PRACTICE || !CURRENT_PRACTICE.machine) {
        setValidationMessage('No practice problem is currently active.', 'error');
        return;
    }

    const logContainer = document.getElementById('stepLog');
    if (logContainer) logContainer.innerHTML = '';
    addLogMessage('Checking your answer...', 'search');
    
    // The user's machine currently on the canvas
    const userMachine = MACHINE;
    
    // The solution machine needs its type explicitly defined for the check
    const modeSelect = document.getElementById('modeSelect');
    const correctType = modeSelect ? modeSelect.value.split('_TO_')[0] : 'DFA';
    const solutionMachine = {
        ...CURRENT_PRACTICE.machine,
        type: correctType
    };

    // --- FIX: Ensure both machines are checked against the same, official alphabet ---
    // The equivalence check will now use the alphabet from the solution as the ground truth.
    const isCorrect = await areEquivalent(userMachine, solutionMachine);

    if (isCorrect) {
        setValidationMessage('Correct Solution! Your automaton is logically equivalent to the solution.', 'success');
        addLogMessage('Result: Correct! good job buddy nice work', 'check-circle');
    } else {
        setValidationMessage('Incorrect! Your automaton does not match the solution.', 'error');
        addLogMessage('Result: Incorrect! come on bro u can do it.', 'x-circle');
    }
}
