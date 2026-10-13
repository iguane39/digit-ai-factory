#!/usr/bin/env node
/**
 * hook-droits-accordes.mjs — LE CONTRÔLE D'UN SCRIPT D'OCTROI DE DROITS SE JOUE QUAND LE PRODUIT
 * L'ÉCRIT, pas deux semaines plus tard à la mise en production (TF-1528, retour RT du 01/10/2026).
 *
 * LE FAIT. `scripts\verifier-droits-accordes.mjs` (TF-1497, TM7 de la porte M-12) juge hors ligne les
 * identifiants de permission Microsoft Graph, l'échec masqué d'un octroi et l'annonce de succès sans
 * relecture. Il se jouait sur le dossier de MEP. Le défaut du 16/09 chez Produit-03 est né à l'écriture
 * du script, 14 jours avant ce passage : un identifiant faux, ajouté avec `2>/dev/null || true`, puis
 * « consentie » écrit sans relecture. Une règle que le producteur ne rencontre pas au moment où il
 * produit n'existe pas pour lui (même raisonnement que `hook-page-html.mjs`, TF-0765).
 *
 * CE QUE FAIT CE HOOK. Hook `PostToolUse` (Write | Edit | MultiEdit), lancé chez le produit par
 * `forge/hooks/factory.mjs droits-accordes` (gabarits/settings-produit.json). Il lit sur stdin l'entrée
 * de l'outil, ne s'intéresse qu'aux fichiers de script et d'infrastructure existants, et rejoue sur eux
 * le contrôle existant, sans rien y changer. Il n'imprime rien tant que le fichier n'a ni identifiant
 * Graph ni commande d'octroi (verdict SKIP) : un script ordinaire ne reçoit aucun bruit.
 *
 * IL AVERTIT, IL NE BLOQUE JAMAIS : exit 0 toujours. Règle neuve opposable à tous les produits : elle
 * entre en avertissement (précédent D-70 (b)), et un script d'infrastructure s'écrit en plusieurs
 * passes — le faux refus d'un fichier encore incomplet est le coût non mesuré de cette règle.
 *
 * NON JUGÉ (déclaré). Le taux de faux avertissements sur un script en cours d'écriture ; les octrois
 * hors Microsoft Graph (la table ne porte que Graph) ; un fichier sans extension de script.
 *
 * Usage : node oracles\hook-droits-accordes.mjs [--fichier <script>]      (stdin : JSON du hook)
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const VERIFIEUR = join(ICI, "..", "scripts", "verifier-droits-accordes.mjs");

const EXTENSIONS = /\.(sh|bash|ps1|psm1|bicep|tf|ya?ml|py|mjs|js|cmd|bat)$/i;
const IGNORES = [/(^|[\\/])node_modules[\\/]/i, /(^|[\\/])\.git[\\/]/i, /(^|[\\/])old[\\/]/i, /(^|[\\/])\.oracles[\\/]/i];

/** Le fichier de script visé par l'entrée du hook (Write/Edit/MultiEdit), ou null. */
export function fichierVise(entree) {
  try {
    const j = typeof entree === "string" ? JSON.parse(entree || "{}") : (entree || {});
    const p = j?.tool_input?.file_path || j?.tool_input?.path || j?.file_path || null;
    if (!p || !EXTENSIONS.test(p) || IGNORES.some((re) => re.test(p))) return null;
    return p;
  } catch { return null; }
}

/** Joue le contrôle sur un fichier ; rend les lignes à imprimer (vide : rien à dire). */
export function jouer(fichier, verifieur = VERIFIEUR) {
  if (!existsSync(fichier)) return [];
  if (!existsSync(verifieur)) return [`[droits-accordes] contrôle NON joué sur ${fichier} : ${verifieur} absent de ce poste`];
  const r = spawnSync(process.execPath, [verifieur, fichier], { encoding: "utf8", timeout: 30000 });
  let j = null;
  try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
  if (!j) return [`[droits-accordes] verdict ILLISIBLE sur ${fichier} (exit ${r.status}) — ce n'est pas un constat sur le script`];
  if (j.verdict !== "FAIL") return [];
  const refus = (j.findings || []).filter((f) => f.statut === "FAIL");
  return [
    `[droits-accordes] ${fichier} : ${refus.length} défaut(s) dans un script d'octroi de droits (TF-1528, avertissement non bloquant) :`,
    ...refus.slice(0, 6).map((f) => `  - ${f.regle} ${f.ou} : ${String(f.message || "").slice(0, 220)}`),
    "  Règle : un identifiant de permission se résout contre la plateforme, un octroi ne masque pas son échec, un succès ne s'annonce qu'après relecture (ETAPE-MEP.md § 3 octies).",
  ];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const iF = process.argv.indexOf("--fichier");
  let fichier = iF > -1 ? process.argv[iF + 1] : null;
  if (!fichier) {
    let brut = "";
    try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
    fichier = fichierVise(brut);
  }
  if (fichier) for (const l of jouer(fichier)) console.log(l);
  process.exit(0);
}
