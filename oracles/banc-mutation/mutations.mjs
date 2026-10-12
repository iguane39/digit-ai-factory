/**
 * mutations.mjs — LE CATALOGUE DES MUTATIONS du banc de mutation des oracles (TF-1551, étape 1 de l'étude
 * `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`).
 *
 * UNE MUTATION CASSE UN LIVRABLE VERT ET CONNAÎT LA PLACE DE LA CASSURE. C'est le gisement le moins cher
 * d'étiquettes (SWE-smith, ACH) : personne n'annote, la mutation fabrique le défaut, et l'on mesure si l'oracle
 * du domaine le voit. Un mutant que l'oracle laisse passer est un SURVIVANT : soit un angle mort du juge, soit
 * une mutation hors du périmètre qu'il déclare — la lecture du survivant tranche, jamais le script.
 *
 * Chaque opérateur est PUR : texte en entrée, texte en sortie, ou `null` quand il ne s'applique pas à ce texte
 * (un opérateur qui ne s'applique pas n'est pas une mutation pertinente, il ne compte ni pour ni contre).
 * Le catalogue est PAR DOMAINE d'artefact (document structuré, restitution, demande…) : une mutation est
 * déclarée pertinente pour un oracle au manifeste, d'après les règles que l'en-tête de cet oracle annonce.
 * Aucun appel de modèle : tout est déterministe, deux passages donnent les mêmes mutants.
 */

