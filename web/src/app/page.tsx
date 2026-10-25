"use client";
import Link from "next/link";
import { MODULOS } from "@/lib/modulos";
import { ModuleIcon } from "@/components/module-icon";

export default function Inicio() {
  return (
    <>
      <div>
        <h1 className="text-3xl leading-tight">Módulos de la plataforma</h1>
        <p className="text-muted mt-1.5 text-base max-w-[68ch]">Elige un módulo para empezar.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULOS.map((m) => (
          <Link key={m.id} href={`/${m.id}/`} className="flex flex-col gap-3 p-5 rounded-2xl bg-surface border border-line hover:border-accent active:scale-[.99] transition-colors">
            <span className="flex items-center gap-4">
              <ModuleIcon id={m.id} size={64} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-display text-accent-text"><span className="font-normal">Well</span><b>nexus</b></span>
                <b className="block font-display text-2xl leading-tight">{m.nombre}</b>
              </span>
              {!m.listo && <span className="self-start text-[11px] font-semibold rounded-full px-2 py-0.5 bg-surface2 text-muted border border-line">Próximamente</span>}
            </span>
            <b className="font-display text-base">{m.corto}</b>
            <span className="text-muted text-[15px] leading-snug">{m.desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
