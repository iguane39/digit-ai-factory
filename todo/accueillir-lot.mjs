#!/usr/bin/env node
/**
 * accueillir-lot.mjs — UN LOT NE DEVIENT SUIVI QU'APRÈS AVOIR ÉTÉ PSEUDONYMISÉ (TF-0981).
 *
 * ============================================================================================
 * LA FENÊTRE QUE CE MODULE SUPPRIME, ET SA MESURE
 * ============================================================================================
 *
 * Mesuré le 08/09/2026 : `input\00-retours\` est SUIVI par git — 394 fichiers. Les lots de
 * retours y étaient déposés tels qu'ils arrivent, nom de fichier compris. Six lots sont arrivés
 * ce jour-là portant un nom réel dans leur NOM DE FICHIER ; chacun a séjourné dans un répertoire
 * versionné avant que la pseudonymisation ne soit jouée À LA MAIN.
 *
 * Un `git add -A` dans cette fenêtre — et c'est le geste normal — embarque le nom. C'est arrivé,
 * et il a fallu amender un commit avant publication. La durée de la fenêtre dépendait de
 * l'attention de qui travaillait, ce qui est exactement ce qu'une affordance câblée doit
 * supprimer (loi n° 1 : toute affordance est câblée ou n'existe pas).
 *
 * ============================================================================================
 * DEUX RÉPERTOIRES, ET POURQUOI ON N'EN IGNORE PAS UN SEUL
 * ============================================================================================
 *
 * La forme naïve — rendre `input\00-retours\` ignoré — aurait dé-suivi 394 fichiers déjà publiés,
 * un geste destructif sans rapport avec le défaut. La forme juste sépare les deux rôles :
 *
 *   · `input\00-retours\_arrivee\` — IGNORÉ par git. Un produit y dépose son lot tel qu'il est,
 *     nom réel compris. Rien n'y est indexable, donc aucun `git add` ne peut l'emporter ;
 *   · `input\00-retours\` — SUIVI. Un lot n'y arrive QUE par ce module, donc déjà propre.
 *
 * La fenêtre ne se réduit pas : elle disparaît. Il n'existe aucun instant où un fichier porteur
 * d'un nom réel est indexable.
 *
 * ============================================================================================
 * CE QU'IL NE FAIT PAS
 * ============================================================================================
 *
 *   · il n'INGÈRE pas — il accueille, et rend la main ; l'ingestion reste `ingerer-lot.mjs`,
 *     appelée ensuite sur le fichier déposé. Deux gestes, deux verdicts, deux journaux ;
 *   · il ne devine aucun chemin : le répertoire d'arrivée est nommé ici et nulle part ailleurs ;
 *   · il ne touche pas aux lots DÉJÀ dans le répertoire suivi — ceux-là sont l'affaire de
 *     `anonymiser-suivis.mjs`, qui balaie ce que git suit.
 *
 * Usage : node todo/accueillir-lot.mjs [--essai]   ·   exit 0 si rien à faire ou tout accueilli.
 */
