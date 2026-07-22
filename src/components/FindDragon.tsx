import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Navigation, Clock, MapPin } from "lucide-react";

type Branch = {
  id: string;
  name: string;
  address: string[];
  phone: string;
  hours: string;
  // Position on the stylized map (percent 0-100)
  x: number;
  y: number;
  // Real coordinates for directions
  lat: number;
  lng: number;
  seal: string; // Chinese character
};

const BRANCHES: Branch[] = [
  {
    id: "hanumanthanagar",
    name: "Hanumanthanagar",
    address: [
      "8, 2nd Floor, 1st Main Road",
      "Mount Joy Road, Near BMS College",
      "Hanumanthanagar",
      "Bengaluru, Karnataka – 560019",
    ],
    phone: "+91 96635 67711",
    hours: "12:00 PM – 11:00 PM",
    x: 34,
    y: 66,
    lat: 12.9401,
    lng: 77.5628,
    seal: "南",
  },
  {
    id: "aecs",
    name: "AECS Layout",
    address: [
      "1st Floor, 312 ITPL Main Road",
      "AECS Layout, Kundalahalli",
      "Marathahalli",
      "Bengaluru, Karnataka – 560037",
    ],
    phone: "+91 63665 68166",
    hours: "12:00 PM – 11:00 PM",
    x: 74,
    y: 42,
    lat: 12.9784,
    lng: 77.7126,
    seal: "東",
  },
  {
    id: "hsr",
    name: "HSR Layout",
    address: [
      "76/1, 7th Cross Road",
      "Opposite HP Petrol Bunk",
      "1st Sector, HSR Layout",
      "Bengaluru, Karnataka – 560102",
    ],
    phone: "+91 95131 87711",
    hours: "12:00 PM – 11:00 PM",
    x: 60,
    y: 72,
    lat: 12.9116,
    lng: 77.6389,
    seal: "龍",
  },
];

type Particle = { left: number; delay: number; duration: number; size: number };

