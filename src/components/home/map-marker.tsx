import { ThemedImage } from "@/components/home/bento-card";

export function MapMarker() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 size-22 -translate-1/2 md:size-24"
    >
      <span className="md:hidden">
        <ThemedImage
          name="map/halo-mobile"
          extension="svg"
          alt=""
          width={88}
          height={88}
          sizes="88px"
        />
      </span>
      <span className="hidden md:block">
        <ThemedImage
          name="map/halo-desktop"
          extension="svg"
          alt=""
          width={96}
          height={96}
          sizes="96px"
        />
      </span>
      <ThemedImage
        name="memoji"
        alt=""
        width={44}
        height={42}
        sizes="44px"
        className="absolute top-1/2 left-1/2 h-10.5 w-11 -translate-1/2 object-contain"
      />
    </span>
  );
}
