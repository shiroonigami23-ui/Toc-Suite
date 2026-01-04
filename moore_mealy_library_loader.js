import { animateMachineDrawing } from './animation.js';

const LIB_URL = './moore_mealy_library.json';

async function fetchLibrary() {
  try {
    const response = await fetch(LIB_URL);
    if (!response.ok) throw new Error("MM Library not found");
    return await response.json();
  } catch (e) {
    console.error("Error fetching MM Library:", e);
    return []; // Return empty array so it doesn't crash
  }
}

/**
 * renderEntry
 * Generates an interactive library item for Mealy and Moore machines.
 * Fixed to ensure machines persist in global state after construction.
 */
function renderEntry(entry) {
    const container = document.createElement('div');
    container.className = 'library-entry';
    container.style.padding = "12px";
    container.style.borderBottom = "1px solid #e2e8f0";

    const machineData = entry.machine || entry;
    const hasMachineData = machineData && machineData.states && machineData.states.length > 0;
    
    // Extract alphabets for display
    const inputAlpha = (machineData.alphabet || []).join(', ');
    const outputAlpha = (machineData.output_alphabet || []).join(', ');

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:6px;">
            <div>
                <strong style="font-size:0.95em;">${entry.title || 'Untitled Design'}</strong>
                <span class="library-entry-type" style="font-size:0.75em; color:var(--muted); margin-left:4px;">[${entry.type}]</span>
                <div class="kv" style="font-size:10px; margin-top:2px;">
                    &Sigma;: {${inputAlpha || '&Oslash;'}}, &Gamma;: {${outputAlpha || '&Oslash;'}}
                </div>
            </div>
            <button class="icon-btn load-lib-btn" ${hasMachineData ? '' : 'disabled'} style="padding:4px 10px; font-size:0.8em;">
                <i data-lucide="${hasMachineData ? 'play-circle' : 'file-question'}"></i> 
                ${hasMachineData ? 'Open' : 'No Data'}
            </button>
        </div>
        <p style="font-size:0.8em; margin:0; color:#4a5568; line-height:1.4;">${entry.description || 'No description available.'}</p>
    `;

    const openBtn = container.querySelector('.load-lib-btn');

    if (hasMachineData) {
        openBtn.onclick = async () => {
            // 1. Dynamic logging and State setup
            const { addLogMessage } = await import('./utils.js');
            const { setMachine } = await import('./moore_mealy_state.js'); //
            
            addLogMessage(`Initializing <strong>${entry.title}</strong> (${entry.type} Machine)...`, 'library');
            
            // 2. Sync the UI "Mode Select" dropdown
            const modeSelect = document.getElementById('modeSelect');
            if (modeSelect) {
                modeSelect.value = entry.type;
            }

            // 3. ARCHITECTURAL FIX: Set the global MACHINE state
            // This ensures that tool changes don't wipe the "ghost" animation
            const machineToLoad = { 
                ...machineData, 
                type: entry.type || 'MEALY' 
            };
            setMachine(machineToLoad); //
            
            // 4. Trigger construction animation
            // The renderer will now find data in the global MACHINE object
            await animateMachineDrawing(machineToLoad);
            
            // 5. Final render pass to ensure UI and Canvas are 100% in sync
            if (typeof renderAll === 'function') {
                renderAll(); //
            }
            
            addLogMessage(`${entry.type} construction complete. System ready.`, 'check-circle');
        };
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [container] });
    }

    return container;
}

    // Refresh Lucide icons for this specific container
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [container] });
    }

    return container;
}

function renderLibraryItems(data) {
  const listEl = document.getElementById('libraryList');
  if (!listEl) return;
    
  // Re-check for elements inside the dynamically loaded UI
  const search = document.getElementById('libSearch');
  const filter = document.getElementById('libFilter');
    
  listEl.innerHTML = '';
  const q = (search || {value:''}).value.trim().toLowerCase();
  const f = (filter || {value:'all'}).value;
  
  const filtered = data.filter(entry => {
    const typeMatch = entry.type === 'MEALY' || entry.type === 'MOORE';
    if (!typeMatch) return false;

    if (f !== 'all' && entry.type !== f) return false;
    
    if (!q) return true;
    const hay = ((entry.title||'') + ' ' + (entry.description||'')).toLowerCase();
    return hay.includes(q);
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="library-message">No Mealy/Moore entries found.</div>';
    return;
  }
  filtered.forEach(entry => {
    const el = renderEntry(entry);
    listEl.appendChild(el);
  });
}

export async function initializeLibrary() {
    const refreshBtn = document.getElementById('libRefresh');
    const search = document.getElementById('libSearch');
    const filter = document.getElementById('libFilter');
    
    const data = await fetchLibrary();
    window._MM_LIB_DATA = data;

    if (refreshBtn) refreshBtn.onclick = async () => {
        renderLibraryItems(window._MM_LIB_DATA);
    };

    if (search) search.oninput = () => renderLibraryItems(window._MM_LIB_DATA || []);
    if (filter) filter.onchange = () => renderLibraryItems(window._MM_LIB_DATA || []);

    renderLibraryItems(data);
}
