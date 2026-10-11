import { ParallelArtwork } from "@/components/aigc-flow/artwork/parallel-artwork";
import { CaseCard } from "@/components/aigc-flow/primitives";

export function Background() {
  return (
    <div className="case-trio" data-eras>
      <CaseCard className="case-era case-tone-pink">
        <div>
          <p className="case-eyebrow">流程一</p>
          <h3 className="font-serif text-case-title font-semibold">
            多平台订阅
          </h3>
          <p className="text-case-small">
            ChatGPT、Gemini、即梦、Midjourney、可灵各订一份会员，素材在平台、本地和文档之间反复上传下载。
          </p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="原有工具平台">
          {[
            "ChatGPT",
            "Gemini",
            "即梦",
            "Midjourney",
            "可灵",
            "⇅ 协同文档",
          ].map((name) => (
            <li
              key={name}
              className="rounded-full bg-surface px-3 py-1.5 text-caption"
            >
              {name}
            </li>
          ))}
        </ul>
      </CaseCard>
      <CaseCard className="case-era case-tone-yellow">
        <div>
          <p className="case-eyebrow">流程二</p>
          <h3 className="font-serif text-case-title font-semibold">
            统一 API，但只能单发
          </h3>
          <p className="text-case-small">
            公司采购了模型 API，可配套平台一次只能提交一个任务，高频批量做不动。
          </p>
        </div>
        <div className="rounded-[14px] bg-surface p-3.5 text-caption">
          <p className="mb-2">公司生成平台</p>
          <ol className="space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <li
                key={n}
                className="flex items-center gap-2 rounded-lg bg-bg px-2.5 py-1.5 text-[11px]"
              >
                <span>任务 {n}</span>
                <span className="h-1 min-w-4 flex-1 rounded-full bg-border">
                  <span
                    className={`block h-full rounded-full bg-accent ${n === 1 ? "w-3/5" : "w-0"}`}
                  />
                </span>
                <span className="text-fg-muted">
                  {n === 1 ? "生成中" : "排队中"}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </CaseCard>
      <CaseCard className="case-era case-tone-mint">
        <div>
          <p className="case-eyebrow">流程三 · AIGC-FLOW</p>
          <h3 className="font-serif text-case-title font-semibold">
            一张画布，批量并行
          </h3>
          <p className="text-case-small">
            参考素材、提示词和生成步骤放上同一张画布。同一组参考并行出多个结果，结果留在原地，不再下载、上传。
          </p>
        </div>
        <div className="case-parallel" aria-hidden="true">
          <ParallelArtwork />
        </div>
      </CaseCard>
    </div>
  );
}

const options = [
  {
    label: "选项 A",
    title: "继续用公司平台",
    body: "模型和计费已经打通，但只支持单个任务生成，不适合每天高频批量生产。",
    result: "✕ 批量效率上不去",
  },
  {
    label: "选项 B",
    title: "改造开源节点工具",
    body: "面向通用场景。接入团队采购的模型、按团队流程改交互，成本都很高。",
    result: "✕ 难以自定义",
  },
  {
    label: "选项 C · 最终选择",
    title: "自研 AIGC-FLOW",
    body: "每个功能都对应团队日常里的一个具体问题。我和团队在同一条生产线上，当天收到反馈，当天就能改。从需求梳理、设计到开发，由我一手完成。",
    result: "✓ 从需求到交付一手完成",
  },
];

export function WhyBuild() {
  return (
    <div className="case-trio">
      {options.map((option, i) => (
        <CaseCard
          key={option.label}
          className={`case-option ${i === 2 ? "case-tone-mint" : ""}`}
        >
          <div>
            <p className={`case-eyebrow ${i === 2 ? "" : "text-fg-muted"}`}>
              {option.label}
            </p>
            <h3 className="font-serif text-case-title font-semibold">
              {option.title}
            </h3>
            <p className={`text-case-small ${i === 2 ? "" : "text-fg-muted"}`}>
              {option.body}
            </p>
          </div>
          <p className="text-label">{option.result}</p>
        </CaseCard>
      ))}
    </div>
  );
}
