const express = require('express');
const router = express.Router();
const { Inquiry } = require('../db');

// Create a new inquiry
router.post('/', async (req, res) => {
    try {
        const { name, contactNumber, city, fishEnquiry } = req.body;
        const inquiry = await Inquiry.create({
            name,
            contactNumber,
            city,
            fishEnquiry
        });
        res.status(201).json(inquiry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all inquiries (Admin only)
router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inquiry status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const inquiry = await Inquiry.findByPk(id);
        if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

        inquiry.status = status;
        await inquiry.save();
        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
