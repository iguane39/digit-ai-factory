#!/usr/bin/env node
/**
 * boussole.test.mjs — recette de scripts/boussole.mjs (lots L-01 à L-04 et L-06 du 21/11/2026, references/BOUSSOLE.md).
 * Tout se joue dans un dossier jetable : un faux pilot, une fausse racine de projets, deux faux dossiers d'utilisateur
 * (deux postes) et un faux dossier synchronisé. Chaque contrôle a son cas rouge quand il en a un.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  calculer, normaliserEtape, typeDeRun, forgesNommees, niveauProuve, noteSur100, JALONS, fusionner,
  annoncer, contredire, debutant, noter, declarerCanal, ligneBoussole, lignesReleve, fichierPreferences, FICHIER_CANAL,
  prochainJalon, skillDansHistorique,
} from "./boussole.mjs";

let pass = 0, fail = 0;
const ok = (c, glose) => { console.log(`  [${c ? "PASS" : "FAIL"}] ${glose}`); c ? pass++ : fail++; };

const base = mkdtempSync(join(tmpdir(), "boussole-"));
process.env.FORGE_TRANSCRIPTS_DIR = join(base, "transcripts-vides"); // jamais les vraies transcriptions du poste
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

// Textes selon le niveau (synthèse 20261122a, GO « A1 » du 22/11/2026)
const J = (id) => JALONS.find((j) => j.id === id);
const fauxEtat = (niveau, manquants = ["J-07", "J-23", "J-26"]) => ({ niveau, statut: "prouvé", note: 90, etat: { situation: "existant", texte: "produit existant, aucun run ouvert" },
  phrases: ["« Je veux faire évoluer : … »"], services: [{ nom: "Profiler", forge: "data" }], manquants: manquants.map(J), prochain: J(manquants[0]) });
const n5 = ligneBoussole(fauxEtat(5));
ok(n5.length === 1 && n5[0] === "Boussole — niveau 5 · 90/100 · reste : un skill appelé par sa formule, forge-data, forge-seo-geo.",
  `niveau 5 : une seule ligne, sans mode d'emploi (« ${n5.join(" / ")} »)`);
ok(/et 2 autres\.$/.test(ligneBoussole(fauxEtat(5, ["J-07", "J-23", "J-26", "J-27", "J-28"]))[0]) && /tous les jalons sont prouvés/.test(ligneBoussole(fauxEtat(5, []))[0]),
  "niveau 5 : trois jalons restants nommés au plus, puis leur nombre ; aucun restant le dit");
const n4 = ligneBoussole(fauxEtat(4)), n3 = ligneBoussole(fauxEtat(3)), n2 = ligneBoussole(fauxEtat(2)), n1 = ligneBoussole(fauxEtat(1));
ok(!n4.some((l) => /Dites par exemple/.test(l)) && n4.some((l) => /Services utiles/.test(l)) && !n3.some((l) => /Dites par exemple/.test(l)) && n3.some((l) => /« 3a »/.test(l)),
  "rouge levé : aux niveaux 3 et 4, un produit existant n'affiche plus de phrases d'exemple ; le niveau 3 dit comment trancher, le 4 les services");
ok(n2.some((l) => /bloc 0/.test(l)) && n2.some((l) => /Dites par exemple/.test(l)) && n1.some((l) => /Dites par exemple/.test(l)) && n1.some((l) => /^Prochain jalon : .+ : .+\.$/.test(l)) && !n2.some((l) => /^Prochain jalon : .+\(\+\d+\) : /.test(l)),
  "niveaux 1 et 2 : phrases d'exemple ; au niveau 1 seulement, le prochain jalon dit ce qu'il apporte");

// Prochain jalon par pertinence
const m = (ids) => ids.map(J);
ok(prochainJalon(m(["J-07", "J-23", "J-26"]), 5, "pilot").id === "J-23" && prochainJalon(m(["J-07", "J-15", "J-23"]), 4, "existant").id === "J-15"
  && prochainJalon(m(["J-07", "J-23"]), 2, "existant").id === "J-07" && prochainJalon(m(["J-07"]), 5, "pilot").id === "J-07" && prochainJalon([], 5, "pilot") === null,
  "prochain jalon : dès le niveau 4, d'abord ce que le projet peut prouver, puis une forge, les gestes de débutant en dernier ; avant le niveau 4, l'ordre de la liste");

// J-07 prouvé par l'historique
const tr = join(base, "transcripts"), trSession = join(tr, "c--dev-produit");
mkdirSync(trSession, { recursive: true });
const tA = join(trSession, "a.jsonl"), tB = join(trSession, "b.jsonl");
writeFileSync(tA, JSON.stringify({ type: "user", timestamp: "2026-09-01T08:00:00Z", tools: [{ name: "Skill", description: "Invoke a skill." }] }) + "\n", "utf8");
writeFileSync(tB, JSON.stringify({ type: "user" }) + "\n" + '{"type":"assistant","timestamp":"2026-10-05T09:30:00Z","message":{"content":[{"type":"tool_use","id":"x","name":"Skill","input":{"skill":"prompt-analyzer-l99"}}]}}' + "\n", "utf8");
utimesSync(tA, new Date("2026-09-01T08:00:00Z"), new Date("2026-09-01T08:00:00Z"));
utimesSync(tB, new Date("2026-10-05T10:00:00Z"), new Date("2026-10-05T10:00:00Z"));
const h1 = skillDansHistorique(tr);
ok(h1.trouve?.le === "2026-10-05", `J-07 : un appel du skill dans une transcription le prouve, daté par sa ligne (${h1.trouve?.le})`);
ok(skillDansHistorique(tr, "2026-11-01T00:00:00.000Z").trouve === null && skillDansHistorique(join(base, "nulle-part")).trouve === null,
  "J-07, rouge : la seule description de l'outil ne prouve rien, et les fichiers déjà lus ne se relisent pas");
const posteH = join(base, "poste-historique");
const eH = calculer({ pilot, cwd: neuf, racine, dir: posteH, transcripts: tr });
ok(eH.ids.has("J-07") && eH.progression.jalons.find((j) => j.id === "J-07").preuve === "appel de skill (transcription de session)",
  "J-07 : calculer() le reprend de l'historique et le garde dans la progression");
const posteH2 = join(base, "poste-historique-2"), trVide = join(base, "transcripts-sans-skill");
mkdirSync(join(trVide, "p"), { recursive: true }); writeFileSync(join(trVide, "p", "a.jsonl"), '{"type":"user"}\n', "utf8");
const eH2 = calculer({ pilot, cwd: neuf, racine, dir: posteH2, transcripts: trVide });
ok(!eH2.ids.has("J-07") && Boolean(eH2.progression.historique_lu_le), "J-07, rouge : sans appel de skill, rien n'est prouvé, et le repère de lecture avance");

// Aucune écriture sous recette
process.env.FORGE_SANS_OBSERVATION = "1";
const posteMuet = join(base, "poste-muet");
calculer({ pilot, cwd: neuf, racine, dir: posteMuet });
ok(!existsSync(join(posteMuet, "progression.json")), "FORGE_SANS_OBSERVATION=1 : rien n'est écrit");
delete process.env.FORGE_SANS_OBSERVATION;

rmSync(base, { recursive: true, force: true });
console.log(`\nboussole : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
