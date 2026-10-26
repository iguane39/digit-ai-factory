#!/usr/bin/env node
/**
 * verifier-carte-forges.mjs — juge la carte des forges `references/CARTE-FORGES.json` (T4, TF-1949, D-69 (a) et D-79 (c) du
 * 26/10/2026). La carte est une donnée datée et sourcée (loi n° 4) : elle se corrige sans toucher au code, et ce juge dit si
 * elle reste lisible par ses consommateurs (l'écrivain des verdicts de mobilisation et le verrou « livré »).
 *
 * Usage : node scripts/verifier-carte-forges.mjs [carte.json]   → verdict JSON ; exit 0 PASS, 1 FAIL, 2 carte absente ou illisible.
 *         node scripts/verifier-carte-forges.mjs --self-test     → la carte réelle et six cartes altérées, dans les deux sens.
 * Règles CF1 à CF5 : `oracles/lib-mobilisation.mjs`, fonction `validerCarte`.
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { CHEMIN_CARTE, FORGES, lireCarte, validerCarte } from "../oracles/lib-mobilisation.mjs";

const NON_JUGE = [
  "la PERTINENCE d'une forge privilégiée pour un type de demande : la carte se recalibre sur les verdicts motivés (mesure du §g du diagnostic 20261026a), pas sur ce juge",
  "qu'un chemin de livrable soit celui qu'un produit emploie vraiment : CF3 vérifie qu'il est relatif au produit, jamais qu'il existe quelque part",
];

function juger(chemin) {
  const { carte, erreur } = lireCarte(chemin);
  if (erreur) return { code: 2, sortie: { outil: "verifier-carte-forges", cible: chemin, verdict: "ERREUR", message: erreur } };
  const findings = validerCarte(carte);
  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  return { code: verdict === "PASS" ? 0 : 1, sortie: { outil: "verifier-carte-forges", cible: chemin, verdict,
    forges: Object.keys(carte.forges || {}).length, types: (carte.types || []).map((t) => t.id), findings, non_juge: NON_JUGE } };
}

function selfTest() {
  const casse = [];
  let cas = 0;
  const attendre = (vrai, defaut) => { cas += 1; if (!vrai) casse.push(defaut); };
  const reelle = lireCarte(CHEMIN_CARTE);
  if (reelle.erreur) { console.log(`SELF-TEST FAIL : ${reelle.erreur}`); process.exit(1); }
  const echoue = (carte, regle) => validerCarte(carte).some((f) => f.regle === regle && f.statut === "FAIL");
  const copie = () => JSON.parse(JSON.stringify(reelle.carte));

  // Sens vert : la carte réelle passe, porte les 13 forges et les 7 types de la carte de départ (consigne de TF-1949).
  const constats = validerCarte(reelle.carte);
  attendre(!constats.some((f) => f.statut === "FAIL"),
    `la carte réelle échoue : ${constats.filter((f) => f.statut === "FAIL").map((f) => `${f.regle} ${f.message}`).join(" | ")}`);
  const ATTENDUS = ["produit-neuf", "evolution", "audit-complet", "site-web", "donnees", "agent", "document"];
  const ids = (reelle.carte.types || []).map((t) => t.id);
  attendre(ATTENDUS.every((t) => ids.includes(t)) && ids.length === 7, `les 7 types de la carte de départ ne sont pas tous là : ${ids.join(", ")}`);
  attendre(FORGES.every((f) => f in (reelle.carte.forges || {})), "la carte réelle ne porte pas les 13 forges");

  // Sens rouge, une altération par règle.
  { const c = copie(); delete c.forges.data; attendre(echoue(c, "CF2"), "CF2 : une carte à 12 forges (sans data) passe"); }
  { const c = copie(); c.forges["forge-inventee"] = { depot: "x", role: "x", livrables: [], motif_sans_livrable: "x" }; attendre(echoue(c, "CF2"), "CF2 : une 14e forge passe"); }
  { const c = copie(); c.types[0].forges_privilegiees = [...c.types[0].forges_privilegiees, "marketing"]; attendre(echoue(c, "CF4"), "CF4 : une forge privilégiée inconnue passe"); }
  { const c = copie(); const t = c.types.find((x) => x.id === "audit-complet"); t.livrables_exiges = { ...t.livrables_exiges, data: ["lineage"] };
    attendre(echoue(c, "CF4"), "CF4 : des livrables exigés pour une forge que le type ne privilégie pas passent"); }
  { const c = copie(); const id = Object.keys(c.livrables)[0]; c.livrables[id].chemins = ["C:\\dev\\produit\\forge\\x.json"]; attendre(echoue(c, "CF3"), "CF3 : un chemin absolu passe"); }
  { const c = copie(); c.livrables["orphelin"] = { libelle: "x", source: "x", chemins: ["forge/x.json"] }; attendre(echoue(c, "CF3"), "CF3 : un livrable exigé nulle part passe"); }
  { const c = copie(); delete c.date; attendre(echoue(c, "CF1"), "CF1 : une carte non datée passe"); }
  { const c = copie(); c.forges.websec.signaux = ["site_vitrine"]; attendre(echoue(c, "CF5"), "CF5 : un signal de profil inconnu passe"); }

  // Carte absente ou illisible : exit 2, jamais un PASS ni un FAIL.
  const dir = mkdtempSync(join(tmpdir(), "carte-forges-"));
  try {
    const r = juger(join(dir, "absente.json"));
    attendre(r.code === 2, `une carte absente rend l'exit ${r.code} au lieu de 2`);
    writeFileSync(join(dir, "illisible.json"), "{ pas du json", "utf8");
    attendre(juger(join(dir, "illisible.json")).code === 2, "une carte illisible ne rend pas l'exit 2");
  } finally { rmSync(dir, { recursive: true, force: true }); }

  console.log(casse.length ? `SELF-TEST FAIL : ${casse.join(" · ")}`
    : `Self-test verifier-carte-forges : ${cas}/${cas} PASS (la carte réelle PASS, avec ses 13 forges et ses 7 types ; 12 forges, 14 forges, forge privilégiée inconnue, `
      + "livrable exigé hors des forges privilégiées, chemin absolu, livrable orphelin, carte non datée, signal inconnu : FAIL sur leur règle ; carte absente ou illisible : exit 2)");
  process.exit(casse.length ? 1 : 0);
}

if (process.argv.includes("--self-test")) selfTest();
else {
  const chemin = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : CHEMIN_CARTE;
  const { code, sortie } = juger(chemin);
  console.log(JSON.stringify(sortie, null, 1));
  process.exit(code);
}
