"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Download, Inbox, LogOut, MessageSquare, Share2, SunMoon, Tags, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePwa } from "./pwa";
import { MODULOS } from "@/lib/modulos";
import { useAuth } from "./auth-provider";
import { Logo } from "./logo";

const ib = "size-10 sm:size-11 grid place-items-center rounded-lg border border-line hover:bg-surface2";
const guardar = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };
const leer = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };

export function AppShell({ children }: { children: React.ReactNode }) {
  const { perfil, esAdmin, salir, session } = useAuth();
  const ruta = usePathname();
  const router = useRouter();
  const [marca, setMarca] = useState<"v4" | "v5">("v4");
  const { instalable, instalada } = usePwa();
  const [sinLeer, setSinLeer] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);
  const toast = (t: string) => { setAviso(t); setTimeout(() => setAviso(null), 4000); };

  useEffect(() => {
    if (!esAdmin) return;
    const leer = () => supabase.from("aviso").select("id", { count: "exact", head: true }).eq("leido", false).then(({ count }) => setSinLeer(count ?? 0));
    leer();
    const t = setInterval(leer, 120000);
    window.addEventListener("wx-avisos", leer);
    return () => { clearInterval(t); window.removeEventListener("wx-avisos", leer); };
  }, [esAdmin, ruta]);

  async function instalar() {
    if (instalable) { await instalable.prompt(); return; }
    toast("En el menú del navegador elige Instalar app, o Compartir y Añadir a pantalla de inicio.");
  }
  async function compartir() {
    const url = window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/";
    try { if (navigator.share) { await navigator.share({ title: "Wellnexus", url }); return; } } catch { return; }
    try { await navigator.clipboard.writeText(url); toast("Link copiado."); } catch { toast(url); }
  }

  useEffect(() => {
    const t = leer("wx-theme"); if (t) document.documentElement.setAttribute("data-theme", t);
    const m = leer("wx-brand") === "v5" ? "v5" : "v4";
    setMarca(m); document.documentElement.setAttribute("data-brand", m);
  }, []);

  const cambiarTema = () => {
    const d = document.documentElement;
    const actual = d.getAttribute("data-theme") ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const n = actual === "dark" ? "light" : "dark"; d.setAttribute("data-theme", n); guardar("wx-theme", n);
  };
  const cambiarMarca = (m: "v4" | "v5") => { setMarca(m); document.documentElement.setAttribute("data-brand", m); guardar("wx-brand", m); };

  const actual = MODULOS.find((m) => ruta.startsWith(`/${m.id}/`));
  const titulo = ruta.startsWith("/admin") ? "Usuarios" : ruta.startsWith("/etiquetas") ? "Etiquetas" : ruta.startsWith("/avisos") ? "Avisos y mensajes" : ruta.startsWith("/contacto") ? "Contacto" : actual?.nombre ?? "Inicio";
  const sub = ruta.startsWith("/admin") || ruta.startsWith("/etiquetas") || ruta.startsWith("/avisos") ? "Administración" : ruta.startsWith("/contacto") ? "Escríbenos" : actual?.corto ?? "Una sola plataforma para el pozo, la producción y el equipo";
  const nombre = perfil?.nombre?.split(" ")[0] ?? session?.user.email?.split("@")[0] ?? "";
  const pad = { paddingLeft: "max(16px, env(safe-area-inset-left, 0px))", paddingRight: "max(16px, env(safe-area-inset-right, 0px))" };

  const inicio = ruta === "/";
  return (
    <div className="min-h-screen">
      <header className="sticky z-40 bg-surface border-b border-line" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className="tri-bar" />
        <div className="flex flex-wrap items-center gap-2 py-2.5 max-w-[1280px] mx-auto" style={pad}>
          {!inicio && <button onClick={() => router.back()} aria-label="Volver" title="Volver" className={ib}><ArrowLeft size={20} /></button>}
          <Link href="/" aria-label="Wellnexus, inicio" className="flex items-center gap-2.5 min-w-0">
            <Logo size={inicio ? 44 : 36} />
            <span className="min-w-0">
              <b className="font-display font-bold text-lg leading-none block">{inicio ? "Wellnexus" : titulo}</b>
              <span className="text-xs text-muted block truncate">{inicio ? "Ingeniería de pozos y producción" : sub}</span>
            </span>
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-1 sm:gap-1.5 justify-end">
            <span className="hidden md:block text-sm mr-1.5">Hola, {nombre}{esAdmin && <span className="text-muted"> · Admin</span>}</span>
            <div className="hidden sm:inline-flex border border-line rounded-lg overflow-hidden" role="group" aria-label="Versión de marca">
              {(["v4", "v5"] as const).map((m) => <button key={m} aria-pressed={marca === m} onClick={() => cambiarMarca(m)} className={`min-h-10 px-3 font-medium ${marca === m ? "bg-accent text-white" : "bg-surface text-muted"}`}>{m}</button>)}
            </div>
            {!instalada && <button onClick={instalar} aria-label="Instalar app" title="Instalar app" className={ib}><Download size={20} /></button>}
            <button onClick={compartir} aria-label="Compartir app" title="Compartir app" className={ib}><Share2 size={20} /></button>
            <Link href="/contacto/" aria-label="Contacto" title="Contacto" className={ib}><MessageSquare size={20} /></Link>
            {esAdmin && <Link href="/etiquetas/" aria-label="Etiquetas oficiales" title="Etiquetas oficiales" className={ib}><Tags size={20} /></Link>}
            {esAdmin && <Link href="/avisos/" aria-label={`Avisos y mensajes${sinLeer ? `, ${sinLeer} sin leer` : ""}`} title="Avisos y mensajes" className={`${ib} relative`}><Inbox size={20} />{sinLeer > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-crit text-white text-[11px] font-semibold grid place-items-center">{sinLeer}</span>}</Link>}
            {esAdmin && <Link href="/admin/" aria-label="Usuarios" title="Usuarios" className={ib}><Users size={20} /></Link>}
            <button onClick={cambiarTema} aria-label="Cambiar tema claro u oscuro" title="Tema" className={ib}><SunMoon size={20} /></button>
            <button onClick={salir} aria-label="Salir" title="Salir" className={ib}><LogOut size={20} /></button>
          </div>
        </div>
      </header>
      {aviso && <div role="status" className="fixed left-1/2 -translate-x-1/2 z-[80] bg-fg text-bg px-4 py-2.5 rounded-lg max-w-[calc(100%-32px)] text-sm" style={{ bottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}>{aviso}</div>}
      <div className="py-6 pb-14 flex flex-col gap-5 max-w-[1280px] mx-auto" style={pad}>{children}</div>
    </div>
  );
}
