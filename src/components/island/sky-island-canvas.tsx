"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { skyAudio } from "@/lib/sky-audio";
import {
  ISLAND_SHRINES,
  ISLAND_TIERS,
  LAUNCH_PADS,
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

function createArchitecturalGrainTexture(): THREE.DataTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 无缝周期性手绘石材/陶瓦肌理噪声
      const ux = (x / size) * Math.PI * 2;
      const uy = (y / size) * Math.PI * 2;
      const macro =
        Math.sin(ux * 2 + Math.cos(uy * 2)) * 0.35 +
        Math.cos(uy * 3 - Math.sin(ux * 3)) * 0.25;
      const hash = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
      const micro = (hash - Math.floor(hash) - 0.5) * 0.4;
      const v = Math.max(
        0,
        Math.min(255, Math.round((0.5 + macro * 0.32 + micro * 0.45) * 255)),
      );
      const idx = (y * size + x) * 4;
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.needsUpdate = true;
  return tex;
}

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

    // ---------------- 1. Transparent Renderer over Sunset Cloud-Sea Backdrop ----------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // 为黄铜星盘、熟铁烤架与清泉池面提供柔和的物理环境反射 (IBL)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    roomEnv.dispose();
    scene.environment = envRT.texture;
    scene.environmentIntensity = stateRef.current.isNight ? 0.16 : 0.34;

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.5,
      220,
    );
    camera.position.set(0, 14, 21);

    const gradientMap = createToonGradient();
    const matGoldGlow = makeZeldaRimToon(
      gradientMap,
      "#ebc054",
      "#fff5c0",
      0.35,
      "#e6b64c",
      0.28,
    );

    // ---------------- 2. World-Space Animated Zelda Water & Waterfall Shader ----------------
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

          float streamCoord = vWorldPos.x * 1.1 + vWorldPos.z * 0.55 - uTime * 1.85;
          float ripple1 = sin(streamCoord * 3.8 + cos(vWorldPos.z * 2.6)) * 0.5 + 0.5;
          float ripple2 = cos((vWorldPos.x * 2.1 - vWorldPos.z * 2.4) - uTime * 1.3) * 0.5 + 0.5;
          float topFoam = step(0.73, ripple1 * 0.62 + ripple2 * 0.45);

          float fallScroll = vWorldPos.y * 1.65 + uTime * 5.2;
          float fallStripe1 = sin((vWorldPos.x + vWorldPos.z) * 5.2 + sin(fallScroll) * 0.9) * 0.5 + 0.5;
          float fallStripe2 = cos(fallScroll * 2.1 + vWorldPos.z * 4.0) * 0.5 + 0.5;
          float baseMist = smoothstep(-2.6, -4.85, vWorldPos.y);
          float crestFoam = smoothstep(2.45, 2.90, vWorldPos.y);
          float fallFoam = clamp(step(0.65, fallStripe1 * 0.65 + fallStripe2 * 0.45) * 0.72 + baseMist * 0.9 + crestFoam * 0.85, 0.0, 1.0);

          float foamMask = mix(fallFoam, topFoam * 0.72, isTop);

          vec3 waterDay = mix(vec3(0.28, 0.76, 0.92), vec3(0.24, 0.74, 0.84), isTop);
          vec3 waterNight = mix(vec3(0.12, 0.44, 0.68), vec3(0.10, 0.38, 0.56), isTop);
          vec3 baseCol = mix(waterDay, waterNight, uNightMix);
          vec3 foamCol = mix(vec3(0.96, 0.99, 1.0), vec3(0.68, 0.96, 0.98), uNightMix);

          gl_FragColor = vec4(mix(baseCol, foamCol, foamMask), 0.90);
        }
      `,
    });

    // ---------------- 3. Golden-Hour Afternoon Sunlight Matching Sky Backdrop ----------------
    const hemiLight = new THREE.HemisphereLight("#a8caff", "#565c78", 0.55);
    scene.add(hemiLight);

    // 左上角暖金午后斜阳，与「云海天幕 · 绘景」光照方向完全吻合
    const sunLight = new THREE.DirectionalLight("#ffdfa6", 1.75);
    sunLight.position.set(-16, 26, 14);
    sunLight.target.position.set(0, 0, -5);
    scene.add(sunLight.target);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 76;
    const sd = 26;
    sunLight.shadow.camera.left = -sd;
    sunLight.shadow.camera.right = sd;
    sunLight.shadow.camera.top = sd;
    sunLight.shadow.camera.bottom = -sd;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.025;
    scene.add(sunLight);

    // 柔和蓝天补光（消除树冠与岩体背光死黑，保留暖冷光影层次）
    const fillLight = new THREE.DirectionalLight("#8eb8ff", 0.22);
    fillLight.position.set(18, 12, -16);
    scene.add(fillLight);

    // 烤肉篝火暖光 (-2.88, 0.55, 1.60) & 彩蛋飞岛篝火暖光
    // 烤肉篝火暖光 (-3.85, 0.55, 1.25) & 守岛人纪念碑双仪灯暖光 (-14.3, 3.6, 4.15)
    const potFireLight = new THREE.PointLight("#ff862e", 2.6, 8.5, 1.5);
    potFireLight.position.set(-3.85, 0.55, 1.25);
    scene.add(potFireLight);

    const secretFireLight = new THREE.PointLight("#ff9438", 2.2, 8.5, 1.5);
    secretFireLight.position.set(-14.3, 3.6, 4.15);
    scene.add(secretFireLight);

    // ---------------- 4. Load Draco-Compressed Autumn Garden GLB & Bind Dynamic Pivots ----------------
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

    // 直接驱动 GLB 内精致原版零件的旋转枢轴、唯一主角与传信滑翔翼容器
    const traveler = new THREE.Group();
    const bodyPivot = new THREE.Group();
    const travelerModelPivot = new THREE.Group();
    traveler.add(bodyPivot);

    const gliderHome = new THREE.Vector3(-0.2, 0.19, 7.1);
    const gliderGroup = new THREE.Group();
    gliderGroup.position.copy(gliderHome);
    scene.add(gliderGroup);
    const gliderState = { active: false, t: 0 };

    const windmillPivot = new THREE.Group();
    windmillPivot.position.set(3.665, 2.49, 4.403);
    const windmillAxis = new THREE.Vector3(0.5, 0, -0.866).normalize();
    scene.add(windmillPivot);

    const spitPivot = new THREE.Group();
    spitPivot.position.set(-3.85, 1.08, 1.25);
    const spitAxis = new THREE.Vector3(0.834, 0, -0.552).normalize();
    scene.add(spitPivot);

    const sundialPivot = new THREE.Group();
    sundialPivot.position.set(-7.25, 2.952, -9.35);
    const sundialFlipAxis = new THREE.Vector3(0.914, 0, -0.407).normalize();
    scene.add(sundialPivot);

    const flameMeshes: THREE.Mesh[] = [];
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const archGrainTex = createArchitecturalGrainTexture();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/model/autumn-garden.glb",
      (gltf) => {
        if (disposed) return;

        // 先将模型加入场景并刷新世界矩阵，便于 .attach() 精确保留世界坐标
        scene.add(gltf.scene);
        gltf.scene.updateMatrixWorld(true);

        const toTraveler: THREE.Object3D[] = [];
        const toGlider: THREE.Object3D[] = [];
        const toWindmill: THREE.Object3D[] = [];
        const toSpit: THREE.Object3D[] = [];
        const toSundial: THREE.Object3D[] = [];

        gltf.scene.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          // Three.js GLTFLoader 会把节点名中的空格替换为下划线，统一去空格与下划线后再匹配
          const meshName =
            `${child.name ?? ""}${child.parent?.name ?? ""}`.replace(
              /[\s_]+/g,
              "",
            );
          const origMat = Array.isArray(child.material)
            ? child.material[0]
            : child.material;
          const origName = (origMat?.name as string | undefined) ?? "";

          // 1. 水系套用世界空间流动水波与瀑布白沫着色器
          if (
            meshName.includes("清泉池") ||
            meshName.includes("泉水溪流") ||
            meshName.includes("清溪水面") ||
            meshName.includes("瀑布水帘")
          ) {
            child.material = waterfallMat;
            child.castShadow = false;
            child.receiveShadow = false;
            return;
          }

          // 2. 保留秋日庭园的全部原版手绘贴图、材质与曲线细部
          const isHeavyFoliage =
            meshName.includes("扇形叶簇") ||
            meshName.includes("外梢扇叶") ||
            meshName.includes("疏密草丛") ||
            meshName.includes("秋日野花") ||
            meshName.includes("琥珀矮灌") ||
            meshName.includes("崖缘与穗梗") ||
            meshName.includes("芦穗") ||
            meshName.includes("水畔芦叶") ||
            meshName.includes("岸边菖蒲");

          const isTurf =
            origName.includes("Turf") ||
            origName.includes("草径") ||
            meshName.includes("草地");

          child.castShadow = !isHeavyFoliage && !isTurf;
          child.receiveShadow = true;

          // 开启各向异性过滤锐化斜视角手绘草径贴图，并为建筑石材/陶瓦/木纹叠加工艺凹凸肌理
          const hasUv = Boolean(child.geometry?.attributes?.uv);
          const isArchDetail =
            !isHeavyFoliage &&
            !isTurf &&
            !meshName.startsWith("小旅人") &&
            (meshName.includes("风车") ||
              meshName.includes("石门") ||
              meshName.includes("石碑") ||
              meshName.includes("书台") ||
              meshName.includes("石书") ||
              meshName.includes("日月晷") ||
              meshName.includes("星扇") ||
              meshName.includes("纪念碑") ||
              meshName.includes("罗盘") ||
              meshName.includes("踏板") ||
              meshName.includes("桥板") ||
              meshName.includes("岩") ||
              meshName.includes("祭台") ||
              meshName.includes("石柱") ||
              meshName.includes("铺石") ||
              meshName.includes("信箱"));
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          for (const m of mats) {
            if (!m) continue;
            if (isHeavyFoliage) {
              m.side = THREE.DoubleSide;
            }
            if (m instanceof THREE.MeshStandardMaterial) {
              if (m.map) m.map.anisotropy = maxAnisotropy;
              if (m.normalMap) m.normalMap.anisotropy = maxAnisotropy;
              if (m.roughnessMap) m.roughnessMap.anisotropy = maxAnisotropy;
              if (isArchDetail && hasUv && !m.bumpMap && !m.normalMap) {
                m.bumpMap = archGrainTex;
                m.bumpScale = 0.016;
              }
            }
          }

          if (
            isTurf ||
            meshName.includes("踏板") ||
            meshName.includes("桥板") ||
            meshName.includes("外台") ||
            meshName.includes("石台") ||
            meshName.includes("铺石环") ||
            meshName.includes("银杏罗盘")
          ) {
            walkableMeshes.push(child);
          }

          // 3. 识别唯一原版主角、传信滑翔翼及场景中需要实时旋转/翻转的精致构件
          if (meshName.startsWith("小旅人")) {
            toTraveler.push(child);
          } else if (meshName.includes("传信滑翔翼")) {
            toGlider.push(child);
          } else if (
            meshName.includes("布帆") ||
            meshName.includes("鼓起的亚麻帆") ||
            meshName.includes("橡木辐杆") ||
            meshName.includes("帆边木条") ||
            meshName.includes("帆骨")
          ) {
            toWindmill.push(child);
          } else if (
            meshName.includes("蜜烤肉卷") ||
            meshName.includes("脆脂纹") ||
            meshName.includes("表面焦纹") ||
            meshName.includes("转叉") ||
            meshName.includes("摇柄") ||
            meshName.includes("木握把") ||
            meshName.includes("双齿肉叉") ||
            meshName.includes("切面脂纹") ||
            meshName.includes("香草")
          ) {
            toSpit.push(child);
          } else if (
            meshName.includes("厚铜盘") ||
            meshName.includes("向阳刻面") ||
            meshName.includes("夜空刻面") ||
            meshName.includes("双圈镶边") ||
            meshName.includes("太阳圆心") ||
            meshName.includes("指针座") ||
            meshName.includes("指针金尖") ||
            meshName.includes("放射时线") ||
            meshName.includes("日芒") ||
            meshName.includes("时点") ||
            meshName.includes("晷针") ||
            meshName.includes("弧形刻线") ||
            meshName.includes("星点") ||
            meshName.includes("银月")
          ) {
            toSundial.push(child);
          } else if (
            meshName.includes("火苗") ||
            meshName.includes("仪灯暖焰")
          ) {
            flameMeshes.push(child);
          }
        });

        // 将 Blender 原版「斗篷小旅人」从初始银杏罗盘台面 (0, 0.16, 2.8) 归零并挂载到唯一可操控主角
        if (toTraveler.length > 0) {
          travelerModelPivot.position.set(0, 0.16, 2.8);
          scene.add(travelerModelPivot);
          travelerModelPivot.updateMatrixWorld(true);
          for (const o of toTraveler) travelerModelPivot.attach(o);
          travelerModelPivot.position.set(0, 0, 0);
          bodyPivot.add(travelerModelPivot);
        }

        // 将原版「传信滑翔翼 · 石翼与符纹」挂载到可放飞滑翔翼容器
        if (toGlider.length > 0) {
          gliderGroup.updateMatrixWorld(true);
          for (const o of toGlider) gliderGroup.attach(o);
        }

        for (const o of toWindmill) windmillPivot.attach(o);
        for (const o of toSpit) spitPivot.attach(o);
        for (const o of toSundial) sundialPivot.attach(o);

        onReady();
      },
      undefined,
      () => {
        if (!disposed) onReady();
      },
    );

    // 东崖瀑布底部轻柔水雾团 (14.18, -4.68, -9.08)
    const mistPuffs: { mesh: THREE.Mesh; baseScale: number; phase: number }[] =
      [];
    const mistMat = new THREE.MeshBasicMaterial({
      color: "#f5fbff",
      transparent: true,
      opacity: 0.42,
    });
    const [mx, my, mz] = WATERFALL_PATH.mistCenter;
    for (let i = 0; i < 6; i++) {
      const mp = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.32 + (i % 2) * 0.14, 1),
        mistMat,
      );
      const a = (i / 6) * Math.PI * 2;
      mp.position.set(
        mx + Math.cos(a) * 0.52,
        my + (i % 2) * 0.18,
        mz + Math.sin(a) * 0.52,
      );
      scene.add(mp);
      mistPuffs.push({
        mesh: mp,
        baseScale: 0.85 + (i % 3) * 0.18,
        phase: i * 1.1,
      });
    }

    // ---------------- 5. Glowing Blupee Spirit Rabbit ----------------
    const blupeeGroup = new THREE.Group();
    const matBlupee = new THREE.MeshBasicMaterial({
      color: "#8ff6ff",
      transparent: true,
      opacity: 0.92,
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
    const blupeeLight = new THREE.PointLight("#6beeff", 1.5, 4.5);
    blupeeLight.position.set(0, 0.4, 0);
    blupeeGroup.add(bBody, bHead, bEarL, bEarR, bTail, blupeeLight);

    const blupeeSpots: [number, number, number][] = [
      [-5.14, 1.35, -10.9],
      [-8.2, 1.35, -12.6],
      [0.6, 0.0, 5.6],
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

    // ---------------- 6. Pushable Golden Physics Orbs ----------------
    const toys: PhysicsToy[] = [];
    const toySpecs: [number, number][] = [
      [-0.78, 4.68],
      [-3.95, -0.87],
    ];
    for (const [tx, tz] of toySpecs) {
      const gy = sampleIslandGround(tx, tz) ?? 0;
      const r = 0.27;
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(r, 1),
        matGoldGlow,
      );
      mesh.castShadow = true;
      mesh.position.set(tx, gy + r, tz);
      scene.add(mesh);
      toys.push({
        mesh,
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

    // ---------------- 7. Launch Pad Vortexes & Subtle Shrine Ground Rings ----------------
    const launchVortexMeshes: THREE.Mesh[] = [];
    for (const pad of [LAUNCH_PADS.toSecret, LAUNCH_PADS.toMain]) {
      const vortex = new THREE.Mesh(
        new THREE.RingGeometry(0.75, 0.96, 28),
        new THREE.MeshBasicMaterial({
          color: "#ffd670",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.62,
        }),
      );
      vortex.rotation.x = -Math.PI / 2;
      vortex.position.set(
        pad.position[0],
        pad.position[1] + 0.19,
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
        new THREE.RingGeometry(0.88, 1.08, 28),
        new THREE.MeshBasicMaterial({
          color: sh.id === "about" ? "#ffd15c" : "#34f5a6",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.34,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(sh.position[0], sh.position[1] + 0.06, sh.position[2]);
      scene.add(ring);
      shrineRings[sh.id] = ring;
    }

    // ---------------- 9. Interactive Wind-Parting Grass Accent Layer ----------------
    // GLB 已自带精致的疏密草丛、野花与灌木，这里叠加轻量互动拨草层保留踩踏压弯反馈
    const grassCount = 720;
    const bladeGeo = new THREE.ConeGeometry(0.055, 0.38, 3);
    bladeGeo.translate(0, 0.19, 0);

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
          float h = clamp(position.y / 0.38, 0.0, 1.0);
          vTip = h;
          vSeed = fract(sin(dot(worldBase.xz, vec2(12.9898, 78.233))) * 43758.5453);

          vec3 pos = position;
          float wind = sin(worldBase.x * 0.45 + uTime * 2.2) * cos(worldBase.z * 0.42 + uTime * 1.6);
          pos.x += wind * 0.14 * h * h;
          pos.z += cos(worldBase.x * 0.35 + uTime * 1.9) * 0.08 * h * h;

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
          vec3 dayBase = mix(vec3(0.32, 0.46, 0.22), vec3(0.58, 0.48, 0.20), vSeed);
          vec3 dayTip  = mix(vec3(0.62, 0.74, 0.32), vec3(0.90, 0.74, 0.28), vSeed);
          vec3 nightBase = vec3(0.07, 0.18, 0.14);
          vec3 nightTip  = mix(vec3(0.16, 0.42, 0.30), vec3(0.24, 0.60, 0.44), vSeed);

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
    while (placed < grassCount && attempts < grassCount * 8) {
      attempts++;
      const tier = ISLAND_TIERS[placed % ISLAND_TIERS.length];
      // 偏向边缘草甸生长，完整留出岛心手绘泥土步道
      const r = (0.48 + Math.random() * 0.42) * (tier.radius - 0.55);
      const theta = Math.random() * Math.PI * 2;
      const gx = tier.x + Math.cos(theta) * r;
      const gz = tier.z + Math.sin(theta) * r;

      if (Math.hypot(gx, gz - 2.5) < 2.2) continue;
      if (Math.hypot(gx - pondX, gz - pondZ) < 1.8) continue;
      if (Math.hypot(gx - streamX, gz - streamZ) < 1.9) continue;

      let blocked = false;
      for (const sh of ISLAND_SHRINES) {
        if (Math.hypot(gx - sh.position[0], gz - sh.position[2]) < 1.55) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      dummy.position.set(gx, tier.y, gz);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.72 + Math.random() * 0.55;
      dummy.scale.set(s, s * (0.78 + Math.random() * 0.45), s);
      dummy.updateMatrix();
      grassMesh.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    grassMesh.count = placed;
    grassMesh.instanceMatrix.needsUpdate = true;
    scene.add(grassMesh);

    // ---------------- 10. Falling Golden Ginkgo Leaves & Night Fireflies ----------------
    const leafGeo = new THREE.PlaneGeometry(0.15, 0.15);
    const leafMat = new THREE.MeshBasicMaterial({
      color: "#ffb938",
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

    // ---------------- 11. Playable Sculpted Blender Traveler + Waist Lantern Light ----------------
    const travelerLanternLight = new THREE.PointLight("#ffad42", 0.3, 6.8, 1.5);
    travelerLanternLight.position.set(0.3, 0.56, 0.18);
    bodyPivot.add(travelerLanternLight);

    const blobShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.36, 16),
      new THREE.MeshBasicMaterial({
        color: "#000000",
        transparent: true,
        opacity: 0.26,
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

    // ---------------- 12. Controls & Engine Handle ----------------
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
        const offsets: Record<ShrineId, [number, number]> = {
          writing: [0, 1.55],
          works: [-0.3, 1.95],
          connect: [-0.9, -0.8],
          time: [0.9, -0.95],
          pot: [0.75, 1.2],
          about: [1.15, 1.4],
        };
        const [ox, oz] = offsets[id];
        const destX = sh.position[0] + ox;
        const destZ = sh.position[2] + oz;
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
      camera.fov = w < 640 ? 48 : 40;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    window.addEventListener("resize", onResize);

    // ---------------- 13. Main Render Loop ----------------
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

      sunLight.intensity = THREE.MathUtils.lerp(1.75, 0.55, nightLerp);
      sunLight.color.set("#ffdfa6").lerp(new THREE.Color("#6b8eff"), nightLerp);
      hemiLight.intensity = THREE.MathUtils.lerp(0.55, 0.26, nightLerp);
      fillLight.intensity = THREE.MathUtils.lerp(0.22, 0.15, nightLerp);
      scene.environmentIntensity = THREE.MathUtils.lerp(0.34, 0.16, nightLerp);
      potFireLight.intensity =
        THREE.MathUtils.lerp(1.6, 4.0, nightLerp) +
        Math.sin(elapsed * 10) * 0.25;
      secretFireLight.intensity =
        THREE.MathUtils.lerp(1.2, 3.6, nightLerp) +
        Math.cos(elapsed * 9) * 0.22;
      travelerLanternLight.intensity = THREE.MathUtils.lerp(
        0.25,
        3.1,
        nightLerp,
      );

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
        ? 0.32
        : inputLen > 0.05
          ? 0.11 * Math.min(1, inputLen)
          : 0;
      bodyPivot.rotation.z = player.flight ? 0 : stride * 0.055;

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

      // 烤肉架热气与香气粒子 (-3.85, 1.15, 1.25)
      steamTimer += dt;
      if (steamTimer > 0.55 && !reducedMotion) {
        steamTimer = 0;
        spawnParticles(-3.85, 1.15, 1.25, "#fff4e0", 1, 0.48);
      }

      // 可推动金色物理球
      for (const toy of toys) {
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
        rMat.opacity = inside ? 0.88 : 0.3;
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

      // 双面日月晷铜盘随昼夜切换沿水平翻面轴平滑翻转 180°（日面 ↔ 月面）
      sundialPivot.setRotationFromAxisAngle(
        sundialFlipAxis,
        nightLerp * Math.PI,
      );

      // 驱动 GLB 内精致原版风车帆、旋转烤肉架与火焰水雾动画
      if (!reducedMotion) {
        windmillPivot.setRotationFromAxisAngle(windmillAxis, elapsed * 0.72);
        spitPivot.setRotationFromAxisAngle(spitAxis, elapsed * 0.9);

        for (const fm of flameMeshes) {
          fm.scale.y = 0.92 + Math.sin(elapsed * 12) * 0.15;
        }
        for (const v of launchVortexMeshes) {
          v.rotation.z = elapsed * 2.1;
          v.scale.setScalar(0.96 + Math.sin(elapsed * 3.8) * 0.06);
        }
        for (const mp of mistPuffs) {
          mp.mesh.scale.setScalar(
            mp.baseScale + Math.sin(elapsed * 3.2 + mp.phase) * 0.18,
          );
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
            lf.mesh.position.y = 5.2 - fall * 4.5;
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

      // 全景机位对齐「秋日云庭 · 全景镜头」并按竖屏宽高比自适应拉远
      const aspect =
        container.clientWidth / Math.max(1, container.clientHeight);
      const isNarrow = container.clientWidth < 640;
      // 仅在真正登上西南「彩蛋飞岛」圆域 (-13.21, 5.39) 时触发观景远景，避免中岛古树林西侧误触
      const secretTier = ISLAND_TIERS[3];
      const onSecretIslet =
        !player.flight &&
        Math.hypot(player.x - secretTier.x, player.z - secretTier.z) <=
          secretTier.radius + 0.6;
      if (stateRef.current.vistaMode || onSecretIslet) {
        const portraitBoost = aspect < 1.05 ? Math.min(1.52, 1.08 / aspect) : 1;
        const focusPoint = onSecretIslet
          ? new THREE.Vector3(-4.2, 1.4, -3.5)
          : new THREE.Vector3(-1.1, 1.4, -5.8);
        camTarget.lerp(focusPoint, dt * 2.8);
        desiredCamPos.set(
          onSecretIslet ? -7.2 : -0.65,
          29.4 * portraitBoost,
          39.5 * portraitBoost,
        );
      } else {
        camTarget.lerp(
          new THREE.Vector3(player.x, player.y + 0.85, player.z),
          dt * 5.5,
        );
        desiredCamPos.set(
          camTarget.x,
          camTarget.y + (isNarrow ? 11.6 : 9.4),
          camTarget.z + (isNarrow ? 13.8 : 11.4),
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
        const heightOffsets: Record<ShrineId, number> = {
          pot: 1.85,
          connect: 2.35,
          writing: 2.55,
          time: 2.55,
          works: 4.35,
          about: 5.55,
        };
        const heightOffset = heightOffsets[sh.id];
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
      dracoLoader.dispose();
      envRT.dispose();
      pmrem.dispose();
      archGrainTex.dispose();
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
    <div className="fixed inset-0 h-dvh w-full select-none">
      {/* 云海天幕背景：白昼呈现原版夕阳云海绘景，入夜平滑过渡为星夜蓝调 */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: "url('/model/sky-backdrop.jpg')" }}
        className={`pointer-events-none absolute inset-0 bg-cover bg-center transition-[filter] duration-700 ${
          isNight
            ? "brightness-[0.22] contrast-115 hue-rotate-15 saturate-75"
            : "brightness-100"
        }`}
      />
      <div
        ref={containerRef}
        className="relative h-full w-full touch-none select-none"
      />
    </div>
  );
}
