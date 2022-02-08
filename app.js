require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api_info = require('./routes/api_info')
const category = require('./routes/category')
const product = require('./routes/product')
const allow_cross_domain = require('./allowCrossDomain')

const PORT = process.env.PORT || 3000;


//Home
app.get("/", function (req, res) {
  res.send(api_info);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(allow_cross_domain)
app.use(category)
app.use(product)


app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
})
