const db = require('../config/db');

const DatosMadre = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM datos_madre');
    return results;
  },

  async getById(id) {
    const [results] = await db.query('SELECT * FROM datos_madre WHERE id = ?', [id]);
    return results[0];
  },

  async getByUsuario(usuarioId) {
    const [results] = await db.query('SELECT * FROM datos_madre WHERE usuario_id = ?', [usuarioId]);
    return results[0];
  },

  async create(data) {
    const query = `
      INSERT INTO datos_madre 
      (usuario_id, tipo_identificacion, numero_identificacion, primer_nombre, segundo_nombre,
       primer_apellido, segundo_apellido, correo, telefono, celular, regimen_afiliacion,
       pertenencia_etnica, desplazado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.usuario_id,
      data.tipo_identificacion || null,
      data.numero_identificacion || null,
      data.primer_nombre || null,
      data.segundo_nombre || null,
      data.primer_apellido || null,
      data.segundo_apellido || null,
      data.correo || null,
      data.telefono || null,
      data.celular || null,
      data.regimen_afiliacion || null,
      data.pertenencia_etnica || null,
      data.desplazado || 0
    ]);
    return result;
  },

  async update(id, data) {
    const query = `
      UPDATE datos_madre SET
        tipo_identificacion=?, numero_identificacion=?, primer_nombre=?, segundo_nombre=?,
        primer_apellido=?, segundo_apellido=?, correo=?, telefono=?, celular=?,
        regimen_afiliacion=?, pertenencia_etnica=?, desplazado=?
      WHERE id=?
    `;
    const [result] = await db.query(query, [
      data.tipo_identificacion || null,
      data.numero_identificacion || null,
      data.primer_nombre || null,
      data.segundo_nombre || null,
      data.primer_apellido || null,
      data.segundo_apellido || null,
      data.correo || null,
      data.telefono || null,
      data.celular || null,
      data.regimen_afiliacion || null,
      data.pertenencia_etnica || null,
      data.desplazado || 0,
      id
    ]);
    return result;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM datos_madre WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = DatosMadre;