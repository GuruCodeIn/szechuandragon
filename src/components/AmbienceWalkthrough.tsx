import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/* Auto-discover every ambience-*.jpg.asset.json in src/assets         */
/* ------------------------------------------------------------------ */
type AssetJson = { url: string; original_filename: string };

const ambienceModules = import.meta.glob<string>(
  "../assets/ambience-*.jpg",
  { eager: true, import: "default", query: "?url" }
);

type Scene = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

const TITLES: Record<string, { title: string; subtitle: string }> = {
  entrance: { title: "The Entrance", subtitle: "Cross the threshold of the Dragon's house." },
  reception: { title: "The Reception", subtitle: "A warm welcome beneath handwoven lanterns." },
  dining: { title: "The Grand Dining Hall", subtitle: "Where every table tells a story of flavour." },
  "lantern-ceiling": { title: "Under a Sky of Lanterns", subtitle: "A constellation of warm silk and bamboo." },
  lantern: { title: "Under a Sky of Lanterns", subtitle: "A constellation of warm silk and bamboo." },
  decor: { title: "Artistry in the Details", subtitle: "Hand-carved screens, brass and cinnabar." },
  private: { title: "The Private Chamber", subtitle: "The most intimate corner of the house." },
};

const SCENES: Scene[] = Object.entries(ambienceModules)
  .map(([path, mod]) => {
    const match = path.match(/ambience-([^.]+)\.jpg\.asset\.json$/);
    const key = match ? match[1] : path;
    const meta = TITLES[key] ?? {
      title: key
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      subtitle: "Another corner of the Dragon's house.",
    };
    return { id: key, image: mod.url, ...meta };
  })
  .sort((a, b) => {
    // Preferred narrative order; unknown ids go to the end alphabetically.
    const order = ["entrance", "reception", "dining", "lantern-ceiling", "lantern", "decor", "private"];
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    if (ai === -1 && bi === -1) return a.id.localeCompare(b.id);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

/* ------------------------------------------------------------------ */
/* Chinese door panel                                                  */
/* ------------------------------------------------------------------ */
function DoorPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2a1408 0%, #3d1e0c 40%, #1a0a04 100%)",
        boxShadow: isLeft
          ? "inset -30px 0 60px rgba(0,0,0,0.9), inset 0 0 120px rgba(0,0,0,0.6)"
          : "inset 30px 0 60px rgba(0,0,0,0.9), inset 0 0 120px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="absolute inset-0 opacity-50 mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(80,40,15,0.25) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(20,10,5,0.15) 0 40px, transparent 40px 90px)",
        }}
      />
      <div
        className="absolute inset-6 rounded-sm border-2"
        style={{
          borderColor: "rgba(200,162,90,0.55)",
          boxShadow: "inset 0 0 20px rgba(200,162,90,0.15), 0 0 15px rgba(200,162,90,0.1)",
        }}
      />
      <div className="absolute inset-10 rounded-sm border" style={{ borderColor: "rgba(200,162,90,0.3)" }} />
      <svg
        className="absolute inset-12 h-[calc(100%-6rem)] w-[calc(100%-6rem)] opacity-80"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern id={`lattice-${side}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="1" y="1" width="18" height="18" fill="none" stroke="rgba(200,162,90,0.4)" strokeWidth="0.4" />
            <rect x="5" y="5" width="10" height="10" fill="none" stroke="rgba(200,162,90,0.3)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect x="5" y="10" width="90" height="80" fill={`url(#lattice-${side})`} />
        <circle cx="50" cy="130" r="18" fill="none" stroke="rgba(230,198,122,0.7)" strokeWidth="0.6" />
        <circle cx="50" cy="130" r="14" fill="none" stroke="rgba(230,198,122,0.4)" strokeWidth="0.3" />
        <text
          x="50"
          y="136"
          textAnchor="middle"
          fontSize="14"
          fill="rgba(230,198,122,0.9)"
          fontFamily="'Cormorant Garamond', serif"
        >
          {isLeft ? "龍" : "門"}
        </text>
      </svg>
      <div
        className={`absolute top-1/2 ${isLeft ? "right-3" : "left-3"} h-16 w-3 -translate-y-1/2 rounded-full`}
        style={{
          background: "linear-gradient(180deg, #f4d78a 0%, #b58a3a 50%, #6b4818 100%)",
          boxShadow: "0 0 10px rgba(230,198,122,0.5)",
        }}
      />
      <div
        className={`absolute top-0 ${isLeft ? "right-0" : "left-0"} h-full w-[2px]`}
        style={{
          background: "linear-gradient(180deg, transparent, rgba(230,198,122,0.6), transparent)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function AmbienceWalkthrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const doorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const smokeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(1);

  /* Preload every image before mounting scroll logic */
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SCENES.map(
        (s) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = () => res();
            img.onerror = () => res();
            img.src = s.image;
          })
      )
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Initial state
      SCENES.forEach((_, i) => {
        gsap.set(sceneRefs.current[i], { autoAlpha: i === 0 ? 1 : 0 });
        gsap.set(imgRefs.current[i], { scale: 1.08, xPercent: 0, yPercent: 0 });
        gsap.set(captionRefs.current[i], { autoAlpha: i === 0 ? 1 : 0, y: 0 });
        if (i > 0) {
          gsap.set(doorRefs.current[i], { autoAlpha: 0 });
          gsap.set(leftRefs.current[i], { xPercent: 0 });
          gsap.set(rightRefs.current[i], { xPercent: 0 });
          gsap.set(glowRefs.current[i], { autoAlpha: 0, scaleX: 0 });
          gsap.set(smokeRefs.current[i], { autoAlpha: 0 });
        }
      });

      // Total scroll: ~1 viewport per scene
      const totalScroll = SCENES.length * window.innerHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Segment length per scene in timeline units (arbitrary; 1 per scene)
      SCENES.forEach((_, i) => {
        // Camera dwell for scene i
        tl.to(
          imgRefs.current[i],
          { scale: 1.18, xPercent: (i % 2 === 0 ? -1 : 1) * 2, yPercent: -1, ease: "none", duration: 1 },
          i
        );

        // Transition to next scene
        if (i < SCENES.length - 1) {
          const next = i + 1;
          // Smoke drift
          tl.fromTo(
            smokeRefs.current[next],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.15, ease: "power1.out" },
            i + 0.75
          );
          // Doors appear closed
          tl.set(doorRefs.current[next], { autoAlpha: 1 }, i + 0.85);
          // Anticipation pause (closed) — small hold in scrub, then open
          tl.to(
            [leftRefs.current[next], rightRefs.current[next]],
            { duration: 0.15 }, // hold closed
            i + 0.85
          );
          tl.to(
            glowRefs.current[next],
            { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: "power2.out" },
            i + 1.0
          );
          tl.to(leftRefs.current[next], { xPercent: -110, duration: 0.5, ease: "power3.inOut" }, i + 1.0);
          tl.to(rightRefs.current[next], { xPercent: 110, duration: 0.5, ease: "power3.inOut" }, i + 1.0);
          // Reveal next scene behind doors early
          tl.to(sceneRefs.current[next], { autoAlpha: 1, duration: 0.25 }, i + 1.05);
          tl.to(captionRefs.current[i], { autoAlpha: 0, duration: 0.2 }, i + 1.0);
          tl.to(captionRefs.current[next], { autoAlpha: 1, duration: 0.3 }, i + 1.25);
          // Hide doors + smoke completely after open
          tl.to(doorRefs.current[next], { autoAlpha: 0, duration: 0.15 }, i + 1.5);
          tl.to(smokeRefs.current[next], { autoAlpha: 0, duration: 0.3 }, i + 1.5);
          tl.to(sceneRefs.current[i], { autoAlpha: 0, duration: 0.2 }, i + 1.55);
          // Add scene counter update marker via onUpdate below
        }
      });

      // Track current scene index for counter
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalScroll}`,
        onUpdate: (self) => {
          const idx = Math.min(SCENES.length - 1, Math.floor(self.progress * SCENES.length));
          setCurrent(idx + 1);
        },
      });
    }, section);

    return () => ctx.revert();
  }, [ready]);

  const total = SCENES.length;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-labelledby="walkthrough-title"
      className="relative overflow-hidden bg-[#050301] text-white"
      style={{ height: "100vh" }}
    >
      {/* Layer 1: Ambience scenes */}
      {SCENES.map((scene, i) => (
        <div
          key={scene.id}
          ref={(el) => { sceneRefs.current[i] = el; }}
          className="absolute inset-0 h-screen w-full will-change-[opacity]"
          style={{ zIndex: 1 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              ref={(el) => { imgRefs.current[i] = el; }}
              src={scene.image}
              alt={scene.title}
              className="h-full w-full object-cover will-change-transform"
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
          {/* cinematic vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(255,160,60,0.15), transparent 65%)",
            }}
          />
        </div>
      ))}

      {/* Layer 2: Door transition overlays (one per scene, only visible during transitions) */}
      {SCENES.map((scene, i) =>
        i === 0 ? null : (
          <div
            key={`door-${scene.id}`}
            ref={(el) => { doorRefs.current[i] = el; }}
            className="pointer-events-none absolute inset-0 will-change-[opacity]"
            style={{ zIndex: 30 }}
          >
            {/* Light leak */}
            <div
              ref={(el) => { glowRefs.current[i] = el; }}
              className="absolute left-1/2 top-0 h-full w-[40%] -translate-x-1/2 will-change-transform"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,190,90,0.9) 0%, rgba(220,90,40,0.4) 45%, transparent 75%)",
                filter: "blur(30px)",
                transformOrigin: "center",
              }}
            />
            <div className="absolute inset-0 flex">
              <div
                ref={(el) => { leftRefs.current[i] = el; }}
                className="h-full w-1/2 will-change-transform"
                style={{ transform: "translate3d(0,0,0)" }}
              >
                <DoorPanel side="left" />
              </div>
              <div
                ref={(el) => { rightRefs.current[i] = el; }}
                className="h-full w-1/2 will-change-transform"
                style={{ transform: "translate3d(0,0,0)" }}
              >
                <DoorPanel side="right" />
              </div>
            </div>
          </div>
        )
      )}

      {/* Layer 3: smoke overlays */}
      {SCENES.map((scene, i) =>
        i === 0 ? null : (
          <div
            key={`smoke-${scene.id}`}
            ref={(el) => { smokeRefs.current[i] = el; }}
            className="pointer-events-none absolute inset-0 will-change-[opacity]"
            style={{
              zIndex: 25,
              background:
                "radial-gradient(ellipse at 20% 80%, rgba(180,120,60,0.35), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(220,140,60,0.28), transparent 60%)",
              filter: "blur(35px)",
            }}
          />
        )
      )}

      {/* Layer 4: UI */}
      {SCENES.map((scene, i) => (
        <div
          key={`cap-${scene.id}`}
          ref={(el) => { captionRefs.current[i] = el; }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-40 w-[min(92vw,620px)] -translate-x-1/2 text-center will-change-[opacity,transform]"
        >
          <div className="mx-auto rounded-sm border border-[#c8a25a]/30 bg-black/55 px-6 py-4 backdrop-blur-md">
            <span
              className="text-[10px] uppercase tracking-[0.5em] text-[#c8a25a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Scene {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className="mt-1 text-2xl text-[#f4d78a] md:text-3xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {scene.title}
            </h3>
            <p
              className="mt-1 text-xs text-white/70 md:text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {scene.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Section header */}
      <div className="pointer-events-none absolute left-1/2 top-8 z-40 -translate-x-1/2 text-center">
        <span
          className="text-[10px] uppercase tracking-[0.6em] text-[#c8a25a]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          A Walk Through Szechuan Dragon
        </span>
        <h2
          id="walkthrough-title"
          className="mt-2 text-2xl font-light text-[#f4d78a] md:text-3xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Cross the Threshold
        </h2>
      </div>

      {/* Progress indicator */}
      <div
        className="pointer-events-none absolute right-8 top-1/2 z-40 -translate-y-1/2 text-right"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="text-[10px] uppercase tracking-[0.5em] text-[#c8a25a]/80">Scene</div>
        <div className="mt-1 text-2xl text-[#f4d78a]">
          <span ref={counterRef}>{String(current).padStart(2, "0")}</span>
          <span className="text-[#c8a25a]/60"> / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="pointer-events-none absolute bottom-2 left-1/2 z-40 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-white/40"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Scroll · Step forward
      </div>
    </section>
  );
}
