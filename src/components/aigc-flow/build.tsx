import { CaseCard, CaseLink, CaseSvg } from "@/components/aigc-flow/primitives";

const architecture = [
  ["前端 · Next.js 16", "React Flow 画布 · 静态导出"],
  ["服务端 · Hono", "类型化 RPC · 生成转发"],
  ["共享契约 · Zod", "前后端同一份 schema"],
  ["SQLite · Drizzle", "启动时自动迁移"],
];
const milestones = [
  ["08-30", "项目骨架与画布编辑器", "项目列表、一项目一画布"],
  [
    "08-31",
    "生成工作流打通",
    "上传、图像 / 视频 / 文本节点、连线约束、生成记录",
  ],
  ["09-02", "V1.0 团队内测上线", "@ 引用、节点标记、批量下载"],
  ["09-04", "Electron 桌面端", "内嵌服务与数据库，双平台安装包"],
  ["09-05", "分镜表 + LLM", "双人播客分镜、表演 Prompt、全局记录导出"],
  ["09-30", "多项目标签页", "状态保留、安全关闭、后台生成"],
  ["10-03", "v0.2.0 发布", "性能优化、发布流水线、mac + win 安装包"],
];
const principles = [
  [
    "需求从现场来",
    "我和团队在同一条生产线上。每个功能先问“现在大家怎么做、卡在哪”，再决定做不做、做多少。",
  ],
  [
    "先上线，再分期",
    "上线第 4 天就交付 V1.0 内测。大功能拆成可用的小步，例如节点标记先做三态，再做按标记批量选中。",
  ],
  [
    "发布有纪律",
    "日常开发合入 dev，验证后再发布到 main；打标签才触发打包，安装包实机核对后再发布。",
  ],
  [
    "工具为判断服务",
    "实现阶段借助 AI 编程代理提速，需求定义、交互细节和代码评审由我把关。",
  ],
];

export function Build() {
  return (
    <>
      <div className="case-pair">
        <CaseCard className="case-architecture case-tone-blue">
          <p className="case-eyebrow mb-4">ARCHITECTURE</p>
          <p className="text-case-small">
            Web 和桌面端共用同一套前端和服务端代码。桌面端把 API 服务和 SQLite
            一起打进 Electron，模型密钥只留在服务端。
          </p>
          <div className="case-architecture-diagram">
            <div className="case-architecture-shell">
              <p className="text-caption">Electron 桌面端 · macOS / Windows</p>
              <div className="case-architecture-grid">
                {architecture.map(([title, detail]) => (
                  <div key={title} className="case-architecture-box">
                    <p>{title}</p>
                    <small>{detail}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] leading-4">
              <span>服务端转发 →</span>
              {["图像 / 视频模型", "LLM", "素材上传"].map((name) => (
                <span
                  key={name}
                  className="rounded-md bg-preview-background px-2.5 py-1.5"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </CaseCard>
        <CaseCard className="case-timeline">
          <h3 className="font-serif text-case-title font-semibold">
            35 天的节奏
          </h3>
          <ol>
            {milestones.map(([date, title, detail], i) => (
              <li key={date}>
                <span className="pt-1 font-mono text-caption text-fg-muted">
                  {date}
                </span>
                <CaseSvg
                  name={
                    i === 2 || i === 6 ? "timeline-imgdot1" : "timeline-imgdot"
                  }
                  width={10}
                  height={22}
                />
                <div>
                  <h4 className="text-label font-medium">{title}</h4>
                  <p className="mt-0.5 text-case-small text-fg-muted">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CaseCard>
      </div>
      <div className="case-work">
        {principles.map(([title, body]) => (
          <CaseCard key={title}>
            <h3 className="mb-2 font-serif text-case-title font-semibold">
              {title}
            </h3>
            <p className="text-case-small text-fg-muted">{body}</p>
          </CaseCard>
        ))}
      </div>
    </>
  );
}

export function NextSteps() {
  return (
    <div className="case-pair case-next">
      <CaseCard>
        <p className="case-eyebrow mb-3 text-fg-muted">NEXT</p>
        <h3 className="mb-3 font-serif text-case-title font-semibold">
          下一步
        </h3>
        <p className="text-case-small text-fg-muted">
          分镜表证明了“为一个具体拍摄格式定制节点”的价值，接下来想把这个思路扩展到更多固定格式的内容。工程上，macOS
          安装包要接入开发者签名与公证，Windows 端还需要更多实机验证。
        </p>
      </CaseCard>
      <CaseCard className="case-tone-pink">
        <h3 className="case-tagline font-serif font-bold">想聊聊这个项目？</h3>
        <p className="mt-3 text-case-small">
          欢迎交流 AIGC 工具、节点式交互和产品落地。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CaseLink href="/?category=projects">All projects</CaseLink>
        </div>
      </CaseCard>
    </div>
  );
}
