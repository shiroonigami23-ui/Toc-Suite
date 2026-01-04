// This file defines the practice problems for Mealy and Moore machines.
window.MM_PRACTICE_BANK = {
    // --- MOORE MACHINE CONSTRUCTION PROBLEMS ---
    MOORE: {
        easy: [
            {
                q: 'Moore Machine that outputs "1" if the input string length is even (Σ={0, 1}, Γ={0, 1}). Output "0" for odd lengths.',
                sol: '2 states: q0(start/even/output 1), q1(odd/output 0).',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "1" },
                        { id: "q1", x: 350, y: 300, initial: false, output: "0" }
                    ],
                    transitions: [
                        { from: "q0", to: "q1", symbol: "0" },
                        { from: "q0", to: "q1", symbol: "1" },
                        { from: "q1", to: "q0", symbol: "0" },
                        { from: "q1", to: "q0", symbol: "1" }
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["0", "1"]
                }
            },
            {
                q: 'Moore Machine that outputs "A" on all strings containing at least one "a" (Σ={a, b}, Γ={A, B}). Initial output is "B".',
                sol: '2 states: q0(start/output B), q1(seen a/output A).',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "B" },
                        { id: "q1", x: 350, y: 300, initial: false, output: "A" }
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "b" },
                        { from: "q0", to: "q1", symbol: "a" },
                        { from: "q1", to: "q1", symbol: "a" },
                        { from: "q1", to: "q1", symbol: "b" }
                    ],
                    alphabet: ["a", "b"],
                    output_alphabet: ["A", "B"]
                }
            },
            {
                q: 'Moore Machine that outputs "X" only after the exact sequence "10" (Σ={0, 1}, Γ={N, X}). Initial output is "N".',
                sol: '3 states: q0(N), q1(seen 1, N), q2(seen 10, X).',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "N" },
                        { id: "q1", x: 350, y: 200, initial: false, output: "N" },
                        { id: "q2", x: 550, y: 300, initial: false, output: "X" }
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "0" },
                        { from: "q0", to: "q1", symbol: "1" },
                        { from: "q1", to: "q2", symbol: "0" },
                        { from: "q1", to: "q1", symbol: "1" },
                        { from: "q2", to: "q2", symbol: "0" }, 
                        { from: "q2", to: "q2", symbol: "1" }
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["N", "X"]
                }
            },
            {
                q: 'Moore Machine that outputs "Y" if the input string contains an odd number of "0"s (Σ={0, 1}, Γ={Y, N}). Initial output is "N".',
                sol: '2 states: qE(even/N), qO(odd/Y).',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "qE", x: 150, y: 300, initial: true, output: "N" },
                        { id: "qO", x: 350, y: 300, initial: false, output: "Y" }
                    ],
                    transitions: [
                        { from: "qE", to: "qO", symbol: "0" },
                        { from: "qE", to: "qE", symbol: "1" },
                        { from: "qO", to: "qE", symbol: "0" },
                        { from: "qO", to: "qO", symbol: "1" }
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["Y", "N"]
                }
            }
        ],
        medium: [
            {
                q: 'Moore Machine that outputs the modulo 3 remainder of the number of "a"s seen so far (Σ={a, b}, Γ={0, 1, 2}). Output is the state value.',
                sol: '3 states: q0(mod 0, output 0), q1(mod 1, output 1), q2(mod 2, output 2).',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "0" },
                        { id: "q1", x: 350, y: 200, initial: false, output: "1" },
                        { id: "q2", x: 350, y: 400, initial: false, output: "2" }
                    ],
                    transitions: [
                        { from: "q0", to: "q1", symbol: "a" },
                        { from: "q0", to: "q0", symbol: "b" },
                        { from: "q1", to: "q2", symbol: "a" },
                        { from: "q1", to: "q1", symbol: "b" },
                        { from: "q2", to: "q0", symbol: "a" },
                        { from: "q2", to: "q2", symbol: "b" }
                    ],
                    alphabet: ["a", "b"],
                    output_alphabet: ["0", "1", "2"]
                }
            },
            {
                q: 'Moore Machine detecting the sequence "11" in binary input (Σ={0, 1}, Γ={N, Y}). Output "Y" if the last two inputs were "11". Initial output "N".',
                sol: '4 states: q0(N), q1(seen 1, N), q11(seen 11, Y). A minimal implementation merges states.',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "N" },
                        { id: "q1", x: 350, y: 200, initial: false, output: "N" },
                        { id: "q11", x: 550, y: 300, initial: false, output: "Y" }
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "0" },
                        { from: "q0", to: "q1", symbol: "1" },
                        { from: "q1", to: "q0", symbol: "0" },
                        { from: "q1", to: "q11", symbol: "1" }, 
                        { from: "q11", to: "q0", symbol: "0" }, 
                        { from: "q11", to: "q1", symbol: "1" }  
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["N", "Y"]
                }
            },
            {
                q: 'Moore Machine that outputs the **number** of consecutive "a"s just read, up to a maximum output of 2 (Σ={a, b}, Γ={0, 1, 2}). Initial output is 0.',
                sol: '3 states: q0(0 cons a), q1(1 cons a), q2(>=2 cons a). Output is the state value.',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "0" },
                        { id: "q1", x: 350, y: 200, initial: false, output: "1" },
                        { id: "q2", x: 550, y: 300, initial: false, output: "2" }
                    ],
                    transitions: [
                        { from: "q0", to: "q1", symbol: "a" },
                        { from: "q0", to: "q0", symbol: "b" },
                        { from: "q1", to: "q2", symbol: "a" },
                        { from: "q1", to: "q0", symbol: "b" },
                        { from: "q2", to: "q2", symbol: "a" },
                        { from: "q2", to: "q0", symbol: "b" }
                    ],
                    alphabet: ["a", "b"],
                    output_alphabet: ["0", "1", "2"]
                }
            }
        ],
        hard: [
            {
                q: 'Moore Machine whose output is the remainder modulo 4 of the binary number read (Σ={0, 1}, Γ={0, 1, 2, 3}).',
                sol: '4 states, tracking mod 4 remainder. Output is the remainder.',
                machine: {
                    type: "MOORE",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true, output: "0" },
                        { id: "q1", x: 350, y: 200, initial: false, output: "1" },
                        { id: "q2", x: 550, y: 300, initial: false, output: "2" },
                        { id: "q3", x: 350, y: 400, initial: false, output: "3" }
                    ],
                    transitions: [
                        // Transitions are (2*current + input) mod 4
                        { from: "q0", to: "q0", symbol: "0" }, // (2*0+0)%4=0
                        { from: "q0", to: "q1", symbol: "1" }, // (2*0+1)%4=1
                        { from: "q1", to: "q2", symbol: "0" }, // (2*1+0)%4=2
                        { from: "q1", to: "q3", symbol: "1" }, // (2*1+1)%4=3
                        { from: "q2", to: "q0", symbol: "0" }, // (2*2+0)%4=0
                        { from: "q2", to: "q1", symbol: "1" }, // (2*2+1)%4=1
                        { from: "q3", to: "q2", symbol: "0" }, // (2*3+0)%4=2
                        { from: "q3", to: "q3", symbol: "1" }  // (2*3+1)%4=3
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["0", "1", "2", "3"]
                }
            }
        ]
    },

    // --- MEALY MACHINE CONSTRUCTION PROBLEMS ---
    MEALY: {
        easy: [
            {
                q: 'Mealy Machine that outputs "X" when the input changes (0 to 1, or 1 to 0), and "S" otherwise (Σ={0, 1}, Γ={S, X}).',
                sol: '2 states: q0(last input 0), q1(last input 1).',
                machine: {
                    type: "MEALY",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true }, 
                        { id: "q1", x: 350, y: 300, initial: false }
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "0", output: "S" }, // 0->0 : Same
                        { from: "q0", to: "q1", symbol: "1", output: "X" }, // 0->1 : Change
                        { from: "q1", to: "q0", symbol: "0", output: "X" }, // 1->0 : Change
                        { from: "q1", to: "q1", symbol: "1", output: "S" }  // 1->1 : Same
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["S", "X"]
                }
            },
            {
                q: 'Mealy Machine that outputs "1" when the current input is "0" and the previous input was "1" (Σ={0, 1}, Γ={0, 1}). Output "0" otherwise.',
                sol: '2 states: q0(last input 0 or start), q1(last input 1).',
                machine: {
                    type: "MEALY",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true }, 
                        { id: "q1", x: 350, y: 300, initial: false } 
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "0", output: "0" },
                        { from: "q0", to: "q1", symbol: "1", output: "0" },
                        { from: "q1", to: "q0", symbol: "0", output: "1" }, // Detects 10 pattern
                        { from: "q1", to: "q1", symbol: "1", output: "0" }
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["0", "1"]
                }
            },
            {
                q: 'Mealy Machine that outputs the **current** input symbol (identity function) (Σ={A, B}, Γ={A, B}).',
                sol: '1 state, transitions loop back and output the input symbol.',
                machine: {
                    type: "MEALY",
                    states: [
                        { id: "q0", x: 300, y: 300, initial: true }
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "A", output: "A" },
                        { from: "q0", to: "q0", symbol: "B", output: "B" }
                    ],
                    alphabet: ["A", "B"],
                    output_alphabet: ["A", "B"]
                }
            }
        ],
        medium: [
            {
                q: 'Mealy Machine that calculates a 1-bit binary adder. Inputs are (A, B) pairs, outputs are Sum (Σ={00, 01, 10, 11}, Γ={0, 1}). States track Carry bit.',
                sol: '2 states: q0(Carry 0), q1(Carry 1).',
                machine: {
                    type: "MEALY",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true }, // Carry In = 0
                        { id: "q1", x: 350, y: 300, initial: false } // Carry In = 1
                    ],
                    transitions: [
                        // From q0 (Carry In = 0)
                        { from: "q0", to: "q0", symbol: "00", output: "0" }, 
                        { from: "q0", to: "q0", symbol: "01", output: "1" }, 
                        { from: "q0", to: "q0", symbol: "10", output: "1" }, 
                        { from: "q0", to: "q1", symbol: "11", output: "0" }, // Carry Out 1
                        // From q1 (Carry In = 1)
                        { from: "q1", to: "q0", symbol: "00", output: "1" }, // Carry Out 0
                        { from: "q1", to: "q1", symbol: "01", output: "0" }, 
                        { from: "q1", to: "q1", symbol: "10", output: "0" }, 
                        { from: "q1", to: "q1", symbol: "11", output: "1" }  
                    ],
                    alphabet: ["00", "01", "10", "11"],
                    output_alphabet: ["0", "1"]
                }
            },
            {
                q: 'Mealy Machine that outputs "P" when an even number of "0"s has been read, and "I" (for odd) otherwise (Σ={0, 1}, Γ={P, I}).',
                sol: '2 states: qE(Even 0s), qI(Odd 0s). Output must be on the transition to the *next* state.',
                machine: {
                    type: "MEALY",
                    states: [
                        { id: "qE", x: 150, y: 300, initial: true }, 
                        { id: "qI", x: 350, y: 300, initial: false }
                    ],
                    transitions: [
                        // From qE (Even count)
                        { from: "qE", to: "qI", symbol: "0", output: "I" }, // Output I (next state is odd)
                        { from: "qE", to: "qE", symbol: "1", output: "P" }, // Output P (next state is even)
                        // From qI (Odd count)
                        { from: "qI", to: "qE", symbol: "0", output: "P" }, // Output P (next state is even)
                        { from: "qI", to: "qI", symbol: "1", output: "I" }  // Output I (next state is odd)
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["P", "I"]
                }
            }
        ],
        hard: [
            {
                q: 'Mealy Machine that outputs "R" when the input ends with "110", and "N" otherwise (Σ={0, 1}, Γ={N, R}).',
                sol: '4 states required for 3-bit sequence detection.',
                machine: {
                    type: "MEALY",
                    states: [
                        { id: "q0", x: 150, y: 300, initial: true }, 
                        { id: "q1", x: 350, y: 200, initial: false }, // seen 1
                        { id: "q11", x: 550, y: 300, initial: false }, // seen 11
                        { id: "q0_0", x: 350, y: 400, initial: false } // seen 0
                    ],
                    transitions: [
                        { from: "q0", to: "q0", symbol: "0", output: "N" },
                        { from: "q0", to: "q1", symbol: "1", output: "N" },
                        
                        { from: "q1", to: "q0", symbol: "0", output: "N" },
                        { from: "q1", to: "q11", symbol: "1", output: "N" },
                        
                        { from: "q11", to: "q0", symbol: "1", output: "N" }, // reset pattern to 1
                        { from: "q11", to: "q0_0", symbol: "0", output: "R" }, // Final 110 output R
                        
                        { from: "q0_0", to: "q0_0", symbol: "0", output: "N" }, // reset pattern to 0
                        { from: "q0_0", to: "q1", symbol: "1", output: "N" }
                    ],
                    alphabet: ["0", "1"],
                    output_alphabet: ["N", "R"]
                }
            }
        ]
    },

    // --- CONVERSION PROBLEMS: MOORE -> MEALY ---
    MOORE_TO_MEALY: [
        {
            q: 'Convert the Moore machine (Output is length mod 2) into an equivalent Mealy Machine.',
            sol: 'The equivalent Mealy machine has 2 states. The Mealy output depends on the NEXT state of the Moore machine.',
            machine: {
                type: "MOORE",
                states: [
                    { id: "q0", x: 150, y: 300, initial: true, output: "1" }, // Even length (L=0)
                    { id: "q1", x: 350, y: 300, initial: false, output: "0" }  // Odd length (L=1)
                ],
                transitions: [
                    { from: "q0", to: "q1", symbol: "0" },
                    { from: "q0", to: "q1", symbol: "1" },
                    { from: "q1", to: "q0", symbol: "0" },
                    { from: "q1", to: "q0", symbol: "1" }
                ],
                alphabet: ["0", "1"],
                output_alphabet: ["0", "1"]
            }
        },
        {
            q: 'Convert the Moore machine (Outputs "X" after "10") into an equivalent Mealy Machine.',
            sol: 'The equivalent Mealy machine has 3 states. Outputs occur on the transitions leading to the state with output "X".',
            machine: {
                type: "MOORE",
                states: [
                    { id: "q0", x: 150, y: 300, initial: true, output: "N" },
                    { id: "q1", x: 350, y: 200, initial: false, output: "N" },
                    { id: "q2", x: 550, y: 300, initial: false, output: "X" }
                ],
                transitions: [
                    { from: "q0", to: "q0", symbol: "0" },
                    { from: "q0", to: "q1", symbol: "1" },
                    { from: "q1", to: "q2", symbol: "0" }, 
                    { from: "q1", to: "q1", symbol: "1" },
                    { from: "q2", to: "q2", symbol: "0" },
                    { from: "q2", to: "q2", symbol: "1" }
                ],
                alphabet: ["0", "1"],
                output_alphabet: ["N", "X"]
            }
        },
        {
            q: 'Convert the Moore machine (Mod 3 remainder of "a"s) into an equivalent Mealy Machine.',
            sol: 'The equivalent Mealy machine has 3 states. Output on transition = output of destination Moore state.',
            machine: {
                type: "MOORE",
                states: [
                    { id: "q0", x: 150, y: 300, initial: true, output: "0" },
                    { id: "q1", x: 350, y: 200, initial: false, output: "1" },
                    { id: "q2", x: 350, y: 400, initial: false, output: "2" }
                ],
                transitions: [
                    { from: "q0", to: "q1", symbol: "a" },
                    { from: "q0", to: "q0", symbol: "b" },
                    { from: "q1", to: "q2", symbol: "a" },
                    { from: "q1", to: "q1", symbol: "b" },
                    { from: "q2", to: "q0", symbol: "a" },
                    { from: "q2", to: "q2", symbol: "b" }
                ],
                alphabet: ["a", "b"],
                output_alphabet: ["0", "1", "2"]
            }
        }
    ]
};