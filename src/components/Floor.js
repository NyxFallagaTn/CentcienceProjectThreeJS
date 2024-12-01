// src/components/Floor.js
import * as THREE from 'three';
import config from '../config';

const Floor = () => {
  const { width, height } = config.floor;
  const textureLoader = new THREE.TextureLoader();

  // Load floor texture
  const floorTexture = textureLoader.load(
    'https://i.ibb.co/7WXw7FD/sol.jpg',
    (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      console.log('Floor texture loaded successfully');
    },
    undefined,
    (error) => console.error('Error loading floor texture:', error)
  );

  // Create glass material with realistic properties
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transmission: 0.9, // Transparency level
    thickness: 0.5, // Glass thickness
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    transparent: true,
    opacity: 0.3,
    reflectivity: 0.9,
    side: THREE.DoubleSide
  });

  // Create floor
  const floorGeometry = new THREE.PlaneGeometry(width, height);
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  // Create glass walls
  const walls = [];
  const wallHeight = 4; // Increased height for more dramatic effect

  // Back wall
  const backWallGeometry = new THREE.PlaneGeometry(width, wallHeight);
  const backWall = new THREE.Mesh(backWallGeometry, glassMaterial);
  backWall.position.set(0, wallHeight / 2, -height / 2);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  walls.push(backWall);

  // Front wall
  const frontWallGeometry = new THREE.PlaneGeometry(width, wallHeight);
  const frontWall = new THREE.Mesh(frontWallGeometry, glassMaterial);
  frontWall.position.set(0, wallHeight / 2, height / 2);
  frontWall.rotation.y = Math.PI;
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;
  walls.push(frontWall);

  // Left wall
  const leftWallGeometry = new THREE.PlaneGeometry(height, wallHeight);
  const leftWall = new THREE.Mesh(leftWallGeometry, glassMaterial);
  leftWall.position.set(-width / 2, wallHeight / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  walls.push(leftWall);

  // Right wall
  const rightWallGeometry = new THREE.PlaneGeometry(height, wallHeight);
  const rightWall = new THREE.Mesh(rightWallGeometry, glassMaterial);
  rightWall.position.set(width / 2, wallHeight / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  walls.push(rightWall);

  // Optional: Add subtle frame/border for the glass walls
  walls.forEach(wall => {
    const frameGeometry = new THREE.EdgesGeometry(wall.geometry);
    const frameMaterial = new THREE.LineBasicMaterial({ 
      color: 0x808080,
      linewidth: 1
    });
    const frame = new THREE.LineSegments(frameGeometry, frameMaterial);
    wall.add(frame);
  });

  // Create group and add all elements
  const group = new THREE.Group();
  group.add(floor);
  walls.forEach(wall => group.add(wall));

  return group;
};

export default Floor;