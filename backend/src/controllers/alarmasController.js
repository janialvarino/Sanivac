const Alarma = require('../models/alarmasModel');

exports.obtenerAlarmas = (req, res) => {
  Alarma.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener alarmas" });
    }
    res.json(results);
  });
};

exports.registrarAlarma = (req, res) => {
  const data = req.body;
  Alarma.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al registrar alarma" });
    }
    res.json({ mensaje: "Alarma registrada con éxito", id: result.insertId });
  });
};
