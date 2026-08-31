#!/usr/bin/env node
/**
 * verifier-rendu-instances.mjs — UN CONTRÔLE STATIQUE NE REND PAS LA PAGE (23/08/2026).
 *
 * LE FAIT QUI IMPOSE CE CONTRÔLE, et il date du jour même. Deux instances de gabarit ont été
 * livrées le matin, vertes au contrôle de MARQUAGE (`check_html.py`), et elles échouaient au
 * contrôle de RENDU — trois causes distinctes découvertes en une seule exécution :
 *   · 13 constats de contraste : la ligne pédagogique rendait 2,48:1 là où il faut 4,5:1. LA
 *     LIGNE QUI EXPLIQUE ÉTAIT ILLISIBLE ;
 *   · 1 bloquant de largeur : la mesure de lecture était posée sur le PARAGRAPHE, l'anti-pattern
 *     que la règle L2 refuse depuis TF-0440 ;
 *   · 4 chevauchements : les nœuds du schéma n'avaient pas le `<title>` que leur propre
 *     commentaire promettait.
 *
 * Aucune de ces trois causes n'est visible sans rendre la page. La règle générique en sort seule :
 * UN LIVRABLE HTML N'EST DÉCLARÉ CONFORME QU'APRÈS LES DEUX CONTRÔLES — le marquage et le rendu.
 * Ce script joue le second sur les instances de référence du pilot, à chaque recette.
 *
 * SKIP MOTIVÉ, JAMAIS PASS SILENCIEUX : sans python ou sans le socle installé, le contrôle dit
 * qu'il n'a pas tourné. Un vert obtenu sans avoir rendu la page serait exactement le mensonge que
 * ce script existe pour empêcher.
 *
 * LE PÉRIMÈTRE N'EST PLUS EN DUR (TF-0695, 28/08/2026). Le fait mesuré chez un produit : ce
 * contrôle ne balayait QUE `gabarits\documents\` du pilot — les instances de RÉFÉRENCE étaient
 * vertes pendant que les livrables réellement REMIS à un lecteur n'étaient jugés par rien. Une
 * fiche lue par un RSSI a été produite et remise trois fois sans qu'aucun contrôle de rendu ne
 * s'exécute dessus, alors que le socle capable de la juger était installé sur le même poste ; le
 * défaut de mise en page a été trouvé par l'œil du commanditaire. Un dossier arbitraire — un
 * `output\` de produit — se passe donc en argument, et le produit peut jouer le contrôle DANS la
 * passe qui produit le livrable, seul moment où le résultat sert à quelque chose.
 *
 * Usage : node scripts/verifier-rendu-instances.mjs [<dossier|fichier.html>] [--largeur 1440] [--json]
 *   sans argument : les INSTANCE.html des familles de `gabarits\documents\` (le catalogue) ;
 *   avec argument : tous les .html du dossier donné, récursivement (`old\`/`Old\` exclus — canal
 *   d'échappement documenté des versions retirées).
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé.
 */
import { existsSync, readdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { tmpdir, homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");
const iL = args.indexOf("--largeur");
const largeur = iL > -1 ? args[iL + 1] : "1440";
// TF-0695 : le premier argument positionnel — ni un drapeau, ni la valeur de `--largeur` — est
// la cible. Sans lui, le contrôle garde son périmètre historique : le catalogue du pilot.
const cible = args.find((a, i) => !a.startsWith("--") && (iL === -1 || i !== iL + 1)) || null;

const SOCLE = join(homedir(), ".claude", "skills", "digit-ai-page-html", "scripts", "render_page.py");
// LA LISTE N'EST PLUS ÉCRITE ICI (choix humain du 23/08, option « source unique ») : elle est LUE
// dans le socle, qui la publie par `--familles`. Une copie locale se serait décalée le jour où une
// famille naît — c'est exactement ce qui a laissé deux familles bloquantes se faire relire en
// avertissement chez forge-design, sans que rien ne le dise.
function familles(python) {
  const r = spawnSync(python, ["-X", "utf8", SOCLE, "--familles"], { encoding: "utf8" });
  try {
    const lu = JSON.parse((r.stdout || "").trim());
    if (lu.schema !== "digit-ai/familles-mesure@1") return null;
    return lu.familles;
  } catch { return null; }
}

const sortir = (verdict, code, findings, motif = null) => {
  console.log(JSON.stringify({ outil: "verifier-rendu-instances", verdict, motif, findings },
    null, jsonOnly ? 0 : 1));
  process.exit(code);
};

if (!existsSync(SOCLE)) {
  sortir("SKIP", 2, [], `socle de rendu introuvable (${SOCLE}) — le contrôle n'a PAS tourné : ` +
    "un vert obtenu sans rendre la page serait le mensonge que ce contrôle existe pour empêcher");
}
const python = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});
if (!python) sortir("SKIP", 2, [], "aucun interpréteur python — le contrôle n'a pas tourné");

