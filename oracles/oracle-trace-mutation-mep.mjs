#!/usr/bin/env node
/**
 * oracle-trace-mutation-mep — UN DOSSIER DE MEP DIT CE QU'IL EN EST DE LA MUTATION, OU IL MENT
 * PAR OMISSION.
 *
 * LE FAIT QUI OUVRE CET ORACLE (01/09/2026). La décision humaine D-34 du jour a sorti la campagne
 * de mutation de la boucle ordinaire : « les tests sur les mutants sont exécutés à la demande, lors
 * d'un passage en Prod sur proposition de l'IA, et uniquement s'ils n'ont été exécutés depuis
 * plusieurs modifications de code ». La règle a été écrite au bon endroit — `ETAPE-MEP.md` §1 bis —
 * et elle n'avait AUCUN exécutant. Or c'est exactement le défaut que la v1 de la consigne de
 * restitution décrivait d'elle-même : *une convention qu'aucun run ne charge ne s'applique pas,
 * elle décore.*
 *
 * CE QUE COÛTE L'ABSENCE, et c'est asymétrique. Une campagne jouée et non consignée coûte une
 * relecture ; une campagne JAMAIS PROPOSÉE ne coûte rien du tout — sur le moment. Elle se paie
 * plus tard, en production, sur un défaut d'assertion que la mutation aurait nommé. C'est la forme
 * la plus chère du silence : celle qui ne se signale pas, et qui ressemble en tout point à une
 * étape qui s'est bien passée.
 *
 * TROIS RÈGLES, et la troisième est celle qui empêche l'oracle d'être satisfait par une phrase :
 *
 *   TM1  le dossier de MEP NOMME l'état de la campagne — jouée, ou proposée et refusée. Le
 *        vocabulaire est volontairement large (la doctrine ne prescrit aucune formule), mais le
 *        SILENCE est un défaut : un dossier qui ne parle pas de mutation est indiscernable d'un
 *        dossier où personne n'y a pensé, et le lecteur ne peut pas faire la différence.
 *   TM2  une campagne déclarée JOUÉE porte sa PREUVE localisante — un score, un compte de mutants,
 *        une liste de survivants, ou le chemin du marqueur. Jamais un ✓ nu : c'est la loi
 *        transverse du parc, et c'est au dossier de MEP qu'elle compte le plus, parce que c'est la
 *        pièce qu'on relit six mois plus tard.
 *   TM3  une campagne déclarée JOUÉE est ADOSSÉE AU MARQUEUR que la campagne écrit elle-même chez
 *        le produit (`forge\mutation-derniere-campagne.json`). Une déclaration sans marqueur est
 *        une affirmation ; le marqueur, lui, n'existe que si l'adaptateur est allé au bout. C'est
 *        la seule des trois règles qu'une phrase bien tournée ne peut pas satisfaire.
 *
 * CE QU'IL NE JUGE PAS, et c'est déclaré plutôt que tu :
 *   · la QUALITÉ du refus. « Proposée et refusée » est une décision humaine (R-29) : l'oracle
 *     vérifie qu'elle est écrite, jamais qu'elle est sage ;
 *   · la FRAÎCHEUR du marqueur par rapport au dossier. Comparer leurs dates supposerait que les
 *     deux soient horodatés dans le même fuseau et par la même main, ce qui n'est pas garanti ;
 *   · un produit SANS dossier de MEP : il n'a pas atteint l'étape, et l'accabler serait juger une
 *     absence d'événement. SANS_OBJET, jamais FAIL.
 *
 *   node oracles\oracle-trace-mutation-mep.mjs <produit>   → verdict JSON
 *   node oracles\oracle-trace-mutation-mep.mjs --self-test → fixtures double sens
 */
// Exit : 0 = conforme ou sans objet · 1 = defaut MESURE. Aucun chemin « je ne peux pas mesurer » :
// cet oracle ne depend d'aucun outil externe et lit des fichiers du disque (TF-0648).
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next"]);

