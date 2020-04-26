// This is about as simple as it gets. You would probably want to
// use a framework (e.g. React) if you're building up a real app.

const box = document.getElementById('box');
const form = document.getElementById('form');
const input = document.getElementById('input');
const button = document.getElementById('button');
const heartbeat = document.getElementById('heartbeat');
const connected = document.getElementById('connected');
const closeButton = document.getElementById('close-button');

const ws = new WebSocket('ws://localhost:3000');
// let myId = null;

ws.onopen = e => {
  closeButton.disabled = false;
  closeButton.onclick = () => ws.close();
};

ws.onmessage = message => {
  const { type, self, text, clientId } = JSON.parse(message.data);

  switch (type) {
    case 'message': {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble', self ? 'us' : 'them');
      bubble.innerText = text;
      box.appendChild(bubble);

      if (!self) {
        const info = document.createElement('p');
        info.classList.add('info');
        info.innerText = `SENT FROM USER ${clientId}`;
        box.appendChild(info);
      }
      break;
    }
    case 'heartbeat': {
      // heartbeat.innerText = text;
      console.log(text);
      break;
    }
    case 'connected': {
      connected.innerText = 'CONNECTED!';
      // myId = clientId;
      break;
    }
    default:
      return;
  }
};

ws.onclose = e => console.log('closing...');

form.onsubmit = e => {
  e.preventDefault();

  const text = input.value;
  const message = JSON.stringify({ text });

  ws.send(message);

  input.value = '';
};
