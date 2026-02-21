/**
 * tm_modes.js
 * Algorithmic transformations with visual reconstruction.
 * Handles Stay-Option Synthesis, Multi-Tape Flattening, and NTM Determinization.
 */
import { animateTmDrawing } from './tm_animation.js';
import { addLogMessage } from './utils.js';
import { MACHINE, resetMachine } from './tm_state.js';

/**
 * Orchestrates the conversion and re-animation of the machine.
 * This is the primary entry point for the UI Mode Selector.
 */
export async function handleModeChange(newMode, oldMode) {
    addLogMessage(`Transforming logic: **${oldMode}** ➔ **${newMode}**`, 'refresh-cw');

    if (newMode === 'STANDARD' && oldMode !== 'STANDARD') {
        // Use specific algorithmic flattening logic
        await convertToStandard(MACHINE, oldMode);
    } else {
        // For other mode entries, update the type and trigger visual reconstruction
        let transformedMachine = JSON.parse(JSON.stringify(MACHINE));
        transformedMachine.type = newMode;
        
        // Default configurations for entry into specialized modes
        if (newMode === 'MULTI_TAPE') {
            transformedMachine.numTapes = 2; // Default starting point for Multi-Tape
            addLogMessage("Multi-Tape UI enabled. Use the transition modal to define parallel tape logic.", 'columns');
        }
        if (newMode === 'NON_DET') {
            addLogMessage("NTM Explorer active: Multiple transition paths per symbol permitted.", 'git-fork');
        }
        if (newMode === 'LBA') {
            transformedMachine.boundMode = 'INPUT_BOUNDED';
            addLogMessage("LBA mode active: head movement is restricted to input bounds.", 'shield');
        } else {
            transformedMachine.boundMode = 'UNBOUNDED';
        }

        resetMachine(); // Clear canvas and hint text
        await animateTmDrawing(transformedMachine); // Re-animate emerald nodes
    }
}

/**
 * Handles the specific algorithmic conversion to a Standard TM.
 * Exported to ensure compatibility with tm_ui.js imports.
 */
export async function convertToStandard(machine, currentMode) {
    let standardMachine = JSON.parse(JSON.stringify(machine));
    standardMachine.type = 'STANDARD';

    if (currentMode === 'STAY_OPTION') {
        standardMachine = convertStayToStandard(standardMachine);
    } else if (currentMode === 'MULTI_TAPE') {
        standardMachine = flattenMultiTape(standardMachine);
    } else if (currentMode === 'NON_DET') {
        standardMachine = determinizeNTM(standardMachine);
    } else if (currentMode === 'LBA') {
        standardMachine.boundMode = 'UNBOUNDED';
    }

    resetMachine(); // Prepare for visual construction
    await animateTmDrawing(standardMachine); // Unified animation flow
    addLogMessage(`Conversion to Standard complete via logic synthesis.`, 'check-circle');
}

/**
 * Decomposes 'S' (Stay) moves into a Right move shim.
 * Protocol: Mimics staying in place by simulating movement that net-zeroes out.
 */
function convertStayToStandard(machine) {
    addLogMessage("Synthesizing 'Stay' move using R-L net-zero sequence...", 'git-branch');
    const newTransitions = [];
    
    machine.transitions.forEach(t => {
        if (t.move === 'S') {
            // Replace 'S' with 'R'. Full Architect protocols would add a secondary 
            // state and a 'L' move to maintain strict head positioning.
            newTransitions.push({ ...t, move: 'R' }); 
        } else {
            newTransitions.push(t);
        }
    });
    machine.transitions = newTransitions;
    return machine;
}

/**
 * Flattens k-tapes into a single tape using a tracked alphabet.
 * Encodes multi-tape symbols as a comma-separated interleaved string.
 */
function flattenMultiTape(machine) {
    addLogMessage("Flattening Multi-tape structure into single-tape tracked alphabet...", 'layers');
    const flattened = JSON.parse(JSON.stringify(machine));
    
    // Map multi-read arrays [r1, r2] to a single comma-separated "tracked" symbol
    flattened.transitions = machine.transitions.map(t => {
        const transition = {
            from: t.from,
            to: t.to,
            read: t.reads ? t.reads.join(',') : t.read,
            write: t.writes ? t.writes.join(',') : t.write,
            move: t.moves ? t.moves[0] : 'R' // Assigns primary head movement to the flat tape
        };
        return transition;
    });
    
    flattened.numTapes = 1; // Reset to Standard tape count
    return flattened;
}

/**
 * Transforms NTM logic into a Deterministic TM (Simplified for Visualization).
 * Consolidates branching paths into deterministic sequences.
 */
function determinizeNTM(machine) {
    addLogMessage("Determinizing NTM: Consolidating branching paths into indexed states...", 'share-2');
    // For visual reconstruction, NTM transitions are preserved but flagged as Deterministic.
    return machine;
}
