# Wellnexus – tecnología de toda la plataforma

## 1. Formas de entregar la plataforma
| Forma | Qué es | Para Wellnexus |
|---|---|---|
| Aplicación web | Se abre en el navegador, sin instalar | Principal. Un solo código para PC, tablet y celular. Fácil de vender por suscripción |
| PWA | La web instalable en el celular, con modo sin conexión | Recomendada para campo: tomar foto del disco y sincronizar luego |
| Aplicación de escritorio | Programa instalable (Electron o Tauri) | Solo si un cliente pide instalarla en su red cerrada |
| Aplicación móvil nativa | App de tienda (Flutter o React Native) | Más adelante, si hace falta cámara o sensores avanzados |
| Instalación en servidor del cliente (on-premise) | La plataforma corre en el servidor de la empresa | Importante para petroleras con datos confidenciales; se resuelve con contenedores Docker |

## 2. Arquitectura por capas
1. Interfaz (lo que ve el usuario).
2. API / servidor (reglas y seguridad).
3. Motores de cálculo (simulación, redes, IA).
4. Datos (base de datos, archivos, series de tiempo).
5. Infraestructura (dónde corre, respaldos, usuarios).

Forma de construirlo: un monolito modular al inicio (un solo servidor con módulos separados por dentro). Se separa en servicios solo cuando el tamaño lo exija.

## 3. Lenguajes y herramientas por capa
| Capa | Lenguaje | Herramientas |
|---|---|---|
| Interfaz | TypeScript | Next.js, React, Tailwind, shadcn/ui |
| Gráficas | TypeScript | Plotly o Recharts (curvas), D3 (ajuste interactivo), MapLibre (mapas) |
| Diagramas y redes | TypeScript | SVG (pozo a escala), Konva (edición), React Flow (redes y organigrama) |
| API y lógica | Python | FastAPI, Pydantic |
| Cálculo de ingeniería | Python | NumPy, SciPy, pandas |
| Carga masiva Excel y PowerPoint | Python | openpyxl, pandas, python-pptx |
| IA y fotos de discos | Python | OpenCV, PyTorch o modelos de visión por API |
| Tiempo real | Python / TypeScript | MQTT u OPC-UA, WebSockets |
| Base de datos | SQL | PostgreSQL, TimescaleDB (series de tiempo) |
| Archivos | — | Cloudflare R2 (Excel, PowerPoint, fotos) |
| Infraestructura | — | Docker, Vercel/Railway/Fly.io, GitHub Actions |

## 4. Qué usa cada módulo
| Módulo | Interfaz | Motor | Datos |
|---|---|---|---|
| Core (fichas) | Tablas y formularios | Python (carga masiva) | PostgreSQL + R2 |
| Insight (OFM) | Plotly, MapLibre | pandas, SciPy | PostgreSQL / Timescale |
| Flow (nodal) | D3 + Plotly | SciPy (IPR, PVT, correlaciones) | PostgreSQL |
| Lift | Formularios + gráficas | Python (gas lift, BES, PCP, bombeo) | PostgreSQL |
| Net (redes) | React Flow | SciPy (balance de red) | PostgreSQL |
| Draw (diagramas) | SVG + Konva | python-pptx, reportlab (exportar) | PostgreSQL + R2 |
| AI (discos) | Cámara, PWA | OpenCV + visión | R2 + PostgreSQL |
| Live (tiempo real) | Mapa en vivo | MQTT/OPC-UA | TimescaleDB |
| Alert | Notificaciones | Reglas en Python | PostgreSQL |
| BI / Report | Tableros | pandas, reportlab | PostgreSQL |
| Team | Organigrama (React Flow) | — | PostgreSQL |

## 5. Por qué esta combinación
- Una sola interfaz web para todo, que funciona en celular y PC.
- Python donde está la ingeniería y los datos (lo que ya manejas).
- TypeScript para evitar errores en la interfaz.
- PostgreSQL como base única: crece más allá de 1 GB sin cambiar de tecnología.
