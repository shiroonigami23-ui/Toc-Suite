import { pushUndo, setMachine } from './state.js';
import { animateMachineDrawing } from './animation.js';

/**
 * Loads a machine from the library, animating its creation on the canvas.
 * This function is exposed on the window object for legacy script compatibility.
 * @param {object} machineObject The library entry to load.
 */
window.loadMachineFromObject = function(machineObject) {
    if (machineObject && (machineObject.states || (machineObject.machine && machineObject.machine.states))) {
        pushUndo();
        
        const machineData = machineObject.machine || machineObject;
        const machineToLoad = { ...machineData, type: machineObject.type || 'DFA' };

        // Call the animation module to draw the machine.
        animateMachineDrawing(machineToLoad);

        const modeSelect = document.getElementById('modeSelect');
        if (modeSelect) {
            modeSelect.value = machineToLoad.type;
        }

        console.log("Loading machine from library:", machineObject.title || machineObject.id);
    } else {
        console.error("Invalid machine object from library:", machineObject);
        alert("Could not load library item: machine data is missing.");
    }
}
