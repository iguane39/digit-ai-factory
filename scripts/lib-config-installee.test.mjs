#!/usr/bin/env node
/**
 * lib-config-installee.test.mjs — la recette à double sens de la racine de configuration que la session charge (TF-2589, 15/11/2026).
 * La bibliothèque n'avait aucun cas propre, alors que huit appelants lui font confiance pour dire OÙ ils mesurent (TF-0995).
 * Chaque cas passe son propre `env` : le poste qui joue la recette ne décide jamais du verdict.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { racineConfigInstallee, skillsInstalles, hooksInstalles, settingsInstalle, cheminSkillsInstalles } from "./lib-config-installee.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const B = resolve("fixture-config-b");
const SKILLS = resolve("fixture-skills");
const defaut = join(homedir(), ".claude");

check("racineConfigInstallee — vert : sans variable, le défaut ~/.claude, dit comme tel (variable null)", () => {
  const r = racineConfigInstallee({});
  att(r.racine === defaut && r.variable === null && /défaut ~\/\.claude/.test(r.decidee_par), JSON.stringify(r));
});
check("racineConfigInstallee — rouge : CLAUDE_CONFIG_DIR posée PRIME sur le défaut, et le verdict NOMME la variable (TF-0995)", () => {
  const r = racineConfigInstallee({ CLAUDE_CONFIG_DIR: B });
  att(r.racine === B && r.variable === "CLAUDE_CONFIG_DIR" && r.decidee_par === `CLAUDE_CONFIG_DIR=${B}`, JSON.stringify(r));
  att(r.racine !== defaut, "le défaut ~/.claude a été mesuré malgré la variable de la plateforme");
});
check("racineConfigInstallee — une variable vide ou blanche est ABSENTE (set VAR= sous Windows) ; une variable à espaces est rognée ; un chemin relatif est résolu", () => {
  for (const vide of ["", "   "]) att(racineConfigInstallee({ CLAUDE_CONFIG_DIR: vide }).racine === defaut, `variable « ${vide} » prise pour posée`);
  att(racineConfigInstallee({ CLAUDE_CONFIG_DIR: `  ${B}  ` }).racine === B, "variable non rognée");
  att(racineConfigInstallee({ CLAUDE_CONFIG_DIR: "relatif/config" }).racine === resolve("relatif/config"), "chemin relatif non résolu");
});
check("skillsInstalles — vert : <racine>/skills, avec la provenance de la racine", () => {
  const s = skillsInstalles({ CLAUDE_CONFIG_DIR: B });
  att(s.chemin === join(B, "skills") && s.variable === "CLAUDE_CONFIG_DIR" && s.decide_par === `CLAUDE_CONFIG_DIR=${B}`, JSON.stringify(s));
  att(skillsInstalles({}).chemin === join(defaut, "skills"), "défaut sans variable");
});
check("skillsInstalles — rouge : FORGE_SKILLS_INSTALLES prime sur CLAUDE_CONFIG_DIR (la voie des recettes), et se nomme", () => {
  const s = skillsInstalles({ FORGE_SKILLS_INSTALLES: SKILLS, CLAUDE_CONFIG_DIR: B });
  att(s.chemin === SKILLS && s.variable === "FORGE_SKILLS_INSTALLES" && s.decide_par === `FORGE_SKILLS_INSTALLES=${SKILLS}`, JSON.stringify(s));
  att(skillsInstalles({ FORGE_SKILLS_INSTALLES: "", CLAUDE_CONFIG_DIR: B }).chemin === join(B, "skills"), "FORGE_SKILLS_INSTALLES vide prise pour posée");
});
check("hooksInstalles et settingsInstalle — frères sous la même racine ; FORGE_SKILLS_INSTALLES ne les déplace PAS", () => {
  const env = { CLAUDE_CONFIG_DIR: B, FORGE_SKILLS_INSTALLES: SKILLS };
  att(hooksInstalles(env).chemin === join(B, "hooks") && hooksInstalles(env).variable === "CLAUDE_CONFIG_DIR", JSON.stringify(hooksInstalles(env)));
  att(settingsInstalle(env).chemin === join(B, "settings.json") && settingsInstalle(env).decide_par === `CLAUDE_CONFIG_DIR=${B}`, JSON.stringify(settingsInstalle(env)));
  att(settingsInstalle({}).chemin === join(defaut, "settings.json") && hooksInstalles({}).chemin === join(defaut, "hooks"), "défaut sans variable");
});
check("cheminSkillsInstalles — le raccourci rend le seul chemin, celui de skillsInstalles", () => {
  att(cheminSkillsInstalles({ CLAUDE_CONFIG_DIR: B }) === join(B, "skills") && cheminSkillsInstalles({ FORGE_SKILLS_INSTALLES: SKILLS }) === SKILLS, "chemin du raccourci");
});

console.log(`\nlib-config-installee (TF-2589) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
