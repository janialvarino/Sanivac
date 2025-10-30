// src/controllers/vacunasDetalle.controller.js
const db = require('../config/db');

// ✅ Obtener detalle completo de un paciente (vacunas + esquema)
exports.getDetallePorPaciente = async (req, res) => {
  const idPaciente = req.params.id;

  try {
    const [rows] = await db.query(`
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
    `, [idPaciente]);

    if (!rows.length) {
      return res.status(404).json({ mensaje: 'No se encontró información del paciente.' });
    }

    res.json({
      paciente: {
        id: rows[0].usuario_id,
        nombre: rows[0].nombre_paciente,
        identificacion: rows[0].numero_identificacion
      },
      esquema: {
        id: rows[0].esquema_id,
        tipo_carnet: rows[0].tipo_carnet,
        fecha_registro: rows[0].fecha_registro,
        observaciones: rows[0].esquema_observaciones
      },
      vacunas: rows.map(r => ({
        id: r.vacuna_id,
        nombre: r.nombre_vacuna,
        dosis: r.dosis,
        lote: r.lote,
        fecha_aplicacion: r.fecha_aplicacion,
        responsable: r.responsable,
        observaciones: r.vacuna_observaciones
      }))
    });
  } catch (err) {
    console.error('❌ Error al obtener detalle del paciente:', err);
    res.status(500).json({ error: 'Error al obtener detalle del paciente' });
  }
};
