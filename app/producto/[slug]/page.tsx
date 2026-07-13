"use client";

import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  ShoppingCart,
  X,
  User,
  Phone,
  MapPin,
  Home,
  Truck,
  ShieldCheck,
  Search,
} from "lucide-react";

declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
  }
}

const productos: any = {
  "sierra-bomvink-8": {
    nombre: 'Sierra Inalámbrica BOMVINK 8"',
    nombreCorto: 'Sierra BOMVINK 8"',
    precio: 249,
    precioAntes: 299,
    imagen: "/sierra-bomvink-8.jpg",
    etiqueta: "MÁS VENDIDO",
    modoGempages: false,
    descripcion:
      "Sierra inalámbrica profesional ideal para poda, madera, trabajos de campo y uso continuo.",
    mini: ["2 baterías", "8 pulgadas", "21V"],
    beneficios: [
      "21V de potencia",
      "Incluye 2 baterías",
      "Espada de 8 pulgadas",
      "Corte rápido y preciso",
      "Ideal para poda y madera",
      "Diseño ergonómico",
    ],
  },

  "sierra-bomvink-gempages": {
    nombre: 'Sierra Inalámbrica BOMVINK 8" - Oferta Premium',
    nombreCorto: 'Sierra BOMVINK 8"',
    precio: 249,
    precioAntes: 499,
    imagen: "/sierra-bomvink-gempages.jpg",
    etiqueta: "OFERTA PREMIUM",
    modoGempages: true,
    descripcion: "Sierra inalámbrica BOMVINK 8 pulgadas.",
    mini: ["21V", "8 pulgadas", "12 meses"],
    beneficios: ["Batería 21V", "Corte rápido", "Garantía 12 meses"],
  },

"soporte-diagonal-gempages": {
    nombre: "Soporte Diagonal para Amoladora",
    nombreCorto: "Soporte Diagonal",
    precio: 99,
    precioAntes: 149,
    imagen: "/soporte-diagonal-gempages.jpg",
    etiqueta: "OFERTA",
    modoGempages: true,

    descripcion:
      "Soporte profesional para realizar cortes diagonales de 45° con mayor precisión, rapidez y seguridad.",

    mini: [
      "45°",
      "Universal",
      "Alta precisión",
    ],

    beneficios: [
      "Cortes diagonales perfectos",
      "Compatible con amoladoras 4\" y 4½\"",
      "Mayor estabilidad y seguridad",
      "Ideal para porcelanato, cerámica y mármol",
    ],
  },
"rotomartillo-demoledor-powfull": {
  nombre: "Rotomartillo Demoledor POWFULL",
  nombreCorto: "Rotomartillo POWFULL",
  precio: 659,
  precioAntes: 849,

  imagen: "/rotomartillo-demoledor-powfull.jpg",

  imagenes: [
    "/rotomartillo-demoledor-powfull.jpg",
    "/rotomartillo-demoledor-powfull-2.jpg",
    "/rotomartillo-demoledor-powfull-3.jpg",
    "/rotomartillo-demoledor-powfull-4.jpg",
  ],

  etiqueta: "TECNOLOGÍA BRASILEÑA",
  modoGempages: false,

  descripcion:
    "Rotomartillo demoledor POWFULL de 1600W y 45J de impacto, ideal para trabajos exigentes de demolición en concreto, ladrillo y mampostería.",

  mini: [
    "1600W",
    "45J",
    "HEX30",
  ],

  beneficios: [
    "Potencia nominal de 1600W",
    "Energía de impacto de 45J",
    "Frecuencia de impacto de 1900 golpes por minuto",
    "Portaherramientas HEX30",
    "Voltaje de 220V a 240V",
    "Frecuencia de 50Hz/60Hz",
    "Ideal para demolición de concreto y mampostería",
    "Incluye accesorios para trabajo profesional",
  ],

  fichaTecnica: [
    { nombre: "Modelo", valor: "POW2534" },
    { nombre: "Voltaje", valor: "220V–240V" },
    { nombre: "Frecuencia", valor: "50Hz/60Hz" },
    { nombre: "Potencia nominal", valor: "1600W" },
    { nombre: "Frecuencia de impacto", valor: "1900/min" },
    { nombre: "Energía de impacto", valor: "45J" },
    { nombre: "Portaherramientas", valor: "HEX30" },
  ],

  accesorios: [
    "1 juego de carbones",
    "1 mango auxiliar",
    "1 recipiente para aceite",
    "1 cincel punta HEX 30 × 400 mm",
    "1 cincel plano HEX 30 × 400 mm",
  ],
aida: {
  atencion: {
    titulo: "¿Cansado de perder tiempo con equipos sin fuerza?",
    texto:
      "Rompe concreto, pisos y paredes con 1600W de potencia y 45J de impacto.",
    imagen: "/rotomartillo-aida-atencion.jpg",
  },

  interes: {
    titulo: "Potencia profesional para trabajos exigentes",
    texto:
      "Motor de 1600W, energía de impacto de 45J, 1900 golpes por minuto y encastre HEX30.",
    imagen: "/rotomartillo-aida-interes.jpg",
  },

  deseo: {
    titulo: "Trabaja más rápido y reduce el esfuerzo",
    texto:
      "Ideal para construcción, remodelación, demolición de pisos, paredes, concreto y mampostería.",
    imagen: "/rotomartillo-aida-deseo.jpg",
  },

  accion: {
    titulo: "Llévate hoy el Rotomartillo Demoledor POWFULL",
    texto:
      "Tecnología brasileña, accesorios incluidos y envíos a todo el Perú.",
    imagen: "/rotomartillo-aida-accion.jpg",
  },
},
},
   "soporte-telescopico-xtd": {
    nombre: "Soporte Telescópico XTD para Amoladora",
    nombreCorto: "Soporte Telescópico XTD",
    precio: 209,
    precioAntes: 249,

    imagen: "/soporte-telescopico-xtd.jpg",

    imagenes: [
      "/soporte-telescopico-xtd.jpg",
      "/soporte-telescopico-xtd-2.jpg",
      "/soporte-telescopico-xtd-3.jpg",
      "/soporte-telescopico-xtd-4.jpg",
      "/soporte-telescopico-xtd-5.jpg",
    ],

    etiqueta: "NUEVO INGRESO",
    modoGempages: false,

    descripcion:
      "Soporte telescópico para amoladora, ideal para cortes más precisos, seguros y profesionales.",

    mini: ["115/125 mm", "Base de hierro", "Ajustable"],

    beneficios: [
      "Base de hierro resistente",
      "Soportes con ajuste variable",
      "Mayor seguridad al cortar",
      "Protección contra chispas integrada",
      "Compatible con discos de 115 y 125 mm",
      "No incluye amoladora",
    ],
  },
};

