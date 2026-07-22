import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("sd_intro_seen");
    if (!seen) {
      setIntroDone(false);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem("sd_intro_seen", "1");
    document.body.style.overflow = "";
    setIntroDone(true);
  };

  return (
    <>
      {!introDone && <CinematicIntro onDone={handleDone} />}
      <Hero />
      <Experience />
    </>
  );
}
