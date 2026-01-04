/**
 * tm_file.js
 * Handles saving, exporting, and loading Turing Machine configurations.
 */

import { MACHINE, pushUndo } from './tm_state.js';
import { addLogMessage, customAlert } from './utils.js';
import { animateTmDrawing } from './tm_animation.js';

/**
 * Saves the current Turing Machine to a JSON file.
 */
export function saveTmMachine() {
    if (!MACHINE.states || MACHINE.states.length === 0) {
        customAlert("Empty Canvas", "Add some states before saving.");
        return;
    }

    addLogMessage(`Exporting TM configuration to JSON...`, 'save');

    // Naming logic: Use the title if set, otherwise a timestamped default
    const suggestedTitle = MACHINE.title || "tm-design";
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `${suggestedTitle.toLowerCase().replace(/\s+/g, '-')}_${timestamp}.json`;

    const blob = new Blob([JSON.stringify({ type: 'TM', machine: MACHINE }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(url);
    addLogMessage(`File saved as: ${fileName}`, 'check-circle');
}

/**
 * Exports the SVG canvas as a high-quality PNG replica.
 */
export function exportTmPng() {
    if (!MACHINE.states || MACHINE.states.length === 0) return;

    addLogMessage(`Generating high-resolution PNG snapshot...`, 'image');
    
    const baseName = MACHINE.title || "tm-export";
    const fileName = prompt("Enter filename for PNG:", baseName) || baseName;

    const svgEl = document.getElementById("dfaSVG");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const bbox = svgEl.getBBox();
    const padding = 50; 
    const width = bbox.width + (padding * 2);
    const height = bbox.height + (padding * 2);

    const scale = 3; // High resolution
    canvas.width = width * scale;
    canvas.height = height * scale;

    const svgClone = svgEl.cloneNode(true);
    svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
    svgClone.setAttribute('width', width);
    svgClone.setAttribute('height', height);

    // Inject Emerald-specific styles for the export
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .state-circle { fill: #ffffff; stroke: #10b981; stroke-width: 3; }
        .state-label { font-family: 'Inter', sans-serif; font-weight: 700; fill: #064e3b; text-anchor: middle; font-size: 14px; }
        .transition-path { fill: none; stroke: #10b981; stroke-width: 2.5; }
        .initial-arrow { stroke: #064e3b !important; stroke-width: 3 !important; }
        .halt-ring { fill: none; stroke: #10b981; stroke-width: 2; }
        marker polygon { fill: #10b981; }
        .transition-label { font-family: 'Inter', sans-serif; font-weight: 700; fill: #064e3b; font-size: 13px; }
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

        const a = document.createElement('a');
        a.download = `${fileName}.png`;
        a.href = canvas.toDataURL("image/png", 1.0);
        a.click();
        addLogMessage(`TM image exported successfully.`, 'check-circle');
    };
    img.src = url;
}

/**
 * Loads a TM machine from a JSON file with construction animation.
 */
export async function loadTmMachine(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const machineData = data.machine || data;

            if (machineData.type === 'TM' || machineData.states) {
                pushUndo();
                event.target.value = ''; // Reset input

                addLogMessage(`Importing Turing Machine: <strong>${machineData.title || "External File"}</strong>`, 'folder-open');
                
                // Trigger the animated construction loop from tm_animation.js
                await animateTmDrawing(machineData);
                
                customAlert("Load Complete", "The machine has been constructed on the tape.");
            } else {
                customAlert("Invalid File", "This is not a valid Turing Machine configuration.");
            }
        } catch (err) {
            customAlert("Error", "Failed to parse TM file.");
        }
    };
    reader.readAsText(file);
}