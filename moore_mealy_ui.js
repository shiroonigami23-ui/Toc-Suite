import { MACHINE, CURRENT_MODE, TRANS_FROM, UNDO_STACK, REDO_STACK, pushUndo, doUndo, doRedo, initializeState, handleClearCanvas, setCurrentMode, setTransFrom, simState, setMachine } from './moore_mealy_state.js';
import { renderAll, layoutStatesCircular } from './moore_mealy_renderer.js';
import { runSimulation } from './moore_mealy_simulation.js';
import { validateAutomaton, convertMooreToMealy } from './moore_mealy_automata.js';
import { setValidationMessage, addLogMessage, bindGlobalDrawerHandlers, refreshLucideIcons } from './utils.js';
import { areEquivalent } from './moore_mealy_equivalence.js';
import { animateMachineDrawing } from './animation.js'; 
import { initializeLibrary } from './moore_mealy_library_loader.js';
import { handleSaveMachine, loadMachine, handleAiGeneration, handleSaveWithMetadata, exportPng, handleImageUpload } from './moore_mealy_file.js';
import { generatePractice, showSolution, resetPractice, checkAnswer } from './moore_mealy_practice.js';
import { updateMmLogicDisplay, exportMmTableToExcel } from './mm_logic_table.js';

// --- Global MM Loader Function (Used by library loader) ---
window.loadMmMachine = (machineData) => {
    setMachine(machineData);
    layoutStatesCircular(machineData.states);
    renderAll();
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect) modeSelect.value = machineData.type;
    updateUndoRedoButtons();
};


// --- Global UI Helpers ---

function customAlert(title, message) {
    const alertModal = document.getElementById('alertModal');
    const titleEl = document.getElementById('alertModalTitle');
    const messageEl = document.getElementById('alertModalMessage');
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (alertModal) alertModal.style.display = 'flex';
}
window.customAlert = customAlert;

export function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = UNDO_STACK.length === 0;
    if (redoBtn) redoBtn.disabled = REDO_STACK.length === 0;
}

// --- Interaction Modals ---

/**
 * Opens the FA state properties modal for Mealy machines, hiding the "Final State" option.
 * Note: Mealy machines only use the initial state flag.
 */
function openMealyStatePropsModal(stateId) {
    // FIX: Using the generic statePropsModal but hiding the 'Final State' field,
    // which is provided in the global index.html file.
    const modal = document.getElementById('statePropsModal'); 
    const state = MACHINE.states.find(s => s.id === stateId);
    if (!modal || !state) return;
    
    // Hide 'Final State' option as Mealy/Moore machines don't use it
    const propFinalRow = document.querySelector('#statePropsModal .modal-prop-row:nth-child(2)');
    if (propFinalRow) propFinalRow.style.display = 'none';
    
    // Also hide the FA-specific output for Mealy
    const propOutputLabel = modal.querySelector('label[for="propOutput"]');
    if (propOutputLabel) propOutputLabel.style.display = 'none';

    modal.dataset.stateId = stateId;
    
    const propInitial = document.getElementById('propInitial');
    if (propInitial) propInitial.checked = state.initial;
    
    if (modal) modal.style.display = 'flex';
}


// --- In moore_mealy_ui.js ---

function openMooreStatePropsModal(stateId) {
    const modal = document.getElementById('mooreStatePropsModal');
    const state = MACHINE.states.find(s => s.id === stateId);
    const initialCheckbox = document.getElementById('moorePropInitial');

    if (!modal || !state || MACHINE.type !== 'MOORE') return;

    // --- NEW LOGIC: Lock initial status if this is the only state ---
    const isOnlyStateAndInitial = MACHINE.states.length === 1 && state.initial;
    
    initialCheckbox.disabled = isOnlyStateAndInitial;
    
    modal.dataset.stateId = stateId;
    
    if (initialCheckbox) initialCheckbox.checked = state.initial;
    if (document.getElementById('moorePropOutput')) document.getElementById('moorePropOutput').value = state.output || '';
    
    // Update title/description for "Edit State" context
    modal.dataset.isNew = 'false';
    modal.querySelector('h3').textContent = "Moore State Properties";
    modal.querySelector('.modal-description').textContent = 
        isOnlyStateAndInitial 
            ? "This is the **Initial State** and cannot be changed until another state is added."
            : "Set whether this is the initial state and define the output produced when entering this state.";
    
    const moorePropOutput = document.getElementById('moorePropOutput');
    if (modal) modal.style.display = 'flex';
    if (moorePropOutput) moorePropOutput.focus();
}


function openMealyTransitionModal(fromId, toId, currentSymbol = '', currentOutput = '') {
    const modal = document.getElementById('mealyTransitionModal');
    if (!modal) return;
    
    const mealyTransSymbol = document.getElementById('mealyTransSymbol');
    const mealyTransOutput = document.getElementById('mealyTransOutput');
    
    // Determine if we are editing an existing transition
    const isEditing = !!currentSymbol; // Check if currentSymbol has a value
    
    if (document.getElementById('mealyTransFrom')) document.getElementById('mealyTransFrom').value = fromId;
    if (document.getElementById('mealyTransTo')) document.getElementById('mealyTransTo').value = toId;
    
    if (mealyTransSymbol) {
        mealyTransSymbol.value = currentSymbol;
        mealyTransSymbol.readOnly = isEditing; 
        mealyTransSymbol.placeholder = isEditing ? 'Input Symbol (Locked)' : 'Input Symbol (e.g., 0)';
    }
    if (mealyTransOutput) mealyTransOutput.value = currentOutput;

    modal.dataset.fromId = fromId;
    modal.dataset.toId = toId;
    modal.dataset.oldSymbol = currentSymbol;
    // CRITICAL: We need to store if we are editing so the save function knows whether to check for conflicts (add) or just update (edit)
    modal.dataset.isEditing = isEditing.toString();

    if (modal) modal.style.display = 'flex';
    if (isEditing) {
        if (mealyTransOutput) mealyTransOutput.focus();
    } else {
        if (mealyTransSymbol) mealyTransSymbol.focus();
    }
}

