import express from 'express';
import bodyParser from 'body-parser';
import { authorize, getMenu, writeTransaction } from './google.js';

const PORT = 3001;
const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.get("/menu", (req, res) => {
  authorize().then(getMenu).then((data) => {
    res.json(data);
  })
});
app.post("/transaction", (req, res) => {
  authorize().then((auth) => writeTransaction(auth, req.body)).then((data) => {
    res.json(data);
  })
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});