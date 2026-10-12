#!/usr/bin/env node
/**
 * banc-mutation.test.mjs — recette à double sens du banc de mutation des oracles (TF-1551). Joué par
 * `oracles\self-tests.mjs` (I2).
 *
 * Le banc se prouve sur des oracles de FABRIQUE dont on connaît le taux de détection : un juge fort qui doit tout voir
 * (taux 100 %), un juge faible qui ne voit rien (taux 0 %, tous survivants), un juge dont le vert est rouge, un juge qui
 * juge l'emplacement et non le texte, un script d'oracle modifié pendant le banc. Puis le manifeste RÉEL : chaque
 * oracle y a son vert qui passe, au moins cinq mutations pertinentes appliquées, et aucun script n'est touché.
 */
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { mesurer, mesurerOracle, lireVerdict, tableauMarkdown, MIN_MUTATIONS_PERTINENTES } from "./banc-mutation.mjs";
import { MUTATIONS, resoudre } from "./mutations.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const DOC = `# Titre du document

Introduction avec un lien [la source](docs/source.md) et un sigle OAT (le contrôle d'accès des tiers) glosé.

## 1. Contexte
Le contrôle a joué 19/19 cas le 2026-10-12 sur 120 fichiers.

| Colonne A | Colonne B |
|---|---|
| un | 1 |

## 2. Verdict
Tout est vérifié, avec 4 preuves chiffrées.

## 3. Risques
- un risque nommé

## 4. Suite
Rien d'autre.
`;

const racine = mkdtempSync(join(tmpdir(), "banc-mut-test-"));
const ecrire = (rel, texte) => { const p = join(racine, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, texte, "utf8"); return rel; };
ecrire("vert.md", DOC);
// Un juge FORT : exige le titre, les quatre sections et le chiffre 19/19 ; refuse tout ce qui les altère.
const FORT = `import {readFileSync} from "node:fs"; const t=readFileSync(process.argv[2],"utf8");
const ok=/^# /m.test(t)&&["1. Contexte","2. Verdict","3. Risques","4. Suite"].every(s=>t.includes("## "+s))&&t.includes("19/19")&&t.includes("(le contrôle")&&t.includes("](docs/source.md)")&&/2026-10-12/.test(t)&&/\\| Colonne B \\|/.test(t)&&/Tout est vérifié/.test(t)&&t.split("\\n").length>=14&&/- un risque nommé/.test(t)&&!t.includes("TF-9999");
console.log(JSON.stringify({verdict:ok?"PASS":"FAIL",findings:ok?[]:[{regle:"F1",statut:"FAIL"}]}));process.exit(ok?0:1);`;
const FAIBLE = `console.log(JSON.stringify({verdict:"PASS",findings:[]}));`;
const ROUGE = `console.log(JSON.stringify({verdict:"FAIL",findings:[{regle:"X",statut:"FAIL"}]}));process.exit(1);`;
const EMPLACEMENT = `import {readFileSync} from "node:fs"; const ok=!process.argv[2].includes("temoin")&&!process.argv[2].includes("banc-mutation");
console.log(JSON.stringify({verdict:ok?"PASS":"FAIL",findings:[]}));`;
ecrire("fort.mjs", FORT); ecrire("faible.mjs", FAIBLE); ecrire("rouge.mjs", ROUGE);
const PERT = ["titre-retire", "section-retiree:Contexte", "section-retiree:Verdict", "section-retiree:Risques", "section-retiree:Suite", "chiffre-fausse", "lien-brise", "glose-supprimee", "date-retiree", "tableau-colonne-retiree", "fin-tronquee", "identifiant-nu"];
const entree = (id, script, pertinentes = PERT) => ({ id, script, args: ["{FICHIER}"], vert: "vert.md", pertinentes });

try {
  check("catalogue — chaque opérateur est pur, déterministe, et rend null ou un texte différent", () => {
    for (const m of MUTATIONS) {
      const a = m.appliquer(DOC), b = m.appliquer(DOC);
      att(a === b, `${m.id} n'est pas déterministe`);
      att(a === null || a !== DOC, `${m.id} rend le texte inchangé au lieu de null`);
    }
    att(MUTATIONS.length >= 15, `${MUTATIONS.length} opérateurs seulement`);
  });
  check("catalogue — chaque mutation de la liste de fabrique s'applique à un document qui la porte", () => {
    for (const id of PERT) att(resoudre(id).appliquer(DOC) !== null, `${id} ne s'applique pas à DOC`);
  });
  check("catalogue — les mutations paramétrées visent ce qu'elles nomment, et rien d'autre", () => {
    const s = resoudre("section-retiree:Verdict").appliquer(DOC);
    att(!s.includes("## 2. Verdict") && s.includes("## 3. Risques") && s.includes("## 1. Contexte"), "section-retiree");
    const v = resoudre("section-videe:Risques").appliquer(DOC);
    att(v.includes("## 3. Risques") && !v.includes("un risque nommé"), "section-videe");
    att(!resoudre("ligne-retiree:risque nommé").appliquer(DOC).includes("risque nommé"), "ligne-retiree");
    att(resoudre("ajout:fin\nde texte").appliquer("x") === "x\nfin\nde texte\n", "ajout");
    att(resoudre("remplacer:19/19=>20/20").appliquer(DOC).includes("20/20"), "remplacer");
    att(resoudre("avant-ligne:^## 2=>AVANT").appliquer(DOC).includes("AVANT\n## 2"), "avant-ligne");
    att(resoudre("section-retiree:absente").appliquer(DOC) === null, "une section absente doit rendre null (non applicable)");
    att(resoudre("inconnue") === null, "une mutation inconnue doit rendre null");
  });
  check("lireVerdict — JSON, texte « verdict : », [FAIL] de règle, code de sortie seul", () => {
    att(lireVerdict(0, '{"verdict":"PASS"}').verdict === "PASS", "JSON PASS");
    const f = lireVerdict(1, '{"verdict":"FAIL","findings":[{"regle":"S1","statut":"FAIL"},{"regle":"S2","statut":"PASS"}]}');
    att(f.verdict === "FAIL" && f.regles.join() === "S1", "JSON FAIL et règles");
    att(lireVerdict(1, "oracle x verdict : FAIL\n  [FAIL] T5 — motif").regles.join() === "T5", "texte");
    att(lireVerdict(0, "rien").verdict === "PASS" && lireVerdict(2, "illisible").verdict === "AUTRE", "code de sortie");
    att(lireVerdict(0, '{"verdict":"SKIP"}').verdict === "AUTRE", "SKIP n'est ni PASS ni FAIL");
  });

  check("juge FORT — toutes les mutations sont détectées : taux 100 %, aucun survivant", () => {
    const r = mesurerOracle(entree("fort", "fort.mjs"), racine);
    att(r.vert_ok, `vert refusé : ${r.verdict_vert}`);
    att(r.appliquees === PERT.length && r.detectes.length === PERT.length && r.survivants.length === 0, `${r.detectes.length}/${r.appliquees}`);
    att(r.taux === 1 && !r.arret, "taux ou arrêt");
  });
  check("juge FAIBLE — il ne voit rien : taux 0 %, tous survivants, nommés (le banc sait dire un mauvais juge)", () => {
    const r = mesurerOracle(entree("faible", "faible.mjs"), racine);
    att(r.taux === 0 && r.survivants.length === PERT.length, `${r.survivants.length} survivants`);
    att(r.survivants.every((s) => s.mutation && s.libelle), "un survivant n'est pas nommé");
  });
  check("vert ROUGE — un oracle dont le livrable vert est refusé n'est pas mesuré, et le banc échoue", () => {
    const r = mesurerOracle(entree("rouge", "rouge.mjs"), racine);
    att(!r.vert_ok && r.appliquees === 0, "le vert refusé a été mesuré quand même");
    const res = mesurer({ oracles: [entree("rouge", "rouge.mjs")], hors_banc: [] }, racine);
    att(res.verdict === "FAIL" && /vert ne passe pas/.test(res.defauts.join(" ")), res.defauts.join());
  });
  check("TÉMOIN COPIÉ — un oracle qui juge l'emplacement est écarté, jamais crédité de détections fausses", () => {
    ecrire("emplacement.mjs", EMPLACEMENT);
    const r = mesurerOracle(entree("emplacement", "emplacement.mjs"), racine);
    att(!r.vert_ok && /emplacement/.test(r.motif_vert), `témoin accepté : ${JSON.stringify(r.motif_vert)}`);
  });
  check("CRITÈRE D'ARRÊT — moins de 5 mutations pertinentes appliquées fait échouer le banc, au vert pourtant", () => {
    const res = mesurer({ oracles: [entree("peu", "fort.mjs", ["titre-retire", "lien-brise", "section-retiree:absente", "section-retiree:encore-absente"])], hors_banc: [] }, racine);
    att(res.oracles[0].arret === true && res.verdict === "FAIL" && /critère d'arrêt/.test(res.defauts.join(" ")), res.defauts.join());
    att(MIN_MUTATIONS_PERTINENTES === 5, "le seuil de l'étude est 5");
    const ok = mesurer({ oracles: [entree("assez", "fort.mjs")], hors_banc: [] }, racine);
    att(ok.verdict === "PASS", `le remède (assez de mutations) doit passer : ${ok.defauts.join()}`);
  });
  check("SEUIL optionnel — un taux sous le seuil demandé fait échouer ; sans seuil le taux se publie sans conditionner", () => {
    const m = { oracles: [entree("faible", "faible.mjs")], hors_banc: [] };
    att(mesurer(m, racine).verdict === "PASS", "sans seuil, le taux 0 % ne doit pas faire échouer");
    att(mesurer(m, racine, undefined, { seuil: 0.5 }).verdict === "FAIL", "avec seuil 0,5, le taux 0 % doit échouer");
  });
  check("L'ORACLE NE SE TOUCHE PAS — un script modifié pendant le banc le fait échouer", () => {
    ecrire("mouvant.mjs", FORT);
    const toucheur = (script, args, env) => { writeFileSync(join(racine, "mouvant.mjs"), FORT + "\n// modifié pendant le banc\n"); return spawnSync(process.execPath, [script, ...args], { encoding: "utf8", env }); };
    const res = mesurer({ oracles: [entree("mouvant", "mouvant.mjs")], hors_banc: [] }, racine, toucheur);
    att(res.verdict === "FAIL" && /a changé pendant le banc/.test(res.defauts.join(" ")), res.defauts.join());
  });
  check("tableau — une ligne par oracle, un total, les survivants listés", () => {
    const t = tableauMarkdown(mesurer({ oracles: [entree("faible", "faible.mjs")], hors_banc: [] }, racine));
    att(/\| `faible` \| 12 \| 0 \| 12 \| 0 % \|/.test(t) && /\*\*Total\*\*/.test(t) && /Survivants/.test(t), t.slice(0, 300));
  });

  // ---- le manifeste RÉEL ----
  const manifeste = JSON.parse(readFileSync(join(ICI, "manifeste-mutation.json"), "utf8"));
  check("manifeste — dix oracles, chacun avec son vert existant, son script existant et au moins cinq mutations déclarées", () => {
    att(manifeste.oracles.length >= 10, `${manifeste.oracles.length} oracles`);
    const pilot = join(ICI, "..", "..");
    for (const o of manifeste.oracles) {
      att(existsSync(join(pilot, o.script)), `${o.id} : script introuvable`);
      att(existsSync(join(pilot, o.vert)), `${o.id} : vert introuvable (${o.vert})`);
      att(o.pertinentes.length >= MIN_MUTATIONS_PERTINENTES, `${o.id} : ${o.pertinentes.length} mutation(s) déclarée(s)`);
      att(o.pertinentes.every((p) => resoudre(p)), `${o.id} : une mutation déclarée est inconnue du catalogue`);
    }
    att(manifeste.hors_banc.length >= 5 && manifeste.hors_banc.every((h) => h.raison), "les oracles hors banc doivent dire pourquoi");
  });
  check("banc RÉEL — chaque vert passe, chaque témoin copié passe, ≥ 5 mutations appliquées par oracle, aucun script touché", () => {
    const res = mesurer(manifeste, join(ICI, "..", ".."));
    att(res.verdict === "PASS", res.defauts.join(" | "));
    att(res.total.mutations >= 50, `${res.total.mutations} mutations jouées seulement`);
    att(res.oracles.every((o) => o.taux !== null), "un taux est absent");
    // CLIQUET : le taux mesuré le 12/10/2026 est de 94 % (65 détectées sur 69). Un oracle assoupli par une session le ferait baisser.
    att(res.total.taux >= 0.9, `taux de détection global ${Math.round(res.total.taux * 100)} %, sous le plancher de 90 % (mesuré à 94 % le 12/10/2026) : un oracle a perdu une détection`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { rmSync(racine, { recursive: true, force: true }); }

console.log(`\nbanc-mutation : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
