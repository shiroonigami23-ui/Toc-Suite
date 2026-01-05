/**
 * tm_renderer.js
 * Specialized renderer for Turing Machine states and transitions.
 */

import { MACHINE } from './tm_state.js';

/**
 * Main render loop for the TM canvas.
 */
export function renderAll() {
    const edgeG = document.getElementById('edges');
    const stateG = document.getElementById('states');
    const hintEl = document.getElementById('canvasHint');
    if (!edgeG || !stateG) return;

    if (hintEl) hintEl.style.display = MACHINE.states.length > 0 ? 'none' : 'block';

    edgeG.innerHTML = '';
    stateG.innerHTML = '';

    // ARCHITECTURAL FIX: Group transitions by their "from-to" pair 
    // to calculate the correct offset for curves.
    const transitionGroups = {};
    MACHINE.transitions.forEach(t => {
        const pairId = `${t.from}-${t.to}`;
        if (!transitionGroups[pairId]) transitionGroups[pairId] = [];
        transitionGroups[pairId].push(t);
    });

    // Render transitions using grouped logic to prevent mashing
    MACHINE.transitions.forEach((t, i) => {
        const pairId = `${t.from}-${t.to}`;
        const group = transitionGroups[pairId];
        const localIndex = group.indexOf(t);
        renderTransition(t, edgeG, localIndex, group.length);
    });

    MACHINE.states.forEach(s => {
        renderState(s, stateG);
    });
}

function renderState(state, container) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'state-group');
    g.setAttribute('data-id', state.id);
    g.style.cursor = 'pointer';

    // Main Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', state.x);
    circle.setAttribute('cy', state.y);
    circle.setAttribute('r', 25);
    circle.setAttribute('fill', 'white');
    circle.setAttribute('stroke', '#10b981'); // Emerald Green
    circle.setAttribute('stroke-width', '3');
    g.appendChild(circle);

    // Initial Indicator
    if (state.initial) {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('d', `M ${state.x - 50} ${state.y} L ${state.x - 30} ${state.y}`);
        arrow.setAttribute('stroke', '#064e3b');
        arrow.setAttribute('stroke-width', '3');
        arrow.setAttribute('marker-end', 'url(#arrowhead)');
        g.appendChild(arrow);
    }

    // Final/Halt Ring
    if (state.accepting) {
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', state.x);
        ring.setAttribute('cy', state.y);
        ring.setAttribute('r', 20);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', '#10b981');
        ring.setAttribute('stroke-width', '2');
        g.appendChild(ring);
    }

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', state.x);
    text.setAttribute('y', state.y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-weight', 'bold');
    text.textContent = state.id;
    g.appendChild(text);

    container.appendChild(g);
}

/**
 * tm_renderer.js - Edge Grouping Update
 */
function renderTransition(t, container, index, total) {
    const fromState = MACHINE.states.find(s => s.id === t.from);
    const toState = MACHINE.states.find(s => s.id === t.to);
    if (!fromState || !toState) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'edge-group');
    g.setAttribute('data-from', t.from);
    g.setAttribute('data-to', t.to);
    g.setAttribute('data-index', index);
    g.style.cursor = 'pointer';

    const label = `${t.read} ; ${t.write}, ${t.move}`;
    
    // INTEGRATION: Pass index and total to the path generator
    const pathData = getTmPathData(fromState, toState, index, total);
    
    // Create the curved path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#10b981');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    g.appendChild(path);

    // Calculate label position based on the curve's control point
    const labelPos = getLabelPosition(fromState, toState, index, total);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelPos.x);
    text.setAttribute('y', labelPos.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.textContent = label;
    g.appendChild(text);
    
    container.appendChild(g);
}

/**
 * Generates curved path data with a "shorten" logic to ensure arrowheads 
 * are visible at the edge of the state circle.
 */
function getTmPathData(fromNode, toNode, index, total) {
    const { x: x1, y: y1 } = fromNode;
    const { x: x2, y: y2 } = toNode;
    const r = 25; // Radius of your state circles

    // Self-loop logic (Standard for TMs)
    if (fromNode.id === toNode.id) {
        const loopSize = 30 + (index * 15);
        // Returns a multi-segment curve for a perfect loop
        return `M ${x1} ${y1-r} C ${x1-loopSize} ${y1-r-loopSize}, ${x1+loopSize} ${y1-r-loopSize}, ${x1} ${y1-r}`;
    }

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Perpendicular offset for curvature
    const offset = (index - (total - 1) / 2) * 40; 
    const nx = -dy / len;
    const ny = dx / len;
    
    const cpX = midX + nx * offset;
    const cpY = midY + ny * offset;

    // --- DIRECTION FIX: Shorten path so arrowhead doesn't hide inside circle ---
    // We calculate a point slightly before the actual x2, y2 destination
    const t = 1 - (r / len); 
    const finalX = (1-t)*(1-t)*x1 + 2*(1-t)*t*cpX + t*t*x2;
    const finalY = (1-t)*(1-t)*y1 + 2*(1-t)*t*cpY + t*t*y2;

    return `M ${x1} ${y1} Q ${cpX} ${cpY} ${finalX} ${finalY}`;
}

/**
 * Logic to place text labels so they follow the curve.
 */
function getLabelPosition(s1, s2, index, total) {
    if (s1.id === s2.id) {
        return { x: s1.x, y: s1.y - (45 + index * 15) };
    }
    const midX = (s1.x + s2.x) / 2;
    const midY = (s1.y + s2.y) / 2;
    const dx = s2.x - s1.x;
    const dy = s2.y - s1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const offset = (index - (total - 1) / 2) * 40 + (index >= total/2 ? 15 : -15);
    
    return {
        x: midX + (-dy / len) * offset,
        y: midY + (dx / len) * offset
    };
}





/**
 * Highlights a specific state and/or transition.
 * @param {string} stateId - ID of the state to highlight.
 * @param {object|null} transition - The transition object being executed.
 */
export function highlightStep(stateId, transition = null) {
    // 1. Reset all previous highlights
    document.querySelectorAll('.state-circle, .transition-path, .transition-text').forEach(el => {
        el.classList.remove('active-step');
        el.style.stroke = '#10b981'; // Default Emerald
        el.style.filter = 'none';
    });

    // 2. Highlight State
    const stateGroup = document.querySelector(`.state-group[data-id="${stateId}"]`);
    if (stateGroup) {
        const circle = stateGroup.querySelector('circle');
        circle.classList.add('active-step');
        circle.style.stroke = '#059669'; // Darker Emerald
        circle.style.filter = 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))';
    }

    // 3. Highlight Transition (if applicable)
    if (transition) {
        // Logic to find the specific edge path based on from/to
        // Note: For self-loops, we target the path; for edges, we target the line.
        const edges = document.getElementById('edges');
        // Implementation depends on how you label your SVG elements
        // This is a placeholder for your specific edge selection logic
    }
}