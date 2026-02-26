import * as FA from './ui.js';
import * as FA_STATE from './state.js';
import * as FA_RENDER from './renderer.js';
import * as MM from './moore_mealy_ui.js';
import * as MM_STATE from './moore_mealy_state.js';
import * as MM_RENDER from './moore_mealy_renderer.js';
import * as FA_FILE from './file.js';
import * as MM_FILE from './moore_mealy_file.js';
import * as FA_LIB from './library-loader.js';
import * as MM_LIB from './moore_mealy_library_loader.js';
import { initializeShortcuts, refreshLucideIcons } from './utils.js';
import { consumePendingImportedMachine } from './machine_router.js';

function buildMachineSwitchButtons(currentStudio) {
    const current = String(currentStudio || '').toUpperCase();
    const mkBtn = (id, label, target) => {
        const isCurrent = current === target;
        return `
            <button id="${id}" class="icon-btn machine-switch-btn" data-machine-switch="${target}" type="button" ${isCurrent ? 'disabled' : ''}>
                ${label}
            </button>
        `;
    };

    return `
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px;">
            ${mkBtn('switchToFaBtn', 'FA Studio', 'FA')}
            ${mkBtn('switchToMmBtn', 'Mealy/Moore', 'MM')}
            ${mkBtn('switchToPdaBtn', 'PDA Studio', 'PDA')}
            ${mkBtn('switchToTmBtn', 'TM Studio', 'TM')}
        </div>
        <button id="switchToGrammarBtn" class="icon-btn machine-switch-btn" data-machine-switch="Grammar" type="button" style="width:100%;margin-bottom:10px;" ${current === 'GRAMMAR' ? 'disabled' : ''}>
            Grammar Studio
        </button>
    `;
}


