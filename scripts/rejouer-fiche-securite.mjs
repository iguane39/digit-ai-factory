#!/usr/bin/env node
/**
 * rejouer-fiche-securite.mjs — le pas exécutable de la porte M qui rejoue FS12 avec l'étiquette
 * DÉPLOYÉE et en consigne le verdict au dossier de MEP (M-24, ETAPE-MEP.md § 3 quaterdecies ;
 * TF-2419, TF-2536, TF-2572).
 *
 * LE FAIT. Le 10/11/2026, la fiche CDC-SEC-HPR-20261104a citait v1.10.0 alors que v1.13.0 était
 * qualifiée et servie : 16 champs sur 29 ont changé à la réémission. TF-2536 a posé la prescription
 * (M-24) et son contrôle au dossier (TM18 d'`oracle-trace-mutation-mep.mjs`) ; la chaîne restait
 * écrite : rien ne jouait `verifier-fiche-securite.mjs --etiquette-deployee`, et rien n'écrivait le
 * verdict que TM18 lit. Une règle de forge-audit inerte sans son option, une consigne au dossier que
 * personne ne produit : le pas manquait (constat de l'agent du lot ph du 14/11/2026, rejoué ici).
 *
 * CE QUE FAIT LE PAS. 1) lit l'étiquette déployée (donnée par `--etiquette-deployee`, ou lue par
 * `git describe --tags --abbrev=0 <commit servi>` dans le dépôt du produit, comme M-24 le prescrit) ;
 * 2) joue `<audit>\oracles\verifier-fiche-securite.mjs <fiche.html> --etiquette-deployee <x.y.z>` ;
 * 3) écrit le verdict de FS12 dans la section « Fiche de sécurité » du dossier de MEP, au format de
 * M-24, AJOUTÉ à la section (un FAIL suivi d'un rejeu PASS se lit au dernier verdict, TM18).
 * Le pas ne juge que FS12 : les autres règles de la fiche (FS1 à FS11) sont celles de forge-audit,
 * rejouées à sa propre porte ; leur verdict d'ensemble est rendu à l'écran, jamais recopié au dossier.
 *
 * Usage : node scripts/rejouer-fiche-securite.mjs <fiche.html> --dossier <DOSSIER-MEP.md>
 *           (--etiquette-deployee <x.y.z> | --commit-servi <sha> --depot <produit>)
 *           [--audit <dépôt forge-audit>] [--sans-pdf]
 * Sortie : JSON · exit 0 = FS12 PASS, consigné · 1 = FS12 FAIL, consigné (la fiche se réémet, puis
 *          le pas se rejoue) · 2 = FS12 SKIP consigné (la fiche ne cite aucune version), ou pas
 *          jouable (option manquante, dossier, fiche ou forge-audit introuvable) : rien n'est écrit.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const TITRE_SECTION = "## Fiche de sécurité";
const REFERENCE_FICHE = /\b[A-Z0-9]{2,}-SEC-(?:DEV|HPR|PRD)-\d{8}[a-z]?\b/;
const VERSION = /^v?\d+\.\d+\.\d+$/;

const rendre = (code, objet) => { process.stdout.write(JSON.stringify({ outil: "rejouer-fiche-securite", ...objet }) + "\n"); process.exit(code); };
const nonJouable = (message) => rendre(2, { verdict: "NON_JOUABLE", message });

const args = process.argv.slice(2);
const option = (nom) => {
  const i = args.indexOf(nom);
  if (i === -1) return null;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) nonJouable(`l'option ${nom} attend une valeur`);
  return v;
};
const OPTIONS_A_VALEUR = ["--dossier", "--etiquette-deployee", "--commit-servi", "--depot", "--audit"];
const fiche = args.find((a, i) => !a.startsWith("--") && !OPTIONS_A_VALEUR.includes(args[i - 1]));
const dossier = option("--dossier");
let etiquette = option("--etiquette-deployee");
const commitServi = option("--commit-servi");
const depot = option("--depot");
const sansPdf = args.includes("--sans-pdf");

if (!fiche || !existsSync(fiche)) nonJouable(fiche ? `fiche introuvable : ${fiche}` : "aucune fiche .html donnée — rien à rejouer");
if (!dossier || !existsSync(dossier)) nonJouable(dossier ? `dossier de MEP introuvable : ${dossier} (le pas consigne dans un dossier existant, il n'en crée pas)` : "--dossier <DOSSIER-MEP.md> est dû : le pas consigne le verdict au dossier");

if (etiquette === null) {
  if (!commitServi || !depot) nonJouable("l'étiquette déployée est due : --etiquette-deployee <x.y.z>, ou --commit-servi <sha> avec --depot <produit> (la dernière étiquette du commit servi lu à M-22)");
  const g = spawnSync("git", ["-C", depot, "describe", "--tags", "--abbrev=0", commitServi], { encoding: "utf8" });
  etiquette = (g.stdout || "").trim();
  if (g.status !== 0 || !etiquette) nonJouable(`aucune étiquette ne précède le commit servi ${commitServi} dans ${depot} : ${(g.stderr || "").trim().slice(0, 160)}`);
}
if (!VERSION.test(etiquette)) nonJouable(`l'étiquette déployée « ${etiquette} » n'est pas une version x.y.z (« v1.13.0 » ou « 1.13.0 »)`);

// forge-audit : donné par --audit, sinon la racine du parc (FORGE_ROOT, à défaut le dossier voisin de ce dépôt).
const racineParc = process.env.FORGE_ROOT || join(ICI, "..", "..");
const audit = resolve(option("--audit") || join(racineParc, "digit-ai-forge-audit"));
const oracleAudit = join(audit, "oracles", "verifier-fiche-securite.mjs");
if (!existsSync(oracleAudit)) nonJouable(`forge-audit introuvable : ${oracleAudit} (--audit <dépôt>, ou FORGE_ROOT)`);

const r = spawnSync(process.execPath, [oracleAudit, fiche, "--etiquette-deployee", etiquette, "--json-only", ...(sansPdf ? ["--sans-pdf"] : [])], { encoding: "utf8" });
let rapport = null;
try { rapport = JSON.parse(r.stdout); } catch { /* sortie illisible, dite plus bas */ }
if (!rapport) nonJouable(`la sortie de forge-audit ne se lit pas (exit ${r.status}) : ${(r.stdout + r.stderr).trim().slice(0, 200)}`);
const fs12 = (rapport.findings || []).find((f) => f.regle === "FS12");
if (!fs12 || !["PASS", "FAIL", "SKIP"].includes(fs12.statut)) nonJouable("FS12 n'a pas été jouée par forge-audit : aucun verdict à consigner (l'oracle de forge-audit est-il antérieur à TF-2419 ?)");

