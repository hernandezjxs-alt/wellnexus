"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "./auth-provider";
import { Logo } from "./logo";

type Modo = "entrar" | "registro" | "recuperar";
const campo = "min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-fg placeholder:text-muted";

export function LoginScreen() {
  const { entrar, registrar, recuperar } = useAuth();
  const [modo, setModo] = useState<Modo>("entrar");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setAviso(null);
    if (modo === "registro" && clave.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (modo === "registro" && !acepto) return setError("Debes aceptar los Términos y la Política de Privacidad.");
    setOcupado(true);
    const r = modo === "entrar" ? await entrar(correo, clave) : modo === "registro" ? await registrar(nombre.trim(), correo, clave) : await recuperar(correo);
    setOcupado(false);
    if (r) return setError(r);
    if (modo === "registro") setAviso("Revisa tu correo y confirma la dirección para ingresar. Si no llega nada, ese correo ya se usa en otra app: crea la cuenta con uno distinto.");
    if (modo === "recuperar") setAviso("Te enviamos un correo para crear una contraseña nueva.");
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8" style={{ paddingLeft: "max(16px, env(safe-area-inset-left))", paddingRight: "max(16px, env(safe-area-inset-right))" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <Logo size={48} />
          <div>
            <p className="font-display text-2xl font-bold leading-none tracking-tight">Wellnexus</p>
            <p className="text-muted text-xs mt-1">Ingeniería de pozos y producción</p>
          </div>
        </div>
        <div className="tri-bar mb-4 rounded" />
        <form onSubmit={enviar} className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-3" noValidate={false}>
          <h1 className="text-lg">{modo === "entrar" ? "Ingresar" : modo === "registro" ? "Crear cuenta" : "Recuperar contraseña"}</h1>
          {modo === "registro" && (
            <label className="text-xs text-muted font-medium flex flex-col gap-1">Nombre completo
              <input id="nombre" type="text" autoComplete="name" required value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
            </label>
          )}
          <label className="text-xs text-muted font-medium flex flex-col gap-1">Correo
            <input id="correo" type="email" autoComplete="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} className={campo} />
          </label>
          {modo !== "recuperar" && (
            <label className="text-xs text-muted font-medium flex flex-col gap-1">Contraseña
              <span className="relative">
                <input id="clave" type={ver ? "text" : "password"} autoComplete={modo === "entrar" ? "current-password" : "new-password"} required minLength={modo === "registro" ? 8 : undefined} value={clave} onChange={(e) => setClave(e.target.value)} className={`${campo} pr-11`} />
                <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"} className="absolute right-0 top-0 h-11 w-11 grid place-items-center text-muted">{ver ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </span>
            </label>
          )}
          {modo === "registro" && (
            <label className="flex items-start gap-2 text-xs text-muted">
              <input id="acepto" type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} className="mt-0.5 size-4" />
              <span>Acepto los <Link href="/terminos/" className="text-accent-text underline">Términos</Link> y la <Link href="/privacidad/" className="text-accent-text underline">Política de Privacidad</Link>.</span>
            </label>
          )}
          {error && <p role="alert" className="text-sm text-crit">{error}</p>}
          {aviso && <p role="status" className="text-sm text-good">{aviso}</p>}
          <button disabled={ocupado} className="min-h-11 rounded-lg bg-accent text-white font-semibold disabled:opacity-60">{ocupado ? "Un momento…" : modo === "entrar" ? "Ingresar" : modo === "registro" ? "Crear cuenta" : "Enviar correo"}</button>
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            {modo !== "entrar" && <button type="button" className="text-accent-text underline" onClick={() => { setModo("entrar"); setError(null); setAviso(null); }}>Volver a ingresar</button>}
            {modo === "entrar" && <button type="button" className="text-accent-text underline" onClick={() => { setModo("registro"); setError(null); }}>Crear cuenta</button>}
            {modo === "entrar" && <button type="button" className="text-accent-text underline" onClick={() => { setModo("recuperar"); setError(null); }}>Olvidé mi contraseña</button>}
          </div>
        </form>
        <p className="text-xs text-muted mt-4 text-center">Elaborado por JH · Todos los derechos reservados · octubre 2026</p>
      </div>
    </main>
  );
}
