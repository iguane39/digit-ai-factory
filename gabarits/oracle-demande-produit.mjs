#!/usr/bin/env node
/**
 * oracle-demande-produit.mjs — juge la FORME d'une demande d'évolution qu'un produit adresse à
 * un autre (TF-1522, 02/10/2026, canal §3 sexies de CONTRAT-INTERFACE.md, TF-1491).
 *
 * POURQUOI CE FICHIER EXISTE. TF-1491 (01/10/2026) a écrit le canal entre produits — le
 * demandeur dépose sa demande dans `input\00-travaux\` du destinataire, qui l'enregistre
 * lui-même — mais CONTRAT-INTERFACE.md le dit en toutes lettres : « rien ne le joue encore : ni
 * gabarit de demande, ni juge de forme que le demandeur et le destinataire importeraient tous
 * deux, ni détection d'une demande reçue et non enregistrée ». Ce module est le DEUXIÈME des
 * trois outils manquants (`gabarits\DEMANDE-PRODUIT.md` le premier,
 * `scripts\detecter-demandes-recues.mjs` le troisième), construit SUR LE MODÈLE du canal
 * comparable déjà outillé — `gabarits\oracle-travaux-pilot.mjs`, qui juge la forme d'un lot
 * confié par le pilot à un produit. MÊME RAISON D'ÊTRE : sur ce canal-là, la forme vivait en
 * PROSE chez l'émetteur et en CODE chez le destinataire, et six lots ont dû passer par
 * dérogation en une seule journée (TF-0597) avant qu'un module UNIQUE, importé des deux côtés,
 * ne ferme l'écart.
 *
 * CE QUI EST JUGÉ, ET CE QUI NE L'EST PAS. Le contrat §3 sexies, point 2, tient la demande en
 * CINQ rubriques : le fait observé avec sa preuve ; l'évolution demandée, énoncée comme un
 * résultat attendu ; ce qui concerne ce produit-là ; comment le demandeur saura que c'est fait ;
 * ce que la demande ne réclame pas. Une rubrique ABSENTE ou VIDE est un FAIL (loi n° 3 : une
 * section vide se dit, elle ne se devine pas) ; le gabarit tolère « rien n'est écarté de cette
 * demande » comme réponse légitime à la 5e. S'y ajoutent D1 (nommage du fichier) et D2 (ligne
 * `Statut`, seule édition permise après dépôt). CE CONTRÔLE NE JUGE PAS : la PERTINENCE de la
 * demande (c'est au destinataire d'en décider), le SORT qu'elle reçoit, ni si elle a été
 * EFFECTIVEMENT déposée dans `input\00-travaux\` — c'est `scripts\detecter-demandes-recues.mjs`
 * qui mesure l'arrivée, celui-ci ne mesure que la forme d'un fichier qu'on lui donne.
 *
 * Usage : node oracle-demande-produit.mjs <demande.md> [--json]
 * Exit : 0 = forme tenue · 1 = forme en défaut · 2 = fichier illisible.
 */
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

export const VERSION = "1.1.0"; // 1.1.0 (16/11/2026) : D4, TF-2650

