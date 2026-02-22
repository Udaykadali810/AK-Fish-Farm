export default async function handler(req, res) {
    // This route handles admin-specific security and updates
    // In a production environment, you would verify JWT or session cookies here.

    if (req.method === 'POST') {
        const { username, password } = req.body;

        // Secure Credentials via Environment Variables
        // Fallback to defaults if env not set (for initial setup)
        const ADMIN_USER = process.env.ADMIN_USER || 'admin';
        const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

        if (username?.trim() === ADMIN_USER && password?.trim() === ADMIN_PASS) {
            res.status(200).json({
                success: true,
                token: Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString('base64')
            });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
