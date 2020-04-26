const http = require('http');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const ip = require('ip');

// Set up Express, create a server using the Node http module,
// and provide that server to WebSocket.Server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// This serves index.html and any other assets it requires from the current directory.
app.use(express.static(__dirname));

// Listen for clients to connect. The `ws` argument
// in the callback is the connected client.
wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'message', text: 'connected!' }));

  // Listen for messages from connected clients
  ws.on('message', message => {
    console.log('Received a message:', message);

    // Broadcast to all clients
    wss.clients.forEach(client => {
      // This will broadcast only to clients OTHER than the sender
      // if (client !== ws && client.readyState === WebSocket.OPEN) {
      //   const { text } = JSON.parse(message);
      //   client.send(JSON.stringify({ type: 'message', text }));
      // }

      // This will broadcast to ALL connected clients, including sender
      if (client.readyState === WebSocket.OPEN) {
        const { text } = JSON.parse(message);
        client.send(JSON.stringify({ type: 'message', text, self: client === ws }));
      }
    });
  });

  // Heartbeat isn't necessary, just proves that server can push data to clients
  setInterval(() => {
    const time = new Date().toLocaleTimeString();
    ws.send(JSON.stringify({ type: 'heartbeat', text: `Heartbeat ${time}` }));
  }, 1000);
});

server.listen(3000, () => {
  console.log(`Server listening on http://localhost:3000`);
  console.log(`Connect on your phone at http://${ip.address()}:3000`);
});
