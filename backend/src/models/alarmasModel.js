const db = require('../config/db');

const Alarma = {
  getAll: (callback) => {
    db.query('SELECT * FROM alarmas', callback);
  },

  create: (data, callback) => {
    const { mensaje, tipo, fecha, vacuna_id } = data;
    db.query(
      'INSERT INTO alarmas (mensaje, tipo, fecha, vacuna_id) VALUES (?, ?, ?, ?)',
      [mensaje, tipo, fecha, vacuna_id],
      callback
    );
  }
};

module.exports = Alarma;
