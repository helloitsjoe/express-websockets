// This is vanilla JS, if you're building a real app
// you would probably want to use a framework (e.g. React).

const box = document.getElementById('box');
const form = document.getElementById('form');
const input = document.getElementById('input');
const connected = document.getElementById('connected');
const closeButton = document.getElementById('close-button');

// Make WebSocket connection to server. `window.location.hostname` will
// work on both localhost or the IP address (for connecting a mobile device)
const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

// Focus the message on page load
input.focus();

// Called when the connection opens
ws.onopen = e => {
  closeButton.disabled = false;
  closeButton.onclick = () => ws.close();
};

// Called every time a message is received from the server
ws.onmessage = message => {
  const { type, isSelf, text, clientId } = JSON.parse(message.data);

  // A switch statement is one way to handle different types of messages.
  switch (type) {
    case 'message': {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble', isSelf ? 'us' : 'them');
      bubble.innerText = text;
      box.appendChild(bubble);

      if (!isSelf) {
        const info = document.createElement('p');
        info.classList.add('info');
        info.innerText = `SENT FROM USER ${clientId}`;
        box.appendChild(info);
      }
      break;
    }
    case 'connection': {
      connected.innerText = 'CONNECTED!';
      break;
    }
    default:
      console.warn('Unrecognized message type:', type);
  }
};

// Called when either the client or server closes the connection
ws.onclose = () => {
  console.log(`Closing WebSocket...`);
  connected.innerText = 'NOT CONNECTED';

  const info = document.createElement('p');
  info.classList.add('connection');
  info.innerText = `DISCONNECTED`;
  box.appendChild(info);
};

form.onsubmit = e => {
  e.preventDefault();

  const text = input.value;

  if (!text) {
    return;
  }

  ws.send(JSON.stringify({ text }));

  input.value = '';
};
