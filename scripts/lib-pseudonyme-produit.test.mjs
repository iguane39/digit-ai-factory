#!/usr/bin/env node
/**
 * Recette de lib-pseudonyme-produit.mjs — double sens : un nom de client ne sort JAMAIS, un
 * pseudonyme connu est rendu tel quel, un produit inconnu n'est PAS inscrit (l'inscription est
 * le geste de l'ingestion, pas du relevé), un référentiel absent fait LEVER (jamais rendre le nom).
 * Référentiels de test posés dans un répertoire jetable et désignés par les variables d'environnement
 * que lit anonymiser-entrant.mjs — la table réelle du poste n'est ni lue ni étendue par ce banc.
 */
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const T = mkdtempSync(join(tmpdir(), "pseudo-produit-"));
const clients = join(T, "clients.json");
const produits = join(T, "produits.json");
// Forme du référentiel réel (lireClients) : noms + sigles, pseudonymes déclarés par nom — inventés.
writeFileSync(clients, JSON.stringify({ noms: ["Fictilabs"], sigles: ["FLB"], pseudonymes: { Fictilabs: "Client-Z", FLB: "Fournisseur-Z" } }), "utf8");
writeFileSync(produits, JSON.stringify({ produits: { "Produit-01": "Produit-01", "CalculatriceClient-ZSCC": "Produit-04", "portail-fictif": "Produit-07" } }), "utf8");
process.env.FORGE_NOMS_INTERDITS = clients;
process.env.FORGE_PRODUITS_PSEUDO = produits;

const { pseudonymeProduit } = await import("./lib-pseudonyme-produit.mjs");

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };
const cles = () => Object.keys(JSON.parse(readFileSync(produits, "utf8")).produits).length;

try {
  check("un produit connu de la table rend son pseudonyme", () => {
    att(pseudonymeProduit("_Fictilabs/Produit-01") === "Produit-01", "attendu Produit-01");
  });
  check("un nom dont la clé de table est déjà partiellement anonymisée rend le pseudonyme existant", () => {
    att(pseudonymeProduit("_Fictilabs/CalculatriceFictilabsSCC") === "Produit-04", "attendu Produit-04 (clé CalculatriceClient-ZSCC)");
  });
  check("un domaine dont le pseudonyme est déjà dans le texte rend ce pseudonyme seul", () => {
    att(pseudonymeProduit("portail-fictif.com") === "Produit-07", "attendu Produit-07");
  });
  check("un produit inconnu rend son nom anonymisé et N'EST PAS inscrit dans la table", () => {
    const avant = cles();
    const r = pseudonymeProduit("_Fictilabs/Sous/nouveau-produit-fictif");
    att(r === "nouveau-produit-fictif", `reçu ${r}`);
    att(cles() === avant, `la table ne doit pas s'étendre au relevé : ${avant} → ${cles()} clés`);
  });
  check("le nom du client ne figure JAMAIS dans ce qui est rendu (nom, sigle)", () => {
    const r = pseudonymeProduit("_Fictilabs/COMPTA-facture-FLB");
    att(!/Fictilabs|FLB/.test(r), `nom réel rendu : ${r}`);
    att(r === "COMPTA-facture-Fournisseur-Z", `reçu ${r}`);
  });
  check("le nom du client dans un segment PARENT du chemin ne sort pas non plus", () => {
    const r = pseudonymeProduit("_Fictilabs/Fictilabs-outil");
    att(r === "Client-Z-outil", `reçu ${r}`);
  });
  check("un référentiel absent fait LEVER — l'appelant ne journalise pas", () => {
    process.env.FORGE_NOMS_INTERDITS = join(T, "absent.json");
    let leve = false;
    try { pseudonymeProduit("_Fictilabs/Produit-01"); } catch { leve = true; }
    process.env.FORGE_NOMS_INTERDITS = clients;
    att(leve, "aucune exception levée sans référentiel des clients");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nlib-pseudonyme-produit (D-1 a, 03/09) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
