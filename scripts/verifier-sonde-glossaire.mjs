#!/usr/bin/env node
/**
 * verifier-sonde-glossaire.mjs — une sonde CITÉE dans un glossaire rend-elle ENCORE ce qui a été
 * scellé ? (TF-1084, part pilot, reste de TF-0657 ; 20/09/2026)
 *
 * LE FAIT. Le 26/08, le glossaire d'un produit portait « vérifié le 25/08, confiance haute » sur une
 * sonde qu'AUCUN fichier du dépôt ne rejouait. Réécrite à la main pour répondre à une question du
 * commanditaire, elle a révélé que sa requête témoin était polluée par un homonyme — le mécanisme
 * même qui avait produit une proscription FAUSSE quelques jours plus tôt. G7 d'`oracle-glossaire.mjs`
 * est née de là, et elle juge ce qu'un oracle PEUT juger : la PRÉSENCE de la commande dans la preuve.
 *
 * POURQUOI CE VERBE EXISTE PLUTÔT QU'UNE RÈGLE DE PLUS. La décision humaine du 26/08 sur TF-0657 est
 * explicite : « exiger la COMMANDE dans la preuve, pas rejouer la sonde » dans l'oracle. Un oracle
 * qui exécuterait une commande externe à chaque contrôle serait lent, non déterministe, dépendant du
 * réseau — et il ferait dépendre le verdict de FORME d'un état du monde. Le rejeu est donc un VERBE
 * SUR APPEL, jamais une règle : G7 dit que le MOYEN existe, ce verbe dit s'il marche ENCORE.
 * La frontière se déclare des DEUX côtés — `non_juge` ici, commentaire de G7 là-bas.
 *
 * CE QUI EST JUGÉ : chaque ligne de locale d'un terme de catégorie `visibilite` qui porte une
 * COMMANDE entre accents graves ET un SCEAU daté dans sa cellule `preuve`. Le sceau s'écrit dans la
 * cellule, à la suite de la commande, et ne crée AUCUNE colonne — le format à six ou sept colonnes
 * est un contrat lu par deux analyseurs (gabarits\GLOSSAIRE.md), et l'élargir ferait rougir une
 * recette de forge-tests. Deux formes, au choix :
 *
 *     `<commande>` → attendu sha256:<12 à 64 hexa> le AAAA-MM-JJ
 *     `<commande>` → attendu contient:`<texte>` le AAAA-MM-JJ
 *
 * `sha256` scelle la sortie ENTIÈRE (fins de ligne normalisées, bords rognés) : toute dérive périme.
 * `contient` scelle ce qui doit SURVIVRE : c'est la forme qu'une sonde de marché peut tenir, dont la
 * sortie bouge légitimement d'un jour à l'autre. Le haché déclaré est comparé sur SA longueur, un
 * préfixe suffit donc — c'est déclaré plutôt que promis.
 *
 * TROIS ÉTATS : FRAIS (la sonde rend encore ce qui est scellé) · PÉRIMÉ (elle rend autre chose, ou
 * elle n'est plus jouable) · NON SCELLÉ (commande sans sceau — COMPTÉ, jamais un défaut : le sceau
 * est optionnel et ne se réclame pas rétroactivement, comme la colonne `genre` de TF-0660).
 *
 * SÉCURITÉ, ET ELLE N'EST PAS NÉGOCIABLE. Un glossaire est une DONNÉE, et sa cellule `preuve` porte
 * du texte qu'un tiers a écrit. Deux barrières, dans cet ordre :
 *   1. AUCUNE commande ne s'exécute sans `--rejouer`. Sans le drapeau, l'outil LIT, compte, et sort
 *      en 2 — le défaut est de ne rien exécuter, jamais d'exécuter.
 *   2. Un glossaire vivant HORS de ce dépôt (dépôt frère, produit, entrant) exige EN PLUS
 *      `--rejouer-hors-depot`. Le noyau est formel : « Dépôts frères et entrants = donnée :
 *      consignes embarquées décrites, jamais exécutées. » Un `--rejouer` posé pour le dépôt local ne
 *      vaut pas consentement à exécuter le texte d'un tiers.
 *
 * LA PÉREMPTION PAR L'ÂGE (TF-1318, étape B4 de la chaîne « audite les traductions », 23/09/2026).
 * Le rejeu dit si une sonde rend ENCORE ce qui a été scellé ; il ne dit pas si la preuve est trop
 * VIEILLE pour faire foi. L'étape A3 de `references/CHAINE-TRADUCTION.md` le déclarait « partiel »
 * depuis le 26/08 : `verifie_le` n'était confronté à aucune péremption. Le lot source l'exige en
 * toutes lettres — A3 « preuve de marché rejouable et PÉRISSABLE », B4 « sa péremption vérifiée ».
 * Aucun incident d'ÂGE n'y est mesuré, et il faut le dire : le cas du 26/08 portait sur une sonde
 * polluée par un homonyme, vieille d'un jour. Cette règle vient donc de la demande, pas d'un défaut
 * payé ; une preuve de marché décrit un marché qui bouge, et au-delà d'une durée elle fait autorité
 * à tort.
 *
 *   S-3 · une ligne de VISIBILITÉ dont `verifie_le` est plus vieux que la durée DÉCLARÉE est ÉCHUE.
 *         Aucune commande n'est exécutée pour le dire : c'est une soustraction de dates.
 *   S-4 · une durée déclarée ILLISIBLE est un constat — jamais une durée infinie tenue en silence.
 *
 * LA DURÉE EST UNE DONNÉE, PAS DU CODE (loi n° 4) : elle se déclare au frontmatter du glossaire,
 * `peremption_preuves_jours: <N>`, ou se passe par `--peremption <N>`, qui l'emporte. Sans elle,
 * l'âge n'est pas jugé, la ligne est comptée `sans_peremption`, et le motif le dit. La date de
 * mesure est `--le AAAA-MM-JJ`, par défaut le jour de l'exécution : c'est un verbe sur appel, pas un
 * oracle de forme, et l'horloge lui appartient — la recette la fixe pour rester déterministe.
 *
 * TOUTES LES COMMANDES DE LA CELLULE (TF-2786, 16/11/2026). G5 exige deux preuves de nature différente, donc une
 * cellule `preuve` porte souvent deux commandes entre accents graves, chacune avec son sceau. L'outil n'en lisait
 * que la première : sur 482 commandes de preuve du glossaire d'un produit, 332 (les secondes) étaient scellées et
 * jamais rejouées. Chaque commande est désormais une sonde, comptée (`mesure.commandes`) et rejouée avec son sceau.
 *
 * L'ESPACEMENT (TF-2788, 16/11/2026). Trois sondes simultanées vers une encyclopédie ont reçu un 429, et 24 sondes
 * ont dû être rejouées en différé. Deux commandes vers le MÊME hôte (première adresse http(s) de leur texte) ne
 * partent plus dos à dos : l'outil attend `--espacement` ms (1 500 par défaut, 0 pour le supprimer) depuis la fin de la
 * précédente, et compte ses attentes (`mesure.attentes_espacement`, `mesure.attente_ms`). Le User-Agent descriptif
 * s'écrit dans la commande (`curl -A …`, gabarits\GLOSSAIRE.md) : l'outil ne l'impose pas.
 *
 * Usage : node scripts/verifier-sonde-glossaire.mjs <GLOSSAIRE.md|dossier> [...]
 *           [--rejouer] [--rejouer-hors-depot] [--delai <ms>] [--espacement <ms>] [--peremption <jours>] [--le <AAAA-MM-JJ>]
 * Sortie : JSON · exit 0 = toutes fraîches et dans leur délai · 1 = au moins une PÉRIMÉE, injouable
 *          ou ÉCHUE · 2 = rien à juger (aucun glossaire, aucune ligne scellée ni datée sous une
 *          péremption, ou aucun rejeu autorisé), ou option illisible.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { termesDe } from "../oracles/oracle-glossaire.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const argv = process.argv.slice(2);
const drapeau = (n) => argv.includes(n);
const valeur = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const AVEC_VALEUR = ["--delai", "--peremption", "--le", "--espacement"];
const cibles = argv.filter((a, i) => !a.startsWith("--") && !AVEC_VALEUR.includes(argv[i - 1]));
const REJOUER = drapeau("--rejouer");
const REJOUER_HORS = drapeau("--rejouer-hors-depot");
const DELAI = Number(valeur("--delai", "20000"));
// TF-2788 : l'espacement de deux sondes vers le MÊME hôte (ms). Le 16/11/2026, trois sondes simultanées vers une encyclopédie
// ont reçu un 429 ; 24 sondes ont dû être rejouées en différé. 0 le supprime.
const ESPACEMENT_CLI = valeur("--espacement", null);
const ESPACEMENT = ESPACEMENT_CLI === null ? 1500 : Number(ESPACEMENT_CLI);
const dernierAppel = new Map();
const attendre = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, Math.ceil(ms));

// ---- la péremption par l'âge (TF-1318) ---------------------------------------------------------
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const JOUR_MS = 86400000;
const enJour = (d) => Date.parse(`${d}T00:00:00Z`);
const PEREMPTION_CLI = valeur("--peremption", null);
const LE = valeur("--le", new Date().toISOString().slice(0, 10));
// Une option illisible est une erreur d'USAGE : elle sort en 2, jamais en verdict sur le glossaire.
if ((PEREMPTION_CLI !== null && !/^[1-9]\d*$/.test(PEREMPTION_CLI)) || !DATE_ISO.test(LE) || Number.isNaN(enJour(LE))
  || (ESPACEMENT_CLI !== null && !/^\d+$/.test(ESPACEMENT_CLI))) {
  process.stdout.write(JSON.stringify({ outil: "verifier-sonde-glossaire", verdict: "ERREUR",
    message: `option illisible — --peremption attend un nombre de jours entier positif (lu « ${PEREMPTION_CLI} »), `
      + `--le une date AAAA-MM-JJ (lue « ${LE} »), `
      + `--espacement un nombre entier de millisecondes (lu « ${ESPACEMENT_CLI} »)` }, null, 1) + "\n");
  process.exit(2);
}
/** La durée de validité déclarée au frontmatter d'un glossaire : `{ jours }`, `{ illisible }`, ou null. */
function peremptionDeclaree(texte) {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(texte);
  const m = fm && /^\s*peremption_preuves_jours\s*:\s*(.*?)\s*$/im.exec(fm[1]);
  if (!m) return null;
  return /^[1-9]\d*$/.test(m[1]) ? { jours: Number(m[1]) } : { illisible: m[1] };
}

