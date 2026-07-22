import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Review = {
  name: string;
  localGuide?: boolean;
  meta: string;
  time: string;
  text: string;
  details: { label: string; value: string }[];
};

const reviews: Review[] = [
  {
    name: "Mayank Agarwal",
    localGuide: true,
    meta: "91 reviews • 288 photos",
    time: "1 month ago",
    text: "Amazing food with generous portions, hearty soups, fresh ingredients and excellent service. A great family-friendly restaurant with many vegetarian options.",
    details: [
      { label: "Meal", value: "Dinner" },
      { label: "Price", value: "₹400–600" },
      { label: "Atmosphere", value: "Quiet" },
      { label: "Vegetarian Friendly", value: "Highly Recommended" },
      { label: "Parking", value: "Free street parking" },
    ],
  },
  {
    name: "Tejaswi Kamath",
    localGuide: true,
    meta: "225 reviews • 116 photos",
    time: "5 months ago",
    text: "The food is amazing with plenty of vegetarian and non-vegetarian choices. Appetizers are a must try and the service is quick.",
    details: [
      { label: "Meal", value: "Lunch" },
      { label: "Price", value: "₹400–600" },
      { label: "Food", value: "5/5" },
      { label: "Service", value: "5/5" },
      { label: "Atmosphere", value: "4/5" },
    ],
  },
  {
    name: "Prachi Madihalli",
    localGuide: true,
    meta: "20 reviews • 53 photos",
    time: "1 month ago",
    text: "Generous portions, delicious food, spacious dining area and friendly staff made this a wonderful lunch experience.",
    details: [
      { label: "Meal", value: "Lunch" },
      { label: "Price", value: "₹1–200" },
      { label: "Food", value: "5/5" },
      { label: "Service", value: "5/5" },
      { label: "Atmosphere", value: "5/5" },
    ],
  },
  {
    name: "Supriya Rao",
    localGuide: true,
    meta: "55 reviews • 192 photos",
    time: "2 years ago",
    text: "Cozy atmosphere, delicious Chinese food, generous portions and excellent value for money. A highly recommended dining destination.",
    details: [
      { label: "Food", value: "4/5" },
      { label: "Service", value: "4/5" },
      { label: "Atmosphere", value: "5/5" },
    ],
  },
  {
    name: "Shubham Ambhore",
    localGuide: true,
    meta: "44 reviews • 120 photos",
    time: "5 months ago",
    text: "The Burnt Garlic Noodles were outstanding, the ambience felt authentically Chinese and the service was attentive. Excellent value for money.",
    details: [
      { label: "Meal", value: "Dinner" },
      { label: "Price", value: "₹400–600" },
      { label: "Food", value: "5/5" },
      { label: "Service", value: "4/5" },
      { label: "Atmosphere", value: "5/5" },
      { label: "Wait Time", value: "Up to 10 minutes" },
    ],
  },
];

