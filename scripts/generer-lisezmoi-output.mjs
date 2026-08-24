#!/usr/bin/env node
/**
 * generer-lisezmoi-output.mjs — L'INDEX CLIQUABLE des livrables d'un dossier `output\`
 * (D-15 al. e rendu INCONDITIONNEL et OUTILLÉ — TF-0560, 24/08/2026).
 *
 * LE FAIT, ET IL A COÛTÉ ONZE JOURS À UN DESTINATAIRE. La règle de nommage R-4 impose
 * `<Projet> - <Objet> - AAAAMMJJ<indice>.<ext>` : trois espaces au minimum, six en pratique. Or le
 * résolveur de liens de la session de travail coupe le chemin AU PREMIER ESPACE. Test à deux liens
 * conduit avec le destinataire le 24/08, sur un fichier créé exprès sans espace : le lien vers le
 * fichier SANS espace **s'ouvre** ; les liens vers un livrable À espaces n'ouvrent pas, ni encodés
 * en `%20`, ni sous la forme à chevrons du Markdown. Le premier test écarte l'hypothèse de la racine
 * de l'atelier et ISOLE l'espace comme cause unique.
 *
 * Conséquence sur un seul produit : 22 livrables, 0 atteignable au clic, pendant onze jours, sans
 * que la cause soit nommée. La classe est GÉNÉRIQUE — elle vaut pour tout produit qui applique R-4,
 * et le seul dossier de rangement client du parc en porte 22.
 *
 * CE QUI N'EST PAS LA SOLUTION, ET LE LOT LE DIT LUI-MÊME : renommer le parc. Le nom daté porte la
 * version et la traçabilité, il n'est pas le problème. *Ce qui manque est un point d'entrée que
 * l'outillage sait atteindre.* Ce fichier-là n'a qu'une contrainte, parfaitement mécanique : son
 * propre nom ne porte aucun espace.
 *
 * CE QUE LE SOCLE PRÉVOYAIT DÉJÀ, ET POURQUOI ÇA NE SUFFISAIT PAS. D-15 al. e prévoit un
 * `LISEZMOI.md` de mapping — mais il était (1) CONDITIONNEL (« obligatoire si références
 * antérieures »), donc absent partout où il n'y avait pas de renumérotage à documenter ; (2) NON
 * MÉCANISÉ ; (3) NON OUTILLÉ. Trois manques qui font qu'une bonne idée ne protège personne.
 *
 * CE QUE CE GÉNÉRATEUR N'ÉCRASE PAS, ET J'AI FAILLI LE DÉTRUIRE. Ce `LISEZMOI.md` porte déjà la
 * TABLE DES FAMILLES numérotées de D-16, avec le motif écrit d'un doublon de numéro GELÉ — table
 * qu'un test du dépôt LIT pour juger la conformité des familles. Mon premier jet la remplaçait
 * intégralement : la recette est passée de verte à rouge dans la seconde, sur « les six familles du
 * disque ne sont pas déclarées ». *Un générateur qui écrase un artefact rédigé détruit un travail
 * que personne ne remettra.* L'index vit donc ENTRE DEUX BALISES, et tout ce qui l'entoure est
 * préservé intact — ce qui est aussi la seule façon qu'un humain puisse écrire ici sans être écrasé.
 *
 * Usage : node scripts/generer-lisezmoi-output.mjs [<dossier output>] [--verifier]
 *   --verifier : ne réécrit rien, rend un verdict (exit 1 si l'index manque ou a dérivé).
 * Exit : 0 = écrit ou conforme · 1 = dérive constatée en mode --verifier · 2 = dossier introuvable.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const verifierSeulement = args.includes("--verifier");
// CÂBLÉ EN HOOK, DONC SILENCIEUX PAR DÉFAUT SOUS CE DRAPEAU (24/08). L'index se régénère après
// chaque écriture : sans `--silencieux`, il commenterait chaque outil joué et noierait la sortie.
// Un générateur bavard câblé en hook s'apprend à être ignoré, exactement comme un contrôle bavard.
const silencieux = args.includes("--silencieux");
const cible = args.find((a) => !a.startsWith("--")) || join(ICI, "..", "output");

const NOM = "LISEZMOI.md";
const IGNORES = new Set([NOM, "README.md", ".gitkeep", ".oracles"]);
const RE_DATE = /(\d{8})([a-z])?(?=\.[a-z0-9]+$|$)/i;
const BALISE_DEBUT = "<!-- index-livrables:debut — genere par scripts/generer-lisezmoi-output.mjs, NE PAS EDITER A LA MAIN -->";
const BALISE_FIN = "<!-- index-livrables:fin -->";

/** Les familles numérotées de `output\` (D-15), et les livrables de chacune. */
function familles(racine) {
  const out = [];
  for (const e of readdirSync(racine, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!e.isDirectory() || IGNORES.has(e.name)) continue;
    const livrables = [];
    const marche = (d, prof) => {
      if (prof > 2) return;
      for (const f of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (IGNORES.has(f.name)) continue;
        const p = join(d, f.name);
        if (f.isDirectory()) { marche(p, prof + 1); continue; }
        if (!/\.(md|html|pdf|json|jsonl|csv|xlsx|pptx|docx)$/i.test(f.name)) continue;
        const rel = relative(racine, p);
        livrables.push({
          nom: f.name,
          chemin: rel.replaceAll("\\", "/"),
          date: (RE_DATE.exec(f.name) || [])[1] || null,
          indice: (RE_DATE.exec(f.name) || [])[2] || null,
          ko: Math.round(statSync(p).size / 102.4) / 10,
          archive: /(^|[\\/])old([\\/]|$)/i.test(rel),
        });
      }
    };
    marche(join(racine, e.name), 0);
    if (livrables.length) out.push({ famille: e.name, livrables });
  }
  return out;
}

