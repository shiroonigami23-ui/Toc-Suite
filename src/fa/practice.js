import { MACHINE, CURRENT_PRACTICE, pushUndo, setCurrentPractice } from './state.js';
import { animateMachineDrawing } from '../shared/animation.js';
import { setValidationMessage, addLogMessage } from '../shared/utils.js';
import { compareMachines } from './equivalence.js';
import * as FA from '../core/fa.js';
import { diagnose } from '../core/diagnose.js';

let practiceBankPromise = null;

async function ensurePracticeBankLoaded() {
    if (typeof window.PRACTICE_BANK !== 'undefined') return;
    if (!practiceBankPromise) {
        practiceBankPromise = import('../../data/practice/practice-bank.js');
    }
    await practiceBankPromise;
}

const KIND_LABEL = {
    ENFA_TO_NFA: 'ε-NFA → NFA', NFA_TO_DFA: 'NFA → DFA', DFA_TO_MIN_DFA: 'DFA → Minimal DFA', NFA_TO_MIN_DFA: 'NFA → Minimal DFA',
};

export async function generatePractice() {
    const practiceBox = document.getElementById('practiceBox');
    const modeSelect = document.getElementById('modeSelect');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const kind = document.getElementById('practiceKind')?.value || 'BUILD';
    const level = document.getElementById('practiceMode').value;
    const mode = modeSelect ? modeSelect.value.split('_TO_')[0] : 'DFA';

    await ensurePracticeBankLoaded();
    if (typeof window.PRACTICE_BANK === 'undefined') {
        practiceBox.textContent = "Practice bank not loaded.";
        return;
    }

    const bank = kind === 'BUILD' ? window.PRACTICE_BANK[mode]?.[level] : window.PRACTICE_BANK[kind]?.[level];
    if (!bank || bank.length === 0) {
        practiceBox.textContent = `No ${level} questions for ${kind === 'BUILD' ? mode : KIND_LABEL[kind]}.`;
        if (checkAnswerBtn) checkAnswerBtn.hidden = true;
        return;
    }

    const pick = bank[Math.floor(Math.random() * bank.length)];
    const newPractice = { ...pick, kind, buildType: mode };
    setCurrentPractice(newPractice);

    const title = kind === 'BUILD' ? `${mode} | ${level}` : `${KIND_LABEL[kind]} | ${level}`;
    practiceBox.innerHTML = `<strong>${title}</strong><div style="margin-top:8px">${newPractice.q}</div>`;
    practiceBox.className = 'practice-fa-active';
    if (checkAnswerBtn) checkAnswerBtn.hidden = false;

    if (kind !== 'BUILD' && pick.source) {
        // Conversion practice: the machine to convert is drawn for you; edit it into the answer.
        const source = JSON.parse(JSON.stringify(pick.source));
        if (modeSelect) modeSelect.value = source.type;
        await animateMachineDrawing(source);
        MACHINE.type = source.type;
        addLogMessage(`Convert this ${source.type} (${KIND_LABEL[kind]}), then press Check Answer.`, 'repeat');
    }
}

export function showSolution(updateUIFunction) {
    if (!CURRENT_PRACTICE || !CURRENT_PRACTICE.machine) {
        setValidationMessage('No practice generated or solution unavailable.', 'error');
        return;
    }
    pushUndo(updateUIFunction);

    const modeSelect = document.getElementById('modeSelect');
    const correctType = CURRENT_PRACTICE.kind && CURRENT_PRACTICE.kind !== 'BUILD'
        ? CURRENT_PRACTICE.machine.type
        : (modeSelect ? modeSelect.value.split('_TO_')[0] : 'DFA');

    const solutionMachine = {
        ...JSON.parse(JSON.stringify(CURRENT_PRACTICE.machine)),
        type: correctType
    };

    animateMachineDrawing(solutionMachine);

    if (modeSelect) {
        modeSelect.value = correctType;
    }
}

/**
 * Structural requirements of a conversion answer, beyond accepting the right language.
 * Returns a list of human-readable problems (empty when the shape is right).
 */
