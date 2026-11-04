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
 *     branche ou d'étiquette distante), `--mirror`, `--prune`.
 * Les lectures (`az group show`, `az role assignment list`, `terraform plan`, `gh api` GET) et les
 * déploiements ordinaires (`terraform apply`, `az deployment … create`, `git push` simple) ne sont pas
 * concernés.
 *
 * NON JUGÉ (déclaré). Un geste joué par un script dont le texte n'est pas dans la commande ; une commande
 * construite par variable ou lue d'un fichier ; une commande dans une chaîne entre guillemets d'une
 * substitution (`"$(az group delete …)"`) ; une commande encodée (`-EncodedCommand`) ; une commande envoyée par
 * `ssh` ou `wsl` ; un alias ; les autres
 * nuages (aws, gcloud, kubectl), faute de fait fondateur ; `terraform state push|mv`, `gh repo archive`,
 * `gh repo deploy-key add`. Surtout : le hook ne prouve pas que l'humain a réellement approuvé le lot ;
 * `reponse_humaine` doit citer ses mots, et la revue du lot (qui l'a écrit, quand, avec quels mots) reste
 * possible parce que le fichier garde chaque ligne.
 *
 * TF-2084 (04/11/2026, RT-39) : le même hook tient le registre des gestes distants EN COURS (`forge\gestes-en-cours.jsonl`,
 * `oracles\lib-gestes-en-cours.mjs`) : il inscrit le début d'un geste qui modifie l'état distant (PreToolUse), sa fin (PostToolUse),
 * et AVERTIT quand une autre session du produit a un geste ouvert sur la même ressource. Il ne refuse jamais pour cela.
 * Liste et limites : `references\GESTES-DISTANTS.md`, section « Deux sessions, une ressource ».
 *
 * Usage : node oracles\hook-gestes-distants.mjs                      (stdin : JSON du hook PreToolUse ou PostToolUse)
 *         node oracles\hook-gestes-distants.mjs --ouvrir --ressource <objet> [--session <id>] [--geste <texte>] [--duree-min N]
 *         node oracles\hook-gestes-distants.mjs --clore [--ressource <objet>] [--session <id>] | --lister
 *         node oracles\hook-gestes-distants.mjs --poser --lot <lot.json> [--racine <dossier>] [--duree-h N] [--session <id>]
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr) ; en mode --poser : 0 posé · 1 lot refusé.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DUREE_DEFAUT_MIN, avertissement, clore, gestesOuverts, lireRegistre, ouvrir } from "./lib-gestes-en-cours.mjs";

export const OUTILS = new Set(["Bash", "PowerShell"]);
export const DUREE_MAX_H = 24;
const H = 3_600_000;

// ---------------------------------------------------------------------------------------------
// 1. Lecture d'une commande : segments, mots, outil
// ---------------------------------------------------------------------------------------------

/**
 * Le mot de fin d'un document en ligne ouvert par cette ligne, hors guillemets et hors commentaire ; null
 * sinon. `etat.q` porte le guillemet resté ouvert d'une ligne à l'autre (D-98 (a) du 29/10/2026).
 */
