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
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifier } from "../gabarits/oracle-travaux-pilot.mjs";
import { empreinteTexte } from "../scripts/lib-empreinte.mjs";
import { relever } from "../scripts/relever-heritage.mjs";

/**
 * LA SECONDE SOURCE DU CANAL (TF-0673). Jusqu'ici cet émetteur ne savait confier qu'UNE classe :
 * les artefacts d'héritage manquants. Tout autre constat destiné à un produit — un correctif que
 * lui seul peut appliquer, un arbitrage qui lui appartient — n'avait AUCUNE VOIE, et retombait
 * donc dans le défaut exact que ce script existe pour corriger : *un état mesuré qui n'atteint
 * pas son destinataire ne devient pas un travail fait.*
 *
 * Un item du registre est confié quand il porte `destinataire_produit` et qu'il n'est pas clos.
 * Le champ est EXPLICITE, jamais déduit d'une cible de forge : « ce constat concerne le produit
 * X » est une décision humaine, pas une inférence — et une inférence déposerait chez un produit
 * du travail que personne n'a voulu lui confier.
 */
/**
 * « Produit-02 » et « Produit-02.com » désignent le même produit : le dépôt porte
 * un suffixe de domaine que le registre n'écrit pas. On normalise les DEUX côtés — minuscules,
 * tout ce qui suit le premier point retiré — puis on compare EXACTEMENT.
 *
 * JAMAIS PAR INCLUSION, et le motif vaut d'être écrit : « Foo » serait alors rapproché de
 * « FooBar », et un constat partirait chez le mauvais produit. Une comparaison lâche qui se
 * trompe dépose du travail chez quelqu'un qui n'en est pas le destinataire — c'est pire que
 * de ne rien déposer, parce que le vrai destinataire n'apprend rien ET qu'un autre est dérangé.
 */
export const normaliserProduit = (n) => String(n || "").toLowerCase().split(".")[0].trim();
export const memeProduit = (a, b) => normaliserProduit(a) === normaliserProduit(b)
  && normaliserProduit(a) !== "";

/**
 * LE RENDU D'UN CONSTAT, et sa seule règle : **les champs manquants ne sont pas inventés.**
 *
 * Un lot qui comblerait les trous du registre par de la prose plausible ferait croire au produit
 * qu'on lui a écrit quelque chose de mesuré. « Non renseigné au registre » est laid à lire — et
 * c'est exactement ce qu'il faut : il désigne le registre, pas le produit, et il se corrige là.
 */
const manque = (quoi) => `**non renseigné au registre** — ${quoi}`;

export const blocConstat = (e) => `### ${e.id} — ${e.titre || "constat sans titre"} · gravité ${e.gravite || "mineur"}

- **Le fait** : ${e.contenu ? String(e.contenu).slice(0, 1400) : manque("le constat n'a pas de contenu")}
- **Pourquoi cela vous concerne** : ${e.pourquoi_produit || "ce constat a été relevé sur votre produit, et sa correction vous appartient — le pilot n'écrit pas dans votre code"}
- **Ce qui est demandé** : ${e.demande_produit || manque("aucune demande explicite — à instruire avec le pilot avant d'agir")}
- **Effort estimé** : ${e.effort || manque("non estimé")}
- **Comment vous saurez que c'est fait** : ${e.verification || manque("aucune vérification déclarée — c'est un manque, pas une dispense")}
- **Si ce n'est pas fait** : ${e.consequence || manque("conséquence non écrite")}`;

/** Les constats destinés à un produit que le parc ne porte PAS. Voir l'avertissement de fin. */
export function orphelins(lignes, chemin = join(PILOT, "todo", "TODO.jsonl")) {
  const produits = lignes.map((l) => l.produit);
  return constatsDestines(chemin)
    .filter((e) => !produits.some((p) => memeProduit(e.destinataire_produit, p)));
}

