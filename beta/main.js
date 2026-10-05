import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

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
const shadowDirectionPad = document.getElementById('shadowDirectionPad');
const shadowDirectionKnob = document.getElementById('shadowDirectionKnob');
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
const lightDirectionPad = document.getElementById('lightDirectionPad');
const lightDirectionKnob = document.getElementById('lightDirectionKnob');
const lightNote = document.getElementById('lightNote');
const lightMethod = document.getElementById('lightMethod');
const scanEnvironmentBtn = document.getElementById('scanEnvironmentBtn');
const scanEnvironmentStatus = document.getElementById('scanEnvironmentStatus');
const chromeTestBtn = document.getElementById('chromeTestBtn');
let chromeTestEnabled = false;
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const shareBtn = document.getElementById('shareBtn');
const shareBackgroundBtn = document.getElementById('shareBackgroundBtn');
const fallbackSave = document.getElementById('fallbackSave');
const fallbackBackgroundSave = document.getElementById('fallbackBackgroundSave');
const closePreview = document.getElementById('closePreview');
const saveHelp = document.getElementById('saveHelp');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const renderCompareBtn = document.getElementById('renderCompareBtn');
const renderComparePanel = document.getElementById('renderComparePanel');
const closeRenderCompareBtn = document.getElementById('closeRenderCompareBtn');
const renderChoices = [...document.querySelectorAll('.render-choice')];
const helpBtn = document.getElementById('helpBtn');
const helpOverlay = document.getElementById('helpOverlay');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const savePanel = document.getElementById('savePanel');
const closeSaveBtn = document.getElementById('closeSaveBtn');
const formatJpegBtn = document.getElementById('formatJpegBtn');
const formatPngBtn = document.getElementById('formatPngBtn');
const previewFormatJpegBtn = document.getElementById('previewFormatJpegBtn');
const previewFormatPngBtn = document.getElementById('previewFormatPngBtn');
const savePsdBtn = document.getElementById('savePsdBtn');
const placementModeBtn = document.getElementById('placementModeBtn');
const guitarModeBtn = document.getElementById('guitarModeBtn');

let inputMode = 'camera';
let facingMode = 'environment';
let stream = null;
let photoObjectUrl = null;
let model = null;
let modelVisible = true;
let transformMode = 'placement';
let placementRotation = new THREE.Quaternion();
let placementScale = 1;
let placementGroup = null;
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
  const screenH = window.visualViewport?.height || innerHeight;
  const portrait = screenH >= screenW;
  const aspect = portrait ? 9 / 16 : 16 / 9;
  let width = screenW;
  let height = width / aspect;
  if (height > screenH) {
    height = screenH;
    width = height * aspect;
  }
  const freeY = Math.max(0, screenH - height);
  // Keep the complete 9:16 live frame inside the visible viewport.
  // The top band gets all remaining vertical space; nothing is hidden below.
  // In portrait, lift the complete 9:16 frame slightly while keeping it
  // fully visible and below the top controls. Capture uses this same viewport.
  const portraitLift = portrait ? Math.min(18, freeY * 0.22) : 0;
  const top = portrait ? Math.max(0, freeY - portraitLift) : freeY * 0.5;

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
  const oldAspect = camera.aspect;
  const newAspect = v.width / v.height;
  document.documentElement.style.setProperty('--capture-left', `${v.left}px`);
  document.documentElement.style.setProperty('--capture-top', `${v.top}px`);
  document.documentElement.style.setProperty('--capture-width', `${v.width}px`);
  document.documentElement.style.setProperty('--capture-height', `${v.height}px`);
  if (Math.abs(newAspect - oldAspect) > 0.001) {
    compensateProjection(camera.fov, oldAspect, camera.fov, newAspect);
  }
  camera.aspect = newAspect;
  camera.updateProjectionMatrix();
  renderer.setSize(v.width, v.height, false);
  updatePerspectiveGuide();
  return v;
}

const scene = new THREE.Scene();
const initialViewport = getCaptureViewport();
const camera = new THREE.PerspectiveCamera(DEFAULT_FOV, initialViewport.width / initialViewport.height, 0.01, 100);
camera.position.set(0, 0, 5);

// Projection compensation uses the model center's depth along the camera view
// axis. This is the quantity PerspectiveCamera actually uses for magnification;
// Euclidean camera-to-model distance is wrong when the model has been moved sideways.
function projectionFactor(fovDeg, aspect) {
  const tanV = Math.tan(THREE.MathUtils.degToRad(fovDeg) * 0.5);
  const tanH = tanV * aspect;
  return 1 / Math.min(tanV, tanH);
}
function modelViewDepth() {
  if (!model) return null;
  const viewDir = new THREE.Vector3();
  camera.getWorldDirection(viewDir);
  return {
    viewDir,
    depth: new THREE.Vector3().subVectors(model.position, camera.position).dot(viewDir)
  };
}
function compensateProjection(oldFov, oldAspect, newFov, newAspect) {
  const state = modelViewDepth();
  if (!state || state.depth <= 0.01) return;
  const oldFactor = projectionFactor(oldFov, oldAspect);
  const newFactor = projectionFactor(newFov, newAspect);
  // Apparent size is proportional to factor / depth.
  const newDepth = state.depth * (newFactor / oldFactor);
  model.position.addScaledVector(state.viewDir, newDepth - state.depth);
}

let perspectiveGuide = null;
let perspectiveGuideBounds = null;
function ensurePerspectiveGuide() {
  if (!model || perspectiveGuide) return;

  // Build the box in the model's own local coordinates. Parenting it to the
  // model makes the guide follow every 3D rotation instead of rebuilding an
  // axis-aligned world box on each frame.
  model.updateMatrixWorld(true);
  const inverseModel = model.matrixWorld.clone().invert();
  const localBox = new THREE.Box3();
  const tempBox = new THREE.Box3();
  const tempPoint = new THREE.Vector3();
  let hasBounds = false;
  model.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
    if (!child.geometry.boundingBox) return;
    tempBox.copy(child.geometry.boundingBox).applyMatrix4(child.matrixWorld);
    for (let xi = 0; xi < 2; xi++) for (let yi = 0; yi < 2; yi++) for (let zi = 0; zi < 2; zi++) {
      tempPoint.set(
        xi ? tempBox.max.x : tempBox.min.x,
        yi ? tempBox.max.y : tempBox.min.y,
        zi ? tempBox.max.z : tempBox.min.z
      ).applyMatrix4(inverseModel);
      if (!hasBounds) {
        localBox.min.copy(tempPoint);
        localBox.max.copy(tempPoint);
        hasBounds = true;
      } else {
        localBox.expandByPoint(tempPoint);
      }
    }
  });
  if (!hasBounds) return;

  perspectiveGuideBounds = localBox.clone();
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  localBox.getSize(size);
  localBox.getCenter(center);
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.78,
    depthTest: false
  });
  perspectiveGuide = new THREE.LineSegments(edges, material);
  perspectiveGuide.position.copy(center);
  perspectiveGuide.renderOrder = 999;
  perspectiveGuide.visible = false;
  model.add(perspectiveGuide);
}
function updatePerspectiveGuide() {
  if (!model) return;
  ensurePerspectiveGuide();
  if (!perspectiveGuide) return;
  perspectiveGuide.visible = fovPanel.classList.contains('open') && !suppressFloorGuideForCapture;
}


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

// Studio IBL: Poly Haven "Studio Small 02" (CC0), stored locally.
// Start with no environment, then replace it with the PMREM-filtered HDRI
// as soon as the 1K file finishes loading. The camera/photo remains visible
// because the HDRI is used only for material reflections/lighting.
let studioEnvironment = null;
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader()
  .setPath('./')
  .load('../textures/environment/studio_small_02_1k.hdr', (hdrTexture) => {
    const previousStudioEnvironment = studioEnvironment;
    studioEnvironment = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();

    if (previousStudioEnvironment) previousStudioEnvironment.dispose();

    // Rebind immediately when Studio is the active environment.
    if (iblSourceState === 'studio') {
      applyRenderQualityMode(renderQualityMode);
      if (chromeTestEnabled) applyChromeTestMode();
      renderer.render(scene, camera);
    }
  }, undefined, (error) => {
    console.error('Studio HDRI load failed:', error);
    pmremGenerator.dispose();
  });

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
key.castShadow = false;
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

