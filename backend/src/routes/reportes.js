// backend/src/routes/reportes.js
const express = require('express');
const router = express.Router();
const reportesModel = require('../models/reportesModel');
const reportesController = require('../controllers/reportesController');

// 📊 Reportes en formato JSON
router.get('/vacunas', reportesModel.reporteVacunas);
router.get('/inventario', reportesModel.reporteInventario);
router.get('/alarmas', reportesModel.reporteAlarmas);
router.get('/vacunacion-completo', reportesModel.reporteVacunacionCompleto);

// 📥 Exportar a Excel
router.get('/exportar/todo', reportesController.exportarTodo);
router.get('/exportar/vacunas', reportesController.exportarVacunas);
router.get('/exportar/inventario', reportesController.exportarInventario);

module.exports = router;