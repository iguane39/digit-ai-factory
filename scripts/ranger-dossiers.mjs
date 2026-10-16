#!/usr/bin/env node
/**
 * ranger-dossiers.mjs — classe les gros dossiers d'input\ et d'output\ en sous-dossiers, et raccourcit
 * le nom des livrables dont un chemin dépasserait le plafond de R-4.
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
 *   output/03-etudes, 04-plans, 06-travaux-confies → AAAA-MM/ pour les MOIS CLOS seulement.
 *
 * LE PLAFOND DE CHEMIN (R-4, alinéa TF-1015 : chemin relatif + 34 caractères de sidecar d'oracle
 * ≤ 150, sans quoi un clone de vérification ne se pose plus sous MAX_PATH). Un sous-dossier de mois
 * ajoute 8 caractères : mesuré le 16/10, 51 synthèses de `04-plans\` passaient au-dessus. Décision
 * humaine « 1b » du 16/10/2026 : classer quand même, et RACCOURCIR le nom des livrables qui risquent
 * de dépasser, ce que la règle prescrit elle-même (« Raccourcir l'<Objet> du nom »). Le script le fait
 * pour tout livrable d'`output\` hors `old\` : les mots vides de l'<Objet> partent d'abord, puis les
 * derniers mots, sans finir sur un nombre ; le radical reste unique dans sa famille (sinon R-7 bis lirait
 * deux versions). Le livrable et ses compagnons (`.jugement.json`, `.boucle.json`, caches `.oracles\`)
 * sont renommés ensemble : un sceau se lit à côté de son livrable, il reste valide. Chaque renommage est
 * consigné à `references\RENOMMAGES-LIVRABLES.jsonl` : les synthèses scellées et le registre, qui ne se
 * réécrivent pas, citent l'ancien nom, et c'est là qu'on le retrouve.
 *
 * Pourquoi le mois en cours reste à la racine d'output : c'est là qu'écrivent les producteurs
 * (`gabarits\RESTITUTION.md`, hooks), et `scripts\allouer-indice.mjs` ne lit qu'un dossier pour
 * choisir l'indice du jour. Un mois clos ne reçoit plus de livrable : le ranger ne coûte rien à
 * l'allocation. R-7 bis d'`oracle-conformite-projet` compare les versions d'un radical par FAMILLE
 * (le sous-dossier de mois est retiré de la clé) : le classement n'éteint aucune détection.
 *
 * Rien n'est écrasé : une collision arrête tout avant le premier geste. Les fichiers non suivis par
 * git ne bougent pas.
 *
 * Usage : node scripts/ranger-dossiers.mjs [--sec] [--mois-courant AAAA-MM] [--sortie <correspondance.json>]
 *   --sec : dit ce qui serait déplacé ou renommé, ne touche à rien.
 * Sortie : une ligne par dossier ; avec --sortie, la table {ancien: nouveau} en chemins posix.
 * Exit : 0 fait (ou rien à faire) · 1 collision ou erreur.
 */
import { readdirSync, statSync, existsSync, writeFileSync, mkdirSync, appendFileSync } from "node:fs";
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
// Mêmes constantes que R-4 (oracles/oracle-conformite-projet.mjs) : le sidecar d'oracle le plus long.
const PLAFOND_CHEMIN = 150, SIDECAR_ORACLE = ".oracles/".length + ".oracles-historique.jsonl".length;
export const JOURNAL = "references/RENOMMAGES-LIVRABLES.jsonl";

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

const moisClos = (nom) => { const m = moisDuNom(nom); return m && m < MOIS_COURANT ? m : null; };

/** Les règles : dossier → fonction (nom) → sous-dossier ou null (le fichier reste). */
export const REGLES = {
  "input/00-retours/old": (nom) => emetteurDuNom(nom),
  "input/01-candidatures/old": (nom) => moisDuNom(nom) || "sans-date",
  "output/03-etudes": moisClos,
  "output/04-plans": moisClos,
  "output/06-travaux-confies": moisClos,
};

