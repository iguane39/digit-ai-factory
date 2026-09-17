/**
 * LE PÉRIMÈTRE DES EXTENSIONS SE LIT, IL NE SE RECOPIE PAS (TF-1087, décision D-15 (a) du
 * 17/09/2026).
 *
 * Le fait mesuré : quatre contrôles du pilot énuméraient chacun leur propre liste de « ce qui est
 * un livrable », et les listes divergeaient — `oracle-unicite.mjs`, `oracle-propagation.mjs`,
 * `scripts\verifier-jeu-livrables.mjs` et `scripts\verifier-jugement.mjs`. Un fichier `.pdf`
 * était jugé par UN sur quatre, et aucune source ne tranchait. Conséquence mesurée le 15/09 :
 * NULLE — zéro `.pdf` et zéro `.pptx` sous `output\`. Le défaut était donc structurel et non
 * payé, et c'est exactement le moment où il coûte le moins cher à fermer.
 *
 * Pourquoi une DONNÉE et pas une constante : la liste grandit quand une famille de livrable naît,
 * et une liste qui grandit est une donnée périssable — loi transverse n° 4. Elle vit donc éditable,
 * datée et motivée dans `references\EXTENSIONS-JUGEES.json`, avec le motif de chaque extension
 * PRÉSENTE et de chaque extension ABSENTE : `.pptx` y est déclaré absent et dit pourquoi, ce
 * qu'une liste en dur ne sait pas faire.
 *
 * Ce que ce module ne fait pas : il ne dit pas si un fichier est un livrable — il dit quelles
 * extensions comptent. La convention de nom, le marqueur de famille et le reste reviennent à
 * chaque contrôle.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const CHEMIN_REFERENTIEL = join(ICI, "..", "references", "EXTENSIONS-JUGEES.json");

let cache = null;
function lire() {
  if (cache) return cache;
  // Pas de repli silencieux : un référentiel illisible doit ARRÊTER le contrôle, jamais le laisser
  // juger sur une liste vide — un balayage qui ne trouve rien parce qu'il ne cherche rien rend un
  // vert, et c'est le pire des verdicts.
  const brut = readFileSync(CHEMIN_REFERENTIEL, "utf8");
  cache = JSON.parse(brut);
  for (const role of ["livrables_porteurs", "texte_balaye"]) {
    const exts = cache?.roles?.[role]?.extensions;
    if (!Array.isArray(exts) || !exts.length) {
      throw new Error(`${CHEMIN_REFERENTIEL} : rôle « ${role} » vide ou absent — le contrôle ne peut pas juger`);
    }
  }
  return cache;
}

/** Les extensions d'un livrable rendu à un humain, en Set minuscule. */
export function livrablesPorteurs() {
  return new Set(lire().roles.livrables_porteurs.extensions.map((e) => e.toLowerCase()));
}

/** Les extensions dont le contenu se lit comme du texte pour un balayage de motif. */
export function texteBalaye() {
  return new Set(lire().roles.texte_balaye.extensions.map((e) => e.toLowerCase()));
}

/** La version du référentiel, à citer dans un verdict : un périmètre se date. */
export function versionReferentiel() {
  const d = lire();
  return `${d.version} (${d.genere})`;
}