// Independent directional light used only to generate the projected floor shadow.
// Its direction is controlled in floor-local space, independently from visual lighting.
const shadowKey = new THREE.DirectionalLight(0xffffff, 0);
shadowKey.position.set(2, 4, 3);
shadowKey.castShadow = true;
shadowKey.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
shadowKey.shadow.camera.left = -4;
shadowKey.shadow.camera.right = 4;
shadowKey.shadow.camera.top = 4;
shadowKey.shadow.camera.bottom = -4;
shadowKey.shadow.camera.near = 0.1;
shadowKey.shadow.camera.far = 20;
shadowKey.shadow.bias = -0.0008;
shadowKey.shadow.normalBias = 0.02;
shadowKey.shadow.radius = 3;
// A zero-intensity light does not participate in lighting but still owns the
// shadow camera; the shadow receiver uses that shadow map.
scene.add(shadowKey);
scene.add(shadowKey.target);

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
let placementFloorFrozen = false;
const placementFloorPosition = new THREE.Vector3();
const placementFloorQuaternion = new THREE.Quaternion();
let placementFloorScale = 1;
let modelFootOffsetY = -0.55;
let suppressFloorGuideForCapture = false;
let showFloorGuideDuringGuitarGesture = false;

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
  if (!floorPivot || (!floorPanel.classList.contains('open') && transformMode !== 'placement') || !floorGuideEnabledState || suppressFloorGuideForCapture) {
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

// Bounds of the actual crab-guitar meshes only. The perspective guide is a
// child of the model so it follows rotation, but must never affect floor/shadow
// calculations.
function getCrabGuitarWorldBox() {
  const box = new THREE.Box3();
  let hasBounds = false;
  if (!model) return box;
  model.updateMatrixWorld(true);
  model.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
    if (!child.geometry.boundingBox) return;
    const childBox = child.geometry.boundingBox.clone().applyMatrix4(child.matrixWorld);
    if (!hasBounds) {
      box.copy(childBox);
      hasBounds = true;
    } else {
      box.union(childBox);
    }
  });
  return box;
}

function updateVirtualFloor() {
  const floorUIActive = floorPanel.classList.contains('open') || transformMode === 'placement';
  if (!floorShadowEnabledState && !floorUIActive) {
    if (virtualFloor) virtualFloor.visible = false;
    if (floorGuide) floorGuide.visible = false;
    floorPivotMarker.classList.remove('visible');
    return;
  }

  ensureVirtualFloor();

  // After leaving placement mode, the floor becomes a fixed world-space
  // reference. Guitar-mode edits must never make it follow the model again.
  if (placementFloorFrozen && transformMode === 'guitar') {
    floorPivot.position.copy(placementFloorPosition);
    floorPivot.quaternion.copy(placementFloorQuaternion);
    floorPivot.scale.setScalar(placementFloorScale);
    floorPivot.updateMatrixWorld(true);
    virtualFloor.rotation.set(-Math.PI / 2, 0, 0);
    virtualFloor.material.opacity = floorShadowOpacityState;
    virtualFloor.visible = floorShadowEnabledState;
    floorGuide.rotation.set(-Math.PI / 2, 0, 0);
    floorGuide.visible = floorGuideEnabledState && showFloorGuideDuringGuitarGesture && !suppressFloorGuideForCapture;
    shadowKey.shadow.radius = floorShadowSoftnessState * 18;
    shadowKey.shadow.blurSamples = floorShadowSoftnessState <= 0.001 ? 1 : Math.round(2 + floorShadowSoftnessState * 22);
    shadowKey.target.position.copy(floorPivot.position);
    shadowKey.target.updateMatrixWorld();
    updateFloorPivotMarker();
    return;
  }

  // In placement mode the shared parent group owns the floor transform.
  // Never rebuild the pivot from legacy floor sliders/model bounds here.
  if (transformMode === 'placement' && floorPivot.parent === placementGroup) {
    virtualFloor.rotation.set(-Math.PI / 2, 0, 0);
    virtualFloor.material.opacity = floorShadowOpacityState;
    virtualFloor.visible = floorShadowEnabledState;
    floorGuide.rotation.set(-Math.PI / 2, 0, 0);
    floorGuide.visible = floorGuideEnabledState && !suppressFloorGuideForCapture;
    shadowKey.shadow.radius = floorShadowSoftnessState * 18;
    shadowKey.shadow.blurSamples = floorShadowSoftnessState <= 0.001 ? 1 : Math.round(2 + floorShadowSoftnessState * 22);
    const worldFloorPos = new THREE.Vector3();
    floorPivot.getWorldPosition(worldFloorPos);
    shadowKey.target.position.copy(worldFloorPos);
    shadowKey.target.updateMatrixWorld();
    updateFloorPivotMarker();
    return;
  }

  // Pivot follows the crab-guitar foot point. Height is applied to the pivot
  // itself. Rotation happens only on the pivot; the floor remains centered at
  // local origin. This makes the yellow + the true rotation center identical.
  let pivotX = floorOffsetX;
  let pivotY = floorYState + floorOffsetY + floorHeightState;
  let pivotZ = 0;
  if (model) {
    const box = getCrabGuitarWorldBox();
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
  floorGuide.visible = floorGuideEnabledState && (floorPanel.classList.contains('open') || transformMode === 'placement' || showFloorGuideDuringGuitarGesture) && !suppressFloorGuideForCapture;
  floorGuide.updateMatrixWorld(true);

  shadowKey.shadow.radius = floorShadowSoftnessState * 18;
  shadowKey.shadow.blurSamples = floorShadowSoftnessState <= 0.001
    ? 1
    : Math.round(2 + floorShadowSoftnessState * 22);
  shadowKey.target.position.copy(floorPivot.position);
  shadowKey.target.updateMatrixWorld();

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
  updateShadowDirectionPad();
}

function updateShadowDirectionPad() {
  if (!shadowDirectionPad || !shadowDirectionKnob) return;
  const rad = THREE.MathUtils.degToRad(shadowDirectionState);
  const lengthNorm = THREE.MathUtils.clamp((shadowLengthState - 0.15) / 1.65, 0, 1);
  const radius = lengthNorm * 42;
  shadowDirectionKnob.style.left = `calc(50% + ${Math.sin(rad) * radius}%)`;
  shadowDirectionKnob.style.top = `calc(50% - ${Math.cos(rad) * radius}%)`;
}
function setShadowDirectionFromPointer(e) {
  if (!shadowDirectionPad) return;
  const r = shadowDirectionPad.getBoundingClientRect();
  const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
  const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
  const distance = THREE.MathUtils.clamp(Math.hypot(x, y), 0, 1);
  if (distance > 0.035) shadowDirectionState = THREE.MathUtils.radToDeg(Math.atan2(x, -y));
  // Center = short/high light, edge = long/low light.
  shadowLengthState = THREE.MathUtils.lerp(0.15, 1.80, distance);
  shadowDirection.value = String(Math.round(shadowDirectionState));
  shadowLength.value = shadowLengthState.toFixed(2);
  manualShadowShapeEnabled = true;
  updateFloorLabels();
  updateShadowDirectionPad();
  updateShadowFromDirectControls();
  boostLiveFps();
}
shadowDirectionPad?.addEventListener('pointerdown', (e) => {
  shadowDirectionPad.setPointerCapture(e.pointerId);
  setShadowDirectionFromPointer(e);
});
shadowDirectionPad?.addEventListener('pointermove', (e) => {
  if (shadowDirectionPad.hasPointerCapture(e.pointerId)) setShadowDirectionFromPointer(e);
});
shadowDirectionPad?.addEventListener('pointerup', (e) => {
  if (shadowDirectionPad.hasPointerCapture(e.pointerId)) shadowDirectionPad.releasePointerCapture(e.pointerId);
});
shadowDirectionPad?.addEventListener('pointercancel', (e) => {
  if (shadowDirectionPad.hasPointerCapture(e.pointerId)) shadowDirectionPad.releasePointerCapture(e.pointerId);
});

function updateShadowFromDirectControls() {
  if (!manualShadowShapeEnabled || !model || !floorPivot) return;

  // Interpret the pad angle in the floor's own plane, not around world Y.
  // This gives a uniform 360-degree shadow direction regardless of floor tilt.
  floorPivot.updateMatrixWorld(true);
  const floorWorldQuat = new THREE.Quaternion();
  const floorWorldPos = new THREE.Vector3();
  floorPivot.getWorldQuaternion(floorWorldQuat);
  floorPivot.getWorldPosition(floorWorldPos);

  // virtualFloor is locally rotated -90deg around X, so its local X/Z axes
  // become the two in-plane world directions and local Y becomes its normal.
  const floorRight = new THREE.Vector3(1, 0, 0).applyQuaternion(floorWorldQuat).normalize();
  const floorForward = new THREE.Vector3(0, 0, 1).applyQuaternion(floorWorldQuat).normalize();
  const floorNormal = new THREE.Vector3(0, 1, 0).applyQuaternion(floorWorldQuat).normalize();

  const angle = THREE.MathUtils.degToRad(shadowDirectionState);
  const shadowDir = floorRight.clone().multiplyScalar(Math.sin(angle))
    .addScaledVector(floorForward, -Math.cos(angle))
    .normalize();

  const elevationDeg = THREE.MathUtils.lerp(
    72, 12,
    THREE.MathUtils.clamp((shadowLengthState - 0.15) / 1.65, 0, 1)
  );
  const el = THREE.MathUtils.degToRad(elevationDeg);
  const radius = 5;

  // Light sits opposite the requested shadow direction, lifted along the
  // actual floor normal. DirectionalLight rays then cast the shadow along pad direction.
  const lightDir = shadowDir.clone().multiplyScalar(-Math.cos(el))
    .addScaledVector(floorNormal, Math.sin(el))
    .normalize();

  shadowKey.target.position.copy(floorWorldPos);
  shadowKey.position.copy(floorWorldPos).addScaledVector(lightDir, radius);
  shadowKey.target.updateMatrixWorld();
  shadowKey.updateMatrixWorld();
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
let lightMethodState = 'both';
let iblSourceState = 'studio';
let environmentScanFrozen = false;
let dualScanPhase = 0;
let rearScanImage = null;
let rearScanMetrics = null;
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

  // Rotate the studio IBL around the model when requested. Three.js applies
  // this rotation to the environment reflection without moving the camera.
  // The studio PMREM is assigned per material (mat.envMap), so rotating
  // scene.environment does not rotate those reflections. Rotate each
  // material's envMap instead.
  const useIblRotation = lightMethodState === 'ibl' || lightMethodState === 'both';
  const envAzimuth = useIblRotation ? az : 0;
  const envElevation = useIblRotation ? el : 0;
  if (model) {
    model.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        // envMapRotation is Euler XYZ: X tilts the environment up/down,
        // Y turns it left/right around the model.
        if (mat && mat.envMapRotation) mat.envMapRotation.set(envElevation, envAzimuth, 0);
      });
    });
  }
}

