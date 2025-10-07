const Inventario = require('../models/inventarioModel');

exports.obtenerInventario = (req, res) => {
  Inventario.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener inventario" });
    }
    res.json(results);
  });
};

exports.registrarMovimiento = (req, res) => {
  const data = req.body;
  Inventario.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al registrar movimiento" });
    }
    res.json({ mensaje: "Movimiento registrado con éxito", id: result.insertId });
  });
};
