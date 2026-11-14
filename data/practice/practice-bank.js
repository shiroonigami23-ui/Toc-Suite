// Practice questions and reference solutions. Construction answers are checked by tests/audit-fa.test.mjs;
// conversion sets are generated from them by tools/build-conversion-practice.mjs.
window.PRACTICE_BANK = {
  "DFA": {
    "easy": [
      {
        "q": "DFA accepting all strings that start with \"0\" (Σ={0, 1})",
        "sol": "3 states: q0(start), q1(accept), q2(trap)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting all strings that end with \"1\" (Σ={0, 1})",
        "sol": "2 states: q0(start), q1(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting only the string \"10\" (Σ={0, 1})",
        "sol": "4 states: q0->q1->q2(accept)->q3(trap)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q3",
              "symbol": "0"
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
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          ]
        }
      },
      {
        "q": "DFA accepting any string of length exactly 2 (Σ={0, 1})",
        "sol": "4 states: q0, q1, q2(accept), q3(trap)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings that DO NOT contain the substring \"11\" (Σ={0, 1})",
        "sol": "3 states: q0(start/safe), q1(seen 1), q2(trap)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting all strings that end with \"0\" (Σ={0, 1})",
        "sol": "2 states: q0, q1(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
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
          ]
        }
      },
      {
        "q": "DFA accepting all strings NOT ending with \"1\" (Σ={0, 1})",
        "sol": "2 states: q0(start/accept), q1(seen 1)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA for strings with an odd number of 'a's (Σ={a})",
        "sol": "2 states: q0(even), q1(odd/accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "DFA accepting strings containing \"00\" as a substring (Σ={0, 1})",
        "sol": "3 states: q0, q1(seen 0), q2(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings with length ≥ 1 (Σ={0, 1})",
        "sol": "2 states: q0, q1(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      }
    ],
    "basic": [
      {
        "q": "DFA accepting strings containing the substring \"010\" (Σ={0, 1})",
        "sol": "4 states: q0, q1(0), q2(01), q3(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings with an even number of 0s (Σ={0, 1})",
        "sol": "2 states: q0(even/accept), q1(odd)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings that contain \"1\" at the third position from the start (Σ={0, 1})",
        "sol": "5 states: q0, q1, q2, q3(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qT",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "qT",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "qT",
              "to": "qT",
              "symbol": "0"
            },
            {
              "from": "qT",
              "to": "qT",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings of length at least 3 (Σ={a, b})",
        "sol": "4 states: q0, q1, q2, q3(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "DFA accepting strings where the last symbol is NOT \"0\" (Σ={0, 1})",
        "sol": "2 states: q0, q1(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings of length divisible by 3 (Σ={a})",
        "sol": "3 states for mod 3: q0(accept), q1, q2",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "DFA accepting strings containing an odd number of \"a\"s (Σ={a, b})",
        "sol": "2 states: q0(even), q1(odd/accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings with length >= 4 (Σ={0, 1})",
        "sol": "5 states: q0, q1, q2, q3, q4(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 250,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 400,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 550,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA for the strings not ending with 1 (Σ={0, 1})",
        "sol": "2 states (complement of L)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings where the second symbol from the start is \"0\" (Σ={0, 1})",
        "sol": "4 states: q0, q1, q2(accept), q3(trap)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "DFA accepting strings where the number of 1s is divisible by 3 (Σ={0, 1})",
        "sol": "3 states for mod 3: q0(mod 0), q1(mod 1), q2(mod 2)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings where the binary value is divisible by 3 (Σ={0, 1})",
        "sol": "3 states for mod 3, tracking value 2V+b",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings that DO NOT start with \"1\" OR DO NOT end with \"0\" (Σ={0, 1})",
        "sol": "4 states (minimal complete DFA)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings where every \"a\" is immediately followed by a \"b\" (Σ={a, b})",
        "sol": "3 states: q0(safe), q1(trap), q2(seen a)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
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
          ]
        }
      },
      {
        "q": "DFA for strings where the third symbol from the end is \"a\" (Σ={a, b})",
        "sol": "8 states (minimal complete DFA)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q7",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q0",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "DFA for strings containing an odd number of \"0\"s AND an odd number of \"1\"s (Σ={0, 1})",
        "sol": "4 states (2x2 matrix) with one accepting state.",
        "machine": {
          "states": [
            {
              "id": "qEE",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qOE",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qEO",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qOO",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qEE",
              "to": "qOE",
              "symbol": "0"
            },
            {
              "from": "qEE",
              "to": "qEO",
              "symbol": "1"
            },
            {
              "from": "qOE",
              "to": "qEE",
              "symbol": "0"
            },
            {
              "from": "qOE",
              "to": "qOO",
              "symbol": "1"
            },
            {
              "from": "qEO",
              "to": "qOO",
              "symbol": "0"
            },
            {
              "from": "qEO",
              "to": "qEE",
              "symbol": "1"
            },
            {
              "from": "qOO",
              "to": "qEO",
              "symbol": "0"
            },
            {
              "from": "qOO",
              "to": "qOE",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings with \"a\" but NOT containing \"b\" (Σ={a, b})",
        "sol": "3 states: q0, q1(a, accept), q2(trap)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings that start with \"0\" OR end with \"1\" (Σ={0, 1})",
        "sol": "4 states (minimal complete DFA)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA for the language (ab)* (Σ={a, b})",
        "sol": "3 states: q0(accept), q1.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings where the length = 2 (mod 4) (Σ={a})",
        "sol": "4 states for mod 4 tracking length.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 250,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 400,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 550,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "DFA accepting strings where the binary value is divisible by 5 (Σ={0, 1})",
        "sol": "5 states for mod 5",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 250,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 250,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 400,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 400,
              "y": 400,
              "initial": false,
              "accepting": false
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
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings where the length = 1 (mod 3) (Σ={a})",
        "sol": "3 states for mod 3 tracking length.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "DFA accepting strings that start and end with the same symbol (Σ={0, 1})",
        "sol": "6 states required to track start/end symbols.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0_0",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q0_1",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1_1",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1_0",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qT",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0_0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1_1",
              "symbol": "1"
            },
            {
              "from": "q0_0",
              "to": "q0_0",
              "symbol": "0"
            },
            {
              "from": "q0_0",
              "to": "q0_1",
              "symbol": "1"
            },
            {
              "from": "q0_1",
              "to": "q0_0",
              "symbol": "0"
            },
            {
              "from": "q0_1",
              "to": "q0_1",
              "symbol": "1"
            },
            {
              "from": "q1_1",
              "to": "q1_0",
              "symbol": "0"
            },
            {
              "from": "q1_1",
              "to": "q1_1",
              "symbol": "1"
            },
            {
              "from": "q1_0",
              "to": "q1_0",
              "symbol": "0"
            },
            {
              "from": "q1_0",
              "to": "q1_1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings that start with \"0\" and contain an odd number of \"1\"s (Σ={0, 1})",
        "sol": "4 states to track two properties (start/parity).",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0E",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0O",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qT",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0E",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "qT",
              "symbol": "1"
            },
            {
              "from": "q0E",
              "to": "q0E",
              "symbol": "0"
            },
            {
              "from": "q0E",
              "to": "q0O",
              "symbol": "1"
            },
            {
              "from": "q0O",
              "to": "q0O",
              "symbol": "0"
            },
            {
              "from": "q0O",
              "to": "q0E",
              "symbol": "1"
            },
            {
              "from": "qT",
              "to": "qT",
              "symbol": "0"
            },
            {
              "from": "qT",
              "to": "qT",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings that have an even number of \"a\"s AND an odd number of \"b\"s (Σ={a, b})",
        "sol": "4 states to track two independent parities (2x2 matrix).",
        "machine": {
          "states": [
            {
              "id": "qEE",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qOE",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qEO",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qOO",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qEE",
              "to": "qOE",
              "symbol": "a"
            },
            {
              "from": "qEE",
              "to": "qEO",
              "symbol": "b"
            },
            {
              "from": "qOE",
              "to": "qEE",
              "symbol": "a"
            },
            {
              "from": "qOE",
              "to": "qOO",
              "symbol": "b"
            },
            {
              "from": "qEO",
              "to": "qOO",
              "symbol": "a"
            },
            {
              "from": "qEO",
              "to": "qEE",
              "symbol": "b"
            },
            {
              "from": "qOO",
              "to": "qEO",
              "symbol": "a"
            },
            {
              "from": "qOO",
              "to": "qOE",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "DFA accepting strings that DO NOT contain the substring \"aba\" (Σ={a, b})",
        "sol": "4 states for prefix tracking.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "DFA for strings with an even number of 0s AND a length that is a multiple of 3 (Σ={0, 1})",
        "sol": "6 states (Cartesian product method).",
        "machine": {
          "states": [
            {
              "id": "qE0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "qE1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qE2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qO0",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qO1",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qO2",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qE0",
              "to": "qO1",
              "symbol": "0"
            },
            {
              "from": "qE0",
              "to": "qE1",
              "symbol": "1"
            },
            {
              "from": "qE1",
              "to": "qO2",
              "symbol": "0"
            },
            {
              "from": "qE1",
              "to": "qE2",
              "symbol": "1"
            },
            {
              "from": "qE2",
              "to": "qO0",
              "symbol": "0"
            },
            {
              "from": "qE2",
              "to": "qE0",
              "symbol": "1"
            },
            {
              "from": "qO0",
              "to": "qE1",
              "symbol": "0"
            },
            {
              "from": "qO0",
              "to": "qO1",
              "symbol": "1"
            },
            {
              "from": "qO1",
              "to": "qE2",
              "symbol": "0"
            },
            {
              "from": "qO1",
              "to": "qO2",
              "symbol": "1"
            },
            {
              "from": "qO2",
              "to": "qE0",
              "symbol": "0"
            },
            {
              "from": "qO2",
              "to": "qO0",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "DFA accepting strings where the second-to-last symbol is the same as the last symbol (Σ={0, 1})",
        "sol": "5 states: track last two symbols.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q00",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q01",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q10",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q11",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q00",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q00",
              "to": "q00",
              "symbol": "0"
            },
            {
              "from": "q00",
              "to": "q01",
              "symbol": "1"
            },
            {
              "from": "q01",
              "to": "q10",
              "symbol": "0"
            },
            {
              "from": "q01",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q10",
              "to": "q00",
              "symbol": "0"
            },
            {
              "from": "q10",
              "to": "q01",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q10",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings where every block of \"0\"s has length exactly 2 (Σ={0, 1})",
        "sol": "4 states (q0, q1, q2, q3, q4).",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q0",
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
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          ]
        }
      },
      {
        "q": "DFA accepting strings where length is <= and the substring \"01\" do not appear (Σ={0, 1})",
        "sol": "5 states: q0, q1, q2, q3(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qT",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "qT",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "qT",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "qT",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "qT",
              "symbol": "1"
            },
            {
              "from": "qT",
              "to": "qT",
              "symbol": "0"
            },
            {
              "from": "qT",
              "to": "qT",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      }
    ]
  },
  "NFA": {
    "easy": [
      {
        "q": "NFA accepting strings containing the substring \"101\" (Σ={0, 1})",
        "sol": "4 states, non-deterministic jump on first 1.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
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
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          ]
        }
      },
      {
        "q": "NFA accepting strings that ends with \"01\" (Σ={0, 1})",
        "sol": "3 states: q0(loop), q1(0), q2(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings where the third-to-last symbol is \"a\" (Σ={a, b})",
        "sol": "4 states in a line, non-deterministic jump.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA accepting strings that ends with \"a\" (Σ={a, b})",
        "sol": "2 states: q0(loop), q1(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA accepting language = (10)* (Σ={0, 1})",
        "sol": "2 states: q0, q1, q2(accept)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for strings where second to last symbol is \"0\" (Σ={0, 1})",
        "sol": "3 states in a line.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting only strings \"00\" or \"11\" (Σ={0, 1})",
        "sol": "5 states, non-deterministic split at start.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings that contain either \"a\" or \"b\" (Σ={a, b})",
        "sol": "3 states, two non-deterministic paths from q0.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qA",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "qA",
              "to": "qA",
              "symbol": "b"
            },
            {
              "from": "qB",
              "to": "qB",
              "symbol": "a"
            },
            {
              "from": "qB",
              "to": "qB",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA accepting strings where the length  >= 2 (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for L = a* b* (Σ={a, b})",
        "sol": "2 states: q0(loop a), q1(loop b, accept).",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
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
          ]
        }
      }
    ],
    "basic": [
      {
        "q": "NFA for language (00)* or (11)* (Σ={0, 1})",
        "sol": "5 states, non-deterministic choice from start.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "q1a",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings with exactly two \"1\"s (Σ={0, 1})",
        "sol": "3 states, loops on 0s between two transitions on 1.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for language (ab or ba)* (Σ={a, b})",
        "sol": "5 states, with non-deterministic splits.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2a",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q1a",
              "to": "q2a",
              "symbol": "b"
            },
            {
              "from": "q2a",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q2a",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q1b",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q1b",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA accepting strings NOT containing the substring \"00\" (Σ={0, 1})",
        "sol": "2 states (Non-deterministic version of the DFA).",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
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
          ]
        }
      },
      {
        "q": "NFA for language 0*1*0*1 (Σ={0, 1})",
        "sol": "4 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for language = (a* b) (Σ={a, b})",
        "sol": "2 states: q0(loop a), q1(accept).",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA accepting strings that contain \"a\" or \"b\" as the third symbol (Σ={a, b})",
        "sol": "4 states, non-deterministic split at q3.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA for language  (00)* 1 (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for strings where length exactly 2 (Σ={a, b})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA for language  a+ b* (Σ={a, b})",
        "sol": "3 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
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
              "to": "q2",
              "symbol": "b"
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
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "NFA accepting strings where the third symbol from the end is \"0\" (Σ={0, 1})",
        "sol": "4 states in a line, non-deterministic jump.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for strings where second-to-last symbol is \"a\" (Σ={a, b})",
        "sol": "4 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA for string that contains at least one \"0\" (Σ={0, 1})",
        "sol": "2 states, non-deterministic split.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings with an odd number of \"a\"s OR an odd number of \"b\"s (Σ={a, b})",
        "sol": "5 states, non-deterministic split from start.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA0",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB0",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qA0",
              "symbol": "ε"
            },
            {
              "from": "qA0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qA0",
              "symbol": "b"
            },
            {
              "from": "qA1",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA1",
              "symbol": "b"
            },
            {
              "from": "qS",
              "to": "qB0",
              "symbol": "ε"
            },
            {
              "from": "qB0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB0",
              "to": "qB0",
              "symbol": "a"
            },
            {
              "from": "qB1",
              "to": "qB0",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA for the language (ab)* or (ba)* (Σ={a, b})",
        "sol": "5 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA accepting language \"1\" or \"01\" (Σ={0, 1})",
        "sol": "3 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings that have an even length (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
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
          ]
        }
      },
      {
        "q": "NFA for language = 10* 1 (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings where the third symbol is DIFFERENT from the first symbol (Σ={a, b})",
        "sol": "6 states, split based on first symbol.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB2",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA2",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA2",
              "symbol": "b"
            },
            {
              "from": "qA2",
              "to": "qF",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "a"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "b"
            },
            {
              "from": "qB2",
              "to": "qF",
              "symbol": "a"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "a"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA for strings that starts and ends with \"a\" (Σ={a, b})",
        "sol": "3 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q1",
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
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "NFA for all strings except \"epsilon\" (Σ={0, 1})",
        "sol": "2 states, loops at start, jumps on 0, 1 to accept.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for strings with an even number of \"a\"s, followed by a number of \"b\"s where the count ≡ 1 (mod 3) (Σ={a, b})",
        "sol": "5 states.",
        "machine": {
          "states": [
            {
              "id": "qA0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB0",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB2",
              "x": 700,
              "y": 400,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qA0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "b"
            },
            {
              "from": "qB2",
              "to": "qB0",
              "symbol": "b"
            },
            {
              "from": "qB0",
              "to": "qB1",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "NFA for strings of \"a\"s whose length is a prime number no larger than 7, i.e. 2, 3, 5 or 7 (Σ={a}). (Primes in general are not a regular language, so the bound matters.)",
        "sol": "8 states counting the length up to 7; accepting at 2, 3, 5 and 7.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 279,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 447,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 616,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 784,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 953,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 1121,
              "y": 432
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 468
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "NFA for strings that contains \"a\" that appear before some \"b\" (Σ={a, b})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
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
          ]
        }
      },
      {
        "q": "NFA for the regular expression (00)* (11)* (00|11) (Σ={0, 1})",
        "sol": "7 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings where the last symbol is NOT the same as the first symbol (Σ={0, 1})",
        "sol": "5 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0*",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0f",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1*",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1f",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0*",
              "symbol": "0"
            },
            {
              "from": "q0*",
              "to": "q0*",
              "symbol": "0"
            },
            {
              "from": "q0*",
              "to": "q0*",
              "symbol": "1"
            },
            {
              "from": "q0*",
              "to": "q0f",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1*",
              "symbol": "1"
            },
            {
              "from": "q1*",
              "to": "q1*",
              "symbol": "0"
            },
            {
              "from": "q1*",
              "to": "q1*",
              "symbol": "1"
            },
            {
              "from": "q1*",
              "to": "q1f",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for strings containing a \"1\" which is followed later at some point by a \"0\" (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA accepting strings where the second symbol from the start is \"0\" AND the third symbol from the end is \"1\" (Σ={0, 1})",
        "sol": "11 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 818,
              "y": 450
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 818,
              "y": 220
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 818,
              "y": 680
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": false,
              "x": 1054,
              "y": 432
            },
            {
              "id": "q9",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 335
            },
            {
              "id": "q10",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q8",
              "to": "q9",
              "symbol": "0"
            },
            {
              "from": "q8",
              "to": "q10",
              "symbol": "1"
            },
            {
              "from": "q9",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q9",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q10",
              "to": "q9",
              "symbol": "0"
            },
            {
              "from": "q10",
              "to": "q10",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for the regular expression 1(01 or 00)* 1$ (Σ={0, 1})",
        "sol": "6 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q5",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
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
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q5",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "NFA for strings that starts with either \"000\" or \"111\" (Σ={0, 1})",
        "sol": "7 states.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q01",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q02",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q11",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q12",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q01",
              "symbol": "0"
            },
            {
              "from": "q01",
              "to": "q02",
              "symbol": "0"
            },
            {
              "from": "q02",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q12",
              "symbol": "1"
            },
            {
              "from": "q12",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      }
    ]
  },
  "ENFA": {
    "easy": [
      {
        "q": "ε-NFA for language a or b  (Σ={a, b})",
        "sol": "3 states, epsilon from start to two parallel paths.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "qS",
              "to": "qB",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for a?b optional \"a\", then \"b\" (Σ={a, b})",
        "sol": "3 states, epsilon bypass for \"a\".",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA to achieve a*b* (Σ={a, b})",
        "sol": "2 states, have epsilon between a* and b*.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
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
          ]
        }
      },
      {
        "q": "ε-NFA for language (01)* or (10)* (Σ={0, 1})",
        "sol": "5 states, Connect two paths via initial and final $\\epsilon$-transitions.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q01a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q01b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q10a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q10b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q01a",
              "symbol": "0"
            },
            {
              "from": "q01a",
              "to": "q01b",
              "symbol": "1"
            },
            {
              "from": "q01b",
              "to": "q01a",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q10a",
              "symbol": "1"
            },
            {
              "from": "q10a",
              "to": "q10b",
              "symbol": "0"
            },
            {
              "from": "q10b",
              "to": "q10a",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for  an optional \"0\" is followed by a \"1\" (Σ={0, 1})",
        "sol": "3 states, epsilon bypass for 0.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for string \"abc\" (Σ={a, b, c})",
        "sol": "4 states, make epsilon transitions between single symbol states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ]
        }
      },
      {
        "q": "ε-NFA for an optional \"a\" (Σ={a})",
        "sol": "2 states, make epsilon from start to end.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "ε-NFA for strings of \"a\"s where the length is either 2 or 4 (Σ={a})",
        "sol": "5 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "ε-NFA for strings of length exactly 2 (Σ={0, 1})",
        "sol": "3 states, epsilon transitions.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language a* b* (Σ={a, b})",
        "sol": "2 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
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
          ]
        }
      }
    ],
    "basic": [
      {
        "q": "ε-NFA for Regular Expression a(a or b)b (Σ={a, b})",
        "sol": "5 states, standard RE construction with epsilon.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for (0|1)*01* (ends with 0 followed by 1s) (Σ={0, 1})",
        "sol": "2 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language (a or b or c)* (Σ={a, b, c})",
        "sol": "1 state.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 300,
              "y": 300,
              "initial": true,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ]
        }
      },
      {
        "q": "ε-NFA for language (a|b)+a (Σ={a, b})",
        "sol": "3 states, $\\varepsilon$ transitions.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "b"
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
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for strings that contains exactly two \"1s\" (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for the language (ab)* (Σ={a, b})",
        "sol": "2 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for language (aa)* or (bb)* (Σ={a, b})",
        "sol": "5 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for language a(b or c)* (Σ={a, b, c})",
        "sol": "2 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ]
        }
      },
      {
        "q": "ε-NFA for language (01 | 10)*0 (Σ={0, 1})",
        "sol": "6 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "qF",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for the language \"0101\" or ε (Σ={0, 1})",
        "sol": "5 states, initial ε bypass.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "ε-NFA equivalent to Regular Expression (0|1)* 0 (Σ={0, 1})",
        "sol": "Standard RE construction, 3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language = (a . a)* (even length strings of \"aa\") (Σ={a})",
        "sol": "Connect two states with ε-loop and a transitions.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "ε-NFA for L = a* . b* . a* (Σ={a, b})",
        "sol": "3 states, ε transitions.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "ε"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for L = (a|b|c) . (a|b|c) with length exactly \"2\" (Σ={a, b, c})",
        "sol": "3 states, ε transitions.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "c"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ]
        }
      },
      {
        "q": "ε-NFA for L = 0+ (1 or ε) (Σ={0, 1})",
        "sol": "3 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for L = Sigma* 0 Sigma* 1 Sigma* (contains a 0 followed later by a 1) (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language (00 or 11) Sigma$ (Σ={0, 1})",
        "sol": "6 states.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q0b",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "q1b",
              "to": "qF",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language w | w is an odd length string of 0s or 1s (Σ={0, 1})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
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
          ]
        }
      },
      {
        "q": "ε-NFA for language (a or ε) . (b or ε) . (c or ε) (Σ={a, b, c})",
        "sol": "4 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 220
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 680
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ]
        }
      },
      {
        "q": "ε-NFA for the language (a|b)* . a (ends with a) (Σ={a, b})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "ε-NFA for $L = (a|b)* . (a . a or b . b) (ends with aa or bb) (Σ={a, b})",
        "sol": "5 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for language w | |w| = 0 mod 2 or |w| = 0 mod 3 (Σ={a})",
        "sol": "6 states, ε transitions for union.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 400,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q2a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3a",
              "x": 300,
              "y": 600,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3b",
              "x": 500,
              "y": 600,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3c",
              "x": 700,
              "y": 600,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q2a",
              "symbol": "ε"
            },
            {
              "from": "q2a",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q2a",
              "symbol": "a"
            },
            {
              "from": "qS",
              "to": "q3a",
              "symbol": "ε"
            },
            {
              "from": "q3a",
              "to": "q3b",
              "symbol": "a"
            },
            {
              "from": "q3b",
              "to": "q3c",
              "symbol": "a"
            },
            {
              "from": "q3c",
              "to": "q3a",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ]
        }
      },
      {
        "q": "ε-NFA for language (0* 1)* (10)* (Σ={0, 1})",
        "sol": "3 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language Sigma* 0 Sigma Sigma Sigma 1 Sigma* contains \"0\" separated by three symbols from \"1\" (Σ={0, 1})",
        "sol": "6 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 450,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 600,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 750,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q5",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language (a or b)* . a . (b or ε) (Σ={a, b})",
        "sol": "3 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "ε"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for the intersection of L1=(ab)* and L2=(ba)* (Σ={a, b})",
        "sol": "1 state.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 300,
              "y": 300,
              "initial": true,
              "accepting": true
            }
          ],
          "transitions": [],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for language (01)^n (10)^m, where n, m >= 1 (Σ={0, 1})",
        "sol": "5 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for $L = a \\cdot \\Sigma \\cdot a \\cdot \\Sigma$ (Σ={a, b})",
        "sol": "5 states (minimal DFA, trap state omitted)",
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ]
        }
      },
      {
        "q": "ε-NFA for language (00|11)* 01 (Σ={0, 1})",
        "sol": "5 states.",
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF1",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF2",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qA1",
              "symbol": "0"
            },
            {
              "from": "qA1",
              "to": "qS",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "qA2",
              "symbol": "1"
            },
            {
              "from": "qA2",
              "to": "qS",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "qF1",
              "symbol": "0"
            },
            {
              "from": "qF1",
              "to": "qF2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ]
        }
      },
      {
        "q": "ε-NFA for language (a or b or c)* d (Σ={a, b, c, d})",
        "sol": "4 states.",
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "d"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c",
            "d"
          ]
        }
      }
    ]
  },
  "ENFA_TO_NFA": {
    "easy": [
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language a or b) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 2 transitions.",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qS",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "qA",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qS",
              "to": "qA",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (a?b optional \"a\", then \"b\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 3 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (ε-NFA to achieve a*b*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 2 states, 4 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
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
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 850,
              "y": 450,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
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
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (01)* or (10)*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 5 states, 6 transitions.",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q01a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q01b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q10a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q10b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q01a",
              "to": "q01b",
              "symbol": "1"
            },
            {
              "from": "q01b",
              "to": "q01a",
              "symbol": "0"
            },
            {
              "from": "q10a",
              "to": "q10b",
              "symbol": "0"
            },
            {
              "from": "q10b",
              "to": "q10a",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q01a",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q10a",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q01a",
              "x": 700,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q01b",
              "x": 1000,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q10a",
              "x": 700,
              "y": 565,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q10b",
              "x": 1000,
              "y": 565,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q01a",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q10a",
              "symbol": "1"
            },
            {
              "from": "q01a",
              "to": "q01b",
              "symbol": "1"
            },
            {
              "from": "q01b",
              "to": "q01a",
              "symbol": "0"
            },
            {
              "from": "q10a",
              "to": "q10b",
              "symbol": "0"
            },
            {
              "from": "q10b",
              "to": "q10a",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (an optional \"0\" is followed by a \"1\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 3 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (string \"abc\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 3 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 250,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 550,
              "y": 468,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 850,
              "y": 432,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 1150,
              "y": 468,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (an optional \"a\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 2 states, 1 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 850,
              "y": 450,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (strings of \"a\"s where the length is either 2 or 4) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 6 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 287.5,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 1172.5,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (strings of length exactly 2) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 7 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 430,
              "y": 210
            }
          ],
          "transitions": [
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
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 1000,
              "y": 432,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language a* b*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 2 states, 4 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
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
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 850,
              "y": 450,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
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
          "type": "NFA"
        }
      }
    ],
    "basic": [
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (Regular Expression a(a or b)b) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 7 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 250,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 550,
              "y": 468,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 850,
              "y": 220,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 850,
              "y": 450,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 1150,
              "y": 468,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas ((0|1)*01* (ends with 0 followed by 1s)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 12 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 730,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 880,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 220
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "e1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (a or b or c)*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 2 states, 8 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 300,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 330,
              "y": 120
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
              "to": "q0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
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
              "to": "e0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "a"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "e0",
              "to": "e0",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (a|b)+a) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 11 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 330,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 1000,
              "y": 432,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "a"
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
              "from": "q1",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "e1",
              "to": "e1",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (strings that contains exactly two \"1s\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 5 states, 11 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 130,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 430,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 220,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 1000,
              "y": 432,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 450
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (the language (ab)*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 4 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 700,
              "y": 468,
              "initial": false,
              "accepting": false
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "e0",
              "symbol": "b"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (aa)* or (bb)*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 9 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 580,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 880,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 220
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 450
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language a(b or c)*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 2 states, 3 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 450,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "c"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (01 | 10)*0) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 11 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q0",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 130,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 343,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 770,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 557
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "e0",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (the language \"0101\" or ε) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 6 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 830,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 110,
              "y": 432,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 405,
              "y": 468,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 700,
              "y": 432,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 995,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 1290,
              "y": 432,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "q4",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      }
    ],
    "medium": [
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (ε-NFA equivalent to Regular Expression (0|1)* 0) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 6 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
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
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language = (a . a)* (even length strings of \"aa\")) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 4 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 700,
              "y": 468,
              "initial": false,
              "accepting": false
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e0",
              "symbol": "a"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (L = a* . b* . a*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 9 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "ε"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (L = (a|b|c) . (a|b|c) with length exactly \"2\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 10 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 430,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "c"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 1000,
              "y": 432,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "c"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (L = 0+ (1 or ε)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 3 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 580,
              "y": 120
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (L = Sigma* 0 Sigma* 1 Sigma* (contains a 0 followed later by a 1)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 22 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 130,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 330,
              "y": 210
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 530,
              "y": 300
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e2",
              "symbol": "ε"
            },
            {
              "from": "e2",
              "to": "q2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 220,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 1000,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 450
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 680
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "e2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e2",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "e2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "e2",
              "to": "e2",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (00 or 11) Sigma$) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 8 states, 13 transitions.",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 430,
              "y": 210
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 300
            }
          ],
          "transitions": [
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q0b",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q1a",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "e2",
              "symbol": "ε"
            },
            {
              "from": "e2",
              "to": "qF",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 250,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0a",
              "x": 550,
              "y": 220,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 850,
              "y": 220,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1a",
              "x": 550,
              "y": 450,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 850,
              "y": 450,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 1150,
              "y": 468,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 680
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "e2",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "e2",
              "symbol": "1"
            },
            {
              "from": "e2",
              "to": "qF",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language w | w is an odd length string of 0s or 1s) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 11 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 430,
              "y": 210
            }
          ],
          "transitions": [
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
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 700,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 1000,
              "y": 432,
              "initial": false,
              "accepting": false
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (a or ε) . (b or ε) . (c or ε)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 5 states, 8 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 220
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 680
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 730,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 880,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 130
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 557
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 770
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "c"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (the language (a|b)* . a (ends with a)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 6 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "ε"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      }
    ],
    "hard": [
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas ($L = (a|b)* . (a . a or b . b) (ends with aa or bb)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 7 states, 18 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 580,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 730,
              "y": 210
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 1030,
              "y": 300
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "e2",
              "symbol": "ε"
            },
            {
              "from": "e2",
              "to": "q3",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 220
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 450
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 220
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 680
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "e2",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "e2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "e2",
              "to": "e2",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language w | |w| = 0 mod 2 or |w| = 0 mod 3) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 7 transitions.",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 400,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q2a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3a",
              "x": 300,
              "y": 600,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3b",
              "x": 500,
              "y": 600,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3c",
              "x": 700,
              "y": 600,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q2a",
              "symbol": "ε"
            },
            {
              "from": "q2a",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q2a",
              "symbol": "a"
            },
            {
              "from": "qS",
              "to": "q3a",
              "symbol": "ε"
            },
            {
              "from": "q3a",
              "to": "q3b",
              "symbol": "a"
            },
            {
              "from": "q3b",
              "to": "q3c",
              "symbol": "a"
            },
            {
              "from": "q3c",
              "to": "q3a",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 250,
              "y": 432,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q2a",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2b",
              "x": 550,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3a",
              "x": 1150,
              "y": 468,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q3b",
              "x": 550,
              "y": 565,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3c",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "qS",
              "to": "q3b",
              "symbol": "a"
            },
            {
              "from": "q2a",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q2a",
              "symbol": "a"
            },
            {
              "from": "q3a",
              "to": "q3b",
              "symbol": "a"
            },
            {
              "from": "q3b",
              "to": "q3c",
              "symbol": "a"
            },
            {
              "from": "q3c",
              "to": "q3a",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (0* 1)* (10)*) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 5 states, 14 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 565
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 730,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 730,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q0",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 220
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 450
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 680
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "e0",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language Sigma* 0 Sigma Sigma Sigma 1 Sigma* contains \"0\" separated by three symbols from \"1\") into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 9 states, 22 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 450,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 600,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 750,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q5",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 130,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 210
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 555,
              "y": 300
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e2",
              "symbol": "ε"
            },
            {
              "from": "e2",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 110,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 346,
              "y": 220,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 582,
              "y": 335,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 818,
              "y": 468,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 1054,
              "y": 432,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q5",
              "x": 1290,
              "y": 468,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 450
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 680
            },
            {
              "id": "e2",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "e2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "e0",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "e2",
              "symbol": "0"
            },
            {
              "from": "e2",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (a or b)* . a . (b or ε)) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 3 states, 5 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "ε"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 335,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2",
              "x": 850,
              "y": 565,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "from": "q0",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (01)^n (10)^m, where n, m >= 1) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 8 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 287.5,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 877.5,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas ($L = a \\cdot \\Sigma \\cdot a \\cdot \\Sigma$) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 6 states, 9 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 287.5,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 877.5,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q3",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "e1",
              "to": "q3",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (00|11)* 01) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 7 states, 12 transitions.",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF1",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF2",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 330,
              "y": 210
            }
          ],
          "transitions": [
            {
              "from": "qA1",
              "to": "qS",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "qA2",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "qF1",
              "symbol": "0"
            },
            {
              "from": "qF1",
              "to": "qF2",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "qA1",
              "symbol": "0"
            },
            {
              "from": "qA2",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "qS",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "qS",
              "x": 400,
              "y": 432,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 700,
              "y": 343,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA2",
              "x": 700,
              "y": 557,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF1",
              "x": 700,
              "y": 130,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF2",
              "x": 1000,
              "y": 343,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 557
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 770
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qA2",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "e1",
              "symbol": "1"
            },
            {
              "from": "qS",
              "to": "qF1",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "qA1",
              "symbol": "0"
            },
            {
              "from": "qA1",
              "to": "qS",
              "symbol": "0"
            },
            {
              "from": "qA1",
              "to": "e0",
              "symbol": "0"
            },
            {
              "from": "qA2",
              "to": "qS",
              "symbol": "1"
            },
            {
              "from": "qA2",
              "to": "e0",
              "symbol": "1"
            },
            {
              "from": "qF1",
              "to": "qF2",
              "symbol": "1"
            },
            {
              "from": "e0",
              "to": "qA1",
              "symbol": "0"
            },
            {
              "from": "e1",
              "to": "qS",
              "symbol": "1"
            },
            {
              "from": "e1",
              "to": "e0",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        }
      },
      {
        "q": "Remove the ε-moves: convert the ε-NFA on the canvas (language (a or b or c)* d) into an equivalent NFA with no ε-transitions.",
        "sol": "ε-closure construction: 4 states, 14 transitions.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 130,
              "y": 120
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 230,
              "y": 210
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
              "to": "q0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "ε"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "ε"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "d"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c",
            "d"
          ],
          "type": "ENFA"
        },
        "machine": {
          "states": [
            {
              "id": "q0",
              "x": 550,
              "y": 450,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 850,
              "y": 220,
              "initial": false,
              "accepting": true
            },
            {
              "id": "e0",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
            },
            {
              "id": "e1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 680
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
              "to": "e0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "c"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "d"
            },
            {
              "from": "e0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "e0",
              "to": "e0",
              "symbol": "a"
            },
            {
              "from": "e0",
              "to": "e1",
              "symbol": "a"
            },
            {
              "from": "e1",
              "to": "q1",
              "symbol": "d"
            }
          ],
          "alphabet": [
            "a",
            "b",
            "c",
            "d"
          ],
          "type": "NFA"
        }
      }
    ]
  },
  "NFA_TO_DFA": {
    "easy": [
      {
        "q": "Subset construction: convert the NFA on the canvas (strings containing the substring \"101\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
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
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that ends with \"01\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where the third-to-last symbol is \"a\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 8 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q7",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that ends with \"a\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 2 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language = (10)*) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
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
              "from": "q1'",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 450
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
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
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where second to last symbol is \"0\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q0",
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (only strings \"00\" or \"11\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 5 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q0a'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q0a'",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q0a'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that contain either \"a\" or \"b\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 2 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qA'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qA",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "qA",
              "to": "qA",
              "symbol": "b"
            },
            {
              "from": "qB",
              "to": "qB",
              "symbol": "a"
            },
            {
              "from": "qB",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qA'",
              "to": "qA'",
              "symbol": "a"
            },
            {
              "from": "qA'",
              "to": "qA'",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qA'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "b"
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
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where the length  >= 2) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (L = a* b*) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
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
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      }
    ],
    "basic": [
      {
        "q": "Subset construction: convert the NFA on the canvas (language (00)* or (11)*) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 6 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q0a'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q0a'",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q0a'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings with exactly two \"1\"s) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language (ab or ba)*) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2a",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q1a",
              "to": "q2a",
              "symbol": "b"
            },
            {
              "from": "q2a",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q2a",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q1b",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q1a'",
              "to": "q2a",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1a'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings NOT containing the substring \"00\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language 0*1*0*1) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 5 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 610,
              "y": 588
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 480,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language = (a* b)) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that contain \"a\" or \"b\" as the third symbol) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language  (00)* 1) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where length exactly 2) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language  a+ b*) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 760,
              "y": 588
            }
          ],
          "transitions": [
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where the third symbol from the end is \"0\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 8 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
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
              "to": "q0",
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
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where second-to-last symbol is \"a\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 760,
              "y": 588
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (string that contains at least one \"0\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 2 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings with an odd number of \"a\"s OR an odd number of \"b\"s) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA0",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB0",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qA0",
              "symbol": "ε"
            },
            {
              "from": "qA0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qA0",
              "symbol": "b"
            },
            {
              "from": "qA1",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA1",
              "symbol": "b"
            },
            {
              "from": "qS",
              "to": "qB0",
              "symbol": "ε"
            },
            {
              "from": "qB0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB0",
              "to": "qB0",
              "symbol": "a"
            },
            {
              "from": "qB1",
              "to": "qB0",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (the language (ab)* or (ba)*) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 6 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 760,
              "y": 455
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 335
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 565
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language \"1\" or \"01\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 910,
              "y": 455
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that have an even length) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 2 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
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
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (language = 10* 1) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where the third symbol is DIFFERENT from the first symbol) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 7 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB2",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qA1'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA2",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA2",
              "symbol": "b"
            },
            {
              "from": "qA2",
              "to": "qF",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "a"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "b"
            },
            {
              "from": "qB2",
              "to": "qF",
              "symbol": "a"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "a"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "b"
            },
            {
              "from": "qA1'",
              "to": "qA2",
              "symbol": "a"
            },
            {
              "from": "qA1'",
              "to": "qA2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qA1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that starts and ends with \"a\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 4 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 760,
              "y": 588
            }
          ],
          "transitions": [
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "Subset construction: convert the NFA on the canvas (all strings except \"epsilon\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 2 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings with an even number of \"a\"s, followed by a number of \"b\"s where the count ≡ 1 (mod 3)) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 6 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "qA0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB0",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB2",
              "x": 700,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qA0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "b"
            },
            {
              "from": "qB2",
              "to": "qB0",
              "symbol": "b"
            },
            {
              "from": "qB0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qA1'",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qA1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 480,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings of \"a\"s whose length is a prime number no larger than 7, i.e. 2, 3, 5 or 7 (Σ={a}). (Primes in general are not a regular language, so the bound matters.)) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 9 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 279,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 447,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 616,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 784,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 953,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 1121,
              "y": 432
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 339,
              "y": 588
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 259,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 407,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 556,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 704,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 853,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 1001,
              "y": 432
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q8",
              "symbol": "a"
            },
            {
              "from": "q8",
              "to": "q8",
              "symbol": "a"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that contains \"a\" that appear before some \"b\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
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
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (the regular expression (00)* (11)* (00|11)) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 8 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 465,
              "y": 455
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 370,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 370,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 565
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 890,
              "y": 468
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where the last symbol is NOT the same as the first symbol) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 5 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0*",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0f",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1*",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1f",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0*",
              "symbol": "0"
            },
            {
              "from": "q0*",
              "to": "q0*",
              "symbol": "0"
            },
            {
              "from": "q0*",
              "to": "q0*",
              "symbol": "1"
            },
            {
              "from": "q0*",
              "to": "q0f",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1*",
              "symbol": "1"
            },
            {
              "from": "q1*",
              "to": "q1*",
              "symbol": "0"
            },
            {
              "from": "q1*",
              "to": "q1*",
              "symbol": "1"
            },
            {
              "from": "q1*",
              "to": "q1f",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings containing a \"1\" which is followed later at some point by a \"0\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 3 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings where the second symbol from the start is \"0\" AND the third symbol from the end is \"1\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 12 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 818,
              "y": 450
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 818,
              "y": 220
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 818,
              "y": 680
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": false,
              "x": 1054,
              "y": 432
            },
            {
              "id": "q9",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 335
            },
            {
              "id": "q10",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 406,
              "y": 455
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q8",
              "to": "q9",
              "symbol": "0"
            },
            {
              "from": "q8",
              "to": "q10",
              "symbol": "1"
            },
            {
              "from": "q9",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q9",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q10",
              "to": "q9",
              "symbol": "0"
            },
            {
              "from": "q10",
              "to": "q10",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 318,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 318,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 526,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 526,
              "y": 565
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 734,
              "y": 450
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 734,
              "y": 220
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": true,
              "x": 734,
              "y": 680
            },
            {
              "id": "q9",
              "initial": false,
              "accepting": false,
              "x": 942,
              "y": 432
            },
            {
              "id": "q10",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 335
            },
            {
              "id": "q11",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q9",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q6",
              "symbol": "1"
            },
            {
              "from": "q8",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q8",
              "to": "q9",
              "symbol": "1"
            },
            {
              "from": "q9",
              "to": "q10",
              "symbol": "0"
            },
            {
              "from": "q9",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q10",
              "to": "q7",
              "symbol": "0"
            },
            {
              "from": "q10",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q10",
              "symbol": "0"
            },
            {
              "from": "q11",
              "to": "q11",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (the regular expression 1(01 or 00)* 1$) into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 5 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q5",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
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
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q5",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 930,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Subset construction: convert the NFA on the canvas (strings that starts with either \"000\" or \"111\") into an equivalent DFA.",
        "sol": "Any equivalent DFA is accepted; the smallest has 7 states (including the trap state if needed).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q01",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q02",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q11",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q12",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q01'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q01",
              "symbol": "0"
            },
            {
              "from": "q01",
              "to": "q02",
              "symbol": "0"
            },
            {
              "from": "q02",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q12",
              "symbol": "1"
            },
            {
              "from": "q12",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "q01'",
              "to": "q02",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q01'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 565
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "1"
            }
          ]
        }
      }
    ]
  },
  "DFA_TO_MIN_DFA": {
    "easy": [
      {
        "q": "Minimise the DFA on the canvas (all strings that start with \"0\"): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 560
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 1360,
              "y": 900
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (all strings that end with \"1\"): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 920,
              "y": 560
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (only the string \"10\"): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 1360,
              "y": 900
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q1",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (any string of length exactly 2): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 542
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that DO NOT contain the substring \"11\"): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 560
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (all strings that end with \"0\"): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 920,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (all strings NOT ending with \"1\"): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 920,
              "y": 560
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings with an odd number of 'a's): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 920,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "a"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings containing \"00\" as a substring): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings with length ≥ 1): merge the equivalent states.",
        "sol": "3 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 920,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      }
    ],
    "basic": [
      {
        "q": "Minimise the DFA on the canvas (strings containing the substring \"010\"): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 320,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings with an even number of 0s): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 920,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that contain \"1\" at the third position from the start): merge the equivalent states.",
        "sol": "7 states → 5 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 542
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q4",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings of length at least 3): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 920,
              "y": 542
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the last symbol is NOT \"0\"): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 920,
              "y": 560
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings of length divisible by 3): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings containing an odd number of \"a\"s): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 920,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings with length >= 4): merge the equivalent states.",
        "sol": "7 states → 5 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 475,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 542
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (the strings not ending with 1): merge the equivalent states.",
        "sol": "4 states → 2 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 620,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 920,
              "y": 560
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the second symbol from the start is \"0\"): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 542
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "Minimise the DFA on the canvas (strings where the number of 1s is divisible by 3): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 578
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the binary value is divisible by 3): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 578
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
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that DO NOT start with \"1\" OR DO NOT end with \"0\"): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 445
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 675
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where every \"a\" is immediately followed by a \"b\"): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
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
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the third symbol from the end is \"a\"): merge the equivalent states.",
        "sol": "10 states → 8 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 320,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q7",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q7",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings containing an odd number of \"0\"s AND an odd number of \"1\"s): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 445
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings with \"a\" but NOT containing \"b\"): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 560
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 1360,
              "y": 900
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "b"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "a"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that start with \"0\" OR end with \"1\"): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 445
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 675
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (the language (ab)*): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 560
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 560
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
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
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the length = 2 (mod 4)): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 320,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1150,
              "y": 468
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "a"
            }
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "Minimise the DFA on the canvas (strings where the binary value is divisible by 5): merge the equivalent states.",
        "sol": "7 states → 5 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 565
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 320,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 578
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
              "to": "q1'",
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
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 565
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1150,
              "y": 468
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
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the length = 1 (mod 3)): merge the equivalent states.",
        "sol": "5 states → 3 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that start and end with the same symbol): merge the equivalent states.",
        "sol": "6 states → 5 states after partition refinement.",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0_0",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q0_1",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1_1",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1_0",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qT",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0_0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1_1",
              "symbol": "1"
            },
            {
              "from": "q0_0",
              "to": "q0_0",
              "symbol": "0"
            },
            {
              "from": "q0_0",
              "to": "q0_1",
              "symbol": "1"
            },
            {
              "from": "q0_1",
              "to": "q0_0",
              "symbol": "0"
            },
            {
              "from": "q0_1",
              "to": "q0_1",
              "symbol": "1"
            },
            {
              "from": "q1_1",
              "to": "q1_0",
              "symbol": "0"
            },
            {
              "from": "q1_1",
              "to": "q1_1",
              "symbol": "1"
            },
            {
              "from": "q1_0",
              "to": "q1_0",
              "symbol": "0"
            },
            {
              "from": "q1_0",
              "to": "q1_1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "DFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that start with \"0\" and contain an odd number of \"1\"s): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": false,
              "x": 1360,
              "y": 900
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that have an even number of \"a\"s AND an odd number of \"b\"s): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": false,
              "x": 470,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 770,
              "y": 445
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q0'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings that DO NOT contain the substring \"aba\"): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 400,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings with an even number of 0s AND a length that is a multiple of 3): merge the equivalent states.",
        "sol": "8 states → 6 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 320,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 620,
              "y": 445
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q0'",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q4",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 1150,
              "y": 468
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where the second-to-last symbol is the same as the last symbol): merge the equivalent states.",
        "sol": "7 states → 5 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 675
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": true,
              "x": 770,
              "y": 445
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2'",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q2'",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 335
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where every block of \"0\"s has length exactly 2): merge the equivalent states.",
        "sol": "6 states → 4 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q0'",
              "initial": false,
              "accepting": true,
              "x": 400,
              "y": 542
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 578
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q0",
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
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q0'",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q0'",
              "to": "q0'",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q0",
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
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Minimise the DFA on the canvas (strings where length is <= and the substring \"01\" do not appear): merge the equivalent states.",
        "sol": "7 states → 5 states after partition refinement.",
        "source": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 480,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 578
            },
            {
              "id": "q2'",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 542
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2'",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2'",
              "to": "q3",
              "symbol": "1"
            }
          ]
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 480,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
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
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      }
    ]
  },
  "NFA_TO_MIN_DFA": {
    "easy": [
      {
        "q": "Convert the NFA on the canvas (strings containing the substring \"101\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
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
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
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
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that ends with \"01\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where the third-to-last symbol is \"a\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 8 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q7",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that ends with \"a\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 2 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language = (10)*) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
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
              "from": "q1'",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 450
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
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
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where second to last symbol is \"0\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q0",
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (only strings \"00\" or \"11\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 5 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q0a'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q0a'",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q0a'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that contain either \"a\" or \"b\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 2 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qA'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qA",
              "to": "qA",
              "symbol": "a"
            },
            {
              "from": "qA",
              "to": "qA",
              "symbol": "b"
            },
            {
              "from": "qB",
              "to": "qB",
              "symbol": "a"
            },
            {
              "from": "qB",
              "to": "qB",
              "symbol": "b"
            },
            {
              "from": "qA'",
              "to": "qA'",
              "symbol": "a"
            },
            {
              "from": "qA'",
              "to": "qA'",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qA'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "b"
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
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where the length  >= 2) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (L = a* b*) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
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
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      }
    ],
    "basic": [
      {
        "q": "Convert the NFA on the canvas (language (00)* or (11)*) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 6 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q0a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0b",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q0a'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "q0a",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "q0b",
              "to": "q0a",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q1a",
              "to": "q1b",
              "symbol": "1"
            },
            {
              "from": "q1b",
              "to": "q1a",
              "symbol": "1"
            },
            {
              "from": "q0a'",
              "to": "q0b",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q0a'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings with exactly two \"1\"s) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language (ab or ba)*) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1a",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1b",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2a",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q2b",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1a'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q1a",
              "to": "q2a",
              "symbol": "b"
            },
            {
              "from": "q2a",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q2a",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q1b",
              "to": "q2b",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q1a",
              "symbol": "a"
            },
            {
              "from": "q2b",
              "to": "q1b",
              "symbol": "b"
            },
            {
              "from": "q1a'",
              "to": "q2a",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1a'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings NOT containing the substring \"00\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language 0*1*0*1) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 5 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 610,
              "y": 588
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 480,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language = (a* b)) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "b"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 450
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that contain \"a\" or \"b\" as the third symbol) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language  (00)* 1) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where length exactly 2) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q1",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language  a+ b*) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 760,
              "y": 588
            }
          ],
          "transitions": [
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      }
    ],
    "medium": [
      {
        "q": "Convert the NFA on the canvas (strings where the third symbol from the end is \"0\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 8 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 250,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 550,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 343
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 557
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 130
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 343
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 557
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 770
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
              "to": "q0",
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
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q0",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where second-to-last symbol is \"a\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 760,
              "y": 588
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q0",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (string that contains at least one \"0\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 2 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings with an odd number of \"a\"s OR an odd number of \"b\"s) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA0",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB0",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "qA0",
              "symbol": "ε"
            },
            {
              "from": "qA0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qA0",
              "symbol": "b"
            },
            {
              "from": "qA1",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA1",
              "symbol": "b"
            },
            {
              "from": "qS",
              "to": "qB0",
              "symbol": "ε"
            },
            {
              "from": "qB0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB0",
              "to": "qB0",
              "symbol": "a"
            },
            {
              "from": "qB1",
              "to": "qB0",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB1",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q0",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (the language (ab)* or (ba)*) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 6 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 760,
              "y": 455
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 335
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 565
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language \"1\" or \"01\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 910,
              "y": 455
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 480,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 780,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that have an even length) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 2 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": true
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
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
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": true,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 850,
              "y": 450
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
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (language = 10* 1) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where the third symbol is DIFFERENT from the first symbol) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 7 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB2",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qA1'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA2",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA2",
              "symbol": "b"
            },
            {
              "from": "qA2",
              "to": "qF",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "a"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "b"
            },
            {
              "from": "qB2",
              "to": "qF",
              "symbol": "a"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "a"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "b"
            },
            {
              "from": "qA1'",
              "to": "qA2",
              "symbol": "a"
            },
            {
              "from": "qA1'",
              "to": "qA2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "qA1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that starts and ends with \"a\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 4 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1000,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": true,
              "x": 760,
              "y": 588
            }
          ],
          "transitions": [
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 930,
              "y": 432
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            }
          ]
        }
      }
    ],
    "hard": [
      {
        "q": "Convert the NFA on the canvas (all strings except \"epsilon\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 2 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": true
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q1'",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 550,
              "y": 450
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": true,
              "x": 850,
              "y": 450
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
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings with an even number of \"a\"s, followed by a number of \"b\"s where the count ≡ 1 (mod 3)) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 6 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "qA0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "qA1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB0",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qB1",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "qB2",
              "x": 700,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qA1'",
              "x": 360,
              "y": 420,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qA0",
              "to": "qA1",
              "symbol": "a"
            },
            {
              "from": "qA1",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qB1",
              "to": "qB2",
              "symbol": "b"
            },
            {
              "from": "qB2",
              "to": "qB0",
              "symbol": "b"
            },
            {
              "from": "qB0",
              "to": "qB1",
              "symbol": "b"
            },
            {
              "from": "qA1'",
              "to": "qA0",
              "symbol": "a"
            },
            {
              "from": "qA0",
              "to": "qA1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a",
            "b"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 480,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q1",
              "to": "q0",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "b"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "b"
            },
            {
              "from": "q4",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "b"
            },
            {
              "from": "q5",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings of \"a\"s whose length is a prime number no larger than 7, i.e. 2, 3, 5 or 7 (Σ={a}). (Primes in general are not a regular language, so the bound matters.)) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 9 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 279,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 447,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 616,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 784,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 953,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 1121,
              "y": 432
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 468
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 339,
              "y": 588
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "a"
            },
            {
              "from": "q1'",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "a"
            }
          ],
          "alphabet": [
            "a"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 259,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 407,
              "y": 432
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 556,
              "y": 468
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 704,
              "y": 432
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 853,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 1001,
              "y": 432
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 468
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "a"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "a"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "a"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "a"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "a"
            },
            {
              "from": "q7",
              "to": "q8",
              "symbol": "a"
            },
            {
              "from": "q8",
              "to": "q8",
              "symbol": "a"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that contains \"a\" that appear before some \"b\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0",
              "symbol": "a"
            },
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
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
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
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "a",
            "b"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q1",
              "symbol": "a"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "b"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "a"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "b"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (the regular expression (00)* (11)* (00|11)) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 8 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 405,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 700,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 995,
              "y": 468
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 432
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 465,
              "y": 455
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 370,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 370,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": true,
              "x": 630,
              "y": 565
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 890,
              "y": 468
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 432
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q7",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where the last symbol is NOT the same as the first symbol) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 5 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q0*",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q0f",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q1*",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q1f",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
            {
              "from": "q0",
              "to": "q0*",
              "symbol": "0"
            },
            {
              "from": "q0*",
              "to": "q0*",
              "symbol": "0"
            },
            {
              "from": "q0*",
              "to": "q0*",
              "symbol": "1"
            },
            {
              "from": "q0*",
              "to": "q0f",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1*",
              "symbol": "1"
            },
            {
              "from": "q1*",
              "to": "q1*",
              "symbol": "0"
            },
            {
              "from": "q1*",
              "to": "q1*",
              "symbol": "1"
            },
            {
              "from": "q1*",
              "to": "q1f",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings containing a \"1\" which is followed later at some point by a \"0\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 3 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 300,
              "initial": false,
              "accepting": true
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
              "to": "q0",
              "symbol": "1"
            },
            {
              "from": "q0",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 400,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 700,
              "y": 468
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": true,
              "x": 1000,
              "y": 432
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
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q2",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings where the second symbol from the start is \"0\" AND the third symbol from the end is \"1\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 12 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 346,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 582,
              "y": 565
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 818,
              "y": 450
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 818,
              "y": 220
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 818,
              "y": 680
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": false,
              "x": 1054,
              "y": 432
            },
            {
              "id": "q9",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 335
            },
            {
              "id": "q10",
              "initial": false,
              "accepting": true,
              "x": 1290,
              "y": 565
            },
            {
              "id": "q1'",
              "initial": false,
              "accepting": false,
              "x": 406,
              "y": 455
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q8",
              "to": "q9",
              "symbol": "0"
            },
            {
              "from": "q8",
              "to": "q10",
              "symbol": "1"
            },
            {
              "from": "q9",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q9",
              "to": "q7",
              "symbol": "1"
            },
            {
              "from": "q10",
              "to": "q9",
              "symbol": "0"
            },
            {
              "from": "q10",
              "to": "q10",
              "symbol": "1"
            },
            {
              "from": "q1'",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q0",
              "to": "q1'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 110,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 318,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 318,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 526,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 526,
              "y": 565
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": false,
              "x": 734,
              "y": 450
            },
            {
              "id": "q7",
              "initial": false,
              "accepting": true,
              "x": 734,
              "y": 220
            },
            {
              "id": "q8",
              "initial": false,
              "accepting": true,
              "x": 734,
              "y": 680
            },
            {
              "id": "q9",
              "initial": false,
              "accepting": false,
              "x": 942,
              "y": 432
            },
            {
              "id": "q10",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 335
            },
            {
              "id": "q11",
              "initial": false,
              "accepting": true,
              "x": 1150,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q7",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q9",
              "symbol": "1"
            },
            {
              "from": "q7",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q7",
              "to": "q6",
              "symbol": "1"
            },
            {
              "from": "q8",
              "to": "q5",
              "symbol": "0"
            },
            {
              "from": "q8",
              "to": "q9",
              "symbol": "1"
            },
            {
              "from": "q9",
              "to": "q10",
              "symbol": "0"
            },
            {
              "from": "q9",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q10",
              "to": "q7",
              "symbol": "0"
            },
            {
              "from": "q10",
              "to": "q8",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q10",
              "symbol": "0"
            },
            {
              "from": "q11",
              "to": "q11",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (the regular expression 1(01 or 00)* 1$) into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 5 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "q0",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q1",
              "x": 300,
              "y": 300,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q2",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q3",
              "x": 700,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q4",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q5",
              "x": 900,
              "y": 300,
              "initial": false,
              "accepting": true
            }
          ],
          "transitions": [
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
              "from": "q2",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q5",
              "symbol": "1"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 330,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 630,
              "y": 468
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 930,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": true,
              "x": 930,
              "y": 565
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q1",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q1",
              "symbol": "1"
            }
          ]
        }
      },
      {
        "q": "Convert the NFA on the canvas (strings that starts with either \"000\" or \"111\") into the minimal DFA.",
        "sol": "Subset construction, then minimisation: 7 states (a missing trap state is also accepted).",
        "source": {
          "states": [
            {
              "id": "qS",
              "x": 100,
              "y": 300,
              "initial": true,
              "accepting": false
            },
            {
              "id": "q01",
              "x": 300,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q02",
              "x": 500,
              "y": 200,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q11",
              "x": 300,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "q12",
              "x": 500,
              "y": 400,
              "initial": false,
              "accepting": false
            },
            {
              "id": "qF",
              "x": 700,
              "y": 300,
              "initial": false,
              "accepting": true
            },
            {
              "id": "q01'",
              "x": 360,
              "y": 320,
              "initial": false,
              "accepting": false
            }
          ],
          "transitions": [
            {
              "from": "qS",
              "to": "q01",
              "symbol": "0"
            },
            {
              "from": "q01",
              "to": "q02",
              "symbol": "0"
            },
            {
              "from": "q02",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q11",
              "symbol": "1"
            },
            {
              "from": "q11",
              "to": "q12",
              "symbol": "1"
            },
            {
              "from": "q12",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "0"
            },
            {
              "from": "qF",
              "to": "qF",
              "symbol": "1"
            },
            {
              "from": "q01'",
              "to": "q02",
              "symbol": "0"
            },
            {
              "from": "qS",
              "to": "q01'",
              "symbol": "0"
            }
          ],
          "alphabet": [
            "0",
            "1"
          ],
          "type": "NFA"
        },
        "machine": {
          "type": "DFA",
          "title": "Untitled Automaton",
          "alphabet": [
            "0",
            "1"
          ],
          "states": [
            {
              "id": "q0",
              "initial": true,
              "accepting": false,
              "x": 180,
              "y": 432
            },
            {
              "id": "q1",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 335
            },
            {
              "id": "q2",
              "initial": false,
              "accepting": false,
              "x": 480,
              "y": 565
            },
            {
              "id": "q3",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 335
            },
            {
              "id": "q4",
              "initial": false,
              "accepting": false,
              "x": 1290,
              "y": 790
            },
            {
              "id": "q5",
              "initial": false,
              "accepting": false,
              "x": 780,
              "y": 565
            },
            {
              "id": "q6",
              "initial": false,
              "accepting": true,
              "x": 1080,
              "y": 468
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
              "to": "q2",
              "symbol": "1"
            },
            {
              "from": "q1",
              "to": "q3",
              "symbol": "0"
            },
            {
              "from": "q1",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q2",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q2",
              "to": "q5",
              "symbol": "1"
            },
            {
              "from": "q3",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q3",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q4",
              "to": "q4",
              "symbol": "1"
            },
            {
              "from": "q5",
              "to": "q4",
              "symbol": "0"
            },
            {
              "from": "q5",
              "to": "q6",
              "symbol": "1"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "0"
            },
            {
              "from": "q6",
              "to": "q6",
              "symbol": "1"
            }
          ]
        }
      }
    ]
  }
};
