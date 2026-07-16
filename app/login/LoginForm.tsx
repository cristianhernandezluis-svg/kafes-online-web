"use client";

import { useActionState, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import { iniciarSesion } from "./actions";

const initialState = {
  error: "",
};

export default function LoginForm() {
  const [state, action, pending] = useActionState(
    iniciarSesion,
    initialState,
  );

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-bold"
        >
          Correo
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300">
          <div className="flex items-center bg-slate-100 px-4">
            <Mail size={18} />
          </div>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-12 min-w-0 flex-1 px-4 outline-none"
            placeholder="tu-correo@gmail.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold"
        >
          Contraseña
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300">
          <div className="flex items-center bg-slate-100 px-4">
            <LockKeyhole size={18} />
          </div>

          <input
            id="password"
            name="password"
            type={
              mostrarPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            required
            className="h-12 min-w-0 flex-1 px-4 outline-none"
            placeholder="Tu contraseña"
          />

          <button
            type="button"
            onClick={() =>
              setMostrarPassword(
                !mostrarPassword,
              )
            }
            className="flex items-center justify-center border-l border-slate-200 bg-white px-4 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label={
              mostrarPassword
                ? "Ocultar contraseña"
                : "Ver contraseña"
            }
          >
            {mostrarPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        <LogIn size={19} />

        {pending
          ? "Ingresando..."
          : "Iniciar sesión"}
      </button>
    </form>
  );
}