const Alarma = require('../models/alarmasModel');

exports.listar = async (req, res) => {
  try {
    const results = await Alarma.getAll();
    res.json(results);
  } catch (err) {
    console.error('❌ Error al listar alarmas:', err);
    res.status(500).json({ error: 'Error al listar alarmas' });
  }
};

exports.crear = async (req, res) => {
  try {
    const id = await Alarma.create(req.body);
    res.json({ id });
  } catch (err) {
    console.error('❌ Error al crear alarma:', err);
    res.status(500).json({ error: 'Error al crear alarma' });
  }
};

exports.marcarAtendida = async (req, res) => {
  try {
    await Alarma.markAttended(req.params.id);
    res.json({ message: 'Atendida' });
  } catch (err) {
    console.error('❌ Error al marcar atendida:', err);
    res.status(500).json({ error: 'Error al marcar' });
  }
};

exports.pendientesCount = async (req, res) => {
  try {
    const result = await Alarma.getPendingCount();
    res.json(result);
  } catch (err) {
    console.error('❌ Error al obtener pendientes:', err);
    res.status(500).json({ error: 'Error' });
  }
};