/**
 * lib-ouverture-async — passe en `async` le hook d'ouverture de la factory déclaré dans le
 * `.claude/settings.json` d'un produit (TF-1635, 13/10/2026).
 *
 * LE FAIT : l'extension VS Code abandonne une session dont l'initialisation dépasse 60 s, et le CLI
 * n'annonce sa disponibilité qu'APRÈS la fin des hooks SessionStart synchrones. Le pilot est passé
 * en `async` le 13/10 (commit 9bfc8153), mais `.claude/settings.json` d'un produit est en mode
 * `presence_et_motif` : jamais recopié. Mesuré le 13/10 sur le poste : 19 produits sur 19 portaient
 * encore le hook synchrone à 240 s, donc 19 ouvertures vouées au même échec.
 *
 * LA RÉPARATION EST CHIRURGICALE : seule l'entrée SessionStart qui appelle
 * `forge/hooks/factory.mjs ouverture` est touchée (ajout de `async: true` et de `--contexte-json`).
 * Permissions, serveurs MCP et autres hooks, que le produit personnalise, restent intacts ;
 * l'indentation et les fins de ligne du fichier sont gardées. C'est le produit qui se met à jour
 * lui-même : la fonction est appelée par le hook d'ouverture qui tourne DANS le produit.
 *
 * Retour : { etat: "absent" | "illisible" | "sans_hook" | "deja" | "corrige", detail? }.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export const MOTIF_HOOK_OUVERTURE = /forge\/hooks\/factory\.mjs\s+ouverture\b/;

export function passerOuvertureEnAsync(chemin) {
  if (!existsSync(chemin)) return { etat: "absent" };
  const brut = readFileSync(chemin, "utf8");
  let j;
  try { j = JSON.parse(brut.replace(/^﻿/, "")); } catch (e) { return { etat: "illisible", detail: e.message }; }
  const groupes = j?.hooks?.SessionStart;
  if (!Array.isArray(groupes)) return { etat: "sans_hook" };
  let trouve = false, change = false;
  for (const g of groupes) for (const h of (g?.hooks || [])) {
    if (typeof h?.command !== "string" || !MOTIF_HOOK_OUVERTURE.test(h.command)) continue;
    trouve = true;
    if (!/--contexte-json\b/.test(h.command)) { h.command = `${h.command} --contexte-json`; change = true; }
    if (h.async !== true) { h.async = true; change = true; }
  }
  if (!trouve) return { etat: "sans_hook" };
  if (!change) return { etat: "deja" };
  const eol = brut.includes("\r\n") ? "\r\n" : "\n";
  const indent = (brut.match(/\n([ \t]+)"/) || [, "  "])[1];
  let sortie = JSON.stringify(j, null, indent).replace(/\n/g, eol);
  if (/\r?\n$/.test(brut)) sortie += eol;
  writeFileSync(chemin, (brut.startsWith("﻿") ? "﻿" : "") + sortie);
  return { etat: "corrige" };
}
