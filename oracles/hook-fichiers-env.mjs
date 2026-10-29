#!/usr/bin/env node
/**
 * hook-fichiers-env.mjs — UN FICHIER `.env` NE SE LIT NI NE S'AFFICHE DANS UNE SESSION : la règle « les
 * .env ne transitent jamais » devient un refus de l'outil, pas une phrase (décision humaine D-106 (b) du
 * 29/10/2026, volet pilot).
 *
 * LE FAIT. Le 21/10/2026, une clé d'un `.env` a été affichée en clair dans une session. La règle du pilot
 * existait (« les .env ne transitent jamais », `CLAUDE.md`, gabarit d'agent de campagne) et aucun hook de
 * `oracles\hook-*.mjs` ne l'exécutait : une consigne qu'aucun mécanisme n'exécute décore. Tout ce qu'un
 * outil affiche entre dans la transcription de la session, donc chez le fournisseur du modèle, et y reste.
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur `Read`, `Grep`, `Bash` et `PowerShell`. Il REFUSE (exit 2,
 * motif sur stderr) :
 *   · `Read` d'un chemin dont le nom est `.env`, `.env.local`, `.env.production`, `.env.*` ;
 *   · `Grep` dont le `path` ou le `glob` désigne un tel nom ;
 *   · une commande Bash ou PowerShell qui en affiche le contenu : `cat`, `type`, `Get-Content` (`gc`),
 *     `head`, `tail`, `less`, `more`, `grep` et famille (`rg`, `findstr`), `sed`, `awk`, `Select-String`
 *     (`sls`), et les lecteurs du même ordre (`tac`, `nl`, `xxd`, `od`, `strings`, `base64`, `sort`, `cut`,
 *     `diff`, `bat`…) ; une redirection d'entrée `< .env` ; une copie vers la sortie standard (`cp .env
 *     /dev/stdout`, `copy .env CON`, `dd if=.env`) ; `git show|diff|blame|cat-file|grep` et `git log -p`
 *     sur un `.env` ; `find … -exec cat` ; un `.env` passé par tuyau à un lecteur (`Get-Item .env |
 *     Get-Content`, `find -name .env | xargs cat`) ; un code en ligne (`node -e`, `python -c`, `perl -ne`,
 *     `[IO.File]::ReadAllText`) qui nomme un `.env` ; et les mêmes sous `bash -c`, `powershell -Command`,
 *     `cmd /c`, `$( … )`.
 * Il LAISSE PASSER : `.env.example`, `.env.sample`, `.env.template` (et `.env.local.example`…) ; un nom qui
 * contient « .env » au milieu d'un mot (`.environment.md`, `.envrc`, `dotenv`, `a.env`) ; un dossier nommé
 * `.env` (environnement virtuel : `.env/bin/activate`) ; `git add|check-ignore|ls-files .env`, `ls`, `test`,
 * `rm` ; une recherche DE la chaîne « .env » (`grep -rn "\.env" docs/`) ; et la voie permise, le script
 * `scripts\env-masque.mjs` (valeurs masquées, ou liste des seules clés).
 *
 * LA VOIE PERMISE. Le message de refus nomme `node scripts\env-masque.mjs <fichier>` (chaque valeur remplacée
 * par `********`) et `--cles` (les seules clés). Le script lit le fichier lui-même : la session ne voit que
 * le masqué. Le banc joue ce remède (TF-1013) : la commande proposée passe le hook, et le script ne rend
 * aucune valeur.
 *
 * NON JUGÉ (déclaré) :
 *   · un fichier lu par un script dont le texte n'est pas dans la commande (`node outil.mjs`, `python x.py`) ;
 *     une commande construite par variable ou encodée (`-EncodedCommand`, `base64 -d | sh`) ; un alias ;
 *   · un `Grep` qui vise un DOSSIER sans `glob` : l'outil descend peut-être dans les fichiers cachés et
 *     rendrait la ligne d'un `.env` rencontré — le hook ne sait pas ce que le dossier contient et ne
 *     refuse pas toute recherche de dossier ;
 *   · un `.env` désigné par une sous-expression dont le lecteur ne porte pas le nom (`Get-Content
 *     (Get-ChildItem -Filter .env*)`) ; `xargs -a .env` ; `source .env` suivi d'un `echo "$CLE"` ; `printenv`,
 *     `env`, `set` (variables déjà chargées, pas un fichier) ;
 *   · les autres porteurs de secrets que `.env*` : `.envrc`, `prod.env`, `secrets.json`, fichiers `.pem` ;
 *   · l'écriture (`Write`, `Edit`) : elle exige une lecture préalable, que ce hook refuse.
 *
 * Usage : node oracles\hook-fichiers-env.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 * Jamais de lecture de fichier : le hook décide sur des NOMS, jamais sur un contenu.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

export const OUTILS = new Set(["Read", "Grep", "Bash", "PowerShell"]);
const ICI = dirname(fileURLToPath(import.meta.url));
/** Le script de masquage, chemin absolu depuis le pilot : atteignable de même depuis un produit. */
export const SCRIPT_MASQUE = resolve(ICI, "..", "scripts", "env-masque.mjs");

