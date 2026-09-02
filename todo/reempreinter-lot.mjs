#!/usr/bin/env node
/**
 * reempreinter-lot.mjs — UN SIDECAR RÉÉCRIT PAR L'ANONYMISATION N'EST PAS UN SIDECAR ÉDITÉ,
 * et le registre doit pouvoir le dire SANS qu'on le croie sur parole.
 *
 * ============================================================================================
 * LE FAIT QUI FAIT NAÎTRE CET OUTIL (02/09/2026)
 * ============================================================================================
 *
 * La passe d'anonymisation du 01/09 (D-37, `anonymiser-suivis.mjs`) a réécrit 223 fichiers suivis,
 * dont les sidecars `*.tf.jsonl` de `input\00-retours\`. Le lendemain, `oracle-boite-entree`
 * rendait 23 constats B2 — « sidecar ÉDITÉ après son ingestion » — et 2 constats B1 sur des
 * dérivés normalisés. Mesuré sur `Produit-02 - RETOURS - 20260826c.tf.jsonl` : l'empreinte
 * consignée à l'ingestion est EXACTEMENT celle du fichier tel qu'il était avant la passe (commit
 * 478eb82) ; le fichier courant en porte une autre. Aucune candidature n'a été ajoutée ni
 * retirée : le contenu courant est la forme ANONYMISÉE du contenu ingéré, rien d'autre.
 *
 * B2 avait donc raison sur le fait (le contenu a changé) et tort sur la lecture (personne n'a
 * rien ajouté). Deux mauvaises réponses étaient à portée de main :
 *   · assouplir B2 — un contrôle qui tolère « une réécriture » sans preuve tolère toute
 *     édition, et B2 cesse d'exister ;
 *   · ré-ingérer le sidecar — l'idempotence est PAR EMPREINTE : un sidecar anonymisé n'est plus
 *     reconnu, et `ingerer-lot` recréerait chaque candidature en doublon (incident du 13/08,
 *     32 doublons, même mécanisme).
 *
 * ============================================================================================
 * CE QUE FAIT L'OUTIL : IL PROUVE, PUIS IL CONSIGNE
 * ============================================================================================
 *
 * Une ré-empreinte n'est acceptée que si l'outil ÉTABLIT que le contenu courant est la forme
 * anonymisée d'un contenu déjà ingéré :
 *   1. le NOM du sidecar est connu du registre (un nom inconnu, c'est `ingerer-lot` qu'il faut) ;
 *   2. l'empreinte courante n'est pas déjà consignée (sinon il n'y a rien à faire, et on le dit) ;
 *   3. un contenu « d'AVANT » existe dont l'empreinte EST consignée — trouvé dans l'historique git
 *      du fichier (`git log --follow`, les renommages compris), ou fourni par `--avant <copie>`
 *      quand git ne suit pas le fichier (un lot brut anonymisé sur disque) ;
 *   4. `anonymiser(avant)` est IDENTIQUE au contenu courant, aux fins de ligne près. Un caractère
 *      de plus est une édition : REFUS, rien n'est écrit, et le message dit quoi faire.
 *
 * L'événement consigné est une `ingestion` sans `creations` — le seul type que le registre
 * accepte sans identifiant, précédent de `heritage_non_verifie` — portant un bloc `reempreinte`
 * : empreinte d'avant, motif, preuve, commit d'origine. Il passe par `journaliser.mjs`, qui
 * stampe l'heure et annule l'écriture si le registre cessait de passer.
 *
 * Usage : node reempreinter-lot.mjs <sidecar.tf.jsonl> [--avant <copie>] [--par-rapprochement] [--registre <TODO.jsonl>]
 *                                   [--depot <racine git>] [--essai]
 * Exit : 0 = consigné, ou rien à faire · 1 = refus (preuve absente) · 2 = usage / erreur.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { basename, dirname, join, resolve, relative, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { empreinteTexte, normaliserLignes } from "../scripts/lib-empreinte.mjs";
import { anonymiser } from "./anonymiser-entrant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SUFFIXE_SIDECAR = ".tf.jsonl";

const shaBrut = (octets) => createHash("sha256").update(octets).digest("hex");

/** Les événements d'ingestion du registre ET de l'archive : par empreinte, et par nom. */
export function ingestions(registre) {
  const archive = join(dirname(registre), "TODO-ARCHIVE.jsonl");
  const parSha = new Set(), parNom = new Set();
  for (const f of [registre, archive]) {
    if (!existsSync(f)) continue;
    for (const ligne of readFileSync(f, "utf8").split("\n")) {
      if (!ligne.trim()) continue;
      let e; try { e = JSON.parse(ligne); } catch { continue; }
      if (e.ev !== "ingestion") continue;
      if (e.lot_sha) parSha.add(e.lot_sha);
      if (e.fichier) parNom.add(String(e.fichier).split(/[\\/]/).pop());
    }
  }
  return { parSha, parNom };
}

