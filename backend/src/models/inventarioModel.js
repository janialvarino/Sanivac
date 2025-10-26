const db = require('../config/db');

const Inventario = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM inventario ORDER BY fecha_vencimiento ASC');
    return results;
  },

  getById: async (id) => {
    const [results] = await db.query('SELECT * FROM inventario WHERE id = ?', [id]);
    return results[0];
  },

  create: async (data) => {
    const q = `INSERT INTO inventario (nombre_vacuna, cantidad_total, cantidad_disponible, fecha_llegada, fecha_vencimiento, lote, observaciones)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(q, [
      data.nombre_vacuna,
      data.cantidad_total || 0,
      data.cantidad_disponible || data.cantidad_total || 0,
      data.fecha_llegada || null,
      data.fecha_vencimiento || null,
      data.lote || null,
      data.observaciones || null
    ]);
    return result;
  },

  update: async (id, data) => {
    const q = `UPDATE inventario SET nombre_vacuna=?, cantidad_total=?, cantidad_disponible=?, fecha_llegada=?, fecha_vencimiento=?, lote=?, observaciones=? WHERE id=?`;
    const [result] = await db.query(q, [
      data.nombre_vacuna, 
      data.cantidad_total, 
      data.cantidad_disponible, 
      data.fecha_llegada, 
      data.fecha_vencimiento, 
      data.lote, 
      data.observaciones, 
      id
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM inventario WHERE id = ?', [id]);
    return result;
  },

  // Reduce cantidad_disponible automáticamente cuando se aplica una dosis
  consumirDosis: async (nombre_vacuna, cantidad) => {
    try {
      // Busca lotes ordenados por fecha_vencimiento para consumir primero los que vencen antes
      const q = `SELECT id, cantidad_disponible FROM inventario 
                 WHERE nombre_vacuna = ? AND cantidad_disponible > 0 
                 ORDER BY fecha_vencimiento ASC`;
      
      const [rows] = await db.query(q, [nombre_vacuna]);
      
      let remaining = cantidad;
      
      for (const row of rows) {
        if (remaining <= 0) break;
        
        const take = Math.min(row.cantidad_disponible, remaining);
        remaining -= take;
        
        await db.query(
          'UPDATE inventario SET cantidad_disponible = GREATEST(cantidad_disponible - ?, 0) WHERE id = ?', 
          [take, row.id]
        );
      }
      
      return { success: true, consumed: cantidad - remaining };
    } catch (err) {
      throw err;
    }
  },

  // Resumen por vacuna
  getResumen: async () => {
    const q = `SELECT nombre_vacuna, 
               SUM(cantidad_disponible) AS disponibles, 
               SUM(cantidad_total) AS total 
               FROM inventario 
               GROUP BY nombre_vacuna`;
    const [results] = await db.query(q);
    return results;
  }
};

module.exports = Inventario;