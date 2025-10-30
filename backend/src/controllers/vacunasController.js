// src/controllers/vacunasController.js
const VacunasModel = require('../models/vacunasModel');

const VacunasController = {
  
  getAll: async (req, res) => {
    try {
      const vacunas = await VacunasModel.getAll();
      res.json(vacunas);
    } catch (err) {
      console.error('❌ Error al obtener vacunas:', err);
      res.status(500).json({ error: 'Error al obtener vacunas' });
    }
  },

  getById: async (req, res) => {
    try {
      const vacuna = await VacunasModel.getById(req.params.id);
      if (!vacuna) {
        return res.status(404).json({ error: 'Vacuna no encontrada' });
      }
      res.json(vacuna);
    } catch (err) {
      console.error('❌ Error al obtener vacuna:', err);
      res.status(500).json({ error: 'Error al obtener vacuna' });
    }
  },

  getByUsuario: async (req, res) => {
    try {
      const vacunas = await VacunasModel.getByUsuario(req.params.usuarioId);
      res.json(vacunas);
    } catch (err) {
      console.error('❌ Error al obtener vacunas del usuario:', err);
      res.status(500).json({ error: 'Error al obtener vacunas del usuario' });
    }
  },

  create: async (req, res) => {
    try {
      console.log('📝 Datos recibidos para crear vacuna:', req.body);
      const result = await VacunasModel.create(req.body);
      res.json({ mensaje: '✅ Vacuna registrada', id: result.insertId });
    } catch (err) {
      console.error('❌ Error al crear vacuna:', err);
      res.status(500).json({ error: 'Error al crear vacuna', detalle: err.message });
    }
  },

  update: async (req, res) => {
    try {
      await VacunasModel.update(req.params.id, req.body);
      res.json({ mensaje: '✅ Vacuna actualizada' });
    } catch (err) {
      console.error('❌ Error al actualizar vacuna:', err);
      res.status(500).json({ error: 'Error al actualizar vacuna' });
    }
  },

  delete: async (req, res) => {
    try {
      await VacunasModel.delete(req.params.id);
      res.json({ mensaje: '🗑️ Vacuna eliminada' });
    } catch (err) {
      console.error('❌ Error al eliminar vacuna:', err);
      res.status(500).json({ error: 'Error al eliminar vacuna' });
    }
  }
};

module.exports = VacunasController;