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

    if (typeof lucide !== 'undefined') {
        lucide.createIcons({
            nodes: [logEntry]
        });
    }
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
    window.addEventListener('keydown', (e) => {
        // Prevent shortcuts if user is typing in an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;

        // --- Core Studio Actions ---
        if (ctrl && key === 'z') { e.preventDefault(); clickIfExist(['undoBtn', 'pdaUndoBtn']); }
        if (ctrl && key === 'y') { e.preventDefault(); clickIfExist(['redoBtn', 'pdaRedoBtn']); }
        if (ctrl && key === 's') { e.preventDefault(); clickIfExist(['saveBtn', 'pdaSaveBtn', 'savePdaBtn']); }

        // --- Tool Switching (V = Pointer, S = State, T = Transition, D = Delete) ---
        if (key === 'v') clickIfExist(['pdaCursorTool', 'tool-move', 'pda-tool-move']);
        if (key === 's') clickIfExist(['pdaStateTool', 'tool-addclick', 'pda-tool-add']);
        if (key === 't') clickIfExist(['pdaTransitionTool', 'tool-transition', 'pda-tool-transition']);
        if (key === 'd') clickIfExist(['pdaDeleteTool', 'tool-delete', 'pda-tool-delete']);

        // --- Canvas Actions ---
        if (key === 'escape') clickIfExist(['pda-tool-clear', 'clearCanvasBtn']);
        if (key === 'enter') clickIfExist(['validateBtn', 'pda-tool-validate']);
    });
}

/**
 * Helper to click the first element found from a list of IDs.
 * Supports different ID naming conventions across FA and PDA studios.
 */
function clickIfExist(ids) {
    for (const id of ids) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.click();
            return;
        }
    }
}
/**
 * Displays a styled alert modal.
 * Exported for PDA/TM modules, attached to window for legacy FA/MM modules.
 */
export function customAlert(title, message) {
    const modal = document.getElementById('alertModal');
    const titleEl = document.getElementById('alertModalTitle');
    const msgEl = document.getElementById('alertModalMessage');

    if (!modal || !titleEl || !msgEl) {
        alert(`${title}: ${message}`);
        return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.style.display = 'flex';
}
window.customAlert = customAlert; // Keep legacy support