import { readdirSync, existsSync, mkdirSync, renameSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { anonymiser } from "./anonymiser-entrant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
export const BOITE = join(ICI, "..", "input", "00-retours");
export const ARRIVEE = join(BOITE, "_arrivee");

/**
 * Accueille tout ce qui attend dans l'arrivée : pseudonymise le NOM et le CONTENU, puis dépose
 * dans la boîte suivie. Rend la liste de ce qui a été fait, sans jamais écrire si `essai`.
 */
export function accueillir({ arrivee = ARRIVEE, boite = BOITE, essai = false } = {}) {
  const faits = [], refuses = [];
  if (!existsSync(arrivee)) return { arrivee, boite, en_attente: 0, faits, refuses };

  const entrants = readdirSync(arrivee).filter((n) => !n.startsWith(".") && n !== "README.md");
  for (const nom of entrants) {
    const source = join(arrivee, nom);
    let brut;
    try { brut = readFileSync(source, "utf8"); }
    catch (e) { refuses.push({ fichier: nom, motif: `illisible en texte (${e.code || e.message})` }); continue; }

    // Le NOM d'abord : c'est lui qui a fait entrer un nom réel dans un commit le 08/09.
    const nomPropre = anonymiser(nom);
    const contenu = anonymiser(brut, { code: /\.(m?js|py|json|ya?ml)$/i.test(nom) });
    const cible = join(boite, nomPropre.texte);

    if (existsSync(cible)) {
      refuses.push({ fichier: nom, motif: "un lot du même nom existe déjà dans la boîte suivie — "
        + "un lot déposé ne s'écrase jamais, le suivant est un fichier daté distinct" });
      continue;
    }
    if (essai) {
      faits.push({ de: nom, vers: nomPropre.texte, nom_reecrit: nomPropre.texte !== nom,
        contenu_reecrit: contenu.texte !== brut, ecrit: false });
      continue;
    }
    mkdirSync(boite, { recursive: true });
    writeFileSync(cible, contenu.texte, "utf8");
    rmSync(source);
    faits.push({ de: nom, vers: nomPropre.texte, nom_reecrit: nomPropre.texte !== nom,
      contenu_reecrit: contenu.texte !== brut, ecrit: true });
  }
  return { arrivee, boite, en_attente: entrants.length, faits, refuses };
}

// ---- self-test : les DEUX sens, sur une arborescence jetable --------------------------------
async function selfTest() {
  const { mkdtempSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const casse = [];
  const T = mkdtempSync(join(tmpdir(), "accueil-"));
  const arr = join(T, "_arrivee"), bo = join(T, "boite");
  mkdirSync(arr, { recursive: true }); mkdirSync(bo, { recursive: true });

  // Tables jetables : ce banc n'étend JAMAIS le référentiel réel (TF-0957).
  writeFileSync(join(T, "_noms.json"), JSON.stringify({
    noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" },
  }), "utf8");
  writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: { "CalculatriceZorglubZAP": "Produit-01" } }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(T, "_noms.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(T, "_prod.json");

  // 1) ROUGE → VERT : un lot porteur dans son NOM et son CONTENU ressort propre des deux côtés.
  writeFileSync(join(arr, "CalculatriceZorglubZAP - RETOURS - 20260908a.md"), "lot de CalculatriceZorglubZAP\n", "utf8");
  const r = accueillir({ arrivee: arr, boite: bo });
  const depose = readdirSync(bo);
  if (depose.length !== 1) casse.push(`le lot n'est pas déposé dans la boîte : ${JSON.stringify(depose)}`);
  else {
    if (/Zorglub/i.test(depose[0])) casse.push("le NOM déposé porte encore le nom réel : " + depose[0]);
    const corps = readFileSync(join(bo, depose[0]), "utf8");
    if (/Zorglub/i.test(corps)) casse.push("le CONTENU déposé porte encore le nom réel : " + corps.trim());
  }
  if (readdirSync(arr).length !== 0) casse.push("le lot reste dans l'arrivée après accueil — il serait accueilli deux fois");

  // 2) SECOND SENS : un lot PROPRE traverse sans être réécrit, et son nom ne bouge pas.
  writeFileSync(join(arr, "Produit-09 - RETOURS - 20260908b.md"), "rien a voir ici\n", "utf8");
  const r2 = accueillir({ arrivee: arr, boite: bo });
  const f2 = r2.faits.find((x) => x.de.startsWith("Produit-09"));
  if (!f2) casse.push("un lot propre n'est pas accueilli");
  else if (f2.nom_reecrit || f2.contenu_reecrit) casse.push("un lot PROPRE est réécrit pour rien");

  // 3) UN LOT DÉPOSÉ NE S'ÉCRASE JAMAIS : le même nom une seconde fois est refusé, pas écrasé.
  writeFileSync(join(arr, "Produit-09 - RETOURS - 20260908b.md"), "contenu DIFFERENT\n", "utf8");
  const r3 = accueillir({ arrivee: arr, boite: bo });
  if (!r3.refuses.length) casse.push("un lot du même nom écrase celui qui est déjà déposé");
  else if (readFileSync(join(bo, "Produit-09 - RETOURS - 20260908b.md"), "utf8").includes("DIFFERENT"))
    casse.push("le lot déjà déposé a été écrasé malgré le refus");

  // 4) ESSAI : rien n'est écrit, et l'arrivée n'est pas vidée.
  const avant = readdirSync(arr).length;
  const r4 = accueillir({ arrivee: arr, boite: bo, essai: true });
  if (readdirSync(arr).length !== avant) casse.push("le mode essai a vidé l'arrivée");
  if (r4.faits.some((x) => x.ecrit)) casse.push("le mode essai déclare avoir écrit");

  rmSync(T, { recursive: true, force: true });
  for (const m of casse) console.log("  [FAIL] " + m);
  console.log(`\nSelf-test accueillir-lot (TF-0981) : ${4 - casse.length}/4 cas, ${casse.length} FAIL`);
  return casse.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
    === process.argv[1].toLowerCase().replaceAll("\\", "/")) {
  if (process.argv.includes("--self-test")) process.exit(await selfTest());
  const r = accueillir({ essai: process.argv.includes("--essai") });
  console.log(JSON.stringify({ ...r, message: r.en_attente
    ? `${r.faits.length} lot(s) accueilli(s), ${r.refuses.length} refusé(s)`
    : "rien n'attend dans l'arrivée" }, null, 1));
  process.exit(r.refuses.length ? 1 : 0);
}
