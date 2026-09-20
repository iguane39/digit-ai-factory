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
import { concernes, confronter, encadrer, extraireEchecs, jouer, lireTable, resoudreInterprete, TABLE_PAR_DEFAUT } from "./consommateurs-skills.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

/**
 * Le parc factice : une « copie installée » d'un skill, et des dépôts qui la consomment.
 *   · faux-casse   : passe avant, échoue dès que la règle neuve apparaît — le cas fondateur du 08/09 ;
 *   · faux-stable  : passe quoi qu'il arrive ;
 *   · faux-rouge   : échoue AVANT comme APRÈS, du MÊME échec — la propagation n'en est pas la cause ;
 *   · faux-aggrave : échoue avant, et un échec de PLUS après — le défaut du 20/09, celui qu'un
 *                    rouge préexistant cachait tant qu'on ne comparait que des codes de sortie ;
 *   · faux-skip    : sort en 2 sans avoir rien jugé (code déclaré au consommateur) ;
 *   · faux-muet    : rouge des deux côtés, sortie qui CHANGE, et aucun extracteur déclaré ;
 *   · faux-fige    : rouge des deux côtés, sortie identique au caractère près, aucun extracteur ;
 *   · faux-absent  : déclaré à la table, jamais cloné sur ce poste.
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
  const lit = `import { readFileSync } from "node:fs";\nconst t = readFileSync(${JSON.stringify(regle)}, "utf8");\nconst neuve = t.includes("regle-neuve");`;
  depot("faux-casse", `${lit}\nif (neuve) console.log("[FAIL] regle-neuve-refusee");\nprocess.exit(neuve ? 1 : 0);\n`);
  depot("faux-stable", "process.exit(0);\n");
  depot("faux-rouge", `${lit}\nconsole.log("[FAIL] rouge-de-toujours");\nprocess.exit(1);\n`);
  depot("faux-aggrave", `${lit}\nconsole.log("[FAIL] rouge-de-toujours");\nif (neuve) console.log("[FAIL] rouge-neuf-du-jour");\nprocess.exit(1);\n`);
  depot("faux-skip", `console.log("verifier : SKIP — aucun shell POSIX sur ce poste");\nprocess.exit(2);\n`);
  depot("faux-muet", `${lit}\nconsole.log("desordre " + (neuve ? "apres" : "avant"));\nprocess.exit(1);\n`);
  depot("faux-fige", `${lit}\nconsole.log("toujours la meme sortie");\nprocess.exit(1);\n`);
  // L'EXTRACTEUR EST UNE DONNÉE DU CONSOMMATEUR, ici comme dans la vraie table : `faux-muet` et
  // `faux-fige` n'en déclarent aucun, et c'est ce qui les rend incomparables — on veut le prouver.
  const EXTRACTEUR = { nom: "banc", motif: "^\\s*\\[FAIL\\]\\s+(.+?)\\s*$", drapeaux: "gm", groupe: 1 };
  const entree = (nom, extra = {}) => ({ depot: nom, skills: ["faux-socle"],
    verification: { commande: ["node", "verif.mjs"], delai_ms: 30000, extracteur: EXTRACTEUR, ...extra } });
  const table = { mesure_le: "2026-09-20", consommateurs: [
    entree("faux-casse"), entree("faux-stable"), entree("faux-rouge"), entree("faux-aggrave"),
    entree("faux-skip", { sortie_sans_jugement: [2] }),
    entree("faux-muet", { extracteur: undefined }), entree("faux-fige", { extracteur: undefined }),
    entree("faux-absent"),
  ] };
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

check("borne — déjà ROUGE avant, MÊME échec après : non imputé (C3), et l'innocence est MONTRÉE", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-rouge");
  if (!f || f.regle !== "C3" || f.statut !== "SANS_OBJET") throw new Error(`un rouge préexistant est imputé à la propagation : ${JSON.stringify(f)}`);
  // L'innocence ne se prononce plus sans preuve : le constat dit COMBIEN d'échecs ont été comparés.
  if (!/comparé\(s\)|IDENTIQUE/.test(f.message)) throw new Error(`C3 affirme l'innocence sans la montrer : ${f.message}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("LE DÉFAUT DU 20/09 — rouge avant ET rouge AGGRAVÉ après : C5, l'échec NEUF est nommé", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-aggrave");
  if (!f || f.regle !== "C5" || f.statut !== "FAIL") throw new Error(`un rouge préexistant masque encore un rouge neuf : ${JSON.stringify(f)}`);
  if (!f.message.includes("rouge-neuf-du-jour")) throw new Error(`l'échec neuf n'est pas nommé : ${f.message}`);
  if (f.message.includes("rouge-de-toujours")) throw new Error("l'échec préexistant est cité comme neuf — la différence n'est pas faite");
  rmSync(p.base, { recursive: true, force: true });
});

check("C5 est aussi grave que C1 : les deux sortent en DÉFAUT, aucun des deux n'annule quoi que ce soit", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const defauts = r.findings.filter((x) => x.statut === "FAIL").map((x) => `${x.regle}:${x.ou}`).sort();
  if (defauts.join(",") !== "C1:faux-casse,C5:faux-aggrave") throw new Error(`défauts = ${defauts.join(",")}`);
  for (const f of r.findings.filter((x) => x.statut === "FAIL")) {
    if (!/RIEN n'a été annulé|ne revient pas en arrière/.test(f.message)) throw new Error(`${f.regle} ne dit pas que rien n'est annulé`);
  }
  rmSync(p.base, { recursive: true, force: true });
});

check("SORTIE DE SKIP — une vérification qui sort sans RIEN JUGER est INDÉTERMINÉE, jamais un rouge", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-skip");
  if (!f || f.regle !== "C2" || f.statut !== "AVERTISSEMENT") throw new Error(`un « rien jugé » est classé ${f?.regle} : ${JSON.stringify(f)}`);
  if (!/SORTIE SANS RIEN JUGER/.test(f.message) || !/INDÉTERMINÉ/.test(f.message)) throw new Error(f.message);
  // Et surtout : il ne sert PAS de rouge préexistant qui innocenterait la propagation. La propriété
  // se lit sur le STATUT, pas sur une chaîne — le message de C2 refuse explicitement de prononcer
  // « elle n'en est pas la cause », donc chercher cette phrase attraperait sa propre négation.
  if (f.statut === "SANS_OBJET") throw new Error("un « rien jugé » clôt encore le dossier comme un rouge préexistant");
  rmSync(p.base, { recursive: true, force: true });
});

check("EXTRACTEUR ABSENT et sortie qui CHANGE : INDÉTERMINÉ déclaré, jamais « elle n'en est pas la cause »", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-muet");
  if (!f || f.regle !== "C2") throw new Error(`${f?.regle} au lieu de C2 : ${JSON.stringify(f)}`);
  if (f.statut === "SANS_OBJET") throw new Error("innocence prononcée sans comparaison possible");
  if (!/INDÉTERMINÉ/.test(f.message) || !/extracteur/.test(f.message)) throw new Error(`le motif ne nomme ni l'état ni le remède : ${f.message}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("REPLI DÉCLARÉ — sans extracteur mais sortie IDENTIQUE au caractère près : C3, innocence prouvée", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const f = trouver(r.findings, "faux-fige");
  if (!f || f.regle !== "C3") throw new Error(`${f?.regle} au lieu de C3 : ${JSON.stringify(f)}`);
  if (!/empreinte/.test(f.message)) throw new Error(`le repli par empreinte n'est pas dit : ${f.message}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("un extracteur qui ne reconnaît RIEN dans une sortie en échec rend `lus: false`, jamais un ensemble vide", () => {
  const vide = extraireEchecs({ nom: "derive", motif: "^ZZZ (.+)$", drapeaux: "gm" }, "[FAIL] quelque chose\n");
  if (vide.lus !== false || !/n'a reconnu AUCUN échec/.test(vide.motif)) throw new Error(JSON.stringify(vide));
  // Un ensemble vide se comparerait à un autre ensemble vide et conclurait « rien de neuf » :
  // l'innocence, sur une mesure qui n'a rien lu. C'est le piège que ce cas ferme.
  const sans = extraireEchecs(undefined, "peu importe");
  if (sans.lus !== false || !/aucun extracteur/.test(sans.motif)) throw new Error(JSON.stringify(sans));
  const bon = extraireEchecs({ nom: "banc", motif: "^\\s*\\[FAIL\\]\\s+(.+?)\\s*$", drapeaux: "gm", groupe: 1 }, "  [FAIL] b\n  [FAIL] a\n  [FAIL] a\n");
  if (bon.echecs.join(",") !== "a,b") throw new Error(`dédoublonné et trié : ${JSON.stringify(bon)}`);
});

check("INTERPRÈTE — résolu par variable d'environnement, puis par candidat, sinon INDÉTERMINÉ nommé", () => {
  const decl = { nom: "git-bash", variable: "FORGE_BASH_BANC", candidats: ["%RACINE_BANC%/bin/bash.exe", "/introuvable/bash"] };
  const parVar = resoudreInterprete(decl, { env: { FORGE_BASH_BANC: "/vu/bash" }, existe: (p) => p === "/vu/bash" });
  if (parVar.chemin !== "/vu/bash" || !/FORGE_BASH_BANC/.test(parVar.par)) throw new Error(JSON.stringify(parVar));
  const parCand = resoudreInterprete(decl, { env: { RACINE_BANC: "/git" }, existe: (p) => p === "/git/bin/bash.exe" });
  if (parCand.chemin !== "/git/bin/bash.exe") throw new Error(JSON.stringify(parCand));
  const absent = resoudreInterprete(decl, { env: {}, existe: () => false });
  if (absent.chemin !== null || !/INTROUVABLE/.test(absent.motif) || !/FORGE_BASH_BANC/.test(absent.motif)) throw new Error(JSON.stringify(absent));
  // Aucun chemin n'est écrit dans le module : sans déclaration, il n'exige aucun interprète.
  if (resoudreInterprete(undefined).requis !== false) throw new Error("un interprète est exigé sans être déclaré");
});

check("un consommateur dont l'INTERPRÈTE est introuvable est INDÉTERMINÉ, jamais rouge", () => {
  const p = parc();
  const e = { depot: "faux-rouge", skills: ["faux-socle"], verification: { commande: ["node", "verif.mjs"],
    interprete: { nom: "shell-imaginaire", variable: "JAMAIS_POSEE_BANC", candidats: ["/nulle/part/sh"] } } };
  const r = jouer(e, p.racine);
  if (r.statut !== "INDETERMINE" || !/INTROUVABLE/.test(r.motif)) throw new Error(JSON.stringify(r));
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
    // CLIQUET du 20/09 : sans extracteur, ce dépôt ne serait comparé que sur son code de sortie,
    // et un rouge préexistant y masquerait un rouge neuf. C'est le défaut du premier usage réel.
    const e = c.verification.extracteur;
    if (!e || !e.motif) throw new Error(`${c.depot} : aucun EXTRACTEUR d'échecs déclaré — la comparaison retomberait sur le code de sortie (TF-0965, 20/09)`);
    let re;
    try { re = new RegExp(e.motif, e.drapeaux || "gm"); } catch (err) { throw new Error(`${c.depot} : extracteur non compilable — ${err.message}`); }
    if (!re.source.includes("(")) throw new Error(`${c.depot} : l'extracteur ne capture aucun groupe, il ne peut pas NOMMER un échec`);
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
