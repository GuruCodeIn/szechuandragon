import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import soupImg from "@/assets/dish-hot-sour-soup.png";
import babycornImg from "@/assets/dish-chilli-basil-babycorn.png";
import chilliBasilChickenImg from "@/assets/dish-chilli-basil-chicken.png";
import lollipopImg from "@/assets/dish-chicken-lollipop.png";

type Course = {
  id: string;
  index: number;
  category: string;
  name: string;
  price: string;
  description: string;
  image: string;
  ingredients: string[];
  /** table position (percent of table width/height from center) */
  x: number;
  y: number;
  size: number;
  rotate: number;
};

const COURSES: Course[] = [
  {
    id: "soup",
    index: 0,
    category: "Course One · Soup",
    name: "Chicken Hot & Sour Soup",
    price: "₹ 320",
    description:
      "A time-honoured Szechuan classic — silken tofu, wood-ear mushroom and slow-braised chicken in a fiery, tangy broth.",
    image: soupImg,
    ingredients: ["Mushroom", "Spring Onion", "White Pepper", "Tofu"],
    x: -22,
    y: -6,
    size: 240,
    rotate: -6,
  },
  {
    id: "appetizer",
    index: 1,
    category: "Course Two · Appetizer",
    name: "Chilli Basil Babycorn",
    price: "₹ 340",
    description:
      "Crisped babycorn tossed in an aromatic chilli-basil glaze, finished tableside with fresh Thai basil.",
    image: babycornImg,
    ingredients: ["Basil", "Bird's Eye Chilli", "Garlic", "Babycorn"],
    x: 22,
    y: -10,
    size: 220,
    rotate: 10,
  },
  {
    id: "special",
    index: 2,
    category: "Course Three · Chef's Special",
    name: "Chilli Basil Chicken",
    price: "₹ 460",
    description:
      "The chef's signature — wok-charred chicken lacquered in a smouldering chilli-basil reduction. The soul of the feast.",
    image: chilliBasilChickenImg,
    ingredients: ["Basil", "Soy", "Chilli", "Garlic", "Ginger"],
    x: 0,
    y: 12,
    size: 300,
    rotate: 0,
  },
  {
    id: "classic",
    index: 3,
    category: "Course Four · Classic Favourite",
    name: "Chicken Lollipop",
    price: "₹ 380",
    description:
      "Frenched drumettes glazed in a house red-chilli lacquer — the dish that turned regulars into family.",
    image: lollipopImg,
    ingredients: ["Red Chilli", "Spring Onion", "Ginger"],
    x: -28,
    y: 22,
    size: 210,
    rotate: -14,
  },
];

const PLACEHOLDERS = [
  { label: "Noodles", note: "This journey will continue", x: 28, y: 22 },
  { label: "Rice", note: "Coming soon", x: 30, y: 4 },
  { label: "Dessert", note: "The final act awaits", x: -6, y: -22 },
];

