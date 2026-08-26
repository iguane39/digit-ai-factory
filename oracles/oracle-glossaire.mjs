#!/usr/bin/env node
/**
 * oracle-glossaire — la terminologie d'un projet multilingue tient sa FORME opposable.
 *
 * ============================================================================================
 * POURQUOI (TF-0639 à TF-0643 et TF-0637, lots des 25 et 26/08/2026)
 * ============================================================================================
 *
 * LA CONNAISSANCE TERMINOLOGIQUE N'AVAIT NULLE PART OÙ VIVRE. Elle naissait dans une conversation
 * et mourait avec elle : aucun fichier ne portait, par langue, le terme retenu, les termes
 * proscrits et le motif. La session suivante réécrivait le mot, et AUCUN CONTRÔLE NE POUVAIT LE
 * REFUSER — un contrôle ne juge pas un choix qui n'est écrit nulle part.
 *
 * ET LE GLOSSAIRE LUI-MÊME A FAIT AUTORITÉ À TORT : le lendemain de sa livraison sur un produit du
 * parc, 3 entrées sur 7 portaient un terme retenu FAUX, plus une proscription fausse. Elles
 * portaient toutes les marques de la fiabilité — une date, un motif rédigé, deux sources citées.
 * *Un glossaire non vérifié est plus dangereux qu'une absence de glossaire, parce qu'il fait
 * autorité et qu'on cesse de chercher.*
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET CE QUI NE PEUT PAS L'ÊTRE
 * ============================================================================================
 *
 * La FORME, jamais le fond — *un oracle peut dire que le champ manque, jamais qu'il est juste.*
 * C'est le même patron que R-45, R-49 et O9 : déclarer `aucun` ou `partout` est GRATUIT et suffit,
 * parce que l'omission ne vaut pas décision alors que l'aveu se date et s'oppose.
 *
 *   G1  chaque terme déclare `categorie` dans le jeu fermé { visibilite, contractuel } ;
 *   G2  chaque ligne de locale porte un `retenu` non vide ;
 *   G3  chaque ligne porte `proscrits` et `portee` — « aucun » et « partout » sont gratuits ;
 *   G4  chaque ligne porte `verifie_le` au format AAAA-MM-JJ ;
 *   G5  un terme de catégorie `visibilite` cite AU MOINS DEUX preuves de nature différente ;
 *   G6  aucun `retenu` d'une locale ne figure dans les `proscrits` de la MÊME locale.
 *   G7  la preuve d'un terme de `visibilite` dit COMMENT la rejouer — la commande entre accents graves.
 *
 * G5 EST LA RÈGLE QUI VIENT D'UN COÛT PRÉCIS (TF-0637). Une complétion de recherche interrogée
 * langue par langue a désigné « gite » comme le terme le plus suggéré dans six langues étrangères —
 * dix complétions en italien, le score le plus élevé du test. Deux biais l'invalidaient et AUCUN
 * n'était visible dans la donnée : le paramètre de langue fixait l'INTERFACE et non le pays du
 * chercheur, et en italien le mot est un HOMOGRAPHE AU SENS OPPOSÉ. Le score le plus élevé du test
 * mesurait donc l'inverse de ce qu'on cherchait. Une sonde unique ne se contredit jamais toute
 * seule ; c'est la seconde, de nature différente, qui le fait (même famille que N-16).
 *
 * G6 EST LA SEULE CONTRADICTION INTERNE QU'UN ORACLE PUISSE VOIR : un mot proscrit et retenu dans
 * la même locale est faux quel que soit le sens des mots.
 *
 * LA BORNE : un fichier dont le frontmatter ne déclare pas `role:` … glossaire n'est PAS concerné.
 * Sans elle, la règle s'inventerait une cible — et une règle qui crie sur ce qui ne la regarde pas
 * s'apprend à être ignorée.
 *
 * Contrat : JSON {oracle, version, cible, verdict, findings[], non_juge[]} · exit 0/1/2.
 * Usage : node oracle-glossaire.mjs <GLOSSAIRE.md>     → verdict JSON
 *         node oracle-glossaire.mjs --self-test        → fixtures double sens
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CATEGORIES = ["visibilite", "contractuel"];
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Les colonnes attendues du tableau d'un terme, dans l'ordre où le gabarit les pose. */
const COLONNES = ["locale", "retenu", "proscrits", "portee", "preuve", "verifie_le"];

