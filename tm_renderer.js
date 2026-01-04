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

    // FIX: Pass the index 'i' to the transition renderer
    MACHINE.transitions.forEach((t, i) => {
        renderTransition(t, edgeG, i);
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
function renderTransition(t, container, index) {
    const fromState = MACHINE.states.find(s => s.id === t.from);
    const toState = MACHINE.states.find(s => s.id === t.to);
    if (!fromState || !toState) return;

    // Create a group for the edge to handle clicks
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'edge-group');
    g.setAttribute('data-from', t.from);
    g.setAttribute('data-to', t.to);
    g.setAttribute('data-index', index); // Crucial for deletion
    g.style.cursor = 'pointer';

    const label = `${t.read} ; ${t.write}, ${t.move}`;
    
    if (t.from === t.to) {
        renderSelfLoop(fromState, label, g);
    } else {
        renderEdge(fromState, toState, label, g);
    }
    
    container.appendChild(g);
}

function renderEdge(s1, s2, label, container) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', s1.x); line.setAttribute('y1', s1.y);
    line.setAttribute('x2', s2.x); line.setAttribute('y2', s2.y);
    line.setAttribute('stroke', '#10b981');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('marker-end', 'url(#arrowhead)');
    container.appendChild(line);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (s1.x + s2.x) / 2);
    text.setAttribute('y', (s1.y + s2.y) / 2 - 10);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.textContent = label;
    container.appendChild(text);
}

function renderSelfLoop(s, label, container) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${s.x - 10} ${s.y - 23} A 20 20 0 1 1 ${s.x + 10} ${s.y - 23}`;
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#10b981');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    container.appendChild(path);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', s.x);
    text.setAttribute('y', s.y - 50);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = label;
    container.appendChild(text);
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