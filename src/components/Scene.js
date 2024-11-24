import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import Floor from './Floor';
import Lights from './Lights';
import Camera from './Camera';
import Player from './Player';
import RandomObject from './RandomObject';
import createStarField from './Stars';
import createEarth from './Earth'; // Import de la Terre avec rotation
import config from '../config';

const Scene = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Fond noir pour une meilleure visibilité des étoiles

    // Création de la caméra
    const camera = Camera();

    // Création du renderer
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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2.2;

    controls.minDistance = 5;
    controls.maxDistance = 10;

    controls.addEventListener('change', () => {
      if (camera.position.y < 2) {
        camera.position.y = 2;
      }
      if (camera.position.y > 30) {
        camera.position.y = 30;
      }
    });

    const { ball, boundingSphere,velocity, update, cleanup } = Player(camera);
    scene.add(ball);

    const randomObjects = RandomObject();
    randomObjects.forEach((obj) => {
      obj.castShadow = true;
      obj.receiveShadow = true;
      scene.add(obj);
    });


    const onClick = (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(randomObjects);
      if (intersects.length > 0) {
        alert(intersects[0].object.userData.message);
      }
    };

    window.addEventListener('click', onClick);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize, false);

    const updateCameraTarget = () => {
      controls.target.copy(ball.position);
      controls.target.y += 1;
      controls.update();
    };

    const checkCollisions = () => {
      randomObjects.forEach((object) => {
        const objectBoundingSphere = object.userData.boundingSphere;
    
        if (boundingSphere.intersectsSphere(objectBoundingSphere)) {
          console.log('Collision detected with:', object.userData.message);
          //object.material.color.set(0xff0000);
    
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

      controls.update();

      update();

      checkCollisions();

      updateCameraTarget();

      earth.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('click', onClick);
      cleanup();

      if (container) {
        container.removeChild(renderer.domElement);
      }

      controls.dispose();
      renderer.dispose();

      // Dispose du champ d'étoiles
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
      <div 
        ref={containerRef} 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed',
          top: 0,
          left: 0
        }} 
      />
    </div>
  );
};

export default Scene;
