import { appUrl } from './paths.js';
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
    // Coalesce calls into one frame. A full-document request must never be dropped in favour of a
    // later, narrower one (that used to leave the FA toolbar icons blank).
    const q = window.__tocLucideQueue || (window.__tocLucideQueue = { all: false, nodes: [] });
    if (nodes && Array.isArray(nodes) && nodes.length) q.nodes.push(...nodes); else q.all = true;
    if (window.__tocLucideFrame) return;
    window.__tocLucideFrame = requestAnimationFrame(() => {
        const { all, nodes: list } = q;
        q.all = false; q.nodes = [];
        window.__tocLucideFrame = null;
        if (all) lucide.createIcons(); else lucide.createIcons({ nodes: list });
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
export const SHORTCUTS = [
    ['Ctrl/⌘ + Z', 'Undo'], ['Ctrl/⌘ + Y  or  Ctrl/⌘ + Shift + Z', 'Redo'],
    ['Ctrl/⌘ + S', 'Save machine as JSON'], ['Ctrl/⌘ + O', 'Open a JSON file'], ['Ctrl/⌘ + E', 'Export PNG'],
    ['S', 'Add-state tool'], ['V', 'Move tool'], ['T', 'Transition tool'], ['R', 'Rename tool'], ['P', 'State properties tool'], ['D', 'Delete tool'],
    ['Enter', 'Run the test input'], ['+  /  −  /  0', 'Zoom in / out / reset'],
    ['Shift + Delete', 'Clear the canvas (asks first)'], ['Esc', 'Close dialogs and the side panel'],
    ['Ctrl/⌘ + Alt + 1…5', 'Switch studio: FA, Mealy/Moore, PDA, TM, Grammar'], ['B', 'Automata Builder: describe any machine in words'], ['?', 'Show this list'],
];

function isVisible(el) {
    return !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
}

/** Closes the top-most open dialog (or the shortcuts sheet). Returns true if something closed. */
function closeTopDialog() {
    const sheet = document.getElementById('tocShortcutSheet');
    if (sheet) { sheet.remove(); return true; }
    const open = [...document.querySelectorAll('.modal-overlay, .modal, [role="dialog"]')]
        .filter(m => getComputedStyle(m).display !== 'none' && isVisible(m.firstElementChild || m));
    const top = open[open.length - 1];
    if (!top) return false;
    const closeBtn = top.querySelector('[data-close], .modal-close, .close-btn, button[id$="CloseBtn"], button[id$="CancelBtn"], button[id$="Cancel"]');
    if (closeBtn) closeBtn.click(); else top.style.display = 'none';
    return true;
}

export function showShortcutSheet() {
    if (document.getElementById('tocShortcutSheet')) return;
    const sheet = document.createElement('div');
    sheet.id = 'tocShortcutSheet';
    sheet.className = 'shortcut-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-label', 'Keyboard shortcuts');
    sheet.innerHTML = `<div class="shortcut-card"><div class="shortcut-head"><h3>Keyboard shortcuts</h3><button type="button" data-close aria-label="Close">✕</button></div>
      <dl>${SHORTCUTS.map(([k, v]) => `<dt>${k.split('  or  ').map(x => `<kbd>${x}</kbd>`).join(' or ')}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
    sheet.addEventListener('click', (e) => { if (e.target === sheet || e.target.closest('[data-close]')) sheet.remove(); });
    document.body.appendChild(sheet);
}

/**
 * Global keyboard shortcuts, shared by every studio. Buttons are found by id first and by the
 * toolbar's data-mode attribute second, so the same keys work in FA, Mealy/Moore, PDA and TM.
 */
export function initializeShortcuts() {
    if (window.__tocShortcutsInitialized) return;
    window.__tocShortcutsInitialized = true;

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;

        // Esc always works, even from a text field: close dialogs first, then the side panel.
        if (key === 'escape') {
            if (closeTopDialog()) { e.preventDefault(); return; }
            if (typeof window.__tocActiveDrawerClose === 'function') window.__tocActiveDrawerClose();
            return;
        }

        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;

        if (ctrl && key === 'z' && !e.shiftKey) { e.preventDefault(); clickIfExist(['undoBtn', 'tmUndoBtn', 'pdaUndoBtn']); return; }
        if (ctrl && (key === 'y' || (e.shiftKey && key === 'z'))) { e.preventDefault(); clickIfExist(['redoBtn', 'tmRedoBtn', 'pdaRedoBtn']); return; }
        if (ctrl && key === 's') { e.preventDefault(); clickIfExist(['saveMachineBtn', 'savePdaBtn', 'saveTmBtn']); return; }
        if (ctrl && key === 'o') { e.preventDefault(); clickIfExist(['loadMachineBtn', 'loadPdaBtn', 'loadTmBtn']); return; }
        if (ctrl && key === 'e') { e.preventDefault(); clickIfExist(['exportPngBtn', 'pdaExportPngBtn', 'tmExportPngBtn']); return; }
        if (ctrl && e.altKey && ['1', '2', '3', '4', '5'].includes(key)) { e.preventDefault(); triggerMachineShortcut(key); return; }
        if (ctrl || e.altKey) return;

        if (e.key === '?') { e.preventDefault(); showShortcutSheet(); return; }
        if (key === 'b' && window.TocBuilder) { e.preventDefault(); window.TocBuilder.open(); return; }
        if (e.shiftKey && (key === 'delete' || key === 'backspace')) {
            e.preventDefault();
            clickAction(['clearCanvasBtn', 'pda-tool-clear', 'tm-tool-clear'], ['.toolbar-icon[data-mode="clear"]']);
            return;
        }
        const tools = { s: 'addclick', v: 'move', t: 'transition', r: 'rename', p: 'stateprops', d: 'delete' };
        if (tools[key]) {
            const ids = { addclick: ['tool-addclick', 'pda-tool-add', 'tm-tool-add'], move: ['tool-move', 'tm-tool-move'],
                transition: ['tool-transition', 'tm-tool-trans'], rename: ['tool-rename'], stateprops: ['tool-stateprops', 'tm-tool-props'], delete: ['tool-delete', 'tm-tool-del'] }[tools[key]];
            clickAction(ids, [`.toolbar-icon[data-mode="${tools[key]}"]`]);
            return;
        }
        if (key === 'enter') { clickIfExist(['runTestBtn', 'pdaRunTestBtn', 'tmRunTestBtn']); return; }
        if (key === '+' || key === '=' || key === '-' || key === '_' || key === '0') {
            const slider = ['zoomSlider', 'pdaZoomSlider', 'tmZoomSlider'].map(id => document.getElementById(id)).find(isVisible);
            if (!slider) return;
            e.preventDefault();
            const v = key === '0' ? 100 : Math.max(50, Math.min(200, Number(slider.value) + ((key === '-' || key === '_') ? -10 : 10)));
            slider.value = v;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        }
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
        FA: appUrl('index.html#fa'),
        MM: appUrl('index.html#mm'),
        PDA: appUrl('index.html#pda'),
        TM: appUrl('index.html#tm'),
        Grammar: appUrl('pages/grammar_studio.html')
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


/** A file name that is valid on Windows, macOS, Linux, Android and iOS. */
export function safeFileName(name, fallback = 'automaton') {
    const cleaned = String(name || '').normalize('NFKD').toLowerCase()
        .replace(/[ε]/g, 'eps').replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 60);
    return cleaned || fallback;
}


/** Buttons of the dialogs that live in index.html and are shared by the FA and Mealy/Moore studios. */
export const SHARED_DIALOG_BUTTONS = ['libSaveCancel', 'libSaveConfirm', 'pngExportCancel', 'pngExportConfirm', 'confirmClearCancel',
    'confirmClearConfirm', 'propCancel', 'propSave', 'renameCancel', 'renameSave', 'transCancel', 'transSave',
    'mealyTransCancel', 'mealyTransSave', 'moorePropCancel', 'moorePropSave'];

/**
 * Removes every listener from the shared dialog buttons by swapping in clean clones. Each studio
 * calls this before wiring them, so switching FA → Mealy/Moore → FA never leaves the previous
 * studio's handlers attached (which used to save or export the wrong machine, or twice).
 */
export function resetSharedDialogButtons(ids = SHARED_DIALOG_BUTTONS) {
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.parentNode) el.replaceWith(el.cloneNode(true));
    }
}


