import type { Metadata } from "next";
import { ConnectArtwork } from "@/components/aigc-flow/artwork/connect-artwork";
import { FrameworkArtwork } from "@/components/aigc-flow/artwork/framework-artwork";
import { PromptArtwork } from "@/components/aigc-flow/artwork/prompt-artwork";
import { StoryboardArtwork } from "@/components/aigc-flow/artwork/storyboard-artwork";
import { TabsArtwork } from "@/components/aigc-flow/artwork/tabs-artwork";
import { Background, WhyBuild } from "@/components/aigc-flow/background";
import { Build, NextSteps } from "@/components/aigc-flow/build";
import { CaseHeader } from "@/components/aigc-flow/case-header";
import { CaseScene } from "@/components/aigc-flow/case-scene";
import { CaseHero } from "@/components/aigc-flow/hero";
import { PageMotion } from "@/components/aigc-flow/page-motion";
import { PolishCarousel } from "@/components/aigc-flow/polish-carousel";
import {
  ArtFrame,
  Metrics,
  SectionHead,
} from "@/components/aigc-flow/primitives";
import { HomeFooter } from "@/components/home/home-footer";
import { keyMetrics, resultMetrics, scenes, sections } from "@/lib/aigc-flow";
import "./case-study.css";

export const metadata: Metadata = {
  title: "AIGC-FLOW · QianYu",
  description:
    "把数字人视频生产搬上一张画布。AIGC-FLOW 的产品设计、节点交互与从 0 到 v0.2.0 的开发实践。",
};

const demos = [
  {
    kind: "framework",
    tone: "yellow",
    art: <FrameworkArtwork />,
    label: "项目、六种节点、参考连线、结果标记与生成记录，共同构成画布工作流。",
  },
  {
    kind: "connect",
    tone: "pink",
    art: <ConnectArtwork />,
    label:
      "从参考图拖出连线，目标节点高亮，松手落空后弹出节点菜单并自动创建视频节点。",
  },
  {
    kind: "prompt",
    tone: "blue",
    art: <PromptArtwork />,
    label:
      "在提示词中用 @图1 和场景徽章引用画布素材，场景文本从深夜录音棚更新为清晨天台。",
  },
  {
    kind: "storyboard",
    tone: "mint",
    art: <StoryboardArtwork />,
    label:
      "双人播客分镜表：Excel 粘贴、三种机位、4–30 秒校验、表演 Prompt 与只读完整 Prompt。",
  },
  {
    kind: "tabs",
    tone: "yellow",
    art: <TabsArtwork />,
    label:
      "多项目标签保留画布状态、后台完成任务，关闭标签前通过弹窗处理保存失败。",
  },
] as const;

export default function AigcFlowPage() {
  return (
    <PageMotion>
      <a
        href="#case-main"
        className="sr-only z-50 rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        跳转到主要内容
      </a>
      <CaseHeader />
      <main id="case-main" className="case-study">
        <CaseHero />
        <Metrics items={keyMetrics} />
        <section aria-labelledby="background">
          <SectionHead id="background" {...sections[0]} />
          <Background />
        </section>
        <section aria-labelledby="why-build">
          <SectionHead id="why-build" {...sections[1]} />
          <WhyBuild />
        </section>
        {demos.map(({ kind, tone, art, label }, i) => (
          <section key={kind} aria-labelledby={`${kind}-heading`}>
            <SectionHead id={`${kind}-heading`} {...sections[i + 2]} />
            <CaseScene kind={kind} steps={scenes[kind]} reverse={i % 2 === 1}>
              <ArtFrame tone={tone} label={label}>
                {art}
              </ArtFrame>
            </CaseScene>
          </section>
        ))}
        <section aria-labelledby="polish">
          <SectionHead id="polish" {...sections[7]} />
          <PolishCarousel />
        </section>
        <section aria-labelledby="build">
          <SectionHead id="build" {...sections[8]} />
          <Build />
        </section>
        <section aria-labelledby="outcomes">
          <SectionHead id="outcomes" {...sections[9]} />
          <Metrics items={resultMetrics} />
          <NextSteps />
        </section>
      </main>
      <HomeFooter />
    </PageMotion>
  );
}