/** Une empreinte consignée couvre-t-elle ces octets ? Forme normalisée OU brute (TF-0253). */
const couvre = (parSha, octets) =>
  parSha.has(empreinteTexte(octets.toString("utf8"))) || parSha.has(shaBrut(octets));

/**
 * Cherche dans l'historique git du fichier une version dont l'empreinte est consignée.
 * `--follow` suit les renommages : la passe du 01/09 en a fait quinze, et un fichier renommé
 * sans historique serait un fichier « jamais ingéré » aux yeux d'un outil qui ne suit pas.
 * Rend `{ commit, chemin, octets }` ou `null`.
 */
export function versionIngeree(depot, chemin, parSha) {
  const rel = relative(depot, chemin).replaceAll("\\", "/");
  const log = spawnSync("git", ["-C", depot, "log", "--follow", "--format=%H", "--name-only", "--", rel],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (log.status !== 0) return null;
  let commit = null;
  for (const ligne of log.stdout.split("\n")) {
    const l = ligne.trim();
    if (!l) continue;
    if (/^[0-9a-f]{40}$/.test(l)) { commit = l; continue; }
    if (!commit) continue;
    const show = spawnSync("git", ["-C", depot, "show", `${commit}:${l}`], { maxBuffer: 64 * 1024 * 1024 });
    if (show.status !== 0) continue;
    if (couvre(parSha, show.stdout)) return { commit, chemin: l, octets: show.stdout };
  }
  // SECOND FILET, et il a été payé à la recette : `--follow` ne suit un renommage que si git le
  // DÉTECTE, c'est-à-dire si le contenu reste assez semblable. Un petit sidecar dont chaque ligne
  // porte le nom substitué passe sous le seuil de similarité — git voit une suppression et un
  // ajout, et l'historique s'arrête au renommage. On cherche alors parmi TOUS les blobs que le
  // dossier a portés, en ne lisant que ceux dont l'ancien nom s'anonymise en le nom courant.
  const dossier = dirname(rel);
  const nomCourant = basename(rel);
  const objets = spawnSync("git", ["-C", depot, "rev-list", "--objects", "--all", "--", dossier],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (objets.status !== 0) return null;
  const vus = new Set();
  for (const ligne of objets.stdout.split("\n")) {
    const i = ligne.indexOf(" ");
    if (i < 0) continue;
    const sha = ligne.slice(0, i), cheminObjet = ligne.slice(i + 1);
    const nomAncien = basename(cheminObjet);
    if (!nomAncien.endsWith(SUFFIXE_SIDECAR) || vus.has(sha)) continue;
    vus.add(sha);
    if (nomAncien !== nomCourant && anonymiser(nomAncien).texte !== nomCourant) continue;
    const cat = spawnSync("git", ["-C", depot, "cat-file", "-p", sha], { maxBuffer: 64 * 1024 * 1024 });
    if (cat.status !== 0 || !couvre(parSha, cat.stdout)) continue;
    // Le commit qui a introduit ce blob : le plus ancien où il apparaît à ce chemin.
    const quand = spawnSync("git", ["-C", depot, "log", "--all", "--format=%H", "--diff-filter=A", "--", cheminObjet], { encoding: "utf8" });
    const commit = (quand.stdout || "").trim().split("\n").filter(Boolean).pop() || sha;
    return { commit, chemin: cheminObjet, octets: cat.stdout };
  }
  return null;
}

/** Le titre d'une ligne de sidecar, anonymisé jusqu'au point fixe et normalisé pour comparaison. */
const titreCanon = (titre) => {
  let t = String(titre || "");
  for (let i = 0; i < 3; i++) { const a = anonymiser(t).texte; if (a === t) break; t = a; }
  return t.trim().replace(/\s+/g, " ");
};

/**
 * Rapproche les titres d'un sidecar des créations que son ingestion consignée a produites.
 * Rend `{ ok, n, ts, lot_sha_avant }` ou `{ ok: false, motif }`.
 */
export function rapprocher(registre, nom, contenuCourant) {
  const archive = join(dirname(registre), "TODO-ARCHIVE.jsonl");
  const evs = [];
  for (const f of [registre, archive]) {
    if (!existsSync(f)) continue;
    for (const l of readFileSync(f, "utf8").split("\n")) { if (!l.trim()) continue; try { evs.push(JSON.parse(l)); } catch { /* ligne illisible : ignorée */ } }
  }
  const ingestions = evs.filter((e) => e.ev === "ingestion" && e.creations > 0 && String(e.fichier || "").split(/[\\/]/).pop() === nom);
  if (!ingestions.length) return { ok: false, motif: "aucune ingestion avec créations consignée sous ce nom" };
  const parTs = new Set(ingestions.map((e) => e.ts));
  const attendus = evs.filter((e) => e.ev === "creation" && parTs.has(e.ts)).map((e) => titreCanon(e.titre)).sort();
  let lignes;
  try { lignes = contenuCourant.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)); }
  catch (e) { return { ok: false, motif: `sidecar illisible : ${e.message}` }; }
  const portes = lignes.filter((l) => l.rectifie === undefined).map((l) => titreCanon(l.titre)).sort();
  const creations = ingestions.reduce((s, e) => s + e.creations, 0);
  if (portes.length !== creations || attendus.length !== creations) {
    return { ok: false, motif: `${portes.length} ligne(s) au sidecar, ${creations} création(s) consignée(s), ${attendus.length} titre(s) retrouvé(s) — les comptes ne s'accordent pas` };
  }
  for (let i = 0; i < portes.length; i++) {
    if (portes[i] !== attendus[i]) return { ok: false, motif: `titre sans correspondance au registre : « ${portes[i].slice(0, 80)} »` };
  }
  return { ok: true, n: creations, ts: ingestions[0].ts, lot_sha_avant: ingestions[0].lot_sha };
}

