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

// Keep track of connected clients
const clients = {};
let uniqueId = 0;

// Listen for clients to connect. The `ws` argument
// in the callback is the connected client.
wss.on('connection', ws => {
  const connectionId = uniqueId++;
  clients[connectionId] = ws;
  ws.send(JSON.stringify({ type: 'connected', clientId: connectionId }));

  // Listen for messages from connected clients
  ws.on('message', message => {
    const { text, clientId } = JSON.parse(message);

    // Broadcast to all clients
    Object.values(clients).forEach(client => {
      // This will broadcast to ALL connected clients, including sender
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'message',
            self: client === ws,
            clientId,
            text,
          })
        );
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