function openMooreTransitionModal(fromId, toId) {
    // Reuses the FA's transition modal for Moore input symbols (since it has no output field)
    const modal = document.getElementById('transitionModal');
    if (!modal) return;
    
    // Set Moore-specific instruction
    const desc = modal.querySelector('.modal-description');
    if(desc) desc.textContent = "Enter the input symbol for the Moore machine transition (Deterministic).";

    if (document.getElementById('transFrom')) document.getElementById('transFrom').value = fromId;
    if (document.getElementById('transTo')) document.getElementById('transTo').value = toId;
    if (document.getElementById('transSymbol')) document.getElementById('transSymbol').value = '';
    
    // Hide output field if it exists (for maximum compatibility with generic modal reuse)
    const transOutput = document.getElementById('transOutput');
    if (transOutput) transOutput.parentElement.style.display = 'none';

    modal.dataset.fromId = fromId;
    modal.dataset.toId = toId;
    
    const transSymbol = document.getElementById('transSymbol');
    if (modal) modal.style.display = 'flex';
    if (transSymbol) transSymbol.focus();
}

function hideModals() {
    const modals = [
        'statePropsModal', 'mooreStatePropsModal', 'mealyTransitionModal', 
        'transitionModal', 'renameModal', 'confirmClearModal', 
        'saveLibraryModal', 'alertModal', 'exportPngModal'
    ];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    });
}

function renameState(oldId) {
    const modal = document.getElementById('renameModal');
    const input = document.getElementById('renameInput');
    if (!modal || !input) return;
    input.value = oldId;
    modal.dataset.oldId = oldId;
    modal.style.display = 'flex';
    input.focus();
    input.select();
}

function handleRenameSave() {
    const modal = document.getElementById('renameModal');
    const oldId = modal ? modal.dataset.oldId : null;
    const newIdInput = document.getElementById('renameInput');
    const newId = newIdInput ? newIdInput.value.trim() : null;

    if (!modal || !oldId || !newId || newId === oldId || MACHINE.states.find(s => s.id === newId)) {
        if (MACHINE.states.find(s => s.id === newId)) {
            customAlert('Rename Failed', 'A state with that name already exists.');
        }
        if (modal) modal.style.display = 'none';
        return;
    }
    pushUndo(updateUndoRedoButtons);
    MACHINE.states.find(s => s.id === oldId).id = newId;
    MACHINE.transitions.forEach(t => {
        if (t.from === oldId) t.from = newId;
        if (t.to === oldId) t.to = newId;
    });
    addLogMessage(`MM state renamed: <strong>${oldId}</strong> -> <strong>${newId}</strong>.`, 'edit-3');
    renderAll();
    if (modal) modal.style.display = 'none';
}

// --- Navigation Logic ---

/**
 * Handles the "Back to Main Menu" click event by revealing the splash screen
 * and hiding the main application content, allowing the user to select a different studio.
 */
function handleBackToMenu() {
    // 1. Get references to main elements (they are assumed to exist in the global index.html)
    const splashScreen = document.getElementById('splashScreen');
    const mainApp = document.getElementById('mainApp');
    const studioContent = document.getElementById('studioContent');

    if (!splashScreen || !mainApp || !studioContent) {
        console.error("Cannot find splash screen or main app container.");
        window.customAlert("Error", "Could not find the main menu container to switch back.");
        return;
    }

    // 2. Clear out the dynamically loaded MM studio content
    studioContent.innerHTML = '';
    
    // 3. Hide the main app container
    mainApp.style.display = 'none';

    // 4. Show the splash screen with an animation delay
    splashScreen.style.display = 'flex';
    setTimeout(() => {
        splashScreen.style.opacity = '1';
    }, 50);
    addLogMessage('Exited MM studio to main menu.', 'home');
}


// --- Core Machine Operations ---

function addState(x, y) {
    if (MACHINE.type === 'MOORE') {
        // If Moore, open the creation modal instead of adding directly
        openNewMooreStateModal(x, y);
    } else {
        // If Mealy/FA, proceed with default creation logic
        let maxId = -1;
        MACHINE.states.forEach(state => {
            if (state.id.startsWith('q')) {
                const num = parseInt(state.id.substring(1), 10);
                if (!isNaN(num) && num > maxId) maxId = num;
            }
        });
        const newId = 'q' + (maxId + 1);
        
        pushUndo(updateUndoRedoButtons);
        
        MACHINE.states.push({ 
            id: newId, 
            x, 
            y, 
            initial: MACHINE.states.length === 0, 
            // Ensure Mealy does NOT get an output field
        });
        addLogMessage(`MM state added: <strong>${newId}</strong> at (${Math.round(x)}, ${Math.round(y)}).`, 'plus-circle');
        enforceInitialStateRule();
        renderAll();
        const stateG = document.querySelector(`g[data-id="${newId}"] circle`);
        if (stateG) {
            stateG.classList.add('state-drawing');
            setTimeout(() => stateG.classList.remove('state-drawing'), 600);
        }
    }
}

