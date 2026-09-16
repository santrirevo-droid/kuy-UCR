import type { SVGProps } from "react";

// Set ikon garis internal — menggantikan emoji di seluruh UI supaya tampilan
// konsisten lintas platform (emoji dirender beda-beda di tiap OS) dan terbaca
// lebih formal. Semua path digambar di grid 24×24 dengan stroke 1.5 mengikuti
// currentColor, jadi ukuran & warna cukup diatur lewat className.
const paths: Record<string, JSX.Element> = {
  // — Tahap perjalanan —
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 5-5 2.1 2.1-5z" />
    </>
  ),
  users: (
    <>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 5.2a3 3 0 0 1 0 5.6" />
    </>
  ),
  suitcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8.5 7.5v-2a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v2M3 12.5h18" />
    </>
  ),
  plane: <path d="M10.5 19.5 12 21l1.5-1.5v-4.2l6.6 2.3.9-1.4-7.5-5V5.2a1.5 1.5 0 0 0-3 0v5.9l-7.5 5 .9 1.5 6.6-2.4z" />,
  building: (
    <>
      <path d="M4 20V6.5a1.5 1.5 0 0 1 .9-1.4l6-2.4a1.5 1.5 0 0 1 2.1 1.4V20M13 20V9h5.5a1.5 1.5 0 0 1 1.5 1.5V20M3 20h18" />
      <path d="M7.5 8.5v0M7.5 12v0M7.5 15.5v0M16.5 13v0M16.5 16.5v0" strokeLinecap="round" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M8 13.5h2M14 13.5h2M8 17h2M14 17h2" strokeLinecap="round" />
    </>
  ),
  wallet: (
    <>
      <path d="M20 9V7.5a2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 4v12.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V15" />
      <path d="M4 4a1.5 1.5 0 0 1 1.5-1.5H17" />
      <path d="M21 9.5h-4a2.5 2.5 0 0 0 0 5h4z" />
    </>
  ),
  flag: (
    <>
      <path d="M5.5 21V3.5" />
      <path d="M5.5 4.5h11l-2 3.5 2 3.5h-11" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="m5.6 5.6 3.8 3.8M14.6 14.6l3.8 3.8M18.4 5.6l-3.8 3.8M9.4 14.6l-3.8 3.8" />
    </>
  ),
  "clipboard-check": (
    <>
      <path d="M9 4.5H7.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H15" />
      <rect x="9" y="2.5" width="6" height="4" rx="1.2" />
      <path d="m9.5 13 2 2 3.5-4" />
    </>
  ),

  // — Navigasi & aksi —
  "arrow-left": <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  "arrow-right": <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7m0 0h-7m7 0v7" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z" />,
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8 8M16 16l2-2M14 14l2-2" />
    </>
  ),
  "file-text": (
    <>
      <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
      <path d="M13.5 3v5.5H19M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  "chart-bar": (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V6M17 20v-9" />
    </>
  ),
  "user-cog": (
    <>
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M3.5 20v-1.2A4.3 4.3 0 0 1 7.8 14.5h3" />
      <circle cx="17" cy="17" r="2.6" />
      <path d="M17 13.2v.9M17 19.9v.9M20.3 15.1l-.8.5M14.5 18.4l-.8.5M20.3 18.9l-.8-.5M14.5 15.6l-.8-.5" />
    </>
  ),
  "log-out": <path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2M10 12h10m0 0-3-3m3 3-3 3" />,
  alert: (
    <>
      <path d="M12 4.5 2.8 20h18.4z" />
      <path d="M12 10v4.2M12 17.2v.2" strokeLinecap="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.2" strokeLinecap="round" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.5 18h5M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.4 10.9c.6.4.9 1 .9 1.7v.4h5v-.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.3 2" />
    </>
  ),
  link: <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.6 1.6M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.6-1.6" />,
  pencil: (
    <>
      <path d="M4 20h4L19.2 8.8a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="m14.8 5.6 3 3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M3 3 21 21" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 4.2A9.8 9.8 0 0 1 12 4c5 0 9 4 10 8a17.6 17.6 0 0 1-2.2 3.2" />
      <path d="M6.6 6.6C4.2 8.1 2.5 10.3 2 12c.9 3.1 3.9 6.2 8 7.5 1 .3 2 .5 3 .5" />
    </>
  ),
  "wifi-off": (
    <>
      <path d="M3 3 21 21" />
      <path d="M12 18.5v.2" strokeLinecap="round" />
      <path d="M8.2 14.7a5.4 5.4 0 0 1 6-1M5 11.3a10.2 10.2 0 0 1 4.4-2.4M2 8a15 15 0 0 1 5-3.1M12 5c3.6 0 7 1.4 10 3.1M19 11.3a13 13 0 0 0-2.6-1.7" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.5,
  ...rest
}: { name: IconName; className?: string; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
