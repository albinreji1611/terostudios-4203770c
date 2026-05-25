/**
 * Site-wide ambient background — soft glowing orbs that drift slowly using
 * CSS animations (GPU-composited, no per-frame JS) for smooth performance.
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ mixBlendMode: "screen", contain: "strict" }}
    >
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />

      <style>{`
        .ambient-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          will-change: transform;
          transform: translate3d(0,0,0);
        }
        .ambient-orb-1 {
          width: 620px; height: 620px;
          left: -10vw; top: 10vh;
          background: radial-gradient(circle at center, rgba(232,57,14,0.22) 0%, transparent 65%);
          animation: ambient-drift-1 38s ease-in-out infinite alternate;
        }
        .ambient-orb-2 {
          width: 680px; height: 680px;
          right: -10vw; top: 50vh;
          background: radial-gradient(circle at center, rgba(45,27,110,0.24) 0%, transparent 65%);
          animation: ambient-drift-2 46s ease-in-out infinite alternate;
        }
        @keyframes ambient-drift-1 {
          to { transform: translate3d(40vw, 30vh, 0); }
        }
        @keyframes ambient-drift-2 {
          to { transform: translate3d(-30vw, -25vh, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-orb { animation: none; }
        }
      `}</style>
    </div>
  );
}
