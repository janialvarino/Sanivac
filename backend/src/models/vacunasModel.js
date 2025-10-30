// src/models/vacunasModel.js
const pool = require('../config/db');

const VacunasModel = {
  
  async getAll() {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para getAll (vacunas)');
      
      // ✅ JOIN con usuarios para obtener nombre e identificación
      const query = `
        SELECT 
          v.*,
          CONCAT(u.primer_nombre, ' ', u.primer_apellido) as nombre_paciente,
          u.numero_id as identificacion_paciente
        FROM vacunas v
        LEFT JOIN usuarios u ON v.usuario_id = u.id
        ORDER BY v.fecha_aplicacion DESC
      `;
      
      const [rows] = await connection.query(query);
      
      console.log(`✅ Obtenidas ${rows.length} vacunas`);
      return rows;
      
    } catch (error) {
      console.error('❌ Error en getAll (vacunas):', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (getAll vacunas)');
      }
    }
  },

  async getById(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para getById (vacunas)');
      
      const [rows] = await connection.query('SELECT * FROM vacunas WHERE id = ?', [id]);
      
      console.log(`✅ Vacuna ${id}:`, rows.length > 0 ? 'encontrada' : 'no encontrada');
      return rows[0] || null;
      
    } catch (error) {
      console.error('❌ Error en getById (vacunas):', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (getById vacunas)');
      }
    }
  },

  async getByUsuario(usuarioId) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para getByUsuario (vacunas)');
      
      const [rows] = await connection.query(
        'SELECT * FROM vacunas WHERE usuario_id = ? ORDER BY fecha_aplicacion DESC',
        [usuarioId]
      );
      
      console.log(`✅ Vacunas del usuario ${usuarioId}:`, rows.length);
      return rows;
      
    } catch (error) {
      console.error('❌ Error en getByUsuario (vacunas):', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (getByUsuario vacunas)');
      }
    }
  },

  async create(vacuna) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para create (vacunas)');
      
      const query = `
        INSERT INTO vacunas 
        (usuario_id, nombre_vacuna, laboratorio, dosis, lote, diluyente, 
         lote_diluyente, lote_jeringa, tipo_jeringa, via_administracion, 
         sitio_aplicacion, fecha_aplicacion, fecha_proxima_dosis, responsable, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        vacuna.usuario_id,
        vacuna.nombre_vacuna,
        vacuna.laboratorio || null,
        vacuna.dosis,
        vacuna.lote || null,
        vacuna.diluyente || null,
        vacuna.lote_diluyente || null,
        vacuna.lote_jeringa || null,
        vacuna.tipo_jeringa || null,
        vacuna.via_administracion || null,
        vacuna.sitio_aplicacion || null,
        vacuna.fecha_aplicacion,
        vacuna.fecha_proxima_dosis || null,
        vacuna.responsable || null,
        vacuna.observaciones || null
      ];

      const [result] = await connection.query(query, values);
      
      console.log('✅ Vacuna creada con ID:', result.insertId);
      return result;
      
    } catch (error) {
      console.error('❌ Error en create (vacunas):', error.message);
      console.error('❌ SQL:', error.sql);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (create vacunas)');
      }
    }
  },

  async update(id, vacuna) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para update (vacunas)');
      
      const query = `
        UPDATE vacunas SET
          nombre_vacuna=?, laboratorio=?, dosis=?, lote=?, diluyente=?,
          lote_diluyente=?, lote_jeringa=?, tipo_jeringa=?, via_administracion=?,
          sitio_aplicacion=?, fecha_aplicacion=?, fecha_proxima_dosis=?,
          responsable=?, observaciones=?
        WHERE id=?
      `;

      const values = [
        vacuna.nombre_vacuna,
        vacuna.laboratorio || null,
        vacuna.dosis,
        vacuna.lote || null,
        vacuna.diluyente || null,
        vacuna.lote_diluyente || null,
        vacuna.lote_jeringa || null,
        vacuna.tipo_jeringa || null,
        vacuna.via_administracion || null,
        vacuna.sitio_aplicacion || null,
        vacuna.fecha_aplicacion,
        vacuna.fecha_proxima_dosis || null,
        vacuna.responsable || null,
        vacuna.observaciones || null,
        id
      ];

      const [result] = await connection.query(query, values);
      
      console.log(`✅ Vacuna ${id} actualizada, filas afectadas:`, result.affectedRows);
      return result;
      
    } catch (error) {
      console.error('❌ Error en update (vacunas):', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (update vacunas)');
      }
    }
  },

  async delete(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      console.log('🔒 Conexión adquirida para delete (vacunas)');
      
      const [result] = await connection.query('DELETE FROM vacunas WHERE id = ?', [id]);
      
      console.log(`✅ Vacuna ${id} eliminada, filas afectadas:`, result.affectedRows);
      return result;
      
    } catch (error) {
      console.error('❌ Error en delete (vacunas):', error.message);
      throw error;
      
    } finally {
      if (connection) {
        connection.release();
        console.log('🔓 Conexión liberada (delete vacunas)');
      }
    }
  }
};

module.exports = VacunasModel;