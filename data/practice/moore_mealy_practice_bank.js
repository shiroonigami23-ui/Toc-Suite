// Mealy and Moore practice problems. Every answer is checked against an independent output
// specification by tests/audit-mm.test.mjs. Conversion practice is generated from these answers.
window.MM_PRACTICE_BANK = {
  "MOORE": {
    "easy": [
      {
        "q": "Moore Machine that outputs \"1\" if the input string length is even (Σ={0, 1}, Γ={0, 1}). Output \"0\" for odd lengths.",
        "sol": "2 states: q0(start/even/output 1), q1(odd/output 0).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "1"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 300,
              "initial": false,
              "output": "0"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "Moore Machine that outputs \"A\" on all strings containing at least one \"a\" (Σ={a, b}, Γ={A, B}). Initial output is \"B\".",
        "sol": "2 states: q0(start/output B), q1(seen a/output A).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "B"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 300,
              "initial": false,
              "output": "A"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "output_alphabet": [
            "A",
            "B"
          ]
        }
      },
      {
        "q": "Moore Machine that outputs \"X\" only after the exact sequence \"10\" (Σ={0, 1}, Γ={N, X}). Initial output is \"N\".",
        "sol": "3 states: q0(N), q1(seen 1, N), q2(seen 10, X).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "N"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 200,
              "initial": false,
              "output": "N"
            },
            {
              "id": "q2",
              "x": 550,
              "y": 300,
              "initial": false,
              "output": "X"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "N",
            "X"
          ]
        }
      },
      {
        "q": "Moore Machine that outputs \"Y\" if the input string contains an odd number of \"0\"s (Σ={0, 1}, Γ={Y, N}). Initial output is \"N\".",
        "sol": "2 states: qE(even/N), qO(odd/Y).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "qE",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "N"
            },
            {
              "id": "qO",
              "x": 350,
              "y": 300,
              "initial": false,
              "output": "Y"
            }
          ],
          "transitions": [
            {
              "from": "qE",
              "to": "qO",
              "symbol": "0"
            },
            {
              "from": "qE",
              "to": "qE",
              "symbol": "1"
            },
            {
              "from": "qO",
              "to": "qE",
              "symbol": "0"
            },
            {
              "from": "qO",
              "to": "qO",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "Y",
            "N"
          ]
        }
      },
      {
        "q": "Moore Machine that echoes the most recent input symbol (Σ={0, 1}, Γ={-, 0, 1}). Initial output is \"-\".",
        "sol": "3 states: s(-), z(last 0), o(last 1).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "s",
              "output": "-",
              "x": 160,
              "y": 200,
              "initial": true
            },
            {
              "id": "z",
              "output": "0",
              "x": 390,
              "y": 200,
              "initial": false
            },
            {
              "id": "o",
              "output": "1",
              "x": 620,
              "y": 200,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "s",
              "to": "z",
              "symbol": "0"
            },
            {
              "from": "s",
              "to": "o",
              "symbol": "1"
            },
            {
              "from": "z",
              "to": "z",
              "symbol": "0"
            },
            {
              "from": "z",
              "to": "o",
              "symbol": "1"
            },
            {
              "from": "o",
              "to": "z",
              "symbol": "0"
            },
            {
              "from": "o",
              "to": "o",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "-",
            "0",
            "1"
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "Moore Machine that outputs the modulo 3 remainder of the number of \"a\"s seen so far (Σ={a, b}, Γ={0, 1, 2}). Output is the state value.",
        "sol": "3 states: q0(mod 0, output 0), q1(mod 1, output 1), q2(mod 2, output 2).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "0"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 200,
              "initial": false,
              "output": "1"
            },
            {
              "id": "q2",
              "x": 350,
              "y": 400,
              "initial": false,
              "output": "2"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "output_alphabet": [
            "0",
            "1",
            "2"
          ]
        }
      },
      {
        "q": "Moore Machine detecting the sequence \"11\" in binary input (Σ={0, 1}, Γ={N, Y}). Output \"Y\" if the last two inputs were \"11\". Initial output \"N\".",
        "sol": "4 states: q0(N), q1(seen 1, N), q11(seen 11, Y). A minimal implementation merges states.",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "N"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 200,
              "initial": false,
              "output": "N"
            },
            {
              "id": "q11",
              "x": 550,
              "y": 300,
              "initial": false,
              "output": "Y"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q11",
              "to": "q11",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "N",
            "Y"
          ]
        }
      },
      {
        "q": "Moore Machine that outputs the **number** of consecutive \"a\"s just read, up to a maximum output of 2 (Σ={a, b}, Γ={0, 1, 2}). Initial output is 0.",
        "sol": "3 states: q0(0 cons a), q1(1 cons a), q2(>=2 cons a). Output is the state value.",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "0"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 200,
              "initial": false,
              "output": "1"
            },
            {
              "id": "q2",
              "x": 550,
              "y": 300,
              "initial": false,
              "output": "2"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "output_alphabet": [
            "0",
            "1",
            "2"
          ]
        }
      },
      {
        "q": "Moore Machine that outputs \"Y\" when the binary number read so far is divisible by 3, and \"N\" otherwise (Σ={0, 1}, Γ={Y, N}). The empty input counts as 0, so the initial output is \"Y\".",
        "sol": "3 states r0(Y), r1(N), r2(N): reading bit b moves remainder r to (2r + b) mod 3.",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "r0",
              "output": "Y",
              "x": 160,
              "y": 200,
              "initial": true
            },
            {
              "id": "r1",
              "output": "N",
              "x": 390,
              "y": 200,
              "initial": false
            },
            {
              "id": "r2",
              "output": "N",
              "x": 620,
              "y": 200,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "r0",
              "to": "r0",
              "symbol": "0"
            },
            {
              "from": "r0",
              "to": "r1",
              "symbol": "1"
            },
            {
              "from": "r1",
              "to": "r2",
              "symbol": "0"
            },
            {
              "from": "r1",
              "to": "r0",
              "symbol": "1"
            },
            {
              "from": "r2",
              "to": "r1",
              "symbol": "0"
            },
            {
              "from": "r2",
              "to": "r2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "Y",
            "N"
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "Moore Machine whose output is the remainder modulo 4 of the binary number read (Σ={0, 1}, Γ={0, 1, 2, 3}).",
        "sol": "4 states, tracking mod 4 remainder. Output is the remainder.",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true,
              "output": "0"
            },
            {
              "id": "q1",
              "x": 350,
              "y": 200,
              "initial": false,
              "output": "1"
            },
            {
              "id": "q2",
              "x": 550,
              "y": 300,
              "initial": false,
              "output": "2"
            },
            {
              "id": "q3",
              "x": 350,
              "y": 400,
              "initial": false,
              "output": "3"
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "0",
            "1",
            "2",
            "3"
          ]
        }
      },
      {
        "q": "Moore Machine that outputs \"1\" whenever the last three inputs were \"aba\" (overlaps count, e.g. \"ababa\" gives two hits), and \"0\" otherwise (Σ={a, b}, Γ={0, 1}).",
        "sol": "4 states tracking the longest suffix that is a prefix of \"aba\": ε, a, ab, aba(output 1).",
        "machine": {
          "type": "MOORE",
          "states": [
            {
              "id": "e",
              "output": "0",
              "x": 160,
              "y": 200,
              "initial": true
            },
            {
              "id": "a",
              "output": "0",
              "x": 390,
              "y": 200,
              "initial": false
            },
            {
              "id": "ab",
              "output": "0",
              "x": 620,
              "y": 200,
              "initial": false
            },
            {
              "id": "aba",
              "output": "1",
              "x": 850,
              "y": 200,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "e",
              "to": "a",
              "symbol": "a"
            },
            {
              "from": "e",
              "to": "e",
              "symbol": "b"
            },
            {
              "from": "a",
              "to": "a",
              "symbol": "a"
            },
            {
              "from": "a",
              "to": "ab",
              "symbol": "b"
            },
            {
              "from": "ab",
              "to": "aba",
              "symbol": "a"
            },
            {
              "from": "ab",
              "to": "e",
              "symbol": "b"
            },
            {
              "from": "aba",
              "to": "a",
              "symbol": "a"
            },
            {
              "from": "aba",
              "to": "ab",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      }
    ]
  },
  "MEALY": {
    "easy": [
      {
        "q": "Mealy Machine that outputs \"X\" when the input changes (0 to 1, or 1 to 0), and \"S\" otherwise (Σ={0, 1}, Γ={S, X}).",
        "sol": "2 states: q0(last input 0), q1(last input 1).",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true
            },
            {
              "id": "q1",
              "x": 350,
              "y": 300,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0",
              "output": "S"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1",
              "output": "X"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0",
              "output": "X"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1",
              "output": "S"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "S",
            "X"
          ]
        }
      },
      {
        "q": "Mealy Machine that outputs \"1\" when the current input is \"0\" and the previous input was \"1\" (Σ={0, 1}, Γ={0, 1}). Output \"0\" otherwise.",
        "sol": "2 states: q0(last input 0 or start), q1(last input 1).",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true
            },
            {
              "id": "q1",
              "x": 350,
              "y": 300,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0",
              "output": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1",
              "output": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "Mealy Machine that outputs the **current** input symbol (identity function) (Σ={A, B}, Γ={A, B}).",
        "sol": "1 state, transitions loop back and output the input symbol.",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "q0",
              "x": 300,
              "y": 300,
              "initial": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "A",
              "output": "A"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "B",
              "output": "B"
            }
          ],
          "alphabet": [
            "A",
            "B"
          ],
          "output_alphabet": [
            "A",
            "B"
          ]
        }
      },
      {
        "q": "Mealy Machine that outputs the one's complement of its input, bit by bit (Σ={0, 1}, Γ={0, 1}).",
        "sol": "1 state with two self-loops: 0/1 and 1/0.",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "q0",
              "x": 160,
              "y": 200,
              "initial": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0",
              "output": "1"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1",
              "output": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "1",
            "0"
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "Mealy Machine that calculates a 1-bit binary adder. Inputs are (A, B) pairs, outputs are Sum (Σ={00, 01, 10, 11}, Γ={0, 1}). States track Carry bit.",
        "sol": "2 states: q0(Carry 0), q1(Carry 1).",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true
            },
            {
              "id": "q1",
              "x": 350,
              "y": 300,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "00",
              "output": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "01",
              "output": "1"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "10",
              "output": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "11",
              "output": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "00",
              "output": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "01",
              "output": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "10",
              "output": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "11",
              "output": "1"
            }
          ],
          "alphabet": [
            "00",
            "01",
            "10",
            "11"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "Mealy Machine that outputs \"P\" when an even number of \"0\"s has been read, and \"I\" (for odd) otherwise (Σ={0, 1}, Γ={P, I}).",
        "sol": "2 states: qE(Even 0s), qI(Odd 0s). Output must be on the transition to the *next* state.",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "qE",
              "x": 150,
              "y": 300,
              "initial": true
            },
            {
              "id": "qI",
              "x": 350,
              "y": 300,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "qE",
              "to": "qI",
              "symbol": "0",
              "output": "I"
            },
            {
              "from": "qE",
              "to": "qE",
              "symbol": "1",
              "output": "P"
            },
            {
              "from": "qI",
              "to": "qE",
              "symbol": "0",
              "output": "P"
            },
            {
              "from": "qI",
              "to": "qI",
              "symbol": "1",
              "output": "I"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "P",
            "I"
          ]
        }
      },
      {
        "q": "Mealy Machine that delays its input by one step: each output is the previous input symbol, and the first output is \"0\" (Σ={0, 1}, Γ={0, 1}).",
        "sol": "2 states p0, p1 remembering the last input; on input c from pX output X and go to pc.",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "p0",
              "x": 160,
              "y": 200,
              "initial": true
            },
            {
              "id": "p1",
              "x": 390,
              "y": 200,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "p0",
              "to": "p0",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "p0",
              "to": "p1",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "p1",
              "to": "p0",
              "symbol": "0",
              "output": "1"
            },
            {
              "from": "p1",
              "to": "p1",
              "symbol": "1",
              "output": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "Mealy Machine that outputs \"1\" when the current input equals the input two steps earlier, and \"0\" otherwise; the first two outputs are \"0\" (Σ={0, 1}, Γ={0, 1}).",
        "sol": "7 states: start, the first symbol, and the last two symbols (00, 01, 10, 11).",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "s",
              "x": 160,
              "y": 200,
              "initial": true
            },
            {
              "id": "x0",
              "x": 390,
              "y": 200,
              "initial": false
            },
            {
              "id": "x1",
              "x": 620,
              "y": 200,
              "initial": false
            },
            {
              "id": "y00",
              "x": 850,
              "y": 200,
              "initial": false
            },
            {
              "id": "y01",
              "x": 160,
              "y": 400,
              "initial": false
            },
            {
              "id": "y10",
              "x": 390,
              "y": 400,
              "initial": false
            },
            {
              "id": "y11",
              "x": 620,
              "y": 400,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "s",
              "to": "x0",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "s",
              "to": "x1",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "x0",
              "to": "y00",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "x0",
              "to": "y01",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "x1",
              "to": "y10",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "x1",
              "to": "y11",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "y00",
              "to": "y00",
              "symbol": "0",
              "output": "1"
            },
            {
              "from": "y00",
              "to": "y01",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "y01",
              "to": "y10",
              "symbol": "0",
              "output": "1"
            },
            {
              "from": "y01",
              "to": "y11",
              "symbol": "1",
              "output": "0"
            },
            {
              "from": "y10",
              "to": "y00",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "y10",
              "to": "y01",
              "symbol": "1",
              "output": "1"
            },
            {
              "from": "y11",
              "to": "y10",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "y11",
              "to": "y11",
              "symbol": "1",
              "output": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "Mealy Machine that outputs \"R\" when the input ends with \"110\", and \"N\" otherwise (Σ={0, 1}, Γ={N, R}).",
        "sol": "4 states required for 3-bit sequence detection.",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "q0",
              "x": 150,
              "y": 300,
              "initial": true
            },
            {
              "id": "q1",
              "x": 350,
              "y": 200,
              "initial": false
            },
            {
              "id": "q11",
              "x": 550,
              "y": 300,
              "initial": false
            },
            {
              "id": "q0_0",
              "x": 350,
              "y": 400,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0",
              "output": "N"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1",
              "output": "N"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0",
              "output": "N"
            },
            {
              "from": "q1",
              "to": "q11",
              "symbol": "1",
              "output": "N"
            },
            {
              "from": "q11",
              "to": "q11",
              "symbol": "1",
              "output": "N"
            },
            {
              "from": "q11",
              "to": "q0_0",
              "symbol": "0",
              "output": "R"
            },
            {
              "from": "q0_0",
              "to": "q0_0",
              "symbol": "0",
              "output": "N"
            },
            {
              "from": "q0_0",
              "to": "q1",
              "symbol": "1",
              "output": "N"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "N",
            "R"
          ]
        }
      },
      {
        "q": "Mealy Machine that outputs the two's complement of a binary number fed least-significant bit first (Σ={0, 1}, Γ={0, 1}): copy bits up to and including the first 1, then flip every later bit.",
        "sol": "2 states: copy (before the first 1) and flip (after it).",
        "machine": {
          "type": "MEALY",
          "states": [
            {
              "id": "copy",
              "x": 160,
              "y": 200,
              "initial": true
            },
            {
              "id": "flip",
              "x": 390,
              "y": 200,
              "initial": false
            }
          ],
          "transitions": [
            {
              "from": "copy",
              "to": "copy",
              "symbol": "0",
              "output": "0"
            },
            {
              "from": "copy",
              "to": "flip",
              "symbol": "1",
              "output": "1"
            },
            {
              "from": "flip",
              "to": "flip",
              "symbol": "0",
              "output": "1"
            },
            {
              "from": "flip",
              "to": "flip",
              "symbol": "1",
              "output": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "output_alphabet": [
            "0",
            "1"
          ]
        }
      }
    ]
  }
};
