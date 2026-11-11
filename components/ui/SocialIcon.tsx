import type { ReactNode } from "react";

// Social marks, 24px line icons
const ICONS: Record<string, ReactNode> = {
  LinkedIn: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  Clutch: (
    <>
      <path d="M18 6.3A8.2 8.2 0 1 0 18 17.7" />
      <circle cx="13.2" cy="12" r="2.4" />
    </>
  ),
  X: (
    <>
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M4 20l6.8-6.8M13.2 10.8L20 4" />
    </>
  ),
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  Facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  GitHub: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5-2.6-.5-5.4-.5-8 0C6 2 5 2 5 2c-.3 1.2-.3 2.4 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1-.9 1.7-.2.6-.2 1.2-.1 1.8v4" />
      <path d="M9 18c-4.5 2-5-2-7-2" />
    </>
  ),
};

export const SOCIAL_ORDER = ["LinkedIn", "Clutch", "X", "Instagram", "Facebook", "GitHub"] as const;

// An icon that links when a URL is set, and is a plain mark otherwise
export default function SocialIcon({ name, url, className = "soc-ic", size = 20 }: { name: string; url?: string; className?: string; size?: number }) {
  // LinkedIn reads better as a solid mark
  const solid = name === "LinkedIn";
  const svg = (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
  if (url)
    return (
      <a className={className} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Corevex Solutions on ${name}`}>
        {svg}
      </a>
    );
  return (
    <span className={`${className} is-static`} role="img" aria-label={name}>
      {svg}
    </span>
  );
}
