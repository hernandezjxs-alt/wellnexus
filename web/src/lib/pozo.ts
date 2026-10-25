export type Metodo = "flujo_natural" | "gas_lift_continuo" | "gas_lift_intermitente" | "bombeo_mecanico" | "bes" | "bcp" | "plunger_lift" | "hidraulico" | "otro";

export const METODOS: Record<string, string> = {
  flujo_natural: "Flujo natural",
  gas_lift_continuo: "Gas lift continuo",
  gas_lift_intermitente: "Gas lift intermitente",
  bombeo_mecanico: "Bombeo mecánico",
  bes: "BES",
  bcp: "BCP",
  plunger_lift: "Plunger lift",
};

export const OD: Record<number, string> = { 20: '20"', 13.375: '13⅜"', 9.625: '9⅝"', 7: '7"', 3.5: '3½"', 2.875: '2⅞"' };
export const odLabel = (n: number) => OD[n] ?? `${n}"`;
export const fmt = (n: number) => Math.round(n).toLocaleString("es-CL");

export type PozoDB = {
  id: string;
  nombre: string;
  campo: string | null;
  yacimiento: string | null;
  estado: string | null;
  metodo_levantamiento: Metodo | null;
  tipo_completacion: string | null;
  profundidad_total_ft: number | null;
  revestimiento: { tipo: string; diametro_in: number; tope_ft: number; base_ft: number }[];
  tuberia: { sarta: string; diametro_in: number; tope_ft: number; base_ft: number }[];
  empacadura: { tipo: string | null; profundidad_ft: number }[];
  mandril: { numero: number | null; profundidad_ft: number; valvula: string | null }[];
  intervalo: { arena: string | null; tope_ft: number; base_ft: number; tipo: string | null }[];
  equipo_fondo: { tipo: string; profundidad_ft: number | null }[];
};

export const POZO_SELECT =
  "id,nombre,campo,yacimiento,estado,metodo_levantamiento,tipo_completacion,profundidad_total_ft,revestimiento(tipo,diametro_in,tope_ft,base_ft),tuberia(sarta,diametro_in,tope_ft,base_ft),empacadura(tipo,profundidad_ft),mandril(numero,profundidad_ft,valvula),intervalo(arena,tope_ft,base_ft,tipo),equipo_fondo(tipo,profundidad_ft)";

const r50 = (v: number) => Math.round(v / 50) * 50;
const ORDEN_REV = ["conductor", "superficie", "intermedio", "produccion", "liner"];
const NOMBRE_REV: Record<string, string> = { conductor: "Conductor", superficie: "Superficie", intermedio: "Intermedio", produccion: "Producción", liner: "Liner" };

/** Datos mínimos que necesita el diagrama a escala. */
export type DrawWell = {
  id: string;
  prof: number;
  casings: { t: string; od: number; top: number; base: number }[];
  tbgOd: number;
  tb: number; // base de la tubería en completaciones normales
  pump: number; // profundidad de bomba (BES, BCP, bombeo mecánico)
  pkr: number;
  mand: number[];
  perf: [number, number][];
};

export function toDraw(p: PozoDB): DrawWell {
  const prof = p.profundidad_total_ft ?? 8000;
  const tub = p.tuberia.slice().sort((a, b) => a.tope_ft - b.tope_ft)[0];
  const especial = p.metodo_levantamiento === "bes" || p.metodo_levantamiento === "bcp";
  const tb = !tub || especial ? r50(prof * 0.9) : tub.base_ft;
  const bomba = p.equipo_fondo.find((e) => ["bes", "bcp", "bomba_subsuelo"].includes(e.tipo));
  const pump = bomba?.profundidad_ft ?? (especial && tub ? tub.base_ft : r50(prof * 0.72));
  const mand = p.mandril.map((m) => m.profundidad_ft).sort((a, b) => a - b);
  return {
    id: p.nombre,
    prof,
    casings: p.revestimiento
      .slice()
      .sort((a, b) => ORDEN_REV.indexOf(a.tipo) - ORDEN_REV.indexOf(b.tipo))
      .map((r) => ({ t: NOMBRE_REV[r.tipo] ?? r.tipo, od: r.diametro_in, top: r.tope_ft, base: r.base_ft })),
    tbgOd: tub?.diametro_in ?? 2.875,
    tb,
    pump,
    pkr: p.empacadura[0]?.profundidad_ft ?? r50(tb - 80),
    mand: mand.length ? mand : [0.25, 0.45, 0.62, 0.78].map((f) => r50(tb * f)),
    perf: p.intervalo.length ? p.intervalo.map((i) => [i.tope_ft, i.base_ft] as [number, number]) : [[r50(prof * 0.93), r50(prof * 0.96)]],
  };
}
