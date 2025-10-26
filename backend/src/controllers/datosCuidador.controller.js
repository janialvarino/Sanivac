const DatosCuidador = require('../models/datosCuidador.model');

exports.listar = async (req, res) => {
  try {
    const data = await DatosCuidador.getAll();
    res.json(data);
  } catch (error) {
    console.error('❌ Error al listar cuidadores:', error);
    res.status(500).json({ error: 'Error al listar cuidadores' });
  }
};

exports.obtener = async (req, res) => {
  try {
    const data = await DatosCuidador.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'No encontrado' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error al obtener cuidador:', error);
    res.status(500).json({ error: 'Error al obtener cuidador' });
  }
};

exports.crear = async (req, res) => {
  try {
    const result = await DatosCuidador.create(req.body);
    res.status(201).json({ message: '✅ Cuidador registrado con éxito', id: result.insertId });
  } catch (error) {
    console.error('❌ Error al crear cuidador:', error);
    res.status(500).json({ error: 'Error al crear cuidador' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await DatosCuidador.update(req.params.id, req.body);
    res.json({ message: '✅ Actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar cuidador:', error);
    res.status(500).json({ error: 'Error al actualizar cuidador' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await DatosCuidador.remove(req.params.id);
    res.json({ message: '🗑️ Eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar cuidador:', error);
    res.status(500).json({ error: 'Error al eliminar cuidador' });
  }
};