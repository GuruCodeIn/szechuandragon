import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Star } from "lucide-react";

import dragonChicken from "@/assets/dish-dragon-chicken.png.asset.json";
import chickenFriedRice from "@/assets/dish-chicken-fried-rice.png.asset.json";
import chilliGarlicRice from "@/assets/dish-chilli-garlic-rice.png.asset.json";
import vegChilliNoodles from "@/assets/dish-veg-chilli-noodles.png.asset.json";
import chilliBasilChicken from "@/assets/dish-chilli-basil-chicken.png.asset.json";
import kungPaoChicken from "@/assets/dish-kung-pao-chicken.png.asset.json";

type Dish = {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  ingredients: string[];
};

const DISHES: Dish[] = [
  {
    name: "Dragon Chicken",
    price: 315,
    rating: 4.2,
    reviews: 94,
    description:
      "A popular Indo-Chinese favourite featuring crispy chicken tossed in a rich buttery sweet and spicy sauce with ginger, garlic, spring onions and chilli.",
    image: dragonChicken.url,
    ingredients: ["Ginger", "Garlic", "Spring Onion", "Red Chilli"],
  },
  {
    name: "Chicken Fried Rice",
    price: 265,
    rating: 4.2,
    reviews: 46,
    description:
      "Classic stir-fried rice with tender chicken, vegetables, eggs, soy sauce and traditional seasonings.",
    image: chickenFriedRice.url,
    ingredients: ["Rice", "Egg", "Spring Onion", "Soy"],
  },
  {
    name: "Chicken Chilli Garlic Fried Rice",
    price: 265,
    rating: 4.2,
    reviews: 54,
    description:
      "Wok-fried rice tossed with chicken, vegetables, fresh garlic, green chillies and aromatic spices.",
    image: chilliGarlicRice.url,
    ingredients: ["Garlic", "Green Chilli", "Rice", "Spring Onion"],
  },
  {
    name: "Veg Chilli Garlic Noodles",
    price: 239,
    rating: 4.3,
    reviews: 93,
    description:
      "Soft noodles stir-fried with fresh vegetables, garlic and green chillies for a bold flavour.",
    image: vegChilliNoodles.url,
    ingredients: ["Noodles", "Garlic", "Bell Pepper", "Green Chilli"],
  },
  {
    name: "Chilli Basil Chicken",
    price: 315,
    rating: 4.4,
    reviews: 20,
    description:
      "Thai-inspired crispy chicken stir-fried with aromatic basil, soy sauce and fiery chillies.",
    image: chilliBasilChicken.url,
    ingredients: ["Basil", "Red Chilli", "Garlic", "Soy"],
  },
  {
    name: "Kung Pao Chicken",
    price: 315,
    rating: 3.3,
    reviews: 15,
    description:
      "Traditional Chinese stir-fried chicken with bell peppers, roasted peanuts and savoury Kung Pao sauce.",
    image: kungPaoChicken.url,
    ingredients: ["Peanut", "Bell Pepper", "Red Chilli", "Garlic"],
  },
];

type Ember = { left: string; delay: string; duration: string; size: number };
type Smoke = { top: string; delay: string; duration: string; opacity: number };

