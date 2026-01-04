import { MACHINE, CURRENT_PRACTICE, pushUndo, setCurrentPractice, setMachine } from './moore_mealy_state.js';
import { animateMachineDrawing } from './animation.js';
import { setValidationMessage, addLogMessage } from './utils.js';
import { areEquivalent } from './moore_mealy_equivalence.js';
// FIX: Import the conversion function directly
import { convertMooreToMealy } from './moore_mealy_automata.js';

export function generatePractice() {
    const practiceBox = document.getElementById('practiceBox');
    const modeSelect = document.getElementById('modeSelect');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    
    // The mode determines which section of the bank to pull from
    const mode = modeSelect ? modeSelect.value : 'MOORE';
    const level = document.getElementById('practiceMode').value;

    if (typeof window.MM_PRACTICE_BANK === 'undefined') {
        practiceBox.textContent = "Practice bank not loaded for Mealy/Moore.";
        return;
    }

    const bank = window.MM_PRACTICE_BANK[mode]?.[level] || window.MM_PRACTICE_BANK[mode];
    
    if (!bank || bank.length === 0) {
        practiceBox.textContent = `No ${level} questions for ${mode} mode.`;
        if (checkAnswerBtn) checkAnswerBtn.hidden = true; 
        return;
    }
    
    const newPractice = bank[Math.floor(Math.random() * bank.length)];
    setCurrentPractice(newPractice);

    let displayMode = mode;
    if (mode === 'MOORE_TO_MEALY') {
        displayMode = 'Moore → Mealy';
    }

    practiceBox.innerHTML = `<strong>${displayMode} | ${level.toUpperCase()}</strong><div style="margin-top:8px">${newPractice.q}</div>`;
    
    if (checkAnswerBtn) checkAnswerBtn.hidden = false;
}

export async function showSolution(updateUIFunction) {
    if (!CURRENT_PRACTICE || !CURRENT_PRACTICE.machine) {
        setValidationMessage('No practice generated or solution unavailable.', 'error');
        return;
    }
    pushUndo(updateUIFunction);

    const modeSelect = document.getElementById('modeSelect');
    const targetMode = modeSelect ? modeSelect.value : 'MOORE';

    // 1. Start with a clean deep clone of the machine data
    let machineData = JSON.parse(JSON.stringify(CURRENT_PRACTICE.machine));
    
    // 2. Handle Conversions (if needed)
    if (targetMode === 'MOORE_TO_MEALY') {
        addLogMessage("Converting Moore solution to Mealy for display...", 'zap');
        try {
            machineData = await convertMooreToMealy(machineData);
            machineData.type = 'MEALY'; 
        } catch (err) {
             setValidationMessage(`Conversion failed: ${err.message}`, 'error');
             return;
        }
    }
    
    // Ensure the machine type is set for the renderer (MOORE, MEALY)
    machineData.type = machineData.type || targetMode.split('_TO_')[0];

    // CRITICAL FIX: Set the machine to the global state immediately before animation starts 
    // This ensures that all tools (like save) see a valid machine instantly.
    setMachine(machineData); 
    
    // Animate the fully processed machine (this calls setMachine internally at the end of animation)
    animateMachineDrawing(machineData);

    // Ensure the mode select is correctly set after animation
    if(modeSelect) modeSelect.value = machineData.type;
}

export function resetPractice() {
    setCurrentPractice(null);
    document.getElementById('practiceBox').textContent = 'No practice generated yet.';
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    if (checkAnswerBtn) checkAnswerBtn.hidden = true;
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
    
    const userMachine = MACHINE;
    let solutionMachine = JSON.parse(JSON.stringify(CURRENT_PRACTICE.machine)); // Deep clone the base solution
    let requiredType = MACHINE.type;
    
    if (document.getElementById('modeSelect').value === 'MOORE_TO_MEALY') {
        requiredType = 'MEALY';
        addLogMessage('Converting required Moore solution to Mealy for check...', 'git-branch');
        solutionMachine = await convertMooreToMealy(solutionMachine);
    }
    
    // Ensure both machines are the same type for equivalence comparison
    if (userMachine.type !== requiredType) {
        setValidationMessage(`Incorrect mode. You must build a ${requiredType} machine for this problem.`, 'error');
        addLogMessage('Result: Mode Mismatch!', 'x-circle');
        return;
    }

    // Set the type on the solution machine for the equivalence checker
    solutionMachine.type = requiredType;

    const isCorrect = await areEquivalent(userMachine, solutionMachine);

    if (isCorrect) {
        setValidationMessage('Correct Solution! Your machine is logically equivalent to the solution.', 'success');
        addLogMessage('Result: Correct! good job buddy nice work', 'check-circle');
    } else {
        setValidationMessage('Incorrect! Your machine does not produce the same output as the solution.', 'error');
        addLogMessage('Result: Incorrect! come on bro u can do it.', 'x-circle');
    }
}