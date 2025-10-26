const db = require('../config/db');

const CondicionUsuaria = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM condicion_usuaria');
    return results;
  },

  async getById(id) {
    const [results] = await db.query('SELECT * FROM condicion_usuaria WHERE id = ?', [id]);
    return results[0];
  },

  async getByUsuario(usuarioId) {
    const [results] = await db.query('SELECT * FROM condicion_usuaria WHERE usuario_id = ?', [usuarioId]);
    return results[0];
  },

  async create(data) {
    const query = `
      INSERT INTO condicion_usuaria 
      (usuario_id, condicion, gestante, fecha_ultima_menstruacion, semanas_gestacion, 
       fecha_probable_parto, embarazos_previos)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.usuario_id,
      data.condicion || null,
      data.gestante || 0,
      data.fecha_ultima_menstruacion || null,
      data.semanas_gestacion || null,
      data.fecha_probable_parto || null,
      data.embarazos_previos || null
    ]);
    return result;
  },

  async update(id, data) {
    const query = `
      UPDATE condicion_usuaria SET
        condicion=?, gestante=?, fecha_ultima_menstruacion=?, semanas_gestacion=?,
        fecha_probable_parto=?, embarazos_previos=?
      WHERE id=?
    `;
    const [result] = await db.query(query, [
      data.condicion || null,
      data.gestante || 0,
      data.fecha_ultima_menstruacion || null,
      data.semanas_gestacion || null,
      data.fecha_probable_parto || null,
      data.embarazos_previos || null,
      id
    ]);
    return result;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM condicion_usuaria WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = CondicionUsuaria;