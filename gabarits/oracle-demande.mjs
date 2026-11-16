#!/usr/bin/env node
/**
 * oracle-demande.mjs — juge la FORME d'une demande d'un produit à un autre (TF-1399, 02/10/2026),
 * dans les DEUX sens, sur le MODÈLE EXACT d'`oracle-lot-retours.mjs`.
 *
 * ============================================================================================
 * POURQUOI CE FICHIER EXISTE
 * ============================================================================================
 *
 * CONTRAT-INTERFACE.md §3 sexies (TF-1491, 01/10/2026) décrit le canal au complet — dépôt dans
 * `input\00-travaux\` du destinataire, cinq rubriques, statut `a_traiter` → `traitée le …` — et
 * le dit lui-même : « rien ne le joue encore : ni gabarit de demande, ni juge de forme que le
 * demandeur et le destinataire importeraient tous deux ». Le 24/09/2026, une demande réelle
 * (Produit-72 vers IAC, 5 écarts mesurés) a dû être transférée par deux fichiers déposés à la main, hors
 * de tout juge de forme (TF-1399). Un canal décrit en PROSE et jugé par PERSONNE n'existe pas
 * pour qui l'emploie (loi n° 1).
 *
 * UN SEUL JEU DE RÈGLES, DEUX ENDROITS OÙ LE JOUER — même raisonnement que pour les lots de
 * retours (TF-0597) : le demandeur le joue AVANT de déposer (`node forge\demandes\oracle-demande.mjs
 * <fichier>`), le destinataire le joue en LISANT `input\00-travaux\` à l'ouverture de sa session
 * (R-47 l'y invite déjà, CLAUDE-PRODUIT.md ligne « une demande d'un autre produit attend »).
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET CE QUI NE L'EST PAS
 * ============================================================================================
 *
 * DEM-1 — le NOM porte le contrat : `<demandeur> - DEMANDE - AAAAMMJJ<indice>.md`, le demandeur
 *   en tête comme pour `pilot - TRAVAUX - …`.
 * DEM-2 — le STATUT est une des deux formes fermées : `Statut : a_traiter` à l'ouverture, ou
 *   `Statut : traitée le AAAA-MM-JJ` — la SEULE édition permise après dépôt (§3 sexies point 2).
 * DEM-3 — les CINQ RUBRIQUES sont présentes, chacune substantielle : une section vide (ou qui ne
 *   porte que le texte d'exemple entre chevrons du gabarit) se lit comme un oubli, jamais comme
 *   une décision (même loi n° 3 que R-45/R-46).
 *
 * NON JUGÉ, et c'est délibéré : la JUSTESSE du fait rapporté ou de l'évolution demandée — un
 * contenu peut être faux et se corrige, un contenu absent est perdu pour le destinataire. Ce
 * module ne lit jamais le CONTENU d'une rubrique au-delà de sa présence et de sa substance.
 *
 * Usage :
 *   node oracle-demande.mjs <demande.md> [--json]
 * Exit : 0 = forme tenue · 1 = forme en défaut · 2 = fichier illisible.
 */
