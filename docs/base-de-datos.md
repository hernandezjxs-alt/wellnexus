# Wellnexus – base de datos y archivos (actualizado 2026-10-25)

## Decisiones del usuario
- No se crea repositorio en GitHub todavía.
- Plunger lift confirmado (junto a BES, BCP, gas lift, bombeo mecánico, hidráulico).
- No pagar nada por ahora; usar plataformas a las que Claude tenga acceso por conector.

## Conectores disponibles (revisado 2026-10-25)
| Plataforma | Estado | Uso |
|---|---|---|
| Supabase | Conectado y activo | Base de datos PostgreSQL (plan gratis: 500 MB BD, 1 GB archivos, 2 proyectos activos, se pausa tras 1 semana sin uso) |
| Cloudflare (Developer Platform) | Existe, NO instalado | R2 (10 GB gratis) se podría operar desde Claude si el usuario lo conecta; hay que confirmar que incluya R2 |
| Neon | Existe, NO instalado | PostgreSQL + almacenamiento de objetos |
| MongoDB Atlas | Existe, NO instalado | Base NoSQL con clúster gratis; mal ajuste para datos relacionales de pozos |
| Firebase | No hay conector | Claude no puede operarlo directamente |

## Firebase (plan Spark, sin tarjeta)
- Firestore 1 GiB; Cloud Storage 5 GB (solo buckets en us-central1, us-west1, us-east1); Hosting 10 GB.
- Firestore es NoSQL: poco adecuado para datos relacionales de ingeniería (pozo → revestimiento → tubería → mandriles) y consultas cruzadas.
- Sin conector: no recomendado para Wellnexus ahora.

## Propuesta actual (gratis)
- Datos de fichas: Supabase gratis, esquema `wellnexus` (PostgreSQL).
- Originales (~3000 Excel/PowerPoint): disco local o Drive por ahora; luego R2 (10 GB gratis) al conectar Cloudflare.
- Para clientes con red cerrada: PostgreSQL en Docker.
- Series de tiempo (módulo Live): más adelante (TimescaleDB).
- Pendiente: elegir proyecto Supabase para el esquema (`bitacora-hh` o `biblioteca-pdf`).

Precios de las páginas oficiales consultadas el 2026-10-25; verificar antes de contratar.
