import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const video = document.getElementById('camera');
const photoBackground = document.getElementById('photoBackground');
const photoPicker = document.getElementById('photoPicker');
const canvas = document.getElementById('three');
const statusEl = document.getElementById('status');
const hint = document.getElementById('hint');
const startOverlay = document.getElementById('startOverlay');
const startCameraBtn = document.getElementById('startCamera');
const startPhotoBtn = document.getElementById('startPhoto');
const captureBtn = document.getElementById('captureBtn');
const resetBtn = document.getElementById('resetBtn');
const flipBtn = document.getElementById('flipBtn');
const hideBtn = document.getElementById('hideBtn');
const inputBtn = document.getElementById('inputBtn');
const inputPanel = document.getElementById('inputPanel');
const closeInputBtn = document.getElementById('closeInputBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const pickPhotoBtn = document.getElementById('pickPhotoBtn');
const photoModeBadge = document.getElementById('photoModeBadge');
const lightBtn = document.getElementById('lightBtn');
const lightPanel = document.getElementById('lightPanel');
const closeLightBtn = document.getElementById('closeLightBtn');
const fovBtn = document.getElementById('fovBtn');
const fovPanel = document.getElementById('fovPanel');
const closeFovBtn = document.getElementById('closeFovBtn');
const fovRange = document.getElementById('fovRange');
const fovOut = document.getElementById('fovOut');
const resetFovBtn = document.getElementById('resetFovBtn');
const colorBtn = document.getElementById('colorBtn');
const colorPanel = document.getElementById('colorPanel');
const closeColorBtn = document.getElementById('closeColorBtn');
const colorChoices = [...document.querySelectorAll('.color-choice')];
const autoLight = document.getElementById('autoLight');
const lightPower = document.getElementById('lightPower');
const lightPowerOut = document.getElementById('lightPowerOut');
const lightAzimuth = document.getElementById('lightAzimuth');
const lightAzimuthOut = document.getElementById('lightAzimuthOut');
const lightElevation = document.getElementById('lightElevation');
const lightElevationOut = document.getElementById('lightElevationOut');
const lightNote = document.getElementById('lightNote');
const moveModeBtn = document.getElementById('moveModeBtn');
const rotateModeBtn = document.getElementById('rotateModeBtn');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const shareBtn = document.getElementById('shareBtn');
const fallbackSave = document.getElementById('fallbackSave');
const closePreview = document.getElementById('closePreview');

let inputMode = 'camera';
let facingMode = 'environment';
let stream = null;
let photoObjectUrl = null;
let model = null;
let modelVisible = true;
let interactionMode = 'move';
let initialModelScale = 1;
let lastCaptureBlob = null;
let lastCaptureUrl = null;

const DEFAULT_FOV = 42;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, innerWidth / innerHeight, 0.01, 100);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const hemi = new THREE.HemisphereLight(0xffffff, 0x666666, 1.75);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(2, 3, 4);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 0.9);
fill.position.set(-3, 1, 2);
scene.add(fill);

// ---- Adaptive / manual lighting ------------------------------------------
const lightSampleCanvas = document.createElement('canvas');
lightSampleCanvas.width = 32;
lightSampleCanvas.height = 24;
const lightSampleCtx = lightSampleCanvas.getContext('2d', { willReadFrequently: true });
let lastLightSample = 0;
let autoLightingEnabled = true;

const neutralWhite = new THREE.Color(1, 1, 1);
const sampledColor = new THREE.Color(1, 1, 1);
const targetLightColor = new THREE.Color(1, 1, 1);

function setManualLightPosition() {
  const az = THREE.MathUtils.degToRad(Number(lightAzimuth.value));
  const el = THREE.MathUtils.degToRad(Number(lightElevation.value));
  const radius = 5;
  const cosEl = Math.cos(el);
  key.position.set(
    Math.sin(az) * cosEl * radius,
    Math.sin(el) * radius,
    Math.cos(az) * cosEl * radius
  );
}

function setManualLighting() {
  const power = Number(lightPower.value);
  key.color.set(0xffffff);
  fill.color.set(0xffffff);
  hemi.color.set(0xffffff);
  hemi.groundColor.set(0x666666);
  key.intensity = power;
  fill.intensity = power * 0.40;
  hemi.intensity = 1.45;
  setManualLightPosition();
}

