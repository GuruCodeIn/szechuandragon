import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";

import Experience from "@/components/Experience";
import OurStory from "@/components/OurStory";
import SignatureCollection from "@/components/SignatureCollection";
import CinematicIntro from "@/components/CinematicIntro";
import DragonsFeast from "@/components/DragonsFeast";
import AmbienceWalkthrough from "@/components/AmbienceWalkthrough";
import GuestVoices from "@/components/GuestVoices";
import FindDragon from "@/components/FindDragon";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Szechuan Dragon — Authentic Indo-Chinese Fine Dining, Bangalore" },
      {
        name: "description",
        content:
          "Step into Szechuan Dragon — a cinematic Indo-Chinese fine dining experience in Bangalore where traditional Chinese flavours meet modern culinary artistry.",
      },
      { property: "og:title", content: "Szechuan Dragon — Authentic Indo-Chinese Fine Dining, Bangalore" },
      {
        property: "og:description",
        content:
          "Step into Szechuan Dragon — a cinematic Indo-Chinese fine dining experience in Bangalore where traditional Chinese flavours meet modern culinary artistry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [introDone, setIntroDone] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen: string | null = null;
    try {
      seen = sessionStorage.getItem("sd_intro_seen");
    } catch {
      /* storage disabled — skip intro */
      return;
    }
    if (!seen) {
      setIntroDone(false);
      document.body.style.overflow = "hidden";
      // Safety net: never leave the intro overlay stuck on screen.
      const bail = setTimeout(() => {
        document.body.style.overflow = "";
        setIntroDone(true);
      }, 9000);
      return () => clearTimeout(bail);
    }
  }, []);

  const handleDone = () => {
    try {
      sessionStorage.setItem("sd_intro_seen", "1");
    } catch {
      /* ignore */
    }
    document.body.style.overflow = "";
    setIntroDone(true);
  };

  return (
    <>
      <SmoothScroll />
      {!introDone && <CinematicIntro onDone={handleDone} />}
      <Hero />

      <Experience />
      <OurStory />
      <SignatureCollection />
      <DragonsFeast />
      <AmbienceWalkthrough />
      <GuestVoices />
      <FindDragon />
      <Footer />
    </>
  );
}

