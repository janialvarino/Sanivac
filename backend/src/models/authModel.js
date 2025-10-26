const db = require('../config/db');

const Auth = {
  // 🔍 Buscar usuario por credenciales
  findByCredentials: async (username, password) => {
    const query = 'SELECT * FROM usuarios_sistema WHERE username = ? AND password = ?';
    const [results] = await db.query(query, [username, password]);
    return results[0]; // retorna el primer usuario o undefined
  },

  // 🔍 Buscar por username
  findByUsername: async (username) => {
    const query = 'SELECT * FROM usuarios_sistema WHERE username = ?';
    const [results] = await db.query(query, [username]);
    return results[0];
  }
};

module.exports = Auth;