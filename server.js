const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const ip = require('ip');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

// This serves index.html and other assets from the current directory.
app.use(express.static(__dirname));

const messages = [];
let uniqueId = 0;

app.get('/data', (req, res) => {
  res.send(JSON.stringify(messages));
});

app.post('/data', (req, res) => {
  console.log(`req.body:`, req.body);
  messages.push({ ...req.body, id: uniqueId++ });
  res.send(JSON.stringify(messages));
});

server.listen(3000, () => {
  console.log(`Server listening on http://localhost:3000`);
  console.log(`Connect on your phone at http://${ip.address()}:3000`);
});
