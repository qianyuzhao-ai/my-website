import Image from "next/image";

/** Figma 4:617 / 4:1210: original artwork layers, scaled as one composition. */
export function AigcFlowArtwork() {
  return (
    <div className="aigc-entry-canvas" data-name="Artwork / AIGC-FLOW">
      <div
        className="absolute left-[150px] size-[440px] top-[200px] md:left-[-120px] md:top-[330px]"
        data-name="Shape"
      >
        <Image
          alt=""
          src="/images/aigc-flow/entry-shape-light.svg"
          width={440}
          height={440}
          draggable={false}
          unoptimized
          className="block max-w-none dark:hidden"
        />
        <Image
          alt=""
          src="/images/aigc-flow/entry-shape-dark.svg"
          width={440}
          height={440}
          draggable={false}
          unoptimized
          className="hidden max-w-none dark:block"
        />
      </div>
      <div className="absolute flex h-[670.474px] items-center justify-center left-[-107.38px] top-[52px] w-[492.211px] md:left-[-131.38px] md:top-[70px]">
        <div className="flex-none rotate-16">
          <div
            className="bg-preview-surface content-stretch flex flex-col h-[600px] items-start overflow-clip relative rounded-[18px] shadow-[0px_20px_40px_0px_rgba(18,20,26,0.18)] w-[340px]"
            data-name="App window"
          >
            <div
              className="bg-preview-toolbar content-stretch flex gap-[7px] items-center overflow-clip px-[14px] py-[10px] relative shrink-0 w-full"
              data-name="Tab bar"
            >
              <div className="relative shrink-0 size-[9px]" data-name="Ellipse">
                <Image
                  alt=""
                  src="/images/aigc-flow/entry-dot-pink.svg"
                  width={9}
                  height={9}
                  draggable={false}
                  unoptimized
                  className="block max-w-none"
                />
              </div>
              <div className="relative shrink-0 size-[9px]" data-name="Ellipse">
                <Image
                  alt=""
                  src="/images/aigc-flow/entry-dot-yellow.svg"
                  width={9}
                  height={9}
                  draggable={false}
                  unoptimized
                  className="block max-w-none"
                />
              </div>
              <div className="relative shrink-0 size-[9px]" data-name="Ellipse">
                <Image
                  alt=""
                  src="/images/aigc-flow/entry-dot-mint.svg"
                  width={9}
                  height={9}
                  draggable={false}
                  unoptimized
                  className="block max-w-none"
                />
              </div>
              <div
                className="bg-preview-surface content-stretch flex items-start overflow-clip px-[10px] py-[3px] relative rounded-[7px] shrink-0"
                data-name="Tab"
              >
                <p className="font-sans font-medium leading-[15px] relative shrink-0 text-preview-ink text-[10px] whitespace-nowrap">
                  播客 S03
                </p>
              </div>
            </div>
            <div
              className="bg-preview-canvas flex-[1_0_0] min-h-px overflow-clip relative w-full"
              data-name="Canvas"
            >
              <div
                className="absolute h-[560px] left-0 top-0 w-[340px]"
                data-name="Edges"
              >
                <Image
                  alt=""
                  src="/images/aigc-flow/entry-edges.svg"
                  width={340}
                  height={560}
                  draggable={false}
                  unoptimized
                  className="block max-w-none"
                />
              </div>
              <div
                className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[18px] overflow-clip p-[10px] rounded-[10px] top-[22px] w-[132px]"
                data-name="参考图"
              >
                <p className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-image-label text-[11px] whitespace-nowrap">
                  参考图
                </p>
                <div
                  className="bg-preview-image h-[64px] relative rounded-[6px] shrink-0 w-full"
                  data-name="Rectangle"
                />
                <p className="font-sans font-normal leading-[14px] relative shrink-0 text-preview-muted text-[10px] whitespace-nowrap">
                  主播定妆.png
                </p>
              </div>
              <div
                className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[18px] overflow-clip p-[10px] rounded-[10px] top-[158px] w-[132px]"
                data-name="文本 · 场景"
              >
                <p className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-text-label text-[11px] whitespace-nowrap">
                  文本 · 场景
                </p>
                <p className="font-sans font-normal leading-[15px] min-w-full relative shrink-0 text-preview-ink text-[10px] w-[min-content]">
                  深夜录音棚，暖色台灯，浅景深
                </p>
              </div>
              <div
                className="absolute bg-preview-surface border-preview-ink border-[1.5px] border-solid content-stretch flex flex-col gap-[6px] items-start left-[174px] overflow-clip p-[10px] rounded-[10px] top-[74px] w-[150px]"
                data-name="图像生成"
              >
                <p className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-ink text-[11px] whitespace-nowrap">
                  图像生成
                </p>
                <div
                  className="content-start flex flex-wrap gap-[5px_3px] items-start overflow-clip relative shrink-0 w-full"
                  data-name="Prompt"
                >
                  <p className="font-sans font-normal leading-[15px] relative shrink-0 text-preview-ink text-[10px] whitespace-nowrap">
                    让
                  </p>
                  <div
                    className="bg-preview-image-chip content-stretch flex items-start overflow-clip px-[5px] py-px relative rounded-[4px] shrink-0"
                    data-name="Chip @图1"
                  >
                    <p className="font-mono font-normal leading-[15px] relative shrink-0 text-preview-image-label text-[10px] whitespace-nowrap">
                      @图1
                    </p>
                  </div>
                  <p className="font-sans font-normal leading-[15px] relative shrink-0 text-preview-ink text-[10px] whitespace-nowrap">
                    坐在
                  </p>
                  <div
                    className="bg-preview-text-chip content-stretch flex items-start overflow-clip px-[5px] py-px relative rounded-[4px] shrink-0"
                    data-name="Chip 场景"
                  >
                    <p className="font-mono font-normal leading-[15px] relative shrink-0 text-preview-text-label text-[10px] whitespace-nowrap">
                      场景
                    </p>
                  </div>
                  <p className="font-sans font-normal leading-[15px] relative shrink-0 text-preview-ink text-[10px] whitespace-nowrap">
                    中央，看向镜头左侧
                  </p>
                </div>
                <div
                  className="bg-preview-ink content-stretch flex items-start justify-center overflow-clip px-[10px] py-[5px] relative rounded-[7px] shrink-0 w-full"
                  data-name="Button"
                >
                  <p className="font-sans font-medium leading-[15px] relative shrink-0 text-preview-surface text-[10px] whitespace-nowrap">
                    批量生成 ×4
                  </p>
                </div>
              </div>
              <div
                className="absolute bg-preview-image left-[174px] rounded-[8px] size-[68px] top-[268px]"
                data-name="Result"
              />
              <div
                className="absolute bg-preview-image left-[252px] rounded-[8px] size-[68px] top-[268px]"
                data-name="Result"
              />
              <div
                className="absolute bg-preview-image left-[174px] rounded-[8px] size-[68px] top-[346px]"
                data-name="Result"
              />
              <div
                className="absolute bg-preview-image-faint left-[252px] rounded-[8px] size-[68px] top-[346px]"
                data-name="Result"
              />
              <div
                className="absolute bg-preview-adopted content-stretch flex items-start left-[179px] overflow-clip px-[5px] py-px rounded-[4px] top-[273px]"
                data-name="Badge 采用"
              >
                <p className="font-sans font-medium leading-[13px] relative shrink-0 text-preview-surface text-[9px] whitespace-nowrap">
                  采用
                </p>
              </div>
              <div
                className="absolute bg-preview-surface border border-preview-border border-solid content-stretch flex flex-col gap-[6px] items-start left-[18px] overflow-clip p-[10px] rounded-[10px] top-[300px] w-[140px]"
                data-name="视频生成 · 首尾帧"
              >
                <p className="font-sans font-medium leading-[16px] relative shrink-0 text-preview-video-label text-[11px] whitespace-nowrap">
                  视频生成 · 首尾帧
                </p>
                <div
                  className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0 w-full"
                  data-name="Frames"
                >
                  <div
                    className="bg-preview-image-chip content-stretch flex flex-[1_0_0] items-start justify-center min-w-0 overflow-clip p-[8px] relative rounded-[6px]"
                    data-name="首帧"
                  >
                    <p className="font-sans font-normal leading-[13px] relative shrink-0 text-preview-muted text-[9px] whitespace-nowrap">
                      首帧
                    </p>
                  </div>
                  <div
                    className="bg-preview-toolbar content-stretch flex flex-[1_0_0] items-start justify-center min-w-0 overflow-clip p-[8px] relative rounded-[6px]"
                    data-name="尾帧"
                  >
                    <p className="font-sans font-normal leading-[13px] relative shrink-0 text-preview-muted text-[9px] whitespace-nowrap">
                      尾帧
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