// Le verdict s'écrit sur UNE ligne, « FS12 : <verdict> » en tête : TM18 lit le premier mot de verdict qui suit FS12.
const aujourdhui = new Date().toISOString().slice(0, 10);
const reference = (readFileSync(fiche, "utf8").match(REFERENCE_FICHE) || [null])[0];
const motif = String(fs12.message || "").replace(/\s+/g, " ").trim().slice(0, 220);
const ligne = `FS12 : ${fs12.statut} (${motif}) — étiquette déployée ${etiquette.replace(/^v/, "")}, rejoué le ${aujourdhui}.`;

const texte = readFileSync(dossier, "utf8");
const nl = texte.includes("\r\n") ? "\r\n" : "\n";
const lignes = texte.split(/\r?\n/);
const debut = lignes.findIndex((l) => l.trim() === TITRE_SECTION);
let ecrit;
if (debut === -1) {
  const intro = `Fiche ${reference || "de sécurité"} remise au référent sécurité.`;
  ecrit = texte.replace(/\s*$/, "") + `${nl}${nl}${TITRE_SECTION}${nl}${nl}${intro}${nl}${ligne}${nl}`;
} else {
  let fin = lignes.findIndex((l, i) => i > debut && /^#{1,2}\s/.test(l));
  if (fin === -1) fin = lignes.length;
  while (fin > debut + 1 && lignes[fin - 1].trim() === "") fin--;       // le verdict suit la dernière ligne de la section, pas les blancs qui précèdent le titre suivant
  lignes.splice(fin, 0, ligne);
  ecrit = lignes.join(nl);
}
writeFileSync(dossier, ecrit, "utf8");

rendre(fs12.statut === "PASS" ? 0 : fs12.statut === "FAIL" ? 1 : 2, {
  verdict: fs12.statut, regle: "FS12 (forge-audit, TF-2419) · M-24 (ETAPE-MEP.md § 3 quaterdecies)", etiquette_deployee: etiquette,
  fiche: resolve(fiche), dossier: resolve(dossier), ligne_consignee: ligne, verdict_fiche_entiere: rapport.verdict,
  non_juge: ["FS1 à FS11 : la forme de la fiche est jugée à la porte de forge-audit, non recopiée au dossier ; seul FS12 est consigné", "la VÉRACITÉ de l'étiquette donnée : elle est lue, pas rejouée contre l'environnement (M-22 lit le commit servi)"],
});
