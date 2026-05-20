import { useEffect, useRef } from "react";

export function TeroCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("has-tero-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const enter = () => ringRef.current?.classList.add("is-hover");
    const leave = () => ringRef.current?.classList.remove("is-hover");

    const bindHover = () => {
      document
        .querySelectorAll<HTMLElement>("a, button, [data-cursor-hover]")
        .forEach((el) => {
          el.addEventListener("mouseenter", enter);
          el.addEventListener("mouseleave", leave);
        });
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    const t = setTimeout(bindHover, 400);
    const obs = new MutationObserver(bindHover);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      clearTimeout(t);
      obs.disconnect();
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
