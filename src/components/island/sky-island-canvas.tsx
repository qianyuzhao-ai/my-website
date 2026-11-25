"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { skyAudio } from "@/lib/sky-audio";
import {
  ISLAND_SHRINES,
  ISLAND_TIERS,
  LAUNCH_PADS,
  PUZZLE_SOCKET,
  type ShrineId,
  sampleIslandGround,
  WATERFALL_PATH,
} from "@/lib/sky-island-config";

export type IslandEngineHandle = {
  setJoystick: (x: number, y: number) => void;
  jump: () => void;
  teleportToShrine: (id: ShrineId) => void;
  launchGlider: () => void;
};

type Props = {
  isNight: boolean;
  paused: boolean;
  entered: boolean;
  vistaMode: boolean;
  engineRef: React.MutableRefObject<IslandEngineHandle | null>;
  markerRefs: React.MutableRefObject<
    Record<ShrineId, HTMLButtonElement | null>
  >;
  onReady: () => void;
  onNearShrineChange: (shrineId: ShrineId | null) => void;
  onActivateShrine: (shrineId: ShrineId) => void;
  onEventToast: (message: string) => void;
};

type PhysicsToy = {
  mesh: THREE.Mesh;
  isPuzzleCube: boolean;
  locked: boolean;
  homeX: number;
  homeZ: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  falling: boolean;
};

type ParticleBurst = {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  vz: number;
};

function createToonGradient(): THREE.DataTexture {
  const data = new Uint8Array([
    74, 78, 92, 255, 142, 146, 156, 255, 214, 212, 204, 255, 255, 252, 244, 255,
  ]);
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

/** 为 MeshToonMaterial 注入《旷野之息》柔和逆光边缘高光（Rim Light） */
function makeZeldaRimToon(
  gradientMap: THREE.DataTexture,
  color: string,
  rimColor = "#fff3d1",
  rimStrength = 0.28,
  emissive = "#000000",
  emissiveIntensity = 0,
): THREE.MeshToonMaterial {
  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap,
    emissive,
    emissiveIntensity,
  });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: new THREE.Color(rimColor) };
    shader.uniforms.uRimStrength = { value: rimStrength };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
       uniform vec3 uRimColor;
       uniform float uRimStrength;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `float rimDot = 1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0);
       float rim = smoothstep(0.62, 0.96, rimDot) * uRimStrength;
       gl_FragColor.rgb += uRimColor * rim;
       #include <dithering_fragment>`,
    );
  };
  return mat;
}

