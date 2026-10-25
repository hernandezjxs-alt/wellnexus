import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Gate } from "@/components/gate";
import { PwaRegister } from "@/components/pwa";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Wellnexus",
  description: "Plataforma de ingeniería de pozos y producción: fichas, análisis, simulación, diagramas e IA.",
  icons: { icon: `${base}/icons/icon-192.png`, apple: `${base}/icons/apple-touch-icon.png` },
  appleWebApp: { capable: true, title: "Wellnexus", statusBarStyle: "default" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#3E6A94" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <PwaRegister>
          <AuthProvider>
            <Gate>{children}</Gate>
          </AuthProvider>
        </PwaRegister>
      </body>
    </html>
  );
}
