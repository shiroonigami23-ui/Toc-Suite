/**
 * tm_file.js
 * Upgraded with Architect Intelligence and Custom Modals.
 */

import { MACHINE, pushUndo } from './tm_state.js';
import { addLogMessage, customAlert } from './utils.js';
import { animateTmDrawing } from './tm_animation.js';

/**
 * Intelligent Naming for TM
 */
function getIntelligentTmName() {
    // Guess name based on number of states and transitions
    const suggested = MACHINE.title || `states-${MACHINE.states.length}-logic`;
    return `tm_${suggested.toLowerCase().replace(/\s+/g, '-')}`;
}

export function saveTmMachine() {
    if (!MACHINE.states || MACHINE.states.length === 0) return;

    const modal = document.getElementById('tmSaveModal');
    const input = document.getElementById('tmSaveNameInput');
    const prefix = "tm_"; 
    const defaultName = getIntelligentTmName(); // Assumed helper exists

    if (modal && input) {
        input.value = defaultName;
        modal.style.display = 'flex';

        document.getElementById('tmSaveConfirmBtn').onclick = () => {
            const fileName = prefix + (input.value.trim() || defaultName);
            modal.style.display = 'none';

            // 1. LOCAL DOWNLOAD
            const blob = new Blob([JSON.stringify({ type: 'TM', machine: MACHINE }, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
            link.click();

            // 2. SILENT STAGING (Behind the Scenes)
            fetch('/.netlify/functions/save-to-db', {
                method: 'POST',
                body: JSON.stringify({
                    name: input.value.trim() || defaultName,
                    type: 'TM',
                    data: MACHINE,
                    author: 'Shiro'
                })
            }).catch(() => console.log("Staging silent failure."));

            addLogMessage(`TM Saved Locally: ${fileName}`, 'check-circle');
        };
    }
}
/**
 * exportTmPng (TM Version)
 * Upgraded with Emerald theme and hardcoded prefix naming.
 */
export function exportTmPng() {
    if (!MACHINE.states || MACHINE.states.length === 0) {
        customAlert("Empty Canvas", "Nothing to export.");
        return;
    }

    const modal = document.getElementById('tmExportPngModal');
    const input = document.getElementById('tmPngNameInput');
    const suggestedName = getIntelligentTmName(); // Hardcoded tm_ prefix

    input.value = suggestedName;
    modal.style.display = 'flex';

    document.getElementById('tmPngExportConfirm').onclick = () => {
        const fileName = input.value.trim() || suggestedName;
        modal.style.display = 'none';
        addLogMessage(`Generating TM snapshot: ${fileName}.png`, 'image');

        const svgEl = document.getElementById("dfaSVG");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const bbox = svgEl.getBBox();
        const padding = 50;
        const width = bbox.width + (padding * 2);
        const height = bbox.height + (padding * 2);
        const scale = 3;

        canvas.width = width * scale;
        canvas.height = height * scale;

        const svgClone = svgEl.cloneNode(true);
        svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
        svgClone.setAttribute('width', width);
        svgClone.setAttribute('height', height);

        // Emerald Style Injection
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
            a.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
            a.href = canvas.toDataURL("image/png", 1.0);
            a.click();
            addLogMessage(`TM image exported successfully.`, 'check-circle');
        };
        img.src = url;
    };
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