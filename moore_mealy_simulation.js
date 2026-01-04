import { MACHINE, simState } from './moore_mealy_state.js';
import { sleep, addLogMessage } from './utils.js';

/**
 * Runs a simulation on a Mealy or Moore machine and generates the output string.
 * @param {string} inputStr The string to test.
 * @param {object} [machineToTest=MACHINE] The automaton to run against. Defaults to the global MACHINE.
 * @param {boolean} isSilentMode If true, avoids DOM manipulation and returns the result object.
 * @returns {{output: string}} The simulation result.
 */
export function runSimulation(inputStr, machineToTest = null, isSilentMode = false) {
    const machine = machineToTest || MACHINE;
    const isMoore = machine.type === 'MOORE';

    // --- Initialization ---
    if (!isSilentMode) {
        simState.steps.length = 0;
        simState.index = 0;
        simState.input = inputStr;
        simState.output = '';
        clearTimeout(simState.timer);
        document.getElementById('stepLog').innerHTML = '';
        const testOutput = document.getElementById('testOutput');
        testOutput.textContent = isMoore ? 'Starting Moore Machine...' : 'Starting Mealy Machine...';
        testOutput.style.color = '#3b82f6';
    }

    const initialState = machine.states.find(s => s.initial);
    if (!initialState) {
        if (!isSilentMode) document.getElementById('testOutput').textContent = 'Error: No initial state defined.';
        return { output: 'ERROR: NO INITIAL STATE' };
    }

    let currentStateId = initialState.id;
    let outputString = '';
    let halted = false;

    // --- Step 0: Initial Output (Moore Only) ---
    if (isMoore) {
        const initialOutput = initialState.output;
        if (!initialOutput) {
            const error = `Moore Error: Initial state ${initialState.id} missing output ($\lambda$).`;
            if (!isSilentMode) document.getElementById('testOutput').textContent = error;
            return { output: error };
        }
        outputString += initialOutput;
        if (!isSilentMode) {
             simState.steps.push({ 
                start: true, 
                current: currentStateId, 
                output: initialOutput,
                message: `Initial Moore output $\\lambda(${currentStateId}) = \\mathbf{${initialOutput}}$` 
            });
        }
    } else {
        if (!isSilentMode) {
             simState.steps.push({ 
                start: true, 
                current: currentStateId, 
                message: `Starting Mealy Machine at state $\\mathbf{${currentStateId}}$` 
            });
        }
    }


    // --- Input Processing Loop ---
    for (let i = 0; i < inputStr.length; i++) {
        const symbol = inputStr[i];
        if (halted) break;

        const transition = machine.transitions.find(t => t.from === currentStateId && t.symbol === symbol);

        if (!transition) {
            halted = true;
            if (!isSilentMode) {
                simState.steps.push({
                    halt: true, 
                    input: symbol, 
                    current: currentStateId, 
                    message: `Halted: No transition found from $\\mathbf{${currentStateId}}$ on input '<strong>${symbol}</strong>'.`
                });
            }
            break;
        }

        const nextStateId = transition.to;
        let stepOutput = '';
        let stepMessage = '';

        if (isMoore) {
            // Moore machine output is from the DESTINATION state $\lambda(q_{\text{next}})$
            const nextState = machine.states.find(s => s.id === nextStateId);
            stepOutput = nextState ? (nextState.output || '') : ''; // Defensive check for missing state/output
            stepMessage = `Input '<strong>${symbol}</strong>': $\\delta(${currentStateId}, ${symbol}) = \\mathbf{${nextStateId}}$, output $\\lambda(${nextStateId}) = \\mathbf{${stepOutput}}$`;
        } else {
            // Mealy machine output is from the TRANSITION $\gamma(q_{\text{current}}, a)$
            stepOutput = transition.output || ''; // Defensive check for missing output
            stepMessage = `Input '<strong>${symbol}</strong>': $\\delta(${currentStateId}, ${symbol}) = \\mathbf{${nextStateId}}$, output $\\gamma(${currentStateId}, ${symbol}) = \\mathbf{${stepOutput}}$`;
        }
        
        outputString += stepOutput;

        if (!isSilentMode) {
            simState.steps.push({
                input: symbol,
                current: currentStateId,
                next: nextStateId,
                transition: transition,
                output: stepOutput,
                cumulativeOutput: outputString,
                message: stepMessage,
            });
        }
        
        currentStateId = nextStateId;
    }
    
    // --- Finalization ---
    if (!isSilentMode) {
        simState.output = outputString;
        // FIX: The final log step should explicitly call addLogMessage to prevent leaks
        addLogMessage(`Final state $\\mathbf{${currentStateId}}$ reached. Total output: $\\mathbf{${outputString}}$`, 'check-circle');
        
        // This is where we start the animation, not where we return the message
        playAuto(); 
    }
    
    // The explicit return for silent mode must be outside the if (!isSilentMode) block
    return { output: outputString };
}

