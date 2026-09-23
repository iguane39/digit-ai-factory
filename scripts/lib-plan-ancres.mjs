/**
 * lib-plan-ancres.mjs — le FORMAT d'un plan applicable et de sa carte des sources de vérité, écrit
 * en UN seul endroit (TF-1318, étapes B2 et B8 de la chaîne « audite les traductions »).
 *
 * ============================================================================================
 * LE FAIT, ET CE QU'IL A COÛTÉ
 * ============================================================================================
 *
 * Au tour 4 d'une session d'audit des traductions (lot `Produit-02 - RETOURS - 20260826f`,
 * section « Chaîne B »), l'exploitant a dû demander un plan « directement applicable par l'IA
 * suivante », puis en spécifier LA FORME À LA MAIN : ancres verbatim, sidecar machine, carte des
 * sources de vérité distinguant la SOURCE de l'ARTEFACT. Ce sont des étapes de méthode, identiques
 * d'un produit à l'autre, et elles ont été réinventées en pleine session.
 *
 * La distinction source / artefact n'est pas une coquetterie : sur le même produit, un run a
 * modifié 9 fichiers SOURCES, et le build a régénéré 203 pages (lot `20260823a`). Une correction
 * posée sur l'une de ces 203 pages est écrasée au build suivant, sans un mot.
 *
 * ============================================================================================
 * POURQUOI UNE BIBLIOTHÈQUE, ET PAS DEUX LECTURES DU MÊME FORMAT
 * ============================================================================================
 *
 * Deux programmes lisent ce format : le PRODUCTEUR (`scripts/produire-plan-ancres.mjs`, qui rend
 * les sections de la fiche depuis le sidecar machine) et le JUGE
 * (`oracles/oracle-remise-traduction.mjs`, règles T2 et T7). Deux analyseurs d'un même format,
 * c'est la classe de défaut qui a coûté dix listes d'exclusion divergentes (TF-0543). Le format
 * vit donc ici, et la recette du producteur fait relire par le juge ce que le producteur a rendu :
 * si l'un dérive, elle rougit.
 *
 * Aucune fonction de ce module n'écrit sur le disque, et aucune ne hache : il lit, compte et rend
 * du texte.
 */
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

/** Le nom ET la version du sidecar machine : un lecteur qui rencontre `@2` sait qu'il ne sait pas lire. */
export const FORMAT = "plan-ancres@1";

/** Le jeu FERMÉ des natures d'un fichier dans la carte. Une valeur libre ne se contrôle pas. */
export const NATURES = ["source", "artefact"];

/**
 * Une ancre verbatim déclarée dans une fiche : `- \`<texte exact>\` → <chemin>` — le contrat de la
 * règle T2. Il vivait dans l'oracle ; il vit ici depuis que le producteur l'écrit aussi.
 */
export const ANCRE = /^\s*[-*]\s*`([^`]+)`\s*(?:→|->|:)\s*(\S+)\s*$/gm;

/** Les ancres d'un texte de fiche, dans l'ordre où elles sont écrites. */
export function ancresDe(texte) {
  return [...String(texte || "").matchAll(ANCRE)].map((m) => ({ texte: m[1], cible: m[2] }));
}

/** Un chemin comparable : séparateurs unifiés, `./` de tête et accents graves ôtés. */
export function cheminNormal(p) {
  return String(p || "").trim().replace(/^`|`$/g, "").replace(/\\/g, "/").replace(/^\.\//, "");
}

/** Une cellule « vide » : rien, un tiret, ou un aveu d'absence. L'omission ne vaut pas déclaration. */
const VIDE = (v) => !String(v || "").replace(/`/g, "").trim()
  || /^(—|–|-|aucun|aucune|n\/a|néant)$/i.test(String(v).replace(/`/g, "").trim());

/**
 * La carte des sources de vérité, lue dans le TEXTE de sa section (titre exclu) : un tableau à
 * quatre colonnes `fichier | nature | source | régénéré par`. Une ligne d'une autre largeur n'est
 * pas devinée : elle est rendue dans `illisibles`, et le juge la refuse.
 *
 * Une barre verticale À L'INTÉRIEUR d'une cellule s'écrit `\|` — une commande de régénération peut
 * légitimement en porter une, et la couper au milieu déclarerait une colonne de trop.
 */
export function lireCarte(bloc) {
  const lignes = [];
  const illisibles = [];
  for (const brute of String(bloc || "").split(/\r?\n/)) {
    if (!/^\s*\|/.test(brute)) continue;
    const cellules = brute.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/)
      .map((c) => c.replace(/\\\|/g, "|").trim());
    if (cellules.length !== 4) { illisibles.push(brute.trim()); continue; }
    if (/^fichier$/i.test(cellules[0])) continue;                              // en-tête
    if (/^:?-{2,}:?$/.test(cellules[0].replace(/\s/g, ""))) continue;          // séparateur
    lignes.push({
      fichier: cheminNormal(cellules[0]),
      nature: cellules[1].replace(/`/g, "").trim().toLowerCase(),
      source: cheminNormal(cellules[2]),
      regenere_par: cellules[3].trim(),
    });
  }
  return { lignes, illisibles };
}

