"use client";

import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  const precio = 249;
  const total = precio * cantidad;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      producto: "Sierra Inalámbrica BOMVINK 8",
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

      if (typeof window !== "undefined") {
        window.fbq?.("track", "Purchase", {
          value: total,
          currency: "PEN",
        });

        window.ttq?.track("CompletePayment", {
          value: total,
          currency: "PEN",
        });
      }

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
    <main className="min-h-screen bg-white text-black">
      <div className="bg-green-500 text-white text-center py-2 text-sm font-bold">
        🚚 ENVÍOS GRATIS A TODO EL PERÚ
      </div>

      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="text-2xl md:text-3xl font-black">
            KAFES ONLINE
          </a>

          <div className="hidden md:flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-2 w-[420px]">
            <Search size={20} className="text-zinc-500" />
            <input
              placeholder="Busca productos..."
              className="bg-transparent outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <a href="/" className="font-bold hover:text-yellow-500 transition">
              Inicio
            </a>

            <a
              href="/#productos"
              className="hidden md:block font-bold hover:text-yellow-500 transition"
            >
              Catálogo
            </a>

            <button className="bg-yellow-400 text-black p-3 rounded-full">
              <ShoppingCart />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-12">
        <div>
          <div className="bg-zinc-100 rounded-3xl p-8">
            <Image
              src="/sierra-bomvink-8.jpg"
              alt="Sierra BOMVINK"
              width={700}
              height={700}
              className="rounded-2xl object-contain"
              priority
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <MiniBox text="2 baterías" />
            <MiniBox text="8 pulgadas" />
            <MiniBox text="21V" />
          </div>
        </div>

        <div>
          <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
            MÁS VENDIDO
          </span>

          <h1 className="text-4xl md:text-5xl font-black mt-6">
            Sierra Inalámbrica BOMVINK 8"
          </h1>

          <div className="flex items-center gap-2 mt-3 text-yellow-400 font-bold">
            ★★★★★
            <span className="text-zinc-600 text-sm">
              4.9/5 +100 reseñas
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <p className="text-5xl font-black text-yellow-500">S/249</p>
            <span className="line-through text-zinc-400 text-2xl">S/299</span>
          </div>

          <div className="mt-4 bg-red-100 text-red-600 px-4 py-3 rounded-2xl font-bold inline-block">
            🔥 Últimas unidades disponibles
          </div>

          <div className="mt-4 bg-black text-yellow-400 px-5 py-4 rounded-2xl font-black inline-block shadow-xl animate-pulse">
            ⏰ Oferta termina en: {formatTime(timeLeft)}
          </div>

          <p className="text-zinc-600 mt-6 text-lg leading-8">
            Sierra inalámbrica profesional ideal para poda, madera, trabajos de
            campo y uso continuo.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <InfoBox icon={<Truck />} title="Envío rápido" text="A todo el Perú" />
            <InfoBox icon={<ShieldCheck />} title="Compra segura" text="Confirmación por WhatsApp" />
          </div>

          <div className="mt-8 space-y-3">
            <Benefit text="21V de potencia" />
            <Benefit text="Incluye 2 baterías" />
            <Benefit text="Espada de 8 pulgadas" />
            <Benefit text="Corte rápido y preciso" />
            <Benefit text="Ideal para poda y madera" />
            <Benefit text="Diseño ergonómico" />
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
              onClick={() => setOpenCheckout(true)}
              className="bg-green-500 hover:bg-green-600 text-white w-full py-5 rounded-2xl text-2xl font-black transition shadow-xl"
            >
              Agregar al carrito
            </button>

            <button
              onClick={() => setOpenCheckout(true)}
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
{/* TESTIMONIOS */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-4xl font-black text-center mb-10">
    Clientes Felices
  </h2>

  <div className="grid md:grid-cols-3 gap-6">
    <Testimonial name="Carlos M." text="Me llegó rápido y funciona muy bien." />
    <Testimonial name="Luis R." text="Buena potencia y excelente atención." />
    <Testimonial name="Miguel A." text="Producto recomendado, buena calidad." />
  </div>
</section>

{/* FAQ */}
<section className="max-w-5xl mx-auto px-6 py-16">
  <h2 className="text-4xl font-black text-center mb-10">
    Preguntas Frecuentes
  </h2>

  <div className="space-y-5">
    <Faq question="¿Hacen envíos a provincia?" answer="Sí, enviamos a todo el Perú." />
    <Faq question="¿El pago es contra entrega?" answer="Sí, un asesor confirmará tu pedido por WhatsApp." />
    <Faq question="¿Tiene garantía?" answer="Sí, todos nuestros productos cuentan con garantía." />
  </div>
</section>

{/* TAMBIÉN TE PUEDEN INTERESAR */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-black mb-8">
    También te pueden interesar:
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <ProductCard name="Taladro 48V" price="S/189" image="/sierra-bomvink-8.jpg" />
    <ProductCard name="Amoladora BOMVINK" price="S/289" image="/sierra-bomvink-8.jpg" />
    <ProductCard name="Sierra Caladora" price="S/249" image="/sierra-bomvink-8.jpg" />
    <ProductCard name="Soporte Amoladora" price="S/199" image="/sierra-bomvink-8.jpg" />
  </div>
</section>

{/* EXPLORA EL CATÁLOGO */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-black mb-8">
    Explora el catálogo
  </h2>

  <div className="bg-black text-white rounded-3xl p-10 text-center">
    <h3 className="text-4xl font-black">
      Herramientas profesionales para todo el Perú
    </h3>

    <p className="text-zinc-300 mt-4">
      Encuentra productos con envío rápido, pago contra entrega y atención personalizada.
    </p>

    <a
      href="/"
      className="inline-block mt-8 bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black"
    >
      Ver catálogo
    </a>
  </div>
</section>

{/* FOOTER */}
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
                className="absolute top-4 right-4 text-zinc-500 hover:text-black"
              >
                <X />
              </button>

              {!pedidoFinalizado ? (
                <>
                  <div className="p-5 border-b">
                    <h2 className="font-black text-xl">
                      PAGO CONTRA ENTREGA
                    </h2>

                    <p className="text-sm text-zinc-500">
                      Completa tus datos para reservar tu producto.
                    </p>
                  </div>

                  <div className="p-5 flex gap-3 border-b">
                    <Image
                      src="/sierra-bomvink-8.jpg"
                      alt="Sierra BOMVINK"
                      width={80}
                      height={80}
                      className="rounded-xl object-contain bg-zinc-100"
                    />

                    <div className="flex-1">
                      <h3 className="font-black text-sm">
                        Sierra Inalámbrica BOMVINK 8"
                      </h3>

                      <p className="text-sm text-zinc-500">
                        Envío a todo el Perú
                      </p>

                      <p className="font-black mt-1">S/{total}</p>
                    </div>
                  </div>

                  <div className="p-5 bg-zinc-100 border-b space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <strong>S/{total}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Envío</span>
                      <strong>Gratis</strong>
                    </div>

                    <div className="flex justify-between text-lg">
                      <span>Total</span>
                      <strong>S/{total}</strong>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <Input
                      icon={<User size={18} />}
                      placeholder="Nombre completo *"
                      value={nombre}
                      onChange={setNombre}
                    />

                    <Input
                      icon={<Phone size={18} />}
                      placeholder="Celular *"
                      value={celular}
                      onChange={setCelular}
                    />

                    <Input
                      icon={<MapPin size={18} />}
                      placeholder="Ciudad o distrito *"
                      value={ciudad}
                      onChange={setCiudad}
                    />

                    <select
                      required
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl outline-none bg-white text-zinc-700"
                    >
                      <option value="">Selecciona tu región *</option>
                      {regionesPeru.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <Input
                      icon={<Home size={18} />}
                      placeholder="Dirección exacta *"
                      value={direccion}
                      onChange={setDireccion}
                    />

                    <Input
                      icon={<MapPin size={18} />}
                      placeholder="Referencia"
                      value={referencia}
                      onChange={setReferencia}
                    />

                    <button
                      onClick={finalizarPedido}
                      disabled={loading}
                      className="w-full bg-black text-yellow-400 py-4 rounded-xl font-black text-lg hover:bg-zinc-800 transition"
                    >
                      {loading ? "Enviando pedido..." : "Finalizar pedido"}
                    </button>
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/sierra-bomvink-8.jpg"
              alt="Sierra BOMVINK"
              width={60}
              height={60}
              className="rounded-xl bg-zinc-100"
            />

            <div>
              <h3 className="font-black text-sm md:text-lg leading-tight">
                Sierra BOMVINK 8"
              </h3>

              <div className="flex items-center gap-2">
                <p className="text-yellow-500 font-black text-xl">S/249</p>
                <span className="line-through text-zinc-400 text-sm">S/299</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpenCheckout(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-10 py-3 rounded-full font-black shadow-xl transition whitespace-nowrap"
          >
            Comprar Ahora
          </button>
        </div>
      </div>

      <WhatsAppButton />
    </main>
  );
}

function Input({ icon, placeholder, value, onChange }: any) {
  return (
    <div className="flex border rounded-xl overflow-hidden">
      <div className="bg-zinc-100 px-4 flex items-center text-zinc-500">
        {icon}
      </div>

      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 outline-none"
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
    <div className="bg-zinc-100 rounded-2xl p-4 text-center font-black">
      {text}
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