// --- Context Object for Dynamic Switching ---
export const StudioContext = {
    current: 'FA',
    get MACHINE() { return this.current === 'FA' ? FA_STATE.MACHINE : MM_STATE.MACHINE; },
    get initializeState() { return this.current === 'FA' ? FA_STATE.initializeState : MM_STATE.initializeState; },
    get initializeUI() { return this.current === 'FA' ? FA.initializeUI : MM.initializeUI; },
    get updateUndoRedoButtons() { 
        return this.current === 'FA' ? FA.updateUndoRedoButtons : MM.updateUndoRedoButtons; 
    },
    // The state setter function is needed by external modules like file.js
    get setMachine() { return this.current === 'FA' ? FA_STATE.setMachine : MM_STATE.setMachine; },
    get setRenderFunction() { return this.current === 'FA' ? FA_STATE.setRenderFunction : MM_STATE.setRenderFunction; },
    get renderAll() { return this.current === 'FA' ? FA_RENDER.renderAll : MM_RENDER.renderAll; },
    
    // File/Library Handlers - Passed the context's update function
    get handleSaveMachine() { return this.current === 'FA' ? FA_FILE.saveMachine : MM_FILE.handleSaveMachine; },
    // FIX: Load Machine must be fully dynamic, passing the context's button updater
    get loadMachine() { 
        const loadFn = this.current === 'FA' ? FA_FILE.loadMachine : MM_FILE.loadMachine;
        return (e) => loadFn(e, this.updateUndoRedoButtons);
    },
    get initializeLibrary() { return this.current === 'FA' ? FA_LIB.initializeLibrary : MM_LIB.initializeLibrary; },
    
    // HTML Content Getter
    getHtmlContent: function(target) {
        return target === 'FA' ? this.faHtml() : this.mmHtml();
    },
    
      // --- Inside StudioContext object in unified_main.js ---

    // Anonymous function property for FA HTML
    faHtml: function() {
        return `
    <div class="app-container" role="application" aria-label="Finite Automata Practice Studio">
      <header class="header">
        <h1>Finite Automata Practice</h1>
        <button id="panelToggleBtn" class="panel-toggle-btn" type="button">
            <i data-lucide="menu"></i>
        </button>
      </header>
      <main class="main-content">
        <aside id="controlPanel" class="control-panel" aria-label="Controls">
          <details class="control-section">
            <summary>
                <i data-lucide="sliders-horizontal"></i>
                <span>Mode & Interaction</span>
            </summary>
            <div class="control-section-content">
              <div style="display:flex;gap:8px;">
                <select id="modeSelect" aria-label="Mode select">
                  <option value="DFA">DFA</option>
                  <option value="NFA">NFA</option>
                  <option value="ENFA">ε-NFA</option>
                  <option value="ENFA_TO_NFA">ε-NFA → NFA</option>
                  <option value="NFA_TO_DFA">NFA → DFA</option>
                  <option value="NFA_TO_MIN_DFA">NFA → Minimal DFA</option>
                  <option value="DFA_TO_MIN_DFA">DFA → Minimal DFA</option>
                </select>
              </div>
            </div>
          </details>
          <details class="control-section" open>
  <summary><i data-lucide="brain-circuit" style="color: #6366f1;"></i> <span>Machine Intelligence</span></summary>
  <div class="control-section-content" style="display: flex; flex-direction: column; gap: 12px;">
    <div class="intel-block">
      <div style="font-size: 0.75em; font-weight: bold; margin-bottom: 5px; color: #64748b; display: flex; align-items: center; gap: 5px;">
        <i data-lucide="info" style="width: 12px; color: #6366f1;"></i> STATE ROLES
      </div>
      <div id="faDynamicLegend" class="legend-flex" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
    </div>
    <button id="toggleFaLogicBtn" class="icon-btn" style="width: 100%; font-size: 0.8em; background: #eef2ff; border: 1px solid #e0e7ff; color: #3730a3;">
      <i data-lucide="table-2" style="width: 14px; color: #6366f1;"></i> View Transition Table
    </button>
  </div>
</details>
          <details class="control-section">
            <summary>
                <i data-lucide="puzzle"></i>
                <span>Practice Generator</span>
            </summary>
            <div class="control-section-content">
              <div style="margin-bottom:12px">
                <div style="display:flex;gap:8px">
                  <select id="practiceMode" style="flex:1;">
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="easy">Easy</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button class="icon-btn" id="genPracticeBtn" type="button">Generate</button>
                </div>
                <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
                  <button class="icon-btn" id="showSolBtn" type="button">Show Solution</button>
                  <button class="icon-btn" id="resetPractice" type="button">Reset</button>
                  <button class="icon-btn" id="checkAnswerBtn" type="button">Check Answer</button>
                </div>
                <div id="practiceBox">No practice generated yet.</div>
              </div>
            </div>
          </details>
          <details class="control-section">
            <summary>
                <i data-lucide="flask-conical"></i>
                <span>Testing</span>
            </summary>
             <div class="control-section-content">
              <div class="controls-group">
                <div class="test-panel">
                  <div class="input"><input id="testInput" placeholder="Enter string (e.g., abbab)" /></div>
                  <button id="runTestBtn" class="run-btn" type="button">Run</button>
                </div>
                <div id="randomStringBox">
                  <i data-lucide="dice-5"></i> <button id="genRandBtn" class="icon-btn" type="button">Random</button>
                </div>
                <details id="testOptionsCollapse">
                  <summary><i data-lucide="settings-2"></i> Simulation Options</summary>
                  <div id="testOptions">
                    <label><input type="radio" name="simMode" value="auto" checked>
                      Auto</label>
                    <label><input type="radio" name="simMode" value="manual"> Manual</label>
                    <label>Speed:
                      <select id="testSpeed">
                        <option value="500">Fast</option>
                        <option value="1500" selected>Normal</option>
                        <option value="2500">Slow</option>
                      </select>
                    </label>
                    <div id="manualButtons" style="display:none;">
                      <button id="stepPrev" class="icon-btn" type="button">◀ Prev</button>
                      <button id="stepNext" class="icon-btn" type="button">Next ▶</button>
                      <button id="stepReset" class="icon-btn" type="button">⟲ Reset</button>
                    </div>
                  </div>
                </details>
                <div id="testOutput" class="output-display">Ready</div>
              </div>
            
              <div style="border-top:1px solid #e6eef8;margin-top:12px;padding-top:12px;">
                <details id="bulkTestSection">
                  <summary><i data-lucide="test-tubes"></i> Bulk Testing</summary>
                  <div>
                    <textarea id="bulkTestInput" placeholder="Enter test strings (one per line)..."></textarea>
                    <button id="bulkRunBtn" class="icon-btn" style="width:100%; margin-top: 8px;" type="button">Run Bulk Test</button>
                    <div id="bulkTestOutput">
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </details>
          <details class="control-section">
            <summary>
                <i data-lucide="folder"></i>
                <span>File</span>
            </summary>
            <div class="control-section-content">
              <div class="control-row">
                <button id="saveMachineBtn" title="Save machine (JSON)" type="button"><i data-lucide="save"></i> Save</button>
                <button id="loadMachineBtn" title="Load machine (JSON)" type="button"><i data-lucide="folder-open"></i> Load</button>
              </div>
              <div class="control-row">
                <button id="exportPngBtn" title="Export canvas as PNG" type="button"><i data-lucide="image"></i> Export PNG</button>
              </div>
              <input type="file" id="loadFileInput" accept=".json" style="display:none" />
              <input type="file" id="importImageInput" accept="image/*" style="display:none" />
            </div>
          </details>
          
          <details class="control-section" id="librarySection">
            <summary>
                <i data-lucide="library"></i>
                <span>Library</span>
            </summary>
            <div class="control-section-content">
              <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
                <input id="libSearch" placeholder="Search..." />
                <select id="libFilter">
                  <option value="all">All Types</option>
                  <option value="DFA">DFA</option>
                  <option value="NFA">NFA</option>
                  <option value="ENFA">ε-NFA</option>
                </select>
                <button id="libRefresh" class="icon-btn" title="Refresh library" type="button"><i data-lucide="refresh-cw"></i></button>
              </div>
              <div id="libraryList">
                <div>Library empty — click Refresh to load.</div>
              </div>
            </div>
          </details>
          
          <details class="control-section" open>
            <summary>
                <i data-lucide="home"></i>
                <span>Navigation</span>
            </summary>
            <div class="control-section-content">
              ${buildMachineSwitchButtons('FA')}
              <button id="backToMenuBtn" class="icon-btn" style="width:100%;">
                <i data-lucide="arrow-left-circle"></i> Back to Main Menu
              </button>
            </div>
          </details>
        </aside>
        
        <div class="main-column">
            <section id="visualization-panel" class="visualization-panel" aria-label="Visualization" style="position: relative;">
              <div class="visualization-header" style="display:flex;align-items:center;gap:12px;">
                <div style="flex:1"><strong>Automata Visualization</strong>
                  <div class="kv">Mode: <span id="modeLabel">DFA</span></div>
                </div>
              </div>
              <div class="canvas-wrapper" id="canvasWrapper">
                <div class="canvas-top">
                  <div class="canvas-toolbar" role="toolbar" aria-label="Canvas toolbar">
                    <div class="toolbar-icon" id="tool-addclick" title="Add state on canvas click" data-mode="addclick"><i
                        data-lucide="plus-circle"></i></div>
                    <div class="toolbar-icon" id="tool-move" title="Move states" data-mode="move"><i data-lucide="move"
                        ></i></div>
                    <div class="toolbar-icon" id="tool-transition" title="Add transition" data-mode="transition"><i
                        data-lucide="git-branch"></i></div>
                    <div class="toolbar-icon" id="tool-rename" title="Rename state" data-mode="rename"><i
                        data-lucide="edit-3"></i></div>
                    <div class="toolbar-icon" id="tool-delete" title="Delete state/transition" data-mode="delete"><i
                        data-lucide="trash-2"></i></div>
                    <div class="toolbar-icon" id="tool-stateprops" title="Set state properties" data-mode="stateprops"><i
                        data-lucide="settings"></i></div>
    
                    <button id="validateBtn" class="toolbar-icon" title="Validate Automaton" style="margin-left:8px" type="button"><i
                        data-lucide="check-circle"></i></button>
    
                    <div class="toolbar-icon" id="clearCanvasBtn" title="Clear Canvas"><i data-lucide="file-x"></i></div>
    
                    <div id="validationLine" class="validation-box"></div>
    
                    <button id="undoBtn" class="toolbar-icon" title="Undo" style="margin-left:auto;" type="button"><i
                        data-lucide="corner-up-left"></i></button>
                    <button id="redoBtn" class="toolbar-icon" title="Redo" type="button"><i data-lucide="corner-up-right"></i></button>
                  </div>
                </div>
                <div class="canvas-area">
                  <div class="svg-canvas" id="svgWrapper" tabindex="0">
                    <svg id="dfaSVG" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg" role="img"
                      aria-label="Automaton canvas">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#667eea" />
                        </marker>
                        <marker id="arrowhead-export" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
                        </marker>
                      </defs>
                      <g id="edges"></g>
                      <g id="states"></g>
                      <text id="canvasHint" x="700" y="420" text-anchor="middle" fill="#9aa6b2" font-size="18">Tap canvas to
                        add a state (use ➕ tool)</text>
                    </svg>
                  </div>
                </div>
              </div>
    
              <div class="zoom-controls" style="position: absolute; right: 30px; top: 150px; z-index: 50;">
    <input id="zoomSlider" type="range" min="50" max="200" value="100" />
    <button id="zoomResetBtn" class="toolbar-icon" title="Reset Zoom" type="button"><i data-lucide="refresh-ccw"></i></button>
</div>
            </section>
            
            <div id="stepLog">Step log appears here.</div>
        </div>
        
      </main>
    </div>
   <div id="faLogicModal" class="modal-overlay" style="display:none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
  <div class="modal-box" style="width: 80%; max-width: 750px; background: white; border-radius: 12px; padding: 25px; max-height: 85vh; overflow-y: auto;">
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">
      <h3 style="margin: 0; display: flex; align-items: center; gap: 8px; color: #3730a3;">
        <i data-lucide="table-2" style="color: #6366f1;"></i> FA Logic Explorer
      </h3>
      
      <div style="display: flex; gap: 12px; align-items: center;">
        <button id="faExportTableBtn" class="icon-btn" style="background: #eef2ff; border: 1px solid #6366f1; color: #3730a3; font-size: 0.85em; padding: 6px 15px; border-radius: 8px; font-weight: 700;">
            <i data-lucide="download" style="width: 16px;"></i> Export
        </button>
        
        <button onclick="document.getElementById('faLogicModal').style.display='none'" style="border:none; background:none; cursor:pointer; font-size:1.5rem; color: #64748b;">&times;</button>
      </div>
    </div>
    
    <div style="overflow-x: auto; border-radius: 8px; border: 1px solid #e2e8f0;">
      <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.9em;">
        <thead style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; position: sticky; top: 0;">
          <tr>
            <th style="padding: 12px; text-align: left; color: #475569;">From (Status)</th>
            <th style="padding: 12px; color: #475569;">Input (σ)</th>
            <th style="padding: 12px; text-align: right; color: #475569;">To (Status)</th>
          </tr>
        </thead>
        <tbody id="faLogicTableBody" style="color: #1e293b;"></tbody>
      </table>
    </div>
  </div>
</div>
`;
    },
    // Anonymous function property for MM HTML
    mmHtml: function() {
        return `
    <div class="app-container" role="application" aria-label="Mealy and Moore Machine Practice Studio">
      <header class="header" style="background: linear-gradient(90deg, #ff9800, #ff5722);">
        <h1>Mealy/Moore Machine Studio</h1>
        <button id="panelToggleBtn" class="panel-toggle-btn" type="button">
            <i data-lucide="menu"></i>
        </button>
      </header>
      <main class="main-content">
        <aside id="controlPanel" class="control-panel" aria-label="Controls">
          <details class="control-section">
            <summary>
                <i data-lucide="sliders-horizontal"></i>
                <span>Mode & Interaction</span>
            </summary>
            <div class="control-section-content">
              <div style="display:flex;gap:8px;">
<select id="modeSelect" aria-label="Mode select">
  <option value="MOORE">Moore Machine</option>
  <option value="MEALY">Mealy Machine</option>
  <option value="MOORE_TO_MEALY">Moore → Mealy</option>
  <option value="MEALY_TO_MOORE">Mealy → Moore</option> </select>
              </div>
            </div>
          </details>
          <details class="control-section" open>
  <summary>
    <i data-lucide="brain-circuit" style="color: #ff9800;"></i> 
    <span>Machine Intelligence</span>
  </summary>
  <div class="control-section-content" style="display: flex; flex-direction: column; gap: 12px;">
    
    <div class="intel-block">
      <div style="font-size: 0.75em; font-weight: bold; margin-bottom: 5px; color: #64748b; display: flex; align-items: center; gap: 5px;">
        <i data-lucide="activity" style="width: 12px; color: #ff9800;"></i> LIVE I/O TRACE
      </div>
      <div id="mmTraceDisplay" style="padding: 10px; border: 1px solid #e2e8f0; background: #fdfaf6; border-radius: 8px; min-height: 40px; font-family: monospace; font-size: 0.85em; color: #ff5722;">
        Input: <span id="traceInput">...</span><br>
        Output: <span id="traceOutput" style="font-weight:bold;">...</span>
      </div>
    </div>

    <div class="intel-block">
      <div style="font-size: 0.75em; font-weight: bold; margin-bottom: 5px; color: #64748b; display: flex; align-items: center; gap: 5px;">
        <i data-lucide="info" style="width: 12px; color: #ff9800;"></i> STATE ROLES
      </div>
      <div id="mmDynamicLegend" class="legend-flex" style="display: flex; flex-wrap: wrap; gap: 6px;">
        </div>
    </div>

    <button id="toggleMmLogicBtn" class="icon-btn" style="width: 100%; font-size: 0.8em; background: #fff7ed; border: 1px solid #ffedd5; color: #9a3412;">
      <i data-lucide="table-2" style="width: 14px; color: #ff9800;"></i> View Logic Table
    </button>
  </div>
</details>
          <details class="control-section">
            <summary>
                <i data-lucide="puzzle"></i>
                <span>Practice Generator</span>
            </summary>
            <div class="control-section-content">
              <div style="margin-bottom:12px">
                <div style="display:flex;gap:8px">
                  <select id="practiceMode" style="flex:1;">
                    <option value="easy">Easy</option>
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button class="icon-btn" id="genPracticeBtn" type="button">Generate</button>
                </div>
                <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
                  <button class="icon-btn" id="showSolBtn" type="button">Show Solution</button>
                  <button class="icon-btn" id="resetPractice" type="button">Reset</button>
                  <button class="icon-btn" id="checkAnswerBtn" type="button">Check Answer</button>
                </div>
                <div id="practiceBox">No practice generated yet.</div>
              </div>
            </div>
          </details>
          <details class="control-section">
            <summary>
                <i data-lucide="flask-conical"></i>
                <span>Testing (I/O Trace)</span>
            </summary>
             <div class="control-section-content">
              <div class="controls-group">
                <div class="test-panel">
                  <div class="input"><input id="testInput" placeholder="Enter input string (e.g., 0101)" /></div>
                  <button id="runTestBtn" class="run-btn" type="button">Run</button>
                </div>
                <div id="randomStringBox">
                  <i data-lucide="dice-5"></i> <button id="genRandBtn" class="icon-btn" type="button">Random</button>
                </div>
                <details id="testOptionsCollapse">
                  <summary><i data-lucide="settings-2"></i> Simulation Options</summary>
                  <div id="testOptions">
                    <label><input type="radio" name="simMode" value="auto" checked> Auto</label>
                    <label><input type="radio" name="simMode" value="manual"> Manual</label>
                    <label>Speed:
                      <select id="testSpeed">
                        <option value="500">Fast</option>
                        <option value="1500" selected>Normal</option>
                        <option value="2500">Slow</option>
                      </select>
                    </label>
                    <div id="manualButtons" style="display:none;">
                      <button id="stepPrev" class="icon-btn" type="button">◀ Prev</button>
                      <button id="stepNext" class="icon-btn" type="button">Next ▶</button>
                      <button id="stepReset" class="icon-btn" type="button">⟲ Reset</button>
                    </div>
                  </div>
                </details>
                <div id="testOutput" class="output-display">Ready</div>
              </div>
            
              <div style="border-top:1px solid #e6eef8;margin-top:12px;padding-top:12px;">
                <details id="bulkTestSection">
                  <summary><i data-lucide="test-tubes"></i> Bulk Testing</summary>
                  <div>
                      <textarea id="bulkTestInput" placeholder="Enter input strings (one per line)..."></textarea>
                    <button id="bulkRunBtn" class="icon-btn" style="width:100%; margin-top: 8px;" type="button">Run Bulk Test</button>
                    <div id="bulkTestOutput"></div>
                  </div>
                </details>
              </div>
            </div>
          </details>
          <details class="control-section">
            <summary>
                <i data-lucide="folder"></i>
                <span>File</span>
            </summary>
     <div class="control-section-content">
       <div class="control-row">
                <button id="saveMachineBtn" title="Save machine (JSON)" type="button"><i data-lucide="save"></i> Save</button>
                <button id="loadMachineBtn" title="Load machine (JSON)" type="button"><i data-lucide="folder-open"></i> Load</button>
              </div>
              <div class="control-row">
                <button id="exportPngBtn" title="Export canvas as PNG" type="button"><i data-lucide="image"></i> Export PNG</button>
              </div>
              <input type="file" id="loadFileInput" accept=".json" style="display:none" />
              <input type="file" id="importImageInput" accept="image/*" style="display:none" />
            </div>
          </details>
          
          
          <details class="control-section" id="librarySection">
            <summary>
                <i data-lucide="library"></i>
                <span>Library</span>
            </summary>
            <div class="control-section-content">
              <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
                <input id="libSearch" placeholder="Search..." />
                <select id="libFilter">
                  <option value="all">All Types</option>
                  <option value="MOORE">Moore</option>
                  <option value="MEALY">Mealy</option>
                </select>
                <button id="libRefresh" class="icon-btn" title="Refresh library" type="button"><i data-lucide="refresh-cw"></i></button>
              </div>
              <div id="libraryList">
                <div>Library empty — click Refresh to load.</div>
              </div>
            </div>
          </details>
          
          <details class="control-section" open>
            <summary>
                <i data-lucide="home"></i>
                <span>Navigation</span>
            </summary>
            <div class="control-section-content">
              ${buildMachineSwitchButtons('MM')}
              <button id="backToMenuBtn" class="icon-btn" style="width:100%;">
                <i data-lucide="arrow-left-circle"></i> Back to Main Menu
              </button>
            </div>
          </details>
        </aside>
        
        <div class="main-column">
            <section id="visualization-panel" class="visualization-panel" aria-label="Visualization" style="position: relative;">
              <div class="visualization-header" style="display:flex;align-items:center;gap:12px;">
                <div style="flex:1"><strong>Automata Visualization</strong>
                  <div class="kv">Mode: <span id="modeLabel">Moore Machine</span></div>
                </div>
              </div>
              <div class="canvas-wrapper" id="canvasWrapper">
                <div class="canvas-top">
                  <div class="canvas-toolbar" role="toolbar" aria-label="Canvas toolbar">
                    <div class="toolbar-icon" id="tool-addclick" title="Add state on canvas click" data-mode="addclick"><i
                        data-lucide="plus-circle"></i></div>
                    <div class="toolbar-icon" id="tool-move" title="Move states" data-mode="move"><i data-lucide="move"
                        ></i></div>
                    <div class="toolbar-icon" id="tool-transition" title="Add transition" data-mode="transition"><i
                        data-lucide="git-branch"></i></div>
                    <div class="toolbar-icon" id="tool-rename" title="Rename state" data-mode="rename"><i
                        data-lucide="edit-3"></i></div>
                    <div class="toolbar-icon" id="tool-delete" title="Delete state/transition" data-mode="delete"><i
                        data-lucide="trash-2"></i></div>
                    <div class="toolbar-icon" id="tool-stateprops" title="Set state properties" data-mode="stateprops"><i
                        data-lucide="settings"></i></div>
    
                    <button id="validateBtn" class="toolbar-icon" title="Validate Automaton" style="margin-left:8px" type="button"><i
                        data-lucide="check-circle"></i></button>
    
                    <div class="toolbar-icon" id="clearCanvasBtn" title="Clear Canvas"><i data-lucide="file-x"></i></div>
    
                    <div id="validationLine" class="validation-box"></div>
    
                    <button id="undoBtn" class="toolbar-icon" title="Undo" style="margin-left:auto;" type="button"><i
                        data-lucide="corner-up-left"></i></button>
                    <button id="redoBtn" class="toolbar-icon" title="Redo" type="button"><i data-lucide="corner-up-right"></i></button>
                  </div>
                </div>
                <div class="canvas-area">
                  <div class="svg-canvas" id="svgWrapper" tabindex="0">
                    <svg id="dfaSVG" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg" role="img"
                      aria-label="Automaton canvas">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#ff9800" />
                        </marker>
                        <marker id="arrowhead-export" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
                        </marker>
                      </defs>
                      <g id="edges"></g>
                      <g id="states"></g>
                      <text id="canvasHint" x="700" y="420" text-anchor="middle" fill="#9aa6b2" font-size="18">Tap canvas to
                        add a state (use ➕ tool)</text>
                    </svg>
                  </div>
                </div>
              </div>
    
              <div class="zoom-controls" style="position: absolute; right: 30px; top: 150px; z-index: 50;">
    <input id="zoomSlider" type="range" min="50" max="200" value="100" />
    <button id="zoomResetBtn" class="toolbar-icon" title="Reset Zoom" type="button"><i data-lucide="refresh-ccw"></i></button>
</div>
            </section>
            
            <div id="stepLog">I/O Trace steps appear here.</div>
        </div>
        
      </main>
    </div>

   <div id="mmLogicModal" class="modal-overlay" style="display:none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); z-index: 2000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
    <div class="modal-box" style="width: 85%; max-width: 900px; background: white; border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; background: #fff7ed; border-bottom: 2px solid #ffedd5;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #ff9800; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="table-2" style="color: white; width: 20px; height: 20px;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; color: #7c2d12; font-size: 1.2rem;">Transition & Output Logic</h3>
                    <div id="mmDynamicLegend" style="display: flex; gap: 10px; margin-top: 4px;">
                        </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: center;">
                <button id="mmExportTableBtn" class="btn" style="background: white; border: 1px solid #ff9800; color: #9a3412; font-size: 0.85em; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                    <i data-lucide="download" style="width: 16px;"></i> Export CSV
                </button>
                <button onclick="document.getElementById('mmLogicModal').style.display='none'" style="background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b;">&times;</button>
            </div>
        </div>
        
        <div style="padding: 20px 30px 30px;">
            <div style="overflow-y: auto; max-height: 60vh; border-radius: 12px; border: 1px solid #ffedd5; background: white;">
                <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.95em;">
                    <thead style="background: #fdfaf6; border-bottom: 2px solid #ffedd5; position: sticky; top: 0; z-index: 10;">
                        <tr id="mmLogicTableHeaderRow">
                            </tr>
                    </thead>
                    <tbody id="mmLogicTableBody" style="color: #431407;">
                        </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;
    },
    
    // The state setter function is needed by external modules like file.js
    get setMachine() { return this.current === 'FA' ? FA_STATE.setMachine : MM_STATE.setMachine; },
    
};

const STORAGE_KEYS = {
    studentName: 'tocStudentName',
    studentYear: 'tocStudentYear',
    studentSection: 'tocStudentSection',
    studentBranch: 'tocStudentBranch',
    studentRoll: 'tocStudentRoll',
    theme: 'tocTheme',
    fontScale: 'tocFontScale',
    motion: 'tocMotion',
    autoResume: 'tocAutoResume',
    lastStudio: 'tocLastStudio'
};
const SNAPSHOT_KEYS = {
    fa: 'tocCanvasSnapshotFaV1',
    mm: 'tocCanvasSnapshotMmV1',
    pda: 'tocCanvasSnapshotPdaV1',
    tm: 'tocCanvasSnapshotTmV1'
};
const PROMPT_KEYS = {
    mm: 'tocPendingMmPromptV1',
    tm: 'tocPendingTmPromptV1'
};
const SESSION_KEYS = {
    activeRoute: 'tocActiveRoute'
};

const THEME_COLORS = {
    default: '#4a90e2',
    ocean: '#0284c7',
    forest: '#15803d',
    sunset: '#ea580c'
};

function applyTheme(theme = 'default') {
    const safeTheme = THEME_COLORS[theme] ? theme : 'default';
    document.body.setAttribute('data-theme', safeTheme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', THEME_COLORS[safeTheme]);
}

function applyFontScale(scale = 'normal') {
    const safeScale = ['normal', 'large', 'xlarge'].includes(scale) ? scale : 'normal';
    document.documentElement.setAttribute('data-font-scale', safeScale);
}

function applyMotionPreference(mode = 'normal') {
    const safeMode = mode === 'reduced' ? 'reduced' : 'normal';
    document.body.setAttribute('data-motion', safeMode);
}

function applyStoredPreferences() {
    applyTheme(safeStorageGet(STORAGE_KEYS.theme, 'default') || 'default');
    applyFontScale(safeStorageGet(STORAGE_KEYS.fontScale, 'normal') || 'normal');
    applyMotionPreference(safeStorageGet(STORAGE_KEYS.motion, 'normal') || 'normal');
}

function safeStorageGet(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value ?? fallback;
    } catch (_e) {
        return fallback;
    }
}

function safeStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (_e) {
        return false;
    }
}

function safeStorageRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch (_e) {}
}

function consumeStorageValue(key) {
    try {
        const value = localStorage.getItem(key);
        if (value == null) return null;
        localStorage.removeItem(key);
        return value;
    } catch (_e) {
        return null;
    }
}

function safeSessionGet(key, fallback = null) {
    try {
        const value = sessionStorage.getItem(key);
        return value ?? fallback;
    } catch (_e) {
        return fallback;
    }
}

function safeSessionSet(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (_e) {}
}

function safeSessionRemove(key) {
    try {
        sessionStorage.removeItem(key);
    } catch (_e) {}
}

const ROUTE_HASH = {
    splash: '',
    fa: '#fa',
    mm: '#mm',
    pda: '#pda',
    tm: '#tm',
    grammar: '#grammar'
};

function setRouteHash(hash) {
    const safeHash = String(hash || '');
    if (window.location.hash !== safeHash) {
        history.replaceState({}, '', `${window.location.pathname}${safeHash}`);
    }
}

function setActiveRoute(route) {
    const safeRoute = String(route || 'splash').toLowerCase();
    safeSessionSet(SESSION_KEYS.activeRoute, safeRoute);
    if (safeRoute === 'fa') setRouteHash(ROUTE_HASH.fa);
    if (safeRoute === 'mm') setRouteHash(ROUTE_HASH.mm);
    if (safeRoute === 'pda') setRouteHash(ROUTE_HASH.pda);
    if (safeRoute === 'tm') setRouteHash(ROUTE_HASH.tm);
    if (safeRoute === 'grammar') setRouteHash(ROUTE_HASH.grammar);
    if (safeRoute === 'splash') setRouteHash(ROUTE_HASH.splash);
}

function clearActiveRoute() {
    safeSessionRemove(SESSION_KEYS.activeRoute);
    setRouteHash(ROUTE_HASH.splash);
}

const studioRuntime = {
    pdaState: null,
    tmState: null
};

let machineAutosaveTimer = null;

function cloneMachineSnapshot(machine) {
    try {
        return JSON.parse(JSON.stringify(machine || null));
    } catch (_e) {
        return null;
    }
}

function hasGraph(machine) {
    return Boolean(machine && Array.isArray(machine.states) && Array.isArray(machine.transitions));
}

function loadSnapshot(route) {
    const key = SNAPSHOT_KEYS[String(route || '').toLowerCase()];
    if (!key) return null;
    try {
        const raw = safeStorageGet(key, '');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return hasGraph(parsed?.machine) ? parsed.machine : null;
    } catch (_e) {
        safeStorageRemove(key);
        return null;
    }
}

function saveSnapshot(route, machine) {
    const key = SNAPSHOT_KEYS[String(route || '').toLowerCase()];
    if (!key || !hasGraph(machine)) return false;
    return safeStorageSet(key, JSON.stringify({
        ts: Date.now(),
        machine: cloneMachineSnapshot(machine)
    }));
}

function currentStudioRoute() {
    const cur = String(StudioContext.current || '').toUpperCase();
    if (cur === 'FA') return 'fa';
    if (cur === 'MM') return 'mm';
    if (cur === 'PDA') return 'pda';
    if (cur === 'TURING' || cur === 'TM') return 'tm';
    return null;
}

async function getCurrentStudioMachine() {
    const route = currentStudioRoute();
    if (route === 'fa') return cloneMachineSnapshot(FA_STATE.MACHINE);
    if (route === 'mm') return cloneMachineSnapshot(MM_STATE.MACHINE);
    if (route === 'pda') {
        if (!studioRuntime.pdaState) {
            try { studioRuntime.pdaState = await import('./pda_state.js'); } catch (_e) {}
        }
        return cloneMachineSnapshot(studioRuntime.pdaState?.MACHINE);
    }
    if (route === 'tm') {
        if (!studioRuntime.tmState) {
            try { studioRuntime.tmState = await import('./tm_state.js'); } catch (_e) {}
        }
        return cloneMachineSnapshot(studioRuntime.tmState?.MACHINE);
    }
    return null;
}

async function persistCurrentStudioSnapshot() {
    const route = currentStudioRoute();
    if (!route) return false;
    const machine = await getCurrentStudioMachine();
    if (!hasGraph(machine)) return false;
    return saveSnapshot(route, machine);
}

function startAutosaveLoop() {
    if (machineAutosaveTimer) return;
    machineAutosaveTimer = setInterval(() => {
        persistCurrentStudioSnapshot().catch(() => {});
    }, 3000);
}

function prependStudioHint(message) {
    const text = String(message || '').trim();
    if (!text) return;
    const log = document.getElementById('stepLog');
    if (!log) return;
    const note = document.createElement('div');
    note.style.cssText = 'padding:8px 10px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;margin-bottom:8px;font-size:0.85rem;';
    note.textContent = text;
    if (log.firstChild) {
        log.insertBefore(note, log.firstChild);
    } else {
        log.appendChild(note);
    }
}

function hydratePendingPrompt(route) {
    const safeRoute = String(route || '').toLowerCase();
    if (safeRoute === 'mm') {
        const prompt = consumeStorageValue(PROMPT_KEYS.mm);
        if (prompt) {
            prependStudioHint(prompt);
        }
        return;
    }
    if (safeRoute === 'tm') {
        const prompt = consumeStorageValue(PROMPT_KEYS.tm);
        if (!prompt) return;
        const input = document.getElementById('tmTestInput');
        if (input && !input.value) {
            input.value = prompt;
        }
        prependStudioHint(prompt);
    }
}

function hideSplash() {
    const splashScreen = document.getElementById('splashScreen');
    if (!splashScreen) return;
    splashScreen.style.opacity = '0';
    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 250);
}

function showSplash() {
    const splashScreen = document.getElementById('splashScreen');
    if (!splashScreen) return;
    splashScreen.style.display = 'flex';
    void splashScreen.offsetWidth;
    splashScreen.style.opacity = '1';
    clearActiveRoute();
}

function getSavedStudentName() {
    return safeStorageGet(STORAGE_KEYS.studentName, 'Student') || 'Student';
}

function getSavedStudentMeta() {
    const roll = (safeStorageGet('tocAuthRoll', '') || '').trim();
    const email = (safeStorageGet('tocAuthEmail', '') || '').trim();
    const parts = [roll ? `Roll ${roll}` : '', email || ''].filter(Boolean);
    return parts.join(' | ');
}

function updateSplashWelcomeName() {
    const welcomeEl = document.getElementById('splashStudentWelcome');
    if (welcomeEl) {
        const meta = getSavedStudentMeta();
        welcomeEl.textContent = meta
            ? `Welcome, ${getSavedStudentName()} (${meta})`
            : `Welcome, ${getSavedStudentName()}`;
    }
}

async function renderSplashAssignmentHint() {
    const splash = document.getElementById('splashScreen');
    const shell = splash?.querySelector('.splash-shell');
    if (!splash) return;
    const esc = (v) => String(v ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    let panel = document.getElementById('splashAssignmentPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'splashAssignmentPanel';
        panel.style.cssText = 'width:100%;display:flex;flex-direction:column;gap:10px;margin-top:4px;';
        (shell || splash).appendChild(panel);
    }
    panel.innerHTML = '<div id="splashAssignmentHint" style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.25);padding:8px 12px;border-radius:999px;font-size:0.9rem;display:inline-block;align-self:center;">Checking active assignments...</div>';
    const hint = document.getElementById('splashAssignmentHint');
    try {
        const res = await fetch('/.netlify/functions/list-active-assignments?machineType=ALL');
        if (!res.ok) {
            hint.textContent = 'Assignments unavailable right now.';
            return;
        }
        const list = await res.json();
        if (!Array.isArray(list) || !list.length) {
            hint.textContent = 'No active quiz/practice right now.';
            return;
        }
        const quizCount = list.filter(a => a.assignment_mode === 'quiz').length;
        const practiceCount = list.filter(a => a.assignment_mode === 'practice').length;
        hint.textContent = `Active: ${quizCount} quiz, ${practiceCount} practice`;

        const cards = document.createElement('div');
        cards.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;';
        list.slice(0, 6).forEach((asg) => {
            const machine = String(asg.machine_type || 'FA').toUpperCase();
            const mode = String(asg.assignment_mode || 'practice').toLowerCase();
            const starts = asg.start_at ? new Date(asg.start_at).toLocaleString() : 'Now';
            const ends = asg.end_at ? new Date(asg.end_at).toLocaleString() : 'No deadline';
            const marks = Number(asg.max_marks || 100);
            const safeTitle = esc(asg.title || 'Untitled');
            const safePrompt = esc(asg.prompt || '');
            const rawTitle = encodeURIComponent(String(asg.title || ''));
            const card = document.createElement('div');
            card.style.cssText = 'background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.28);border-radius:12px;padding:12px;text-align:left;';
            card.innerHTML = `
                <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">
                    <strong style="font-size:1rem;">${safeTitle}</strong>
                    <span style="font-size:0.75rem;padding:2px 8px;border-radius:999px;background:${mode === 'quiz' ? 'rgba(239,68,68,.25)' : 'rgba(16,185,129,.25)'};">${mode.toUpperCase()}</span>
                </div>
                <div style="font-size:0.82rem;opacity:0.95;margin-top:4px;">Machine: ${esc(machine)} | Marks: ${marks}</div>
                <div style="font-size:0.8rem;opacity:0.85;margin-top:2px;">Window: ${esc(starts)} to ${esc(ends)}</div>
                <div style="font-size:0.82rem;opacity:0.95;margin-top:8px;max-height:44px;overflow:hidden;">${safePrompt}</div>
                <button data-assignment-id="${Number(asg.id)}" data-machine="${esc(machine)}" data-mode="${esc(mode)}" data-title="${rawTitle}" style="margin-top:10px;width:100%;padding:9px 10px;border:none;border-radius:8px;background:#fff;color:#1e293b;font-weight:700;cursor:pointer;">Open ${esc(machine)} Studio</button>
            `;
            cards.appendChild(card);
        });
        panel.appendChild(cards);
        cards.querySelectorAll('button[data-assignment-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const assignmentId = btn.getAttribute('data-assignment-id') || '';
                const machine = btn.getAttribute('data-machine') || 'FA';
                const mode = btn.getAttribute('data-mode') || 'practice';
                const title = decodeURIComponent(btn.getAttribute('data-title') || '');
                safeStorageSet('tocPreferredAssignmentId', assignmentId);
                safeStorageSet('tocPreferredAssignmentMode', mode);
                safeStorageSet('tocPreferredAssignmentTitle', title);
                openStudioByMachineType(machine);
            });
        });
    } catch (_e) {
        hint.textContent = 'Assignments unavailable right now.';
    }
}

async function openStudioByMachineType(machineType) {
    await persistCurrentStudioSnapshot();
    const machine = String(machineType || 'FA').toUpperCase();
    if (machine === 'GRAMMAR') {
        setActiveRoute('grammar');
        window.location.href = 'grammar_studio.html';
        return;
    }
    if (machine === 'PDA') {
        loadPdaStudio();
        return;
    }
    if (machine === 'TM' || machine === 'TURING') {
        loadTmStudio();
        return;
    }
    const target = machine === 'MM' ? 'MM' : 'FA';
    hideSplash();
    setTimeout(() => loadStudio(target), 250);
}

function setupSplashUtility() {
    const helpModal = document.getElementById('splashHelpModal');
    const settingsModal = document.getElementById('splashSettingsModal');
    const openHelpBtn = document.getElementById('openHelpBtn');
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const helpTitle = document.getElementById('helpStepTitle');
    const helpContent = document.getElementById('helpStepContent');
    const helpCounter = document.getElementById('helpStepCounter');
    const helpPrevBtn = document.getElementById('helpPrevBtn');
    const helpNextBtn = document.getElementById('helpNextBtn');
    const helpCloseBtn = document.getElementById('helpCloseBtn');
    const settingsCancelBtn = document.getElementById('settingsCancelBtn');
    const settingsSaveBtn = document.getElementById('settingsSaveBtn');
    const studentNameInput = document.getElementById('studentNameInput');
    const themeSelect = document.getElementById('themeSelect');

    const openModal = (modal) => { if (modal) modal.style.display = 'flex'; };
    const closeModal = (modal) => { if (modal) modal.style.display = 'none'; };

    const helpSteps = [
        {
            title: 'Step 1: Pick a Studio',
            content: 'Choose FA, Mealy/Moore, PDA, or Turing Machine based on your topic. You can return anytime using Back to Main Menu.'
        },
        {
            title: 'Step 2: Use Canvas Tools',
            content: 'Use Add, Move, Transition, Rename, Delete, and State Properties from the toolbar. On phone, open controls from the menu button.'
        },
        {
            title: 'Step 3: Practice + Testing',
            content: 'Generate practice questions, run manual/auto simulation, and use bulk testing to validate many strings quickly.'
        },
        {
            title: 'Step 4: Save and Share',
            content: 'Save machine JSON, export PNG, and submit to review workflows. Netlify functions can store submissions in Neon and push approved files to GitHub.'
        },
        {
            title: 'Step 5: Keyboard Shortcuts',
            content: 'Ctrl/Cmd+S save, Ctrl/Cmd+O load, Ctrl/Cmd+E export PNG, Ctrl/Cmd+Z undo, Ctrl/Cmd+Y redo, V move, S add state, T transition, D delete, Enter run/validate, Esc clear, Ctrl+Alt+1..5 switch FA/MM/PDA/TM/Grammar.'
        }
    ];

    let helpIndex = 0;
    const renderHelpStep = () => {
        const step = helpSteps[helpIndex];
        if (!step || !helpTitle || !helpContent || !helpCounter) return;
        helpTitle.textContent = step.title;
        helpContent.textContent = step.content;
        helpCounter.textContent = `${helpIndex + 1}/${helpSteps.length}`;
        if (helpPrevBtn) helpPrevBtn.disabled = helpIndex === 0;
        if (helpNextBtn) helpNextBtn.textContent = helpIndex === helpSteps.length - 1 ? 'Finish' : 'Next';
    };

    openHelpBtn?.addEventListener('click', () => {
        helpIndex = 0;
        renderHelpStep();
        openModal(helpModal);
    });
    helpPrevBtn?.addEventListener('click', () => {
        helpIndex = Math.max(0, helpIndex - 1);
        renderHelpStep();
    });
    helpNextBtn?.addEventListener('click', () => {
        if (helpIndex >= helpSteps.length - 1) {
            closeModal(helpModal);
            return;
        }
        helpIndex += 1;
        renderHelpStep();
    });
    helpCloseBtn?.addEventListener('click', () => closeModal(helpModal));

    openSettingsBtn?.addEventListener('click', () => {
        if (studentNameInput) studentNameInput.value = getSavedStudentName();
        if (themeSelect) themeSelect.value = safeStorageGet(STORAGE_KEYS.theme, 'default') || 'default';
        openModal(settingsModal);
    });
    settingsCancelBtn?.addEventListener('click', () => closeModal(settingsModal));
    settingsSaveBtn?.addEventListener('click', () => {
        const studentName = (studentNameInput?.value || '').trim() || 'Student';
        const selectedTheme = themeSelect?.value || 'default';
        safeStorageSet(STORAGE_KEYS.studentName, studentName);
        safeStorageSet(STORAGE_KEYS.theme, selectedTheme);
        applyTheme(selectedTheme);
        updateSplashWelcomeName();
        closeModal(settingsModal);
    });

    [helpModal, settingsModal].forEach((modal) => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        closeModal(helpModal);
        closeModal(settingsModal);
    });

    // Run state hydration after listeners are attached, so UI remains interactive
    // even if storage is unavailable in the current browser context.
    updateSplashWelcomeName();
    const savedTheme = safeStorageGet(STORAGE_KEYS.theme, 'default') || 'default';
    applyTheme(savedTheme);
    if (themeSelect) themeSelect.value = savedTheme;
    if (studentNameInput) studentNameInput.value = getSavedStudentName();
}

try {
    applyStoredPreferences();
} catch (_e) {
    applyTheme('default');
    applyFontScale('normal');
    applyMotionPreference('normal');
}


/**
 * Dynamically loads the studio HTML content and initializes the appropriate scripts.
 * @param {'FA' | 'MM'} target The studio to load.
 */
function loadStudio(target) {
    const studioContent = document.getElementById('studioContent');
    const mainApp = document.getElementById('mainApp');
    const splashScreen = document.getElementById('splashScreen');
    if (!studioContent || !mainApp) {
        console.error("Critical DOM element #studioContent or #mainApp missing.");
        return;
    }
    if (splashScreen && splashScreen.style.display !== 'none') {
        hideSplash();
    }
    mainApp.style.display = 'block';
    
    const htmlContent = StudioContext.getHtmlContent(target);
    studioContent.innerHTML = htmlContent;
    
    StudioContext.current = target;
    safeStorageSet(STORAGE_KEYS.lastStudio, target);
    setActiveRoute(target === 'MM' ? 'mm' : 'fa');
    
    setTimeout(() => {
        refreshLucideIcons();
        
        // 1. Set the correct render function pointer in the state module
        StudioContext.setRenderFunction(StudioContext.renderAll);
        
        // 2. Initialize state (which calls updateUndoRedoButtons via context)
        StudioContext.initializeState(StudioContext.updateUndoRedoButtons);
        
        // 3. Initialize UI (hooks up click handlers)
        StudioContext.initializeUI();
        
        // --- 4. FIX: Initialize Library (This was missing) ---
        if (typeof StudioContext.initializeLibrary === 'function') {
            StudioContext.initializeLibrary(); 
        }
        
        // 5. Final render
        StudioContext.renderAll();

        const route = target === 'MM' ? 'mm' : 'fa';
        const pending = consumePendingImportedMachine(route);
        if (pending) {
            if (target === 'MM' && typeof MM_FILE.loadMachineFromObject === 'function') {
                MM_FILE.loadMachineFromObject(pending, StudioContext.updateUndoRedoButtons, pending.type || 'MOORE');
            } else if (target === 'FA' && typeof FA_FILE.loadMachineFromObject === 'function') {
                FA_FILE.loadMachineFromObject(pending, StudioContext.updateUndoRedoButtons, pending.type || 'DFA');
            }
        } else {
            const snapshot = loadSnapshot(route);
            if (snapshot) {
                if (target === 'MM' && typeof MM_FILE.loadMachineFromObject === 'function') {
                    MM_FILE.loadMachineFromObject(snapshot, StudioContext.updateUndoRedoButtons, snapshot.type || 'MOORE');
                } else if (target === 'FA' && typeof FA_FILE.loadMachineFromObject === 'function') {
                    FA_FILE.loadMachineFromObject(snapshot, StudioContext.updateUndoRedoButtons, snapshot.type || 'DFA');
                }
            }
        }

        hydratePendingPrompt(route);
    }, 50); 
}

const studioWarmCache = {
    started: false,
    pdaHtml: null,
    tmHtml: null,
    pdaModule: null,
    tmModule: null,
    pdaState: null,
    tmState: null
};

function fetchHtmlText(path) {
    return fetch(path).then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to fetch ${path} (${response.status})`);
        }
        return response.text();
    });
}

