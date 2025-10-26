// backend/src/models/reportesModel.js
const db = require('../config/db');

exports.reporteVacunas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM vacunas ORDER BY nombre');
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteVacunas:', err);
    res.status(500).json({ error: 'Error al generar reporte de vacunas' });
  }
};

exports.reporteInventario = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        v.nombre AS vacuna,
        SUM(CASE 
          WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad
          WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad
          ELSE 0 
        END) AS stock_actual
      FROM inventario i
      JOIN vacunas v ON i.vacuna_id = v.id
      GROUP BY v.nombre
      ORDER BY stock_actual ASC
    `);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteInventario:', err);
    res.status(500).json({ error: 'Error al generar reporte de inventario' });
  }
};

exports.reporteAlarmas = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM alarmas WHERE estado = "activa" ORDER BY fecha_creacion DESC');
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteAlarmas:', err);
    res.status(500).json({ error: 'Error al generar reporte de alarmas' });
  }
};

// ✅ CORREGIDO - Usando tus columnas reales
exports.reporteVacunacionCompleto = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        vd.id,
        u.numero_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS paciente,
        vd.nombre_vacuna,
        vd.laboratorio,
        vd.dosis,
        vd.lote,
        vd.lote_diluyente,
        vd.lote_jeringa,
        vd.tipo_jeringa,
        vd.via_administracion,
        vd.sitio_aplicacion,
        vd.fecha_aplicacion,
        vd.fecha_proxima_dosis,
        vd.responsable,
        vd.observaciones
      FROM vacunas_detalle vd
      LEFT JOIN usuarios u ON vd.usuario_id = u.id
      ORDER BY vd.fecha_aplicacion DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en reporteVacunacionCompleto:', err);
    res.status(500).json({ error: 'Error al generar reporte completo' });
  }
};