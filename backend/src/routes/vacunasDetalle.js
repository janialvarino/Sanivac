const express = require('express');
const router = express.Router();
const vacunasDetalleController = require('../controllers/vacunasDetalle.controller');

// ✅ Ruta para obtener esquema + vacunas de un paciente
router.get('/:id', vacunasDetalleController.getDetallePorPaciente);

module.exports = router;
