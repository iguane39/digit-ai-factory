#!/usr/bin/env node
/**
 * semer-defauts.test.mjs — le MÉCANISME du semis, dans les deux sens (TF-1079).
 *
 * Ce banc n'éprouve AUCUN oracle réel : il éprouve le juge du semis, avec des contrôles FACTICES
 * dont on sait d'avance ce qu'ils rendent. Un contrôle qui refuse l'instance doit donner COUVERTE ;
 * un contrôle qui l'accepte doit donner ACCUSÉE. Sans ces deux cas, rien ne distingue un verbe qui
 * mesure d'un verbe qui déclare tout couvert — le défaut même que TF-1079 cherche.
 *
 * Trois cas gardent le verbe de l'ACCUSATION DE COMPLAISANCE, symétrique de la preuve de
 * complaisance : un contrôle qui refuse aussi le témoin, une règle absente des deux verdicts, une
 * règle qui rend le même message des deux côtés — aucun des trois n'accuse qui que ce soit.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { campagne, declareSansControle, semer } from "./semer-defauts.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const BASE = mkdtempSync(join(tmpdir(), "semer-banc-"));
/** Un contrôle FACTICE : il rend un verdict JSON selon ce que le fichier contient. */
function controleFactice(nom, corps) {
  const f = join(BASE, `${nom}.mjs`);
  writeFileSync(f, `import { readFileSync } from "node:fs";\nconst t = readFileSync(process.argv[2], "utf8");\n${corps}\n`, "utf8");
  return f;
}
const rendre = "const sortir=(st,msg,regle='X')=>{console.log(JSON.stringify({verdict:st==='FAIL'?'FAIL':'PASS',findings:[{regle,statut:st,message:msg}]}));process.exit(st==='FAIL'?1:0);};";
const HONNETE = controleFactice("honnete", `${rendre}\nt.includes("DEFAUT") ? sortir("FAIL","instance refusee") : sortir("PASS","rien a redire");`);
const AVEUGLE = controleFactice("aveugle", `${rendre}\nsortir("PASS", t.includes("DEFAUT") ? "vu, et accepte" : "rien a redire");`);
const PARANO = controleFactice("parano", `${rendre}\nsortir("FAIL","je refuse tout");`);
const MUET = controleFactice("muet", `${rendre}\nsortir("PASS","autre sujet","Z");`);
const CONSTANT = controleFactice("constant", `${rendre}\nsortir("PASS","rien a juger ici");`);

const gen = (controle) => ({
  fonde_par: ["TF-0000"], motif: "instance de banc",
  controle: { commande: ["node", controle, "{fichier}"], regle: "X" },
  instance: { "LIVRABLE.md": "# Livrable\n\nDEFAUT seme ici.\n" },
  temoin: { "LIVRABLE.md": "# Livrable\n\nRien de particulier.\n" },
});

check("rouge — le contrôle REFUSE l'instance et passe le témoin : COUVERTE, couverture prouvée", () => {
  const r = semer("c", gen(HONNETE));
  if (r.statut !== "COUVERTE") throw new Error(`${r.statut} — ${r.motif || r.preuve}`);
});

check("LE CAS QUI COMPTE — le contrôle ACCEPTE l'instance : ACCUSÉE, couverture déclarée et FAUSSE", () => {
  const r = semer("c", gen(AVEUGLE));
  if (r.statut !== "ACCUSEE") throw new Error(`${r.statut} — une couverture fausse passe inaperçue : ${r.motif}`);
  if (!/FAUSSE/.test(r.motif)) throw new Error("le motif ne dit pas que la couverture est fausse");
});

check("garde — le contrôle refuse AUSSI le témoin sain : NON CONCLUANTE, jamais couverte", () => {
  const r = semer("c", gen(PARANO));
  if (r.statut !== "NON_CONCLUANTE") throw new Error(`${r.statut} — un contrôle qui refuse tout passe pour une protection`);
  if (!/refuse AUSSI le témoin/.test(r.motif)) throw new Error(r.motif);
});

check("garde — la règle visée est ABSENTE des deux verdicts : NON CONCLUANTE, personne n'est accusé", () => {
  const r = semer("c", gen(MUET));
  if (r.statut !== "NON_CONCLUANTE") throw new Error(`${r.statut} — le générateur sème à côté et le contrôle est accusé : ${r.motif}`);
});

