import { MACHINE, setMachine, pushUndo } from './state.js';
import { renderAll, layoutStatesCircular } from './renderer.js';
import { setValidationMessage, addLogMessage, safeFileName } from '../shared/utils.js';
import { animateMachineDrawing } from '../shared/animation.js';
// NEW: Import the conversion functions we will now use locally
import { convertNfaToDfa, minimizeDfa } from './automata.js';
import { decideSubmissionMode, getStudentProfile, stageToDb } from '../shared/assignment-client.js';
import { routeMachineImport } from '../app/machine_router.js';
// --- Machine Analysis Helpers for Smart Save ---

/**
 * Finds the shortest path from the initial state to the first accepting state.
 * @param {object} machine The automaton to analyze.
 * @param {number} minLength The minimum length of the path to find.
 * @returns {string|null} The shortest accepted string or null.
 */
function findShortestPathToAccept(machine, minLength = 0) {
    const queue = [];
    const visited = new Set();
    const initialStates = machine.states.filter(s => s.initial);
    if (initialStates.length === 0) return null;

    for (const startState of initialStates) {
        if (startState.accepting && minLength === 0) return "ε";
        queue.push({ stateId: startState.id, path: "" });
        visited.add(startState.id);
    }

    let head = 0;
    while (head < queue.length) {
        const { stateId, path } = queue[head++];
        if (path.length > 5) continue; // Performance guard

        const outgoing = machine.transitions.filter(t => t.from === stateId);
        for (const t of outgoing) {
            if (!t.symbol && t.symbol !== "") continue; // Ignore epsilon for path strings
            const newPath = path + t.symbol;
            const nextState = machine.states.find(s => s.id === t.to);

            if (nextState && nextState.accepting && newPath.length >= minLength) {
                return newPath; // Found the shortest valid path
            }

            const visitedKey = t.to + "," + newPath;
            if (nextState && !visited.has(visitedKey)) {
                visited.add(visitedKey);
                queue.push({ stateId: t.to, path: newPath });
            }
        }
    }
    return null;
}

/**
 * Finds the shortest path from the initial state to a specific target state.
 * @param {object} machine The automaton to analyze.
 * @param {string} targetStateId The ID of the state to find a path to.
 * @returns {string|null} The shortest path string or null.
 */
function findShortestPathToState(machine, targetStateId) {
    const queue = [];
    const visited = new Set();
    const initialStates = machine.states.filter(s => s.initial);
    if (initialStates.length === 0) return null;

    for (const startState of initialStates) {
        if (startState.id === targetStateId) return "";
        queue.push({ stateId: startState.id, path: "" });
        visited.add(startState.id);
    }

    let head = 0;
    while (head < queue.length) {
        const { stateId, path } = queue[head++];
        if (path.length > 5) continue;

        const outgoing = machine.transitions.filter(t => t.from === stateId);
        for (const t of outgoing) {
             if (!t.symbol && t.symbol !== "") continue;
            const newPath = path + t.symbol;
            if (t.to === targetStateId) {
                return newPath;
            }

            const visitedKey = t.to + "," + newPath;
            if (!visited.has(visitedKey)) {
                visited.add(visitedKey);
                queue.push({ stateId: t.to, path: newPath });
            }
        }
    }
    return null;
}


/**
 * Analyzes the machine's structure to guess its purpose (e.g., "starts with", "ends with").
 * @param {object} machine The automaton to analyze.
 * @returns {string|null} A descriptive title or null if no pattern is found.
 */
