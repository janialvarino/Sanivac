const db = require('../config/db');

const Inventario = {
  getAll: (callback) => {
    db.query(
      'SELECT i.id, v.nombre AS vacuna, i.cantidad, i.fecha, i.tipo_movimiento FROM inventario i JOIN vacunas v ON i.vacuna_id = v.id',
      callback
    );
  },

  create: (data, callback) => {
    const { vacuna_id, cantidad, fecha, tipo_movimiento } = data;
    db.query(
      'INSERT INTO inventario (vacuna_id, cantidad, fecha, tipo_movimiento) VALUES (?, ?, ?, ?)',
      [vacuna_id, cantidad, fecha, tipo_movimiento],
      callback
    );
  }
};

module.exports = Inventario;
