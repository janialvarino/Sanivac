// backend/src/controllers/reportesController.js
const ExcelJS = require('exceljs');
const db = require('../config/db');

// ✅ Exportar TODO con tus columnas reales
exports.exportarTodo = async (req, res) => {
  try {
    console.log('📥 Iniciando exportación completa...');
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Registro Vacunación');

    // ✅ Columnas según tu estructura real
    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Número ID', key: 'numero_id', width: 15 },
      { header: 'Paciente', key: 'paciente', width: 30 },
      { header: 'Vacuna', key: 'nombre_vacuna', width: 25 },
      { header: 'Laboratorio', key: 'laboratorio', width: 20 },
      { header: 'Dosis', key: 'dosis', width: 10 },
      { header: 'Lote', key: 'lote', width: 15 },
      { header: 'Lote Diluyente', key: 'lote_diluyente', width: 15 },
      { header: 'Lote Jeringa', key: 'lote_jeringa', width: 15 },
      { header: 'Tipo Jeringa', key: 'tipo_jeringa', width: 15 },
      { header: 'Vía Administración', key: 'via_administracion', width: 18 },
      { header: 'Sitio Aplicación', key: 'sitio_aplicacion', width: 18 },
      { header: 'Fecha Aplicación', key: 'fecha_aplicacion', width: 15 },
      { header: 'Próxima Dosis', key: 'fecha_proxima_dosis', width: 15 },
      { header: 'Responsable', key: 'responsable', width: 25 },
      { header: 'Observaciones', key: 'observaciones', width: 30 }
    ];

    // Estilo del encabezado
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0070C0' }
    };
    sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // ✅ Consulta con tus columnas reales
    const [rows] = await db.query(`
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

    console.log(`✅ ${rows.length} registros encontrados`);

    // Agregar datos
    rows.forEach(row => {
      sheet.addRow(row);
    });

    // Autoajustar altura de filas
    sheet.eachRow((row, rowNumber) => {
      row.height = 18;
    });

    // Configurar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Vacunacion_Completo.xlsx');

    await workbook.xlsx.write(res);
    res.end();
    
    console.log('✅ Excel generado exitosamente');

  } catch (err) {
    console.error('❌ Error completo:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error generando Excel', detalle: err.message });
    }
  }
};

exports.exportarVacunas = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Catálogo Vacunas');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Nombre', key: 'nombre', width: 35 },
      { header: 'Tipo', key: 'tipo_vacuna', width: 20 },
      { header: 'Vía Administración', key: 'via_administracion', width: 20 }
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };

    const [rows] = await db.query('SELECT * FROM vacunas ORDER BY nombre');
    rows.forEach(row => sheet.addRow(row));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Catalogo_Vacunas.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error('❌ Error exportando vacunas:', err);
    res.status(500).json({ error: 'Error generando Excel de vacunas' });
  }
};

exports.exportarInventario = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventario');

    sheet.columns = [
      { header: 'Vacuna', key: 'vacuna', width: 30 },
      { header: 'Stock Actual', key: 'stock_actual', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC000' }
    };

    const [rows] = await db.query(`
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

    rows.forEach(row => sheet.addRow(row));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Inventario_Vacunas.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error('❌ Error exportando inventario:', err);
    res.status(500).json({ error: 'Error generando Excel de inventario' });
  }
};