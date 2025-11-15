// Backend Server for SERIE III - SQL Server Connection
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQL Server Configuration
const sqlConfig = {
    server: 'svr-sql-ctezo.southcentralus.cloudapp.azure.com',
    user: 'usr_DesaWebDevUMG',
    password: '!ngGuast@360',
    database: 'db_DesaWebDevUMG',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

// Global connection pool
let pool = null;

// Initialize Database Connection
async function initializeDatabase() {
    try {
        pool = await sql.connect(sqlConfig);
        console.log('✅ Conectado a SQL Server exitosamente');
    } catch (error) {
        console.error('❌ Error al conectar con SQL Server:', error);
        process.exit(1);
    }
}

// SERIE III: Get Messages Endpoint
app.get('/api/messages', async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({
                error: 'Database connection not initialized'
            });
        }

        const result = await pool.request().query(`
            SELECT
                ID_Mensaje,
                Cod_Sala,
                Login_Emisor,
                Contenido,
                Fecha_Envio
            FROM [dbo].[Chat_Mensaje]
            WHERE Cod_Sala = 0
            ORDER BY Fecha_Envio ASC
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({
            error: 'Error al obtener mensajes',
            details: error.message
        });
    }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: pool ? 'Connected' : 'Disconnected'
    });
});

// Start Server
async function startServer() {
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend iniciado en http://localhost:${PORT}`);
        console.log(`📡 Endpoint de mensajes: http://localhost:${PORT}/api/messages`);
        console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Cerrando servidor...');
    if (pool) {
        await pool.close();
        console.log('✅ Conexión a base de datos cerrada');
    }
    process.exit(0);
});

// Start the server
startServer().catch(error => {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
});
