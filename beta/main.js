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
const moreBtn = document.getElementById('moreBtn');
const morePanel = document.getElementById('morePanel');
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
const shadowBtn = document.getElementById('shadowBtn');
const shadowPanel = document.getElementById('shadowPanel');
const closeShadowBtn = document.getElementById('closeShadowBtn');
const shadowEnabled = document.getElementById('shadowEnabled');
const shadowOpacity = document.getElementById('shadowOpacity');
const shadowBlur = document.getElementById('shadowBlur');
const shadowSize = document.getElementById('shadowSize');
const shadowOffset = document.getElementById('shadowOffset');
const shadowOpacityOut = document.getElementById('shadowOpacityOut');
const shadowBlurOut = document.getElementById('shadowBlurOut');
const shadowSizeOut = document.getElementById('shadowSizeOut');
const shadowOffsetOut = document.getElementById('shadowOffsetOut');
const floorBtn = document.getElementById('floorBtn');
const floorPanel = document.getElementById('floorPanel');
const closeFloorBtn = document.getElementById('closeFloorBtn');
const shadowDirection = document.getElementById('shadowDirection');
const shadowDirectionOut = document.getElementById('shadowDirectionOut');
const shadowLength = document.getElementById('shadowLength');
const shadowLengthOut = document.getElementById('shadowLengthOut');
const floorPointMarker = document.getElementById('floorPointMarker');
const floorPivotMarker = document.getElementById('floorPivotMarker');
const floorHeight = document.getElementById('floorHeight');
const floorHeightOut = document.getElementById('floorHeightOut');
const floorPitch = document.getElementById('floorPitch');
const floorPitchOut = document.getElementById('floorPitchOut');
const toggleFloorDetailsBtn = document.getElementById('toggleFloorDetailsBtn');
const floorDetails = document.getElementById('floorDetails');
const floorShadowEnabled = document.getElementById('floorShadowEnabled');
const floorY = document.getElementById('floorY');
const floorYOut = document.getElementById('floorYOut');
const floorTilt = document.getElementById('floorTilt');
const floorTiltOut = document.getElementById('floorTiltOut');
const useDeviceTiltBtn = document.getElementById('useDeviceTiltBtn');
const floorShadowOpacity = document.getElementById('floorShadowOpacity');
const floorShadowOpacityOut = document.getElementById('floorShadowOpacityOut');
const floorShadowSoftness = document.getElementById('floorShadowSoftness');
const floorShadowSoftnessOut = document.getElementById('floorShadowSoftnessOut');
const floorGuideEnabled = document.getElementById('floorGuideEnabled');
const snapToFloorBtn = document.getElementById('snapToFloorBtn');
const blendBtn = document.getElementById('blendBtn');
const blendPanel = document.getElementById('blendPanel');
const closeBlendBtn = document.getElementById('closeBlendBtn');
const blendEnabled = document.getElementById('blendEnabled');
const blendStrength = document.getElementById('blendStrength');
const blendStrengthOut = document.getElementById('blendStrengthOut');
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
const shareBackgroundBtn = document.getElementById('shareBackgroundBtn');
const fallbackSave = document.getElementById('fallbackSave');
const fallbackBackgroundSave = document.getElementById('fallbackBackgroundSave');
const closePreview = document.getElementById('closePreview');
const saveHelp = document.getElementById('saveHelp');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const savePanel = document.getElementById('savePanel');
const closeSaveBtn = document.getElementById('closeSaveBtn');
const formatJpegBtn = document.getElementById('formatJpegBtn');
const formatPngBtn = document.getElementById('formatPngBtn');
const previewFormatJpegBtn = document.getElementById('previewFormatJpegBtn');
const previewFormatPngBtn = document.getElementById('previewFormatPngBtn');
const savePsdBtn = document.getElementById('savePsdBtn');

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
let lastBackgroundBlob = null;
let lastBackgroundUrl = null;
let lastCaptureCanvas = null;
let lastBackgroundCanvas = null;
const SAVE_FORMAT_KEY = 'kani-camera-save-format';
let saveFormat = (() => {
  try {
    const stored = localStorage.getItem(SAVE_FORMAT_KEY);
    return stored === 'png' ? 'png' : 'jpeg';
  } catch {
    return 'jpeg';
  }
})();
const JPEG_QUALITY = 0.92;

function getSaveMime() {
  return saveFormat === 'png' ? 'image/png' : 'image/jpeg';
}
function getSaveExtension() {
  return saveFormat === 'png' ? 'png' : 'jpg';
}
function syncSaveFormatUI() {
  const jpeg = saveFormat === 'jpeg';
  formatJpegBtn.classList.toggle('active', jpeg);
  formatPngBtn.classList.toggle('active', !jpeg);
  previewFormatJpegBtn.classList.toggle('active', jpeg);
  previewFormatPngBtn.classList.toggle('active', !jpeg);
}
function setSaveFormat(format) {
  saveFormat = format === 'png' ? 'png' : 'jpeg';
  try { localStorage.setItem(SAVE_FORMAT_KEY, saveFormat); } catch {}
  syncSaveFormatUI();
}
function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, getSaveMime(), saveFormat === 'jpeg' ? JPEG_QUALITY : undefined);
  });
}
async function rebuildSavedBlobsForFormat() {
  if (!lastCaptureCanvas || !lastBackgroundCanvas) return;
  const [backgroundBlob, captureBlob] = await Promise.all([
    canvasToBlob(lastBackgroundCanvas),
    canvasToBlob(lastCaptureCanvas)
  ]);
  if (!backgroundBlob || !captureBlob) return;

  lastBackgroundBlob = backgroundBlob;
  if (lastBackgroundUrl) URL.revokeObjectURL(lastBackgroundUrl);
  lastBackgroundUrl = URL.createObjectURL(backgroundBlob);
  fallbackBackgroundSave.href = lastBackgroundUrl;
  fallbackBackgroundSave.style.display = 'none';

  lastCaptureBlob = captureBlob;
  if (lastCaptureUrl) URL.revokeObjectURL(lastCaptureUrl);
  lastCaptureUrl = URL.createObjectURL(captureBlob);
  previewImg.src = lastCaptureUrl;
  fallbackSave.href = lastCaptureUrl;
  fallbackSave.style.display = 'none';

  const ext = getSaveExtension();
  fallbackSave.download = `kani-guitar-photo.${ext}`;
  fallbackBackgroundSave.download = `kani-guitar-background.${ext}`;
  saveHelp.textContent = `保存解像度：${lastCaptureCanvas.width} × ${lastCaptureCanvas.height} px / ${saveFormat === 'png' ? 'PNG' : 'JPEG'}`;
}

const DEFAULT_FOV = 42;

