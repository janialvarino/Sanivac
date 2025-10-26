// src/controllers/usuariosController.js
const UsuariosModel = require('../models/usuariosModel');

const UsuariosController = {
  // 📋 Obtener todos
  getAll: async (req, res) => {
    try {
      const usuarios = await UsuariosModel.getAll();
      res.json(usuarios);
    } catch (err) {
      console.error('❌ Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  // 🔍 Obtener por ID
  getById: async (req, res) => {
    try {
      const usuario = await UsuariosModel.getById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (err) {
      console.error('❌ Error al obtener usuario:', err);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  // 🔍 Buscar por número de identificación
  buscarPorIdentificacion: async (req, res) => {
    try {
      const usuario = await UsuariosModel.getByNumeroId(req.params.numeroId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (err) {
      console.error('❌ Error al buscar usuario:', err);
      res.status(500).json({ error: 'Error al buscar usuario' });
    }
  },

  // ➕ Crear
  create: async (req, res) => {
    try {
      const result = await UsuariosModel.create(req.body);
      res.json({ mensaje: '✅ Usuario creado', id: result.insertId });
    } catch (err) {
      console.error('❌ Error al crear usuario:', err);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  // ✏️ Actualizar
  update: async (req, res) => {
    try {
      await UsuariosModel.update(req.params.id, req.body);
      res.json({ mensaje: '✅ Usuario actualizado' });
    } catch (err) {
      console.error('❌ Error al actualizar usuario:', err);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  },

  // 🗑️ Eliminar
  delete: async (req, res) => {
    try {
      await UsuariosModel.delete(req.params.id);
      res.json({ mensaje: '🗑️ Usuario eliminado' });
    } catch (err) {
      console.error('❌ Error al eliminar usuario:', err);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
};

module.exports = UsuariosController;