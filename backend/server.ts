import express from 'express';
import router from './routes/api';
const app = express();

/**
 * Middleware. 
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);

const PORT = 8080;

app.listen( PORT, () => {
  console.log(`Express server started on http://localhost:${PORT}`);
});
