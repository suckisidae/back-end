const mysql = require('promise-mysql');

const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'rdd9223',
    password: 'asd970712',
    database: 'kang',
}

module.exports = mysql.createPool(dbConfig);