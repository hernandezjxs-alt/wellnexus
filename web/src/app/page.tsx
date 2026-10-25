"use client";
import Link from "next/link";
import { MODULOS } from "@/lib/modulos";
import { useAuth } from "@/components/auth-provider";

export default function Inicio() {
  const { perfil, esAdmin } = useAuth();
  return (
    <>
      <div>
        <h1 className="text-2xl leading-tight">Plataforma de ingeniería de pozos y producción</h1>
        <p className="text-muted mt-1.5 max-w-[68ch]">Fichas de pozo, análisis de producción, simulación, diagramas mecánicos, diagnóstico con IA y reportes en un solo lugar.{esAdmin ? " Eres administrador: ves todos los pozos y puedes gestionar usuarios." : perfil ? " Ves los pozos que te asignó el administrador." : ""}</p>
      </div>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
        {MODULOS.map((m) => (
          <Link key={m.id} href={`/${m.id}/`} className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-surface border border-line hover:border-accent">
            <span className="flex items-center justify-between"><b className="font-display font-semibold">{m.nombre}</b><span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${m.listo ? "bg-sky-soft text-accent-text" : "bg-surface2 text-muted border border-line"}`}>{m.listo ? "Disponible" : "Próximamente"}</span></span>
            <span className="text-muted text-sm flex-1">{m.desc}</span>
            <span className="text-xs text-muted">{m.corto}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
