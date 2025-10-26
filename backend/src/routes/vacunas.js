const express = require('express');
const router = express.Router();
const vacunasController = require('../controllers/vacunasController');
const db = require('../config/db');

// 📋 Obtener todas las vacunas
router.get('/', vacunasController.obtenerVacunas);

// ➕ Registrar nueva vacuna
router.post('/', vacunasController.registrarVacuna);

// 🔍 Obtener vacunas de un usuario por su ID
router.get('/usuario/:id', async (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      v.id,
      v.usuario_id,
      u.numero_id AS identificacion,
      CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS paciente,
      v.nombre_vacuna AS vacuna,
      v.dosis,
      v.lote,
      v.via_administracion AS via, 
      v.sitio_aplicacion AS sitio,
      v.fecha_aplicacion,
      v.responsable,
      v.observaciones,
      v.fecha_proxima_dosis
    FROM vacunas v
    JOIN usuarios u ON v.usuario_id = u.id
    WHERE v.usuario_id = ?
    ORDER BY v.fecha_aplicacion DESC
  `;

  try {
    const [results] = await db.query(sql, [id]);
    res.json(results);
  } catch (err) {
    console.error('❌ Error al obtener vacunas del usuario:', err);
    res.status(500).json({ error: 'Error al obtener vacunas del usuario' });
  }
});

module.exports = router;