const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const mysql = require("./scripts/connect.js");
const conn = mysql.conn;
http
  .createServer((req, res) => {
    console.log(req.url);
    let parsedPath = path.parse(req.url);
    let parsedUrl = url.parse(req.url);
    console.log(parsedUrl);
    req.url = parsedUrl.pathname;
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
    if (req.url == "/add") {
      let formdata = new URLSearchParams(parsedUrl.query);
      conn.query(`insert into lists(task) values("${formdata.get("task")}")`);
      responder(res, "pages", "index.html", "text/html");
    } else if (req.url == "/getList") {
      res.setHeader("content-type", "text/html");
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
        case ".js":
          responder(res, "scripts", parsedPath.base, "text/javascript");
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
