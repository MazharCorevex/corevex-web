"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "@/lib/analytics";

const ANSWERS: Array<[string, string, string]> = [
  ["refund", "Refunds are processed within 5 business days of approval. You can start one from Orders, then Request refund.", "Source: Refund policy, section 2"],
  ["ship", "Standard shipping takes 3 to 5 business days. Express orders placed before 2pm ship the same day.", "Source: Shipping guide"],
  ["price", "Pricing depends on your plan. I can connect you with the sales team for a tailored quote.", "Source: Sales handbook"],
  ["", "I found this in the knowledge base: our support team is available Monday to Friday, and urgent issues are escalated to an on-call engineer.", "Source: Support handbook"],
];

// AI Lab demos
export default function Demo({ kind, className, children }: { kind: "chat" | "extract" | "flow"; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current!;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const offs: Array<() => void> = [];

    if (kind === "chat") {
      const form = box.querySelector("form");
      const list = box.querySelector<HTMLElement>(".chat");
      const input = box.querySelector("input");
      if (form && list && input) {
        list.setAttribute("aria-live", "polite");
        const add = (who: string, t: string, s?: string) => {
          const d = document.createElement("div");
          d.className = "msg " + who;
          d.textContent = t;
          if (s) {
            const sm = document.createElement("small");
            sm.textContent = s;
            d.appendChild(sm);
          }
          list.appendChild(d);
          list.scrollTop = list.scrollHeight;
        };
        const submit = (e: Event) => {
          e.preventDefault();
          const q = input.value.trim();
          if (!q) return;
          add("me", q);
          input.value = "";
          track("demo_use", { demo: "chat" });
          const a = ANSWERS.find((x) => x[0] && q.toLowerCase().includes(x[0])) || ANSWERS[3];
          timers.push(setTimeout(() => add("ai", a[1], a[2]), 700));
        };
        form.addEventListener("submit", submit);
        offs.push(() => form.removeEventListener("submit", submit));
      }
    } else {
      const btn = box.querySelector("button");
      const sel = kind === "extract" ? ".fields div" : ".flow div";
      const first = kind === "extract" ? 300 : 200;
      const gap = kind === "extract" ? 350 : 600;
      if (btn) {
        const run = () => {
          const f = Array.from(box.querySelectorAll<HTMLElement>(sel));
          f.forEach((x) => x.classList.remove("on"));
          f.forEach((x, i) => timers.push(setTimeout(() => x.classList.add("on"), first + i * gap)));
          track("demo_use", { demo: kind });
        };
        btn.addEventListener("click", run);
        offs.push(() => btn.removeEventListener("click", run));
      }
    }
    return () => {
      offs.forEach((f) => f());
      timers.forEach(clearTimeout);
    };
  }, [kind]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