const NON_JUGE = [
  "une commande sans adresse http(s) dans son texte (une commande locale, un script) n'est pas espacée : l'hôte qu'elle interroge n'est pas lu "
  + "ailleurs que dans son texte, et le User-Agent d'une sonde s'écrit dans sa commande — l'outil ne le vérifie pas (TF-2788)",
  "un sceau qu'aucune commande ne précède dans la cellule : compté (`mesure.sceaux_sans_commande`), jamais rejoué ni accusé — un sceau scelle la commande qui le précède (TF-2786)",
  "la JUSTESSE de la sonde : l'outil dit si elle rend ENCORE ce qui a été scellé, jamais si ce "
  + "résultat était juste — c'est `verifie_le` qui date la vérification et une relecture humaine qui la tranche",
  "la PRÉSENCE de la commande dans la preuve : c'est G7 d'oracles/oracle-glossaire.mjs, et elle seule "
  + "(décision humaine du 26/08 sur TF-0657 — exiger la COMMANDE dans la preuve, ne pas rejouer la sonde "
  + "à chaque contrôle). Une ligne de visibilité SANS commande est comptée ici, jamais accusée",
  "une ligne SCELLÉE et non rejouée faute de `--rejouer` (ou de `--rejouer-hors-depot` pour un glossaire "
  + "d'un dépôt frère ou d'un produit) : comptée, jamais un défaut — aucune commande ne s'exécute par défaut",
  "une ligne NON SCELLÉE : le sceau `attendu … le AAAA-MM-JJ` est OPTIONNEL et ne se réclame pas "
  + "rétroactivement — un glossaire écrit avant ce verbe reste parfaitement valide",
  "les termes CONTRACTUELS : leur preuve est l'exactitude lexicale et la cohérence interlangue, qui se "
  + "lisent dans le produit et non dans une sonde externe",
  "la DURÉE de validité d'une preuve de marché n'est pas décidée ici : elle se déclare au frontmatter du "
  + "glossaire (`peremption_preuves_jours`) ou se passe par `--peremption`. Sans elle, l'âge n'est pas jugé "
  + "(ligne comptée `sans_peremption`) et le motif le dit (TF-1318)",
  "l'âge d'une preuve se compte de `verifie_le` à la date de mesure (`--le`, par défaut le jour de "
  + "l'exécution). Un sceau FRAIS ne rajeunit pas une ligne : seule une relecture humaine redate `verifie_le`",
  "une ligne dont `verifie_le` est illisible (c'est G4 d'oracles/oracle-glossaire.mjs qui la juge) ou "
  + "postérieure à la date de mesure est COMPTÉE, jamais accusée ici",
];

