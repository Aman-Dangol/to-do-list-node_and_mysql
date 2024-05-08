const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const mysql = require("./scripts/connect.js");
const { log } = require("console");
const conn = mysql.conn;
http
  .createServer((req, res) => {
    let parsedPath = path.parse(req.url);
    let parsedUrl = url.parse(req.url);
    let requestUrl = parsedUrl.pathname;
    if (requestUrl == "/") {
      res.setHeader("content-type", "text/html");
      fs.readFile("./pages/index.html", (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end(err);
          return;
        }
        res.end(data);
      });
    } else if (requestUrl == "/delete") {
      let formdata = new URLSearchParams(parsedUrl.query);
      let id = formdata.get("id");
      conn.query(`delete from lists where lists.id = ${id}`);
      res.writeHead(301, { location: "/" });
      res.end();
    } else if (requestUrl == "/add") {
      let formdata = new URLSearchParams(parsedUrl.query);
      conn.query(`insert into lists(task) values("${formdata.get("task")}")`);
      res.writeHead(301, { location: "/" });
      res.end("hello");
    } else if (requestUrl == "/getList") {
      res.setHeader("content-type", "text/html");
      conn.query("select * from lists", (err, data, fields) => {
        if (err) {
          res.end("<h1>error aayo/h1>");
          return;
        }
        res.end(JSON.stringify(data));
      });
    } else if (requestUrl == `/update`) {
      responder(res, "pages", "update.html", "text/html");
    } else if (requestUrl == "/getUpdateData") {
      let formdata = new URLSearchParams(parsedUrl.query);
      let id = formdata.get("id");
      conn.query(
        `select * from lists where lists.id = ${id} `,
        (err, data, fields) => {
          if (err) {
            res.end("data not found");
            return;
          }
          res.end(JSON.stringify(data));
        }
      );
    } else if (requestUrl == "/updateData") {
      let formdata = new URLSearchParams(parsedUrl.query);
      let id = formdata.get("id");
      let task = formdata.get("task");
      conn.query(
        `update lists set lists.task = "${task}" where lists.id = ${id}`
      );
      res.writeHead(301, { location: "/" });
      res.end();
    } else {
      let ext = parsedPath.ext;
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
