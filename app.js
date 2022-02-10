require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const api_info = require('./routes/api_info')
const category = require('./routes/category')
const product = require('./routes/product')
const cors = require('cors')
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: ['http://127.0.0.1:5500','*'],
  credentials: true
}))


//Home
app.get("/", function (req, res) {
  res.send(api_info);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(category)
app.use(product)


//Run App
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
})