/**
 * Décide, sans rien écrire. Rend `{ code, message, evenement? }` :
 *   code 0 sans événement = rien à faire · code 0 avec événement = à consigner · code 1 = refus.
 */
export function decider({ sidecar, registre, depot, avant, parRapprochement = false }) {
  const nom = basename(sidecar);
  if (!nom.endsWith(SUFFIXE_SIDECAR)) return { code: 2, message: `${nom} n'est pas un sidecar ${SUFFIXE_SIDECAR}` };
  const courant = readFileSync(sidecar);
  const { parSha, parNom } = ingestions(registre);
  if (couvre(parSha, courant)) {
    return { code: 0, message: `rien à faire : l'empreinte courante de ${nom} est déjà consignée` };
  }
  if (!parNom.has(nom)) {
    return { code: 1, message: `${nom} n'a JAMAIS été ingéré sous ce nom — une ré-empreinte suppose une ingestion ; ` +
      "c'est `node todo\\ingerer-lot.mjs <sidecar>` qu'il faut" };
  }
  let origine;
  if (avant) {
    const octets = readFileSync(avant);
    if (!couvre(parSha, octets)) {
      return { code: 1, message: `la copie d'avant (${basename(avant)}) n'a PAS l'empreinte consignée pour ${nom} — ` +
        "ce n'est pas le contenu ingéré, rien n'est écrit" };
    }
    origine = { commit: null, chemin: avant, octets };
  } else {
    origine = versionIngeree(depot, sidecar, parSha);
    if (!origine && parRapprochement) {
      // TROISIÈME PREUVE, explicite et plus faible, et elle a été payée sur un cas réel (02/09) : un
      // sidecar entré au suivi DÉJÀ anonymisé — son contenu d'avant n'existe ni dans git ni sur le
      // disque. Ce qui existe, c'est le REGISTRE : l'ingestion consignée sous ce nom a créé N
      // candidatures, et leurs titres (anonymisés) sont ce que le sidecar doit porter, ni plus ni
      // moins. Titre à titre, en nombre égal : c'est un rapprochement, pas une empreinte, et
      // l'événement le dit dans sa preuve. Une ligne de plus ou de moins : REFUS.
      const r = rapprocher(registre, nom, courant.toString("utf8"));
      if (!r.ok) return { code: 1, message: `${nom} : rapprochement REFUSÉ — ${r.motif}` };
      const shaAvantR = r.lot_sha_avant;
      const cheminR = depot && !relative(depot, sidecar).startsWith("..")
        ? relative(depot, sidecar).replaceAll("\\", "/") : String(sidecar);
      return {
        code: 0,
        message: `${nom} : ${r.n} titre(s) du sidecar = ${r.n} création(s) de l'ingestion consignée du ${r.ts} — ré-empreinte à consigner par RAPPROCHEMENT`,
        evenement: {
          ev: "ingestion", lot_sha: empreinteTexte(normaliserLignes(courant.toString("utf8"))), fichier: anonymiser(cheminR).texte,
          reempreinte: {
            lot_sha_avant: shaAvantR,
            motif: "sidecar entré au suivi déjà anonymisé (D-37) : aucun contenu d'avant dans git ni sur disque ; ses candidatures sont exactement celles de l'ingestion consignée",
            preuve: `rapprochement titre à titre : ${r.n} lignes du sidecar (titres anonymisés) = ${r.n} créations horodatées ${r.ts}`,
            commit_origine: null,
          },
        },
      };
    }
    if (!origine) {
      return { code: 1, message: `aucune version de ${nom} dans l'historique git ne porte l'empreinte consignée — ` +
        "si le fichier n'est pas suivi, fournir la copie d'avant par `--avant <copie>` ; si le sidecar est entré au suivi déjà " +
        "anonymisé, `--par-rapprochement` confronte ses titres aux créations consignées ; sinon c'est une édition, pas une anonymisation" };
    }
  }
  const attendu = normaliserLignes(anonymiser(origine.octets.toString("utf8")).texte);
  const reel = normaliserLignes(courant.toString("utf8"));
  if (attendu !== reel) {
    return { code: 1, message: `le contenu courant de ${nom} n'est PAS la forme anonymisée du contenu ingéré` +
      `${origine.commit ? ` (commit ${origine.commit.slice(0, 7)})` : ""} — c'est une ÉDITION : ce qui a été ajouté ` +
      "n'est entré nulle part. Rien n'est écrit ; passer par une rectification (ingerer-lot, `rectifie`) ou ré-ingérer un lot neuf" };
  }
  const shaAvant = parSha.has(empreinteTexte(origine.octets.toString("utf8")))
    ? empreinteTexte(origine.octets.toString("utf8")) : shaBrut(origine.octets);
  const chemin = depot && !relative(depot, sidecar).startsWith("..")
    ? relative(depot, sidecar).replaceAll("\\", "/") : String(sidecar);
  return {
    code: 0,
    message: `${nom} : contenu courant = forme anonymisée du contenu ingéré${origine.commit ? ` (commit ${origine.commit.slice(0, 7)})` : " (copie d'avant fournie)"} — ré-empreinte à consigner`,
    evenement: {
      ev: "ingestion", lot_sha: empreinteTexte(reel), fichier: anonymiser(chemin).texte,
      reempreinte: {
        lot_sha_avant: shaAvant,
        motif: "sidecar réécrit par l'anonymisation (D-37) : contenu courant = forme anonymisée du contenu ingéré, aucune candidature ajoutée ni retirée",
        preuve: "normaliserLignes(anonymiser(contenu ingéré)) === normaliserLignes(contenu courant)",
        commit_origine: origine.commit ? origine.commit.slice(0, 12) : null,
      },
    },
  };
}

