import Image from "next/image";
import Link from "next/link";

export type ProductoRelacionado = {
  nombre: string;
  precio: string | number;
  imagen: string;
  href: string;
};

type RelatedProductsProps = {
  productos?: ProductoRelacionado[];
};

const productosPorDefecto: ProductoRelacionado[] = [
  {
    nombre: 'Sierra BOMVINK 8"',
    precio: 249,
    imagen: "/sierra-bomvink-8.jpg",
    href: "/producto/sierra-bomvink-8",
  },
  {
    nombre: "Sierra BOMVINK Premium",
    precio: 249,
    imagen: "/sierra-bomvink-gempages.jpg",
    href: "/producto/sierra-bomvink-gempages",
  },
  {
    nombre: "Soporte Telescópico XTD",
    precio: 209,
    imagen: "/soporte-telescopico-xtd.jpg",
    href: "/producto/soporte-telescopico-xtd",
  },
];

export default function RelatedProducts({
  productos = productosPorDefecto,
}: RelatedProductsProps) {
  if (productos.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-8 text-3xl font-black">
        También te pueden interesar:
      </h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {productos.map((producto) => (
          <ProductCard
            key={producto.href}
            producto={producto}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  producto,
}: {
  producto: ProductoRelacionado;
}) {
  return (
    <Link
      href={producto.href}
      className="block rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <Image
        src={producto.imagen}
        alt={producto.nombre}
        width={300}
        height={300}
        className="h-40 w-full rounded-2xl bg-zinc-100 object-contain"
      />

      <h3 className="mt-4 font-black">
        {producto.nombre}
      </h3>

      <p className="mt-2 text-xl font-black text-yellow-500">
        S/{producto.precio}
      </p>
    </Link>
  );
}