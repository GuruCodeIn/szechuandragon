import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import entranceAsset from "@/assets/ambience-entrance.jpg.asset.json";
import receptionAsset from "@/assets/ambience-reception.jpg.asset.json";
import diningAsset from "@/assets/ambience-dining.jpg.asset.json";
import lanternAsset from "@/assets/ambience-lantern-ceiling.jpg.asset.json";
import decorAsset from "@/assets/ambience-decor.jpg.asset.json";
import privateAsset from "@/assets/ambience-private.jpg.asset.json";

type Scene = {
  id: string;
  chapter: string;
  title: string;
  caption: string;
  image: string;
  /** camera move within the scene */
  from: { scale: number; x: number; y: number; rotate?: number };
  to: { scale: number; x: number; y: number; rotate?: number };
};

const SCENES: Scene[] = [
  {
    id: "entrance",
    chapter: "Scene I",
    title: "The Entrance",
    caption: "Soft lantern light spills onto the doorway. Step inside.",
    image: entranceAsset.url,
    from: { scale: 1.05, x: 0, y: 0 },
    to: { scale: 1.35, x: 0, y: -2 },
  },
  {
    id: "reception",
    chapter: "Scene II",
    title: "The Reception",
    caption: "A warm welcome beneath handwoven lanterns.",
    image: receptionAsset.url,
    from: { scale: 1.15, x: -3, y: 2 },
    to: { scale: 1.3, x: 3, y: -2 },
  },
  {
    id: "dining",
    chapter: "Scene III",
    title: "The Grand Dining Hall",
    caption: "Where every table tells a story of flavour.",
    image: diningAsset.url,
    from: { scale: 1.1, x: 4, y: 0 },
    to: { scale: 1.25, x: -4, y: 0 },
  },
  {
    id: "lantern",
    chapter: "Scene IV",
    title: "Under a Sky of Lanterns",
    caption: "Look up — a constellation of warm silk and bamboo.",
    image: lanternAsset.url,
    from: { scale: 1.2, x: 0, y: 4, rotate: -1 },
    to: { scale: 1.05, x: 0, y: -3, rotate: 1 },
  },
  {
    id: "decor",
    chapter: "Scene V",
    title: "Artistry in the Details",
    caption: "Hand-carved screens, painted verses, brass and cinnabar.",
    image: decorAsset.url,
    from: { scale: 1.15, x: -4, y: 0 },
    to: { scale: 1.28, x: 4, y: -2 },
  },
  {
    id: "private",
    chapter: "Scene VI",
    title: "The Private Chamber",
    caption: "The most intimate corner of the Dragon's house.",
    image: privateAsset.url,
    from: { scale: 1.1, x: 0, y: 0 },
    to: { scale: 1.22, x: 0, y: 0 },
  },
];

/* One scene band inside the total scroll:
   [enter(open door)] → [dwell(camera moves)] → [exit(next door closes/opens through)]
   We use 0..1 progress per scene.
*/
const SCENE_COUNT = SCENES.length;

