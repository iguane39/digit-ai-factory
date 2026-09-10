#!/usr/bin/env node
/**
 * oracle-claude-md.mjs — plafond de taille du noyau CLAUDE.md + intégrité des références
 * (TF-0037/TF-0053). Règles :
 *  N1  CLAUDE.md ≤ 6144 octets (le noyau reste lisible en session — ×3,8 en 5 jours avant borne)
 *  N2  chaque fichier `references\<X>.md` cité par le noyau existe
 *  N3  chaque fichier de references\ est cité par le noyau, directement ou PAR UN DOCUMENT QUE LE
 *      NOYAU CITE (l'index `references\INDEX.md`, décision D-3 (b) du 03/09/2026 : le noyau est au
 *      plafond, sept références restaient orphelines et le contrôle rouge finissait par être ignoré) ;
 *      une citation transitive ne vaut que si le document citant est lui-même atteint depuis le
 *      noyau. N2 vaut aussi pour les entrées de l'index : un document cité et absent est un défaut.
 *  N4  AUCUN QUANTIFICATEUR NE DISPARAÎT du noyau entre sa version COMMISE et sa version de
 *      travail (TF-1010, 10/09/2026). Le 10/09, pour faire tenir une ligne dans le plafond N1, le
 *      mot « seulement » a été retiré de « Livrable accepté sur verdict d'oracle exécuté
 *      seulement » en le prenant pour un adverbe redondant. Il portait toute l'exclusivité de la
 *      règle : sans lui, la phrase dit qu'un verdict SUFFIT et n'interdit plus rien. Publié une
 *      heure, trouvé par une relecture de diff — rien ne garantit qu'il y en ait une la prochaine
 *      fois. N4 compare, mot à mot et à frontière Unicode, le nombre d'occurrences d'une liste
 *      close de mots qui INTERDISENT, QUANTIFIENT ou EXCLUENT ; toute baisse est un FAIL nommant
 *      le mot et les deux comptes. Un déplacement (même compte) passe : N4 juge la perte, pas
 *      la prose. Sans version commise lisible (hors dépôt git), N4 se déclare NON JUGÉ, jamais
 *      PASS — un gardien sans référence ne rassure personne. C'est R-43 (« renforcer oui,
 *      assouplir jamais ») rendu mécanique sur le seul texte que toute session lit en premier.
 * Usage : node oracle-claude-md.mjs [racine]      — exit 0 PASS / 1 FAIL.
 *         node oracle-claude-md.mjs --self-test   — fixtures double sens.
 *
 * Le self-test est arrivé tard, et son absence était le défaut : cet oracle gardait le plafond
 * du noyau depuis TF-0037 sans que personne ait jamais prouvé qu'il SAIT échouer. Un gardien
 * qu'on n'a pas vu refuser est un gardien supposé. Trouvé le 15/08 par `self-tests.mjs` dès son
 * premier passage — c'est exactement ce qu'un agrégateur existe pour trouver.
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Cet oracle n'a AUCUN chemin « je ne peux pas
// mesurer » : il ne depend d'aucun outil externe et lit des fichiers du depot. Le declarer
// vaut mieux que de le taire — un contrat muet laisse croire qu'un 1 peut etre une panne
// d'environnement (TF-0648).
import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

// N4 — les FAMILLES CLOSES de mots dont la disparition affaiblit une règle. Fermées à dessein :
// « tout » ou « chaque » sont trop fréquents en prose pour compter sans bruit ; ceux-ci ne
// s'écrivent dans un noyau que pour interdire, quantifier ou exclure.
//
// POURQUOI DES FAMILLES ET NON UNE LISTE PLATE (10/09/2026, A-109). La première version comptait
// chaque mot séparément, et elle REFUSAIT la reformulation que son propre message de refus
// recommande : « sur verdict … seulement » → « sur le seul verdict … » fait tomber « seulement »
// de 1 à 0 et monter « seul » de 0 à 1. L'exclusivité est intégralement conservée, et la règle
// criait à la perte. Éprouvé en conditions réelles : le hameçon refusait la réparation même du
// noyau qui a été faite ce matin. Une règle qui interdit son propre remède ne se contourne pas,
// elle se désactive — c'est ainsi qu'un gardien meurt. On compte donc par FAMILLE de sens : la
// perte se mesure sur le total de la famille, jamais sur un mot. Perdre « jamais » en ajoutant
// « seul » reste un FAIL, puisque ce sont deux familles distinctes.
const FAMILLES = {
  exclusivité: ["seulement", "seul", "seule", "seuls", "seules", "uniquement", "exclusivement"],
  négation: ["jamais", "aucun", "aucune", "aucuns", "aucunes", "sans exception"],
  universalité: ["toujours"],
  interdiction: ["interdit", "interdite", "interdits", "interdites"],
  obligation: ["obligatoire", "obligatoires"],
};

/** Compte les occurrences d'un mot, insensible à la casse, à frontière de mot UNICODE — un accent
 *  n'est pas une frontière (classe TF-0805 : « seule » ne doit pas matcher dans « seulement »). */
