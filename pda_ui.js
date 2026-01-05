/**
 * pda_ui.js
 * Specialized UI Controller for the PDA Studio.
 */

import { MACHINE, pushUndo, undo, redo, resetMachine } from './pda_state.js';
import { renderAll } from './pda_renderer.js';
import { validatePda } from './pda_automata.js';
import { runPdaSimulation } from './pda_simulation.js';
import { animatePdaPath,stepSimulation,setSimulationPath,updateStackUI,currentPath,currentIndex} from './pda_simulation_visualizer.js';
import { generatePractice, checkAnswer, showSolution } from './pda_practice.js'; 
import { savePdaMachine, exportPng, loadPdaMachine } from './pda_file.js';
import { setValidationMessage, customAlert, addLogMessage, initializeShortcuts } from './utils.js';
import { animatePdaDrawing } from './pda_animation.js';
import { updatePdaLogicDisplay, exportPdaTableToExcel } from './pda_logic_table.js';
import { initializePdaLibrary } from './pda_library_loader.js';

let currentMode = 'move';
let dragTarget = null;
let transFromState = null;

export function initializePdaUI() {
    setupToolbar();
    initializeShortcuts();
    setupCanvasInteractions();
    setupPracticeUI(); 
    setupFileUI();     
    setupTestingUI();  
    setupLibraryUI();
    setupZoomUI();     
    setupModeLogic();  
    setupPdaLogicToggle();

    // --- MOBILE DRAWER LOGIC ---
    const toggleBtn = document.getElementById('pdaPanelToggleBtn');
    const controlPanel = document.getElementById('controlPanel');
    const visualizationPanel = document.querySelector('.visualization-panel');

    if (toggleBtn && controlPanel) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            controlPanel.classList.toggle('open'); //
        };
    }

    // Close drawer when clicking the canvas to maximize workspace
    visualizationPanel?.addEventListener('click', () => {
        controlPanel?.classList.remove('open');
    });

    // 2. Global render wrapper for Intelligence synchronization
    const originalRender = renderAll;
    window.renderAll = () => {
        originalRender();
        
        // --- MACHINE INTELLIGENCE DYNAMIC SYNC ---
        // 1. Update State Role Badges (Initial/Final/Traps)
        updatePdaLogicDisplay(); 
        
        // 2. Refresh the Live Stack visual
        if (typeof updateStackUI === 'function') {
            updateStackUI(['Z']); 
        }
        
        // 3. Sync history button states
        updateUndoRedoButtons(); 
    };

    // Initial render and Lucide icon generation
    window.renderAll();
    if (window.lucide) lucide.createIcons();
    addLogMessage("PDA Studio: Intelligence Active.", 'shield-check');
}

function setupModeLogic() {
    const modeSelect = document.getElementById('pdaModeSelect');
    if (!modeSelect) return;

    modeSelect.addEventListener('change', async (e) => {
        const newMode = e.target.value;
        
        if (newMode === 'DPDA') {
            addLogMessage("Starting conversion to Deterministic PDA...", 'loader');
            
            // 1. Logic Check (Synchronous)
            const conversionResult = convertToDeterministic(MACHINE);
            
            // 2. Visual Animation
            // We "redraw" the machine to show the pruned/deterministic version being constructed
            await animatePdaDrawing({
                ...MACHINE,
                type: 'DPDA',
                transitions: MACHINE.transitions // convertToDeterministic already updated these
            });

            if (conversionResult.success) {
                setValidationMessage(conversionResult.message, 'success');
            } else {
                customAlert("Determinism Warning", conversionResult.message);
                setValidationMessage("Integrity Warning: Machine is not fully deterministic.", 'warning');
            }
        } else {
            pushUndo();
            MACHINE.type = 'NPDA';
            setValidationMessage("Switched to Non-Deterministic mode.", 'success');
            addLogMessage("Switched to Non-Deterministic PDA mode.", "zap");
            renderAll();
        }
    });
}

/**
 * Helper to identify and resolve non-deterministic overlaps in PDA transitions.
 * @param {object} machine - The current MACHINE object.
 */