/* ---------- Animation timing ----------
 * One place decides how long animations take, so every studio feels the same and the
 * "Animation speed" / "Reduce motion" settings apply everywhere.
 *   constructionDelay(steps): drawing a loaded machine; the whole drawing takes ~2.5 s at most.
 *   stepDelay(): one explained step of a conversion (ε-removal, subset construction, …).
 */
const SPEED_MS = { slow: 1500, normal: 700, fast: 250, instant: 0 };
export function animationSpeed() {
    try {
        if (document.body?.getAttribute('data-motion') === 'reduced') return 'instant';
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'instant';
        return localStorage.getItem('tocAnimSpeed') || 'normal';
    } catch (_e) { return 'normal'; }
}
export function stepDelay() { return SPEED_MS[animationSpeed()] ?? 700; }
export function constructionDelay(steps = 1) {
    const speed = animationSpeed();
    if (speed === 'instant') return 0;
    const budget = { slow: 6000, normal: 2500, fast: 1000 }[speed] ?? 2500;
    return Math.max(25, Math.min(speed === 'slow' ? 900 : 350, Math.round(budget / Math.max(1, steps))));
}


/** Opens the collapsed sidebar section that contains a live view (tape, stack), so a run is visible. */
export function revealLiveView(id) {
    const el = document.getElementById(id);
    const section = el?.closest('details');
    if (section && !section.open) section.open = true;
}
