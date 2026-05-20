"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-24 right-5 z-[998] flex flex-col gap-3">

      {/* WHATSAPP */}
      <a
        href="https://wa.me/51980296583"
        target="_blank"
        className="bg-green-500 hover:bg-green-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageCircle size={34} className="text-white" />
      </a>

      {/* MESSENGER */}
      <a
        href="https://m.me/"
        target="_blank"
        className="bg-blue-500 hover:bg-blue-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-9 h-9"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.91 1.455 5.505 3.727 7.197V22l3.405-1.87c.908.252 1.868.387 2.868.387 5.523 0 10-4.145 10-9.25S17.523 2 12 2zm1.027 12.412-2.544-2.713-4.966 2.713 5.463-5.8 2.563 2.713 4.947-2.713-5.463 5.8z"/>
        </svg>
      </a>

    </div>
  );
}