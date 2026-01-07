/**
 * mm_logic_table.js
 * Specialized Logic for Moore (State-Output) vs Mealy (Transition-Output).
 */
import { MACHINE } from './moore_mealy_state.js';

export function updateMmLogicDisplay() {
    const tableBody = document.getElementById('mmLogicTableBody');
    const headerRow = document.getElementById('mmLogicTableHeaderRow');
    const legendContainer = document.getElementById('mmDynamicLegend');
    
    if (!headerRow || !tableBody) return;

    // 1. DYNAMIC HEADER ASSIGNMENT
    const isMoore = MACHINE.type === 'MOORE';
    headerRow.innerHTML = isMoore ? `
        <th style="padding: 12px; text-align: left; color: #7c2d12;">Source State</th>
        <th style="padding: 12px; color: #7c2d12;">Input ($\Sigma$)</th>
        <th style="padding: 12px; color: #7c2d12;">Target State</th>
        <th style="padding: 12px; text-align: right; color: #c2410c;">State Output ($\lambda$)</th>
    ` : `
        <th style="padding: 12px; text-align: left; color: #7c2d12;">Source State</th>
        <th style="padding: 12px; color: #7c2d12;">Input ($\Sigma$)</th>
        <th style="padding: 12px; color: #7c2d12;">Target State</th>
        <th style="padding: 12px; text-align: right; color: #b91c1c;">Trans. Output ($\delta$)</th>
    `;

    // 2. LEGEND UPDATES
    const states = MACHINE.states;
    if (legendContainer) {
        const initialCount = states.filter(s => s.initial).length;
        legendContainer.innerHTML = `
            <div style="border-left: 3px solid #ff9800; padding: 4px 10px; background: #fff7ed; font-size: 11px; color: #9a3412; font-weight: 600; border-radius: 4px;">Initial: ${initialCount}</div>
            <div style="border-left: 3px solid #6366f1; padding: 4px 10px; background: #eef2ff; font-size: 11px; color: #3730a3; font-weight: 600; border-radius: 4px;">Mode: ${MACHINE.type}</div>
        `;
    }

    // 3. TABLE BODY GENERATION
    tableBody.innerHTML = '';
    MACHINE.transitions.forEach((t, index) => {
        const sourceState = states.find(s => s.id === t.from);
        const targetState = states.find(s => s.id === t.to);

        const getStatusIcon = (s) => (s?.initial ? `<span title="Initial" style="color:#ff9800; font-weight:bold; margin-left:4px;">→</span>` : "");

        // CORE LOGIC DIFFERENCE:
        // Moore looks at targetState.output | Mealy looks at t.output
        let outputVal = isMoore ? (targetState?.output || '0') : (t.output || '0');
        let outputColor = isMoore ? "#c2410c" : "#b91c1c";

        const row = document.createElement('tr');
        row.setAttribute('data-index', index);
        row.innerHTML = `
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: left;">
                <strong>${t.from}</strong> ${getStatusIcon(sourceState)}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #ff9800; font-weight: bold;">
                ${t.symbol}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: center;">
                ${getStatusIcon(targetState)} <strong>${t.to}</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; text-align: right; color: ${outputColor}; font-weight: bold;">
                ${outputVal}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

export async function exportMmTableToExcel() {
    const { MACHINE: latestMachine } = await import('./moore_mealy_state.js');
    if (!latestMachine.transitions || latestMachine.transitions.length === 0) return;

    // Use specific terminology in headers
    const isMoore = latestMachine.type === 'MOORE';
    const outputHeader = isMoore ? "State Output (Lambda)" : "Transition Output (Delta)";
    const headers = ["From State", "Input Symbol", "To State", outputHeader];
    
    const rows = latestMachine.transitions.map(t => {
        let output = isMoore 
            ? (latestMachine.states.find(s => s.id === t.to)?.output || '0')
            : (t.output || '0');

        return [t.from, t.symbol || 'ε', t.to, output].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${latestMachine.type}_Logic_Export.csv`;
    link.click();
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