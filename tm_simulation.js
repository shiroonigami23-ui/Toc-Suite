/**
 * tm_simulation.js
 * Core simulation logic for the Turing Machine.
 */

import { addLogMessage } from './utils.js';
import { updateTapeUI } from './tm_visualizer.js';

export let activeSim = {
    tapes: [['B']],
    heads: [0],
    currentStateId: null,
    steps: 0,
    maxSteps: 1000,
    isRunning: false,
    leftBound: 0,
    rightBound: 0
};

export function initInteractiveSim(inputString, machine) {
    const blank = machine.blankSymbol || 'B';
    const baseTape = inputString.length > 0 ? inputString.split('') : [blank];

    activeSim.tapes = machine.type === 'MULTI_TAPE'
        ? Array.from({ length: machine.numTapes || 1 }, (_, i) => (i === 0 ? [...baseTape] : [blank]))
        : [[...baseTape]];

    activeSim.heads = Array.from({ length: machine.numTapes || 1 }, () => 0);
    activeSim.currentStateId = machine.states.find((s) => s.initial)?.id || null;
    activeSim.steps = 0;
    activeSim.isRunning = true;
    activeSim.leftBound = 0;
    activeSim.rightBound = Math.max(baseTape.length - 1, 0);

    updateTapeUI(activeSim.tapes, activeSim.heads);
    addLogMessage(`Simulation started with input: "${inputString}"`, 'play');
}

async function logTmStep(stateId, symbolRead, symbolWrite, direction) {
    const message = `<span style="color:#10b981; font-weight:bold;">${stateId}:</span> Read '${symbolRead}', Wrote '${symbolWrite}', Moved ${direction}`;
    addLogMessage(message, 'activity');
}

function isLba(machine) {
    return String(machine.type || '') === 'LBA';
}

function expandTapeIfNeeded(tape, head, blank, machine) {
    if (isLba(machine)) {
        if (head < activeSim.leftBound || head > activeSim.rightBound) {
            return { ok: false, head, reason: 'LBA head out of bounds.' };
        }
        return { ok: true, head };
    }

    if (head < 0) {
        tape.unshift(blank);
        return { ok: true, head: 0 };
    }
    if (head >= tape.length) {
        tape.push(blank);
    }
    return { ok: true, head };
}

export async function stepTmSimulation(machine) {
    if (!activeSim.isRunning) return { status: 'stopped' };

    const currentState = machine.states.find((s) => s.id === activeSim.currentStateId);
    if (!currentState) return { status: 'error' };

    if (currentState.accepting) {
        activeSim.isRunning = false;
        addLogMessage('Halted: Accepted!', 'check-circle');
        return { status: 'accepted' };
    }

    const tapeIdx = 0;
    const currentTape = activeSim.tapes[tapeIdx];
    let head = activeSim.heads[tapeIdx];
    const blank = machine.blankSymbol || 'B';

    const bounds = expandTapeIfNeeded(currentTape, head, blank, machine);
    if (!bounds.ok) {
        activeSim.isRunning = false;
        addLogMessage(bounds.reason, 'x-circle');
        return { status: 'rejected' };
    }
    head = bounds.head;
    activeSim.heads[tapeIdx] = head;

    const readSymbol = currentTape[head];
    const matches = machine.transitions.filter((t) => t.from === activeSim.currentStateId && t.read === readSymbol);
    const transition = matches[0];

    if (!transition) {
        activeSim.isRunning = false;
        addLogMessage('No transition: Rejected.', 'x-circle');
        return { status: 'rejected' };
    }
    if (matches.length > 1 && String(machine.type || '') === 'NON_DET') {
        addLogMessage(`NTM branch choices: ${matches.length}. Stepping first branch.`, 'git-fork');
    }

    await logTmStep(activeSim.currentStateId, readSymbol, transition.write, transition.move);

    currentTape[head] = transition.write;
    if (transition.move === 'R') activeSim.heads[tapeIdx] += 1;
    else if (transition.move === 'L') activeSim.heads[tapeIdx] -= 1;

    if (isLba(machine) && (activeSim.heads[tapeIdx] < activeSim.leftBound || activeSim.heads[tapeIdx] > activeSim.rightBound)) {
        activeSim.isRunning = false;
        addLogMessage('LBA boundary hit: Rejected.', 'x-circle');
        return { status: 'rejected' };
    }

    activeSim.currentStateId = transition.to;
    activeSim.steps += 1;

    updateTapeUI(activeSim.tapes, activeSim.heads);
    const { highlightStep } = await import('./tm_renderer.js');
    highlightStep(activeSim.currentStateId, transition);

    return { status: 'running' };
}

