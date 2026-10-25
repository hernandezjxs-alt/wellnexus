import { supabase } from "./supabase";

type Def = [nombre: string, campo: string, arena: string, metodo: string, estado: string, prof: number, tod: number];
const DEFS: Def[] = [
  ["CN-001", "Campo Norte", "Arena B-2", "gas_lift_continuo", "Activo", 9200, 3.5],
  ["CN-002", "Campo Norte", "Arena B-2", "gas_lift_intermitente", "Activo", 8800, 2.875],
  ["CN-003", "Campo Norte", "Arena C-1", "bombeo_mecanico", "Activo", 6400, 2.875],
  ["CN-004", "Campo Norte", "Arena C-1", "bes", "Activo", 7800, 3.5],
  ["CS-010", "Campo Sur", "Arena A-1", "bcp", "Activo", 4200, 2.875],
  ["CS-011", "Campo Sur", "Arena A-1", "plunger_lift", "Activo", 5600, 2.875],
  ["CS-012", "Campo Sur", "Arena A-2", "flujo_natural", "Activo", 7100, 3.5],
  ["CS-013", "Campo Sur", "Arena A-2", "gas_lift_continuo", "En intervención", 8300, 3.5],
  ["CE-020", "Campo Este", "Arena D-3", "bes", "Activo", 9900, 3.5],
  ["CE-021", "Campo Este", "Arena D-3", "bombeo_mecanico", "Cerrado", 5200, 2.875],
];
const r50 = (v: number) => Math.round(v / 50) * 50;

/** Carga 10 pozos ficticios para probar la plataforma. Solo el admin puede ejecutarla. */
export async function cargarEjemplo(): Promise<string | null> {
  const { data: pozos, error } = await supabase
    .from("pozo")
    .insert(
      DEFS.map(([nombre, campo, arena, metodo, estado, prof]) => ({
        nombre, campo, yacimiento: arena, estado, metodo_levantamiento: metodo, tipo_completacion: "Sencilla", profundidad_total_ft: prof,
      })),
    )
    .select("id,nombre");
  if (error || !pozos) return error?.message ?? "No se pudo crear los pozos.";
  const id = (n: string) => pozos.find((p) => p.nombre === n)!.id;
  const rev: object[] = [], tub: object[] = [], emp: object[] = [], man: object[] = [], int: object[] = [], eq: object[] = [];
  for (const [n, , arena, metodo, , prof, tod] of DEFS) {
    const pozo_id = id(n), tb = r50(prof * 0.9), pump = r50(prof * 0.72), especial = metodo === "bes" || metodo === "bcp";
    rev.push(
      { pozo_id, tipo: "conductor", diametro_in: 20, tope_ft: 0, base_ft: 350 },
      { pozo_id, tipo: "superficie", diametro_in: 13.375, tope_ft: 0, base_ft: r50(prof * 0.25) },
      { pozo_id, tipo: "produccion", diametro_in: 9.625, tope_ft: 0, base_ft: r50(prof * 0.7) },
      { pozo_id, tipo: "liner", diametro_in: 7, tope_ft: r50(prof * 0.66), base_ft: prof },
    );
    tub.push({ pozo_id, sarta: "larga", diametro_in: tod, tope_ft: 0, base_ft: especial ? pump : tb });
    int.push(
      { pozo_id, arena, tope_ft: r50(prof * 0.93), base_ft: r50(prof * 0.96), tipo: "cañoneado" },
      { pozo_id, arena, tope_ft: r50(prof * 0.97), base_ft: r50(prof * 0.99), tipo: "cañoneado" },
    );
    if (metodo.startsWith("gas_lift")) {
      emp.push({ pozo_id, tipo: "Hidráulica", profundidad_ft: r50(tb - 80) });
      [0.25, 0.45, 0.62, 0.78].forEach((f, i) =>
        man.push({ pozo_id, numero: i + 1, profundidad_ft: r50(tb * f), tipo: "Bolsillo lateral", valvula: i === 3 ? "operadora" : "descarga" }),
      );
    } else if (metodo === "flujo_natural") {
      emp.push({ pozo_id, tipo: "Hidráulica", profundidad_ft: r50(tb - 80) });
    } else {
      eq.push({ pozo_id, tipo: metodo === "bombeo_mecanico" ? "bomba_subsuelo" : metodo, profundidad_ft: pump, detalle: {} });
    }
  }
  const pasos: [string, object[]][] = [["revestimiento", rev], ["tuberia", tub], ["empacadura", emp], ["mandril", man], ["intervalo", int], ["equipo_fondo", eq]];
  for (const [tabla, filas] of pasos) {
    if (!filas.length) continue;
    const { error: e } = await supabase.from(tabla).insert(filas);
    if (e) return `${tabla}: ${e.message}`;
  }
  return null;
}
