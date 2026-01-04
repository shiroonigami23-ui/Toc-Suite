/**
 * pda_file.js
 * Handles saving, exporting, and loading PDA machine configurations with 
 * animated construction and descriptive naming.
 */

import { MACHINE, setMachine, pushUndo } from './pda_state.js';
import { renderAll, layoutStatesCircular } from './pda_renderer.js';
import { analyzePdaPattern } from './pda_library_analyzer.js';
import { customAlert, addLogMessage } from './utils.js';
import { runPdaSimulation } from './pda_simulation.js';
import { animatePdaDrawing } from './pda_animation.js';

/**
 * Saves the PDA to a JSON file with enhanced naming logic and logging.
 */
export function savePdaMachine() {
    if (!MACHINE.states || MACHINE.states.length === 0) {
        customAlert("Empty Canvas", "Add some states before saving.");
        return;
    }

    // Logging the start of the export process
    addLogMessage(`Exporting machine configuration to JSON...`, 'save');

    // Naming logic using the pattern analyzer to generate a descriptive filename
    const suggestedTitle = analyzePdaPattern ? analyzePdaPattern(MACHINE) : "pda-machine"; 
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${suggestedTitle.toLowerCase().replace(/\s+/g, '-')}_${timestamp}.json`;

    const blob = new Blob([JSON.stringify({ type: 'PDA', machine: MACHINE }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(url);
    addLogMessage(`File saved as: ${fileName}`, 'check-circle');
}

/**
 * Exports the current SVG canvas as a high-quality PNG.
 * Includes logging and high-resolution scaling for clear documentation.
 */
export function exportPng() {
    if (!MACHINE.states || MACHINE.states.length === 0) {
        customAlert("Empty Canvas", "Nothing to export.");
        return;
    }

    addLogMessage(`Generating high-resolution PNG snapshot...`, 'image');

    // Determine filename based on smart analysis
    const suggestedTitle = analyzePdaPattern(MACHINE);
    const shortestStrings = findShortestAcceptedStringsPda(MACHINE);
    let baseName = "pda-automaton";
    
    if (suggestedTitle) {
        baseName = suggestedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    } else if (shortestStrings.length > 0) {
        baseName = `accepts-${shortestStrings[0].replace(/ε/g, 'eps')}`;
    }
    
    const fileName = prompt("Enter filename for PNG:", baseName) || baseName;

    const svgEl = document.getElementById("dfaSVG");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Calculate dimensions based on content with padding
    const bbox = svgEl.getBBox();
    const padding = 40; 
    const width = bbox.width + (padding * 2);
    const height = bbox.height + (padding * 2);

    // Scale 3x for high-resolution output
    const scale = 3; 
    canvas.width = width * scale;
    canvas.height = height * scale;

    const svgClone = svgEl.cloneNode(true);
    svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
    svgClone.setAttribute('width', width);
    svgClone.setAttribute('height', height);

    // Remove UI-specific hints and animations for the static export
    const hint = svgClone.getElementById('canvasHint');
    if (hint) hint.remove();
    svgClone.querySelectorAll('.initial-pulse').forEach(el => el.classList.remove('initial-pulse'));

    // Inject explicit styles to ensure consistent rendering in the PNG
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .state-circle { fill: #ffffff; stroke: #667eea; stroke-width: 3; }
        .state-label { font-family: 'Inter', sans-serif; font-weight: 700; fill: #0b1220; text-anchor: middle; font-size: 14px; }
        .transition-path { fill: none; stroke: #667eea; stroke-width: 2.5; }
        .initial-arrow { stroke: #0b1220 !important; stroke-width: 3 !important; }
        .final-ring { fill: none; stroke: #ff9800; stroke-width: 4; }
        marker polygon { fill: #667eea; }
        .transition-label { font-family: 'Inter', sans-serif; font-weight: 700; fill: #0b1220; font-size: 13px; }
        .transition-label-text { stroke: white; stroke-width: 4px; fill: none; }
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
        a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
        a.href = canvas.toDataURL("image/png", 1.0);
        a.click();
        addLogMessage(`Image exported successfully.`, 'check-circle');
    };

    img.src = url;
}

/**
 * Loads a PDA machine from a JSON file using a step-by-step construction animation.
 */
export async function loadPdaMachine(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const machineData = data.machine || data;

            if (machineData.type === 'PDA' || machineData.states) {
                // Save current work to undo stack
                pushUndo();
                
                // Clear the input to allow re-loading the same file if needed
                event.target.value = '';

                // Apply auto-layout if coordinates are missing
                if (machineData.states.some(s => s.x === undefined)) {
                    layoutStatesCircular(machineData.states);
                }

                addLogMessage(`Importing PDA: <strong>${machineData.id || "External File"}</strong>`, 'folder-open');
                
                // Trigger the animated construction loop
                await animatePdaDrawing(machineData);
                
                customAlert("Load Complete", "The machine has been constructed from the file.");
            } else {
                customAlert("Invalid File", "This file does not appear to be a valid PDA machine.");
            }
        } catch (err) {
            customAlert("Error", "Failed to parse the JSON file: " + err.message);
        }
    };
    reader.readAsText(file);
}

/**
 * Finds short strings accepted by the PDA to assist with intelligent naming.
 */
function findShortestAcceptedStringsPda(machine) {
    const testStrings = ["", "0", "1", "a", "b", "c", "aa", "bb", "ab", "ba", "00", "11", "()", "(())"];
    const accepted = [];

    for (const str of testStrings) {
        const result = runPdaSimulation(str, machine);
        if (result && result.success) {
            accepted.push(str || "ε");
        }
        if (accepted.length >= 3) break;
    }
    return accepted;
}