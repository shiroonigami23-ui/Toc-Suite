/**
 * tm_ui.js
 * Full UI Controller for the Turing Machine Studio.
 * Handles canvas interactions, modals, and tool synchronization.
 */

import { MACHINE,pushUndo,resetMachine,undo,redo,updateUndoRedoButtons,tapes,headIndices} from './tm_state.js';
import { renderAll } from './tm_renderer.js';
import { activeSim,initInteractiveSim,stepTmSimulation,stepMultiTape,runTmSimulation} from './tm_simulation.js';
import { updateTapeUI } from './tm_visualizer.js';
import { addLogMessage, initializeShortcuts } from './utils.js';
import { saveTmMachine, exportTmPng, loadTmMachine } from './tm_file.js';
import { generateTmPractice, showTmSolution, checkTmAnswer } from './tm_practice.js';
import { convertToStandard, handleModeChange } from './tm_modes.js';
import { validateTm } from './tm_validator.js';
import { updateLogicDisplay } from './logic_table.js';
import { initializeTmLibrary } from './tm_library_loader.js'; //

let currentMode = 'move';
let transFromState = null;

export function initializeTmUI() {
    setupToolbar();
    setupCanvasInteractions();
    setupTestingUI();
    setupFileUI();
    setupPracticeUI();
    setupModalButtons();
    setupModeSelector(); 
    setupZoomControls(); 
    initializeShortcuts();
    initializeTmLibrary();
    setupLogicToggle();

    // --- MOBILE DRAWER LOGIC ---
    const toggleBtn = document.getElementById('tmPanelToggleBtn');
    const controlPanel = document.getElementById('controlPanel');
    const visualizationPanel = document.querySelector('.visualization-panel');

    if (toggleBtn && controlPanel) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            controlPanel.classList.toggle('open'); //
        };
    }

    // Close drawer when clicking the canvas for a cleaner focus
    visualizationPanel?.addEventListener('click', () => {
        controlPanel?.classList.remove('open');
    });

    // Global render wrapper - this makes the sidebar dynamic
    const originalRender = renderAll;
    window.renderAll = () => {
        originalRender();
        
        // 1. Update the Dynamic Legend (State Roles badges)
        updateLogicDisplay(); 
        
        // 2. Sync the Infinite Tape visualizer
        updateTapeUI(tapes, headIndices);
        
        // 3. Update History buttons
        updateUndoRedoButtons();
    };

    window.renderAll();
    if (window.lucide) lucide.createIcons();
}

// Ensure validation button is linked globally
document.getElementById('tmValidateBtn')?.addEventListener('click', validateTm);

/**
 * setupToolbar
 * Orchestrates TM-specific tools, custom clear canvas modal, 
 * and navigation logic.
 */
function setupToolbar() {
    // 1. Tool switching with visual 'active' state
    document.querySelectorAll('.toolbar-icon[data-mode]').forEach(tool => {
        tool.addEventListener('click', () => {
            document.querySelectorAll('.toolbar-icon').forEach(t => t.classList.remove('active'));
            tool.classList.add('active');
            currentMode = tool.dataset.mode;
            addLogMessage(`Tool: ${currentMode.toUpperCase()}`, 'mouse-pointer');
        });
    });

    // 2. --- ARCHITECT'S UPGRADE: CUSTOM CLEAR CANVAS MODAL ---
    // FIX: Changed ID to 'tm-tool-clear' to match your HTML
    document.getElementById('tm-tool-clear')?.addEventListener('click', () => {
        const modal = document.getElementById('tmConfirmClearModal');
        if (modal) {
            modal.style.display = 'flex';
            if (window.lucide) lucide.createIcons();
        }
    });

    document.getElementById('tmConfirmClearCancel')?.addEventListener('click', () => {
        document.getElementById('tmConfirmClearModal').style.display = 'none';
    });

    document.getElementById('tmConfirmClearBtn')?.addEventListener('click', () => {
        // These are already imported at the top of tm_ui.js
        pushUndo();
        resetMachine();
        
        document.getElementById('tmConfirmClearModal').style.display = 'none';
        addLogMessage("Canvas cleared via Architect Tool.", "file-x");
        
        // Re-render the canvas to reflect the cleared state
        renderAll(); 
    });

    // 3. Undo/Redo Integration
    document.getElementById('tmUndoBtn')?.addEventListener('click', () => {
        undo();
        addLogMessage("Undo performed.", 'corner-up-left');
    });

    document.getElementById('tmRedoBtn')?.addEventListener('click', () => {
        redo();
        addLogMessage("Redo performed.", 'corner-up-right');
    });

    // 4. Navigation: Return to Main Menu
    document.getElementById('tmBackToMenuBtn')?.addEventListener('click', () => {
        const mainApp = document.getElementById('mainApp');
        const splashScreen = document.getElementById('splashScreen');
        const studioContent = document.getElementById('studioContent');

        if (splashScreen) {
            if (studioContent) studioContent.innerHTML = ''; 
            if (mainApp) mainApp.style.display = 'none';
            
            splashScreen.style.display = 'flex';
            void splashScreen.offsetWidth; 
            splashScreen.style.opacity = '1';
            
            addLogMessage("Exiting Turing Studio...", 'home');
        }
    });
}