/**
 * `genre` est une SEPTIEME colonne, OPTIONNELLE (TF-0660). Un glossaire ecrit avant le 26/08
 * n'en porte pas, et il reste parfaitement valide : la regle a bouge, pas le depot. Ce qui est
 * refuse, c'est une valeur ecrite au hasard — un genre faux est pire qu'un genre absent, parce
 * qu'un controle s'appuiera dessus pour accuser.
 */
const COLONNE_GENRE = "genre";
const GENRES = ["m", "f", "n", "invariable"];

/** Découpe un texte en TERMES : une section `##` qui porte un champ `categorie`. */
export function termesDe(texte) {
  const lignes = texte.split(/\r?\n/);
  const termes = [];
  let courant = null;
  for (const brute of lignes) {
    const titre = /^##\s+(.+?)\s*$/.exec(brute);
    if (titre) {
      if (courant) termes.push(courant);
      courant = { nom: titre[1], categorie: null, pivot: null, lignes: [], brut: [] };
      continue;
    }
    if (!courant) continue;
    courant.brut.push(brute);
    const champ = /^\s*-\s+\*\*(categorie|pivot)\*\*\s*:\s*(.+?)\s*$/i.exec(brute);
    if (champ) { courant[champ[1].toLowerCase()] = champ[2].trim(); continue; }
    // Une ligne de tableau : `| a | b | … |`. L'en-tête et le séparateur sont écartés.
    if (/^\s*\|/.test(brute)) {
      const cellules = brute.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      // SIX colonnes, ou SEPT avec `genre`. Toute autre largeur rend le tableau illisible et
      // AUCUNE ligne n'est jugee — on ne devine pas quelle colonne manque.
      if (cellules.length !== COLONNES.length && cellules.length !== COLONNES.length + 1)
        return { erreurColonnes: { terme: courant.nom, vu: cellules.length, brute } };
      if (cellules[0].toLowerCase() === "locale") continue;             // en-tête
      if (/^-{2,}$/.test(cellules[0].replace(/[:\s]/g, ""))) continue;  // séparateur
      const ligne = Object.fromEntries(COLONNES.map((c, i) => [c, cellules[i]]));
      if (cellules.length === COLONNES.length + 1) ligne[COLONNE_GENRE] = cellules[COLONNES.length];
      courant.lignes.push(ligne);
    }
  }
  if (courant) termes.push(courant);
  // Seules les sections qui portent une `categorie` sont des TERMES : les sections de doctrine
  // du gabarit (« Pourquoi ce fichier existe », « La forme ») n'en sont pas, et les juger
  // reviendrait à accuser le mode d'emploi.
  return { termes: termes.filter((t) => t.categorie !== null) };
}

