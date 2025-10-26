const DatosComplementarios = require('../models/datosComplementariosModel');

const DatosComplementariosController = {
  // ✅ Listar todos
  async listar(req, res) {
    try {
      const [results] = await require('../config/db').query('SELECT * FROM datos_complementarios');
      res.json(results);
    } catch (err) {
      console.error('❌ Error al listar datos complementarios:', err);
      res.status(500).json({ error: 'Error al listar datos complementarios' });
    }
  },

  // ✅ Obtener por ID
  async obtener(req, res) {
    try {
      const [results] = await require('../config/db').query(
        'SELECT * FROM datos_complementarios WHERE id = ?',
        [req.params.id]
      );
      if (results.length === 0) {
        return res.status(404).json({ message: 'No encontrado' });
      }
      res.json(results[0]);
    } catch (err) {
      console.error('❌ Error al obtener datos complementarios:', err);
      res.status(500).json({ error: 'Error al obtener datos complementarios' });
    }
  },

  // ✅ Obtener por usuario
  async getByUsuario(req, res) {
    try {
      const data = await DatosComplementarios.getByUsuario(req.params.usuarioId);
      res.json(data || {});
    } catch (err) {
      console.error('❌ Error al obtener datos complementarios:', err);
      res.status(500).json({ error: 'Error al obtener datos complementarios' });
    }
  },

  // ✅ Crear
  async crear(req, res) {
    try {
      const result = await DatosComplementarios.create(req.body);
      res.json({ mensaje: '✅ Datos complementarios creados', id: result.insertId });
    } catch (err) {
      console.error('❌ Error al crear datos complementarios:', err);
      res.status(500).json({ error: 'Error al crear datos complementarios' });
    }
  },

  // ✅ Actualizar
  async actualizar(req, res) {
    try {
      await DatosComplementarios.update(req.params.id, req.body);
      res.json({ mensaje: '✅ Datos complementarios actualizados' });
    } catch (err) {
      console.error('❌ Error al actualizar datos complementarios:', err);
      res.status(500).json({ error: 'Error al actualizar datos complementarios' });
    }
  },

  // ✅ Eliminar
  async eliminar(req, res) {
    try {
      await DatosComplementarios.delete(req.params.id);
      res.json({ mensaje: '🗑️ Datos complementarios eliminados' });
    } catch (err) {
      console.error('❌ Error al eliminar datos complementarios:', err);
      res.status(500).json({ error: 'Error al eliminar datos complementarios' });
    }
  }
};

module.exports = DatosComplementariosController;