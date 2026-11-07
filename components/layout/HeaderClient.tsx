"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from "react";

type Menu = { drawer: boolean; setDrawer: (open: boolean) => void; menuBtn: RefObject<HTMLButtonElement | null> };
const MenuCtx = createContext<Menu | null>(null);
const useMenu = () => useContext(MenuCtx)!;

const HOVER = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";

// Shared drawer state
export function HeaderState({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [lastPath, setLastPath] = useState(path);
  const menuBtn = useRef<HTMLButtonElement>(null);
  if (path !== lastPath) {
    setLastPath(path);
    setDrawer(false);
  }
  return <MenuCtx.Provider value={{ drawer, setDrawer, menuBtn }}>{children}</MenuCtx.Provider>;
}

// Header bar, hides on scroll down
export function HeaderBar({ children }: { children: ReactNode }) {
  const { drawer } = useMenu();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const h = y > last && y > 160 && !document.body.classList.contains("menu-open");
      setHidden(h);
      document.body.classList.toggle("header-on", !h);
      last = y;
    };
    document.body.classList.add("header-on");
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`header${hidden && !drawer ? " is-hidden" : ""}`}>
      <div className="wrap">{children}</div>
    </header>
  );
}

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const path = usePathname();
  return (
    <Link href={href} aria-current={path?.startsWith(href) ? "page" : undefined}>
      {children}
    </Link>
  );
}

// Services mega menu
export function ServicesMenu({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(path);
  const li = useRef<HTMLLIElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const openT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hovered = useRef(false);

  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  // Pending hover timers never outlive a route
  useEffect(
    () => () => {
      clearTimeout(openT.current);
      clearTimeout(closeT.current);
    },
    [path],
  );

  useEffect(() => {
    if (!open) return;
    const outside = (e: globalThis.PointerEvent) => {
      if (!li.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      btn.current?.focus();
    };
    const scroll = () => setOpen(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
    };
  }, [open]);

  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !matchMedia(HOVER).matches) return;
    hovered.current = true;
    clearTimeout(closeT.current);
    clearTimeout(openT.current);
    openT.current = setTimeout(() => setOpen(true), 120);
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hovered.current = false;
    clearTimeout(openT.current);
    closeT.current = setTimeout(() => setOpen(false), 250);
  };
  // A mouse click keeps a hover-opened menu open; keyboard and touch toggle
  const toggle = (e: MouseEvent) => {
    clearTimeout(openT.current);
    setOpen((o) => (e.detail > 0 && hovered.current ? true : !o));
  };
  const linkClick = (e: MouseEvent) => {
    if ((e.target as Element).closest("a")) setOpen(false);
  };
  const labelClick = () => {
    clearTimeout(openT.current);
    setOpen(false);
  };

  return (
    <li ref={li} className={`has-mega${open ? " is-open" : ""}`} onPointerEnter={enter} onPointerLeave={leave}>
      <Link href="/services/" aria-current={path?.startsWith("/services/") ? "page" : undefined} onClick={labelClick}>
        Services
      </Link>
      <button ref={btn} type="button" className="mega-toggle" aria-label="Services menu" aria-expanded={open} aria-controls="services-menu" onClick={toggle}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id="services-menu" className="mega" role="region" aria-label="Services" onClick={linkClick}>
        {children}
      </div>
    </li>
  );
}

export function MenuButton() {
  const { drawer, setDrawer, menuBtn } = useMenu();
  return (
    <button ref={menuBtn} className="menu-btn" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}>
      <span />
      <span />
      <span />
    </button>
  );
}

// Mobile drawer
export function Drawer({ children }: { children: ReactNode }) {
  const { drawer, setDrawer, menuBtn } = useMenu();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", drawer);
    document.body.style.overflow = drawer ? "hidden" : "";
    const el = box.current;
    if (!drawer || !el) return;
    el.querySelector<HTMLElement>(".close")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setDrawer(false);
      if (e.key !== "Tab") return;
      const f = Array.from(el.querySelectorAll<HTMLElement>("a[href],button,summary")).filter((x) => x.offsetParent !== null || x === document.activeElement);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    const opener = menuBtn.current;
    return () => {
      document.removeEventListener("keydown", key);
      opener?.focus();
    };
  }, [drawer, setDrawer, menuBtn]);

  return (
    <div ref={box} className={`drawer${drawer ? " is-open" : ""}`} aria-label="Mobile menu" role="dialog" aria-modal={drawer || undefined} inert={!drawer}>
      <button className="close" aria-label="Close menu" onClick={() => setDrawer(false)}>
        ×
      </button>
      {children}
    </div>
  );
}
