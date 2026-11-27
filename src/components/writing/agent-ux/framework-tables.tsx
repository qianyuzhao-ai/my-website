"use client";

import type { CSSProperties } from "react";
import { useLocale } from "@/components/site/locale-provider";
import { slugifyHeading } from "@/lib/heading-slug";

type MainLineRow = {
  phaseZh: string;
  phaseEn: string;
  headingZh: string;
  headingEn: string;
  problemZh: string;
  problemEn: string;
  topicsZh: string;
  topicsEn: string;
};

const MAIN_LINE_ROWS: MainLineRow[] = [
  {
    phaseZh: "任务前",
    phaseEn: "Before",
    headingZh: "01 能力发现与入口（Discoverability & Entry）",
    headingEn: "01 Discoverability & Entry",
    problemZh: "不知道有这个能力；分不清何时该用",
    problemEn: "Unaware of agent capability or when to invoke it",
    topicsZh:
      "入口位置与层级；能力边界说明；普通对话与任务模式的切换或自动分流（Routing）",
    topicsEn:
      "Entry placement; capability boundaries; automatic Routing between Chat & Task mode",
  },
  {
    phaseZh: "任务前",
    phaseEn: "Before",
    headingZh: "02 意图表达与上下文（Intent & Context）",
    headingEn: "02 Intent & Context",
    problemZh: "冷启动（Cold Start）困难；意图模糊；提示词门槛高",
    problemEn: "Cold-start paralysis; vague intent; prompt-writing barrier",
    topicsZh:
      "引导式输入；示例任务；结构化输入；附件与数据源接入；意图澄清（Clarification）",
    topicsEn:
      "Guided inputs; starter templates; structured slots; connected sources; Clarification",
  },
  {
    phaseZh: "任务前",
    phaseEn: "Before",
    headingZh: "03 预期对齐（Expectation Alignment）",
    headingEn: "03 Expectation Alignment",
    problemZh: "预期错位，试错成本高；被问太多嫌烦",
    problemEn: "Misaligned expectations vs. annoying over-questioning",
    topicsZh:
      "是否追问的判断标准（复杂度、偏离代价、可逆性）；计划预览与可编辑；默认值与超时自动执行",
    topicsEn:
      "Clarification threshold (complexity, cost, reversibility); editable plan preview; countdown auto-start",
  },
  {
    phaseZh: "任务中",
    phaseEn: "During",
    headingZh: "04 执行透明度（Execution Transparency）",
    headingEn: "04 Execution Transparency",
    problemZh: "系统状态不可见；等待焦虑",
    problemEn: "Opaque spinner; waiting anxiety",
    topicsZh:
      "进度反馈；推理过程展示（Reasoning Trace）；工具调用可视化；渐进式披露（Progressive Disclosure）",
    topicsEn:
      "Step progress; plain-language Reasoning Trace; tool visualization; Progressive Disclosure",
  },
  {
    phaseZh: "任务中",
    phaseEn: "During",
    headingZh: "05 人机协同与授权（Human-in-the-Loop）",
    headingEn: "05 Human-in-the-Loop",
    problemZh: "控制感缺失；确认疲劳（Confirmation Fatigue）",
    problemEn: "Loss of control vs. Confirmation Fatigue",
    topicsZh:
      "自主性分级（Levels of Autonomy）；人工确认节点；中断与接管（Interrupt & Takeover）；按风险分级授权",
    topicsEn: "Levels of Autonomy; risk-tiered approvals; Interrupt & Takeover",
  },
  {
    phaseZh: "任务中",
    phaseEn: "During",
    headingZh: "06 异步与长任务（Async & Long-running Tasks）",
    headingEn: "06 Async & Long-running Tasks",
    problemZh: "任务太久，人已离开；多个任务同时跑管不过来",
    problemEn: "Tasks outlast attention span; juggling parallel runs",
    topicsZh: "后台执行；任务中心；完成与卡点通知；多任务并行管理；跨设备接续",
    topicsEn:
      "Background execution; Task Center; completion & blocker alerts; cross-device resume",
  },
  {
    phaseZh: "任务中",
    phaseEn: "During",
    headingZh: "07 容错与恢复（Error Handling & Recovery）",
    headingEn: "07 Error Handling & Recovery",
    problemZh: "错误归因不清；任务不可恢复",
    problemEn: "Unclear failure attribution; forced restart from zero",
    topicsZh:
      "异常分类；降级策略（Graceful Degradation）；断点续做（Checkpoint Resume）；回滚；重试机制",
    topicsEn:
      "Error taxonomy; Graceful Degradation; Checkpoint Resume; rollback & retry",
  },
  {
    phaseZh: "任务后",
    phaseEn: "After",
    headingZh: "08 结果交付与可验证（Delivery & Verifiability）",
    headingEn: "08 Delivery & Verifiability",
    problemZh: "无法判断结果可信度；产物要跳到别处才能用",
    problemEn: "Cannot verify claims; output trapped in chat bubbles",
    topicsZh:
      "产物工作区（Artifact / Canvas）；引用溯源（Citation）；差异对比（Diff）；导出与分享",
    topicsEn:
      "Artifact workspace; inline Citations; Diff highlights; direct export & sharing",
  },
  {
    phaseZh: "任务后",
    phaseEn: "After",
    headingZh: "09 迭代编辑（Iterative Refinement）",
    headingEn: "09 Iterative Refinement",
    problemZh: "局部修改触发整体重生成",
    problemEn: "Small tweak rewrites the entire output",
    topicsZh: "局部编辑（Targeted Edit）；人工直接编辑与 AI 修改并存；版本管理",
    topicsEn:
      "Targeted Edit; hybrid manual + AI editing; version history & rollback",
  },
  {
    phaseZh: "任务后",
    phaseEn: "After",
    headingZh: "10 反馈与沉淀（Feedback & Reuse）",
    headingEn: "10 Feedback & Reuse",
    problemZh: "好结果没法复用；不满意无处说",
    problemEn: "Great workflows can’t be reused; dislikes lack context",
    topicsZh: "点赞点踩与原因收集；存为模板或技能（Skill）；一键复用上次任务",
    topicsEn:
      "Reason-capture feedback; save as reusable Skill / template; one-click replay",
  },
  {
    phaseZh: "长期",
    phaseEn: "Long-term",
    headingZh: "11 记忆与个性化（Memory & Personalization）",
    headingEn: "11 Memory & Personalization",
    problemZh: "每次都要重新交代；不知道它记了什么",
    problemEn: "Repeating preferences vs. feeling secretly tracked",
    topicsZh: "长期记忆；记忆可见、可改、可删；偏好设置；个性化总开关",
    topicsEn:
      "Long-term memory; inspectable, editable & deletable entries; master toggle",
  },
  {
    phaseZh: "长期",
    phaseEn: "Long-term",
    headingZh: "12 主动服务（Proactive Assistance）",
    headingEn: "12 Proactive Assistance",
    problemZh: "要自己想起来才会用；被打扰",
    problemEn: "Forgetting to ask vs. getting spammed",
    topicsZh: "定时任务；事件触发提醒；主动建议的时机与频率控制；免打扰",
    topicsEn:
      "Scheduled & event-triggered nudges; right timing; user-controlled frequency & DND",
  },
];

