import * as THREE from 'three';
import config from '../config';

const RandomObject = () => {
  const { count, shapes, messages, colorRange, sizeRange } = config.randomObjects;

  const objects = [];
  for (let i = 0; i < count; i++) {
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    const color = Math.random() * (colorRange[1] - colorRange[0]) + colorRange[0];
    const position = new THREE.Vector3(
      Math.random() * 100 - 50,
      size / 2,
      Math.random() * 100 - 50
    );

    let geometry;
    if (shapeType === 'box') {
      geometry = new THREE.BoxGeometry(size, size, size);
    } else if (shapeType === 'sphere') {
      geometry = new THREE.SphereGeometry(size / 2, 32, 32);
    }

    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(position);
    const boundingSphere = new THREE.Sphere(position.clone(), size / 2);
    mesh.userData = { message: messages[Math.floor(Math.random() * messages.length)], boundingSphere };

    objects.push(mesh);
  }

  return objects;
};

export default RandomObject;
