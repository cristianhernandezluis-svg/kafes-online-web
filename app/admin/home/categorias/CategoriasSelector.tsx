"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Search,
  X,
} from "lucide-react";

type CategoriaSelector = {
  id: number;
  nombre: string;
  slug: string;
  imagenUrl: string | null;
};

type CategoriasSelectorProps = {
  categorias: CategoriaSelector[];
  seleccionInicial: number[];
};

export default function CategoriasSelector({
  categorias,
  seleccionInicial,
}: CategoriasSelectorProps) {
  const idsDisponibles = useMemo(
    () => new Set(categorias.map((categoria) => categoria.id)),
    [categorias]
  );

  const [seleccionadas, setSeleccionadas] = useState<number[]>(
    seleccionInicial.filter((id) => idsDisponibles.has(id))
  );

  const [busqueda, setBusqueda] = useState("");

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return categorias;
    }

    return categorias.filter((categoria) => {
      const texto = [
        categoria.nombre,
        categoria.slug,
      ]
        .join(" ")
        .toLowerCase();

      return texto.includes(termino);
    });
  }, [busqueda, categorias]);

  const categoriasSeleccionadas = seleccionadas
    .map((id) =>
      categorias.find((categoria) => categoria.id === id)
    )
    .filter(
      (categoria): categoria is CategoriaSelector =>
        Boolean(categoria)
    );

  function seleccionarCategoria(categoriaId: number) {
    setSeleccionadas((actuales) => {
      if (actuales.includes(categoriaId)) {
        return actuales.filter((id) => id !== categoriaId);
      }

      return [...actuales, categoriaId];
    });
  }

  function moverCategoria(
    indice: number,
    direccion: -1 | 1
  ) {
    setSeleccionadas((actuales) => {
      const nuevoIndice = indice + direccion;

      if (
        nuevoIndice < 0 ||
        nuevoIndice >= actuales.length
      ) {
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
        name="categoriaIds"
        value={seleccionadas.join(",")}
      />

      <div>
        <label
          htmlFor="busqueda-categorias"
          className="mb-2 block text-sm font-bold text-slate-800"
        >
          Buscar categorías
        </label>

        <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-slate-950">
          <Search
            size={18}
            className="shrink-0 text-slate-400"
          />

          <input
            id="busqueda-categorias"
            type="search"
            value={busqueda}
            onChange={(event) =>
              setBusqueda(event.target.value)
            }
            placeholder="Buscar por nombre o slug"
            className="h-full w-full bg-transparent text-sm text-slate-900 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-950">
                Categorías disponibles
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Selecciona las categorías visibles en la portada.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {categoriasFiltradas.length}
            </span>
          </div>

          <div className="max-h-[540px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {categoriasFiltradas.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                No se encontraron categorías.
              </div>
            ) : (
              categoriasFiltradas.map((categoria) => {
                const estaSeleccionada =
                  seleccionadas.includes(categoria.id);

                return (
                  <button
                    key={categoria.id}
                    type="button"
                    onClick={() =>
                      seleccionarCategoria(categoria.id)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      estaSeleccionada
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                      {categoria.imagenUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={categoria.imagenUrl}
                          alt={categoria.nombre}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-center text-[10px] font-bold text-slate-400">
                          Sin foto
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black">
                        {categoria.nombre}
                      </p>

                      <p
                        className={`mt-1 truncate text-xs ${
                          estaSeleccionada
                            ? "text-slate-300"
                            : "text-slate-500"
                        }`}
                      >
                        /categoria/{categoria.slug}
                      </p>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        estaSeleccionada
                          ? "bg-white text-slate-950"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {estaSeleccionada ? (
                        <Check size={17} />
                      ) : null}
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
              {seleccionadas.length} seleccionadas
            </span>
          </div>

          <div className="min-h-[220px] space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {categoriasSeleccionadas.length === 0 ? (
              <div className="flex min-h-[190px] items-center justify-center rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                Todavía no seleccionaste ninguna categoría.
              </div>
            ) : (
              categoriasSeleccionadas.map(
                (categoria, indice) => (
                  <div
                    key={categoria.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                      {indice + 1}
                    </span>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      {categoria.imagenUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={categoria.imagenUrl}
                          alt={categoria.nombre}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[9px] font-bold text-slate-400">
                          Sin foto
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black text-slate-950">
                        {categoria.nombre}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          moverCategoria(indice, -1)
                        }
                        disabled={indice === 0}
                        title="Subir categoría"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moverCategoria(indice, 1)
                        }
                        disabled={
                          indice === seleccionadas.length - 1
                        }
                        title="Bajar categoría"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          seleccionarCategoria(categoria.id)
                        }
                        title="Quitar categoría"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}