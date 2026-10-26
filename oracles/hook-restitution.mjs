#!/usr/bin/env node
/**
 * hook-restitution.mjs — hook `Stop` de Claude Code : le message final d'un tour de TRAVAIL
 * est jugé par `oracle-synthese` (gabarits\RESTITUTION.md, S1-S10) AVANT d'être accepté.
 * S'il échoue, l'arrêt est refusé et l'assistant reçoit les règles en défaut : il réécrit.
 *
 * Pourquoi un hook (R-44, mandat humain du 20/08 — « plusieurs règles ne sont toujours pas
 * appliquées : le format de sortie, les indices sur les décisions et prochaines actions ») :
 * la consigne existait depuis le 13/08, l'oracle depuis le 14/08 — déclaré « informatif et
 * non bloquant ». Une règle qu'aucun mécanisme n'exécute décore. Ce hook est le mécanisme.
 *
 * Entrée (stdin, JSON Claude Code) : { session_id, transcript_path, stop_hook_active }.
 * Sortie : rien (exit 0) = arrêt accepté · {"decision":"block","reason":…} = réécrire.
 * Garde anti-boucle : si `stop_hook_active` est vrai (le hook a déjà refusé une fois dans ce
 * tour), l'arrêt est accepté — une seconde réécriture n'est pas imposée ; depuis TF-1739 (15/10/2026),
 * la réécriture est rejugée et, en défaut, son verdict est AFFICHÉ à l'humain (systemMessage).
 *
 * Ce qui est un tour de TRAVAIL (et donc une restitution) : un tour qui a ÉCRIT depuis le dernier
 * message humain (fonction `ecrituresDuTour`) — un appel Write, Edit, MultiEdit ou NotebookEdit, une
 * écriture par commande hors du dossier temporaire, un commit, un push ou une autre commande à effet,
 * un agent qui peut écrire, un outil connecté qui écrit. Depuis le 26/10/2026 (D-75 (c), TF-1947), le
 * NOMBRE de commandes de lecture ne compte plus : jusque-là, quatre commandes faisaient un tour de
 * travail, et une question qui lisait cinq fichiers recevait une restitution complète. Un tour de
 * lecture ou de conversation n'est pas jugé.
 *
 * TF-0904 (08/09/2026) — ET DEPUIS, UN VERDICT SANS ÉCRITURE L'EST AUSSI. Le critère ci-dessus
 * mesure l'EFFORT ; `RESTITUTION.md` régit « tout message de fin de traitement », c'est-à-dire la
 * NATURE de ce qui est rendu. Un message final est donc jugé aussi quand il porte un VERDICT ou
 * dépasse 150 mots, écriture ou pas (fonction `jugeable`) ; les exemptions — accusé de réception,
 * réponse courte, question rendue à l'humain — sont écrites au §Portée du gabarit.
 */
import { readFileSync, writeFileSync, mkdtempSync, appendFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir, homedir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { controlerOuiDeCompletude, affirmationsDExhaustivite, lignesMesure, RAPPEL_MESURE } from "./lib-exhaustivite.mjs";
import { REGISTRE_PILOT, lireRegistrePilot, estAuPilot, memeQuestion } from "./lib-decisions.mjs";
// TF-1947 (26/10/2026) — LA LECTURE DES ÉCRITURES PAR COMMANDE EST CELLE DE LA RELECTURE D'INTENTION (TF-1941),
// réutilisée et non recopiée. Import dynamique : une copie partielle du pilot sans `scripts\` ne fait pas tomber le juge
// de fin de tour, qui garde alors son propre relevé d'effets (`detecterEffets`) ; `ecrituresDuTour` le dit dans sa sortie.
let ecrituresParCommande = null;
try { ({ ecrituresParCommande } = await import(new URL("../scripts/relecture-intention.mjs", import.meta.url).href)); } catch { /* repli : relevé d'effets du hook seul */ }

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-synthese.mjs");
const ECRITURES = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);
const COMMANDES = new Set(["Bash", "PowerShell"]);

// TF-1739 (lot du 25/08/2026, RV-2) — LA RÉÉCRITURE EST JUGÉE, ET SON VERDICT SE VOIT. La garde
// anti-boucle (`stop_hook_active`) acceptait l'arrêt sans rien dire : une restitution refusée sur
// S1/S3/S4/S6 a été réécrite, la réécriture n'a jamais été rejugée devant personne, et rejouée à la
// main elle rendait S15 et S16 FAIL. Le second refus n'est toujours pas imposé (pas de boucle), mais
// le verdict de la réécriture est AFFICHÉ à l'humain au moment où il lit la réponse — journalisé, il
// était invisible au moment où il compte.
function afficherReecritureEnDefaut(motifs) {
  if (!motifs.length) return;
  console.log(JSON.stringify({
    systemMessage: `[restitution — R-44] la réécriture reste en défaut après un premier refus ; elle n'est pas refusée une seconde fois (garde anti-boucle), à lire avec ces écarts : `
      + motifs.map((m) => String(m).slice(0, 300)).join(" · "),
  }));
}

