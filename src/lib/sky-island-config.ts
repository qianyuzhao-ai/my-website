// 王国之泪风「三层阶梯主岛 + 悬空彩蛋小飞岛（Sky Archipelago v2）」世界坐标与地形碰撞系统。
// 坐标系约定：Three.js Y-up（+X 向东，-X 向西，-Z 向北/远景高处，+Z 向南/前景低处）。

export type ShrineId =
  | "writing"
  | "works"
  | "connect"
  | "time"
  | "about"
  | "pot";

export type IslandTier = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  tint: "golden" | "emerald" | "highland" | "secret";
};

export type WalkableRamp = {
  id: string;
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  halfWidth: number;
};

export type ShrineConfig = {
  id: ShrineId;
  code: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  position: [x: number, y: number, z: number];
  triggerRadius: number;
};

/**
 * 三层阶梯主岛 + 左前景悬空彩蛋小飞岛
 * 近低（南 y=0）→ 中高（西北银杏林 y=1.35）→ 远高（东北造物山巅 y=2.85），固定斜俯视下层次最饱满！
 */
export const ISLAND_TIERS: IslandTier[] = [
  {
    id: "low-plaza",
    name: "觉醒石阵与风车前崖（低层）",
    x: 0.0,
    y: 0.0,
    z: 2.5,
    radius: 6.4,
    tint: "golden",
  },
  {
    id: "mid-grove",
    name: "黄金银杏古树林（中层）",
    x: -5.4,
    y: 1.35,
    z: -3.5,
    radius: 5.2,
    tint: "golden",
  },
  {
    id: "high-sanctum",
    name: "左纳乌造物山巅（高层）",
    x: 5.4,
    y: 2.85,
    z: -3.8,
    radius: 4.9,
    tint: "highland",
  },
  {
    id: "secret-islet",
    name: "云海观景彩蛋飞岛",
    x: -13.2,
    y: 2.2,
    z: 5.4,
    radius: 3.7,
    tint: "secret",
  },
];

/** 连接低层 → 中层、中层 → 高层、以及低层直通高层的风化石阶与石拱桥 */
export const WALKABLE_RAMPS: WalkableRamp[] = [
  // 低层广场 -> 中层银杏古树林（宽石阶坡道）
  {
    id: "ramp-low-to-mid",
    ax: -2.4,
    ay: 0.0,
    az: 0.2,
    bx: -4.2,
    by: 1.35,
    bz: -1.6,
    halfWidth: 1.55,
  },
  // 中层银杏林 -> 高层造物山巅（跨溪石拱桥，桥下流过清泉！）
  {
    id: "bridge-mid-to-high",
    ax: -1.3,
    ay: 1.35,
    az: -3.6,
    bx: 1.6,
    by: 2.85,
    bz: -3.7,
    halfWidth: 1.45,
  },
  // 低层东侧 -> 高层造物山巅（东侧盘山石阶）
  {
    id: "ramp-low-to-high",
    ax: 3.2,
    ay: 0.0,
    az: 0.4,
    bx: 4.6,
    by: 2.85,
    bz: -1.5,
    halfWidth: 1.35,
  },
];

/** 往返「悬空彩蛋小飞岛」的左纳乌青绿乘风弹射阵 */
export const LAUNCH_PADS = {
  toSecret: {
    position: [-5.1, 0.02, 4.1] as [number, number, number],
    target: [-11.8, 2.2, 5.2] as [number, number, number],
    radius: 1.05,
  },
  toMain: {
    position: [-10.5, 2.22, 4.8] as [number, number, number],
    target: [-3.4, 0.0, 3.4] as [number, number, number],
    radius: 1.05,
  },
} as const;

/** 左纳乌方块归位解谜机关坐标 */
export const PUZZLE_SOCKET = {
  position: [4.2, 0.02, 2.9] as [number, number, number],
  pillarPosition: [5.1, 0.0, 1.8] as [number, number, number],
  snapRadius: 0.85,
} as const;

/** 山巅清泉与悬崖瀑布关键路径坐标 */
export const WATERFALL_PATH = {
  pondCenter: [3.6, 2.86, -5.2] as [number, number, number],
  cliffEdge: [0.25, 1.32, -2.2] as [number, number, number],
  fallX: 8.9,
  fallTopY: 2.82,
  fallZ: -2.6,
  fallHeight: 7.4,
} as const;

/** 六处可交互神庙/石碑/彩蛋点 */
export const ISLAND_SHRINES: ShrineConfig[] = [
  {
    id: "writing",
    code: "01",
    title: "手稿石碑 · Writing",
    subtitle: "中层银杏林 · 一线实战复盘与工程长文",
    actionLabel: "阅读手稿石碑",
    position: [-6.4, 1.35, -4.4],
    triggerRadius: 2.5,
  },
  {
    id: "works",
    code: "02",
    title: "造物星盘 · Works",
    subtitle: "高层山巅 · Coding × AIGC 作品与实验台",
    actionLabel: "开启造物星盘",
    position: [5.9, 2.85, -4.3],
    triggerRadius: 2.6,
  },
  {
    id: "connect",
    code: "03",
    title: "风车信使 · Connect",
    subtitle: "低层南崖 · 社交频率与飞翼传信",
    actionLabel: "打开发信信箱",
    position: [1.5, 0.0, 7.2],
    triggerRadius: 2.4,
  },
  {
    id: "time",
    code: "04",
    title: "时之日晷 · 昼夜",
    subtitle: "中层北崖 · 切换空岛白昼与星夜萤火",
    actionLabel: "拨动时之日晷",
    position: [-2.6, 1.35, -6.6],
    triggerRadius: 2.2,
  },
  {
    id: "pot",
    code: "05",
    title: "篝火料理锅",
    subtitle: "尝一口正在炖煮的灵感浓汤",
    actionLabel: "查看锅中灵感",
    position: [-1.9, 0.0, 1.9],
    triggerRadius: 1.9,
  },
  {
    id: "about",
    code: "★",
    title: "守岛人私房碑 · About",
    subtitle: "彩蛋飞岛 · 关于我与近期折腾",
    actionLabel: "阅读守岛人手记",
    position: [-13.8, 2.2, 5.6],
    triggerRadius: 2.6,
  },
];

/**
 * 采样任意平面坐标 (x, z) 的可行走高度 y；若位于空岛外悬崖则返回 null。
 */
export function sampleIslandGround(x: number, z: number): number | null {
  let bestY: number | null = null;

  for (const tier of ISLAND_TIERS) {
    const dist = Math.hypot(x - tier.x, z - tier.z);
    if (dist <= tier.radius - 0.35) {
      bestY = bestY === null ? tier.y : Math.max(bestY, tier.y);
    }
  }

  for (const ramp of WALKABLE_RAMPS) {
    const abx = ramp.bx - ramp.ax;
    const abz = ramp.bz - ramp.az;
    const lenSq = abx * abx + abz * abz;
    if (lenSq < 1e-5) continue;
    const t = Math.max(
      0,
      Math.min(1, ((x - ramp.ax) * abx + (z - ramp.az) * abz) / lenSq),
    );
    const px = ramp.ax + abx * t;
    const pz = ramp.az + abz * t;
    if (Math.hypot(x - px, z - pz) <= ramp.halfWidth) {
      const y = ramp.ay + (ramp.by - ramp.ay) * t;
      bestY = bestY === null ? y : Math.max(bestY, y);
    }
  }

  return bestY;
}