import { readFileSync, existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.1.0"; // 1.0.0 (02/10/2026) : première version, TF-1399 ; 1.1.0 (16/11/2026) : DEM-4, TF-2650

/** Le gabarit que chaque remède fait ouvrir — cible CANONIQUE chez le produit (HERITAGE.json). */
const GABARIT_DEMANDE = "forge\\demandes\\GABARIT-DEMANDE.md";

// DEM-1 — `<demandeur> - DEMANDE - AAAAMMJJ<lettre>.md`, demandeur non vide.
const NOM_DEMANDE = /^(.+) - DEMANDE - (\d{8})([a-z]?)\.md$/i;

// DEM-2 — vocabulaire FERMÉ, les deux seules formes que §3 sexies point 2-3 admet.
const STATUT_OUVERT = /^\s*Statut\s*:\s*a_traiter\s*$/im;
const STATUT_TRAITEE = /^\s*Statut\s*:\s*trait[ée]e\s+le\s+\d{4}-\d{2}-\d{2}\s*$/im;

// DEM-3 — les cinq rubriques, dans l'ordre du gabarit et de §3 sexies point 2. Chaque regex capture
// le CORPS jusqu'au prochain titre de niveau 2 ou la fin du texte.
const RUBRIQUES = [
  { cle: "fait", titre: "Le fait observé, et sa preuve", re: /^##\s+Le fait observ[ée],? et sa preuve\s*$/im },
  { cle: "evolution", titre: "L'évolution demandée", re: /^##\s+L['’]évolution demand[ée]e\s*$/im },
  { cle: "concerne", titre: "Ce qui concerne ce produit", re: /^##\s+Ce qui concerne ce produit\s*$/im },
  { cle: "preuve_faite", titre: "Comment je saurai que c'est fait", re: /^##\s+Comment je saurai que c['’]est fait\s*$/im },
  { cle: "exclusions", titre: "Ce que cette demande ne réclame pas", re: /^##\s+Ce que cette demande ne r[ée]clame pas\s*$/im },
];

// DEM-4 (TF-2650, 16/11/2026) — une demande qui PRESCRIT la valeur d'un paramètre d'API tierce dit d'où viennent les valeurs admises.
// LE FAIT : demande Produit-86 du 12/11/2026, en-tête `X-Produit-86-Access` proposé pour `read_service_tokens_from_header` de Cloudflare
// Access ; l'API n'admet que `Authorization` (« must be one of [Authorization] », réponse de Produit-84 du 13/11) — un correctif, une
// recette et un redéploiement de plus. La rubrique est DUE à partir des demandes datées du 16/11/2026 (la date est dans le nom) : une
// demande d'avant n'a rien fait de mal, c'est la règle qui a bougé. Chaque ligne de la rubrique porte sa source ou « à confirmer par
// le propriétaire » ; sans ligne, la rubrique déclare « aucun paramètre d'API tierce n'est prescrit ». La JUSTESSE de la source n'est pas jugée.
const DATE_DEM4 = "20261116";
const RUBRIQUE_API = { titre: "Les paramètres d'API tierce prescrits", re: /^##\s+Les param[èe]tres d['’]API tierce prescrits\s*$/im };
const SOURCE_OU_RENVOI = /source[^:\n]*:|https?:\/\/|à confirmer par le propriétaire/i;
const AUCUN_PARAMETRE = /aucun\s+param[èe]tre/i;

/** Le corps d'une section, jusqu'au prochain titre de niveau 2 — même fonction qu'oracle-lot-retours. */
function corpsDeSection(texte, re) {
  const apres = texte.split(re);
  if (apres.length < 2) return null;
  return (apres[1].split(/^## /m)[0] || "").trim();
}

/** Un corps substantiel : non vide, et pas seulement le texte d'exemple entre chevrons du gabarit. */
function substantiel(corps) {
  if (!corps) return false;
  const sansExemple = corps.replace(/<[^>]*>/g, "").trim();
  return sansExemple.length > 0;
}

/**
 * Juge la forme d'une demande. `texteFourni` pour les recettes (aucune lecture disque) ; sinon
 * lit `cheminDemande`.
 */
export function verifier(cheminDemande, texteFourni) {
  const constats = [];
  const ajouter = (regle, statut, message, remede) => constats.push({ regle, statut, message, remede });

  let texte = texteFourni;
  if (texte === undefined) {
    if (!existsSync(cheminDemande)) return { verdict: "SKIP", constats: [{ regle: "—", statut: "SKIP", message: `demande introuvable : ${cheminDemande}`, remede: "vérifier le chemin" }] };
    texte = readFileSync(cheminDemande, "utf8");
  }

  const nom = basename(String(cheminDemande).split("\\").join("/"));
  const m = NOM_DEMANDE.exec(nom);
  if (!m || !m[1].trim()) {
    ajouter("DEM-1", "FAIL",
      `nom « ${nom} » hors forme — attendu « <demandeur> - DEMANDE - AAAAMMJJ<indice>.md », le demandeur en tête`,
      "renommer le fichier, le nom du produit demandeur en tête, suivi de « - DEMANDE - » puis la date du jour et l'indice (premier libre, node scripts\\allouer-indice.mjs)");
  } else {
    ajouter("DEM-1", "PASS", `nom conforme, demandeur « ${m[1]} »`, null);
  }

  if (STATUT_OUVERT.test(texte)) {
    ajouter("DEM-2", "PASS", "statut « a_traiter » — demande ouverte, pas encore enregistrée par le destinataire", null);
  } else if (STATUT_TRAITEE.test(texte)) {
    ajouter("DEM-2", "PASS", "statut « traitée le AAAA-MM-JJ » — seule édition permise après dépôt (§3 sexies point 2)", null);
  } else {
    ajouter("DEM-2", "FAIL",
      "aucune ligne de statut reconnue — attendu « Statut : a_traiter », puis « Statut : traitée le AAAA-MM-JJ » une fois seulement",
      `ajouter la ligne « Statut : a_traiter » à l'ouverture du fichier. Gabarit : ${GABARIT_DEMANDE}`);
  }

  const manquantes = [];
  for (const { cle, titre, re } of RUBRIQUES) {
    if (!re.test(texte)) { manquantes.push(titre); continue; }
    if (!substantiel(corpsDeSection(texte, re))) manquantes.push(`${titre} (vide ou texte d'exemple seul)`);
  }
  if (manquantes.length) {
    ajouter("DEM-3", "FAIL",
      `${manquantes.length}/5 rubrique(s) absente(s) ou vide(s) : ${manquantes.join(" · ")} — une demande qui ne borne pas son périmètre laisse le destinataire deviner`,
      `porter les cinq rubriques du gabarit, chacune substantielle. Gabarit : ${GABARIT_DEMANDE}`);
  } else {
    ajouter("DEM-3", "PASS", "cinq rubriques présentes et substantielles", null);
  }

  if (m && m[2] >= DATE_DEM4) {
    const corps = RUBRIQUE_API.re.test(texte) ? corpsDeSection(texte, RUBRIQUE_API.re) : null;
    const utile = corps === null ? "" : corps.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, "").trim();
    // une ligne de rubrique : une puce ou une ligne de tableau (hors en-tête et filet) ; chacune porte sa source ou son renvoi
    const lignes = utile.split(/\r?\n/).map((l) => l.trim())
      .filter((l) => /^([-*]|\|)/.test(l) && !/^\|?[\s:|-]+\|?$/.test(l) && !/^\|\s*param[èe]tre\b/i.test(l) && !AUCUN_PARAMETRE.test(l));
    const sansSource = lignes.filter((l) => !SOURCE_OU_RENVOI.test(l));
    if (corps === null || !utile) {
      ajouter("DEM-4", "FAIL",
        `rubrique « ${RUBRIQUE_API.titre} » ${corps === null ? "absente" : "vide ou réduite au texte d'exemple"} d'une demande datée du ${m[2]}, donc à partir du ${DATE_DEM4} (TF-2650) — `
        + "une valeur d'API tierce prescrite de mémoire coûte au destinataire un correctif, une recette et un redéploiement",
        `ajouter la rubrique : une ligne par paramètre prescrit avec « source : … » ou « à confirmer par le propriétaire », ou « Aucun paramètre d'API tierce n'est prescrit. » Gabarit : ${GABARIT_DEMANDE}`);
    } else if (lignes.length ? sansSource.length : !AUCUN_PARAMETRE.test(utile)) {
      ajouter("DEM-4", "FAIL",
        lignes.length
          ? `${sansSource.length}/${lignes.length} paramètre(s) d'API tierce prescrit(s) sans source des valeurs admises ni « à confirmer par le propriétaire » : ${sansSource.map((l) => `« ${l.slice(0, 60)} »`).join(" · ")}`
          : "la rubrique ne liste aucun paramètre et ne déclare pas « aucun paramètre d'API tierce n'est prescrit » — une rubrique qui ne dit rien se lit comme un oubli",
        "écrire, pour chaque paramètre prescrit, la source de ses valeurs admises (page de documentation relue, réponse du propriétaire) ou « à confirmer par le propriétaire »");
    } else {
      ajouter("DEM-4", "PASS", lignes.length ? `${lignes.length} paramètre(s) d'API tierce prescrit(s), chacun avec sa source ou son renvoi au propriétaire` : "aucun paramètre d'API tierce prescrit, déclaré", null);
    }
  }

  return { verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS", constats };
}

// ---- self-test : les DEUX sens --------------------------------------------------------------
function selfTest() {
  let pass = 0; const echecs = [];
  const check = (nom, fn) => { try { fn(); pass++; console.log(`  [OK  ] ${nom}`); } catch (e) { echecs.push(nom); console.log(`  [ECHEC] ${nom} — ${e.message}`); } };
  const constat = (r, regle) => r.constats.find((c) => c.regle === regle);
  const VERTE = "Statut : a_traiter\n\n"
    + "## Le fait observé, et sa preuve\n\nLa page X rend 404 depuis le commit abc123, capture jointe.\n\n"
    + "## L'évolution demandée\n\nQue le point d'API /x réponde 200 pour une requête conforme au contrat.\n\n"
    + "## Ce qui concerne ce produit\n\nC'est ce produit qui expose ce point d'API.\n\n"
    + "## Comment je saurai que c'est fait\n\nLa même requête, rejouée, rend 200.\n\n"
    + "## Ce que cette demande ne réclame pas\n\nAucun changement de schéma de réponse.\n";

  check("nom conforme (DEM-1) et statut ouvert (DEM-2) : PASS", () => {
    const r = verifier("Produit-01 - DEMANDE - 20261002a.md", VERTE);
    if (r.verdict !== "PASS") throw new Error(`verdict ${r.verdict} : ${JSON.stringify(r.constats.filter((c) => c.statut === "FAIL"))}`);
  });
  check("rouge DEM-1 — un nom hors forme (pas de « - DEMANDE - ») : FAIL", () => {
    const r = verifier("Produit-01 - RETOURS - 20261002a.md", VERTE);
    const c = constat(r, "DEM-1");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });
  check("rouge DEM-2 — aucune ligne de statut : FAIL, le remède donne la forme exacte", () => {
    const r = verifier("Produit-01 - DEMANDE - 20261002a.md", VERTE.replace("Statut : a_traiter\n\n", ""));
    const c = constat(r, "DEM-2");
    if (!c || c.statut !== "FAIL" || !/a_traiter/.test(c.remede || "")) throw new Error(`statut ${c ? c.statut : "absent"}`);
  });
  check("vert DEM-2 — statut « traitée le AAAA-MM-JJ », seule édition permise : PASS", () => {
    const r = verifier("Produit-01 - DEMANDE - 20261002a.md", VERTE.replace("Statut : a_traiter", "Statut : traitée le 2026-10-03"));
    const c = constat(r, "DEM-2");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });
  check("rouge DEM-3 — une rubrique absente : FAIL, nommée", () => {
    const sans = VERTE.replace(/## Ce que cette demande ne r[ée]clame pas\n\nAucun changement de schéma de réponse\.\n/, "");
    const r = verifier("Produit-01 - DEMANDE - 20261002a.md", sans);
    const c = constat(r, "DEM-3");
    if (!c || c.statut !== "FAIL" || !/ne réclame pas/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("rouge DEM-3 — une rubrique PRÉSENTE mais ne portant que le texte d'exemple entre chevrons : FAIL", () => {
    const videe = VERTE.replace(
      "## Ce qui concerne ce produit\n\nC'est ce produit qui expose ce point d'API.\n",
      "## Ce qui concerne ce produit\n\n<Pourquoi CE destinataire précisément>\n");
    const r = verifier("Produit-01 - DEMANDE - 20261002a.md", videe);
    const c = constat(r, "DEM-3");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — une section réduite à l'exemple du gabarit passe`);
  });
  // DEM-4 (TF-2650) — jugé sur des demandes datées du 16/11/2026 ; celles d'avant (VERTE, 20261002) ne portent pas la rubrique.
  const NEUVE = "Produit-01 - DEMANDE - 20261116a.md";
  const AVEC_API = (corps) => VERTE + `\n## Les paramètres d'API tierce prescrits\n\n${corps}\n`;
  check("rouge DEM-4 — demande du 16/11 sans la rubrique : FAIL, nommée ; la même demande datée d'avant reste PASS", () => {
    const c = constat(verifier(NEUVE, VERTE), "DEM-4");
    if (!c || c.statut !== "FAIL" || !/absente/.test(c.message) || !/TF-2650/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
    if (verifier("Produit-01 - DEMANDE - 20261115a.md", VERTE).verdict !== "PASS") throw new Error("une demande d'avant le 16/11 est refusée à tort");
  });
  check("rouge DEM-4 — un paramètre prescrit sans source ni renvoi au propriétaire : FAIL, la ligne nommée", () => {
    const c = constat(verifier(NEUVE, AVEC_API("- en-tête de lecture du jeton = X-Produit-86-Access")), "DEM-4");
    if (!c || c.statut !== "FAIL" || !/X-Produit-86-Access/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("rouge DEM-4 — deux paramètres, un seul sourcé : FAIL sur l'autre seulement", () => {
    const c = constat(verifier(NEUVE, AVEC_API("- option A = x — source : https://exemple.test/doc relue le 2026-11-16\n- option B = y")), "DEM-4");
    if (!c || c.statut !== "FAIL" || !/1\/2/.test(c.message) || !/option B/.test(c.message) || /option A/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("rouge DEM-4 — la rubrique réduite au texte d'exemple entre chevrons : FAIL", () => {
    const c = constat(verifier(NEUVE, AVEC_API("<Pour chaque valeur d'une API tierce que cette demande prescrit>")), "DEM-4");
    if (!c || c.statut !== "FAIL" || !/vide/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("vert DEM-4 — source citée, « à confirmer par le propriétaire » et « aucun paramètre » : PASS, et le remède de DEM-4 joué passe", () => {
    for (const corps of [
      "- en-tête de lecture du jeton = Authorization — source : documentation Cloudflare Access relue le 2026-11-16",
      "- en-tête de lecture du jeton = X-Produit-86-Access — à confirmer par le propriétaire",
      "| Paramètre | Valeur | Source |\n|---|---|---|\n| en-tête | Authorization | source : https://exemple.test/doc |",
      "Aucun paramètre d'API tierce n'est prescrit.",
      "- Aucun paramètre d'API tierce n'est prescrit.",
    ]) {
      const r = verifier(NEUVE, AVEC_API(corps));
      const c = constat(r, "DEM-4");
      if (!c || c.statut !== "PASS" || r.verdict !== "PASS") throw new Error(`« ${corps.slice(0, 50)} » : ${c ? c.statut : "absent"} — ${c && c.message}`);
    }
  });
  check("un fichier INTROUVABLE rend SKIP, jamais un PASS de complaisance", () => {
    const r = verifier("chemin/qui/n/existe/pas - DEMANDE - 20261002a.md");
    if (r.verdict !== "SKIP") throw new Error(`verdict ${r.verdict}`);
  });

  console.log(`\nSelf-test oracle-demande (TF-1399) : ${pass}/${pass + echecs.length} cas, ${echecs.length} FAIL`);
  return echecs.length ? 1 : 0;
}

// ---- CLI --------------------------------------------------------------------------------------
export const USAGE = "Usage : node oracle-demande.mjs <demande.md> [--json] | --self-test";

// Garde d'exécution directe — même forme que celle corrigée par TF-1473 sur oracle-lot-retours.mjs :
// `process.argv[1]` VIDE (import depuis `node -e`) ne doit jamais se prendre pour la CLI.
const lanceEnDirect = Boolean(process.argv[1])
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === resolve(process.argv[1]).toLowerCase().replaceAll("\\", "/");

if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const cible = args.find((a) => !a.startsWith("--"));
  if (!cible) { console.error(USAGE); process.exit(2); }
  const r = verifier(cible);
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    for (const c of r.constats) console.log(`  [${c.statut}] ${c.regle} — ${c.message}${c.remede ? `\n           → ${c.remede}` : ""}`);
    console.log(`\nVerdict : ${r.verdict}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SKIP" ? 2 : 0);
}
