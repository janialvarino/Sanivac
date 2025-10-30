// src/models/usuariosModel.js
const pool = require('../config/db');

const UsuariosModel = {
  // 🧾 Obtener todos los pacientes
  async getAll() {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para getAll');
      
      const [rows] = await connection.query('SELECT * FROM usuarios ORDER BY id DESC');
      
      console.log(`✅ Obtenidos ${rows.length} usuarios`);
      return rows;
      
    } catch (error) {
      console.error('❌ Error en getAll:', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (getAll)');
      }
    }
  },

  // ➕ Crear nuevo paciente
  async create(usuario) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para create');
      
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

      const [result] = await connection.query(query, values);
      
      console.log('✅ Usuario creado con ID:', result.insertId);
      return result;
      
    } catch (error) {
      console.error('❌ Error en create:', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (create)');
      }
    }
  },

  // 🔍 Buscar paciente por ID
  async getById(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para getById');
      
      const [rows] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      
      console.log(`✅ Usuario ${id}:`, rows.length > 0 ? 'encontrado' : 'no encontrado');
      return rows[0] || null;
      
    } catch (error) {
      console.error('❌ Error en getById:', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (getById)');
      }
    }
  },

  // 🔍 Buscar por número de identificación
  async getByNumeroId(numeroId) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para getByNumeroId');
      
      const [rows] = await connection.query('SELECT * FROM usuarios WHERE numero_id = ?', [numeroId]);
      
      console.log(`✅ Búsqueda por número ${numeroId}:`, rows.length > 0 ? 'encontrado' : 'no encontrado');
      return rows[0] || null;
      
    } catch (error) {
      console.error('❌ Error en getByNumeroId:', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (getByNumeroId)');
      }
    }
  },

  // ✏️ Actualizar paciente
  async update(id, usuario) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para update');
      
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

      const [result] = await connection.query(query, values);
      
      console.log(`✅ Usuario ${id} actualizado, filas afectadas:`, result.affectedRows);
      return result;
      
    } catch (error) {
      console.error('❌ Error en update:', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (update)');
      }
    }
  },

  // 🗑️ Eliminar paciente
  async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para delete');
      
      const [result] = await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
      
      console.log(`✅ Usuario ${id} eliminado, filas afectadas:`, result.affectedRows);
      return result;
      
    } catch (error) {
      console.error('❌ Error en delete:', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (delete)');
      }
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
  },

  // 📅 Calcular edad desde fecha de nacimiento
  calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 0;
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }
};

module.exports = UsuariosModel;