// Fixed 16:9 4K UHD capture. Portrait uses the rotated equivalent.
const CAPTURE_LONG_EDGE = 3840;
const CAPTURE_SHORT_EDGE = 2160;
const CAPTURE_SUPERSAMPLE = 1;
const CAPTURE_RENDER_EDGE_CAP = 3840;

function getCaptureViewport() {
  const screenW = innerWidth;
  const screenH = innerHeight;
  const portrait = screenH >= screenW;
  const aspect = portrait ? 9 / 16 : 16 / 9;
  let width = screenW;
  let height = width / aspect;
  if (height > screenH) {
    height = screenH;
    width = height * aspect;
  }
  const freeY = Math.max(0, screenH - height);
  // Keep the 16:9 capture unchanged, but place it lower on screen so the
  // top controls sit mostly over the black margin instead of the photo.
  // 70% of the spare vertical space is above the image, 30% below it.
  const top = portrait ? freeY * 0.70 : freeY * 0.5;
  return {
    width,
    height,
    left: (screenW - width) / 2,
    top,
    portrait
  };
}

function applyCaptureViewport() {
  const v = getCaptureViewport();
  document.documentElement.style.setProperty('--capture-left', `${v.left}px`);
  document.documentElement.style.setProperty('--capture-top', `${v.top}px`);
  document.documentElement.style.setProperty('--capture-width', `${v.width}px`);
  document.documentElement.style.setProperty('--capture-height', `${v.height}px`);
  camera.aspect = v.width / v.height;
  camera.updateProjectionMatrix();
  renderer.setSize(v.width, v.height, false);
  return v;
}

const scene = new THREE.Scene();
const initialViewport = getCaptureViewport();
const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, initialViewport.width / initialViewport.height, 0.01, 100);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true
});
// Power-saving live preview: cap DPR. High-resolution capture temporarily
// renders at its own output resolution, so saved-image quality is unaffected.
const LIVE_PIXEL_RATIO_CAP = 1.5;
renderer.setPixelRatio(Math.min(devicePixelRatio, LIVE_PIXEL_RATIO_CAP));
renderer.setSize(initialViewport.width, initialViewport.height, false);
document.documentElement.style.setProperty('--capture-left', `${initialViewport.left}px`);
document.documentElement.style.setProperty('--capture-top', `${initialViewport.top}px`);
document.documentElement.style.setProperty('--capture-width', `${initialViewport.width}px`);
document.documentElement.style.setProperty('--capture-height', `${initialViewport.height}px`);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

// v1.13: real-time projected shadow onto a transparent virtual floor.
// PCF soft shadows are light enough for live iPhone preview and are also
// included in the high-resolution capture pass.
renderer.shadowMap.enabled = true;
// VSM gives us a genuinely adjustable blur radius. PCFSoftShadowMap ignores
// the radius control on WebGLRenderer, which is why v1.13.0's blur slider
// appeared to do nothing.
renderer.shadowMap.type = THREE.VSMShadowMap;

const hemi = new THREE.HemisphereLight(0xffffff, 0x666666, 1.45);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(2, 3, 4);
key.castShadow = true;
const SHADOW_MAP_SIZE = 1024;
key.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
key.shadow.camera.left = -4;
key.shadow.camera.right = 4;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -4;
key.shadow.camera.near = 0.1;
key.shadow.camera.far = 20;
key.shadow.bias = -0.0008;
key.shadow.normalBias = 0.02;
key.shadow.radius = 3;
scene.add(key);
scene.add(key.target);

// ---- Virtual floor + projected shadow ------------------------------------
let floorPivot = null;
let virtualFloor = null;
let floorGuide = null;
let floorShadowEnabledState = false;
let floorYState = -0.55;
let floorTiltState = 0;
let floorShadowOpacityState = 0.42;
let floorShadowSoftnessState = 0.25;
let floorGuideEnabledState = true;
let floorPointPlacementMode = false; // legacy detailed mode only
let floorPointX = innerWidth * 0.5;
let floorPointY = innerHeight * 0.70;
let shadowDirectionState = -35;
let shadowLengthState = 0.55;
let manualShadowShapeEnabled = false;
let floorHeightState = 0;
let floorPitchState = 0;
let floorRollState = 0;
let floorScaleState = 1;
let floorOffsetX = 0;
let floorOffsetY = 0;
let modelFootOffsetY = -0.55;
let suppressFloorGuideForCapture = false;

function syncProjectedShadowRendering() {
  // The expensive shadow-map pass is only useful when the projected floor
  // shadow is visible. Keeping the feature OFF now skips that GPU pass too.
  renderer.shadowMap.autoUpdate = floorShadowEnabledState;
  if (floorShadowEnabledState) renderer.shadowMap.needsUpdate = true;
}
syncProjectedShadowRendering();

function ensureVirtualFloor() {
  if (floorPivot) return;

  // Dedicated pivot: this object is the ONLY world-space anchor for the floor.
  // The receiver and guide live at local (0,0,0), so their rotation can never
  // orbit around the camera or another world-space point.
  floorPivot = new THREE.Group();
  floorPivot.name = 'VirtualFloorPivot';
  scene.add(floorPivot);

  const geometry = new THREE.PlaneGeometry(12, 12);
  const shadowMaterial = new THREE.ShadowMaterial({
    color: 0x000000,
    opacity: floorShadowOpacityState,
    transparent: true,
    depthWrite: false
  });
  virtualFloor = new THREE.Mesh(geometry, shadowMaterial);
  virtualFloor.receiveShadow = true;
  virtualFloor.renderOrder = -50;
  virtualFloor.position.set(0, 0, 0);
  floorPivot.add(virtualFloor);

  const guideGeometry = new THREE.PlaneGeometry(6, 6, 6, 6);
  const guideMaterial = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.20,
    depthWrite: false
  });
  floorGuide = new THREE.Mesh(guideGeometry, guideMaterial);
  floorGuide.renderOrder = -60;
  floorGuide.position.set(0, 0, 0);
  floorPivot.add(floorGuide);
  updateVirtualFloor();
}

function updateFloorPivotMarker() {
  if (!floorPivot || !floorPanel.classList.contains('open') || suppressFloorGuideForCapture) {
    floorPivotMarker.classList.remove('visible');
    return;
  }
  const p = floorPivot.position.clone().project(camera);
  const x = (p.x * 0.5 + 0.5) * innerWidth;
  const y = (-p.y * 0.5 + 0.5) * innerHeight;
  floorPivotMarker.style.left = `${x}px`;
  floorPivotMarker.style.top = `${y}px`;
  floorPivotMarker.classList.add('visible');
}

