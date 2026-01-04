/**
 * pda_practice_bank.js - Part 1: Classic Context-Free Languages
 * Contains high-level PDA problems with deterministic and non-deterministic solutions.
 */

 const PDA_PRACTICE_BANK_P1 = [
    {
        id: "pda_an_bn",
        title: "Equality: a^n b^n",
        level: "easy",
        description: "Design a PDA that accepts the language L = {a^n b^n | n ≥ 0} over the alphabet {a, b}. Use the stack to count 'a's and match them with 'b's.",
        instruction: "Push an 'X' for every 'a'. Pop an 'X' for every 'b'. Accept by empty stack or final state.",
        solution: {
            type: "PDA",
            states: [
                { id: "q0", initial: true, accepting: true, x: 200, y: 300 },
                { id: "q1", initial: false, accepting: false, x: 450, y: 300 },
                { id: "q2", initial: false, accepting: true, x: 700, y: 300 }
            ],
            transitions: [
                { from: "q0", to: "q1", symbol: "a", pop: "Z", push: "XZ" },
                { from: "q1", to: "q1", symbol: "a", pop: "X", push: "XX" },
                { from: "q1", to: "q2", symbol: "b", pop: "X", push: "" },
                { from: "q2", to: "q2", symbol: "b", pop: "X", push: "" },
                { from: "q2", to: "q2", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["X", "Z"]
        }
    },
    {
        id: "pda_balanced_parentheses",
        title: "Balanced Parentheses",
        level: "basic",
        description: "Design a PDA that accepts strings of balanced parentheses: L = {balanced strings of '(' and ')'}.",
        instruction: "Push for '(' and pop for ')'. Ensure the stack only contains the initial symbol at the end.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: true, x: 200, y: 300 },
                { id: "work", initial: false, accepting: false, x: 450, y: 300 },
                { id: "done", initial: false, accepting: true, x: 700, y: 300 }
            ],
            transitions: [
                { from: "start", to: "work", symbol: "(", pop: "Z", push: "CZ" },
                { from: "work", to: "work", symbol: "(", pop: "C", push: "CC" },
                { from: "work", to: "work", symbol: ")", pop: "C", push: "" },
                { from: "work", to: "done", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["(", ")"],
            stackAlphabet: ["C", "Z"]
        }
    },
    {
        id: "pda_wwr",
        title: "Even Palindrome (ww^R)",
        level: "medium",
        description: "L = {ww^R | w ∈ {0, 1}*}. This is a non-deterministic PDA where you must guess the middle of the string.",
        instruction: "Push the first half of the string onto the stack. Use an epsilon transition to non-deterministically start popping for the second half.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_push", initial: true, accepting: true, x: 200, y: 300 },
                { id: "q_pop", initial: false, accepting: false, x: 500, y: 300 },
                { id: "q_accept", initial: false, accepting: true, x: 800, y: 300 }
            ],
            transitions: [
                { from: "q_push", to: "q_push", symbol: "0", pop: "Z", push: "0Z" },
                { from: "q_push", to: "q_push", symbol: "1", pop: "Z", push: "1Z" },
                { from: "q_push", to: "q_push", symbol: "0", pop: "0", push: "00" },
                { from: "q_push", to: "q_push", symbol: "0", pop: "1", push: "01" },
                { from: "q_push", to: "q_push", symbol: "1", pop: "0", push: "10" },
                { from: "q_push", to: "q_push", symbol: "1", pop: "1", push: "11" },
                { from: "q_push", to: "q_pop", symbol: "", pop: "0", push: "0" },
                { from: "q_push", to: "q_pop", symbol: "", pop: "1", push: "1" },
                { from: "q_push", to: "q_pop", symbol: "", pop: "Z", push: "Z" },
                { from: "q_pop", to: "q_pop", symbol: "0", pop: "0", push: "" },
                { from: "q_pop", to: "q_pop", symbol: "1", pop: "1", push: "" },
                { from: "q_pop", to: "q_accept", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["0", "1"],
            stackAlphabet: ["0", "1", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 2: Advanced Counting and Comparative Languages
 */

const PDA_PRACTICE_BANK_P2 = [
    {
        id: "pda_a2n_bn",
        title: "Comparative: a^2n b^n",
        level: "medium",
        description: "Accept strings where the number of 'a's is exactly twice the number of 'b's (n ≥ 1).",
        instruction: "Push two symbols for every 'a' or push one symbol and wait for two 'a's to pop one. Use the stack to maintain the 2:1 ratio.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 150, y: 300 },
                { id: "counting", initial: false, accepting: false, x: 400, y: 300 },
                { id: "matching", initial: false, accepting: true, x: 650, y: 300 }
            ],
            transitions: [
                { from: "start", to: "counting", symbol: "a", pop: "Z", push: "AAZ" },
                { from: "counting", to: "counting", symbol: "a", pop: "A", push: "AAA" },
                { from: "counting", to: "matching", symbol: "b", pop: "A", push: "" },
                { from: "matching", to: "matching", symbol: "b", pop: "A", push: "" },
                { from: "matching", to: "matching", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_nb_greater_na",
        title: "Inequality: n(b) > n(a)",
        level: "hard",
        description: "L = {w ∈ {a, b}* | the number of 'b's is strictly greater than the number of 'a's}.",
        instruction: "Use the stack to cancel out 'a's with 'b's. The machine should only reach an accepting state if there is at least one extra 'b' that cannot be cancelled.",
        solution: {
            type: "PDA",
            states: [
                { id: "q0", initial: true, accepting: false, x: 200, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 600, y: 300 }
            ],
            transitions: [
                { from: "q0", to: "q0", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q0", to: "q0", symbol: "a", pop: "A", push: "AA" },
                { from: "q0", to: "q0", symbol: "b", pop: "A", push: "" },
                { from: "q0", to: "q0", symbol: "b", pop: "Z", push: "BZ" },
                { from: "q0", to: "q0", symbol: "b", pop: "B", push: "BB" },
                { from: "q0", to: "q0", symbol: "a", pop: "B", push: "" },
                { from: "q0", to: "q_acc", symbol: "", pop: "B", push: "B" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "B", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 3: Language Unions and Conditionals
 */

const PDA_PRACTICE_BANK_P3 = [
    {
        id: "pda_an_bm_or_am_bn",
        title: "Union: a^n b^m OR a^m b^n (n=m)",
        level: "medium",
        description: "Accept strings where either the number of 'a's matches 'b's, or the input follows a specific structure where count is irrelevant but symbols are grouped.",
        instruction: "This requires an epsilon transition from the start state to two different branches. Branch A checks n=m, Branch B simply accepts the pattern.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 100, y: 300 },
                { id: "q_eq", initial: false, accepting: false, x: 300, y: 200 },
                { id: "q_match", initial: false, accepting: true, x: 500, y: 200 },
                { id: "q_any", initial: false, accepting: true, x: 400, y: 400 }
            ],
            transitions: [
                { from: "start", to: "q_eq", symbol: "", pop: "Z", push: "Z" },
                { from: "q_eq", to: "q_eq", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_eq", to: "q_eq", symbol: "a", pop: "A", push: "AA" },
                { from: "q_eq", to: "q_match", symbol: "b", pop: "A", push: "" },
                { from: "q_match", to: "q_match", symbol: "b", pop: "A", push: "" },
                { from: "start", to: "q_any", symbol: "a", pop: "Z", push: "Z" },
                { from: "q_any", to: "q_any", symbol: "b", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_odd_palindrome",
        title: "Odd Palindrome (w c w^R)",
        level: "basic",
        description: "L = {w c w^R | w ∈ {0, 1}*}. The 'c' acts as a clear marker for the middle of the string.",
        instruction: "Push symbols onto the stack until 'c' is encountered. After 'c', switch to popping and matching symbols.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_push", initial: true, accepting: false, x: 150, y: 300 },
                { id: "q_pop", initial: false, accepting: false, x: 450, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 750, y: 300 }
            ],
            transitions: [
                { from: "q_push", to: "q_push", symbol: "0", pop: "Z", push: "0Z" },
                { from: "q_push", to: "q_push", symbol: "1", pop: "Z", push: "1Z" },
                { from: "q_push", to: "q_push", symbol: "0", pop: "0", push: "00" },
                { from: "q_push", to: "q_push", symbol: "0", pop: "1", push: "01" },
                { from: "q_push", to: "q_push", symbol: "1", pop: "0", push: "10" },
                { from: "q_push", to: "q_push", symbol: "1", pop: "1", push: "11" },
                { from: "q_push", to: "q_pop", symbol: "c", pop: "0", push: "0" },
                { from: "q_push", to: "q_pop", symbol: "c", pop: "1", push: "1" },
                { from: "q_push", to: "q_pop", symbol: "c", pop: "Z", push: "Z" },
                { from: "q_pop", to: "q_pop", symbol: "0", pop: "0", push: "" },
                { from: "q_pop", to: "q_pop", symbol: "1", pop: "1", push: "" },
                { from: "q_pop", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["0", "1", "c"],
            stackAlphabet: ["0", "1", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 4: Complex Stack Substitutions
 */

const PDA_PRACTICE_BANK_P4 = [
    {
        id: "pda_na_eq_nb",
        title: "Equality: n(a) = n(b)",
        level: "hard",
        description: "L = {w ∈ {a, b}* | total count of 'a's equals total count of 'b's in any order}.",
        instruction: "Use the stack to track the 'debt'. If 'a' is seen and 'B' is on top, pop 'B'. If 'a' is seen and 'A' (or 'Z') is on top, push 'A'. Repeat for 'b'.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_main", initial: true, accepting: true, x: 450, y: 300 }
            ],
            transitions: [
                // 'a' arrives: cancel debt or add to stack
                { from: "q_main", to: "q_main", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_main", to: "q_main", symbol: "a", pop: "A", push: "AA" },
                { from: "q_main", to: "q_main", symbol: "a", pop: "B", push: "" },
                // 'b' arrives: cancel debt or add to stack
                { from: "q_main", to: "q_main", symbol: "b", pop: "Z", push: "BZ" },
                { from: "q_main", to: "q_main", symbol: "b", pop: "B", push: "BB" },
                { from: "q_main", to: "q_main", symbol: "b", pop: "A", push: "" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "B", "Z"]
        }
    },
    {
        id: "pda_diff_counts",
        title: "Comparative: n(a) + n(b) = n(c)",
        level: "medium",
        description: "L = {a^i b^j c^k | i + j = k}. Ensure all 'a's and 'b's are pushed, and then all matched by 'c's.",
        instruction: "Treat 'a' and 'b' as the same 'increment' symbol on the stack. Use 'c' to decrement.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_in", initial: true, accepting: false, x: 150, y: 300 },
                { id: "q_c", initial: false, accepting: false, x: 450, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 750, y: 300 }
            ],
            transitions: [
                { from: "q_in", to: "q_in", symbol: "a", pop: "Z", push: "XZ" },
                { from: "q_in", to: "q_in", symbol: "a", pop: "X", push: "XX" },
                { from: "q_in", to: "q_in", symbol: "b", pop: "Z", push: "XZ" },
                { from: "q_in", to: "q_in", symbol: "b", pop: "X", push: "XX" },
                { from: "q_in", to: "q_c", symbol: "c", pop: "X", push: "" },
                { from: "q_c", to: "q_c", symbol: "c", pop: "X", push: "" },
                { from: "q_c", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["X", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 5: Non-Determinism and Segmented Memory
 */

const PDA_PRACTICE_BANK_P5 = [
    {
        id: "pda_an_bm_cn",
        title: "Segmented: a^n b^m c^n",
        level: "hard",
        description: "L = {a^n b^m c^n | n, m ≥ 1}. The count of 'a's must match 'c's, while 'b's are ignored.",
        instruction: "Push 'A's for every 'a'. During 'b' inputs, stay in a loop that doesn't change the stack. Then pop 'A's for every 'c'.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_a", initial: true, accepting: false, x: 100, y: 300 },
                { id: "q_b", initial: false, accepting: false, x: 350, y: 300 },
                { id: "q_c", initial: false, accepting: false, x: 600, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 850, y: 300 }
            ],
            transitions: [
                { from: "q_a", to: "q_a", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_a", to: "q_a", symbol: "a", pop: "A", push: "AA" },
                { from: "q_a", to: "q_b", symbol: "b", pop: "A", push: "A" },
                { from: "q_b", to: "q_b", symbol: "b", pop: "A", push: "A" },
                { from: "q_b", to: "q_c", symbol: "c", pop: "A", push: "" },
                { from: "q_c", to: "q_c", symbol: "c", pop: "A", push: "" },
                { from: "q_c", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_an_b2n_or_a2n_bn",
        title: "Non-Deterministic Union: a^n b^2n OR a^2n b^n",
        level: "hard",
        description: "The machine must non-deterministically choose which ratio to validate at the start.",
        instruction: "Use an ε-transition from the start to two separate branches: one pushing two 'X's per 'a', and one pushing one 'X' per two 'a's.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 100, y: 300 },
                { id: "br1", initial: false, accepting: false, x: 350, y: 200 },
                { id: "br2", initial: false, accepting: false, x: 350, y: 400 },
                { id: "acc", initial: false, accepting: true, x: 700, y: 300 }
            ],
            transitions: [
                // Branch selection
                { from: "start", to: "br1", symbol: "", pop: "Z", push: "Z" },
                { from: "start", to: "br2", symbol: "", pop: "Z", push: "Z" },
                // Branch 1: a^n b^2n (push two X per a)
                { from: "br1", to: "br1", symbol: "a", pop: "Z", push: "XXZ" },
                { from: "br1", to: "br1", symbol: "a", pop: "X", push: "XXX" },
                { from: "br1", to: "acc", symbol: "b", pop: "X", push: "" },
                // Branch 2: a^2n b^n (already covered in P2 logic)
                { from: "br2", to: "br2", symbol: "a", pop: "Z", push: "XZ" },
                // ... (simplified for this block)
                { from: "acc", to: "acc", symbol: "b", pop: "X", push: "" },
                { from: "acc", to: "acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["X", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 6: Complex Debt and Multi-Symbol Matching
 */

const PDA_PRACTICE_BANK_P6 = [
    {
        id: "pda_nb_neq_na",
        title: "Inequality: n(a) ≠ n(b)",
        level: "hard",
        description: "L = {w ∈ {a, b}* | total count of 'a's is not equal to the total count of 'b's}.",
        instruction: "This is a non-deterministic union of n(a) > n(b) and n(b) > n(a). Use two branches from the start state.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 100, y: 300 },
                { id: "gt_a", initial: false, accepting: true, x: 450, y: 200 },
                { id: "gt_b", initial: false, accepting: true, x: 450, y: 400 }
            ],
            transitions: [
                // Branch for n(a) > n(b)
                { from: "start", to: "gt_a", symbol: "", pop: "Z", push: "Z" },
                { from: "gt_a", to: "gt_a", symbol: "a", pop: "Z", push: "AZ" },
                { from: "gt_a", to: "gt_a", symbol: "a", pop: "A", push: "AA" },
                { from: "gt_a", to: "gt_a", symbol: "b", pop: "A", push: "" },
                // Branch for n(b) > n(a)
                { from: "start", to: "gt_b", symbol: "", pop: "Z", push: "Z" },
                { from: "gt_b", to: "gt_b", symbol: "b", pop: "Z", push: "BZ" },
                { from: "gt_b", to: "gt_b", symbol: "b", pop: "B", push: "BB" },
                { from: "gt_b", to: "gt_b", symbol: "a", pop: "B", push: "" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "B", "Z"]
        }
    },
    {
        id: "pda_an_bn_cm_dm",
        title: "Double Equality: a^n b^n c^m d^m",
        level: "hard",
        description: "L = {a^n b^n c^m d^m | n, m ≥ 1}. Two separate matching phases.",
        instruction: "Use the stack to match 'a's with 'b's. Once the stack is empty (except Z), start a new phase to match 'c's with 'd's.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_ab", initial: true, accepting: false, x: 100, y: 300 },
                { id: "q_wait", initial: false, accepting: false, x: 350, y: 300 },
                { id: "q_cd", initial: false, accepting: false, x: 600, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 850, y: 300 }
            ],
            transitions: [
                { from: "q_ab", to: "q_ab", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_ab", to: "q_ab", symbol: "a", pop: "A", push: "AA" },
                { from: "q_ab", to: "q_wait", symbol: "b", pop: "A", push: "" },
                { from: "q_wait", to: "q_wait", symbol: "b", pop: "A", push: "" },
                { from: "q_wait", to: "q_cd", symbol: "c", pop: "Z", push: "CZ" },
                { from: "q_cd", to: "q_cd", symbol: "c", pop: "C", push: "CC" },
                { from: "q_cd", to: "q_acc", symbol: "d", pop: "C", push: "" },
                { from: "q_acc", to: "q_acc", symbol: "d", pop: "C", push: "" },
                { from: "q_acc", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c", "d"],
            stackAlphabet: ["A", "C", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 7: Linear Relationships and Offsets
 * Focuses on n+k, n-k, and multiplier ratios (2n, 3n).
 */

const PDA_PRACTICE_BANK_P7 = [
    {
        id: "pda_an_bn_plus_2",
        title: "Offset: a^n b^(n+2)",
        level: "easy",
        description: "Accept strings where there are exactly two more 'b's than 'a's (n ≥ 0).",
        instruction: "Match 'a's and 'b's 1-to-1. The machine must specifically look for two extra 'b's at the end or start.",
        solution: {
            type: "PDA",
            states: [
                { id: "q0", initial: true, accepting: false, x: 100, y: 300 },
                { id: "q1", initial: false, accepting: false, x: 300, y: 300 },
                { id: "q2", initial: false, accepting: false, x: 500, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 750, y: 300 }
            ],
            transitions: [
                { from: "q0", to: "q0", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q0", to: "q0", symbol: "a", pop: "A", push: "AA" },
                { from: "q0", to: "q1", symbol: "b", pop: "A", push: "" },
                { from: "q1", to: "q1", symbol: "b", pop: "A", push: "" },
                { from: "q1", to: "q2", symbol: "b", pop: "Z", push: "Z" }, // First extra b
                { from: "q2", to: "q_acc", symbol: "b", pop: "Z", push: "Z" } // Second extra b
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_an_b3n",
        title: "Multiplier: a^n b^3n",
        level: "medium",
        description: "L = {a^n b^3n | n ≥ 1}. Every 'a' requires three 'b's to be cleared.",
        instruction: "Push three symbols for every 'a'. Then pop one for every 'b'.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 150, y: 300 },
                { id: "pop", initial: false, accepting: true, x: 550, y: 300 }
            ],
            transitions: [
                { from: "start", to: "start", symbol: "a", pop: "Z", push: "AAAZ" },
                { from: "start", to: "start", symbol: "a", pop: "A", push: "AAAA" },
                { from: "start", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "pop", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "pop", to: "pop", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_a_i_b_j_i_eq_2j_plus_1",
        title: "Equation: n(a) = 2n(b) + 1",
        level: "hard",
        description: "The number of 'a's is exactly one more than twice the number of 'b's.",
        instruction: "Account for the '+1' by consuming an 'a' at the very beginning or end without affecting the 2:1 ratio logic.",
        solution: {
            type: "PDA",
            states: [
                { id: "init", initial: true, accepting: false, x: 100, y: 300 },
                { id: "main", initial: false, accepting: false, x: 350, y: 300 },
                { id: "acc", initial: false, accepting: true, x: 650, y: 300 }
            ],
            transitions: [
                { from: "init", to: "main", symbol: "a", pop: "Z", push: "Z" }, // The +1 'a'
                { from: "main", to: "main", symbol: "a", pop: "Z", push: "AAZ" },
                { from: "main", to: "main", symbol: "a", pop: "A", push: "AAA" },
                { from: "main", to: "main", symbol: "b", pop: "A", push: "" },
                { from: "main", to: "acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 8: Prefix and Constraint Properties
 */

const PDA_PRACTICE_BANK_P8 = [
    {
        id: "pda_prefix_na_geq_nb",
        title: "Prefix Constraint: n(a) ≥ n(b)",
        level: "medium",
        description: "Accept strings where in every prefix, the number of 'a's is greater than or equal to the number of 'b's.",
        instruction: "This is a DPDA. If you ever try to pop 'Z' while seeing a 'b', the machine should crash (reject).",
        solution: {
            type: "PDA",
            states: [
                { id: "q_ok", initial: true, accepting: true, x: 450, y: 300 }
            ],
            transitions: [
                { from: "q_ok", to: "q_ok", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_ok", to: "q_ok", symbol: "a", pop: "A", push: "AA" },
                { from: "q_ok", to: "q_ok", symbol: "b", pop: "A", push: "" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_exactly_one_triple",
        title: "Search: Exactly one 'aaa'",
        level: "hard",
        description: "Accept strings that contain the substring 'aaa' exactly once.",
        instruction: "Use states to track the 'aaa' progress. Use the stack to ensure parentheses or other symbols elsewhere are balanced (optional complexity).",
        solution: {
            type: "PDA",
            states: [
                { id: "seek", initial: true, accepting: false, x: 100, y: 300 },
                { id: "a1", initial: false, accepting: false, x: 250, y: 300 },
                { id: "a2", initial: false, accepting: false, x: 400, y: 300 },
                { id: "found", initial: false, accepting: true, x: 600, y: 300 },
                { id: "dead", initial: false, accepting: false, x: 800, y: 300 }
            ],
            transitions: [
                { from: "seek", to: "seek", symbol: "b", pop: "Z", push: "Z" },
                { from: "seek", to: "a1", symbol: "a", pop: "Z", push: "Z" },
                { from: "a1", to: "a2", symbol: "a", pop: "Z", push: "Z" },
                { from: "a1", to: "seek", symbol: "b", pop: "Z", push: "Z" },
                { from: "a2", to: "found", symbol: "a", pop: "Z", push: "Z" },
                { from: "a2", to: "seek", symbol: "b", pop: "Z", push: "Z" },
                { from: "found", to: "found", symbol: "b", pop: "Z", push: "Z" },
                { from: "found", to: "dead", symbol: "a", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 9: Relative Counting and Intersections
 * Focuses on n(a) = n(b) or n(a) = n(c) patterns.
 */

const PDA_PRACTICE_BANK_P9 = [
    {
        id: "pda_na_eq_nb_or_nc",
        title: "Union: n(a)=n(b) OR n(a)=n(c)",
        level: "hard",
        description: "Accept strings where either the number of 'a's equals 'b's, or 'a's equals 'c's.",
        instruction: "This is non-deterministic. At the start, the machine must 'guess' whether it is matching 'a' with 'b' or 'a' with 'c' and branch accordingly.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 100, y: 300 },
                { id: "match_b", initial: false, accepting: true, x: 400, y: 200 },
                { id: "match_c", initial: false, accepting: true, x: 400, y: 400 }
            ],
            transitions: [
                // Branch to match a with b
                { from: "start", to: "match_b", symbol: "", pop: "Z", push: "Z" },
                { from: "match_b", to: "match_b", symbol: "a", pop: "Z", push: "AZ" },
                { from: "match_b", to: "match_b", symbol: "a", pop: "A", push: "AA" },
                { from: "match_b", to: "match_b", symbol: "b", pop: "A", push: "" },
                { from: "match_b", to: "match_b", symbol: "c", pop: "A", push: "A" }, // Ignore c
                // Branch to match a with c
                { from: "start", to: "match_c", symbol: "", pop: "Z", push: "Z" },
                { from: "match_c", to: "match_c", symbol: "a", pop: "Z", push: "AZ" },
                { from: "match_c", to: "match_c", symbol: "a", pop: "A", push: "AA" },
                { from: "match_c", to: "match_c", symbol: "c", pop: "A", push: "" },
                { from: "match_c", to: "match_c", symbol: "b", pop: "A", push: "A" } // Ignore b
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_nb_eq_na_plus_nc",
        title: "Sum: n(b) = n(a) + n(c)",
        level: "medium",
        description: "Accept strings over {a, b, c} where the number of 'b's is the sum of 'a's and 'c's.",
        instruction: "Treat 'a' and 'c' as 'push' symbols and 'b' as the 'pop' symbol. Order can be mixed.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_main", initial: true, accepting: true, x: 450, y: 300 }
            ],
            transitions: [
                { from: "q_main", to: "q_main", symbol: "a", pop: "Z", push: "XZ" },
                { from: "q_main", to: "q_main", symbol: "a", pop: "X", push: "XX" },
                { from: "q_main", to: "q_main", symbol: "c", pop: "Z", push: "XZ" },
                { from: "q_main", to: "q_main", symbol: "c", pop: "X", push: "XX" },
                { from: "q_main", to: "q_main", symbol: "b", pop: "X", push: "" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["X", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 10: Binary Strings and Modulo
 */

const PDA_PRACTICE_BANK_P10 = [
    {
        id: "pda_bin_even_zeros",
        title: "Modulo: Even Zeros, Equal 0/1",
        level: "hard",
        description: "L = {w ∈ {0, 1}* | w has an even number of 0s AND n(0) = n(1)}.",
        instruction: "Use states to track the parity (even/odd) of 0s while using the stack to ensure the total counts of 0 and 1 are equal.",
        solution: {
            type: "PDA",
            states: [
                { id: "even", initial: true, accepting: true, x: 200, y: 300 },
                { id: "odd", initial: false, accepting: false, x: 500, y: 300 }
            ],
            transitions: [
                // Manage stack for 0/1 equality
                { from: "even", to: "odd", symbol: "0", pop: "Z", push: "0Z" },
                { from: "even", to: "odd", symbol: "0", pop: "0", push: "00" },
                { from: "even", to: "odd", symbol: "0", pop: "1", push: "" },
                { from: "odd", to: "even", symbol: "0", pop: "Z", push: "0Z" },
                { from: "odd", to: "even", symbol: "0", pop: "0", push: "00" },
                { from: "odd", to: "even", symbol: "0", pop: "1", push: "" },
                // 1s don't change state but affect stack
                { from: "even", to: "even", symbol: "1", pop: "Z", push: "1Z" },
                { from: "even", to: "even", symbol: "1", pop: "1", push: "11" },
                { from: "even", to: "even", symbol: "1", pop: "0", push: "" },
                { from: "odd", to: "odd", symbol: "1", pop: "Z", push: "1Z" },
                { from: "odd", to: "odd", symbol: "1", pop: "1", push: "11" },
                { from: "odd", to: "odd", symbol: "1", pop: "0", push: "" }
            ],
            alphabet: ["0", "1"],
            stackAlphabet: ["0", "1", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 11: Markers and Structured Languages
 */

const PDA_PRACTICE_BANK_P11 = [
    {
        id: "pda_an_c_b2n",
        title: "Marker: a^n c b^2n",
        level: "basic",
        description: "Accept strings where 'a's are followed by a 'c', then exactly twice as many 'b's.",
        instruction: "Push two symbols for every 'a'. When 'c' is seen, move to a state that only pops for 'b'.",
        solution: {
            type: "PDA",
            states: [
                { id: "push", initial: true, accepting: false, x: 150, y: 300 },
                { id: "pop", initial: false, accepting: true, x: 550, y: 300 }
            ],
            transitions: [
                { from: "push", to: "push", symbol: "a", pop: "Z", push: "AAZ" },
                { from: "push", to: "push", symbol: "a", pop: "A", push: "AAA" },
                { from: "push", to: "pop", symbol: "c", pop: "A", push: "A" },
                { from: "push", to: "pop", symbol: "c", pop: "Z", push: "Z" },
                { from: "pop", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "pop", to: "pop", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["A", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 12: Advanced Non-Determinism
 */

const PDA_PRACTICE_BANK_P12 = [
    {
        id: "pda_substring_reversal",
        title: "NPDA: w x w^R",
        level: "hard",
        description: "L = {w x w^R | w, x ∈ {0, 1}+}. The string contains a prefix, a middle segment, and the prefix reversed.",
        instruction: "The machine must non-deterministically guess where 'w' ends to start 'x', and where 'x' ends to start matching 'w^R'.",
        solution: {
            type: "PDA",
            states: [
                { id: "push_w", initial: true, accepting: false, x: 100, y: 300 },
                { id: "skip_x", initial: false, accepting: false, x: 350, y: 300 },
                { id: "pop_wR", initial: false, accepting: false, x: 600, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 850, y: 300 }
            ],
            transitions: [
                // Push w
                { from: "push_w", to: "push_w", symbol: "0", pop: "Z", push: "0Z" },
                { from: "push_w", to: "push_w", symbol: "1", pop: "Z", push: "1Z" },
                { from: "push_w", to: "push_w", symbol: "0", pop: "0", push: "00" },
                { from: "push_w", to: "push_w", symbol: "1", pop: "1", push: "11" },
                // Non-deterministic jump to skip x
                { from: "push_w", to: "skip_x", symbol: "0", pop: "0", push: "0" },
                { from: "push_w", to: "skip_x", symbol: "1", pop: "1", push: "1" },
                // Loop in x (must be at least one char)
                { from: "skip_x", to: "skip_x", symbol: "0", pop: "0", push: "0" },
                { from: "skip_x", to: "skip_x", symbol: "1", pop: "1", push: "1" },
                // Non-deterministic jump to pop wR
                { from: "skip_x", to: "pop_wR", symbol: "0", pop: "0", push: "" },
                { from: "skip_x", to: "pop_wR", symbol: "1", pop: "1", push: "" },
                { from: "pop_wR", to: "pop_wR", symbol: "0", pop: "0", push: "" },
                { from: "pop_wR", to: "pop_wR", symbol: "1", pop: "1", push: "" },
                { from: "pop_wR", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["0", "1"],
            stackAlphabet: ["0", "1", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 13: Deviations and Complements
 */

const PDA_PRACTICE_BANK_P13 = [
    {
        id: "pda_not_an_bn",
        title: "Inequality: a^n b^m (n ≠ m)",
        level: "hard",
        description: "Accept strings of the form a^n b^m where n is NOT equal to m.",
        instruction: "Branch non-deterministically into two paths: one that accepts if n > m (stack not empty after b's) and one if n < m (more b's than stack symbols).",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 100, y: 300 },
                { id: "n_gt_m", initial: false, accepting: true, x: 450, y: 200 },
                { id: "n_lt_m", initial: false, accepting: true, x: 450, y: 400 }
            ],
            transitions: [
                { from: "start", to: "n_gt_m", symbol: "", pop: "Z", push: "Z" },
                { from: "start", to: "n_lt_m", symbol: "", pop: "Z", push: "Z" },
                // Logic for n > m
                { from: "n_gt_m", to: "n_gt_m", symbol: "a", pop: "Z", push: "AZ" },
                { from: "n_gt_m", to: "n_gt_m", symbol: "b", pop: "A", push: "" },
                // Logic for n < m
                { from: "n_lt_m", to: "n_lt_m", symbol: "a", pop: "Z", push: "AZ" },
                { from: "n_lt_m", to: "n_lt_m", symbol: "b", pop: "A", push: "" },
                { from: "n_lt_m", to: "n_lt_m", symbol: "b", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 14: Partial Matching
 */

const PDA_PRACTICE_BANK_P14 = [
    {
        id: "pda_an_bn_cm",
        title: "Partial: a^n b^n c^m",
        level: "medium",
        description: "L = {a^n b^n c^m | n, m ≥ 0}. The count of 'a' and 'b' must match, but 'c' can be any number.",
        instruction: "Use the stack for a/b. Once 'b's are done and stack is at 'Z', transition to a state that loops on 'c' without touching the stack.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_ab", initial: true, accepting: true, x: 200, y: 300 },
                { id: "q_c", initial: false, accepting: true, x: 600, y: 300 }
            ],
            transitions: [
                { from: "q_ab", to: "q_ab", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_ab", to: "q_ab", symbol: "a", pop: "A", push: "AA" },
                { from: "q_ab", to: "q_ab", symbol: "b", pop: "A", push: "" },
                { from: "q_ab", to: "q_c", symbol: "c", pop: "Z", push: "Z" },
                { from: "q_c", to: "q_c", symbol: "c", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["A", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 15: Nested Structures
 */

const PDA_PRACTICE_BANK_P15 = [
    {
        id: "pda_nested_brackets",
        title: "Nested: { } and [ ]",
        level: "hard",
        description: "Accept balanced strings containing both curly braces { } and square brackets [ ].",
        instruction: "Push the specific bracket type onto the stack. Pop only if the incoming closing bracket matches the top of the stack.",
        solution: {
            type: "PDA",
            states: [
                { id: "main", initial: true, accepting: true, x: 450, y: 300 }
            ],
            transitions: [
                { from: "main", to: "main", symbol: "{", pop: "Z", push: "curZ" },
                { from: "main", to: "main", symbol: "{", pop: "cur", push: "curcur" },
                { from: "main", to: "main", symbol: "{", pop: "sq", push: "cursq" },
                { from: "main", to: "main", symbol: "[", pop: "Z", push: "sqZ" },
                { from: "main", to: "main", symbol: "[", pop: "sq", push: "sqsq" },
                { from: "main", to: "main", symbol: "[", pop: "cur", push: "sqcur" },
                { from: "main", to: "main", symbol: "}", pop: "cur", push: "" },
                { from: "main", to: "main", symbol: "]", pop: "sq", push: "" }
            ],
            alphabet: ["{", "}", "[", "]"],
            stackAlphabet: ["cur", "sq", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 16: Triple Symbol Sequences
 */

const PDA_PRACTICE_BANK_P16 = [
    {
        id: "pda_an_b_cn",
        title: "Symmetry: a^n b c^n",
        level: "basic",
        description: "L = {a^n b c^n | n ≥ 1}. The number of 'a's must match the number of 'c's, with a single 'b' in the middle.",
        instruction: "Push an 'A' for every 'a'. When you see 'b', move to the next state and start popping an 'A' for every 'c'.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_a", initial: true, accepting: false, x: 150, y: 300 },
                { id: "q_c", initial: false, accepting: false, x: 450, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 750, y: 300 }
            ],
            transitions: [
                { from: "q_a", to: "q_a", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q_a", to: "q_a", symbol: "a", pop: "A", push: "AA" },
                { from: "q_a", to: "q_c", symbol: "b", pop: "A", push: "A" },
                { from: "q_c", to: "q_c", symbol: "c", pop: "A", push: "" },
                { from: "q_c", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_a_i_b_j_c_k_i_plus_j_eq_k",
        title: "Summation: i + j = k",
        level: "medium",
        description: "L = {a^i b^j c^k | i + j = k}. Total 'a's and 'b's combined must equal 'c's.",
        instruction: "Think of 'a' and 'b' as the same thing for the stack. Push for both, then use 'c' to clear the stack.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_in", initial: true, accepting: false, x: 150, y: 300 },
                { id: "q_out", initial: false, accepting: false, x: 450, y: 300 },
                { id: "q_acc", initial: false, accepting: true, x: 750, y: 300 }
            ],
            transitions: [
                { from: "q_in", to: "q_in", symbol: "a", pop: "Z", push: "XZ" },
                { from: "q_in", to: "q_in", symbol: "a", pop: "X", push: "XX" },
                { from: "q_in", to: "q_in", symbol: "b", pop: "Z", push: "XZ" },
                { from: "q_in", to: "q_in", symbol: "b", pop: "X", push: "XX" },
                { from: "q_in", to: "q_out", symbol: "c", pop: "X", push: "" },
                { from: "q_out", to: "q_out", symbol: "c", pop: "X", push: "" },
                { from: "q_out", to: "q_acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "c"],
            stackAlphabet: ["X", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 17: Limited Capacity and Boundaries
 */

const PDA_PRACTICE_BANK_P17 = [
    {
        id: "pda_max_three_a",
        title: "Bound: a^n b^n (n ≤ 3)",
        level: "easy",
        description: "Accept a^n b^n but only for small values where n is between 1 and 3.",
        instruction: "Use a sequence of states to count 'a's. If a 4th 'a' appears, don't provide a transition so it rejects.",
        solution: {
            type: "PDA",
            states: [
                { id: "start", initial: true, accepting: false, x: 100, y: 300 },
                { id: "a1", initial: false, accepting: false, x: 250, y: 200 },
                { id: "a2", initial: false, accepting: false, x: 400, y: 200 },
                { id: "a3", initial: false, accepting: false, x: 550, y: 200 },
                { id: "pop", initial: false, accepting: true, x: 400, y: 400 }
            ],
            transitions: [
                { from: "start", to: "a1", symbol: "a", pop: "Z", push: "AZ" },
                { from: "a1", to: "a2", symbol: "a", pop: "A", push: "AA" },
                { from: "a2", to: "a3", symbol: "a", pop: "A", push: "AAA" },
                // Pop logic
                { from: "a1", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "a2", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "a3", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "pop", to: "pop", symbol: "b", pop: "A", push: "" },
                { from: "pop", to: "pop", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "Z"]
        }
    },
    {
        id: "pda_even_total_length",
        title: "Structure: Equal a/b, Even Length",
        level: "medium",
        description: "L = {w | n(a) = n(b) and total length is even}.",
        instruction: "Total length is always even if n(a) = n(b) (since n+n = 2n). Use the stack for equality as usual.",
        solution: {
            type: "PDA",
            states: [
                { id: "q", initial: true, accepting: true, x: 450, y: 300 }
            ],
            transitions: [
                { from: "q", to: "q", symbol: "a", pop: "Z", push: "AZ" },
                { from: "q", to: "q", symbol: "a", pop: "A", push: "AA" },
                { from: "q", to: "q", symbol: "a", pop: "B", push: "" },
                { from: "q", to: "q", symbol: "b", pop: "Z", push: "BZ" },
                { from: "q", to: "q", symbol: "b", pop: "B", push: "BB" },
                { from: "q", to: "q", symbol: "b", pop: "A", push: "" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "B", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 18: Dynamic Debt Matching
 */

const PDA_PRACTICE_BANK_P18 = [
    {
        id: "pda_twice_as_many_zeros",
        title: "Debt: n(0) = 2 * n(1)",
        level: "medium",
        description: "Accept strings where the number of 0s is exactly twice the number of 1s, in any order.",
        instruction: "When a '1' arrives, push two debt tokens (e.g., 'D'). When '0' arrives, pop one 'D'. If '0' arrives and no 'D' is there, push a '0' token.",
        solution: {
            type: "PDA",
            states: [
                { id: "q_debt", initial: true, accepting: true, x: 450, y: 300 }
            ],
            transitions: [
                // '1' arrives: add two debt units
                { from: "q_debt", to: "q_debt", symbol: "1", pop: "Z", push: "DDZ" },
                { from: "q_debt", to: "q_debt", symbol: "1", pop: "D", push: "DDD" },
                { from: "q_debt", to: "q_debt", symbol: "1", pop: "O", push: "" }, // Pop 0 token if exists
                
                // '0' arrives: resolve debt or add 0 token
                { from: "q_debt", to: "q_debt", symbol: "0", pop: "D", push: "" },
                { from: "q_debt", to: "q_debt", symbol: "0", pop: "Z", push: "OZ" },
                { from: "q_debt", to: "q_debt", symbol: "0", pop: "O", push: "OO" }
            ],
            alphabet: ["0", "1"],
            stackAlphabet: ["D", "O", "Z"]
        }
    }
];
/**
 * pda_practice_bank.js - Part 19: Palindromes with and without Midpoints
 */

const PDA_PRACTICE_BANK_P19 = [
    {
        id: "pda_palindrome_hash",
        title: "Deterministic Palindrome (w#w^R)",
        level: "basic",
        description: "L = {w#w^R | w ∈ {a, b}*}. The '#' character clearly marks the center.",
        instruction: "This is a DPDA. Push symbols until '#', then switch to a state that pops and matches.",
        solution: {
            type: "PDA",
            states: [
                { id: "read", initial: true, accepting: false, x: 150, y: 300 },
                { id: "match", initial: false, accepting: false, x: 450, y: 300 },
                { id: "acc", initial: false, accepting: true, x: 750, y: 300 }
            ],
            transitions: [
                { from: "read", to: "read", symbol: "a", pop: "Z", push: "AZ" },
                { from: "read", to: "read", symbol: "b", pop: "Z", push: "BZ" },
                { from: "read", to: "read", symbol: "a", pop: "A", push: "AA" },
                { from: "read", to: "read", symbol: "b", pop: "B", push: "BB" },
                { from: "read", to: "match", symbol: "#", pop: "A", push: "A" },
                { from: "read", to: "match", symbol: "#", pop: "Z", push: "Z" },
                { from: "match", to: "match", symbol: "a", pop: "A", push: "" },
                { from: "match", to: "match", symbol: "b", pop: "B", push: "" },
                { from: "match", to: "acc", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b", "#"],
            stackAlphabet: ["A", "B", "Z"]
        }
    },
    {
        id: "pda_palindrome_any_middle",
        title: "NPDA: Palindrome w w^R",
        level: "hard",
        description: "L = {w w^R | w ∈ {a, b}*}. There is NO middle marker.",
        instruction: "Use an epsilon (ε) transition to non-deterministically 'guess' where the middle is and start matching.",
        solution: {
            type: "PDA",
            states: [
                { id: "pushing", initial: true, accepting: true, x: 200, y: 300 },
                { id: "popping", initial: false, accepting: false, x: 500, y: 300 },
                { id: "finish", initial: false, accepting: true, x: 800, y: 300 }
            ],
            transitions: [
                { from: "pushing", to: "pushing", symbol: "a", pop: "Z", push: "AZ" },
                { from: "pushing", to: "pushing", symbol: "b", pop: "Z", push: "BZ" },
                // The Non-Deterministic "Guess"
                { from: "pushing", to: "popping", symbol: "", pop: "A", push: "A" },
                { from: "pushing", to: "popping", symbol: "", pop: "B", push: "B" },
                { from: "popping", to: "popping", symbol: "a", pop: "A", push: "" },
                { from: "popping", to: "popping", symbol: "b", pop: "B", push: "" },
                { from: "popping", to: "finish", symbol: "", pop: "Z", push: "Z" }
            ],
            alphabet: ["a", "b"],
            stackAlphabet: ["A", "B", "Z"]
        }
    }
];

export const PDA_PRACTICE_BANK = [
    ...PDA_PRACTICE_BANK_P1, // Initial classic problems
    ...PDA_PRACTICE_BANK_P2,
    ...PDA_PRACTICE_BANK_P3,
    ...PDA_PRACTICE_BANK_P4,
    ...PDA_PRACTICE_BANK_P5,
    ...PDA_PRACTICE_BANK_P6,
    ...PDA_PRACTICE_BANK_P7,
    ...PDA_PRACTICE_BANK_P8,
    ...PDA_PRACTICE_BANK_P9,
    ...PDA_PRACTICE_BANK_P10,
    ...PDA_PRACTICE_BANK_P11,
    ...PDA_PRACTICE_BANK_P12,
    ...PDA_PRACTICE_BANK_P13,
    ...PDA_PRACTICE_BANK_P14,
    ...PDA_PRACTICE_BANK_P15,
    ...PDA_PRACTICE_BANK_P16,
    ...PDA_PRACTICE_BANK_P17,
    ...PDA_PRACTICE_BANK_P18,
    ...PDA_PRACTICE_BANK_P19
];
window.PDA_PRACTICE_BANK = PDA_PRACTICE_BANK;
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P2);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P3);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P4);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P5);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P6);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P7);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P8);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P9);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P10);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P11);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P12);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P13);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P14);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P15);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P16);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P17);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P18);
window.PDA_PRACTICE_BANK = (window.PDA_PRACTICE_BANK || []).concat(PDA_PRACTICE_BANK_P19);
