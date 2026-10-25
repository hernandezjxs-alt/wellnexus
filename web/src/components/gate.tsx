"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { AppShell } from "./app-shell";
import { LoginScreen } from "./login-screen";

const PUBLICAS = ["/terminos/", "/privacidad/"];

export function Gate({ children }: { children: React.ReactNode }) {
  const { session, perfil, cargando, salir } = useAuth();
  const ruta = usePathname();
  if (PUBLICAS.includes(ruta)) return <>{children}</>;
  if (cargando) return <div className="min-h-screen grid place-items-center text-muted" role="status">Cargando…</div>;
  if (!session) return <LoginScreen />;
  if (!perfil)
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="max-w-sm bg-surface border border-line rounded-xl p-5 flex flex-col gap-3">
          <h1 className="text-lg">Esta cuenta no tiene acceso a Wellnexus</h1>
          <p className="text-muted">{session.user.email} no está registrada en Wellnexus. Crea una cuenta nueva desde Wellnexus con otro correo, o pide acceso al administrador.</p>
          <button onClick={salir} className="min-h-11 rounded-lg bg-accent text-white font-semibold">Salir</button>
        </div>
      </main>
    );
  if (!perfil)
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="max-w-sm bg-surface border border-line rounded-xl p-5 flex flex-col gap-3">
          <h1 className="text-lg">Esta cuenta no tiene acceso a Wellnexus</h1>
          <p className="text-muted">{session.user.email} no está registrada en Wellnexus. Crea una cuenta nueva desde Wellnexus con otro correo, o pide acceso al administrador.</p>
          <button onClick={salir} className="min-h-11 rounded-lg bg-accent text-white font-semibold">Salir</button>
        </div>
      </main>
    );
  return <AppShell>{children}</AppShell>;
}
