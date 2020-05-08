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

module.exports = {
  userJoin,
  getCurrUser,
};
