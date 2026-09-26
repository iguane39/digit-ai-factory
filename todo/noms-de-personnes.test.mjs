#!/usr/bin/env node
/**
 * noms-de-personnes.test.mjs — les formes qui nomment une personne sont relevées, les autres non
 * (TF-1357, 26/09/2026). Noms INVENTÉS. Joué par `oracles\self-tests.mjs` (I2).
 */
import { relever, aQualifier, messageAQualifier } from "./noms-de-personnes.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const attend = (texte, formes) => {
  const r = relever(texte);
  if (JSON.stringify(r) !== JSON.stringify(formes)) throw new Error(`relevé ${JSON.stringify(r)}, attendu ${JSON.stringify(formes)}`);
};

check("rouge — « Prénom NOM » d'un tiers est relevé (le cas du 24/09)", () => attend("Le contrôle croisé a été mené par Maëlle KERGUELEN le 23/09.", ["Maëlle KERGUELEN"]));
check("rouge — prénom composé et nom composé", () => attend("Relu par Jean-Luc LE-BIHAN.", ["Jean-Luc LE-BIHAN"]));
check("rouge — une civilité suivie d'un nom", () => attend("Mme Tartempion a validé ; M. Bidule aussi.", ["Mme Tartempion", "M. Bidule"]));
check("rouge — une adresse électronique personnelle", () => attend("Écrire à maelle.kerguelen@entreprise-fictive.fr pour relire.", ["maelle.kerguelen@entreprise-fictive.fr"]));
check("vert — les sigles du parc ne sont pas des noms (« voir README », « statut PASS », « format JSON »)", () => attend("Voir README, statut PASS, format JSON, balises HTML et Google Ads.", []));
check("vert — un sigle de deux lettres n'est pas un nom (« Entra ID »)", () => attend("L'annuaire Microsoft Entra ID répond.", []));
check("vert — adresses de documentation et de service ignorées", () => attend("recette@exemple.invalid, a@example.com, noreply@anthropic.com", []));
check("borne déclarée — « Prénom Nom » sans capitales au nom n'est PAS relevé (limite écrite au module)", () => attend("Le contrôle a été mené par Maëlle Kerguelen.", []));
check("le message nomme les formes et le geste, et se tait quand il n'y a rien", () => {
  const f = aQualifier(["Produit-02 - RETOURS - 20260926a.md", "mené par Maëlle KERGUELEN"]);
  const m = messageAQualifier(f, "lot");
  if (!/NOMS DE PERSONNES/.test(m) || !/Maëlle KERGUELEN/.test(m) || !/TF-1357/.test(m)) throw new Error(m);
  if (messageAQualifier([], "lot") !== null) throw new Error("un message sans forme n'est pas nul");
});

console.log(`\nnoms-de-personnes (TF-1357) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