function updateLightLabels() {
  lightPowerOut.textContent = Number(lightPower.value).toFixed(2);
  lightAzimuthOut.textContent = `${Math.round(Number(lightAzimuth.value))}°`;
  lightElevationOut.textContent = `${Math.round(Number(lightElevation.value))}°`;
}

function updateLightControlState() {
  autoLightingEnabled = autoLight.checked;
  lightAzimuth.disabled = autoLightingEnabled;
  lightElevation.disabled = autoLightingEnabled;
  lightPower.disabled = autoLightingEnabled;
  lightNote.textContent = autoLightingEnabled
    ? 'AUTO中は、カメラ映像の平均色・明るさ・明るい方向を照明に反映します。'
    : '手動中は、明るさと光の方向を自由に調整できます。';
  if (!autoLightingEnabled) setManualLighting();
}

function updateAdaptiveLighting(now) {
  const source = getActiveBackgroundSource();
  if (!autoLightingEnabled || !source) return;
  if (now - lastLightSample < 400) return;
  lastLightSample = now;

  const w = lightSampleCanvas.width;
  const h = lightSampleCanvas.height;
  lightSampleCtx.clearRect(0, 0, w, h);
  drawSourceCover(lightSampleCtx, source, w, h, false);
  const data = lightSampleCtx.getImageData(0, 0, w, h).data;
  const data = lightSampleCtx.getImageData(0, 0, w, h).data;

  let r = 0, g = 0, b = 0, lumSum = 0;
  let brightWeight = 0, brightX = 0, brightY = 0;
  const count = w * h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const rr = data[i] / 255;
      const gg = data[i + 1] / 255;
      const bb = data[i + 2] / 255;
      const lum = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
      r += rr; g += gg; b += bb; lumSum += lum;

      // Emphasize the brightest areas to estimate a plausible key-light direction.
      const weight = Math.max(0, lum - 0.45) ** 2;
      brightWeight += weight;
      brightX += (x / (w - 1) * 2 - 1) * weight;
      brightY += (1 - y / (h - 1) * 2) * weight;
    }
  }

  r /= count; g /= count; b /= count;
  const avgLum = lumSum / count;

  sampledColor.setRGB(r, g, b);
  // Mostly white, gently tinted by the environment so skin/paint colors do not go wild.
  targetLightColor.copy(neutralWhite).lerp(sampledColor, 0.32);
  key.color.lerp(targetLightColor, 0.35);
  fill.color.lerp(targetLightColor, 0.22);
  hemi.color.lerp(targetLightColor, 0.18);

  // Map scene brightness to a restrained lighting range.
  const autoPower = THREE.MathUtils.clamp(1.15 + avgLum * 2.35, 1.25, 3.15);
  key.intensity += (autoPower - key.intensity) * 0.28;
  fill.intensity += (autoPower * 0.38 - fill.intensity) * 0.22;
  hemi.intensity += (1.25 + avgLum * 0.75 - hemi.intensity) * 0.20;

  if (brightWeight > 0.001) {
    const nx = THREE.MathUtils.clamp(brightX / brightWeight, -1, 1);
    const ny = THREE.MathUtils.clamp(brightY / brightWeight, -1, 1);
    const desired = new THREE.Vector3(nx * 4.0, ny * 3.0 + 1.0, 4.0).normalize().multiplyScalar(5);
    key.position.lerp(desired, 0.22);
  }

  lightPower.value = key.intensity.toFixed(2);
  lightPowerOut.textContent = key.intensity.toFixed(2);
}


function getActiveBackgroundSource() {
  if (inputMode === 'photo' && photoBackground.naturalWidth > 0) return photoBackground;
  if (video.videoWidth > 0 && video.videoHeight > 0) return video;
  return null;
}

function getSourceMetrics(sourceEl) {
  if (!sourceEl) return null;
  if (sourceEl === video) {
    return { width: video.videoWidth, height: video.videoHeight, mirror: facingMode === 'user' };
  }
  if (sourceEl === photoBackground) {
    return { width: photoBackground.naturalWidth, height: photoBackground.naturalHeight, mirror: false };
  }
  return null;
}

