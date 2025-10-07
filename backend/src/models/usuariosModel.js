const db = require('../config/db');

const UsuariosModel = {
  // Obtener todos los usuarios
  getAll: (callback) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Crear usuario
  create: (usuario, callback) => {
    const query = `
      INSERT INTO usuarios 
      (tipo_id, numero_id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, 
       fecha_nacimiento, sexo, direccion, telefono, eps, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [
      usuario.tipo_id,
      usuario.numero_id,
      usuario.primer_nombre,
      usuario.segundo_nombre,
      usuario.primer_apellido,
      usuario.segundo_apellido,
      usuario.fecha_nacimiento,
      usuario.sexo,
      usuario.direccion,
      usuario.telefono,
      usuario.eps,
      usuario.password
    ], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // Buscar usuario por número de identificación (para login)
  getByNumeroId: (numero_id, callback) => {
    db.query('SELECT * FROM usuarios WHERE numero_id = ?', [numero_id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  }
};

module.exports = UsuariosModel;
