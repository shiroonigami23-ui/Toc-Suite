/**
 * tm_animation.js
 * Step-by-step construction animation for Turing Machines.
 */

import { setMachine } from './tm_state.js';
import { addLogMessage } from './utils.js';

export async function animateTmDrawing(machineToDraw, delay = 800) {
    let tempMachine = {
        type: machineToDraw.type || 'STANDARD',
        numTapes: machineToDraw.numTapes || 1,
        boundMode: machineToDraw.boundMode || 'UNBOUNDED',
        states: [],
        transitions: [],
        alphabet: machineToDraw.alphabet || ['0', '1'],
        tapeAlphabet: machineToDraw.tapeAlphabet || ['0', '1', 'B'],
        blankSymbol: machineToDraw.blankSymbol || 'B'
    };

    setMachine({ ...tempMachine });
    const logContainer = document.getElementById('stepLog');
    if (logContainer) logContainer.innerHTML = '<strong>Initiating TM Construction...</strong>';

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const state of machineToDraw.states || []) {
        tempMachine.states.push({ ...state });
        setMachine({ ...tempMachine });

        const stateEl = document.querySelector(`.state-group[data-id="${state.id}"]`);
        if (stateEl) stateEl.classList.add('state-animating');

        addLogMessage(
            `Adding state: <strong>${state.id}</strong>${state.initial ? ' (Initial)' : ''}${state.accepting ? ' (Halt)' : ''}`,
            'plus-circle'
        );
        await sleep(delay);
    }

    for (const trans of machineToDraw.transitions || []) {
        tempMachine.transitions.push({ ...trans });
        setMachine({ ...tempMachine });

        const readLabel = Array.isArray(trans.reads) ? `[${trans.reads.join(',')}]` : trans.read;
        const writeLabel = Array.isArray(trans.writes) ? `[${trans.writes.join(',')}]` : trans.write;
        const moveLabel = Array.isArray(trans.moves) ? `[${trans.moves.join(',')}]` : trans.move;
        addLogMessage(
            `Drawing transition: <strong>${trans.from} -> ${trans.to}</strong> (Read: ${readLabel}; Write: ${writeLabel}, Move: ${moveLabel})`,
            'git-branch'
        );
        await sleep(delay);
    }

    document.querySelectorAll('.state-animating').forEach((el) => el.classList.remove('state-animating'));
    addLogMessage('Turing Machine construction complete.', 'check-circle');
}
