#!/usr/bin/env node
/**
 * ingerer-r47.test.mjs — R-47 câblée à l'arrivée d'un lot : le cercle est rompu.
 *
 * Le fait fondateur du 23/08, et il vaut plus que la règle elle-même. Le défaut d'héritage
 * d'Produit-02 était DÉJÀ VU par `oracle-conformite-projet` — R-43 rendait FAIL, mot pour
 * mot : « précédence de la factory non câblée ». L'oracle existait, il voyait, et personne ne
 * l'a joué. Il n'est déclenché qu'à l'OUVERTURE d'un run et à sa CLÔTURE ; entre les deux, le
 * seul mécanisme qui pourrait le rejouer est le hook de la factory installé chez le produit —
 * or ce hook fait partie des artefacts manquants. Le contrôle dépendait d'un artefact dont il
 * était lui-même le seul juge.
 *
 * Ce que ces cas verrouillent : que le pilot le dise à un moment qu'il maîtrise (un produit qui
 * remet un lot se nomme), et qu'il ne BLOQUE PAS. Refuser l'ingestion parce que le produit n'a
 * pas ses gabarits punirait deux fois le même défaut — une fois à la porte, une fois sur le
 * travail déjà fait. Quinze candidatures l'ont payé en trois jours.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
const GAB = join(ICI, "..", "gabarits");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "r47-"));

/** Un parc d'essai VIDE mais utilisable : il porte les deux tables jetables que la chaine
 *  d'ingestion exige depuis le 28/08 (voir la note dans `poste`). Sans elles, les deux bornes
 *  « produit introuvable » echouent pour une raison qui n'est pas celle qu'elles mesurent. */