function warmupSpecializedStudios() {
    if (studioWarmCache.started) return;
    studioWarmCache.started = true;

    const kickoff = () => {
        studioWarmCache.pdaHtml ??= fetchHtmlText('pda_studio.html');
        studioWarmCache.tmHtml ??= fetchHtmlText('tm_studio.html');
        studioWarmCache.pdaModule ??= import('./pda_main.js');
        studioWarmCache.tmModule ??= import('./tm_main.js');
        studioWarmCache.pdaState ??= import('./pda_state.js');
        studioWarmCache.tmState ??= import('./tm_state.js');
    };

    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(kickoff, { timeout: 1200 });
    } else {
        setTimeout(kickoff, 100);
    }
}
/**
 * PDA Studio load karne ke liye function.
 */

async function loadPdaStudio() {
    const mainApp = document.getElementById('mainApp');
    const studioContent = document.getElementById('studioContent'); // Target the inner container
    const splashScreen = document.getElementById('splashScreen');
    
    if (!mainApp || !studioContent) {
        console.error("Critical DOM structure missing: #mainApp or #studioContent");
        return;
    }

    if (splashScreen) hideSplash();

    mainApp.style.display = 'block';
    studioContent.innerHTML = '<div class="library-message">Loading PDA Environment...</div>';

    try {
        const htmlPromise = studioWarmCache.pdaHtml ?? fetchHtmlText('pda_studio.html');
        const modulePromise = studioWarmCache.pdaModule ?? import('./pda_main.js');
        const statePromise = studioWarmCache.pdaState ?? import('./pda_state.js');
        studioWarmCache.pdaHtml = htmlPromise;
        studioWarmCache.pdaModule = modulePromise;
        studioWarmCache.pdaState = statePromise;

        const [html, pdaModule, pdaStateModule] = await Promise.all([htmlPromise, modulePromise, statePromise]);
        studioRuntime.pdaState = pdaStateModule;
        studioContent.innerHTML = html;
        pdaModule.initializePDA();
        refreshLucideIcons();

        const pending = consumePendingImportedMachine('pda');
        if (pending) {
            const { loadPdaFromObject } = await import('./pda_file.js');
            await loadPdaFromObject(pending);
        } else {
            const snapshot = loadSnapshot('pda');
            if (snapshot && typeof pdaStateModule.setMachine === 'function') {
                pdaStateModule.setMachine(snapshot);
            }
        }
        
        window.currentStudio = 'PDA';
        StudioContext.current = 'PDA'; // Keep context in sync
        safeStorageSet(STORAGE_KEYS.lastStudio, 'PDA');
        setActiveRoute('pda');
    } catch (error) {
        console.error("PDA module load error:", error);
        studioContent.innerHTML = `<div class="library-message error">Failed to load PDA: ${error.message}</div>`;
    }
}

