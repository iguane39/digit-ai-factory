#!/usr/bin/env node
/**
 * hook-ouverture.test.mjs — recette à double sens du geste `.env` local (TF-0869).
 *
 * Ce que la recette prouve. Le 06/09, un produit n'avait aucun `.env` local et rien ne prescrivait
 * d'en créer un : le commanditaire a saisi sa clé d'API dans le `.env.example`, VERSIONNÉ. Le hook
 * d'ouverture crée désormais ce `.env` — gitignoré — dès qu'un `.env.example` existe et qu'aucun
 * `.env` ne l'accompagne. La place où poser une valeur existe donc AVANT qu'on ait besoin d'en
 * poser une.
 *
 * Les deux sens :
 *   · SENS CRÉATION — `.env.example` seul → `.env` créé, valeurs « # à fournir : » VIDES ;
 *   · SENS GARDE — un `.env` déjà présent n'est JAMAIS touché : il porte des valeurs que
 *     personne d'autre ne connaît, et un écrasement les détruirait sans recours (aucun git ne
 *     les rattraperait, le fichier étant ignoré par construction).
 *
 * Le hook est joué avec `--sans-bootstrap` (aucun accès réseau) et `--sans-readme` sur un produit
 * temporaire ; rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const hook = join(ICI, "hook-ouverture.mjs");
const PILOT = join(ICI, "..");

const NL = String.fromCharCode(10);
const EXEMPLE = [
  "# ne jamais renseigner de secret ici",
  "PORT=8000",
  "CLE_TIERCE=deja-remplie-a-tort # à fournir :",
  "",
].join(NL);

const joue = (produit) => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--pilot", PILOT],
  { cwd: produit, encoding: "utf8", timeout: 120000 });

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// ---- SENS CRÉATION ---------------------------------------------------------------------------
const neuf = mkdtempSync(join(tmpdir(), "hook-env-neuf-"));
writeFileSync(join(neuf, ".env.example"), EXEMPLE);
const sortieNeuf = joue(neuf);

check("création : un .env.example sans .env fait naître le .env local", () => {
  if (!existsSync(join(neuf, ".env"))) throw new Error(".env non créé");
});

check("création : la variable « # à fournir : » naît VIDE, la valeur sûre est conservée", () => {
  const t = readFileSync(join(neuf, ".env"), "utf8");
  if (!/^PORT=8000$/m.test(t)) throw new Error("la valeur par défaut sûre PORT=8000 n'a pas été reprise");
  if (/deja-remplie-a-tort/.test(t)) throw new Error("la valeur posée à tort dans l'exemple a été recopiée dans le .env");
  if (!/^CLE_TIERCE=\s*#/m.test(t)) throw new Error("la variable « à fournir » n'est pas vidée, marqueur conservé");
});

check("création : le compte rendu DIT le geste et où poser un secret", () => {
  if (!/\.env — créé depuis \.env\.example/.test(sortieNeuf)) throw new Error("geste non annoncé dans le compte rendu du hook");
  if (!/TF-0869/.test(sortieNeuf)) throw new Error("le compte rendu ne cite pas l'item qui motive le geste");
});

// ---- SENS GARDE ------------------------------------------------------------------------------
const habite = mkdtempSync(join(tmpdir(), "hook-env-habite-"));
writeFileSync(join(habite, ".env.example"), EXEMPLE);
const DEJA = "PORT=9999" + NL + "CLE_TIERCE=valeur-que-seul-l-humain-connait" + NL;
writeFileSync(join(habite, ".env"), DEJA);
const sortieHabite = joue(habite);

check("garde : un .env déjà présent n'est JAMAIS écrasé", () => {
  if (readFileSync(join(habite, ".env"), "utf8") !== DEJA) throw new Error(".env existant modifié — les valeurs locales sont irrécupérables");
});

check("garde : rien n'est annoncé quand rien n'a été fait", () => {
  if (/\.env — créé depuis/.test(sortieHabite)) throw new Error("le hook annonce une création qui n'a pas eu lieu");
});

// ---- TF-1521 : LE REJEU D'UN DÉPLACEMENT EN ATTENTE, À L'OUVERTURE DU PILOT ------------------
//
// La règle 7 bis (TF-1503) tolère qu'une version antérieure reste en place tant que le ledger du
// produit porte un `deplacement_en_attente` non clos. Rien ne rappelait cette attente à l'ouverture
// du tour suivant : une consignation oubliée garde deux versions côte à côte sans limite de durée.
// Le hook d'ouverture, joué SANS `--pilot` (c'est-à-dire comme à l'ouverture du PILOT lui-même, pas
// d'un produit), doit désormais lister les attentes de tous les produits relevés sous `FORGE_ROOT`.
import { mkdirSync } from "node:fs";

const racineParcTest = mkdtempSync(join(tmpdir(), "hook-ouverture-parc-"));
const produitAttente = join(racineParcTest, "produit-attente");
mkdirSync(join(produitAttente, "forge"), { recursive: true });
writeFileSync(join(produitAttente, "forge", "ledger.jsonl"), [
  JSON.stringify({ type: "deplacement_en_attente", ancien: "output/Rapport - 20260930a.html",
    nouveau: "output/old/Rapport - 20260930a.html", motif: "application de lecture tenue ouverte",
    ts: "2026-09-30T10:00:00.000Z" }),
].join(NL) + NL, "utf8");
const produitClos = join(racineParcTest, "produit-clos");
mkdirSync(join(produitClos, "forge"), { recursive: true });
writeFileSync(join(produitClos, "forge", "ledger.jsonl"), [
  JSON.stringify({ type: "deplacement_en_attente", ancien: "output/Note - 20260920a.html", ts: "2026-09-20T10:00:00.000Z" }),
  JSON.stringify({ type: "deplacement_effectue", ancien: "output/Note - 20260920a.html", ts: "2026-09-21T09:00:00.000Z" }),
].join(NL) + NL, "utf8");

const lancerOuverturePilot = () => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme"],
  { cwd: PILOT, encoding: "utf8", timeout: 120000, env: { ...process.env, FORGE_ROOT: racineParcTest } });
const sortieOuverturePilot = lancerOuverturePilot();

check("TF-1521 — un déplacement EN ATTENTE est listé à l'ouverture, avec sa date et son motif", () => {
  if (!/Déplacements de version en attente/.test(sortieOuverturePilot))
    throw new Error("aucune section n'annonce les déplacements en attente : " + sortieOuverturePilot.slice(0, 400));
  if (!/produit-attente/.test(sortieOuverturePilot)) throw new Error("le produit porteur de l'attente n'est pas nommé");
  if (!/Rapport - 20260930a\.html/.test(sortieOuverturePilot)) throw new Error("le chemin de l'ancienne version n'est pas cité");
  if (!/application de lecture tenue ouverte/.test(sortieOuverturePilot)) throw new Error("le motif consigné n'est pas repris");
  if (!/git mv/.test(sortieOuverturePilot)) throw new Error("le rejeu proposé ne donne pas le geste (`git mv`)");
});

check("TF-1521 borne — un déplacement CLOS (`deplacement_effectue` postérieur) n'est plus listé", () => {
  if (/Note - 20260920a\.html/.test(sortieOuverturePilot))
    throw new Error("une attente CLOSE par un événement plus récent est encore listée — le ledger est en ajout seul, le DERNIER événement fait foi");
});

console.log(`${NL}Recette hook d'ouverture (.env local, TF-0869) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
