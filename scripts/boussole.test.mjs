#!/usr/bin/env node
/**
 * boussole.test.mjs — recette de scripts/boussole.mjs (lots L-01 à L-04 et L-06 du 21/11/2026, references/BOUSSOLE.md).
 * Tout se joue dans un dossier jetable : un faux pilot, une fausse racine de projets, deux faux dossiers d'utilisateur
 * (deux postes) et un faux dossier synchronisé. Chaque contrôle a son cas rouge quand il en a un.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  calculer, normaliserEtape, typeDeRun, forgesNommees, niveauProuve, noteSur100, JALONS, fusionner,
  annoncer, contredire, debutant, noter, declarerCanal, ligneBoussole, lignesReleve, fichierPreferences, FICHIER_CANAL,
} from "./boussole.mjs";

let pass = 0, fail = 0;
const ok = (c, glose) => { console.log(`  [${c ? "PASS" : "FAIL"}] ${glose}`); c ? pass++ : fail++; };

const base = mkdtempSync(join(tmpdir(), "boussole-"));
const racine = join(base, "dev");
const pilot = join(racine, "digit-ai-factory");
mkdirSync(join(pilot, "references"), { recursive: true });
mkdirSync(join(pilot, "catalogues"), { recursive: true });
const accueil = (ligneCreer) => `# Accueil\n\n## Routage intention → situation\n\nMode de lecture.\n\n| L'utilisateur veut… | Situation | Réf |\n|---|---|---|\n| ${ligneCreer} | run complet | x |\n| faire évoluer / remédier | run de version | x |\n| obtenir un conseil (problématique de charge) | conseil | x |\n| tester et corriger | tests | x |\n| auditer le produit (« audit complet », gouvernance) | audit | x |\n\n## Suite\n`;
writeFileSync(join(pilot, "references", "ACCUEIL.md"), accueil("créer un produit"), "utf8");
writeFileSync(join(pilot, "references", "PREFERENCES-PORTEUR.md"), "# Préférences\n\n- préférence du porteur\n", "utf8");
writeFileSync(join(pilot, "catalogues", "catalogue.jsonl"), [
  { schema: "x" },
  { id: "cat-tes-01", forge: "tests", nom: "Audit forge-tests", intention: "tester", statut: "prouve" },
  { id: "cat-web-01", forge: "websec", nom: "Sécurité du livrable", intention: "sécuriser", statut: "prouve" },
  { id: "cat-dat-01", forge: "data", nom: "Profiler", intention: "données", statut: "declare" },
].map((o) => JSON.stringify(o)).join("\n") + "\n", "utf8");

const ecrireJournal = (dossier, entrees) => { mkdirSync(join(dossier, "forge"), { recursive: true }); writeFileSync(join(dossier, "forge", "ledger.jsonl"), entrees.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8"); };
const projetA = join(racine, "produit-a");
ecrireJournal(projetA, [
  { seq: 1, ts: "2026-11-01T09:00:00Z", type: "run_open", run: "a-1", brief: "run de version du produit", forges_mobilisees: ["digit-ai-forge-conception", "digit-ai-forge-agents-security (skill x)"] },
  { seq: 2, ts: "2026-11-02T09:00:00Z", type: "oracles_verdict", oracles: [{ oracle: "o", verdict: "PASS" }] },
  { seq: 3, ts: "2026-11-03T09:00:00Z", type: "reponse_humain", reponse: "3a" },
  { seq: 4, ts: "2026-11-04T09:00:00Z", type: "etape_close", etape: "Développement / socle documentaire" },
]);
const copieA = join(racine, "produit-a-copie");
ecrireJournal(copieA, JSON.parse("[" + readFileSync(join(projetA, "forge", "ledger.jsonl"), "utf8").trim().split("\n").join(",") + "]"));
const neuf = join(racine, "produit-neuf");
mkdirSync(neuf, { recursive: true });
const poste1 = join(base, "poste1"), poste2 = join(base, "poste2"), drive = join(base, "Drive");
mkdirSync(drive, { recursive: true });

console.log("boussole.test.mjs");

// Normalisation des traces (L-03)
ok(normaliserEtape({ etape: "Développement / socle" }) === "development" && normaliserEtape({ etape: "MEP / console" }) === "mep"
  && normaliserEtape({ etape: "tests" }) === "tests" && normaliserEtape({ etape: "revision e du baromètre" }) === null
  && normaliserEtape({ etape: "audit libre", etape_norme: "conception" }) === "conception",
  "L-03 — étape normalisée : premier mot ou etape_norme ; un intitulé libre sans étape rend null (rouge)");
ok(typeDeRun({ type_run: "mandat" }) === "mandat" && typeDeRun({ brief: "run de version (correctifs)" }) === "version"
  && typeDeRun({ prompt: "PROMPT-PRODUIT.md" }) === "complet" && typeDeRun({ run: "x" }) === null,
  "L-03 — type de run : type_run d'abord, puis le texte ; une ouverture muette rend null (rouge)");
ok(JSON.stringify(forgesNommees(["digit-ai-forge-agents-security (skill)", "forge-agents", "seo-geo", "pilot"]).sort()) === JSON.stringify(["agents", "agents-security", "seo-geo"]),
  "forges nommées : agents-security n'est pas lue comme agents, « pilot » n'est pas une forge");

// Niveau et note
ok(niveauProuve(new Set()) === 1 && niveauProuve(new Set(["J-01"])) === 2 && niveauProuve(new Set(["J-01", "J-02", "J-03"])) === 4
  && niveauProuve(new Set(["J-01", "J-02", "J-03", "J-08"])) === 5 && niveauProuve(new Set(["J-02", "J-03"])) === 1,
  "niveaux : chaque passage exige le précédent (une décision sans livrable vert reste au niveau 1)");
ok(JALONS.length === 30 && noteSur100(17) === 57 && noteSur100(30) === 100, "30 jalons ; 17 jalons valent 57/100, l'exemple de l'étude");

// L-01 : le niveau suit l'utilisateur d'un projet à l'autre
const eNeuf = calculer({ pilot, cwd: neuf, racine, dir: poste1 });
ok(eNeuf.niveau === 3 && eNeuf.etat.situation === "neuf", `L-01 — sur un projet neuf, le niveau vient des autres projets du poste (niveau ${eNeuf.niveau}, pas 1)`);
ok(eNeuf.projets === 1, `L-01 — les copies d'un même projet (début de journal identique) ne comptent qu'une fois (${eNeuf.projets} projet)`);
ok(eNeuf.ids.has("J-14") === false && eNeuf.ids.has("J-15") && eNeuf.ids.has("J-11") && eNeuf.ids.has("J-18") && eNeuf.ids.has("J-29"),
  "L-01 — jalons lus : run de version, étape development, forges conception et agents-security");
const eA = calculer({ pilot, cwd: projetA, racine, dir: poste1 });
ok(eA.etat.situation === "run" && eA.niveau === eNeuf.niveau, "L-01 — deux projets du même utilisateur rendent le même niveau ; l'état du projet reste propre à chacun");
const lignes = ligneBoussole(eNeuf);
ok(lignes.length >= 2 && /^Boussole — vous : niveau 3 · \d+\/100\. Ce projet : neuf/.test(lignes[0]) && lignes.some((l) => /Prochain jalon/.test(l)),
  "L-01 — la ligne d'ouverture dit le niveau, la note, l'état du projet et le prochain jalon");

// L-02 : phrases lues dans la source, jamais recopiées
ok(eNeuf.phrases[0] === "« Je veux créer un produit : … »" && eNeuf.phrases.some((p) => /obtenir un conseil : … »$/.test(p)),
  "L-02 — les phrases d'intention sont lues dans le tableau de routage d'ACCUEIL.md, parenthèses retirées");
writeFileSync(join(pilot, "references", "ACCUEIL.md"), accueil("lancer un produit neuf"), "utf8");
const ePhr = calculer({ pilot, cwd: neuf, racine, dir: poste1, ecrire: false });
ok(!ePhr.phrases.some((p) => /créer un produit/.test(p)), "L-02 — rouge : la source modifiée change les phrases (aucune copie dans le code)");
writeFileSync(join(pilot, "references", "ACCUEIL.md"), accueil("créer un produit"), "utf8");
ok(eNeuf.services.map((s) => s.forge).join(",") === "tests,websec", "L-02 — services utiles : prouvés seulement, dans les forges pas encore mobilisées");

// L-02 : annonce, contradiction, question unique
annoncer(poste1, 5);
const eAnn = calculer({ pilot, cwd: neuf, racine, dir: poste1 });
ok(eAnn.niveau === 5 && eAnn.statut === "annoncé" && eAnn.note === eNeuf.note, "L-02 — un niveau annoncé change ce que dit la boussole, jamais la note");
contredire(poste1, eAnn.prouve);
const eCon = calculer({ pilot, cwd: neuf, racine, dir: poste1 });
ok(eCon.niveau === 4 && eCon.statut === "annoncé", "L-02 — une annonce contredite redescend d'un niveau");
contredire(poste1, eCon.prouve);
const eCon2 = calculer({ pilot, cwd: neuf, racine, dir: poste1 });
ok(eCon2.niveau === 3 && eCon2.statut === "prouvé" && !eCon2.progression.niveau_annonce, "L-02 — l'annonce qui rejoint le prouvé disparaît");
const vide = join(base, "vide"); mkdirSync(vide, { recursive: true });
const posteVierge = join(base, "poste-vierge");
const q1 = calculer({ pilot, cwd: join(vide), racine: vide, dir: posteVierge });
const q2 = calculer({ pilot, cwd: join(vide), racine: vide, dir: posteVierge });
ok(q1.poser_question && !q2.poser_question && lignesReleve(q1).some((l) => /Poste vierge/.test(l)) && !lignesReleve(q2).some((l) => /Poste vierge/.test(l)),
  "L-02 — poste vierge : la question unique est posée une fois, jamais deux");
debutant(posteVierge);
ok(calculer({ pilot, cwd: vide, racine: vide, dir: posteVierge }).niveau === 1, "L-02 — « non » à la question : niveau 1, sans annonce");
ok(!calculer({ pilot, cwd: neuf, racine, dir: join(base, "poste-trace") }).poser_question, "L-02 — rouge : un poste qui porte des traces ne pose pas la question");

// L-04 : progression synchronisée, sans nom de projet, sans perte
declarerCanal(poste1, drive);
noter(poste1, "J-07", "hook-lexique");
const s1 = calculer({ pilot, cwd: neuf, racine, dir: poste1 });
const distant = JSON.parse(readFileSync(join(drive, FICHIER_CANAL), "utf8"));
ok(s1.envoye && distant.jalons.some((j) => j.id === "J-07"), "L-04 — la progression part vers le dossier synchronisé déclaré");
ok(!/produit-a|produit-neuf|digit-ai-factory/.test(JSON.stringify(distant)), "L-04 — le fichier synchronisé ne porte aucun nom de projet ni chemin");
declarerCanal(poste2, drive);
const autreRacine = join(base, "autre"); mkdirSync(autreRacine, { recursive: true });
noter(poste2, "J-05", "test");
const s2 = calculer({ pilot, cwd: autreRacine, racine: autreRacine, dir: poste2 });
ok(s2.ids.has("J-07") && s2.ids.has("J-01") && s2.ids.has("J-05") && s2.statut === "prouvé sur un autre poste" && s2.niveau === 3,
  `L-04 — sur le second poste, sans projet : niveau ${s2.niveau} « ${s2.statut} », jalons du premier poste repris`);
const s1b = calculer({ pilot, cwd: neuf, racine, dir: poste1 });
ok(s1b.ids.has("J-05") && s1b.ids.has("J-07"), "L-04 — deux postes qui progressent en parallèle additionnent leurs jalons, aucun ne se perd");
const f = fusionner({ jalons: [{ id: "J-01", le: "2026-11-05" }] }, { jalons: [{ id: "J-01", le: "2026-11-02" }, { id: "J-99", le: "2026-11-01" }] });
ok(f.jalons.length === 1 && f.jalons[0].le === "2026-11-02", "L-04 — fusion : la date la plus ancienne gagne, un jalon inconnu est écarté");
let refus = false; try { declarerCanal(join(base, "poste3"), join(base, "nulle-part")); } catch { refus = true; }
ok(refus, "L-04 — rouge : un dossier synchronisé introuvable est refusé à la déclaration");

// L-06 : préférences de l'utilisateur
const prefPorteur = fichierPreferences(pilot, join(base, "poste-sans-pref"));
mkdirSync(join(base, "poste-pref"), { recursive: true });
writeFileSync(join(base, "poste-pref", "PREFERENCES-UTILISATEUR.md"), "# Mes préférences\n\n- la mienne\n", "utf8");
const prefPerso = fichierPreferences(pilot, join(base, "poste-pref"));
ok(prefPorteur && !prefPorteur.utilisateur && /PREFERENCES-PORTEUR/.test(prefPorteur.chemin) && prefPerso.utilisateur && /PREFERENCES-UTILISATEUR/.test(prefPerso.chemin),
  "L-06 — le fichier de l'utilisateur remplace celui du porteur quand il existe ; sans lui, rien ne change");

// Aucune écriture sous recette
process.env.FORGE_SANS_OBSERVATION = "1";
const posteMuet = join(base, "poste-muet");
calculer({ pilot, cwd: neuf, racine, dir: posteMuet });
ok(!existsSync(join(posteMuet, "progression.json")), "FORGE_SANS_OBSERVATION=1 : rien n'est écrit");
delete process.env.FORGE_SANS_OBSERVATION;

rmSync(base, { recursive: true, force: true });
console.log(`\nboussole : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