function setManualLighting() {
  // v1.27.3 direction experiment: the slider can rotate the IBL, add a
  // directional key light, or do both. Keep the key deliberately restrained.
  if (renderQualityMode !== 'current') {
    const power = Number(lightPower.value);
    key.color.set(0xffffff);
    key.intensity = (lightMethodState === 'light' || lightMethodState === 'both') ? power * 0.28 : 0;
    fill.intensity = 0;
    hemi.intensity = blendEnabledState ? 0.38 * blendStrengthState : 0;
    setManualLightPosition();
    return;
  }
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

function updateLightDirectionPad() {
  if (!lightDirectionPad || !lightDirectionKnob) return;
  const az = Number(lightAzimuth.value);
  const el = Number(lightElevation.value);
  const x = THREE.MathUtils.clamp((az + 180) / 360, 0, 1);
  const y = THREE.MathUtils.clamp((80 - el) / 140, 0, 1);
  lightDirectionKnob.style.left = `${x * 100}%`;
  lightDirectionKnob.style.top = `${y * 100}%`;
}

function updateLightLabels() {
  lightPowerOut.textContent = Number(lightPower.value).toFixed(1);
  lightAzimuthOut.textContent = `${Math.round(Number(lightAzimuth.value))}°`;
  lightElevationOut.textContent = `${Math.round(Number(lightElevation.value))}°`;
  updateLightDirectionPad();
}

function updateLightControlState() {
  autoLightingEnabled = autoLight.checked;
  lightAzimuth.disabled = autoLightingEnabled;
  lightElevation.disabled = autoLightingEnabled;
  lightPower.disabled = autoLightingEnabled;
  if (lightDirectionPad) lightDirectionPad.classList.toggle('disabled', autoLightingEnabled);
  lightNote.textContent = autoLightingEnabled
    ? 'AUTOは後で新方式に対応予定です。現在はなじみの明るさ・色追従が動作します。'
    : '方式を選び、左右・上下で光の方向を比較できます。';
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

function updateAdaptiveLighting(now, instant = false) {
  // v1.27.1 hybrid "なじみ": keep the clean studio PMREM/Clearcoat look,
  // but let the real camera/photo gently influence IBL brightness and colour.
  // The albedo itself is never tinted.
  const source = getActiveBackgroundSource();
  if (!source || !blendEnabledState) return;
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
  for (let i = 0; i < data.length; i += 4) {
    const rr = data[i] / 255;
    const gg = data[i + 1] / 255;
    const bb = data[i + 2] / 255;
    const lum = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
    r += rr; g += gg; b += bb;
    lumSum += lum;

    // Track only the brightest parts of the image. Their weighted centroid is
    // treated as the likely dominant real-world light source.
    const px = (i / 4) % w;
    const py = Math.floor((i / 4) / w);
    const weight = Math.max(0, lum - 0.68);
    if (weight > 0) {
      const ww = weight * weight;
      brightWeight += ww;
      brightX += px * ww;
      brightY += py * ww;
    }
  }
  r /= count; g /= count; b /= count;
  const avgLum = lumSum / count;
  const strength = blendStrengthState;

  // Deliberately exaggerated v1.27.2 test: make environment matching obvious.
  // Near-black scenes can almost extinguish the studio IBL; bright scenes can
  // push it well above the normal 0.55 reference.
  const matchedIBL = THREE.MathUtils.clamp(0.02 + avgLum * 1.05, 0.02, 0.82);
  const baseIBL = iblSourceState === 'photo' ? 0.62 : 0.55;
  const matchedPhotoIBL = THREE.MathUtils.clamp(0.38 + avgLum * 0.95, 0.42, 1.05);
  const targetIBL = iblSourceState === 'photo'
    ? THREE.MathUtils.lerp(baseIBL, matchedPhotoIBL, strength)
    : THREE.MathUtils.lerp(0.55, matchedIBL, strength);

  // Exaggerated colour-temperature test: make the camera/photo colour cast
  // visibly affect ambient illumination without modifying the albedo itself.
  const safeLum = Math.max(avgLum, 0.08);
  sampledColor.setRGB(
    THREE.MathUtils.clamp(r / safeLum, 0.65, 1.35),
    THREE.MathUtils.clamp(g / safeLum, 0.65, 1.35),
    THREE.MathUtils.clamp(b / safeLum, 0.65, 1.35)
  );
  targetLightColor.copy(neutralWhite).lerp(sampledColor, 0.62 * strength);
  hemi.color.lerp(targetLightColor, 0.45);
  hemi.groundColor.copy(hemi.color).multiplyScalar(0.55);

  // v1.27.8: when using the camera/photo as the IBL, let the same real-world
  // sample provide a soft diffuse fill as a separate layer. The photo IBL
  // remains responsible for glossy reflections; this light simply keeps the
  // base colour and neck readable in dim rooms.
  const photoFill = iblSourceState === 'photo'
    ? THREE.MathUtils.lerp(0.30, 0.82, THREE.MathUtils.clamp(avgLum * 1.8, 0, 1))
    : 0.38 * THREE.MathUtils.clamp(avgLum * 2.0, 0.05, 1.0);
  const targetHemi = photoFill * strength;
  hemi.intensity = instant ? targetHemi : hemi.intensity + (targetHemi - hemi.intensity) * 0.35;

  // v1.27.9 AUTO key-light experiment. For photo IBL, a bright window,
  // monitor or ceiling lamp becomes a directional key from the same screen
  // direction. This is deliberately visible so the first iPhone test can tell
  // us whether the idea works.
  if (iblSourceState === 'photo' && brightWeight > 0.002) {
    const bx = brightX / brightWeight / Math.max(1, w - 1); // 0..1
    const by = brightY / brightWeight / Math.max(1, h - 1); // 0..1
    const nx = (bx - 0.5) * 2;
    const ny = (0.5 - by) * 2;
    const radius = 5;
    key.position.set(nx * radius, ny * radius, 3.2);
    key.color.lerp(targetLightColor, 0.35);
    const brightCoverage = THREE.MathUtils.clamp(brightWeight / count * 35, 0, 1);
    const autoKey = THREE.MathUtils.lerp(0.45, 1.65, brightCoverage) * strength;
    key.intensity = instant ? autoKey : key.intensity + (autoKey - key.intensity) * 0.4;
  } else {
    key.intensity *= 0.6;
  }
  fill.intensity = 0;

  if (model) model.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    for (const mat of mats) {
      if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
        mat.color.setRGB(1, 1, 1);
        mat.envMapIntensity = instant ? targetIBL : mat.envMapIntensity + (targetIBL - mat.envMapIntensity) * 0.55;
      }
    }
  });
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
  renderComparePanel.classList.remove('open');
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
const normalTexture = textureLoader.load('../textures/KA23_Normal.png');
metallicTexture.flipY = true;
roughnessTexture.flipY = true;
normalTexture.flipY = true;

