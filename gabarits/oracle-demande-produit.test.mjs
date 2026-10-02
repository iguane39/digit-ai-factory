#!/usr/bin/env node
/**
 * oracle-demande-produit.test.mjs — recette du juge de forme des demandes entre produits
 * (TF-1522, 02/10/2026, canal §3 sexies de CONTRAT-INTERFACE.md).
 *
 * Les DEUX SENS sur chacune des règles (D1-D3) : une demande complète passe, et chaque règle a
 * une fixture ROUGE qui la fait échouer seule — même discipline que
 * `gabarits\oracle-travaux-pilot.test.mjs`, dont ce module reprend le modèle. Joué par
 * `oracles\self-tests.mjs` (I2).
 */
import { verifier, VERSION } from "./oracle-demande-produit.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const echoue = (r, regle) => r.constats.some((c) => c.regle === regle && c.statut === "FAIL");

const DEMANDE = ({ statut = "- **Statut** : a_traiter", sections = {}, borne = "aucun autre flux que celui-ci, et aucune modification du format existant" } = {}) => {
  const s = { fait: true, evolution: true, concerne: true, verification: true, borne: true, ...sections };
  return [
    "# Demande d'évolution entre produits — produit-demandeur → produit-destinataire — 20261002a",
    "",
    "- **Demandeur** : produit-demandeur",
    "- **Destinataire** : produit-destinataire",
    statut,
    "",
    s.fait ? "## 1. Le fait observé" : "## Autre titre",
    "", "constaté le 01/10, preuve : fichier journal.jsonl entrée 41", "",
    s.evolution ? "## 2. L'évolution demandée" : "## Autre titre",
    "", "que le flux porte un identifiant stable", "",
    s.concerne ? "## 3. Ce qui concerne ce produit-là" : "## Autre titre",
    "", "c'est ce produit qui émet le flux consommé", "",
    s.verification ? "## 4. Comment le demandeur saura que c'est fait" : "## Autre titre",
    "", "rejouer la commande X et constater Y", "",
    s.borne ? "## 5. Ce que cette demande ne réclame pas" : "## Autre titre",
    "", borne, "",
  ].join("\n");
};

try {
  check("verte — une demande complète est PASS sur les trois règles", () => {
    const r = verifier(DEMANDE(), "produit-demandeur - DEMANDE - 20261002a.md");
    att(r.verdict === "PASS", `verdict ${r.verdict} : ${JSON.stringify(r.constats.filter((c) => c.statut === "FAIL"))}`);
  });

  check("verte — la 5e rubrique peut déclarer « rien n'est écarté de cette demande »", () => {
    const r = verifier(DEMANDE({ borne: "rien n'est écarté de cette demande" }), "produit-demandeur - DEMANDE - 20261002a.md");
    att(r.verdict === "PASS", `verdict ${r.verdict}`);
    att(!echoue(r, "D3"), "la déclaration d'absence légitime est quand même refusée");
  });

  // ---- D1 : le nom du fichier -----------------------------------------------------------
  check("rouge D1 — un nom qui ne suit pas « <demandeur> - DEMANDE - AAAAMMJJ<indice>.md » échoue SEUL", () => {
    const r = verifier(DEMANDE(), "demande-mal-nommee.md");
    att(echoue(r, "D1"), "D1 ne s'est pas déclenché");
    att(!echoue(r, "D2") && !echoue(r, "D3"), `une autre règle a échoué : ${JSON.stringify(r.constats)}`);
  });
  check("verte D1 — un nom conforme passe, indice avec ou sans lettre", () => {
    att(verifier(DEMANDE(), "produit-demandeur - DEMANDE - 20261002a.md").verdict === "PASS", "indice avec lettre refusé");
    att(verifier(DEMANDE(), "produit-demandeur - DEMANDE - 20261002.md").verdict === "PASS", "indice sans lettre refusé");
  });

  // ---- D2 : la ligne de statut ------------------------------------------------------------
  check("rouge D2 — aucune ligne de statut échoue SEULE", () => {
    const r = verifier(DEMANDE({ statut: "- **Autre** : valeur" }), "produit-demandeur - DEMANDE - 20261002a.md");
    att(echoue(r, "D2"), "D2 ne s'est pas déclenché");
    att(!echoue(r, "D1") && !echoue(r, "D3"), `une autre règle a échoué : ${JSON.stringify(r.constats)}`);
  });
  check("verte D2 — « traitée le <date> » est une valeur reconnue (seule édition admise après dépôt)", () => {
    const r = verifier(DEMANDE({ statut: "- **Statut** : traitée le 02/10/2026" }), "produit-demandeur - DEMANDE - 20261002a.md");
    att(!echoue(r, "D2"), "la forme traitée n'est pas reconnue");
  });

  // ---- D3 : les cinq rubriques -------------------------------------------------------------
  check("rouge D3 — une rubrique ABSENTE échoue, et nomme la rubrique manquante", () => {
    const r = verifier(DEMANDE({ sections: { concerne: false } }), "produit-demandeur - DEMANDE - 20261002a.md");
    att(echoue(r, "D3"), "D3 ne s'est pas déclenché");
    const f = r.constats.find((c) => c.regle === "D3");
    att(/Ce qui concerne ce produit/.test(f.message), `la rubrique manquante n'est pas nommée : ${f.message}`);
  });
  check("rouge D3 — une rubrique VIDE (hors 5e) échoue, distinct d'une rubrique absente", () => {
    const d = DEMANDE();
    const texteVide = d.replace("constaté le 01/10, preuve : fichier journal.jsonl entrée 41", "");
    const r = verifier(texteVide, "produit-demandeur - DEMANDE - 20261002a.md");
    att(echoue(r, "D3"), "D3 ne s'est pas déclenché sur une rubrique vide");
    const f = r.constats.find((c) => c.regle === "D3");
    att(/VIDE/.test(f.message), `le message ne distingue pas « vide » d'« absente » : ${f.message}`);
  });
  check("rouge D3 — la 5e rubrique VIDE sans la déclaration d'absence échoue", () => {
    const r = verifier(DEMANDE({ borne: "" }), "produit-demandeur - DEMANDE - 20261002a.md");
    att(echoue(r, "D3"), "une 5e rubrique vide sans déclaration devrait échouer");
  });

  // ---- Forme générale ------------------------------------------------------------------
  check("VERSION exportée et stable", () => { att(typeof VERSION === "string" && /^\d+\.\d+\.\d+$/.test(VERSION), `VERSION invalide : ${VERSION}`); });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }

console.log(`\noracle-demande-produit (TF-1522) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
