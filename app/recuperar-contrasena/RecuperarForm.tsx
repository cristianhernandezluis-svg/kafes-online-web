"use client";

import { useActionState } from "react";
import {
  LoaderCircle,
  Mail,
  Send,
} from "lucide-react";

import { solicitarRecuperacion } from "./actions";

const initialState = {
  error: "",
  success: "",
};

export default function RecuperarForm() {
  const [state, action, pending] = useActionState(
    solicitarRecuperacion,
    initialState,
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          Correo del administrador
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-200">
          <div className="flex items-center bg-slate-100 px-4 text-slate-600">
            <Mail size={18} />
          </div>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu-correo@gmail.com"
            className="h-12 min-w-0 flex-1 px-4 outline-none"
          />
        </div>
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <>
            <LoaderCircle
              size={19}
              className="animate-spin"
            />
            Procesando...
          </>
        ) : (
          <>
            <Send size={19} />
            Enviar enlace
          </>
        )}
      </button>
    </form>
  );
}