function drawSourceCover(ctx, sourceEl, outW, outH, overrideMirror = null) {
  const metrics = getSourceMetrics(sourceEl);
  if (!metrics || !metrics.width || !metrics.height) return false;

  const sw = metrics.width;
  const sh = metrics.height;
  const scale = Math.max(outW / sw, outH / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  const dx = (outW - dw) / 2;
  const dy = (outH - dh) / 2;
  const shouldMirror = overrideMirror ?? metrics.mirror;

  if (shouldMirror) {
    ctx.save();
    ctx.translate(outW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(sourceEl, outW - dx - dw, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(sourceEl, dx, dy, dw, dh);
  }

  return true;
}

function closeTopPanels() {
  inputPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  fovPanel.classList.remove('open');
  colorPanel.classList.remove('open');
}

function updateInputUI() {
  const isCamera = inputMode === 'camera';
  switchCameraBtn.classList.toggle('active', isCamera);
  pickPhotoBtn.classList.toggle('active', !isCamera);
  photoModeBadge.textContent = isCamera ? '選択' : '使用中';
  photoModeBadge.style.opacity = isCamera ? '1' : '1';
  flipBtn.disabled = !isCamera;
}

function stopCameraStream() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  video.srcObject = null;
}

async function activateCameraMode() {
  inputMode = 'camera';
  photoBackground.style.display = 'none';
  video.style.display = 'block';
  updateInputUI();
  closeTopPanels();
  statusEl.textContent = 'カメラ起動中';
  await startCamera();
}

function activatePhotoMode() {
  inputMode = 'photo';
  stopCameraStream();
  video.style.display = 'none';
  photoBackground.style.display = 'block';
  updateInputUI();
  closeTopPanels();
  startOverlay.style.display = 'none';

  if (photoBackground.naturalWidth > 0) {
    statusEl.textContent = '写真モード';
  } else {
    statusEl.textContent = '写真を選択してください';
  }
}

function setPhotoFromFile(file) {
  if (!file) return;
  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = URL.createObjectURL(file);
  photoBackground.src = photoObjectUrl;
  photoBackground.onload = () => {
    activatePhotoMode();
    statusEl.textContent = '写真モード';
  };
}
// ---- PBR textures ---------------------------------------------------------
// Albedo is color data. Metallic/Roughness are linear grayscale data.
const textureLoader = new THREE.TextureLoader();

const [
  redTexture,
  mintTexture,
  blackTexture,
  darkBrownTexture,
  redBrownTexture,
  metallicTexture,
  roughnessTexture
] = await Promise.all([
  textureLoader.loadAsync('./textures/KA23_Red_Albedo.png'),
  textureLoader.loadAsync('./textures/KA23_Mint_Albedo.png'),
  textureLoader.loadAsync('./textures/KA23_Black_Albedo.png'),
  textureLoader.loadAsync('./textures/KA23_DarkBrown_Albedo.png'),
  textureLoader.loadAsync('./textures/KA23_RedBrown_Albedo.png'),
  textureLoader.loadAsync('./textures/KA23_Solid_Metallic.png'),
  textureLoader.loadAsync('./textures/KA23_Solid_Roughness.png')
]);

const colorTextures = {
  red: redTexture,
  mint: mintTexture,
  black: blackTexture,
  darkBrown: darkBrownTexture,
  redBrown: redBrownTexture
};

for (const tex of Object.values(colorTextures)) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = true;
}
metallicTexture.flipY = true;
roughnessTexture.flipY = true;

let currentColorKey = 'red';

// Reflection tuning.
// Camera footage supplies live color/context, while a neutral fill prevents
// metallic areas from collapsing to black when the phone cannot see 360° around it.
const CAMERA_ENV_BLEND = 0.68;
const ENV_REFLECTION_INTENSITY = 1.15;
const METALNESS_GAIN = 0.88;
const ENV_MIN_BRIGHTNESS = 0.34;

// ---- Pseudo live environment reflection ----------------------------------
// The phone camera is only a forward-facing image, not a true 360° environment.
// For this lightweight Web version we build a small CubeTexture from several
// cropped copies of the live camera image. It is not physically exact, but it
// lets shiny/metallic areas pick up the color and brightness of the surroundings.
const ENV_SIZE = 64;
const envCanvases = Array.from({ length: 6 }, () => {
  const c = document.createElement('canvas');
  c.width = ENV_SIZE;
  c.height = ENV_SIZE;
  return c;
});

const liveEnvMap = new THREE.CubeTexture(envCanvases);
liveEnvMap.colorSpace = THREE.SRGBColorSpace;
liveEnvMap.needsUpdate = true;

let lastEnvUpdate = 0;

function updateLiveEnvironment(now) {
  const source = getActiveBackgroundSource();
  const metrics = getSourceMetrics(source);
  if (!source || !metrics) return;
  if (now - lastEnvUpdate < 250) return; // about 4 updates/sec
  lastEnvUpdate = now;

  const vw = metrics.width;
  const vh = metrics.height;
  const side = Math.min(vw, vh);
  const sxBase = (vw - side) * 0.5;
  const syBase = (vh - side) * 0.5;

  envCanvases.forEach((c, i) => {
    const ctx = c.getContext('2d', { alpha: false });
    ctx.save();

    // Neutral studio base: this is the important safety net that keeps metal
    // reflective instead of turning black when camera coverage is incomplete.
    const base = Math.round(255 * ENV_MIN_BRIGHTNESS);
    ctx.fillStyle = `rgb(${base}, ${base}, ${base})`;
    ctx.fillRect(0, 0, ENV_SIZE, ENV_SIZE);

    const shiftX = ((i % 3) - 1) * side * 0.12;
    const shiftY = (i >= 3 ? 1 : -1) * side * 0.06;
    const sx = Math.max(0, Math.min(vw - side, sxBase + shiftX));
    const sy = Math.max(0, Math.min(vh - side, syBase + shiftY));

    // Pull live color from the current camera image, but brighten/soften it
    // because it is being used as lighting rather than as a literal screen.
    ctx.globalAlpha = CAMERA_ENV_BLEND;
    ctx.filter = 'brightness(1.35) saturate(0.92) blur(1.5px)';

    if (i % 2 === 1) {
      ctx.translate(ENV_SIZE, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(source, sx, sy, side, side, 0, 0, ENV_SIZE, ENV_SIZE);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(source, sx, sy, side, side, 0, 0, ENV_SIZE, ENV_SIZE);
    }

    ctx.filter = 'none';

    // Add a soft "window" highlight so chrome/metal always has something bright
    // to reflect. Camera colors remain visible underneath it.
    const grad = ctx.createLinearGradient(0, 0, ENV_SIZE, ENV_SIZE);
    grad.addColorStop(0.0, 'rgba(255,255,255,0.42)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.10)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0.00)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ENV_SIZE, ENV_SIZE);

    ctx.restore();
  });

  liveEnvMap.needsUpdate = true;
}


function setKaniColor(colorKey) {
  const nextTexture = colorTextures[colorKey];
  if (!nextTexture) return;

  currentColorKey = colorKey;

  if (model) {
    model.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      for (const mat of mats) {
        mat.map = nextTexture;
        mat.needsUpdate = true;
      }
    });
  }

  colorChoices.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === colorKey);
  });

  const selected = {
    red: '赤',
    mint: 'ミント',
    black: '黒',
    darkBrown: 'こげ茶',
    redBrown: '赤茶'
  }[colorKey];

  if (selected) statusEl.textContent = `カラー：${selected}`;
}

