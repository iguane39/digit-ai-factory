#!/usr/bin/env node
/**
 * oracle-portee-doctrine — UNE DOCTRINE N'EXISTE QUE LÀ OÙ SON MÉCANISME EST INSTALLÉ.
 *
 * LE FAIT (24/08/2026, TF-0571). Une session de travail a passé cinq heures et onze décisions dans
 * un dépôt produit, en rendant une dizaine de messages de fin de traitement à l'humain. AUCUN ne
 * portait la structure en huit blocs, aucun ne portait de bloc 0, et aucun n'a été ni jugé ni
 * refusé — il n'y avait ni doctrine chargée ni oracle armé. Le défaut n'a été découvert que par la
 * contestation humaine. Le dépôt en question ne porte ni CLAUDE.md, ni `.claude\`, et aucune
 * occurrence de « restitution » dans ses documents de projet ; le hook qui rend la règle opposable
 * vit chez le pilot et nulle part ailleurs.
 *
 * C'est LE DÉFAUT QUE LA v1 DE `gabarits\RESTITUTION.md` DÉCRIT D'ELLE-MÊME : « elle n'était citée
 * par aucun run […] une convention qu'aucun run ne charge ne s'applique pas : elle décore ». La v2
 * l'a corrigé pour les runs DU PILOT. Elle ne dit rien des sessions qui vivent chez le produit.
 *
 * MESURE DU 24/08 SUR LE PARC RÉEL, et elle est plus large que le retour : sur les dix produits
 * rangés sous le dossier client, CINQ portent un `forge\` — donc ont été instanciés — et UN SEUL
 * porte le hook de la factory. ZÉRO porte le texte de la doctrine. La doctrine voyageait donc au
 * mieux comme un juge sans son code : le hook bloque, et l'agent doit deviner les huit blocs.
 *
 * CE QUE CET ORACLE FAIT : il NOMME. Pour chaque produit connu du registre — la liste se dérive
 * des lots de retours ingérés, jamais d'une liste écrite à la main — il dit l'état d'installation
 * de la doctrine. Un produit absent du poste est « non vérifié », jamais accusé. Un produit sans
 * `forge\` n'a jamais été instancié : il est hors doctrine, et c'est un fait, pas une faute.
 *
 * CE QU'IL NE FAIT PAS, et c'est une frontière humaine, pas technique : ÉCRIRE CHEZ LE PRODUIT.
 * « Ne touche pas les produits, seuls les produits se modifient eux-mêmes » (mandat du 23/08). Le
 * remède d'un constat est donc toujours un run demandé au produit, jamais une copie d'ici.
 *
 * PD3 (TF-0996, 09/09/2026) ajoute la question que PD1 et PD2 ne posent pas : la doctrine est-elle
 * chargée pour CETTE session ? Un produit conforme dont la session est ouverte UN CRAN AU-DESSUS
 * n'exécute aucun de ses hameçons. Voir le bloc de la fonction `jugerPortee` pour le fait mesuré.
 *
 *   node oracles\oracle-portee-doctrine.mjs             → jugement du parc
 *   node oracles\oracle-portee-doctrine.mjs --self-test → double sens sur un parc fabriqué
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Cet oracle n'a AUCUN chemin « je ne peux pas
// mesurer » : il ne depend d'aucun outil externe et lit des fichiers du depot. Le declarer
// vaut mieux que de le taire — un contrat muet laisse croire qu'un 1 peut etre une panne
// d'environnement (TF-0648).
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

/**
 * Les PIÈCES de la doctrine de restitution chez un produit, et ce que chacune apporte seule.
 * Les deux premières sont la leçon du 24/08 : un hook sans son texte est un juge sans code, un
 * texte sans hook est une décoration. Il faut les deux, et l'oracle le dit séparément pour que le
 * remède soit précis.
 */
const PIECES = [
  { chemin: ["forge", "hooks", "factory.mjs"], quoi: "le hook qui juge (opposable)",
    sans: "aucune fin de tour n'est jugée : la doctrine devient un vœu" },
  { chemin: [".claude", "settings.json"], quoi: "le câblage du hook", motif: "forge/hooks/factory.mjs",
    sans: "le hook est présent et jamais appelé — le pire état, il donne confiance sans rien faire" },
  { chemin: ["forge", "RESTITUTION.md"], quoi: "le texte de la doctrine (les 8 blocs)",
    sans: "le hook refuse sans que rien n'apprenne la forme attendue : l'agent devine" },
  { chemin: ["CLAUDE.md"], quoi: "les instructions du produit", motif: "R-43",
    sans: "la clause de précédence manque : les règles de la factory ne s'imposent pas" },
];

