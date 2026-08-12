"use client";

import { ShoppingCart } from "lucide-react";

type StickyBuyButtonProps = {
  visible: boolean;
  onComprar: () => void;
};

export default function StickyBuyButton({
  visible,
  onComprar,
}: StickyBuyButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-zinc-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] backdrop-blur md:hidden">
      <button
        type="button"
        onClick={onComprar}
        className="flex w-full animate-pulse items-center justify-center gap-2 rounded-2xl border-b-4 border-yellow-600 bg-yellow-400 py-4 text-lg font-black text-black shadow-[0_10px_25px_rgba(250,204,21,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0 active:scale-[0.98]"
      >
        <ShoppingCart size={22}  />
        REALIZAR PEDIDO
      </button>
    </div>
  );
}