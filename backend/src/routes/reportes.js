const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// ⚠️ sin paréntesis aquí, solo referencia
router.get('/vacunas', reportesController.reporteVacunas);
router.get('/inventario', reportesController.reporteInventario);
router.get('/alarmas', reportesController.reporteAlarmas);

module.exports = router;

