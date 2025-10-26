// src/models/esquemaVacunacionModel.js
const db = require('../config/db');

const EsquemaVacunacion = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM esquema_vacunacion');
    return results;
  },

  getById: async (id) => {
    const [results] = await db.query('SELECT * FROM esquema_vacunacion WHERE id = ?', [id]);
    return results[0];
  },

  getByPaciente: async (idPaciente) => {
    const [results] = await db.query('SELECT * FROM esquema_vacunacion WHERE usuario_id = ?', [idPaciente]);
    return results;
  },

  create: async (data) => {
    const { usuario_id, tipo_carnet, observaciones } = data;
    const sql = `
      INSERT INTO esquema_vacunacion (usuario_id, tipo_carnet, observaciones, fecha_registro)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [usuario_id, tipo_carnet, observaciones]);
    return result;
  },

  update: async (id, data) => {
    const { tipo_carnet, observaciones } = data;
    const sql = `
      UPDATE esquema_vacunacion 
      SET tipo_carnet = ?, observaciones = ? 
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [tipo_carnet, observaciones, id]);
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM esquema_vacunacion WHERE id = ?', [id]);
    return result;
  }
};

module.exports = EsquemaVacunacion;