/** Les produits connus du pilot : dérivés des lots de retours ingérés, jamais d'une liste écrite. */
export function produitsDuRegistre(registre) {
  const noms = new Set();
  let lignes = [];
  try { lignes = readFileSync(registre, "utf8").split(/\r?\n/).filter(Boolean); } catch { return []; }
  for (const l of lignes) {
    let e = null;
    try { e = JSON.parse(l); } catch { continue; }
    if (e.ev !== "ingestion" || !e.fichier) continue;
    const nom = String(e.fichier).split(/[\\/]/).pop() || "";
    if (!nom.includes(" - RETOURS - ")) continue;   // une candidature hors lot n'a pas de produit
    noms.add(nom.split(" - RETOURS - ")[0]);
  }
  return [...noms].sort();
}

/** La localisation d'un produit, à deux niveaux — le second a été payé (TF-0555). */
export function localiser(projet, racine) {
  const enfants = (d) => { try { return readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()); } catch { return []; } };
  const plie = (n) => n.toLowerCase().replace(/[-_ .]/g, "");
  const correspond = (nom) => plie(nom).startsWith(plie(projet));
  const candidats = [];
  for (const d1 of enfants(racine)) {
    const c1 = join(racine, d1.name);
    if (correspond(d1.name)) candidats.push(c1);
    if (!existsSync(join(c1, "forge"))) {
      for (const d2 of enfants(c1)) if (correspond(d2.name)) candidats.push(join(c1, d2.name));
    }
  }
  const retenu = candidats.find((c) => existsSync(join(c, "forge")))
    || candidats.find((c) => existsSync(join(c, "CLAUDE.md")))
    || candidats[0] || null;
  // L'AMBIGUÏTÉ SE DÉCLARE, ELLE NE SE TRANCHE PAS EN SILENCE. Le premier passage sur le parc a
  // trouvé DEUX dossiers commençant par « Produit-11 » ; l'un a été retenu sans un mot.
  // Un verdict prononcé sur une cible ambiguë est un verdict faux une fois sur deux, et il est
  // d'autant plus dangereux qu'il a l'air précis.
  return { dossier: retenu, candidats };
}

export function juger({ registre, racine }) {
  const findings = [];
  const produits = produitsDuRegistre(registre);
  if (!produits.length) {
    findings.push({ regle: "PD1", statut: "SKIP", ou: registre, message:
      "aucun lot de retours au registre — aucun produit consommateur à nommer" });
    return findings;
  }
  for (const projet of produits) {
    const { dossier, candidats } = localiser(projet, racine);
    const ambigu = candidats.length > 1
      ? ` — ATTENTION, ${candidats.length} dossiers correspondent (${candidats.map((c) => c.split(/[\\/]/).pop()).join(", ")}), ` +
        `le jugement porte sur « ${String(dossier).split(/[\\/]/).pop()} » : à trancher par un humain`
      : "";
    if (!dossier) {
      // NON VÉRIFIÉ, JAMAIS ACCUSÉ : un produit qu'on ne localise pas n'est pas un produit en
      // défaut. Mais le silence est DIT — une vérification non faite qui ne laisse pas de trace
      // est une vérification qu'on croit faite (TF-0555).
      findings.push({ regle: "PD1", statut: "NON_VERIFIE", ou: projet, message:
        `introuvable sous ${racine} — ce n'est pas un constat sur le produit, c'est l'absence d'une cible` });
      continue;
    }
    if (!existsSync(join(dossier, "forge"))) {
      findings.push({ regle: "PD1", statut: "HORS_DOCTRINE", ou: projet, message:
        `aucun forge\\ — ce dépôt n'a jamais été instancié par le pilot. Il est HORS doctrine, et ` +
        "c'est un fait, pas une faute : une session qui y travaille ne recevra ni doctrine ni juge" + ambigu });
      continue;
    }
    const manques = [];
    for (const p of PIECES) {
      const f = join(dossier, ...p.chemin);
      if (!existsSync(f)) { manques.push(`${p.chemin.join("\\")} (${p.quoi}) — sans lui, ${p.sans}`); continue; }
      if (p.motif) {
        let contenu = "";
        try { contenu = readFileSync(f, "utf8"); } catch {}
        if (!contenu.includes(p.motif)) {
          manques.push(`${p.chemin.join("\\")} présent mais sans « ${p.motif} » (${p.quoi}) — sans lui, ${p.sans}`);
        }
      }
    }
    findings.push(manques.length
      ? { regle: "PD2", statut: "FAIL", ou: projet, message:
          `produit INSTANCIÉ dont la doctrine de restitution est incomplète — ${manques.length} pièce(s) : ` +
          manques.join(" · ") + ". Remède : un run demandé AU PRODUIT (le pilot n'écrit pas chez lui)" + ambigu }
      : { regle: "PD2", statut: "PASS", ou: projet, message: "doctrine de restitution installée et câblée" });
  }
  return findings;
}

