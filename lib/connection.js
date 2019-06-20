// Provide a ready to go mysql connection

const mysql = require('mysql')

module.exports = function getConnection() {
  return mysql.createConnection({
    user: 'node',
    password: '7b2da842-0f9e-4ddb-b8eb-76e5ec102fde',
    database: 'lunch',
    host: 'localhost'
  })
}
