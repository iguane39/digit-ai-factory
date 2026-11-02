#!/usr/bin/env node
// remesurer.test — recette à double sens de la sentinelle de remesure (D-118 (a), TF-1954) et de la règle R18.
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { defautsRemesure, remesuresDues, jouerRemesure, jouerDues, avertissementsSurvivants, dejaJouees } from "./remesurer.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-todo.mjs");
let pass = 0, fail = 0;
const verifier = (nom, cond, detail = "") => { if (cond) { pass++; console.log(`  [PASS] ${nom}`); } else { fail++; console.error(`  [FAIL] ${nom} ${detail}`); } };

const T = mkdtempSync(join(tmpdir(), "remesurer-"));
const item = (id, remesure, sur = {}) => [id, { id, titre: `sujet ${id}`, statut: "corrige", date_correction: "2026-10-20", remesure, ...sur }];
const etat = new Map([
  item("TF-1", { commande: "x", duree_max_s: 60 }),
  item("TF-2", { commande: "y", sortie: "PASS", apres_jours: 30 }),
  item("TF-3", { commande: "z", duree_max_s: 5 }, { statut: "en_cours" }),
  item("TF-4", { avertissement: "Visibilité NON mesurée" }),
]);

try {
  // ---- le contrat du champ
  verifier("contrat vert — commande et durée visée", defautsRemesure({ commande: "x", duree_max_s: 60 }).length === 0);
  verifier("contrat vert — avertissement seul", defautsRemesure({ avertissement: "abc" }).length === 0);
  verifier("contrat rouge — une commande sans valeur visée", /sans valeur visée/.test(defautsRemesure({ commande: "x" }).join()));
  verifier("contrat rouge — ni commande ni avertissement", /rien à remesurer/.test(defautsRemesure({ duree_max_s: 5 }).join()));
  verifier("contrat rouge — une expression illisible", /expression régulière/.test(defautsRemesure({ avertissement: "(" }).join()));

  // ---- ce qui est dû
  const au27 = remesuresDues(etat, "2026-10-27").map((d) => d.id);
  verifier("7 jours après la clôture, la remesure est due ; pas la veille", au27.join() === "TF-1" && remesuresDues(etat, "2026-10-26").length === 0, au27.join());
  verifier("apres_jours décale la date ; un item non clos n'est jamais dû", remesuresDues(etat, "2026-11-19").map((d) => d.id).join() === "TF-1,TF-2");
  verifier("une remesure déjà jouée n'est plus due", remesuresDues(etat, "2026-10-27", new Set(["TF-1"])).length === 0);

  // ---- le verdict, dans les deux sens : c'est le cas du 13/10 (mesuré à blanc, lent en service)
  const lancer = (duree_s, code = 0, sortie = "") => () => ({ code, sortie, duree_s });
  verifier("rouge — 158 s pour 60 s visées est un écart nommé", /158 s pour 60 s/.test(jouerRemesure({ id: "a", commande: "x", duree_max_s: 60 }, lancer(158)).ecarts.join()));
  verifier("vert — 41 s pour 60 s visées : aucun écart", jouerRemesure({ id: "a", commande: "x", duree_max_s: 60 }, lancer(41)).ecarts.length === 0);
  verifier("rouge — une commande en échec est un écart", /sort en 1/.test(jouerRemesure({ id: "a", commande: "x", duree_max_s: 60 }, lancer(1, 1)).ecarts.join()));
  verifier("rouge — la sortie attendue absente est un écart", /ne porte pas/.test(jouerRemesure({ id: "a", commande: "x", sortie: "PASS" }, lancer(1, 0, "FAIL")).ecarts.join()));

  // ---- jouer et consigner : au plus 2 par ouverture, jamais deux fois
  const journal = join(T, "remesures.jsonl");
  const plusieurs = new Map([item("TF-5", { commande: "a", duree_max_s: 9 }), item("TF-6", { commande: "b", duree_max_s: 9 }), item("TF-7", { commande: "c", duree_max_s: 9 })]);
  const r1 = jouerDues(plusieurs, "2026-10-27", { journal, lancer: lancer(1) });
  verifier("au plus 2 remesures par ouverture, consignées au journal", r1.jouees.length === 2 && r1.dues === 3 && dejaJouees(journal).size === 2);
  const r2 = jouerDues(plusieurs, "2026-10-27", { journal, lancer: lancer(1) });
  verifier("l'ouverture suivante joue la 3e, jamais les 2 premières", r2.jouees.length === 1 && r2.jouees[0].id === "TF-7");

  // ---- l'avertissement qui survit à son item
  const texte = "## Fraîcheur\n- Visibilité NON mesurée pour ce dépôt\n";
  const restes = avertissementsSurvivants(etat, texte, "2026-10-27");
  verifier("rouge — un avertissement encore présent après la date est nommé avec son item", restes.length === 1 && restes[0].id === "TF-4");
  verifier("vert — l'avertissement disparu n'est plus nommé", avertissementsSurvivants(etat, "## Fraîcheur\n- tout va bien\n", "2026-10-27").length === 0);
  verifier("avant sa date, l'avertissement n'est pas jugé", avertissementsSurvivants(etat, texte, "2026-10-21").length === 0);

  // ---- R18 d'oracle-todo : un champ mal formé est un FAIL, le registre sans le champ reste PASS
  const registre = (remesure) => {
    const lignes = [
      { ev: "creation", id: "TF-9001", titre: "recette R18", contenu: "cas de recette", source: "recette", demandeur: "pilot", date_demande: "2026-10-26", classe: "controle-vrai-sur-le-mauvais-invariant", score: { gain: 1, preuve: 1, effort: 1, valeur: 1 }, ts: "2026-10-26T10:00:00.000Z" },
      { ev: "maj", id: "TF-9001", statut: "decide", decideur: "humain, recette", date_decision: "2026-10-26", ts: "2026-10-26T10:00:01.000Z" },
      { ev: "maj", id: "TF-9001", statut: "corrige", date_correction: "2026-10-26", corrections_realisees: "recette", gains_constates: "recette", descente: { oracle: "recette" }, ...(remesure ? { remesure } : {}), ts: "2026-10-26T10:00:02.000Z" },
    ];
    const f = join(T, `reg-${pass + fail}.jsonl`);
    writeFileSync(f, lignes.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
    const vide = join(T, "archive.jsonl"); if (!existsSync(vide)) writeFileSync(vide, "", "utf8");
    const r = spawnSync(process.execPath, [ORACLE, f, vide], { encoding: "utf8" });
    return JSON.parse(r.stdout).findings.filter((x) => x.regle === "R18");
  };
  verifier("R18 rouge — une remesure sans valeur visée est refusée", registre({ commande: "x" }).some((x) => x.statut === "FAIL"));
  verifier("R18 vert — une remesure bien formée passe", !registre({ commande: "x", duree_max_s: 60 }).some((x) => x.statut === "FAIL"));
  verifier("R18 vert — le champ reste facultatif", !registre(null).some((x) => x.statut === "FAIL"));
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\nremesurer (TF-1954) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
