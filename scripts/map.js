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

function rendering() {
    requestAnimationFrame(rendering);

    renderer.render(scene, camera);
}

export function CreateScene() {
    $("canvas").remove();
    document.body.appendChild(renderer.domElement);
    const robotGeo = new THREE.OctahedronGeometry(1);
    const robotMat = new THREE.MeshBasicMaterial({color: "gray"});
    const robotMesh = new THREE.Mesh(robotGeo, robotMat);
    const robotLines = new THREE.EdgesGeometry(robotGeo, 2*Math.PI);
    const robotLinesMesh = new THREE.LineSegments(robotLines, new THREE.LineBasicMaterial({color: "black"}));
    scene.add(robotMesh);
    scene.add(robotLinesMesh);
}

rendering();