const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");

var pool = mysql.createPool({
  connectionLimit: 20,
  host: "us-cdbr-east-05.cleardb.net",
  user: "b6175f675c62a8",
  password: "d1812fb5",
  database: "heroku_ab3189222e34410",
});

//mysql://b6175f675c62a8:d1812fb5@us-cdbr-east-05.cleardb.net/heroku_ab3189222e34410?reconnect=true

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/producto", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM producto`;

    connection.query(query, function (error, filas, campos) {
      res.json({ data: filas });
    });
    connection.release();
  });
});

app.get("/api/producto/:prod_id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM producto WHERE prod_id = ${connection.escape(
      req.params.prod_id
    )}`;

    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        res.json({ data: filas[0] });
      } else {
        res.status(404);
        res.send({
          erros: [
            `No se encontro el producto con codigo  : ${req.params.prod_id}`,
          ],
        });
      }
    });
    connection.release();
  });
});

app.get("/api/producto/est/:est", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM producto WHERE est = ${connection.escape(
      req.params.est
    )}`;

    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        res.json({ data: filas });
      } else {
        res.status(404);
        res.send({
          erros: [`No se encontro el producto con est  : ${req.params.est}`],
        });
      }
    });
    connection.release();
  });
});

app.post("/api/producto/", function (req, res) {
  console.log(req.body);

  pool.getConnection(function (err, connection) {
    const query = `INSERT INTO producto (prod_nom) VALUES (${connection.escape(
      req.body.prod_nom
    )});`;
    connection.query(query, function (error, filas, campos) {
      const last_id = filas.insertId;
      const queryConsulta = `SELECT * FROM producto WHERE prod_id=${connection.escape(
        last_id
      )}`;
      connection.query(queryConsulta, function (error, filas, campos) {
        res.json({ data: filas[0] });
      });
    });
    connection.release();
  });
});

app.put("/api/producto/:prod_id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM producto WHERE prod_id=${connection.escape(
      req.params.prod_id
    )}`;
    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        const queryUpdate = `UPDATE producto SET prod_desc=${connection.escape(
          req.body.prod_desc
        )} WHERE prod_id=${req.params.prod_id}`;
        connection.query(queryUpdate, function (error, filas, campos) {
          const queryConsulta = `SELECT * FROM producto WHERE prod_id=${connection.escape(
            req.params.prod_id
          )}`;
          connection.query(queryConsulta, function (error, filas, campos) {
            res.json({ data: filas[0] });
          });
        });
      } else {
        res.status(404);
        res.send({
          errors: [
            `No se encontro el producto con codigo  : ${req.params.prod_id}`,
          ],
        });
      }
    });

    connection.release();
  });
});

app.delete("/api/producto/:prod_id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM producto WHERE prod_id=${connection.escape(
      req.params.prod_id
    )}`;
    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        const queryDelete = `DELETE FROM producto WHERE prod_id=${req.params.prod_id}`;
        connection.query(queryDelete, function (error, filas, campos) {
          res.status(204);
          res.json();
          console.log(`Producto Codigo: ${req.params.prod_id} eliminado`);
        });
      } else {
        res.status(404);
        res.send({
          errors: [
            `No se encontro el producto con codigo  : ${req.params.prod_id}`,
          ],
        });
      }
    });
    connection.release();
  });
});

app.listen(8080, function () {
  console.log("Servidor iniciado");
});
