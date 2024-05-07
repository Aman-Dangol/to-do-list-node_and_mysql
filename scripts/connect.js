const mysql = require("mysql");

module.exports.conn = mysql.createConnection({
  host: "localhost",
  user: "aman",
  password: "root",
  database: "to-do-list",
});



