// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'sanivac',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ✅ Timeouts válidos para el pool
  connectTimeout: 10000,        // 10 segundos para conectar
  // ✅ Configuración de keep-alive
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// ✅ Monitorear estado del pool cada 30 segundos
setInterval(() => {
  const poolStatus = {
    total: pool.pool._allConnections.length,
    free: pool.pool._freeConnections.length,
    inUse: pool.pool._allConnections.length - pool.pool._freeConnections.length
  };
  console.log('📊 Estado del Pool MySQL:', poolStatus);
  
  // ⚠️ Alerta si todas las conexiones están en uso
  if (poolStatus.inUse >= poolStatus.total) {
    console.warn('⚠️ ADVERTENCIA: Todas las conexiones del pool están en uso!');
  }
}, 30000);

// ✅ Probar conexión al iniciar
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a la base de datos MySQL');
    console.log('📦 Base de datos:', process.env.DB_NAME || 'sanivac');
    connection.release();
  } catch (err) {
    console.error('❌ Error al conectar con la BD:', err.message);
    console.error('💡 Verifica tus credenciales en el archivo .env');
    process.exit(1);
  }
})();

// ✅ Manejar cierre graceful del servidor
process.on('SIGINT', async () => {
  console.log('\n🔌 Cerrando pool de conexiones...');
  await pool.end();
  console.log('✅ Pool cerrado correctamente');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔌 Cerrando pool de conexiones...');
  await pool.end();
  console.log('✅ Pool cerrado correctamente');
  process.exit(0);
});

module.exports = pool;