function compter(texte, mot) {
  const re = new RegExp("(?<![\\p{L}\\p{N}])" + mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\p{L}\\p{N}])", "giu");
  return (texte.match(re) || []).length;
}

/** Le noyau tel qu'il est COMMIS (HEAD), ou null hors dépôt git — jamais une chaîne vide. */
function noyauCommis(racine) {
  try {
    return execFileSync("git", ["-C", racine, "show", "HEAD:CLAUDE.md"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch { return null; }
}

/** N4 pur, testable sans git : rend les findings de la comparaison de deux textes.
 *
 *  EXPORTÉ (10/09/2026, A-109) parce que la LIMITE DÉCLARÉE de N4 se ferme ailleurs : la règle
 *  compare le noyau de travail à sa version COMMISE, donc elle ne voit plus un affaiblissement
 *  une fois qu'il est commis. La garde du passage travail → commit vit dans le hameçon de
 *  pré-commit, qui doit comparer l'INDEX à HEAD — pas l'arbre de travail, sinon il manquerait
 *  une perte mise en index et accuserait une édition non indexée. Une seule implémentation de
 *  la comparaison pour les deux appelants : celle-ci. */
export function jugerQuantificateurs(avant, apres) {
  const perdus = [];
  for (const [famille, mots] of Object.entries(FAMILLES)) {
    const total = (t) => mots.reduce((n, mot) => n + compter(t, mot), 0);
    const a = total(avant), b = total(apres);
    if (b < a) {
      // On NOMME les mots qui ont baissé : « la famille exclusivité perd 1 » n'aide personne à
      // retrouver la ligne, alors que « seulement 1 → 0 » la désigne.
      const detail = mots.filter((m) => compter(apres, m) < compter(avant, m))
        .map((m) => `« ${m} » ${compter(avant, m)} → ${compter(apres, m)}`).join(", ");
      perdus.push(`famille ${famille} ${a} → ${b} (${detail})`);
    }
  }
  return perdus;
}

const PLAFOND = 6144;

function juger(racine, precedent = undefined) {
  const findings = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

  const noyau = join(racine, "CLAUDE.md");
  if (!existsSync(noyau)) {
    ko("N1", "CLAUDE.md absent");
    return findings;
  }
  // TF-0417 (20/08) : octets comptés APRÈS normalisation CRLF→LF — sur un checkout Windows
  // (core.autocrlf) le même noyau pesait 98 octets de plus et le verdict dépendait du poste,
  // pas du contenu (idiome TF-0253/TF-0359 : le contenu se juge en LF).
  const taille = Buffer.byteLength(readFileSync(noyau, "utf8").split("\r\n").join("\n"), "utf8");
  taille <= PLAFOND
    ? ok("N1", `noyau ${taille} octets ≤ ${PLAFOND}`)
    : ko("N1", `noyau ${taille} octets > plafond ${PLAFOND} — déplacer le détail vers references\\`);

  // N4 — la perte d'un quantificateur entre la version commise et la version de travail.
  {
    const courant = readFileSync(noyau, "utf8");
    const avant = precedent !== undefined ? precedent : noyauCommis(racine);
    if (avant === null) {
      findings.push({ regle: "N4", statut: "NON_JUGE", message: "aucune version commise lisible du noyau (hors dépôt git) — la perte d'un quantificateur ne peut pas être jugée, et ce n'est PAS un PASS" });
    } else {
      const perdus = jugerQuantificateurs(avant, courant);
      perdus.length
        ? ko("N4", `${perdus.length} quantificateur(s) DISPARU(S) du noyau par rapport à la version commise : ${perdus.join(", ")} — un mot qui interdit, quantifie ou exclut ne se retire pas pour tenir un budget (R-43 : renforcer oui, assouplir jamais ; TF-1010)`)
        : ok("N4", "aucun quantificateur perdu par rapport à la version commise");
    }
  }

  const refDir = join(racine, "references");
  // Une citation est `references\X.md` en tête de chemin : `skills\…\references\X.md` désigne le
  // dossier d'un AUTRE dépôt (trouvé le 03/09 dans ETAPES-RUN.md dès la première lecture transitive).
  const RE_CITATION = /(?<![\\/\w])references\\([\w-]+\.md)/g;
  const citer = (contenu) => new Set([...contenu.matchAll(RE_CITATION)].map((m) => m[1]));
  // Clôture des citations depuis le noyau (D-3 (b), 03/09/2026) : un document atteint est lu à son
  // tour, et ce qu'il cite devient atteint — l'index n'est pas un cas spécial, c'est une référence
  // citée qui cite. Une référence que seul un document NON atteint cite reste orpheline.
  const citees = citer(readFileSync(noyau, "utf8"));
  const parQui = new Map([...citees].map((f) => [f, "le noyau"]));
  const aLire = [...citees];
  while (aLire.length) {
    const f = aLire.shift();
    const chemin = join(refDir, f);
    if (!existsSync(chemin)) continue;
    for (const g of citer(readFileSync(chemin, "utf8")))
      if (!citees.has(g)) { citees.add(g); parQui.set(g, `references\\${f}`); aLire.push(g); }
  }
  for (const f of citees)
    existsSync(join(refDir, f))
      ? ok("N2", `references\\${f} cité par ${parQui.get(f)} et présent`)
      : ko("N2", `references\\${f} cité par ${parQui.get(f)} mais ABSENT`);
  if (existsSync(refDir))
    for (const f of readdirSync(refDir).filter((n) => n.endsWith(".md")))
      if (!citees.has(f)) ko("N3", `references\\${f} existe mais n'est cité ni par le noyau ni par un document qu'il cite (orphelin)`);
  if (!findings.some((x) => x.regle === "N3")) ok("N3", "aucune référence orpheline");
  return findings;
}

// ---- self-test : chaque règle dans les DEUX sens ---------------------------------------------
function selfTest() {
  const cas = [];
  const monter = (noyauTexte, refs) => {
    const base = mkdtempSync(join(tmpdir(), "noyau-"));
    mkdirSync(join(base, "references"));
    writeFileSync(join(base, "CLAUDE.md"), noyauTexte);
    for (const [nom, contenu] of Object.entries(refs)) writeFileSync(join(base, "references", nom), contenu);
    return base;
  };
  const echoue = (findings, regle) => findings.some((f) => f.regle === regle && f.statut === "FAIL");

  // Vert : noyau court, une référence citée et présente, aucune orpheline.
  const vert = juger(monter("noyau bref citant `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x" }));
  cas.push(["vert — noyau conforme", !vert.some((f) => f.statut === "FAIL")]);

  // N1 : le plafond. La règle la plus utile de l'oracle, et celle qui n'avait jamais échoué
  // sous les yeux de personne — un octet de trop DOIT suffire, sinon la borne est molle.
  const trop = juger(monter("x".repeat(PLAFOND + 1), {}));
  cas.push(["N1  — un seul octet au-dessus du plafond", echoue(trop, "N1")]);
  const pile = juger(monter("x".repeat(PLAFOND), {}));
  cas.push(["N1  — exactement au plafond (borne inclusive)", !echoue(pile, "N1")]);

  // N2 : une référence citée mais absente — le noyau promet une page qui n'existe pas.
  const absente = juger(monter("cite `references\\FANTOME.md`.\n", {}));
  cas.push(["N2  — référence citée mais absente", echoue(absente, "N2")]);

  // N3 : une page de references\ que le noyau ne cite pas — donc jamais chargée par un run.
  const orpheline = juger(monter("cite `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x", "ORPHELINE.md": "y" }));
  cas.push(["N3  — page de references\\ non citée", echoue(orpheline, "N3")]);

  // N3 transitif (D-3 (b), 03/09) : une page citée seulement par l'index, lui-même cité par le
  // noyau, est ATTEINTE ; la même page citée par un index que le noyau ne cite pas reste orpheline
  // — et l'index aussi. Une entrée d'index vers un fichier absent tombe sous N2.
  const parIndex = juger(monter("cite `references\\INDEX.md`.\n", { "INDEX.md": "cite `references\\ACCUEIL.md`", "ACCUEIL.md": "x" }));
  cas.push(["N3  — page citée par l'index que le noyau cite (transitif)", !echoue(parIndex, "N3") && !echoue(parIndex, "N2")]);
  const indexOrphelin = juger(monter("rien.\n", { "INDEX.md": "cite `references\\ACCUEIL.md`", "ACCUEIL.md": "x" }));
  cas.push(["N3  — index non cité par le noyau : lui et ce qu'il cite restent orphelins", echoue(indexOrphelin, "N3")]);
  const entreeMorte = juger(monter("cite `references\\INDEX.md`.\n", { "INDEX.md": "cite `references\\FANTOME.md`" }));
  cas.push(["N2  — entrée d'index vers un fichier absent", echoue(entreeMorte, "N2")]);

  // N4 (TF-1010) — dans ses TROIS sens, sans git : le texte commis est passé directement.
  const regle = "- Livrable accepté sur verdict d'oracle exécuté seulement ; jamais de réponse inventée.\n";
  const baseN4 = monter(regle + "Cite `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x" });
  // rouge : le mot « seulement » retiré — le cas exact du 10/09.
  const sansSeulement = juger(baseN4, regle.replace(" seulement", "") === regle ? regle : regle);
  const perdu = juger(monter(regle.replace(" seulement", "") + "Cite `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x" }), regle);
  cas.push(["N4  — « seulement » retiré entre la version commise et la version de travail : FAIL", echoue(perdu, "N4")
            && perdu.find((f) => f.regle === "N4").message.includes("seulement") && perdu.find((f) => f.regle === "N4").message.includes("1 → 0")]);
  // vert : même texte.
  cas.push(["N4  — texte identique : PASS", !echoue(sansSeulement, "N4")]);
  // vert : le mot DÉPLACÉ (même compte) — N4 juge la perte, pas la prose.
  const deplace = juger(monter("- Livrable accepté seulement sur verdict d'oracle exécuté ; jamais de réponse inventée.\nCite `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x" }), regle);
  cas.push(["N4  — quantificateur déplacé, compte égal : PASS", !echoue(deplace, "N4")]);
  // frontière Unicode : « seule » ne compte pas dans « seulement », et sa perte n'est pas masquée.
  const accent = juger(monter("la seulement règle\nCite `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x" }), "la seule règle seulement\n");
  cas.push(["N4  — « seule » perdu n'est pas masqué par « seulement » (frontière Unicode)", echoue(accent, "N4")
            && accent.find((f) => f.regle === "N4").message.includes("« seule »")]);
  // hors dépôt git : NON_JUGE, jamais PASS.
  const horsGit = juger(monter("x\n", {}));
  cas.push(["N4  — sans version commise : NON_JUGE déclaré, ni PASS ni FAIL", horsGit.some((f) => f.regle === "N4" && f.statut === "NON_JUGE")]);

  // Noyau absent : refus franc, jamais un PASS par défaut.
  const vide = juger(mkdtempSync(join(tmpdir(), "vide-")));
  cas.push(["N1  — CLAUDE.md absent", echoue(vide, "N1")]);

  let bons = 0;
  for (const [nom, tenu] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom}`);
    if (tenu) bons += 1;
  }
  console.log(`Self-test oracle-claude-md : ${bons}/${cas.length}`);
  return bons === cas.length ? 0 : 1;
}

// ---- entrée -----------------------------------------------------------------------------------
//
// L'ENTRÉE NE S'EXÉCUTE QUE SI CE FICHIER EST LE PROGRAMME LANCÉ (10/09/2026, A-109). Sans cette
// garde, le module JUGEAIT et APPELAIT process.exit() dès qu'un autre fichier l'importait : la
// garde de pré-commit qui réutilise `jugerQuantificateurs` n'a jamais eu la main, et son cas rouge
// rendait 0 en silence — un contrôle muet, pas un contrôle indulgent. Un module qui sort du
// processus à l'import ne peut être réutilisé par personne, et son banc double sens ne le voit pas
// puisqu'il s'exécute, lui, en programme principal.
const LANCE_DIRECTEMENT = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("oracles/oracle-claude-md.mjs");
if (LANCE_DIRECTEMENT) {
if (process.argv.includes("--self-test")) process.exit(selfTest());

const racine = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), "..");
const findings = juger(racine);
const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({ oracle: "oracle-claude-md", version: "1.3.0", verdict: echecs ? "FAIL" : "PASS", findings,
  non_juge: ["N4 juge la DISPARITION d'un mot d'une liste close, jamais son sens : un quantificateur ajouté dans une phrase qui l'inverse (« jamais interdit ») passe ; et un mot hors liste qui portait une exclusivité (« exclusif », « strictement ») n'est pas vu — la liste s'étend au registre, pas dans le code", "N4 compare à HEAD : un affaiblissement déjà COMMIS n'est plus vu au tour suivant — la règle protège le passage travail → commit, c'est le hameçon de pré-commit ou la suite du dépôt qui doit la jouer"] }, null, 1));
process.exit(echecs ? 1 : 0);
}