function convertToDeterministic(machine) {
    const { transitions } = machine;
    const seen = new Map();
    const uniqueTransitions = [];
    let conflictFound = false;

    // A PDA is deterministic if for every (state, input, stack_top), there is exactly ONE transition.
    for (const t of transitions) {
        // Key based on current state, input symbol, and pop symbol
        const key = `${t.from}|${t.symbol || 'ε'}|${t.pop || 'ε'}`;
        
        if (seen.has(key)) {
            const existing = seen.get(key);
            // If they go to the same state with the same push, it's just a duplicate we can remove
            if (existing.to === t.to && existing.push === t.push) {
                continue; 
            } else {
                // Actual branching conflict found
                conflictFound = true;
                uniqueTransitions.push(t);
            }
        } else {
            seen.set(key, t);
            uniqueTransitions.push(t);
        }
    }

    machine.transitions = uniqueTransitions;

    if (conflictFound) {
        return { 
            success: false, 
            message: "Inherent non-determinism detected (multiple destinations for same input). Please manually resolve branching paths." 
        };
    }

    return { success: true, message: "Redundant transitions cleared. Machine is deterministic." };
}

/**
 * setupToolbar
 * Orchestrates tool selection, undo/redo, validation, and canvas clearing.
 */
function setupToolbar() {
    // 1. Tool Selection Logic (Cursor, State, Transition, Delete, etc.)
    const tools = document.querySelectorAll('.toolbar-icon[data-mode]');
    
    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            // Remove active class from all tools to reset their appearance
            tools.forEach(t => t.classList.remove('active'));
            
            // Add active class to the clicked tool to trigger the colorful indigo gradient
            tool.classList.add('active');
            
            // Set the functional mode for canvas interactions (move, addclick, transition, etc.)
            currentMode = tool.dataset.mode;
            
            // Reset any pending transition states and clear temporary highlights
            transFromState = null;
            document.querySelectorAll('.state-active').forEach(c => c.classList.remove('state-active'));
            
            addLogMessage(`Tool changed to: ${currentMode.toUpperCase()}`, 'mouse-pointer');
        });
    });

    // 2. Clear Canvas logic with confirmation modal
    document.getElementById('pda-tool-clear')?.addEventListener('click', () => {
        const modal = document.getElementById('pdaConfirmClearModal');
        if (modal) modal.style.display = 'flex';
    });

    document.getElementById('pdaConfirmClearBtn')?.addEventListener('click', () => {
        pushUndo();
        resetMachine(); // Clears all states and transitions in the state object
        const modal = document.getElementById('pdaConfirmClearModal');
        if (modal) modal.style.display = 'none';
        addLogMessage("Canvas cleared successfully", "file-x");
        renderAll(); // Re-renders the now-empty canvas
    });

    // 3. Validation Logic
    document.getElementById('validateBtn')?.addEventListener('click', () => {
        const result = validatePda(MACHINE); // Performs structural and determinism checks
        setValidationMessage(result.message, result.type);
        addLogMessage(`Validation: ${result.message}`, result.type === 'success' ? 'check-circle' : 'alert-triangle');
    });

    // 4. History Management (Undo/Redo)
    document.getElementById('undoBtn')?.addEventListener('click', () => {
        undo();
        addLogMessage("Undo performed", "undo-2");
    });
    
    document.getElementById('redoBtn')?.addEventListener('click', () => {
        redo();
        addLogMessage("Redo performed", "redo-2");
    });

    // 5. Navigation - Back to Splash Screen
document.getElementById('pdaBackToMenuBtn')?.addEventListener('click', () => {
    const mainApp = document.getElementById('mainApp');
    const splashScreen = document.getElementById('splashScreen');
    const studioContent = document.getElementById('studioContent');

    if (splashScreen) {
        // Clear the current studio content so IDs don't clash later
        if (studioContent) {
            studioContent.innerHTML = ''; 
        }

        // Hide the main container and show the splash screen
        if (mainApp) {
            mainApp.style.display = 'none';
        }

        splashScreen.style.display = 'flex';
        // Force a reflow for the opacity transition to work
        void splashScreen.offsetWidth; 
        splashScreen.style.opacity = '1';
        
        addLogMessage("Returned to main menu.", 'home');
    } else {
        console.error("Navigation Error: #splashScreen not found.");
    }
});
}

