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
 * tour), l'arrêt est accepté — une seconde réécriture n'est pas imposée, le verdict est journalisé.
 *
 * Ce qui est un tour de TRAVAIL (et donc une restitution) : au moins une écriture (Write, Edit,
 * MultiEdit, NotebookEdit) ou au moins quatre commandes (Bash, PowerShell) depuis le dernier
 * message humain. Un tour de lecture ou de conversation n'est pas jugé.
 *
 * TF-0904 (08/09/2026) — ET DEPUIS, UN VERDICT SANS ÉCRITURE L'EST AUSSI. Le critère ci-dessus
 * mesure l'EFFORT ; `RESTITUTION.md` régit « tout message de fin de traitement », c'est-à-dire la
 * NATURE de ce qui est rendu. Un message final est donc jugé aussi quand il porte un VERDICT ou
 * dépasse 150 mots, écriture ou pas (fonction `jugeable`) ; les exemptions — accusé de réception,
 * réponse courte, question rendue à l'humain — sont écrites au §Portée du gabarit.
 */
import { readFileSync, writeFileSync, mkdtempSync, appendFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-synthese.mjs");
const ECRITURES = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);
const COMMANDES = new Set(["Bash", "PowerShell"]);

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
  let outils = 0;
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
        } else if (COMMANDES.has(b.name)) { commandes++; commandesIdx.push(outils - 1); }
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
  // tort s'apprend à contourner (R-33 bis).
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
    effets: detecterEffets(segment) };
}

// ---- NIVEAU MOYEN (étape 2 des niveaux d'intervention, en essai depuis le 01/10/2026) ----------
//
// LE FAIT. Une question de diagnostic (« pourquoi… », « où en est… ») part en recherche : dix
// commandes de lecture, aucune écriture. Le compte d'outils (4 commandes = tour de travail) la juge
// comme un tour de travail et lui impose 8 blocs. Mesuré le 21/09 : 1 683 mots rendus là où 124
// suffisaient (étude `output/03-etudes/20260925-etude-opportunite-niveaux-d-intervention.md`).
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
        const v = cmd.match(VERBES_EFFET);
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
      ecarts.push("une D-N posée au niveau Moyen porte sa recommandation et son tableau « | Option | Coût | Exclusions | »");
  }
  return { mots, ecarts };
}

const RAPPEL_MOYEN = "Réécris ta réponse au niveau Moyen (references\\NIVEAUX.md) : première ligne « Niveau : Moyen », "
  + "puis 4 pièces dans cet ordre, chacune ouverte par son titre en gras : **La réponse.** (150 mots au plus, ouverte sur "
  + "le oui, le non ou le fait demandé) ; **Preuves.** (3 à 6 lignes, une commande et sa sortie, ou un chemin et sa ligne) ; "
  + "**Non vérifié.** ; **Décision attendue.** (« Aucune. » ou une D-N complète, recommandation et tableau d'options). "
  + "400 mots au plus. Pas de blocs numérotés.";

export function analyserTranscript(texte) {
  const entrees = texte.split(/\r?\n/).filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter((e) => e && !e.isSidechain);
  const humains = [];
  for (let i = 0; i < entrees.length; i++) if (estHumain(entrees[i])) humains.push(i);
  const debut = humains.length ? humains[humains.length - 1] : -1;
  const m = mesurerSegment(entrees.slice(debut + 1));
  // TF-1019 — les deux pièces que le contrôle GESTE réclame et que personne ne lisait : le DERNIER
  // message humain (celui auquel la réponse répond) et le texte final du tour PRÉCÉDENT (celui que
  // la réponse ne doit pas être). Sans second message humain, le segment d'avant commence au début
  // du transcript : c'est bien le tour qui précède, et il n'y en a pas d'autre.
  const avant = humains.length >= 2 ? humains[humains.length - 2] : -1;
  const textePrecedent = debut >= 0 ? mesurerSegment(entrees.slice(avant + 1, debut)).dernierTexte : "";
  const dernierHumain = debut >= 0 ? texteDe(entrees[debut]) : "";
  const depuis = debut >= 0 ? entrees[debut].timestamp || null : null;
  return { travail: m.ecritures >= 1 || m.commandes >= 4, ...m, dernierHumain, textePrecedent, depuis };
}

