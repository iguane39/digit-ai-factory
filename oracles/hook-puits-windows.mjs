#!/usr/bin/env node
/**
 * hook-puits-windows.mjs — UNE REDIRECTION VERS /dev/null NE SE JOUE PAS DANS POWERSHELL (TF-1584, RT-110
 * du Produit-02, 26/09/2026).
 *
 * LE FAIT. Une redirection `> /dev/null` ou `2>/dev/null` n'est un puits que pour un shell POSIX. Jouée
 * par l'outil PowerShell, elle CRÉE le fichier `null` à la racine du lecteur courant (ici `C:\dev\null`)
 * et y ÉCRIT ce qu'on croyait jeter. Le 26/09, l'amorçage de 08:27 le déclarait à 117 octets ; à 10:25 il
 * en pesait 13 530 (une page HTML), réécrit à 10:08 par une session voisine. Le contrôle d'ouverture
 * (`bootstrap.mjs`, versant fichiers) SIGNALE le fichier ; rien n'empêchait qu'il soit réécrit.
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur l'outil `PowerShell`. Il lit sur stdin l'entrée de l'outil et
 * REFUSE (exit 2, motif sur stderr, qui dit le remède : `$null`) toute commande qui redirige vers
 * `/dev/null` ou lui envoie un `Out-File`, `Tee-Object`, `Set-Content` ou `Add-Content`. Les chaînes entre
 * guillemets et les here-strings sont retirées avant l'examen : citer `> /dev/null` dans un message de commit
 * ou un texte n'est pas le jouer. L'outil Bash (Git Bash) n'est pas concerné : `/dev/null` y est un vrai puits.
 *
 * NON JUGÉ (déclaré). Une commande qui bâtit la redirection dynamiquement (`Invoke-Expression`, variable
 * contenant le chemin) ; un script lancé par PowerShell dont le contenu redirige vers /dev/null (le
 * fichier est lu par un autre shell) ; la forme `nul`, `>1`, `>2`, que seul le contrôle d'ouverture relève
 * après coup ; les produits, où ce hook n'est pas câblé (câbler un refus chez un produit est une décision
 * du pilot, règle neuve opposable : avertissement d'abord).
 *
 * Usage : node oracles\hook-puits-windows.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const estOutilPowerShell = (nom) => /(^|__)PowerShell$/.test(String(nom || ""));

/** Retire here-strings et chaînes entre guillemets : ce qui y est écrit est cité, pas joué. */
export function sansChaines(commande) {
  return String(commande || "")
    .replace(/@'[\s\S]*?'@/g, " ")
    .replace(/@"[\s\S]*?"@/g, " ")
    .replace(/'[^']*'/g, " ")
    .replace(/"[^"]*"/g, " ");
}

const CIBLE = String.raw`(?:/dev/null|\\dev\\null)(?![\w./\\-])`;
const REDIRECTION = new RegExp(String.raw`(?:^|[\s;|&(])(?:\d|\*)?>{1,2}\s*${CIBLE}`, "i");
const CMDLET = new RegExp(String.raw`\b(?:Out-File|Tee-Object|Set-Content|Add-Content)\b[^;|\n]*?${CIBLE}`, "i");

/** Vrai si la commande envoie quelque chose vers /dev/null. */
export function redirigeVersDevNull(commande) {
  const nue = sansChaines(commande);
  return REDIRECTION.test(nue) || CMDLET.test(nue);
}

/** Le verdict : { decision: "laisse"|"refuse", motif }. */
export function juger(entree) {
  if (!estOutilPowerShell(entree?.tool_name)) return { decision: "laisse", motif: "outil hors PowerShell" };
  if (!redirigeVersDevNull(entree?.tool_input?.command)) return { decision: "laisse", motif: "aucune redirection vers /dev/null" };
  return {
    decision: "refuse",
    motif: "REDIRECTION VERS /dev/null REFUSÉE (TF-1584) — PowerShell ne connaît pas ce puits : la commande créerait "
      + "(ou réécrirait) un fichier nommé « null » à la racine du lecteur courant et y écrirait ce qu'elle voulait jeter, "
      + "hors de tout dépôt. Remède : remplacer par `$null` (`... | Out-Null`, `... > $null`, `2> $null`).",
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  const v = juger(entree);
  if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  process.exit(0);
}
