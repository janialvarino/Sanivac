const db = require('../config/db');

const Vacuna = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM vacunas ORDER BY fecha_aplicacion DESC');
    return results;
  },

  async getById(id) {
    const [results] = await db.query('SELECT * FROM vacunas WHERE id = ?', [id]);
    return results[0];
  },

  async create(data) {
    const query = `
      INSERT INTO vacunas 
      (usuario_id, nombre_vacuna, laboratorio, dosis, lote, lote_diluyente, lote_jeringa, 
       tipo_jeringa, via_administracion, sitio_aplicacion, fecha_aplicacion, 
       fecha_proxima_dosis, responsable, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.usuario_id,
      data.nombre_vacuna,
      data.laboratorio || null,
      data.dosis,
      data.lote,
      data.lote_diluyente || null,
      data.lote_jeringa || null,
      data.tipo_jeringa || null,
      data.via_administracion,
      data.sitio_aplicacion,
      data.fecha_aplicacion,
      data.fecha_proxima_dosis || null,
      data.responsable,
      data.observaciones || null
    ]);
    return result;
  },

  async update(id, data) {
    const query = `
      UPDATE vacunas SET
        nombre_vacuna=?, laboratorio=?, dosis=?, lote=?, lote_diluyente=?, 
        lote_jeringa=?, tipo_jeringa=?, via_administracion=?, sitio_aplicacion=?,
        fecha_aplicacion=?, fecha_proxima_dosis=?, responsable=?, observaciones=?
      WHERE id=?
    `;
    const [result] = await db.query(query, [
      data.nombre_vacuna,
      data.laboratorio || null,
      data.dosis,
      data.lote,
      data.lote_diluyente || null,
      data.lote_jeringa || null,
      data.tipo_jeringa || null,
      data.via_administracion,
      data.sitio_aplicacion,
      data.fecha_aplicacion,
      data.fecha_proxima_dosis || null,
      data.responsable,
      data.observaciones || null,
      id
    ]);
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM vacunas WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Vacuna;