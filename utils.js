/**
 * utils.js
 * Shared utility functions for all Automata Studio modules.
 */

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getModeLabel() {
    const select = document.getElementById('modeSelect');
    if (!select) return 'N/A';
    const val = select.value;
    const option = select.querySelector(`option[value="${val}"]`);
    return option ? option.textContent : val;
}

export function setValidationMessage(message, type) {
    const validationLine = document.getElementById('validationLine');
    if (!validationLine) return;
    validationLine.textContent = message;
    validationLine.className = 'validation-box';
    validationLine.classList.add(type, 'show');
    setTimeout(() => validationLine.classList.remove('show'), 5000);
}

/**
 * The single, canonical function for adding messages to the step log.
 * @param {string} message The HTML-enabled text to log.
 * @param {string} icon The name of the Lucide icon to use.
 */
export function addLogMessage(message, icon) {
    const log = document.getElementById('stepLog');
    if (!log) return;

    const logEntry = document.createElement('div');
    
    logEntry.innerHTML = `<i data-lucide="${icon}"></i> <div>${message}</div>`;
    
    if (log.firstChild) {
        log.insertBefore(logEntry, log.firstChild);
    } else {
        log.appendChild(logEntry);
    }

    refreshLucideIcons([logEntry]);
}

export function refreshLucideIcons(nodes = null) {
    if (typeof lucide === 'undefined' || typeof lucide.createIcons !== 'function') return;
    if (window.__tocLucideFrame) cancelAnimationFrame(window.__tocLucideFrame);
    window.__tocLucideFrame = requestAnimationFrame(() => {
        if (nodes && Array.isArray(nodes) && nodes.length) {
            lucide.createIcons({ nodes });
        } else {
            lucide.createIcons();
        }
        window.__tocLucideFrame = null;
    });
}

export function bindGlobalDrawerHandlers(closePanel) {
    if (typeof closePanel !== 'function') return;
    window.__tocActiveDrawerClose = closePanel;

    if (window.__tocDrawerGlobalsBound) return;
    window.__tocDrawerGlobalsBound = true;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && typeof window.__tocActiveDrawerClose === 'function') {
            window.__tocActiveDrawerClose();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && typeof window.__tocActiveDrawerClose === 'function') {
            window.__tocActiveDrawerClose();
        }
    });
}

/**
 * A wrapper around fetch to automatically retry on transient errors with exponential backoff.
 * @param {string} url The URL to fetch.
 * @param {object} options The fetch options.
 * @param {number} retries Number of retries left.
 * @returns {Promise<Response>} The fetch response.
 */
export async function fetchWithRetry(url, options, retries = 3) {
    const maxRetries = 3;
    try {
        const response = await fetch(url, options);
        if (response.status === 503 && retries > 0) {
            // Wait with exponential backoff and jitter
            const delay = (Math.pow(2, maxRetries - retries) + Math.random()) * 1000;
            // Do not log retries to the console as errors, it's expected behavior
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            const delay = (Math.pow(2, maxRetries - retries) + Math.random()) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1);
        } else {
            throw error;
        }
    }
}

/**
 * utils.js - Enhanced with Global Keyboard Shortcuts
 */

/**
 * Initializes keyboard shortcuts for the application.
 * Maps keys to specific button clicks based on the current studio context.
 */
