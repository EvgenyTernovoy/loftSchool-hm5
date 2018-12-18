const socket = require('socket.io');

let clients = {};

const initSocket = server => {
  const io = socket.listen(server);

  io.on('connection', socket => {
    const { username } = socket.handshake.headers;
    const newUser = {id: socket.id, username};
    clients[socket.id] = newUser;

    socket.emit('all users', clients);
    socket.broadcast.emit('new user', newUser);

    socket.on('chat message', (message, id) => {
      io.sockets.sockets[id].emit('chat message', message, newUser.id);
    });

    socket.on('disconnect', (mes) => {
      socket.broadcast.emit('delete user', newUser.id);
      delete clients[newUser.id];
    });
  });
};

module.exports = initSocket;