/** Les dossiers de MEP d'un produit, où qu'ils vivent — la doctrine n'impose pas leur place. */
function dossiersMep(racine, profondeur = 4) {
  const trouves = [];
  const parcourir = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.isFile() && /^DOSSIER-MEP.*\.md$/i.test(e.name)) trouves.push(join(dir, e.name));
      else if (e.isDirectory() && reste > 0 && !IGNORES.has(e.name) && !e.name.startsWith(".")) {
        parcourir(join(dir, e.name), reste - 1);
      }
    }
  };
  parcourir(racine, profondeur);
  return trouves;
}

// Les vocabulaires sont LARGES a dessein : la doctrine prescrit qu'on DISE, jamais avec quels mots.
// Une expression etroite ferait echouer un dossier honnete sur une tournure, ce qui apprend a
// recopier une formule au lieu de rendre compte — le contraire de ce que cet oracle cherche.
const PARLE_DE_MUTATION = /\bmutation(s)?\b|\bmutant(s)?\b/i;
const DECLAREE_JOUEE = /(campagne|mutation)[^.\n]{0,80}(jou[ée]e?|ex[ée]cut[ée]e?|lanc[ée]e?|pass[ée]e?|men[ée]e?)|jou[ée]e?[^.\n]{0,40}(campagne|mutation)/i;
const DECLAREE_REFUSEE = /(refus|report|[ée]cart|non retenue|pas jou[ée]e?|non jou[ée]e?|d[ée]clin)/i;
const PROPOSEE = /(propos|recommand|sugg[ée]r)/i;
// La PREUVE d'une campagne : un chiffre qui la localise, ou le chemin du marqueur. Le simple mot
// « mutation » suivi d'un « OK » n'en est pas une, et c'est precisement ce que TM2 refuse.
const PREUVE = /(score[^.\n]{0,30}\d|\d+\s*(mutant|survivant)|survivant[^.\n]{0,30}\d|mutation-derniere-campagne\.json|\d+\s*\/\s*\d+)/i;

/** Le marqueur qu'une campagne ecrit elle-meme chez le produit — la preuve qu'elle est allee au bout. */
function marqueur(racine) {
  const f = join(racine, "forge", "mutation-derniere-campagne.json");
  if (!existsSync(f)) return null;
  try {
    const j = JSON.parse(readFileSync(f, "utf8"));
    return (j && typeof j === "object") ? j : null;
  } catch { return null; }
}

