#!/usr/bin/env node
/**
 * lib-decisions.test.mjs — recette des décisions posées sans réponse (S93, TF-2214) et de leurs sorties (TF-2415, 14/11/2026).
 *
 * Le fait : le 10/11/2026, D-12 (retirée au seq 58) et D-178 (retirée au seq 231) étaient rappelées au porteur comme ouvertes, 5 décisions sur 8
 * pendant 2 tours : la seule sortie que `decisionsSansReponse` connaissait était une `reponse_humain` qui nomme la décision.
 * Rouge (sur le code d'avant) : une entrée `decision_retiree` ne sort pas la décision qu'elle retire (champ `decision`, liste `decisions_retirees`).
 * Vert : une décision retirée n'est plus rappelée ; le rattachement « D-N remplacée par D-M » (`reponse_humain` de D-M avec `remplace: "D-N"`) sort D-N ;
 * une décision sans réponse reste rappelée ; une retraite ne sort QUE la décision qu'elle nomme ; une retraite antérieure à la décision ne la sort pas ;
 * une décision hors de la fenêtre de 14 jours n'est pas rappelée. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { decisionsSansReponse, decisionsRetirees, DECISION_RETIREE, decisionsPiloteSansReponse, consignerReponse, lettresDeReponse, reponsesDuRegistre, lireRegistrePilot } from "./lib-decisions.mjs";

const casse = [];
let n = 0;
const veut = (cond, quoi) => { n++; if (!cond) casse.push(quoi); };

const MAINTENANT = Date.parse("2026-11-10T12:00:00Z");
const T = mkdtempSync(join(tmpdir(), "lib-decisions-"));
let k = 0;
/** Un produit jetable dont le ledger porte les entrées données ; rend les numéros des décisions rappelées. */
const ouvertes = (entrees, fenetreJours) => {
  const dossier = join(T, `produit-${++k}`);
  mkdirSync(join(dossier, "forge"), { recursive: true });
  writeFileSync(join(dossier, "forge", "ledger.jsonl"), entrees.map((e, i) => JSON.stringify({ seq: i + 1, ts: `2026-11-09T0${i}:00:00Z`, ...e })).join("\n") + "\n", "utf8");
  return decisionsSansReponse(dossier, { maintenant: MAINTENANT, ...(fenetreJours ? { fenetreJours } : {}) }).map((d) => d.n).join(",");
};
const pose = (decisions) => ({ type: "question_humain", decisions_posees: decisions });

// ── A. Le cas fondateur : une décision retirée n'est plus rappelée ───────────────────────────────
veut(ouvertes([pose({ "D-12": "Faut-il garder le lot de la semaine passée ?" })]) === "D-12", "A1 vert : une décision posée sans aucune sortie reste rappelée (le rappel S93 de base)");
veut(ouvertes([pose({ "D-12": "Faut-il garder le lot de la semaine passée ?" }), { type: DECISION_RETIREE, decision: "D-12" }]) === "",
  "A2 rouge : une entrée decision_retiree qui nomme D-12 ne la sort pas — D-12 reste rappelée comme ouverte (le cas du 10/11)");
veut(ouvertes([pose({ "D-12": "Faut-il garder le lot de la semaine passée ?" }), { type: "decision_retiree", decisions_retirees: ["D-12"] }]) === "",
  "A3 rouge : la liste decisions_retirees ne sort pas la décision");
veut(ouvertes([pose({ "D-12": "Question de la décision douze ?", "D-13": "Question de la décision treize ?" }), { type: DECISION_RETIREE, decision: "D-12" }]) === "D-13",
  "A4 vert : une retraite ne sort que la décision qu'elle nomme — D-13 reste rappelée");
veut(ouvertes([{ type: DECISION_RETIREE, decision: "D-12" }, pose({ "D-12": "Faut-il garder le lot de la semaine passée ?" })]) === "D-12",
  "A5 vert : une retraite ANTÉRIEURE à la pose ne sort pas la décision posée ensuite");
veut(ouvertes([pose({ "D-12": "Faut-il garder le lot de la semaine passée ?" }), { type: "note", decision: "D-12" }]) === "D-12",
  "A6 vert : une entrée d'un autre type qui nomme D-12 n'est pas une retraite");