// ---------------------------------------------------------------------------------------------------
// Les noms
// ---------------------------------------------------------------------------------------------------

/** Un nom de fichier `.env`, `.env.xxx` ou `.env*` (jamais `.environment`, `.envrc`, `a.env`). */
const NOM_ENV = /^\.env(?:\.[\w.\-*?[\]]*|[*?][\w.\-*?[\]]*)?$/i;
/** Les modèles sans secret : le dernier composant dit ce que c'est. */
const NOM_MODELE = /\.(?:example|sample|template)$/i;
/** Le même nom retrouvé DANS un texte libre (code en ligne, glob à accolades). */
const NOM_ENV_DANS_TEXTE = /(?<![\w.\-])\.env(?:\.[\w.\-*?]*[\w*?])?(?![\w\-\/\\])/gi;

/**
 * Le nom `.env` que désigne un mot de commande, ou null. Rend { nom, exempt }. Un mot peut porter une
 * option (`--include=.env`, `if=.env`), une référence git (`HEAD:.env`) ou une liste (`a,.env`).
 */
export function nomEnv(mot) {
  for (const brut of String(mot ?? "").split(",")) {
    if (/^\s*--exclude/.test(brut)) continue;                      // `--exclude=.env` : exclusion, pas lecture
    let m = brut.trim().replace(/^(?:--?[\w-]+|[A-Za-z]\w*)=/, "").replace(/^["']|["']$/g, "");
    if (!m || m.startsWith("!")) continue;                          // exclusion d'un glob : `!.env`
    if (/^\\\./.test(m)) continue;                                  // `\.env` : échappement d'expression régulière
    m = m.replace(/^[A-Za-z0-9_.\-\/^~@]+:(?![\\/])/, "");         // `HEAD:.env` (mais pas `C:\…`)
    const base = m.split(/[\\/]/).pop();
    if (NOM_ENV.test(base)) return { nom: base, exempt: NOM_MODELE.test(base) };
  }
  return null;
}
const estEnv = (mot) => { const n = nomEnv(mot); return !!n && !n.exempt; };
const premierEnv = (mots) => mots.map(nomEnv).find((n) => n && !n.exempt) || null;

/** Les noms `.env` non exempts qu'un texte libre contient. */
function nomsDansTexte(texte) {
  const trouves = [];
  for (const m of String(texte || "").matchAll(NOM_ENV_DANS_TEXTE)) if (!NOM_MODELE.test(m[0])) trouves.push(m[0]);
  return trouves;
}

// ---------------------------------------------------------------------------------------------------
// La découpe d'une commande : étages, chaînes, mots (guillemets compris)
// ---------------------------------------------------------------------------------------------------

/**
 * Découpe une commande en CHAÎNES (séparées par `&&`, `||`, `;`, saut de ligne, parenthèses) faites d'ÉTAGES
 * (séparés par `|`), chaque étage étant une liste de MOTS. Sensible aux guillemets : `grep -E "(A|B)" f` ne
 * se coupe pas dans ses guillemets. `<` et `>` hors guillemets sont des mots à part. Avec `aplatir`, les
 * parenthèses ne coupent plus : `Get-Content (Join-Path $PWD '.env')` reste UNE commande dont `.env` est un mot.
 */
export function decouper(commande, aplatir = false) {
  const chaines = [];
  let etages = [], mots = [], mot = null, q = null;
  const finMot = () => { if (mot !== null) { mots.push(mot); mot = null; } };
  const finEtage = () => { finMot(); etages.push(mots); mots = []; };
  const finChaine = () => { finEtage(); if (etages.some((e) => e.length)) chaines.push(etages); etages = []; };
  const s = String(commande || "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === q) { q = null; continue; }
      if (q === '"' && c === "\\" && s[i + 1] === '"') { mot += '"'; i++; continue; }
      mot += c; continue;
    }
    if (c === '"' || c === "'") { q = c; if (mot === null) mot = ""; continue; }
    if (/\s/.test(c)) { if (c === "\n") finChaine(); else finMot(); continue; }
    if (c === "&" && s[i + 1] === "&") { finChaine(); i++; continue; }
    if (c === "|" && s[i + 1] === "|") { finChaine(); i++; continue; }
    if (c === "|") { finEtage(); continue; }
    if (aplatir && (c === "(" || c === ")")) { finMot(); continue; }
    if (c === ";" || c === "(" || c === ")" || c === "`") { finChaine(); continue; }
    if (c === "<" || c === ">") {
      finMot();
      let op = c;
      while (s[i + 1] === c || (c === ">" && s[i + 1] === "&")) { op += s[i + 1]; i++; }
      mots.push(op);
      continue;
    }
    mot = (mot ?? "") + c;
  }
  finChaine();
  return chaines;
}

// ---------------------------------------------------------------------------------------------------
// Les commandes
// ---------------------------------------------------------------------------------------------------

/** Les lecteurs : ils affichent le contenu du fichier qu'on leur donne. */
const LECTEURS = new Set([
  "cat", "tac", "type", "gc", "get-content", "head", "tail", "less", "more", "most", "bat", "view",
  "grep", "egrep", "fgrep", "rg", "ag", "ack", "findstr", "select-string", "sls",
  "sed", "awk", "gawk", "mawk", "nl", "xxd", "od", "hexdump", "strings", "base64",
  "sort", "uniq", "cut", "paste", "column", "tee", "diff", "comm", "fc", "jq", "yq",
  "import-csv", "convertfrom-stringdata",
]);
/** Parmi eux, ceux dont le premier mot libre est un MOTIF et non un fichier. */
const FAMILLE_GREP = new Set(["grep", "egrep", "fgrep", "rg", "ag", "ack"]);
const FAMILLE_SLS = new Set(["select-string", "sls"]);
const COPIEURS = new Set(["cp", "copy", "copy-item", "cpi", "xcopy"]);
const SORTIES_STANDARD = /^(?:\/dev\/(?:stdout|stderr|tty|fd\/[12])|\/proc\/self\/fd\/[12]|con:?|\\\\\.\\con)$/i;
/** Les mots qui précèdent la vraie commande. */
const PREFIXES = new Set(["if", "then", "else", "elif", "do", "while", "until", "!", "{", "}", "time", "sudo", "nohup",
  "command", "builtin", "exec", "env", "nice", "call", "&", "&&", "xargs", "stdbuf"]);
const SOUS_GIT_LECTEURS = new Set(["show", "diff", "blame", "annotate", "cat-file", "grep", "difftool", "whatchanged"]);
const GIT_SANS_CONTENU = /^--(?:name-only|name-status|stat|shortstat|numstat|quiet|exit-code|summary|raw)$|^-q$/;
const INTERPRETEURS_EN_LIGNE = new Map([
  ["node", /^(?:-e|--eval|-p|--print)$/], ["nodejs", /^(?:-e|--eval|-p|--print)$/], ["deno", /^(?:eval)$/], ["bun", /^(?:-e|--eval|-p)$/],
  ["python", /^-c$/], ["python3", /^-c$/], ["py", /^-c$/],
  ["perl", /^-[a-zA-Z]*[eE][a-zA-Z]*$/], ["ruby", /^-[a-zA-Z]*e[a-zA-Z]*$/], ["php", /^-r$/], ["lua", /^-e$/],
]);
const LECTURE_PAR_CODE = /\b(?:ReadAll(?:Text|Lines|Bytes)|ReadLines|OpenText|StreamReader|readFileSync|readFile|createReadStream|file_get_contents|read_text|read_bytes)\b/;

const base = (m) => String(m).split(/[\\/]/).pop().replace(/\.(?:exe|cmd|bat|ps1)$/i, "").toLowerCase();

/** L'indice de la commande réelle d'un étage : après affectations (`A=1`) et préfixes (`sudo`, `if`…). */
function indiceCommande(mots) {
  let i = 0;
  while (i < mots.length) {
    const m = mots[i];
    if (/^[A-Za-z_]\w*=/.test(m) || PREFIXES.has(m.toLowerCase())) { i++; continue; }
    if (/^\$[\w:]+$/.test(m) && mots[i + 1] === "=") { i += 2; continue; }        // PowerShell : `$x = Get-Content …`
    if (/^-/.test(m) && i > 0 && PREFIXES.has(String(mots[i - 1]).toLowerCase())) { i++; continue; } // `sudo -u x`, `xargs -0`
    break;
  }
  return i;
}

/** Retire des arguments d'un lecteur le MOTIF de recherche (un mot libre qui n'est pas un fichier). */
function sansMotif(cmd, args) {
  const sortie = [];
  if (FAMILLE_GREP.has(cmd)) {
    let motifPris = args.some((a) => /^(?:-e|--regexp|-f|--file)$/.test(a));  // motif nommé : tout mot libre est un fichier
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      if (a === "-e" || a === "--regexp") { k++; continue; }                 // la valeur de -e est un motif
      if (a.startsWith("-")) { sortie.push(a); continue; }
      if (!motifPris) { motifPris = true; continue; }                          // premier mot libre : le motif
      sortie.push(a);
    }
    return sortie;
  }
  if (FAMILLE_SLS.has(cmd)) {
    const nomme = args.some((a) => /^-pattern$/i.test(a));
    let motifPris = nomme;
    for (let k = 0; k < args.length; k++) {
      const a = args[k];
      if (/^-pattern$/i.test(a)) { k++; continue; }
      if (/^-(?:path|literalpath|include|exclude|context|encoding)$/i.test(a)) { sortie.push(a, args[k + 1] ?? ""); k++; continue; }
      if (a.startsWith("-")) { sortie.push(a); continue; }
      if (!motifPris) { motifPris = true; continue; }
      sortie.push(a);
    }
    return sortie;
  }
  if (cmd === "findstr") {
    const motifNomme = args.some((a) => /^\/c:/i.test(a));
    let motifPris = motifNomme;
    for (const a of args) {
      if (a.startsWith("/")) { sortie.push(a); continue; }
      if (!motifPris) { motifPris = true; continue; }
      sortie.push(a);
    }
    return sortie;
  }
  return args;
}

