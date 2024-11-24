// Stars.js
import * as THREE from 'three';
import config from '../config'; // Import the config to access floor size

const createStarField = (numStars) => {
  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numStars * 3); // x, y, z for each star

  const floorWidth = config.floor.width; // Access floor width from config
  const floorHeight = config.floor.height; // Access floor height from config

  for (let i = 0; i < numStars * 3; i++) {
    if (i % 3 === 0) { // For x coordinate
      positions[i] = (Math.random() - 0.5) * (floorWidth + 300); // Random x position outside the floor width
    } else if (i % 3 === 1) { // For y coordinate
      positions[i] = Math.random() * 200 + (-100); // Random y position below and above the floor (-100 to +100)
    } else if (i % 3 === 2) { // For z coordinate
      positions[i] = (Math.random() - 0.5) * (floorHeight + 400); // Random z position outside the floor height
    }
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    sizeAttenuation: true,
  });

  return new THREE.Points(starsGeometry, starsMaterial);
};

export default createStarField;