export function runTmSimulation(inputString, machine, maxSteps = 1000) {
    if (String(machine.type || '') === 'NON_DET') {
        return runNtmBfsSimulation(inputString, machine, maxSteps);
    }
    if (String(machine.type || '') === 'MULTI_TAPE') {
        return runMultiTapeBatch(inputString, machine, maxSteps);
    }

    const blank = machine.blankSymbol || 'B';
    const baseTape = inputString.length > 0 ? inputString.split('') : [blank];
    let currentTape = [...baseTape];
    let head = 0;
    let currentStateId = machine.states.find((s) => s.initial)?.id;
    const path = [{ state: currentStateId, tape: [...currentTape], head, log: 'Initial' }];
    const leftBound = 0;
    const rightBound = Math.max(baseTape.length - 1, 0);
    let steps = 0;

    while (steps < maxSteps) {
        const currentState = machine.states.find((s) => s.id === currentStateId);
        if (!currentState) break;
        if (currentState.accepting) {
            return { success: true, path, finalTape: currentTape.join(''), message: 'Accepted' };
        }

        if (isLba(machine) && (head < leftBound || head > rightBound)) {
            return { success: false, path, message: 'Rejected (LBA boundary).' };
        }

        if (!isLba(machine)) {
            if (head < 0) {
                currentTape.unshift(blank);
                head = 0;
            } else if (head >= currentTape.length) {
                currentTape.push(blank);
            }
        }

        const readSymbol = currentTape[head] ?? blank;
        const transition = machine.transitions.find((t) => t.from === currentStateId && t.read === readSymbol);
        if (!transition) return { success: false, path, message: 'Rejected' };

        currentTape[head] = transition.write;
        if (transition.move === 'R') head += 1;
        else if (transition.move === 'L') head -= 1;

        currentStateId = transition.to;
        steps += 1;
        path.push({ state: currentStateId, tape: [...currentTape], head, transition });
    }
    return { success: false, path, message: 'Timeout' };
}

function runNtmBfsSimulation(inputString, machine, maxSteps = 1000) {
    const blank = machine.blankSymbol || 'B';
    const initial = machine.states.find((s) => s.initial);
    if (!initial) return { success: false, path: [], message: 'Missing initial state' };

    const startTape = inputString.length > 0 ? inputString.split('') : [blank];
    const queue = [{
        state: initial.id,
        tape: [...startTape],
        head: 0,
        path: [{ state: initial.id, tape: [...startTape], head: 0, log: 'Initial' }],
        steps: 0
    }];

    while (queue.length > 0) {
        const node = queue.shift();
        const currentState = machine.states.find((s) => s.id === node.state);
        if (!currentState) continue;
        if (currentState.accepting) {
            return { success: true, path: node.path, finalTape: node.tape.join(''), message: 'Accepted (NTM branch)' };
        }
        if (node.steps >= maxSteps) continue;

        let tape = [...node.tape];
        let head = node.head;
        if (head < 0) {
            tape.unshift(blank);
            head = 0;
        } else if (head >= tape.length) {
            tape.push(blank);
        }

        const read = tape[head];
        const matches = machine.transitions.filter((t) => t.from === node.state && t.read === read);
        for (const tr of matches) {
            const nextTape = [...tape];
            let nextHead = head;
            nextTape[nextHead] = tr.write;
            if (tr.move === 'R') nextHead += 1;
            else if (tr.move === 'L') nextHead -= 1;
            queue.push({
                state: tr.to,
                tape: nextTape,
                head: nextHead,
                steps: node.steps + 1,
                path: [...node.path, { state: tr.to, tape: [...nextTape], head: nextHead, transition: tr }]
            });
        }
    }

    return { success: false, path: [], message: 'Rejected' };
}

