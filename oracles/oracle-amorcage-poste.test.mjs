#!/usr/bin/env node
/**
 * oracle-amorcage-poste.test.mjs — recette à DEUX SENS de l'amorçage au poste (TF-1285, classe
 * `amorcage-factory-sans-declencheur-au-poste`, 22/09/2026).
 *
 * Les deux sens sur chacune des trois règles, plus les TROIS faux positifs mesurés sur le poste
 * réel pendant l'écriture de l'oracle et corrigés — chacun a sa fixture, sans quoi rien n'empêche
 * de les réintroduire par un calibrage de plus :
 *   · « Écran d'accueil » dans une cellule de tableau du corps d'un SKILL.md n'est pas un accueil ;
 *   · un geste d'ouverture et le dispositif présents tous deux dans une longue description non plus ;
 *   · ni même les deux à quarante caractères l'un de l'autre.
 * Chacun DOIT ÉCHOUER à convaincre AP1, et le cas qui le prouve est ROUGE du côté de la fixture.
 *
 * Joué par `oracles\self-tests.mjs` (I1 et I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  juger, skillsDuPoste, enTeteSkill, porteLAmorcage, scriptCite, hooksDuPoste,
  MOTS_D_ACCUEIL, HOOK_ATTENDU, NON_JUGE,
} from "./oracle-amorcage-poste.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const regle = (r, id) => r.findings.find((f) => f.regle === id);
const echoue = (r, id) => (regle(r, id) || {}).statut === "FAIL";
const passe = (r, id) => (regle(r, id) || {}).statut === "PASS";

const T = mkdtempSync(join(tmpdir(), "amorcage-poste-"));
let n = 0;

/**
 * Un poste fabriqué. `skills` est une carte `nom → contenu du SKILL.md`, `settings` l'objet écrit
 * dans `settings.json`, `local` celui de `settings.local.json`, `scripts` les fichiers à créer
 * pour qu'une commande de hook résolve.
 */
const poste = ({ skills = {}, settings = null, local = null, scripts = [] } = {}) => {
  const d = join(T, `p${++n}`);
  mkdirSync(d, { recursive: true });
  for (const [nom, contenu] of Object.entries(skills)) {
    mkdirSync(join(d, "skills", nom), { recursive: true });
    writeFileSync(join(d, "skills", nom, "SKILL.md"), contenu, "utf8");
  }
  if (settings !== null) writeFileSync(join(d, "settings.json"), JSON.stringify(settings, null, 1), "utf8");
  if (local !== null) writeFileSync(join(d, "settings.local.json"), JSON.stringify(local, null, 1), "utf8");
  for (const s of scripts) { mkdirSync(join(d, ".."), { recursive: true }); writeFileSync(join(d, s), "// fixture\n", "utf8"); }
  return d;
};

const fiche = (nom, description) => `---\nname: ${nom}\ndescription: ${description}\nversion: 1.0.0\n---\n\n# ${nom}\n`;
const hook = (evenement, commande) => ({ hooks: { [evenement]: [{ hooks: [{ type: "command", command: commande }] }] } });

