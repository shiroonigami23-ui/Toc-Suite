import { MACHINE, CURRENT_MODE, TRANS_FROM, UNDO_STACK, REDO_STACK, pushUndo, doUndo, doRedo, initializeState, setCurrentMode, setTransFrom, setMachine, simState } from './state.js';
import { renderAll, layoutStatesCircular } from './renderer.js';
import { runSimulation, showStep } from './simulation.js';
import { validateAutomaton } from './automata.js';
import { saveMachine, loadMachine, exportPng, handleSaveWithMetadata, handleImageUpload, handleAiGeneration } from './file.js';
import { generatePractice, showSolution, resetPractice, checkAnswer } from './practice.js';
import { setValidationMessage, bindGlobalDrawerHandlers, refreshLucideIcons } from './utils.js';
import { areEquivalent } from './equivalence.js';
import { animateEnfaToNfa, animateNfaToDfa, animateDfaToMinDfa, animateNfaToMinDfa } from './conversion-animation.js';
import { updateFaLogicDisplay, exportFaTableToExcel } from './fa_logic_table.js';

function customAlert(title, message) {
    const alertModal = document.getElementById('alertModal');
    if (document.getElementById('alertModalTitle')) document.getElementById('alertModalTitle').textContent = title;
    if (document.getElementById('alertModalMessage')) document.getElementById('alertModalMessage').textContent = message;
    if (alertModal) alertModal.style.display = 'flex';
}
window.customAlert = customAlert;

export function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = UNDO_STACK.length === 0;
    if (redoBtn) redoBtn.disabled = REDO_STACK.length === 0;
}

// FIX: New function to explicitly hide all modals on initialization
function hideAllModals() {
    const modals = ['transitionModal', 'statePropsModal', 'renameModal', 'confirmClearModal', 'alertModal', 'saveLibraryModal', 'exportPngModal'];
    modals.forEach(id => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    });
}

