// This is just using vanilla JS, if you're building a real app
// you would probably want to use a framework (e.g. React).

const box = document.getElementById('box');
const form = document.getElementById('form');
const input = document.getElementById('input');
const button = document.getElementById('button');
const username = document.getElementById('username');
const heartbeat = document.getElementById('heartbeat');
const connected = document.getElementById('connected');
const closeButton = document.getElementById('close-button');

let messages = [];

const fetchData = () => {
  return fetch('/data')
    .then(res => res.json())
    .then(data => {
      if (messages.length === data.length) {
        return;
      }

      for (const { text, user, id } of data) {
        console.log(id);
        if (messages.find(m => m.id === id)) {
          console.log(`Skipping`);
          continue;
        }

        const isSelf = user === username.value;

        const bubble = document.createElement('div');
        bubble.classList.add('bubble', isSelf ? 'us' : 'them');
        bubble.innerText = text;
        box.appendChild(bubble);

        if (!isSelf) {
          const info = document.createElement('p');
          info.classList.add('info');
          info.innerText = `SENT FROM USER ${user}`;
          box.appendChild(info);
        }
      }
      messages = data;
    });
};

const poll = () => {
  setTimeout(() => {
    fetchData().then(() => {
      poll();
    });
  }, 1000);
};

fetchData();
poll();

// Focus the message on page load
input.focus();

form.onsubmit = e => {
  e.preventDefault();

  const text = input.value;
  const user = username.value;

  if (!text) {
    return;
  }

  fetch('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, text }),
  });

  input.value = '';
};
