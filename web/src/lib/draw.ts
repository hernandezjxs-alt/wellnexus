import { DrawWell, METODOS, fmt, odLabel } from "./pozo";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
type Comp = { d: number; t: string; sub: string; ax: number };
export type DrawResult = { svg: string; comps: Comp[] };

/** Diagrama mecánico a escala de profundidad. Devuelve SVG como texto (todos los textos pasan por esc). */
export function drawWell(w: DrawWell, metodo: string, showL: boolean, showP: boolean): DrawResult {
  const W = 600, H = 730, top = 100, bot = 670, cx = 215;
  const maxD = Math.ceil((w.prof * 1.04) / 500) * 500;
  const Y = (d: number) => top + (d / maxD) * (bot - top);
  const cw = (od: number) => 12 + od * 8, tw = w.tbgOd * 5 + 4;
  const special = metodo === "bes" || metodo === "bcp";
  const tb = w.tb, tbBase = special ? w.pump : tb, pump = w.pump;
  const comps: Comp[] = [];
  const casAt = (d: number) => w.casings.filter((c) => c.od < 20 && d >= c.top && d <= c.base).pop() ?? w.casings[Math.min(2, w.casings.length - 1)];
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagrama mecánico del pozo ${esc(w.id)}, ${esc(METODOS[metodo] ?? metodo)}" style="width:100%;min-width:560px;height:auto;display:block"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="var(--steel)" stroke-width="2"/></pattern></defs>`;
  const step = maxD > 6000 ? 2000 : 1000;
  s += `<text class="ax" x="64" y="${top - 12}" text-anchor="end">Prof. (ft)</text><line x1="64" x2="64" y1="${top}" y2="${bot}" stroke="var(--line)"/>`;
  for (let d = 0; d <= maxD; d += step) s += `<line x1="58" x2="64" y1="${Y(d)}" y2="${Y(d)}" stroke="var(--muted)"/><text class="ax" x="52" y="${Y(d) + 4}" text-anchor="end">${fmt(d)}</text>`;
  s += `<rect x="${cx - 146}" y="${top}" width="292" height="${bot - top}" fill="var(--earth)"/>`;
  w.casings.forEach((c) => {
    const x = cx - cw(c.od) / 2, y1 = Y(c.top), y2 = Y(c.base);
    s += `<rect x="${x}" y="${y1}" width="${cw(c.od)}" height="${y2 - y1}" fill="var(--bore)" stroke="var(--steel)" stroke-width="3"/><rect x="${x - 3}" y="${y2 - 5}" width="9" height="5" fill="var(--steel)"/><rect x="${x + cw(c.od) - 6}" y="${y2 - 5}" width="9" height="5" fill="var(--steel)"/>`;
    comps.push({ d: c.base, t: `${c.t} ${odLabel(c.od)}`, sub: `${fmt(c.top)} a ${fmt(c.base)} ft`, ax: x + cw(c.od) + 3 });
  });
  s += `<line x1="${cx - 146}" x2="${cx + 146}" y1="${Y(w.prof)}" y2="${Y(w.prof)}" stroke="var(--muted)" stroke-dasharray="4 4"/><text class="ax" x="${cx - 140}" y="${Y(w.prof) - 4}">TD ${fmt(w.prof)}</text>`;
  s += `<rect x="${cx - tw / 2}" y="${top}" width="${tw}" height="${Y(tbBase) - top}" fill="var(--bore2)" stroke="var(--tubstroke)" stroke-width="2.5"/>`;
  comps.push({ d: tbBase * 0.5, t: `Tubería ${odLabel(w.tbgOd)}`, sub: `0 a ${fmt(tbBase)} ft`, ax: cx + tw / 2 });
  if (showP)
    w.perf.forEach((p) => {
      const lw = cw(7);
      for (let y = Y(p[0]); y <= Y(p[1]); y += 7) s += `<path d="M${cx - lw / 2},${y} l-13,-3 M${cx + lw / 2},${y} l13,-3" stroke="var(--perf)" stroke-width="2"/>`;
      comps.push({ d: (p[0] + p[1]) / 2, t: "Intervalo cañoneado", sub: `${fmt(p[0])} a ${fmt(p[1])} ft`, ax: cx + cw(7) / 2 + 13 });
    });
  const pk = () => {
    const pw = cw(casAt(w.pkr).od), y = Y(w.pkr);
    s += `<rect x="${cx - pw / 2 + 1.5}" y="${y}" width="${pw / 2 - tw / 2 - 1.5}" height="13" fill="var(--pk)"/><rect x="${cx + tw / 2}" y="${y}" width="${pw / 2 - tw / 2 - 1.5}" height="13" fill="var(--pk)"/>`;
    comps.push({ d: w.pkr, t: "Empacadura", sub: `${fmt(w.pkr)} ft`, ax: cx + pw / 2 - 1.5 });
  };
  const mandriles = () =>
    w.mand.forEach((m, i) => {
      const y = Y(m), op = i === w.mand.length - 1;
      s += `<rect x="${cx + tw / 2}" y="${y - 8}" width="12" height="16" fill="var(--pk)" stroke="var(--tubstroke)" stroke-width="1"/><circle cx="${cx + tw / 2 + 6}" cy="${y}" r="3.6" fill="${op ? "var(--c2)" : "var(--sky)"}" stroke="var(--tubstroke)" stroke-width=".8"/>`;
      comps.push({ d: m, t: `Mandril ${i + 1}`, sub: `${op ? "Válvula operadora" : "Válvula de descarga"} · ${fmt(m)} ft`, ax: cx + tw / 2 + 12 });
    });
  const gas = () => {
    s += `<path d="M${cx - 110},${top - 18} H${cx - 16}" stroke="var(--c2)" stroke-width="3"/><path d="M${cx - 24},${top - 24} l9,6 l-9,6z" fill="var(--c2)"/><text class="lbl2" x="${cx - 110}" y="${top - 26}">Gas de inyección</text>`;
  };
  s += `<rect x="${cx - 16}" y="${top - 26}" width="32" height="26" fill="var(--steel)"/><rect x="${cx - 6}" y="${top - 62}" width="12" height="38" fill="var(--steel)"/><rect x="${cx + 6}" y="${top - 50}" width="44" height="9" fill="var(--steel)"/><line x1="${cx - 146}" x2="${cx + 146}" y1="${top}" y2="${top}" stroke="var(--steel)" stroke-width="2.5"/>`;
  if (metodo === "gas_lift_continuo" || metodo === "gas_lift_intermitente") {
    gas(); pk(); mandriles();
    if (metodo === "gas_lift_intermitente") {
      s += `<circle cx="${cx}" cy="${Y(tb) - 6}" r="${tw / 2 - 3}" fill="var(--c2)" stroke="var(--tubstroke)"/>`;
      comps.push({ d: tb, t: "Válvula fija", sub: `${fmt(tb)} ft`, ax: cx + tw / 2 });
    }
  }
  if (metodo === "flujo_natural") {
    pk();
    const y = Y(tb * 0.55);
    s += `<rect x="${cx - tw / 2 - 3}" y="${y}" width="${tw + 6}" height="14" fill="var(--pk)"/><line x1="${cx - tw / 2}" x2="${cx + tw / 2}" y1="${y + 7}" y2="${y + 7}" stroke="var(--bore)" stroke-width="2" stroke-dasharray="3 3"/>`;
    comps.push({ d: tb * 0.55, t: "Camisa deslizante", sub: `${fmt(tb * 0.55)} ft`, ax: cx + tw / 2 + 3 });
    s += `<rect x="${cx - tw / 2 - 2}" y="${Y(tb) - 6}" width="${tw + 4}" height="6" fill="var(--steel)"/>`;
    comps.push({ d: tb, t: "Niple de asiento", sub: `${fmt(tb)} ft`, ax: cx + tw / 2 });
  }
  if (metodo === "bombeo_mecanico") {
    const y = Y(pump);
    s += `<rect x="60" y="${top - 12}" width="96" height="9" fill="var(--steel)"/><polygon points="96,${top - 12} 120,${top - 12} 108,${top - 62}" fill="var(--steel)"/><path d="M64,${top - 80} L${cx},${top - 64}" stroke="var(--steel)" stroke-width="6" stroke-linecap="round"/><circle cx="108" cy="${top - 62}" r="5" fill="var(--bore)" stroke="var(--steel)" stroke-width="2"/>`;
    s += `<line x1="${cx}" x2="${cx}" y1="${top - 64}" y2="${y}" stroke="var(--steel)" stroke-width="2"/><rect x="${cx - tw / 2 + 3}" y="${y}" width="${tw - 6}" height="40" fill="var(--pump)" stroke="var(--tubstroke)"/><rect x="${cx - 3}" y="${y + 10}" width="6" height="20" fill="var(--tubstroke)"/><rect x="${cx - tw / 2 - 1}" y="${Y(tb) - 10}" width="${tw + 2}" height="10" fill="var(--steel)"/>`;
    comps.push({ d: pump + 20, t: "Bomba de subsuelo", sub: `${fmt(pump)} ft`, ax: cx + tw / 2 - 3 }, { d: pump * 0.45, t: "Sarta de cabillas", sub: `0 a ${fmt(pump)} ft`, ax: cx + 1 }, { d: tb, t: "Ancla de gas", sub: `${fmt(tb)} ft`, ax: cx + tw / 2 + 1 });
  }
  if (metodo === "bes") {
    const y = Y(pump), sx = cx - 17;
    s += `<rect x="${cx + tw / 2 + 4}" y="${top - 40}" width="26" height="22" fill="var(--steel)"/><path d="M${cx + tw / 2 + 17},${top - 18} V${y + 60}" stroke="var(--cable)" stroke-width="3" fill="none"/>`;
    const partes: [string, number, string][] = [["Bomba centrífuga", 38, "var(--pump)"], ["Succión", 10, "var(--sky)"], ["Sello protector", 24, "var(--pk)"], ["Motor", 44, "var(--c2)"]];
    let yy = y;
    partes.forEach((p, i) => {
      s += `<rect x="${sx}" y="${yy}" width="34" height="${p[1]}" fill="${p[2]}" stroke="var(--tubstroke)" stroke-width="1.2"/>`;
      comps.push({ d: pump + ((yy - y) + p[1] * 0.5) * (maxD / (bot - top)), t: p[0], sub: i === 0 ? `${fmt(pump)} ft` : "", ax: sx + 34 });
      yy += p[1];
    });
  }
  if (metodo === "bcp") {
    const y = Y(pump);
    s += `<rect x="${cx - 20}" y="${top - 78}" width="40" height="26" fill="var(--steel)"/><rect x="${cx + 20}" y="${top - 72}" width="26" height="14" fill="var(--c2)"/><line x1="${cx}" x2="${cx}" y1="${top - 52}" y2="${y + 80}" stroke="var(--steel)" stroke-width="2"/>`;
    s += `<rect x="${cx - 15}" y="${y}" width="30" height="76" fill="url(#hatch)" stroke="var(--tubstroke)" stroke-width="1.5"/><path d="M${cx},${y + 4} q8,6 0,12 t0,12 t0,12 t0,12 t0,12" stroke="var(--c2)" stroke-width="3" fill="none"/><rect x="${cx - 9}" y="${y + 76}" width="18" height="10" fill="var(--steel)"/>`;
    comps.push({ d: pump + 30, t: "Estator y rotor", sub: `${fmt(pump)} ft`, ax: cx + 15 }, { d: pump * 0.45, t: "Sarta de cabillas", sub: `0 a ${fmt(pump)} ft`, ax: cx + 1 }, { d: pump + 90, t: "Niple de paro", sub: "", ax: cx + 9 });
  }
  if (metodo === "plunger_lift") {
    const ys = Y(tb);
    s += `<rect x="${cx - 9}" y="${top - 96}" width="18" height="36" fill="var(--steel)"/><path d="M${cx - 9},${top - 96} h18" stroke="var(--c2)" stroke-width="4"/>`;
    s += `<path d="M${cx - 6},${ys - 26} l12,3 l-12,3 l12,3 l-12,3 l12,3 l-12,3" stroke="var(--tubstroke)" stroke-width="2" fill="none"/><rect x="${cx - tw / 2 + 3}" y="${ys - 52}" width="${tw - 6}" height="24" fill="var(--c2)" stroke="var(--tubstroke)"/><line x1="${cx - tw / 2 + 3}" x2="${cx + tw / 2 - 3}" y1="${ys - 44}" y2="${ys - 44}" stroke="var(--tubstroke)"/><line x1="${cx - tw / 2 + 3}" x2="${cx + tw / 2 - 3}" y1="${ys - 36}" y2="${ys - 36}" stroke="var(--tubstroke)"/><rect x="${cx - tw / 2 - 2}" y="${ys - 6}" width="${tw + 4}" height="6" fill="var(--steel)"/>`;
    comps.push({ d: tb - 130, t: "Émbolo (plunger)", sub: "", ax: cx + tw / 2 - 3 }, { d: tb - 60, t: "Resorte amortiguador", sub: `${fmt(tb - 60)} ft`, ax: cx + 6 }, { d: tb, t: "Válvula fija", sub: `${fmt(tb)} ft`, ax: cx + tw / 2 }, { d: -80, t: "Lubricador", sub: "En superficie", ax: cx + 9 });
  }
  comps.sort((a, b) => a.d - b.d);
  const ly = comps.map((c) => (c.d < 0 ? 30 : Y(c.d)));
  for (let i = 1; i < ly.length; i++) ly[i] = Math.max(ly[i], ly[i - 1] + 30);
  for (let i = ly.length - 2; i >= 0; i--) ly[i] = Math.min(ly[i], ly[i + 1] - 30);
  if (showL)
    comps.forEach((c, i) => {
      const y0 = c.d < 0 ? top - 70 : Y(c.d);
      s += `<path d="M${c.ax},${y0} L${cx + 156},${y0} L382,${ly[i]}" stroke="var(--muted)" stroke-width="1" fill="none"/><circle cx="${c.ax}" cy="${y0}" r="2.4" fill="var(--fg)"/><text class="lbl" x="388" y="${ly[i] + 1}">${esc(c.t)}</text>${c.sub ? `<text class="lbl2" x="388" y="${ly[i] + 14}">${esc(c.sub)}</text>` : ""}`;
    });
  return { svg: s + "</svg>", comps };
}
