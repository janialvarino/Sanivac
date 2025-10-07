const db = require('../config/db');

const Vacuna = {
  getAll: (callback) => {
    db.query('SELECT * FROM vacunas', callback);
  },

  create: (data, callback) => {
    const { nombre, descripcion, dosis_disponibles, fecha_vencimiento } = data;
    db.query(
      'INSERT INTO vacunas (nombre, descripcion, dosis_disponibles, fecha_vencimiento) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, dosis_disponibles, fecha_vencimiento],
      callback
    );
  }
};

module.exports = Vacuna;