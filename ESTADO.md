# Estado del proyecto (2026-10-25, noche)

App publicada: https://hernandezjxs-alt.github.io/wellnexus/ (Next.js + Supabase, publicada con GitHub Actions, workflow manual "Publicar Wellnexus").

## Hecho
- Repositorio público `hernandezjxs-alt/wellnexus` con README de los 12 módulos, docs, logos v4/v5 y prototipo HTML (`prototipo/`).
- App real en `web/` (Next.js 16, React 19, TypeScript, Tailwind 4, lucide): ingreso, activar cuenta, inicio con tarjetas de módulos, Core, Draw, usuarios, etiquetas, avisos, contacto, tema, v4/v5, PWA.
- Base de datos en Supabase, proyecto `bitacora-hh`, esquema `wellnexus`: pozo, revestimiento, tuberia, empacadura, mandril, intervalo, equipo_fondo, perfil, pozo_usuario, categoria, mensaje_contacto, aviso. Todas con RLS. Función `activar_cuenta` para activar un correo ya existente.
- Sesión propia (`wellnexus-auth`), distinta de Bitácora.

## Pendiente / por revisar mañana
1. El usuario reporta que "no funciona" (sin detalle). Revisar primero: ¿esquema `wellnexus` expuesto en Supabase (Project Settings → API → Exposed schemas)? ¿Redirect URL `https://hernandezjxs-alt.github.io/wellnexus/**` en Authentication → URL Configuration? Pedir captura del error.
2. Probar de punta a punta con cuenta real: ingresar, activar cuenta (queda admin), cargar pozos de ejemplo en Core, ver Draw.
3. Portar Insight y Flow desde `prototipo/index.html` a `web/`.
4. Asignación de pozos por usuario (tabla `pozo_usuario` ya creada, falta pantalla).
5. Correos por Resend para avisos (requiere cuenta y clave del usuario como secreto, nunca en el repositorio).
6. Activar protección contra contraseñas filtradas en Supabase Auth.
7. Exportar Draw a PDF y PowerPoint; carga masiva de Excel/PowerPoint.
8. Verificación de marca Wellnexus (INAPI, SAPI, dominios, abogado) y revisar Términos y Privacidad con abogado.

## Decisiones del usuario
- Gratis por ahora; sin pausar proyectos de Supabase; cuentas compartidas con Bitácora pero sesiones, roles y datos separados.
- Pedir permiso antes de actuar; dar el link al final de cada cambio.
- Inicio con tarjetas grandes de módulos, sin barra lateral.