const LIVRABLE = /^(.*) - (\d{8}[a-z]?)\.([A-Za-z0-9]+)$/;
// Mots retirés en premier : ils ne portent pas le sens du titre.
const VIDES = new Set(["le", "la", "les", "l", "de", "des", "du", "d", "et", "a", "au", "aux", "en", "sur", "pour",
  "par", "un", "une", "dans", "qui", "que", "ses", "son", "sa", "leur", "leurs", "avec"]);
const NOMBRES = /^(\d+[a-z]?|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|quatorze|quinze|seize|vingt|trente|quarante|premiere?|seconde?)$/i;

/**
 * Raccourcit l'<Objet> d'un radical « <Marque> - <Type> - <Objet> » de `exces` caractères au moins.
 * Rend le radical court, jamais vide.
 */
export function raccourcirRadical(radical, exces) {
  const segs = radical.split(" - ");
  const tete = segs.slice(0, -1).join(" - "), objet = segs[segs.length - 1];
  const budget = objet.length - exces;
  const mots = objet.split(" ");
  for (let k = mots.length - 1; k > 0 && mots.join(" ").length > budget; k--) {
    if (VIDES.has(mots[k].toLowerCase())) mots.splice(k, 1);
  }
  while (mots.length > 1 && mots.join(" ").length > budget) mots.pop();
  let court = mots.join(" ");
  if (court.length > budget) court = court.slice(0, Math.max(budget, 8)).trim();
  const w = court.replace(/,/g, "").split(" ");
  while (w.length > 1 && (VIDES.has(w[w.length - 1].toLowerCase()) || NOMBRES.test(w[w.length - 1]))) w.pop();
  court = w.join(" ");
  return tete ? `${tete} - ${court}` : court;
}

const lister = (pathspec) => execFileSync("git", ["-C", RACINE, "ls-files", pathspec], { encoding: "utf8", maxBuffer: 1 << 26 })
  .split("\n").filter(Boolean);

