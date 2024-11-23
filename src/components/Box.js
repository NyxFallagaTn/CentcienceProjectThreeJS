// src/components/Box.js
import * as THREE from 'three';
import config from '../config'; // Import config

const Box = () => {
  const { width, height, depth, color, position } = config.box; // Destructure box config

  const boxGeometry = new THREE.BoxGeometry(width, height, depth); // Use size from config
  const boxMaterial = new THREE.MeshLambertMaterial({ color }); // Use color from config
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(position.x, position.y, position.z); // Set position from config
  return box;
};

export default Box;
