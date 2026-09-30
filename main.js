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
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const shareBtn = document.getElementById('shareBtn');
const fallbackSave = document.getElementById('fallbackSave');
const closePreview = document.getElementById('closePreview');

let facingMode = 'environment';
let stream = null;
let model = null;
let modelVisible = true;
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

scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(2, 3, 4);
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 1.0);
fill.position.set(-3, 1, 2);
scene.add(fill);

const texture = await new THREE.TextureLoader().loadAsync('./textures/KA23_KanisanBurst_Albedo.png');
texture.colorSpace = THREE.SRGBColorSpace;
texture.flipY = true;

const loader = new FBXLoader();
loader.load(
  './models/CrabGuitarKA23_High.fbx',
  (fbx) => {
    model = fbx;

    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (!mat) return;
        mat.map = texture;
        if (mat.color) mat.color.set(0xffffff);
        mat.needsUpdate = true;
      });
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
    model.scale.setScalar(s);

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

function render() {
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
  model.scale.setScalar(model.scale.x / model.scale.x); // normalize below
  // Recompute original normalized scale from bounding box.
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    const factor = 2.2 / maxDim;
    model.scale.multiplyScalar(factor);
  }
});

hideBtn.addEventListener('click', () => {
  if (!model) return;
  modelVisible = !modelVisible;
  model.visible = modelVisible;
  hideBtn.textContent = modelVisible ? '隠す' : '表示';
});

// Touch gestures:
// 1 finger = move in screen plane
// 2 fingers = pinch scale + rotate around Z
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
    const k = 0.0045;
    model.position.x += dx * k;
    model.position.y -= dy * k;
  } else if (touches.size >= 2) {
    const current = snapshotGesture();
    if (gestureStart && current) {
      const scaleFactor = current.distance / gestureStart.distance;
      model.scale.multiplyScalar(scaleFactor);
      model.rotation.z += current.angle - gestureStart.angle;
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
