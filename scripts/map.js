import * as THREE from "three";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.138/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.x = 3.54;
camera.position.y = 3.54;
camera.position.z = 3.54;

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 1;
controls.enablePan = false;

// Make Canvas Responsive
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

export function CreateScene() {
    document.body.appendChild(renderer.domElement);
    console.log("hehe");
}