function setupCanvasInteractions() {
    const svg = document.getElementById('dfaSVG');
    if (!svg) return;

    // Helper to get relative coordinates for both Mouse and Touch
    function getEventPoint(e) {
        const pt = svg.createSVGPoint();
        const touch = e.touches ? e.touches[0] : e;
        pt.x = touch.clientX;
        pt.y = touch.clientY;
        const ctm = svg.getScreenCTM();
        return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
    }

    const startAction = (e) => {
        const pt = getEventPoint(e);
        const target = e.target.closest('.state-group');

        if (currentMode === 'addclick' && !target) {
            addNewState(pt.x, pt.y);
        } else if (target) {
            const stateId = target.dataset.id;
            const stateObj = MACHINE.states.find(s => s.id === stateId);

            if (currentMode === 'move') {
                // Prevent scrolling while dragging on mobile
                if (e.cancelable) e.preventDefault(); 
                
                dragTarget = stateObj;
                // Calculate offset to prevent state "snapping" to cursor center
                dragTarget._offsetX = stateObj.x - pt.x;
                dragTarget._offsetY = stateObj.y - pt.y;
                
                target.querySelector('circle')?.classList.add('state-active');
            } else if (currentMode === 'transition') {
                handleTransitionMode(target, stateId);
            } else if (currentMode === 'delete') {
                deleteState(stateId);
            } else if (currentMode === 'rename') {
                openRenameModal(stateObj);
            } else if (currentMode === 'stateprops') {
                openStatePropsModal(stateObj);
            }
        }
    };

    const moveAction = (e) => {
        if (dragTarget) {
            // Prevent background scrolling while moving states
            if (e.cancelable) e.preventDefault(); 
            
            const pt = getEventPoint(e);
            dragTarget.x = pt.x + (dragTarget._offsetX || 0);
            dragTarget.y = pt.y + (dragTarget._offsetY || 0);
            renderAll();
        }
    };

    const endAction = () => {
        if (dragTarget) {
            pushUndo();
            // Remove visual feedback from the state that was being moved
            document.querySelectorAll('.state-active').forEach(c => c.classList.remove('state-active'));
        }
        dragTarget = null;
    };

    // Unified Listeners for Desktop and Mobile
    svg.addEventListener('mousedown', startAction);
    svg.addEventListener('touchstart', startAction, { passive: false });

    window.addEventListener('mousemove', moveAction);
    window.addEventListener('touchmove', moveAction, { passive: false });

    window.addEventListener('mouseup', endAction);
    window.addEventListener('touchend', endAction);
}
function handleTransitionMode(target, stateId) {
    if (!transFromState) {
        transFromState = stateId;
        target.querySelector('circle').classList.add('state-active');
    } else {
        openPdaModal(transFromState, stateId);
        transFromState = null;
        document.querySelectorAll('.state-active').forEach(c => c.classList.remove('state-active'));
    }
}

function openRenameModal(state) {
    const modal = document.getElementById('pdaRenameModal');
    const input = document.getElementById('pdaRenameInput');
    input.value = state.id;
    modal.style.display = 'flex';

    document.getElementById('pdaRenameSave').onclick = () => {
        const newName = input.value.trim();
        if (newName && !MACHINE.states.some(s => s.id === newName)) {
            pushUndo();
            const oldId = state.id;
            state.id = newName;
            // Update transitions
            MACHINE.transitions.forEach(t => {
                if (t.from === oldId) t.from = newName;
                if (t.to === oldId) t.to = newName;
            });
            modal.style.display = 'none';
            renderAll();
        } else {
            customAlert("Error", "Name must be unique and non-empty.");
        }
    };
}

function openStatePropsModal(state) {
    const modal = document.getElementById('pdaStatePropsModal');
    document.getElementById('pdaPropInitial').checked = state.initial;
    document.getElementById('pdaPropFinal').checked = state.accepting;
    modal.style.display = 'flex';

    document.getElementById('pdaPropSave').onclick = () => {
        pushUndo();
        const isInitial = document.getElementById('pdaPropInitial').checked;
        if (isInitial) {
            MACHINE.states.forEach(s => s.initial = false);
        }
        state.initial = isInitial;
        state.accepting = document.getElementById('pdaPropFinal').checked;
        modal.style.display = 'none';
        renderAll();
    };
}

/**
 * openPdaModal
 * Safely handles transition creation and epsilon shortcuts.
 */
function openPdaModal(from, to) {
    const modal = document.getElementById('pdaTransitionModal');
    const symbolIn = document.getElementById('pdaTransSymbol');
    const popIn = document.getElementById('pdaTransPop');
    const pushIn = document.getElementById('pdaTransPush');
    const epsBtn = document.getElementById('pdaEpsilonShortcutBtn');

    if (!modal || !symbolIn || !popIn || !pushIn) return;

    document.getElementById('pdaTransFrom').value = from;
    document.getElementById('pdaTransTo').value = to;
    
    // Clear previous inputs
    symbolIn.value = ''; popIn.value = ''; pushIn.value = '';

    // Epsilon Shortcut logic using Optional Chaining to prevent null errors
    if (epsBtn) {
        epsBtn.onclick = () => {
            symbolIn.value = 'ε';
            popIn.value = 'ε';
            pushIn.value = 'ε';
        };
    }

    modal.style.display = 'flex';
    symbolIn.focus();

    const saveBtn = document.getElementById('pdaTransSave');
    if (saveBtn) {
        saveBtn.onclick = () => {
            const symbol = symbolIn.value || 'ε';
            const pop = popIn.value || 'ε';
            const push = pushIn.value || 'ε';
            
            pushUndo();
            MACHINE.transitions.push({ from, to, symbol, pop, push });
            modal.style.display = 'none';
            renderAll();
        };
    }
}

