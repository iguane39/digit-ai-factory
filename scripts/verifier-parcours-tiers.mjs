#!/usr/bin/env node
/**
 * verifier-parcours-tiers.mjs — un parcours tiers embarqué dans un produit (paiement, réservation) se
 * vérifie de bout en bout, dans un navigateur, sur l'état exécuté, jusqu'à l'étape qui encaisse
 * (M-14 ; TF-1583 ; 13/10/2026).
 *
 * LE FAIT. Chez Produit-02, le 25/08/2026 (commit 3659a35), le cadre du moteur de réservation est
 * nommé ; la vérification porte sur le mécanisme (« les six contrôles passent »), pas sur la suite.
 * Le nom captait aussi la fenêtre du paiement, que la passerelle refuse d'exécuter dans un cadre. Le
 * 01/09, la politique de contenu ajoute 'self' à `frame-src` pour le retour de paiement sans
 * inventorier son départ vers les passerelles. Le 12/09, la provenance est mesurée par `curl` dans le
 * HTML servi, alors qu'un script la réécrit au chargement. L'exploitant le signale le 29/09 :
 * 35 jours sans paiement de l'acompte possible depuis le site. Le correctif du produit (be7a376) joue
 * un clic réel, atteint le formulaire des coordonnées sans le valider, rejoue la navigation vers la
 * passerelle depuis son contexte de départ, et écrit « à confirmer » quand seul un paiement réel
 * tranche.
 *
 * CE QUI EST JUGÉ, HORS LIGNE, sur les fichiers d'un produit :
 *   PT-1  un parcours tiers embarqué est RELEVÉ : un cadre intégré (`<iframe src="https://…">`), une
 *         directive `frame-src`, `child-src` ou `form-action` qui nomme un hôte externe, ou une adresse
 *         d'une passerelle connue (`references\PASSERELLES-ENCAISSEMENT.json`), dans un fichier du
 *         produit, quand le parcours ENGAGE l'utilisateur (il paie, il réserve) ;
 *   PT-2  quand un tel parcours existe et qu'un dossier de MEP existe, le dossier porte la section
 *         « Parcours tiers embarqués » ; elle nomme chaque tiers relevé, dit quelle ÉTAPE a été
 *         atteinte (« jusqu'à l'étape qui encaisse », ou « à confirmer » quand seul un paiement réel
 *         tranche), que la vérification a été jouée DANS UN NAVIGATEUR à une date, et sur l'ÉTAT
 *         EXÉCUTÉ (DOM après chargement) et non sur le HTML servi.
 *
 *   PT-3  (TF-2696, 20/11/2026) un RÉGLAGE DE PAIEMENT chez un tiers PRESCRIT dans un document du produit (guide, paramétrage : renouvellement
 *         d'une empreinte de carte, durée d'une caution, délai d'un acompte, d'une pré-autorisation…) porte, à la section « Réglages de paiement
 *         chez un tiers » du dossier de MEP, la RÉSERVATION TEST jouée à une date et la RELECTURE MESURÉE de son effet chez le tiers (la valeur
 *         lue, une date, avant la mise en service). Le fait : un guide du 14/10 prescrivait des empreintes renouvelées à J+3, J+7, J+11 sur une
 *         validité supposée de 7 jours ; la mesure du 20/11 lit 4 empreintes sur 6 valables 30 jours, aucune libération, 2 600 EUR bloqués
 *         sur 3 cartes de voyageurs, une plainte de l'exploitant. Aucun réglage prescrit n'avait été relu chez le tiers.
 *
 * Usage : node scripts/verifier-parcours-tiers.mjs <produit> [--document <dossier.md>]
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = rien à juger.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

const NON_JUGE = [
  "PT-3 : qu'un réglage de paiement prescrit ait réellement été relu chez le tiers, et que la valeur déclarée soit celle que le tiers rend : le contrôle exige la réservation test et la relecture mesurée DATÉES, avec une valeur chiffrée, il ne les rejoue pas (TF-2696)",
  "PT-3 : une prescription en PROSE qui ne nomme ni un tiers de `references/PASSERELLES-ENCAISSEMENT.json` ni un objet de paiement (empreinte, caution, pré-autorisation, acompte, capture, prélèvement, dépôt de garantie) autour d'un verbe de réglage ; seuls les documents `.md` de `docs/` et de la racine du produit sont lus (jamais forge/, output/, input/)",
  "que le parcours déclaré ait REELLEMENT atteint l'étape qui encaisse : le contrôle exige la déclaration, sa date, son lieu (un navigateur) et son objet (l'état exécuté), il ne rejoue pas le clic. La preuve est le banc du produit, que le dossier cite",
  "un cadre dont l'adresse se construit à l'exécution (variable, concaténation, configuration chargée à distance) : seuls les littéraux `https://…` du produit sont lus",
  "une navigation vers une passerelle par un lien ordinaire ou une redirection serveur : relevée seulement si l'adresse figure en clair dans un fichier du produit et reconnue par `PASSERELLES-ENCAISSEMENT.json`",
  "une passerelle absente de `references\\PASSERELLES-ENCAISSEMENT.json` : reconnue par le seul vocabulaire du parcours (paiement, réservation, acompte…) autour d'un cadre intégré, jamais par son nom",
  "un cadre intégré qui n'engage pas l'utilisateur (carte, vidéo) : ni relevé ni accusé, par construction",
  "la FRAÎCHEUR de la vérification déclarée par rapport au dernier changement du produit : la date est exigée, pas comparée à l'historique de code",
];

const EXTENSIONS = /\.(html?|jsx?|mjs|cjs|tsx?|vue|svelte|json|toml|conf|ya?ml|config|cshtml|php)$/i;
const SANS_EXTENSION = new Set(["_headers", "_redirects", "nginx.conf", "web.config"]);
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input", "forge", ".terraform", "coverage"]);
const lire = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

function charger() {
  const f = join(ICI, "..", "references", "PASSERELLES-ENCAISSEMENT.json");
  try {
    const j = JSON.parse(readFileSync(f, "utf8"));
    return { passerelles: j.fragments_de_nom_d_hote || [], vocabulaire: j.vocabulaire || [], date: j.date || "?" };
  } catch { return { passerelles: [], vocabulaire: [], date: null }; }
}

function parcourir(racine, profondeur) {
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!IGNORES.has(e.name) && reste > 0) marcher(p, reste - 1); }
      else if (e.isFile() && (EXTENSIONS.test(e.name) || SANS_EXTENSION.has(e.name))) out.push({ chemin: p, rel: relative(racine, p).split("\\").join("/") });
    }
  };
  marcher(racine, profondeur);
  return out;
}

const hoteDe = (url) => { const m = /^https?:\/\/([^\/\s"'<>)\\?#:;,]+)/i.exec(url); return m ? m[1].toLowerCase() : null; };
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Les parcours tiers relevés dans UN fichier : `[{ hote, forme, ligne }]`. */
export function releverParcours(texte, rel, donnees = charger()) {
  const trouves = [];
  const lignes = texte.split(/\r?\n/);
  const vocab = donnees.vocabulaire.length ? new RegExp(donnees.vocabulaire.map(echapper).join("|"), "i") : null;
  const estPasserelle = (h) => donnees.passerelles.some((p) => h.includes(p.toLowerCase()));
  const estHoteExterne = (h) => h && !/^(localhost|127\.|0\.0\.0\.0|example\.|.*\.example$)/.test(h);

  lignes.forEach((l, i) => {
    // 1 · un cadre intégré vers un hôte externe, quand le parcours engage l'utilisateur
    for (const m of l.matchAll(/<iframe\b[^>]*?\bsrc\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
      const hote = hoteDe(m[1]);
      if (!estHoteExterne(hote)) continue;
      const alentour = lignes.slice(Math.max(0, i - 3), i + 4).join(" ") + " " + m[1];
      if (estPasserelle(hote) || (vocab && vocab.test(alentour))) trouves.push({ hote, forme: "cadre intégré", ligne: i + 1 });
    }
    // 2 · une directive de politique de contenu qui nomme un hôte externe
    for (const m of l.matchAll(/\b(frame-src|child-src|form-action)\b([^;"\n]*)/gi)) {
      for (const h of m[2].matchAll(/https?:\/\/(?:\*\.)?([a-z0-9][a-z0-9.-]*\.[a-z]{2,})/gi)) {
        const hote = h[1].toLowerCase();
        if (!estHoteExterne(hote)) continue;
        if (estPasserelle(hote) || (vocab && vocab.test(hote))) trouves.push({ hote, forme: `directive ${m[1].toLowerCase()}`, ligne: i + 1 });
      }
    }
    // 3 · l'adresse en clair d'une passerelle connue, où qu'elle soit (lien, navigation, formulaire)
    for (const m of l.matchAll(/https?:\/\/[^\s"'<>)\\]+/gi)) {
      const hote = hoteDe(m[0]);
      if (hote && estHoteExterne(hote) && estPasserelle(hote)) trouves.push({ hote, forme: "adresse de passerelle", ligne: i + 1 });
    }
  });
  // un même hôte relevé deux fois sur une ligne par deux formes ne compte qu'une fois par (hôte, ligne)
  const vus = new Set();
  return trouves.filter((t) => { const k = `${t.hote}@${t.ligne}`; if (vus.has(k)) return false; vus.add(k); return true; })
    .map((t) => ({ ...t, ou: `${rel}:${t.ligne}` }));
}

/**
 * PT-3 (TF-2696) — les réglages de paiement chez un tiers que le texte d'un document PRESCRIT : un paragraphe qui nomme un tiers de la donnée
 * datée (par son nom : « stripe », « beds24 »), un verbe de réglage (régler, paramétrer, configurer, activer, renouveler, délai, durée,
 * validité, expiration, libération) et un objet de paiement (empreinte, caution, pré-autorisation, acompte, capture, prélèvement, dépôt de
 * garantie). Les trois ensemble, jamais l'un seul : un tiers cité, un acompte mentionné ne sont pas un réglage prescrit.
 */
export function releverReglagesDePaiement(texte, rel, donnees = charger()) {
  const noms = [...new Set(donnees.passerelles.map((p) => String(p).toLowerCase().split(".")[0]).filter((n) => n && n !== "checkout"))];
  if (!noms.length) return [];
  const reTiers = new RegExp(`\\b(${noms.map(echapper).join("|")})\\b`, "i");
  const reReglage = /\b(r[ée]gl|param[ée]tr|configur|activ|d[ée]sactiv|renouvel|d[ée]lai|dur[ée]e|validit|expir|lib[ée]r)\w*/i;
  const reObjet = /(empreinte|caution|pr[ée]-?autorisation|acompte|capture|pr[ée]l[èe]vement|d[ée]p[ôo]t de garantie|garantie bancaire)/i;
  const trouves = [];
  let debut = 0, paragraphe = [];
  const clore = () => {
    const bloc = paragraphe.join("\n");
    const tiers = reTiers.exec(bloc);
    // « rien à régler », « aucun réglage », « sans paramétrer » : le paragraphe dit qu'il n'y a RIEN à prescrire, il n'est pas une prescription.
    const nie = /\b(rien|aucune?|sans|pas\s+de)\b[^.\n]{0,40}\b(r[ée]gl|param[ée]tr|configur)/i.test(bloc);
    if (!nie && tiers && reReglage.test(bloc) && reObjet.test(bloc)) trouves.push({ tiers: tiers[1].toLowerCase(), objet: (reObjet.exec(bloc) || [])[1].toLowerCase(), ou: `${rel}:${debut}` });
    paragraphe = [];
  };
  let code = false;
  texte.split(/\r?\n/).forEach((l, i) => {
    if (/^\s*```/.test(l)) { code = !code; return; }
    if (code) return;
    if (!l.trim()) { clore(); return; }
    if (!paragraphe.length) debut = i + 1;
    paragraphe.push(l);
  });
  clore();
  return trouves;
}

/** Les documents `.md` où un réglage se prescrit : `docs/` et la racine du produit — jamais forge/, output/, input/ (livrables et entrants datés). */
function documentsDeReglage(racine) {
  const out = [];
  const marcher = (dir, reste, racineDocs) => {
    let entrees; try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (racineDocs && !IGNORES.has(e.name) && reste > 0) marcher(p, reste - 1, true); }
      else if (e.isFile() && /\.md$/i.test(e.name) && !/^DOSSIER-MEP/i.test(e.name)) out.push({ chemin: p, rel: relative(racine, p).split("\\").join("/") });
    }
  };
  marcher(racine, 0, false);               // la racine, sans descendre
  marcher(join(racine, "docs"), 5, true);  // docs/, en profondeur
  return out;
}

/** Les sections « Réglages de paiement chez un tiers » d'un dossier de MEP. */
function sectionsReglagesDePaiement(texte) {
  const lignes = texte.split(/\r?\n/);
  const titres = [];
  let code = false;
  lignes.forEach((l, i) => {
    if (/^\s*```/.test(l)) { code = !code; return; }
    if (code) return;
    const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(l);
    if (m) titres.push({ i, niveau: m[1].length, texte: m[2] });
  });
  return titres.filter((s) => /r[ée]glages?\s+(?:de\s+)?paiement/i.test(s.texte)).map((s) => {
    const fin = titres.find((u) => u.i > s.i && u.niveau <= s.niveau);
    return { titre: s.texte, lignes: lignes.slice(s.i + 1, fin ? fin.i : lignes.length) };
  });
}

function sectionsParcoursTiers(texte) {
  const lignes = texte.split(/\r?\n/);
  const titres = [];
  let code = false;
  lignes.forEach((l, i) => {
    if (/^\s*```/.test(l)) { code = !code; return; }
    if (code) return;
    const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(l);
    if (m) titres.push({ i, niveau: m[1].length, texte: m[2] });
  });
  return titres.filter((t) => /parcours\s+tiers/i.test(t.texte)).map((t) => {
    const fin = titres.find((u) => u.i > t.i && u.niveau <= t.niveau);
    return { titre: t.texte, lignes: lignes.slice(t.i + 1, fin ? fin.i : lignes.length) };
  });
}

export function jugerProduit(racine, { document = null } = {}) {
  const donnees = charger();
  const findings = [];
  const mesure = { fichiers: 0, parcours: 0, tiers: 0, dossiers: 0, refus: 0, reglages: 0 };
  const parcours = [];
  for (const { chemin, rel } of parcourir(racine, 6)) {
    const texte = lire(chemin);
    if (!texte || texte.length > 2_000_000) continue;
    mesure.fichiers++;
    parcours.push(...releverParcours(texte, rel, donnees));
  }
  mesure.parcours = parcours.length;
  const tiers = [...new Set(parcours.map((p) => p.hote))].sort();
  mesure.tiers = tiers.length;
  // PT-3 (TF-2696) : les réglages de paiement que les documents du produit prescrivent chez un tiers.
  const reglages = [];
  for (const { chemin, rel } of documentsDeReglage(racine)) {
    const texte = lire(chemin);
    if (texte && texte.length <= 2_000_000) reglages.push(...releverReglagesDePaiement(texte, rel, donnees));
  }
  mesure.reglages = reglages.length;
  if (!parcours.length && !reglages.length) {
    return { findings, mesure, rienAJuger: true, motif: "M-14 sans objet : aucun parcours tiers embarqué qui engage l'utilisateur (cadre intégré, directive frame-src/child-src/form-action ou adresse de passerelle) n'est relevé dans les fichiers du produit" };
  }
  const dossiers = document ? [document] : (() => {
    const out = [];
    const marcher = (dir, reste) => {
      let entrees; try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const e of entrees) {
        const p = join(dir, e.name);
        if (e.isDirectory()) { if (!["node_modules", ".git", ".venv", "dist", "build"].includes(e.name) && reste > 0) marcher(p, reste - 1); }
        else if (/^DOSSIER-MEP.*\.md$/i.test(e.name)) out.push(p);
      }
    };
    marcher(racine, 4);
    return out;
  })();
  mesure.dossiers = dossiers.length;
  const ref = "ETAPE-MEP.md § 3 undecies (M-14, TF-1583 ; PT-3, TF-2696)";
  const tiersDeReglage = [...new Set(reglages.map((r) => r.tiers))].sort();
  const releve = `${parcours.length} parcours relevé(s) chez ${tiers.length} tiers (${tiers.slice(0, 4).join(", ")}${tiers.length > 4 ? ", …" : ""}) : ${parcours.slice(0, 3).map((p) => `${p.forme} ${p.ou}`).join(" ; ")}`;
  if (!dossiers.length) {
    return { findings, mesure, rienAJuger: true, motif: parcours.length ? `parcours tiers embarqué relevé (${releve}) mais aucun dossier de MEP : l'étape n'a pas été atteinte, rien à juger encore`
      : `réglage de paiement prescrit chez un tiers (${tiersDeReglage.join(", ")}) mais aucun dossier de MEP : l'étape n'a pas été atteinte, rien à juger encore` };
  }
  for (const chemin of dossiers) {
    const nom = relative(racine, chemin).split("\\").join("/") || chemin;
    const texteDossier = lire(chemin);
    // PT-3 : le dossier porte la section des réglages de paiement quand un document du produit en prescrit un.
    if (reglages.length) {
      const ko3 = (message) => findings.push({ regle: "PT-3", statut: "FAIL", ou: nom, message: `${message} — ${ref}` });
      const prescrit = `${reglages.length} réglage(s) de paiement prescrit(s) chez ${tiersDeReglage.join(", ")} : ${reglages.slice(0, 3).map((r) => `${r.objet} ${r.ou}`).join(" ; ")}`;
      const s3 = sectionsReglagesDePaiement(texteDossier);
      if (!s3.length) {
        ko3(`un document du produit prescrit un réglage de paiement chez un tiers (${prescrit}) et le dossier ne porte aucune section « Réglages de paiement chez un tiers ». Le 14/10/2026 un guide a prescrit des empreintes renouvelées à J+3, J+7 et J+11 sur une validité supposée de 7 jours ; la mesure du 20/11 a lu 4 empreintes sur 6 valables 30 jours, aucune libération par le tiers et 2 600 EUR bloqués sur 3 cartes : le réglage n'avait jamais été relu chez le tiers. La section nomme chaque tiers, la réservation test jouée à une date et la relecture mesurée de son effet (la valeur lue, une date), avant la mise en service`);
      } else {
        const c3 = s3.flatMap((s) => [s.titre, ...s.lignes]).join("\n");
        const bas = c3.toLowerCase();
        const manque3 = tiersDeReglage.filter((x) => !bas.includes(x));
        if (manque3.length) ko3(`la section des réglages de paiement ne nomme pas ${manque3.length === 1 ? "le tiers" : "les tiers"} : ${manque3.join(", ")}`);
        if (!c3.split("\n").some((l) => /r[ée]servation\s+(?:de\s+)?test/i.test(l) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l)))
          ko3("la section ne dit pas que la RÉSERVATION TEST a été jouée, ni quand : une ligne « Réservation test jouée le AAAA-MM-JJ : <ce qui a été réservé, chez quel tiers> » est attendue");
        if (!c3.split("\n").some((l) => /relecture|relu/i.test(l) && /mesur/i.test(l) && /\d/.test(l.replace(/\b20\d{2}-\d{2}-\d{2}\b/g, "")) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l)))
          ko3("la section ne porte pas la RELECTURE MESURÉE de l'effet du réglage chez le tiers : une ligne « Relecture mesurée le AAAA-MM-JJ : <la valeur lue chez le tiers, chiffrée, face à la valeur supposée> » est attendue");
        if (!/avant\s+(?:la\s+)?mise\s+en\s+service/i.test(c3)) ko3("la section ne dit pas que la réservation test et la relecture précèdent la MISE EN SERVICE : « avant mise en service » est la porte, pas un constat d'après coup");
      }
    }
    if (!parcours.length) continue;
    const sections = sectionsParcoursTiers(texteDossier);
    const ko = (message) => findings.push({ regle: "PT-2", statut: "FAIL", ou: nom, message: `${message} — ${ref}` });
    if (!sections.length) {
      ko(`le produit embarque un parcours tiers (${releve}) et le dossier ne porte aucune section « Parcours tiers embarqués ». Le 29/09/2026, un paiement d'acompte impossible depuis 35 jours a été signalé par l'exploitant : le correctif vérifié sur le mécanisme n'avait jamais été rejoué jusqu'à l'étape qui encaisse`);
      continue;
    }
    const corps = sections.flatMap((s) => [s.titre, ...s.lignes]).join("\n");
    // Un tiers est NOMMÉ quand son hôte ou son nom de domaine (« stripe » pour js.stripe.com) figure à la section.
    const corpsBas = corps.toLowerCase();
    const manquants = tiers.filter((t) => !corpsBas.includes(t) && !corpsBas.includes(t.split(".").slice(-2)[0] || t));
    if (manquants.length) ko(`la section ne nomme pas ${manquants.length === 1 ? "le tiers relevé" : "les tiers relevés"} : ${manquants.join(", ")}`);
    const ligneNavigateur = corps.split("\n").find((l) => /navigateur/i.test(l) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l));
    if (!ligneNavigateur) ko("la section ne dit pas que la vérification a été JOUÉE DANS UN NAVIGATEUR, ni quand : une ligne « Joué dans un navigateur le AAAA-MM-JJ : <banc> » est attendue. Un `curl` sur le HTML servi ne voit pas ce qu'un script réécrit au chargement");
    if (!/[ée]tat\s+ex[ée]cut[ée]|DOM|apr[èe]s\s+(?:chargement|ex[ée]cution)/i.test(corps)) ko("la section ne dit pas que la vérification porte sur l'ÉTAT EXÉCUTÉ (DOM après chargement) et non sur le HTML servi");
    if (!/encaiss|jusqu['’]à\s+(?:l['’][ée]tape|la\s+(?:derni[èe]re|passerelle))|[ée]tape\s+qui\s+encaisse|[àa]\s+confirmer/i.test(corps)) ko("la section ne dit pas jusqu'à quelle ÉTAPE le parcours a été joué : « jusqu'à l'étape qui encaisse » (formulaire des coordonnées atteint sans validation, navigation vers la passerelle rejouée depuis son contexte de départ), ou « à confirmer » quand seul un paiement réel tranche — jamais « les contrôles passent » sur le seul mécanisme corrigé");
  }
  mesure.refus = findings.filter((f) => f.statut === "FAIL").length;
  return { findings, mesure, rienAJuger: false, motif: null, tiers };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify({ outil: "verifier-parcours-tiers", version: "1.1.0", regle: "M-14 (ETAPE-MEP.md § 3 undecies)", ...corps, non_juge: NON_JUGE }, null, 1) + "\n"); process.exit(code); };
  const cible = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--document")[0] || process.cwd();
  if (!existsSync(cible) || !statSync(cible).isDirectory()) sortir({ verdict: "NON_JUGEABLE", message: `produit introuvable : ${cible}` }, 2);
  const r = jugerProduit(cible, { document: valeur("--document") });
  sortir({ cible, verdict: r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS", motif: r.motif || undefined, mesure: r.mesure, findings: r.findings }, r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
}
