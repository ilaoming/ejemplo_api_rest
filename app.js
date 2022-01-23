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

app.get("/",function (req,res) { 
  res.send("Welcome to Pizzeria Remolo Api ")
 })

 app.get("/api/category", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM category`;

    connection.query(query, function (error, filas, campos) {
      res.json({ data: filas });
    });
    connection.release();
  });
});

app.get("/api/category/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM category WHERE id = ${connection.escape(
      req.params.id
    )}`;

    connection.query(query, function (error, filas, campos) {
      res.json({ data: filas });
    });
    connection.release();
  });
});

app.post("/api/category/", function (req, res) {

  pool.getConnection(function (err, connection) {
    const query = `INSERT INTO category (name) VALUES (
      ${connection.escape(req.body.name)},
      );`;

    connection.query(query, function (error, filas, campos) {
      const last_id = filas.insertId;
      const queryConsulta = `SELECT * FROM product WHERE id=${connection.escape(
        last_id
      )}`;
      connection.query(queryConsulta, function (error, filas, campos) {
        res.json({ data: filas[0] });
      });
    });
    connection.release();
  });
});



app.get("/api/product", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM product`;

    connection.query(query, function (error, filas, campos) {
      res.json({ data: filas });
    });
    connection.release();
  });
});

app.get("/api/product/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM product WHERE id = ${connection.escape(
      req.params.id
    )}`;

    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        res.json({ data: filas[0] });
      } else {
        res.status(404);
        res.send({
          erros: [
            `Product not found  : ${req.params.id}`,
          ],
        });
      }
    });
    connection.release();
  });
});

app.get("/api/product/category/:category_id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM product WHERE category_id = ${connection.escape(
      req.params.category_id
    )}`;

    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        res.json({ data: filas});
      } else {
        res.status(404);
        res.send({
          erros: [
            `Category not found  : ${req.params.category_id}`,
          ],
        });
      }
    });
    connection.release();
  });
});


app.post("/api/product/", function (req, res) {

  pool.getConnection(function (err, connection) {
    const query = `INSERT INTO product (name,description,price,foto,available,category_id) VALUES (
      ${connection.escape(req.body.name)},
      ${connection.escape(req.body.description)},
      ${connection.escape(req.body.price)},
      ${connection.escape(req.body.foto)},
      ${connection.escape(req.body.available)},
      ${connection.escape(req.body.category_id)}
      );`;

    connection.query(query, function (error, filas, campos) {
      const last_id = filas.insertId;
      const queryConsulta = `SELECT * FROM product WHERE id=${connection.escape(
        last_id
      )}`;
      connection.query(queryConsulta, function (error, filas, campos) {
        res.json({ data: filas[0] });
      });
    });
    connection.release();
  });
});

app.put("/api/product/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM product WHERE id=${connection.escape(
      req.params.id
    )}`;
    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        const queryUpdate = `UPDATE product SET 
        name=${connection.escape(req.body.name)},
        description=${connection.escape(req.body.description)},
        price=${connection.escape(req.body.price)},
        foto=${connection.escape(req.body.foto)},
        available=${connection.escape(req.body.available)},
        category_id=${connection.escape(req.body.category_id)},
        WHERE id=${req.params.id}`;
        connection.query(queryUpdate, function (error, filas, campos) {
          const queryConsulta = `SELECT * FROM product WHERE id=${connection.escape(
            req.params.id
          )}`;
          connection.query(queryConsulta, function (error, filas, campos) {
            res.json({ data: filas[0] });
          });
        });
      } else {
        res.status(404);
        res.send({
          errors: [
            `Product not found  : ${req.params.id}`,
          ],
        });
      }
    });

    connection.release();
  });
});

app.put("/api/product/available/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM product WHERE id=${connection.escape(
      req.params.id
    )}`;
    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        const queryUpdate = `UPDATE product SET 
        available=${connection.escape(req.body.available)},
        WHERE id=${req.params.id}`;
        connection.query(queryUpdate, function (error, filas, campos) {
          const queryConsulta = `SELECT * FROM product WHERE id=${connection.escape(
            req.params.id
          )}`;
          connection.query(queryConsulta, function (error, filas, campos) {
            res.json({ data: filas[0] });
          });
        });
      } else {
        res.status(404);
        res.send({
          errors: [
            `Product not found  : ${req.params.id}`,
          ],
        });
      }
    });

    connection.release();
  });
});

app.delete("/api/product/:id", function (req, res) {
  pool.getConnection(function (err, connection) {
    const query = `SELECT * FROM product WHERE id=${connection.escape(
      req.params.id
    )}`;
    connection.query(query, function (error, filas, campos) {
      if (filas.length > 0) {
        const queryDelete = `DELETE FROM product WHERE id=${req.params.id}`;
        connection.query(queryDelete, function (error, filas, campos) {
          res.status(204);
          res.json();
          console.log(`Product code: ${req.params.id} delete`);
        });
      } else {
        res.status(404);
        res.send({
          errors: [
            `Product not found  : ${req.params.id}`,
          ],
        });
      }
    });
    connection.release();
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Servidor iniciado");
});
