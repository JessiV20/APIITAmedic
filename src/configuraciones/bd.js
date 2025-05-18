const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    database: 'itamedic',
    password: 'josuedavid1'
}).promise();

module.exports = pool;