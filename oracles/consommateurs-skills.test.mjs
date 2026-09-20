#!/usr/bin/env node
/**
 * consommateurs-skills.test.mjs — une propagation qui casse un dépôt consommateur le DIT, et une
 * propagation qui ne casse rien se tait (TF-0965).
 *
 * TOUT SE JOUE SUR DES DÉPÔTS ET DES SKILLS FACTICES, en dossier temporaire. Ce banc ne touche
 * JAMAIS la vraie copie installée (`~/.claude/skills`) ni un vrai dépôt frère — et il ne le promet
 * pas, il le PROUVE : un cas espionne le lanceur et vérifie que chaque commande a été lancée sous
 * la racine temporaire. Un banc qui mesurerait le vrai parc ferait payer dix minutes de suites à
 * chaque passage du harnais, et finirait désactivé.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { concernes, confronter, encadrer, jouer, lireTable, TABLE_PAR_DEFAUT } from "./consommateurs-skills.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

/**
 * Le parc factice : une « copie installée » d'un skill, et des dépôts qui la consomment.
 *   · faux-casse  : sa vérification échoue dès que la règle neuve apparaît dans la copie installée
 *                   — c'est le cas fondateur du 08/09, en miniature ;
 *   · faux-stable : elle passe quoi qu'il arrive ;
 *   · faux-rouge  : elle échoue AVANT comme APRÈS — la propagation n'en est pas la cause ;
 *   · faux-absent : déclaré à la table, jamais cloné sur ce poste.
 */
function parc() {
  const base = mkdtempSync(join(tmpdir(), "consommateurs-skills-"));
  const racine = join(base, "forges");
  const installe = join(base, "installe", "faux-socle");
  mkdirSync(installe, { recursive: true });
  const regle = join(installe, "REGLE.txt");
  writeFileSync(regle, "regles d'origine\n", "utf8");
  const depot = (nom, corps) => {
    mkdirSync(join(racine, nom), { recursive: true });
    writeFileSync(join(racine, nom, "verif.mjs"), corps, "utf8");
  };
  // `.mjs` : la lecture s'écrit en ESM. Écrite en `require`, la fixture jetait AVANT comme APRÈS —
  // elle était donc rouge des deux côtés et ne prouvait plus la TRANSITION, seule chose qui compte.
  const lit = `import { readFileSync } from "node:fs";\nconst t = readFileSync(${JSON.stringify(regle)}, "utf8");`;
  depot("faux-casse", `${lit}\nprocess.exit(t.includes("regle-neuve") ? 1 : 0);\n`);
  depot("faux-stable", "process.exit(0);\n");
  depot("faux-rouge", "console.log('rouge depuis toujours');\nprocess.exit(1);\n");
  const entree = (nom) => ({ depot: nom, skills: ["faux-socle"],
    verification: { commande: ["node", "verif.mjs"], delai_ms: 30000 } });
  const table = { mesure_le: "2026-09-20", consommateurs: ["faux-casse", "faux-stable", "faux-rouge", "faux-absent"].map(entree) };
  // LA PROPAGATION FACTICE : elle écrit la règle neuve dans la copie installée, comme
  // `--appliquer` recopie une source. Rien d'autre ne bouge entre les deux mesures.
  const propager = () => { writeFileSync(regle, "regles d'origine\nregle-neuve\n", "utf8"); return "applique"; };
  return { base, racine, table, propager, regle };
}
const trouver = (findings, depot) => findings.find((f) => f.ou === depot);

check("rouge — un consommateur qui PASSAIT et ne passe plus : DÉFAUT C1, nommé, une ligne par dépôt", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-casse");
  if (!f || f.regle !== "C1" || f.statut !== "FAIL") throw new Error(`aucun DÉFAUT sur faux-casse : ${JSON.stringify(r.findings)}`);
  if (!/PASSAIT avant la propagation et ÉCHOUE après/.test(f.message)) throw new Error("le constat ne dit pas la transition");
  if (!/RIEN n'a été annulé/.test(f.message)) throw new Error("le constat ne dit pas que rien n'est réparé tout seul");
  rmSync(p.base, { recursive: true, force: true });
});

