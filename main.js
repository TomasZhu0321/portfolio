import "./style.css";
import javascriptLogo from "./javascript.svg";

import * as THREE from "three";
const scene = new THREE.Scene(); //container
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth,innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement);

camera.position.z = 5

const planeGeometry = new THREE.PlaneGeometry(5,5,10,10);
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xc0c0c0, side: THREE.DoubleSide} );
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial);
scene.add( planeMesh );


function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
  // planeMesh.rotation.x += 0.02;
}
animate()


