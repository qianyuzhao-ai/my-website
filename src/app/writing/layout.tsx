import type { ReactNode } from "react";

export default function WritingLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-bg text-fg">{children}</div>;
}
