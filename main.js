const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("./connect.js");
const conn = mysql.conn;
http
  .createServer((req, res) => {
    let parsedPath = path.parse(req.url);
    if (req.url == "/") {
      res.setHeader("content-type", "text/html");
      fs.readFile("./pages/index.html", (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end(err);
          return;
        }
        res.end(data);
      });
    }
    if (req.url == "/getList") {
      res.setHeader("content-type", "text/html");
      conn.connect();
      conn.query("select * from lists", (err, data, fields) => {
        if (err) {
          res.end("<h1>get list</h1>");
          return;
        }
        res.end(JSON.stringify(data));
      });
    } else {
      let ext = parsedPath.ext;
      console.log(parsedPath);
      switch (ext) {
        case ".css":
          responder(res, "css", parsedPath.base, "text/css");
          break;
      }
    }
  })
  .listen(8000);

let responder = (res, folder, filePath, contentHeader) => {
  fs.readFile(`./${folder}/${filePath}`, (err, data) => {
    if (err) {
      res.end("error aayo!!");
      return;
    }
    res.setHeader("content-type", contentHeader);
    res.end(data);
  });
};
