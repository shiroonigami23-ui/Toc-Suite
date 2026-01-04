import { MACHINE } from './state.js';
import { getModeLabel } from './utils.js';

/**
 * Arranges states in a circle. This is now the canonical layout function.
 * @param {Array} states The array of states to position.
 */
export function layoutStatesCircular(states) {
    if (!states || states.length === 0) return;
    const svg = document.getElementById('dfaSVG');
    if (!svg) return;
    
    // Use the bounds of the current viewBox
    const bbox = svg.viewBox.baseVal;
    const centerX = bbox.width / 2;
    const centerY = bbox.height / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.7;
    // Ensure radius scales reasonably but has a minimum size
    const radius = Math.max(150, Math.min(baseRadius, states.length * 40)); 
    
    const angleStep = (2 * Math.PI) / states.length;
    states.forEach((s, i) => {
        const angle = i * angleStep - (Math.PI / 2);
        s.x = centerX + radius * Math.cos(angle);
        s.y = centerY + radius * Math.sin(angle);
    });
}


function getLoopPathAndLabel(cx, cy, r) {
    const loopRadius = 35;
    const angleOffset = -Math.PI / 2;
    const startX = cx + r * Math.cos(angleOffset);
    const startY = cy + r * Math.sin(angleOffset);
    const endX = cx + r * Math.cos(angleOffset + 0.1);
    const endY = cy + r * Math.sin(angleOffset + 0.1);

    const cp1x = cx - loopRadius * 1.5;
    const cp1y = cy - r - loopRadius;
    const cp2x = cx + loopRadius * 1.5;
    const cp2y = cy - r - loopRadius;

    return {
        pathData: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
        labelX: cx,
        labelY: cy - r - loopRadius + 10,
    };
}

export function renderAll() {
    // FIX: Get DOM references inside renderAll() to ensure they are fresh after HTML injection
    const svg = document.getElementById('dfaSVG');
    const statesGroup = document.getElementById('states');
    const edgesGroup = document.getElementById('edges');

    if (!statesGroup || !edgesGroup || !svg) return;

    statesGroup.innerHTML = '';
    edgesGroup.innerHTML = '';
    
    const canvasHint = document.getElementById('canvasHint');
    if (canvasHint) {
        canvasHint.style.display = (!MACHINE.states || MACHINE.states.length === 0) ? 'block' : 'none';
    }


    const processedArcs = new Map();
    (MACHINE.transitions || []).forEach(t => {
        const arcKey = `${t.from}->${t.to}`;
        if (!processedArcs.has(arcKey)) {
            processedArcs.set(arcKey, []);
        }
        processedArcs.get(arcKey).push(t.symbol);
    });

    processedArcs.forEach((symbols, arcKey) => {
        const [fromId, toId] = arcKey.split('->');
        const from = MACHINE.states.find(s => s.id === fromId);
        const to = MACHINE.states.find(s => s.id === toId);
        if (!from || !to) return;

        let pathD, labelPos;

        if (fromId === toId) {
            const loop = getLoopPathAndLabel(from.x, from.y, 30);
            pathD = loop.pathData;
            labelPos = { x: loop.labelX, y: loop.labelY };
        } else {
            const reverse = processedArcs.has(`${toId}->${fromId}`);
            const dx = to.x - from.x, dy = to.y - from.y;
            const angle = Math.atan2(dy, dx);
            const r = 30;
            const startX = from.x + r * Math.cos(angle);
            const startY = from.y + r * Math.sin(angle);
            const endX = to.x - r * Math.cos(angle);
            const endY = to.y - r * Math.sin(angle);

            if (reverse) {
                const offset = 30;
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                const normX = -dy / Math.hypot(dx, dy);
                const normY = dx / Math.hypot(dx, dy);
                const cpx = midX + normX * offset;
                const cpy = midY + normY * offset;
                pathD = `M ${startX} ${startY} Q ${cpx} ${cpy} ${endX} ${endY}`;
                labelPos = { x: cpx, y: cpy };
            } else {
                pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
                labelPos = { x: (startX + endX) / 2, y: (startY + endY) / 2 };
            }
        }
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.classList.add('transition-path');
        path.setAttribute('data-from', fromId);
        path.setAttribute('data-to', toId);
        edgesGroup.appendChild(path);

        const uniqueSymbols = [...new Set(symbols.map(s => s || 'ε'))];
        const totalSymbols = uniqueSymbols.length;
        const textOffset = 16; 

        uniqueSymbols.forEach((symbol, i) => {
            const yAdjust = labelPos.y + (i - (totalSymbols - 1) / 2) * textOffset;
            
            const textHalo = document.createElementNS(svg.namespaceURI, 'text');
            textHalo.setAttribute('class', 'transition-label-text');
            textHalo.setAttribute('x', labelPos.x);
            textHalo.setAttribute('y', yAdjust);
            textHalo.textContent = symbol;
            textHalo.setAttribute('data-from', fromId);
            textHalo.setAttribute('data-to', toId);
            textHalo.setAttribute('data-symbol', symbol);
            edgesGroup.appendChild(textHalo);

            const text = document.createElementNS(svg.namespaceURI, 'text');
            text.setAttribute('class', 'transition-label');
            text.setAttribute('x', labelPos.x);
            text.setAttribute('y', yAdjust);
            text.textContent = symbol;
            edgesGroup.appendChild(text);
        });
    });

    MACHINE.states.forEach(state => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('data-id', state.id);

        if (state.initial) {
            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            arrow.setAttribute('x1', state.x - 60);
            arrow.setAttribute('y1', state.y);
            arrow.setAttribute('x2', state.x - 32);
            arrow.setAttribute('y2', state.y);
            arrow.classList.add('initial-arrow');
            g.appendChild(arrow);
        }

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', state.x);
        circle.setAttribute('cy', state.y);
        circle.setAttribute('r', 30);
        circle.classList.add('state-circle');
        if (state.initial) circle.classList.add('initial-pulse');
        g.appendChild(circle);

        if (state.accepting) {
            const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            innerCircle.setAttribute('cx', state.x);
            innerCircle.setAttribute('cy', state.y);
            innerCircle.setAttribute('r', 24);
            innerCircle.classList.add('final-ring');
            g.appendChild(innerCircle);
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', state.x);
        text.setAttribute('y', state.y);
        text.classList.add('state-label');
        text.textContent = state.id;
        g.appendChild(text);

        statesGroup.appendChild(g);
    });

    document.getElementById('modeLabel').textContent = getModeLabel();
}