// src/components/Lights.js
import * as THREE from 'three';
import config from '../config'; // Import config

const Lights = () => {
  const { ambient, directional } = config.light; // Destructure light config

  // Add ambient light using config
  const ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity);

  // Add directional light using config
  const directionalLight = new THREE.DirectionalLight(directional.color, directional.intensity);
  directionalLight.position.set(directional.position.x, directional.position.y, directional.position.z);

  return { ambientLight, directionalLight };
};

export default Lights;
