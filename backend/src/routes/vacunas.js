const express = require('express');
const router = express.Router();
const vacunasController = require('../controllers/vacunasController');

router.get('/', vacunasController.obtenerVacunas);
router.post('/', vacunasController.registrarVacuna);

module.exports = router;