import { db, initDb } from './lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const { method } = req;

    try {
        await initDb();

        if (method === 'POST') {
            const { username, password } = req.body;

            // Seed check: If no admin exists, create one from Env or Defaults
            const { rows: existingAdmins } = await db`SELECT * FROM admin_users LIMIT 1`;

            if (existingAdmins.length === 0) {
                console.log('🏁 First-time setup: Seeding admin user...');
                const seedUser = process.env.ADMIN_USER || 'admin';
                const seedPass = process.env.ADMIN_PASS || 'admin123';
                const hashedSeed = await bcrypt.hash(seedPass, 10);

                await db`
                    INSERT INTO admin_users (username, password_hash)
                    VALUES (${seedUser}, ${hashedSeed})
                `;
            }

            // Validation
            const { rows } = await db`SELECT * FROM admin_users WHERE username = ${username?.trim()}`;

            if (rows.length > 0) {
                const user = rows[0];
                const isValid = await bcrypt.compare(password, user.password_hash);

                if (isValid) {
                    return res.status(200).json({
                        success: true,
                        token: Buffer.from(`${user.username}:${user.id}`).toString('base64'),
                        user: { username: user.username }
                    });
                }
            }

            return res.status(401).json({ error: 'Invalid username or password' });
        } else if (method === 'PUT') {
            // Password Change logic
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
            return res.status(401).json({ error: 'Current password incorrect' });
        }

        res.setHeader('Allow', ['POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    } catch (error) {
        console.error('Admin API Error:', error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}
