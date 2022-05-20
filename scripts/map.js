import * as THREE from "three";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.138/examples/jsm/controls/OrbitControls.js";

// robot
const robotGeo = new THREE.OctahedronGeometry(.5);
const robotMat = new THREE.MeshBasicMaterial({vertexColors: true});
const robotMesh = new THREE.Mesh(robotGeo, robotMat);
const robotLines = new THREE.EdgesGeometry(robotGeo, 2*Math.PI);
const robotLinesMesh = new THREE.LineSegments(robotLines, new THREE.LineBasicMaterial({color: "black"}));
const colors = [];
// Sets colors of robot
var frontColor = new THREE.Color(0x222222);
var mainColor = new THREE.Color(0x555555);
for(let i = 0; i < 6; i++) {
    colors.push(frontColor.r, frontColor.g, frontColor.b);
}
for(let i = 0; i < 42; i++) {
    colors.push(mainColor.r, mainColor.g, mainColor.b);
}
robotGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

// axis lines
const axisLines = new THREE.AxesHelper(100);

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

/**
 * @param {Number} direction
 */
export function CreateScene(direction) {
    $("canvas").remove();
    document.body.appendChild(renderer.domElement);
    scene.add(robotMesh);
    robotMesh.add(robotLinesMesh);
    robotMesh.rotateY(Math.PI/4);
    if(direction == 3) {
        robotMesh.rotateY(-Math.PI/2);
    } else if(direction == 2) {
        robotMesh.rotateY(Math.PI/2);
    } else if(direction == 4) {
        robotMesh.rotateY(Math.PI);
    }
}

/**
 * @param {String[]} blocks 
 */
export function DrawBlocks(blocks) {
    for(let i = 0; i < blocks.length; i++) {
        if(blocks[i] != "minecraft:air") {
            const offset = new THREE.Vector3(0, -1, 0);
            const blockGeo = new THREE.BoxGeometry(1, 1);
            const blockMat = new THREE.MeshBasicMaterial({color: "white", transparent: true, opacity: .1,});
            const blockMesh = new THREE.Mesh(blockGeo, blockMat);
            const blockEdges = new THREE.EdgesGeometry(blockGeo, 2*Math.PI);
            const blockEdgesMesh = new THREE.LineSegments(blockEdges, new THREE.LineBasicMaterial({color: "black"}));
            scene.add(blockMesh);
            scene.add(axisLines);
            blockMesh.add(blockEdgesMesh);
            const position = robotMesh.position.clone().add(offset);
            blockMesh.position.set(position.x, position.y, position.z);
        }
    }
}

/**
 * @param {String} direction 
 */
export function TurnRobot(direction) {
    if(direction == "Right") {
        robotMesh.rotateY(-Math.PI/2);
    } else {
        robotMesh.rotateY(Math.PI/2);
    }
}

/**
 * @param {String} direction 
 */
export function MoveRobot(direction) {
    console.log(direction);
    if(direction == "forward") {
        robotMesh.translateX(Math.sqrt(.5));
        robotMesh.translateZ(Math.sqrt(.5));
    } else if(direction == "back") {
        robotMesh.translateX(-Math.sqrt(.5));
        robotMesh.translateZ(-Math.sqrt(.5));
    } else if(direction == "up") {
        robotMesh.translateY(1);
    } else {
        robotMesh.translateY(-1);
    }
}

rendering();