let currentColorKey = 'red';

// Reflection tuning.
// Camera footage supplies live color/context, while a neutral fill prevents
// metallic areas from collapsing to black when the phone cannot see 360° around it.
const CAMERA_ENV_BLEND = 0.68;
const ENV_REFLECTION_INTENSITY = 1.15;
const METALNESS_GAIN = 0.88;
const ENV_MIN_BRIGHTNESS = 0.34;

// v1.26.1 visual A/B/C experiment.
// A = production look: the existing lightweight live-camera reflection.
// B = neutral PMREM studio IBL: stronger, more coherent metal/paint highlights.
// C = the same IBL plus a clear top coat for painted/glossy surfaces.
let renderQualityMode = 'coat';
// Reuse the existing roughness map as an inverse clearcoat mask without
// loading another image: rough/white areas (e.g. the fretboard) lose clearcoat,
// while smooth/dark painted areas keep it.
function applyInvertedRoughnessClearcoatMask(mat) {
  if (!mat?.isMeshPhysicalMaterial) return;
  mat.onBeforeCompile = (shader) => {
    // Reuse the existing roughness map as a clearcoat mask.
    shader.fragmentShader = shader.fragmentShader.replace(
      'float clearcoat = material.clearcoat;',
      `float clearcoat = material.clearcoat;
#ifdef USE_ROUGHNESSMAP
  clearcoat *= (1.0 - texture2D( roughnessMap, vRoughnessMapUv ).g);
#endif`
    );

    // Reuse the same map to reduce IBL only on matte pixels.  Do this at the
    // indirect-specular accumulation line, where reflectedLight is already in
    // scope, instead of touching Three.js' internal radiance variables.
    shader.fragmentShader = shader.fragmentShader.replace(
      'reflectedLight.indirectSpecular += radiance * BRDF_GGX( material, geometryNormal, geometryViewDir, clearcoatF0, clearcoatF90, clearcoatRoughness );',
      `#ifdef USE_ROUGHNESSMAP
  float kaniIblMask = mix( 1.0, 0.28, texture2D( roughnessMap, vRoughnessMapUv ).g );
#else
  float kaniIblMask = 1.0;
#endif
reflectedLight.indirectSpecular += radiance * BRDF_GGX( material, geometryNormal, geometryViewDir, clearcoatF0, clearcoatF90, clearcoatRoughness ) * kaniIblMask;`
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      'reflectedLight.indirectSpecular += radiance * BRDF_GGX( material, geometryNormal, geometryViewDir );',
      `#ifdef USE_ROUGHNESSMAP
  float kaniBaseIblMask = mix( 1.0, 0.28, texture2D( roughnessMap, vRoughnessMapUv ).g );
#else
  float kaniBaseIblMask = 1.0;
#endif
reflectedLight.indirectSpecular += radiance * BRDF_GGX( material, geometryNormal, geometryViewDir ) * kaniBaseIblMask;`
    );
  };
  mat.customProgramCacheKey = () => 'kani-roughness-ibl-mask-v4';
}

function applyRenderQualityMode(mode) {
  renderQualityMode = mode;
  if (!model) return;
  model.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((oldMat, index) => {
      if (!oldMat.isMeshStandardMaterial && !oldMat.isMeshPhysicalMaterial) return;

      const wantsCoat = mode === 'coat';
      let mat = oldMat;

      // Switch material class only when C needs the extra clearcoat layer.
      if (wantsCoat && !oldMat.isMeshPhysicalMaterial) {
        mat = new THREE.MeshPhysicalMaterial();
        THREE.MeshStandardMaterial.prototype.copy.call(mat, oldMat);
        if (Array.isArray(child.material)) child.material[index] = mat;
        else child.material = mat;
        oldMat.dispose();
      } else if (!wantsCoat && oldMat.isMeshPhysicalMaterial) {
        mat = new THREE.MeshStandardMaterial();
        mat.copy(oldMat);
        if (Array.isArray(child.material)) child.material[index] = mat;
        else child.material = mat;
        oldMat.dispose();
      }

      if (mode === 'current') {
        // Exact current production reflection path.
        mat.envMap = liveEnvMap;
        mat.envMapIntensity = ENV_REFLECTION_INTENSITY;
      } else {
        // B/C use a proper prefiltered image-based lighting environment.
        mat.envMap = iblSourceState === 'photo' ? liveEnvMap : studioEnvironment;
        // Keep the broad glossy reflection, but lower its energy so saturated
        // paint keeps its red color instead of clipping toward white on iPhone.
        // C can stay slightly stronger because clearcoat separates the glossy
        // top reflection from the colored base layer.
        mat.envMapIntensity = iblSourceState === 'studio' ? (mode === 'coat' ? 0.38 : 0.35) : (mode === 'coat' ? 0.55 : 0.50);
      }

      if (mat.isMeshPhysicalMaterial) {
        mat.clearcoat = wantsCoat ? 0.58 : 0;
        mat.clearcoatRoughness = wantsCoat ? 0.18 : 0;
        applyInvertedRoughnessClearcoatMask(mat);
      }
      mat.needsUpdate = true;
    });
  });
  // Isolate B/C from the legacy lighting/blending controls. Returning to A
  // immediately restores their current settings rather than changing them.
  if (mode === 'current') {
    if (blendEnabledState) {
      lastLightSample = 0;
    } else {
      resetBackgroundBlend();
    }
    if (autoLightingEnabled) {
      lastLightSample = 0;
    } else {
      setManualLighting();
    }
  } else {
    resetBackgroundBlend();
    key.intensity = 0;
    fill.intensity = 0;
    hemi.intensity = blendEnabledState ? 0.16 * blendStrengthState : 0;
    lastLightSample = 0;
  }

  renderChoices.forEach((btn) => btn.classList.toggle('active', btn.dataset.renderMode === mode));
  statusEl.textContent = mode === 'current'
    ? '画質 A：現在'
    : mode === 'ibl'
      ? '画質 B：IBL反射'
      : '画質 C：IBL＋クリアコート';
  boostLiveFps();
}

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

