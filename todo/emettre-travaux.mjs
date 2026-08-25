#!/usr/bin/env node
/**
 * emettre-travaux.mjs — le pilot confie un travail à un produit, par sa BOÎTE D'ENTRÉE.
 *
 * ============================================================================================
 * POURQUOI (TF-0627, décision humaine du 25/08/2026 — voie « canal symétrique »)
 * ============================================================================================
 *
 * LE FLUX ÉTAIT À SENS UNIQUE, et personne ne l'avait écrit. Le canal produit → pilot est complet
 * et outillé depuis des semaines : lot de retours, sidecar machine, rejet atomique, dérogation
 * tracée, juge de forme importé des deux côtés. Le canal pilot → produit n'existait pas. Tout ce
 * que le pilot possédait autour du carnet de reste-à-faire d'un produit était en LECTURE (la
 * projection HTML) ou en CONTRÔLE (R-20 qui juge sa présence et ses sections).
 *
 * CE QUE LA LACUNE COÛTAIT, mesuré et non supposé : 38 artefacts d'héritage absents chez sept
 * produits, dont le gabarit de restitution et son hook chez cinq — et AUCUN des sept ne le savait,
 * faute de voie pour le lui dire. *Un état mesuré qui n'atteint pas son destinataire ne devient
 * pas un travail fait.*
 *
 * ============================================================================================
 * LA FRONTIÈRE, ET POURQUOI ELLE EST LÀ
 * ============================================================================================
 *
 * CE SCRIPT N'ÉCRIT QUE DANS `input\00-travaux\` DU PRODUIT. Pas dans son carnet, pas dans son
 * code, pas dans son `.gitignore`. C'est ce qui rend le canal acceptable : le produit INGÈRE
 * lui-même à son prochain travail, décide ce qu'il retient, et écarte le reste avec son motif aux
 * « Écarts assumés » (R-20 bis). La règle « seuls les produits se modifient eux-mêmes » est tenue
 * à la lettre — le pilot n'écrit rien que le produit n'ait choisi.
 *
 * IL NE COMMITE RIEN chez le produit : déposer un fichier dans une boîte d'entrée est un geste
 * réversible qu'un `git clean` annule ; entrer dans l'historique d'un produit est un geste dont le
 * produit est seul auteur (décision humaine du 25/08 sur un cas précédent).
 *
 * IL JOUE SON PROPRE JUGE AVANT D'ÉCRIRE. Le lot est vérifié par `gabarits\oracle-travaux-pilot.mjs`
 * — le même module que le produit reçoit — et un lot en défaut n'est PAS déposé. C'est la leçon
 * du canal inverse, où la forme était prescrite en prose chez l'émetteur et jugée en code chez le
 * destinataire : six lots en une journée ont dû passer par dérogation. Ici l'émetteur est jugé.
 *
 * IL EST IDEMPOTENT PAR CONTENU : un lot dont le contenu est déjà déposé chez le produit n'est pas
 * redéposé. Sans cela, deux exécutions du même relevé enseveliraient le produit sous des lots
 * identiques, et le canal deviendrait la nuisance qu'il est censé éviter (R-33 bis).
 *
 * Usage :
 *   node todo\emettre-travaux.mjs --produit <nom> [--essai]
 *   node todo\emettre-travaux.mjs --tous [--essai]
 * `--essai` rend le lot sur la sortie standard et n'écrit RIEN, nulle part.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { verifier } from "../gabarits/oracle-travaux-pilot.mjs";
import { empreinteTexte } from "../scripts/lib-empreinte.mjs";
import { relever } from "../scripts/relever-heritage.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const ESSAI = args.includes("--essai");
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };

/** La date du lot, au format des lots du parc. Passée en argument pour rester déterministe. */
export const dateLot = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

/** L'indice du jour : la première lettre libre dans la boîte d'entrée du produit. */
export function indiceLibre(boite, jour) {
  const pris = existsSync(boite)
    ? readdirSync(boite).filter((f) => f.includes(`TRAVAUX - ${jour}`)).map((f) => (f.match(new RegExp(`TRAVAUX - ${jour}([a-z])`)) || [])[1]).filter(Boolean)
    : [];
  for (const l of "abcdefghijklmnopqrstuvwxyz") if (!pris.includes(l)) return l;
  return "z";
}

