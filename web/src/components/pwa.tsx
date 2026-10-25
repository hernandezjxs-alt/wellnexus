"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/supabase";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const Ctx = createContext<{ instalable: BIPEvent | null; instalada: boolean }>({ instalable: null, instalada: false });
export const usePwa = () => useContext(Ctx);

/** Registra el service worker y guarda el evento de instalación para el botón de la barra. */
export function PwaRegister({ children }: { children?: React.ReactNode }) {
  const [instalable, setInstalable] = useState<BIPEvent | null>(null);
  const [instalada, setInstalada] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {});
    setInstalada(matchMedia("(display-mode: standalone)").matches);
    const f = (e: Event) => { e.preventDefault(); setInstalable(e as BIPEvent); };
    const ok = () => { setInstalada(true); setInstalable(null); };
    window.addEventListener("beforeinstallprompt", f);
    window.addEventListener("appinstalled", ok);
    return () => { window.removeEventListener("beforeinstallprompt", f); window.removeEventListener("appinstalled", ok); };
  }, []);
  return <Ctx.Provider value={{ instalable, instalada }}>{children}</Ctx.Provider>;
}
