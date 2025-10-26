const Auth = require('../models/authModel');

const AuthController = {
  // 🔐 Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Faltan credenciales' });
      }

      console.log('🔍 Intentando login con:', username);

      const usuario = await Auth.findByCredentials(username, password);

      if (!usuario) {
        console.log('❌ Usuario no encontrado');
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = {
        id: usuario.id,
        username: usuario.username,
        rol: usuario.rol,
        nombre: usuario.nombre_completo
      };

      console.log('✅ Login exitoso:', user);
      res.json(user);
    } catch (err) {
      console.error('❌ Error en login:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

module.exports = AuthController;