import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, ChevronDown, Menu, X } from "lucide-react";
import heroImg from "@/assets/hero-interior.jpg";
import lanternImg from "@/assets/lantern.png";
import { scrollToSection } from "./Footer";

const NAV: Array<{ label: string; target: string }> = [
  { label: "Home", target: "home" },
  { label: "About", target: "story" },
  { label: "Menu", target: "menu" },
  { label: "Gallery", target: "gallery" },
  { label: "Reviews", target: "reviews" },
  { label: "Locations", target: "locations" },
  { label: "Contact", target: "contact" },
];

const INSTAGRAM_URL =
  "https://www.instagram.com/szechuan_dragon?igsh=MTFsMHF2ajlnaWw3ag%3D%3D";
const FACEBOOK_URL = "https://www.facebook.com/share/1J7tQck63S/";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

// A single swinging lantern — the string is the pivot, the lantern hangs below and sways like a pendulum.
function Lantern({
  left,
  top,
  scale = 1,
  delay = 0,
  duration = 6,
  amplitude = 6,
  ropeHeight = 60,
}: {
  left: string;
  top: string;
  scale?: number;
  delay?: number;
  duration?: number;
  amplitude?: number;
  ropeHeight?: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute origin-top"
      style={{ left, top, transformOrigin: "top center" }}
      initial={{ rotate: -amplitude, opacity: 0 }}
      animate={{ rotate: [amplitude, -amplitude, amplitude], opacity: 1 }}
      transition={{
        rotate: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
        opacity: { duration: 1.4, delay: delay * 0.3 },
      }}
    >
      {/* rope */}
      <div
        className="mx-auto w-px bg-gradient-to-b from-transparent via-amber-900/60 to-amber-950/80"
        style={{ height: ropeHeight }}
      />
      <motion.div
        style={{ width: 90 * scale }}
        className="relative -mt-1"
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: duration * 0.7, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {/* warm glow behind lantern */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: 220 * scale,
            height: 220 * scale,
            background:
              "radial-gradient(circle, rgba(255,120,60,0.55) 0%, rgba(220,40,20,0.25) 40%, transparent 70%)",
          }}
        />
        <img
          src={lanternImg}
          alt=""
          width={90 * scale}
          className="relative drop-shadow-[0_0_25px_rgba(255,90,40,0.6)]"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}

