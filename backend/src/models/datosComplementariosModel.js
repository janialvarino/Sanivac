// src/models/datosComplementariosModel.js
const db = require('../config/db');

const DatosComplementarios = {
  async getByUsuario(usuarioId) {
    const [rows] = await db.query('SELECT * FROM datos_complementarios WHERE usuario_id = ?', [usuarioId]);
    return rows[0];
  },

  async create(data) {
    const query = `
      INSERT INTO datos_complementarios 
      (usuario_id, sexo, genero, orientacion_sexual, edad_gestacional, pais_nacimiento,
       estatus_migratorio, lugar_parto, regimen_afiliacion, aseguradora, pertenencia_etnica,
       desplazado, discapacitado, fallecido, victima_conflicto, estudia_actualmente,
       pais_residencia, departamento_residencia, municipio_residencia, comuna_localidad,
       area, direccion, telefono, celular, email, autoriza_llamadas, autoriza_correo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      data.usuario_id,
      data.sexo,
      data.genero,
      data.orientacion_sexual,
      data.edad_gestacional,
      data.pais_nacimiento,
      data.estatus_migratorio,
      data.lugar_parto,
      data.regimen_afiliacion,
      data.aseguradora,
      data.pertenencia_etnica,
      data.desplazado || 0,
      data.discapacitado || 0,
      data.fallecido || 0,
      data.victima_conflicto || 0,
      data.estudia_actualmente || 0,
      data.pais_residencia,
      data.departamento_residencia,
      data.municipio_residencia,
      data.comuna_localidad,
      data.area,
      data.direccion,
      data.telefono,
      data.celular,
      data.email,
      data.autoriza_llamadas || 0,
      data.autoriza_correo || 0
    ]);
    return result;
  },

  async update(id, data) {
    const query = `
      UPDATE datos_complementarios SET
        sexo=?, genero=?, orientacion_sexual=?, edad_gestacional=?, pais_nacimiento=?,
        estatus_migratorio=?, lugar_parto=?, regimen_afiliacion=?, aseguradora=?,
        pertenencia_etnica=?, desplazado=?, discapacitado=?, fallecido=?,
        victima_conflicto=?, estudia_actualmente=?, pais_residencia=?,
        departamento_residencia=?, municipio_residencia=?, comuna_localidad=?,
        area=?, direccion=?, telefono=?, celular=?, email=?, autoriza_llamadas=?,
        autoriza_correo=?
      WHERE id=?
    `;
    const [result] = await db.query(query, [
      data.sexo,
      data.genero,
      data.orientacion_sexual,
      data.edad_gestacional,
      data.pais_nacimiento,
      data.estatus_migratorio,
      data.lugar_parto,
      data.regimen_afiliacion,
      data.aseguradora,
      data.pertenencia_etnica,
      data.desplazado || 0,
      data.discapacitado || 0,
      data.fallecido || 0,
      data.victima_conflicto || 0,
      data.estudia_actualmente || 0,
      data.pais_residencia,
      data.departamento_residencia,
      data.municipio_residencia,
      data.comuna_localidad,
      data.area,
      data.direccion,
      data.telefono,
      data.celular,
      data.email,
      data.autoriza_llamadas || 0,
      data.autoriza_correo || 0,
      id
    ]);
    return result;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM datos_complementarios WHERE id = ?', [id]);
    return result;
  }
};

module.exports = DatosComplementarios;