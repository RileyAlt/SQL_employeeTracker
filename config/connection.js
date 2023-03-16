const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'company_db'
});

module.exports = connection;