const GoogleG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const Seal = () => (
  <div className="mx-auto mt-3 flex h-9 w-9 items-center justify-center rounded-sm border border-[#C9A24B]/60 bg-[#8B0000]/70 text-[10px] font-bold text-[#F5E1A4] shadow-[0_0_20px_rgba(201,162,75,0.25)]">
    賓
  </div>
);

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#FBBC05]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 17.3l-6.16 3.7 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.48 4.73 1.64 7.03z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  const floatDuration = 6 + (index % 3) * 1.5;
  const floatY = 8 + (index % 3) * 3;
  const rotate = index % 2 === 0 ? 1.2 : -1.2;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <motion.div
        animate={
          hovered
            ? { y: 0, rotate: 0 }
            : { y: [0, -floatY, 0], rotate: [0, rotate, 0] }
        }
        transition={
          hovered
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: floatDuration, repeat: Infinity, ease: "easeInOut" }
        }
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className={`group relative rounded-2xl border transition-all duration-500 ${
          hovered
            ? "border-[#C9A24B]/70 bg-white/[0.06] shadow-[0_25px_60px_-15px_rgba(201,162,75,0.35)]"
            : "border-[#C9A24B]/20 bg-white/[0.025] shadow-[0_15px_40px_-20px_rgba(0,0,0,0.8)]"
        } backdrop-blur-xl`}
      >
        {/* golden edge glow */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            boxShadow: "inset 0 0 40px rgba(201,162,75,0.15), 0 0 40px rgba(201,162,75,0.15)",
          }}
        />

        <div className="relative p-6 md:p-7">
          {/* Header */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={hovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <GoogleG className="h-6 w-6" />
            </motion.div>
            <Stars />
          </div>

          {/* Review text */}
          <p
            className="mt-5 text-[15px] leading-relaxed text-[#E8DFC8]/90"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
          >
            "{review.text}"
          </p>

          {/* Reviewer */}
          <div className="mt-6 flex items-start justify-between gap-3 border-t border-[#C9A24B]/15 pt-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-[#F5E1A4]">{review.name}</p>
                {review.localGuide && (
                  <span className="shrink-0 rounded-sm border border-[#C9A24B]/40 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#C9A24B]">
                    Local Guide
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-white/40">{review.meta}</p>
              <p className="mt-0.5 text-[11px] text-white/50">{review.time}</p>
            </div>
          </div>

          {/* Expanded details */}
          <motion.div
            initial={false}
            animate={
              hovered
                ? { height: "auto", opacity: 1, marginTop: 16 }
                : { height: 0, opacity: 0, marginTop: 0 }
            }
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-[#C9A24B]/20 bg-black/40 p-4">
              {review.details.map((d) => (
                <div key={d.label} className="text-[11px]">
                  <div className="uppercase tracking-wider text-[#C9A24B]/70">{d.label}</div>
                  <div className="mt-0.5 text-white/85">{d.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GuestVoices() {
  const [particles, setParticles] = useState<{ x: number; y: number; d: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        x: (i * 37) % 100,
        y: (i * 53) % 100,
        d: 10 + (i % 6) * 3,
        delay: (i % 8) * 0.7,
        size: 1 + (i % 3),
      })),
    );
  }, []);

  // Distribute reviews into 3 columns with staggered offsets
  const columns: Review[][] = [[], [], []];
  reviews.forEach((r, i) => columns[i % 3].push(r));
  const columnOffsets = ["md:mt-0", "md:mt-16", "md:mt-8"];

  return (
    <section className="relative overflow-hidden bg-[#080808] py-28 md:py-36">
      {/* Paper texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Dragon scale watermark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10px 10px, #C9A24B 2px, transparent 2.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Corner lantern glows */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,58,44,0.25), transparent 70%)" }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 bottom-24 h-[28rem] w-[28rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,162,75,0.2), transparent 70%)" }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Drifting smoke */}
      <motion.div
        className="pointer-events-none absolute left-0 top-1/3 h-40 w-[60%]"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.04), transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{ x: ["-20%", "120%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Gold particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#C9A24B]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.5,
            boxShadow: "0 0 6px rgba(201,162,75,0.8)",
          }}
          animate={{ y: [0, -60, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2
            className="text-4xl tracking-[0.15em] text-[#F5E1A4] md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            VOICES OF OUR GUESTS
          </h2>

          {/* Golden brush stroke */}
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
            width="240"
            height="14"
            viewBox="0 0 240 14"
            className="mx-auto mt-4"
          >
            <motion.path
              d="M4 8 Q60 2, 120 7 T236 6"
              stroke="url(#brush)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="brush" x1="0" x2="1">
                <stop offset="0" stopColor="#C9A24B" stopOpacity="0" />
                <stop offset="0.5" stopColor="#F5E1A4" />
                <stop offset="1" stopColor="#C9A24B" stopOpacity="0" />
              </linearGradient>
            </defs>
          </motion.svg>

          <Seal />

          <p className="mx-auto mt-5 max-w-xl text-sm text-white/55 md:text-base">
            Every review reflects a memorable dining experience shared by our guests.
          </p>
        </motion.div>

        {/* Floating review wall */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {columns.map((col, ci) => (
            <div key={ci} className={`flex flex-col gap-8 ${columnOffsets[ci]}`}>
              {col.map((r, ri) => (
                <ReviewCard key={r.name} review={r} index={ci * 2 + ri} />
              ))}
            </div>
          ))}
        </div>

        {/* Google attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-2 text-xs text-white/40"
        >
          <GoogleG className="h-4 w-4" />
          <span>Authentic reviews from Google</span>
        </motion.div>
      </div>
    </section>
  );
}
