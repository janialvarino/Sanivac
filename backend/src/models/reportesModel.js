// ✅ backend/src/models/reportesModel.js
const db = require('../config/db');

// 📊 Reporte general de vacunas registradas
exports.reporteVacunas = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        v.id,
        v.usuario_id,
        u.numero_id AS identificacion,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS paciente,
        v.nombre_vacuna AS vacuna,
        v.laboratorio,
        v.dosis,
        v.lote,
        v.diluyente,
        v.lote_diluyente,
        v.lote_jeringa,
        v.tipo_jeringa,
        v.via_administracion AS via,
        v.sitio_aplicacion AS sitio,
        v.fecha_aplicacion,
        v.fecha_proxima_dosis,
        v.responsable,
        v.observaciones
      FROM vacunas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      ORDER BY v.fecha_aplicacion DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteVacunas:', err);
    res.status(500).json({ error: 'Error al generar reporte de vacunas' });
  }
};

// 📦 Reporte de inventario de vacunas
exports.reporteInventario = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        v.nombre_vacuna AS vacuna,
        SUM(
          CASE 
            WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad
            WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad
            ELSE 0
          END
        ) AS stock_actual
      FROM inventario i
      JOIN vacunas v ON i.vacuna_id = v.id
      GROUP BY v.nombre_vacuna
      ORDER BY stock_actual ASC
    `);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteInventario:', err);
    res.status(500).json({ error: 'Error al generar reporte de inventario' });
  }
};

// 🔔 Reporte de alarmas activas
exports.reporteAlarmas = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        a.id,
        u.numero_id AS identificacion,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS paciente,
        a.fecha_vacuna,
        a.dosis,
        a.mensaje,
        a.estado,
        a.estado_real
      FROM alarmas a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.fecha_vacuna DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteAlarmas:', err);
    res.status(500).json({ error: 'Error al generar reporte de alarmas' });
  }
};

// 📋 Reporte completo de vacunación (todas las vacunas registradas con detalles)
exports.reporteVacunacionCompleto = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        v.id,
        u.numero_id AS identificacion,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS paciente,
        v.nombre_vacuna,
        v.laboratorio,
        v.dosis,
        v.lote,
        v.diluyente,
        v.lote_diluyente,
        v.lote_jeringa,
        v.tipo_jeringa,
        v.via_administracion AS via,
        v.sitio_aplicacion AS sitio,
        v.fecha_aplicacion,
        v.fecha_proxima_dosis,
        v.responsable,
        v.observaciones
      FROM vacunas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      ORDER BY v.fecha_aplicacion DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteVacunacionCompleto:', err);
    res.status(500).json({ error: 'Error al generar reporte completo de vacunación' });
  }
};
