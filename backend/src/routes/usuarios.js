const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login con usernamey contraseña
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const user = results[0];
      // devolvemos los datos (sin la contraseña)
      res.json({
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,  // Admin o Enfermera
        numero_id: user.numero_id
      });
    }
  );
});

module.exports = router;
