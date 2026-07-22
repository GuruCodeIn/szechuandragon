import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CinematicIntro from "@/components/CinematicIntro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Szechuan Dragon — Authentic Indo-Chinese Fine Dining, Bangalore" },
      {
        name: "description",
        content:
          "Step into Szechuan Dragon — a cinematic Indo-Chinese fine dining experience in Bangalore where traditional Chinese flavours meet modern culinary artistry.",
      },
      { property: "og:title", content: "Szechuan Dragon — Authentic Indo-Chinese Fine Dining" },
      {
        property: "og:description",
        content:
          "Where traditional Chinese flavours meet modern culinary excellence. Reserve your table at Bangalore's most cinematic Indo-Chinese restaurant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [introDone, setIntroDone] = useState(true);
  const [introPlaying, setIntroPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("sd_intro_seen");
    if (!seen) {
      setIntroDone(false);
      setIntroPlaying(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem("sd_intro_seen", "1");
    document.body.style.overflow = "";
    setIntroDone(true);
    setTimeout(() => setIntroPlaying(false), 1200);
  };

  return (
    <>
      {!introDone && <CinematicIntro onDone={handleDone} />}
      <motion.div
        initial={{ opacity: introPlaying ? 0 : 1 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Hero />
      </motion.div>
    </>
  );
}
