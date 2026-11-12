import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { NAVY_PATH, TEAL_PATH } from "./core-paths";

// Core scene
export function initCore(canvas: HTMLCanvasElement, section: HTMLElement, offsetX = 150) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 5000);
  camera.position.set(0, 0, 820);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${NAVY_PATH}"/><path d="${TEAL_PATH}"/></svg>`;
  const data = new SVGLoader().parse(svg);
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0x2a3160,
    metalness: 0.9,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x48ac9f,
    metalness: 0.1,
    roughness: 0.12,
    transmission: 0.75,
    thickness: 18,
    ior: 1.45,
    clearcoat: 1,
    emissive: 0x0f4d47,
    emissiveIntensity: 0.35,
  });

  const group = new THREE.Group();
  const parts = data.paths.map((p, i) => {
    const geo = new THREE.ExtrudeGeometry(p.toShapes(), {
      depth: 34,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 3.2,
      bevelSegments: 6,
      curveSegments: 18,
    });
    const mesh = new THREE.Mesh(geo, i === 0 ? metal : glass);
    mesh.scale.y = -1;
    const holder = new THREE.Group();
    holder.add(mesh);
    group.add(holder);
    return holder;
  });
  const center = new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3());
  parts.forEach((p) => p.position.sub(center));
  const home = parts.map((p) => p.position.clone());

  const root = new THREE.Group();
  root.add(group);
  root.rotation.set(-0.18, -0.42, 0.05);
  scene.add(root);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-300, 400, 500);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5ce1e6, 5);
  rim.position.set(400, -100, -300);
  scene.add(rim);
  const glow = new THREE.PointLight(0x8cd9d3, 40000, 1200);
  glow.position.set(200, 150, 200);
  scene.add(glow);
  scene.add(new THREE.AmbientLight(0x404a7a, 0.6));

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX / innerWidth - 0.5;
    pointer.y = e.clientY / innerHeight - 0.5;
  };
  addEventListener("pointermove", onMove);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    root.position.x = w < 768 ? 0 : offsetX;
  };
  addEventListener("resize", resize);
  resize();

  const t0 = performance.now();
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);

  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = (now - t0) / 1000;
    const lock = Math.min(1, t / 0.9);
    const e = 1 - Math.pow(1 - lock, 3);
    const r = section.getBoundingClientRect();
    const split = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    smooth.x += (pointer.x - smooth.x) * 0.06;
    smooth.y += (pointer.y - smooth.y) * 0.06;
    const a = t * 0.9;
    root.rotation.set(
      -0.18 + Math.sin(a) * 0.05 + smooth.y * 0.2,
      -0.42 + Math.sin(a * 0.8) * 0.12 + smooth.x * 0.35,
      0.05,
    );
    root.position.y = Math.sin(a) * 8;
    parts[0].position.set(home[0].x - 34 * split - (1 - e) * 420, home[0].y, home[0].z - 20 * split);
    parts[1].position.set(home[1].x + 34 * split + (1 - e) * 420, home[1].y, home[1].z + 24 * split);
    rim.intensity = 5 + Math.sin(t * 1.4) * 1.5;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener("pointermove", onMove);
    removeEventListener("resize", resize);
    renderer.dispose();
    pmrem.dispose();
  };
}
