// src/routes/vacunasDetalle.js
const express = require('express');
const router = express.Router();
const vacunasDetalleController = require('../controllers/vacunasDetalle.controller');

// 🔹 Ruta: obtener todo el detalle de un paciente (vacunas + esquema)
router.get('/:id', vacunasDetalleController.getDetallePorPaciente);

module.exports = router;
