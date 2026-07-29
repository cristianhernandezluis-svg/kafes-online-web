import WhatsAppButton from "@/components/WhatsAppButton";
import Benefit from "@/components/home/Benefit";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/home/ProductCard";
import PromoCard from "@/components/home/PromoCard";
import {
  Search,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  ChevronRight,
  Droplets,
  Trees,
  Zap,
  Sparkles,
  BadgePercent,
} from "lucide-react";

const categories = [
  {
    name: "Sierras",
    image: "/categorias/sierras.png",
    href: "/categoria/sierras",
  },
  {
    name: "Hidrolavadoras",
    image: "/categorias/hidrolavadoras.png",
    href: "/categoria/hidrolavadoras",
  },
  {
    name: "Bombas de agua",
    image: "/categorias/bombas.png",
    href: "/categoria/bombas-de-agua",
  },
  {
    name: "Generadores",
    image: "/categorias/generadores.png",
    href: "/categoria/generadores",
  },
  {
    name: "Jardinería",
    image: "/categorias/jardineria.png",
    href: "/categoria/jardineria",
  },
  {
    name: "Herramientas",
    image: "/categorias/herramientas.png",
    href: "/categoria/herramientas",
  },
  {
    name: "Ofertas",
    image: "/categorias/ofertas.png",
    href: "#ofertas",
  },
];

