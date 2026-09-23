// lib-vue-html.mjs — socle partagé des générateurs de vues docs\projet (TF-0091).
// Node pur, zéro dépendance, DÉTERMINISTE : même source → même HTML octet pour octet
// (aucune date générée — verifie_le vient du frontmatter).
// La coquille des vues vit dans lib-socle-page.mjs, dérivée du socle digit-ai-page-html (TF-1321).

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
// UN LIEN MARKDOWN EST UN LIEN (16/09/2026). Le rendu ne les connaissait pas : « [texte](url) »
// sortait EN CLAIR dans toutes les pages generees du parc — le lecteur voyait la syntaxe, et l'URL,
// insecable, poussait la page. Mesure sur une etude qui cite dix-huit sources : a 390 px le
// document mesurait 419 px de large, et l'oracle de rendu le refusait (V1) sans qu'aucun element
// pris isolement ne soit en cause. Corriger l'affichage et le debordement est le meme geste.
//
// LES SCHEMES SONT EN LISTE FERMEE, et ce n'est pas un exces de prudence : la source d'une page
// generee est un Markdown que le pilot ingere, parfois issu d'un entrant. Un « javascript: » y
// deviendrait un lien executable dans un livrable remis a un humain. Seuls http, https, mailto et
// les chemins relatifs passent ; le reste reste du texte, visible, jamais silencieusement retire.
const LIEN_SUR = /^(?:(?:https?:\/\/|mailto:)[^\s"'<>]+|[.\/#][^\s"'<>]*|[A-Za-z0-9_-][^\s"':<>]*\.[A-Za-z]{2,8}(?:[#?\/][^\s"'<>]*)?)$/;

function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (tout, texte, url) =>
      (LIEN_SUR.test(url) ? `<a href="${url}">${texte}</a>` : tout));
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
      // UN TUYAU ÉCHAPPÉ N'EST PAS UN SÉPARATEUR (16/09/2026, TF-0923 volet 3). Le découpage naïf
      // sur « | » coupait les cellules à l'intérieur d'un fragment de code : la première étude passée
      // en page portait `Databricks|médaillon|Bronze.Silver.Gold` et une commande à trois verbes
      // alternés, et les deux lignes rendaient CINQ cellules pour un en-tête de trois. Le socle l'a
      // nommé (règle S1) et la conséquence est celle qu'il décrit : *les valeurs glissent de colonne,
      // la page rend faux sans jamais déborder, donc aucun contrôle de rendu ne le voit.*
      //
      // Markdown échappe déjà ce cas — « \\| » —, et c'est cette convention qui est honorée ici
      // plutôt qu'une invention maison : on coupe sur les tuyaux NON précédés d'un antislash, puis on
      // retire l'antislash d'échappement. Corriger la source ne suffisait pas : c'est le rendu qui
      // ignorait l'échappement, et trois autres générateurs partagent cette fonction.
      const cellules = (r) => r.trim().replace(/^\||\|$/g, "")
        .split(/(?<!\\)\|/).map((c) => c.replace(/\\\|/g, "|").trim());
      const tetes = cellules(rangs[0]);
      const corpsT = rangs.slice(1).filter((r) => !/^\s*\|[\s:|-]+\|?\s*$/.test(r));
      out.push(`<div class="defile"><table><thead><tr>${tetes.map((t) => `<th scope="col">${inline(t)}</th>`).join("")}</tr></thead><tbody>${
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

// LA COQUILLE ÉCRITE À LA MAIN A QUITTÉ CE FICHIER (TF-1321, décision humaine D-13 (a) du
// 23/09/2026). Elle portait une copie des jetons du socle sans le reste : ni bascule de thème, ni
// repli des tableaux en cartes, ni composants déclarés. Les vues d'architecture et de modèle de
// données dérivent désormais leur coquille du socle digit-ai-page-html, comme les pages d'étude
// depuis TF-1317 : `scripts\lib-socle-page.mjs`, fonction `pageDeVue`. Ce fichier garde ce qui
// n'est pas de la coquille : la lecture de la source, le rendu markdown et les boîtes SVG.

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
  return `      <svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${Math.round(W * 1.8)}px" xmlns="http://www.w3.org/2000/svg">
        <defs><marker id="fl" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#64748B"/></marker></defs>
${fleches.join("\n")}
${boites.join("\n")}
      </svg>`;
}