/**
 * LE LOT D'HÉRITAGE MANQUANT, rendu pour un produit. C'est le premier — et pour l'instant le seul
 * — genre de travail que le pilot confie : le relevé du 25/08 l'a mesuré, et le produit ne peut
 * pas le connaître autrement.
 */
export function lotHeritage(ligne, jour, indice) {
  const absents = ligne.artefacts.filter((a) => a.etat === "absent");
  const perimes = ligne.artefacts.filter((a) => a.etat === "divergent");
  if (!absents.length && !perimes.length) return null;

  // L'EMPREINTE D'IDEMPOTENCE PORTE CE QUI EST CONFIE, PAS L'ENVELOPPE QUI LE PORTE.
  // Premier jet : le sceau etait calcule sur le lot ENTIER, titre compris — or le titre porte
  // l'indice du jour, qui change a chaque passage (`a`, puis `b`). Deux executions du meme relevé
  // deposaient donc deux lots identiques dans le fond et differents dans l'octet, et la boite du
  // produit se remplissait — exactement la nuisance que ce canal doit eviter (R-33 bis). Trouve
  // par la recette d'idempotence, qui rendait 4 fichiers au lieu de 2.
  const sceauConfie = empreinteTexte([...perimes, ...absents]
    .map((a) => `${a.cible}|${a.etat}|${a.source || ""}|${a.produit || ""}`).sort().join("\n"), 12);

  const glose = {
    "forge/retours/RETOURS-FORGES.md": "le gabarit qui décrit la forme d'un lot de retours — sans lui, vos retours sont refusés à la porte du pilot pour une forme que rien ne vous a dite",
    "forge/retours/oracle-lot.mjs": "l'outil qui vérifie un lot de retours AVANT de le remettre — sans lui, vous découvrez le refus après coup, ou jamais si une dérogation le masque",
    "forge/hooks/factory.mjs": "les automatismes de fin de tour de travail — sans eux, aucun contrôle ne s'exécute à la clôture",
    "forge/RESTITUTION.md": "le format de compte rendu prescrit — sans lui, vos messages de fin de traitement sont hors format et rien ne le refuse",
    ".claude/settings.json": "la configuration d'agent du projet, qui câble les automatismes ci-dessus",
    "CLAUDE.md": "les consignes du projet, lues à chaque ouverture de session",
    "robots.txt": "l'ouverture aux robots d'indexation — légitimement absent si ce projet n'a aucune surface web, mais alors le DÉCLARER",
    "llms.txt": "l'ouverture aux agents IA — même remarque : légitimement absent sans surface web, à déclarer",
  };

  const bloc = (a, gravite) => {
    const g = glose[a.cible] || "artefact du contrat d'héritage";
    return `### TF-0626 — ${a.etat === "absent" ? "artefact d'héritage ABSENT" : "artefact d'héritage PÉRIMÉ"} : \`${a.cible}\` · gravité ${gravite}

- **Le fait**, mesuré le ${jour.slice(6, 8)}/${jour.slice(4, 6)}/${jour.slice(0, 4)} : \`${a.cible}\` ${a.etat === "absent"
  ? "n'existe pas dans votre dépôt"
  : `existe mais DIVERGE de la source du pilot (empreintes \`${a.source}\` contre \`${a.produit}\`)`}. Contrat : \`gabarits\\HERITAGE.json\`, mode \`${a.mode}\`.
- **Pourquoi cela vous concerne** : ${g}.
- **Ce qui est demandé** : recopier \`${a.cible.replace(/^forge\//, "gabarits/").replace("gabarits/retours/RETOURS-FORGES.md", "gabarits/RETOURS-FORGES.md").replace("gabarits/retours/oracle-lot.mjs", "gabarits/oracle-lot-retours.mjs")}\` depuis \`c:\\dev\\digit-ai-factory\\\` vers \`${a.cible}\` de votre dépôt. Le chemin source exact est au contrat.
- **Effort estimé** : simple × court
- **Comment vous saurez que c'est fait** : \`node c:\\dev\\digit-ai-factory\\scripts\\relever-heritage.mjs\` ne liste plus cet artefact pour votre projet.
- **Si ce n'est pas fait** : ${a.cible.includes("RESTITUTION") || a.cible.includes("hooks")
    ? "vos travaux continuent d'être rendus hors du format prescrit, et aucun contrôle ne le refuse"
    : "l'écart reste, et le contrôle de conformité du pilot continue de le rendre à chaque lot que vous remettez"}`;
  };

  const items = [...perimes.map((a) => bloc(a, "majeur")), ...absents.map((a) => bloc(a, absents.length > 4 ? "majeur" : "mineur"))];

  const md = `# Travaux confiés par le pilot — ${ligne.produit} — ${jour}${indice}

- **Émetteur** : \`digit-ai-factory\` (le pilot)
- **Références registre** : \`todo\\TODO.jsonl\` — item \`TF-0626\`
- **Dépôt** : ce fichier a été déposé par le pilot dans \`input\\00-travaux\\\`. L'original reste au
  pilot. Statut : \`a_traiter\` → \`traite le <date>\` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : \`${sceauConfie}\` — deux lots portant la même
  empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> \`\`\`
> node forge\\travaux\\oracle-travaux.mjs "<ce fichier>.md"
> \`\`\`
>
> Le même module a été joué par le pilot AVANT de déposer ce lot. Si ce fichier vous manque,
> l'héritage n'est pas tenu — et c'est précisément le sujet de ce lot.

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont
décrites, jamais exécutées. **Le même principe s'applique ici, dans l'autre sens.** Ce lot décrit
un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de
ce que vous inscrivez à votre reste-à-faire, de l'ordre, et de ce que vous écartez — un élément
écarté rejoint vos « Écarts assumés » avec son motif et sa date, il ne disparaît pas.

## Travaux confiés

${items.join("\n\n")}

## Ce que le pilot a déjà fait de son côté

- Le contrôle qui devait mesurer cet écart ne savait pas localiser votre dépôt : il cherchait par
  préfixe de nom, sans normalisation, sur deux niveaux de profondeur. Corrigé le 25/08 — un produit
  est désormais reconnu à ses lots de retours, et non à sa profondeur de rangement. Preuve : recette
  \`localiser-produit\` 11/11, et 4 produits localisés sur 6 dont 2 qui étaient impossibles avant.
- Le message de refus d'un lot énumérait trois causes possibles au lieu de nommer celle qu'il
  mesure ; il en nomme désormais une, avec le chemin absolu. Preuve : les 3 branches jouées en recette.
- Le relevé qui a produit ce lot a été écrit, joué et publié le 25/08, sans aucune écriture chez
  aucun produit — sa recette le vérifie par empreinte de l'arborescence avant et après.

## Ce que le pilot NE demande PAS

- **Il ne demande pas de commiter ces fichiers**, ni de les adopter en bloc : la décision est vôtre,
  fichier par fichier, et un refus motivé aux « Écarts assumés » est une réponse complète.
- **Il ne demande rien sur \`robots.txt\` et \`llms.txt\` si votre projet n'a aucune surface web** —
  leur mode est \`presence\`, donc leur absence est légitime ; ce qui est demandé alors est de le
  DÉCLARER, pour qu'un relevé futur ne les recompte pas comme un manque.
- **Il ne demande aucun changement de code, de dépendance ou de configuration applicative.** Ce lot
  ne porte que des artefacts de méthode.

## Ordre recommandé

1. \`forge/RESTITUTION.md\` et \`forge/hooks/factory.mjs\` **d'abord**, parce que leur absence est
   la seule du lot qui produise un effet à chaque travail que vous rendez : sans eux, un compte
   rendu hors format n'est refusé par rien.
2. \`forge/retours/oracle-lot.mjs\` et son gabarit **ensuite**, parce qu'ils vous évitent un refus
   à la porte du pilot — un aller-retour par lot remis.
3. Les fichiers d'ouverture web **en dernier**, ou déclarés hors sujet : leur impact est nul tant
   que le projet n'expose pas de surface web.
`;

  const sidecar = [...perimes, ...absents].map((a) => JSON.stringify({
    schema: 1,
    titre: `${a.etat === "absent" ? "Artefact d'heritage absent" : "Artefact d'heritage perime"} : ${a.cible}`,
    contenu: `Mesure du pilot du ${jour} : ${a.cible} ${a.etat === "absent" ? "n'existe pas" : "diverge de la source"} dans ce depot. ${glose[a.cible] || ""}`,
    origine_tf: "TF-0626",
    gravite: a.cible.includes("RESTITUTION") || a.cible.includes("hooks") ? "majeur" : "mineur",
    effort: "simple × court",
    verification: "node c:\\dev\\digit-ai-factory\\scripts\\relever-heritage.mjs ne liste plus cet artefact",
  })).join("\n") + "\n";

  return { md, sidecar, elements: items.length, sceauConfie };
}

