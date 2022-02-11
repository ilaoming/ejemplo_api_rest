require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const api_info = require('./routes/api_info')
const category = require('./routes/category')
const product = require('./routes/product')
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: 'GET, PUT, POST, DELETE, OPTIONS'
}

//headers 
app.use(cors(corsOptions))

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
