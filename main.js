import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const video = document.getElementById('camera');
const canvas = document.getElementById('three');
const statusEl = document.getElementById('status');
const hint = document.getElementById('hint');
const startOverlay = document.getElementById('startOverlay');
const startCameraBtn = document.getElementById('startCamera');
const captureBtn = document.getElementById('captureBtn');
const resetBtn = document.getElementById('resetBtn');
const flipBtn = document.getElementById('flipBtn');
const hideBtn = document.getElementById('hideBtn');
const moveModeBtn = document.getElementById('moveModeBtn');
const rotateModeBtn = document.getElementById('rotateModeBtn');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const shareBtn = document.getElementById('shareBtn');
const fallbackSave = document.getElementById('fallbackSave');
const closePreview = document.getElementById('closePreview');

let facingMode = 'environment';
let stream = null;
let model = null;
let modelVisible = true;
let interactionMode = 'move';
let initialModelScale = 1;
let lastCaptureBlob = null;
let lastCaptureUrl = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.01, 100);
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

scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(2, 3, 4);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 1.0);
fill.position.set(-3, 1, 2);
scene.add(fill);

// ---- PBR textures ---------------------------------------------------------
// Albedo is color data. Metallic/Roughness are linear grayscale data.
const textureLoader = new THREE.TextureLoader();

const [albedoTexture, metallicTexture, roughnessTexture] = await Promise.all([
  textureLoader.loadAsync('./textures/KA23_KanisanBurst_Albedo.png'),
  textureLoader.loadAsync('./textures/KA23_Solid_Metallic.png'),
  textureLoader.loadAsync('./textures/KA23_Solid_Roughness.png')
]);

albedoTexture.colorSpace = THREE.SRGBColorSpace;
albedoTexture.flipY = true;
metallicTexture.flipY = true;
roughnessTexture.flipY = true;

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
  if (!video.videoWidth || !video.videoHeight) return;
  if (now - lastEnvUpdate < 250) return; // about 4 updates/sec
  lastEnvUpdate = now;

  const vw = video.videoWidth;
  const vh = video.videoHeight;
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
      ctx.drawImage(video, sx, sy, side, side, 0, 0, ENV_SIZE, ENV_SIZE);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(video, sx, sy, side, side, 0, 0, ENV_SIZE, ENV_SIZE);
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
        map: albedoTexture,
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
    video.srcObject = stream;
    await video.play();
    startOverlay.style.display = 'none';
    statusEl.textContent = 'カメラ起動中';
  } catch (e) {
    console.error(e);
    alert('カメラを起動できませんでした。Safariのカメラ許可と、HTTPS接続を確認してください。');
  }
}

startCameraBtn.addEventListener('click', startCamera);

flipBtn.addEventListener('click', async () => {
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
  if (!video.videoWidth || !video.videoHeight) {
    alert('カメラの準備ができていません。');
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

  // Draw video using "cover" crop to match object-fit: cover.
  drawVideoCover(ctx, video, out.width, out.height);

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
  const vw = videoEl.videoWidth;
  const vh = videoEl.videoHeight;
  const scale = Math.max(outW / vw, outH / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const dx = (outW - dw) / 2;
  const dy = (outH - dh) / 2;

  // Mirror the front camera preview so capture matches what the user sees.
  if (facingMode === 'user') {
    ctx.save();
    ctx.translate(outW, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoEl, outW - dx - dw, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(videoEl, dx, dy, dw, dh);
  }
}