let liveEnvMap = new THREE.CubeTexture(envCanvases);
liveEnvMap.colorSpace = THREE.SRGBColorSpace;
liveEnvMap.needsUpdate = true;
let lastEnvUpdate = 0;

function captureVideoFrameForScan() {
  if (!video.videoWidth || !video.videoHeight) return null;
  const c = document.createElement('canvas');
  c.width = Math.min(512, video.videoWidth);
  c.height = Math.max(1, Math.round(c.width * video.videoHeight / video.videoWidth));
  const ctx = c.getContext('2d', { alpha: false });
  ctx.drawImage(video, 0, 0, c.width, c.height);
  return c;
}

function updateLiveEnvironment(now) {
  const source = getActiveBackgroundSource();
  const metrics = getSourceMetrics(source);
  if (!source || !metrics) return;
  if (now - lastEnvUpdate < 1000) return; // power-saving: 1 IBL update/sec
  lastEnvUpdate = now;

  const vw = metrics.width;
  const vh = metrics.height;
  const side = Math.min(vw, vh);
  const sxBase = (vw - side) * 0.5;
  const syBase = (vh - side) * 0.5;

  envCanvases.forEach((c, i) => {
    const ctx = c.getContext('2d', { alpha: false });
    ctx.save();

    // v1.27.7: photo-only IBL. Fill missing coverage with a dark neutral
    // floor rather than the old studio-like safety light.
    const base = 10;
    ctx.fillStyle = `rgb(${base}, ${base}, ${base})`;
    ctx.fillRect(0, 0, ENV_SIZE, ENV_SIZE);

    // True two-hemisphere projection. For every cube-face pixel, calculate
    // its 3D direction, decide which hemisphere it belongs to, then sample the
    // corresponding camera image with a fisheye-like azimuth/elevation mapping.
    ctx.globalAlpha = 1;
    ctx.filter = 'none';

    const faceDirections = [
      (u,v) => [ 1, -v, -u], // +X
      (u,v) => [-1, -v,  u], // -X
      (u,v) => [ u,  1,  v], // +Y
      (u,v) => [ u, -1, -v], // -Y
      (u,v) => [ u, -v,  1], // +Z
      (u,v) => [-u, -v, -1]  // -Z
    ];
    const out = ctx.createImageData(ENV_SIZE, ENV_SIZE);
    const rearCtx = rearScanImage?.getContext?.('2d', { willReadFrequently: true });
    const rearData = rearCtx ? rearCtx.getImageData(0, 0, rearScanImage.width, rearScanImage.height) : null;
    const temp = document.createElement('canvas');
    temp.width = metrics.width;
    temp.height = metrics.height;
    const tempCtx = temp.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(source, 0, 0, metrics.width, metrics.height);
    const liveData = tempCtx.getImageData(0, 0, metrics.width, metrics.height);

    const sampleRGB = (data, sw, sh, x, y) => {
      const ix = Math.max(0, Math.min(sw - 1, Math.round(x * (sw - 1))));
      const iy = Math.max(0, Math.min(sh - 1, Math.round(y * (sh - 1))));
      const si = (iy * sw + ix) * 4;
      const rr = data.data[si] / 255;
      const gg = data.data[si+1] / 255;
      const bb = data.data[si+2] / 255;
      const lum = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
      const highlight = THREE.MathUtils.smoothstep(lum, 0.72, 0.98);
      const gain = 1.02 + highlight * highlight * 0.48;
      return [Math.min(1, rr * gain), Math.min(1, gg * gain), Math.min(1, bb * gain)];
    };
    const writeRGB = (rgb, di) => {
      out.data[di] = rgb[0] * 255;
      out.data[di+1] = rgb[1] * 255;
      out.data[di+2] = rgb[2] * 255;
      out.data[di+3] = 255;
    };
    const sample = (data, sw, sh, x, y, di) => {
      const ix = Math.max(0, Math.min(sw - 1, Math.round(x * (sw - 1))));
      const iy = Math.max(0, Math.min(sh - 1, Math.round(y * (sh - 1))));
      const si = (iy * sw + ix) * 4;
      // Pseudo-HDR reconstruction from the SDR camera frame.
      // Keep midtones fairly natural, but boost the brightest pixels much
      // harder so windows/lamps regain some of their lost lighting energy.
      const rr = data.data[si] / 255;
      const gg = data.data[si+1] / 255;
      const bb = data.data[si+2] / 255;
      const lum = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
      const highlight = THREE.MathUtils.smoothstep(lum, 0.72, 0.98);
      const gain = 1.02 + highlight * highlight * 0.48;
      out.data[di] = Math.min(255, rr * gain * 255);
      out.data[di+1] = Math.min(255, gg * gain * 255);
      out.data[di+2] = Math.min(255, bb * gain * 255);
      out.data[di+3] = 255;
    };

    for (let py = 0; py < ENV_SIZE; py++) {
      const v = (py + 0.5) / ENV_SIZE * 2 - 1;
      for (let px = 0; px < ENV_SIZE; px++) {
        const u = (px + 0.5) / ENV_SIZE * 2 - 1;
        let [dx,dy,dz] = faceDirections[i](u,v);
        const inv = 1 / Math.hypot(dx,dy,dz);
        dx*=inv; dy*=inv; dz*=inv;
        const useRear = dz >= 0 || dualScanPhase !== 2 || !rearData;
        const localZ = Math.abs(dz);
        // Perspective-like hemisphere mapping: center = straight ahead,
        // rim = 90 degrees from the camera axis.
        const denom = Math.max(0.001, localZ + 0.34);
        let sx = 0.5 + (dx / denom) * 0.29;
        let sy = 0.5 - (dy / denom) * 0.29;
        sx = THREE.MathUtils.clamp(sx, 0, 1);
        sy = THREE.MathUtils.clamp(sy, 0, 1);
        const di = (py * ENV_SIZE + px) * 4;
        if (rearData && dualScanPhase === 2) {
          // Blend both camera hemispheres around the equator instead of making
          // a hard rear/front cut. About a 20-degree band hides exposure/color
          // differences between the two iPhone cameras.
          const rearRGB = sampleRGB(rearData, rearScanImage.width, rearScanImage.height, sx, sy);
          const frontRGB = sampleRGB(liveData, metrics.width, metrics.height, 1 - sx, sy);
          const blendHalfWidth = 0.18;
          const rearWeight = THREE.MathUtils.smoothstep(dz, -blendHalfWidth, blendHalfWidth);
          writeRGB([
            THREE.MathUtils.lerp(frontRGB[0], rearRGB[0], rearWeight),
            THREE.MathUtils.lerp(frontRGB[1], rearRGB[1], rearWeight),
            THREE.MathUtils.lerp(frontRGB[2], rearRGB[2], rearWeight)
          ], di);
        } else {
          sample(liveData, metrics.width, metrics.height, sx, sy, di);
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    ctx.filter = 'none';

    // No synthetic studio/window highlight: bright areas in the actual photo
    // should become the highlights in the reflection.
    ctx.globalAlpha = 1;

    ctx.restore();
  });

  // iOS Safari does not reliably refresh a CubeTexture whose canvas faces
  // are mutated in place. Recreate the texture object, just like the working
  // live environment update path does.
  const previousLiveEnvMap = liveEnvMap;
  liveEnvMap = new THREE.CubeTexture(envCanvases);
  liveEnvMap.colorSpace = THREE.SRGBColorSpace;
  liveEnvMap.needsUpdate = true;

  if (iblSourceState === 'photo' && model) {
    model.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        mat.envMap = liveEnvMap;
        mat.needsUpdate = true;
      });
    });
  }
  if (previousLiveEnvMap) previousLiveEnvMap.dispose();
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
      // Shadows are background elements; the guitar must always render above them.
      child.renderOrder = 100;

      // Use one predictable PBR material so FBX material colors do not tint
      // the Albedo red. The supplied maps control color, metalness and roughness.
      const pbrMaterial = new THREE.MeshStandardMaterial({
        map: colorTextures[currentColorKey],
        metalnessMap: metallicTexture,
        roughnessMap: roughnessTexture,
        normalMap: normalTexture,
        normalScale: new THREE.Vector2(0.65, 0.65),
        // Slightly under 1.0 on purpose: keeps a small diffuse contribution
        // so very dark metallic texels do not collapse to pure black.
        metalness: METALNESS_GAIN,
        roughness: 1.0,
        envMap: liveEnvMap,
        envMapIntensity: ENV_REFLECTION_INTENSITY,
        color: blendTint,
        depthTest: true,
        depthWrite: true
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
    ensureVirtualFloor();
    // Startup defaults to placement mode so the user first aligns the scene.
    const initialPlacementGroup = ensurePlacementGroup();
    initialPlacementGroup.attach(model);
    initialPlacementGroup.attach(floorPivot);
    setTransformMode('placement');
    ensurePerspectiveGuide();
    updateGroundShadow();
    updateVirtualFloor();
    updateShadowFromDirectControls();

    applyRenderQualityMode(renderQualityMode);
    statusEl.textContent = 'カニギター準備完了';
    setTimeout(() => { hint.style.opacity = '0'; }, 3500);
  },
  undefined,
  (err) => {
    console.error(err);
    statusEl.textContent = 'モデル読み込み失敗';
  }
);

