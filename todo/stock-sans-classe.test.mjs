#!/usr/bin/env node
/**
 * stock-sans-classe.test.mjs — le stock d'items ouverts sans classe se mesure dans les deux sens (TF-1301).
 * Rouge : des items decide / en_cours / candidat sans classe sont comptés et nommés, par statut. Vert : un item
 * classé (classe ou classe_a_creer), un item clos sans classe, et un registre sans stock ne comptent pas.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { stockSansClasse, ligneStock } from "./stock-sans-classe.mjs";
import { etatCourant } from "./revue-hebdo.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const NL = String.fromCharCode(10);
const journal = (...evts) => evts.map((e) => JSON.stringify(e)).join(NL) + NL;
const cre = (id, extra = {}) => ({ ev: "creation", id, titre: id, ...extra });
const maj = (id, extra) => ({ ev: "maj", id, ...extra });

const registre = journal(
  cre("TF-1", { classe: "regle-ecrite-sans-oracle-qui-la-joue" }),                 // classé, candidat
  cre("TF-2"),                                                                     // candidat SANS classe
  cre("TF-3"), maj("TF-3", { statut: "decide" }),                                  // decide SANS classe
  cre("TF-4"), maj("TF-4", { statut: "en_cours" }),                                // en_cours SANS classe
  cre("TF-5", { classe_a_creer: { cle: "x", famille: "y", libelle: "z" } }), maj("TF-5", { statut: "decide" }), // classe à créer = classé
  cre("TF-6"), maj("TF-6", { statut: "corrige" }),                                 // clos sans classe : hors stock
  cre("TF-7"), maj("TF-7", { statut: "decide" }), maj("TF-7", { classe: "oracle-faux-positif" }), // classé après coup
);

check("rouge — les items ouverts sans classe sont comptés par statut et nommés", () => {
  const s = stockSansClasse(etatCourant(registre));
  if (s.total !== 3) throw new Error(`total ${s.total}, attendu 3`);
  if (s.parStatut.candidat.join() !== "TF-2" || s.parStatut.decide.join() !== "TF-3" || s.parStatut.en_cours.join() !== "TF-4")
    throw new Error(`répartition fausse : ${JSON.stringify(s.parStatut)}`);
});
check("vert — classe, classe_a_creer, classe posée après coup et item clos ne comptent pas", () => {
  const s = stockSansClasse(etatCourant(registre));
  const nommes = Object.values(s.parStatut).flat();
  for (const id of ["TF-1", "TF-5", "TF-6", "TF-7"]) if (nommes.includes(id)) throw new Error(`${id} compté à tort`);
});
check("vert — un registre sans stock le DIT au lieu de se taire", () => {
  const s = stockSansClasse(etatCourant(journal(cre("TF-1", { classe: "c" }))));
  if (s.total !== 0 || !/aucun item ouvert sans classe/.test(ligneStock(s))) throw new Error(ligneStock(s));
});
check("la ligne publiée porte le compte, le détail par statut et les identifiants", () => {
  const l = ligneStock(stockSansClasse(etatCourant(registre)));
  if (!/3 item\(s\) ouvert\(s\) sans classe \(candidat 1, decide 1, en_cours 1\)/.test(l) || !/TF-2, TF-3, TF-4/.test(l)) throw new Error(l);
});

console.log(`${NL}stock-sans-classe (TF-1301) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
