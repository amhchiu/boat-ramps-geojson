const express = require('express');
const app = express();
const router = require('./routes/api');
  
const PORT = 8081;

app.use('/', router);

app.listen( PORT, () => {
  console.log(`Express server started on http://localhost:${PORT}`);
});