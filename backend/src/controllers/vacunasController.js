const Vacuna = require('../models/vacunasModel');
const Inventario = require('../models/inventarioModel');
const Alarma = require('../models/alarmasModel');
const db = require('../config/db');

const VacunasController = {
  // 🧾 Obtener todas las vacunas CON identificación y nombre del paciente
  obtenerVacunas: async (req, res) => {
    try {
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
        ORDER BY v.fecha_aplicacion DESC
      `;
      
      const [results] = await db.query(sql);
      res.json(results);
    } catch (err) {
      console.error("❌ Error al obtener vacunas:", err);
      res.status(500).json({ error: "Error al obtener vacunas" });
    }
  },

  // 💉 Registrar nueva vacuna
  registrarVacuna: async (req, res) => {
    try {
      const data = req.body;

      // Validación rápida
      if (!data.usuario_id || !data.nombre_vacuna || !data.dosis || !data.fecha_aplicacion) {
        return res.status(400).json({ error: "Faltan datos obligatorios del registro" });
      }

      const result = await Vacuna.create(data);
      console.log("✅ Vacuna registrada correctamente con ID:", result.insertId);

      // 🔹 1. Reducir automáticamente dosis en inventario
      try {
        await Inventario.consumirDosis(data.nombre_vacuna, 1);
        console.log("📦 Dosis reducida en inventario de:", data.nombre_vacuna);
      } catch (errCons) {
        console.error("⚠️ Error al consumir dosis:", errCons);
      }

      // 🔹 2. Crear alarma automática por vacuna aplicada
      try {
        const alarmaInsert = `
          INSERT INTO alarmas (vacuna_id, usuario_id, telefono, fecha_vacuna, dosis, mensaje, estado)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const mensaje = `💉 Vacuna ${data.nombre_vacuna} dosis ${data.dosis} aplicada`;
        await db.query(alarmaInsert, [
          result.insertId,
          data.usuario_id,
          data.telefono || null,
          data.fecha_aplicacion,
          data.dosis,
          mensaje,
          'pendiente'
        ]);
        console.log('✅ Alarma creada para vacuna ID:', result.insertId);
      } catch (errAlarma) {
        console.error('⚠️ Error al crear alarma:', errAlarma);
      }

      // 🔹 3. Generar alarmas de vencimiento (si existe función)
      if (typeof generarAlarmasVencimiento === 'function') {
        await generarAlarmasVencimiento();
      }

      // 🔹 4. Responder al cliente
      res.json({ mensaje: "✅ Vacuna registrada con éxito", id: result.insertId });
    } catch (err) {
      console.error("❌ Error al registrar vacuna:", err);
      res.status(500).json({ error: "Error al registrar vacuna" });
    }
  },

  // 🔍 Obtener vacuna por ID
  obtenerVacunaPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const vacuna = await Vacuna.getById(id);
      
      if (!vacuna) {
        return res.status(404).json({ error: "Vacuna no encontrada" });
      }
      
      res.json(vacuna);
    } catch (err) {
      console.error("❌ Error al obtener vacuna:", err);
      res.status(500).json({ error: "Error al obtener vacuna" });
    }
  },

  // ✏️ Actualizar vacuna
  actualizarVacuna: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      await Vacuna.update(id, data);
      res.json({ mensaje: "✅ Vacuna actualizada con éxito" });
    } catch (err) {
      console.error("❌ Error al actualizar vacuna:", err);
      res.status(500).json({ error: "Error al actualizar vacuna" });
    }
  },

  // 🗑️ Eliminar vacuna
  eliminarVacuna: async (req, res) => {
    try {
      const { id } = req.params;
      await Vacuna.delete(id);
      res.json({ mensaje: "🗑️ Vacuna eliminada con éxito" });
    } catch (err) {
      console.error("❌ Error al eliminar vacuna:", err);
      res.status(500).json({ error: "Error al eliminar vacuna" });
    }
  },
};

module.exports = VacunasController;
