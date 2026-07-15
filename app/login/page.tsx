import { redirect } from "next/navigation";
import { obtenerSesionAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await obtenerSesionAdmin();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
            K
          </div>

          <h1 className="mt-5 text-3xl font-black">
            KAFES ONLINE
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Ingresa al administrador de la tienda
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}