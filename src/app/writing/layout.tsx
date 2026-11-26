import type { ReactNode } from "react";

/**
 * 写作专栏（/writing 与 /writing/[slug]）统一使用全站 Liquid Glass 清透毛玻璃体系，
 * 顶部叠加柔和晴空与薄荷光晕层，突出半透明玻璃卡片的通透质感。
 */
export default function WritingLayout({ children }: { children: ReactNode }) {
  return <div className="glass-ambient-bg min-h-dvh text-fg">{children}</div>;
}
