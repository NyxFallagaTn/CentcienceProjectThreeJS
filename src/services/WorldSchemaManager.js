// src/services/WorldSchemaManager.js
import * as THREE from 'three';

const WorldSchemaManager = {
  saveWorld(schema, filename = 'world-schema.json') {
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  loadWorld(schema) {
    const objects = [];
    schema.randomObjects.forEach((obj) => {
      const { shape, size, color, position, message } = obj;
      let geometry;
      if (shape === 'sphere') {
        geometry = new THREE.SphereGeometry(size / 2, 32, 32);
      } else if (shape === 'box') {
        geometry = new THREE.BoxGeometry(size, size, size);
      }

      const material = new THREE.MeshStandardMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position.x, position.y, position.z);
      mesh.userData = { message };
      objects.push(mesh);
    });
    return objects;
  },
};

export default WorldSchemaManager;
