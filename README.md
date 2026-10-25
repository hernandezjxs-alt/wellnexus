# Wellnexus

**Súper aplicación web para ingeniería de pozos y producción petrolera.**
Reúne en una sola interfaz moderna lo que hoy está repartido en fichas de Excel y PowerPoint, simuladores y herramientas sueltas: datos de pozo, análisis de producción, simulación, diagramas mecánicos, diagnóstico con IA, redes, alertas, BI, reportes y organigrama.

- Autor: Jesús Hernández (Jesush) · Ingeniero de petróleo, ~15 años en optimización de producción (PDVSA), hoy BI/Data Analyst
- Estado: diseño y arquitectura (2026-10-25). Todavía no hay versión ejecutable.
- Mercado inicial: Venezuela (con variante de marca propia).

## Módulos

| # | Módulo | Qué hace | Referencia |
|---|---|---|---|
| 1 | **Core** | Fichas de pozo: datos, completación, historial, archivos. Carga masiva desde ~1500 Excel y ~1500 PowerPoint | Réplica mejorada de Centinela |
| 2 | **Insight** | Análisis de producción: curvas de declinación, mapas de burbujas, comparación de pozos | Tipo OFM |
| 3 | **Flow** | Simulación y análisis nodal (IPR/VLP, PVT, todas las correlaciones de flujo con ajuste manual interactivo) | Tipo PIPESIM / WellFlo |
| 4 | **Lift** | Levantamiento artificial: gas lift continuo e intermitente, bombeo mecánico, BES, BCP, plunger lift, hidráulico. Integra INTER 1.1 y GW Basic | — |
| 5 | **Net** | Redes de producción mono y multifásicas, balance de red | Tipo PIPESIM Net / ReO |
| 6 | **Draw** | Editor de diagramas mecánicos de pozo a escala, con todas las completaciones. Exporta a PDF y PowerPoint editable | Mejora de `draw/well-completion-v5.jsx` |
| 7 | **AI** | Diagnóstico con IA: "RAP moderno" por foto/escaneo de discos de gas lift y discos digitales | — |
| 8 | **Live** | Tiempo real y mapa interactivo de pozos | MQTT / OPC-UA |
| 9 | **Alert** | Alertas y notificaciones por reglas | — |
| 10 | **BI** | Análisis BI: tableros e indicadores | — |
| 11 | **Report** | Reportería automática (PDF, Excel, PowerPoint) | — |
| 12 | **Team** | Personal y organigrama (Yacimientos, Optimización, BI, Control y Monitoreo con IA) | — |

## Tecnología

| Capa | Elección |
|---|---|
| Interfaz | TypeScript, Next.js, React, Tailwind, shadcn/ui |
| Gráficas y mapas | Plotly / Recharts, D3, MapLibre |
| Diagramas y redes | SVG (pozo a escala), Konva (edición), React Flow (redes y organigrama) |
| API y cálculo | Python, FastAPI, NumPy, SciPy, pandas |
| Carga y exportación | openpyxl, python-pptx, reportlab / cairosvg |
| IA | OpenCV, modelos de visión |
| Base de datos | PostgreSQL (Supabase, esquema `wellnexus`); TimescaleDB para tiempo real más adelante |
| Archivos | Cloudflare R2 (10 GB gratis) |
| Entrega | Web principal, PWA para campo, Docker para instalar en el servidor del cliente |

Arquitectura: monolito modular al inicio; se separa en servicios solo cuando el tamaño lo exija.

Detalle en [`docs/`](docs/): [tecnología de la plataforma](docs/tecnologia-plataforma.md) · [tecnología de Draw](docs/tecnologia-draw.md) · [base de datos](docs/base-de-datos.md).

## Estructura del repositorio

```
README.md
docs/    Decisiones técnicas
draw/    Diagrama de completación actual (v5), base de Wellnexus Draw
logos/   Logotipo v4 y v5 (SVG y PNG) y láminas de módulos
```

## Marca

Versión 4 "Acero y cielo" y versión 5 (variante Venezuela). Tipografía Sora.

| Color | Hex |
|---|---|
| Pizarra | `#17212F` |
| Azul acero | `#3E6A94` |
| Celeste | `#7DD3FC` |
| Gris niebla | `#E6ECF2` |
| Amarillo (solo v5) | `#FFCC00` |
| Rojo (solo v5) | `#E5394B` |

## Hoja de ruta

1. Esquema de base de datos de fichas (hecho, en Supabase).
2. **Draw**: arreglar los errores de la v5 y sumar todas las completaciones, con PDF y PowerPoint.
3. **Core**: fichas de pozo y carga masiva de Excel/PowerPoint (primera versión demostrable).
4. Insight, Flow y Lift.
5. Net, AI, Live, Alert, BI, Report y Team.

## Límites legales

- No se extrae código, librerías ni fórmulas internas de simuladores comerciales (WellFlo, PIPESIM, ISIS). Se construye con literatura pública y se valida comparando contra resultados que aporte el autor.
- "Centinela" es marca de PDVSA: Wellnexus es independiente.
- Los originales de Centinela (Excel, PowerPoint, fotos de discos) no se suben a este repositorio.
- Pendiente: verificación de marca "Wellnexus" (INAPI Chile, SAPI Venezuela, dominios, abogado).
