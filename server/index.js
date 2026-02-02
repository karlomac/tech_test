const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cors = require("cors");
const { calculateScore } = require('./scrabbleScorer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

app.post('/api/scrabble-score', (req, res) => {
  try {
    const { word } = req.body;
    const result = calculateScore(word);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  // Server started - logging handled by express-pino-logger middleware
});
