// Provide a ready to go mysql connection

const mysql = require('mysql')

module.exports = function getConnection() {
  return mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    host: process.env.DB_HOST
  })
}
