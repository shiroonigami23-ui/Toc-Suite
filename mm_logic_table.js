/**
 * mm_logic_table.js
 * Intelligence controller for Output Machines (Mealy/Moore).
 */
import { MACHINE } from './moore_mealy_state.js';

export function updateMmLogicDisplay() {
    const tableBody = document.getElementById('mmLogicTableBody');
    const legendContainer = document.getElementById('mmDynamicLegend');
    if (!legendContainer) return;

    const states = MACHINE.states;
    const initialCount = states.filter(s => s.initial).length;
    const trapCount = states.filter(s => !MACHINE.transitions.some(t => t.from === s.id)).length;

    legendContainer.innerHTML = `
        <div style="border-left: 3px solid #ff9800; padding: 4px 10px; background: #fff7ed; font-size: 11px; color: #9a3412; font-weight: 600; border-radius: 4px;">Initial: ${initialCount}</div>
        <div style="border-left: 3px solid #ef4444; padding: 4px 10px; background: #fef2f2; font-size: 11px; color: #991b1b; font-weight: 600; border-radius: 4px;">Traps: ${trapCount}</div>
    `;

    // --- TABLE POPULATION WITH STATUS MARKERS ---
    if (tableBody) {
        tableBody.innerHTML = '';
        MACHINE.transitions.forEach((t, index) => {
            const sourceState = states.find(s => s.id === t.from);
            const targetState = states.find(s => s.id === t.to);

            // Reused Status Marker Helper
            const getStatus = (s) => {
                if (!s) return "";
                // MM machines use Orange for Initial and rarely use Final (Accepting)
                return s.initial ? `<span title="Initial" style="color:#ff9800; font-weight:bold; margin-left:4px;">→</span>` : "";
            };

            const row = document.createElement('tr');
            row.setAttribute('data-index', index);
            
            let outputVal = MACHINE.type === 'MEALY' ? (t.output || 'ε') : (targetState?.output || 'ε');

            row.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: left;">
                    <strong>${t.from}</strong> ${getStatus(sourceState)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #ff9800; font-weight: bold;">
                    ${t.symbol}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                    ${getStatus(targetState)} <strong>${t.to}</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #ff5722; font-weight: bold;">
                    ${outputVal}
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * Highlights the active Mealy/Moore logic row during simulation.
 * Uses the Orange palette to match the Output Machine theme.
 */
export function highlightMmTableRow(idx) {
    // 1. Reset all rows
    document.querySelectorAll('#mmLogicTableBody tr').forEach(r => {
        r.style.background = 'transparent';
        r.style.boxShadow = 'none';
    });

    // 2. Target and highlight the row by its data-index
    const activeRow = document.querySelector(`#mmLogicTableBody tr[data-index="${idx}"]`);
    if (activeRow) {
        activeRow.style.background = 'rgba(255, 152, 0, 0.15)'; // Light Orange Tint
        activeRow.style.boxShadow = 'inset 4px 0 0 #ff9800'; // Orange Left Border
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}