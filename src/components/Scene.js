// src/components/Scene.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Floor from './Floor';
import Lights from './Lights';
import Camera from './Camera';
import Player from './Player';
import RandomObject from './RandomObject';
import createStarField from './Stars';
import createEarth from './Earth';
import config from '../config';

const Scene = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Previous scene setup code remains the same...
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const { camera, ThirdPersonCamera } = Camera();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Scene elements setup remains the same...
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

    const { ball, boundingSphere, velocity, update, cleanup } = Player(camera);
    scene.add(ball);

    const thirdPersonCamera = new ThirdPersonCamera(camera, ball);

    const randomObjects = RandomObject();
    randomObjects.forEach((obj) => {
      obj.castShadow = true;
      obj.receiveShadow = true;
      scene.add(obj);
    });

    const onClick = (event) => {
      if (document.pointerLockElement) {
        // Cast ray from center of screen (where crosshair is)
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
        const intersects = raycaster.intersectObjects([floor, ...randomObjects]);
    
        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;
    
          // Check if the object has a message
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

    // Collision detection remains the same...
    const checkCollisions = () => {
      randomObjects.forEach((object) => {
        const objectBoundingSphere = object.userData.boundingSphere;
    
        if (boundingSphere.intersectsSphere(objectBoundingSphere)) {
          const collisionNormal = new THREE.Vector3()
            .subVectors(boundingSphere.center, objectBoundingSphere.center)
            .normalize();
    
          const penetrationDepth =
            boundingSphere.radius + objectBoundingSphere.radius -
            boundingSphere.center.distanceTo(objectBoundingSphere.center);
    
          const correctionVector = collisionNormal.multiplyScalar(penetrationDepth);
          ball.position.add(correctionVector);
          boundingSphere.center.copy(ball.position);
    
          if (ball.position.y < config.player.radius) {
            ball.position.y = config.player.radius;
            boundingSphere.center.y = ball.position.y;
          }

          velocity.projectOnPlane(collisionNormal);
        }
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);

      update();
      checkCollisions();
      thirdPersonCamera.update();
      earth.update();
      starField.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('click', onClick);
      window.removeEventListener('contextmenu', onContextMenu);
      cleanup();
      thirdPersonCamera.dispose();

      if (container) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      scene.remove(starField);
      starField.geometry.dispose();
      starField.material.dispose();
    };
  }, []);

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
        onClick={() => window.location.reload()}
      >
        Generate New World
      </button>
      
      {/* New Ring Crosshair */}
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
          cursor: 'none' // Hide the cursor completely when in game
        }} 
      />
    </div>
  );
};

export default Scene;