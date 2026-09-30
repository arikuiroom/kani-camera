import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const container = document.querySelector('#app');
const status = document.querySelector('#status');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2);

const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.01, 1000);
camera.position.set(2.7, 1.8, 4.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 0.7, 0);
controls.update();

scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.0));

const key = new THREE.DirectionalLight(0xffffff, 3.0);
key.position.set(4, 6, 5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 1.0);
fill.position.set(-4, 2, -3);
scene.add(fill);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(3.5, 96),
  new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.95 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

function frameObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  object.position.x -= center.x;
  object.position.y -= box.min.y;
  object.position.z -= center.z;

  const fitDistance = Math.max(maxDim * 2.0, 1.8);
  camera.near = Math.max(fitDistance / 1000, 0.001);
  camera.far = fitDistance * 100;
  camera.position.set(fitDistance * 0.7, fitDistance * 0.45, fitDistance);
  controls.target.set(0, size.y * 0.45, 0);
  camera.updateProjectionMatrix();
  controls.update();
}

// FBX内には元PC上の絶対パスが記録されているため、
// どの形式でテクスチャURLが来てもローカルPNGへ差し替えます。
const manager = new THREE.LoadingManager();
manager.setURLModifier((url) => {
  if (url.toLowerCase().includes('ka23_kanisanburst_albedo.png')) {
    return './textures/KA23_KanisanBurst_Albedo.png';
  }
  return url;
});

manager.onError = (url) => {
  console.warn('読み込み失敗:', url);
};

const loader = new FBXLoader(manager);
loader.load(
  './models/CrabGuitarKA23_High.fbx',
  (object) => {
    object.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if (!material) continue;
        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace;
          material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          material.map.needsUpdate = true;
        }
        material.needsUpdate = true;
      }
    });

    scene.add(object);
    frameObject(object);
    status.textContent = 'カニギター読み込み完了';
  },
  (event) => {
    if (event.total) {
      status.textContent = `読み込み中… ${Math.round(event.loaded / event.total * 100)}%`;
    }
  },
  (error) => {
    console.error(error);
    status.textContent = '読み込みに失敗しました（F12 → Console を確認）';
  }
);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
