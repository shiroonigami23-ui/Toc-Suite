/**
 * tm_simulation.js
 * Core simulation logic for the Turing Machine.
 */

import { addLogMessage } from './utils.js';
import { updateTapeUI } from './tm_visualizer.js';

// --- FIXED: Exporting the simulation state ---
export let activeSim = {
    tapes: [['B']], // Multi-tape structure
    heads: [0],
    currentStateId: null,
    steps: 0,
    maxSteps: 1000,
    isRunning: false
};

/**
 * Initializes simulation state for the visual tester.
 */
export function initInteractiveSim(inputString, machine) {
    const blank = machine.blankSymbol || 'B';
    
    // Initialize parallel tapes based on machine mode
    activeSim.tapes = machine.type === 'MULTI_TAPE' 
        ? Array.from({ length: machine.numTapes || 1 }, (_, i) => i === 0 ? inputString.split('') : [blank])
        : [inputString.length > 0 ? inputString.split('') : [blank]];
    
    activeSim.heads = Array.from({ length: machine.numTapes || 1 }, () => 0);
    activeSim.currentStateId = machine.states.find(s => s.initial)?.id;
    activeSim.steps = 0;
    activeSim.isRunning = true;

    updateTapeUI(activeSim.tapes, activeSim.heads);
    addLogMessage(`Simulation started with input: "${inputString}"`, 'play');
}


/**
 * Internal helper to record tape operations in the sidebar log.
 * Synchronized with the Architect Engine's activity standards.
 */
async function logTmStep(stateId, symbolRead, symbolWrite, direction) {
    const { addLogMessage } = await import('./utils.js');
    
    const message = `
        <span style="color:#10b981; font-weight:bold;">${stateId}:</span> 
        Read '${symbolRead}', Wrote '${symbolWrite}', Moved ${direction}
    `;
    
    addLogMessage(message, 'activity');
}

/**
 * Executes a single logical step of the Turing Machine.
 * Upgraded to support real-time activity logging.
 */
export async function stepTmSimulation(machine) {
    if (!activeSim.isRunning) return { status: 'stopped' };

    const currentState = machine.states.find(s => s.id === activeSim.currentStateId);
    if (!currentState) return { status: 'error' };

    // 1. Check for Acceptance (Halt State)
    if (currentState.accepting) {
        activeSim.isRunning = false;
        const { addLogMessage } = await import('./utils.js');
        addLogMessage(`Halted: Accepted!`, 'check-circle');
        return { status: 'accepted' };
    }

    const tapeIdx = 0; // Standard uses first tape
    const currentTape = activeSim.tapes[tapeIdx];
    let head = activeSim.heads[tapeIdx];
    const blank = machine.blankSymbol || 'B';

    // 2. Infinite Tape Expansion
    if (head < 0) { 
        currentTape.unshift(blank); 
        head = 0; 
        activeSim.heads[tapeIdx] = 0; 
    }
    else if (head >= currentTape.length) { 
        currentTape.push(blank); 
    }
    
    const readSymbol = currentTape[head];
    const transition = machine.transitions.find(t => t.from === activeSim.currentStateId && t.read === readSymbol);

    // 3. Handle Rejection (No valid transition)
    if (!transition) {
        activeSim.isRunning = false;
        const { addLogMessage } = await import('./utils.js');
        addLogMessage(`No transition: Rejected.`, 'x-circle');
        return { status: 'rejected' };
    }

    // --- ARCHITECTURAL SYNC: LOG STEP ---
    // We log the source state and the symbols before updating the ID
    await logTmStep(activeSim.currentStateId, readSymbol, transition.write, transition.move);

    // 4. Execute Transition Logic
    currentTape[head] = transition.write;
    if (transition.move === 'R') activeSim.heads[tapeIdx]++;
    else if (transition.move === 'L') activeSim.heads[tapeIdx]--;

    activeSim.currentStateId = transition.to;
    activeSim.steps++;

    // 5. Sync Visualizers
    const { updateTapeUI } = await import('./tm_visualizer.js');
    updateTapeUI(activeSim.tapes, activeSim.heads);
    
    const { highlightStep } = await import('./tm_renderer.js');
    highlightStep(activeSim.currentStateId, transition);
    
    return { status: 'running' };
}

/**
 * Runs a full, non-visual simulation (for Bulk Testing).
 */
