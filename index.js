const box = document.getElementById('box');
const form = document.getElementById('form');
const input = document.getElementById('input');
const button = document.getElementById('button');
const heartbeat = document.getElementById('heartbeat');
const closeButton = document.getElementById('close-button');

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  closeButton.disabled = false;
  closeButton.onclick = () => ws.close();
};

ws.onmessage = message => {
  const json = JSON.parse(message.data);

  if (json.type === 'heartbeat') {
    // heartbeat.innerText = json.text;
    return;
  }

  const bubble = document.createElement('div');
  bubble.classList.add('bubble', 'them');
  bubble.innerText = json.text;
  box.appendChild(bubble);
};

ws.onclose = e => console.log('closing...');

form.onsubmit = e => {
  e.preventDefault();

  const text = input.value;
  const message = JSON.stringify({ text });

  const usBubble = document.createElement('div');
  usBubble.classList.add('bubble', 'us');
  usBubble.innerText = text;
  box.appendChild(usBubble);

  ws.send(message);

  input.value = '';
};
