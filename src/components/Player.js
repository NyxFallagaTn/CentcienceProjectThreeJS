import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import config from '../config';

const Player = (camera) => {
  let mixer;
  let model;
  const animations = {
    idle: null,
    walking: null,
    running: null
  };
  let currentAnimation = 'idle';
  
  const position = new THREE.Vector3(0, 0, 0);
  const velocity = new THREE.Vector3(0, 0, 0);
  const acceleration = new THREE.Vector3(0, 0, 0);
  const friction = config.player.friction;
  const speed = config.player.speed;
  
  // Create a group to contain the model
  const playerGroup = new THREE.Group();
  playerGroup.position.copy(position);
  
  // Load the model
  const loader = new GLTFLoader();
  loader.load(
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r148/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    (gltf) => {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      
      // Adjust model vertical position
      model.position.y = 0;
      
      // Create animation mixer
      mixer = new THREE.AnimationMixer(model);
      
      // Load animations
      gltf.animations.forEach((clip) => {
        if (clip.name.toLowerCase().includes('idle')) {
          animations.idle = mixer.clipAction(clip);
        } else if (clip.name.toLowerCase().includes('walk')) {
          animations.walking = mixer.clipAction(clip);
        } else if (clip.name.toLowerCase().includes('run')) {
          animations.running = mixer.clipAction(clip);
        }
      });
      
      // Start idle animation
      if (animations.idle) {
        animations.idle.play();
      }
      
      playerGroup.add(model);
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
    }
  );
  
  const boundingSphere = new THREE.Sphere(playerGroup.position.clone(), config.player.radius);
  
  const keyState = {
    [config.movement.keys.W]: false,
    [config.movement.keys.S]: false,
    [config.movement.keys.A]: false,
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
    
    const cameraForward = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .setY(0)
      .normalize();
    const cameraRight = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .setY(0)
      .normalize();
    
    const moveDirection = new THREE.Vector3(0, 0, 0);
    
    if (keyState[config.movement.keys.W]) moveDirection.add(cameraForward);
    if (keyState[config.movement.keys.S]) moveDirection.sub(cameraForward);
    if (keyState[config.movement.keys.D]) moveDirection.add(cameraRight);
    if (keyState[config.movement.keys.A]) moveDirection.sub(cameraRight);
    
    // Handle animations based on movement
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      acceleration.copy(moveDirection.multiplyScalar(speed));
      
      // Rotate model in movement direction
      const angle = Math.atan2(moveDirection.x, moveDirection.z);
      playerGroup.rotation.y = angle;
      
      // Change to walking animation if not already walking
      if (currentAnimation !== 'walking' && animations.walking) {
        Object.values(animations).forEach(anim => anim?.stop());
        animations.walking.play();
        currentAnimation = 'walking';
      }
    } else if (currentAnimation !== 'idle' && animations.idle) {
      // Return to idle animation if not moving
      Object.values(animations).forEach(anim => anim?.stop());
      animations.idle.play();
      currentAnimation = 'idle';
    }
  };
  
  const update = (delta) => {
    if (mixer) {
      mixer.update(delta);
    }
    
    velocity.multiplyScalar(friction);
    calculateMovement();
    velocity.add(acceleration);
    playerGroup.position.add(velocity);
    
    boundingSphere.center.copy(playerGroup.position);
    
    // Floor boundaries
    const radius = config.player.radius;
    const floorWidth = config.floor.width;
    const floorHeight = config.floor.height;
    
    if (playerGroup.position.x - radius < -floorWidth / 2) playerGroup.position.x = -floorWidth / 2 + radius;
    if (playerGroup.position.x + radius > floorWidth / 2) playerGroup.position.x = floorWidth / 2 - radius;
    if (playerGroup.position.z - radius < -floorHeight / 2) playerGroup.position.z = -floorHeight / 2 + radius;
    if (playerGroup.position.z + radius > floorHeight / 2) playerGroup.position.z = floorHeight / 2 - radius;
    
    acceleration.set(0, 0, 0);
  };
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  return {
    group: playerGroup,
    boundingSphere,
    velocity,
    update,
    cleanup: () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (mixer) {
        mixer.stopAllAction();
      }
    },
  };
};

export default Player;