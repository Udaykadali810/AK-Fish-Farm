import { getCoupons, saveCoupons } from './lib/storage';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        try {
            const coupons = await getCoupons();
            res.status(200).json(coupons);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch coupons' });
        }
    } else if (method === 'POST') {
        try {
            const coupons = await getCoupons();
            const newCoupon = {
                ...req.body,
                id: `CPN-${Date.now()}`,
                createdAt: new Date().toISOString()
            };
            coupons.push(newCoupon);
            if (await saveCoupons(coupons)) {
                res.status(201).json(newCoupon);
            } else {
                res.status(500).json({ error: 'Failed to save coupon' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