/**
 * Juge une carte et sa CONSÉQUENCE sur les ancres. Rend des constats `{ regle, ou, message }` —
 * une liste vide veut dire « tenue ». Quatre règles, chacune née du même fait :
 *
 *   C1 · la nature appartient au jeu fermé { source, artefact } ;
 *   C2 · un ARTEFACT nomme sa SOURCE et la commande qui le RÉGÉNÈRE — sans elles, celui qui
 *        applique le plan sait qu'il ne faut pas toucher le fichier, pas ce qu'il faut toucher ;
 *   C3 · tout fichier visé par une ancre est DÉCLARÉ dans la carte — un fichier absent de la carte
 *        est un fichier dont on ne sait pas si la correction survivra ;
 *   C4 · aucune ancre ne vise un ARTEFACT — la correction y serait écrasée au build suivant.
 */
export function jugerCarte(lignes, ciblesAncrees = []) {
  const constats = [];
  const parFichier = new Map();
  for (const l of lignes) parFichier.set(cheminNormal(l.fichier), l);
  for (const l of lignes) {
    if (!NATURES.includes(l.nature)) {
      constats.push({ regle: "C1", ou: l.fichier,
        message: `nature « ${l.nature || "(vide)"} » hors du jeu fermé { ${NATURES.join(", ")} }` });
      continue;
    }
    if (l.nature !== "artefact") continue;
    if (VIDE(l.source)) constats.push({ regle: "C2", ou: l.fichier,
      message: "ARTEFACT sans SOURCE nommée — celui qui applique sait quoi ne pas toucher, pas quoi toucher" });
    if (VIDE(l.regenere_par)) constats.push({ regle: "C2", ou: l.fichier,
      message: "ARTEFACT sans commande de RÉGÉNÉRATION — rien ne dit comment le refaire depuis sa source" });
  }
  for (const cible of new Set(ciblesAncrees.map(cheminNormal))) {
    const l = parFichier.get(cible);
    if (!l) {
      constats.push({ regle: "C3", ou: cible,
        message: "fichier visé par une ancre et ABSENT de la carte : rien ne dit si la correction survivra au build" });
    } else if (l.nature === "artefact") {
      constats.push({ regle: "C4", ou: cible,
        message: `ancre posée sur un ARTEFACT, régénéré depuis « ${l.source || "?"} » par ${l.regenere_par || "?"} : `
          + "la correction serait écrasée au build suivant — viser la source" });
    }
  }
  return constats;
}

/** Une cellule de tableau Markdown : barre verticale échappée, fin de ligne aplatie. */
const cellule = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

/** La section `## Sources de vérité`, rendue depuis les `sources` du sidecar. */
export function rendreCarte(sources) {
  const l = ["## Sources de vérité", "",
    "| fichier | nature | source | régénéré par |", "|---|---|---|---|"];
  for (const s of sources) {
    const commande = String(s.regenere_par || "").trim();
    const rendue = !commande ? "—" : commande.includes("`") ? cellule(commande) : "`" + cellule(commande) + "`";
    l.push(`| ${cellule(s.fichier)} | ${cellule(s.nature)} | ${cellule(s.source || "—")} | ${rendue} |`);
  }
  return l.join("\n") + "\n";
}

/** La section `## Ancres verbatim`, au format exact que T2 relit. */
export function rendreAncres(modifications) {
  const l = ["## Ancres verbatim", ""];
  for (const m of modifications) l.push(`- \`${m.ancre}\` → ${m.fichier}`);
  return l.join("\n") + "\n";
}

/**
 * La section `## Plan applicable` : ce que la personne relit — avant, après, motif. C'est un
 * TABLEAU et non une liste : une ligne de tableau commence par une barre verticale, jamais par un
 * tiret, et ne peut donc pas être prise pour une ancre par T2.
 */
export function rendrePlan(modifications) {
  const l = ["## Plan applicable", "",
    "| id | fichier | ancre (avant) | remplacement (après) | motif |", "|---|---|---|---|---|"];
  modifications.forEach((m, i) => {
    l.push(`| ${cellule(m.id || `M${i + 1}`)} | ${cellule(m.fichier)} | ${cellule(m.ancre)} | `
      + `${cellule(m.remplacement)} | ${cellule(m.motif || "—")} |`);
  });
  return l.join("\n") + "\n";
}

/** Les positions d'une ancre dans un texte, sans chevauchement — ce qu'un remplacement verrait. */
export function occurrences(contenu, ancre) {
  const vues = [];
  if (!ancre) return vues;
  let i = contenu.indexOf(ancre);
  while (i >= 0) { vues.push(i); i = contenu.indexOf(ancre, i + ancre.length); }
  return vues;
}