const parcVide = () => {
  const r = mkdtempSync(join(T, "poste-vide-"));
  writeFileSync(join(r, "_noms-interdits.json"),
    JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
  writeFileSync(join(r, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
  return r;
};
const LOT_CONFORME = "# lot\n\n## Remarques restées au produit\n\n"
  + "Aucune remarque n'est restée au produit — vérifié le 2026-08-23.\n\n"
  + "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit.\n";

/** Pose un faux poste : une racine de forges contenant le produit nommé. */
const poste = (nomProjet, { herite, sousDossier = null }) => {
  const racine = mkdtempSync(join(T, "poste-"));
  // TF-0704 (31/08) — UN POSTE D'ESSAI A BESOIN DE SES PROPRES TABLES D'ANONYMISATION.
  //
  // Le 28/08, l'anonymisation est entrée DANS la chaîne d'ingestion : elle refuse d'écrire au
  // registre si ses deux tables manquent, et c'est son comportement voulu — anonymiser à moitié
  // ferait passer le registre pour propre. Cette recette isole son parc en posant `FORGE_ROOT` sur
  // un répertoire jetable, si bien que l'anonymiseur y cherche des tables qui n'y sont pas : elle
  // est rouge depuis ce jour-là, et pour une raison qui n'a rien à voir avec ce qu'elle mesure.
  //
  // Les tables posées ici sont JETABLES et vides de tout nom réel : ce banc juge le câblage de
  // R-47 à l'ingestion, pas la substitution des noms. Leur présence suffit à ce que la chaîne
  // consente à écrire, et c'est tout ce qu'on lui demande.
  writeFileSync(join(racine, "_noms-interdits.json"),
    JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
  writeFileSync(join(racine, "_produits-pseudonymes.json"),
    JSON.stringify({ produits: {} }), "utf8");
  // TF-0555 (24/08) : le parc REEL range 22 produits sous un dossier client (`_Client-A\`), et la
  // recherche d'origine ne regardait que les enfants DIRECTS de la racine. Tous etaient donc hors
  // de portee, et le defaut que R-47 devait rattraper est reste vivant sur l'un d'eux. Le bac
  // d'essai sait maintenant reproduire ce rangement.
  const projet = sousDossier ? join(racine, sousDossier, nomProjet) : join(racine, nomProjet);
  mkdirSync(join(projet, "forge"), { recursive: true });
  if (herite) {
    // TF-0627 (25/08) : CETTE FIXTURE EST DERIVEE DU CONTRAT, PLUS RECOPIEE A LA MAIN.
    // Elle enumerait les artefacts un par un — la meme classe que les dix listes d'exclusion de
    // TF-0543 et que le gabarit de configuration de TF-0539 : une liste recopiee se perime au
    // premier ajout, EN SILENCE. Elle s'est perimee le 25/08, quand le contrat est passe de huit
    // a dix artefacts pour ouvrir le canal des travaux : la fixture VERTE s'est mise a rendre un
    // avertissement, et c'est la recette qui a paye, pas le produit. Derivee, elle suit le contrat.
    const contrat = JSON.parse(readFileSync(join(GAB, "HERITAGE.json"), "utf8"));
    for (const a of contrat.artefacts) {
      const cible = join(projet, String(a.cible).replaceAll("/", "\\"));
      mkdirSync(dirname(cible), { recursive: true });
      const source = join(GAB, "..", String(a.source).replaceAll("/", "\\"));
      // Deux artefacts ont un CONTENU juge, pas seulement une presence : les recopier depuis le
      // gabarit ne suffirait pas, l'oracle y cherche des marqueurs precis. Ils restent explicites.
      if (a.cible === ".claude/settings.json") {
        writeFileSync(cible, JSON.stringify({ hooks: { Stop: [{ hooks: [{ type: "command", command: "node forge/hooks/factory.mjs restitution" }] }] } }));
      } else if (a.cible === "CLAUDE.md") {
        writeFileSync(cible, "# projet\n\n## Précédence (R-43)\nLes règles de la factory priment.\n");
      } else if (existsSync(source)) {
        writeFileSync(cible, readFileSync(source, "utf8"));
      } else {
        // Mode `presence` sans source lisible : le contrat n'exige que l'existence.
        writeFileSync(cible, "");
      }
    }
  }
  return racine;
};

let serie = 0;
const ingerer = (nomProjet, racine, { racineProduit = null } = {}) => {
  const d = mkdtempSync(join(T, "lot-"));
  const base = `${nomProjet} - RETOURS - 2026082${++serie}a`;
  writeFileSync(join(d, `${base}.md`), LOT_CONFORME, "utf8");
  writeFileSync(join(d, `${base}.tf.jsonl`), JSON.stringify({
    schema: 1, titre: "pilot : un retour de recette R-47", contenu: "c", demandeur: nomProjet,
    source: "recette", date_demande: "2026-08-23", forges_cibles_initiales: ["digit-ai-factory"],
    ...(racineProduit ? { racine_produit: racineProduit } : {}),
  }) + "\n", "utf8");
  const registre = join(d, "reg.jsonl");
  writeFileSync(registre, "", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, join(d, `${base}.tf.jsonl`), "--registre", registre, "--sans-fetch"],
    { encoding: "utf8", timeout: 180000, env: { ...process.env, FORGE_ROOT: racine } });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), registre };
};

check("rouge — produit dont l'héritage manque : l'ingestion AVERTIT et nomme les artefacts absents", () => {
  const r = ingerer("ProduitNu", poste("ProduitNu", { herite: false }));
  if (!/R-47 — AVERTISSEMENT/.test(r.sortie)) throw new Error("aucun avertissement R-47 — le cercle n'est pas rompu");
  if (!/RETOURS-FORGES\.md/.test(r.sortie)) throw new Error("l'avertissement ne NOMME pas l'artefact manquant — un constat sans nom ne se répare pas");
});

check("BORNE — et il n'a PAS bloqué : le lot est ingéré quand même", () => {
  const r = ingerer("ProduitNu2", poste("ProduitNu2", { herite: false }));
  if (r.code !== 0) throw new Error(`exit ${r.code} — refuser ici punirait deux fois le même défaut`);
  const creations = readFileSync(r.registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((e) => e.titre).length;
  if (creations !== 1) throw new Error(`${creations} création(s) — le travail du produit doit entrer malgré son héritage incomplet`);
});

check("verte — produit dont l'héritage est complet et à jour : aucun avertissement", () => {
  const r = ingerer("ProduitConforme", poste("ProduitConforme", { herite: true }));
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
  if (/AVERTISSEMENT/.test(r.sortie)) throw new Error("avertissement sur un produit conforme — un contrôle qui crie toujours se fait ignorer");
});

check("BORNE — produit introuvable sur le poste : déclaré non vérifié, JAMAIS accusé", () => {
  const r = ingerer("ProduitAilleurs", parcVide());
  if (r.code !== 0) throw new Error(`exit ${r.code} — une remise venue d'ailleurs doit entrer`);
  if (!/NON vérifiée/.test(r.sortie)) throw new Error("le silence n'est pas déclaré — un produit qu'on ne localise pas n'est pas un produit en défaut");
  if (/AVERTISSEMENT/.test(r.sortie)) throw new Error("un produit absent du poste est accusé — ce serait crier sur toutes les remises venues d'ailleurs");
});

check("rouge — produit RANGE SOUS UN DOSSIER CLIENT : trouve, et son heritage juge (TF-0555)", () => {
  // Le defaut mesure le 24/08 : la recherche ne voyait que les enfants DIRECTS de la racine, et 22
  // produits du parc vivent sous un dossier de rangement. Le lot passait avec « dossier introuvable »
  // alors que le produit etait la, en defaut d'heritage — le mecanisme regardait ailleurs.
  const r = ingerer("ProduitRange", poste("ProduitRange", { herite: false, sousDossier: "_Client" }));
  if (/dossier introuvable/.test(r.sortie)) throw new Error("le produit range sous un dossier client reste INTROUVABLE — le cercle n'est pas referme");
  if (!/R-47 — AVERTISSEMENT/.test(r.sortie)) throw new Error("trouve mais non juge : l'avertissement d'heritage manque");
});

check("verte — le meme, range et CONFORME : trouve et silencieux", () => {
  const r = ingerer("ProduitRangeOk", poste("ProduitRangeOk", { herite: true, sousDossier: "_Client" }));
  if (/dossier introuvable/.test(r.sortie)) throw new Error("produit range non trouve alors qu'il est conforme");
  if (/AVERTISSEMENT/.test(r.sortie)) throw new Error("avertissement sur un produit conforme — un controle qui crie toujours se fait ignorer");
});

check("BORNE — produit introuvable : la NON-VERIFICATION est consignee au REGISTRE (TF-0555)", () => {
  // Une verification non faite qui ne laisse pas de trace est une verification qu'on croit faite.
  // Le message partait au seul flux d'erreur et disparaissait avec la session ; le registre en
  // garde desormais une ligne, avec le nom cherche et la racine balayee.
  const r = ingerer("ProduitAilleurs2", parcVide());
  if (!/dossier introuvable/.test(r.sortie)) throw new Error("le cas teste n'est pas celui du produit introuvable");
  const lignes = readFileSync(r.registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const trace = lignes.find((e) => e.heritage_non_verifie);
  if (!trace) throw new Error("aucune trace au registre — le silence ne survit pas a la session");
  // Depuis le 02/09 (TF-0761), le nom du projet consigné est PSEUDONYMISÉ comme la candidature —
  // le registre est suivi par git. La trace nomme donc le produit par son pseudonyme, jamais en clair.
  const projet = String(trace.heritage_non_verifie.projet || "");
  if (!/^Produit-\d{2,}$/.test(projet)) throw new Error(`la trace ne NOMME pas le produit cherche par son pseudonyme : « ${projet} »`);
  if (/ProduitAilleurs2/.test(JSON.stringify(trace))) throw new Error("la trace porte le nom du produit EN CLAIR dans un fichier suivi");
  if (!trace.heritage_non_verifie.racine) throw new Error("la trace ne dit pas OU la recherche a eu lieu");
});

check("TF-0731 — `racine_produit` déclaré par le sidecar est SUIVI : la seule source sûre est enfin lue", () => {
  // Le défaut mesuré le 01/09 : la garde lisait `nouvelles` — des CHAÎNES JSON — et
  // `.racine_produit` y rend toujours undefined. La voie recommandée par TF-0555 était morte
  // depuis sa pose, masquée par l'heuristique qui trouvait par ailleurs. Ce cas la rend
  // inévitable : le dossier du produit ne porte NI le nom du lot NI de lots — l'heuristique ne
  // peut pas le trouver, seule la déclaration le peut.
  const racine = poste("DossierSansRapport", { herite: true });
  const r = ingerer("ProduitDeclare", racine, { racineProduit: "DossierSansRapport" });
  if (!/racine declaree par le sidecar/.test(r.sortie)) {
    throw new Error("la racine déclarée n'a pas été suivie — la voie TF-0555 est toujours morte : "
      + r.sortie.split(String.fromCharCode(10)).filter((x) => /R-47/.test(x)).join(" | ").slice(0, 200));
  }
  if (/NON vérifiée/.test(r.sortie)) throw new Error("l'héritage n'a pas été jugé malgré la racine déclarée");
});

check("TF-0731 borne — une racine déclarée SANS forge\\ ne se suit pas les yeux fermés", () => {
  const racine = parcVide();
  mkdirSync(join(racine, "DossierVide"), { recursive: true });
  const r = ingerer("ProduitMenteur", racine, { racineProduit: "DossierVide" });
  if (!/on ne la suit pas les yeux fermes/.test(r.sortie)) {
    throw new Error("une racine déclarée sans forge\\ a été suivie ou tue — la déclaration prime, elle ne dispense pas de vérifier");
  }
});

check("BORNE — candidature HORS lot de retours : R-47 ne dit rien du tout", () => {
  // Un fichier `candidature-*.tf.jsonl` n'a pas de produit dans son nom. Crier dessus
  // apprendrait a ignorer le message — et un message qu'on ignore ne protege plus personne.
  const d = mkdtempSync(join(T, "hors-lot-"));
  const sidecar = join(d, "candidature-hors-lot-20260823.tf.jsonl");
  writeFileSync(sidecar, JSON.stringify({ schema: 1, titre: "pilot : candidature hors lot",
    contenu: "c", demandeur: "pilot", source: "recette", date_demande: "2026-08-23",
    forges_cibles_initiales: ["digit-ai-factory"] }) + "\n", "utf8");
  const registre = join(d, "reg.jsonl");
  writeFileSync(registre, "", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"], { encoding: "utf8", timeout: 180000 });
  const sortie = (r.stdout || "") + (r.stderr || "");
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${sortie.slice(0, 200)}`);
  if (/R-47/.test(sortie)) throw new Error("R-47 parle d'une candidature hors lot — bruit qui apprend a ignorer le message");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nR-47 câblée à l'ingestion : ${pass} PASS, ${fail} FAIL`);
if (!existsSync(OUTIL)) console.error("outil introuvable");
process.exit(fail ? 1 : 0);
