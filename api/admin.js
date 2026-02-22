import { db, initDb, withJson } from './lib/db';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
    const { method } = req;
    await initDb();

    if (method === 'POST') {
        const { username, password } = req.body;
        console.log(`🔐 Login Attempt: ${username}`);

        // Seed check: If no admin exists, create one from Env or Defaults
        const { rows: existingAdmins } = await db`SELECT * FROM admin_users LIMIT 1`;

        if (existingAdmins.length === 0) {
            console.log('🏁 First-time setup: Seeding admin user from Env...');
            const seedUser = process.env.ADMIN_USER || 'admin';
            const seedPass = process.env.ADMIN_PASS || 'admin123';
            const hashedSeed = await bcrypt.hash(seedPass, 10);

            await db`
                INSERT INTO admin_users (username, password_hash)
                VALUES (${seedUser}, ${hashedSeed})
            `;
        }

        // Real validation
        const { rows } = await db`SELECT * FROM admin_users WHERE username = ${username?.trim()}`;

        if (rows.length > 0) {
            const user = rows[0];
            const isValid = await bcrypt.compare(password, user.password_hash);

            if (isValid) {
                console.log('✅ Login Successful');
                return res.status(200).json({
                    success: true,
                    token: Buffer.from(`${user.username}:${user.id}`).toString('base64'),
                    user: { username: user.username }
                });
            }
        }

        console.warn('❌ Login Failed: Invalid credentials');
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    if (method === 'PUT') {
        const { username, oldPassword, newPassword } = req.body;
        const { rows } = await db`SELECT * FROM admin_users WHERE username = ${username}`;

        if (rows.length > 0) {
            const user = rows[0];
            const isValid = await bcrypt.compare(oldPassword, user.password_hash);
            if (isValid) {
                const hashedNew = await bcrypt.hash(newPassword, 10);
                await db`UPDATE admin_users SET password_hash = ${hashedNew} WHERE username = ${username}`;
                return res.status(200).json({ success: true });
            }
        }
        return res.status(401).json({ success: false, error: 'Current password incorrect' });
    }

    res.setHeader('Allow', ['POST', 'PUT']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}

export default withJson(handler);