check("vert — un consommateur qui passe AVANT et APRÈS : aucun constat dur sur lui", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  if (trouver(r.findings, "faux-stable")) throw new Error(`faux-stable a produit un constat : ${JSON.stringify(trouver(r.findings, "faux-stable"))}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("borne — un consommateur ABSENT du poste : SKIP DÉCLARÉ, jamais un défaut, jamais un silence", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-absent");
  if (!f || f.statut !== "SANS_OBJET" || !/NON JUGÉ/.test(f.message) || !/dépôt absent/.test(f.message))
    throw new Error(`l'absence n'est pas déclarée : ${JSON.stringify(f)}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("borne — déjà ROUGE avant : la propagation n'en est PAS accusée (C3), et c'est dit", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-rouge");
  if (!f || f.regle !== "C3" || f.statut !== "SANS_OBJET") throw new Error(`un rouge préexistant est imputé à la propagation : ${JSON.stringify(f)}`);
  if (r.findings.filter((x) => x.statut === "FAIL").length !== 1) throw new Error("plus d'un DÉFAUT : le rouge préexistant en fait partie");
  rmSync(p.base, { recursive: true, force: true });
});

check("vert — rouge AVANT et vert APRÈS : la propagation a RÉPARÉ, et ça se dit aussi (C4)", () => {
  const avant = [{ depot: "d", statut: "FAIL", exit: 1, commande: "node verif.mjs" }];
  const apres = [{ depot: "d", statut: "PASS", exit: 0, commande: "node verif.mjs" }];
  const f = confronter(avant, apres)[0];
  if (!f || f.regle !== "C4" || !/a réparé/.test(f.message)) throw new Error(JSON.stringify(f));
});

check("borne — délai DÉPASSÉ après une mesure verte : INDÉTERMINÉ (C2), jamais compté pour un vert", () => {
  const p = parc();
  // Lanceur injecté : la première mesure passe, la seconde déborde. Simuler le délai plutôt que
  // l'attendre — un banc qui dort dix minutes pour prouver un dépassement ne se joue plus.
  let apresPropagation = false;
  const lanceur = () => (apresPropagation ? { error: { code: "ETIMEDOUT" } } : { status: 0, stdout: "", stderr: "" });
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, lanceur,
    propager: () => { apresPropagation = true; return p.propager(); } });
  const f = trouver(r.findings, "faux-casse");
  if (!f || f.regle !== "C2" || f.statut !== "AVERTISSEMENT") throw new Error(`le dépassement passe pour un vert : ${JSON.stringify(f)}`);
  if (!/n'a pas fini/.test(f.message)) throw new Error("le motif ne dit pas que rien n'a été prouvé");
  if (r.findings.some((x) => x.statut === "FAIL")) throw new Error("un INDÉTERMINÉ a été durci en DÉFAUT");
  rmSync(p.base, { recursive: true, force: true });
});

check("borne — la propagation ne touche AUCUN skill consommé : rien n'est rejoué, et le motif le dit", () => {
  const p = parc();
  let lance = 0;
  const r = encadrer({ skills: [], racine: p.racine, table: p.table, propager: p.propager, lanceur: () => { lance++; return { status: 0 }; } });
  if (lance !== 0) throw new Error(`${lance} vérification(s) jouée(s) pour zéro skill touché — une propagation vide coûterait dix minutes`);
  if (!r.motif || !/aucun skill/.test(r.motif)) throw new Error(`motif muet : ${r.motif}`);
  if (readFileSync(p.regle, "utf8").includes("regle-neuve") === false) throw new Error("la propagation n'a pas été jouée : elle ne doit jamais être BLOQUÉE par ce mécanisme");
  rmSync(p.base, { recursive: true, force: true });
});

