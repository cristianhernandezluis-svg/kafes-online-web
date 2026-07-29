"use client";

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
        className="w-full rounded-2xl bg-green-500 py-4 text-lg font-black text-white shadow-lg transition hover:bg-green-600 active:scale-[0.98]"
      >
        🛒 COMPRAR AHORA
      </button>
    </div>
  );
}