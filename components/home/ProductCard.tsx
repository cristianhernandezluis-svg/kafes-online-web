export type ProductCardProps = {
  href: string;
  image: string;
  alt: string;
  badge: string;
  title: string;
  description: string;
  price: string;
  beforePrice: string;
};

export default function ProductCard({
  href,
  image,
  alt,
  badge,
  title,
  description,
  price,
  beforePrice,
}: ProductCardProps) {
  return (
    <a
      href={href}
      className="group block overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl"
    >
      <div className="relative overflow-hidden bg-zinc-50 p-6">
        <span className="absolute left-5 top-5 z-10 rounded-full bg-red-600 px-3 py-1.5 text-xs font-black text-white">
          {badge}
        </span>

        <img
          src={image}
          alt={alt}
          className="h-72 w-full object-contain transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-green-600">● Disponible</span>
          <span className="text-xs font-bold text-zinc-500">
            Envíos nacionales
          </span>
        </div>

        <h3 className="mt-4 text-xl font-black leading-tight">{title}</h3>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500">
          {description}
        </p>

        <div className="mt-5 flex items-end gap-3">
          <p className="text-3xl font-black text-red-600">{price}</p>
          <span className="pb-1 text-base text-zinc-400 line-through">
            {beforePrice}
          </span>
        </div>

        <div className="mt-6 flex w-full items-center justify-center rounded-2xl bg-yellow-400 py-4 font-black text-black transition group-hover:bg-black group-hover:text-yellow-400">
          Ver producto
        </div>
      </div>
    </a>
  );
}
