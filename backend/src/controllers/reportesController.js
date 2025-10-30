// backend/src/controllers/reportesController.js
const ExcelJS = require('exceljs');
const db = require('../config/db');

// ✅ Exportar TODO con todas las tablas solicitadas
exports.exportarTodo = async (req, res) => {
  try {
    console.log('📥 Iniciando exportación completa...');

    const { mes, anio } = req.body;
    const workbook = new ExcelJS.Workbook();

    // ==================== HOJA 1: USUARIOS ====================
    const sheetUsuarios = workbook.addWorksheet('Usuarios');
    sheetUsuarios.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Tipo ID', key: 'tipo_id', width: 15 },
      { header: 'Número ID', key: 'numero_id', width: 15 },
      { header: 'Primer Nombre', key: 'primer_nombre', width: 20 },
      { header: 'Segundo Nombre', key: 'segundo_nombre', width: 20 },
      { header: 'Primer Apellido', key: 'primer_apellido', width: 20 },
      { header: 'Segundo Apellido', key: 'segundo_apellido', width: 20 },
      { header: 'Fecha Nacimiento', key: 'fecha_nacimiento', width: 15 },
      { header: 'Sexo', key: 'sexo', width: 10 },
      { header: 'Dirección', key: 'direccion', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'EPS', key: 'eps', width: 20 }
    ];

    const [usuarios] = await db.query('SELECT * FROM usuarios ORDER BY id');
    usuarios.forEach(row => sheetUsuarios.addRow(row));
    sheetUsuarios.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetUsuarios.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };

    // ==================== HOJA 2: VACUNAS APLICADAS ====================
    const sheetVacunas = workbook.addWorksheet('Vacunas Aplicadas');
    sheetVacunas.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Usuario ID', key: 'usuario_id', width: 12 },
      { header: 'Identificación', key: 'numero_id', width: 15 },
      { header: 'Paciente', key: 'paciente', width: 30 },
      { header: 'Vacuna', key: 'vacuna', width: 25 },
      { header: 'Dosis', key: 'dosis', width: 10 },
      { header: 'Lote', key: 'lote', width: 15 },
      { header: 'Vía', key: 'via', width: 18 },
      { header: 'Sitio', key: 'sitio', width: 18 },
      { header: 'Fecha Aplicación', key: 'fecha_aplicacion', width: 18 },
      { header: 'Próxima Dosis', key: 'fecha_proxima_dosis', width: 18 },
      { header: 'Responsable', key: 'responsable', width: 25 },
      { header: 'Observaciones', key: 'observaciones', width: 30 }
    ];

    let queryVacunas = `
      SELECT 
        v.id,
        v.usuario_id,
        u.numero_id,
        CONCAT(u.primer_nombre, ' ', u.primer_apellido) AS paciente,
        v.nombre_vacuna AS vacuna,
        v.dosis,
        v.lote,
        v.via_administracion AS via,
        v.sitio_aplicacion AS sitio,
        v.fecha_aplicacion,
        v.fecha_proxima_dosis,
        v.responsable,
        v.observaciones
      FROM vacunas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
    `;

    if (mes && anio) {
      queryVacunas += ` WHERE MONTH(v.fecha_aplicacion) = ${mes} AND YEAR(v.fecha_aplicacion) = ${anio}`;
    }

    queryVacunas += ' ORDER BY v.fecha_aplicacion DESC';

    const [vacunas] = await db.query(queryVacunas);

    if (vacunas.length === 0) {
      sheetVacunas.addRow({ vacuna: '⚠️ No hay registros de vacunas en el periodo seleccionado' });
    } else {
      vacunas.forEach(row => sheetVacunas.addRow(row));
    }

    sheetVacunas.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetVacunas.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };

    // ==================== HOJA 3: DATOS COMPLEMENTARIOS ====================
    const sheetComplementarios = workbook.addWorksheet('Datos Complementarios');
    sheetComplementarios.columns = [
      { header: 'Usuario ID', key: 'usuario_id', width: 12 },
      { header: 'Sexo', key: 'sexo', width: 10 },
      { header: 'Género', key: 'genero', width: 15 },
      { header: 'Orientación Sexual', key: 'orientacion_sexual', width: 20 },
      { header: 'País Nacimiento', key: 'pais_nacimiento', width: 20 },
      { header: 'Régimen Afiliación', key: 'regimen_afiliacion', width: 20 },
      { header: 'Aseguradora', key: 'aseguradora', width: 25 },
      { header: 'Pertenencia Étnica', key: 'pertenencia_etnica', width: 20 },
      { header: 'Desplazado', key: 'desplazado', width: 12 },
      { header: 'Discapacitado', key: 'discapacitado', width: 12 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Celular', key: 'celular', width: 15 }
    ];

    const [complementarios] = await db.query('SELECT * FROM datos_complementarios');
    complementarios.forEach(row => sheetComplementarios.addRow(row));
    sheetComplementarios.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetComplementarios.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };

    // ==================== HOJA 4: DATOS MADRE ====================
    const sheetMadre = workbook.addWorksheet('Datos Madre');
    sheetMadre.columns = [
      { header: 'Usuario ID', key: 'usuario_id', width: 12 },
      { header: 'Tipo ID', key: 'tipo_identificacion', width: 15 },
      { header: 'Número ID', key: 'numero_identificacion', width: 15 },
      { header: 'Primer Nombre', key: 'primer_nombre', width: 20 },
      { header: 'Segundo Nombre', key: 'segundo_nombre', width: 20 },
      { header: 'Primer Apellido', key: 'primer_apellido', width: 20 },
      { header: 'Segundo Apellido', key: 'segundo_apellido', width: 20 },
      { header: 'Correo', key: 'correo', width: 25 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Celular', key: 'celular', width: 15 },
      { header: 'Régimen Afiliación', key: 'regimen_afiliacion', width: 20 },
      { header: 'Pertenencia Étnica', key: 'pertenencia_etnica', width: 20 },
      { header: 'Desplazado', key: 'desplazado', width: 12 }
    ];

    const [datosMadre] = await db.query('SELECT * FROM datos_madre');
    datosMadre.forEach(row => sheetMadre.addRow(row));
    sheetMadre.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetMadre.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF6B9D' } };

    // ==================== HOJA 5: DATOS CUIDADOR ====================
    const sheetCuidador = workbook.addWorksheet('Datos Cuidador');
    sheetCuidador.columns = [
      { header: 'Usuario ID', key: 'usuario_id', width: 12 },
      { header: 'Tipo ID', key: 'tipo_identificacion', width: 15 },
      { header: 'Número ID', key: 'numero_identificacion', width: 15 },
      { header: 'Primer Nombre', key: 'primer_nombre', width: 20 },
      { header: 'Segundo Nombre', key: 'segundo_nombre', width: 20 },
      { header: 'Primer Apellido', key: 'primer_apellido', width: 20 },
      { header: 'Segundo Apellido', key: 'segundo_apellido', width: 20 },
      { header: 'Parentesco', key: 'parentesco', width: 20 },
      { header: 'Correo', key: 'correo', width: 25 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Celular', key: 'celular', width: 15 }
    ];

    const [datosCuidador] = await db.query('SELECT * FROM datos_cuidador');
    datosCuidador.forEach(row => sheetCuidador.addRow(row));
    sheetCuidador.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetCuidador.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9B59B6' } };

    // ==================== HOJA 6: ANTECEDENTES MÉDICOS ====================
    const sheetAntecedentes = workbook.addWorksheet('Antecedentes Médicos');
    sheetAntecedentes.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Usuario ID', key: 'usuario_id', width: 12 },
      { header: 'Tipo', key: 'tipo', width: 20 },
      { header: 'Descripción', key: 'descripcion', width: 40 },
      { header: 'Fecha Diagnóstico', key: 'fecha_diagnostico', width: 15 }
    ];

    const [antecedentes] = await db.query('SELECT * FROM antecedentes_medicos');
    antecedentes.forEach(row => sheetAntecedentes.addRow(row));
    sheetAntecedentes.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetAntecedentes.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE74C3C' } };

    // ==================== HOJA 7: CONDICIÓN USUARIA ====================
    const sheetCondicion = workbook.addWorksheet('Condición Usuaria');
    sheetCondicion.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Usuario ID', key: 'usuario_id', width: 12 },
      { header: 'Condición', key: 'condicion', width: 20 },
      { header: 'Gestante', key: 'gestante', width: 12 },
      { header: 'Fecha Última Menstruación', key: 'fecha_ultima_menstruacion', width: 20 },
      { header: 'Semanas Gestación', key: 'semanas_gestacion', width: 15 },
      { header: 'Fecha Probable Parto', key: 'fecha_probable_parto', width: 18 },
      { header: 'Embarazos Previos', key: 'embarazos_previos', width: 15 }
    ];

    const [condicion] = await db.query('SELECT * FROM condicion_usuaria');
    condicion.forEach(row => sheetCondicion.addRow(row));
    sheetCondicion.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheetCondicion.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3498DB' } };

    // ==================== GENERAR ARCHIVO ====================
    const nombreMes = req.body.nombreMes || 'Completo';
    const nombreArchivo = `Reporte_Sanivac_${nombreMes}_${anio || 'Todos'}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

    await workbook.xlsx.write(res);
    res.end();

    console.log('✅ Excel completo generado exitosamente');
  } catch (err) {
    console.error('❌ Error completo:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error generando Excel', detalle: err.message });
    }
  }
};

// Mantén las otras funciones existentes
exports.exportarVacunas = async (req, res) => {
  // ... (tu código actual)
};

exports.exportarInventario = async (req, res) => {
  // ... (tu código actual)
};
