const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📋 Obtener todas las alarmas con información completa
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.vacuna_id,
        a.usuario_id,
        a.telefono,
        a.fecha_vacuna,
        a.dosis,
        a.mensaje,
        a.estado,
        a.creado_en,
        u.numero_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS nombre_completo,
        v.fecha_proxima_dosis,
        v.nombre_vacuna,
        CASE
          WHEN a.estado = 'atendida' THEN 'vacunado'
          WHEN v.fecha_proxima_dosis IS NULL THEN 'sin_seguimiento'
          WHEN v.fecha_proxima_dosis < CURDATE() THEN 'vencida'
          WHEN v.fecha_proxima_dosis BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'proxima'
          ELSE 'pendiente'
        END AS estado_real
      FROM alarmas a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN vacunas v ON a.vacuna_id = v.id
      ORDER BY 
        CASE 
          WHEN a.estado = 'pendiente' AND v.fecha_proxima_dosis < CURDATE() THEN 1
          WHEN a.estado = 'pendiente' AND v.fecha_proxima_dosis BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 2
          WHEN a.estado = 'pendiente' THEN 3
          ELSE 4
        END,
        a.creado_en DESC
    `;
    
    const [results] = await db.query(query);
    console.log('📋 Alarmas obtenidas:', results.length);
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener alarmas:', err);
    res.status(500).json({ error: 'Error al obtener alarmas' });
  }
});

// 📊 Contar alarmas pendientes (para dashboard)
router.get('/pendientes/count', async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) as total 
      FROM alarmas 
      WHERE estado = 'pendiente'
    `;
    const [results] = await db.query(query);
    res.json({ pendientes: results[0].total });
  } catch (err) {
    console.error('❌ Error al contar alarmas:', err);
    res.status(500).json({ error: 'Error al contar alarmas' });
  }
});

// ✅ Marcar como atendida
router.put('/:id/atender', async (req, res) => {
  try {
    const alarmaId = req.params.id;
    console.log('🔔 Intentando marcar alarma ID:', alarmaId);
    
    // Primero verificar que existe
    const [check] = await db.query('SELECT * FROM alarmas WHERE id = ?', [alarmaId]);
    
    if (check.length === 0) {
      console.log('⚠️ Alarma no encontrada');
      return res.status(404).json({ error: 'Alarma no encontrada' });
    }
    
    console.log('✅ Alarma encontrada:', check[0]);
    
    // Actualizar el estado
    const [result] = await db.query(
      "UPDATE alarmas SET estado = 'atendida' WHERE id = ?",
      [alarmaId]
    );
    
    console.log('✅ Resultado de actualización:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se pudo actualizar' });
    }
    
    res.json({ 
      message: '✅ Alarma marcada como atendida', 
      affectedRows: result.affectedRows 
    });
  } catch (err) {
    console.error('❌ Error al marcar alarma:', err);
    res.status(500).json({ error: 'Error al marcar alarma', details: err.message });
  }
});

module.exports = router;