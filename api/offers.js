import { getOffers, saveOffers } from './lib/storage';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        try {
            const offers = await getOffers();
            res.status(200).json(offers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch offers' });
        }
    } else if (method === 'POST') {
        try {
            const offers = await getOffers();
            const newOffer = {
                ...req.body,
                id: `OFF-${Date.now()}`,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            offers.push(newOffer);
            if (await saveOffers(offers)) {
                res.status(201).json(newOffer);
            } else {
                res.status(500).json({ error: 'Failed to save offer' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (method === 'PUT') {
        try {
            const { id, ...updates } = req.body;
            const offers = await getOffers();
            const index = offers.findIndex(o => o.id === id);

            if (index > -1) {
                offers[index] = {
                    ...offers[index],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                if (await saveOffers(offers)) {
                    res.status(200).json(offers[index]);
                } else {
                    res.status(500).json({ error: 'Failed to update offer' });
                }
            } else {
                res.status(404).json({ error: 'Offer not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (method === 'DELETE') {
        try {
            const { id } = req.query;
            const offers = await getOffers();
            const filtered = offers.filter(o => o.id !== id);

            if (await saveOffers(filtered)) {
                res.status(200).json({ message: 'Offer deleted' });
            } else {
                res.status(500).json({ error: 'Failed to delete offer' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
