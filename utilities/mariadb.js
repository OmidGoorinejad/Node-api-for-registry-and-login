const mariadb = require('mariadb');
require("dotenv").config();
try {
    const conn = mariadb.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DATABASE,
    });

    module.exports = conn;
} catch(error){
    
}