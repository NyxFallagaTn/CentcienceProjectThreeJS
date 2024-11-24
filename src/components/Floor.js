// src/components/Floor.js
import * as THREE from 'three';
import config from '../config'; // Import de la configuration

const Floor = () => {
  const { width, height } = config.floor; // Récupération des dimensions du sol depuis la configuration
  const textureLoader = new THREE.TextureLoader();

  // Charger la texture du sol
  const floorTexture = textureLoader.load(
    'https://i.ibb.co/7WXw7FD/sol.jpg', // Texture de la Lune (ou autre)
    () => console.log('Texture du sol chargée avec succès'),
    undefined,
    (error) => console.error('Erreur lors du chargement de la texture du sol :', error)
  );

  // Charger une texture de mur
  const wallTexture = textureLoader.load(
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/textures/brick_diffuse.jpg', // Texture de mur
    () => console.log('Texture des murs chargée avec succès'),
    undefined,
    (error) => console.error('Erreur lors du chargement de la texture des murs :', error)
  );

  // Créer le sol
  const floorGeometry = new THREE.PlaneGeometry(width, height);
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotation pour rendre le sol horizontal
  floor.receiveShadow = true;

  // Créer des murs
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
  });

  const walls = [];
  const wallHeight = 1; // Hauteur des murs

  // Mur arrière
  const backWallGeometry = new THREE.PlaneGeometry(width, wallHeight);
  const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
  backWall.position.set(0, wallHeight / 2, -height / 2);
  walls.push(backWall);

  // Mur avant
  const frontWallGeometry = new THREE.PlaneGeometry(width, wallHeight);
  const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
  frontWall.position.set(0, wallHeight / 2, height / 2);
  frontWall.rotation.y = Math.PI; // Rotation pour orienter le mur correctement
  walls.push(frontWall);

  // Mur gauche
  const leftWallGeometry = new THREE.PlaneGeometry(height, wallHeight);
  const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
  leftWall.position.set(-width / 2, wallHeight / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  walls.push(leftWall);

  // Mur droit
  const rightWallGeometry = new THREE.PlaneGeometry(height, wallHeight);
  const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
  rightWall.position.set(width / 2, wallHeight / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  walls.push(rightWall);

  // Retourner le sol et les murs
  const group = new THREE.Group();
  group.add(floor);
  walls.forEach((wall) => {
    wall.receiveShadow = true;
    group.add(wall);
  });

  return group;
};

export default Floor;
