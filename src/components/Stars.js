import * as THREE from 'three';
import config from '../config'; // Import the config to access floor size

const createStarField = (numStars) => {
  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numStars * 3); // x, y, z for each star
  const sizes = new Float32Array(numStars); // Sizes of each star
  const colors = new Float32Array(numStars * 3); // RGB values for each star color
  const opacities = new Float32Array(numStars); // Opacity values for each star

  const floorWidth = config.floor.width; // Access floor width from config
  const floorHeight = config.floor.height; // Access floor height from config

  // Create random positions, sizes, colors, and opacities for each star
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * (floorWidth + 500); // Random x position outside the floor width
    const y = Math.random() * 200 + (-100); // Random y position below and above the floor (-100 to +100)
    const z = (Math.random() - 0.5) * (floorHeight + 500); // Random z position outside the floor height

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Random star size between 0.1 and 0.3
    sizes[i] = Math.random() * 0.3 + 0.2;

    // Random color (stars vary from blue to red)
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    colors[i * 3] = r * 0.5 + 0.5;  // Add more white for realistic colors
    colors[i * 3 + 1] = g * 0.5 + 0.5;
    colors[i * 3 + 2] = b * 0.5 + 0.5;

    // Random opacity between 0.3 and 1.0 (fainter stars will appear)
    opacities[i] = Math.random() * 0.7 + 0.3;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Add size attribute
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Add color attribute
  starsGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1)); // Add opacity as an attribute

  const starsMaterial = new THREE.PointsMaterial({
    vertexColors: true, // Enable color for each vertex (star)
    size: 0.2, // Default size for stars
    sizeAttenuation: true,
    transparent: true,
    opacity: 1.0,
  });

  const starField = new THREE.Points(starsGeometry, starsMaterial);

  // Add an `update` method for smooth real-time glow animation
  let time = 0; // This will help animate the glow over time

  starField.update = () => {
    time += 0.01; // Increment time to create smooth animation

    const opacityAttr = starField.geometry.attributes.opacity;
    const sizeAttr = starField.geometry.attributes.size;

    for (let i = 0; i < opacityAttr.count; i++) {
      // Smooth sine wave oscillation for opacity change with a more complex pattern
      opacityAttr.array[i] = Math.sin(time + i * 0.1) * 0.4 + 0.6; // Oscillates between 0.3 and 1.0
      sizeAttr.array[i] = sizes[i] + Math.sin(time + i * 0.1) * 0.05; // Slight size pulsing for added realism
    }

    opacityAttr.needsUpdate = true; // Flag WebGL to update opacity buffer
    sizeAttr.needsUpdate = true; // Flag WebGL to update size buffer
  };

  return starField;
};

export default createStarField;