let viewportSettleTimer = 0;
let viewportSettleRaf = 0;

function resize() {
  // iOS emits several resize/visualViewport changes while rotating.
  // Apply once on the next frame, then re-check after Safari has settled.
  cancelAnimationFrame(viewportSettleRaf);
  clearTimeout(viewportSettleTimer);
  viewportSettleRaf = requestAnimationFrame(() => {
    applyCaptureViewport();
    viewportSettleTimer = setTimeout(() => {
      applyCaptureViewport();
    }, 260);
  });
}

addEventListener('resize', resize);
addEventListener('orientationchange', resize);
window.visualViewport?.addEventListener('resize', resize);

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

  if (!environmentScanFrozen) {
    updateLiveEnvironment(now);
    updateAdaptiveLighting(now);
  }

  // Shadow systems are normally off. Avoid their per-frame transforms and
  // model bounds traversal unless the user is actually using them.
  if (shadowEnabledState || groundShadow) updateGroundShadow();
  if (floorShadowEnabledState || floorPanel.classList.contains('open')) updateVirtualFloor();
  if (fovPanel.classList.contains('open')) updatePerspectiveGuide();

  if (chromeTestEnabled && model) {
    model.traverse((child) => {
      if (!child.isMesh || !child.material || !child.userData.chromeOriginalMaterial) return;
      child.material.envMap = iblSourceState === 'photo' ? liveEnvMap : studioEnvironment;
      child.material.envMapIntensity = 1.0;
      if (child.material.envMapRotation) {
        const useIblRotation = lightMethodState === 'ibl' || lightMethodState === 'both';
        child.material.envMapRotation.set(
          useIblRotation ? THREE.MathUtils.degToRad(Number(lightElevation.value)) : 0,
          useIblRotation ? THREE.MathUtils.degToRad(Number(lightAzimuth.value)) : 0,
          0
        );
      }
    });
  }
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

  // Reset everything outside the Settings menu. Settings-menu items
  // (input source, crab-guitar color/visibility, save format) are preserved.

  // Crab guitar transform.
  model.position.set(0, 0, 0);
  model.rotation.set(0.05, -0.2, -0.12);
  model.scale.setScalar(initialModelScale);

  // Perspective.
  camera.fov = DEFAULT_FOV;
  camera.updateProjectionMatrix();
  fovRange.value = String(DEFAULT_FOV);
  fovOut.textContent = `${DEFAULT_FOV}°`;

  // Background matching.
  blendEnabledState = true;
  blendStrengthState = 0.75;
  blendEnabled.checked = true;
  blendStrength.value = '0.75';
  resetBackgroundBlend();
  updateBlendLabel();

  // Lighting.
  autoLight.checked = false;
  autoLightingEnabled = false;
  lightPower.value = '2.2';
  lightAzimuth.value = '27';
  lightElevation.value = '31';
  updateLightLabels();
  updateLightControlState();
  setManualLighting();

  // Round shadow.
  shadowEnabledState = false;
  shadowOpacityState = 0.50;
  shadowBlurState = 0.30;
  shadowSizeState = 0.65;
  shadowOffsetState = -0.18;
  shadowEnabled.checked = false;
  shadowOpacity.value = '0.50';
  shadowBlur.value = '0.30';
  shadowSize.value = '0.65';
  shadowOffset.value = '-0.18';
  refreshShadowTexture();
  updateShadowLabels();
  updateGroundShadow();

  // Virtual floor/projected shadow.
  floorShadowEnabledState = false;
  floorYState = -0.55;
  floorTiltState = 0;
  floorShadowOpacityState = 0.42;
  floorShadowSoftnessState = 0.25;
  floorGuideEnabledState = true;
  floorPointPlacementMode = false;
  shadowDirectionState = -35;
  shadowLengthState = 0.55;
  manualShadowShapeEnabled = false;
  floorOffsetX = 0;
  floorOffsetY = 0;
  floorHeightState = 0;
  floorPitchState = 0;
  floorRollState = 0;
  floorScaleState = 1;
  placementFloorFrozen = false;
  placementFloorPosition.set(0, 0, 0);
  placementFloorQuaternion.identity();
  placementFloorScale = 1;
  placementRotation.identity();
  placementScale = 1;
  showFloorGuideDuringGuitarGesture = false;
  if (placementGroup) {
    scene.attach(model);
    if (floorPivot) scene.attach(floorPivot);
    placementGroup.position.set(0, 0, 0);
    placementGroup.quaternion.identity();
    placementGroup.scale.set(1, 1, 1);
  }
  if (floorPivot) {
    floorPivot.position.set(0, -0.55, 0);
    floorPivot.quaternion.identity();
    floorPivot.scale.set(1, 1, 1);
  }
  transformMode = 'guitar';
  setTransformMode('placement');
  floorShadowEnabled.checked = false;
  floorY.value = '-0.55';
  floorTilt.value = '0';
  floorShadowOpacity.value = '0.42';
  floorShadowSoftness.value = '0.25';
  floorGuideEnabled.checked = true;
  shadowDirection.value = '-35';
  shadowLength.value = '0.55';
  floorHeight.value = '0';
  floorPitch.value = '0';
  floorPointMarker.classList.remove('active');
  syncProjectedShadowRendering();
  updateFloorLabels();
  updateVirtualFloor();

  // Close adjustment panels and their guides.
  closeAdjustmentPanels();
  savePanel.classList.remove('open');
  updatePerspectiveGuide();
  updateVirtualFloor();
  syncQuickToggleButtons();

  statusEl.textContent = '撮影設定を初期状態に戻しました';
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

function installQuickMenu(button, panel, afterOpen = null) {
  button.addEventListener('click', () => {
    const willOpen = !panel.classList.contains('open');
    closeAdjustmentPanels();
    if (willOpen) {
      panel.classList.add('open');
      if (afterOpen) afterOpen();
    }
  });
}

