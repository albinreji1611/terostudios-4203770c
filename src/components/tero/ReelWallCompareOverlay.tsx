import { useEffect, useState } from "react";

const STORAGE_KEY = "tero.reelwall.compare";

type State = {
  src: string | null;
  opacity: number;
  visible: boolean;
  blend: "normal" | "difference";
  offsetY: number;
  scale: number;
};

const DEFAULT: State = {
  src: null,
  opacity: 0.5,
  visible: true,
  blend: "normal",
  offsetY: 0,
  scale: 1,
};

export function ReelWallCompareOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<State>(DEFAULT);

  // Toggle with Shift+O
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "O" || e.key === "o")) {
        setEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  if (!enabled) return null;

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setState((s) => ({ ...s, src: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <>
      {state.src && state.visible && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[9998]"
          style={{
            mixBlendMode: state.blend,
          }}
        >
          <img
            src={state.src}
            alt=""
            className="absolute left-1/2 top-1/2 max-w-none"
            style={{
              transform: `translate(-50%, calc(-50% + ${state.offsetY}px)) scale(${state.scale})`,
              opacity: state.opacity,
              width: "100vw",
              height: "auto",
            }}
          />
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[9999] w-[280px] rounded-lg bg-black/85 p-3 text-xs text-white shadow-2xl ring-1 ring-white/15 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold tracking-wide">Compare overlay</span>
          <button
            className="text-white/60 hover:text-white"
            onClick={() => setEnabled(false)}
            title="Hide (Shift+O)"
          >
            ✕
          </button>
        </div>

        <label className="mb-2 flex cursor-pointer items-center justify-center rounded border border-dashed border-white/30 px-2 py-3 text-center text-[11px] text-white/70 hover:bg-white/5">
          {state.src ? "Replace reference image" : "Upload reference image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>

        {state.src && (
          <>
            <div className="mb-2 flex items-center justify-between gap-2">
              <button
                className="flex-1 rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                onClick={() => setState((s) => ({ ...s, visible: !s.visible }))}
              >
                {state.visible ? "Hide" : "Show"}
              </button>
              <button
                className="flex-1 rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    blend: s.blend === "normal" ? "difference" : "normal",
                  }))
                }
              >
                {state.blend === "difference" ? "Diff" : "Normal"}
              </button>
              <button
                className="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
                onClick={() => setState(DEFAULT)}
                title="Reset"
              >
                ↺
              </button>
            </div>

            <Slider
              label={`Opacity ${(state.opacity * 100).toFixed(0)}%`}
              min={0}
              max={1}
              step={0.01}
              value={state.opacity}
              onChange={(v) => setState((s) => ({ ...s, opacity: v }))}
            />
            <Slider
              label={`Scale ${state.scale.toFixed(2)}x`}
              min={0.5}
              max={2}
              step={0.01}
              value={state.scale}
              onChange={(v) => setState((s) => ({ ...s, scale: v }))}
            />
            <Slider
              label={`Y offset ${state.offsetY}px`}
              min={-400}
              max={400}
              step={1}
              value={state.offsetY}
              onChange={(v) => setState((s) => ({ ...s, offsetY: v }))}
            />
          </>
        )}

        <div className="mt-2 text-[10px] text-white/40">Toggle: Shift + O</div>
      </div>
    </>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mb-2 block">
      <div className="mb-1 text-[11px] text-white/70">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white"
      />
    </label>
  );
}
