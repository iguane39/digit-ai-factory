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
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, unlinkSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { cheminEtatRejeu, cheminVerrouRejeu, concernes, confronter, decisionRejeu, ecrireTrace, encadrer, evenementNonRejoue, evenementsDePropagation, executerRejeuHebdomadaire, extraireEchecs, jouer, lancerRejeuHebdomadaire, lignesOuverture, lignesRejeuOuverture, lireEtatRejeu, lireTable, ORIGINE_REJEU, resoudreInterprete, rougesOuverts, TABLE_PAR_DEFAUT } from "./consommateurs-skills.mjs";

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
  // Windows nomme une variable avec des parenthèses : %ProgramFiles(x86)% était toujours écarté (TF-2068).
  const x86 = resoudreInterprete({ nom: "git-bash", candidats: ["%ProgramFiles(x86)%/Git/bin/bash.exe"] },
    { env: { "ProgramFiles(x86)": "/px86" }, existe: (p) => p === "/px86/Git/bin/bash.exe" });
  if (x86.chemin !== "/px86/Git/bin/bash.exe") throw new Error(`variable à parenthèses non développée : ${JSON.stringify(x86)}`);
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

// ---- TF-2048 (02/11/2026) : un rouge neuf laisse une trace que l'ouverture relit -----------------------------------------------------
check("TF-2048 rouge — C1 et C5 laissent un événement « rouge-neuf » par dépôt ; un vert, un rouge préexistant (C3), un SKIP et un absent n'en laissent aucun", () => {
  const p = parc();
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  const evts = evenementsDePropagation(r, { maintenant: new Date("2026-11-02T10:00:00Z") });
  const noms = evts.filter((e) => e.evenement === "rouge-neuf").map((e) => `${e.regle}:${e.depot}`).sort();
  if (noms.join(",") !== "C1:faux-casse,C5:faux-aggrave") throw new Error(`rouges neufs tracés : ${noms.join(",") || "aucun"}`);
  const casse = evts.find((e) => e.depot === "faux-casse");
  if (casse.commande !== "node verif.mjs" || !casse.skills.includes("faux-socle") || casse.ts !== "2026-11-02T10:00:00.000Z" || !/regle-neuve-refusee/.test(casse.extrait || ""))
    throw new Error(`événement incomplet : ${JSON.stringify(casse)}`);
  if (evts.some((e) => ["faux-stable", "faux-rouge", "faux-skip", "faux-absent", "faux-muet", "faux-fige"].includes(e.depot) && e.evenement === "rouge-neuf"))
    throw new Error(`un dépôt non cassé par la propagation est tracé : ${JSON.stringify(evts)}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("TF-2048 vert — le remède joué : une propagation suivante qui trouve le dépôt vert LÈVE la trace, et il ne reste que l'autre rouge", () => {
  const p = parc();
  const trace = join(p.base, "consommateurs-rouges.jsonl");
  const r = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: p.propager });
  ecrireTrace(trace, evenementsDePropagation(r));
  ecrireTrace(trace, evenementNonRejoue(["faux-socle"]));
  let o = rougesOuverts(trace);
  if (o.ouverts.map((e) => e.depot).sort().join(",") !== "faux-aggrave,faux-casse" || o.non_rejoue !== 1)
    throw new Error(`avant remède : ouverts ${o.ouverts.map((e) => e.depot)}, non rejoués ${o.non_rejoue}`);
  // Le remède : la règle neuve est retirée (ou le consommateur corrigé) ; faux-casse repasse. faux-aggrave reste rouge.
  writeFileSync(p.regle, "regles d'origine\n", "utf8");
  const apres = encadrer({ skills: ["faux-socle"], racine: p.racine, table: p.table, propager: () => "rien" });
  ecrireTrace(trace, evenementsDePropagation(apres, { ouverts: o.ouverts.map((e) => e.depot) }));
  o = rougesOuverts(trace);
  if (o.ouverts.map((e) => e.depot).join(",") !== "faux-aggrave") throw new Error(`après remède : ouverts ${o.ouverts.map((e) => e.depot)}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("TF-2048 — l'ouverture ne dit rien sans rouge ouvert (trace absente, vide ou levée), et nomme dépôt, commande et remède sinon", () => {
  const dir = mkdtempSync(join(tmpdir(), "consommateurs-trace-"));
  const trace = join(dir, "consommateurs-rouges.jsonl");
  if (lignesOuverture(trace).length) throw new Error("une trace absente fait parler l'ouverture");
  ecrireTrace(trace, [{ ts: "2026-10-21T08:00:00.000Z", evenement: "rouge-neuf", depot: "digit-ai-forge-design", regle: "C1", commande: "node oracles/self-test.mjs", skills: ["digit-ai-page-html"], extrait: "[FAIL] V23" }]);
  const l = lignesOuverture(trace).join("\n");
  if (!/digit-ai-forge-design/.test(l) || !/node oracles\/self-test\.mjs/.test(l) || !/--rejouer-consommateurs/.test(l) || !/V23/.test(l)) throw new Error(`ligne incomplète : ${l}`);
  ecrireTrace(trace, [{ ts: "2026-11-02T08:00:00.000Z", evenement: "leve", depot: "digit-ai-forge-design" }]);
  if (lignesOuverture(trace).length) throw new Error("un rouge levé fait encore parler l'ouverture");
  writeFileSync(join(dir, "illisible.jsonl"), "{pas du json\n", "utf8");
  if (rougesOuverts(join(dir, "illisible.jsonl")).illisibles !== 1) throw new Error("une ligne illisible n'est pas comptée");
  rmSync(dir, { recursive: true, force: true });
});

const lancerAvecTrace = (p, trace, ...extra) => {
  const r = spawnSync(process.execPath, [join(ICI, "oracle-skills.mjs"), "--racine", p.racine, "--installes", p.inst,
    "--installes-hooks", join(p.base, "hooks"), "--settings-installe", join(p.base, "settings.json"), ...extra],
  { encoding: "utf8", env: { ...process.env, FORGE_TRACE_CONSOMMATEURS: trace } });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit par l'appelant */ }
  return { code: r.status, j, brut: (r.stdout || "") + (r.stderr || "") };
};

check("TF-2048 CÂBLAGE — `--appliquer --sans-consommateurs` trace la propagation « non-rejoue » ; la propagation mesurée sans rouge ne trace rien", () => {
  const p = parcOracle();
  const trace = join(p.base, "trace.jsonl");
  const sans = lancerAvecTrace(p, trace, "--appliquer", "--sans-consommateurs");
  if (sans.j?.consommateurs?.trace?.ecrit !== 1) throw new Error(`le raccourci n'est pas tracé : ${JSON.stringify(sans.j?.consommateurs)} ${sans.brut.slice(0, 200)}`);
  const o = rougesOuverts(trace);
  if (o.non_rejoue !== 1 || o.ouverts.length) throw new Error(`trace : ${JSON.stringify(o)}`);
  const p2 = parcOracle();
  const trace2 = join(p2.base, "trace.jsonl");
  const mesure = lancerAvecTrace(p2, trace2, "--appliquer");
  if (mesure.j?.consommateurs?.mode !== "mesuré" || existsSync(trace2)) throw new Error(`une propagation mesurée sans rouge a écrit une trace : ${JSON.stringify(mesure.j?.consommateurs?.trace)}`);
  rmSync(p.base, { recursive: true, force: true }); rmSync(p2.base, { recursive: true, force: true });
});

check("TF-2048 CÂBLAGE — `--rejouer-consommateurs` : sans rouge ouvert exit 0 ; un dépôt hors de la table reste ouvert, exit 1, nommé, rien n'est levé à tort", () => {
  const p = parcOracle();
  const trace = join(p.base, "trace.jsonl");
  const vide = lancerAvecTrace(p, trace, "--rejouer-consommateurs");
  if (vide.code !== 0 || vide.j?.ouverts?.length !== 0) throw new Error(`sans rouge ouvert : exit ${vide.code} ${vide.brut.slice(0, 200)}`);
  ecrireTrace(trace, [{ ts: "2026-11-02T08:00:00.000Z", evenement: "rouge-neuf", depot: "depot-hors-table", regle: "C1", commande: "node x.mjs", skills: ["s"] }]);
  const r = lancerAvecTrace(p, trace, "--rejouer-consommateurs");
  if (r.code !== 1 || r.j?.restent?.[0]?.depot !== "depot-hors-table" || !/absent de la table/.test(r.j.restent[0].motif || "")) throw new Error(`dépôt hors table : exit ${r.code} ${r.brut.slice(0, 300)}`);
  if (rougesOuverts(trace).ouverts.length !== 1) throw new Error("un dépôt non rejoué a été levé à tort");
  rmSync(p.base, { recursive: true, force: true });
});

// ---- D-135 (a) du 02/11/2026 : le rejeu hebdomadaire de TOUS les dépôts de la table ---------------------------------------------------------
// Tout se joue sur le parc factice ci-dessus et sur des tables de recette : le banc ne rejoue jamais la vraie table (4 dépôts, jusqu'à 50 minutes).
const T0 = "2026-11-02T10:00:00.000Z";
const a = (iso) => () => new Date(iso);
const jours = (iso, n) => new Date(Date.parse(iso) + n * 86400000);
const rougeOuvert = (depot) => ({ ts: "2026-10-20T08:00:00.000Z", evenement: "rouge-neuf", depot, regle: "C1", commande: "node verif.mjs" });

check("D-135 rouge — le rejeu de TOUS les dépôts : rouge-neuf pour un échec sans rouge ouvert, leve pour un rouge ouvert qui passe ; rien pour un rouge déjà ouvert, un INDÉTERMINÉ ou un SKIP", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  ecrireTrace(trace, [rougeOuvert("faux-stable"), rougeOuvert("faux-rouge")]);
  const r = executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0) });
  if (r.statut !== "termine") throw new Error(`statut ${r.statut}`);
  const statuts = Object.fromEntries(r.depots.map((d) => [d.depot, d.statut]));
  const attendu = { "faux-casse": "PASS", "faux-stable": "PASS", "faux-rouge": "FAIL", "faux-aggrave": "FAIL", "faux-skip": "INDETERMINE", "faux-muet": "FAIL", "faux-fige": "FAIL", "faux-absent": "SKIP" };
  if (JSON.stringify(statuts) !== JSON.stringify(attendu)) throw new Error(`statuts : ${JSON.stringify(statuts)}`);
  const noms = (e) => r.evenements.filter((x) => x.evenement === e).map((x) => x.depot).sort().join(",");
  if (noms("rouge-neuf") !== "faux-aggrave,faux-fige,faux-muet") throw new Error(`rouge-neuf : ${noms("rouge-neuf")}`);
  if (noms("leve") !== "faux-stable") throw new Error(`leve : ${noms("leve")}`);
  if (r.evenements.some((x) => x.origine !== ORIGINE_REJEU)) throw new Error("un événement ne porte pas l'origine du rejeu hebdomadaire");
  const ouverts = rougesOuverts(trace).ouverts.map((e) => e.depot).sort().join(",");
  if (ouverts !== "faux-aggrave,faux-fige,faux-muet,faux-rouge") throw new Error(`ouverts après rejeu : ${ouverts}`);
  if (r.juges !== 6) throw new Error(`dépôts jugés : ${r.juges} (2 PASS + 4 FAIL ; faux-skip INDETERMINE et faux-absent SKIP n'ont rien jugé)`);
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — l'état porte la date de début et la date de fin à côté de la trace, le verrou est retiré ; deux rejeux de suite ne dupliquent aucun rouge", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0) });
  const e = lireEtatRejeu(trace);
  if (!existsSync(cheminEtatRejeu(trace)) || e.dernier_complet?.debut !== T0 || e.dernier_complet?.fin !== T0 || e.dernier?.statut !== "termine") throw new Error(`état : ${JSON.stringify(e)}`);
  if (existsSync(cheminVerrouRejeu(trace))) throw new Error("le verrou n'est pas retiré à la fin");
  const avant = rougesOuverts(trace).lignes;
  executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(jours(T0, 8).toISOString()) });
  if (rougesOuverts(trace).lignes !== avant) throw new Error(`le 2e rejeu a ajouté ${rougesOuverts(trace).lignes - avant} ligne(s) pour des rouges déjà ouverts`);
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 rouge — un rejeu COUPÉ n'écrit rien à la trace, laisse son état « en-cours » sans verrou, et l'ouverture dit qu'il n'a rien jugé ; le suivant le reprend", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  let n = 0;
  const coupe = (c, ...x) => { if (++n === 3) throw new Error("coupure simulée"); return jouer(c, ...x); };
  let leve = null;
  try { executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0), jouerUn: coupe }); } catch (e) { leve = e; }
  if (!leve) throw new Error("la coupure simulée n'a pas interrompu le rejeu");
  if (existsSync(trace)) throw new Error("un rejeu coupé a écrit à la trace");
  if (existsSync(cheminVerrouRejeu(trace))) throw new Error("le verrou d'un rejeu coupé reste posé");
  const e = lireEtatRejeu(trace);
  if (e.dernier?.statut !== "en-cours" || e.dernier_complet) throw new Error(`état d'un rejeu coupé : ${JSON.stringify(e)}`);
  const l = lignesRejeuOuverture(trace, { maintenant: jours(T0, 1), table: p.table }).join("\n");
  if (!/COUPÉ/.test(l) || !/rien jugé/.test(l)) throw new Error(`l'ouverture ne dit pas la coupure : ${l}`);
  const suite = executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(jours(T0, 1).toISOString()) });
  const e2 = lireEtatRejeu(trace);
  if (suite.statut !== "termine" || e2.coupes_depuis_complet !== 0 || !e2.dernier_complet) throw new Error(`reprise : ${JSON.stringify(e2)}`);
  if (lignesRejeuOuverture(trace, { maintenant: jours(T0, 2), table: p.table }).some((x) => /COUPÉ/.test(x))) throw new Error("la coupure est encore dite après un rejeu complet");
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — un dépôt INDÉTERMINÉ ou SKIP est dit « n'a rien jugé » à l'ouverture, nommé, et ne compte ni pour vert ni pour rouge", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0) });
  const l = lignesRejeuOuverture(trace, { maintenant: jours(T0, 1), table: p.table }).join("\n");
  if (!/2 dépôt\(s\) sur 8 n'ont RIEN JUGÉ/.test(l) || !/faux-skip \(INDETERMINE/.test(l) || !/faux-absent \(SKIP/.test(l)) throw new Error(`ligne : ${l}`);
  if (rougesOuverts(trace).ouverts.some((e) => ["faux-skip", "faux-absent"].includes(e.depot))) throw new Error("un dépôt sans jugement est compté pour un rouge");
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — 14 jours sans rejeu abouti se disent à l'ouverture ; à 13 jours, rien ; sans état, rien", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  if (lignesRejeuOuverture(trace, { maintenant: new Date(T0), table: p.table }).length) throw new Error("un état absent fait parler l'ouverture");
  executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0) });
  const dit = (n) => lignesRejeuOuverture(trace, { maintenant: jours(T0, n), table: p.table }).some((x) => /aucun rejeu hebdomadaire n'a abouti depuis/.test(x));
  if (dit(13)) throw new Error("dit à 13 jours");
  if (!dit(15)) throw new Error("non dit à 15 jours");
  const l15 = lignesRejeuOuverture(trace, { maintenant: jours(T0, 15), table: p.table }).join("\n");
  if (!/depuis 15 jours/.test(l15) || !/dernier rejeu complet : 2026-11-02/.test(l15)) throw new Error(`ligne : ${l15}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — le lancement : pas avant 7 jours, pas si un rejeu tourne, verrou périmé traité (pid mort ou plus vieux que la somme des délais), table vide sans objet", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  const d = (n, extra = {}) => decisionRejeu(trace, { maintenant: jours(T0, n), table: p.table, vivant: () => true, ...extra });
  if (!d(0).lancer || d(0).raison !== "jamais") throw new Error(`jamais joué : ${JSON.stringify(d(0))}`);
  executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0) });
  if (d(6.9).lancer || d(6.9).raison !== "a-jour") throw new Error(`à 6,9 jours : ${JSON.stringify(d(6.9))}`);
  if (!d(7.1).lancer || d(7.1).raison !== "echu") throw new Error(`à 7,1 jours : ${JSON.stringify(d(7.1))}`);
  const verrou = (pid, ts) => writeFileSync(cheminVerrouRejeu(trace), JSON.stringify({ pid, ts }), "utf8");
  const maintenant = jours(T0, 9);
  verrou(4242, new Date(maintenant - 120000).toISOString());
  const vif = d(9);
  if (vif.lancer || vif.raison !== "en-cours") throw new Error(`verrou vivant : ${JSON.stringify(vif)}`);
  const mort = d(9, { vivant: () => false });
  if (!mort.lancer || !mort.verrou_perime) throw new Error(`verrou d'un pid mort : ${JSON.stringify(mort)}`);
  verrou(4242, new Date(maintenant - 3 * 3600000).toISOString());
  const vieux = d(9);
  if (!vieux.lancer || !vieux.verrou_perime) throw new Error(`verrou plus vieux que le plafond (pid recyclé) : ${JSON.stringify(vieux)}`);
  unlinkSync(cheminVerrouRejeu(trace));
  if (decisionRejeu(trace, { maintenant, table: { consommateurs: [] } }).raison !== "table-vide") throw new Error("une table vide lance un rejeu");
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — un verrou VIVANT : le rejeu rend « deja-en-cours » sans rien écrire ; un verrou PÉRIMÉ est retiré et le rejeu a lieu", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  writeFileSync(cheminVerrouRejeu(trace), JSON.stringify({ pid: 4242, ts: T0 }), "utf8");
  const r = executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0), vivant: () => true });
  if (r.statut !== "deja-en-cours" || existsSync(trace) || existsSync(cheminEtatRejeu(trace))) throw new Error(`verrou vivant : ${JSON.stringify(r)}`);
  const s = executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0), vivant: () => false });
  if (s.statut !== "termine" || existsSync(cheminVerrouRejeu(trace))) throw new Error(`verrou périmé : ${JSON.stringify(s)}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — le lancement est DÉTACHÉ (processus indépendant, sortie coupée, détaché du parent) ; un lancement impossible est rendu, pas levé ; à jour, rien ne part", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  const appels = [];
  const faux = (cmd, args, opts) => { const appel = { cmd, args, opts, unref: false }; appels.push(appel); return { pid: 4242, on() {}, unref() { appel.unref = true; } }; };
  const r = lancerRejeuHebdomadaire({ trace, pilot: p.base, table: p.table, spawner: faux, maintenant: new Date(T0), vivant: () => true });
  const c = appels[0];
  if (!r.lance || r.pid !== 4242 || !c || c.opts.detached !== true || c.opts.stdio !== "ignore" || !c.unref || !c.args.includes("--rejouer-tous-consommateurs") || c.cmd !== process.execPath)
    throw new Error(`lancement : ${JSON.stringify(r)} ${JSON.stringify(c)}`);
  executerRejeuHebdomadaire({ trace, racine: p.racine, table: p.table, maintenant: a(T0) });
  if (lancerRejeuHebdomadaire({ trace, pilot: p.base, table: p.table, spawner: faux, maintenant: jours(T0, 3), vivant: () => true }).lance || appels.length !== 1) throw new Error("un rejeu à jour a lancé un processus");
  const enoent = lancerRejeuHebdomadaire({ trace, pilot: p.base, table: p.table, maintenant: jours(T0, 9), vivant: () => true, spawner: () => { throw Object.assign(new Error("spawn"), { code: "ENOENT" }); } });
  if (enoent.lance || enoent.erreur !== "ENOENT") throw new Error(`ENOENT : ${JSON.stringify(enoent)}`);
  const sansPid = lancerRejeuHebdomadaire({ trace, pilot: p.base, table: p.table, maintenant: jours(T0, 9), vivant: () => true, spawner: () => ({ on() {}, unref() {} }) });
  if (sansPid.lance || !/pas de pid/.test(sansPid.erreur || "")) throw new Error(`sans pid : ${JSON.stringify(sansPid)}`);
  const l = lignesRejeuOuverture(trace, { maintenant: jours(T0, 9), table: p.table, lancer: () => enoent }).join("\n");
  if (!/NON lancé \(ENOENT\)/.test(l)) throw new Error(`l'échec de lancement n'est pas dit : ${l}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — l'ouverture lit l'état AVANT de lancer : la coupure du rejeu précédent se dit même quand le lancement la réécrit aussitôt", () => {
  const p = parc(); const trace = join(p.base, "consommateurs-rouges.jsonl");
  writeFileSync(cheminEtatRejeu(trace), JSON.stringify({ premier_essai: T0, dernier: { debut: T0, fin: null, statut: "en-cours", pid: 1 } }), "utf8");
  const lancer = () => { writeFileSync(cheminEtatRejeu(trace), JSON.stringify({ premier_essai: T0, dernier: { debut: jours(T0, 9).toISOString(), fin: null, statut: "en-cours", pid: 2 } }), "utf8"); return { lance: true, raison: "echu", pid: 2, duree_ms: 31 }; };
  const l = lignesRejeuOuverture(trace, { maintenant: jours(T0, 9), table: p.table, lancer }).join("\n");
  if (!/COUPÉ/.test(l) || !/lancé en arrière-plan/.test(l) || !/lancement en 31 ms, sans attente/.test(l)) throw new Error(`ligne : ${l}`);
  rmSync(p.base, { recursive: true, force: true });
});