export function conversionProblems(kind, userMachine, solutionMachine) {
    const problems = [];
    const sigma = [...new Set([...FA.machineAlphabet(userMachine), ...FA.machineAlphabet(solutionMachine)])].sort();
    const issues = FA.structuralIssues({ ...userMachine, type: 'DFA' }).map(i => i.kind);
    if (kind === 'ENFA_TO_NFA' && (userMachine.transitions || []).some(t => FA.splitSymbols(t.symbol).some(FA.isEpsilon))) {
        problems.push('Your machine still has ε-transitions; an NFA here must have none.');
    }
    if (kind !== 'ENFA_TO_NFA') {
        if (issues.includes('epsilon')) problems.push('A DFA cannot have ε-transitions.');
        if (issues.includes('nondeterministic')) problems.push('Some state has two moves on the same symbol, so this is not a DFA yet.');
        if (issues.includes('many-initial')) problems.push('A DFA has exactly one start state.');
    }
    if (kind === 'DFA_TO_MIN_DFA' || kind === 'NFA_TO_MIN_DFA') {
        const min = FA.toMinimalDfa(solutionMachine, sigma);
        const minStates = min.delta.length;
        const minNoTrap = minStates - FA.deadStates(min).filter(Boolean).length;
        const start = (userMachine.states || []).find(st => st.initial)?.id;
        const seen = new Set(start ? [start] : []); const queue = [...seen];
        while (queue.length) { const q = queue.shift(); for (const t of userMachine.transitions || []) if (t.from === q && !seen.has(t.to)) { seen.add(t.to); queue.push(t.to); } }
        const used = seen.size;
        const yours = (userMachine.states || []).length;
        if (yours > minStates || (yours < minStates && yours !== minNoTrap)) {
            problems.push(`Your DFA has ${yours} states, but the minimal DFA has ${minStates}${minNoTrap !== minStates ? ` (${minNoTrap} if you leave out the trap state)` : ''}. Some of your states are still equivalent.`);
        } else if (used < yours) {
            problems.push('Some states cannot be reached from the start state; remove them.');
        }
    }
    return problems;
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
    const isConversion = CURRENT_PRACTICE.kind && CURRENT_PRACTICE.kind !== 'BUILD';
    const correctType = isConversion ? CURRENT_PRACTICE.machine.type : (modeSelect ? modeSelect.value.split('_TO_')[0] : 'DFA');
    const solutionMachine = {
        ...CURRENT_PRACTICE.machine,
        type: correctType
    };

    // --- FIX: Ensure both machines are checked against the same, official alphabet ---
    // The equivalence check will now use the alphabet from the solution as the ground truth.
    const result = await compareMachines(userMachine, solutionMachine);

    if (result.equivalent && isConversion) {
        const problems = conversionProblems(CURRENT_PRACTICE.kind, userMachine, solutionMachine);
        if (problems.length) {
            setValidationMessage('Same language, but not finished: ' + problems[0], 'error');
            problems.forEach(p => addLogMessage('Hint: ' + p, 'lightbulb'));
            return;
        }
    }
    if (result.equivalent) {
        setValidationMessage('Correct Solution! Your automaton is logically equivalent to the solution.', 'success');
        addLogMessage('Result: Correct! good job buddy nice work', 'check-circle');
    } else {
        const w = result.counterexample;
        const why = w === null ? '' : (result.acceptedBy === 'a'
            ? ` Your machine accepts "${w}", but it should be rejected.`
            : ` Your machine rejects "${w}", but it should be accepted.`);
        setValidationMessage('Incorrect!' + why, 'error');
        addLogMessage('Result: Incorrect! come on bro u can do it.' + why, 'x-circle');
        // State-level hints (which state is wrong and why) from the Assistant's diagnoser.
        try {
            const sigma = [...new Set([...FA.machineAlphabet(userMachine), ...FA.machineAlphabet(solutionMachine)])].sort();
            const d = diagnose({ ...userMachine, type: 'DFA' }, FA.toMinimalDfa(solutionMachine, sigma));
            d.hints.filter(h => h.level === 'error').slice(0, 3).forEach(h => addLogMessage('Hint: ' + h.message, 'lightbulb'));
        } catch (_e) { /* hints are best-effort */ }
    }
}