//: D1 — le nom du fichier : `<demandeur> - DEMANDE - AAAAMMJJ<indice>.md` (§3 sexies, point 1).
const NOM_FICHIER = /^.+ - DEMANDE - \d{8}[a-z]?\.md$/i;
//: D2 — la ligne de statut, seule édition permise après dépôt.
const STATUT = /^-\s*\*\*Statut\*\*\s*:\s*(a_traiter|trait[ée]e?\s+le\s+\S.*)\s*$/im;
//: Les cinq rubriques du contrat, dans l'ordre où il les énonce.
const RUBRIQUES = [
  { cle: "fait", motif: /^##\s*1\.\s*Le\s+fait\s+observ[ée]\s*$/im, nom: "1. Le fait observé" },
  { cle: "evolution", motif: /^##\s*2\.\s*L['’]évolution\s+demand[ée]e\s*$/im, nom: "2. L'évolution demandée" },
  { cle: "concerne", motif: /^##\s*3\.\s*Ce\s+qui\s+concerne\s+ce\s+produit/im, nom: "3. Ce qui concerne ce produit-là" },
  { cle: "verification", motif: /^##\s*4\.\s*Comment\s+le\s+demandeur\s+saura\s+que\s+c['’]est\s+fait\s*$/im, nom: "4. Comment le demandeur saura que c'est fait" },
  { cle: "borne", motif: /^##\s*5\.\s*Ce\s+que\s+cette\s+demande\s+ne\s+r[ée]clame\s+pas\s*$/im, nom: "5. Ce que cette demande ne réclame pas" },
];
//: La déclaration d'absence légitime pour la 5e rubrique — une borne vide se DIT, elle ne se devine pas.
const AUCUNE_BORNE = /rien\s+n['’]est\s+[ée]cart[ée]\s+de\s+cette\s+demande/i;

/** Une section porte-t-elle du contenu, ou seulement son titre ? Même prédicat que
 *  `oracle-travaux-pilot.mjs` : une section vide (hors commentaires HTML) vaut absente. */
function contenuDeSection(texte, motif) {
  const m = texte.match(motif);
  if (!m) return null;
  const apres = texte.slice(m.index + m[0].length);
  const fin = apres.search(/\n##\s+/);
  return (fin < 0 ? apres : apres.slice(0, fin))
    .split("\n").filter((l) => l.trim() && !l.trim().startsWith("<!--") && !/^<.*>$/.test(l.trim())).join("\n").trim();
}

//: D4 — la sixième rubrique, due à partir du 16/11/2026 (TF-2650), jugée sur la date AAAAMMJJ du nom de fichier.
const DATE_D4 = "20261116";
const RUBRIQUE_API = /^##\s*6\.\s*Les\s+param[èe]tres\s+d['’]API\s+tierce\s+prescrits\s*$/im;
const SOURCE_OU_RENVOI = /source[^:\n]*:|https?:\/\/|à confirmer par le propriétaire/i;
const AUCUN_PARAMETRE = /aucun\s+param[èe]tre/i;
/** Le corps de la rubrique 6 sans commentaire HTML ni texte d'exemple entre chevrons ; `null` si le titre est absent. */
function contenuDeRubriqueApi(texte) {
  const m = texte.match(RUBRIQUE_API);
  if (!m) return null;
  const apres = texte.slice(m.index + m[0].length);
  const fin = apres.search(/\n##\s+/);
  return (fin < 0 ? apres : apres.slice(0, fin)).replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>\n]*>/g, "")
    .split("\n").filter((l) => l.trim()).join("\n").trim();
}

export function verifier(cheminOuTexte, nomFichier) {
  const estChemin = typeof cheminOuTexte === "string" && existsSync(cheminOuTexte);
  const texte = estChemin ? readFileSync(cheminOuTexte, "utf8") : String(cheminOuTexte);
  const nom = nomFichier || (estChemin ? basename(cheminOuTexte) : "<texte>");
  const constats = [];
  const ko = (regle, message, remede) => constats.push({ regle, statut: "FAIL", message, remede });
  const ok = (regle, message) => constats.push({ regle, statut: "PASS", message });

  // ---- D1 : le nom du fichier ---------------------------------------------------------------
  if (nomFichier || estChemin) {
    if (!NOM_FICHIER.test(nom)) {
      ko("D1", `nom « ${nom} » ne suit pas « <demandeur> - DEMANDE - <AAAAMMJJ><indice>.md » (§3 sexies, point 1) — `
        + "un fichier qui ne nomme pas le demandeur en tête ne se distingue pas d'un autre entrant de la même boîte",
        "renommer en « <demandeur> - DEMANDE - AAAAMMJJ<indice>.md », l'indice étant le premier libre du jour (scripts\\allouer-indice.mjs)");
    } else ok("D1", `nom conforme : ${nom}`);
  } else ok("D1", "jugé sur un texte sans nom de fichier fourni — non jugeable, D1 non applicable");

  // ---- D2 : la ligne de statut ---------------------------------------------------------------
  if (!STATUT.test(texte)) {
    ko("D2", "aucune ligne « **Statut** : a_traiter » ou « **Statut** : traitée le <date> » — "
      + "sans elle, rien ne dit si cette demande a déjà été lue, ni ne permet l'unique édition que le contrat admet après dépôt",
      "ajouter « - **Statut** : a_traiter » à l'en-tête (le destinataire la passe à « traitée le <date> » en la traitant, seule édition permise)");
  } else ok("D2", "la ligne de statut est présente et porte une valeur reconnue");

  // ---- D3 : les cinq rubriques -----------------------------------------------------------
  const manquantes = [];
  const vides = [];
  for (const r of RUBRIQUES) {
    const contenu = contenuDeSection(texte, r.motif);
    if (contenu === null) { manquantes.push(r.nom); continue; }
    if (!contenu && !(r.cle === "borne" && AUCUNE_BORNE.test(texte))) vides.push(r.nom);
  }
  if (manquantes.length) {
    ko("D3", `${manquantes.length} rubrique(s) absente(s) : ${manquantes.join(" · ")} — le contrat (§3 sexies, point 2) tient la demande en CINQ rubriques, et une rubrique absente n'est pas distinguable d'une demande incomplète`,
      "ajouter les sections manquantes, dans l'ordre du gabarit (gabarits\\DEMANDE-PRODUIT.md)");
  } else if (vides.length) {
    ko("D3", `${vides.length} rubrique(s) VIDE(S) : ${vides.join(" · ")} — une section vide se lit comme un oubli (loi n° 3), sauf la 5e qui admet « rien n'est écarté de cette demande »`,
      "remplir la ou les rubriques, ou — pour la 5e seulement — écrire « rien n'est écarté de cette demande »");
  } else ok("D3", "les cinq rubriques sont présentes, chacune remplie");

  // ---- D4 : les paramètres d'API tierce prescrits (TF-2650, 16/11/2026) ----------------------------
  // LE FAIT : demande du 12/11/2026, en-tête `X-Produit-86-Access` proposé pour `read_service_tokens_from_header` de Cloudflare Access ;
  // l'API n'admet que `Authorization` — un correctif, une recette et un redéploiement de plus. Due aux demandes datées du 16/11/2026
  // ou après (la date est dans le nom) ; chaque ligne porte sa source ou « à confirmer par le propriétaire », la justesse n'est pas jugée.
  const dateNom = /- DEMANDE - (\d{8})/i.exec(nom);
  if (dateNom && dateNom[1] >= DATE_D4) {
    const corps = contenuDeRubriqueApi(texte);
    if (corps === null || !corps) {
      ko("D4", `rubrique « 6. Les paramètres d'API tierce prescrits » ${corps === null ? "absente" : "vide"} d'une demande datée du ${dateNom[1]}, donc à partir du ${DATE_D4} (TF-2650) — `
        + "une valeur d'API tierce prescrite de mémoire coûte au destinataire un correctif, une recette et un redéploiement",
        "ajouter la rubrique (gabarits\\DEMANDE-PRODUIT.md) : une ligne par paramètre avec « source : … » ou « à confirmer par le propriétaire », ou « Aucun paramètre d'API tierce n'est prescrit. »");
    } else {
      const lignes = corps.split("\n").map((l) => l.trim())
        .filter((l) => /^([-*]|\|)/.test(l) && !/^\|?[\s:|-]+\|?$/.test(l) && !/^\|\s*param[èe]tre\b/i.test(l) && !AUCUN_PARAMETRE.test(l));
      const sansSource = lignes.filter((l) => !SOURCE_OU_RENVOI.test(l));
      if (lignes.length ? sansSource.length : !AUCUN_PARAMETRE.test(corps)) {
        ko("D4", lignes.length
          ? `${sansSource.length}/${lignes.length} paramètre(s) d'API tierce prescrit(s) sans source des valeurs admises ni « à confirmer par le propriétaire » : ${sansSource.map((l) => `« ${l.slice(0, 60)} »`).join(" · ")}`
          : "la rubrique ne liste aucun paramètre et ne déclare pas « aucun paramètre d'API tierce n'est prescrit » — une rubrique qui ne dit rien se lit comme un oubli",
          "écrire, pour chaque paramètre prescrit, la source de ses valeurs admises (page de documentation relue, réponse du propriétaire) ou « à confirmer par le propriétaire »");
      } else ok("D4", lignes.length ? `${lignes.length} paramètre(s) d'API tierce prescrit(s), chacun avec sa source ou son renvoi au propriétaire` : "aucun paramètre d'API tierce prescrit, déclaré");
    }
  }

  return { fichier: nom, version: VERSION, constats,
    verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS" };
}

// ---- CLI --------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && import.meta.url.toLowerCase().endsWith(process.argv[1].toLowerCase().replaceAll("\\", "/").replace(/^[a-z]:/, "").replace(/^\//, ""));
if (lanceEnDirect || (process.argv[1] && process.argv[1].endsWith("oracle-demande-produit.mjs"))) {
  const cible = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!cible || !existsSync(cible)) {
    console.error("usage : node oracle-demande-produit.mjs <demande.md> [--json]");
    process.exit(2);
  }
  const r = verifier(cible);
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    console.log(`oracle-demande-produit ${VERSION} — ${cible}`);
    console.log(`verdict : ${r.verdict}`);
    for (const c of r.constats) {
      console.log(`  [${c.statut}] ${c.regle} — ${c.message}`);
      if (c.remede) console.log(`      → ${c.remede}`);
    }
    if (r.verdict === "FAIL") {
      console.log("\nCette demande serait REFUSÉE. La corriger ici coûte une minute ; la laisser partir");
      console.log("coûte au destinataire une lecture qu'il ne peut pas exploiter.");
    }
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
