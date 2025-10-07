const Vacuna = require('../models/vacunasModel');

exports.obtenerVacunas = (req, res) => {
  Vacuna.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener vacunas" });
    }
    res.json(results);
  });
};

exports.registrarVacuna = (req, res) => {
  const data = req.body;
  Vacuna.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al registrar vacuna" });
    }
    res.json({ mensaje: "Vacuna registrada con éxito", id: result.insertId });
  });
};