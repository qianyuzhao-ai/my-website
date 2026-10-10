import Image from "next/image";

/** Figma prompt diagram, preserved in its original coordinate system. */
export function PromptArtwork() {
  return (
    <div
      className="bg-preview-surface overflow-clip relative rounded-[20px] shadow-[0px_12px_32px_0px_rgba(18,20,26,0.1)] case-canvas case-canvas-prompt"
      data-node-id="33:616"
      data-name="Artwork"
    >
      <div
        className="absolute left-0 size-[512px] top-0"
        data-node-id="33:641"
        data-name="Vector"
      >
        <Image
          alt=""
          unoptimized
          draggable={false}
          className="block max-w-none"
          src="/images/aigc-flow/prompt-vector.svg"
          width={512}
          height={512}
        />
      </div>
      <div
        className="absolute content-stretch flex flex-col gap-[12px] h-[40px] items-start left-[24px] overflow-clip top-[96px] w-[150px]"
        data-node-id="33:617"
        data-name="Sources"
      >
        <div
          className="bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
          data-node-id="33:618"
          data-name="图1"
        >
          <div
            className="bg-preview-image h-[72px] relative rounded-[6px] shrink-0 w-full"
            data-node-id="33:619"
            data-name="Rectangle"
          />
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-image-label text-[11px] whitespace-nowrap"
            data-node-id="33:620"
          >
            图1 · 主播定妆
          </p>
        </div>
        <div
          className="bg-preview-surface border-2 border-preview-text-selection border-solid content-stretch flex flex-col gap-[4px] items-start overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
          data-node-id="33:621"
          data-name="文本 · 场景"
        >
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-text-label text-[11px] whitespace-nowrap"
            data-node-id="33:622"
          >
            文本 · 场景
          </p>
          <p
            className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-sans font-normal leading-[14px] line-through min-w-full relative shrink-0 text-preview-placeholder text-[10px] w-[min-content]"
            data-node-id="33:623"
          >
            深夜录音棚，暖色台灯
          </p>
          <p
            className="font-sans font-normal leading-[16px] min-w-full relative shrink-0 text-preview-ink text-[11px] w-[min-content]"
            data-node-id="33:624"
          >
            清晨天台，冷色逆光，城市远景
          </p>
        </div>
      </div>
      <div
        className="absolute bg-preview-surface border-preview-ink border-[1.5px] border-solid content-stretch flex flex-col items-start left-[202px] overflow-clip rounded-[14px] top-[110px] w-[286px]"
        data-node-id="33:625"
        data-name="Prompt editor"
      >
        <div
          className="border-preview-border border-b border-solid content-stretch flex items-start justify-between overflow-clip px-[12px] py-[8px] relative shrink-0 w-full whitespace-nowrap"
          data-node-id="33:626"
          data-name="Header"
        >
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-ink text-[11px]"
            data-node-id="33:627"
          >
            图像生成 · 提示词
          </p>
          <p
            className="font-mono font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px]"
            data-node-id="33:628"
          >
            16:9
          </p>
        </div>
        <div
          className="content-start flex flex-wrap gap-[8px_4px] items-start overflow-clip p-[12px] relative shrink-0 w-full"
          data-node-id="33:629"
          data-name="Body"
        >
          <p
            className="font-sans font-normal leading-[22px] relative shrink-0 text-preview-ink text-[13px] whitespace-nowrap"
            data-node-id="33:630"
          >
            让
          </p>
          <div
            className="bg-preview-image-chip content-stretch flex items-start overflow-clip px-[6px] py-px relative rounded-[4px] shrink-0"
            data-node-id="33:631"
            data-name="Chip @图1"
          >
            <p
              className="font-mono font-normal leading-[16px] relative shrink-0 text-preview-image-label text-[12px] whitespace-nowrap"
              data-node-id="33:632"
            >
              @图1
            </p>
          </div>
          <p
            className="font-sans font-normal leading-[22px] relative shrink-0 text-preview-ink text-[13px] whitespace-nowrap"
            data-node-id="33:633"
          >
            坐在
          </p>
          <div
            className="bg-preview-text-chip content-stretch flex items-start overflow-clip px-[6px] py-px relative rounded-[4px] shrink-0"
            data-node-id="33:634"
            data-name="Chip 场景"
          >
            <p
              className="font-mono font-normal leading-[16px] relative shrink-0 text-preview-text-label text-[12px] whitespace-nowrap"
              data-node-id="33:635"
            >
              场景
            </p>
          </div>
          <p
            className="font-sans font-normal leading-[22px] relative shrink-0 text-preview-ink text-[13px] whitespace-nowrap"
            data-node-id="33:636"
          >
            的中央，侧身看向镜头左侧，自然微笑，半身构图。
          </p>
        </div>
      </div>
      <div
        className="absolute bg-preview-ink content-stretch flex flex-col items-start left-[290px] overflow-clip px-[10px] py-[6px] rounded-[8px] top-[250px]"
        data-node-id="33:637"
        data-name="Tooltip"
      >
        <p
          className="font-sans font-normal leading-[16px] relative shrink-0 text-preview-surface text-[11px] whitespace-nowrap"
          data-node-id="33:638"
        >
          清晨天台，冷色逆光，城市远景
        </p>
      </div>
      <div
        className="absolute bg-preview-success-bg content-stretch flex items-start left-[202px] overflow-clip px-[12px] py-[8px] rounded-[999px] top-[312px]"
        data-node-id="33:639"
        data-name="Sync"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-success text-[11px] whitespace-nowrap"
          data-node-id="33:640"
        >
          ✓ 另有 3 个生成节点已同步
        </p>
      </div>
    </div>
  );
}
