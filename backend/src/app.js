const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const vacunasRoutes = require('./routes/vacunas');
const inventarioRoutes = require('./routes/inventario');
const alarmasRoutes = require('./routes/alarmas');
const reportesRoutes = require('./routes/reportes');
const authRoutes = require('./routes/auth'); 
const dashboardRoutes = require('./routes/dashboard');
const datosComplementariosRoutes = require ('./routes/datosComplementarios.js');
const antecedentesMedicosRoutes = require ('./routes/antecedentesMedicos.js');
const condicionUsuariaRoutes = require('./routes/condicionUsuaria.js');
const datosMadreRoutes = require('./routes/datosMadre');
const datosCuidadorRoutes = require('./routes/datosCuidador');
const esquemaVacunacionRoutes = require('./routes/esquemaVacunacion');
const vacunasDetalleRoutes = require('./routes/vacunasDetalle');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes); //  aquí, antes del listen
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vacunas', vacunasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/alarmas', alarmasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/datos-complementarios', datosComplementariosRoutes);
app.use('/api/antecedentes-medicos', antecedentesMedicosRoutes);
app.use('/api/condicion-usuaria', condicionUsuariaRoutes);
app.use('/api/datos-madre', datosMadreRoutes);
app.use('/api/datos-cuidador', datosCuidadorRoutes);
app.use('/api/esquema-vacunacion', esquemaVacunacionRoutes);
app.use('/api/vacunas-detalle', vacunasDetalleRoutes);


// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
