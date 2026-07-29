"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BannerHero = {
  id: number;
  imageDesktop: string;
  imageMobile?: string | null;
  alt: string;
  href: string;
  titulo?: string | null;
  subtitulo?: string | null;
  textoBoton?: string | null;
};

type HeroSliderProps = {
  banners: BannerHero[];
};

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (activeBanner >= banners.length) {
      setActiveBanner(0);
    }
  }, [activeBanner, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[activeBanner];

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
        <a href={banner.href || "/"} className="relative block">
          <picture>
            {banner.imageMobile ? (
              <source media="(max-width: 767px)" srcSet={banner.imageMobile} />
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageDesktop}
              alt={banner.alt}
              className="block h-auto w-full"
            />
          </picture>

          {(banner.titulo || banner.subtitulo || banner.textoBoton) && (
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/70 via-black/25 to-transparent">
              <div className="max-w-2xl px-7 py-10 text-white md:px-16">
                {banner.titulo ? (
                  <h2 className="text-3xl font-black leading-tight md:text-6xl">
                    {banner.titulo}
                  </h2>
                ) : null}

                {banner.subtitulo ? (
                  <p className="mt-4 max-w-xl text-sm font-semibold text-zinc-100 md:text-xl">
                    {banner.subtitulo}
                  </p>
                ) : null}

                {banner.textoBoton ? (
                  <span className="mt-6 inline-flex rounded-2xl bg-yellow-400 px-6 py-3 text-sm font-black text-black md:text-base">
                    {banner.textoBoton}
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </a>

        {banners.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={previousBanner}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              type="button"
              aria-label="Banner siguiente"
              onClick={nextBanner}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-100 backdrop-blur-sm transition hover:bg-black/80 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={28} />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((item, index) => (
                <button
                  key={item.id}
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
          </>
        ) : null}
      </div>
    </section>
  );
}
