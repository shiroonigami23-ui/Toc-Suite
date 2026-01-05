/**
 * fa_logic_table.js
 * Specialized Intelligence controller for Finite Automata (FA).
 */
import { MACHINE } from './state.js';

export function updateFaLogicDisplay() {
    const tableBody = document.getElementById('faLogicTableBody');
    const legendContainer = document.getElementById('faDynamicLegend');
    if (!legendContainer) return;

    // 1. DYNAMIC STATE ROLES (Metrics)
    const states = MACHINE.states;
    const initialCount = states.filter(s => s.initial).length;
    const haltCount = states.filter(s => s.accepting).length;
    const mode = MACHINE.type;

    let determinismMetric = "";
    if (mode === 'DFA') {
        const alphabet = [...new Set(MACHINE.transitions.map(t => t.symbol))];
        const incomplete = states.filter(s => {
            const outSymbols = MACHINE.transitions.filter(t => t.from === s.id).map(t => t.symbol);
            return !alphabet.every(sym => outSymbols.includes(sym));
        }).length;
        determinismMetric = `<div style="border-left: 3px solid #6366f1; padding: 4px 8px; background: #eef2ff; font-size: 11px; color: #3730a3; font-weight: 600; border-radius:4px;">Incomplete: ${incomplete}</div>`;
    } else {
        const branching = states.filter(s => {
            const symbols = MACHINE.transitions.filter(t => t.from === s.id).map(t => t.symbol);
            return new Set(symbols).size !== symbols.length;
        }).length;
        determinismMetric = `<div style="border-left: 3px solid #a855f7; padding: 4px 8px; background: #faf5ff; font-size: 11px; color: #6b21a8; font-weight: 600; border-radius:4px;">Branching: ${branching}</div>`;
    }

    legendContainer.innerHTML = `
        <div style="border-left: 3px solid #10b981; padding: 4px 8px; background: #f0fdf4; font-size: 11px; color: #166534; font-weight: 600; border-radius:4px;">Initial: ${initialCount}</div>
        <div style="border-left: 3px solid #059669; padding: 4px 8px; background: #ecfdf5; font-size: 11px; color: #065f46; font-weight: 600; border-radius:4px;">Accept: ${haltCount}</div>
        ${determinismMetric}
    `;

    // 2. FA TRANSITION TABLE
    if (tableBody) {
        tableBody.innerHTML = '';
        MACHINE.transitions.forEach((t, index) => {
            const sourceState = states.find(s => s.id === t.from);
            const targetState = states.find(s => s.id === t.to);

            const getStatus = (s) => {
                if (!s) return "";
                let icons = "";
                if (s.initial) icons += `<span title="Initial" style="color:#6366f1; margin-left:4px;">→</span>`;
                if (s.accepting) icons += `<span title="Final" style="color:#10b981; margin-left:4px;">◎</span>`;
                return icons;
            };

            const row = document.createElement('tr');
            row.setAttribute('data-index', index);
            row.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: left;">
                    <strong>${t.from}</strong> ${getStatus(sourceState)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #6366f1; font-weight: bold;">
                    ${t.symbol || 'ε'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right;">
                    ${getStatus(targetState)} <strong>${t.to}</strong>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * ARCHITECT'S UPGRADE: Excel Exporter for FA
 */
export async function exportFaTableToExcel() {
    const { MACHINE: latestMachine } = await import('./state.js'); 
    if (!latestMachine.transitions || latestMachine.transitions.length === 0) return;

    const headers = ["From State", "Input Symbol", "To State"];
    const rows = latestMachine.transitions.map(t => [
        t.from,
        t.symbol || 'ε',
        t.to
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `FA_Logic_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function highlightFaTableRow(idx) {
    document.querySelectorAll('#faLogicTableBody tr').forEach(r => {
        r.style.background = 'transparent';
        r.style.boxShadow = 'none';
    });

    const activeRow = document.querySelector(`#faLogicTableBody tr[data-index="${idx}"]`);
    if (activeRow) {
        activeRow.style.background = 'rgba(99, 102, 241, 0.15)'; 
        activeRow.style.boxShadow = 'inset 4px 0 0 #6366f1'; 
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}