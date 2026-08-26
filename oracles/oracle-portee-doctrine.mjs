#!/usr/bin/env node
/**
 * oracle-portee-doctrine — UNE DOCTRINE N'EXISTE QUE LÀ OÙ SON MÉCANISME EST INSTALLÉ.
 *
 * LE FAIT (24/08/2026, TF-0571). Une session de travail a passé cinq heures et onze décisions dans
 * un dépôt produit, en rendant une dizaine de messages de fin de traitement à l'humain. AUCUN ne
 * portait la structure en huit blocs, aucun ne portait de bloc 0, et aucun n'a été ni jugé ni
 * refusé — il n'y avait ni doctrine chargée ni oracle armé. Le défaut n'a été découvert que par la
 * contestation humaine. Le dépôt en question ne porte ni CLAUDE.md, ni `.claude\`, et aucune
 * occurrence de « restitution » dans ses documents de projet ; le hook qui rend la règle opposable
 * vit chez le pilot et nulle part ailleurs.
 *
 * C'est LE DÉFAUT QUE LA v1 DE `gabarits\RESTITUTION.md` DÉCRIT D'ELLE-MÊME : « elle n'était citée
 * par aucun run […] une convention qu'aucun run ne charge ne s'applique pas : elle décore ». La v2
 * l'a corrigé pour les runs DU PILOT. Elle ne dit rien des sessions qui vivent chez le produit.
 *
 * MESURE DU 24/08 SUR LE PARC RÉEL, et elle est plus large que le retour : sur les dix produits
 * rangés sous le dossier client, CINQ portent un `forge\` — donc ont été instanciés — et UN SEUL
 * porte le hook de la factory. ZÉRO porte le texte de la doctrine. La doctrine voyageait donc au
 * mieux comme un juge sans son code : le hook bloque, et l'agent doit deviner les huit blocs.
 *
 * CE QUE CET ORACLE FAIT : il NOMME. Pour chaque produit connu du registre — la liste se dérive
 * des lots de retours ingérés, jamais d'une liste écrite à la main — il dit l'état d'installation
 * de la doctrine. Un produit absent du poste est « non vérifié », jamais accusé. Un produit sans
 * `forge\` n'a jamais été instancié : il est hors doctrine, et c'est un fait, pas une faute.
 *
 * CE QU'IL NE FAIT PAS, et c'est une frontière humaine, pas technique : ÉCRIRE CHEZ LE PRODUIT.
 * « Ne touche pas les produits, seuls les produits se modifient eux-mêmes » (mandat du 23/08). Le
 * remède d'un constat est donc toujours un run demandé au produit, jamais une copie d'ici.
 *
 *   node oracles\oracle-portee-doctrine.mjs             → jugement du parc
 *   node oracles\oracle-portee-doctrine.mjs --self-test → double sens sur un parc fabriqué
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Cet oracle n'a AUCUN chemin « je ne peux pas
// mesurer » : il ne depend d'aucun outil externe et lit des fichiers du depot. Le declarer
// vaut mieux que de le taire — un contrat muet laisse croire qu'un 1 peut etre une panne
// d'environnement (TF-0648).
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

/**
 * Les PIÈCES de la doctrine de restitution chez un produit, et ce que chacune apporte seule.
 * Les deux premières sont la leçon du 24/08 : un hook sans son texte est un juge sans code, un
 * texte sans hook est une décoration. Il faut les deux, et l'oracle le dit séparément pour que le
 * remède soit précis.
 */
const PIECES = [
  { chemin: ["forge", "hooks", "factory.mjs"], quoi: "le hook qui juge (opposable)",
    sans: "aucune fin de tour n'est jugée : la doctrine devient un vœu" },
  { chemin: [".claude", "settings.json"], quoi: "le câblage du hook", motif: "forge/hooks/factory.mjs",
    sans: "le hook est présent et jamais appelé — le pire état, il donne confiance sans rien faire" },
  { chemin: ["forge", "RESTITUTION.md"], quoi: "le texte de la doctrine (les 8 blocs)",
    sans: "le hook refuse sans que rien n'apprenne la forme attendue : l'agent devine" },
  { chemin: ["CLAUDE.md"], quoi: "les instructions du produit", motif: "R-43",
    sans: "la clause de précédence manque : les règles de la factory ne s'imposent pas" },
];

/** Les produits connus du pilot : dérivés des lots de retours ingérés, jamais d'une liste écrite. */
export function produitsDuRegistre(registre) {
  const noms = new Set();
  let lignes = [];
  try { lignes = readFileSync(registre, "utf8").split(/\r?\n/).filter(Boolean); } catch { return []; }
  for (const l of lignes) {
    let e = null;
    try { e = JSON.parse(l); } catch { continue; }
    if (e.ev !== "ingestion" || !e.fichier) continue;
    const nom = String(e.fichier).split(/[\\/]/).pop() || "";
    if (!nom.includes(" - RETOURS - ")) continue;   // une candidature hors lot n'a pas de produit
    noms.add(nom.split(" - RETOURS - ")[0]);
  }
  return [...noms].sort();
}

