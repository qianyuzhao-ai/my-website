import Image from "next/image";

/** Figma framework diagram, preserved in its original coordinate system. */
export function FrameworkArtwork() {
  return (
    <div
      className="bg-preview-surface overflow-clip relative rounded-[20px] shadow-[0px_12px_32px_0px_rgba(18,20,26,0.1)] case-canvas case-canvas-framework"
      data-node-id="33:472"
      data-name="Artwork"
    >
      <div
        className="absolute left-0 size-[512px] top-0"
        data-node-id="33:500"
        data-name="Vector"
      >
        <Image
          alt=""
          unoptimized
          draggable={false}
          className="block max-w-none"
          src="/images/aigc-flow/framework-vector.svg"
          width={512}
          height={512}
        />
      </div>
      <div
        className="absolute bg-preview-background border border-preview-outline border-dashed h-[210px] left-[20px] overflow-clip rounded-[14px] top-[20px] w-[150px]"
        data-node-id="33:473"
        data-name="Group 编组"
      >
        <p
          className="absolute font-sans font-normal leading-[14px] left-[11px] text-preview-muted text-[10px] top-[7px] whitespace-nowrap"
          data-node-id="33:474"
        >
          编组 · 角色与场景
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[32px] overflow-clip p-[10px] rounded-[10px] top-[44px] w-[126px]"
        data-node-id="33:475"
        data-name="素材"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-image-label text-[11px] whitespace-nowrap"
          data-node-id="33:476"
        >
          素材
        </p>
        <div
          className="bg-preview-image h-[44px] relative rounded-[6px] shrink-0 w-full"
          data-node-id="33:477"
          data-name="Rectangle"
        />
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[32px] overflow-clip p-[10px] rounded-[10px] top-[134px] w-[126px] whitespace-nowrap"
        data-node-id="33:478"
        data-name="文本"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-text-label text-[11px]"
          data-node-id="33:479"
        >
          文本
        </p>
        <p
          className="font-sans font-normal leading-[14px] relative shrink-0 text-preview-ink text-[10px]"
          data-node-id="33:480"
        >
          深夜录音棚…
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border-preview-ink border-[1.5px] border-solid content-stretch flex flex-col gap-[6px] items-start left-[210px] overflow-clip p-[10px] rounded-[10px] top-[34px] w-[130px] whitespace-nowrap"
        data-node-id="33:481"
        data-name="图像生成"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-ink text-[11px]"
          data-node-id="33:482"
        >
          图像生成
        </p>
        <p
          className="font-sans font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px]"
          data-node-id="33:483"
        >
          让 @图1 坐在…
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border-preview-ink border-[1.5px] border-solid content-stretch flex flex-col gap-[6px] items-start left-[210px] overflow-clip p-[10px] rounded-[10px] top-[168px] w-[130px] whitespace-nowrap"
        data-node-id="33:484"
        data-name="视频生成"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-ink text-[11px]"
          data-node-id="33:485"
        >
          视频生成
        </p>
        <p
          className="font-mono font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px]"
          data-node-id="33:486"
        >
          Seedance · 8s
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[32px] overflow-clip p-[10px] rounded-[10px] top-[250px] w-[150px]"
        data-node-id="33:487"
        data-name="分镜表"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-video-label text-[11px] whitespace-nowrap"
          data-node-id="33:488"
        >
          分镜表
        </p>
        <div
          className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="33:489"
          data-name="Rows"
        >
          <div
            className="bg-preview-toolbar h-[8px] relative rounded-[2px] shrink-0 w-full"
            data-node-id="33:490"
            data-name="Rectangle"
          />
          <div
            className="bg-preview-toolbar h-[8px] relative rounded-[2px] shrink-0 w-full"
            data-node-id="33:491"
            data-name="Rectangle"
          />
          <div
            className="bg-preview-toolbar h-[8px] relative rounded-[2px] shrink-0 w-full"
            data-node-id="33:492"
            data-name="Rectangle"
          />
        </div>
      </div>
      <div
        className="absolute bg-preview-image h-[56px] left-[380px] rounded-[8px] top-[30px] w-[108px]"
        data-node-id="33:493"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-adopted content-stretch flex items-start left-[386px] overflow-clip px-[6px] py-px rounded-[4px] top-[36px]"
        data-node-id="33:494"
        data-name="Badge 采用"
      >
        <p
          className="font-sans font-medium leading-[14px] relative shrink-0 text-preview-surface text-[10px] whitespace-nowrap"
          data-node-id="33:495"
        >
          采用
        </p>
      </div>
      <div
        className="absolute bg-preview-image-faint h-[56px] left-[380px] rounded-[8px] top-[98px] w-[108px]"
        data-node-id="33:496"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-discarded content-stretch flex items-start left-[386px] overflow-clip px-[6px] py-px rounded-[4px] top-[104px]"
        data-node-id="33:497"
        data-name="Badge 废弃"
      >
        <p
          className="font-sans font-medium leading-[14px] relative shrink-0 text-preview-surface text-[10px] whitespace-nowrap"
          data-node-id="33:498"
        >
          废弃
        </p>
      </div>
      <div
        className="absolute bg-preview-video h-[56px] left-[380px] rounded-[8px] top-[170px] w-[108px]"
        data-node-id="33:499"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-surface border-preview-ink border-[1.5px] border-solid content-stretch flex flex-col gap-[8px] items-start left-[228px] overflow-clip p-[16px] rounded-[14px] shadow-[0px_8px_24px_0px_rgba(18,20,26,0.12)] top-[300px] w-[260px]"
        data-node-id="33:507"
        data-name="Ledger"
      >
        <p
          className="font-sans font-medium leading-[18px] relative shrink-0 text-preview-ink text-[12px] whitespace-nowrap"
          data-node-id="33:508"
        >
          生成记录 · 播客 S03
        </p>
        <div
          className="content-stretch flex font-normal items-start justify-between leading-[16px] overflow-clip relative shrink-0 text-[11px] w-full whitespace-nowrap"
          data-node-id="33:509"
          data-name="图像 · GPT Image 2"
        >
          <p
            className="font-sans relative shrink-0 text-preview-muted"
            data-node-id="33:510"
          >
            图像 · GPT Image 2
          </p>
          <p
            className="font-mono relative shrink-0 text-preview-ink"
            data-node-id="33:511"
          >
            ×24
          </p>
        </div>
        <div
          className="content-stretch flex font-normal items-start justify-between leading-[16px] overflow-clip relative shrink-0 text-[11px] w-full whitespace-nowrap"
          data-node-id="33:512"
          data-name="视频 · Seedance 2.0"
        >
          <p
            className="font-sans relative shrink-0 text-preview-muted"
            data-node-id="33:513"
          >
            视频 · Seedance 2.0
          </p>
          <p
            className="font-mono relative shrink-0 text-preview-ink"
            data-node-id="33:514"
          >
            ×9
          </p>
        </div>
        <div
          className="content-stretch flex font-normal items-start justify-between leading-[16px] overflow-clip relative shrink-0 text-[11px] w-full whitespace-nowrap"
          data-node-id="33:515"
          data-name="本项目合计"
        >
          <p
            className="font-sans relative shrink-0 text-preview-muted"
            data-node-id="33:516"
          >
            本项目合计
          </p>
          <p
            className="font-mono relative shrink-0 text-preview-ink"
            data-node-id="33:517"
          >
            33 次
          </p>
        </div>
        <div
          className="bg-preview-text-chip content-stretch flex items-start overflow-clip px-[10px] py-[4px] relative rounded-[6px] shrink-0"
          data-node-id="33:518"
          data-name="Export"
        >
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-text-label text-[11px] whitespace-nowrap"
            data-node-id="33:519"
          >
            导出 XLSX
          </p>
        </div>
      </div>
      <div
        className="absolute content-stretch flex gap-[8px] items-start left-[20px] overflow-clip top-[440px]"
        data-node-id="33:520"
        data-name="Projects"
      >
        <div
          className="bg-preview-ink content-stretch flex items-start overflow-clip px-[12px] py-[6px] relative rounded-[999px] shrink-0"
          data-node-id="33:521"
          data-name="播客 S03"
        >
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-surface text-[11px] whitespace-nowrap"
            data-node-id="33:522"
          >
            播客 S03
          </p>
        </div>
        <div
          className="bg-preview-background content-stretch flex items-start overflow-clip px-[12px] py-[6px] relative rounded-[999px] shrink-0"
          data-node-id="33:523"
          data-name="剧情 02"
        >
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-muted text-[11px] whitespace-nowrap"
            data-node-id="33:524"
          >
            剧情 02
          </p>
        </div>
        <div
          className="bg-preview-background content-stretch flex items-start overflow-clip px-[12px] py-[6px] relative rounded-[999px] shrink-0"
          data-node-id="33:525"
          data-name="播客 S04"
        >
          <p
            className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-muted text-[11px] whitespace-nowrap"
            data-node-id="33:526"
          >
            播客 S04
          </p>
        </div>
      </div>
    </div>
  );
}
