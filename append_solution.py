import sys
import json
import pathlib

# Source-of-Truth folder mapping
FOLDERS = {
    "DFA": "automata/fa", "NFA": "automata/fa", "ENFA": "automata/fa",
    "PDA": "automata/pda",
    "MOORE": "automata/mm", "MEALY": "automata/mm",
    "TM": "automata/tm"
}

def main():
    if len(sys.argv) < 2:
        print("Usage: python append_solution.py new_entry.json")
        return

    newpath = pathlib.Path(sys.argv[1])
    if not newpath.exists():
        print(f"Error: File {newpath} not found.")
        return

    try:
        new_entry = json.loads(newpath.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format: {e}")
        return

    # 1. Determine Type and Identity
    m_type = new_entry.get('type', 'DFA').upper()
    m_id = new_entry.get('id') or new_entry.get('title')

    if not m_id:
        print("Error: Entry must have an 'id' or 'title'.")
        return

    # 2. Resolve Target Subfolder
    target_folder = FOLDERS.get(m_type, "automata/fa")
    target_dir = pathlib.Path(target_folder)
    target_dir.mkdir(parents=True, exist_ok=True)

    # 3. Save as individual source file
    # Normalizing filename to prevent OS conflicts
    safe_filename = "".join([c if c.isalnum() else "_" for c in m_id.lower()]) + ".json"
    target_path = target_dir / safe_filename
    
    target_path.write_text(json.dumps(new_entry, indent=2), encoding="utf-8")
    print(f"Success: '{m_id}' saved to {target_path}")

if __name__ == "__main__":
    main()