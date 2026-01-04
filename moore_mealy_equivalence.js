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
 * Generates a set of short, random test strings to sample equivalence.
 * Since proving equivalence mathematically is complex (requires minimization and isomorphism on state-output equivalence),
 * we use simulation testing as a robust, practical verification tool for user feedback.
 * @param {string[]} inputAlphabet The alphabet to generate strings from.
 * @returns {string[]} An array of test strings.
 */
function generateTestStrings(inputAlphabet) {
    if (inputAlphabet.length === 0) return [''];
    const tests = new Set(['', inputAlphabet[0]]);
    
    for (let len = 1; len <= 5; len++) {
        for (let i = 0; i < 5; i++) { // Generate multiple strings of this length
            let s = '';
            for (let j = 0; j < len; j++) {
                s += inputAlphabet[Math.floor(Math.random() * inputAlphabet.length)];
            }
            tests.add(s);
        }
    }
    return Array.from(tests).filter(s => s.length <= 5); // Limit length for performance
}

/**
 * The main function to check for logical equivalence between two Mealy/Moore automata.
 * Equivalence means that for the same input string, both machines produce the identical output string.
 * This implementation uses a robust simulation sampling method.
 * * @param {object} machineA The first automaton (usually the user's).
 * @param {object} machineB The second automaton (usually the solution).
 * @returns {Promise<boolean>} A promise that resolves to true if they are equivalent based on testing.
 */
export async function areEquivalent(machineA, machineB) {
    try {
        addLogMessage('Standardizing machines to Mealy format...', 'code');
        const mealyA = await toMealy(machineA);
        const mealyB = await toMealy(machineB);

        // Determine the common alphabet
        const alphabetA = new Set(mealyA.transitions.map(t => t.symbol));
        const alphabetB = new Set(mealyB.transitions.map(t => t.symbol));
        const inputAlphabet = Array.from(new Set([...alphabetA, ...alphabetB]));

        if (inputAlphabet.length === 0) {
            if (mealyA.transitions.length === 0 && mealyB.transitions.length === 0) return true;
            throw new Error("No common input alphabet defined for testing.");
        }
        
        addLogMessage(`Input Alphabet detected: {${inputAlphabet.join(', ')}}.`, 'list');
        
        const testStrings = generateTestStrings(inputAlphabet);
        let allTestsPassed = true;

        addLogMessage(`Running ${testStrings.length} equivalence test strings...`, 'test-tube');

        for (const input of testStrings) {
            // Run silent simulation on both standardized Mealy machines
            const resultA = runSimulation(input, mealyA, true);
            const resultB = runSimulation(input, mealyB, true);
            
            // Check for output mismatch
            if (resultA.output !== resultB.output) {
                allTestsPassed = false;
                addLogMessage(`FAIL: Input '<strong>${input || 'ε'}</strong>' produced output '<strong>${resultA.output}</strong>' (User) vs '<strong>${resultB.output}</strong>' (Solution).`, 'x-circle');
                break;
            }
        }

        if (allTestsPassed) {
            addLogMessage('All sampled test strings produced identical outputs.', 'check-circle');
            return true;
        }

        return false;

    } catch (e) {
        console.error("Mealy/Moore Equivalence Check Failed:", e);
        addLogMessage(`Equivalence Check Error: ${e.message}`, 'alert-triangle');
        return false;
    }
}

