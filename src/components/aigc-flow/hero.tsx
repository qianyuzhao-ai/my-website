import { HeroArtwork } from "@/components/aigc-flow/artwork/hero-artwork";
import {
  ArtFrame,
  CaseCard,
  CaseLink,
} from "@/components/aigc-flow/primitives";
import { caseLinks } from "@/lib/aigc-flow";

export function CaseHero() {
  return (
    <section className="case-pair case-hero" aria-labelledby="project-title">
      <CaseCard className="case-intro">
        <div className="flex flex-col gap-4">
          <p className="case-eyebrow text-fg-muted">SELECTED WORK · 01</p>
          <h1 id="project-title" className="case-display font-serif font-bold">
            AIGC-FLOW
          </h1>
          <p className="case-tagline font-serif font-bold">
            把数字人视频生产
            <br />
            搬上一张画布
          </p>
          <p className="leading-7 text-fg-muted">
            一个节点式 AIGC
            创作工具。参考素材、提示词、图像和视频生成都是画布上的节点，连线就是参考关系，一组参考可以批量并行出结果。
          </p>
        </div>
        <div className="flex flex-col items-start gap-5">
          <dl className="case-facts">
            {[
              ["ROLE", "产品设计 · 全栈开发"],
              ["TIMELINE", "35 天 · 0 → v0.2.0"],
              ["PLATFORM", "Web · macOS · Windows"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="case-eyebrow mb-1 text-fg-muted">{label}</dt>
                <dd className="text-case-small">{value}</dd>
              </div>
            ))}
          </dl>
          <CaseLink href={caseLinks.github}>GitHub</CaseLink>
        </div>
      </CaseCard>
      <ArtFrame
        hero
        tone="blue"
        label="AIGC-FLOW 画布：参考图和场景文本连向图像生成节点，并行产生四个结果，再连接首尾帧视频生成。"
      >
        <HeroArtwork />
      </ArtFrame>
    </section>
  );
}
