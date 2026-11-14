#!/usr/bin/env node
/**
 * fusionner-env.mjs — FUSIONNER DEUX FICHIERS D'ENVIRONNEMENT CLÉ PAR CLÉ, JAMAIS FICHIER CONTRE FICHIER
 * (TF-2440, RT-149, décision du pilot sous R-58 du 12/11/2026). Copié chez chaque produit sous
 * `forge\fusionner-env.mjs` (gabarits\HERITAGE.json, copie conforme) ; le même fichier se joue depuis le pilot.
 *
 *   node forge/fusionner-env.mjs fusionner <fichier-du-poste> <copie-du-canal> [--prefere poste|canal] [--ecrire]
 *   node forge/fusionner-env.mjs copier    <source> <destination> [--ecrire]
 *
 * LE FAIT (lot Produit-02 20261112a, RT-149). Le 11/11, une fusion de 11 clés dans le `.env` d'un poste est
 * consignée, avec une sauvegarde Drive à 100 sur 100 identiques. Le 12/11, le poste n'a plus les 11 clés : le `.env`
 * du Drive, daté du 09/11, a écrasé le sien, et le Drive n'avait pas non plus les 3 clés propres au poste. Le jeton
 * du poste était refusé par l'API, celui du Drive accepté : la copie fichier contre fichier avait perdu des clés des
 * deux côtés. Aucune règle ne disait comment fusionner un fichier de secrets entre deux postes.
 *
 * CE QUE FAIT LE GESTE
 *   fusionner  l'UNION des clés des deux fichiers. Une clé d'un seul côté passe de l'autre ; une clé aux deux côtés
 *              avec la MÊME valeur ne change pas ; une clé aux deux côtés avec deux valeurs DIFFÉRENTES est un
 *              conflit que le geste ne tranche pas seul (la date d'un fichier ne dit pas quel jeton l'API accepte :
 *              le 12/11, le plus récent était le refusé) — sans `--prefere`, il refuse et nomme les clés.
 *              Les deux fichiers reçoivent le même texte. Les commentaires, l'ordre, `export` et les fins de ligne
 *              du fichier du poste restent tels quels ; les clés venues du canal s'ajoutent à la fin.
 *   copier     copie un fichier d'environnement sur un autre en REFUSANT toute copie qui ferait perdre une clé à la
 *              destination (une clé que la source n'a pas) ; le remède est `fusionner`, joué par la fixture.
 *   Sans `--ecrire`, rien n'est écrit : le geste dit ce qu'il ferait (à blanc par défaut, loi n° 8).
 *
 * JAMAIS UNE VALEUR : la sortie, les messages d'erreur et le compte rendu ne portent que des NOMS de clés et des
 * comptes. Une ligne mal formée se désigne par son numéro.
 *
 * GARDE-FOUS, avant d'écrire quoi que ce soit :
 *   · le pilot ne porte aucun `.env` : un fichier sous un dossier qui porte gabarits/HERITAGE.json est refusé ;
 *   · le fichier du POSTE (et la destination d'une copie) doit être IGNORÉ par git quand il vit dans un dépôt git,
 *     comme pour ranger-secret.mjs : fusionner y ajoute des secrets, et un fichier que `git add .` embarque est à
 *     un commit de l'histoire ;
 *   · avant chaque écriture, le texte à écrire est confronté au fichier actuel : s'il lui ôtait une clé, REFUS
 *     (aucun chemin du geste ne l'y conduit, la garde est le filet) ; l'écriture passe par un fichier temporaire
 *     voisin (droits 0600), renommé ensuite.
 *
 * Sortie : une ligne JSON ; exit 0 = fait (ou dit à blanc), 1 = refus, 2 = usage.
 *
 * NON JUGÉ, et c'est dit :
 *   · une valeur qui change de forme sans changer de sens (`A=x` et `A="x"`) est TENUE POUR ÉGALE ; une valeur qui
 *     diffère par un commentaire en fin de ligne est tenue pour DIFFÉRENTE ;
 *   · une clé écrite deux fois dans un même fichier : la dernière compte (règle des chargeurs usuels), les autres
 *     lignes restent en place ;
 *   · les commentaires du fichier du canal ne sont repris que lorsqu'ils précèdent immédiatement une clé ajoutée ;
 *   · une clé SUPPRIMÉE volontairement sur un poste revient depuis l'autre : une suppression ne se propage pas ;
 *   · un secret déjà publié ou COMMITTÉ : le geste ne réécrit pas l'histoire, la rotation reste à l'humain ;
 *   · le canal lui-même (`forge\REPRISE.json`) ne porte jamais un secret (R-64) : ce geste sert à la sauvegarde
 *     que le propriétaire des postes fait de ses propres fichiers, il n'ouvre pas le canal de reprise aux secrets.
 * Recette : scripts\fusionner-env.test.mjs. Aucun hachage : les comparaisons sont des comparaisons d'octets.
 */
