import type { Metadata } from "next";
import { OpenFlowStory } from "@/components/openflow/openflow-story";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";

const description =
  "用 AI Agent 从 0 到 1 打造 12 人团队的 AIGC 无限画布生产工作流平台 OpenFlow：从一线痛点、全栈架构与工程踩坑到团队全员复用的完整项目叙事。";

export const metadata: Metadata = {
  title: `OpenFlow · ${siteConfig.name}`,
  description,
};

export default function OpenFlowPage() {
  return (
    <div className="glass-ambient-bg flex min-h-dvh flex-col text-fg">
      <main id="main" className="flex-1">
        <OpenFlowStory />
      </main>
      <SiteFooter />
    </div>
  );
}
