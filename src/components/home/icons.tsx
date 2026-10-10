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

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
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

export function RefreshIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13.333 6.667A5.333 5.333 0 0 0 3.2 4.8M2.667 9.333A5.333 5.333 0 0 0 12.8 11.2M3.2 2v2.8H6M12.8 14v-2.8H10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