function updateVirtualFloor() {
  const floorUIActive = floorPanel.classList.contains('open');
  if (!floorShadowEnabledState && !floorUIActive) {
    if (virtualFloor) virtualFloor.visible = false;
    if (floorGuide) floorGuide.visible = false;
    floorPivotMarker.classList.remove('visible');
    return;
  }

  ensureVirtualFloor();

  // Pivot follows the crab-guitar foot point. Height is applied to the pivot
  // itself. Rotation happens only on the pivot; the floor remains centered at
  // local origin. This makes the yellow + the true rotation center identical.
  let pivotX = floorOffsetX;
  let pivotY = floorYState + floorOffsetY + floorHeightState;
  let pivotZ = 0;
  if (model) {
    const box = new THREE.Box3().setFromObject(model);
    if (!box.isEmpty()) {
      pivotX += model.position.x;
      pivotY = box.min.y + floorHeightState + floorOffsetY;
      // Use the model's actual depth as the pivot. v1.16.1 used z - 0.25,
      // which visually shifted the apparent rotation center toward the camera.
      pivotZ = model.position.z;
    }
  }

  floorPivot.position.set(pivotX, pivotY, pivotZ);
  floorPivot.rotation.set(
    THREE.MathUtils.degToRad(floorPitchState),
    0,
    THREE.MathUtils.degToRad(floorRollState),
    'XYZ'
  );
  floorPivot.scale.setScalar(floorScaleState);
  floorPivot.updateMatrixWorld(true);

  // PlaneGeometry starts in XY, so lay each child flat locally. The pivot then
  // supplies only the user's pitch/roll around the exact foot-point origin.
  virtualFloor.rotation.set(-Math.PI / 2, 0, 0);
  virtualFloor.material.opacity = floorShadowOpacityState;
  virtualFloor.visible = floorShadowEnabledState;
  virtualFloor.updateMatrixWorld(true);

  floorGuide.rotation.set(-Math.PI / 2, 0, 0);
  floorGuide.visible = floorGuideEnabledState && floorPanel.classList.contains('open') && !suppressFloorGuideForCapture;
  floorGuide.updateMatrixWorld(true);

  key.shadow.radius = floorShadowSoftnessState * 18;
  key.shadow.blurSamples = floorShadowSoftnessState <= 0.001
    ? 1
    : Math.round(2 + floorShadowSoftnessState * 22);
  key.target.position.copy(floorPivot.position);
  key.target.updateMatrixWorld();

  updateFloorPivotMarker();
}

function updateFloorLabels() {
  floorYOut.textContent = floorYState.toFixed(2);
  floorTiltOut.textContent = `${Math.round(floorTiltState)}°`;
  floorShadowOpacityOut.textContent = floorShadowOpacityState.toFixed(2);
  floorShadowSoftnessOut.textContent = floorShadowSoftnessState.toFixed(2);
  shadowDirectionOut.textContent = `${Math.round(shadowDirectionState)}°`;
  shadowLengthOut.textContent = shadowLengthState.toFixed(2);
  floorHeightOut.textContent = floorHeightState.toFixed(2);
  floorPitchOut.textContent = `${Math.round(floorPitchState)}°`;
}

function updateShadowFromDirectControls() {
  if (!manualShadowShapeEnabled || !model) return;

  // Keep the receiver plane stable. The user edits the visible result instead:
  // direction = light azimuth opposite the desired shadow,
  // length = light elevation (lower light => longer projected shadow).
  const dir = THREE.MathUtils.degToRad(shadowDirectionState + 180);
  const elevationDeg = THREE.MathUtils.lerp(72, 12, THREE.MathUtils.clamp((shadowLengthState - 0.15) / 1.65, 0, 1));
  const el = THREE.MathUtils.degToRad(elevationDeg);
  const radius = 5;
  const cosEl = Math.cos(el);
  const target = key.target.position;
  key.position.set(
    target.x + Math.sin(dir) * cosEl * radius,
    target.y + Math.sin(el) * radius,
    target.z + Math.cos(dir) * cosEl * radius
  );
}

function setFloorPointMarker(clientX, clientY) {
  floorPointX = clientX;
  floorPointY = clientY;
  floorPointMarker.style.left = `${clientX}px`;
  floorPointMarker.style.top = `${clientY}px`;
  floorPointMarker.classList.add('active');
}

function screenYToWorldY(clientY, worldZ = -0.25) {
  // Intersect the camera ray with a plane parallel to the screen at the
  // virtual floor's reference depth. This turns one screen tap into a useful
  // floor-height value without asking the user to understand 3D coordinates.
  const ndc = new THREE.Vector2(0, -(clientY / innerHeight) * 2 + 1);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(ndc, camera);
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -worldZ);
  const hit = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(plane, hit)) return floorYState;
  return hit.y;
}

function placeFloorAtScreenPoint(clientX, clientY) {
  setFloorPointMarker(clientX, clientY);

  // Keep the floor/model relationship that already produces a valid projected
  // shadow, and move that contacted pair vertically to the tapped screen point.
  // v1.13.2 instead recomputed an absolute floor Y from a screen-parallel plane;
  // that could move the receiver away from the caster/light and make the real
  // shadow disappear.
  if (model) {
    const box = new THREE.Box3().setFromObject(model);
    if (!box.isEmpty()) {
      const currentContactY = box.min.y;
      const targetY = THREE.MathUtils.clamp(screenYToWorldY(clientY), -2.0, 1.0);
      const deltaY = targetY - currentContactY;
      model.position.y += deltaY;
      floorYState += deltaY;
      floorYState = THREE.MathUtils.clamp(floorYState, -2.0, 1.0);
      floorY.value = floorYState.toFixed(2);
    }
  }

  // Easy mode intentionally uses the stable horizontal receiver. Perspective
  // tilt remains available only in the detailed controls.
  floorTiltState = 0;
  floorTilt.value = '0';
  floorShadowEnabledState = true;
  floorShadowEnabled.checked = true;
  updateFloorLabels();
  updateVirtualFloor();

  floorPointPlacementMode = false;
  statusEl.textContent = '接地点に床と影を合わせました';
  setTimeout(() => floorPointMarker.classList.remove('active'), 1400);
}

function snapModelToFloor() {
  if (!model) return;
  // The FBX is centered on import. Use its current world bounding box so the
  // lowest visible point meets the chosen floor height without changing pose.
  const box = new THREE.Box3().setFromObject(model);
  if (box.isEmpty()) return;
  model.position.y += floorYState - box.min.y;
  statusEl.textContent = 'カニギターを床に合わせました';
}

const fill = new THREE.DirectionalLight(0xffffff, 0.9);
fill.position.set(-3, 1, 2);
scene.add(fill);

