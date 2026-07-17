import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
} from "lucide-react";

import VerificarCodigoForm from "./VerificarCodigoForm";

type VerificarCodigoPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerificarCodigoPage({
  searchParams,
}: VerificarCodigoPageProps) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase() ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <KeyRound size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Verificar código
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Ingresa el código de 6 dígitos enviado a tu correo
            para crear una nueva contraseña.
          </p>

          {email && (
            <p className="mt-2 break-all text-sm font-semibold text-slate-700">
              {email}
            </p>
          )}
        </div>

        <VerificarCodigoForm email={email} />

        <div className="mt-6 text-center">
          <Link
            href="/recuperar-contrasena"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Solicitar otro código
          </Link>
        </div>
      </section>
    </main>
  );
}