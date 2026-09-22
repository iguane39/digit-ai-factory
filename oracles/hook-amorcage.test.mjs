#!/usr/bin/env node
/**
 * hook-amorcage.test.mjs — recette à DEUX SENS du hameçon d'amorçage de portée poste
 * (TF-1285, décision humaine D-2 (b) du 22/09/2026).
 *
 * POURQUOI UN FICHIER DÉDIÉ ET NON UN `--self-test` INTERNE. `hook-amorcage.mjs` importe
 * `hook-lexique.mjs` pour jouer le lexique RV-6 sans le réimplémenter. Or `hook-lexique.mjs` lit
 * `process.argv` À SON CHARGEMENT : un `--self-test` passé au module importateur part jouer le
 * banc de l'IMPORTÉ, affiche « hook-lexique : 13 PASS » et sort en 0 — le banc de l'importateur
 * ne tourne jamais, et le vert obtenu ne prouve rien de lui. Mesuré au premier essai le
 * 22/09/2026. Le défaut de l'importé est remonté au registre ; ici, la forme dédiée le contourne
 * sans rien casser chez lui.
 *
 * Ce que la recette prouve, dans les deux sens à chaque fois :
 *   · le motif reconnaît la marque sous ses formes, et REFUSE « factory pattern » — le faux
 *     positif qui ferait désactiver un hameçon de portée poste ;
 *   · la garde d'idempotence laisse un projet instrumenté à son propre hameçon ;
 *   · l'injection nomme le skill, résout le pilot, et se tait sans signal écrit.
 * Joué par `oracles\self-tests.mjs` (I1 et I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  contexte, nommeLeDispositif, dejaInstrumente, racineDuPilot, SKILL_ACCUEIL, RE_DISPOSITIF,
} from "./hook-amorcage.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "amorcage-hook-"));
let n = 0;
const dossier = ({ forge = false, settings = null, settingsBrut = null } = {}) => {
  const d = join(T, `d${++n}`);
  mkdirSync(d, { recursive: true });
  if (forge) mkdirSync(join(d, "forge"), { recursive: true });
  if (settings !== null || settingsBrut !== null) {
    mkdirSync(join(d, ".claude"), { recursive: true });
    writeFileSync(join(d, ".claude", "settings.json"), settingsBrut ?? JSON.stringify(settings), "utf8");
  }
  return d;
};

try {
  // ── le motif : ce qu'il reconnaît ─────────────────────────────────────────────────────────
  check("ROUGE du motif — l'URL du dépôt, forme du message fondateur, est reconnue", () => {
    att(nommeLeDispositif("Analyse ce dépôt selon https://github.com/iguane39/digit-ai-factory"), "URL non reconnue");
  });

  check("le nom du pilot et celui d'une forge sont reconnus", () => {
    att(nommeLeDispositif("suis la doctrine de digit-ai-factory"), "nom du pilot non reconnu");
    att(nommeLeDispositif("ouvre un run avec digit-ai-forge-tests"), "nom d'une forge non reconnu");
  });

  check("la marque écrite à côté du mot « forge » ou « factory » est reconnue", () => {
    att(nommeLeDispositif("Nouveau produit via la forge Digit-AI."), "« forge Digit-AI » non reconnu");
    att(nommeLeDispositif("on passe par la factory de Digit-AI"), "« factory de Digit-AI » non reconnu");
  });

  // ── et surtout ce qu'il REFUSE de reconnaître ────────────────────────────────────────────
  check("VERT du motif — « factory pattern » NE déclenche PAS : c'est le faux positif qui ferait désactiver le hameçon", () => {
    att(!nommeLeDispositif("Refactore ce code avec un factory pattern et une AbstractFactory"), "« factory pattern » a déclenché");
    att(!nommeLeDispositif("ajoute un createUserFactory dans le module"), "un identifiant de code a déclenché");
    att(!nommeLeDispositif("la forge de Vulcain est une métaphore, pas un outil"), "« forge » seul a déclenché");
    att(!nommeLeDispositif("le pattern Factory Method convient mieux ici"), "« Factory Method » a déclenché");
  });

  check("le motif est une constante EXPORTÉE — la règle se lit, elle ne se devine pas", () => {
    att(RE_DISPOSITIF instanceof RegExp, "le motif n'est pas exporté");
  });

  // ── la garde d'idempotence ───────────────────────────────────────────────────────────────
  check("ROUGE — un répertoire avec `forge\\` est déjà instrumenté : rien n'est injecté", () => {
    const d = dossier({ forge: true });
    att(dejaInstrumente(d), "le dossier forge n'est pas vu");
    att(contexte("suis la doctrine de digit-ai-factory", { cwd: d }) === "", "une ligne a été injectée dans un projet instrumenté");
  });

  check("ROUGE — un `settings.json` de projet déclarant UserPromptSubmit suffit (cas du pilot)", () => {
    const d = dossier({ settings: { hooks: { UserPromptSubmit: [{ hooks: [{ type: "command", command: "node oracles/hook-lexique.mjs" }] }] } } });
    att(dejaInstrumente(d), "le hameçon de projet n'est pas vu");
    att(contexte("digit-ai-factory", { cwd: d }) === "", "une ligne a été injectée alors que le projet a son hameçon");
  });

  check("un `settings.json` SANS UserPromptSubmit ne compte pas pour instrumenté", () => {
    const d = dossier({ settings: { hooks: { Stop: [{ hooks: [{ type: "command", command: "x" }] }] } } });
    att(!dejaInstrumente(d), "un settings sans hameçon sur le message a été pris pour instrumenté");
  });

  check("un `settings.json` illisible ne prouve rien et ne fait pas planter la mesure", () => {
    const d = dossier({ settingsBrut: "{ pas du JSON" });
    att(!dejaInstrumente(d), "un settings illisible a été pris pour instrumenté");
  });

  check("un répertoire nu n'est pas instrumenté", () => {
    att(!dejaInstrumente(dossier()), "un répertoire nu a été pris pour instrumenté");
  });

  // ── l'injection, dans un projet NON instrumenté ──────────────────────────────────────────
  check("VERT — projet nu et message qui nomme le dispositif : le skill d'accueil est appelé, le pilot est résolu", () => {
    const t = contexte("Analyse ce dépôt selon https://github.com/iguane39/digit-ai-factory", { cwd: dossier() });
    att(/AMORÇAGE/.test(t), "aucune ligne d'amorçage");
    att(t.includes(SKILL_ACCUEIL), "le skill d'accueil n'est pas nommé");
    att(/Le pilot est résolu/.test(t), "le pilot n'est pas résolu alors qu'il vit à côté de ce hameçon");
    att(/amorcage-factory-sans-declencheur-au-poste/.test(t), "la classe de défaut n'est pas nommée");
  });

  check("VERT — projet nu et message SANS la marque : rien n'est injecté (borne déclarée)", () => {
    att(contexte("écris-moi une fonction de tri", { cwd: dossier() }) === "", "une ligne a été injectée sans signal écrit");
  });

  check("le LEXIQUE RV-6 joue enfin dans un projet nu — il n'y jouait jamais", () => {
    const t = contexte("Améliore ce prompt : construis un tableau de bord", { cwd: dossier() });
    att(/LEXIQUE RV-6/.test(t), "le lexique ne joue pas hors d'un projet instrumenté");
    att(/prompt-analyzer-l99/.test(t), "le skill du lexique n'est pas nommé");
  });

  check("les DEUX lignes cohabitent quand le message porte les deux signaux", () => {
    const t = contexte("Améliore ce prompt : ouvre un run via la forge Digit-AI", { cwd: dossier() });
    att(/LEXIQUE RV-6/.test(t) && /AMORÇAGE/.test(t), `une seule ligne rendue : ${t.slice(0, 140)}`);
  });

  check("une notification de tâche de fond n'est PAS un message humain — rien n'est injecté", () => {
    att(contexte("<task-notification>digit-ai-factory a fini</task-notification>", { cwd: dossier() }) === "",
      "une notification a déclenché l'amorçage");
    att(contexte("<system-reminder>digit-ai-factory</system-reminder>", { cwd: dossier() }) === "",
      "un rappel système a déclenché l'amorçage");
  });

  check("racineDuPilot trouve le pilot depuis ce hameçon, qui vit dedans", () => {
    const r = racineDuPilot();
    att(r && existsSync(join(r, "bootstrap.mjs")) && existsSync(join(r, "CLAUDE.md")), `pilot non résolu : ${r}`);
  });

  check("le hameçon en sous-processus sort en 0 et n'écrit rien sur un message sans signal", async () => {
    const { spawnSync } = await import("node:child_process");
    const r = spawnSync(process.execPath, [join(import.meta.dirname ?? ".", "hook-amorcage.mjs")],
      { input: JSON.stringify({ prompt: "écris une fonction de tri" }), encoding: "utf8", cwd: dossier() });
    att(r.status === 0, `exit ${r.status}`);
    att((r.stdout || "").trim() === "", `sortie non vide : ${r.stdout}`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nhook-amorcage (TF-1285) : ${pass} PASS, ${fail} FAIL — couverture à double sens sur le motif, la garde d'idempotence et l'injection`);
process.exit(fail ? 1 : 0);
