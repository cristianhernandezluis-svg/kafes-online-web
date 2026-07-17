"use client";

import { useActionState, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { verificarCodigoYCambiarPassword } from "./actions";

type VerificarCodigoFormProps = {
  email: string;
};

const initialState = {
  error: "",
  success: "",
};

export default function VerificarCodigoForm({
  email,
}: VerificarCodigoFormProps) {
  const [state, action, pending] = useActionState(
    verificarCodigoYCambiarPassword,
    initialState,
  );

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState(false);

  return (
    <form action={action} className="space-y-5">
      <input
        type="hidden"
        name="email"
        value={email}
      />

      <div>
        <label
          htmlFor="codigo"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          Código de verificación
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-200">
          <div className="flex items-center bg-slate-100 px-4 text-slate-600">
            <KeyRound size={18} />
          </div>

          <input
            id="codigo"
            name="codigo"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="000000"
            className="h-12 min-w-0 flex-1 px-4 text-center text-xl font-black tracking-[0.35em] outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          Nueva contraseña
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-200">
          <div className="flex items-center bg-slate-100 px-4 text-slate-600">
            <LockKeyhole size={18} />
          </div>

          <input
            id="password"
            name="password"
            type={mostrarPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="h-12 min-w-0 flex-1 px-4 outline-none"
          />

          <button
            type="button"
            onClick={() =>
              setMostrarPassword(!mostrarPassword)
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

      <div>
        <label
          htmlFor="confirmarPassword"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          Confirmar contraseña
        </label>

        <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-slate-200">
          <div className="flex items-center bg-slate-100 px-4 text-slate-600">
            <LockKeyhole size={18} />
          </div>

          <input
            id="confirmarPassword"
            name="confirmarPassword"
            type={
              mostrarConfirmacion
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Repite la contraseña"
            className="h-12 min-w-0 flex-1 px-4 outline-none"
          />

          <button
            type="button"
            onClick={() =>
              setMostrarConfirmacion(
                !mostrarConfirmacion,
              )
            }
            className="flex items-center justify-center border-l border-slate-200 bg-white px-4 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label={
              mostrarConfirmacion
                ? "Ocultar contraseña"
                : "Ver contraseña"
            }
          >
            {mostrarConfirmacion ? (
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

      {state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !email}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <>
            <LoaderCircle
              size={19}
              className="animate-spin"
            />
            Cambiando contraseña...
          </>
        ) : (
          <>
            <KeyRound size={19} />
            Cambiar contraseña
          </>
        )}
      </button>

      {!email && (
        <p className="text-center text-sm font-semibold text-red-600">
          Falta el correo de recuperación. Solicita un nuevo código.
        </p>
      )}
    </form>
  );
}