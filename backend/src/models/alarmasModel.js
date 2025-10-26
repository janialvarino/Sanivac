const db = require('../config/db');

const Alarma = {
  async getAll() {
    const [results] = await db.query(
      'SELECT * FROM alarmas ORDER BY creado_en DESC'
    );
    return results;
  },

  async getPendingCount() {
    const [results] = await db.query(
      "SELECT COUNT(*) AS pendientes FROM alarmas WHERE estado='pendiente'"
    );
    return results[0];
  },

  async create(data) {
    const query = `
      INSERT INTO alarmas (vacuna_id, usuario_id, telefono, fecha_vacuna, dosis, mensaje, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.vacuna_id || null,
      data.usuario_id || null,
      data.telefono || null,
      data.fecha_vacuna || null,
      data.dosis || null,
      data.mensaje || null,
      data.estado || 'pendiente'
    ]);
    return result.insertId;
  },

  async markAttended(id) {
    const [result] = await db.query(
      "UPDATE alarmas SET estado = 'atendida' WHERE id = ?",
      [id]
    );
    return result;
  }
};

module.exports = Alarma;