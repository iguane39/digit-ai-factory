#!/usr/bin/env node
/**
 * generer-vue.mjs — génère todo/TODO.md, la VUE lisible du registre TODO-FORGE.
 * Source unique : TODO.jsonl (+ archive en comptage). La vue est scellée (sha256 des sources)
 * et déterministe (l'horodatage affiché est le ts max des événements, jamais l'horloge) :
 * deux générations sur le même registre produisent le même fichier. NE PAS ÉDITER LA VUE.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteFichier } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SRC = join(ICI, "TODO.jsonl"), ARC = join(ICI, "TODO-ARCHIVE.jsonl"), OUT = join(ICI, "TODO.md");
const lire = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);

const etats = new Map();
let tsMax = "";
for (const e of lire(SRC)) {
  if (e.ts > tsMax) tsMax = e.ts;
  if (e.ev === "creation") etats.set(e.id, { ...e });
  else if (e.ev === "maj" && etats.has(e.id)) Object.assign(etats.get(e.id), e);
  // ev "ingestion" : trace d'idempotence, sans effet sur la vue
}
const archives = lire(ARC);
const ORDRE_STATUT = ["en_cours", "decide", "candidat", "corrige", "ecarte"];
const parForge = new Map();
for (const e of etats.values()) {
  const forge = (e.forges_cibles_reelles || e.forges_cibles_initiales)[0];
  if (!parForge.has(forge)) parForge.set(forge, []);
  parForge.get(forge).push(e);
}
// TF-0615 : le sceau passe par la fonction PARTAGEE, qui normalise les fins de ligne. Avant,
// il hachait les octets bruts — donc un sceau different sur un poste en CRLF et un poste en
// LF, pour un registre identique. Un sceau qui depend du checkout ne prouve rien.
const sceau = (f) => empreinteFichier(f, 12);
const compte = (s) => [...etats.values()].filter((e) => e.statut === s).length;

let md = `# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=${sceau(SRC)} archive=${sceau(ARC)} · dernier événement: ${tsMax} -->

**${etats.size} actifs** (candidat ${compte("candidat")} · décidé ${compte("decide")} · en cours ${compte("en_cours")} · corrigé ${compte("corrige")} · écarté ${compte("ecarte")}) · **${new Set(archives.map((a) => a.id)).size} archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.
`;
for (const forge of [...parForge.keys()].sort()) {
  const items = parForge.get(forge).sort((a, b) =>
    ORDRE_STATUT.indexOf(a.statut) - ORDRE_STATUT.indexOf(b.statut) || b.score.valeur - a.score.valeur);
  md += `\n## ${forge}\n\n| id | statut | score | titre | payé en réel |\n|---|---|---|---|---|\n`;
  for (const e of items)
    md += `| ${e.id} | ${e.statut} | ${e.score.valeur} | ${e.titre} | ${e.preuve_du_cout ? "**oui** — " + e.preuve_du_cout : "non"} |\n`;
}
md += `\n---\nDétail d'un item : \`grep '"id":"TF-xxxx"' todo/TODO.jsonl\` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.\n`;
writeFileSync(OUT, md);
console.log(`TODO.md générée — ${etats.size} actifs, ${parForge.size} forges cibles (sceau actifs ${sceau(SRC)})`);
