/**
 * tm_library_loader.js
 * Specialized library loader for the Turing Machine Studio.
 * Handles fetching, searching, and animated construction of TM designs.
 */

import { addLogMessage, customAlert } from './utils.js';
import { updateTapeUI } from './tm_visualizer.js';

// Note: You will need to create tm_animation.js modeled after pda_animation.js
// for the step-by-step construction effect.
const LIB_URL = './tm_library.json'; 

let libraryData = [];

/**
 * Initializes the TM Library UI listeners and performs initial fetch.
 */
export async function initializeTmLibrary() {
    const refreshBtn = document.getElementById('tmLibRefresh');
    const searchInput = document.getElementById('tmLibSearch');
    const filterSelect = document.getElementById('tmLibFilter'); // If added to HTML
    
    if (refreshBtn) refreshBtn.onclick = fetchLibrary;
    
    if (searchInput) {
        searchInput.oninput = () => {
            renderLibraryItems(searchInput.value.trim().toLowerCase());
        };
    }

    if (filterSelect) {
        filterSelect.onchange = () => {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            renderLibraryItems(query);
        };
    }

    await fetchLibrary();
}

/**
 * Fetches the library JSON and handles potential data format issues.
 */
async function fetchLibrary() {
    const listEl = document.getElementById('tmLibraryList');
    if (!listEl) return;
    
    listEl.innerHTML = `
        <div class="library-message">
            <i data-lucide="loader" class="state-animating"></i> Syncing TM Library...
        </div>`;
    if (window.lucide) lucide.createIcons({ nodes: [listEl] });

    try {
        const response = await fetch(LIB_URL);
        if (!response.ok) throw new Error("tm_library.json not found.");
        
        const rawData = await response.json();

        // Defensive check: Ensure libraryData is always an array
        libraryData = Array.isArray(rawData) ? rawData : [rawData];
        
        renderLibraryItems("");
    } catch (e) {
        console.error("TM Library Load Error:", e);
        listEl.innerHTML = '<div class="library-message error">Failed to load tm_library.json</div>';
    }
}

/**
 * Filters and renders the library entries.
 */
function renderLibraryItems(query) {
    const listEl = document.getElementById('tmLibraryList');
    if (!listEl) return;
    
    listEl.innerHTML = '';

    const filtered = libraryData.filter(entry => {
        const hay = `${entry.title} ${entry.description} ${entry.id}`.toLowerCase();
        return hay.includes(query);
    });

    if (filtered.length === 0) {
        listEl.innerHTML = '<div class="library-message">No matching TM designs found.</div>';
        return;
    }

    filtered.forEach(entry => {
        const el = createLibraryEntryEl(entry);
        listEl.appendChild(el);
    });
}

/**
 * Creates the DOM element for a single library entry.
 */
function createLibraryEntryEl(entry) {
    const container = document.createElement('div');
    container.className = 'library-entry';
    container.style.padding = "12px";
    container.style.borderBottom = "1px solid #e2e8f0";

    const machineData = entry.machine || entry;

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:6px;">
            <div>
                <strong style="font-size:0.95em; color:#065f46;">${entry.title || entry.id}</strong>
                <span style="font-size:0.75em; color:var(--muted); margin-left:4px;">[TM]</span>
            </div>
            <button class="icon-btn load-lib-btn" style="padding:4px 10px; font-size:0.8em; background:#ecfdf5; border-color:#10b981; color:#047857;">
                <i data-lucide="play-circle"></i> Open
            </button>
        </div>
        <p style="font-size:0.8em; margin:0; color:#4a5568; line-height:1.4;">${entry.description || 'No description available.'}</p>
    `;

    const openBtn = container.querySelector('.load-lib-btn');
    openBtn.onclick = async () => {
        addLogMessage(`Loading <strong>${entry.title}</strong> into the Architect Engine...`, 'library');
        
        // 1. Synchronize the Blank Symbol Setting
        const blankInput = document.getElementById('tmBlankInput');
        if (blankInput && machineData.blankSymbol) {
            blankInput.value = machineData.blankSymbol;
        }

        // 2. Clear and Reset the Tape Visualizer
        const initialBlank = machineData.blankSymbol || 'B';
        updateTapeUI([[initialBlank]], [0]);

        // 3. Trigger Construction Animation
        // Dynamic import to handle the animation module
        try {
            const { animateTmDrawing } = await import('./tm_animation.js');
            await animateTmDrawing(machineData);
            addLogMessage("Turing Machine construction complete.", 'check-circle');
            customAlert("Library Load Success", `${entry.title} is now active.`);
        } catch (err) {
            console.warn("Animation module not found, falling back to instant load.");
            const { setMachine } = await import('./tm_state.js');
            setMachine(machineData);
        }
    };

    if (window.lucide) lucide.createIcons({ nodes: [container] });
    return container;
}
