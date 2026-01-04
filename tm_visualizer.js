/**
 * tm_visualizer.js
 * Renders k-parallel tapes for Multi-Tape mode.
 * Optimized for architectural stability and emerald-theme consistency.
 */
export function updateTapeUI(tapeArrays, headIndices) {
    const tapeContainer = document.getElementById('tmTapeDisplay');
    if (!tapeContainer) return;

    // --- ARCHITECTURAL DEFENSE: Normalize Input ---
    // Prevents "forEach is not a function" by ensuring we have an array of arrays
    let normalizedTapes = tapeArrays;
    if (!Array.isArray(tapeArrays)) {
        normalizedTapes = [['B']]; // Fallback to a single blank cell
    } else if (!Array.isArray(tapeArrays[0])) {
        normalizedTapes = [tapeArrays]; // Wrap 1D array into 2D
    }

    // Ensure headIndices is also an array for parallel lookup
    const normalizedHeads = Array.isArray(headIndices) ? headIndices : [0];

    // Change layout to vertical stack of horizontal tapes
    tapeContainer.style.flexDirection = 'column';
    tapeContainer.innerHTML = '';

    normalizedTapes.forEach((tape, tIndex) => {
        // Double-check each row is an array before processing
        if (!Array.isArray(tape)) return;

        const row = document.createElement('div');
        row.className = 'tape-row';
        row.style.display = 'flex';
        row.style.gap = '4px';
        row.style.padding = '5px 0';
        row.style.borderBottom = tIndex < normalizedTapes.length - 1 ? '1px dashed #e2e8f0' : 'none';

        tape.forEach((symbol, sIndex) => {
            const cell = document.createElement('div');
            cell.className = 'tape-cell';
            
            // Highlight the cell if the head is currently over it
            const isActive = sIndex === normalizedHeads[tIndex];
            
            if (isActive) cell.classList.add('active');
            cell.textContent = symbol;
            
            // Apply Emerald Stylings
            cell.style.cssText = `
                min-width: 30px; height: 30px; display: flex; 
                align-items: center; justify-content: center;
                border: 1px solid #cbd5e1; border-radius: 4px;
                background: ${isActive ? '#10b981' : 'white'};
                color: ${isActive ? 'white' : '#1e293b'};
                font-weight: bold; font-size: 0.8em;
                transition: background 0.2s, color 0.2s;
            `;
            row.appendChild(cell);
        });
        tapeContainer.appendChild(row);
    });

    // Update the tape head position in the header if it exists
    const headPosDisplay = document.getElementById('currentHeadPos');
    if (headPosDisplay) {
        headPosDisplay.textContent = normalizedHeads.join(', ');
    }
}
