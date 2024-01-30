const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'camper',
  password: 'campus2024',
  database: 'discord_database'
});

// Conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
  }
});

// Exportar la conexión para que pueda ser utilizada en otros archivos
module.exports = connection;
