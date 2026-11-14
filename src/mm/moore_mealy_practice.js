import { MACHINE, CURRENT_PRACTICE, pushUndo, setCurrentPractice, setMachine } from './moore_mealy_state.js';
import { animateMachineDrawing } from '../shared/animation.js';
import { setValidationMessage, addLogMessage } from '../shared/utils.js';
import { areEquivalent } from './moore_mealy_equivalence.js';
// FIX: Import the conversion function directly
import { convertMooreToMealy, convertMealyToMoore } from './moore_mealy_automata.js';

let mmPracticeBankPromise = null;

async function ensureMmPracticeBankLoaded() {
    if (typeof window.MM_PRACTICE_BANK !== 'undefined') return;
    if (!mmPracticeBankPromise) {
        mmPracticeBankPromise = import('../../data/practice/moore_mealy_practice_bank.js');
    }
    await mmPracticeBankPromise;
}

const KIND_LABEL = { MOORE_TO_MEALY: 'Moore → Mealy', MEALY_TO_MOORE: 'Mealy → Moore' };

export async function generatePractice() {
    const practiceBox = document.getElementById('practiceBox');
    const modeSelect = document.getElementById('modeSelect');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const kind = document.getElementById('practiceKind')?.value || 'BUILD';
    const level = document.getElementById('practiceMode').value;
    const mode = modeSelect && ['MOORE', 'MEALY'].includes(modeSelect.value) ? modeSelect.value : (MACHINE.type || 'MOORE');

    await ensureMmPracticeBankLoaded();
    if (typeof window.MM_PRACTICE_BANK === 'undefined') {
        practiceBox.textContent = "Practice bank not loaded for Mealy/Moore.";
        return;
    }

    // Conversion practice reuses the verified construction answers as the machine to convert.
    const sourceType = kind === 'MOORE_TO_MEALY' ? 'MOORE' : kind === 'MEALY_TO_MOORE' ? 'MEALY' : mode;
    const bank = window.MM_PRACTICE_BANK[sourceType]?.[level];
    if (!bank || bank.length === 0) {
        practiceBox.textContent = `No ${level} questions for ${kind === 'BUILD' ? mode : KIND_LABEL[kind]}.`;
        if (checkAnswerBtn) checkAnswerBtn.hidden = true;
        return;
    }

    const pick = bank[Math.floor(Math.random() * bank.length)];
    const target = kind === 'MOORE_TO_MEALY' ? 'MEALY' : kind === 'MEALY_TO_MOORE' ? 'MOORE' : mode;
    setCurrentPractice({ ...pick, kind, target });

    const heading = kind === 'BUILD' ? `${mode} | ${level.toUpperCase()}` : `${KIND_LABEL[kind]} | ${level.toUpperCase()}`;
    const text = kind === 'BUILD' ? pick.q
        : `The ${sourceType === 'MOORE' ? 'Moore' : 'Mealy'} machine on the canvas is: <em>${pick.q}</em> Convert it into an equivalent ${target === 'MOORE' ? 'Moore' : 'Mealy'} machine (same output for every input${target === 'MOORE' ? ', after the start output' : ''}).`;
    practiceBox.innerHTML = `<strong>${heading}</strong><div style="margin-top:8px">${text}</div>`;
    practiceBox.className = 'practice-mm-active';
    if (checkAnswerBtn) checkAnswerBtn.hidden = false;

    if (kind !== 'BUILD') {
        const source = { ...JSON.parse(JSON.stringify(pick.machine)), type: sourceType };
        if (modeSelect) modeSelect.value = sourceType;
        await animateMachineDrawing(source);
        MACHINE.type = sourceType;
        addLogMessage(`Convert this ${sourceType === 'MOORE' ? 'Moore' : 'Mealy'} machine, switch the mode to ${target === 'MOORE' ? 'Moore' : 'Mealy'}, then press Check Answer.`, 'repeat');
    }
}

export async function showSolution(updateUIFunction) {
    if (!CURRENT_PRACTICE || !CURRENT_PRACTICE.machine) {
        setValidationMessage('No practice generated or solution unavailable.', 'error');
        return;
    }
    pushUndo(updateUIFunction);

    const modeSelect = document.getElementById('modeSelect');
    let machineData = JSON.parse(JSON.stringify(CURRENT_PRACTICE.machine));
    const kind = CURRENT_PRACTICE.kind || 'BUILD';
    try {
        if (kind === 'MOORE_TO_MEALY') {
            addLogMessage("Converting the Moore machine to Mealy...", 'zap');
            machineData = await convertMooreToMealy({ ...machineData, type: 'MOORE' });
        } else if (kind === 'MEALY_TO_MOORE') {
            addLogMessage("Converting the Mealy machine to Moore...", 'zap');
            machineData = await convertMealyToMoore({ ...machineData, type: 'MEALY' });
        }
    } catch (err) {
        setValidationMessage(`Conversion failed: ${err.message}`, 'error');
        return;
    }
    machineData.type = CURRENT_PRACTICE.target || machineData.type || 'MOORE';

    setMachine(machineData);
    animateMachineDrawing(machineData);
    if (modeSelect) modeSelect.value = machineData.type;
}

export function resetPractice() {
    setCurrentPractice(null);
    const practiceBox = document.getElementById('practiceBox');
    if (practiceBox) {
        practiceBox.textContent = 'No practice generated yet.';
        practiceBox.className = ''; 
    }
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    if (checkAnswerBtn) {
        checkAnswerBtn.hidden = true;
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
    
    const userMachine = MACHINE;
    let solutionMachine = JSON.parse(JSON.stringify(CURRENT_PRACTICE.machine)); // Deep clone the base solution
    const kind = CURRENT_PRACTICE.kind || 'BUILD';
    let requiredType = CURRENT_PRACTICE.target || MACHINE.type;
    // For conversions the stored machine is the *source*; compare against it directly (the
    // equivalence check works across Moore and Mealy).
    if (kind === 'MOORE_TO_MEALY') solutionMachine.type = 'MOORE';
    if (kind === 'MEALY_TO_MOORE') solutionMachine.type = 'MEALY';
    
    // Ensure both machines are the same type for equivalence comparison
    if (userMachine.type !== requiredType) {
        setValidationMessage(`Incorrect mode. You must build a ${requiredType} machine for this problem.`, 'error');
        addLogMessage('Result: Mode Mismatch!', 'x-circle');
        return;
    }

    // Set the type on the solution machine for the equivalence checker
    if (kind === 'BUILD') solutionMachine.type = requiredType;

    const isCorrect = await areEquivalent(userMachine, solutionMachine);

    if (isCorrect) {
        setValidationMessage('Correct Solution! Your machine is logically equivalent to the solution.', 'success');
        addLogMessage('Result: Correct! good job buddy nice work', 'check-circle');
    } else {
        setValidationMessage('Incorrect! Your machine does not produce the same output as the solution.', 'error');
        addLogMessage('Result: Incorrect! come on bro u can do it.', 'x-circle');
    }
}
