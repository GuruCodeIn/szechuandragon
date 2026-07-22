import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Node = { title: string; content: string };

const NODES: Node[] = [
  {
    title: "The Beginning",
    content:
      "Official restaurant history will be added after discussion with the restaurant owner.",
  },
  {
    title: "Our Philosophy",
    content:
      "Placeholder for the restaurant's culinary vision, values and commitment to authentic Indo-Chinese cuisine.",
  },
  {
    title: "Craftsmanship",
    content:
      "Placeholder for how every dish is prepared with passion, fresh ingredients and authentic recipes.",
  },
  {
    title: "Looking Ahead",
    content:
      "Placeholder for future expansion, vision and continued dedication to exceptional dining experiences.",
  },
];

type Particle = { left: string; delay: string; duration: string; size: number };
type Smoke = { top: string; delay: string; duration: string; opacity: number };
type Brush = { top: string; left: string; rotate: number; delay: string; duration: string; width: number };

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: "-15% 0px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-15% 0px" });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [smoke, setSmoke] = useState<Smoke[]>([]);
  const [brushes, setBrushes] = useState<Brush[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, () => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${10 + Math.random() * 12}s`,
        size: 1 + Math.random() * 2,
      })),
    );
    setSmoke(
      Array.from({ length: 5 }, (_, i) => ({
        top: `${15 + i * 18}%`,
        delay: `${i * 3}s`,
        duration: `${22 + Math.random() * 10}s`,
        opacity: 0.05 + Math.random() * 0.05,
      })),
    );
    setBrushes(
      Array.from({ length: 4 }, (_, i) => ({
        top: `${15 + i * 22 + Math.random() * 8}%`,
        left: `${i % 2 === 0 ? 5 : 55}%`,
        rotate: -15 + Math.random() * 30,
        delay: `${i * 4}s`,
        duration: `${12 + Math.random() * 6}s`,
        width: 200 + Math.random() * 180,
      })),
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-40"
      style={{ background: "#080808" }}
    >
      {/* Paper texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.65  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Warm lantern corner glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,150,60,0.18) 0%, rgba(200,60,30,0.08) 40%, transparent 70%)",
          animation: "lanternPulse 6s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-20 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,50,0.15) 0%, rgba(180,50,20,0.06) 40%, transparent 70%)",
          animation: "lanternPulse 7.5s ease-in-out infinite 1s",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(180,40,30,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Dragon silhouette watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025]"
      >
        <svg width="900" height="900" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="#D4AF37" strokeWidth="0.6" />
          <circle cx="100" cy="100" r="60" stroke="#D4AF37" strokeWidth="0.4" />
          <path
            d="M40 100 Q70 60 100 100 T160 100"
            stroke="#D4AF37"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      </div>

      {/* Drifting smoke */}
      {smoke.map((s, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute h-32 w-[60%]"
          style={{
            top: s.top,
            left: "-30%",
            background:
              "radial-gradient(ellipse, rgba(200,180,140,0.5) 0%, transparent 70%)",
            filter: "blur(30px)",
            opacity: s.opacity,
            animation: `smokeDrift ${s.duration} linear infinite ${s.delay}`,
          }}
        />
      ))}

      {/* Ink brush strokes */}
      {brushes.map((b, i) => (
        <svg
          key={i}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: b.top,
            left: b.left,
            width: b.width,
            transform: `rotate(${b.rotate}deg)`,
            animation: `brushFade ${b.duration} ease-in-out infinite ${b.delay}`,
          }}
          viewBox="0 0 300 40"
        >
          <path
            d="M5 20 Q 60 5, 140 22 T 295 18"
            stroke="rgba(212,175,55,0.35)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ))}

      {/* Floating dust particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: "rgba(212,175,55,0.6)",
            boxShadow: "0 0 6px rgba(212,175,55,0.5)",
            animation: `dustRise ${p.duration} linear infinite ${p.delay}`,
          }}
        />
      ))}

      {/* ---------- Header ---------- */}
      <div ref={headerRef} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Chinese seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={headerInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-md"
          style={{
            background:
              "linear-gradient(135deg, #8B1A1A 0%, #5A0F0F 100%)",
            boxShadow:
              "0 0 24px rgba(180,40,30,0.35), inset 0 0 8px rgba(0,0,0,0.4)",
          }}
        >
          <span
            className="text-2xl font-serif"
            style={{ color: "#F4E4C1", textShadow: "0 0 6px rgba(0,0,0,0.6)" }}
          >
            龍
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl font-light tracking-[0.25em]"
          style={{
            color: "#D4AF37",
            textShadow: "0 0 30px rgba(212,175,55,0.25)",
          }}
        >
          Our Story
        </motion.h2>

        {/* Animated brush stroke under heading */}
        <div className="relative mx-auto mt-8 h-4 w-64">
          <motion.svg
            viewBox="0 0 300 12"
            className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <motion.path
              d="M4 6 Q 80 1, 150 7 T 296 5"
              stroke="url(#brushGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={headerInView ? { pathLength: 1 } : {}}
              transition={{ delay: 1.1, duration: 1.6, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="brushGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="rgba(212,175,55,0)" />
                <stop offset="0.2" stopColor="rgba(212,175,55,0.9)" />
                <stop offset="0.8" stopColor="rgba(244,208,120,1)" />
                <stop offset="1" stopColor="rgba(212,175,55,0)" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.5, duration: 1.2 }}
          className="mx-auto mt-8 max-w-2xl font-serif text-base md:text-lg italic leading-relaxed"
          style={{ color: "rgba(244,228,193,0.7)" }}
        >
          Every unforgettable dining experience begins with a story. This section
          will later be personalized with the official journey of Szechuan Dragon.
        </motion.p>
      </div>

      {/* ---------- Timeline ---------- */}
      <div
        ref={timelineRef}
        className="relative z-10 mx-auto mt-24 max-w-6xl px-6"
      >
        {/* Vertical golden line */}
        <div className="pointer-events-none absolute left-6 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={timelineInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: "top",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.9) 12%, rgba(244,208,120,1) 50%, rgba(212,175,55,0.9) 88%, transparent 100%)",
              boxShadow: "0 0 14px rgba(212,175,55,0.5)",
              height: "100%",
              width: "100%",
            }}
          />
        </div>

        <div className="relative space-y-20 md:space-y-28">
          {NODES.map((node, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={node.title}
                initial={{ opacity: 0, y: 40 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1.1,
                  delay: 1.2 + idx * 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative flex items-center gap-6 md:gap-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Seal node */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-20">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={
                      timelineInView ? { scale: 1, rotate: 0 } : {}
                    }
                    transition={{
                      duration: 0.9,
                      delay: 1.4 + idx * 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative flex h-12 w-12 items-center justify-center rounded-sm -translate-x-1/2"
                    style={{
                      background:
                        "linear-gradient(135deg, #8B1A1A 0%, #5A0F0F 100%)",
                      boxShadow:
                        "0 0 20px rgba(180,40,30,0.55), 0 0 40px rgba(212,175,55,0.25), inset 0 0 6px rgba(0,0,0,0.5)",
                      border: "1px solid rgba(212,175,55,0.6)",
                    }}
                  >
                    <span
                      className="font-serif text-lg"
                      style={{ color: "#F4E4C1" }}
                    >
                      {["福", "禪", "藝", "宏"][idx]}
                    </span>
                  </motion.div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />

                {/* Card */}
                <div
                  className={`ml-20 md:ml-0 md:w-1/2 ${
                    isLeft ? "md:pr-16" : "md:pl-16"
                  }`}
                >
                  <StoryCard title={node.title} content={node.content} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom smoke transition */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-40 w-full"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(8,8,8,0.6) 60%, #080808 100%)",
        }}
      />

      <style>{`
        @keyframes lanternPulse {
          0%,100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes smokeDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(220%); }
        }
        @keyframes brushFade {
          0%, 100% { opacity: 0; }
          20%, 70% { opacity: 1; }
        }
        @keyframes dustRise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function StoryCard({ title, content }: { title: string; content: string }) {
  return (
    <div
      className="group relative rounded-sm p-8 transition-all duration-500 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(180deg, rgba(20,15,12,0.85) 0%, rgba(12,10,10,0.9) 100%)",
        border: "1px solid rgba(212,175,55,0.2)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
      }}
    >
      {/* Hover glow border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          border: "1px solid rgba(244,208,120,0.75)",
          boxShadow:
            "0 0 30px rgba(212,175,55,0.25), inset 0 0 20px rgba(212,175,55,0.08)",
        }}
      />
      {/* Corner ornaments */}
      <span
        aria-hidden
        className="absolute left-2 top-2 h-3 w-3 border-l border-t"
        style={{ borderColor: "rgba(212,175,55,0.6)" }}
      />
      <span
        aria-hidden
        className="absolute right-2 top-2 h-3 w-3 border-r border-t"
        style={{ borderColor: "rgba(212,175,55,0.6)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-2 left-2 h-3 w-3 border-b border-l"
        style={{ borderColor: "rgba(212,175,55,0.6)" }}
      />
      <span
        aria-hidden
        className="absolute bottom-2 right-2 h-3 w-3 border-b border-r"
        style={{ borderColor: "rgba(212,175,55,0.6)" }}
      />

      <h3
        className="font-serif text-2xl md:text-3xl font-light tracking-widest"
        style={{
          color: "#D4AF37",
          textShadow: "0 0 12px rgba(212,175,55,0.25)",
        }}
      >
        {title}
      </h3>
      <div
        className="mt-3 h-px w-16"
        style={{
          background:
            "linear-gradient(90deg, rgba(212,175,55,0.9), transparent)",
        }}
      />
      <p
        className="mt-5 font-serif text-[15px] md:text-base italic leading-relaxed"
        style={{ color: "rgba(244,228,193,0.72)" }}
      >
        {content}
      </p>
    </div>
  );
}