// ---- Soft ground shadow ---------------------------------------------------
let groundShadow = null;
let shadowEnabledState = false;
let shadowOpacityState = 0.50;
let shadowBlurState = 0.30;
let shadowSizeState = 0.65;
let shadowOffsetState = -0.18;

function makeShadowTexture(blurValue) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const inner = Math.max(0.03, 0.48 - blurValue * 0.34);
  const mid = Math.min(0.98, inner + 0.23 + blurValue * 0.18);
  g.addColorStop(0.0, 'rgba(0,0,0,1)');
  g.addColorStop(inner, 'rgba(0,0,0,0.98)');
  g.addColorStop(mid, 'rgba(0,0,0,0.35)');
  g.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function ensureGroundShadow() {
  if (groundShadow) return groundShadow;
  const mat = new THREE.SpriteMaterial({
    map: makeShadowTexture(shadowBlurState),
    color: 0x000000,
    transparent: true,
    opacity: shadowOpacityState,
    depthWrite: false,
    // Keep normal depth testing. Transparent objects are rendered after opaque
    // objects in Three.js, so disabling depthTest would make this sprite paint
    // over the model even with a lower renderOrder.
    depthTest: true
  });
  groundShadow = new THREE.Sprite(mat);
  groundShadow.renderOrder = -100;
  groundShadow.position.set(0, -0.2, -0.3);
  scene.add(groundShadow);
  return groundShadow;
}

function updateGroundShadow() {
  const visible = !!model && modelVisible && shadowEnabledState;
  if (!visible) {
    if (groundShadow) groundShadow.visible = false;
    return;
  }
  const shadow = ensureGroundShadow();
  shadow.visible = true;

  const scaleFactor = model.scale.x / initialModelScale;

  // KA-23 is much thinner from the side than from the front.
  // Shrink the shadow width as the model turns sideways so the footprint
  // does not stay as a large oval at every viewing angle.
  const yaw = model.rotation.y;
  const frontness = Math.abs(Math.cos(yaw));
  const footprintWidth = 0.32 + 0.68 * frontness;

  shadow.material.opacity = shadowOpacityState;
  shadow.position.set(
    model.position.x,
    model.position.y + shadowOffsetState * scaleFactor,
    model.position.z - 2.0
  );
  shadow.scale.set(
    initialModelScale * 1.35 * shadowSizeState * scaleFactor * footprintWidth,
    initialModelScale * 0.40 * shadowSizeState * scaleFactor,
    1
  );
}

function refreshShadowTexture() {
  const shadow = ensureGroundShadow();
  const next = makeShadowTexture(shadowBlurState);
  if (shadow.material.map) shadow.material.map.dispose();
  shadow.material.map = next;
  shadow.material.needsUpdate = true;
}

function updateShadowLabels() {
  shadowOpacityOut.textContent = Number(shadowOpacityState).toFixed(2);
  shadowBlurOut.textContent = Number(shadowBlurState).toFixed(2);
  shadowSizeOut.textContent = Number(shadowSizeState).toFixed(2);
  shadowOffsetOut.textContent = Number(shadowOffsetState).toFixed(2);
}

// ---- Adaptive / manual lighting ------------------------------------------
const lightSampleCanvas = document.createElement('canvas');
lightSampleCanvas.width = 32;
lightSampleCanvas.height = 24;
const lightSampleCtx = lightSampleCanvas.getContext('2d', { willReadFrequently: true });
let lastLightSample = 0;
let autoLightingEnabled = true;
let blendEnabledState = true;
let blendStrengthState = 0.75;
const blendTint = new THREE.Color(1, 1, 1);

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

function updateBlendLabel() {
  blendStrengthOut.textContent = blendStrengthState.toFixed(2);
}

function applyBackgroundBlend(avgR, avgG, avgB, avgLum) {
  if (!model) return;
  if (!blendEnabledState) {
    blendTint.setRGB(1, 1, 1);
  } else {
    const safeLum = Math.max(0.04, avgLum);

    // v1.12.1 test: make the effect intentionally obvious.
    // Chroma is allowed to swing much further than before.
    const nr = THREE.MathUtils.clamp(avgR / safeLum, 0.35, 1.85);
    const ng = THREE.MathUtils.clamp(avgG / safeLum, 0.35, 1.85);
    const nb = THREE.MathUtils.clamp(avgB / safeLum, 0.35, 1.85);
    const strength = blendStrengthState;

    // Also match exposure aggressively. A dark background should make the
    // composited model genuinely dark instead of looking studio-lit.
    // At strength=1, avgLum 0.10 -> about 0.18x; 0.25 -> about 0.45x.
    const exposureMatch = THREE.MathUtils.clamp(avgLum / 0.55, 0.08, 1.35);
    const brightness = THREE.MathUtils.lerp(1, exposureMatch, strength);

    blendTint.setRGB(
      THREE.MathUtils.clamp(THREE.MathUtils.lerp(1, nr, strength) * brightness, 0.02, 1.65),
      THREE.MathUtils.clamp(THREE.MathUtils.lerp(1, ng, strength) * brightness, 0.02, 1.65),
      THREE.MathUtils.clamp(THREE.MathUtils.lerp(1, nb, strength) * brightness, 0.02, 1.65)
    );
  }
  model.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (const mat of mats) if (mat.isMeshStandardMaterial) mat.color.copy(blendTint);
  });
}

function resetBackgroundBlend() {
  blendTint.setRGB(1, 1, 1);
  if (!model) return;
  model.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (const mat of mats) if (mat.isMeshStandardMaterial) mat.color.setRGB(1, 1, 1);
  });
}

function updateAdaptiveLighting(now) {
  const source = getActiveBackgroundSource();
  if (!source) return;
  if (!autoLightingEnabled && !blendEnabledState) return;
  if (now - lastLightSample < 600) return;
  lastLightSample = now;

  const w = lightSampleCanvas.width;
  const h = lightSampleCanvas.height;
  lightSampleCtx.clearRect(0, 0, w, h);
  drawSourceCover(lightSampleCtx, source, w, h, false);
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

  applyBackgroundBlend(r, g, b, avgLum);
  sampledColor.setRGB(r, g, b);
  if (autoLightingEnabled) {
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
  shadowPanel.classList.remove('open');
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
  savePanel.classList.remove('open');
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
  statusEl.textContent = 'カメラ起動中・省電力30fps';
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

// START INPUT LISTENERS EARLY
// Register these before the texture await so the start screen remains usable
// even while large textures are still loading on mobile networks.
startCameraBtn.addEventListener('click', activateCameraMode);
startPhotoBtn.addEventListener('click', () => photoPicker.click());
photoPicker.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) setPhotoFromFile(file);
  photoPicker.value = '';
});

// ---- PBR textures ---------------------------------------------------------
// Albedo is color data. Metallic/Roughness are linear grayscale data.
const textureLoader = new THREE.TextureLoader();

