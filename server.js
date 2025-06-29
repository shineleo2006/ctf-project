const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));

const rooms = {};

io.on('connection', socket => {
  socket.on('join-room', ({ username, room }) => {
    if (!rooms[room]) {
      rooms[room] = { users: {}, messages: [] };
    }

    const currentRoom = rooms[room];
    const existingUser = Object.values(currentRoom.users).includes(username);
    if (existingUser) {
      socket.emit('error', 'Username already taken in this room');
      return;
    }

    socket.join(room);
    currentRoom.users[socket.id] = username;

    socket.emit('message-history', currentRoom.messages);
    io.to(room).emit('user-list', Object.values(currentRoom.users));
    socket.to(room).emit('user-connected', username);

    socket.on('chat message', msg => {
      const message = {
        user: msg.user,
        text: msg.text,
        timestamp: new Date(),
      };
      currentRoom.messages.push(message);
      io.to(room).emit('chat message', message);
    });

    socket.on('disconnect', () => {
      const name = currentRoom.users[socket.id];
      delete currentRoom.users[socket.id];
      socket.to(room).emit('user-disconnected', name);
      io.to(room).emit('user-list', Object.values(currentRoom.users));

      // Delete room if empty
      if (Object.keys(currentRoom.users).length === 0) {
        delete rooms[room];
        console.log(`Room '${room}' deleted`);
      }
    });
  });
});

server.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
