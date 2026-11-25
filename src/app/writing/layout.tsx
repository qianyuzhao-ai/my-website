import type { ReactNode } from "react";

/**
 * 写作专栏独立视觉作用域：
 * 仅在 /writing 列表与文章详情页启用「画廊纯白 × 国际钴蓝」瑞士国际主义配色，
 * 避免影响首页 3D 空岛与其他页面的全局语义色。
 */
export default function WritingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="writing-scope min-h-dvh bg-bg text-fg">{children}</div>
  );
}