installQuickMenu(lightBtn, lightPanel);
installQuickMenu(blendBtn, blendPanel);
installQuickMenu(shadowBtn, shadowPanel);
installQuickMenu(floorBtn, floorPanel, updateVirtualFloor);

closeLightBtn.addEventListener('click', () => {
  lightPanel.classList.remove('open');
});

fovBtn.addEventListener('click', () => {
  fovPanel.classList.toggle('open');
  updatePerspectiveGuide();
  inputPanel.classList.remove('open');
  lightPanel.classList.remove('open');
  colorPanel.classList.remove('open');
  shadowPanel.classList.remove('open');
  blendPanel.classList.remove('open');
  floorPanel.classList.remove('open');
});

closeFovBtn.addEventListener('click', () => {
  fovPanel.classList.remove('open');
  updatePerspectiveGuide();
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

function setFovKeepingApparentSize(nextFov) {
  const oldFov = camera.fov;
  compensateProjection(oldFov, camera.aspect, nextFov, camera.aspect);
  camera.fov = nextFov;
  camera.updateProjectionMatrix();
  updatePerspectiveGuide();
  boostLiveFps();
}

fovRange.addEventListener('input', () => {
  setFovKeepingApparentSize(Number(fovRange.value));
  fovOut.textContent = `${Math.round(camera.fov)}°`;
});

resetFovBtn.addEventListener('click', () => {
  setFovKeepingApparentSize(DEFAULT_FOV);
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

function setLightDirectionFromPointer(e) {
  if (autoLightingEnabled || !lightDirectionPad) return;
  const r = lightDirectionPad.getBoundingClientRect();
  const x = THREE.MathUtils.clamp((e.clientX - r.left) / r.width, 0, 1);
  const y = THREE.MathUtils.clamp((e.clientY - r.top) / r.height, 0, 1);
  lightAzimuth.value = String(Math.round(-180 + x * 360));
  lightElevation.value = String(Math.round(80 - y * 140));
  updateLightLabels();
  setManualLightPosition();
}
lightDirectionPad?.addEventListener('pointerdown', (e) => {
  lightDirectionPad.setPointerCapture(e.pointerId);
  setLightDirectionFromPointer(e);
});
lightDirectionPad?.addEventListener('pointermove', (e) => {
  if (lightDirectionPad.hasPointerCapture(e.pointerId)) setLightDirectionFromPointer(e);
});
lightMethod.addEventListener('change', () => {
  lightMethodState = lightMethod.value;
  if (!autoLightingEnabled) setManualLighting();
});
chromeTestBtn?.addEventListener('click', () => {
  chromeTestEnabled = !chromeTestEnabled;
  chromeTestBtn.textContent = chromeTestEnabled ? 'シルバー解除' : '鏡面シルバー';
  chromeTestBtn.classList.toggle('active', chromeTestEnabled);
  if (!model) return;

  model.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    if (chromeTestEnabled) {
      if (!child.userData.chromeOriginalMaterial) {
        child.userData.chromeOriginalMaterial = child.material;
      }
      // Deliberately use a brand-new material, independent of every original
      // crab-guitar texture/map/clearcoat setting. This makes it a clean IBL test.
      child.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0,
        envMap: iblSourceState === 'photo' ? liveEnvMap : studioEnvironment,
        envMapIntensity: 1.0
      });
    } else if (child.userData.chromeOriginalMaterial) {
      if (child.material?.dispose) child.material.dispose();
      child.material = child.userData.chromeOriginalMaterial;
      delete child.userData.chromeOriginalMaterial;
    }
  });

  if (!chromeTestEnabled) applyRenderQualityMode(renderQualityMode);
  boostLiveFps();
});

