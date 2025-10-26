const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuariosController');

router.get('/', UsuariosController.getAll);
router.get('/buscar/:numeroId', UsuariosController.buscarPorIdentificacion);
router.get('/:id', UsuariosController.getById);
router.post('/', UsuariosController.create);
router.put('/:id', UsuariosController.update);
router.delete('/:id', UsuariosController.delete);

module.exports = router;

