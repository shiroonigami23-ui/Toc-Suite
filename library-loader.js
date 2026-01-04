import { animateMachineDrawing } from './animation.js';
import { addLogMessage } from './utils.js';

const LIB_URL = './library.json'; 

async function fetchLibrary() {
  try {
    const response = await fetch(LIB_URL);
    if (!response.ok) throw new Error("Library file not found");
    return await response.ok ? await response.json() : [];
  } catch (e) {
    console.error("Error fetching FA Library:", e);
    // Optional: Keep the EMBEDDED_LIB_JSON here as a fallback if fetch fails
    return JSON.parse(EMBEDDED_LIB_JSON); 
  }
}

/**
 * renderEntry
 * Generates a library item element for FA machines with construction 
 * animation and real-time logging.
 */
function renderEntry(entry) {
    const container = document.createElement('div');
    container.className = 'library-entry';
    // Applied standardized Architect styling for consistency
    container.style.padding = "10px";
    container.style.borderBottom = "1px solid #e2e8f0";

    const machineData = entry.machine || entry;
    const hasMachineData = machineData && machineData.states && machineData.states.length > 0;

    // Use Lucide icons: 'play-circle' for available machines, 'file-question' for empty ones
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:5px;">
            <div>
                <strong style="font-size:0.9em;">${entry.title || entry.id || 'Untitled'}</strong>
                <span class="library-entry-type" style="font-size:0.75em; color:var(--muted);">[${entry.type || 'N/A'}]</span>
            </div>
            <button class="icon-btn load-lib-btn" ${hasMachineData ? '' : 'disabled'} style="padding:4px 8px; font-size:0.8em;">
                <i data-lucide="${hasMachineData ? 'play-circle' : 'file-question'}"></i> 
                ${hasMachineData ? 'Open' : 'No Data'}
            </button>
        </div>
        <p style="font-size:0.8em; margin:0; color:#4a5568;">${entry.description || entry.sol || 'No description available.'}</p>
    `;

    const openBtn = container.querySelector('.load-lib-btn');

    if (hasMachineData) {
        openBtn.onclick = async () => {
            // 1. Log the start of the import process
            const { addLogMessage } = await import('./utils.js');
            addLogMessage(`Importing <strong>${entry.title || entry.id}</strong> from FA Library...`, 'library');
            
            // 2. Sync the UI Mode (DFA/NFA/ENFA)
            const modeSelect = document.getElementById('modeSelect');
            if (modeSelect) {
                modeSelect.value = entry.type || 'DFA';
            }

            // 3. Trigger the step-by-step construction animation
            const { animateMachineDrawing } = await import('./animation.js');
            const machineToLoad = { ...machineData, type: entry.type || 'DFA' };
            
            // This ensures the canvas builds visually rather than just popping in
            await animateMachineDrawing(machineToLoad);
            
            // 4. Final confirmation log
            addLogMessage("FA Machine construction complete.", 'check-circle');
        };
    }

    // Initialize the new icons for this specific element
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [container] });
    }

    return container;
}

async function refreshLibrary() {
  const listEl = document.getElementById('libraryList');
  const indicator = document.getElementById('libSyncIndicator');
  
  if (!listEl) return;
  listEl.innerHTML = '<div class="library-message">Loading library…</div>';
  
  // Set indicator to "Syncing" (Orange)
  if (indicator) indicator.style.background = '#f59e0b';

  const data = await fetchLibrary();
  
  if (!data || data.length === 0) {
    listEl.innerHTML = '<div class="library-message error">Failed to load library.json</div>';
    if (indicator) indicator.style.background = '#ef4444'; // Error (Red)
    return;
  }

  // Success: Set indicator to "Connected" (Green) with a pulse effect
  if (indicator) {
    indicator.style.background = '#10b981';
    indicator.style.boxShadow = '0 0 8px #10b981';
  }

  window._LIB_DATA = data;
  renderLibraryItems(data);
}

function renderLibraryItems(data) {
  const listEl = document.getElementById('libraryList');
  if (!listEl) return;
    
  listEl.innerHTML = '';
  const q = (document.getElementById('libSearch') || {value:''}).value.trim().toLowerCase();
  const f = (document.getElementById('libFilter') || {value:'all'}).value;
  const filtered = data.filter(entry => {
    if (f !== 'all' && entry.type !== f) return false;
    if (!q) return true;
    const hay = ((entry.title||'') + ' ' + (entry.id||'') + ' ' + (entry.description||'') + ' ' + ((entry.tags||[]).join(' '))).toLowerCase();
    return hay.includes(q);
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="library-message">No entries match.</div>';
    return;
  }
  filtered.forEach(entry => {
    const el = renderEntry(entry);
    listEl.appendChild(el);
  });
}

export function initializeLibrary() {
    const refreshBtn = document.getElementById('libRefresh');
    const search = document.getElementById('libSearch');
    const filter = document.getElementById('libFilter');
    
    if (refreshBtn) refreshBtn.onclick = refreshLibrary;
    
    if (search) search.oninput = () => renderLibraryItems(window._LIB_DATA || []);
    if (filter) filter.onchange = () => renderLibraryItems(window._LIB_DATA || []);

    refreshLibrary();
}