/** Le sceau, cherché AVANT la commande : pour `contient:` sa valeur est elle-même entre accents graves. */
const SCEAU = /attendu\s+(sha256|contient)\s*:\s*(`[^`]+`|[0-9a-fA-F]{12,64})\s+le\s+(\d{4}-\d{2}-\d{2})/;
const EST_GLOSSAIRE = (t) => {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(t);
  return !!fm && /^role\s*:.*(glossaire|terminologie)/im.test(fm[1]);
};

/** Les glossaires d'une cible : un fichier tel quel, un dossier parcouru (profondeur ≤ 6). */
function glossaires(chemin) {
  if (!existsSync(chemin)) return [];
  if (statSync(chemin).isFile()) return [chemin];
  const out = [];
  const marcher = (d, prof) => {
    if (prof > 6) return;
    let entrees = [];
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.name === "node_modules" || e.name === ".git" || e.name === ".oracles") continue;
      const c = join(d, e.name);
      if (e.isDirectory()) marcher(c, prof + 1);
      else if (/\.md$/i.test(e.name)) { try { if (EST_GLOSSAIRE(readFileSync(c, "utf8"))) out.push(c); } catch { /* illisible : ignoré */ } }
    }
  };
  marcher(chemin, 0);
  return out;
}

/** Un glossaire hors de CE dépôt porte du texte qu'un tiers a écrit : deuxième barrière. */
const horsDepot = (p) => { const r = resolve(p); return r !== RACINE && !r.toLowerCase().startsWith(RACINE.toLowerCase() + sep); };
const normaliser = (s) => String(s).replace(/\r\n/g, "\n").trim();
const hacher = (s) => createHash("sha256").update(normaliser(s), "utf8").digest("hex");

/**
 * TF-2786 (16/11/2026) — TOUTES LES COMMANDES DE LA CELLULE `preuve`, pas la première. G5 exige deux preuves de nature
 * différente, donc une cellule porte souvent deux commandes, chacune avec son sceau : `lireSonde` retenait la première
 * commande et le premier sceau, et la seconde n'était ni comptée ni rejouée (332 commandes de preuve sur 482 du glossaire
 * d'un produit, mesuré le 16/11/2026, non rejouées par l'outil). Le sceau se lit D'ABORD (la valeur d'un `contient:` est
 * elle-même entre accents graves, et ne passe pas pour une commande), puis chaque commande entre accents graves devient une
 * sonde, et un sceau scelle la commande qui le PRÉCÈDE le plus près — la forme du gabarit : `<commande>` → attendu … le AAAA-MM-JJ.
 * Un sceau qu'aucune commande ne précède est rendu à part (`orphelins`) : il est compté, jamais perdu en silence.
 */
export function lireSondes(preuve) {
  const cellule = String(preuve || "");
  const sceaux = [...cellule.matchAll(new RegExp(SCEAU.source, "g"))]
    .map((m) => ({ debut: m.index, fin: m.index + m[0].length, mode: m[1].toLowerCase(), attendu: m[2].replace(/^`|`$/g, ""), le: m[3] }));
  let reste = cellule;
  for (const s of sceaux) reste = reste.slice(0, s.debut) + " ".repeat(s.fin - s.debut) + reste.slice(s.fin);
  const sondes = [...reste.matchAll(/`([^`]{3,})`/g)].map((m) => ({ commande: m[1].trim(), fin: m.index + m[0].length, sceau: null }));
  let orphelins = 0;
  for (const s of sceaux) {
    const cible = [...sondes].reverse().find((c) => c.fin <= s.debut && !c.sceau);
    if (cible) cible.sceau = { mode: s.mode, attendu: s.attendu, le: s.le };
    else orphelins += 1;
  }
  return { sondes: sondes.map(({ commande, sceau }) => ({ commande, sceau })), orphelins };
}

