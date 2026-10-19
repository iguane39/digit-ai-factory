#!/usr/bin/env node
/**
 * relecture-intention.test.mjs — la relecture d'intention, dans les deux sens (D-23 (a), 18/10/2026).
 * Transcriptions SYNTHÉTIQUES en dossier temporaire ; aucune écriture dans le dépôt.
 *   VERT  : les messages humains sortent mot pour mot et dans l'ordre ; les fichiers écrits depuis le dernier message humain
 *           (Write, Edit, NotebookEdit) sont cités avec leur contenu ; la décision à laquelle répond « 23a + b » est retrouvée ;
 *           la consigne stricte est celle de la mesure du 18/10 ; la transcription la plus récente du projet courant est
 *           choisie ; le registre reçoit une ligne par relecture et par confirmation ; le relevé compte par type et par point ;
 *   ROUGE : un résultat d'outil, un retour de hook, un message système, de pair, de notification, du SDK ou le résumé d'une
 *           compaction n'est PAS un message humain ; une écriture antérieure au dernier message humain n'est pas citée ; un
 *           `.env` n'est jamais cité ; une borne est DITE ; un verdict inexploitable, un point ou un type inconnu, un
 *           identifiant inconnu, une confirmation sans alerte et une option inconnue rendent 2 sans rien écrire.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { executer, STRICTE, FORME_JSON, FORME_JSON_V1, CONSIGNE_V2, AJOUT_CONTENU_VISIBLE, AJOUT_REGLES, AJOUT_NATURE, MAX_PASSES, TYPES, texteHumain, lireVerdict, etatChaine, releverRegistre, numerosDeDecision, problemesReferentiel, verifierSources, reglesDesTypes, relusALaReception, sectionsDeConclusion, jugerForme } from "./relecture-intention.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const egal = (a, b, quoi) => { if (a !== b) throw new Error(`${quoi} : « ${String(a).slice(0, 200)} » ≠ attendu « ${String(b).slice(0, 200)} »`); };

const T = mkdtempSync(join(tmpdir(), "relecture-intention-"));
const MAISON = join(T, "maison");
const PROJET = join(T, "monprojet");
mkdirSync(PROJET, { recursive: true });
const slug = PROJET.replace(/[^A-Za-z0-9]/g, "-");

// ---- la transcription synthétique -----------------------------------------------------------------------------------
const H1 = "Étudie « l'opportunité » d'un relecteur,\navec deux lignes et des accents : œ, é, à — mot pour mot.";
const H2 = "pour chaque liste, pas seulement les longues";
const H3 = "23a + b";
const humain = (texte, extra = {}) => JSON.stringify({ type: "user", origin: { kind: "human" }, timestamp: "2026-10-18T10:00:00Z", message: { role: "user", content: [{ type: "text", text: texte }] }, ...extra });
const assistant = (blocs) => JSON.stringify({ type: "assistant", timestamp: "2026-10-18T10:00:05Z", message: { id: `m${Math.random()}`, role: "assistant", content: blocs } });
const texte = (t) => ({ type: "text", text: t });
const outil = (name, input) => ({ type: "tool_use", id: `t${Math.random()}`, name, input });

const GROS = join(T, "gros.md"), PETIT = join(T, "petit.md"), NOTE = join(T, "nb.ipynb"), ENV = join(T, ".env"), ANCIEN = join(T, "ancien.md"), EDITE = join(T, "edite.mjs");
writeFileSync(GROS, "x".repeat(70000) + "FIN-DU-GROS");
writeFileSync(PETIT, "# Petit livrable\nLe contenu du petit livrable.\n");
writeFileSync(NOTE, "{\"cells\": []}");
writeFileSync(ENV, "CLE_SECRETE=ne-doit-jamais-etre-citee\n");
writeFileSync(ANCIEN, "ECRIT-AVANT-LE-DERNIER-MESSAGE-HUMAIN");
writeFileSync(EDITE, "export const x = 1; // édité\n");

const DECISION = ["Voici la décision :", "", "> **D-23 — Faut-il lancer un essai de 2 semaines ?**", ">", "> - **Le problème** : la dérive naît dans la consigne.", "", "| Option | Ce qui se passe |", "|---|---|", "| (a) Essai | O4 |", "", "> **D-24 — Une autre décision ?**", "> - hors sujet"].join("\n");

const lignes = [
  humain(H1),
  assistant([texte("Je commence."), outil("Write", { file_path: ANCIEN, content: "x" })]),
  JSON.stringify({ type: "user", timestamp: "2026-10-18T10:00:06Z", message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t", content: "RESULTAT-D-OUTIL-A-NE-PAS-CITER" }] } }),
  JSON.stringify({ type: "attachment", attachment: { type: "hook_success", content: "RETOUR-DE-HOOK-A-NE-PAS-CITER" } }),
  JSON.stringify({ type: "user", isMeta: true, timestamp: "2026-10-18T10:00:07Z", message: { role: "user", content: "<system-reminder>MESSAGE-SYSTEME-A-NE-PAS-CITER</system-reminder>" } }),
  JSON.stringify({ type: "user", origin: { kind: "peer", body: "x" }, isMeta: true, message: { role: "user", content: "Another Claude session sent a message: MESSAGE-DE-PAIR-A-NE-PAS-CITER" } }),
  JSON.stringify({ type: "user", origin: { kind: "task-notification" }, message: { role: "user", content: "<task-notification>NOTIFICATION-A-NE-PAS-CITER</task-notification>" } }),
  JSON.stringify({ type: "user", turnOrigin: "sdk", message: { role: "user", content: "# Rubrique figée SDK-A-NE-PAS-CITER" } }),
  JSON.stringify({ type: "user", origin: { kind: "human" }, message: { role: "user", content: "This session is being continued from a previous conversation RESUME-DE-COMPACTION-A-NE-PAS-CITER" } }),
  assistant([texte(DECISION)]),
  humain(H2),
  assistant([texte("Question suivante."), outil("Bash", { command: "node scripts/exemple.mjs --effet" })]),
  humain(H3),
  assistant([outil("Write", { file_path: PETIT, content: "x" }), outil("Edit", { file_path: EDITE, old_string: "a", new_string: "b" }), outil("NotebookEdit", { notebook_path: NOTE, new_source: "x" }),
    outil("Write", { file_path: GROS, content: "x" }), outil("Write", { file_path: ENV, content: "x" }), outil("Write", { file_path: PETIT, content: "doublon" }), outil("Read", { file_path: ANCIEN }), outil("Bash", { command: "node scripts/effet-du-dernier-tour.mjs" })]),
  assistant([texte("Restitution finale du tour.")]),
];
const TRANSCRIPT = join(T, "session.jsonl");
writeFileSync(TRANSCRIPT, lignes.join("\n") + "\n");
const CTX = { cwd: PROJET, maison: MAISON };
const SORTIE = join(T, "sortie");
const REG = join(T, "registre.jsonl");

const fin = executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", SORTIE], {}, new Date("2026-10-18T12:00:00Z"), CTX);
const demande = existsSync(join(SORTIE, "demande.txt")) ? readFileSync(join(SORTIE, "demande.txt"), "utf8") : "";
const livrables = existsSync(join(SORTIE, "livrables.md")) ? readFileSync(join(SORTIE, "livrables.md"), "utf8") : "";

try {
  // ---- les messages humains ---------------------------------------------------------------------------------------
  check("vert — les messages humains sortent mot pour mot, dans l'ordre, numérotés", () => {
    egal(fin.code, 0, "exit");
    const i1 = demande.indexOf(`1. « ${H1} »`), i2 = demande.indexOf(`2. « ${H2} »`), i3 = demande.indexOf(`3. « ${H3} »`);
    if (i1 < 0 || i2 < 0 || i3 < 0 || !(i1 < i2 && i2 < i3)) throw new Error(demande.slice(0, 400));
  });
  for (const [marqueur, quoi] of [["RESULTAT-D-OUTIL", "un résultat d'outil"], ["RETOUR-DE-HOOK", "un retour de hook"], ["MESSAGE-SYSTEME", "un message système"], ["MESSAGE-DE-PAIR", "un message d'une autre session"],
    ["NOTIFICATION-A-NE", "une notification de tâche"], ["SDK-A-NE", "un message du SDK"], ["RESUME-DE-COMPACTION", "le résumé d'une compaction"]])
    check(`rouge — ${quoi} n'est pas un message humain`, () => {
      if (demande.includes(marqueur)) throw new Error(`« ${marqueur} » cité dans demande.txt`);
    });
  check("rouge — texteHumain refuse un résultat d'outil, un message méta, un message sans origine humaine ; accepte l'ancien format (turnOrigin human)", () => {
    egal(texteHumain({ type: "user", origin: { kind: "human" }, message: { content: [{ type: "tool_result", content: "x" }] } }), null, "résultat d'outil");
    egal(texteHumain({ type: "user", isMeta: true, origin: { kind: "human" }, message: { content: "x" } }), null, "méta");
    egal(texteHumain({ type: "user", message: { content: "x" } }), null, "sans origine");
    egal(texteHumain({ type: "user", turnOrigin: "human", message: { content: "ancien format" } }), "ancien format", "ancien format");
    egal(texteHumain({ type: "user", origin: { kind: "human" }, message: { content: [{ type: "text", text: "<ide_opened_file>un fichier</ide_opened_file>" }, { type: "text", text: "ma demande" }] } }), "ma demande", "balise IDE");
  });

  // ---- les décisions ----------------------------------------------------------------------------------------------
  check("vert — « 23a + b » : la décision D-23 telle qu'elle a été posée est retrouvée, pas la D-24 voisine", () => {
    if (!/D-23 \(posée avant le message 3\)/.test(demande)) throw new Error(demande.slice(demande.indexOf("Décisions"), demande.indexOf("Décisions") + 300));
    if (!demande.includes("Faut-il lancer un essai de 2 semaines ?") || !demande.includes("(a) Essai")) throw new Error("la décision posée n'est pas citée");
    if (demande.includes("hors sujet") || demande.includes("Une autre décision")) throw new Error("la décision D-24 voisine est citée");
  });

  // ---- les fichiers écrits ----------------------------------------------------------------------------------------
  check("vert — Write, Edit et NotebookEdit depuis le dernier message humain : chemins et contenus cités, une seule fois", () => {
    for (const [f, c] of [[PETIT, "Le contenu du petit livrable."], [EDITE, "// édité"], [NOTE, "\"cells\""]])
      if (!livrables.includes(f) || !livrables.includes(c)) throw new Error(`${f} ou son contenu absent`);
    egal(livrables.split(`— ${PETIT}`).length - 1, 1, "occurrences du chemin d'un fichier écrit deux fois");
    if (!/écrits ou modifiés par Write, Edit ou NotebookEdit depuis le dernier message humain : 5\./.test(livrables)) throw new Error("décompte des fichiers : " + livrables.slice(0, 200));
  });
  check("rouge — un fichier écrit AVANT le dernier message humain, et un fichier seulement lu, ne sont pas cités", () => {
    if (livrables.includes("ECRIT-AVANT") || livrables.includes(ANCIEN)) throw new Error("l'écriture antérieure est citée");
  });
  check("rouge — un `.env` écrit n'est jamais cité : son chemin oui, sa valeur non", () => {
    if (livrables.includes("ne-doit-jamais-etre-citee")) throw new Error("le contenu du .env transite");
    if (!/NON cité : un fichier `\.env` ne transite jamais/.test(livrables)) throw new Error("l'omission n'est pas dite");
  });
  check("borne — un fichier de 70 000 caractères est coupé, la borne et le total sont DITS ; un petit fichier n'est pas coupé", () => {
    if (!/COUPÉ : 60000 caractères cités sur 70011/.test(livrables)) throw new Error("borne non dite : " + (livrables.match(/COUPÉ[^\]]*/) || ["aucune"])[0]);
    if (livrables.includes("FIN-DU-GROS")) throw new Error("le fichier n'a pas été coupé");
    egal(livrables.split("COUPÉ").length - 1, 1, "bornes dites (le petit livrable ne doit pas porter de coupe)");
  });
  check("vert — la commande lancée pendant le tour est listée (pas celle d'un tour antérieur), et le dernier message du tour est cité", () => {
    if (!livrables.includes("node scripts/effet-du-dernier-tour.mjs")) throw new Error("commande du dernier tour absente");
    if (livrables.includes("exemple.mjs --effet")) throw new Error("la commande d'un tour antérieur est citée");
    if (!livrables.includes("Restitution finale du tour.")) throw new Error("dernier message absent");
  });
  check("borne — la demande trop longue omet le milieu et le DIT, le premier message et le dernier restent", () => {
    const longs = [humain("PREMIER-MESSAGE-DU-MANDAT"), ...Array.from({ length: 8 }, (_, i) => humain(`milieu-${i} ` + "y".repeat(7000))), humain("DERNIER-MESSAGE")];
    const f = join(T, "long.jsonl"); writeFileSync(f, longs.join("\n") + "\n");
    const d = join(T, "sortie-longue");
    executer(["--preparer", "fin-de-tour", "--transcript", f, "--sortie", d], {}, new Date(), CTX);
    const t = readFileSync(join(d, "demande.txt"), "utf8");
    if (!t.includes("PREMIER-MESSAGE-DU-MANDAT") || !t.includes("DERNIER-MESSAGE")) throw new Error("premier ou dernier message omis");
    if (!/message\(s\) humain\(s\) intermédiaire\(s\) OMIS sur 10 \(total \d+ caractères, borne 40000\)/.test(t)) throw new Error("omission non dite : " + t.slice(-300));
  });

  // ---- la consigne ------------------------------------------------------------------------------------------------
  check("vert — la consigne imprimée porte la consigne stricte de la mesure du 18/10, la forme JSON v2 et les deux fichiers", () => {
    const mesure = JSON.parse(readFileSync(join(RACINE, "output", "03-etudes", "20261018-mesure-relecteur-d-intention.json"), "utf8"));
    egal(STRICTE, mesure.consignes.stricte, "STRICTE ≠ consignes.stricte de la mesure");
    if (!fin.sortie.includes(STRICTE) || !fin.sortie.includes(FORME_JSON)) throw new Error("consigne stricte ou forme JSON absentes de la sortie");
    if (!fin.sortie.includes(CONSIGNE_V2)) throw new Error("la consigne version 2 n'est pas dans la sortie");
    if (!fin.sortie.includes(join(SORTIE, "demande.txt")) || !fin.sortie.includes(join(SORTIE, "livrables.md"))) throw new Error("chemins des deux fichiers absents");
    if (!/Lecture seule : tu lis EXACTEMENT deux fichiers/.test(fin.sortie)) throw new Error("lecture seule non dite");
  });
  check("vert — le référentiel recopie la consigne stricte, la forme JSON, les dates de l'essai et le seuil", () => {
    const ref = readFileSync(join(RACINE, "references", "RELECTURE-INTENTION.md"), "utf8");
    for (const m of [STRICTE, FORME_JSON, FORME_JSON_V1, AJOUT_CONTENU_VISIBLE, AJOUT_REGLES, AJOUT_NATURE, "2026-10-18", "2026-11-01", "2026-11-08", "4 000 000 de jetons", "`verificateur`", "alerte"])
      if (!ref.includes(m)) throw new Error(`référentiel sans « ${m.slice(0, 60)} »`);
  });
  check("vert — --preparer consigne : la consigne de délégation est le livrable, la demande reste celle de la transcription", () => {
    const c = join(T, "consigne-agent.md"); writeFileSync(c, "Corrige les listes dès 8 lignes.\n");
    const d = join(T, "sortie-consigne");
    const r = executer(["--preparer", "consigne", "--fichier", c, "--transcript", TRANSCRIPT, "--sortie", d], {}, new Date(), CTX);
    egal(r.code, 0, "exit");
    if (!readFileSync(join(d, "livrables.md"), "utf8").includes("Corrige les listes dès 8 lignes.")) throw new Error("consigne absente de livrables.md");
    if (!readFileSync(join(d, "demande.txt"), "utf8").includes(`2. « ${H2} »`)) throw new Error("demande absente");
    if (!/Le LIVRABLE est la consigne que l'on s'apprête à passer à un agent/.test(r.sortie)) throw new Error("la consigne du relecteur ne dit pas que le livrable est une consigne");
  });
  check("rouge — --preparer consigne sans --fichier, ou avec un fichier absent : 2", () => {
    egal(executer(["--preparer", "consigne", "--transcript", TRANSCRIPT], {}, new Date(), CTX).code, 2, "sans fichier");
    egal(executer(["--preparer", "consigne", "--fichier", join(T, "absent.md"), "--transcript", TRANSCRIPT], {}, new Date(), CTX).code, 2, "fichier absent");
  });

  // ---- la transcription par défaut --------------------------------------------------------------------------------
  const profil = join(T, "profil");
  const dossierProjet = join(profil, "projects", slug), autre = join(profil, "projects", "autre-projet");
  mkdirSync(dossierProjet, { recursive: true }); mkdirSync(autre, { recursive: true });
  const ecrire = (f, mot, date) => { writeFileSync(f, humain(mot) + "\n"); utimesSync(f, date, date); };
  ecrire(join(dossierProjet, "vieille.jsonl"), "MESSAGE-DE-LA-VIEILLE", new Date("2026-10-10T10:00:00Z"));
  ecrire(join(dossierProjet, "recente.jsonl"), "MESSAGE-DE-LA-RECENTE", new Date("2026-10-17T10:00:00Z"));
  ecrire(join(autre, "plus-recente-mais-ailleurs.jsonl"), "MESSAGE-D-UN-AUTRE-PROJET", new Date("2026-10-18T10:00:00Z"));
  check("vert — par défaut, la transcription la plus récente du projet courant (pas celle d'un autre projet, pas une plus ancienne)", () => {
    const d = join(T, "sortie-defaut");
    const r = executer(["--preparer", "fin-de-tour", "--sortie", d], { CLAUDE_CONFIG_DIR: profil }, new Date(), CTX);
    egal(r.code, 0, "exit");
    const t = readFileSync(join(d, "demande.txt"), "utf8");
    if (!t.includes("MESSAGE-DE-LA-RECENTE")) throw new Error("la transcription récente du projet n'est pas lue");
    if (t.includes("MESSAGE-DE-LA-VIEILLE") || t.includes("MESSAGE-D-UN-AUTRE-PROJET")) throw new Error("une transcription d'un autre fichier ou projet est lue");
  });
  check("rouge — sans transcription pour le projet courant : 2, et rien n'est inventé", () => {
    const r = executer(["--preparer", "fin-de-tour"], { CLAUDE_CONFIG_DIR: profil }, new Date(), { cwd: join(T, "projet-sans-transcription"), maison: MAISON });
    egal(r.code, 2, "exit");
    if (!/aucune transcription trouvée/.test(r.sortie)) throw new Error(r.sortie);
  });

  // ---- le registre ------------------------------------------------------------------------------------------------
  const verdict = (o) => { const f = join(T, `verdict-${Math.random().toString(36).slice(2)}.json`); writeFileSync(f, typeof o === "string" ? o : JSON.stringify(o)); return f; };
  const consigner = (v, point, type, extra = []) => executer(["--consigner", v, "--point", point, "--type", type, "--registre", REG, "--session", "sess-1", ...extra], {}, new Date("2026-10-18T12:00:00Z"), CTX);
  const lignesReg = () => (existsSync(REG) ? readFileSync(REG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
  check("vert — --consigner : une ligne horodatée (verdict, gravité, écarts, projet, session) ; la dérive majeure est une alerte", () => {
    const r1 = consigner(verdict({ verdict: "sert", gravite: "mineure", ecarts: [], confiance: "elevee" }), "fin-de-tour", "etude");
    const r2 = consigner(verdict({ verdict: "derive", gravite: "majeure", ecarts: [{ la_demande_dit: "a", le_livrable_fait: "b", pourquoi: "c" }], confiance: "moyenne" }), "consigne", "code");
    egal(r1.code + r2.code, 0, "exits");
    const l = lignesReg();
    egal(l.length, 2, "lignes");
    egal(l[0].id, "RI-20261018-01", "id 1"); egal(l[1].id, "RI-20261018-02", "id 2");
    egal(l[0].ts, "2026-10-18T12:00:00.000Z", "ts"); egal(l[0].projet, "monprojet", "projet"); egal(l[0].session, "sess-1", "session");
    egal(l[0].alerte, false, "sert sans alerte"); egal(l[1].alerte, true, "dérive majeure = alerte"); egal(l[1].ecarts, 1, "nombre d'écarts");
    if (!/ALERTE/.test(r2.sortie) || /ALERTE/.test(r1.sortie)) throw new Error("l'alerte n'est dite que pour la dérive majeure");
  });
  check("vert — un JSON entouré de texte est lu ; « dérive » accentué vaut « derive »", () => {
    const avant = lignesReg().length;
    const r = consigner(verdict("Voici mon verdict :\n```json\n{\"verdict\": \"dérive\", \"gravite\": \"bloquante\", \"ecarts\": [{\"pourquoi\": \"x\"}], \"confiance\": \"faible\"}\n```"), "fin-de-tour", "lot");
    egal(r.code, 0, "exit");
    egal(lignesReg().length, avant + 1, "ligne ajoutée");
    egal(lignesReg().pop().verdict, "derive", "verdict normalisé");
  });
  check("rouge — verdict inexploitable, point ou type inconnu, fichier absent : 2 et le registre ne bouge pas", () => {
    const avant = readFileSync(REG, "utf8");
    for (const [v, p, t, quoi] of [[verdict("pas du json"), "fin-de-tour", "etude", "pas de JSON"], [verdict({ verdict: "peut-être", gravite: "mineure" }), "fin-de-tour", "etude", "verdict inconnu"],
      [verdict({ verdict: "sert", gravite: "énorme" }), "fin-de-tour", "etude", "gravité inconnue"], [verdict({ verdict: "sert", gravite: "aucune" }), "milieu", "etude", "point inconnu"],
      [verdict({ verdict: "sert", gravite: "aucune" }), "fin-de-tour", "poème", "type inconnu"], [join(T, "absent.json"), "fin-de-tour", "etude", "fichier absent"]])
      egal(consigner(v, p, t).code, 2, quoi);
    egal(readFileSync(REG, "utf8"), avant, "registre modifié par un refus");
  });
  check("vert — --confirmer : la réponse humaine à une alerte est consignée (oui / non), la dernière fait foi", () => {
    const r = executer(["--confirmer", "RI-20261018-02", "oui", "--registre", REG], {}, new Date("2026-10-18T13:00:00Z"), CTX);
    egal(r.code, 0, "exit"); if (!/CONFIRMÉE/.test(r.sortie)) throw new Error(r.sortie);
    const dernier = lignesReg().pop();
    egal(dernier.ev, "confirmation", "ev"); egal(dernier.id, "RI-20261018-02", "id"); egal(dernier.confirme, true, "confirme");
  });
  check("rouge — --confirmer : identifiant inconnu, relecture sans alerte, réponse autre que oui/non : 2, rien d'écrit", () => {
    const avant = readFileSync(REG, "utf8");
    egal(executer(["--confirmer", "RI-20200101-01", "oui", "--registre", REG], {}, new Date(), CTX).code, 2, "id inconnu");
    egal(executer(["--confirmer", "RI-20261018-01", "oui", "--registre", REG], {}, new Date(), CTX).code, 2, "sans alerte");
    egal(executer(["--confirmer", "RI-20261018-02", "peut-être", "--registre", REG], {}, new Date(), CTX).code, 2, "réponse");
    egal(readFileSync(REG, "utf8"), avant, "registre modifié par un refus");
  });
  check("vert — lireVerdict : une dérive mineure est consignée telle quelle, sans alerte", () => {
    const v = lireVerdict(JSON.stringify({ verdict: "derive", gravite: "mineure", ecarts: [] }));
    egal(v.ok, true, "ok"); egal(v.verdict.verdict, "derive", "verdict");
  });

  // ---- le relevé --------------------------------------------------------------------------------------------------
  check("vert — --releve : par type et par point, relectures, dérives, alertes confirmées et infirmées", () => {
    const reg2 = join(T, "registre-releve.jsonl");
    const L = (id, ts, point, type, verdictV, gravite, alerte) => JSON.stringify({ ts, ev: "relecture", id, point, type, verdict: verdictV, gravite, ecarts: alerte ? 1 : 0, alerte });
    writeFileSync(reg2, [
      L("A", "2026-10-18T09:00:00Z", "fin-de-tour", "etude", "sert", "mineure", false),
      L("B", "2026-10-18T10:00:00Z", "fin-de-tour", "etude", "derive", "majeure", true),
      L("C", "2026-10-19T10:00:00Z", "fin-de-tour", "etude", "derive", "majeure", true),
      L("D", "2026-10-19T11:00:00Z", "consigne", "consigne", "derive", "bloquante", true),
      L("E", "2026-10-20T11:00:00Z", "consigne", "consigne", "sert", "aucune", false),
      JSON.stringify({ ts: "2026-10-19T12:00:00Z", ev: "confirmation", id: "B", confirme: true }),
      JSON.stringify({ ts: "2026-10-19T12:01:00Z", ev: "confirmation", id: "C", confirme: false }),
    ].join("\n") + "\n");
    const r = executer(["--releve", "--json", "--registre", reg2], {}, new Date(), CTX);
    egal(r.code, 0, "exit");
    const etude = r.releve.lignes.find((x) => x.type === "etude" && x.point === "fin-de-tour");
    const cons = r.releve.lignes.find((x) => x.type === "consigne" && x.point === "consigne");
    egal(JSON.stringify([etude.relectures, etude.derives, etude.confirmees, etude.infirmees, etude.sans_reponse]), "[3,2,1,1,0]", "étude");
    egal(JSON.stringify([cons.relectures, cons.derives, cons.confirmees, cons.infirmees, cons.sans_reponse]), "[2,1,0,0,1]", "consigne");
    egal(r.releve.total.relectures, 5, "total");
    const depuis = executer(["--releve", "--json", "--depuis", "2026-10-19", "--registre", reg2], {}, new Date(), CTX).releve;
    egal(depuis.total.relectures, 3, "depuis le 19/10");
    const texteReleve = executer(["--releve", "--registre", reg2], {}, new Date(), CTX).sortie;
    if (!/etude\s+fin-de-tour\s+3\s+2/.test(texteReleve) || !/TOTAL/.test(texteReleve)) throw new Error(texteReleve);
  });
  check("borne — --releve sur un registre absent ou une date invalide : exit 0 toujours, et le dit", () => {
    const r = executer(["--releve", "--registre", join(T, "inexistant.jsonl")], {}, new Date(), CTX);
    egal(r.code, 0, "exit"); if (!/aucune relecture consignée/.test(r.sortie)) throw new Error(r.sortie);
    const d = executer(["--releve", "--depuis", "hier", "--registre", join(T, "inexistant.jsonl")], {}, new Date(), CTX);
    egal(d.code, 0, "exit date invalide"); if (!/--depuis attend AAAA-MM-JJ/.test(d.sortie)) throw new Error(d.sortie);
  });
  check("borne — une option inconnue, ou aucun mode : 2", () => {
    egal(executer(["--inconnue"], {}, new Date(), CTX).code, 2, "option inconnue");
    egal(executer([], {}, new Date(), CTX).code, 2, "aucun mode");
    egal(executer(["--preparer", "milieu"], {}, new Date(), CTX).code, 2, "point inconnu");
  });
  // ==== D-26 (a) du 18/10/2026 : la consigne du relecteur en version 2, la nature de chaque écart, la boucle de correction ====
  check("vert — la consigne version 2 : la stricte v1 mot pour mot en tête, puis les 3 ajouts (contenu visible, règles applicables, nature)", () => {
    if (!CONSIGNE_V2.startsWith(STRICTE)) throw new Error("la consigne v2 ne commence pas par la stricte v1 mot pour mot");
    for (const [ajout, quoi] of [[AJOUT_CONTENU_VISIBLE, "contenu visible"], [AJOUT_REGLES, "règles applicables"], [AJOUT_NATURE, "nature des écarts"]])
      if (!CONSIGNE_V2.includes(ajout) || !fin.sortie.includes(ajout)) throw new Error(`l'ajout « ${quoi} » manque à la consigne v2 ou à la sortie de --preparer`);
    if (!/écart majeur/.test(AJOUT_CONTENU_VISIBLE) || !/sans demande/.test(AJOUT_CONTENU_VISIBLE)) throw new Error("un contenu visible ajouté sans demande n'est pas dit écart majeur");
    if (!/hors_demande/.test(AJOUT_NATURE) || !/choix_humain/.test(AJOUT_NATURE)) throw new Error("les deux natures ne sont pas dites");
  });
  check("rouge — la v1 seule ne porte pas la règle du contenu visible (le test voit la différence) ; la forme JSON v2 porte la nature, la v1 non", () => {
    if (/contenu visible/.test(STRICTE)) throw new Error("la stricte v1 a changé : elle doit rester celle de la mesure");
    if (!/"nature": "hors_demande" \| "choix_humain"/.test(FORME_JSON) || /nature/.test(FORME_JSON_V1)) throw new Error("FORME_JSON / FORME_JSON_V1");
  });
  check("vert — lireVerdict v2 : la nature de chaque écart est lue et comptée ; une nature absente est « non_precisee » (verdict de la v1), jamais devinée", () => {
    const v = lireVerdict(JSON.stringify({ verdict: "derive", gravite: "majeure", ecarts: [{ la_demande_dit: "a", pourquoi: "b", nature: "hors_demande" }, { la_demande_dit: "c", nature: "Choix_Humain" }, { la_demande_dit: "d" }] }));
    egal(v.ok, true, "ok"); egal(JSON.stringify(v.verdict.natures), JSON.stringify({ hors_demande: 1, choix_humain: 1, non_precisee: 1 }), "natures");
    egal(v.verdict.detail_ecarts[2].nature, "non_precisee", "nature absente"); egal(v.verdict.ecarts, 3, "nombre d'écarts");
  });
  check("rouge — une nature hors vocabulaire est refusée : lireVerdict ok=false, --consigner rend 2 et le registre ne bouge pas", () => {
    const mauvais = { verdict: "derive", gravite: "majeure", ecarts: [{ la_demande_dit: "a", nature: "peut-être" }] };
    egal(lireVerdict(JSON.stringify(mauvais)).ok, false, "lireVerdict");
    const reg = join(T, "registre-nature.jsonl");
    const r = executer(["--consigner", verdict(mauvais), "--point", "fin-de-tour", "--type", "page", "--registre", reg], {}, new Date(), CTX);
    egal(r.code, 2, "exit"); if (!/nature « peut-être »/.test(r.sortie)) throw new Error(r.sortie);
    egal(existsSync(reg), false, "registre créé par un refus");
  });
  check("vert — --consigner accepte tous les types du mandat (dont presentation et exigences)", () => {
    for (const t of ["etude", "restitution", "code", "page", "lot", "consigne", "presentation", "exigences", "autre"]) if (!TYPES.includes(t)) throw new Error(`type « ${t} » refusé`);
  });

  const REGB = join(T, "boucle.jsonl");
  const ecart = (nature, n = 1) => ({ la_demande_dit: `la demande dit ${n}`, le_livrable_fait: `le livrable fait ${n}`, pourquoi: `pourquoi ${n}`, ...(nature ? { nature } : {}) });
  const V = (v, gravite, ecarts) => ({ verdict: v, gravite, ecarts, confiance: "elevee" });
  const consB = (reg, v, extra = [], type = "page", point = "fin-de-tour") => executer(["--consigner", verdict(v), "--point", point, "--type", type, "--registre", reg, "--session", "sess-b", ...extra], {}, new Date("2026-10-19T12:00:00Z"), CTX);
  const lireB = (reg) => (existsSync(reg) ? readFileSync(reg, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
  const idDernier = (reg) => lireB(reg).filter((l) => l.ev === "relecture").pop().id;
  const boucle = (reg, id) => executer(["--boucle", id, "--registre", reg, "--json"], {}, new Date(), CTX);
  const refus = (reg, quoi, fn, motif) => { const avant = existsSync(reg) ? readFileSync(reg, "utf8") : ""; const r = fn(); egal(r.code, 2, quoi); if (motif && !motif.test(r.sortie)) throw new Error(`${quoi} : ${r.sortie}`); egal(existsSync(reg) ? readFileSync(reg, "utf8") : "", avant, `${quoi} : registre modifié par un refus`); };

  let idA, idB, idC;
  check("vert — la boucle, de bout en bout : alerte (passe 1 permise, le choix humain posé tout de suite) → passe 1 relue → passe 2 relue « sert » : chaîne levée en 3 relectures", () => {
    const A = consB(REGB, V("derive", "majeure", [ecart("hors_demande", 1), ecart("choix_humain", 2)]));
    egal(A.code, 0, "A"); idA = idDernier(REGB);
    if (!/passe de correction 1 permise/.test(A.sortie) || !/1 écart\(s\) à poser à l'humain tout de suite/.test(A.sortie)) throw new Error(A.sortie);
    const eA = boucle(REGB, idA).boucle;
    egal(eA.etat, "a_corriger", "état de A"); egal(eA.prochaine_passe, 1, "prochaine passe"); egal(eA.prochaine_passe_permise, true, "permise");
    egal(eA.a_poser_a_l_humain.length, 1, "écarts posés"); egal(eA.a_poser_a_l_humain[0].motif, "choix_humain", "motif");
    const B = consB(REGB, V("derive", "majeure", [ecart("hors_demande", 3)]), ["--passe", "1", "--suite-de", idA]);
    egal(B.code, 0, "B"); idB = idDernier(REGB);
    if (!/passe 1, suite de/.test(B.sortie) || !/passe de correction 2 permise/.test(B.sortie)) throw new Error(B.sortie);
    const eB = boucle(REGB, idB).boucle;
    egal(eB.passes_faites, 1, "passes faites"); egal(eB.prochaine_passe, 2, "passe 2"); egal(eB.chaine, idA, "racine de la chaîne");
    const C = consB(REGB, V("sert", "aucune", []), ["--passe", "2", "--suite-de", idB]);
    egal(C.code, 0, "C"); idC = idDernier(REGB);
    const eC = boucle(REGB, idA).boucle;   // l'état se lit depuis n'importe quel maillon
    egal(eC.etat, "levee", "état final"); egal(eC.relectures_faites, 3, "3 relectures"); egal(eC.passes_faites, 2, "2 passes"); egal(eC.prochaine_passe_permise, false, "plus de passe");
    egal(eC.derniere.id, idC, "dernière relecture"); egal(eC.relectures.map((x) => x.passe).join(","), "0,1,2", "numéros de passe");
    egal(eC.a_poser_a_l_humain.length, 1, "le choix humain de A reste posé");
    const l = lireB(REGB).filter((x) => x.ev === "relecture");
    egal(l[1].suite_de, idA, "suite_de"); egal(l[1].passe, 1, "passe consignée"); egal(l[2].chaine, idA, "chaîne consignée");
    if (!/état : levee/.test(executer(["--boucle", idC, "--registre", REGB], {}, new Date(), CTX).sortie)) throw new Error("la sortie lisible de --boucle ne dit pas l'état");
  });
  check("rouge — au plus 2 passes : --passe 3 est refusé, et une passe 2 qui ne suit pas la passe 1 aussi", () => {
    refus(REGB, "passe 3", () => consB(REGB, V("sert", "aucune", []), ["--passe", "3", "--suite-de", idC]), /au plus 2 passes de correction/);
    refus(REGB, "passe 2 sur une passe 0", () => consB(REGB, V("sert", "aucune", []), ["--passe", "2", "--suite-de", idA]), /celle qui la suit est de passe 1/);
    egal(MAX_PASSES, 2, "MAX_PASSES");
  });
  check("rouge — --passe et --suite-de vont ensemble ; un identifiant inconnu, une relecture déjà suivie, un autre type : refusés, registre intact", () => {
    refus(REGB, "--passe 1 sans --suite-de", () => consB(REGB, V("sert", "aucune", []), ["--passe", "1"]), /exige --suite-de/);
    refus(REGB, "--suite-de sans --passe", () => consB(REGB, V("sert", "aucune", []), ["--suite-de", idA]), /exige --passe/);
    refus(REGB, "--passe non entière", () => consB(REGB, V("sert", "aucune", []), ["--passe", "deux", "--suite-de", idA]), /attend un entier/);
    refus(REGB, "identifiant inconnu", () => consB(REGB, V("sert", "aucune", []), ["--passe", "1", "--suite-de", "RI-20200101-01"]), /aucune relecture d'identifiant/);
    refus(REGB, "relecture déjà suivie", () => consB(REGB, V("sert", "aucune", []), ["--passe", "1", "--suite-de", idA]), /déjà suivie/);
    consB(REGB, V("derive", "majeure", [ecart("hors_demande", 4)]));
    const idH = idDernier(REGB);
    refus(REGB, "autre type de travail", () => consB(REGB, V("sert", "aucune", []), ["--passe", "1", "--suite-de", idH], "code"), /une chaîne est UN travail/);
    refus(REGB, "autre point", () => consB(REGB, V("sert", "aucune", []), ["--passe", "1", "--suite-de", idH], "page", "consigne"), /une chaîne est UN travail/);
    consB(REGB, V("sert", "aucune", []), [], "etude");
    refus(REGB, "suite d'une relecture sans alerte", () => consB(REGB, V("sert", "aucune", []), ["--passe", "1", "--suite-de", idDernier(REGB)], "etude"), /n'est pas une alerte/);
  });
  check("vert — l'écart qui résiste à 2 passes est posé à l'humain, y compris celui de nature hors_demande ; aucune 3e passe", () => {
    const reg = join(T, "boucle-epuisee.jsonl");
    consB(reg, V("derive", "bloquante", [ecart("hors_demande", 1)]));
    const x1 = idDernier(reg);
    consB(reg, V("derive", "majeure", [ecart("hors_demande", 2)]), ["--passe", "1", "--suite-de", x1]);
    const x2 = idDernier(reg);
    const X3 = consB(reg, V("derive", "majeure", [ecart("hors_demande", 3)]), ["--passe", "2", "--suite-de", x2]);
    const x3 = idDernier(reg);
    if (!/ALERTE : à poser à l'humain/.test(X3.sortie) || !/2 passes de correction faites et l'alerte demeure/.test(X3.sortie)) throw new Error(X3.sortie);
    const e = boucle(reg, x1).boucle;
    egal(e.etat, "a_poser", "état"); egal(e.prochaine_passe_permise, false, "passe permise"); egal(e.prochaine_passe, null, "prochaine passe");
    egal(e.a_poser_a_l_humain.length, 1, "écarts posés"); egal(e.a_poser_a_l_humain[0].motif, "passes_epuisees", "motif");
    refus(reg, "3e passe", () => consB(reg, V("sert", "aucune", []), ["--passe", "3", "--suite-de", x3]), /au plus 2 passes/);
    refus(reg, "passe 2 après la passe 2", () => consB(reg, V("sert", "aucune", []), ["--passe", "2", "--suite-de", x3]), /celle qui la suit est de passe 3|pas de passe permise/);
  });
  check("rouge — un écart de choix humain ne se corrige jamais : une alerte qui n'a que des choix_humain n'ouvre aucune passe ; une nature non précisée est traitée comme un choix de l'humain", () => {
    const reg = join(T, "boucle-humain.jsonl");
    const Q = consB(reg, V("derive", "majeure", [ecart("choix_humain", 1), ecart("choix_humain", 2)]));
    if (/passe de correction/.test(Q.sortie) || !/aucun écart hors_demande à corriger/.test(Q.sortie)) throw new Error(Q.sortie);
    const q = idDernier(reg);
    egal(boucle(reg, q).boucle.a_poser_a_l_humain.length, 2, "les deux choix posés");
    refus(reg, "suite d'un choix humain", () => consB(reg, V("sert", "aucune", []), ["--passe", "1", "--suite-de", q]), /aucun écart hors_demande à corriger/);
    const N = consB(reg, V("derive", "majeure", [ecart(null, 1)]));
    if (!/de nature non précisée \(traité\(s\) comme choix de l'humain\)/.test(N.sortie)) throw new Error(N.sortie);
    const n = idDernier(reg);
    const eN = boucle(reg, n).boucle;
    egal(eN.etat, "a_poser", "état"); egal(eN.a_poser_a_l_humain[0].motif, "nature_non_precisee", "motif");
    refus(reg, "suite d'une nature non précisée", () => consB(reg, V("sert", "aucune", []), ["--passe", "1", "--suite-de", n]), /aucun écart hors_demande à corriger/);
  });
  check("vert — une alerte consignée avant la version 2 (sans détail d'écarts) est posée à l'humain, jamais corrigée ; etatChaine rend null pour un identifiant inconnu", () => {
    const ancien = [{ ts: "2026-10-18T10:00:00Z", ev: "relecture", id: "RI-20261018-01", point: "fin-de-tour", type: "etude", verdict: "derive", gravite: "majeure", ecarts: 1, alerte: true }];
    const e = etatChaine(ancien, "RI-20261018-01");
    egal(e.etat, "a_poser", "état"); egal(e.prochaine_passe_permise, false, "passe"); egal(e.a_poser_a_l_humain.length, 1, "écart posé");
    egal(etatChaine(ancien, "RI-inconnu"), null, "identifiant inconnu");
    egal(boucle(join(T, "rien-du-tout.jsonl"), "RI-1").code, 2, "--boucle sur un identifiant inconnu");
  });
  check("vert — --releve : corrigées, chaînes, levées sans l'humain, écarts levés, écarts posés à l'humain, par type ; une alerte corrigée n'est pas « sans réponse »", () => {
    const reg = join(T, "releve-boucle.jsonl");
    consB(reg, V("derive", "majeure", [ecart("hors_demande", 1), ecart("choix_humain", 2)])); const a = idDernier(reg);
    consB(reg, V("sert", "aucune", []), ["--passe", "1", "--suite-de", a]);
    consB(reg, V("derive", "majeure", [ecart("hors_demande", 1)])); const x1 = idDernier(reg);
    consB(reg, V("derive", "majeure", [ecart("hors_demande", 2)]), ["--passe", "1", "--suite-de", x1]); const x2 = idDernier(reg);
    consB(reg, V("derive", "majeure", [ecart("hors_demande", 3)]), ["--passe", "2", "--suite-de", x2]); const x3 = idDernier(reg);
    consB(reg, V("sert", "aucune", []), [], "etude");
    const rel = () => executer(["--releve", "--json", "--registre", reg], {}, new Date(), CTX).releve;
    const page = rel().lignes.find((x) => x.type === "page"), etude = rel().lignes.find((x) => x.type === "etude");
    egal(JSON.stringify([page.relectures, page.derives, page.alertes, page.corrigees, page.sans_reponse, page.confirmees]), "[5,4,4,3,1,0]", "page : relectures, dérives, alertes, corrigées, sans réponse, confirmées");
    egal(JSON.stringify([page.chaines, page.levees, page.ecarts_leves, page.ecarts_poses]), "[2,1,2,2]", "page : chaînes, levées, écarts levés, écarts posés");
    egal(JSON.stringify([etude.chaines, etude.levees, etude.ecarts_poses]), "[1,0,0]", "étude");
    egal(rel().total.levees, 1, "total des chaînes levées");
    executer(["--confirmer", x3, "oui", "--registre", reg], {}, new Date(), CTX);
    const apres = rel().lignes.find((x) => x.type === "page");
    egal(JSON.stringify([apres.confirmees, apres.sans_reponse, apres.corrigees]), "[1,0,3]", "après --confirmer de l'écart posé");
    const texte = executer(["--releve", "--registre", reg], {}, new Date(), CTX).sortie;
    if (!/levées sans l'humain/.test(texte) || !/écarts posés à l'humain/.test(texte) || !/page\s+fin-de-tour\s+5\s+4\s+4/.test(texte)) throw new Error(texte);
    // les chaînes d'un relevé filtré par date sont celles dont la première relecture est dans la fenêtre
    egal(executer(["--releve", "--json", "--depuis", "2026-10-20", "--registre", reg], {}, new Date(), CTX).releve.total.chaines, 0, "relevé depuis une date postérieure");
    egal(releverRegistre(lireB(reg)).total.chaines, 3, "releverRegistre");
  });
  check("vert — la ligne de commande : --boucle sur un identifiant inconnu rend 2 ; --consigner --passe 3 rend 2", () => {
    egal(spawnSync(process.execPath, [join(ICI, "relecture-intention.mjs"), "--boucle", "RI-1", "--registre", join(T, "rien.jsonl")], { encoding: "utf8", cwd: PROJET }).status, 2, "exit --boucle");
    egal(spawnSync(process.execPath, [join(ICI, "relecture-intention.mjs"), "--consigner", verdict(V("sert", "aucune", [])), "--point", "consigne", "--type", "code", "--passe", "3", "--suite-de", "RI-1", "--registre", join(T, "rien2.jsonl")], { encoding: "utf8", cwd: PROJET }).status, 2, "exit --passe 3");
  });

  // ==== D-26 (a), premier ajout : les règles applicables au type de travail (loi n° 4 : une donnée volatile est une donnée) ====
  const REGLES_REEL = JSON.parse(readFileSync(join(RACINE, "references", "RELECTURE-INTENTION-REGLES.json"), "utf8"));
  const toutesLesRegles = Object.values(REGLES_REEL.types).flat();
  const regle = (id) => toutesLesRegles.find((r) => r.id === id);
  check("vert — le référentiel des règles est valide, daté, et couvre « tous » et chacun des 9 types du mandat", () => {
    const p = problemesReferentiel(REGLES_REEL);
    if (p.length) throw new Error(p.slice(0, 3).join(" ; "));
    for (const t of ["tous", ...TYPES]) if (!(REGLES_REEL.types[t] || []).length) throw new Error(`aucune règle pour le type « ${t} »`);
    if (!/consigne_relecteur/.test(JSON.stringify(Object.keys(REGLES_REEL))) || !/D-26 \(a\)/.test(REGLES_REEL.consigne_relecteur.v2) || !/2026-10-18/.test(REGLES_REEL.consigne_relecteur.v2)) throw new Error("la date et la décision de la consigne v2 ne sont pas dites");
    if (!/mot pour mot/.test(REGLES_REEL.consigne_relecteur.v1)) throw new Error("la v1 n'est pas gardée");
  });
  check("vert — les 3 dérives mesurées le 18/10 y sont : le composant de filtres du socle (page, TF-0765), la cascade du produit (étude et exigences, TF-1678), le contenu visible ajouté sans demande (tous, TF-1391)", () => {
    for (const [id, motRegle, motFait] of [["P1", /table-filters/, /TF-0765/], ["E2", /cascade de ce produit/, /TF-1678/], ["X1", /cascade/, /TF-1678/], ["T1", /contenu visible/, /TF-1391/]]) {
      const r = regle(id); if (!r) throw new Error(`règle ${id} absente`);
      if (!motRegle.test(r.regle) || !motFait.test(r.fait)) throw new Error(`règle ${id} : ${r.regle.slice(0, 80)} / ${r.fait.slice(0, 80)}`);
    }
    if (!REGLES_REEL.types.page.some((r) => r.id === "P1") || !REGLES_REEL.types.etude.some((r) => r.id === "E2") || !REGLES_REEL.types.exigences.some((r) => r.id === "X1") || !REGLES_REEL.types.tous.some((r) => r.id === "T1")) throw new Error("une règle n'est pas rangée sous le bon type");
  });
  const sourcesReel = verifierSources(REGLES_REEL, RACINE);
  check(`vert — chaque source se rejoue sur le disque : fichier présent, ancre retrouvée (${sourcesReel.avertissements.length} ligne(s) décalée(s) ou source de forge sœur non rejouée${sourcesReel.avertissements.length ? " : " + sourcesReel.avertissements.slice(0, 2).join(" ; ") : ""})`, () => {
    if (sourcesReel.erreurs.length) throw new Error(sourcesReel.erreurs.slice(0, 3).join(" ; "));
  });
  check("rouge — un référentiel dont une règle n'a ni source ni fait, un identifiant en double, un type manquant ou une règle trop longue est refusé", () => {
    const copie = () => JSON.parse(JSON.stringify(REGLES_REEL));
    const sansSource = copie(); delete sansSource.types.page[0].source;
    if (!problemesReferentiel(sansSource).some((x) => /source incomplète/.test(x))) throw new Error("source absente acceptée");
    const sansFait = copie(); sansFait.types.page[0].fait = "";
    if (!problemesReferentiel(sansFait).some((x) => /le fait/.test(x))) throw new Error("fait absent accepté");
    const doublon = copie(); doublon.types.lot[0].id = doublon.types.page[0].id;
    if (!problemesReferentiel(doublon).some((x) => /déjà pris/.test(x))) throw new Error("doublon accepté");
    const sansType = copie(); delete sansType.types.presentation;
    if (!problemesReferentiel(sansType).some((x) => /presentation/.test(x))) throw new Error("type manquant accepté");
    const longue = copie(); longue.types.page[0].regle = "x".repeat(700);
    if (!problemesReferentiel(longue).some((x) => /borne 600/.test(x))) throw new Error("règle de 700 caractères acceptée");
    const sansLigne = copie(); sansLigne.types.page[0].source.ligne = 0;
    if (!problemesReferentiel(sansLigne).some((x) => /source incomplète/.test(x))) throw new Error("ligne 0 acceptée");
    if (problemesReferentiel(null).length === 0) throw new Error("null accepté");
  });
  check("rouge — verifierSources : une ancre disparue ou un fichier absent est une ERREUR ; une ligne décalée dont l'ancre est retrouvée n'est qu'un AVERTISSEMENT ; une forge sœur absente est dite", () => {
    const rac = join(T, "doctrine"); mkdirSync(rac, { recursive: true });
    writeFileSync(join(rac, "d.md"), "ligne un\nla règle qui compte\nligne trois\n");
    const ref = (source) => ({ types: { page: [{ id: "P9", regle: "x".repeat(30), source, fait: "y".repeat(30) }] } });
    const ok = verifierSources(ref({ fichier: "d.md", ligne: 2, ancre: "la règle qui compte" }), rac);
    egal(ok.erreurs.length + ok.avertissements.length, 0, "source juste");
    const decalee = verifierSources(ref({ fichier: "d.md", ligne: 1, ancre: "la règle qui compte" }), rac);
    egal(decalee.erreurs.length, 0, "ligne décalée : erreurs"); egal(decalee.avertissements.length, 1, "ligne décalée : avertissements");
    egal(verifierSources(ref({ fichier: "d.md", ligne: 2, ancre: "une règle qui a disparu" }), rac).erreurs.length, 1, "ancre disparue");
    egal(verifierSources(ref({ fichier: "absent.md", ligne: 1, ancre: "x" }), rac).erreurs.length, 1, "fichier absent");
    const soeur = verifierSources(ref({ fichier: "../forge-absente/SKILL.md", ligne: 1, ancre: "x" }), rac);
    egal(soeur.erreurs.length, 0, "forge sœur : erreurs"); egal(soeur.avertissements.length, 1, "forge sœur : avertissements");
  });
  const preparerType = (type, nom, extra = []) => {
    const d = join(T, `sortie-${nom}`);
    const r = executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d, ...(type ? ["--type", type] : []), ...extra], {}, new Date("2026-10-18T12:00:00Z"), CTX);
    return { r, demande: existsSync(join(d, "demande.txt")) ? readFileSync(join(d, "demande.txt"), "utf8") : "" };
  };
  const TITRE_REGLES = "## Règles de la Factory applicables à ce type de travail";
  check("vert — --preparer --type page : les règles de « tous » et de « page » sont dans demande.txt, sous un titre qui les distingue de la demande humaine, APRÈS les messages humains", () => {
    const { r, demande: d } = preparerType("page", "page");
    egal(r.code, 0, "exit");
    const iTitre = d.indexOf(TITRE_REGLES);
    if (iTitre < 0 || !/ce n'est PAS la demande humaine/.test(d)) throw new Error("titre distinctif absent : " + d.slice(-300));
    if (d.indexOf(`3. « ${H3} »`) > iTitre || d.indexOf("Décisions auxquelles répondent") > iTitre) throw new Error("les règles précèdent la demande");
    const apres = d.slice(iTitre);
    for (const id of ["T1", "P1", "P4"]) if (!apres.includes(`[${id}]`)) throw new Error(`règle ${id} absente`);
    if (!apres.includes(regle("P1").regle) || !apres.includes(`${regle("P1").source.fichier}:${regle("P1").source.ligne}`) || !apres.includes("TF-0765")) throw new Error("règle, source ou fait de P1 absents");
    if (d.slice(0, iTitre).includes("table-filters")) throw new Error("une règle est citée dans la partie « demande humaine »");
    if (!/La DEMANDE se termine par un titre « Règles de la Factory applicables/.test(r.sortie) || !/règle\(s\) applicable\(s\) au type page/.test(r.sortie)) throw new Error(r.sortie.slice(0, 600));
  });
  check("rouge — les règles d'un autre type n'y sont pas ; sans --type, aucune règle n'est ajoutée et la consigne le dit", () => {
    const e = preparerType("etude", "etude").demande;
    if (!e.includes("[E2]") || !e.includes("[T1]") || e.includes("[P1]") || e.includes("[X1]")) throw new Error("les règles ne suivent pas le type : " + e.slice(e.indexOf(TITRE_REGLES), e.indexOf(TITRE_REGLES) + 200));
    const s = preparerType(null, "sans-type");
    if (s.demande.includes(TITRE_REGLES) || s.demande.includes("[T1]")) throw new Error("des règles sans --type");
    if (!/aucune règle applicable ajoutée \(pas de --type\)/.test(s.r.sortie) || !/Aucune règle applicable n'est fournie/.test(s.r.sortie)) throw new Error(s.r.sortie.slice(0, 500));
  });
  check("vert — --type accepte plusieurs types séparés par une virgule ; une règle de « tous » n'y figure qu'une fois", () => {
    const d = preparerType("page,consigne", "deux").demande;
    for (const id of ["P1", "K1", "T1"]) if (!d.includes(`[${id}]`)) throw new Error(`règle ${id} absente`);
    egal(d.split("[T1]").length - 1, 1, "occurrences de T1");
    egal(reglesDesTypes(REGLES_REEL, ["page", "consigne"]).length, REGLES_REEL.types.tous.length + REGLES_REEL.types.page.length + REGLES_REEL.types.consigne.length, "règles réunies");
  });
  check("rouge — --type inconnu, référentiel absent ou invalide : 2, et rien n'est écrit", () => {
    const d = join(T, "sortie-refus-type");
    egal(executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d, "--type", "poème"], {}, new Date(), CTX).code, 2, "type inconnu");
    egal(executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d, "--type", "page,poème"], {}, new Date(), CTX).code, 2, "un type inconnu parmi deux");
    const absent = executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d, "--type", "page", "--regles", join(T, "regles-absentes.json")], {}, new Date(), CTX);
    egal(absent.code, 2, "référentiel absent"); if (!/référentiel des règles illisible/.test(absent.sortie)) throw new Error(absent.sortie);
    const mauvais = join(T, "regles-invalides.json"); writeFileSync(mauvais, JSON.stringify({ schema: "pilot/relecture-intention-regles@1", version: "1.0.0", date: "2026-10-18", types: { tous: [] } }));
    const inval = executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d, "--type", "page", "--regles", mauvais], {}, new Date(), CTX);
    egal(inval.code, 2, "référentiel invalide"); if (!/référentiel des règles invalide/.test(inval.sortie)) throw new Error(inval.sortie);
    egal(existsSync(d), false, "dossier de sortie créé par un refus");
  });

  // ==== D-26 (a), troisième ajout : le travail des sous-agents entre dans ce qui est relu ====
  const T0 = "2026-10-18T10:00:00Z";
  const date = (hhmm) => new Date(`2026-10-18T${hhmm}:00Z`);
  const mkRepo = (nom) => {
    const d = join(T, nom); mkdirSync(d, { recursive: true });
    const g = (args, quand) => spawnSync("git", ["-c", "core.longpaths=true", ...args], { cwd: d, encoding: "utf8", env: { ...process.env, ...(quand ? { GIT_AUTHOR_DATE: quand, GIT_COMMITTER_DATE: quand } : {}) } });
    g(["init", "-q"]); g(["config", "user.email", "t@t.t"]); g(["config", "user.name", "t"]); g(["config", "core.autocrlf", "false"]); g(["config", "commit.gpgsign", "false"]);
    return { d, g };
  };
  const ecrireA = (f, contenu, quand) => { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, contenu); utimesSync(f, quand, quand); };
  const { d: REPO, g: gitR } = mkRepo("depot-tour");
  for (const [f, c] of [["a.txt", "a1\n"], ["b.txt", "b1\n"], ["c.txt", "c1\n"], ["d.txt", "d1\n"], [".env", "SECRET=ancien\n"], ["derive.md.oracles.json", "{}\n"]]) ecrireA(join(REPO, f), c, date("08:00"));
  gitR(["add", "-A"]); gitR(["commit", "-q", "-m", "base"], "2026-10-18T09:00:00Z");
  ecrireA(join(REPO, "a.txt"), "a1\na2-MODIFIE-APRES-LE-MESSAGE\n", date("10:30"));
  ecrireA(join(REPO, "b.txt"), "b1\nb2-MODIFIE-AVANT-LE-MESSAGE\n", date("09:30"));
  ecrireA(join(REPO, "c.txt"), "c1\nc2-COMMITE-APRES-LE-MESSAGE\n", date("10:15"));
  gitR(["add", "c.txt"]); gitR(["commit", "-q", "-m", "c"], "2026-10-18T10:15:00Z");
  ecrireA(join(REPO, "d.txt"), "d1\nd2-MODIFIE-NON-COMMITE\n", date("10:35"));
  ecrireA(join(REPO, "n.txt"), "NEUF-CONTENU-DU-FICHIER-NEUF\n", date("10:40"));
  ecrireA(join(REPO, ".env"), "SECRET=valeur-a-ne-jamais-citer\n", date("10:20"));
  ecrireA(join(REPO, "derive.md.oracles.json"), "{\"x\":1}\n", date("10:20"));
  ecrireA(join(REPO, ".oracles", "output", "x.json"), "{}\n", date("10:20"));
  const SESSION2 = join(T, "transcripts2"); mkdirSync(SESSION2, { recursive: true });
  const TR2 = join(SESSION2, "session2.jsonl");
  const HORS = join(T, "hors-depot"); mkdirSync(HORS, { recursive: true });
  const S0 = join(HORS, "s0.md"), S1 = join(HORS, "s1.md");
  writeFileSync(S0, "CONTENU-S0-ECRIT-AVANT-LE-MESSAGE\n"); writeFileSync(S1, "CONTENU-SOUS-AGENT-S1\n");
  writeFileSync(TR2, [humain("Mets en place X.", { timestamp: T0 }), assistant([outil("Write", { file_path: join(REPO, "a.txt"), content: "x" })]), assistant([texte("Fini.")])].join("\n") + "\n");
  const SA = join(SESSION2, "session2", "subagents"); mkdirSync(SA, { recursive: true });
  const rec = (ts, blocs) => JSON.stringify({ type: "assistant", isSidechain: true, timestamp: ts, message: { role: "assistant", content: blocs } });
  writeFileSync(join(SA, "agent-aaa.jsonl"), [rec("2026-10-18T09:30:00Z", [outil("Write", { file_path: S0, content: "x" })]), rec("2026-10-18T10:20:00Z", [outil("Write", { file_path: S1, content: "x" })]),
    rec("2026-10-18T10:25:00Z", [outil("Edit", { file_path: join(REPO, "n.txt"), old_string: "a", new_string: "b" })]), rec("2026-10-18T10:26:00Z", [outil("Bash", { command: "git status" })])].join("\n") + "\n");
  writeFileSync(join(SA, "agent-aaa.meta.json"), JSON.stringify({ agentType: "campagne", description: "Mettre en place la boucle" }));
  const finDepot = executer(["--preparer", "fin-de-tour", "--transcript", TR2, "--sortie", join(T, "sortie-depot")], {}, new Date(), { cwd: REPO, maison: MAISON });
  const livDepot = existsSync(join(T, "sortie-depot", "livrables.md")) ? readFileSync(join(T, "sortie-depot", "livrables.md"), "utf8") : "";
  const sectionDepot = livDepot.slice(livDepot.indexOf("## Fichiers du dépôt modifiés"), livDepot.indexOf("## Écritures faites par les sous-agents"));
  check("vert — fin-de-tour cite les fichiers du dépôt modifiés depuis le dernier message humain : diff d'un fichier suivi, contenu d'un fichier neuf, fichier commité depuis le message", () => {
    egal(finDepot.code, 0, "exit");
    if (!livDepot.includes("a2-MODIFIE-APRES-LE-MESSAGE")) throw new Error("a.txt, écrit par Write, n'est cité nulle part");
    if (!/### d\.txt — modifié/.test(sectionDepot) || !sectionDepot.includes("+d2-MODIFIE-NON-COMMITE") || !/^-d1$|^ d1$/m.test(sectionDepot.slice(sectionDepot.indexOf("### d.txt")))) throw new Error("le diff du fichier suivi modifié n'est pas cité : " + sectionDepot.slice(sectionDepot.indexOf("### d.txt"), sectionDepot.indexOf("### d.txt") + 400));
    if (!/### c\.txt — modifié/.test(sectionDepot) || !sectionDepot.includes("+c2-COMMITE-APRES-LE-MESSAGE")) throw new Error("le fichier commité depuis le message n'est pas cité en diff : " + sectionDepot.slice(0, 800));
    if (!/### n\.txt — neuf \(non suivi\)/.test(sectionDepot) || !sectionDepot.includes("NEUF-CONTENU-DU-FICHIER-NEUF")) throw new Error("le fichier neuf n'est pas cité avec son contenu");
    if (!/dont 1 déjà cité\(s\) plus haut \(Write, Edit, NotebookEdit\)/.test(sectionDepot)) throw new Error("a.txt, déjà cité par Write, doit être dit déjà cité : " + sectionDepot.slice(0, 600));
    if (sectionDepot.includes("### a.txt")) throw new Error("a.txt est cité deux fois");
    if (!/dépôt : \d+ fichier\(s\) modifié\(s\)/.test(finDepot.sortie)) throw new Error(finDepot.sortie.slice(0, 400));
  });
  check("rouge — un fichier modifié sur le disque AVANT le message n'est pas cité (mais compté et dit) ; les dérivés des contrôles non plus (comptés) ; un .env : son chemin, jamais sa valeur", () => {
    if (livDepot.includes("b2-MODIFIE-AVANT-LE-MESSAGE") || /### b\.txt/.test(sectionDepot)) throw new Error("b.txt, modifié avant le message, est cité");
    if (!/1 fichier\(s\) changé\(s\) par rapport à ce commit mais modifié\(s\) sur le disque avant le message, non cité\(s\)/.test(sectionDepot)) throw new Error("l'antériorité n'est pas dite : " + sectionDepot.slice(0, 600));
    if (livDepot.includes("derive.md.oracles.json") && /###[^\n]*oracles/.test(sectionDepot)) throw new Error("un dérivé de contrôle est cité");
    if (!/2 dérivé\(s\) des contrôles non cité\(s\)/.test(sectionDepot)) throw new Error("les dérivés ne sont pas comptés : " + sectionDepot.slice(0, 600));
    if (livDepot.includes("valeur-a-ne-jamais-citer") || livDepot.includes("SECRET=ancien")) throw new Error("la valeur d'un .env transite");
    if (!/### \.env — modifié[\s\S]*?NON cité : un fichier `\.env` ne transite jamais/.test(sectionDepot)) throw new Error("le .env n'est pas cité par son chemin avec l'omission dite");
  });
  check("vert — les écritures des sous-agents depuis le message sont citées (agent, outil, chemin, contenu) ; celle d'avant le message non ; un fichier déjà cité plus haut est dit tel ; les commandes sont comptées", () => {
    const sa = livDepot.slice(livDepot.indexOf("## Écritures faites par les sous-agents"));
    if (!sa.includes(S1) || !sa.includes("CONTENU-SOUS-AGENT-S1") || !sa.includes("Mettre en place la boucle") || !/Write ×1/.test(sa)) throw new Error("l'écriture du sous-agent n'est pas citée : " + sa.slice(0, 700));
    if (sa.includes("CONTENU-S0-ECRIT-AVANT-LE-MESSAGE") || sa.includes(S0)) throw new Error("une écriture antérieure au message est citée");
    if (!new RegExp(`${join(REPO, "n.txt").replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")} — Edit ×1.*contenu cité plus haut`).test(sa)) throw new Error("le fichier du dépôt écrit par le sous-agent doit être dit « cité plus haut » : " + sa.slice(0, 700));
    if (!/2 écriture\(s\) sur 2 fichier\(s\) par 1 sous-agent\(s\) actif\(s\) ; 1 commande\(s\) lancée\(s\) par eux, non listées/.test(sa)) throw new Error("les décomptes manquent : " + sa.slice(0, 500));
    if (!/sous-agents : 2 écriture\(s\) de 1 sous-agent\(s\)/.test(finDepot.sortie)) throw new Error(finDepot.sortie.slice(0, 500));
  });
  check("rouge — sans dossier de sous-agents ou hors dépôt git, la section le DIT au lieu de se taire", () => {
    if (!/Aucun dossier de sous-agents pour cette session/.test(livrables)) throw new Error("absence de sous-agents non dite");
    if (!/\[dépôt non relevé : .* n'est pas un dépôt git/.test(livrables)) throw new Error("projet hors git non dit : " + livrables.slice(livrables.indexOf("## Fichiers du dépôt"), livrables.indexOf("## Fichiers du dépôt") + 300));
    const sansTs = join(T, "sans-ts.jsonl"); writeFileSync(sansTs, JSON.stringify({ type: "user", origin: { kind: "human" }, message: { role: "user", content: "pas d'horodatage" } }) + "\n");
    const d = join(T, "sortie-sans-ts"); executer(["--preparer", "fin-de-tour", "--transcript", sansTs, "--sortie", d], {}, new Date(), { cwd: REPO, maison: MAISON });
    if (!/horodatage lisible/.test(readFileSync(join(d, "livrables.md"), "utf8"))) throw new Error("l'absence d'horodatage n'est pas dite");
  });
  check("borne — plus de 40 fichiers du dépôt : les premiers sont cités, les autres par leur seul chemin, la BORNE est dite", () => {
    const { d: R2, g: g2 } = mkRepo("depot-borne");
    g2(["commit", "-q", "--allow-empty", "-m", "base"], "2026-10-18T09:00:00Z");
    for (let i = 0; i < 45; i++) ecrireA(join(R2, `f${String(i).padStart(2, "0")}.txt`), `contenu ${i}\n`, date("10:30"));
    const tr = join(T, "borne-depot.jsonl"); writeFileSync(tr, humain("Mets en place Y.", { timestamp: T0 }) + "\n");
    const d = join(T, "sortie-borne-depot"); executer(["--preparer", "fin-de-tour", "--transcript", tr, "--sortie", d], {}, new Date(), { cwd: R2, maison: MAISON });
    const l = readFileSync(join(d, "livrables.md"), "utf8");
    if (!/\[BORNE : 5 fichier\(s\) du dépôt cité\(s\) par leur seul chemin, contenu omis \(borne 40 fichiers et 80000 caractères\)/.test(l)) throw new Error("borne non dite : " + (l.match(/\[BORNE[^\]]*/) || ["aucune"])[0].slice(0, 200));
    egal((l.match(/^### f\d\d\.txt/gm) || []).length, 40, "fichiers cités avec contenu");
    if (!/45 fichier\(s\) retenu\(s\)/.test(l)) throw new Error("total non dit");
  });

  // ==== D-26 (a), point 7 : la reconnaissance des réponses de décision dans --preparer ====
  const H_A = "24a + comment faire pour améliorer la relecture sur les travaux ? Et est-ce que les alertes sont prises en compte automatiquement par la flotte d'agents pour améliorer le résultat final ? Si non, comment peut-on mettre ça en place ?";
  const H_B = "25 relever le seuil à 4 millions. 26 : a";
  const H_C = "23a + b";
  check("vert — numerosDeDecision : les formes de réponse brève, longues ou en mots, désignent leurs décisions", () => {
    const cas = [[H_A, ["24"]], [H_B, ["25", "26"]], [H_C, ["23"]], ["24a, 25a, 26a, 27a, 28a", ["24", "25", "26", "27", "28"]], ["26a, 25a, 24b, 15b, 17a, 18a, 19a, 20a, 21b", ["26", "25", "24", "15", "17", "18", "19", "20", "21"]],
      ["51 détaille", ["51"]], ["D-51 détaille", ["51"]], ["je prends 23a", ["23"]], ["24 (a)", ["24"]], ["Réponse : 24a", ["24"]], ["25 : relever le seuil. 26 relever aussi. 27 non", ["25", "26", "27"]]];
    for (const [t, attendu] of cas) egal(numerosDeDecision(t).sort().join(","), [...attendu].sort().join(","), `« ${t.slice(0, 50)} »`);
    egal(H_A.length > 200, true, "H_A est bien plus long que l'ancienne borne de 200 caractères");
  });
  check("rouge — numerosDeDecision : un nombre au milieu d'une phrase, un décimal, une liste numérotée « 1. », un message trop long ne désignent aucune décision", () => {
    for (const t of ["Étudie l'opportunité 2 fois", "Relève le seuil à 4 millions de jetons", "Relève le seuil. 4 millions de jetons par jour", "version 2.1 du plan, 3 fichiers", "25 relever à 4,5 millions", "1. Fais A.\n2. Fais B.", "il y a 3 cas", "", "24a " + "x".repeat(2100)])
      egal(numerosDeDecision(t).join(","), t === "25 relever à 4,5 millions" ? "25" : "", `« ${t.slice(0, 50)} »`);
  });
  const DEC = (n, sujet) => `> **D-${n} — ${sujet} ?**\n>\n> - **De quoi s'agit-il** : le sujet ${n}.\n\n| Option | Ce qui se passe |\n|---|---|\n| (a) Oui | A${n} |\n| (b) Non | B${n} |`;
  const transcriptDec = join(T, "decisions.jsonl");
  writeFileSync(transcriptDec, [
    humain("Étudie le relecteur d'intention."),
    assistant([texte(DEC(23, "Faut-il lancer l'essai") + "\n\n" + DEC(4, "Une très ancienne décision"))]),
    humain(H_C),
    assistant([texte("Exécuté." + "\n\n" + DEC(24, "Faut-il publier l'essai"))]),
    humain(H_A),
    assistant([texte(DEC(25, "Faut-il suspendre les relectures") + "\n\n" + DEC(26, "Faut-il une boucle de correction"))]),
    humain(H_B),
    assistant([texte("Exécuté.")]),
  ].join("\n") + "\n");
  const dec = (() => { const d = join(T, "sortie-decisions"); executer(["--preparer", "consigne", "--fichier", PETIT, "--transcript", transcriptDec, "--sortie", d], {}, new Date(), CTX); return readFileSync(join(d, "demande.txt"), "utf8"); })();
  check("vert — « 24a + comment faire… », « 25 relever le seuil à 4 millions. 26 : a » et « 23a + b » retrouvent D-24, D-25, D-26 et D-23, chacune telle qu'elle a été posée, avant le bon message", () => {
    for (const [n, sujet, rang] of [[23, "Faut-il lancer l'essai", 2], [24, "Faut-il publier l'essai", 3], [25, "Faut-il suspendre les relectures", 4], [26, "Faut-il une boucle de correction", 4]])
      if (!new RegExp(`D-${n} \\(posée avant le message ${rang}\\)`).test(dec) || !dec.includes(`**D-${n} — ${sujet} ?**`) || !dec.includes(`| (a) Oui | A${n} |`)) throw new Error(`D-${n} non retrouvée telle que posée : ` + dec.slice(dec.indexOf("Décisions"), dec.indexOf("Décisions") + 400));
    egal((dec.match(/^D-\d+ \(posée avant le message/gm) || []).length, 4, "décisions retrouvées");
    if (!dec.includes(`2. « ${H_C} »`) || !dec.includes(`« ${H_A} »`) || !dec.includes(`« ${H_B} »`)) throw new Error("les messages humains ne sont plus cités mot pour mot");
  });
  check("rouge — « à 4 millions » ne désigne pas D-4 (posée plus haut) ; une décision jamais posée ne produit rien ; la D-25 voisine de la D-26 n'est pas mêlée à elle", () => {
    if (/D-4 \(posée/.test(dec) || dec.includes("Une très ancienne décision")) throw new Error("D-4 retrouvée à tort");
    const posee25 = dec.slice(dec.indexOf("D-25 (posée"), dec.indexOf("D-26 (posée"));
    if (posee25.includes("boucle de correction") || !posee25.includes("suspendre les relectures")) throw new Error("D-25 et D-26 mêlées : " + posee25.slice(0, 300));
    const tr = join(T, "decision-absente.jsonl"); writeFileSync(tr, [humain("Étudie X."), assistant([texte("Fait.")]), humain("24a")].join("\n") + "\n");
    const d = join(T, "sortie-decision-absente"); const r = executer(["--preparer", "consigne", "--fichier", PETIT, "--transcript", tr, "--sortie", d], {}, new Date(), CTX);
    egal(r.code, 0, "exit"); if (/Décisions auxquelles répondent/.test(readFileSync(join(d, "demande.txt"), "utf8"))) throw new Error("une décision inventée");
  });
  check("vert — la ligne de commande : --preparer imprime la consigne (exit 0) ; --releve sur un registre absent rend 0", () => {
    const p = spawnSync(process.execPath, [join(ICI, "relecture-intention.mjs"), "--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", join(T, "sortie-cli")], { encoding: "utf8", cwd: PROJET });
    egal(p.status, 0, "exit --preparer"); if (!/CONSIGNE À PASSER À L'AGENT verificateur/.test(p.stdout)) throw new Error(p.stdout.slice(0, 300));
    const q = spawnSync(process.execPath, [join(ICI, "relecture-intention.mjs"), "--releve", "--registre", join(T, "rien.jsonl")], { encoding: "utf8", cwd: PROJET });
    egal(q.status, 0, "exit --releve");
    const r = spawnSync(process.execPath, [join(ICI, "relecture-intention.mjs"), "--inconnue"], { encoding: "utf8", cwd: PROJET });
    egal(r.status, 2, "exit option inconnue");
  });
  // ---- D-40 (a), A-1, A-2 et A-3 du 19/10/2026 : réception, cohérence, consigne de campagne ----------------------------
  const REGR = join(T, "registre-reception.jsonl");
  const PLUS_TARD = new Date(Date.now() + 60000);
  const ETUDE_A = join(T, "etude-a.md"), ETUDE_B = join(T, "etude-b.md");
  writeFileSync(ETUDE_A, "# Étude A\nChapeau de l'étude A.\n\n## 1. Partition\nMILIEU-A-NE-PAS-CITER\n\n## 5. Verdict\n- Option retenue : O3 pour A.\n");
  writeFileSync(ETUDE_B, "# Étude B\nChapeau B.\n\n## 2. État de l'art\nMILIEU-B-NE-PAS-CITER\n\n## 5. Verdict\n- Option retenue : O0 pour B.\n\n## Annexe\nANNEXE-B\n");
  const PASS_FORME = () => ({ joue: true, verdict: "PASS", echecs: [], texte: "oracle-ecriture PASS" });
  check("rouge — réception (A-2) : un oracle de forme en FAIL ne prépare rien et rend 1 ; sans un --fichier unique, 2", () => {
    const d = join(T, "sortie-reception-fail");
    const r = executer(["--preparer", "reception", "--fichier", ETUDE_A, "--transcript", TRANSCRIPT, "--sortie", d], {}, new Date(), { ...CTX, jugerForme: () => ({ joue: true, verdict: "FAIL", echecs: ["EC-2 : tic"], texte: "oracle-ecriture FAIL, 1 règle(s) en échec" }) });
    egal(r.code, 1, "exit FAIL de forme"); if (existsSync(join(d, "demande.txt"))) throw new Error("une relecture préparée malgré le FAIL de forme");
    if (!/EC-2 : tic/.test(r.sortie)) throw new Error("la règle en échec n'est pas dite");
    egal(executer(["--preparer", "reception", "--transcript", TRANSCRIPT], {}, new Date(), CTX).code, 2, "sans fichier");
    egal(executer(["--preparer", "reception", "--fichier", ETUDE_A, "--fichier", ETUDE_B, "--transcript", TRANSCRIPT], {}, new Date(), CTX).code, 2, "deux fichiers");
  });
  check("vert — réception (D-40 (a)) : le livrable est cité EN ENTIER avec le verdict de forme ; l'oracle réel saute un non-.md", () => {
    const d = join(T, "sortie-reception");
    const r = executer(["--preparer", "reception", "--fichier", ETUDE_A, "--transcript", TRANSCRIPT, "--sortie", d, "--type", "etude"], {}, new Date(), { ...CTX, jugerForme: PASS_FORME });
    egal(r.code, 0, "exit"); const l = readFileSync(join(d, "livrables.md"), "utf8");
    if (!l.includes("MILIEU-A-NE-PAS-CITER") || !l.includes("oracle-ecriture PASS")) throw new Error("livrable incomplet : " + l.slice(0, 300));
    if (!/UN livrable qu'un agent vient de rendre/.test(r.consigne)) throw new Error("la consigne ne dit pas le point réception");
    egal(jugerForme(NOTE).verdict, "SKIP", "oracle de forme sur un .ipynb");
  });
  check("vert — consigner la réception nomme le livrable ; la fin de tour le cite par son seul chemin, puis le recite s'il change", () => {
    const v = join(T, "verdict-reception.json"); writeFileSync(v, JSON.stringify({ verdict: "sert", gravite: "aucune", ecarts: [], confiance: "elevee" }));
    egal(executer(["--consigner", v, "--point", "reception", "--type", "etude", "--registre", REGR], {}, PLUS_TARD, CTX).code, 2, "réception sans --fichier");
    const c = executer(["--consigner", v, "--point", "reception", "--type", "etude", "--fichier", PETIT, "--registre", REGR, "--session", "s"], {}, PLUS_TARD, CTX);
    egal(c.code, 0, "exit consigner"); if (!c.ligne.fichier || !/petit\.md$/.test(c.ligne.fichier)) throw new Error("fichier non consigné : " + JSON.stringify(c.ligne));
    if (relusALaReception(readFileSync(REGR, "utf8").trim().split("\n").map((x) => JSON.parse(x))).size !== 1) throw new Error("le livrable relu n'est pas reconnu");
    const d = join(T, "sortie-fin-relus");
    executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d, "--registre", REGR], {}, new Date(), CTX);
    const l = readFileSync(join(d, "livrables.md"), "utf8");
    if (!/relu à sa réception sous RI-\d{8}-01/.test(l) || l.includes("Le contenu du petit livrable")) throw new Error("le livrable relu est recité : " + l.slice(0, 500));
    const futur = new Date(Date.now() + 3600000); utimesSync(PETIT, futur, futur);
    const d2 = join(T, "sortie-fin-relus-change");
    executer(["--preparer", "fin-de-tour", "--transcript", TRANSCRIPT, "--sortie", d2, "--registre", REGR], {}, new Date(), CTX);
    if (!readFileSync(join(d2, "livrables.md"), "utf8").includes("Le contenu du petit livrable")) throw new Error("un livrable modifié après sa relecture n'est pas recité");
  });
  check("vert — cohérence (A-3) : chapeau et verdict de chaque livrable côte à côte, sans leur milieu ; moins de deux livrables, 2", () => {
    const d = join(T, "sortie-coherence");
    const r = executer(["--preparer", "coherence", "--fichier", ETUDE_A, "--fichier", ETUDE_B, "--transcript", TRANSCRIPT, "--sortie", d], {}, new Date(), CTX);
    egal(r.code, 0, "exit"); const l = readFileSync(join(d, "livrables.md"), "utf8");
    for (const x of ["Chapeau de l'étude A", "O3 pour A", "Chapeau B", "O0 pour B"]) if (!l.includes(x)) throw new Error(`« ${x} » absent`);
    for (const x of ["MILIEU-A-NE-PAS-CITER", "MILIEU-B-NE-PAS-CITER", "ANNEXE-B"]) if (l.includes(x)) throw new Error(`« ${x} » cité à tort`);
    if (!/ENSEMBLE/.test(r.consigne) || !/contredisent/.test(r.consigne)) throw new Error("la consigne de cohérence ne dit pas sa question");
    egal(executer(["--preparer", "coherence", "--fichier", ETUDE_A, "--transcript", TRANSCRIPT], {}, new Date(), CTX).code, 2, "un seul livrable");
    if (!/aucune section de verdict/.test(sectionsDeConclusion("# T\nchapeau\n\n## 1. Seul\ncorps"))) throw new Error("le repli sans section de verdict n'est pas dit");
  });
  check("vert — consigne de campagne (A-1) : le gabarit et la liste des sujets se relisent en une fois", () => {
    const g = join(T, "gabarit.md"), s = join(T, "sujets.md");
    writeFileSync(g, "Étudie l'opportunité <SUJET> au gabarit d'étude."); writeFileSync(s, "1. jeton d'abonnement\n2. vidéo de lancement");
    const d = join(T, "sortie-campagne");
    egal(executer(["--preparer", "consigne", "--fichier", g, "--fichier", s, "--transcript", TRANSCRIPT, "--sortie", d], {}, new Date(), CTX).code, 0, "exit");
    const l = readFileSync(join(d, "livrables.md"), "utf8");
    if (!/2 pièces lues ensemble/.test(l) || !l.includes("<SUJET>") || !l.includes("vidéo de lancement")) throw new Error(l.slice(0, 400));
  });
  check("borne — le registre du pilot n'a pas été touché par la recette", () => {
    const pilote = join(RACINE, "todo", "relectures-intention.jsonl");
    if (existsSync(pilote) && /RI-20261018-0[12]"/.test(readFileSync(pilote, "utf8")) && /"session":"sess-1"/.test(readFileSync(pilote, "utf8"))) throw new Error("la recette a écrit au registre du pilot");
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\nrelecture-intention : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
