const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrUser } = require('./utils/users');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// Admin

const admin = 'Админ Котофей';

// Running on client's connect

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Single client emit and welcome current user
    socket.emit('message', formatMessage(admin, 'Добро пожаловать в чат!'));

    // Broadcasting when a user connects
    socket.broadcast.to(user.emit).emit(
      formatMessage(admin, `${user.username}  has joined the Chatter`)); // emit to everybody except the user
  });

  // Listen for chat message

  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });

  // Runs on client's dissconnect
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(admin, 'User has left the chat.'));
  });


  // Broadcast to all the clients in general
  // io.emit();
});

server.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`);
});
