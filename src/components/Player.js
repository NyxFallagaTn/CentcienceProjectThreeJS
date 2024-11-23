import * as THREE from 'three';
import config from '../config'; // Import config

const Player = () => {
  const ballGeometry = new THREE.SphereGeometry(config.player.radius, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: config.player.color });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);

  // Initial position and velocity
  const position = new THREE.Vector3(0, 1, 0);
  const velocity = new THREE.Vector3(0, 0, 0);
  const acceleration = new THREE.Vector3(0, 0, 0);
  const friction = config.player.friction;
  const speed = config.player.speed;

  // Gravity and jump mechanics
  const gravity = -0.1;  // Downward force
  let isJumping = false; // To track if the player is already jumping
  const jumpSpeed = 3;   // Initial upward speed when jumping
  const bounceFactor = 1.7; // Bounciness after hitting the ground

  // Get floor space boundaries from config
  const floorWidth = config.floor.width;  // Defined in config.js
  const floorHeight = config.floor.height; // Defined in config.js

  ball.position.copy(position);

  const keyState = {
    Z: false, S: false, Q: false, D: false, ' ': false, Control: false,
  };

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    if (keyState.hasOwnProperty(key)) {
      keyState[key] = true;
    }
  };

  const handleKeyUp = (event) => {
    const key = event.key.toUpperCase();
    if (keyState.hasOwnProperty(key)) {
      keyState[key] = false;
    }
  };

  const calculateMovement = () => {
    acceleration.set(0, 0, 0);
    if (keyState.Z) acceleration.z = -speed;
    if (keyState.S) acceleration.z = speed;
    if (keyState.Q) acceleration.x = -speed;
    if (keyState.D) acceleration.x = speed;

    // Jumping effect when spacebar is pressed
    if (keyState[' ']) {
      if (!isJumping) {  // Prevent double jumping
        velocity.y = jumpSpeed;  // Set upward velocity for jumping
        isJumping = true;
      }
    }

    // Apply gravity and simulate mirrored jump and fall
    if (ball.position.y > 1) {
      // Ball is going up
      velocity.y += gravity;  // Gravity pulling it down
    } else {
      // Ball hits the ground
      if (velocity.y < 0) {
        velocity.y = -velocity.y * bounceFactor;  // Invert velocity with bounce factor
        if (Math.abs(velocity.y) < 0.1) {
          velocity.y = 0;  // Stop bouncing when the velocity is small enough
          isJumping = false;  // Allow jumping again
        }
      }
      ball.position.y = 1;  // Keep the player on the ground level (y = 1)
    }

    // Apply horizontal movement (XZ plane)
    const totalMovement = acceleration.length();
    if (totalMovement > 0) {
      acceleration.normalize().multiplyScalar(speed);
    }
  };

  const update = () => {
    velocity.multiplyScalar(friction);
    calculateMovement();
    velocity.add(acceleration);
    ball.position.add(velocity);

    // Limit the ball's position to stay within the floor space
    if (ball.position.x < -floorWidth / 2) ball.position.x = -floorWidth / 2;
    if (ball.position.x > floorWidth / 2) ball.position.x = floorWidth / 2;

    if (ball.position.z < -floorHeight / 2) ball.position.z = -floorHeight / 2;
    if (ball.position.z > floorHeight / 2) ball.position.z = floorHeight / 2;

    // Rotation effect based on movement speed
    const rotationSpeed = velocity.length() * 0.1;
    ball.rotation.x += rotationSpeed;
    ball.rotation.y += rotationSpeed;
    ball.rotation.z += rotationSpeed;

    acceleration.set(0, 0, 0);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return { ball, update, cleanup: () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  }};
};

export default Player;
