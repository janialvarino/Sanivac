// src/controllers/vacunasDetalle.controller.js
const db = require('../config/db');

// ✅ Obtener detalle completo de un paciente (vacunas + esquema)
exports.getDetallePorPaciente = (req, res) => {
  const idPaciente = req.params.id;

  const sql = `
    SELECT 
      u.id AS usuario_id,
      CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre_paciente,
      u.numero_id AS numero_identificacion,
      ev.id AS esquema_id,
      ev.tipo_carnet,
      ev.fecha_registro,
      ev.observaciones AS esquema_observaciones,
      v.id AS vacuna_id,
      v.nombre_vacuna,
      v.dosis,
      v.lote,
      v.fecha_aplicacion,
      v.responsable,
      v.observaciones AS vacuna_observaciones
    FROM usuarios u
    LEFT JOIN esquema_vacunacion ev ON ev.usuario_id = u.id
    LEFT JOIN vacunas v ON v.usuario_id = u.id
    WHERE u.id = ?;
  `;

  db.query(sql, [idPaciente], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener detalle del paciente:', err);
      return res.status(500).json({ error: 'Error al obtener detalle del paciente' });
    }
    res.json(results);
  });
};