export function SkyIslandCanvas({
  isNight,
  paused,
  entered,
  vistaMode,
  engineRef,
  markerRefs,
  onReady,
  onNearShrineChange,
  onActivateShrine,
  onEventToast,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    isNight,
    paused,
    entered,
    vistaMode,
    onNearShrineChange,
    onActivateShrine,
    onEventToast,
  });
  stateRef.current = {
    isNight,
    paused,
    entered,
    vistaMode,
    onNearShrineChange,
    onActivateShrine,
    onEventToast,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // ---------------- 1. Renderer, Scene & Camera ----------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const skyDay = new THREE.Color("#b4dbf5");
    const skyNight = new THREE.Color("#080c17");
    scene.background = stateRef.current.isNight
      ? skyNight.clone()
      : skyDay.clone();
    scene.fog = new THREE.FogExp2(
      stateRef.current.isNight ? "#080c17" : "#c6e3f7",
      0.0095,
    );

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.5,
      200,
    );
    camera.position.set(0, 14, 21);

    const gradientMap = createToonGradient();
    const matMap: Record<string, THREE.Material> = {
      Zelda_Cliff: makeZeldaRimToon(gradientMap, "#6e685e", "#dce9ff", 0.22),
      Zelda_CliffDark: makeZeldaRimToon(
        gradientMap,
        "#4b4740",
        "#9bb5d6",
        0.16,
      ),
      Zelda_TurfGold: makeZeldaRimToon(gradientMap, "#baa840", "#fff3bd", 0.2),
      Zelda_TurfHighland: makeZeldaRimToon(
        gradientMap,
        "#61964a",
        "#dffac8",
        0.2,
      ),
      Zelda_TurfSecret: makeZeldaRimToon(
        gradientMap,
        "#78a652",
        "#eaffd4",
        0.24,
      ),
      Zelda_Stone: makeZeldaRimToon(gradientMap, "#d4cdbd", "#fff7e2", 0.26),
      Zelda_StoneOld: makeZeldaRimToon(gradientMap, "#9c9688", "#e8e3d5", 0.22),
      Zelda_Wood: makeZeldaRimToon(gradientMap, "#8a5834", "#ffdca8", 0.18),
      Zelda_Trunk: makeZeldaRimToon(gradientMap, "#69452b", "#ffdfb3", 0.2),
      Zelda_GinkgoGold: makeZeldaRimToon(
        gradientMap,
        "#f0b529",
        "#fff39e",
        0.38,
      ),
      Zelda_GinkgoAmber: makeZeldaRimToon(
        gradientMap,
        "#e38824",
        "#ffe394",
        0.34,
      ),
      Zelda_ZonaiRune: makeZeldaRimToon(
        gradientMap,
        "#29db98",
        "#9effdc",
        0.4,
        "#34f5a6",
        1.1,
      ),
      Zelda_ZonaiGold: makeZeldaRimToon(
        gradientMap,
        "#ebc054",
        "#fff5c0",
        0.35,
        "#e6b64c",
        0.25,
      ),
      Zelda_Iron: makeZeldaRimToon(gradientMap, "#2c2f36", "#9fb4d4", 0.25),
      Zelda_Vermilion: makeZeldaRimToon(
        gradientMap,
        "#d94321",
        "#ffb59e",
        0.3,
        "#ff5c2b",
        0.14,
      ),
    };

    // ---------------- 2. World-Space Zelda Water & Waterfall Shader ----------------
    // 直接作用于 Blender 雕刻的「泉眼 · 清泉池 / 山巅 · 泉水溪流 / 东崖 · 瀑布水帘」网格
    const waterUniforms = {
      uTime: { value: 0 },
      uNightMix: { value: stateRef.current.isNight ? 1 : 0 },
    };

    const waterfallMat = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uNightMix;
        varying vec3 vWorldPos;
        varying vec3 vWorldNormal;

        void main() {
          float isTop = smoothstep(0.45, 0.75, abs(vWorldNormal.y));

          // 水平水面（清泉池 + 弯曲溪流）：沿流向流动的亮色卡通涟漪
          float streamCoord = vWorldPos.x * 1.1 + vWorldPos.z * 0.55 - uTime * 1.85;
          float ripple1 = sin(streamCoord * 3.8 + cos(vWorldPos.z * 2.6)) * 0.5 + 0.5;
          float ripple2 = cos((vWorldPos.x * 2.1 - vWorldPos.z * 2.4) - uTime * 1.3) * 0.5 + 0.5;
          float topFoam = step(0.73, ripple1 * 0.62 + ripple2 * 0.45);

          // 垂直瀑布水帘：自上而下高速倾泻的白色水纹与崖底白沫
          float fallScroll = vWorldPos.y * 1.65 + uTime * 5.2;
          float fallStripe1 = sin((vWorldPos.x + vWorldPos.z) * 5.2 + sin(fallScroll) * 0.9) * 0.5 + 0.5;
          float fallStripe2 = cos(fallScroll * 2.1 + vWorldPos.z * 4.0) * 0.5 + 0.5;
          float baseMist = smoothstep(-2.6, -4.85, vWorldPos.y);
          float crestFoam = smoothstep(2.45, 2.90, vWorldPos.y);
          float fallFoam = clamp(step(0.65, fallStripe1 * 0.65 + fallStripe2 * 0.45) * 0.72 + baseMist * 0.9 + crestFoam * 0.85, 0.0, 1.0);

          float foamMask = mix(fallFoam, topFoam * 0.72, isTop);

          vec3 waterDay = mix(vec3(0.28, 0.74, 0.91), vec3(0.22, 0.68, 0.82), isTop);
          vec3 waterNight = mix(vec3(0.12, 0.42, 0.66), vec3(0.10, 0.36, 0.54), isTop);
          vec3 baseCol = mix(waterDay, waterNight, uNightMix);
          vec3 foamCol = mix(vec3(0.96, 0.99, 1.0), vec3(0.68, 0.96, 0.98), uNightMix);

          gl_FragColor = vec4(mix(baseCol, foamCol, foamMask), 0.90);
        }
      `,
    });

    // ---------------- 3. Lights (覆盖扩大后的南北群岛范围) ----------------
    const hemiLight = new THREE.HemisphereLight("#eaf5ff", "#6e6046", 0.95);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight("#fff0cc", 2.15);
    sunLight.position.set(14, 28, 12);
    sunLight.target.position.set(0, 0, -5);
    scene.add(sunLight.target);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 72;
    const sd = 26;
    sunLight.shadow.camera.left = -sd;
    sunLight.shadow.camera.right = sd;
    sunLight.shadow.camera.top = sd;
    sunLight.shadow.camera.bottom = -sd;
    sunLight.shadow.bias = -0.0007;
    scene.add(sunLight);

    const potFireLight = new THREE.PointLight("#ff862e", 2.4, 8, 1.6);
    potFireLight.position.set(-1.9, 0.55, 1.9);
    scene.add(potFireLight);

    const secretFireLight = new THREE.PointLight("#ff9438", 2.2, 8, 1.6);
    secretFireLight.position.set(-12.6, 2.75, 5.4);
    scene.add(secretFireLight);

    // ---------------- 4. Load Updated Sculpted Blender GLB ----------------
    const walkableMeshes: THREE.Object3D[] = [];
    for (const tier of ISLAND_TIERS) {
      const hitDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(tier.radius, tier.radius, 0.1, 20),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      hitDisc.position.set(tier.x, tier.y - 0.05, tier.z);
      scene.add(hitDisc);
      walkableMeshes.push(hitDisc);
    }

    const loader = new GLTFLoader();
    loader.load(
      "/model/sky-island-v2.glb",
      (gltf) => {
        if (disposed) return;
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const meshName = child.name ?? "";
            const origMat = Array.isArray(child.material)
              ? child.material[0]
              : child.material;
            const origName = (origMat?.name as string | undefined) ?? "";

            // 识别 Blender 雕刻的清泉、溪流与东崖瀑布并套用动态卡通水体着色器
            if (
              meshName.includes("清泉池") ||
              meshName.includes("泉水溪流") ||
              meshName.includes("瀑布水帘") ||
              origName.startsWith("山涧")
            ) {
              child.material = waterfallMat;
              child.castShadow = false;
              child.receiveShadow = false;
              return;
            }

            if (origName && matMap[origName]) {
              child.material = matMap[origName];
            }
            const isTurf =
              origName.includes("Turf") || meshName.includes("草地");
            child.castShadow = !isTurf;
            child.receiveShadow = true;

            if (
              isTurf ||
              meshName.includes("踏板") ||
              meshName.includes("桥板") ||
              meshName.includes("外台") ||
              meshName.includes("石台")
            ) {
              walkableMeshes.push(child);
            }
          }
        });
        scene.add(gltf.scene);
        onReady();
      },
      undefined,
      () => {
        if (!disposed) onReady();
      },
    );

    // ---------------- 5. Dynamic Landmarks Synced to Updated .blend Coords ----------------
    // 5.1 高岛山巅：造物星盘悬浮核心与双轨环 (9.35, 4.59, -13.64)
    const forgeCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.55, 0),
      matMap.Zelda_ZonaiRune,
    );
    forgeCore.position.set(9.35, 4.6, -13.64);
    scene.add(forgeCore);

    const forgeRingA = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.065, 8, 28),
      matMap.Zelda_ZonaiGold,
    );
    forgeRingA.position.copy(forgeCore.position);
    scene.add(forgeRingA);

    const forgeRingB = new THREE.Mesh(
      new THREE.TorusGeometry(0.82, 0.05, 8, 24),
      matMap.Zelda_Stone,
    );
    forgeRingB.position.copy(forgeCore.position);
    scene.add(forgeRingB);

    // 5.2 中岛北崖：时之日晷悬浮金环 (-3.46, 2.69, -15.32)
    const sundialHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.055, 8, 24),
      matMap.Zelda_ZonaiGold,
    );
    sundialHalo.position.set(-3.46, 2.69, -15.32);
    scene.add(sundialHalo);

    // 5.3 低岛南崖：风车布帆（与 .blend 中 风车 · 风轮转轴 (0.10, 2.49, 8.67) 对齐）
    const windmillSails = new THREE.Group();
    windmillSails.position.set(0.1, 2.49, 8.67);
    const sailMat = makeZeldaRimToon(gradientMap, "#f6f0e2", "#ffffff", 0.3);
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 1.48, 0.05),
        sailMat,
      );
      blade.position.y = 0.85;
      arm.add(blade);
      windmillSails.add(arm);
    }
    scene.add(windmillSails);

    // 5.4 两处篝火火苗
    const matFlame = makeZeldaRimToon(
      gradientMap,
      "#ff7b29",
      "#ffd27d",
      0.4,
      "#ff6a1a",
      1.7,
    );
    const potFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.42, 6),
      matFlame,
    );
    potFlame.position.set(-1.9, 0.18, 1.9);
    scene.add(potFlame);

    const secretFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.54, 6),
      matFlame,
    );
    secretFlame.position.set(-12.59, 2.52, 5.41);
    scene.add(secretFlame);

    // 5.5 东崖瀑布底部翻涌水雾团 (14.18, -4.68, -9.08)
    const mistPuffs: { mesh: THREE.Mesh; baseScale: number; phase: number }[] =
      [];
    const mistMat = new THREE.MeshBasicMaterial({
      color: "#f2fbff",
      transparent: true,
      opacity: 0.74,
    });
    const [mx, my, mz] = WATERFALL_PATH.mistCenter;
    for (let i = 0; i < 6; i++) {
      const mp = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.58 + (i % 2) * 0.25, 1),
        mistMat,
      );
      const a = (i / 6) * Math.PI * 2;
      mp.position.set(
        mx + Math.cos(a) * 0.78,
        my + (i % 2) * 0.24,
        mz + Math.sin(a) * 0.78,
      );
      scene.add(mp);
      mistPuffs.push({
        mesh: mp,
        baseScale: 0.86 + (i % 3) * 0.2,
        phase: i * 1.1,
      });
    }

    // ---------------- 6. Glowing Blupee Spirit Rabbit (同步至新银杏林与三岛巡逻点) ----------------
    const blupeeGroup = new THREE.Group();
    const matBlupee = new THREE.MeshBasicMaterial({
      color: "#8ff6ff",
      transparent: true,
      opacity: 0.9,
    });
    const bBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 10, 8),
      matBlupee,
    );
    bBody.scale.set(0.9, 0.85, 1.25);
    bBody.position.y = 0.2;
    const bHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 8),
      matBlupee,
    );
    bHead.position.set(0, 0.34, 0.18);
    const bEarL = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.26, 6),
      matBlupee,
    );
    bEarL.position.set(-0.06, 0.54, 0.14);
    bEarL.rotation.x = -0.25;
    const bEarR = bEarL.clone();
    bEarR.position.x = 0.06;
    const bTail = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 6, 6),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    bTail.position.set(0, 0.22, -0.24);
    const blupeeLight = new THREE.PointLight("#6beeff", 1.4, 4.2);
    blupeeLight.position.set(0, 0.4, 0);
    blupeeGroup.add(bBody, bHead, bEarL, bEarR, bTail, blupeeLight);

    const blupeeSpots: [number, number, number][] = [
      [-5.14, 1.35, -10.9],
      [-8.2, 1.35, -10.2],
      [2.2, 0.0, 4.4],
      [7.1, 2.85, -10.6],
      [-3.3, 0.0, 4.8],
    ];
    const blupee = {
      spotIdx: 0,
      x: blupeeSpots[0][0],
      y: blupeeSpots[0][1],
      z: blupeeSpots[0][2],
      fleeing: false,
    };
    blupeeGroup.position.set(blupee.x, blupee.y, blupee.z);
    scene.add(blupeeGroup);

    // ---------------- 7. Zonai Cube Socket Puzzle & Physics Orbs ----------------
    const toys: PhysicsToy[] = [];
    const toySpecs: [number, number, boolean][] = [
      [2.65, 2.56, true],
      [-0.78, 4.68, false],
      [-3.95, -0.87, false],
    ];
    for (const [tx, tz, isCube] of toySpecs) {
      const gy = sampleIslandGround(tx, tz) ?? 0;
      const r = 0.27;
      const mesh = new THREE.Mesh(
        isCube
          ? new THREE.BoxGeometry(0.5, 0.5, 0.5)
          : new THREE.IcosahedronGeometry(r, 1),
        isCube ? matMap.Zelda_ZonaiRune : matMap.Zelda_ZonaiGold,
      );
      mesh.castShadow = true;
      mesh.position.set(tx, gy + r, tz);
      scene.add(mesh);
      toys.push({
        mesh,
        isPuzzleCube: isCube,
        locked: false,
        homeX: tx,
        homeZ: tz,
        x: tx,
        y: gy + r,
        z: tz,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: r,
        falling: false,
      });
    }

    const puzzleBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.34, 18, 16, 1, true),
      new THREE.MeshBasicMaterial({
        color: "#34f5a6",
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      }),
    );
    puzzleBeam.position.set(
      PUZZLE_SOCKET.pillarPosition[0],
      10.2,
      PUZZLE_SOCKET.pillarPosition[2],
    );
    scene.add(puzzleBeam);
    let puzzleSolved = false;

    // ---------------- 8. Zonai Wing Glider at South Pier (-1.45, 0.19, 7.21) ----------------
    const gliderGroup = new THREE.Group();
    const wingBody = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 0.12, 3),
      matMap.Zelda_Stone,
    );
    wingBody.scale.set(1.35, 1, 0.75);
    const wingRune = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 0.14, 3),
      matMap.Zelda_ZonaiRune,
    );
    wingRune.scale.set(1.2, 1, 0.65);
    gliderGroup.add(wingBody, wingRune);
    const gliderHome = new THREE.Vector3(-1.45, 0.19, 7.21);
    gliderGroup.position.copy(gliderHome);
    scene.add(gliderGroup);
    const gliderState = { active: false, t: 0 };

    // ---------------- 9. Launch Pad Vortex Rings & Shrine Rings ----------------
    const launchVortexMeshes: THREE.Mesh[] = [];
    for (const pad of [LAUNCH_PADS.toSecret, LAUNCH_PADS.toMain]) {
      const vortex = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 0.92, 24),
        new THREE.MeshBasicMaterial({
          color: "#34f5a6",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.78,
        }),
      );
      vortex.rotation.x = -Math.PI / 2;
      vortex.position.set(
        pad.position[0],
        pad.position[1] + 0.12,
        pad.position[2],
      );
      scene.add(vortex);
      launchVortexMeshes.push(vortex);
    }

    const shrineRings: Record<ShrineId, THREE.Mesh> = {} as Record<
      ShrineId,
      THREE.Mesh
    >;
    for (const sh of ISLAND_SHRINES) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.88, 1.12, 28),
        new THREE.MeshBasicMaterial({
          color: sh.id === "about" ? "#ffd15c" : "#34f5a6",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(sh.position[0], sh.position[1] + 0.05, sh.position[2]);
      scene.add(ring);
      shrineRings[sh.id] = ring;
    }

    // ---------------- 10. GPU Wind-Swaying Grass (自动对齐四座新岛坐标并避让水系) ----------------
    const grassCount = 2800;
    const bladeGeo = new THREE.ConeGeometry(0.065, 0.46, 3);
    bladeGeo.translate(0, 0.23, 0);

    const grassUniforms = {
      uTime: { value: 0 },
      uPlayerPos: { value: new THREE.Vector3(0, 0, 2.8) },
      uNightMix: { value: stateRef.current.isNight ? 1 : 0 },
    };

    const grassMat = new THREE.ShaderMaterial({
      uniforms: grassUniforms,
      vertexShader: `
        uniform float uTime;
        uniform vec3 uPlayerPos;
        varying float vTip;
        varying float vSeed;

        void main() {
          vec4 worldBase = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float h = clamp(position.y / 0.46, 0.0, 1.0);
          vTip = h;
          vSeed = fract(sin(dot(worldBase.xz, vec2(12.9898, 78.233))) * 43758.5453);

          vec3 pos = position;
          float wind = sin(worldBase.x * 0.45 + uTime * 2.2) * cos(worldBase.z * 0.42 + uTime * 1.6);
          pos.x += wind * 0.16 * h * h;
          pos.z += cos(worldBase.x * 0.35 + uTime * 1.9) * 0.09 * h * h;

          vec2 toBlade = worldBase.xz - uPlayerPos.xz;
          float dist = length(toBlade);
          if (dist < 1.35 && dist > 0.001 && abs(worldBase.y - uPlayerPos.y) < 1.2) {
            float push = (1.0 - dist / 1.35) * 0.44 * h;
            vec2 dir = normalize(toBlade);
            pos.x += dir.x * push;
            pos.z += dir.y * push;
            pos.y -= push * 0.35;
          }

          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uNightMix;
        varying float vTip;
        varying float vSeed;

        void main() {
          vec3 dayBase = mix(vec3(0.28, 0.49, 0.22), vec3(0.56, 0.51, 0.17), vSeed);
          vec3 dayTip  = mix(vec3(0.60, 0.80, 0.34), vec3(0.92, 0.80, 0.28), vSeed);
          vec3 nightBase = vec3(0.07, 0.18, 0.14);
          vec3 nightTip  = mix(vec3(0.16, 0.44, 0.32), vec3(0.24, 0.64, 0.48), vSeed);

          vec3 colDay = mix(dayBase, dayTip, vTip);
          vec3 colNight = mix(nightBase, nightTip, vTip);
          gl_FragColor = vec4(mix(colDay, colNight, uNightMix), 1.0);
        }
      `,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, grassCount);
    const dummy = new THREE.Object3D();
    const [pondX, , pondZ] = WATERFALL_PATH.pondCenter;
    const [streamX, , streamZ] = WATERFALL_PATH.streamCenter;
    let placed = 0;
    let attempts = 0;
    while (placed < grassCount && attempts < grassCount * 6) {
      attempts++;
      const tier = ISLAND_TIERS[placed % ISLAND_TIERS.length];
      const r = Math.sqrt(Math.random()) * (tier.radius - 0.65);
      const theta = Math.random() * Math.PI * 2;
      const gx = tier.x + Math.cos(theta) * r;
      const gz = tier.z + Math.sin(theta) * r;

      if (Math.hypot(gx, gz - 2.5) < 2.05) continue;
      if (Math.hypot(gx - pondX, gz - pondZ) < 1.65) continue;
      if (Math.hypot(gx - streamX, gz - streamZ) < 1.75) continue;

      let blocked = false;
      for (const sh of ISLAND_SHRINES) {
        if (Math.hypot(gx - sh.position[0], gz - sh.position[2]) < 1.35) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      dummy.position.set(gx, tier.y, gz);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.72 + Math.random() * 0.68;
      dummy.scale.set(s, s * (0.8 + Math.random() * 0.55), s);
      dummy.updateMatrix();
      grassMesh.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    grassMesh.count = placed;
    grassMesh.instanceMatrix.needsUpdate = true;
    scene.add(grassMesh);

    // ---------------- 11. Cloud Sea & Falling Ginkgo Leaves / Fireflies ----------------
    const clouds: { group: THREE.Group; speed: number }[] = [];
    const matCloud = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.78,
    });
    for (let i = 0; i < 18; i++) {
      const cg = new THREE.Group();
      cg.position.set(
        -34 + i * 4.1,
        -5.4 - (i % 3) * 1.4,
        -24 + ((i * 8.3) % 40),
      );
      for (let j = 0; j < 3; j++) {
        const puff = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.5 + (j % 2) * 0.65, 1),
          matCloud,
        );
        puff.position.set((j - 1) * 1.35, (j % 2) * 0.25, 0);
        puff.scale.set(1.55, 0.44, 1.12);
        cg.add(puff);
      }
      scene.add(cg);
      clouds.push({ group: cg, speed: 0.32 + (i % 4) * 0.11 });
    }

    const leafGeo = new THREE.PlaneGeometry(0.15, 0.15);
    const leafMat = new THREE.MeshBasicMaterial({
      color: "#ffd454",
      side: THREE.DoubleSide,
    });
    const leaves: {
      mesh: THREE.Mesh;
      ox: number;
      oy: number;
      oz: number;
      phase: number;
    }[] = [];
    for (let i = 0; i < 36; i++) {
      const lm = new THREE.Mesh(leafGeo, leafMat);
      const ox = -15 + (i % 9) * 3.8;
      const oy = 1.6 + (i % 5) * 1.1;
      const oz = -16 + Math.floor(i / 9) * 6.8;
      lm.position.set(ox, oy, oz);
      scene.add(lm);
      leaves.push({ mesh: lm, ox, oy, oz, phase: i * 0.79 });
    }

    // ---------------- 12. Champion-Blue Cloaked Traveler + Waist Lantern ----------------
    const traveler = new THREE.Group();
    const bodyPivot = new THREE.Group();
    traveler.add(bodyPivot);

    const matChampionBlue = makeZeldaRimToon(
      gradientMap,
      "#2478b5",
      "#9ce6ff",
      0.38,
    );
    const matLinen = makeZeldaRimToon(gradientMap, "#f2ece0", "#ffffff", 0.3);

    const tunic = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.29, 0.68, 10),
      makeZeldaRimToon(gradientMap, "#2b3b47", "#9fd8ff", 0.22),
    );
    tunic.position.y = 0.48;
    tunic.castShadow = true;
    bodyPivot.add(tunic);

    const capePivot = new THREE.Group();
    capePivot.position.set(0, 0.79, 0);
    const cape = new THREE.Mesh(
      new THREE.ConeGeometry(0.41, 0.76, 12, 1, true),
      matChampionBlue,
    );
    cape.position.y = -0.34;
    cape.castShadow = true;
    capePivot.add(cape);

    const scarfRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.21, 0.055, 8, 16),
      matLinen,
    );
    scarfRing.rotation.x = Math.PI / 2;
    scarfRing.position.y = 0.03;
    capePivot.add(scarfRing);

    const scarfTail = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.05, 0.56),
      matLinen,
    );
    scarfTail.position.set(0.05, -0.04, -0.28);
    capePivot.add(scarfTail);
    bodyPivot.add(capePivot);

    const waistLantern = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.045, 0.13, 8),
      makeZeldaRimToon(gradientMap, "#ffc152", "#fff2b8", 0.3, "#ffa834", 2.2),
    );
    waistLantern.position.set(0.24, 0.44, 0.06);
    bodyPivot.add(waistLantern);

    const travelerLanternLight = new THREE.PointLight("#ffad42", 0.3, 6.8, 1.5);
    travelerLanternLight.position.set(0.28, 0.55, 0.12);
    bodyPivot.add(travelerLanternLight);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 12, 10),
      makeZeldaRimToon(gradientMap, "#191c24", "#70b8ff", 0.15),
    );
    head.position.y = 0.95;
    bodyPivot.add(head);

    const eyeMat = new THREE.MeshBasicMaterial({ color: "#ffe9a6" });
    for (const ex of [-0.07, 0.07]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 6), eyeMat);
      eye.position.set(ex, 0.95, 0.185);
      bodyPivot.add(eye);
    }

    const hood = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.48, 10),
      matLinen,
    );
    hood.position.set(0, 1.18, -0.03);
    hood.rotation.x = -0.18;
    hood.castShadow = true;
    bodyPivot.add(hood);

    const footMat = makeZeldaRimToon(gradientMap, "#4a3525", "#ffd8a8", 0.15);
    const footL = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.12, 0.22),
      footMat,
    );
    const footR = footL.clone();
    footL.position.set(-0.11, 0.07, 0);
    footR.position.set(0.11, 0.07, 0);
    traveler.add(footL, footR);

    const blobShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 16),
      new THREE.MeshBasicMaterial({
        color: "#000000",
        transparent: true,
        opacity: 0.28,
      }),
    );
    blobShadow.rotation.x = -Math.PI / 2;
    scene.add(blobShadow);

    const player = {
      x: 0,
      y: reducedMotion ? 0 : 6.0,
      z: 2.8,
      vy: 0,
      angle: 0,
      walkPhase: 0,
      grounded: reducedMotion,
      targetPoint: null as { x: number; z: number } | null,
      flight: null as {
        t: number;
        duration: number;
        sx: number;
        sy: number;
        sz: number;
        tx: number;
        ty: number;
        tz: number;
      } | null,
      launchCooldown: 0,
    };
    traveler.position.set(player.x, player.y, player.z);
    scene.add(traveler);

    const wispGroup = new THREE.Group();
    const wispCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.13, 0),
      new THREE.MeshBasicMaterial({ color: "#5effc3" }),
    );
    const wispHalo = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.23, 16),
      new THREE.MeshBasicMaterial({
        color: "#ffd970",
        side: THREE.DoubleSide,
      }),
    );
    wispGroup.add(wispCore, wispHalo);
    scene.add(wispGroup);

    const navMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.28, 0.38, 24),
      new THREE.MeshBasicMaterial({
        color: "#34f5a6",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      }),
    );
    navMarker.rotation.x = -Math.PI / 2;
    scene.add(navMarker);

    const particles: ParticleBurst[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.09, 6, 6);
    function spawnParticles(
      x: number,
      y: number,
      z: number,
      color: string,
      count = 2,
      speed = 1.2,
    ) {
      if (reducedMotion || particles.length > 36) return;
      for (let i = 0; i < count; i++) {
        const m = new THREE.Mesh(
          sphereGeo,
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.78,
          }),
        );
        m.position.set(x, y + 0.1, z);
        scene.add(m);
        particles.push({
          mesh: m,
          life: 0,
          maxLife: 0.55,
          vx: (Math.random() - 0.5) * speed,
          vy: (0.5 + Math.random() * 0.9) * speed,
          vz: (Math.random() - 0.5) * speed,
        });
      }
    }

    // ---------------- 13. Controls & Engine Handle ----------------
    const keys = new Set<string>();
    const joystick = { x: 0, y: 0 };
    let activeNearShrine: ShrineId | null = null;

    function triggerJump() {
      if (player.grounded && !player.flight) {
        player.vy = 5.8;
        player.grounded = false;
        skyAudio.playJump();
        spawnParticles(player.x, player.y, player.z, "#f2ead8", 3, 1.1);
      }
    }

    function triggerGlider() {
      if (!gliderState.active) {
        gliderState.active = true;
        gliderState.t = 0;
        skyAudio.playGliderLaunch();
      }
    }

    engineRef.current = {
      setJoystick(jx, jy) {
        joystick.x = jx;
        joystick.y = jy;
        if (Math.hypot(jx, jy) > 0.1) player.targetPoint = null;
      },
      jump: triggerJump,
      launchGlider: triggerGlider,
      teleportToShrine(id) {
        const sh = ISLAND_SHRINES.find((item) => item.id === id);
        if (!sh) return;
        const offsetZ = id === "connect" ? -1.1 : id === "works" ? 1.95 : 1.35;
        const destX = sh.position[0];
        const destZ = sh.position[2] + offsetZ;
        const gy = sampleIslandGround(destX, destZ) ?? sh.position[1];
        player.flight = null;
        player.x = destX;
        player.z = destZ;
        player.y = gy + (reducedMotion ? 0 : 1.0);
        player.vy = 0;
        player.targetPoint = null;
        spawnParticles(destX, gy, destZ, "#34f5a6", 5, 1.4);
      },
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.paused) return;
      const code = e.code;
      if (
        code === "KeyW" ||
        code === "KeyA" ||
        code === "KeyS" ||
        code === "KeyD" ||
        code === "ArrowUp" ||
        code === "ArrowDown" ||
        code === "ArrowLeft" ||
        code === "ArrowRight"
      ) {
        keys.add(code);
        player.targetPoint = null;
      } else if (code === "KeyE" || code === "Enter") {
        if (activeNearShrine) {
          e.preventDefault();
          stateRef.current.onActivateShrine(activeNearShrine);
        }
      } else if (code === "Space") {
        e.preventDefault();
        if (activeNearShrine) {
          stateRef.current.onActivateShrine(activeNearShrine);
        } else {
          triggerJump();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (stateRef.current.paused || player.flight) return;
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 8) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(walkableMeshes, false);
      if (hits.length > 0) {
        const pt = hits[0].point;
        const gy = sampleIslandGround(pt.x, pt.z);
        if (gy !== null) {
          player.targetPoint = { x: pt.x, z: pt.z };
          navMarker.position.set(pt.x, gy + 0.08, pt.z);
          (navMarker.material as THREE.MeshBasicMaterial).opacity = 0.88;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.fov = w < 640 ? 50 : 42;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    window.addEventListener("resize", onResize);

    // ---------------- 14. Main Render Loop ----------------
    let rafId = 0;
    let prevTime = performance.now();
    let dustTimer = 0;
    let steamTimer = 0;
    let nightLerp = stateRef.current.isNight ? 1 : 0;
    const projVec = new THREE.Vector3();
    const camTarget = new THREE.Vector3(0, 0.8, 2.8);
    const desiredCamPos = new THREE.Vector3();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      if (document.hidden || stateRef.current.paused) return;

      const elapsed = now * 0.001;
      grassUniforms.uTime.value = reducedMotion ? 0 : elapsed;
      waterUniforms.uTime.value = reducedMotion ? 0 : elapsed;

      const targetNight = stateRef.current.isNight ? 1 : 0;
      nightLerp += (targetNight - nightLerp) * Math.min(1, dt * 3.5);
      grassUniforms.uNightMix.value = nightLerp;
      waterUniforms.uNightMix.value = nightLerp;

      scene.background = skyDay.clone().lerp(skyNight, nightLerp);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(skyDay).lerp(skyNight, nightLerp);
      }
      sunLight.intensity = THREE.MathUtils.lerp(2.15, 0.5, nightLerp);
      sunLight.color.set("#fff0cc").lerp(new THREE.Color("#688bff"), nightLerp);
      hemiLight.intensity = THREE.MathUtils.lerp(0.95, 0.34, nightLerp);
      potFireLight.intensity =
        THREE.MathUtils.lerp(1.4, 3.6, nightLerp) +
        Math.sin(elapsed * 10) * 0.25;
      secretFireLight.intensity =
        THREE.MathUtils.lerp(1.2, 3.4, nightLerp) +
        Math.cos(elapsed * 9) * 0.22;
      travelerLanternLight.intensity = THREE.MathUtils.lerp(
        0.2,
        2.85,
        nightLerp,
      );
      matCloud.color
        .set("#ffffff")
        .lerp(new THREE.Color("#1b2438"), nightLerp * 0.85);

      if (player.launchCooldown > 0) {
        player.launchCooldown = Math.max(0, player.launchCooldown - dt);
      }

      let inputLen = 0;
      if (player.flight) {
        player.flight.t += dt;
        const p = Math.min(1, player.flight.t / player.flight.duration);
        const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
        player.x = THREE.MathUtils.lerp(
          player.flight.sx,
          player.flight.tx,
          ease,
        );
        player.z = THREE.MathUtils.lerp(
          player.flight.sz,
          player.flight.tz,
          ease,
        );
        const baseH = THREE.MathUtils.lerp(
          player.flight.sy,
          player.flight.ty,
          ease,
        );
        player.y = baseH + Math.sin(p * Math.PI) * 5.2;
        player.angle = Math.atan2(
          player.flight.tx - player.flight.sx,
          player.flight.tz - player.flight.sz,
        );
        spawnParticles(player.x, player.y, player.z, "#34f5a6", 1, 0.6);

        if (p >= 1) {
          player.y = player.flight.ty;
          player.vy = 0;
          player.grounded = true;
          player.launchCooldown = 1.6;
          spawnParticles(player.x, player.y, player.z, "#ffd970", 6, 1.5);
          player.flight = null;
        }
      } else {
        let moveX = joystick.x;
        let moveZ = joystick.y;
        if (keys.has("KeyW") || keys.has("ArrowUp")) moveZ -= 1;
        if (keys.has("KeyS") || keys.has("ArrowDown")) moveZ += 1;
        if (keys.has("KeyA") || keys.has("ArrowLeft")) moveX -= 1;
        if (keys.has("KeyD") || keys.has("ArrowRight")) moveX += 1;

        if (Math.hypot(moveX, moveZ) < 0.05 && player.targetPoint) {
          const dx = player.targetPoint.x - player.x;
          const dz = player.targetPoint.z - player.z;
          const dist = Math.hypot(dx, dz);
          if (dist > 0.22) {
            moveX = dx / dist;
            moveZ = dz / dist;
          } else {
            player.targetPoint = null;
          }
        }

        inputLen = Math.hypot(moveX, moveZ);
        const speed = 5.4 * Math.min(1, inputLen);
        if (inputLen > 0.05 && stateRef.current.entered) {
          const nx = moveX / inputLen;
          const nz = moveZ / inputLen;
          const stepX = player.x + nx * speed * dt;
          const stepZ = player.z + nz * speed * dt;

          const gBoth = sampleIslandGround(stepX, stepZ);
          if (gBoth !== null && gBoth - player.y <= 1.2) {
            player.x = stepX;
            player.z = stepZ;
          } else {
            const gX = sampleIslandGround(stepX, player.z);
            const gZ = sampleIslandGround(player.x, stepZ);
            if (gX !== null && gX - player.y <= 1.2) player.x = stepX;
            else if (gZ !== null && gZ - player.y <= 1.2) player.z = stepZ;
          }

          const targetAngle = Math.atan2(nx, nz);
          let diff = targetAngle - player.angle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          player.angle += diff * Math.min(1, dt * 12);

          player.walkPhase += dt * 13 * Math.min(1, inputLen);
          dustTimer += dt;
          if (dustTimer > 0.19 && player.grounded) {
            dustTimer = 0;
            spawnParticles(player.x, player.y, player.z, "#f2ead8", 1, 0.9);
          }
        } else {
          player.walkPhase *= 0.85;
        }

        const groundY = sampleIslandGround(player.x, player.z) ?? 0;
        if (!player.grounded || player.y > groundY + 0.08) {
          player.vy -= 16.0 * dt;
          player.y += player.vy * dt;
          if (player.y <= groundY) {
            if (player.vy < -3.2) {
              spawnParticles(player.x, groundY, player.z, "#f2ead8", 5, 1.2);
            }
            player.y = groundY;
            player.vy = 0;
            player.grounded = true;
          }
        } else {
          player.y += (groundY - player.y) * Math.min(1, dt * 15);
        }

        if (player.launchCooldown <= 0 && player.grounded) {
          for (const [key, pad] of [
            ["toSecret", LAUNCH_PADS.toSecret],
            ["toMain", LAUNCH_PADS.toMain],
          ] as const) {
            if (
              Math.hypot(
                player.x - pad.position[0],
                player.z - pad.position[2],
              ) < pad.radius
            ) {
              player.targetPoint = null;
              player.flight = {
                t: 0,
                duration: reducedMotion ? 0.15 : 1.15,
                sx: player.x,
                sy: player.y,
                sz: player.z,
                tx: pad.target[0],
                ty: pad.target[1],
                tz: pad.target[2],
              };
              skyAudio.playWindLaunch();
              stateRef.current.onEventToast(
                key === "toSecret"
                  ? "🌬 乘风起飞！前往云海深处的「守岛人彩蛋飞岛」"
                  : "🌬 乘风归航！返回空岛主广场",
              );
              break;
            }
          }
        }
      }

      if (!player.targetPoint) {
        const navMat = navMarker.material as THREE.MeshBasicMaterial;
        navMat.opacity = Math.max(0, navMat.opacity - dt * 2.5);
      } else {
        navMarker.rotation.z = elapsed * 1.8;
      }

      const stride = inputLen > 0.05 ? Math.sin(player.walkPhase) : 0;
      const bounce =
        inputLen > 0.05 && !reducedMotion && !player.flight
          ? Math.abs(Math.sin(player.walkPhase)) * 0.085
          : 0;

      traveler.position.set(player.x, player.y + bounce, player.z);
      traveler.rotation.y = player.angle;
      bodyPivot.rotation.x = player.flight
        ? 0.35
        : inputLen > 0.05
          ? 0.12 * Math.min(1, inputLen)
          : 0;
      capePivot.rotation.x =
        0.16 +
        (player.flight ? 0.55 : inputLen > 0.05 ? 0.34 : 0) +
        Math.sin(elapsed * 4.5) * 0.05;
      scarfTail.rotation.y = Math.sin(elapsed * 6) * 0.14;
      footL.position.z = stride * 0.14;
      footR.position.z = -stride * 0.14;

      const shadowGround = sampleIslandGround(player.x, player.z) ?? player.y;
      blobShadow.position.set(player.x, shadowGround + 0.03, player.z);
      blobShadow.scale.setScalar(
        Math.max(0.3, 1 - Math.max(0, player.y - shadowGround) * 0.14),
      );
      grassUniforms.uPlayerPos.value.set(player.x, player.y, player.z);

      // 卢比兔受惊跳跃
      const distToBlupee = Math.hypot(player.x - blupee.x, player.z - blupee.z);
      if (distToBlupee < 2.8 && !blupee.fleeing) {
        blupee.fleeing = true;
        blupee.spotIdx = (blupee.spotIdx + 1) % blupeeSpots.length;
        skyAudio.playBlupeeSparkle();
        spawnParticles(blupee.x, blupee.y + 0.3, blupee.z, "#8ff6ff", 7, 1.8);
      }
      const bTarget = blupeeSpots[blupee.spotIdx];
      const bDx = bTarget[0] - blupee.x;
      const bDz = bTarget[2] - blupee.z;
      const bDist = Math.hypot(bDx, bDz);
      if (bDist > 0.15) {
        const bSpeed = 6.8 * dt;
        blupee.x += (bDx / bDist) * Math.min(bDist, bSpeed);
        blupee.z += (bDz / bDist) * Math.min(bDist, bSpeed);
        blupee.y =
          (sampleIslandGround(blupee.x, blupee.z) ?? bTarget[1]) +
          Math.abs(Math.sin(elapsed * 14)) * 0.42;
        blupeeGroup.rotation.y = Math.atan2(bDx, bDz);
      } else {
        blupee.fleeing = false;
        blupee.y = bTarget[1] + Math.sin(elapsed * 2.5) * 0.03;
      }
      blupeeGroup.position.set(blupee.x, blupee.y, blupee.z);

      // 料理锅热气粒子
      steamTimer += dt;
      if (steamTimer > 0.55 && !reducedMotion) {
        steamTimer = 0;
        spawnParticles(-1.9, 0.58, 1.9, "#fff6e5", 1, 0.45);
      }

      // 左纳乌方块归位解谜与物理玩具碰撞
      for (const toy of toys) {
        if (toy.locked) {
          toy.mesh.position.set(
            PUZZLE_SOCKET.position[0],
            0.55 + Math.sin(elapsed * 3) * 0.08,
            PUZZLE_SOCKET.position[2],
          );
          toy.mesh.rotation.y = elapsed * 1.4;
          toy.mesh.rotation.x = elapsed * 0.9;
          continue;
        }

        const dx = toy.x - player.x;
        const dz = toy.z - player.z;
        const dist = Math.hypot(dx, dz);
        const minDist = toy.radius + 0.38;
        if (
          dist < minDist &&
          dist > 0.001 &&
          Math.abs(toy.y - player.y) < 0.85
        ) {
          const push = (minDist - dist) * 14.5;
          toy.vx += (dx / dist) * push;
          toy.vz += (dz / dist) * push;
        }

        toy.x += toy.vx * dt;
        toy.z += toy.vz * dt;
        toy.vx *= 0.91;
        toy.vz *= 0.91;

        if (
          toy.isPuzzleCube &&
          !puzzleSolved &&
          Math.hypot(
            toy.x - PUZZLE_SOCKET.position[0],
            toy.z - PUZZLE_SOCKET.position[2],
          ) < PUZZLE_SOCKET.snapRadius
        ) {
          toy.locked = true;
          puzzleSolved = true;
          skyAudio.playPuzzleSolved();
          spawnParticles(
            PUZZLE_SOCKET.position[0],
            0.4,
            PUZZLE_SOCKET.position[2],
            "#34f5a6",
            10,
            2.2,
          );
          stateRef.current.onEventToast(
            "✦ 解谜达成！左纳乌能量方块归位，古老纪念石柱已点亮！",
          );
          continue;
        }

        const tg = sampleIslandGround(toy.x, toy.z);
        if (tg !== null && !toy.falling) {
          toy.y += (tg + toy.radius - toy.y) * Math.min(1, dt * 14);
        } else {
          toy.falling = true;
          toy.vy -= 14 * dt;
          toy.y += toy.vy * dt;
          if (toy.y < -11) {
            const hg = sampleIslandGround(toy.homeX, toy.homeZ) ?? 0;
            toy.x = toy.homeX;
            toy.z = toy.homeZ;
            toy.y = hg + 5.0;
            toy.vx = 0;
            toy.vy = 0;
            toy.vz = 0;
            toy.falling = false;
          }
        }
        toy.mesh.position.set(toy.x, toy.y, toy.z);
        toy.mesh.rotation.x += toy.vz * dt * 2.2;
        toy.mesh.rotation.z -= toy.vx * dt * 2.2;
      }

      if (puzzleSolved) {
        const beamMat = puzzleBeam.material as THREE.MeshBasicMaterial;
        beamMat.opacity = THREE.MathUtils.lerp(
          beamMat.opacity,
          0.36 + Math.sin(elapsed * 4) * 0.08,
          dt * 3,
        );
        puzzleBeam.rotation.y = elapsed * 0.8;
      }

      if (gliderState.active) {
        gliderState.t += dt;
        const gt = gliderState.t;
        gliderGroup.position.set(
          gliderHome.x + Math.sin(gt * 1.1) * 2.4,
          gliderHome.y + gt * 1.35,
          gliderHome.z + gt * 5.8,
        );
        gliderGroup.rotation.z = -Math.cos(gt * 1.1) * 0.25;
        gliderGroup.rotation.x = -0.14;
        if (gt > 5.5) {
          gliderState.active = false;
          gliderGroup.position.copy(gliderHome);
          gliderGroup.rotation.set(0, 0, 0);
        }
      }

      let closestShrine: ShrineId | null = null;
      let closestDist = Infinity;
      let guidePos: [number, number, number] | null = null;

      for (const sh of ISLAND_SHRINES) {
        const dist = Math.hypot(
          player.x - sh.position[0],
          player.z - sh.position[2],
        );
        const ring = shrineRings[sh.id];
        const rMat = ring.material as THREE.MeshBasicMaterial;
        const inside =
          dist <= sh.triggerRadius && Math.abs(player.y - sh.position[1]) < 1.5;

        if (inside && dist < closestDist) {
          closestDist = dist;
          closestShrine = sh.id;
        }
        if (
          dist < 4.8 &&
          Math.abs(player.y - sh.position[1]) < 1.8 &&
          !guidePos
        ) {
          guidePos = sh.position;
        }

        const s = inside ? 1.16 + Math.sin(elapsed * 4) * 0.05 : 1.0;
        ring.scale.lerp(new THREE.Vector3(s, s, 1), dt * 8);
        rMat.opacity = inside ? 0.92 : 0.36;
      }

      if (closestShrine !== activeNearShrine) {
        activeNearShrine = closestShrine;
        stateRef.current.onNearShrineChange(closestShrine);
      }

      const wx = guidePos
        ? guidePos[0] + Math.cos(elapsed * 2.6) * 0.55
        : player.x + Math.cos(elapsed * 1.5) * 0.65;
      const wy = guidePos
        ? guidePos[1] + 2.3 + Math.sin(elapsed * 3) * 0.15
        : player.y + 1.48 + Math.sin(elapsed * 2.4) * 0.14;
      const wz = guidePos
        ? guidePos[2] + Math.sin(elapsed * 2.6) * 0.55
        : player.z + Math.sin(elapsed * 1.5) * 0.65;
      wispGroup.position.x += (wx - wispGroup.position.x) * dt * 4.8;
      wispGroup.position.y += (wy - wispGroup.position.y) * dt * 4.8;
      wispGroup.position.z += (wz - wispGroup.position.z) * dt * 4.8;
      wispCore.rotation.y = elapsed * 2.2;
      wispHalo.lookAt(camera.position);

      if (!reducedMotion) {
        forgeCore.rotation.y = elapsed * 1.2;
        forgeCore.position.y = 4.6 + Math.sin(elapsed * 2.2) * 0.14;
        forgeRingA.rotation.x = elapsed * 0.7;
        forgeRingA.rotation.y = elapsed * 0.5;
        forgeRingB.rotation.y = -elapsed * 0.95;
        forgeRingB.rotation.z = elapsed * 0.65;
        sundialHalo.rotation.y = elapsed * 0.85;
        windmillSails.rotation.z = -elapsed * 0.9;
        potFlame.scale.y = 0.9 + Math.sin(elapsed * 13) * 0.18;
        secretFlame.scale.y = 0.9 + Math.cos(elapsed * 11) * 0.18;

        for (const v of launchVortexMeshes) {
          v.rotation.z = elapsed * 2.4;
          v.scale.setScalar(0.95 + Math.sin(elapsed * 4) * 0.08);
        }
        for (const mp of mistPuffs) {
          mp.mesh.scale.setScalar(
            mp.baseScale + Math.sin(elapsed * 3.2 + mp.phase) * 0.18,
          );
        }
        for (const cl of clouds) {
          cl.group.position.x += cl.speed * dt;
          if (cl.group.position.x > 36) cl.group.position.x = -36;
        }
        for (const lf of leaves) {
          if (nightLerp > 0.5) {
            lf.mesh.position.x =
              lf.ox + Math.sin(elapsed * 0.9 + lf.phase) * 0.8;
            lf.mesh.position.y =
              1.2 + Math.abs(Math.sin(elapsed * 1.1 + lf.phase)) * 2.4;
            lf.mesh.position.z =
              lf.oz + Math.cos(elapsed * 0.8 + lf.phase) * 0.8;
          } else {
            const fall = ((elapsed * 0.52 + lf.phase) % 3.8) / 3.8;
            lf.mesh.position.x =
              lf.ox + Math.sin(elapsed * 1.5 + lf.phase) * 0.6 + fall * 1.2;
            lf.mesh.position.y = 5.0 - fall * 4.4;
            lf.mesh.position.z = lf.oz + Math.cos(elapsed + lf.phase) * 0.4;
          }
          lf.mesh.rotation.x = elapsed * 1.5 + lf.phase;
          lf.mesh.rotation.y = elapsed * 1.2;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          scene.remove(p.mesh);
          (p.mesh.material as THREE.Material).dispose();
          particles.splice(i, 1);
          continue;
        }
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        const ratio = 1 - p.life / p.maxLife;
        p.mesh.scale.setScalar(0.5 + (1 - ratio) * 0.95);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = ratio * 0.7;
      }

      // 全景机位同步 .blend 中的「群岛全景 · 相机」取景范围，并按宽高比自适应竖屏平板/手机，完整框住四座岛与东崖瀑布
      const aspect =
        container.clientWidth / Math.max(1, container.clientHeight);
      const isNarrow = container.clientWidth < 640;
      const onSecretIslet = player.x < -9.2 && !player.flight;
      if (stateRef.current.vistaMode || onSecretIslet) {
        const portraitBoost = aspect < 1.05 ? Math.min(1.52, 1.08 / aspect) : 1;
        const focusPoint = onSecretIslet
          ? new THREE.Vector3(-4.2, 1.4, -3.5)
          : new THREE.Vector3(-1.4, 1.2, -5.8);
        camTarget.lerp(focusPoint, dt * 2.8);
        desiredCamPos.set(
          onSecretIslet ? -7.2 : 3.2,
          28.5 * portraitBoost,
          28.5 * portraitBoost,
        );
      } else {
        camTarget.lerp(
          new THREE.Vector3(player.x, player.y + 0.85, player.z),
          dt * 5.5,
        );
        desiredCamPos.set(
          camTarget.x,
          camTarget.y + (isNarrow ? 11.8 : 9.6),
          camTarget.z + (isNarrow ? 14.0 : 11.6),
        );
      }
      camera.position.lerp(desiredCamPos, dt * 4.5);
      camera.lookAt(camTarget);

      renderer.render(scene, camera);

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      for (const sh of ISLAND_SHRINES) {
        const el = markerRefs.current[sh.id];
        if (!el) continue;
        const heightOffset = sh.id === "pot" ? 1.45 : 2.65;
        projVec.set(
          sh.position[0],
          sh.position[1] + heightOffset,
          sh.position[2],
        );
        projVec.project(camera);
        if (projVec.z > 1) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          continue;
        }
        const sx = (projVec.x * 0.5 + 0.5) * cw;
        const sy = (-projVec.y * 0.5 + 0.5) * ch;
        const onScreen = sx > 20 && sx < cw - 20 && sy > 54 && sy < ch - 78;
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`;
        el.style.opacity = onScreen ? "1" : "0";
        el.style.pointerEvents = onScreen ? "auto" : "none";
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      engineRef.current = null;
      gradientMap.dispose();
      bladeGeo.dispose();
      grassMat.dispose();
      waterfallMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [engineRef, markerRefs, onReady]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 h-dvh w-full touch-none select-none"
    />
  );
}