veut(ouvertes([pose({ "D-178": "Faut-il armer la garde de publication ?" }), { type: DECISION_RETIREE, decision: "D-12", cause: "voir D-178" }]) === "D-178",
  "A7 vert : une retraite qui CITE D-178 dans sa cause ne sort pas D-178 (seul le champ qui nomme la décision retirée compte)");

// ── B. Le rattachement « D-N remplacée par D-M » ─────────────────────────────────────────────────
veut(ouvertes([pose({ "D-16": "Quel indice pour le lot de retours ?" }), { type: "reponse_humain", decision: "D-18", remplace: "D-16" }]) === "",
  "B1 vert : une reponse_humain de D-18 qui remplace D-16 ne sort pas D-16 — le rattachement existait déjà par le champ remplace (réponse donnée sous un autre numéro)");
veut(ouvertes([pose({ "D-16": "Quel indice pour le lot de retours ?" }), { type: "reponse_humain", decision: "D-18" }]) === "D-16",
  "B2 vert : une réponse à D-18 sans rattachement ne sort pas D-16");
veut(ouvertes([pose({ "D-16": "Quel indice pour le lot de retours ?" }), { type: DECISION_RETIREE, decision: "D-16", remplacee_par: "D-18" }]) === "",
  "B3 rouge : une retraite « D-16 remplacée par D-18 » ne sort pas D-16");

// ── C. Les bornes qui restent ────────────────────────────────────────────────────────────────────
veut(ouvertes([pose({ "D-12": "Faut-il garder le lot de la semaine passée ?" })], 0.01) === "", "C1 vert : une décision hors de la fenêtre n'est pas rappelée");
veut(decisionsRetirees({ decision: "D-12", decisions: ["D-13", "d 14"], decisions_retirees: "D-15" }).join(",") === "D-12,D-13,D-14,D-15", "C2 : decisionsRetirees ne lit pas les trois champs, chaîne ou liste");
veut(decisionsRetirees({ decision: "la décision du 12 octobre" }).length === 0, "C3 vert : un texte qui n'est pas un numéro de décision est lu comme tel");

