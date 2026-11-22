#!/usr/bin/env node
/**
 * verifier-parcours-tiers.test.mjs — un parcours tiers embarqué (paiement, réservation) vérifié sur
 * l'étape corrigée et jamais jusqu'à l'étape qui encaisse se voit, hors ligne (M-14 ; TF-1583).
 *
 * Rouges : le cas fondateur du 25/08/2026 (un cadre de réservation intégré, une politique de contenu
 * qui nomme la passerelle) avec un dossier de MEP muet sur le parcours ; un dossier dont la section ne
 * nomme pas le tiers, ne dit pas « navigateur » ni la date, ne dit pas « état exécuté », ou ne dit pas
 * l'étape atteinte (« les contrôles passent » sur le seul mécanisme).
 * Verts : le remède (section complète, étape « à confirmer » admise quand seul un paiement réel
 * tranche) ; un cadre qui n'engage pas l'utilisateur (carte) ; un produit sans parcours tiers.
 * Borne : un parcours relevé sans dossier de MEP est sans objet (l'étape n'est pas atteinte).
 * Joué par `oracles\self-tests.mjs`.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-parcours-tiers.mjs");
const { releverParcours } = await import(pathToFileURL(OUTIL).href);
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const egal = (a, b, msg) => { if (a !== b) throw new Error(`${msg} : attendu ${b}, obtenu ${a}`); };
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const refus = (r) => (r.j?.findings || []).filter((f) => f.regle === "PT-2" && f.statut === "FAIL");
const produit = (fichiers) => {
  const D = mkdtempSync(join(tmpdir(), "parcours-tiers-"));
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    mkdirSync(dirname(join(D, chemin)), { recursive: true });
    writeFileSync(join(D, chemin), contenu, "utf8");
  }
  return D;
};
const nettoyer = (D) => rmSync(D, { recursive: true, force: true });

// Le produit du cas fondateur, réduit à ses deux faits : un cadre de réservation intégré, et la
// politique de contenu qui nomme la passerelle de paiement.
const PAGE = '<main><h1>Réserver</h1>\n<iframe src="https://www.beds24.com/booking2.php?propid=1" title="Réservation"></iframe></main>\n';
const CSP = '{ "headers": [{ "key": "Content-Security-Policy", "value": "default-src \'self\'; frame-src \'self\' https://www.beds24.com https://js.stripe.com; form-action \'self\'" }] }\n';
const PRODUIT = { "site/reservation.html": PAGE, "staticwebapp.config.json": CSP };

const SECTION_COMPLETE = [
  "# Dossier de MEP", "", "Campagne de mutation proposée puis refusée.", "",
  "## Parcours tiers embarqués", "",
  "- Tiers : beds24 (réservation) et stripe (paiement de l'acompte).",
  "- Joué dans un navigateur le 2026-10-13 : banc `verifier:paiement`, sur l'état exécuté (DOM après chargement), pas sur le HTML servi.",
  "- Étape atteinte : jusqu'à l'étape qui encaisse (formulaire des coordonnées atteint sans validation, navigation vers la passerelle rejouée depuis son contexte de départ) ; l'encaissement lui-même est à confirmer par un paiement réel.",
  "",
].join("\n");
const sans = (texte, motif) => texte.split("\n").filter((l) => !motif.test(l)).join("\n");

console.log("Rouges");
check("ROUGE — cadre de réservation et passerelle dans la politique de contenu, dossier muet sur le parcours : refus localisant, exit 1", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": "# Dossier de MEP\n\nBuild OK, healthcheck OK, smoke OK. Les six contrôles passent.\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie " + r.brut.slice(0, 300));
  egal(refus(r).length, 1, "refus PT-2");
  if (!/Parcours tiers embarqués/.test(refus(r)[0].message) || !/35 jours/.test(refus(r)[0].message)) throw new Error("le refus ne nomme ni la section ni le fait : " + refus(r)[0].message.slice(0, 200));
  if (!/beds24/.test(refus(r)[0].message)) throw new Error("le tiers relevé n'est pas nommé");
});
check("ROUGE — la section existe mais ne nomme pas les tiers relevés", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": SECTION_COMPLETE.replace(/beds24|stripe/g, "le prestataire") });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  if (!refus(r).some((f) => /ne nomme pas les tiers relevés/.test(f.message))) throw new Error(JSON.stringify(refus(r).map((f) => f.message.slice(0, 80))));
});
check("ROUGE — la section ne dit ni « navigateur » ni la date : un curl sur le HTML servi", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": sans(SECTION_COMPLETE, /Joué dans un navigateur/) + "\nVérifié par curl le 2026-10-13, sur l'état exécuté.\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  if (!refus(r).some((f) => /DANS UN NAVIGATEUR/.test(f.message))) throw new Error("le navigateur n'est pas exigé");
});
check("ROUGE — la section ne dit pas l'état exécuté : le HTML servi ne voit pas ce qu'un script réécrit", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": SECTION_COMPLETE.replace("sur l'état exécuté (DOM après chargement), pas sur le HTML servi", "sur la page de réservation") });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  if (!refus(r).some((f) => /ÉTAT EXÉCUTÉ/.test(f.message))) throw new Error("l'état exécuté n'est pas exigé");
});
check("ROUGE — la section ne dit pas l'étape atteinte : « les contrôles passent » sur le seul mécanisme corrigé", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": sans(SECTION_COMPLETE, /Étape atteinte/) + "\nLes six contrôles du mécanisme corrigé passent.\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie");
  if (!refus(r).some((f) => /quelle ÉTAPE/.test(f.message))) throw new Error("l'étape n'est pas exigée");
});

console.log("PT-3 — un réglage de paiement prescrit chez un tiers se relit chez lui avant la mise en service (TF-2696)");
// Le cas fondateur du 20/11/2026, réduit à ses faits : un guide qui prescrit des empreintes renouvelées sur une validité supposée,
// un dossier de MEP qui n'a jamais relu ce que le tiers en fait.
const GUIDE = "# Guide de réglage\n\nRégler chez Beds24 le renouvellement de l'empreinte de carte à J+3, J+7 et J+11 : la validité d'une empreinte est de 7 jours.\n\nLe reste du guide décrit les tarifs.\n";
const REGLAGE = { "docs/projet/GUIDE-REGLAGE.md": GUIDE };
const SECTION_REGLAGES = [
  "# Dossier de MEP", "", "## Réglages de paiement chez un tiers", "",
  "- Tiers : beds24 (empreintes de carte de la caution).",
  "- Réservation test jouée le 2026-10-20 chez beds24 : une réservation de 3 nuits avec empreinte, annulée ensuite.",
  "- Relecture mesurée le 2026-10-21 : l'empreinte lue chez le tiers est valable 30 jours (valeur supposée au guide : 7 jours), aucune libération avant le départ.",
  "- Les deux ont eu lieu avant mise en service ; le guide est corrigé en conséquence.", "",
].join("\n");
const refus3 = (r) => (r.j?.findings || []).filter((f) => f.regle === "PT-3" && f.statut === "FAIL");

check("ROUGE PT-3 — un guide prescrit le renouvellement d'une empreinte chez un tiers, le dossier de MEP est muet : refus localisant, exit 1", () => {
  const D = produit({ ...REGLAGE, "forge/etapes/mep/DOSSIER-MEP.md": "# Dossier de MEP\n\nBuild OK, healthcheck OK, smoke OK.\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 1, "code de sortie " + r.brut.slice(0, 300));
  egal(refus3(r).length, 1, "refus PT-3");
  const m = refus3(r)[0].message;
  if (!/Réglages de paiement chez un tiers/.test(m) || !/4 empreintes sur 6/.test(m) || !/beds24/.test(m) || !/GUIDE-REGLAGE\.md:3/.test(m)) throw new Error("le refus ne nomme pas la section, le fait, le tiers et la ligne du guide : " + m.slice(0, 300));
  egal(r.j.mesure.reglages, 1, "réglages relevés");
});
check("ROUGE PT-3 — la section existe sans réservation test, sans relecture mesurée ou sans la porte « avant mise en service » : chaque manque est un refus", () => {
  const sans = (motif) => SECTION_REGLAGES.split("\n").filter((l) => !motif.test(l)).join("\n");
  for (const [manque, doc, attendu] of [
    ["réservation test", sans(/Réservation test jouée/), /RÉSERVATION TEST/],
    ["relecture mesurée", sans(/Relecture mesurée/), /RELECTURE MESURÉE/],
    ["porte avant mise en service", sans(/avant mise en service/), /MISE EN SERVICE/],
    ["relecture sans valeur", SECTION_REGLAGES.replace(/: l'empreinte lue chez le tiers est valable 30 jours \(valeur supposée au guide : 7 jours\), aucune libération avant le départ/, " : faite"), /RELECTURE MESURÉE/],
    ["tiers non nommé", SECTION_REGLAGES.replace(/beds24/g, "le prestataire"), /ne nomme pas le tiers/],
  ]) {
    const D = produit({ ...REGLAGE, "forge/etapes/mep/DOSSIER-MEP.md": doc });
    const r = lancer(D); nettoyer(D);
    egal(r.code, 1, `code de sortie (${manque})`);
    if (!refus3(r).some((f) => attendu.test(f.message))) throw new Error(`${manque} : ${JSON.stringify(refus3(r).map((f) => f.message.slice(0, 90)))}`);
  }
});
check("VERT PT-3 — le remède : la section porte la réservation test datée, la relecture mesurée chiffrée et la porte avant mise en service, exit 0", () => {
  const D = produit({ ...REGLAGE, "forge/etapes/mep/DOSSIER-MEP.md": SECTION_REGLAGES });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 0, "code de sortie " + r.brut.slice(0, 400));
  egal(refus3(r).length, 0, "refus PT-3 après le remède");
});
check("BORNE PT-3 — un réglage prescrit sans dossier de MEP : l'étape n'est pas atteinte, sans objet (exit 2), jamais un FAIL", () => {
  const D = produit(REGLAGE);
  const r = lancer(D); nettoyer(D);
  egal(r.code, 2, "code de sortie " + r.brut.slice(0, 300));
  if (!/réglage de paiement prescrit chez un tiers \(beds24\) mais aucun dossier de MEP/.test(r.j.motif)) throw new Error("motif : " + r.j.motif);
});
check("VERT PT-3 — un tiers cité sans réglage prescrit, un réglage sans objet de paiement, un guide sous forge/ : rien n'est relevé", () => {
  const D = produit({
    "docs/projet/NOTE.md": "Le paiement de l'acompte passe par Stripe, sans rien à régler de notre côté.\n",
    "docs/projet/TARIFS.md": "Régler chez Beds24 la langue de l'interface en français.\n",
    "forge/GUIDE-REGLAGE.md": GUIDE,
    "forge/etapes/mep/DOSSIER-MEP.md": "# Dossier de MEP\n",
  });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 2, "code de sortie " + r.brut.slice(0, 300));
  egal(r.j.mesure.reglages, 0, "réglages relevés à tort");
});

console.log("Verts et bornes");
check("VERT — le remède : section complète, étape jusqu'à l'encaissement et « à confirmer » pour le paiement réel, exit 0", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": SECTION_COMPLETE });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 0, "code de sortie " + r.brut.slice(0, 400));
  egal(r.j.mesure.tiers, 2, "tiers relevés (beds24.com, js.stripe.com)");
});
check("VERT — « à confirmer » suffit quand seul un paiement réel tranche, sans réserver", () => {
  const D = produit({ ...PRODUIT, "forge/etapes/mep/DOSSIER-MEP.md": SECTION_COMPLETE.replace(/jusqu'à l'étape qui encaisse[^;]*;/, "").replace("l'encaissement lui-même est à confirmer", "étape atteinte : à confirmer") });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 0, "code de sortie " + r.brut.slice(0, 400));
});
check("VERT — un cadre qui n'engage pas l'utilisateur (carte) n'est ni relevé ni accusé : sans objet, exit 2", () => {
  const D = produit({ "site/contact.html": '<iframe src="https://maps.example-cartes.com/embed?q=1" title="Plan d\'accès"></iframe>\n', "forge/etapes/mep/DOSSIER-MEP.md": "# Dossier de MEP\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 2, "code de sortie " + r.brut.slice(0, 300));
});
check("VERT — un produit sans parcours tiers : sans objet, exit 2, motif dit", () => {
  const D = produit({ "src/app.js": "console.log('bonjour')\n", "forge/etapes/mep/DOSSIER-MEP.md": "# Dossier de MEP\n" });
  const r = lancer(D); nettoyer(D);
  egal(r.code, 2, "code de sortie");
  if (!/M-14 sans objet/.test(r.j.motif)) throw new Error("le motif de non-jugement n'est pas dit");
});
check("BORNE — un parcours relevé sans dossier de MEP : l'étape n'est pas atteinte, sans objet (jamais FAIL), exit 2", () => {
  const D = produit(PRODUIT);
  const r = lancer(D); nettoyer(D);
  egal(r.code, 2, "code de sortie");
  if (!/aucun dossier de MEP/.test(r.j.motif)) throw new Error("le motif ne nomme pas l'absence de dossier : " + r.j.motif);
});
check("relevé — la forme de chaque signal est nommée : cadre intégré, directive, adresse de passerelle", () => {
  const formes = (t) => releverParcours(t, "f", { passerelles: ["stripe.com"], vocabulaire: ["paiement", "reservation"], date: "x" }).map((p) => p.forme);
  if (!formes('<iframe src="https://x.example-tiers.com/reservation"></iframe>').includes("cadre intégré")) throw new Error("cadre");
  if (!formes("frame-src 'self' https://pay.stripe.com;").includes("directive frame-src")) throw new Error("directive");
  if (!formes('<a href="https://checkout.stripe.com/c/pay">Payer</a>').includes("adresse de passerelle")) throw new Error("adresse");
  egal(formes('<iframe src="https://cartes.example-tiers.com/embed"></iframe>').length, 0, "cadre hors engagement");
});
check("relevé — ni localhost ni 'self' ni data: ne comptent pour un tiers", () => {
  const n = (t) => releverParcours(t, "f", { passerelles: ["stripe.com"], vocabulaire: ["paiement"], date: "x" }).length;
  egal(n("frame-src 'self' data: ;"), 0, "'self' et data:");
  egal(n('<iframe src="http://localhost:3000/paiement"></iframe>'), 0, "localhost");
});

console.log(`\n${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
