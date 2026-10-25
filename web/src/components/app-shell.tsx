"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, SunMoon, Users } from "lucide-react";
import { MODULOS } from "@/lib/modulos";
import { useAuth } from "./auth-provider";
import { Logo } from "./logo";

const guardar = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };
const leer = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };

export function AppShell({ children }: { children: React.ReactNode }) {
  const { perfil, esAdmin, salir, session } = useAuth();
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [marca, setMarca] = useState<"v4" | "v5">("v4");

  useEffect(() => {
    const t = leer("wx-theme"); if (t) document.documentElement.setAttribute("data-theme", t);
    const m = leer("wx-brand") === "v5" ? "v5" : "v4";
    setMarca(m); document.documentElement.setAttribute("data-brand", m);
  }, []);
  useEffect(() => setAbierto(false), [ruta]);

  const cambiarTema = () => {
    const d = document.documentElement;
    const actual = d.getAttribute("data-theme") ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const n = actual === "dark" ? "light" : "dark"; d.setAttribute("data-theme", n); guardar("wx-theme", n);
  };
  const cambiarMarca = (m: "v4" | "v5") => { setMarca(m); document.documentElement.setAttribute("data-brand", m); guardar("wx-brand", m); };

  const actual = MODULOS.find((m) => ruta.startsWith(`/${m.id}/`));
  const titulo = ruta.startsWith("/admin") ? "Usuarios" : actual?.nombre ?? "Inicio";
  const sub = ruta.startsWith("/admin") ? "Administración" : actual?.corto ?? "Una sola plataforma para el pozo, la producción y el equipo";
  const nombre = perfil?.nombre?.split(" ")[0] ?? session?.user.email?.split("@")[0] ?? "";
  const pad = { paddingLeft: "max(16px, env(safe-area-inset-left, 0px))", paddingRight: "max(16px, env(safe-area-inset-right, 0px))" };

  return (
    <div className="grid min-h-screen md:grid-cols-[272px_minmax(0,1fr)]">
      <aside aria-label="Módulos" className={`fixed md:sticky z-[70] top-0 bottom-0 md:h-screen w-[min(300px,86vw)] md:w-auto bg-surface border-r border-line flex flex-col py-4 pl-4 pr-3 overflow-y-auto transition-transform ${abierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} style={{ paddingLeft: "max(16px, env(safe-area-inset-left, 0px))" }}>
        <Link href="/" className="flex items-center gap-2.5 px-1 pb-3.5">
          <Logo />
          <span><b className="font-display text-xl font-bold leading-none block">Wellnexus</b><small className="text-muted text-xs">Ingeniería de pozos y producción</small></span>
        </Link>
        <div className="tri-bar mb-3 rounded" />
        <nav className="flex flex-col gap-0.5 flex-1">
          {MODULOS.map((m) => {
            const on = ruta.startsWith(`/${m.id}/`);
            return (
              <Link key={m.id} href={`/${m.id}/`} aria-current={on ? "page" : undefined} className={`block rounded-md border-l-[3px] px-2.5 py-1.5 hover:bg-surface2 ${on ? "bg-sky-soft border-accent" : "border-transparent"}`}>
                <span className="flex items-center justify-between font-display font-semibold text-sm">{m.nombre}{!m.listo && <span className="text-[10px] font-sans font-medium text-muted">pronto</span>}</span>
                <span className="block text-xs text-muted leading-tight">{m.corto}</span>
              </Link>
            );
          })}
        </nav>
        <p className="text-xs text-muted pt-3 mt-2 border-t border-line">Elaborado por JH · Todos los derechos reservados · octubre 2026</p>
      </aside>
      {abierto && <div className="fixed inset-0 z-[65] bg-black/50 md:hidden" onClick={() => setAbierto(false)} />}
      <div className="min-w-0">
        <header className="sticky z-40 bg-surface border-b border-line flex items-center gap-2 py-2.5" style={{ top: "env(safe-area-inset-top, 0px)", ...pad }}>
          <button onClick={() => setAbierto(true)} aria-label="Abrir módulos" className="md:hidden size-10 grid place-items-center rounded-lg border border-line"><Menu size={18} /></button>
          <div className="flex-1 min-w-0">
            <b className="font-display font-semibold block truncate">{titulo}</b>
            <span className="text-xs text-muted block truncate">{sub}</span>
          </div>
          <span className="hidden sm:block text-sm mr-1">Hola, {nombre}{esAdmin && <span className="text-muted"> · Admin</span>}</span>
          <div className="hidden sm:inline-flex border border-line rounded-lg overflow-hidden" role="group" aria-label="Versión de marca">
            {(["v4", "v5"] as const).map((m) => <button key={m} aria-pressed={marca === m} onClick={() => cambiarMarca(m)} className={`min-h-10 px-3 font-medium ${marca === m ? "bg-accent text-white" : "bg-surface text-muted"}`}>{m}</button>)}
          </div>
          {esAdmin && <Link href="/admin/" aria-label="Usuarios" title="Usuarios" className="size-10 grid place-items-center rounded-lg border border-line hover:bg-surface2"><Users size={18} /></Link>}
          <button onClick={cambiarTema} aria-label="Cambiar tema claro u oscuro" title="Tema" className="size-10 grid place-items-center rounded-lg border border-line hover:bg-surface2"><SunMoon size={18} /></button>
          <button onClick={salir} aria-label="Salir" title="Salir" className="size-10 grid place-items-center rounded-lg border border-line hover:bg-surface2"><LogOut size={18} /></button>
        </header>
        <div className="py-5 pb-12 flex flex-col gap-4 max-w-[1280px]" style={pad}>{children}</div>
      </div>
    </div>
  );
}
