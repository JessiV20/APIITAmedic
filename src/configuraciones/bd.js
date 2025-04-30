const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password:'123',
    port: 3306,
    database: 'itamedic'
}).promise();

module.exports = pool;
