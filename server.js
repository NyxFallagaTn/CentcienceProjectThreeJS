const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let worldState = {
  players: {}, // Stocke les positions des joueurs
  randomObjects: [], // Objets partagés du monde
};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Initialiser le joueur
  socket.on('initPlayer', (playerData) => {
    worldState.players[socket.id] = playerData;
    socket.emit('currentWorldState', worldState);
    socket.broadcast.emit('newPlayer', { id: socket.id, ...playerData });
  });

  // Mise à jour de la position du joueur
  socket.on('updatePlayer', (playerData) => {
    if (worldState.players[socket.id]) {
      worldState.players[socket.id] = playerData;
      socket.broadcast.emit('updatePlayer', { id: socket.id, ...playerData });
    }
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    if (worldState.players[socket.id]) {
      console.log(`Player disconnected: ${socket.id}`);
      delete worldState.players[socket.id]; // Supprimer le joueur du monde
      io.emit('removePlayer', socket.id);   // Informer les autres clients
    }
  });

  // Générer un nouveau monde
  socket.on('generateWorld', (newWorldData) => {
    worldState.randomObjects = newWorldData.randomObjects;
    io.emit('newWorldGenerated', {
      randomObjects: worldState.randomObjects,
      players: worldState.players // Inclure uniquement les joueurs actifs
    });
  });

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