export function runTmSimulation(inputString, machine, maxSteps = 1000) {
    const blank = machine.blankSymbol || 'B';
    let currentTape = inputString.length > 0 ? inputString.split('') : [blank];
    let head = 0;
    let currentStateId = machine.states.find(s => s.initial)?.id;
    const path = [];
    let steps = 0;

    path.push({ state: currentStateId, tape: [...currentTape], head: head, log: "Initial" });

    while (steps < maxSteps) {
        const currentState = machine.states.find(s => s.id === currentStateId);
        if (!currentState) break;
        if (currentState.accepting) {
            return { success: true, path, finalTape: currentTape.join(''), message: "Accepted" };
        }

        if (head < 0) { currentTape.unshift(blank); head = 0; }
        else if (head >= currentTape.length) { currentTape.push(blank); }
        
        const readSymbol = currentTape[head];
        const transition = machine.transitions.find(t => t.from === currentStateId && t.read === readSymbol);

        if (!transition) return { success: false, path, message: "Rejected" };

        currentTape[head] = transition.write;
        if (transition.move === 'R') head++;
        else if (transition.move === 'L') head--;

        currentStateId = transition.to;
        steps++;
        path.push({ state: currentStateId, tape: [...currentTape], head: head, transition });
    }
    return { success: false, path, message: "Timeout" };
}

/**
 * tm_simulation.js - NTM Logic addition
 */
export function getNTMBranches(machine, currentStateId, readSymbol) {
    // Find ALL matching transitions for NTM
    const matches = machine.transitions.filter(t => 
        t.from === currentStateId && t.read === readSymbol
    );

    if (matches.length > 1) {
        addLogMessage(`NTM: Found ${matches.length} possible paths. Branching...`, 'git-fork');
    }
    
    return matches;
}

/**
 * Executes a single step for a Multi-Tape (k-Tape) Turing Machine.
 * This function reads symbols from all $k$ heads simultaneously and 
 * applies the corresponding multi-symbol transition.
 */
export function stepMultiTape(machine) {
    if (!activeSim.isRunning) return { status: 'stopped' };

    const currentState = machine.states.find(s => s.id === activeSim.currentStateId);
    const blank = machine.blankSymbol || 'B';

    // 1. Safety Checks
    if (!currentState || activeSim.steps >= activeSim.maxSteps) {
        activeSim.isRunning = false;
        return { status: 'error', message: currentState ? "Max steps exceeded." : "Invalid state." };
    }

    // 2. Acceptance Check
    if (currentState.accepting) {
        activeSim.isRunning = false;
        import('./tm_renderer.js').then(m => m.highlightStep(activeSim.currentStateId, null));
        addLogMessage(`Multi-Tape Machine Halted: Accepted!`, 'check-circle');
        return { status: 'accepted' };
    }

    // 3. Multi-Tape Read Logic
    // activeSim.tapes is an array of arrays; activeSim.heads is an array of indices.
    const currentSymbols = activeSim.tapes.map((tape, i) => {
        let head = activeSim.heads[i];
        // Dynamic expansion for each individual tape
        if (head < 0) {
            tape.unshift(blank);
            activeSim.heads[i] = 0;
            head = 0;
        } else if (head >= tape.length) {
            tape.push(blank);
        }
        return tape[head];
    });

    // 4. Multi-Transition Matching
    // Transitions in Multi-Tape mode store arrays: reads[], writes[], and moves[]
    const transition = machine.transitions.find(t => {
        return t.from === activeSim.currentStateId && 
               t.reads.every((symbol, i) => symbol === currentSymbols[i]);
    });

    if (!transition) {
        activeSim.isRunning = false;
        addLogMessage(`No Multi-Tape transition found for symbols: [${currentSymbols.join(', ')}]. Rejected.`, 'x-circle');
        return { status: 'rejected' };
    }

    // 5. Multi-Tape Execution (Write -> Move)
    transition.writes.forEach((symbol, i) => {
        activeSim.tapes[i][activeSim.heads[i]] = symbol;
    });

    transition.moves.forEach((move, i) => {
        if (move === 'R') activeSim.heads[i]++;
        else if (move === 'L') activeSim.heads[i]--;
        // 'S' remains unchanged
    });

    // 6. State Change & Visual Sync
    const prevStateId = activeSim.currentStateId;
    activeSim.currentStateId = transition.to;
    activeSim.steps++;

    // Update all tape rows in the UI
    updateTapeUI(activeSim.tapes, activeSim.heads);
    
    // Highlight the state and the transition on the canvas
    import('./tm_renderer.js').then(m => {
        m.highlightStep(prevStateId, transition);
    });

    addLogMessage(
        `Step ${activeSim.steps}: Tapes Read [${currentSymbols.join(',')}] → Wrote [${transition.writes.join(',')}], Moved [${transition.moves.join(',')}], State ${activeSim.currentStateId}`, 
        'step-forward'
    );

    return { 
        status: 'running', 
        heads: [...activeSim.heads], 
        state: activeSim.currentStateId 
    };
}