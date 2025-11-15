// Script temporal para verificar la estructura de la tabla
const sql = require('mssql');

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
    connectionTimeout: 30000,
    requestTimeout: 30000
};

async function checkTable() {
    try {
        console.log('Conectando a SQL Server...');
        const pool = await sql.connect(sqlConfig);
        console.log('✅ Conectado exitosamente\n');

        // Consultar estructura de la tabla
        console.log('📋 Consultando estructura de [dbo].[Chat_Mensaje]...\n');
        const columns = await pool.request().query(`
            SELECT
                COLUMN_NAME,
                DATA_TYPE,
                CHARACTER_MAXIMUM_LENGTH,
                IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Chat_Mensaje'
            ORDER BY ORDINAL_POSITION
        `);

        console.log('Columnas encontradas:');
        console.log('====================');
        columns.recordset.forEach(col => {
            console.log(`- ${col.COLUMN_NAME} (${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });

        // Consultar algunos datos de ejemplo
        console.log('\n📝 Consultando datos de ejemplo...\n');
        const data = await pool.request().query(`
            SELECT TOP 3 * FROM [dbo].[Chat_Mensaje]
        `);

        if (data.recordset.length > 0) {
            console.log('Ejemplo de datos:');
            console.log('=================');
            console.log(JSON.stringify(data.recordset, null, 2));
        } else {
            console.log('No hay datos en la tabla');
        }

        await pool.close();
        console.log('\n✅ Consulta completada');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkTable();
