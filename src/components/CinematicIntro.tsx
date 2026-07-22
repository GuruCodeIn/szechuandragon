import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic ~5s opening sequence for Szechuan Dragon.
 * Timeline (seconds):
 *  0.0 - 0.6   Black + wind bell (sine chime, WebAudio)
 *  0.6 - 1.6   Deep red ambient glow blooms outward
 *  1.2 - end   Smoke rises + golden embers + dust
 *  1.6 - 3.4   Golden dragon draws itself in liquid gold (SVG stroke)
 *  2.6 - 3.6   Logo fades in inside the dragon ring
 *  3.4 - 4.2   Dragon "breathes fire" — bright particle burst across screen
 *  4.2 - 5.0   Fire dissolves to particles then to smoke wipe
 *  5.0         Smoke transforms into the Hero (intro unmounts)
 */
export default function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sequence phases
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 400),   // glow
      setTimeout(() => setPhase(2), 1200),  // smoke + dragon draw
      setTimeout(() => setPhase(3), 2600),  // logo
      setTimeout(() => setPhase(4), 3400),  // fire
      setTimeout(() => setPhase(5), 4300),  // smoke wipe
      setTimeout(() => onDone(), 5100),     // done
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  // Wind bell chime (WebAudio, ~1s)
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const now = ctx.currentTime;
      const notes = [1046, 1318, 1568, 2093]; // C6 E6 G6 C7
      notes.forEach((f, i) => {
        const o = ctx!.createOscillator();
        const g = ctx!.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.06, now + 0.02 + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + i * 0.12);
        o.connect(g).connect(ctx!.destination);
        o.start(now + i * 0.12);
        o.stop(now + 2 + i * 0.12);
      });
    } catch {
      /* silent */
    }
    return () => {
      try { ctx?.close(); } catch { /* noop */ }
    };
  }, []);

  // Ambient particles (embers + dust) — starts at phase 2
  useEffect(() => {
    if (phase < 2) return;
    const canvas = canvasRef.current;
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
        vx: (Math.random() - 0.5) * 0.4 * dpr,
        vy: -(0.3 + Math.random() * 0.8) * dpr,
        r: (Math.random() * 2 + 0.6) * dpr,
        life: 0,
        max: 220 + Math.random() * 200,
        hue: 30 + Math.random() * 20,
      });
    };
    let raf = 0;
    const tick = () => {
      if (particles.length < 180) spawn();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.002 * dpr;
        p.life++;
        const alpha = Math.sin((p.life / p.max) * Math.PI) * 0.9;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${alpha})`);
        grd.addColorStop(1, "hsla(20, 90%, 40%, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
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
  }, [phase]);

  // Fire burst — phase 4
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
    for (let i = 0; i < 380; i++) {
      const ang = (Math.random() - 0.5) * 0.9;
      const spd = (6 + Math.random() * 14) * dpr;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd * 0.4,
        r: (Math.random() * 2.5 + 1) * dpr,
        life: 0,
        max: 40 + Math.random() * 40,
      });
    }
    let raf = 0;
    const tick = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life++;
        const t = 1 - p.life / p.max;
        if (t <= 0) continue;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grd.addColorStop(0, `hsla(45, 100%, 70%, ${t})`);
        grd.addColorStop(0.4, `hsla(30, 100%, 55%, ${t * 0.7})`);
        grd.addColorStop(1, "hsla(0, 80%, 30%, 0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
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
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Deep red ambient bloom */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.4 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 55%, rgba(255,90,40,0.35) 0%, rgba(140,10,10,0.35) 25%, rgba(60,0,0,0.5) 55%, #000 80%)",
            }}
          />

          {/* Rising smoke — CSS layered gradients */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 1.6 }}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[80%]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 100%, rgba(180,120,80,0.35), transparent 60%), radial-gradient(ellipse at 30% 90%, rgba(120,60,40,0.3), transparent 55%), radial-gradient(ellipse at 70% 95%, rgba(90,40,30,0.3), transparent 60%)",
                filter: "blur(30px)",
              }}
              animate={{ y: [40, -40, 40], scale: [1, 1.08, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Particles canvas */}
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 mix-blend-screen" />

          {/* Dragon SVG — draws itself with stroke-dashoffset */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <motion.svg
              width="520"
              height="520"
              viewBox="0 0 400 400"
              className="max-w-[80vw] max-h-[80vh]"
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{
                opacity: phase >= 2 ? 1 : 0,
                scale: phase >= 2 ? 1 : 0.85,
                rotate: phase >= 2 ? 0 : -8,
              }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                filter:
                  "drop-shadow(0 0 18px rgba(255,180,80,0.75)) drop-shadow(0 0 40px rgba(220,80,20,0.5))",
              }}
            >
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff2c4" />
                  <stop offset="45%" stopColor="#f5c15a" />
                  <stop offset="100%" stopColor="#c1751a" />
                </linearGradient>
                <radialGradient id="logoGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="rgba(255,200,120,0.9)" />
                  <stop offset="100%" stopColor="rgba(120,20,20,0)" />
                </radialGradient>
              </defs>

              {/* Dragon body — stylized coiled ring with wisps */}
              <motion.path
                d="M200,60
                   C 300,60 350,140 340,220
                   C 330,300 250,340 180,330
                   C 110,320 70,260 80,190
                   C 90,120 150,80 210,90
                   C 260,98 300,140 300,190
                   C 300,240 260,270 220,268
                   C 190,266 170,246 172,220
                   M 340,220
                   Q 360,200 375,215
                   Q 380,225 370,235
                   M 172,220
                   Q 160,205 168,192
                   M 220,268
                   Q 215,285 232,290
                   Q 245,290 245,278"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: 2400, strokeDashoffset: 2400 }}
                animate={{ strokeDashoffset: phase >= 2 ? 0 : 2400 }}
                transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
              />
              {/* dragon scales/whiskers */}
              <motion.path
                d="M300,190 q10,-8 22,-6 M300,190 q8,10 4,22 M172,220 q-14,-4 -22,4 M340,220 q10,10 6,26"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ strokeDasharray: 220, strokeDashoffset: 220 }}
                animate={{ strokeDashoffset: phase >= 2 ? 0 : 220 }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              />

              {/* Logo center — fades in at phase 3 */}
              <motion.g
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: phase >= 3 ? 1 : 0,
                  scale: phase >= 3 ? 1 : 0.7,
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <circle cx="200" cy="200" r="70" fill="url(#logoGlow)" />
                <circle
                  cx="200"
                  cy="200"
                  r="42"
                  fill="none"
                  stroke="#f5c15a"
                  strokeWidth="1.2"
                  opacity="0.9"
                />
                <text
                  x="200"
                  y="196"
                  textAnchor="middle"
                  fill="#f5c15a"
                  fontSize="26"
                  fontFamily="serif"
                  fontWeight="700"
                >
                  囍
                </text>
                <text
                  x="200"
                  y="222"
                  textAnchor="middle"
                  fill="#f5e4b8"
                  fontSize="11"
                  letterSpacing="4"
                  fontFamily="'Cormorant Garamond', serif"
                >
                  SZECHUAN
                </text>
                <text
                  x="200"
                  y="236"
                  textAnchor="middle"
                  fill="#f5e4b8"
                  fontSize="11"
                  letterSpacing="4"
                  fontFamily="'Cormorant Garamond', serif"
                >
                  DRAGON
                </text>
              </motion.g>
            </motion.svg>
          </div>

          {/* Fire flash canvas */}
          <canvas
            ref={fireCanvasRef}
            className="pointer-events-none absolute inset-0 mix-blend-screen"
            style={{ opacity: phase === 4 ? 1 : 0, transition: "opacity 300ms" }}
          />

          {/* Bright fire flash */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 4 ? [0, 0.85, 0.4, 0] : 0 }}
            transition={{ duration: 0.9, times: [0, 0.2, 0.5, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,220,140,0.9), rgba(230,100,30,0.4) 30%, transparent 60%)",
            }}
          />

          {/* Final smoke wipe */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 5 ? 1 : 0 }}
            transition={{ duration: 0.9 }}
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(30,15,10,0.2), rgba(0,0,0,0.85) 70%)",
              backdropFilter: "blur(12px)",
            }}
          />

          {/* Skip button */}
          <button
            onClick={onDone}
            className="absolute bottom-6 right-6 z-10 border border-[#f5c15a]/40 px-4 py-2 text-[10px] tracking-[0.35em] text-[#f5c15a]/80 backdrop-blur-md transition hover:border-[#f5c15a] hover:text-[#f5c15a]"
          >
            SKIP INTRO
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