/**
 * setupModalButtons
 * Manages the dismissal and state resets for all Studio modals.
 */
function setupModalButtons() {
    // 1. Transition Modal Cancel
    document.getElementById('tmTransCancel')?.addEventListener('click', () => {
        document.getElementById('tmTransitionModal').style.display = 'none';
        transFromState = null; // Reset the transition source state
    });

    // 2. State Properties Modal Cancel
    document.getElementById('tmPropCancel')?.addEventListener('click', () => {
        document.getElementById('tmStatePropsModal').style.display = 'none';
    });

    // 3. Logic Table Modal Cancel (New)
    document.getElementById('closeLogicModal')?.addEventListener('click', () => {
        const logicModal = document.getElementById('logicTableModal');
        if (logicModal) logicModal.style.display = 'none';
    });
}

function setupTestingUI() {
    const testInput = document.getElementById('tmTestInput');
    const bulkInput = document.getElementById('tmBulkInput');
    const bulkResults = document.getElementById('tmBulkResults');

    // 1. Full Run (Play Button)
    document.getElementById('tmRunTestBtn')?.addEventListener('click', () => {
        const result = runTmSimulation(testInput.value.trim(), MACHINE);
        addLogMessage(result.message, result.success ? 'check-circle' : 'x-circle');
    });

    // 2. Manual Step
    document.getElementById('tmStepBtn')?.addEventListener('click', () => {
        if (!activeSim.isRunning || activeSim.steps === 0) {
            initInteractiveSim(testInput.value.trim(), MACHINE);
        }
        
        // Route to correct simulation logic based on mode
        if (MACHINE.type === 'MULTI_TAPE') {
            stepMultiTape(MACHINE);
        } else {
            stepTmSimulation(MACHINE);
        }
    });

    // 3. Reset Simulation
    document.getElementById('tmResetSimBtn')?.addEventListener('click', () => {
        initInteractiveSim(testInput.value.trim(), MACHINE);
        addLogMessage("Simulation reset to initial tape.", 'refresh-ccw');
    });

    // 4. Bulk Testing
    document.getElementById('tmBulkRunBtn')?.addEventListener('click', () => {
        const lines = bulkInput.value.split('\n').filter(l => l.trim() !== '');
        bulkResults.innerHTML = '';
        
        lines.forEach(line => {
            const res = runTmSimulation(line.trim(), MACHINE);
            const statusColor = res.success ? '#10b981' : '#ef4444';
            bulkResults.innerHTML += `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:2px 0;">
                    <span>${line}</span>
                    <span style="color:${statusColor}; font-weight:bold;">${res.success ? 'ACCEPT' : 'REJECT'}</span>
                </div>`;
        });
        addLogMessage(`Bulk test complete: ${lines.length} strings processed.`, 'test-tubes');
    });
}

/**
 * setupCanvasInteractions
 * Implements high-fidelity dragging, state creation, and logical connections.
 */