function lireStdin() {
  try { return JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { return {}; }
}

const contenuDe = (e) => { const c = e.message?.content; return Array.isArray(c) ? c : typeof c === "string" ? [{ type: "text", text: c }] : []; };
const estHumain = (e) => e.type === "user" && !e.isMeta && contenuDe(e).some((b) => b.type === "text") && !contenuDe(e).some((b) => b.type === "tool_result");
const texteDe = (e) => contenuDe(e).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();

// Un SEGMENT est ce qui suit un message humain — un tour. `mesurerSegment` en rend l'effort
// (écritures, commandes), les fichiers .md déposés et le texte FINAL. Il est appelé DEUX fois par
// `analyserTranscript` : sur le tour courant, et sur celui d'AVANT. TF-1019 (11/09/2026) a montré
// qu'un message final ne se juge pas seulement en lui-même, mais dans son rapport au message
// humain qui le précède et au message final qui l'a précédé.
function mesurerSegment(segment) {
  const contenu = contenuDe;
  let ecritures = 0, commandes = 0;
  const fichiersMd = [];
  // Le RANG de chaque écriture et de chaque commande dans le segment : c'est lui qui dit si un
  // outil a été appelé AVANT ou APRÈS le texte précédemment affiché (TF-1182).
  const ecrituresIdx = [], commandesIdx = [];
  // Chaque texte du tour, AVEC le nombre d'outils déjà vus à ce moment-là. C'est ce compteur qui
  // permet de reconnaître un texte FINAL : rien ne l'a suivi.
  const tousLesTextes = [];
  let outils = 0, prejugements = 0;
  for (const e of segment) {
    if (e.type !== "assistant") continue;
    const blocs = contenu(e);
    const textes = blocs.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    if (textes) tousLesTextes.push({ texte: textes, outilsAvant: outils });
    for (const b of blocs) {
      if (b.type === "tool_use") {
        outils++;
        if (ECRITURES.has(b.name)) {
          ecritures++;
          ecrituresIdx.push(outils - 1);
          // Les fichiers .md écrits pendant le tour : c'est parmi eux que vit la synthèse déposée,
          // celle que la doctrine prescrit d'écrire AVANT d'afficher (voir `syntheseDuTour`).
          const p = b.input?.file_path;
          if (typeof p === "string" && /\.md$/i.test(p)) fichiersMd.push(p);
        } else if (COMMANDES.has(b.name)) {
          commandes++; commandesIdx.push(outils - 1);
          if (PREJUGEMENT.test(String(b.input?.command || ""))) prejugements++;
        }
      }
    }
  }
  // TF-0516 (22/08/2026) — LE HOOK JUGEAIT UN AUTRE TEXTE QUE CELUI QUI PORTE LA RESTITUTION.
  //
  // Il retenait le DERNIER bloc de texte du tour. Or un tour de travail en porte souvent
  // plusieurs : une phrase de préambule (« je corrige ceci »), puis la restitution. Mesuré le
  // 22/08 sur un refus réel : quatre échecs BLOQUANTS, dont « les huit blocs sont absents » —
  // alors que le message affiché portait ses neuf titres. Son texte exact, relu dans le
  // transcript et rejoué, rend PASS sur les 20 règles. Ce qui avait été jugé était le préambule
  // de 116 caractères.
  //
  // Ce que ça coûtait : le gate est BLOQUANT, donc le refus force à réécrire un message DÉJÀ
  // CONFORME — huit blocs relus pour rien, exactement le coût que la v2.5.0 existait pour
  // supprimer. Et le motif ACCUSE L'AUTEUR d'avoir omis ce qu'il a écrit. Un gate qui accuse à
  // tort s'apprend à contourner (motif que R-33 bis donne pour le verdict websec).
  //
  // REMÈDE, TROISIÈME ÉTAT — et les deux précédents valent d'être écrits, parce qu'ils disent
  // pourquoi celui-ci est le bon.
  //
  //   1. « le DERNIER texte du tour » : faux dès qu'une phrase suit la restitution.
  //   2. « le texte le PLUS LONG du tour » : mieux, mais insuffisant. Mesuré le 23/08 sur un tour
  //      réel de 24 écritures et 90 commandes, portant VINGT textes — des phrases de transition
  //      entre les appels d'outils. Quand le hook lit le transcript avant que la restitution y
  //      soit écrite, le plus long des textes présents est une de ces phrases : le hook a rendu
  //      quatre échecs bloquants dont « les huit blocs sont absents », sur un message qui les
  //      portait tous. Rejoué après coup, l'analyseur retrouvait la restitution — la preuve que
  //      ce n'était pas le CHOIX du texte qui était faux, mais le MOMENT de la lecture.
  //   3. Le vrai discriminant est SÉMANTIQUE, pas métrique : **un préambule est suivi d'appels
  //      d'outils, un message FINAL ne l'est pas.** On juge donc le dernier texte qu'aucun outil
  //      ne suit. S'il n'y en a pas — cas exact du transcript non encore écrit — il n'y a rien à
  //      juger, et on laisse passer plutôt que d'accuser l'auteur d'un défaut qui n'est pas le
  //      sien. Un message hors format, lui, reste attrapé : il est bien le dernier texte, et rien
  //      ne le suit.
  //
  // Une voie a été écartée en chemin : déclarer NON JUGEABLE tout texte sans titre de section.
  // Elle DÉSARMAIT le gate — un message hors format n'a pas de titres non plus, c'est même sa
  // définition, et la recette l'a montré dans la minute. Un garde-fou qui s'annule sur le cas
  // qu'il existe pour attraper est pire que pas de garde-fou.
  const totalOutils = outils;
  const finaux = tousLesTextes.filter((t) => t.outilsAvant === totalOutils);
  const dernierTexte = finaux.length ? finaux[finaux.length - 1].texte : "";
  // TF-1182 — CE QUI S'EST PASSÉ DEPUIS LE DERNIER AFFICHAGE, et pourquoi c'est la bonne mesure.
  //
  // Un SEGMENT commence au dernier message HUMAIN. Or une notification de tâche de fond — le
  // rapport d'un agent de campagne, par exemple — n'en est pas un : le segment continue, et le
  // relais de trois lignes qui la répercute se retrouve dans le même segment que les vingt
  // écritures et la synthèse déposée une heure plus tôt. Il est donc jugé comme un tour de
  // TRAVAIL, comparé à la synthèse déposée, et refusé parce qu'il ne la reprend pas en entier.
  // Mesuré le 17/09 : quatre re-affichages complets d'une synthèse de 120 lignes en 45 minutes,
  // pour quatre relais.
  //
  // Ce qu'on mesure n'est donc pas le tour, c'est L'INTERVALLE depuis le texte précédemment
  // AFFICHÉ — le travail d'avant a déjà été jugé sur le message qui l'a rendu. `null` quand le
  // segment ne porte qu'un seul texte : il n'y a pas d'affichage antérieur, rien à exempter.
  const precedent = tousLesTextes.length >= 2 ? tousLesTextes[tousLesTextes.length - 2] : null;
  const depuisDernierAffichage = precedent
    ? { ecritures: ecrituresIdx.filter((i) => i >= precedent.outilsAvant).length,
      commandes: commandesIdx.filter((i) => i >= precedent.outilsAvant).length }
    : null;
  return { ecritures, commandes, dernierTexte, textes: tousLesTextes.length, finaux: finaux.length, fichiersMd, depuisDernierAffichage,
    effets: detecterEffets(segment), prejuge: prejugements > 0, enAttente: tachesEnAttente(segment) };
}

// TF-1649 (14/10/2026) — LES TÂCHES D'ARRIÈRE-PLAN DU TOUR QUI NE SONT PAS REVENUES. Une commande
// lancée en arrière-plan rend « Command running in background with ID: <id> » ; un agent asynchrone,
// « Async agent launched … agentId: <id> ». Leur fin arrive dans le transcript comme une notification
// `<task-notification>` portant le même identifiant et un statut — jamais comme un message humain,
// donc dans le MÊME segment. Rend les identifiants lancés dans le segment et non revenus.
export function tachesEnAttente(segment) {
  const lancees = new Set(), revenues = new Set();
  for (const e of segment) {
    for (const b of contenuDe(e)) {
      if (b.type !== "tool_result") continue;
      const t = typeof b.content === "string" ? b.content
        : Array.isArray(b.content) ? b.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("\n") : "";
      for (const m of t.matchAll(/running in background with ID:\s*([\w-]+)/g)) lancees.add(m[1]);
      for (const m of t.matchAll(/Async agent launched[\s\S]{0,400}?agentId:\s*([\w-]+)/g)) lancees.add(m[1]);
    }
    const brut = JSON.stringify(e);
    if (!brut.includes("task-notification")) continue;
    for (const m of brut.matchAll(/<task-id>([\w-]+)<\/task-id>[\s\S]{0,600}?<status>(\w+)<\/status>/g))
      if (!/^(?:running|pending|started)$/i.test(m[2])) revenues.add(m[1]);
  }
  return [...lancees].filter((id) => !revenues.has(id));
}

// TF-1647 (point 3) et TF-1666 — LE PRÉJUGEMENT SE MESURE. Une commande du tour qui juge un
// brouillon avant l'affichage : `--prejuger`, `--pre-vol` (réponse courte) ou `oracle-synthese`
// joué directement. Le champ `prejuge` du journal en mesure l'adoption ; au refus, son absence est
// dite comme un défaut DISTINCT — TF-1666 : une mémoire de session chargée n'a pas suffi le 13/10,
// une consigne lue n'est pas un geste tenu. Ce que la mesure ne voit pas : que le brouillon préjugé
// soit le texte affiché ; elle constate le geste, pas l'identité des deux textes.
const PREJUGEMENT = /hook-restitution\.mjs[^\n]*--(?:prejuger|pre-vol)|factory\.mjs["']?\s+restitution\s+--(?:prejuger|pre-vol)|oracle-synthese\.mjs\s+(?!--self-test)\S/;

// ---- NIVEAU MOYEN (étape 2 des niveaux d'intervention, en essai depuis le 01/10/2026) ----------
//
// LE FAIT. Une question de diagnostic (« pourquoi… », « où en est… ») part en recherche : dix
// commandes de lecture, aucune écriture. Le compte d'outils (4 commandes = tour de travail) la juge
// comme un tour de travail et lui impose 8 blocs. Mesuré le 21/09 : 1 683 mots rendus là où 124
// suffisaient (étude `output/03-etudes/2026-09/20260925-etude-opportunite-niveaux-d-intervention.md`).
//
// LE REMÈDE, ET CE QUI EMPÊCHE LE RACCOURCI. Le niveau Moyen remplace le compte d'outils par un
// relevé d'EFFETS. Un tour qui se déclare « Niveau : Moyen » et n'a aucun effet est jugé sur sa
// forme propre (4 pièces, 400 mots) ; le moindre effet le fait juger Complexe, quelle que soit la
// déclaration. L'escalade va toujours vers le haut (TF-0978 reste fermé).
//
// CE QUE LE RELEVÉ NE VOIT PAS, dit plutôt que promis : un programme lancé par une commande
// (`node x.mjs`) qui écrit lui-même. La comparaison de l'arbre de travail (`effetsGit`) le rattrape
// dans le dépôt ouvert, au prix d'un faux positif quand une autre session écrit pendant le tour :
// l'erreur tombe alors du côté sûr, elle coûte une restitution, pas une faute.
const TEMPORAIRE = (p) => {
  const n = String(p || "").replace(/\\/g, "/").toLowerCase();
  const t = tmpdir().replace(/\\/g, "/").toLowerCase();
  return Boolean(n) && (n.startsWith(t + "/") || /\/appdata\/local\/temp\//.test(n) || /^\/tmp\//.test(n));
};
// Le dossier temporaire nommé par sa variable (`$TEMP`, `$env:TEMP`, `%TEMP%`, `$TMPDIR`) est
// le même dossier que son chemin écrit en entier (TF-1418).
const TEMPORAIRE_NOMME = (p) => TEMPORAIRE(p)
  || /^(?:\$\{?(?:env:)?(?:TEMP|TMP|TMPDIR)\}?|%(?:TEMP|TMP)%)(?:[\\/]|$)/i.test(String(p || ""));
// Une commande simple dont le verbe écrit des FICHIERS, et dont toutes les cibles sont temporaires :
// pour une copie, la seule destination (le dernier argument) ; pour les autres verbes, chaque
// argument. Une option ou une valeur non temporaire laisse l'effet relevé : l'erreur tombe du côté sûr.
const VERBES_FICHIER = /^(?:rm|del|mv|cp|rmdir|mkdir|touch|tee|Remove-Item|Move-Item|Copy-Item|Set-Content|Add-Content|Out-File|New-Item|Rename-Item|Clear-Content)$/i;
function versTemporaire(commande) {
  const jetons = (commande.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((j) => j.replace(/^["']|["']$/g, ""));
  const i = jetons.findIndex((j) => VERBES_FICHIER.test(j));
  if (i < 0) return false;
  const args = jetons.slice(i + 1).filter((j) => !/^-/.test(j));
  if (!args.length) return false;
  const cibles = /^(?:cp|Copy-Item)$/i.test(jetons[i]) ? args.slice(-1) : args;
  return cibles.every(TEMPORAIRE_NOMME);
}
const VERBES_EFFET = new RegExp([
  String.raw`\bgit\s+(?:commit|push|reset|rebase|merge|restore|clean|stash|tag|cherry-pick|revert|am|apply|rm|mv|filter-repo|worktree\s+(?:add|remove))\b`,
  String.raw`(?:^|[\s;&|(])(?:rm|del|mv|cp|rmdir|mkdir|touch|tee|Remove-Item|Move-Item|Copy-Item|Set-Content|Add-Content|Out-File|New-Item|Rename-Item|Clear-Content)(?=\s|$)`,
  String.raw`\bsed\s+-i\b`,
  String.raw`\b(?:npm|pnpm|yarn)\s+(?:install|i|ci|add|remove|update|publish)\b`,
  String.raw`\bgh\s+(?:pr\s+(?:create|merge|close|edit|comment)|release|issue\s+(?:create|close|edit|comment)|repo\s+(?:create|delete|edit))\b`,
  String.raw`\b(?:curl|gh\s+api)\b[^|;&\n]*(?:-X\s*(?:POST|PUT|PATCH|DELETE)|--data\b|-d\s)`,
  String.raw`\b(?:deploy|publish)\b`,
].join("|"), "i");
// Une redirection vers un fichier écrit ; vers le néant, un descripteur ou le dossier temporaire, non.
const REDIRECTION = /(?<![=\-<>])(\d?)>>?\s*("?)([^\s"&|;)]+)/g;
const OUTILS_LECTURE = new Set(["Explore", "Plan", "claude-code-guide"]);
const ECRIT_CONNECTE = /(?:^|[_-])(?:send|create|update|delete|trash|share|publish|batch|forward|reply|apply|label|unlabel|move|upload|copy|duplicate|edit|merge|generate|respond|mark|untrash|remove|resize|import|spawn|stop)(?:[_-]|$)/i;

export function detecterEffets(segment) {
  const effets = [];
  for (const e of segment) {
    if (e.type !== "assistant") continue;
    for (const b of contenuDe(e)) {
      if (b.type !== "tool_use") continue;
      const nom = String(b.name || "");
      if (ECRITURES.has(nom)) {
        const p = b.input?.file_path || b.input?.notebook_path;
        if (!TEMPORAIRE(p)) effets.push(`écriture de ${p || "chemin inconnu"}`);
      } else if (COMMANDES.has(nom)) {
        const cmd = String(b.input?.command || "");
        // 12/10/2026 (TF-1418) : un `cp` vers le dossier temporaire de la session faisait juger
        // Complexe un tour de pure lecture. La commande se juge par commande simple, et un verbe de
        // fichier dont toutes les cibles sont temporaires n'est pas un effet.
        const v = cmd.split(/&&|\|\||[;|\n]/).map((c) => {
          const m = c.match(VERBES_EFFET);
          const fichier = m && VERBES_FICHIER.test(m[0].replace(/^[\s;&|(]+/, "").trim());
          return m && !(fichier && versTemporaire(c)) ? m : null;
        }).find(Boolean);
        if (v) effets.push(`commande à effet « ${v[0].trim()} »`);
        // Le contenu d'une chaîne entre guillemets (un `node -e "x > 2"`) n'est pas une redirection ;
        // une cible de redirection entre guillemets (`> "f.txt"`) en reste une.
        const horsChaines = cmd.replace(/(?<!>\s*)(["'])(?:\\.|(?!\1)[^\\])*\1/g, "''");
        for (const [, , , cible] of horsChaines.matchAll(REDIRECTION)) {
          if (/^&\d?$|^\/dev\/null$|^\$null$|^nul$/i.test(cible) || TEMPORAIRE(cible) || /^\$/.test(cible)) continue;
          effets.push(`redirection vers ${cible}`);
        }
      } else if (nom === "Workflow" || (nom === "Agent" && !OUTILS_LECTURE.has(b.input?.subagent_type))) {
        effets.push(`${nom} lancé (${b.input?.subagent_type || "agent qui peut écrire"})`);
      } else if (nom.startsWith("mcp__") && ECRIT_CONNECTE.test(nom.split("__").pop())) {
        effets.push(`outil connecté qui écrit : ${nom}`);
      }
    }
  }
  return effets;
}

// ---- TF-1947 (26/10/2026, D-75 (c)) — UN TOUR DE TRAVAIL EST UN TOUR QUI A ÉCRIT, PAS UN TOUR QUI A LU -----------
//
// LE FAIT. Mesuré au journal des hooks du pilot, sessions de recette exclues, du 19 au 26/10/2026 : 85 refus au premier
// passage, dont 28 sur des tours qui n'avaient rien écrit et avaient lancé de 4 à 19 commandes, tous sur S1, S3, S4 et S6
// (25 avec S48 chez un produit). L'analyse d'œil critique du 26/10 en compte 73 sur 44 sessions, presque tous sur des
// réponses courtes à des questions. Le critère « au moins quatre commandes » mesurait l'effort de LECTURE, et une question
// qui lisait cinq fichiers recevait une restitution complète que le modèle ne voyait exigée qu'après le refus.
//
// LA RÈGLE. Le tour est jugé comme un tour de travail quand il a ÉCRIT : un appel Write, Edit, MultiEdit ou NotebookEdit,
// quel que soit le chemin (dossier temporaire compris, `references\NIVEAUX.md`, « Brouillon ») ; une écriture par commande
// hors du dossier temporaire, lue par `ecrituresParCommande` de la relecture d'intention ; un commit, un push ou une autre
// commande à effet (`VERBES_EFFET`, `git -C <dossier> commit` compris) ; un agent qui peut écrire ; un outil connecté qui
// écrit. Le nombre de commandes de lecture ne compte plus.
//
// LE CORPS D'UN HEREDOC N'EST PAS UNE COMMANDE. `references\NIVEAUX.md` prescrit de jouer la réponse courte par
// `--pre-vol` depuis un heredoc : ses lignes de citation (« > Non, … ») se lisaient comme des redirections, et un mot
// « rm » ou « git push » cité comme une commande à effet. Le corps se retire avant la lecture, et la chaîne multiligne
// PowerShell (`@'…'@`, `@"…"@`) avec lui.
//
// CE QUE CE RELEVÉ NE VOIT PAS, dit plutôt que promis : un programme lancé par une commande qui écrit ou commite lui-même
// (`node x.mjs`). Contrairement au niveau Moyen, l'état git du dépôt n'est PAS relu ici : sur le pilot, plusieurs sessions
// écrivent dans le même arbre, et `effetsGit` y ferait juger à tort une réponse courte sur une écriture qui n'est pas la sienne.
const sansCorpsDeTexte = (cmd) => String(cmd || "")
  .replace(/<<-?\s*(["']?)(\w+)\1([^\n]*)\n[\s\S]*?\n\s*\2\s*(?=\n|$)/g, "<<$2$3")
  .replace(/@(['"])\r?\n[\s\S]*?\r?\n\1@/g, "@$1$1@");
// `git -C <dossier> commit`, `git -c clé=valeur push` : `VERBES_EFFET` n'admet aucune option entre `git` et son verbe.
const GIT_A_OPTIONS = /\bgit(?:\s+(?:-C\s+(?:"[^"]*"|'[^']*'|\S+)|-c\s+\S+|--(?:git-dir|work-tree|namespace)(?:=\S+|\s+\S+)|--no-pager|--bare|-P))+\s+(commit|push|reset|rebase|merge|restore|clean|stash|tag|cherry-pick|revert|am|apply|rm|mv|filter-repo|worktree\s+(?:add|remove))\b/i;

/** Ce que le tour a écrit, une ligne par écriture relevée ; vide pour un tour de lecture. Voir le bloc ci-dessus. */
export function ecrituresDuTour(segment) {
  const sortie = [];
  const ajouter = (x) => { if (!sortie.includes(x)) sortie.push(x); };
  const commandes = [];
  const nettoye = segment.map((e) => {
    if (e.type !== "assistant") return e;
    const blocs = contenuDe(e);
    if (!blocs.some((b) => b.type === "tool_use" && COMMANDES.has(b.name))) return e;
    return { ...e, message: { ...(e.message || {}), content: blocs.map((b) => (b.type === "tool_use" && COMMANDES.has(b.name)
      ? { ...b, input: { ...(b.input || {}), command: sansCorpsDeTexte(b.input?.command) } } : b)) } };
  });
  for (const e of nettoye) {
    if (e.type !== "assistant") continue;
    for (const b of contenuDe(e)) {
      if (b.type !== "tool_use") continue;
      if (ECRITURES.has(b.name)) ajouter(`${b.name} de ${b.input?.file_path || b.input?.notebook_path || "chemin inconnu"}`);
      else if (COMMANDES.has(b.name)) {
        const cmd = String(b.input?.command || "");
        if (cmd.trim()) commandes.push(cmd);
        const g = GIT_A_OPTIONS.exec(cmd);
        if (g) ajouter(`commande à effet « git ${g[1]} »`);
      }
    }
  }
  // Les écritures d'outil sont comptées ci-dessus quel que soit leur chemin ; le relevé d'effets apporte le reste.
  for (const x of detecterEffets(nettoye)) if (!/^écriture de /.test(x)) ajouter(x);
  if (ecrituresParCommande) {
    for (const w of ecrituresParCommande(commandes))
      if (!TEMPORAIRE_NOMME(w.cible)) ajouter(`écriture par commande vers ${w.cible}`);
  }
  return sortie;
}
export const LECTURE_PAR_COMMANDE = () => (ecrituresParCommande ? "relecture-intention" : "repli : relevé d'effets du hook seul");

// L'état du dépôt ouvert depuis le message humain : un commit plus récent, ou un fichier modifié
// après lui. `depuis` est l'horodatage ISO du message humain lu au transcript.
export function effetsGit(cwd, depuis) {
  const t0 = Date.parse(depuis || "");
  if (!cwd || !Number.isFinite(t0)) return [];
  const effets = [];
  try {
    const head = spawnSync("git", ["log", "-1", "--format=%ct"], { cwd, encoding: "utf8" });
    if (head.status === 0 && Number(head.stdout.trim()) * 1000 > t0) effets.push("commit fait pendant le tour");
    const st = spawnSync("git", ["status", "--porcelain", "-uall"], { cwd, encoding: "utf8" });
    if (st.status === 0) {
      for (const l of st.stdout.split(/\r?\n/).filter(Boolean)) {
        const p = l.slice(3).replace(/^"|"$/g, "").split(" -> ").pop();
        try { if (statSync(join(cwd, p)).mtimeMs > t0) { effets.push(`fichier modifié pendant le tour : ${p}`); break; } } catch { /* supprimé */ }
      }
    }
  } catch { /* git absent : le relevé des outils reste */ }
  return effets;
}

const DECLARE_MOYEN = /^\s*Niveau\s*:\s*Moyen\b/i;
const PIECES_MOYEN = [
  ["La réponse", /\*\*\s*La réponse\s*[.:]\s*\*\*/i],
  ["Preuves", /\*\*\s*Preuves\s*[.:]\s*\*\*/i],
  ["Non vérifié", /\*\*\s*Non vérifié\s*[.:]\s*\*\*/i],
  ["Décision attendue", /\*\*\s*Décision attendue\s*[.:]\s*\*\*/i],
];
const SEUIL_MOYEN = 400, SEUIL_REPONSE_MOYEN = 150;
const compterMots = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;

export const declareMoyen = (texte) => DECLARE_MOYEN.test(String(texte || ""));

/** La forme Moyen : 4 pièces dans l'ordre, 400 mots, réponse en 150, preuves sourcées, décision complète. */
export function jugerFormeMoyen(texte) {
  const ecarts = [];
  const t = String(texte || "");
  const mots = compterMots(t);
  if (mots > SEUIL_MOYEN) ecarts.push(`${mots} mots, au-delà des ${SEUIL_MOYEN} du niveau Moyen`);
  const positions = PIECES_MOYEN.map(([nom, re]) => ({ nom, i: t.search(re) }));
  const manquantes = positions.filter((p) => p.i < 0).map((p) => p.nom);
  if (manquantes.length) ecarts.push(`pièce(s) absente(s) : ${manquantes.join(", ")}`);
  const presentes = positions.filter((p) => p.i >= 0);
  if (presentes.some((p, k) => k && p.i < presentes[k - 1].i)) ecarts.push("pièces dans le désordre : réponse, preuves, non vérifié, décision");
  const piece = (k) => {
    const p = positions[k];
    if (p.i < 0) return "";
    const suite = positions.filter((q) => q.i > p.i).map((q) => q.i);
    return t.slice(p.i, suite.length ? Math.min(...suite) : t.length).replace(PIECES_MOYEN[k][1], "");
  };
  const rep = piece(0);
  if (positions[0].i >= 0 && compterMots(rep) > SEUIL_REPONSE_MOYEN)
    ecarts.push(`la réponse fait ${compterMots(rep)} mots, au-delà des ${SEUIL_REPONSE_MOYEN}`);
  const preuves = piece(1);
  if (positions[1].i >= 0 && !/`[^`]+`|[\w./\\-]+\.\w{1,5}(?::\d+)?/.test(preuves))
    ecarts.push("les preuves ne citent ni commande ni chemin");
  const decision = piece(3);
  if (positions[3].i >= 0) {
    const aucune = /^\s*aucune\b/i.test(decision);
    const posee = /\bD\s*-\s*\d{1,3}\b/.test(decision);
    if (!aucune && !posee) ecarts.push("décision attendue ni « Aucune. » ni D-N");
    if (posee && !(/Recommandation\s*:/i.test(decision) && /\|\s*Option\s*\|/i.test(decision)))
      ecarts.push("une D-N posée au niveau Moyen porte sa recommandation et son tableau « | Option | Ce qui se passe | Coût | Retour arrière | » (format B, v2.41.0)");
  }
  return { mots, ecarts };
}

const RAPPEL_MOYEN = "Réécris ta réponse au niveau Moyen (references\\NIVEAUX.md au pilot, forge\\NIVEAUX.md chez un produit) : première ligne « Niveau : Moyen », "
  + "puis 4 pièces dans cet ordre, chacune ouverte par son titre en gras : **La réponse.** (150 mots au plus, ouverte sur "
  + "le oui, le non ou le fait demandé) ; **Preuves.** (3 à 6 lignes, une commande et sa sortie, ou un chemin et sa ligne) ; "
  + "**Non vérifié.** ; **Décision attendue.** (« Aucune. » ou une D-N complète, recommandation et tableau d'options). "
  + "400 mots au plus. Pas de blocs numérotés.";

// ---- TF-1938 (21/10/2026) — LES RELEVÉS D'HORLOGE DU TOUR ET DE LA SESSION, pour S84 d'oracle-synthese -----------------------
// Un RELEVÉ est un enregistrement qui n'est pas de l'assistant — résultat d'outil, pièce jointe de hook, message — et dont le texte
// MONTRE l'heure courante : l'heure locale de son propre horodatage (HH:MM ou HHhMM, à une minute près) ou sa minute ISO en UTC.
// C'est ce que l'agent a pu LIRE, quelle que soit la commande (`date`, `Get-Date`, un script qui imprime l'heure) ; ce que la
// transcription ne montre pas, il ne l'a pas vu. Mesuré le 21/10/2026 sur 714 restitutions : aucune heure du bloc 1 accusée sans
// relevé dans le tour ne correspondait à un relevé antérieur de la session.
const _hhmm = (ms) => { const d = new Date(ms); return [d.getHours(), String(d.getMinutes()).padStart(2, "0")]; };
export function montreLHeure(texte, horodatage) {
  const t0 = Date.parse(horodatage || "");
  if (!Number.isFinite(t0) || !texte) return false;
  for (const dm of [-60000, 0, 60000]) {
    const [h, m] = _hhmm(t0 + dm);
    if (new RegExp(`(?<![\\d:])0?${h}\\s?(?::|h)\\s?${m}(?!\\d)`).test(texte)) return true;
    if (texte.includes(new Date(t0 + dm).toISOString().slice(0, 16))) return true;
  }
  return false;
}
const _texteBrut = (e) => (e.type === "attachment" ? JSON.stringify(e.attachment || {})
  : contenuDe(e).map((b) => (b.type === "tool_result" ? (typeof b.content === "string" ? b.content
    : Array.isArray(b.content) ? b.content.map((c) => (typeof c === "string" ? c : c?.text || "")).join("\n") : "") : (b.text || ""))).join("\n"));
/**
 * Les instants (ISO) des relevés d'horloge : `tour` depuis le rang `debut` exclu, `session` avant lui. `null` quand aucun
 * enregistrement du tour n'est horodaté : sans horodatage, un relevé ne se reconnaît pas, et S84 rend SANS_OBJET plutôt que
 * d'accuser un tour qu'elle ne peut pas mesurer.
 */
export function relevesDHorloge(entrees, debut) {
  if (!entrees.some((e, i) => i > debut && e.timestamp)) return null;
  const tour = [], session = [];
  entrees.forEach((e, i) => {
    if (e.type === "assistant" || !e.timestamp || !montreLHeure(_texteBrut(e), e.timestamp)) return;
    (i > debut ? tour : session).push(new Date(Date.parse(e.timestamp)).toISOString());
  });
  return { tour, session: session.slice(-300) };
}
const argsReleves = (r) => (r ? ["--releves-tour", r.tour.length ? r.tour.join(",") : "aucun", "--releves-session", r.session.length ? r.session.join(",") : "aucun"] : []);

export function analyserTranscript(texte) {
  const entrees = texte.split(/\r?\n/).filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter((e) => e && !e.isSidechain);
  const humains = [];
  for (let i = 0; i < entrees.length; i++) if (estHumain(entrees[i])) humains.push(i);
  const debut = humains.length ? humains[humains.length - 1] : -1;
  const m = mesurerSegment(entrees.slice(debut + 1));
  // TF-1947 — le tour de travail est un tour qui a ÉCRIT ; le nombre de commandes de lecture ne compte plus.
  const ecrit = ecrituresDuTour(entrees.slice(debut + 1));
  // TF-1019 — les deux pièces que le contrôle GESTE réclame et que personne ne lisait : le DERNIER
  // message humain (celui auquel la réponse répond) et le texte final du tour PRÉCÉDENT (celui que
  // la réponse ne doit pas être). Sans second message humain, le segment d'avant commence au début
  // du transcript : c'est bien le tour qui précède, et il n'y en a pas d'autre.
  const avant = humains.length >= 2 ? humains[humains.length - 2] : -1;
  const textePrecedent = debut >= 0 ? mesurerSegment(entrees.slice(avant + 1, debut)).dernierTexte : "";
  const dernierHumain = debut >= 0 ? texteDe(entrees[debut]) : "";
  const depuis = debut >= 0 ? entrees[debut].timestamp || null : null;
  // TF-1514 — tous les messages humains de la session : le contrôle POSSESSION les confronte à la réponse.
  const textesHumains = humains.map((i) => texteDe(entrees[i]));
  return { travail: ecrit.length > 0, ecrituresDuTour: ecrit, ...m, dernierHumain, textePrecedent, depuis, textesHumains,
    releves: relevesDHorloge(entrees, debut) };
}

// `racine` (TF-1644, 14/10/2026) : le dossier du projet du tour. Le message est écrit dans un
// fichier TEMPORAIRE, d'où S48 ne pouvait pas reconnaître un produit (elle remonte depuis le
// fichier jusqu'à un `forge\retours\`) : elle rendait SANS_OBJET à chaque tour de chaque produit,
// et le FAIL du 12/10 n'a été vu qu'au rejeu sur un fichier placé chez le produit.
// `releves` (TF-1938, 21/10/2026) : { tour, session } de `relevesDHorloge`, passés à S84 ; absents, S84 rend SANS_OBJET.
// `averts` (T4, TF-1949, 26/10/2026) : les constats AVERT de l'oracle, dits sous la réponse sans jamais la refuser ; S72 en rend
// un quand le verrou « livré » (S85) juge les livrables sur fichiers.
export function juger(texte, racine = process.cwd(), releves = null) {
  const dir = mkdtempSync(join(tmpdir(), "restitution-"));
  const f = join(dir, "message.md");
  writeFileSync(f, texte, "utf8");
  const r = spawnSync(process.execPath, [ORACLE, f, ...(racine ? ["--racine", racine] : []), ...argsReleves(releves)], { encoding: "utf8" });
  let rapport = {};
  try { rapport = JSON.parse(r.stdout); } catch { /* jugé par le code */ }
  return { code: r.status, fails: (rapport.findings || []).filter((x) => x.statut === "FAIL"),
    averts: (rapport.findings || []).filter((x) => x.statut === "AVERT") };
}

// ---- L'AFFICHÉ DIT CE QUE LE JUGÉ DISAIT (30/08/2026) ---------------------------------------
//
// DEUX OBJETS VIVAIENT SANS LIEN, et personne ne le savait avant le 30/08. La doctrine prescrit
// que « la synthèse s'écrit EN FICHIER […] et ne s'affiche qu'après son verdict — un message de
// chat ne passe devant aucun contrôle, un fichier si ». Ce hook, lui, juge le MESSAGE AFFICHÉ.
// Il y a donc deux artefacts, et rien ne vérifiait qu'ils disaient la même chose.
//
// LE FAIT QUI L'A RÉVÉLÉ, et c'est une dérive de l'agent, pas du dispositif : un fichier déposé
// portait ses trois lignes « si rien n'est décidé » et rendait PASS ; le message affiché, retapé
// plus court, les avait perdues — et rien n'a signalé l'écart. Le destinataire a lu un rendu
// amputé de ce que le document jugé contenait, et a demandé pourquoi le format n'était pas tenu.
//
// CE QUI EST COMPARÉ, et pourquoi si peu : les DEUX PROPRIÉTÉS SÉLECTIONNABLES du bloc 3 — la
// liste des numéros de décision, et le nombre d'options par défaut nommées. Comparer les textes
// mot à mot serait absurde : un message abrège légitimement une prose. Ce qui ne s'abrège pas,
// c'est ce sur quoi le lecteur TRANCHE — une décision qui disparaît de l'écran ne peut pas être
// prise, et une ligne de repli qui disparaît fait croire que ne rien faire est sans effet.
//
// SANS_OBJET quand aucun fichier de synthèse n'a été écrit dans le tour : la règle ne réclame pas
// un fichier, elle vérifie la cohérence quand il y en a un. Le marqueur retenu est celui que la
// doctrine prescrit depuis TF-0331 — le frontmatter `destinataire: humain` —, jamais le nom du
// fichier : un nom se devine, un marqueur se déclare.
const bloc3De = (t) => {
  const m = /(^|\n)#{1,4}\s*\**\s*3[.)]?\s*\**\s*D[ée]cisions?/i.exec(t);
  if (!m) return "";
  const debut = m.index + m[0].length;
  const suivant = t.slice(debut).search(/\n#{1,4}\s/);
  return t.slice(debut, suivant === -1 ? undefined : debut + suivant);
};
// TF-0891 (07/09/2026) — LE BLOC 8 AUSSI SE PERD À L'ÉCRAN, ET IL SE PERD AUTREMENT.
// Le fait : un fichier jugé PASS S1-S37 a été PARAPHRASÉ à l'affichage. Le bloc 3 y a perdu son
// tableau d'options ; le bloc 8 y a perdu ses acteurs du vocabulaire gelé — « vous » et « IA »
// à la place de `manuelle_utilisateur` et `auto_ia` —, donc ce qui dit QUI agit. Retour humain :
// « le prompt de sortie ne respecte pas le format attendu pour 3 & 8, pourquoi ? ». La
// comparaison de 30/08 ne regardait que deux propriétés du bloc 3 : elle ne pouvait rien voir.
const bloc8De = (t) => {
  const m = /(^|\n)#{1,4}\s*\**\s*8[.)]?\s*\**\s*(?:Prochaines?\s+)?actions?/i.exec(t);
  if (!m) return "";
  const debut = m.index + m[0].length;
  const suivant = t.slice(debut).search(/\n#{1,4}\s/);
  return t.slice(debut, suivant === -1 ? undefined : debut + suivant);
};
const ACTEURS_GELES = /\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b/g;
const numerosDe = (t) => [...new Set((bloc3De(t).match(/(?:^|\n)\s*[-*]?\s*\*{0,2}(?:D\s*-?\s*|D[ée]cision\s+)(\d{1,2})\b/gi) || [])
  .map((s) => (/(\d{1,2})\b/.exec(s) || [])[1]))].sort((a, b) => Number(a) - Number(b));
const replisDe = (t) => (bloc3De(t).match(/si rien n(?:'|’)est d[ée]cid|sans d[ée]cision|sans r[ée]ponse|option par d[ée]faut/gi) || []).length;

// TF-0767 (02/09/2026) : le marqueur ne suffit plus SEUL. Une ANALYSE (L99) portant
// `destinataire: humain` — parce qu'elle est bien destinée à l'humain — a été jugée à la place de la
// restitution du même tour, et une restitution conforme a été refusée (« options par défaut : 0
// dans le fichier jugé, 2 à l'écran »). Parmi les fichiers marqués, la SYNTHÈSE se reconnaît à son
// nom (Synthese / Restitution / RESTITUTION-*) ; le marqueur seul reste le repli quand aucun nom ne
// tranche, et la doctrine (RESTITUTION.md) réserve désormais le marqueur aux restitutions.
// TF-1184 (17/09/2026) — UN FICHIER RENOMMÉ HORS OUTIL D'ÉCRITURE SORT DE LA LISTE DU TOUR.
//
// LE FAIT, rejoué dans la session du pilot du 17/09 : la synthèse déposée a été RENOMMÉE par `mv`
// pour tenir le plafond de longueur de chemin (S42). Le hook ne connaît que les chemins passés aux
// outils d'ÉCRITURE ; ce chemin-là n'existe plus, et le nouveau n'a jamais transité par un outil.
// Ce jour-là le repli a tenu — un seul fichier marqué dans le tour — mais rien ne le garantissait,
// et deux fichiers marqués auraient fait juger l'écran contre le mauvais document.
//
// CE QUI EST AJOUTÉ, et sa borne : quand un chemin écrit N'EXISTE PLUS, on relit SON DOSSIER, et
// lui seul. Un fichier disparu a été renommé, déplacé ou supprimé ; son dossier est le seul endroit
// où le chercher sans balayer le disque. Les candidats sont ordonnés par date de modification, le
// plus récent examiné en premier — c'est la seule chose qui distingue deux fichiers marqués
// coexistant dans le même dossier, et c'est exactement le cas que le fait du 17/09 laissait ouvert.
function relusDuDisque(chemins) {
  const dossiers = new Set();
  for (const c of chemins) {
    if (!c || existsSync(c)) continue;
    try { dossiers.add(dirname(c)); } catch { /* chemin non résolu : rien à relire */ }
  }
  const candidats = [];
  for (const d of dossiers) {
    let noms = [];
    try { noms = readdirSync(d).filter((n) => /\.md$/i.test(n)); } catch { continue; }
    for (const n of noms) {
      const f = join(d, n);
      if (chemins.includes(f)) continue;
      try { candidats.push({ f, t: statSync(f).mtimeMs }); } catch { /* illisible : on passe */ }
    }
  }
  // Du plus ANCIEN au plus RÉCENT : la boucle de `syntheseDuTour` parcourt la liste à l'envers,
  // donc le dernier ajouté est le premier examiné.
  return candidats.sort((a, b) => a.t - b.t).map((c) => c.f);
}

// TF-1187 (19/09/2026) — UN FICHIER ÉCRIT DANS LE TOUR PRIME SUR UN FICHIER RELU DU DISQUE.
//
// LE FAIT, chez un produit le 17/09, le jour même où TF-1184 est entré : un chemin écrit avait
// disparu (renommé pour tenir S42), la relecture du dossier s'est donc ouverte — et ses candidats,
// ajoutés EN QUEUE d'une liste parcourue À L'ENVERS, ont été examinés AVANT tout fichier passé par
// un outil d'écriture. L'écran a été jugé contre la synthèse d'un tour antérieur (15:28) alors que
// celle du tour (17:52) existait et avait transité par l'outil : trois constats portant sur un
// texte étranger au message, une restitution PASS sur 51 règles refusée.
//
// L'INVARIANT, et il s'énonce en une phrase : la relecture du disque est un REPLI, elle ne répond
// qu'à la question « le tour n'a laissé AUCUNE synthèse lisible parmi ses écritures, où est-elle
// passée ? ». Ce que le tour a écrit et qui existe encore est une preuve ; ce que le dossier
// contient par ailleurs est une présomption. Une présomption ne passe jamais devant une preuve.
const estMarque = (c) => {
  try {
    if (!existsSync(c)) return false;
    // 17/09/2026 (classe `restitution-fichier-juge-mal-choisi`, récidive) : le marqueur se lit en TÊTE DE
    // LIGNE, comme un champ de frontmatter — jamais dans la prose. `gabarits\RESTITUTION.md` CITE le
    // marqueur dans ses 400 premiers caractères et s'appelle « restitution » : édité dans un tour, il a
    // été jugé à la place de la synthèse du tour, et une restitution conforme a été refusée.
    return /^destinataire\s*:\s*humain\s*$/im.test(readFileSync(c, "utf8").slice(0, 400));
  } catch { return false; /* illisible : ce n'est pas un constat sur l'auteur, on passe */ }
};
// TF-1720 (15/10/2026, lot Produit-83 20261014b RT-6) — UN DOCUMENT DE PROJET N'EST JAMAIS LA SYNTHÈSE.
// Le 14/10 à 18:58, chez un produit, le hook a refusé une restitution préjugée PASS en la comparant à
// `docs\projet\COMPOSANTS-OPS.md` : « options par défaut nommées : 0 dans le fichier jugé, 1 à l'écran ».
// Ce document porte `destinataire: humain` PAR SON GABARIT (les 9 gabarits de `gabarits\docs-projet\`
// le portent), il avait été écrit dans le tour, et aucune synthèse nommée n'y était : le repli l'a
// retenu. Le repli garde son rôle (TF-0767), mais il ne retient plus un fichier rangé sous
// `docs\projet\`, dossier des documents de projet et jamais des restitutions (RESTITUTION.md § Où, et
// sous quel nom). Même classe que TF-0767 et TF-1184 : `restitution-fichier-juge-mal-choisi`.
const DOC_DE_PROJET = /(^|[\\/])docs[\\/]projet[\\/]/i;
const choisirParmi = (chemins) => {
  const marques = [];
  for (let i = chemins.length - 1; i >= 0; i--) if (estMarque(chemins[i])) marques.push(chemins[i]);
  const nomme = marques.find((c) => /synth[eè]se|restitution/i.test(String(c).split(/[\\/]/).pop()));
  return nomme || marques.find((c) => !DOC_DE_PROJET.test(String(c))) || null;
};

// TF-1720, second volet — LE PRÉJUGEMENT JOUE LE MÊME CHOIX DE FICHIER QUE LE HOOK DE FIN DE TOUR.
// `--prejuger` jugeait le texte seul : il ne voyait pas la synthèse déposée dans le tour, donc il
// rendait exit 0 sur un brouillon que le hook refusait ensuite sur AFFICHAGE. Il relit désormais le
// transcript de la session, et choisit la synthèse par `syntheseDuTour` comme le hook. Le transcript
// se donne par `--transcript <chemin.jsonl>`, ou se retrouve par l'identifiant de session que Claude
// Code passe à ses commandes (`CLAUDE_CODE_SESSION_ID`), cherché sous `projects\*\` de chaque profil
// (`CLAUDE_CONFIG_DIR`, `~\.claude`, `~\.claude-*`). Introuvable, la comparaison n'est pas jouée et la
// sortie le dit ; elle ne se transforme jamais en refus.
export function transcriptDeSession(env = process.env, maison = homedir()) {
  const id = env.CLAUDE_CODE_SESSION_ID;
  if (!id || !/^[\w-]+$/.test(id)) return null;
  const racines = new Set([env.CLAUDE_CONFIG_DIR].filter(Boolean));
  try { for (const n of readdirSync(maison)) if (/^\.claude(?:-[\w-]+)?$/i.test(n)) racines.add(join(maison, n)); } catch { /* pas de profil lisible */ }
  for (const r of racines) {
    let dossiers = [];
    try { dossiers = readdirSync(join(r, "projects")); } catch { continue; }
    for (const d of dossiers) {
      const f = join(r, "projects", d, id + ".jsonl");
      if (existsSync(f)) return f;
    }
  }
  return null;
}

export function syntheseDuTour(cheminsEcrits) {
  return choisirParmi(cheminsEcrits) || choisirParmi(relusDuDisque(cheminsEcrits));
}

// TF-1081 (19/09/2026) — LE SCEAU SE POSE SANS GESTE HUMAIN, ET SUR CE QUE LE TOUR A ÉCRIT.
//
// `scripts\verifier-jugement.mjs` refuse depuis le 23/08 un livrable modifié après son sceau à
// indice inchangé (règle J-1). Le sceau, lui, restait un geste de la main : aucune synthèse n'en
// portait, donc la règle 5 ne protégeait rien du côté des restitutions. Le moment où une synthèse
// cesse d'être un brouillon est pourtant identifiable sans ambiguïté — c'est le PASS que ce hook
// vient de rendre sur elle.
//
// LE CONFLIT AVEC J-1, ET SA MESURE. Poser le sceau UNE SEULE FOIS, à la lettre de REGLES-PROJET.md
// (« au premier passage d'oracles »), ferait de chaque redépôt un écart J-1 — or le redépôt sous le
// même indice est la pratique, et elle est licite depuis la v2.25.0 du gabarit (« REDÉPOSE la
// synthèse à jour »). Mesure au journal des hooks de ce dépôt, 2905 lignes : sur 238 couples
// (session, fichier) jugés, 53 l'ont été PLUSIEURS FOIS — 22,3 %, jusqu'à 18 fois pour une même
// synthèse de mandat. Sceller une fois pour toutes aurait donc accusé un couple sur cinq, et une
// règle qui accuse la pratique majoritaire se fait désactiver.
//
// L'INVARIANT RETENU, en une phrase : le sceau d'une synthèse porte l'état EXACT que l'oracle vient
// de juger, et il ne se pose que sur le fichier ÉCRIT DANS LE TOUR — un redépôt jugé re-scelle, une
// synthèse modifiée sans repasser son juge reste en écart.
//
// LA CLAUSE « ÉCRIT DANS LE TOUR » EST CE QUI FAIT TENIR LE RESTE, et elle n'est pas un détail de
// portée : sans elle, un tour qui se contente de RELIRE une synthèse du disque — le repli de
// TF-1187 — reposerait le sceau sur un contenu que personne n'a jugé, et blanchirait en silence
// une édition faite à la main. Le repli sert à choisir quoi COMPARER ; il ne vaut pas jugement.
//
// Le geste est au mieux : un sceau qui échoue ne refuse jamais un tour conforme (chez un produit,
// l'outil du pilot n'est pas là), et il se lit au journal sous `sceau`.
export function syntheseEcriteDuTour(cheminsEcrits) {
  return choisirParmi(cheminsEcrits);
}

export function scellerSynthese(fichier) {
  if (!fichier || !existsSync(fichier)) return null;
  const outil = join(ICI, "..", "scripts", "verifier-jugement.mjs");
  if (!existsSync(outil)) return null;
  try {
    const r = spawnSync(process.execPath, [outil, fichier, "--sceller"], { encoding: "utf8" });
    if (r.status !== 0) return null;
    return JSON.parse(r.stdout).mesure?.scelles ? fichier : null;
  } catch { return null; /* le sceau est un bonus, jamais un motif de refus */ }
}

// TF-0891 — ce qui s'ajoute aux deux propriétés de 30/08, et pourquoi CELLES-LÀ. Le critère reste
// le même : on ne compare JAMAIS des textes mot à mot, seulement ce sur quoi le lecteur AGIT et
// qui ne s'abrège donc pas. Trois propriétés de plus le remplissent :
//   · le TABLEAU D'OPTIONS du bloc 3 — c'est lui qui porte le coût et l'exclusion de chaque voie
//     (S31) ; une décision rendue en prose se tranche à l'aveugle ;
//   · les SÉLECTEURS d'action `A-N` — ce sont eux qu'on cite pour répondre (S33) ; sans eux le
//     lecteur répond « 3 » et personne ne sait de quelle liste il parle ;
//   · les ACTEURS du vocabulaire gelé au bloc 8 — `auto_ia`, `manuelle_dev`,
//     `manuelle_utilisateur`. Le 07/09, ils sont devenus « IA » et « vous » à l'écran : la seule
//     information qui dit à qui la ligne appartient a disparu dans une reformulation.
const tableauOptions = (t) => /\|[^\n|]*\bOptions?\b[^\n|]*\|/i.test(bloc3De(t));
const selecteursActions = (t) => [...new Set((bloc8De(t).match(/\bA\s*-\s*(\d{1,2})\b/g) || [])
  .map((s) => (/(\d{1,2})/.exec(s) || [])[1]))].sort((a, b) => Number(a) - Number(b));
const acteursDe = (t) => (bloc8De(t).match(ACTEURS_GELES) || []).length;

// TF-0918 (08/09/2026) — SIXIÈME PROPRIÉTÉ : LES FAITS MESURÉS DU BLOC 2, ET LE SENS INVERSE.
//
// LES CINQ PROPRIÉTÉS DE TF-0891 REGARDENT LES BLOCS 3 ET 8, ET RIEN D'AUTRE. Elles ont été
// taillées pour un écran PLUS PAUVRE que la trace : une paraphrase qui perd le tableau d'options
// ou les acteurs. Le 08/09 le défaut est arrivé PAR L'AUTRE BOUT, et aucune des cinq ne pouvait
// le voir : au cours d'un mandat long, quatre restitutions successives ont été AFFICHÉES en
// réponse à des rapports d'agents de campagne, chacune enrichie des chiffres du moment — « 3
// rapports sur 7 » puis « 6 items clos », « design 4 commits » — alors que le fichier déposé,
// lui, n'était PAS redéposé et portait toujours « 2 sur 7 » et « design 2 ». Les décisions, les
// options, les sélecteurs et les acteurs étaient identiques des deux côtés : PASS à chaque tour.
// Retour humain, mot pour mot : « Le prompt de sortie ne respecte pas le format attendu par la
// Factory. »
//
// POURQUOI C'EST PIRE QUE LE CAS DE TF-0891, et non un simple symétrique. Un écran appauvri prive
// le lecteur du moment où il lit ; une trace périmée ment APRÈS, à tous ceux qui la reliront —
// et c'est elle qui est opposable. Le fichier est la pièce, l'écran est la lecture : si les deux
// divergent, ce n'est pas l'écran qui est faux, c'est la pièce.
//
// CE QUI EST COMPARÉ, dans la doctrine constante du fichier (jamais le texte mot à mot) : les
// FAITS MESURÉS du bloc 2 — ses nombres. S3 exige déjà qu'un verdict porte un fait mesurable ;
// ces faits-là ne s'abrègent pas, ils se recopient. Les identifiants (TF-####, D-N, A-N, R-##),
// les empreintes de commit, les versions, les dates et les heures sont retirés AVANT extraction :
// ils changent de forme sans changer de fait, et les compter ferait crier la règle sur une
// reformulation légitime. Reste ce que le lecteur retient : des compteurs.
const bloc2De = (t) => {
  const m = /(^|\n)#{1,4}\s*\**\s*2[.)]?\s*\**\s*Verdict/i.exec(t);
  if (!m) return "";
  const debut = m.index + m[0].length;
  const suivant = t.slice(debut).search(/\n#{1,4}\s/);
  return t.slice(debut, suivant === -1 ? undefined : debut + suivant);
};
const faitsDe = (t) => {
  const nu = bloc2De(t)
    .replace(/\b[A-Za-z]{1,4}\s*-\s*\d{1,4}\b/g, " ")          // TF-0844, D-16, A-54, R-38, C5
    .replace(/\b(?=[0-9a-f]{7,40}\b)(?=[a-f0-9]*[a-f])[0-9a-f]{7,40}\b/gi, " ") // empreintes de commit
    .replace(/\bv?\d+\.\d+(\.\d+)?\b/g, " ")                    // versions
    .replace(/\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b|\b\d{1,2}\s*[:h]\s*\d{2}\b/g, " "); // dates, heures
  return [...new Set(nu.match(/\d+/g) || [])].sort((a, b) => Number(a) - Number(b));
};

export function comparerAffiche(message, fichier) {
  const ecarts = [];
  const nm = numerosDe(message), nf = numerosDe(fichier);
  if (nf.join(",") !== nm.join(","))
    ecarts.push(`décisions du fichier jugé : ${nf.join(", ") || "aucune"} — décisions affichées : ${nm.join(", ") || "aucune"}`);
  const rm = replisDe(message), rf = replisDe(fichier);
  if (rf !== rm)
    ecarts.push(`options par défaut nommées : ${rf} dans le fichier jugé, ${rm} à l'écran`);
  if (tableauOptions(fichier) && !tableauOptions(message))
    ecarts.push("le bloc 3 du fichier jugé porte le TABLEAU DES OPTIONS (« Option | Ce qui se passe | Coût | Retour arrière ») ; "
      + "l'écran l'a remplacé par de la prose — la conséquence, le coût et le retour arrière de chaque voie ne sont plus lisibles (S31, S78)");
  const am = selecteursActions(message), af = selecteursActions(fichier);
  if (af.join(",") !== am.join(","))
    ecarts.push(`actions du fichier jugé : ${af.map((n) => `A-${n}`).join(", ") || "aucune"} — `
      + `actions affichées : ${am.map((n) => `A-${n}`).join(", ") || "aucune"} (S33 : une action se cite par son sélecteur)`);
  const cm = acteursDe(message), cf = acteursDe(fichier);
  if (cf > 0 && cm === 0)
    ecarts.push(`le bloc 8 du fichier jugé nomme ${cf} acteur(s) du vocabulaire gelé (auto_ia | manuelle_dev | manuelle_utilisateur) ; `
      + "l'écran n'en porte aucun — « vous » et « IA » ne disent pas à qui la ligne appartient (S6)");
  const fm = faitsDe(message), ff = faitsDe(fichier);
  const ecranSeul = fm.filter((n) => !ff.includes(n)), fichierSeul = ff.filter((n) => !fm.includes(n));
  if (ecranSeul.length || fichierSeul.length)
    ecarts.push("le VERDICT (bloc 2) affiché ne mesure pas ce que le fichier jugé mesure — "
      + (ecranSeul.length ? `l'écran avance ${ecranSeul.join(", ")} que la trace ne porte pas` : "")
      + (ecranSeul.length && fichierSeul.length ? " ; " : "")
      + (fichierSeul.length ? `la trace porte ${fichierSeul.join(", ")} que l'écran tait` : "")
      + ". Le fichier est la pièce opposable : si l'écran a été mis à jour et pas lui, c'est LUI qu'il faut redéposer, "
      + "pas l'écran qu'il faut appauvrir (S3)");
  return ecarts;
}

// ---- TF-1019 (11/09/2026) — UNE DÉCISION RENDUE RÉCLAME LA PREUVE DU GESTE, PAS SA REDEMANDE --
//
// LE FAIT, mesuré sur la transcription d'une session de ce poste et le journal des hooks.
// L'humain écrit « 11a » (décision D-11, option (a)) à 07:05:01Z, puis de nouveau « 11a » à
// 07:07:39Z. Les deux messages de fin de tour (07:07:31Z, 07:09:32Z) sont la synthèse de la
// VEILLE REJOUÉE MOT POUR MOT — 3156 mots, même titre, même bloc 3 qui repose D-11. Le hook les a
// jugés PASS les deux fois (« message portant un VERDICT (3156 mots, sans écriture) », 0 écriture,
// 3 commandes). Le geste demandé — le push — n'est venu qu'à 09:10:08.
//
// POURQUOI AUCUNE DES RÈGLES EXISTANTES NE POUVAIT LE VOIR. `oracle-synthese` juge la FORME d'un
// message : ses blocs, son verdict, ses décisions, ses actions. Une restitution conforme rejouée
// à l'identique est, par construction, conforme — c'est la même. Et `comparerAffiche` compare
// l'écran au FICHIER du tour, jamais le message au MESSAGE PRÉCÉDENT ni au message HUMAIN qui
// l'appelle. Il manquait la seule relation qui dit si quelque chose s'est passé : *ce tour-ci
// répond-il à ce qui vient d'être demandé, ou rejoue-t-il le tour d'avant ?*
//
// CE QUI EST AJOUTÉ, et rien de plus. Quand le dernier message humain est un SÉLECTEUR DE
// DÉCISION — et rien d'autre que des sélecteurs : « 11a », « D-11 (a) », « 32b, 30a » —, il ne
// demande pas une analyse, il tranche. La réponse doit donc porter la PREUVE du geste au bloc 4.
// Deux formes de non-geste sont refusées, toutes deux BLOQUANTES parce qu'elles laissent le
// lecteur croire qu'il n'a pas décidé (AVERTISSANTES depuis T2, TF-1947, 26/10/2026 : voir `BLOQUANTES`) :
//   1. le message final est IDENTIQUE au précédent (aux espaces près) — le tour n'a rien produit ;
//   2. la même D-N est REPOSÉE au bloc 3 — on redemande ce qui vient d'être répondu.
// La reconnaissance est volontairement ANCRÉE sur le message entier : un message qui n'est QUE
// des sélecteurs est sans ambiguïté, alors qu'un « 11a » noyé dans une phrase peut être une
// citation, une référence ou un chiffre. Mieux vaut ne pas voir un cas que crier sur une prose.
const SELECTEUR_UN = "(?:D\\s*-?\\s*)?\\d{1,2}\\s*\\(?\\s*[a-c]\\s*\\)?";
const SELECTEURS_SEULS = new RegExp(`^\\s*${SELECTEUR_UN}(?:(?:\\s*[,;]\\s*|\\s+)(?:et\\s+)?${SELECTEUR_UN})*\\s*[.!]?\\s*$`, "i");
const SELECTEUR_GLOBAL = /(?:D\s*-?\s*)?(\d{1,2})\s*\(?\s*([a-c])\s*\)?/gi;
// La décision REPOSÉE se lit à la forme que le gabarit prescrit depuis la v2.14.0 : identifiant,
// tiret, LA QUESTION ELLE-MÊME, posée comme une question — « D-N — <…> ? ». On ne lit pas le mot
// « décision » en prose — une restitution a le droit de PARLER d'une décision déjà prise
// (« D-11 (a) exécutée ») ; ce qui est refusé, c'est de la REPOSER.
// TF-1468 (28/09/2026) — LE MARQUEUR N'EST PAS LA FORME. La reconnaissance exigeait le SEUL
// marqueur de bloc de citation (`>`) : un rappel de D-N en PUCE (`- D-6 — <la même question> ?`)
// passait donc, quand la même ligne en citation était refusée — alors que les deux posent À
// L'IDENTIQUE la question tranchée. Inversement, une citation qui ne porte que l'identifiant et un
// tiret (« > D-6 — exécutée ») n'est PAS une question reposée. Ce qui compte est la FORME COMPLÈTE
// — identifiant, tiret, question qui se termine par un point d'interrogation — qu'elle vive sous
// `>` ou sous une puce (`-`, `*`, `•`), jamais le seul marqueur de tête de ligne.
const decisionsReposees = (t) => [...new Set([...String(t || "")
  .matchAll(/(?:^|\n)[ \t]*(?:>|[-*•])\s*\*{0,2}\s*D\s*-?\s*(\d{1,2})\s*\*{0,2}\s*[—–-][^\n]*\?/g)]
  .map((x) => x[1]))];
const normaliserTexte = (t) => String(t || "").replace(/\s+/g, " ").trim();

export function selecteursDecision(messageHumain) {
  const t = String(messageHumain || "").trim();
  if (!t || !SELECTEURS_SEULS.test(t)) return [];
  SELECTEUR_GLOBAL.lastIndex = 0;
  return [...t.matchAll(SELECTEUR_GLOBAL)].map((m) => ({ n: String(Number(m[1])), option: m[2].toLowerCase() }));
}

export function controlerGeste({ dernierHumain, dernierTexte, textePrecedent, texteSynthese = "" }) {
  const selecteurs = selecteursDecision(dernierHumain);
  if (!selecteurs.length) return { applicable: false, decision: null, verdict: "SANS_OBJET", ecarts: [] };
  const decision = selecteurs.map((s) => `D-${s.n} (${s.option})`).join(", ");
  const ecarts = [];
  if (dernierTexte && textePrecedent && normaliserTexte(dernierTexte) === normaliserTexte(textePrecedent))
    ecarts.push(`décision ${decision} reçue, geste absent : le message de fin de tour est identique au précédent`);
  const reposees = new Set([...decisionsReposees(dernierTexte), ...decisionsReposees(texteSynthese)]);
  for (const s of selecteurs)
    if (reposees.has(s.n))
      ecarts.push(`décision D-${s.n} (${s.option}) reçue, geste absent : la même D-${s.n} est reposée au bloc 3`);
  return { applicable: true, decision, verdict: ecarts.length ? "FAIL" : "PASS", ecarts };
}

// ---- TF-1641 (14/10/2026) — UNE EXPLICATION DEMANDÉE SE LIVRE DANS UNE FICHE ----------------------
//
// LE FAIT, du 12/10 chez un produit : deux diagnostics demandés (détail des coûts, puis
// recommandations) rendus en restitutions de 9 blocs ; le porteur a dû demander DEUX FOIS un
// fichier, puis « le constat et les précos dans un fichier MD, simple, bref, lisible et
// exploitable ». Le contenu utile existait dès le premier tour, dispersé entre les blocs. La règle
// (`references\ECRITURE.md` E-16) : l'explication va dans une fiche datée, la restitution y renvoie.
// CE QUI SE MESURE : le dernier message humain DEMANDE une explication (impératif expliquer,
// détailler, diagnostiquer, ou « fournis/donne/ajoute … précos, diagnostic, constat »), la réponse
// est une restitution complète (5 titres numérotés au moins), et le tour n'a écrit ni ne cite aucune
// fiche `.md` autre qu'une synthèse. AVERTISSEMENT, jamais blocage : la frontière entre une demande
// d'explication et une demande de travail reste un jugement. Mesure d'entrée sur les restitutions
// des produits du poste depuis le 17/09 : 24 sur 364 suivent un message humain que ce motif lit
// comme une demande d'explication ; la plupart en sont (« Explique… », « Détaille… »), 2 au moins
// demandent un travail (« écris un message … pour lui expliquer ») — d'où l'avertissement seul.
const DEMANDE_EXPLICATION = /(?<!\p{L})(?:explique[rz]?|d[ée]taille[rz]?|diagnostique[rz]?)(?!\p{L})|(?<!\p{L})(?:fournis|donne|ajoute)(?!\p{L})[^.?!\n]{0,40}(?<!\p{L})(?:pr[ée]cos?|pr[ée]conisations?|diagnostics?|constats?|recommandations?)(?!\p{L})/iu;
const FICHE_MD = /[\w\-. \/\\]+\.md\b/gi;
export function controlerExplication({ dernierHumain = "", dernierTexte = "", fichiersMd = [] }) {
  const restitution = (String(dernierTexte).match(/^#{1,4}\s*\d{1,2}\b/gm) || []).length >= 5;
  if (!DEMANDE_EXPLICATION.test(String(dernierHumain)) || !restitution) return { applicable: false, verdict: "SANS_OBJET", ecarts: [] };
  // Une fiche est un livrable DATÉ (R-4 : « … - AAAAMMJJ<indice>.md ») qui n'est pas la synthèse du tour.
  const fiche = (p) => { const nom = String(p).split(/[\\/]/).pop(); return /\d{8}[a-z]{0,2}\.md$/i.test(nom) && !/synth[eè]se|restitution/i.test(nom); };
  const ecrite = fichiersMd.some(fiche);
  const citee = (String(dernierTexte).match(FICHE_MD) || []).some(fiche);
  if (ecrite || citee) return { applicable: true, verdict: "PASS", ecarts: [] };
  return { applicable: true, verdict: "FAIL", ecarts: ["une explication demandée est rendue dans la restitution sans fiche : livre-la dans une fiche datée "
    + "(en bref chiffré, constat, préconisations, ordre conseillé, sources) et renvoie-y depuis la restitution, au lieu d'en disperser le contenu "
    + "dans les blocs 4 et 8 (references\\ECRITURE.md E-16, TF-1641)"] };
}

// TF-1666 — le défaut DISTINCT, dit au refus quand aucun préjugement n'a été joué dans le tour.
const RAPPEL_PREJUGEMENT = "PRÉJUGEMENT — cette réponse n'a pas été préjugée avant affichage, d'où le doublon à l'écran : écris la "
  + "prochaine restitution dans un fichier du dossier temporaire, joue `node oracles/hook-restitution.mjs --prejuger <fichier>` "
  + "(chez un produit : `node forge/hooks/factory.mjs restitution --prejuger <fichier>`), corrige jusqu'à l'exit 0, puis affiche "
  + "ce texte tel quel (TF-1647, TF-1666).";
const RAPPEL_GESTE = "Un mot de décision reçoit la PREUVE du geste au bloc 4, jamais la décision reposée.";

// ---- TF-1361 (27/09/2026) — UNE PROCÉDURE DEMANDÉE REÇOIT LE GUIDE, PAS UN TABLEAU DE PLUS ------
//
// LE FAIT, horodaté chez un produit le 22/09/2026 (lot « Produit-02 - RETOURS - 20260922a »,
// annexe A) : cinq demandes de procédure en 56 minutes — « Fournis le descriptif pas à pas… »,
// « donne la procédure détaillée », « Fournis les étapes pour la configuration… » —, et chaque
// réponse rendait ses 10 à 14 gestes en cellules de tableau, restitution PASS. Le guide écran par
// écran servi EN TÊTE à 21:49 a mis fin aux redemandes. S53 d'`oracle-synthese` exige ce guide pour
// toute action `manuelle_utilisateur` sur une interface tierce ; elle entre AVERTISSANTE, comme toute
// règle neuve. Elle devient BLOQUANTE ici dans un seul cas : quand le dernier message humain DEMANDE
// la procédure — le moment exact où un tableau de plus coûte une redemande de plus. Depuis T2 (TF-1947,
// 26/10/2026), ce contrôle AVERTIT : voir `BLOQUANTES`.
//
// LA RECONNAISSANCE, mesurée sur l'annexe A : les cinq demandes sont reconnues, et aucun des quatre
// autres messages de la soirée (« il faut que je ferme Google Ads Web… ? », « je n'ai pas de bouton
// prévisualiser », « j'ai mis les modèles… », « ok, j'ai mis l'accès lecture, vérifie »). Rejouée le
// 27/09 sur les 130 messages humains distincts des sessions de ce poste : le premier jet reconnaissait
// UN message à tort, par le mot « descriptif » (« le descriptif détaillé du lotissement ») ; la
// demande réelle qui l'emploie dit aussi « pas à pas », le mot est donc retiré — 0 sur 130 depuis. Un
// faux positif ne coûte rien SEUL : il faut aussi que la réponse laisse à l'humain un geste sur une
// interface tierce sans guide, c'est-à-dire que S53 soit déjà en échec.
const DEMANDE_PROCEDURE = new RegExp(
  "(?<![\\p{L}\\p{N}_])(?:proc[ée]dures?|pas [àa] pas|[ée]tapes?|mode op[ée]ratoire|marche [àa] suivre"
  + "|guide-moi|d[ée]taill(?:e|er|ez))(?![\\p{L}\\p{N}_])"
  + "|(?<![\\p{L}\\p{N}_])comment (?:j['’]|(?:je|on|faire|proc[ée]der)(?![\\p{L}\\p{N}_]))", "iu");

export function demandeProcedure(messageHumain) {
  return DEMANDE_PROCEDURE.test(String(messageHumain || ""));
}

export function controlerProcedure({ dernierHumain, fails = [] }) {
  if (!demandeProcedure(dernierHumain)) return { applicable: false, verdict: "SANS_OBJET", ecarts: [] };
  const s53 = fails.find((f) => f.regle === "S53");
  return s53
    ? { applicable: true, verdict: "FAIL",
      ecarts: [`procédure demandée au dernier message, et la réponse la rend encore en lignes d'action — ${s53.message}`] }
    : { applicable: true, verdict: "PASS", ecarts: [] };
}

// ---- TF-1851 (18/10/2026) — UNE DEMANDE DE DÉTAIL L'EMPORTE SUR LE RAPPEL D'UNE LIGNE (S4) ---------
//
// LE FAIT, retour Produit-79 RP-14 (lot 20261017b), le 16/10/2026 : l'humain écrit « 51 détaille » ; la
// restitution rappelle D-51 en UNE ligne, comme S4 le prescrit pour une décision posée et inchangée (TF-1429),
// et reporte le détail au bloc 4, sans texte exact, sans options, sans recommandation. L'humain : « je demande
// de détailler 51 et ce n'est pas fait, pourquoi ? ». S4 est une règle de forme et celle-ci l'emporte sur ce que
// l'humain vient de demander : la classe est « regle-de-forme-primant-sur-la-demande ». oracle-synthese ne lit
// que le texte jugé et ne peut pas le voir ; ce hook connaît le dernier message humain.
//
// CE QUI SE MESURE. Le dernier message humain DEMANDE le détail d'une ou plusieurs D-N : « 51 détaille »,
// « détaille D-51 », « détaille la 51 », « détaille la décision 51 », « 51 et 52 détaillez », « le détail de la
// 51 ». La décision est connue de la conversation : D-N figure dans la réponse, dans le message final du tour
// précédent ou dans la synthèse déposée ; sinon le « 51 » désigne autre chose (une action, un registre) et le
// contrôle se tait. Alors la réponse REPOSE D-N en entier — sa tête avec son point d'interrogation (texte exact),
// au moins deux options étiquetées, sa recommandation — ou la REMPLACE par des décisions détaillées, entières,
// qui la citent. Un rappel d'une ligne, une absence, une décision reposée sans options ou sans recommandation
// sont refusés. BLOQUANT, comme GESTE : une décision absente de l'écran ne peut pas être prise, et la garde
// anti-boucle borne le coût d'un faux positif à une relecture. AVERTISSANT depuis T2 (TF-1947, 26/10/2026) : une décision
// reposée sans ses options reste refusée par S4 ; une décision rappelée en une ligne est dite sous la réponse.
//
// MESURE D'ENTRÉE (18/10/2026) : sur les 265 phrases humaines distinctes citées « mot pour mot » dans les 750 fichiers de
// input/00-retours et du registre, la reconnaissance en retient 2, « 51 détaille » et « je demande de détailler 51 et ce n'est pas fait,
// pourquoi ? » (les deux du 16/10), et aucune des 263 autres. Population : les phrases que les lots citent, pas tous les messages
// humains des sessions, qui ne sont pas une entrée de cette campagne ; la mesure sur ces messages reste à rejouer par le pilot.
// NON JUGÉ : que le détail soit bon, que les options soient celles qui conviennent ; « détaille » sans numéro
// (on ne sait pas de quelle décision il parle) ; un tour que la portée du hook ne juge pas (réponse courte sans
// verdict) ; la désignation d'une décision par son sujet (« détaille la publication ») plutôt que par son numéro.
const NUM_DECISION = "(?:D\\s*-?\\s*)?(\\d{1,3})";
const LISTE_DECISIONS = NUM_DECISION + "(?:\\s*(?:,|;|et|&)\\s*" + NUM_DECISION + ")*";
// Un numéro nu précédé d'un nom de partie (« étape 3 détaille ») ou d'un autre registre (« TF-1851 ») n'est pas une décision.
const SANS_CONTEXTE = "(?<!(?<![\\p{L}\\p{N}_])(?:[ée]tape|point|section|chapitre|page|ligne|bloc|article|r[èe]gle|action|t[âa]che|item|version|S|A|TF|RT|RP)[\\s.-]*)";
const DEMANDES_DETAIL = [
  // « 51 détaille », « D-51, détaille », « 51 et 52 détaillez »
  new RegExp("(?<![\\p{L}\\p{N}_-])" + SANS_CONTEXTE + "(" + LISTE_DECISIONS + ")\\s*[,;:.\\-–—]?\\s*d[ée]taill(?:e|er|ez)(?![\\p{L}\\p{N}_])", "giu"),
  // « détaille D-51 », « détaille la 51 », « détaille-moi la décision 51 », « détailler les 51 et 52 »
  new RegExp("(?<![\\p{L}\\p{N}_])d[ée]taill(?:e|er|ez)(?![\\p{L}\\p{N}_])[\\s,-]*(?:moi\\s+)?(?:(?:la|le|les|l['’])\\s*)?(?:d[ée]cisions?\\s+)?(" + LISTE_DECISIONS + ")(?![\\p{L}\\p{N}_])", "giu"),
  // « le détail de la 51 », « le détail des décisions 51 et 52 » : l'article ou le mot « décision » est exigé,
  // « détail de 3 lignes » n'en est pas une
  new RegExp("(?<![\\p{L}\\p{N}_])d[ée]tails?\\s+(?:des|de|sur|d['’])\\s*(?:(?:la|les|l['’])\\s*(?:d[ée]cisions?\\s+)?|d[ée]cisions?\\s+)(" + LISTE_DECISIONS + ")(?![\\p{L}\\p{N}_])", "giu"),
  // « le détail de D-51 »
  new RegExp("(?<![\\p{L}\\p{N}_])d[ée]tails?\\s+(?:de|sur|d['’])\\s*(?:d[ée]cisions?\\s+)?(D\\s*-?\\s*\\d{1,3}(?:\\s*(?:,|;|et|&)\\s*D\\s*-?\\s*\\d{1,3})*)(?![\\p{L}\\p{N}_])", "giu"),
];

/** Les numéros de décision dont le dernier message humain demande le détail (« 51 détaille » → ["51"]). */
export function demandesDetail(messageHumain) {
  const t = String(messageHumain || "");
  const numeros = new Set();
  for (const re of DEMANDES_DETAIL) {
    re.lastIndex = 0;
    for (const m of t.matchAll(re)) for (const n of (m[1].match(/\d{1,3}/g) || [])) numeros.add(String(Number(n)));
  }
  return [...numeros];
}

const TETE_D = "(?:^|\\n)[ \\t]*(?:>|[-*•])\\s*\\*{0,2}\\s*D\\s*-?\\s*(\\d{1,3})\\s*\\*{0,2}\\s*[—–-][^\\n]*\\?";
/** Les décisions POSÉES d'un texte — tête « D-N — …? » — avec leur segment, jusqu'à la tête ou au titre suivant. */
function decisionsPosees(texte) {
  const t = String(texte || "");
  const tetes = [...t.matchAll(new RegExp(TETE_D, "g"))].map((m) => ({ n: String(Number(m[1])), debut: m.index }));
  const bornes = [...t.matchAll(/\n[ \t]*(?:>|[-*•])\s*\*{0,2}\s*D\s*-?\s*\d{1,3}\b|\n#{1,4}\s/g)].map((m) => m.index);
  return tetes.map((h) => {
    const fin = bornes.find((b) => b > h.debut + 1);
    const segment = t.slice(h.debut, fin === undefined ? undefined : fin);
    const options = new Set([...segment.matchAll(/\(([a-e])\)/g)].map((m) => m[1]));
    return { n: h.n, segment, options: options.size, recommandee: /recommand/i.test(segment) };
  });
}

export function controlerDetail({ dernierHumain = "", dernierTexte = "", textePrecedent = "", texteSynthese = "" }) {
  const demandees = demandesDetail(dernierHumain);
  if (!demandees.length) return { applicable: false, decision: null, verdict: "SANS_OBJET", ecarts: [] };
  const lesTextes = [dernierTexte, textePrecedent, texteSynthese].map((x) => String(x || "")).join("\n");
  const cite = (n) => new RegExp("(?<![\\p{L}\\p{N}_])D\\s*-?\\s*" + n + "(?![\\p{N}])", "iu");
  const connues = demandees.filter((n) => cite(n).test(lesTextes));
  if (!connues.length) return { applicable: false, decision: null, verdict: "SANS_OBJET", ecarts: [] };
  const posees = decisionsPosees(dernierTexte);
  const entieres = posees.filter((d) => d.options >= 2 && d.recommandee);
  const ecarts = [];
  for (const n of connues) {
    if (entieres.some((d) => d.n === n)) continue;
    // « ou la remplace par des décisions détaillées » : une décision entière, d'un autre numéro, qui la cite.
    if (entieres.some((d) => d.n !== n && cite(n).test(d.segment))) continue;
    const posee = posees.find((d) => d.n === n);
    const etat = posee
      ? `elle est reposée sans ${posee.options < 2 ? "ses options (a), (b), (c)" : "sa recommandation"}`
      : new RegExp("(?<![\\p{L}\\p{N}_])D\\s*-?\\s*" + n + "(?![\\p{N}])[^\\n]*inchang", "iu").test(dernierTexte)
        ? "elle n'est rappelée qu'en une ligne (« inchangée »)"
        : "elle est absente de ta réponse";
    ecarts.push(`détail demandé de D-${n} au dernier message, et ${etat} : S4 rappelle en une ligne une décision POSÉE et inchangée, `
      + "jamais une décision dont l'humain demande le détail (TF-1851, retour Produit-79 RP-14 : « je demande de détailler 51 et ce n'est pas fait, pourquoi ? »)");
  }
  return { applicable: true, decision: connues.map((n) => "D-" + n).join(", "), verdict: ecarts.length ? "FAIL" : "PASS", ecarts };
}

const RAPPEL_DETAIL = "Un détail demandé reçoit la décision EN ENTIER, au bloc 3 : sa tête « > **D-N — <la question exacte, avec son point d'interrogation>** », "
  + "ses options (a), (b), (c) avec ce qui se passe, le coût et le retour arrière de chacune, sa recommandation sourcée et la ligne « Sans réponse » ; "
  + "ou, si le détail se découpe, des décisions détaillées, une par point, qui citent D-N. Jamais une ligne de rappel (S4, TF-1851).";

// ---- TF-1849 (18/10/2026) — UNE D-N AFFICHÉE EST INSCRITE AU REGISTRE DU PRODUIT AVANT L'AFFICHAGE -----
//
// LE FAIT, retour Produit-79 RP-12 (lot 20261017b), le 15/10/2026 : une synthèse affichait D-37 à D-40
// sans qu'aucune entrée `question_humain` du ledger du produit ne les porte ; une autre session du même
// produit, qui avait lu ce registre, a pris D-37 à 8 minutes d'intervalle. Renumérotation après la réponse
// humaine (D-37 → D-41), et un seul numéro désignant deux questions le temps d'une conversation. Le numéro
// d'une décision est une référence que l'humain tape (« 37a ») : un numéro qui ne se réserve nulle part est
// un numéro qui peut désigner deux choses.
//
// OÙ UN PRODUIT CONSIGNE UNE DÉCISION POSÉE (mesuré le 18/10/2026 sur les 11 produits du poste, lecture seule).
// gabarits\ ne définit que le NOM du type, `question_humain` (CONTRAT-INTERFACE.md §3), jamais ses champs. Sur 11 produits,
// 6 portent des entrées de ce type et 5 aucune (dont un sans ledger) ; les 6 les écrivent de 4 façons, un produit en combinant
// deux : `question` en prose (2 produits), `id` + `question` + `options` (2), `decisions` / `decisions_posees` en objet
// {"D-44": sujet} (1, qui a écrit lui-même « réservée au registre avant affichage »), `etape` ou `porte_sur` + `resume`
// (2, où les D-N s'inscrivent surtout en `reponse_humain`). Le contrôle ne présume donc d'aucun champ : un numéro est INSCRIT si une entrée `question_humain` du `forge\ledger.jsonl` du produit le nomme, n'importe où.
// Le champ recommandé est `decisions_posees`, déjà employé ; il n'est pas exigé.
//
// CE QUI SE MESURE. Chez un produit seulement (un `forge\retours\` en remontant depuis le dossier de la session) :
// chaque tête « > **D-N — … ?** » du message final dont le numéro N est NOUVEAU doit figurer au registre. Une D-N est
// nouvelle quand ni le dernier message humain ni le message final du tour précédent ne la citent : une décision déjà
// à l'écran ou nommée par l'humain (« 51 détaille », « 16a ») se REPOSE (TF-1851) sans être réservée de nouveau. Un
// rappel d'une ligne (S4 : « **D-N** : <sujet>, posée le JJ/MM à HH:MM, inchangée ») n'a ni tiret ni point
// d'interrogation, n'est donc pas une tête, et n'est pas jugé. Au pilot : SANS_OBJET (voir plus bas).
// NON JUGÉ : que le numéro soit libre, ou continu (deux sessions qui écrivent au même instant, hors périmètre décidé le
// 18/10 : « Ne règle pas deux sessions qui écrivent au même instant ») ; que l'entrée du registre dise la même chose
// que la décision affichée ; un produit dont le ledger est absent (il le dit, ne l'invente pas).
// AU PILOT : il n'existe PAS de registre des D-N. Il n'a ni `forge\ledger.jsonl` ni `forge\retours\` ; ses D-N vivent
// dans les synthèses déposées sous `output\04-plans\`, et seule la revue hebdomadaire consigne une correspondance
// D-N → TF-#### (`todo\observabilite\revues-hebdo.jsonl`). Aucune règle n'est posée pour lui : elle n'a pas été décidée.
const D_NUMERO = /(?<![\p{L}\p{N}_])D\s*-?\s*(\d{1,3})(?![\p{N}])/giu;
const citeD = (n, texte) => new RegExp("(?<![\\p{L}\\p{N}_])D\\s*-?\\s*" + n + "(?![\\p{N}])", "iu").test(String(texte || ""));

/** Le dossier du produit (celui qui porte `forge\retours\`) en remontant depuis `racine`, ou null (pilot, forge). */
export function produitDe(racine) {
  let d = racine ? resolve(racine) : null;
  for (let i = 0; i < 12 && d; i++) {
    if (existsSync(join(d, "forge", "retours"))) return d;
    const parent = dirname(d); if (parent === d) break; d = parent;
  }
  return null;
}

/** Les numéros de décision inscrits au registre d'un produit : toute entrée `question_humain` de `forge\ledger.jsonl` qui nomme D-N. */
export function registreDesDecisions(produit) {
  const fichier = join(produit, "forge", "ledger.jsonl");
  if (!existsSync(fichier)) return { fichier, existe: false, entrees: 0, numeros: new Set() };
  const numeros = new Set();
  let entrees = 0;
  for (const l of readFileSync(fichier, "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (e?.type !== "question_humain") continue;
    entrees += 1;
    for (const m of JSON.stringify(e).matchAll(D_NUMERO)) numeros.add(String(Number(m[1])));
  }
  return { fichier, existe: true, entrees, numeros };
}

// MESURE D'ENTRÉE (18/10/2026, lecture seule) — population : les messages finaux des sessions de produits conservées à ce
// poste, rejoués par CETTE fonction avec le registre tel qu'il était à l'instant de l'affichage (entrées dont le ts ne dépasse
// pas celui du message). 4 produits ont des sessions avec des D-N :
// 225 restitutions posent au moins une D-N nouvelle, 205 seraient REFUSÉES (91 %) et 182 le seraient encore avec le
// registre d'aujourd'hui (81 %) ; en acceptant aussi les `reponse_humain`, 178 seraient refusées à l'instant (79 %). Par produit,
// refusées à l'instant sur posées : 18/30, 109/112, 63/68, 15/15. Un blocage immédiat refuserait donc la plupart des restitutions
// d'un produit, y compris d'un produit qui inscrit déjà ses décisions (63 sur 68 depuis le 11/10 chez l'un d'eux) : le
// contrôle AVERTIT jusqu'à l'échéance ci-dessous, puis REFUSE. Les produits reçoivent la règle à leur ouverture suivante
// (copie conforme de RESTITUTION.md) ; l'échéance est à REMESURER (même rejeu) avant d'être tenue.
// Échéance du blocage (TF-1849) : avant cette date, une D-N non inscrite est un AVERTISSEMENT ; à partir d'elle, le hook REFUSE.
// `FORGE_RESERVATION_BLOQUANTE_DES` (AAAA-MM-JJ) avance ou recule l'échéance sans toucher au hook ; la recette s'en sert pour jouer les deux états.
export const RESERVATION_BLOQUANTE_DES = process.env.FORGE_RESERVATION_BLOQUANTE_DES || "2026-11-01";

export function controlerReservation({ dernierTexte = "", dernierHumain = "", textePrecedent = "", racine = null, maintenant = new Date() }) {
  const produit = produitDe(racine);
  if (!produit) {
    // TF-1872 (D-32 (a), 18/10/2026) : le pilot a désormais son registre des D-N, et la MÊME règle s'y applique.
    if (estAuPilot(racine)) return controlerReservationPilot({ dernierTexte, dernierHumain, textePrecedent, maintenant });
    return { applicable: false, verdict: "SANS_OBJET", bloquant: false, ecarts: [], motif: "ni un produit (aucun forge\\retours\\ en remontant depuis le dossier de la session) ni le pilot : une forge n'a pas de registre des D-N" };
  }
  const deja = [dernierHumain, textePrecedent].join("\n");
  // Une D-N que l'humain NOMME (« D-51 », « 51a », « 51 détaille ») ou que le message précédent affichait n'est pas nouvelle.
  const nommees = new Set([...selecteursDecision(dernierHumain).map((s) => s.n), ...demandesDetail(dernierHumain)]);
  const nouvelles = decisionsPosees(dernierTexte).filter((d) => !nommees.has(d.n) && !citeD(d.n, deja));
  if (!nouvelles.length) return { applicable: true, verdict: "PASS", bloquant: false, ecarts: [], produit, nouvelles: [] };
  const registre = registreDesDecisions(produit);
  const absentes = nouvelles.filter((d) => !registre.numeros.has(d.n)).map((d) => "D-" + d.n);
  const bloquant = !!RESERVATION_BLOQUANTE_DES && maintenant >= new Date(RESERVATION_BLOQUANTE_DES);
  const ecarts = absentes.length ? [`${absentes.join(", ")} posée${absentes.length > 1 ? "s" : ""} au bloc 3 sans entrée \`question_humain\` au registre du produit `
    + `(${registre.existe ? `${registre.fichier}, ${registre.entrees} entrée(s) question_humain` : `${registre.fichier} introuvable`}) : un numéro de décision ne se réserve nulle part ailleurs, `
    + "et deux sessions du même produit peuvent le prendre toutes deux (TF-1849, retour Produit-79 RP-12 : D-37 posée deux fois à 8 minutes d'intervalle)"] : [];
  return { applicable: true, verdict: ecarts.length ? "FAIL" : "PASS", bloquant: ecarts.length ? bloquant : false, ecarts, produit,
    nouvelles: nouvelles.map((d) => "D-" + d.n), absentes };
}

// ---- TF-1872 (18/10/2026, D-32 (a), « valable tous produits ») — LE MÊME CONTRÔLE AU PILOT --------------------------------
//
// LE FAIT : le 18/10/2026, deux sessions du pilot sur le même arbre ont posé D-24, D-25 et D-26 pour des questions différentes
// (synthèses 20261018j, k et l), puis D-27 une quatrième fois (20261018n) ; une réponse « 24a » ne dit plus à quelle question elle répond.
// Le pilot n'avait aucun registre de ses numéros ; il en a un (`decisions\REGISTRE.jsonl`, amorcé avec D-13 à D-33), partagé par toutes ses
// sessions, et `node scripts\reserver-decision.mjs --question "<la question ?>"` rend le prochain numéro libre et l'inscrit en une opération.
// CE QUI SE MESURE : chaque tête « > **D-N — … ?** » NOUVELLE du bloc 3 (ni l'humain ni le message précédent ne la citent) figure au registre
// du pilot ET y porte une question qui ressemble à celle qu'on affiche (`memeQuestion` : la moitié des mots qui portent le sens, au moins).
// Deux refus distincts : « absente du registre » (personne n'a réservé) et « déjà prise pour une autre question » (la collision elle-même).
// NON JUGÉ : deux sessions qui écrivent au même instant sans l'outil ; deux postes qui réservent chacun de leur côté (le registre voyage par git) ;
// que la décision soit bien posée (S31, S32, S78 s'en chargent) ; un registre introuvable (il le dit, il n'accuse pas : un clone ancien).
// ÉCHÉANCE DU BLOCAGE, choisie sur mesure pour le pilot et non reprise des produits (voir RESTITUTION.md 2.47.0 pour le chiffre qui la justifie).
export const RESERVATION_PILOT_BLOQUANTE_DES = process.env.FORGE_RESERVATION_PILOT_BLOQUANTE_DES || "2026-10-25";
const questionDeTete = (segment) => { const m = /D\s*-?\s*\d{1,3}\s*\*{0,2}\s*[—–-]\s*([^\n]*\?)/.exec(String(segment || "")); return m ? m[1].replace(/\*+/g, "").replace(/\s+/g, " ").trim() : ""; };

export function controlerReservationPilot({ dernierTexte = "", dernierHumain = "", textePrecedent = "", maintenant = new Date(), fichier = process.env.FORGE_REGISTRE_DECISIONS_PILOT || REGISTRE_PILOT }) {
  const deja = [dernierHumain, textePrecedent].join("\n");
  const nommees = new Set([...selecteursDecision(dernierHumain).map((s) => s.n), ...demandesDetail(dernierHumain)]);
  const nouvelles = decisionsPosees(dernierTexte).filter((d) => !nommees.has(d.n) && !citeD(d.n, deja));
  if (!nouvelles.length) return { applicable: true, verdict: "PASS", bloquant: false, ecarts: [], produit: null, cible: "pilot", nouvelles: [], absentes: [], prises: [] };
  const registre = lireRegistrePilot(fichier);
  if (!registre.existe) return { applicable: false, verdict: "SANS_OBJET", bloquant: false, ecarts: [], motif: `registre des D-N du pilot introuvable (${fichier}) : un clone antérieur au 18/10/2026 — node bootstrap.mjs --pull` };
  const bloquant = !!RESERVATION_PILOT_BLOQUANTE_DES && maintenant >= new Date(RESERVATION_PILOT_BLOQUANTE_DES);
  const ecarts = [], absentes = [], prises = [];
  for (const d of nouvelles) {
    const posee = questionDeTete(d.segment);
    const inscrites = registre.entrees.filter((e) => String(e.n) === d.n);
    if (!inscrites.length) {
      absentes.push("D-" + d.n);
      ecarts.push(`D-${d.n} posée au bloc 3 sans entrée au registre des décisions du pilot (${registre.fichier}, ${registre.entrees.length} entrée(s), plus grand numéro D-${registre.max}) : `
        + "un numéro de décision ne se réserve nulle part ailleurs, et deux sessions du pilot peuvent le prendre toutes deux (TF-1872 : D-24, D-25 et D-26 posés deux fois le 18/10/2026 pour des questions différentes)");
    } else if (!inscrites.some((e) => memeQuestion(e.question, posee))) {
      prises.push("D-" + d.n);
      ecarts.push(`D-${d.n} est DÉJÀ PRISE au registre des décisions du pilot pour une autre question (« ${String(inscrites[0].question).slice(0, 110)} », ${inscrites[0].source || inscrites[0].date || "sans source"}) `
        + `et tu poses « ${posee.slice(0, 110)} » : une réponse « ${d.n}a » ne dirait plus à laquelle des deux elle répond (TF-1872, 18/10/2026)`);
    }
  }
  return { applicable: true, verdict: ecarts.length ? "FAIL" : "PASS", bloquant: ecarts.length ? bloquant : false, ecarts, produit: null, cible: "pilot",
    nouvelles: nouvelles.map((d) => "D-" + d.n), absentes, prises };
}

const RAPPEL_RESERVATION_PILOT = "Au PILOT, une D-N NOUVELLE s'inscrit au registre des décisions AVANT d'être affichée : `node scripts/reserver-decision.mjs --question \"<la question posée ?>\"` "
  + "rend le prochain numéro libre ET l'inscrit à decisions/REGISTRE.jsonl en une opération ; affiche alors « > **D-N — <cette question>** » avec CE numéro, tel qu'il est rendu. "
  + "Un numéro déjà pris pour une AUTRE question se remplace par un numéro réservé ; si c'est la MÊME décision reposée avec un libellé réécrit, `node scripts/reserver-decision.mjs --reformuler D-N --question \"<le libellé réécrit ?>\"` l'inscrit sous son numéro ; un rappel d'une ligne (« **D-N** : <sujet>, posée le JJ/MM à HH:MM, inchangée ») n'est pas une D-N nouvelle (S4, TF-1872).";
const RAPPEL_RESERVATION = "Une D-N NOUVELLE s'inscrit au registre du produit AVANT d'être affichée : une entrée `question_humain` du ledger (forge/ledger.jsonl) qui porte D-N et la question, "
  + "de préférence par `node <pilot>/scripts/reserver-decision.mjs --question \"<la question posée ?>\"` (rend le prochain numéro libre et l'inscrit en une opération, par l'écrivain du ledger du produit), "
  + "sinon par `python forge/ledger.py question_humain --decision D-N --question \"<la question posée>\"`, ou `node <forge-agents>/scripts/ledger.mjs append forge/ledger.jsonl '{\"type\":\"question_humain\",\"decisions_posees\":{\"D-N\":\"<la question>\"}}'` ; "
  + "puis réécris la restitution. Un rappel d'une ligne (« **D-N** : <sujet>, posée le JJ/MM à HH:MM, inchangée ») n'est pas une D-N nouvelle (S4, TF-1849).";
const rappelReservation = (r) => (r && r.cible === "pilot" ? RAPPEL_RESERVATION_PILOT : RAPPEL_RESERVATION);
const echeanceReservation = (r) => (r && r.cible === "pilot" ? RESERVATION_PILOT_BLOQUANTE_DES : RESERVATION_BLOQUANTE_DES);

// ---- TF-1866 (18/10/2026, D-29 (a)) — UN « OUI » À UNE QUESTION DE COMPLÉTUDE PORTE SA LIGNE « Mesuré sur » -------------------
//
// LE FAIT, retour Produit-02 RT-126 : à « Est-ce que le reste du site a été mis à jour ? », la session répond « Oui, tout le site en ligne est à jour ».
// `oracle-synthese` (S82) juge le TEXTE ; seul ce hook lit le dernier message humain, donc seul il sait qu'un « oui » répond à une question de complétude.
// CE QUI SE MESURE : le dernier message humain pose une question fermée de complétude (« est-ce que tout… », « le reste… est-il à jour ? », « rien oublié ? »,
// « complet ? ») ET la réponse s'ouvre sur « oui » ET aucune ligne « Mesuré sur : <source>, relue à HH:MM, périmètre <n> » valide ne l'accompagne.
// NON JUGÉ : un « non » ou une réponse chiffrée (ce n'est pas l'affirmation), un « oui » à une question qui n'est pas de complétude, que la source soit vraie.
// BLOQUANT : mesuré sur 903 messages humains de sessions (pilot et produits du poste), la lecture ne trouve qu'un seul « oui » à une question de complétude — le cas du 15/10.

// ---- TF-1514 (13/10/2026) — « SEUL L'HUMAIN LA DÉTIENT » SE LIT CONTRE LA CONVERSATION --------
//
// LE FAIT, 01/10/2026 à 10:10, lot Produit-64 (RT-31) : une restitution laisse à l'humain le dépôt
// d'un jeton dans une variable secrète de pipeline, au motif que « le jeton n'est qu'en sa
// possession ». C'était faux : la valeur figurait dans un message du porteur, plus haut dans la même
// session, et l'API de la plateforme répondait 200 au jeton de la session. Le porteur a fait le geste
// à la main. `oracle-synthese` ne lit que le texte jugé et ne peut pas le voir : ce hook a la
// conversation. Il lit une seule forme, la déclaration qu'une valeur n'est détenue que par l'humain,
// et la confronte aux messages humains de la session : si l'un d'eux porte une valeur de FORME
// SECRÈTE (20 caractères au moins, sans espace, lettres et chiffres mêlés), la déclaration est
// signalée. AVERTISSEMENT, jamais blocage, comme toute règle neuve (D-70 (b)) ; la valeur n'est
// jamais recopiée, seulement ses 5 premiers caractères et sa longueur (TF-0986). NON JUGÉ : que la
// valeur trouvée soit celle dont la restitution parle.
const SEULE_POSSESSION = /(?:qu['’]en (?:votre|sa|ta|leur) possession|n['’]est (?:d[ée]tenue?|connue?) que (?:de vous|par vous|de l['’](?:humain|utilisateur|exploitant|porteur))|vous seule?s? (?:la |le |les )?(?:d[ée]tenez|poss[ée]dez|connaissez)|seule?s? l['’](?:humain|utilisateur|exploitant|porteur) (?:la |le |les )?(?:d[ée]tient|poss[èe]de|conna[iî]t))/i;
// Le jeton s'arrête à la barre oblique, à l'antislash et aux deux-points : un chemin ou une adresse n'est
// pas un secret. Un jeton fait uniquement de chiffres hexadécimaux et de tirets (un sha, un identifiant
// de session) est écarté pour la même raison.
const _CAR_SECRET = "A-Za-z0-9._~=-";
const FORME_SECRETE = new RegExp(`(?<![/\\\\:${_CAR_SECRET}])(?=[${_CAR_SECRET}]{20,}(?![/\\\\:${_CAR_SECRET}]))`
  + `(?![0-9a-fA-F-]{20,}(?![${_CAR_SECRET}]))(?=[${_CAR_SECRET}]*\\d)(?=[${_CAR_SECRET}]*[A-Za-z])[${_CAR_SECRET}]{20,}`);

export function controlerPossession({ textesHumains = [], dernierTexte = "" }) {
  const m = SEULE_POSSESSION.exec(String(dernierTexte || ""));
  if (!m) return { applicable: false, verdict: "SANS_OBJET", ecarts: [] };
  for (const t of textesHumains) {
    const v = FORME_SECRETE.exec(String(t || ""));
    if (v) return { applicable: true, verdict: "FAIL", ecarts: [`la réponse dit d'une valeur « ${m[0]} », alors qu'un message humain de `
      + `cette session porte une valeur de forme secrète (${v[0].slice(0, 5)}…, ${v[0].length} caractères) : une valeur que l'humain a `
      + "fournie dans la conversation est utilisable par la session (R-29 point 4). Vérifie que ce n'est pas elle, ou fais le geste."] };
  }
  return { applicable: true, verdict: "PASS", ecarts: [] };
}

const RAPPEL_PROCEDURE = "Une procédure demandée reçoit un guide EN TÊTE, avant le bloc 0 : « ## Guide — <le geste à "
  + "faire> », la source officielle et la date où tu l'as lue, puis des étapes numérotées, une sous-puce par geste (écran, champ, bouton), chacune close par « Résultat "
  + "attendu : … » en DERNIÈRE sous-puce (S81) ; le bloc 0 garde alors son titre « ## 0. Synthèse d'ouverture ».";

// ---- TF-0904 (08/09/2026) — UN VERDICT RENDU SANS ÉCRIRE UN FICHIER EST UNE RESTITUTION -------
//
// LE FAIT, mesuré le 07/09 : question humaine « la proposition a-t-elle été testée ? peut-on
// garantir… », réponse de 450 mots en prose — verdict remis sans bloc 0, sans preuve, sans
// fichier. UNE commande, ZÉRO écriture : hors du critère de « tour de TRAVAIL », donc jamais
// jugée. Retour humain : « pourquoi le prompt ne suit pas la norme ? ».
//
// LA CONTRADICTION QU'IL RÉVÈLE : `RESTITUTION.md` régit **« tout message de fin de
// traitement »** ; ce hook n'en jugeait qu'un sous-ensemble défini par le nombre d'outils
// appelés. Le nombre d'outils mesure l'EFFORT, jamais la NATURE de ce qui est rendu — et c'est
// la nature qui décide si un lecteur va agir sur le message.
//
// CE QUI EST AJOUTÉ, et rien de plus : un message final est jugé s'il porte un VERDICT (mots du
// vocabulaire fermé ci-dessous) ou s'il dépasse le seuil de mots. Les EXEMPTIONS sont écrites au
// §Portée du gabarit et tenues ici : un accusé de réception, une réponse courte, une question
// rendue à l'humain. Le seuil est haut (150 mots) par choix : un gate `Stop` juge APRÈS
// affichage, donc chaque faux refus fait relire un message entier (v2.5.0) — mieux vaut manquer
// une prose de 140 mots que refuser une phrase de politesse.
const SEUIL_MOTS = 150;
// LE VOCABULAIRE DE VERDICT, ET LE PIÈGE QU'IL A TENDU DÈS SA PREMIÈRE EXÉCUTION. Écrit d'abord
// en un seul motif insensible à la casse, il contenait le jeton PASS — qui a matché « passé »
// dans « tout s'est bien passé » : le « é » final n'est pas un caractère de mot ASCII, donc la
// frontière tombe juste après « pass ». Un accusé de réception ordinaire devenait un verdict, et
// la recette l'a montré dans la minute. C'est EXACTEMENT la classe de TF-0805, prise par l'autre
// bout : là une frontière ASCII empêchait de lire un mot accentué, ici elle en fabriquait un.
// Les jetons en capitales sont donc jugés SENSIBLES à la casse et bornés sur les lettres
// accentuées ; les mots français gardent l'insensibilité, qui leur est légitime.
const VERDICT_MOTS = /\bverdicts?\b|\bnon conformes?\b|\bconformes?\b|\bgaranti(?:r|e|es|s)?\b|\brecette (?:verte|rouge|ex[ée]cut[ée]e)\b|\bexhaustive?s?\b/i;
const VERDICT_JETONS = /(?<![A-Za-zÀ-ÿ])(?:PASS|FAIL)(?![A-Za-zÀ-ÿ])/;
const VERDICT = { test: (s) => VERDICT_MOTS.test(s) || VERDICT_JETONS.test(s) };

// Une décision `D-N` ou une action `A-N` POSÉE dans le message : ce n'est plus un accusé de
// réception, c'est une demande de geste. Borne commune à l'exemption « rien de neuf » (TF-0990)
// et au relais d'avancement (TF-1182) — les deux se réclament des MÊMES trois absences.
// 01/10/2026 — CITER N'EST PAS POSER (recette, cas 38 et 39). Le motif prenait toute mention pour
// une décision posée : une réponse courte qui rappelait « la décision de départ (D-39) » a été
// refusée après affichage, réécrite, et l'humain l'a lue deux fois. Poser, c'est la FORME d'une
// décision ou d'une action : l'identifiant suivi d'un séparateur (« D-4 — », « A-2 : »,
// « | **A-1** | ») ou d'une option à choisir (« D-39 (a) », « D-39 b. »). Une mention dans la
// prose, entre parenthèses ou en complément, reste une citation.
const POSE_UN_GESTE = /(?<![A-Za-zÀ-ÿ])[DA]\s*-\s*\d{1,3}(?![0-9])\**\s*(?:[—–:|]|-\s|\(\s*[a-e]\s*\)|[a-e](?=\s*(?:[.,;!?»]|$)))/m;

const SEUIL_ATTENTE = 60;
const ATTENTE = /\b(?:attends?|attente|en cours|tourne(?:nt)?|arri[èe]re-plan|reviens|reprends|reprendrai|d[èe]s (?:qu|la fin|son|leur)|notifi|en t[âa]che de fond)/i;
export function jugeable({ travail, ecritures = 0, commandes = 0, dernierTexte, depuisDernierAffichage = null, enAttente = [], ecrituresDuTour = [] }) {
  if (!dernierTexte) return { juge: false, motif: "aucun texte final dans le transcript" };
  const mots = dernierTexte.trim().split(/\s+/).filter(Boolean).length;
  // ---- TF-1182 (17/09/2026) — LE RELAIS D'AVANCEMENT N'EST PAS UN RENDU DE FIN DE TRAITEMENT ---
  //
  // L'INVARIANT, et il se lit en une phrase : **on juge un RENDU, et un rendu porte du travail que
  // personne n'a encore vu.** Ce qui a été écrit AVANT le dernier texte affiché a déjà été jugé
  // sur ce texte-là ; le re-juger sur le message suivant ne protège aucun lecteur, il lui fait
  // relire une synthèse de 120 lignes pour trois lignes de relais. La mesure n'est donc pas
  // « ce tour a-t-il travaillé ? » mais « QUELQUE CHOSE A-T-IL BOUGÉ DEPUIS LE DERNIER AFFICHAGE ? ».
  //
  // POURQUOI CELA NE ROUVRE PAS LE TROU DE TF-0978 (« aucune exemption ne s'applique à un tour de
  // travail »). Ce que TF-0978 refuse, c'est qu'un tour qui a écrit, commité ou lancé une
  // exécution se restitue en cent mots. Ici, l'écriture reste JUGÉE — sur le message qui l'a
  // suivie. L'exemption tombe dès qu'une seule écriture s'intercale entre l'affichage précédent
  // et celui-ci, et le banc le prouve dans les deux sens (`hook-restitution.test.mjs`, cas 23/24).
  // Elle porte en plus les TROIS absences de TF-0990 — aucun verdict, aucune `D-N`, aucune `A-N` —
  // et la brièveté : un message qui tranche, mesure ou demande un geste n'est pas un relais.
  //
  // CE QUE CETTE VOIE NE VOIT PAS, dit plutôt que promis : une écriture faite par une COMMANDE
  // (`sed`, une redirection) n'est pas un appel d'outil d'écriture. Le seuil de quatre commandes
  // — celui qui définit déjà un tour de travail — borne le risque sans le supprimer.
  const relaisPossible = depuisDernierAffichage
    && depuisDernierAffichage.ecritures === 0 && depuisDernierAffichage.commandes < 4;
  if (relaisPossible && mots <= SEUIL_MOTS && !VERDICT.test(dernierTexte) && !POSE_UN_GESTE.test(dernierTexte))
    return { juge: false, motif: `relais de ${mots} mots : rien n'a été écrit depuis le dernier affichage `
      + `(${depuisDernierAffichage.commandes} commande(s), 0 écriture), aucun verdict, aucune D-N ni A-N (TF-1182)` };
  // ---- TF-1649 (14/10/2026) — LE MESSAGE D'ATTENTE D'UNE TÂCHE D'ARRIÈRE-PLAN DU TOUR ----------
  //
  // LE FAIT, mesuré le 13/10 chez un produit : 2 refus (S1, S3, S4, S6) de messages d'attente rendus
  // pendant qu'un relevé tournait en arrière-plan — deux doublons pour une phrase. Le tour a écrit,
  // donc il est jugé ; mais sa restitution ne PEUT pas encore exister : la mesure n'est pas revenue,
  // et le harnais rouvrira le tour à la notification de fin, dans le MÊME segment. C'est ce message-là
  // qui sera jugé, travail compris : TF-0978 ne se rouvre pas, la restitution est différée, pas
  // exemptée. BORNES, toutes mesurables : une tâche lancée dans le segment et non revenue
  // (`tachesEnAttente`), 3 lignes et 60 mots au plus, un mot d'attente, aucun verdict, aucune D-N ni A-N.
  const lignes = dernierTexte.trim().split(/\r?\n/).filter((l) => l.trim()).length;
  if (enAttente.length && mots <= SEUIL_ATTENTE && lignes <= 3 && ATTENTE.test(dernierTexte)
    && !VERDICT.test(dernierTexte) && !POSE_UN_GESTE.test(dernierTexte))
    return { juge: false, motif: `message d'attente de ${mots} mots : ${enAttente.length} tâche(s) d'arrière-plan lancée(s) dans le tour et `
      + "non revenue(s), aucun verdict, aucune D-N ni A-N — la restitution vient avec son résultat (TF-1649)" };
  // TF-1947 — `travail` vaut « le tour a écrit » (`ecrituresDuTour`) ; le motif nomme les premières écritures relevées.
  if (travail) return { juge: true, motif: `tour de travail (${ecritures} écriture(s), ${commandes} commande(s))`
    + (ecrituresDuTour.length ? ` — écrit : ${ecrituresDuTour.slice(0, 3).join(" ; ")}${ecrituresDuTour.length > 3 ? ` (+${ecrituresDuTour.length - 3})` : ""}` : "") };
  // Une QUESTION rendue à l'humain n'est pas une restitution : c'est `bloque_question`, et la
  // doctrine la veut courte. L'exempter explicitement vaut mieux que de la laisser au seuil.
  if (/\?\s*$/.test(dernierTexte.trim()) && mots <= 60) return { juge: false, motif: `question rendue à l'humain (${mots} mots)` };
  if (VERDICT.test(dernierTexte)) return { juge: true, motif: `message portant un VERDICT (${mots} mots, sans écriture)` };
  // TF-1947 (26/10/2026) : « 150 mots au plus » (D-75 (c), `references\NIVEAUX.md`) — le 150e mot n'est plus jugé, comme au relais.
  if (mots > SEUIL_MOTS) return { juge: true, motif: `message de ${mots} mots rendu à l'humain (sans écriture)` };
  // TF-0990 (09/09/2026) — L'EXEMPTION « RIEN DE NEUF » ET SON TROU SYMÉTRIQUE. Le référentiel
  // annonçait depuis la v2.18.0 qu'un tour qui n'apporte rien de neuf — une notification de tâche
  // de fond, un rapport reçu et rien d'autre — relève des exemptions : un accusé bref, jamais une
  // restitution complète de plus. *Une exemption écrite dans le référentiel et absente de son juge
  // n'existe pas : c'est le juge qui fait la règle, et le texte devient trompeur pour qui le lit.*
  // Elle est donc NOMMÉE ici, et elle arrive avec la borne qui la rend honnête : un message court
  // qui POSE une décision `D-N` ou une action `A-N` n'a rien d'un accusé de réception — il demande
  // un geste à l'humain, donc il est jugé. C'est le trou que l'exemption laissait ouvert, et il se
  // ferme par la même écriture qui l'ouvre : ce qui s'assouplit d'un côté se resserre de l'autre.
  if (POSE_UN_GESTE.test(dernierTexte))
    return { juge: true, motif: `message court POSANT une décision D-N ou une action A-N (${mots} mots) — l'exemption « rien de neuf » exige les TROIS absences (§Portée)` };
  return { juge: false, motif: `${mots} mots, aucune écriture dans le tour (${commandes} commande(s) de lecture), aucun verdict, aucune D-N ni A-N — `
    + "accusé de réception, réponse courte ou « rien de neuf » (exemption §Portée, D-75 (c))" };
}

// ---- TF-1947 (26/10/2026) — UNE RÉPONSE COURTE N'ÉCHAPPE PAS À LA MESURE D'UNE EXHAUSTIVITÉ ----------------------------
// Élargir la réponse courte à tout tour sans écriture retirait du jugement les tours de lecture de quatre commandes et plus,
// où le contrôle COMPLÉTUDE et S82 refusaient un « oui, tout est à jour » non mesuré (TF-1866, RT-126 : « oui, tout le site
// est à jour » sur une liste écrite par l'auteur). Ces deux contrôles, et eux seuls, jouent donc aussi sur une réponse courte,
// sans lui demander de restitution : le refus réclame la ligne « Mesuré sur », ou le retrait de l'affirmation.
export function controlerReponseCourte({ dernierHumain = "", dernierTexte = "" }) {
  const completude = controlerOuiDeCompletude({ dernierHumain, dernierTexte });
  const ecarts = completude.ecarts.map((e) => `COMPLÉTUDE — ${e}`);
  const affirmations = completude.verdict === "FAIL" ? [] : affirmationsDExhaustivite(dernierTexte);
  if (affirmations.length && !lignesMesure(dernierTexte).some((x) => x.valide))
    ecarts.push(`S82 — la réponse affirme une exhaustivité (« ${affirmations[0].extrait.slice(0, 110)} », motif « ${affirmations[0].motif} ») `
      + "sans ligne « Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments> »");
  return { applicable: completude.applicable || affirmations.length > 0, verdict: ecarts.length ? "FAIL" : "PASS", ecarts };
}
const RAPPEL_REPONSE_COURTE = "La réponse reste COURTE : aucune restitution complète n'est exigée d'un tour qui n'a rien écrit. "
  + "Ajoute la ligne « Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments> », ou retire l'affirmation et dis ce qui n'a pas été mesuré (TF-1866, TF-1947).";

// SÉVÉRITÉS (22/08, retour humain : « le prompt de résultat s'affiche 2 fois »). Un hook `Stop`
// juge APRÈS l'affichage : refuser force une réécriture, et la version refusée RESTE à l'écran.
// Le lecteur relit alors une restitution entière pour un défaut de détail — mesuré au journal :
// les trois refus en session réelle portaient tous sur S8 (une puce sans preuve), jamais sur la
// structure. Le gate reste, il devient proportionné :
//   · BLOQUANT — la restitution est inutilisable sans ça : blocs absents (S1), verdict non
//     factuel (S3), décision sans choix fermé (S4), actions non classées (S6). Le doublon est
//     alors justifié : mieux vaut lire deux fois qu'agir sur une restitution qu'on ne peut pas
//     utiliser.
//   · AVERTISSEMENT — tout le reste (S2, S5, S7, S8, S9, S10) : dit en une ligne sous la
//     réponse, journalisé, jamais réécrit. Une preuve manquante sur une puce ne vaut pas de
//     faire relire huit blocs.
//   · S17 à S20 (v2.9.0, 22/08) entrent en AVERTISSEMENT par le même raisonnement que S11-S14 :
//     une action sans conséquence, un renvoi par position, deux formes de tableau ou un jargon nu
//     rendent la liste moins utile, jamais illisible — et le doublon d'affichage qu'un blocage
//     provoque coûterait plus que le défaut qu'il dénonce. Elles se durciront quand le corpus
//     sera propre, comme la v2.0.0 l'a fait avant elles.
//   · S11 à S14 (v2.6.0, 22/08) entrent en AVERTISSEMENT par le même raisonnement, et c'est
//     délibéré : une action `auto_ia` sans motif, une action humaine sans sa raison ou sans son
//     chemin rendent la liste MOINS UTILE, jamais illisible — le doublon d'affichage qu'un
//     blocage provoque coûterait plus que le défaut qu'il dénonce. Elles se durciront quand le
//     corpus sera propre, exactement comme la v2.0.0 est restée informative avant de bloquer.
//   · S80 (TF-1847, 18/10/2026) est BLOQUANTE dès son entrée, contre l'usage des règles neuves, parce qu'elle a été mesurée avant :
//     « 1) … 2) … 3) » sur une même ligne, E-11 sans juge pour le Markdown, retour humain du 17/10 pour la deuxième fois (« J'ai déjà dit que
//     lorsqu'il y avait des listes, il devait y avoir des puces et sous-puces affichées »). Sur les 274 synthèses d'output\04-plans, 9 accusations,
//     toutes lues une à une, aucune fausse : un refus de plus sur trente restitutions environ. S81 (le guide) reste AVERTISSANTE : le pilot n'a
//     aucun guide dans son corpus, la règle n'a pas de mesure de faux positifs sur du réel.
//   · S48 (TF-1644, 14/10/2026) devient BLOQUANTE. Elle ne FAIL que chez un produit, et le refus
//     y est la seule voie par laquelle la SESSION apprend qu'elle n'a pas dit ce qu'elle remonte :
//     un avertissement s'affiche à l'humain, jamais à l'agent. Le 12/10, ni l'une ni l'autre ne l'a
//     vu, et le porteur a dû poser la question. Mesure d'entrée sur les restitutions des produits
//     du poste (transcripts des deux profils) : 20 FAIL sur 364 depuis le 17/09 (12 muettes, 8 qui
//     ne tranchent pas), 7 sur 147 depuis le 01/10 — un refus de plus sur vingt tours environ.
// S82 (TF-1866, 18/10/2026) : une affirmation d'exhaustivité sans « Mesuré sur » est refusée ; mesure d'entrée au gabarit RESTITUTION.md 2.47.0.
//
// ---- T2 (TF-1947, 26/10/2026, décisions humaines D-68 (a) et D-75 (c)) — LE COMPTE RENDU COMPLET ALLÉGÉ NE BLOQUE PLUS QUE SUR
// DEUX MOTIFS, ET SUR LES CONTRÔLES QUI PROTÈGENT UN FAIT. Les sévérités ci-dessus sont l'histoire ; celle-ci est la règle en vigueur.
//   · Motif 1 — un bloc toujours présent absent (S1 : blocs 0, 1, 3, 4, 5, 8 et 9 ; les blocs 2, 6 et 7 ne viennent que s'ils ont
//     un contenu). Motif 2 — une décision sans ses options (S4 : choix fermé, et au format B son tableau d'options).
//   · Exceptions gardées bloquantes, chacune parce que son refus protège un fait : S3, un verdict sans fait mesuré (un vert non
//     mesuré ; 0 refus réel sans S1 du 19 au 26/10/2026) ; S82 et COMPLÉTUDE, une exhaustivité sans « Mesuré sur » (RT-126) ;
//     AFFICHAGE, un écran qui ne dit pas ce que dit le fichier jugé ; RÉSERVATION, une D-N nouvelle non réservée (un numéro qui
//     désigne deux questions). Aucun contrôle de secret ni de sécurité n'était bloquant à ce hook : il n'y a rien à garder.
//   · Deviennent AVERTISSANTS : S6, S48, S80 (et S83, S84, qui devaient bloquer le 28/10/2026) ; les contrôles GESTE, DÉTAIL et
//     PROCÉDURE du tour. Mesuré du 19 au 26/10/2026 sur les refus réels au premier passage : S48 seule ou sans S1, 10 ; DÉTAIL
//     seul, 1. Le niveau Moyen, en essai, garde son propre juge de forme (`jugerFormeMoyen`).
//
// ---- T4 (TF-1949, 26/10/2026, décisions humaines D-69 (a) et D-79 (c)) — LE 3e MOTIF : LE VERROU « LIVRÉ ». Chez un produit, une
// restitution qui déclare le produit livré, complet ou une clôture se juge contre la dernière ligne de `forge\mobilisation.jsonl` :
// S85, un livrable exigé d'une forge mobilisée absent chez le produit, BLOQUE dès sa mise en service ; S86, la trace elle-même absente,
// avertit jusqu'au 2026-11-02 puis bloque (`BLOQUANTES_DATEES`, échéance écrite ici, déplaçable pour la recette par
// `FORGE_VERROU_LIVRE_BLOQUANT_DES`). Le fait : sur 10 produits clos ou publiés, 2 portaient leurs 4 livrables de forge. Non rétroactif :
// une restitution datée d'avant le 2026-10-26 n'est pas jugée, et seule la dernière demande tracée compte. S72 avertit quand le verrou juge.
const BLOQUANTES = new Set(["S1", "S3", "S4", "S82", "S85"]);
// S83 (TF-1936) et S84 (TF-1938), 21/10/2026 : AVERTISSANTES jusqu'au 28/10, puis BLOQUANTES, décidées sous R-58. T2 (décision
// humaine du 26/10/2026) les laisse AVERTISSANTES : aucune ne protège un vert sur un fait au sens de T2 (S84 protège l'heure
// d'en-tête, une donnée de reprise, pas un verdict). Le mécanisme d'échéance sert depuis T4 à S86 (`{ Sxx: "AAAA-MM-JJ" }`).
export const VERROU_LIVRE_BLOQUANT_DES = process.env.FORGE_VERROU_LIVRE_BLOQUANT_DES || "2026-11-02";
export const BLOQUANTES_DATEES = { S86: VERROU_LIVRE_BLOQUANT_DES };
export const estBloquante = (regle, maintenant = new Date()) =>
  BLOQUANTES.has(regle) || (Boolean(BLOQUANTES_DATEES[regle]) && maintenant >= new Date(BLOQUANTES_DATEES[regle]));
const avecEcheance = (f) => (BLOQUANTES_DATEES[f.regle] && !estBloquante(f.regle) ? `${f.regle} (bloquante dès le ${BLOQUANTES_DATEES[f.regle]})` : f.regle);

// LE TEXTE QUI APPREND LA FORME — et il avait DIX VERSIONS DE RETARD (01/09/2026).
//
// LE FAIT, et il est mesurable au registre : cette chaîne a été écrite le 20/08 (v2.4.0) et n'a
// plus bougé, pendant que `gabarits\RESTITUTION.md` passait de 2.5.0 à 2.14.0 — dix versions,
// toutes nées d'un retour humain. Elle ignorait donc TOUT de ce qui a été prescrit depuis : le
// bloc 8 en TABLEAU UNIQUE (S18, 22/08), le sélecteur `D-N` des décisions (S30, 28/08), le
// tableau d'options par défaut (v2.12.0, 30/08), l'anatomie complète d'une décision et ses deux
// juges S31/S32 (v2.13.0), la décision en BLOC DE CITATION (v2.14.0).
//
// POURQUOI C'EST LE PIRE ENDROIT OÙ LAISSER UN TEXTE PÉRIMÉ. Cette chaîne n'est pas de la
// documentation : c'est ce que l'agent LIT au moment précis où on lui refuse sa réponse et où il
// la réécrit. Le hook refusait donc au nom de la v2.14 en dictant la v2.4 — l'agent obéissait au
// texte qu'il avait sous les yeux, et le retour humain qui en sort trois fois de suite est
// toujours le même : « le nouveau prompt de résultat a ce format là, pourquoi n'est-il pas
// appliqué sur ce projet ? », puis « le prompt ne respecte toujours pas le format », puis « le
// format de sortie n'est toujours pas bon, pourquoi ? ». La cause n'était ni l'oracle ni le
// gabarit — les deux étaient à jour — mais la SEULE pièce que personne ne relisait.
//
// LA LEÇON, opposable au-delà de ce fichier : un référentiel versionné qui a un DOUBLE en prose
// ailleurs a deux vérités dès la version suivante. Les trois porteurs de la forme — le gabarit
// (le texte), `oracle-synthese` (le juge) et ce rappel (ce que l'agent lit quand il corrige) —
// se mettent à jour ENSEMBLE ou la doctrine ne s'applique pas. Le même défaut vaut pour la ligne
// des gates de `hook-ouverture.mjs`, corrigée le même jour et pour la même raison.

const RAPPEL = "Réécris ta réponse finale au format gabarits\\RESTITUTION.md (v2.51.0), le compte rendu complet allégé (T2, TF-1947) et son verrou « livré » (T4, TF-1949). Le bloc 0, une synthèse d'ouverture en langage commanditaire (l'état, ce que ça change, ce qui est attendu du lecteur, sans identifiant, chemin ni sha), puis les blocs numérotés de 1 à 9. Les blocs 0, 1, 3, 4, 5, 8 et 9 sont TOUJOURS présents ; un bloc toujours présent sans contenu se dit en une ligne (« Aucune décision ne vous revient. »). Les blocs 2, 6 et 7 ne viennent que s'ils ont un contenu. · 1 En-tête : quoi, sur quoi, date et heure relevées par `date` dans le tour, qui avec sa version ; l'intention de la demande et son test rétro. · 2 Verdict, s'il y en a un : un fait mesuré, un chiffre ou un compteur. · 3 Décisions : chaque D-N réservée avant l'affichage (au pilot `node scripts/reserver-decision.mjs --question \"<la question ?>\"`, chez un produit l'entrée question_humain du ledger), en bloc de citation « > **D-N — <la question ?>** », puis « > - **De quoi s'agit-il** : … », « > - **Le problème** : … », « > - **Pourquoi vous** : … », « > - **Recommandation : (a)** — <pourquoi>. Source consultée : <le document> » ; hors citation, le tableau « | Option | Ce qui se passe | Coût | Retour arrière | », une ligne par option (a), (b), (c) ; puis « > **Sans réponse** : … ». Une décision déjà posée et inchangée se rappelle en une ligne ; si rien n'attend l'humain, le bloc le dit en une ligne. · 4 Traité : chaque puce avec sa preuve exécutée, et la ligne « Relecture d'intention : <sert | sert après N passe(s) | dérive | sans objet, motif> ». · 5 Non traité : chaque puce avec son motif. · 6 Écarts à la lettre, s'il y en a : « vous avez demandé → j'ai fait → pourquoi ». · 7 Risques, s'il y en a : énoncé, signal, parade. · 8 Prochaines actions en UN tableau : sélecteur A-N, identifiant TF-#### ou `neuve`, acteur (auto_ia | manuelle_dev | manuelle_utilisateur), motif de non-exécution ou raison d'impossibilité IA, chemin ou commande, coût de ne pas la faire. · 9 Traces : chemins relatifs vérifiables ; chez un produit, la ligne « Remontée à la factory : rien à remonter. » ou le lot remis. · CE QUI BLOQUE, et rien d'autre : un bloc toujours présent absent (S1) ; une décision sans ses options (S4 : au moins deux options étiquetées, et au format B son tableau) ; chez un produit, une livraison, un produit complet ou une clôture déclarés sans les livrables des forges mobilisées à la dernière demande (S85, le verrou « livré » : `forge/mobilisation.jsonl` contre `references/CARTE-FORGES.json` du pilot ; `node <pilot>/scripts/mobiliser.mjs --verifier` liste ce qui manque), ou sans cette trace à partir du 2026-11-02 (S86) ; un verdict sans fait mesuré (S3) ; une exhaustivité sans « Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments> » (S82, COMPLÉTUDE) ; un écran qui ne reprend pas les blocs 3 et 8 de la synthèse déposée (AFFICHAGE) ; une D-N nouvelle non réservée (RÉSERVATION). Toutes les autres règles du gabarit avertissent sous la réponse, sans réécriture. Un tour qui n'a rien écrit rend une réponse courte, sans restitution (references\\NIVEAUX.md). Préjuge avant d'afficher : `node oracles/hook-restitution.mjs --prejuger <fichier>` (chez un produit : `node forge/hooks/factory.mjs restitution --prejuger <fichier>`), jusqu'à l'exit 0.";

// 01/10/2026 — LE CONTRÔLE AVANT AFFICHAGE. Un hook `Stop` juge APRÈS l'affichage : tout refus
// laisse la version rejetée à l'écran, et la réécriture s'affiche dessous — l'humain lit sa
// réponse deux fois. Une réponse courte (`references\NIVEAUX.md`, niveau Simple) se joue donc
// AVANT d'être rendue : `node oracles/hook-restitution.mjs --pre-vol` lit son texte sur l'entrée
// standard et dit si le juge la refuserait, et pourquoi (mots comptés, verdict, D-N posée).
// 14/10/2026 (TF-1647, TF-1666) — LE PRÉJUGEMENT D'UNE RESTITUTION COMPLÈTE. Le défaut est assumé
// depuis TF-0677 (26/08) : un hook `Stop` juge APRÈS l'affichage, et N refus font N+1 affichages.
// Ce qui se réduit, c'est la FRÉQUENCE. Mesuré le 12/10 chez un produit : les 11 restitutions d'une
// session, rejouées sur fichier, retrouvent exactement les 2 refus rejouables et aucune règle
// bloquante sur les 9 autres ; journal du pilot, 1 393 refus au premier passage sur 4 549 jugements.
// Un brouillon jugé AVANT l'affichage aurait évité les 2 doublons. `--prejuger <brouillon.md>` rend
// le verdict BLOQUANT du hook sur ce texte — mêmes règles, même ensemble `BLOQUANTES`, même dossier
// de projet (`--racine`, donc S48 chez un produit) : exit 0 = affichable. Depuis TF-1720 (15/10/2026),
// il joue aussi l'AFFICHAGE contre la synthèse déposée dans le tour, retrouvée au transcript.
// Chez un produit : `node forge/hooks/factory.mjs restitution --prejuger <brouillon.md>`.
if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes("--prejuger")) {
  const f = process.argv[process.argv.indexOf("--prejuger") + 1];
  if (!f || !existsSync(f)) {
    console.log(JSON.stringify({ outil: "hook-restitution --prejuger", verdict: "ERREUR",
      message: "brouillon introuvable — usage : node oracles/hook-restitution.mjs --prejuger <brouillon.md>" }));
    process.exit(2);
  }
  const brouillon = readFileSync(f, "utf8");
  // TF-1720 — l'AFFICHAGE contre la synthèse que le hook retiendra, choisie de la même façon.
  const iT = process.argv.indexOf("--transcript");
  const cheminT = iT > 1 ? process.argv[iT + 1] : transcriptDeSession();
  let syntheseDeposee = null, affichage = "non joué : transcript de la session introuvable (--transcript <chemin.jsonl>)";
  const ecartsAffichage = [];
  let detail = { applicable: false, verdict: "SANS_OBJET", ecarts: [] };
  let dernierHumainP = "", textePrecedentP = "", relevesP = null;
  try {
    if (cheminT && existsSync(cheminT)) {
      const tour = analyserTranscript(readFileSync(cheminT, "utf8"));
      dernierHumainP = tour.dernierHumain || ""; textePrecedentP = tour.textePrecedent || ""; relevesP = tour.releves || null;
      syntheseDeposee = syntheseDuTour(tour.fichiersMd);
      if (syntheseDeposee) {
        ecartsAffichage.push(...comparerAffiche(brouillon, readFileSync(syntheseDeposee, "utf8")));
        affichage = ecartsAffichage.length ? "FAIL" : "PASS";
      } else affichage = "sans objet : aucune synthèse déposée dans le tour";
      // TF-1851 — le DÉTAIL demandé au dernier message humain de la session, joué sur ce brouillon.
      detail = controlerDetail({ dernierHumain: tour.dernierHumain, dernierTexte: brouillon, textePrecedent: tour.textePrecedent,
        texteSynthese: syntheseDeposee ? readFileSync(syntheseDeposee, "utf8") : "" });
    }
  } catch { affichage = "non joué : transcript ou synthèse illisible"; }
  // TF-1938 — S84 reçoit les relevés d'horloge du tour quand la transcription est retrouvée ; sinon elle rend SANS_OBJET.
  const { fails, averts: avertsOracle } = juger(brouillon, process.cwd(), relevesP);
  const bloquants = fails.filter((x) => estBloquante(x.regle));
  const avertissements = [...fails.filter((x) => !estBloquante(x.regle)), ...avertsOracle];
  // TF-1849 — la RÉSERVATION : chaque D-N nouvelle de ce brouillon est-elle inscrite au registre du produit ?
  const reservation = controlerReservation({ dernierTexte: brouillon, dernierHumain: dernierHumainP, textePrecedent: textePrecedentP, racine: process.cwd() });
  const reservationBloque = reservation.verdict === "FAIL" && reservation.bloquant;
  // TF-1866 — le « oui » à une question de complétude, joué sur ce brouillon dès que le transcript donne le dernier message humain.
  const completude = controlerOuiDeCompletude({ dernierHumain: dernierHumainP, dernierTexte: brouillon });
  // T2 (TF-1947) : DÉTAIL avertit, comme au hook de fin de tour ; AFFICHAGE, COMPLÉTUDE et RÉSERVATION bloquent toujours.
  const refus = [...bloquants.map((x) => `${x.regle} — ${x.message}`),
    ...ecartsAffichage.map((e) => `AFFICHAGE — ce brouillon ne dit pas ce que dit la synthèse déposée ${syntheseDeposee} : ${e}`),
    ...completude.ecarts.map((e) => `COMPLÉTUDE — ${e}. ${RAPPEL_MESURE}`),
    ...(reservationBloque ? reservation.ecarts.map((e) => `RÉSERVATION — ${e}. ${rappelReservation(reservation)}`) : [])];
  console.log(JSON.stringify({ outil: "hook-restitution --prejuger", brouillon: f, affichable: !refus.length,
    bloquants: refus, avertissements: [...avertissements.map(avecEcheance), ...detail.ecarts.map((e) => `DÉTAIL — ${e}`),
      ...(reservation.verdict === "FAIL" && !reservationBloque ? [`RÉSERVATION (bloquante dès le ${echeanceReservation(reservation)}) — ${reservation.ecarts[0]}. ${rappelReservation(reservation)}`] : [])],
    reservation: reservation.applicable ? { verdict: reservation.verdict, bloquant: reservation.bloquant, cible: reservation.cible || "produit", nouvelles: reservation.nouvelles, absentes: reservation.absentes || [], prises: reservation.prises || [] } : `sans objet : ${reservation.motif}`,
    completude: completude.applicable ? completude.verdict : "sans objet : le dernier message humain ne pose pas de question de complétude, ou la réponse ne s'ouvre pas sur un « oui » (ou transcript introuvable)",
    synthese_deposee: syntheseDeposee, affichage,
    detail: detail.applicable ? detail.verdict : "sans objet : le dernier message humain ne demande le détail d'aucune décision connue (ou transcript introuvable)",
    horloge: relevesP ? `S84 jouée sur ${relevesP.tour.length} relevé(s) d'horloge du tour et ${relevesP.session.length} de la session`
      : "S84 non jouée : transcription introuvable (--transcript <chemin.jsonl>). Sur le brouillon seul, seule S69 juge l'heure (une heure future) ; "
        + "qu'une heure passée ait été LUE et qu'une durée ait été MESURÉE ne se voit que dans la transcription",
    non_juge: "les contrôles qui lisent le TOUR et non le texte — GESTE (réponse à un mot de décision), "
      + "PROCÉDURE, POSSESSION, niveau Moyen : le hook de fin de tour les joue sur le transcript (DÉTAIL, TF-1851, est joué ici dès que le transcript est retrouvé) ; un brouillon affiché autrement qu'il a été préjugé n'est plus couvert" }));
  process.exit(refus.length ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes("--pre-vol")) {
  const texte = readFileSync(0, "utf8");
  if (declareMoyen(texte)) {
    // Le pré-vol ne voit pas le tour : il juge la forme. Les effets se relèvent à la fin du tour.
    const { mots, ecarts } = jugerFormeMoyen(texte);
    console.log(JSON.stringify({ outil: "hook-restitution --pre-vol", niveau: "Moyen", mots, rendable_au_niveau_moyen: !ecarts.length,
      ecarts, non_juge: "les effets du tour (écriture, commit, commande à effet) : le hook de fin de tour les relève" }));
    process.exit(ecarts.length ? 1 : 0);
  }
  // TF-1947 (26/10/2026) — le TOUR se relit dans la transcription de la session (`--transcript <chemin.jsonl>`, ou
  // l'identifiant de session que Claude Code passe à ses commandes, comme `--prejuger`, TF-1720) : une réponse courte n'est
  // rendable que si le tour n'a rien écrit, et le pré-vol le dit avant l'affichage au lieu du refus après. Transcription
  // introuvable : le texte seul est jugé, le tour supposé sans écriture, et la sortie le dit (`ecritures_du_tour`).
  const iT = process.argv.indexOf("--transcript");
  const cheminT = iT > 1 ? process.argv[iT + 1] : transcriptDeSession();
  let tour = null;
  try { if (cheminT && existsSync(cheminT)) tour = analyserTranscript(readFileSync(cheminT, "utf8")); } catch { tour = null; }
  const r = jugeable({ travail: tour ? tour.travail : false, ecritures: tour ? tour.ecritures : 0, commandes: tour ? tour.commandes : 0,
    dernierTexte: texte, ecrituresDuTour: tour ? tour.ecrituresDuTour : [] });
  const court = r.juge ? null : controlerReponseCourte({ dernierHumain: tour ? tour.dernierHumain : "", dernierTexte: texte });
  const rendable = !r.juge && !(court && court.verdict === "FAIL");
  console.log(JSON.stringify({ outil: "hook-restitution --pre-vol", mots: texte.trim().split(/\s+/).filter(Boolean).length,
    rendable_sans_restitution: rendable, motif: r.motif, ...(court && court.ecarts.length ? { ecarts: court.ecarts } : {}),
    ecritures_du_tour: tour ? tour.ecrituresDuTour
      : "non relevées : transcription de la session introuvable (--transcript <chemin.jsonl>) — le tour est supposé sans écriture",
    lecture_par_commande: LECTURE_PAR_COMMANDE() }));
  process.exit(rendable ? 0 : 1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const entree = lireStdin();
  const chemin = entree.transcript_path;
  if (!chemin || !existsSync(chemin)) process.exit(0); // rien à juger sans transcript
  const { travail, ecritures, commandes, dernierTexte, textes, fichiersMd, dernierHumain, textePrecedent,
    depuisDernierAffichage, effets, depuis, textesHumains, prejuge, enAttente, releves, ecrituresDuTour: ecrit } = analyserTranscript(readFileSync(chemin, "utf8"));
  const journal = join(ICI, "..", ".claude", "hooks-journal.jsonl");
  const journaliser = (o) => { try { mkdirSync(dirname(journal), { recursive: true }); appendFileSync(journal, JSON.stringify(o) + "\n"); } catch { /* journal facultatif */ } };
  // NIVEAU MOYEN — jugé AVANT le compte d'outils, qu'il remplace par le relevé d'effets.
  let escaladeMoyen = null;
  if (declareMoyen(dernierTexte)) {
    const tousEffets = [...effets, ...effetsGit(entree.cwd || process.cwd(), depuis)];
    if (tousEffets.length) {
      escaladeMoyen = `NIVEAU — réponse déclarée « Niveau : Moyen » dans un tour qui a eu ${tousEffets.length} effet(s) `
        + `(${tousEffets.slice(0, 3).join(" ; ")}) : le tour est jugé Complexe, restitution complète.`;
    } else {
      const { mots, ecarts } = jugerFormeMoyen(dernierTexte);
      journaliser({ ts: new Date().toISOString(), hook: "restitution", session: entree.session_id, ecritures, commandes,
        portee: `niveau Moyen déclaré, aucun effet (${mots} mots)`, verdict: ecarts.length ? "FAIL" : "PASS", niveau: "Moyen",
        ecarts_moyen: ecarts, deja_refuse: !!entree.stop_hook_active });
      if (!ecarts.length) process.exit(0);
      if (entree.stop_hook_active) { afficherReecritureEnDefaut(ecarts.map((e) => `MOYEN — ${e}`)); process.exit(0); }
      console.log(JSON.stringify({ decision: "block", reason: `[hook restitution — niveau Moyen] forme en défaut :\n`
        + ecarts.map((e) => `MOYEN — ${e}`).join("\n") + `\n\n${RAPPEL_MOYEN}` }));
      process.exit(0);
    }
  }
  const portee = escaladeMoyen ? { juge: true, motif: escaladeMoyen }
    : jugeable({ travail, ecritures, commandes, dernierTexte, depuisDernierAffichage, enAttente, ecrituresDuTour: ecrit });
  if (!portee.juge) {
    // TF-1947 — la réponse courte n'est pas jugée sur sa forme ; une exhaustivité qu'elle affirme se mesure (COMPLÉTUDE, S82).
    const court = dernierTexte ? controlerReponseCourte({ dernierHumain, dernierTexte }) : { verdict: "SANS_OBJET", ecarts: [] };
    if (court.verdict !== "FAIL") process.exit(0);
    journaliser({ ts: new Date().toISOString(), hook: "restitution", session: entree.session_id, ecritures, commandes,
      portee: `${portee.motif} — exhaustivité affirmée sans mesure`, verdict: "FAIL", regles: [], bloquantes: [],
      reponse_courte: { ecarts: court.ecarts }, prejuge: !!prejuge, deja_refuse: !!entree.stop_hook_active });
    if (entree.stop_hook_active) { afficherReecritureEnDefaut(court.ecarts); process.exit(0); }
    console.log(JSON.stringify({ decision: "block", reason: `[hook restitution — réponse courte] ${portee.motif}, mais :\n`
      + court.ecarts.join("\n") + `\n\n${RAPPEL_REPONSE_COURTE}\n${RAPPEL_MESURE}` }));
    process.exit(0);
  }
  const { code, fails, averts: avertsOracle } = juger(dernierTexte, entree.cwd || process.cwd(), releves);
  // L'AFFICHÉ DIT CE QUE LE JUGÉ DISAIT : quand une synthèse a été déposée dans le tour, ce qui se
  // TRANCHE doit se retrouver à l'écran. Bloquant, parce qu'une décision absente de l'écran ne peut
  // pas être prise — et la garde anti-boucle empêche qu'un faux positif coûte plus d'une relecture.
  const fichierSynthese = syntheseDuTour(fichiersMd);
  let ecartsAffichage = [], texteSynthese = "";
  try {
    if (fichierSynthese) {
      texteSynthese = readFileSync(fichierSynthese, "utf8");
      ecartsAffichage = comparerAffiche(dernierTexte, texteSynthese);
    }
  } catch { /* fichier illisible : une lecture ratée ne se transforme pas en accusation */ }
  // TF-1019 — le GESTE : ce tour répond-il au mot de décision qui vient d'être reçu, ou rejoue-t-il
  // le tour d'avant ? S'ajoute aux règles existantes, n'en remplace aucune.
  const geste = controlerGeste({ dernierHumain, dernierTexte, textePrecedent, texteSynthese });
  // TF-1361 — la PROCÉDURE : demandée au dernier message, elle rendait S53 bloquante ; avertissante depuis T2 (TF-1947).
  const procedure = controlerProcedure({ dernierHumain, fails });
  // TF-1851 — le DÉTAIL : une D-N dont l'humain demande le détail est reposée en entier, jamais rappelée en une ligne.
  const detail = controlerDetail({ dernierHumain, dernierTexte, textePrecedent, texteSynthese });
  // TF-1849 — la RÉSERVATION : une D-N nouvelle du bloc 3 est inscrite au registre du produit avant l'affichage.
  // Avertissante jusqu'à RESERVATION_BLOQUANTE_DES, bloquante ensuite (mesure d'entrée : gabarit RESTITUTION.md 2.45.0).
  const reservation = controlerReservation({ dernierTexte, dernierHumain, textePrecedent, racine: entree.cwd || process.cwd() });
  const reservationBloque = reservation.verdict === "FAIL" && reservation.bloquant;
  // TF-1866 — le « oui » à une question de complétude porte sa ligne « Mesuré sur » (S82 juge le texte, ce contrôle lit le message humain). Bloquant.
  const completude = controlerOuiDeCompletude({ dernierHumain, dernierTexte });
  // TF-1514 — la POSSESSION : « seul l'humain la détient », contredit par un message humain de la session.
  // Avertissement seulement : il rejoint la liste des règles non bloquantes.
  const possession = controlerPossession({ textesHumains, dernierTexte });
  // TF-1641 — l'EXPLICATION demandée vit dans une fiche. Avertissement seulement.
  const explication = controlerExplication({ dernierHumain, dernierTexte, fichiersMd });
  const bloquants = fails.filter((f) => estBloquante(f.regle));
  // T2 (TF-1947, 26/10/2026) : GESTE, PROCÉDURE et DÉTAIL avertissent ; ce qui bloque encore est dit à `BLOQUANTES`.
  const avertissements = [...fails.filter((f) => !estBloquante(f.regle)), ...avertsOracle,
    ...geste.ecarts.map((e) => ({ regle: "GESTE", statut: "FAIL", message: `${e}. ${RAPPEL_GESTE}` })),
    ...procedure.ecarts.map((e) => ({ regle: "PROCÉDURE", statut: "FAIL", message: `${e} ${RAPPEL_PROCEDURE}` })),
    ...detail.ecarts.map((e) => ({ regle: "DÉTAIL", statut: "FAIL", message: `${e}. ${RAPPEL_DETAIL}` })),
    ...possession.ecarts.map((e) => ({ regle: "POSSESSION", statut: "FAIL", message: e })),
    ...explication.ecarts.map((e) => ({ regle: "EXPLICATION", statut: "FAIL", message: e })),
    ...(reservation.verdict === "FAIL" && !reservationBloque
      ? reservation.ecarts.map((e) => ({ regle: "RÉSERVATION", statut: "FAIL", message: `${e} — bloquante dès le ${echeanceReservation(reservation)}. ${rappelReservation(reservation)}` })) : [])];
  // TF-1081 — le sceau suit le PASS, et seulement sur la synthèse que le tour a ÉCRITE.
  const passe = code === 0 && !ecartsAffichage.length && geste.verdict !== "FAIL" && possession.verdict !== "FAIL"
    && explication.verdict !== "FAIL" && detail.verdict !== "FAIL" && reservation.verdict !== "FAIL" && completude.verdict !== "FAIL";
  const sceau = passe ? scellerSynthese(syntheseEcriteDuTour(fichiersMd)) : null;
  try {
    mkdirSync(dirname(journal), { recursive: true });
    appendFileSync(journal, JSON.stringify({
      ts: new Date().toISOString(), hook: "restitution", session: entree.session_id, ecritures, commandes,
      portee: portee.motif,
      verdict: passe
        ? "PASS" : ((bloquants.length || ecartsAffichage.length || completude.verdict === "FAIL" || reservationBloque)
          ? "FAIL" : "AVERTISSEMENT"),
      regles: fails.map((f) => f.regle), bloquantes: bloquants.map((f) => f.regle),
      synthese_deposee: fichierSynthese || null, ecarts_affichage: ecartsAffichage, sceau,
      ...(geste.applicable ? { geste: { decision: geste.decision, verdict: geste.verdict, ecarts: geste.ecarts } } : {}),
      ...(procedure.applicable ? { procedure: { verdict: procedure.verdict, ecarts: procedure.ecarts } } : {}),
      ...(detail.applicable ? { detail: { decision: detail.decision, verdict: detail.verdict, ecarts: detail.ecarts } } : {}),
      ...(reservation.applicable ? { reservation: { verdict: reservation.verdict, bloquant: reservation.bloquant, cible: reservation.cible || "produit", nouvelles: reservation.nouvelles, absentes: reservation.absentes || [], prises: reservation.prises || [] } } : {}),
      ...(completude.applicable ? { completude: { verdict: completude.verdict, ecarts: completude.ecarts } } : {}),
      ...(possession.applicable ? { possession: { verdict: possession.verdict } } : {}),
      ...(explication.applicable ? { explication: { verdict: explication.verdict } } : {}),
      prejuge: !!prejuge,
      deja_refuse: !!entree.stop_hook_active,
    }) + "\n");
  } catch { /* journal facultatif */ }
  if (passe) {
    // T4 (TF-1949) : un constat AVERT de l'oracle (S72 sous le verrou « livré ») se dit sous une réponse conforme, sans refus.
    if (avertsOracle.length) console.log(JSON.stringify({ systemMessage: `[restitution — R-44] avertissement${avertsOracle.length > 1 ? "s" : ""} non bloquant${avertsOracle.length > 1 ? "s" : ""} : `
      + avertsOracle.map((f) => `${f.regle} — ${f.message}`).join(" · ") + " (structure conforme : rien n'est réécrit, le verdict est journalisé)" }));
    process.exit(0);
  }
  // Avertissements seuls : dits sous la réponse, jamais réécrits — pas de doublon à l'écran.
  if (!bloquants.length && !ecartsAffichage.length && completude.verdict !== "FAIL" && !reservationBloque) {
    console.log(JSON.stringify({
      systemMessage: `[restitution — R-44] avertissement${avertissements.length > 1 ? "s" : ""} non bloquant${avertissements.length > 1 ? "s" : ""} : ` +
        avertissements.map((f) => `${avecEcheance(f)} — ${f.message}`).join(" · ") +
        " (structure conforme : rien n'est réécrit, le verdict est journalisé)",
    }));
    process.exit(0);
  }
  if (entree.stop_hook_active) {
    // Déjà refusé une fois : pas de second refus (pas de boucle), mais la réécriture est JUGÉE et
    // son verdict DIT à l'humain (TF-1739).
    afficherReecritureEnDefaut([
      ...bloquants.map((f) => `${f.regle} — ${f.message}`),
      ...ecartsAffichage.map((e) => `AFFICHAGE — ${e}`),
      ...completude.ecarts.map((e) => `COMPLÉTUDE — ${e}`),
      ...(reservationBloque ? reservation.ecarts.map((e) => `RÉSERVATION — ${e}`) : []),
    ]);
    process.exit(0);
  }
  const motifs = [
    // TF-1947 — pourquoi le tour est jugé : une réponse courte refusée apprend ce que son tour a écrit.
    ...(escaladeMoyen ? [escaladeMoyen] : [`Jugé parce que : ${portee.motif}.`]),
    ...bloquants.map((f) => `${f.regle} — ${f.message}`),
    ...ecartsAffichage.map((e) => `AFFICHAGE — ton message affiché ne dit pas ce que la synthèse déposée disait : ${e}. `
      + `Le document jugé est ${fichierSynthese} : reprends-en le bloc 3 en entier plutôt qu'une version abrégée.`),
    ...completude.ecarts.map((e) => `COMPLÉTUDE — ${e}. ${RAPPEL_MESURE}`),
    ...(reservationBloque ? reservation.ecarts.map((e) => `RÉSERVATION — ${e}. ${rappelReservation(reservation)}`) : []),
    ...(prejuge ? [] : [RAPPEL_PREJUGEMENT]),
  ].join("\n");
  const enPlus = avertissements.length ? `\n(à corriger au passage, non bloquant : ${avertissements.map(avecEcheance).join(", ")})` : "";
  console.log(JSON.stringify({ decision: "block", reason: `[hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale :\n${motifs}${enPlus}\n\n${RAPPEL}` }));
  process.exit(0);
}
