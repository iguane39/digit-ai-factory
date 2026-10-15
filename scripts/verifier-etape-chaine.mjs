#!/usr/bin/env node
/**
 * verifier-etape-chaine.mjs — une étape de chaîne se joue avant d'être remise, attend ce qu'elle
 * vient de créer, ne s'appuie pas sur une extension absente de l'agent, et vit dans la chaîne
 * plutôt que dans un script de la session (M-13 ; TF-1543, TF-1546, TF-1548, TF-1549 ; 12/10/2026).
 *
 * LE FAIT. Le 01/10/2026, chez Produit-03, l'étape « Fiche Entra » d'une chaîne de livraison est
 * remise à l'exploitant après compilation par Azure DevOps, contrôle de syntaxe et relecture. Aucune
 * de ses commandes n'avait tourné. Deux arrêts en sont nés : à l'exécution 15803, `az ad app update`
 * suit `az ad app create` de moins d'une seconde et échoue (« Resource does not exist ») parce
 * qu'Entra n'a pas encore répliqué la fiche neuve ; à la revue, `az webapp auth update --set` est
 * refusé par l'agent, qui n'a pas l'extension authV2 (leçon mesurée le 22/08 et restée en
 * commentaire d'un autre script). Et la veille, la même étape avait été proposée comme un script
 * lancé par la session, au lieu d'un étage de la chaîne que l'exploitant rejoue.
 *
 * CE QUI EST JUGÉ, HORS LIGNE, sur les fichiers de chaîne et de script d'un produit :
 *   EC-1  un objet d'annuaire créé (`az ad app create`, `az ad group create`…) n'est pas complété
 *         par la commande suivante avant qu'une LECTURE répétée avec ATTENTE (boucle, `sleep`,
 *         `retry`) n'ait montré qu'il est lisible ;
 *   EC-2  aucun `az webapp auth update|show|set` : sur l'agent hébergé, sans l'extension authV2,
 *         la commande retombe sur la première génération du réglage ou refuse `--set`. Se lit et
 *         s'écrit par l'API `authsettingsV2`. Une extension mesurée présente se déclare en
 *         commentaire daté juste au-dessus de la commande ;
 *   EC-4  quand la chaîne du produit écrit dans la plateforme, le dossier de MEP porte une section
 *         « Étapes de chaîne remises à l'exploitant » : ce qui a été exécuté hors production et
 *         quand, les écritures de production jouées à blanc avec leur différence, et la liste des
 *         branches que seule la production exécutera (« aucune » se déclare) ;
 *   EC-5  (mode --restitution) une option d'une restitution ne fait pas lancer par la session un
 *         script de déploiement ou de mise en service : l'étape devient un étage de la chaîne,
 *         rejouable seul par l'exploitant.
 *   EC-6  AVERTISSANTE (TF-1748, lot Produit-76 20260925a RV-4, 15/10/2026) : chaque script bash
 *         embarqué dans un fichier de chaîne, macros `$(nom)`, `${{ … }}` et `$[ … ]` neutralisées,
 *         passe `bash -n` ; un défaut de syntaxe ne se découvre sinon qu'après le déploiement ;
 *   EC-7  AVERTISSANTE (TF-1749, même lot, RV-5) : un étage qui déploie vers un `environment:` porte
 *         `lockBehavior: sequential`, sur l'étage ou en tête de la chaîne.
 *   Mesure d'entrée, 15/10/2026, 41 chaînes Azure DevOps du poste : 232 scripts bash, 0 refusé par
 *   `bash -n` ; 9 étages de déploiement sans verrou.
 * (EC-3, la fenêtre d'autorisation refermée quel que soit qui l'a ouverte, est une règle de
 *  doctrine que ce contrôle ne juge pas : voir NON_JUGE.)
 *
 * Usage : node scripts/verifier-etape-chaine.mjs <produit> [--document <dossier.md>]
 *         node scripts/verifier-etape-chaine.mjs --restitution <fichier.md>
 * Sortie : JSON · exit 0 = conforme · 1 = au moins un refus · 2 = rien à juger.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const NON_JUGE = [
  "EC-3 : qu'une fenêtre d'autorisation se referme à la fin de l'exécution quel que soit qui l'a ouverte (ETAPE-MEP.md § 3 decies, règle 4) : l'état d'une autorisation vit dans la plateforme, ce contrôle hors ligne ne le lit pas",
  "la création et l'écriture qui vivent dans deux étapes ou deux fichiers différents : EC-1 ne lit que la proximité dans un même fichier (30 lignes logiques)",
  "que la lecture avec attente porte sur LE BON objet : EC-1 exige une lecture et une attente entre la création et l'écriture, il ne suit pas l'identifiant",
  "la VÉRACITÉ de ce que le dossier déclare avoir exécuté hors production (EC-4) : le contrôle exige la déclaration, sa date et ses trois rubriques, il ne rejoue pas la commande",
  "l'extension authV2 déclarée présente (EC-2) : le commentaire daté est cru, la mesure se refait avec `az extension list` dans la chaîne même",
  "EC-5 : une option de restitution qui fait lancer le geste sous d'autres mots que ceux de la liste (sujet de session, verbe de lancement, objet de type script, mot de déploiement sur la même ligne)",
  "EC-6 : le COMPORTEMENT d'un script de chaîne : `bash -n` ne lit que la syntaxe (`[ -z \"$X\" ] && affectation` sous `set -e` passe et tue le script) ; les scalaires repliés `>` et les scripts PowerShell ne sont pas lus",
  "EC-7 : le contrôle « Exclusive Lock » de l'environnement Azure DevOps : il vit dans la plateforme, sans lui `lockBehavior: sequential` reste sans effet ; et le contrôle d'état final de remplacement (image réellement configurée relue en fin d'étage)",
];

const EXTENSIONS = /\.(sh|bash|ps1|psm1|ya?ml)$/i;
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next", "output", "input", ".terraform"]);
const lire = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

function parcourir(racine, profondeur, garder) {
  const out = [];
  const marcher = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!IGNORES.has(e.name) && (reste > 0 || e.name === ".github")) marcher(p, reste - 1); }
      else if (e.isFile()) {
        const rel = relative(racine, p).split("\\").join("/");
        if (garder(rel, e.name)) out.push({ chemin: p, rel });
      }
    }
  };
  marcher(racine, profondeur);
  return out;
}

/** Les lignes LOGIQUES d'un script : une continuation (`\` en shell, accent grave en PowerShell) se rejoint. */
function lignesLogiques(texte) {
  const brutes = texte.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < brutes.length; i++) {
    let l = brutes[i];
    const debut = i;
    while (/(\\|`)\s*$/.test(l) && i + 1 < brutes.length) l = l.replace(/(\\|`)\s*$/, " ") + brutes[++i].trim();
    out.push({ texte: l, ligne: debut + 1 });
  }
  return out;
}
const estCommentaire = (l) => /^\s*(#|\/\/|REM\b)/i.test(l);

// ── EC-1 et EC-2 : les lignes d'un script ──────────────────────────────────────────────────────
// Des DONNÉES : ce qui CRÉE un objet d'annuaire, ce qui le COMPLÈTE, ce qui le LIT, ce qui ATTEND.
const CREATION = /\baz\s+ad\s+(?:app|group|user)\s+create\b|\baz\s+ad\s+sp\s+create-for-rbac\b|\bNew-(?:Az|Mg)AD(?:Application|ServicePrincipal|Group|User)\b|\bNew-Mg(?:Application|ServicePrincipal|Group)\b/i;
const COMPLEMENT = /\baz\s+ad\s+(?:app|group)\s+(?:update|delete|owner\s+add|credential\s+(?:reset|delete)|federated-credential\s+create|permission\s+(?:add|grant|admin-consent)|member\s+add)\b|\baz\s+ad\s+sp\s+(?:create|update|delete|credential)\b|\bUpdate-(?:Az|Mg)AD\w+|\bUpdate-Mg(?:Application|ServicePrincipal)\b|\bNew-Mg(?:ServicePrincipal|Application)(?:AppRoleAssignment|Password|FederatedIdentityCredential)\b|\baz\s+role\s+assignment\s+create\b/i;
const LECTURE = /\baz\s+ad\s+(?:app|sp|group|user)\s+(?:show|list)\b|\baz\s+rest\b(?![^\n]*--method\s+(?:post|patch|put|delete)\b)|\bGet-(?:Az|Mg)AD\w+|\bGet-Mg(?:Application|ServicePrincipal)\b/i;
const ATTENTE = /\bsleep\b|\bStart-Sleep\b|\buntil\b|\bwhile\b|\bretry\b|\br[ée]essa|\battendre\b|\bwait\b|\bfor\s+\w+\s+in\s+(?:\$\(seq|\{?\d)|\bfor\s*\(\(|\bfor\s+\$\w+\s+in\s+1\.\./i;
const AUTH_CLI = /\baz\s+webapp\s+auth\s+(?:update|show|set|config-version)\b/i;
const EXTENSION_DECLAREE = /authV2[^\n]*(?:pr[ée]sente|mesur)[^\n]*\b20\d{2}-\d{2}-\d{2}\b|\b20\d{2}-\d{2}-\d{2}\b[^\n]*authV2[^\n]*(?:pr[ée]sente|mesur)/i;
const FENETRE = 30;

export function jugerScript(texte, rel) {
  const findings = [];
  const refus = (regle, ligne, message) => findings.push({ regle, statut: "FAIL", ou: `${rel}:${ligne}`, message });
  const mesure = { creations_annuaire: 0, completees_sans_attente: 0, commandes_auth: 0 };
  const L = lignesLogiques(texte);
  L.forEach(({ texte: t, ligne }, idx) => {
    if (estCommentaire(t)) return;
    if (CREATION.test(t)) {
      mesure.creations_annuaire++;
      for (let k = idx + 1; k < Math.min(L.length, idx + 1 + FENETRE); k++) {
        const s = L[k].texte;
        if (estCommentaire(s)) continue;
        if (!COMPLEMENT.test(s)) continue;
        const entre = L.slice(idx + 1, k + 1).filter((x) => !estCommentaire(x.texte)).map((x) => x.texte);
        const lu = entre.some((x) => LECTURE.test(x));
        const attend = entre.some((x) => ATTENTE.test(x));
        if (!(lu && attend)) {
          mesure.completees_sans_attente++;
          refus("EC-1", L[k].ligne, `objet d'annuaire créé à la ligne ${ligne} (« ${t.trim().slice(0, 70)} »), complété ici sans que `
            + `${!lu && !attend ? "ni une lecture ni une attente" : !lu ? "aucune lecture" : "aucune attente"} ne les sépare : « ${s.trim().slice(0, 80)} ». `
            + "Entra réplique une fiche neuve en quelques secondes ; le 01/10/2026, `az ad app update` lancé aussitôt après `az ad app create` a échoué en production "
            + "(Resource does not exist). Lire l'objet en boucle (12 essais de 10 s) jusqu'à ce qu'il réponde, puis écrire, et réessayer la création de l'application d'entreprise (6 essais)");
        }
        break;
      }
    }
    if (AUTH_CLI.test(t)) {
      mesure.commandes_auth++;
      const dessus = L.slice(Math.max(0, idx - 3), idx).map((x) => x.texte).join("\n");
      if (!EXTENSION_DECLAREE.test(dessus)) {
        refus("EC-2", ligne, `« ${t.trim().slice(0, 90)} » : l'agent hébergé n'a pas l'extension authV2 (mesuré le 22/08/2026, refus de --set mesuré le 01/10 avec AZURE_EXTENSION_DIR vide) — `
          + "la commande retombe sur la première génération du réglage ou refuse ses arguments. Lire et écrire par l'API : "
          + "`az rest --method get|put --url \"https://management.azure.com/subscriptions/<id>/resourceGroups/<groupe>/providers/Microsoft.Web/sites/<app>/config/authsettingsV2?api-version=<en vigueur>\"`. "
          + "Si l'extension a été mesurée présente sur l'agent, le dire juste au-dessus : `# authV2 : extension mesurée présente le AAAA-MM-JJ`");
      }
    }
  });
  return { findings, mesure };
}

// ── EC-6 et EC-7 : le fichier de chaîne lui-même (TF-1748, TF-1749 — AVERTISSANTES) ──────────────
// EC-6 : chaque script bash embarqué (`bash:`, `script:`, `inlineScript:` d'une tâche AzureCLI dont le
// scriptType n'est pas PowerShell, `run:` d'un flux GitHub) est extrait, ses macros neutralisées —
// `$(nom)` d'Azure DevOps, que bash lirait comme une substitution de commande, `${{ … }}` et `$[ … ]`
// — puis passé à `bash -n`. LIMITE, écrite ici comme au lot : `bash -n` ne voit que la syntaxe ; le
// même jour, `[ -z "$VAR" ] && affectation` sous `set -e` tuait un script à la deuxième itération,
// syntaxe valide, comportement faux.
// EC-7 : un étage qui porte un job `deployment:` vers un `environment:` porte `lockBehavior:
// sequential` (sur l'étage, ou en tête de la chaîne). Il reste sans effet tant que l'environnement n'a
// pas le contrôle « Exclusive Lock », que ce contrôle hors ligne ne lit pas (NON_JUGE).
const CLE_SCRIPT = /^(\s*)(?:-\s+)?(bash|script|inlineScript|run)\s*:\s*(.*)$/;
const SCRIPT_TYPE_NON_BASH = /\bscriptType\s*:\s*['"]?(?:ps|pscore|batch|powershell)\b/i;
const SHELL_NON_BASH = /\bshell\s*:\s*['"]?(?:pwsh|powershell|cmd|python)\b/i;

let BASH = undefined;
/** Le bash du poste : FORGE_BASH, puis celui de Git pour Windows, puis `bash` du chemin. null si aucun. */
function bashDuPoste() {
  if (BASH !== undefined) return BASH;
  const candidats = [process.env.FORGE_BASH,
    ...(process.platform === "win32" ? ["C:/Program Files/Git/bin/bash.exe", "C:/Program Files/Git/usr/bin/bash.exe"] : []), "bash"].filter(Boolean);
  BASH = null;
  for (const c of candidats) {
    if (c !== "bash" && !existsSync(c)) continue;
    const r = spawnSync(c, ["-c", "echo ok"], { encoding: "utf8", timeout: 15000 });
    if (r.status === 0 && /ok/.test(r.stdout || "")) { BASH = c; break; }
  }
  return BASH;
}

/** Les scripts bash d'un fichier de chaîne : [{ ligne (1re ligne du script dans le YAML), texte }]. */
export function extraireScripts(yaml) {
  const lignes = yaml.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lignes.length; i++) {
    const m = CLE_SCRIPT.exec(lignes[i]);
    if (!m) continue;
    const [, retrait, cle, valeur] = m;
    const voisinage = lignes.slice(Math.max(0, i - 8), Math.min(lignes.length, i + 8)).join("\n");
    if (cle === "inlineScript" && SCRIPT_TYPE_NON_BASH.test(voisinage)) continue;
    if (cle === "run" && SHELL_NON_BASH.test(voisinage)) continue;
    // `script:` sous les `inputs:` d'une tâche : bash seulement pour Bash@N (PowerShell@2 porte aussi
    // une clé `script:` ; mesuré le 15/10/2026 sur 41 chaînes du poste, 1 faux avertissement sans ce garde).
    if (cle === "script" && !/^\s*-\s/.test(lignes[i])) {
      const tache = lignes.slice(Math.max(0, i - 12), i).reverse().find((l) => /^\s*-?\s*task\s*:/.test(l));
      if (tache && !/task\s*:\s*['"]?Bash@/i.test(tache)) continue;
    }
    const v = valeur.trim();
    if (/^\|[-+]?\d*$/.test(v)) {
      const corps = [];
      let j = i + 1, indent = null;
      for (; j < lignes.length; j++) {
        const l = lignes[j];
        if (!l.trim()) { corps.push(""); continue; }
        const n = /^\s*/.exec(l)[0].length;
        if (indent === null) { if (n <= retrait.length) break; indent = n; }
        if (n < indent) break;
        corps.push(l.slice(indent));
      }
      while (corps.length && !corps[corps.length - 1]) corps.pop();
      if (corps.length) out.push({ ligne: i + 2, texte: corps.join("\n") + "\n" });
      i = j - 1;
    } else if (v && !/^[>]/.test(v)) {
      out.push({ ligne: i + 1, texte: v.replace(/^(['"])([\s\S]*)\1$/, "$2") + "\n", enLigne: true });
    }
  }
  return out;
}

const neutraliserMacros = (s) => s
  .replace(/\$\{\{[\s\S]*?\}\}/g, "__EXPR__")
  .replace(/\$\[[^\]\n]*\]/g, "__EXPR__")
  .replace(/\$\(([A-Za-z_][\w.\-]*)\)/g, "__MACRO__");

export function jugerChaine(texte, rel) {
  const findings = [];
  const mesure = { scripts_de_chaine: 0, scripts_en_echec_de_syntaxe: 0, etages_sans_verrou: 0 };
  // EC-6
  const scripts = extraireScripts(texte);
  mesure.scripts_de_chaine = scripts.length;
  if (scripts.length) {
    const bash = bashDuPoste();
    if (!bash) findings.push({ regle: "EC-6", statut: "SKIP", ou: rel, message: `${scripts.length} script(s) bash embarqué(s), non jugé(s) : aucun bash sur ce poste (FORGE_BASH, Git pour Windows, bash du chemin)` });
    else for (const s of scripts) {
      const r = spawnSync(bash, ["-n"], { input: neutraliserMacros(s.texte), encoding: "utf8", timeout: 15000 });
      if (r.status === 0) continue;
      mesure.scripts_en_echec_de_syntaxe++;
      const err = String(r.stderr || "").trim().split(/\r?\n/)[0] || `bash -n a rendu ${r.status}`;
      const n = Number((/line (\d+)/.exec(err) || [])[1]);
      const ligne = Number.isFinite(n) && !s.enLigne ? s.ligne + n - 1 : s.ligne;
      findings.push({ regle: "EC-6", statut: "AVERTISSEMENT", ou: `${rel}:${ligne}`,
        message: `script de la chaîne refusé par \`bash -n\` (macros $(nom) neutralisées) : ${err.replace(/^.*?line \d+:\s*/, "")}. Un défaut de syntaxe d'un script de chaîne ne se découvre qu'à l'exécution, après le déploiement : `
          + "le 25/09/2026, une exécution a déployé correctement puis est morte sur un `fi` en double, chaîne rouge sur un déploiement sain (TF-1748). "
          + "Limite : `bash -n` ne voit pas les défauts de comportement (`[ -z \"$X\" ] && …` sous `set -e`)" });
    }
  }
  // EC-7
  const lignes = texte.split(/\r?\n/);
  const enTete = lignes.some((l) => /^lockBehavior\s*:\s*sequential\b/.test(l));
  const debuts = lignes.map((l, i) => (/^\s*-\s*stage\s*:/.test(l) ? i : -1)).filter((i) => i >= 0);
  const etages = debuts.length ? debuts.map((d, k) => ({ d, f: k + 1 < debuts.length ? debuts[k + 1] : lignes.length })) : [{ d: 0, f: lignes.length }];
  for (const { d, f } of etages) {
    const bloc = lignes.slice(d, f).join("\n");
    if (!/^\s*-\s*deployment\s*:/m.test(bloc) || !/^\s*environment\s*:/m.test(bloc)) continue;
    if (enTete || /^\s*lockBehavior\s*:\s*sequential\b/m.test(bloc)) continue;
    mesure.etages_sans_verrou++;
    const env = (/^\s*environment\s*:\s*(?:\n\s*name\s*:\s*)?['"]?([\w.\-]+)/m.exec(bloc) || [])[1] || "?";
    findings.push({ regle: "EC-7", statut: "AVERTISSEMENT", ou: `${rel}:${d + 1}`,
      message: `étage de déploiement vers l'environnement « ${env} » sans \`lockBehavior: sequential\` : deux exécutions peuvent viser la même cible en même temps, et le retour arrière de la seconde défaire la première, restée verte. `
        + "Deux gestes, dans cet ordre : créer l'environnement AVEC le contrôle « Exclusive Lock », puis poser `lockBehavior: sequential` sur l'étage (sans effet tant que le contrôle n'existe pas). "
        + "À défaut de droit sur l'environnement, un contrôle d'état final en fin d'étage : relire l'image réellement configurée et refuser de déclarer verte une livraison qui n'est plus en service (TF-1749, exécutions du 25/09/2026 à 18 s d'écart)" });
  }
  return { findings, mesure };
}

// ── EC-4 : la section du dossier de MEP ────────────────────────────────────────────────────────
const FICHIER_DE_CHAINE = /(^|\/)azure-pipelines[^/]*\.ya?ml$|(^|\/)\.github\/workflows\/[^/]+\.ya?ml$|(^|\/)\.gitlab-ci\.ya?ml$|(^|\/)(?:\.azure-pipelines|\.pipelines|pipelines)\/.+\.ya?ml$/i;
// Une écriture dans la plateforme : une commande az qui n'est pas une lecture, ou terraform apply.
const ECRITURE_PLATEFORME = /\baz\s+(?:ad|role|webapp|group|keyvault|containerapp|functionapp|policy|deployment|acr|storage|appservice)\s+(?:[\w-]+\s+)?(?:create|update|set|delete|add|assign|deploy|restart|start|stop|swap|config|up|import|grant|admin-consent)\b|\bterraform\s+apply\b|\baz\s+rest\b[^\n]*--method\s+(?:post|put|patch|delete)\b/i;

function sectionsEtapesDeChaine(texte) {
  const lignes = texte.split(/\r?\n/);
  const titres = [];
  let code = false;
  lignes.forEach((l, i) => {
    if (/^\s*```/.test(l)) { code = !code; return; }
    if (code) return;
    const m = /^(#{1,6})\s+(.*\S)\s*$/.exec(l);
    if (m) titres.push({ i, niveau: m[1].length, texte: m[2] });
  });
  return titres.filter((t) => /[ée]tapes?\s+de\s+cha[iî]ne/i.test(t.texte)).map((t) => {
    const fin = titres.find((u) => u.i > t.i && u.niveau <= t.niveau);
    return { titre: t.texte, lignes: lignes.slice(t.i + 1, fin ? fin.i : lignes.length) };
  });
}

export function jugerProduit(racine, { document = null } = {}) {
  const findings = [];
  const mesure = { fichiers: 0, creations_annuaire: 0, completees_sans_attente: 0, commandes_auth: 0, fichiers_de_chaine: 0, ecritures_de_chaine: 0, dossiers: 0, refus: 0 };
  const fichiers = parcourir(racine, 6, (rel, nom) => EXTENSIONS.test(nom));
  for (const { chemin, rel } of fichiers) {
    const texte = lire(chemin);
    if (!texte || texte.length > 2_000_000) continue;
    mesure.fichiers++;
    const r = jugerScript(texte, rel);
    findings.push(...r.findings);
    for (const k of ["creations_annuaire", "completees_sans_attente", "commandes_auth"]) mesure[k] += r.mesure[k];
  }
  // EC-4 — seulement si une chaîne existe ET écrit dans la plateforme (dans son fichier ou dans un script du produit).
  const chaines = fichiers.filter((f) => FICHIER_DE_CHAINE.test(f.rel));
  mesure.fichiers_de_chaine = chaines.length;
  // EC-6 et EC-7 (avertissantes) : sur chaque fichier de chaîne, qu'il écrive ou non dans la plateforme.
  Object.assign(mesure, { scripts_de_chaine: 0, scripts_en_echec_de_syntaxe: 0, etages_sans_verrou: 0, avertissements: 0 });
  for (const { chemin, rel } of chaines) {
    const r = jugerChaine(lire(chemin), rel);
    findings.push(...r.findings);
    for (const k of ["scripts_de_chaine", "scripts_en_echec_de_syntaxe", "etages_sans_verrou"]) mesure[k] += r.mesure[k];
  }
  mesure.avertissements = findings.filter((f) => f.statut === "AVERTISSEMENT").length;
  if (chaines.length) {
    mesure.ecritures_de_chaine = fichiers.filter((f) => lignesLogiques(lire(f.chemin)).some((l) => !estCommentaire(l.texte) && ECRITURE_PLATEFORME.test(l.texte))).length;
  }
  const dossiers = document ? [document] : parcourir(racine, 4, (rel, nom) => /^DOSSIER-MEP.*\.md$/i.test(nom)).map((d) => d.chemin);
  mesure.dossiers = dossiers.length;
  if (mesure.ecritures_de_chaine && dossiers.length) {
    for (const chemin of dossiers) {
      const nom = relative(racine, chemin).split("\\").join("/") || chemin;
      const sections = sectionsEtapesDeChaine(lire(chemin));
      const corps = sections.flatMap((s) => [s.titre, ...s.lignes]).join("\n");
      const ref = "ETAPE-MEP.md § 3 decies, règle 5 (M-13, TF-1549)";
      if (!sections.length) {
        findings.push({ regle: "EC-4", statut: "FAIL", ou: nom, message: `la chaîne du produit écrit dans la plateforme (${mesure.ecritures_de_chaine} fichier(s) d'écriture, ${chaines.length} fichier(s) de chaîne) et le dossier ne porte aucune section « Étapes de chaîne remises à l'exploitant ». Le 01/10/2026, une étape remise sur sa seule compilation a coûté un arrêt de production et un second évité de justesse — ${ref}` });
        continue;
      }
      const ko = (message) => findings.push({ regle: "EC-4", statut: "FAIL", ou: nom, message: `${message} — ${ref}` });
      // Les trois mots sur UNE ligne : l'exécution, son lieu (hors production) et sa date.
      if (!corps.split("\n").some((l) => /ex[ée]cut/i.test(l) && /hors\s+production/i.test(l) && /\b20\d{2}-\d{2}-\d{2}\b/.test(l))) {
        ko("la section ne dit pas quelles commandes ont été EXÉCUTÉES hors production, ni quand : une ligne « Exécuté hors production le AAAA-MM-JJ sur un client semblable à l'agent : <commandes> » est attendue. Une compilation et une relecture ne sont pas une exécution");
      }
      if (!(/(?:à\s+blanc|\ba\s+blanc\b|what-if|dry-run|terraform\s+plan)/i.test(corps) && /diff[ée]rence|\bdiff\b/i.test(corps))) {
        ko("la section ne porte pas les écritures de production JOUÉES À BLANC avec leur différence (`what-if`, `--dry-run`, `terraform plan`, puis ce qu'elles changeraient)");
      }
      if (!/branches?\s+que\s+seule\s+la\s+production|seule\s+la\s+production\s+ex[ée]cute/i.test(corps)) {
        ko("la section ne liste pas les branches que SEULE la production exécutera (« Branches que seule la production exécute : aucune » se déclare) — c'est ce que l'exploitant doit savoir non rejoué");
      }
    }
  }
  mesure.refus = findings.filter((f) => f.statut === "FAIL").length;
  const rienAJuger = !mesure.creations_annuaire && !mesure.commandes_auth && !mesure.ecritures_de_chaine;
  return { findings, mesure, rienAJuger, motif: rienAJuger ? "M-13 sans objet : ni création d'objet d'annuaire, ni commande az webapp auth, ni chaîne qui écrit dans la plateforme" : null };
}

// ── EC-5 : la restitution ──────────────────────────────────────────────────────────────────────
const SUJET_SESSION = /\b(?:la\s+session|l['’]agent|l['’]assistant|Claude|je\s+(?:lance|joue|ex[ée]cute|ouvre))\b/i;
const VERBE_LANCER = /\b(?:lance[rz]?|lanc[ée]e?s?|joue[rz]?|jou[ée]e?s?|ex[ée]cute[rz]?|ex[ée]cut[ée]e?s?)\b/i;
const OBJET_SCRIPT = /\b(?:script|commande|\.sh|\.ps1|az\s+ad|az\s+webapp)\b/i;
const MOT_DEPLOIEMENT = /d[ée]ploiement|mise\s+en\s+(?:service|production)|\bMEP\b|fiche\s+Entra|inscription|en\s+production|cr[ée]er\s+la\s+fiche|connexion\s+de\s+production/i;
const REMEDE_DANS_LA_LIGNE = /[ée]tage\s+de\s+la\s+cha[iî]ne|dans\s+la\s+cha[iî]ne|rejou(?:able|[ée]e?)\s+par\s+l['’]exploitant|param[eè]tre\s+de\s+la\s+cha[iî]ne/i;
const NEGATION = /\b(?:jamais|pas\s+de|aucun|aucune|sans)\b/i;

export function jugerRestitution(texte, rel) {
  const findings = [];
  let code = false;
  let lignes = 0;
  texte.split(/\r?\n/).forEach((l, i) => {
    if (/^\s*```/.test(l)) { code = !code; return; }
    if (code || /^\s*>?\s*$/.test(l)) return;
    lignes++;
    if (SUJET_SESSION.test(l) && VERBE_LANCER.test(l) && OBJET_SCRIPT.test(l) && MOT_DEPLOIEMENT.test(l)
      && !REMEDE_DANS_LA_LIGNE.test(l) && !NEGATION.test(l)) {
      findings.push({ regle: "EC-5", statut: "FAIL", ou: `${rel}:${i + 1}`,
        message: `une option fait lancer par la session un script de déploiement ou de mise en service : « ${l.trim().slice(0, 110)} ». Une étape de déploiement est un ÉTAGE de la chaîne, rejouable seul par l'exploitant ; le 01/10/2026, la restitution 20261001n a posé 3 options qui faisaient créer la fiche Entra par un script de la session, et le commanditaire a répondu « cette étape doit être dans le pipeline » (7e aller-retour du jour). Proposer d'abord l'étage rejouable seul, avec la preuve que la chaîne compilée sans lui reste identique` });
    }
  });
  return { findings, mesure: { lignes_lues: lignes, refus: findings.length }, rienAJuger: lignes === 0 };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify({ outil: "verifier-etape-chaine", version: "1.1.0", regle: "M-13 (ETAPE-MEP.md § 3 decies)", ...corps, non_juge: NON_JUGE }, null, 1) + "\n"); process.exit(code); };
  const fichierRestitution = valeur("--restitution");
  if (fichierRestitution) {
    if (!existsSync(fichierRestitution)) sortir({ verdict: "NON_JUGEABLE", message: `restitution introuvable : ${fichierRestitution}` }, 2);
    const r = jugerRestitution(lire(fichierRestitution), fichierRestitution.split(/[\\/]/).pop());
    sortir({ mode: "restitution", verdict: r.findings.length ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS", mesure: r.mesure, findings: r.findings }, r.findings.length ? 1 : r.rienAJuger ? 2 : 0);
  } else {
    const cible = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--document")[0] || process.cwd();
    if (!existsSync(cible) || !statSync(cible).isDirectory()) sortir({ verdict: "NON_JUGEABLE", message: `produit introuvable : ${cible}` }, 2);
    const r = jugerProduit(cible, { document: valeur("--document") });
    sortir({ mode: "produit", cible, verdict: r.mesure.refus ? "FAIL" : r.rienAJuger ? "SKIP" : "PASS", motif: r.motif || undefined, mesure: r.mesure, findings: r.findings }, r.mesure.refus ? 1 : r.rienAJuger ? 2 : 0);
  }
}