export function initializeShortcuts() {
    if (window.__tocShortcutsInitialized) return;
    window.__tocShortcutsInitialized = true;

    window.addEventListener('keydown', (e) => {
        // Prevent shortcuts if user is typing in an input or textarea
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;

        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;

        // --- Core Studio Actions ---
        if (ctrl && key === 'z') {
            e.preventDefault();
            clickIfExist(['undoBtn', 'tmUndoBtn', 'pdaUndoBtn']);
        }
        if (ctrl && (key === 'y' || (e.shiftKey && key === 'z'))) {
            e.preventDefault();
            clickIfExist(['redoBtn', 'tmRedoBtn', 'pdaRedoBtn']);
        }
        if (ctrl && key === 's') {
            e.preventDefault();
            clickIfExist(['saveMachineBtn', 'savePdaBtn', 'saveTmBtn']);
        }
        if (ctrl && key === 'o') {
            e.preventDefault();
            clickIfExist(['loadMachineBtn', 'loadPdaBtn', 'loadTmBtn']);
        }
        if (ctrl && key === 'e') {
            e.preventDefault();
            clickIfExist(['exportPngBtn', 'pdaExportPngBtn', 'tmExportPngBtn']);
        }

        // --- Machine Switching ---
        if (ctrl && e.altKey && ['1', '2', '3', '4', '5'].includes(key)) {
            e.preventDefault();
            triggerMachineShortcut(key);
            return;
        }

        // --- Tool Switching (V = Pointer, S = State, T = Transition, D = Delete) ---
        if (!ctrl && key === 'v') clickAction(['tool-move', 'tm-tool-move'], ['.toolbar-icon[data-mode="move"]']);
        if (!ctrl && key === 's') clickAction(['tool-addclick', 'pda-tool-add', 'tm-tool-add'], ['.toolbar-icon[data-mode="addclick"]']);
        if (!ctrl && key === 't') clickAction(['tool-transition', 'tm-tool-trans'], ['.toolbar-icon[data-mode="transition"]']);
        if (!ctrl && key === 'd') clickAction(['tool-delete', 'tm-tool-del'], ['.toolbar-icon[data-mode="delete"]']);

        // --- Canvas Actions ---
        if (!ctrl && key === 'escape') clickIfExist(['clearCanvasBtn', 'pda-tool-clear', 'tm-tool-clear']);
        if (!ctrl && key === 'enter') clickIfExist(['runTestBtn', 'pdaRunTestBtn', 'tmRunTestBtn', 'validateBtn', 'tmValidateBtn']);
    });
}

/**
 * Helper to click the first element found from a list of IDs.
 * Supports different ID naming conventions across FA and PDA studios.
 */
function clickIfExist(ids) {
    for (const id of ids) {
        const btn = document.getElementById(id);
        if (btn && !btn.disabled) {
            btn.click();
            return true;
        }
    }
    return false;
}

function clickAction(ids, selectors = []) {
    if (clickIfExist(ids)) return;
    for (const selector of selectors) {
        const node = document.querySelector(selector);
        if (node && !node.disabled) {
            node.click();
            return;
        }
    }
}

function triggerMachineShortcut(key) {
    const machineByKey = {
        '1': 'FA',
        '2': 'MM',
        '3': 'PDA',
        '4': 'TM',
        '5': 'Grammar'
    };
    const target = machineByKey[key];
    if (!target) return;

    const buttonByTarget = {
        FA: 'switchToFaBtn',
        MM: 'switchToMmBtn',
        PDA: 'switchToPdaBtn',
        TM: 'switchToTmBtn',
        Grammar: 'switchToGrammarBtn'
    };
    if (clickIfExist([buttonByTarget[target]])) return;

    if (typeof window.openStudioByMachineType === 'function') {
        window.openStudioByMachineType(target);
        return;
    }

    const fallbackRoute = {
        FA: 'index.html#fa',
        MM: 'index.html#mm',
        PDA: 'index.html#pda',
        TM: 'index.html#tm',
        Grammar: 'grammar_studio.html'
    };
    const href = fallbackRoute[target];
    if (href) window.location.href = href;
}
/**
 * Displays a styled alert modal.
 * Exported for PDA/TM modules, attached to window for legacy FA/MM modules.
 */
export function customAlert(title, message) {
    const modal = document.getElementById('alertModal');
    const titleEl = document.getElementById('alertModalTitle');
    const msgEl = document.getElementById('alertModalMessage');
    const okBtn = document.getElementById('alertOk');

    if (!modal || !titleEl || !msgEl) {
        alert(`${title}: ${message}`);
        return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;

    // Ensure alert close behavior works in every studio (FA/MM/PDA/TM),
    // even if a specific UI module did not register modal listeners.
    if (okBtn && !okBtn.dataset.boundClose) {
        okBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        okBtn.dataset.boundClose = '1';
    }
    if (!modal.dataset.boundBackdropClose) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        modal.dataset.boundBackdropClose = '1';
    }

    modal.style.display = 'flex';
}
window.customAlert = customAlert; // Keep legacy support
