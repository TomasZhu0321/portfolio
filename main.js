// import "./style.css";
import javascriptLogo from "./javascript.svg";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

const gui = new dat.GUI();
const world = {
  plane: {
    width: 500,
    height: 500,
    widthSegments: 130,
    heightSegments: 130,
  },
};
gui.add(world.plane, "width", 1, 800).onChange(generatePlane);
gui.add(world.plane, "height", 1, 800).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 500).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 500).onChange(generatePlane);
function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = planeMesh.geometry.attributes.position;
  const randomValues = [];
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      array[i] = x + (Math.random() - 0.5) * 3;
      array[i + 1] = y + (Math.random() - 0.5) * 3;
      array[i + 2] = z + (Math.random() - 0.5) * 8;
    }
    randomValues.push(Math.random() * Math.PI * 2);
  }
  planeMesh.geometry.attributes.position.randomValues = randomValues;
  planeMesh.geometry.attributes.position.originalPostion =
    planeMesh.geometry.attributes.position.array;

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

camera.position.z = 50;

// orbit control
new OrbitControls(camera, renderer.domElement);

//default place Geomeotry
const planeGeometry = new THREE.PlaneGeometry(500, 500, 130, 130);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xc0c0c0,
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

generatePlane();
// add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 1);
scene.add(pointLight);
const backlight = new THREE.DirectionalLight(0x3498db, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);

//build stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});
const starVerticies = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVerticies.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVerticies, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  frame += 0.01;
  const { array, originalPostion, randomValues } =
    planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPostion[i] + Math.cos(frame + randomValues[i]) * 0.01;
    array[i + 1] =
      originalPostion[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01;
    //  array[i+2] = originalPostion[i+2] + Math.cos(frame) * 0.003;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

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
  stars.rotation.x += 0.001;
}
animate();

//listen the mouse move from user
addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1; //adjust X coordinates
  mouse.y = -(event.clientY / innerHeight) * 2 + 1; ////adjust Y coordinates
});

gsap.to("#thomas", {
  opacity: 1,
  duration: 1.5,
  delay: 0.3,
  y: 0,
  ease: "expo.in",
});
gsap.to("#goal", {
  opacity: 1,
  duration: 3,
});
gsap.to("#date", {
  opacity: 1,
  duration: 1.5,
  delay: 0.1,
  ease: "expo.in",
});
gsap.to("#viewWork", {
  opacity: 1,
  duration: 1.5,
  delay: 0.3,
});

document.querySelector("#viewWork").addEventListener("click", (event) => {
  event.preventDefault();
  gsap.to("#beginPage", {
    opacity: 0,
  });

  // gsap.to(camera.position, { z: 60, ease: "expo.inOut", duration: 2 });
  gsap.to(camera.position, { z: -30, ease: "expo.inOut", duration: 2 });
  gsap.to(camera.rotation, {
    x: -1.75,
    ease: "power3.inOut",
    duration: 2.5,
  });
  gsap.to(camera.position, { y: -1000, ease: "expo.in", duration: 1.5,delay:2.5 });
});
