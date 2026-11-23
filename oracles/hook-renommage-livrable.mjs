#!/usr/bin/env node
/**
 * hook-renommage-livrable.mjs — UN LIVRABLE SOUS output/ NE SE RENOMME PAS PAR `mv` : LE SCRIPT RENOMME, TRACE ET LAISSE UN RENVOI (TF-2737, D-236 (a) du 23/11/2026).
 *
 * LE FAIT (retour du 14/11/2026, ledger seq 144 de factory-digit-ai-fr). Un autre processus a renommé la revue de l'indice g en k sans trace ; la restitution
 * suivante liait, par sa ligne « Livré : », un chemin disparu, et le fragment a été recréé sous l'ancien nom. La décision du porteur (réponse « 236a ») :
 * « un hook refuse `mv` et `git mv` sous `output/`, un script renomme et trace au ledger avec renvoi ».
 *
 * CE QUE LE HOOK REFUSE (exit 2) quand la SOURCE est un livrable sous `output/` (au pilot comme chez un produit) :
 *   `mv`, `git mv` (options globales `-C <dossier>` comprises), `Move-Item` (`mi`, `move`), `Rename-Item` (`rni`, `ren`, `rename`), `[System.IO.File]::Move(…)`,
 *   et un code en ligne (`node -e`, `python -c`, `powershell -Command`) qui appelle `rename`, `renameSync`, `os.rename`, `shutil.move` ou `File.Move` sur un chemin sous `output/` ;
 *   sous `bash -c`, `sh -c`, `cmd /c` et `powershell -Command` aussi. La source relative se juge depuis le dossier de travail de l'appel, que les `cd`, `pushd` et `Set-Location`
 *   de la commande déplacent. Un livrable est un FICHIER sous `output/` : un nom à extension, un motif (`*`, `?`, `[`, `{`) ou une variable (`$f`), hors `README.md` et `LISEZMOI.md`
 *   (régénérés par hook). Un déplacement vers `old\` (R-7 bis) est un renommage : il passe par le même script.
 * Le message de refus nomme le script de remplacement avec la commande exacte, construite sur la source et la destination de la commande refusée :
 *   `node scripts\renommer-livrable.mjs --de "<source>" --vers "<destination>" --motif "<pourquoi>"`.
 *
 * CE QUE LE HOOK LAISSE PASSER : `mv`, `git mv`, `Move-Item` hors `output/` ; un fichier DÉPOSÉ sous `output/` (la source est ailleurs) ; le script lui-même ; un message de commit,
 * un `echo`, un `grep` ou un document ici qui CITE « mv output/… » ; un dossier (nom sans extension : le texte d'une commande ne le distingue pas d'un fichier sans extension).
 *
 * NON JUGÉ (déclaré) : un dossier entier renommé ; un renommage par copie puis suppression (`cp` puis `rm`) ; `robocopy /MOV`, `find -exec mv`, `xargs mv` dont la source vient d'un
 * tuyau ; une source portée par une variable AVANT `output/` sans que le texte nomme `output/` (`mv "$F" …`) ; un script dont le texte n'est pas dans la commande ; une commande encodée
 * (`-EncodedCommand`, `base64 -d | sh`) ; un explorateur de fichiers ou tout autre outil que Bash et PowerShell. Le hook décide sur le texte de la commande, il ne lit aucun fichier.
 *
 * Hook `PreToolUse` sur `Bash` et `PowerShell`. Chez un produit : `node forge\hooks\factory.mjs renommage-livrable` (héritage 1.82.0), le script est celui du pilot.
 * Usage : node oracles\hook-renommage-livrable.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { decouper } from "./hook-fichiers-env.mjs";
import { sansHeredoc } from "./hook-gardes-commande.mjs";
import { relatifSousOutput } from "./lib-renommages-livrables.mjs";

export const OUTILS = new Set(["Bash", "PowerShell"]);
const ICI = dirname(fileURLToPath(import.meta.url));
export const SCRIPT_RENOMMAGE = resolve(ICI, "..", "scripts", "renommer-livrable.mjs");

const base = (m) => String(m).split(/[\\/]/).pop().replace(/\.(?:exe|cmd|bat|ps1)$/i, "").toLowerCase();
const versSlash = (p) => String(p || "").replace(/\\/g, "/");
const PREFIXES = new Set(["sudo", "command", "builtin", "exec", "nohup", "time", "nice", "call", "&", "then", "else", "do", "if", "while", "until", "!", "{", "}"]);
const CHANGE_DOSSIER = new Set(["cd", "chdir", "pushd", "set-location", "sl"]);
const INTERPRETES = /^(?:node|nodejs|bun|deno|python|python3|py|pwsh|powershell)$/;

/** Les étages d'une commande, chacun réduit à { cmd, args } (affectations et préfixes sautés), dans l'ordre d'exécution. */
function etagesDe(texte) {
  const sortie = [];
  for (const chaine of decouper(texte)) {
    chaine.forEach((mots, rang) => {
      const utiles = [];
      for (let k = 0; k < mots.length; k++) { if (/^[<>]/.test(mots[k])) { k++; continue; } utiles.push(mots[k]); }
      let i = 0;
      while (i < utiles.length && (/^[A-Za-z_]\w*=/.test(utiles[i]) || PREFIXES.has(utiles[i].toLowerCase()))) i++;
      if (i < utiles.length) sortie.push({ cmd: base(utiles[i]), args: utiles.slice(i + 1), amont: chaine.slice(0, rang).flat() });
    });
  }
  return sortie;
}