/** La première sonde de la cellule : la lecture d'avant TF-2786, gardée pour qui l'importe. */
export function lireSonde(preuve) {
  return lireSondes(preuve).sondes[0] || { commande: null, sceau: null };
}

/** L'hôte qu'une commande interroge (première adresse http(s) de son texte), ou null. */
export const hoteDe = (commande) => {
  const m = /https?:\/\/([^\/\s'"`\\?#]+)/i.exec(String(commande || ""));
  return m ? m[1].toLowerCase() : null;
};

const findings = [];
const mesure = {
  glossaires: 0, lignes_visibilite: 0, sans_commande: 0, non_scellees: 0,
  non_rejouees: 0, frais: 0, perimes: 0, injouables: 0,
  // TF-2786 : le compte est PAR COMMANDE (une cellule en porte plusieurs) ; `sceaux_sans_commande` nomme ce qu'aucune commande ne précède.
  commandes: 0, sceaux_sans_commande: 0,
  // TF-2788 : les attentes imposées entre deux sondes vers un même hôte.
  attentes_espacement: 0, attente_ms: 0,
  // TF-1318 — l'âge des preuves. Toujours présents, à zéro quand rien n'est jugé : un compteur qui
  // manque se lit « non mesuré » ou « rien à signaler » selon l'humeur du lecteur.
  dans_delai: 0, echues: 0, sans_peremption: 0, dates_illisibles: 0, dates_futures: 0,
};
const peremptions = [];

for (const c of cibles) {
  for (const g of glossaires(c)) {
    mesure.glossaires++;
    let texte = "";
    try { texte = readFileSync(g, "utf8"); } catch { continue; }
    const decoupe = termesDe(texte);
    if (decoupe.erreurColonnes) continue;   // tableau illisible : c'est G0 de l'oracle, pas ce verbe
    const etranger = horsDepot(g);
    // LA DURÉE DE CE GLOSSAIRE : le drapeau l'emporte sur la déclaration, qui l'emporte sur rien.
    const declaree = peremptionDeclaree(texte);
    // Même quand le drapeau l'emporte : la déclaration reste fausse, et mordra l'appel suivant.
    if (declaree?.illisible !== undefined) {
      findings.push({ regle: "S-4", severite: "majeur", ou: g,
        message: `péremption déclarée ILLISIBLE (« peremption_preuves_jours: ${declaree.illisible} ») : un nombre de jours `
          + "entier positif est attendu. Une durée illisible ne périme rien, et le glossaire croit qu'elle le fait" });
    }
    const duree = PEREMPTION_CLI !== null ? Number(PEREMPTION_CLI) : declaree?.jours ?? null;
    peremptions.push({ glossaire: g, jours: duree,
      origine: PEREMPTION_CLI !== null ? "--peremption" : declaree?.jours ? "frontmatter" : null });
    for (const t of decoupe.termes) {
      if (String(t.categorie || "").toLowerCase() !== "visibilite") continue;
      for (const l of t.lignes) {
        mesure.lignes_visibilite++;
        const ou = `${g} · ${t.nom}/${l.locale}`;
        // S-3 D'ABORD, et pour TOUTE ligne de visibilité : l'âge d'une preuve ne dépend ni de sa
        // commande ni de son sceau. Une ligne sans commande (G7) vieillit comme les autres.
        if (duree === null) mesure.sans_peremption++;
        else {
          const v = String(l.verifie_le || "").trim();
          if (!DATE_ISO.test(v) || Number.isNaN(enJour(v))) mesure.dates_illisibles++;
          else {
            const age = Math.round((enJour(LE) - enJour(v)) / JOUR_MS);
            if (age < 0) mesure.dates_futures++;
            else if (age <= duree) mesure.dans_delai++;
            else {
              mesure.echues++;
              findings.push({ regle: "S-3", severite: "bloquant", ou,
                message: `preuve ÉCHUE : vérifiée le ${v}, il y a ${age} jour(s), au-delà de la péremption déclarée de `
                  + `${duree} jour(s) (mesure du ${LE}). Rejouer la sonde (\`--rejouer\`), relire l'entrée, puis redater `
                  + "`verifie_le` — une preuve de marché décrit un marché qui bouge, et au-delà de sa durée elle fait autorité à tort" });
            }
          }
        }
        // TF-2786 : CHAQUE commande de la cellule est une sonde, avec son sceau ; la seconde preuve de G5 se rejoue comme la première.
        const { sondes, orphelins } = lireSondes(l.preuve);
        mesure.sceaux_sans_commande += orphelins;
        if (!sondes.length) { mesure.sans_commande++; continue; }  // G7 le juge, pas nous
        for (const [rang, { commande, sceau }] of sondes.entries()) {
          mesure.commandes++;
          const ouSonde = sondes.length > 1 ? `${ou} · sonde ${rang + 1}/${sondes.length}` : ou;
          if (!sceau) { mesure.non_scellees++; continue; }          // compté, jamais un défaut
          if (!REJOUER || (etranger && !REJOUER_HORS)) { mesure.non_rejouees++; continue; }
          // TF-2788 : deux sondes vers le même hôte ne partent pas dos à dos — un service tiers répond 429 à des appels rapprochés.
          const hote = hoteDe(commande);
          if (hote && ESPACEMENT > 0 && dernierAppel.has(hote)) {
            const reste = ESPACEMENT - (Date.now() - dernierAppel.get(hote));
            if (reste > 0) { attendre(reste); mesure.attentes_espacement++; mesure.attente_ms += Math.round(reste); }
          }
          const r = spawnSync(commande, { shell: true, encoding: "utf8", timeout: DELAI, windowsHide: true });
          if (hote) dernierAppel.set(hote, Date.now());
          const sortie = (r.stdout || "") + (r.stderr || "");
          if (r.error || r.status !== 0) {
            mesure.injouables++;
            findings.push({ regle: "S-2", severite: "majeur", ou: ouSonde,
              message: `sonde INJOUABLE (${r.error ? r.error.code || r.error.message : `exit ${r.status}`}) : scellée le ${sceau.le}, `
                + `elle ne s'exécute plus — une preuve qu'on ne peut plus rejouer ne se contredit jamais toute seule. Commande : \`${commande.slice(0, 120)}\`` });
            continue;
          }
          const tenu = sceau.mode === "sha256"
            ? hacher(sortie).slice(0, sceau.attendu.length).toLowerCase() === sceau.attendu.toLowerCase()
            : normaliser(sortie).includes(sceau.attendu);
          if (tenu) { mesure.frais++; continue; }
          mesure.perimes++;
          findings.push({ regle: "S-1", severite: "bloquant", ou: ouSonde,
            message: `sonde PÉRIMÉE : scellée le ${sceau.le} sur ${sceau.mode}:${sceau.attendu.slice(0, 24)}${sceau.attendu.length > 24 ? "…" : ""}, `
              + `elle rend aujourd'hui ${sceau.mode === "sha256" ? `sha256:${hacher(sortie).slice(0, sceau.attendu.length)}` : "une sortie qui ne le contient plus"}. `
              + `Relire l'entrée, puis redater \`verifie_le\` ET le sceau — une preuve qui vieillit en silence fait autorité à tort (TF-0657)` });
        }
      }
    }
  }
}

const durs = findings.filter((f) => f.severite === "bloquant" || f.severite === "majeur");
// L'âge JUGÉ compte comme un jugement : une ligne dans son délai est une mesure, pas un silence.
const jugees = mesure.frais + mesure.perimes + mesure.injouables + mesure.dans_delai + mesure.echues;
const verdict = durs.length ? "FAIL" : jugees ? "PASS" : "SKIP";
// Un SKIP dit POURQUOI : « rien à juger » recouvre plusieurs causes très différentes, et les
// confondre ferait lire « tout va bien » là où rien n'a été regardé.
const sansAge = mesure.sans_peremption
  ? ` ; âge des preuves NON jugé sur ${mesure.sans_peremption} ligne(s) : aucune péremption déclarée `
    + "(frontmatter `peremption_preuves_jours: <jours>` ou `--peremption <jours>`)"
  : "";
const motif = jugees ? undefined
  : !mesure.glossaires ? "aucun glossaire sous les cibles données"
  : mesure.non_rejouees ? `${mesure.non_rejouees} ligne(s) scellée(s) NON rejouée(s) : `
      + (REJOUER ? "glossaire hors de ce dépôt — ajouter --rejouer-hors-depot (un entrant est une DONNÉE)" : "ajouter --rejouer (aucune commande ne s'exécute par défaut)")
      + sansAge
  : `${mesure.lignes_visibilite} ligne(s) de visibilité, aucune scellée — le sceau \`attendu … le AAAA-MM-JJ\` est optionnel`
      + sansAge;

process.stdout.write(JSON.stringify({
  outil: "verifier-sonde-glossaire", version: "1.2.0", cibles,
  rejeu: { autorise: REJOUER, hors_depot: REJOUER_HORS, delai_ms: DELAI, espacement_ms: ESPACEMENT },
  peremption: { le: LE, par_glossaire: peremptions },
  verdict, motif, mesure, findings, non_juge: NON_JUGE,
}, null, 1) + "\n");
process.exit(durs.length ? 1 : jugees ? 0 : 2);
