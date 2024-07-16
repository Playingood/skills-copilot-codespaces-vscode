// Create web server
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Create a new user
let users = {};
let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('new user', (username) => {
    console.log('New user:', username);
    users[socket.id] = username;
    io.emit('new user', username);
  });
  socket.on('new message', (message) => {
    console.log('New message:', message);
    messages.push(message);
    io.emit('new message', message);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', users[socket.id]);
    io.emit('user disconnected', users[socket.id]);
    delete users[socket.id];
  });
  socket.on('get users', () => {
    console.log('Get users');
    io.emit('get users', Object.values(users));
  });
  socket.on('get messages', () => {
    console.log('Get messages');
    io.emit('get messages', messages);
  });
});

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});