check("garde — la règle rend le MÊME message des deux côtés : NON CONCLUANTE (elle n'a pas discriminé)", () => {
  const r = semer("c", gen(CONSTANT));
  if (r.statut !== "NON_CONCLUANTE" || !/n'a pas discriminé/.test(r.motif)) throw new Error(`${r.statut} — ${r.motif}`);
});

check("une classe SANS CONTRÔLE déclaré est listée à part, jamais couverte, jamais accusée", () => {
  const r = campagne({
    classes: [{ cle: "sans-controle", oracle: "aucun — non mécanisable, déclaré" }, { cle: "a-creer", oracle: "a creer : un oracle de plus" }],
    generateurs: { generateurs: { "sans-controle": gen(HONNETE), "a-creer": gen(HONNETE) } },
  });
  if (r.mesure.sans_controle !== 2) throw new Error(`${r.mesure.sans_controle} classe(s) sans contrôle au lieu de 2`);
  if (r.mesure.couvertes || r.mesure.accusees) throw new Error("une classe sans contrôle a été jugée");
});

check("une classe SANS GÉNÉRATEUR porte son motif, et n'est jamais comptée couverte", () => {
  const r = campagne({
    classes: [{ cle: "orpheline", oracle: "oracles/oracle-x.mjs R1" }],
    generateurs: { generateurs: {}, sans_generateur: { orpheline: "le contrôle juge le parc, pas un livrable" } },
  });
  if (r.mesure.sans_generateur !== 1 || r.mesure.couvertes) throw new Error(JSON.stringify(r.mesure));
  if (!/juge le parc/.test(r.sans_generateur[0].motif)) throw new Error("le motif déclaré n'est pas repris");
});

check("la lecture du champ `oracle` reconnaît les formes réelles du référentiel", () => {
  const vrais = ["aucun — non mécanisable, déclaré", "a creer : releve des depots consommateurs", "à créer : une fixture", "", "—"];
  for (const v of vrais) if (!declareSansControle(v)) throw new Error(`« ${v} » n'est pas vu comme « sans contrôle »`);
  for (const v of ["oracle-synthese S34", "oracles/oracle-ecriture.mjs EC-9"]) {
    if (declareSansControle(v)) throw new Error(`« ${v} » est vu comme « sans contrôle » alors qu'il en nomme un`);
  }
});

check("LECTURE SEULE — ni le référentiel des classes ni la table des générateurs ne sont touchés", () => {
  const sceau = (f) => createHash("sha256").update(readFileSync(f, "utf8").replace(/\r\n/g, "\n"), "utf8").digest("hex");
  const c = join(ICI, "CLASSES.json"), g = join(ICI, "generateurs-defauts.json");
  const avant = [sceau(c), sceau(g)];
  const ref = JSON.parse(readFileSync(c, "utf8"));
  campagne({ classes: ref.classes.slice(0, 12), generateurs: JSON.parse(readFileSync(g, "utf8")) });
  if (sceau(c) !== avant[0]) throw new Error("todo/CLASSES.json a été MODIFIÉ — ce verbe le lit, il ne l'écrit jamais");
  if (sceau(g) !== avant[1]) throw new Error("todo/generateurs-defauts.json a été MODIFIÉ");
});

check("la TABLE des générateurs est DATÉE, et chaque entrée porte instance, témoin et règle visée", () => {
  const t = JSON.parse(readFileSync(join(ICI, "generateurs-defauts.json"), "utf8"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.date || "")) throw new Error(`table non datée : ${t.date}`);
  const entrees = Object.entries(t.generateurs || {});
  if (entrees.length < 5) throw new Error(`${entrees.length} générateur(s) — le cliquet de la largeur honnête est à 5`);
  for (const [cle, g] of entrees) {
    if (!g.instance || !Object.keys(g.instance).length) throw new Error(`${cle} : aucune instance semée`);
    if (!g.temoin || !Object.keys(g.temoin).length) throw new Error(`${cle} : aucun TÉMOIN — sans lui, un contrôle qui refuse tout passe pour une protection`);
    if (!g.controle?.regle) throw new Error(`${cle} : aucune règle visée, le jugement se ferait sur un code de sortie`);
    if (!g.motif) throw new Error(`${cle} : aucun motif de fidélité au défaut fondateur`);
  }
});

check("chaque classe du référentiel tombe dans une case et une seule", () => {
  const ref = JSON.parse(readFileSync(join(ICI, "CLASSES.json"), "utf8"));
  const gen2 = JSON.parse(readFileSync(join(ICI, "generateurs-defauts.json"), "utf8"));
  const r = campagne({ classes: ref.classes, generateurs: gen2 });
  const m = r.mesure;
  const total = m.couvertes + m.accusees + m.non_concluantes + m.non_jouees + m.sans_controle + m.sans_generateur;
  if (total !== ref.classes.length) throw new Error(`${total} classes classées pour ${ref.classes.length} lues — une classe se perd en route`);
});

rmSync(BASE, { recursive: true, force: true });
console.log(`\nsemer-defauts (TF-1079) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
