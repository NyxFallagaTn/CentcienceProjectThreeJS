// src/components/Camera.js
import * as THREE from 'three';
import config from '../config'; // Import config

const Camera = () => {
  const { fov, near, far, position } = config.camera; // Destructure camera config

  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(position.x, position.y, position.z); // Set camera position from config
  return camera;
};

export default Camera;
