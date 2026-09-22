#!/usr/bin/env node
/**
 * oracle-run-reseau.mjs — juge UNE SEMAINE d'un run d'animation de réseau
 * (`references\RUN-RESEAU.md`, TF-1158, décision humaine D-2 (a) du 17/09/2026).
 *
 * Pourquoi un oracle : le type de run disait de lui-même « tant que la semaine d'essai n'a pas
 * tourné, ce document décrit une séquence, il ne la prouve pas ». Une séquence hebdomadaire qui
 * ne se juge qu'à la relecture ne tient pas trois semaines : c'est le rendez-vous qui manquait
 * (0 publication en 6 jours chez le produit), donc c'est lui qui se contrôle.
 *
 * PARAMÉTRÉ PAR RÉSEAU ET PAR TYPE D'ÉMETTEUR (TF-1278, décision humaine D-12 (a) du 21/09/2026).
 * Jusqu'au 21/09, RR2 portait EN DUR le contrat d'un seul modèle, le texte de 150 à 300 mots écrit
 * pour LinkedIn : le contrôle aurait refusé toute légende d'image, tout texte court, toute
 * réponse à un avis. Le contrat est désormais une DONNÉE (loi n° 4), publiée par forge-agents :
 * `digit-ai-communication\references\contrats-publication.json`. Une semaine porte un LOT de
 * publications, chacune déclarant son réseau et son modèle, et l'accord humain couvre le lot.
 *
 * Ce qu'il lit : un DOSSIER de semaine —
 *   emetteur.json       N0 : la fiche « émetteur et réseaux », dans le dossier de la semaine ou
 *                       dans son parent (elle s'écrit une fois, à l'ouverture du run) ;
 *   calendrier.md       N1 : horizon de 4 semaines, une ligne de tableau par publication prévue ;
 *   publication*.md     N2 : le LOT. Frontmatter : `reseau:`, `modele:` (défaut : linkedin et
 *                       publication-reseau, pour les semaines écrites avant le 21/09),
 *                       `genere: true|false`, et la pièce que le contrat exige — `visuel: <fichier>`
 *                       ou `avis: <fichier>`, présent dans le dossier ;
 *   accord.json         N3 : { accord, date, par, lot:[fichiers], fictif } — l'accord HUMAIN (R-38) ;
 *   mesures.json        N5 : { export, temps_humain_minutes, indicateurs:[{nom,valeur,seuil}] }.
 *
 * Règles (chacune binaire) :
 *   RR1 calendrier présent, ≥ 4 lignes de publication datées (horizon de 4 semaines) ;
 *   RR2 chaque publication du lot tient le contrat de sortie du modèle qu'elle DÉCLARE : longueur,
 *       accroche, clôture, hashtags, pièce requise ; le modèle déclaré sert le réseau déclaré ;
 *   RR3 faits chiffrés sourcés — `oracle-claims` de forge-agents, verdict repris tel quel ;
 *   RR4 transparence — `oracle-transparence` de forge-agents (TF-1030), verdict repris tel quel ;
 *   RR5 accord de publication consigné AVANT toute publication : `accord: true`, daté, nommé ;
 *       dès que le lot compte plus d'une publication, `lot` les nomme TOUTES — un accord donné
 *       sur 2 textes ne couvre pas le 3e ;
 *   RR6 mesure : un export nommé, le temps humain de la semaine en minutes, 1 à 3 indicateurs
 *       chacun avec sa valeur ET son seuil ;
 *   RR7 fiche « émetteur et réseaux » : type d'émetteur, réseaux retenus, un modèle par réseau
 *       qui le sert, gouvernance de chaque compte (au moins un rôle, double facteur déclaré,
 *       reprise prévue), AUCUN secret ; chaque publication vise un réseau de la fiche.
 *
 * Ce qu'il ne juge PAS, et ne jugera jamais : la qualité du texte contre sa barre externe (lecture
 * humaine, `la-barre`), la sincérité d'un accord, la véracité d'un export, le fait que la
 * publication ait eu lieu ou ait été programmée — l'humain programme dans l'outil gratuit de la
 * plateforme (`references\PLATEFORMES-RESEAUX.md`) —, ni la part NON mécanisable de chaque contrat
 * de sortie, qui reste écrite en prose chez forge-agents.
 *
 * Usage : node oracles\oracle-run-reseau.mjs <dossier-semaine> [--mentions <f.json>]
 *         node oracles\oracle-run-reseau.mjs --self-test     → semaines à blanc, double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = process.env.FORGE_ROOT || resolve(ICI, "..", "..");
const SKILLS = join(RACINE, "digit-ai-forge-agents", ".claude", "skills");
const QO = join(SKILLS, "quality-oracles", "scripts");
const CONTRATS = join(SKILLS, "digit-ai-communication", "references", "contrats-publication.json");
const TYPES_EMETTEUR = ["A1", "A2"]; // A1 société de conseil · A2 commerce de proximité (étude 20260921a, axe A)
const MODELE_PAR_DEFAUT = "publication-reseau";
const RESEAU_PAR_DEFAUT = "linkedin";

/** Joue un oracle de forge-agents et rend son verdict ; absent ou illisible → SKIP motivé. */
function jouer(script, args) {
  const chemin = join(QO, script);
  if (!existsSync(chemin)) return { verdict: "SKIP", motif: `${script} introuvable sous ${QO}` };
  const r = spawnSync(process.execPath, [chemin, ...args], { encoding: "utf8" });
  try { return JSON.parse(r.stdout); } catch { return { verdict: "SKIP", motif: `${script} : sortie illisible` }; }
}

