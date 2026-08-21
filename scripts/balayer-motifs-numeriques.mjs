#!/usr/bin/env node
/**
 * balayer-motifs-numeriques.mjs — balaye les motifs d'expression régulière qui cherchent un
 * NOMBRE NU dans un texte, sans garde de chiffre (TF-0438, 21/08/2026).
 *
 * Le fait qui l'a fait naître : `todo\self-test.mjs` cherchait « 0 item(s) actif(s) » pour
 * prouver qu'un drapeau n'est pas lu comme un chemin. Le jour où le registre a atteint
 * **130 actifs**, « 130 item(s) actif(s) » a contenu le motif : la recette est passée au rouge
 * sans qu'aucun code jugé n'ait changé. Même classe que TF-0387 (oracle-ears accusait
 * « ressource » de réveiller un détecteur d'authentification) : un motif sans garde accuse son
 * voisin.
 *
 * RECTIFICATION assumée (21/08) : la première rédaction du correctif affirmait que `\b` ne
 * corrigeait pas ce cas. C'est FAUX, vérifié par exécution — `/\b0 item/` ne matche pas
 * « 130 item » (entre « 3 » et « 0 » il n'y a pas de frontière de mot). `\b` suffit quand les
 * deux voisins possibles sont des chiffres ; il ÉCHOUE quand le voisin est un séparateur :
 * `/\bbottom:\s*0\b/` matche « bottom: 0.5rem », et c'est le défaut réel trouvé par ce
 * balayage dans `oracle-mobile` de forge-design. La garde générale est donc
 * `(?<![0-9])` / `(?![0-9.])`.
 *
 * Ce qu'il signale : un chiffre littéral qui touche un BORD du motif (tête ou queue) sans
 * lookaround de chiffre. Ce qu'il ne juge PAS : si le nombre est significatif — un identifiant
 * à largeur fixe (`TF-0394`, `D-06`, `L11`) ne peut pas avoir de voisin chiffré, c'est à la
 * lecture de trancher. C'est un OUTIL DE CAMPAGNE, pas un gate : il n'est bloquant nulle part.
 *
 * Usage : node scripts\balayer-motifs-numeriques.mjs <racine…> [--json]
 * Exit : 0 (toujours) — un balayage informe, il ne condamne pas.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, extname } from "node:path";

const args = process.argv.slice(2);
const JSON_OUT = args.includes("--json");
const RACINES = args.filter((a) => !a.startsWith("--"));
if (!RACINES.length) {
  console.error("usage : node scripts\\balayer-motifs-numeriques.mjs <racine…> [--json]");
  process.exit(2);
}

const EXT = new Set([".mjs", ".js", ".py"]);
const IGNORE = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", "old", "Old"]);

function* fichiers(dir) {
  let entrees;
  try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    if (IGNORE.has(e.name) || e.name.startsWith(".oracles")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* fichiers(p);
    else if (EXT.has(extname(e.name))) yield p;
  }
}

const LITTERAL_JS = /(?<![\w)\]"'`/*])\/((?:\\.|\[(?:\\.|[^\]])*\]|[^/\\\n])+)\/[gimsuyd]*/g;
const NEW_REGEXP = /new RegExp\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g;
const PY_RE = /re\.(?:compile|match|search|fullmatch|sub|findall|finditer)\(\s*r?(['"])((?:\\.|(?!\1).)*)\1/g;

/** Causes de suspicion : un chiffre littéral au bord du motif, sans garde du bon côté. */
export function suspect(motif) {
  const causes = [];
  const gardeAvant = /^\(\?<!\[?[0-9\\d]/.test(motif);
  const gardeApres = /\(\?!\[?[0-9\\d][^)]*\)$/.test(motif);
  const tete = motif.replace(/^(\^|\\b|\(|\?:|\|)+/, "");
  if (/^[0-9]/.test(tete) && !gardeAvant && !/^\^/.test(motif)) causes.push("chiffre en TÊTE");
  const queue = motif.replace(/(\\b|\$|\)|\|)+$/, "");
  if (/[0-9]$/.test(queue) && !gardeApres && !/\$$/.test(motif) && !/[+*?}]$/.test(queue)) causes.push("chiffre en QUEUE");
  return causes;
}

const hits = [];
for (const racine of RACINES) {
  for (const f of fichiers(racine)) {
    let src;
    try { src = readFileSync(f, "utf8"); } catch { continue; }
    const lignes = src.split(/\r?\n/);
    const ajoute = (motif, index, forme) => {
      const causes = suspect(motif);
      if (!causes.length) return;
      const ligne = src.slice(0, index).split("\n").length;
      const brut = lignes[ligne - 1] || "";
      // Un commentaire n'est pas une expression régulière : « (2/4, R-30) » dans un bloc CSS
      // ou une ligne `//` ressemble à un littéral et n'en est pas un.
      const avant = brut.slice(0, Math.max(0, brut.indexOf("/" + motif)));
      if (/^\s*(\*|\/\/|#|\/\*)/.test(brut) || /(^|\s)(\/\/|\/\*)/.test(avant)) return;
      hits.push({ fichier: relative(process.cwd(), f), ligne, motif, forme, causes,
                  contexte: brut.trim().slice(0, 140) });
    };
    for (const m of src.matchAll(LITTERAL_JS)) ajoute(m[1], m.index, "littéral JS");
    for (const m of src.matchAll(NEW_REGEXP)) ajoute(m[2], m.index, "new RegExp");
    for (const m of src.matchAll(PY_RE)) ajoute(m[2], m.index, "re.* Python");
  }
}
hits.sort((a, b) => a.fichier.localeCompare(b.fichier) || a.ligne - b.ligne);

if (JSON_OUT) {
  console.log(JSON.stringify({ outil: "balayer-motifs-numeriques", racines: RACINES, total: hits.length, hits }, null, 1));
} else {
  for (const h of hits) console.log(`${h.fichier}:${h.ligne}  /${h.motif}/  [${h.causes.join(" + ")}]\n    ${h.contexte}`);
  console.log(`\n${hits.length} motif(s) à lire sur ${RACINES.join(", ")} — un identifiant à largeur fixe (TF-0394, D-06) n'est PAS un défaut : la garde se pose là où le nombre peut grandir ou border un séparateur.`);
}
process.exit(0);