// --- Animation/Playback Functions ---

/**
 * Animates a single step of the Mealy/Moore simulation.
 * Now synchronized with the Machine Intelligence Logic Explorer.
 * @param {number} idx The step index to display.
 */
export async function showStep(idx) {
    if (idx < 0 || idx >= simState.steps.length) {
        simState.index = Math.max(0, Math.min(idx, simState.steps.length - 1));
        return;
    }
    
    simState.index = idx;
    const step = simState.steps[idx];
    const log = document.getElementById('stepLog');
    const speed = parseInt(document.getElementById('testSpeed').value || '800');
    const testOutput = document.getElementById('testOutput');

    // Reset visual highlights for canvas and logic table
    document.querySelectorAll('.state-animating, .transition-animating').forEach(el => 
        el.classList.remove('state-animating', 'transition-animating')
    );

    if (step.start) {
        testOutput.textContent = `Starting machine at state ${step.current}`;
        log.innerHTML = `<div><i data-lucide="zap"></i> <div>${step.message}</div></div>` + log.innerHTML;
        document.querySelector(`.state-circle[data-id="${step.current}"]`)?.classList.add('state-animating');
        if(step.output) testOutput.textContent = `Initial Output: ${step.output}`;
        return;
    }
    
    if (step.halt) {
        testOutput.textContent = `Halted at state ${step.current}.`;
        testOutput.style.color = '#e53e3e';
        log.innerHTML = `<div><i data-lucide="alert-triangle"></i> <div>${step.message}</div></div>` + log.innerHTML;
        return;
    }
    
    if (step.end) {
        testOutput.textContent = `Final Output: ${step.cumulativeOutput}`;
        testOutput.style.color = '#38a169';
        document.querySelector(`.state-circle[data-id="${step.current}"]`)?.classList.add('state-animating');
        return;
    }

    // --- Standard Processing Step ---
    testOutput.textContent = `Input: ${step.input}. Output: ${step.cumulativeOutput}`;

    // --- MACHINE INTELLIGENCE SYNC: Logic Row Highlight ---
    // Finds the index in the transitions array to match the modal table
    if (step.transition) {
        const transitionIndex = MACHINE.transitions.findIndex(t => 
            t.from === step.current && t.symbol === step.input
        );
        
        if (transitionIndex !== -1) {
            import('./mm_logic_table.js').then(m => m.highlightMmTableRow(transitionIndex));
        }
    }

    // 1. Animate FROM state
    document.querySelector(`.state-circle[data-id="${step.current}"]`)?.classList.add('state-animating');
    
    // 2. Animate transition path
    await sleep(speed / 3);
    document.querySelector(`.transition-path[data-from="${step.current}"][data-to="${step.next}"]`)?.classList.add('transition-animating');
    
    // 3. Log details to the trace
    log.innerHTML = `<div><i data-lucide="git-branch"></i> <div>${step.message}</div></div>` + log.innerHTML;
    
    // 4. Animate TO state
    await sleep(speed / 3);
    document.querySelectorAll('.state-animating, .transition-animating').forEach(el => 
        el.classList.remove('state-animating', 'transition-animating')
    );
    document.querySelector(`.state-circle[data-id="${step.next}"]`)?.classList.add('state-animating');
}

/**
 * Automatically plays the steps of the simulation.
 */
async function playAuto() {
    const manualButtons = document.getElementById('manualButtons');
    if (manualButtons) manualButtons.style.display = 'none';

    for (let i = 0; i < simState.steps.length; i++) {
        // Stop before the final step, which is just a log message.
        if (simState.steps[i].end) break; 
        
        await showStep(i);
        const speed = parseInt(document.getElementById('testSpeed').value || '800');
        if (i < simState.steps.length - 1) {
            await sleep(speed);
        }
    }
}