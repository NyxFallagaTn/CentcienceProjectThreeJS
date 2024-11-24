import * as THREE from 'three';
import config from '../config';

const Camera = () => {
  const { fov, near, far, position } = config.camera;

  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
  camera.position.set(position.x, position.y + 30, position.z + 50); // Adjusted for better space view
  camera.lookAt(0, 0, 0);
  return camera;
};

export default Camera;