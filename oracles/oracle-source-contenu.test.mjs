#!/usr/bin/env node
/**
 * oracle-source-contenu.test.mjs — recette à DOUBLE SENS de son oracle (TF-1581).
 *
 * Le cas fondateur est rejoué mot pour mot dans sa forme : l'entrée « Studio de plain-pied […] le plus
 * accessible des cinq gîtes » sans source est ROUGE ; la MÊME entrée portant la source relue le
 * 27/09/2026 est VERTE ; la MÊME en statut d'hypothèse est VERTE tant qu'elle reste hors du livrable
 * et ROUGE dès que le livrable la sert. Chaque rouge n'a de sens que parce que son jumeau vert passe.
 *
 * Joué par `oracles\self-tests.mjs` (table `lib-recettes-dediees.mjs`).
 */
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { juger, lireEntrees, chargerSensibles, NON_JUGE } from "./oracle-source-contenu.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

const TEXTE_FONDATEUR = "Studio de plain-pied : pas d'escalier, tout est sur un seul niveau. C'est le plus accessible des cinq gîtes.";
const SOURCE = "https://exploitant.example/gite-studio, page relue le 27/09/2026 : « il se trouve au 1er étage »";
const NEUTRE = { id: "g1-wifi", texte: "Le code du wifi est affiché dans l'entrée." };

check("ROUGE — une affirmation d'accessibilité sans source ni statut est un FAIL (SC2)", () => {
  const f = constat(juger([{ id: "g5-acces", texte: TEXTE_FONDATEUR }, NEUTRE]), "SC2");
  if (f.statut !== "FAIL") throw new Error(`SC2 ${f.statut} — c'est le cas du 27/09/2026`);
  if (!/g5-acces/.test(f.message) || !/accessibilite/.test(f.message)) throw new Error("le constat ne NOMME ni l'entrée ni le domaine");
});

check("VERT — la MÊME entrée portant sa source est acceptée (le remède du message)", () => {
  const r = juger([{ id: "g5-acces", texte: TEXTE_FONDATEUR, _source: SOURCE }, NEUTRE]);
  if (constat(r, "SC2").statut !== "PASS") throw new Error(constat(r, "SC2").message);
});

check("VERT — la MÊME entrée en statut hypothèse est acceptée et sort du compte", () => {
  const r = juger([{ id: "g5-acces", texte: TEXTE_FONDATEUR, statut: "hypothese" }, NEUTRE]);
  if (constat(r, "SC2").statut !== "PASS") throw new Error(constat(r, "SC2").message);
  if (!/1 entrée\(s\) sans source/.test(constat(r, "SC1").message)) throw new Error("SC1 doit ne compter que l'entrée neutre : " + constat(r, "SC1").message);
});

check("VERT — une entrée neutre sans source est COMPTÉE (SC1) sans être accusée", () => {
  const r = juger([NEUTRE]);
  if (r.verdict !== "PASS") throw new Error(`verdict ${r.verdict}`);
  if (!/1 entrée\(s\) sans source/.test(constat(r, "SC1").message)) throw new Error(constat(r, "SC1").message);
});

check("ROUGE — une `_source` vide ou blanche ne vaut pas une source", () => {
  const f = constat(juger([{ id: "g5", texte: TEXTE_FONDATEUR, _source: "   " }]), "SC2");
  if (f.statut !== "FAIL") throw new Error("une source blanche passe");
});

check("ROUGE — une hypothèse SERVIE dans le livrable est un FAIL (SC3)", () => {
  const e = [{ id: "g5-acces", texte: TEXTE_FONDATEUR, statut: "hypothese" }];
  const f = constat(juger(e, { livrable: "Bienvenue ! " + TEXTE_FONDATEUR + " Bon séjour." }), "SC3");
  if (f.statut !== "FAIL") throw new Error(`SC3 ${f.statut} — l'hypothèse a été publiée comme un fait`);
});

check("VERT — la MÊME hypothèse retenue hors du livrable passe SC3", () => {
  const e = [{ id: "g5-acces", texte: TEXTE_FONDATEUR, statut: "question" }];
  const f = constat(juger(e, { livrable: "Bienvenue ! Bon séjour." }), "SC3");
  if (f.statut !== "PASS") throw new Error(f.message);
});

check("SC3 n'est pas jouée sans livrable, et le dit", () => {
  const f = constat(juger([NEUTRE]), "SC3");
  if (f.statut !== "SKIP" || !/livrable/.test(f.message)) throw new Error("silence sur la règle non jouée : " + JSON.stringify(f));
});

check("SANS_OBJET — source vide ou illisible : « je ne peux pas mesurer »", () => {
  if (juger([]).verdict !== "SANS_OBJET") throw new Error("source vide jugée");
  if (lireEntrees("pas du json {") !== null) throw new Error("une source illisible est lue");
});

check("le JSONL (une entrée par ligne) et l'enveloppe { entrees } sont lus", () => {
  if (lireEntrees('{"id":"a","texte":"x"}\n{"id":"b","texte":"y"}\n').length !== 2) throw new Error("JSONL");
  if (lireEntrees('{"entrees":[{"id":"a","texte":"x"}]}').length !== 1) throw new Error("enveloppe");
});

check("le référentiel est une DONNÉE datée, et la limite est NOMMÉE", () => {
  const s = chargerSensibles();
  if (!s || !s.some((x) => x.nom === "accessibilite")) throw new Error("domaine accessibilite absent de gabarits\\AFFIRMATIONS-SENSIBLES.json");
  if (!NON_JUGE.length) throw new Error("NON_JUGE vide");
});

check("en ligne de commande : rouge → exit 1, vert → exit 0, illisible → exit 2", () => {
  const dir = mkdtempSync(join(tmpdir(), "source-contenu-"));
  const moi = fileURLToPath(new URL("./oracle-source-contenu.mjs", import.meta.url));
  const jouer = (nomF, contenu) => {
    const p = join(dir, nomF); writeFileSync(p, contenu, "utf8");
    return spawnSync(process.execPath, [moi, p], { encoding: "utf8" }).status;
  };
  const rouge = jouer("rouge.json", JSON.stringify([{ id: "g5", texte: TEXTE_FONDATEUR }]));
  const vert = jouer("vert.json", JSON.stringify([{ id: "g5", texte: TEXTE_FONDATEUR, _source: SOURCE }]));
  const vide = jouer("vide.json", "[]");
  if (rouge !== 1 || vert !== 0 || vide !== 2) throw new Error(`exit ${rouge}/${vert}/${vide}, attendu 1/0/2`);
});

console.log(`\nRecette source-contenu : ${pass}/${pass + fail} cas`);
process.exit(fail ? 1 : 0);
