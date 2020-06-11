const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrUser, userLeave, userRoom } = require('./utils/users');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// Admin

const admin = 'Админ Котофей';

// Running on client's connect

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Single client emit and welcome current user
    socket.emit('message', formatMessage(admin, 'Добро пожаловать в чат!'));

    // Broadcasting when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(admin, `К нам присоеденился новый котик, ${user.username}`)
      ); // emit to everybody except the user

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: userRoom(user.room),
    });
  });

  // Listen for chat message

  socket.on('chatMessage', msg => {
    const user = getCurrUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs on client's dissconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(admin, `${user.username} вышел из чата котиков`)
      );
    }
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: userRoom(user.room),
    });
  });

  // Broadcast to all the clients in general
  // io.emit();
});

server.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`);
});
