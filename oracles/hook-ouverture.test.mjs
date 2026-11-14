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
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir, hostname } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { creerFiltre, conclureFiltre } from "./lib-filtre-cas.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const hook = join(ICI, "hook-ouverture.mjs");
// TF-0957 (bancs isolés) : le hook joué ici touche la chaîne de pseudonymisation (journal du relevé
// d'héritage, consigne du générateur d'index nommée par TF-1652). Ses tables sont désignées sous un
// dossier temporaire et VOLONTAIREMENT ABSENTES : jamais celles du canal du poste, et, référentiel
// manquant, le hook ne journalise pas le relevé des produits jouets dans `todo/HERITAGE-RELEVES.jsonl`,
// qui est suivi (il le dit : « relevé NON journalisé »). Des tables vides l'y faisaient écrire.
const TABLES = mkdtempSync(join(tmpdir(), "hook-ouverture-tables-"));
process.env.FORGE_NOMS_INTERDITS = join(TABLES, "_noms-interdits.json");
process.env.FORGE_PRODUITS_PSEUDO = join(TABLES, "_produits-pseudonymes.json");
const PILOT = join(ICI, "..");
// TF-2511 (14/11/2026) — LES BORNES DE DURÉE SE LISENT CONTRE UNE MESURE TÉMOIN, PAS EN MILLISECONDES ABSOLUES. Le fait : le 13/11/2026, sous la charge du poste (une dizaine d'agents), la recette
// rougissait au hasard — le relevé d'un produit, borné à 20 s, mesuré à 23 s (3,8 s au repos, 3,69 s pour le relevé de 45 s) ; le relevé de la flotte, que le hook coupe à 60 s, tué alors qu'il
// rend en 2 s au repos ; vert joué seul et dans la recette entière. Le témoin est le démarrage nu de Node (`node -e ""`, 7 passages, la médiane), que la charge ralentit comme elle ralentit
// le hook : le facteur de charge vaut cette médiane sur `TEMOIN_REPOS_MS`, et chaque borne vaut sa valeur au repos fois ce facteur (jamais moins d'une fois). Au repos, les bornes restent
// celles d'avant (20 s, 45 s, 2 s) ; un relevé réellement ralenti, à poste calme, les dépasse toujours et reste rouge.
// `TEMOIN_REPOS_MS` : médiane de 20 passages, mesurée sur 9 séries le 14/11/2026 sur le poste de la recette, de 35 à 51 ms d'une série à l'autre.
const TEMOIN_REPOS_MS = 40;
/** La médiane, en ms, de `n` démarrages nus de Node, joués maintenant. */
const mesurerTemoinMs = (n = 5) => {
  const d = [];
  for (let i = 0; i < n; i++) { const t0 = process.hrtime.bigint(); spawnSync(process.execPath, ["-e", ""], { encoding: "utf8" }); d.push(Number(process.hrtime.bigint() - t0) / 1e6); }
  d.sort((a, b) => a - b);
  return d[Math.floor(n / 2)];
};
/** Le facteur de charge d'un témoin : jamais sous 1, de sorte qu'un poste calme garde la borne au repos. */
const facteurDeCharge = (temoinMs = mesurerTemoinMs()) => Math.max(1, temoinMs / TEMOIN_REPOS_MS);
/** La borne (ms) d'une durée dont la valeur au repos est `reposMs`, à l'échelle de la charge mesurée par le témoin. */
const borneSousCharge = (reposMs, facteur) => Math.round(reposMs * facteur);
// Les DÉLAIS des appels (`timeout`, 120 s au repos) se posent d'un facteur gardé 30 s : un délai n'est pas un verdict, et mesurer le témoin avant chaque appel coûterait le temps qu'il protège.
// Les BORNES jugées ci-dessous mesurent le témoin à neuf, avant et après l'opération. Sous la charge, un appel qui dépasse son délai au repos plantait la recette (ETIMEDOUT) au lieu d'un verdict.
let facteurGarde = { t: 0, f: 1 };
const delaiSousCharge = (reposMs) => { if (Date.now() - facteurGarde.t > 30000) facteurGarde = { t: Date.now(), f: facteurDeCharge() }; return Math.round(reposMs * facteurGarde.f); };
// D-135 (a) : l'ouverture du pilot lance, une fois par semaine, le rejeu de tous les consommateurs des skills (jusqu'à 50 minutes). Ce banc ne
// doit JAMAIS déclencher le vrai : le lancement est coupé pour tous les passages ci-dessous, et seul le banc du rejeu (fin de fichier) le rétablit,
// sur une table factice et une trace jetable.
process.env.FORGE_SANS_REJEU_HEBDOMADAIRE = "1";
// TF-2442 : l'ouverture du pilot lance aussi, en arrière-plan, le relevé des workflows hébergés des produits (`gh run list`, réseau). Ce banc ne doit JAMAIS
// le déclencher en vrai : le lancement est coupé pour tous les passages ci-dessous, la trace désignée est jetable, et seul le banc dédié (fin de fichier) le
// rétablit, sur un faux `gh` et des dépôts jetables.
process.env.FORGE_SANS_RELEVE_WORKFLOWS = "1";
process.env.FORGE_TRACE_WORKFLOWS = join(TABLES, "workflows-heberges.json");
// TF-2067 : une recette n'écrit pas le registre du dépôt qui la joue. L'ouverture du pilot écrit, dans des fichiers SUIVIS, le passage
// hebdomadaire des récidives (todo/observabilite/snapshots-recidives.jsonl et RECIDIVES.json, dès que le dernier relevé a 7 jours) et le journal
// d'héritage (todo/HERITAGE-RELEVES.jsonl). Les deux sont coupés ici, une fois pour tout le fichier, et non appel par appel : le passage
// des consommateurs (TF-2048) n'avait pas le drapeau et réécrivait ces fichiers à chaque recette jouée après 7 jours sans relevé.
// L'observation est SAUTÉE plutôt que déroutée : son plan écrit par des chemins relatifs à la racine du pilot. Le journal d'héritage, lui,
// est dérouté vers un fichier jetable, que le banc « TF-2067 » ci-dessous lit pour prouver que l'écriture a bien lieu — ailleurs.
process.env.FORGE_SANS_OBSERVATION = "1";
const HERITAGE_JETABLE = join(TABLES, "HERITAGE-RELEVES.jsonl");
process.env.FORGE_HERITAGE_RELEVES = HERITAGE_JETABLE;

const NL = String.fromCharCode(10);
const EXEMPLE = [
  "# ne jamais renseigner de secret ici",
  "PORT=8000",
  "CLE_TIERCE=deja-remplie-a-tort # à fournir :",
  "",
].join(NL);

const joue = (produit) => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--pilot", PILOT],
  { cwd: produit, encoding: "utf8", timeout: delaiSousCharge(120000) });

let pass = 0, fail = 0;
// TF-2256 (06/11/2026) : `FORGE_CAS_OUVERTURE=2214` (ou `1521,1214`, `1635-1642`) ne joue que les sections de ces numéros — le numéro du TF de
// l'en-tête de la section, ou du D-N de la décision (D-23, D-135) ; voir `lib-filtre-cas.mjs`. Chaque section commence par `veut(<numéros>)` :
// il pose la section courante, et `check` n'exécute que les contrôles d'une section voulue. Une section en bloc `{ }` est gardée par
// `if (veut(…))`, qui épargne aussi son installation ; un relevé coûteux commun à plusieurs sections se garde par `voudrait(…)`.
const filtre = creerFiltre("FORGE_CAS_OUVERTURE");
let sectionVoulue = true;
const veut = (...ids) => (sectionVoulue = filtre.veut(...ids));
const voudrait = (...ids) => filtre.voudrait(...ids);
const check = (nom, fn) => { if (!sectionVoulue) return; try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

veut(869);
// ---- SENS CRÉATION ---------------------------------------------------------------------------
const neuf = mkdtempSync(join(tmpdir(), "hook-env-neuf-"));
writeFileSync(join(neuf, ".env.example"), EXEMPLE);
const sortieNeuf = sectionVoulue ? joue(neuf) : "";

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

veut(869);
// ---- SENS GARDE ------------------------------------------------------------------------------
const habite = mkdtempSync(join(tmpdir(), "hook-env-habite-"));
writeFileSync(join(habite, ".env.example"), EXEMPLE);
const DEJA = "PORT=9999" + NL + "CLE_TIERCE=valeur-que-seul-l-humain-connait" + NL;
writeFileSync(join(habite, ".env"), DEJA);
const sortieHabite = sectionVoulue ? joue(habite) : "";

check("garde : un .env déjà présent n'est JAMAIS écrasé", () => {
  if (readFileSync(join(habite, ".env"), "utf8") !== DEJA) throw new Error(".env existant modifié — les valeurs locales sont irrécupérables");
});

check("garde : rien n'est annoncé quand rien n'a été fait", () => {
  if (/\.env — créé depuis/.test(sortieHabite)) throw new Error("le hook annonce une création qui n'a pas eu lieu");
});

veut(1521, 1214);
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

const lancerOuverturePilot = () => { const f = facteurDeCharge();   // TF-2511 : délais de l'appel et du relevé de la flotte à l'échelle de la charge
  return execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme"],
    { cwd: PILOT, encoding: "utf8", timeout: Math.round(120000 * f), env: { ...process.env, FORGE_SANS_OBSERVATION: "1", FORGE_ROOT: racineParcTest, FORGE_DELAI_RELEVE_FLOTTE_S: String(Math.round(60 * f)) } }); };
const sortieOuverturePilot = voudrait(1521, 1214, 1301, 2151, 1635) ? lancerOuverturePilot() : "";   // relevé lu par ces cinq sections

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