try {
  // ── AP0 : aucun poste à juger n'est SANS OBJET, jamais un PASS ────────────────────────────
  check("AP0 — aucun répertoire de poste → SANS_OBJET, et le motif dit que ce n'est pas un poste conforme", () => {
    const r = juger({ postes: [join(T, "poste-qui-n-existe-pas")] });
    att(r.verdict === "SANS_OBJET", `verdict ${r.verdict}`);
    att(/pas un poste conforme/.test(regle(r, "AP0").message), "le motif laisse croire qu'un poste absent est conforme");
    att(/TF-1133/.test(regle(r, "AP0").message), "le critère « parc absent » n'est pas cité");
  });

  // ── AP1 : un skill d'accueil devant la session ────────────────────────────────────────────
  check("AP1 ROUGE — trente skills propagés et aucun d'accueil : DOIT ÉCHOUER (le fait du 22/09)", () => {
    const skills = {};
    for (let i = 0; i < 30; i++) skills[`skill-quelconque-${i}`] = fiche(`skill-quelconque-${i}`, "Fait une chose utile.");
    const r = juger({ postes: [poste({ skills, settings: hook(HOOK_ATTENDU, "node C:/absent/x.mjs") })] });
    att(echoue(r, "AP1"), "AP1 a absous un poste sans skill d'accueil");
    att(/30 skill/.test(regle(r, "AP1").message), "le nombre de skills propagés n'est pas NOMMÉ — c'est la preuve que le canal marche");
    att(/bootstrap\.mjs/.test(regle(r, "AP1").message), "le remède ne nomme pas le porteur");
  });

  check("AP1 VERT — un skill dont le NOM porte l'amorçage suffit", () => {
    const r = juger({ postes: [poste({ skills: { "accueil-factory": fiche("accueil-factory", "Ouvre un run.") } })] });
    att(passe(r, "AP1"), `AP1 ${JSON.stringify(regle(r, "AP1"))}`);
  });

  check("AP1 VERT — le champ `name` de l'en-tête compte autant que le nom du répertoire", () => {
    const r = juger({ postes: [poste({ skills: { "un-nom-neutre": fiche("demarrer-un-run", "Peu importe.") } })] });
    att(passe(r, "AP1"), "le champ `name` n'est pas lu");
  });

  // ── AP1, les trois faux positifs mesurés : chacun DOIT rester rouge ───────────────────────
  check("AP1 faux positif n° 1 — « Écran d'accueil » dans le CORPS d'un SKILL.md ne convainc pas", () => {
    const corps = fiche("enumere-la-surface", "Énumère la surface fonctionnelle d'un produit.")
      + "\n| `point-entree` | Par où l'on entre | Écran d'accueil, batch de nuit |\n";
    const r = juger({ postes: [poste({ skills: { "enumere-la-surface": corps } })] });
    att(echoue(r, "AP1"), "une cellule de tableau du corps a suffi à faire passer un poste nu");
  });

  check("AP1 faux positif n° 2 — geste d'ouverture et dispositif présents mais sans rapport dans une longue description", () => {
    const d = "Trouve, qualifie et pérennise la barre de qualité d'un livrable — une référence externe "
      + "concrète et inspectable qui fixe le niveau à atteindre. Deux modes : pré-vol, qui ouvre le "
      + "prompt avant son exécution, et en ligne. Ne pas déclencher pour itérer sur le livrable, "
      + "ni pour orchestrer constructeur et critique dans une forge.";
    const r = juger({ postes: [poste({ skills: { "la-barre": fiche("la-barre", d) } })] });
    att(echoue(r, "AP1"), "la co-occurrence dans une description a suffi à faire passer un poste nu");
  });

  check("AP1 faux positif n° 3 — geste et dispositif À QUARANTE CARACTÈRES l'un de l'autre ne suffisent pas non plus", () => {
    const d = "Écrit une fiche experte, admise au registre d'une forge si sa contribution ouvre "
      + "une réponse matériellement différente d'une baseline.";
    const r = juger({ postes: [poste({ skills: { "write-an-expert": fiche("write-an-expert", d) } })] });
    att(echoue(r, "AP1"), "le voisinage dans une description a suffi à faire passer un poste nu");
  });

  check("AP1 — la description n'est JAMAIS un critère, et la borne est déclarée au non_juge", () => {
    att(!porteLAmorcage({ nom: "x", name: "x", description: "ouvrir un run de la factory" }),
      "la description est encore lue comme un critère");
    att(NON_JUGE.some((l) => /ne lit que le NOM/.test(l)), "la borne n'est pas déclarée au non_juge");
  });

  // ── AP2 : un hook UserPromptSubmit de portée POSTE ────────────────────────────────────────
  check("AP2 ROUGE — un poste dont les settings déclarent d'autres hooks mais pas UserPromptSubmit : DOIT ÉCHOUER", () => {
    const p = poste({ skills: { accueil: fiche("accueil", "x") }, settings: hook("Stop", "node C:/absent/stop.mjs") });
    const r = juger({ postes: [p] });
    att(echoue(r, "AP2"), "AP2 a absous un poste sans UserPromptSubmit");
    att(/Stop/.test(regle(r, "AP2").message), "les événements réellement déclarés ne sont pas nommés");
    att(/portée PRODUIT/.test(regle(r, "AP2").message), "le motif ne dit pas où vit le hook de la bonne forme");
  });

  check("AP2 ROUGE — aucun settings.json du tout : DOIT ÉCHOUER, et le dire « aucun »", () => {
    const r = juger({ postes: [poste({ skills: { accueil: fiche("accueil", "x") } })] });
    att(echoue(r, "AP2"), "un poste sans settings a été absous");
    att(/aucun/.test(regle(r, "AP2").message), "l'absence totale d'événement n'est pas dite");
  });

  check("AP2 VERT — UserPromptSubmit déclaré dans settings.json", () => {
    const r = juger({ postes: [poste({ skills: { accueil: fiche("accueil", "x") }, settings: hook(HOOK_ATTENDU, "node --version") })] });
    att(passe(r, "AP2"), `AP2 ${JSON.stringify(regle(r, "AP2"))}`);
  });

  check("AP2 VERT — settings.local.json compte autant que settings.json", () => {
    const r = juger({ postes: [poste({ skills: { accueil: fiche("accueil", "x") }, local: hook(HOOK_ATTENDU, "node --version") })] });
    att(passe(r, "AP2"), "la surcharge locale n'est pas lue");
  });

  // ── AP3 : un hook dont le script est absent ne tourne pas ─────────────────────────────────
  check("AP3 ROUGE — hook déclaré dont le script est ABSENT du disque : DOIT ÉCHOUER", () => {
    const p = poste({ skills: { accueil: fiche("accueil", "x") }, settings: hook(HOOK_ATTENDU, "node C:/nulle/part/lexique.mjs") });
    const r = juger({ postes: [p] });
    att(echoue(r, "AP3"), "un hook dont le script n'existe pas a été tenu pour câblé");
    att(/lexique\.mjs/.test(regle(r, "AP3").message), "le script fautif n'est pas NOMMÉ");
  });

  check("AP3 VERT — le script cité existe, relatif au poste", () => {
    const p = poste({ skills: { accueil: fiche("accueil", "x") }, settings: hook(HOOK_ATTENDU, "node ./lexique.mjs"), scripts: ["lexique.mjs"] });
    const r = juger({ postes: [p] });
    att(passe(r, "AP3"), `AP3 ${JSON.stringify(regle(r, "AP3"))}`);
  });

  check("AP3 VERT — une commande SANS chemin de script (un binaire du système) n'est pas accusée", () => {
    const r = juger({ postes: [poste({ skills: { accueil: fiche("accueil", "x") }, settings: hook(HOOK_ATTENDU, "echo bonjour") })] });
    att(passe(r, "AP3"), "une commande sans script a été comptée comme absente");
    att(scriptCite("echo bonjour") === null, "scriptCite invente un chemin");
  });

  // ── le poste ENTIÈREMENT conforme : les trois règles vertes ensemble ─────────────────────
  check("un poste conforme rend PASS sur les trois règles — le sens vert de bout en bout", () => {
    const p = poste({
      skills: { "accueil-factory": fiche("accueil-factory", "Ouvre un run."), autre: fiche("autre", "x") },
      settings: hook(HOOK_ATTENDU, "node ./lexique.mjs"), scripts: ["lexique.mjs"],
    });
    const r = juger({ postes: [p] });
    att(r.verdict === "PASS", `verdict ${r.verdict} — ${JSON.stringify(r.findings.filter((f) => f.statut === "FAIL"))}`);
  });

  // ── un poste rouge parmi deux fait échouer l'ensemble, et il est NOMMÉ ───────────────────
  check("deux postes, un seul nu → FAIL, et le poste fautif est NOMMÉ (bootstrap propage vers les deux)", () => {
    const bon = poste({ skills: { accueil: fiche("accueil", "x") }, settings: hook(HOOK_ATTENDU, "node --version") });
    const nu = poste({ skills: { rien: fiche("rien", "x") }, settings: hook(HOOK_ATTENDU, "node --version") });
    const r = juger({ postes: [bon, nu] });
    att(echoue(r, "AP1"), "un poste nu parmi deux a été absous");
    att(regle(r, "AP1").ou.includes(nu), "le poste fautif n'est pas nommé");
    att(!regle(r, "AP1").ou.includes(bon), "un poste conforme est accusé");
  });

  // ── les analyseurs, pris séparément ──────────────────────────────────────────────────────
  check("enTeteSkill — un SKILL.md sans en-tête YAML rend des champs vides, jamais une exception", () => {
    const t = enTeteSkill("# Pas d'en-tête\n\ndu texte");
    att(t.name === "" && t.description === "", JSON.stringify(t));
  });

  check("enTeteSkill — une description repliée sur plusieurs lignes est recollée", () => {
    const t = enTeteSkill("---\nname: x\ndescription: début\n  suite de la phrase\n---\n");
    att(/début suite de la phrase/.test(t.description), JSON.stringify(t));
  });

  check("skillsDuPoste — un poste sans répertoire skills rend une liste vide", () => {
    att(skillsDuPoste(poste({})).length === 0, "un poste sans skills rend autre chose qu'une liste vide");
  });

  check("hooksDuPoste — un settings.json illisible est ignoré, il ne fait pas planter la mesure", () => {
    const d = join(T, `casse${++n}`);
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "settings.json"), "{ ceci n'est pas du JSON", "utf8");
    att(hooksDuPoste(d).length === 0, "un settings illisible a produit des hooks");
  });

  check("MOTS_D_ACCUEIL est une liste ÉCRITE et non vide — la règle se lit, elle ne se devine pas", () => {
    att(Array.isArray(MOTS_D_ACCUEIL) && MOTS_D_ACCUEIL.length >= 4, "la liste des mots d'amorçage a fondu");
    att(MOTS_D_ACCUEIL.includes("accueil") && MOTS_D_ACCUEIL.includes("amorcage"), "les deux mots fondateurs ont disparu");
  });

  check("le non_juge déclare que TF-1286 n'est PAS couvert — un oracle qui prétendrait le couvrir mentirait", () => {
    att(NON_JUGE.some((l) => /TF-1286/.test(l)), "la portée non couverte n'est pas déclarée");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\namorcage-poste (TF-1285) : ${pass} PASS, ${fail} FAIL — couverture à double sens sur AP1, AP2, AP3`);
process.exit(fail ? 1 : 0);