/** Consigne l'événement par `journaliser.mjs` (heure stampée, écriture annulée si le registre casse). */
export function consigner(evenement, registre) {
  const tmp = mkdtempSync(join(tmpdir(), "reempreinte-"));
  const f = join(tmp, "evenement.json");
  writeFileSync(f, JSON.stringify([evenement]), "utf8");
  const r = spawnSync(process.execPath, [join(ICI, "journaliser.mjs"), "--fichier", f, "--registre", registre], { encoding: "utf8" });
  rmSync(tmp, { recursive: true, force: true });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const opt = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  // Le positionnel est le seul argument qui n'est ni un drapeau ni la valeur d'une option.
  let sidecar = null;
  for (let i = 0; i < args.length; i++) {
    if (["--avant", "--registre", "--depot"].includes(args[i])) { i++; continue; }
    if (args[i].startsWith("--")) continue;
    sidecar = args[i];
  }
  if (!sidecar || !existsSync(sidecar)) {
    console.error("usage : node reempreinter-lot.mjs <sidecar.tf.jsonl> [--avant <copie>] [--registre <TODO.jsonl>] [--depot <racine git>] [--essai]");
    process.exit(2);
  }
  const registre = resolve(opt("--registre") || join(ICI, "TODO.jsonl"));
  const depot = resolve(opt("--depot") || join(ICI, ".."));
  const avant = opt("--avant") ? resolve(opt("--avant")) : null;
  const ESSAI = args.includes("--essai");
  const d = decider({ sidecar: resolve(sidecar), registre, depot, avant, parRapprochement: args.includes("--par-rapprochement") });
  if (d.code !== 0 || !d.evenement) {
    console.log(JSON.stringify({ outil: "reempreinter-lot", verdict: d.code === 0 ? "RIEN_A_FAIRE" : "REFUS", message: d.message }, null, 1));
    process.exit(d.code);
  }
  if (ESSAI) {
    console.log(JSON.stringify({ outil: "reempreinter-lot", verdict: "ESSAI", message: d.message, evenement: d.evenement }, null, 1));
    process.exit(0);
  }
  const c = consigner(d.evenement, registre);
  console.log(JSON.stringify({ outil: "reempreinter-lot", verdict: c.code === 0 ? "CONSIGNE" : "ECHEC_JOURNAL", message: d.message,
    lot_sha: d.evenement.lot_sha.slice(0, 12), journal: c.sortie.trim().slice(0, 400) }, null, 1));
  process.exit(c.code === 0 ? 0 : 1);
}