/**
 * Turing Machine Studio loader.
 * Fetches the HTML and initializes the TM engine.
 */
async function loadTmStudio() {
    const mainApp = document.getElementById('mainApp');
    const studioContent = document.getElementById('studioContent');
    const splashScreen = document.getElementById('splashScreen');
    
    if (!mainApp || !studioContent) {
        console.error("Critical DOM structure missing: #mainApp or #studioContent");
        return;
    }

    // Hide splash screen with transition
    if (splashScreen) hideSplash();

    mainApp.style.display = 'block';
    studioContent.innerHTML = '<div class="library-message">Booting Turing Machine Studio...</div>';

    try {
        const htmlPromise = studioWarmCache.tmHtml ?? fetchHtmlText('tm_studio.html');
        const modulePromise = studioWarmCache.tmModule ?? import('./tm_main.js');
        const statePromise = studioWarmCache.tmState ?? import('./tm_state.js');
        studioWarmCache.tmHtml = htmlPromise;
        studioWarmCache.tmModule = modulePromise;
        studioWarmCache.tmState = statePromise;

        const [html, tmModule, tmStateModule] = await Promise.all([htmlPromise, modulePromise, statePromise]);
        studioRuntime.tmState = tmStateModule;
        studioContent.innerHTML = html;
        tmModule.initializeTM();

        const pending = consumePendingImportedMachine('tm');
        if (pending) {
            const { loadTmFromObject } = await import('./tm_file.js');
            await loadTmFromObject(pending);
        } else {
            const snapshot = loadSnapshot('tm');
            if (snapshot && typeof tmStateModule.setMachine === 'function') {
                tmStateModule.setMachine(snapshot);
            }
        }
        hydratePendingPrompt('tm');
        
        // 3. Keep global state in sync
        window.currentStudio = 'Turing';
        StudioContext.current = 'Turing'; 
        safeStorageSet(STORAGE_KEYS.lastStudio, 'Turing');
        setActiveRoute('tm');
        
        // 4. Initialize Lucide for the newly injected HTML
        refreshLucideIcons();
    } catch (error) {
        console.error("Turing module load error:", error);
        studioContent.innerHTML = `<div class="library-message error">Failed to load TM: ${error.message}</div>`;
    }
}

