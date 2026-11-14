/**
 * tm_practice_bank.js
 * Foundational and Beginner computational challenges for the Turing Machine Studio.
 */

export const TM_PRACTICE_BANK = {
  "basic": [
    {
      "id": "tm_move_to_end",
      "title": "Basic: Move to End",
      "description": "Find the end of a binary string. Move the head from the start until the first blank 'B' is reached, then Halt.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q0",
            "initial": true,
            "accepting": false,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_halt",
            "initial": false,
            "accepting": true,
            "x": 500,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q0",
            "to": "q0",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q0",
            "to": "q0",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q0",
            "to": "q_halt",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_invert_bits",
      "title": "Basic: Bit Inverter",
      "description": "Change every '0' to '1' and every '1' to '0' on the tape until the end of the string.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_inv",
            "initial": true,
            "accepting": false,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_done",
            "initial": false,
            "accepting": true,
            "x": 500,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_inv",
            "to": "q_inv",
            "read": "0",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_inv",
            "to": "q_inv",
            "read": "1",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q_inv",
            "to": "q_done",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_constant_write",
      "title": "Basic: Constant Result",
      "description": "Regardless of the input string, replace the first character with 'X' and Halt.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q0",
            "initial": true,
            "accepting": false,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_halt",
            "initial": false,
            "accepting": true,
            "x": 500,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q0",
            "to": "q_halt",
            "read": "0",
            "write": "X",
            "move": "R"
          },
          {
            "from": "q0",
            "to": "q_halt",
            "read": "1",
            "write": "X",
            "move": "R"
          },
          {
            "from": "q0",
            "to": "q_halt",
            "read": "B",
            "write": "X",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_find_first_one",
      "title": "Basic: Locate Symbol",
      "description": "Scan right to find the first '1'. If found, stay there. If the end (B) is reached, Halt in a non-accepting state.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_scan",
            "initial": true,
            "accepting": false,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_found",
            "initial": false,
            "accepting": true,
            "x": 500,
            "y": 300
          },
          {
            "id": "q_fail",
            "initial": false,
            "accepting": false,
            "x": 500,
            "y": 150
          }
        ],
        "transitions": [
          {
            "from": "q_scan",
            "to": "q_scan",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q_scan",
            "to": "q_found",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_scan",
            "to": "q_fail",
            "read": "B",
            "write": "B",
            "move": "L"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_clear_tape",
      "title": "Basic: Tape Eraser",
      "description": "Move right and replace all characters with blanks 'B' until the tape is empty.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_erase",
            "initial": true,
            "accepting": false,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_halt",
            "initial": false,
            "accepting": true,
            "x": 500,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_erase",
            "to": "q_erase",
            "read": "0",
            "write": "B",
            "move": "R"
          },
          {
            "from": "q_erase",
            "to": "q_erase",
            "read": "1",
            "write": "B",
            "move": "R"
          },
          {
            "from": "q_erase",
            "to": "q_halt",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    }
  ],
  "easy": [
    {
      "id": "tm_unary_increment",
      "title": "Easy: Unary Increment",
      "description": "Given a string of '1's representing a unary number, add one '1' at the end and Halt.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_find_end",
            "initial": true,
            "accepting": false,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_add",
            "initial": false,
            "accepting": false,
            "x": 450,
            "y": 300
          },
          {
            "id": "q_halt",
            "initial": false,
            "accepting": true,
            "x": 700,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_find_end",
            "to": "q_find_end",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_find_end",
            "to": "q_add",
            "read": "B",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_add",
            "to": "q_halt",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "1"
      ]
    },
    {
      "id": "tm_binary_increment",
      "title": "Easy: Binary Increment",
      "description": "Increment a binary number by 1. Move to the end, then move left changing '1's to '0's until you hit a '0' or 'B', change that to '1', and Halt.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_right",
            "initial": true,
            "x": 100,
            "y": 300
          },
          {
            "id": "q_carry",
            "x": 400,
            "y": 300
          },
          {
            "id": "q_done",
            "accepting": true,
            "x": 700,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_right",
            "to": "q_right",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q_right",
            "to": "q_right",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_right",
            "to": "q_carry",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "q_carry",
            "to": "q_carry",
            "read": "1",
            "write": "0",
            "move": "L"
          },
          {
            "from": "q_carry",
            "to": "q_done",
            "read": "0",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_carry",
            "to": "q_done",
            "read": "B",
            "write": "1",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_check_even_zeros",
      "title": "Easy: Even Number of Zeros",
      "description": "Verify if the tape contains an even number of '0's. Use two states to toggle parity and Halt in an accepting state only if even.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "e",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "o",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 760,
            "y": 220
          }
        ],
        "transitions": [
          {
            "from": "e",
            "to": "o",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "e",
            "to": "e",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "e",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "o",
            "to": "e",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "o",
            "to": "o",
            "read": "1",
            "write": "1",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_mark_ends",
      "title": "Easy: Mark String Ends",
      "description": "Replace the first and last characters of any string with '#'.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "s",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "m",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 760,
            "y": 220
          },
          {
            "id": "l",
            "initial": false,
            "accepting": false,
            "x": 1060,
            "y": 220
          }
        ],
        "transitions": [
          {
            "from": "s",
            "to": "m",
            "read": "0",
            "write": "#",
            "move": "R"
          },
          {
            "from": "s",
            "to": "m",
            "read": "1",
            "write": "#",
            "move": "R"
          },
          {
            "from": "s",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "m",
            "to": "m",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "m",
            "to": "m",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "m",
            "to": "l",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "l",
            "to": "acc",
            "read": "0",
            "write": "#",
            "move": "R"
          },
          {
            "from": "l",
            "to": "acc",
            "read": "1",
            "write": "#",
            "move": "R"
          },
          {
            "from": "l",
            "to": "acc",
            "read": "#",
            "write": "#",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_delete_first",
      "title": "Easy: Delete First Character",
      "description": "Remove the first character by shifting the head and replacing it with the blank symbol 'B'.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q0",
            "initial": true,
            "x": 200,
            "y": 300
          },
          {
            "id": "q_halt",
            "accepting": true,
            "x": 500,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q0",
            "to": "q_halt",
            "read": "0",
            "write": "B",
            "move": "R"
          },
          {
            "from": "q0",
            "to": "q_halt",
            "read": "1",
            "write": "B",
            "move": "R"
          },
          {
            "from": "q0",
            "to": "q_halt",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    }
  ],
  "medium": [
    {
      "id": "tm_unary_addition",
      "title": "Medium: Unary Addition",
      "description": "Given '111+11', convert it to '11111' by replacing the '+' with '1' and deleting the last '1' at the end.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_find_plus",
            "initial": true,
            "x": 100,
            "y": 300
          },
          {
            "id": "q_replace_plus",
            "x": 300,
            "y": 300
          },
          {
            "id": "q_find_end",
            "x": 500,
            "y": 300
          },
          {
            "id": "q_delete_last",
            "x": 700,
            "y": 300
          },
          {
            "id": "q_halt",
            "accepting": true,
            "x": 900,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_find_plus",
            "to": "q_find_plus",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_find_plus",
            "to": "q_replace_plus",
            "read": "+",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_replace_plus",
            "to": "q_replace_plus",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_replace_plus",
            "to": "q_find_end",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "q_find_end",
            "to": "q_delete_last",
            "read": "1",
            "write": "B",
            "move": "L"
          },
          {
            "from": "q_delete_last",
            "to": "q_halt",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_delete_last",
            "to": "q_halt",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "1",
        "+"
      ]
    },
    {
      "id": "tm_binary_copy",
      "title": "Medium: Binary String Copy",
      "description": "Copy a binary string 'w' to the right of a separator '#'. Result should be 'w#w'.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "i",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "r",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "p",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 220
          },
          {
            "id": "c0",
            "initial": false,
            "accepting": false,
            "x": 1060,
            "y": 220
          },
          {
            "id": "c1",
            "initial": false,
            "accepting": false,
            "x": 160,
            "y": 480
          },
          {
            "id": "fix",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 480
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 760,
            "y": 480
          }
        ],
        "transitions": [
          {
            "from": "i",
            "to": "i",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "i",
            "to": "i",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "i",
            "to": "r",
            "read": "B",
            "write": "#",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "0",
            "write": "0",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "1",
            "write": "1",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "#",
            "write": "#",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "Y",
            "write": "Y",
            "move": "L"
          },
          {
            "from": "r",
            "to": "p",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "p",
            "to": "p",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "p",
            "to": "p",
            "read": "Y",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "p",
            "to": "c0",
            "read": "0",
            "write": "X",
            "move": "R"
          },
          {
            "from": "p",
            "to": "c1",
            "read": "1",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "p",
            "to": "fix",
            "read": "#",
            "write": "#",
            "move": "L"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "#",
            "write": "#",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "r",
            "read": "B",
            "write": "0",
            "move": "L"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "#",
            "write": "#",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "r",
            "read": "B",
            "write": "1",
            "move": "L"
          },
          {
            "from": "fix",
            "to": "fix",
            "read": "X",
            "write": "0",
            "move": "L"
          },
          {
            "from": "fix",
            "to": "fix",
            "read": "Y",
            "write": "1",
            "move": "L"
          },
          {
            "from": "fix",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_string_reversal",
      "title": "Medium: String Reversal",
      "description": "Reverse a binary string on the tape. (Hint: Use markers to swap symbols from ends towards the center).",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "i",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "g",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "t0",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 220
          },
          {
            "id": "t1",
            "initial": false,
            "accepting": false,
            "x": 1060,
            "y": 220
          },
          {
            "id": "e",
            "initial": false,
            "accepting": false,
            "x": 160,
            "y": 480
          },
          {
            "id": "back",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 480
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 760,
            "y": 480
          }
        ],
        "transitions": [
          {
            "from": "i",
            "to": "i",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "i",
            "to": "i",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "i",
            "to": "g",
            "read": "B",
            "write": "#",
            "move": "L"
          },
          {
            "from": "g",
            "to": "g",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "g",
            "to": "t0",
            "read": "0",
            "write": "X",
            "move": "R"
          },
          {
            "from": "g",
            "to": "t1",
            "read": "1",
            "write": "X",
            "move": "R"
          },
          {
            "from": "g",
            "to": "e",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "t0",
            "to": "t0",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "t0",
            "to": "t0",
            "read": "#",
            "write": "#",
            "move": "R"
          },
          {
            "from": "t0",
            "to": "t0",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "t0",
            "to": "t0",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "t0",
            "to": "back",
            "read": "B",
            "write": "0",
            "move": "L"
          },
          {
            "from": "t1",
            "to": "t1",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "t1",
            "to": "t1",
            "read": "#",
            "write": "#",
            "move": "R"
          },
          {
            "from": "t1",
            "to": "t1",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "t1",
            "to": "t1",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "t1",
            "to": "back",
            "read": "B",
            "write": "1",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "0",
            "write": "0",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "1",
            "write": "1",
            "move": "L"
          },
          {
            "from": "back",
            "to": "g",
            "read": "#",
            "write": "#",
            "move": "L"
          },
          {
            "from": "e",
            "to": "e",
            "read": "X",
            "write": "B",
            "move": "R"
          },
          {
            "from": "e",
            "to": "acc",
            "read": "#",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_balanced_parens",
      "title": "Medium: Balanced Parentheses",
      "description": "Check if a string of '(' and ')' is balanced. Replace matching pairs with 'X' until none remain.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "s",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "l",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "chk",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 220
          },
          {
            "id": "r",
            "initial": false,
            "accepting": false,
            "x": 1060,
            "y": 220
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 160,
            "y": 480
          }
        ],
        "transitions": [
          {
            "from": "s",
            "to": "s",
            "read": "(",
            "write": "(",
            "move": "R"
          },
          {
            "from": "s",
            "to": "s",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "s",
            "to": "l",
            "read": ")",
            "write": "X",
            "move": "L"
          },
          {
            "from": "s",
            "to": "chk",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "l",
            "to": "l",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "l",
            "to": "r",
            "read": "(",
            "write": "X",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "(",
            "write": "(",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "r",
            "to": "s",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "chk",
            "to": "chk",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "chk",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "(",
        ")"
      ]
    },
    {
      "id": "tm_binary_palindrome",
      "title": "Medium: Palindrome Checker",
      "description": "Standard Palindrome check. Match the first symbol with the last, mark them, and repeat.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "s",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "m0",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "m1",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 220
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 1060,
            "y": 220
          },
          {
            "id": "c0",
            "initial": false,
            "accepting": false,
            "x": 160,
            "y": 480
          },
          {
            "id": "back",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 480
          },
          {
            "id": "c1",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 480
          }
        ],
        "transitions": [
          {
            "from": "s",
            "to": "m0",
            "read": "0",
            "write": "B",
            "move": "R"
          },
          {
            "from": "s",
            "to": "m1",
            "read": "1",
            "write": "B",
            "move": "R"
          },
          {
            "from": "s",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "m0",
            "to": "m0",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "m0",
            "to": "m0",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "m0",
            "to": "c0",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "c0",
            "to": "back",
            "read": "0",
            "write": "B",
            "move": "L"
          },
          {
            "from": "c0",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "m1",
            "to": "m1",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "m1",
            "to": "m1",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "m1",
            "to": "c1",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "c1",
            "to": "back",
            "read": "1",
            "write": "B",
            "move": "L"
          },
          {
            "from": "c1",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "back",
            "to": "back",
            "read": "0",
            "write": "0",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "1",
            "write": "1",
            "move": "L"
          },
          {
            "from": "back",
            "to": "s",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    }
  ],
  "hard": [
    {
      "id": "tm_an_bn_cn",
      "title": "Hard: Language a^n b^n c^n",
      "description": "Recognize the non-context-free language where the number of a's, b's, and c's are equal. Use markers X, Y, and Z to match triples.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_start",
            "initial": true,
            "x": 100,
            "y": 300
          },
          {
            "id": "q_find_b",
            "x": 300,
            "y": 300
          },
          {
            "id": "q_find_c",
            "x": 500,
            "y": 300
          },
          {
            "id": "q_return",
            "x": 300,
            "y": 500
          },
          {
            "id": "q_verify",
            "x": 700,
            "y": 300
          },
          {
            "id": "q_accept",
            "accepting": true,
            "x": 900,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_start",
            "to": "q_find_b",
            "read": "a",
            "write": "X",
            "move": "R"
          },
          {
            "from": "q_start",
            "to": "q_verify",
            "read": "Y",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "q_find_b",
            "to": "q_find_b",
            "read": "a",
            "write": "a",
            "move": "R"
          },
          {
            "from": "q_find_b",
            "to": "q_find_b",
            "read": "Y",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "q_find_b",
            "to": "q_find_c",
            "read": "b",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "q_find_c",
            "to": "q_find_c",
            "read": "b",
            "write": "b",
            "move": "R"
          },
          {
            "from": "q_find_c",
            "to": "q_find_c",
            "read": "Z",
            "write": "Z",
            "move": "R"
          },
          {
            "from": "q_find_c",
            "to": "q_return",
            "read": "c",
            "write": "Z",
            "move": "L"
          },
          {
            "from": "q_return",
            "to": "q_return",
            "read": "a",
            "write": "a",
            "move": "L"
          },
          {
            "from": "q_return",
            "to": "q_return",
            "read": "b",
            "write": "b",
            "move": "L"
          },
          {
            "from": "q_return",
            "to": "q_return",
            "read": "Y",
            "write": "Y",
            "move": "L"
          },
          {
            "from": "q_return",
            "to": "q_return",
            "read": "Z",
            "write": "Z",
            "move": "L"
          },
          {
            "from": "q_return",
            "to": "q_start",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "q_verify",
            "to": "q_verify",
            "read": "Y",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "q_verify",
            "to": "q_verify",
            "read": "Z",
            "write": "Z",
            "move": "R"
          },
          {
            "from": "q_verify",
            "to": "q_accept",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "a",
        "b",
        "c"
      ]
    },
    {
      "id": "tm_binary_multiplication",
      "title": "Hard: Binary Multiplier (x2)",
      "description": "Multiply a binary number by 2 by shifting all bits left and appending a '0' at the end.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_find_end",
            "initial": true,
            "x": 100,
            "y": 300
          },
          {
            "id": "q_write_0",
            "x": 400,
            "y": 300
          },
          {
            "id": "q_halt",
            "accepting": true,
            "x": 700,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_find_end",
            "to": "q_find_end",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q_find_end",
            "to": "q_find_end",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_find_end",
            "to": "q_write_0",
            "read": "B",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q_write_0",
            "to": "q_halt",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_binary_subtraction",
      "title": "Hard: Binary Subtraction (w - 1)",
      "description": "Subtract 1 from a binary number. Move right to the end, then move left borrowing from the first '1'.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "q_right",
            "initial": true,
            "x": 100,
            "y": 300
          },
          {
            "id": "q_sub",
            "x": 400,
            "y": 300
          },
          {
            "id": "q_halt",
            "accepting": true,
            "x": 700,
            "y": 300
          }
        ],
        "transitions": [
          {
            "from": "q_right",
            "to": "q_right",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "q_right",
            "to": "q_right",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "q_right",
            "to": "q_sub",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "q_sub",
            "to": "q_sub",
            "read": "0",
            "write": "1",
            "move": "L"
          },
          {
            "from": "q_sub",
            "to": "q_halt",
            "read": "1",
            "write": "0",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_copy_arbitrary",
      "title": "Hard: Copy String w^n",
      "description": "Copy an arbitrary string of length n to the right. This requires careful marker management to ensure the process terminates.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "p",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "c0",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "c1",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 220
          },
          {
            "id": "f",
            "initial": false,
            "accepting": false,
            "x": 1060,
            "y": 220
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 160,
            "y": 480
          },
          {
            "id": "r",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 480
          },
          {
            "id": "h",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 480
          }
        ],
        "transitions": [
          {
            "from": "p",
            "to": "p",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "p",
            "to": "p",
            "read": "Y",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "p",
            "to": "c0",
            "read": "0",
            "write": "X",
            "move": "R"
          },
          {
            "from": "p",
            "to": "c1",
            "read": "1",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "p",
            "to": "f",
            "read": "a",
            "write": "a",
            "move": "L"
          },
          {
            "from": "p",
            "to": "f",
            "read": "b",
            "write": "b",
            "move": "L"
          },
          {
            "from": "p",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "a",
            "write": "a",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "c0",
            "read": "b",
            "write": "b",
            "move": "R"
          },
          {
            "from": "c0",
            "to": "r",
            "read": "B",
            "write": "a",
            "move": "L"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "a",
            "write": "a",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "c1",
            "read": "b",
            "write": "b",
            "move": "R"
          },
          {
            "from": "c1",
            "to": "r",
            "read": "B",
            "write": "b",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "0",
            "write": "0",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "1",
            "write": "1",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "a",
            "write": "a",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "b",
            "write": "b",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "r",
            "to": "r",
            "read": "Y",
            "write": "Y",
            "move": "L"
          },
          {
            "from": "r",
            "to": "p",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "f",
            "to": "f",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "f",
            "to": "f",
            "read": "Y",
            "write": "Y",
            "move": "R"
          },
          {
            "from": "f",
            "to": "f",
            "read": "a",
            "write": "0",
            "move": "R"
          },
          {
            "from": "f",
            "to": "f",
            "read": "b",
            "write": "1",
            "move": "R"
          },
          {
            "from": "f",
            "to": "h",
            "read": "B",
            "write": "B",
            "move": "L"
          },
          {
            "from": "h",
            "to": "h",
            "read": "0",
            "write": "0",
            "move": "L"
          },
          {
            "from": "h",
            "to": "h",
            "read": "1",
            "write": "1",
            "move": "L"
          },
          {
            "from": "h",
            "to": "h",
            "read": "X",
            "write": "0",
            "move": "L"
          },
          {
            "from": "h",
            "to": "h",
            "read": "Y",
            "write": "1",
            "move": "L"
          },
          {
            "from": "h",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1"
      ]
    },
    {
      "id": "tm_wcw_checker",
      "title": "Hard: wcw Checker",
      "description": "Verify if the tape contains a string 'w', followed by 'c', followed by the same string 'w'.",
      "type": "TM",
      "machine": {
        "states": [
          {
            "id": "s",
            "initial": true,
            "accepting": false,
            "x": 160,
            "y": 220
          },
          {
            "id": "f0",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 220
          },
          {
            "id": "f1",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 220
          },
          {
            "id": "v",
            "initial": false,
            "accepting": false,
            "x": 1060,
            "y": 220
          },
          {
            "id": "g0",
            "initial": false,
            "accepting": false,
            "x": 160,
            "y": 480
          },
          {
            "id": "back",
            "initial": false,
            "accepting": false,
            "x": 460,
            "y": 480
          },
          {
            "id": "g1",
            "initial": false,
            "accepting": false,
            "x": 760,
            "y": 480
          },
          {
            "id": "acc",
            "initial": false,
            "accepting": true,
            "x": 1060,
            "y": 480
          }
        ],
        "transitions": [
          {
            "from": "s",
            "to": "s",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "s",
            "to": "f0",
            "read": "0",
            "write": "X",
            "move": "R"
          },
          {
            "from": "s",
            "to": "f1",
            "read": "1",
            "write": "X",
            "move": "R"
          },
          {
            "from": "s",
            "to": "v",
            "read": "c",
            "write": "c",
            "move": "R"
          },
          {
            "from": "f0",
            "to": "f0",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "f0",
            "to": "f0",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "f0",
            "to": "g0",
            "read": "c",
            "write": "c",
            "move": "R"
          },
          {
            "from": "g0",
            "to": "g0",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "g0",
            "to": "back",
            "read": "0",
            "write": "X",
            "move": "L"
          },
          {
            "from": "f1",
            "to": "f1",
            "read": "0",
            "write": "0",
            "move": "R"
          },
          {
            "from": "f1",
            "to": "f1",
            "read": "1",
            "write": "1",
            "move": "R"
          },
          {
            "from": "f1",
            "to": "g1",
            "read": "c",
            "write": "c",
            "move": "R"
          },
          {
            "from": "g1",
            "to": "g1",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "g1",
            "to": "back",
            "read": "1",
            "write": "X",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "0",
            "write": "0",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "1",
            "write": "1",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "c",
            "write": "c",
            "move": "L"
          },
          {
            "from": "back",
            "to": "back",
            "read": "X",
            "write": "X",
            "move": "L"
          },
          {
            "from": "back",
            "to": "s",
            "read": "B",
            "write": "B",
            "move": "R"
          },
          {
            "from": "v",
            "to": "v",
            "read": "X",
            "write": "X",
            "move": "R"
          },
          {
            "from": "v",
            "to": "acc",
            "read": "B",
            "write": "B",
            "move": "R"
          }
        ],
        "blankSymbol": "B"
      },
      "inputAlphabet": [
        "0",
        "1",
        "c"
      ]
    }
  ]
};