/** Un chemin absolu : lecteur (`C:\`, `C:/`), `\\`, racine POSIX (`/c/dev` de Git Bash compris) ou dossier personnel. */
const estAbsolu = (p) => /^(?:[A-Za-z]:[\\/]|\\\\|\/|~[\\/]?)/.test(p);
/** Le chemin résolu depuis `cwd`, en barres obliques et normalisé (`..` et `.` résolus) ; null quand il porte une variable avant son premier segment `output`. */
function resoudre(chemin, cwd) {
  const p = versSlash(chemin).replace(/^["']|["']$/g, "");
  if (!p) return null;
  const complet = estAbsolu(p) || !cwd ? p : `${versSlash(cwd).replace(/\/$/, "")}/${p}`;
  return posix.normalize(complet);
}
const NOM_NON_LIVRABLE = /^(?:README|LISEZMOI)\.md$/i;
/**
 * Le chemin relatif sous `output/` d'une source qui est un livrable, ou null. Un livrable est un fichier : nom à extension, motif de fichiers ou variable ; un nom sans extension
 * (un dossier) n'en est pas un à la lecture du texte.
 */
export function livrableSousOutput(chemin, cwd) {
  const r = resoudre(chemin, cwd);
  const rel = r && relatifSousOutput(r);
  if (!rel || rel.toLowerCase() === "output/") return null;
  const nom = rel.split("/").pop();
  if (!nom || NOM_NON_LIVRABLE.test(nom)) return null;
  return /\.[A-Za-z0-9]{1,8}$/.test(nom) || /[*?[{$]/.test(nom) ? rel : null;
}

const quote = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
/** La commande exacte du remplacement, pour une source et une destination (la destination `<destination>` quand la commande refusée n'en donne pas). */
export function commandeRemede(source, destination) {
  return `node ${quote(SCRIPT_RENOMMAGE)} --de ${quote(source)} --vers ${quote(destination || "<destination>")} --motif "<pourquoi>"`;
}

// ---------------------------------------------------------------------------------------------------
// L'analyse des arguments d'une commande de déplacement
// ---------------------------------------------------------------------------------------------------
/** `mv` et `git mv` : options, positionnels, dossier cible `-t`. */
function analyserMv(args, estGit) {
  const pos = []; let cible = null; let fin = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (fin || !/^-/.test(a) || a === "-") { pos.push(a); continue; }
    if (a === "--") { fin = true; continue; }
    if (/^--target-directory=/.test(a)) { cible = a.slice(a.indexOf("=") + 1); continue; }
    if (a === "--target-directory" && !estGit) { cible = args[++i] ?? null; continue; }
    if (!estGit && (a === "--suffix" || a === "-S")) { i++; continue; }
    if (!estGit && /^-[A-Za-z]*t$/.test(a)) { cible = args[++i] ?? null; continue; }
  }
  if (cible !== null) return { sources: pos, destination: cible };
  return pos.length >= 2 ? { sources: pos.slice(0, -1), destination: pos[pos.length - 1] } : { sources: pos, destination: null };
}

/** `Move-Item` et `Rename-Item` : paramètres nommés (abréviations comprises), positionnels, liste séparée par des virgules. */
function analyserPS(args, renomme) {
  const valeurs = { path: null, lp: null, dest: null, nom: null };
  const pos = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (/^\/[A-Za-z]$/.test(a)) continue;   // `move /Y` : option de cmd
    if (!/^-[A-Za-z]/.test(a)) { pos.push(a); continue; }
    let [nom, ...reste] = a.slice(1).split(":");
    nom = nom.toLowerCase();
    const valeur = reste.length ? reste.join(":") : undefined;
    const lit = () => (valeur !== undefined ? valeur : args[++i]);
    const prefixe = (plein, min = 1) => nom.length >= min && plein.startsWith(nom);
    if (prefixe("path", 2)) valeurs.path = lit();
    else if (prefixe("literalpath") || nom === "lp") valeurs.lp = lit();
    else if (!renomme && prefixe("destination")) valeurs.dest = lit();
    else if (renomme && prefixe("newname")) valeurs.nom = lit();
    else if (["filter", "include", "exclude", "credential"].some((n) => nom.length >= 2 && n.startsWith(nom))) lit();
  }
  const liste = (v) => String(v ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const libres = [...pos];
  const chemin = valeurs.lp ?? valeurs.path ?? libres.shift();
  const second = (renomme ? valeurs.nom : valeurs.dest) ?? libres.shift();
  const sources = liste(chemin);
  if (renomme) {
    const dossier = sources[0] ? versSlash(sources[0]).replace(/[^/]*$/, "") : "";
    return { sources, destination: second ? `${dossier}${second}` : null };
  }
  return { sources, destination: second ?? null };
}

const API_RENOMMAGE = /\b(?:renameSync|fs(?:\.promises)?\.rename|os\.(?:rename|replace)|shutil\.move)\b|\)\s*\.rename\s*\(|\[(?:System\.)?IO\.(?:File|Directory)\]\s*::\s*Move|\b(?:File|Directory)\.Move\b/i;
/** Les mots d'un étage qui lance un déplacement sur ce que l'étage précédent lui passe : `… | Move-Item`, `… | xargs mv`, `… | ForEach-Object { Move-Item … }`. */
const MOVERS_PS = /^(?:move-item|mi|move|rename-item|rni|ren|mv)$/i;
const CHEMIN_OUTPUT_QUOTE = /(["'`])((?:(?!\1)[^\n])*?output[\\/](?:(?!\1)[^\n])*?\.[A-Za-z0-9]{1,8})\1/;

/** Un code qui appelle une API de renommage sur un chemin cité sous output/ : le premier chemin cité est la source, la chaîne qui suit la destination. */
function appelEnLigne(code) {
  if (!API_RENOMMAGE.test(code)) return null;
  const m = CHEMIN_OUTPUT_QUOTE.exec(code);
  if (!m) return null;
  const apres = code.slice(m.index + m[0].length);
  const dest = /(["'`])((?:(?!\1)[^\n])+?)\1/.exec(apres);
  return { forme: "un appel de renommage en ligne", source: m[2], destination: dest ? dest[2] : null };
}

/** Les fautes d'un renommage de livrable dans une commande : { forme, source, destination }. */
export function fautesRenommageLivrable(commande, cwd = "", profondeur = 0) {
  const fautes = [];
  if (profondeur > 3) return fautes;
  const texte = sansHeredoc(commande);
  if (!/mv|move|ren(?:ame)?\b|rni|\bmi\b|rename|Move|shutil|os\.rename/i.test(texte)) return fautes;

  let ici = cwd || "";
  const verifier = (forme, sources, destination) => {
    for (const s of sources) {
      const rel = livrableSousOutput(s, ici);
      if (rel) fautes.push({ forme, source: s, destination });
    }
  };
  // Un déplacement dont la source vient d'un tuyau : l'étage amont lit sous `output/` (`Get-ChildItem output\*.md | Move-Item -Destination …`).
  const amontSousOutput = (amont) => amont.find((m) => { const r = resoudre(m, ici); return r && !/^-/.test(m) && relatifSousOutput(`${r}/`); }) ?? null;
  for (const { cmd, args, amont } of etagesDe(texte)) {
    const alimente = amont.length ? amontSousOutput(amont) : null;
    if (alimente && /^(?:xargs|foreach-object|foreach|%)$/.test(cmd) && args.some((a) => MOVERS_PS.test(a))) {
      fautes.push({ forme: `\`${args.find((a) => MOVERS_PS.test(a))}\` alimenté par un tuyau qui lit sous output/`, source: alimente, destination: null });
      continue;
    }
    if (/^(?:bash|sh|zsh|dash|ksh)$/.test(cmd)) {
      const k = args.findIndex((a) => /^-[a-z]*c[a-z]*$/.test(a));
      if (k >= 0 && args[k + 1] !== undefined) fautes.push(...fautesRenommageLivrable(args[k + 1], ici, profondeur + 1));
      continue;
    }
    if (cmd === "cmd") {
      const k = args.findIndex((a) => /^\/[ck]$/i.test(a));
      if (k >= 0) fautes.push(...fautesRenommageLivrable(args.slice(k + 1).join(" "), ici, profondeur + 1));
      continue;
    }
    if (CHANGE_DOSSIER.has(cmd)) {
      const cible = args.find((a) => !/^-/.test(a) && !/^\/[A-Za-z]$/.test(a));
      if (cible && !/[$%~]/.test(cible) && cible !== "-") ici = resoudre(cible, ici) ?? ici;
      continue;
    }
    if (cmd === "mv") { const x = analyserMv(args, false); verifier("`mv`", x.sources, x.destination); continue; }
    if (cmd === "git") {
      let k = 0, dossier = ici;
      while (k < args.length && /^-/.test(args[k])) {
        if (args[k] === "-C" && args[k + 1] !== undefined) { dossier = resoudre(args[k + 1], dossier) ?? dossier; k += 2; }
        else if (args[k] === "-c" || /^--(?:git-dir|work-tree|namespace|exec-path)$/.test(args[k])) k += 2;
        else k++;
      }
      if (args[k] === "mv") {
        const x = analyserMv(args.slice(k + 1), true);
        const avant = ici; ici = dossier; verifier("`git mv`", x.sources, x.destination); ici = avant;
      }
      continue;
    }
    if (cmd === "move-item" || cmd === "mi" || cmd === "move" || cmd === "rename-item" || cmd === "rni" || cmd === "ren") {
      const renomme = /^(?:rename-item|rni|ren)$/.test(cmd), x = analyserPS(args, renomme);
      const forme = renomme ? "`Rename-Item`" : "`Move-Item`";
      if (!x.sources.length && alimente) fautes.push({ forme: `${forme} alimenté par un tuyau qui lit sous output/`, source: alimente, destination: null });
      else verifier(forme, x.sources, x.destination);
      continue;
    }
    if (cmd === "rename") { verifier("`rename`", args.filter((a) => !/^-/.test(a)), null); continue; }
    // Le code en ligne et les appels .NET : le texte du code est lu, le chemin cité entre guillemets sous output/ est la source, le suivant la destination.
    if (INTERPRETES.test(cmd)) {
      const k = args.findIndex((a) => /^(?:-e|--eval|-p|--print|-c|-command|-cmd)$/i.test(a));
      if (k >= 0) { const f = appelEnLigne(args.slice(k + 1).join(" ")); if (f) fautes.push(f); }
    }
    // Un `Move-Item` ou un `mv` dans un code PowerShell passé à `-Command` : relu comme une commande.
    if (/^(?:pwsh|powershell)$/.test(cmd)) {
      const k = args.findIndex((a) => /^-(?:command|c|cmd)$/i.test(a));
      if (k >= 0) fautes.push(...fautesRenommageLivrable(args.slice(k + 1).join(" "), ici, profondeur + 1));
    }
  }
  // Un appel .NET nu (`[System.IO.File]::Move('…\output\a.md', '…')`) : la découpe en étages coupe aux parenthèses, le texte entier est relu.
  if (/\]\s*::\s*Move/i.test(texte)) { const f = appelEnLigne(texte); if (f) fautes.push(f); }
  const vus = new Set();
  return fautes.filter((f) => { const c = `${f.forme}|${f.source}|${f.destination}`; if (vus.has(c)) return false; vus.add(c); return true; });
}

/** Juge l'entrée d'un hook PreToolUse : { decision: "laisse" } ou { decision: "refuse", motif }. */
export function juger(entree) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const commande = entree?.tool_input?.command;
  if (typeof commande !== "string" || !commande.trim()) return { decision: "laisse" };
  const fautes = fautesRenommageLivrable(commande, entree?.cwd || process.cwd());
  if (!fautes.length) return { decision: "laisse" };
  const vus = fautes.slice(0, 3);
  const decrit = vus.map((f) => `${f.forme} sur « ${f.source} »`).join(" ; ") + (fautes.length > vus.length ? ` (+${fautes.length - vus.length})` : "");
  return { decision: "refuse", motif: `RENOMMAGE D'UN LIVRABLE REFUSÉ (TF-2737, D-236 (a) du 23/11/2026) — ${decrit}. Sous output/, un renommage fait sans trace casse le lien « Livré : » d'une restitution qui nomme l'ancien `
    + `chemin : le 14/11/2026, chez un produit, la revue de l'indice g a été renommée en k par un autre processus, et la restitution suivante liait un chemin disparu. `
    + `Le script renomme, trace (au pilot \`references\\RENOMMAGES-LIVRABLES.jsonl\`, chez un produit le ledger, entrée \`deplacement_effectue\`) et laisse un renvoi que le hook de restitution suit. `
    + `Une commande par livrable, le déplacement vers \`old\\\` (R-7 bis) compris :\n${vus.map((f) => commandeRemede(f.source, f.destination)).join("\n")}\n`
    + `\`--vers\` accepte un dossier (terminé par une barre oblique) ; \`--suivre <ancien chemin>\` rend le chemin courant.` };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === resolve(fileURLToPath(import.meta.url)).toLowerCase()) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  let v = { decision: "laisse" };
  try { v = juger(entree); } catch { /* une panne du juge ne bloque jamais un outil */ }
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