check("D-135 — la ligne d'un rouge est la même, et dit « rejeu hebdomadaire » quand il en est l'origine ; celle d'une propagation ne change pas", () => {
  const dir = mkdtempSync(join(tmpdir(), "consommateurs-ligne-")); const trace = join(dir, "consommateurs-rouges.jsonl");
  ecrireTrace(trace, [{ ts: "2026-11-02T10:00:00.000Z", evenement: "rouge-neuf", origine: ORIGINE_REJEU, depot: "digit-ai-forge-design", regle: "H1", commande: "node oracles/self-test.mjs", skills: ["digit-ai-page-html"], extrait: "ÉCHEC V23" }]);
  const h = lignesOuverture(trace).join("\n");
  if (!/rejeu hebdomadaire du 2026-11-02/.test(h) || !/digit-ai-forge-design/.test(h) || !/node oracles\/self-test\.mjs/.test(h) || !/V23/.test(h) || !/--rejouer-consommateurs/.test(h) || /passait avant la propagation/.test(h))
    throw new Error(`ligne du rejeu hebdomadaire : ${h}`);
  const dir2 = mkdtempSync(join(tmpdir(), "consommateurs-ligne2-")); const trace2 = join(dir2, "consommateurs-rouges.jsonl");
  ecrireTrace(trace2, [rougeOuvert("digit-ai-forge-design")]);
  const prop = lignesOuverture(trace2).join("\n");
  if (!/passait avant la propagation du 2026-10-20/.test(prop) || /rejeu hebdomadaire/.test(prop)) throw new Error(`ligne d'une propagation changée : ${prop}`);
  rmSync(dir, { recursive: true, force: true }); rmSync(dir2, { recursive: true, force: true });
});

