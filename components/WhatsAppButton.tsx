"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 20000); // 20 segundos

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-5 z-[998]">
      <a
        href="https://wa.me/51980296583"
        target="_blank"
        className="
        w-16
        h-16
        rounded-full
        shadow-[0_10px_30px_rgba(37,211,102,0.45)]
        flex
        items-center
        justify-center
        transition-all
        hover:scale-110
        overflow-hidden
        animate-[pulse_2s_ease-in-out_infinite]
        "
      >
        <Image
          src="/whatsapp-logo.png"
          alt="WhatsApp"
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
}