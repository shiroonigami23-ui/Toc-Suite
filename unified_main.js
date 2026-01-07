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


/**
 * Dynamically loads the studio HTML content and initializes the appropriate scripts.
 * @param {'FA' | 'MM'} target The studio to load.
 */
function loadStudio(target) {
    const studioContent = document.getElementById('studioContent');
    const mainApp = document.getElementById('mainApp');
    if (!studioContent || !mainApp) {
        console.error("Critical DOM element #studioContent or #mainApp missing.");
        return;
    }
    mainApp.style.display = 'block';
    
    const htmlContent = StudioContext.getHtmlContent(target);
    studioContent.innerHTML = htmlContent;
    
    StudioContext.current = target;
    
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
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
    }, 50); 
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

    if (splashScreen) {
        splashScreen.style.opacity = '0';
        setTimeout(() => splashScreen.style.display = 'none', 800);
    }

    mainApp.style.display = 'block';
    studioContent.innerHTML = '<div class="library-message">Loading PDA Environment...</div>';

    try {
        const response = await fetch('pda_studio.html');
        const html = await response.text();
        
        // Inject into studioContent to preserve the parent structure
        studioContent.innerHTML = html;

        const { initializePDA } = await import('./pda_main.js');
        initializePDA();
        
        window.currentStudio = 'PDA';
        StudioContext.current = 'PDA'; // Keep context in sync
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
    if (splashScreen) {
        splashScreen.style.opacity = '0';
        setTimeout(() => splashScreen.style.display = 'none', 800);
    }

    mainApp.style.display = 'block';
    studioContent.innerHTML = '<div class="library-message">Booting Turing Machine Studio...</div>';

    try {
        // 1. Fetch the Studio HTML
        const response = await fetch('tm_studio.html');
        const html = await response.text();
        studioContent.innerHTML = html;

        // 2. Import and Initialize the TM Engine
        const { initializeTM } = await import('./tm_main.js');
        initializeTM();
        
        // 3. Keep global state in sync
        window.currentStudio = 'Turing';
        StudioContext.current = 'Turing'; 
        
        // 4. Initialize Lucide for the newly injected HTML
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error("Turing module load error:", error);
        studioContent.innerHTML = `<div class="library-message error">Failed to load TM: ${error.message}</div>`;
    }
}

// --- Main Application Startup ---
document.addEventListener("DOMContentLoaded", () => {
    const splashScreen = document.getElementById('splashScreen');
    
    if (!splashScreen) {
        loadStudio('FA');
        return;
    }

    const navButtons = document.querySelectorAll('.splash-nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            
            // Prevent collision with specialized loaders (PDA and Turing)
            if (target === 'PDA' || target === 'Turing') return; 

            if (!e.currentTarget.disabled) {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    loadStudio(target);
                }, 800);
            }
        });
    });
    
    // Default load if no selection is made or hash is present
    if(window.location.hash === '#mm') {
         loadStudio('MM');
    } else if(window.location.hash === '#pda') {
         loadPdaStudio();
    } else if(window.location.hash === '#tm') {
         loadTmStudio();
    } else {
         loadStudio('FA');
    }
});

// PDA Button Logic
const pdaButton = document.querySelector('.splash-nav-btn[data-target="PDA"]');
if (pdaButton) {
    pdaButton.disabled = false;
    pdaButton.style.opacity = '1';
    pdaButton.style.cursor = 'pointer';
    pdaButton.style.background = 'rgba(255,255,255,0.2)';
    pdaButton.addEventListener('click', loadPdaStudio);
}

// Turing Machine Button Logic (NEW)
const tmButton = document.querySelector('.splash-nav-btn[data-target="Turing"]');
if (tmButton) {
    tmButton.disabled = false;
    tmButton.style.opacity = '1';
    tmButton.style.cursor = 'pointer';
    tmButton.style.background = 'rgba(255,255,255,0.2)';
    tmButton.addEventListener('click', loadTmStudio);
}

// Export context for use in all imported modules
window.StudioContext = StudioContext;