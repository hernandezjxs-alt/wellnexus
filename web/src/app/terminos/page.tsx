import Link from "next/link";

export default function Page() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl">Términos de uso</h1>
      <p className="text-muted mt-1 text-sm">Borrador, octubre 2026. Debe revisarlo un abogado antes de vender la plataforma.</p>
      <div className="mt-5 flex flex-col gap-3">
        <p>Wellnexus es una plataforma de ingeniería de pozos y producción elaborada por JH. Todos los derechos reservados.</p>
        <p>Al crear una cuenta guardamos tu nombre, tu correo y la fecha en que aceptaste estos textos. No vendemos tus datos. Los datos de pozos que cargues quedan visibles solo para ti y para los administradores de tu organización.</p>
        <p>Los resultados de simulación y diagnóstico son una ayuda y no reemplazan el criterio de un ingeniero.</p>
      </div>
      <Link href="/" className="inline-block mt-6 text-accent-text underline">Volver</Link>
    </main>
  );
}
