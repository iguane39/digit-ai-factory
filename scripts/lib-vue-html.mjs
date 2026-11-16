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

// UN JETON CODÉ NU PORTE SA LÉGENDE (TF-2665, 16/11/2026). `check_html.py` L3 refuse un jeton écrit
// pour une machine (`mise_en_service`, `desactivee_par_operateur` : trois segments au moins, ni espace
// ni code) quand la cellule ou la puce qui le porte n'a ni `title`, ni `aria-label`, ni légende
// visible : le lecteur doit deviner ce qu'il désigne. Les deux vues de `docs\projet` rendaient FAIL sur
// L3 chez un produit, qui ne pouvait pas les corriger. Le générateur ne connaît pas le sens du jeton ;
// il pose ce qu'il sait — la colonne qui le porte et le jeton lu en mots — et l'auteur qui veut mieux
// l'écrit en `code` ou le définit dans la source, ce que L3 admet.
const RE_JETON = /^[a-z][a-z0-9]*(?:[-_][a-z0-9]+){2,}$/;
const legendeJeton = (texte, contexte) => {
  const t = String(texte).trim();
  return RE_JETON.test(t) ? ` title="${esc(`${contexte} : ${t.replace(/[-_]/g, " ")}`)}"` : "";
};

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
    // UN « ## » EST UN h2, PAS UN h3 (TF-1436, 28/09/2026). Le décalage « + 1 » faisait sauter un
    // niveau : la coquille pose déjà le h1 (titre du document), donc le premier niveau du CORPS —
    // « ## » — doit être le niveau suivant immédiat, h2. Mesuré sur une étude à 17 chapitres :
    // chaque « ## » sortait en <h3> sous le <h1>, saut signalé par check_html (avertissement
    // « Saut de hiérarchie ») et oracle-a11y, et L25 (sommaire au-delà de trois chapitres) ne
    // pouvait plus compter aucun <h2> — la même cause cassait TF-1437 en silence.
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { const n = h[1].length; out.push(`<h${n}>${inline(h[2])}</h${n}>`); i++; continue; }
    // UNE LISTE NUMÉROTÉE EST UNE LISTE (TF-1436, 28/09/2026). Sans cette branche, ses lignes ne
    // correspondaient à AUCUN cas ci-dessous (ni titre, ni tableau, ni puce, ni citation) et
    // tombaient dans le paragraphe générique : huit éléments numérotés sortaient en un seul <p>,
    // la numérotation perdue avec les retours à la ligne. Le marqueur admet « 1. » et « 1) ».
    if (/^\s*\d+[.)]\s+/.test(l)) {
      const items = [];
      while (i < lignes.length && /^\s*\d+[.)]\s+/.test(lignes[i])) { items.push(lignes[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      out.push(`<ol>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</ol>`);
      continue;
    }
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
        corpsT.map((r) => `<tr>${cellules(r).map((c, k) => `<td${legendeJeton(c, `valeur codée de « ${tetes[k] || "colonne"} »`)}>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(l)) {
      const items = [];
      while (i < lignes.length && /^\s*[-*]\s+/.test(lignes[i])) { items.push(lignes[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(`<ul>${items.map((x) => `<li${legendeJeton(x, "valeur codée")}>${inline(x)}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\s*>\s?/.test(l)) {
      const cit = [];
      while (i < lignes.length && /^\s*>\s?/.test(lignes[i])) { cit.push(lignes[i].replace(/^\s*>\s?/, "")); i++; }
      out.push(`<blockquote><p>${inline(cit.join(" "))}</p></blockquote>`);
      continue;
    }
    const par = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{1,4}\s|\s*\||\s*[-*]\s|\s*>|\s*\d+[.)]\s)/.test(lignes[i])) { par.push(lignes[i]); i++; }
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

// Boîtes SVG en grille + flèches nommées — layout DÉLIBÉRÉMENT simple (pas de moteur de graphe) :
// n boîtes par rangée. Une flèche est DROITE, centre à centre, tant qu'elle ne traverse aucune autre
// boîte ; sinon elle est ROUTÉE dans les couloirs qui séparent les boîtes (TF-2626, 16/11/2026).
//
// LE FAIT. Régénérée le 12/11/2026 depuis une source de produit, la vue d'architecture rendait
// `render_page.py` FAIL aux deux thèmes : 19 constats V4 (des flèches droites qui traversent une boîte
// qui n'est ni leur départ ni leur arrivée — par exemple de la première boîte d'une rangée à la
// troisième, la deuxième entre elles — et 18 éléments exemptés EN BLOC par `data-overlap-ok` sans
// valeur, qui empêchait V4 de juger quoi que ce soit sur les boîtes). Le témoin d'avant la
// modification de la source rendait les mêmes constats : ils venaient du générateur, pas du contenu.
//
// LE REMÈDE, trois gestes.
//   · Plus d'exemption en bloc. Le libellé d'une boîte se déclare ÉTIQUETTE de sa marque
//     (`data-etiquette-de="<id du rect>"`, RT-124) : V4 l'admet quand il tient dans le rectangle, et
//     le juge sinon — un nom trop long qui déborde redevient un constat, au lieu de rester invisible.
//   · Une flèche qui traverserait une boîte suit les COULOIRS : les lignes qui passent au milieu des
//     écarts entre colonnes et entre rangées (une marge de couloir est ajoutée autour de la grille
//     pour que les flèches du bord aient aussi le leur). Le chemin le plus court est cherché, en
//     pénalisant les coudes ; chaque flèche routée prend une VOIE, décalée de 6 px, que ne partage
//     aucune autre flèche sur le même tronçon (V4 refuse deux flèches confondues sur 24 px).
//   · Deux liaisons entre les mêmes boîtes (un aller et un retour) courent en parallèle, à 12 px.
const PAS_VOIE = 6;
const VOIES = [0, PAS_VOIE, -PAS_VOIE, 2 * PAS_VOIE, -2 * PAS_VOIE];
const COUDE = 40;
const MARGE_BOITE = 10;

export function svgBoites(noeuds, liens, { parRangee = 3, w = 220, h = 64, gx = 60, gy = 56 } = {}) {
  const C = Math.min(noeuds.length, parRangee) || 1;
  const R = Math.ceil(noeuds.length / parRangee) || 1;
  const mx = gx / 2 + 14, my = gy / 2 + 14;
  const pos = new Map();
  noeuds.forEach((n, i) => {
    const c = i % parRangee, r = Math.floor(i / parRangee);
    pos.set(n.id, { x: mx + c * (w + gx), y: my + r * (h + gy), c, r, i });
  });
  const W = 2 * mx + C * w + (C - 1) * gx;
  const H = 2 * my + R * h + (R - 1) * gy;
  const norme = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const idx = new Map(noeuds.map((n) => [norme(n.id), n.id]));

  // les liaisons valides, et le rang de chacune parmi celles qui relient les MÊMES deux boîtes
  const valides = [];
  for (const l of liens) {
    const de = idx.get(norme(l.de)), vers = idx.get(norme(l.vers));
    if (de && vers && de !== vers) valides.push({ l, de, vers });
  }
  const cle = (a, b) => (pos.get(a).i < pos.get(b).i ? `${a}\u0000${b}` : `${b}\u0000${a}`);
  const total = new Map(), vus = new Map();
  for (const v of valides) total.set(cle(v.de, v.vers), (total.get(cle(v.de, v.vers)) || 0) + 1);
  for (const v of valides) {
    const k = cle(v.de, v.vers);
    v.rang = vus.get(k) || 0; vus.set(k, v.rang + 1);
    v.parmi = total.get(k);
  }

  // couloirs : X[k] entre la colonne k-1 et la colonne k, Y[j] entre la rangée j-1 et la rangée j
  const X = Array.from({ length: C + 1 }, (_, k) => mx + k * (w + gx) - gx / 2);
  const Y = Array.from({ length: R + 1 }, (_, j) => my + j * (h + gy) - gy / 2);
  const N = (C + 1) * (R + 1);
  const sommet = (k, j) => k * (R + 1) + j;
  const adj = Array.from({ length: N }, () => []);
  for (let k = 0; k <= C; k++) for (let j = 0; j <= R; j++) {
    if (k < C) { const d = X[k + 1] - X[k]; adj[sommet(k, j)].push({ vers: sommet(k + 1, j), d }); adj[sommet(k + 1, j)].push({ vers: sommet(k, j), d }); }
    if (j < R) { const d = Y[j + 1] - Y[j]; adj[sommet(k, j)].push({ vers: sommet(k, j + 1), d }); adj[sommet(k, j + 1)].push({ vers: sommet(k, j), d }); }
  }
  const coord = (v) => ({ x: X[Math.floor(v / (R + 1))], y: Y[v % (R + 1)] });

  // la porte d'une boîte sur un de ses côtés : un point du couloir voisin, relié à ses deux sommets
  const porte = (p, cote) => {
    const cx = p.x + w / 2, cy = p.y + h / 2;
    if (cote === "E") return { cote, bord: { x: p.x + w + 5, y: cy }, pt: { x: X[p.c + 1], y: cy }, sommets: [sommet(p.c + 1, p.r), sommet(p.c + 1, p.r + 1)], axe: "y" };
    if (cote === "W") return { cote, bord: { x: p.x - 5, y: cy }, pt: { x: X[p.c], y: cy }, sommets: [sommet(p.c, p.r), sommet(p.c, p.r + 1)], axe: "y" };
    if (cote === "N") return { cote, bord: { x: cx, y: p.y - 5 }, pt: { x: cx, y: Y[p.r] }, sommets: [sommet(p.c, p.r), sommet(p.c + 1, p.r)], axe: "x" };
    return { cote, bord: { x: cx, y: p.y + h + 5 }, pt: { x: cx, y: Y[p.r + 1] }, sommets: [sommet(p.c, p.r + 1), sommet(p.c + 1, p.r + 1)], axe: "x" };
  };
  const DIR = (a, b) => (b.y < a.y ? 1 : b.x > a.x ? 2 : b.y > a.y ? 3 : 4);

  /** Plus court chemin (longueur + coudes) entre deux portes, par les couloirs. Rend { cout, sommets: [A, …, B] } ou null. */
  const chemin = (pa, pb) => {
    const A = N, B = N + 1;
    const lien = (porteX, id) => porteX.sommets.map((s) => ({ vers: s, d: Math.abs(coord(s).x - porteX.pt.x) + Math.abs(coord(s).y - porteX.pt.y), id }));
    const aretes = (v) => {
      if (v === A) return lien(pa, A);
      if (v === B) return lien(pb, B);
      const sup = [];
      if (pa.sommets.includes(v)) sup.push({ vers: A, d: Math.abs(coord(v).x - pa.pt.x) + Math.abs(coord(v).y - pa.pt.y) });
      if (pb.sommets.includes(v)) sup.push({ vers: B, d: Math.abs(coord(v).x - pb.pt.x) + Math.abs(coord(v).y - pb.pt.y) });
      return [...adj[v], ...sup];
    };
    const pt = (v) => (v === A ? pa.pt : v === B ? pb.pt : coord(v));
    const meilleur = new Map();           // "sommet|direction" -> { cout, de }
    const file = [{ v: A, dir: 0, cout: 0, cle: `${A}|0`, de: null }];
    const vu = new Set();
    while (file.length) {
      file.sort((a, b) => a.cout - b.cout || (a.cle < b.cle ? -1 : 1));
      const cur = file.shift();
      if (vu.has(cur.cle)) continue;
      vu.add(cur.cle);
      meilleur.set(cur.cle, cur);
      if (cur.v === B) {
        const out = [];
        for (let e = cur; e; e = e.de) out.unshift(e.v);
        return { cout: cur.cout, sommets: out };
      }
      for (const a of aretes(cur.v)) {
        const dir = DIR(pt(cur.v), pt(a.vers));
        const coude = cur.dir !== 0 && dir !== cur.dir ? COUDE : 0;
        const cle2 = `${a.vers}|${dir}`;
        if (!vu.has(cle2)) file.push({ v: a.vers, dir, cout: cur.cout + a.d + coude, cle: cle2, de: cur });
      }
    }
    return null;
  };

  const traverse = (x1, y1, x2, y2, de, vers) => {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1;
    for (let t = 0; t <= L; t += 2) {
      const px = x1 + ((x2 - x1) * t) / L, py = y1 + ((y2 - y1) * t) / L;
      for (const [id, p] of pos) {
        if (id === de || id === vers) continue;
        if (px > p.x - MARGE_BOITE && px < p.x + w + MARGE_BOITE && py > p.y - MARGE_BOITE && py < p.y + h + MARGE_BOITE) return true;
      }
    }
    return false;
  };

  const occupe = new Map();               // tronçon de couloir -> voies prises
  let routees = 0;
  const fleches = [];
  const bloquees = [];
  // le côté d'une boîte par où entre ou sort une flèche droite : une flèche routée n'y prend pas la même voie
  const marquerCote = (id, ux, uy) => {
    const cote = (w / 2) * Math.abs(uy) <= (h / 2) * Math.abs(ux) ? (ux > 0 ? "E" : "W") : (uy > 0 ? "S" : "N");
    const k = `porte:${id}:${cote}`;
    if (!occupe.has(k)) occupe.set(k, new Set());
    for (const d of [0, PAS_VOIE, -PAS_VOIE]) occupe.get(k).add(d);
  };
  for (const v of valides) {
    const { l, de, vers } = v;
    const a = pos.get(de), b = pos.get(vers);
    let ax = a.x + w / 2, ay = a.y + h / 2, bx = b.x + w / 2, by = b.y + h / 2;
    if (v.parmi > 1) {
      // un aller et un retour (ou plusieurs liaisons) entre les mêmes boîtes : parallèles, côté fixé par la paire
      const [p, q] = pos.get(de).i < pos.get(vers).i ? [a, b] : [b, a];
      const dx0 = q.x - p.x, dy0 = q.y - p.y, L0 = Math.hypot(dx0, dy0) || 1;
      const decal = (v.rang - (v.parmi - 1) / 2) * 2 * PAS_VOIE;
      const sx = (-dy0 / L0) * decal, sy = (dx0 / L0) * decal;
      ax += sx; ay += sy; bx += sx; by += sy;
    }
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L;
    // la flèche s'arrête au BORD des rectangles (sinon la pointe vit sous la boîte)
    const bord = (u, vv) => Math.min(u ? (w / 2 + 5) / Math.abs(u) : Infinity, vv ? (h / 2 + 5) / Math.abs(vv) : Infinity);
    const x1 = ax + ux * bord(ux, uy), y1 = ay + uy * bord(ux, uy);
    const x2 = bx - ux * bord(ux, uy), y2 = by - uy * bord(ux, uy);
    const titre = `<title>${esc(l.de)} → ${esc(l.vers)}${l.titre ? ` | ${esc(l.titre)}` : ""}</title>`;
    const droite = `      <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#64748B" stroke-width="1.5" marker-end="url(#fl)">${titre}</line>`;
    if (!traverse(x1, y1, x2, y2, de, vers)) { fleches.push(droite); marquerCote(de, ux, uy); marquerCote(vers, -ux, -uy); continue; }
    bloquees.push({ de, vers, droite, titre });
  }

  // les flèches routées passent APRÈS les droites : leurs voies évitent les côtés que celles-ci occupent déjà
  for (const { de, vers, droite, titre } of bloquees) {
    const a = pos.get(de), b = pos.get(vers);
    // routée : le meilleur couple de côtés
    let best = null;
    for (const ca of ["E", "W", "N", "S"]) for (const cb of ["E", "W", "N", "S"]) {
      const pa = porte(a, ca), pb = porte(b, cb);
      const r = chemin(pa, pb);
      if (r && (!best || r.cout < best.r.cout)) best = { r, pa, pb };
    }
    if (!best) { fleches.push(droite); continue; }
    const { r, pa, pb } = best;
    const tronc = [];
    for (let i = 0; i + 1 < r.sommets.length; i++) {
      const s = r.sommets[i], t = r.sommets[i + 1];
      const nom = (z) => (z === N ? `porte:${de}:${pa.cote}` : z === N + 1 ? `porte:${vers}:${pb.cote}` : `s${z}`);
      tronc.push([nom(s), nom(t)].sort().join(">"));
    }
    tronc.push(`porte:${de}:${pa.cote}`, `porte:${vers}:${pb.cote}`);
    const voie = VOIES.find((d) => tronc.every((t) => !(occupe.get(t) || new Set()).has(d))) ?? VOIES[routees % VOIES.length];
    for (const t of tronc) { if (!occupe.has(t)) occupe.set(t, new Set()); occupe.get(t).add(voie); }
    routees += 1;
    // le point du bord glisse le long du côté ; ceux du couloir se décalent sur les deux axes
    const surLeBord = (porteX) => (porteX.axe === "y" ? { x: porteX.bord.x, y: porteX.bord.y + voie } : { x: porteX.bord.x + voie, y: porteX.bord.y });
    const dansLeCouloir = (p) => ({ x: p.x + voie, y: p.y + voie });
    const pts = [surLeBord(pa)];
    for (const s of r.sommets) pts.push(dansLeCouloir(s === N ? pa.pt : s === N + 1 ? pb.pt : coord(s)));
    pts.push(surLeBord(pb));
    // sans point doublé ni point aligné
    const net = [];
    for (const p of pts) {
      if (net.length && Math.abs(net[net.length - 1].x - p.x) < 0.01 && Math.abs(net[net.length - 1].y - p.y) < 0.01) continue;
      net.push(p);
      while (net.length >= 3) {
        const [p0, p1, p2] = net.slice(-3);
        const aligne = (Math.abs(p0.x - p1.x) < 0.01 && Math.abs(p1.x - p2.x) < 0.01) || (Math.abs(p0.y - p1.y) < 0.01 && Math.abs(p1.y - p2.y) < 0.01);
        if (!aligne) break;
        net.splice(net.length - 2, 1);
      }
    }
    const d = net.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    fleches.push(`      <path d="${d}" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linejoin="round" marker-end="url(#fl)">${titre}</path>`);
  }

  const abrege = (s, n) => (String(s).length > n ? `${String(s).slice(0, n - 1)}…` : String(s));
  const boites = noeuds.map((n, i) => {
    const p = pos.get(n.id);
    const rid = `boite-${i + 1}`;
    return `      <g>
        <rect id="${rid}" x="${p.x}" y="${p.y}" width="${w}" height="${h}" rx="10" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.5"/>
        <text data-etiquette-de="${rid}" x="${p.x + w / 2}" y="${p.y + 26}" text-anchor="middle" font-family="Roboto,system-ui,sans-serif" font-weight="700" font-size="14" fill="#0F172A">${esc(abrege(n.id, 24))}</text>
        <text data-etiquette-de="${rid}" x="${p.x + w / 2}" y="${p.y + 46}" text-anchor="middle" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#64748B">${esc(abrege(n.sous || "", 30))}</text>
      </g>`;
  });
  return `      <svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${Math.round(W * 1.8)}px" xmlns="http://www.w3.org/2000/svg">
        <defs><marker id="fl" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#64748B"/></marker></defs>
${fleches.join("\n")}
${boites.join("\n")}
      </svg>`;
}
