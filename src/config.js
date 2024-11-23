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
    enabled: true,        // Toggle grid visibility (true to show, false to hide)
    size: 100,            // Size of the grid
    divisions: 50,        // Number of divisions in the grid
  },

  // Player configuration
  player: {
    radius: 1,            // Player radius (since it's a ball)
    color: 0xff0000,      // Red color for the player
    speed: 0.1,           // Movement speed
    friction: 0.5,        // Friction coefficient
  },

  // Movement configuration (for future extensions like keys, controls, etc.)
  movement: {
    keys: {
      Z: 'Z',             // Move up
      S: 'S',             // Move down
      Q: 'Q',             // Move left
      D: 'D',             // Move right
      space: ' ',         // Space for jumping or moving up
    }
  },
};

export default config;