check("borne — un skill sans consommateur déclaré : la propagation passe, et l'absence de table est DITE", () => {
  const p = parc();
  const r = encadrer({ skills: ["skill-inconnu"], racine: p.racine, table: p.table, propager: p.propager });
  if (r.consommateurs.length || r.findings.length) throw new Error("un consommateur a été inventé");
  if (!/aucun consommateur déclaré pour skill-inconnu/.test(r.motif || "")) throw new Error(`motif muet : ${r.motif}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("SÉCURITÉ — aucune commande n'est lancée hors de la racine temporaire (ni copie installée, ni dépôt frère)", () => {
  const p = parc();
  const cwds = [];
  const lanceur = (cmd, args, opts) => { cwds.push(opts.cwd); return { status: 0, stdout: "", stderr: "" }; };
  encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager, lanceur });
  if (!cwds.length) throw new Error("aucune commande lancée : le cas ne prouve rien");
  const vrais = [resolve(homedir(), ".claude"), resolve(ICI, "..")];
  for (const c of cwds) {
    if (!resolve(c).startsWith(resolve(p.base))) throw new Error(`commande lancée HORS du parc factice : ${c}`);
    if (vrais.some((v) => resolve(c).toLowerCase().startsWith(v.toLowerCase()))) throw new Error(`commande lancée dans un vrai dossier : ${c}`);
  }
  rmSync(p.base, { recursive: true, force: true });
});

check("la TABLE livrée est lisible, DATÉE et ne déclare que des dépôts (loi n° 4 : une donnée, pas du code)", () => {
  const t = lireTable(TABLE_PAR_DEFAUT);
  if (t.erreur) throw new Error(t.erreur);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.mesure_le || "")) throw new Error(`table non datée : ${t.mesure_le}`);
  if (!t.consommateurs.length) throw new Error("table vide — une table vide se lit comme « personne ne consomme »");
  for (const c of t.consommateurs) {
    if (!c.depot || !Array.isArray(c.skills) || !c.skills.length) throw new Error(`entrée incomplète : ${JSON.stringify(c)}`);
    if (!Array.isArray(c.verification?.commande) || !c.verification.commande.length) throw new Error(`${c.depot} : aucune commande de vérification native`);
    if (!c.motif) throw new Error(`${c.depot} : aucun motif — une entrée sans motif ne se relit pas`);
  }
  // Le SOCLE lui-même n'est pas son propre consommateur : le mesurer serait le trou d'origine.
  if (t.consommateurs.some((c) => c.depot === "digit-ai-forge-agents")) throw new Error("le dépôt SOURCE des skills est listé comme consommateur (TF-0965)");
});

check("sélection — seuls les consommateurs des skills TOUCHÉS sont retenus", () => {
  const table = { consommateurs: [
    { depot: "a", skills: ["x"] }, { depot: "b", skills: ["y"] }, { depot: "c", skills: ["X", "z"] },
  ] };
  const noms = concernes(table, ["x"]).map((c) => c.depot);
  if (noms.join(",") !== "a,c") throw new Error(`sélection = ${noms.join(",")} (la casse doit être indifférente)`);
  if (concernes(table, []).length) throw new Error("une propagation vide sélectionne des consommateurs");
});

check("jouer — un dépôt présent mais sans commande déclarée : SKIP, jamais un vert muet", () => {
  const p = parc();
  const r = jouer({ depot: "faux-stable", skills: ["faux-socle"], verification: {} }, p.racine);
  if (r.statut !== "SKIP" || !/aucune commande/.test(r.motif)) throw new Error(JSON.stringify(r));
  if (existsSync(join(p.racine, "faux-stable", "verif.mjs")) === false) throw new Error("fixture absente");
  rmSync(p.base, { recursive: true, force: true });
});

// ---- LE CÂBLAGE DANS `oracle-skills --appliquer`, sur un parc FACTICE -------------------------
//
// `--installes` est imposé : l'oracle propage vers un dossier temporaire, JAMAIS vers
// `~/.claude/skills`. Le skill porte un nom que la table livrée ne connaît pas — sans quoi ces deux
// cas lanceraient les suites réelles de forge-tests et de forge-design à chaque passage du harnais.
function parcOracle() {
  const base = mkdtempSync(join(tmpdir(), "consommateurs-cli-"));
  const src = join(base, "forges", "digit-ai-forge-factice", ".claude", "skills", "faux-skill-de-banc");
  mkdirSync(src, { recursive: true });
  writeFileSync(join(src, "SKILL.md"), "---\nname: faux-skill-de-banc\ndescription: fixture de banc\nversion: 1.0.0\n---\n\nRien.\n", "utf8");
  const inst = join(base, "installe");
  mkdirSync(inst, { recursive: true });
  return { base, racine: join(base, "forges"), inst };
}
const lancerOracle = (p, ...extra) => {
  const r = spawnSync(process.execPath, [join(ICI, "oracle-skills.mjs"),
    "--racine", p.racine, "--installes", p.inst,
    "--installes-hooks", join(p.base, "hooks"), "--settings-installe", join(p.base, "settings.json"),
    "--appliquer", ...extra], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit par l'appelant */ }
  return { code: r.status, j, brut: (r.stdout || "") + (r.stderr || "") };
};

check("CÂBLAGE — `oracle-skills --appliquer` relève les consommateurs des skills qu'il touche", () => {
  const p = parcOracle();
  const r = lancerOracle(p);
  if (!r.j || !r.j.consommateurs) throw new Error(`aucun bloc \`consommateurs\` au verdict : ${r.brut.slice(0, 400)}`);
  if (r.j.consommateurs.mode !== "mesuré") throw new Error(`mode = ${r.j.consommateurs.mode}`);
  if (!r.j.consommateurs.skills_touches.includes("faux-skill-de-banc")) throw new Error(`skills touchés non relevés : ${JSON.stringify(r.j.consommateurs.skills_touches)}`);
  if (!/aucun consommateur déclaré/.test(r.j.consommateurs.motif || "")) throw new Error(`motif muet : ${r.j.consommateurs.motif}`);
  // Et la propagation a bien EU LIEU : le mécanisme mesure, il ne retient jamais la copie.
  if (!existsSync(join(p.inst, "faux-skill-de-banc", "SKILL.md"))) throw new Error("la propagation a été bloquée par le mécanisme de mesure");
  rmSync(p.base, { recursive: true, force: true });
});

check("CÂBLAGE — `--sans-consommateurs` est DÉCLARÉ au verdict, jamais silencieux", () => {
  const p = parcOracle();
  const r = lancerOracle(p, "--sans-consommateurs");
  if (!r.j || r.j.consommateurs?.mode !== "--sans-consommateurs") throw new Error(`le raccourci n'est pas déclaré : ${JSON.stringify(r.j?.consommateurs)}`);
  if (!/n'ont PAS été rejoués/.test(r.j.consommateurs.motif || "")) throw new Error("le motif ne dit pas ce qui n'a pas été mesuré");
  if (!existsSync(join(p.inst, "faux-skill-de-banc", "SKILL.md"))) throw new Error("la propagation n'a pas eu lieu");
  rmSync(p.base, { recursive: true, force: true });
});

console.log(`\nconsommateurs-skills (TF-0965) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