// --- In moore_mealy_ui.js ---

function deleteState(id) {
    const state = MACHINE.states.find(s => s.id === id);
    
    // --- NEW LOGIC: Prevent deletion of the initial state if it is the only state ---
    if (state && state.initial && MACHINE.states.length === 1 && MACHINE.type === 'MOORE') {
        customAlert('Deletion Blocked', 'The initial state of a Moore Machine cannot be deleted if it is the only state.');
        return;
    }
    
    pushUndo(updateUndoRedoButtons);
    MACHINE.states = MACHINE.states.filter(s => s.id !== id);
    MACHINE.transitions = MACHINE.transitions.filter(t => t.from !== id && t.to !== id);
    addLogMessage(`MM state deleted: <strong>${id}</strong> (with linked transitions).`, 'trash-2');
    
    // Note: enforceInitialStateRule handles re-assigning initial status if necessary
    enforceInitialStateRule(); 
    renderAll();
}


function deleteTransition(from, to, symbol) {
    pushUndo(updateUndoRedoButtons);
    
    const indexToDelete = MACHINE.transitions.findIndex(t => 
        t.from === from && 
        t.to === to && 
        t.symbol === symbol
    );

    if (indexToDelete > -1) {
        MACHINE.transitions.splice(indexToDelete, 1);
        addLogMessage(`MM transition deleted: <strong>${from}</strong> --${symbol || 'ε'}--> <strong>${to}</strong>.`, 'trash-2');
        renderAll();
    } else {
        customAlert('Error', 'Transition not found for deletion.');
    }
}

function enforceInitialStateRule() {
    if (!MACHINE || !Array.isArray(MACHINE.states)) return;
    
    // Rule 1: If there are states and none are initial, force the first one to be initial.
    const initialStates = MACHINE.states.filter(s => s.initial);
    if (MACHINE.states.length > 0 && initialStates.length === 0) {
        MACHINE.states[0].initial = true;
    }
   }


/**
 * handleConversionMode
 * Orchestrates high-level transformations between Output Machines.
 */
async function handleConversionMode(updateUIFunction) {
    const modeSelect = document.getElementById('modeSelect');
    if (!modeSelect) return;
    
    const newMode = modeSelect.value;
    const oldMode = MACHINE.type;

    // 1. MOORE TO MEALY CONVERSION
    if (newMode === 'MOORE_TO_MEALY') {
        const validationResult = validateAutomaton();
        if (validationResult.type === 'error' && validationResult.message.includes('Moore Rule')) {
            setValidationMessage('Cannot convert: invalid Moore machine. ' + validationResult.message, 'error');
            modeSelect.value = oldMode; 
            return;
        }

        try {
            pushUndo(updateUIFunction);
            modeSelect.disabled = true;
            
            const { animateMooreToMealy } = await import('./moore_mealy_conversion_animation.js');
            await animateMooreToMealy(MACHINE, updateUIFunction);

            MACHINE.type = 'MEALY';
            modeSelect.value = 'MEALY';
            addLogMessage('MM conversion complete: Moore -> Mealy.', 'sparkles');
        } catch (err) {
            customAlert('Conversion Failed', err.message);
            modeSelect.value = oldMode; 
        } finally {
            modeSelect.disabled = false;
        }
    } 
    
    // 2. MEALY TO MOORE CONVERSION (Animated)
    else if (newMode === 'MEALY_TO_MOORE') {
        try {
            pushUndo(updateUIFunction);
            modeSelect.disabled = true;
            
            // Call the ANIMATED wrapper instead of the raw converter
            const { animateMealyToMoore } = await import('./moore_mealy_conversion_animation.js');
            await animateMealyToMoore(MACHINE, updateUIFunction);
            
            MACHINE.type = 'MOORE';
            modeSelect.value = 'MOORE';
            addLogMessage('MM conversion complete: Mealy -> Moore.', 'sparkles');
            renderAll();
        } catch (err) {
            customAlert('Conversion Failed', err.message);
            modeSelect.value = oldMode;
        } finally {
            modeSelect.disabled = false;
        }
    }
    
    // 3. STANDARD MODE SWITCH
    else {
        MACHINE.type = newMode;
        addLogMessage(`MM mode switched to <strong>${newMode}</strong>.`, 'zap');
        renderAll();
    }
}


