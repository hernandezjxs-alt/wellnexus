"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

type Fila = { id: string; nombre: string | null; rol: "admin" | "user"; creado_en: string };

export default function Admin() {
  const { esAdmin, session } = useAuth();
  const [filas, setFilas] = useState<Fila[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const cargar = useCallback(async () => {
    const { data, error } = await supabase.from("perfil").select("id,nombre,rol,creado_en").order("creado_en");
    if (error) setMsg(error.message); else setFilas((data ?? []) as Fila[]);
  }, []);
  useEffect(() => { if (esAdmin) cargar(); }, [esAdmin, cargar]);

  if (!esAdmin) return <p className="text-muted">Esta sección es solo para administradores.</p>;
  async function cambiar(f: Fila) {
    const rol = f.rol === "admin" ? "user" : "admin";
    const { error } = await supabase.from("perfil").update({ rol }).eq("id", f.id);
    setMsg(error ? error.message : `${f.nombre ?? "Usuario"} ahora es ${rol === "admin" ? "administrador" : "usuario"}.`); cargar();
  }
  return (
    <section className="bg-surface border border-line rounded-xl p-4 max-w-3xl">
      <h2 className="text-base mb-2">Usuarios de Wellnexus</h2>
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{["Nombre", "Rol", "Desde", ""].map((h) => <th key={h} className="text-left text-[11px] uppercase tracking-wider text-muted px-2.5 py-1.5 border-b border-line">{h}</th>)}</tr></thead><tbody>
        {(filas ?? []).map((f) => <tr key={f.id}><td className="px-2.5 py-2 border-b border-line">{f.nombre ?? "Sin nombre"}</td><td className="px-2.5 py-2 border-b border-line">{f.rol === "admin" ? "Administrador" : "Usuario"}</td><td className="px-2.5 py-2 border-b border-line font-mono">{new Date(f.creado_en).toLocaleDateString("es-CL")}</td><td className="px-2.5 py-2 border-b border-line text-right">{f.id !== session?.user.id && <button onClick={() => cambiar(f)} className="min-h-9 px-3 rounded-lg border border-line hover:bg-surface2">{f.rol === "admin" ? "Quitar admin" : "Hacer admin"}</button>}</td></tr>)}
      </tbody></table></div>
      {msg && <p role="status" className="text-sm mt-3">{msg}</p>}
      <p className="text-muted text-sm mt-3">La asignación de pozos a cada usuario viene en el siguiente paso.</p>
    </section>
  );
}
