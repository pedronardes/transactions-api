const express = require("express");
const app = express();

const { uuid, isUuid } = require("uuidv4");

app.use(express.json());

const transactions = [];

function log(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

app.use(log);

function validateID(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: `Param sent is not a valid UUid` });
  }
  next();
}

app.get("/", (req, res) => {
  return res.json(transactions);
});

app.post("/", (req, res) => {
  const { title, value, type } = req.body;

  const transaction = { id: uuid(), title, value, type };

  transactions.push(transaction);

  return res.json(transaction);
});

app.put("/:id", validateID, (request, response) => {
  const { id } = request.params;
  const { title, value, type } = request.body;

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id == id
  );

  const transaction = {
    id,
    title,
    value,
    type,
  };

  transactions[transactionIndex] = transaction;

  return response.json(transaction);
});

app.delete("/:id", validateID, (req, res) => {
  const { id } = req.params;

  const transactionID = transactions.findIndex(
    (transaction) => transaction.id == id
  );

  transactions.splice(transactionID, 1);

  return res.status(204).send();
});

const port = 3000;
app.listen(port, () => {
  console.log("app is running in localhost:3000");
});
