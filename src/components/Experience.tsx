import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Soup, Leaf, UtensilsCrossed, Users, Crown, Lamp } from "lucide-react";

const features = [
  {
    Icon: Soup,
    title: "Authentic Recipes",
    desc: "Prepared using authentic Indo-Chinese cooking techniques and carefully balanced flavours.",
  },
  {
    Icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Prepared every day using carefully selected fresh vegetables, meats, herbs and spices.",
  },
  {
    Icon: UtensilsCrossed,
    title: "Generous Portions",
    desc: "Enjoy satisfying portion sizes designed for sharing with family and friends.",
  },
  {
    Icon: Users,
    title: "Family Friendly",
    desc: "Comfortable dining spaces perfect for families, celebrations and gatherings.",
  },
  {
    Icon: Crown,
    title: "Affordable Luxury",
    desc: "Premium dining experience with exceptional value and quality.",
  },
  {
    Icon: Lamp,
    title: "Premium Ambience",
    desc: "Elegant interiors inspired by traditional Chinese culture with warm lighting and luxurious décor.",
  },
];

function CornerOrnaments() {
  const corner = (rotate: number, positions: string) => (
    <svg
      viewBox="0 0 24 24"
      className={`absolute h-4 w-4 text-[#f5c15a]/50 ${positions}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M2 8 V2 H8" />
      <path d="M4 4 h2 M4 4 v2" />
    </svg>
  );
  return (
    <>
      {corner(0, "left-2 top-2")}
      {corner(90, "right-2 top-2")}
      {corner(270, "left-2 bottom-2")}
      {corner(180, "right-2 bottom-2")}
    </>
  );
}

function FeatureCard({
  Icon,
  title,
  desc,
  index,
  inView,
}: {
  Icon: typeof Soup;
  title: string;
  desc: string;
  index: number;
  inView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 15 });
  const sry = useSpring(ry, { stiffness: 120, damping: 15 });
  const rotateX = useTransform(srx, [-1, 1], [5, -5]);
  const rotateY = useTransform(sry, [-1, 1], [-5, 5]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rx.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 60, filter: "blur(14px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 60, filter: "blur(14px)" }
      }
      transition={{
        duration: 0.9,
        delay: 0.6 + index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-xl border border-[#f5c15a]/25 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#f5c15a]/70 hover:shadow-[0_20px_60px_-15px_rgba(245,193,90,0.35)]"
    >
      {/* Dragon-scale hover texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(245,193,90,0.15) 2px, transparent 3px), radial-gradient(circle at 75% 75%, rgba(245,193,90,0.15) 2px, transparent 3px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* Card bright wash on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-[#f5c15a]/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <CornerOrnaments />

      {/* Floating particles on hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#f5c15a] opacity-0 shadow-[0_0_6px_rgba(245,193,90,0.9)] group-hover:opacity-100"
            style={{ left: `${15 + i * 18}%`, bottom: 8 }}
            animate={{ y: [0, -70], opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="relative mb-5 grid h-14 w-14 place-items-center rounded-full border border-[#f5c15a]/40 bg-black/40 transition-all duration-500 group-hover:scale-110 group-hover:border-[#f5c15a] group-hover:shadow-[0_0_25px_rgba(245,193,90,0.6)]">
          <Icon className="h-6 w-6 text-[#f5c15a] transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(245,193,90,0.9)]" />
        </div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.9 + index * 0.15 }}
          className="mb-3 font-serif text-lg tracking-[0.15em] text-[#f5c15a] transition-colors duration-500 group-hover:text-[#ffe08a]"
        >
          {title.toUpperCase()}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.1 + index * 0.15 }}
          className="text-[13px] leading-relaxed text-white/60"
        >
          {desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-[#080808] py-28 text-white scroll-mt-24"
      style={{
        fontFamily:
          '"Cormorant Garamond", "Playfair Display", ui-serif, Georgia, serif',
      }}
    >
      {/* Top blend from hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      {/* Bottom fade to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* Silk texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(245,193,90,0.5) 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, rgba(179,18,23,0.4) 0 1px, transparent 1px 12px)",
        }}
      />

      {/* Dragon-scale pattern revealed by moving light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(245,193,90,0.9) 2px, transparent 3px), radial-gradient(circle at 60% 70%, rgba(245,193,90,0.9) 2px, transparent 3px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Center red ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(179,18,23,0.35) 0%, rgba(120,10,10,0.15) 40%, transparent 70%)",
        }}
      />

      {/* Slow moving light shaft */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 h-[140%] w-[35%] rotate-12 opacity-20 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,180,90,0.35), transparent)",
        }}
        animate={{ x: ["-30%", "260%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rising smoke */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${15 + i * 18}%`,
              bottom: -100,
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(255,200,150,0.06), transparent 70%)",
            }}
            animate={{ y: [0, -600], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 18 + i * 3,
              repeat: Infinity,
              delay: i * 2.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Floating dust / embers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 53) % 100}%`,
              bottom: -10,
              width: 2,
              height: 2,
              background:
                "radial-gradient(circle, #ffcc80 0%, rgba(255,140,60,0.6) 60%, transparent 100%)",
              boxShadow: "0 0 6px rgba(255,160,80,0.8)",
            }}
            animate={{
              y: [0, -600 - ((i * 37) % 200)],
              x: [0, (i % 2 ? 1 : -1) * 40, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 14 + (i % 7) * 2,
              delay: (i % 9) * 1.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Gold divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 flex items-center justify-center gap-4"
        >
          <span className="h-px w-24 bg-gradient-to-r from-transparent to-[#f5c15a]/70" />
          <span className="text-[#f5c15a]">◆</span>
          <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#f5c15a]/70" />
        </motion.div>

        {/* Chinese seal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-md border border-[#f5c15a]/60 bg-gradient-to-br from-[#b31217]/80 to-[#7a0a0e]/80 shadow-[0_0_25px_rgba(179,18,23,0.5)]"
        >
          <span className="font-serif text-lg text-[#f5c15a]">囍</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-serif text-4xl tracking-[0.08em] text-[#f5c15a] sm:text-5xl lg:text-[56px]"
          style={{
            background:
              "linear-gradient(180deg, #f5e3a4 0%, #f5c15a 50%, #b8862b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The Szechuan Dragon Experience
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.55 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base italic text-white/60 sm:text-lg"
        >
          Crafted with authentic flavours, warm hospitality, and unforgettable
          dining experiences.
        </motion.p>

        {/* Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