export function constatsDuRegistre(produit, chemin = join(PILOT, "todo", "TODO.jsonl")) {
  if (!existsSync(chemin)) return [];
  const etat = new Map();
  for (const brute of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    if (!brute.trim()) continue;
    let e;
    try { e = JSON.parse(brute); } catch { continue; }
    if (!e.id) continue;
    etat.set(e.id, { ...(etat.get(e.id) || {}), ...e });
  }
  const clos = new Set(["corrige", "ecarte"]);
  return [...etat.values()]
    .filter((e) => e.destinataire_produit && memeProduit(e.destinataire_produit, produit)
      && !clos.has(e.statut))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

/** Tous les constats destinés à UN produit, quel qu'il soit — pour dénoncer les orphelins. */
export function constatsDestines(chemin = join(PILOT, "todo", "TODO.jsonl")) {
  if (!existsSync(chemin)) return [];
  const etat = new Map();
  for (const brute of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    if (!brute.trim()) continue;
    let e;
    try { e = JSON.parse(brute); } catch { continue; }
    if (!e.id) continue;
    etat.set(e.id, { ...(etat.get(e.id) || {}), ...e });
  }
  const clos = new Set(["corrige", "ecarte"]);
  return [...etat.values()].filter((e) => e.destinataire_produit && !clos.has(e.statut));
}

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
  // TF-0654 : un artefact TROUVE AILLEURS ne se recopie pas — il se DECLARE. Le confondre avec
  // un absent ferait deposer un fichier mort a la racine du depot, et le relevé passerait au
  // vert sur une question restee ouverte.
  const horsRacine = ligne.artefacts.filter((a) => a.etat === "hors_racine");
  if (!absents.length && !perimes.length && !horsRacine.length) return null;

  // L'EMPREINTE D'IDEMPOTENCE PORTE CE QUI EST CONFIE, PAS L'ENVELOPPE QUI LE PORTE.
  // Premier jet : le sceau etait calcule sur le lot ENTIER, titre compris — or le titre porte
  // l'indice du jour, qui change a chaque passage (`a`, puis `b`). Deux executions du meme relevé
  // deposaient donc deux lots identiques dans le fond et differents dans l'octet, et la boite du
  // produit se remplissait — exactement la nuisance que ce canal doit eviter (R-33 bis). Trouve
  // par la recette d'idempotence, qui rendait 4 fichiers au lieu de 2.
  const constats = constatsDuRegistre(ligne.produit);
  const sceauConfie = empreinteTexte([
    ...[...perimes, ...absents, ...horsRacine]
      .map((a) => `${a.cible}|${a.etat}|${a.empreinte_pilot || ""}|${a.empreinte_produit || ""}`),
    // LES CONSTATS ENTRENT DANS LE SCEAU, et leur CONTENU avec eux. Sceller le seul identifiant
    // ferait qu'un constat reformulé garderait l'empreinte de l'ancien : le lot corrigé serait
    // tenu pour déjà déposé et ne partirait jamais. C'est la classe de défaut de N-39 —
    // une valeur qui ne varie que pour une partie de ce qu'elle prétend couvrir.
    ...constats.map((e) => `${e.id}|constat|${empreinteTexte(String(e.contenu || "") + "|"
      + String(e.demande_produit || ""), 12)}`),
  ].sort().join("\n"), 12);

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

  // TF-0654 — LE TROISIEME CAS DEMANDE AUTRE CHOSE QUE LES DEUX AUTRES. Un artefact absent se
  // recopie ; un artefact perime se met a jour ; un artefact TROUVE AILLEURS existe deja et
  // fonctionne peut-etre tres bien. Ce qui manque n'est pas le fichier, c'est la DECLARATION de
  // l'endroit d'ou il est servi. Lui demander de recopier creerait un doublon mort a la racine du
  // depot, et le relevé passerait au vert sur une question ouverte — le pire des deux mondes.
  const blocHorsRacine = (a, jour) => `### TF-0654 — artefact TROUVÉ HORS de la racine du dépôt : \`${a.cible}\` · gravité mineur

- **Le fait**, mesuré le ${jour.slice(6, 8)}/${jour.slice(4, 6)}/${jour.slice(0, 4)} : \`${a.cible}\` n'est pas à la racine de votre dépôt, mais il EXISTE — trouvé à \`${a.trouve_a}\`. Le relevé ne le compte donc **ni absent, ni conforme**.
- **Pourquoi cela vous concerne** : le pilot ne peut pas savoir si \`${a.trouve_a.split("/")[0]}\` est votre racine WEB — le répertoire réellement servi — ou un dossier quelconque. Sans cette déclaration, ce contrôle restera indécis à chaque relevé, et un contrôle indécis qui revient s'apprend à être ignoré.
- **Ce qui est demandé** : DÉCLARER votre racine web dans \`docs/projet/PARAMETRAGE.md\`, sous une ligne \`racine_web:\` de son frontmatter. **Ne recopiez PAS le fichier à la racine du dépôt** : vous y créeriez un doublon qui n'est jamais servi, et le relevé passerait au vert sur un fichier mort.
- **Effort estimé** : simple × court
- **Comment vous saurez que c'est fait** : \`node c:\\\\dev\\\\digit-ai-factory\\\\scripts\\\\relever-heritage.mjs\` cesse de compter cet artefact « hors racine » pour votre projet.
- **Si ce n'est pas fait** : le relevé continue de signaler un écart qui n'en est peut-être pas un, et personne ne peut trancher depuis le pilot.
`;

  const bloc = (a, gravite) => {
    const g = glose[a.cible] || "artefact du contrat d'héritage";
    return `### TF-0626 — ${a.etat === "absent" ? "artefact d'héritage ABSENT" : "artefact d'héritage PÉRIMÉ"} : \`${a.cible}\` · gravité ${gravite}

- **Le fait**, mesuré le ${jour.slice(6, 8)}/${jour.slice(4, 6)}/${jour.slice(0, 4)} : \`${a.cible}\` ${a.etat === "absent"
  ? "n'existe pas dans votre dépôt"
  : `existe mais DIVERGE de la source du pilot (empreintes \`${a.empreinte_pilot}\` contre \`${a.empreinte_produit}\`)`}. Contrat : \`gabarits\\HERITAGE.json\`, mode \`${a.mode}\`.
- **Pourquoi cela vous concerne** : ${g}.
- **Ce qui est demandé** : recopier \`${a.source}\` depuis \`c:\\dev\\digit-ai-factory\\\` vers \`${a.cible}\` de votre dépôt — chemin source DÉCLARÉ par le contrat, jamais déduit de la cible (TF-0645).
- **Effort estimé** : simple × court
- **Comment vous saurez que c'est fait** : \`node c:\\dev\\digit-ai-factory\\scripts\\relever-heritage.mjs\` ne liste plus cet artefact pour votre projet.
- **Si ce n'est pas fait** : ${a.cible.includes("RESTITUTION") || a.cible.includes("hooks")
    ? "vos travaux continuent d'être rendus hors du format prescrit, et aucun contrôle ne le refuse"
    : "l'écart reste, et le contrôle de conformité du pilot continue de le rendre à chaque lot que vous remettez"}`;
  };

  // (le rendu d'un constat vit au niveau module — voir `blocConstat`, jugé par la recette)

  // Le lot cite TOUS les items qu'il porte, pas seulement le premier. Citer un seul identifiant
  // quand le lot en confie quatre laisse le destinataire chercher d'où viennent les trois autres,
  // et rend la remontée de son avancement impossible à rattacher.
  const refsRegistre = [
    ...(perimes.length || absents.length || horsRacine.length ? ["TF-0626"] : []),
    ...constats.map((e) => e.id),
  ].map((i) => `\`${i}\``).join(", ") || "\`aucun\`";
  const items = [...perimes.map((a) => bloc(a, "majeur")), ...absents.map((a) => bloc(a, absents.length > 4 ? "majeur" : "mineur")),
                 ...horsRacine.map((a) => blocHorsRacine(a, jour)),
                 ...constats.map(blocConstat)];

  const md = `# Travaux confiés par le pilot — ${ligne.produit} — ${jour}${indice}

- **Émetteur** : \`digit-ai-factory\` (le pilot)
- **Références registre** : \`todo\\TODO.jsonl\` — item(s) ${refsRegistre}
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

  const sidecarConstats = constats.map((e) => JSON.stringify({
    schema: 1,
    titre: e.titre || `Constat ${e.id}`,
    contenu: String(e.contenu || "").slice(0, 1400),
    origine_tf: e.id,
    gravite: e.gravite || "mineur",
    effort: e.effort || "non estime",
    verification: e.verification || "aucune verification declaree",
  }));

  const sidecar = [...[...perimes, ...absents].map((a) => JSON.stringify({
    schema: 1,
    titre: `${a.etat === "absent" ? "Artefact d'heritage absent" : "Artefact d'heritage perime"} : ${a.cible}`,
    contenu: `Mesure du pilot du ${jour} : ${a.cible} ${a.etat === "absent" ? "n'existe pas" : "diverge de la source"} dans ce depot. ${glose[a.cible] || ""}`,
    origine_tf: "TF-0626",
    gravite: a.cible.includes("RESTITUTION") || a.cible.includes("hooks") ? "majeur" : "mineur",
    effort: "simple × court",
    verification: "node c:\\dev\\digit-ai-factory\\scripts\\relever-heritage.mjs ne liste plus cet artefact",
  })), ...sidecarConstats].join("\n") + "\n";

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
    // Ce filtre-ci reste par INCLUSION, à dessein, et la différence avec `memeProduit` mérite
    // d'être dite : `--produit` est un filtre d'AFFICHAGE tapé par un humain qui voit le résultat
    // et peut recommencer ; le rapprochement d'un constat est une ROUTE automatique dont personne
    // ne relit la cible. Le laxisme est acceptable là où une erreur se voit, jamais là où elle
    // dépose du travail chez quelqu'un.
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
    const lotsPresents = existsSync(boite)
      ? readdirSync(boite).filter((f) => f.endsWith(".md"))
        .map((f) => ({ nom: f, txt: readFileSync(join(boite, f), "utf8") }))
      : [];
    const dejaLa = lotsPresents.some((l) => l.txt.includes(sceau));
    if (dejaLa) { ignores += 1; console.log(`[DÉJÀ DÉPOSÉ] ${ligne.produit} — empreinte ${sceau}, rien de redéposé`); continue; }

    // ---- INCLUSION, ET PAS SEULEMENT ÉGALITÉ (TF-0680, mesure du 26/08/2026) ---------------
    //
    // LE FAIT, pris dans l'heure : le produit avait installé UN des artefacts que le lot `c`
    // demandait. L'empreinte du contenu confié a donc changé, et l'émetteur s'apprêtait à
    // déposer un lot `d` de 5 éléments là où `c` en portait 6 — les 5 STRICTEMENT INCLUS dans
    // les 6. Le produit aurait reçu deux lots quasi identiques en moins d'une heure, le second
    // n'apportant RIEN de neuf.
    //
    // LE COMPORTEMENT ÉTAIT CORRECT AU SENS DE LA RÈGLE ÉCRITE — le contenu a bien changé — ET
    // NUISIBLE AU SENS DE CE QU'ELLE PROTÈGE : « sans cela, deux exécutions du même relevé
    // enseveliraient le produit sous des lots identiques, et le canal deviendrait la nuisance
    // qu'il est censé éviter » (R-33 bis). La règle mesurait l'ÉGALITÉ des contenus quand la
    // propriété visée est l'ABSENCE DE NOUVEAUTÉ.
    //
    // LA BORNE COMPTE AUTANT QUE LA RÈGLE, et elle est dans le constat d'origine : un lot déjà
    // TRAITÉ par le produit ne doit PAS bloquer un redépôt, sans quoi un constat rouvert
    // n'atteindrait plus personne. On ne regarde donc que les lots encore `a_traiter`.
    //
    // L'inclusion se lit sur les ÉLÉMENTS, jamais sur le texte : deux formulations d'un même
    // constat sont le même travail pour le produit.
    const elementsDe = (txt) => new Set([...txt.matchAll(/^### (.+?)\s*$/gm)].map((m) => m[1].trim()));
    const estATraiter = (txt) => /^-\s+\*\*Statut\*\*\s*:\s*a_traiter\s*$/m.test(txt);
    const mien = elementsDe(lot.md);
    const englobant = lotsPresents.find((l) => {
      if (!estATraiter(l.txt)) return false;             // un lot TRAITÉ ne bloque rien
      const sien = elementsDe(l.txt);
      return mien.size > 0 && [...mien].every((e) => sien.has(e));
    });
    if (englobant) {
      ignores += 1;
      console.log(`[INCLUS DANS UN LOT NON TRAITÉ] ${ligne.produit} — les ${mien.size} élément(s) de ce lot ` +
        `sont déjà tous dans « ${englobant.nom} », encore \`a_traiter\`. Rien de neuf à confier : ` +
        "redéposer empilerait un doublon que le produit devrait trier lui-même.");
      continue;
    }

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

  // L'AVERTISSEMENT DES ORPHELINS (TF-0673, second temps). Un constat qui désigne un produit que
  // le parc ne porte pas — nom mal orthographié, produit retiré — n'atteint personne. Avant ce
  // bloc, il disparaissait SANS UN MOT : l'émetteur ne le comptait nulle part.
  //
  // C'est la classe de défaut que cet émetteur venait de corriger, laissée ouverte sur sa face
  // voisine — et le premier jet l'a lui-même payée : trois constats perdus derrière un message
  // parfaitement normal, vus seulement parce qu'une empreinte n'avait pas bougé.
  //
  // IL SORT EN ÉCHEC, et ce n'est pas un excès de zèle : *un avertissement qui n'arrête rien est
  // un avertissement qu'on apprend à lire sans le voir.* Le calcul se fait sur le parc ENTIER,
  // indépendamment de `--produit` : un orphelin l'est vis-à-vis de tous les produits, pas du
  // filtre d'affichage du moment.
  // L'APPARIEMENT EST UNE CONDITION DE VALIDITÉ, pas une commodité. Ce contrôle confronte le
  // registre DU PILOT au parc SCANNÉ. Quand `FORGE_ROOT` désigne un autre parc — une fixture de
  // recette, un clone partiel —, les deux ne parlent pas des mêmes produits : tout constat réel
  // y paraîtrait orphelin, et l'émetteur sortirait en échec sur un parc parfaitement sain.
  //
  // Le cas a été trouvé en RESTAURANT la recette de ce script : deux de ses cas, qui déposent
  // dans un parc de fixture, sont passés au rouge dès que l'avertissement a été branché.
  //
  // Il est DÉCLARÉ non jugé, jamais tu : le silence d'une sonde n'est pas un verdict, et un
  // contrôle silencieusement inactif est indiscernable d'un contrôle qui n'a rien trouvé.
  const apparies = resolve(racine) === resolve(join(PILOT, ".."));
  const perdus = apparies ? orphelins(lignes) : [];
  if (!apparies) {
    console.log("[ORPHELINS — NON JUGÉ] le parc scanné n'est pas celui du pilot "
      + `(${resolve(racine)}) : le registre et le parc ne parlent pas des mêmes produits, `
      + "et tout constat réel y paraîtrait orphelin");
  }
  if (perdus.length) {
    console.error(`\n[ORPHELINS] ${perdus.length} constat(s) désignent un produit que le parc ne porte pas —`);
    console.error("ils n'atteindront JAMAIS personne, et rien d'autre ne le dirait :");
    for (const e of perdus.slice(0, 10))
      console.error(`  - ${e.id} → « ${e.destinataire_produit} » (aucun produit du parc ne correspond)`);
    console.error("Corriger `destinataire_produit` au registre, ou clore l'item avec son motif.");
  }

  console.log("AUCUN commit n'a été fait chez aucun produit : déposer dans une boîte d'entrée est réversible,");
  console.log("entrer dans un historique est un geste dont le produit est seul auteur.");
  process.exit(refuses || perdus.length ? 1 : 0);
}
