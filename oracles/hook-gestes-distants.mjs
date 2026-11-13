#!/usr/bin/env node
/**
 * hook-gestes-distants.mjs — UNE DÉCISION GROUPÉE POUR TOUS LES GESTES DESTRUCTIFS DISTANTS DU TOUR,
 * jamais une confirmation par commande (TF-1959, décision humaine D-77 (b) amendée du 26/10/2026).
 *
 * LA PAROLE HUMAINE, mot pour mot : « 77b mais une décision pour toutes les modifs en une fois, pas une
 * décision à chaque fois qu'il y a une suppression ou modification de droits (l'objectif est d'optimiser /
 * réduire le nombre d'interventions de l'utilisateur en lui laissant une maitrise totale sur ce type de
 * sujet) ».
 *
 * LE FAIT. Un dépôt d'essai et son état Terraform ont été supprimés alors qu'une décision humaine les
 * réservait à plus tard ; la session a aussi tenté quatre fois d'attribuer des rôles d'administration
 * Azure DevOps (refusées en 403 et 401, donc sans dégât, mais rien ne les avait arrêtées en amont). Aucune
 * règle n'était mécanisée : R-58 range la suppression sous le motif `irreversible`, mais une consigne
 * qu'aucun mécanisme n'exécute décore.
 *
 * LA CONCEPTION. Pas de confirmation par commande : elle ferait revenir l'humain à chaque suppression, le
 * contraire de ce qu'il demande.
 *   1. La session regroupe TOUS les gestes destructifs distants qu'elle prévoit dans le tour en UNE décision
 *      au bloc 3, liste complète : commande, cible, effet, retour arrière.
 *   2. L'humain l'approuve une fois.
 *   3. La session inscrit la liste approuvée en UNE ligne d'un fichier de lot :
 *        `todo\gestes-approuves.jsonl` au pilot, `forge\gestes-approuves.jsonl` chez un produit,
 *      par `node oracles\hook-gestes-distants.mjs --poser --lot <lot.json>` (chez un produit :
 *      `node forge\hooks\factory.mjs gestes-distants --poser --lot <lot.json>`).
 *      Une ligne : schema, decision (D-N), reponse_humaine (les mots de l'humain), horodatage, expire
 *      (24 h au plus après l'horodatage), session (facultative : le lot ne vaut alors que pour elle),
 *      gestes[] = { commande, cible, effet, retour_arriere }.
 *   4. Ce hook, `PreToolUse` sur `Bash` et `PowerShell`, REFUSE (exit 2) toute commande destructive distante
 *      qu'aucun lot valide ne couvre, avec un message qui dit quoi faire : poser la décision groupée.
 *
 * LA LISTE FERMÉE (chaque famille se justifie par l'effet, pas par l'outil) :
 *   · suppression ou purge de ressource cloud : `az …` dont un mot de sous-commande est delete, purge ou
 *     remove (`az group delete`, `az keyvault purge`, `az role assignment delete`), exception faite des
 *     groupes locaux (`az extension`, `az config`, `az cache`, `az account`, `az login`…) ; les cmdlets
 *     `Remove-Az*` et `Remove-Mg*` (même effet sous PowerShell), sauf contexte, environnement, défaut ;
 *   · état et infrastructure : `terraform|tofu destroy`, `apply -destroy`, `state rm`, `workspace delete`
 *     (l'état supprimé ne se reconstruit pas, les ressources deviennent orphelines) ;
 *   · droits : `az role assignment|definition create|update`, `az ad app permission add|grant|admin-consent`,
 *     `az ad group|app|sp member|owner add`, `az keyvault set-policy`, `az devops security group
 *     membership add|group create|permission update|reset`, `az devops user add|update`, cmdlets
 *     `New-AzRoleAssignment`, `Set-AzRoleAssignment`, `New-Mg…AppRoleAssignment|Oauth2PermissionGrant|
 *     GroupMember|GroupOwner|DirectoryRoleMember` ; et toute requête HTTP qui écrit (POST, PUT, PATCH)
 *     sur un point d'accès de droits : Azure DevOps (accesscontrolentries, accesscontrollists,
 *     securityroles, roleassignments, graph/memberships|groups|users, entitlements), Microsoft Graph
 *     (appRoleAssignments, oauth2PermissionGrants, directoryRoles, roleManagement, members, owners, $ref),
 *     Azure Resource Manager (Microsoft.Authorization/roleAssignments|roleDefinitions|denyAssignments),
 *     GitHub (collaborators, memberships, invitations, protection de branche, rulesets) ; outils :
 *     `az rest`, `az devops invoke`, `gh api`, `curl`, `wget`, `Invoke-RestMethod`, `Invoke-WebRequest`,
 *     `Invoke-AzRestMethod` ;
 *   · toute requête HTTP de méthode DELETE vers un hôte autre que la machine locale (`gh api -X DELETE`,
 *     `curl -X DELETE`, `Invoke-RestMethod -Method Delete`) ; `gh <groupe> delete` (`gh repo delete`,
 *     `gh release delete`, `gh secret delete`…), sauf `gh alias` (local) ;
 *   · réécriture ou suppression de l'histoire distante : `git push --force`, `-f`, `--force-with-lease`,
 *     `--force-if-includes`, refspec `+branche`, `--delete`, `-d`, refspec `:branche` (suppression de
 *     branche ou d'étiquette distante), `--mirror`, `--prune` ;
 *   · D-196 (b) du 10/11/2026 : les politiques (`az repos policy … create|update`, `az policy assignment|exemption create|update`,
 *     `New|Set-AzPolicyAssignment|Exemption`, REST `policy/configurations` d'Azure DevOps et `policyAssignments|policyExemptions`
 *     d'Azure) ; la connexion à une base de production par un secret du dépôt (client de base ou chaîne de connexion, alimentés
 *     par une variable ou un fichier d'environnement dont le nom porte PROD ou PRODUCTION, ou vers un hôte non local nommé prod) ;
 *     l'arrêt de processus par nom ou en masse (`taskkill /IM|/FI`, `Stop-Process -Name`, `Get-Process x | Stop-Process`, `pkill`,
 *     `killall`, `kill $(pgrep …)`, `wmic process … delete`). L'arrêt par PID reste libre.
 * Les lectures (`az group show`, `az role assignment list`, `terraform plan`, `gh api` GET) et les
 * déploiements ordinaires (`terraform apply`, `az deployment … create`, `git push` simple) ne sont pas
 * concernés.
 *
 * NON JUGÉ (déclaré). Un geste joué par un script dont le texte n'est pas dans la commande ; une commande
 * lue d'un fichier ; une commande envoyée par `ssh` ou `wsl` ; un alias ; les autres
 * nuages (aws, gcloud, kubectl), faute de fait fondateur ; `terraform state push|mv`, `gh repo archive`,
 * `gh repo deploy-key add`. Surtout : le hook ne prouve pas que l'humain a réellement approuvé le lot ;
 * `reponse_humaine` doit citer ses mots, et la revue du lot (qui l'a écrit, quand, avec quels mots) reste
 * possible parce que le fichier garde chaque ligne.
 *
 * D-194 (b) (10/11/2026) : CE QUE LA GARDE NE SAIT PAS LIRE EST REFUSÉ, SAUF ACCORD. La lecture suit le dialecte de l'outil
 * (Bash : `\`, `$'…'`, commentaires `#` ; PowerShell : accent grave, here-strings `@'…'@`, `<# … #>`) et résout `eval`, `iex`,
 * `Start-Process`, `ForEach-Object { … }`, `-EncodedCommand`, `"$(…)"`, les alias PowerShell `curl` et `wget`, les abréviations
 * de paramètre (`-Me Delete`) et les options globales d'`az` placées entre ses mots (`az group --subscription S delete`). Ce
 * qui reste illisible (guillemets non équilibrés, document en ligne sans fin, texte évalué non littéral, commande dans une
 * variable, encodage, imbrication trop profonde) est REFUSÉ quand la commande porte un outil distant, sauf lot d'accord qui en
 * cite le texte exact ; une panne du juge et une entrée illisible sont refusées. Le réglage `FORGE_GARDE_ILLISIBLE=laisse`, lu
 * dans l'environnement du harnais et jamais dans la commande, rétablit l'ancien comportement. Détail et limites :
 * `references\GESTES-DISTANTS.md`, « Ce que la garde ne sait pas lire ».
 *
 * D-195 (b) (10/11/2026) : L'ACCORD EST CITÉ, LA COMMANDE EST NOMMÉE. Un lot ne couvre une commande que si sa `reponse_humaine`
 * figure mot pour mot dans un message TAPÉ par l'humain (rôle user, ni `tool_result`, ni injection de hook, ni `<system-reminder>`,
 * ni corps de skill, ni `<task-notification>`), lu dans `transcript_path` au moment où le lot couvre. Une commande approuvée nomme
 * l'outil et son verbe en mots littéraux avant tout joker : `*`, `az *` et `az group` ne couvrent plus `az group delete -n prod`.
 * `--poser` refuse les deux défauts dès l'écriture ; la transcription lui vient de `--transcript` ou de `CLAUDE_CODE_SESSION_ID`.
 *
 * TF-2084 (04/11/2026, RT-39) : le même hook tient le registre des gestes distants EN COURS (`forge\gestes-en-cours.jsonl`,
 * `oracles\lib-gestes-en-cours.mjs`) : il inscrit le début d'un geste qui modifie l'état distant (PreToolUse), sa fin (PostToolUse),
 * et AVERTIT quand une autre session du produit a un geste ouvert sur la même ressource. Il ne refuse jamais pour cela.
 * Liste et limites : `references\GESTES-DISTANTS.md`, section « Deux sessions, une ressource ».
 *
 * TF-2128 (04/11/2026, D-168 (a), RP-6 du lot Produit-86 20261103d) : UNE EXCEPTION à la décision groupée. Le retrait
 * (`az … delete|remove`, `Remove-Az*`) d'une ressource passe sans lot si, et seulement si, trois conditions tiennent, lues au
 * registre `forge\gestes-en-cours.jsonl` : (a) la ressource a été créée par la MÊME session, (b) sa création est consignée avec
 * son identifiant (événement `creation`, écrit au retour d'un outil réussi), (c) aucune dépendance consignée (aucune création ou
 * modification postérieure ne la cite en paramètre, aucun paramètre par variable ou fichier, aucun déploiement ni terraform
 * depuis). Une condition non tenue garde le refus, et le message nomme laquelle. Jamais admis : un groupe de ressources (son
 * contenu n'est pas énumérable), `purge`, les droits, terraform, DELETE HTTP, `gh`, l'histoire git. Non jugé : voir
 * `references\GESTES-DISTANTS.md`, « Le retrait d'une ressource que la session a créée ».
 *
 * Usage : node oracles\hook-gestes-distants.mjs                      (stdin : JSON du hook PreToolUse ou PostToolUse)
 *         node oracles\hook-gestes-distants.mjs --ouvrir --ressource <objet> [--session <id>] [--geste <texte>] [--duree-min N]
 *         node oracles\hook-gestes-distants.mjs --clore [--ressource <objet>] [--session <id>] | --lister
 *         node oracles\hook-gestes-distants.mjs --poser --lot <lot.json> [--transcript <session.jsonl>] [--racine <dossier>] [--duree-h N] [--session <id>]
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr) ; en mode --poser : 0 posé · 1 lot refusé.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { racineConfigInstallee } from "../scripts/lib-config-installee.mjs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DUREE_DEFAUT_MIN, avertissement, clore, creationsVivantes, ecrireLigne, gestesOuverts, jugerRetrait, ligneCreation, ligneModification, ligneRetrait, lireRegistre, ouvrir, viseeParCible } from "./lib-gestes-en-cours.mjs";

export const OUTILS = new Set(["Bash", "PowerShell"]);
export const DUREE_MAX_H = 24;
const H = 3_600_000;

// ---------------------------------------------------------------------------------------------
// 1. Lecture d'une commande : segments, mots, outil
// ---------------------------------------------------------------------------------------------

/**
 * Le dialecte de l'outil du harnais (D-194 (b)) : `bash` (Git Bash), `ps` (PowerShell) ; `cmd` pour `cmd /c`. Sans dialecte
 * (null), la lecture d'avant : guillemets simples et doubles, sans échappement ni commentaire.
 */
export const dialecteDe = (outil) => ({ Bash: "bash", PowerShell: "ps" })[outil] ?? null;
const ECHAPPEMENT = { bash: "\\", ps: "`", cmd: "^" };
/** Un `#` ouvre un commentaire en début de mot : `# l'essai` ne laisse plus un guillemet ouvert sur la suite (D-194 (b)). */
const debutDeMot = (t, k) => k === 0 || /[\s;&|(){}]/.test(t[k - 1]);

/**
 * Le document en ligne qu'ouvre cette ligne, hors guillemets et hors commentaire : { fin, developpe } pour `<<MOT`,
 * { chaine } pour un here-string PowerShell (`@'` ou `@"` en fin de ligne) ; null sinon. `etat.q` porte le guillemet resté
 * ouvert d'une ligne à l'autre (D-98 (a) du 29/10/2026), `etat.bloc` un commentaire `<# … #>` de PowerShell.
 * D-194 (b) : le `'` de `@'` n'ouvre plus de guillemet. Il l'ouvrait toujours, et la branche du here-string ne s'exécutait
 * jamais : une apostrophe du corps (« it's fine ») fermait ce faux guillemet et masquait les lignes suivantes, ou faisait
 * lire le corps comme des commandes.
 */