export function juger(racine) {
  const findings = [];
  const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const sansObjet = (regle, ou, message) => findings.push({ regle, statut: "SANS_OBJET", ou, message });

  const dossiers = dossiersMep(racine);
  if (!dossiers.length) {
    sansObjet("TM1", racine, "aucun DOSSIER-MEP.md sous ce produit — l'étape de mise en production "
      + "n'a pas été atteinte. Ce n'est pas un défaut : c'est une absence d'événement, et juger une "
      + "absence d'événement reviendrait à accabler un projet pour ne pas être allé assez loin.");
    return findings;
  }

  const note = marqueur(racine);
  for (const chemin of dossiers) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); }
    catch (e) { ko("TM1", chemin, `dossier illisible (${e.code || e.message}) — un dossier qu'on ne peut pas lire ne prouve rien`); continue; }

    // TM1 — le dossier PARLE de la mutation, dans un sens ou dans l'autre.
    const parle = PARLE_DE_MUTATION.test(texte);
    const joueeDite = parle && DECLAREE_JOUEE.test(texte);
    const refusDit = parle && (DECLAREE_REFUSEE.test(texte) || PROPOSEE.test(texte));
    if (!parle) {
      ko("TM1", chemin, "le dossier de MEP ne dit RIEN de la campagne de mutation. Depuis D-34 "
        + "(01/09/2026) elle est à la demande et se propose ICI : un dossier muet est indiscernable "
        + "d'une étape où personne n'y a pensé. Écrire « campagne jouée — <preuve> » ou "
        + "« campagne proposée et refusée — <motif> » ; les deux sont recevables, le silence non.");
      continue;
    }
    if (!joueeDite && !refusDit) {
      ko("TM1", chemin, "le dossier mentionne la mutation sans dire ce qu'il en est advenu — ni jouée, "
        + "ni proposée puis refusée. Une mention n'est pas un état.");
      continue;
    }
    ok("TM1", chemin, joueeDite ? "campagne déclarée jouée" : "campagne déclarée proposée puis non jouée");

    if (!joueeDite) {
      sansObjet("TM2", chemin, "campagne non jouée — il n'y a pas de preuve de campagne à exiger ; "
        + "la décision de ne pas la jouer est humaine (R-29) et cet oracle ne la juge pas");
      sansObjet("TM3", chemin, "campagne non jouée — aucun marqueur n'est dû");
      continue;
    }

    // TM2 — une campagne jouee porte sa preuve chiffree ou localisante.
    PREUVE.test(texte)
      ? ok("TM2", chemin, "la campagne déclarée jouée porte une preuve chiffrée ou localisante")
      : ko("TM2", chemin, "campagne déclarée JOUÉE sans preuve : ni score, ni compte de mutants ou de "
          + "survivants, ni chemin du marqueur. Un ✓ nu dans un dossier de MEP est la pièce qu'on "
          + "relit six mois plus tard en croyant qu'elle prouve quelque chose.");

    // TM3 — la declaration s'adosse au marqueur que la campagne ecrit elle-meme.
    if (!note) {
      ko("TM3", chemin, "campagne déclarée JOUÉE, et AUCUN marqueur `forge\\mutation-derniere-campagne.json` "
        + "chez ce produit. Ce fichier n'existe que si l'adaptateur est allé au bout : une déclaration "
        + "sans lui est une affirmation, et c'est la seule des trois règles qu'une phrase bien "
        + "tournée ne peut pas satisfaire.");
    } else if (!note.sha) {
      ko("TM3", chemin, "le marqueur existe mais ne porte aucun point de référence (`sha` absent) — "
        + "sans lui, la condition « depuis plusieurs modifications de code » n'a rien à compter, et "
        + "la prochaine campagne sera proposée à tort ou passée sous silence.");
    } else {
      ok("TM3", chemin, `campagne adossée au marqueur du produit (référence ${String(note.sha).slice(0, 12)})`);
    }
  }
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.every((x) => x.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS");

const NON_JUGE = [
  "la QUALITÉ d'un refus : « proposée et refusée » est une décision humaine (R-29) — l'oracle "
  + "vérifie qu'elle est écrite, jamais qu'elle est sage",
  "la FRAÎCHEUR du marqueur par rapport au dossier : comparer leurs dates supposerait un même "
  + "fuseau et une même main, ce qui n'est pas garanti",
  "un produit SANS dossier de MEP : SANS_OBJET, jamais FAIL — l'étape n'a pas été atteinte",
  "la véracité d'un score recopié à la main dans le dossier : TM3 adosse la déclaration au "
  + "marqueur, il ne recalcule pas la campagne",
];

// --- Banc a double sens ------------------------------------------------------------------------
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "trace-mutation-"));
  const produit = (nom, dossier, note) => {
    const racine = join(dir, nom);
    mkdirSync(join(racine, "forge", "etapes", "mep"), { recursive: true });
    if (dossier !== null) writeFileSync(join(racine, "forge", "etapes", "mep", "DOSSIER-MEP.md"), dossier, "utf8");
    if (note) writeFileSync(join(racine, "forge", "mutation-derniere-campagne.json"), JSON.stringify(note), "utf8");
    return racine;
  };
  const casse = [];
  const attendre = (nom, racine, regle, statut) => {
    const f = juger(racine).filter((x) => x.regle === regle);
    if (!f.length) return casse.push(`${nom} : ${regle} n'a rendu AUCUN verdict — la règle est muette sur un cas qu'elle doit voir`);
    if (f[0].statut !== statut) casse.push(`${nom} : ${regle} rend ${f[0].statut}, attendu ${statut} — ${f[0].message.slice(0, 120)}`);
  };

  // VERT : campagne jouee, chiffree, adossee au marqueur.
  attendre("vert", produit("vert",
    "# Dossier de MEP\n\nCampagne de mutation JOUÉE avant ce passage : score 0,82, 41 mutants viables, 7 survivants nommés.\n",
    { sha: "abc1234def5678", score: 0.82 }), "TM3", "PASS");

  // ROUGE 1 : le dossier ne dit RIEN de la mutation — le silence, le cas fondateur.
  attendre("muet", produit("muet", "# Dossier de MEP\n\nBuild OK, healthcheck ×3 OK, smoke tests OK.\n", null), "TM1", "FAIL");

  // ROUGE 2 : campagne declaree jouee, AUCUNE preuve chiffree.
  attendre("sans-preuve", produit("sans-preuve",
    "# Dossier de MEP\n\nLa campagne de mutation a été jouée, tout est bon.\n",
    { sha: "abc1234def5678" }), "TM2", "FAIL");

  // ROUGE 3 : campagne declaree jouee, AUCUN marqueur — la regle qu'une phrase ne peut pas satisfaire.
  attendre("sans-marqueur", produit("sans-marqueur",
    "# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n", null), "TM3", "FAIL");

  // ROUGE 4 : marqueur present mais SANS point de reference.
  attendre("marqueur-nu", produit("marqueur-nu",
    "# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n",
    { score: 0.91 }), "TM3", "FAIL");

  // VERT 2 : campagne PROPOSEE et refusee — recevable, et TM2/TM3 ne s'appliquent pas.
  const refus = produit("refus",
    "# Dossier de MEP\n\nCampagne de mutation proposée (12 modifications depuis la dernière) puis "
    + "écartée pour ce passage : correctif d'une ligne, décision humaine du jour.\n", null);
  attendre("refus", refus, "TM1", "PASS");
  attendre("refus", refus, "TM2", "SANS_OBJET");
  attendre("refus", refus, "TM3", "SANS_OBJET");

  // SANS OBJET : produit sans dossier de MEP — une absence d'evenement ne s'accable pas.
  attendre("sans-dossier", produit("sans-dossier", null, null), "TM1", "SANS_OBJET");

  // Le VERDICT d'ensemble se lit aussi : un vert doit sortir en 0, un rouge en 1.
  const rv = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "vert")], { encoding: "utf8" });
  const rr = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "muet")], { encoding: "utf8" });
  if (rv.status !== 0) casse.push("le produit conforme ne sort pas en 0 — la règle crie sur un travail juste");
  if (rr.status !== 1) casse.push("le dossier MUET ne sort pas en 1 — le silence passe, et c'est le cas fondateur");

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test trace-mutation-MEP : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test trace-mutation-MEP : 8/8 PASS (campagne jouée, chiffrée et adossée au marqueur PASS ; "
      + "dossier MUET FAIL — le cas fondateur ; campagne jouée SANS preuve chiffrée FAIL ; campagne jouée "
      + "SANS marqueur FAIL — la règle qu'une phrase ne peut pas satisfaire ; marqueur SANS point de "
      + "référence FAIL ; campagne PROPOSÉE puis refusée PASS avec TM2 et TM3 sans objet ; produit sans "
      + "dossier de MEP SANS_OBJET et jamais FAIL ; codes de sortie 0 et 1 vérifiés)");
  return casse.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  if (arg === "--self-test") process.exit(selfTest());
  const racine = arg || process.cwd();
  const findings = juger(racine);
  const verdict = verdictDe(findings);
  process.stdout.write(JSON.stringify({
    oracle: "oracle-trace-mutation-mep",
    version: "1.0.0",
    regle: "D-34 (01/09/2026) — la campagne de mutation est à la demande, proposée au passage en "
      + "production : le dossier de MEP dit ce qu'il en est advenu (ETAPE-MEP.md §1 bis)",
    verdict,
    produit: racine,
    findings,
    non_juge: NON_JUGE,
  }, null, 1) + "\n");
  process.exit(verdict === "FAIL" ? 1 : 0);
}