export function planifier() {
  const s = new Set([...lister("input"), ...lister("output")]);
  const plan = [];
  const cibleDe = new Map(); // chemin suivi → nouveau dossier
  for (const [dossier, regle] of Object.entries(REGLES)) {
    const d = join(RACINE, dossier);
    if (!existsSync(d)) continue;
    for (const nom of readdirSync(d)) {
      if (SPECIAUX.has(nom) || nom.startsWith(".")) continue;
      if (!statSync(join(d, nom)).isFile()) continue;
      if (!s.has(`${dossier}/${nom}`)) continue;
      const sous = regle(nom);
      if (sous) cibleDe.set(`${dossier}/${nom}`, `${dossier}/${sous}`);
    }
  }
  // Le plafond de R-4, jugé à DESTINATION, pour tout livrable d'output\ hors old\, avec ses compagnons.
  const parDossier = new Map();
  for (const p of s) {
    if (!p.startsWith("output/")) continue;
    const i = p.lastIndexOf("/");
    const d = p.slice(0, i);
    if (!parDossier.has(d)) parDossier.set(d, []);
    parDossier.get(d).push(p.slice(i + 1));
  }
  const famille = (d) => d.replace(/\/\d{4}-\d{2}$/, "");
  const radicaux = new Map();
  for (const [d, noms] of parDossier) {
    const f = famille(d);
    if (!radicaux.has(f)) radicaux.set(f, new Set());
    for (const n of noms) { const m = LIVRABLE.exec(n); if (m) radicaux.get(f).add(m[1].toLowerCase()); }
  }
  const nomDe = new Map(); // chemin suivi → nouveau nom
  for (const [d, noms] of parDossier) {
    if (/(^|\/)old(\/|$)/.test(d)) continue;
    for (const L of noms.filter((n) => LIVRABLE.test(n))) {
      const [, radical, indice, ext] = LIVRABLE.exec(L);
      const groupe = [L, ...noms.filter((n) => n !== L && n.startsWith(L + "."))];
      const cible = cibleDe.get(`${d}/${L}`) || d;
      const exces = cible.length + 1 + Math.max(...groupe.map((n) => n.length)) + SIDECAR_ORACLE - PLAFOND_CHEMIN;
      if (exces <= 0) continue;
      let rad = raccourcirRadical(radical, exces);
      const pris = radicaux.get(famille(d));
      if (pris.has(rad.toLowerCase()) && rad.toLowerCase() !== radical.toLowerCase()) rad = `${rad} ${indice.slice(6)}`;
      pris.add(rad.toLowerCase());
      const court = `${rad} - ${indice}.${ext}`;
      for (const n of groupe) {
        nomDe.set(`${d}/${n}`, court + n.slice(L.length));
        if (!cibleDe.has(`${d}/${n}`) && cible !== d) cibleDe.set(`${d}/${n}`, cible);
      }
    }
  }
  for (const p of new Set([...cibleDe.keys(), ...nomDe.keys()])) {
    const i = p.lastIndexOf("/");
    const dossier = p.slice(0, i), nom = p.slice(i + 1);
    const nouveau = `${cibleDe.get(p) || dossier}/${nomDe.get(p) || nom}`;
    if (nouveau !== p) plan.push({ dossier, nom, ancien: p, nouveau, renomme: nomDe.has(p) });
  }
  // Les caches d'oracle suivis sous `.oracles\` suivent leur livrable (indexés par son chemin).
  const caches = lister(".oracles");
  for (const p of [...plan]) {
    const tete = `.oracles/${p.ancien}.oracles`;
    for (const c of caches.filter((x) => x.startsWith(tete))) {
      plan.push({ dossier: `.oracles/${p.dossier}`, nom: basename(c), ancien: c, nouveau: `.oracles/${p.nouveau}${c.slice(`.oracles/${p.ancien}`.length)}`, renomme: p.renomme });
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
  const trop = plan.filter((p) => p.nouveau.startsWith("output/") && p.nouveau.length + SIDECAR_ORACLE > PLAFOND_CHEMIN);
  if (trop.length) {
    console.error(`PLAFOND : ${trop.length} chemin(s) dépasseraient encore ${PLAFOND_CHEMIN} caractères — rien n'est déplacé`);
    for (const c of trop.slice(0, 20)) console.error(`  ${c.nouveau}`);
    process.exit(1);
  }
  const parDossier = new Map();
  for (const p of plan) {
    const k = `${p.dossier} → ${p.nouveau.slice(p.dossier.length + 1).split("/").length > 1 ? p.nouveau.slice(p.dossier.length + 1).split("/")[0] + "/" : "(même dossier)"}`;
    parDossier.set(k, (parDossier.get(k) || 0) + 1);
  }
  for (const [k, n] of [...parDossier.entries()].sort()) console.log(`${String(n).padStart(4)}  ${k}`);
  const renommes = plan.filter((p) => p.renomme);
  console.log(`${plan.length} fichier(s) ${SEC ? "à déplacer (à blanc)" : "déplacé(s)"}, dont ${renommes.length} renommé(s) sous le plafond de R-4 — mois courant ${MOIS_COURANT}, laissé à la racine d'output`);
  const sortie = valeur("--sortie");
  if (sortie) writeFileSync(sortie, JSON.stringify(Object.fromEntries(plan.map((p) => [p.ancien, p.nouveau])), null, 1) + "\n", "utf8");
  if (SEC) process.exit(0);
  const ts = new Date().toISOString();
  for (const p of renommes) {
    mkdirSync(join(RACINE, dirname(p.nouveau)), { recursive: true });
    execFileSync("git", ["-C", RACINE, "mv", "--", p.ancien, p.nouveau]);
    appendFileSync(join(RACINE, JOURNAL), JSON.stringify({ ts, ancien: p.ancien, nouveau: p.nouveau,
      motif: "plafond de chemin R-4 (TF-1015), décision humaine « 1b » du 16/10/2026" }) + "\n", "utf8");
  }
  const parCible = new Map();
  for (const p of plan.filter((x) => !x.renomme)) {
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
