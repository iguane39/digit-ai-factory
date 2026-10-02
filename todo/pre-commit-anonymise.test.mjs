#!/usr/bin/env node
/**
 * Banc de `pre-commit-anonymise.mjs` (TF-0980) — sur un DÉPÔT JETABLE, jamais sur celui-ci.
 *
 * Le module travaille sur l'index d'un vrai dépôt git : le banc en crée un sous le répertoire
 * temporaire, y indexe des fichiers, et vérifie ce que le geste en fait. Il pose aussi ses
 * propres tables jetables (TF-0957) — un banc qui hérite du référentiel de production l'abîme.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "precommit-"));
const DEPOT = join(T, "depot");
mkdirSync(DEPOT, { recursive: true });
const git = (...a) => execFileSync("git", a, { cwd: DEPOT, encoding: "utf8" });
git("init", "-q");
git("config", "user.email", "banc@exemple.test");
git("config", "user.name", "banc");

// Tables jetables, sous le répertoire temporaire : ce banc n'étend jamais le référentiel réel.
writeFileSync(join(T, "_noms.json"), JSON.stringify({
  noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" },
}), "utf8");
writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: { "CalculatriceZorglubZAP": "Produit-01" } }), "utf8");
process.env.FORGE_NOMS_INTERDITS = join(T, "_noms.json");
process.env.FORGE_PRODUITS_PSEUDO = join(T, "_prod.json");

const { passer } = await import("./pre-commit-anonymise.mjs");

// Le module lit la racine depuis SON emplacement ; on lui donne donc les fichiers à la main,
// ce qui est aussi la façon de l'éprouver sans dépendre de l'index du dépôt courant.
const poser = (nom, corps) => { writeFileSync(join(DEPOT, nom), corps, "utf8"); return nom; };

check("ROUGE → VERT — un contenu porteur est pseudonymisé, et le fichier est réécrit", () => {
  const f = poser("note.md", "Lot de CalculatriceZorglubZAP pour Zorglub.\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(r.corriges.length === 1, "le fichier porteur n'est pas relevé");
  att(r.corriges[0].termes >= 1, "aucun terme compté");
});

check("VERT — un fichier PROPRE n'est pas touché, et n'apparaît pas dans les corrections", () => {
  const f = poser("propre.md", "Rien a voir ici.\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(!r.corriges.some((c) => c.fichier === f), "un fichier propre est déclaré corrigé");
});

check("REFUS — un NOM de fichier porteur est relevé, avec la commande exacte de renommage", () => {
  const f = poser("CalculatriceZorglubZAP - RETOURS - 20260908a.md", "corps propre\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  const n = r.nomsPorteurs.find((x) => x.fichier === f);
  att(n, "un nom de fichier porteur n'est pas relevé — c'est le cas qui a fait amender un commit le 08/09");
  att(!/Zorglub/i.test(n.propose), "le nom proposé porte encore le nom réel : " + n.propose);
});

check("SECOND SENS du refus — un nom de fichier PROPRE n'est jamais relevé", () => {
  const f = poser("Produit-09 - RETOURS - 20260908b.md", "corps\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(!r.nomsPorteurs.some((x) => x.fichier === f), "un nom propre est pris pour porteur");
});

check("REFUS — tables illisibles : le geste LÈVE au lieu de laisser passer", () => {
  const memoire = process.env.FORGE_NOMS_INTERDITS;
  process.env.FORGE_NOMS_INTERDITS = join(T, "_absent.json");
  let leve = false;
  try { passer({ fichiers: [poser("x.md", "Zorglub\n")], ecrire: false, racine: DEPOT }); } catch { leve = true; }
  process.env.FORGE_NOMS_INTERDITS = memoire;
  att(leve, "un référentiel absent laisse passer : anonymiser à moitié donnerait l'impression que le dépôt est propre");
});

// TF-0993 — CE QUI A RÉSISTÉ SE DIT. Une occurrence collée à un identifiant de CODE reste en place
// à dessein (TF-0927) ; le geste doit la RENDRE, avec son fichier et sa ligne. Second sens : un
// fichier dont toutes les occurrences sont substituables n'annonce aucun reste.
check("ROUGE — une occurrence collée à un identifiant de code est RENDUE dans `refuses`, avec fichier et ligne", () => {
  const f = poser("calcul.js", "// en-tête\nconst calc_Zorglub_total = 1;\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(Array.isArray(r.refuses), "passer() ne rend pas `refuses` — ce qui a résisté reste muet");
  const x = r.refuses.find((y) => y.fichier === f);
  att(x, `l'occurrence laissée en place n'est pas rendue : ${JSON.stringify(r.refuses)}`);
  att(x.ligne === 2, `ligne ${x.ligne} rendue, 2 attendue`);
  att(/identifiant/.test(x.motif || ""), "le motif ne dit pas pourquoi l'occurrence est restée");
  att(!/Zorglub/.test(x.autour || ""), "le contexte rendu répète le nom réel au lieu de le masquer");
});

check("VERT — toutes les occurrences substituables : aucun reste annoncé", () => {
  const f = poser("prose.md", "Le client Zorglub a signé.\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(r.refuses.length === 0, `un reste est annoncé alors que tout a été substitué : ${JSON.stringify(r.refuses)}`);
});

// TF-1007 — L'EXEMPLE RENDU TAUTOLOGIQUE. Deux graphies d'un même nom de produit (clé à tirets,
// nom à espaces) dans une ligne : la pseudonymisation les rend par le MÊME pseudonyme. Le geste
// doit le signaler ; deux occurrences d'une MÊME graphie ne le doivent pas.
check("ROUGE — deux graphies différentes rendues par le même pseudonyme : tautologie signalée, ligne et nombre", () => {
  const f = poser("graphies.md", "intro\nla clé calculatrice-zorglub-zap, et le nom Calculatrice Zorglub ZAP dans le rapport\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  const t = (r.tautologies || []).find((x) => x.fichier === f);
  att(t, `aucune tautologie signalée : ${JSON.stringify(r.tautologies)}`);
  att(t.ligne === 2 && t.pseudo === "Produit-01" && t.graphies === 2, `signalement inexact : ${JSON.stringify(t)}`);
});

check("VERT — la même graphie deux fois dans une ligne : rien à signaler", () => {
  const f = poser("meme-graphie.md", "Le client Zorglub a signé, et Zorglub paiera.\n");
  const r = passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(!(r.tautologies || []).some((x) => x.fichier === f), `une répétition d'une même graphie est prise pour une tautologie : ${JSON.stringify(r.tautologies)}`);
});

check("le mode essai n'écrit rien — le fichier porteur est intact après la passe", () => {
  const f = poser("essai.md", "Lot de Zorglub.\n");
  passer({ fichiers: [f], ecrire: false, racine: DEPOT });
  att(readFileSync(join(DEPOT, f), "utf8").includes("Zorglub"), "le mode essai a réécrit le fichier");
});

// TF-1213 — FIXTURE DOUBLE SENS : la ré-empreinte d'un sidecar `*.tf.jsonl` RÉÉCRIT ici (passer()
// transmet désormais le contenu d'AVANT à `reempreinter-lot.mjs`, comme `anonymiser-suivis.mjs` le
// fait déjà). Un registre todo/TODO.jsonl jetable, SOUS LE DÉPÔT jetable lui-même (jamais le
// registre réel), porte une seule ingestion consignée.
mkdirSync(join(DEPOT, "todo"), { recursive: true });
const registreDepot = join(DEPOT, "todo", "TODO.jsonl");
const AVANT_INGERE = '{"ev":"creation","titre":"Lot de Zorglub"}\n';
const shaIngere = createHash("sha256").update(Buffer.from(AVANT_INGERE, "utf8")).digest("hex");

check("ROUGE sans le correctif / VERT avec : un sidecar DÉJÀ INGÉRÉ, réécrit par la passe, se RÉ-EMPREINT (reempreintes rendu, verdict CONSIGNE)", () => {
  writeFileSync(registreDepot, JSON.stringify({
    ev: "ingestion", ts: "2026-09-11T12:47:00.000Z",
    fichier: "Produit-09 - RETOURS - 20260911a.tf.jsonl", lot_sha: shaIngere,
  }) + "\n", "utf8");
  const f = poser("Produit-09 - RETOURS - 20260911a.tf.jsonl", AVANT_INGERE);
  const r = passer({ fichiers: [f], ecrire: true, racine: DEPOT });
  att(Array.isArray(r.reempreintes), "passer() ne rend pas `reempreintes` — le correctif TF-1213 n'est pas câblé");
  const rp = r.reempreintes.find((x) => x.fichier === f);
  att(rp, `aucune ré-empreinte rendue pour ${f} : ${JSON.stringify(r.reempreintes)}`);
  att(rp.verdict === "CONSIGNE", `verdict ${rp.verdict} attendu CONSIGNE — ${rp.message}`);
  const lignesRegistre = readFileSync(registreDepot, "utf8").trim().split("\n");
  att(lignesRegistre.length === 2, `le registre ne porte pas la ré-empreinte consignée : ${lignesRegistre.length} ligne(s)`);
  const evReempreinte = JSON.parse(lignesRegistre[1]);
  att(evReempreinte.reempreinte && evReempreinte.reempreinte.lot_sha_avant === shaIngere,
    "l'événement consigné ne porte pas l'empreinte d'avant attendue");
});

const nbLignes = (chemin) => readFileSync(chemin, "utf8").trim().split("\n").length;

check("SECOND SENS — un sidecar JAMAIS INGÉRÉ, réécrit par la passe, ne consigne RIEN (verdict REFUS, registre inchangé)", () => {
  const avant = nbLignes(registreDepot);
  const f = poser("Produit-77 - RETOURS - 20260911a.tf.jsonl", '{"ev":"creation","titre":"Lot de Zorglub"}\n');
  const r = passer({ fichiers: [f], ecrire: true, racine: DEPOT });
  const rp = r.reempreintes.find((x) => x.fichier === f);
  att(rp, `aucune ré-empreinte rendue pour ${f}`);
  att(rp.verdict !== "CONSIGNE", `verdict ${rp.verdict} — un sidecar jamais ingéré ne doit rien consigner`);
  att(nbLignes(registreDepot) === avant, "le registre a grossi alors qu'aucune ingestion ne couvrait ce sidecar");
});

rmSync(T, { recursive: true, force: true });
console.log(`\npre-commit-anonymise (TF-0980) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
