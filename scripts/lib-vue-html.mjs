// lib-vue-html.mjs — socle partagé des générateurs de vues docs\projet (TF-0091).
// Node pur, zéro dépendance, DÉTERMINISTE : même source → même HTML octet pour octet
// (aucune date générée — verifie_le vient du frontmatter ; sceau = sha256 de la source).
// La vue produite est autonome (A1 : zéro requête réseau) et chartée digit-ai-page-html.
import { createHash } from "node:crypto";

export const esc = (s) => String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function lireSource(texte) {
  const m = texte.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const front = {};
  if (m) for (const l of m[1].split(/\r?\n/)) {
    const kv = l.match(/^(\w[\w_]*)\s*:\s*(.+)$/);
    if (kv) front[kv[1]] = kv[2].trim();
  }
  return { front, corps: m ? texte.slice(m[0].length) : texte };
}

// Mini-rendu MD (sous-ensemble volontaire : titres, tables, listes, citations,
// paragraphes, `code`, **gras**) — tout passe par esc() AVANT les balises (S-C1).
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
export function mdVersHtml(corps) {
  const lignes = corps.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { const n = h[1].length + 1; out.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }
    if (/^\s*\|/.test(l)) {
      const rangs = [];
      while (i < lignes.length && /^\s*\|/.test(lignes[i])) { rangs.push(lignes[i]); i++; }
      const cellules = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const tetes = cellules(rangs[0]);
      const corpsT = rangs.slice(1).filter((r) => !/^\s*\|[\s:|-]+\|?\s*$/.test(r));
      out.push(`<div class="scroll"><table><thead><tr>${tetes.map((t) => `<th scope="col">${inline(t)}</th>`).join("")}</tr></thead><tbody>${
        corpsT.map((r) => `<tr>${cellules(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(l)) {
      const items = [];
      while (i < lignes.length && /^\s*[-*]\s+/.test(lignes[i])) { items.push(lignes[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\s*>\s?/.test(l)) {
      const cit = [];
      while (i < lignes.length && /^\s*>\s?/.test(lignes[i])) { cit.push(lignes[i].replace(/^\s*>\s?/, "")); i++; }
      out.push(`<blockquote><p>${inline(cit.join(" "))}</p></blockquote>`);
      continue;
    }
    const par = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{1,4}\s|\s*\||\s*[-*]\s|\s*>)/.test(lignes[i])) { par.push(lignes[i]); i++; }
    out.push(`<p>${inline(par.join(" "))}</p>`);
  }
  return out.join("\n");
}

// Coquille chartée (tokens du socle, light, print, reduced-motion, favicon data:).
export function coquille({ titre, description, front, svg, corpsHtml, source }) {
  const sceau = createHash("sha256").update(source).digest("hex").slice(0, 12);
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#2563EB">
  <meta name="color-scheme" content="light">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3C/svg%3E">
  <style>
    :root{--blue:#2563EB;--bg:#FAFBFF;--surface:#FFFFFF;--ink:#0F172A;--muted:#64748B;
      --faint:#94A3B8;--line:#E6EAF2;--teal:#0E9488;--teal-fill:#EFFDFB;--amber:#B45309;
      --amber-fill:#FFFBEB;--r:12px;--r-sm:8px;
      --head:"Roboto",system-ui,-apple-system,"Segoe UI",sans-serif;
      --sans:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
      --mono:"JetBrains Mono",ui-monospace,"Consolas",monospace}
    *{box-sizing:border-box} html{-webkit-text-size-adjust:100%}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;font-size:16px}
    /* 75-100 % de la fenêtre, toujours : 92vw en dessous de 1826px, plafond confort 1680px, plancher 75vw au-delà */
    .wrap{max-width:clamp(75vw,1680px,92vw);margin:0 auto;padding:32px 24px 64px}
    /* la prose vit dans une colonne à sa mesure (L2) — tables et figures y défilent en interne */
    .colonne{max-width:75ch;margin:0 auto}
    h1,h2,h3{font-family:var(--head);font-weight:800;line-height:1.2}
    h1{font-size:1.7rem;margin:0 0 .2em} h2{font-size:1.25rem;font-weight:700;margin:1.5em 0 .4em}
    h3{font-size:1.02rem;font-weight:700;margin:1.1em 0 .3em}
    code{font-family:var(--mono);font-size:.9em}
    .meta{color:var(--muted);font-size:.85rem;margin:.2em 0 0;overflow-wrap:anywhere}
    blockquote{margin:14px 0;padding:10px 16px;border-left:3px solid var(--blue);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0;color:var(--muted)}
    blockquote p{margin:0}
    .scroll{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);margin:10px 0}
    table{border-collapse:collapse;width:100%;font-size:.92rem}
    th{font-family:var(--head);font-weight:700;text-align:left;padding:9px 12px;border-bottom:2px solid var(--line)}
    td{padding:7px 12px;border-bottom:1px solid var(--line);vertical-align:top;overflow-wrap:anywhere}
    tr:last-child td{border-bottom:none}
    ul{margin:.4em 0;padding-left:1.3em}
    figure{margin:16px 0;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px;overflow-x:auto}
    figcaption{color:var(--muted);font-size:.85rem;margin-top:8px}
    svg{max-width:100%;height:auto}
    footer{margin-top:40px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:14px;overflow-wrap:anywhere}
    @media (max-width:640px){.wrap{padding:16px 12px 48px} h1{font-size:1.3rem}}
    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @page{margin:14mm}
    @media print{.scroll{overflow:visible;border:none} figure{break-inside:avoid} tr{break-inside:avoid} body{background:#fff}}
  </style>
</head>
<body>
  <div class="wrap"><div class="colonne">
    <header>
      <h1>${esc(titre)}</h1>
      <p class="meta">rôle : ${esc(front.role || "—")} · sources de vérité : <code>${esc(front.sources_de_verite || "—")}</code> · vérifié le ${esc(front.verifie_le || "—")}</p>
    </header>
    <main>
${svg ? `    <figure role="img" aria-label="${esc(svg.label)}">
${svg.corps}
      <figcaption>${esc(svg.legende)}</figcaption>
    </figure>` : ""}
${corpsHtml}
    </main>
    <footer>Vue générée — NE PAS ÉDITER (la source Markdown fait foi ; la régénérer via le script du pilot). Sceau source <code>${sceau}</code>.</footer>
  </div></div>
</body>
</html>
`;
}

// Boîtes SVG en grille + flèches nommées — layout DÉLIBÉRÉMENT simple (pas de moteur
// de graphe) : n boîtes par rangée, flèches droites centre à centre.
export function svgBoites(noeuds, liens, { parRangee = 3, w = 220, h = 64, gx = 60, gy = 56 } = {}) {
  const pos = new Map();
  noeuds.forEach((n, i) => {
    const c = i % parRangee, r = Math.floor(i / parRangee);
    pos.set(n.id, { x: 20 + c * (w + gx), y: 20 + r * (h + gy) });
  });
  const rangs = Math.ceil(noeuds.length / parRangee) || 1;
  const W = 40 + Math.min(noeuds.length, parRangee) * (w + gx) - gx;
  const H = 40 + rangs * (h + gy) - gy;
  const norme = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const idx = new Map(noeuds.map((n) => [norme(n.id), n.id]));
  const fleches = [];
  for (const l of liens) {
    const de = idx.get(norme(l.de)), vers = idx.get(norme(l.vers));
    if (!de || !vers || de === vers) continue;
    const a = pos.get(de), b = pos.get(vers);
    const ax = a.x + w / 2, ay = a.y + h / 2, bx = b.x + w / 2, by = b.y + h / 2;
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L;
    // la flèche s'arrête au BORD des rectangles (sinon la pointe vit sous la boîte)
    const bord = (u, v) => Math.min(u ? (w / 2 + 5) / Math.abs(u) : Infinity, v ? (h / 2 + 5) / Math.abs(v) : Infinity);
    const x1 = ax + ux * bord(ux, uy), y1 = ay + uy * bord(ux, uy);
    const x2 = bx - ux * bord(ux, uy), y2 = by - uy * bord(ux, uy);
    fleches.push(`      <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#64748B" stroke-width="1.5" marker-end="url(#fl)"><title>${esc(l.de)} → ${esc(l.vers)}${l.titre ? ` | ${esc(l.titre)}` : ""}</title></line>`);
  }
  const boites = noeuds.map((n) => {
    const p = pos.get(n.id);
    return `      <g>
        <rect data-overlap-ok="" x="${p.x}" y="${p.y}" width="${w}" height="${h}" rx="10" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.5"/>
        <text data-overlap-ok="" x="${p.x + w / 2}" y="${p.y + 26}" text-anchor="middle" font-family="Roboto,system-ui,sans-serif" font-weight="700" font-size="14" fill="#0F172A">${esc(n.id)}</text>
        <text data-overlap-ok="" x="${p.x + w / 2}" y="${p.y + 46}" text-anchor="middle" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#64748B">${esc(n.sous || "")}</text>
      </g>`;
  });
  return `      <svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg">
        <defs><marker id="fl" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#64748B"/></marker></defs>
${fleches.join("\n")}
${boites.join("\n")}
      </svg>`;
}
