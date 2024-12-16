const express = require('express');
const { simulatePayment, addPayment } = require('../controllers/paymentController');
const router = express.Router();

router.get('/pay', simulatePayment);
router.post('/add', addPayment);

module.exports = router;