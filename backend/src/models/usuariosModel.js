// src/models/usuariosModel.js
const db = require('../config/db');

const UsuariosModel = {
  // 🧾 Obtener todos los pacientes
  async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // ➕ Crear nuevo paciente
  async create(usuario) {
    const query = `
      INSERT INTO usuarios 
      (tipo_id, numero_id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, 
       fecha_nacimiento, sexo, direccion, telefono, eps) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      usuario.tipo_id || null,
      usuario.numero_id || null,
      usuario.primer_nombre || null,
      usuario.segundo_nombre || null,
      usuario.primer_apellido || null,
      usuario.segundo_apellido || null,
      this.formatearFecha(usuario.fecha_nacimiento),
      usuario.sexo || null,
      usuario.direccion || null,
      usuario.telefono || null,
      usuario.eps || null
    ];

    try {
      const [result] = await db.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // 🔍 Buscar paciente por ID
  async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // 🔍 Buscar por número de identificación
  async getByNumeroId(numeroId) {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE numero_id = ?', [numeroId]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // ✏️ Actualizar paciente
  async update(id, usuario) {
    const query = `
      UPDATE usuarios SET 
        tipo_id=?, numero_id=?, primer_nombre=?, segundo_nombre=?, 
        primer_apellido=?, segundo_apellido=?, fecha_nacimiento=?, 
        sexo=?, direccion=?, telefono=?, eps=? 
      WHERE id=?
    `;

    const values = [
      usuario.tipo_id,
      usuario.numero_id,
      usuario.primer_nombre,
      usuario.segundo_nombre,
      usuario.primer_apellido,
      usuario.segundo_apellido,
      this.formatearFecha(usuario.fecha_nacimiento),
      usuario.sexo,
      usuario.direccion,
      usuario.telefono,
      usuario.eps,
      id
    ];

    try {
      const [result] = await db.query(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // 🗑️ Eliminar paciente
  async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // 📅 Función auxiliar para formatear fechas
  formatearFecha(fecha) {
    if (!fecha) return null;
    
    // Si ya es una fecha válida en formato YYYY-MM-DD, retornarla
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }
    
    // Convertir formato ISO a YYYY-MM-DD
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
};

module.exports = UsuariosModel;