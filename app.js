require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const api_info = require('./routes/api_info')
const category = require('./routes/category')
const product = require('./routes/product')
const PORT = process.env.PORT || 3000;

app.all('*', function(req, res,next) {
  /**
   * Response settings
   * @type {Object}
   */
  let responseSettings = {
      "AccessControlAllowOrigin": '*',
      "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
      "AccessControlAllowCredentials": true
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
      res.send(200);
  }
  else {
      next();
  }

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
