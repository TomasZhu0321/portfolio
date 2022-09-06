import "./style.css";
import javascriptLogo from "./javascript.svg";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

const gui = new dat.GUI();
const world = {
  plane: {
    width: 19,
    height: 19,
    widthSegments: 22,
    heightSegments: 22,
  },
};
gui.add(world.plane, "width", 1, 50).onChange(generatePlane);
gui.add(world.plane, "height", 1, 50).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 80).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 80).onChange(generatePlane);
function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
  }
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0.192, 0.192, 0.192);
  }
  //!!add new attribute to geomertry
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );

  
}
const raycaster = new THREE.Raycaster(); //when mouse move, the ray point to the plane
const scene = new THREE.Scene(); //container
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// orbit control
new OrbitControls(camera, renderer.domElement);

//default place Geomeotry
const planeGeometry = new THREE.PlaneGeometry(19, 19, 22, 22);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xc0c0c0,
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
const { array } = planeMesh.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  array[i + 2] = z + Math.random();

  // array[i] =  x + Math.random();
  // array[i+1] =  y + Math.random();
}

const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0.192, 0.192, 0.192);
  }
  //!!add new attribute to geomertry
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );

// add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backlight = new THREE.DirectionalLight(0xd6eaf8, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);

const mouse = {
  x: undefined,
  y: undefined,
};
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    //vertice 1
    color.setX(intersects[0].face.a, 1);
    color.setY(intersects[0].face.a, 1);
    color.setZ(intersects[0].face.a, 1);
    //vertice 2
    color.setX(intersects[0].face.b, 1);
    color.setY(intersects[0].face.b, 1);
    color.setZ(intersects[0].face.b, 1);
    //vertice 3
    color.setX(intersects[0].face.c, 1);
    color.setY(intersects[0].face.c, 1);
    color.setZ(intersects[0].face.c, 1);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;
    const initialColor = {
      r: 0.192,
      g: 0.192,
      b: 0.192,
    };
    const initialHoverColor = {
      r: 1,
      g: 1,
      b: 1,
    };

    gsap.to(initialHoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        //vertice 1
        color.setX(intersects[0].face.a, initialHoverColor.r);
        color.setY(intersects[0].face.a, initialHoverColor.g);
        color.setZ(intersects[0].face.a, initialHoverColor.b);
        //vertice 2
        color.setX(intersects[0].face.b, initialHoverColor.r);
        color.setY(intersects[0].face.b, initialHoverColor.g);
        color.setZ(intersects[0].face.b, initialHoverColor.b);
        //vertice 3
        color.setX(intersects[0].face.c, initialHoverColor.r);
        color.setY(intersects[0].face.c, initialHoverColor.g);
        color.setZ(intersects[0].face.c, initialHoverColor.b);
        color.needsUpdate = true;
      },
    });
  }
  // planeMesh.rotation.x += 0.02;
}
animate();

//listen the mouse move from user
addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1; //adjust X coordinates
  mouse.y = -(event.clientY / innerHeight) * 2 + 1; ////adjust Y coordinates
});