/** La localisation d'un produit, à deux niveaux — le second a été payé (TF-0555). */
export function localiser(projet, racine) {
  const enfants = (d) => { try { return readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()); } catch { return []; } };
  const plie = (n) => n.toLowerCase().replace(/[-_ .]/g, "");
  const correspond = (nom) => plie(nom).startsWith(plie(projet));
  const candidats = [];
  for (const d1 of enfants(racine)) {
    const c1 = join(racine, d1.name);
    if (correspond(d1.name)) candidats.push(c1);
    if (!existsSync(join(c1, "forge"))) {
      for (const d2 of enfants(c1)) if (correspond(d2.name)) candidats.push(join(c1, d2.name));
    }
  }
  const retenu = candidats.find((c) => existsSync(join(c, "forge")))
    || candidats.find((c) => existsSync(join(c, "CLAUDE.md")))
    || candidats[0] || null;
  // L'AMBIGUÏTÉ SE DÉCLARE, ELLE NE SE TRANCHE PAS EN SILENCE. Le premier passage sur le parc a
  // trouvé DEUX dossiers commençant par « Produit-11 » ; l'un a été retenu sans un mot.
  // Un verdict prononcé sur une cible ambiguë est un verdict faux une fois sur deux, et il est
  // d'autant plus dangereux qu'il a l'air précis.
  return { dossier: retenu, candidats };
}

export function juger({ registre, racine }) {
  const findings = [];
  const produits = produitsDuRegistre(registre);
  if (!produits.length) {
    findings.push({ regle: "PD1", statut: "SKIP", ou: registre, message:
      "aucun lot de retours au registre — aucun produit consommateur à nommer" });
    return findings;
  }
  for (const projet of produits) {
    const { dossier, candidats } = localiser(projet, racine);
    const ambigu = candidats.length > 1
      ? ` — ATTENTION, ${candidats.length} dossiers correspondent (${candidats.map((c) => c.split(/[\\/]/).pop()).join(", ")}), ` +
        `le jugement porte sur « ${String(dossier).split(/[\\/]/).pop()} » : à trancher par un humain`
      : "";
    if (!dossier) {
      // NON VÉRIFIÉ, JAMAIS ACCUSÉ : un produit qu'on ne localise pas n'est pas un produit en
      // défaut. Mais le silence est DIT — une vérification non faite qui ne laisse pas de trace
      // est une vérification qu'on croit faite (TF-0555).
      findings.push({ regle: "PD1", statut: "NON_VERIFIE", ou: projet, message:
        `introuvable sous ${racine} — ce n'est pas un constat sur le produit, c'est l'absence d'une cible` });
      continue;
    }
    if (!existsSync(join(dossier, "forge"))) {
      findings.push({ regle: "PD1", statut: "HORS_DOCTRINE", ou: projet, message:
        `aucun forge\\ — ce dépôt n'a jamais été instancié par le pilot. Il est HORS doctrine, et ` +
        "c'est un fait, pas une faute : une session qui y travaille ne recevra ni doctrine ni juge" + ambigu });
      continue;
    }
    const manques = [];
    for (const p of PIECES) {
      const f = join(dossier, ...p.chemin);
      if (!existsSync(f)) { manques.push(`${p.chemin.join("\\")} (${p.quoi}) — sans lui, ${p.sans}`); continue; }
      if (p.motif) {
        let contenu = "";
        try { contenu = readFileSync(f, "utf8"); } catch {}
        if (!contenu.includes(p.motif)) {
          manques.push(`${p.chemin.join("\\")} présent mais sans « ${p.motif} » (${p.quoi}) — sans lui, ${p.sans}`);
        }
      }
    }
    findings.push(manques.length
      ? { regle: "PD2", statut: "FAIL", ou: projet, message:
          `produit INSTANCIÉ dont la doctrine de restitution est incomplète — ${manques.length} pièce(s) : ` +
          manques.join(" · ") + ". Remède : un run demandé AU PRODUIT (le pilot n'écrit pas chez lui)" + ambigu }
      : { regle: "PD2", statut: "PASS", ou: projet, message: "doctrine de restitution installée et câblée" });
  }
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : f.every((x) => x.statut === "SKIP") ? "SKIP" : "PASS");

