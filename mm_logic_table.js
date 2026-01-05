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

    if (tableBody) {
        tableBody.innerHTML = '';
        MACHINE.transitions.forEach((t, index) => {
            const sourceState = states.find(s => s.id === t.from);
            const targetState = states.find(s => s.id === t.to);

            const getStatus = (s) => {
                if (!s) return "";
                return s.initial ? `<span title="Initial" style="color:#ff9800; font-weight:bold; margin-left:4px;">→</span>` : "";
            };

            const row = document.createElement('tr');
            row.setAttribute('data-index', index);
            
            // Logic for visual table output
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
 * ARCHITECT'S UPGRADE: Excel Exporter for Mealy/Moore
 */
export async function exportMmTableToExcel() {
    // Dynamically import latest state
    const { MACHINE: latestMachine } = await import('./moore_mealy_state.js');
    if (!latestMachine.transitions || latestMachine.transitions.length === 0) return;

    const headers = ["From State", "Input Symbol", "To State", "Produced Output"];
    
    const rows = latestMachine.transitions.map(t => {
        // Resolve output based on current machine type
        let output;
        if (latestMachine.type === 'MEALY') {
            output = t.output || 'ε';
        } else {
            const target = latestMachine.states.find(s => s.id === t.to);
            output = target ? (target.output || 'ε') : 'ε';
        }

        return [
            t.from,
            t.symbol || 'ε',
            t.to,
            output
        ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${latestMachine.type}_Logic_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function highlightMmTableRow(idx) {
    document.querySelectorAll('#mmLogicTableBody tr').forEach(r => {
        r.style.background = 'transparent';
        r.style.boxShadow = 'none';
    });

    const activeRow = document.querySelector(`#mmLogicTableBody tr[data-index="${idx}"]`);
    if (activeRow) {
        activeRow.style.background = 'rgba(255, 152, 0, 0.15)'; 
        activeRow.style.boxShadow = 'inset 4px 0 0 #ff9800'; 
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}