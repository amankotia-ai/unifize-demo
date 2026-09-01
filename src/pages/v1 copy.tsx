import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const TOP_BLUE = 0x1840ff;
const MID_BLUE = 0x4060ff;
const BASE_BLUE = 0x6080ff;
const TIER_COLOR = 0x1a1a1a;
const IDP_INITIAL_COLOR = TIER_COLOR;
const COLOR_FADE_FRACTION = 0.35;
const GRID_TARGET_OPACITY = 0.22;
const GRID_FADE_DURATION = 0.5;
const EDGE = 0x000000;

const DEFAULT_ELEVATION = 35.264;
const DEFAULT_AZIMUTH = 45;
const DEFAULT_FRUSTUM = 18;
const INITIAL_AZIMUTH = 30;
const INITIAL_FRUSTUM = 16;
const ENTRANCE_DURATION = 1100;
const CAM_DIST = 35;

interface SlabHandle {
  group: THREE.Group;
  materials: THREE.MeshBasicMaterial[];
  targetColors: THREE.Color[];
}

function createSlab(
  w: number,
  h: number,
  d: number,
  baseColor: number,
  edgeOpacity = 0.45,
  initialColor?: number,
): SlabHandle {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(0, h / 2, 0);

  const c = new THREE.Color(baseColor);
  const sideBright = c.clone().multiplyScalar(0.82).getHex();
  const sideDark = c.clone().multiplyScalar(0.62).getHex();

  const targetHexes = [
    sideBright,
    sideBright,
    baseColor,
    baseColor,
    sideDark,
    sideDark,
  ];
  const startColor = initialColor ?? -1;
  const materials = targetHexes.map(
    (t) =>
      new THREE.MeshBasicMaterial({
        color: startColor >= 0 ? startColor : t,
      }),
  );
  const targetColors = targetHexes.map((t) => new THREE.Color(t));

  const mesh = new THREE.Mesh(geo, materials);

  const edges = new THREE.EdgesGeometry(geo);
  const lines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: EDGE,
      transparent: true,
      opacity: edgeOpacity,
    }),
  );

  const slab = new THREE.Group();
  slab.add(mesh);
  slab.add(lines);
  return { group: slab, materials, targetColors };
}

const W = 3;
const D = 3;
const H = 0.5;
const GAP = 0.04;

const TIER_H = 0.4;
const TIERS = [{ size: 12 }, { size: 10 }, { size: 8 }];
const TIER_BASE_Y = 0;
const IDP_BASE_Y = TIER_BASE_Y + TIERS.length * TIER_H;

interface StackedBlockHandle {
  group: THREE.Group;
  materials: THREE.MeshBasicMaterial[];
  targetColors: THREE.Color[];
}

function createStackedBlock(): StackedBlockHandle {
  const group = new THREE.Group();
  const allMaterials: THREE.MeshBasicMaterial[] = [];
  const allTargets: THREE.Color[] = [];
  const tiers: { color: number; y: number }[] = [
    { color: BASE_BLUE, y: 0 },
    { color: MID_BLUE, y: H + GAP },
    { color: TOP_BLUE, y: (H + GAP) * 2 },
  ];
  for (const { color, y } of tiers) {
    const slab = createSlab(W, H, D, color, 0.45, IDP_INITIAL_COLOR);
    slab.group.position.y = y;
    group.add(slab.group);
    allMaterials.push(...slab.materials);
    allTargets.push(...slab.targetColors);
  }
  return { group, materials: allMaterials, targetColors: allTargets };
}

interface IsoGrid {
  mesh: THREE.LineSegments;
  material: THREE.ShaderMaterial;
}

