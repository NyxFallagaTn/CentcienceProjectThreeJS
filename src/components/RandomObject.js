import * as THREE from 'three';
import config from '../config';

const RandomObject = () => {
  const { count, shapes, messages, colorRange, sizeRange } = config.randomObjects;

  const objects = [];
  const schema = { randomObjects: [] }; // Schema to save objects

  for (let i = 0; i < count; i++) {
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    const color = Math.random() * (colorRange[1] - colorRange[0]) + colorRange[0];
    const position = {
      x: Math.random() * 100 - 50,
      y: size / 2,
      z: Math.random() * 100 - 50,
    };
    const message = messages[Math.floor(Math.random() * messages.length)];

    let geometry;
    if (shapeType === 'box') {
      geometry = new THREE.BoxGeometry(size, size, size);
    } else if (shapeType === 'sphere') {
      geometry = new THREE.SphereGeometry(size / 2, 32, 32);
    }

    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position.x, position.y, position.z);
    mesh.userData = { message };
    objects.push(mesh);

    schema.randomObjects.push({ shape: shapeType, size, color, position, message });
  }

  return { objects, schema };
};

export default RandomObject;
