const users = [];


 // Users join to chat

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

const getCurrUser = (id) => {
  return users.find((user) => user.id === id);
};

const userLeave = id => {
  const userIdx = users.findIndex(user => user.id === id);

  if(userIdx !== -1) {
    return users.splice(userIdx, 1)[0];
  }
}

const userRoom = room => {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrUser,
  userLeave,
  userRoom,
};