export function initializeUI() {
    // FIX: Hide all modals immediately to prevent unwanted pop-ups
    hideAllModals(); 
    
    const svg = document.getElementById('dfaSVG');
    const modeSelect = document.getElementById('modeSelect');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');
    const genRandBtn = document.getElementById("genRandBtn");
    const stepNextBtn = document.getElementById("stepNext");
    const stepPrevBtn = document.getElementById("stepPrev");
    const stepResetBtn = document.getElementById("stepReset");
    const saveMachineBtn = document.getElementById("saveMachineBtn");
    const loadMachineBtn = document.getElementById("loadMachineBtn");
    const validateBtn = document.getElementById('validateBtn');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const runTestBtn = document.getElementById('runTestBtn');
    const testInput = document.getElementById('testInput');
    const genPracticeBtn = document.getElementById('genPracticeBtn');
    const showSolBtn = document.getElementById('showSolBtn');
    const resetPracticeBtn = document.getElementById('resetPractice');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const panelToggleBtn = document.getElementById('panelToggleBtn');
    const controlPanel = document.querySelector('.control-panel');
    const visualizationPanel = document.getElementById('visualization-panel');
    const alertOkBtn = document.getElementById('alertOk');
    const libSaveCancel = document.getElementById('libSaveCancel');
    const libSaveConfirm = document.getElementById('libSaveConfirm');
    const saveLibraryModal = document.getElementById('saveLibraryModal');
    const exportPngBtn = document.getElementById('exportPngBtn');
    const exportPngModal = document.getElementById('exportPngModal');
    const pngNameInput = document.getElementById('pngNameInput');
    const pngExportCancel = document.getElementById('pngExportCancel');
    const pngExportConfirm = document.getElementById('pngExportConfirm');
    const importImageBtn = document.getElementById('importImageBtn');
    const importImageInput = document.getElementById('importImageInput');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // NEW: AI Generator UI Elements
    const aiDescInput = document.getElementById('aiDescInput');
    const aiGenerateFromDescBtn = document.getElementById('aiGenerateFromDescBtn');
    const aiRegexInput = document.getElementById('aiRegexInput');
    const aiGenerateFromRegexBtn = document.getElementById('aiGenerateFromRegexBtn');


    if (libSaveCancel && saveLibraryModal) {
        libSaveCancel.addEventListener('click', () => {
            saveLibraryModal.style.display = 'none';
        });
    }
    if (libSaveConfirm) {
        libSaveConfirm.addEventListener('click', handleSaveWithMetadata);
    }
    document.querySelectorAll('.control-section summary').forEach(summary => {
        const icon = summary.querySelector('i');
        const nodeToWatch = icon || summary;
        nodeToWatch.addEventListener('click', (event) => {
            if (event.target.closest('i')) {
              event.preventDefault();
              const detailsEl = summary.parentElement;
              if (detailsEl && detailsEl.tagName === 'DETAILS') {
                  detailsEl.open = !detailsEl.open;
              }
            }
        });
    });

    if (alertOkBtn) {
        alertOkBtn.addEventListener('click', () => {
            const alertModal = document.getElementById('alertModal');
            if (alertModal) alertModal.style.display = 'none';
        });
    }
    
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
    if (visualizationPanel) visualizationPanel.addEventListener('click', closePanel);
    bindGlobalDrawerHandlers(closePanel);

    // FIX: Removed optional chaining from function definition
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
            renderAll();
        });
    });

    if (svg) {
        // 2. Canvas Click Listener
        svg.addEventListener('click', (e) => {
            if (e.target.closest('g[data-id]') || e.target.closest('.transition-label-text')) return;
            if (CURRENT_MODE === 'addclick') {
                const pt = svg.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                const ctm = svg.getScreenCTM();
                if (ctm) {
                    const svgP = pt.matrixTransform(ctm.inverse());
                    addState(svgP.x, svgP.y);
                }
            }
        });

        // 3. State Click Listener
        svg.addEventListener('click', (e) => {
            const stateGroup = e.target.closest('g[data-id]');
            if (!stateGroup) return;
            const stateId = stateGroup.dataset.id;
            const state = MACHINE.states.find(s => s.id === stateId);
            if (!state) return;
            e.stopPropagation();
            switch (CURRENT_MODE) {
                case 'transition':
                    {
                        if (TRANS_FROM === stateId) { 
                            showTransModal(TRANS_FROM, stateId);
                            document.querySelectorAll('.state-circle.state-selected').forEach(c => c.classList.remove('state-selected'));
                            setTransFrom(null);
                        } else if (!TRANS_FROM) {
                            setTransFrom(stateId);
                            const circle = stateGroup.querySelector('.state-circle');
                            if(circle) circle.classList.add('state-selected');
                        } else {
                            showTransModal(TRANS_FROM, stateId);
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
                case 'stateprops':
                    openPropsModal(stateId);
                    break;
            }
        });

        // 4. Transition Click Listener
        svg.addEventListener('click', (e) => {
            const label = e.target.closest('.transition-label-text');
            if (!label || CURRENT_MODE !== 'delete') return;

            e.stopPropagation(); 

            const from = label.dataset.from;
            const to = label.dataset.to;
            const symbol = label.dataset.symbol;

            if (symbol !== undefined) {
                deleteTransition(from, to, symbol);
            }
        });
    }
    
    // --- Modal Controls: Fixed with .onclick to prevent double-triggering ---
    
    if (document.getElementById('transCancel')) {
        document.getElementById('transCancel').onclick = hideTransModal;
    }

    if (document.getElementById('transSave')) {
        document.getElementById('transSave').onclick = (e) => {
            e.preventDefault(); 
            
            const from = document.getElementById('transFrom') ? document.getElementById('transFrom').value : null;
            const to = document.getElementById('transTo') ? document.getElementById('transTo').value : null;
            const symbolInput = document.getElementById('transSymbol');
            const rawSymbol = symbolInput ? symbolInput.value.trim() : '';
            const symbolValue = (rawSymbol === '' || rawSymbol.toLowerCase() === 'ε') ? '' : rawSymbol; 

            if (MACHINE.type === 'DFA' && symbolValue === '') {
                customAlert('Invalid Transition', 'DFA rule: ε-transitions are not allowed.');
                return;
            }
            
            const conflict = MACHINE.transitions.find(t => t.from === from && (t.symbol || '') === symbolValue);

            if (MACHINE.type === 'DFA' && conflict) {
                customAlert('Invalid Transition', `DFA rule: State ${from} is already deterministic on '${rawSymbol || 'ε'}'.`);
                return; 
            }
            
            pushUndo(updateUndoRedoButtons);
            MACHINE.transitions.push({ from, to, symbol: symbolValue });
            renderAll();
            hideTransModal();
        };
    }

    if (document.getElementById('propCancel')) {
        document.getElementById('propCancel').onclick = () => {
            const modal = document.getElementById('statePropsModal');
            if (modal) modal.style.display = 'none';
        };
    }

    if (document.getElementById('propSave')) {
        document.getElementById('propSave').onclick = () => {
            const modal = document.getElementById('statePropsModal');
            const stateId = modal ? modal.dataset.stateId : null;
            if (!stateId) return;

            const s = MACHINE.states.find(st => st.id === stateId);
            if (s) {
                pushUndo(updateUndoRedoButtons);
                const propInitial = document.getElementById('propInitial');
                const propFinal = document.getElementById('propFinal');
                
                const isInitial = propInitial ? propInitial.checked : false;
                const isAccepting = propFinal ? propFinal.checked : false;
                
                if (isInitial && (MACHINE.type === 'DFA')) {
                    MACHINE.states.forEach(x => x.initial = false);
                }
                s.initial = isInitial;
                s.accepting = isAccepting;
                enforceInitialStateRule();
                renderAll();
            }
            if (modal) modal.style.display = 'none';
        };
    }

    if (document.getElementById('renameCancel')) {
        document.getElementById('renameCancel').onclick = () => {
            const modal = document.getElementById('renameModal');
            if (modal) modal.style.display = 'none';
        };
    }

    if (document.getElementById('renameSave')) {
        document.getElementById('renameSave').onclick = () => {
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
            renderAll();
            if (modal) modal.style.display = 'none';
        };
    }

    if (document.getElementById('confirmClearCancel')) {
        document.getElementById('confirmClearCancel').onclick = () => {
            const modal = document.getElementById('confirmClearModal');
            if (modal) modal.style.display = 'none';
        };
    }

    if (document.getElementById('confirmClearConfirm')) {
        document.getElementById('confirmClearConfirm').onclick = () => {
            pushUndo(updateUndoRedoButtons);
            initializeState(updateUndoRedoButtons);
            renderAll();
            if (document.getElementById('confirmClearModal')) {
                document.getElementById('confirmClearModal').style.display = 'none';
            }
        };
    }
    if (exportPngBtn) {
        exportPngBtn.addEventListener('click', () => {
            const defaultName = `${MACHINE.type || 'automaton'}-export`;
            if(pngNameInput) pngNameInput.value = defaultName;
            const modal = document.getElementById('exportPngModal');
            if (modal) modal.style.display = 'flex';
            if(pngNameInput) {
                pngNameInput.focus();
                pngNameInput.select();
            }
        });
    }

    if (pngExportCancel) {
        pngExportCancel.addEventListener('click', () => {
            const modal = document.getElementById('exportPngModal');
            if (modal) modal.style.display = 'none';
        });
    }

    if (pngExportConfirm) {
        pngExportConfirm.addEventListener('click', () => {
            const filename = pngNameInput ? pngNameInput.value.trim() : null;
            if (filename) exportPng(filename);
            const modal = document.getElementById('exportPngModal');
            if (modal) modal.style.display = 'none';
        });
    }

    if (importImageBtn) {
        importImageBtn.addEventListener('click', () => {
            const input = document.getElementById('importImageInput');
            if (input) input.click();
        });
    }

    if (document.getElementById('importImageInput')) {
        document.getElementById('importImageInput').addEventListener('change', (e) => {
            handleImageUpload(e, updateUndoRedoButtons, showLoading, hideLoading);
        });
    }


    if (undoBtn) undoBtn.addEventListener('click', () => doUndo(updateUndoRedoButtons));
    if (redoBtn) redoBtn.addEventListener('click', () => doRedo(updateUndoRedoButtons));
    if (saveMachineBtn) saveMachineBtn.addEventListener('click', saveMachine);
    if (loadMachineBtn) loadMachineBtn.addEventListener('click', () => {
        const fileInput = document.getElementById('loadFileInput');
        if (fileInput) fileInput.click();
    });
    if(document.getElementById('loadFileInput')) document.getElementById('loadFileInput').addEventListener('change', (e) => loadMachine(e, updateUndoRedoButtons));
    if (clearCanvasBtn) clearCanvasBtn.addEventListener('click', () => {
        const confirmClearModal = document.getElementById('confirmClearModal');
        if (confirmClearModal) confirmClearModal.style.display = 'flex';
    });

    if (validateBtn) {
        validateBtn.addEventListener('click', () => {
            const result = validateAutomaton();
            setValidationMessage(result.message, result.type);
        });
    }

    if (modeSelect) {
        modeSelect.addEventListener('change', async () => {
            const newMode = modeSelect.value;

            if (newMode.includes('_TO_')) {
                const validationResult = validateAutomaton();
                if (validationResult.type === 'error') {
                    setValidationMessage('Cannot convert: the current automaton is invalid. Details: ' + validationResult.message, 'error');
                    modeSelect.value = MACHINE.type; 
                    return;
                }
                
                try {
                    modeSelect.disabled = true;
                    if (newMode === 'ENFA_TO_NFA') {
                        await animateEnfaToNfa(MACHINE, updateUndoRedoButtons);
                        modeSelect.value = 'NFA';
                    } else if (newMode === 'NFA_TO_DFA') {
                        await animateNfaToDfa(MACHINE, updateUndoRedoButtons);
                        modeSelect.value = 'DFA';
                    } else if (newMode === 'DFA_TO_MIN_DFA') {
                        await animateDfaToMinDfa(MACHINE, updateUndoRedoButtons);
                        modeSelect.value = 'DFA';
                    } else if (newMode === 'NFA_TO_MIN_DFA') {
                        await animateNfaToMinDfa(MACHINE, updateUndoRedoButtons);
                        modeSelect.value = 'DFA';
                    }
                    MACHINE.type = modeSelect.value;
                } catch (err) {
                    customAlert('Conversion Failed', err.message);
                    modeSelect.value = MACHINE.type;
                } finally {
                    modeSelect.disabled = false;
                }
            } else {
                MACHINE.type = newMode;
                renderAll();
            }
        });
    }

    if(runTestBtn) runTestBtn.addEventListener('click', () => runSimulation(testInput ? testInput.value : ''));
    if(genRandBtn) genRandBtn.addEventListener('click', () => {
        const alphabet = [...new Set(MACHINE.transitions.map(t => t.symbol).filter(s => s))]
        const effectiveAlphabet = alphabet.length > 0 ? alphabet : ['0', '1'];
        const len = Math.floor(Math.random() * 8) + 3;
        if(testInput) testInput.value = Array.from({ length: len }, () => effectiveAlphabet[Math.floor(Math.random() * effectiveAlphabet.length)]).join('');
    });
    if(stepNextBtn) stepNextBtn.addEventListener('click', () => showStep(++simState.index));
    if(stepPrevBtn) stepPrevBtn.addEventListener('click', () => showStep(--simState.index));
    if(stepResetBtn) stepResetBtn.addEventListener('click', () => {
        simState.index = 0;
        simState.steps.length = 0;
        if(simState.timer) clearTimeout(simState.timer);
        const stepLog = document.getElementById('stepLog');
        if (stepLog) stepLog.innerHTML = '';
        if (document.getElementById('testOutput')) document.getElementById('testOutput').textContent = 'Ready';
        renderAll();
    });

    if(genPracticeBtn) genPracticeBtn.addEventListener('click', () => {
        generatePractice();
        if(checkAnswerBtn) checkAnswerBtn.style.display = 'inline-flex';
    });
    if(showSolBtn) showSolBtn.addEventListener('click', () => showSolution(updateUndoRedoButtons));
    if(resetPracticeBtn) resetPracticeBtn.addEventListener('click', () => {
        resetPractice();
        if(checkAnswerBtn) checkAnswerBtn.style.display = 'none';
    });
    if(checkAnswerBtn) checkAnswerBtn.addEventListener('click', checkAnswer);
    
    // --- NEW: AI GENERATOR EVENT LISTENERS ---
    
    if (aiGenerateFromDescBtn) {
        aiGenerateFromDescBtn.addEventListener('click', () => {
            const promptText = aiDescInput ? aiDescInput.value.trim() : ''; 
            if (promptText) {
                handleAiGeneration(promptText, updateUndoRedoButtons, showLoading, hideLoading, false);
            } else {
      customAlert('Input Required', 'Please enter a description for the automaton.');
            }
        });
    }

    if (aiGenerateFromRegexBtn) {
        aiGenerateFromRegexBtn.addEventListener('click', () => {
            const promptText = aiRegexInput ? aiRegexInput.value.trim() : '';
            if (promptText) {
                handleAiGeneration(promptText, updateUndoRedoButtons, showLoading, hideLoading, true);
            } else {
                customAlert('Input Required', 'Please enter a regular expression.');
            }
        });
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

    // 2. Clear out the dynamically loaded FA studio content
    studioContent.innerHTML = '';
    
    // 3. Hide the main app container
    mainApp.style.display = 'none';

    // 4. Show the splash screen with an animation delay
    splashScreen.style.display = 'flex';
    setTimeout(() => {
        splashScreen.style.opacity = '1';
    }, 50);
}
    
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', handleBackToMenu);
    }

    // --- Zoom and Dragging Logic ---

    const setZoom = (pct) => {
        const wrapper = document.getElementById('svgWrapper');
        if(wrapper) {
            wrapper.style.transform = `scale(${pct / 100})`;
            wrapper.style.transformOrigin = 'top left';
        }
        if(zoomSlider) zoomSlider.value = pct;
    };
    if(zoomSlider) zoomSlider.addEventListener('input', e => setZoom(e.target.value));
    if(zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(Math.min(200, Number(zoomSlider.value) + 10)));
    if(zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(Math.max(50, Number(zoomSlider.value) - 10)));
    if(zoomResetBtn) zoomResetBtn.addEventListener('click', () => setZoom(100));
    setZoom(100);

    let dragging = false, currentStateG = null, dragOffsetX = 0, dragOffsetY = 0;

    function getPoint(evt) {
        const svg = document.getElementById('dfaSVG');
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
        e.preventDefault(); e.stopPropagation();
        const sObj = MACHINE.states.find(x => x.id === stateG.getAttribute('data-id'));
        if (!sObj) return;
        pushUndo(updateUndoRedoButtons);
        dragging = true; currentStateG = stateG;
        const p = getPoint(e);
        dragOffsetX = p.x - sObj.x; dragOffsetY = p.y - sObj.y;
        
        const circle = stateG.querySelector('circle');
        if(circle) circle.classList.add('state-selected');
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
        dragging = false;
        if(currentStateG) {
            const circle = currentStateG.querySelector('circle');
            if(circle) circle.classList.remove('state-selected');
        }
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
    
    document.getElementById('toggleFaLogicBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('faLogicModal');
    if (modal) {
        modal.style.display = 'flex';
        updateFaLogicDisplay(); 
        refreshLucideIcons();
    }
});

  // Inside initializeUI() in ui.js
document.getElementById('faExportTableBtn')?.addEventListener('click', () => {
    // Now directly available from top-level import
    exportFaTableToExcel(); 
});
    // 2. Hook into the render loop for dynamic sidebar roles
    const originalRender = renderAll;
    window.renderAll = () => {
        originalRender();
        if (typeof updateFaLogicDisplay === 'function') {
            updateFaLogicDisplay(); // Real-time sync of Initial/Accept/Trap badges
        }
    };
    // --- Initial Setup ---
    const toolbarIcon = document.querySelector('.toolbar-icon[data-mode="addclick"]');
    if (toolbarIcon) toolbarIcon.classList.add('active');
    
    if(svg) svg.className.baseVal = 'mode-addclick';
    
    // Initialize state logic
    initializeState(updateUndoRedoButtons);
    
    // Trigger the dynamic render loop for the first time
    window.renderAll(); 
    
    updateUndoRedoButtons();
    if(checkAnswerBtn) checkAnswerBtn.style.display = 'none';
    
    // Final icon generation for all dynamic elements
    if (loadingOverlay) refreshLucideIcons([loadingOverlay]);
}

