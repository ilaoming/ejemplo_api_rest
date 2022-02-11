require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api_info = require('./routes/api_info')
const category = require('./routes/category')
const product = require('./routes/product')
const PORT = process.env.PORT || 3000;

//headers 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  app.options('*', (req, res) => {
      // allowed XHR methods  
      res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
      res.send();
  });
});

//Home
app.get("/", function (req, res) {
  res.send(api_info);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Use routes
app.use(category)
app.use(product)


//Run App
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
})
