// src/routes/vacunas.js
const express = require('express');
const router = express.Router();
const VacunasController = require('../controllers/vacunasController');

router.get('/', VacunasController.getAll);
router.get('/usuario/:usuarioId', VacunasController.getByUsuario); // ✅ IMPORTANTE: Esta ruta ANTES de /:id
router.get('/:id', VacunasController.getById);
router.post('/', VacunasController.create);
router.put('/:id', VacunasController.update);
router.delete('/:id', VacunasController.delete);

module.exports = router;