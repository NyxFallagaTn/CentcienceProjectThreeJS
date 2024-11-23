import { useEffect } from 'react';
import * as THREE from 'three';
// Import OrbitControls from three-stdlib
import { OrbitControls } from 'three-stdlib';

// Define external variables for easy adjustment
const FLOOR_SIZE = 100; // Size of the floor
const GRID_SIZE = 100; // Size of the grid
const GRID_DIVISIONS = 50; // Number of grid divisions
const CAMERA_POSITION = { x: 0, y: 5, z: 10 }; // Camera position

const Floor = () => {
  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z); // Set camera initial position

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a gray floor
    const floorGeometry = new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray color
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate floor to make it flat
    floor.position.y = 0; // Align floor with the gridHelper
    scene.add(floor);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS); // Grid size and divisions
    gridHelper.position.y = 0; // Align grid with the floor
    scene.add(gridHelper);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft ambient light
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create the OrbitControls for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth the controls
    controls.dampingFactor = 0.25; // Damping factor for smooth movement
    controls.screenSpacePanning = false; // Disable screen-space panning
    controls.maxPolarAngle = Math.PI / 2; // Prevent the camera from going upside down

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

      // Render the scene
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return null; // No JSX needed, Three.js handles the rendering
};

export default Floor;