scanEnvironmentBtn.addEventListener('click', async () => {
  // One compact environment-light cycle:
  // ライブ → 環境光をスキャン → 前面もスキャン → スタジオ → ライブ
  if (environmentScanFrozen) {
    environmentScanFrozen = false;
    dualScanPhase = 0;
    rearScanImage = null;
    iblSourceState = 'studio';
    applyRenderQualityMode(renderQualityMode);
    if (!autoLightingEnabled) setManualLighting();
    scanEnvironmentStatus.textContent = 'スタジオ';
    scanEnvironmentBtn.textContent = 'ライブに戻す';
    return;
  }

  if (iblSourceState === 'studio' && dualScanPhase === 0 && scanEnvironmentBtn.textContent === 'ライブに戻す') {
    iblSourceState = 'photo';
    lastEnvUpdate = -Infinity;
    lastLightSample = -Infinity;
    // Switching the state alone is not enough: existing crab-guitar materials
    // keep the studio envMap until they are explicitly rebound to liveEnvMap.
    applyRenderQualityMode(renderQualityMode);
    updateLiveEnvironment(performance.now());
    updateAdaptiveLighting(performance.now(), true);
    if (!autoLightingEnabled) setManualLighting();
    scanEnvironmentStatus.textContent = 'ライブ';
    scanEnvironmentBtn.textContent = 'スキャン';
    return;
  }

  if (iblSourceState === 'photo' && dualScanPhase === 0 && scanEnvironmentBtn.textContent === 'ライブ') {
    scanEnvironmentStatus.textContent = 'ライブ';
    scanEnvironmentBtn.textContent = 'スキャン';
    return;
  }

  if (inputMode === 'camera' && dualScanPhase === 0) {
    if (facingMode !== 'environment') {
      facingMode = 'environment';
      await startCamera();
    }
    rearScanImage = captureVideoFrameForScan();
    if (!rearScanImage) return;
    iblSourceState = 'photo';
    dualScanPhase = 1;
    scanEnvironmentStatus.textContent = 'スキャン中';
    scanEnvironmentBtn.textContent = '前面もスキャン';
    facingMode = 'user';
    await startCamera();
    return;
  }

  iblSourceState = 'photo';
  lastEnvUpdate = -Infinity;
  lastLightSample = -Infinity;
  applyRenderQualityMode(renderQualityMode);
  if (inputMode === 'camera' && dualScanPhase === 1) dualScanPhase = 2;
  const scanNow = performance.now();
  updateLiveEnvironment(scanNow);
  updateAdaptiveLighting(scanNow, true);
  environmentScanFrozen = true;
  scanEnvironmentStatus.textContent = 'スキャン固定';
  scanEnvironmentBtn.textContent = 'スタジオに戻す';

  if (inputMode === 'camera' && dualScanPhase === 2 && facingMode !== 'environment') {
    facingMode = 'environment';
    await startCamera();
  }
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

// Direct touch gestures:
// 1 finger = screen-relative 3D rotation
// 2 fingers = center movement + pinch scale + screen-relative twist
// The three two-finger components are applied together, so no mode switch is needed.
const touches = new Map();
let gestureStart = null;
let floorDragPointerId = null;
const TWO_FINGER_MOVE_DEADZONE = 1.5;
const TWO_FINGER_PINCH_START_RATIO = 0.045; // 4.5% from the initial finger spacing
const TWO_FINGER_TWIST_DEADZONE = THREE.MathUtils.degToRad(0.35);
let pinchGesture = null;

function ensurePlacementGroup() {
  if (!placementGroup) {
    placementGroup = new THREE.Group();
    placementGroup.name = 'PlacementGroup';
    scene.add(placementGroup);
  }
  return placementGroup;
}

function setTransformMode(mode) {
  const nextMode = mode === 'placement' ? 'placement' : 'guitar';

  if (nextMode === 'placement' && transformMode !== 'placement') {
    ensureVirtualFloor();
    // Restore the exact frozen world transform before reparenting. The floor
    // must look identical when returning from guitar mode.
    if (placementFloorFrozen) {
      floorPivot.position.copy(placementFloorPosition);
      floorPivot.quaternion.copy(placementFloorQuaternion);
      floorPivot.scale.setScalar(placementFloorScale);
      floorPivot.updateMatrixWorld(true);
    }
    const group = ensurePlacementGroup();
    group.position.set(0, 0, 0);
    group.quaternion.identity();
    group.scale.set(1, 1, 1);
    group.attach(model);
    group.attach(floorPivot);
    placementFloorFrozen = false;
  } else if (transformMode === 'placement' && nextMode === 'guitar') {
    const group = ensurePlacementGroup();
    // Bake the shared placement transform back into each child, then separate
    // them. From this point guitar gestures affect only the guitar.
    scene.attach(model);
    scene.attach(floorPivot);
    placementFloorPosition.copy(floorPivot.position);
    placementFloorQuaternion.copy(floorPivot.quaternion);
    placementFloorScale = floorPivot.scale.x;
    placementFloorFrozen = true;
    group.position.set(0, 0, 0);
    group.quaternion.identity();
    group.scale.set(1, 1, 1);
  }

  transformMode = nextMode;
  placementModeBtn?.classList.toggle('active', transformMode === 'placement');
  guitarModeBtn?.classList.toggle('active', transformMode === 'guitar');
  updateVirtualFloor();
  boostLiveFps();
}
placementModeBtn?.addEventListener('click', () => setTransformMode('placement'));
guitarModeBtn?.addEventListener('click', () => setTransformMode('guitar'));

canvas.addEventListener('pointerdown', (e) => {
  boostLiveFps();
  if (transformMode === 'guitar') {
    showFloorGuideDuringGuitarGesture = true;
    updateVirtualFloor();
  }
  if (floorPointPlacementMode) {
    e.preventDefault();
    placeFloorAtScreenPoint(e.clientX, e.clientY);
    return;
  }
  canvas.setPointerCapture(e.pointerId);
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  gestureStart = snapshotGesture();
  if (gestureStart) {
    pinchGesture = {
      startDistance: gestureStart.distance,
      lastDistance: gestureStart.distance,
      active: false
    };
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!touches.has(e.pointerId) || !model) return;
  boostLiveFps();

  const prev = touches.get(e.pointerId);
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (touches.size === 1) {
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;

    // Screen-relative 3D rotation.
    const rotateSpeed = 0.010;
    const screenRight = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();
    const screenUp = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();
    const yaw = new THREE.Quaternion()
      .setFromAxisAngle(screenUp, dx * rotateSpeed);
    const pitch = new THREE.Quaternion()
      .setFromAxisAngle(screenRight, dy * rotateSpeed);
    const rotationTarget = transformMode === 'placement' ? ensurePlacementGroup() : model;
    rotationTarget.quaternion.premultiply(yaw);
    rotationTarget.quaternion.premultiply(pitch);
  } else if (touches.size >= 2) {
    const current = snapshotGesture();
    if (gestureStart && current) {
      // Translate by the movement of the midpoint between the two fingers.
      // Match the old one-finger move sensitivity.
      const moveDx = current.centerX - gestureStart.centerX;
      const moveDy = current.centerY - gestureStart.centerY;
      if (Math.hypot(moveDx, moveDy) >= TWO_FINGER_MOVE_DEADZONE) {
        const moveSpeed = 0.0045;
        const moveTarget = transformMode === 'placement' ? ensurePlacementGroup() : model;
        moveTarget.position.x += moveDx * moveSpeed;
        moveTarget.position.y -= moveDy * moveSpeed;
      }

      // Scale only after the finger spacing has changed clearly enough from
      // the beginning of this two-finger gesture. Small spacing changes caused
      // by translating or twisting are ignored, preventing "breathing" size.
      if (!pinchGesture) {
        pinchGesture = {
          startDistance: gestureStart.distance,
          lastDistance: gestureStart.distance,
          active: false
        };
      }
      if (!pinchGesture.active) {
        const pinchRatio = Math.abs(current.distance / pinchGesture.startDistance - 1);
        if (pinchRatio >= TWO_FINGER_PINCH_START_RATIO) {
          pinchGesture.active = true;
          // Start scaling from this point so crossing the threshold never jumps.
          pinchGesture.lastDistance = current.distance;
        }
      } else {
        const scaleFactor = current.distance / Math.max(1, pinchGesture.lastDistance);
        const scaleTarget = transformMode === 'placement' ? ensurePlacementGroup() : model;
        scaleTarget.scale.multiplyScalar(scaleFactor);
        pinchGesture.lastDistance = current.distance;
      }

      // Two-finger twist around the camera viewing axis.
      let twistDelta = current.angle - gestureStart.angle;
      if (twistDelta > Math.PI) twistDelta -= Math.PI * 2;
      if (twistDelta < -Math.PI) twistDelta += Math.PI * 2;
      if (Math.abs(twistDelta) >= TWO_FINGER_TWIST_DEADZONE) {
        const screenAxis = new THREE.Vector3(0, 0, 1)
          .applyQuaternion(camera.quaternion)
          .normalize();
        const screenTwist = new THREE.Quaternion()
          .setFromAxisAngle(screenAxis, -twistDelta);
        const twistTarget = transformMode === 'placement' ? ensurePlacementGroup() : model;
        twistTarget.quaternion.premultiply(screenTwist);
      }

      gestureStart = current;
    }
  }
});

function endPointer(e) {
  if (floorDragPointerId === e.pointerId) floorDragPointerId = null;
  touches.delete(e.pointerId);
  gestureStart = snapshotGesture();
  pinchGesture = gestureStart ? {
    startDistance: gestureStart.distance,
    lastDistance: gestureStart.distance,
    active: false
  } : null;

  // While a finger remains down, keep the interaction frame rate active.
  // Once every finger is released, drop straight back to the idle frame rate
  // instead of keeping the old 500 ms high-FPS tail. This reduces unnecessary
  // GPU work after repeated direct gestures on iPhone.
  if (touches.size > 0) {
    boostLiveFps();
  } else {
    interactionBoostUntil = 0;
    if (transformMode === 'guitar') {
      showFloorGuideDuringGuitarGesture = false;
      updateVirtualFloor();
    }
  }
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

function snapshotGesture() {
  if (touches.size < 2) return null;
  const pts = [...touches.values()].slice(0, 2);
  const dx = pts[1].x - pts[0].x;
  const dy = pts[1].y - pts[0].y;
  return {
    centerX: (pts[0].x + pts[1].x) * 0.5,
    centerY: (pts[0].y + pts[1].y) * 0.5,
    distance: Math.max(1, Math.hypot(dx, dy)),
    angle: Math.atan2(dy, dx)
  };
}

helpBtn.addEventListener('click', () => {
  morePanel.classList.remove('open');
  closeTopPanels();
  helpOverlay.classList.add('open');
});
closeHelpBtn.addEventListener('click', () => helpOverlay.classList.remove('open'));
helpOverlay.addEventListener('click', (e) => {
  if (e.target === helpOverlay) helpOverlay.classList.remove('open');
});

renderCompareBtn.addEventListener('click', () => {
  morePanel.classList.remove('open');
  closeTopPanels();
  renderComparePanel.classList.add('open');
});
closeRenderCompareBtn.addEventListener('click', () => renderComparePanel.classList.remove('open'));
renderChoices.forEach((btn) => btn.addEventListener('click', () => applyRenderQualityMode(btn.dataset.renderMode)));

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
    updatePerspectiveGuide();
    renderer.render(scene, camera);
    suppressFloorGuideForCapture = false;
    updateVirtualFloor();
    updatePerspectiveGuide();

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
    updatePerspectiveGuide();
    renderer.render(scene, camera);
    suppressFloorGuideForCapture = false;
    updateVirtualFloor();
    updatePerspectiveGuide();
    ctx.drawImage(renderer.domElement, 0, 0, outW, outH);
  } finally {
    suppressFloorGuideForCapture = false;
    updateVirtualFloor();
    updatePerspectiveGuide();
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
