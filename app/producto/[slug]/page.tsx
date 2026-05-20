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

export default function ProductoPage() {
  const [openCheckout, setOpenCheckout] = useState(false);
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [ciudad, setCiudad] = useState("");
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
    if (!nombre || !celular || !ciudad || !direccion) {
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
            <a href="/" className="font-bold hover:text-yellow-500">
              Inicio
            </a>

            <a
              href="/#productos"
              className="hidden md:block font-bold hover:text-yellow-500"
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

          <div className="mt-6 flex items-center gap-4">
            <p className="text-5xl font-black text-yellow-500">S/249</p>
            <span className="line-through text-zinc-400 text-2xl">S/299</span>
          </div>

          <div className="mt-4 bg-red-100 text-red-600 px-4 py-3 rounded-2xl font-bold inline-block">
            🔥 Quedan 7 unidades disponibles
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

          <div className="mt-10">
            <h2 className="text-3xl font-black mb-6">Características</h2>

            <div className="space-y-4 text-lg">
              {[
                "21V de potencia",
                "Incluye 2 baterías",
                "Espada de 8 pulgadas",
                "Corte rápido y preciso",
                "Ideal para poda y madera",
                "Diseño ergonómico",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-center">
                  <CheckCircle className="text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setOpenCheckout(true)}
            className="mt-10 bg-yellow-400 hover:bg-yellow-300 text-black w-full py-5 rounded-2xl text-2xl font-black flex items-center justify-center gap-3 shadow-xl transition"
          >
            <ShoppingCart />
            Comprar ahora
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-zinc-100 rounded-3xl p-8">
          <h2 className="text-3xl font-black mb-4">Descripción del producto</h2>
          <p className="text-zinc-700 leading-8 text-lg">
            La Sierra Inalámbrica BOMVINK 8” está diseñada para trabajos de poda
            y cortes rápidos en madera. Ideal para uso doméstico y profesional.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black">Clientes satisfechos</h2>
          <p className="text-zinc-500 mt-3">
            Opiniones reales de nuestros clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Testimonial name="Carlos M." city="Lima" text="Muy buena potencia y llegó rápido." />
          <Testimonial name="Luis R." city="Arequipa" text="Excelente producto y buena atención." />
          <Testimonial name="Miguel A." city="Trujillo" text="La batería dura bastante y corta bien." />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black">Preguntas frecuentes</h2>
        </div>

        <div className="space-y-5">
          <Faq question="¿Hacen envíos a provincia?" answer="Sí, enviamos a todo el Perú." />
          <Faq question="¿El pago es contra entrega?" answer="Sí, un asesor confirmará tu pedido." />
          <Faq question="¿Tiene garantía?" answer="Sí, todos nuestros productos tienen garantía." />
        </div>
      </section>

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
                    <h2 className="font-black text-xl">PAGO CONTRA ENTREGA</h2>
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
                      <p className="text-sm text-zinc-500">Envío a todo el Perú</p>
                      <p className="font-black mt-1">S/249</p>
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
                    <h3 className="font-black text-center mb-3">
                      Ingresa tus datos de envío
                    </h3>

                    <Input icon={<User size={18} />} placeholder="Nombre completo *" value={nombre} onChange={setNombre} />
                    <Input icon={<Phone size={18} />} placeholder="Celular *" value={celular} onChange={setCelular} />
                    <Input icon={<MapPin size={18} />} placeholder="Ciudad o distrito *" value={ciudad} onChange={setCiudad} />
                    <Input icon={<Home size={18} />} placeholder="Dirección exacta *" value={direccion} onChange={setDireccion} />
                    <Input icon={<MapPin size={18} />} placeholder="Referencia" value={referencia} onChange={setReferencia} />

                    <div>
                      <label className="font-bold text-sm">Cantidad</label>
                      <div className="flex mt-2">
                        <button
                          type="button"
                          onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                          className="bg-yellow-400 px-5 py-3 font-black"
                        >
                          -
                        </button>

                        <div className="flex-1 border-y flex items-center justify-center font-black">
                          {cantidad}
                        </div>

                        <button
                          type="button"
                          onClick={() => setCantidad(cantidad + 1)}
                          className="bg-yellow-400 px-5 py-3 font-black"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={finalizarPedido}
                      disabled={loading}
                      className="w-full bg-black text-yellow-400 py-4 rounded-xl font-black text-lg hover:bg-zinc-800 transition disabled:opacity-60"
                    >
                      {loading ? "Enviando pedido..." : "Finalizar pedido"}
                    </button>

                    <p className="text-xs text-center text-zinc-500">
                      Al finalizar, un asesor confirmará tu pedido por WhatsApp.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <div className="flex justify-center mb-5">
                    <CheckCircle size={90} className="text-green-500" />
                  </div>

                  <h2 className="text-3xl font-black mb-4">¡Pedido recibido!</h2>

                  <p className="text-zinc-600 text-lg leading-8">
                    Gracias por confiar en KAFES ONLINE.
                  </p>

                  <p className="text-zinc-600 text-lg leading-8 mt-3">
                    Un asesor se pondrá en contacto contigo vía WhatsApp para
                    confirmar tu pedido.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
    <div className="bg-zinc-100 rounded-2xl p-4 text-center font-black">{text}</div>
  );
}

function Testimonial({ name, city, text }: any) {
  return (
    <div className="bg-white border rounded-3xl p-7 shadow-sm">
      <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
      <p className="text-zinc-700 leading-8">"{text}"</p>
      <div className="mt-6">
        <h3 className="font-black text-lg">{name}</h3>
        <p className="text-zinc-500">{city}</p>
      </div>
    </div>
  );
}

function Faq({ question, answer }: any) {
  return (
    <div className="border rounded-3xl p-6">
      <h3 className="font-black text-xl">{question}</h3>
      <p className="text-zinc-600 mt-3 leading-7">{answer}</p>
    </div>
  );
}