// ---- exécution ------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const racine = process.env.FORGE_ROOT || join(PILOT, "..");
  const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
  const lignes = relever(racine, contrat, PILOT);
  const cible = valeur("--produit");
  const tous = args.includes("--tous");
  if (!cible && !tous) {
    console.error("usage : node todo\\emettre-travaux.mjs (--produit <nom> | --tous) [--essai]");
    process.exit(2);
  }
  const jour = dateLot(new Date());
  let deposes = 0, ignores = 0, refuses = 0;

  for (const ligne of lignes) {
    if (cible && !ligne.produit.toLowerCase().includes(cible.toLowerCase())) continue;
    const boite = join(ligne.dossier, "input", "00-travaux");
    const indice = indiceLibre(boite, jour);
    const lot = lotHeritage(ligne, jour, indice);
    if (!lot) { console.log(`[RIEN À CONFIER] ${ligne.produit} — héritage conforme`); continue; }

    // LE JUGE AVANT L'ÉCRITURE : un lot en défaut n'est pas déposé, et le défaut est dit.
    const jugement = verifier(lot.md, `pilot - TRAVAUX - ${jour}${indice}.md`);
    if (jugement.verdict === "FAIL") {
      refuses += 1;
      console.error(`[REFUSÉ AVANT DÉPÔT] ${ligne.produit} — le lot que je viens d'écrire ne tient pas sa propre forme :`);
      for (const c of jugement.constats.filter((x) => x.statut === "FAIL")) console.error(`  - ${c.regle} : ${c.message}`);
      continue;
    }

    // IDEMPOTENCE PAR CONTENU : le même lot ne s'empile pas dans la boîte du produit.
    const sceau = lot.sceauConfie;
    const dejaLa = existsSync(boite) && readdirSync(boite).filter((f) => f.endsWith(".md"))
      .some((f) => readFileSync(join(boite, f), "utf8").includes(sceau));
    if (dejaLa) { ignores += 1; console.log(`[DÉJÀ DÉPOSÉ] ${ligne.produit} — empreinte ${sceau}, rien de redéposé`); continue; }

    const nom = `pilot - TRAVAUX - ${jour}${indice}`;
    if (ESSAI) {
      console.log(`\n===== ESSAI, RIEN ÉCRIT : ${ligne.dossier}\\input\\00-travaux\\${nom}.md (${lot.elements} élément(s), sceau ${sceau})`);
      console.log(lot.md.slice(0, 900) + "\n[…]");
      continue;
    }
    mkdirSync(boite, { recursive: true });
    writeFileSync(join(boite, `${nom}.md`), lot.md, "utf8");
    writeFileSync(join(boite, `${nom}.tf.jsonl`), lot.sidecar, "utf8");
    deposes += 1;
    console.log(`[DÉPOSÉ] ${ligne.produit} → input\\00-travaux\\${nom}.md (${lot.elements} élément(s), sceau ${sceau})`);
  }

  console.log(`\n${deposes} lot(s) déposé(s), ${ignores} déjà présent(s), ${refuses} refusé(s) avant dépôt.`);
  console.log("AUCUN commit n'a été fait chez aucun produit : déposer dans une boîte d'entrée est réversible,");
  console.log("entrer dans un historique est un geste dont le produit est seul auteur.");
  process.exit(refuses ? 1 : 0);
}
