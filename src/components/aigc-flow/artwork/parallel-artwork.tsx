import Image from "next/image";

/** Figma parallel diagram, preserved in its original coordinate system. */
export function ParallelArtwork() {
  return (
    <div
      className="bg-preview-surface overflow-clip relative rounded-[16px] case-canvas case-canvas-parallel"
      data-node-id="32:564"
      data-name="Parallel canvas"
    >
      <div
        className="absolute h-[220px] left-0 top-0 w-[512px]"
        data-node-id="32:589"
        data-name="Edges"
      >
        <Image
          alt=""
          unoptimized
          draggable={false}
          className="block max-w-none"
          src="/images/aigc-flow/parallel-edges.svg"
          width={512}
          height={220}
        />
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col h-[64px] items-start left-[16px] overflow-clip p-[12px] rounded-[12px] top-[30px] w-[110px]"
        data-node-id="32:565"
        data-name="参考素材"
      >
        <p
          className="font-sans font-medium leading-[normal] relative shrink-0 text-preview-image-label text-[12px] whitespace-nowrap"
          data-node-id="32:566"
        >
          参考素材
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col h-[64px] items-start left-[16px] overflow-clip p-[12px] rounded-[12px] top-[124px] w-[110px]"
        data-node-id="32:567"
        data-name="文本 · 场景"
      >
        <p
          className="font-sans font-medium leading-[normal] relative shrink-0 text-preview-text-label text-[12px] whitespace-nowrap"
          data-node-id="32:568"
        >
          文本 · 场景
        </p>
      </div>
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex font-sans font-medium gap-[8px] h-[40px] items-center leading-[normal] left-[196px] overflow-clip px-[12px] rounded-[12px] text-[12px] top-[14px] w-[160px] whitespace-nowrap"
        data-node-id="32:569"
        data-name="图像生成 · A"
      >
        <p className="relative shrink-0 text-preview-ink" data-node-id="32:570">
          图像生成 · A
        </p>
        <p
          className="relative shrink-0 text-preview-success"
          data-node-id="32:571"
        >
          ✓
        </p>
      </div>
      <div
        className="absolute bg-preview-image left-[384px] rounded-[6px] size-[36px] top-[16px]"
        data-node-id="32:572"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-image left-[428px] rounded-[6px] size-[36px] top-[16px]"
        data-node-id="32:573"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex font-sans font-medium gap-[8px] h-[40px] items-center leading-[normal] left-[196px] overflow-clip px-[12px] rounded-[12px] text-[12px] top-[64px] w-[160px] whitespace-nowrap"
        data-node-id="32:574"
        data-name="图像生成 · B"
      >
        <p className="relative shrink-0 text-preview-ink" data-node-id="32:575">
          图像生成 · B
        </p>
        <p
          className="relative shrink-0 text-preview-success"
          data-node-id="32:576"
        >
          ✓
        </p>
      </div>
      <div
        className="absolute bg-preview-image left-[384px] rounded-[6px] size-[36px] top-[66px]"
        data-node-id="32:577"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-image left-[428px] rounded-[6px] size-[36px] top-[66px]"
        data-node-id="32:578"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex font-sans font-medium gap-[8px] h-[40px] items-center leading-[normal] left-[196px] overflow-clip px-[12px] rounded-[12px] text-[12px] top-[114px] w-[160px] whitespace-nowrap"
        data-node-id="32:579"
        data-name="图像生成 · C"
      >
        <p className="relative shrink-0 text-preview-ink" data-node-id="32:580">
          图像生成 · C
        </p>
        <p
          className="relative shrink-0 text-preview-success"
          data-node-id="32:581"
        >
          ✓
        </p>
      </div>
      <div
        className="absolute bg-preview-image left-[384px] rounded-[6px] size-[36px] top-[116px]"
        data-node-id="32:582"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-image left-[428px] rounded-[6px] size-[36px] top-[116px]"
        data-node-id="32:583"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex font-sans font-medium gap-[8px] h-[40px] items-center leading-[normal] left-[196px] overflow-clip px-[12px] rounded-[12px] text-[12px] top-[164px] w-[160px] whitespace-nowrap"
        data-node-id="32:584"
        data-name="视频生成 · D"
      >
        <p className="relative shrink-0 text-preview-ink" data-node-id="32:585">
          视频生成 · D
        </p>
        <p
          className="relative shrink-0 text-preview-success"
          data-node-id="32:586"
        >
          ✓
        </p>
      </div>
      <div
        className="absolute bg-preview-video left-[384px] rounded-[6px] size-[36px] top-[166px]"
        data-node-id="32:587"
        data-name="Result"
      />
      <div
        className="absolute bg-preview-video left-[428px] rounded-[6px] size-[36px] top-[166px]"
        data-node-id="32:588"
        data-name="Result"
      />
    </div>
  );
}
