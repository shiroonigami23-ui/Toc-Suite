import { convertMooreToMealy } from './moore_mealy_automata.js';
import { runSimulation } from './moore_mealy_simulation.js';
import { addLogMessage } from './utils.js';

/**
 * Ensures a Moore machine has been converted to its equivalent Mealy form.
 * If the input machine is Moore, it performs the conversion.
 * If it's Mealy, it returns it as is.
 * @param {object} machine The machine to standardize.
 * @returns {Promise<object>} The equivalent Mealy machine.
 */
async function toMealy(machine) {
    if (machine.type === 'MOORE') {
        const silentStep = async () => {}; // Use silent step for non-animated conversion
        const mealyMachine = await convertMooreToMealy(machine, silentStep);
        return mealyMachine;
    }
    return machine;
}

/**
 * Exact equivalence check. Both machines are viewed as Mealy machines and explored in
 * lock-step over pairs of states (breadth-first), so the first difference found is a
 * shortest input on which the two output strings differ. A missing transition halts a
 * machine, exactly as in the simulator.
 * @returns {Promise<{equivalent: boolean, counterexample: string[]|null, outputA?: string, outputB?: string}>}
 */
export async function compareTransducers(machineA, machineB) {
    // Moore machines also emit λ(q0) before reading anything.
    if (machineA.type === 'MOORE' && machineB.type === 'MOORE') {
        const a0 = machineA.states.find(s => s.initial), b0 = machineB.states.find(s => s.initial);
        if ((a0?.output ?? '') !== (b0?.output ?? '')) {
            return { equivalent: false, counterexample: [], outputA: a0?.output ?? '', outputB: b0?.output ?? '' };
        }
    }
    const A = await toMealy(machineA), B = await toMealy(machineB);
    const sigma = [...new Set([...A.transitions, ...B.transitions].map(t => t.symbol))];
    const step = (m, q, a) => (q == null ? null : m.transitions.find(t => t.from === q && t.symbol === a) || null);
    const a0 = A.states.find(s => s.initial)?.id ?? null, b0 = B.states.find(s => s.initial)?.id ?? null;
    const queue = [{ qa: a0, qb: b0, word: [] }];
    const seen = new Set([`${a0}|${b0}`]);
    while (queue.length) {
        const { qa, qb, word } = queue.shift();
        for (const a of sigma) {
            const ta = step(A, qa, a), tb = step(B, qb, a);
            const oa = ta ? (ta.output ?? '') : null, ob = tb ? (tb.output ?? '') : null;
            if (oa !== ob) {
                const w = [...word, a];
                return { equivalent: false, counterexample: w, outputA: runSimulation(w.join(''), A, true).output, outputB: runSimulation(w.join(''), B, true).output };
            }
            if (!ta) continue;                       // both halted here
            const key = `${ta.to}|${tb.to}`;
            if (!seen.has(key)) { seen.add(key); queue.push({ qa: ta.to, qb: tb.to, word: [...word, a] }); }
        }
    }
    return { equivalent: true, counterexample: null };
}

/**
 * Checks whether two Mealy/Moore machines produce identical output for every input.
 * @returns {Promise<boolean>}
 */
export async function areEquivalent(machineA, machineB) {
    try {
        const r = await compareTransducers(machineA, machineB);
        if (r.equivalent) {
            addLogMessage('Machines are equivalent: identical output on every input (exact check).', 'check-circle');
            return true;
        }
        const w = r.counterexample.join('') || 'ε';
        addLogMessage(`FAIL: Input '<strong>${w}</strong>' produced output '<strong>${r.outputA}</strong>' (User) vs '<strong>${r.outputB}</strong>' (Solution).`, 'x-circle');
        return false;
    } catch (e) {
        console.error("Mealy/Moore Equivalence Check Failed:", e);
        addLogMessage(`Equivalence Check Error: ${e.message}`, 'alert-triangle');
        return false;
    }
}
