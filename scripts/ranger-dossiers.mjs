#!/usr/bin/env node
/**
 * ranger-dossiers.mjs — classe les gros dossiers d'input\ et d'output\ en sous-dossiers.
 *
 * Pourquoi il existe (16/10/2026, demande humaine « classer, organiser, ranger les fichiers à
 * l'intérieur dans de nouveaux sous-dossiers pour s'y retrouver »). Mesuré ce jour : 742 fichiers
 * dans `input\00-retours\old\`, 333 dans `output\04-plans\`, 111 dans `output\03-etudes\`. Un dossier
 * de cette taille ne se lit plus ; on y cherche par nom, jamais en le parcourant.
 *
 * Classement :
 *   input/00-retours/old/<émetteur>/   le préfixe du lot (« Produit-64 », « digit-ai-forge-agents ») —
 *                                      la convention de remise dit déjà que le préfixe dit qui retourne
 *                                      quoi ; les dépôts d'insatisfaction vont sous `INSATISFACTION\`.
 *   input/01-candidatures/old/AAAA-MM/ le mois porté par le nom ; sans date lisible : `sans-date\`.
 *   output/03-etudes, 06-travaux-confies → AAAA-MM/ pour les MOIS CLOS seulement.
 *
 * `output\04-plans\` reste À PLAT, et c'est mesuré : ses noms de synthèse sont longs, et le préfixe
 * `AAAA-MM\` (8 caractères) faisait passer 51 chemins de plus au-dessus du plafond de R-4 (alinéa
 * TF-1015 : chemin + sidecar d'oracle ≤ 150, sans quoi le dépôt ne se clone plus sous MAX_PATH) ;
 * un préfixe `MM\` en faisait encore passer 17. Le classer est un arbitrage avec cette règle, pas un
 * rangement : il revient à l'humain.
 *
 * Pourquoi le mois en cours reste à la racine d'output : c'est là qu'écrivent les producteurs
 * (`gabarits\RESTITUTION.md`, hooks), et `scripts\allouer-indice.mjs` ne lit qu'un dossier pour
 * choisir l'indice du jour. Un mois clos ne reçoit plus de livrable : le ranger ne coûte rien à
 * l'allocation. R-7 bis d'`oracle-conformite-projet` compare les versions d'un radical par FAMILLE
 * (le sous-dossier de mois est retiré de la clé) : le classement n'éteint aucune détection.
 *
 * Un fichier et ses compagnons (`.jugement.json`, `.oracles*.json`) portent le même nom de base :
 * ils partent ensemble, parce que la même règle les classe. Les caches suivis sous `.oracles\<chemin
 * du livrable>.oracles-*` sont indexés par le CHEMIN : ils suivent leur livrable, sinon orphelins. Rien n'est écrasé : une collision arrête
 * tout avant le premier geste. Les fichiers non suivis par git ne bougent pas.
 *
 * Usage : node scripts/ranger-dossiers.mjs [--sec] [--mois-courant AAAA-MM] [--sortie <correspondance.json>]
 *   --sec : dit ce qui serait déplacé, ne déplace rien.
 * Sortie : une ligne par dossier ; avec --sortie, la table {ancien: nouveau} en chemins posix.
 * Exit : 0 fait (ou rien à faire) · 1 collision ou erreur.
 */
import { readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const args = process.argv.slice(2);
const valeur = (o) => { const i = args.indexOf(o); return i >= 0 ? args[i + 1] : null; };
const SEC = args.includes("--sec");
const maintenant = new Date();
const MOIS_COURANT = valeur("--mois-courant")
  || `${maintenant.getFullYear()}-${String(maintenant.getMonth() + 1).padStart(2, "0")}`;

const SPECIAUX = new Set(["README.md", "LISEZMOI.md"]);
const MOIS = /^\d{4}-\d{2}$/;

/** Le mois AAAA-MM porté par un nom : « … - AAAAMMJJ<i>… » ou « AAAAMMJJ-… » ou « …-AAAAMMJJ<i>… ». */
export function moisDuNom(nom) {
  const m = / - (20\d{2})(\d{2})\d{2}[a-z]?[.\s]/.exec(nom) || /^(20\d{2})(\d{2})\d{2}-/.exec(nom)
    || /-(20\d{2})(\d{2})\d{2}[a-z]?\./.exec(nom);
  return m ? `${m[1]}-${m[2]}` : null;
}

/** L'émetteur d'un fichier de la boîte des retours : le préfixe avant « - RETOURS », « - CANDIDATURE »… */
export function emetteurDuNom(nom) {
  if (/^INSATISFACTION - /i.test(nom)) return "INSATISFACTION";
  // RETOURS-FORGES*.md : lots antérieurs à la convention de préfixe (input\LISEZMOI.md, 13/08).
  if (/^RETOURS-/i.test(nom)) return "historiques-sans-prefixe";
  const m = /^(.+?) - (RETOURS|CANDIDATURE|TRAVAUX)\b/.exec(nom) || /^(.+?) - /.exec(nom);
  if (m) return m[1].trim();
  return "sans-emetteur";
}

/** Les règles : dossier → fonction (nom) → sous-dossier ou null (le fichier reste). */
export const REGLES = {
  "input/00-retours/old": (nom) => emetteurDuNom(nom),
  "input/01-candidatures/old": (nom) => moisDuNom(nom) || "sans-date",
  "output/03-etudes": (nom) => { const m = moisDuNom(nom); return m && m < MOIS_COURANT ? m : null; },
  "output/06-travaux-confies": (nom) => { const m = moisDuNom(nom); return m && m < MOIS_COURANT ? m : null; },
};

function suivis() {
  return new Set(execFileSync("git", ["-C", RACINE, "ls-files", "input", "output"], { encoding: "utf8" })
    .split("\n").filter(Boolean));
}

export function planifier() {
  const s = suivis();
  const plan = [];
  for (const [dossier, regle] of Object.entries(REGLES)) {
    const d = join(RACINE, dossier);
    if (!existsSync(d)) continue;
    for (const nom of readdirSync(d)) {
      if (SPECIAUX.has(nom) || nom.startsWith(".")) continue;
      if (!statSync(join(d, nom)).isFile()) continue;
      if (!s.has(`${dossier}/${nom}`)) continue;
      const sous = regle(nom);
      if (!sous) continue;
      plan.push({ dossier, nom, ancien: `${dossier}/${nom}`, nouveau: `${dossier}/${sous}/${nom}` });
    }
  }
  // Les caches d'oracle suivis sous `.oracles\` suivent leur livrable (indexés par son chemin).
  const caches = execFileSync("git", ["-C", RACINE, "ls-files", ".oracles"], { encoding: "utf8", maxBuffer: 1 << 26 })
    .split("\n").filter(Boolean);
  for (const p of [...plan]) {
    const tete = `.oracles/${p.ancien}.oracles`;
    for (const c of caches.filter((x) => x.startsWith(tete))) {
      plan.push({ dossier: `.oracles/${p.dossier}`, nom: basename(c), ancien: c, nouveau: `.oracles/${p.nouveau}${c.slice(`.oracles/${p.ancien}`.length)}` });
    }
  }
  return plan;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const plan = planifier();
  const collisions = plan.filter((p) => existsSync(join(RACINE, p.nouveau)));
  if (collisions.length) {
    console.error(`COLLISION : ${collisions.length} fichier(s) existent déjà à destination — rien n'est déplacé`);
    for (const c of collisions.slice(0, 20)) console.error(`  ${c.nouveau}`);
    process.exit(1);
  }
  const parDossier = new Map();
  for (const p of plan) {
    const k = `${p.dossier} → ${p.nouveau.slice(p.dossier.length + 1).split("/")[0]}/`;
    parDossier.set(k, (parDossier.get(k) || 0) + 1);
  }
  for (const [k, n] of [...parDossier.entries()].sort()) console.log(`${String(n).padStart(4)}  ${k}`);
  console.log(`${plan.length} fichier(s) ${SEC ? "à déplacer (à blanc)" : "déplacé(s)"} — mois courant ${MOIS_COURANT}, laissé à la racine d'output`);
  const sortie = valeur("--sortie");
  if (sortie) writeFileSync(sortie, JSON.stringify(Object.fromEntries(plan.map((p) => [p.ancien, p.nouveau])), null, 1) + "\n", "utf8");
  if (SEC) process.exit(0);
  const parCible = new Map();
  for (const p of plan) {
    const cible = dirname(p.nouveau);
    if (!parCible.has(cible)) parCible.set(cible, []);
    parCible.get(cible).push(p.ancien);
  }
  for (const [cible, sources] of parCible) {
    mkdirSync(join(RACINE, cible), { recursive: true });
    for (let i = 0; i < sources.length; i += 40) {
      execFileSync("git", ["-C", RACINE, "mv", "--", ...sources.slice(i, i + 40), `${cible}/`]);
    }
  }
}
