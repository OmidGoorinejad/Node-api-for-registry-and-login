const conn = require("../utilities/mariadb");

module.exports = class SqlModel {
    static async addUser(id, FullName, UserName, Email, Pwd) {
        return await conn.query("insert into users(id, FullName, UserName, Email, Pwd) value (? ,?, ?, ?, ?)",[id, FullName, UserName, Email, Pwd]);
    }

    static async selectUser(Email) {
        return await conn.query("select * from users where Email=? ", [Email]);
    }
}



