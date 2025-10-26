// src/controllers/esquemaVacunacion.controller.js
const EsquemaVacunacion = require('../models/esquemaVacunacionModel');

exports.getAll = async (req, res) => {
  try {
    const esquemas = await EsquemaVacunacion.getAll();
    res.json(esquemas);
  } catch (err) {
    console.error('❌ Error al obtener esquemas:', err);
    res.status(500).json({ error: 'Error al obtener esquemas' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await EsquemaVacunacion.create(req.body);
    res.json({ 
      message: '✅ Esquema guardado correctamente',
      id: result.insertId 
    });
  } catch (err) {
    console.error('❌ Error al crear esquema:', err);
    res.status(500).json({ error: 'Error al guardar esquema' });
  }
};

exports.getById = async (req, res) => {
  try {
    const esquema = await EsquemaVacunacion.getById(req.params.id);
    
    if (!esquema) {
      return res.status(404).json({ error: 'Esquema no encontrado' });
    }
    
    res.json(esquema);
  } catch (err) {
    console.error('❌ Error al obtener esquema:', err);
    res.status(500).json({ error: 'Error al obtener esquema' });
  }
};

exports.getByPaciente = async (req, res) => {
  try {
    const esquemas = await EsquemaVacunacion.getByPaciente(req.params.id);
    res.json(esquemas);
  } catch (err) {
    console.error('❌ Error al obtener esquemas del paciente:', err);
    res.status(500).json({ error: 'Error al obtener esquemas del paciente' });
  }
};

exports.update = async (req, res) => {
  try {
    await EsquemaVacunacion.update(req.params.id, req.body);
    res.json({ message: '✅ Esquema actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar esquema:', err);
    res.status(500).json({ error: 'Error al actualizar esquema' });
  }
};

exports.delete = async (req, res) => {
  try {
    await EsquemaVacunacion.delete(req.params.id);
    res.json({ message: '🗑️ Esquema eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar esquema:', err);
    res.status(500).json({ error: 'Error al eliminar esquema' });
  }
};