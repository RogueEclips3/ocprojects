import * as THREE from "three";
import * as MAIN from "./main.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";

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
    MAIN.CheckBlocks();
}

/**
 * @param {String[]} blocks 
 */
export function DrawBlocks(blocks) {
    // deletes blocks around robot
    for(let i = 0; i < 6; i++) {
        var raycastDirection;
        switch(i) {
            case 0:
                direction = new THREE.Vector3(0, -1, 0);
                break;
            case 1:
                direction = new THREE.Vector3(0, 1, 0);
                break;
            case 2:
                direction = new THREE.Vector3(0, 0, -1);
                break;
            case 3:
                direction = new THREE.Vector3(0, 0, 1);
                break;
            case 4:
                offset = new THREE.Vector3(-1, 0, 0);
                break;
            case 5:
                direction = new THREE.Vector3(1, 0, 0);
                break;
        }
        const raycaster = new THREE.Raycaster(robotMesh.position, direction);
        const intersects = raycaster.intersectObjects(scene.children);
        intersects.forEach(block => {
            if(block.object.name == "block" && block.object.position.distanceTo(robotMesh.position) < .7) {
                scene.remove(block.object);
            }
        });
    }
    // instantiates blocks
    for(let i = 0; i < blocks.length; i++) {
        if(blocks[i] != "minecraft:air") {
            scene.add(axisLines);
            var offset = new THREE.Vector3(0, -1, 0);
            const blockGeo = new THREE.BoxGeometry(1, 1);
            const blockMat = new THREE.MeshBasicMaterial({color: "white", transparent: true, opacity: .1,});
            const blockMesh = new THREE.Mesh(blockGeo, blockMat);
            const blockEdges = new THREE.EdgesGeometry(blockGeo, 2*Math.PI);
            const blockEdgesMesh = new THREE.LineSegments(blockEdges, new THREE.LineBasicMaterial({color: "black"}));
            scene.add(blockMesh);
            switch(i) {
                case 0:
                    offset = new THREE.Vector3(0, -1, 0);
                    break;
                case 1:
                    offset = new THREE.Vector3(0, 1, 0);
                    break;
                case 2:
                    offset = new THREE.Vector3(0, 0, -1);
                    break;
                case 3:
                    offset = new THREE.Vector3(0, 0, 1);
                    break;
                case 4:
                    offset = new THREE.Vector3(-1, 0, 0);
                    break;
                case 5:
                    offset = new THREE.Vector3(1, 0, 0);
                    break;
            }
            robotMesh.getWorldPosition(blockMesh.position);
            robotMesh.getWorldQuaternion(blockMesh.quaternion);
            blockMesh.rotateY(Math.PI/4);
            var direction = new THREE.Vector3(0, 0, 0);
            blockMesh.getWorldDirection(direction);
            blockMesh.add(blockEdgesMesh);
            blockMesh.translateX(offset.x);
            blockMesh.translateY(offset.y);
            blockMesh.translateZ(offset.z);
            blockMesh.name = "block";
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
    robotMesh.attach(camera);
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
    scene.attach(camera);
    controls.target.copy(robotMesh.position);
}

rendering();