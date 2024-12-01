// src/config.js

const config = {
  // Floor configuration
  floor: {
    width: 100,           // Width of the floor
    height: 100,          // Height of the floor
    color: 0x808080,      // Gray color
  },

  // Box configuration
  box: {
    width: 3,             // Box width
    height: 3,            // Box height
    depth: 3,             // Box depth
    color: 0x00ff00,      // Green color
    position: { x: 0, y: 1.5, z: 0 }, // Position the box above the floor
  },

  // Camera configuration
  camera: {
    fov: 75,              // Field of view
    near: 0.1,            // Near plane
    far: 1000,            // Far plane
    position: { x: 0, y: 5, z: 10 }, // Camera position
  },

  // Light configuration
  light: {
    ambient: {
      color: 0x404040,     // Ambient light color
      intensity: 2,        // Ambient light intensity
    },
    directional: {
      color: 0xffffff,     // Directional light color
      intensity: 1,        // Directional light intensity
      position: { x: 5, y: 5, z: 5 }, // Position of the directional light
    },
  },

  // Grid Helper configuration
  gridHelper: {
    enabled: false,        // Toggle grid visibility (true to show, false to hide)
    size: 100,            // Size of the grid
    divisions: 50,        // Number of divisions in the grid
  },

  // Player configuration
  player: {
    radius: 0.5,            // Player radius (since it's a ball)
    color: 0xff0000,      // Red color for the player
    speed: 0.1,           // Movement speed
    friction: 0.5,        // Friction coefficient
    jumpSpeed: 3,         // Speed when jumping
    bounceFactor: 1.7,    // Bounce factor when hitting the ground
  },

  // Movement configuration (for future extensions like keys, controls, etc.)
  movement: {
    keys: {
      W: 'W', // Move forward
      S: 'S', // Move backward
      A: 'A', // Move left
      D: 'D', // Move right
    },
  },

  // Random Objects configuration
  randomObjects: {
    count: 5,                // Number of objects to generate
    shapes: ['sphere'],         // Shapes to randomly generate
    messages: [
      "Explore me!",
      "Hidden message here",
      "Click to discover more",
      "Keep going!",
    ],                        // Array of hidden messages
    colorRange: [0x000000, 0x000000], // Color range for random objects
    sizeRange: [2, 2],        // Minimum and maximum size for objects
  },

  // Gravity and boundaries configuration
  gravity: -0.1,           // Gravity force
  floorWidth: 100,         // Floor width for boundaries
  floorHeight: 100,        // Floor height for boundaries
};

export default config;
