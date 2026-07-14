import Link from "next/link";
import { Package, Plus } from "lucide-react";

export default function AdminPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-slate-500">
          Kafes Online 2.0
        </p>

        <h1 className="text-3xl font-black tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Administra tu catálogo, productos y ventas desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <Package size={22} />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Productos
          </p>

          <p className="mt-1 text-3xl font-black">0</p>

          <Link
            href="/admin/productos"
            className="mt-5 inline-flex text-sm font-bold text-slate-950"
          >
            Administrar productos →
          </Link>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="flex min-h-52 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-slate-950"
        >
          <Plus size={32} />

          <p className="mt-4 font-black">Nuevo producto</p>

          <p className="mt-1 text-sm text-slate-500">
            Agrega un producto sin editar código.
          </p>
        </Link>
      </div>
    </section>
  );
}