/**
 * Juge UNE commande complète (texte d'un outil Bash ou PowerShell). Rend la liste des fautes : phrases courtes
 * qui nomment le geste et le fichier.
 */
export function fautesCommande(commande, profondeur = 0) {
  const fautes = [];
  if (profondeur > 3) return fautes;
  const texte = String(commande || "");
  // Un `.env` doit apparaître quelque part ; sinon rien à juger (chemin rapide).
  if (!/\.env/i.test(texte)) return fautes;

  // Les sous-commandes `$( … )` et les accents graves, y compris dans des guillemets doubles.
  for (const m of texte.matchAll(/\$\(([^()]*)\)/g)) fautes.push(...fautesCommande(m[1], profondeur + 1));
  for (const m of texte.matchAll(/`([^`]*)`/g)) fautes.push(...fautesCommande(m[1], profondeur + 1));

  // Une lecture par code (`[IO.File]::ReadAllText('.env')`, `readFileSync`) qui nomme un `.env`.
  if (LECTURE_PAR_CODE.test(texte)) {
    const n = nomsDansTexte(texte);
    if (n.length) fautes.push(`un code de lecture de fichier nomme \`${n[0]}\``);
  }

  for (const aplati of [false, true]) for (const etages of decouper(texte, aplati)) {
    for (let e = 0; e < etages.length; e++) {
      const mots = etages[e];
      // Redirection d'entrée : le contenu du fichier est donné en entrée à une commande dont la sortie est lue.
      for (let k = 0; k < mots.length - 1; k++) {
        if (mots[k] === "<" && estEnv(mots[k + 1])) fautes.push(`redirection d'entrée \`< ${mots[k + 1]}\` : le contenu du fichier est lu`);
      }
      // Les redirections ne sont pas des arguments.
      const utiles = [];
      for (let k = 0; k < mots.length; k++) {
        if (/^[<>]/.test(mots[k])) { k++; continue; }
        utiles.push(mots[k]);
      }
      const i = indiceCommande(utiles);
      if (i >= utiles.length) continue;
      const cmd = base(utiles[i]);
      const args = utiles.slice(i + 1);

      // Passe aplatie : seule la lecture d'une sous-expression entre parenthèses se juge ici.
      if (aplati) {
        const envA = LECTEURS.has(cmd) ? premierEnv(sansMotif(cmd, args)) : null;
        if (envA) fautes.push(`\`${cmd}\` lit et affiche \`${envA.nom}\``);
        continue;
      }

      // Les coques et interpréteurs avec script en ligne : le script se juge à son tour.
      if (/^(?:bash|sh|zsh|dash|ksh)$/.test(cmd)) {
        const k = args.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
        if (k >= 0 && args[k + 1] !== undefined) fautes.push(...fautesCommande(args[k + 1], profondeur + 1));
      } else if (/^(?:powershell|pwsh)$/.test(cmd)) {
        const k = args.findIndex((a) => /^-(?:command|c|cmd)$/i.test(a));
        if (k >= 0) fautes.push(...fautesCommande(args.slice(k + 1).join(" "), profondeur + 1));
      } else if (cmd === "cmd") {
        const k = args.findIndex((a) => /^\/[ck]$/i.test(a));
        if (k >= 0) fautes.push(...fautesCommande(args.slice(k + 1).join(" "), profondeur + 1));
      } else if (INTERPRETEURS_EN_LIGNE.has(cmd)) {
        if (args.some((a) => INTERPRETEURS_EN_LIGNE.get(cmd).test(a))) {
          const n = nomsDansTexte(args.join(" "));
          if (n.length) fautes.push(`\`${cmd}\` avec code en ligne qui nomme \`${n[0]}\``);
        }
      }

      const cibles = LECTEURS.has(cmd) ? sansMotif(cmd, args) : args;
      const env = premierEnv(cibles);
      if (!env) continue;

      if (LECTEURS.has(cmd)) {
        fautes.push(`\`${cmd}\` lit et affiche \`${env.nom}\``);
      } else if (COPIEURS.has(cmd) && args.some((a) => SORTIES_STANDARD.test(a))) {
        fautes.push(`\`${cmd}\` copie \`${env.nom}\` vers la sortie standard`);
      } else if (cmd === "dd" && !args.some((a) => /^of=/.test(a) && !SORTIES_STANDARD.test(a.slice(3)))) {
        fautes.push(`\`dd\` sans fichier de sortie rend \`${env.nom}\` sur la sortie standard`);
      } else if (cmd === "git") {
        let k = 0;
        while (k < args.length && args[k].startsWith("-")) k += /^(?:-C|-c|--git-dir|--work-tree|--namespace|--exec-path)$/.test(args[k]) ? 2 : 1;
        const sous = args[k];
        const reste = args.slice(k + 1);
        const montre = SOUS_GIT_LECTEURS.has(sous) || (sous === "log" && reste.some((a) => /^(?:-p|--patch|-u|--cc|--textconv)$/.test(a)));
        if (montre && !reste.some((a) => GIT_SANS_CONTENU.test(a))) fautes.push(`\`git ${sous}\` affiche le contenu de \`${env.nom}\``);
      } else if (cmd === "find" && args.some((a) => /^-(?:exec|execdir|ok|okdir)$/.test(a))) {
        const k = args.findIndex((a) => /^-(?:exec|execdir|ok|okdir)$/.test(a));
        if (LECTEURS.has(base(args[k + 1] ?? ""))) fautes.push(`\`find … -exec ${args[k + 1]}\` lit \`${env.nom}\``);
      }
    }

    // Un `.env` produit par un étage et passé par tuyau à un lecteur qui lit les fichiers qu'on lui envoie.
    const PRODUCTEURS = new Set(["get-item", "gi", "get-childitem", "gci", "ls", "dir", "resolve-path", "rvpa", "find", "fd", "echo", "write-output", "printf"]);
    const CONSOMMATEURS = new Set(["get-content", "gc", "cat", "type", "select-string", "sls", "xargs"]);
    for (let e = 0; e < etages.length - 1 && !aplati; e++) {
      const m = etages[e].filter((x) => !/^[<>]/.test(x));
      const i = indiceCommande(m);
      if (i >= m.length || !PRODUCTEURS.has(base(m[i]))) continue;
      const env = premierEnv(m.slice(i + 1));
      if (!env) continue;
      const lecteur = etages.slice(e + 1).flat().find((x) => CONSOMMATEURS.has(base(x)));
      if (lecteur) fautes.push(`\`${env.nom}\` passé par tuyau à \`${lecteur}\``);
    }
  }
  return [...new Set(fautes)];
}