function deleteState(id) {
    pushUndo();
    MACHINE.states = MACHINE.states.filter(s => s.id !== id);
    MACHINE.transitions = MACHINE.transitions.filter(t => t.from !== id && t.to !== id);
    renderAll();
}

function addNewState(x, y) {
    pushUndo();
    const id = `q${MACHINE.states.length}`;
    MACHINE.states.push({ id, x, y, initial: MACHINE.states.length === 0, accepting: false });
    renderAll();
}

/**
 * setupTestingUI
 * Manages the interactive testing panel, including Auto-Run, Manual Stepping,
 * Random String Generation, and Bulk Validation.
 */
function setupTestingUI() {
    const runBtn = document.getElementById('pdaRunTestBtn');
    const stepBtn = document.getElementById('pdaStepBtn');
    const resetSimBtn = document.getElementById('pdaResetSimBtn');
    const randomBtn = document.getElementById('pdaRandomTestBtn');
    const bulkRunBtn = document.getElementById('pdaBulkRunBtn');

    const inputField = document.getElementById('pdaTestInput');
    const bulkInputField = document.getElementById('pdaBulkInput');
    const bulkResults = document.getElementById('pdaBulkResults');
    const outputDisplay = document.getElementById('pdaTestOutput');
    const progress = document.getElementById('pdaSimProgress');

    // 1. Auto-Run Logic: Animates the full path for a single string
    runBtn?.addEventListener('click', async () => {
        const input = inputField.value.trim();
        
        if (outputDisplay) outputDisplay.textContent = "RUNNING...";
        if (progress) progress.style.width = "0%";
        
        const result = runPdaSimulation(input, MACHINE);
        
        if (result.success) {
            if (outputDisplay) {
                outputDisplay.textContent = "ACCEPTED";
                outputDisplay.style.color = "var(--success)";
            }
            if (progress) progress.style.width = "100%";
            await animatePdaPath(result.path);
        } else {
            if (outputDisplay) {
                outputDisplay.textContent = "REJECTED";
                outputDisplay.style.color = "var(--danger)";
            }
            addLogMessage(`String "${input || 'ε'}" rejected by machine.`, "x-circle");
        }
    });

    // 2. Manual Step Logic: Executes one state transition at a time
    stepBtn?.addEventListener('click', () => {
        // Initialize simulation path if it hasn't started yet
        if (currentIndex === -1 && currentPath.length === 0) {
            const input = inputField.value.trim();
            const result = runPdaSimulation(input, MACHINE);
            
            if (result.success) {
                setSimulationPath(result.path);
                if (outputDisplay) outputDisplay.textContent = "STEPPING...";
            } else {
                addLogMessage("Cannot step: String rejected by machine.", "alert-triangle");
                if (outputDisplay) outputDisplay.textContent = "REJECTED";
                return;
            }
        }

        const stepTaken = stepSimulation();
        
        // Update progress bar based on current index
        if (stepTaken && progress && currentPath.length > 0) {
            const percent = ((currentIndex + 1) / currentPath.length) * 100;
            progress.style.width = `${percent}%`;
        }
    });

    // 3. Reset Simulation Logic: Clears current path and highlights
    resetSimBtn?.addEventListener('click', () => {
        setSimulationPath([]);
        updateStackUI(['Z']); // Reset visual stack to the initial symbol
        
        if (inputField) inputField.value = '';
        if (outputDisplay) {
            outputDisplay.textContent = "IDLE";
            outputDisplay.style.color = "inherit";
        }
        if (progress) progress.style.width = "0%";
        
        document.getElementById('stepLog').innerHTML = 'Simulation logs will appear here...';
        document.querySelectorAll('.state-active').forEach(c => c.classList.remove('state-active'));
        
        addLogMessage("Simulation state and UI reset.", "refresh-ccw");
    });

    // 4. Random String Generation: Creates a string using the current alphabet
    randomBtn?.addEventListener('click', () => {
        const alphabet = (MACHINE.alphabet && MACHINE.alphabet.length > 0) 
                         ? MACHINE.alphabet 
                         : ['a', 'b'];
        const length = Math.floor(Math.random() * 8) + 1; 
        let str = "";
        for(let i=0; i < length; i++) {
            str += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        inputField.value = str;
        addLogMessage(`Generated random test string: "${str}"`, 'dice-5');
    });

    // 5. Bulk Testing Logic: Validates a list of strings from the textarea
    bulkRunBtn?.addEventListener('click', () => {
        const strings = bulkInputField.value.split('\n')
                          .map(s => s.trim())
                          .filter(s => s !== "");
        
        if (strings.length === 0) {
            addLogMessage("No strings provided for bulk testing.", "alert-circle");
            return;
        }

        bulkResults.innerHTML = '';
        addLogMessage(`Running bulk test on ${strings.length} strings...`, 'loader');

        strings.forEach(str => {
            const result = runPdaSimulation(str, MACHINE);
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.padding = '4px 6px';
            div.style.borderBottom = '1px solid #f1f5f9';
            
            const color = result.success ? 'var(--success)' : 'var(--danger)';
            div.innerHTML = `
                <span style="font-family:monospace;">"${str || 'ε'}"</span>
                <span style="color:${color}; font-weight:bold;">${result.success ? 'PASS' : 'FAIL'}</span>
            `;
            bulkResults.appendChild(div);
        });
        
        addLogMessage("Bulk test complete.", 'check-circle');
    });
}

function setupPracticeUI() {
    document.getElementById('pdaGenPracticeBtn')?.addEventListener('click', () => {
        const level = document.getElementById('pdaPracticeLevel').value;
        generatePractice(level);
    });

    document.getElementById('pdaCheckBtn')?.addEventListener('click', checkAnswer);

    // NEW: Add listener for Show Solution
    document.getElementById('pdaShowSolBtn')?.addEventListener('click', () => {
        showSolution();
    });
}

function setupFileUI() {
    // Save JSON
    document.getElementById('savePdaBtn')?.addEventListener('click', savePdaMachine);

    // Load JSON - Trigger the hidden input
    const loadBtn = document.getElementById('loadPdaBtn');
    const loadInput = document.getElementById('pdaLoadInput');
    
    loadBtn?.addEventListener('click', () => loadInput?.click());
    loadInput?.addEventListener('change', loadPdaMachine);

    // Export PNG
    document.getElementById('pdaExportPngBtn')?.addEventListener('click', () => {
        document.getElementById('pdaExportPngModal').style.display = 'flex';
    });
    
    document.getElementById('pdaPngExportConfirm')?.addEventListener('click', () => {
        const fileName = document.getElementById('pdaPngNameInput').value.trim() || 'pda-export';
        exportPng(fileName);
        document.getElementById('pdaExportPngModal').style.display = 'none';
    });
}

function setupLibraryUI() {
    // Connects search, refresh, and auto-fetching logic
    initializePdaLibrary();
}

function getSVGPoint(event, svg) {
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}


/**
 * setupZoomUI - Enhanced with Pan-X support
 */
function setupZoomUI() {
    const svg = document.getElementById('dfaSVG');
    const zoomSlider = document.getElementById('pdaZoomSlider');
    const resetBtn = document.getElementById('pdaZoomResetBtn');
    
    const applyTransform = (scale) => {
        svg.style.transform = `scale(${scale / 100})`;
        svg.style.transformOrigin = 'center center';
    };

    zoomSlider?.addEventListener('input', (e) => applyTransform(e.target.value));

    resetBtn?.addEventListener('click', () => {
        if (zoomSlider) zoomSlider.value = 100;
        applyTransform(100);
    });
}
/**
 * setupPdaLogicToggle
 * Handles opening/closing the Logic Modal and triggers the Excel export.
 */
function setupPdaLogicToggle() {
    const btn = document.getElementById('togglePdaLogicBtn');
    const modal = document.getElementById('pdaLogicModal');
    const closeBtn = document.getElementById('closePdaLogicModal');
    const exportBtn = document.getElementById('pdaExportTableBtn'); //

    btn?.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'flex';
            updatePdaLogicDisplay(); // Refresh logic table
            if (window.lucide) lucide.createIcons();
        }
    });

    closeBtn?.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });

    // --- ARCHITECT'S UPGRADE: Excel Export Listener ---
    exportBtn?.addEventListener('click', () => {
        exportPdaTableToExcel(); //
    });
}

/**
 * updateUndoRedoButtons
 * Synchronizes the visual state of history buttons with the state stacks.
 */
function updateUndoRedoButtons() {
    // These IDs must match your pda_studio.html
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    // Importing stacks from state to check length
    import('./pda_state.js').then(m => {
        if (undoBtn) undoBtn.disabled = m.undoStack.length === 0;
        if (redoBtn) redoBtn.disabled = m.redoStack.length === 0;
    });
}