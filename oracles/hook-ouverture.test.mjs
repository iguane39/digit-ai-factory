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

check("TF-1214 — la boîte d'entrée dit le POSTE qui juge : un dépôt d'un autre poste n'y est pas visible", () => {
  if (!sortieOuverturePilot.includes(`jugée sur le poste **${hostname()}**`))
    throw new Error("la section « Boîte d'entrée des retours » ne nomme pas le poste : " + (sortieOuverturePilot.split("Boîte d'entrée des retours")[1] || "(section absente)").slice(0, 300));
  if (!/AUTRE poste n'y est pas visible/.test(sortieOuverturePilot)) throw new Error("la limite (autre poste) n'est pas dite");
});
// D-23 (a) du 18/10/2026 — l'ouverture du pilot affiche, dans « Flotte d'agents », les relectures d'intention de l'essai et dit
// si le seuil d'arrêt (plus de 4 000 000 de jetons de relecture par jour, D-25 du 18/10/2026) est franchi. Transcriptions SYNTHÉTIQUES d'un profil
// jetable : ni le vrai poste (USERPROFILE/HOME vidés), ni le vrai relevé.
{
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
  const ouvrirAvec = (profil) => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme"],
    { cwd: PILOT, encoding: "utf8", timeout: 120000, env: { ...process.env, FORGE_ROOT: racineParcTest, CLAUDE_CONFIG_DIR: profil, USERPROFILE: maisonVide, HOME: maisonVide } });
  const sortieTenu = ouvrirAvec(profilRelecture("tenu", 2)), sortieFranchi = ouvrirAvec(profilRelecture("franchi", 3));
  check("D-23 vert — l'ouverture du pilot affiche les relectures d'intention (2 relectures, 2 800 460 jetons) et un seuil TENU", () => {
    if (!/Flotte d'agents/.test(sortieTenu)) throw new Error("section « Flotte d'agents » absente");
    if (!/relectures d'intention \(essai du 2026-10-18 au 2026-11-01, revue le 2026-11-08.*2 relecture\(s\), 2 800 460 jetons.*seuil de 4 000 000 jetons par jour tenu/.test(sortieTenu))
      throw new Error((sortieTenu.match(/relectures d'intention[^\n]*/) || ["ligne absente"])[0]);
    if (/FRANCHI/.test(sortieTenu)) throw new Error("seuil dit franchi à 2 800 460 jetons");
  });
  check("D-23 rouge — plus de 4 000 000 de jetons de relecture en un jour (3 relectures, 4 200 690) : l'ouverture dit FRANCHI et demande l'arrêt", () => {
    if (!/3 relecture\(s\), 4 200 690 jetons.*\*\*FRANCHI : arrêter l'essai et demander à l'humain\*\*/.test(sortieFranchi))
      throw new Error((sortieFranchi.match(/relectures d'intention[^\n]*/) || ["ligne absente"])[0]);
  });
}
// TF-1301 — l'ouverture du pilot publie le stock d'items ouverts sans classe (une mesure, jamais un blocage).
check("TF-1301 — l'ouverture du pilot publie le stock d'items ouverts sans classe, par statut", () => {
  if (!/## Items ouverts sans classe \(TF-1301/.test(sortieOuverturePilot)) throw new Error("section absente de l'ouverture du pilot");
  if (!/item\(s\) ouvert\(s\) sans classe|aucun item ouvert sans classe/.test(sortieOuverturePilot)) throw new Error("ni compte ni constat d'absence de stock");
});
// TF-1576 — l'annonce des README dit l'état MESURÉ des crochets du projet ouvert.
{
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

// ---- 13/10/2026 : LA SORTIE JSON DU MODE ASYNCHRONE ------------------------------------------
//
// Le hook est déclaré `async` (l'extension VS Code coupe à 60 s une initialisation que ses gestes
// réseau dépassaient). Mesuré sur le CLI 2.1.296 : en `async`, le texte brut n'atteint JAMAIS le
// contexte de l'assistant, la forme `hookSpecificOutput.additionalContext` l'atteint. Le contrat :
// sous `--contexte-json`, la sortie est UN objet JSON valide, l'événement est SessionStart, et le
// contexte porte TOUT le relevé texte — rien de perdu au passage — précédé de l'en-tête qui dit
// l'asynchronie. Sens rouge : une ligne du relevé absente du contexte, ou une sortie non JSON.
const sortieJson = execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--contexte-json"],
  { cwd: PILOT, encoding: "utf8", timeout: 120000, env: { ...process.env, FORGE_ROOT: racineParcTest } });

check("--contexte-json : la sortie est UN objet JSON SessionStart, sans texte autour", () => {
  let j;
  try { j = JSON.parse(sortieJson); } catch { throw new Error("sortie non JSON : " + sortieJson.slice(0, 200)); }
  const h = j && j.hookSpecificOutput;
  if (!h || h.hookEventName !== "SessionStart") throw new Error("hookSpecificOutput.hookEventName ≠ SessionStart");
  if (typeof h.additionalContext !== "string" || !h.additionalContext) throw new Error("additionalContext absent ou vide");
});

check("--contexte-json : le contexte porte TOUT le relevé texte, et l'en-tête d'asynchronie", () => {
  // Deux lancements successifs diffèrent par construction sur DEUX valeurs seulement : l'horodatage
  // du relevé précédent (le premier lancement l'a écrit) et une durée en millisecondes. Elles sont
  // neutralisées, et rien d'autre : toute autre différence reste une perte.
  const neutre = (t) => t.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g, "<horodatage>").replace(/\ben \d+ ms\b/g, "en <durée> ms");
  const ctx = neutre(JSON.parse(sortieJson).hookSpecificOutput.additionalContext);
  const manquantes = neutre(sortieOuverturePilot).split(NL).map((l) => l.trimEnd()).filter(Boolean).filter((l) => !ctx.includes(l));
  if (manquantes.length) throw new Error(`${manquantes.length} ligne(s) du relevé absente(s) du contexte, dont : ${manquantes[0].slice(0, 120)}`);
  if (!/hook SessionStart asynchrone/.test(ctx)) throw new Error("l'en-tête qui dit l'asynchronie manque");
});

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
  if (duree > 20000) throw new Error(`rendu en ${duree} ms, au-delà de 20 s`);
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

// ---- TF-1755 (15/10/2026) : TOUTE ENTRÉE DU GABARIT QUI MANQUE AU PRODUIT S'Y AJOUTE À L'OUVERTURE --
// Mesuré le 15/10 sur 21 produits : publication-hebergee câblé chez 2, droits-accordes chez 2. Vert : un
// produit qui porte le lanceur reçoit chaque entrée absente du gabarit, sans perdre ses hooks, ses
// permissions ni ses délais, sans doublon, et une exclusion déclarée est respectée. Rouge : un produit
// sans lanceur n'est pas touché ; une seconde passe n'ajoute rien.
const { fusionnerHooksDuGabarit } = await import(new URL("./lib-ouverture-async.mjs", import.meta.url));
const GABARIT_SETTINGS = join(PILOT, "gabarits", "settings-produit.json");
const nomsDe = (j) => Object.values(j.hooks || {}).flat().flatMap((g) => g.hooks || [])
  .map((h) => (String(h.command).match(/forge\/hooks\/factory\.mjs\s+([\w-]+)/) || [])[1]).filter(Boolean);
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
    .map((h) => (String(h.command || "").match(/factory\.mjs\s+([a-z-]+)/) || [])[1]).filter(Boolean).map((n) => `${ev}:${n}`)));
  if (parEvenement.length !== new Set(parEvenement).size) throw new Error(`doublon : ${parEvenement.join(", ")}`);
  if (j.permissions.allow[0] !== "Bash(npm test)" || j.hooks.Stop[0].hooks[0].timeout !== 90) throw new Error("un réglage du produit a été modifié");
  if (!j.hooks.PostToolUse[0].hooks.some((h) => h.command === "node scripts/mon-hook.mjs")) throw new Error("le hook propre au produit a disparu");
  if (!j.hooks.PostToolUse[0].hooks.some((h) => /factory\.mjs ecriture/.test(h.command))) throw new Error("l'entrée ajoutée ne rejoint pas le groupe de même matcher");
  if (!apres.includes("\r\n  \"hooks\"")) throw new Error("fins de ligne ou indentation du produit perdues");
  if (fusionnerHooksDuGabarit(f, GABARIT_SETTINGS).etat !== "deja") throw new Error("une seconde passe n'est pas idempotente");
});

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

// ---- TF-1758 et TF-1760 (15/10/2026) : LOTS NON REMIS ET SORT DES RETOURS, À L'OUVERTURE DU PRODUIT --
// Vert : un lot `a_remettre` de plus de 24 h, jamais parvenu au pilot, est NOMMÉ ; les TF du registre qui
// désignent le produit (par son pseudonyme, retrouvé par une table jetable) sont comptés, et la seconde
// ouverture dit ce qui a été clos depuis la première. Rouge : un lot « remis le … » et un lot `a_remettre`
// de moins de 24 h ne sont pas nommés ; aucun autre nom que le pseudonyme du produit n'est imprimé.
{
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
  const jouer = () => execFileSync(process.execPath, [hook, "--sans-bootstrap", "--sans-readme", "--pilot", PILOT], { cwd: P, encoding: "utf8", timeout: 120000, env });
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
    if (duree > 20000) throw new Error(`${duree} ms`);
  });
}

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
{
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
      { cwd: P, encoding: "utf8", timeout: 120000, input: JSON.stringify({ session_id: "s-test", transcript_path: tr }) });
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
{
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
{
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
{
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
{
  const sansDistant = joue(mkdtempSync(join(tmpdir(), "ouverture-noms-")));
  check("TF-1676 — sans visibilité mesurable, la règle du 01/10 est dite et la mesure demandée avant toute pseudonymisation", () => {
    if (!/## Noms réels dans ce dépôt \(TF-1676\)\n- Visibilité NON mesurée/.test(sansDistant)) throw new Error("la règle des noms n'atteint pas le produit");
    if (!/Les dépôts privés peuvent conserver des données de type nom/.test(sansDistant)) throw new Error("la règle humaine n'est pas citée");
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

console.log(`${NL}Recette hook d'ouverture (.env local, TF-0869) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
