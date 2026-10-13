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
 * Usage : node scripts/verifier-parcours-tiers.mjs <produit> [--document <dossier.md>]
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = rien à juger.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

const NON_JUGE = [
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
  const mesure = { fichiers: 0, parcours: 0, tiers: 0, dossiers: 0, refus: 0 };
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
  if (!parcours.length) {
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
  const ref = "ETAPE-MEP.md § 3 undecies (M-14, TF-1583)";
  const releve = `${parcours.length} parcours relevé(s) chez ${tiers.length} tiers (${tiers.slice(0, 4).join(", ")}${tiers.length > 4 ? ", …" : ""}) : ${parcours.slice(0, 3).map((p) => `${p.forme} ${p.ou}`).join(" ; ")}`;
  if (!dossiers.length) {
    return { findings, mesure, rienAJuger: true, motif: `parcours tiers embarqué relevé (${releve}) mais aucun dossier de MEP : l'étape n'a pas été atteinte, rien à juger encore` };
  }
  for (const chemin of dossiers) {
    const nom = relative(racine, chemin).split("\\").join("/") || chemin;
    const sections = sectionsParcoursTiers(lire(chemin));
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
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify({ outil: "verifier-parcours-tiers", version: "1.0.0", regle: "M-14 (ETAPE-MEP.md § 3 undecies)", ...corps, non_juge: NON_JUGE }, null, 1) + "\n"); process.exit(code); };
  const cible = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--document")[0] || process.cwd();
  if (!existsSync(cible) || !statSync(cible).isDirectory()) sortir({ verdict: "NON_JUGEABLE", message: `produit introuvable : ${cible}` }, 2);
  const r = jugerProduit(cible, { document: valeur("--document") });
  sortir({ cible, verdict: r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS", motif: r.motif || undefined, mesure: r.mesure, findings: r.findings }, r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
}