/** L'index SEUL — ce qui vit entre les deux balises. */
function rendreIndex(fam) {
  const total = fam.reduce((t, f) => t + f.livrables.length, 0);
  const courants = fam.reduce((t, f) => t + f.livrables.filter((l) => !l.archive).length, 0);
  const l = [BALISE_DEBUT, ""];
  l.push("## Index des livrables — le point d'entrée cliquable");
  l.push("");
  l.push("**Pourquoi cet index existe, et il vaut d'être lu une fois.** Le nom d'un livrable porte sa");
  l.push("date et son indice — donc au moins trois espaces. Or le résolveur de liens de la session de");
  l.push("travail **coupe le chemin au premier espace** : un livrable n'est jamais atteignable au clic,");
  l.push("ni tel quel, ni encodé, ni entre chevrons. Mesuré le 24/08/2026 sur un produit : **22");
  l.push("livrables, 0 atteignable**, pendant onze jours sans que la cause soit nommée.");
  l.push("");
  l.push("Ce fichier-ci n'a pas d'espace dans son nom : il s'ouvre. Les chemins ci-dessous sont donnés");
  l.push("à **copier-coller** — c'est ce qui marche aujourd'hui, et le dire vaut mieux que laisser");
  l.push("essayer. *Le nom daté n'est pas le problème : il porte la version et la traçabilité.*");
  l.push("");
  l.push(`**État** : ${courants} livrable(s) courant(s), ${total - courants} archivé(s), ${fam.length} famille(s).`);
  l.push("");
  for (const f of fam) {
    l.push(`### ${f.famille}`);
    l.push("");
    l.push("| Livrable | Version | Poids | Chemin à copier |");
    l.push("|---|---|---|---|");
    for (const x of f.livrables) {
      const version = x.date ? `${x.date}${x.indice || ""}` : "—";
      l.push(`| ${x.nom.replaceAll("|", "\\|")}${x.archive ? " *(archivé)*" : ""} | ${version} | ${x.ko} Ko | \`${x.chemin}\` |`);
    }
    l.push("");
  }
  l.push("*Un livrable présent et absent de ce tableau est un défaut : cet index est régénéré, et un");
  l.push("index qui a dérivé de son dossier ne sert plus qu'à donner confiance à tort.*");
  l.push("");
  l.push(BALISE_FIN);
  return l.join("\n");
}

/** L'index remplace ce qui vit entre les balises, et RIEN d'autre. */
function fusionner(existant, index) {
  const i = existant.indexOf(BALISE_DEBUT);
  const j = existant.indexOf(BALISE_FIN);
  if (i >= 0 && j > i) return existant.slice(0, i) + index + existant.slice(j + BALISE_FIN.length);
  // Première pose : l'index vient à la FIN, pour ne rien déplacer de ce qui est déjà écrit.
  return existant.replace(/\s*$/, "") + "\n\n" + index + "\n";
}

if (!existsSync(cible)) {
  console.error(`générateur : dossier introuvable — ${cible}`);
  process.exit(2);
}
const fam = familles(cible);
const chemin = join(cible, NOM);
const existant = existsSync(chemin) ? readFileSync(chemin, "utf8") : `# ${NOM}\n`;
const attendu = fusionner(existant, rendreIndex(fam));
const total = fam.reduce((t, f) => t + f.livrables.length, 0);

if (verifierSeulement) {
  if (!existsSync(chemin)) {
    console.error(`FAIL — ${NOM} absent de ${cible} : le dossier n'a aucun point d'entrée atteignable au clic`);
    process.exit(1);
  }
  // La comparaison ignore la ligne d'ÉTAT : ce qui compte est que chaque livrable présent soit
  // indexé, pas que le fichier ait été régénéré aujourd'hui. Comparer la date ferait échouer le
  // contrôle chaque lendemain — un rouge quotidien sans défaut est un rouge qu'on apprend à ignorer.
  const sansEtat = (t) => t.split("\n").filter((x) => !x.startsWith("**État**")).join("\n");
  if (sansEtat(readFileSync(chemin, "utf8")) !== sansEtat(attendu)) {
    console.error(`FAIL — l'index de ${NOM} a DÉRIVÉ de son dossier : un livrable présent n'y est pas, ou un indexé n'existe plus. Rejouer : node scripts/generer-lisezmoi-output.mjs`);
    process.exit(1);
  }
  console.log(`PASS — ${NOM} indexe les ${total} livrable(s) de ${fam.length} famille(s)`);
  process.exit(0);
}

if (existsSync(chemin) && readFileSync(chemin, "utf8") === attendu) {
  // RIEN N'A CHANGÉ : on ne réécrit pas. Un hook qui touche le fichier à chaque outil joué rendrait
  // le dépôt sale sans qu'un octet de contenu ait bougé — du bruit qui ressemble à du travail.
  if (!silencieux) console.log(`${NOM} : index déjà à jour (${total} livrable(s))`);
  process.exit(0);
}
writeFileSync(chemin, attendu, "utf8");
if (!silencieux) console.log(`${NOM} : index régénéré → ${chemin} (${total} livrable(s), ${fam.length} famille(s))`);