// ── D. Le registre du PILOT porte la réponse humaine (TF-2214, 16/11/2026) ──────────────────────
// Le cas fondateur : D-48 posée le 03/11, sans réponse ni rappel. Au pilot, `decisions\REGISTRE.jsonl` ne portait que des lignes `registre` et `decision` :
// rien ne disait qu'une décision attendait. `hook-lexique` consigne la lettre ; `decisionsPiloteSansReponse` rappelle ce qui n'a pas de réponse.
const MAINT_PILOT = Date.parse("2026-11-20T12:00:00Z");
const registre = (...decisions) => {
  const f = join(T, `registre-${++k}.jsonl`);
  writeFileSync(f, [{ type: "registre", version: 1 }, ...decisions.map(([n, ts, question]) => ({ type: "decision", n, question: question || `Question de la décision ${n} ?`, date: ts.slice(0, 10), ts, origine: "reservation" }))].map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
  return f;
};
const sansReponse = (f, options = {}) => decisionsPiloteSansReponse({ fichier: f, maintenant: MAINT_PILOT, ...options }).map((d) => d.n).join(",");
veut(lettresDeReponse("223a", 223).join() === "a" && lettresDeReponse("D-76 (c)", 76).join() === "c" && lettresDeReponse("68a + b", 68).join() === "a,b" && lettresDeReponse("219e, 220a", 220).join() === "a",
  "D1 vert : les lettres se lisent pour le seul numéro demandé (« 223a », « D-76 (c) », « 68a + b », « 219e, 220a »)");
veut(lettresDeReponse("oui, fais-le", 48).length === 0 && lettresDeReponse("il y a 3 jours", 3).length === 0 && lettresDeReponse("48a " + "x".repeat(300), 48).length === 0 && lettresDeReponse("A1 & A2", 1).length === 0,
  "D2 rouge : un message sans lettre, une date, un sélecteur d'action ou un long texte ne donne aucune lettre");
{
  const f = registre([47, "2026-11-10T09:00:00Z"], [48, "2026-11-18T09:00:00Z"], [49, "2026-11-19T09:00:00Z"], [51, "2026-11-02T09:00:00Z"], [51, "2026-11-19T10:00:00Z", "Question de la décision 51, reformulée ?"]);
  veut(sansReponse(f) === "D-48,D-49", `D3 rouge : D-48 et D-49, réservées sans réponse, doivent être rappelées ; D-47 (avant l'écrivain) et D-51 (réservée hors fenêtre, puis reformulée) non — lu « ${sansReponse(f)} »`);
  veut(sansReponse(f, { jusqua: Date.parse("2026-11-18T23:59:59Z") }) === "D-48", `D3 bis : une synthèse du 18/11 ne rappelle pas D-49, posée après elle ; lu « ${sansReponse(f, { jusqua: Date.parse("2026-11-18T23:59:59Z") })} »`);
  veut(sansReponse(f, { depuis: "2026-11-01T00:00:00Z" }) === "D-47,D-48,D-49", "D4 vert : sans la borne de l'écrivain, D-47 (réservée il y a 10 jours) est rappelée ; D-51 reste hors fenêtre malgré sa reformulation");
  const brut = readFileSync(f, "utf8");
  const r = consignerReponse({ n: 48, lettres: ["B"], fichier: f });
  veut(r.consignee === true && sansReponse(f) === "D-49", `D5 vert : la réponse à D-48 sort D-48 du rappel, D-49 reste ; lu « ${sansReponse(f)} »`);
  const ajout = readFileSync(f, "utf8").slice(brut.length).trim();
  const e5 = ajout ? JSON.parse(ajout) : {};
  veut(ajout.split("\n").length === 1 && e5.type === "reponse" && e5.n === 48 && e5.lettres?.join() === "b" && /^\d{4}-\d{2}-\d{2}$/.test(e5.date) && !("texte" in e5) && !("message" in e5) && !("question" in e5),
    `D6 : l'entrée ne porte que le numéro, les lettres, la date et la session, jamais un texte du message : ${ajout}`);
  veut(consignerReponse({ n: 48, lettres: ["c"], fichier: f }).consignee === false && readFileSync(f, "utf8").split("\n").filter((l) => /"type":"reponse"/.test(l)).length === 1, "D7 rouge : une seconde réponse à D-48 n'ajoute rien (une entrée par décision)");
  veut(consignerReponse({ n: 99, lettres: ["a"], fichier: f }).consignee === false && consignerReponse({ n: 49, lettres: [], fichier: f }).consignee === false && consignerReponse({ n: 49, lettres: ["1"], fichier: f }).consignee === false,
    "D8 rouge : un numéro absent du registre, une réponse sans lettre ou une lettre qui n'en est pas une ne s'écrivent pas");
  veut(consignerReponse({ n: 48, lettres: ["a"], fichier: join(T, "nulle-part.jsonl") }).consignee === false && !existsSync(join(T, "nulle-part.jsonl")), "D9 rouge : sans registre, rien n'est créé");
  veut(reponsesDuRegistre(f).length === 1 && lireRegistrePilot(f).entrees.length === 5, "D10 : la ligne `reponse` n'est pas une décision — lireRegistrePilot l'ignore, le prochain numéro réservé ne bouge pas");
}

rmSync(T, { recursive: true, force: true });
if (casse.length) { console.error(`lib-decisions : ${casse.length} défaut(s)\n - ${casse.join("\n - ")}`); process.exit(1); }
console.log(`lib-decisions (S93, TF-2415, TF-2214) : ${n}/${n} PASS (cas rouges du pilot : D-N réservée sans réponse rappelée, la réponse consignée la sort, une seule entrée par décision, jamais le texte du message ; cas rouges : une décision retirée par un type decision_retiree, en champ simple ou en liste, et le rattachement « D-N remplacée par D-M » sortent la décision du rappel ; `
  + "cas verts : une décision sans sortie reste rappelée, une retraite ne sort que la décision qu'elle nomme, une retraite antérieure ou d'un autre type ne sort rien, la fenêtre de 14 jours tient)");
