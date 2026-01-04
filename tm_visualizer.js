

/**
 * tm_visualizer.js
 * Renders k-parallel tapes for Multi-Tape mode.
 */
export function updateTapeUI(tapeArrays, headIndices) {
    const tapeContainer = document.getElementById('tmTapeDisplay');
    if (!tapeContainer) return;

    // Change layout to vertical stack of horizontal tapes
    tapeContainer.style.flexDirection = 'column';
    tapeContainer.innerHTML = '';

    tapeArrays.forEach((tape, tIndex) => {
        const row = document.createElement('div');
        row.className = 'tape-row';
        row.style.display = 'flex';
        row.style.gap = '4px';
        row.style.padding = '5px 0';
        row.style.borderBottom = tIndex < tapeArrays.length - 1 ? '1px dashed #e2e8f0' : 'none';

        tape.forEach((symbol, sIndex) => {
            const cell = document.createElement('div');
            cell.className = 'tape-cell';
            const isActive = sIndex === headIndices[tIndex];
            
            if (isActive) cell.classList.add('active');
            cell.textContent = symbol;
            
            // Standard Emerald Styling
            cell.style.cssText = `
                min-width: 30px; height: 30px; display: flex; 
                align-items: center; justify-content: center;
                border: 1px solid #cbd5e1; border-radius: 4px;
                background: ${isActive ? '#10b981' : 'white'};
                color: ${isActive ? 'white' : '#1e293b'};
                font-weight: bold; font-size: 0.8em;
            `;
            row.appendChild(cell);
        });
        tapeContainer.appendChild(row);
    });
}