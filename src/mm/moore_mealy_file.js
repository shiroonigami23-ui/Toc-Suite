

import { MACHINE, setMachine, pushUndo } from './moore_mealy_state.js';
import { renderAll, layoutStatesCircular } from './moore_mealy_renderer.js';
import { setValidationMessage, addLogMessage, safeFileName } from '../shared/utils.js';
import { animateMachineDrawing } from '../shared/animation.js';
import { runSimulation } from './moore_mealy_simulation.js';
import { decideSubmissionMode, getStudentProfile, stageToDb } from '../shared/assignment-client.js';
import { routeMachineImport } from '../app/machine_router.js';
// --- Machine Analysis Helpers (Used for smart save metadata) ---

/**
 * Traces the output for a given input string based on the machine type (Moore or Mealy).
 * @param {object} machine The Mealy/Moore machine object.
 * @param {string} inputStr The input string to trace.
 * @returns {string} The resulting output string, or an error message if a trap is hit.
 */
function traceOutputForString(machine, inputStr) {
    const initial = machine.states.find(s => s.initial);
    if (!initial) return "No initial state";

    let currentState = initial.id;
    let output = '';

    // Moore machines output the initial state's output before processing the first input
    if (machine.type === 'MOORE') {
        output += initial.output || '';
    }

    for (const symbol of inputStr) {
        const transition = machine.transitions.find(t => t.from === currentState && t.symbol === symbol);
        if (!transition) {
            return output + " [TRAP on " + symbol + "]";
        }

        currentState = transition.to;

        // Mealy machines output on the transition
        if (machine.type === 'MEALY') {
            output += transition.output || '';
        } 
        // Moore machines output on the entry to the next state
        else if (machine.type === 'MOORE') {
            const nextState = machine.states.find(s => s.id === currentState);
            output += nextState ? (nextState.output || '') : '';
        }
    }

    return output;
}

/**
 * Finds the shortest input string and its corresponding output sequence.
 * @param {object} machine The Mealy/Moore machine object.
 * @returns {{input: string, output: string}|null} The shortest path and output, or null.
 */
function findShortestPathAndOutput(machine) {
    const queue = [];
    const visited = new Set();
    const initial = machine.states.find(s => s.initial);
    if (!initial) return null;

    queue.push({ stateId: initial.id, input: "" });
    visited.add(initial.id);

    let head = 0;
    while (head < queue.length) {
        const { stateId, input } = queue[head++];
        if (input.length > 5) continue; // Performance guard

        const outgoing = machine.transitions.filter(t => t.from === stateId);
        
        for (const t of outgoing) {
            const newPath = input + t.symbol;
            const visitedKey = t.to + "," + newPath;

            if (!visited.has(visitedKey)) {
                visited.add(visitedKey);
                
                // Found a path, calculate output and return it
                const output = traceOutputForString(machine, newPath);
                return { input: newPath, output: output };
            }
        }
    }
    return null;
}

/**
 * Generates a descriptive title for the machine based on its type and shortest example.
 * @param {object} machine The Mealy/Moore machine object.
 * @returns {string} A descriptive title.
 */
function analyzeMachineStructure(machine) {
    // 1. Attempt Pattern Analysis (The new smarter logic)
    const patternTitle = analyzeMachinePatterns(machine);
    if (patternTitle) {
        return patternTitle;
    }
    
    // 2. Fallback to Simple I/O Trace (The original logic)
    const shortestExample = findShortestPathAndOutput(machine);
    const typeLabel = machine.type || 'Machine';

    if (shortestExample && shortestExample.input && shortestExample.output) {
        if (shortestExample.output.includes('[TRAP')) {
             return `${typeLabel}: Functional, but shortest trace hits a trap.`;
        }
        return `${typeLabel}: I/O Trace: "${shortestExample.input}" → "${shortestExample.output}"`;
    }
    
    // 3. Final Fallback
    return `${typeLabel}: Generic Machine with ${machine.states.length} states`;
}

