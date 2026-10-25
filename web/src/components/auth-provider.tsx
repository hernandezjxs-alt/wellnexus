"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BASE_PATH, supabase } from "@/lib/supabase";

export type Perfil = { id: string; nombre: string | null; rol: "admin" | "user" };
type Ctx = {
  session: Session | null;
  perfil: Perfil | null;
  cargando: boolean;
  esAdmin: boolean;
  entrar: (correo: string, clave: string) => Promise<string | null>;
  registrar: (nombre: string, correo: string, clave: string) => Promise<string | null>;
  recuperar: (correo: string) => Promise<string | null>;
  salir: () => Promise<void>;
  activar: (nombre: string) => Promise<string | null>;
};
const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth fuera de AuthProvider");
  return c;
};

const MENSAJES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed": "Falta confirmar tu correo. Revisa tu bandeja de entrada.",
  "User already registered": "Ya existe una cuenta con ese correo. Ingresa o recupera tu contraseña.",
  "Password should be at least 6 characters.": "La contraseña debe tener al menos 8 caracteres.",
};
const traducir = (m: string) => MENSAJES[m] ?? (/rate limit/i.test(m) ? "Se enviaron demasiados correos en poco tiempo. Espera unos minutos e intenta de nuevo." : m);
const redirect = () => `${window.location.origin}${BASE_PATH}/`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setCargando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) { setPerfil(null); setCargando(false); }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const uid = session?.user.id;
  const cargarPerfil = useCallback(async () => {
    if (!uid) return;
    const { data } = await supabase.from("perfil").select("id,nombre,rol").eq("id", uid).maybeSingle();
    setPerfil((data as Perfil) ?? null);
    setCargando(false);
  }, [uid]);
  useEffect(() => { cargarPerfil(); }, [cargarPerfil]);

  const activar = useCallback(async (nombre: string) => {
    const { error } = await supabase.rpc("activar_cuenta", { p_nombre: nombre, p_consentimiento: true });
    if (error) return error.code === "PGRST106" || /schema/i.test(error.message) ? "Falta activar el esquema wellnexus en Supabase (Settings → API → Exposed schemas)." : error.message;
    await cargarPerfil();
    return null;
  }, [cargarPerfil]);

  const entrar = useCallback(async (correo: string, clave: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
    return error ? traducir(error.message) : null;
  }, []);
  const registrar = useCallback(async (nombre: string, correo: string, clave: string) => {
    const { error } = await supabase.auth.signUp({
      email: correo, password: clave,
      options: { emailRedirectTo: redirect(), data: { app: "wellnexus", full_name: nombre, consent: "true" } },
    });
    return error ? traducir(error.message) : null;
  }, []);
  const recuperar = useCallback(async (correo: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(correo, { redirectTo: redirect() });
    return error ? traducir(error.message) : null;
  }, []);
  const salir = useCallback(async () => { await supabase.auth.signOut(); }, []);

  const valor = useMemo(() => ({ session, perfil, cargando, esAdmin: perfil?.rol === "admin", entrar, registrar, recuperar, salir, activar }), [session, perfil, cargando, entrar, registrar, recuperar, salir, activar]);
  return <AuthCtx.Provider value={valor}>{children}</AuthCtx.Provider>;
}
