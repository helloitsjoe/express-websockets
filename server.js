const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log('Received a message:', message);
    wss.clients.forEach(client => {
      // This will broadcast only to OTHER connected clients
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const { text } = JSON.parse(message);
        console.log(`text:`, text);
        client.send(JSON.stringify({ type: 'message', text }));
        return;
      }

      // This will broadcast to ALL connected clients (including self)
      // if (client.readyState === WebSocket.OPEN) {
      //   client.send(JSON.stringify({ type: 'message', text: 'Hello from server!' }));
      // }
    });
  });

  ws.send(JSON.stringify({ type: 'message', text: 'connected!' }));

  let count = 1;
  setInterval(() => {
    // Test that the server can push new data
    ws.send(JSON.stringify({ type: 'heartbeat', text: `Heartbeat ${count++}` }));
  }, 1000);
});

server.listen(3000, () => {
  console.log(`Server listening on https://localhost:3000`);
});
