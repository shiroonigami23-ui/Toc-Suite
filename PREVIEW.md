# 🌌 Latest Machine: DFA: Starts with 'a'
**Machine Type:** DFA
**Source:** `automata/fa/dfa_starts_a.json`

### 📋 Transition Table
| State | a | b |
| :--- | :---: | :---: |
| **q0** (Start) | q1 | q2 |
| **q1** (Final) | q1 | q1 |
| **q2** | q2 | q2 |

### 🎨 Visual Logic Diagram
```text
   [q0]      -- a -->     (q1*)    
   [q0]      -- b -->     [q2]     
   (q1*)     -- a -->     (q1*)    
   (q1*)     -- b -->     (q1*)    
   [q2]      -- a -->     [q2]     
   [q2]      -- b -->     [q2]