// --- Main Application Startup ---
function startUnifiedApp() {
    const splashScreen = document.getElementById('splashScreen');
    initializeShortcuts();
    setupSplashUtility();
    renderSplashAssignmentHint();
    warmupSpecializedStudios();
    startAutosaveLoop();
    window.addEventListener('beforeunload', () => {
        persistCurrentStudioSnapshot().catch(() => {});
    });
    
    if (!splashScreen) {
        loadStudio('FA');
        return;
    }

    const navButtons = document.querySelectorAll('.splash-nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            
            // Prevent collision with specialized loaders (PDA and Turing)
            if (target === 'PDA' || target === 'Turing' || target === 'Grammar') return; 

            if (!e.currentTarget.disabled) {
                hideSplash();
                setTimeout(() => loadStudio(target), 250);
            }
        });
    });
    
    const hash = (window.location.hash || '').toLowerCase();
    const hashRoute = hash === '#fa' ? 'fa' : hash.replace('#', '');
    const sessionRoute = (safeSessionGet(SESSION_KEYS.activeRoute, '') || '').toLowerCase();
    const persistedRoute = hashRoute || sessionRoute;

    if (persistedRoute === 'grammar') {
         window.location.href = 'grammar_studio.html';
    } else if (persistedRoute === 'mm') {
         hideSplash();
         loadStudio('MM');
    } else if (persistedRoute === 'pda') {
         hideSplash();
         loadPdaStudio();
    } else if (persistedRoute === 'tm' || persistedRoute === 'turing') {
         hideSplash();
         loadTmStudio();
    } else if (persistedRoute === 'fa') {
         hideSplash();
         loadStudio('FA');
    } else if ((safeStorageGet(STORAGE_KEYS.autoResume, 'false') === 'true')) {
         const lastStudio = safeStorageGet(STORAGE_KEYS.lastStudio, 'FA');
         if (lastStudio === 'MM' || lastStudio === 'FA') {
            hideSplash();
            loadStudio(lastStudio);
         }
         if (lastStudio === 'PDA') {
            hideSplash();
            loadPdaStudio();
         }
         if (lastStudio === 'Turing') {
            hideSplash();
            loadTmStudio();
         }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", startUnifiedApp);
} else {
    startUnifiedApp();
}

