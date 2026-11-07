"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { WHATSAPP_NUMBER } from "@/lib/site";

const TEXT = encodeURIComponent("Hi Corevex, can you help me with ");
// Phones: wa.me opens the app chat
export const WA_APP = `https://wa.me/${WHATSAPP_NUMBER}?text=${TEXT}`;
// Desktop: the installed app first, WhatsApp Web if it is missing
export const WA_DESKTOP = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${TEXT}`;
export const WA_WEB = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${TEXT}`;
const WAIT = 1500;

const isDesktop = () => matchMedia("(hover: hover) and (pointer: fine)").matches && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// WhatsApp chat button
export default function WhatsAppChat() {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isDesktop() && link.current) link.current.href = WA_WEB;
  }, []);

  const open = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktop() || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    // If the app opens, this window loses focus; otherwise fall back to the web
    let launched = false;
    const mark = () => {
      launched = true;
    };
    window.addEventListener("blur", mark);
    document.addEventListener("visibilitychange", mark);
    window.location.href = WA_DESKTOP;
    setTimeout(() => {
      window.removeEventListener("blur", mark);
      document.removeEventListener("visibilitychange", mark);
      if (!launched && document.hasFocus()) window.open(WA_WEB, "_blank", "noopener,noreferrer");
    }, WAIT);
  };

  if (!WHATSAPP_NUMBER) return null;
  return (
    <a ref={link} className="wa-chat" href={WA_APP} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp (opens in a new tab)" onClick={open}>
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A13 13 0 0 0 16.04 29C23.2 29 29 23.17 29 16S23.2 3 16.04 3Zm0 23.8c-1.98 0-3.92-.53-5.62-1.54l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.75 10.75 0 0 1-1.65-5.8c0-5.96 4.86-10.8 10.84-10.8 5.97 0 10.8 4.84 10.8 10.8 0 5.96-4.84 10.8-10.8 10.8Zm5.93-8.09c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.17-.22.32-.84 1.05-1.03 1.27-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.25-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.33.33-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.71s1.17 3.15 1.33 3.36c.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.5.21 2.06.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.42.19-1.55-.08-.14-.3-.22-.62-.38Z"
        />
      </svg>
      <span className="wa-label">Chat on WhatsApp</span>
    </a>
  );
}