/* ------------------------------------------------------------------ */
/* Chinese door pair                                                   */
/* ------------------------------------------------------------------ */
function DoorPanel({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="relative h-full w-1/2 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2a1408 0%, #3d1e0c 40%, #1a0a04 100%)",
        boxShadow: isLeft
          ? "inset -30px 0 60px rgba(0,0,0,0.9), inset 0 0 120px rgba(0,0,0,0.6)"
          : "inset 30px 0 60px rgba(0,0,0,0.9), inset 0 0 120px rgba(0,0,0,0.6)",
      }}
    >
      {/* wood grain */}
      <div
        className="absolute inset-0 opacity-50 mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(80,40,15,0.25) 0 2px, transparent 2px 6px), repeating-linear-gradient(90deg, rgba(20,10,5,0.15) 0 40px, transparent 40px 90px)",
        }}
      />
      {/* Inner gold frame */}
      <div
        className="absolute inset-6 border-2 rounded-sm"
        style={{
          borderColor: "rgba(200,162,90,0.55)",
          boxShadow:
            "inset 0 0 20px rgba(200,162,90,0.15), 0 0 15px rgba(200,162,90,0.1)",
        }}
      />
      <div
        className="absolute inset-10 border rounded-sm"
        style={{ borderColor: "rgba(200,162,90,0.3)" }}
      />

      {/* Lattice carving */}
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
        {/* dragon medallion */}
        <circle cx="50" cy="130" r="18" fill="none" stroke="rgba(230,198,122,0.7)" strokeWidth="0.6" />
        <circle cx="50" cy="130" r="14" fill="none" stroke="rgba(230,198,122,0.4)" strokeWidth="0.3" />
        <text
          x="50"
          y="135"
          textAnchor="middle"
          fontSize="14"
          fill="rgba(230,198,122,0.85)"
          fontFamily="'Cormorant Garamond', serif"
        >
          {isLeft ? "龍" : "門"}
        </text>
      </svg>

      {/* Brass handle */}
      <div
        className={`absolute top-1/2 ${isLeft ? "right-3" : "left-3"} h-16 w-3 -translate-y-1/2 rounded-full`}
        style={{
          background:
            "linear-gradient(180deg, #f4d78a 0%, #b58a3a 50%, #6b4818 100%)",
          boxShadow: "0 0 10px rgba(230,198,122,0.5)",
        }}
      />
      <div
        className={`absolute top-1/2 ${isLeft ? "right-2" : "left-2"} h-5 w-5 -translate-y-1/2 rounded-full`}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #f4d78a, #8a5a1c 70%, #3a1e08)",
          boxShadow: "0 0 12px rgba(230,198,122,0.6)",
        }}
      />

      {/* Edge highlight */}
      <div
        className={`absolute top-0 ${isLeft ? "right-0" : "left-0"} h-full w-[2px]`}
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(230,198,122,0.6), transparent)",
        }}
      />
    </div>
  );
}

