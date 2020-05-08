const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// Running on client's connect

io.on('connection', socket => {

  // Single client emit and welcome current user
  socket.emit('message', 'Welcome to Chatter Brother!');

  // Broadcasting when a user connects
  socket.broadcast.emit('message', 'User has joined the Chatter!'); // emit to everybody except the user

  // Runs on client's dissconnect

  socket.on('disconnect', () => {
    io.emit('message', 'User hast left the chat.');
  })

  // Listen for chat message

  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  })
  // Broadcast to all the clients in general

  // io.emit();
})

server.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`)
})