/**
 * PD3 — LA DOCTRINE EST-ELLE CHARGÉE POUR *CETTE* SESSION ? (TF-0996, 09/09/2026)
 *
 * PD1 et PD2 jugent l'INSTALLATION chez un produit : les pièces sont-elles posées. Elles ne
 * disent rien de la PORTÉE de la session en cours. Or le harnais ne charge les réglages QUE de sa
 * racine : une session ouverte sur le dossier de travail qui CONTIENT le produit instancié ne
 * charge ni son `.claude\settings.json`, ni aucun de ses hameçons — le produit peut être
 * parfaitement conforme à PD2, et pourtant rien ne s'exécute.
 *
 * LE FAIT (09/09/2026, récidive à un jour de TF-0963). Le 08/09, cet état a fait manquer les
 * hameçons `SessionStart` et `Stop`. Le 09/09, le MÊME état a fait manquer le troisième,
 * `UserPromptSubmit` — et c'est le seul dont la conséquence est immédiatement visible par
 * l'humain : une formule du lexique d'invocation RV-6 n'a rien déclenché, et la réponse rendue
 * n'était pas celle attendue. Preuve que le mécanisme est bon et que SEULE SA PORTÉE est en
 * cause : `node oracles\hook-lexique.mjs --self-test` rend 7 PASS / 0 FAIL, dont le cas exact, et
 * la copie du produit rend la même ligne d'injection — exécutée depuis la racine englobante.
 *
 * POURQUOI PD3 BLOQUE ALORS QUE PD1 ET PD2 NE BLOQUENT PAS. Ce n'est pas une exception à la
 * doctrine du fichier, c'en est l'application : PD1 et PD2 ne bloquent pas parce que leur cible
 * est un dépôt produit que le pilot n'a pas le droit de modifier (N-21 : « le contrôle NOMME sans
 * BLOQUER quand la cible n'est pas la sienne »). La cible de PD3 est la RACINE DE SESSION de
 * celui qui l'exécute — la seule chose qu'il puisse réparer sur-le-champ, et le geste est connu.
 */
export function jugerPortee(cwd) {
  // La question est celle du lot, mot pour mot : « un forge\ existe-t-il dans un SOUS-dossier du
  // répertoire courant et non dans le répertoire courant ». Profondeur UN seulement — au-delà, on
  // ne décrit plus une racine de session mal placée mais un parc, et PD1 s'en charge déjà.
  if (existsSync(join(cwd, "forge"))) {
    return { regle: "PD3", statut: "PASS", ou: cwd, message:
      "la racine de session porte elle-même un forge\\ — le harnais y charge les réglages du produit" };
  }
  let enfants = [];
  try { enfants = readdirSync(cwd, { withFileTypes: true }).filter((d) => d.isDirectory()); } catch {}
  const imbriques = [];
  for (const d of enfants) {
    if (d.name.startsWith(".") || d.name === "node_modules") continue;
    const sous = join(cwd, d.name);
    if (!existsSync(join(sous, "forge"))) continue;
    const cable = existsSync(join(sous, ".claude", "settings.json"));
    imbriques.push({ nom: d.name, cable });
  }
  if (!imbriques.length) {
    return { regle: "PD3", statut: "PASS", ou: cwd, message:
      "aucun produit instancié dans un sous-dossier direct de la racine de session — rien à signaler" };
  }
  const noms = imbriques.map((i) => `${i.nom}${i.cable ? " (câblé, et pourtant inerte d'ici)" : " (non câblé)"}`);
  return { regle: "PD3", statut: "FAIL", ou: cwd, message:
    `RACINE DE SESSION AU-DESSUS DU PRODUIT : ${imbriques.length} produit(s) instancié(s) dans un sous-dossier ` +
    `direct (${noms.join(", ")}), et AUCUN forge\\ ici. Le harnais ne charge les réglages que de SA racine : ` +
    "les hameçons du produit (SessionStart, UserPromptSubmit, Stop, PostToolUse) ne s'exécutent pas, " +
    "quel que soit leur état de conformité chez lui. C'est invisible sans ce constat — rien n'échoue, " +
    "tout se tait. Remède : ouvrir la session DANS le dossier du produit ; ou, si la racine englobante " +
    "doit rester la racine de travail, y poser un .claude\\settings.json qui délègue au hook du " +
    "sous-dossier par chemin préfixé (le report des seuls hameçons non ambigus relève d'un arbitrage " +
    "du pilot — TF-0963)" };
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : f.every((x) => x.statut === "SKIP") ? "SKIP" : "PASS");

