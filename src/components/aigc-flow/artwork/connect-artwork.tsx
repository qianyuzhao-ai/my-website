import Image from "next/image";

/** Figma connect diagram, preserved in its original coordinate system. */
export function ConnectArtwork() {
  return (
    <div
      className="bg-preview-surface overflow-clip relative rounded-[20px] shadow-[0px_12px_32px_0px_rgba(18,20,26,0.1)] case-canvas case-canvas-connect"
      data-node-id="33:559"
      data-name="Artwork"
    >
      <div
        className="absolute left-0 size-[512px] top-0"
        data-node-id="33:580"
        data-name="Vector"
      >
        <Image
          alt=""
          unoptimized
          draggable={false}
          className="block max-w-none"
          src="/images/aigc-flow/connect-vector.svg"
          width={512}
          height={512}
        />
      </div>
      <div
        className="absolute bg-preview-background content-stretch flex items-start left-[20px] overflow-clip px-[10px] py-[4px] rounded-[999px] top-[20px]"
        data-node-id="33:560"
        data-name="Zoom"
      >
        <p
          className="font-mono font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px] whitespace-nowrap"
          data-node-id="33:561"
        >
          缩放 40% · 端点 ×2.5
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[32px] overflow-clip p-[10px] rounded-[10px] top-[150px] w-[140px]"
        data-node-id="33:562"
        data-name="参考图"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-image-label text-[11px] whitespace-nowrap"
          data-node-id="33:563"
        >
          参考图
        </p>
        <div
          className="bg-preview-image h-[72px] relative rounded-[6px] shrink-0 w-full"
          data-node-id="33:564"
          data-name="Rectangle"
        />
      </div>
      <div
        className="absolute bg-preview-surface border-preview-ink border-[1.5px] border-solid content-stretch flex flex-col gap-[6px] items-start left-[300px] overflow-clip p-[10px] rounded-[10px] top-[60px] w-[180px]"
        data-node-id="33:565"
        data-name="图像生成"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-ink text-[11px] whitespace-nowrap"
          data-node-id="33:566"
        >
          图像生成
        </p>
        <p
          className="font-sans font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px] whitespace-nowrap"
          data-node-id="33:567"
        >
          参考图 0 / 4
        </p>
        <div
          className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0"
          data-node-id="33:568"
          data-name="Slots"
        >
          <div
            className="border border-preview-outline border-dashed relative rounded-[6px] shrink-0 size-[32px]"
            data-node-id="33:569"
            data-name="Rectangle"
          />
          <div
            className="border border-preview-outline border-dashed relative rounded-[6px] shrink-0 size-[32px]"
            data-node-id="33:570"
            data-name="Rectangle"
          />
          <div
            className="border border-preview-outline border-dashed relative rounded-[6px] shrink-0 size-[32px]"
            data-node-id="33:571"
            data-name="Rectangle"
          />
        </div>
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-ink border-solid content-stretch flex flex-col gap-[2px] items-start left-[300px] overflow-clip p-[8px] rounded-[12px] shadow-[0px_12px_28px_0px_rgba(18,20,26,0.16)] top-[300px] w-[170px]"
        data-node-id="33:572"
        data-name="Node menu"
      >
        <p
          className="font-sans font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px] whitespace-nowrap"
          data-node-id="33:573"
        >
          新建节点并连接
        </p>
        <div
          className="content-stretch flex items-start overflow-clip px-[8px] py-[6px] relative rounded-[6px] shrink-0 w-full"
          data-node-id="33:574"
          data-name="图像生成"
        >
          <p
            className="font-sans font-medium leading-[18px] relative shrink-0 text-preview-ink text-[12px] whitespace-nowrap"
            data-node-id="33:575"
          >
            图像生成
          </p>
        </div>
        <div
          className="bg-preview-text-chip content-stretch flex items-start overflow-clip px-[8px] py-[6px] relative rounded-[6px] shrink-0 w-full"
          data-node-id="33:576"
          data-name="视频生成"
        >
          <p
            className="font-sans font-medium leading-[18px] relative shrink-0 text-preview-ink text-[12px] whitespace-nowrap"
            data-node-id="33:577"
          >
            视频生成
          </p>
        </div>
        <div
          className="content-stretch flex items-start overflow-clip px-[8px] py-[6px] relative rounded-[6px] shrink-0 w-full"
          data-node-id="33:578"
          data-name="文本"
        >
          <p
            className="font-sans font-medium leading-[18px] relative shrink-0 text-preview-ink text-[12px] whitespace-nowrap"
            data-node-id="33:579"
          >
            文本
          </p>
        </div>
      </div>
      <div
        className="absolute left-0 overflow-clip size-[512px] top-0"
        data-node-id="33:584"
        data-name="Vector"
      >
        <div
          className="absolute inset-[56.64%_39.94%_38.87%_57.03%]"
          data-node-id="33:585"
          data-name="Group"
        >
          <div className="absolute inset-[-6.85%_-11.74%_-3.99%_-4.52%]">
            <Image
              alt=""
              unoptimized
              draggable={false}
              className="block max-w-none"
              src="/images/aigc-flow/connect-group.svg"
              width={18.0193}
              height={25.4926}
            />
          </div>
        </div>
      </div>
      <div
        className="absolute bg-preview-ink content-stretch flex items-start left-[32px] overflow-clip px-[10px] py-[5px] rounded-[999px] top-[440px]"
        data-node-id="33:587"
        data-name="Annotation"
      >
        <p
          className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-surface text-[11px] whitespace-nowrap"
          data-node-id="33:588"
        >
          松手落空 → 弹出节点菜单
        </p>
      </div>
      <span
        data-demo-endpoint
        className="absolute left-[166px] top-[178px] size-3 rounded-full border-2 border-preview-image-label bg-preview-surface"
      />
      <div
        data-demo-created
        className="invisible absolute left-[300px] top-[300px] w-[170px] rounded-xl border border-preview-ink bg-preview-surface p-3 text-caption"
      >
        <p>视频生成</p>
        <p className="mt-2 text-preview-muted">参考图 1 / 4</p>
        <div className="mt-2 h-12 rounded-md bg-preview-video" />
      </div>
    </div>
  );
}
