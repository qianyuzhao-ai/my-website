// 王国之泪风「三层阶梯主岛 + 悬空彩蛋小飞岛（Sky Archipelago v2）」世界坐标与地形碰撞系统。
// 与 public/model/sky-island-v2.blend（Three.js Y-up 坐标系）精确对齐。

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
 * 三层阶梯主岛 + 左前景悬空彩蛋小飞岛（已同步最新 .blend 拉开后的南北纵深布局）
 */
export const ISLAND_TIERS: IslandTier[] = [
  {
    id: "low-plaza",
    name: "觉醒石阵与风车前崖（低层）",
    x: 0.18,
    y: 0.0,
    z: 2.62,
    radius: 6.4,
    tint: "golden",
  },
  {
    id: "mid-grove",
    name: "黄金银杏古树林（中层）",
    x: -6.35,
    y: 1.35,
    z: -12.15,
    radius: 5.2,
    tint: "golden",
  },
  {
    id: "high-sanctum",
    name: "左纳乌造物山巅（高层）",
    x: 8.83,
    y: 2.85,
    z: -12.69,
    radius: 4.9,
    tint: "highland",
  },
  {
    id: "secret-islet",
    name: "云海观景彩蛋飞岛",
    x: -13.21,
    y: 2.2,
    z: 5.39,
    radius: 3.7,
    tint: "secret",
  },
];

/** 连接低层 → 中层、中层 → 高层、以及低层直通高层的三条拉长石阶与石桥 */
export const WALKABLE_RAMPS: WalkableRamp[] = [
  // 低岛至中岛 · 10 级石阶（两端略向岛内延展确保零接缝）
  {
    id: "ramp-low-to-mid",
    ax: -2.05,
    ay: 0.0,
    az: -2.25,
    bx: -4.55,
    by: 1.35,
    bz: -8.15,
    halfWidth: 1.4,
  },
  // 中岛至高岛 · 11 块石桥
  {
    id: "bridge-mid-to-high",
    ax: -2.1,
    ay: 1.35,
    az: -12.33,
    bx: 4.75,
    by: 2.85,
    bz: -12.53,
    halfWidth: 1.3,
  },
  // 低岛至高岛 · 13 级盘山石阶
  {
    id: "ramp-low-to-high",
    ax: 2.75,
    ay: 0.0,
    az: -2.15,
    bx: 6.78,
    by: 2.85,
    bz: -9.15,
    halfWidth: 1.25,
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

/** 山巅清泉、溪流与东崖瀑布关键坐标（同步最新 .blend 高岛位置） */
export const WATERFALL_PATH = {
  pondCenter: [6.64, 2.91, -13.16] as [number, number, number],
  streamCenter: [10.13, 2.91, -11.02] as [number, number, number],
  fallEdge: [13.59, -1.0, -9.55] as [number, number, number],
  mistCenter: [14.18, -4.68, -9.08] as [number, number, number],
} as const;

/** 六处可交互神庙/石碑/彩蛋点（精确对应 .blend 中的地标光环坐标） */
export const ISLAND_SHRINES: ShrineConfig[] = [
  {
    id: "writing",
    code: "01",
    title: "手稿石碑 · Writing",
    subtitle: "中层银杏林 · 一线实战复盘与工程长文",
    actionLabel: "阅读手稿石碑",
    position: [-7.26, 1.35, -13.72],
    triggerRadius: 2.6,
  },
  {
    id: "works",
    code: "02",
    title: "造物星盘 · Works",
    subtitle: "高层山巅 · Coding × AIGC 作品与实验台",
    actionLabel: "开启造物星盘",
    position: [9.35, 2.85, -13.64],
    triggerRadius: 2.8,
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
    position: [-3.46, 1.35, -15.32],
    triggerRadius: 2.3,
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
    position: [-13.8, 2.2, 5.9],
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
    if (dist <= tier.radius - 0.32) {
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