type CrossCuttingRow = {
  headingZh: string;
  headingEn: string;
  questionZh: string;
  questionEn: string;
  termsZh: string;
  termsEn: string;
};

const CROSS_CUTTING_ROWS: CrossCuttingRow[] = [
  {
    headingZh: "A 安全与隐私边界（Safety & Privacy）",
    headingEn: "A Safety & Privacy",
    questionZh: "AI 能看什么、能动什么；涉及花钱和删除怎么办",
    questionEn:
      "What can AI read or touch, and how are spending and deletion guarded?",
    termsZh: "权限继承；数据授权（Consent）；敏感操作保护；不可逆操作二次确认",
    termsEn:
      "Scoped permissions; explicit Consent; sensitive-action guards; two-step confirmation",
  },
  {
    headingZh: "B 多 Agent 与生态（Multi-Agent & Ecosystem）",
    headingEn: "B Multi-Agent & Ecosystem",
    questionZh: "主助手和第三方智能体怎么分工、怎么交接",
    questionEn:
      "How do primary and specialist agents divide work and transfer context?",
    termsZh: "智能体广场；人设与服务边界；任务交接（Handoff）；体验一致性规范",
    termsEn:
      "Agent directory; clear boundaries; transparent Handoff; consistent UI patterns",
  },
  {
    headingZh: "C 人设与语气（Persona & Tone）",
    headingEn: "C Persona & Tone",
    questionZh: "它像什么角色；多像人才合适",
    questionEn:
      "What role should it play, and how human should it sound — especially on errors?",
    termsZh: "角色定位；语气规范；拟人化程度；出错时的表达方式",
    termsEn:
      "Role framing; tone guidelines; anthropomorphism calibration; error-state copy",
  },
  {
    headingZh: "D 多模态与多端（Multimodal & Cross-device）",
    headingEn: "D Multimodal & Cross-device",
    questionZh: "语音、图片、手机、电脑上体验怎么保持一致",
    questionEn:
      "How does one continuous task reshape cleanly across phone, desktop, and voice?",
    termsZh: "语音交互；多模态输入输出；端侧适配；生成式界面（Generative UI）",
    termsEn: "Voice UX; multimodal I/O; form-factor adaptation; Generative UI",
  },
  {
    headingZh: "E 成本与配额（Cost & Quota）",
    headingEn: "E Cost & Quota",
    questionZh: "能力很贵时，怎么让用户用得到又不滥用",
    questionEn:
      "When agent runs are costly, how do you stay transparent without silent throttling?",
    termsZh: "额度机制；排队；付费分层；简单任务自动降级到便宜方案",
    termsEn:
      "Visible quotas; queuing; tiered plans; automatic Quick-mode routing",
  },
  {
    headingZh: "F 体验度量（Experience Metrics）",
    headingEn: "F Experience Metrics",
    questionZh: "怎么知道做得好不好",
    questionEn:
      "How do you measure whether a design change truly improved agent quality?",
    termsZh: "结果、过程、信任、容错、价值五层指标；评测集；坏例复盘",
    termsEn:
      "5-layer metrics (Outcome, Process, Trust, Recovery, Value); eval suites; failure review",
  },
];

