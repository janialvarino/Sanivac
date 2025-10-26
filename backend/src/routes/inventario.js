const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/', inventarioController.listar);
router.get('/resumen', inventarioController.resumen);
router.post('/', inventarioController.crear);
router.put('/:id', inventarioController.actualizar);
router.delete('/:id', inventarioController.eliminar);

module.exports = router;
