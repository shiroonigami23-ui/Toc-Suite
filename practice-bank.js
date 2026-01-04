window.PRACTICE_BANK = {
        DFA: {
          easy: [
            {
              q: 'DFA accepting all strings that start with "0" (Σ={0, 1})', sol: '3 states: q0(start), q1(accept), q2(trap)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q2", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. DFA accepting all strings that end with "1"
            {
              q: 'DFA accepting all strings that end with "1" (Σ={0, 1})', sol: '2 states: q0(start), q1(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 3. DFA accepting only the string "10"
            {
              q: 'DFA accepting only the string "10" (Σ={0, 1})', sol: '4 states: q0->q1->q2(accept)->q3(trap)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q0", "to": "q3", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q3", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 4. DFA accepting any string of length exactly 2
            {
              q: 'DFA accepting any string of length exactly 2 (Σ={0, 1})', sol: '4 states: q0, q1, q2(accept), q3(trap)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
           // 5. DFA accepting strings that DO NOT contain the substring "11"
            {
              q: 'DFA accepting strings that DO NOT contain the substring "11" (Σ={0, 1})', sol: '3 states: q0(start/safe), q1(seen 1), q2(trap)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. DFA for strings that end with "0"
{
  q: 'DFA accepting all strings that end with "0" (Σ={0, 1})',
  sol: '2 states: q0, q1(accept)',
  "machine": { 
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 7. DFA accepting all strings NOT ending with "1"
            {
              q: 'DFA accepting all strings NOT ending with "1" (Σ={0, 1})', sol: '2 states: q0(start/accept), q1(seen 1)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. DFA for the language L={w | w contains an odd number of symbols}
            {
               q: "DFA for strings with an odd number of 'a's (Σ={a})",sol: '2 states: q0(even), q1(odd/accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q0", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
           // 9. DFA accepting strings containing "00" as a substring
            {
              q: 'DFA accepting strings containing "00" as a substring (Σ={0, 1})', sol: '3 states: q0, q1(seen 0), q2(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. DFA accepting strings with length >= 1
            {
              q: 'DFA accepting strings with length ≥ 1 (Σ={0, 1})',sol: '2 states: q0, q1(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            }
          ],
          basic: [
            // 1. DFA accepting strings containing the substring "010"
            {
              q: 'DFA accepting strings containing the substring "010" (Σ={0, 1})', sol: '4 states: q0, q1(0), q2(01), q3(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q0", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. DFA accepting strings with an even number of 0s
            {
              q: 'DFA accepting strings with an even number of 0s (Σ={0, 1})', sol: '2 states: q0(even/accept), q1(odd)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            }, 
            // 3. DFA accepting strings that contain "1" at the third position from the start
            {
              q: 'DFA accepting strings that contain "1" at the third position from the start (Σ={0, 1})', sol: '5 states: q0, q1, q2, q3(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true },
                  { "id": "qT", "x": 900, "y": 300, "initial": false, "accepting": false } // Trap state for '0' at pos 3
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q2", "to": "qT", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" },
                  { "from": "qT", "to": "qT", "symbol": "0" },
                  { "from": "qT", "to": "qT", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 4. DFA accepting strings of length at least 3
            {
              q: 'DFA accepting strings of length at least 3 (Σ={a, b})', sol: '4 states: q0, q1, q2, q3(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q2", "to": "q3", "symbol": "b" },
                  { "from": "q3", "to": "q3", "symbol": "a" },
                  { "from": "q3", "to": "q3", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 5. DFA accepting strings where the last symbol is NOT "0" (i.e., ends in 1)
            {
              q: 'DFA accepting strings where the last symbol is NOT "0" (Σ={0, 1})', sol: '2 states: q0, q1(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. DFA accepting strings of length divisible by 3 (on alphabet {a})
            {
              q: 'DFA accepting strings of length divisible by 3 (Σ={a})', sol: '3 states for mod 3: q0(accept), q1, q2', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q0", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
            // 7. DFA accepting strings containing an odd number of "a"s
            {
              q: 'DFA accepting strings containing an odd number of "a"s (Σ={a, b})', sol: '2 states: q0(even), q1(odd/accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q1", "to": "q0", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 8. DFA accepting strings with length >= 4
            {
              q: 'DFA accepting strings with length >= 4 (Σ={0, 1})', sol: '5 states: q0, q1, q2, q3, q4(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 250, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 400, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 550, "y": 300, "initial": false, "accepting": false },
                  { "id": "q4", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q4", "symbol": "0" },
                  { "from": "q3", "to": "q4", "symbol": "1" },
                  { "from": "q4", "to": "q4", "symbol": "0" },
                  { "from": "q4", "to": "q4", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
           
                  
            // 9. DFA for the complement of L = (0|1)*1 (i.e., strings not ending in 1)
            {
              q: 'DFA for the strings not ending with 1 (Σ={0, 1})', sol: '2 states (complement of L)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. DFA accepting strings where the second symbol from the start is "0"
            {
              q: 'DFA accepting strings where the second symbol from the start is "0" (Σ={0, 1})', sol: '4 states: q0, q1, q2(accept), q3(trap)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q3", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            }
          ],
          medium: [
            // 1. DFA accepting strings where the number of 1s is divisible by 3
            {
              q: 'DFA accepting strings where the number of 1s is divisible by 3 (Σ={0, 1})', sol: '3 states for mod 3: q0(mod 0), q1(mod 1), q2(mod 2)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 300, "y": 400, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q2", "to": "q0", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. DFA accepting strings where the binary value is divisible by 3
            {
              q: 'DFA accepting strings where the binary value is divisible by 3 (Σ={0, 1})', sol: '3 states for mod 3, tracking value 2V+b', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 300, "y": 400, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" },
                  { "from": "q2", "to": "q1", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 3. DFA accepting strings that DO NOT start with "1" OR DO NOT end with "0"
            {
              q: 'DFA accepting strings that DO NOT start with "1" OR DO NOT end with "0" (Σ={0, 1})', sol: '4 states: Complement of L="1Σ*0"', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q2", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q3", "x": 500, "y": 400, "initial": false, "accepting": false } // Trap for 1Σ*0
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q2", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 4. DFA accepting strings where every "a" is immediately followed by a "b"
            {
              q: 'DFA accepting strings where every "a" is immediately followed by a "b" (Σ={a, b})', sol: '3 states: q0(safe), q1(trap), q2(seen a)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q1", "to": "q0", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q2", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 5. DFA accepting the language of Σ* a Σ² (third symbol from the end is "a")
            {
              q: 'DFA for strings where the third symbol from the end is "a" (Σ={a, b})', sol: '6 states, tracking last three symbols.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qAA", "x": 500, "y": 100, "initial": false, "accepting": false },
                  { "id": "qBB", "x": 500, "y": 500, "initial": false, "accepting": false },
                  { "id": "qB", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "qF", "x": 700, "y": 300, "initial": false, "accepting": true } // Simplified final state set
                ],
                "transitions": [
                  // This DFA is too complex for a clean 4-state layout. Using 8 logical states (0, A, B, A_, B_, A__, B__) and only mapping necessary transitions for compactness.
                  // q0 -> q(last)
                  { "from": "q0", "to": "qA", "symbol": "a" },
                  { "from": "q0", "to": "qB", "symbol": "b" },
                  // q(last) -> q(last 2)
                  { "from": "qA", "to": "qAA", "symbol": "a" },
                  { "from": "qA", "to": "qBB", "symbol": "b" },
                  { "from": "qB", "to": "qAA", "symbol": "a" },
                  { "from": "qB", "to": "qBB", "symbol": "b" },
                  // q(last 2) -> q(last 3) = qF on 'a' or 'b'
                  // q(last 3) = qA on a/b (accepted)
                  { "from": "qAA", "to": "qA", "symbol": "a" },
                  { "from": "qAA", "to": "qB", "symbol": "b" },
                  { "from": "qBB", "to": "qA", "symbol": "a" },
                  { "from": "qBB", "to": "qB", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 6. DFA for strings containing an odd number of "0"s AND an odd number of "1"s
            {
              q: 'DFA for strings containing an odd number of "0"s AND an odd number of "1"s (Σ={0, 1})', sol: '4 states (2x2 matrix) with one accepting state.', "machine": {
                "states": [
                  { "id": "qEE", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qOE", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qEO", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "qOO", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qEE", "to": "qOE", "symbol": "0" },
                  { "from": "qEE", "to": "qEO", "symbol": "1" },
                  { "from": "qOE", "to": "qEE", "symbol": "0" },
                  { "from": "qOE", "to": "qOO", "symbol": "1" },
                  { "from": "qEO", "to": "qOO", "symbol": "0" },
                  { "from": "qEO", "to": "qEE", "symbol": "1" },
                  { "from": "qOO", "to": "qEO", "symbol": "0" },
                  { "from": "qOO", "to": "qOE", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 7. DFA accepting strings with "a" but NOT containing "b"
            {
              q: 'DFA accepting strings with "a" but NOT containing "b" (Σ={a, b})', sol: '3 states: q0, q1(a, accept), q2(trap)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q2", "symbol": "b" },
                  { "from": "q1", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q2", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 8. DFA accepting strings that start with "0" OR end with "1"
            {
              q: 'DFA accepting strings that start with "0" OR end with "1" (Σ={0, 1})', sol: '4 states (Union logic).', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q2", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q3", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q2", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q3", "symbol": "1" },
                  { "from": "q2", "to": "q1", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q1", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 9. DFA for the language L=(ab)*
            {
              q: 'DFA for the language (ab)* (Σ={a, b})', sol: '3 states: q0(accept), q1.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false } // Trap state
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q2", "symbol": "b" },
                  { "from": "q1", "to": "q0", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q2", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 10. DFA accepting strings where the length is L ≡ 2 mod 4
            {
              q: 'DFA accepting strings where the length = 2 (mod 4) (Σ={a})', sol: '4 states for mod 4 tracking length.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 250, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 400, "y": 300, "initial": false, "accepting": true },
                  { "id": "q3", "x": 550, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q3", "to": "q0", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            }
          ],
          hard: [
            // 1. DFA accepting strings where the binary value is divisible by 5
            {
              q: 'DFA accepting strings where the binary value is divisible by 5 (Σ={0, 1})', sol: '5 states for mod 5', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 250, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 250, "y": 400, "initial": false, "accepting": false },
                  { "id": "q3", "x": 400, "y": 200, "initial": false, "accepting": false },
                  { "id": "q4", "x": 400, "y": 400, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q3", "symbol": "1" },
                  { "from": "q2", "to": "q4", "symbol": "0" },
                  { "from": "q2", "to": "q0", "symbol": "1" },
                  { "from": "q3", "to": "q1", "symbol": "0" },
                  { "from": "q3", "to": "q2", "symbol": "1" },
                  { "from": "q4", "to": "q3", "symbol": "0" },
                  { "from": "q4", "to": "q4", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. DFA accepting strings where the length is L ≡ 1 mod 3
            {
              q: 'DFA accepting strings where the length = 1 (mod 3) (Σ={a})', sol: '3 states for mod 3 tracking length.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q0", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
            // 3. DFA accepting strings that start and end with the same symbol
            {
              q: 'DFA accepting strings that start and end with the same symbol (Σ={0, 1})', sol: '6 states required to track start/end symbols.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q0_0", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q0_1", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q1_1", "x": 300, "y": 400, "initial": false, "accepting": true },
                  { "id": "q1_0", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false } // Trap state (not strictly needed but simplifies logic)
                ], "transitions": [
                  { "from": "q0", "to": "q0_0", "symbol": "0" },
                  { "from": "q0", "to": "q1_1", "symbol": "1" },
                  { "from": "q0_0", "to": "q0_0", "symbol": "0" },
                  { "from": "q0_0", "to": "q0_1", "symbol": "1" },
                  { "from": "q0_1", "to": "q0_0", "symbol": "0" },
                  { "from": "q0_1", "to": "q0_1", "symbol": "1" },
                  { "from": "q1_1", "to": "q1_0", "symbol": "0" },
                  { "from": "q1_1", "to": "q1_1", "symbol": "1" },
                  { "from": "q1_0", "to": "q1_0", "symbol": "0" },
                  { "from": "q1_0", "to": "q1_1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 4. DFA accepting strings that start with "0" and contain an odd number of "1"s
            {
              q: 'DFA accepting strings that start with "0" and contain an odd number of "1"s (Σ={0, 1})', sol: '4 states to track two properties (start/parity).', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q0E", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q0O", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false } // Trap for starting with 1
                ],
                "transitions": [
                  { "from": "q0", "to": "q0E", "symbol": "0" },
                  { "from": "q0", "to": "qT", "symbol": "1" },
                  { "from": "q0E", "to": "q0E", "symbol": "0" },
                  { "from": "q0E", "to": "q0O", "symbol": "1" },
                  { "from": "q0O", "to": "q0O", "symbol": "0" },
                  { "from": "q0O", "to": "q0E", "symbol": "1" },
                  { "from": "qT", "to": "qT", "symbol": "0" },
                  { "from": "qT", "to": "qT", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            
            // 5. DFA accepting strings that have an even number of "a"s AND an odd number of "b"s
            {
              q: 'DFA accepting strings that have an even number of "a"s AND an odd number of "b"s (Σ={a, b})', sol: '4 states to track two independent parities (2x2 matrix).', "machine": {
                "states": [
                  { "id": "qEE", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qOE", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qEO", "x": 300, "y": 400, "initial": false, "accepting": true },
                  { "id": "qOO", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "qEE", "to": "qOE", "symbol": "a" },
                  { "from": "qEE", "to": "qEO", "symbol": "b" },
                  { "from": "qOE", "to": "qEE", "symbol": "a" },
                  { "from": "qOE", "to": "qOO", "symbol": "b" },
                  { "from": "qEO", "to": "qOO", "symbol": "a" },
                  { "from": "qEO", "to": "qEE", "symbol": "b" },
                  { "from": "qOO", "to": "qEO", "symbol": "a" },
                  { "from": "qOO", "to": "qOE", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 6. DFA accepting strings that DO NOT contain the substring "aba"
            {
              q: 'DFA accepting strings that DO NOT contain the substring "aba" (Σ={a, b})', sol: '4 states for prefix tracking.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false } // Trap state
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q1", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q2", "to": "q0", "symbol": "b" },
                  { "from": "q3", "to": "q3", "symbol": "a" },
                  { "from": "q3", "to": "q3", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 7. DFA for the intersection of L1 (even 0s) and L2 (multiple of 3 length)
            {
              q: 'DFA for strings with an even number of 0s AND a length that is a multiple of 3 (Σ={0, 1})', sol: '6 states (Cartesian product method).', "machine": {
                "states": [
                  { "id": "qE0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "qE1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qE2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "qO0", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "qO1", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "qO2", "x": 700, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "qE0", "to": "qO1", "symbol": "0" },
                  { "from": "qE0", "to": "qE1", "symbol": "1" },
                  { "from": "qE1", "to": "qO2", "symbol": "0" },
                  { "from": "qE1", "to": "qE2", "symbol": "1" },
                  { "from": "qE2", "to": "qO0", "symbol": "0" },
                  { "from": "qE2", "to": "qE0", "symbol": "1" },
                  { "from": "qO0", "to": "qE1", "symbol": "0" },
                  { "from": "qO0", "to": "qO1", "symbol": "1" },
                  { "from": "qO1", "to": "qE2", "symbol": "0" },
                  { "from": "qO1", "to": "qO2", "symbol": "1" },
                  { "from": "qO2", "to": "qE0", "symbol": "0" },
                  { "from": "qO2", "to": "qO0", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. DFA accepting strings where the second-to-last symbol is the same as the last symbol
            {
              q: 'DFA accepting strings where the second-to-last symbol is the same as the last symbol (Σ={0, 1})', sol: '5 states: track last two symbols.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q00", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q01", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q10", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "q11", "x": 300, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q00", "symbol": "0" },
                  { "from": "q0", "to": "q11", "symbol": "1" },
                  { "from": "q00", "to": "q00", "symbol": "0" },
                  { "from": "q00", "to": "q01", "symbol": "1" },
                  { "from": "q01", "to": "q10", "symbol": "0" },
                  { "from": "q01", "to": "q11", "symbol": "1" },
                  { "from": "q10", "to": "q00", "symbol": "0" },
                  { "from": "q10", "to": "q01", "symbol": "1" },
                  { "from": "q11", "to": "q10", "symbol": "0" },
                  { "from": "q11", "to": "q11", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 9. DFA accepting strings where every block of "0"s has length exactly 2
            {
              q: 'DFA accepting strings where every block of "0"s has length exactly 2 (Σ={0, 1})', sol: '4 states (q0, q1, q2, q3, q4).', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false } // Trap state for incorrect '0' count
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q3", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q0", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. DFA accepting strings L = { w | |w| <= 3 and w has no 01 }
            {
              q: 'DFA accepting strings where length is <= and the substring "01" do not appear (Σ={0, 1})', sol: '5 states: q0, q1, q2, q3(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q3", "x": 700, "y": 200, "initial": false, "accepting": true },
                  { "id": "qT", "x": 900, "y": 300, "initial": false, "accepting": false } // Trap state for '01' or length > 3
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "qT", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "qT", "symbol": "1" },
                  { "from": "q3", "to": "qT", "symbol": "0" },
                  { "from": "q3", "to": "qT", "symbol": "1" },
                  { "from": "qT", "to": "qT", "symbol": "0" },
                  { "from": "qT", "to": "qT", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            }
          ]
        },

        // --- 2. NFA Construction Mode (30 Questions) ---
        NFA: {
          easy: [
            // 1. NFA accepting strings containing the substring "101"
            {
              q: 'NFA accepting strings containing the substring "101" (Σ={0, 1})', sol: '4 states, non-deterministic jump on first 1.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. NFA accepting L = (0 U 1)* 01 (ends with 01)
            {
              q: 'NFA accepting strings that ends with "01" (Σ={0, 1})', sol: '3 states: q0(loop), q1(0), q2(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 3. NFA accepting strings where the third-to-last symbol is "a"
            {
              q: 'NFA accepting strings where the third-to-last symbol is "a" (Σ={a, b})', sol: '4 states in a line, non-deterministic jump.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q2", "to": "q3", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 4. NFA accepting L=(a|b)* · a (ends with a)
            {
              q: 'NFA accepting strings that ends with "a" (Σ={a, b})', sol: '2 states: q0(loop), q1(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 5. NFA accepting L = (10)*
            {
              q: 'NFA accepting language = (10)* (Σ={0, 1})', sol: '2 states: q0, q1, q2(accept)', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. NFA for L = Σ* 0 Σ (second to last symbol is 0)
            {
              q: 'NFA for strings where second to last symbol is "0" (Σ={0, 1})', sol: '3 states in a line.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 7. NFA accepting L = 00 U 11
            {
              q: 'NFA accepting only strings "00" or "11" (Σ={0, 1})', sol: '5 states, non-deterministic split at start.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q0a", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q0b", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q1a", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q1b", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "q0a", "symbol": "0" },
                  { "from": "q0a", "to": "q0b", "symbol": "0" },
                  { "from": "qS", "to": "q1a", "symbol": "1" },
                  { "from": "q1a", "to": "q1b", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. NFA accepting strings that contain either "a" or "b"
            {
              q: 'NFA accepting strings that contain either "a" or "b" (Σ={a, b})', sol: '3 states, two non-deterministic paths from q0.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "qB", "x": 300, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "qA", "symbol": "a" },
                  { "from": "q0", "to": "qB", "symbol": "b" },
                  { "from": "qA", "to": "qA", "symbol": "a" },
                  { "from": "qA", "to": "qA", "symbol": "b" },
                  { "from": "qB", "to": "qB", "symbol": "a" },
                  { "from": "qB", "to": "qB", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 9. NFA accepting strings where the length is L >= 2
            {
              q: 'NFA accepting strings where the length  >= 2 (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. NFA for L = a* b*
            {
              q: 'NFA for L = a* b* (Σ={a, b})', sol: '2 states: q0(loop a), q1(loop b, accept).', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            }
          ],
          basic: [
            // 1. NFA for (00)* U (11)*
            {
              q: 'NFA for language (00)* or (11)* (Σ={0, 1})', sol: '5 states, non-deterministic choice from start.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q0a", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q0b", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q1a", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q1b", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "q0a", "symbol": "0" },
                  { "from": "q0a", "to": "q0b", "symbol": "0" },
                  { "from": "q0b", "to": "q0a", "symbol": "0" },
                  { "from": "qS", "to": "q1a", "symbol": "1" },
                  { "from": "q1a", "to": "q1b", "symbol": "1" },
                  { "from": "q1b", "to": "q1a", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. NFA accepting strings with exactly two "1"s
            {
              q: 'NFA accepting strings with exactly two "1"s (Σ={0, 1})', sol: '3 states, loops on 0s between two transitions on 1.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            
            // 3. NFA for L = (ab U ba)* (alternating ab/ba)
            {
              q: 'NFA for language (ab or ba)* (Σ={a, b})', sol: '5 states, with non-deterministic splits.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1a", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q1b", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q2a", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q2b", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1a", "symbol": "a" },
                  { "from": "q1a", "to": "q2a", "symbol": "b" },
                  { "from": "q2a", "to": "q1a", "symbol": "a" },
                  { "from": "q2a", "to": "q1b", "symbol": "b" },
                  { "from": "q0", "to": "q1b", "symbol": "b" },
                  { "from": "q1b", "to": "q2b", "symbol": "a" },
                  { "from": "q2b", "to": "q1a", "symbol": "a" },
                  { "from": "q2b", "to": "q1b", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 4. NFA accepting strings NOT containing the substring "00"
            {
              q: 'NFA accepting strings NOT containing the substring "00" (Σ={0, 1})', sol: '2 states (Non-deterministic version of the DFA).', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 5. NFA for L = 0* 1* 0* 1 (ends with 1, complex prefix)
            {
              q: 'NFA for language 0*1*0*1 (Σ={0, 1})', sol: '4 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. NFA for L = (a* b)
            {
              q: 'NFA for language = (a* b) (Σ={a, b})', sol: '2 states: q0(loop a), q1(accept).', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 7. NFA accepting strings that contain "a" or "b" as the third symbol
            {
              q: 'NFA accepting strings that contain "a" or "b" as the third symbol (Σ={a, b})', sol: '4 states, non-deterministic split at q3.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q2", "to": "q3", "symbol": "b" },
                  { "from": "q3", "to": "q3", "symbol": "a" },
                  { "from": "q3", "to": "q3", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 8. NFA for the language L = (00)* 1
            {
              q: 'NFA for language  (00)* 1 (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 9. NFA for L = (a U b) · (a U b) (length exactly 2)
            {
              q: 'NFA for strings where length exactly 2 (Σ={a, b})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 10. NFA for L = a+ b*
            {
              q: 'NFA for language  a+ b* (Σ={a, b})', sol: '2 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            }
          ],
          medium: [
            // 1. NFA accepting strings where the third symbol from the end is "0"
            {
              q: 'NFA accepting strings where the third symbol from the end is "0" (Σ={0, 1})', sol: '4 states in a line, non-deterministic jump.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. NFA for L=(a|b)+ · a · (a|b) (second-to-last symbol is "a")
            {
              q: 'NFA for strings where second-to-last symbol is "a" (Σ={a, b})', sol: '4 states, non-deterministic jump.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q2", "to": "q3", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 3. NFA for L = (0 U 1)* 0 (0 U 1)* (string contains at least one 0)
            {
              q: 'NFA for string that contains at least one "0" (Σ={0, 1})', sol: '2 states, non-deterministic split.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 4. NFA accepting strings with an odd number of "a"s OR an odd number of "b"s
            {
              q: 'NFA accepting strings with an odd number of "a"s OR an odd number of "b"s (Σ={a, b})', sol: '5 states, non-deterministic split from start.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA0", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qA1", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "qB0", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "qB1", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transition": [
                  // Path A (Odd 'a')
                  { "from": "qS", "to": "qA0", "symbol": "_EPSILON_" },
                  { "from": "qA0", "to": "qA1", "symbol": "a" },
                  { "from": "qA0", "to": "qA0", "symbol": "b" },
                  { "from": "qA1", "to": "qA0", "symbol": "a" },
                  { "from": "qA1", "to": "qA1", "symbol": "b" },
                  // Path B (Odd 'b')
                  { "from": "qS", "to": "qB0", "symbol": "_EPSILON_" },
                  { "from": "qB0", "to": "qB1", "symbol": "b" },
                  { "from": "qB0", "to": "qB0", "symbol": "a" },
                  { "from": "qB1", "to": "qB0", "symbol": "b" },
                  { "from": "qB1", "to": "qB1", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 5. NFA for the language L=(a · b)* U (b · a)*
            {
              q: 'NFA for the language (ab)* or (ba)* (Σ={a, b})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "qA1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qB1", "x": 300, "y": 400, "initial": false, "accepting": false }
                ],
                "transitions": [
                  // (ab)* path
                  { "from": "qS", "to": "qA1", "symbol": "a" },
                  { "from": "qA1", "to": "qS", "symbol": "b" },
                  // (ba)* path
                  { "from": "qS", "to": "qB1", "symbol": "b" },
                  { "from": "qB1", "to": "qS", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 6. NFA accepting L = (1 U 01)*
            {
              q: 'NFA accepting language "1" or "01" (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 300, "y": 400, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 7. NFA accepting L = {w | w has even length}
            {
              q: 'NFA accepting strings that have an even length (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. NFA for L = 10* 1
            {
              q: 'NFA for language = 10* 1 (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 9. NFA accepting strings where the third symbol is DIFFERENT from the first symbol
            {
              q: 'NFA accepting strings where the third symbol is DIFFERENT from the first symbol (Σ={a, b})', sol: '6 states, split based on first symbol.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qA2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "qB1", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "qB2", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "qF", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // Starts with 'a' -> 3rd must be 'b'
                  { "from": "q0", "to": "qA1", "symbol": "a" },
                  { "from": "qA1", "to": "qA2", "symbol": "a" },
                  { "from": "qA1", "to": "qA2", "symbol": "b" },
                  { "from": "qA2", "to": "qF", "symbol": "b" }, // Accepts 'a_b'
                  // Starts with 'b' -> 3rd must be 'a'
                  { "from": "q0", "to": "qB1", "symbol": "b" },
                  { "from": "qB1", "to": "qB2", "symbol": "a" },
                  { "from": "qB1", "to": "qB2", "symbol": "b" },
                  { "from": "qB2", "to": "qF", "symbol": "a" }, // Accepts 'b_a'
                  // Final state loops
                  { "from": "qF", "to": "qF", "symbol": "a" },
                  { "from": "qF", "to": "qF", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            
            // 10. NFA for L = a Σ* a (starts and ends with 'a')
            {
              q: 'NFA for strings that starts and ends with "a" (Σ={a, b})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            }
          ],
          hard: [
            // 1. NFA for all strings except ε
            {
              q: 'NFA for all strings except "epsilon" (Σ={0, 1})', sol: '2 states, loops at start, jumps on 0, 1 to accept.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. NFA accepting strings of the form a^n b^m, where n ≡ 0 mod 2 and m ≡ 1 mod 3
            {
              q: 'NFA for strings with an even number of "a"s, followed by a number of "b"s where the count ≡ 1 (mod 3) (Σ={a, b})',sol: '5 states.', "machine": {
                "states": [
                  { "id": "qA0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "qB0", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "qB1", "x": 700, "y": 200, "initial": false, "accepting": true },
                  { "id": "qB2", "x": 700, "y": 400, "initial": false, "accepting": false }
                ],
                "transitions": [
                  // a^n part (even a's)
                  { "from": "qA0", "to": "qA1", "symbol": "a" },
                  { "from": "qA1", "to": "qA0", "symbol": "a" },
                  // b^m part (b's start from qA0, then qB1 is mod 1)
                  { "from": "qA0", "to": "qB1", "symbol": "b" },
                  { "from": "qB1", "to": "qB2", "symbol": "b" },
                  { "from": "qB2", "to": "qB0", "symbol": "b" },
                  { "from": "qB0", "to": "qB1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 3. NFA for L = {w | |w| is prime} (TRICKY - Non-regular)
            {
              q: 'NFA for language w mid |w| text is prime (Σ={a})', sol: 'Cannot be done with NFA. Use this as a tricky prompt.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false }
                ],
                "transitions": [],
                "alphabet": ["a"]
              }
            },
            // 4. NFA for L=(a U b)+ a (a U b)* b (a U b)* (contains 'a' before 'b')
            {
              q: 'NFA for strings that contains "a" that appear before some "b" (Σ={a, b})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q2", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 5. NFA for the regular expression (00)* (11)* (00|11)
            {
              q: 'NFA for the regular expression (00)* (11)* (00|11) (Σ={0, 1})', sol: '7 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 200, "initial": false, "accepting": false },
                  { "id": "q4", "x": 900, "y": 200, "initial": false, "accepting": true },
                  { "id": "q5", "x": 700, "y": 400, "initial": false, "accepting": false },
                  { "id": "q6", "x": 900, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // (00)* -> (11)*
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "1" },
                  // (11)* -> (00|11)
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q4", "symbol": "0" },
                  { "from": "q2", "to": "q5", "symbol": "1" },
                  { "from": "q5", "to": "q6", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. NFA accepting strings where the last symbol is NOT the same as the first symbol
            {
              q: 'NFA accepting strings where the last symbol is NOT the same as the first symbol (Σ={0, 1})', sol: '5 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q0*", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q0f", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q1*", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q1f", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // Path 1: Starts with 0, ends with 1
                  { "from": "q0", "to": "q0*", "symbol": "0" },
                  { "from": "q0*", "to": "q0*", "symbol": "0" },
                  { "from": "q0*", "to": "q0*", "symbol": "1" },
                  { "from": "q0*", "to": "q0f", "symbol": "1" },
                  // Path 2: Starts with 1, ends with 0
                  { "from": "q0", "to": "q1*", "symbol": "1" },
                  { "from": "q1*", "to": "q1*", "symbol": "0" },
                  { "from": "q1*", "to": "q1*", "symbol": "1" },
                  { "from": "q1*", "to": "q1f", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 7. NFA for L = Σ* 1 Σ* 0 Σ* (contains a 1 followed later by a 0)
            {
              q: 'NFA for strings containing a "1" which is followed later at some point by a "0" (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. NFA accepting strings where the second symbol from the start is "0" AND the third symbol from the end is "1"
            {
              q: 'NFA accepting strings where the second symbol from the start is "0" AND the third symbol from the end is "1" (Σ={0, 1})', sol: '5 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 250, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 400, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 550, "y": 300, "initial": false, "accepting": false },
                  { "id": "q4", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q4", "symbol": "0" },
                  { "from": "q3", "to": "q4", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 9. NFA for the regular expression 1(01 U 00)* 1
            {
              q: 'NFA for the regular expression 1(01 or 00)* 1$ (Σ={0, 1})', sol: '6 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 200, "initial": false, "accepting": false },
                  { "id": "q4", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "q5", "x": 900, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  // (01)*
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q1", "symbol": "1" },
                  // (00)*
                  { "from": "q1", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q1", "symbol": "0" },
                  // Final 1
                  { "from": "q1", "to": "q5", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. NFA for L = (000|111) Σ* (starts with 000 or 111)
            {
              q: 'NFA for strings that starts with either "000" or "111" (Σ={0, 1})', sol: '7 states.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q01", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q02", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q11", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q12", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "qF", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // 000 path
                  { "from": "qS", "to": "q01", "symbol": "0" },
                  { "from": "q01", "to": "q02", "symbol": "0" },
                  { "from": "q02", "to": "qF", "symbol": "0" },
                  // 111 path
                  { "from": "qS", "to": "q11", "symbol": "1" },
                  { "from": "q11", "to": "q12", "symbol": "1" },
                  { "from": "q12", "to": "qF", "symbol": "1" },
                  // Final loop
                  { "from": "qF", "to": "qF", "symbol": "0" },
                  { "from": "qF", "to": "qF", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            }
          ]
        },
        // --- 3. ENFA Construction Mode (30 Questions) ---
        ENFA: {
          easy: [
            // 1. ε-NFA to connect two paths: L = a U b
            {
              q: 'ε-NFA for language a or b  (Σ={a, b})', sol: '3 states, epsilon from start to two parallel paths.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "qB", "x": 300, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "qA", "symbol": "a" },
                  { "from": "qS", "to": "qB", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 2. ε-NFA for a?b (optional a, then b)
            {
              q: 'ε-NFA for a?b optional "a", then "b" (Σ={a, b})', sol: '3 states, epsilon bypass for "a".', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q2", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 3. ε-NFA to achieve a*b*
            {
              q: 'ε-NFA to achieve a*b* (Σ={a, b})', sol: '2 states, have epsilon between a* and b*.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "_EPSILON_" },
                  { "from": "q1", "to": "q1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            
            // 4. ε-NFA for L= (01)* | (10)*
            {
              q: 'ε-NFA for language (01)* or (10)* (Σ={0, 1})', sol: '5 states, Connect two paths via initial and final $\\epsilon$-transitions.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q01a", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q01b", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q10a", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q10b", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "q01a", "symbol": "0" },
                  { "from": "q01a", "to": "q01b", "symbol": "1" },
                  { "from": "q01b", "to": "q01a", "symbol": "0" },
                  { "from": "qS", "to": "q10a", "symbol": "1" },
                  { "from": "q10a", "to": "q10b", "symbol": "0" },
                  { "from": "q10b", "to": "q10a", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 5. ε-NFA for L = (0 U ε) 1
            {
              q: 'ε-NFA for  an optional "0" is followed by a "1" (Σ={0, 1})', sol: '3 states, epsilon bypass for 0.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. ε-NFA for L = a · b · c
            {
              q: 'ε-NFA for string "abc" (Σ={a, b, c})', sol: '4 states, make epsilon transitions between single symbol states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "c" }
                ],
                "alphabet": ["a", "b", "c"]
              }
            },
            // 7. ε-NFA for L=a | ε (a is optional)
            {
              q: 'ε-NFA for an optional "a" (Σ={a})', sol: '2 states, make epsilon from start to end.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
            // 8. ε-NFA for L=a^k where k ∈ {2, 4}
            {
              q: 'ε-NFA for strings of "a"s where the length is either 2 or 4 (Σ={a})',sol: '7 states, make epsilon splits for length 2 and 4.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q2a", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2b", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q4a", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q4b", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "q4c", "x": 700, "y": 400, "initial": false, "accepting": false },
                  { "id": "q4d", "x": 900, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "q2a", "symbol": "ε" },
                  { "from": "q2a", "to": "q2b", "symbol": "a" },
                  { "from": "q2b", "to": "q2b", "symbol": "a" },
                  { "from": "qS", "to": "q4a", "symbol": "ε" },
                  { "from": "q4a", "to": "q4b", "symbol": "a" },
                  { "from": "q4b", "to": "q4c", "symbol": "a" },
                  { "from": "q4c", "to": "q4d", "symbol": "a" },
                  { "from": "q4d", "to": "q4d", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
            // 9. ε-NFA for L= ΣΣ (length exactly 2)
            {
              q: 'ε-NFA for strings of length exactly 2 (Σ={0, 1})', sol: '3 states, epsilon transitions.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. ε-NFA for L = a* b* (concatenation)
            {
              q: 'ε-NFA for language a* b* (Σ={a, b})', sol: '2 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            }
          ],
          basic: [
            // 1. ε-NFA for Regular Expression a(a U b)b
            {
              q: 'ε-NFA for Regular Expression a(a or b)b (Σ={a, b})', sol: '5 states, standard RE construction with epsilon.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "q4", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q3", "symbol": "b" },
                  { "from": "q2", "to": "q4", "symbol": "b" },
                  { "from": "q3", "to": "q4", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 2. ε-NFA for (0|1)* 0 · 1* (ends with 0 followed by 1s)
            {
              q: 'ε-NFA for (0|1)*01* (ends with 0 followed by 1s) (Σ={0, 1})', sol: '3 states, standard RE construction.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 3. ε-NFA for L = (a U b U c)*
            {
              q: 'ε-NFA for language (a or b or c)* (Σ={a, b, c})', sol: '1 state.', "machine": {
                "states": [
                  { "id": "q0", "x": 300, "y": 300, "initial": true, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q0", "symbol": "c" }
                ],
                "alphabet": ["a", "b", "c"]
              }
            },
            // 4. ε-NFA for L=(a|b)+ · a
            {
              q: 'ε-NFA for language (a|b)+a (Σ={a, b})', sol: '3 states, $\\varepsilon$ transitions.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 5. ε-NFA for L = 0* · 1 · 0* 1 (contains exactly two 1s)
            {
              q: 'ε-NFA for strings that contains exactly two "1s" (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. ε-NFA for the language (ab)* · ε
            {
              q: 'ε-NFA for the language (ab)* (Σ={a, b})', sol: '2 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q0", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 7. ε-NFA for L = (a · a)* U (b · b)*
            {
              q: 'ε-NFA for language (aa)* or (bb)* (Σ={a, b})', sol: '5 states.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "qaa1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qaa2", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "qbb1", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "qbb2", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "qaa1", "symbol": "ε" },
                  { "from": "qaa1", "to": "qaa2", "symbol": "a" },
                  { "from": "qaa2", "to": "qaa1", "symbol": "a" },
                  { "from": "qS", "to": "qbb1", "symbol": "ε" },
                  { "from": "qbb1", "to": "qbb2", "symbol": "b" },
                  { "from": "qbb2", "to": "qbb1", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 8. ε-NFA for L = a · (b U c)*
            {
              q: 'ε-NFA for language a(b or c)* (Σ={a, b, c})', sol: '2 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q1", "symbol": "c" }
                ],
                "alphabet": ["a", "b", "c"]
              }
            },
            // 9. ε-NFA for L= (01 | 10)* 0
            {
              q: 'ε-NFA for language (01 | 10)*0 (Σ={0, 1})', sol: '6 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q4", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "qF", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // (01)* | (10)* loop (using q0, q1, q2, q3, q4 for the inner loop)
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q0", "symbol": "0" },
                  // Ends with 0
                  { "from": "q0", "to": "qF", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. ε-NFA for L = 0101 U ε
            {
              q: 'ε-NFA for the language "0101" or ε (Σ={0, 1})',sol: '5 states, initial ε bypass.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false },
                  { "id": "q4", "x": 900, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q3", "to": "q4", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            }
          ],
          
          medium: [
            // 1. ε-NFA equivalent to Regular Expression (0|1)* 0
            {
              q: 'ε-NFA equivalent to Regular Expression (0|1)* 0 (Σ={0, 1})', sol: 'Standard RE construction, 3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q2", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 2. ε-NFA for L = (a · a)* (even length strings of 'aa')
            {
              q: 'ε-NFA for language = (a . a)* (even length strings of "aa") (Σ={a})', sol: 'Connect two states with ε-loop and a transitions.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q0", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
            // 3. ε-NFA for L = a* · b* · a*
            {
              q: 'ε-NFA for L = a* . b* . a* (Σ={a, b})', sol: '3 states, ε transitions.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q1", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "ε" },
                  { "from": "q2", "to": "q2", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 4. ε-NFA for L = (a|b|c) · (a|b|c) (length exactly 2)
            {
              q: 'ε-NFA for L = (a|b|c) . (a|b|c) with length exactly "2" (Σ={a, b, c})', sol: '3 states, ε transitions.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "c" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "c" }
                ],
                "alphabet": ["a", "b", "c"]
              }
            },
            // 5. ε-NFA for L = 0+ (1 U ε)
            {
              q: 'ε-NFA for L = 0+ (1 or ε) (Σ={0, 1})', sol: '2 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q1", "symbol": "ε" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 6. ε-NFA for L = Σ* 0 Σ* 1 Σ* (contains a 0 followed later by a 1)
            {
              q: 'ε-NFA for L = Sigma* 0 Sigma* 1 Sigma* (contains a 0 followed later by a 1) (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q2", "symbol": "0" },
                  { "from": "q2", "to": "q2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 7. ε-NFA for L = (00 U 11) Σ
            {
              q: 'ε-NFA for language (00 or 11) Sigma$ (Σ={0, 1})', sol: '6 states.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q0a", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q0b", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q1a", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q1b", "x": 500, "y": 400, "initial": false, "accepting": false },
                  { "id": "qF", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "qS", "to": "q0a", "symbol": "0" },
                  { "from": "q0a", "to": "q0b", "symbol": "0" },
                  { "from": "qS", "to": "q1a", "symbol": "1" },
                  { "from": "q1a", "to": "q1b", "symbol": "1" },
                  { "from": "q0b", "to": "qF", "symbol": "0" },
                  { "from": "q0b", "to": "qF", "symbol": "1" },
                  { "from": "q1b", "to": "qF", "symbol": "0" },
                  { "from": "q1b", "to": "qF", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. ε-NFA for L = {w | w is an odd length string of 0s or 1s}
            {
              q: 'ε-NFA for language w | w is an odd length string of 0s or 1s (Σ={0, 1})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q0", "to": "q1", "symbol": "1" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q1", "symbol": "0" },
                  { "from": "q2", "to": "q1", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 9. ε-NFA for L = (a U ε) · (b U ε) · (c U ε)
            {
              q: 'ε-NFA for language (a or ε) . (b or ε) . (c or ε) (Σ={a, b, c})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "ε" },
                  { "from": "q2", "to": "q2", "symbol": "c" },
                  { "from": "q2", "to": "q2", "symbol": "ε" }
                ],
                "alphabet": ["a", "b", "c"]
              }
            },
            // 10. ε-NFA for the language L=(a|b)* · a (ends with a)
            {
              q: 'ε-NFA for the language (a|b)* . a (ends with a) (Σ={a, b})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q2", "symbol": "a" }
                ],
                "alphabet": ["a", "b"]
              }
            }
          ],
          hard: [
            // 1. ε-NFA for L = (a|b)* · (a · a U b · b) (ends with aa or bb)
            {
              q: 'ε-NFA for $L = (a|b)* . (a . a or b . b) (ends with aa or bb) (Σ={a, b})', sol: 'Complex RE construction, split paths, and ε concatenation.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q3", "x": 300, "y": 400, "initial": false, "accepting": false },
                  { "id": "q4", "x": 500, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "ε" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q2", "to": "q0", "symbol": "a" },
                  { "from": "q1", "to": "q3", "symbol": "b" },
                  { "from": "q3", "to": "q4", "symbol": "b" },
                  { "from": "q4", "to": "q0", "symbol": "ε" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 2. ε-NFA for L = {w | |w| ≡ 0 mod 2 or |w| ≡ 0 mod 3 }
            {
              q: 'ε-NFA for language w | |w| = 0 mod 2 or |w| = 0 mod 3 (Σ={a})', sol: '6 states, ε transitions for union.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 400, "initial": true, "accepting": true },
                  { "id": "q2a", "x": 300, "y": 200, "initial": false, "accepting": true },
                  { "id": "q2b", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3a", "x": 300, "y": 600, "initial": false, "accepting": true },
                  { "id": "q3b", "x": 500, "y": 600, "initial": false, "accepting": false },
                  { "id": "q3c", "x": 700, "y": 600, "initial": false, "accepting": false }
                ],
                "transitions": [
                  { "from": "qS", "to": "q2a", "symbol": "ε" },
                  { "from": "q2a", "to": "q2b", "symbol": "a" },
                  { "from": "q2b", "to": "q2a", "symbol": "a" },
                  { "from": "qS", "to": "q3a", "symbol": "ε" },
                  { "from": "q3a", "to": "q3b", "symbol": "a" },
                  { "from": "q3b", "to": "q3c", "symbol": "a" },
                  { "from": "q3c", "to": "q3a", "symbol": "a" }
                ],
                "alphabet": ["a"]
              }
            },
            // 3. ε-NFA for L = (0* 1)* (10)*
            {
              q: 'ε-NFA for language (0* 1)* (10)* (Σ={0, 1})', sol: '4 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": true },
                  { "id": "q3", "x": 300, "y": 400, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // (0* 1)*
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q1", "symbol": "ε" },
                  // (10)*
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q2", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 4. ε-NFA for L = Σ* 0 Σ Σ Σ 1 Σ* (contains 0 separated by three symbols from 1)
            {
              q: 'ε-NFA for language Sigma* 0 Sigma Sigma Sigma 1 Sigma* contains "0" separated by three symbols from "1" (Σ={0, 1})', sol: '6 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 450, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 600, "y": 300, "initial": false, "accepting": false },
                  { "id": "q4", "x": 750, "y": 300, "initial": false, "accepting": false },
                  { "id": "q5", "x": 900, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "0" },
                  { "from": "q0", "to": "q0", "symbol": "1" },
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q3", "symbol": "0" },
                  { "from": "q2", "to": "q3", "symbol": "1" },
                  { "from": "q3", "to": "q4", "symbol": "0" },
                  { "from": "q3", "to": "q4", "symbol": "1" },
                  { "from": "q4", "to": "q5", "symbol": "1" },
                  { "from": "q5", "to": "q5", "symbol": "0" },
                  { "from": "q5", "to": "q5", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 5. ε-NFA for L = (a U b)* · a · (b U ε)
            {
              q: 'ε-NFA for language (a or b)* . a . (b or ε) (Σ={a, b})', sol: '3 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q1", "to": "q2", "symbol": "ε" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 6. ε-NFA for the intersection of L1=(ab)* and L2=(ba)*
            {
              q: 'ε-NFA for the intersection of L1=(ab)* and L2=(ba)* (Σ={a, b})', sol: '1 state.', "machine": {
                "states": [
                  { "id": "q0", "x": 300, "y": 300, "initial": true, "accepting": true }
                ],
                "transitions": [
                  // Intersection is {ε}, so only the start state is accepting.
                ],
                "alphabet": ["a", "b"]
              }
            },
            
            // 7. ε-NFA for L = (01)^n (10)^m, where n, m >= 1
            {
              q: 'ε-NFA for language (01)^n (10)^m, where n, m >= 1 (Σ={0, 1})', sol: '5 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false },
                  { "id": "q4", "x": 900, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // (01)+ part
                  { "from": "q0", "to": "q1", "symbol": "0" },
                  { "from": "q1", "to": "q2", "symbol": "1" },
                  { "from": "q2", "to": "q1", "symbol": "0" },
                  // Concatenation
                  { "from": "q2", "to": "q3", "symbol": "ε" },
                  // (10)+ part
                  { "from": "q3", "to": "q4", "symbol": "1" },
                  { "from": "q4", "to": "q3", "symbol": "0" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 8. ε-NFA for L = a · Σ · a · Σ
            {
              q: 'ε-NFA for $L = a \\cdot \\Sigma \\cdot a \\cdot \\Sigma$ (Σ={a, b})', sol: '4 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                  { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                  { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q1", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "a" },
                  { "from": "q1", "to": "q2", "symbol": "b" },
                  { "from": "q2", "to": "q3", "symbol": "a" },
                  { "from": "q3", "to": "q3", "symbol": "a" },
                  { "from": "q3", "to": "q3", "symbol": "b" }
                ],
                "alphabet": ["a", "b"]
              }
            },
            // 9. ε-NFA for L = (00|11)* 01
            {
              q: 'ε-NFA for language (00|11)* 01 (Σ={0, 1})', sol: '5 states.', "machine": {
                "states": [
                  { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "qA1", "x": 300, "y": 200, "initial": false, "accepting": false },
                  { "id": "qA2", "x": 500, "y": 200, "initial": false, "accepting": false },
                  { "id": "qF1", "x": 700, "y": 300, "initial": false, "accepting": false },
                  { "id": "qF2", "x": 900, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  // (00)* part
                  { "from": "qS", "to": "qA1", "symbol": "0" },
                  { "from": "qA1", "to": "qS", "symbol": "0" },
                  // (11)* part
                  { "from": "qS", "to": "qA2", "symbol": "1" },
                  { "from": "qA2", "to": "qS", "symbol": "1" },
                  // Concatenation
                  { "from": "qS", "to": "qF1", "symbol": "0" },
                  { "from": "qF1", "to": "qF2", "symbol": "1" }
                ],
                "alphabet": ["0", "1"]
              }
            },
            // 10. ε-NFA for L = (a U b U c)* d
            {
              q: 'ε-NFA for language (a or b or c)* d (Σ={a, b, c, d})', sol: '4 states.', "machine": {
                "states": [
                  { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                  { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
                ],
                "transitions": [
                  { "from": "q0", "to": "q0", "symbol": "a" },
                  { "from": "q0", "to": "q0", "symbol": "b" },
                  { "from": "q0", "to": "q0", "symbol": "c" },
                  { "from": "q0", "to": "q1", "symbol": "d" }
                ],
                "alphabet": ["a", "b", "c", "d"]
              }
            }
          ]
        },
        // --- 4. CONVERSION MODE: ENFA -> NFA (10 Questions) ---
        ENFA_TO_NFA: [
          // 1. Convert the solution machine for "ε-NFA for a?b (optional a, then b)" to its equivalent NFA.
          {
            q: 'Convert the solution machine for "ε-NFA for a?b (optional a, then b)" to its equivalent NFA.', sol: 'This conversion removes the ε-transitions, merging the start state with its $\\epsilon$-closure.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q0", "to": "q1", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 2. Convert the solution machine for "ε-NFA to connect two paths: L = a U b" to its equivalent NFA.
          {
            q: 'Convert the solution machine for "ε-NFA to connect two paths: L = a U b" to its equivalent NFA.', sol: 'The two parallel paths will now start directly from the initial state on inputs a and b.', "machine": {
              "states": [
                { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "qA", "x": 300, "y": 200, "initial": false, "accepting": true },
                { "id": "qB", "x": 300, "y": 400, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "qS", "to": "qA", "symbol": "a" },
                { "from": "qS", "to": "qB", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 3. Convert the solution machine for "ε-NFA to achieve a*b*" to its equivalent NFA.
          {
            q: 'Convert the solution machine for "ε-NFA to achieve a*b*" to its equivalent NFA.', sol: 'The ε-transition must be replaced by a direct connection from the "a" loop to the "b" loop.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "a" },
                { "from": "q0", "to": "q1", "symbol": "b" },
                { "from": "q1", "to": "q1", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 4. Convert the solution machine for "ε-NFA equivalent to Regular Expression (0|1)* 0" to its equivalent NFA.
          {
            q: 'Convert the solution machine for "ε-NFA equivalent to Regular Expression (0|1)* 0" to its equivalent NFA.', sol: 'This is a complex closure conversion, resulting in a 3-state NFA.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q0", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 5. Convert the solution machine for "L = (0 U ε) 1" to its equivalent NFA (removing ε).
          {
            q: 'Convert the solution machine for language (0 or ε) 1" to its equivalent NFA removing ε.', sol: 'The start state must gain the transition on 1 directly from the initial ε-closure.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 6. Convert the solution machine for "L=a | ε" to its equivalent NFA.
          {
            q: 'Convert the solution machine for  language =a | ε to its equivalent NFA.', sol: 'The NFA will be simplified, allowing $\\epsilon$ to be accepted via the initial state being final.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" }
              ],
              "alphabet": ["a"]
            }
          },
          // 7. Convert the solution machine for "L = a · b · c" to its equivalent NFA.
          {
            q: 'Convert the solution machine for "$L = a \\cdot b \\cdot c$" to its equivalent NFA.', sol: 'This conversion removes two intermediate $\\epsilon$-transitions.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q1", "to": "q2", "symbol": "b" },
                { "from": "q2", "to": "q3", "symbol": "c" }
              ],
              "alphabet": ["a", "b", "c"]
            }
          },
          // 8. Convert the solution machine for "L = (01)* | (10)*" to its equivalent NFA.
          {
            q: 'Convert the solution machine for "$L = (01)^* | (10)^* $" to its equivalent NFA.', sol: 'This conversion removes the two initial epsilon-splits.', "machine": {
              "states": [
                { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q01a", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q01b", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "q10a", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "q10b", "x": 500, "y": 400, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "qS", "to": "q01a", "symbol": "0" },
                { "from": "q01a", "to": "q01b", "symbol": "1" },
                { "from": "q01b", "to": "q01a", "symbol": "0" },
                { "from": "qS", "to": "q10a", "symbol": "1" },
                { "from": "q10a", "to": "q10b", "symbol": "0" },
                { "from": "q10b", "to": "q10a", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 9. Convert the solution machine for "L = a · (b U c)* " to its equivalent NFA.
          {
            q: 'Convert the solution machine for "$L = a \\cdot (b \\cup c)^*$ " to its equivalent NFA.', sol: 'The $\\epsilon$ transition between a and (b|c)* must be removed.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q1", "to": "q1", "symbol": "b" },
                { "from": "q1", "to": "q1", "symbol": "c" }
              ],
              "alphabet": ["a", "b", "c"]
            }
          },
          // 10. Convert the solution machine for "L = (a · a)* " to its equivalent NFA.
          {
            q: 'Convert the solution machine for language (a . a)* to its equivalent NFA.', sol: 'This conversion removes the ε-loop.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q1", "to": "q0", "symbol": "a" }
              ],
              "alphabet": ["a"]
            }
          }
        ],
        // --- 5. CONVERSION MODE: NFA -> DFA (15 Questions) ---
        NFA_TO_DFA: [
          // 1. Convert the solution machine for "NFA accepting strings containing the substring "101"" to its equivalent DFA. (5 states)
          {
            q: 'Convert the solution machine for "NFA accepting strings containing the substring "101"" to its equivalent DFA.', sol: 'Requires subset construction, resulting in 5 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q0,q1", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                { "id": "q0,q1,q3", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0,q1", "symbol": "1" },
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "0" },
                { "from": "q1", "to": "q1", "symbol": "1" },
                { "from": "q0,q1", "to": "q2", "symbol": "0" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "1" },
                { "from": "q2", "to": "q0,q1,q3", "symbol": "1" },
                { "from": "q2", "to": "q0", "symbol": "0" },
                { "from": "q0,q1,q3", "to": "q0,q1", "symbol": "1" },
                { "from": "q0,q1,q3", "to": "q2", "symbol": "0" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 2. Convert the solution machine for "NFA for (00)* U (11)* " to its equivalent DFA. (5 states)
          {
            q: 'Convert the solution machine for "NFA for $(00)^* \\cup (11)^*$ " to its equivalent DFA.', sol: 'The DFA will require a trap state and track the state sets, resulting in 5 states.', "machine": {
              "states": [
                { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q0a,q1a", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q0b,q1b", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "q0a,q1b", "x": 700, "y": 200, "initial": false, "accepting": true },
                { "id": "q0b,q1a", "x": 700, "y": 400, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "qS", "to": "q0a,q1a", "symbol": "0" },
                { "from": "qS", "to": "q0a,q1a", "symbol": "1" },
                { "from": "q0a,q1a", "to": "q0b,q1a", "symbol": "0" },
                { "from": "q0a,q1a", "to": "q0a,q1b", "symbol": "1" },
                { "from": "q0b,q1a", "to": "qS", "symbol": "0" },
                { "from": "q0b,q1a", "to": "q0a,q1b", "symbol": "1" },
                { "from": "q0a,q1b", "to": "q0b,q1a", "symbol": "0" },
                { "from": "q0a,q1b", "to": "qS", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 3. Convert the solution machine for "NFA accepting strings with exactly two "1"s" to its equivalent DFA. (4 states)
          {
            q: 'Convert the solution machine for "NFA accepting strings with exactly two "1"s" to its equivalent DFA.', sol: 'The DFA states track the count of 1s (0, 1, 2) plus the trap state, resulting in 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
        
          // 4. Convert the NFA for L = (0|1)* 01 (ends with 01) to its equivalent DFA. (3 states)
          {
            q: 'Convert the NFA for $L = (0|1)^* 01$ (ends with 01) to its equivalent DFA.', sol: 'The DFA tracks the last two symbols seen, resulting in 3 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0,q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q0,q2", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0,q1", "symbol": "0" },
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "0" },
                { "from": "q0,q1", "to": "q0,q2", "symbol": "1" },
                { "from": "q0,q2", "to": "q0,q1", "symbol": "0" },
                { "from": "q0,q2", "to": "q0", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 5. Convert the NFA for L = (ab U ba)* to its equivalent DFA. (6 states)
          {
            q: 'Convert the NFA for $L = (ab \\cup ba)^*$ to its equivalent DFA.', sol: 'The DFA requires careful tracking of the potential paths, resulting in 6 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1a,q1b", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2a,q1a", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "q2b,q1b", "x": 500, "y": 400, "initial": false, "accepting": true },
                { "id": "q2a,q2b,q1a,q1b", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1a,q1b", "symbol": "a" },
                { "from": "q0", "to": "q1a,q1b", "symbol": "b" },
                { "from": "q1a,q1b", "to": "q2a,q1a", "symbol": "a" },
                { "from": "q1a,q1b", "to": "q2b,q1b", "symbol": "b" },
                { "from": "q2a,q1a", "to": "q2b,q1b", "symbol": "b" },
                { "from": "q2a,q1a", "to": "q1a,q1b", "symbol": "a" },
                { "from": "q2b,q1b", "to": "q2a,q1a", "symbol": "a" },
                { "from": "q2b,q1b", "to": "q1a,q1b", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 6. Convert the NFA for L = Σ* 0 Σ (second to last symbol is 0) to its equivalent DFA. (4 states)
          {
            q: 'Convert the NFA for $L = \\Sigma^* 0 \\Sigma$ (second to last symbol is 0) to its equivalent DFA.', sol: 'The DFA requires 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0,q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q0,q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "q0,q1,q2", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0,q1", "symbol": "0" },
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "0" },
                { "from": "q0,q1", "to": "q0,q2", "symbol": "1" },
                { "from": "q0,q2", "to": "q0,q1,q2", "symbol": "0" },
                { "from": "q0,q2", "to": "q0,q2", "symbol": "1" },
                { "from": "q0,q1,q2", "to": "q0,q1,q2", "symbol": "0" },
                { "from": "q0,q1,q2", "to": "q0,q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 7. Convert the NFA for L = 00 U 11 to its equivalent DFA. (7 states)
          {
            q: 'Convert the NFA for $L = 00 \\cup 11$ to its equivalent DFA.', sol: 'The DFA requires 7 states.', "machine": {
              "states": [
                { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0a,q1a", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q0b", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "q1b", "x": 500, "y": 400, "initial": false, "accepting": true },
                { "id": "q0b,q1a", "x": 700, "y": 200, "initial": false, "accepting": true },
                { "id": "q1b,q0a", "x": 700, "y": 400, "initial": false, "accepting": true },
                { "id": "qT", "x": 900, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "qS", "to": "q0a,q1a", "symbol": "0" },
                { "from": "qS", "to": "q0a,q1a", "symbol": "1" },
                { "from": "q0a,q1a", "to": "q0b,q1a", "symbol": "0" },
                { "from": "q0a,q1a", "to": "q1b,q0a", "symbol": "1" },
                { "from": "q0b,q1a", "to": "qT", "symbol": "0" },
                { "from": "q0b,q1a", "to": "q1b,q0a", "symbol": "1" },
                { "from": "q1b,q0a", "to": "q0b,q1a", "symbol": "0" },
                { "from": "q1b,q0a", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 8. Convert the NFA for L = 0* 1* 0* 1 to its equivalent DFA. (6 states)
          {
            q: 'Convert the NFA for $L = 0^* 1^* 0^* 1$ to its equivalent DFA.', sol: 'The DFA requires 6 states.', "machine": {
              "states": [
                { "id": "q0,q2", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0,q1,q2", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q0,q1,q2,q3", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "q1,q2", "x": 700, "y": 200, "initial": false, "accepting": false },
                { "id": "q1,q2,q3", "x": 900, "y": 300, "initial": false, "accepting": true },
                { "id": "q0,q2,q3", "x": 300, "y": 400, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0,q2", "to": "q0,q2", "symbol": "0" },
                { "from": "q0,q2", "to": "q0,q1,q2", "symbol": "1" },
                { "from": "q0,q1,q2", "to": "q0,q2", "symbol": "0" },
                { "from": "q0,q1,q2", "to": "q0,q1,q2,q3", "symbol": "1" },
                { "from": "q0,q1,q2,q3", "to": "q0,q2,q3", "symbol": "0" },
                { "from": "q0,q1,q2,q3", "to": "q0,q1,q2", "symbol": "1" },
                { "from": "q0,q2,q3", "to": "q0,q2", "symbol": "0" },
                { "from": "q0,q2,q3", "to": "q0,q1,q2,q3", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 9. Convert the NFA for L = (a* b) to its equivalent DFA. (2 states)
          {
            q: 'Convert the NFA for $L = (a^* b)$ to its equivalent DFA.', sol: 'The DFA requires 2 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0,q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "a" },
                { "from": "q0", "to": "q0,q1", "symbol": "b" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "a" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 10. Convert the NFA for L = 10* 1 to its equivalent DFA. (4 states)
          {
            q: 'Convert the NFA for $L = 10^* 1$ to its equivalent DFA.', sol: 'The DFA requires 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q1,q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "qT", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q1,q2", "symbol": "1" },
                { "from": "q1,q2", "to": "q1", "symbol": "0" },
                { "from": "q1,q2", "to": "q1,q2", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 11. Convert the NFA for L = a Σ* a (starts and ends with 'a') to its equivalent DFA. (4 states)
          {
            q: 'Convert the NFA for $L = a \\Sigma^* a$ (starts and ends with \'a\') to its equivalent DFA.', sol: 'The DFA requires 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q1,q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q0", "to": "qT", "symbol": "b" },
                { "from": "q1", "to": "q1,q2", "symbol": "a" },
                { "from": "q1", "to": "q1", "symbol": "b" },
                { "from": "q1,q2", "to": "q1,q2", "symbol": "a" },
                { "from": "q1,q2", "to": "q1", "symbol": "b" },
                { "from": "qT", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 12. Convert the NFA for L = Σ* 1 Σ* 0 Σ* (contains 1 then 0) to its equivalent DFA. (3 states)
          {
            q: 'Convert the NFA for $L = \\Sigma^* 1 \\Sigma^* 0 \\Sigma^*$ (contains 1 then 0) to its equivalent DFA.', sol: 'The DFA requires 3 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0,q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q0,q1,q2", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q0", "to": "q0,q1", "symbol": "1" },
                { "from": "q0,q1", "to": "q0,q1,q2", "symbol": "0" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "1" },
                { "from": "q0,q1,q2", "to": "q0,q1,q2", "symbol": "0" },
                { "from": "q0,q1,q2", "to": "q0,q1,q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 13. Convert the NFA for L = (000|111) Σ* to its equivalent DFA. (5 states)
          {
            q: 'Convert the NFA for $L = (000|111) \\Sigma^*$ to its equivalent DFA.', sol: 'The DFA requires 5 states.', "machine": {
              "states": [
                { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q00", "x": 500, "y": 200, "initial": false, "accepting": false },
                { "id": "q1", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "q11", "x": 500, "y": 400, "initial": false, "accepting": false },
                { "id": "qF", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "qS", "to": "q0", "symbol": "0" },
                { "from": "qS", "to": "q1", "symbol": "1" },
                { "from": "q0", "to": "q00", "symbol": "0" },
                { "from": "q0", "to": "qT", "symbol": "1" },
                { "from": "q00", "to": "qF", "symbol": "0" },
                { "from": "q00", "to": "qT", "symbol": "1" },
                { "from": "q1", "to": "qT", "symbol": "0" },
                { "from": "q1", "to": "q11", "symbol": "1" },
                { "from": "q11", "to": "qT", "symbol": "0" },
                { "from": "q11", "to": "qF", "symbol": "1" },
                { "from": "qF", "to": "qF", "symbol": "0" },
                { "from": "qF", "to": "qF", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 14. Convert the NFA for L = (10)* to its equivalent DFA. (4 states)
          {
            q: 'Convert the NFA for $L = (10)^*$ to its equivalent DFA.', sol: 'The DFA requires 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "qT", "x": 500, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "qT", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q0", "symbol": "0" },
                { "from": "q1", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 15. Convert the NFA for L = (a U b) · (a U b) (length 2) to its equivalent DFA. (4 states)
          {
            q: 'Convert the NFA for $L = (a \\cup b) \\cdot (a \\cup b)$ (length 2) to its equivalent DFA.', sol: 'The DFA requires 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q0", "to": "q1", "symbol": "b" },
                { "from": "q1", "to": "q2", "symbol": "a" },
                { "from": "q1", "to": "q2", "symbol": "b" },
                { "from": "q2", "to": "qT", "symbol": "a" },
                { "from": "q2", "to": "qT", "symbol": "b" },
                { "from": "qT", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          }
        ],
        // --- 6. CONVERSION MODE: DFA -> MIN DFA (15 Questions) ---
        DFA_TO_MIN_DFA: [
          // 1. Minimize the solution machine for "DFA accepting strings that contain "1" at the third position from the start". (Minimal: 4 states)
          {
            q: 'Minimize the solution machine for "DFA accepting strings that contain "1" at the third position from the start".', sol: 'The 4-state DFA will likely have its initial states partitioned.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false },
                { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q2", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q3", "symbol": "1" },
                { "from": "q2", "to": "qT", "symbol": "0" },
                { "from": "q3", "to": "q3", "symbol": "0" },
                { "from": "q3", "to": "q3", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 2. Minimize the solution machine for "DFA accepting any string of length exactly 2". (Minimal: 4 states)
          {
            q: 'Minimize the solution machine for "DFA accepting any string of length exactly 2".', sol: 'The 4-state DFA is already minimal.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q2", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q3", "symbol": "0" },
                { "from": "q2", "to": "q3", "symbol": "1" },
                { "from": "q3", "to": "q3", "symbol": "0" },
                { "from": "q3", "to": "q3", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          
          // 3. Minimize the DFA for L = Σ* 0. (Minimal: 2 states)
          {
            q: 'Minimize the DFA for $L = \\Sigma^* 0$. The 2-state solution is already minimal. Verify using the minimization algorithm.', sol: 'Prove minimality using the table-filling method.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q1", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q0", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 4. Minimize the DFA for L = Σ* 00 Σ*. (Minimal: 3 states)
          {
            q: 'Minimize the DFA for $L = \\Sigma^* 00 \\Sigma^*$. The 3-state solution is already minimal.', sol: 'Prove minimality using the table-filling method.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q0", "symbol": "1" },
                { "from": "q1", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 5. Minimize a 6-state DFA (q0, q1, q2, q3, q4, q5) accepting strings of length divisible by 3. (Minimal: 3 states)
          {
            q: 'Minimize a 6-state DFA (q0, q1, q2, q3, q4, q5) accepting strings of length divisible by 3.', sol: 'The minimal DFA should have 3 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q1", "to": "q2", "symbol": "a" },
                { "from": "q2", "to": "q0", "symbol": "a" }
              ],
              "alphabet": ["a"]
            }
          },
          // 6. Minimize the 4-state DFA accepting L = (ab)*. (Minimal: 2 states)
          {
            q: 'Minimize the 4-state DFA accepting $L = (ab)^*$.', sol: 'The minimal DFA has 2 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q0", "to": "qT", "symbol": "b" },
                { "from": "q1", "to": "q0", "symbol": "b" },
                { "from": "q1", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 7. Minimize a 5-state DFA accepting L = Σ* 11. (Minimal: 3 states)
          {
            q: 'Minimize a 5-state DFA accepting $L = \\Sigma^* 11$.', sol: 'The minimal DFA has 3 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q0", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 8. Minimize a 5-state DFA accepting L = Σ³ (length exactly 3). (Minimal: 4 states)
          {
            q: 'Minimize a 5-state DFA accepting $L = \\Sigma^3$ (length exactly 3).', sol: 'The minimal DFA has 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": false },
                { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 900, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q2", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q3", "symbol": "0" },
                { "from": "q2", "to": "q3", "symbol": "1" },
                { "from": "q3", "to": "qT", "symbol": "0" },
                { "from": "q3", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 9. Minimize a 7-state DFA accepting strings where the last symbol is the same as the first symbol. (Minimal: 6 states)
          {
            q: 'Minimize a 7-state DFA accepting strings where the last symbol is the same as the first symbol.', sol: 'The minimal DFA has 6 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0_0", "x": 300, "y": 200, "initial": false, "accepting": true },
                { "id": "q0_1", "x": 500, "y": 200, "initial": false, "accepting": false },
                { "id": "q1_1", "x": 300, "y": 400, "initial": false, "accepting": true },
                { "id": "q1_0", "x": 500, "y": 400, "initial": false, "accepting": false },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0_0", "symbol": "0" },
                { "from": "q0", "to": "q1_1", "symbol": "1" },
                { "from": "q0_0", "to": "q0_0", "symbol": "0" },
                { "from": "q0_0", "to": "q0_1", "symbol": "1" },
                { "from": "q0_1", "to": "q0_0", "symbol": "0" },
                { "from": "q0_1", "to": "q0_1", "symbol": "1" },
                { "from": "q1_1", "to": "q1_0", "symbol": "0" },
                { "from": "q1_1", "to": "q1_1", "symbol": "1" },
                { "from": "q1_0", "to": "q1_0", "symbol": "0" },
                { "from": "q1_0", "to": "q1_1", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 10. Minimize a 6-state DFA that accepts all strings NOT containing the substring "01". (Minimal: 3 states)
          {
            q: 'Minimize a 6-state DFA that accepts all strings NOT containing the substring "01".', sol: 'The minimal DFA has 3 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q1", "to": "q1", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 11. Minimize a 5-state DFA that accepts the language L={w | |w| <= 3 and w has no 01 } (Minimal: 4 states)
          {
            q: 'Minimize a 5-state DFA that accepts the language $L=\\{w \\mid |w| \\leq 3 \\text{ and } w \\text{ has no } 01 \\}$ (Σ={0, 1}).', sol: 'The minimal DFA is 4 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                { "id": "q2", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "q3", "x": 700, "y": 200, "initial": false, "accepting": true },
                { "id": "qT", "x": 900, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q2", "symbol": "0" },
                { "from": "q1", "to": "qT", "symbol": "1" },
                { "from": "q2", "to": "q3", "symbol": "0" },
                { "from": "q2", "to": "qT", "symbol": "1" },
                { "from": "q3", "to": "qT", "symbol": "0" },
                { "from": "q3", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 12. Minimize a 5-state DFA accepting strings containing an odd number of "0"s AND an odd number of "1"s. (Minimal: 4 states)
          {
            q: 'Minimize a 5-state DFA accepting strings containing an odd number of "0"s AND an odd number of "1"s.', sol: 'The minimal DFA is 4 states.', "machine": {
              "states": [
                { "id": "qEE", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "qOE", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "qEO", "x": 300, "y": 400, "initial": false, "accepting": true },
                { "id": "qOO", "x": 500, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "qEE", "to": "qOE", "symbol": "0" },
                { "from": "qEE", "to": "qEO", "symbol": "1" },
                { "from": "qOE", "to": "qEE", "symbol": "0" },
                { "from": "qOE", "to": "qOO", "symbol": "1" },
                { "from": "qEO", "to": "qOO", "symbol": "0" },
                { "from": "qEO", "to": "qEE", "symbol": "1" },
                { "from": "qOO", "to": "qEO", "symbol": "0" },
                { "from": "qOO", "to": "qOE", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 13. Minimize a 5-state DFA for L = 00 U 11. (Minimal: 5 states)
          {
            q: 'Minimize a 5-state DFA for $L = 00 \\cup 11$.', sol: 'The minimal DFA is 5 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0a", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q1a", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "qF0", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "qF1", "x": 500, "y": 400, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0a", "symbol": "0" },
                { "from": "q0", "to": "q1a", "symbol": "1" },
                { "from": "q0a", "to": "qF0", "symbol": "0" },
                { "from": "q0a", "to": "qT", "symbol": "1" },
                { "from": "q1a", "to": "qT", "symbol": "0" },
                { "from": "q1a", "to": "qF1", "symbol": "1" },
                { "from": "qF0", "to": "qT", "symbol": "0" },
                { "from": "qF0", "to": "qT", "symbol": "1" },
                { "from": "qF1", "to": "qT", "symbol": "0" },
                { "from": "qF1", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 14. Minimize the 4-state DFA for L = 0* 1*. (Minimal: 3 states)
          {
            q: 'Minimize the 4-state DFA for $L = 0^* 1^*$.', sol: 'The minimal DFA is 3 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                { "id": "qT", "x": 300, "y": 400, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "qT", "symbol": "0" },
                { "from": "q1", "to": "q1", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 15. Minimize a 6-state DFA that accepts L={w | w has length divisible by 2 or 3 }. (Minimal: 6 states)
          {
            q: 'Minimize a 6-state DFA that accepts language w | w has length divisible by 2 or 3.', sol: 'The minimal DFA is 6 states.', "machine": {
              "states": [
                { "id": "q00", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q01", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q02", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "q10", "x": 300, "y": 400, "initial": false, "accepting": true },
                { "id": "q11", "x": 500, "y": 400, "initial": false, "accepting": false },
                { "id": "q12", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q00", "to": "q11", "symbol": "a" },
                { "from": "q11", "to": "q02", "symbol": "a" },
                { "from": "q02", "to": "q10", "symbol": "a" },
                { "from": "q10", "to": "q01", "symbol": "a" },
                { "from": "q01", "to": "q12", "symbol": "a" },
                { "from": "q12", "to": "q00", "symbol": "a" }
              ],
              "alphabet": ["a"]
            }
          }
        ],
        // --- 7. CONVERSION MODE: NFA -> MIN DFA (10 Questions) ---
        NFA_TO_MIN_DFA: [
          // 1. Convert the NFA for L = (0|1)* 01 (ends with 01) to its equivalent Minimal DFA. (3 states)
          {
            q: 'Convert the NFA for language (0|1)* 01 (ends with 01) to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (3 states), then Minimization (3 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0,q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q0,q2", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q0,q1", "symbol": "0" },
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q0,q1", "to": "q0,q1", "symbol": "0" },
                { "from": "q0,q1", "to": "q0,q2", "symbol": "1" },
                { "from": "q0,q2", "to": "q0,q1", "symbol": "0" },
                { "from": "q0,q2", "to": "q0", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 2. Convert the NFA for L = (00)* U (11)* to its equivalent Minimal DFA. (4 states)
          {
            q: 'Convert the NFA for language  (00)* or (11)* to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (4 states), then Minimization (4 states).', "machine": {
              "states": [
                { "id": "qS", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q0a", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q1a", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "qF", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "qS", "to": "q0a", "symbol": "0" },
                { "from": "qS", "to": "q1a", "symbol": "1" },
                { "from": "q0a", "to": "qF", "symbol": "0" },
                { "from": "q0a", "to": "q1a", "symbol": "1" },
                { "from": "q1a", "to": "q0a", "symbol": "0" },
                { "from": "q1a", "to": "qF", "symbol": "1" },
                { "from": "qF", "to": "q0a", "symbol": "0" },
                { "from": "qF", "to": "q1a", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          
          // 3. Convert the ε-NFA for a?b to its equivalent Minimal DFA. (3 states)
          {
            q: 'Convert the ε-NFA for a?b to its equivalent Minimal DFA.', sol: 'Requires ε-NFA to NFA, NFA to DFA, then Minimization (3 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 500, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q0", "to": "q1", "symbol": "b" },
                { "from": "q1", "to": "qT", "symbol": "a" },
                { "from": "q1", "to": "qT", "symbol": "b" },
                { "from": "qT", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 4. Convert the NFA for L = (ab U ba)* to its equivalent Minimal DFA. (4 states)
          {
            q: 'Convert the NFA for language (ab or ba)* to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (4 states), then Minimization (4 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "qA", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "qB", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "qF", "x": 500, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "qA", "symbol": "a" },
                { "from": "q0", "to": "qB", "symbol": "b" },
                { "from": "qA", "to": "qF", "symbol": "b" },
                { "from": "qA", "to": "qA", "symbol": "a" },
                { "from": "qB", "to": "qF", "symbol": "a" },
                { "from": "qB", "to": "qB", "symbol": "b" },
                { "from": "qF", "to": "qA", "symbol": "a" },
                { "from": "qF", "to": "qB", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 5. Convert the NFA accepting strings with exactly two "1"s to its equivalent Minimal DFA. (4 states)
          {
            q: 'Convert the NFA accepting strings with exactly two "1"s to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (4 states), then Minimization (4 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "0" },
                { "from": "q0", "to": "q1", "symbol": "1" },
                { "from": "q1", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q2", "symbol": "0" },
                { "from": "q2", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 6. Convert the NFA for L = Σ* 0 Σ (second to last symbol is 0) to its equivalent Minimal DFA. (4 states)
          {
            q: 'Convert the NFA for language Sigma* 0 Sigma where second to last symbol is "0" to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (4 states), then Minimization (4 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q2", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "q3", "x": 700, "y": 300, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "0" },
                { "from": "q0", "to": "q0", "symbol": "1" },
                { "from": "q1", "to": "q1", "symbol": "0" },
                { "from": "q1", "to": "q2", "symbol": "1" },
                { "from": "q2", "to": "q3", "symbol": "0" },
                { "from": "q2", "to": "q2", "symbol": "1" },
                { "from": "q3", "to": "q3", "symbol": "0" },
                { "from": "q3", "to": "q2", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 7. Convert the NFA for L = 00 U 11 to its equivalent Minimal DFA. (6 states)
          {
            q: 'Convert the NFA for language = 00 or 11 to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (6 states), then Minimization (5 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q0a", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q1a", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "qF0", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "qF1", "x": 500, "y": 400, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0a", "symbol": "0" },
                { "from": "q0", "to": "q1a", "symbol": "1" },
                { "from": "q0a", "to": "qF0", "symbol": "0" },
                { "from": "q0a", "to": "qT", "symbol": "1" },
                { "from": "q1a", "to": "qT", "symbol": "0" },
                { "from": "q1a", "to": "qF1", "symbol": "1" },
                { "from": "qF0", "to": "qT", "symbol": "0" },
                { "from": "qF0", "to": "qT", "symbol": "1" },
                { "from": "qF1", "to": "qT", "symbol": "0" },
                { "from": "qF1", "to": "qT", "symbol": "1" },
                { "from": "qT", "to": "qT", "symbol": "0" },
                { "from": "qT", "to": "qT", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 8. Convert the ε-NFA for L= (01)* | (10)* to its equivalent Minimal DFA. (5 states)
          {
            q: 'Convert the ε-NFA for language (01)* | (10)* to its equivalent Minimal DFA.', sol: 'Requires three steps, resulting in 5 states.', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q01a", "x": 300, "y": 200, "initial": false, "accepting": false },
                { "id": "q10a", "x": 300, "y": 400, "initial": false, "accepting": false },
                { "id": "qF1", "x": 500, "y": 200, "initial": false, "accepting": true },
                { "id": "qF2", "x": 500, "y": 400, "initial": false, "accepting": true }
              ],
              "transitions": [
                { "from": "q0", "to": "q01a", "symbol": "0" },
                { "from": "q0", "to": "q10a", "symbol": "1" },
                { "from": "q01a", "to": "qF1", "symbol": "1" },
                { "from": "q10a", "to": "qF2", "symbol": "0" },
                { "from": "qF1", "to": "q01a", "symbol": "0" },
                { "from": "qF1", "to": "qF2", "symbol": "1" },
                { "from": "qF2", "to": "q01a", "symbol": "0" },
                { "from": "qF2", "to": "q10a", "symbol": "1" }
              ],
              "alphabet": ["0", "1"]
            }
          },
          // 9. Convert the NFA for L = a* b* to its equivalent Minimal DFA. (3 states)
          {
            q: 'Convert the NFA for language a* b* to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (3 states), then Minimization (3 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": true },
                { "id": "q1", "x": 300, "y": 200, "initial": false, "accepting": true },
                { "id": "qT", "x": 500, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q0", "symbol": "a" },
                { "from": "q0", "to": "q1", "symbol": "b" },
                { "from": "q1", "to": "qT", "symbol": "a" },
                { "from": "q1", "to": "q1", "symbol": "b" },
                { "from": "qT", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          },
          // 10. Convert the NFA for L = a Σ* a (starts and ends with 'a') to its equivalent Minimal DFA. (4 states)
          {
            q: 'Convert the NFA for language a sigma* a that starts and ends with "a" to its equivalent Minimal DFA.', sol: 'Requires NFA to DFA (4 states), then Minimization (4 states).', "machine": {
              "states": [
                { "id": "q0", "x": 100, "y": 300, "initial": true, "accepting": false },
                { "id": "q1", "x": 300, "y": 300, "initial": false, "accepting": false },
                { "id": "q12", "x": 500, "y": 300, "initial": false, "accepting": true },
                { "id": "qT", "x": 700, "y": 300, "initial": false, "accepting": false }
              ],
              "transitions": [
                { "from": "q0", "to": "q1", "symbol": "a" },
                { "from": "q0", "to": "qT", "symbol": "b" },
                { "from": "q1", "to": "q12", "symbol": "a" },
                { "from": "q1", "to": "q1", "symbol": "b" }, 
                { "from": "q12", "to": "q12", "symbol": "a" },
                { "from": "q12", "to": "q1", "symbol": "b" },
                { "from": "qT", "to": "qT", "symbol": "a" },
                { "from": "qT", "to": "qT", "symbol": "b" }
              ],
              "alphabet": ["a", "b"]
            }
          }
        ]
      };

