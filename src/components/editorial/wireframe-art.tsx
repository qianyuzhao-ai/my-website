// 单色建筑线框 SVG 插图集合：与 Figma 设计稿保持一致，绑定 CSS 变量 --lineart-primary / --lineart-muted，浅深色自动反色。

import type { ComponentProps } from "react";

type ArtProps = ComponentProps<"svg">;

/** 几何 Q 字标（Sidebar 与移动端顶栏共用） */
export function BrandQMark(props: ArtProps) {
  return (
    <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" {...props}>
      <rect
        x="2"
        y="2"
        width="18"
        height="18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12.5 12.5L18.5 18.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** 列表行极简几何分类图标 */
export function CategoryGlyph(props: ArtProps) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" {...props}>
      <rect
        x="2"
        y="2"
        width="10"
        height="10"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M5 7H9M7 5V9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** OpenFlow 等距并发画布线框插图（Hero 主视觉） */
export function OpenFlowIsometricArt(props: ArtProps) {
  return (
    <svg viewBox="0 0 440 300" fill="none" aria-hidden="true" {...props}>
      <path
        d="M40 220L220 120L400 220L220 290L40 220Z"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path
        d="M85 195L265 265M130 170L310 240M175 145L355 215"
        stroke="var(--lineart-muted)"
        strokeWidth="0.75"
        strokeDasharray="3 3"
      />
      <path
        d="M355 195L175 265M310 170L130 240M265 145L85 215"
        stroke="var(--lineart-muted)"
        strokeWidth="0.75"
        strokeDasharray="3 3"
      />
      <path
        d="M120 145L220 90L320 145L220 200L120 145Z"
        stroke="var(--lineart-primary)"
        strokeWidth="1.5"
      />
      <path
        d="M120 145V160L220 215L320 160V145"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <path
        d="M220 200V215"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <path
        d="M155 135L185 118L215 135L185 152L155 135Z"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M155 135V108L185 91L215 108V135"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M185 152V125M155 108L185 125L215 108"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <path
        d="M225 135L255 118L285 135L255 152L225 135Z"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M225 135V96L255 79L285 96V135"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M255 152V113M225 96L255 113L285 96"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <path
        d="M165 62L220 32L275 62L220 92L165 62Z"
        stroke="var(--lineart-primary)"
        strokeWidth="1.4"
      />
      <path
        d="M220 92V125M185 91V73M255 79V73"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <circle cx="120" cy="145" r="3" fill="var(--lineart-primary)" />
      <circle cx="320" cy="145" r="3" fill="var(--lineart-primary)" />
      <circle cx="220" cy="32" r="3" fill="var(--lineart-primary)" />
      <path
        d="M52 54H72M62 44V64"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path
        d="M368 54H388M378 44V64"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path d="M335 90L380 90" stroke="var(--lineart-muted)" strokeWidth="1" />
      <circle
        cx="380"
        cy="90"
        r="2.5"
        stroke="var(--lineart-primary)"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Agent 设计工作流：生成网格 × 判断靶心示意图 */
export function AgentWorkflowArt(props: ArtProps) {
  return (
    <svg viewBox="0 0 360 210" fill="none" aria-hidden="true" {...props}>
      <rect
        x="36"
        y="34"
        width="120"
        height="142"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M36 66H156M36 98H156M36 130H156M76 34V176M116 34V176"
        stroke="var(--lineart-muted)"
        strokeWidth="0.9"
      />
      <path
        d="M156 105H204"
        stroke="var(--lineart-primary)"
        strokeWidth="1.4"
      />
      <path
        d="M196 98L204 105L196 112"
        stroke="var(--lineart-primary)"
        strokeWidth="1.4"
      />
      <circle
        cx="180"
        cy="105"
        r="14"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <rect
        x="204"
        y="34"
        width="120"
        height="142"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <circle
        cx="264"
        cy="105"
        r="36"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <circle
        cx="264"
        cy="105"
        r="18"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path
        d="M264 55V155M214 105H314"
        stroke="var(--lineart-muted)"
        strokeWidth="0.9"
        strokeDasharray="3 3"
      />
      <circle cx="264" cy="105" r="3.5" fill="var(--lineart-primary)" />
    </svg>
  );
}

/** 分镜透视层叠线框插图（Latent Storyboard Engine） */
export function StoryboardGridArt(props: ArtProps) {
  return (
    <svg viewBox="0 0 360 210" fill="none" aria-hidden="true" {...props}>
      <path
        d="M56 150L116 56H220L160 150H56Z"
        stroke="var(--lineart-muted)"
        strokeWidth="1.1"
      />
      <path
        d="M104 156L164 62H268L208 156H104Z"
        stroke="var(--lineart-muted)"
        strokeWidth="1.1"
      />
      <path
        d="M152 162L212 68H316L256 162H152Z"
        stroke="var(--lineart-primary)"
        strokeWidth="1.5"
      />
      <path
        d="M56 150L152 162M116 56L212 68M220 56L316 68"
        stroke="var(--lineart-muted)"
        strokeWidth="0.9"
        strokeDasharray="3 3"
      />
      <path
        d="M196 138L226 92H278L248 138H196Z"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <circle cx="237" cy="115" r="3" fill="var(--lineart-primary)" />
      <path d="M40 184H320" stroke="var(--lineart-muted)" strokeWidth="1" />
      <circle cx="110" cy="184" r="3" fill="var(--lineart-primary)" />
      <circle cx="180" cy="184" r="3" fill="var(--lineart-primary)" />
      <circle cx="250" cy="184" r="3" fill="var(--lineart-primary)" />
    </svg>
  );
}

/** 球面经纬架构线框插图（AIGC-FLOW / 全栈架构） */
export function ArchitectureLayersArt(props: ArtProps) {
  return (
    <svg viewBox="0 0 360 210" fill="none" aria-hidden="true" {...props}>
      <circle
        cx="180"
        cy="105"
        r="68"
        stroke="var(--lineart-primary)"
        strokeWidth="1.4"
      />
      <ellipse
        cx="180"
        cy="105"
        rx="34"
        ry="68"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />
      <ellipse
        cx="180"
        cy="105"
        rx="68"
        ry="26"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path
        d="M112 105H248M180 37V173"
        stroke="var(--lineart-muted)"
        strokeWidth="0.9"
        strokeDasharray="3 3"
      />
      <path
        d="M60 105H92M268 105H300"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <circle cx="60" cy="105" r="3" fill="var(--lineart-primary)" />
      <circle cx="300" cy="105" r="3" fill="var(--lineart-primary)" />
      <circle cx="180" cy="37" r="3" fill="var(--lineart-primary)" />
      <circle cx="180" cy="173" r="3" fill="var(--lineart-primary)" />
    </svg>
  );
}

/** 桌面 4 列网格 → 移动端优先队列示意图（文章配图） */
export function MobileOrderDiagramArt(props: ArtProps) {
  return (
    <svg viewBox="0 0 640 160" fill="none" aria-hidden="true" {...props}>
      <rect
        x="20"
        y="24"
        width="220"
        height="112"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <rect
        x="34"
        y="38"
        width="90"
        height="38"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <rect
        x="134"
        y="38"
        width="92"
        height="38"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <rect
        x="34"
        y="86"
        width="56"
        height="36"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <rect
        x="100"
        y="86"
        width="126"
        height="36"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path d="M276 80H364" stroke="var(--lineart-primary)" strokeWidth="1.3" />
      <path
        d="M356 73L364 80L356 87"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <circle
        cx="320"
        cy="80"
        r="12"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <rect
        x="404"
        y="18"
        width="110"
        height="124"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <rect
        x="416"
        y="30"
        width="86"
        height="28"
        stroke="var(--lineart-primary)"
        strokeWidth="1.4"
      />
      <rect
        x="416"
        y="66"
        width="86"
        height="28"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <rect
        x="416"
        y="102"
        width="86"
        height="28"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <path
        d="M528 44H568M528 80H556M528 116H544"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />
      <circle cx="568" cy="44" r="2.5" fill="var(--lineart-primary)" />
    </svg>
  );
}

/** Agent 产品用户体验设计封面：4 阶段纵向流程 × 6 贯穿议题轴 × 信任校准闭环 */
export function AgentUxDesignArt(props: ArtProps) {
  return (
    <svg viewBox="0 0 460 250" fill="none" aria-hidden="true" {...props}>
      {/* 四角建筑图纸对位十字 */}
      <path
        d="M16 24H28M22 18V30M432 24H444M438 18V30M16 226H28M22 220V232M432 226H444M438 220V232"
        stroke="var(--lineart-muted)"
        strokeWidth="0.9"
      />

      {/* 6 条横向贯穿议题基准线（A–F） */}
      <path
        d="M44 58H416M44 82H416M44 106H416M44 130H416M44 154H416M44 178H416"
        stroke="var(--lineart-muted)"
        strokeWidth="0.75"
        strokeDasharray="3 4"
      />

      {/* 左侧 A–F 坐标刻度点 */}
      {[58, 82, 106, 130, 154, 178].map((y) => (
        <circle key={y} cx="44" cy={y} r="1.8" fill="var(--lineart-muted)" />
      ))}

      {/* 主流程连接轴 */}
      <path d="M72 118H388" stroke="var(--lineart-primary)" strokeWidth="1.2" />

      {/* Phase 1: Before the Task (01–03) — 入口漏斗与意图槽位 */}
      <rect
        x="62"
        y="74"
        width="64"
        height="88"
        fill="var(--surface)"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M72 92H116M72 106H104M72 122H116M72 138H96"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />
      <rect
        x="104"
        y="133"
        width="12"
        height="10"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <circle cx="94" cy="58" r="2.5" fill="var(--lineart-primary)" />

      {/* Phase 2: During the Task (04–07) — 核心执行与人机协同控制环 */}
      <rect
        x="156"
        y="50"
        width="88"
        height="136"
        fill="var(--surface)"
        stroke="var(--lineart-primary)"
        strokeWidth="1.5"
      />
      <circle
        cx="200"
        cy="118"
        r="32"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <circle
        cx="200"
        cy="118"
        r="19"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path
        d="M200 76V160M162 118H238"
        stroke="var(--lineart-muted)"
        strokeWidth="0.9"
      />
      <rect
        x="193"
        y="111"
        width="14"
        height="14"
        fill="var(--surface)"
        stroke="var(--lineart-primary)"
        strokeWidth="1.4"
      />
      <circle cx="200" cy="118" r="2.5" fill="var(--lineart-primary)" />
      {/* 四个校准点（Explainable / Controllable / Predictable / Recoverable） */}
      <circle cx="200" cy="86" r="2.8" fill="var(--lineart-primary)" />
      <circle cx="232" cy="118" r="2.8" fill="var(--lineart-primary)" />
      <circle cx="200" cy="150" r="2.8" fill="var(--lineart-primary)" />
      <circle cx="168" cy="118" r="2.8" fill="var(--lineart-primary)" />

      {/* Phase 3: After the Task (08–10) — 产物画布与版本层叠 */}
      <rect
        x="278"
        y="78"
        width="56"
        height="78"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />
      <rect
        x="270"
        y="70"
        width="56"
        height="78"
        fill="var(--surface)"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <path
        d="M280 90H316M280 104H310M280 118H316"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />
      <circle
        cx="310"
        cy="132"
        r="5"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />
      <path
        d="M308 132L309.5 133.5L312.5 130.5"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />

      {/* Phase 4: Long-term (11–12) — 长期记忆与主动服务节点 */}
      <rect
        x="358"
        y="78"
        width="48"
        height="80"
        fill="var(--surface)"
        stroke="var(--lineart-primary)"
        strokeWidth="1.3"
      />
      <circle
        cx="382"
        cy="108"
        r="12"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />
      <circle cx="382" cy="108" r="4" fill="var(--lineart-primary)" />
      <path
        d="M368 134H396M368 144H388"
        stroke="var(--lineart-muted)"
        strokeWidth="1"
      />

      {/* 阶段间流向箭头 */}
      <path
        d="M148 113L155 118L148 123M262 113L269 118L262 123M350 113L357 118L350 123"
        stroke="var(--lineart-primary)"
        strokeWidth="1.2"
      />

      {/* 长期反馈回流曲线：Phase 4 → Phase 1（记忆与沉淀回流） */}
      <path
        d="M382 158V204H94V164"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
        strokeDasharray="4 3"
      />
      <path
        d="M89 170L94 163L99 170"
        stroke="var(--lineart-primary)"
        strokeWidth="1.1"
      />

      {/* 底部标尺刻度与坐标标注 */}
      <text
        x="94"
        y="224"
        textAnchor="middle"
        fill="var(--lineart-muted)"
        fontSize="8.5"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.08em"
      >
        01–03
      </text>
      <text
        x="200"
        y="224"
        textAnchor="middle"
        fill="var(--lineart-primary)"
        fontSize="8.5"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.08em"
      >
        04–07 · HITL
      </text>
      <text
        x="298"
        y="224"
        textAnchor="middle"
        fill="var(--lineart-muted)"
        fontSize="8.5"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.08em"
      >
        08–10
      </text>
      <text
        x="382"
        y="224"
        textAnchor="middle"
        fill="var(--lineart-muted)"
        fontSize="8.5"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.08em"
      >
        11–12
      </text>
      <text
        x="426"
        y="61"
        fill="var(--lineart-muted)"
        fontSize="8"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        A
      </text>
      <text
        x="426"
        y="181"
        fill="var(--lineart-muted)"
        fontSize="8"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        F
      </text>
    </svg>
  );
}

/** 按文章 slug 自动匹配对应单色架构线框插图与编号 */
export function PostHeroArt({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  if (slug === "agent-ux-design") {
    return <AgentUxDesignArt className={className} />;
  }
  return <ArchitectureLayersArt className={className} />;
}
