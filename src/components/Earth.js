
// src/Earth.js
import * as THREE from 'three';

const createEarth = () => {
  const geometry = new THREE.SphereGeometry(20, 124, 124); // Rayon 20, segments 124
  const textureLoader = new THREE.TextureLoader();

  // Utiliser un lien CDN pour la texture de la Terre
  const texture = textureLoader.load(
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/textures/land_ocean_ice_cloud_2048.jpg',
    (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      console.log('Texture de la Terre chargée avec succès');
    },
    undefined,
    (error) => console.error('Erreur lors du chargement de la texture :', error)
  );

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.1,
  });

  const earth = new THREE.Mesh(geometry, material);

  // Créer un groupe pour la rotation orbitale
  const earthGroup = new THREE.Group();
  earthGroup.add(earth);

  // Position initiale de la Terre
  earth.position.set(100, 40, -200); // Déplacement par rapport au centre du groupe

  // Ajouter une méthode pour gérer les animations
  earthGroup.update = () => {
    earth.rotation.y += 0.001; // Rotation sur elle-même
    earthGroup.rotation.y += 0.0005; // Rotation orbitale autour du groupe
  };

  return earthGroup; // Retourner le groupe contenant la Terre
};

export default createEarth;