function motDeDocument(ligne, etat) {
  for (let k = 0; k < ligne.length; k++) {
    const c = ligne[k];
    if (etat.q) { if (c === etat.q && ligne[k - 1] !== "\\") etat.q = null; continue; }
    if (c === '"' || c === "'") { etat.q = c; continue; }
    if (c === "#" && (k === 0 || /\s/.test(ligne[k - 1]))) return null;
    if (c === "<" && ligne[k + 1] === "<" && ligne[k + 2] !== "<") {
      const h = /^<<-?\s*(['"]?)([A-Za-z_]\w*)\1/.exec(ligne.slice(k));
      if (h) return h[2];
    }
  }
  return null;
}

/**
 * Ôte le corps des documents en ligne (`<<EOF … EOF`, `@' … '@`) : du texte écrit, pas des commandes.
 * D-98 (a) : `echo "use <<EOF"` ou un `<<EOF` de commentaire n'ouvrent aucun document, et un document sans
 * sa ligne de fin ne masque rien. Sinon la commande destructive de la ligne suivante n'était jamais jugée.
 */
export function sansCorpsDeDocuments(texte) {
  const lignes = String(texte || "").split(/\r?\n/);
  const sortie = [];
  const etat = { q: null };
  let fin = null;
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    if (fin !== null) { if (fin.test(ligne)) fin = null; continue; }
    sortie.push(ligne);
    const mot = motDeDocument(ligne, etat);
    if (mot) {
      const f = new RegExp(`^\\s*${mot}\\s*$`);
      if (lignes.slice(i + 1).some((l) => f.test(l))) fin = f;
      continue;
    }
    if (!etat.q && /@['"]\s*$/.test(ligne)) {
      const f = new RegExp(`^${ligne.trim().slice(-2, -1) === "'" ? "'" : '"'}@`);
      if (lignes.slice(i + 1).some((l) => f.test(l))) fin = f;
    }
  }
  return sortie.join("\n");
}

/** Les segments d'une commande composée : opérateurs hors guillemets (`&&`, `||`, `;`, `|`, `&`, saut de ligne, parenthèses). */
export function segmenter(commande) {
  const t = sansCorpsDeDocuments(commande);
  const sortie = [];
  let cur = "", q = null;
  const pousser = () => { if (cur.trim()) sortie.push(cur); cur = ""; };
  for (let i = 0; i < t.length; i++) {
    const c = t[i], n = t[i + 1];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if ((c === "`" || c === "\\") && (n === "\n" || (n === "\r" && t[i + 2] === "\n"))) { i += n === "\r" ? 2 : 1; cur += " "; continue; }
    if (c === "\n" || c === "\r" || c === ";" || c === "|" || c === "(" || c === ")") { pousser(); continue; }
    if (c === "&") { if (t[i - 1] === ">" || n === ">") { cur += c; continue; } pousser(); continue; }
    cur += c;
  }
  pousser();
  return sortie;
}

/** Les mots d'un segment, guillemets simples et doubles ôtés. */
export function mots(segment) {
  const out = [];
  let cur = "", actif = false, q = null;
  for (const c of String(segment || "")) {
    if (q) { if (c === q) q = null; else cur += c; continue; }
    if (c === '"' || c === "'") { q = c; actif = true; continue; }
    if (/\s/.test(c)) { if (actif) { out.push(cur); cur = ""; actif = false; } continue; }
    cur += c; actif = true;
  }
  if (actif) out.push(cur);
  return out;
}

const nomOutil = (w) => String(w).split(/[\\/]/).pop().toLowerCase().replace(/\.(exe|cmd|bat|ps1|com)$/, "");
const OUTILS_JUGES = new Set(["az", "terraform", "tofu", "gh", "git", "wrangler", "curl", "wget", "invoke-restmethod", "irm", "invoke-webrequest", "iwr", "invoke-azrestmethod"]);
const SHELLS = new Set(["bash", "sh", "zsh", "dash", "pwsh", "powershell", "cmd"]);
const ENVELOPPES = new Set(["sudo", "env", "time", "nohup", "xargs", "command", "exec", "call", "start", "timeout", "stdbuf", "nice", "then", "do", "else", "{", "}", "&", ".", "!"]);
/** D-98 (a) : `if az group delete …`, `while …`. Le mot de contrôle se saute seul, sans ouvrir une enveloppe. */
const MOTS_DE_CONTROLE = new Set(["if", "elif", "while", "until"]);
const CMDLETS_LOCAUX = new Set(["remove-azcontext", "remove-azenvironment", "remove-azdefault"]);
const estCmdlet = (n) => (/^remove-(az|mg)[a-z0-9]+$/.test(n) && !CMDLETS_LOCAUX.has(n))
  || /^(new|set)-azroleassignment$/.test(n)
  || /^new-mg(serviceprincipalapproleassignment|userapproleassignment|oauth2permissiongrant|groupmember|groupowner|directoryrolemember\w*)$/.test(n);

/**
 * Trouve l'outil joué dans un segment, derrière les enveloppes (`sudo`, `env`, `xargs`…), les affectations
 * (`VAR=x`, `$r =`) et les shells (`bash -c "…"`, `pwsh -Command …`, `cmd /c …`).
 * Rend { outil, args } | { interne } (texte à rejuger) | null.
 */
export function localiser(m) {
  let enveloppe = false;
  for (let i = 0; i < m.length; i++) {
    const w = m[i];
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w)) continue;
    if (/^\$[\w:.]+$/.test(w) && m[i + 1] === "=") { i++; continue; }
    const n = nomOutil(w);
    if (OUTILS_JUGES.has(n) || estCmdlet(n)) return { outil: n, args: m.slice(i + 1) };
    if (SHELLS.has(n)) {
      const k = m.findIndex((x, j) => j > i && /^(-[A-Za-z]*c|-command|\/c|\/k)$/i.test(x));
      return k < 0 ? null : { interne: m.slice(k + 1).join(" ") };
    }
    if (MOTS_DE_CONTROLE.has(n)) continue;
    if (ENVELOPPES.has(n)) { enveloppe = true; continue; }
    if (enveloppe) continue;
    return null;
  }
  return null;
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

const VERBE_SUPPRESSION = /^(delete|purge|remove)(-[a-z0-9-]+)?$/;
const AZ_LOCAL = new Set(["extension", "config", "cache", "version", "login", "logout", "configure", "interactive", "feedback", "upgrade", "find", "survey", "self-test", "completion"]);
const AZ_DROITS = [
  /(^| )role (assignment|definition) (create|update)\b/,
  /^ad app permission (add|grant|admin-consent)\b/,
  /^ad (group|app|sp) (member|owner) add\b/,
  /^keyvault set-policy\b/,
  /^devops security (group membership add|group create|permission (update|reset|reset-all))\b/,
  /^devops user (add|update)\b/,
];

const HTTP = {
  curl: { cles: ["-X", "--request"], implicite: /^(-d|--data(-[a-z-]+)?|--json|-F|--form(-string)?|-T|--upload-file)$/, ps: false },
  wget: { cles: ["--method"], implicite: /^--(post-data|post-file|body-data|body-file)(=.*)?$/, ps: false },
  "gh api": { cles: ["-X", "--method"], implicite: /^(-f|-F|--field|--raw-field|--input)$/, ps: false },
  "az rest": { cles: ["--method", "-m"], implicite: null, ps: false },
  "az devops invoke": { cles: ["--http-method"], implicite: null, ps: false },
  ps: { cles: ["-method"], implicite: /^-(body|infile)$/i, ps: true },
};
const HTTP_PS = new Set(["invoke-restmethod", "irm", "invoke-webrequest", "iwr", "invoke-azrestmethod"]);

/** Valeur d'une option : `-X DELETE`, `-XDELETE`, `--request=DELETE`, `-Method:Delete`. */
function valeurOption(args, cles, ps) {
  for (let k = 0; k < args.length; k++) {
    const a = ps ? args[k].toLowerCase() : args[k];
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
const ADO_DROITS = /(accesscontrolentries|accesscontrollists|securityroles|roleassignments|graph\/(memberships|groups|users)|memberships|userentitlements|memberentitlements|groupentitlements)/i;
const GRAPH_HOTE = /graph\.(microsoft\.com|windows\.net)/i;
const GRAPH_DROITS = /(approleassignments|approleassignedto|oauth2permissiongrants|directoryroles|rolemanagement|roleassignments|\/members|\/owners|\$ref)/i;
const ARM_HOTE = /management\.azure\.com/i;
const ARM_DROITS = /microsoft\.authorization\/(roleassignments|roledefinitions|denyassignments|roleeligibility|roleassignmentschedule)/i;
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
  const M = String(methode || "GET").toUpperCase();
  if (M === "DELETE" && !toutLocal(texte)) return { categorie: "suppression", raison: `\`${libelle}\` en méthode DELETE : suppression sur un service distant` };
  if (["POST", "PUT", "PATCH"].includes(M) && pointDeDroits(texte, libelle)) return { categorie: "droits", raison: `\`${libelle}\` en méthode ${M} sur un point d'accès de droits : attribution ou modification de droits` };
  return null;
}

function jugerAz(args) {
  const pos = positionnels(args);
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

/** Juge UN segment : rend [] ou la liste des gestes destructifs distants { mots, categorie, raison }. */
export function jugerSegment(segment, profondeur = 0) {
  const m = mots(segment);
  const l = localiser(m);
  if (!l) return [];
  if (l.interne !== undefined) return profondeur >= 3 ? [] : jugerCommande(l.interne, profondeur + 1);
  const { outil, args } = l;
  let v = null;
  if (outil === "az") v = jugerAz(args);
  else if (outil === "terraform" || outil === "tofu") v = jugerTerraform(outil, args);
  else if (outil === "gh") v = jugerGh(args);
  else if (outil === "git") v = jugerGit(args);
  else if (outil === "curl" || outil === "wget") v = jugerHttp(outil, HTTP[outil], args);
  else if (HTTP_PS.has(outil)) v = jugerHttp(outil, HTTP.ps, args);
  else if (estCmdlet(outil)) {
    v = /^remove-/.test(outil)
      ? { categorie: "suppression", raison: `\`${outil}\` supprime une ressource distante` }
      : { categorie: "droits", raison: `\`${outil}\` attribue ou modifie des droits` };
  }
  return v ? [{ mots: [outil, ...args], ...v }] : [];
}

/** Les gestes destructifs distants d'une commande complète (tous segments, shells imbriqués compris). */
export function jugerCommande(commande, profondeur = 0) {
  return segmenter(commande).flatMap((s) => jugerSegment(s, profondeur));
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
const reponseHumaineValide = (x) => texteNonVide(x, 5) || (typeof x === "string" && CITATION_DECISION.test(x));

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

/** Juge l'entrée d'un hook PreToolUse. `lots` : lignes déjà lues (sinon lues aux racines du projet). */
export function juger(entree, { lots = null, maintenant = Date.now(), env = process.env } = {}) {
  if (!OUTILS.has(entree?.tool_name)) return { decision: "laisse" };
  const commande = entree?.tool_input?.command;
  if (typeof commande !== "string") return { decision: "laisse" };
  const gestes = jugerCommande(commande);
  if (!gestes.length) return { decision: "laisse" };
  const racines = racinesDuProjet(entree, env);
  const toutes = lots ?? lireLots(racines);
  const etats = toutes.map((l) => ({ lot: l, ...lotValide(l, maintenant, entree?.session_id ?? null) }));
  const valides = etats.filter((e) => e.ok).map((e) => e.lot);
  const nonCouverts = gestes.filter((g) => !valides.some((l) => l.gestes.some((x) => couvre(x.commande, g))));
  if (!nonCouverts.length) return { decision: "laisse", couverts: gestes.length };
  const produit = existsSync(join(racines[0], "forge", "hooks", "factory.mjs")) && !existsSync(join(racines[0], "todo", "TODO.jsonl"));
  const poser = produit
    ? "node forge\\hooks\\factory.mjs gestes-distants --poser --lot <lot.json>"
    : "node oracles\\hook-gestes-distants.mjs --poser --lot <lot.json>";
  const lecture = etats.length
    ? `${etats.length} lot(s) lu(s), ${valides.length} valide(s)${etats.filter((e) => !e.ok).map((e) => ` ; ${e.lot._source} : ${e.raison}`).join("")}`
    : "aucun lot approuvé n'existe";
  return {
    decision: "refuse",
    gestes: nonCouverts,
    motif: `GESTE DISTANT DESTRUCTIF REFUSÉ (TF-1959, D-77) — ${nonCouverts.map((g) => `${g.mots.join(" ")} : ${g.raison}`).join(" ; ")}. `
      + `Aucun lot approuvé valide ne le couvre (${lecture}). `
      + "Remède, en UNE fois pour tous les gestes destructifs distants que tu prévois dans ce tour, pas un par commande : "
      + "(1) pose UNE décision au bloc 3 de ta restitution, liste complète, chaque geste avec sa commande, sa cible, son effet et son retour arrière ; "
      + "(2) quand l'humain l'a approuvée, écris le lot : un fichier JSON { \"decision\": \"D-N\", \"reponse_humaine\": \"<ses mots>\", \"gestes\": [ { \"commande\", \"cible\", \"effet\", \"retour_arriere\" } ] } "
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

/** Valide une spécification de lot et rend la ligne à inscrire, ou { erreur }. */
export function construireLot(spec, { maintenant = Date.now(), dureeH = DUREE_MAX_H, session = null } = {}) {
  if (!/^D-\d+/.test(String(spec?.decision || ""))) return { erreur: "`decision` (D-N) manquante" };
  if (!reponseHumaineValide(spec.reponse_humaine)) return { erreur: "`reponse_humaine` manquante : cite les mots de l'humain qui approuvent la liste, ou la lettre de la décision (« 10a »)" };
  if (!Array.isArray(spec.gestes) || !spec.gestes.length) return { erreur: "`gestes` vide : la liste complète est exigée" };
  const bancal = spec.gestes.findIndex((g) => !texteNonVide(g?.commande) || !texteNonVide(g?.cible) || !texteNonVide(g?.effet) || !texteNonVide(g?.retour_arriere));
  if (bancal >= 0) return { erreur: `geste ${bancal + 1} : commande, cible, effet et retour_arriere sont tous exigés` };
  if (!(dureeH > 0) || dureeH > DUREE_MAX_H) return { erreur: `durée ${dureeH} h refusée : entre 0 et ${DUREE_MAX_H} h` };
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

function poser(argv) {
  const val = (cle) => { const i = argv.indexOf(cle); return i >= 0 ? argv[i + 1] : null; };
  const fichier = val("--lot");
  if (!fichier) { process.stderr.write("--poser exige --lot <lot.json>\n"); return 1; }
  let spec;
  try { spec = JSON.parse(readFileSync(resolve(fichier), "utf8").replace(/^﻿/, "")); } catch (e) { process.stderr.write(`lot illisible : ${e.message}\n`); return 1; }
  const r = construireLot(spec, { dureeH: val("--duree-h") ? Number(val("--duree-h")) : DUREE_MAX_H, session: val("--session") });
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
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { /* entrée illisible : pas un appel d'outil */ }
  const apres = entree?.hook_event_name === "PostToolUse"; // le geste a eu lieu : plus rien à refuser, seulement à clore
  let v = { decision: "laisse" };
  if (!apres) {
    try { v = juger(entree); } catch (e) { process.stderr.write(`[hook-gestes-distants] panne du juge, geste NON jugé : ${String(e).slice(0, 200)}\n`); }
    if (v.decision === "refuse") { process.stderr.write(v.motif + "\n"); process.exit(2); }
  }
  // TF-2084 : le registre des gestes en cours avertit (jamais ne bloque) et ne fait jamais tomber l'outil.
  try {
    const s = suivre(entree);
    if (s.avertissement) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: s.avertissement } }) + "\n");
  } catch (e) { process.stderr.write(`[hook-gestes-distants] registre des gestes en cours illisible, geste NON suivi : ${String(e).slice(0, 200)}\n`); }
  process.exit(0);
}
