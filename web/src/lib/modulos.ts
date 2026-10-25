export type Modulo = { id: string; nombre: string; corto: string; desc: string; listo: boolean };

export const MODULOS: Modulo[] = [
  { id: "core", nombre: "Core", corto: "Fichas de pozo", desc: "Datos, completación e historial de cada pozo, con carga masiva desde Excel y PowerPoint.", listo: true },
  { id: "insight", nombre: "Insight", corto: "Análisis de producción", desc: "Producción por pozo y por campo, declinación y comparación.", listo: false },
  { id: "flow", nombre: "Flow", corto: "Simulación y análisis nodal", desc: "Curvas de oferta y demanda, punto de operación y ajuste de correlaciones.", listo: false },
  { id: "lift", nombre: "Lift", corto: "Levantamiento artificial", desc: "Gas lift continuo e intermitente, bombeo mecánico, BES, BCP, plunger lift.", listo: false },
  { id: "net", nombre: "Net", corto: "Redes de producción", desc: "Redes de producción de uno o varios fluidos y balance de presiones.", listo: false },
  { id: "draw", nombre: "Draw", corto: "Diagramas mecánicos", desc: "Diagrama mecánico del pozo a escala con todas las completaciones.", listo: true },
  { id: "ai", nombre: "AI", corto: "Diagnóstico con IA", desc: "Lectura de discos de gas lift por foto o escaneo, con diagnóstico.", listo: false },
  { id: "live", nombre: "Live", corto: "Tiempo real y mapa", desc: "Estado de los pozos en un mapa interactivo, casi en tiempo real.", listo: false },
  { id: "alert", nombre: "Alert", corto: "Alertas y notificaciones", desc: "Reglas, avisos y seguimiento de lo que necesita atención.", listo: false },
  { id: "bi", nombre: "BI", corto: "Análisis BI", desc: "Tableros por campo, método y período.", listo: false },
  { id: "report", nombre: "Report", corto: "Reportería", desc: "Informes listos para entregar en PDF, Excel y PowerPoint.", listo: false },
  { id: "team", nombre: "Team", corto: "Personal y organigrama", desc: "Equipos de Yacimientos, Optimización, BI y Control y Monitoreo con IA.", listo: false },
];
