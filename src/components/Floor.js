// src/components/Floor.js
import * as THREE from 'three';
import config from '../config'; // Import config

const Floor = () => {
  const { width, height, color } = config.floor; // Destructure the floor config

  const floorGeometry = new THREE.PlaneGeometry(width, height);
  const floorMaterial = new THREE.MeshLambertMaterial({ color }); // Use color from config
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate floor to make it flat
  return floor;
};

export default Floor;
