/* ============================================================
   AK Fish Farms — Admin Login & Password API
   POST /api/admin  → login
   PUT  /api/admin  → change password
   ============================================================ */
'use strict';

const { query, initDb, withJson } = require('./lib/db');
const bcrypt = require('bcryptjs');

async function handler(req, res) {
    const { method } = req;

    // ── Always return JSON ──────────────────────────────────
    res.setHeader('Content-Type', 'application/json');

    await initDb();

    /* ─── POST: Login ────────────────────────────────────── */
    if (method === 'POST') {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password are required.' });
        }

        console.log(`🔐 Login attempt: "${username}"`);

        // ── FAST PATH: Check environment variable credentials first ──
        const envUser = process.env.ADMIN_USER || 'admin';
        const envPass = process.env.ADMIN_PASS || 'admin123';

        if (username.trim() === envUser && password === envPass) {
            console.log('✅ Login Successful (via ENV credentials)');
            return res.status(200).json({
                success: true,
                token: Buffer.from(`${username}:env`).toString('base64'),
                user: { username }
            });
        }

        // ── FALLBACK: Check database ──────────────────────────────
        try {
            // Seed admin user from env if table is empty
            const existingCheck = await query('SELECT COUNT(*) as cnt FROM admin_users');
            const count = parseInt(existingCheck.rows[0].cnt, 10);

            if (count === 0) {
                console.log('🏁 First-time setup: Seeding admin from ENV...');
                const hashedSeed = await bcrypt.hash(envPass, 10);
                await query(
                    'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
                    [envUser, hashedSeed]
                );
            }

            const result = await query('SELECT * FROM admin_users WHERE username = $1', [username.trim()]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isValid = await bcrypt.compare(password, user.password_hash);

                if (isValid) {
                    console.log('✅ Login Successful (via DB)');
                    return res.status(200).json({
                        success: true,
                        token: Buffer.from(`${user.username}:${user.id}`).toString('base64'),
                        user: { username: user.username }
                    });
                }
            }
        } catch (dbErr) {
            console.error('⚠️ DB login check failed, env check already done:', dbErr.message);
        }

        console.warn('❌ Login Failed: Invalid credentials');
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    /* ─── PUT: Change Password ───────────────────────────── */
    if (method === 'PUT') {
        const { username, oldPassword, newPassword } = req.body || {};

        if (!username || !oldPassword || !newPassword) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        try {
            const result = await query('SELECT * FROM admin_users WHERE username = $1', [username]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isValid = await bcrypt.compare(oldPassword, user.password_hash);

                if (isValid) {
                    const hashedNew = await bcrypt.hash(newPassword, 10);
                    await query('UPDATE admin_users SET password_hash = $1 WHERE username = $2', [hashedNew, username]);
                    console.log(`✅ Password changed for: ${username}`);
                    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
                }
            }
        } catch (dbErr) {
            console.error('DB password change error:', dbErr.message);
            return res.status(500).json({ success: false, error: 'Database error during password change.' });
        }

        return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    res.setHeader('Allow', ['POST', 'PUT']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

module.exports = withJson(handler);
