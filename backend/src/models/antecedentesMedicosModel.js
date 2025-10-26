const db = require('../config/db');

const AntecedentesMedicos = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM antecedentes_medicos');
    return results;
  },

  async getById(id) {
    const [results] = await db.query('SELECT * FROM antecedentes_medicos WHERE id = ?', [id]);
    return results[0];
  },

  async getByUsuario(usuarioId) {
    const [results] = await db.query('SELECT * FROM antecedentes_medicos WHERE usuario_id = ?', [usuarioId]);
    return results;
  },

  async create(data) {
    const query = `
      INSERT INTO antecedentes_medicos 
      (usuario_id, evento_contraindicacion, descripcion_evento, reaccion_biologicos, 
       descripcion_reaccion, tipo, descripcion, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.usuario_id,
      data.evento_contraindicacion || 0,
      data.descripcion_evento || null,
      data.reaccion_biologicos || 0,
      data.descripcion_reaccion || null,
      data.tipo || null,
      data.descripcion || null,
      data.observaciones || null
    ]);
    return result;
  },

  async update(id, data) {
    const query = `
      UPDATE antecedentes_medicos SET
        evento_contraindicacion=?, descripcion_evento=?, reaccion_biologicos=?,
        descripcion_reaccion=?, tipo=?, descripcion=?, observaciones=?
      WHERE id=?
    `;
    const [result] = await db.query(query, [
      data.evento_contraindicacion || 0,
      data.descripcion_evento || null,
      data.reaccion_biologicos || 0,
      data.descripcion_reaccion || null,
      data.tipo || null,
      data.descripcion || null,
      data.observaciones || null,
      id
    ]);
    return result;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM antecedentes_medicos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = AntecedentesMedicos;