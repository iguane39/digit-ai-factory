#!/usr/bin/env node
/**
 * revues-datees.test.mjs — UNE REVUE DATÉE SE RAPPELLE À SA DATE, ET SEULEMENT ALORS (TF-1831).
 *
 * Sur un registre JETABLE en mémoire, jamais le registre réel :
 *   ROUGE → VERT : une revue au 2026-11-16 n'est pas due le 15, l'est le 16 et le 20 ;
 *   VERT         : une revue jouée le 16 (revue_jouee_le) n'est plus due ; un item écarté jamais ;
 *                  une date mal formée n'est jamais due ; la prochaine revue à venir est dite.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { revuesDues, revuesAVenir } from "./revues-datees.mjs";
import { etatCourant } from "./revue-hebdo.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const egal = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m} : ${JSON.stringify(a)} au lieu de ${JSON.stringify(b)}`); };

const registre = [
  { ev: "creation", id: "TF-9001", titre: "mode à revoir", statut: "candidat" },
  { ev: "maj", id: "TF-9001", statut: "corrige", revue_le: "2026-11-16", revue_commande: "node releve.mjs C:/dev" },
  { ev: "creation", id: "TF-9002", titre: "écarté", statut: "candidat" },
  { ev: "maj", id: "TF-9002", statut: "ecarte", revue_le: "2026-11-01" },
  { ev: "creation", id: "TF-9003", titre: "date mal formée", statut: "candidat", revue_le: "16/11/2026" },
  { ev: "creation", id: "TF-9004", titre: "déjà jouée", statut: "decide", revue_le: "2026-10-01", revue_jouee_le: "2026-10-02" },
].map((e) => JSON.stringify(e)).join("\n");
const etat = etatCourant(registre);

check("une revue n'est pas due la veille de sa date", () => egal(revuesDues(etat, "2026-11-15").map((d) => d.id), [], "dues le 15"));
check("une revue est due à sa date, avec sa commande", () => egal(revuesDues(etat, "2026-11-16"), [{ id: "TF-9001", revue_le: "2026-11-16", commande: "node releve.mjs C:/dev", titre: "mode à revoir" }], "dues le 16"));
check("une revue reste due après sa date tant qu'elle n'est pas jouée", () => egal(revuesDues(etat, "2026-11-20").map((d) => d.id), ["TF-9001"], "dues le 20"));
check("une revue jouée n'est plus due", () => {
  const solde = etatCourant(registre + "\n" + JSON.stringify({ ev: "maj", id: "TF-9001", revue_jouee_le: "2026-11-16" }));
  egal(revuesDues(solde, "2026-11-20"), [], "dues après jeu");
});
check("un item écarté et une date mal formée ne sont jamais dus", () => egal(revuesDues(etat, "2027-01-01").map((d) => d.id), ["TF-9001"], "dues en 2027"));
check("la prochaine revue à venir est dite", () => egal(revuesAVenir(etat, "2026-10-16"), [{ id: "TF-9001", revue_le: "2026-11-16" }], "à venir"));

console.log(`\nrevues-datees : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