function createIsoGrid(size: number, divisions: number): IsoGrid {
  const points: number[] = [];
  const half = size / 2;
  const step = size / divisions;
  for (let i = 0; i <= divisions; i++) {
    const t = -half + i * step;
    points.push(-half, 0, t, half, 0, t);
    points.push(t, 0, -half, t, 0, half);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: 0.22 },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 dn = vec2((uv.x - 0.5) / 0.78, uv.y / 0.85);
        float r = length(dn);
        float alpha = 1.0 - smoothstep(0.35, 1.0, r);
        gl_FragColor = vec4(uColor, uOpacity * alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  return { mesh: new THREE.LineSegments(geo, material), material };
}

function easeOutBack(t: number, overshoot = 1.15) {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function createLabelTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dotSize = 78;
  const dotGap = 16;
  const totalSize = dotSize * 2 + dotGap;
  const iconLeft = (canvas.width - totalSize) / 2;
  const iconTop = 90;
  ctx.fillStyle = "#ffffff";

  const drawDot = (x: number, y: number, size: number) => {
    const r = 8;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.arcTo(x + size, y, x + size, y + r, r);
    ctx.lineTo(x + size, y + size - r);
    ctx.arcTo(x + size, y + size, x + size - r, y + size, r);
    ctx.lineTo(x + r, y + size);
    ctx.arcTo(x, y + size, x, y + size - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  };

  drawDot(iconLeft, iconTop, dotSize);
  drawDot(iconLeft + dotSize + dotGap, iconTop, dotSize);
  drawDot(iconLeft, iconTop + dotSize + dotGap, dotSize);
  drawDot(
    iconLeft + dotSize + dotGap,
    iconTop + dotSize + dotGap,
    dotSize,
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 92px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, canvas.width / 2, 380);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

interface LabelHandle {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
}

function createLabelPlane(label: string, size: number): LabelHandle {
  const tex = createLabelTexture(label);
  const geo = new THREE.PlaneGeometry(size, size);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.renderOrder = 1;
  return { mesh, material };
}

type Entry = {
  group: THREE.Group;
  delay: number;
  materials?: THREE.MeshBasicMaterial[];
  targetColors?: THREE.Color[];
  initialColor?: THREE.Color;
  labelMaterial?: THREE.MeshBasicMaterial;
};

export default function Blank() {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const entriesRef = useRef<Entry[]>([]);
  const startTimeRef = useRef(performance.now());

  const [elevation, setElevation] = useState(DEFAULT_ELEVATION);
  const [azimuth, setAzimuth] = useState(INITIAL_AZIMUTH);
  const [frustum, setFrustum] = useState(INITIAL_FRUSTUM);
  const [showGrid, setShowGrid] = useState(true);
  const gridMeshRef = useRef<THREE.LineSegments | null>(null);
  const gridMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const entranceFrameRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();

    let aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      (-DEFAULT_FRUSTUM * aspect) / 2,
      (DEFAULT_FRUSTUM * aspect) / 2,
      DEFAULT_FRUSTUM / 2,
      -DEFAULT_FRUSTUM / 2,
      0.1,
      1000,
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const grid = createIsoGrid(80, 80);
    grid.mesh.position.y = 0;
    grid.material.uniforms.uOpacity.value = 0;
    scene.add(grid.mesh);
    gridMeshRef.current = grid.mesh;
    gridMaterialRef.current = grid.material;

    const updateGridUniforms = () => {
      const dpr = renderer.getPixelRatio();
      grid.material.uniforms.uResolution.value.set(
        width * dpr,
        height * dpr,
      );
    };
    updateGridUniforms();

    const entries: Entry[] = [];

    for (let i = 0; i < TIERS.length; i++) {
      const { size } = TIERS[i];
      const tier = createSlab(size, TIER_H, size, TIER_COLOR, 0.55).group;
      tier.position.set(0, TIER_BASE_Y + i * TIER_H, 0);
      tier.scale.set(1, 0.001, 1);
      scene.add(tier);
      entries.push({ group: tier, delay: i * 0.12 });
    }

    const idpDelay = TIERS.length * 0.12 + 0.05;
    const layout = [
      { x: -1.5, z: -1.5, label: "QMS" },
      { x: 1.5, z: -1.5, label: "DMS" },
      { x: 1.5, z: 1.5, label: "ERP" },
      { x: -1.5, z: 1.5, label: "PLM" },
    ];
    const idpInitialColor = new THREE.Color(IDP_INITIAL_COLOR);
    const LABEL_Y = (H + GAP) * 2 + H + 0.01;
    for (const cell of layout) {
      const handle = createStackedBlock();
      handle.group.position.set(cell.x, IDP_BASE_Y, cell.z);
      handle.group.scale.set(1, 0.001, 1);

      const label = createLabelPlane(cell.label, W * 0.92);
      label.mesh.position.y = LABEL_Y;
      handle.group.add(label.mesh);

      scene.add(handle.group);
      entries.push({
        group: handle.group,
        delay: idpDelay,
        materials: handle.materials,
        targetColors: handle.targetColors,
        initialColor: idpInitialColor,
        labelMaterial: label.material,
      });
    }

    entriesRef.current = entries;
    startTimeRef.current = performance.now();

    const RISE_DURATION = 0.65;

    let frameId = 0;
    const animate = () => {
      const t = (performance.now() - startTimeRef.current) / 1000;

      if (gridMaterialRef.current) {
        const gridT = Math.min(t / GRID_FADE_DURATION, 1);
        const gridEased = 1 - Math.pow(1 - gridT, 3);
        gridMaterialRef.current.uniforms.uOpacity.value =
          GRID_TARGET_OPACITY * gridEased;
      }

      for (const entry of entriesRef.current) {
        const local = Math.max(
          0,
          Math.min((t - entry.delay) / RISE_DURATION, 1),
        );
        const eased = easeOutBack(local);
        entry.group.scale.y = Math.max(0.001, eased);

        if (entry.materials && entry.targetColors && entry.initialColor) {
          const colorProgress = Math.min(local / COLOR_FADE_FRACTION, 1);
          for (let i = 0; i < entry.materials.length; i++) {
            entry.materials[i].color.lerpColors(
              entry.initialColor,
              entry.targetColors[i],
              colorProgress,
            );
          }
          if (entry.labelMaterial) {
            entry.labelMaterial.opacity = colorProgress;
          }
        }
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      aspect = width / height;
      const f = (cameraRef.current && (cameraRef.current.top * 2)) || DEFAULT_FRUSTUM;
      camera.left = (-f * aspect) / 2;
      camera.right = (f * aspect) / 2;
      camera.top = f / 2;
      camera.bottom = -f / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateGridUniforms();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      cameraRef.current = null;
      gridMeshRef.current = null;
      gridMaterialRef.current = null;
      entriesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const e = (elevation * Math.PI) / 180;
    const a = (azimuth * Math.PI) / 180;
    cam.position.set(
      CAM_DIST * Math.cos(e) * Math.sin(a),
      CAM_DIST * Math.sin(e),
      CAM_DIST * Math.cos(e) * Math.cos(a),
    );
    cam.lookAt(0, 1, 0);
  }, [elevation, azimuth]);

  useEffect(() => {
    const cam = cameraRef.current;
    const m = mountRef.current;
    if (!cam || !m) return;
    const aspect = m.clientWidth / m.clientHeight;
    cam.left = (-frustum * aspect) / 2;
    cam.right = (frustum * aspect) / 2;
    cam.top = frustum / 2;
    cam.bottom = -frustum / 2;
    cam.updateProjectionMatrix();
  }, [frustum]);

  useEffect(() => {
    if (gridMeshRef.current) gridMeshRef.current.visible = showGrid;
  }, [showGrid]);

  const startEntranceAnimation = useCallback(() => {
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
    }
    userInteractedRef.current = false;
    setFrustum(INITIAL_FRUSTUM);
    setAzimuth(INITIAL_AZIMUTH);
    const start = performance.now();
    const tick = () => {
      if (userInteractedRef.current) {
        entranceFrameRef.current = null;
        return;
      }
      const t = Math.min(
        (performance.now() - start) / ENTRANCE_DURATION,
        1,
      );
      const eased = 1 - Math.pow(1 - t, 3);
      setFrustum(
        INITIAL_FRUSTUM + (DEFAULT_FRUSTUM - INITIAL_FRUSTUM) * eased,
      );
      setAzimuth(
        INITIAL_AZIMUTH + (DEFAULT_AZIMUTH - INITIAL_AZIMUTH) * eased,
      );
      if (t < 1) {
        entranceFrameRef.current = requestAnimationFrame(tick);
      } else {
        entranceFrameRef.current = null;
      }
    };
    entranceFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startEntranceAnimation();
    return () => {
      if (entranceFrameRef.current !== null) {
        cancelAnimationFrame(entranceFrameRef.current);
        entranceFrameRef.current = null;
      }
    };
  }, [startEntranceAnimation]);

  const cancelEntrance = useCallback(() => {
    userInteractedRef.current = true;
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
      entranceFrameRef.current = null;
    }
  }, []);

  const handleZoomChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setFrustum(v);
    },
    [cancelEntrance],
  );

  const handleAzimuthChange = useCallback(
    (v: number) => {
      cancelEntrance();
      setAzimuth(v);
    },
    [cancelEntrance],
  );

  const replay = useCallback(() => {
    startTimeRef.current = performance.now();
    for (const entry of entriesRef.current) {
      entry.group.scale.y = 0.001;
      if (entry.materials && entry.initialColor) {
        for (const mat of entry.materials) {
          mat.color.copy(entry.initialColor);
        }
      }
      if (entry.labelMaterial) {
        entry.labelMaterial.opacity = 0;
      }
    }
    startEntranceAnimation();
  }, [startEntranceAnimation]);

  const resetCamera = useCallback(() => {
    cancelEntrance();
    setElevation(DEFAULT_ELEVATION);
    setAzimuth(DEFAULT_AZIMUTH);
    setFrustum(DEFAULT_FRUSTUM);
  }, [cancelEntrance]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#171717]">
      <div ref={mountRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute top-4 right-4 z-10 group">
        <button
          type="button"
          className="bg-black/70 backdrop-blur border border-white/15 text-white/90 px-3 py-2 rounded font-mono text-[11px] tracking-wide hover:bg-black/90"
        >
          CONTROLS
        </button>
        <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-72 bg-black/90 backdrop-blur border border-white/15 rounded p-4 font-mono text-[11px] text-white/90">
          <ControlSlider
            label="Elevation"
            unit="°"
            min={5}
            max={75}
            step={0.1}
            value={elevation}
            onChange={setElevation}
          />
          <ControlSlider
            label="Azimuth"
            unit="°"
            min={0}
            max={90}
            step={0.1}
            value={azimuth}
            onChange={handleAzimuthChange}
          />
          <ControlSlider
            label="Zoom"
            unit=""
            min={6}
            max={48}
            step={0.1}
            value={frustum}
            onChange={handleZoomChange}
            invert
          />
          <label className="flex items-center justify-between py-2 cursor-pointer select-none">
            <span>Show grid</span>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="accent-blue-500"
            />
          </label>
          <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
            <button
              type="button"
              onClick={resetCamera}
              className="flex-1 border border-white/15 hover:bg-white/10 py-1.5 px-2 rounded uppercase tracking-wide"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={replay}
              className="flex-1 border border-white/15 hover:bg-white/10 py-1.5 px-2 rounded uppercase tracking-wide"
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlSlider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  invert,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  invert?: boolean;
}) {
  return (
    <div className="py-1.5">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span className="text-white/60">
          {value.toFixed(1)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={invert ? min + max - value : value}
        onChange={(e) =>
          onChange(invert ? min + max - +e.target.value : +e.target.value)
        }
        className="w-full accent-blue-500"
      />
    </div>
  );
}
