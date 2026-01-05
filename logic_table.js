/**
 * logic_table.js
 * Universal Logic Explorer & Machine Intelligence Controller.
 * Handles dynamic legends, transition tables, and real-time highlighting.
 */
import { MACHINE } from './tm_state.js';
import { addLogMessage } from './utils.js';

/**
 * logic_table.js
 * High-performance universal property mapper for the Machine Intelligence suite.
 */
export function updateLogicDisplay() {
    const tableBody = document.getElementById('tmLogicTableBody');
    const legendContainer = document.getElementById('tmDynamicLegend');
    if (!legendContainer) return;

    // 1. RE-ADD STATE ROLES (Dynamic Legend)
    const states = MACHINE.states;
    const initialCount = states.filter(s => s.initial).length;
    const haltCount = states.filter(s => s.accepting).length;
    const trapCount = states.filter(s => 
        !s.accepting && !MACHINE.transitions.some(t => t.from === s.id)
    ).length;

    legendContainer.innerHTML = `
        <div style="border-left: 3px solid #10b981; padding: 4px 8px; background: #f0fdf4; font-size: 11px; color: #166534; font-weight: 600;">Initial: ${initialCount}</div>
        <div style="border-left: 3px solid #059669; padding: 4px 8px; background: #ecfdf5; font-size: 11px; color: #065f46; font-weight: 600;">Halt: ${haltCount}</div>
        <div style="border-left: 3px solid #ef4444; padding: 4px 8px; background: #fef2f2; font-size: 11px; color: #991b1b; font-weight: 600;">Traps: ${trapCount}</div>
    `;

    // 2. FIXED TRANSITION TABLE (Accuracy fix for Write/Move)
    if (tableBody) {
        tableBody.innerHTML = '';
        MACHINE.transitions.forEach((t, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-index', index);

            // Handle Multi-Tape or Standard property detection
            const readVal = t.reads ? `[${t.reads.join(',')}]` : (t.read || 'B');
            
            // FIX: Map 'write' for TM and 'push' for PDA accurately
            const writeVal = t.writes ? `[${t.writes.join(',')}]` : (t.write || t.push || '-');
            
            // FIX: Map 'move' for TM and 'pop' for PDA accurately
            const moveVal = t.moves ? `[${t.moves.join(',')}]` : (t.move || t.pop || '-');

            row.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">${t.from}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #10b981; font-weight: bold;">${readVal}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">${t.to}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #059669; font-weight: bold;">${writeVal}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                    <span style="background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${moveVal}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                    <button class="table-del-btn" style="border:none; background:none; color:#ef4444; cursor:pointer;" onclick="window.deleteTransitionFromTable(${index})">×</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * Highlights the specific logic row during simulation execution.
 * Syncs the table with the canvas Emerald Green pulse.
 */
export function highlightTableRow(transitionIndex) {
    // Reset previous highlights
    document.querySelectorAll('#tmLogicTableBody tr').forEach(row => {
        row.style.background = 'transparent';
        row.style.boxShadow = 'none';
    });

    // Highlight active transition row
    const activeRow = document.querySelector(`#tmLogicTableBody tr[data-index="${transitionIndex}"]`);
    if (activeRow) {
        activeRow.style.background = 'rgba(16, 185, 129, 0.15)'; // Light Emerald Tint
        activeRow.style.boxShadow = 'inset 4px 0 0 #10b981'; // Emerald Left Border
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Global hook for transition deletion directly from the table explorer.
 */
window.deleteTransitionFromTable = (index) => {
    import('./tm_ui.js').then(ui => {
        const t = MACHINE.transitions[index];
        if (t) {
            ui.deleteTransition(t.from, t.to, index);
            updateLogicDisplay();
        }
    });
};

export function exportTmTableToExcel() {
    if (!MACHINE.transitions || MACHINE.transitions.length === 0) {
        alert("No transitions to export.");
        return;
    }

    addLogMessage("Generating Excel-compatible transition report...", 'table-2');

    // 1. Define CSV Headers
    const headers = ["From State", "Read Symbol", "Write Symbol", "Move Direction", "To State"];
    
    // 2. Map Transitions to CSV Rows
    const rows = MACHINE.transitions.map(t => {
        return [
            t.from,
            t.read || 'B', // Blank symbol fallback
            t.write || 'B',
            t.move,
            t.to
        ].join(",");
    });

    // 3. Combine and create Blob
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 4. Trigger Download
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `TM_Logic_${MACHINE.title || 'Export'}_${timestamp}.csv`;
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLogMessage(`Logic Table exported: ${fileName}`, 'check-circle');
}