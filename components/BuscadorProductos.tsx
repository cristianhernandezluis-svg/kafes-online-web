"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type ProductoResultado = {
  id: number;
  nombre: string;
  slug: string;
  precio: string | null;
  precioAntes: string | null;
  imagen: string | null;
  categoria: string | null;
  marca: string | null;
};

type BuscadorProductosProps = {
  variante?: "desktop" | "mobile";
};

export default function BuscadorProductos({
  variante = "desktop",
}: BuscadorProductosProps) {
  const router = useRouter();

  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState<
    ProductoResultado[]
  >([]);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function cerrarAlHacerClickFuera(event: MouseEvent) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(
          event.target as Node,
        )
      ) {
        setAbierto(false);
      }
    }

    document.addEventListener(
      "mousedown",
      cerrarAlHacerClickFuera,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        cerrarAlHacerClickFuera,
      );
    };
  }, []);

  useEffect(() => {
    const texto = consulta.trim();

    if (texto.length < 2) {
      setResultados([]);
      setCargando(false);
      return;
    }

    const controlador = new AbortController();

    const temporizador = window.setTimeout(async () => {
      try {
        setCargando(true);

        const respuesta = await fetch(
          `/api/buscar-productos?q=${encodeURIComponent(
            texto,
          )}`,
          {
            signal: controlador.signal,
          },
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron cargar los productos.",
          );
        }

        const datos = await respuesta.json();

        setResultados(datos.productos ?? []);
        setAbierto(true);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error(error);
          setResultados([]);
        }
      } finally {
        setCargando(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(temporizador);
      controlador.abort();
    };
  }, [consulta]);

  function buscar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const texto = consulta.trim();

    if (!texto) return;

    setAbierto(false);

    router.push(
      `/buscar?q=${encodeURIComponent(texto)}`,
    );
  }

  function limpiar() {
    setConsulta("");
    setResultados([]);
    setAbierto(false);
  }

  const esMovil = variante === "mobile";

  return (
    <div
      ref={contenedorRef}
      className={
        esMovil
          ? "relative w-full md:hidden"
          : "relative hidden max-w-xl flex-1 md:block"
      }
    >
      <form
        onSubmit={buscar}
        className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm"
      >
        <Search
          size={esMovil ? 18 : 20}
          className="shrink-0 text-zinc-500"
        />

        <input
          type="search"
          value={consulta}
          onChange={(event) => {
            setConsulta(event.target.value);
            setAbierto(true);
          }}
          onFocus={() => {
            if (consulta.trim().length >= 2) {
              setAbierto(true);
            }
          }}
          placeholder={
            esMovil
              ? "Buscar productos..."
              : "¿Qué herramienta estás buscando?"
          }
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />

        {consulta && (
          <button
            type="button"
            onClick={limpiar}
            aria-label="Limpiar búsqueda"
            className="rounded-full p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          aria-label="Buscar producto"
          className="rounded-full bg-black p-2.5 text-yellow-400 transition hover:scale-105"
        >
          <Search size={18} />
        </button>
      </form>

      {abierto && consulta.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          <div className="border-b border-zinc-200 px-4 py-3 text-center">
            <p className="text-sm font-black text-blue-700">
              Resultados de productos
            </p>
          </div>

          {cargando ? (
            <div className="px-5 py-8 text-center text-sm text-zinc-500">
              Buscando productos...
            </div>
          ) : resultados.length > 0 ? (
            <>
              <div className="max-h-[420px] overflow-y-auto">
                {resultados.map((producto) => (
                  <Link
                    key={producto.id}
                    href={`/producto/${producto.slug}`}
                    onClick={() => setAbierto(false)}
                    className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 transition hover:bg-zinc-50"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                      {producto.imagen ? (
                        <Image
                          src={producto.imagen}
                          alt={producto.nombre}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Search
                            size={20}
                            className="text-zinc-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black text-zinc-900">
                        {producto.nombre}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {producto.categoria ??
                          producto.marca ??
                          "Producto KAFES ONLINE"}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-black text-blue-700">
                          {producto.precio ??
                            "Consultar precio"}
                        </span>

                        {producto.precioAntes && (
                          <span className="text-xs text-zinc-400 line-through">
                            {producto.precioAntes}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setAbierto(false);

                  router.push(
                    `/buscar?q=${encodeURIComponent(
                      consulta.trim(),
                    )}`,
                  );
                }}
                className="w-full px-4 py-4 text-center text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                VER TODOS LOS PRODUCTOS
              </button>
            </>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="font-bold text-zinc-800">
                No encontramos resultados
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Prueba con una palabra más corta.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}