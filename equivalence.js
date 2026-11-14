import * as FA from './core/fa.js';

/**
 * Logical equivalence of two finite automata (DFA / NFA / ε-NFA, drawn or library format).
 * Both are determinised over the UNION of their alphabets and compared with a product
 * construction, so a machine that simply never uses a symbol is still compared correctly.
 * @returns {Promise<boolean>}
 */
export async function areEquivalent(machineA, machineB) {
    return (await compareMachines(machineA, machineB)).equivalent;
}

/**
 * Like areEquivalent, but also returns the shortest string on which they differ.
 * @returns {Promise<{equivalent:boolean, counterexample:string|null, acceptedBy:'a'|'b'|null}>}
 */
export async function compareMachines(machineA, machineB) {
    try {
        const sigma = [...new Set([...FA.machineAlphabet(machineA), ...FA.machineAlphabet(machineB)])].sort();
        const r = FA.compare(FA.toMinimalDfa(machineA, sigma), FA.toMinimalDfa(machineB, sigma));
        return { ...r, counterexample: r.counterexample ? (r.counterexample.join('') || 'ε') : null };
    } catch (e) {
        console.error('Equivalence check failed:', e);
        return { equivalent: false, counterexample: null, acceptedBy: null };
    }
}
