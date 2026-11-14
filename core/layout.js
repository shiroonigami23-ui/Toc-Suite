// core/layout.js — readable automatic layout for state diagrams.
//
// Layered left-to-right by BFS distance from the start state, crossings reduced with the
// barycenter heuristic, dead/trap states pushed to the bottom-right, long machines wrapped
// into rows. Pure: returns {id: {x, y}}; the caller applies it.

/**
 * @param {{states:{id:string,initial?:boolean,accepting?:boolean}[], transitions:{from:string,to:string}[]}} machine
 * @param {{width?:number, height?:number, margin?:number}} [opts]
 */
export function autoLayout(machine, { width = 1400, height = 900, margin = 110 } = {}) {
  const states = machine.states || [];
  if (!states.length) return {};
  const ids = states.map(s => s.id);
  const out = new Map(ids.map(id => [id, new Set()]));
  const inn = new Map(ids.map(id => [id, new Set()]));
  for (const t of machine.transitions || []) {
    if (!out.has(t.from) || !out.has(t.to) || t.from === t.to) continue;
    out.get(t.from).add(t.to);
    inn.get(t.to).add(t.from);
  }
  // Trap = non-accepting state whose only exits are self-loops (and it has incoming edges).
  const isTrap = (id) => {
    const s = states.find(x => x.id === id);
    return !s.accepting && !s.initial && out.get(id).size === 0 && inn.get(id).size > 0;
  };
  const start = (states.find(s => s.initial) || states[0]).id;
  const layer = new Map([[start, 0]]);
  const queue = [start];
  for (let i = 0; i < queue.length; i++) {
    for (const v of [...out.get(queue[i])].sort()) if (!layer.has(v)) { layer.set(v, layer.get(queue[i]) + 1); queue.push(v); }
  }
  let maxL = Math.max(...layer.values());
  for (const id of ids) if (!layer.has(id)) layer.set(id, ++maxL);   // unreachable: own columns at the end
  const traps = ids.filter(isTrap);
  const layers = [];
  for (const id of ids) {
    if (traps.includes(id)) continue;
    const L = layer.get(id);
    (layers[L] ||= []).push(id);
  }
  const cols = layers.filter(Boolean);
  // Barycenter sweeps (down then up) to reduce crossings.
  const pos = new Map();
  const setPos = () => cols.forEach(col => col.forEach((id, i) => pos.set(id, i - (col.length - 1) / 2)));
  setPos();
  for (let sweep = 0; sweep < 6; sweep++) {
    const seq = sweep % 2 === 0 ? cols.slice(1) : cols.slice(0, -1).reverse();
    for (const col of seq) {
      const nb = sweep % 2 === 0 ? inn : out;
      const bc = new Map(col.map(id => {
        const ns = [...nb.get(id)].filter(n => pos.has(n) && !col.includes(n));
        return [id, ns.length ? ns.reduce((a, n) => a + pos.get(n), 0) / ns.length : pos.get(id)];
      }));
      col.sort((a, b) => bc.get(a) - bc.get(b) || ids.indexOf(a) - ids.indexOf(b));
      col.forEach((id, i) => pos.set(id, i - (col.length - 1) / 2));
    }
  }
  // Coordinates; wrap into rows if there are many columns.
  const perRow = cols.length > 8 ? Math.ceil(cols.length / Math.ceil(cols.length / 7)) : cols.length;
  const rows = Math.ceil(cols.length / perRow);
  const usableW = width - 2 * margin - (traps.length ? 140 : 0);
  const dx = perRow > 1 ? Math.min(300, usableW / (perRow - 1)) : 0;
  const tallest = Math.max(...cols.map(c => c.length));
  const rowH = (height - 2 * margin) / rows;
  const dy = tallest > 1 ? Math.min(230, (rowH - 40) / (tallest - 1)) : 0;
  const totalW = dx * (perRow - 1);
  const x0 = margin + (usableW - totalW) / 2;
  const result = {};
  cols.forEach((col, c) => {
    const row = Math.floor(c / perRow);
    const inRow = c % perRow;
    const colIdx = row % 2 === 0 ? inRow : perRow - 1 - inRow;      // snake so edges stay short
    const cy = margin + rowH * (row + 0.5);
    col.forEach((id, i) => {
      // Small vertical stagger on alternate columns keeps straight edges from hiding labels.
      const stagger = col.length === 1 && cols.length > 2 ? (c % 2 ? 18 : -18) : 0;
      result[id] = { x: Math.round(x0 + colIdx * dx), y: Math.round(cy + (i - (col.length - 1) / 2) * dy + stagger) };
    });
  });
  traps.forEach((id, i) => { result[id] = { x: width - margin, y: height - margin - i * 120 }; });
  return result;
}

/** Return a copy of the machine with layout applied. */
export function withLayout(machine, opts) {
  const pos = autoLayout(machine, opts);
  return { ...machine, states: machine.states.map(s => ({ ...s, ...(pos[s.id] || {}) })) };
}

/** Number of edge crossings (straight-line approximation) — used by tests and as a quality metric. */
export function crossings(machine, pos) {
  const segs = (machine.transitions || []).filter(t => t.from !== t.to && pos[t.from] && pos[t.to]).map(t => [pos[t.from], pos[t.to], t]);
  const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  let n = 0;
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    const [a, b, t1] = segs[i], [c, d, t2] = segs[j];
    if ([t1.from, t1.to].some(x => x === t2.from || x === t2.to)) continue;
    if (ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d)) n++;
  }
  return n;
}

/** Minimum distance between any two state centres. */
export function minSeparation(pos) {
  const p = Object.values(pos);
  let m = Infinity;
  for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) m = Math.min(m, Math.hypot(p[i].x - p[j].x, p[i].y - p[j].y));
  return m;
}
