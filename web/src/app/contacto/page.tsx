"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Contacto() {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [trampa, setTrampa] = useState("");
  const [estado, setEstado] = useState<{ ok: boolean; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (trampa) { setEstado({ ok: true, texto: "Mensaje enviado. Gracias." }); return; } // campo oculto: solo lo llenan los bots
    setOcupado(true);
    const { error } = await supabase.from("mensaje_contacto").insert({ asunto: asunto.trim(), mensaje: mensaje.trim() });
    setOcupado(false);
    if (error) return setEstado({ ok: false, texto: error.code === "42501" ? "Llegaste al límite de 3 mensajes por hora. Intenta más tarde." : error.message });
    setAsunto(""); setMensaje("");
    setEstado({ ok: true, texto: "Mensaje enviado. El administrador lo verá en sus avisos." });
  }
  return (
    <form onSubmit={enviar} className="bg-surface border border-line rounded-xl p-5 max-w-xl flex flex-col gap-3">
      <h2 className="text-base">Escríbele al administrador</h2>
      <label className="flex flex-col gap-1 text-xs text-muted font-medium">Asunto<input id="asunto" type="text" required maxLength={120} value={asunto} onChange={(e) => setAsunto(e.target.value)} className="min-h-11 rounded-lg border border-line bg-surface px-3 text-fg" /></label>
      <label className="flex flex-col gap-1 text-xs text-muted font-medium">Mensaje<textarea id="mensaje" required maxLength={2000} rows={6} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="rounded-lg border border-line bg-surface px-3 py-2 text-fg text-base" /></label>
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trampa} onChange={(e) => setTrampa(e.target.value)} className="absolute -left-[9999px] size-0 opacity-0" />
      {estado && <p role="status" className={`text-sm ${estado.ok ? "text-good" : "text-crit"}`}>{estado.texto}</p>}
      <button disabled={ocupado} className="min-h-11 rounded-lg bg-accent text-white font-semibold disabled:opacity-60">{ocupado ? "Enviando…" : "Enviar"}</button>
    </form>
  );
}
