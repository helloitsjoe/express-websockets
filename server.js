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

// This serves index.html and other assets from the current directory.
app.use(express.static(__dirname));

let uniqueId = 0;

// Listen for clients to connect. The `ws` argument is the connected client.
wss.on('connection', ws => {
  // This is a simple way to assign a unique id to keep track of each client.
  // We mutate the `ws` object so that all clients will know who the sender is.
  ws.clientId = uniqueId++;

  // We could send simple string messages, but sending stringified objects
  // makes it easy to send different types of messages and data payloads.
  ws.send(JSON.stringify({ type: 'connection' }));

  // Listen for messages from connected clients
  ws.on('message', message => {
    const { text } = JSON.parse(message);

    // wss.clients is a Set() of all connected clients.
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'message',
            isSelf: client === ws,
            clientId: ws.clientId,
            text,
          })
        );
      }
    }
  });
});

server.listen(3000, () => {
  console.log(`Server listening on http://localhost:3000`);
  console.log(`Connect on your phone at http://${ip.address()}:3000`);
});
