let mysql = require('mysql')

let cnx = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'labo'
})

cnx.connect()

module.exports = cnx