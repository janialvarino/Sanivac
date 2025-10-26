const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 📊 Vacunas (usa la tabla inventario)
    const [vacunas] = await db.query(`
      SELECT 
        SUM(cantidad_disponible) AS disponibles,
        SUM(cantidad_total - cantidad_disponible) AS aplicadas
      FROM inventario
    `);

    // 👥 Pacientes vacunados (desde Registro de Vacunas Aplicadas)
    const [pacientes] = await db.query(`
      SELECT COUNT(DISTINCT usuario_id) AS vacunados 
      FROM vacunas
    `);

    // Total de pacientes registrados
    const [totalPacientes] = await db.query(`SELECT COUNT(*) AS total FROM usuarios`);

    // 🚨 Alarmas activas
    const [alarmas] = await db.query(`SELECT COUNT(*) AS activas FROM alarmas WHERE estado = 'Activa'`);

    // 🧮 Armar los datos del dashboard
    const data = {
      vacunas: {
        disponibles: vacunas?.[0]?.disponibles || 0,
        aplicadas: vacunas?.[0]?.aplicadas || 0,
        agotadas: Math.max(0, ((vacunas?.[0]?.aplicadas || 0) + (vacunas?.[0]?.disponibles || 0)) - (vacunas?.[0]?.disponibles || 0))
      },
      pacientes: {
        vacunados: pacientes?.[0]?.vacunados || 0,
        pendientes: (totalPacientes?.[0]?.total || 0) - (pacientes?.[0]?.vacunados || 0)
      },
      alarmas: alarmas?.[0]?.activas || 0
    };

    res.json(data);
  } catch (error) {
    console.error('❌ Error cargando datos del dashboard:', error);
    res.status(500).json({ error: 'Error al cargar el panel de control' });
  }
});

module.exports = router;