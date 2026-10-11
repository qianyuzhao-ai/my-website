"use client";

import { useRef, useState } from "react";
import { BentoCard, ThemedImage } from "@/components/home/bento-card";
import { MapMarker } from "@/components/home/map-marker";
import { Button } from "@/components/ui/button";

const ZOOM_LEVELS = [1, 1.5, 2.25] as const;
const CONTROLS = [
  { icon: "zoom-out", label: "缩小地图", step: -1 },
  { icon: "zoom-in", label: "放大地图", step: 1 },
] as const;

export function MapCard() {
  const [zoomIndex, setZoomIndex] = useState(ZOOM_LEVELS.length - 1);
  const zoomOutRef = useRef<HTMLButtonElement>(null);
  const zoom = ZOOM_LEVELS[zoomIndex];
  const atClosest = zoomIndex === ZOOM_LEVELS.length - 1;

  function changeZoom(step: number) {
    // 放回近景后「＋」隐藏，将键盘焦点留在可用的「−」上。
    if (step === 1 && zoomIndex === ZOOM_LEVELS.length - 2) {
      zoomOutRef.current?.focus({ preventScroll: true });
    }
    setZoomIndex((current) =>
      Math.max(0, Math.min(ZOOM_LEVELS.length - 1, current + step)),
    );
  }

  return (
    <BentoCard
      role="group"
      aria-label="北京静态地图"
      className="map-card h-50 bg-surface"
    >
      <div className="map-viewport absolute inset-0 dark:-inset-[1.5px]">
        <div className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-full -translate-1/2">
          <div
            className="size-full transition-transform duration-250 ease-in-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <ThemedImage
              name="map/beijing-detail"
              alt="北京城区地图"
              width={768}
              height={768}
              loading="eager"
              sizes="(min-width: 1152px) 630px, (min-width: 768px) 110vw, 225vw"
              className="absolute inset-0 size-full object-cover"
            />
            <span className="map-landmark map-landmark-city">Beijing</span>
            <span className="map-landmark map-landmark-palace">故宫</span>
            <span className="map-landmark map-landmark-temple">天坛</span>
          </div>
        </div>
        <MapMarker />
        <div data-no-drag className="absolute bottom-4 left-4 flex gap-2">
          {CONTROLS.map(({ icon, label, step }) =>
            step === 1 && atClosest ? null : (
              <Button
                key={icon}
                ref={step === -1 ? zoomOutRef : undefined}
                variant="secondary"
                size="lg"
                aria-label={label}
                title={label}
                disabled={step === -1 && zoomIndex === 0}
                onClick={() => changeZoom(step)}
                className="size-11 border-0 p-0 disabled:opacity-30"
              >
                <ThemedImage
                  name={`map/${icon}`}
                  extension="svg"
                  alt=""
                  width={20}
                  height={20}
                  sizes="20px"
                />
              </Button>
            ),
          )}
        </div>
      </div>
      <p role="status" className="sr-only">
        地图缩放 {zoom} 倍{zoomIndex === 0 ? "，已缩至最小" : ""}
        {atClosest ? "，已回到初始视角" : ""}
      </p>
    </BentoCard>
  );
}