const lignesDe = (t) => String(t).replace(/\r\n/g, "\n").split("\n");
const enFence = (lignes) => { // vrai pour chaque ligne située dans un bloc de code ``` (on n'y mute rien)
  let dedans = false;
  return lignes.map((l) => { if (/^\s*```/.test(l)) { dedans = !dedans; return true; } return dedans; });
};
/** Les sections de niveau 2 : { debut, fin } en indices de lignes (fin exclue), hors blocs de code. */
function sections(lignes) {
  const f = enFence(lignes);
  const idx = lignes.map((l, i) => (/^##\s+\S/.test(l) && !f[i] ? i : -1)).filter((i) => i >= 0);
  return idx.map((d, k) => ({ debut: d, fin: k + 1 < idx.length ? idx[k + 1] : lignes.length }));
}
const sansSection = (t, choisir) => {
  const l = lignesDe(t);
  const s = sections(l);
  if (s.length < 2) return null; // une seule section : la retirer viderait le document, ce n'est plus une mutation locale
  const c = choisir(s);
  return [...l.slice(0, c.debut), ...l.slice(c.fin)].join("\n");
};

export const MUTATIONS = [
  { id: "titre-retire", libelle: "le titre de niveau 1 est retiré", domaine: "document",
    appliquer: (t) => { const l = lignesDe(t); const i = l.findIndex((x) => /^#\s+\S/.test(x)); return i < 0 ? null : [...l.slice(0, i), ...l.slice(i + 1)].join("\n"); } },
  { id: "section-premiere-retiree", libelle: "la première section (##) est retirée", domaine: "document",
    appliquer: (t) => sansSection(t, (s) => s[0]) },
  { id: "section-centrale-retiree", libelle: "la section centrale (##) est retirée", domaine: "document",
    appliquer: (t) => sansSection(t, (s) => s[Math.floor(s.length / 2)]) },
  { id: "section-derniere-retiree", libelle: "la dernière section (##) est retirée", domaine: "document",
    appliquer: (t) => sansSection(t, (s) => s[s.length - 1]) },
  { id: "section-videe", libelle: "le corps de la dernière section est vidé, son titre reste", domaine: "document",
    appliquer: (t) => { const l = lignesDe(t); const s = sections(l); if (s.length < 2) return null; const c = s[s.length - 1];
      return [...l.slice(0, c.debut + 1), "", ...l.slice(c.fin)].join("\n"); } },
  { id: "titre-de-section-renomme", libelle: "le titre de la première section (##) est remplacé par un titre vague", domaine: "document",
    appliquer: (t) => { let fait = false; const f = enFence(lignesDe(t));
      const r = lignesDe(t).map((x, i) => (!fait && !f[i] && /^##\s+\S/.test(x) ? ((fait = true), "## Divers") : x)); return fait ? r.join("\n") : null; } },
  { id: "fin-tronquee", libelle: "la moitié finale du texte est coupée net", domaine: "document",
    appliquer: (t) => { const l = lignesDe(t); return l.length < 12 ? null : l.slice(0, Math.floor(l.length / 2)).join("\n"); } },
  { id: "chiffre-fausse", libelle: "le premier rapport « a/b » (ou le premier entier hors titre) est faussé", domaine: "document",
    appliquer: (t) => { const l = lignesDe(t); const f = enFence(l);
      for (let i = 0; i < l.length; i++) {
        if (f[i] || /^#{1,6}\s/.test(l[i]) || /^---\s*$/.test(l[i])) continue;
        const m = /(?<![\w.])(\d{1,4})\/(\d{1,4})(?![\w/])/.exec(l[i]);
        if (m && +m[2] > 1) { l[i] = l[i].replace(m[0], `${m[1]}/${+m[2] + 3}`); return l.join("\n"); }
      }
      for (let i = 0; i < l.length; i++) {
        if (f[i] || /^#{1,6}\s/.test(l[i]) || /^---\s*$/.test(l[i]) || /^\s*[a-z_]+\s*:/.test(l[i]) && i < 12) continue;
        const m = /(?<![\w.\-/])(\d{2,5})(?![\w.\-/])/.exec(l[i]);
        if (m) { l[i] = l[i].replace(m[0], String(+m[1] + 7)); return l.join("\n"); }
      }
      return null; } },
  { id: "lien-brise", libelle: "la cible du premier lien Markdown pointe vers un fichier inexistant", domaine: "document",
    appliquer: (t) => { const r = String(t).replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/, "](introuvable/$1)"); return r === String(t) ? null : r; } },
  { id: "glose-supprimee", libelle: "la première parenthèse qui suit un sigle ou un terme technique est supprimée", domaine: "document",
    appliquer: (t) => { const r = String(t).replace(/(\b[A-Z][A-Za-z0-9-]{1,10}) \([^()\n]{8,120}\)/, "$1"); return r === String(t) ? null : r; } },
  { id: "date-retiree", libelle: "la première date (AAAA-MM-JJ ou JJ/MM/AAAA) est retirée", domaine: "document",
    appliquer: (t) => { const l = lignesDe(t); const f = enFence(l);
      for (let i = 0; i < l.length; i++) {
        if (f[i]) continue;
        const r = l[i].replace(/\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/, "");
        if (r !== l[i]) { l[i] = r; return l.join("\n"); }
      }
      return null; } },
  { id: "tableau-colonne-retiree", libelle: "la dernière colonne du premier tableau est retirée", domaine: "document",
    appliquer: (t) => { const l = lignesDe(t); const f = enFence(l); const i0 = l.findIndex((x, i) => !f[i] && /^\s*\|.*\|\s*$/.test(x));
      if (i0 < 0) return null; let i = i0; const cut = (x) => x.replace(/\|[^|]*\|\s*$/, "|");
      while (i < l.length && /^\s*\|.*\|\s*$/.test(l[i])) { l[i] = cut(l[i]); i++; }
      return l.join("\n"); } },
  { id: "identifiant-nu", libelle: "un identifiant nu (TF-9999) est posé dans le premier paragraphe de prose", domaine: "restitution",
    appliquer: (t) => { const l = lignesDe(t); const f = enFence(l);
      const i = l.findIndex((x, k) => !f[k] && x.trim().length > 60 && !/^[#>|*\-\d`]/.test(x.trim()));
      if (i < 0) return null; l[i] = l[i].replace(/\.\s*$/, "") + ", selon TF-9999."; return l.join("\n"); } },
  { id: "jours-injectes", libelle: "un effort chiffré en jours est ajouté sur une ligne de coût", domaine: "restitution",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n\nCoût de la reprise proposée : 3 j.\n` },
  { id: "puce-profondeur", libelle: "une imbrication de puces sur quatre niveaux est ajoutée", domaine: "restitution",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n\n- niveau un\n  - niveau deux\n    - niveau trois\n      - niveau quatre\n` },
  { id: "verdict-vague", libelle: "la première ligne de prose du bloc « Verdict » devient une appréciation sans chiffre", domaine: "restitution",
    appliquer: (t) => { const l = lignesDe(t); const i = l.findIndex((x) => /^#{2,3}\s*(?:\d+\.\s*)?verdict\b/i.test(x)); if (i < 0) return null;
      const j = l.findIndex((x, k) => k > i && x.trim() && !/^#/.test(x)); if (j < 0) return null; l[j] = "Tout s'est bien passé."; return l.join("\n"); } },
  { id: "coche-sans-preuve", libelle: "une puce « ✓ fait » sans aucune preuve est ajoutée", domaine: "restitution",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n\n- ✓ fait\n` },
  { id: "remplissage", libelle: "une formule de dialogue (« n'hésitez pas ») est ajoutée en clôture", domaine: "ecriture",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n\nN'hésitez pas à revenir vers nous pour toute question.\n` },
  { id: "gonflement-8ko", libelle: "huit kilo-octets de lignes de prose sont ajoutés en fin de document", domaine: "document",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n\n${"Ligne ajoutée pour gonfler le document au-delà de sa borne de taille.\n".repeat(120)}` },
  { id: "bloc-de-code-ouvert", libelle: "un bloc de code est ouvert à la fin et jamais refermé", domaine: "document",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n\n\`\`\`text\nsuite non refermée\n` },
];

export const parId = new Map(MUTATIONS.map((m) => [m.id, m]));

/**
 * Les mutations PARAMÉTRÉES : `section-retiree:<motif>` retire la première section (##) dont le titre
 * contient le motif (expression, insensible à la casse) ; `section-videe:<motif>` en vide le corps ;
 * `ligne-retiree:<motif>` retire la première ligne qui le contient ; `ajout:<texte>` ajoute ce texte en fin de
 * document (le manifeste y écrit le défaut précis qu'un oracle déclare refuser). Elles visent la partie qu'un oracle
 * DÉCLARE exiger (« la section verdict », « la ligne de coût ») au lieu de l'ordre des sections.
 */
export function resoudre(id) {
  if (parId.has(id)) return parId.get(id);
  const a = /^ajout:([\s\S]+)$/.exec(id);
  if (a) return { id, libelle: `le texte « ${a[1].replace(/\n/g, " ↵ ").slice(0, 60)} » est ajouté en fin de document`, domaine: "document",
    appliquer: (t) => `${String(t).replace(/\s+$/, "")}\n${a[1]}\n` };
  // `remplacer:<expression>=><texte>` : la première occurrence de l'expression devient le texte (`\n` s'y écrit en
  // deux caractères) ; `avant-ligne:<expression>=><texte>` insère le texte comme ligne avant la première ligne qui la porte.
  const r = /^(remplacer|avant-ligne):([\s\S]+?)=>([\s\S]*)$/.exec(id);
  if (r) {
    const [, genre, motif, texte] = r;
    const re = new RegExp(motif, "u");
    const neuf = texte.replace(/\\n/g, "\n");
    return { id, libelle: genre === "remplacer" ? `« ${motif} » devient « ${texte.slice(0, 50)} »` : `la ligne « ${texte.slice(0, 50)} » est insérée avant « ${motif} »`, domaine: "document",
      appliquer: (t) => {
        if (genre === "remplacer") { const s = String(t); return re.test(s) ? s.replace(re, () => neuf) : null; }
        const l = lignesDe(t); const i = l.findIndex((x) => re.test(x)); return i < 0 ? null : [...l.slice(0, i), neuf, ...l.slice(i)].join("\n");
      } };
  }
  const m = /^(section-retiree|section-videe|ligne-retiree):(.+)$/.exec(id);
  if (!m) return null;
  const [, genre, motif] = m;
  const re = new RegExp(motif, "i");
  const appliquer = (t) => {
    const l = lignesDe(t); const f = enFence(l);
    if (genre === "ligne-retiree") { const i = l.findIndex((x, k) => !f[k] && re.test(x)); return i < 0 ? null : [...l.slice(0, i), ...l.slice(i + 1)].join("\n"); }
    const s = sections(l).find((c) => re.test(l[c.debut]));
    if (!s) return null;
    return genre === "section-retiree" ? [...l.slice(0, s.debut), ...l.slice(s.fin)].join("\n") : [...l.slice(0, s.debut + 1), "", ...l.slice(s.fin)].join("\n");
  };
  const libelle = { "section-retiree": `la section « ${motif} » est retirée`, "section-videe": `le corps de la section « ${motif} » est vidé`, "ligne-retiree": `la première ligne portant « ${motif} » est retirée` }[genre];
  return { id, libelle, domaine: "document", appliquer };
}
