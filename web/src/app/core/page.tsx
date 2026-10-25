"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { usePozos } from "@/lib/use-pozos";
import { METODOS, fmt, odLabel, PozoDB } from "@/lib/pozo";
import { cargarEjemplo } from "@/lib/ejemplo";

const th = "text-left text-[11px] uppercase tracking-wider text-muted font-semibold px-2.5 py-1.5 border-b border-line whitespace-nowrap";
const td = "px-2.5 py-1.5 border-b border-line whitespace-nowrap";
const estadoCls = (e: string | null) => (e === "Activo" ? "text-good" : e === "Cerrado" ? "text-crit" : "text-warn");

export default function Core() {
  const { esAdmin } = useAuth();
  const { pozos, error, recargar } = usePozos();
  const [q, setQ] = useState("");
  const [m, setM] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  const lista = useMemo(() => (pozos ?? []).filter((p) => (!q || `${p.nombre}${p.campo}${p.yacimiento}`.toLowerCase().includes(q.toLowerCase())) && (!m || p.metodo_levantamiento === m)), [pozos, q, m]);
  const pozo: PozoDB | undefined = (pozos ?? []).find((p) => p.id === sel) ?? lista[0];

  async function ejemplo() { setOcupado(true); const e = await cargarEjemplo(); setOcupado(false); setMsg(e ?? "Listo: se cargaron 10 pozos de ejemplo."); recargar(); }

  if (pozos === null) return <p className="text-muted" role="status">Cargando pozos…</p>;
  return (
    <>
      {error && <p role="alert" className="text-crit bg-surface border border-line rounded-xl p-4">{error}</p>}
      {!error && pozos.length === 0 && (
        <div className="bg-surface border border-line rounded-xl p-5 max-w-xl">
          <h2 className="text-base">Todavía no hay pozos</h2>
          <p className="text-muted mt-1">{esAdmin ? "Puedes cargar 10 pozos ficticios para probar la plataforma. Más adelante se cargan desde tus Excel y PowerPoint." : "El administrador aún no te asignó pozos."}</p>
          {esAdmin && <button onClick={ejemplo} disabled={ocupado} className="mt-3 min-h-10 px-4 rounded-lg bg-accent text-white font-semibold disabled:opacity-60">{ocupado ? "Cargando…" : "Cargar pozos de ejemplo"}</button>}
          {msg && <p role="status" className="mt-2 text-sm">{msg}</p>}
        </div>
      )}
      {pozos.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start">
          <section className="bg-surface border border-line rounded-xl p-4 min-w-0">
            <h2 className="text-base mb-2.5">Pozos</h2>
            <div className="flex flex-wrap gap-2.5 mb-2.5">
              <label className="flex flex-col gap-1 text-xs text-muted font-medium flex-1 min-w-32">Buscar<input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pozo, campo o arena" className="min-h-10 rounded-lg border border-line bg-surface px-2.5 text-fg" /></label>
              <label className="flex flex-col gap-1 text-xs text-muted font-medium flex-1 min-w-32">Método<select id="m" value={m} onChange={(e) => setM(e.target.value)} className="min-h-10 rounded-lg border border-line bg-surface px-2 text-fg"><option value="">Todos</option>{Object.entries(METODOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className={th}>Pozo</th><th className={th}>Campo</th><th className={th}>Método</th><th className={th}>Estado</th></tr></thead>
              <tbody>{lista.map((p) => (
                <tr key={p.id} onClick={() => setSel(p.id)} className={`cursor-pointer hover:bg-surface2 ${p.id === pozo?.id ? "bg-sky-soft" : ""}`}>
                  <td className={`${td} font-mono`}>{p.nombre}</td><td className={td}>{p.campo}</td><td className={td}>{METODOS[p.metodo_levantamiento ?? ""] ?? "—"}</td><td className={`${td} ${estadoCls(p.estado)} font-medium`}>{p.estado}</td>
                </tr>))}
                {lista.length === 0 && <tr><td colSpan={4} className={`${td} text-muted`}>Sin resultados.</td></tr>}
              </tbody></table></div>
          </section>
          {pozo && (
            <section className="bg-surface border border-line rounded-xl p-4 min-w-0">
              <div className="flex flex-wrap justify-between gap-2">
                <div><h2 className="text-xl font-mono" style={{ fontFamily: "var(--font-display)" }}>{pozo.nombre}</h2><span className="text-muted">{pozo.campo} · {pozo.yacimiento}</span></div>
                <div className="flex gap-2 items-start"><span className={`text-xs font-semibold ${estadoCls(pozo.estado)}`}>{pozo.estado}</span><span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-sky-soft text-accent-text">{METODOS[pozo.metodo_levantamiento ?? ""] ?? "—"}</span></div>
              </div>
              <dl className="grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] gap-3 my-3.5">
                <div><dt className="text-[11px] uppercase tracking-wider text-muted">Profundidad total</dt><dd className="font-mono">{pozo.profundidad_total_ft ? `${fmt(pozo.profundidad_total_ft)} ft` : "—"}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wider text-muted">Completación</dt><dd>{pozo.tipo_completacion ?? "—"}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wider text-muted">Tubería</dt><dd>{pozo.tuberia[0] ? `${odLabel(pozo.tuberia[0].diametro_in)} hasta ${fmt(pozo.tuberia[0].base_ft)} ft` : "—"}</dd></div>
              </dl>
              <h3 className="text-sm mb-1">Revestimiento</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className={th}>Tipo</th><th className={`${th} text-right`}>Diámetro</th><th className={`${th} text-right`}>Tope (ft)</th><th className={`${th} text-right`}>Base (ft)</th></tr></thead><tbody>
                {pozo.revestimiento.slice().sort((a, b) => a.tope_ft - b.tope_ft || a.base_ft - b.base_ft).map((r, i) => <tr key={i}><td className={`${td} capitalize`}>{r.tipo}</td><td className={`${td} text-right font-mono`}>{odLabel(r.diametro_in)}</td><td className={`${td} text-right font-mono`}>{fmt(r.tope_ft)}</td><td className={`${td} text-right font-mono`}>{fmt(r.base_ft)}</td></tr>)}</tbody></table></div>
              <h3 className="text-sm mt-3.5 mb-1">Equipos y accesorios</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className={th}>Equipo</th><th className={`${th} text-right`}>Profundidad (ft)</th></tr></thead><tbody>
                {pozo.mandril.slice().sort((a, b) => a.profundidad_ft - b.profundidad_ft).map((x, i) => <tr key={`m${i}`}><td className={td}>Mandril {x.numero ?? i + 1}{x.valvula ? ` · válvula ${x.valvula}` : ""}</td><td className={`${td} text-right font-mono`}>{fmt(x.profundidad_ft)}</td></tr>)}
                {pozo.empacadura.map((x, i) => <tr key={`e${i}`}><td className={td}>Empacadura</td><td className={`${td} text-right font-mono`}>{fmt(x.profundidad_ft)}</td></tr>)}
                {pozo.equipo_fondo.map((x, i) => <tr key={`f${i}`}><td className={td}>{METODOS[x.tipo] ?? x.tipo.replace("_", " ")}</td><td className={`${td} text-right font-mono`}>{x.profundidad_ft ? fmt(x.profundidad_ft) : "—"}</td></tr>)}
              </tbody></table></div>
              <h3 className="text-sm mt-3.5 mb-1">Intervalos</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className={th}>Arena</th><th className={`${th} text-right`}>Tope (ft)</th><th className={`${th} text-right`}>Base (ft)</th><th className={th}>Tipo</th></tr></thead><tbody>
                {pozo.intervalo.map((x, i) => <tr key={i}><td className={td}>{x.arena}</td><td className={`${td} text-right font-mono`}>{fmt(x.tope_ft)}</td><td className={`${td} text-right font-mono`}>{fmt(x.base_ft)}</td><td className={`${td} capitalize`}>{x.tipo}</td></tr>)}</tbody></table></div>
              <Link href="/draw/" className="inline-flex items-center min-h-10 mt-4 px-4 rounded-lg bg-accent text-white font-semibold">Ver diagrama mecánico</Link>
            </section>
          )}
        </div>
      )}
    </>
  );
}
