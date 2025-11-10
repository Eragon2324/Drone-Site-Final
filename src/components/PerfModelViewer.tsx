import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface PerfModelViewerProps {
  src: string; // GLB
  poster?: string;
}

export default function PerfModelViewer({ src, poster }: PerfModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current!;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b0b);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 5000);
    camera.position.set(0, 2, 5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.screenSpacePanning = true;
    controls.enablePan = false; // lock model position; camera orbits only
    controls.minPolarAngle = THREE.MathUtils.degToRad(10);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(80);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envRT;

    container.appendChild(renderer.domElement);

    // Loading manager for progress
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_, itemsLoaded, itemsTotal) => {
      setProgress(Math.round((itemsLoaded / itemsTotal) * 100));
    };
    const loader = new GLTFLoader(manager);

    let model: THREE.Object3D | null = null;
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);
    pivotGroup.matrixAutoUpdate = true;
    let modelInitialQuat: THREE.Quaternion | null = null;
    let modelInitialPos: THREE.Vector3 | null = null;
    let radius = 1;
    let groundY = 0;
    let animating = false;

    const requestRenderIfNotRequested = () => {
      if (!animating) {
        animating = true;
        requestAnimationFrame(renderLoop);
      }
    };

    const renderLoop = () => {
      controls.update();
      renderer.render(scene, camera);
      // Keep looping while damping/interaction is ongoing
      if (controls.dragging || controls.autoRotate || controls.update()) {
        requestAnimationFrame(renderLoop);
      } else {
        animating = false;
      }
    };

    // Instrumentation for debugging (start/end): logs camera/target/pivot
    const logState = (label: string) => {
      const roll = Math.atan2(2*(camera.quaternion.w*camera.quaternion.z + camera.quaternion.x*camera.quaternion.y), 1 - 2*(camera.quaternion.y*camera.quaternion.y + camera.quaternion.z*camera.quaternion.z));
      const box = model ? new THREE.Box3().setFromObject(pivotGroup) : null;
      console.log(`[${label}] cam`, camera.position.toArray(), 'roll≈', roll.toFixed(3), 'target', controls.target.toArray(), 'pivotRot', pivotGroup.rotation.toArray(), 'box', box);
    };
    controls.addEventListener('start', () => logState('start'));
    controls.addEventListener('end', () => logState('end'));

    const fitCameraToBounds = (box: THREE.Box3) => {
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      radius = Math.max(size.x, size.z) * 0.6;
      groundY = box.min.y;
      controls.target.set(center.x, groundY, center.z);
      const dist = radius * 3.0;
      const elev = THREE.MathUtils.degToRad(40);
      camera.position.set(
        center.x + dist * Math.sin(elev),
        groundY + dist * Math.sin(elev),
        center.z + dist * Math.cos(elev)
      );
      camera.lookAt(controls.target);
      controls.minDistance = radius * 0.9;
      controls.maxDistance = radius * 4.0;
      requestRenderIfNotRequested();
    };

    loader.load(
      src,
      (gltf) => {
        model = gltf.scene;
        // add under neutral pivot group
        pivotGroup.add(model);

        // Axis normalization heuristic: if Z is much larger than Y, treat asset as Z-up
        let box = new THREE.Box3().setFromObject(pivotGroup);
        const size = box.getSize(new THREE.Vector3());
        const likelyZUp = size.z > size.y * 2.0; // heuristic; asset metadata often absent
        if (likelyZUp) {
          pivotGroup.rotation.x = -Math.PI / 2; // rotate to Y-up
          pivotGroup.updateMatrixWorld();
        }

        // Recompute bounds post-normalization and recenter pivot at grounded center
        box = new THREE.Box3().setFromObject(pivotGroup);
        const center = box.getCenter(new THREE.Vector3());
        const pivotWorld = new THREE.Vector3(center.x, box.min.y, center.z);
        // move pivotGroup to grounded center but compensate child so world pose is unchanged
        pivotGroup.position.copy(pivotWorld);
        model.position.sub(pivotWorld);
        pivotGroup.updateMatrixWorld(true);

        // Freeze transforms so only the camera moves
        modelInitialQuat = pivotGroup.quaternion.clone();
        modelInitialPos = pivotGroup.position.clone();
        pivotGroup.matrixAutoUpdate = false;
        pivotGroup.updateMatrixWorld(true);

        box = new THREE.Box3().setFromObject(pivotGroup);
        fitCameraToBounds(box);
        setReady(true);
      },
      undefined,
      () => {
        setReady(false);
      }
    );

    let lastAspect = width / height;
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Hysteresis: only re-fit if aspect changed significantly
      const newAspect = w / h;
      if (Math.abs(newAspect - lastAspect) > 0.05 && model) {
        const box = new THREE.Box3().setFromObject(model);
        fitCameraToBounds(box);
        lastAspect = newAspect;
      }
      requestRenderIfNotRequested();
    };
    window.addEventListener('resize', onResize);

    // Keep model absolutely static if any external change attempts to touch it
    const keepModelStatic = () => {
      if (modelInitialQuat && modelInitialPos) {
        pivotGroup.quaternion.copy(modelInitialQuat);
        pivotGroup.position.copy(modelInitialPos);
        pivotGroup.updateMatrixWorld(true);
      }
    };
    controls.addEventListener('change', () => {
      keepModelStatic();
      requestRenderIfNotRequested();
    });

    requestRenderIfNotRequested();

    // Normalize wheel/pinch feel and throttle to render cadence
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 0.25; // consistent step
      const dir = delta > 0 ? 1.05 : 0.95;
      camera.position.sub(controls.target).multiplyScalar(dir).add(controls.target);
      requestRenderIfNotRequested();
    };
    renderer.domElement.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('wheel', wheelHandler as any);
      controls.dispose();
      renderer.dispose();
      scene.environment?.dispose?.();
      pmrem.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, [src]);

  const reset = () => {
    // trigger a resize to re-fit on next effect cycle; simple UX reset
    window.dispatchEvent(new Event('resize'));
  };

  return (
    <div className="relative w-full h-[720px] md:h-[860px] rounded-xl overflow-hidden" style={{ transform: 'none' }}>
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
          {poster ? (
            <img src={poster} alt="Loading" className="max-w-full max-h-full object-cover opacity-70" />
          ) : null}
          <div className="mt-4 text-brand-gold/80 text-sm">Loading… {progress}%</div>
        </div>
      )}
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 pointer-events-auto z-20">
          <button
            onClick={reset}
            className="px-3 py-1.5 rounded-md border border-brand-gold/40 bg-black/60 text-brand-gold/80 hover:text-brand-gold hover:border-brand-gold text-xs tracking-wide"
            aria-label="Reset View"
          >
            Reset View
          </button>
        </div>
        <div className="absolute left-4 bottom-4 text-[11px] text-white/60 select-none">Camera Orbit V2</div>
      </div>
    </div>
  );
}


