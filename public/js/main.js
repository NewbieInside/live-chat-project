// init socket io
const socket = io();
const chatForm = document.getElementById('chat-form');

// Message from server
socket.on('message', (message) => {
  outPutMessage(message);
});

// Message Submit

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const message = e.target.elements.msg.value;
  

  // emit message to the server
  socket.emit('chatMessage', message);
});

// Output message to DOM

const outPutMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `	<p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};
