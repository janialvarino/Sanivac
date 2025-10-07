const db = require('../config/db');

const ReportesController = {
  reporteVacunas: (req, res) => {
    db.query('SELECT * FROM vacunas', (err, results) => {
      if (err) return res.status(500).json({ error: "Error al generar reporte de vacunas" });
      res.json(results);
    });
  },

  reporteInventario: (req, res) => {
    db.query(
      `SELECT v.nombre AS vacuna, SUM(
          CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad
               WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad
               ELSE 0 END
        ) AS stock_actual
       FROM inventario i 
       JOIN vacunas v ON i.vacuna_id = v.id
       GROUP BY v.nombre`,
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error al generar reporte de inventario" });
        res.json(results);
      }
    );
  },

  reporteAlarmas: (req, res) => {
    db.query('SELECT * FROM alarmas', (err, results) => {
      if (err) return res.status(500).json({ error: "Error al generar reporte de alarmas" });
      res.json(results);
    });
  }
};

module.exports = ReportesController;