export default function SignatureCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-15% 0px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-10% 0px" });

  const [embers, setEmbers] = useState<Ember[]>([]);
  const [smoke, setSmoke] = useState<Smoke[]>([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 26 }, () => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        duration: `${11 + Math.random() * 12}s`,
        size: 1 + Math.random() * 2.5,
      })),
    );
    setSmoke(
      Array.from({ length: 5 }, (_, i) => ({
        top: `${12 + i * 19}%`,
        delay: `${i * 3.5}s`,
        duration: `${24 + Math.random() * 10}s`,
        opacity: 0.05 + Math.random() * 0.05,
      })),
    );
  }, []);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-40 scroll-mt-24"
      style={{ background: "#080808" }}
    >
      {/* Silk texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='11'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.65  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Red ambient corner glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(180,40,30,0.18) 0%, rgba(120,20,10,0.08) 40%, transparent 70%)",
          animation: "sigPulse 8s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-20 h-[560px] w-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,60,30,0.14) 0%, rgba(120,20,10,0.05) 40%, transparent 70%)",
          animation: "sigPulse 10s ease-in-out infinite 2s",
        }}
      />

      {/* Warm light rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "conic-gradient(from 200deg at 70% 20%, transparent 0deg, rgba(212,175,55,0.05) 20deg, transparent 40deg, transparent 360deg)",
        }}
      />

      {/* Dragon silhouette watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]"
        style={{ animation: "dragonDrift 40s ease-in-out infinite" }}
      >
        <svg width="1100" height="500" viewBox="0 0 400 200" fill="none">
          <path
            d="M20 120 Q 60 60 110 100 T 200 90 Q 260 60 320 110 T 390 90"
            stroke="#D4AF37"
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M30 130 Q 80 80 140 110 T 250 105 Q 300 90 380 120"
            stroke="#D4AF37"
            strokeWidth="0.5"
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
            animation: `sigSmokeDrift ${s.duration} linear infinite ${s.delay}`,
          }}
        />
      ))}

      {/* Floating embers */}
      {embers.map((p, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: "rgba(212,175,55,0.65)",
            boxShadow: "0 0 6px rgba(212,175,55,0.55)",
            animation: `sigEmberRise ${p.duration} linear infinite ${p.delay}`,
          }}
        />
      ))}

      {/* Header */}
      <div ref={headerRef} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={headerInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-md"
          style={{
            background: "linear-gradient(135deg, #8B1A1A 0%, #5A0F0F 100%)",
            boxShadow:
              "0 0 24px rgba(180,40,30,0.35), inset 0 0 8px rgba(0,0,0,0.4)",
          }}
        >
          <span
            className="text-2xl font-serif"
            style={{ color: "#F4E4C1", textShadow: "0 0 6px rgba(0,0,0,0.6)" }}
          >
            膳
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl md:text-6xl font-light tracking-[0.2em]"
          style={{
            color: "#D4AF37",
            textShadow: "0 0 30px rgba(212,175,55,0.25)",
          }}
        >
          Chef's Signature Collection
        </motion.h2>

        <div className="relative mx-auto mt-8 h-4 w-64">
          <motion.svg
            viewBox="0 0 300 12"
            className="absolute inset-0 h-full w-full"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <motion.path
              d="M4 6 Q 80 1, 150 7 T 296 5"
              stroke="url(#sigBrushGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={headerInView ? { pathLength: 1 } : {}}
              transition={{ delay: 0.9, duration: 1.4, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="sigBrushGrad" x1="0" x2="1" y1="0" y2="0">
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
          transition={{ delay: 2.2, duration: 1.1 }}
          className="mx-auto mt-8 max-w-2xl font-serif text-base md:text-lg italic leading-relaxed"
          style={{ color: "rgba(244,228,193,0.75)" }}
        >
          Discover the dishes our guests return for again and again.
        </motion.p>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="relative z-10 mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {DISHES.map((dish, idx) => (
          <DishCard key={dish.name} dish={dish} index={idx} inView={gridInView} />
        ))}
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
        @keyframes sigPulse {
          0%,100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes sigSmokeDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(220%); }
        }
        @keyframes sigEmberRise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @keyframes dragonDrift {
          0%,100% { transform: translate(-50%, -50%) translateX(-40px); }
          50% { transform: translate(-50%, -50%) translateX(40px); }
        }
        @keyframes sigSteam {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: 0.7; }
          100% { transform: translateY(-80px) scale(1.4); opacity: 0; }
        }
        @keyframes sigIngredientFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(6deg); }
        }
      `}</style>
    </section>
  );
}

function DishCard({
  dish,
  index,
  inView,
}: {
  dish: Dish;
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [displayRating, setDisplayRating] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 15 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 15 });
  const plateRotate = useTransform(rotateY, (v) => v * 0.6);

  useEffect(() => {
    if (!inView) return;
    const delay = 800 + index * 200;
    const t = setTimeout(() => {
      setRevealed(true);
      const c1 = animate(0, dish.price, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (v) => setDisplayPrice(Math.round(v)),
      });
      const c2 = animate(0, dish.rating, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (v) => setDisplayRating(v),
      });
      return () => {
        c1.stop();
        c2.stop();
      };
    }, delay);
    return () => clearTimeout(t);
  }, [inView, index, dish.price, dish.rating]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * 12);
    rotateX.set(-py * 8);
  };

  const handleLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.6 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 transition-shadow duration-500"
        style={{
          background:
            "linear-gradient(180deg, rgba(24,18,15,0.85) 0%, rgba(12,10,10,0.9) 100%)",
          border: "1px solid rgba(212,175,55,0.22)",
          boxShadow: hovered
            ? "0 30px 70px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.18)"
            : "0 14px 40px rgba(0,0,0,0.55)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Hover glow border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            border: "1px solid rgba(244,208,120,0.7)",
            boxShadow:
              "0 0 30px rgba(212,175,55,0.25), inset 0 0 24px rgba(212,175,55,0.08)",
          }}
        />

        {/* Dragon-scale texture on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10px 10px, rgba(212,175,55,0.9) 1.5px, transparent 2px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Corner ornaments */}
        {[
          "left-3 top-3 border-l border-t",
          "right-3 top-3 border-r border-t",
          "bottom-3 left-3 border-b border-l",
          "bottom-3 right-3 border-b border-r",
        ].map((c) => (
          <span
            key={c}
            aria-hidden
            className={`absolute h-3.5 w-3.5 ${c}`}
            style={{ borderColor: "rgba(212,175,55,0.7)" }}
          />
        ))}

        {/* Image */}
        <div
          className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl"
          style={{
            background: "radial-gradient(circle at 50% 60%, #1a1310 0%, #0a0808 80%)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* soft red glow behind plate */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 50% 55%, rgba(180,40,30,0.28) 0%, transparent 60%)",
            }}
          />

          <motion.img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={revealed ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ rotate: plateRotate }}
            className="relative z-10 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          />

          {/* Steam */}
          {hovered &&
            [0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute h-14 w-14 rounded-full"
                style={{
                  left: `${38 + i * 8}%`,
                  bottom: "42%",
                  background:
                    "radial-gradient(circle, rgba(240,230,210,0.55) 0%, transparent 70%)",
                  filter: "blur(8px)",
                  animation: `sigSteam ${2.6 + i * 0.4}s ease-out infinite ${i * 0.5}s`,
                }}
              />
            ))}

          {/* Ingredients float around */}
          {hovered &&
            dish.ingredients.map((ing, i) => {
              const positions = [
                { top: "8%", left: "6%" },
                { top: "12%", right: "6%" },
                { bottom: "10%", left: "8%" },
                { bottom: "14%", right: "8%" },
              ];
              const pos = positions[i % positions.length];
              return (
                <motion.span
                  key={ing}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                  className="pointer-events-none absolute z-20 rounded-full px-2.5 py-1 font-serif text-[10px] tracking-wider"
                  style={{
                    ...pos,
                    background: "rgba(10,8,8,0.75)",
                    color: "#F4E4C1",
                    border: "1px solid rgba(212,175,55,0.45)",
                    boxShadow: "0 0 12px rgba(212,175,55,0.2)",
                    animation: `sigIngredientFloat ${3 + i * 0.4}s ease-in-out infinite`,
                  }}
                >
                  {ing}
                </motion.span>
              );
            })}
        </div>

        {/* Content */}
        <div className="relative mt-6" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-start justify-between gap-3">
            <h3
              className="font-serif text-xl md:text-2xl font-light tracking-wide"
              style={{
                color: "#F4E4C1",
                textShadow: "0 0 12px rgba(212,175,55,0.15)",
              }}
            >
              {dish.name}
            </h3>
            <span
              className="whitespace-nowrap font-serif text-lg md:text-xl"
              style={{ color: "#D4AF37" }}
            >
              ₹{displayPrice}
            </span>
          </div>

          <div
            className="mt-2 h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,55,0.9), transparent)",
            }}
          />

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => {
                const filled = displayRating >= i + 1;
                const half = !filled && displayRating > i + 0.25;
                return (
                  <Star
                    key={i}
                    size={13}
                    className="transition-all"
                    style={{
                      color: "#D4AF37",
                      fill: filled ? "#D4AF37" : half ? "url(#half)" : "transparent",
                      filter: hovered
                        ? "drop-shadow(0 0 4px rgba(212,175,55,0.7))"
                        : "none",
                    }}
                  />
                );
              })}
            </div>
            <span
              className="font-serif text-xs tracking-wider"
              style={{ color: "rgba(244,228,193,0.75)" }}
            >
              {displayRating.toFixed(1)} · {dish.reviews} Reviews
            </span>
          </div>

          <p
            className="mt-4 font-serif text-[13.5px] italic leading-relaxed"
            style={{ color: "rgba(244,228,193,0.68)" }}
          >
            {dish.description}
          </p>

          {/* Order button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="group/btn relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-serif text-xs tracking-[0.28em] uppercase transition-all duration-500"
            style={{
              color: "#F4E4C1",
              background:
                "linear-gradient(135deg, rgba(139,26,26,0.15) 0%, rgba(90,15,15,0.15) 100%)",
              border: "1px solid rgba(212,175,55,0.55)",
              boxShadow: hovered
                ? "0 0 20px rgba(180,40,30,0.35), inset 0 0 12px rgba(212,175,55,0.15)"
                : "none",
            }}
            type="button"
          >
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, #8B1A1A 0%, #5A0F0F 100%)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full transition-transform duration-700 group-hover/btn:translate-x-full"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(244,208,120,0.35) 50%, transparent 70%)",
              }}
            />
            <span className="relative z-10">Explore Dish</span>
            <ArrowRight
              size={14}
              className="relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1"
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
