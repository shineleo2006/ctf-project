const socket = io();

const query = new URLSearchParams(window.location.search);
const username = query.get('username');
const room = query.get('room');

if (!username || !room) {
  window.location.href = '/';
}

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const userOnline = document.getElementById('user-online');
document.getElementById('room-name').textContent = `Room: ${room}`;
socket.emit('join-room', { username, room });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    socket.emit('chat message', { user: username, text, room });
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  const sender = msg.user === username ? 'You' : msg.user;
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  li.innerHTML = `
    <div><strong>${sender}:</strong> ${msg.text}</div>
    <small style=" display:block; color: #777; margin-top: -3px; font-size:10px">${time}</small>
  `;
  li.className = msg.user === username ? 'sent' : 'received';
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('message-history', (msgs) => {
  messages.innerHTML = '';
  msgs.forEach(msg => {
    const li = document.createElement('li');
    const sender = msg.user === username ? 'You' : msg.user;
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    li.innerHTML = `<div><strong>${sender}:</strong> ${msg.text}</div>
    <small style=" display:block; color: #777; margin-top: -3px; font-size:10px">${time}</small>
  `;
    li.className = msg.user === username ? 'sent' : 'received';
    messages.appendChild(li);
  });
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user-list', (users) => {
  userOnline.textContent = users.join(', ');
});

socket.on('user-connected', name => {
  const li = document.createElement('li');
  li.innerHTML = `<p style="text-align: center; background:gray;">${name} joined </p>`;
  messages.appendChild(li);
});

socket.on('user-disconnected', name => {
  const li = document.createElement('li');
  li.textContent = `${name} left`;
  messages.appendChild(li);
});
