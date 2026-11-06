"use client";

import { useEffect, useRef, useState } from "react";
import type { TeamMember } from "@/lib/types";

// Leadership cards and bio sheet
export default function LeaderSheet({ team }: { team: TeamMember[] }) {
  const [open, setOpen] = useState<TeamMember | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const shut = () => {
    setOpen(null);
    opener.current?.focus();
  };

  return (
    <>
      <div className="leaders" data-reveal-group="">
        {team.map((m) => (
          <button
            key={m.slug}
            className="leader"
            aria-haspopup="dialog"
            onClick={(e) => {
              opener.current = e.currentTarget;
              setOpen(m);
            }}
          >
            <div className="ph">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.image} alt={`${m.name}, ${m.role} of Corevex Solutions`} width={400} height={500} loading="lazy" decoding="async" />
            </div>
            <div className="info">
              <h3>{m.name}</h3>
              <span>{m.role}</span>
              <p>{m.short}</p>
            </div>
          </button>
        ))}
      </div>
      <div
        className={`sheet${open ? " is-open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && shut()}
        role="dialog"
        aria-modal="true"
        aria-label={open ? `${open.name}, ${open.role}` : "Leader profile"}
        inert={!open}
      >
        <div className="in">
          <button className="x" ref={close} onClick={shut} aria-label="Close">
            ×
          </button>
          <div className="content">
            {open && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={open.image} alt={open.name} width={140} height={175} />
                <h3>{open.name}</h3>
                <p className="role">{open.role}</p>
                {open.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                {open.linkedin && (
                  <a className="link" href={open.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn <span className="chev">»</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
