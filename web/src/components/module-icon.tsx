import { Activity, BarChart3, Bell, ClipboardList, FileText, Gauge, LineChart, Network, PencilRuler, Radio, ScanLine, Users, ArrowUpFromLine, type LucideIcon } from "lucide-react";

const ICONOS: Record<string, LucideIcon> = {
  core: ClipboardList, insight: LineChart, flow: Gauge, lift: ArrowUpFromLine, net: Network, draw: PencilRuler,
  ai: ScanLine, live: Radio, alert: Bell, bi: BarChart3, report: FileText, team: Users,
};

/** Ficha de icono de módulo: mismo azul acero y esquinas de la marca. */
export function ModuleIcon({ id, size = 56 }: { id: string; size?: number }) {
  const I = ICONOS[id] ?? Activity;
  return (
    <span className="shrink-0 grid place-items-center rounded-2xl text-white" style={{ width: size, height: size, background: "#3E6A94" }}>
      <I size={size * 0.52} strokeWidth={1.9} color="#FFFFFF" />
      <span className="sr-only">{id}</span>
    </span>
  );
}
