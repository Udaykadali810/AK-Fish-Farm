const { Offer } = require('../db');

exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.findAll();
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createOffer = async (req, res) => {
    try {
        const { title, code, discount } = req.body;
        const newOffer = await Offer.create({ title, code, discount });
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        await Offer.destroy({ where: { id } });
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