function analyzeMachineStructure(machine) {
    const { states, transitions } = machine;
    if (states.length < 1) return null;

    const alphabet = [...new Set(transitions.map(t => t.symbol).filter(s => s != null && s !== ''))].sort();
    if (alphabet.length === 0) return null;

    const initialState = states.find(s => s.initial);
    if (!initialState) return null;

    // --- Helper to find trap states ---
    const trapStates = new Set(states.filter(s => {
        if (s.accepting) return false;
        const outgoing = transitions.filter(t => t.from === s.id);
        // It's a trap state if all symbols in the alphabet loop back to itself
        return alphabet.every(symbol => {
            const transForSymbol = outgoing.filter(t => t.symbol === symbol);
            return transForSymbol.length > 0 && transForSymbol.every(t => t.to === s.id);
        });
    }).map(s => s.id));

    // --- Heuristic 1: Starts With ---
    const initialTransitions = transitions.filter(t => t.from === initialState.id);
    const pathsToTrap = initialTransitions.filter(t => trapStates.has(t.to));
    if (pathsToTrap.length > 0 && pathsToTrap.length < initialTransitions.length) {
        const path = findShortestPathToAccept(machine, 1);
        if (path) return `Starts with '${path.charAt(0)}'`;
    }

    // --- Heuristic 2: Contains Substring ---
    const acceptingSinks = states.filter(s => {
        if (!s.accepting) return false;
        const outgoing = transitions.filter(t => t.from === s.id);
        return alphabet.every(symbol => {
            const transForSymbol = outgoing.filter(t => t.symbol === symbol);
            return transForSymbol.length > 0 && transForSymbol.every(t => t.to === s.id);
        });
    });
    if (acceptingSinks.length > 0) {
        const path = findShortestPathToState(machine, acceptingSinks[0].id);
        if (path) return `Contains substring '${path}'`;
    }

    // --- Heuristic 3: Ends With ---
    const acceptingStates = states.filter(s => s.accepting);
    // This pattern is common for 'ends with': an accepting state that isn't a sink.
    if (acceptingStates.length > 0 && !acceptingStates.every(s => acceptingSinks.some(as => as.id === s.id))) {
       const path = findShortestPathToAccept(machine, 1);
       if(path) return `Ends with '${path}'`;
    }

    return null; // No specific pattern found
}

/**
 * The original, correct function to find a few short accepted strings for display.
 * @param {object} machine The automaton to analyze.
 * @returns {string[]} A list of up to 3 shortest accepted strings.
 */
function findShortestAcceptedStrings(machine) {
    const queue = [];
    const visited = new Set();
    const accepted = [];
    const initialStates = machine.states.filter(s => s.initial);
    if (initialStates.length === 0) return [];
    if (initialStates.some(s => s.accepting)) accepted.push("ε");
    for (const startState of initialStates) {
        queue.push({ state: startState.id, path: "" });
        visited.add(startState.id + ",");
    }
    let head = 0;
    while (head < queue.length && accepted.length < 5) {
        const { state, path } = queue[head++];
        if (path.length > 10) continue;
        const transitions = machine.transitions.filter(t => t.from === state);
        for (const t of transitions) {
            const newPath = path + (t.symbol || '');
            const visitedKey = t.to + "," + newPath;
            if (!visited.has(visitedKey)) {
                visited.add(visitedKey);
                const nextState = machine.states.find(s => s.id === t.to);
                if (nextState) {
                    if (nextState.accepting && !accepted.includes(newPath)) {
                        accepted.push(newPath);
                    }
                    queue.push({ state: t.to, path: newPath });
                }
            }
        }
    }
    return accepted.sort((a, b) => a.length - b.length).slice(0, 3);
}

export function saveMachine() {
    const modal = document.getElementById('saveLibraryModal');
    const descInput = document.getElementById('libDescInput');
    const alphabetDisplay = document.getElementById('libAlphabetDisplay');
    const titleInput = document.getElementById('libTitleInput');
    
    if (!modal || !descInput || !alphabetDisplay) return;

    if (!MACHINE.states || MACHINE.states.length === 0) {
        window.customAlert("Save Failed", "Please draw a machine before saving.");
        return;
    }

    const machineType = MACHINE.type || 'DFA';
    
    // --- YOUR SMART TITLE GENERATION ---
    let autoTitle = analyzeMachineStructure(MACHINE);
    if (!autoTitle) {
        const shortestStrings = findShortestAcceptedStrings(MACHINE);
        if (shortestStrings.length > 0) {
            const examples = shortestStrings.map(s => `"${s || 'ε'}"`).join(', ');
            autoTitle = `Accepts short examples: ${examples}`;
        } else if (MACHINE.states.some(s => s.accepting)) {
            autoTitle = `Accepts nothing (Language may be unreachable)`;
        } else {
            autoTitle = `Accepts nothing (Empty language)`;
        }
    }
    
    const finalTitle = `${machineType}: ${autoTitle}`;
    titleInput.value = finalTitle;

    // --- YOUR DESCRIPTIVE LOGIC ---
    const acceptedExamples = findShortestAcceptedStrings(MACHINE);
    const alphabet = [...new Set(MACHINE.transitions.map(t => t.symbol).filter(s => s != null && s !== ''))].sort();
    descInput.value = `Accepts strings such as: ${acceptedExamples.join(', ') || 'none'}.`;
    alphabetDisplay.innerHTML = `<strong>Formal Alphabet (auto-detected):</strong> {${alphabet.join(', ') || '∅'}}`;
    alphabetDisplay.style.display = 'block';

    document.getElementById('libTypeInput').value = machineType;
    modal.style.display = 'flex';

}