function corpsSansFrontmatter(texte) {
  return texte.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

/** Frontmatter à plat : `cle: valeur`, une par ligne. Aucune structure imbriquée n'est attendue. */
function frontmatter(texte) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(texte);
  const sortie = {};
  if (m) for (const l of m[1].split(/\r?\n/)) { const k = /^([A-Za-z_]+)\s*:\s*(.*)$/.exec(l); if (k) sortie[k[1]] = k[2].trim(); }
  return sortie;
}

/** Les contrats de sortie publiés par forge-agents ; absents ou illisibles → null, et RR2 le dit. */
export function chargerContrats(chemin = CONTRATS) {
  try { const c = JSON.parse(readFileSync(chemin, "utf8")); return c && c.modeles ? c.modeles : null; } catch { return null; }
}

/** Défauts d'UNE publication contre SON contrat. Rend [] quand le contrat est tenu. */
export function defautsDuContrat(texte, contrat, dossier) {
  const fm = frontmatter(texte);
  const corps = corpsSansFrontmatter(texte).trim();
  const mots = corps.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m) && !m.startsWith("#")).length;
  const lignes = corps.split(/\r?\n/).filter((l) => l.trim());
  const hashtags = (corps.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
  const sansHashtags = lignes.filter((l) => !/^(\s*#[\p{L}\p{N}_]+)+\s*$/u.test(l));
  const cloture = sansHashtags[sansHashtags.length - 1] || "";
  const defauts = [];
  const [min, max] = contrat.mots;
  if (mots < min || mots > max) defauts.push(`${mots} mots (${min} à ${max} attendus)`);
  if (contrat.accroche_min_caracteres > 0 && (!lignes[0] || lignes[0].length < contrat.accroche_min_caracteres)) defauts.push("accroche absente ou trop courte en tête");
  if (contrat.cloture === "question_ou_appel" &&
    !/\?\s*$|(dites|écrivez|racontez|partagez|répondez|réservez|appelez|venez|passez|contactez)[^.]*[.!]?\s*$/i.test(cloture)) defauts.push("clôture sans question ni appel");
  if (hashtags > contrat.hashtags_max) defauts.push(`${hashtags} hashtag(s) (${contrat.hashtags_max} au plus)`);
  if (contrat.piece_requise) {
    const nom = fm[contrat.piece_requise];
    if (!nom) defauts.push(`pièce « ${contrat.piece_requise} » non déclarée au frontmatter`);
    else if (!existsSync(join(dossier, nom)) || !readFileSync(join(dossier, nom)).length) defauts.push(`pièce « ${contrat.piece_requise} » déclarée (${nom}) mais absente ou vide dans le dossier`);
  }
  return { defauts, mots, hashtags };
}

export function juger(dossier, { mentions, contrats = chargerContrats() } = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const lire = (nom, base = dossier) => (existsSync(join(base, nom)) ? readFileSync(join(base, nom), "utf8") : null);

  // RR1 — calendrier à 4 semaines
  const cal = lire("calendrier.md");
  const lignesDatees = (cal || "").split(/\r?\n/).filter((l) => /^\|/.test(l.trim()) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l));
  if (!cal) ko("RR1", "calendrier.md absent — le rendez-vous hebdomadaire n'a pas de support");
  else if (lignesDatees.length < 4) ko("RR1", `${lignesDatees.length} publication(s) datée(s) au calendrier — l'horizon est de 4 semaines`);
  else ok("RR1", `${lignesDatees.length} publication(s) datée(s) au calendrier`);

  // Le LOT de la semaine : publication.md, publication-<réseau>.md, …
  const lot = (existsSync(dossier) ? readdirSync(dossier) : []).filter((f) => /^publication.*\.md$/i.test(f)).sort();
  const declarations = lot.map((f) => { const fm = frontmatter(lire(f)); return { fichier: f, reseau: fm.reseau || RESEAU_PAR_DEFAUT, modele: fm.modele || MODELE_PAR_DEFAUT }; });

  // RR2 — chaque publication tient le contrat du modèle qu'elle déclare
  if (!lot.length) ko("RR2", "aucune publication*.md dans le dossier de la semaine");
  else if (!contrats) ko("RR2", `contrats de sortie introuvables ou illisibles (${CONTRATS}) — un contrat absent ne rend jamais PASS`);
  else {
    const fautes = [];
    const tenus = [];
    for (const d of declarations) {
      const contrat = contrats[d.modele];
      if (!contrat) { fautes.push(`${d.fichier} : modèle « ${d.modele} » inconnu des contrats`); continue; }
      if (!contrat.reseaux.includes(d.reseau)) { fautes.push(`${d.fichier} : le modèle « ${d.modele} » ne sert pas le réseau « ${d.reseau} » (il sert ${contrat.reseaux.join(", ")})`); continue; }
      const { defauts, mots, hashtags } = defautsDuContrat(lire(d.fichier), contrat, dossier);
      defauts.length ? fautes.push(`${d.fichier} [${d.modele}] : ${defauts.join(" · ")}`) : tenus.push(`${d.fichier} [${d.modele}] ${mots} mots, ${hashtags} hashtag(s)`);
    }
    fautes.length ? ko("RR2", `contrat de sortie non tenu — ${fautes.join(" | ")}`) : ok("RR2", `contrat de sortie tenu — ${tenus.join(" | ")}`);
  }

  // RR3, RR4 — verdicts repris des oracles de forge-agents, jamais rejugés ici ; un par publication
  if (lot.length) {
    const rouges3 = [], rouges4 = [], vus3 = [], vus4 = [];
    for (const f of lot) {
      const chemin = join(dossier, f);
      const claims = jouer("oracle-claims.mjs", [chemin]);
      claims.verdict === "FAIL" ? rouges3.push(f) : vus3.push(`${f} ${claims.verdict}${claims.motif ? ` (${claims.motif})` : ""}`);
      const tr = jouer("oracle-transparence.mjs", mentions ? [chemin, "--mentions", mentions] : [chemin]);
      tr.verdict === "FAIL" ? rouges4.push(f) : vus4.push(`${f} ${tr.verdict}${tr.motif ? ` (${tr.motif})` : ""}`);
    }
    rouges3.length ? ko("RR3", `oracle-claims FAIL — un chiffre sans source : ${rouges3.join(", ")}`) : ok("RR3", `oracle-claims — ${vus3.join(" | ")}`);
    rouges4.length ? ko("RR4", `oracle-transparence FAIL — contenu généré sans mention lisible : ${rouges4.join(", ")}`) : ok("RR4", `oracle-transparence — ${vus4.join(" | ")}`);
  }

  // RR5 — accord humain de publication, par LOT
  let accord = null;
  try { accord = JSON.parse(lire("accord.json") || "null"); } catch { /* jugé ci-dessous */ }
  const horsLot = lot.length > 1 ? lot.filter((f) => !(accord && Array.isArray(accord.lot) && accord.lot.includes(f))) : [];
  if (!accord) ko("RR5", "accord.json absent ou illisible — aucune publication sans accord consigné (R-38)");
  else if (accord.accord !== true || !/^20\d{2}-\d{2}-\d{2}/.test(accord.date || "") || !accord.par)
    ko("RR5", "accord incomplet : `accord: true`, une `date` et un `par` sont dus");
  else if (horsLot.length) ko("RR5", `l'accord ne couvre pas tout le lot — hors \`lot\` : ${horsLot.join(", ")}`);
  else ok("RR5", `accord consigné le ${accord.date} sur ${lot.length} publication(s)${accord.fictif ? " (FICTIF — semaine à blanc)" : ""}`);

  // RR6 — mesure de la semaine
  let mes = null;
  try { mes = JSON.parse(lire("mesures.json") || "null"); } catch { /* jugé ci-dessous */ }
  const ind = (mes && Array.isArray(mes.indicateurs)) ? mes.indicateurs : [];
  const incomplets = ind.filter((i) => !i.nom || typeof i.valeur !== "number" || typeof i.seuil !== "number");
  if (!mes) ko("RR6", "mesures.json absent ou illisible — une semaine sans mesure ne démontre aucun gain");
  else if (!mes.export || typeof mes.temps_humain_minutes !== "number") ko("RR6", "`export` nommé et `temps_humain_minutes` sont dus");
  else if (ind.length < 1 || ind.length > 3 || incomplets.length) ko("RR6", `${ind.length} indicateur(s), ${incomplets.length} incomplet(s) — 1 à 3, chacun avec valeur et seuil`);
  else ok("RR6", `${ind.length} indicateur(s) lus contre leur seuil, ${mes.temps_humain_minutes} min de temps humain`);

  // RR7 — fiche « émetteur et réseaux », dans la semaine ou dans son parent
  const brut = lire("emetteur.json") ?? lire("emetteur.json", dirname(resolve(dossier)));
  let fiche = null;
  try { fiche = JSON.parse(brut || "null"); } catch { /* jugé ci-dessous */ }
  if (!fiche) ko("RR7", "emetteur.json absent ou illisible — ni dans le dossier de la semaine, ni dans son parent");
  else {
    const fautes = [];
    // UN SECRET N'A RIEN À FAIRE ICI. La fiche dit QUI a accès, jamais AVEC QUOI.
    if (/mot[ _-]?de[ _-]?passe|password|passwd|secret|token|jeton|api[ _-]?key|cl[ée][ _-]?api/i.test(brut)) fautes.push("un champ ou une valeur évoque un secret (mot de passe, jeton, clé) — la fiche nomme des rôles, jamais un identifiant");
    if (!TYPES_EMETTEUR.includes(fiche.type_emetteur)) fautes.push(`type_emetteur hors ensemble fermé (${TYPES_EMETTEUR.join(" | ")})`);
    const reseaux = Array.isArray(fiche.reseaux) ? fiche.reseaux : [];
    if (!reseaux.length) fautes.push("aucun réseau retenu");
    for (const r of reseaux) {
      const modele = fiche.modeles && fiche.modeles[r];
      if (!modele) fautes.push(`réseau « ${r} » sans modèle`);
      else if (contrats && !(contrats[modele] && contrats[modele].reseaux.includes(r))) fautes.push(`réseau « ${r} » : le modèle « ${modele} » ne le sert pas`);
      const g = (Array.isArray(fiche.gouvernance) ? fiche.gouvernance : []).find((x) => x && x.reseau === r);
      if (!g) fautes.push(`réseau « ${r} » sans ligne de gouvernance`);
      else if (!Array.isArray(g.roles) || !g.roles.length || typeof g.double_facteur !== "boolean" || !g.reprise) fautes.push(`gouvernance de « ${r} » incomplète : \`roles\` non vide, \`double_facteur\` déclaré, \`reprise\` écrite`);
    }
    for (const d of declarations) if (reseaux.length && !reseaux.includes(d.reseau)) fautes.push(`${d.fichier} vise « ${d.reseau} », absent de la fiche`);
    fautes.length ? ko("RR7", `fiche « émetteur et réseaux » en défaut — ${fautes.join(" | ")}`) : ok("RR7", `émetteur ${fiche.type_emetteur}, ${reseaux.length} réseau(x) : ${reseaux.join(", ")}`);
  }

  return findings;
}

const NON_JUGE = [
  "la qualité du texte contre sa barre externe (lecture humaine, registre la-barre)",
  "la part non mécanisable de chaque contrat de sortie : fait repris de l'avis, absence de justification, offre datée — prose de digit-ai-communication, lecture humaine",
  "la sincérité de l'accord et la véracité de l'export",
  "le fait que la publication ait eu lieu ou ait été programmée : geste humain, dans l'outil de la plateforme",
  "la réalité du double facteur et des rôles déclarés à la fiche : ils se déclarent, ils ne se sondent pas",
];

function rendre(cible, findings) {
  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-run-reseau", cible, verdict, findings, non_juge: NON_JUGE }, null, 1));
  process.exit(verdict === "PASS" ? 0 : 1);
}

// ── Autotest : LES SEMAINES À BLANC, dans les deux sens ───────────────────────────────────────
const MENTION = "Texte rédigé avec l'aide d'une IA, relu et assumé par son auteur.";
const FICHE_VERTE = {
  type_emetteur: "A2",
  reseaux: ["linkedin", "instagram", "fiche-etablissement"],
  modeles: { linkedin: "publication-reseau", instagram: "legende-image", "fiche-etablissement": "reponse-avis" },
  gouvernance: ["linkedin", "instagram", "fiche-etablissement"].map((reseau) => ({ reseau, roles: ["propriétaire : le gérant", "rédacteur : un salarié désigné"], double_facteur: true, reprise: "le gérant garde le rôle propriétaire ; un départ retire le rôle le jour même" })),
};

function semaine(dir, { rouge }) {
  mkdirSync(dir, { recursive: true });
  const dates = ["2026-09-22", "2026-09-29", "2026-10-06", "2026-10-13"];
  writeFileSync(join(dir, "calendrier.md"), "| Date | Réseau | Pilier | Sujet | Statut |\n|---|---|---|---|---|\n" +
    (rouge ? dates.slice(0, 2) : dates).map((d) => `| ${d} | linkedin | méthode | sujet fictif | prévu |`).join("\n") + "\n");
  const phrase = "Nous avons mesuré avant de conclure, et la mesure a contredit notre première lecture du dossier. ";
  const corpsVert = "Une étude faite en une matinée peut éviter de construire ce qu'il ne fallait pas construire.\n\n" +
    phrase.repeat(9) + "\n\nEn 2025, 72 % des acheteurs vérifiaient un contenu généré (source : enquête citée par une étude fictive du 2026-09-11, section 3).\n\n" +
    MENTION + "\n\nEt vous, quelle question posez-vous avant de lancer un chantier ?\n\n#méthode #décision #conseil\n";
  const corpsRouge = "Notre offre fait gagner 45 000 € par an à chaque client.\n\n#a #b #c #d #e #f #g\n";
  // La semaine ROUGE garde la forme d'avant le 21/09 : un seul fichier, sans réseau ni modèle déclarés.
  // Elle prouve aussi que les défauts (linkedin, publication-reseau) s'appliquent.
  writeFileSync(join(dir, rouge ? "publication.md" : "publication-linkedin.md"),
    `---\n${rouge ? "" : "reseau: linkedin\nmodele: publication-reseau\n"}compte: profil\ngenere: true\n---\n${rouge ? corpsRouge : corpsVert}`);
  if (!rouge) {
    writeFileSync(join(dir, "visuel-terrasse.png"), "image fictive");
    writeFileSync(join(dir, "publication-instagram.md"), "---\nreseau: instagram\nmodele: legende-image\nvisuel: visuel-terrasse.png\ngenere: true\n---\n" +
      "La terrasse rouvre ce vendredi, et la carte d'automne arrive avec elle.\n\n" +
      "Le chef a gardé 3 plats de l'été et en ajoute 4, tous cuisinés avec des légumes de la ferme voisine, livrés le matin même. " +
      "Le service du midi commence à 12 h et celui du soir à 19 h, du mardi au samedi.\n\n" + MENTION + "\n\n" +
      "Quel plat d'automne attendez-vous le plus ?\n\n#terrasse #automne\n");
    writeFileSync(join(dir, "avis-2026-09-20.md"), "Avis collé par le gérant le 2026-09-20 — 4 étoiles : « Très bon repas, mais 25 minutes d'attente avant de commander. »\n");
    writeFileSync(join(dir, "publication-avis.md"), "---\nreseau: fiche-etablissement\nmodele: reponse-avis\navis: avis-2026-09-20.md\ngenere: true\n---\n" +
      "Merci pour votre retour sur le repas. L'attente avant la commande était trop longue ce soir-là, vous avez raison de le dire. " +
      "Depuis lundi, une personne de plus prend les commandes en salle le samedi soir. " +
      "Si vous revenez, dites-le à l'accueil : nous aimerions vous montrer la différence.\n\n" + MENTION + "\n");
    writeFileSync(join(dir, "emetteur.json"), JSON.stringify(FICHE_VERTE, null, 1));
    writeFileSync(join(dir, "accord.json"), JSON.stringify({ accord: true, date: "2026-09-22", par: "émetteur fictif", lot: ["publication-avis.md", "publication-instagram.md", "publication-linkedin.md"], fictif: true }));
  }
  writeFileSync(join(dir, "mesures.json"), JSON.stringify(rouge ? { indicateurs: [] } : {
    export: "export-fictif-2026-09-29.xlsx", temps_humain_minutes: 40,
    indicateurs: [{ nom: "impressions par publication", valeur: 900, seuil: 500 }, { nom: "taux d'engagement", valeur: 2.1, seuil: 2 }, { nom: "demandes de contact", valeur: 1, seuil: 1 }],
  }));
}

const arg = process.argv[2];
if (arg === "--self-test") {
  const base = mkdtempSync(join(tmpdir(), "run-reseau-"));
  const casse = [];
  const enEchec = (f) => f.filter((x) => x.statut === "FAIL").map((x) => x.regle);
  let cas = 0;
  try {
    // 1 et 2 — la semaine verte passe, la semaine rouge échoue sur CHAQUE règle
    semaine(join(base, "verte"), { rouge: false });
    semaine(join(base, "rouge"), { rouge: true });
    const v = juger(join(base, "verte"));
    const r = juger(join(base, "rouge"));
    cas += 2;
    if (enEchec(v).length) casse.push(`la semaine verte échoue sur ${enEchec(v).join(", ")} : ${v.filter((x) => x.statut === "FAIL").map((x) => x.message).join(" | ")}`);
    for (const regle of ["RR1", "RR2", "RR3", "RR4", "RR5", "RR6", "RR7"])
      if (!enEchec(r).includes(regle)) casse.push(`la semaine rouge n'échoue pas sur ${regle}`);
    const joues = v.filter((x) => /^RR[34]$/.test(x.regle) && /introuvable|illisible/.test(x.message)).map((x) => x.regle);
    if (joues.length) casse.push(`oracle(s) de forge-agents non joué(s) (${joues.join(", ")}) — la semaine à blanc ne prouve rien sans eux`);

    // 3 à 8 — UNE altération de la semaine verte, UNE règle rouge, et elle NOMME ce qu'elle voit.
    // Une semaine rouge qui échoue partout ne prouve pas qu'une règle discrimine.
    const alterer = (nom, geste, regle, motif) => {
      const d = join(base, nom);
      semaine(d, { rouge: false });
      geste(d);
      const f = juger(d);
      cas++;
      const rouges = enEchec(f);
      const message = (f.find((x) => x.regle === regle) || {}).message || "";
      if (rouges.length !== 1 || rouges[0] !== regle) casse.push(`${nom} : attendu ${regle} seule, obtenu ${rouges.join(", ") || "aucune"}`);
      else if (!message.includes(motif)) casse.push(`${nom} : ${regle} rougit sans nommer « ${motif} » — ${message}`);
    };
    alterer("lot-non-couvert", (d) => writeFileSync(join(d, "accord.json"), JSON.stringify({ accord: true, date: "2026-09-22", par: "émetteur fictif", lot: ["publication-linkedin.md", "publication-instagram.md"], fictif: true })), "RR5", "publication-avis.md");
    alterer("visuel-absent", (d) => rmSync(join(d, "visuel-terrasse.png")), "RR2", "publication-instagram.md");
    alterer("modele-hors-reseau", (d) => writeFileSync(join(d, "publication-avis.md"), readFileSync(join(d, "publication-avis.md"), "utf8").replace("modele: reponse-avis", "modele: legende-image")), "RR2", "ne sert pas le réseau");
    alterer("reponse-trop-longue", (d) => writeFileSync(join(d, "publication-avis.md"), readFileSync(join(d, "publication-avis.md"), "utf8").replace("Merci pour votre retour sur le repas.", "Merci pour votre retour sur le repas. " + "Nous tenons à vous répondre longuement et en détail. ".repeat(14))), "RR2", "20 à 120 attendus");
    alterer("secret-a-la-fiche", (d) => writeFileSync(join(d, "emetteur.json"), JSON.stringify({ ...FICHE_VERTE, mot_de_passe: "fictif" })), "RR7", "secret");
    alterer("reseau-hors-fiche", (d) => writeFileSync(join(d, "emetteur.json"), JSON.stringify({ ...FICHE_VERTE, reseaux: ["linkedin", "fiche-etablissement"] })), "RR7", "publication-instagram.md");

    // 9 — contrats introuvables : RR2 rougit, elle ne passe jamais par défaut
    semaine(join(base, "sans-contrats"), { rouge: false });
    const sc = juger(join(base, "sans-contrats"), { contrats: null });
    cas++;
    if (!enEchec(sc).includes("RR2")) casse.push("contrats absents : RR2 ne rougit pas — un contrat absent rendrait PASS");
  } finally { rmSync(base, { recursive: true, force: true }); }
  console.log(JSON.stringify({ outil: "oracle-run-reseau --self-test", verdict: casse.length ? "FAIL" : "PASS", cas, regles: 7, casse }, null, 1));
  console.log(`Self-test run-reseau : ${casse.length ? "FAIL" : `${cas}/${cas} PASS`} (semaine verte à 3 publications PASS ; semaine rouge FAIL sur RR1 à RR7 ; 6 altérations à une règle ; contrats absents)`);
  process.exit(casse.length ? 1 : 0);
}
if (!arg || !existsSync(arg)) { console.log(JSON.stringify({ oracle: "oracle-run-reseau", verdict: "SKIP", motif: "dossier de semaine absent" })); process.exit(2); }
const iM = process.argv.indexOf("--mentions");
rendre(arg, juger(arg, { mentions: iM > 0 ? process.argv[iM + 1] : undefined }));
