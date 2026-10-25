export type Modulo = { id: string; nombre: string; corto: string; desc: string; listo: boolean };

export const MODULOS: Modulo[] = [
  { id: "core", nombre: "Core", corto: "Fichas de pozo", desc: "Repositorio tipo Centinela: pozos, yacimientos, completaciones, pruebas e intervenciones. Carga masiva de los Excel y PowerPoint, búsqueda rápida, usuarios y bitácora.", listo: true },
  { id: "insight", nombre: "Insight", corto: "Análisis de producción", desc: "Tipo OFM: curvas de producción, declinación, mapas de burbujas y tableros exportables a PDF y Excel.", listo: false },
  { id: "flow", nombre: "Flow", corto: "Simulación y análisis nodal", desc: "IPR, PVT y correlaciones de flujo multifásico. Punto de operación, sensibilidades y ajuste interactivo de la correlación contra datos medidos.", listo: false },
  { id: "lift", nombre: "Lift", corto: "Levantamiento artificial", desc: "Gas lift continuo e intermitente (integra INTER 1.1), bombeo mecánico, BES, BCP y plunger lift. Diseño de válvulas.", listo: false },
  { id: "net", nombre: "Net", corto: "Redes de producción", desc: "Simulación monofásica y multifásica de la red completa, del yacimiento a la planta. Cuellos de botella y optimización del gas.", listo: false },
  { id: "draw", nombre: "Draw", corto: "Diagramas mecánicos", desc: "Editor visual del pozo: revestidores, tubería, empacaduras, mandriles y bomba. Exporta a PDF y PowerPoint.", listo: true },
  { id: "ai", nombre: "AI", corto: "Diagnóstico con IA (RAP moderno)", desc: "Foto o escaneo del disco de gas lift, lectura del trazo y diagnóstico con causa probable y recomendación. El ingeniero valida y el modelo aprende.", listo: false },
  { id: "live", nombre: "Live", corto: "Tiempo real y mapa", desc: "Pozos con variables en vivo y disco digital, coloreados por estado en un mapa interactivo con acceso a su ficha.", listo: false },
  { id: "alert", nombre: "Alert", corto: "Alertas y notificaciones", desc: "Reglas por pozo, grupo o red. Niveles informativo, advertencia y crítico, aviso por app y correo, y responsable.", listo: false },
  { id: "bi", nombre: "BI", corto: "Análisis BI", desc: "Tableros con filtros por campo, yacimiento, método y gerencia. Consultas en lenguaje natural y conexión a Power BI.", listo: false },
  { id: "report", nombre: "Report", corto: "Reportería", desc: "Reportes de producción, pruebas, diagnósticos e intervenciones. Envío programado por correo y exportación a PDF, Excel y PowerPoint.", listo: false },
  { id: "team", nombre: "Team", corto: "Personal y organigrama", desc: "Organigrama interactivo: Yacimientos, Optimización, BI, y Control y Monitoreo con IA. Asignación de pozos, roles y permisos.", listo: false },
];