// Le socle est la source : s'il ne publie pas sa table, on ne DEVINE pas — on le dit.
const table = familles(python);
if (!table) {
  sortir("SKIP", 2, [], "le socle ne publie pas sa table de familles (`--familles`) — sans elle, " +
    "juger reviendrait à recopier une liste, c'est-à-dire à recréer la double vérité que ce " +
    "contrôle vient de supprimer");
}
const BLOQUANTES = Object.entries(table).filter(([, v]) => v.severite === "bloquant").map(([c]) => c);

// TF-0695 — deux périmètres, un seul juge. Sans cible : les instances de référence du
// catalogue, comme depuis le 23/08. Avec cible : les .html du dossier donné, récursivement —
// c'est la voie par laquelle un LIVRABLE remis à un lecteur passe enfin sous le même contrôle
// que les instances qui lui servent de modèle.
let instances, nomDe;
if (cible) {
  if (!existsSync(cible)) sortir("SKIP", 2, [], `cible introuvable : ${cible} — rien n'a été jugé`);
  if (statSync(cible).isFile()) {
    instances = [cible];
  } else {
    instances = [];
    const marcher = (d) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        // `old\` est le canal d'échappement documenté des versions retirées : les juger ferait
        // crier le contrôle sur des fichiers que plus personne ne diffuse.
        if (e.name.startsWith(".") || e.name === "node_modules" || e.name.toLowerCase() === "old") continue;
        const c = join(d, e.name);
        if (e.isDirectory()) marcher(c);
        else if (/\.html?$/i.test(e.name)) instances.push(c);
      }
    };
    marcher(cible);
  }
  if (!instances.length) sortir("SKIP", 2, [], `aucun .html sous ${cible} — rien à rendre`);
  nomDe = (f) => (statSync(cible).isFile() ? f : relative(cible, f)) || f;
} else {
  const dossier = join(PILOT, "gabarits", "documents");
  if (!existsSync(dossier)) sortir("SKIP", 2, [], `${dossier} absent — aucune instance à rendre`);
  instances = readdirSync(dossier, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(dossier, e.name, "INSTANCE.html"))
    .filter((f) => existsSync(f));
  if (!instances.length) sortir("SKIP", 2, [], "aucune INSTANCE.html sous gabarits/documents/");
  nomDe = (f) => `${f.split(/[\\/]/).slice(-2, -1)[0]}/INSTANCE.html`;
}

const captures = mkdtempSync(join(tmpdir(), "rendu-instances-"));
const findings = [];
let echecs = 0;
for (const f of instances) {
  const nom = nomDe(f);
  const r = spawnSync(python, ["-X", "utf8", SOCLE, f, "--widths", largeur, "--output", "json",
    "--out", captures], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  let rapport = null;
  try { rapport = JSON.parse((r.stdout || "").trim()); } catch { /* traité juste après */ }
  if (!rapport) {
    echecs += 1;
    findings.push({ statut: "FAIL", ou: nom, message: "rendu illisible — le contrôle n'a pas pu juger : " +
      (r.stderr || "").split("\n")[0].slice(0, 160) });
    continue;
  }
  const bp = rapport.breakpoints?.[largeur];
  const causes = [];
  for (const famille of BLOQUANTES) {
    const n = (bp?.issues?.[famille] || []).length;
    if (n) causes.push(`${table[famille].libelle} ×${n}`);
  }
  if (causes.length) {
    echecs += 1;
    findings.push({ statut: "FAIL", ou: nom, message: `rendu en défaut à ${largeur}px : ` +
      causes.join(", ") + ". Le contrôle de marquage ne voit AUCUNE de ces causes : " +
      "un livrable n'est conforme qu'après les deux" });
  } else {
    findings.push({ statut: "PASS", ou: nom, message: `rendu propre à ${largeur}px ` +
      `(${BLOQUANTES.length} familles bloquantes vérifiées, lues dans la table du socle)` });
  }
}
rmSync(captures, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
sortir(echecs ? "FAIL" : "PASS", echecs ? 1 : 0, findings,
  `${instances.length} instance(s) rendue(s) à ${largeur}px`);