function runMultiTapeBatch(inputString, machine, maxSteps = 1000) {
    const blank = machine.blankSymbol || 'B';
    const initial = machine.states.find((s) => s.initial);
    if (!initial) return { success: false, path: [], message: 'Missing initial state' };

    const numTapes = Number(machine.numTapes || 1);
    const tapes = Array.from({ length: numTapes }, (_, i) => i === 0
        ? (inputString.length > 0 ? inputString.split('') : [blank])
        : [blank]);
    const heads = Array.from({ length: numTapes }, () => 0);
    let state = initial.id;
    const path = [{ state, tapes: JSON.parse(JSON.stringify(tapes)), heads: [...heads], log: 'Initial' }];

    for (let step = 0; step < maxSteps; step += 1) {
        const current = machine.states.find((s) => s.id === state);
        if (!current) break;
        if (current.accepting) {
            return { success: true, path, message: 'Accepted' };
        }

        const reads = tapes.map((tape, i) => {
            const h = heads[i];
            if (h < 0) {
                tape.unshift(blank);
                heads[i] = 0;
            } else if (h >= tape.length) {
                tape.push(blank);
            }
            return tape[heads[i]];
        });

        const tr = machine.transitions.find((t) =>
            t.from === state &&
            Array.isArray(t.reads) &&
            t.reads.length === numTapes &&
            t.reads.every((sym, i) => sym === reads[i])
        );
        if (!tr) return { success: false, path, message: 'Rejected' };

        tr.writes.forEach((w, i) => { tapes[i][heads[i]] = w; });
        tr.moves.forEach((mv, i) => {
            if (mv === 'R') heads[i] += 1;
            else if (mv === 'L') heads[i] -= 1;
        });
        state = tr.to;
        path.push({ state, tapes: JSON.parse(JSON.stringify(tapes)), heads: [...heads], transition: tr });
    }

    return { success: false, path, message: 'Timeout' };
}

export function getNTMBranches(machine, currentStateId, readSymbol) {
    const matches = machine.transitions.filter((t) =>
        t.from === currentStateId && t.read === readSymbol
    );

    if (matches.length > 1) {
        addLogMessage(`NTM: Found ${matches.length} possible paths. Branching...`, 'git-fork');
    }
    return matches;
}

export function stepMultiTape(machine) {
    if (!activeSim.isRunning) return { status: 'stopped' };

    const currentState = machine.states.find((s) => s.id === activeSim.currentStateId);
    const blank = machine.blankSymbol || 'B';
    if (!currentState || activeSim.steps >= activeSim.maxSteps) {
        activeSim.isRunning = false;
        return { status: 'error', message: currentState ? 'Max steps exceeded.' : 'Invalid state.' };
    }

    if (currentState.accepting) {
        activeSim.isRunning = false;
        import('./tm_renderer.js').then((m) => m.highlightStep(activeSim.currentStateId, null));
        addLogMessage('Multi-Tape Machine Halted: Accepted!', 'check-circle');
        return { status: 'accepted' };
    }

    const currentSymbols = activeSim.tapes.map((tape, i) => {
        let head = activeSim.heads[i];
        if (head < 0) {
            tape.unshift(blank);
            activeSim.heads[i] = 0;
            head = 0;
        } else if (head >= tape.length) {
            tape.push(blank);
        }
        return tape[head];
    });

    const transition = machine.transitions.find((t) => {
        return t.from === activeSim.currentStateId &&
            Array.isArray(t.reads) &&
            t.reads.every((symbol, i) => symbol === currentSymbols[i]);
    });

    if (!transition) {
        activeSim.isRunning = false;
        addLogMessage(`No Multi-Tape transition for [${currentSymbols.join(', ')}]. Rejected.`, 'x-circle');
        return { status: 'rejected' };
    }

    transition.writes.forEach((symbol, i) => {
        activeSim.tapes[i][activeSim.heads[i]] = symbol;
    });
    transition.moves.forEach((move, i) => {
        if (move === 'R') activeSim.heads[i] += 1;
        else if (move === 'L') activeSim.heads[i] -= 1;
    });

    const prevStateId = activeSim.currentStateId;
    activeSim.currentStateId = transition.to;
    activeSim.steps += 1;

    updateTapeUI(activeSim.tapes, activeSim.heads);
    import('./tm_renderer.js').then((m) => m.highlightStep(prevStateId, transition));
    addLogMessage(
        `Step ${activeSim.steps}: Read [${currentSymbols.join(',')}], Wrote [${transition.writes.join(',')}], Move [${transition.moves.join(',')}]`,
        'step-forward'
    );

    return { status: 'running', heads: [...activeSim.heads], state: activeSim.currentStateId };
}
