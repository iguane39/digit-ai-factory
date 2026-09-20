// lib-vue-html.mjs — socle partagé des générateurs de vues docs\projet (TF-0091).
// Node pur, zéro dépendance, DÉTERMINISTE : même source → même HTML octet pour octet
// (aucune date générée — verifie_le vient du frontmatter ; sceau = sha256 de la source).
// La vue produite est autonome (A1 : zéro requête réseau) et chartée digit-ai-page-html.
import { createHash } from "node:crypto";
import { empreinteTexte } from "./lib-empreinte.mjs";

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

// Coquille chartée (tokens du socle, light, print, reduced-motion, favicon data:).
export function coquille({ titre, description, front, svg, corpsHtml, source, lettre, version }) {
  // A4 (TF-0556, 24/08) — LE TITRE PORTE LE DOCUMENT HORS DE SON DOSSIER. Ces vues sortaient avec un
  // titre nu : ni marque, ni indice de version daté, donc A4 en échec sur les TROIS. Le titre est la
  // seule métadonnée qui suit le fichier partout — onglet, favori, pied d'impression, pièce jointe —
  // et sans date, deux révisions du même jour portent le même nom à l'écran.
  //
  // L'indice est DÉRIVÉ, jamais saisi : `verifie_le` de l'en-tête de la source quand elle en porte
  // un, sinon la date du jour. Un paramètre à remplir à la main aurait été oublié au premier appel
  // suivant — c'est la leçon de toutes les listes écrites à la main de ce dépôt.
  const dateSource = String((front && (front.verifie_le || front.date)) || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  const indice = version
    || (dateSource ? `${dateSource[1]}${dateSource[2]}${dateSource[3]}a` : new Date().toISOString().slice(0, 10).replaceAll("-", "") + "a");
  const titreComplet = /\b\d{8}[a-z]?\b/.test(titre) ? titre : `Digit-AI — ${titre} — ${indice}`;
  // Fins de ligne normalisees AVANT le sceau (TF-0359, etendu par TF-0338) : la comparaison
  // de parite est DIFFEREE — scellee ici, verifiee plus tard, possiblement apres un checkout
  // qui a reecrit la source en CRLF. Mesure du 18/08 sur le seul produit du poste portant ces
  // deux projections : MODELE-DONNEES.md y vit en CRLF, donc brut != normalise — sans cette
  // normalisation, la parite ne pouvait pas etre durcie sans accuser une page fraiche.
  const sceau = empreinteTexte(source, 12);   // TF-0615 : fonction partagee
  // Favicon-lettre (13/08) : première lettre du produit (paramètre `lettre`), sinon celle
  // du titre — jamais un carré anonyme.
  const initiale = (lettre || (titre || "D").trim()[0] || "D").toUpperCase();
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titreComplet)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#2563EB">
  <meta name="color-scheme" content="light">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3Ctext x='32' y='44' font-family='Segoe UI,Roboto,sans-serif' font-size='38' font-weight='700' fill='white' text-anchor='middle'%3E${initiale}%3C/text%3E%3C/svg%3E">
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
    /* page de DONNEES (I1 / L26) : le contenu prend toute la largeur du .wrap (>= 75 vw) — une colonne
       de 75ch laissait 34 % de l'ecran a 1920 px, mesure Playwright du 07/09 (646 px sur 1920). La classe
       s'appelle desormais defile et non scroll : le depot ecrit ses noms en francais.
       ATTENTION : ce bloc vit dans un litteral gabarit JavaScript — aucun accent grave ici. */
    .colonne{max-width:none;margin:0}
    h1,h2,h3{font-family:var(--head);font-weight:800;line-height:1.2}
    h1{font-size:1.7rem;margin:0 0 .2em} h2{font-size:1.25rem;font-weight:700;margin:1.5em 0 .4em}
    h3{font-size:1.02rem;font-weight:700;margin:1.1em 0 .3em}
    code{font-family:var(--mono);font-size:.9em}
    /* L19 autorise nommement la coupure sur un lien : une URL est un identifiant, pas un mot. */
    a{color:var(--blue);overflow-wrap:anywhere}
    /* LA MESURE DE LECTURE SE POSE SUR LE CONTENEUR, JAMAIS SUR LE TEXTE (16/09/2026).
       Mesure de l'oracle de rendu sur une page d'etude : 221 caracteres par ligne a 3840 px
       pour un plafond de 135 (V18) — l'oeil perd le debut de la ligne suivante. Un premier
       remede a borne le PARAGRAPHE par max-width : L2 l'a refuse aussitot, et son message
       dit le remede juste — « poser la mesure de lecture sur le CONTENEUR (.chap.lire), pas
       sur le texte, ET la declarer par data-mesure-lecture des lors qu'il a des freres plus
       larges ». *Les deux regles ne se contredisent pas : ensemble, elles decrivent une
       seule construction*, celle du gabarit de chapitre du socle (E4, token a 1 080 px).
       Les tableaux restent FRERES du chapitre et gardent toute la largeur offerte. */
    .meta{color:var(--muted);font-size:.85rem;margin:.2em 0 0}
    /* CENTRE, ET D'UN SEUL RYTHME. Deux mesures de l'oracle de rendu, le meme jour :
       · L2 (conteneur) — la colonne de lecture calee A GAUCHE laissait 1 752 px de vide a droite
         et 0 a gauche, sans voisin : le remede qu'il nomme est de la CENTRER, ou de lui donner un
         voisin utile. Ici elle a des freres — les tableaux — mais pas a sa hauteur : on centre.
       · V7 (rythme) — les espaces entre paragraphes mesuraient 85 / 57 / 57 / 54 px : un rythme
         vertical qui varie sans raison se lit comme un defaut de mise en page. Les marges sont
         posees une fois, en bas seulement, pour que deux blocs voisins ne cumulent jamais. */
    .chap.lire{max-width:1080px;margin-inline:auto}
    .chap.lire>*{margin-top:0;margin-bottom:16px}
    .chap.lire>h2{margin-top:28px} .chap.lire>h3{margin-top:20px}
    .chap.lire>*:first-child{margin-top:0}
    blockquote{margin:14px 0;padding:10px 16px;border-left:3px solid var(--blue);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0;color:var(--muted)}
    blockquote p{margin:0}
    .defile{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);margin:10px 0}
    table{border-collapse:collapse;width:100%;font-size:.92rem}
    th{font-family:var(--head);font-weight:700;text-align:left;padding:9px 12px;border-bottom:2px solid var(--line)}
    td{padding:7px 12px;border-bottom:1px solid var(--line);vertical-align:top}
    tr:last-child td{border-bottom:none}
    ul{margin:.4em 0;padding-left:1.3em}
    figure{margin:16px 0;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px;overflow-x:auto}
    figcaption{color:var(--muted);font-size:.85rem;margin-top:8px}
    svg{max-width:100%;height:auto}
    footer{margin-top:40px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:14px}
    /* L19 (TF-0556, 24/08) — LA COUPURE DE MOT QUITTE LA PROSE. La propriete overflow-wrap:anywhere
       etait posee sur .meta, td et footer : ravageuse sur du texte courant, ou un mot se casse en
       deux au milieu d'une ligne sans cesure ni trait d'union. Elle ne reste QUE sur les cellules,
       et seulement sous le palier de repli, la ou le socle l'EXIGE (composants.md section 6) — un
       identifiant long dans une cellule etroite doit pouvoir se couper, une phrase jamais.
       ATTENTION : ce bloc vit dans un litteral gabarit JavaScript. Aucun accent grave ici, il
       fermerait la chaine et casserait tout ce qui suit — defaut commis en ecrivant ce commentaire. */
    /* SUR MOBILE, L'EN-TETE AUSSI PASSE EN BLOC (16/09/2026). La regle ne convertissait que les
       cellules de donnees : la ligne d'EN-TETE, restee en cellules de tableau, continuait d'imposer
       sa largeur, et l'oracle mesurait un tableau a 441 px de bord droit pour une fenetre de
       390 px (V1). Un conteneur defilant ne suffit pas a eteindre V1 — la regle mesure le bord
       droit de chaque element, defilant ou non, et elle a raison : une page qui se lit en poussant
       le doigt de cote se lit mal. */
    /* CE QUI NE SE COUPE PAS POUSSE LA PAGE — ET LA COUPURE A UN PERIMETRE (16/09/2026).
       Deux mesures sur une etude qui cite beaucoup de chemins : a 768 px un tableau sortait a
       799 px, et a 390 px le DOCUMENT mesurait 419 px de large. La cause est un jeton insecable
       qui impose sa longueur a sa cellule, donc au tableau, donc a la page.
       PREMIER REMEDE, REFUSE DANS LA MINUTE : autoriser la coupure sur les cellules. L19 l'a
       rejete, et elle a raison — un mot francais s'y casse n'importe ou (« Utilisabl/e »), et la
       regle reserve nommement la coupure a code, pre, aux liens et aux cellules d'IDENTIFIANTS.
       REMEDE TENU : la coupure ne touche que les fragments de CODE, ou vivent justement les
       chemins et les identifiants qui poussaient la page. La prose n'est jamais touchee. */
    code{overflow-wrap:anywhere}
    @media (max-width:640px){.wrap{padding:16px 12px 48px} h1{font-size:1.3rem}
      .defile td,.defile th{display:block;overflow-wrap:anywhere}
      .defile table{width:100%} .chap.lire{max-width:none}}
    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @page{margin:14mm}
    @media print{.defile{overflow:visible;border:none} figure{break-inside:avoid} tr{break-inside:avoid} body{background:#fff}}
  </style>
</head>
<body>
  <div class="wrap"><div class="colonne">
    <header class="chap lire" data-mesure-lecture>
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
  return `      <svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${Math.round(W * 1.8)}px" xmlns="http://www.w3.org/2000/svg">
        <defs><marker id="fl" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#64748B"/></marker></defs>
${fleches.join("\n")}
${boites.join("\n")}
      </svg>`;
}