// --- Dragging and Zoom Logic (Copied from base) ---
function setupDragAndZoom(svg, updateUndoRedoButtons, renderAll) {
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    const canvasWrapper = document.getElementById('svgWrapper');

    const setZoom = (pct) => {
        if(canvasWrapper) {
            canvasWrapper.style.transform = `scale(${pct / 100})`;
            canvasWrapper.style.transformOrigin = 'top left';
        }
        if(zoomSlider) zoomSlider.value = pct;
    };
    
    if(zoomSlider) zoomSlider.addEventListener('input', e => setZoom(e.target.value));
    if(zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(Math.min(200, Number(zoomSlider.value) + 10)));
    if(zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(Math.max(50, Number(zoomSlider.value) - 10)));
    if(zoomResetBtn) zoomResetBtn.addEventListener('click', () => setZoom(100));
    setZoom(100);

    let dragging = false, currentStateG = null, dragOffsetX = 0, dragOffsetY = 0;
    let dragStartSnapshot = null;

    function getPoint(evt) {
        if (!svg) return { x: 0, y: 0 }; 

        const pt = svg.createSVGPoint();
        const touch = evt.touches ? evt.touches[0] : evt;
        pt.x = touch.clientX;
        pt.y = touch.clientY;
        const ctm = svg.getScreenCTM();
        return ctm ? pt.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
    }

    function startDrag(e) {
        const stateG = e.target.closest('g[data-id]');
        if (CURRENT_MODE !== 'move' || !stateG) return;
        if (e.target.closest('.state-circle') || e.target.closest('.state-label')) {
            e.preventDefault(); e.stopPropagation();
            const sObj = MACHINE.states.find(x => x.id === stateG.getAttribute('data-id'));
            if (!sObj) return;
            pushUndo(updateUndoRedoButtons);
            dragging = true; currentStateG = stateG;
            const p = getPoint(e);
            dragOffsetX = p.x - sObj.x; dragOffsetY = p.y - sObj.y;
            dragStartSnapshot = { id: sObj.id, x: sObj.x, y: sObj.y };
            
            const circle = stateG.querySelector('circle');
            if(circle) circle.classList.add('state-selected');
        }
    }

    function moveDrag(e) {
        if (!dragging) return;
        e.preventDefault();
        const sObj = MACHINE.states.find(x => x.id === currentStateG.getAttribute('data-id'));
        if (!sObj) return;
        const p = getPoint(e);
        sObj.x = p.x - dragOffsetX; sObj.y = p.y - dragOffsetY;
        renderAll();
    }

    function endDrag() {
        if (!dragging) return;
        const movedState = currentStateG ? MACHINE.states.find(x => x.id === currentStateG.getAttribute('data-id')) : null;
        dragging = false;
        if(currentStateG) {
            const circle = currentStateG.querySelector('circle');
            if(circle) circle.classList.remove('state-selected');
        }
        if (dragStartSnapshot && movedState) {
            addLogMessage(
                `MM state moved: <strong>${dragStartSnapshot.id}</strong> (${Math.round(dragStartSnapshot.x)},${Math.round(dragStartSnapshot.y)}) -> (${Math.round(movedState.x)},${Math.round(movedState.y)}).`,
                'move'
            );
        }
        dragStartSnapshot = null;
        currentStateG = null;
    }

    if (svg) {
        svg.addEventListener('mousedown', startDrag);
        svg.addEventListener('mousemove', moveDrag);
        svg.addEventListener('mouseup', endDrag);
        svg.addEventListener('mouseleave', endDrag);
        svg.addEventListener('touchstart', startDrag);
        svg.addEventListener('touchmove', moveDrag);
        svg.addEventListener('touchend', endDrag);
        svg.addEventListener('touchcancel', endDrag);
    }
}

function openNewMooreStateModal(x, y) {
    const modal = document.getElementById('mooreStatePropsModal');
    const outputInput = document.getElementById('moorePropOutput');
    const initialCheckbox = document.getElementById('moorePropInitial'); // Get checkbox reference

    if (!modal || !outputInput || MACHINE.type !== 'MOORE') return;

    // 1. Reset inputs
    initialCheckbox.checked = false;
    outputInput.value = '';
    
    // --- NEW LOGIC: Lock initial state if canvas is empty ---
    const isCanvasEmpty = MACHINE.states.length === 0;
    
    initialCheckbox.disabled = isCanvasEmpty;
    if (isCanvasEmpty) {
        initialCheckbox.checked = true; // Force initial state selection
    }
    
    // 2. Set temporary coordinates in the modal's dataset for use on save
    modal.dataset.tempX = x;
    modal.dataset.tempY = y;
    // Set a flag to indicate this is a NEW state creation, not an EDIT
    modal.dataset.isNew = 'true';
    
    // 3. Update modal title/description for "New State" context
    modal.querySelector('h3').textContent = "Add New Moore State";
    modal.querySelector('.modal-description').textContent = 
        isCanvasEmpty 
            ? "This must be the **Initial State** (mandatory output $\lambda(q)$ required)." 
            : "Define the state's properties and its mandatory output ($\lambda(q)$).";

    // 4. Show modal and focus
    modal.style.display = 'flex';
    outputInput.focus();
}

/**
 * Adds a new state to the machine state with properties derived from the modal.
 * This is the internal function used by the Save handler.
 */
function addStateInternal(x, y, isInitial, output) {
    let maxId = -1;
    MACHINE.states.forEach(state => {
        if (state.id.startsWith('q')) {
            const num = parseInt(state.id.substring(1), 10);
            if (!isNaN(num) && num > maxId) maxId = num;
        }
    });
    const newId = 'q' + (maxId + 1);
    pushUndo(updateUndoRedoButtons);
    
    // Handle initial state rule enforcement
    if (isInitial) {
        MACHINE.states.forEach(s => s.initial = false);
    }
    
    const newState = { 
        id: newId, 
        x, 
        y, 
        initial: isInitial, 
        output: MACHINE.type === 'MOORE' ? output : undefined 
    };
    
    MACHINE.states.push(newState);
    addLogMessage(`MM state added: <strong>${newId}</strong> at (${Math.round(x)}, ${Math.round(y)})${MACHINE.type === 'MOORE' ? ` with output "${output}"` : ''}.`, 'plus-circle');
    renderAll();
    const stateG = document.querySelector(`g[data-id="${newId}"] circle`);
    if (stateG) {
        stateG.classList.add('state-drawing');
        setTimeout(() => stateG.classList.remove('state-drawing'), 600);
    }
}


