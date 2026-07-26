import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.8h2.5V21Z" />
  </svg>
);

const INSTAGRAM =
  "https://www.instagram.com/szechuan_dragon?igsh=MTFsMHF2ajlnaWw3ag%3D%3D";
const FACEBOOK = "https://www.facebook.com/share/1J7tQck63S/";

const QUICK_LINKS: Array<{ label: string; target: string }> = [
  { label: "Home", target: "home" },
  { label: "About", target: "about" },
  { label: "Story", target: "story" },
  { label: "Chef's Signature Collection", target: "menu" },
  { label: "Dragon's Feast", target: "dragons-feast" },
  { label: "Gallery", target: "gallery" },
  { label: "Reviews", target: "reviews" },
  { label: "Locations", target: "locations" },
  { label: "Contact", target: "contact" },
];

const BRANCHES = ["Hanumanthanagar", "AECS Layout", "HSR Layout"];

export function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  history.replaceState(null, "", `#${id}`);
}


function Particles() {
  const [dots, setDots] = useState<
    Array<{ left: number; delay: number; duration: number; size: number }>
  >([]);
  useEffect(() => {
    setDots(
      Array.from({ length: 18 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 10,
        size: 1 + Math.random() * 2,
      })),
    );
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-[#d4af37]"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: 0.5,
            boxShadow: "0 0 6px rgba(212,175,55,0.7)",
            animation: `sd-foot-float ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes sd-foot-float {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translateY(-420px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid h-14 w-14 place-items-center rounded-full border border-[#d4af37]/60 bg-gradient-to-br from-[#b31217] to-[#5a0509] shadow-[0_0_25px_rgba(255,120,40,0.4)]">
        <svg viewBox="0 0 40 40" className="h-8 w-8">
          <circle cx="20" cy="20" r="17" fill="none" stroke="#f5c15a" strokeWidth="1" opacity="0.6" />
          <text
            x="20"
            y="26"
            textAnchor="middle"
            fill="#f5c15a"
            fontSize="18"
            fontFamily="serif"
          >
            龍
          </text>
        </svg>
      </div>
      <div>
        <div
          className="font-serif text-2xl leading-none text-[#f5e5c0]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Szechuan Dragon
        </div>
        <div className="mt-1 text-[10px] tracking-[0.35em] text-[#d4af37]/80">
          BENGALURU
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#080808] pt-24 text-neutral-300 scroll-mt-24"
    >
      {/* Paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.65  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Lantern glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#c8352a]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-[120px]" />

      <Particles />

      {/* Top gold divider */}
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          <span className="font-serif text-lg text-[#d4af37]">龍</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BrandMark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-neutral-400">
              Authentic Indo-Chinese dining experience — where traditional
              flavours meet modern culinary artistry.
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#d4af37]">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(l.target)}
                    className="group inline-flex items-center gap-2 text-neutral-400 transition-colors hover:text-[#d4af37]"
                  >
                    <span className="h-px w-3 bg-[#d4af37]/50 transition-all group-hover:w-5 group-hover:bg-[#d4af37]" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Branches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#d4af37]">
              BRANCHES
            </h4>
            <ul className="space-y-2.5 text-sm">
              {BRANCHES.map((b) => (
                <li key={b}>
                  <button
                    type="button"
                    onClick={() => scrollToSection("locations")}
                    className="group inline-flex items-center gap-2 text-neutral-400 transition-colors hover:text-[#d4af37]"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#d4af37]/60 transition-colors group-hover:text-[#d4af37]" />
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Hours + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="mb-5 text-xs font-semibold tracking-[0.3em] text-[#d4af37]">
              OPENING HOURS
            </h4>
            <div className="flex items-start gap-3 text-sm text-neutral-300">
              <Clock className="mt-0.5 h-4 w-4 text-[#d4af37]" />
              <div>
                <div>Open Daily</div>
                <div className="mt-1 text-neutral-400">12:00 PM – 11:00 PM</div>
              </div>
            </div>

            <h4 className="mb-4 mt-8 text-xs font-semibold tracking-[0.3em] text-[#d4af37]">
              FOLLOW US
            </h4>
            <div className="flex gap-3">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group grid h-11 w-11 place-items-center rounded-full border border-[#d4af37]/40 bg-white/[0.02] text-[#d4af37] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#d4af37] hover:bg-[#c8352a]/20 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
              >
                <InstagramIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group grid h-11 w-11 place-items-center rounded-full border border-[#d4af37]/40 bg-white/[0.02] text-[#d4af37] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#d4af37] hover:bg-[#c8352a]/20 hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
              >
                <FacebookIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        </div>
        <div className="flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-neutral-500 md:flex-row md:text-left">
          <div>© 2026 Szechuan Dragon. All Rights Reserved.</div>
          <div className="tracking-[0.2em] text-neutral-600">
            DESIGNED WITH PASSION
          </div>
        </div>
      </div>
    </footer>
  );
}
