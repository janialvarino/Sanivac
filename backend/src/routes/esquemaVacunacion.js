const express = require('express');
const router = express.Router();
const esquemaController = require('../controllers/esquemaVacunacion.controller');

// IMPORTANTE: ruta /paciente/:id antes de /:id para evitar que "paciente" sea interpretado como id

// Obtener esquemas por paciente
router.get('/paciente/:id', esquemaController.getByPaciente);

// Obtener todos los esquemas
router.get('/', esquemaController.getAll);

// Obtener esquema por ID
router.get('/:id', esquemaController.getById);

// Crear nuevo esquema
router.post('/', esquemaController.create);

// Actualizar esquema
router.put('/:id', esquemaController.update);

// Eliminar esquema
router.delete('/:id', esquemaController.delete);

module.exports = router;
