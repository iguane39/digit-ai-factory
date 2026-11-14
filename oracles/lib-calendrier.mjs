/**
 * lib-calendrier.mjs — LE CALENDRIER DES SÉANCES D'UN PRODUIT, LU ET JUGÉ (D-193 (a) du 10/11/2026, TF-2330, R-67).
 *
 * LE FAIT (lot du produit marketing du 09/11/2026, RP-07, ledger seq 693). La séance de formation du 13/11/2026 n'était écrite dans
 * aucun calendrier du produit : son seul fichier d'échéances tient les appels d'offres. La revue de fond n'a eu lieu que sur demande
 * humaine, le 09/11, quatre jours avant la séance, et elle a relevé neuf défauts (ledger seq 686). Rien ne déclenchait de revue.
 *
 * CE QUE FAIT CE MODULE. Il lit `forge/CALENDRIER.md` d'un produit (forme : `gabarits/CALENDRIER-PRODUIT.md`), juge sa forme — en-tête
 * daté et sourcé (loi n° 4), tableau des séances, et par ligne une date AAAA-MM-JJ, une séance, une source et un état de revue — puis
 * rend les séances de la fenêtre de préparation, de J-5 à J-0. Deux appelants : le hook d'ouverture du produit
 * (`oracles/hook-ouverture.mjs`) nomme la revue de chaque séance proche ; le hook d'écriture (`oracles/hook-ecriture.mjs`) juge la forme
 * au moment où le fichier s'écrit. Une séance passée ou à plus de 5 jours ne dit rien : un rappel permanent cesserait d'être lu.
 *
 * CE QU'IL NE JUGE PAS : que la date soit juste, ni que toutes les séances du produit soient inscrites. Les dates de remise et les
 * appels d'offres n'entrent pas ici : la décision vise les séances datées seulement.
 */
export const FENETRE_JOURS = 5;
export const CHEMIN_CALENDRIER = "forge/CALENDRIER.md";
export const MODELE_CALENDRIER = "gabarits/CALENDRIER-PRODUIT.md";

const RE_JOUR = /^(\d{4})-(\d{2})-(\d{2})$/;
const pad = (n) => String(n).padStart(2, "0");

