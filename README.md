# Respaldo – Proyecto Wellnexus
Fecha: 2026-10-25 · Autor: Jesús Hernández (Jesush)

## Qué es
Súper aplicación web para la industria petrolera que replica y mejora Centinela (fichas de pozo de PDVSA, ~1500 Excel + ~1500 PowerPoint) e integra en una sola interfaz moderna:
1. Fichas de pozo / repositorio de datos (>1 GB)
2. Análisis de producción tipo OFM
3. Simulación tipo PIPESIM/WellFlo: análisis nodal, gas lift continuo e intermitente, bombeo mecánico, BES, BCP, todas las correlaciones de flujo con ajuste manual interactivo
4. Editor de diagramas mecánicos de pozo (exporta a PDF/PowerPoint)
5. Integración de INTER 1.1 (gas lift intermitente) y GW Basic
6. IA – "RAP moderno": diagnóstico por foto/escaneo de discos de gas lift, discos digitales, tiempo real en mapa interactivo
7. Simulación de redes mono y multifásicas (tipo PIPESIM Net / Weatherford ReO)
8. Alertas
9. Análisis BI
10. Reportería
11. Gestión de personal / organigrama (Yacimientos, Optimización, BI, Control y Monitoreo con IA)

## Stack propuesto
Postgres (Neon/Supabase Pro) + TimescaleDB · Cloudflare R2 (archivos) · FastAPI (Python: pandas, openpyxl, python-pptx, SciPy/NumPy) · Next.js + Tailwind + shadcn · Plotly/Recharts/D3 · MapLibre · Konva/React Flow · MQTT/OPC-UA · OpenCV (fotos de discos).

## Límites legales acordados
- No se extrae código, librerías ni fórmulas internas de simuladores comerciales (WellFlo, PIPESIM, ISIS), aunque sean versiones viejas. Se construye con literatura pública y se valida comparando resultados que tú aportes.
- "Centinela" es marca de PDVSA: la plataforma debe ser independiente.

## Nombre
Elegido: **Wellnexus** (riesgo medio de marca: similar a Wellnex / Wellnex Life). Descartados: Wellhub, Welltrix, Centinel Wells.
Pendiente: consulta INAPI (Chile), SAPI (Venezuela), dominios y abogado de marcas.

## Logotipo – DEFINITIVO: versión 4 (Acero y cielo) y versión 5 (variante Venezuela)
Paleta: Pizarra #17212F · Azul acero #3E6A94 · Celeste #7DD3FC · Gris niebla #E6ECF2 · (v5 suma Amarillo #FFCC00 y Rojo #E5394B). Tipografía: Sora. Archivos finales en carpeta `logos-definitivos/` (SVG con texto en curvas + PNG).

Versiones exploradas (descartadas):
| Versión | Colores |
|---|---|
| 1 Índigo y menta | Tinta #101528 · Índigo #4F46E5 · Menta #34D399 · Lavanda #E0E7FF |
| 2 Grafito y coral | Grafito #1C1F24 · Coral #FF6B4A · Arena #F4EEE6 · Niebla #D9CFC1 |
| 3 Bosque y lima | Bosque #0F3D3E · Lima #C6F432 · Bruma #EAF2EE · Carbón #12201F |
Primera versión descartada: navy #0B1F33 / teal #14B8A6 / ámbar #F5A524. Tricolor Venezuela también descartado (colores no gustaron).
Fuentes editables: `logos/` (v4, v5 y módulos) y `logotipo/explorados/` (versiones descartadas).

## Enlaces (cuenta claude.ai)
- Propuesta del proyecto (Claude Doc): https://claude.ai/artifact/VJhMtWyhvctwSjyyLFG24W
- Lienzo de logotipos: https://claude.ai/artifact/AaWqzaozVFQKfrPfYopu19

## Pendiente / siguiente
1. Logo definido (versiones 4 y 5).
2. Aportar: manual de Centinela con fotos (RAP), fichas Excel/PPT de ejemplo, fotos de discos con diagnóstico, resultados de simulador para validar.
3. Plan de prioridades y primera versión demostrable (MVP: fichas de pozo + carga masiva).
4. Verificación de marca.