export function juger(texte) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message, ou) => findings.push({ regle, statut: "FAIL", message, ...(ou ? { ou } : {}) });

  // LA BORNE, jugée avant tout : ce fichier est-il un glossaire ?
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texte);
  // « terminologie » AUTANT que « glossaire » : le gabarit du parc emploie le premier mot, et une
  // borne qui ne reconnaît pas son propre gabarit déclare hors champ le seul fichier qu'elle
  // devait juger. Trouvé en jouant l'oracle sur le gabarit qu'il accompagne, avant publication.
  if (!fm || !/^role\s*:.*(glossaire|terminologie)/im.test(fm[1])) {
    return [{ regle: "G0", statut: "SANS_OBJET",
      message: "ce fichier ne déclare pas `role:` … glossaire — hors du champ de cet oracle. Une règle qui s'invente une cible s'apprend à être ignorée" }];
  }

  const decoupe = termesDe(texte);
  if (decoupe.erreurColonnes) {
    const e = decoupe.erreurColonnes;
    return [{ regle: "G0", statut: "FAIL",
      message: `tableau du terme « ${e.terme} » : ${e.vu} colonne(s) au lieu de ${COLONNES.length} (${COLONNES.join(", ")}) — le tableau n'est pas lisible, aucune ligne n'est jugée`,
      ou: e.brute.trim().slice(0, 90) }];
  }
  const termes = decoupe.termes;
  if (!termes.length) {
    return [{ regle: "G0", statut: "FAIL",
      message: "aucun terme : un glossaire vide fait autorité comme un glossaire plein — il dit « rien à surveiller » alors qu'il dit « rien n'a été regardé »" }];
  }

  // G1 — la catégorie, en jeu fermé
  const horsJeu = termes.filter((t) => !CATEGORIES.includes(t.categorie.toLowerCase()));
  if (horsJeu.length) ko("G1", `${horsJeu.length} terme(s) hors du jeu fermé { ${CATEGORIES.join(", ")} } : ` +
    "les deux catégories n'ont pas la même exigence de preuve — un terme de visibilité se prouve par une source externe, " +
    "un terme contractuel par l'exactitude lexicale. Les confondre fait sur-chercher les évidences et sous-chercher les termes à trafic",
    horsJeu.map((t) => `${t.nom} → « ${t.categorie} »`).join(" · "));
  else ok("G1", `${termes.length} terme(s), tous dans le jeu fermé { ${CATEGORIES.join(", ")} }`);

  const toutesLignes = termes.flatMap((t) => t.lignes.map((l) => ({ ...l, terme: t.nom, categorie: t.categorie.toLowerCase() })));
  if (!toutesLignes.length) ko("G2", "aucune ligne de locale : un terme sans locale ne prescrit rien");
  else {
    // G2 — le mot retenu
    const sansRetenu = toutesLignes.filter((l) => !l.retenu || l.retenu === "—");
    if (sansRetenu.length) ko("G2", `${sansRetenu.length} ligne(s) sans terme RETENU — c'est le seul champ qu'aucune valeur par défaut ne remplace`,
      sansRetenu.map((l) => `${l.terme}/${l.locale}`).join(" · "));
    else ok("G2", `${toutesLignes.length} ligne(s), chacune avec son terme retenu`);

    // G3 — proscrits et portée, dont l'aveu est gratuit
    const sansAveu = toutesLignes.filter((l) => !l.proscrits || !l.portee || l.proscrits === "—" || l.portee === "—");
    if (sansAveu.length) ko("G3", `${sansAveu.length} ligne(s) sans \`proscrits\` ou sans \`portee\` — ` +
      "déclarer « aucun » et « partout » est GRATUIT et suffit : l'omission ne vaut pas décision, l'aveu se date et s'oppose. " +
      "Mesuré : « deposit » est l'usage anglais correct pour la caution, et ambigu dès que la page parle aussi de l'acompte",
      sansAveu.map((l) => `${l.terme}/${l.locale}`).join(" · "));
    else ok("G3", "chaque ligne déclare ses proscrits et sa portée");

    // G4 — la date de vérification
    const malDatees = toutesLignes.filter((l) => !DATE_ISO.test(l.verifie_le || ""));
    if (malDatees.length) ko("G4", `${malDatees.length} ligne(s) sans \`verifie_le\` au format AAAA-MM-JJ — ` +
      "c'est le SEUL champ qui distingue une entrée éprouvée d'une entrée plausible. Mesuré : 3 entrées sur 7 étaient fausses " +
      "le lendemain de leur livraison, et toutes portaient une date, un motif rédigé et deux sources",
      malDatees.map((l) => `${l.terme}/${l.locale} → « ${l.verifie_le} »`).join(" · "));
    else ok("G4", `${toutesLignes.length} ligne(s) datées au format AAAA-MM-JJ`);

    // G5 — deux preuves de nature différente pour un terme de VISIBILITÉ
    const visibilite = toutesLignes.filter((l) => l.categorie === "visibilite");
    const sondeUnique = visibilite.filter((l) => (l.preuve || "").split("·").map((x) => x.trim()).filter(Boolean).length < 2);
    if (!visibilite.length) ok("G5", "aucun terme de visibilité — rien à corroborer");
    else if (sondeUnique.length) ko("G5", `${sondeUnique.length} ligne(s) de VISIBILITÉ sur ${visibilite.length} adossée(s) à une seule preuve : ` +
      "une sonde unique porte un biais que la donnée ne montre pas. Mesuré — une complétion de recherche a désigné un mot comme " +
      "le plus suggéré dans six langues ; le paramètre fixait la langue d'INTERFACE et non le pays du chercheur, et le mot était " +
      "un homographe au sens opposé dans l'une d'elles. Le score le plus élevé du test mesurait l'INVERSE. Deux preuves de nature " +
      "différente, séparées par ` · `",
      sondeUnique.map((l) => `${l.terme}/${l.locale}`).join(" · "));
    else ok("G5", `${visibilite.length} ligne(s) de visibilité, chacune adossée à au moins deux preuves`);

    // G7 — UNE PREUVE QU'AUCUN SCRIPT NE REJOUE VIEILLIT EN SILENCE (TF-0657, 26/08/2026).
    //
    // LE FAIT, remonté par un produit. Les motifs de son glossaire portaient des preuves NOMMÉES
    // et DATÉES — « complétions de recherche, hl=es gl=ES, 10 résultats », vérifié le 25/08,
    // confiance haute. AUCUN SCRIPT DU DÉPÔT NE LES REPRODUISAIT : une recherche exhaustive sur
    // le nom de la sonde rendait zéro fichier. Pour répondre à une question du commanditaire, la
    // sonde a dû être RÉÉCRITE pendant la session.
    //
    // CE QUE LE REJEU A RÉVÉLÉ, et que le motif ne disait pas : le terme était confirmé, mais la
    // requête témoin était POLLUÉE PAR UN HOMONYME — le même mécanisme qui avait produit une
    // proscription FAUSSE quelques jours plus tôt. Une preuve qu'on ne rejoue pas ne se contredit
    // jamais toute seule.
    //
    // MÊME DOCTRINE QUE R-49 du socle : une constante qui désigne une ressource EXTERNE dit
    // comment on l'a vérifiée — date, source, COMMANDE, et limites structurelles. Ici l'objet est
    // un terme de marché, et la commande manquait.
    //
    // CE QUI EST JUGÉ : la PRÉSENCE d'un fragment entre accents graves dans la preuve d'un terme
    // de VISIBILITÉ — c'est-à-dire de quoi rejouer. Jamais que la commande soit juste, ni qu'elle
    // rende encore le même résultat : un oracle peut dire que le moyen manque, jamais qu'il marche.
    // Les termes CONTRACTUELS n'y sont pas soumis : leur preuve est l'exactitude lexicale et la
    // cohérence interlangue, qui se lisent dans le produit et non dans une sonde externe.
    {
      const rejouables = toutesLignes.filter((l) => l.categorie === "visibilite");
      const muettes = rejouables.filter((l) => !/`[^`]{3,}`/.test(l.preuve || ""));
      if (!rejouables.length) findings.push({ regle: "G7", statut: "SANS_OBJET",
        message: "aucun terme de visibilité — aucune sonde externe à rejouer" });
      else if (muettes.length) ko("G7", `${muettes.length} ligne(s) de VISIBILITÉ sur ${rejouables.length} dont la preuve ne dit pas COMMENT la rejouer : ` +
        "une preuve nommée et datée qu'aucun script ne reproduit vieillit en silence. Mesuré — un glossaire portait « vérifié le 25/08, " +
        "confiance haute » sur une sonde qu'aucun fichier du dépôt ne rejouait ; réécrite à la main, elle a révélé que la requête témoin " +
        "était polluée par un homonyme, le mécanisme même qui avait produit une proscription FAUSSE. Écrire la commande entre accents " +
        "graves — même doctrine que R-49",
        muettes.map((l) => `${l.terme}/${l.locale}`).join(" · "));
      else ok("G7", `${rejouables.length} ligne(s) de visibilité, chacune avec de quoi rejouer sa sonde`);
    }

    // G6 — la contradiction interne, la seule qu'un oracle puisse voir
    //
    // UN TERME PROSCRIT S'ÉCRIT ENTRE ACCENTS GRAVES, et cette convention n'est pas cosmétique :
    // la cellule `proscrits` porte le mot ET sa glose, et la glose nomme légitimement le terme
    // retenu (« `Pool` — employé dans un title quand le catalogue dit Hallenbad 29 fois »).
    // Le premier jet comparait le retenu à la cellule ENTIÈRE : il accusait donc le gabarit que
    // cet oracle accompagne, sur son propre exemple. Trouvé en jouant l'oracle sur ce gabarit
    // avant publication — c'est la seule mesure qui pouvait le montrer.
    const motsProscrits = (cellule) => [...(cellule || "").matchAll(/`([^`]+)`/g)].map((m) => m[1].trim().toLowerCase());
    const jugeables = toutesLignes.filter((l) => motsProscrits(l.proscrits).length);
    const contradictoires = jugeables.filter((l) => {
      const retenu = (l.retenu || "").replace(/`/g, "").trim().toLowerCase();
      return retenu && motsProscrits(l.proscrits).includes(retenu);
    });
    if (contradictoires.length) ko("G6", `${contradictoires.length} ligne(s) dont le terme RETENU figure aussi dans ses PROSCRITS — ` +
      "c'est faux quel que soit le sens des mots, et c'est la seule contradiction qu'un oracle puisse voir sans les comprendre",
      contradictoires.map((l) => `${l.terme}/${l.locale} → « ${l.retenu} »`).join(" · "));
    else if (!jugeables.length) findings.push({ regle: "G6", statut: "SANS_OBJET",
      message: "aucune ligne ne porte de terme proscrit entre accents graves — la contradiction interne n'est pas jugeable ici. "
        + "Un mot proscrit s'écrit `ainsi` : c'est ce qui le distingue de la glose qui l'explique" });
    else ok("G6", `${jugeables.length} ligne(s) à proscription explicite, aucun terme retenu n'y figure`);

    // G8 — un GENRE déclaré appartient au vocabulaire fermé (TF-0660)
    //
    // La colonne `genre` est OPTIONNELLE : une ligne sans elle n'est pas en défaut, et un
    // glossaire antérieur au 26/08 n'en porte aucune. C'est la règle qui a bougé, pas le dépôt.
    //
    // CE QUI EST REFUSÉ, c'est une valeur écrite au hasard — `masculin`, `M.`, `le`. Un genre
    // FAUX est pire qu'un genre ABSENT : absent, le contrôle d'accord se tait ; faux, il accuse
    // des phrases justes en s'appuyant dessus. C'est la même doctrine que `categorie`, dont le
    // jeu fermé existe parce qu'une valeur libre ne se contrôle pas.
    const avecGenre = toutesLignes.filter((l) => (l.genre || "").trim());
    const genresFaux = avecGenre.filter((l) => !GENRES.includes(l.genre.trim().toLowerCase()));
    if (genresFaux.length) ko("G8", `${genresFaux.length} ligne(s) dont le \`genre\` n'est pas dans le jeu fermé ` +
      `(${GENRES.join(", ")}) — un genre FAUX est pire qu'un genre ABSENT : absent, le contrôle d'accord se tait ; ` +
      "faux, il accuse des phrases justes en s'appuyant dessus",
      genresFaux.map((l) => `${l.terme}/${l.locale} → « ${l.genre} »`).join(" · "));
    else if (!avecGenre.length) findings.push({ regle: "G8", statut: "SANS_OBJET",
      message: "aucune ligne ne déclare de `genre` — la colonne est OPTIONNELLE (TF-0660) et son absence n'est pas un défaut. "
        + "Conséquence à connaître : le contrôle d'accord de forge-tests n'a rien à lire ici, et se taira" });
    else ok("G8", `${avecGenre.length} ligne(s) déclarent un genre, toutes dans le jeu fermé`);
  }
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.every((x) => x.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS");

const NON_JUGE = [
  "la JUSTESSE d'une entrée : qu'un terme retenu soit le bon mot dans cette langue demande de "
  + "comprendre la langue. Mesuré : 3 entrées sur 7 étaient fausses en portant toutes les marques "
  + "de la fiabilité. C'est `verifie_le` qui date la vérification, et une relecture humaine qui la tranche",
  "la COMPLÉTUDE : qu'un glossaire couvre le vocabulaire réellement servi. Un balayage systématique "
  + "du catalogue de langue a fait entrer huit termes là où un glossaire constitué au fil des défauts "
  + "n'en portait qu'un — cet oracle juge ce qui est écrit, jamais ce qui manque",
  "l'APPLICATION : que les traductions servies emploient bien le terme retenu. C'est une confrontation "
  + "au catalogue de langue du projet, pas une lecture de ce fichier",
];

const arg = process.argv[2];
if (arg === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "glossaire-"));
  const verte = `---
role: la terminologie opposable du projet — glossaire
verifie_le: 2026-08-26
---

# Glossaire — recette

## logement de vacances

- **categorie** : visibilite
- **pivot** : gîte

| locale | retenu | proscrits | portee | preuve | verifie_le |
|---|---|---|---|---|---|
| fr | gîte | aucun | partout | catalogue servi · \`curl -s 'https://exemple/complete?hl=fr&q=gite'\` | 2026-08-26 |
| it | casa vacanze | \`gite\` — homographe au sens opposé | partout | \`curl -s 'https://exemple/complete?hl=it&q=gite'\` · absence d'article interlangue | 2026-08-26 |

## piscine

- **categorie** : contractuel
- **pivot** : piscine

| locale | retenu | proscrits | portee | preuve | verifie_le | genre |
|---|---|---|---|---|---|---|
| es | piscina cubierta | aucun | partout | catalogue servi | 2026-08-26 | f |

## caution

- **categorie** : contractuel
- **pivot** : caution

| locale | retenu | proscrits | portee | preuve | verifie_le |
|---|---|---|---|---|---|
| en | security deposit | \`deposit\` seul — ambigu | ambigu si la page parle aussi de l'acompte | catalogue servi | 2026-08-26 |

## piscine couverte

- **categorie** : visibilite
- **pivot** : piscine couverte

| locale | retenu | proscrits | portee | preuve | verifie_le |
|---|---|---|---|---|---|
| de | Hallenbad | \`Pool\` — employé dans un title quand le catalogue dit Hallenbad | partout | comptage sur le catalogue servi · \`curl -s 'https://exemple/complete?hl=de&q=hallenbad'\` | 2026-08-26 |
`;
  // SIX DÉFAUTS INDÉPENDANTS, un par règle. Ils sont répartis sur TROIS termes différents, et ce
  // n'est pas un détail de mise en scène : au premier jet, le défaut de G1 (catégorie hors jeu)
  // était posé sur le SEUL terme de visibilité de la fixture — il lui retirait donc sa catégorie,
  // G5 n'avait plus de cible et rendait PASS. Une fixture rouge dont un défaut en masque un autre
  // laisse croire qu'une règle est tenue alors qu'elle n'a rien jugé.
  const rouge = verte
    .replace("- **categorie** : visibilite\n- **pivot** : gîte", "- **categorie** : marketing\n- **pivot** : gîte")  // G1
    .replace("| fr | gîte | aucun | partout | catalogue servi · \`curl -s 'https://exemple/complete?hl=fr&q=gite'\` | 2026-08-26 |",
             "| fr | gîte | \`gîte\` — proscrit ET retenu | partout | catalogue servi | hier |")      // G4 et G6
    .replace("| en | security deposit | \`deposit\` seul — ambigu | ambigu si la page parle aussi de l'acompte | catalogue servi | 2026-08-26 |",
             "| en |  | — | — | catalogue servi | 2026-08-26 |")                                   // G2 et G3
    .replace("| de | Hallenbad | \`Pool\` — employé dans un title quand le catalogue dit Hallenbad | partout | comptage sur le catalogue servi · \`curl -s 'https://exemple/complete?hl=de&q=hallenbad'\` | 2026-08-26 |",
             "| de | Hallenbad | \`Pool\` — employé dans un title | partout | comptage sur le catalogue servi | 2026-08-26 |")
    .replace("| es | piscina cubierta | aucun | partout | catalogue servi | 2026-08-26 | f |",
             "| es | piscina cubierta | aucun | partout | catalogue servi | 2026-08-26 | feminin |");  // G8
  const horsChamp = "---\nrole: une note quelconque\n---\n\n## un titre\n\ndu texte.\n";
  writeFileSync(join(dir, "verte.md"), verte, "utf8");
  writeFileSync(join(dir, "rouge.md"), rouge, "utf8");
  writeFileSync(join(dir, "hors-champ.md"), horsChamp, "utf8");
  const moi = fileURLToPath(import.meta.url);
  const jouer = (f) => spawnSync(process.execPath, [moi, join(dir, f)], { encoding: "utf8" });
  const rv = jouer("verte.md"), rr = jouer("rouge.md"), rh = jouer("hors-champ.md");
  const casse = [];
  if (rv.status !== 0) casse.push("la fixture VERTE ne passe pas : " + rv.stdout.slice(0, 400));
  if (rr.status !== 1) casse.push("la fixture ROUGE ne FAIL pas");
  else for (const regle of ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"]) {
    if (!new RegExp(`"${regle}"[^}]*FAIL`).test(rr.stdout)) casse.push(`la rouge échoue mais pas sur ${regle}`);
  }
  // LA BORNE A SON PROPRE CAS : sans elle, l'oracle accuserait tout document du dépôt.
  if (!/"SANS_OBJET"/.test(rh.stdout)) casse.push("un fichier hors champ n'est pas déclaré SANS_OBJET — la règle s'invente une cible");
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test glossaire : 9/9 PASS (verte PASS ; rouge FAIL sur G1 catégorie hors jeu, G2 retenu vide, G3 aveu absent, G4 date non ISO, G5 sonde unique, G6 retenu proscrit, G7 preuve non rejouable, G8 genre hors jeu ferme ; hors champ SANS_OBJET)");
  process.exit(casse.length ? 1 : 0);
}

if (!arg || !existsSync(arg)) {
  console.log(JSON.stringify({ oracle: "oracle-glossaire", verdict: "ERREUR",
    message: "glossaire introuvable — usage : node oracle-glossaire.mjs <GLOSSAIRE.md> | --self-test" }));
  process.exit(2);
}
const findings = juger(readFileSync(arg, "utf8"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-glossaire", version: "1.0.0", cible: arg, verdict, findings, non_juge: NON_JUGE }, null, 1));
process.exit(verdict === "FAIL" ? 1 : 0);