// Start texture downloads without blocking the rest of the module.
// Previously the top-level await here meant that, after the camera opened,
// most controls had no event listeners until every texture finished loading.
const colorTextureUrls = {
  red: '../textures/KA23_Red_Albedo.png',
  mint: '../textures/KA23_Mint_Albedo.png',
  black: '../textures/KA23_Black_Albedo.png',
  darkBrown: '../textures/KA23_DarkBrown_Albedo.png',
  redBrown: '../textures/KA23_RedBrown_Albedo.png'
};

// Only red is requested at startup. Other Albedo textures are downloaded on
// first selection, then kept in this in-memory cache for instant reuse.
const colorTextures = {};
const colorTexturePromises = {};

function prepareColorTexture(tex) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = true;
  return tex;
}

function loadColorTexture(colorKey) {
  if (colorTextures[colorKey]) return Promise.resolve(colorTextures[colorKey]);
  if (colorTexturePromises[colorKey]) return colorTexturePromises[colorKey];
  const url = colorTextureUrls[colorKey];
  if (!url) return Promise.reject(new Error(`Unknown color: ${colorKey}`));

  colorTexturePromises[colorKey] = new Promise((resolve, reject) => {
    textureLoader.load(url, (tex) => {
      colorTextures[colorKey] = prepareColorTexture(tex);
      resolve(colorTextures[colorKey]);
    }, undefined, reject);
  }).finally(() => {
    delete colorTexturePromises[colorKey];
  });
  return colorTexturePromises[colorKey];
}

const redTexture = prepareColorTexture(textureLoader.load(colorTextureUrls.red));
colorTextures.red = redTexture;

// Metallic/Roughness are shared by every color, so they still load once at startup.
const metallicTexture = textureLoader.load('../textures/KA23_Solid_Metallic.png');
const roughnessTexture = textureLoader.load('../textures/KA23_Solid_Roughness.png');
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
  if (now - lastEnvUpdate < 1000) return; // power-saving: about 1 update/sec
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


async function setKaniColor(colorKey) {
  if (!colorTextureUrls[colorKey]) return;

  const selected = {
    red: '赤',
    mint: 'ミント',
    black: '黒',
    darkBrown: 'こげ茶',
    redBrown: '赤茶'
  }[colorKey];

  currentColorKey = colorKey;
  const requestKey = colorKey;
  if (!colorTextures[colorKey]) {
    statusEl.textContent = `カラー読み込み中：${selected}`;
  }

  try {
    const nextTexture = await loadColorTexture(colorKey);
    // Ignore an older request if the user tapped another color while loading.
    if (requestKey !== currentColorKey) return;

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
    if (selected) statusEl.textContent = `カラー：${selected}`;
  } catch (e) {
    console.error('Color texture load failed:', e);
    statusEl.textContent = 'カラーテクスチャ読込失敗';
  }
}

const loader = new FBXLoader();
loader.load(
  '../models/CrabGuitarKA23_High.fbx',
  (fbx) => {
    model = fbx;

    model.traverse((child) => {
      if (!child.isMesh) return;
      // v1.13: cast onto the virtual floor, but do not receive shadows yet.
      // This deliberately keeps self-shadowing postponed.
      child.castShadow = true;
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
        envMapIntensity: ENV_REFLECTION_INTENSITY,
        color: blendTint
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
    updateGroundShadow();
    updateVirtualFloor();
    updateShadowFromDirectControls();

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
  applyCaptureViewport();
}
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 120));

const IDLE_FRAME_INTERVAL = 1000 / 5;
const INTERACTION_FRAME_INTERVAL = 1000 / 30;
const INTERACTION_TAIL_MS = 500;
let lastLiveFrame = -IDLE_FRAME_INTERVAL;
let interactionBoostUntil = 0;

function boostLiveFps(now = performance.now()) {
  interactionBoostUntil = Math.max(interactionBoostUntil, now + INTERACTION_TAIL_MS);
}

function render(now = 0) {
  requestAnimationFrame(render);
  const frameInterval = (touches.size > 0 || now < interactionBoostUntil)
    ? INTERACTION_FRAME_INTERVAL
    : IDLE_FRAME_INTERVAL;
  if (now - lastLiveFrame < frameInterval) return;
  lastLiveFrame = now - ((now - lastLiveFrame) % frameInterval);

  updateLiveEnvironment(now);
  updateAdaptiveLighting(now);

  // Shadow systems are normally off. Avoid their per-frame transforms and
  // model bounds traversal unless the user is actually using them.
  if (shadowEnabledState || groundShadow) updateGroundShadow();
  if (floorShadowEnabledState || floorPanel.classList.contains('open')) updateVirtualFloor();

  renderer.render(scene, camera);
}
requestAnimationFrame(render);

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
        // 1080p is ample for the live camera background and substantially
        // cheaper than requesting 4K continuously on iPhone.
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, max: 30 }
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
  floorOffsetX = 0;
  floorOffsetY = 0;
  floorHeightState = 0;
  floorPitchState = 0;
  floorRollState = 0;
  floorScaleState = 1;
  floorHeight.value = '0';
  floorPitch.value = '0';
  updateFloorLabels();
  updateVirtualFloor();
});

hideBtn.addEventListener('click', () => {
  if (!model) return;
  modelVisible = !modelVisible;
  model.visible = modelVisible;
  hideBtn.textContent = modelVisible ? 'カニギターを隠す' : 'カニギターを表示';
});

moreBtn.addEventListener('click', () => {
  morePanel.classList.toggle('open');
  inputPanel.classList.remove('open');
  colorPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  fovPanel.classList.remove('open');
  shadowPanel.classList.remove('open');
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
});

[inputBtn, colorBtn, hideBtn].forEach((btn) => {
  btn.addEventListener('click', () => morePanel.classList.remove('open'));
});

