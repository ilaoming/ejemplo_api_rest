const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require('cors')

var pool = mysql.createPool({
  connectionLimit: 100,
  host: "us-cdbr-east-05.cleardb.net",
  user: "b6175f675c62a8",
  password: "d1812fb5",
  database: "heroku_ab3189222e34410",
});

let whitelist = ['*']
// let corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// Example app.use(cors({origin: whitelist}))

//mysql://b6175f675c62a8:d1812fb5@us-cdbr-east-05.cleardb.net/heroku_ab3189222e34410?reconnect=true

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(allowCrossDomain);

app.get("/", function (req, res) {
  const apiData = [
    [
      "Return all categories",
      "https://laomingcode-node-mysql.herokuapp.com/api/category",
    ],
    [
      "Return category by id",
      "https://laomingcode-node-mysql.herokuapp.com/api/category/:id",
      "Example: https://laomingcode-node-mysql.herokuapp.com/api/category/1",
    ],
    [
      "Return all products",
      "https://laomingcode-node-mysql.herokuapp.com/api/product",
    ],
    [
      "Return product by id",
      "https://laomingcode-node-mysql.herokuapp.com/api/product/:id",
      "Example: https://laomingcode-node-mysql.herokuapp.com/api/product/1",
    ],
    [
      "Return product by category",
      "https://laomingcode-node-mysql.herokuapp.com/api/product/category/:category_id",
      "Example: https://laomingcode-node-mysql.herokuapp.com/api/product/category/1",
    ],
    [
      "Post category *required 'name' in the body",
      "https://laomingcode-node-mysql.herokuapp.com/api/category/",
    ],
    [
      "Post product *required 'name,description,price,foto,available,category_id' in the body",
      "https://laomingcode-node-mysql.herokuapp.com/api/product/",
    ],
  ];
  res.send(apiData);
});

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
      if (filas.length > 0) {
        res.json({ data: filas[0] });
      } else {
        res.send({ errors: [`Category not found: ${req.params.id}`] });
      }
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
      const queryConsulta = `SELECT * FROM category WHERE id=${connection.escape(
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
          errors: [`Product not found  : ${req.params.id}`],
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
        res.json({ data: filas });
      } else {
        res.status(404);
        res.send({
          errors: [`Category not found  : ${req.params.category_id}`],
        });
      }
    });
    connection.release();
  });
});

app.post("/add/product/", function (req, res) {
  pool.getConnection(function (err, connection) {
    const URL_ = req.body.url;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const picture = req.body.picture;
    const available = req.body.available;
    const category_id = req.body.category_id;
    const query = `
    INSERT INTO
    product
    (
      name,
      description,
      price,
      picture,
      available,
      category_id
    ) VALUES 
    (
      ${connection.escape(name)},
      ${connection.escape(description)},
      ${connection.escape(price)},
      ${connection.escape(picture)},
      ${connection.escape(available)},
      ${connection.escape(category_id)}
    )`;
    if (
      name == "" ||
      description == "" ||
      price == "" ||
      category_id == "" ||
      picture == ""
    ) {
      res.send({
        errors: [`There are empty fields`],
      });
    } else {
      connection.query(query, function (error, filas, campos) {
        res.status(200);
        res.redirect(URL_);
      });
    }

    connection.release();
  });
});

app.put("/apiV1/product/:id", function (req, res) {
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const picture = req.body.picture;
  const category_id = req.body.category_id;
  console.log(req.params.id);

  pool.getConnection(function (err, connection) {
    const queryUpdate = `UPDATE product SET 
        name=${connection.escape(name)},
        description=${connection.escape(description)},
        price=${connection.escape(price)},
        picture=${connection.escape(picture)},
        category_id=${connection.escape(category_id)}
        WHERE id=${req.params.id}`;
      if (
        name == "" ||
        description == "" ||
        price == "" ||
        category_id == "" ||
        picture == ""
      ) {
        res.send({
          errors: [`There are empty fields`],
        });
      } else {
        connection.query(queryUpdate, function (error, filas, campos) {
          res.status(200)
          res.send('Update success')
        });
      }


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
          errors: [`Product not found  : ${req.params.id}`],
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
          errors: [`Product not found  : ${req.params.id}`],
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
