"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MoonIcon,
  SparklesIcon,
  SunIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "@/components/home/icons";
import { ShrineModal } from "@/components/island/shrine-panels";
import {
  type IslandEngineHandle,
  SkyIslandCanvas,
} from "@/components/island/sky-island-canvas";
import { SkyLoader } from "@/components/island/sky-loader";
import { openConnectDialog } from "@/components/site/connect-sheet";
import type { Post } from "@/lib/post-shared";
import { siteConfig } from "@/lib/site-config";
import { skyAudio } from "@/lib/sky-audio";
import { ISLAND_SHRINES, type ShrineId } from "@/lib/sky-island-config";

type DirectionKey = "up" | "down" | "left" | "right";

export function SkyIslandExperience({ posts }: { posts: Post[] }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [nearShrine, setNearShrine] = useState<ShrineId | null>(null);
  const [activeModal, setActiveModal] = useState<
    "writing" | "works" | "about" | null
  >(null);
  const [vistaMode, setVistaMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const potIndexRef = useRef(0);
  const [pressedDirs, setPressedDirs] = useState<Record<DirectionKey, boolean>>(
    {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  );

  const engineRef = useRef<IslandEngineHandle | null>(null);
  const markerRefs = useRef<Record<ShrineId, HTMLButtonElement | null>>({
    writing: null,
    works: null,
    connect: null,
    time: null,
    pot: null,
    about: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastText(msg);
    window.setTimeout(() => {
      setToastText((curr) => (curr === msg ? null : curr));
    }, 3000);
  }, []);

  // 监听复制邮箱事件，同步放飞南崖码头的左纳乌滑翔翼！
  useEffect(() => {
    const onGlider = () => {
      engineRef.current?.launchGlider();
      showToast("🕊 传信左纳乌滑翔翼已载着信号飞向云海！");
    };
    window.addEventListener("qianyu:glider-launch", onGlider);
    return () => window.removeEventListener("qianyu:glider-launch", onGlider);
  }, [showToast]);

  const isNight =
    mounted && resolvedTheme ? resolvedTheme === "dark" : undefined;

  const toggleDayNight = useCallback(() => {
    const nextDark = resolvedTheme !== "dark";
    setTheme(nextDark ? "dark" : "light");
    skyAudio.playShrineOpen();
    showToast(
      nextDark
        ? "☾ 时之日晷：空岛入夜 · 随身提灯与萤火虫已点亮"
        : "☀ 时之日晷：晨光破晓 · 暖阳洒满黄金银杏林",
    );
  }, [resolvedTheme, setTheme, showToast]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      skyAudio.muted = next;
      if (!next) skyAudio.playCookingChime();
      return next;
    });
  }, []);

  const handleActivateShrine = useCallback(
    (id: ShrineId) => {
      if (id === "writing") {
        skyAudio.playShrineOpen();
        setActiveModal("writing");
      } else if (id === "works") {
        skyAudio.playShrineOpen();
        setActiveModal("works");
      } else if (id === "about") {
        skyAudio.playShrineOpen();
        setActiveModal("about");
      } else if (id === "connect") {
        engineRef.current?.launchGlider();
        openConnectDialog();
      } else if (id === "time") {
        toggleDayNight();
      } else if (id === "pot") {
        skyAudio.playCookingChime();
        const quote =
          siteConfig.potQuotes[
            potIndexRef.current % siteConfig.potQuotes.length
          ];
        potIndexRef.current += 1;
        showToast(quote);
      }
    },
    [toggleDayNight, showToast],
  );

  function handleQuickVisit(id: ShrineId) {
    engineRef.current?.teleportToShrine(id);
    handleActivateShrine(id);
  }

  useEffect(() => {
    let x = 0;
    let y = 0;
    if (pressedDirs.left) x -= 1;
    if (pressedDirs.right) x += 1;
    if (pressedDirs.up) y -= 1;
    if (pressedDirs.down) y += 1;
    engineRef.current?.setJoystick(x, y);
  }, [pressedDirs]);

  function setDir(dir: DirectionKey, active: boolean) {
    setPressedDirs((prev) =>
      prev[dir] === active ? prev : { ...prev, [dir]: active },
    );
  }

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setEntered(true);
  }, []);

  const currentShrineMeta = nearShrine
    ? ISLAND_SHRINES.find((s) => s.id === nearShrine)
    : null;

  return (
    <main
      id="main"
      className="relative h-dvh w-full overflow-hidden select-none"
    >
      <h1 className="sr-only">
        {siteConfig.name} 的塞尔达空岛风 3D 个人网站 —
        操控英杰斗篷小旅人探索博客、作品与彩蛋飞岛
      </h1>

      {/* 开屏左纳乌符文拉幕加载 */}
      <SkyLoader sceneReady={sceneReady} onComplete={handleLoaderComplete} />

      {/* 3D 空岛 v2 引擎 */}
      <SkyIslandCanvas
        isNight={isNight}
        paused={activeModal !== null}
        entered={entered}
        vistaMode={vistaMode}
        engineRef={engineRef}
        markerRefs={markerRefs}
        onReady={handleSceneReady}
        onNearShrineChange={setNearShrine}
        onActivateShrine={handleActivateShrine}
        onEventToast={showToast}
      />

      {/* 场景内实时投影的 6 枚明显交互路标 */}
      <section
        aria-label="空岛地标交互路标"
        className="pointer-events-none fixed inset-0 z-20"
      >
        {ISLAND_SHRINES.map((sh) => {
          const isNear = nearShrine === sh.id;
          return (
            <button
              key={sh.id}
              ref={(el) => {
                markerRefs.current[sh.id] = el;
              }}
              type="button"
              onClick={() => {
                if (isNear) {
                  handleActivateShrine(sh.id);
                } else {
                  handleQuickVisit(sh.id);
                }
              }}
              style={{ opacity: 0 }}
              className={`fixed top-0 left-0 flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-micro font-medium whitespace-nowrap shadow-lg backdrop-blur-md transition-colors ${
                isNear
                  ? "border-[#34f5a6] bg-[#0d261f]/95 text-[#34f5a6] ring-2 ring-[#34f5a6]/45"
                  : sh.id === "about"
                    ? "border-[#e6b64c]/70 bg-surface/90 text-fg hover:border-accent"
                    : "border-border bg-surface/88 text-fg hover:border-accent"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${
                  isNear
                    ? "bg-[#34f5a6] signal-dot"
                    : sh.id === "about"
                      ? "bg-[#e6b64c]"
                      : "bg-accent"
                }`}
              />
              <span>{sh.title}</span>
              {isNear ? <span className="font-bold">[点击开启]</span> : null}
            </button>
          );
        })}
      </section>

      {/* 顶部快捷栏（含空灵音效静音开关与昼夜切换，严格适配 320px 窄屏） */}
      <header
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
        }}
        className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-2 sm:px-5"
      >
        <nav
          aria-label="空岛快捷传送与设置"
          className="pointer-events-auto flex max-w-full items-center gap-0.5 rounded-full border border-border bg-surface/86 p-1 shadow-lg backdrop-blur-md sm:gap-1.5 sm:px-2"
        >
          <span className="hidden items-center gap-1.5 px-2.5 font-serif text-label font-bold text-fg md:inline-flex">
            <span className="size-2 rounded-full bg-signal signal-dot" />
            {siteConfig.name}
          </span>

          <button
            type="button"
            onClick={() => handleQuickVisit("writing")}
            className="inline-flex min-h-11 items-center rounded-full px-2 text-caption font-medium text-fg transition-colors hover:bg-surface-elevated sm:px-3.5 sm:text-label"
          >
            手稿
          </button>

          <button
            type="button"
            onClick={() => handleQuickVisit("works")}
            className="inline-flex min-h-11 items-center rounded-full px-2 text-caption font-medium text-fg transition-colors hover:bg-surface-elevated sm:px-3.5 sm:text-label"
          >
            造物
          </button>

          <button
            type="button"
            onClick={() => handleQuickVisit("connect")}
            className="inline-flex min-h-11 items-center rounded-full px-2 text-caption font-medium text-fg transition-colors hover:bg-surface-elevated sm:px-3.5 sm:text-label"
          >
            联系
          </button>

          <Link
            href="/writing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface-elevated/80 px-2 font-mono text-micro font-medium text-fg transition-colors hover:border-accent hover:text-accent sm:px-3 sm:text-caption"
          >
            博客↗
          </Link>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "开启空岛音效" : "静音空岛音效"}
            aria-pressed={!muted}
            className="inline-flex min-h-11 min-w-10 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface-elevated sm:min-w-11"
          >
            {muted ? (
              <VolumeOffIcon className="size-4.5 text-fg-muted" />
            ) : (
              <VolumeOnIcon className="size-4.5 text-signal" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleDayNight}
            aria-label="切换空岛昼夜与全站主题"
            className="inline-flex min-h-11 min-w-10 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface-elevated sm:min-w-11"
          >
            <SunIcon className="size-4.5 dark:hidden" />
            <MoonIcon className="hidden size-4.5 dark:block" />
          </button>
        </nav>
      </header>

      {/* 动态事件与料理锅气泡提示 */}
      {toastText ? (
        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 top-20 z-30 flex justify-center px-4"
        >
          <div className="max-w-md rounded-full border border-[#34f5a6]/55 bg-[#0d1518]/92 px-4 py-2 text-center font-mono text-caption text-[#f3f1ec] shadow-lg backdrop-blur-md">
            {toastText}
          </div>
        </div>
      ) : null}

      {/* 底部操控区：左下角十字方向键 + 全景键，右下角动态符文动作键 + 跳跃键 */}
      <div
        style={{
          paddingBottom: "max(0.85rem, env(safe-area-inset-bottom, 0px))",
        }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 px-3 sm:px-6"
      >
        <fieldset
          aria-label="角色移动方向键"
          className="pointer-events-auto grid grid-cols-3 gap-1 rounded-2xl border border-border bg-surface/84 p-1.5 shadow-lg backdrop-blur-md touch-none"
        >
          <span />
          <DpadButton
            label="向上前进"
            symbol="▲"
            active={pressedDirs.up}
            onPress={(v) => setDir("up", v)}
          />
          <span />
          <DpadButton
            label="向左移动"
            symbol="◀"
            active={pressedDirs.left}
            onPress={(v) => setDir("left", v)}
          />
          <button
            type="button"
            onClick={() => {
              setVistaMode((prev) => {
                const next = !prev;
                showToast(
                  next
                    ? "🏔 全景机位：俯瞰三层主岛、山巅瀑布与云海飞岛"
                    : "🧭 跟随机位：镜头回到英杰小旅人身旁",
                );
                return next;
              });
            }}
            aria-label={vistaMode ? "恢复跟随镜头" : "切换群岛全景"}
            aria-pressed={vistaMode}
            className={`flex size-11 items-center justify-center rounded-xl border font-mono text-micro font-semibold transition-colors ${
              vistaMode
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface-elevated text-fg-muted hover:text-fg"
            }`}
          >
            全景
          </button>
          <DpadButton
            label="向右移动"
            symbol="▶"
            active={pressedDirs.right}
            onPress={(v) => setDir("right", v)}
          />
          <span />
          <DpadButton
            label="向下移动"
            symbol="▼"
            active={pressedDirs.down}
            onPress={(v) => setDir("down", v)}
          />
          <span />
        </fieldset>

        <p className="hidden rounded-full border border-border bg-surface/82 px-4 py-2 font-mono text-micro text-fg-muted backdrop-blur-md xl:block">
          WASD / 点击草地寻路 · 西崖乘风阵飞往守岛人纪念碑 ·
          翻转中岛日月晷切换昼夜
        </p>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          {currentShrineMeta ? (
            <button
              type="button"
              onClick={() => handleActivateShrine(currentShrineMeta.id)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#34f5a6] bg-[#0d261f]/95 px-4 font-mono text-caption font-semibold text-[#34f5a6] shadow-lg backdrop-blur-md transition-transform active:scale-95 sm:px-5"
            >
              <SparklesIcon className="size-4 shrink-0" />
              <span>{currentShrineMeta.actionLabel}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => engineRef.current?.jump()}
            aria-label="控制小旅人跳跃"
            className="inline-flex min-h-12 min-w-16 items-center justify-center gap-1.5 rounded-full border border-border bg-surface/88 px-4 font-mono text-caption font-semibold text-fg shadow-lg backdrop-blur-md transition-transform active:scale-95"
          >
            <span>跳跃</span>
          </button>
        </div>
      </div>

      {/* 手稿石碑 / 造物星盘 / 彩蛋飞岛私房碑模态面板 */}
      <ShrineModal
        activePanel={activeModal}
        posts={posts}
        onClose={() => setActiveModal(null)}
      />
    </main>
  );
}

function DpadButton({
  label,
  symbol,
  active,
  onPress,
}: {
  label: string;
  symbol: string;
  active: boolean;
  onPress: (pressed: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onPress(true);
      }}
      onPointerUp={() => onPress(false)}
      onPointerCancel={() => onPress(false)}
      onLostPointerCapture={() => onPress(false)}
      className={`flex size-11 items-center justify-center rounded-xl border font-mono text-caption transition-colors touch-none ${
        active
          ? "border-[#34f5a6] bg-[#0d261f] text-[#34f5a6]"
          : "border-border bg-surface text-fg hover:bg-surface-elevated"
      }`}
    >
      {symbol}
    </button>
  );
}