function motDeDocument(ligne, etat, dialecte = null) {
  const esc = ECHAPPEMENT[dialecte];
  for (let k = 0; k < ligne.length; k++) {
    const c = ligne[k];
    if (etat.bloc) { if (c === "#" && ligne[k + 1] === ">") { etat.bloc = false; k++; } continue; }
    if (etat.q) {
      if (dialecte && dialecte !== "cmd" && etat.q !== "'" && c === (etat.q === "$'" ? "\\" : esc)) { k++; continue; }
      if (c === (etat.q === "$'" ? "'" : etat.q) && (dialecte || ligne[k - 1] !== "\\")) etat.q = null;
      continue;
    }
    if (dialecte && dialecte !== "cmd" && c === esc) { k++; continue; }
    if (dialecte === "ps" && c === "<" && ligne[k + 1] === "#") { etat.bloc = true; k++; continue; }
    if (c === "#" && dialecte !== "cmd" && (dialecte ? debutDeMot(ligne, k) : (k === 0 || /\s/.test(ligne[k - 1])))) return null;
    if (dialecte !== "bash" && dialecte !== "cmd" && c === "@" && (ligne[k + 1] === "'" || ligne[k + 1] === '"') && !ligne.slice(k + 2).trim()) return { chaine: ligne[k + 1] };
    if (dialecte === "bash" && c === "$" && ligne[k + 1] === "'") { etat.q = "$'"; k++; continue; }
    if (c === '"' || (c === "'" && dialecte !== "cmd")) { etat.q = c; continue; }
    if (c === "<" && ligne[k + 1] === "<" && ligne[k + 2] !== "<") {
      const h = /^<<-?\s*(['"]?)([A-Za-z_]\w*)\1/.exec(ligne.slice(k));
      if (h) return { fin: h[2], developpe: !h[1] };
    }
  }
  return null;
}

/** Le contenu de la parenthèse (ou de l'accolade) ouverte en `t[i]`, jusqu'à sa fermante, guillemets sautés : { contenu, fin } ou null. */
function parenthese(t, i) {
  const ouvre = t[i], ferme = ouvre === "{" ? "}" : ")";
  let prof = 0, q = null;
  for (let k = i; k < t.length; k++) {
    const c = t[k];
    if (q) { if (c === q) q = null; continue; }
    if (c === "'" || c === '"') { q = c; continue; }
    if (c === ouvre) prof++;
    else if (c === ferme && --prof === 0) return { contenu: t.slice(i + 1, k), fin: k };
  }
  return null;
}

/**
 * Ce qu'exécute un `$( … )` : son contenu, sauf un développement arithmétique `$(( … ))`, dont seules les substitutions
 * imbriquées s'exécutent (`$(( $(date +%s) - t0 ))`).
 */
const executeDe = (contenu, dialecte) => (contenu.startsWith("(") && contenu.endsWith(")") ? substitutionsDe(contenu.slice(1, -1), dialecte) : [contenu]);

/** Les `$( … )` d'un texte que le shell développe (corps d'un `<<EOF` non cité, d'un `@" … "@`), et les accents graves en bash. */
function substitutionsDe(texte, dialecte) {
  const sortie = [];
  for (let k = 0; k < texte.length; k++) {
    if (texte[k] === "$" && texte[k + 1] === "(") { const p = parenthese(texte, k + 1); if (p) { sortie.push(...executeDe(p.contenu, dialecte)); k = p.fin; } }
    else if (dialecte !== "ps" && texte[k] === "`") { const j = texte.indexOf("`", k + 1); if (j > k) { sortie.push(texte.slice(k + 1, j)); k = j; } }
  }
  return sortie;
}

/**
 * Les documents en ligne d'un texte (`<<EOF … EOF`, `@' … '@`), corps ôtés : du texte écrit, pas des commandes.
 * D-98 (a) : `echo "use <<EOF"` ou un `<<EOF` de commentaire n'ouvrent aucun document, et un document sans sa ligne de fin
 * ne masque rien. D-194 (b) : la ligne qui ouvre un here-string garde `''` à la place de `@'`, ce qui suit `'@` sur la ligne
 * de fin reste lu, les `$( … )` d'un corps que le shell développe sont rendus à juger, et un document sans ligne de fin est
 * compté (`nonFermes`). Rend { texte, nonFermes, substitutions }.
 */
function lireDocuments(texte, dialecte = null) {
  const lignes = String(texte || "").split(/\r?\n/);
  const sortie = [], substitutions = [];
  const etat = { q: null, bloc: false };
  let fin = null, reste = false, developpe = false, nonFermes = 0;
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    if (fin !== null) {
      const m = fin.exec(ligne);
      if (!m) { if (developpe && dialecte) substitutions.push(...substitutionsDe(ligne, dialecte)); continue; }
      fin = null;
      const suite = reste ? ligne.slice(m[0].length) : "";
      if (suite.trim()) { sortie.push(suite); motDeDocument(suite, etat, dialecte); }
      continue;
    }
    const doc = motDeDocument(ligne, etat, dialecte);
    if (doc?.fin) {
      sortie.push(ligne);
      const f = new RegExp(`^\\s*${doc.fin}\\s*$`);
      if (lignes.slice(i + 1).some((l) => f.test(l))) { fin = f; reste = false; developpe = doc.developpe; } else nonFermes++;
      continue;
    }
    if (doc?.chaine) {
      const f = new RegExp(`^${doc.chaine}@`);
      if (lignes.slice(i + 1).some((l) => f.test(l))) { sortie.push(ligne.replace(/@['"]\s*$/, "''")); fin = f; reste = true; developpe = doc.chaine === '"'; }
      else { nonFermes++; sortie.push(ligne); }
      continue;
    }
    sortie.push(ligne);
  }
  return { texte: sortie.join("\n"), nonFermes, substitutions };
}

/** Le texte d'une commande sans le corps de ses documents en ligne (voir `lireDocuments`). */
export function sansCorpsDeDocuments(texte, dialecte = null) {
  return lireDocuments(texte, dialecte).texte;
}

/**
 * La lecture d'une commande composée dans le dialecte de son outil (D-194 (b)) : { segments, separateurs, ouvert, nonFermes,
 * substitutions }. `separateurs[i]` est l'opérateur qui précède le segment i (`|` pour un tube) ; `ouvert` le guillemet resté
 * ouvert à la fin du texte (la suite n'a pas pu être coupée en segments) ; `substitutions` le texte des `$( … )` lus entre
 * guillemets doubles et dans les corps développés : bash et PowerShell les exécutent.
 */
export function lireCommande(commande, dialecte = null) {
  const docs = lireDocuments(commande, dialecte);
  const t = docs.texte;
  const esc = ECHAPPEMENT[dialecte];
  const segments = [], separateurs = [], substitutions = [...docs.substitutions];
  let cur = "", q = null, commentaire = false, bloc = false, sep = null;
  const pousser = (s) => { if (cur.trim()) { segments.push(cur); separateurs.push(sep); } cur = ""; sep = s; };
  for (let i = 0; i < t.length; i++) {
    const c = t[i], n = t[i + 1];
    if (bloc) { if (c === "#" && n === ">") { bloc = false; i++; } continue; }
    if (commentaire) { if (c === "\n") { commentaire = false; pousser("\n"); } continue; }
    if (q) {
      if (q === "'") { cur += c; if (c === "'") q = null; continue; }
      if (q === "$'") { cur += c; if (c === "\\") { cur += n ?? ""; i++; } else if (c === "'") q = null; continue; }
      if (dialecte && dialecte !== "cmd" && c === esc) { cur += c + (n ?? ""); i++; continue; }
      if (dialecte && dialecte !== "cmd" && c === "$" && n === "(") {
        const p = parenthese(t, i + 1);
        if (p) { substitutions.push(...executeDe(p.contenu, dialecte)); cur += t.slice(i, p.fin + 1); i = p.fin; continue; }
      }
      if (dialecte === "bash" && c === "`") {
        const j = t.indexOf("`", i + 1);
        if (j > i) { substitutions.push(t.slice(i + 1, j)); cur += t.slice(i, j + 1); i = j; continue; }
      }
      cur += c;
      if (c === '"') q = null;
      continue;
    }
    if ((c === "`" || c === "\\") && (n === "\n" || (n === "\r" && t[i + 2] === "\n")) && (!dialecte || c === esc)) { i += n === "\r" ? 2 : 1; cur += " "; continue; }
    if (dialecte && c === esc) { cur += c + (n ?? ""); i++; continue; }
    // Un `$( … )` reste dans son segment, et son contenu est jugé à part ; un tableau bash `NOM=( … )` est une affectation.
    if (dialecte && dialecte !== "cmd" && c === "$" && n === "(") {
      const p = parenthese(t, i + 1);
      if (p) { substitutions.push(...executeDe(p.contenu, dialecte)); cur += t.slice(i, p.fin + 1); i = p.fin; continue; }
    }
    if (dialecte === "bash" && c === "(" && /[A-Za-z0-9_]\+?=$/.test(cur)) {
      const p = parenthese(t, i);
      if (p) { cur += t.slice(i, p.fin + 1); i = p.fin; continue; }
    }
    if (dialecte === "ps" && c === "@" && n === "{") { // une table `@{ a = 1; b = 2 }` : ses `;` ne coupent rien
      const p = parenthese(t, i + 1);
      if (p) { substitutions.push(...substitutionsDe(p.contenu, dialecte)); cur += t.slice(i, p.fin + 1); i = p.fin; continue; }
    }
    if (dialecte === "ps" && c === "<" && n === "#") { bloc = true; i++; continue; }
    if (dialecte && dialecte !== "cmd" && c === "#" && debutDeMot(t, i)) { commentaire = true; continue; }
    if (dialecte === "bash" && c === "$" && n === "'") { q = "$'"; cur += "$'"; i++; continue; }
    if (c === '"' || (c === "'" && dialecte !== "cmd")) { q = c; cur += c; continue; }
    if (c === "\n" || c === "\r" || c === ";" || c === "(" || c === ")") { pousser(c === "\r" ? "\n" : c); continue; }
    if (c === "|") { const double = n === "|"; pousser(double ? "||" : "|"); if (double) i++; continue; }
    if (c === "&") {
      if (t[i - 1] === ">" || n === ">") { cur += c; continue; }
      if (n === "&") { pousser("&&"); i++; continue; }
      pousser("&");
      if (dialecte === "ps") cur = "& "; // l'opérateur d'appel de PowerShell reste en tête de ce qu'il appelle
      continue;
    }
    cur += c;
  }
  pousser(null);
  return { segments, separateurs, ouvert: q, nonFermes: docs.nonFermes, substitutions };
}

/** Les segments d'une commande composée : opérateurs hors guillemets (`&&`, `||`, `;`, `|`, `&`, saut de ligne, parenthèses). */
export function segmenter(commande, dialecte = null) {
  return lireCommande(commande, dialecte).segments;
}

/** Les mots d'un segment, guillemets ôtés ; dans un dialecte, les caractères échappés restent littéraux (D-194 (b)). */
export function mots(segment, dialecte = null) {
  const out = [];
  const s = String(segment || "");
  const esc = ECHAPPEMENT[dialecte];
  let cur = "", actif = false, q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (q === "'") { if (c !== "'") cur += c; else if (dialecte === "ps" && s[i + 1] === "'") { cur += "'"; i++; } else q = null; continue; }
      if (q === "$'") { if (c === "\\" && i + 1 < s.length) cur += s[++i]; else if (c === "'") q = null; else cur += c; continue; }
      if (dialecte === "ps" && c === esc && i + 1 < s.length) { cur += s[++i]; continue; }
      if (dialecte === "bash" && c === "\\" && /["\\$`\n]/.test(s[i + 1] ?? "")) { cur += s[++i]; continue; }
      if (c !== '"') cur += c; else if (dialecte === "ps" && s[i + 1] === '"') { cur += '"'; i++; } else q = null;
      continue;
    }
    if (dialecte && c === esc && i + 1 < s.length) { cur += s[++i]; actif = true; continue; }
    if (dialecte && dialecte !== "cmd" && ((c === "$" && s[i + 1] === "(") || (dialecte === "ps" && c === "@" && s[i + 1] === "{") || (dialecte === "bash" && c === "(" && /[A-Za-z0-9_]\+?=$/.test(cur)))) {
      const p = parenthese(s, c === "(" ? i : i + 1);
      if (p) { cur += s.slice(i, p.fin + 1); i = p.fin; actif = true; continue; }
    }
    if (dialecte === "bash" && c === "$" && s[i + 1] === "'") { q = "$'"; actif = true; i++; continue; }
    if (c === '"' || (c === "'" && dialecte !== "cmd")) { q = c; actif = true; continue; }
    if (/\s/.test(c)) { if (actif) { out.push(cur); cur = ""; actif = false; } continue; }
    cur += c; actif = true;
  }
  if (actif) out.push(cur);
  return out;
}

/** Le nom d'un outil : chemin et extension ôtés ; D-194 (b) : un numéro de version aussi (`terraform-1.9.8.exe` est terraform). */
const nomOutil = (w) => String(w).split(/[\\/]/).pop().toLowerCase().replace(/\.(exe|cmd|bat|ps1|com)$/, "").replace(/[-_]v?\d+(?:\.\d+)+$/, "");
const OUTILS_JUGES = new Set(["az", "terraform", "tofu", "gh", "git", "wrangler", "curl", "wget", "invoke-restmethod", "irm", "invoke-webrequest", "iwr", "invoke-azrestmethod"]);
/** Le dialecte du texte qu'un shell exécute (`bash -c`, `pwsh -Command`, `cmd /c`). */
const DIALECTE_SHELL = { bash: "bash", sh: "bash", zsh: "bash", dash: "bash", pwsh: "ps", powershell: "ps", cmd: "cmd" };
/** D-194 (b) : les cmdlets qui exécutent un bloc `{ … }` (`ForEach-Object`, `Invoke-Command`) sont des enveloppes : le bloc est lu. */
const ENVELOPPES = new Set(["sudo", "env", "time", "nohup", "xargs", "command", "exec", "call", "start", "timeout", "stdbuf", "nice", "then", "do", "else", "{", "}", "&", ".", "!",
  "foreach-object", "%", "start-job", "start-threadjob", "invoke-command", "icm"]);
/** D-194 (b) : `eval`, `iex` et `Invoke-Expression` exécutent un texte ; il est lu comme une commande. */
const EVALUATEURS = new Set(["eval", "iex", "invoke-expression"]);
const START_PROCESS = new Set(["start-process", "saps"]);
/** D-98 (a) : `if az group delete …`, `while …`. Le mot de contrôle se saute seul, sans ouvrir une enveloppe. */
const MOTS_DE_CONTROLE = new Set(["if", "elif", "while", "until"]);
const CMDLETS_LOCAUX = new Set(["remove-azcontext", "remove-azenvironment", "remove-azdefault"]);
/** TF-2128 : les cmdlets Az qui écrivent, lues pour le registre des créations (elles ne sont pas jugées destructives pour autant). */
const CMDLET_AZ_ECRITURE = /^(new|set|update|add|remove|start|stop|restart|grant|revoke|register|unregister|move|import|publish|enable|disable)-az[a-z0-9]+$/;
const estCmdlet = (n) => (/^remove-(az|mg)[a-z0-9]+$/.test(n) && !CMDLETS_LOCAUX.has(n))
  || /^(new|set)-az(roleassignment|policyassignment|policyexemption)$/.test(n)
  || /^new-mg(serviceprincipalapproleassignment|userapproleassignment|oauth2permissiongrant|groupmember|groupowner|directoryrolemember\w*)$/.test(n);

/** Le texte d'un jeton base64 (`-EncodedCommand`, UTF-16LE par défaut), s'il se lit : 90 % de caractères imprimables au moins. */
function decoderBase64(b, codage = "utf16le") {
  try {
    const t = Buffer.from(String(b).replace(/\s+/g, ""), "base64").toString(codage);
    const imprimables = (t.match(/[\x09\x0a\x0d\x20-\x7e]/g) || []).length;
    return t.trim() && imprimables / t.length >= 0.9 ? t : null;
  } catch { return null; }
}

/** PowerShell admet tout préfixe d'un nom de paramètre : `-c` et `-Com` valent `-Command` (D-194 (b)). */
const prefixeDe = (nom, plein, min = 1) => nom.length >= min && plein.startsWith(nom);
const PS_VALEURS = ["executionpolicy", "windowstyle", "version", "outputformat", "inputformat", "psconsolefile", "configurationname", "workingdirectory", "settingsfile", "custompipename"];

/** Le texte qu'exécute un shell : `bash -c "…"`, `pwsh -Command …` (abrégé), `-EncodedCommand <base64>` décodé, `cmd /c …`. */
function interneDeShell(n, args) {
  const d = DIALECTE_SHELL[n];
  if (d === "cmd") {
    const k = args.findIndex((x) => /^\/[ck]$/i.test(x));
    return k < 0 ? null : { interne: args.slice(k + 1).join(" "), dialecte: "cmd" };
  }
  if (d === "bash") {
    const k = args.findIndex((x) => /^-[A-Za-z]*c$/.test(x));
    return k < 0 ? null : { interne: args.slice(k + 1).join(" "), dialecte: "bash" };
  }
  for (let k = 0; k < args.length; k++) {
    const p = /^[-/]([A-Za-z]+)(?::(.*))?$/.exec(args[k]);
    if (!p) return { interne: args.slice(k).join(" "), dialecte: "ps" }; // powershell.exe exécute les mots qui suivent ses options
    const nom = p[1].toLowerCase(), colle = p[2];
    if (prefixeDe(nom, "command")) return { interne: colle !== undefined ? [colle, ...args.slice(k + 1)].join(" ") : args.slice(k + 1).join(" "), dialecte: "ps" };
    if (nom === "e" || nom === "ec" || prefixeDe(nom, "encodedcommand", 2)) {
      const brut = colle ?? args[k + 1] ?? "";
      const texte = decoderBase64(brut);
      return texte ? { interne: texte, dialecte: "ps" } : { interne: "", dialecte: "ps", illisible: "commande encodée illisible (-EncodedCommand)" };
    }
    if (prefixeDe(nom, "file")) return null; // un script : son texte n'est pas dans la commande
    if (colle === undefined && (nom === "ep" || PS_VALEURS.some((v) => prefixeDe(nom, v, 2)))) k++;
  }
  return null;
}

/** D-194 (b) : le texte qu'exécutent `eval` et `iex`. Une variable, une expression ou un texte reçu par le tube ne se lisent pas. */
function interneEvalue(args, dialecte, ctx = null) {
  const a = dialecte === "bash" ? args : args.filter((w) => !/^-c(o(m(m(a(n(d)?)?)?)?)?)?$/i.test(w));
  let texte = a.join(" ");
  if (/^\s*\$/.test(texte)) { const r = resoudreValeur(texte, ctx, dialecte); if (r !== null && r.trim()) texte = r; } // `C="az …"; eval "$C"`
  if (!texte.trim() || /^\s*[$([]/.test(texte) || (dialecte === "bash" && texte.includes("`"))) return { interne: "", dialecte, illisible: "texte évalué non littéral (eval, iex, Invoke-Expression)" };
  return { interne: texte, dialecte };
}

const SP_VALEURS = ["workingdirectory", "verb", "windowstyle", "redirectstandardinput", "redirectstandardoutput", "redirectstandarderror", "credential"];
const estOptionStartProcess = (w) => { const p = /^-([A-Za-z]+)(?::.*)?$/.exec(w); const nom = p?.[1]?.toLowerCase() ?? ""; return nom === "args" || prefixeDe(nom, "argumentlist", 2) || prefixeDe(nom, "filepath", 2); };

/** D-194 (b) : `Start-Process az -ArgumentList "group delete -n x"` lance `az group delete -n x` ; ce texte est lu comme une commande. */
function interneDeStartProcess(args, ctx = null) {
  let fichier = null;
  const liste = [], positionnels = [];
  for (let k = 0; k < args.length; k++) {
    const p = /^-([A-Za-z]+)(?::(.*))?$/.exec(args[k]);
    if (!p) { positionnels.push(args[k]); continue; }
    const nom = p[1].toLowerCase(), colle = p[2];
    if (prefixeDe(nom, "filepath") || nom === "path" || nom === "pspath") { fichier = colle ?? args[++k] ?? null; continue; }
    if (nom === "args" || prefixeDe(nom, "argumentlist")) {
      if (colle !== undefined) liste.push(colle);
      else while (args[k + 1] !== undefined && !/^-[A-Za-z]/.test(args[k + 1])) liste.push(args[++k]);
      continue;
    }
    if (colle === undefined && SP_VALEURS.some((v) => prefixeDe(nom, v, 2))) k++;
  }
  if (!fichier) fichier = positionnels.shift() ?? null;
  if (!liste.length) liste.push(...positionnels);
  if (!fichier) return null;
  if (fichier.startsWith("$")) fichier = resoudreValeur(fichier, ctx, "ps") ?? fichier; // `$exe = "…"; Start-Process $exe`
  if (/^[$(]/.test(fichier)) return { interne: "", dialecte: "ps", illisible: "commande dans une variable (Start-Process)" };
  return { interne: [fichier, ...liste.map((x) => x.replace(/^@\(|\)$/g, "").replace(/,/g, " "))].join(" "), dialecte: "ps" };
}

/**
 * Trouve l'outil joué dans un segment, derrière les enveloppes (`sudo`, `env`, `xargs`, `ForEach-Object`…), les affectations
 * (`VAR=x`, `$r =`), les shells (`bash -c "…"`, `pwsh -Command …`, `cmd /c …`) et, depuis D-194 (b), `eval`, `iex` et
 * `Start-Process`. Rend { outil, args, mot } | { interne, dialecte, illisible? } (texte à rejuger) | null.
 */
export function localiser(m, dialecte = null, ctx = null) {
  let enveloppe = false;
  for (let i = 0; i < m.length; i++) {
    const w = m[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w)) continue;
    if (/^\$[\w:.]+$/.test(w) && m[i + 1] === "=") { i++; continue; }
    const n = nomOutil(w);
    if (OUTILS_JUGES.has(n) || CLIENTS_BASE.has(n) || ARRET.has(n) || estCmdlet(n) || CMDLET_AZ_ECRITURE.test(n)) return { outil: n, args: m.slice(i + 1), mot: w };
    if (DIALECTE_SHELL[n]) return interneDeShell(n, m.slice(i + 1));
    if (EVALUATEURS.has(n)) return interneEvalue(m.slice(i + 1), dialecte, ctx);
    if (START_PROCESS.has(n) || (n === "start" && m.slice(i + 1).some(estOptionStartProcess))) return interneDeStartProcess(m.slice(i + 1), ctx);
    if (MOTS_DE_CONTROLE.has(n)) continue;
    // D-194 (b) : une fonction que la commande définit (`m(){ … "$@" … }; m gh api …`) joue ses arguments : c'est une enveloppe.
    if (ENVELOPPES.has(n) || ctx?.fonctions?.has(n)) { enveloppe = true; continue; }
    if (enveloppe) continue;
    return null;
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// 1 bis. Les variables et les fonctions que la commande définit elle-même (D-194 (b))
// ---------------------------------------------------------------------------------------------

/** Les mots qui précèdent la commande jouée sans la changer. */
const PREFIXES = new Set(["sudo", "env", "time", "nohup", "command", "exec", "timeout", "stdbuf", "nice", "then", "do", "else", "!"]);

/**
 * Les variables qu'une commande affecte (`SP="C:\…"`, `export X=y`, `$exe = "…"`) et les fonctions qu'elle définit (`m(){ … }`,
 * `function m { … }`) : { variables, fonctions }, ajoutées à celles du `parent` (le texte qui contient celui-ci). Noms en
 * minuscules sous PowerShell, et pour les fonctions.
 */
export function contexteDe(commande, dialecte = null, parent = null) {
  const variables = new Map(parent?.variables ?? []), fonctions = new Set(parent?.fonctions ?? []);
  const texte = parent?.texte ?? String(commande ?? ""); // la commande entière : D-196 (b) y cherche ce qui alimente une connexion
  if (!dialecte || dialecte === "cmd") return { variables, fonctions, texte };
  const lu = lireCommande(commande, dialecte);
  for (const s of lu.segments) {
    const m = mots(s, dialecte);
    if (dialecte === "ps") {
      // Une valeur littérale : entre guillemets, une table `@{ … }`, un nombre. `$c = Get-Content f` affecte la SORTIE d'une commande : inconnue.
      const p = /^\s*(?:&\s*)?\$(?:env:)?\{?([A-Za-z_]\w*)\}?\s*=(?!=)\s*([^]*)$/.exec(s);
      if (p) variables.set(p[1].toLowerCase(), /^(["']|@["'{]|\d)/.test(p[2].trim()) ? mots(p[2].trim(), "ps").join(" ") : null);
      continue;
    }
    for (let k = 0; k < m.length; k++) {
      if (["export", "local", "declare", "readonly", "typeset"].includes(m[k]) || (k > 0 && /^-[A-Za-z]+$/.test(m[k]))) continue;
      const p = /^([A-Za-z_][A-Za-z0-9_]*)\+?=([^]*)$/.exec(m[k]);
      if (!p) break;
      variables.set(p[1], p[2]);
    }
  }
  const formes = dialecte === "ps" ? [/\bfunction\s+([A-Za-z_][\w-]*)/gi]
    : [/(?:^|[\s;&|(){}])(?:function\s+)?([A-Za-z_][\w.:-]*)\s*\(\s*\)\s*\{/g, /(?:^|[\s;&|{}])function\s+([A-Za-z_][\w.:-]*)\s*\{/g];
  for (const re of formes) for (const f of lireDocuments(commande, dialecte).texte.matchAll(re)) fonctions.add(f[1].toLowerCase());
  return { variables, fonctions, texte };
}

/** La valeur lisible d'un texte de variable : variables imbriquées résolues, `$(where X)`, `$(which X)`, `$(find … -name X)` valent X ; null sinon. */
function resoudreValeur(valeur, ctx, dialecte, profondeur = 0) {
  if (valeur === undefined || valeur === null || profondeur > 3) return null;
  let v = String(valeur).trim();
  const cherche = /^\$\(\s*(?:where(?:\.exe)?|which|command\s+-v|type\s+-[pP]|Get-Command)\s+["']?([^\s"'|)]+)/i.exec(v)
    || /^\$\(\s*find\b[^)]*?-i?name\s+["']?([^\s"'|)]+)/.exec(v)
    || /^\(\s*Get-Command\s+["']?([^\s"')]+)["']?\s*\)\.(?:Source|Path|Definition)$/i.exec(v);
  if (cherche) return cherche[1];
  if (/\$\(/.test(v) || (dialecte === "bash" && v.includes("`"))) return null;
  let inconnu = false;
  v = v.replace(/\$(?:env:)?(?:\{([^}]+)\}|([A-Za-z_]\w*))/g, (_, a, b) => {
    const nom = a ?? b;
    const r = resoudreValeur(ctx?.variables?.get(dialecte === "ps" ? nom.toLowerCase() : nom), ctx, dialecte, profondeur + 1);
    if (r === null) inconnu = true;
    return r ?? "";
  });
  return inconnu ? null : v;
}

/** Le texte d'une valeur de la commande, variables résolues (`hook-identite-sortante.mjs` y lit l'adresse d'une requête) ; null s'il ne se lit pas. */
export const resoudreTexte = (texte, ctx, dialecte) => resoudreValeur(texte, ctx, dialecte);

/** Les mots que vaut un mot de variable (`$SP/x.exe`, `"$TF"`, `$(which az)`) ; [] pour `"$@"` dans une commande qui définit une fonction ; null s'il ne se lit pas. */
function resoudreMot(w, ctx, dialecte) {
  if (w.startsWith("$(")) { const r = resoudreValeur(w, ctx, dialecte); return r === null ? null : mots(r, dialecte); }
  const p = /^\$(?:env:)?(?:\{([^}]+)\}|([A-Za-z_]\w*|[@*#?$!0-9]))([^]*)$/.exec(w);
  if (!p) return null;
  const nom = p[1] ?? p[2], suffixe = p[3];
  if (/^[@*]$/.test(nom)) return ctx?.fonctions?.size ? [] : null; // les arguments d'une fonction : jugés là où elle est appelée
  const valeur = resoudreValeur(ctx?.variables?.get(dialecte === "ps" ? nom.toLowerCase() : nom), ctx, dialecte);
  if (valeur === null) return null;
  return suffixe ? [valeur + suffixe] : mots(valeur, dialecte);
}

/**
 * Le segment, mot de tête résolu quand la commande jouée est une variable que la commande affecte elle-même (`SP=…; "$SP/x.exe"`,
 * `$exe = "…"; & $exe`) : { m, inconnu }. `inconnu` : la commande jouée est une variable que rien ne résout. Sous PowerShell,
 * `$x` seul est une expression ; `& $x` et `. $x` sont des appels.
 */
function teteResolue(m, dialecte, ctx) {
  let appel = false;
  for (let k = 0; k < m.length; k++) {
    const w = m[k];
    if (/^[A-Za-z_][A-Za-z0-9_]*\+?=/.test(w)) continue;
    if (/^\$[\w:.]+$/.test(w) && m[k + 1] === "=") { k++; continue; }
    if (w === "&" || w === ".") { appel = true; continue; }
    const n = nomOutil(w);
    if (MOTS_DE_CONTROLE.has(n) || PREFIXES.has(n)) continue;
    if (dialecte === "ps" && appel && w.startsWith("(")) return { m, inconnu: true };
    if (!w.startsWith("$") || (dialecte === "ps" && !appel)) return { m, inconnu: false };
    const r = resoudreMot(w, ctx, dialecte);
    if (r === null) return { m, inconnu: true };
    return { m: [...m.slice(0, k), ...r, ...m.slice(k + 1)], inconnu: false };
  }
  return { m, inconnu: dialecte === "ps" && appel && m.length === 1 }; // `& (Get-Command az) …` : l'appel vise une expression
}

// ---------------------------------------------------------------------------------------------
// 2. La liste fermée
// ---------------------------------------------------------------------------------------------

/** Les mots avant la première option, après les options de tête. */
function positionnels(args) {
  let i = 0;
  while (i < args.length && args[i].startsWith("-")) i++;
  const p = [];
  for (; i < args.length && !args[i].startsWith("-"); i++) p.push(args[i].toLowerCase());
  return p;
}

/**
 * Les mots de la commande `az`, au-delà des options globales placées entre eux (D-194 (b)) : `az group --subscription S delete`
 * rendait `group` seul, et la suppression passait. Une autre option arrête la lecture, comme avant.
 */
const AZ_GLOBALES_A_VALEUR = new Set(["--subscription", "--output", "-o", "--query", "--org", "--organization", "--project", "-p"]);
const AZ_DRAPEAUX = new Set(["--debug", "--verbose", "--only-show-errors", "--help", "-h", "--yes", "-y", "--no-wait"]);
function positionnelsAz(args) {
  const p = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (!a.startsWith("-")) { p.push(a.toLowerCase()); continue; }
    const cle = a.split("=")[0].toLowerCase();
    if (AZ_DRAPEAUX.has(cle)) continue;
    if (AZ_GLOBALES_A_VALEUR.has(cle)) { if (!a.includes("=")) i++; continue; }
    if (!p.length) continue;
    break;
  }
  return p;
}

const VERBE_SUPPRESSION = /^(delete|purge|remove)(-[a-z0-9-]+)?$/;
const AZ_LOCAL = new Set(["extension", "config", "cache", "version", "login", "logout", "configure", "interactive", "feedback", "upgrade", "find", "survey", "self-test", "completion"]);
const AZ_DROITS = [
  /(^| )role (assignment|definition) (create|update)\b/,
  /^ad app permission (add|grant|admin-consent)\b/,
  /^ad (group|app|sp) (member|owner) add\b/,
  /^keyvault set-policy\b/,
  /^devops security (group membership add|group create|permission (update|reset|reset-all))\b/,
  /^devops user (add|update)\b/,
  // D-196 (b) : les politiques de branche et les politiques Azure, dont l'exemption contourne la règle (retrait : `delete`, déjà jugé).
  /^repos policy (?:[a-z0-9-]+ )*(create|update)\b/,
  /^policy (assignment|exemption) (create|update)\b/,
];

const HTTP = {
  curl: { cles: ["-X", "--request"], implicite: /^(-d|--data(-[a-z-]+)?|--json|-F|--form(-string)?|-T|--upload-file)$/, ps: false },
  wget: { cles: ["--method"], implicite: /^--(post-data|post-file|body-data|body-file)(=.*)?$/, ps: false },
  "gh api": { cles: ["-X", "--method"], implicite: /^(-f|-F|--field|--raw-field|--input)$/, ps: false },
  "az rest": { cles: ["--method", "-m"], implicite: null, ps: false },
  "az devops invoke": { cles: ["--http-method"], implicite: null, ps: false },
  ps: { cles: ["-method", "-custommethod"], implicite: /^-(b|bo|bod|body|infi|infil|infile)$/i, ps: true },
};
const HTTP_PS = new Set(["invoke-restmethod", "irm", "invoke-webrequest", "iwr", "invoke-azrestmethod"]);

/** Valeur d'une option : `-X DELETE`, `-XDELETE`, `--request=DELETE`, `-Method:Delete`, et sous PowerShell tout préfixe (`-Me Delete`). */
function valeurOption(args, cles, ps) {
  for (let k = 0; k < args.length; k++) {
    if (ps) {
      // D-194 (b) : `irm -Me Delete` et `-Meth Delete` valent `-Method Delete` ; seul `-method` entier était lu.
      const p = /^-([A-Za-z]+)(?::(.*))?$/.exec(args[k]);
      if (p && cles.some((cle) => { const plein = cle.replace(/^-+/, ""); return prefixeDe(p[1].toLowerCase(), plein, plein === "method" ? 1 : 2); })) return p[2] !== undefined ? p[2] : (args[k + 1] ?? null);
      continue;
    }
    const a = args[k];
    for (const cle of cles) {
      if (a === cle) return args[k + 1] ?? null;
      if (a.startsWith(cle + "=") || (ps && a.startsWith(cle + ":"))) return args[k].slice(cle.length + 1);
      if (!ps && cle.length === 2 && a.startsWith(cle) && !a.startsWith("--") && a.length > 2) return args[k].slice(2);
      // D-98 (a) : options courtes groupées, `curl -sX DELETE`, `-sSXDELETE`.
      if (!ps && cle.length === 2 && !a.startsWith("--")) {
        const g = new RegExp(`^-[A-Za-z]+${cle[1]}(.*)$`).exec(a);
        if (g) return g[1] || (args[k + 1] ?? null);
      }
    }
  }
  return null;
}

const HOTES_LOCAUX = /^(localhost|127\.\d+\.\d+\.\d+|\[?::1\]?|0\.0\.0\.0)(:\d+)?$/i;
function toutLocal(texte) {
  const hotes = [...String(texte).matchAll(/https?:\/\/([^/\s'"?#]+)/gi)].map((m) => m[1].replace(/^[^@]*@/, ""));
  return hotes.length > 0 && hotes.every((h) => HOTES_LOCAUX.test(h));
}

const ADO_HOTE = /(dev\.azure\.com|vssps\.dev\.azure\.com|vsaex\.dev\.azure\.com|\.visualstudio\.com)/i;
const ADO_DROITS = /(accesscontrolentries|accesscontrollists|securityroles|roleassignments|graph\/(memberships|groups|users)|memberships|userentitlements|memberentitlements|groupentitlements|policy\/configurations|--area\s+policy\b)/i;
const GRAPH_HOTE = /graph\.(microsoft\.com|windows\.net)/i;
const GRAPH_DROITS = /(approleassignments|approleassignedto|oauth2permissiongrants|directoryroles|rolemanagement|roleassignments|\/members|\/owners|\$ref)/i;
const ARM_HOTE = /management\.azure\.com/i;
const ARM_DROITS = /microsoft\.authorization\/(roleassignments|roledefinitions|denyassignments|roleeligibility|roleassignmentschedule|policyassignments|policyexemptions)/i;
const GITHUB_DROITS = /(\/collaborators|\/memberships|\/invitations|\/branches\/[^\s/]+\/protection|\/rulesets|\/teams\/[^\s/]+\/(repos|memberships))/i;

/** Le texte vise-t-il un point d'accès de droits ? */
function pointDeDroits(texte, libelle) {
  if (libelle === "az devops invoke") return ADO_DROITS.test(texte);
  if (libelle === "gh api") return GITHUB_DROITS.test(texte);
  return (ADO_HOTE.test(texte) && ADO_DROITS.test(texte))
    || (GRAPH_HOTE.test(texte) && GRAPH_DROITS.test(texte))
    || (ARM_HOTE.test(texte) && ARM_DROITS.test(texte))
    || (/api\.github\.com/i.test(texte) && GITHUB_DROITS.test(texte));
}

function jugerHttp(libelle, cfg, args) {
  const texte = args.join(" ");
  let methode = valeurOption(args, cfg.cles, cfg.ps);
  if (!methode && cfg.implicite && args.some((a) => cfg.implicite.test(a))) methode = "POST";
  const M = String(methode || "GET").replace(/^.*::/, "").replace(/[()'"\s]/g, "").toUpperCase();
  if (M === "DELETE" && !toutLocal(texte)) return { categorie: "suppression", raison: `\`${libelle}\` en méthode DELETE : suppression sur un service distant` };
  if (["POST", "PUT", "PATCH"].includes(M) && pointDeDroits(texte, libelle)) return { categorie: "droits", raison: `\`${libelle}\` en méthode ${M} sur un point d'accès de droits : attribution ou modification de droits` };
  return null;
}

function jugerAz(args) {
  const pos = positionnelsAz(args);
  if (!pos.length) return null;
  if (pos[0] === "rest") return jugerHttp("az rest", HTTP["az rest"], args);
  if (pos[0] === "devops" && pos[1] === "invoke") return jugerHttp("az devops invoke", HTTP["az devops invoke"], args);
  if (AZ_LOCAL.has(pos[0]) || (pos[0] === "account" && pos[1] !== "management-group")) return null;
  const chemin = pos.join(" ");
  if (pos.slice(1).some((v) => VERBE_SUPPRESSION.test(v))) return { categorie: "suppression", raison: `\`az ${chemin}\` supprime ou purge une ressource distante` };
  if (AZ_DROITS.some((re) => re.test(chemin))) return { categorie: "droits", raison: `\`az ${chemin}\` attribue ou modifie des droits` };
  return null;
}

function jugerTerraform(outil, args) {
  const pos = positionnels(args);
  const sub = pos[0];
  if (sub === "destroy") return { categorie: "suppression", raison: `\`${outil} destroy\` détruit l'infrastructure gérée` };
  if (sub === "apply" && args.some((a) => /^--?destroy(=true)?$/.test(a))) return { categorie: "suppression", raison: `\`${outil} apply -destroy\` détruit l'infrastructure gérée` };
  if (sub === "state" && pos[1] === "rm") return { categorie: "suppression", raison: `\`${outil} state rm\` retire des ressources de l'état, qui ne se reconstruit pas à l'identique` };
  if (sub === "workspace" && pos[1] === "delete") return { categorie: "suppression", raison: `\`${outil} workspace delete\` supprime l'état d'un espace de travail` };
  return null;
}

function jugerGh(args) {
  const pos = positionnels(args);
  if (pos[0] === "api") return jugerHttp("gh api", HTTP["gh api"], args);
  if (pos[1] === "delete" && pos[0] !== "alias") return { categorie: "suppression", raison: `\`gh ${pos[0]} delete\` supprime une ressource sur GitHub` };
  return null;
}

const GIT_OPTIONS_A_VALEUR = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path"]);
const PUSH_OPTIONS_A_VALEUR = new Set(["-o", "--push-option", "--receive-pack", "--exec", "--repo"]);
function jugerGit(args) {
  let i = 0;
  while (i < args.length && args[i].startsWith("-")) i += GIT_OPTIONS_A_VALEUR.has(args[i]) ? 2 : 1;
  if (args[i] !== "push") return null;
  const reste = args.slice(i + 1);
  const histoire = (quoi) => ({ categorie: "histoire", raison: `\`git push\` ${quoi}` });
  for (let k = 0; k < reste.length; k++) {
    const a = reste[k];
    if (PUSH_OPTIONS_A_VALEUR.has(a)) { k++; continue; }
    if (/^--force(-with-lease|-if-includes)?(=.*)?$/.test(a)) return histoire(`avec \`${a}\` réécrit l'histoire distante`);
    if (a === "--delete") return histoire("avec `--delete` supprime une branche ou une étiquette distante");
    if (a === "--mirror" || a === "--prune") return histoire(`avec \`${a}\` aligne le distant sur le local et supprime ses références absentes`);
    if (/^-[A-Za-z0-9]+$/.test(a)) {
      if (a.includes("f")) return histoire(`avec \`${a}\` réécrit l'histoire distante`);
      if (a.includes("d")) return histoire(`avec \`${a}\` supprime une branche ou une étiquette distante`);
      continue;
    }
    if (!a.startsWith("-")) {
      if (a.startsWith("+")) return histoire(`avec la référence \`${a}\` (préfixe +) réécrit l'histoire distante`);
      if (/^:[^:\s]/.test(a)) return histoire(`avec la référence \`${a}\` supprime une branche ou une étiquette distante`);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// 2 ter. D-196 (b) du 10/11/2026 : la production par un secret du dépôt, l'arrêt de processus par leur nom
// ---------------------------------------------------------------------------------------------
// Les faits : le 31/10, une mesure dite en lecture seule s'est connectée à la production avec le mot de passe du fichier
// d'environnement du dépôt ; le 04/11, un nettoyage a lancé `taskkill` sur tous les `node.exe` du poste.

/** Les clients de base de données et de cache : leur connexion se juge par ce qui l'alimente et par l'hôte visé. */
const CLIENTS_BASE = new Set(["psql", "pg_dump", "pg_dumpall", "pg_restore", "pgcli", "sqlcmd", "invoke-sqlcmd", "mysql", "mysqldump", "mariadb", "mycli",
  "mongosh", "mongo", "mongodump", "mongorestore", "mongoexport", "mongoimport", "redis-cli", "sqlplus", "cqlsh"]);
/** Une chaîne de connexion : à schéma (`postgresql://…`, `mongodb+srv://…`), ou à clés (`Server=…;Password=…`). */
const CHAINE_CONNEXION = /\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|rediss?|sqlserver|mssql|jdbc:[a-z]+):\/\/[^\s"'`]+|\b(?:server|data source|host|address)\s*=\s*[^;"'`\s]+\s*;[^"'`]*?\b(?:password|pwd)\s*=/i;
/** Une variable qui porte une connexion (`DATABASE_URL`, `PGPASSWORD`, `MONGO_URI`, `ConnectionString`). */
const VARIABLE_CONNEXION = /^(?:DATABASE|DB|PG|POSTGRES\w*|MYSQL|MARIADB|MONGO\w*|REDIS|SQL\w*|MSSQL)[A-Z0-9_]*$|CONNECTION_?STRING|_DSN$|^DSN$/i;
/** Un nom porte PROD s'il en a une composante : `DATABASE_URL_PROD`, `prodDbUrl`, `db-prod.exemple.net` ; jamais `product` ni `produit`. */
const porteProd = (nom) => String(nom).split(/[^A-Za-z0-9]+|(?<=[a-z0-9])(?=[A-Z])/).some((c) => /^(prod|production)$/i.test(c));
const HOTE_LOCAL_BASE = /^(localhost|127(?:\.\d+){3}|::1|0\.0\.0\.0|host\.docker\.internal)$/i;

/** Le texte, variables que la commande affecte remplacées par leur valeur quand elle se lit. */
const developper = (texte, ctx) => String(texte).replace(/\$(?:env:)?\{?([A-Za-z_]\w*)\}?/g, (m, n) => {
  const v = ctx?.variables?.get(n) ?? ctx?.variables?.get(n.toLowerCase());
  return typeof v === "string" && !v.includes("$") ? v : m;
});

/**
 * Les variables dont le nom porte PROD : lues par le texte (`$NOM`, `${NOM}`, `$env:NOM`, `%NOM%`), ou affectées hors guillemets
 * (`affectees`, lues par `contexteDe`). Un `PROD=%s` dans le format d'un `printf` entre guillemets n'est pas une variable.
 */
function variablesProd(texte, affectees = []) {
  const noms = new Set();
  for (const r of String(texte).matchAll(/\$(?:env:)?\{?([A-Za-z_]\w*)\}?|%([A-Za-z_]\w*)%/g)) { const n = r[1] ?? r[2]; if (porteProd(n)) noms.add(n); }
  for (const n of affectees) if (porteProd(n)) noms.add(n);
  return [...noms];
}

/** Les fichiers d'environnement nommés par un texte et dont le nom porte PROD : `.env.production`, `prod.env`, `env/prod/.env`. */
function fichiersEnvProd(texte) {
  const f = new Set();
  for (const r of String(texte).matchAll(/[^\s"'`;|&<>()=]*\.env\b[^\s"'`;|&<>()]*|[^\s"'`;|&<>()=]*\benv[\\/][^\s"'`;|&<>()]*/gi)) if (porteProd(r[0])) f.add(r[0]);
  return [...f];
}

/** Les hôtes qu'un texte de connexion vise : adresses à schéma, `-h`, `--host`, `-S` de sqlcmd, `-ServerInstance`, `Server=`, `Host=`. */
function hotesDeConnexion(texte) {
  const h = [];
  for (const r of String(texte).matchAll(/\b[a-z][a-z0-9+.-]*:\/\/([^\s"'`/?#]+)/gi)) h.push(r[1].slice(r[1].lastIndexOf("@") + 1));
  for (const r of String(texte).matchAll(/(?:^|\s)(?:-h|--host|--hostname|-S|--server|-ServerInstance|-Server)(?:[=:]|\s+)["']?([^\s"';,]+)/gi)) h.push(r[1]);
  for (const r of String(texte).matchAll(/\b(?:server|data source|host|address|hostname)\s*=\s*["']?([^;"'`\s,]+)/gi)) h.push(r[1]);
  return h.map((x) => x.replace(/^tcp:/i, "").replace(/[,:]\d+$/, "").replace(/\\.*$/, "").replace(/^\[|\]$/g, "").toLowerCase()).filter(Boolean);
}

/**
 * Ce qui relie une connexion à la production (heuristique de D-196 (b), mesurée au rejeu) : une variable ou un fichier
 * d'environnement dont le nom porte PROD ou PRODUCTION, ou un hôte non local nommé prod. Pour un client de base, la variable
 * et le fichier se cherchent dans toute la commande, qui l'alimente ; pour une chaîne de connexion portée par un autre outil,
 * dans son segment seul.
 */
function raisonsProduction(segment, ctx, client, affecteesDuSegment = []) {
  const tout = ctx?.texte ?? segment;
  const raisons = [];
  const vars = client ? variablesProd(tout, [...(ctx?.variables?.keys() ?? [])]) : variablesProd(segment, affecteesDuSegment);
  if (vars.length) raisons.push(`variable ${vars.map((v) => `\`${v}\``).join(", ")}`);
  const fichiers = fichiersEnvProd(tout);
  if (fichiers.length) raisons.push(`fichier d'environnement ${fichiers.map((v) => `\`${v}\``).join(", ")}`);
  const hotes = [...new Set(hotesDeConnexion(segment).filter((x) => !HOTE_LOCAL_BASE.test(x) && porteProd(x)))];
  if (hotes.length) raisons.push(`hôte ${hotes.map((v) => `\`${v}\``).join(", ")}`);
  return raisons;
}

function jugerProduction(outil, segment, ctx) {
  const r = raisonsProduction(developper(segment, ctx), ctx, true);
  return r.length ? { categorie: "production", raison: `\`${outil}\` se connecte à une base de production (${r.join(" ; ")}) : en lecture comme en écriture, la connexion porte un secret du dépôt (D-196 (b))` } : null;
}

/** Une chaîne de connexion vers la production portée par un autre outil (`node x.mjs "postgresql://…"`, `DATABASE_URL=$DB_PROD npm run …`). */
function connexionDeSegment(segment, m, ctx) {
  const t = developper(segment, ctx);
  const affectees = m.map((w, k) => (/^(?:\$env:)?([A-Za-z_]\w*)=/.exec(w) || (m[k + 1] === "=" ? /^\$(?:env:)?([A-Za-z_]\w*)$/.exec(w) : null))?.[1]).filter(Boolean);
  const affecte = affectees.some((n) => VARIABLE_CONNEXION.test(n));
  if (!CHAINE_CONNEXION.test(t) && !affecte) return null;
  const r = raisonsProduction(t, ctx, false, affectees);
  return r.length ? { mots: m, categorie: "production", raison: `une chaîne de connexion vers une base de production (${r.join(" ; ")}) : la connexion porte un secret du dépôt (D-196 (b))` } : null;
}

/** Les outils qui arrêtent des processus ; l'arrêt par PID reste libre. */
const ARRET = new Set(["taskkill", "tskill", "stop-process", "spps", "pkill", "killall", "kill", "wmic"]);
function jugerArret(outil, args, amont, dialecte) {
  const par = (quoi) => ({ categorie: "processus", raison: `\`${outil}\` arrête des processus ${quoi} : ceux des autres sessions et des autres outils du poste s'arrêtent aussi ; `
    + "arrête par PID (`taskkill /PID <pid>`, `Stop-Process -Id <pid>`, `kill <pid>`) (D-196 (b))" });
  const bas = args.map((a) => a.toLowerCase());
  // `/IM` sous cmd et PowerShell, `//IM` sous Git Bash (la double barre échappe à la conversion de chemin de MSYS)
  if (outil === "taskkill") return bas.some((a) => /^(?:\/{1,2}|-)im$/.test(a)) ? par("par leur nom (/IM)") : bas.some((a) => /^(?:\/{1,2}|-)fi$/.test(a)) ? par("en masse (filtre /FI)") : null;
  if (outil === "tskill") return args.some((a) => !a.startsWith("/") && !/^\d+$/.test(a)) ? par("par leur nom") : null;
  if (outil === "pkill" || outil === "killall") return args.length && args.every((a) => /^(-l|--list|-L|--help|-h|-V|--version)$/.test(a)) ? null : par("par leur nom");
  if (outil === "wmic") return bas.includes("process") && bas.some((a) => a === "delete" || a === "terminate") && !/processid\s*=\s*\d+/i.test(args.join(" ")) ? par("par une requête WMI") : null;
  const pidParTube = amont && /^\s*(get-process|gps|ps)\s+-(id|pid)\b/i.test(amont);
  if (outil === "kill" && dialecte !== "ps" && !args.some((a) => /^-(n|na|nam|name|pr\w*|in\w*)$/i.test(a))) {
    // `kill` de bash : un PID ou un travail (`%1`) restent libres
    if (args.some((a) => /\$\(\s*(pgrep|pidof)\b|`\s*(pgrep|pidof)\b/.test(a))) return par("par leur nom (pgrep, pidof)");
    if (args.includes("-1")) return par("en masse (-1 : tous les processus)");
    if (!args.some((a) => /^(%?\d+|\$\S+|%\S+)$/.test(a)) && amont && /\b(pgrep|pidof|grep|tasklist|ps)\b/.test(amont)) return par("par leur nom (le tube les cherche par leur nom)");
    return null;
  }
  // Stop-Process, spps, et `kill` sous PowerShell (alias de Stop-Process)
  let nom = false, id = false, objet = false;
  for (let k = 0; k < args.length; k++) {
    const p = /^-([A-Za-z]+)(?::.*)?$/.exec(args[k]);
    if (!p) { if (/^\d+(,\d+)*$/.test(args[k]) || args[k].startsWith("$")) id = true; continue; }
    const n = p[1].toLowerCase();
    if (prefixeDe(n, "name") || prefixeDe(n, "processname", 2)) nom = true;
    else if (n === "id" || n === "pid") id = true;
    else if (prefixeDe(n, "inputobject", 2)) { objet = true; k++; }
  }
  if (nom) return par("par leur nom (-Name)");
  if (id || pidParTube) return null;
  return par(objet ? "reçus par -InputObject" : "reçus par le tube (Get-Process par nom, Where-Object…)");
}

/** Sous PowerShell 5.1, `curl` et `wget` sont des alias d'`Invoke-WebRequest` ; `curl.exe` reste le vrai curl (D-194 (b)). */
const aliasPowerShell = (l, dialecte) => (dialecte === "ps" || dialecte === null) && !/\.exe$/i.test(String(l.mot || ""));

/**
 * Juge UN segment : rend [] ou la liste des gestes destructifs distants { mots, categorie, raison }. `precedent` est le texte des
 * segments dont celui-ci reçoit le tube (`Get-Process node | Stop-Process`), null sinon.
 */
export function jugerSegment(segment, profondeur = 0, dialecte = null, precedent = null, ctx = null) {
  const m = teteResolue(mots(segment, dialecte), dialecte, ctx).m;
  const l = localiser(m, dialecte, ctx);
  const chaine = connexionDeSegment(segment, m, ctx); // D-196 (b) : une chaîne de connexion vers la production, quel que soit l'outil
  if (!l) return chaine ? [chaine] : [];
  if (l.interne !== undefined) return profondeur >= 3 ? [] : jugerCommande(l.interne, profondeur + 1, l.dialecte ?? dialecte, ctx);
  const { outil, args } = l;
  let v = null;
  if (CLIENTS_BASE.has(outil)) v = jugerProduction(outil, segment, ctx);
  else if (ARRET.has(outil)) v = jugerArret(outil, args, precedent, dialecte);
  else if (outil === "az") v = jugerAz(args);
  else if (outil === "terraform" || outil === "tofu") v = jugerTerraform(outil, args);
  else if (outil === "gh") v = jugerGh(args);
  else if (outil === "git") v = jugerGit(args);
  else if (outil === "curl" || outil === "wget") v = jugerHttp(outil, HTTP[outil], args) || (aliasPowerShell(l, dialecte) ? jugerHttp(outil, HTTP.ps, args) : null);
  else if (HTTP_PS.has(outil)) v = jugerHttp(outil, HTTP.ps, args);
  else if (estCmdlet(outil)) {
    v = /^remove-/.test(outil)
      ? { categorie: "suppression", raison: `\`${outil}\` supprime une ressource distante` }
      : { categorie: "droits", raison: `\`${outil}\` attribue ou modifie des droits` };
  }
  return v ? [{ mots: [outil, ...args], ...v }] : chaine ? [chaine] : [];
}

/** Les gestes destructifs distants d'une commande complète (tous segments, shells imbriqués et `"$( … )"` compris). */
export function jugerCommande(commande, profondeur = 0, dialecte = null, parent = null) {
  const lu = lireCommande(commande, dialecte);
  const ctx = contexteDe(commande, dialecte, parent);
  // Le texte des segments dont le segment i reçoit le tube, depuis le début du tube.
  const amont = (i) => { const t = []; for (let k = i; k > 0 && lu.separateurs[k] === "|"; k--) t.unshift(lu.segments[k - 1]); return t.length ? t.join(" | ") : null; };
  const gestes = lu.segments.flatMap((s, i) => jugerSegment(s, profondeur, dialecte, amont(i), ctx));
  if (profondeur < 3) for (const s of lu.substitutions) gestes.push(...jugerCommande(s, profondeur + 1, dialecte, ctx));
  return gestes;
}

// ---------------------------------------------------------------------------------------------
// 2 bis. Ce que la garde ne sait pas lire (D-194 (b), 10/11/2026)
// ---------------------------------------------------------------------------------------------

/** Les interprètes qui exécutent ce que leur tube leur donne quand aucun script ni code ne leur est passé. */
function interpreteSurEntree(m) {
  let i = 0;
  while (i < m.length && (/^[A-Za-z_]\w*=/.test(m[i]) || ["sudo", "env", "command", "exec", "time", "nohup"].includes(nomOutil(m[i])))) i++;
  const n = nomOutil(m[i] ?? ""), reste = m.slice(i + 1);
  const positionnel = reste.some((a) => !a.startsWith("-") && !a.startsWith("/"));
  if (n === "iex" || n === "invoke-expression") return !reste.length;
  if (DIALECTE_SHELL[n] === "bash") return reste.includes("-") || reste.some((a) => /^-[A-Za-z]*s[A-Za-z]*$/.test(a) && !a.includes("c")) || (!positionnel && !reste.some((a) => /^-[A-Za-z]*c$/.test(a)));
  if (DIALECTE_SHELL[n] === "ps") {
    const k = reste.findIndex((a) => /^[-/]c(o(m(m(a(n(d)?)?)?)?)?)?$/i.test(a));
    return k >= 0 ? reste[k + 1] === "-" : !positionnel && !reste.some((a) => /^[-/](e|ec|en\w*|f\w*)$/i.test(a));
  }
  if (n === "cmd") return !reste.some((a) => /^\/[ck]$/i.test(a));
  if (["python", "python3", "py"].includes(n)) return reste.includes("-") || (!positionnel && !reste.some((a) => /^-[cm]$/.test(a)));
  if (["node", "perl", "ruby"].includes(n)) return reste.includes("-") || (!positionnel && !reste.some((a) => /^(-[eEp]|--eval|--print)$/.test(a)));
  return false;
}

/** La méthode d'une requête HTTP est-elle dans une variable (`curl -X $M`, `irm -Method $m`) ? */
function methodeHttpVariable(l, dialecte) {
  const { outil, args } = l;
  let cfgs = [];
  if (outil === "curl" || outil === "wget") cfgs = aliasPowerShell(l, dialecte) ? [HTTP[outil], HTTP.ps] : [HTTP[outil]];
  else if (HTTP_PS.has(outil)) cfgs = [HTTP.ps];
  else if (outil === "gh" && positionnels(args)[0] === "api") cfgs = [HTTP["gh api"]];
  else if (outil === "az") { const p = positionnelsAz(args); cfgs = p[0] === "rest" ? [HTTP["az rest"]] : p[0] === "devops" && p[1] === "invoke" ? [HTTP["az devops invoke"]] : []; }
  return cfgs.some((cfg) => /^[$(]/.test(String(valeurOption(args, cfg.cles, cfg.ps) ?? "")));
}

/**
 * Ce que la garde ne sait pas lire dans une commande : la liste des causes, vide quand tout se lit. Les causes : guillemets
 * non équilibrés, document en ligne sans ligne de fin, texte évalué non littéral (eval, iex, tube vers un interprète, bloc de
 * script construit, substitution de processus), commande dans une variable, méthode HTTP dans une variable, commande encodée
 * illisible, imbrication de plus de trois shells.
 */
export function causesIllisibles(commande, dialecte = null, profondeur = 0, parent = null) {
  const lu = lireCommande(commande, dialecte);
  const ctx = contexteDe(commande, dialecte, parent);
  const causes = [];
  if (lu.ouvert) causes.push("guillemets non équilibrés");
  if (lu.nonFermes) causes.push("document en ligne sans ligne de fin");
  lu.segments.forEach((s, i) => {
    const t = teteResolue(mots(s, dialecte), dialecte, ctx);
    const m = t.m;
    const l = localiser(m, dialecte, ctx);
    if (l?.illisible) causes.push(l.illisible);
    else if (l?.interne !== undefined) causes.push(...(profondeur >= 3 ? ["imbrication trop profonde"] : causesIllisibles(l.interne, l.dialecte ?? dialecte, profondeur + 1, ctx)));
    if (t.inconnu) causes.push("commande dans une variable");
    if (lu.separateurs[i] === "|" && interpreteSurEntree(m)) causes.push("texte évalué (tube vers un interprète)");
    if (l?.outil && methodeHttpVariable(l, dialecte)) causes.push("méthode HTTP dans une variable");
    if (/^(invoke-command|icm|start-job|start-threadjob)$/.test(nomOutil(m[0] ?? "")) && m.some((w, k) => /^-s(c(r(i(p(t(b(l(o(c(k)?)?)?)?)?)?)?)?)?)?$/i.test(w) && /^[$(]/.test(m[k + 1] ?? ""))) causes.push("texte évalué non littéral (bloc de script dans une variable)");
  });
  if (profondeur < 3) for (const s of lu.substitutions) causes.push(...causesIllisibles(s, dialecte, profondeur + 1, ctx));
  const brut = String(commande);
  if (/(^|[\s;&|(])(source|\.)\s+<\(|\b(bash|sh|zsh)\s+<\(/.test(brut)) causes.push("texte évalué (substitution de processus)");
  if (/\[scriptblock\]::create\s*\(|\$executioncontext\.invokecommand|\.invokescript\s*\(/i.test(brut)) causes.push("texte évalué (bloc de script construit)");
  return [...new Set(causes)];
}

/** Les outils dont la garde juge les gestes, ou qui agissent hors du poste : la liste de D-194 (b). */
const OUTILS_DISTANTS = new Set(["az", "gh", "terraform", "tofu", "kubectl", "helm", "aws", "gcloud", "curl", "wget", "irm", "iwr", "ssh", "scp", "sftp", "rsync", "wrangler", "start-process", "saps",
  // D-196 (b) : les clients de base et les arrêts de processus par nom, jugés eux aussi
  "psql", "pg_dump", "pg_restore", "sqlcmd", "mysql", "mariadb", "mongosh", "mongo", "redis-cli", "sqlplus", "taskkill", "tskill", "pkill", "killall", "stop-process", "spps", "wmic"]);
const estOutilDistant = (n) => OUTILS_DISTANTS.has(n) || /^invoke-[a-z]+$/.test(n) || estCmdlet(n) || CMDLET_AZ_ECRITURE.test(n) || /^[a-z]+-mg[a-z0-9]+$/.test(n);

/** Les mots d'outil distant d'un texte, jetons base64 décodés compris ; `git` compte quand `push` le suit. */
export function motsDistants(texte, profondeur = 0) {
  const jetons = String(texte).split(/[\s"'`;|&(){}<>,=]+/).filter(Boolean);
  const noms = jetons.map(nomOutil);
  const trouves = new Set(noms.filter(estOutilDistant));
  noms.forEach((n, k) => { if (n === "git" && noms.slice(k + 1).includes("push")) trouves.add("git push"); });
  if (profondeur === 0) {
    for (const j of jetons.filter((x) => /^[A-Za-z0-9+/]{16,}={0,2}$/.test(x)).slice(0, 20)) {
      for (const t of [decoderBase64(j, "utf16le"), decoderBase64(j, "utf8")]) if (t) for (const x of motsDistants(t, 1)) trouves.add(x);
    }
  }
  return [...trouves];
}

/** La règle de famille (D-194 (b)) : les causes d'illisibilité d'une commande, et les outils distants qu'elle porte. */
export function illisibleDistant(commande, dialecte = null) {
  const causes = causesIllisibles(commande, dialecte);
  const distants = causes.length ? motsDistants(commande) : [];
  // Renfort : une commande en variable suivie d'un verbe destructif de la liste (`$AZ group delete`) compte comme un outil distant.
  if (!distants.length && causes.includes("commande dans une variable") && /(^|[\s"'])(delete|purge|remove|destroy)(-[a-z0-9-]+)?(?=[\s"']|$)/i.test(commande)) distants.push("un verbe destructif (delete, purge, remove, destroy)");
  return { causes, distants };
}

/**
 * Le réglage `FORGE_GARDE_ILLISIBLE=laisse` rétablit l'ancien comportement (D-194 (b)) : ce qui est illisible, une panne du juge
 * et une entrée illisible passent. Il est lu dans l'environnement du harnais, dont le hook hérite : une commande ne le pose pas
 * (`FORGE_GARDE_ILLISIBLE=laisse az …` ne change que l'environnement de la commande, que le hook ne lit pas).
 */
export const garde_permissive = (env = process.env) => String(env?.FORGE_GARDE_ILLISIBLE ?? "").trim().toLowerCase() === "laisse";

/** Une commande qui écrit ce réglage pour une session suivante (environnement du poste, réglages du harnais, profil du shell). */
function ecritLeReglage(commande) {
  const t = String(commande);
  return /FORGE_GARDE_ILLISIBLE/i.test(t)
    && /\bsetx\b|SetEnvironmentVariable|\\Environment\b|HKCU:|settings(\.local)?\.json|\.bashrc|\.bash_profile|\.profile\b|\$PROFILE\b|_profile\.ps1/i.test(t);
}

// ---------------------------------------------------------------------------------------------
// 3. Les lots approuvés
// ---------------------------------------------------------------------------------------------

/** Les dossiers où chercher les lots : la racine du projet, et l'arbre principal d'un arbre de travail lié. */
export function racinesDuProjet(entree, env = process.env) {
  let base = env.CLAUDE_PROJECT_DIR ? resolve(env.CLAUDE_PROJECT_DIR) : null;
  if (!base) {
    const depart = resolve(entree?.cwd || process.cwd());
    base = depart;
    for (let d = depart; ; d = dirname(d)) {
      if (existsSync(join(d, ".claude")) || existsSync(join(d, ".git"))) { base = d; break; }
      if (dirname(d) === d) break;
    }
  }
  const racines = [base];
  try {
    if (statSync(join(base, ".git")).isFile()) {
      const r = spawnSync("git", ["-C", base, "rev-parse", "--git-common-dir"], { encoding: "utf8", timeout: 5000 });
      const commun = r.status === 0 ? resolve(base, r.stdout.trim()) : null;
      if (commun && basename(commun) === ".git" && dirname(commun) !== base) racines.push(dirname(commun));
    }
  } catch { /* pas d'arbre lié */ }
  return racines;
}

export const FICHIERS_LOT = ["forge/gestes-approuves.jsonl", "todo/gestes-approuves.jsonl"];

/** Les lignes de lot lisibles des fichiers des racines données (une ligne illisible est ignorée). */
export function lireLots(racines) {
  const lots = [];
  for (const r of racines) for (const f of FICHIERS_LOT) {
    const chemin = join(r, ...f.split("/"));
    if (!existsSync(chemin)) continue;
    let brut = "";
    try { brut = readFileSync(chemin, "utf8"); } catch { continue; }
    brut.split(/\r?\n/).forEach((ligne, i) => {
      if (!ligne.trim()) return;
      try { lots.push({ ...JSON.parse(ligne), _source: `${f}:${i + 1}` }); } catch { lots.push({ _source: `${f}:${i + 1}`, _illisible: true }); }
    });
  }
  return lots;
}

const texteNonVide = (x, min = 1) => typeof x === "string" && x.trim().length >= min;

// TF-2082 (RT-37, 29/10/2026) : la préférence du porteur du 26/10 impose de citer la LETTRE de la
// décision (« 10a », « 76c », « D-10 a ») ; une longueur minimale de 5 refusait cette forme que la
// préférence rend obligatoire, et obligeait à habiller la citation pour passer. Une reponse_humaine
// vaut désormais par un texte d'au moins 5 caractères OU par une citation de lettre de décision :
// des chiffres suivis d'une lettre, « D- » et une parenthèse fermante admis.
const CITATION_DECISION = /^\s*(?:d-?\s*)?\d{1,4}\s*[a-z]\)?\s*$/i;
/** D-195 (b) : une citation porte au moins une lettre ou un chiffre ; « ????? » et « ----- » ne citent rien. */
const SIGNE = /[\p{L}\p{N}]/u;
const reponseHumaineValide = (x) => typeof x === "string" && SIGNE.test(x) && (texteNonVide(x, 5) || CITATION_DECISION.test(x));

/**
 * Les messages TAPÉS par l'humain dans une transcription (D-195 (b)) : entrées `user` d'origine humaine (`origin.kind` « human » ;
 * sans `origin`, `promptSource` ni `turnOrigin`, la forme d'avant ces champs). Exclus : `tool_result`, les injections `isMeta`
 * (rappels système, corps de skill, retours de hook), les résumés de compaction, la consigne d'un sous-agent (`isSidechain`), les
 * notifications de tâche, les messages d'une autre session (`origin.kind` « peer »), les invites envoyées par programme
 * (`turnOrigin` « sdk »), les blocs `<system-reminder>` et le contexte de l'éditeur (`<ide_opened_file>`). La transcription d'un
 * sous-agent se lit avec celle de sa session, où l'humain a parlé.
 */
export function messagesTapes(chemin) {
  const fichiers = [chemin];
  const parent = /^(.*)[\\/]subagents[\\/][^\\/]+\.jsonl$/i.exec(String(chemin || ""));
  if (parent) fichiers.push(`${parent[1]}.jsonl`);
  const textes = [];
  for (const f of fichiers) {
    if (!f || !existsSync(f)) continue;
    let brut = "";
    try { brut = readFileSync(f, "utf8"); } catch { continue; }
    for (const l of brut.split(/\r?\n/)) {
      if (!l.includes('"user"')) continue;
      let e; try { e = JSON.parse(l); } catch { continue; }
      if (e?.type !== "user" || e.isMeta || e.isCompactSummary || e.isVisibleInTranscriptOnly || e.isSidechain || e.toolUseResult !== undefined || e.sourceToolUseID) continue;
      if (!(e.origin ? e.origin.kind === "human" : e.promptSource === undefined && e.turnOrigin === undefined)) continue;
      const c = e.message?.content;
      const blocs = typeof c === "string" ? [c] : Array.isArray(c) && !c.some((b) => b?.type === "tool_result") ? c.filter((b) => b?.type === "text").map((b) => String(b.text ?? "")) : [];
      for (const b of blocs) {
        const t = b.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").replace(/<ide_[a-z_]+>[\s\S]*?<\/ide_[a-z_]+>/g, "");
        if (/^\s*(<task-notification>|<command-(name|message|args)>|<local-command-|<cross-session-message|\[Request interrupted|Caveat:)/.test(t)) continue;
        if (t.trim()) textes.push(t);
      }
    }
  }
  return textes;
}

const normaliserCitation = (s) => String(s ?? "").normalize("NFC").replace(/[‘’ʼ′´]/g, "'").replace(/[“”„«»]/g, '"')
  .replace(/[    ]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
/** La réponse figure-t-elle mot pour mot dans un des textes ? Casse, espaces et apostrophes typographiques normalisés ; jamais au milieu d'un mot (« 1a » n'est pas dans « 21a »). */
export function citeDans(reponse, textes) {
  const r = normaliserCitation(reponse);
  if (!SIGNE.test(r)) return false;
  for (const t of textes || []) {
    const n = normaliserCitation(t);
    for (let i = n.indexOf(r); i >= 0; i = n.indexOf(r, i + 1)) {
      const avant = n[i - 1], apres = n[i + r.length];
      if ((!SIGNE.test(r[0]) || avant === undefined || !SIGNE.test(avant)) && (!SIGNE.test(r[r.length - 1]) || apres === undefined || !SIGNE.test(apres))) return true;
    }
  }
  return false;
}

/**
 * D-195 (b) : une commande approuvée nomme au moins l'outil et son verbe en mots littéraux avant tout joker. Le préfixe qui
 * précède le premier `*` doit être, à lui seul, un geste de la liste fermée (`az group delete`, `terraform destroy`, `az group
 * delete --name rg-essai-*`). `*`, `az *` et `az group` ne nomment pas le verbe : ils couvraient `az group delete -n prod`.
 */
export function nommeOutilEtVerbe(commande) {
  const l = localiser(mots(commande));
  // D-196 (b) : une chaîne de connexion portée par un autre outil (`node x.mjs "postgresql://…"`) se nomme par son texte, sans joker.
  if (!l?.outil) return !String(commande).includes("*") && jugerSegment(String(commande)).length > 0;
  const tous = [l.outil, ...l.args];
  const k = tous.findIndex((w) => w.includes("*"));
  const prefixe = (k < 0 ? tous : tous.slice(0, k)).map((w) => (/[\s"']/.test(w) ? `"${w.replace(/"/g, "")}"` : w)).join(" ");
  return jugerSegment(prefixe).length > 0;
}

/** Une commande illisible pour la garde s'approuve par son texte exact, sans joker (D-194 (b)) : la règle de famille la refuserait sinon. */
const approbationExacte = (commande) => !String(commande).includes("*") && ["bash", "ps"].some((d) => illisibleDistant(commande, d).distants.length > 0);

/** Un lot est-il valide à cet instant ? { ok, raison, jusqua } */
export function lotValide(lot, maintenant = Date.now(), sessionId = null) {
  if (lot._illisible) return { ok: false, raison: "ligne illisible (JSON invalide)" };
  if (!/^D-\d+/.test(String(lot.decision || ""))) return { ok: false, raison: "pas de décision D-N" };
  if (!reponseHumaineValide(lot.reponse_humaine)) return { ok: false, raison: "pas de reponse_humaine (les mots de l'humain, ou la lettre de la décision : « 10a »)" };
  const t0 = Date.parse(lot.horodatage), t1 = Date.parse(lot.expire);
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return { ok: false, raison: "horodatage ou expire illisible" };
  if (!Array.isArray(lot.gestes) || !lot.gestes.length) return { ok: false, raison: "aucun geste listé" };
  const bancal = lot.gestes.findIndex((g) => !texteNonVide(g?.commande) || !texteNonVide(g?.cible) || !texteNonVide(g?.effet) || !texteNonVide(g?.retour_arriere));
  if (bancal >= 0) return { ok: false, raison: `geste ${bancal + 1} sans commande, cible, effet ou retour_arriere` };
  const sansVerbe = lot.gestes.findIndex((g) => !nommeOutilEtVerbe(g.commande) && !approbationExacte(g.commande));
  if (sansVerbe >= 0) return { ok: false, raison: `geste ${sansVerbe + 1} : la commande approuvée « ${String(lot.gestes[sansVerbe].commande).slice(0, 60)} » ne nomme pas l'outil et son verbe avant tout joker (D-195 (b))` };
  const jusqua = Math.min(t1, t0 + DUREE_MAX_H * H);
  if (t0 > maintenant + 5 * 60_000) return { ok: false, raison: "horodatage dans le futur" };
  if (maintenant >= jusqua) return { ok: false, raison: `expiré (valait jusqu'au ${new Date(jusqua).toISOString()}, 24 h au plus)` };
  if (lot.session && sessionId && lot.session !== sessionId) return { ok: false, raison: "lot posé pour une autre session" };
  return { ok: true, jusqua };
}

const egal = (approuve, reel) => approuve === reel || (approuve.startsWith("-") && approuve.toLowerCase() === String(reel).toLowerCase());
const globMot = (approuve, reel) => {
  if (reel === undefined) return false;
  if (!approuve.includes("*")) return egal(approuve, reel);
  const re = new RegExp("^" + approuve.split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
  return re.test(reel);
};

/** Mots d'une commande approuvée, normalisés comme ceux d'un geste jugé (outil ôté de son chemin, enveloppes ôtées). */
function motsApprouves(commande) {
  const m = mots(commande);
  const l = localiser(m);
  return l && l.outil ? [l.outil, ...l.args] : m;
}

/** Une commande approuvée couvre un geste si ses mots en sont le début (une option de plus ne change pas la cible). */
export const couvre = (commande, geste) => {
  const a = motsApprouves(commande);
  return a.length > 0 && a.length <= geste.mots.length && a.every((w, i) => globMot(w, geste.mots[i]));
};

// ---------------------------------------------------------------------------------------------
// 4. Verdict
// ---------------------------------------------------------------------------------------------

/** Le texte exact d'une commande, espaces et fins de ligne normalisés : la seule couverture d'une commande illisible. */
const texteNormalise = (t) => String(t ?? "").replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
export const memeTexte = (approuve, commande) => texteNormalise(approuve) !== "" && texteNormalise(approuve) === texteNormalise(commande);

const motifIllisible = (causes, distants, poser) => `COMMANDE ILLISIBLE POUR LA GARDE (D-194 (b)) — ${causes.join(" ; ")} : `
  + `la commande porte ${distants.map((d) => `\`${d}\``).join(", ")}, et la garde ne peut pas dire si elle supprime, attribue des droits ou réécrit l'histoire. `
  + "Remède : réécris-la lisiblement, le geste en clair (sans eval, iex ni Invoke-Expression, sans commande dans une variable, guillemets fermés, "
  + "here-string fermé par '@ en début de ligne, sans -EncodedCommand) ; si elle doit rester telle quelle, pose un lot d'accord dont un geste porte "
  + `ce texte exact en \`commande\`, puis \`${poser}\`. Le fait : le 10/11/2026, une revue a montré qu'une apostrophe, un alias PowerShell ou un eval `
  + "suffisaient à faire passer une suppression sans décision.";

/** Juge l'entrée d'un hook PreToolUse. `lots` : lignes déjà lues (sinon lues aux racines du projet). */
export function juger(entree, { lots = null, registre = null, maintenant = Date.now(), env = process.env } = {}) {
  // D-194 (b) : la sonde de panne, posée par la recette dans l'environnement du hook ; elle ne peut que faire refuser.
  if (env?.FORGE_GARDE_PANNE_ESSAI === "1") throw new Error("panne simulée par FORGE_GARDE_PANNE_ESSAI=1");
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const commande = entree?.tool_input?.command;
  if (typeof commande !== "string") return { decision: "laisse" };
  if (ecritLeReglage(commande)) {
    return { decision: "refuse", gestes: [], illisible: [], motif: "RÉGLAGE DE LA GARDE REFUSÉ (D-194 (b)) — cette commande écrit FORGE_GARDE_ILLISIBLE pour une session suivante "
      + "(environnement du poste, réglages du harnais ou profil du shell). Ce réglage rétablit l'ancien comportement de la garde : l'humain le pose avant d'ouvrir "
      + "la session, la session ne le pose jamais. Remède : rends la main à l'humain avec la commande refusée." };
  }
  const dialecte = dialecteDe(entree.tool_name);
  const gestes = jugerCommande(commande, 0, dialecte);
  const { causes, distants } = garde_permissive(env) ? { causes: [], distants: [] } : illisibleDistant(commande, dialecte);
  const illisible = causes.length > 0 && distants.length > 0;
  if (!gestes.length && !illisible) return { decision: "laisse" };
  const racines = racinesDuProjet(entree, env);
  const toutes = lots ?? lireLots(racines);
  const etats = toutes.map((l) => ({ lot: l, ...lotValide(l, maintenant, entree?.session_id ?? null) }));
  const valides = etats.filter((e) => e.ok).map((e) => e.lot);
  // D-195 (b) : un lot ne couvre que si sa reponse_humaine figure mot pour mot dans un message tapé par l'humain, lu dans la
  // transcription de l'entrée du hook au moment où un lot couvre la commande.
  let textes = null;
  const cites = new Map(), nonCites = new Set();
  const cite = (lot) => {
    if (!cites.has(lot)) { textes ??= entree?.transcript_path ? messagesTapes(entree.transcript_path) : []; cites.set(lot, citeDans(lot.reponse_humaine, textes)); }
    return cites.get(lot);
  };
  const couvertPar = (pred) => {
    const ls = valides.filter((l) => l.gestes.some(pred));
    if (ls.some(cite)) return true;
    for (const l of ls) nonCites.add(l);
    return false;
  };
  const sansLot = gestes.filter((g) => !couvertPar((x) => couvre(x.commande, g)));
  const illisibleSansLot = illisible && !couvertPar((x) => memeTexte(x.commande, commande));
  const noteCitation = nonCites.size
    ? ` Lot sans citation (D-195 (b)) : ${[...nonCites].map((l) => l._source).join(", ")} couvre la commande, mais sa reponse_humaine ne figure mot pour mot dans aucun message `
      + `tapé par l'humain${entree?.transcript_path ? " de la transcription" : " (l'entrée du hook ne donne pas de transcription)"} ; cite ses mots exacts, puis pose le lot à nouveau.`
    : "";
  const produit = existsSync(join(racines[0], "forge", "hooks", "factory.mjs")) && !existsSync(join(racines[0], "todo", "TODO.jsonl"));
  const poser = produit
    ? "node forge\\hooks\\factory.mjs gestes-distants --poser --lot <lot.json>"
    : "node oracles\\hook-gestes-distants.mjs --poser --lot <lot.json>";
  if (!sansLot.length && !illisibleSansLot) return { decision: "laisse", couverts: gestes.length + (illisible ? 1 : 0) };
  if (!sansLot.length) return { decision: "refuse", gestes: [], illisible: causes, motif: motifIllisible(causes, distants, poser) + noteCitation };
  // TF-2128 (D-168 (a)) : un retrait que la session a créé, consigné, sans dépendance, passe sans lot. Les autres restent refusés.
  let lignesRegistre = registre;
  const nonCouverts = [], exceptions = [], admis = [];
  for (const g of sansLot) {
    const cible = g.categorie === "suppression" ? cibleDeRetrait(g, resolve(entree?.cwd || env.CLAUDE_PROJECT_DIR || process.cwd())) : null;
    if (!cible) { nonCouverts.push(g); continue; }
    lignesRegistre ??= lireRegistre(racines);
    const j = jugerRetrait(lignesRegistre, cible, entree?.session_id ?? null);
    if (j.ok) admis.push({ cible, creation: j.creation });
    else { nonCouverts.push(g); exceptions.push({ cible, ...j }); }
  }
  if (!nonCouverts.length && illisibleSansLot) return { decision: "refuse", gestes: [], illisible: causes, motif: motifIllisible(causes, distants, poser) + noteCitation };
  if (!nonCouverts.length) {
    return { decision: "laisse", couverts: gestes.length - admis.length, admis: admis.length,
      contexte: `RETRAIT ADMIS SANS DÉCISION GROUPÉE (TF-2128, D-168 (a)) — ${admis.map((a) => `${a.cible.libelle}, créée par cette session le ${a.creation.ts} (création ${a.creation.id}), aucune dépendance consignée`).join(" ; ")}. `
        + "Rien n'est bloqué ; limites de cette preuve : references\\GESTES-DISTANTS.md, « Le retrait d'une ressource que la session a créée »." };
  }
  const lecture = etats.length
    ? `${etats.length} lot(s) lu(s), ${valides.length} valide(s)${etats.filter((e) => !e.ok).map((e) => ` ; ${e.lot._source} : ${e.raison}`).join("")}`
    : "aucun lot approuvé n'existe";
  return {
    decision: "refuse",
    gestes: nonCouverts,
    illisible: illisibleSansLot ? causes : [],
    motif: (illisibleSansLot ? `${motifIllisible(causes, distants, poser)} | ` : "")
      + `GESTE DISTANT DESTRUCTIF REFUSÉ (TF-1959, D-77) — ${nonCouverts.map((g) => `${g.mots.join(" ")} : ${g.raison}`).join(" ; ")}. `
      + `Aucun lot approuvé valide ne le couvre (${lecture}).${noteCitation} `
      + (exceptions.length
        ? `${exceptions.map((e) => `Exception TF-2128 (D-168 (a)) non tenue pour ${e.cible.libelle} — condition (${e.condition}) : ${e.raison}.`).join(" ")} `
          + "Un retrait passe sans décision groupée si (a) la ressource a été créée par cette session, (b) sa création est consignée avec son identifiant, (c) aucune dépendance n'est consignée ; "
          + "sinon, la décision groupée ci-dessous. "
        : "")
      + "Remède, en UNE fois pour tous les gestes destructifs distants que tu prévois dans ce tour, pas un par commande : "
      + "(1) pose UNE décision au bloc 3 de ta restitution, liste complète, chaque geste avec sa commande, sa cible, son effet et son retour arrière ; "
      + "(2) quand l'humain l'a approuvée, écris le lot : un fichier JSON { \"decision\": \"D-N\", \"reponse_humaine\": \"<ses mots exacts, tels qu'il les a tapés>\", \"gestes\": [ { \"commande\", \"cible\", \"effet\", \"retour_arriere\" } ] } "
      + `puis \`${poser}\` (valable 24 h au plus) ; (3) rejoue la commande. `
      + "Le fait : le 26/10/2026, un dépôt d'essai et son état Terraform ont été supprimés alors qu'une décision humaine les réservait à plus tard ; "
      + "l'humain veut une décision groupée, pas une confirmation par commande.",
  };
}

// ---------------------------------------------------------------------------------------------
// 4 bis. Les gestes distants EN COURS (TF-2084) : un registre partagé, une lecture qui avertit
// ---------------------------------------------------------------------------------------------

const VERBE_MUTANT = /^(create|delete|update|deploy|up|purge|remove|set|add|start|stop|restart|swap|scale|import|restore|sync|upload|upload-batch|put|publish|rollback)(-[a-z0-9-]+)?$/;
const VERBE_WRANGLER = /^(create|delete|put|deploy|publish|upload|rollback|apply|execute|bulk)$/;
const norm = (s) => String(s).toLowerCase().replace(/\\/g, "/");

/** Le geste d'un outil, ou null : { ressource, perimetre, geste }. Liste fermée, voir GESTES-DISTANTS.md. */
function geste(outil, args, cwd) {
  const pos = positionnels(args);
  if (outil === "az") {
    if (!pos.length || pos[0] === "rest" || AZ_LOCAL.has(pos[0]) || pos[0] === "account") return null;
    const i = pos.findIndex((v, k) => k >= 1 && VERBE_MUTANT.test(v));
    if (i < 0) return null;
    const rg = valeurOption(args, ["--resource-group", "-g"]), compte = valeurOption(args, ["--account-name"]);
    const etendue = rg ? ` -g ${rg}` : compte ? ` --account-name ${compte}` : "";
    const perimetre = norm(`az ${pos.slice(0, i).join(" ")}${etendue}`);
    const nom = valeurOption(args, ["--name", "-n"]);
    return { perimetre, ressource: nom ? norm(`${perimetre} ${nom}`) : perimetre, geste: `az ${pos.join(" ")}` };
  }
  if (outil === "terraform" || outil === "tofu") {
    const mute = ["apply", "destroy", "import"].includes(pos[0]) || (pos[0] === "state" && ["rm", "mv", "push"].includes(pos[1]))
      || (pos[0] === "workspace" && ["new", "delete"].includes(pos[1]));
    if (!mute) return null;
    const chdir = args.find((a) => /^-chdir=/.test(a));
    const dossier = norm(resolve(cwd, chdir ? chdir.slice(7) : "."));
    return { perimetre: `terraform ${dossier}`, ressource: `terraform ${dossier}`, geste: `${outil} ${pos.slice(0, 2).join(" ")}`.trim() };
  }
  if (outil === "wrangler") {
    const i = pos.findIndex((v) => VERBE_WRANGLER.test(v));
    if (i < 0) return null;
    let perimetre, nom;
    if (pos[0] === "pages") { perimetre = "wrangler pages project"; nom = valeurOption(args, ["--project-name"]) || (pos[1] === "project" ? pos[3] : null); }
    else if (i === 0) { perimetre = "wrangler worker"; nom = valeurOption(args, ["--name"]) || basename(cwd).toLowerCase(); }
    else { perimetre = `wrangler ${pos.slice(0, i).join(" ")}`; nom = pos[i + 1] || valeurOption(args, ["--name"]); }
    return { perimetre, ressource: nom ? `${perimetre} ${norm(nom)}` : perimetre, geste: `wrangler ${pos.slice(0, i + 1).join(" ")}` };
  }
  if (outil === "gh" && pos[0] === "repo" && /^(create|delete|rename|edit|archive|unarchive|fork)$/.test(pos[1] || "")) {
    return { perimetre: "gh repo", ressource: `gh repo ${pos[2] || "(courant)"}`, geste: `gh repo ${pos[1]}` };
  }
  return null;
}

/** Les gestes distants d'une commande qui MODIFIENT l'état distant (liste fermée : az, terraform/tofu, wrangler, gh repo). */
export function gestesDistants(commande, cwd = process.cwd(), profondeur = 0) {
  const sortie = [];
  for (const s of segmenter(commande)) {
    const l = localiser(mots(s));
    if (!l) continue;
    if (l.interne !== undefined) { if (profondeur < 3) sortie.push(...gestesDistants(l.interne, cwd, profondeur + 1)); continue; }
    const g = geste(l.outil, l.args, cwd);
    if (g) sortie.push(g);
  }
  return sortie;
}

/** Le registre est celui d'un PRODUIT : le pilot (qui porte `todo\TODO.jsonl`) n'en écrit pas. */
const estPilot = (racine) => existsSync(join(racine, "todo", "TODO.jsonl"));

/**
 * Suit les gestes distants d'un appel d'outil. PreToolUse : avertit si une autre session a un geste ouvert sur la
 * même ressource ou le même périmètre, puis inscrit le `debut`. PostToolUse : inscrit la `fin`. Ne bloque jamais.
 * Rend { avertissement, ouverts, fermes }.
 */
export function suivre(entree, { maintenant = Date.now(), env = process.env } = {}) {
  const vide = { avertissement: "", ouverts: 0, fermes: 0 };
  if (!OUTILS.has(entree?.tool_name) || typeof entree?.tool_input?.command !== "string") return vide;
  const cwd = resolve(entree.cwd || env.CLAUDE_PROJECT_DIR || process.cwd());
  const gestes = gestesDistants(entree.tool_input.command, cwd);
  if (!gestes.length) return vide;
  const racines = racinesDuProjet(entree, env);
  if (estPilot(racines[0])) return vide;
  const principal = racines[racines.length - 1]; // l'arbre principal : partagé par les arbres de travail liés
  const session = entree.session_id || "inconnue";
  if (entree.hook_event_name === "PostToolUse") {
    let fermes = 0;
    for (const g of gestes) fermes += clore(racines, principal, { session, ressource: g.ressource }, maintenant);
    return { ...vide, fermes };
  }
  const textes = [];
  let ouverts = 0;
  for (const g of gestes) {
    const r = ouvrir(racines, principal, { session, ressource: g.ressource, perimetre: g.perimetre, geste: g.geste, dureeMin: DUREE_DEFAUT_MIN }, maintenant);
    if (r.ouvert) ouverts++;
    const t = avertissement(r.conflits, g, maintenant);
    if (t) textes.push(t);
  }
  return { avertissement: textes.join(" | "), ouverts, fermes: 0 };
}

// ---------------------------------------------------------------------------------------------
// 4 ter. Les créations consignées et le retrait admis sans décision groupée (TF-2128, D-168 (a))
// ---------------------------------------------------------------------------------------------

const minus = (x) => String(x ?? "").trim().toLowerCase();
/** Options qui ne désignent aucune ressource citée : elles ne comptent ni comme identité de groupe ni comme référence. */
const OPTIONS_BRUIT = new Set(["name", "n", "location", "l", "tags", "tag", "output", "o", "query", "subscription", "subscriptionid", "yes", "y", "no-wait",
  "verbose", "debug", "only-show-errors", "force", "confirm", "whatif", "erroraction"]);
/** Une valeur qu'aucune lecture de la commande ne résout : variable, substitution, fichier. */
const OPAQUE = /[$`%]|^@/;
/** Les premiers mots d'`az` dont le retrait n'est jamais jugé ici (droits, annuaire, DevOps, REST). */
const AZ_HORS_EXCEPTION = new Set(["role", "ad", "devops", "rest"]);
const AZ_IDENTITE = { n: "name", g: "resource-group" };
const PS_IDENTITE = { name: "name", resourcegroupname: "resource-group", resourcegroup: "resource-group", subscriptionid: "subscription" };

/** Les options d'une ligne de commande : [clé en minuscules sans tiret, [valeurs consécutives]]. `-Cle:valeur` (PowerShell) compris. */
function optionsDe(args, ps) {
  const sortie = [];
  for (let k = 0; k < args.length; k++) {
    const a = args[k];
    if (!a.startsWith("-") || a === "-" || /^-\d/.test(a)) continue;
    let cle = null, valeurs = [];
    if (ps) {
      const m = /^-([A-Za-z]+)(?::(.*))?$/.exec(a);
      if (!m) continue;
      cle = m[1].toLowerCase();
      if (m[2] !== undefined) valeurs.push(m[2]);
    } else if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      cle = (eq > 0 ? a.slice(2, eq) : a.slice(2)).toLowerCase();
      if (eq > 0) valeurs.push(a.slice(eq + 1));
    } else {
      cle = a.slice(1, 2).toLowerCase();
      if (a.length > 2) valeurs.push(a.slice(2));
    }
    while (args[k + 1] !== undefined && !args[k + 1].startsWith("-")) valeurs.push(args[++k]);
    sortie.push([cle, valeurs]);
  }
  return sortie;
}

/**
 * Lit ce qu'une commande `az` ou `*-Az*` fait à une ressource : { sorte, chemin, nom, identite, ids, references, opaque, ressource,
 * perimetre, libelle, geste } ou null. `sorte` : "creation" (create / New-Az*), "retrait" (delete|remove exact / Remove-Az*),
 * "modification" (tout autre geste mutant). `chemin` est le même pour la création et le retrait d'une ressource de même type.
 */
function lireRessource(outil, args, cwd) {
  const ps = outil !== "az";
  let chemin, sorte;
  if (!ps) {
    const pos = positionnels(args);
    if (!pos.length || pos[0] === "rest" || AZ_LOCAL.has(pos[0]) || pos[0] === "account" || AZ_HORS_EXCEPTION.has(pos[0])) return null;
    const i = pos.findIndex((v, k) => k >= 1 && VERBE_MUTANT.test(v));
    if (i < 0) return null;
    const verbe = pos[i];
    if (/^purge/.test(verbe)) return null;
    chemin = `az ${pos.slice(0, i).join(" ")}`;
    sorte = verbe === "create" ? "creation" : /^(delete|remove)$/.test(verbe) ? "retrait" : "modification";
  } else {
    const m = /^(new|remove)-(az[a-z0-9]+)$/.exec(outil);
    if (CMDLETS_LOCAUX.has(outil)) return null;
    if (m) { chemin = `ps ${m[2]}`; sorte = m[1] === "new" ? "creation" : "retrait"; }
    else if (CMDLET_AZ_ECRITURE.test(outil)) { chemin = `ps ${outil.replace(/^[a-z]+-/, "")}`; sorte = "modification"; }
    else return null;
  }
  const identite = {}, references = [];
  let ids = [], opaque = /(^| )(deployment|stack)( |$)/.test(chemin);
  for (const [cle, valeurs] of optionsDe(args, ps)) {
    const k = ps ? (PS_IDENTITE[cle] || cle) : (AZ_IDENTITE[cle] || cle);
    if (k === "ids" || k === "resourceid") { ids = ids.concat(valeurs.map(minus)); continue; }
    if (valeurs.some((v) => OPAQUE.test(v)) && !OPTIONS_BRUIT.has(cle)) opaque = true;
    if (valeurs.length && (k === "name" || k === "resource-group" || k === "subscription" || /name$/.test(k))) identite[k] = minus(valeurs[0]);
    if (!OPTIONS_BRUIT.has(cle) && k !== "name") references.push(...valeurs.map(minus).filter(Boolean));
  }
  if (identite.name !== undefined && OPAQUE.test(identite.name)) opaque = true;
  const nom = identite.name || null;
  const libelle = `${chemin} ${nom ? `« ${nom} »` : ids.join(" ")}`.trim();
  const resume = `${outil} ${args.join(" ")}`.slice(0, 200);
  let perimetre, ressource;
  if (!ps) {
    const g = geste("az", args, cwd);
    perimetre = g?.perimetre ?? chemin; ressource = g?.ressource ?? chemin;
  } else {
    perimetre = `${chemin}${identite["resource-group"] ? ` -g ${identite["resource-group"]}` : ""}`;
    ressource = nom ? `${perimetre} ${nom}` : perimetre;
  }
  return { sorte, chemin, nom, identite, ids, references, opaque, ressource, perimetre, libelle, geste: resume };
}

/** La cible d'un geste destructif jugé : une ressource nommée, retirée par `delete|remove` exact ; sinon null (l'exception ne s'applique pas). */
function cibleDeRetrait(g, cwd) {
  const [outil, ...args] = g.mots;
  if (outil !== "az" && !/^remove-az[a-z0-9]+$/.test(outil)) return null;
  const r = lireRessource(outil, args, cwd);
  return r && r.sorte === "retrait" ? r : null;
}

/** Les ressources touchées par une commande (shells imbriqués compris), dans l'ordre. */
function ressourcesDeCommande(commande, cwd, profondeur = 0) {
  const sortie = [];
  for (const s of segmenter(commande)) {
    const l = localiser(mots(s));
    if (!l) continue;
    if (l.interne !== undefined) { if (profondeur < 3) sortie.push(...ressourcesDeCommande(l.interne, cwd, profondeur + 1)); continue; }
    if (l.outil !== "az" && !CMDLET_AZ_ECRITURE.test(l.outil)) continue;
    const r = lireRessource(l.outil, l.args, cwd);
    if (r) sortie.push(r);
  }
  return sortie;
}

/** L'identifiant distant que la sortie d'un `create` donne (champ `id` à la racine ou d'un objet de premier niveau), s'il désigne la ressource nommée. */
function idDeSortie(sortie, nom) {
  const i = String(sortie || "").search(/[{[]/);
  if (i < 0) return null;
  let o;
  try { o = JSON.parse(String(sortie).slice(i)); } catch { return null; }
  if (!o || typeof o !== "object") return null;
  const candidats = [o, ...Object.values(o).filter((v) => v && typeof v === "object" && !Array.isArray(v))];
  for (const c of candidats) {
    if (typeof c.id === "string" && c.id.startsWith("/") && (!nom || minus(c.id.split("/").pop()) === nom)) return c.id;
  }
  return null;
}

/**
 * PostToolUse (outil RÉUSSI) : consigne les créations (avec leur identifiant), les modifications qui citent d'autres ressources
 * et les retraits. N'écrit rien au pilot, qui n'a pas de registre. Rend les comptes écrits.
 */
export function consigner(entree, { maintenant = Date.now(), env = process.env } = {}) {
  const vide = { creations: 0, modifications: 0, retraits: 0 };
  if (entree?.hook_event_name !== "PostToolUse" || !OUTILS.has(entree?.tool_name) || typeof entree?.tool_input?.command !== "string") return vide;
  const rep = entree.tool_response;
  if (rep && typeof rep === "object" && (rep.interrupted === true || rep.is_error === true || rep.isError === true)) return vide;
  const cwd = resolve(entree.cwd || env.CLAUDE_PROJECT_DIR || process.cwd());
  const touches = ressourcesDeCommande(entree.tool_input.command, cwd);
  if (!touches.length) return vide;
  const racines = racinesDuProjet(entree, env);
  if (estPilot(racines[0])) return vide;
  const principal = racines[racines.length - 1];
  const session = entree.session_id || "inconnue";
  const sortie = typeof rep === "string" ? rep : String(rep?.stdout ?? rep?.output ?? "");
  const nommees = touches.filter((t) => t.sorte === "creation" && t.nom);
  const idDistant = nommees.length === 1 && touches.filter((t) => t.sorte === "creation").length === 1 ? idDeSortie(sortie, nommees[0].nom) : null;
  const lignes = lireRegistre(racines);
  const c = { ...vide };
  for (const t of touches) {
    if (t.sorte === "creation" && t.nom) {
      const deja = creationsVivantes(lignes).some((x) => x.session === session && viseeParCible(x, { chemin: t.chemin, nom: t.nom, identite: t.identite, ids: [] }));
      if (!deja) {
        ecrireLigne(principal, ligneCreation({ session, ressource: t.ressource, perimetre: t.perimetre, chemin: t.chemin, identite: t.identite,
          id_distant: t === nommees[0] ? idDistant : null, references: t.references, opaque: t.opaque, geste: t.geste }, maintenant));
        c.creations++;
      }
    } else if (t.sorte === "retrait") {
      for (const v of creationsVivantes(lignes).filter((x) => viseeParCible(x, t))) { ecrireLigne(principal, ligneRetrait(v, session, maintenant)); c.retraits++; }
    } else if (t.references.length || t.opaque) {
      ecrireLigne(principal, ligneModification({ session, references: t.references, opaque: t.opaque, geste: t.geste }, maintenant));
      c.modifications++;
    }
  }
  return c;
}

/** `--ouvrir`, `--clore`, `--lister` : la session déclare elle-même un geste que la liste fermée ne reconnaît pas (un banc, un déploiement). */
function enCours(argv) {
  const val = (cle) => { const i = argv.indexOf(cle); return i >= 0 ? argv[i + 1] : null; };
  const racines = val("--racine") ? [resolve(val("--racine"))] : racinesDuProjet({}, process.env);
  const principal = racines[racines.length - 1];
  const session = val("--session") || process.env.CLAUDE_SESSION_ID || "manuel";
  const ressource = val("--ressource");
  if (argv.includes("--lister")) {
    const ouverts = gestesOuverts(lireRegistre(racines));
    process.stdout.write(ouverts.length ? ouverts.map((g) => `${g.session}\t${g.ressource}\t${g.ts}\t${g.expire}\t${g.geste}`).join("\n") + "\n" : "aucun geste distant ouvert\n");
    return 0;
  }
  if (argv.includes("--clore")) {
    const n = clore(racines, principal, { session, ressource: ressource || null });
    process.stdout.write(`${n} geste(s) clos pour la session ${session}\n`);
    return 0;
  }
  if (!ressource) { process.stderr.write("--ouvrir exige --ressource <objet visé> (ex. banc:recette, wrangler r2 bucket rapports)\n"); return 1; }
  const r = ouvrir(racines, principal, { session, ressource: norm(ressource), perimetre: val("--perimetre") ? norm(val("--perimetre")) : null,
    geste: val("--geste") || ressource, dureeMin: val("--duree-min") ? Number(val("--duree-min")) : DUREE_DEFAUT_MIN });
  const t = avertissement(r.conflits, { ressource }, Date.now());
  process.stdout.write(`geste ${r.ouvert ? "ouvert" : "déjà ouvert par cette session"} sur ${norm(ressource)} (session ${session})\n`);
  if (t) process.stderr.write(t + "\n");
  return 0;
}

// ---------------------------------------------------------------------------------------------
// 5. Poser un lot
// ---------------------------------------------------------------------------------------------

/**
 * Valide une spécification de lot et rend la ligne à inscrire, ou { erreur }. D-195 (b) : `textesHumains` porte les messages tapés
 * par l'humain dans la transcription de la session (null : transcription introuvable, le lot est refusé).
 */
export function construireLot(spec, { maintenant = Date.now(), dureeH = DUREE_MAX_H, session = null, textesHumains = null } = {}) {
  if (!/^D-\d+/.test(String(spec?.decision || ""))) return { erreur: "`decision` (D-N) manquante" };
  if (!reponseHumaineValide(spec.reponse_humaine)) return { erreur: "`reponse_humaine` manquante : cite les mots de l'humain qui approuvent la liste, ou la lettre de la décision (« 10a »)" };
  if (!Array.isArray(spec.gestes) || !spec.gestes.length) return { erreur: "`gestes` vide : la liste complète est exigée" };
  const bancal = spec.gestes.findIndex((g) => !texteNonVide(g?.commande) || !texteNonVide(g?.cible) || !texteNonVide(g?.effet) || !texteNonVide(g?.retour_arriere));
  if (bancal >= 0) return { erreur: `geste ${bancal + 1} : commande, cible, effet et retour_arriere sont tous exigés` };
  const sansVerbe = spec.gestes.findIndex((g) => !nommeOutilEtVerbe(g.commande) && !approbationExacte(g.commande));
  if (sansVerbe >= 0) {
    return { erreur: `geste ${sansVerbe + 1} : la commande approuvée nomme l'outil et son verbe en mots littéraux avant tout joker (« az group delete --name rg-essai-* », `
      + "jamais « * », « az * » ni « az group ») ; une commande illisible pour la garde s'approuve par son texte exact, sans joker (D-195 (b))" };
  }
  if (!(dureeH > 0) || dureeH > DUREE_MAX_H) return { erreur: `durée ${dureeH} h refusée : entre 0 et ${DUREE_MAX_H} h` };
  if (!Array.isArray(textesHumains)) return { erreur: "transcription introuvable : passe --transcript <fichier .jsonl de la session où l'humain a répondu> (D-195 (b))" };
  if (!citeDans(spec.reponse_humaine, textesHumains)) {
    return { erreur: "`reponse_humaine` ne figure mot pour mot dans aucun message tapé par l'humain dans la transcription : cite ses mots exacts, sans les reformuler (D-195 (b))" };
  }
  const ligne = {
    schema: "pilot/gestes-approuves@1",
    decision: spec.decision,
    reponse_humaine: spec.reponse_humaine,
    horodatage: new Date(maintenant).toISOString(),
    expire: new Date(maintenant + dureeH * H).toISOString(),
    ...(session ? { session } : {}),
    gestes: spec.gestes.map((g) => ({ commande: g.commande, cible: g.cible, effet: g.effet, retour_arriere: g.retour_arriere })),
  };
  return { ligne };
}

/**
 * D-195 (b) : la transcription de la session qui pose le lot, par `CLAUDE_CODE_SESSION_ID`, que le harnais donne aux commandes qu'il
 * lance (celle d'un sous-agent est celle de sa session) ; cherchée sous `CLAUDE_CONFIG_DIR`, puis `~\.claude`. Null sinon.
 */
function transcriptionDeSession(env = process.env) {
  const id = String(env.CLAUDE_CODE_SESSION_ID || "");
  if (!/^[\w-]+$/.test(id)) return null;
  // TF-2483 : le défaut `~\.claude` se résout par la fonction partagée (env vide : on ne relit pas CLAUDE_CONFIG_DIR, déjà essayée
  // en premier) ; sans répertoire personnel, elle rend `racine: null` et la recherche saute ce candidat au lieu de lever.
  for (const b of [env.CLAUDE_CONFIG_DIR, racineConfigInstallee({}).racine].filter(Boolean)) {
    let projets = [];
    try { projets = readdirSync(join(b, "projects")); } catch { continue; }
    for (const p of projets) { const f = join(b, "projects", p, `${id}.jsonl`); if (existsSync(f)) return f; }
  }
  return null;
}

function poser(argv) {
  const val = (cle) => { const i = argv.indexOf(cle); return i >= 0 ? argv[i + 1] : null; };
  const fichier = val("--lot");
  if (!fichier) { process.stderr.write("--poser exige --lot <lot.json>\n"); return 1; }
  let spec;
  try { spec = JSON.parse(readFileSync(resolve(fichier), "utf8").replace(/^﻿/, "")); } catch (e) { process.stderr.write(`lot illisible : ${e.message}\n`); return 1; }
  const transcript = val("--transcript") ? resolve(val("--transcript")) : transcriptionDeSession(process.env);
  const textesHumains = transcript && existsSync(transcript) ? messagesTapes(transcript) : null;
  const r = construireLot(spec, { dureeH: val("--duree-h") ? Number(val("--duree-h")) : DUREE_MAX_H, session: val("--session"), textesHumains });
  if (r.erreur) { process.stderr.write(`lot refusé : ${r.erreur}\n`); return 1; }
  const racine = val("--racine") ? resolve(val("--racine")) : racinesDuProjet({}, process.env)[0];
  const dossier = existsSync(join(racine, "todo", "TODO.jsonl")) ? "todo" : "forge";
  mkdirSync(join(racine, dossier), { recursive: true });
  const cible = join(racine, dossier, "gestes-approuves.jsonl");
  appendFileSync(cible, JSON.stringify(r.ligne) + "\n", "utf8");
  process.stdout.write(`lot posé : ${r.ligne.decision}, ${r.ligne.gestes.length} geste(s), valable jusqu'au ${r.ligne.expire} (${cible})\n`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes("--poser")) process.exit(poser(process.argv.slice(2)));
  if (["--ouvrir", "--clore", "--lister"].some((o) => process.argv.includes(o))) process.exit(enCours(process.argv.slice(2)));
  // D-194 (b) : une entrée illisible et une panne du juge refusent, sauf réglage humain FORGE_GARDE_ILLISIBLE=laisse. Avant,
  // elles laissaient passer, et le hook n'écrivait que « geste NON jugé » sur stderr.
  const permissif = garde_permissive(process.env);
  const refuser = (motif) => { process.stderr.write(motif + "\n"); process.exit(2); };
  const motifPanne = (e) => `GARDE EN PANNE, COMMANDE REFUSÉE (D-194 (b)) — le juge des gestes distants a levé une exception (${String(e).slice(0, 200)}) : `
    + "il ne peut pas dire si la commande est un geste destructif, il la refuse. Remède : rejoue la commande ; si la panne persiste, rends la main avec ce "
    + "message : réparer le hook est un geste du pilot, et l'humain dispose d'un réglage de secours (references\\GESTES-DISTANTS.md, « Ce que la garde ne sait pas lire »).";
  // Une exception qui échapperait aux gardes ci-dessous ferait sortir node en code 1, que le harnais laisse passer.
  process.on("uncaughtException", (e) => { if (permissif) process.exit(0); refuser(motifPanne(e)); });
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = null;
  try { entree = JSON.parse(brut); } catch { entree = null; }
  if (!entree || typeof entree !== "object" || Array.isArray(entree)) {
    if (!permissif) refuser("ENTRÉE ILLISIBLE, COMMANDE REFUSÉE (D-194 (b)) — le hook n'a pas reçu du harnais un objet JSON lisible : il ne peut pas juger "
      + "la commande, il la refuse. Remède : rejoue la commande ; si le refus persiste, rends la main avec ce message.");
    entree = {};
  }
  const apres = entree?.hook_event_name === "PostToolUse"; // le geste a eu lieu : plus rien à refuser, seulement à clore
  let v = { decision: "laisse" };
  if (!apres) {
    try { v = juger(entree); } catch (e) {
      if (!permissif) refuser(motifPanne(e));
      process.stderr.write(`[hook-gestes-distants] panne du juge, geste NON jugé (réglage FORGE_GARDE_ILLISIBLE=laisse) : ${String(e).slice(0, 200)}\n`);
    }
    if (v.decision === "refuse") refuser(v.motif);
  }
  // TF-2084 : le registre des gestes en cours avertit (jamais ne bloque) et ne fait jamais tomber l'outil.
  let contexte = v.contexte || "";
  try {
    const s = suivre(entree);
    if (s.avertissement) contexte = [contexte, s.avertissement].filter(Boolean).join(" | ");
  } catch (e) { process.stderr.write(`[hook-gestes-distants] registre des gestes en cours illisible, geste NON suivi : ${String(e).slice(0, 200)}\n`); }
  // TF-2128 : au retour d'un outil réussi, la création (avec son identifiant) et le retrait se consignent ; sans cette trace, l'exception ne se juge pas.
  try { consigner(entree); } catch (e) { process.stderr.write(`[hook-gestes-distants] consignation des créations impossible, ressource NON consignée : ${String(e).slice(0, 200)}\n`); }
  if (contexte) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: contexte } }) + "\n");
  process.exit(0);
}
