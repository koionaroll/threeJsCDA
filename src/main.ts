import "./style.scss";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// container for object, camera and lighting
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  //FOV
  75,
  //Aspect ratio (based on browser window)
  window.innerWidth / window.innerHeight,
  //View Frustum (which objects are visible relative to the camera)
  0.1,
  1000
);

//render the graphics to the scene
const renderer = new THREE.WebGLRenderer({
  //render at the "canvas" of the DOM
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusKnotGeometry(6, 1, 300, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x9c178a });
const torusKnot = new THREE.Mesh(geometry, material);

scene.add(torusKnot);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({color:0xffffff})
  const star = new THREE.Mesh(geometry,material)

  const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100))

  star.position.set(x,y,z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('./assets/spaceBG.jpg')
scene.background = spaceTexture

const loader = new THREE.TextureLoader();
const cubePaths = [
  "https://th.bing.com/th/id/OIP.OB8xNviXvEcA3WNU-7RIRQHaHa?w=228&h=219&c=7&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.osXPM7NHeNro5XF3MDVZWgHaHa?w=213&h=213&c=7&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.eolV3-TnCn6QrLAuuAa5zAHaHa?w=206&h=203&c=7&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.eM85mOKZcT8ufGMqUVxKmAHaHa?w=230&h=220&c=7&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.sMkR0TyI2E7vER-CZFe-awHaHa?w=224&h=219&c=7&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.Pn_7h3NqUQTVrQF4wn1YkQHaHa?w=218&h=208&c=7&o=5&pid=1.7"
]

const cubeMaterials:Array<any> = []; // an array of materials you'll pass into the constructor of THREE.Mesh
cubePaths.forEach(path => {
  cubeMaterials.push(
    new THREE.MeshBasicMaterial({
      map: loader.load(path)
    }));
});
let cubeGeometry = new THREE.BoxBufferGeometry(4, 4, 4);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
scene.add(cube);

const ballTexture = new THREE.TextureLoader().load("./assets/bball.png")
const ballTextureNormal = new THREE.TextureLoader().load("./assets/normalbball.jpg")
const ball = new THREE.Mesh(
  new THREE.SphereGeometry (3,32,32),
  new THREE.MeshStandardMaterial({
    map: ballTexture,
    normalMap: ballTextureNormal
  })  
  )

ball.position.z=20;
ball.position.setX(-5);
cube.position.x=15;
cube.position.y=15;


scene.add(ball)

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
console.log(camera.position)
console.log(t)
ball.rotation.x += 0.05
ball.rotation.y += 0.0075
ball.rotation.z += 0.05

cube.rotation.x += -0.1
cube.rotation.y += -0.05
camera.position.z = Math.max(t * -0.01, 0.1);
camera.position.x = t * -0.0002;
camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera

function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.001;

  controls.update();

  renderer.render(scene, camera);
}

animate();


const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if (entry.isIntersecting){
      entry.target.classList.add("show")
    }else{
      entry.target.classList.remove("show")
    }
  })
})
const hiddenElements = document.querySelectorAll(".hidden")
hiddenElements.forEach((e)=> observer.observe(e))
