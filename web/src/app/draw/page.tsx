"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePozos } from "@/lib/use-pozos";
import { METODOS, fmt, toDraw } from "@/lib/pozo";
import { drawWell } from "@/lib/draw";

export default function Draw() {
  const { pozos, error } = usePozos();
  const [sel, setSel] = useState<string>("");
  const [metodo, setMetodo] = useState<string>("");
  const [etiq, setEtiq] = useState(true);
  const [perf, setPerf] = useState(true);

  const pozo = (pozos ?? []).find((p) => p.id === sel) ?? pozos?.[0];
  const met = metodo || pozo?.metodo_levantamiento || "gas_lift_continuo";
  const r = useMemo(() => (pozo ? drawWell(toDraw(pozo), met, etiq, perf) : null), [pozo, met, etiq, perf]);

  if (pozos === null) return <p className="text-muted" role="status">Cargando pozos…</p>;
  if (error) return <p role="alert" className="text-crit bg-surface border border-line rounded-xl p-4">{error}</p>;
  if (!pozo || !r) return <div className="bg-surface border border-line rounded-xl p-5 max-w-xl"><h2 className="text-base">No hay pozos para dibujar</h2><p className="text-muted mt-1">Carga o crea fichas en Core primero.</p><Link href="/core/" className="inline-flex items-center min-h-10 mt-3 px-4 rounded-lg bg-accent text-white font-semibold">Ir a Core</Link></div>;

  return (
    <>
      <div className="bg-surface border border-line rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <label className="flex flex-col gap-1 text-xs text-muted font-medium">Pozo<select id="pozo" value={pozo.id} onChange={(e) => { setSel(e.target.value); setMetodo(""); }} className="min-h-10 rounded-lg border border-line bg-surface px-2 text-fg">{pozos.map((p) => <option key={p.id} value={p.id}>{p.nombre} · {METODOS[p.metodo_levantamiento ?? ""] ?? "—"}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-xs text-muted font-medium">Completación<select id="metodo" value={met} onChange={(e) => setMetodo(e.target.value)} className="min-h-10 rounded-lg border border-line bg-surface px-2 text-fg">{Object.entries(METODOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label className="flex items-center gap-2 min-h-10"><input id="etiq" type="checkbox" checked={etiq} onChange={(e) => setEtiq(e.target.checked)} className="size-4" />Etiquetas</label>
        <label className="flex items-center gap-2 min-h-10"><input id="perf" type="checkbox" checked={perf} onChange={(e) => setPerf(e.target.checked)} className="size-4" />Cañoneo</label>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
        <div className="bg-surface border border-line rounded-xl p-4 min-w-0 overflow-x-auto" dangerouslySetInnerHTML={{ __html: r.svg }} />
        <section className="bg-surface border border-line rounded-xl p-4 min-w-0">
          <h2 className="text-base mb-2">Componentes</h2>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left text-[11px] uppercase tracking-wider text-muted px-2.5 py-1.5 border-b border-line">Componente</th><th className="text-right text-[11px] uppercase tracking-wider text-muted px-2.5 py-1.5 border-b border-line">Prof. (ft)</th></tr></thead><tbody>
            {r.comps.filter((c) => c.d >= 0).map((c, i) => <tr key={i}><td className="px-2.5 py-1.5 border-b border-line">{c.t}</td><td className="px-2.5 py-1.5 border-b border-line text-right font-mono">{fmt(c.d)}</td></tr>)}
          </tbody></table></div>
          <p className="text-muted text-sm mt-3">Se dibuja a escala con los datos de Core. Cambiar la completación muestra cómo quedaría el mismo pozo con otro método.</p>
        </section>
      </div>
    </>
  );
}
