"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { AppShell } from "./app-shell";
import { LoginScreen } from "./login-screen";
import { ActivarCuenta } from "./activar-cuenta";

const PUBLICAS = ["/terminos/", "/privacidad/"];

export function Gate({ children }: { children: React.ReactNode }) {
  const { session, perfil, cargando } = useAuth();
  const ruta = usePathname();
  if (PUBLICAS.includes(ruta)) return <>{children}</>;
  if (cargando) return <div className="min-h-screen grid place-items-center text-muted" role="status">Cargando…</div>;
  if (!session) return <LoginScreen />;
  if (!perfil) return <ActivarCuenta />;
  return <AppShell>{children}</AppShell>;
}
