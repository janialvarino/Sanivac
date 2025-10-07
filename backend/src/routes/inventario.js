const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.obtenerInventario);
router.post('/', inventarioController.registrarMovimiento);

module.exports = router;