// ---------------------------------------------------------------------------------------------------
// Le jugement d'un appel d'outil
// ---------------------------------------------------------------------------------------------------

/** Juge l'entrée d'un hook PreToolUse. */
export function juger(entree) {
  const outil = entree?.tool_name;
  if (!OUTILS.has(outil)) return { decision: "laisse" };
  const e = entree?.tool_input || {};
  let fautes = [];
  if (outil === "Read") {
    const n = typeof e.file_path === "string" ? nomEnv(e.file_path) : null;
    if (n && !n.exempt) fautes.push(`\`Read\` de \`${n.nom}\``);
  } else if (outil === "Grep") {
    const n = typeof e.path === "string" ? nomEnv(e.path) : null;
    if (n && !n.exempt) fautes.push(`\`Grep\` sur \`${n.nom}\``);
    if (typeof e.glob === "string") {
      const g = nomsDansTexte(e.glob.replace(/(^|[,{ ])!\S*/g, "$1"));
      if (g.length) fautes.push(`\`Grep\` dont le filtre \`${e.glob}\` désigne \`${g[0]}\``);
    }
  } else {
    const commande = e.command;
    if (typeof commande === "string") fautes = fautesCommande(commande);
  }
  if (!fautes.length) return { decision: "laisse" };
  return {
    decision: "refuse",
    motif: `LECTURE DE .env REFUSÉE (D-106 (b)) — ${fautes.join(" ; ")}. Les .env ne transitent jamais : le 21/10/2026, une clé d'un `
      + "`.env` a été affichée en clair dans une session, et tout ce qu'un outil affiche entre dans la transcription. "
      + `Voie permise : \`node ${SCRIPT_MASQUE} <fichier>\` (chaque valeur remplacée par ********) ou \`node ${SCRIPT_MASQUE} <fichier> --cles\` `
      + "(la liste des seules clés). Les modèles `.env.example`, `.env.sample` et `.env.template` se lisent librement.",
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
