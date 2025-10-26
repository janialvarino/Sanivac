const Inventario = require('../models/inventarioModel');

exports.listar = async (req, res) => {
  try {
    const results = await Inventario.getAll();
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener inventario:', err);
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
};

exports.resumen = async (req, res) => {
  try {
    const results = await Inventario.getResumen();
    res.json(results);
  } catch (err) {
    console.error('❌ Error en resumen:', err);
    res.status(500).json({ error: 'Error en resumen' });
  }
};

exports.crear = async (req, res) => {
  try {
    const result = await Inventario.create(req.body);
    res.json({ id: result.insertId, mensaje: '✅ Inventario creado' });
  } catch (err) {
    console.error('❌ Error al crear inventario:', err);
    res.status(500).json({ error: 'Error al crear inventario' });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await Inventario.update(req.params.id, req.body);
    res.json({ mensaje: '✅ Inventario actualizado' });
  } catch (err) {
    console.error('❌ Error al actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await Inventario.delete(req.params.id);
    res.json({ mensaje: '🗑️ Inventario eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar' });
  }
};