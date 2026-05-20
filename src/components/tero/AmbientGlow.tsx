import { motion } from "framer-motion";

/**
 * Site-wide ambient "video-like" background — soft glowing orbs that
 * drift slowly across the viewport. Fixed, behind all content, ignores pointer events.
 */
export function AmbientGlow() {
  const blobs = [
    {
      color: "rgba(232,57,14,0.22)", // vermillion
      size: 620,
      from: { x: "-10vw", y: "10vh" },
      to: { x: "60vw", y: "70vh" },
      duration: 28,
    },
    {
      color: "rgba(45,27,110,0.28)", // violet
      size: 720,
      from: { x: "70vw", y: "-10vh" },
      to: { x: "10vw", y: "80vh" },
      duration: 36,
    },
    {
      color: "rgba(196,154,60,0.22)", // amber
      size: 520,
      from: { x: "40vw", y: "80vh" },
      to: { x: "80vw", y: "20vh" },
      duration: 32,
    },
    {
      color: "rgba(120,200,180,0.18)", // teal
      size: 480,
      from: { x: "5vw", y: "60vh" },
      to: { x: "65vw", y: "5vh" },
      duration: 40,
    },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          initial={{ x: b.from.x, y: b.from.y }}
          animate={{
            x: [b.from.x, b.to.x, b.from.x],
            y: [b.from.y, b.to.y, b.from.y],
          }}
          transition={{
            duration: b.duration,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 65%)`,
            filter: "blur(60px)",
            position: "absolute",
            left: 0,
            top: 0,
            borderRadius: "9999px",
            willChange: "transform",
          }}
        />
      ))}

      {/* Faint moving noise particles */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