import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.0.0";

const LIGNE_CLE = /^(\s*export\s+)?([A-Za-z_][A-Za-z0-9_.-]*)\s*=(.*)$/;
const sansGuillemets = (v) => { const t = v.trim(); return /^(["']).*\1$/.test(t) && t.length >= 2 ? t.slice(1, -1) : t; };

/** Lit un texte de fichier d'environnement : lignes, fins de ligne, clés (la dernière occurrence compte). */
export function analyser(texte) {
  const crlf = (texte.match(/\r\n/g) || []).length;
  const lf = (texte.match(/(?<!\r)\n/g) || []).length;
  const eol = crlf > lf ? "\r\n" : "\n";
  const brutes = texte === "" ? [] : texte.split(/\r?\n/);
  if (brutes.length && brutes[brutes.length - 1] === "") brutes.pop();
  const lignes = brutes.map((brut, i) => {
    const m = LIGNE_CLE.exec(brut);
    return m ? { i, brut, nom: m[2], valeur: sansGuillemets(m[3]) } : { i, brut };
  });
  const cles = new Map();
  for (const l of lignes) if (l.nom) cles.set(l.nom, l);
  return { eol, lignes, cles };
}

/** Les noms de clés que `ancien` porte et que `nouveau` n'a pas : ce qu'un remplacement de l'un par l'autre perdrait. */
export function clesPerdues(ancien, nouveau) {
  const n = analyser(nouveau).cles;
  return [...analyser(ancien).cles.keys()].filter((k) => !n.has(k));
}

/**
 * Union clé par clé. Rend { texte, ajoutees_au_poste, ajoutees_au_canal, conflits, ... } ou { refus, conflits }
 * quand deux valeurs diffèrent sans préférence. Ne rend jamais une valeur dans ses champs de compte rendu.
 */
export function fusionner(poste, canal, { prefere = null } = {}) {
  const A = analyser(poste), B = analyser(canal);
  const conflits = [...A.cles.keys()].filter((k) => B.cles.has(k) && A.cles.get(k).valeur !== B.cles.get(k).valeur);
  const ajoutees_au_poste = [...B.cles.keys()].filter((k) => !A.cles.has(k));
  const ajoutees_au_canal = [...A.cles.keys()].filter((k) => !B.cles.has(k));
  const compte = { ajoutees_au_poste, ajoutees_au_canal, conflits, prefere };
  if (conflits.length && !prefere)
    return { refus: `${conflits.length} clé(s) portent deux valeurs différentes (${conflits.join(", ")}) : le geste ne tranche pas seul — rejouer avec --prefere poste ou --prefere canal`, ...compte };
  const sortie = [];
  for (const l of A.lignes) {
    const garde = l.nom && prefere === "canal" && conflits.includes(l.nom) && A.cles.get(l.nom) === l;
    sortie.push(garde ? B.cles.get(l.nom).brut : l.brut);
  }
  const lignesB = B.lignes;
  for (const nom of ajoutees_au_poste) {
    const l = B.cles.get(nom);
    let debut = l.i;
    while (debut > 0 && lignesB[debut - 1].nom === undefined && lignesB[debut - 1].brut.trim().startsWith("#")) debut--;
    for (let j = debut; j <= l.i; j++) sortie.push(lignesB[j].brut);
  }
  const eol = A.lignes.length ? A.eol : B.eol;
  const texte = sortie.length ? sortie.join(eol) + eol : "";
  return { texte, cles: new Set([...A.cles.keys(), ...B.cles.keys()]).size, ...compte };
}

// ---- le pilot ne porte aucun .env ; git ignore le fichier du poste ----
export function dansLePilot(chemin) {
  for (let d = resolve(dirname(chemin)); ; d = dirname(d)) {
    if (existsSync(join(d, "gabarits", "HERITAGE.json"))) return true;
    if (dirname(d) === d) return false;
  }
}

/** null = pas de dépôt git ou fichier ignoré ; sinon le motif du refus. */
export function refusGit(chemin) {
  const env = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
  const cwd = dirname(resolve(chemin));
  if (!existsSync(cwd)) return null;
  const dedans = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd, env, encoding: "utf8" });
  if (dedans.error || dedans.status !== 0 || dedans.stdout.trim() !== "true") return null;
  const ign = spawnSync("git", ["check-ignore", "-q", "--", basename(chemin)], { cwd, env, encoding: "utf8" });
  if (ign.status === 0) return null;
  return `${basename(chemin)} n'est PAS ignoré par git : y mettre des secrets, c'est être à un commit de l'histoire. Ajouter le motif au .gitignore du produit (gabarits/gitignore-produit du pilot porte .env et .env.*), puis rejouer`;
}

function ecrireSansPerdre(chemin, texte) {
  const avant = existsSync(chemin) ? readFileSync(chemin, "utf8") : "";
  const perdues = clesPerdues(avant, texte);
  if (perdues.length) return { refus: `l'écriture de ${basename(chemin)} lui ôterait ${perdues.length} clé(s) (${perdues.join(", ")}) : rien n'est écrit` };
  const temporaire = `${chemin}.${process.pid}.tmp`;
  try { writeFileSync(temporaire, texte, { encoding: "utf8", mode: 0o600 }); renameSync(temporaire, chemin); }
  catch (e) { try { unlinkSync(temporaire); } catch { /* absent */ } return { refus: `écriture de ${basename(chemin)} impossible (${e.code || "erreur"}) : rien n'est écrit` }; }
  return { ecrit: true };
}

// ---- CLI ----
const USAGE = "node forge/fusionner-env.mjs fusionner <fichier-du-poste> <copie-du-canal> [--prefere poste|canal] [--ecrire]  |  copier <source> <destination> [--ecrire]";
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const sortie = (o, code) => { console.log(JSON.stringify({ outil: "fusionner-env", version: VERSION, ...o })); process.exit(code); };
  const refus = (message, plus = {}) => sortie({ verdict: "REFUS", message, ...plus }, 1);
  const iPref = args.indexOf("--prefere");
  const prefere = iPref >= 0 ? args[iPref + 1] : null;
  const pos = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--prefere");
  const verbe = pos[0];
  const ecrire = args.includes("--ecrire");
  if (args.includes("--aide") || args.includes("--help") || !["fusionner", "copier"].includes(verbe) || pos.length !== 3
    || args.some((a) => a.startsWith("--") && !["--ecrire", "--prefere", "--aide", "--help"].includes(a))
    || (iPref >= 0 && !["poste", "canal"].includes(prefere)) || (iPref >= 0 && verbe !== "fusionner"))
    sortie({ usage: USAGE }, 2);
  const [a, b] = [resolve(pos[1]), resolve(pos[2])];
  for (const f of [a, b]) if (dansLePilot(f)) refus(`${basename(f)} est sous le pilot : le pilot ne porte aucun fichier d'environnement (.env jamais transmis)`);
  if (!existsSync(a)) refus(`${basename(a)} n'existe pas (${verbe === "copier" ? "la source" : "le fichier du poste"}) : rien n'est fait`);
  const lire = (f) => (existsSync(f) ? readFileSync(f, "utf8") : "");

  if (verbe === "fusionner") {
    const r = fusionner(lire(a), lire(b), { prefere });
    const compte = { ajoutees_au_poste: r.ajoutees_au_poste, ajoutees_au_canal: r.ajoutees_au_canal, conflits: r.conflits, prefere };
    if (r.refus) refus(r.refus, compte);
    const g = refusGit(a); if (g) refus(g, compte);
    const aEcrire = [a, b].filter((f) => lire(f) !== r.texte);
    if (!ecrire) sortie({ verdict: "A_BLANC", cles: r.cles, ...compte, a_ecrire: aEcrire.map((f) => (f === a ? "poste" : "canal")), message: "rien n'est écrit sans --ecrire" }, 0);
    for (const f of aEcrire) { const e = ecrireSansPerdre(f, r.texte); if (e.refus) refus(e.refus, compte); }
    sortie({ verdict: "FUSIONNE", cles: r.cles, ...compte, ecrits: aEcrire.length, identiques: lire(a) === lire(b) }, 0);
  }

  // copier <source> <destination>
  const perdues = clesPerdues(lire(b), lire(a));
  if (perdues.length) refus(`cette copie ferait perdre ${perdues.length} clé(s) à ${basename(b)} (${perdues.join(", ")}) : fusionner d'abord (node forge/fusionner-env.mjs fusionner <poste> <canal> --ecrire)`, { cles_perdues: perdues });
  const g = refusGit(b); if (g) refus(g);
  if (!ecrire) sortie({ verdict: "A_BLANC", message: "rien n'est écrit sans --ecrire" }, 0);
  const e = ecrireSansPerdre(b, lire(a)); if (e.refus) refus(e.refus);
  sortie({ verdict: "COPIE", cles: analyser(lire(a)).cles.size }, 0);
}
