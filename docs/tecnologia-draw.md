# Wellnexus Draw – formas de dibujar y lenguajes de programación

## 1. Formas de construir el diagrama

| Forma | Qué es | Bueno para | Límite |
|---|---|---|---|
| SVG en React (como la v5) | Dibujo vectorial dentro de la página | Escala exacta, texto nítido, exporta fácil | Se vuelve lento con miles de elementos |
| Canvas con Konva | Dibujo por píxeles, con objetos arrastrables | Editor: mover, redimensionar, deshacer | Menos nítido al exportar; hay que exportar aparte |
| React Flow | Nodos y líneas conectadas | Redes de producción (módulo Net), organigrama | No sirve para dibujar el pozo a escala |
| WebGL / Three.js | Gráficos 3D | Trayectoria 3D de pozos desviados | Demasiado para la primera versión |
| Generación en servidor (Python) | El servidor arma el PDF o PowerPoint | Reportes oficiales, PowerPoint editable | Necesita backend |

Recomendación: SVG + React para el dibujo a escala (primera versión), Konva más adelante para arrastrar equipos, y exportación en el servidor.

## 2. Lenguajes

| Lenguaje | Dónde | Por qué |
|---|---|---|
| TypeScript | Interfaz web (Next.js + React) | Es JavaScript con tipos: avisa errores antes de abrir la app (como los diámetros mal leídos de la v5) |
| Python | Servidor (FastAPI), cálculos, carga masiva | SciPy/NumPy para ingeniería, pandas/openpyxl/python-pptx para tus Excel y PowerPoint, OpenCV para fotos de discos. Ya lo usas |
| SQL | Base de datos PostgreSQL | Guardar pozos, fichas y componentes |

Para después, solo si hace falta: Rust compilado a WebAssembly para cálculos muy pesados.

## 3. Exportación
- PDF: servidor Python (reportlab o cairosvg), vectorial y con logo.
- PowerPoint: python-pptx con formas editables (no una imagen), como los diagramas de PDVSA.
- Imagen/SVG: directo desde el navegador.