function addState(x, y) {
    let maxId = -1;
    MACHINE.states.forEach(state => {
        if (state.id.startsWith('q')) {
            const num = parseInt(state.id.substring(1), 10);
            if (!isNaN(num) && num > maxId) maxId = num;
        }
    });
    const newId = 'q' + (maxId + 1);
    pushUndo(updateUndoRedoButtons);
    MACHINE.states.push({ id: newId, x, y, initial: MACHINE.states.length === 0, accepting: false });
    enforceInitialStateRule();
    renderAll();
    const stateG = document.querySelector(`g[data-id="${newId}"] circle`);
    if (stateG) {
        stateG.classList.add('state-drawing');
        setTimeout(() => stateG.classList.remove('state-drawing'), 600);
    }
}

function deleteState(id) {
    pushUndo(updateUndoRedoButtons);
    setMachine({
        ...MACHINE,
        states: MACHINE.states.filter(s => s.id !== id),
        transitions: MACHINE.transitions.filter(t => t.from !== id && t.to !== id)
    });
    enforceInitialStateRule();
    renderAll();
}

function deleteTransition(from, to, symbol) {
    pushUndo(updateUndoRedoButtons);
    const symbolToMatch = symbol === 'ε' ? '' : symbol;

    const indexToDelete = MACHINE.transitions.findIndex(t => 
        t.from === from && 
        t.to === to && 
        (t.symbol || '') === symbolToMatch
    );

    if (indexToDelete > -1) {
        MACHINE.transitions.splice(indexToDelete, 1);
        renderAll();
    }
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

function openPropsModal(stateId) {
    const modal = document.getElementById('statePropsModal');
    if (!modal) return;
    modal.dataset.stateId = stateId;
    const st = MACHINE.states.find(s => s.id === stateId);
    if (!st) return;
    if (document.getElementById('propInitial')) document.getElementById('propInitial').checked = st.initial;
    if (document.getElementById('propFinal')) document.getElementById('propFinal').checked = st.accepting;
    modal.style.display = 'flex';
}

function showTransModal(from, to) {
    const modal = document.getElementById('transitionModal');
    if (!modal) return;
    if (document.getElementById('transFrom')) document.getElementById('transFrom').value = from;
    if (document.getElementById('transTo')) document.getElementById('transTo').value = to;
    if (document.getElementById('transSymbol')) document.getElementById('transSymbol').value = '';
    modal.style.display = 'flex';
    if (document.getElementById('transSymbol')) document.getElementById('transSymbol').focus();
}

function hideTransModal() {
    if (document.getElementById('transitionModal')) {
        document.getElementById('transitionModal').style.display = 'none';
        
        // --- CRITICAL FIX: Block the immediate click event ---
        //blockCanvasClick = true;
        
        // Re-enable clicks after a short delay (e.g., 50ms)
        //setTimeout(() => {
           // blockCanvasClick = false;
        //}, 50);
    }
}


function enforceInitialStateRule() {
    if (!MACHINE || !Array.isArray(MACHINE.states)) return;
    if (MACHINE.states.length > 0 && !MACHINE.states.some(s => s.initial)) {
        MACHINE.states[0].initial = true;
    }
}
