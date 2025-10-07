const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const vacunasRoutes = require('./routes/vacunas');
const inventarioRoutes = require('./routes/inventario');
const alarmasRoutes = require('./routes/alarmas');
const reportesRoutes = require('./routes/reportes');
const authRoutes = require('./routes/auth'); //  aquí arriba, junto con los demás

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

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