const products = [
  {
    href: "/producto/sierra-bomvink-8",
    image: "/sierra-bomvink-8.jpg",
    alt: "Sierra inalámbrica BOMVINK",
    badge: "MÁS VENDIDO",
    title: 'Sierra Inalámbrica BOMVINK 8"',
    description:
      "Incluye 2 baterías de 21V. Ideal para poda, corte de madera y trabajos de campo.",
    price: "S/249",
    beforePrice: "S/299",
  },
{
  href: "/producto/rotomartillo-demoledor-powfull",
  image: "/rotomartillo-demoledor-powfull.jpg",
  alt: "Rotomartillo Demoledor POWFULL",
  badge: "TECNOLOGÍA BRASILEÑA",
  title: "Rotomartillo Demoledor POWFULL",
  description:
    "Equipo profesional de 1600W y 45J para trabajos exigentes de demolición.",
  price: "S/659",
  beforePrice: "S/849",
},
  {
    href: "/producto/soporte-telescopico-xtd",
    image: "/soporte-telescopico-xtd.jpg",
    alt: "Soporte telescópico XTD",
    badge: "NUEVO",
    title: "Soporte Telescópico XTD",
    description:
      "Mayor estabilidad, precisión y seguridad para realizar cortes profesionales.",
    price: "S/209",
    beforePrice: "S/249",
  },
  {
    href: "/producto/hidrolavadora-bomder",
    image: "/hidrolavadora-bomder.jpg",
    alt: "Hidrolavadora BOMDER",
    badge: "OFERTA PATRIA",
    title: "Hidrolavadora BOMDER 2500W",
    description:
      "Potente equipo para lavar autos, motos, fachadas, patios y maquinaria.",
    price: "S/299",
    beforePrice: "S/349",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      {/* Barra informativa superior */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-bold md:text-sm">
          <Truck size={16} className="text-yellow-400" />
          <span>
            Envíos rápidos a todo el Perú
            <span className="mx-2 text-zinc-500">|</span>
            🇵🇪 Especial Fiestas Patrias
            <span className="mx-2 text-zinc-500">|</span>
            Hasta 30% de descuento
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-yellow-400 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <a href="/" className="shrink-0">
            <h1 className="text-xl font-black tracking-tight md:text-2xl">
              KAFES ONLINE
            </h1>
          </a>

          <div className="hidden max-w-xl flex-1 items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm md:flex">
            <Search size={20} className="text-zinc-500" />

            <input
              type="search"
              placeholder="¿Qué herramienta estás buscando?"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/51980296583?text=Hola,%20quiero%20información%20de%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-white px-5 py-3 text-sm font-black transition hover:scale-105 lg:block"
            >
              Hablar con un asesor
            </a>

            <button
              aria-label="Ver carrito"
              className="rounded-full bg-black p-3 text-yellow-400 transition hover:scale-105"
            >
              <ShoppingCart size={22} />
            </button>
          </div>
        </div>

        {/* Buscador móvil */}
        <div className="px-4 pb-4 md:hidden">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-zinc-500" />

            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </header>

      {/* Franja industrial */}
      <div
        className="h-3 w-full"
        style={{
          background:
            "repeating-linear-gradient(-45deg, #000 0px, #000 12px, #facc15 12px, #facc15 24px)",
        }}
      />

      {/* Categorías rápidas */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-6 md:px-6">
          <div className="flex min-w-max justify-start gap-4 md:justify-center md:gap-6">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="group w-24 text-center md:w-28"
              >
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-2 transition duration-300 group-hover:-translate-y-1 group-hover:border-yellow-400 group-hover:shadow-lg md:h-28 md:w-28">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                <p className="mt-2 text-xs font-bold md:text-sm">
                  {category.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <HeroSlider />

      {/* Beneficios */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="grid overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <Benefit
            icon={<Truck size={28} />}
            title="Envíos nacionales"
            text="Llegamos a todo el Perú."
          />

          <Benefit
            icon={<ShieldCheck size={28} />}
            title="Compra confiable"
            text="Productos con garantía."
          />

          <Benefit
            icon={<CreditCard size={28} />}
            title="Pago seguro"
            text="Compra mediante Izipay."
          />

          <Benefit
            icon={<Headphones size={28} />}
            title="Atención personalizada"
            text="Asesoría rápida por WhatsApp."
          />
        </div>
      </section>

      {/* Ofertas rápidas */}
      <section id="ofertas" className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-sm font-black uppercase tracking-widest text-red-600">
              Solo por tiempo limitado
            </span>

            <h2 className="mt-1 text-3xl font-black md:text-4xl">
              Ofertas de Fiestas Patrias
            </h2>
          </div>

          <a
            href="#productos"
            className="hidden items-center gap-1 font-bold text-zinc-700 transition hover:text-red-600 md:flex"
          >
            Ver todos
            <ChevronRight size={18} />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <PromoCard
            icon={<Droplets size={38} />}
            title="Hidrolavadoras"
            text="Potencia para autos, motos y maquinaria."
            href="/categoria/hidrolavadoras"
            background="bg-blue-600"
          />

          <PromoCard
            icon={<Trees size={38} />}
            title="Jardinería"
            text="Sierras, podadoras y cortasetos."
            href="/categoria/jardineria"
            background="bg-green-600"
          />

          <PromoCard
            icon={<Zap size={38} />}
            title="Generadores"
            text="Energía segura donde la necesites."
            href="/categoria/generadores"
            background="bg-zinc-900"
          />
        </div>
      </section>

      {/* Productos */}
      <section
        id="productos"
        className="border-y border-zinc-200 bg-white py-14"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-9 flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-yellow-600">
                <Sparkles size={18} />
                Selección KAFES
              </span>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                Productos destacados
              </h2>
            </div>

            <span className="hidden rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-600 md:block">
              Stock limitado
            </span>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner secundario */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid overflow-hidden rounded-[32px] bg-black text-white shadow-xl md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-12 md:px-14">
            <span className="flex w-fit items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black">
              <BadgePercent size={18} />
              PRECIOS ESPECIALES
            </span>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">
              Equipa tu taller con herramientas profesionales
            </h2>

            <p className="mt-5 max-w-xl text-lg text-zinc-300">
              Encuentra equipos para construcción, agricultura, mantenimiento y
              trabajos especializados.
            </p>

            <a
              href="#productos"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-yellow-400 px-7 py-4 text-lg font-black text-black transition hover:scale-105 hover:bg-yellow-300"
            >
              COMPRAR AHORA
              <ChevronRight size={22} />
            </a>
          </div>

          <div className="min-h-[330px] bg-zinc-900">
            <img
              src="/banner-taller-profesional.jpg"
              alt="Herramientas profesionales Kafes Online"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pie básico */}
      <footer className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-black text-yellow-400">
              KAFES ONLINE
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              Herramientas profesionales con envíos a todo el Perú y atención
              personalizada.
            </p>
          </div>

          <div>
            <h3 className="font-black">Categorías</h3>

            <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-400">
              <a href="/categoria/sierras">Sierras</a>
              <a href="/categoria/hidrolavadoras">Hidrolavadoras</a>
              <a href="/categoria/bombas-de-agua">Bombas de agua</a>
              <a href="/categoria/generadores">Generadores</a>
            </div>
          </div>

          <div>
            <h3 className="font-black">Atención</h3>

            <p className="mt-4 text-sm text-zinc-400">
              Escríbenos por WhatsApp para recibir información sobre precios,
              stock y envíos.
            </p>

            <a
              href="https://wa.me/51980296583"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-black text-black"
            >
              Contactar ahora
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800 py-5 text-center text-xs text-zinc-500">
          © 2026 KAFES ONLINE. Todos los derechos reservados.
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  );
}
