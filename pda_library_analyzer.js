/**
 * pda_library_loader.js
 */
import { animatePdaDrawing } from './pda_animation.js';

const LIB_URL = './pda_library.json';

async function fetchLibrary() {
  try {
    const response = await fetch(LIB_URL);
    return await response.json();
  } catch (e) {
    console.error("Error fetching PDA Library:", e);
    return [];
  }
}

function renderEntry(entry) {
  const container = document.createElement('div');
  container.className = 'library-entry';
  
  const machineData = entry.machine || entry;

  container.innerHTML = `
    <div class="library-entry-header">
      <div><strong>${entry.title || 'Untitled PDA'}</strong></div>
      <div class="library-entry-actions">
        <button class="icon-btn load-btn"><i data-lucide="play-circle"></i> Open</button>
      </div>
    </div>
    <div class="library-entry-description">${entry.description || 'No description available.'}</div>
  `;

  const btn = container.querySelector('.load-btn');
  btn.onclick = async () => {
      // Construction animation for library imports
      await animatePdaDrawing(machineData);
  };

  if (window.lucide) lucide.createIcons({ nodes: [container] });
  return container;
}

export async function initializeLibrary() {
    const listEl = document.getElementById('pdaLibraryList');
    if (!listEl) return;

    const data = await fetchLibrary();
    listEl.innerHTML = '';

    if (data.length === 0) {
        listEl.innerHTML = '<div class="library-message">Library is empty. Add .json files to automata/pda/</div>';
        return;
    }

    // Sort or filter here if needed, then render
    data.forEach(entry => listEl.appendChild(renderEntry(entry)));
}

/**
 * Analyzes the PDA structure to suggest a descriptive name.
 * @param {object} machine 
 * @returns {string}
 */
export function analyzePdaPattern(machine) {
    const symbols = machine.alphabet || [];
    const transitions = machine.transitions || [];

    // 1. Detect Balanced Parentheses
    if (symbols.includes('(') && symbols.includes(')')) {
        return "balanced-parentheses-pda";
    }

    // 2. Detect a^n b^n patterns
    if (symbols.includes('a') && symbols.includes('b')) {
        const hasMultiplier = transitions.some(t => t.push.length > 2);
        return hasMultiplier ? "comparative-counting-pda" : "an-bn-equality-pda";
    }

    // 3. Detect Palindromes
    if (symbols.includes('#') || symbols.includes('c')) {
        return "palindrome-with-marker-pda";
    }

    // 4. Default fallback based on complexity
    return machine.states.length > 3 ? "complex-pda-design" : "pda-automaton";
}