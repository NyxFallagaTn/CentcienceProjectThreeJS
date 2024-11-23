// src/components/Scene.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import Floor from './Floor';
import Box from './Box';
import Lights from './Lights';
import Camera from './Camera';
import Player from './Player'; // Import Player.js
import config from '../config'; // Import config

const Scene = () => {
  const containerRef = useRef(); // Reference to the container div

  useEffect(() => {
    const container = containerRef.current;

    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background

    // Create the camera
    const camera = Camera(); // Get camera from Camera.js

    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer's canvas to the container
    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Add floor, box, and lights to the scene
    const floor = Floor(); // Get floor from Floor.js
    scene.add(floor);

    const box = Box(); // Get box from Box.js
    scene.add(box);

    const { ambientLight, directionalLight } = Lights(); // Get lights from Lights.js
    scene.add(ambientLight);
    scene.add(directionalLight);

    // Check if GridHelper is enabled in the config
    if (config.gridHelper.enabled) {
      const gridHelper = new THREE.GridHelper(config.gridHelper.size, config.gridHelper.divisions);
      scene.add(gridHelper); // Add grid helper if enabled
    }

    // Create the OrbitControls for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth the controls
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Get the player (ball) from Player.js
    const { ball, update, cleanup } = Player(); // Get ball and update function
    scene.add(ball); // Add the ball to the scene

    // Handle window resizing
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update the controls in the animation loop
      controls.update();

      // Update the player's ball position with physics
      update();

      // Render the scene
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', onWindowResize);
      cleanup(); // Cleanup the keyboard event listener
      if (container) {
        container.removeChild(renderer.domElement); // Remove canvas on unmount
      }
      renderer.dispose(); // Dispose of renderer resources
    };
  }, []); // Empty dependency array to run only on mount/unmount

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Scene;
