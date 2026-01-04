/**
 * pda_logic_table.js
 * Specialized Intelligence controller for Pushdown Automata (PDA).
 * Enhanced with Initial/Final state status markers.
 */
import { MACHINE } from './pda_state.js';

export function updatePdaLogicDisplay() {
    const tableBody = document.getElementById('pdaLogicTableBody');
    const legendContainer = document.getElementById('pdaDynamicLegend');
    if (!legendContainer) return;

    // 1. Dynamic Legend (Roles)
    const states = MACHINE.states;
    const initial = states.filter(s => s.initial).length;
    const halt = states.filter(s => s.accepting).length;
    const traps = states.filter(s => !s.accepting && !MACHINE.transitions.some(t => t.from === s.id)).length;

    legendContainer.innerHTML = `
        <div style="border-left: 3px solid #10b981; padding: 4px 8px; background: #f0fdf4; font-size: 11px; color: #166534; font-weight: 600; border-radius: 4px;">Initial: ${initial}</div>
        <div style="border-left: 3px solid #059669; padding: 4px 8px; background: #ecfdf5; font-size: 11px; color: #065f46; font-weight: 600; border-radius: 4px;">Final: ${halt}</div>
        <div style="border-left: 3px solid #ef4444; padding: 4px 8px; background: #fef2f2; font-size: 11px; color: #991b1b; font-weight: 600; border-radius: 4px;">Traps: ${traps}</div>
    `;

    // 2. Table Update with Status Markers
    if (tableBody) {
        tableBody.innerHTML = '';
        MACHINE.transitions.forEach((t, idx) => {
            const sourceState = states.find(s => s.id === t.from);
            const targetState = states.find(s => s.id === t.to);

            // Surgical Status Marker Logic
            const getStatus = (s) => {
                if (!s) return "";
                let icons = "";
                // Blue for Initial, Green for Final/Accepting
                if (s.initial) icons += `<span title="Initial" style="color:#6366f1; font-weight:bold; margin-left:4px;">→</span>`;
                if (s.accepting) icons += `<span title="Final" style="color:#10b981; font-weight:bold; margin-left:4px;">◎</span>`;
                return icons;
            };

            const row = document.createElement('tr');
            row.setAttribute('data-index', idx);
            row.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: left;">
                    <strong>${t.from}</strong> ${getStatus(sourceState)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #10b981; font-weight: bold;">
                    ${t.symbol || 'ε'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #6366f1;">
                    ${t.pop || 'ε'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: left;">
                    ${getStatus(targetState)} <strong>${t.to}</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #059669;">
                    ${t.push || 'ε'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                    <button style="color: #ef4444; border: none; background: none; cursor: pointer; font-size: 1.2em;" onclick="window.deletePdaTransition(${idx})">×</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}
/**
 * Highlights the active PDA transition row during simulation.
 * Syncs the modal table with the canvas emerald pulse.
 */
export function highlightPdaTableRow(idx) {
    // 1. Reset all rows to transparent
    document.querySelectorAll('#pdaLogicTableBody tr').forEach(r => {
        r.style.background = 'transparent';
        r.style.boxShadow = 'none';
    });

    // 2. Identify and highlight the active transition
    const activeRow = document.querySelector(`#pdaLogicTableBody tr[data-index="${idx}"]`);
    if (activeRow) {
        activeRow.style.background = 'rgba(16, 185, 129, 0.15)'; // Light Emerald Tint
        activeRow.style.boxShadow = 'inset 4px 0 0 #10b981'; // Emerald Left Border
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}