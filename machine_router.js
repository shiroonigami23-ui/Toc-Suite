const PENDING_MACHINE_KEY = 'tocPendingImportedMachine';

const ROUTE_HASH = {
  fa: '#fa',
  mm: '#mm',
  pda: '#pda',
  tm: '#tm',
  grammar: '#grammar'
};

function asObject(value) {
  return value && typeof value === 'object' ? value : {};
}

function hasStateGraph(machine) {
  return Array.isArray(machine.states) && Array.isArray(machine.transitions);
}

function normalizeType(rawType) {
  return String(rawType || '').trim().toUpperCase();
}

export function detectMachineRoute(rawMachine) {
  const machine = asObject(rawMachine);
  const type = normalizeType(machine.type);

  if (Array.isArray(machine.rules) && machine.startSymbol) return 'grammar';

  if (['TM', 'STANDARD', 'MULTI_TAPE', 'STAY_OPTION', 'NON_DET', 'LBA'].includes(type)) return 'tm';
  if (type === 'PDA') return 'pda';
  if (['MOORE', 'MEALY', 'MOORE_TO_MEALY', 'MEALY_TO_MOORE'].includes(type)) return 'mm';
  if (['DFA', 'NFA', 'ENFA', 'E-NFA', 'ENFA_TO_NFA', 'NFA_TO_DFA', 'NFA_TO_MIN_DFA', 'DFA_TO_MIN_DFA'].includes(type)) return 'fa';

  if (hasStateGraph(machine)) {
    const hasStackOps = machine.transitions.some((t) =>
      Object.prototype.hasOwnProperty.call(t, 'pop') ||
      Object.prototype.hasOwnProperty.call(t, 'push')
    );
    const hasOutputOps = machine.transitions.some((t) => Object.prototype.hasOwnProperty.call(t, 'output'));
    const hasTmOps = machine.transitions.some((t) =>
      Object.prototype.hasOwnProperty.call(t, 'write') ||
      Object.prototype.hasOwnProperty.call(t, 'move') ||
      Object.prototype.hasOwnProperty.call(t, 'writes') ||
      Object.prototype.hasOwnProperty.call(t, 'moves')
    );

    if (hasStackOps || machine.initialStackSymbol) return 'pda';
    if (hasOutputOps || machine.output_alphabet) return 'mm';
    if (hasTmOps) return 'tm';
    return 'fa';
  }

  return null;
}

export function setPendingImportedMachine(route, machine) {
  try {
    localStorage.setItem(PENDING_MACHINE_KEY, JSON.stringify({
      route,
      machine,
      ts: Date.now()
    }));
  } catch (_e) {}
}

export function consumePendingImportedMachine(route) {
  try {
    const raw = localStorage.getItem(PENDING_MACHINE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.route !== route || !parsed.machine) return null;
    localStorage.removeItem(PENDING_MACHINE_KEY);
    return parsed.machine;
  } catch (_e) {
    return null;
  }
}

export function clearPendingImportedMachine() {
  try {
    localStorage.removeItem(PENDING_MACHINE_KEY);
  } catch (_e) {}
}

export function routeMachineImport(machineData, currentRoute) {
  const targetRoute = detectMachineRoute(machineData);
  if (!targetRoute) return { handled: false, reason: 'unknown-type' };

  if (targetRoute === currentRoute) {
    return { handled: false, route: targetRoute };
  }

  setPendingImportedMachine(targetRoute, machineData);
  if (targetRoute === 'grammar') {
    window.location.href = 'grammar_studio.html';
    return { handled: true, route: targetRoute };
  }

  const hash = ROUTE_HASH[targetRoute] || '#fa';
  window.location.href = `index.html${hash}`;
  return { handled: true, route: targetRoute };
}
