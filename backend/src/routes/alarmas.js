const express = require('express');
const router = express.Router();
const alarmasController = require('../controllers/alarmasController');

router.get('/', alarmasController.obtenerAlarmas);
router.post('/', alarmasController.registrarAlarma);

module.exports = router;