if (args[0] === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "portee-"));
  const casse = [];
  const registre = join(dir, "registre.jsonl");
  const lot = (p) => JSON.stringify({ ev: "ingestion", fichier: `input\\00-retours\\${p} - RETOURS - 20260824a.md` });
  writeFileSync(registre, [lot("Complet"), lot("SansTexte"), lot("JamaisInstancie"), lot("Ailleurs")].join("\n") + "\n", "utf8");
  const racine = join(dir, "parc");
  const poser = (nom, { forge = true, hook = true, settings = true, texte = true, claude = true } = {}) => {
    const d = join(racine, nom);
    mkdirSync(d, { recursive: true });
    if (forge) mkdirSync(join(d, "forge", "hooks"), { recursive: true });
    if (forge && hook) writeFileSync(join(d, "forge", "hooks", "factory.mjs"), "// hook\n", "utf8");
    if (settings) { mkdirSync(join(d, ".claude"), { recursive: true }); writeFileSync(join(d, ".claude", "settings.json"), '{"hooks":{"Stop":[{"command":"node forge/hooks/factory.mjs"}]}}', "utf8"); }
    else rmSync(join(d, ".claude"), { recursive: true, force: true });
    if (forge && texte) writeFileSync(join(d, "forge", "RESTITUTION.md"), "# doctrine\n", "utf8");
    if (claude) writeFileSync(join(d, "CLAUDE.md"), "Précédence R-43.\n", "utf8");
  };
  poser("Complet");
  poser("SansTexte", { texte: false });
  poser("JamaisInstancie", { forge: false });
  // « Ailleurs » n'est pas posé du tout : il doit rendre NON_VERIFIE, jamais FAIL.
  const f = juger({ registre, racine });
  const par = (nom) => f.find((x) => x.ou === nom);
  if (par("Complet")?.statut !== "PASS") casse.push("un produit complet n'est pas PASS : " + JSON.stringify(par("Complet")));
  if (par("SansTexte")?.statut !== "FAIL" || !/RESTITUTION\.md/.test(par("SansTexte").message)) {
    casse.push("un produit avec le hook mais SANS le texte de la doctrine n'est pas nommé — c'est le défaut mesuré sur le parc");
  }
  if (par("JamaisInstancie")?.statut !== "HORS_DOCTRINE") casse.push("un dépôt jamais instancié est jugé au lieu d'être déclaré hors doctrine");
  if (par("Ailleurs")?.statut !== "NON_VERIFIE") casse.push("un produit absent du poste est ACCUSÉ au lieu d'être déclaré non vérifié");
  // Sens rouge du câblage : le hook présent et jamais appelé.
  poser("Complet", { settings: false });
  if (!juger({ registre, racine }).find((x) => x.ou === "Complet" && x.statut === "FAIL")) {
    casse.push("un hook présent mais non câblé passe — c'est l'état qui donne confiance sans rien faire");
  }
  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test portée de doctrine : 5/5 PASS (produit complet → PASS ; hook sans le texte → FAIL nommé ; " +
      "dépôt jamais instancié → HORS_DOCTRINE ; produit absent du poste → NON_VERIFIE ; hook non câblé → FAIL)");
  process.exit(casse.length ? 1 : 0);
}

const registre = join(PILOT, "todo", "TODO.jsonl");
const brute = process.env.FORGE_ROOT || join(PILOT, "..");
const racine = isAbsolute(brute) ? brute : join(PILOT, brute);
const findings = juger({ registre, racine });
const verdict = verdictDe(findings);
// LE VERDICT EST VRAI, LE CODE DE SORTIE NE BLOQUE PAS, ET LES DEUX SE DISENT. Tous les constats
// portent sur des DÉPÔTS PRODUITS, que le pilot n'a pas le droit de modifier (mandat humain du
// 23/08). Sortir en code 1 rendrait la recette du pilot rouge pour un défaut que SEUL le produit
// peut corriger : c'est l'erreur du hook « produits intacts », qui a bloqué cinq restitutions et
// dont le remède suggéré aurait détruit trois branches d'une autre session. Un contrôle qui
// bloque sur ce qu'il ne peut pas faire réparer apprend à être contourné.
// Le jour où un constat porterait sur le PILOT lui-même, il sortirait en 1 : c'est la seule cible
// dont ce dépôt est responsable.
const surLePilot = findings.filter((f) => f.statut === "FAIL" && /digit-ai-factory|pilot/i.test(f.ou));
console.log(JSON.stringify({
  oracle: "oracle-portee-doctrine",
  version: "1.0.0",
  verdict,
  portee_du_code_de_sortie: surLePilot.length
    ? "1 — un constat porte sur le pilot, seule cible dont ce dépôt est responsable"
    : "0 — tous les constats portent sur des produits : le pilot les NOMME, il ne les corrige pas et ne se bloque pas dessus",
  racine,
  findings,
  non_juge: [
    "les produits qui n'ont jamais remis de lot : ils sont inconnus du registre, donc invisibles ici. " +
    "La liste se dérive de ce qui est ENTRÉ, jamais d'un inventaire écrit à la main",
    "la fraîcheur des pièces : PD2 constate leur présence et leur câblage, pas qu'elles soient à jour — " +
    "c'est le travail de R-47 (gabarits\\HERITAGE.json), et le dupliquer créerait deux vérités",
    "l'écriture du remède : le pilot n'écrit jamais chez un produit (mandat humain du 23/08). Un constat " +
    "d'ici se corrige par un run demandé au produit, et le constat reste ouvert jusque-là",
  ],
}, null, 1));
process.exit(surLePilot.length ? 1 : 0);