/* ------------------------------------------------------------------ */
/*  Steam                                                              */
/* ------------------------------------------------------------------ */
function Steam({ active }: { active: boolean }) {
  const puffs = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ id: i, delay: i * 0.7, x: (i - 2.5) * 6 })),
    []
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-24 -translate-x-1/2 -translate-y-full">
      <AnimatePresence>
        {active &&
          puffs.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 0, y: 20, x: p.x, scale: 0.6 }}
              animate={{ opacity: [0, 0.35, 0], y: -120, x: p.x + (p.id % 2 ? 12 : -12), scale: 2.4 }}
              transition={{ duration: 4.5, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
              className="absolute left-1/2 bottom-0 h-10 w-10 -translate-x-1/2 rounded-full bg-white/50 blur-2xl"
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ingredient labels                                                  */
/* ------------------------------------------------------------------ */
function IngredientRing({ items, active }: { items: string[]; active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {active &&
          items.map((label, i) => {
            const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const r = 140;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.span
                key={label}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], x, y, scale: 1 }}
                transition={{ duration: 3.2, delay: 0.4 + i * 0.2, repeat: Infinity, repeatDelay: 2 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[#c8a25a]/40 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#e6c67a] backdrop-blur-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </motion.span>
            );
          })}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Plate                                                              */
/* ------------------------------------------------------------------ */
function Plate({ course, revealed, focused }: { course: Course; revealed: boolean; focused: boolean }) {
  const [hover, setHover] = useState(false);
  const active = focused || hover;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x: `calc(${course.x}% - 50%)`, y: `calc(${course.y}% - 50%)` }}
      initial={false}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        initial={{ y: -280, opacity: 0, rotate: course.rotate - 30, scale: 0.6 }}
        animate={
          revealed
            ? { y: 0, opacity: 1, rotate: course.rotate, scale: active ? 1.06 : 1 }
            : { y: -280, opacity: 0, rotate: course.rotate - 30, scale: 0.6 }
        }
        transition={{ type: "spring", stiffness: 55, damping: 16, mass: 1.2 }}
        style={{ width: course.size, height: course.size }}
        className="relative"
      >
        {/* Golden aura */}
        <motion.div
          animate={{ opacity: active ? 0.9 : 0.35, scale: active ? 1.15 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-[-30%] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(230,198,122,0.35), rgba(220,60,40,0.15) 45%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        {/* Plate shadow on wood */}
        <div
          className="absolute inset-x-4 bottom-2 h-6 rounded-full bg-black/70 blur-md"
          style={{ opacity: 0.7 }}
        />
        <IngredientRing items={course.ingredients} active={revealed} />
        <Steam active={revealed} />
        <motion.img
          src={course.image}
          alt={course.name}
          width={course.size}
          height={course.size}
          loading="lazy"
          className="relative h-full w-full select-none object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          animate={{ rotate: active ? course.rotate + 8 : course.rotate }}
          transition={{ duration: 4, ease: "easeInOut" }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder plate                                                  */
/* ------------------------------------------------------------------ */
function Placeholder({ p, revealed }: { p: (typeof PLACEHOLDERS)[number]; revealed: boolean }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 flex flex-col items-center"
      style={{ x: `calc(${p.x}% - 50%)`, y: `calc(${p.y}% - 50%)` }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: revealed ? 0.7 : 0, scale: revealed ? 1 : 0.7 }}
      transition={{ duration: 1.4, delay: 0.4 }}
    >
      <div
        className="flex h-40 w-40 items-center justify-center rounded-full border border-dashed border-[#c8a25a]/40"
        style={{
          background: "radial-gradient(closest-side, rgba(200,162,90,0.05), transparent 70%)",
        }}
      >
        <span
          className="text-[11px] uppercase tracking-[0.4em] text-[#c8a25a]/80"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {p.label}
        </span>
      </div>
      <span
        className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {p.note}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  The dining table (CSS 3D)                                          */
/* ------------------------------------------------------------------ */
function DiningTable({ tilt, rotate }: { tilt: number; rotate: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: "min(1100px, 92vw)",
        height: "min(720px, 62vw)",
        transformStyle: "preserve-3d",
        perspective: 1400,
      }}
      animate={{ rotateX: tilt, rotateZ: rotate }}
      transition={{ type: "spring", stiffness: 20, damping: 18 }}
    >
      {/* Table surface */}
      <div
        className="absolute inset-0 rounded-[50%] shadow-[0_80px_120px_rgba(0,0,0,0.9)]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, #3a1e10 0%, #2a1509 35%, #150902 70%, #0a0400 100%)",
        }}
      >
        {/* Wood grain */}
        <div
          className="absolute inset-0 rounded-[50%] opacity-40 mix-blend-overlay"
          style={{
            background:
              "repeating-radial-gradient(ellipse at 50% 50%, rgba(120,70,30,0.15) 0 3px, transparent 3px 9px)",
          }}
        />
        {/* Lantern reflection */}
        <div
          className="absolute inset-0 rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 15%, rgba(255,180,90,0.35), transparent 55%)",
          }}
        />
        {/* Gold engraved border */}
        <div
          className="absolute inset-[2%] rounded-[50%] border-[3px]"
          style={{
            borderColor: "rgba(200,162,90,0.55)",
            boxShadow:
              "inset 0 0 30px rgba(200,162,90,0.25), 0 0 30px rgba(200,162,90,0.2)",
          }}
        />
        <div
          className="absolute inset-[5%] rounded-[50%] border"
          style={{ borderColor: "rgba(200,162,90,0.25)" }}
        />
        {/* Chinese carving pattern */}
        <svg
          className="absolute inset-[3%] h-[94%] w-[94%] opacity-40"
          viewBox="0 0 400 260"
          fill="none"
          aria-hidden
        >
          <defs>
            <pattern id="dragonScale" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <path
                d="M8 0 A8 8 0 0 1 16 8 A8 8 0 0 1 0 8 A8 8 0 0 1 8 0"
                stroke="rgba(200,162,90,0.4)"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
          </defs>
          <ellipse cx="200" cy="130" rx="190" ry="118" stroke="url(#dragonScale)" strokeWidth="1" fill="none" />
        </svg>
      </div>
      {/* Table shadow on floor */}
      <div
        className="absolute -bottom-16 left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl"
        style={{ transform: "translate(-50%, 0) rotateX(90deg)" }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient background                                                 */
/* ------------------------------------------------------------------ */
function Ambient() {
  const [embers, setEmbers] = useState<{ id: number; x: number; d: number; delay: number }[]>([]);
  useEffect(() => {
    setEmbers(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        d: 8 + Math.random() * 10,
        delay: Math.random() * 8,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep red ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(120,20,10,0.35), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(200,60,20,0.15), transparent 60%)",
        }}
      />
      {/* Blurred architecture silhouette */}
      <div
        className="absolute inset-x-0 top-0 h-[40%] opacity-30 blur-2xl"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(80,20,10,0.4) 40%, transparent 100%)",
        }}
      />
      {/* Lantern light left */}
      <motion.div
        className="absolute -left-40 top-1/4 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,140,60,0.35), transparent 70%)" }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-1/3 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,100,40,0.3), transparent 70%)" }}
        animate={{ opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Embers */}
      {embers.map((e) => (
        <motion.span
          key={e.id}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-[#e6c67a]"
          style={{ left: `${e.x}%`, boxShadow: "0 0 8px #e6c67a" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -800, opacity: [0, 1, 0], x: [0, 30, -20, 0] }}
          transition={{ duration: e.d, delay: e.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */
export default function DragonsFeast() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth progress
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 });

  // Table entrance: rotates from 85° down to ~55° across the first 12% of scroll
  const tableTilt = useTransform(p, [0, 0.12], [85, 55]);
  const tableRotate = useTransform(p, [0, 1], [-8, 4]);
  // Camera z-ish (scale)
  const cameraScale = useTransform(p, [0, 0.12, 0.9, 1], [0.7, 1, 1, 0.94]);
  const dim = useTransform(p, [0.92, 1], [1, 0.3]);
  const smokeCover = useTransform(p, [0.9, 1], [0, 1]);

  const [tiltVal, setTiltVal] = useState(85);
  const [rotVal, setRotVal] = useState(-8);
  useEffect(() => {
    const u1 = tableTilt.on("change", setTiltVal);
    const u2 = tableRotate.on("change", setRotVal);
    return () => {
      u1();
      u2();
    };
  }, [tableTilt, tableRotate]);

  // Course reveal thresholds
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const u = p.on("change", setProgress);
    return () => u();
  }, [p]);

  const courseReveal = (i: number) => {
    // Each course reveals within a scroll band after the table lands.
    const start = 0.14 + i * 0.16;
    return progress >= start;
  };
  const focusedIndex = Math.min(
    COURSES.length - 1,
    Math.max(0, Math.floor((progress - 0.14) / 0.16))
  );
  const placeholdersRevealed = progress >= 0.14 + COURSES.length * 0.16;
  const active = COURSES[focusedIndex];

  return (
    <section
      ref={sectionRef}
      id="dragons-feast"
      aria-labelledby="dragons-feast-title"
      className="relative bg-[#050302] text-white"
      style={{ height: "560vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <Ambient />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute left-1/2 top-8 z-20 -translate-x-1/2 text-center"
        >
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-[#c8a25a]/60 bg-[#8b1a1a]/40 text-[#f4d78a]">
            <span
              className="text-xs font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              龍
            </span>
          </div>
          <h2
            id="dragons-feast-title"
            className="text-4xl font-light tracking-wide text-[#f4d78a] md:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Dragon's Feast
          </h2>
          <p
            className="mx-auto mt-3 max-w-lg text-xs uppercase tracking-[0.4em] text-white/60 md:text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            A carefully curated journey through our finest flavours
          </p>
        </motion.div>

        {/* Table + plates stage */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ scale: cameraScale, opacity: dim }}
        >
          <DiningTable tilt={tiltVal} rotate={rotVal} />

          {/* Plates layer sits above the table, in table plane */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{ width: "min(1100px, 92vw)", height: "min(720px, 62vw)", transform: "translate(-50%, -50%)" }}
          >
            <div className="pointer-events-auto relative h-full w-full">
              {COURSES.map((c) => (
                <Plate
                  key={c.id}
                  course={c}
                  revealed={courseReveal(c.index)}
                  focused={courseReveal(c.index) && focusedIndex === c.index}
                />
              ))}
              {PLACEHOLDERS.map((p) => (
                <Placeholder key={p.label} p={p} revealed={placeholdersRevealed} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Course caption card */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 w-[min(92vw,640px)] -translate-x-1/2">
          <AnimatePresence mode="wait">
            {progress > 0.14 && active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="rounded-sm border border-[#c8a25a]/30 bg-black/60 p-6 text-center backdrop-blur-md"
              >
                <span
                  className="text-[10px] uppercase tracking-[0.5em] text-[#c8a25a]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {active.category}
                </span>
                <h3
                  className="mt-2 text-2xl text-[#f4d78a] md:text-3xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {active.name}
                </h3>
                <p
                  className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {active.description}
                </p>
                <motion.p
                  key={active.price}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-3 text-lg tracking-[0.3em] text-[#e6c67a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {active.price}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Scroll · The next course is being prepared
        </motion.div>

        {/* Final smoke wipe */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: smokeCover }}
        />
      </div>
    </section>
  );
}