/** 主线：12 个环节响应式矩阵（点击条目可直达正文对应章节） */
export function MainLineTable() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const colVars = {
    "--col-2": isEn ? '"Phase"' : '"阶段"',
    "--col-3": isEn ? '"User friction"' : '"用户侧问题"',
    "--col-4": isEn ? '"Design topics & terms"' : '"设计议题与常用术语"',
  } as CSSProperties;

  return (
    <section
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable table region requires keyboard focus per modern-web-guidance responsive-table
      tabIndex={0}
      aria-labelledby="agent-ux-mainline-caption"
      className="agent-ux-table-wrap my-3 border border-border bg-bg"
    >
      <table style={colVars} className="agent-ux-table text-left text-caption">
        <caption
          id="agent-ux-mainline-caption"
          className="border-b border-border bg-surface px-4 py-3 text-left font-mono text-micro font-medium tracking-wider text-fg-muted uppercase"
        >
          {isEn
            ? "MATRIX 01 // 12 LONGITUDINAL WORKFLOW STEPS (CLICK ANY ROW TO JUMP)"
            : "总览矩阵 01 // 主线 12 个环节（点击环节标题可直达对应小节）"}
        </caption>
        <thead>
          <tr className="border-b border-border bg-surface font-mono text-micro text-fg-muted uppercase">
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "Step" : "环节"}
            </th>
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "Phase" : "阶段"}
            </th>
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "User friction" : "用户侧问题"}
            </th>
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "Design topics & terms" : "设计议题与常用术语"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {MAIN_LINE_ROWS.map((row) => {
            const heading = isEn ? row.headingEn : row.headingZh;
            const href = `#${slugifyHeading(heading)}`;
            return (
              <tr
                key={row.headingEn}
                className="align-top transition-colors hover:bg-surface/60"
              >
                <th
                  scope="row"
                  className="border-b border-border px-3.5 py-3 font-medium text-fg"
                >
                  <a
                    href={href}
                    className="underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-fg"
                  >
                    {heading}
                  </a>
                </th>
                <td className="border-b border-border px-3.5 py-3 font-mono text-micro whitespace-nowrap text-fg-muted">
                  {isEn ? row.phaseEn : row.phaseZh}
                </td>
                <td className="border-b border-border px-3.5 py-3 leading-relaxed text-fg-secondary">
                  {isEn ? row.problemEn : row.problemZh}
                </td>
                <td className="border-b border-border px-3.5 py-3 leading-relaxed text-fg-secondary">
                  {isEn ? row.topicsEn : row.topicsZh}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

/** 横向：6 个贯穿全程的议题响应式矩阵 */
export function CrossCuttingTable() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const colVars = {
    "--col-2": isEn ? '"Core question"' : '"要回答的问题"',
    "--col-3": isEn ? '"Common terms"' : '"常用术语"',
  } as CSSProperties;

  return (
    <section
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable table region requires keyboard focus per modern-web-guidance responsive-table
      tabIndex={0}
      aria-labelledby="agent-ux-crosscutting-caption"
      className="agent-ux-table-wrap my-3 border border-border bg-bg"
    >
      <table style={colVars} className="agent-ux-table text-left text-caption">
        <caption
          id="agent-ux-crosscutting-caption"
          className="border-b border-border bg-surface px-4 py-3 text-left font-mono text-micro font-medium tracking-wider text-fg-muted uppercase"
        >
          {isEn
            ? "MATRIX 02 // 6 CROSS-CUTTING TOPICS (CLICK ANY ROW TO JUMP)"
            : "总览矩阵 02 // 横向 6 个贯穿议题（点击议题可直达对应小节）"}
        </caption>
        <thead>
          <tr className="border-b border-border bg-surface font-mono text-micro text-fg-muted uppercase">
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "Topic" : "议题"}
            </th>
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "Core question" : "要回答的问题"}
            </th>
            <th
              scope="col"
              className="border-b border-border px-3.5 py-2.5 font-medium"
            >
              {isEn ? "Common terms" : "常用术语"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {CROSS_CUTTING_ROWS.map((row) => {
            const heading = isEn ? row.headingEn : row.headingZh;
            const href = `#${slugifyHeading(heading)}`;
            return (
              <tr
                key={row.headingEn}
                className="align-top transition-colors hover:bg-surface/60"
              >
                <th
                  scope="row"
                  className="border-b border-border px-3.5 py-3 font-medium text-fg"
                >
                  <a
                    href={href}
                    className="underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-fg"
                  >
                    {heading}
                  </a>
                </th>
                <td className="border-b border-border px-3.5 py-3 leading-relaxed text-fg-secondary">
                  {isEn ? row.questionEn : row.questionZh}
                </td>
                <td className="border-b border-border px-3.5 py-3 leading-relaxed text-fg-secondary">
                  {isEn ? row.termsEn : row.termsZh}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
