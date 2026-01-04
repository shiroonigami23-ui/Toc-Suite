/**
 * pda_renderer.js
 * Specialized SVG rendering for Pushdown Automata.
 */

import { MACHINE } from './pda_state.js';

const SVG_NS = "http://www.w3.org/2000/svg";

export function renderAll() {
    const statesG = document.getElementById('states');
    const edgesG = document.getElementById('edges');
    if (!statesG || !edgesG) return;

    statesG.innerHTML = '';
    edgesG.innerHTML = '';

    // 1. Render Edges (Transitions)
    const grouped = groupTransitions(MACHINE.transitions);
    grouped.forEach(group => renderEdge(group, edgesG));

    // 2. Render States
    MACHINE.states.forEach(state => renderState(state, statesG));
}

function groupTransitions(transitions) {
    const map = new Map();
    transitions.forEach(t => {
        const key = `${t.from}-${t.to}`;
        const label = `${t.symbol}, ${t.pop} → ${t.push}`;
        if (!map.has(key)) map.set(key, { from: t.from, to: t.to, labels: [] });
        map.get(key).labels.push(label);
    });
    return Array.from(map.values());
}

/**
 * pda_renderer.js - Updated renderEdge for better arrow visibility
 */

function renderEdge(group, container) {
    const from = MACHINE.states.find(s => s.id === group.from);
    const to = MACHINE.states.find(s => s.id === group.to);
    if (!from || !to) return;

    const g = document.createElementNS(SVG_NS, "g");
    const path = document.createElementNS(SVG_NS, "path");
    const text = document.createElementNS(SVG_NS, "text");

    let d, tx, ty;
    const radius = 25; // Standard state circle radius

    if (from === to) {
        // Self-loop geometry
        d = `M ${from.x - 15},${from.y - 24} A 20,20 0 1,1 ${from.x + 15},${from.y - 24}`;
        tx = from.x; 
        ty = from.y - 60;
    } else {
        // Calculate the angle between states to stop the arrow at the circle edge
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        
        // Start point (edge of 'from' circle)
        const startX = from.x + radius * Math.cos(angle);
        const startY = from.y + radius * Math.sin(angle);
        
        // End point (edge of 'to' circle)
        // We subtract a small offset (e.g., 5px) so the arrowhead doesn't overlap the border
        const endX = to.x - (radius + 5) * Math.cos(angle);
        const endY = to.y - (radius + 5) * Math.sin(angle);

        // Straight line geometry from edge to edge
        d = `M ${startX},${startY} L ${endX},${endY}`;
        tx = (from.x + to.x) / 2; 
        ty = (from.y + to.y) / 2 - 15;
    }

    path.setAttribute("d", d);
    path.setAttribute("class", "transition-path");
    path.setAttribute("marker-end", "url(#arrowhead)");
    
    // Animation support data attributes
    path.dataset.from = group.from;
    path.dataset.to = group.to;
    
    text.setAttribute("x", tx);
    text.setAttribute("y", ty);
    text.setAttribute("class", "state-label");
    text.style.fontSize = "12px";
    text.textContent = group.labels.join(" | ");

    g.appendChild(path);
    g.appendChild(text);
    container.appendChild(g);
}

function renderState(state, container) {
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("transform", `translate(${state.x},${state.y})`);
    g.setAttribute("class", "state-group");
    g.dataset.id = state.id;

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("r", "25");
    circle.setAttribute("class", "state-circle");
    g.appendChild(circle);

    if (state.accepting) {
        const inner = document.createElementNS(SVG_NS, "circle");
        inner.setAttribute("r", "20");
        inner.setAttribute("class", "final-ring");
        g.appendChild(inner);
    }

    if (state.initial) {
        const arrow = document.createElementNS(SVG_NS, "path");
        arrow.setAttribute("d", "M -50 0 L -25 0");
        arrow.setAttribute("class", "initial-arrow");
        arrow.setAttribute("marker-end", "url(#arrowhead)");
        g.appendChild(arrow);
    }

    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("class", "state-label");
    label.textContent = state.id;
    g.appendChild(label);

    container.appendChild(g);
}

/**
 * Arranges PDA states in a circular layout.
 */
export function layoutStatesCircular(states) {
    if (!states || states.length === 0) return;
    const svg = document.getElementById('dfaSVG');
    if (!svg) return;
    
    const bbox = svg.viewBox.baseVal;
    const centerX = bbox.width / 2;
    const centerY = bbox.height / 2;
    
    const baseRadius = Math.min(centerX, centerY) * 0.7;
    const radius = Math.max(150, Math.min(baseRadius, states.length * 50)); 
    
    const angleStep = (2 * Math.PI) / states.length;
    states.forEach((s, i) => {
        const angle = i * angleStep - (Math.PI / 2);
        s.x = centerX + radius * Math.cos(angle);
        s.y = centerY + radius * Math.sin(angle);
    });
}