const { database } = require('./config');
const mysql = require('mysql');

var pool  = mysql.createPool(
    database
);

module.exports = pool