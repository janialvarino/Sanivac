const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuariosModel = require('../models/usuariosModel');

const UsuariosController = {
  // Listar usuarios
  listar: (req, res) => {
    UsuariosModel.getAll((err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
      res.json(results);
    });
  },

  // Registrar usuario
  registrar: (req, res) => {
    const nuevoUsuario = req.body;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    nuevoUsuario.password = bcrypt.hashSync(nuevoUsuario.password, salt);

    UsuariosModel.create(nuevoUsuario, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      res.json({ message: 'Usuario registrado con éxito', id: result.insertId });
    });
  },

  // Login
  login: (req, res) => {
    const { numero_id, password } = req.body;

    UsuariosModel.getByNumeroId(numero_id, (err, usuario) => {
      if (err || !usuario) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña
      const esValida = bcrypt.compareSync(password, usuario.password);
      if (!esValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Crear token JWT
      const token = jwt.sign(
        { id: usuario.id, numero_id: usuario.numero_id },
        process.env.JWT_SECRET || 'secreto',
        { expiresIn: '1h' }
      );

      res.json({ message: 'Login exitoso', token });
    });
  }
};

module.exports = UsuariosController;