function DoorTransition({
  progress,
  label,
}: {
  progress: MotionValue<number>; // 0 closed → 1 fully open
  label?: string;
}) {
  // Left door slides left, right door slides right
  const leftX = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const rightX = useTransform(progress, [0, 1], ["0%", "100%"]);
  const glow = useTransform(progress, [0, 0.3, 1], [0, 1, 0.7]);
  const gapWidth = useTransform(progress, [0, 1], ["0%", "100%"]);
  const cover = useTransform(progress, [0, 0.98, 1], [1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30"
      style={{ opacity: cover }}
    >
      {/* Warm light leaking through the gap */}
      <motion.div
        className="absolute left-1/2 top-0 h-full -translate-x-1/2"
        style={{
          width: gapWidth,
          background:
            "radial-gradient(ellipse at center, rgba(255,190,90,0.85) 0%, rgba(220,90,40,0.4) 40%, transparent 75%)",
          filter: "blur(20px)",
          opacity: glow,
        }}
      />

      {/* The two door panels */}
      <div className="absolute inset-0 flex">
        <motion.div className="h-full w-1/2" style={{ x: leftX }}>
          <DoorPanel side="left" />
        </motion.div>
        <motion.div className="h-full w-1/2" style={{ x: rightX }}>
          <DoorPanel side="right" />
        </motion.div>
      </div>

      {/* Threshold shadow */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0,0,0,0.7))",
        }}
      />

      {label && (
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: useTransform(progress, [0, 0.3, 0.8], [0, 1, 0]) }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.6em] text-[#e6c67a]/80"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {label}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene layer                                                         */
/* ------------------------------------------------------------------ */
function SceneLayer({
  scene,
  visibility, // 0..1
  camera, // 0..1 (scene-local dwell progress)
}: {
  scene: Scene;
  visibility: MotionValue<number>;
  camera: MotionValue<number>;
}) {
  const scale = useTransform(camera, [0, 1], [scene.from.scale, scene.to.scale]);
  const x = useTransform(camera, [0, 1], [scene.from.x, scene.to.x]);
  const y = useTransform(camera, [0, 1], [scene.from.y, scene.to.y]);
  const rotate = useTransform(
    camera,
    [0, 1],
    [scene.from.rotate ?? 0, scene.to.rotate ?? 0]
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity: visibility }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale, x: useTransform(x, (v) => `${v}%`), y: useTransform(y, (v) => `${v}%`), rotate }}
      >
        <img
          src={scene.image}
          alt={scene.title}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </motion.div>
      {/* Cinematic vignette + warm tone */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,160,60,0.15), transparent 65%)",
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient (embers, dust, light rays)                                  */
/* ------------------------------------------------------------------ */
function Ambient() {
  const [particles, setParticles] = useState<
    { id: number; x: number; d: number; delay: number; size: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        d: 10 + Math.random() * 14,
        delay: Math.random() * 10,
        size: 1 + Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {/* Volumetric rays */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "conic-gradient(from 210deg at 50% -10%, transparent 0deg, rgba(255,180,90,0.25) 20deg, transparent 40deg, transparent 340deg, rgba(255,180,90,0.2) 360deg)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Golden dust */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-0 rounded-full bg-[#e6c67a]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 6px #e6c67a",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -900, opacity: [0, 0.9, 0], x: [0, 20, -15, 0] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Drifting smoke */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 80%, rgba(180,120,60,0.25), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(220,140,60,0.2), transparent 55%)",
          filter: "blur(30px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function AmbienceWalkthrough() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.7 });

  // Each scene occupies 1/SCENE_COUNT of scroll.
  // Within a scene band:
  //   0.0 – 0.25 : door opens (from previous scene, or entrance for scene 0)
  //   0.25 – 0.85: dwell / camera pushes forward
  //   0.85 – 1.0 : fade toward next
  const bandSize = 1 / SCENE_COUNT;

  const sceneMotions = useMemo(
    () =>
      SCENES.map((_, i) => ({
        start: i * bandSize,
        end: (i + 1) * bandSize,
      })),
    [bandSize]
  );

  return (
    <section
      ref={ref}
      id="ambience-walkthrough"
      aria-labelledby="walkthrough-title"
      className="relative bg-black text-white"
      style={{ height: `${SCENE_COUNT * 120}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base black */}
        <div className="absolute inset-0 bg-[#050301]" />

        {/* Scene layers */}
        {SCENES.map((scene, i) => {
          const { start, end } = sceneMotions[i];
          // Visibility: fade in on door-open, hold, fade out
          const visibility = useTransform(
            p,
            [
              Math.max(0, start - 0.02),
              start + bandSize * 0.15,
              end - bandSize * 0.05,
              end + 0.01,
            ],
            [0, 1, 1, 0]
          );
          // Camera dwell progress 0..1 across the scene
          const camera = useTransform(p, [start, end], [0, 1]);
          return (
            <SceneLayer
              key={scene.id}
              scene={scene}
              visibility={visibility}
              camera={camera}
            />
          );
        })}

        <Ambient />

        {/* Door transitions: one before each scene */}
        {SCENES.map((scene, i) => {
          const { start } = sceneMotions[i];
          // Door open window: last 15% of previous band → first 5% of current band
          const doorStart = Math.max(0, start - bandSize * 0.15);
          const doorEnd = start + bandSize * 0.02;
          const doorProgress = useTransform(p, [doorStart, doorEnd], [0, 1]);
          return (
            <DoorTransition
              key={`door-${scene.id}`}
              progress={doorProgress}
              label={`${scene.chapter} · ${scene.title}`}
            />
          );
        })}

        {/* Caption card */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-40 w-[min(92vw,620px)] -translate-x-1/2 text-center">
          {SCENES.map((scene, i) => {
            const { start, end } = sceneMotions[i];
            const opacity = useTransform(
              p,
              [start + bandSize * 0.2, start + bandSize * 0.35, end - bandSize * 0.1, end],
              [0, 1, 1, 0]
            );
            const y = useTransform(
              p,
              [start + bandSize * 0.2, start + bandSize * 0.4],
              [20, 0]
            );
            return (
              <motion.div
                key={scene.id}
                className="absolute inset-x-0 bottom-0"
                style={{ opacity, y }}
              >
                <div className="mx-auto rounded-sm border border-[#c8a25a]/30 bg-black/55 px-6 py-4 backdrop-blur-md">
                  <span
                    className="text-[10px] uppercase tracking-[0.5em] text-[#c8a25a]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {scene.chapter}
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
                    {scene.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section title (appears at first scene only) */}
        <div className="pointer-events-none absolute left-1/2 top-8 z-40 -translate-x-1/2 text-center">
          <motion.div
            style={{
              opacity: useTransform(p, [0, 0.05, 0.15], [1, 1, 0]),
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.6em] text-[#c8a25a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A Walk Through Szechuan Dragon
            </span>
            <h2
              id="walkthrough-title"
              className="mt-2 text-3xl font-light text-[#f4d78a] md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Cross the Threshold
            </h2>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-2 left-1/2 z-40 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Scroll · Step forward
        </motion.div>

        {/* Final dim to next section */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 bg-black"
          style={{ opacity: useTransform(p, [0.94, 1], [0, 1]) }}
        />
      </div>
    </section>
  );
}
