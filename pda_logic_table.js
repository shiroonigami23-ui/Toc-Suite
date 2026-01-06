/**
 * pda_logic_table.js
 * Specialized Intelligence controller for Pushdown Automata (PDA).
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

            const getStatus = (s) => {
                if (!s) return "";
                let icons = "";
                if (s.initial) icons += `<span title="Initial" style="color:#6366f1; font-weight:bold; margin-left:4px;">→</span>`;
                if (s.accepting) icons += `<span title="Final" style="color:#10b981; font-weight:bold; margin-left:4px;">◎</span>`;
                return icons;
            };

            const row = document.createElement('tr');
            row.setAttribute('data-index', idx);
row.innerHTML = `
    <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: left; background: #fafafa;">
        <strong>${t.from}</strong> ${getStatus(sourceState)}
    </td>
    <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #10b981; font-weight: bold;">
        ${t.symbol || 'ε'}
    </td>
    <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #6366f1; font-weight: bold; background: #fdfdff;">
        ${t.pop || 'ε'}
    </td>
    <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: left;">
        ${getStatus(targetState)} <strong>${t.to}</strong>
    </td>
    <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #059669; font-weight: bold;">
        ${t.push || 'ε'}
    </td>
    <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">
        <button class="icon-btn-danger" style="color: #ef4444; border: none; background: none; cursor: pointer; font-size: 1.25em; transition: transform 0.2s;" 
                onmouseover="this.style.transform='scale(1.2)'" 
                onmouseout="this.style.transform='scale(1)'"
                onclick="window.deletePdaTransition(${idx})">
            <i data-lucide="trash-2" style="width:16px;"></i> ×
        </button>
    </td>
`;
            tableBody.appendChild(row);
        });
    }
}

/**
 * Highlights the active PDA transition row during simulation.
 */
export function highlightPdaTableRow(idx) {
    document.querySelectorAll('#pdaLogicTableBody tr').forEach(r => {
        r.style.background = 'transparent';
        r.style.boxShadow = 'none';
    });

    const activeRow = document.querySelector(`#pdaLogicTableBody tr[data-index="${idx}"]`);
    if (activeRow) {
        activeRow.style.background = 'rgba(16, 185, 129, 0.15)'; 
        activeRow.style.boxShadow = 'inset 4px 0 0 #10b981'; 
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Exports PDA transitions to a CSV file optimized for Excel.
 */
export async function exportPdaTableToExcel() {
    // Ensuring we have the latest machine state
    const { MACHINE: latestMachine } = await import('./pda_state.js');
    if (!latestMachine.transitions || latestMachine.transitions.length === 0) return;

    const headers = ["From State", "Input Symbol", "Pop Symbol", "To State", "Push Symbol(s)"];
    const rows = latestMachine.transitions.map(t => [
        t.from,
        t.symbol || 'ε',
        t.pop || 'ε',
        t.to,
        t.push || 'ε'
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PDA_Logic_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}