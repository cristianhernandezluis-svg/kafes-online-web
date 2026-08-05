"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Search,
  X,
} from "lucide-react";

type ProductoSelector = {
  id: number;
  nombre: string;
  slug: string;
  imagenUrl: string | null;
  categoria: string | null;
  marca: string | null;
};

type ProductosDestacadosSelectorProps = {
  productos: ProductoSelector[];
  seleccionInicial: number[];
};

export default function ProductosDestacadosSelector({
  productos,
  seleccionInicial,
}: ProductosDestacadosSelectorProps) {
  const idsDisponibles = useMemo(
    () => new Set(productos.map((producto) => producto.id)),
    [productos]
  );

  const [seleccionados, setSeleccionados] = useState<number[]>(
    seleccionInicial.filter((id) => idsDisponibles.has(id))
  );

  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return productos;
    }

    return productos.filter((producto) => {
      const texto = [
        producto.nombre,
        producto.slug,
        producto.categoria,
        producto.marca,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return texto.includes(termino);
    });
  }, [busqueda, productos]);

  const productosSeleccionados = seleccionados
    .map((id) => productos.find((producto) => producto.id === id))
    .filter((producto): producto is ProductoSelector => Boolean(producto));

  function seleccionarProducto(productoId: number) {
    setSeleccionados((actuales) => {
      if (actuales.includes(productoId)) {
        return actuales.filter((id) => id !== productoId);
      }

      return [...actuales, productoId];
    });
  }

  function moverProducto(indice: number, direccion: -1 | 1) {
    setSeleccionados((actuales) => {
      const nuevoIndice = indice + direccion;

      if (nuevoIndice < 0 || nuevoIndice >= actuales.length) {
        return actuales;
      }

      const copia = [...actuales];
      const temporal = copia[indice];

      copia[indice] = copia[nuevoIndice];
      copia[nuevoIndice] = temporal;

      return copia;
    });
  }

  return (
    <div className="space-y-6">
      <input
        type="hidden"
        name="productoIds"
        value={seleccionados.join(",")}
      />

      <div>
        <label
          htmlFor="busqueda-productos"
          className="mb-2 block text-sm font-bold text-slate-800"
        >
          Buscar productos
        </label>

        <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-slate-950">
          <Search size={18} className="shrink-0 text-slate-400" />

          <input
            id="busqueda-productos"
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre, categoría o marca"
            className="h-full w-full bg-transparent text-sm text-slate-900 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-950">
                Productos disponibles
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Selecciona los productos que aparecerán en la portada.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {productosFiltrados.length}
            </span>
          </div>

          <div className="max-h-[540px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {productosFiltrados.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                No se encontraron productos.
              </div>
            ) : (
              productosFiltrados.map((producto) => {
                const estaSeleccionado = seleccionados.includes(producto.id);

                return (
                  <button
                    key={producto.id}
                    type="button"
                    onClick={() => seleccionarProducto(producto.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      estaSeleccionado
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                      {producto.imagenUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={producto.imagenUrl}
                          alt={producto.nombre}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Sin foto
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black">
                        {producto.nombre}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          estaSeleccionado
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        {[producto.categoria, producto.marca]
                          .filter(Boolean)
                          .join(" · ") || "Sin categoría"}
                      </p>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        estaSeleccionado
                          ? "bg-white text-slate-950"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {estaSeleccionado ? <Check size={17} /> : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-950">
                Orden en la portada
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Usa las flechas para cambiar el orden.
              </p>
            </div>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
              {seleccionados.length} seleccionados
            </span>
          </div>

          <div className="min-h-[220px] space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {productosSeleccionados.length === 0 ? (
              <div className="flex min-h-[190px] items-center justify-center rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                Todavía no seleccionaste ningún producto.
              </div>
            ) : (
              productosSeleccionados.map((producto, indice) => (
                <div
                  key={producto.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                    {indice + 1}
                  </span>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {producto.imagenUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        Sin foto
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-black text-slate-950">
                      {producto.nombre}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moverProducto(indice, -1)}
                      disabled={indice === 0}
                      title="Subir producto"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => moverProducto(indice, 1)}
                      disabled={indice === seleccionados.length - 1}
                      title="Bajar producto"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => seleccionarProducto(producto.id)}
                      title="Quitar producto"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}