check("D-135 CÂBLAGE — `oracle-skills --rejouer-tous-consommateurs` : exit 1 et rouge-neuf pour un dépôt qui échoue ; exit 2 sans rien écrire sous un verrou vivant ; un verrou d'un pid mort est traité sans doublon", () => {
  const p = parcOracle();
  const trace = join(p.base, "trace.jsonl");
  mkdirSync(join(p.racine, "faux-depot-hebdo"), { recursive: true });
  writeFileSync(join(p.racine, "faux-depot-hebdo", "verif.mjs"), "console.log('[FAIL] casse-du-rejeu-hebdo');\nprocess.exit(1);\n", "utf8");
  const tablePath = join(p.base, "table-recette.json");
  writeFileSync(tablePath, JSON.stringify({ mesure_le: "2026-11-02", consommateurs: [{ depot: "faux-depot-hebdo", skills: ["faux-skill-de-banc"],
    verification: { commande: ["node", "verif.mjs"], delai_ms: 30000, extracteur: { nom: "banc", motif: "^\\s*\\[FAIL\\]\\s+(.+?)\\s*$", drapeaux: "gm", groupe: 1 } } }] }), "utf8");
  const lancer = () => {
    const r = spawnSync(process.execPath, [join(ICI, "oracle-skills.mjs"), "--rejouer-tous-consommateurs", "--racine", p.racine, "--installes", p.inst,
      "--installes-hooks", join(p.base, "hooks"), "--settings-installe", join(p.base, "settings.json")],
    { encoding: "utf8", env: { ...process.env, FORGE_TRACE_CONSOMMATEURS: trace, FORGE_TABLE_CONSOMMATEURS: tablePath } });
    let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit par l'appelant */ }
    return { code: r.status, j, brut: (r.stdout || "") + (r.stderr || "") };
  };
  const r1 = lancer();
  if (r1.code !== 1 || r1.j?.statut !== "termine" || r1.j?.depots?.[0]?.statut !== "FAIL") throw new Error(`1er rejeu : exit ${r1.code} ${r1.brut.slice(0, 300)}`);
  const o = rougesOuverts(trace).ouverts;
  if (o.length !== 1 || o[0].depot !== "faux-depot-hebdo" || o[0].origine !== ORIGINE_REJEU || !/casse-du-rejeu-hebdo/.test(o[0].extrait || "")) throw new Error(`trace : ${JSON.stringify(o)}`);
  if (!lireEtatRejeu(trace)?.dernier_complet?.debut || existsSync(cheminVerrouRejeu(trace))) throw new Error("état ou verrou après le rejeu");
  const avant = readFileSync(cheminEtatRejeu(trace), "utf8");
  writeFileSync(cheminVerrouRejeu(trace), JSON.stringify({ pid: process.pid, ts: new Date().toISOString() }), "utf8");
  const r2 = lancer();
  if (r2.code !== 2 || r2.j?.statut !== "deja-en-cours" || readFileSync(cheminEtatRejeu(trace), "utf8") !== avant) throw new Error(`sous verrou vivant : exit ${r2.code} ${r2.brut.slice(0, 300)}`);
  const mort = spawnSync(process.execPath, ["-e", ""]).pid;
  writeFileSync(cheminVerrouRejeu(trace), JSON.stringify({ pid: mort, ts: new Date().toISOString() }), "utf8");
  const r3 = lancer();
  if (r3.j?.statut !== "termine" || rougesOuverts(trace).lignes !== 1) throw new Error(`verrou d'un pid mort : exit ${r3.code} lignes ${rougesOuverts(trace).lignes} ${r3.brut.slice(0, 300)}`);
  rmSync(p.base, { recursive: true, force: true });
});

console.log(`\nconsommateurs-skills (TF-0965, TF-2048, D-135) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