document.addEventListener('click', (e) => {
    const machineSwitch = e.target instanceof Element ? e.target.closest('[data-machine-switch]') : null;
    if (machineSwitch) {
        const machine = machineSwitch.getAttribute('data-machine-switch');
        if (machine) openStudioByMachineType(machine);
        return;
    }
    const target = e.target instanceof Element ? e.target.closest('#backToMenuBtn, #pdaBackToMenuBtn, #tmBackToMenuBtn') : null;
    if (!target) return;
    persistCurrentStudioSnapshot()
        .catch(() => {})
        .finally(() => showSplash());
});

// PDA Button Logic
const pdaButton = document.querySelector('.splash-nav-btn[data-target="PDA"]');
if (pdaButton) {
    pdaButton.disabled = false;
    pdaButton.addEventListener('click', loadPdaStudio);
}

// Turing Machine Button Logic (NEW)
const tmButton = document.querySelector('.splash-nav-btn[data-target="Turing"]');
if (tmButton) {
    tmButton.disabled = false;
    tmButton.addEventListener('click', loadTmStudio);
}

const grammarButton = document.querySelector('.splash-nav-btn[data-target="Grammar"]');
if (grammarButton) {
    grammarButton.disabled = false;
    grammarButton.addEventListener('click', () => {
        setActiveRoute('grammar');
        window.location.href = 'grammar_studio.html';
    });
}

// Export context for use in all imported modules
window.StudioContext = StudioContext;
window.openStudioByMachineType = openStudioByMachineType;