check("TF-1214 — la boîte d'entrée dit le POSTE qui juge : un dépôt d'un autre poste n'y est pas visible", () => {
  if (!sortieOuverturePilot.includes(`jugée sur le poste **${hostname()}**`))
    throw new Error("la section « Boîte d'entrée des retours » ne nomme pas le poste : " + (sortieOuverturePilot.split("Boîte d'entrée des retours")[1] || "(section absente)").slice(0, 300));
  if (!/AUTRE poste n'y est pas visible/.test(sortieOuverturePilot)) throw new Error("la limite (autre poste) n'est pas dite");
});
// D-23 (a) du 18/10/2026 — l'ouverture du pilot affiche, dans « Flotte d'agents », les relectures d'intention de l'essai et dit
// si le seuil d'arrêt (plus de 6 000 000 de jetons de relecture par jour, D-165 (c) du 04/11/2026 ; 4 000 000 par D-25 du 18/10/2026) est franchi. Transcriptions SYNTHÉTIQUES d'un profil
// jetable : ni le vrai poste (USERPROFILE/HOME vidés), ni le vrai relevé.
if (veut(23)) {
  const maisonVide = mkdtempSync(join(tmpdir(), "hook-ouverture-maison-"));
  const profilRelecture = (nom, n) => {
    const profil = mkdtempSync(join(tmpdir(), `hook-ouverture-${nom}-`));
    const d = join(profil, "projects", "projet-essai");
    mkdirSync(join(d, "s1", "subagents"), { recursive: true });
    const maintenant = new Date().toISOString();
    writeFileSync(join(d, "s1.jsonl"), JSON.stringify({ type: "assistant", timestamp: maintenant, message: { id: "a0", model: "claude-opus-5-5", usage: { output_tokens: 1 }, content: [{ type: "text", text: "x" }] } }) + NL);
    for (let i = 0; i < n; i++) {
      const rep = (id) => JSON.stringify({ type: "assistant", timestamp: maintenant, effort: "medium", message: { id, model: "claude-sonnet-5-5", usage: { input_tokens: 5, output_tokens: 10, cache_read_input_tokens: 700000, cache_creation_input_tokens: 100 }, content: [{ type: "text", text: "x" }] } });
      writeFileSync(join(d, "s1", "subagents", `agent-${i}.jsonl`), [rep(`r1-${i}`), rep(`r2-${i}`)].join(NL) + NL);
      writeFileSync(join(d, "s1", "subagents", `agent-${i}.meta.json`), JSON.stringify({ agentType: "verificateur", description: "Relecture d'intention fin-de-tour" }));
    }
    return profil;
  };
  // TF-2511 : le délai de l'appel et celui du relevé de la flotte (60 s dans le hook) valent leur valeur au repos fois le facteur de charge mesuré par le témoin ;
  // `delaiFlotteS` pose le délai du relevé (en secondes) pour le cas rouge, où il est volontairement trop court.
  const ouvrirAvec = (profil, delaiFlotteS = null) => {
    const f = facteurDeCharge();
    return execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme"],
      { cwd: PILOT, encoding: "utf8", timeout: Math.round(120000 * f), env: { ...process.env, FORGE_SANS_OBSERVATION: "1", FORGE_ROOT: racineParcTest, CLAUDE_CONFIG_DIR: profil, USERPROFILE: maisonVide, HOME: maisonVide,
        FORGE_DELAI_RELEVE_FLOTTE_S: String(delaiFlotteS ?? Math.round(60 * f)) } });
  };
  const sortieTenu = ouvrirAvec(profilRelecture("tenu", 2)), sortieFranchi = ouvrirAvec(profilRelecture("franchi", 5));
  check("D-23 vert — l'ouverture du pilot affiche les relectures d'intention (2 relectures, 2 800 460 jetons) et un seuil TENU", () => {
    // D-64 (a) du 21/10/2026 : l'alarme de l'essai vit dans la section « Œil critique », qui remplace « Flotte d'agents ».
    if (!/## Œil critique/.test(sortieTenu)) throw new Error("section « Œil critique » absente");
    if (/## Flotte d'agents|## Surveillance des récidives/.test(sortieTenu)) throw new Error("une section remplacée par « Œil critique » est encore affichée");
    if (!/poste [^\n]+ : (aucune exécution|dernière analyse jusqu'au)/.test(sortieTenu)) throw new Error("le repère du poste n'est pas dit");
    if (!/relectures d'intention \(essai du 2026-10-18 au 2026-11-01, prolongé en service par D-73 \(b\), revue le 2026-11-08.*2 relecture\(s\), 2 800 460 jetons.*seuil de 6 000 000 jetons par jour tenu/.test(sortieTenu))
      throw new Error((sortieTenu.match(/relectures d'intention[^\n]*/) || ["ligne absente"])[0]);
    if (/FRANCHI/.test(sortieTenu)) throw new Error("seuil dit franchi à 2 800 460 jetons");
  });
  check("D-23 rouge — plus de 6 000 000 de jetons de relecture en un jour (5 relectures, 7 001 150) : l'ouverture dit FRANCHI et demande l'arrêt", () => {
    if (!/5 relecture\(s\), 7 001 150 jetons.*\*\*FRANCHI : arrêter l'essai et demander à l'humain\*\*/.test(sortieFranchi))
      throw new Error((sortieFranchi.match(/relectures d'intention[^\n]*/) || ["ligne absente"])[0]);
  });
  // TF-2511 rouge → vert — un relevé de la flotte qui dépasse son délai reste ROUGE : le délai posé à 1 ms, plus court que n'importe quel relevé, tue le relevé ; le hook le dit ILLISIBLE
  // et la ligne des relectures est absente (le hook ne bloque jamais). Au délai de la recette (cas D-23 ci-dessus), le relevé rend. Le délai est ce qui sépare un relevé lent d'un relevé tué.
  check("TF-2511 rouge — le relevé de la flotte coupé à son délai (1 ms) est dit ILLISIBLE et la ligne des relectures disparaît ; vert — au délai de la recette, elle est là", () => {
    const coupe = ouvrirAvec(profilRelecture("coupe", 2), 0.001);
    if (!/relevé de la flotte ILLISIBLE/.test(coupe) || /relectures d'intention \(essai/.test(coupe)) throw new Error((coupe.match(/relevé de la flotte[^\n]*|relectures d'intention[^\n]*/) || ["ni alarme ni ligne"])[0]);
    if (!/relectures d'intention \(essai/.test(sortieTenu) || /relevé de la flotte ILLISIBLE/.test(sortieTenu)) throw new Error("au délai de la recette, le relevé de la flotte n'a pas rendu");
  });
}
veut(1301);
// TF-1301 — l'ouverture du pilot publie le stock d'items ouverts sans classe (une mesure, jamais un blocage).
check("TF-1301 — l'ouverture du pilot publie le stock d'items ouverts sans classe, par statut", () => {
  if (!/## Items ouverts sans classe \(TF-1301/.test(sortieOuverturePilot)) throw new Error("section absente de l'ouverture du pilot");
  if (!/item\(s\) ouvert\(s\) sans classe|aucun item ouvert sans classe/.test(sortieOuverturePilot)) throw new Error("ni compte ni constat d'absence de stock");
});
// TF-1576 — l'annonce des README dit l'état MESURÉ des crochets du projet ouvert.
if (veut(1576)) {
  const sansCrochet = mkdtempSync(join(tmpdir(), "hook-readme-sans-"));
  mkdirSync(join(sansCrochet, ".claude"), { recursive: true });
  writeFileSync(join(sansCrochet, ".claude", "settings.json"), JSON.stringify({ hooks: { SessionStart: [{ hooks: [] }], Stop: [{ hooks: [] }] } }), "utf8");
  const avecCrochet = mkdtempSync(join(tmpdir(), "hook-readme-avec-"));
  mkdirSync(join(avecCrochet, ".claude"), { recursive: true });
  // TF-1667 (14/10/2026) : le crochet se reconnaît à sa COMMANDE. Le témoin vert déclare la régénération
  // des README ; le témoin « autres crochets » porte ceux d'un produit réel (page-html, écriture), qui ne
  // régénèrent rien — l'annonce les prenait pour le crochet des README.
  writeFileSync(join(avecCrochet, ".claude", "settings.json"), JSON.stringify({ hooks: { PostToolUse: [{ matcher: "Write", hooks: [{ type: "command", command: "node scripts/readme-dossiers.mjs --silencieux" }] }] } }), "utf8");
  const autresCrochets = mkdtempSync(join(tmpdir(), "hook-readme-autres-"));
  mkdirSync(join(autresCrochets, ".claude"), { recursive: true });
  writeFileSync(join(autresCrochets, ".claude", "settings.json"), JSON.stringify({ hooks: { PostToolUse: [{ matcher: "Write|Edit|MultiEdit", hooks: [{ type: "command", command: "node forge/hooks/factory.mjs page-html" }, { type: "command", command: "node forge/hooks/factory.mjs ecriture" }] }] } }), "utf8");
  const sortieSans = joue(sansCrochet), sortieAvec = joue(avecCrochet), sortieAutres = joue(autresCrochets);
  check("TF-1667 rouge → vert — un produit dont les PostToolUse ne régénèrent pas les README : l'annonce dit qu'ils ne se régénèrent PAS", () => {
    if (!/ATTENTION, état MESURÉ.*ne déclare aucun crochet PostToolUse qui régénère les README/.test(sortieAutres)) throw new Error("l'annonce prend les crochets page-html et écriture pour celui des README");
  });
  check("TF-1652, TF-1667 — chez un produit, la consigne nomme le script du pilot, --base . et --racines borné", () => {
    // TF-1887 : le chemin du pilot s'écrit avec des barres obliques (Git Bash avale la barre inverse).
    const attendu = `node "${join(PILOT, "scripts", "readme-dossiers.mjs").replace(/\\/g, "/")}" --base . --racines`;
    if (!sortieAutres.includes(attendu)) throw new Error("la commande prescrite au produit n'est pas celle du pilot bornée au dossier écrit");
    if (/`node scripts\\\\readme-dossiers\.mjs`/.test(sortieAutres)) throw new Error("la consigne prescrit encore un chemin qui n'existe pas chez un produit");
  });
  // TF-1887 (19/10/2026) — LES COMMANDES PRESCRITES S'ÉCRIVENT AVEC DES BARRES OBLIQUES. Sous Git Bash, la barre
  // inverse non protégée est avalée : `--racines output\03-Syntheses` devenait `output03-Syntheses` (exit 2).
  // Node accepte la barre oblique sous Windows comme sous Bash. Le cas ROUGE est la commande du relevé
  // d'ouverture rejouée dans un shell POSIX réel (sh), qui doit atteindre le dossier ; le VERT est qu'aucune
  // commande prescrite (`node …`) ne porte plus de barre inverse, la prose des documents restant intacte.
  check("TF-1887 — la commande readme-dossiers prescrite au produit ne porte AUCUNE barre inverse, placeholder de dossier compris", () => {
    const m = /`(node "[^"`]*readme-dossiers\.mjs" --base \. --racines <[^>`]*>)`/.exec(sortieAutres);
    if (!m) throw new Error("commande readme-dossiers prescrite au produit introuvable");
    if (m[1].includes("\\")) throw new Error(`barre inverse dans la commande prescrite : ${m[1]}`);
  });
  check("TF-1887 — aucune commande `node …` du relevé d'ouverture du pilot ne porte une barre inverse", () => {
    const fautives = [...sortieOuverturePilot.matchAll(/`(node [^`]*\\[^`]*)`/g)].map((x) => x[1]);
    if (fautives.length) throw new Error(`commande(s) prescrite(s) à barre inverse : ${fautives.slice(0, 3).join(" | ")}`);
  });
  check("TF-1301 borne — l'ouverture d'un PRODUIT ne publie pas le stock du registre du pilot", () => {
    if (/Items ouverts sans classe/.test(sortieSans)) throw new Error("le stock du pilot est publié chez un produit");
  });
  check("TF-1576 rouge — un produit sans PostToolUse : l'annonce dit que les README ne se régénèrent PAS", () => {
    if (!/ATTENTION, état MESURÉ.*ne déclare aucun crochet PostToolUse/.test(sortieSans)) throw new Error("l'annonce n'a pas mesuré l'absence du crochet");
    if (/se régénèrent après chaque écriture par un outil/.test(sortieSans)) throw new Error("l'annonce affirme encore un crochet absent");
  });
  check("TF-1576 vert — un projet qui déclare PostToolUse garde l'annonce, avec sa borne (écriture par commande)", () => {
    if (!/se régénèrent après chaque écriture par un outil/.test(sortieAvec)) throw new Error("l'annonce a disparu chez un projet qui a le crochet");
    if (/ATTENTION, état MESURÉ/.test(sortieAvec)) throw new Error("faux avertissement chez un projet doté du crochet");
  });
}

veut(1635);
// ---- 13/10/2026 : LA SORTIE JSON DU MODE ASYNCHRONE ------------------------------------------
//
// Le hook est déclaré `async` (l'extension VS Code coupe à 60 s une initialisation que ses gestes
// réseau dépassaient). Mesuré sur le CLI 2.1.296 : en `async`, le texte brut n'atteint JAMAIS le
// contexte de l'assistant, la forme `hookSpecificOutput.additionalContext` l'atteint. Le contrat :
// sous `--contexte-json`, la sortie est UN objet JSON valide, l'événement est SessionStart, et le
// contexte porte TOUT le relevé texte — rien de perdu au passage — précédé de l'en-tête qui dit
// l'asynchronie. Sens rouge : une ligne du relevé absente du contexte, ou une sortie non JSON.
const sortieJson = !voudrait(1635, 1636) ? "" : execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--contexte-json"],
  { cwd: PILOT, encoding: "utf8", timeout: delaiSousCharge(120000), env: { ...process.env, FORGE_SANS_OBSERVATION: "1", FORGE_ROOT: racineParcTest } });

check("--contexte-json : la sortie est UN objet JSON SessionStart, sans texte autour", () => {
  let j;
  try { j = JSON.parse(sortieJson); } catch { throw new Error("sortie non JSON : " + sortieJson.slice(0, 200)); }
  const h = j && j.hookSpecificOutput;
  if (!h || h.hookEventName !== "SessionStart") throw new Error("hookSpecificOutput.hookEventName ≠ SessionStart");
  if (typeof h.additionalContext !== "string" || !h.additionalContext) throw new Error("additionalContext absent ou vide");
});

veut(2151);
// Deux lancements successifs diffèrent par construction sur des valeurs VIVANTES seulement : l'horodatage du relevé précédent (le
// premier lancement l'a écrit), une durée en millisecondes et, depuis TF-2151, les COMPTES que les lignes MS2 et le verdict d'
// `oracle-modeles-en-service` lisent dans les transcripts du poste (« 229 réponse(s) lues », « sur 400 fichier(s) ») : d'autres
// sessions les font grandir entre les deux lancements. Elles sont neutralisées, et rien d'autre : toute autre différence reste une perte.
const neutreAvant = (t) => t.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g, "<horodatage>").replace(/\ben \d+ ms\b/g, "en <durée> ms");
const neutre = (t) => neutreAvant(t).replace(/\b\d+( réponse\(s\))/g, "<n>$1").replace(/\b(lue\(s\) sur )\d+( fichier\(s\))/g, "$1<n>$2");

check("TF-2151 rouge → vert — des comptes de transcripts qui ont grandi entre deux lancements ne comptent plus pour une perte du relevé", () => {
  const grandi = sortieOuverturePilot.replace(/\b(\d+)( réponse\(s\))/g, (_, n, s) => `${Number(n) + 7}${s}`).replace(/(lue\(s\) sur )(\d+)( fichier\(s\))/g, (_, a, n, s) => `${a}${Number(n) + 3}${s}`);
  if (grandi === sortieOuverturePilot) throw new Error("le relevé ne porte aucun compte de transcripts : le cas ne prouve rien (ligne MS2 absente ?)");
  const perdues = (a, b, f) => f(a).split(NL).map((l) => l.trimEnd()).filter(Boolean).filter((l) => !f(b).includes(l));
  if (!perdues(sortieOuverturePilot, grandi, neutreAvant).length) throw new Error("rouge perdu : l'ancienne neutralisation accepte déjà des comptes qui ont grandi");
  const apres = perdues(sortieOuverturePilot, grandi, neutre);
  if (apres.length) throw new Error(`${apres.length} ligne(s) encore perdue(s) après neutralisation, dont : ${apres[0].slice(0, 160)}`);
  // La borne : une AUTRE différence (une version servie qui change de nom) reste une perte.
  const autre = sortieOuverturePilot.replace(/claude-[a-z]+-\d+-\d+/, "claude-autre-9-9");
  if (autre !== sortieOuverturePilot && !perdues(sortieOuverturePilot, autre, neutre).length) throw new Error("une version servie qui change de nom n'est plus vue comme une perte");
});

veut(1635);
check("--contexte-json : le contexte porte TOUT le relevé texte, et l'en-tête d'asynchronie", () => {
  const ctx = neutre(JSON.parse(sortieJson).hookSpecificOutput.additionalContext);
  const manquantes = neutre(sortieOuverturePilot).split(NL).map((l) => l.trimEnd()).filter(Boolean).filter((l) => !ctx.includes(l));
  if (manquantes.length) throw new Error(`${manquantes.length} ligne(s) du relevé absente(s) du contexte, dont : ${manquantes[0].slice(0, 120)}`);
  if (!/hook SessionStart asynchrone/.test(ctx)) throw new Error("l'en-tête qui dit l'asynchronie manque");
});

veut(1635);
// TF-1635 (13/10/2026) — UN PRODUIT DONT LE HOOK D'OUVERTURE EST SYNCHRONE SE RÉPARE À L'OUVERTURE.
// Mesuré le 13/10 : 19 produits sur 19 portaient le hook synchrone à 240 s, que l'extension VS Code
// coupe à 60 s. Le hook, lancé sous cette forme, passe l'entrée en `async` + `--contexte-json`, garde
// le reste du fichier (permissions, autres hooks, CRLF, indentation) et rend la main aussitôt avec
// les règles de session. Sens rouge : sans la réparation, le réglage reste synchrone et le hook
// joue son relevé complet.
const { passerOuvertureEnAsync } = await import(new URL("./lib-ouverture-async.mjs", import.meta.url));
const SETTINGS_SYNC = JSON.stringify({
  permissions: { allow: ["Bash(npm test)"] },
  hooks: {
    SessionStart: [{ hooks: [{ type: "command", command: "node forge/hooks/factory.mjs ouverture --sans-readme", timeout: 240 }] }],
    Stop: [{ hooks: [{ type: "command", command: "node forge/hooks/factory.mjs restitution", timeout: 60 }] }],
  },
}, null, 4).replace(/\n/g, "\r\n") + "\r\n";

check("TF-1635 — le hook lancé en synchrone chez un produit passe son réglage en async et rend la main avec les gates", () => {
  const P = mkdtempSync(join(tmpdir(), "ouverture-async-"));
  mkdirSync(join(P, ".claude"), { recursive: true });
  const f = join(P, ".claude", "settings.json");
  writeFileSync(f, SETTINGS_SYNC, "utf8");
  const chargeAvant1 = facteurDeCharge();
  const t0 = Date.now();
  const sortie = joue(P);
  const duree = Date.now() - t0;
  const apres = readFileSync(f, "utf8");
  const j = JSON.parse(apres);
  const h = j.hooks.SessionStart[0].hooks[0];
  if (h.async !== true) throw new Error("le hook d'ouverture n'est pas passé en async");
  if (!/--contexte-json/.test(h.command)) throw new Error("--contexte-json manque à la commande");
  if (j.permissions.allow[0] !== "Bash(npm test)" || j.hooks.Stop[0].hooks[0].timeout !== 60) throw new Error("le reste du réglage a été touché");
  if (!apres.includes("\r\n    \"hooks\"")) throw new Error("fins de ligne ou indentation du produit perdues");
  if (!/## Gates actifs dans cette session \(R-44\)/.test(sortie)) throw new Error("les gates de session manquent à la sortie");
  if (/## Fraîcheur|## Héritage/.test(sortie)) throw new Error("le relevé complet a été joué au lieu de rendre la main");
  const borne1 = borneSousCharge(20000, Math.max(chargeAvant1, facteurDeCharge()));   // TF-2511
  if (duree > borne1) throw new Error(`rendu en ${duree} ms, au-delà de ${borne1} ms (20 s au repos, à l'échelle de la charge mesurée par le témoin)`);
  if (passerOuvertureEnAsync(f).etat !== "deja") throw new Error("une seconde passe n'est pas idempotente");
});

check("TF-1635 — sens rouge et bords : réglage sans hook de la factory, illisible ou absent, jamais réécrit", () => {
  const P = mkdtempSync(join(tmpdir(), "ouverture-async-bords-"));
  const f = join(P, "settings.json");
  if (passerOuvertureEnAsync(f).etat !== "absent") throw new Error("fichier absent non reconnu");
  writeFileSync(f, "{ pas du json", "utf8");
  if (passerOuvertureEnAsync(f).etat !== "illisible" || readFileSync(f, "utf8") !== "{ pas du json") throw new Error("fichier illisible réécrit");
  const autre = JSON.stringify({ hooks: { SessionStart: [{ hooks: [{ command: "node mon-hook.mjs", timeout: 30 }] }] } });
  writeFileSync(f, autre, "utf8");
  if (passerOuvertureEnAsync(f).etat !== "sans_hook" || readFileSync(f, "utf8") !== autre) throw new Error("un hook étranger à la factory a été touché");
  writeFileSync(f, SETTINGS_SYNC, "utf8");
  const avant = JSON.parse(readFileSync(f, "utf8")).hooks.SessionStart[0].hooks[0];
  if (avant.async === true) throw new Error("témoin rouge mal construit : déjà async");
});

veut(1755);
// ---- TF-1755 (15/10/2026) : TOUTE ENTRÉE DU GABARIT QUI MANQUE AU PRODUIT S'Y AJOUTE À L'OUVERTURE --
// Mesuré le 15/10 sur 21 produits : publication-hebergee câblé chez 2, droits-accordes chez 2. Vert : un
// produit qui porte le lanceur reçoit chaque entrée absente du gabarit, sans perdre ses hooks, ses
// permissions ni ses délais, sans doublon, et une exclusion déclarée est respectée. Rouge : un produit
// sans lanceur n'est pas touché ; une seconde passe n'ajoute rien.
const { fusionnerHooksDuGabarit } = await import(new URL("./lib-ouverture-async.mjs", import.meta.url));
const GABARIT_SETTINGS = join(PILOT, "gabarits", "settings-produit.json");
const nomsDe = (j) => Object.values(j.hooks || {}).flat().flatMap((g) => g.hooks || [])
  .map((h) => (String(h.command).match(/forge\/hooks\/factory\.mjs"?\s+([\w-]+)/) || [])[1]).filter(Boolean); // TF-1903 : chemin ancré entre guillemets
const nomsGabarit = nomsDe(JSON.parse(readFileSync(GABARIT_SETTINGS, "utf8")));
const SETTINGS_ANCIEN = JSON.stringify({
  permissions: { allow: ["Bash(npm test)"] },
  _hooks_factory_exclus: [{ commande: "forge/hooks/factory.mjs droits-accordes", motif: "aucun script d'infrastructure dans ce produit" }],
  hooks: {
    SessionStart: [{ matcher: "startup|resume", hooks: [{ type: "command", command: "node forge/hooks/factory.mjs ouverture --sans-readme --contexte-json", timeout: 240, async: true }] }],
    Stop: [{ hooks: [{ type: "command", command: "node forge/hooks/factory.mjs restitution", timeout: 90 }] }],
    PostToolUse: [{ matcher: "Write|Edit|MultiEdit", hooks: [{ type: "command", command: "node scripts/mon-hook.mjs", timeout: 5 }, { type: "command", command: "node forge/hooks/factory.mjs page-html", timeout: 90 }] }],
  },
}, null, 2).replace(/\n/g, "\r\n") + "\r\n";

check("TF-1755 — fusion : chaque entrée absente du gabarit ajoutée, rien de retiré ni modifié, exclusion respectée, idempotente", () => {
  const P = mkdtempSync(join(tmpdir(), "ouverture-fusion-"));
  const f = join(P, "settings.json");
  writeFileSync(f, SETTINGS_ANCIEN, "utf8");
  const r = fusionnerHooksDuGabarit(f, GABARIT_SETTINGS);
  const apres = readFileSync(f, "utf8");
  const j = JSON.parse(apres);
  const noms = nomsDe(j);
  const attendus = nomsGabarit.filter((n) => n !== "droits-accordes");
  const manquent = attendus.filter((n) => !noms.includes(n));
  if (r.etat !== "corrige" || manquent.length) throw new Error(`état ${r.etat}, manquent : ${manquent.join(", ")}`);
  if (noms.includes("droits-accordes")) throw new Error("l'exclusion déclarée n'est pas respectée");
  // TF-1736 (15/10/2026) : un même hook peut servir deux événements (`reprise` à l'ouverture et en fin de
  // tour) ; le doublon se juge par ÉVÉNEMENT, l'unité où la fusion décide de la présence d'une entrée.
  const parEvenement = Object.entries(j.hooks).flatMap(([ev, gs]) => (gs || []).flatMap((g) => (g.hooks || [])
    .map((h) => (String(h.command || "").match(/factory\.mjs"?\s+([a-z-]+)/) || [])[1]).filter(Boolean).map((n) => `${ev}:${n}`)));
  if (parEvenement.length !== new Set(parEvenement).size) throw new Error(`doublon : ${parEvenement.join(", ")}`);
  if (j.permissions.allow[0] !== "Bash(npm test)" || j.hooks.Stop[0].hooks[0].timeout !== 90) throw new Error("un réglage du produit a été modifié");
  if (!j.hooks.PostToolUse[0].hooks.some((h) => h.command === "node scripts/mon-hook.mjs")) throw new Error("le hook propre au produit a disparu");
  if (!j.hooks.PostToolUse[0].hooks.some((h) => /factory\.mjs"? ecriture/.test(h.command))) throw new Error("l'entrée ajoutée ne rejoint pas le groupe de même matcher"); // TF-1903 : ajoutée sous la forme ancrée du gabarit
  if (!apres.includes("\r\n  \"hooks\"")) throw new Error("fins de ligne ou indentation du produit perdues");
  if (fusionnerHooksDuGabarit(f, GABARIT_SETTINGS).etat !== "deja") throw new Error("une seconde passe n'est pas idempotente");
});

veut(2185);
// ---- TF-2185 (05/11/2026) : UNE ENTRÉE PRÉSENTE DONT LE GABARIT A ÉLARGI LE MATCHER S'ÉLARGIT -----------
// Mesuré le 05/11 : `lecons` restait sur `Bash|PowerShell|Write|Edit|MultiEdit` chez le produit du poste qui
// le portait, après que le gabarit l'a passé à `…|Agent|Task` (TF-1947). Vert : seule, l'entrée prend le
// matcher du gabarit ; dans un groupe mêlé, elle seule en sort et le hook du produit garde son matcher.
// Rouge : un matcher que le produit a rendu différent n'est pas touché ; une seconde passe n'ajoute rien.
check("TF-2185 — fusion : matcher élargi par le gabarit porté à l'entrée présente, jamais rétréci ni dupliqué", () => {
  const mG = JSON.parse(readFileSync(GABARIT_SETTINGS, "utf8")).hooks.PreToolUse
    .find((g) => g.hooks.some((h) => /factory\.mjs"?\s+lecons\b/.test(h.command))).matcher;
  const ANCIEN = "Bash|PowerShell|Write|Edit|MultiEdit";
  if (!mG.split("|").includes("Agent") || mG === ANCIEN) throw new Error(`témoin mal construit : matcher du gabarit ${mG}`);
  const lecons = { type: "command", command: 'node "${CLAUDE_PROJECT_DIR}/forge/hooks/factory.mjs" lecons', timeout: 10 };
  const mien = { type: "command", command: "node scripts/mon-hook.mjs", timeout: 5 };
  const joueCas = (groupes) => {
    const f = join(mkdtempSync(join(tmpdir(), "ouverture-elargir-")), "settings.json");
    writeFileSync(f, JSON.stringify({ hooks: { PreToolUse: groupes } }, null, 2), "utf8");
    const r = fusionnerHooksDuGabarit(f, GABARIT_SETTINGS);
    const gs = JSON.parse(readFileSync(f, "utf8")).hooks.PreToolUse;
    const porteurs = gs.filter((g) => g.hooks.some((h) => /factory\.mjs"?\s+lecons\b/.test(h.command)));
    if (porteurs.length !== 1 || porteurs[0].hooks.filter((h) => /lecons/.test(h.command)).length !== 1) throw new Error("lecons absent ou en double");
    if (fusionnerHooksDuGabarit(f, GABARIT_SETTINGS).etat !== "deja") throw new Error("une seconde passe n'est pas idempotente");
    return { r, gs, porteur: porteurs[0] };
  };
  const seul = joueCas([{ matcher: ANCIEN, hooks: [{ ...lecons }] }]);
  if (seul.porteur.matcher !== mG || !(seul.r.elargis || []).includes("lecons")) throw new Error(`entrée seule : matcher ${seul.porteur.matcher}, élargies ${JSON.stringify(seul.r.elargis)}`);
  const mele = joueCas([{ matcher: ANCIEN, hooks: [{ ...mien }, { ...lecons }] }]);
  const groupeMien = mele.gs.find((g) => g.hooks.some((h) => h.command === mien.command));
  if (mele.porteur.matcher !== mG || groupeMien?.matcher !== ANCIEN || groupeMien.hooks.length !== 1) throw new Error("groupe mêlé : le hook du produit a changé de matcher ou lecons n'en est pas sorti");
  const PROPRE = "Bash|PowerShell|Write|Edit|MultiEdit|Read";
  const propre = joueCas([{ matcher: PROPRE, hooks: [{ ...lecons }] }]);
  if (propre.porteur.matcher !== PROPRE || (propre.r.elargis || []).length) throw new Error("un matcher propre au produit a été réécrit");
});

veut(1755);
check("TF-1755 — par le hook d'ouverture : produit muni du lanceur complété et le geste DIT ; produit sans lanceur intact", () => {
  const avec = mkdtempSync(join(tmpdir(), "ouverture-fusion-hook-"));
  mkdirSync(join(avec, ".claude"), { recursive: true });
  mkdirSync(join(avec, "forge", "hooks"), { recursive: true });
  writeFileSync(join(avec, "forge", "hooks", "factory.mjs"), "// lanceur jouet\n", "utf8");
  writeFileSync(join(avec, ".claude", "settings.json"), SETTINGS_ANCIEN, "utf8");
  const s = joue(avec);
  if (!/## Câblage des hooks de la factory \(TF-1755\)/.test(s) || !/remisage/.test(s)) throw new Error("le geste n'est pas dit dans le relevé");
  if (!nomsDe(JSON.parse(readFileSync(join(avec, ".claude", "settings.json"), "utf8"))).includes("remisage")) throw new Error("entrée remisage non ajoutée");
  const sans = mkdtempSync(join(tmpdir(), "ouverture-fusion-sans-"));
  mkdirSync(join(sans, ".claude"), { recursive: true });
  writeFileSync(join(sans, ".claude", "settings.json"), SETTINGS_ANCIEN, "utf8");
  const s2 = joue(sans);
  if (readFileSync(join(sans, ".claude", "settings.json"), "utf8") !== SETTINGS_ANCIEN || /TF-1755/.test(s2)) throw new Error("un produit sans lanceur a été touché");
});

veut(1903);
// ---- TF-1903 (21/10/2026) : LA COMMANDE RELATIVE DU LANCEUR S'ANCRE EN PLACE À L'OUVERTURE ------------------
// Rejoué le 21/10 dans une session réelle : après `cd sub`, `node forge/hooks/factory.mjs <nom>` ne se trouve plus
// (MODULE_NOT_FOUND) et le hook se tait ; `node "${CLAUDE_PROJECT_DIR}/forge/hooks/factory.mjs" <nom>` se déclenche.
// Vert : un produit à l'ancienne commande la voit réécrite en place — mêmes noms et options, aucune entrée de plus
// (jamais les deux formes), permissions, hook propre et délais intacts, seconde passe sans effet. Rouge : un hook
// étranger, une commande déjà ancrée ou absolue ne sont pas touchés ; un fichier illisible n'est pas réécrit.
const { ancrerCommandesFactory } = await import(new URL("./lib-ouverture-async.mjs", import.meta.url));
const commandesDe = (j) => Object.values(j.hooks || {}).flat().flatMap((g) => g.hooks || []).map((h) => String(h.command || ""));

check("TF-1903 — ancrage : fusion puis ancrage d'un produit à l'ancienne commande relative, sans doublon, réglages intacts, idempotent", () => {
  const P = mkdtempSync(join(tmpdir(), "ouverture-ancrage-"));
  const f = join(P, "settings.json");
  writeFileSync(f, SETTINGS_ANCIEN, "utf8");
  fusionnerHooksDuGabarit(f, GABARIT_SETTINGS);
  const r = ancrerCommandesFactory(f);
  const apres = readFileSync(f, "utf8");
  const j = JSON.parse(apres);
  const cmds = commandesDe(j);
  if (r.etat !== "corrige" || !["ouverture", "restitution", "page-html"].every((n) => r.ancres.includes(n))) throw new Error(`état ${r.etat}, ancrés : ${r.ancres.join(", ")}`);
  const relatives = cmds.filter((c) => /^node forge\/hooks\/factory\.mjs/.test(c));
  if (relatives.length) throw new Error(`commande(s) restée(s) relative(s) : ${relatives.join(" ; ")}`);
  if (!cmds.includes('node "${CLAUDE_PROJECT_DIR}/forge/hooks/factory.mjs" ouverture --sans-readme --contexte-json')) throw new Error("options de l'ouverture perdues à l'ancrage");
  const parEvenement = Object.entries(j.hooks).flatMap(([ev, gs]) => (gs || []).flatMap((g) => (g.hooks || [])
    .map((h) => (String(h.command || "").match(/factory\.mjs"?\s+([a-z-]+)/) || [])[1]).filter(Boolean).map((n) => `${ev}:${n}`)));
  if (parEvenement.length !== new Set(parEvenement).size) throw new Error(`doublon après fusion et ancrage : ${parEvenement.join(", ")}`);
  if (j.permissions.allow[0] !== "Bash(npm test)" || j.hooks.Stop[0].hooks[0].timeout !== 90) throw new Error("un réglage du produit a été modifié");
  if (!cmds.includes("node scripts/mon-hook.mjs")) throw new Error("le hook propre au produit a été touché");
  if (!apres.includes("\r\n  \"hooks\"")) throw new Error("fins de ligne ou indentation du produit perdues");
  if (ancrerCommandesFactory(f).etat !== "deja" || fusionnerHooksDuGabarit(f, GABARIT_SETTINGS).etat !== "deja") throw new Error("une seconde passe n'est pas idempotente");
});

check("TF-1903 — sens rouge et bords : hook étranger, commande ancrée ou absolue intacts ; illisible ou absent jamais réécrit", () => {
  const P = mkdtempSync(join(tmpdir(), "ouverture-ancrage-bords-"));
  const f = join(P, "settings.json");
  if (ancrerCommandesFactory(f).etat !== "absent") throw new Error("fichier absent non reconnu");
  writeFileSync(f, "{ pas du json", "utf8");
  if (ancrerCommandesFactory(f).etat !== "illisible" || readFileSync(f, "utf8") !== "{ pas du json") throw new Error("fichier illisible réécrit");
  const intact = JSON.stringify({ hooks: { Stop: [{ hooks: [{ command: "node scripts/mon-hook.mjs" }, { command: 'node "${CLAUDE_PROJECT_DIR}/forge/hooks/factory.mjs" restitution' }] }],
    UserPromptSubmit: [{ hooks: [{ command: 'node "C:/dev/Produit-X/forge/hooks/factory.mjs" lexique' }] }] } });
  writeFileSync(f, intact, "utf8");
  if (ancrerCommandesFactory(f).etat !== "deja" || readFileSync(f, "utf8") !== intact) throw new Error("une commande étrangère, ancrée ou absolue a été touchée");
  // Témoin rouge : la commande relative est bien celle qui est réécrite.
  writeFileSync(f, JSON.stringify({ hooks: { Stop: [{ hooks: [{ command: "node forge/hooks/factory.mjs restitution" }] }] } }), "utf8");
  const r = ancrerCommandesFactory(f);
  if (r.etat !== "corrige" || commandesDe(JSON.parse(readFileSync(f, "utf8")))[0] !== 'node "${CLAUDE_PROJECT_DIR}/forge/hooks/factory.mjs" restitution') throw new Error(`témoin rouge non ancré : ${JSON.stringify(r)}`);
});

check("TF-1903 — par le hook d'ouverture : l'ancrage est fait et DIT chez un produit muni du lanceur, rien chez un produit sans lanceur", () => {
  const avec = mkdtempSync(join(tmpdir(), "ouverture-ancrage-hook-"));
  mkdirSync(join(avec, ".claude"), { recursive: true });
  mkdirSync(join(avec, "forge", "hooks"), { recursive: true });
  writeFileSync(join(avec, "forge", "hooks", "factory.mjs"), "// lanceur jouet\n", "utf8");
  writeFileSync(join(avec, ".claude", "settings.json"), SETTINGS_ANCIEN, "utf8");
  const s = joue(avec);
  if (!/## Câblage des hooks de la factory \(TF-1903\)/.test(s) || !/ancrée\(s\) sur la racine du projet/.test(s)) throw new Error("l'ancrage n'est pas dit dans le relevé");
  if (commandesDe(JSON.parse(readFileSync(join(avec, ".claude", "settings.json"), "utf8"))).some((c) => /^node forge\/hooks\/factory\.mjs/.test(c))) throw new Error("commande relative restée chez un produit muni du lanceur");
  const sans = mkdtempSync(join(tmpdir(), "ouverture-ancrage-sans-"));
  mkdirSync(join(sans, ".claude"), { recursive: true });
  writeFileSync(join(sans, ".claude", "settings.json"), SETTINGS_ANCIEN, "utf8");
  const s2 = joue(sans);
  if (readFileSync(join(sans, ".claude", "settings.json"), "utf8") !== SETTINGS_ANCIEN || /TF-1903/.test(s2)) throw new Error("un produit sans lanceur a été touché");
});

veut(1942);
// ---- TF-1942 (21/10/2026) : LES PERMISSIONS D'UN PRODUIT SURVIVENT À L'OUVERTURE, ET LE RELEVÉ LE DIT ---------
// Le fait : la phrase « Si l'un d'eux portait une modification locale, elle a été écrasée » ne nommait pas ce
// qu'elle visait ; Produit-73 a cru son `.claude/settings.json` écrasé et renoncé à poser la règle de sécurité
// exigée par son client. Vert : un produit muni du lanceur, aux permissions `allow`, `ask`, `deny`, `defaultMode`
// (forme de l'étude 20261021, option O2), ouvert par le hook complet : permissions identiques octet pour octet
// après fusion, ancrage et recopie ; le relevé ne dit écrasés que les fichiers « remplacé » et dit
// `.claude/settings.json` jamais recopié. Rouge : l'ancienne phrase, qui ne nommait rien, n'est plus émise, et
// `.claude/settings.json` ne figure jamais parmi les fichiers recopiés.
check("TF-1942 — permissions allow, ask, deny et defaultMode d'un produit intactes après l'ouverture ; le relevé ne vise que les fichiers remplacés", () => {
  const P = mkdtempSync(join(tmpdir(), "ouverture-permissions-"));
  mkdirSync(join(P, ".claude"), { recursive: true });
  mkdirSync(join(P, "forge", "hooks"), { recursive: true });
  writeFileSync(join(P, "forge", "hooks", "factory.mjs"), "// lanceur jouet, périmé : la recopie le remplace\n", "utf8");
  const permissions = {
    defaultMode: "default",
    disableBypassPermissionsMode: "disable",
    allow: ["Bash(npm test)", "Read(./src/**)"],
    ask: ["Bash(git commit *)", "Bash(git push *)", "PowerShell(git commit *)", "PowerShell(git push *)"],
    deny: ["Read(./.env)", "Bash(rm -rf *)"],
  };
  writeFileSync(join(P, ".claude", "settings.json"), JSON.stringify({ ...JSON.parse(SETTINGS_ANCIEN), permissions }, null, 2) + "\n", "utf8");
  const s = joue(P);
  const apres = JSON.parse(readFileSync(join(P, ".claude", "settings.json"), "utf8"));
  if (JSON.stringify(apres.permissions) !== JSON.stringify(permissions)) throw new Error(`permissions modifiées : ${JSON.stringify(apres.permissions)}`);
  if (readFileSync(join(P, "forge", "hooks", "factory.mjs"), "utf8") !== readFileSync(join(PILOT, "gabarits", "hooks-factory.mjs"), "utf8")) throw new Error("témoin mal construit : le lanceur périmé n'a pas été remplacé");
  if (!/forge\/hooks\/factory\.mjs — remplacé depuis/.test(s)) throw new Error("le fichier remplacé n'est pas listé");
  if (!/des \d+ fichier\(s\) « remplacé » ci-dessus, et d'eux seuls, a été écrasée/.test(s)) throw new Error("l'écrasement n'est pas borné aux fichiers remplacés");
  if (!/Rien d'autre n'est recopié : `\.claude\/settings\.json` \(permissions `allow`, `ask`, `deny`, `defaultMode`/.test(s)) throw new Error("le relevé ne dit pas que settings.json n'est jamais recopié");
  if (/Si l'un d'eux portait une modification locale, elle a été écrasée/.test(s)) throw new Error("l'ancienne phrase, qui ne nommait rien, est encore émise");
  if (/^\s*- \.claude\/settings\.json — (remplacé|créé) depuis/m.test(s)) throw new Error("settings.json listé parmi les fichiers recopiés");
});

veut(2408);
// ---- TF-2408 (14/11/2026) : LA RECOPIE DU LANCEUR NE RETIRE PAS UN NOM DE HOOK QUE LE GABARIT NE PORTE PAS ---------
// Le fait : le 10/11/2026, la recopie de gabarits/hooks-factory.mjs a retiré chez un produit le nom `fichiers-env` posé par l'autre poste ;
// le hook de sécurité sautait en exit 0. Rouge : un lanceur qui déclare un nom qu'aucune version du gabarit ne déclare n'est PAS écrasé,
// et l'ouverture le dit. Vert : un lanceur périmé qui ne déclare que des noms déjà portés par le gabarit est recopié, comme avant.
check("TF-2408 — un lanceur qui déclare un nom de hook absent du gabarit n'est pas écrasé et l'ouverture le dit ; un lanceur périmé aux noms connus est recopié", () => {
  const gabarit = readFileSync(join(PILOT, "gabarits", "hooks-factory.mjs"), "utf8");
  const NOMS = /const NOMS = new Set\(\[([^\]]*)\]\)/;
  const m = NOMS.exec(gabarit);
  if (!m || !/"fichiers-env"/.test(m[1])) throw new Error("témoin mal construit : le gabarit ne déclare pas fichiers-env");
  const avecNom = gabarit.replace(NOMS, (tout, noms) => `const NOMS = new Set([${noms}, "hook-pose-par-le-produit"])`);
  const sansConnu = gabarit.replace(NOMS, (tout, noms) => `const NOMS = new Set([${noms.replace(/,\s*"fichiers-env"/, "")}])`);
  if (avecNom === gabarit || sansConnu === gabarit) throw new Error("témoin mal construit : le lanceur d'essai ne diffère pas du gabarit");
  const produit = (nom, lanceur) => {
    const P = mkdtempSync(join(tmpdir(), `ouverture-noms-${nom}-`));
    mkdirSync(join(P, ".claude"), { recursive: true });
    mkdirSync(join(P, "forge", "hooks"), { recursive: true });
    writeFileSync(join(P, "forge", "hooks", "factory.mjs"), lanceur, "utf8");
    writeFileSync(join(P, ".claude", "settings.json"), SETTINGS_ANCIEN, "utf8");
    return P;
  };
  const P1 = produit("inconnu", avecNom);
  const s1 = joue(P1);
  if (readFileSync(join(P1, "forge", "hooks", "factory.mjs"), "utf8") !== avecNom) throw new Error("rouge : le lanceur qui déclare un nom absent du gabarit a été écrasé, le nom est perdu");
  if (!/non recopié : forge\/hooks\/factory\.mjs — déclare le\(s\) nom\(s\) de hook « hook-pose-par-le-produit »/.test(s1)) throw new Error(`l'ouverture ne dit pas le nom : ${s1.slice(0, 600)}`);
  if (/forge\/hooks\/factory\.mjs — remplacé depuis/.test(s1)) throw new Error("le lanceur est listé comme remplacé alors qu'il ne l'a pas été");
  const P2 = produit("connus", sansConnu);
  const s2 = joue(P2);
  if (readFileSync(join(P2, "forge", "hooks", "factory.mjs"), "utf8") !== gabarit) throw new Error("vert : un lanceur périmé aux noms connus du gabarit n'a pas été recopié");
  if (!/forge\/hooks\/factory\.mjs — remplacé depuis/.test(s2) || /non recopié : forge\/hooks\/factory\.mjs/.test(s2)) throw new Error("vert : la recopie du lanceur périmé n'est pas dite comme telle");
});
// ---- TF-1758 et TF-1760 (15/10/2026) : LOTS NON REMIS ET SORT DES RETOURS, À L'OUVERTURE DU PRODUIT --
// Vert : un lot `a_remettre` de plus de 24 h, jamais parvenu au pilot, est NOMMÉ ; les TF du registre qui
// désignent le produit (par son pseudonyme, retrouvé par une table jetable) sont comptés, et la seconde
// ouverture dit ce qui a été clos depuis la première. Rouge : un lot « remis le … » et un lot `a_remettre`
// de moins de 24 h ne sont pas nommés ; aucun autre nom que le pseudonyme du produit n'est imprimé.
if (veut(1758, 1760)) {
  const { utimesSync } = await import("node:fs");
  const P = join(mkdtempSync(join(tmpdir(), "ouverture-retours-")), "ProduitJouetZZ");
  const retours = join(P, "forge", "retours");
  mkdirSync(retours, { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: P });
  const lotVieux = join(retours, "ProduitJouetZZ - RETOURS - 20260901a.md");
  writeFileSync(lotVieux, "# lot\n\n- **Statut** : a_remettre\n", "utf8");
  const ilYa = (Date.now() - 20 * 86400000) / 1000;
  utimesSync(lotVieux, ilYa, ilYa);
  writeFileSync(join(retours, "ProduitJouetZZ - RETOURS - 20260902a.md"), "# lot\n\n- **Statut** : remis le 2026-09-03\n", "utf8");
  utimesSync(join(retours, "ProduitJouetZZ - RETOURS - 20260902a.md"), ilYa, ilYa);
  const auj = new Date(); const jour = `${auj.getFullYear()}${String(auj.getMonth() + 1).padStart(2, "0")}${String(auj.getDate()).padStart(2, "0")}`;
  writeFileSync(join(retours, `ProduitJouetZZ - RETOURS - ${jour}a.md`), "# lot\n\n- **Statut** : a_remettre\n", "utf8");
  const T2 = mkdtempSync(join(tmpdir(), "ouverture-retours-tables-"));
  writeFileSync(join(T2, "noms.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
  writeFileSync(join(T2, "produits.json"), JSON.stringify({ produits: { ProduitJouetZZ: "Produit-64" } }), "utf8");
  const env = { ...process.env, FORGE_NOMS_INTERDITS: join(T2, "noms.json"), FORGE_PRODUITS_PSEUDO: join(T2, "produits.json") };
  const jouer = () => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--pilot", PILOT], { cwd: P, encoding: "utf8", timeout: delaiSousCharge(120000), env });
  const chargeAvant2 = facteurDeCharge();
  const t0 = Date.now();
  const s1 = jouer();
  const duree = Date.now() - t0;
  const s2 = jouer();
  const section = (s, t) => (s.split(t)[1] || "").split("\n## ")[0];
  check("TF-1758 — un lot « a_remettre » de plus de 24 h, jamais parvenu, est nommé ; le lot remis et le lot du jour ne le sont pas", () => {
    const l = section(s1, "## Lots de retours restés « a_remettre »");
    if (!/JAMAIS parvenu/.test(l) || !/20260901a/.test(l)) throw new Error(`lot non nommé : ${l.slice(0, 200) || "(section absente)"}`);
    if (/20260902a/.test(l) || new RegExp(`${jour}a`).test(l)) throw new Error("un lot remis ou du jour est nommé à tort");
  });
  check("TF-1760 — les TF du produit, retrouvés par son pseudonyme, sont comptés ; la seconde ouverture dit ce qui a été clos depuis", () => {
    const v1 = section(s1, "## Vos retours au registre du pilot (TF-1760)");
    if (!/TF désignent ce produit au registre public \(pseudonyme : Produit-64\)/.test(v1)) throw new Error(`section : ${v1.slice(0, 200) || "(absente)"}`);
    if (/depuis votre ouverture précédente/.test(v1)) throw new Error("première ouverture : rien ne devrait être dit « depuis »");
    if (!/depuis votre ouverture précédente/.test(section(s2, "## Vos retours au registre du pilot (TF-1760)"))) throw new Error("la seconde ouverture ne situe pas les clôtures");
  });
  check(`TF-1758/TF-1760 — le relevé du produit reste sous 20 s (mesuré : ${duree} ms, sans bootstrap)`, () => {
    const borne = borneSousCharge(20000, Math.max(chargeAvant2, facteurDeCharge()));   // TF-2511
    if (duree > borne) throw new Error(`${duree} ms, au-delà de ${borne} ms (20 s au repos, à l'échelle de la charge mesurée par le témoin)`);
  });
}

// ---- TF-1988 (29/10/2026, lot Produit-85 20261024a, RP-3) : LES RETOURS DU LEDGER RESTÉS SANS LOT ------------
// Le 24/10, cinq entrées `type: retour` du ledger d'un produit n'avaient jamais été compilées en lot, et aucune ouverture
// ne l'avait dit. Vert : une entrée `retour` de plus de 24 h qu'aucun lot ne cite par son seq est NOMMÉE, et sa classe est
// dite inconnue quand le référentiel du pilot ne la porte pas. Rouge : une entrée citée par un lot (liste ou plage), une
// entrée de moins de 24 h, une entrée qui n'est pas un retour, une entrée portant son lot ne sont pas nommées ; un lot qui
// cite tout fait disparaître la section (le remède se joue).
if (veut(1988)) {
  const P = join(mkdtempSync(join(tmpdir(), "ouverture-ledger-")), "ProduitJouetYY");
  mkdirSync(join(P, "forge", "retours"), { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: P });
  const il = (jours) => new Date(Date.now() - jours * 86400000).toISOString();
  const entrees = [
    { seq: 1, ts: il(30), type: "run_open" },
    { seq: 2, ts: il(10), type: "retour", classe: "classe-inexistante-zz", resume: "friction A" },
    { seq: 3, ts: il(10), type: "retour", classe: "gate-cout-invite-au-contournement", resume: "friction B" },
    { seq: 4, ts: il(10), type: "retour", resume: "friction C" },
    { seq: 5, ts: il(10), type: "retour", resume: "friction D" },
    { seq: 6, ts: il(0.05), type: "retour", classe: "classe-recente-zz", resume: "friction E, de moins de 24 h" },
    { seq: 7, ts: il(10), type: "retour", lot: "ProduitJouetYY - RETOURS - 20261001a", resume: "friction F, qui porte son lot" },
    { seq: 8, ts: il(10), type: "reponse_humain", resume: "pas un retour" },
  ];
  writeFileSync(join(P, "forge", "ledger.jsonl"), entrees.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
  const lot = join(P, "forge", "retours", "ProduitJouetYY - RETOURS - 20261001a.md");
  writeFileSync(lot, "# lot\n\n- **Références ledger** : `forge\\ledger.jsonl` seq 3 et 4 (entrées `type: retour`)\n- **Statut** : remis le 2026-10-02\n", "utf8");
  const section = (s) => (s.split("## Retours du ledger restés sans lot, plus de")[1] || "").split("\n## ")[0];
  const s1 = joue(P);
  check("TF-1988 — les entrées `retour` du ledger de plus de 24 h qu'aucun lot ne cite sont nommées, et elles seules", () => {
    const l = section(s1);
    if (!/2 entrée\(s\)/.test(l) || !/seq 2, 5 \(la plus ancienne : 10 j\)/.test(l)) throw new Error(`section : ${l.slice(0, 300) || "(absente)"}`);
    if (/seq [^\n]*\b(3|4|6|7|8)\b/.test(l.split("\n")[1] || "")) throw new Error("une entrée citée, récente, déjà compilée ou qui n'est pas un retour est nommée");
  });
  check("TF-1988 — une classe que le référentiel du pilot ne connaît pas est dite, une classe connue ne l'est pas", () => {
    const l = section(s1);
    if (!/1 d'entre elles portent une classe que le référentiel du pilot ne connaît pas \(seq 2 : « classe-inexistante-zz »\)/.test(l)) throw new Error(`classe non dite : ${l.slice(0, 400)}`);
    if (/gate-cout-invite/.test(l)) throw new Error("une classe connue est accusée");
  });
  check("TF-1988 — le remède se joue : un lot qui cite les entrées (plage « seq 2 à 5 ») fait disparaître la section", () => {
    writeFileSync(lot, "# lot\n\n- **Références ledger** : `forge\\ledger.jsonl` seq 2 à 5\n- **Statut** : remis le 2026-10-02\n", "utf8");
    const s2 = joue(P);
    if (/Retours du ledger restés sans lot/.test(s2)) throw new Error("la section persiste alors que le lot cite toutes les entrées");
  });
  check("TF-1988 — rien n'est écrit chez le produit (lecture seule)", () => {
    const apres = readFileSync(join(P, "forge", "ledger.jsonl"), "utf8");
    if (apres !== entrees.map((e) => JSON.stringify(e)).join("\n") + "\n") throw new Error("le ledger a été modifié");
  });
}

// ---- TF-2260 (06/11/2026) : LE JOURNAL HORS RUN COMPTE AUSSI --------------------------------------------------------
// Hors run, `ledger.py` inscrit un retour à `forge/hors-run.jsonl` (TF-2223) ; aucun contrôle de lot ne le lisait, la compilation restait à la session qui ferme un
// run. Vert : un produit SANS ledger de run mais avec un journal hors run voit ses retours de plus de 24 h, non cités par un lot, nommés dans leur section
// (« hors-run seq n ») ; un lot qui cite « forge/hors-run.jsonl seq 1 » les retire. Rouge : un seq cité pour le ledger ne retire pas le même numéro du journal
// hors run (et inversement), une entrée récente, une entrée qui n'est pas un retour, une entrée portant son lot ne sont pas nommées ; rien n'est écrit chez le produit.
{
  const P = join(mkdtempSync(join(tmpdir(), "ouverture-hors-run-")), "ProduitJouetHR");
  mkdirSync(join(P, "forge", "retours"), { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: P });
  const il = (jours) => new Date(Date.now() - jours * 86400000).toISOString();
  const horsRun = [
    { seq: 1, ts: il(9), type: "retour", hors_run: true, resume: "friction A hors run" },
    { seq: 2, ts: il(9), type: "retour", hors_run: true, resume: "friction B hors run" },
    { seq: 3, ts: il(9), type: "question_humain", hors_run: true, resume: "pas un retour" },
    { seq: 4, ts: il(0.05), type: "retour", hors_run: true, resume: "friction C, de moins de 24 h" },
    { seq: 5, ts: il(9), type: "retour", hors_run: true, lot: "ProduitJouetHR - RETOURS - 20261001a", resume: "friction D, qui porte son lot" },
  ];
  const brutHr = horsRun.map((e) => JSON.stringify(e)).join("\n") + "\n";
  writeFileSync(join(P, "forge", "hors-run.jsonl"), brutHr, "utf8");
  const lot = join(P, "forge", "retours", "ProduitJouetHR - RETOURS - 20261001a.md");
  writeFileSync(lot, "# lot\n\n- **Références ledger** : `forge\\ledger.jsonl` seq 1 et 2 (entrées `type: retour`)\n- **Statut** : remis le 2026-10-02\n", "utf8");
  const sectionHr = (s) => (s.split("## Retours du journal hors run restés sans lot, plus de")[1] || "").split("\n## ")[0];
  const s1 = joue(P);
  check("TF-2260 — sans ledger de run, les retours du journal hors run de plus de 24 h qu'aucun lot ne cite sont nommés (un lot qui cite « ledger seq 1 et 2 » ne les retire pas)", () => {
    const l = sectionHr(s1);
    if (!/2 entrée\(s\)/.test(l) || !/hors-run seq 1, 2 \(la plus ancienne : 9 j\)/.test(l)) throw new Error(`section : ${l.slice(0, 400) || "(absente)"}`);
    if (/hors-run seq [^\n]*\b(3|4|5)\b/.test(l.split("\n")[1] || "")) throw new Error("une entrée récente, déjà compilée ou qui n'est pas un retour est nommée");
  });
  check("TF-2260 — la section du ledger ne dit rien des entrées hors run (deux journaux, deux numérotations)", () => {
    if (/Retours du ledger restés sans lot/.test(s1)) throw new Error("la section du ledger du run est ouverte alors que ce produit n'a pas de ledger");
  });
  check("TF-2260 — le remède se joue : un lot qui cite « forge/hors-run.jsonl seq 1, 2 » fait disparaître la section, et ce segment ne retire rien au ledger", () => {
    writeFileSync(lot, "# lot\n\n- **Références hors run** : `forge/hors-run.jsonl` seq 1, 2 (entrées `type: retour`)\n- **Statut** : remis le 2026-10-02\n", "utf8");
    const s2 = joue(P);
    if (/Retours du journal hors run restés sans lot/.test(s2)) throw new Error("la section persiste alors que le lot cite les deux entrées");
    // Le même numéro côté ledger du run n'est pas cité : un ledger neuf qui porte un retour seq 2 doit rester nommé.
    writeFileSync(join(P, "forge", "ledger.jsonl"), [{ seq: 1, ts: il(30), type: "run_open" }, { seq: 2, ts: il(9), type: "retour", resume: "friction ledger" }].map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
    const s3 = joue(P);
    const l = (s3.split("## Retours du ledger restés sans lot, plus de")[1] || "").split("\n## ")[0];
    if (!/1 entrée\(s\)/.test(l) || !/seq 2 \(la plus ancienne : 9 j\)/.test(l)) throw new Error(`le segment hors run a retiré le seq 2 du ledger du run : ${l.slice(0, 300) || "(section absente)"}`);
  });
  check("TF-2260 — rien n'est écrit chez le produit (lecture seule)", () => {
    if (readFileSync(join(P, "forge", "hors-run.jsonl"), "utf8") !== brutHr) throw new Error("le journal hors run a été modifié");
  });
}

// ---- TF-2214 (06/11/2026, RP-34 de Produit-86) : LES DÉCISIONS POSÉES SANS RÉPONSE SE SIGNALENT À L'OUVERTURE -----
// D-48 (réseau vide facturé), posée le 03/11, est restée sans réponse ni rappel pendant deux jours. Vert : une D-N posée au ledger depuis 14 jours au plus, sans `reponse_humain`
// postérieure qui la nomme, est NOMMÉE avec sa date et son seq ; une décision répondue, une décision de plus de 14 jours et un ledger sans décision ne sont pas nommés ; la réponse
// consignée fait disparaître la section (le remède se joue) ; rien n'est écrit chez le produit.
if (veut(2214)) {
  const P = join(mkdtempSync(join(tmpdir(), "ouverture-decisions-")), "ProduitJouetZZ");
  mkdirSync(join(P, "forge", "retours"), { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: P });
  const il = (jours) => new Date(Date.now() - jours * 86400000).toISOString();
  const entrees = [
    { seq: 1, ts: il(30), type: "run_open" },
    { seq: 2, ts: il(2), type: "question_humain", decisions_posees: { "D-48": "Supprime-t-on le réseau vide créé en Europe du Nord ?" } },
    { seq: 3, ts: il(2), type: "question_humain", decisions_posees: { "D-49": "Quel hébergement pour le poste ?" } },
    { seq: 4, ts: il(1), type: "reponse_humain", decision: "D-49", reponse: "a" },
    { seq: 5, ts: il(20), type: "question_humain", decisions_posees: { "D-12": "Question ancienne restée sans réponse ?" } },
  ];
  writeFileSync(join(P, "forge", "ledger.jsonl"), entrees.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
  const section = (s) => (s.split("## Décisions posées sans réponse nommée (TF-2214)")[1] || "").split("\n## ")[0];
  const s1 = joue(P);
  check("TF-2214 — la décision posée il y a 2 jours sans réponse est nommée (date, seq, question), et elle seule", () => {
    const l = section(s1);
    if (!/1 décision\(s\)/.test(l) || !/D-48 \(posée le \d{4}-\d{2}-\d{2}, seq 2 — Supprime-t-on le réseau vide/.test(l)) throw new Error(`section : ${l.slice(0, 300) || "(absente)"}`);
    if (/D-49|D-12/.test(l)) throw new Error("une décision répondue ou de plus de 14 jours est nommée");
  });
  check("TF-2214 — le remède se joue : la réponse consignée avec son numéro fait disparaître la section", () => {
    writeFileSync(join(P, "forge", "ledger.jsonl"), entrees.concat([{ seq: 6, ts: il(0.5), type: "reponse_humain", decisions: { "D-48": "a" } }]).map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
    if (/Décisions posées sans réponse nommée/.test(joue(P))) throw new Error("la section persiste alors que la réponse est consignée");
  });
}

// ---- D-193 (a) du 10/11/2026, TF-2330 et TF-2333 (RP-07 et RP-10 du produit marketing) : LA SÉANCE DATÉE NOMME SA REVUE À 5 JOURS, ET UN
// ENGAGEMENT NON TENU SE REDIT. La séance du 13/11/2026 n'était dans aucun calendrier et sa revue n'a eu lieu que sur demande humaine ; des
// documents ont promis des pièces que personne n'a produites. Vert : le calendrier et le registre NAISSENT de leur modèle chez un produit qui
// n'en a pas, en-tête daté du jour, et un fichier présent n'est jamais touché ; une séance à J-3 est nommée avec ce que sa revue couvre et une
// commande qui MARCHE depuis le produit ; une revue faite se dit en une ligne. Rouge : une séance à J-10 et une séance passée sont muettes, une
// date hors forme est dite avec sa ligne, un engagement dont le livrable manque est redit ; le remède joué (livrable produit) fait taire la section.
if (veut(2330, 2333)) {
  const P = join(mkdtempSync(join(tmpdir(), "ouverture-seances-")), "ProduitJouetSE");
  mkdirSync(join(P, "forge", "retours"), { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: P });
  const jourDans = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const AUJ = jourDans(0);
  const calendrier = join(P, "forge", "CALENDRIER.md"), registre = join(P, "forge", "ENGAGEMENTS.md");
  const sectionSeances = (s) => (s.split("## Séances datées dans les 5 jours")[1] || "").split("\n## ")[0];
  const sectionMalFormee = (s) => (s.split("## Calendrier des séances mal formé")[1] || "").split("\n## ")[0];
  const sectionEngagements = (s) => (s.split("## Engagements des documents remis, NON tenus")[1] || "").split("\n## ")[0];
  const chargeAvant3 = facteurDeCharge();
  const t0 = Date.now();
  const s0 = joue(P);
  const duree0 = Date.now() - t0;
  check("TF-2330 vert — le calendrier et le registre NAISSENT de leur modèle chez un produit qui n'en a pas, en-tête daté du jour, et la naissance est dite", () => {
    for (const f of [calendrier, registre]) {
      if (!existsSync(f)) throw new Error(`${f} n'est pas né`);
      if (!new RegExp(`^verifie_le: ${AUJ}\\r?$`, "m").test(readFileSync(f, "utf8"))) throw new Error(`en-tête de ${f} non daté du jour`);
    }
    if (!/2 fichier\(s\) NÉ\(S\) à l'instant[\s\S]*forge\/CALENDRIER\.md — né de gabarits\/CALENDRIER-PRODUIT\.md[\s\S]*forge\/ENGAGEMENTS\.md — né de gabarits\/ENGAGEMENTS-PRODUIT\.md/.test(s0)) throw new Error("naissance non dite au relevé");
    if (/Séances datées|Calendrier des séances mal formé|Engagements des documents remis, NON tenus/.test(s0)) throw new Error("un calendrier et un registre vides font parler l'ouverture");
  });
  // Sur un hook qui ne les fait pas naître (l'état d'avant D-193), le banc pose lui-même les deux fichiers depuis leur modèle : chaque
  // contrôle ci-dessous rend alors son propre rouge, au lieu d'un arrêt du banc sur un fichier absent.
  for (const [f, m] of [[calendrier, "CALENDRIER-PRODUIT.md"], [registre, "ENGAGEMENTS-PRODUIT.md"]]) {
    if (!existsSync(f)) writeFileSync(f, readFileSync(join(PILOT, "gabarits", m), "utf8").replace(/^---[\s\S]*?\n---/, (fm) => fm.replace(/AAAA-MM-JJ/g, AUJ)), "utf8");
  }
  const lignesSeances = [
    `| ${jourDans(3)} | Formation de prise en main | Client-A | \`output/formation\` | à faire | convention du 2026-10-13 |`,
    `| ${jourDans(10)} | Atelier lointain | Client-B | — | à faire | courriel du 2026-11-01 |`,
    `| ${jourDans(-1)} | Comité d'hier | Client-C | — | à faire | ledger seq 12 |`,
    `| ${jourDans(2)} | Démonstration déjà revue | Client-D | — | faite le ${AUJ} | ledger seq 40 |`,
    "| 13/11/2026 | Séance mal datée | Client-E | — | à faire | courriel |",
  ];
  writeFileSync(calendrier, readFileSync(calendrier, "utf8").replace("| *(aucune)* | — | — | — | — | — |", lignesSeances.join("\n")), "utf8");
  const avantGarde = readFileSync(calendrier, "utf8");
  const s1 = joue(P);
  check("TF-2330 garde — un calendrier présent n'est jamais réécrit par l'ouverture", () => {
    if (readFileSync(calendrier, "utf8") !== avantGarde) throw new Error("le calendrier rempli a été modifié");
    if (/NÉ\(S\) à l'instant/.test(s1)) throw new Error("une naissance est annoncée alors que les fichiers existent");
  });
  check("TF-2330 rouge → nommé — la séance à J-3 nomme sa revue À FAIRE, ce qu'elle couvre (5 points) et la commande de ses documents", () => {
    const l = sectionSeances(s1);
    if (!new RegExp(`Séance du ${jourDans(3)}, dans 3 jours \\(J-3\\) : Formation de prise en main — pour Client-A — revue de préparation À FAIRE`).test(l)) throw new Error(`section : ${l.slice(0, 400) || "(absente)"}`);
    if (!/\(1\) chaque engagement[\s\S]*\(5\) chaque pièce jugée par l'oracle de son domaine/.test(l) || !/agent `verificateur`/.test(l)) throw new Error("couverture de la revue ou agent qui la joue absents");
    if (!/oracle-engagements\.mjs" \. --documents "output\/formation"`/.test(l)) throw new Error("commande des engagements absente ou sans les documents de la séance");
  });
  check("TF-2330 vert — une séance à J-10 et une séance passée sont MUETTES, une revue faite se dit en une ligne sans rappel", () => {
    const l = sectionSeances(s1);
    if (/Atelier lointain|Comité d'hier/.test(l)) throw new Error("une séance lointaine ou passée est nommée");
    if (!new RegExp(`Séance du ${jourDans(2)}, dans 2 jours \\(J-2\\) : Démonstration déjà revue — pour Client-D — revue de préparation faite le ${AUJ}\\.`).test(l)) throw new Error(`revue faite non dite : ${l.slice(0, 300)}`);
    if (/Démonstration déjà revue[^\n]*À FAIRE/.test(l)) throw new Error("une revue faite est encore rappelée à faire");
  });
  check("TF-2330 rouge — un calendrier mal formé est DIT : la ligne de la date hors forme, et la forme attendue", () => {
    const l = sectionMalFormee(s1);
    if (!/ligne 24 : date « 13\/11\/2026 » hors du format AAAA-MM-JJ/.test(l) || !/gabarits\/CALENDRIER-PRODUIT\.md/.test(l)) throw new Error(`section : ${l.slice(0, 300) || "(absente)"}`);
  });
  check("TF-2330 remède joué (TF-1013) — la commande imprimée, jouée depuis le produit, rend le verdict JSON de l'oracle des engagements", () => {
    const m = sectionSeances(s1).match(/`(node "[^`]+oracle-engagements\.mjs" \.[^`]*)`/);
    if (!m) throw new Error("commande introuvable dans la section");
    const r = spawnSync(m[1], { cwd: P, shell: true, encoding: "utf8" });
    let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit ci-dessous */ }
    if (!j || j.oracle !== "oracle-engagements" || ![0, 1].includes(r.status)) throw new Error(`commande en échec (exit ${r.status}) : ${(r.stderr || r.stdout || "").slice(0, 200)}`);
  });
  writeFileSync(registre, readFileSync(registre, "utf8").replace("| *(aucun)* | — | — | — |",
    "| QCM final en formulaire en ligne | pièce | `output/formation/Client-A - Programme - 20261028g.docx` | livrable : `output/formation/Client-A - QCM - 20261109a.md` |"), "utf8");
  check("TF-2333 rouge — un engagement dont le livrable manque est redit à l'ouverture, avec sa ligne et le remède", () => {
    const l = sectionEngagements(joue(P));
    if (!/EN2 \(ligne 21\) : « QCM final en formulaire en ligne »[^\n]*Client-A - QCM - 20261109a\.md` n'existe pas/.test(l) || !/Remède : chaque engagement pointe un livrable présent/.test(l)) throw new Error(`section : ${l.slice(0, 400) || "(absente)"}`);
  });
  check("TF-2333 vert — le remède joué (livrable produit) fait taire la section", () => {
    mkdirSync(join(P, "output", "formation"), { recursive: true });
    writeFileSync(join(P, "output", "formation", "Client-A - QCM - 20261109a.md"), "# QCM final\n", "utf8");
    if (/Engagements des documents remis, NON tenus/.test(joue(P))) throw new Error("la section persiste alors que le livrable existe");
  });
  check(`TF-2330 durée — le relevé d'un produit (sans le tirage réseau) reste sous 45 s, calendrier et registre compris (mesuré : ${duree0} ms)`, () => {
    const borne = borneSousCharge(45000, Math.max(chargeAvant3, facteurDeCharge()));   // TF-2511
    if (duree0 >= borne) throw new Error(`${duree0} ms, au-delà de ${borne} ms (45 s au repos, à l'échelle de la charge mesurée par le témoin)`);
  });
}

veut(1635);
// TF-1635 — LE DÉLAI DU CLIENT EST UNE BORNE, PAS UNE CONSIGNE. Tout hook SessionStart resté
// synchrone, au pilot comme dans le gabarit des produits, porte un délai d'au plus 45 s : coupé à
// ce délai, il ne peut plus faire dépasser les 60 s de l'extension VS Code. Sens rouge : le même
// prédicat sur un hook synchrone à 120 s, le délai que portait hook-produits-intacts jusqu'au 13/10.
const BORNE_SYNC_S = 45;
const horsBorne = (settings) => ((settings.hooks || {}).SessionStart || []).flatMap((g) => g.hooks || [])
  .filter((h) => h.async !== true && !(Number(h.timeout) <= BORNE_SYNC_S)).map((h) => `${h.command} (${h.timeout ?? "sans délai"} s)`);
check(`TF-1635 — tout hook SessionStart synchrone du pilot et du gabarit produit est borné à ${BORNE_SYNC_S} s`, () => {
  for (const rel of [".claude/settings.json", "gabarits/settings-produit.json"]) {
    const fautifs = horsBorne(JSON.parse(readFileSync(join(PILOT, rel), "utf8")));
    if (fautifs.length) throw new Error(`${rel} : ${fautifs.join(" ; ")}`);
  }
  const rouge = horsBorne({ hooks: { SessionStart: [{ hooks: [{ command: "node oracles/hook-produits-intacts.mjs --empreinte", timeout: 120 }] }] } });
  if (rouge.length !== 1) throw new Error("sens rouge : un hook synchrone à 120 s n'est pas refusé");
});

veut(1636);
// ---- TF-1636 (14/10/2026) : LES GATES EN TÊTE, ET UN BUDGET DE CONTEXTE MESURÉ ---------------
// Le 13/10, le harnais a coupé le relevé à 2 Ko et les gates, en dernière section, n'ont pas atteint
// l'assistant. Vert : dans le contexte réel du pilot, les gates précèdent toute section de taille
// variable, et le contexte tient dans le budget mesuré. Rouge : un relevé gonflé au-delà du budget est
// borné par le hook lui-même, les gates gardés, les sections retirées NOMMÉES.
const { borner, BUDGET_CONTEXTE_ASYNC, PLAFONDS_MESURES } = await import(new URL("./lib-budget-contexte.mjs", import.meta.url));
check(`TF-1636 vert — le contexte réel du pilot tient dans le budget (${BUDGET_CONTEXTE_ASYNC} car., plafond asynchrone prouvé ${PLAFONDS_MESURES.asynchrone_json.recu_entier_au_moins}) et les gates précèdent les sections variables`, () => {
  const ctx = JSON.parse(sortieJson).hookSpecificOutput.additionalContext;
  if (ctx.length > BUDGET_CONTEXTE_ASYNC) throw new Error(`${ctx.length} caractères, au-delà du budget`);
  const titres = ctx.split(NL).filter((l) => /^## /.test(l));
  const iGates = titres.findIndex((t) => /Gates actifs dans cette session/.test(t));
  if (iGates < 0 || iGates > 2) throw new Error(`gates en position ${iGates} parmi ${titres.length} sections`);
  console.log(`    (mesure : contexte du pilot sans tirage = ${ctx.length} caractères, ${titres.length} sections)`);
});
check("TF-1636 rouge — un relevé gonflé au-delà du budget est borné : gates gardés, sections omises nommées, budget tenu", () => {
  const tete = ["## Relevé d'ouverture", "", "## Gates actifs dans cette session (R-44)", "- règle de session", ""];
  const corps = []; for (let i = 0; i < 30; i++) corps.push("", `## Section variable ${i}`, "x".repeat(3000));
  const r = borner([...tete, ...corps], BUDGET_CONTEXTE_ASYNC, tete.length, "renvoi");
  const t = r.lignes.join(NL);
  if (!r.tronque) throw new Error("un relevé de 90 000 caractères n'est pas borné");
  if (t.length > BUDGET_CONTEXTE_ASYNC) throw new Error(`borné à ${t.length}, au-delà du budget`);
  if (!t.includes("## Gates actifs dans cette session (R-44)")) throw new Error("les gates ont été retirés");
  if (!/Relevé TRONQUÉ par le hook lui-même/.test(t) || !/Section variable 29/.test(t.split("Relevé TRONQUÉ")[1])) throw new Error("les sections omises ne sont pas nommées");
  if (borner(tete, BUDGET_CONTEXTE_ASYNC, 2).tronque) throw new Error("un relevé court est borné à tort");
});

// ---- TF-1635 (c) (14/10/2026) : UN GESTE FAIT AVANT LA FIN DU RELEVÉ SE DÉCLARE ---------------
// Le relevé asynchrone peut arriver après le premier échange. Le hook relit la transcription de la
// session (chemin reçu sur son entrée) et déclare en tête les appels d'outil faits depuis son propre
// démarrage, avec une trace locale dans les métadonnées git du dépôt ouvert. Rouge : un appel ANTÉRIEUR
// au démarrage du relevé (session reprise) n'est pas déclaré ; une session sans geste ne reçoit rien.
if (veut(1635)) {
  const { gestesDansFenetre } = await import(new URL("./lib-gestes-avant-releve.mjs", import.meta.url));
  const P = mkdtempSync(join(tmpdir(), "ouverture-gestes-"));
  execFileSync("git", ["init", "-q"], { cwd: P });
  const tr = join(P, "transcript.jsonl");
  const entree = (ts, nom) => JSON.stringify({ type: "assistant", timestamp: new Date(ts).toISOString(), message: { content: [{ type: "tool_use", name: nom, input: {} }] } });
  // TF-1838 (17/10/2026) — LE GESTE TÉMOIN SE PLACE DANS LA FENÊTRE MESURÉE, PAS À UNE HEURE FIXE. Le témoin
  // était daté de t0 + 1 200 ms : quand le relevé rendait la main en moins de 1 300 ms, le cas était « non
  // probant » et la recette rougissait sans lien avec le code (2 passages sur 3 le 15/10). Le hook écrit dans
  // sa trace locale le début de sa fenêtre ; un essai non probant replace le témoin au milieu de la fenêtre
  // mesurée à l'essai précédent, 4 essais au plus. Le cas reste rouge si aucun essai ne tombe dans la fenêtre.
  const traceGestes = join(P, ".git", "digit-ai-gestes-avant-releve.jsonl");
  let decalage = 1200, sortie = "", probant = false, fenetre = "";
  for (let essai = 0; essai < 4 && !probant; essai++) {
    rmSync(traceGestes, { force: true });
    const t0 = Date.now();
    writeFileSync(tr, [entree(t0 - 60000, "Read"), entree(t0 + decalage, "Bash")].join(NL) + NL, "utf8");
    sortie = execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--pilot", PILOT, "--contexte-json"],
      { cwd: P, encoding: "utf8", timeout: delaiSousCharge(120000), input: JSON.stringify({ session_id: "s-test", transcript_path: tr }) });
    const fin = Date.now();
    let debut = t0;
    try { debut = Date.parse(JSON.parse(readFileSync(traceGestes, "utf8").trim().split(NL).pop()).debut_releve); } catch { /* trace absente : le cas le dira */ }
    probant = debut <= t0 + decalage && t0 + decalage <= fin - 50;
    fenetre = `fenêtre ${debut - t0} → ${fin - t0} ms, témoin à ${decalage} ms`;
    decalage = Math.max(1, Math.round((debut - t0) + (fin - debut) / 2));
  }
  const ctx = JSON.parse(sortie).hookSpecificOutput.additionalContext;
  check("TF-1635 (c) rouge → vert — un appel d'outil fait pendant le relevé est déclaré en tête, l'appel antérieur au relevé ne l'est pas", () => {
    if (!probant) throw new Error(`aucun des 4 essais n'a placé le geste témoin dans la fenêtre du relevé (${fenetre}) : cas non probant`);
    if (!/## Gestes faits AVANT la fin de ce relevé \(TF-1635\) : 1\b/.test(ctx)) throw new Error("le geste fait pendant le relevé n'est pas déclaré (ou l'appel antérieur est compté)");
    if (!/\(Bash\)/.test(ctx)) throw new Error("l'outil du geste n'est pas nommé");
    if (ctx.indexOf("Gestes faits AVANT") > ctx.indexOf("## Gates actifs")) throw new Error("la déclaration ne précède pas les gates");
  });
  check("TF-1635 (c) — la trace locale est écrite dans les métadonnées git du dépôt ouvert, rien de suivi", () => {
    const f = join(P, ".git", "digit-ai-gestes-avant-releve.jsonl");
    if (!existsSync(f) || !/"outil":"Bash"/.test(readFileSync(f, "utf8"))) throw new Error("trace locale absente");
  });
  check("TF-1635 (c) sens rouge — fenêtre sans geste : aucune déclaration ; transcription illisible : aucune erreur", () => {
    if (gestesDansFenetre(readFileSync(tr, "utf8"), Date.now() + 5000, Date.now() + 9000).length) throw new Error("un geste hors fenêtre est compté");
    if (gestesDansFenetre("pas du json\n{\"tool_use\":1}", 0, Date.now()).length) throw new Error("une ligne illisible produit un geste");
    if (/Gestes faits AVANT/.test(JSON.parse(sortieJson).hookSpecificOutput.additionalContext)) throw new Error("un relevé sans transcription déclare des gestes");
  });
}

// ---- TF-1829 (17/10/2026) : LE RÉSUMÉ R-47 AFFICHE LE PIRE CONSTAT, PAS LE PREMIER -------------
// L'ordre réel des constats d'oracle-conformite-projet, relevé sur un parc jetable le 17/10 : alias
// périmés (SANS_OBJET), hors histoire (SANS_OBJET), héritage (FAIL), secrets (PASS). Rouge : la lecture
// d'avant (le premier constat) rend « sans objet » ; vert : le FAIL d'héritage est affiché.
if (veut(1829)) {
  const { constatR47 } = await import(new URL("./lib-resume-r47.mjs", import.meta.url));
  const RELEVE = [
    { regle: "R-46", statut: "PASS", message: "autre règle" },
    { regle: "R-47", statut: "SANS_OBJET", message: "1 alias de transition PÉRIMÉ(S)" },
    { regle: "R-47", statut: "SANS_OBJET", message: "aucun artefact hors histoire" },
    { regle: "R-47", statut: "FAIL", message: "héritage du pilot non tenu — 5 absent(s)" },
    { regle: "R-47", statut: "PASS", message: "aucun secret sous forge" },
  ];
  check("TF-1829 rouge → vert — un « sans objet » placé avant ne cache plus le FAIL d'héritage", () => {
    const avant = RELEVE.find((x) => x.regle === "R-47");
    if (avant.statut !== "SANS_OBJET") throw new Error("la fixture ne reproduit plus le défaut d'avant");
    if (constatR47(RELEVE)?.statut !== "FAIL") throw new Error(`constat affiché : ${constatR47(RELEVE)?.statut}`);
  });
  check("TF-1829 — sans FAIL, « sans objet » prime sur « à jour » ; sans constat R-47, rien n'est inventé", () => {
    if (constatR47(RELEVE.filter((x) => x.statut !== "FAIL"))?.statut !== "SANS_OBJET") throw new Error("le sans objet n'est plus rendu");
    if (constatR47([{ regle: "R-47", statut: "PASS", message: "à jour" }])?.statut !== "PASS") throw new Error("un PASS seul n'est pas rendu");
    if (constatR47([{ regle: "R-46", statut: "FAIL" }]) !== null || constatR47(undefined) !== null) throw new Error("un constat est inventé");
  });
}

// ---- TF-1658 (14/10/2026) : LE SOCLE D'UN DÉPÔT TIERS JUGE LE TIERS À CHAQUE OUVERTURE --------
if (veut(1658)) {
  const T3 = mkdtempSync(join(tmpdir(), "ouverture-tiers-"));
  const tiers = join(T3, "tiers"), socle = join(T3, "socle");
  mkdirSync(tiers, { recursive: true }); mkdirSync(join(socle, "forge"), { recursive: true });
  const g = (...a) => execFileSync("git", ["-C", tiers, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8" });
  writeFileSync(join(tiers, "a.txt"), "x\n"); g("init", "-q"); g("add", "-A"); g("commit", "-q", "-m", "t");
  writeFileSync(join(socle, "forge", "DEPOT-TIERS.json"), JSON.stringify({ chemin: tiers, git: true, commit: g("rev-parse", "HEAD").trim(), porcelain_initial: [], releve_le: "2026-10-14T00:00:00Z" }), "utf8");
  const intact = joue(socle);
  writeFileSync(join(tiers, "ecrit.md"), "x\n");
  const ecrit = joue(socle);
  check("TF-1658 rouge → vert — à l'ouverture du socle, le dépôt du tiers est dit intact, puis en DÉFAUT dès qu'on y a écrit", () => {
    if (!/## Dépôt du tiers en lecture seule \(TF-1658\)\n- intact/.test(intact)) throw new Error("le tiers intact n'est pas dit");
    if (!/\*\*DÉFAUT — écriture sous le dépôt du tiers.*ecrit\.md/.test(ecrit)) throw new Error("l'écriture sous le tiers n'est pas vue à l'ouverture");
  });
}

// ---- TF-1642 (14/10/2026) : L'OUVERTURE D'UN PRODUIT MESURE SON PROPRE DÉPÔT CONTRE SON DISTANT --
if (veut(1642)) {
  const T4 = mkdtempSync(join(tmpdir(), "ouverture-fraicheur-"));
  const nu = join(T4, "d.git"), lue = join(T4, "produit"), autre = join(T4, "autre");
  const gx = (d, ...a) => execFileSync("git", ["-C", d, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  execFileSync("git", ["init", "-q", "--bare", "--initial-branch=main", nu]);
  execFileSync("git", ["clone", "-q", nu, lue], { stdio: "ignore" });
  writeFileSync(join(lue, "a.txt"), "x\n"); gx(lue, "add", "-A"); gx(lue, "commit", "-q", "-m", "v0"); gx(lue, "push", "-q", "origin", "main");
  execFileSync("git", ["clone", "-q", nu, autre], { stdio: "ignore" });
  writeFileSync(join(autre, "b.txt"), "y\n"); gx(autre, "add", "-A"); gx(autre, "commit", "-q", "-m", "v1"); gx(autre, "push", "-q", "origin", "main");
  const sortie = joue(lue);
  check("TF-1642 rouge — un produit en retard sur son distant le lit à l'ouverture, avec l'écart et le geste", () => {
    if (!/## Fraîcheur du dépôt de ce produit \(TF-1642\)\n- \*\*EN RETARD\*\* — .*1 commit\(s\) de retard/.test(sortie)) throw new Error("le retard du dépôt du produit n'est pas dit");
    if (!/fraicheur-depot\.mjs" <dépôt>/.test(sortie)) throw new Error("la sonde pour tout autre dépôt lu n'est pas nommée");
  });
  gx(lue, "pull", "-q", "--ff-only");
  check("TF-1642 vert — à jour après le tirage : aucune alerte", () => {
    const s = joue(lue);
    if (/\*\*EN RETARD\*\*/.test(s) || !/0 commit\(s\) de retard/.test(s)) throw new Error("alerte ou écart faux sur un dépôt à jour");
  });
}

// ---- TF-1676 (14/10/2026) : LA RÈGLE DES NOMS ATTEINT CHAQUE PRODUIT, SELON LA VISIBILITÉ MESURÉE --
if (veut(1676)) {
  const sansDistant = joue(mkdtempSync(join(tmpdir(), "ouverture-noms-")));
  check("TF-1676 — sans visibilité mesurable, la règle du 01/10 est dite et la mesure demandée avant toute pseudonymisation", () => {
    if (!/## Noms réels dans ce dépôt \(TF-1676\)\n- Visibilité NON mesurée/.test(sansDistant)) throw new Error("la règle des noms n'atteint pas le produit");
    if (!/Les dépôts privés peuvent conserver des données de type nom/.test(sansDistant)) throw new Error("la règle humaine n'est pas citée");
  });
  // TF-1955 (29/10/2026) : le produit « git local dès la naissance » n'a aucun remote ; `gh repo view` y répond « no git
  // remotes found ». Mesuré le 20/10 : « Visibilité NON mesurée » dans 30 des 55 sessions. Vert : un dépôt SANS remote
  // est dit LOCAL, une fois, sans demander une mesure impossible. Rouge : un dépôt AVEC un remote que gh ne sait pas lire
  // (hôte non GitHub) reste « NON mesurée » et nomme la cause rendue par gh.
  const localSeul = mkdtempSync(join(tmpdir(), "ouverture-noms-local-"));
  execFileSync("git", ["init", "-q"], { cwd: localSeul });
  const sLocal = joue(localSeul);
  check("TF-1955 — un dépôt sans remote est dit LOCAL (visibilité sans objet), et n'avertit plus d'une mesure manquée", () => {
    const l = (sLocal.split("## Noms réels dans ce dépôt (TF-1676)")[1] || "").split("\n## ")[0];
    if (!/Dépôt LOCAL, sans dépôt distant/.test(l)) throw new Error(`cas du dépôt local non dit : ${l.slice(0, 200)}`);
    if (/NON mesurée/.test(l)) throw new Error("l'avertissement « NON mesurée » persiste sur un dépôt qui n'a aucun remote");
    if (!/Les dépôts privés peuvent conserver des données de type nom/.test(l)) throw new Error("la règle humaine n'est plus citée");
  });
  const horsGithub = mkdtempSync(join(tmpdir(), "ouverture-noms-devops-"));
  execFileSync("git", ["init", "-q"], { cwd: horsGithub });
  execFileSync("git", ["remote", "add", "origin", "https://dev.azure.com/org/projet/_git/depot"], { cwd: horsGithub });
  const sDevops = joue(horsGithub);
  check("TF-1955 rouge — un remote que gh ne sait pas lire reste « NON mesurée » et nomme la cause", () => {
    const l = (sDevops.split("## Noms réels dans ce dépôt (TF-1676)")[1] || "").split("\n## ")[0];
    if (!/Visibilité NON mesurée \(`gh repo view --json visibility` sans réponse : [^)]{3,}\)/.test(l)) throw new Error(`mesure manquée non nommée : ${l.slice(0, 260)}`);
    if (/Dépôt LOCAL/.test(l)) throw new Error("un dépôt qui a un remote est dit local");
  });
  const ghOk = spawnSync("gh", ["auth", "status"], { encoding: "utf8", timeout: 15000 }).status === 0;
  if (!ghOk) console.log("[NON JOUÉ] 1 cas — TF-1676 visibilité mesurée : gh absent ou non authentifié sur ce poste");
  else {
    const P = mkdtempSync(join(tmpdir(), "ouverture-noms-public-"));
    execFileSync("git", ["init", "-q"], { cwd: P });
    execFileSync("git", ["remote", "add", "origin", "https://github.com/iguane39/digit-ai-factory.git"], { cwd: P });
    const s = joue(P);
    check("TF-1676 rouge — dépôt PUBLIC mesuré par gh : aucun nom réel n'y entre (la règle des dépôts privés ne s'y applique pas)", () => {
      if (!/Dépôt PUBLIC \(mesuré par gh\)/.test(s)) throw new Error(`visibilité non mesurée ou fausse : ${(s.split("Noms réels")[1] || "").slice(0, 200)}`);
    });
  }
}

// ---- TF-2048 (02/11/2026) : un rouge neuf de consommateur, laissé par une propagation, se relit à l'ouverture du pilot ----------------------
if (veut(2048)) {
  const dossier = mkdtempSync(join(tmpdir(), "ouverture-consommateurs-"));
  const trace = join(dossier, "consommateurs-rouges.jsonl");
  const ROUGE = { ts: "2026-10-21T08:00:00.000Z", evenement: "rouge-neuf", depot: "digit-ai-forge-design", regle: "C1", commande: "node oracles/self-test.mjs",
    skills: ["digit-ai-page-html"], extrait: "[FAIL] V23 contenu sous 75 % de la fenetre" };
  // Joué comme la session du pilot (sans --pilot) ou comme celle d'un produit (--pilot), la trace désignée par FORGE_TRACE_CONSOMMATEURS.
  // TF-2179 (05/11/2026) : le parc est JETABLE (FORGE_ROOT), comme dans le banc D-135 plus bas et dans les bancs TF-1521. Sans lui, l'ouverture du pilot
  // relevait l'héritage des produits RÉELS du poste : mesuré le 05/11/2026 sur 31 produits, `relever-heritage.mjs` prenait 92 s, l'ouverture entière
  // 107 à 132 s pour une borne de 120 s, donc ETIMEDOUT dès que d'autres agents jouaient en même temps ; joué seul, le cas passait. Ce banc ne juge
  // que la section des consommateurs : son verdict ne doit pas dépendre du nombre de produits du poste ni de sa charge.
  const parc = mkdtempSync(join(tmpdir(), "ouverture-consommateurs-parc-"));
  mkdirSync(join(parc, "produit-factice", "forge"), { recursive: true });
  writeFileSync(join(parc, "produit-factice", "forge", "ledger.jsonl"), "", "utf8");
  const durees = [];
  const jouerOuverture = (cwd, enProduit) => {
    const t0 = Date.now();
    try {
      return execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", ...(enProduit ? ["--pilot", PILOT] : [])],
        { cwd, encoding: "utf8", timeout: delaiSousCharge(120000), env: { ...process.env, FORGE_TRACE_CONSOMMATEURS: trace, FORGE_ROOT: parc } });
    } finally { if (!enProduit) durees.push(Date.now() - t0); }
  };
  const cwd = mkdtempSync(join(tmpdir(), "ouverture-consommateurs-cwd-"));
  const SECTION = "## Consommateurs des skills";
  check("TF-2048 vert — sans trace, l'ouverture du pilot ne dit rien des consommateurs", () => {
    if (jouerOuverture(cwd, false).includes(SECTION)) throw new Error("une trace absente fait parler l'ouverture");
  });
  writeFileSync(trace, JSON.stringify(ROUGE) + NL, "utf8");
  const pilote = jouerOuverture(cwd, false);
  check("TF-2048 rouge — un rouge neuf non levé est dit à l'ouverture du pilot : dépôt, commande, règle, remède", () => {
    const l = pilote.split(SECTION)[1] || "";
    if (!/1 rouge\(s\) neuf\(s\)/.test(pilote) || !/digit-ai-forge-design/.test(l) || !/node oracles\/self-test\.mjs/.test(l) || !/C1/.test(l) || !/--rejouer-consommateurs/.test(l))
      throw new Error(`section absente ou incomplète : ${l.slice(0, 300)}`);
  });
  check("TF-2048 — chez un produit (--pilot), l'ouverture ne le dit pas : il ne propage rien et ne peut pas réparer un consommateur", () => {
    if (jouerOuverture(cwd, true).includes(SECTION)) throw new Error("la section est imprimée chez un produit");
  });
  writeFileSync(trace, JSON.stringify(ROUGE) + NL + JSON.stringify({ ts: "2026-11-02T08:00:00.000Z", evenement: "leve", depot: "digit-ai-forge-design" }) + NL, "utf8");
  check("TF-2048 remède joué — le rouge levé par un rejeu ne revient plus à l'ouverture", () => {
    if (jouerOuverture(cwd, false).includes(SECTION)) throw new Error("un rouge levé est encore dit");
  });
  // TF-2179 : le sens rouge de l'isolement. Sur le parc réel du poste (31 produits le 05/11/2026) ce passage relevait 31 produits ; sur le parc jetable
  // il n'en relève qu'un. La durée de chaque passage est DITE dans le nom du cas, pas bornée plus bas que le délai de 120 s de l'appel : une borne
  // serrée remettrait le verdict sous la dépendance de la charge. Mesure avant : 107 à 132 s ; après : voir le nom du cas.
  let dit = "", panne = null;
  try { dit = jouerOuverture(cwd, false); } catch (e) { panne = e; }
  check(`TF-2179 — le cas ouvre le pilot sur son parc jetable (1 produit relevé, pas les produits réels du poste) : ${durees.length} passages du pilot, de ${Math.min(...durees)} à ${Math.max(...durees)} ms, délai 120 000 ms`, () => {
    if (panne) throw new Error(`l'ouverture du pilot n'a pas rendu la main : ${String(panne.message).slice(0, 160)}`);
    if (!/- 1 produit\(s\) relevé\(s\)/.test(dit)) throw new Error(`le relevé d'héritage ne porte pas le seul produit factice : ${(dit.split("## Héritage des produits")[1] || "section absente").slice(0, 200)}`);
  });
}

// ---- D-135 (a) du 02/11/2026 : le rejeu hebdomadaire part en arrière-plan, l'ouverture ne l'attend pas -------------------------------------
// Un dépôt FACTICE dont la vérification ATTEND qu'on la libère (fichier `liberer`) : si l'ouverture attendait le rejeu, elle ne rendrait pas la main.
// Table et trace sont jetables ; la vraie table (4 dépôts, 50 minutes au plus) n'est jamais jouée.
if (veut(135)) {
  const dormir = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  const attendreQue = (cond, ms) => { const fin = Date.now() + ms; while (Date.now() < fin) { if (cond()) return true; dormir(250); } return cond(); };
  const dossier = mkdtempSync(join(tmpdir(), "ouverture-rejeu-"));
  const racine = join(dossier, "forges");
  const depot = join(racine, "faux-depot-long");
  mkdirSync(depot, { recursive: true });
  // Un produit factice sous la racine : sans lui, le relevé d'héritage de l'ouverture est vide, et l'ouverture le JOURNALISE dans
  // `todo/HERITAGE-RELEVES.jsonl` (suivi par git) ; avec lui, le référentiel de pseudonymes absent de la recette empêche toute écriture.
  mkdirSync(join(racine, "produit-factice", "forge"), { recursive: true });
  writeFileSync(join(racine, "produit-factice", "forge", "ledger.jsonl"), "", "utf8");
  const liberer = join(dossier, "liberer");
  // TF-2234 (06/11/2026) : le factice doit survivre aux 3 ouvertures jouées avant sa libération. À 120 s, il mourait sous la charge
  // (une ouverture à 96 s le 06/11) : la vérification coupée n'écrivait aucun rouge, et 2 cas tombaient avec le minutage.
  // Sa vie se dérive du délai d'une ouverture : seule une ouverture coupée, qui échoue sous son propre nom, peut encore l'épuiser.
  const DELAI_OUVERTURE = 240000;
  const VIE_FACTICE = 3 * DELAI_OUVERTURE + 60000;
  writeFileSync(join(depot, "attendre.mjs"), [
    'import { existsSync } from "node:fs";',
    `const L = ${JSON.stringify(liberer)};`,
    `const fin = Date.now() + ${VIE_FACTICE};`,
    "while (!existsSync(L) && Date.now() < fin) await new Promise((r) => setTimeout(r, 200));",
    'console.log(existsSync(L) ? "[FAIL] rouge-du-rejeu-factice" : "[FAIL] jamais-libere");',
    "process.exit(1);",
  ].join(NL) + NL, "utf8");
  const tablePath = join(dossier, "table-recette.json");
  writeFileSync(tablePath, JSON.stringify({ mesure_le: "2026-11-02", consommateurs: [{ depot: "faux-depot-long", skills: ["digit-ai-page-html"],
    verification: { commande: ["node", "attendre.mjs"], delai_ms: VIE_FACTICE, extracteur: { nom: "banc", motif: "^\\s*\\[FAIL\\]\\s+(.+?)\\s*$", drapeaux: "gm", groupe: 1 } } }] }), "utf8");
  const trace = join(dossier, "consommateurs-rouges.jsonl");
  const etatPath = join(dossier, "rejeu-hebdomadaire.json");
  const verrouPath = join(dossier, "rejeu-hebdomadaire.verrou");
  const cwd = mkdtempSync(join(tmpdir(), "ouverture-rejeu-cwd-"));
  const SECTION = "## Rejeu hebdomadaire des consommateurs des skills";
  const lire = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
  const base = { ...process.env, FORGE_SANS_OBSERVATION: "1", FORGE_ROOT: racine, FORGE_TRACE_CONSOMMATEURS: trace, FORGE_TABLE_CONSOMMATEURS: tablePath };
  // `undefined` retire la variable du processus lancé : c'est ce qui rétablit le lancement.
  const jouerRejeu = (extra = {}, enProduit = false) => {
    const t0 = Date.now();
    const out = execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", ...(enProduit ? ["--pilot", PILOT] : [])],
      { cwd, encoding: "utf8", timeout: DELAI_OUVERTURE, env: { ...base, ...extra } });
    return { out, ms: Date.now() - t0 };
  };
  const LANCE = { FORGE_SANS_REJEU_HEBDOMADAIRE: undefined };
  try {
    const temoin = jouerRejeu({ FORGE_SANS_REJEU_HEBDOMADAIRE: "1" });
    check("D-135 vert — FORGE_SANS_REJEU_HEBDOMADAIRE=1 : l'ouverture ne lance rien, n'écrit ni état ni verrou", () => {
      if (temoin.out.includes(SECTION) || existsSync(etatPath) || existsSync(verrouPath)) throw new Error("un rejeu est lancé malgré le drapeau");
    });

    const lance = jouerRejeu(LANCE);
    const apresRetour = attendreQue(() => lire(etatPath)?.dernier?.statut === "en-cours", 30000);
    const verrou = lire(verrouPath);
    check("D-135 rouge — l'ouverture lance le rejeu, REND LA MAIN sans l'attendre, et le rejeu lui survit (processus détaché, toujours en cours, verrou posé)", () => {
      if (!lance.out.includes(SECTION) || !/lancé en arrière-plan/.test(lance.out)) throw new Error(`lancement non dit : ${lance.out.slice(lance.out.indexOf("## Rejeu") >= 0 ? lance.out.indexOf("## Rejeu") : 0, 400)}`);
      if (existsSync(liberer)) throw new Error("le dépôt factice a été libéré avant la fin de l'ouverture");
      if (!apresRetour || !verrou) throw new Error(`après le retour du hook : état ${JSON.stringify(lire(etatPath))}, verrou ${JSON.stringify(verrou)}`);
      try { process.kill(verrou.pid, 0); } catch { throw new Error(`le processus du rejeu (pid ${verrou.pid}) n'a pas survécu à l'ouverture`); }
    });
    const msLancement = Number((/lancement en (\d+) ms/.exec(lance.out) || [])[1]);
    console.log(`  (mesure : ouverture sans lancement ${temoin.ms} ms, avec lancement ${lance.ms} ms, appel de lancement ${msLancement} ms ; rejeu factice encore en cours au retour)`);
    // TF-2234 (06/11/2026) : l'écart entre 2 ouvertures complètes mesurait la charge du poste, pas le lancement (96 s contre 47 s un passage,
    // 40 s contre 52 s le suivant). Le coût se juge sur l'appel de lancement, mesuré dans le hook ; l'attente, sur le factice encore bloqué au retour
    // (cas rouge ci-dessus) : une ouverture qui l'attendrait serait coupée à DELAI_OUVERTURE, bien avant VIE_FACTICE. L'écart reste affiché, pour information.
    check("D-135 — 0 seconde de plus à attendre : le lancement lui-même prend moins de 2 s, mesuré dans le hook", () => {
      const borne = borneSousCharge(2000, facteurDeCharge());   // TF-2511
      if (!(msLancement < borne)) throw new Error(`appel de lancement : ${msLancement} ms, au-delà de ${borne} ms (2 s au repos, à l'échelle de la charge mesurée par le témoin)`);
    });

    const debut = lire(etatPath)?.dernier?.debut;
    const seconde = jouerRejeu(LANCE);
    check("D-135 — une seconde ouverture pendant que le rejeu tourne n'en lance pas un autre", () => {
      if (/lancé en arrière-plan/.test(seconde.out)) throw new Error("un second rejeu est lancé");
      if (lire(etatPath)?.dernier?.debut !== debut) throw new Error(`l'état a été réécrit : ${debut} -> ${lire(etatPath)?.dernier?.debut}`);
    });

    const autre = mkdtempSync(join(tmpdir(), "ouverture-rejeu-produit-"));
    const produit = jouerRejeu({ ...LANCE, FORGE_TRACE_CONSOMMATEURS: join(autre, "consommateurs-rouges.jsonl") }, true);
    check("D-135 — chez un produit (--pilot), l'ouverture ne lance aucun rejeu et n'écrit aucun état", () => {
      if (produit.out.includes(SECTION) || existsSync(join(autre, "rejeu-hebdomadaire.json")) || existsSync(join(autre, "rejeu-hebdomadaire.verrou"))) throw new Error("un rejeu part d'un produit");
    });
    rmSync(autre, { recursive: true, force: true });

    writeFileSync(liberer, "1", "utf8");
    console.log(`  (mesure : rejeu factice libéré ${Date.now() - Date.parse(debut)} ms après son début, pour une vie de ${VIE_FACTICE} ms ; 120 000 ms avant TF-2234)`);
    const fini =attendreQue(() => lire(etatPath)?.dernier?.statut === "termine", 60000);
    const etat = lire(etatPath);
    check("D-135 — le rejeu écrit sa date de début et de fin à côté de la trace, retire son verrou, et trace le rouge neuf avec son origine", () => {
      if (!fini) throw new Error(`rejeu non terminé : ${JSON.stringify(etat)}`);
      const c = etat.dernier_complet;
      if (!c || !c.debut || !c.fin || Date.parse(c.fin) < Date.parse(c.debut) || c.debut !== debut) throw new Error(`dates : ${JSON.stringify(c)}`);
      if (existsSync(verrouPath)) throw new Error("verrou non retiré");
      const l = readFileSync(trace, "utf8").trim().split(NL).map((x) => JSON.parse(x));
      if (l.length !== 1 || l[0].evenement !== "rouge-neuf" || l[0].depot !== "faux-depot-long" || l[0].origine !== "rejeu-hebdomadaire") throw new Error(`trace : ${JSON.stringify(l)}`);
    });

    const suivante = jouerRejeu(LANCE);
    check("D-135 — à l'ouverture suivante, le rouge s'affiche (ligne « rejeu hebdomadaire », dépôt, commande, remède) et rien n'est relancé avant 7 jours", () => {
      const l = suivante.out.split("## Consommateurs des skills")[1] || "";
      if (!/rejeu hebdomadaire/.test(l) || !/faux-depot-long/.test(l) || !/node attendre\.mjs/.test(l) || !/--rejouer-consommateurs/.test(l)) throw new Error(`rouge non affiché : ${suivante.out.slice(0, 300)}`);
      if (/lancé en arrière-plan/.test(suivante.out) || lire(etatPath)?.dernier?.debut !== debut) throw new Error("un rejeu a été relancé à moins de 7 jours");
    });
  } finally {
    try { writeFileSync(liberer, "1", "utf8"); } catch { /* le dossier jetable est déjà retiré */ }
    attendreQue(() => !existsSync(verrouPath), 15000);
    rmSync(dossier, { recursive: true, force: true });
    rmSync(cwd, { recursive: true, force: true });
  }
}

// ---- TF-2067 : le journal d'héritage de l'ouverture du pilot s'écrit où FORGE_HERITAGE_RELEVES le désigne ------------------------------------
// Tables de pseudonymes PRÉSENTES et produit connu d'elles : c'est le cas où l'ouverture journalise, donc le seul où une recette écrirait
// `todo/HERITAGE-RELEVES.jsonl` si le déroutement manquait (jusqu'ici seule l'absence des tables l'en empêchait). Tout est jetable.
if (veut(2067)) {
  const dossier = mkdtempSync(join(tmpdir(), "ouverture-heritage-"));
  const racine = join(dossier, "parc");
  mkdirSync(join(racine, "produit-banc-heritage", "forge"), { recursive: true });
  writeFileSync(join(racine, "produit-banc-heritage", "forge", "ledger.jsonl"), "", "utf8");
  writeFileSync(join(dossier, "_noms-interdits.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
  writeFileSync(join(dossier, "_produits-pseudonymes.json"), JSON.stringify({ produits: { "produit-banc-heritage": "Produit-77" } }), "utf8");
  const journal = join(dossier, "HERITAGE-RELEVES.jsonl");
  const cwd = mkdtempSync(join(tmpdir(), "ouverture-heritage-cwd-"));
  const jouer = (extra) => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme"],
    { cwd, encoding: "utf8", timeout: delaiSousCharge(120000), env: { ...process.env, FORGE_ROOT: racine, FORGE_NOMS_INTERDITS: join(dossier, "_noms-interdits.json"),
      FORGE_PRODUITS_PSEUDO: join(dossier, "_produits-pseudonymes.json"), FORGE_HERITAGE_RELEVES: journal, ...extra } });
  try {
    const sortie = jouer({});
    check("TF-2067 vert — avec des tables présentes, le relevé d'héritage est journalisé dans le fichier désigné, sous pseudonyme", () => {
      if (!existsSync(journal)) throw new Error(`rien écrit dans ${journal} (sortie : ${sortie.slice(0, 200)})`);
      const lignes = readFileSync(journal, "utf8").split(NL).filter(Boolean);
      if (lignes.length !== 1) throw new Error(`${lignes.length} lignes écrites, une attendue`);
      const noms = (JSON.parse(lignes[0]).produits || []).map((p) => p.produit);
      if (!noms.includes("Produit-77")) throw new Error(`pseudonyme absent du journal : ${noms.join(", ")}`);
      if (/produit-banc-heritage/.test(lignes[0])) throw new Error("le nom réel du produit est entré dans le journal");
    });
  } finally {
    rmSync(dossier, { recursive: true, force: true });
    rmSync(cwd, { recursive: true, force: true });
  }
}

veut(2335);
// ---- TF-2335 (10/11/2026, RP-12 de Produit-84) : le remède prescrit à une collision d'indice est une commande qui MARCHE chez le produit.
// Le message disait `node scripts/allouer-indice.mjs`, chemin relatif : chez un produit, ce script n'existe pas (il vit au pilot) et la
// commande prescrite échouait. Le banc joue le hook d'un produit sans `scripts\` contre un pilot factice dont le contrôle d'unicité rend une
// collision, puis EXÉCUTE la commande imprimée (le remède qu'on recommande se joue, TF-1013) : elle doit trouver son script.
if (sectionVoulue) {
  const pilotFactice = mkdtempSync(join(tmpdir(), "ouverture-indice-pilot-"));
  const produitSansScripts = mkdtempSync(join(tmpdir(), "ouverture-indice-produit-"));
  try {
    const git = (...a) => execFileSync("git", ["-C", pilotFactice, "-c", "user.email=banc@example.invalid", "-c", "user.name=banc", ...a], { encoding: "utf8" });
    git("init", "-q"); git("commit", "-q", "--allow-empty", "-m", "banc");
    mkdirSync(join(pilotFactice, "scripts"), { recursive: true });
    writeFileSync(join(pilotFactice, "scripts", "indices-uniques.mjs"), "console.log(JSON.stringify({ collisions: [{ ou: 'output/x.md', message: \"indice 'a' partagé : l'indice existe déjà\" }], passif: 0 }));" + NL);
    writeFileSync(join(pilotFactice, "scripts", "allouer-indice.mjs"), "console.log('allouer-indice-joue');" + NL);
    const sortie = execFileSync(process.execPath, [hook, "--sans-readme", "--pilot", pilotFactice], { cwd: produitSansScripts, encoding: "utf8", timeout: delaiSousCharge(120000) });
    const m = sortie.match(/réindexer le plus récent : `(node [^`]+)`/);
    check("TF-2335 vert — la collision d'indice est dite chez le produit avec une commande de réindexation", () => {
      if (!m) throw new Error(`commande de réindexation absente de la sortie : ${sortie.slice(0, 300)}`);
    });
    check("TF-2335 vert — la commande imprimée porte le chemin RÉSOLU du pilot, pas un chemin relatif", () => {
      const attendu = join(pilotFactice, "scripts", "allouer-indice.mjs").replace(/\\/g, "/");
      if (!m || !m[1].includes(attendu)) throw new Error(`chemin du pilot absent de « ${m && m[1]} » (attendu : ${attendu})`);
    });
    check("TF-2335 vert — la commande imprimée, jouée depuis le produit, trouve son script", () => {
      if (!m) throw new Error("pas de commande à jouer");
      const r = spawnSync(m[1], { cwd: produitSansScripts, shell: true, encoding: "utf8" });
      if (r.status !== 0 || !/allouer-indice-joue/.test(r.stdout || "")) throw new Error(`commande imprimée en échec (exit ${r.status}) : ${(r.stderr || "").slice(0, 200)}`);
    });
    check("TF-2335 rouge — l'ancien message (chemin relatif) échoue chez un produit sans scripts\\", () => {
      const r = spawnSync("node scripts/allouer-indice.mjs", { cwd: produitSansScripts, shell: true, encoding: "utf8" });
      if (r.status === 0) throw new Error("la commande relative réussit chez le produit : le banc ne distingue plus l'ancien message du nouveau");
    });
  } finally {
    rmSync(pilotFactice, { recursive: true, force: true });
    rmSync(produitSansScripts, { recursive: true, force: true });
  }
}

// ---- TF-2442 (12/11/2026, RP-26) : un workflow hébergé en échec 2 fois de suite se dit à l'ouverture du pilot, relevé en arrière-plan -------------------
// Le fait : le workflow de programmation des publications d'un produit a échoué 5 fois de suite du 03 au 12/11, 9 jours sans alerte. Un produit FICTIF (vrai
// dépôt git, remote GitHub fictif jamais interrogé, un workflow local) et un FAUX `gh` qui ATTEND qu'on le libère : si l'ouverture attendait le relevé, elle ne
// rendrait pas la main. Aucun réseau, aucun nom réel ; la trace et le parc sont jetables.
if (veut(2442)) {
  const dormir = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  const attendreQue = (cond, ms) => { const fin = Date.now() + ms; while (Date.now() < fin) { if (cond()) return true; dormir(250); } return cond(); };
  const dossier = mkdtempSync(join(tmpdir(), "ouverture-workflows-"));
  const racine = join(dossier, "parc");
  const produit = join(racine, "produit-fictif-a");
  mkdirSync(join(produit, "forge"), { recursive: true });
  writeFileSync(join(produit, "forge", "ledger.jsonl"), "", "utf8");
  mkdirSync(join(produit, ".github", "workflows"), { recursive: true });
  writeFileSync(join(produit, ".github", "workflows", "programmer.yml"), "name: programmer" + NL, "utf8");
  spawnSync("git", ["init", "-q"], { cwd: produit });
  spawnSync("git", ["remote", "add", "origin", "https://github.com/acme-fictif/depot-fictif.git"], { cwd: produit });
  const liberer = join(dossier, "liberer"), appels = join(dossier, "appels-gh.txt"), trace = join(dossier, "workflows-heberges.json");
  const DELAI_OUVERTURE = 240000;
  const VIE_FACTICE = 3 * DELAI_OUVERTURE + 60000;
  const runsFaux = [1, 2, 3, 4, 5].map((n) => ({ databaseId: n, workflowName: "programmer", status: "completed", conclusion: "failure", createdAt: `2026-11-0${n + 3}T06:00:00Z`, url: `https://exemple.invalid/runs/${n}` }));
  const ghFaux = join(dossier, "gh-faux.mjs");
  writeFileSync(ghFaux, [
    'import { existsSync, appendFileSync } from "node:fs";',
    `appendFileSync(${JSON.stringify(appels)}, process.argv.slice(2).join(" ") + ${JSON.stringify(NL)});`,
    `const L = ${JSON.stringify(liberer)}; const fin = Date.now() + ${VIE_FACTICE};`,
    "while (!existsSync(L) && Date.now() < fin) await new Promise((r) => setTimeout(r, 200));",
    `console.log(${JSON.stringify(JSON.stringify(runsFaux))});`,
  ].join(NL) + NL, "utf8");
  const cwd = mkdtempSync(join(tmpdir(), "ouverture-workflows-cwd-"));
  const SECTION = "## Workflows hébergés des produits";
  const lire = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
  const base = { ...process.env, FORGE_SANS_OBSERVATION: "1", FORGE_ROOT: racine, FORGE_TRACE_WORKFLOWS: trace, FORGE_GH_SCRIPT: ghFaux, FORGE_DELAI_GH_MS: String(VIE_FACTICE + 60000) };
  const LANCE = { FORGE_SANS_RELEVE_WORKFLOWS: undefined };   // `undefined` retire la variable du processus lancé : c'est ce qui rétablit le lancement
  const jouer = (extra = {}, enProduit = false) => {
    const t0 = Date.now();
    const out = execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", ...(enProduit ? ["--pilot", PILOT] : [])],
      { cwd, encoding: "utf8", timeout: DELAI_OUVERTURE, env: { ...base, ...extra } });
    return { out, ms: Date.now() - t0 };
  };
  try {
    const temoin = jouer({ FORGE_SANS_RELEVE_WORKFLOWS: "1" });
    check("TF-2442 vert — FORGE_SANS_RELEVE_WORKFLOWS=1 : l'ouverture ne lance rien et ne dit rien des workflows", () => {
      if (temoin.out.includes(SECTION) || existsSync(trace) || existsSync(`${trace}.verrou`) || existsSync(appels)) throw new Error("un relevé est lancé malgré le drapeau");
    });

    const premiere = jouer(LANCE);
    const verrouPose = attendreQue(() => lire(`${trace}.verrou`) !== null, 30000);
    const verrou = lire(`${trace}.verrou`);
    check("TF-2442 rouge — l'ouverture lance le relevé, REND LA MAIN sans l'attendre, et le relevé lui survit (processus détaché, verrou posé, gh encore bloqué)", () => {
      if (!premiere.out.includes(SECTION) || !/relevé relancé en arrière-plan/.test(premiere.out) || !/aucun relevé encore/.test(premiere.out)) throw new Error(`lancement non dit : ${premiere.out.slice(Math.max(0, premiere.out.indexOf("## Workflows")), 500)}`);
      if (existsSync(liberer)) throw new Error("le faux gh a été libéré avant la fin de l'ouverture");
      if (!verrouPose || !verrou) throw new Error(`après le retour du hook : verrou ${JSON.stringify(verrou)}`);
      try { process.kill(verrou.pid, 0); } catch { throw new Error(`le processus du relevé (pid ${verrou.pid}) n'a pas survécu à l'ouverture`); }
      if (existsSync(trace)) throw new Error("la trace existe avant que gh ait répondu : l'ouverture a attendu le relevé");
    });
    const msLancement = Number((/lancement en (\d+) ms/.exec(premiere.out) || [])[1]);
    console.log(`  (mesure : ouverture sans lancement ${temoin.ms} ms, avec lancement ${premiere.ms} ms, appel de lancement ${msLancement} ms ; faux gh encore bloqué au retour)`);
    check("TF-2442 — le hook reste synchrone et court : le lancement lui-même prend moins de 2 s, mesuré dans le hook (la coupure est à 60 s, la borne du hook à 45 s)", () => {
      const borne = borneSousCharge(2000, facteurDeCharge());   // TF-2511
      if (!(msLancement < borne)) throw new Error(`appel de lancement : ${msLancement} ms, au-delà de ${borne} ms (2 s au repos, à l'échelle de la charge mesurée par le témoin)`);
    });

    const pendant = jouer(LANCE);
    check("TF-2442 — une seconde ouverture pendant que le relevé tourne n'en lance pas un autre", () => {
      if (/relevé relancé en arrière-plan/.test(pendant.out)) throw new Error("un second relevé est lancé");
      if ((readFileSync(appels, "utf8").match(/\n/g) || []).length !== 1) throw new Error(`gh appelé ${(readFileSync(appels, "utf8").match(/\n/g) || []).length} fois`);
    });

    const autre = mkdtempSync(join(tmpdir(), "ouverture-workflows-produit-"));
    const enProduit = jouer({ ...LANCE, FORGE_TRACE_WORKFLOWS: join(autre, "t.json") }, true);
    check("TF-2442 — chez un produit (--pilot), l'ouverture ne lance aucun relevé et n'écrit rien", () => {
      if (enProduit.out.includes(SECTION) || existsSync(join(autre, "t.json")) || existsSync(join(autre, "t.json.verrou"))) throw new Error("un relevé part d'un produit");
    });
    rmSync(autre, { recursive: true, force: true });

    writeFileSync(liberer, "1", "utf8");
    const fini = attendreQue(() => lire(trace) !== null && !existsSync(`${trace}.verrou`), 60000);
    check("TF-2442 — le relevé écrit sa trace (produit, workflow, 5 échecs de suite), retire son verrou, et n'a lancé que `gh run list`", () => {
      const t = lire(trace);
      if (!fini || !t) throw new Error(`relevé non terminé : trace ${JSON.stringify(t)}`);
      const e = t.produits?.[0]?.en_echec?.[0];
      if (t.produits.length !== 1 || t.produits[0].produit !== "produit-fictif-a" || e?.workflow !== "programmer" || e?.consecutifs !== 5) throw new Error(`trace : ${JSON.stringify(t.produits)}`);
      const l = readFileSync(appels, "utf8").split(NL).filter(Boolean);
      if (l.length !== 1 || !/^run list --repo acme-fictif\/depot-fictif /.test(l[0])) throw new Error(`appels à gh : ${JSON.stringify(l)}`);
    });

    const suivante = jouer(LANCE);
    check("TF-2442 rouge — à l'ouverture suivante, le workflow en échec est NOMMÉ (produit, workflow, 5 fois de suite, depuis le 04/11, adresse) et rien n'est relancé avant 60 min", () => {
      const l = suivante.out.split(SECTION)[1] || "";
      if (!/produit-fictif-a/.test(l) || !/`programmer` en échec 5 fois de suite/.test(l) || !/depuis le 2026-11-04/.test(l) || !/exemple\.invalid\/runs\/5/.test(l) || !/1 en échec/.test(l)) throw new Error(`échec non affiché : ${suivante.out.slice(0, 400)}`);
      if (/relevé relancé en arrière-plan/.test(suivante.out) || (readFileSync(appels, "utf8").match(/\n/g) || []).length !== 1) throw new Error("un relevé a été relancé à moins de 60 min");
    });
  } finally {
    try { writeFileSync(liberer, "1", "utf8"); } catch { /* le dossier jetable est déjà retiré */ }
    attendreQue(() => !existsSync(`${trace}.verrou`), 15000);
    rmSync(dossier, { recursive: true, force: true });
    rmSync(cwd, { recursive: true, force: true });
  }
}

// ---- TF-2511 (14/11/2026) : LES BORNES DE DURÉE SE LISENT CONTRE UNE MESURE TÉMOIN ------------------------------------------------------------------------------------------
// Sens rouge : au repos (témoin à 40 ms, facteur 1), un relevé de 23 s dépasse sa borne de 20 s, et un hook réellement ralenti, à poste calme, reste refusé. Sens vert : sous une charge qui multiplie le
// témoin par 4 (160 ms), la même durée de 23 s tient sous la borne de 80 s — la charge seule ne rougit plus. Le témoin mesuré est un nombre fini et positif, et le facteur ne descend jamais sous 1.
if (veut(2511)) {
  check("TF-2511 rouge — au repos (témoin à 40 ms), un relevé de 23 s reste refusé : la borne de 20 s tient, le facteur ne descend pas sous 1 même pour un témoin plus rapide", () => {
    if (!(23000 > borneSousCharge(20000, facteurDeCharge(40)))) throw new Error("23 s passent sous la borne de 20 s à poste calme");
    if (facteurDeCharge(10) !== 1 || borneSousCharge(20000, facteurDeCharge(10)) !== 20000) throw new Error("un témoin plus rapide que le repos desserre la borne");
  });
  check("TF-2511 vert — sous une charge qui porte le témoin à 160 ms (facteur 4), 23 s tiennent sous la borne de 80 s : la charge seule ne rougit plus", () => {
    const b = borneSousCharge(20000, facteurDeCharge(160));
    if (b !== 80000 || !(23000 <= b)) throw new Error(`borne ${b} ms`);
  });
  check(`TF-2511 — le témoin mesuré ici est un nombre fini et positif (facteur de charge ${facteurDeCharge().toFixed(2)}, repos ${TEMOIN_REPOS_MS} ms)`, () => {
    const t = mesurerTemoinMs(3);
    if (!Number.isFinite(t) || !(t > 0) || !Number.isFinite(facteurDeCharge())) throw new Error(`témoin ${t}`);
  });
}

if (filtre.actif) { const c = conclureFiltre("hook-ouverture", filtre, fail ? [`${fail} contrôle(s) en échec (lignes [FAIL] ci-dessus)`] : []); (c.code === 0 ? console.log : console.error)(c.ligne); process.exit(c.code); }
console.log(`${NL}Recette hook d'ouverture (.env local, TF-0869 ; consommateurs, TF-2048 ; rejeu hebdomadaire, D-135 ; journal d'héritage, TF-2067 ; workflows hébergés en échec, TF-2442) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