/** Copies the saved machine to the class review queue in the background (never blocks the download). */
async function stageSilently(name) {
    try {
        const assignment = await decideSubmissionMode('FA');
        await stageToDb({
            name, type: 'FA', data: MACHINE,
            author: getStudentProfile().name || 'Student',
            submissionMode: assignment.submissionMode,
            assignmentId: assignment.assignmentId,
            assignmentTitle: assignment.assignmentTitle,
            studentProfile: getStudentProfile()
        });
    } catch (_e) { /* offline or functions unavailable: the local file is what matters */ }
}

export function handleSaveWithMetadata(event) {
    if (event && typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    const title = document.getElementById('libTitleInput').value.trim();
    const userDescription = document.getElementById('libDescInput').value.trim();
    const type = document.getElementById('libTypeInput').value;

    if (!title) {
        window.customAlert("Input Required", "Please enter a title for the library entry.");
        return;
    }
    
    const alphabet = [...new Set(MACHINE.transitions.map(t => t.symbol).filter(s => s != null && s !== ''))].sort();
    let finalDescription = userDescription;

    if (type === 'DFA') {
        const alphabetString = `The formal alphabet is {${alphabet.join(', ') || '∅'}}.`;
        finalDescription = userDescription ? `${userDescription} ${alphabetString}` : alphabetString;
    }

    const libraryEntry = {
        title: title,
        description: finalDescription,
        type: type,
        machine: { ...MACHINE, type: type, alphabet: alphabet }
    };

    const blob = new Blob([JSON.stringify(libraryEntry, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    const fileName = `${safeFileName(title)}.json`;
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);

    const modal = document.getElementById('saveLibraryModal');
    if (modal) modal.style.display = 'none';
    addLogMessage(`Saved ${fileName}`, 'check-circle');
    stageSilently(title);
}


export function loadMachine(e, updateUIFunction) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = JSON.parse(ev.target.result);
            const machineData = data.machine || data; // Handles both file formats

            if (machineData.states && machineData.transitions) {
                const rerouted = routeMachineImport(machineData, 'fa');
                if (!rerouted.handled) {
                    loadMachineFromObject(machineData, updateUIFunction, data.type || 'DFA');
                }
            } else {
                setValidationMessage("Invalid machine file format.", 'error');
            }
        } catch (err) {
            setValidationMessage("Invalid JSON file: " + err.message, 'error');
        } finally {
            e.target.value = '';
        }
    };
    reader.readAsText(file);
}

export function loadMachineFromObject(machineData, updateUIFunction, fallbackType = 'DFA') {
    if (!machineData || !machineData.states || !machineData.transitions) return;
    pushUndo(updateUIFunction);
    const machineType = machineData.type || fallbackType || 'DFA';
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) modeSelect.value = machineType;

    const machineToAnimate = {
        ...machineData,
        type: machineType
    };

    animateMachineDrawing(machineToAnimate);
}

export function exportPng(fileName = 'automaton') {
     if (event) event.stopImmediatePropagation();
    const svgEl = document.getElementById("dfaSVG");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const bbox = svgEl.getBBox();
    const padding = 20;
    const width = bbox.width + (padding * 2);
    const height = bbox.height + (padding * 2);

    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const svgClone = svgEl.cloneNode(true);
    
    svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
    svgClone.setAttribute('width', width);
    svgClone.setAttribute('height', height);

    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .state-circle { fill: #fff; stroke: #667eea; stroke-width: 3; }
        .state-label { font-family: Inter, sans-serif; font-weight: 700; fill: #0b1220; text-anchor: middle; dominant-baseline: central; font-size: 14px; }
        .transition-path { fill: none; stroke: #667eea; stroke-width: 2; marker-end: url(#arrowhead); }
        .initial-arrow { stroke: black !important; stroke-width: 3 !important; marker-end: url(#arrowhead); }
        .initial-pulse { animation: pulseInitialState 2.5s infinite ease-in-out; }
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
    svgClone.querySelector('defs').appendChild(styleEl);

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

    img.src = url;
}
