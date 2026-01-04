/**
 * tm_practice_bank.js
 * Foundational and Beginner computational challenges for the Turing Machine Studio.
 */

export const TM_PRACTICE_BANK = {
    basic: [
        {
            id: "tm_move_to_end",
            title: "Basic: Move to End",
            description: "Find the end of a binary string. Move the head from the start until the first blank 'B' is reached, then Halt.",
            type: "TM",
            machine: {
                states: [
                    { id: "q0", initial: true, accepting: false, x: 200, y: 300 },
                    { id: "q_halt", initial: false, accepting: true, x: 500, y: 300 }
                ],
                transitions: [
                    { from: "q0", to: "q0", read: "0", write: "0", move: "R" },
                    { from: "q0", to: "q0", read: "1", write: "1", move: "R" },
                    { from: "q0", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_invert_bits",
            title: "Basic: Bit Inverter",
            description: "Change every '0' to '1' and every '1' to '0' on the tape until the end of the string.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_inv", initial: true, accepting: false, x: 200, y: 300 },
                    { id: "q_done", initial: false, accepting: true, x: 500, y: 300 }
                ],
                transitions: [
                    { from: "q_inv", to: "q_inv", read: "0", write: "1", move: "R" },
                    { from: "q_inv", to: "q_inv", read: "1", write: "0", move: "R" },
                    { from: "q_inv", to: "q_done", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_constant_write",
            title: "Basic: Constant Result",
            description: "Regardless of the input string, replace the first character with 'X' and Halt.",
            type: "TM",
            machine: {
                states: [
                    { id: "q0", initial: true, accepting: false, x: 200, y: 300 },
                    { id: "q_halt", initial: false, accepting: true, x: 500, y: 300 }
                ],
                transitions: [
                    { from: "q0", to: "q_halt", read: "0", write: "X", move: "S" },
                    { from: "q0", to: "q_halt", read: "1", write: "X", move: "S" },
                    { from: "q0", to: "q_halt", read: "B", write: "X", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_find_first_one",
            title: "Basic: Locate Symbol",
            description: "Scan right to find the first '1'. If found, stay there. If the end (B) is reached, Halt in a non-accepting state.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_scan", initial: true, accepting: false, x: 200, y: 300 },
                    { id: "q_found", initial: false, accepting: true, x: 500, y: 300 },
                    { id: "q_fail", initial: false, accepting: false, x: 500, y: 150 }
                ],
                transitions: [
                    { from: "q_scan", to: "q_scan", read: "0", write: "0", move: "R" },
                    { from: "q_scan", to: "q_found", read: "1", write: "1", move: "S" },
                    { from: "q_scan", to: "q_fail", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_clear_tape",
            title: "Basic: Tape Eraser",
            description: "Move right and replace all characters with blanks 'B' until the tape is empty.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_erase", initial: true, accepting: false, x: 200, y: 300 },
                    { id: "q_halt", initial: false, accepting: true, x: 500, y: 300 }
                ],
                transitions: [
                    { from: "q_erase", to: "q_erase", read: "0", write: "B", move: "R" },
                    { from: "q_erase", to: "q_erase", read: "1", write: "B", move: "R" },
                    { from: "q_erase", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        }
    ],

    easy: [
        {
            id: "tm_unary_increment",
            title: "Easy: Unary Increment",
            description: "Given a string of '1's representing a unary number, add one '1' at the end and Halt.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_find_end", initial: true, accepting: false, x: 200, y: 300 },
                    { id: "q_add", initial: false, accepting: false, x: 450, y: 300 },
                    { id: "q_halt", initial: false, accepting: true, x: 700, y: 300 }
                ],
                transitions: [
                    { from: "q_find_end", to: "q_find_end", read: "1", write: "1", move: "R" },
                    { from: "q_find_end", to: "q_add", read: "B", write: "1", move: "R" },
                    { from: "q_add", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_binary_increment",
            title: "Easy: Binary Increment",
            description: "Increment a binary number by 1. Move to the end, then move left changing '1's to '0's until you hit a '0' or 'B', change that to '1', and Halt.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_right", initial: true, x: 100, y: 300 },
                    { id: "q_carry", x: 400, y: 300 },
                    { id: "q_done", accepting: true, x: 700, y: 300 }
                ],
                transitions: [
                    { from: "q_right", to: "q_right", read: "0", write: "0", move: "R" },
                    { from: "q_right", to: "q_right", read: "1", write: "1", move: "R" },
                    { from: "q_right", to: "q_carry", read: "B", write: "B", move: "L" },
                    { from: "q_carry", to: "q_carry", read: "1", write: "0", move: "L" },
                    { from: "q_carry", to: "q_done", read: "0", write: "1", move: "S" },
                    { from: "q_carry", to: "q_done", read: "B", write: "1", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_check_even_zeros",
            title: "Easy: Even Number of Zeros",
            description: "Verify if the tape contains an even number of '0's. Use two states to toggle parity and Halt in an accepting state only if even.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_even", initial: true, accepting: true, x: 200, y: 300 },
                    { id: "q_odd", initial: false, accepting: false, x: 500, y: 300 }
                ],
                transitions: [
                    { from: "q_even", to: "q_odd", read: "0", write: "0", move: "R" },
                    { from: "q_odd", to: "q_even", read: "0", write: "0", move: "R" },
                    { from: "q_even", to: "q_even", read: "1", write: "1", move: "R" },
                    { from: "q_odd", to: "q_odd", read: "1", write: "1", move: "R" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_mark_ends",
            title: "Easy: Mark String Ends",
            description: "Replace the first and last characters of any string with '#'.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_start", initial: true, x: 100, y: 300 },
                    { id: "q_seek", x: 350, y: 300 },
                    { id: "q_halt", accepting: true, x: 600, y: 300 }
                ],
                transitions: [
                    { from: "q_start", to: "q_seek", read: "0", write: "#", move: "R" },
                    { from: "q_start", to: "q_seek", read: "1", write: "#", move: "R" },
                    { from: "q_seek", to: "q_seek", read: "0", write: "0", move: "R" },
                    { from: "q_seek", to: "q_seek", read: "1", write: "1", move: "R" },
                    { from: "q_seek", to: "q_halt", read: "B", write: "B", move: "L" },
                    { from: "q_halt", to: "q_halt", read: "0", write: "#", move: "S" },
                    { from: "q_halt", to: "q_halt", read: "1", write: "#", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_delete_first",
            title: "Easy: Delete First Character",
            description: "Remove the first character by shifting the head and replacing it with the blank symbol 'B'.",
            type: "TM",
            machine: {
                states: [
                    { id: "q0", initial: true, x: 200, y: 300 },
                    { id: "q_halt", accepting: true, x: 500, y: 300 }
                ],
                transitions: [
                    { from: "q0", to: "q_halt", read: "0", write: "B", move: "R" },
                    { from: "q0", to: "q_halt", read: "1", write: "B", move: "R" },
                    { from: "q0", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        }
    ],

    medium: [
        {
            id: "tm_unary_addition",
            title: "Medium: Unary Addition",
            description: "Given '111+11', convert it to '11111' by replacing the '+' with '1' and deleting the last '1' at the end.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_find_plus", initial: true, x: 100, y: 300 },
                    { id: "q_replace_plus", x: 300, y: 300 },
                    { id: "q_find_end", x: 500, y: 300 },
                    { id: "q_delete_last", x: 700, y: 300 },
                    { id: "q_halt", accepting: true, x: 900, y: 300 }
                ],
                transitions: [
                    { from: "q_find_plus", to: "q_find_plus", read: "1", write: "1", move: "R" },
                    { from: "q_find_plus", to: "q_replace_plus", read: "+", write: "1", move: "R" },
                    { from: "q_replace_plus", to: "q_replace_plus", read: "1", write: "1", move: "R" },
                    { from: "q_replace_plus", to: "q_find_end", read: "B", write: "B", move: "L" },
                    { from: "q_find_end", to: "q_delete_last", read: "1", write: "B", move: "L" },
                    { from: "q_delete_last", to: "q_halt", read: "1", write: "1", move: "S" },
                    { from: "q_delete_last", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_binary_copy",
            title: "Medium: Binary String Copy",
            description: "Copy a binary string 'w' to the right of a separator '#'. Result should be 'w#w'.",
            type: "TM",
            machine: {
                states: [
                    { id: "q0", initial: true, x: 100, y: 300 },
                    { id: "q_read0", x: 300, y: 150 },
                    { id: "q_read1", x: 300, y: 450 },
                    { id: "q_back", x: 500, y: 300 },
                    { id: "q_clean", x: 700, y: 300 },
                    { id: "q_halt", accepting: true, x: 900, y: 300 }
                ],
                transitions: [
                    { from: "q0", to: "q_read0", read: "0", write: "X", move: "R" },
                    { from: "q0", to: "q_read1", read: "1", write: "Y", move: "R" },
                    { from: "q0", to: "q_clean", read: "#", write: "#", move: "R" },
                    { from: "q_read0", to: "q_read0", read: "0", write: "0", move: "R" },
                    { from: "q_read0", to: "q_read0", read: "1", write: "1", move: "R" },
                    { from: "q_read0", to: "q_read0", read: "#", write: "#", move: "R" },
                    { from: "q_read0", to: "q_back", read: "B", write: "0", move: "L" },
                    { from: "q_read1", to: "q_read1", read: "0", write: "0", move: "R" },
                    { from: "q_read1", to: "q_read1", read: "1", write: "1", move: "R" },
                    { from: "q_read1", to: "q_read1", read: "#", write: "#", move: "R" },
                    { from: "q_read1", to: "q_back", read: "B", write: "1", move: "L" },
                    { from: "q_back", to: "q_back", read: "0", write: "0", move: "L" },
                    { from: "q_back", to: "q_back", read: "1", write: "1", move: "L" },
                    { from: "q_back", to: "q_back", read: "#", write: "#", move: "L" },
                    { from: "q_back", to: "q0", read: "X", write: "X", move: "R" },
                    { from: "q_back", to: "q0", read: "Y", write: "Y", move: "R" },
                    { from: "q_clean", to: "q_clean", read: "X", write: "0", move: "R" },
                    { from: "q_clean", to: "q_clean", read: "Y", write: "1", move: "R" },
                    { from: "q_clean", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_string_reversal",
            title: "Medium: String Reversal",
            description: "Reverse a binary string on the tape. (Hint: Use markers to swap symbols from ends towards the center).",
            type: "TM",
            machine: {
                states: [
                    { id: "q_init", initial: true, x: 100, y: 300 },
                    { id: "q_swap_loop", x: 400, y: 300 },
                    { id: "q_halt", accepting: true, x: 800, y: 300 }
                ],
                transitions: [
                    { from: "q_init", to: "q_swap_loop", read: "0", write: "0", move: "R" },
                    { from: "q_init", to: "q_swap_loop", read: "1", write: "1", move: "R" },
                    { from: "q_swap_loop", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_balanced_parens",
            title: "Medium: Balanced Parentheses",
            description: "Check if a string of '(' and ')' is balanced. Replace matching pairs with 'X' until none remain.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_start", initial: true, x: 100, y: 300 },
                    { id: "q_find_right", x: 400, y: 300 },
                    { id: "q_back", x: 400, y: 500 },
                    { id: "q_accept", accepting: true, x: 800, y: 300 }
                ],
                transitions: [
                    { from: "q_start", to: "q_find_right", read: "(", write: "X", move: "R" },
                    { from: "q_find_right", to: "q_find_right", read: "(", write: "(", move: "R" },
                    { from: "q_find_right", to: "q_back", read: ")", write: "X", move: "L" },
                    { from: "q_back", to: "q_back", read: "(", write: "(", move: "L" },
                    { from: "q_back", to: "q_back", read: "X", write: "X", move: "L" },
                    { from: "q_back", to: "q_start", read: "B", write: "B", move: "R" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_binary_palindrome",
            title: "Medium: Palindrome Checker",
            description: "Standard Palindrome check. Match the first symbol with the last, mark them, and repeat.",
            type: "TM",
            machine: {
                states: [
                    { id: "q0", initial: true, x: 100, y: 300 },
                    { id: "q_match0", x: 300, y: 150 },
                    { id: "q_match1", x: 300, y: 450 },
                    { id: "q_back", x: 600, y: 300 },
                    { id: "q_accept", accepting: true, x: 900, y: 300 }
                ],
                transitions: [
                    { from: "q0", to: "q_match0", read: "0", write: "B", move: "R" },
                    { from: "q0", to: "q_match1", read: "1", write: "B", move: "R" },
                    { from: "q0", to: "q_accept", read: "B", write: "B", move: "S" },
                    { from: "q_match0", to: "q_match0", read: "0", write: "0", move: "R" },
                    { from: "q_match0", to: "q_match0", read: "1", write: "1", move: "R" },
                    { from: "q_match0", to: "q_back", read: "B", write: "B", move: "L" }
                ],
                blankSymbol: "B"
            }
        }
    ],
    
    hard: [
        {
            id: "tm_an_bn_cn",
            title: "Hard: Language a^n b^n c^n",
            description: "Recognize the non-context-free language where the number of a's, b's, and c's are equal. Use markers X, Y, and Z to match triples.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_start", initial: true, x: 100, y: 300 },
                    { id: "q_find_b", x: 300, y: 300 },
                    { id: "q_find_c", x: 500, y: 300 },
                    { id: "q_return", x: 300, y: 500 },
                    { id: "q_verify", x: 700, y: 300 },
                    { id: "q_accept", accepting: true, x: 900, y: 300 }
                ],
                transitions: [
                    { from: "q_start", to: "q_find_b", read: "a", write: "X", move: "R" },
                    { from: "q_start", to: "q_verify", read: "Y", write: "Y", move: "R" },
                    { from: "q_find_b", to: "q_find_b", read: "a", write: "a", move: "R" },
                    { from: "q_find_b", to: "q_find_b", read: "Y", write: "Y", move: "R" },
                    { from: "q_find_b", to: "q_find_c", read: "b", write: "Y", move: "R" },
                    { from: "q_find_c", to: "q_find_c", read: "b", write: "b", move: "R" },
                    { from: "q_find_c", to: "q_find_c", read: "Z", write: "Z", move: "R" },
                    { from: "q_find_c", to: "q_return", read: "c", write: "Z", move: "L" },
                    { from: "q_return", to: "q_return", read: "a", write: "a", move: "L" },
                    { from: "q_return", to: "q_return", read: "b", write: "b", move: "L" },
                    { from: "q_return", to: "q_return", read: "Y", write: "Y", move: "L" },
                    { from: "q_return", to: "q_return", read: "Z", write: "Z", move: "L" },
                    { from: "q_return", to: "q_start", read: "X", write: "X", move: "R" },
                    { from: "q_verify", to: "q_verify", read: "Y", write: "Y", move: "R" },
                    { from: "q_verify", to: "q_verify", read: "Z", write: "Z", move: "R" },
                    { from: "q_verify", to: "q_accept", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_binary_multiplication",
            title: "Hard: Binary Multiplier (x2)",
            description: "Multiply a binary number by 2 by shifting all bits left and appending a '0' at the end.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_find_end", initial: true, x: 100, y: 300 },
                    { id: "q_write_0", x: 400, y: 300 },
                    { id: "q_halt", accepting: true, x: 700, y: 300 }
                ],
                transitions: [
                    { from: "q_find_end", to: "q_find_end", read: "0", write: "0", move: "R" },
                    { from: "q_find_end", to: "q_find_end", read: "1", write: "1", move: "R" },
                    { from: "q_find_end", to: "q_write_0", read: "B", write: "0", move: "R" },
                    { from: "q_write_0", to: "q_halt", read: "B", write: "B", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_binary_subtraction",
            title: "Hard: Binary Subtraction (w - 1)",
            description: "Subtract 1 from a binary number. Move right to the end, then move left borrowing from the first '1'.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_right", initial: true, x: 100, y: 300 },
                    { id: "q_sub", x: 400, y: 300 },
                    { id: "q_halt", accepting: true, x: 700, y: 300 }
                ],
                transitions: [
                    { from: "q_right", to: "q_right", read: "0", write: "0", move: "R" },
                    { from: "q_right", to: "q_right", read: "1", write: "1", move: "R" },
                    { from: "q_right", to: "q_sub", read: "B", write: "B", move: "L" },
                    { from: "q_sub", to: "q_sub", read: "0", write: "1", move: "L" },
                    { from: "q_sub", to: "q_halt", read: "1", write: "0", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_copy_arbitrary",
            title: "Hard: Copy String w^n",
            description: "Copy an arbitrary string of length n to the right. This requires careful marker management to ensure the process terminates.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_init", initial: true, x: 100, y: 300 },
                    { id: "q_match", x: 400, y: 300 },
                    { id: "q_halt", accepting: true, x: 700, y: 300 }
                ],
                transitions: [
                    { from: "q_init", to: "q_match", read: "0", write: "X", move: "R" },
                    { from: "q_match", to: "q_halt", read: "B", write: "0", move: "S" }
                ],
                blankSymbol: "B"
            }
        },
        {
            id: "tm_wcw_checker",
            title: "Hard: wcw Checker",
            description: "Verify if the tape contains a string 'w', followed by 'c', followed by the same string 'w'.",
            type: "TM",
            machine: {
                states: [
                    { id: "q_start", initial: true, x: 100, y: 300 },
                    { id: "q_read0", x: 300, y: 150 },
                    { id: "q_read1", x: 300, y: 450 },
                    { id: "q_search", x: 500, y: 300 },
                    { id: "q_halt", accepting: true, x: 800, y: 300 }
                ],
                transitions: [
                    { from: "q_start", to: "q_read0", read: "0", write: "X", move: "R" },
                    { from: "q_start", to: "q_read1", read: "1", write: "Y", move: "R" },
                    { from: "q_read0", to: "q_read0", read: "0", write: "0", move: "R" },
                    { from: "q_read0", to: "q_read0", read: "c", write: "c", move: "R" },
                    { from: "q_read0", to: "q_search", read: "B", write: "0", move: "L" }
                ],
                blankSymbol: "B"
            }
        }
    ]
};