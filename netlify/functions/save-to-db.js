const { Client } = require('pg');

const EMAIL_RE = /^[a-z0-9._%+-]+@rjit\.ac\.in$/i;
const ROLL_LOCAL_RE = /^0902(?:CS|EC|IT|AI)\d{6}$/i;

function createClient() {
    return new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
}

function parseStudentIdentityFromEmail(emailRaw) {
    const email = String(emailRaw || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return null;
    const localPart = email.split('@')[0].toUpperCase();
    if (!ROLL_LOCAL_RE.test(localPart)) return null;
    return { email, roll: localPart };
}

async function ensureSchema(client) {
    await client.query(`
        ALTER TABLE machine_submissions
        ADD COLUMN IF NOT EXISTS submission_mode VARCHAR(20) DEFAULT 'practice',
        ADD COLUMN IF NOT EXISTS assignment_id INTEGER,
        ADD COLUMN IF NOT EXISTS assignment_title VARCHAR(255),
        ADD COLUMN IF NOT EXISTS student_email VARCHAR(120),
        ADD COLUMN IF NOT EXISTS student_year VARCHAR(20),
        ADD COLUMN IF NOT EXISTS student_section VARCHAR(20),
        ADD COLUMN IF NOT EXISTS student_branch VARCHAR(80),
        ADD COLUMN IF NOT EXISTS student_roll VARCHAR(40),
        ADD COLUMN IF NOT EXISTS client_fingerprint VARCHAR(160),
        ADD COLUMN IF NOT EXISTS suspicious_flag BOOLEAN NOT NULL DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS suspicious_reason TEXT,
        ADD COLUMN IF NOT EXISTS repo_eligible BOOLEAN NOT NULL DEFAULT FALSE
    `);
    await client.query(`
        CREATE TABLE IF NOT EXISTS assignments (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            machine_type VARCHAR(20) NOT NULL,
            assignment_mode VARCHAR(20) NOT NULL DEFAULT 'practice',
            prompt TEXT NOT NULL,
            start_at TIMESTAMP NULL,
            end_at TIMESTAMP NULL,
            max_marks INTEGER NOT NULL DEFAULT 100,
            max_submissions INTEGER NOT NULL DEFAULT 1,
            archive_after_days INTEGER NOT NULL DEFAULT 10,
            repo_eligible BOOLEAN NOT NULL DEFAULT FALSE,
            strict_device_lock BOOLEAN NOT NULL DEFAULT TRUE,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            created_by VARCHAR(120) NULL
        )
    `);
    await client.query(`
        CREATE TABLE IF NOT EXISTS student_identity_locks (
            roll_no VARCHAR(24) PRIMARY KEY,
            email VARCHAR(120) UNIQUE NOT NULL,
            fingerprint VARCHAR(160) UNIQUE NOT NULL,
            locked_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `);
}

async function resolveAssignment(client, assignmentId) {
    if (!assignmentId) return null;
    const res = await client.query(
        `SELECT id, assignment_mode, is_active, start_at, end_at, max_submissions, archive_after_days, repo_eligible, strict_device_lock
         FROM assignments
         WHERE id = $1
           AND is_active = TRUE
           AND (start_at IS NULL OR start_at <= NOW())
           AND (end_at IS NULL OR end_at >= NOW())
         LIMIT 1`,
        [assignmentId]
    );
    return res.rows[0] || null;
}

function isWithinWindow(row) {
    const now = Date.now();
    const startOk = !row.start_at || new Date(row.start_at).getTime() <= now;
    const endOk = !row.end_at || new Date(row.end_at).getTime() >= now;
    return startOk && endOk;
}

async function enforceMaxSubmissions(client, assignmentId, roll, maxSubmissions) {
    if (!assignmentId || !roll) return true;
    const countRes = await client.query(
        `SELECT COUNT(*)::int AS cnt
         FROM machine_submissions
         WHERE assignment_id = $1
           AND student_roll = $2`,
        [assignmentId, roll]
    );
    return Number(countRes.rows[0]?.cnt || 0) < Number(maxSubmissions || 1);
}

async function enforceQuizSingleAttempt(client, assignmentId, roll) {
    if (!assignmentId || !roll) return true;
    const existing = await client.query(
        `SELECT id FROM machine_submissions
         WHERE assignment_id = $1
           AND student_roll = $2
           AND submission_mode = 'quiz'
         LIMIT 1`,
        [assignmentId, roll]
    );
    return existing.rows.length === 0;
}

async function enforceIdentityLock(client, identity, fingerprint, strictLock) {
    if (!identity || !fingerprint) return { ok: false, reason: 'Missing identity/fingerprint.' };
    if (!strictLock) return { ok: true };

    const rows = await client.query(
        `SELECT roll_no, email, fingerprint FROM student_identity_locks
         WHERE roll_no = $1 OR email = $2 OR fingerprint = $3`,
        [identity.roll, identity.email, fingerprint]
    );

    if (rows.rows.length === 0) {
        await client.query(
            `INSERT INTO student_identity_locks (roll_no, email, fingerprint)
             VALUES ($1,$2,$3)`,
            [identity.roll, identity.email, fingerprint]
        );
        return { ok: true };
    }

    const byRoll = rows.rows.find((r) => r.roll_no === identity.roll);
    const byEmail = rows.rows.find((r) => r.email === identity.email);
    const byFp = rows.rows.find((r) => r.fingerprint === fingerprint);

    if (byRoll && (byRoll.email !== identity.email || byRoll.fingerprint !== fingerprint)) {
        return { ok: false, reason: 'This roll is already locked to another device/email.' };
    }
    if (byEmail && byEmail.roll_no !== identity.roll) {
        return { ok: false, reason: 'This email is already locked to another roll.' };
    }
    if (byFp && byFp.roll_no !== identity.roll) {
        return { ok: false, reason: 'This device fingerprint is already locked to another roll.' };
    }
    return { ok: true };
}

async function antiSwitchCheck(client, roll, clientFingerprint) {
    if (!roll || !clientFingerprint) return { reject: false, suspicious: false, reason: '' };

    const last = await client.query(
        `SELECT client_fingerprint, created_at
         FROM machine_submissions
         WHERE student_roll = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [roll]
    );
    const row = last.rows[0];
    if (!row || !row.client_fingerprint) return { reject: false, suspicious: false, reason: '' };
    if (row.client_fingerprint === clientFingerprint) return { reject: false, suspicious: false, reason: '' };

    const ageMs = Date.now() - new Date(row.created_at).getTime();
    if (ageMs <= 10 * 60 * 1000) {
        return { reject: true, suspicious: true, reason: 'Rapid device/browser switch detected for same roll within 10 minutes.' };
    }
    if (ageMs <= 24 * 60 * 60 * 1000) {
        return { reject: false, suspicious: true, reason: 'Different device/browser used for same roll within 24 hours.' };
    }
    return { reject: false, suspicious: false, reason: '' };
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const client = createClient();
    try {
        const {
            name,
            type,
            data,
            author,
            submissionMode,
            assignmentId,
            assignmentTitle,
            studentProfile,
            authEmail,
            clientFingerprint
        } = JSON.parse(event.body || '{}');

        await client.connect();
        await ensureSchema(client);

        const mode = ['quiz', 'practice'].includes(String(submissionMode || '').toLowerCase())
            ? String(submissionMode).toLowerCase()
            : 'practice';

        const requiresIdentity = Boolean(assignmentId) || mode === 'quiz';
        const parsedIdentity = parseStudentIdentityFromEmail(authEmail || studentProfile?.email || '');
        if (requiresIdentity && !parsedIdentity) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Valid @rjit.ac.in student email required for assignment/quiz submission.' })
            };
        }

        let repoEligible = false;
        let strictDeviceLock = true;
        if (assignmentId) {
            const assignment = await resolveAssignment(client, assignmentId);
            if (!assignment) {
                return { statusCode: 403, body: JSON.stringify({ error: 'Assignment is closed or inactive.' }) };
            }
            if (!await enforceMaxSubmissions(client, assignmentId, parsedIdentity.roll, assignment.max_submissions)) {
                return { statusCode: 409, body: JSON.stringify({ error: 'Submission limit reached for this assignment.' }) };
            }
            if (mode === 'quiz' && !await enforceQuizSingleAttempt(client, assignmentId, parsedIdentity.roll)) {
                return { statusCode: 409, body: JSON.stringify({ error: 'Quiz already submitted for this assignment and roll number.' }) };
            }
            repoEligible = Boolean(assignment.repo_eligible);
            strictDeviceLock = assignment.strict_device_lock !== false;
        }

        if (requiresIdentity && strictDeviceLock && !String(clientFingerprint || '').trim()) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Device fingerprint is required for this assignment.' }) };
        }

        if (requiresIdentity) {
            const lockResult = await enforceIdentityLock(client, parsedIdentity, String(clientFingerprint || ''), strictDeviceLock);
            if (!lockResult.ok) {
                return { statusCode: 423, body: JSON.stringify({ error: lockResult.reason }) };
            }
        }

        const switchCheck = requiresIdentity
            ? await antiSwitchCheck(client, parsedIdentity?.roll, String(clientFingerprint || ''))
            : { reject: false, suspicious: false, reason: '' };
        if (switchCheck.reject) {
            return { statusCode: 429, body: JSON.stringify({ error: switchCheck.reason }) };
        }

        const query = `
            INSERT INTO machine_submissions
            (name, type, data, author, submission_mode, assignment_id, assignment_title, student_email, student_year, student_section, student_branch, student_roll, client_fingerprint, suspicious_flag, suspicious_reason, repo_eligible)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
            RETURNING id
        `;
        const res = await client.query(query, [
            name,
            type,
            JSON.stringify(data),
            author,
            mode,
            assignmentId || null,
            assignmentTitle || null,
            parsedIdentity?.email || null,
            studentProfile?.year || null,
            studentProfile?.section || null,
            studentProfile?.branch || null,
            parsedIdentity?.roll || null,
            String(clientFingerprint || ''),
            Boolean(switchCheck.suspicious),
            switchCheck.reason || null,
            Boolean(repoEligible)
        ]);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Success', id: res.rows[0].id })
        };
    } catch (err) {
        console.error('Database Error:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database Connection Failed', details: err.message })
        };
    } finally {
        await client.end();
    }
};