// --- File Handling and Saving ---

export function handleSaveMachine() {
    const modal = document.getElementById('saveLibraryModal');
    const titleInput = document.getElementById('libTitleInput');
    const descInput = document.getElementById('libDescInput');
    const alphaDisplay = document.getElementById('libAlphabetDisplay');
    const typeInput = document.getElementById('libTypeInput');

    if (!modal || !titleInput || !descInput || !alphaDisplay || !typeInput) return;
    
    if (!MACHINE.states || MACHINE.states.length === 0) {
        window.customAlert("Save Failed", "Please draw a machine before saving.");
        return;
    }

    const inputAlphabet = [...new Set(MACHINE.transitions.map(t => t.symbol).filter(s => s))].sort();
    let outputAlphabet = [];
    if (MACHINE.type === 'MOORE') {
        outputAlphabet = [...new Set(MACHINE.states.map(s => s.output).filter(o => o))].sort();
    } else if (MACHINE.type === 'MEALY') {
        outputAlphabet = [...new Set(MACHINE.transitions.map(t => t.output).filter(o => o))].sort();
    }

    // --- YOUR SMART TITLE & ANALYSIS ---
    titleInput.value = analyzeMachineStructure(MACHINE);
    const shortestExample = findShortestPathAndOutput(MACHINE);
    const shortDesc = shortestExample ? `Example: Input "${shortestExample.input}" outputs "${shortestExample.output}".` : 'No simple input/output sequence found.';
    
    const inputAlphaStr = inputAlphabet.join(', ') || '∅';
    const outputAlphaStr = outputAlphabet.join(', ') || '∅';

    descInput.value = shortDesc;
    typeInput.value = MACHINE.type;
    alphaDisplay.innerHTML = `<strong>Input ($\Sigma$):</strong> {${inputAlphaStr}} | <strong>Output ($\Gamma$):</strong> {${outputAlphaStr}}`;
    alphaDisplay.style.display = 'block';

    modal.style.display = 'flex';

}

/**
 * Analyzes the machine's state structure to guess common patterns (e.g., parity, sequence detection).
 * @param {object} machine The Mealy/Moore machine object.
 * @returns {string|null} A descriptive title based on a pattern, or null.
 */
function analyzeMachinePatterns(machine) {
    const { states, transitions, type } = machine;
    const isMoore = type === 'MOORE';
    const numStates = states.length;

    // --- Heuristic 1: Parity/Modulus Counting (2, 3, or 4 states) ---
    // Look for rotational structure where all symbols map to the next state in a cycle.
    
    if (numStates >= 2 && numStates <= 4) {
        const alphabet = [...new Set(transitions.map(t => t.symbol).filter(s => s))];
        
        let isCycle = true;
        for (const state of states) {
            // Check if every input symbol maps to a state determined by the cycle
            if (!alphabet.every(symbol => {
                const outgoing = transitions.filter(t => t.from === state.id && t.symbol === symbol);
                return outgoing.length === 1; // Already enforced by validation, but good to check.
            })) {
                isCycle = false;
                break;
            }
        }

        if (isCycle) {
            const outputs = isMoore 
                ? states.map(s => s.output || '?').join(', ') 
                : transitions.map(t => t.output || '?').join(', ');
            
            if (numStates === 2) {
                // Common pattern for length parity or change detection
                return `${type}: Parity/Even/Odd Counter (I/O Cycle of 2)`;
            }
            if (numStates === 3) {
                return `${type}: Modulo 3 Counter / Sequence Tracker`;
            }
            if (numStates === 4) {
                // Common pattern for Modulo 4 counter or 2-bit sequence history
                return `${type}: Modulo 4 / Sequence History Tracker`;
            }
        }
    }

    // --- Heuristic 2: Simple Sequence Detection/Bit History ---
    // Check if the machine has 3-4 states and a terminal state that loops back differently.
    if (numStates >= 3 && numStates <= 5) {
        // Find a state that outputs something unique (Moore) or leads to unique output transitions (Mealy)
        let uniqueOutputState = null;
        if (isMoore) {
            const outputCounts = {};
            states.forEach(s => { outputCounts[s.output] = (outputCounts[s.output] || 0) + 1; });
            const uniqueOutput = Object.keys(outputCounts).find(o => outputCounts[o] === 1);
            if (uniqueOutput) {
                uniqueOutputState = states.find(s => s.output === uniqueOutput);
            }
        }
        
        // If a unique/final state is found, trace the shortest path to it for a sequence.
        if (uniqueOutputState) {
            const path = findShortestPathToState(machine, uniqueOutputState.id);
            if (path && path.length > 1) {
                return `${type}: Detects sequence "${path}"`;
            }
        }
    }

    return null; 
}

