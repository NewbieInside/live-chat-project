
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// init socket io
const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users

socket.on('roomUsers', ({ room, users }) => {
  showRoomName(room);
  showUsers(users)
})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  showRoomName(room);
  showUsers(users);
});

// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

const showRoomName = room => {
  roomName.innerText = room;
}

const showUsers = users => {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}



