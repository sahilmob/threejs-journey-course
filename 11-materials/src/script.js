import GUI from "lil-gui";
import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("./textures/door/metal.jpg");
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorWidthTexture = textureLoader.load("./textures/door/width.jpg");
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

// const material = new THREE.MeshBasicMaterial({
//   // we can do:
//   //   map: doorColorTexture,
// });

// material.map = doorColorTexture
// material.color = new THREE.Color("green");
// material.wireframe = true;

// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 1;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.roughnessMap = doorRoughnessTexture;
material.metalnessMap = doorMetalnessTexture;
material.normalMap = doorNormalTexture;

gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "metalness").min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 64),
  material
);

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

sphere.position.x = -1.5;
torus.position.x = 1.5;

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(ambientLight);
// scene.add(pointLight);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});

scene.add(sphere, plane, torus);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   sphere.rotation.y = 0.1 * elapsedTime;
  //   plane.rotation.y = 0.1 * elapsedTime;
  //   torus.rotation.y = 0.1 * elapsedTime;
  //   sphere.rotation.x = -0.15 * elapsedTime;
  //   plane.rotation.x = -0.15 * elapsedTime;
  //   torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