const loader = new FBXLoader();
loader.load(
  './models/CrabGuitarKA23_High.fbx',
  (fbx) => {
    model = fbx;

    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;

      // Use one predictable PBR material so FBX material colors do not tint
      // the Albedo red. The supplied maps control color, metalness and roughness.
      const pbrMaterial = new THREE.MeshStandardMaterial({
        map: colorTextures[currentColorKey],
        metalnessMap: metallicTexture,
        roughnessMap: roughnessTexture,
        // Slightly under 1.0 on purpose: keeps a small diffuse contribution
        // so very dark metallic texels do not collapse to pure black.
        metalness: METALNESS_GAIN,
        roughness: 1.0,
        envMap: liveEnvMap,
        envMapIntensity: ENV_REFLECTION_INTENSITY
      });

      child.material = pbrMaterial;
    });

    // Center model and normalize scale.
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    model.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 2.2 / maxDim;
    initialModelScale = s;
    model.scale.setScalar(initialModelScale);

    // Put it in front of camera. Slightly tilted for a friendly initial view.
    model.rotation.set(0.05, -0.2, -0.12);
    model.position.set(0, 0, 0);
    scene.add(model);

    statusEl.textContent = 'カニギター準備完了';
    setTimeout(() => { hint.style.opacity = '0'; }, 3500);
  },
  undefined,
  (err) => {
    console.error(err);
    statusEl.textContent = 'モデル読み込み失敗';
  }
);

