#!/usr/bin/env node
/**
 * verifier-verdict-archive.mjs — un verdict ARCHIVÉ vaut-il encore pour l'état PRÉSENT de sa cible ?
 * (TF-1084, part pilot, reste de TF-0579 ; 15/09/2026)
 *
 * LE FAIT. Le 24/08, une porte de MEP est restée rouge six jours et le déploiement a eu lieu quand
 * même (TF-0579). Le correctif, chez forge-ops (3e05e27), archive désormais chaque verdict dans
 * `.ops-journal.jsonl` à côté de sa cible, au format `forge-ops/verdict@1`, avec l'EMPREINTE de ce
 * qui a été jugé. Il laissait ouvert, et le disait : « rien ne CONFRONTE encore un verdict archivé à
 * l'état présent de sa cible ». Un PASS archivé puis cité au dossier de MEP vieillit en silence dès
 * que la cible change — c'est le motif même de TF-0478, dont `--verifier-empreinte` (quality-oracles)
 * est le modèle suivi ici : FRAIS, PÉRIMÉ, ou rien à juger.
 *
 * CE QUI EST JUGÉ : pour chaque cible d'un journal, le DERNIER verdict consigné. Son empreinte
 * (`forge-ops/empreinte@1`) est recalculée comme forge-ops la calcule — texte aux fins de ligne
 * normalisées, binaire brut — par la fonction PARTAGÉE du pilot (`scripts/lib-empreinte.mjs`, E4) ;
 * la forme brute d'avant le 25/08 est acceptée, comme le fait forge-ops (`correspond`). Une cible
 * dossier est confrontée à la LISTE de ses fichiers aussi : un fichier ajouté ou retiré périme.
 *
 * NON JUGÉ : la justesse du verdict ; un verdict sans empreinte (état « non scellé », jamais un
 * défaut) ; les sous-dossiers d'une cible dossier (forge-ops n'en hache aucun).
 *
 * Usage : node scripts/verifier-verdict-archive.mjs <journal.jsonl|dossier> [...]
 * Sortie : JSON · exit 0 = tous frais · 1 = au moins un verdict PÉRIMÉ ou une cible disparue ·
 *          2 = rien à juger (aucun journal, ou aucun verdict scellé).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename, isAbsolute } from "node:path";
import { empreinteFichier, empreinteBinaire } from "./lib-empreinte.mjs";

const cibles = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const NON_JUGE = [
  "la JUSTESSE du verdict archivé : l'outil dit s'il porte encore sur la cible présente, pas s'il était juste",
  "un verdict SANS empreinte : état « non scellé », compté, jamais un défaut",
  "les sous-dossiers d'une cible dossier : forge-ops ne hache que ses fichiers de premier niveau",
];

/** Le haché d'un fichier comme forge-ops l'écrit : texte normalisé LF, binaire brut. */
const estBinaire = (p) => { try { return readFileSync(p).includes(0); } catch { return false; } };
const hacher = (p) => (estBinaire(p) ? empreinteBinaire(p) : empreinteFichier(p));
const correspond = (p, attendu) => hacher(p) === attendu || empreinteBinaire(p) === attendu;

function journaux(chemin) {
  if (!existsSync(chemin)) return [];
  if (statSync(chemin).isFile()) return [chemin];
  const out = [];
  const marcher = (d, prof) => {
    if (prof > 6) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      const c = join(d, e.name);
      if (e.isDirectory()) marcher(c, prof + 1);
      else if (e.name === ".ops-journal.jsonl") out.push(c);
    }
  };
  marcher(chemin, 0);
  return out;
}

/** La cible sur CE poste : le chemin absolu consigné, sinon relue à côté du journal (autre poste). */
function resoudre(cibleConsignee, journal) {
  if (isAbsolute(cibleConsignee) && existsSync(cibleConsignee)) return cibleConsignee;
  const dossier = dirname(journal);
  const fichier = join(dossier, basename(cibleConsignee));
  if (existsSync(fichier) && statSync(fichier).isFile()) return fichier;
  if (basename(cibleConsignee) === basename(dossier)) return dossier;
  return null;
}

const findings = [];
const mesure = { journaux: 0, cibles: 0, frais: 0, perimes: 0, non_scelles: 0, cibles_absentes: 0 };
for (const c of cibles) {
  for (const j of journaux(c)) {
    mesure.journaux++;
    const derniers = new Map();
    for (const l of readFileSync(j, "utf8").split(/\r?\n/)) {
      if (!l.trim()) continue;
      let v; try { v = JSON.parse(l); } catch { continue; }
      if (v.format !== "forge-ops/verdict@1" || !v.cible) continue;
      const avant = derniers.get(v.cible);
      if (!avant || String(v.ts) >= String(avant.ts)) derniers.set(v.cible, v);
    }
    for (const [cibleConsignee, v] of derniers) {
      mesure.cibles++;
      const fichiers = v.empreinte && v.empreinte.fichiers;
      if (!fichiers || typeof fichiers !== "object") { mesure.non_scelles++; continue; }
      const cible = resoudre(cibleConsignee, j);
      if (!cible) {
        mesure.cibles_absentes++;
        findings.push({ regle: "V-2", severite: "majeur", ou: cibleConsignee, message: `verdict ${v.verdict} du ${String(v.ts).slice(0, 19)} : cible INTROUVABLE sur ce poste — un verdict sur une cible disparue ne se cite plus` });
        continue;
      }
      const estDossier = statSync(cible).isDirectory();
      const chemin = (nom) => (estDossier ? join(cible, nom) : cible);
      const modifies = Object.entries(fichiers).filter(([nom, h]) => !existsSync(chemin(nom)) || !correspond(chemin(nom), h)).map(([nom]) => nom);
      const ajoutes = estDossier
        ? readdirSync(cible, { withFileTypes: true }).filter((e) => e.isFile() && e.name !== ".ops-journal.jsonl" && !(e.name in fichiers)).map((e) => e.name)
        : [];
      if (modifies.length || ajoutes.length) {
        mesure.perimes++;
        findings.push({ regle: "V-1", severite: "bloquant", ou: cibleConsignee,
          message: `verdict ${v.verdict} du ${String(v.ts).slice(0, 19)} PÉRIMÉ : la cible a changé depuis — `
            + (modifies.length ? `modifié(s) ou retiré(s) : ${modifies.join(", ")}` : "")
            + (modifies.length && ajoutes.length ? " ; " : "")
            + (ajoutes.length ? `ajouté(s) : ${ajoutes.join(", ")}` : "")
            + ". Rejouer l'oracle avant de citer ce verdict (TF-1084)" });
      } else mesure.frais++;
    }
  }
}

const durs = findings.filter((f) => f.severite === "bloquant" || f.severite === "majeur");
const rienAJuger = mesure.cibles - mesure.non_scelles === 0;
const verdict = durs.length ? "FAIL" : rienAJuger ? "SKIP" : "PASS";
process.stdout.write(JSON.stringify({ outil: "verifier-verdict-archive", version: "1.0.0", cibles, verdict, mesure, findings, non_juge: NON_JUGE }, null, 1) + "\n");
process.exit(durs.length ? 1 : rienAJuger ? 2 : 0);
