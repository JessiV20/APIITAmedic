require('dotenv').config({ path: './src/.env' });
const mysql = require('mysql2');


console.log('DB_USER:', process.env.DB_USER); 
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
}).promise();

module.exports = pool;
 