inputBtn.addEventListener('click', () => {
  inputPanel.classList.toggle('open');
  lightPanel.classList.remove('open');
  fovPanel.classList.remove('open');
  colorPanel.classList.remove('open');
  shadowPanel.classList.remove('open');
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
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

function closeAdjustmentPanels(except = null) {
  [inputPanel, fovPanel, colorPanel, lightPanel, shadowPanel, blendPanel, floorPanel, morePanel]
    .forEach((panel) => {
      if (panel !== except) panel.classList.remove('open');
    });
}

function syncQuickToggleButtons() {
  blendBtn.classList.toggle('active', blendEnabled.checked);
  lightBtn.classList.toggle('active', autoLight.checked);
  shadowBtn.classList.toggle('active', shadowEnabled.checked);
  floorBtn.classList.toggle('active', floorShadowEnabled.checked);
}

function installTapHoldControl(button, panel, toggleAction, afterOpen = null) {
  const HOLD_MS = 520;
  let holdTimer = null;
  let longPressed = false;

  button.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    longPressed = false;
    try { button.setPointerCapture(e.pointerId); } catch {}
    holdTimer = setTimeout(() => {
      longPressed = true;
      if (panel.classList.contains('open')) {
        panel.classList.remove('open');
      } else {
        closeAdjustmentPanels();
        panel.classList.add('open');
        if (afterOpen) afterOpen();
      }
      if (navigator.vibrate) navigator.vibrate(15);
    }, HOLD_MS);
  });

  const finish = (e) => {
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = null;
    if (e && button.hasPointerCapture?.(e.pointerId)) {
      try { button.releasePointerCapture(e.pointerId); } catch {}
    }
  };
  button.addEventListener('pointerup', finish);
  button.addEventListener('pointercancel', finish);

  button.addEventListener('click', (e) => {
    if (longPressed) {
      e.preventDefault();
      longPressed = false;
      return;
    }
    toggleAction();
    syncQuickToggleButtons();
  });

  button.addEventListener('contextmenu', (e) => e.preventDefault());
}

installTapHoldControl(lightBtn, lightPanel, () => {
  autoLight.checked = !autoLight.checked;
  updateLightControlState();
});

installTapHoldControl(blendBtn, blendPanel, () => {
  blendEnabled.checked = !blendEnabled.checked;
  blendEnabledState = blendEnabled.checked;
  if (!blendEnabledState) resetBackgroundBlend();
});

installTapHoldControl(shadowBtn, shadowPanel, () => {
  shadowEnabled.checked = !shadowEnabled.checked;
  shadowEnabledState = shadowEnabled.checked;
  updateGroundShadow();
});

installTapHoldControl(floorBtn, floorPanel, () => {
  floorShadowEnabled.checked = !floorShadowEnabled.checked;
  floorShadowEnabledState = floorShadowEnabled.checked;
  syncProjectedShadowRendering();
  updateVirtualFloor();
}, updateVirtualFloor);

closeLightBtn.addEventListener('click', () => {
  lightPanel.classList.remove('open');
});

fovBtn.addEventListener('click', () => {
  fovPanel.classList.toggle('open');
  inputPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  colorPanel.classList.remove('open');
  shadowPanel.classList.remove('open');
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
});

closeFovBtn.addEventListener('click', () => {
  fovPanel.classList.remove('open');
});

colorBtn.addEventListener('click', () => {
  colorPanel.classList.toggle('open');
  inputPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  fovPanel.classList.remove('open');
  shadowPanel.classList.remove('open');
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
});

closeColorBtn.addEventListener('click', () => {
  colorPanel.classList.remove('open');
});

colorChoices.forEach((btn) => {
  btn.addEventListener('click', () => {
    setKaniColor(btn.dataset.color);
  });
});

closeShadowBtn.addEventListener('click', () => {
  shadowPanel.classList.remove('open');
});

shadowDirection.addEventListener('input', () => {
  shadowDirectionState = Number(shadowDirection.value);
  updateFloorLabels();
  updateShadowFromDirectControls();
});

shadowLength.addEventListener('input', () => {
  shadowLengthState = Number(shadowLength.value);
  updateFloorLabels();
  updateShadowFromDirectControls();
});

floorHeight.addEventListener('input', () => {
  floorHeightState = Number(floorHeight.value);
  updateFloorLabels();
  updateVirtualFloor();
});
floorPitch.addEventListener('input', () => {
  floorPitchState = Number(floorPitch.value);
  updateFloorLabels();
  updateVirtualFloor();
});

toggleFloorDetailsBtn.addEventListener('click', () => {
  floorDetails.classList.toggle('open');
  toggleFloorDetailsBtn.textContent = floorDetails.classList.contains('open') ? '閉じる' : '開く';
});

closeFloorBtn.addEventListener('click', () => {
  floorPanel.classList.remove('open');
  updateVirtualFloor();
});

floorShadowEnabled.addEventListener('change', () => {
  floorShadowEnabledState = floorShadowEnabled.checked;
  syncProjectedShadowRendering();
  updateVirtualFloor();
  syncQuickToggleButtons();
});

floorY.addEventListener('input', () => {
  floorYState = Number(floorY.value);
  updateFloorLabels();
  updateVirtualFloor();
});

floorTilt.addEventListener('input', () => {
  floorTiltState = Number(floorTilt.value);
  updateFloorLabels();
  updateVirtualFloor();
});

floorShadowOpacity.addEventListener('input', () => {
  floorShadowOpacityState = Number(floorShadowOpacity.value);
  updateFloorLabels();
  updateVirtualFloor();
});

floorShadowSoftness.addEventListener('input', () => {
  floorShadowSoftnessState = Number(floorShadowSoftness.value);
  updateFloorLabels();
  updateVirtualFloor();
});

floorGuideEnabled.addEventListener('change', () => {
  floorGuideEnabledState = floorGuideEnabled.checked;
  updateVirtualFloor();
});

async function setFloorFromDeviceTilt() {
  try {
    // iOS requires motion/orientation permission from a direct user gesture.
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== 'granted') {
        statusEl.textContent = '傾きセンサーの許可が必要です';
        return;
      }
    }

    useDeviceTiltBtn.disabled = true;
    useDeviceTiltBtn.textContent = 'iPhoneを静止…';
    statusEl.textContent = 'iPhoneの傾きを測定中…';

    const samples = [];
    const onOrientation = (event) => {
      if (typeof event.beta !== 'number') return;
      // Portrait: beta is approximately 90° when the screen is vertical and
      // 0° when the phone lies flat. Convert that to our floor pitch.
      samples.push(event.beta);
    };
    window.addEventListener('deviceorientation', onOrientation);

    await new Promise(resolve => setTimeout(resolve, 650));
    window.removeEventListener('deviceorientation', onOrientation);

    if (!samples.length) {
      statusEl.textContent = '傾きを取得できませんでした';
      return;
    }

    const beta = samples.reduce((a, b) => a + b, 0) / samples.length;
    // Camera optical axis follows the phone. A level real floor's apparent
    // pitch is approximated from the device pitch. Clamp to the UI's useful range.
    const estimatedTilt = THREE.MathUtils.clamp(90 - Math.abs(beta), -60, 60);
    floorTiltState = estimatedTilt;
    floorTilt.value = String(Math.round(estimatedTilt));
    updateFloorLabels();
    updateVirtualFloor();
    statusEl.textContent = `床の傾きを自動設定：${Math.round(estimatedTilt)}°`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = '傾きセンサーを利用できません';
  } finally {
    useDeviceTiltBtn.disabled = false;
    useDeviceTiltBtn.textContent = '水平を自動設定';
  }
}

