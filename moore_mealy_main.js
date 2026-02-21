import { initializeState, setRenderFunction } from './moore_mealy_state.js';
import { initializeUI } from './moore_mealy_ui.js';
import { renderAll } from './moore_mealy_renderer.js';
import { initializeLibrary } from './moore_mealy_library_loader.js';
import { setMachine } from './moore_mealy_state.js';

window.setMmMachine = setMachine;

export function initializeMMStudio(machineData = null) {
    setRenderFunction(renderAll);
    initializeState();
    if (machineData) {
        setMachine(machineData);
    }
    initializeUI();
    initializeLibrary();
    renderAll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeMMStudio());
} else {
    initializeMMStudio();
}
