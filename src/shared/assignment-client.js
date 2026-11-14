function safeGet(key, fallback = '') {
    try {
        return localStorage.getItem(key) ?? fallback;
    } catch (_e) {
        return fallback;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (_e) {}
}

function safeRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch (_e) {}
}

function sessionSet(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (_e) {}
}

const AUTH_KEYS = {
    email: 'tocAuthEmail',
    roll: 'tocAuthRoll'
};
const AUTH_SESSION_KEYS = {
    locked: 'tocAuthSessionLocked'
};

const EMAIL_RE = /^[a-z0-9._%+-]+@rjit\.ac\.in$/i;
const ROLL_LOCAL_RE = /^0902(?:CS|EC|IT|AI)\d{6}$/i;

function parseEmailIdentity(emailRaw) {
    const email = String(emailRaw || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return null;
    const localPart = email.split('@')[0].toUpperCase();
    if (!ROLL_LOCAL_RE.test(localPart)) return null;
    return { email, roll: localPart };
}

export function getStudentProfile() {
    return {
        name: safeGet('tocStudentName', 'Student'),
        email: safeGet(AUTH_KEYS.email, ''),
        year: '',
        section: '',
        branch: '',
        roll: safeGet(AUTH_KEYS.roll, '')
    };
}

export function normalizeMachineType(type) {
    const t = String(type || '').toUpperCase();
    if (['DFA', 'NFA', 'ENFA', 'FA'].includes(t)) return 'FA';
    if (['MOORE', 'MEALY', 'MM'].includes(t)) return 'MM';
    if (t === 'PDA') return 'PDA';
    if (t === 'TM' || t === 'TURING') return 'TM';
    return 'FA';
}

export async function getActiveAssignments(machineType) {
    const normalized = normalizeMachineType(machineType);
    const res = await fetch(`/.netlify/functions/list-active-assignments?machineType=${encodeURIComponent(normalized)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function ensureEmailLoginForSubmission() {
    const existing = parseEmailIdentity(safeGet(AUTH_KEYS.email, ''));
    if (existing) {
        safeSet(AUTH_KEYS.roll, existing.roll);
        return true;
    }

    const entered = window.prompt('Enter your college email to submit assignment/quiz (example: 0902CS231028@rjit.ac.in):');
    const parsed = parseEmailIdentity(entered);
    if (!parsed) {
        window.alert('Use valid college email format: 0902(CS|EC|IT|AI)XXXXXX@rjit.ac.in');
        return false;
    }

    safeSet(AUTH_KEYS.email, parsed.email);
    safeSet(AUTH_KEYS.roll, parsed.roll);
    sessionSet(AUTH_SESSION_KEYS.locked, 'true');
    window.alert('Email registered for this session.');
    return true;
}

export function clearStudentEmailLogin() {
    safeRemove(AUTH_KEYS.email);
    safeRemove(AUTH_KEYS.roll);
}

function getClientFingerprint() {
    try {
        const parts = [
            navigator.userAgent || '',
            navigator.platform || '',
            navigator.language || '',
            Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            `${screen.width}x${screen.height}x${screen.colorDepth}`
        ];
        return btoa(parts.join('|')).slice(0, 120);
    } catch (_e) {
        return 'unknown-client';
    }
}

export async function decideSubmissionMode(machineType) {
    try {
        const active = await getActiveAssignments(machineType);
        if (!active.length) return { submissionMode: 'practice', assignmentId: null, assignmentTitle: null };

        const preferredIdRaw = safeGet('tocPreferredAssignmentId', '');
        const preferredId = Number(preferredIdRaw || 0);
        const preferred = Number.isFinite(preferredId) && preferredId > 0
            ? active.find((a) => Number(a.id) === preferredId)
            : null;

        const quiz = active.find((a) => a.assignment_mode === 'quiz');
        const practice = active.find((a) => a.assignment_mode === 'practice');
        const chosen = preferred || quiz || practice || active[0];

        const label = chosen.assignment_mode === 'quiz' ? 'Quiz' : 'Practice';
        const ask = window.confirm(
            `${label} open: "${chosen.title}".\n\nPress OK to submit this save to the assignment.\nPress Cancel to save normally.`
        );
        if (!ask) return { submissionMode: 'practice', assignmentId: null, assignmentTitle: null };

        const emailOk = await ensureEmailLoginForSubmission();
        if (!emailOk) {
            window.alert('Assignment submission requires valid college email login.');
            return { submissionMode: 'practice', assignmentId: null, assignmentTitle: null };
        }

        safeSet('tocPreferredAssignmentId', String(chosen.id || ''));
        safeSet('tocPreferredAssignmentMode', String(chosen.assignment_mode || 'practice'));
        safeSet('tocPreferredAssignmentTitle', String(chosen.title || ''));
        return {
            submissionMode: chosen.assignment_mode || 'practice',
            assignmentId: chosen.id,
            assignmentTitle: chosen.title
        };
    } catch (_e) {
        return { submissionMode: 'practice', assignmentId: null, assignmentTitle: null };
    }
}

export async function stageToDb(payload) {
    const authEmail = safeGet(AUTH_KEYS.email, '');
    const clientFingerprint = getClientFingerprint();
    const res = await fetch('/.netlify/functions/save-to-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, authEmail: authEmail || null, clientFingerprint })
    });
    if (!res.ok) {
        try {
            const body = await res.json();
            window.alert(body?.error || 'Submission blocked by server policy.');
        } catch (_e) {
            window.alert('Submission blocked by server policy.');
        }
    }
    if (res.ok && payload?.assignmentId) {
        safeRemove('tocPreferredAssignmentId');
    }
    return res.ok;
}