/**
 * Juge un plan `plan-ancres@1` AU MOMENT DE LE PRODUIRE. Rend `{ constats, mesure }`.
 *
 *   P1 · l'ancre existe LITTÉRALEMENT dans le fichier visé — le même critère que T2, tenu une étape
 *        plus tôt : un plan ne se rend pas pour être refusé à la remise ;
 *   P2 · l'ancre désigne UN endroit : elle est unique dans son fichier, ou le nombre d'occurrences
 *        déclaré (`occurrences`) est exact. Une ancre présente trois fois oblige celui qui applique
 *        à choisir, et un plan qui fait choisir n'est plus applicable sans jugement ;
 *   P3 · le remplacement est une chaîne DIFFÉRENTE de l'ancre — une modification qui ne change rien
 *        est du bruit dans un plan qu'on relit ligne à ligne ;
 *   P4 · l'ancre s'exprime dans le format de la fiche : une seule ligne, sans accent grave, et un
 *        chemin sans espace (T2 lit le chemin comme un seul mot) ;
 *   P5 · deux modifications d'un même fichier ne se CHEVAUCHENT pas : appliquer la première
 *        détruirait le texte sur lequel la seconde s'ancre ;
 *   C1–C4 · la carte des sources de vérité, jugée par `jugerCarte` — la même fonction que le juge.
 */
export function verifierPlan(plan, racine) {
  const constats = [];
  const modifications = Array.isArray(plan?.modifications) ? plan.modifications : [];
  const sources = Array.isArray(plan?.sources) ? plan.sources : [];
  const contenus = new Map();
  const lire = (f) => {
    if (!contenus.has(f)) {
      const chemin = isAbsolute(f) ? f : join(racine, f);
      let t = null;
      try { t = existsSync(chemin) ? readFileSync(chemin, "utf8") : null; } catch { t = null; }
      contenus.set(f, t);
    }
    return contenus.get(f);
  };
  const plages = new Map();
  modifications.forEach((m, rang) => {
    const id = m?.id || `M${rang + 1}`;
    const fichier = cheminNormal(m?.fichier);
    const ou = `${id} · ${fichier || "(fichier absent)"}`;
    if (!fichier || typeof m?.ancre !== "string" || !m.ancre.length) {
      constats.push({ regle: "P1", ou, message: "modification sans fichier ou sans ancre : rien à chercher, rien à appliquer" });
      return;
    }
    if (/[`\r\n]/.test(m.ancre)) {
      constats.push({ regle: "P4", ou, message: "ancre sur plusieurs lignes ou portant un accent grave : la fiche ne sait pas l'écrire, "
        + "et T2 la lirait tronquée — choisir une ancre d'une seule ligne, sans accent grave" });
    }
    if (/\s/.test(fichier)) {
      constats.push({ regle: "P4", ou, message: "chemin portant une espace : T2 lit le chemin comme un seul mot et chercherait un autre fichier" });
    }
    if (typeof m.remplacement !== "string") {
      constats.push({ regle: "P3", ou, message: "remplacement absent : une ancre sans remplacement n'est pas une modification" });
    } else if (m.remplacement === m.ancre) {
      constats.push({ regle: "P3", ou, message: "remplacement IDENTIQUE à l'ancre : la modification ne change rien" });
    }
    const contenu = lire(fichier);
    if (contenu === null) {
      constats.push({ regle: "P1", ou, message: "fichier visé introuvable sous la racine du plan" });
      return;
    }
    const vues = occurrences(contenu, m.ancre);
    if (!vues.length) {
      constats.push({ regle: "P1", ou, message: `ancre ABSENTE du fichier : « ${m.ancre.slice(0, 60)} » — le plan serait inapplicable` });
      return;
    }
    const attendu = Number.isInteger(m.occurrences) && m.occurrences > 0 ? m.occurrences : 1;
    if (vues.length !== attendu) {
      constats.push({ regle: "P2", ou, message: `ancre présente ${vues.length} fois, ${attendu} déclarée(s) : `
        + "elle ne désigne pas un endroit — allonger l'ancre jusqu'à l'unicité, ou déclarer `occurrences`" });
    }
    if (!plages.has(fichier)) plages.set(fichier, []);
    for (const debut of vues) plages.get(fichier).push({ id, debut, fin: debut + m.ancre.length });
  });
  for (const [fichier, liste] of plages) {
    const triees = [...liste].sort((a, b) => a.debut - b.debut);
    for (let i = 1; i < triees.length; i += 1) {
      const a = triees[i - 1], b = triees[i];
      if (a.id !== b.id && b.debut < a.fin) {
        constats.push({ regle: "P5", ou: `${a.id} × ${b.id} · ${fichier}`,
          message: "deux modifications se CHEVAUCHENT : appliquer la première détruit le texte sur lequel la seconde s'ancre" });
      }
    }
  }
  const lignesCarte = sources.map((s) => ({
    fichier: cheminNormal(s?.fichier),
    nature: String(s?.nature || "").trim().toLowerCase(),
    source: cheminNormal(s?.source),
    regenere_par: String(s?.regenere_par || "").trim(),
  }));
  constats.push(...jugerCarte(lignesCarte, modifications.map((m) => m?.fichier).filter(Boolean)));
  return {
    constats,
    mesure: {
      modifications: modifications.length,
      fichiers_vises: new Set(modifications.map((m) => cheminNormal(m?.fichier)).filter(Boolean)).size,
      carte: lignesCarte.length,
      artefacts: lignesCarte.filter((l) => l.nature === "artefact").length,
    },
  };
}
