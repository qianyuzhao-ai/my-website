import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.667 11.333 11.333 4.667m0 6.666V4.667H4.667"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpotifyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 54 54" fill="none" aria-hidden="true" {...props}>
      <circle cx="27" cy="27" r="27" className="fill-brand-green" />
      <path
        d="M12.375 19.125c9.9-2.925 19.8-2.25 29.25 2.25M13.95 27c8.775-2.475 17.775-1.575 25.875 2.25M15.75 34.875c7.2-1.8 14.625-1.125 21.825 2.25"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M71.85 13.71C69.16 14.9006 66.3095 15.689 63.39 16.05C66.4629 14.1999 68.7641 11.3021 69.87 7.89C66.9649 9.6098 63.7903 10.8269 60.48 11.49C58.2581 9.12245 55.3176 7.55359 52.1138 7.02641C48.91 6.49923 45.6218 7.04314 42.7585 8.5739C39.8951 10.1047 37.6164 12.5369 36.2753 15.4938C34.9341 18.4507 34.6054 21.7673 35.34 24.93C29.4699 24.6301 23.7285 23.0998 18.4879 20.4381C13.2474 17.7765 8.62481 14.0431 4.92 9.48C3.02692 12.7282 2.44468 16.5763 3.29209 20.2391C4.1395 23.9019 6.35269 27.1033 9.48 29.19C7.13096 29.1039 4.83682 28.4558 2.79 27.3V27.48C2.78544 30.8929 3.96372 34.2018 6.12427 36.8437C8.28482 39.4856 11.2941 41.2971 14.64 41.97C12.467 42.5546 10.1894 42.6367 7.98 42.21C8.9238 45.1452 10.7613 47.7121 13.2356 49.5517C15.71 51.3913 18.6973 52.4116 21.78 52.47C15.6162 57.3124 7.78387 59.5132 0 58.59C6.7569 62.9287 14.6201 65.2304 22.65 65.22C49.83 65.22 64.68 42.72 64.68 23.19L64.62 21.27C67.5157 19.1796 70.015 16.589 72 13.62L71.85 13.71Z"
      />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M20 15.1a8 8 0 0 1-11.1-11.1A8 8 0 1 0 20 15.1Z"
      />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
