import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Initialiser le joueur sur le serveur
export const initPlayer = (playerData) => {
  socket.emit('initPlayer', playerData);
};

// Mettre à jour la position du joueur
export const updatePlayer = (playerData) => {
  socket.emit('updatePlayer', playerData);
};

// Écouter les mises à jour du monde
export const onWorldUpdate = (callback) => {
  socket.on('currentWorldState', callback);
  socket.on('newPlayer', (data) => callback({ type: 'newPlayer', data }));
  socket.on('updatePlayer', (data) => callback({ type: 'updatePlayer', data }));
  socket.on('removePlayer', (id) => callback({ type: 'removePlayer', id }));
  socket.on('newWorldGenerated', (data) => callback({ type: 'newWorldGenerated', data }));
};

// Générer un nouveau monde
export const generateWorld = (newWorldData) => {
  socket.emit('generateWorld', newWorldData);
};

export default socket;