function resize() {
  const w = innerWidth;
  const h = innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
addEventListener('resize', resize);

function render(now = 0) {
  updateLiveEnvironment(now);
  updateAdaptiveLighting(now);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert('このブラウザではカメラを利用できません。iPhoneではSafariでHTTPSページを開いてください。');
    return;
  }

  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });
    inputMode = 'camera';
    video.style.display = 'block';
    photoBackground.style.display = 'none';
    video.srcObject = stream;
    await video.play();
    startOverlay.style.display = 'none';
    updateInputUI();
    statusEl.textContent = 'カメラ起動中';
  } catch (e) {
    console.error(e);
    alert('カメラを起動できませんでした。Safariのカメラ許可と、HTTPS接続を確認してください。');
  }
}

startCameraBtn.addEventListener('click', activateCameraMode);
startPhotoBtn.addEventListener('click', () => photoPicker.click());
photoPicker.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) setPhotoFromFile(file);
  photoPicker.value = '';
});

flipBtn.addEventListener('click', async () => {
  if (inputMode !== 'camera') return;
  facingMode = facingMode === 'environment' ? 'user' : 'environment';
  await startCamera();
});

resetBtn.addEventListener('click', () => {
  if (!model) return;
  model.position.set(0, 0, 0);
  model.rotation.set(0.05, -0.2, -0.12);
  model.scale.setScalar(initialModelScale);
});

hideBtn.addEventListener('click', () => {
  if (!model) return;
  modelVisible = !modelVisible;
  model.visible = modelVisible;
  hideBtn.textContent = modelVisible ? '隠す' : '表示';
});

inputBtn.addEventListener('click', () => {
  inputPanel.classList.toggle('open');
  lightPanel.classList.remove('open');
  fovPanel.classList.remove('open');
  colorPanel.classList.remove('open');
});

closeInputBtn.addEventListener('click', () => {
  inputPanel.classList.remove('open');
});

switchCameraBtn.addEventListener('click', () => {
  activateCameraMode();
});

pickPhotoBtn.addEventListener('click', () => {
  photoPicker.click();
});

lightBtn.addEventListener('click', () => {
  lightPanel.classList.toggle('open');
  inputPanel.classList.remove('open');
  fovPanel.classList.remove('open');
  colorPanel.classList.remove('open');
});

closeLightBtn.addEventListener('click', () => {
  lightPanel.classList.remove('open');
});

fovBtn.addEventListener('click', () => {
  fovPanel.classList.toggle('open');
  inputPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  colorPanel.classList.remove('open');
});

closeFovBtn.addEventListener('click', () => {
  fovPanel.classList.remove('open');
});

colorBtn.addEventListener('click', () => {
  colorPanel.classList.toggle('open');
  inputPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  fovPanel.classList.remove('open');
});

closeColorBtn.addEventListener('click', () => {
  colorPanel.classList.remove('open');
});

colorChoices.forEach((btn) => {
  btn.addEventListener('click', () => {
    setKaniColor(btn.dataset.color);
  });
});

fovRange.addEventListener('input', () => {
  camera.fov = Number(fovRange.value);
  camera.updateProjectionMatrix();
  fovOut.textContent = `${Math.round(camera.fov)}°`;
});

resetFovBtn.addEventListener('click', () => {
  camera.fov = DEFAULT_FOV;
  camera.updateProjectionMatrix();
  fovRange.value = String(DEFAULT_FOV);
  fovOut.textContent = `${DEFAULT_FOV}°`;
});

autoLight.addEventListener('change', updateLightControlState);
lightPower.addEventListener('input', () => {
  updateLightLabels();
  if (!autoLightingEnabled) setManualLighting();
});
lightAzimuth.addEventListener('input', () => {
  updateLightLabels();
  if (!autoLightingEnabled) setManualLightPosition();
});
lightElevation.addEventListener('input', () => {
  updateLightLabels();
  if (!autoLightingEnabled) setManualLightPosition();
});

updateLightLabels();
updateLightControlState();
updateInputUI();

function setInteractionMode(mode) {
  interactionMode = mode;
  const moving = mode === 'move';
  moveModeBtn.classList.toggle('active', moving);
  rotateModeBtn.classList.toggle('active', !moving);
  statusEl.textContent = moving ? '移動モード' : '3D回転モード';
}

moveModeBtn.addEventListener('click', () => setInteractionMode('move'));
rotateModeBtn.addEventListener('click', () => setInteractionMode('rotate'));

// Touch gestures:
// 1 finger = move OR 3D rotate, depending on selected mode
// 2 fingers = pinch scale + rotate around screen Z axis
const touches = new Map();
let gestureStart = null;

canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  gestureStart = snapshotGesture();
});

canvas.addEventListener('pointermove', (e) => {
  if (!touches.has(e.pointerId) || !model) return;

  const prev = touches.get(e.pointerId);
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (touches.size === 1) {
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;

    if (interactionMode === 'move') {
      const k = 0.0045;
      model.position.x += dx * k;
      model.position.y -= dy * k;
    } else {
      // Drag the model itself in 3D.
      // Horizontal drag turns left/right; vertical drag tilts up/down.
      const rotateSpeed = 0.010;
      model.rotation.y += dx * rotateSpeed;
      model.rotation.x += dy * rotateSpeed;
    }
  } else if (touches.size >= 2) {
    const current = snapshotGesture();
    if (gestureStart && current) {
      const scaleFactor = current.distance / gestureStart.distance;
      model.scale.multiplyScalar(scaleFactor);

      // Reversed from v1.1 so the object follows the fingers more naturally.
      model.rotation.z -= current.angle - gestureStart.angle;
      gestureStart = current;
    }
  }
});

function endPointer(e) {
  touches.delete(e.pointerId);
  gestureStart = snapshotGesture();
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

function snapshotGesture() {
  if (touches.size < 2) return null;
  const pts = [...touches.values()].slice(0, 2);
  const dx = pts[1].x - pts[0].x;
  const dy = pts[1].y - pts[0].y;
  return {
    distance: Math.max(1, Math.hypot(dx, dy)),
    angle: Math.atan2(dy, dx)
  };
}

captureBtn.addEventListener('click', () => {
  const source = getActiveBackgroundSource();
  if (!source) {
    alert(inputMode === 'photo' ? '写真を選択してください。' : 'カメラの準備ができていません。');
    return;
  }

  const out = document.createElement('canvas');

  // Match the current screen aspect ratio to what the user sees.
  const cssW = innerWidth;
  const cssH = innerHeight;
  const ratio = Math.min(devicePixelRatio, 2);
  out.width = Math.round(cssW * ratio);
  out.height = Math.round(cssH * ratio);

  const ctx = out.getContext('2d');

  // Draw current background using "cover" crop to match what the user sees.
  drawSourceCover(ctx, source, out.width, out.height);

  // Render three.js at capture resolution and composite it.
  const oldSize = new THREE.Vector2();
  renderer.getSize(oldSize);
  const oldRatio = renderer.getPixelRatio();

  renderer.setPixelRatio(1);
  renderer.setSize(out.width, out.height, false);
  camera.aspect = out.width / out.height;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);

  ctx.drawImage(renderer.domElement, 0, 0, out.width, out.height);

  // Restore screen renderer.
  renderer.setPixelRatio(oldRatio);
  renderer.setSize(cssW, cssH, false);
  camera.aspect = cssW / cssH;
  camera.updateProjectionMatrix();

  out.toBlob((blob) => {
    if (!blob) {
      alert('画像の作成に失敗しました。');
      return;
    }

    lastCaptureBlob = blob;
    if (lastCaptureUrl) URL.revokeObjectURL(lastCaptureUrl);
    lastCaptureUrl = URL.createObjectURL(blob);

    previewImg.src = lastCaptureUrl;
    fallbackSave.href = lastCaptureUrl;
    fallbackSave.style.display = 'none';
    preview.style.display = 'flex';
  }, 'image/png');
});

shareBtn.addEventListener('click', async () => {
  if (!lastCaptureBlob) return;

  const file = new File([lastCaptureBlob], 'kani-guitar-photo.png', { type: 'image/png' });

  try {
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({
        files: [file],
        title: 'カニギターといっしょ'
      });
      return;
    }

    // Web Share のファイル共有に未対応の場合だけ従来の保存リンクを表示。
    fallbackSave.style.display = 'inline-block';
    alert('このブラウザでは画像共有に対応していないため、「ファイルとして保存」を使ってください。');
  } catch (e) {
    if (e?.name === 'AbortError') return;
    console.error(e);
    fallbackSave.style.display = 'inline-block';
    alert('共有を開けませんでした。「ファイルとして保存」を使ってください。');
  }
});

closePreview.addEventListener('click', () => {
  preview.style.display = 'none';
});

function drawVideoCover(ctx, videoEl, outW, outH) {
  return drawSourceCover(ctx, videoEl, outW, outH);
}
