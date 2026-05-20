"use client";

import Image from "next/image";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-24 right-5 z-[998]">

      <a
        href="https://wa.me/51980296583"
        target="_blank"
        className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 overflow-hidden"
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