if (args[0] === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "portee-"));
  const casse = [];
  const registre = join(dir, "registre.jsonl");
  const lot = (p) => JSON.stringify({ ev: "ingestion", fichier: `input\\00-retours\\${p} - RETOURS - 20260824a.md` });
  writeFileSync(registre, [lot("Complet"), lot("SansTexte"), lot("JamaisInstancie"), lot("Ailleurs")].join("\n") + "\n", "utf8");
  const racine = join(dir, "parc");
  const poser = (nom, { forge = true, hook = true, settings = true, texte = true, claude = true } = {}) => {
    const d = join(racine, nom);
    mkdirSync(d, { recursive: true });
    if (forge) mkdirSync(join(d, "forge", "hooks"), { recursive: true });
    if (forge && hook) writeFileSync(join(d, "forge", "hooks", "factory.mjs"), "// hook\n", "utf8");
    if (settings) { mkdirSync(join(d, ".claude"), { recursive: true }); writeFileSync(join(d, ".claude", "settings.json"), '{"hooks":{"Stop":[{"command":"node forge/hooks/factory.mjs"}]}}', "utf8"); }
    else rmSync(join(d, ".claude"), { recursive: true, force: true });
    if (forge && texte) writeFileSync(join(d, "forge", "RESTITUTION.md"), "# doctrine\n", "utf8");
    if (claude) writeFileSync(join(d, "CLAUDE.md"), "Précédence R-43.\n", "utf8");
  };
  poser("Complet");
  poser("SansTexte", { texte: false });
  poser("JamaisInstancie", { forge: false });
  // « Ailleurs » n'est pas posé du tout : il doit rendre NON_VERIFIE, jamais FAIL.
  const f = juger({ registre, racine });
  const par = (nom) => f.find((x) => x.ou === nom);
  if (par("Complet")?.statut !== "PASS") casse.push("un produit complet n'est pas PASS : " + JSON.stringify(par("Complet")));
  if (par("SansTexte")?.statut !== "FAIL" || !/RESTITUTION\.md/.test(par("SansTexte").message)) {
    casse.push("un produit avec le hook mais SANS le texte de la doctrine n'est pas nommé — c'est le défaut mesuré sur le parc");
  }
  if (par("JamaisInstancie")?.statut !== "HORS_DOCTRINE") casse.push("un dépôt jamais instancié est jugé au lieu d'être déclaré hors doctrine");
  if (par("Ailleurs")?.statut !== "NON_VERIFIE") casse.push("un produit absent du poste est ACCUSÉ au lieu d'être déclaré non vérifié");
  // Sens rouge du câblage : le hook présent et jamais appelé.
  poser("Complet", { settings: false });
  if (!juger({ registre, racine }).find((x) => x.ou === "Complet" && x.statut === "FAIL")) {
    casse.push("un hook présent mais non câblé passe — c'est l'état qui donne confiance sans rien faire");
  }
  // PD3, dans ses TROIS sens. `racine` contient « Complet », qui porte un forge\ : une session
  // ouverte LÀ est au-dessus du produit, et c'est le défaut du 09/09.
  const pd3Dessus = jugerPortee(racine);
  if (pd3Dessus.statut !== "FAIL" || !/Complet/.test(pd3Dessus.message)) {
    casse.push("PD3 : une racine de session AU-DESSUS d'un produit instancié n'est pas nommée — c'est le défaut du 09/09 (le lexique d'invocation n'a rien déclenché)");
  }
  if (!/settings\.json/.test(pd3Dessus.message)) casse.push("PD3 : le constat ne porte pas le geste qui répare");
  // Sens vert n° 1 : la session est ouverte DANS le produit.
  if (jugerPortee(join(racine, "Complet")).statut !== "PASS") {
    casse.push("PD3 : une session ouverte DANS le produit est accusée à tort");
  }
  // Sens vert n° 2 : un dossier sans aucun produit imbriqué (le cas du pilot lui-même).
  const neutre = join(dir, "neutre");
  mkdirSync(join(neutre, "oracles"), { recursive: true });
  if (jugerPortee(neutre).statut !== "PASS") {
    casse.push("PD3 : un dossier sans produit imbriqué est accusé à tort — ce serait le pilot lui-même");
  }
  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test portée de doctrine : 9/9 PASS (produit complet → PASS ; hook sans le texte → FAIL nommé ; " +
      "dépôt jamais instancié → HORS_DOCTRINE ; produit absent du poste → NON_VERIFIE ; hook non câblé → FAIL ; " +
      "PD3 racine au-dessus du produit → FAIL avec son remède ; PD3 session dans le produit → PASS ; " +
      "PD3 dossier sans produit imbriqué → PASS)");
  process.exit(casse.length ? 1 : 0);
}