export default function FindDragon() {
  const [selectedId, setSelectedId] = useState<string>(BRANCHES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => BRANCHES.find((b) => b.id === selectedId) ?? BRANCHES[0],
    [selectedId]
  );

  useEffect(() => {
    setParticles(
      Array.from({ length: 32 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 12,
        size: 1 + Math.random() * 2,
      }))
    );
  }, []);

  const directionsUrl = (b: Branch) =>
    `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`;

  return (
    <section
      id="locations"
      className="relative overflow-hidden bg-[#080808] py-24 sm:py-32 scroll-mt-24"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(180,140,60,0.06), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(200,30,30,0.08), transparent 55%)",
      }}
    >
      {/* Paper + dragon-scale watermark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.35) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><path d='M30 5 Q50 15 30 30 Q10 15 30 5 Z' fill='none' stroke='%23d4af37' stroke-width='0.6'/></svg>\")",
        }}
      />

      {/* Lantern glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#c8352a]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[28rem] w-[28rem] rounded-full bg-[#d4af37]/8 blur-[140px]" />

      {/* Floating golden particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 block rounded-full bg-[#d4af37]"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0.5,
              animation: `sd-float-up ${p.duration}s linear ${p.delay}s infinite`,
              boxShadow: "0 0 6px rgba(212,175,55,0.7)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes sd-float-up {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @keyframes sd-pin-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes sd-ripple {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes sd-map-breathe {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.08); }
        }
        @keyframes sd-brush {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-md border border-[#d4af37]/60 bg-[#c8352a]/90 text-2xl font-serif text-[#f5e5c0] shadow-[0_0_30px_rgba(200,53,42,0.4)]"
        >
          印
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl tracking-wide text-[#d4af37] sm:text-5xl md:text-6xl"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Find Your Nearest Dragon
        </motion.h2>
        <svg
          viewBox="0 0 400 20"
          className="mx-auto mt-3 h-4 w-64"
          aria-hidden
        >
          <motion.path
            d="M20 10 Q120 -4 200 10 T380 10"
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </svg>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-5 max-w-xl text-sm text-neutral-400 sm:text-base"
        >
          Three destinations. One unforgettable dining experience.
        </motion.p>
      </div>

      {/* Main layout */}
      <div className="relative mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-[1.5fr_1fr]">
        {/* MAP */}
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-gradient-to-br from-[#0d0d0d] via-[#111010] to-[#080606] shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
            style={{ animation: "sd-map-breathe 6s ease-in-out infinite" }}
          >
            {/* Grid glow */}
            <svg
              viewBox="0 0 100 75"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#c8352a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
                <pattern
                  id="grid"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 5 0 L 0 0 0 5"
                    fill="none"
                    stroke="#d4af37"
                    strokeWidth="0.08"
                    opacity="0.35"
                  />
                </pattern>
              </defs>
              <rect width="100" height="75" fill="url(#grid)" />
              <rect width="100" height="75" fill="url(#mapGlow)" />

              {/* Stylized road network */}
              {[
                "M5 40 Q25 30 45 42 T95 38",
                "M10 15 Q35 25 55 20 T92 30",
                "M20 70 Q40 60 60 68 T90 60",
                "M50 5 Q52 30 45 50 T55 72",
                "M15 55 Q35 50 50 60 T85 55",
              ].map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="0.35"
                  strokeLinecap="round"
                  opacity="0.55"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.2 + i * 0.15 }}
                />
              ))}

              {/* Landmass blobs */}
              <path
                d="M2 20 Q30 5 55 12 Q80 18 98 8 L98 72 Q75 68 50 72 Q25 76 2 68 Z"
                fill="#0a0a0a"
                opacity="0.4"
                stroke="#d4af37"
                strokeWidth="0.15"
                strokeOpacity="0.3"
              />

              {/* Water/parks */}
              <ellipse cx="80" cy="55" rx="8" ry="4" fill="#1a2b2b" opacity="0.5" />
              <ellipse cx="25" cy="30" rx="6" ry="3" fill="#1a2b2b" opacity="0.5" />

              {/* "Bengaluru" label */}
              <text
                x="50"
                y="10"
                textAnchor="middle"
                fill="#d4af37"
                fontSize="2"
                opacity="0.5"
                fontFamily="serif"
                letterSpacing="0.3"
              >
                BENGALURU
              </text>
            </svg>

            {/* Pins */}
            {BRANCHES.map((b, i) => {
              const isSelected = b.id === selectedId;
              const isHovered = b.id === hoveredId;
              return (
                <motion.button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  onMouseEnter={() => setHoveredId(b.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  initial={{ opacity: 0, y: -20, scale: 0 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 1 + i * 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                  }}
                  className="group absolute -translate-x-1/2 -translate-y-full cursor-pointer"
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                  aria-label={`Select ${b.name} branch`}
                >
                  {/* Ripple */}
                  <span
                    className="absolute left-1/2 top-full block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37]"
                    style={{ animation: "sd-ripple 2.4s ease-out infinite" }}
                  />
                  <span
                    className="absolute left-1/2 top-full block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37]"
                    style={{ animation: "sd-ripple 2.4s ease-out 1.2s infinite" }}
                  />
                  {/* Pin body */}
                  <div
                    className={`relative flex flex-col items-center transition-transform duration-300 ${
                      isHovered || isSelected ? "scale-125" : "scale-100"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border font-serif text-sm text-[#f5e5c0] shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all ${
                        isSelected
                          ? "border-[#d4af37] bg-[#c8352a] shadow-[0_0_30px_rgba(212,175,55,0.9)]"
                          : "border-[#d4af37]/70 bg-[#1a0a0a]"
                      }`}
                      style={{ animation: "sd-pin-pulse 3s ease-in-out infinite" }}
                    >
                      {b.seal}
                    </div>
                    {/* Pin tail */}
                    <div className="h-2 w-[2px] bg-gradient-to-b from-[#d4af37] to-transparent" />
                    <div className="h-1.5 w-1.5 -translate-y-0.5 rotate-45 border-b border-r border-[#d4af37] bg-[#c8352a]" />
                  </div>
                  {/* Label */}
                  <div
                    className={`absolute left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded border border-[#d4af37]/40 bg-black/70 px-2 py-0.5 text-[10px] tracking-wider text-[#d4af37] backdrop-blur transition-opacity ${
                      isHovered || isSelected ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {b.name.toUpperCase()}
                  </div>
                </motion.button>
              );
            })}

            {/* Compass */}
            <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/40 bg-black/40 backdrop-blur">
              <div className="text-[10px] font-semibold tracking-widest text-[#d4af37]">
                N
              </div>
              <div className="absolute top-1 h-2 w-[1px] bg-[#c8352a]" />
            </div>
          </motion.div>
        </motion.div>

        {/* INFO PANEL */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-white/[0.03] p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              {/* Corner ornaments */}
              <div className="pointer-events-none absolute left-2 top-2 h-6 w-6 border-l border-t border-[#d4af37]/60" />
              <div className="pointer-events-none absolute right-2 top-2 h-6 w-6 border-r border-t border-[#d4af37]/60" />
              <div className="pointer-events-none absolute bottom-2 left-2 h-6 w-6 border-b border-l border-[#d4af37]/60" />
              <div className="pointer-events-none absolute bottom-2 right-2 h-6 w-6 border-b border-r border-[#d4af37]/60" />

              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#d4af37]/70">
                <span className="h-px w-6 bg-[#d4af37]/50" />
                Branch
              </div>
              <h3
                className="font-serif text-3xl text-[#f5e5c0]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {selected.name}
              </h3>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
                <div className="font-serif text-lg text-[#d4af37]">龍</div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
              </div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex gap-3"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d4af37]" />
                <div className="text-sm leading-relaxed text-neutral-300">
                  {selected.address.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 flex items-center gap-3"
              >
                <Clock
                  className="h-4 w-4 text-[#d4af37]"
                  style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.7))" }}
                />
                <div className="text-sm text-neutral-300">
                  <span className="text-[#d4af37]/80">Open Daily</span>
                  <span className="mx-2 text-neutral-600">•</span>
                  {selected.hours}
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-3 flex items-center gap-3"
              >
                <Phone className="h-4 w-4 text-[#d4af37]" />
                <a
                  href={`tel:${selected.phone.replace(/\s/g, "")}`}
                  className="text-sm text-neutral-300 transition-colors hover:text-[#d4af37]"
                >
                  {selected.phone}
                </a>
              </motion.div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={`tel:${selected.phone.replace(/\s/g, "")}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  whileHover={{ y: -2 }}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-md border border-[#d4af37] bg-[#c8352a] px-5 py-3 text-sm font-medium tracking-wide text-[#f5e5c0] shadow-[0_6px_20px_rgba(200,53,42,0.35)] transition-shadow hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
                >
                  <Phone className="h-4 w-4" />
                  Call Branch
                </motion.a>
                <motion.a
                  href={directionsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  whileHover={{ y: -2 }}
                  className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-md border border-[#d4af37] bg-transparent px-5 py-3 text-sm font-medium tracking-wide text-[#d4af37] transition-colors hover:text-[#080808]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-[#d4af37] transition-transform duration-500 group-hover:translate-x-0" />
                  <Navigation className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <span className="relative">Get Directions</span>
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Branch quick-switch */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {BRANCHES.map((b) => {
              const active = b.id === selectedId;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`rounded-md border px-2 py-2 text-xs tracking-wide transition-all ${
                    active
                      ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                      : "border-[#d4af37]/20 text-neutral-400 hover:border-[#d4af37]/50 hover:text-[#d4af37]"
                  }`}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
