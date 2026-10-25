import Link from "next/link";
import { notFound } from "next/navigation";
import { MODULOS } from "@/lib/modulos";

const pendientes = MODULOS.filter((m) => !m.listo);
export function generateStaticParams() { return pendientes.map((m) => ({ modulo: m.id })); }
export const dynamicParams = false;

export default async function Pendiente({ params }: { params: Promise<{ modulo: string }> }) {
  const { modulo } = await params;
  const m = pendientes.find((x) => x.id === modulo);
  if (!m) notFound();
  return (
    <div className="bg-surface border border-line rounded-xl p-6 max-w-xl">
      <span className="text-[11px] font-semibold rounded-full px-2 py-0.5 bg-surface2 text-muted border border-line">Próximamente</span>
      <h1 className="text-xl mt-3">{m.nombre}</h1>
      <p className="text-muted mt-1">{m.desc}</p>
      <p className="mt-4 text-sm">Este módulo se construye después de Core y Draw. Mientras tanto puedes volver al inicio.</p>
      <Link href="/" className="inline-flex min-h-10 items-center mt-4 px-4 rounded-lg bg-accent text-white font-semibold">Volver al inicio</Link>
    </div>
  );
}
