"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./auth-provider";
import { Logo } from "./logo";

/** Pantalla para quien ya tiene correo y contraseña pero aún no tiene perfil en Wellnexus. */
export function ActivarCuenta() {
  const { session, activar, salir } = useAuth();
  const meta = session?.user.user_metadata as { full_name?: string } | undefined;
  const [nombre, setNombre] = useState(meta?.full_name ?? "");
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!acepto) return setError("Debes aceptar los Términos y la Política de Privacidad.");
    setOcupado(true);
    const r = await activar(nombre.trim());
    setOcupado(false);
    if (r) setError(r);
  }
  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6"><Logo size={48} /><p className="font-display text-2xl font-bold tracking-tight">Wellnexus</p></div>
        <form onSubmit={enviar} className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-3">
          <h1 className="text-lg">Activa tu cuenta en Wellnexus</h1>
          <p className="text-muted text-sm">Ingresaste como {session?.user.email}. Wellnexus guarda sus propios usuarios, roles y datos, aparte de cualquier otra app. Confirma tu nombre para activarla.</p>
          <label className="text-xs text-muted font-medium flex flex-col gap-1">Nombre completo
            <input id="nombre-act" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-fg" />
          </label>
          <label className="flex items-start gap-2 text-xs text-muted">
            <input id="acepto-act" type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-0.5 size-4" />
            <span>Acepto los <Link href="/terminos/" className="text-accent-text underline">Términos</Link> y la <Link href="/privacidad/" className="text-accent-text underline">Política de Privacidad</Link>.</span>
          </label>
          {error && <p role="alert" className="text-sm text-crit">{error}</p>}
          <button disabled={ocupado} className="min-h-11 rounded-lg bg-accent text-white font-semibold disabled:opacity-60">{ocupado ? "Activando…" : "Activar mi cuenta"}</button>
          <button type="button" onClick={salir} className="text-sm text-accent-text underline text-left">Salir</button>
        </form>
      </div>
    </main>
  );
}
