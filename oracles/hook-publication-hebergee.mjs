#!/usr/bin/env node
/**
 * hook-publication-hebergee.mjs — R-38 SE JOUE SUR L'OUTIL qui publie, pas seulement dans une phrase
 * du CLAUDE.md (TF-1592, retour RT-117 du Produit-02, 03/10/2026).
 *
 * LE FAIT. Le 03/10/2026, une session produit propose « Fichier + Artifact privé (Recommended) » à la
 * question de livraison d'un statut ; l'exploitant coche ; la page est publiée sur claude.ai à
 * 12 h 44. Retour mot pour mot : « J'ai demandé à ne jamais créer d'artefact dans Claude Code,
 * pourquoi c'est encore proposé ? ». Trois causes mesurées : R-38 n'était écrite dans aucun CLAUDE.md
 * produit ; le seul crochet PreToolUse posé sur l'outil Artifact juge la QUALITÉ du fichier, pas le
 * DROIT de le publier ; les instructions de l'outil lui-même incitent à publier. Une règle qui
 * interdit un canal de sortie et qu'aucune garde ne porte sur l'outil de ce canal décore (R-44).
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` sur l'outil `Artifact`. Il lit sur stdin l'entrée de l'outil
 * et REFUSE (exit 2, motif sur stderr) toute action qui PUBLIE ou MODIFIE ce qui est hébergé —
 * publication (action absente ou `publish`), `pin`, `write_db`, `reply`, `resolve`, création depuis
 * un type — sauf GO humain consigné. Il LAISSE PASSER les actions qui ne publient rien (`list`,
 * `read`, `open`, `comments`, `status`, `quickstart`…) et le retrait (`delete`, `unpin`) : R-38 §2
 * fait du retrait un geste que l'outil confirme déjà à l'humain, et le bloquer maintiendrait en
 * ligne une publication fautive. Une action inconnue est refusée (fermé par défaut).
 *
 * LE GO, deux voies, même format que `FORGE_PUSH_GO` (R-38 §4-6) — une citation de décision humaine
 * « D-N (x) du JJ/MM » :
 *   · la variable `FORGE_PUBLICATION_GO`, posée par l'humain AVANT d'ouvrir la session (un hook
 *     hérite de l'environnement du harnais : l'agent ne peut pas la poser par un outil) ;
 *   · une entrée du ledger du run (`forge/ledger.jsonl` sous le dossier de travail) de type
 *     `go_publication` portant `r38: true` et une `citation` au même format.
 *
 * NON JUGÉ (déclaré). L'AUTHENTICITÉ du GO : une entrée de ledger est écrite par l'agent, la variable
 * par l'humain — le hook juge la forme et la présence, jamais l'origine (même limite que
 * `FORGE_PUSH_GO`). Les autres canaux de publication (connecteurs `mcp__*` de documents, partage de
 * fichier) : hors de cet outil, non gardés ici. Le message d'une boîte de dialogue de l'outil qui
 * PROPOSE la publication : seule la consigne (CLAUDE.md, R-38) l'encadre.
 *
 * Usage : node oracles\hook-publication-hebergee.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer · 2 refuse (motif sur stderr).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** Actions qui ne publient rien, ou qui retirent. Tout le reste est refusé sans GO. */
export const ACTIONS_LIBRES = new Set([
  "list", "read", "list_types", "describe_type", "quickstart", "comments", "watch", "unwatch", "status",
  "read_db", "list_files", "read_file", "open", "unpin", "delete",
]);

/** Le format d'une citation de décision humaine, celui de FORGE_PUSH_GO : « D-54 (b) du 03/10 ». */
export const FORMAT_GO = /\bD-\d+\s*\(\s*[a-z]\s*\)\s*du\s*\d{1,2}\/\d{1,2}\b/i;

export const estOutilArtifact = (nom) => /(^|__)Artifact$/.test(String(nom || ""));

/** L'action effective : absente = publication (c'est le défaut documenté de l'outil). */
export function actionDe(entree) {
  const a = entree?.tool_input?.action;
  return a === undefined || a === null || a === "" ? "publish" : String(a);
}

/** Vrai si l'action doit être couverte par un GO. */
export function exigeGo(action) { return !ACTIONS_LIBRES.has(action); }

/** Le GO déclaré par la variable d'environnement, ou null. */
export function goEnvironnement(env) {
  const v = String(env?.FORGE_PUBLICATION_GO || "").trim();
  return v && FORMAT_GO.test(v) ? v : null;
}

/** Le GO consigné au ledger du run sous `dossier`, ou null. */
export function goLedger(dossier) {
  for (const rel of [join("forge", "ledger.jsonl"), "ledger.jsonl"]) {
    const f = join(dossier || ".", rel);
    if (!existsSync(f)) continue;
    let texte = "";
    try { texte = readFileSync(f, "utf8"); } catch { continue; }
    const lignes = texte.split(/\r?\n/).filter((l) => l.trim());
    for (let i = lignes.length - 1; i >= 0; i--) {
      try {
        const e = JSON.parse(lignes[i]);
        if (e?.type === "go_publication" && e?.r38 === true && FORMAT_GO.test(String(e?.citation || ""))) return String(e.citation);
      } catch { /* ligne illisible : ignorée, le ledger est jugé ailleurs */ }
    }
  }
  return null;
}

/** Le verdict : { decision: "laisse"|"refuse", motif, go }. */
export function juger(entree, env = process.env) {
  if (!estOutilArtifact(entree?.tool_name)) return { decision: "laisse", motif: "outil hors Artifact" };
  const action = actionDe(entree);
  if (!exigeGo(action)) return { decision: "laisse", motif: `action « ${action} » : ne publie rien` };
  const go = goEnvironnement(env) || goLedger(entree?.cwd || process.cwd());
  if (go) return { decision: "laisse", motif: `GO consigné : ${go}`, go };
  return {
    decision: "refuse",
    motif: `PUBLICATION HÉBERGÉE REFUSÉE (R-38) — l'action « ${action} » de l'outil Artifact publie ou modifie une page `
      + "sur un service hébergé, et aucun GO humain n'est consigné. Un livrable est un fichier autoportant sur disque, chez le "
      + "produit ; ne proposez pas la publication en option d'une question. Avec le GO humain en main : "
      + "FORGE_PUBLICATION_GO=\"D-N (x) du JJ/MM\" avant d'ouvrir la session, ou une entrée `go_publication` "
      + "(`{\"type\":\"go_publication\",\"r38\":true,\"citation\":\"D-N (x) du JJ/MM\"}`) au ledger du run.",
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
