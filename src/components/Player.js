import * as THREE from 'three';
import config from '../config';

const Player = (camera) => {
  const ballGeometry = new THREE.SphereGeometry(config.player.radius, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: config.player.color });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  

  const position = new THREE.Vector3(0, 1, 0);
  const velocity = new THREE.Vector3(0, 0, 0);
  const acceleration = new THREE.Vector3(0, 0, 0);
  const friction = config.player.friction;
  const speed = config.player.speed;

  const floorWidth = config.floor.width;
  const floorHeight = config.floor.height;

  ball.position.copy(position);

  const boundingSphere = new THREE.Sphere(ball.position.clone(), config.player.radius);

  const keyState = {
    [config.movement.keys.Z]: false,
    [config.movement.keys.S]: false,
    [config.movement.keys.Q]: false,
    [config.movement.keys.D]: false,
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

    const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).setY(0).normalize();
    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).setY(0).normalize();

    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (keyState[config.movement.keys.Z]) moveDirection.add(cameraForward);
    if (keyState[config.movement.keys.S]) moveDirection.sub(cameraForward);
    if (keyState[config.movement.keys.D]) moveDirection.add(cameraRight);
    if (keyState[config.movement.keys.Q]) moveDirection.sub(cameraRight);

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      acceleration.copy(moveDirection.multiplyScalar(speed));
    }
  };

  const update = () => {
    velocity.multiplyScalar(friction);
    calculateMovement();
    velocity.add(acceleration);
    ball.position.add(velocity);

    boundingSphere.center.copy(ball.position);

    const radius = config.player.radius;
    if (ball.position.x - radius < -floorWidth / 2) ball.position.x = -floorWidth / 2 + radius;
    if (ball.position.x + radius > floorWidth / 2) ball.position.x = floorWidth / 2 - radius;
    if (ball.position.z - radius < -floorHeight / 2) ball.position.z = -floorHeight / 2 + radius;
    if (ball.position.z + radius > floorHeight / 2) ball.position.z = floorHeight / 2 - radius;

    acceleration.set(0, 0, 0);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return {
    ball,
    boundingSphere,
    velocity,
    update,
    cleanup: () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    },
  };
};

export default Player;
