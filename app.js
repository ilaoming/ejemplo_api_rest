require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api_info = require('./routes/api_info')
const category = require('./routes/category')
const product = require('./routes/product')

const cors = require('cors')
const PORT = process.env.PORT || 5000;


//Home
app.get("/", function (req, res) {
  res.send(api_info);
});

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(category)
app.use(product)


app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
})
