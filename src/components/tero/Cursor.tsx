import { useEffect, useRef } from "react";

export function TeroCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-tero-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    let dirty = false;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      dirty = true;
    };

    const tick = () => {
      if (dirty || Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        if (ringRef.current) {
          ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        }
        dirty = Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1;
      }
      raf = requestAnimationFrame(tick);
    };

    // Event delegation — no per-element listeners, no MutationObserver,
    // works for DOM added later (cards, modals, dynamic content).
    const HOVER_SELECTOR = "a, button, [data-cursor-hover]";
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(HOVER_SELECTOR)) {
        ringRef.current?.classList.add("is-hover");
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest(HOVER_SELECTOR)) {
        ringRef.current?.classList.remove("is-hover");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-tero-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="tero-cursor-ring hidden md:block" aria-hidden />
      <div ref={dotRef} className="tero-cursor-dot hidden md:block" aria-hidden />
    </>
  );
}
