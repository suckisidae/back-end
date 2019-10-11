const mysql = require('promise-mysql');

const dbConfig = {
    host: 'rdd9223.cvvhkxkqobt2.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'rdd9223',
    password: 'asd970712',
    database: '스키마 이름',
    connectionLimit: 20
};

module.exports = mysql.createPool(dbConfig);