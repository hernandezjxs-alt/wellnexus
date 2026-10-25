"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

type Cat = { id: string; tipo: string; nombre: string };
const TIPOS: Record<string, string> = { campo: "Campos", yacimiento: "Yacimientos", estado: "Estados de pozo", etiqueta: "Etiquetas" };

export default function Etiquetas() {
  const { esAdmin } = useAuth();
  const [cats, setCats] = useState<Cat[]>([]);
  const [tipo, setTipo] = useState("campo");
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [borrar, setBorrar] = useState<string | null>(null);
  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from("categoria").select("id,tipo,nombre").order("nombre");
    if (error) setMsg(error.message); else setCats((data ?? []) as Cat[]);
  }, []);
  useEffect(() => { cargar(); }, [cargar]);

  if (!esAdmin) return <p className="text-muted">Esta sección es solo para administradores.</p>;
  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("categoria").insert({ tipo, nombre: nombre.trim() });
    setMsg(error ? (error.code === "23505" ? "Ese nombre ya existe en esa lista." : error.message) : "Agregada.");
    if (!error) setNombre("");
    cargar();
  }
  async function quitar(id: string) { const { error } = await supabase.from("categoria").delete().eq("id", id); setMsg(error ? error.message : "Eliminada."); setBorrar(null); cargar(); }

  return (
    <div className="grid gap-4 max-w-3xl">
      <form onSubmit={agregar} className="bg-surface border border-line rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <label className="flex flex-col gap-1 text-xs text-muted font-medium">Lista<select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="min-h-10 rounded-lg border border-line bg-surface px-2 text-fg">{Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-xs text-muted font-medium flex-1 min-w-40">Nombre<input id="nombre" type="text" required maxLength={60} value={nombre} onChange={(e) => setNombre(e.target.value)} className="min-h-10 rounded-lg border border-line bg-surface px-2.5 text-fg" /></label>
        <button className="min-h-10 px-4 rounded-lg bg-accent text-white font-semibold">Agregar</button>
      </form>
      {msg && <p role="status" className="text-sm">{msg}</p>}
      {Object.entries(TIPOS).map(([k, titulo]) => (
        <section key={k} className="bg-surface border border-line rounded-xl p-4">
          <h2 className="text-base mb-2">{titulo}</h2>
          <div className="flex flex-wrap gap-2">
            {cats.filter((c) => c.tipo === k).map((c) => (
              <span key={c.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface2 pl-3 pr-1 py-1 text-sm">
                {c.nombre}
                {borrar === c.id ? (<><button onClick={() => quitar(c.id)} className="px-2 min-h-7 rounded-full bg-crit text-white text-xs font-semibold">Eliminar</button><button onClick={() => setBorrar(null)} className="px-2 min-h-7 text-xs text-muted">No</button></>) : <button onClick={() => setBorrar(c.id)} aria-label={`Quitar ${c.nombre}`} className="size-7 rounded-full text-muted hover:bg-line">×</button>}
              </span>
            ))}
            {!cats.some((c) => c.tipo === k) && <span className="text-muted text-sm">Todavía no hay elementos.</span>}
          </div>
        </section>
      ))}
    </div>
  );
}
