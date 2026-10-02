#!/usr/bin/env node
/**
 * lib-baseline-recettes.test.mjs — le CLIQUET du nombre de cas par recette (TF-0681).
 *
 * LE FAIT QU'IL FERME. Le 26/08/2026, un fichier de recette a été écrasé et ONZE CAS ont
 * disparu. Le harnais a rendu tout vert : il joue le fichier, lit sa ligne de résumé, compte un
 * OK — et ce compte est AUTO-DÉCLARÉ, donc rien ne savait ce qu'il valait la veille.
 *
 * Les promesses, chacune dans les deux sens :
 *   · une BAISSE est un échec, une HAUSSE inscrit la nouvelle valeur ;
 *   · les DEUX formes de résumé du dépôt sont lues — imposer une forme unique ferait sortir du
 *     cliquet toutes les recettes existantes le jour de sa publication ;
 *   · un résumé ILLISIBLE est déclaré non jugé, jamais tenu pour conforme ;
 *   · une recette EN ÉCHEC ne fait pas baisser la baseline — son compte partiel n'a rien à voir
 *     avec la disparition d'un cas ;
 *   · un cas NON JOUÉ sur ce poste pour un motif DÉCLARÉ n'est pas perdu, et un cas manquant sans
 *     déclaration lisible l'est toujours (TF-1434).
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { compteDe, confronter, ecrire, lire, nonJouesDe } from "./lib-baseline-recettes.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "baseline-recettes-"));
const JOUR = "2026-08-26";
const ok = (nom, resume) => ({ nom, statut: "OK", resume });

// ── la lecture du compte ─────────────────────────────────────────────────────────────────────

check("les DEUX formes de résumé du dépôt sont lues", () => {
  // Imposer une forme unique ferait sortir du cliquet toutes les recettes existantes le jour de
  // sa publication — le contrôle mesurerait alors l'écart à son auteur, pas la couverture.
  att(compteDe("emettre-travaux (TF-0627) : 24 PASS, 0 FAIL") === 24, "forme « N PASS » mal lue");
  att(compteDe("Self-test unicite : 14/14 PASS (verte PASS…)") === 14, "forme « N/N PASS » mal lue");
  att(compteDe("Self-test conformité projet : 44 PASS, 0 FAIL") === 44, "compte à deux chiffres mal lu");
});

check("le ratio nu est lu SANS exiger le mot « PASS »", () => {
  // Mesure du premier passage du cliquet : exiger « PASS » laissait 39 recettes sur 73 hors du
  // contrôle, dont deux familles parfaitement comptables. Une règle qui impose une forme que le
  // dépôt n'emploie pas mesure l'écart à son auteur, pas la couverture.
  att(compteDe("relever-heritage : 14/14 tests verts") === 14, "« N/N tests verts » non lu");
  att(compteDe("Recette cadence : 16/16 cas") === 16, "« Recette X : N/N cas » non lu");
});

check("TF-0738 — une DATE à barre oblique dans le libellé n'est pas prise pour le compte de cas", () => {
  // Le fait mesuré le 01/09 : « normaliser-lot (TF-0196 + forme hybride du 01/09) : 6 PASS,
  // 0 FAIL » enregistré au cliquet comme « 1 cas » — le ratio nu passait en premier, non ancré,
  // et « 01/09 » matchait avant « 6 PASS ». Une baseline fausse dès son premier passage laisse
  // ensuite cinq cas disparaître sans un mot.
  att(compteDe("normaliser-lot (TF-0196 + forme hybride du 01/09) : 6 PASS, 0 FAIL") === 6,
    "la date du libellé a été lue comme le compte — la baseline naît fausse");
  att(compteDe("recette du 01/09 : 16/16 cas") === 16,
    "avec deux ratios, ce n'est pas le DERNIER qui est lu — le compte clôt un résumé, une date le commence");
});

check("TF-1169 — une DATE en FIN de résumé n'est pas prise pour le compte de cas non plus", () => {
  // Le fait mesuré le 17/09 : « hook-restitution : 23/23 — … du tour (17/09), hors format … »
  // enregistré au cliquet comme 17 cas, et le harnais en échec sur « 22 → 17 cas, 5 DISPARU(S) »
  // alors que la recette venait de GAGNER un cas. TF-0738 avait déplacé la lecture du PREMIER ratio
  // au DERNIER ; le même défaut est revenu par l'autre bout. Les deux cas ci-dessous ne diffèrent
  // que par la POSITION de la date, et les deux doivent rendre 23 : c'est la seule forme qui prouve
  // que la lecture s'ancre sur la FORME du compte et non sur un bout de ligne.
  att(compteDe("hook-restitution : 23/23 — marqueur lu en tête de ligne (17/09), hors format refusé") === 23,
    "la date en fin de résumé a été lue comme le compte — le harnais annonce des cas perdus qui n'existent pas");
  att(compteDe("hook-restitution (correction du 17/09) : 23/23 — marqueur lu en tête de ligne") === 23,
    "la date en tête de résumé a été lue comme le compte — c'est le défaut de TF-0738, par l'autre bout");
  // SENS ROUGE : un résumé dont le SEUL ratio est une date n'a aucun compte lisible. Rendre le
  // nombre de la date serait une baseline fausse dès son premier passage, et personne ne verrait
  // naître l'erreur ; `null` fait NOMMER la recette au harnais.
  att(compteDe("relever-heritage : tous les tests verts (17/09)") === null,
    "un résumé dont le seul ratio est une date a produit un compte au lieu d'être déclaré illisible");
});

check("un verdict d'ÉTAT du parc n'est pas pris pour un compte de cas", () => {
  // Les oracles d'état rendent « I4 — PASS sur le parc » : aucun chiffre, donc rien à compter.
  // Les compter à zéro ferait échouer le cliquet à chaque exécution sur une absence normale.
  att(compteDe("I4 — PASS sur le parc") === null, "un verdict d'état a produit un compte");
  att(compteDe("I3 — familles numérotées : disque et tables d'accord") === null,
    "une ligne sans chiffre a produit un compte");
});

check("un résumé sans compte rend `null`, et `null` n'est PAS zéro", () => {
  // Zéro cas serait un FAIT ; illisible est un AVEU. Les confondre ferait tomber la baseline
  // d'une recette à chaque changement de sa mise en forme.
  att(compteDe("tout va bien") === null, "un résumé sans chiffre a rendu un compte");
  att(compteDe("") === null, "un résumé vide a rendu un compte");
  att(compteDe(undefined) === null, "une absence de résumé a levé ou rendu un compte");
});

// ── le cliquet ───────────────────────────────────────────────────────────────────────────────

check("une BAISSE est dénoncée, avec le nombre exact de cas perdus", () => {
  // Le cas fondateur, aux chiffres près : 22 cas devenus 11.
  const b = confronter([ok("todo/x.test.mjs", "x : 11 PASS, 0 FAIL")],
    { "todo/x.test.mjs": { cas: 22, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 1, "la baisse n'est pas dénoncée");
  att(b.baisses[0].perdus === 11, `${b.baisses[0].perdus} cas perdus annoncés au lieu de 11`);
  att(b.baseline["todo/x.test.mjs"].cas === 22, "la baseline a été abaissée sans décision");
});

check("une HAUSSE inscrit la nouvelle valeur — le cliquet ne descend jamais", () => {
  const b = confronter([ok("todo/x.test.mjs", "x : 24 PASS, 0 FAIL")],
    { "todo/x.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0, "une hausse a été prise pour une baisse");
  att(b.baseline["todo/x.test.mjs"].cas === 24, "la hausse n'a pas été inscrite");
  att(b.baseline["todo/x.test.mjs"].vu_le === JOUR, "la date de la hausse n'est pas inscrite");
});

check("un compte ÉGAL ne bouge rien — ni écriture, ni verdict", () => {
  const b = confronter([ok("todo/x.test.mjs", "x : 11 PASS, 0 FAIL")],
    { "todo/x.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0 && b.montees.length === 0, "un compte stable a produit un mouvement");
  att(b.baseline["todo/x.test.mjs"].vu_le === "2026-08-25", "la date a bougé sans raison");
});

check("une recette INCONNUE de la baseline est une première mesure, pas une baisse", () => {
  const b = confronter([ok("todo/neuve.test.mjs", "neuve : 5 PASS, 0 FAIL")], {}, JOUR);
  att(b.baisses.length === 0, "une recette neuve a été prise pour une baisse");
  att(b.montees.length === 1 && b.montees[0].avant === null, "la première mesure n'est pas signalée comme telle");
  att(b.baseline["todo/neuve.test.mjs"].cas === 5, "la première mesure n'est pas inscrite");
});

// ── les bornes ───────────────────────────────────────────────────────────────────────────────

check("une recette EN ÉCHEC ne fait pas baisser la baseline", () => {
  // Une recette en échec a déjà son verdict. Lire son compte partiel ferait baisser la baseline
  // pour une raison qui n'a RIEN à voir avec la disparition d'un cas — et le vrai défaut, une
  // fois la recette réparée, passerait alors inaperçu.
  const b = confronter([{ nom: "todo/x.test.mjs", statut: "ECHEC", resume: "x : 3 PASS, 8 FAIL" }],
    { "todo/x.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.baisses.length === 0, "une recette en échec a été comptée comme une baisse");
  att(b.baseline["todo/x.test.mjs"].cas === 11, "la baseline a bougé sur une recette en échec");
});

check("un résumé ILLISIBLE est DÉCLARÉ non jugé, jamais tenu pour conforme", () => {
  // Sans cela, une recette qui change son format de sortie sortirait du cliquet SANS QUE
  // PERSONNE NE LE VOIE — exactement la classe de défaut que ce cliquet existe pour fermer.
  const b = confronter([ok("todo/muette.test.mjs", "tout va bien")],
    { "todo/muette.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.nonLus.length === 1, "la recette illisible n'est pas déclarée");
  att(b.baisses.length === 0, "un résumé illisible a été pris pour une baisse");
  att(b.baseline["todo/muette.test.mjs"].cas === 11, "la baseline a bougé sur un résumé illisible");
});

check("une baseline absente ou abîmée rend un objet vide, jamais une exception", () => {
  // Un cliquet qui lève sur son propre fichier transformerait une donnée manquante en panne du
  // harnais entier — et le harnais est ce qui juge tout le reste.
  att(Object.keys(lire(join(T, "il-n-existe-pas.json"))).length === 0, "un fichier absent a levé");
  const abime = join(T, "abime.json");
  writeFileSync(abime, "{ ceci n'est pas du JSON", "utf8");
  att(Object.keys(lire(abime)).length === 0, "un fichier abîmé a levé");
  const tableau = join(T, "tableau.json");
  writeFileSync(tableau, "[1,2,3]", "utf8");
  att(Object.keys(lire(tableau)).length === 0, "un tableau a été accepté comme baseline");
});

check("le fichier écrit est TRIÉ — un fichier versionné dont l'ordre bouge est illisible", () => {
  const f = join(T, "baseline.json");
  ecrire(f, { "z/z.test.mjs": { cas: 1 }, "a/a.test.mjs": { cas: 2 } });
  const relu = readFileSync(f, "utf8");
  att(relu.indexOf("a/a.test.mjs") < relu.indexOf("z/z.test.mjs"), "les clés ne sont pas triées");
  att(Object.keys(lire(f)).length === 2, "le fichier écrit ne se relit pas");
});

check("TF-1082 rouge — une recette ENTIÈRE disparue du passage est NOMMÉE, son entrée gardée, rien d'inventé", () => {
  // Le cliquet comptait des CAS, pas des FICHIERS : une recette disparue entière sortait en silence.
  // Elle est désormais nommée ; le compte de cas, lui, ne la déclare pas « baisse » (autre objet).
  const b = confronter([], { "todo/disparue.test.mjs": { cas: 11, vu_le: "2026-08-25" } }, JOUR);
  att(b.disparues.length === 1 && b.disparues[0].nom === "todo/disparue.test.mjs" && b.disparues[0].cas === 11, "la disparition n'est pas nommée");
  att(b.baisses.length === 0 && b.nonLus.length === 0, "la disparition a été comptée comme une baisse de cas ou un non-lu");
  att(b.baseline["todo/disparue.test.mjs"].cas === 11, "l'entrée d'une recette absente a été perdue en silence");
  att(Object.keys(b.baseline).length === 1, "une recette a été inventée");
});

check("TF-1082 rouge — une EXEMPTION disparue est nommée aussi : sans compte, elle n'avait aucune autre protection", () => {
  const b = confronter([ok("oracles/a.test.mjs", "a : 3 PASS, 0 FAIL")],
    { "oracles/a.test.mjs": { cas: 3 }, "oracle-x.mjs (parc réel)": { non_lu: true, motif: "état du parc" } }, JOUR);
  att(b.disparues.length === 1 && b.disparues[0].exemption === true, "l'exemption disparue n'est pas nommée comme telle");
});

check("TF-1082 borne — une recette présente et EN ÉCHEC n'est PAS une disparition", () => {
  const b = confronter([{ nom: "oracles/a.test.mjs", statut: "ECHEC", resume: "a : 1 PASS, 2 FAIL" }], { "oracles/a.test.mjs": { cas: 3 } }, JOUR);
  att(b.disparues.length === 0, "une recette en échec est prise pour une disparition");
});

// ── TF-1434 : un cas NON JOUÉ pour un motif déclaré n'est pas un cas PERDU ──────────────────────
//
// Le fait du 28/09 : le cliquet relevé à 19 sur le poste qui joue le cas 5 bis de bootstrap, 17/17
// sur l'autre, et « 19 → 17 cas, 2 DISPARU(S) » à chaque passage sans qu'aucun cas ait été retiré.
// La recette est construite comme le harnais la voit : sa sortie ENTIÈRE, et sa dernière ligne.
const recette = (nom, ...lignes) => ({ nom, statut: "OK", sortie: lignes.join("\n") + "\n", resume: lignes[lignes.length - 1] });
const DECLARATION = "[NON JOUÉ] 2 cas — bootstrap 5 bis (TF-1337) : le contrôle de frontmatter de forge-agents est absent de ce poste";
const CLIQUET_19 = { "./bootstrap.test.mjs": { cas: 19, vu_le: "2026-09-27" } };

check("TF-1434 vert — 17 cas joués et 2 DÉCLARÉS non joués face à un cliquet de 19 : pas accusé, et nommé", () => {
  const b = confronter([recette("./bootstrap.test.mjs", DECLARATION, "bootstrap : 17/17 — vierge clone 14/14")], CLIQUET_19, JOUR);
  att(b.baisses.length === 0, `un cas non joué pour un motif déclaré est accusé comme perdu : ${JSON.stringify(b.baisses)}`);
  att(b.nonJoues.length === 1 && b.nonJoues[0].nom === "./bootstrap.test.mjs" && b.nonJoues[0].joues === 17 && b.nonJoues[0].nonJoues === 2,
    `la déclaration n'est pas rendue pour être nommée : ${JSON.stringify(b.nonJoues)}`);
  att(/5 bis \(TF-1337\)/.test(b.nonJoues[0].declarations[0].motif), "le motif de la déclaration est perdu : le harnais ne pourrait pas dire POURQUOI");
  att(b.baseline["./bootstrap.test.mjs"].cas === 19 && b.baseline["./bootstrap.test.mjs"].vu_le === "2026-09-27", "le cliquet a bougé sur un compte égal");
});

check("TF-1434 rouge — 17 cas joués SANS déclaration face à un cliquet de 19 : toujours accusé, 2 perdus", () => {
  const b = confronter([recette("./bootstrap.test.mjs", "bootstrap : 17/17 — vierge clone 14/14")], CLIQUET_19, JOUR);
  att(b.baisses.length === 1 && b.baisses[0].perdus === 2, `une vraie disparition passe : ${JSON.stringify(b.baisses)}`);
  att(b.nonJoues.length === 0, "un non-jeu a été inventé");
});

check("TF-1434 rouge — un cas VRAIMENT disparu reste accusé même quand d'autres sont déclarés non joués", () => {
  // 16 joués + 2 déclarés = 18 : la déclaration ne couvre que ce qu'elle déclare.
  const b = confronter([recette("./bootstrap.test.mjs", DECLARATION, "bootstrap : 16/16 — vierge clone 14/14")], CLIQUET_19, JOUR);
  att(b.baisses.length === 1 && b.baisses[0].perdus === 1 && b.baisses[0].vu === 18 && b.baisses[0].nonJoues === 2,
    `la déclaration a masqué un cas disparu : ${JSON.stringify(b.baisses)}`);
});

check("TF-1434 rouge — un « NON JOUÉ » hors de la forme fermée n'est pas lu : le cas manquant reste accusé", () => {
  // La ligne que le banc écrivait avant ce correctif : sans crochets ni compte, elle ne dit pas COMBIEN.
  const b = confronter([recette("./bootstrap.test.mjs",
    "bootstrap 5 bis (TF-1337) : NON JOUÉ — le contrôle de frontmatter de forge-agents est absent de ce poste",
    "bootstrap : 17/17 — vierge clone 14/14")], CLIQUET_19, JOUR);
  att(b.baisses.length === 1 && b.baisses[0].perdus === 2, `une déclaration sans compte a été créditée : ${JSON.stringify(b.baisses)}`);
});

check("TF-1434 — le RELEVÉ est le même d'un poste à l'autre pour un même code : première mesure 19 des deux côtés", () => {
  const joue = confronter([recette("./bootstrap.test.mjs", "bootstrap : 19/19 — vierge clone 14/14")], {}, JOUR);
  const nonJoue = confronter([recette("./bootstrap.test.mjs", DECLARATION, "bootstrap : 17/17 — vierge clone 14/14")], {}, JOUR);
  att(joue.baseline["./bootstrap.test.mjs"].cas === 19 && nonJoue.baseline["./bootstrap.test.mjs"].cas === 19,
    `le cliquet dépend du poste : ${joue.baseline["./bootstrap.test.mjs"].cas} là où le cas est joué, ${nonJoue.baseline["./bootstrap.test.mjs"].cas} ailleurs`);
  att(Object.keys(nonJoue.baseline["./bootstrap.test.mjs"]).sort().join() === "cas,vu_le", "le poste a laissé une trace dans le relevé");
});

check("TF-1434 — la lecture : plusieurs déclarations s'additionnent, fins de ligne CRLF comprises, et rien n'est lu ailleurs", () => {
  const d = nonJouesDe("  [PASS] a\r\n[NON JOUÉ] 2 cas — x : absent\r\n  [NON JOUE] 1 cas : y absent\r\nrésumé : 3/3\r\n");
  att(d.length === 2 && d[0].cas === 2 && d[1].cas === 1 && d[0].motif === "x : absent" && d[1].motif === "y absent", JSON.stringify(d));
  att(nonJouesDe("un texte qui cite [NON JOUÉ] 2 cas au milieu d'une phrase").length === 0, "une citation en milieu de ligne a été lue comme une déclaration");
  att(nonJouesDe("[NON JOUÉ] deux cas — sans chiffre").length === 0, "une déclaration sans compte a été lue");
  att(nonJouesDe(undefined).length === 0 && nonJouesDe(null).length === 0, "une sortie absente a levé ou rendu une déclaration");
});

// ── TF-1477 : DEUX recettes réelles du dépôt se déclaraient NON JOUÉES hors de la forme fermée ──
// (sans crochets, sans compte) quand leur environnement d'exécution manque sur ce poste. Lues par
// CE cliquet, une telle ligne ne vaut RIEN (cf. ci-dessus, « hors de la forme fermée ») : la
// recette sort alors des « sans compte lisible » (`nonLus`, affiché « [NON JUGÉ] ») plutôt que
// d'être comptée. Les deux fallbacks sont forcés ici par l'environnement, réellement rejoués.
{
  const { spawnSync } = await import("node:child_process");
  const { dirname, join: jn } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const RACINE = jn(dirname(fileURLToPath(import.meta.url)), "..");

  check("TF-1477 — verifier-ooxml.test.mjs sans python déclare ses 3 cas dans la forme comptée", () => {
    // PATH vidé : les trois binaires (python, python3, py) deviennent introuvables, sans toucher
    // au poste — c'est la MÊME branche que « aucun interpréteur python sur ce poste ».
    const r = spawnSync(process.execPath, [jn(RACINE, "scripts", "verifier-ooxml.test.mjs")],
      { encoding: "utf8", env: { ...process.env, PATH: "", Path: "" } });
    att(r.status === 0, `exit ${r.status} attendu 0 (déclaré, pas supposé vert) : ${(r.stdout || "") + (r.stderr || "")}`);
    const d = nonJouesDe(r.stdout || "");
    att(d.length === 1 && d[0].cas === 3,
      `le fallback sans python n'est pas lu par le cliquet (forme hors de « [NON JOUÉ] <n> cas ») : ${JSON.stringify(d)} — sortie : ${r.stdout}`);
  });

  check("TF-1477 — oracle-enclenchement.test.mjs sans mécanisme joignable déclare ses 27 cas dans la forme comptée", () => {
    // FORGE_ROOT pointé vers un dossier vide : forge-tests n'y existe pas, MECANISME_REEL est
    // introuvable — même branche que sur un poste sans le clone.
    const T = mkdtempSync(join(tmpdir(), "enclenchement-vide-"));
    const r = spawnSync(process.execPath, [jn(RACINE, "oracles", "oracle-enclenchement.test.mjs")],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: T } });
    att(r.status === 0, `exit ${r.status} attendu 0 : ${(r.stdout || "") + (r.stderr || "")}`);
    const d = nonJouesDe(r.stdout || "");
    att(d.length === 1 && d[0].cas === 27,
      `le fallback sans mécanisme n'est pas lu par le cliquet : ${JSON.stringify(d)} — sortie : ${r.stdout}`);
  });
}

console.log(`\nbaseline-recettes (TF-0681) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