function setupCanvasInteractions() {
    const svg = document.getElementById('dfaSVG');
    if (!svg) return;

    let isDragging = false;
    let dragTarget = null;
    let dragOffset = { x: 0, y: 0 };

    // Unified helper for coordinates (Mouse & Touch)
    const getCoords = (e) => {
        const pt = svg.createSVGPoint();
        const touch = e.touches ? e.touches[0] : e;
        pt.x = touch.clientX; pt.y = touch.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    };

    const startAction = (e) => {
        const coords = getCoords(e);
        const stateTarget = e.target.closest('.state-group');
        const edgeTarget = e.target.closest('.edge-group');

        // 1. MOVE TOOL
        if (currentMode === 'move' && stateTarget) {
            // Prevent scrolling on mobile during drag
            if (e.cancelable) e.preventDefault(); 
            
            isDragging = true;
            dragTarget = stateTarget;
            const state = MACHINE.states.find(s => s.id === dragTarget.dataset.id);
            if (state) {
                dragOffset.x = state.x - coords.x;
                dragOffset.y = state.y - coords.y;
            }
            dragTarget.classList.add('dragging');
            addLogMessage(`Moving state: ${dragTarget.dataset.id}`, 'move');
            return; // Prevent triggering other logic
        }

        // 2. ADD STATE
        if (currentMode === 'addclick' && !stateTarget) {
            pushUndo();
            const id = `q${MACHINE.states.length}`;
            MACHINE.states.push({ 
                id, x: coords.x, y: coords.y, 
                initial: MACHINE.states.length === 0, 
                accepting: false 
            });
            renderAll();
        } 
        
        // 3. DELETE ELEMENT
        else if (currentMode === 'delete') {
            if (stateTarget) {
                deleteState(stateTarget.dataset.id);
            } else if (edgeTarget) {
                deleteTransition(edgeTarget.dataset.from, edgeTarget.dataset.to, edgeTarget.dataset.index);
            }
        }
        
        // 4. TRANSITION TOOL
        else if (stateTarget && currentMode === 'transition') {
            const stateId = stateTarget.dataset.id;
            if (!transFromState) {
                transFromState = stateId;
                addLogMessage(`Transition from ${stateId}...`, 'git-branch');
            } else {
                openTmModal(transFromState, stateId);
                transFromState = null;
            }
        }
        
        // 5. PROPERTIES TOOL
        else if (stateTarget && currentMode === 'stateprops') {
            openStatePropsModal(stateTarget.dataset.id);
        }
    };

    const moveAction = (e) => {
        if (isDragging && dragTarget) {
            // Smooth movement for both mouse and finger
            if (e.cancelable) e.preventDefault(); 
            const coords = getCoords(e);
            const state = MACHINE.states.find(s => s.id === dragTarget.dataset.id);
            if (state) {
                state.x = coords.x + dragOffset.x;
                state.y = coords.y + dragOffset.y;
                renderAll(); 
            }
        }
    };

    const endAction = () => {
        if (isDragging) {
            pushUndo();
            isDragging = false;
            if (dragTarget) dragTarget.classList.remove('dragging');
            dragTarget = null;
        }
    };

    // Unified Listeners
    svg.addEventListener('mousedown', startAction);
    svg.addEventListener('touchstart', startAction, { passive: false });

    window.addEventListener('mousemove', moveAction);
    window.addEventListener('touchmove', moveAction, { passive: false });

    window.addEventListener('mouseup', endAction);
    window.addEventListener('touchend', endAction);
}

/**
 * Deletes a state and all transitions connected to it.
 */
function deleteState(stateId) {
    pushUndo();
    // Remove the state
    MACHINE.states = MACHINE.states.filter(s => s.id !== stateId);
    // Remove any transitions coming from or going to this state
    MACHINE.transitions = MACHINE.transitions.filter(t => t.from !== stateId && t.to !== stateId);
    
    addLogMessage(`State ${stateId} and its transitions deleted.`, 'trash-2');
    renderAll();
}

/**
 * Deletes a specific transition.
 */
function deleteTransition(from, to, index) {
    pushUndo();
    // Filter transitions by matching from/to and index if multiple exist between same states
    MACHINE.transitions = MACHINE.transitions.filter((t, i) => 
        !(t.from === from && t.to === to && i === parseInt(index))
    );
    
    addLogMessage(`Transition ${from} → ${to} deleted.`, 'trash-2');
    renderAll();
}