export function juger(texte) {
  const dir = mkdtempSync(join(tmpdir(), "restitution-"));
  const f = join(dir, "message.md");
  writeFileSync(f, texte, "utf8");
  const r = spawnSync(process.execPath, [ORACLE, f], { encoding: "utf8" });
  let rapport = {};
  try { rapport = JSON.parse(r.stdout); } catch { /* jugé par le code */ }
  return { code: r.status, fails: (rapport.findings || []).filter((x) => x.statut === "FAIL") };
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
const replisDe = (t) => (bloc3De(t).match(/si rien n(?:'|’)est d[ée]cid|sans d[ée]cision|option par d[ée]faut/gi) || []).length;

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
const choisirParmi = (chemins) => {
  const marques = [];
  for (let i = chemins.length - 1; i >= 0; i--) if (estMarque(chemins[i])) marques.push(chemins[i]);
  const nomme = marques.find((c) => /synth[eè]se|restitution/i.test(String(c).split(/[\\/]/).pop()));
  return nomme || marques[0] || null;
};

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
    ecarts.push("le bloc 3 du fichier jugé porte le TABLEAU DES OPTIONS (« Option | Coût | Exclusions ») ; "
      + "l'écran l'a remplacé par de la prose — le coût et l'exclusion de chaque voie ne sont plus lisibles (S31)");
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
// lecteur croire qu'il n'a pas décidé :
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
// la procédure — le moment exact où un tableau de plus coûte une redemande de plus.
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

const RAPPEL_PROCEDURE = "Une procédure demandée reçoit un guide EN TÊTE, avant le bloc 0 : « ## Guide — <ce que vous allez "
  + "faire> », la source officielle et la date où tu l'as lue, puis des étapes numérotées, chacune close par « Ce que vous "
  + "devez voir : … » ; le bloc 0 garde alors son titre « ## 0. Synthèse d'ouverture ».";

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

export function jugeable({ travail, ecritures = 0, commandes = 0, dernierTexte, depuisDernierAffichage = null }) {
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
  if (travail) return { juge: true, motif: `tour de travail (${ecritures} écriture(s), ${commandes} commande(s))` };
  // Une QUESTION rendue à l'humain n'est pas une restitution : c'est `bloque_question`, et la
  // doctrine la veut courte. L'exempter explicitement vaut mieux que de la laisser au seuil.
  if (/\?\s*$/.test(dernierTexte.trim()) && mots <= 60) return { juge: false, motif: `question rendue à l'humain (${mots} mots)` };
  if (VERDICT.test(dernierTexte)) return { juge: true, motif: `message portant un VERDICT (${mots} mots, sans écriture)` };
  if (mots >= SEUIL_MOTS) return { juge: true, motif: `message de ${mots} mots rendu à l'humain (sans écriture)` };
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
  return { juge: false, motif: `${mots} mots, aucun verdict, aucune D-N ni A-N — accusé de réception, réponse courte ou « rien de neuf » (exemption §Portée)` };
}

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
const BLOQUANTES = new Set(["S1", "S3", "S4", "S6"]);

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

const RAPPEL = "Réécris ta réponse finale au format gabarits\\RESTITUTION.md (v2.33.0) : bloc 0 « synthèse d'ouverture » en langage commanditaire (≥ 20 mots, sans identifiant, chemin ni sha — l'état, ce que ça change, ce qui est attendu du lecteur), puis les 8 blocs numérotés, aucun omis (un bloc vide se dit en une ligne). · 1 en-tête (quoi · sur quoi · date ET heure avec fuseau + durée · qui avec version) · 2 verdict en une ligne FACTUEL (un chiffre, un compteur) · 3 décisions attendues de l'humain, EN TÊTE, chacune en BLOC DE CITATION et dans cet ordre exact : « > **D-N — <la question, posée comme une question, avec son point d'interrogation>** » (N continu dans la session, jamais remis à 1), puis le rappel du sujet en prose (≥ 25 mots, sans identifiant nu — 12 mots si un chapeau commun d'au moins 40 mots ouvre le bloc), puis « > **Recommandation : (a).** Source consultée : <le document d'où sort la réponse proposée> » et pourquoi ; PUIS, hors de la citation et pleine largeur, le tableau des options « | Option | Coût | Exclusions | », une ligne par (a)/(b)/(c) ; PUIS « > **Si rien n'est décidé** : (c) … ». Si rien n'attend l'humain, le dire en une ligne · 4 traité, chaque puce avec sa preuve (oracle, verdict, chiffre) · 5 non traité, chaque puce avec son motif · 6 écarts à la lettre (« vous avez demandé → j'ai fait → pourquoi », ou « aucun écart ») · 7 risques (énoncé + signal + parade) · 8 prochaines actions en UN TABLEAU UNIQUE, l'acteur en COLONNE et jamais en section, trié auto_ia d'abord — chaque action porte son sélecteur **A-N** distinct (jamais un numéro nu : un « 3 » nu ne dit pas s'il désigne la décision 3 ou l'action 3), son identifiant stable TF-#### ou la mention `neuve`, son acteur (auto_ia | manuelle_dev | manuelle_utilisateur), le motif de non-exécution si auto_ia (gate_gouvernance | dependance_bloc_3 | garde_fou | borne_atteinte | dependance_externe | hors_mandat), la raison d'impossibilité IA si elle est laissée à l'humain (acces | decision | depense | presence | irreversible, non accentués — et pour acces comme pour presence, la TRACE MESURÉE de la tentative : code de réponse, message d'erreur, sortie de commande), un chemin ou une commande qui la rend exécutable telle quelle, et ce qu'il en coûte de NE PAS la faire · 9 traces (chemins relatifs et vérifiables). Puces ≤ 2 niveaux. Un renvoi nomme son sujet ou son sélecteur, jamais une position (« ligne 5 » est un défaut). Effort en complexité × durée, jamais en jours. · v2.16.0 (02/09) : une action manuelle_utilisateur ne demande jamais à l'humain de CRÉER, AJOUTER ou ÉCRIRE une ligne, une variable ou un fichier (geste d'agent, seule la VALEUR lui reste) ; une preuve du bloc 4 est une sortie exécutée, jamais « préparé » ni « voir A-N » ; toute page HTML citée comme livrée porte le verdict de la critique d'implémentation (forge-design) ; une correction restituée nomme son contrôle rouge → vert ou sa classe. · v2.17.0 (08/09) : CE MESSAGE EST LE FICHIER JUGÉ, jamais son résumé — quand une synthèse a été déposée dans le tour, le message affiché reprend ses blocs 3 et 8 EN ENTIER (tableau des options, sélecteurs A-N, acteurs du vocabulaire gelé auto_ia | manuelle_dev | manuelle_utilisateur) ; la LONGUEUR n'est pas un motif de condensation, et un fichier PASS paraphrasé à l'écran ne protège aucun lecteur. · v2.18.0 (08/09) : LE VERDICT AFFICHÉ MESURE CE QUE LE FICHIER JUGÉ MESURE — une restitution n'est pas un fil d'avancement : si l'écran a été enrichi au fil du tour (un rapport reçu, un compteur qui monte), c'est le FICHIER qu'il faut redéposer, jamais l'écran qu'il faut appauvrir ; la trace est la pièce opposable, et une pièce périmée ment à tous ceux qui la reliront. · v2.19.0 (08/09) : UN TEST JOUABLE S'EXÉCUTE — une action de TEST auto_ia (recette, banc, couverture, self-test) ne se laisse pas non exécutée sous `hors_mandat` ni `borne_atteinte` : ces deux motifs déclarent un périmètre que tu écris seul, ils ne mesurent rien ; joue la recette, ou nomme l'obstacle EXTÉRIEUR qui la bloque (dependance_bloc_3, gate_gouvernance, garde_fou, dependance_externe). Et « REMONTÉ » N'EST PAS « TRAITÉ » : une remontée annoncée au bloc 4 porte son identifiant TF-####, sans quoi le lecteur ne peut ni la retrouver ni savoir si quelqu'un l'a prise — elle vaut alors « déposé, non traité » et appartient au bloc 5 avec son motif. · v2.20.0 (08/09) : LA FORME DATÉE EN TÊTE EST RÉSERVÉE AUX ÉTUDES — un livrable cité sous `output\\` porte « <Marque> - <Objet> - AAAAMMJJ<indice>.<ext> » (R-4) ; le préfixe « AAAAMMJJ-… » n'appartient qu'à `output\\03-etudes\\`, et onze livrables d'un mandat sont sortis hors R-4 le 07/09 pour l'avoir imité. Et QUAND LA DOCTRINE RÉGIT LE MOT, C'EST ELLE LA SOURCE : une décision qui parle d'une version remplacée, d'un `old\\`, d'un livrable à supprimer ou à renommer cite REGLES-PROJET.md, CLAUDE.md, ETAPES-RUN.md ou la règle numérotée qui la tranche — sourcer par un fichier du chantier une question que la doctrine a déjà tranchée, c'est poser une question qui n'avait pas à l'être. · v2.21.0 (11/09) : UN MOT DE DÉCISION REÇOIT LA PREUVE DU GESTE — quand le message humain qui précède est un sélecteur de décision (« 11a », « D-11 (a) », « 32b, 30a »), il tranche et n'attend plus d'analyse : ton bloc 4 porte la preuve exécutée du geste que l'option choisie commandait, ton bloc 3 ne repose JAMAIS la même D-N, et ta réponse n'est jamais la restitution précédente rejouée mot pour mot — le 11/09 la synthèse de la veille a été renvoyée deux fois à l'identique après deux « 11a », et le geste n'est venu que deux heures plus tard (TF-1019). · v2.22.0 (16/09) : AUCUNE EXEMPTION NE S'APPLIQUE À UN TOUR DE TRAVAIL — la jugeabilité est une propriété du TOUR, la longueur et le vocabulaire sont des propriétés du MESSAGE, et un tour qui a écrit, commité ou lancé une exécution se restitue en entier même en cent mots (TF-0978). Si son résultat n'est PAS ENCORE MESURABLE, la forme n'est pas l'exemption mais le POINT D'ÉTAPE, qui se déclare en bloc 1 : blocs 1, 4 et 8 pleins, bloc 2 remplacé par « ce qui reste à mesurer, et par quoi », les autres admis en une ligne (TF-0979). Un tour qui n'apporte RIEN DE NEUF rend un accusé de trois lignes — ce qui est arrivé, ce que cela ne change pas, ce qui reste attendu de vous — et cette exemption exige les TROIS absences : aucun verdict, aucune D-N, aucune A-N (TF-0990). Quand la demande citée au bloc 6 porte un MOT D'EXCLUSIVITÉ (uniquement, seulement, exclusivement, rien que, only), le bloc 6 dit ce que le livrable contient EN PLUS du périmètre nommé, ou qu'il ne contient rien d'autre (S44, TF-0988). Quand un traitement est ARRÊTÉ — un élément du bloc 5 motivé par garde_fou, dependance_bloc_3, dependance_externe ou gate_gouvernance —, le bloc 3 s'ouvre par une ligne portant le mot « bloquants » puis leur inventaire, chaque entrée disant ce qui est bloqué, ce qu'il faut fournir pour le lever et ce qui se passe si rien n'est fourni, sans renvoi à un fichier ni à une autre section (S45, TF-1127). Un SECRET cité se désigne par ses cinq premiers caractères et sa longueur, relevés depuis l'exécution qui le porte, jamais par sa valeur ni par rien (TF-0986). · v2.23.0 (17/09) : CHEZ UN PRODUIT, LE TOUR DIT CE QU'IL REMONTE À LA FACTORY — une ligne au bloc 9, « Remontée à la factory : rien à remonter. » ou « Remontée à la factory : lot « <produit> - RETOURS - AAAAMMJJ<indice> » remis. » ; « rien à remonter » est une réponse valide, le silence et « à voir » ne le sont pas, parce que ne rien remonter et n'avoir rien à remonter sont indiscernables sans elle (S48, TF-1166 ; sans objet au pilot et dans une forge). · v2.24.0 (17/09) : UNE OPTION QUI COMMANDE UN GESTE HUMAIN DIT COMMENT LE FAIRE — toute option du bloc 3 portant un verbe de geste (se connecter, s'authentifier, saisir, coller, taper, cliquer, installer, ouvrir un terminal, lancer ou exécuter une commande, valider un second facteur, publier ou pousser soi-même, renouveler un jeton) porte SUR PLACE de quoi l'exécuter : la commande ou le chemin entre accents graves, le libellé de l'écran à ouvrir, ou une ligne « Comment faire : 1) … 2) … 3) … » dans le groupe de la décision (en tableau, une colonne « Comment faire » suffit) ; le mode opératoire écrit soixante lignes plus bas au bloc 8 ne sert pas au lecteur, qui tranche ici (S49, TF-1172). · v2.25.0 (17/09) : LE POINT D'ÉTAPE EST UNE FORME JUGÉE, ET ELLE EST RECONNUE — un tour de travail dont le résultat n'est pas encore mesurable se déclare « point d'étape » AU BLOC 1 ; son bloc 2 porte alors « ce qui reste à mesurer, et par quoi » — la mesure attendue ET l'outil qui la rendra, une commande, un oracle ou un fichier — à défaut d'un verdict chiffré (S3, second sens), et ses blocs 1, 4 et 8 restent PLEINS (S50) : déclarer la forme sans rien mettre dans le traité serait une exemption déguisée en forme jugée. Un RELAIS d'avancement — l'émission d'un agent de campagne répercutée à l'humain — n'est plus jugé comme un rendu de fin de tour quand RIEN n'a été écrit depuis ton dernier affichage : trois lignes suffisent, et la synthèse déposée ne se reprend pas en entier à chaque relais (TF-1182). La borne n'est pas la longueur : une seule écriture depuis le dernier affichage, un verdict, une D-N ou une A-N, et le message redevient un rendu, jugé comme tel. · v2.26.0 (17/09) : TON BLOC 1 DIT L'INTENTION DE LA DEMANDE ET SON TEST RÉTRO — une phrase pour l'intention initiale (à quoi le travail devait servir, pas ce qu'il fallait faire), puis « Test rétro : » qui dit si le résultat sert cette intention ou seulement la lettre de la consigne ; un écart s'écrit au bloc 6. Loi transverse n° 7, `references\\INTENTION.md` : le 01/09 une étude conforme à sa définition et verte à tous ses contrôles a été refusée par son destinataire, sept questions sans réponse (S51, TF-0791). · v2.27.0 (19/09) : UN REFUS PROUVE QU'UNE PORTE EST FERMÉE, JAMAIS QU'IL N'Y EN A QU'UNE — une incapacité d'accès que tu déclares porte les CODES DE RETOUR DE DEUX FAMILLES de chemins au moins (un préfixe d'URL ou un scope distinct, pas une variante du même : `…/myorg/groups/…` et `…/myorg/reports/…` sont deux familles, `…/groups/{id}/reports` et `…/groups/{id}/reports/{id}` n'en sont qu'une), ou elle CITE LA SOURCE qui établit qu'un seul chemin existe ; les formules « seule voie » et « aucun autre chemin » ne valent plus preuve à elles seules, et dès que tu cites des appels ce sont eux qui font foi (S25 durcie, TF-1189 : quatre appels d'une même famille plus la formule ont fait écrire un constat FAUX dans deux synthèses jugées PASS, le scope personnel rendant 200 là où l'espace de travail rendait 401). · v2.28.0 (27/09) : UNE ACTION SUR L'INTERFACE D'UNE PLATEFORME TIERCE SE DÉCRIT D'APRÈS SA DOCUMENTATION DU JOUR, ET ELLE SE GUIDE EN TÊTE — toute action du bloc 8 laissée à l'humain qui vise l'écran d'une plateforme de `gabarits\\PLATEFORMES-TIERCES.json` (une adresse d'écran, ou son nom hors code avec un bouton, un onglet, des réglages, un « cliquer ») cite dans sa ligne sa SOURCE OFFICIELLE et la DATE où tu l'as lue, « source : <adresse de la documentation>, lue le JJ/MM/AAAA » (S52, D-24 (b), TF-1362 : le 22/09 un bouton « Prévisualiser » nommé de mémoire là où l'écran offre « Aperçu », et trois gestes d'accès supprimés par la plateforme le 09/09 prescrits quand même) ; et si l'action est laissée à manuelle_utilisateur, le message S'OUVRE sur « ## Guide — <ce que vous allez faire> », AVANT le bloc 0 alors titré « ## 0. Synthèse d'ouverture » : des étapes numérotées, chacune close par « Ce que vous devez voir : … » (S53, TF-1361 : la procédure a été redemandée cinq fois en 56 minutes tant qu'elle vivait en cellules de tableau). S53 est BLOQUANTE quand le dernier message humain demande la procédure. Ce que seule la plateforme fournit — un modèle d'import, un rapport d'erreurs — se demande dans le tour qui prépare le dépôt, jamais après l'échec. · v2.29.0 (28/09) : UNE BARRE VERTICALE DANS UNE CELLULE DE TABLEAU S'ÉCHAPPE — une colonne se lit dans la ligne telle que GFM la découpe, barre échappée (`\|`) comprise ; un refus sur une ligne coupée nomme la coupure au lieu d'accuser la colonne voisine (S18, S12, TF-1427 : le 25/09 une cellule portant `2>/dev/null || echo 0` a coupé la ligne à l'affichage, et l'action a été accusée à tort d'être laissée à l'humain « sans raison d'impossibilité »). · v2.30.0 (28/09) : LES IDENTIFIANTS DU REGISTRE PRODUIT ET DU LOT DE RETOURS SONT RECONNUS, ET « NEUVE » SE DÉCLARE — un identifiant qualifié (« registre A-18 ») ou posé dans une colonne Registre hors de la cellule du sélecteur vaut identifiant, de même que le numéro d'une remontée de lot (« RT-2 ») ; un « A-18 » nu reste un sélecteur ou un renvoi, et la mention « neuve » ne se lit plus dans une prose qui parle d'autre chose (« un clone neuf ») — elle se déclare entre accents graves, « `neuve` » (S14, S39, TF-1428, TF-1449 : le 25/09 « A-18 » en colonne Registre a été refusé, et le 28/09 une restitution de clôture a échoué sur ses identifiants réels). · v2.31.0 (28/09) : UNE DÉCISION DÉJÀ POSÉE ET INCHANGÉE SE RAPPELLE EN UNE LIGNE, ELLE NE SE REPOSE PAS — « **D-N** : <son sujet en trois mots au moins>, posée le JJ/MM à HH:MM, inchangée », sans option ni question, compte comme RAPPELÉE et non redemandée ; une décision NOUVELLE garde son choix fermé, même posée à côté d'un rappel (S4, TF-1429 : le 25/09 « à décider : D-6, posée à 14:20 » a été refusé faute de sujet et de « inchangée », et la même décision a été reposée mot pour mot dans 8 restitutions du jour). · v2.32.0 (01/10) : UN PARAGRAPHE DE PROSE S'ÉCRIT SUR UNE SEULE LIGNE SOURCE — la synthèse d'ouverture, la prose des blocs et l'introduction du guide ne se coupent jamais à la main, une ligne vide sépare deux paragraphes : le chat de l'extension VS Code rend chaque saut de ligne, et un paragraphe coupé vers 100 caractères s'y affiche en colonne étroite au lieu d'occuper la largeur (S54, TF-1494 : une restitution renvoyée le 29/09 pour ce seul défaut, capture à l'appui) ; les listes, les tableaux, les citations et le code gardent leur forme. UN FEU VERT DE PRODUCTION DIT CE QU'IL NE VÉRIFIE PAS — quand ton verdict donne un feu vert de mise en production ou que tu remets un guide de lancement, une ligne « Ne vérifie pas : … » suit le feu vert, au verdict comme au guide (S55, TF-1493 : le 28/09 un plan approuvé sur son seul compte portait une date refusée à l'application) ; ET IL REPOSE SUR LES PORTES DU JOUR — la sortie des portes qui jugent une base externe (audit des dépendances, scan d'image), rejouée sur ce qui sera lancé, datée du jour et chiffrée, « `npm audit` rejoué le JJ/MM à HHhMM : 0 vulnérabilité élevée », ou la déclaration « aucune porte de la chaîne ne juge une base externe » (S56, TF-1498 : le 30/09 trois avis publiés dans la nuit ont arrêté une livraison que la qualification de la veille avait laissée passer). UN CHEMIN DE LIVRABLE CITÉ TIENT EN 116 CARACTÈRES, sous `output\\` comme sous le `forge\\` d'un produit — chemin relatif + 34 de sidecar d'oracle ≤ 150, raccourcis l'objet du nom (S42, TF-1500 : le 30/09 `git worktree add` a échoué 2 fois sur une synthèse de 154 caractères). UNE OPTION QU'UNE CONTRAINTE CONNUE REND IMPOSSIBLE LE DIT dans sa colonne Exclusions, en citant la contrainte — garde-fou de plateforme (`references\\GARDE-FOUS-PLATEFORME.json`), décision humaine, parole de l'humain inscrite —, au lieu de se présenter comme plus chère (TF-1496 : le 21/09 l'option retenue sur son coût heurtait une stratégie déjà écrite, et la livraison a été refusée le 29/09). UN DOCUMENT TENU OUVERT N'EST PAS UN BLOQUANT ET NE DEVIENT JAMAIS UNE QUESTION — la nouvelle version sort à l'indice suivant ; dis au bloc 4 que l'ancienne, tenue ouverte, n'a pas pu être déplacée et qu'elle le sera au tour suivant ; au bloc 8, `auto_ia`, motif `dependance_externe` avec l'application nommée ; ni décision, ni inventaire des bloquants, ni action manuelle_utilisateur « fermer le document », et l'application de l'utilisateur n'est jamais quittée (TF-1503, décision humaine du 30/09 : « Ne pose plus la question sur les documents ouverts »). · v2.33.0 (01/10) : LE BLOC 3 NE PORTE QUE CE QUI REVIENT À L'HUMAIN (R-58) — une décision n'est posée que si elle porte un motif depense, publication, irreversible, doctrine, arbitrage (préférence du porteur entre options réellement concurrentes) ou produit ; sinon tu exécutes l'option recommandée dans le tour et tu la rends pour information, au bloc 4 si elle est faite, au bloc 8 en auto_ia si elle va l'être. ET UNE VOIE PROPOSÉE SE RELIT CONTRE LE PROCESSUS DU COMMANDITAIRE ÉTAPE PAR ÉTAPE ET ACTEUR PAR ACTEUR : une option qui ajoute une étape absente du processus décrit par l'humain est exclue (réponse humaine « 42a » du 01/10 : 7 retours humains en 4 heures chez un produit pour une étape ajoutée 2 fois).";

// 01/10/2026 — LE CONTRÔLE AVANT AFFICHAGE. Un hook `Stop` juge APRÈS l'affichage : tout refus
// laisse la version rejetée à l'écran, et la réécriture s'affiche dessous — l'humain lit sa
// réponse deux fois. Une réponse courte (`references\NIVEAUX.md`, niveau Simple) se joue donc
// AVANT d'être rendue : `node oracles/hook-restitution.mjs --pre-vol` lit son texte sur l'entrée
// standard et dit si le juge la refuserait, et pourquoi (mots comptés, verdict, D-N posée).
if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes("--pre-vol")) {
  const texte = readFileSync(0, "utf8");
  if (declareMoyen(texte)) {
    // Le pré-vol ne voit pas le tour : il juge la forme. Les effets se relèvent à la fin du tour.
    const { mots, ecarts } = jugerFormeMoyen(texte);
    console.log(JSON.stringify({ outil: "hook-restitution --pre-vol", niveau: "Moyen", mots, rendable_au_niveau_moyen: !ecarts.length,
      ecarts, non_juge: "les effets du tour (écriture, commit, commande à effet) : le hook de fin de tour les relève" }));
    process.exit(ecarts.length ? 1 : 0);
  }
  const r = jugeable({ travail: false, dernierTexte: texte });
  console.log(JSON.stringify({ outil: "hook-restitution --pre-vol", mots: texte.trim().split(/\s+/).filter(Boolean).length,
    rendable_sans_restitution: !r.juge, motif: r.motif }));
  process.exit(r.juge ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const entree = lireStdin();
  const chemin = entree.transcript_path;
  if (!chemin || !existsSync(chemin)) process.exit(0); // rien à juger sans transcript
  const { travail, ecritures, commandes, dernierTexte, textes, fichiersMd, dernierHumain, textePrecedent,
    depuisDernierAffichage, effets, depuis } = analyserTranscript(readFileSync(chemin, "utf8"));
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
      if (!ecarts.length || entree.stop_hook_active) process.exit(0);
      console.log(JSON.stringify({ decision: "block", reason: `[hook restitution — niveau Moyen] forme en défaut :\n`
        + ecarts.map((e) => `MOYEN — ${e}`).join("\n") + `\n\n${RAPPEL_MOYEN}` }));
      process.exit(0);
    }
  }
  const portee = escaladeMoyen ? { juge: true, motif: escaladeMoyen }
    : jugeable({ travail, ecritures, commandes, dernierTexte, depuisDernierAffichage });
  if (!portee.juge) process.exit(0);
  const { code, fails } = juger(dernierTexte);
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
  // TF-1361 — la PROCÉDURE : demandée au dernier message, elle rend S53 bloquante.
  const procedure = controlerProcedure({ dernierHumain, fails });
  const bloquants = fails.filter((f) => BLOQUANTES.has(f.regle));
  const avertissements = fails.filter((f) => !BLOQUANTES.has(f.regle));
  // TF-1081 — le sceau suit le PASS, et seulement sur la synthèse que le tour a ÉCRITE.
  const passe = code === 0 && !ecartsAffichage.length && geste.verdict !== "FAIL";
  const sceau = passe ? scellerSynthese(syntheseEcriteDuTour(fichiersMd)) : null;
  try {
    mkdirSync(dirname(journal), { recursive: true });
    appendFileSync(journal, JSON.stringify({
      ts: new Date().toISOString(), hook: "restitution", session: entree.session_id, ecritures, commandes,
      portee: portee.motif,
      verdict: passe
        ? "PASS" : ((bloquants.length || ecartsAffichage.length || geste.verdict === "FAIL" || procedure.verdict === "FAIL")
          ? "FAIL" : "AVERTISSEMENT"),
      regles: fails.map((f) => f.regle), bloquantes: bloquants.map((f) => f.regle),
      synthese_deposee: fichierSynthese || null, ecarts_affichage: ecartsAffichage, sceau,
      ...(geste.applicable ? { geste: { decision: geste.decision, verdict: geste.verdict, ecarts: geste.ecarts } } : {}),
      ...(procedure.applicable ? { procedure: { verdict: procedure.verdict, ecarts: procedure.ecarts } } : {}),
      deja_refuse: !!entree.stop_hook_active,
    }) + "\n");
  } catch { /* journal facultatif */ }
  if (passe) process.exit(0);
  // Avertissements seuls : dits sous la réponse, jamais réécrits — pas de doublon à l'écran.
  if (!bloquants.length && !ecartsAffichage.length && geste.verdict !== "FAIL" && procedure.verdict !== "FAIL") {
    console.log(JSON.stringify({
      systemMessage: `[restitution — R-44] avertissement${avertissements.length > 1 ? "s" : ""} non bloquant${avertissements.length > 1 ? "s" : ""} : ` +
        avertissements.map((f) => `${f.regle} — ${f.message}`).join(" · ") +
        " (structure conforme : rien n'est réécrit, le verdict est journalisé)",
    }));
    process.exit(0);
  }
  if (entree.stop_hook_active) process.exit(0); // déjà refusé une fois : on ne boucle pas, le verdict est journalisé
  const motifs = [
    ...(escaladeMoyen ? [escaladeMoyen] : []),
    ...bloquants.map((f) => `${f.regle} — ${f.message}`),
    ...ecartsAffichage.map((e) => `AFFICHAGE — ton message affiché ne dit pas ce que la synthèse déposée disait : ${e}. `
      + `Le document jugé est ${fichierSynthese} : reprends-en le bloc 3 en entier plutôt qu'une version abrégée.`),
    ...geste.ecarts.map((e) => `GESTE — ${e}. ${RAPPEL_GESTE}`),
    ...procedure.ecarts.map((e) => `PROCÉDURE — ${e} ${RAPPEL_PROCEDURE}`),
  ].join("\n");
  const enPlus = avertissements.length ? `\n(à corriger au passage, non bloquant : ${avertissements.map((f) => f.regle).join(", ")})` : "";
  console.log(JSON.stringify({ decision: "block", reason: `[hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale :\n${motifs}${enPlus}\n\n${RAPPEL}` }));
  process.exit(0);
}
