// src/components/Camera.js
import * as THREE from 'three';
import config from '../config';

class ThirdPersonCamera {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;
    
    // Camera configuration
    this.distance = 10;
    this.height = 5;
    this.rotationSpeed = 0.002;
    this.smoothness = 0.1;
    
    // Camera angles
    this.currentRotation = 0;
    this.verticalAngle = 0;
    
    // Mouse position tracking
    this.lastMouseX = window.innerWidth / 2;
    this.lastMouseY = window.innerHeight / 2;
    
    // Default position if target is not ready
    this.defaultPosition = new THREE.Vector3(0, this.height, this.distance);
    
    // Bind event handlers
    this.handleMouseMove = this.handleMouseMove.bind(this);
    
    // Add event listeners
    document.addEventListener('mousemove', this.handleMouseMove);
    
    // Lock pointer on click
    document.addEventListener('click', () => {
      document.body.requestPointerLock();
    });
  }
  
  handleMouseMove(event) {
    if (document.pointerLockElement) {
      // Use movementX and movementY for smoother camera control
      const deltaX = event.movementX;
      const deltaY = event.movementY;
      
      // Update camera rotation
      this.currentRotation -= deltaX * this.rotationSpeed;
      this.verticalAngle = Math.max(
        -Math.PI / 3, // Limit looking up
        Math.min(
          Math.PI / 6, // Limit looking down
          this.verticalAngle + deltaY * this.rotationSpeed
        )
      );
    }
  }
  
  update() {
    // Calculate camera position based on current angles
    const offset = new THREE.Vector3(
      Math.sin(this.currentRotation) * this.distance,
      this.height + Math.sin(this.verticalAngle) * this.distance,
      Math.cos(this.currentRotation) * this.distance
    );
    
    // Check if target and its position are available
    if (this.target && this.target.position) {
      // Update camera position and look target
      this.camera.position.copy(this.target.position).add(offset);
      this.camera.lookAt(
        this.target.position.x,
        this.target.position.y + 1, // Look slightly above player
        this.target.position.z
      );
    } else {
      // Use default position if target is not ready
      this.camera.position.copy(this.defaultPosition);
      this.camera.lookAt(0, 0, 0);
    }
  }
  
  dispose() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.exitPointerLock();
  }
}

const Camera = () => {
  const { fov, near, far, position } = config.camera;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(position.x, position.y + 5, position.z + 10);
  camera.lookAt(0, 0, 0);
  
  return {
    camera,
    ThirdPersonCamera
  };
};

export default Camera;