function setupFileUI() {
    document.getElementById('saveTmBtn')?.addEventListener('click', saveTmMachine);
    const loadBtn = document.getElementById('loadTmBtn');
    const loadInput = document.getElementById('tmLoadInput');
    loadBtn?.addEventListener('click', () => loadInput?.click());
    loadInput?.addEventListener('change', loadTmMachine);
    document.getElementById('tmExportPngBtn')?.addEventListener('click', exportTmPng);
}
/**
 * setupPracticeUI
 * Upgraded to use Automatic Logical Validation.
 */
function setupPracticeUI() {
    document.getElementById('tmGenPracticeBtn')?.addEventListener('click', () => {
        const level = document.getElementById('tmPracticeLevel').value;
        generateTmPractice(level);
        // Show the emerald glow for the new question
        const practiceBox = document.getElementById('practiceBox');
        if (practiceBox) {
            practiceBox.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.4)";
            practiceBox.style.border = "2px solid #10b981";
        }
    });

    document.getElementById('tmShowSolBtn')?.addEventListener('click', showTmSolution);

    // 🔥 UPGRADED: Automatic Logic Checking
    document.getElementById('tmCheckBtn')?.addEventListener('click', async () => {
        const { checkTmAnswer } = await import('./tm_practice.js'); //
        const result = await checkTmAnswer(MACHINE); //

        if (result.success) {
            const { addLogMessage, customAlert } = await import('./utils.js');
            addLogMessage("Practice Success: Machine Logic Validated!", 'check-circle');
            customAlert("Logic Verified", "Excellent! Your Turing Machine correctly handled all test cases.");
        } else {
            // If it fails, show specifically which string failed
            const { customAlert } = await import('./utils.js');
            customAlert("Logic Error", `Machine failed on input: "${result.failedString}". Expected: ${result.expected ? 'ACCEPT' : 'REJECT'}`);
        }
    });
}

function openTmModal(from, to) {
    const modal = document.getElementById('tmTransitionModal');
    modal.style.display = 'flex';
    document.getElementById('tmTransFromLabel').textContent = from;
    document.getElementById('tmTransToLabel').textContent = to;

    // --- CALL THE DYNAMIC INPUT GENERATOR HERE ---
    updateTransitionModalInputs();

    document.getElementById('tmTransSave').onclick = () => {
        pushUndo();
        
        if (MACHINE.type === 'MULTI_TAPE') {
            // Logic to collect values from all dynamic rows
            const reads = Array.from(document.querySelectorAll('.tm-read')).map(i => i.value || MACHINE.blankSymbol);
            const writes = Array.from(document.querySelectorAll('.tm-write')).map(i => i.value || MACHINE.blankSymbol);
            const moves = Array.from(document.querySelectorAll('.tm-move')).map(i => i.value);
            
            MACHINE.transitions.push({ from, to, reads, writes, moves });
        } else {
            // Standard Single-Tape logic
            MACHINE.transitions.push({
                from, to,
                read: document.getElementById('tmTransRead').value || MACHINE.blankSymbol,
                write: document.getElementById('tmTransWrite').value || MACHINE.blankSymbol,
                move: document.getElementById('tmTransMove').value
            });
        }
        
        modal.style.display = 'none';
        renderAll();
    };
}

function openStatePropsModal(stateId) {
    const state = MACHINE.states.find(s => s.id === stateId);
    if (!state) return;

    const modal = document.getElementById('tmStatePropsModal');
    modal.style.display = 'flex';
    document.getElementById('tmPropStateName').textContent = stateId;
    document.getElementById('tmPropInitial').checked = !!state.initial;
    document.getElementById('tmPropHalt').checked = !!state.accepting;

    document.getElementById('tmPropSave').onclick = () => {
        pushUndo();
        const isInitial = document.getElementById('tmPropInitial').checked;
        if (isInitial) {
            MACHINE.states.forEach(s => s.initial = false);
        }
        state.initial = isInitial;
        state.accepting = document.getElementById('tmPropHalt').checked;
        modal.style.display = 'none';
        renderAll();
    };
}

/**
 * setupZoomControls
 * Manages the SVG viewport scaling.
 */
