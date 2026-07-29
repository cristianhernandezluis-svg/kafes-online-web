"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    image: "/banners/banner-fiestas-patrias.jpg",
    alt: "Ofertas por Fiestas Patrias en Kafes Online",
    href: "#ofertas",
  },
  {
    image: "/banners/banner-hidrolavadoras.jpg",
    alt: "Ofertas en hidrolavadoras Kafes Online",
    href: "/categoria/hidrolavadoras",
  },
  {
    image: "/banners/banner-jardineria.jpg",
    alt: "Herramientas de jardinería Kafes Online",
    href: "/categoria/jardineria",
  },
];

export default function HeroSlider() {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const previousBanner = () => {
    setActiveBanner((current) =>
      current === 0 ? banners.length - 1 : current - 1,
    );
  };

  const nextBanner = () => {
    setActiveBanner((current) => (current + 1) % banners.length);
  };

  return (
    <section className="w-full px-2 py-5 md:px-10">
      <div className="group relative overflow-hidden rounded-3xl bg-zinc-100 shadow-xl">
        <a href={banners[activeBanner].href} className="block">
          <img
            src={banners[activeBanner].image}
            alt={banners[activeBanner].alt}
            className="block h-auto w-full"
          />
        </a>

        <button
          type="button"
          aria-label="Banner anterior"
          onClick={previousBanner}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/80 group-hover:opacity-100"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          aria-label="Banner siguiente"
          onClick={nextBanner}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/80 group-hover:opacity-100"
        >
          <ChevronRight size={28} />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.image}
              type="button"
              aria-label={`Mostrar banner ${index + 1}`}
              onClick={() => setActiveBanner(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeBanner === index
                  ? "w-9 bg-white"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
