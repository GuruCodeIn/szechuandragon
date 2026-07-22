import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dragonRing from "@/assets/dragon-ring.png";

/**
 * Cinematic ~7s opening sequence for Szechuan Dragon.
 * Phases:
 *  0  0.0-1.2s   Pure black. Faint embers begin to drift up.
 *  1  1.2-2.6s   Deep crimson ambient bloom + volumetric smoke rises.
 *  2  2.6-4.6s   Golden dragon ring emerges from darkness (scale, rotate, glow).
 *  3  4.2-5.4s   Logo materialises inside the ring with metallic shimmer.
 *  4  5.4-6.2s   Dragon exhales — massive fire burst fills the screen.
 *  5  6.2-7.0s   Fire dissolves into thick smoke wipe.
 *  6  7.0s       Done — hero revealed underneath.
 */
export default function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const emberCanvasRef = useRef<HTMLCanvasElement>(null);
  const fireCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 4200),
      setTimeout(() => setPhase(4), 5400),
      setTimeout(() => setPhase(5), 6200),
      setTimeout(() => onDone(), 7000),
      setTimeout(() => setShowSkip(true), 2000),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  // Wind bell / gong chime
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const ac = ctx;
      const now = ac.currentTime;
      // Deep gong drone
      const gong = ac.createOscillator();
      const gGain = ac.createGain();
      gong.type = "sine";
      gong.frequency.value = 96;
      gGain.gain.setValueAtTime(0.0001, now);
      gGain.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
      gGain.gain.exponentialRampToValueAtTime(0.0001, now + 5);
      gong.connect(gGain).connect(ac.destination);
      gong.start(now);
      gong.stop(now + 5.2);
      // Bell chime
      const notes = [1046, 1318, 1568, 2093];
      notes.forEach((f, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + 1 + i * 0.14);
        g.gain.exponentialRampToValueAtTime(0.05, now + 1.02 + i * 0.14);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3 + i * 0.14);
        o.connect(g).connect(ac.destination);
        o.start(now + 1 + i * 0.14);
        o.stop(now + 3.2 + i * 0.14);
      });
    } catch {
      /* silent */
    }
    return () => {
      try { ctx?.close(); } catch { /* noop */ }
    };
  }, []);

  // Ambient floating embers (from phase 0)
  useEffect(() => {
    const canvas = emberCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; hue: number };
    const particles: P[] = [];
    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5 * dpr,
        vy: -(0.2 + Math.random() * 0.7) * dpr,
        r: (Math.random() * 1.8 + 0.4) * dpr,
        life: 0,
        max: 260 + Math.random() * 220,
        hue: 28 + Math.random() * 22,
      });
    };
    let raf = 0;
    const tick = () => {
      if (particles.length < 220) spawn();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.15 * dpr;
        p.y += p.vy;
        p.vy -= 0.0015 * dpr;
        p.life++;
        const alpha = Math.sin((p.life / p.max) * Math.PI) * 0.9;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
        grd.addColorStop(0, `hsla(${p.hue}, 95%, 68%, ${alpha})`);
        grd.addColorStop(1, "hsla(18, 90%, 30%, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2);
        ctx.fill();
        if (p.life > p.max) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Fire blast — phase 4
  useEffect(() => {
    if (phase !== 4) return;
    const canvas = fireCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.5;
    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number };
    const particles: P[] = [];
    for (let i = 0; i < 620; i++) {
      const ang = (Math.random() - 0.5) * 1.4;
      const spd = (7 + Math.random() * 22) * dpr;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd * 0.5,
        r: (Math.random() * 3 + 1) * dpr,
        life: 0,
        max: 45 + Math.random() * 55,
      });
    }
    let raf = 0;
    const tick = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.982;
        p.vy *= 0.982;
        p.vy -= 0.06 * dpr; // heat rises
        p.life++;
        const t = 1 - p.life / p.max;
        if (t <= 0) continue;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 10);
        grd.addColorStop(0, `hsla(48, 100%, 75%, ${t})`);
        grd.addColorStop(0.35, `hsla(28, 100%, 55%, ${t * 0.75})`);
        grd.addColorStop(1, "hsla(0, 80%, 25%, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 10, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase < 6 && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Deep crimson ambient bloom */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              scale: phase >= 1 ? 1 : 0.35,
            }}
            transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 55%, rgba(255,90,40,0.32) 0%, rgba(140,10,10,0.32) 22%, rgba(50,0,0,0.55) 55%, #000 82%)",
            }}
          />

          {/* Rising volumetric smoke */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 1.8 }}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[90%]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 100%, rgba(180,120,80,0.32), transparent 60%), radial-gradient(ellipse at 30% 90%, rgba(120,60,40,0.28), transparent 55%), radial-gradient(ellipse at 70% 95%, rgba(90,40,30,0.28), transparent 60%)",
                filter: "blur(38px)",
              }}
              animate={{ y: [50, -40, 50], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Ambient embers */}
          <canvas
            ref={emberCanvasRef}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
          />

          {/* Volumetric light rays cutting through smoke */}
          <motion.div
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 0.5 : 0 }}
            transition={{ duration: 2 }}
            style={{
              background:
                "conic-gradient(from 210deg at 50% 30%, transparent 0deg, rgba(255,180,90,0.18) 15deg, transparent 40deg, transparent 320deg, rgba(255,180,90,0.15) 345deg, transparent 360deg)",
              filter: "blur(24px)",
            }}
          />

          {/* Dragon ring — emerges from darkness */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.55, rotate: -25, filter: "blur(30px) brightness(0.3)" }}
              animate={{
                opacity: phase >= 2 ? (phase >= 4 ? 0.9 : 1) : 0,
                scale: phase >= 2 ? (phase >= 4 ? 1.15 : 1) : 0.55,
                rotate: phase >= 2 ? 0 : -25,
                filter:
                  phase >= 2
                    ? "blur(0px) brightness(1.15)"
                    : "blur(30px) brightness(0.3)",
              }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity, filter" }}
            >
              {/* Glow halo */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,180,80,0.55) 0%, rgba(220,80,20,0.35) 30%, transparent 65%)",
                  filter: "blur(50px)",
                }}
                animate={{
                  opacity: phase >= 2 ? [0.6, 1, 0.6] : 0,
                  scale: [1, 1.08, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Slow rotating dragon */}
              <motion.img
                src={dragonRing}
                alt=""
                width={560}
                height={560}
                className="relative block max-w-[82vw] max-h-[82vh]"
                animate={{ rotate: phase >= 2 ? [0, 4, 0, -4, 0] : 0 }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  filter:
                    "drop-shadow(0 0 30px rgba(255,180,80,0.7)) drop-shadow(0 0 70px rgba(220,80,20,0.55))",
                }}
                draggable={false}
              />

              {/* Logo appears inside ring */}
              <motion.div
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: phase >= 3 ? (phase >= 4 ? 0.7 : 1) : 0,
                  scale: phase >= 3 ? 1 : 0.6,
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-center" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  <motion.div
                    className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full border border-[#f5c15a]/70"
                    animate={{ boxShadow: [
                      "0 0 12px rgba(245,193,90,0.4)",
                      "0 0 28px rgba(245,193,90,0.75)",
                      "0 0 12px rgba(245,193,90,0.4)",
                    ]}}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-xl font-bold text-[#f5c15a]">囍</span>
                  </motion.div>
                  <div
                    className="text-[22px] font-semibold tracking-[0.28em]"
                    style={{
                      background: "linear-gradient(180deg,#fff4c8 0%,#f5c15a 45%,#a06b1a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    SZECHUAN
                  </div>
                  <div
                    className="text-[22px] font-semibold tracking-[0.28em] -mt-1"
                    style={{
                      background: "linear-gradient(180deg,#fff4c8 0%,#f5c15a 45%,#a06b1a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    DRAGON
                  </div>
                  <div className="mt-2 text-[9px] tracking-[0.5em] text-[#f5c15a]/80">
                    INDO · CHINESE · CUISINE
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Fire flash canvas */}
          <canvas
            ref={fireCanvasRef}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{ opacity: phase === 4 ? 1 : 0, transition: "opacity 300ms" }}
          />

          {/* Bright fire flash overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 4 ? [0, 0.9, 0.5, 0.15] : 0 }}
            transition={{ duration: 0.9, times: [0, 0.2, 0.6, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,225,150,0.95), rgba(230,100,30,0.55) 28%, transparent 60%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Final smoke wipe */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 5 ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(40,20,15,0.35), rgba(0,0,0,0.9) 70%)",
              backdropFilter: "blur(18px)",
            }}
          />

          {/* Film grain overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
            }}
          />

          {/* Vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          {/* Skip */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={onDone}
                className="absolute bottom-8 right-8 z-10 border border-[#f5c15a]/40 px-5 py-2.5 text-[10px] tracking-[0.4em] text-[#f5c15a]/85 backdrop-blur-md transition hover:border-[#f5c15a] hover:text-[#f5c15a] hover:shadow-[0_0_25px_rgba(245,193,90,0.35)]"
              >
                SKIP INTRO
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