/**
 * ARCHITECT UPGRADE: handleSaveWithMetadata
 * Retains coordinate cleaning while integrating silent staging.
 */
export function handleSaveWithMetadata() {
    const title = document.getElementById('libTitleInput').value.trim();
    const userDescription = document.getElementById('libDescInput').value.trim();
    const type = document.getElementById('libTypeInput').value;

    if (!title) {
        window.customAlert("Input Required", "Please enter a title for the library entry.");
        return;
    }

    const inputAlphabet = [...new Set(MACHINE.transitions.map(t => t.symbol).filter(s => s))].sort();
    let outputAlphabet = [];
    if (type === 'MOORE') {
        outputAlphabet = [...new Set(MACHINE.states.map(s => s.output).filter(o => o))].sort();
    } else if (type === 'MEALY') {
        outputAlphabet = [...new Set(MACHINE.transitions.map(t => t.output).filter(o => o))].sort();
    }

    // --- CLEAN MACHINE DATA (Preserving Visuals) ---
    const machineToSave = {
        type: MACHINE.type, 
        states: MACHINE.states.map(s => {
            // Architect Fix: Clean structure for Moore/Mealy logic
            return { id: s.id, initial: s.initial, output: s.output, x: s.x, y: s.y };
        }),
        transitions: MACHINE.transitions.map(t => {
            return { from: t.from, to: t.to, symbol: t.symbol, output: t.output };
        }),
        alphabet: inputAlphabet, 
        output_alphabet: outputAlphabet
    };
    
    const libraryEntry = {
        title: title,
        description: userDescription,
        type: type,
        machine: machineToSave
    };

    // --- ARCHITECT'S DATA CONTRACT: mm_ prefix ---
    const prefix = "mm_";
    const fileName = `${prefix}${safeFileName(title)}.json`;

    // 1. LOCAL DOWNLOAD (User Action)
    const blob = new Blob([JSON.stringify(libraryEntry, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    addLogMessage(`Local save complete: ${fileName}`, 'check-circle');

    // 2. Copy to the class review queue in the background (never blocks the download)
    decideSubmissionMode('MM').then(assignment => stageToDb({
        name: title, type: 'MM', data: libraryEntry,
        author: getStudentProfile().name || 'Student',
        submissionMode: assignment.submissionMode,
        assignmentId: assignment.assignmentId,
        assignmentTitle: assignment.assignmentTitle,
        studentProfile: getStudentProfile()
    })).catch(() => {});

    const modal = document.getElementById('saveLibraryModal');
    if (modal) modal.style.display = 'none';
}

/**
 * Loads a Mealy/Moore machine from a local JSON file.
 * @param {Event} e The file change event.
 * @param {function} updateUIFunction Function to update UI elements (required for pushUndo).
 */
export function loadMachine(e, updateUIFunction) {
    const file = e?.target?.files?.[0];
    if (!file) {
        setValidationMessage("No file selected or file access error.", 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = JSON.parse(ev.target.result);
            const machineData = data.machine || data; // Handles both file formats

            if (machineData.states && machineData.transitions) {
                const rerouted = routeMachineImport(machineData, 'mm');
                if (!rerouted.handled) {
                    loadMachineFromObject(machineData, updateUIFunction, data.type || 'MOORE');
                }
            } else {
                setValidationMessage("Invalid machine file format (Missing states or transitions).", 'error');
            }
        } catch (err) {
            setValidationMessage("Invalid JSON file: " + err.message, 'error');
        } finally {
            // Clear file input to allow re-loading the same file
            if (e && e.target) e.target.value = '';
        }
    };
    reader.readAsText(file);
}

export function loadMachineFromObject(machineData, updateUIFunction, fallbackType = 'MOORE') {
    if (!machineData || !machineData.states || !machineData.transitions) return;

    if (updateUIFunction) {
        pushUndo(updateUIFunction);
    }

    const machineToLoad = {
        type: machineData.type || fallbackType || 'MOORE',
        ...machineData
    };

    const needsLayout = machineToLoad.states.every((s) => s.x === undefined || s.y === undefined);
    if (needsLayout) {
        layoutStatesCircular(machineToLoad.states);
    }

    setMachine(machineToLoad);
    animateMachineDrawing(machineToLoad);

    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) modeSelect.value = machineToLoad.type;
}

// --- PNG EXPORT (Logic remains correct for MM context) ---
export function exportPng(fileName = 'automaton') {
    const svgEl = document.getElementById("dfaSVG");
    if (!svgEl) {
        window.customAlert('Export Failed', 'SVG canvas element not found.');
        return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let bbox;
    try {
        if (!MACHINE.states || MACHINE.states.length === 0) {
            throw new Error("Empty machine.");
        }
        bbox = svgEl.getBBox();
    } catch (e) {
        window.customAlert('Export Failed', 'Could not determine canvas content bounds. Is the machine empty?');
        return;
    }

    const padding = 30;
    const width = bbox.width + (padding * 2);
    const height = bbox.height + (padding * 2);

    const scale = 2; // Export at 2x resolution
    canvas.width = width * scale;
    canvas.height = height * scale;

    const svgClone = svgEl.cloneNode(true);
    
    svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
    svgClone.setAttribute('width', width);
    svgClone.setAttribute('height', height);

    const styleEl = document.createElement('style');
    // Using the MM Studio's orange/red scheme
    styleEl.textContent = `
        .state-circle { fill: #fff; stroke: #ff9800; stroke-width: 3; }
        .state-label { font-family: Inter, sans-serif; font-weight: 700; fill: #0b1220; text-anchor: middle; dominant-baseline: central; font-size: 14px; }
        .transition-path { fill: none; stroke: #ff9800; stroke-width: 2; marker-end: url(#arrowhead-export); }
        .initial-arrow { stroke: black !important; stroke-width: 3 !important; marker-end: url(#arrowhead-export); }
        .initial-pulse { animation: none; }
        .final-ring { fill: none; stroke: #ff9800; stroke-width: 4; }
        .transition-label-text {
          stroke: white;
          stroke-width: 4px;
          stroke-linejoin: round;
          fill: none;
          font-family: Inter, sans-serif; text-anchor: middle; font-size: 13px; font-weight: 700;
        }
        .transition-label {
          font-family: Inter, sans-serif;
          font-weight: 700;
          fill: #0b1220;
          text-anchor: middle;
          font-size: 13px;
        }
    `;
    
    let defs = svgClone.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS(svgEl.namespaceURI, 'defs');
        svgClone.prepend(defs);
    }
    defs.appendChild(styleEl);

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        URL.revokeObjectURL(url);

        const a = document.createElement("a");
        const finalFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
        a.download = finalFileName;
        a.href = canvas.toDataURL("image/png");
        a.click();
    };

    img.onerror = (e) => {
        console.error("Error loading SVG image for export:", e);
        window.customAlert('Export Failed', 'An error occurred during image conversion.');
        URL.revokeObjectURL(url);
    };

    img.src = url;
}
