"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

type Aviso = { id: string; tipo: "usuario" | "contacto"; titulo: string; cuerpo: string | null; leido: boolean; creado_en: string };

export default function Avisos() {
  const { esAdmin } = useAuth();
  const [lista, setLista] = useState<Aviso[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from("aviso").select("*").order("creado_en", { ascending: false }).limit(100);
    if (error) setMsg(error.message); else setLista((data ?? []) as Aviso[]);
    window.dispatchEvent(new Event("wx-avisos"));
  }, []);
  useEffect(() => { if (esAdmin) cargar(); }, [esAdmin, cargar]);

  if (!esAdmin) return <p className="text-muted">Esta sección es solo para administradores.</p>;
  const marcar = async (id: string, leido: boolean) => { await supabase.from("aviso").update({ leido }).eq("id", id); cargar(); };
  const todos = async () => { await supabase.from("aviso").update({ leido: true }).eq("leido", false); cargar(); };
  const quitar = async (id: string) => { await supabase.from("aviso").delete().eq("id", id); cargar(); };
  const sin = (lista ?? []).filter((a) => !a.leido).length;

  return (
    <section className="bg-surface border border-line rounded-xl p-4 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-base">{sin ? `${sin} sin leer` : "Todo al día"}</h2>
        {sin > 0 && <button onClick={todos} className="min-h-9 px-3 rounded-lg border border-line hover:bg-surface2">Marcar todo como leído</button>}
      </div>
      {msg && <p className="text-crit text-sm">{msg}</p>}
      {lista && lista.length === 0 && <p className="text-muted">Todavía no hay avisos. Aquí llegan los usuarios nuevos y los mensajes de contacto.</p>}
      <ul className="flex flex-col gap-2">
        {(lista ?? []).map((a) => (
          <li key={a.id} className={`rounded-lg border p-3 ${a.leido ? "border-line" : "border-accent bg-sky-soft"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2"><span className="text-[11px] font-semibold rounded-full px-2 py-0.5 bg-surface2 border border-line text-muted">{a.tipo === "usuario" ? "Usuario" : "Contacto"}</span><b>{a.titulo}</b></span>
              <span className="text-xs text-muted font-mono">{new Date(a.creado_en).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}</span>
            </div>
            {a.cuerpo && <p className="mt-1 text-sm whitespace-pre-wrap break-words">{a.cuerpo}</p>}
            <div className="flex gap-2 mt-2"><button onClick={() => marcar(a.id, !a.leido)} className="min-h-8 px-3 rounded-lg border border-line text-sm hover:bg-surface2">{a.leido ? "Marcar sin leer" : "Marcar leído"}</button><button onClick={() => quitar(a.id)} className="min-h-8 px-3 rounded-lg border border-line text-sm text-crit hover:bg-surface2">Eliminar</button></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
