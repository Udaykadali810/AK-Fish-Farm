const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Public route to get all offers
router.get('/', offerController.getAllOffers);

module.exports = router;