useDeviceTiltBtn.addEventListener('click', setFloorFromDeviceTilt);
snapToFloorBtn.addEventListener('click', snapModelToFloor);

closeBlendBtn.addEventListener('click', () => {
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
});

blendEnabled.addEventListener('change', () => {
  blendEnabledState = blendEnabled.checked;
  if (!blendEnabledState) resetBackgroundBlend();
  syncQuickToggleButtons();
});

blendStrength.addEventListener('input', () => {
  blendStrengthState = Number(blendStrength.value);
  updateBlendLabel();
});

shadowEnabled.addEventListener('change', () => {
  shadowEnabledState = shadowEnabled.checked;
  updateGroundShadow();
  syncQuickToggleButtons();
});

shadowOpacity.addEventListener('input', () => {
  shadowOpacityState = Number(shadowOpacity.value);
  updateShadowLabels();
  updateGroundShadow();
});

shadowBlur.addEventListener('input', () => {
  shadowBlurState = Number(shadowBlur.value);
  updateShadowLabels();
  refreshShadowTexture();
  updateGroundShadow();
});

shadowSize.addEventListener('input', () => {
  shadowSizeState = Number(shadowSize.value);
  updateShadowLabels();
  updateGroundShadow();
});

shadowOffset.addEventListener('input', () => {
  shadowOffsetState = Number(shadowOffset.value);
  updateShadowLabels();
  updateGroundShadow();
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

autoLight.addEventListener('change', () => {
  updateLightControlState();
  syncQuickToggleButtons();
});
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
syncQuickToggleButtons();
updateInputUI();
updateShadowLabels();
updateBlendLabel();
updateFloorLabels();
ensureVirtualFloor();
ensureGroundShadow();
updateGroundShadow();

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
let floorDragPointerId = null;

canvas.addEventListener('pointerdown', (e) => {
  boostLiveFps();
  if (floorPointPlacementMode) {
    e.preventDefault();
    placeFloorAtScreenPoint(e.clientX, e.clientY);
    return;
  }
  canvas.setPointerCapture(e.pointerId);
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  gestureStart = snapshotGesture();
});

canvas.addEventListener('pointermove', (e) => {
  if (!touches.has(e.pointerId) || !model) return;
  boostLiveFps();

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
  if (floorDragPointerId === e.pointerId) floorDragPointerId = null;
  touches.delete(e.pointerId);
  gestureStart = snapshotGesture();
  boostLiveFps();
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

saveSettingsBtn.addEventListener('click', () => {
  morePanel.classList.remove('open');
  closeTopPanels();
  savePanel.classList.add('open');
  syncSaveFormatUI();
});
closeSaveBtn.addEventListener('click', () => savePanel.classList.remove('open'));
formatJpegBtn.addEventListener('click', () => setSaveFormat('jpeg'));
formatPngBtn.addEventListener('click', () => setSaveFormat('png'));
previewFormatJpegBtn.addEventListener('click', async () => {
  if (saveFormat === 'jpeg') return;
  setSaveFormat('jpeg');
  await rebuildSavedBlobsForFormat();
});
previewFormatPngBtn.addEventListener('click', async () => {
  if (saveFormat === 'png') return;
  setSaveFormat('png');
  await rebuildSavedBlobsForFormat();
});
syncSaveFormatUI();


function renderPsdLayer(width, height, shadowOnly) {
  const c = document.createElement('canvas');
  c.width = width; c.height = height;
  const oldRatio = renderer.getPixelRatio();
  const oldSize = new THREE.Vector2(); renderer.getSize(oldSize);
  const oldAspect = camera.aspect;
  const floorVisible = floorPivot ? floorPivot.visible : false;
  const groundVisible = groundShadow ? groundShadow.visible : false;
  const materialStates = [];

  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  suppressFloorGuideForCapture = true;
  updateVirtualFloor();

  if (shadowOnly) {
    if (floorPivot) floorPivot.visible = floorShadowEnabledState;
    if (groundShadow) groundShadow.visible = shadowEnabledState;
    if (model) model.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => { materialStates.push([m, m.colorWrite]); m.colorWrite = false; });
    });
    renderer.shadowMap.needsUpdate = true;
  } else {
    if (floorPivot) floorPivot.visible = false;
    if (groundShadow) groundShadow.visible = false;
  }

  renderer.render(scene, camera);
  c.getContext('2d').drawImage(renderer.domElement, 0, 0, width, height);

  materialStates.forEach(([m, v]) => { m.colorWrite = v; });
  if (floorPivot) floorPivot.visible = floorVisible;
  if (groundShadow) groundShadow.visible = groundVisible;
  suppressFloorGuideForCapture = false;
  updateVirtualFloor();
  renderer.setPixelRatio(oldRatio);
  renderer.setSize(oldSize.x, oldSize.y, false);
  camera.aspect = oldAspect;
  camera.updateProjectionMatrix();
  return c;
}

async function saveLayeredPsd() {
  if (!lastCaptureCanvas || !lastBackgroundCanvas) return;
  if (!window.agPsd?.writePsd) {
    alert('PSD書き出し機能を読み込めませんでした。最新版を再読み込みしてください。');
    return;
  }
  savePsdBtn.disabled = true;
  savePsdBtn.textContent = 'PSD作成中…';
  let crab = null, shadow = null;
  try {
    const w = lastCaptureCanvas.width, h = lastCaptureCanvas.height;
    crab = renderPsdLayer(w, h, false);
    shadow = renderPsdLayer(w, h, true);
    const data = window.agPsd.writePsd({
      width: w, height: h, canvas: lastCaptureCanvas,
      children: [
        { name: 'BG', canvas: lastBackgroundCanvas },
        { name: 'Shadow', canvas: shadow },
        { name: 'Crabguitar', canvas: crab }
      ]
    }, { generateThumbnail: false });
    const blob = new Blob([data], { type: 'application/vnd.adobe.photoshop' });
    const now = new Date();
    const pad2 = (value) => String(value).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}${pad2(now.getHours())}${pad2(now.getMinutes())}`;
    const file = new File([blob], `Crabguitar${timestamp}.psd`, { type: blob.type });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      // Send only the PSD file. Do not add title/text/url: on iOS those can
      // become an extra text item in the share sheet.
      await navigator.share({ files: [file] });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
  } catch (e) {
    if (e?.name !== 'AbortError') {
      console.error(e);
      alert('PSDの作成に失敗しました。4K PSDはメモリを多く使うため、Safariを再起動すると改善する場合があります。');
    }
  } finally {
    if (crab) { crab.width = 1; crab.height = 1; }
    if (shadow) { shadow.width = 1; shadow.height = 1; }
    savePsdBtn.disabled = false;
    savePsdBtn.textContent = 'PSD（レイヤー付き）';
  }
}
savePsdBtn.addEventListener('click', saveLayeredPsd);

captureBtn.addEventListener('click', () => {
  lastBackgroundBlob = null;
  if (lastBackgroundUrl) {
    URL.revokeObjectURL(lastBackgroundUrl);
    lastBackgroundUrl = null;
  }
  fallbackBackgroundSave.style.display = 'none';

  const source = getActiveBackgroundSource();
  if (!source) {
    alert(inputMode === 'photo' ? '写真を選択してください。' : 'カメラの準備ができていません。');
    return;
  }

  const liveViewport = getCaptureViewport();
  const cssW = liveViewport.width;
  const cssH = liveViewport.height;

  // Export the exact 16:9 live frame at 4K UHD.
  const outW = liveViewport.portrait ? CAPTURE_SHORT_EDGE : CAPTURE_LONG_EDGE;
  const outH = liveViewport.portrait ? CAPTURE_LONG_EDGE : CAPTURE_SHORT_EDGE;

  // Freeze the exact background frame used by this capture. This gives the
  // user a clean plate that matches the composite in timing, crop and size.
  const backgroundOut = document.createElement('canvas');
  backgroundOut.width = outW;
  backgroundOut.height = outH;
  const backgroundCtx = backgroundOut.getContext('2d');
  backgroundCtx.imageSmoothingEnabled = true;
  backgroundCtx.imageSmoothingQuality = 'high';
  drawSourceCover(backgroundCtx, source, outW, outH);

  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Start the composite from the frozen clean background frame.
  ctx.drawImage(backgroundOut, 0, 0);

  // Render the 3D layer at higher resolution and shrink it into the final
  // canvas. 2x in each axis = 4x the pixel count for cleaner edges.
  const gl = renderer.getContext();
  const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
  const maxRenderbuffer = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
  const deviceLimit = Math.min(
    CAPTURE_RENDER_EDGE_CAP,
    maxRenderbuffer || CAPTURE_RENDER_EDGE_CAP,
    maxViewport?.[0] || CAPTURE_RENDER_EDGE_CAP,
    maxViewport?.[1] || CAPTURE_RENDER_EDGE_CAP
  );

  const supersample = Math.max(
    1,
    Math.min(
      CAPTURE_SUPERSAMPLE,
      deviceLimit / outW,
      deviceLimit / outH
    )
  );

  const renderW = Math.max(outW, Math.floor(outW * supersample));
  const renderH = Math.max(outH, Math.floor(outH * supersample));

  const oldRatio = renderer.getPixelRatio();

  try {
    // Projected shadows use the same 1024 map in preview and capture so the
    // saved result matches what the user adjusted on screen.
    statusEl.textContent = '高画質で画像作成中…';

    renderer.setPixelRatio(1);
    renderer.setSize(renderW, renderH, false);
    camera.aspect = outW / outH;
    camera.updateProjectionMatrix();
    suppressFloorGuideForCapture = true;
    updateVirtualFloor();
    renderer.render(scene, camera);
    suppressFloorGuideForCapture = false;
    updateVirtualFloor();

    // Downsampling is the antialiasing pass.
    ctx.drawImage(renderer.domElement, 0, 0, renderW, renderH, 0, 0, outW, outH);
  } catch (e) {
    console.error('High-quality capture failed:', e);

    // Fallback: still export at 4K UHD, just without supersampling.
    renderer.setPixelRatio(1);
    renderer.setSize(outW, outH, false);
    camera.aspect = outW / outH;
    camera.updateProjectionMatrix();
    suppressFloorGuideForCapture = true;
    updateVirtualFloor();
    renderer.render(scene, camera);
    suppressFloorGuideForCapture = false;
    updateVirtualFloor();
    ctx.drawImage(renderer.domElement, 0, 0, outW, outH);
  } finally {
    suppressFloorGuideForCapture = false;
    updateVirtualFloor();
    // Restore the lightweight live preview renderer.
    renderer.setPixelRatio(oldRatio);
    renderer.setSize(cssW, cssH, false);
    camera.aspect = cssW / cssH;
    camera.updateProjectionMatrix();
  }

  lastBackgroundCanvas = backgroundOut;
  lastCaptureCanvas = out;

  backgroundOut.toBlob((backgroundBlob) => {
    if (!backgroundBlob) return;
    lastBackgroundBlob = backgroundBlob;
    if (lastBackgroundUrl) URL.revokeObjectURL(lastBackgroundUrl);
    lastBackgroundUrl = URL.createObjectURL(backgroundBlob);
    fallbackBackgroundSave.href = lastBackgroundUrl;
    fallbackBackgroundSave.style.display = 'none';
  }, getSaveMime(), saveFormat === 'jpeg' ? JPEG_QUALITY : undefined);

  out.toBlob((blob) => {
    if (!blob) {
      statusEl.textContent = '画像作成失敗';
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
    saveHelp.textContent = `保存解像度：${outW} × ${outH} px / ${saveFormat === 'png' ? 'PNG' : 'JPEG'}`;
    statusEl.textContent = `保存画像 ${outW}×${outH}px`;
  }, getSaveMime(), saveFormat === 'jpeg' ? JPEG_QUALITY : undefined);
});

async function shareOrSaveBlob(blob, filename, title, fallbackLink) {
  if (!blob) return;
  const file = new File([blob], filename, { type: blob.type || getSaveMime() });
  try {
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({ files: [file], title });
      return;
    }
    fallbackLink.style.display = 'inline-block';
    alert('このブラウザでは画像共有に対応していないため、「ファイル保存」を使ってください。');
  } catch (e) {
    if (e?.name === 'AbortError') return;
    console.error(e);
    fallbackLink.style.display = 'inline-block';
    alert('共有を開けませんでした。「ファイル保存」を使ってください。');
  }
}

shareBtn.addEventListener('click', () => {
  const ext = getSaveExtension();
  fallbackSave.download = `kani-guitar-photo.${ext}`;
  shareOrSaveBlob(lastCaptureBlob, `kani-guitar-photo.${ext}`, 'カニギターといっしょ', fallbackSave);
});

shareBackgroundBtn.addEventListener('click', () => {
  const ext = getSaveExtension();
  fallbackBackgroundSave.download = `kani-guitar-background.${ext}`;
  shareOrSaveBlob(lastBackgroundBlob, `kani-guitar-background.${ext}`, '背景写真', fallbackBackgroundSave);
});

closePreview.addEventListener('click', () => {
  preview.style.display = 'none';
});

function drawVideoCover(ctx, videoEl, outW, outH) {
  return drawSourceCover(ctx, videoEl, outW, outH);
}
