const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qr.controller');

router.get('/generar', qrController.generarQR);

module.exports = router;
