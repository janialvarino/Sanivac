const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔍 Intentando login con:', username);

    const [results] = await db.query(
      'SELECT * FROM usuarios_sistema WHERE username = ? AND password = ?',
      [username, password]
    );

    if (results.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = {
      id: results[0].id,
      username: results[0].username,
      rol: results[0].rol,
      nombre: results[0].nombre_completo
    };

    console.log('✅ Login exitoso:', user);
    res.json(user);
  } catch (err) {
    console.error('❌ Error en DB:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;