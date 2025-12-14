const express = require('express');
const router = express.Router();
const { getTransactions, getFilterOptions } = require('../controllers/transactionController');

// Map the GET request to our controller
router.get('/', getTransactions);
router.get('/options', getFilterOptions);

module.exports = router;