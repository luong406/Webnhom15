const mysql = require("mysql2/promise");
const dbConfig = require("../configs/dbConfig");

const db = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});
module.exports = db;