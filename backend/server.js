const express = require('express');
const app = express();
const router = require('./routes/api');

/**
 * Middleware. 
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);

const PORT = 8081;

app.listen( PORT, () => {
  console.log(`Express server started on http://localhost:${PORT}`);
});
