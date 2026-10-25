"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { POZO_SELECT, PozoDB } from "./pozo";

export function usePozos() {
  const [pozos, setPozos] = useState<PozoDB[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recargar = useCallback(async () => {
    const { data, error } = await supabase.from("pozo").select(POZO_SELECT).order("nombre");
    if (error) {
      setError(error.code === "PGRST106" || /schema/i.test(error.message)
        ? "Falta activar el esquema wellnexus en Supabase (Project Settings → API → Exposed schemas)."
        : error.message);
      setPozos([]);
    } else {
      setError(null);
      setPozos((data ?? []) as unknown as PozoDB[]);
    }
  }, []);
  useEffect(() => { recargar(); }, [recargar]);
  return { pozos, error, recargar };
}
