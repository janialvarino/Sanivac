const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Intentando login con:', username, password); // 👀 debug

  db.query(
    'SELECT * FROM usuarios_sistema WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Error en DB:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.length === 0) {
        console.log('No se encontró usuario'); // 👀 debug
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = {
        id: results[0].id,
        username: results[0].username,
        rol: results[0].rol,
        nombre: results[0].nombre_completo
      };

      console.log('Login exitoso:', user); // 👀 debug
      res.json(user);
    }
  );
});

module.exports = router;
