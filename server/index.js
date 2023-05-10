import express from 'express';
import bodyParser from 'body-parser';
import { authorize, getMenu, refreshMenu, writeTransaction, formatColumn } from './google.js';

const PORT = 3001;
const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

/*
 * Forces the menu cache to refresh
 */
app.post("/menu", (req, res) => {
  authorize().then(refreshMenu).then((data) => {
    res.json({ success: true });
  }).catch((err) => {
    res.status(400).send({ message: err });
  });
});

/*
 * Responds with the menu in the following format
 * {
 *    tags: ["id", "name", "price", "category", "stock"],
 *    ids: [<item ids in google sheets order>],
 *    values: {
 *      <id> : [<as tags above>]
 *      ...
 *    }
 * }
 */
app.get("/menu", (req, res) => {
  authorize().then(getMenu).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(400).send({ message: err });
  });
});

/**
 * body: {email: <email>, order: [{id: <id>, count: <count>}]}
 * responds with {finalDebt: <debt after transaction>}
 */
app.post("/transaction", (req, res) => {
  authorize().then((auth) => writeTransaction(auth, req.body)).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(400).send({ message: err });
  });
});

/*
 * Reformats the column specified by body: {col: <col>}
 * One column is one email
 */
app.post("/format", (req, res) => {
  authorize().then((auth) => formatColumn(auth, body.col)).then((data) => {
    res.json({ success: true });
  }).catch((err) => {
    res.status(400).send({ message: err });
  });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
//Try authorizing once to make sure refresh token is stored
authorize();