/** Une date AAAA-MM-JJ qui existe au calendrier (le 2026-02-30 n'existe pas). */
export function dateValide(s) {
  const m = RE_JOUR.exec(String(s || ""));
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

/** Le jour LOCAL du poste, AAAA-MM-JJ : une séance se tient à une date locale, pas à une date UTC. */
export function jourLocal(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Nombre de jours de `de` à `a` (AAAA-MM-JJ) : positif si `a` est après `de`. */
export function ecartJours(de, a) {
  const t = (s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
  return Math.round((t(a) - t(de)) / 86400000);
}

const normaliser = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const nu = (s) => String(s || "").replace(/\*\*/g, "").replace(/^`|`$/g, "").trim();
const vide = (s) => { const n = nu(s); return !n || /^[—–-]+$/.test(n); };

/** Le frontmatter `--- … ---` en tête du texte : `{ cles, fin }` (fin = index de la ligne de clôture), ou null. */
export function frontmatter(lignes) {
  if ((lignes[0] || "").trim() !== "---") return null;
  const fin = lignes.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (fin < 0) return null;
  const cles = {};
  for (const l of lignes.slice(1, fin)) {
    const m = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(l);
    if (m) cles[m[1]] = m[2].trim();
  }
  return { cles, fin };
}

/** Les défauts de l'en-tête daté et sourcé (loi n° 4) — partagé avec le registre des engagements. */
export function defautsEntete(lignes, quoi) {
  const fm = frontmatter(lignes);
  if (!fm) return [{ ligne: 1, message: `en-tête daté et sourcé absent (--- date, source, verifie_le ---) : ${quoi} est une donnée volatile, datée et sourcée (loi n° 4)` }];
  const d = [];
  for (const cle of ["date", "verifie_le"]) {
    if (!(cle in fm.cles)) d.push({ ligne: 1, message: `en-tête : clé « ${cle} » absente` });
    else if (!dateValide(fm.cles[cle])) d.push({ ligne: 1, message: `en-tête : « ${cle}: ${fm.cles[cle].slice(0, 30)} » n'est pas une date AAAA-MM-JJ` });
  }
  if (!fm.cles.source || /^<.*>$/.test(fm.cles.source)) d.push({ ligne: 1, message: "en-tête : « source » absente ou non remplie" });
  return d;
}

/** Découpe une ligne de tableau Markdown en cellules (la barre échappée `\|` reste dans sa cellule). */
export function cellules(ligne) {
  const t = ligne.trim().replace(/\\\|/g, "\u0000");
  if (!t.startsWith("|")) return null;
  return t.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.replace(/\u0000/g, "|").trim());
}

/**
 * Le premier tableau dont l'en-tête porte toutes les colonnes `requises` (motifs sur l'en-tête normalisé) : `{ entete, index, rangs }`,
 * `rangs` étant `[{ ligne, cells }]` (numéros de ligne à partir de 1). Rend null si aucun tableau ne convient.
 */
export function tableau(lignes, requises) {
  for (let i = 0; i < lignes.length - 1; i++) {
    const c = cellules(lignes[i]);
    if (!c) continue;
    const entete = c.map(normaliser);
    if (!requises.every((re) => entete.some((h) => re.test(h)))) continue;
    if (!/^\s*\|?\s*:?-{2,}/.test(lignes[i + 1] || "")) continue;
    const rangs = [];
    for (let k = i + 2; k < lignes.length; k++) {
      const r = cellules(lignes[k]);
      if (!r) break;
      rangs.push({ ligne: k + 1, cells: r });
    }
    return { entete, index: i + 1, rangs };
  }
  return null;
}

const COLONNES = {
  date: /^date/, seance: /^seance/, pourQui: /^pour qui/, documents: /^documents?/, revue: /revue/, source: /^source/,
};

/**
 * Lit un calendrier : `{ seances, defauts }`. Une séance porte `{ ligne, date, seance, pourQui, documents, revue, source }`, `revue` valant
 * `{ etat: "a_faire" }` ou `{ etat: "faite", le }`. Une ligne mal formée n'est pas une séance : elle est un défaut, avec son numéro.
 */
export function lireCalendrier(texte) {
  const lignes = String(texte || "").split(/\r?\n/);
  const defauts = defautsEntete(lignes, "le calendrier des séances");
  const t = tableau(lignes, [COLONNES.date, COLONNES.seance]);
  if (!t) {
    defauts.push({ ligne: null, message: "aucun tableau des séances (en-tête « | Date | Séance | … | Revue de préparation | Source | », suivi de sa ligne de séparation)" });
    return { seances: [], defauts };
  }
  const col = {};
  for (const [cle, re] of Object.entries(COLONNES)) col[cle] = t.entete.findIndex((h) => re.test(h));
  for (const cle of ["revue", "source"]) if (col[cle] < 0) defauts.push({ ligne: t.index, message: `colonne « ${cle === "revue" ? "Revue de préparation" : "Source"} » absente de l'en-tête du tableau des séances` });
  const seances = [];
  for (const { ligne, cells } of t.rangs) {
    const v = (cle) => (col[cle] >= 0 ? cells[col[cle]] || "" : "");
    // La ligne d'exemple du modèle, « *(aucune)* », n'est pas une séance.
    if (/^\*?\(aucune?\)\*?$/i.test(nu(v("date"))) || /^\*?\(aucune?\)\*?$/i.test(nu(v("seance")))) continue;
    const brute = nu(v("date"));
    const m = /^(\d{4}-\d{2}-\d{2})(?:\s+(?:à\s+)?\d{1,2}[:h]\d{2})?$/.exec(brute);
    const ko = [];
    if (!m || !dateValide(m[1])) ko.push(`date « ${brute.slice(0, 30) || "(vide)"} » hors du format AAAA-MM-JJ, ou qui n'existe pas`);
    if (vide(v("seance"))) ko.push("séance non nommée");
    if (col.source >= 0 && vide(v("source"))) ko.push("source de la date absente (d'où vient-elle : convention, courriel, décision consignée ?)");
    let revue = null;
    if (col.revue >= 0) {
      const r = normaliser(nu(v("revue")));
      const faite = /^faite le (\d{4}-\d{2}-\d{2})/.exec(r);
      if (/^a faire$/.test(r)) revue = { etat: "a_faire" };
      else if (faite && dateValide(faite[1])) revue = { etat: "faite", le: faite[1] };
      else ko.push(`revue de préparation « ${nu(v("revue")).slice(0, 30) || "(vide)"} » : écrire « à faire » ou « faite le AAAA-MM-JJ »`);
    }
    if (ko.length) { defauts.push({ ligne, message: `${ko.join(" ; ")} — cette séance n'est pas lue, et sa revue ne sera pas rappelée` }); continue; }
    const documents = [...String(v("documents")).matchAll(/`([^`]+)`/g)].map((x) => x[1].trim()).filter(Boolean);
    seances.push({ ligne, date: m[1], seance: nu(v("seance")), pourQui: vide(v("pourQui")) ? null : nu(v("pourQui")), documents, revue: revue || { etat: "a_faire" }, source: nu(v("source")) });
  }
  return { seances, defauts };
}

/** Les séances de la fenêtre de préparation (J-5 à J-0), triées par date, chacune avec son `j` (jours restants). */
export function seancesProches(cal, jour, fenetre = FENETRE_JOURS) {
  return (cal.seances || [])
    .map((s) => ({ ...s, j: ecartJours(jour, s.date) }))
    .filter((s) => s.j >= 0 && s.j <= fenetre)
    .sort((a, b) => a.j - b.j);
}

/** Ce que la revue de préparation couvre : la liste lue par le hook d'ouverture, et citée par la règle et le contrat produit. */
export const COUVERTURE_REVUE = [
  "chaque engagement des documents de la séance (pièce, temps, outil promis) tenu par un livrable présent ou une action nommée",
  "le matériel de celui qui anime : notes, corrigés, fichiers d'exercice, outils à installer, et le minutage tenu dans le créneau",
  "la cohérence des pièces entre elles : mêmes contenus, mêmes durées, mêmes dates",
  "les mentions restées ouvertes : « à compléter », « à vérifier », dates et pieds de page périmés",
  "chaque pièce jugée par l'oracle de son domaine (skill `quality-oracles`)",
];

const guillemets = (p) => `"${String(p).replace(/\\/g, "/")}"`;

/**
 * Les lignes du relevé d'ouverture : séances proches (revue à faire ou faite), puis défauts de forme. Vide quand rien n'est à dire.
 * `oracleEngagements` est le chemin RÉSOLU de `oracle-engagements.mjs` du pilot (un chemin relatif échoue chez un produit, TF-2335) ;
 * `modele`, celui du modèle de calendrier.
 */
export function lignesSeances(cal, jour, { oracleEngagements, modele } = {}) {
  const out = [];
  const proches = seancesProches(cal, jour);
  if (proches.length) {
    out.push(`## Séances datées dans les ${FENETRE_JOURS} jours : revue de préparation (D-193 (a), TF-2330 — ${CHEMIN_CALENDRIER})`);
    for (const s of proches) {
      const quand = s.j === 0 ? "AUJOURD'HUI (J-0)" : `dans ${s.j} jour${s.j > 1 ? "s" : ""} (J-${s.j})`;
      const qui = s.pourQui ? ` — pour ${s.pourQui}` : "";
      if (s.revue.etat === "faite") { out.push(`- Séance du ${s.date}, ${quand} : ${s.seance}${qui} — revue de préparation faite le ${s.revue.le}.`); continue; }
      const commande = oracleEngagements
        ? `\`node ${guillemets(oracleEngagements)} .${s.documents.map((d) => ` --documents ${guillemets(d)}`).join("")}\``
        : "`oracle-engagements.mjs` du pilot";
      out.push(`- **Séance du ${s.date}, ${quand} : ${s.seance}${qui} — revue de préparation À FAIRE** (ligne ${s.ligne}). Engagements de ses documents : ${commande}${s.documents.length ? "" : " (colonne « Documents » vide : seul le registre est jugé, pas les documents de la séance)"}.`);
    }
    if (proches.some((s) => s.revue.etat !== "faite")) {
      out.push(`- La revue couvre : ${COUVERTURE_REVUE.map((c, i) => `(${i + 1}) ${c}`).join(" ; ")}. `
        + "Elle se joue par un agent `verificateur` sur ces 5 points ; ce qu'elle relève se corrige avant la séance, puis la colonne « Revue de préparation » passe à « faite le AAAA-MM-JJ ».");
    }
  }
  if ((cal.defauts || []).length) {
    out.push(`## Calendrier des séances mal formé (D-193 (a), TF-2330 — ${CHEMIN_CALENDRIER})`);
    for (const d of cal.defauts.slice(0, 8)) out.push(`- ${d.ligne ? `ligne ${d.ligne} : ` : ""}${d.message}`);
    if (cal.defauts.length > 8) out.push(`- … et ${cal.defauts.length - 8} autre(s) défaut(s)`);
    out.push(`- Forme attendue : ${modele ? `\`${String(modele).replace(/\\/g, "/")}\`` : MODELE_CALENDRIER} du pilot.`);
  }
  return out;
}

/** La naissance d'un fichier depuis son modèle : les dates `AAAA-MM-JJ` de l'en-tête deviennent le jour de création, le corps reste. */
export function instancierNaissance(texteModele, jour) {
  const eol = /\r\n/.test(texteModele) ? "\r\n" : "\n";
  const lignes = String(texteModele).split(/\r?\n/);
  const fm = frontmatter(lignes);
  if (!fm) return texteModele;
  for (let i = 1; i < fm.fin; i++) lignes[i] = lignes[i].replace(/AAAA-MM-JJ/g, jour);
  return lignes.join(eol);
}
