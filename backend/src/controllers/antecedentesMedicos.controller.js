const AntecedentesMedicos = require('../models/antecedentesMedicosModel');

exports.listar = async (req, res) => {
  try {
    const data = await AntecedentesMedicos.getAll();
    res.json(data);
  } catch (error) {
    console.error('❌ Error al listar antecedentes médicos:', error);
    res.status(500).json({ error: 'Error al listar antecedentes médicos' });
  }
};

exports.obtener = async (req, res) => {
  try {
    const data = await AntecedentesMedicos.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'No encontrado' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error al obtener antecedente médico:', error);
    res.status(500).json({ error: 'Error al obtener antecedente médico' });
  }
};

exports.crear = async (req, res) => {
  try {
    const result = await AntecedentesMedicos.create(req.body);
    res.status(201).json({ message: '✅ Antecedente médico creado con éxito', id: result.insertId });
  } catch (error) {
    console.error('❌ Error al crear antecedente médico:', error);
    res.status(500).json({ error: 'Error al crear antecedente médico' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const result = await AntecedentesMedicos.update(req.params.id, req.body);
    res.json({ message: '✅ Actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar antecedente médico:', error);
    res.status(500).json({ error: 'Error al actualizar antecedente médico' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const result = await AntecedentesMedicos.remove(req.params.id);
    res.json({ message: '🗑️ Eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar antecedente médico:', error);
    res.status(500).json({ error: 'Error al eliminar antecedente médico' });
  }
};