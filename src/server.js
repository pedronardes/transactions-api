const express = require("express");
const app = express();

const { uuid } = require("uuidv4");

app.use(express.json());

const transactions = [];

function validateID(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: `Param sent is not a valid UUid` });
  }
  next();
}

app.use("/:id", validateID);

app.get("/", (req, res) => {
  return res.json(transactions);
});

app.post("/", (req, res) => {
  const { title, value, type } = req.body;

  const transaction = { id: uuid(), title, value, type };

  transactions.push(transaction);

  return res.json(transaction);
});

app.put("/:id", (request, response) => {
  const { id } = request.params;
  const { title, value, type } = request.body;

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id == id
  );

  if (transactionIndex < 0) {
    return response.status(400).json({ error: "Project not found." });
  }

  const transaction = {
    id,
    title,
    value,
    type,
  };

  transactions[transactionIndex] = transaction;

  return response.json(transaction);
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;

  const transactionID = transactions.findIndex(
    (transaction) => transaction.id == id
  );

  if (transactionID < 0) {
    return response.status(400).json({ error: "project not found." });
  }

  transactions.splice(transactionID, 1);

  return res.status(204).send();
});

const port = 3000;
app.listen(port, () => {
  console.log("app is running in localhost:3000");
});