const regionesPeru = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
];

export default function ProductoPage() {
  const comprarAhoraRef = useRef<HTMLButtonElement | null>(null);
  const [mostrarCompraFija, setMostrarCompraFija] = useState(false);
const params = useParams();
const slug = params.slug as string;
const producto = productos[slug];

const [imagenActiva, setImagenActiva] = useState(0);
const [openCheckout, setOpenCheckout] = useState(false);
const [pedidoFinalizado, setPedidoFinalizado] = useState(false);
const [loading, setLoading] = useState(false);

const [cantidad, setCantidad] = useState(1);
const [nombre, setNombre] = useState("");
const [celular, setCelular] = useState("");
const [ciudad, setCiudad] = useState("");
const [region, setRegion] = useState("");
const [direccion, setDireccion] = useState("");
const [referencia, setReferencia] = useState("");

const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);

const viewContentTrackedSlug = useRef<string | null>(null);

const precio = producto?.precio || 0;
const total = precio * cantidad;

const galeria =
  producto?.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : producto
      ? [producto.imagen]
      : [];

const imagenPrincipal = galeria[imagenActiva] || producto?.imagen;

useEffect(() => {
  const onScroll = () => {
    if (!comprarAhoraRef.current) return;

    const rect = comprarAhoraRef.current.getBoundingClientRect();

    // Solo aparece cuando el botón original ya pasó por arriba
    if (rect.bottom < 0) {
      setMostrarCompraFija(true);
    } else {
      setMostrarCompraFija(false);
    }
  };

  window.addEventListener("scroll", onScroll);

  // Ejecutar una vez
  onScroll();

  return () => window.removeEventListener("scroll", onScroll);
}, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!producto || !slug) return;
    if (viewContentTrackedSlug.current === slug) return;

    viewContentTrackedSlug.current = slug;

    window.ttq?.track("ViewContent", {
      content_id: slug,
      content_name: producto.nombre,
      content_type: "product",
      value: precio,
      currency: "PEN",
      price: precio,
    });

    window.fbq?.("track", "ViewContent", {
      value: precio,
      currency: "PEN",
      content_ids: [slug],
      content_name: producto.nombre,
      content_type: "product",
    });
  }, [slug, producto, precio]);

  if (!producto) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl font-black">Producto no encontrado</h1>
          <Link
            href="/"
            className="inline-block mt-6 bg-black text-yellow-400 px-8 py-4 rounded-2xl font-black"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const abrirCheckout = () => {
    window.ttq?.track("AddToCart", {
      content_id: slug,
      content_name: producto.nombre,
      content_type: "product",
      value: total,
      currency: "PEN",
      quantity: cantidad,
      price: precio,
    });

    window.ttq?.track("InitiateCheckout", {
      content_id: slug,
      content_name: producto.nombre,
      content_type: "product",
      value: total,
      currency: "PEN",
      quantity: cantidad,
      price: precio,
    });

    window.fbq?.("track", "AddToCart", {
      value: total,
      currency: "PEN",
      content_ids: [slug],
      content_name: producto.nombre,
      content_type: "product",
      contents: [
        {
          id: slug,
          quantity: cantidad,
          item_price: precio,
        },
      ],
    });

    window.fbq?.("track", "InitiateCheckout", {
      value: total,
      currency: "PEN",
      content_ids: [slug],
      content_name: producto.nombre,
      content_type: "product",
      contents: [
        {
          id: slug,
          quantity: cantidad,
          item_price: precio,
        },
      ],
    });

    setOpenCheckout(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  const finalizarPedido = async () => {
    if (!nombre || !celular || !ciudad || !region || !direccion) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    const pedido = {
      producto: producto.nombre,
      slug,
      precio,
      cantidad,
      total,
      nombre,
      celular,
      ciudad,
      region,
      direccion,
      referencia,
      estado: "NUEVO",
      fecha: new Date().toLocaleString(),
    };

    try {
      await fetch(
        "https://n8n-n8n.xhb7ax.easypanel.host/webhook/96372183-cc2d-468e-b1c3-5ee5564eb2b8",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pedido),
        }
      );

      setPedidoFinalizado(true);

      window.fbq?.("track", "Purchase", {
        value: total,
        currency: "PEN",
        content_ids: [slug],
        content_name: producto.nombre,
        content_type: "product",
        contents: [
          {
            id: slug,
            quantity: cantidad,
            item_price: precio,
          },
        ],
      });

      const telefonoLimpio = celular.replace(/\D/g, "");
const telefonoConPais = telefonoLimpio.startsWith("51")
  ? `+${telefonoLimpio}`
  : `+51${telefonoLimpio}`;

window.ttq?.identify({
  phone_number: telefonoConPais,
  external_id: telefonoLimpio,
});

window.ttq?.track("Purchase", {
  value: total,
  currency: "PEN",
  content_id: slug,
  content_name: producto.nombre,
  content_type: "product",
  quantity: cantidad,
  price: precio,
});

      window.ttq?.track("CompletePayment", {
        value: total,
        currency: "PEN",
        content_id: slug,
        content_name: producto.nombre,
        content_type: "product",
        quantity: cantidad,
        price: precio,
      });

      setTimeout(() => {
        setOpenCheckout(false);
        setPedidoFinalizado(false);
        setNombre("");
        setCelular("");
        setCiudad("");
        setRegion("");
        setDireccion("");
        setReferencia("");
        setCantidad(1);
      }, 6000);
    } catch (error) {
      alert("Error al enviar pedido");
    }

    setLoading(false);
  };

  return (
    <main
  className={`min-h-screen w-full overflow-x-hidden text-black pb-28 ${
        producto.modoGempages ? "bg-black" : "bg-white"
      }`}
    >
      {!producto.modoGempages && (
        <>
          <div className="bg-green-500 text-white text-center py-2 text-sm font-bold">
            🚚 ENVÍOS GRATIS A TODO EL PERÚ
          </div>

          <header className="sticky top-0 z-50 border-b bg-white">
  <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-3 md:gap-4 md:px-6 md:py-4">
    <Link
      href="/"
      className="min-w-0 shrink text-lg font-black leading-none md:text-3xl"
    >
      KAFES ONLINE
    </Link>

    <div className="hidden w-full max-w-[420px] items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 md:flex">
      <Search size={20} className="shrink-0 text-zinc-500" />

      <input
        placeholder="Busca productos..."
        className="min-w-0 flex-1 bg-transparent outline-none"
      />
    </div>

    <div className="flex shrink-0 items-center gap-2 md:gap-3">
      <Link
        href="/"
        className="hidden text-sm font-bold hover:text-yellow-500 sm:block md:text-base"
      >
        Inicio
      </Link>

      <Link
        href="/#productos"
        className="hidden font-bold hover:text-yellow-500 md:block"
      >
        Catálogo
      </Link>

      <button
        type="button"
        aria-label="Carrito"
        className="rounded-full bg-yellow-400 p-2.5 text-black md:p-3"
      >
        <ShoppingCart size={20} />
      </button>
    </div>
  </div>
</header>
        </>
      )}

      {producto.modoGempages ? (
  <>
    <section className="w-full bg-black">
      <div className="w-full max-w-[430px] mx-auto bg-black">
        {[
          producto.imagen,
          `/${slug}-2.png`,
          `/${slug}-3.png`,
          `/${slug}-4.jpg`,
          `/${slug}-5.jpg`,
        ].map((src, index) => (
          <div key={src}>
            <Image
              src={src}
              alt={`${producto.nombre} ${index + 1}`}
              width={1365}
              height={2048}
              className="w-full h-auto block"
              priority={index === 0}
            />

            <div className="px-4 pb-6 pt-2 bg-black">
              <button
                onClick={abrirCheckout}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-black text-2xl py-5 rounded-[24px] shadow-[0_10px_40px_rgba(22,163,74,0.35)] transition active:scale-[0.98] flex items-center justify-center gap-3 border-b-[6px] border-green-800 animate-[pulse_1.5s_ease-in-out_infinite]"
              >
                <ShoppingCart size={28} />
                REALIZAR PEDIDO
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
) : (
        <>
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-3 py-6 sm:px-4 md:grid-cols-2 md:gap-12 md:px-6 md:py-10">
            <div>
  {/* Imagen principal */}
  <div className="w-full overflow-hidden rounded-3xl bg-zinc-100 p-3 sm:p-5 md:p-8">
  <Image
    src={imagenPrincipal}
    alt={producto.nombre}
    width={700}
    height={700}
    className="block h-auto w-full rounded-2xl object-contain"
    priority
  />
</div>

  {/* Miniaturas */}
  {galeria.length > 1 && (
    <div className="mt-4 flex w-full gap-2 overflow-x-auto pb-2">
      {galeria.map((src: string, index: number) => (
        <button
          key={`${src}-${index}`}
          type="button"
          onClick={() => setImagenActiva(index)}
          aria-label={`Ver imagen ${index + 1} de ${producto.nombre}`}
          className={`shrink-0 rounded-xl border-2 bg-white p-1.5 transition sm:rounded-2xl sm:p-2 ${
  imagenActiva === index
    ? "border-yellow-400 shadow-lg"
    : "border-zinc-200"
}`}
        >
          <Image
            src={src}
            alt={`${producto.nombre} - imagen ${index + 1}`}
            width={110}
            height={110}
            className="h-16 w-16 object-contain sm:h-24 sm:w-24"
          />
        </button>
      ))}
    </div>
  )}

  {/* Características rápidas */}
  <div className="mt-5 grid w-full grid-cols-3 gap-2 sm:gap-4">
    {producto.mini.map((item: string) => (
      <MiniBox key={item} text={item} />
    ))}
  </div>
</div>

            <div>
              <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                {producto.etiqueta}
              </span>

              <h1 className="text-4xl md:text-5xl font-black mt-6">
                {producto.nombre}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-yellow-400 font-bold">
                ★★★★★
                <span className="text-zinc-600 text-sm">
                  4.9/5 +100 reseñas
                </span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <p className="text-5xl font-black text-yellow-500">
                  S/{precio}
                </p>
                <span className="line-through text-zinc-400 text-2xl">
                  S/{producto.precioAntes}
                </span>
              </div>

              <div className="mt-4 bg-red-100 text-red-600 px-4 py-3 rounded-2xl font-bold inline-block">
                🔥 Últimas unidades disponibles
              </div>

              <div className="mt-4 bg-black text-yellow-400 px-5 py-4 rounded-2xl font-black inline-block shadow-xl animate-pulse">
                ⏰ Oferta termina en: {formatTime(timeLeft)}
              </div>

              <p className="text-zinc-600 mt-6 text-lg leading-8">
                {producto.descripcion}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <InfoBox
                  icon={<Truck />}
                  title="Envío rápido"
                  text="A todo el Perú"
                />
                <InfoBox
                  icon={<ShieldCheck />}
                  title="Compra segura"
                  text="Confirmación por WhatsApp"
                />
              </div>

              <div className="mt-8 space-y-3">
                {producto.beneficios.map((item: string) => (
                  <Benefit key={item} text={item} />
                ))}
              </div>

              <div className="mt-8">
                <label className="font-black">Cantidad</label>

                <div className="flex mt-3 w-[180px]">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="bg-zinc-200 px-5 py-3 font-black rounded-l-xl"
                  >
                    -
                  </button>

                  <div className="flex-1 border-y flex items-center justify-center font-black">
                    {cantidad}
                  </div>

                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    className="bg-zinc-200 px-5 py-3 font-black rounded-r-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={abrirCheckout}
                  className="bg-green-500 hover:bg-green-600 text-white w-full py-5 rounded-2xl text-2xl font-black transition shadow-xl"
                >
                  Agregar al carrito
                </button>

                <button
  ref={comprarAhoraRef}
  onClick={abrirCheckout}
  className="bg-pink-600 hover:bg-pink-700 text-white w-full py-5 rounded-2xl text-2xl font-black shadow-xl animate-[pulse_1.2s_ease-in-out_infinite]"
>
  Comprar ahora
</button>
              </div>

              <div className="mt-6 bg-zinc-100 rounded-2xl p-5 space-y-3 text-sm">
                <p>🚚 Envío gratis a todo el Perú</p>
                <p>📦 Pago contra entrega</p>
                <p>🛡️ Garantía de satisfacción</p>
              </div>
            </div>
          </div>

          <section className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-black text-center mb-10">
              
{producto.aida && (
  <section className="bg-zinc-50 py-12 md:py-20">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="space-y-10 md:space-y-16">
        {[
          {
            letra: "A",
            nombre: "Atención",
            ...producto.aida.atencion,
          },
          {
            letra: "I",
            nombre: "Interés",
            ...producto.aida.interes,
          },
          {
            letra: "D",
            nombre: "Deseo",
            ...producto.aida.deseo,
          },
        ].map((bloque, index) => (
          <div
            key={bloque.nombre}
            className={`grid items-center gap-7 overflow-hidden rounded-3xl bg-white p-5 shadow-md md:grid-cols-2 md:p-8 ${
              index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={bloque.imagen}
                alt={bloque.titulo}
                width={900}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="px-1 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-2xl font-black">
                  {bloque.letra}
                </span>

                <span className="text-sm font-black uppercase tracking-widest text-zinc-500">
                  {bloque.nombre}
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                {bloque.titulo}
              </h2>

              <p className="mt-5 text-lg leading-8 text-zinc-600">
                {bloque.texto}
              </p>

              {bloque.nombre === "Interés" && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {["1600W", "45J", "1900/min", "HEX30"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-zinc-100 p-4 text-center font-black"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {bloque.nombre === "Deseo" && producto.accesorios && (
                <div className="mt-6 space-y-3">
                  {producto.accesorios.map((item: string) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 shrink-0 text-green-500" />
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid items-center gap-8 overflow-hidden rounded-3xl bg-black p-6 text-white shadow-2xl md:grid-cols-2 md:p-10">
        <div className="overflow-hidden rounded-2xl bg-white">
          <Image
            src={producto.aida.accion.imagen}
            alt={producto.aida.accion.titulo}
            width={900}
            height={900}
            className="h-auto w-full object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-2xl font-black text-black">
              A
            </span>

            <span className="text-sm font-black uppercase tracking-widest text-yellow-400">
              Acción
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
            {producto.aida.accion.titulo}
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-300">
            {producto.aida.accion.texto}
          </p>

          <div className="mt-7 flex items-end gap-4">
            <span className="text-5xl font-black text-yellow-400">
              S/{precio}
            </span>

            <span className="pb-1 text-2xl text-zinc-500 line-through">
              S/{producto.precioAntes}
            </span>
          </div>

          <button
            type="button"
            onClick={abrirCheckout}
            className="mt-8 w-full rounded-2xl bg-green-600 py-5 text-xl font-black text-white shadow-xl transition hover:bg-green-500 active:scale-[0.98]"
          >
            🛒 COMPRAR AHORA
          </button>

          <div className="mt-5 space-y-2 text-sm font-bold text-zinc-300">
            <p>🚚 Envíos a todo el Perú</p>
            <p>📱 Confirmación por WhatsApp</p>
            <p>🛡️ Compra segura</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)}
Clientes Felices
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Testimonial
                name="Carlos M."
                text="Me llegó rápido y funciona muy bien."
              />
              <Testimonial
                name="Luis R."
                text="Buena potencia y excelente atención."
              />
              <Testimonial
                name="Miguel A."
                text="Producto recomendado, buena calidad."
              />
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-4xl font-black text-center mb-10">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-5">
              <Faq
                question="¿Hacen envíos a provincia?"
                answer="Sí, enviamos a todo el Perú."
              />
              <Faq
                question="¿El pago es contra entrega?"
                answer="Sí, un asesor confirmará tu pedido por WhatsApp."
              />
              <Faq
                question="¿Tiene garantía?"
                answer="Sí, todos nuestros productos cuentan con garantía."
              />
            </div>
          </section>
        </>
      )}

      {!producto.modoGempages && producto.aida && (
  <section className="bg-white py-10 md:py-16">
    <div className="mx-auto w-full max-w-[820px] px-3 sm:px-5">

      {/* SECCIÓN 1: PROBLEMA + SOLUCIÓN */}
      <div className="overflow-hidden rounded-3xl bg-zinc-50 shadow-sm">
        <Image
          src={producto.aida.atencion.imagen}
          alt={producto.aida.atencion.titulo}
          width={1080}
          height={1350}
          className="block h-auto w-full object-cover"
        />

        <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
          <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
            Potencia profesional
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
            {producto.aida.atencion.titulo}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            {producto.aida.atencion.texto}
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: POTENCIA Y ESPECIFICACIONES */}
      <div className="mt-8 overflow-hidden rounded-3xl bg-black text-white shadow-lg">
        <Image
          src={producto.aida.interes.imagen}
          alt={producto.aida.interes.titulo}
          width={1080}
          height={1350}
          className="block h-auto w-full object-cover"
        />

        <div className="px-5 py-8 sm:px-10 sm:py-10">
          <span className="text-sm font-black uppercase tracking-widest text-yellow-400">
            Rendimiento POWFULL
          </span>

          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            {producto.aida.interes.titulo}
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg">
            {producto.aida.interes.texto}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <FeatureBox title="1600W" text="Potencia nominal" dark />
            <FeatureBox title="45J" text="Energía de impacto" dark />
            <FeatureBox title="1900/min" text="Frecuencia de impacto" dark />
            <FeatureBox title="HEX30" text="Portaherramientas" dark />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: USOS Y BENEFICIOS */}
      <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-50 shadow-sm">
        <Image
          src={producto.aida.deseo.imagen}
          alt={producto.aida.deseo.titulo}
          width={1080}
          height={1350}
          className="block h-auto w-full object-cover"
        />

        <div className="px-5 py-8 sm:px-10 sm:py-10">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            {producto.aida.deseo.titulo}
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-600 sm:text-lg">
            {producto.aida.deseo.texto}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              "Demolición de pisos",
              "Apertura de paredes",
              "Trabajos en concreto",
              "Remodelaciones",
              "Construcción profesional",
              "Mampostería y ladrillo",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 font-bold shadow-sm"
              >
                <CheckCircle className="shrink-0 text-green-500" size={22} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: ACCESORIOS */}
      {producto.accesorios && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-black">
              Todo incluido
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              Listo para comenzar a trabajar
            </h2>

            <p className="mt-4 text-zinc-600">
              Recibe el equipo con accesorios esenciales para trabajos de
              demolición profesional.
            </p>

            <div className="mt-7 space-y-3">
              {producto.accesorios.map((item: string) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4"
                >
                  <CheckCircle
                    className="mt-0.5 shrink-0 text-green-500"
                    size={22}
                  />
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 5: FICHA TÉCNICA */}
      {producto.fichaTecnica && (
        <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-100 p-5 sm:p-8">
          <h2 className="text-center text-3xl font-black">
            Ficha técnica
          </h2>

          <div className="mt-7 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {producto.fichaTecnica.map(
              (
                dato: {
                  nombre: string;
                  valor: string;
                },
                index: number
              ) => (
                <div
                  key={dato.nombre}
                  className={`grid grid-cols-2 gap-3 px-4 py-4 ${
                    index !== producto.fichaTecnica.length - 1
                      ? "border-b border-zinc-200"
                      : ""
                  }`}
                >
                  <span className="font-bold text-zinc-600">
                    {dato.nombre}
                  </span>

                  <span className="text-right font-black">
                    {dato.valor}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN 6: CIERRE DE VENTA */}
      <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-b from-yellow-400 to-yellow-300 shadow-xl">
        <Image
          src={producto.aida.accion.imagen}
          alt={producto.aida.accion.titulo}
          width={1080}
          height={1350}
          className="block h-auto w-full object-cover"
        />

        <div className="px-5 py-9 text-center sm:px-10 sm:py-12">
          <span className="text-sm font-black uppercase tracking-widest">
            Oferta por tiempo limitado
          </span>

          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
            {producto.aida.accion.titulo}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-black/70 sm:text-lg">
            {producto.aida.accion.texto}
          </p>

          <div className="mt-7 flex items-end justify-center gap-3">
            <span className="text-5xl font-black text-black">
              S/{precio}
            </span>

            <span className="pb-1 text-xl text-black/50 line-through">
              S/{producto.precioAntes}
            </span>
          </div>

          <div className="mx-auto mt-5 max-w-lg rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold">
            Ahorras S/{producto.precioAntes - precio}
          </div>

          <button
            type="button"
            onClick={abrirCheckout}
            className="mt-7 w-full rounded-2xl bg-green-600 px-6 py-5 text-xl font-black text-white shadow-xl transition hover:bg-green-500 active:scale-[0.98]"
          >
            🛒 COMPRAR AHORA
          </button>

          <div className="mt-6 grid gap-2 text-sm font-bold sm:grid-cols-3">
            <div className="rounded-xl bg-white/65 px-3 py-3">
              🚚 Envíos al Perú
            </div>

            <div className="rounded-xl bg-white/65 px-3 py-3">
              🛡️ Compra segura
            </div>

            <div className="rounded-xl bg-white/65 px-3 py-3">
              📱 Confirmación WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-black mb-8">
            También te pueden interesar:
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCard
              name='Sierra BOMVINK 8"'
              price="S/249"
              image="/sierra-bomvink-8.jpg"
              href="/producto/sierra-bomvink-8"
            />
            <ProductCard
              name='Sierra BOMVINK Premium'
              price="S/249"
              image="/sierra-bomvink-gempages.jpg"
              href="/producto/sierra-bomvink-gempages"
            />
            <ProductCard
              name="Soporte Telescópico XTD"
              price="S/209"
              image="/soporte-telescopico-xtd.jpg"
              href="/producto/soporte-telescopico-xtd"
            />
          </div>
        </section>
      {!producto.modoGempages && (
        <footer className="bg-black text-white px-6 py-16 pb-32">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
            <div>
              <h2 className="text-3xl font-black">KAFES ONLINE</h2>
              <p className="text-zinc-400 mt-4">
                Herramientas profesionales con envío a todo el Perú.
              </p>
            </div>

            <div>
              <h3 className="font-black mb-4">Atención al cliente</h3>
              <p className="text-zinc-400">📞 +51 980 296 583</p>
              <p className="text-zinc-400">📍 Lima, Perú</p>
            </div>

            <div>
              <h3 className="font-black mb-4">Menú inferior</h3>
              <p className="text-zinc-400">Preguntas frecuentes</p>
              <p className="text-zinc-400">Política de envíos</p>
              <p className="text-zinc-400">Términos del servicio</p>
              <p className="text-zinc-400">Política de privacidad</p>
            </div>
          </div>

          <div className="text-center text-zinc-500 text-sm mt-12 border-t border-zinc-800 pt-6">
            © 2026 KAFES ONLINE - Todos los derechos reservados.
          </div>
        </footer>
      )}

      {openCheckout && (
        <div
          onClick={() => setOpenCheckout(false)}
          className="fixed inset-0 bg-black/70 z-[999] overflow-y-auto"
        >
          <div className="min-h-screen flex items-start justify-center p-4">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative my-10"
            >
              <button
                onClick={() => setOpenCheckout(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-black z-10"
              >
                <X />
              </button>

              {!pedidoFinalizado ? (
                <>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 p-4 border-b">
                    <p className="text-xs font-black uppercase tracking-wide">
                      OFERTA ESPECIAL
                    </p>

                    <h2 className="text-2xl font-black leading-tight">
                      FINALIZA TU PEDIDO
                    </h2>

                    <p className="text-sm font-semibold text-black/80 mt-1">
                      🚚 Envíos rápidos a todo el Perú 🇵🇪
                    </p>
                  </div>

                  <div className="p-4 border-b bg-white">
                    <div className="flex gap-3">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        width={85}
                        height={85}
                        className="rounded-2xl object-cover bg-zinc-100 border"
                      />

                      <div className="flex-1">
                        <h3 className="font-black text-[15px] leading-tight">
                          {producto.nombre}
                        </h3>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-black text-black">
                            S/{precio}
                          </span>

                          <span className="line-through text-zinc-400 text-sm">
                            S/{producto.precioAntes}
                          </span>
                        </div>

                        <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                          <Truck size={14} />
                          ENVÍO GRATIS
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b bg-zinc-50">
                    <div className="bg-white border rounded-2xl overflow-hidden">
                      <div className="flex justify-between px-4 py-3 border-b text-sm">
                        <span className="font-medium text-zinc-600">
                          Subtotal
                        </span>
                        <strong className="font-black">S/{total}</strong>
                      </div>

                      <div className="flex justify-between px-4 py-3 border-b text-sm">
                        <span className="font-medium text-zinc-600">Envío</span>
                        <strong className="font-black text-green-600">
                          Gratis
                        </strong>
                      </div>

                      <div className="flex justify-between px-4 py-4 bg-yellow-50">
                        <span className="text-lg font-black">Total</span>
                        <strong className="text-2xl font-black text-black">
                          S/{total}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <Input
                      icon={<User size={18} />}
                      placeholder="Nombre completo *"
                      value={nombre}
                      onChange={setNombre}
                      name="name"
                      autoComplete="name"
                    />

                    <Input
                      icon={<Phone size={18} />}
                      placeholder="Celular *"
                      value={celular}
                      onChange={setCelular}
                      name="tel"
                      type="tel"
                      autoComplete="tel"
                    />

                    <Input
                      icon={<MapPin size={18} />}
                      placeholder="Ciudad o distrito *"
                      value={ciudad}
                      onChange={setCiudad}
                      name="address-level2"
                      autoComplete="address-level2"
                    />

                    <select
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      name="region"
                      autoComplete="address-level1"
                      className="w-full px-5 py-4 border rounded-2xl outline-none bg-white text-zinc-700 text-lg font-semibold"
                    >
                      <option value="">Selecciona tu región *</option>
                      {regionesPeru.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {region && (
  <div className="bg-green-50 border border-green-300 rounded-2xl px-4 py-3 text-sm font-bold text-green-700">
    {region === "Lima"
      ? "✅ Pago contra entrega disponible en Lima Metropolitana"
      : "✅ Envío seguro disponible a tu ciudad. Confirmamos tu pedido por WhatsApp"}
  </div>
)}

                    <Input
                      icon={<Home size={18} />}
                      placeholder="Dirección exacta *"
                      value={direccion}
                      onChange={setDireccion}
                      name="street-address"
                      autoComplete="street-address"
                    />

                    <Input
                      icon={<MapPin size={18} />}
                      placeholder="Referencia"
                      value={referencia}
                      onChange={setReferencia}
                      name="address-line2"
                      autoComplete="address-line2"
                    />

                    <button
                      onClick={finalizarPedido}
                      disabled={loading}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-5 rounded-2xl font-black text-lg transition active:scale-[0.98] flex items-center justify-center gap-3 border-b-[5px] border-yellow-600 shadow-xl animate-[pulse_1.5s_ease-in-out_infinite]"
                    >
                      <Truck size={22} />
                      {loading ? "ENVIANDO..." : "REALIZAR PEDIDO"}
                    </button>

                    <p className="text-center text-xs text-zinc-500 font-semibold mt-3">
                      🔒 Tus datos están protegidos y tu pedido será confirmado
                      por WhatsApp
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <div className="flex justify-center mb-5">
                    <CheckCircle size={90} className="text-green-500" />
                  </div>

                  <h2 className="text-3xl font-black mb-4">
  ¡Pedido recibido!
</h2>

<p className="text-zinc-600 text-lg leading-8">
  Gracias por confiar en KAFES ONLINE.
</p>

<div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-left space-y-3">
  <p className="font-bold text-green-700">
    ✅ Un asesor se comunicará contigo por WhatsApp para confirmar tu pedido.
  </p>

  <p className="font-bold text-green-700">
    📦 Envíos a todo el Perú.
  </p>

  <p className="font-bold text-green-700">
    ☎️ Mantén tu celular disponible.
  </p>
</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

{!producto.modoGempages && mostrarCompraFija && (
  <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-zinc-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] backdrop-blur md:hidden">
    <button
      type="button"
      onClick={abrirCheckout}
      className="w-full rounded-2xl bg-green-500 py-4 text-lg font-black text-white shadow-lg transition active:scale-[0.98]"
    >
      🛒 COMPRAR AHORA
    </button>
  </div>
)}

      <WhatsAppButton />
    </main>
  );
}

function Input({
  icon,
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
  type = "text",
}: any) {
  return (
    <div className="flex border rounded-2xl overflow-hidden">
      <div className="bg-zinc-100 px-5 flex items-center text-zinc-500">
        {icon}
      </div>

      <input
        required
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-4 outline-none text-lg"
      />
    </div>
  );
}

function InfoBox({ icon, title, text }: any) {
  return (
    <div className="border rounded-2xl p-4">
      <div className="text-yellow-500">{icon}</div>
      <h3 className="font-black mt-2">{title}</h3>
      <p className="text-sm text-zinc-500">{text}</p>
    </div>
  );
}

function MiniBox({ text }: any) {
  return (
    <div className="min-w-0 rounded-xl bg-zinc-100 px-2 py-3 text-center text-xs font-black break-words sm:rounded-2xl sm:p-4 sm:text-base">
      {text}
    </div>
  );
}

function FeatureBox({
  title,
  text,
  dark = false,
}: {
  title: string;
  text: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center ${
        dark ? "bg-white/10" : "bg-zinc-100"
      }`}
    >
      <p
        className={`text-xl font-black ${
          dark ? "text-yellow-400" : "text-black"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-1 text-xs font-semibold ${
          dark ? "text-zinc-300" : "text-zinc-500"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function Benefit({ text }: any) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="text-green-500" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Testimonial({ name, text }: any) {
  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm text-center">
      <div className="text-yellow-400 text-xl mb-3">★★★★★</div>
      <p className="text-zinc-700">"{text}"</p>
      <h3 className="font-black mt-4">{name}</h3>
    </div>
  );
}

function Faq({ question, answer }: any) {
  return (
    <div className="border rounded-3xl p-6">
      <h3 className="font-black text-xl">{question}</h3>
      <p className="text-zinc-600 mt-3">{answer}</p>
    </div>
  );
}

function ProductCard({ name, price, image, href }: any) {
  return (
    <Link href={href} className="bg-white border rounded-3xl p-4 shadow-sm block">
      <Image
        src={image}
        alt={name}
        width={300}
        height={300}
        className="w-full h-40 object-contain bg-zinc-100 rounded-2xl"
      />

      <h3 className="font-black mt-4">{name}</h3>
      <p className="text-yellow-500 font-black text-xl mt-2">{price}</p>
    </Link>
  );
}