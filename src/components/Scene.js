// src/components/Scene.js
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Floor from './Floor';
import Lights from './Lights';
import Camera from './Camera';
import Player from './Player';
import RandomObject from './RandomObject';
import createStarField from './Stars';
import createEarth from './Earth';
import config from '../config';
import WorldSchemaManager from '../services/WorldSchemaManager';
import socket, { initPlayer, updatePlayer, onWorldUpdate, generateWorld } from '../services/socket';

const Scene = () => {
  const containerRef = useRef();
  const fpsRef = useRef();
  const [schema, setSchema] = useState(null);
  const otherPlayers = useRef({});
  const playerRef = useRef();
  const sceneRef = useRef(new THREE.Scene());

  const regenerateWorld = () => {
    const { schema } = RandomObject();
    WorldSchemaManager.saveWorld(schema);
    generateWorld(schema); // Notify the server about the new world
    setSchema(schema);
  };

  useEffect(() => {
    const container = containerRef.current;
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0x000000);
    const { camera, ThirdPersonCamera } = Camera();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (container) {
      container.appendChild(renderer.domElement);
    }

    const floor = Floor();
    scene.add(floor);

    const { ambientLight, directionalLight } = Lights();
    scene.add(ambientLight);
    scene.add(directionalLight);

    if (config.gridHelper.enabled) {
      const gridHelper = new THREE.GridHelper(config.gridHelper.size, config.gridHelper.divisions);
      scene.add(gridHelper);
    }

    const starField = createStarField(1000);
    scene.add(starField);

    const earth = createEarth();
    scene.add(earth);

    // Initialize player
    const player = Player(camera);
    playerRef.current = player;
    scene.add(player.group);

    // Initialize third person camera with player group
    const thirdPersonCamera = new ThirdPersonCamera(camera, player.group);

    let randomObjects = [];
    if (schema) {
      randomObjects = WorldSchemaManager.loadWorld(schema);
      randomObjects.forEach((obj) => {
        obj.castShadow = true;
        obj.receiveShadow = true;
        scene.add(obj);
      });
    }

    // Initialize the player on the server
    initPlayer({ position: player.group.position });

    // Listen for updates from the server
// Écouter les mises à jour du serveur
onWorldUpdate((update) => {
  switch (update.type) {
    case 'newPlayer': {
      const otherPlayer = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x0000ff })
      );
      otherPlayer.position.copy(update.data.position);
      otherPlayers.current[update.data.id] = otherPlayer;
      scene.add(otherPlayer);
      break;
    }
    case 'updatePlayer': {
      const otherPlayer = otherPlayers.current[update.data.id];
      if (otherPlayer) {
        otherPlayer.position.copy(update.data.position);
      }
      break;
    }
    case 'removePlayer': {
      const otherPlayer = otherPlayers.current[update.id];
      if (otherPlayer) {
        scene.remove(otherPlayer);
        delete otherPlayers.current[update.id];
      }
      break;
    }
    case 'newWorldGenerated': {
      // Supprimer les joueurs inexistants
      const activePlayerIds = Object.keys(update.data.players);
      Object.keys(otherPlayers.current).forEach((id) => {
        if (!activePlayerIds.includes(id)) {
          scene.remove(otherPlayers.current[id]);
          delete otherPlayers.current[id];
        }
      });

      // Ajouter les objets aléatoires
      randomObjects.forEach((obj) => scene.remove(obj));
      randomObjects = WorldSchemaManager.loadWorld({ randomObjects: update.data.randomObjects });
      randomObjects.forEach((obj) => scene.add(obj));
      break;
    }
    default:
      break;
  }
});

    const onClick = (event) => {
      if (document.pointerLockElement) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

        const intersects = raycaster.intersectObjects([floor, ...randomObjects]);

        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
          if (clickedObject.userData && clickedObject.userData.message) {
            alert(clickedObject.userData.message);
          }
        }
      }
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onContextMenu = (event) => {
      event.preventDefault();
    };

    window.addEventListener('click', onClick);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('contextmenu', onContextMenu);

    let lastTime = performance.now();
    let frameCount = 0;

    const updateFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        if (fpsRef.current) fpsRef.current.innerText = `FPS: ${fps}`;
        frameCount = 0;
        lastTime = currentTime;
      }
    };

    const checkCollisions = () => {
      if (!player.boundingSphere) return;

      randomObjects.forEach((object) => {
        const objectBoundingSphere = object.userData?.boundingSphere;

        if (!objectBoundingSphere) return;

        if (player.boundingSphere.intersectsSphere(objectBoundingSphere)) {
          const collisionNormal = new THREE.Vector3()
            .subVectors(player.boundingSphere.center, objectBoundingSphere.center)
            .normalize();

          const penetrationDepth =
            player.boundingSphere.radius +
            objectBoundingSphere.radius -
            player.boundingSphere.center.distanceTo(objectBoundingSphere.center);

          const correctionVector = collisionNormal.multiplyScalar(penetrationDepth);
          player.group.position.add(correctionVector);
          player.boundingSphere.center.copy(player.group.position);

          if (player.group.position.y < config.player.radius) {
            player.group.position.y = config.player.radius;
            player.boundingSphere.center.y = player.group.position.y;
          }

          player.velocity.projectOnPlane(collisionNormal);
        }
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();

      player.update(deltaTime);
      updatePlayer({ position: player.group.position });
      checkCollisions();
      thirdPersonCamera.update();
      earth.update();
      starField.update();

      renderer.render(scene, camera);
      updateFPS();
    };

    const clock = new THREE.Clock();
    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('click', onClick);
      window.removeEventListener('contextmenu', onContextMenu);
      player.cleanup();
      thirdPersonCamera.dispose();

      if (container) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      scene.remove(starField);
      starField.geometry.dispose();
      starField.material.dispose();
    };
  }, [schema]);

  return (
    <div>
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1,
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        onClick={regenerateWorld}
      >
        Generate New World
      </button>

      <div
        ref={fpsRef}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1,
          color: '#FFF',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        FPS: 0
      </div>

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            position: 'relative',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      <div 
        ref={containerRef} 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed',
          top: 0,
          left: 0,
          cursor: 'none' 
        }} 
      />
    </div>
  );
};

export default Scene;