const registre = join(PILOT, "todo", "TODO.jsonl");
const brute = process.env.FORGE_ROOT || join(PILOT, "..");
const racine = isAbsolute(brute) ? brute : join(PILOT, brute);
const findings = juger({ registre, racine });
// PD3 se juge sur la RACINE DE SESSION, pas sur le parc : c'est la portée de CE run.
findings.push(jugerPortee(process.cwd()));
const verdict = verdictDe(findings);
// LE VERDICT EST VRAI, LE CODE DE SORTIE NE BLOQUE PAS, ET LES DEUX SE DISENT. Tous les constats
// portent sur des DÉPÔTS PRODUITS, que le pilot n'a pas le droit de modifier (mandat humain du
// 23/08). Sortir en code 1 rendrait la recette du pilot rouge pour un défaut que SEUL le produit
// peut corriger : c'est l'erreur du hook « produits intacts », qui a bloqué cinq restitutions et
// dont le remède suggéré aurait détruit trois branches d'une autre session. Un contrôle qui
// bloque sur ce qu'il ne peut pas faire réparer apprend à être contourné.
// Le jour où un constat porterait sur le PILOT lui-même, il sortirait en 1 : c'est la seule cible
// dont ce dépôt est responsable.
// Deux familles de constats bloquants, et une seule raison : la cible est réparable par qui
// exécute. Le pilot pour PD1-PD2 (seul dépôt dont il est responsable) ; la RACINE DE SESSION pour
// PD3 (le geste est à portée immédiate). Tout le reste porte sur des produits : nommé, jamais
// bloquant — « un contrôle qui bloque sur ce qu'il ne peut pas faire réparer apprend à être
// contourné ».
const bloquants = findings.filter((f) => f.statut === "FAIL"
  && (f.regle === "PD3" || /digit-ai-factory|pilot/i.test(f.ou)));
const surLePilot = bloquants;
console.log(JSON.stringify({
  oracle: "oracle-portee-doctrine",
  version: "1.0.0",
  verdict,
  portee_du_code_de_sortie: surLePilot.length
    ? `1 — ${surLePilot.map((f) => f.regle).join(", ")} : le constat porte sur une cible réparable par qui exécute (le pilot pour PD1-PD2, la racine de session pour PD3)`
    : "0 — tous les constats portent sur des produits : le pilot les NOMME, il ne les corrige pas et ne se bloque pas dessus",
  racine,
  findings,
  non_juge: [
    "les produits qui n'ont jamais remis de lot : ils sont inconnus du registre, donc invisibles ici. " +
    "La liste se dérive de ce qui est ENTRÉ, jamais d'un inventaire écrit à la main",
    "la fraîcheur des pièces : PD2 constate leur présence et leur câblage, pas qu'elles soient à jour — " +
    "c'est le travail de R-47 (gabarits\\HERITAGE.json), et le dupliquer créerait deux vérités",
    "l'écriture du remède : le pilot n'écrit jamais chez un produit (mandat humain du 23/08). Un constat " +
    "d'ici se corrige par un run demandé au produit, et le constat reste ouvert jusque-là",
    "PD3 ne regarde QU'UN niveau sous la racine de session : au-delà, on ne décrit plus une racine mal " +
    "placée mais un parc, et PD1 s'en charge. Un produit imbriqué à deux niveaux échappe donc à PD3, " +
    "et c'est assumé plutôt que de rendre un constat par dépôt du disque",
    "PD3 constate que le harnais NE PEUT PAS charger les réglages du sous-dossier ; il ne lit pas ce que " +
    "le harnais a effectivement chargé — cela ne s'écrit dans aucun fichier lisible d'ici",
  ],
}, null, 1));
process.exit(surLePilot.length ? 1 : 0);