// --- Main Initialization ---

export function initializeUI() {
    hideModals();
    
    // UI Elements 
    const svg = document.getElementById('dfaSVG');
    const modeSelect = document.getElementById('modeSelect');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const validateBtn = document.getElementById('validateBtn');
    const runTestBtn = document.getElementById('runTestBtn');
    const testInput = document.getElementById('testInput');
    const loadMachineBtn = document.getElementById('loadMachineBtn');
    const saveMachineBtn = document.getElementById('saveMachineBtn');
    const saveLibraryConfirmBtn = document.getElementById('libSaveConfirm');
    const genPracticeBtn = document.getElementById('genPracticeBtn');
    const showSolBtn = document.getElementById('showSolBtn');
    const resetPracticeBtn = document.getElementById('resetPractice');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const panelToggleBtn = document.getElementById('panelToggleBtn');
    const controlPanel = document.getElementById('controlPanel');
    const visualizationPanel = document.getElementById('visualization-panel');
    const aiGenerateFromDescBtn = document.getElementById('aiGenerateFromDescBtn');
    const aiDescInput = document.getElementById('aiDescInput');
    
    // Image Import elements
    const importImageBtn = document.getElementById('importImageBtn');
    const importImageInput = document.getElementById('importImageInput');
    const exportPngBtn = document.getElementById('exportPngBtn');

    // Modal buttons
    const moorePropSave = document.getElementById('moorePropSave');
    const propSave = document.getElementById('propSave'); // The generic FA modal save button
    const mealyTransSave = document.getElementById('mealyTransSave'); 
    const moorePropCancel = document.getElementById('moorePropCancel');
    const propCancel = document.getElementById('propCancel'); // The generic FA modal cancel button
    const mealyTransCancel = document.getElementById('mealyTransCancel');
    const renameCancel = document.getElementById('renameCancel');
    const renameSave = document.getElementById('renameSave');
    const transSave = document.getElementById('transSave'); 
    const transCancel = document.getElementById('transCancel'); 
    const libSaveCancel = document.getElementById('libSaveCancel');
    const alertOk = document.getElementById('alertOk');

    // Dragging and Zooming
    if (svg) {
        setupDragAndZoom(svg, updateUndoRedoButtons, renderAll);
    }

    // Collapsible Panel
    const ensureDrawerBackdrop = () => {
        let backdrop = document.getElementById('drawerBackdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'drawerBackdrop';
            backdrop.className = 'drawer-backdrop';
            document.body.appendChild(backdrop);
        }
        return backdrop;
    };
    const drawerBackdrop = ensureDrawerBackdrop();
    const closePanel = () => {
        if (controlPanel) controlPanel.classList.remove('open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('open');
        if (panelToggleBtn) panelToggleBtn.setAttribute('aria-expanded', 'false');
    };
    const togglePanel = () => {
        if (!controlPanel) return;
        const isOpen = controlPanel.classList.toggle('open');
        if (drawerBackdrop) drawerBackdrop.classList.toggle('open', isOpen);
        if (panelToggleBtn) panelToggleBtn.setAttribute('aria-expanded', String(isOpen));
    };

    if (panelToggleBtn) {
        panelToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });
    }
    drawerBackdrop?.addEventListener('click', closePanel);
    visualizationPanel?.addEventListener('click', closePanel);
    bindGlobalDrawerHandlers(closePanel);

    const showLoading = () => { if (loadingOverlay) loadingOverlay.style.display = 'flex'; };
    const hideLoading = () => { if (loadingOverlay) loadingOverlay.style.display = 'none'; };


    // 1. Tool Mode Listeners
    document.querySelectorAll('.toolbar-icon[data-mode]').forEach(tool => {
        tool.addEventListener('click', () => {
            document.querySelectorAll('.toolbar-icon[data-mode]').forEach(t => t.classList.remove('active'));
            tool.classList.add('active');
            setCurrentMode(tool.dataset.mode);
            setTransFrom(null);
            document.querySelectorAll('.state-circle.state-selected').forEach(c => c.classList.remove('state-selected'));
            if (svg) svg.className.baseVal = `mode-${tool.dataset.mode}`;
            addLogMessage(`MM tool changed to <strong>${String(tool.dataset.mode || '').toUpperCase()}</strong>.`, 'mouse-pointer');
            renderAll();
        });
    });
    
    // 2. Canvas Click Listener
    if (svg) {
        svg.addEventListener('click', (e) => {
            if (e.target.closest('g[data-id]') || e.target.closest('.transition-label-text')) return;
            if (CURRENT_MODE === 'addclick') {
                const pt = svg.createSVGPoint();
                pt.x = e.clientX; pt.y = e.clientY;
                const ctm = svg.getScreenCTM();
                if (ctm) {
                    const svgP = pt.matrixTransform(ctm.inverse());
                    addState(svgP.x, svgP.y);
                }
            }
        });

        // 3. State Click Listener (for moves, deletes, properties, or start of transition)
        svg.addEventListener('click', (e) => {
            const stateGroup = e.target.closest('g[data-id]');
            if (!stateGroup) return;
            const stateId = stateGroup.dataset.id;
            e.stopPropagation();

             if (CURRENT_MODE === 'stateprops') {
                if (MACHINE.type === 'MOORE') {
                    openMooreStatePropsModal(stateId);
                } else if (MACHINE.type === 'MEALY') {
                    // FIX: Use the special Mealy modal logic
                    openMealyStatePropsModal(stateId); 
                }
                return;
            }

            // Also allow clicking a state to open editing if we click an existing transition label
            const label = e.target.closest('.transition-label-text');
            if (label && MACHINE.type === 'MEALY' && CURRENT_MODE !== 'delete') {
                const from = label.dataset.from;
                const to = label.dataset.to;
                const symbol = label.dataset.symbol;
                
                // Find the specific transition to get the output
                const existingTrans = MACHINE.transitions.find(t => 
                    t.from === from && t.to === to && t.symbol === symbol);

                if (existingTrans) {
                    openMealyTransitionModal(
                        existingTrans.from, 
                        existingTrans.to, 
                        existingTrans.symbol, 
                        existingTrans.output
                    );
                }
                return;
            }

            switch (CURRENT_MODE) {
                case 'transition':
                    {
                        if (!TRANS_FROM) {
                            setTransFrom(stateId);
                            const circle = stateGroup.querySelector('.state-circle');
                            if(circle) circle.classList.add('state-selected');
                        } else {
                            if (MACHINE.type === 'MOORE') {
                                openMooreTransitionModal(TRANS_FROM, stateId); 
                            } else {
                                openMealyTransitionModal(TRANS_FROM, stateId); 
                            }
                            document.querySelectorAll('.state-circle.state-selected').forEach(c => c.classList.remove('state-selected'));
                            setTransFrom(null);
                        }
                        break;
                    }
                case 'delete':
                    deleteState(stateId);
                    break;
                case 'rename':
                    renameState(stateId);
                    break;
            }
        });

        // 4. Transition Click Listener (for deleting or editing transitions)
        svg.addEventListener('click', (e) => {
            const label = e.target.closest('.transition-label-text');
            if (!label) return;

            e.stopPropagation(); 
            const from = label.dataset.from;
            const to = label.dataset.to;
            const symbol = label.dataset.symbol;
            
            if (CURRENT_MODE === 'delete') {
                deleteTransition(from, to, symbol);
            } else if (MACHINE.type === 'MEALY') { // Allows editing in any non-delete, non-transition mode (like move or addclick)
                 // Open modal for editing output
                const existingTrans = MACHINE.transitions.find(t => 
                    t.from === from && t.to === to && t.symbol === symbol);
                
                if (existingTrans) {
                    openMealyTransitionModal(
                        existingTrans.from, 
                        existingTrans.to, 
                        existingTrans.symbol, 
                        existingTrans.output
                    );
                }
            }
        });
    }

    // 5. Global Action Listeners
    if (undoBtn) undoBtn.addEventListener('click', () => {
        doUndo(updateUndoRedoButtons);
        addLogMessage('MM undo applied.', 'undo-2');
    });
    if (redoBtn) redoBtn.addEventListener('click', () => {
        doRedo(updateUndoRedoButtons);
        addLogMessage('MM redo applied.', 'redo-2');
    });
    if (validateBtn) validateBtn.addEventListener('click', () => {
        const result = validateAutomaton();
        setValidationMessage(result.message, result.type);
        addLogMessage(`MM audit: ${result.message}`, result.type === 'error' ? 'alert-octagon' : (result.type === 'warning' ? 'alert-triangle' : 'shield-check'));
    });
    
    // File Operations
    if (clearCanvasBtn) clearCanvasBtn.addEventListener('click', () => {
        if (confirmClearModal) confirmClearModal.style.display = 'flex';
    });
    
    if (confirmClearCancel) confirmClearCancel.addEventListener('click', hideModals);
    
    if (confirmClearConfirm) confirmClearConfirm.addEventListener('click', () => {
        // Use the dedicated clear function
        handleClearCanvas(updateUndoRedoButtons);
        addLogMessage('MM canvas cleared.', 'file-x');
    });
    if (loadMachineBtn) loadMachineBtn.addEventListener('click', () => {
        const fileInput = document.getElementById('loadFileInput');
        if (fileInput) fileInput.click();
    });
    // FIX: loadMachine is dynamically sourced via StudioContext in unified_main.js
    if (document.getElementById('loadFileInput')) document.getElementById('loadFileInput').addEventListener('change', (e) => window.StudioContext.loadMachine(e));
    if (saveMachineBtn) saveMachineBtn.addEventListener('click', handleSaveMachine);
    if (saveLibraryConfirmBtn) saveLibraryConfirmBtn.addEventListener('click', handleSaveWithMetadata);
    if (libSaveCancel) libSaveCancel.addEventListener('click', hideModals);
    
    // Image/PNG Operations
    if (exportPngBtn) exportPngBtn.addEventListener('click', () => {
        // Simple click handler to open the modal (modal logic handles the export)
        const defaultName = `${MACHINE.type || 'automaton'}-export`;
        const pngNameInput = document.getElementById('pngNameInput');
        const exportModal = document.getElementById('exportPngModal');
        if (pngNameInput) pngNameInput.value = defaultName;
        if (exportModal) exportModal.style.display = 'flex';
    });
    if (importImageBtn) importImageBtn.addEventListener('click', () => {
        if (importImageInput) importImageInput.click();
    });
    if (importImageInput) importImageInput.addEventListener('change', (e) => {
        handleImageUpload(e, updateUndoRedoButtons, showLoading, hideLoading);
    });

    // AI Generation
    if (aiGenerateFromDescBtn) aiGenerateFromDescBtn.addEventListener('click', () => {
        const prompt = aiDescInput.value.trim();
        if (prompt) {
            handleAiGeneration(prompt, updateUndoRedoButtons, showLoading, hideLoading);
        } else {
            customAlert('Input Required', 'Please enter a description for the AI to generate a machine.');
        }
    });

    // 6. Mode Select Listener (Conversion)
    if (modeSelect) {
        modeSelect.addEventListener('change', () => handleConversionMode(updateUndoRedoButtons));
    }

    // 7. Test Panel Listeners
    const genRandBtn = document.getElementById("genRandBtn");
    
    if(runTestBtn) runTestBtn.addEventListener('click', () => {
        const input = testInput ? testInput.value : '';
        addLogMessage(`MM test run started for input "${input || 'ε'}".`, 'flask-conical');
        runSimulation(input);
    });
    
    // **FIXED: Random String Generator Logic**
    if(genRandBtn) genRandBtn.addEventListener('click', () => {
        // 1. Get the current active alphabet from transitions
        const alphabet = [...new Set(MACHINE.transitions.map(t => t.symbol).filter(s => s))]
        // 2. Default to binary if no symbols are defined yet
        const effectiveAlphabet = alphabet.length > 0 ? alphabet : ['0', '1'];
        
        // 3. Generate random length (3 to 10)
        const len = Math.floor(Math.random() * 8) + 3;
        
        if(testInput) testInput.value = Array.from({ length: len }, () => effectiveAlphabet[Math.floor(Math.random() * effectiveAlphabet.length)]).join('');
        addLogMessage(`MM random string generated: "${testInput ? (testInput.value || '') : ''}".`, 'dice-5');
    });
    
    if(genPracticeBtn) genPracticeBtn.addEventListener('click', () => {
        generatePractice();
        if (checkAnswerBtn) checkAnswerBtn.style.display = 'inline-flex';
    });
    if(showSolBtn) showSolBtn.addEventListener('click', () => showSolution(updateUndoRedoButtons));
    if(resetPracticeBtn) resetPracticeBtn.addEventListener('click', () => {
        resetPractice();
        if (checkAnswerBtn) checkAnswerBtn.style.display = 'none';
    });
    if(checkAnswerBtn) checkAnswerBtn.addEventListener('click', checkAnswer);
    
    // 8. Modal Save/Cancel Logic
    if (alertOk) alertOk.addEventListener('click', hideModals);

    // Rename Modal Save/Cancel
    if (renameCancel) renameCancel.addEventListener('click', hideModals);
    if (renameSave) renameSave.addEventListener('click', handleRenameSave); 
    
    // Mealy State Props Modal (REUSED FA MODAL)
    if (propCancel) propCancel.addEventListener('click', hideModals);
    if (propSave) propSave.addEventListener('click', (e) => {
        e.preventDefault(); 
        const modal = document.getElementById('statePropsModal');
        const stateId = modal ? modal.dataset.stateId : null;
        const initialEl = document.getElementById('propInitial');
        const isInitial = initialEl ? initialEl.checked : false;

        const state = MACHINE.states.find(s => s.id === stateId);
        if (state) {
            pushUndo(updateUndoRedoButtons);
            // Mealy only needs to set the initial flag (no accepting/final state)
            if (isInitial) {
                MACHINE.states.forEach(x => x.initial = false);
            }
            state.initial = isInitial;
            // CRITICAL: Ensure no 'accepting' field remains
            delete state.accepting; 
            addLogMessage(`Mealy state updated: <strong>${stateId}</strong> (initial=${isInitial}).`, 'settings');
            renderAll();
        }
        hideModals();
    });


    // Moore Output Modal
    if (moorePropCancel) moorePropCancel.addEventListener('click', hideModals);
    if (moorePropSave) moorePropSave.addEventListener('click', (e) => {
        e.preventDefault(); 
        const modal = document.getElementById('mooreStatePropsModal');
        // Check if modal exists before accessing its dataset
        if (!modal) {
             customAlert('Error', 'State properties modal not found.');
             return;
        }

        const stateId = modal.dataset.stateId;
        // The isNew flag needs to be carefully checked, as it might be undefined/false
        const isNew = modal.dataset.isNew === 'true'; 
        
        const outputEl = document.getElementById('moorePropOutput');
        const initialEl = document.getElementById('moorePropInitial');
        
        const output = outputEl ? outputEl.value.trim() : '';
        const isInitial = initialEl ? initialEl.checked : false;

        if (!output) {
             customAlert('Input Required', 'Moore state output cannot be empty.');
             return;
        }
        
        // Dispatch to either the new state creation path or the editing path
        if (isNew) {
            // New state creation path
            const x = parseFloat(modal.dataset.tempX);
            const y = parseFloat(modal.dataset.tempY);
            if (isNaN(x) || isNaN(y)) {
                customAlert('Error', 'Invalid coordinates for new state.');
                return;
            }
            // Add the state, which handles undo/render internally
            addStateInternal(x, y, isInitial, output);
            addLogMessage(`Moore state created at (${Math.round(x)}, ${Math.round(y)}) with output "${output}".`, 'plus-circle');
        } else {
            // Existing state editing path
            const state = MACHINE.states.find(s => s.id === stateId);
            if (state) {
                pushUndo(updateUndoRedoButtons);
                state.output = output;
                // Enforce one initial state rule
                if (isInitial) {
                    MACHINE.states.forEach(x => x.initial = false);
                }
                state.initial = isInitial;
                delete state.accepting; // Safety net for Moore machines
                addLogMessage(`Moore state updated: <strong>${state.id}</strong> (initial=${isInitial}, output="${output}").`, 'settings');
                renderAll();
            }
        }

        // --- CRITICAL FIX: Reset and Hide the Modal ---
        modal.dataset.isNew = 'false';
        modal.dataset.stateId = ''; // Clear state ID
        modal.querySelector('h3').textContent = "Moore State Properties"; // Revert title
        modal.querySelector('.modal-description').textContent = "Set whether this is the initial state and define the output produced when entering this state.";
        hideModals(); // This function correctly hides the modal
    });
    
    // Mealy Transition Modal (Add or Edit)
    if (mealyTransCancel) mealyTransCancel.addEventListener('click', hideModals);
    if (mealyTransSave) mealyTransSave.addEventListener('click', (e) => {
        e.preventDefault(); 
        const modal = document.getElementById('mealyTransitionModal');
        if (!modal) return;
        const from = modal.dataset.fromId;
        const to = modal.dataset.toId;
        const oldSymbol = modal.dataset.oldSymbol;
        const isEditing = modal.dataset.isEditing === 'true';

        const symbolEl = document.getElementById('mealyTransSymbol');
        const outputEl = document.getElementById('mealyTransOutput');
        const symbol = symbolEl ? symbolEl.value.trim() : '';
        const output = outputEl ? outputEl.value.trim() : '';

        if (!symbol || !output) {
            customAlert('Input Required', 'Both the input symbol and the output must be provided.');
            return;
        }
        
        if (isEditing) {
            // EDITING EXISTING TRANSITION (Only output can change, symbol is locked)
            const index = MACHINE.transitions.findIndex(t => 
                t.from === from && t.to === to && t.symbol === oldSymbol);
            
            if (index > -1) {
                pushUndo(updateUndoRedoButtons);
                MACHINE.transitions[index].output = output;
                addLogMessage(`Mealy transition updated: <strong>${from}</strong> --${oldSymbol} / ${output}--> <strong>${to}</strong>.`, 'git-branch');
            }
        } else {
            // ADDING NEW TRANSITION (Check determinism)
            const conflict = MACHINE.transitions.find(t => t.from === from && t.symbol === symbol);
            if (conflict) {
                customAlert('Invalid Transition', `State ${from} is already deterministic on input '${symbol}'.`);
                return;
            }

            pushUndo(updateUndoRedoButtons);
            MACHINE.transitions.push({ from, to, symbol, output });
            addLogMessage(`Mealy transition added: <strong>${from}</strong> --${symbol} / ${output}--> <strong>${to}</strong>.`, 'git-branch');
        }
        renderAll();
        hideModals();
    });
    
    // Moore's Simple Transition Modal (Add only, no output)
    if (transCancel) transCancel.addEventListener('click', hideModals);
    if (transSave) transSave.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        const modal = document.getElementById('transitionModal');
        const from = modal ? modal.dataset.fromId : null;
        const to = modal ? modal.dataset.toId : null;
        const symbolInput = document.getElementById('transSymbol');
        const symbol = symbolInput ? symbolInput.value.trim() : null;

        if (!symbol) {
             customAlert('Input Required', 'Transition symbol cannot be empty for Moore Machine.');
             return;
        }
        
        const conflict = MACHINE.transitions.find(t => t.from === from && t.symbol === symbol);
        if (conflict) {
            customAlert('Invalid Transition', `State ${from} is already deterministic on input '${symbol}'.`);
            return;
        }

        pushUndo(updateUndoRedoButtons);
        // Note: Moore transitions do NOT have an output property
        MACHINE.transitions.push({ from, to, symbol }); 
        addLogMessage(`Moore transition added: <strong>${from}</strong> --${symbol}--> <strong>${to}</strong>.`, 'git-branch');
        renderAll();
        hideModals();
    });
    
     // 9. Navigation Logic
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', handleBackToMenu);
    }

    // --- MACHINE INTELLIGENCE INTEGRATION ---
    // This hooks into the render loop to make the sidebar roles dynamic
    const originalRenderMM = renderAll;
    window.renderAll = () => {
        originalRenderMM();
        if (typeof updateMmLogicDisplay === 'function') {
            updateMmLogicDisplay(); // Syncs Initial and Trap badges
        }
    };

    // Replace the previous logic toggle listener
document.getElementById('toggleMmLogicBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('mmLogicModal');
    if (modal) {
        modal.style.display = 'flex';
        updateMmLogicDisplay(); 
        refreshLucideIcons();
    }
});

document.getElementById('mmExportTableBtn')?.addEventListener('click', () => {
    exportMmTableToExcel(); 
});

    // --- Initial Setup ---
    const toolbarIcon = document.querySelector('.toolbar-icon[data-mode="addclick"]');
    if (toolbarIcon) toolbarIcon.classList.add('active');
    
    if(svg) svg.className.baseVal = 'mode-addclick';
    
    // Initialize state and library
    initializeState(updateUndoRedoButtons);
    initializeLibrary();
    
    // Trigger the dynamic render loop for the first time
    window.renderAll(); 
    
    updateUndoRedoButtons();
    if(checkAnswerBtn) checkAnswerBtn.style.display = 'none';

    // Final icon generation for all dynamic elements
    refreshLucideIcons();
}
