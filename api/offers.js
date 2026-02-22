import { getOffers, saveOffers } from './lib/storage';

export default async function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        try {
            const offers = getOffers();
            res.status(200).json(offers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch offers' });
        }
    } else if (method === 'POST') {
        try {
            const newOffer = {
                ...req.body,
                id: `OFF-${Date.now().toString(36).toUpperCase()}`,
                createdAt: new Date().toISOString()
            };
            const offers = getOffers();
            offers.push(newOffer);
            saveOffers(offers);
            res.status(201).json(newOffer);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create offer' });
        }
    } else if (method === 'PUT') {
        try {
            const updatedOffer = req.body;
            const offers = getOffers();
            const index = offers.findIndex(o => o.id === updatedOffer.id);
            if (index !== -1) {
                offers[index] = { ...offers[index], ...updatedOffer };
                saveOffers(offers);
                res.status(200).json(offers[index]);
            } else {
                res.status(404).json({ error: 'Offer not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update offer' });
        }
    } else if (method === 'DELETE') {
        try {
            const { id } = req.query;
            const offers = getOffers();
            const filteredOffers = offers.filter(o => o.id !== id);
            saveOffers(filteredOffers);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete offer' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
