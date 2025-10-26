const db = require('../config/db');

const DatosCuidador = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM datos_cuidador');
    return results;
  },

  async getById(id) {
    const [results] = await db.query('SELECT * FROM datos_cuidador WHERE id = ?', [id]);
    return results[0];
  },

  async getByUsuario(usuarioId) {
    const [results] = await db.query('SELECT * FROM datos_cuidador WHERE usuario_id = ?', [usuarioId]);
    return results;
  },

  async create(data) {
    const query = `
      INSERT INTO datos_cuidador 
      (usuario_id, tipo_identificacion, numero_identificacion, primer_nombre, segundo_nombre,
       primer_apellido, segundo_apellido, parentesco, correo, telefono, celular)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.usuario_id,
      data.tipo_identificacion || null,
      data.numero_identificacion || null,
      data.primer_nombre || null,
      data.segundo_nombre || null,
      data.primer_apellido || null,
      data.segundo_apellido || null,
      data.parentesco || null,
      data.correo || null,
      data.telefono || null,
      data.celular || null
    ]);
    return result;
  },

  async update(id, data) {
    const query = `
      UPDATE datos_cuidador SET
        tipo_identificacion=?, numero_identificacion=?, primer_nombre=?, segundo_nombre=?,
        primer_apellido=?, segundo_apellido=?, parentesco=?, correo=?, telefono=?, celular=?
      WHERE id=?
    `;
    const [result] = await db.query(query, [
      data.tipo_identificacion || null,
      data.numero_identificacion || null,
      data.primer_nombre || null,
      data.segundo_nombre || null,
      data.primer_apellido || null,
      data.segundo_apellido || null,
      data.parentesco || null,
      data.correo || null,
      data.telefono || null,
      data.celular || null,
      id
    ]);
    return result;
  },

  async remove(id) {
    const [result] = await db.query('DELETE FROM datos_cuidador WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = DatosCuidador;