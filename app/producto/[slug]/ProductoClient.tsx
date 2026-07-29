"use client";

import LandingProducto from "@/components/LandingProducto";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyBuyButton from "@/components/producto/StickyBuyButton";
import RelatedProducts from "@/components/producto/RelatedProducts";
import ProductSocialProof from "@/components/producto/ProductSocialProof";
import CheckoutModal from "@/components/producto/CheckoutModal";
import ProductGallery from "@/components/producto/ProductGallery";
import ProductPurchasePanel from "@/components/producto/ProductPurchasePanel";
import ProductTechnicalSpecs from "@/components/producto/ProductTechnicalSpecs";
import ProductDocuments from "@/components/producto/ProductDocuments";
import type { ProductoPublico } from "@/components/producto/product-types";
import BuscadorProductos from "@/components/BuscadorProductos";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
} from "lucide-react";
declare global {
  interface Window {
    fbq?: any;
    ttq?: any;
  }
}

type ProductoClientProps = {
  producto: ProductoPublico;
};

export default function ProductoClient({
  producto,
}: ProductoClientProps) {
  const slug = producto.slug;
  const comprarAhoraRef = useRef<HTMLButtonElement | null>(null);
  const [mostrarCompraFija, setMostrarCompraFija] = useState(false);

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


const viewContentTrackedSlug = useRef<string | null>(null);

const precio = producto?.precio || 0;
const total = precio * cantidad;

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

  
  const finalizarPedido = async () => {
  if (!nombre || !celular || !ciudad || !region || !direccion) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  const celularLimpio = celular.replace(/\D/g, "");

  if (celularLimpio.length < 9) {
    alert("Ingresa un número de celular válido");
    return;
  }

  setLoading(true);

  try {
    const respuesta = await fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productoId: producto.id,
        cantidad,
        nombre: nombre.trim(),
        celular: celularLimpio,
        ciudad: ciudad.trim(),
        region: region.trim(),
        direccion: direccion.trim(),
        referencia: referencia.trim(),
      }),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.ok) {
      throw new Error(
        resultado.error || "No se pudo registrar el pedido",
      );
    }

    /*
     * Enviamos también la información a n8n.
     * Si n8n falla, el pedido ya quedó guardado
     * correctamente en PostgreSQL.
     */
    try {
      await fetch(
        "https://n8n-n8n.xhb7ax.easypanel.host/webhook/96372183-cc2d-468e-b1c3-5ee5564eb2b8",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pedidoId: resultado.pedido.id,
            codigo: resultado.pedido.codigo,
            productoId: producto.id,
            producto: producto.nombre,
            precio,
            cantidad,
            total: resultado.pedido.total,
            nombre: nombre.trim(),
            celular: celularLimpio,
            ciudad: ciudad.trim(),
            region: region.trim(),
            direccion: direccion.trim(),
            referencia: referencia.trim(),
            estado: resultado.pedido.estado,
            fecha: new Date().toLocaleString("es-PE"),
          }),
        },
      );
    } catch (errorN8n) {
      console.error(
        "El pedido se guardó, pero n8n no respondió:",
        errorN8n,
      );
    }

    setPedidoFinalizado(true);

    if (typeof window !== "undefined") {
      window.fbq?.("track", "Purchase", {
        value: resultado.pedido.total,
        currency: "PEN",
        content_ids: [String(producto.id)],
        content_name: producto.nombre,
        content_type: "product",
        num_items: cantidad,
      });

      window.ttq?.track("CompletePayment", {
        value: resultado.pedido.total,
        currency: "PEN",
        content_id: String(producto.id),
        content_name: producto.nombre,
        quantity: cantidad,
      });
    }
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);

    const mensaje =
      error instanceof Error
        ? error.message
        : "No pudimos registrar el pedido";

    alert(`${mensaje}. Inténtalo nuevamente.`);
  } finally {
    setLoading(false);
  }
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

    <BuscadorProductos variante="desktop" />

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

<div className="border-b bg-white px-3 pb-3 md:hidden">
  <BuscadorProductos variante="mobile" />
</div>
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
            <ProductGallery
  nombre={producto.nombre}
  imagenPrincipal={producto.imagen}
  imagenes={producto.imagenes}
  caracteristicas={producto.mini}
/>

            <ProductPurchasePanel
  producto={producto}
  cantidad={cantidad}
  onCantidadChange={setCantidad}
  onComprar={abrirCheckout}
  comprarAhoraRef={comprarAhoraRef}
/>
          </div>

          {producto.contenidoHtml && (
  <LandingProducto producto={producto} />
)}

<ProductTechnicalSpecs
  especificaciones={producto.especificaciones}
/>

<ProductDocuments documentos={producto.documentos} />

<ProductSocialProof />
        </>
      )}

        <RelatedProducts />
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

<CheckoutModal
  open={openCheckout}
  producto={producto}
  cantidad={cantidad}
  total={total}
  loading={loading}
  pedidoFinalizado={pedidoFinalizado}
  nombre={nombre}
  celular={celular}
  ciudad={ciudad}
  region={region}
  direccion={direccion}
  referencia={referencia}
  onNombreChange={setNombre}
  onCelularChange={setCelular}
  onCiudadChange={setCiudad}
  onRegionChange={setRegion}
  onDireccionChange={setDireccion}
  onReferenciaChange={setReferencia}
  onClose={() => setOpenCheckout(false)}
  onSubmit={finalizarPedido}
/>

{!producto.modoGempages && (
  <StickyBuyButton
    visible={mostrarCompraFija}
    onComprar={abrirCheckout}
  />
)}
      <WhatsAppButton />
    </main>
  );
}