function setupZoomControls() {
    const svg = document.getElementById('dfaSVG');
    const slider = document.getElementById('tmZoomSlider');
    const zoomIn = document.getElementById('tmZoomInBtn');
    const zoomOut = document.getElementById('tmZoomOutBtn');
    const zoomReset = document.getElementById('tmZoomResetBtn');

    let currentZoom = 100;

    const applyZoom = (val) => {
        currentZoom = val;
        if (slider) slider.value = val;
        // Apply scaling to the inner groups to keep coordinates consistent
        const edges = document.getElementById('edges');
        const states = document.getElementById('states');
        const scale = val / 100;
        // We zoom the viewbox or apply a transform to the groups
        svg.setAttribute('viewBox', `0 0 ${1400 / scale} ${900 / scale}`);
    };

    zoomIn?.addEventListener('click', () => applyZoom(Math.min(currentZoom + 10, 200)));
    zoomOut?.addEventListener('click', () => applyZoom(Math.max(currentZoom - 10, 50)));
    zoomReset?.addEventListener('click', () => applyZoom(100));
    slider?.addEventListener('input', (e) => applyZoom(parseInt(e.target.value)));
}

// Add to tm_ui.js initialization logic
function setupModeSelector() {
    const modeSelect = document.getElementById('tmModeSelect');
    
    modeSelect?.addEventListener('change', async (e) => {
        const newMode = e.target.value;
        const oldMode = MACHINE.type;
        
        if (newMode !== oldMode) {
            // Trigger the visual reconstruction and logic flattening
            await handleModeChange(newMode, oldMode);
            
            // Sync UI elements: Parallel rows now have access to state data
            if (newMode === 'MULTI_TAPE') {
                import('./tm_visualizer.js').then(m => m.updateTapeUI(tapes, headIndices));
            }
        }
    });
}

function updateTransitionModalInputs() {
    const container = document.getElementById('tmMultiTapeInputs');
    if (!container) return;
    
    const standardInputs = document.getElementById('tmStandardInputs');
    if (standardInputs) {
        // Standard (Single-Tape) is hidden only when Multi-Tape is active
        standardInputs.style.display = MACHINE.type === 'MULTI_TAPE' ? 'none' : 'grid';
    }

    container.innerHTML = '';
    if (MACHINE.type !== 'MULTI_TAPE') return;

    // Add a small header for clarity
    const header = document.createElement('div');
    header.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 0.7em; font-weight: bold; color: #64748b; margin-bottom: 5px; text-align: center;';
    header.innerHTML = '<div>READ</div><div>WRITE</div><div>MOVE</div>';
    container.appendChild(header);

    for (let i = 0; i < (MACHINE.numTapes || 1); i++) {
        const row = document.createElement('div');
        row.className = 'modal-prop-row';
        row.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 8px;';
        
        row.innerHTML = `
            <input class="modal-input tm-read" data-tape="${i}" placeholder="Tape ${i+1}" maxlength="1" style="text-align: center; border-left: 3px solid #10b981;">
            <input class="modal-input tm-write" data-tape="${i}" placeholder="Write" maxlength="1" style="text-align: center;">
            <select class="modal-input tm-move" data-tape="${i}" style="text-align: center;">
                <option value="L">L</option>
                <option value="R" selected>R</option>
                <option value="S">S</option>
            </select>
        `;
        container.appendChild(row);
    }
}

export function updateStateLegend() {
    const states = MACHINE.states;
    const initial = states.filter(s => s.initial).length;
    const halt = states.filter(s => s.accepting).length;
    // Trap state: Non-halt state with no outgoing transitions
    const traps = states.filter(s => 
        !s.accepting && !MACHINE.transitions.some(t => t.from === s.id)
    ).length;

    addLogMessage(`Legend: ${initial} Initial, ${halt} Halt, ${traps} Potential Trap(s).`, 'info');
}

// Inside setupLogicToggle() in tm_ui.js
function setupLogicToggle() {
    const btn = document.getElementById('toggleLogicBtn');
    const exportBtn = document.getElementById('tmExportTableBtn');
    const modal = document.getElementById('logicTableModal');
    
    btn?.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'flex';
            updateLogicDisplay(); //
            if (window.lucide) lucide.createIcons();
        }
    });

    // --- NEW: Export Listener ---
    exportBtn?.addEventListener('click', async () => {
        const { exportTmTableToExcel } = await import('./logic_table.js');
        exportTmTableToExcel();
    });
}