// Floating ember particles rendered in pure CSS/JS — no libraries needed.
// Initialize on client only to avoid SSR/hydration mismatch from Math.random.
function Embers() {
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; size: number; delay: number; duration: number; drift: number; rise: number }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 60,
        rise: 700 + Math.random() * 200,
      })),
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: -10,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, #ffb066 0%, #d94a1a 60%, transparent 100%)",
            boxShadow: "0 0 8px rgba(255,140,60,0.9)",
          }}
          animate={{
            y: [0, -p.rise],
            x: [0, p.drift, -p.drift, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}


export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(NAV.map((n) => n.target));

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 20 });
  const smy = useSpring(my, { stiffness: 40, damping: 20 });
  const bgX = useTransform(smx, [-1, 1], [-25, 25]);
  const bgY = useTransform(smy, [-1, 1], [-15, 15]);
  const midX = useTransform(smx, [-1, 1], [-50, 50]);
  const midY = useTransform(smy, [-1, 1], [-30, 30]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
      my.set(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, delay: 0.4 + i * 0.18, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <div
      ref={containerRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#08060a] text-white"
      style={{
        fontFamily:
          '"Cormorant Garamond", "Playfair Display", ui-serif, Georgia, serif',
      }}
    >
      {/* -- Background layer with parallax + slow zoom -- */}
      <motion.div
        className="absolute inset-0 -m-16"
        style={{ x: bgX, y: bgY }}
      >
        <motion.img
          src={heroImg}
          alt="Interior of Szechuan Dragon restaurant"
          className="h-full w-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: [1.15, 1.25, 1.15] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          draggable={false}
        />
      </motion.div>

      {/* Overlays: darken + red vignette + top/bottom gradients */}
      <div className="absolute inset-0 bg-black/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(120,10,10,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(255,140,50,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />

      {/* Slow moving warm light shaft */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 h-[140%] w-[40%] rotate-12 opacity-30 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,170,80,0.35), transparent)",
        }}
        animate={{ x: ["-30%", "220%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Embers */}
      <Embers />

      {/* Lanterns — layered with parallax, swinging like real lamps in the wind */}
      <motion.div className="absolute inset-0" style={{ x: midX, y: midY }}>
        <Lantern left="18%" top="0%" scale={1.1} duration={7} amplitude={5} ropeHeight={70} delay={0} />
        <Lantern left="48%" top="-2%" scale={1.5} duration={9} amplitude={4} ropeHeight={100} delay={1.2} />
        <Lantern left="72%" top="0%" scale={1.2} duration={8} amplitude={6} ropeHeight={80} delay={0.6} />
        <Lantern left="88%" top="4%" scale={0.9} duration={6.5} amplitude={7} ropeHeight={55} delay={1.8} />
        <Lantern left="6%" top="6%" scale={0.75} duration={7.5} amplitude={5} ropeHeight={45} delay={2.4} />
      </motion.div>

      {/* Decorative dragon-esque circular seal (top-left of hero copy) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[3%] top-[28%] h-96 w-96 rounded-full opacity-[0.07]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, #f5c15a, transparent, #b31217, transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      {/* -- Navigation -- */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-black/60 border-b border-[#f5c15a]/30"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3"
            aria-label="Szechuan Dragon home"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full border border-[#f5c15a]/60 bg-gradient-to-br from-[#b31217] to-[#7a0a0e] shadow-[0_0_20px_rgba(255,120,40,0.35)]">
              <span className="text-lg font-bold tracking-tighter text-[#f5c15a]">囍</span>
            </div>
            <div className="leading-none text-left">
              <div className="text-[15px] font-bold tracking-[0.22em] text-white">
                SZECHUAN
              </div>
              <div className="text-[10px] tracking-[0.35em] text-[#f5c15a]/80">
                DRAGON · BANGALORE
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => {
              const isActive = active === item.target;
              return (
                <li key={item.target}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.target)}
                    className={`relative text-[13px] tracking-[0.22em] transition-colors ${
                      isActive ? "text-[#f5c15a]" : "text-white/80 hover:text-[#f5c15a]"
                    }`}
                  >
                    {item.label.toUpperCase()}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 h-px w-6 -translate-x-1/2 bg-[#f5c15a]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => scrollToSection("locations")}
              className="group relative inline-flex items-center gap-2 border border-[#f5c15a]/70 px-6 py-3 text-[12px] font-medium tracking-[0.25em] text-[#f5c15a] transition-all hover:bg-[#f5c15a] hover:text-black hover:shadow-[0_0_30px_rgba(245,193,90,0.5)]"
            >
              RESERVE TABLE
              <span className="h-px w-6 bg-[#f5c15a] transition-all group-hover:w-10 group-hover:bg-black" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Menu"
            className="lg:hidden text-[#f5c15a]"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="lg:hidden backdrop-blur-2xl bg-black/85 border-t border-[#f5c15a]/20">
            <ul className="flex flex-col gap-1 px-6 py-6">
              {NAV.map((item) => (
                <li key={item.target}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      scrollToSection(item.target);
                    }}
                    className="block w-full py-3 text-left text-sm tracking-[0.25em] text-white/85 hover:text-[#f5c15a]"
                  >
                    {item.label.toUpperCase()}
                  </button>
                </li>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  scrollToSection("locations");
                }}
                className="mt-4 block w-full border border-[#f5c15a] px-6 py-3 text-center text-xs tracking-[0.25em] text-[#f5c15a]"
              >
                RESERVE TABLE
              </button>
            </ul>
          </div>
        )}
      </nav>

      {/* Social rail — bottom-left, opens real Instagram + Facebook */}
      <div className="pointer-events-auto absolute bottom-10 left-6 z-30 hidden flex-col gap-3 md:flex lg:left-10">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="group grid h-10 w-10 place-items-center rounded-full border border-[#f5c15a]/40 bg-black/30 text-white/80 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#f5c15a] hover:text-[#f5c15a] hover:shadow-[0_0_20px_rgba(245,193,90,0.45)]"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="group grid h-10 w-10 place-items-center rounded-full border border-[#f5c15a]/40 bg-black/30 text-white/80 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#f5c15a] hover:text-[#f5c15a] hover:shadow-[0_0_20px_rgba(245,193,90,0.45)]"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.8h2.5V21Z" />
          </svg>
        </a>
        <div className="mx-auto h-8 w-px bg-gradient-to-b from-[#f5c15a]/50 to-transparent" />
      </div>

      {/* -- Main content -- */}
      <section className="relative z-20 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pt-32 pb-24 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Eyebrow */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="mb-8 flex items-center gap-4"
            >
              <span className="h-px w-10 bg-[#f5c15a]" />
              <span className="text-[11px] tracking-[0.45em] text-[#f5c15a]">
                WELCOME TO SZECHUAN DRAGON
              </span>
              <span className="text-[#f5c15a]/70">囍</span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-serif text-[13vw] leading-[0.95] tracking-tight sm:text-[9vw] lg:text-[7.2vw] xl:text-[110px]">
              <motion.span
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="show"
                className="block font-light text-white"
              >
                Experience
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
                className="block italic"
                style={{
                  background:
                    "linear-gradient(180deg, #e94a3a 0%, #b31217 60%, #7a0a0e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Authentic
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={3}
                initial="hidden"
                animate="show"
                className="block font-light text-white"
              >
                Indo-Chinese
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={4}
                initial="hidden"
                animate="show"
                className="block font-light text-white/95"
              >
                Dining
              </motion.span>
            </h1>

            {/* Sub-heading */}
            <motion.p
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="show"
              className="mt-8 text-lg italic text-[#f5c15a]/90 sm:text-xl"
            >
              Where every meal becomes a memory.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={6}
              initial="hidden"
              animate="show"
              className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-white/70"
            >
              Traditional Chinese flavours meet modern culinary excellence.
              Every dish is crafted with passion, authentic ingredients, and
              unforgettable moments — served in Bangalore's most cinematic
              dining room.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={7}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => scrollToSection("locations")}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden border border-[#f5c15a]/70 bg-gradient-to-b from-[#b31217] to-[#7a0a0e] px-8 py-4 text-[12px] font-semibold tracking-[0.28em] text-white shadow-[0_0_30px_rgba(179,18,23,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(245,193,90,0.35)]"
              >
                <span className="relative z-10">RESERVE TABLE</span>
                <span className="relative z-10 h-px w-5 bg-[#f5c15a] transition-all group-hover:w-8" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("menu")}
                className="group inline-flex items-center justify-center gap-3 border border-[#f5c15a]/70 px-8 py-4 text-[12px] font-semibold tracking-[0.28em] text-[#f5c15a] transition-all hover:bg-[#f5c15a] hover:text-black"
              >
                EXPLORE MENU
                <span className="h-px w-5 bg-current transition-all group-hover:w-8" />
              </button>
            </motion.div>
          </div>

          {/* Watch experience */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:col-span-4 lg:flex lg:justify-end"
          >
            <button
              aria-label="Watch experience"
              className="group relative flex items-center gap-5"
            >
              <span className="relative grid h-24 w-24 place-items-center rounded-full border border-[#f5c15a]/60 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(245,193,90,0.6)]">
                <span className="absolute inset-0 rounded-full border border-[#f5c15a]/40 animate-ping" />
                <Play className="ml-1 text-[#f5c15a]" size={26} fill="#f5c15a" />
              </span>
              <span className="text-left">
                <span className="block text-xs tracking-[0.35em] text-[#f5c15a]/80">
                  ─── PLAY
                </span>
                <span className="mt-1 block font-serif text-xl tracking-wide text-white">
                  Watch Experience
                </span>
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 text-[#f5c15a]"
      >
        <span className="text-[10px] tracking-[0.5em]">SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </div>
  );
}
