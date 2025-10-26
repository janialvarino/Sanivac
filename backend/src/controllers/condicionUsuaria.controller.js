const CondicionUsuaria = require('../models/condicionUsuaria.model');

exports.listar = async (req, res) => {
  try {
    const data = await CondicionUsuaria.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar condiciones de usuarias' });
  }
};

exports.obtener = async (req, res) => {
  try {
    const data = await CondicionUsuaria.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'No encontrado' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener condición' });
  }
};

exports.crear = async (req, res) => {
  try {
    const result = await CondicionUsuaria.create(req.body);
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear condición usuaria' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await CondicionUsuaria.update(req.params.id, req.body);
    res.json({ message: 'Actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar condición usuaria' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await CondicionUsuaria.remove(req.params.id);
    res.json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar condición usuaria' });
  }
};