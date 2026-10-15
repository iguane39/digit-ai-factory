#!/usr/bin/env node
/**
 * oracle-lot-retours.test.mjs — le juge de la forme d'un lot, dans les DEUX sens (TF-0597).
 *
 * Ce module est la SOURCE des règles jouées à deux endroits : chez le produit avant la remise,
 * et à la porte du pilot à l'ingestion. Un défaut ici se paie donc deux fois, et une règle qui
 * accuse à tort se fait désactiver des deux côtés — d'où le soin mis aux cas VERTS, qui sont la
 * moitié du contrôle et non sa décoration.
 *
 * Le premier jet de ce module est lui-même une raison d'écrire ces cas : il destructurait huit
 * positions dans le mauvais ordre, et affichait « section « un verdict de généralisation »
 * absente » — un message qui nommait la SUBSTANCE attendue comme si c'était le titre de la
 * section, donc un remède qui envoyait le lecteur créer une section au mauvais nom.
 */
import { verifier, dateDuLot, SEUILS } from "./oracle-lot-retours.mjs";

let pass = 0, echec = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.log(`  [FAIL] ${nom} — ${e.message}`); echec++; }
};
const lot = (n) => `PROD - RETOURS - ${n}.md`;
const R45 = "## Remarques restées au produit\n\n| x | y |\n|---|---|\n| une remarque | généralisable : oui |\n";
const R46 = "## Retours sur les documents produits\n\n| doc | gd-fiche-securite 1.0.0 | section absente |\n";
const constat = (r, regle) => r.constats.find((c) => c.regle === regle);

console.log("oracle-lot-retours — la forme d'un lot, jugée avant la remise (TF-0597)\n");

// ---- Les deux sens de chaque règle -----------------------------------------------------------
check("verte — les deux sections présentes et substantielles : PASS", () => {
  const r = verifier(lot("20260824a"), `# lot\n\n${R45}\n${R46}`);
  if (r.verdict !== "PASS") throw new Error(`verdict ${r.verdict} — ${JSON.stringify(r.constats)}`);
});

check("verte — les deux DÉCLARATIONS d'absence valent réponse (loi n° 3)", () => {
  const r = verifier(lot("20260824a"),
    "# lot\n\n## Remarques restées au produit\n\nAucune remarque n'est restée au produit.\n\n" +
    "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit sur ce lot.\n");
  if (r.verdict !== "PASS") throw new Error(`une section qui déclare « rien à dire » doit PASSER — ${JSON.stringify(r.constats)}`);
});

// TF-1358 (26/09/2026) — LOT-DATE : le lot du 24/09 nommé « 20260925a », à la date d'un jour à venir.
check("rouge LOT-DATE — un lot nommé d'un jour À VENIR est refusé, et le remède nomme le jour qui juge", () => {
  const r = verifier(lot("20260925a"), `# lot\n\n${R45}\n${R46}`, { aujourdhui: "20260924" });
  const c = r.constats.find((x) => x.regle === "LOT-DATE");
  if (r.verdict !== "FAIL" || !c || c.statut !== "FAIL") throw new Error(`verdict ${r.verdict}, LOT-DATE ${c && c.statut}`);
  if (!/20260924/.test(c.remede)) throw new Error("le remède ne nomme pas le jour d'écriture");
});
check("verte LOT-DATE — le même lot, nommé du jour qui le juge, passe", () => {
  const r = verifier(lot("20260924a"), `# lot\n\n${R45}\n${R46}`, { aujourdhui: "20260924" });
  const c = r.constats.find((x) => x.regle === "LOT-DATE");
  if (r.verdict !== "PASS" || !c || c.statut !== "PASS") throw new Error(`verdict ${r.verdict}, LOT-DATE ${c && c.statut}`);
});
check("rouge — section R-45 absente : FAIL, et le remède nomme LE TITRE de la section", () => {
  const r = verifier(lot("20260824a"), `# lot\n\n${R46}`);
  const c = constat(r, "R-45");
  if (c.statut !== "FAIL") throw new Error(`statut ${c.statut}`);
  if (!/« Remarques restées au produit »/.test(c.message)) throw new Error("le message ne nomme pas la section attendue");
  if (!/## Remarques restées au produit/.test(c.remede || "")) throw new Error("le remède ne donne pas le titre EXACT à écrire — c'est le défaut du premier jet");
  if (!/aucune remarque n'est restée au produit/i.test(c.remede)) throw new Error("le remède ne dit pas quoi faire quand il n'y a rien à dire");
});

check("rouge — section R-46 absente : FAIL, et le remède nomme LE TITRE de la section", () => {
  const r = verifier(lot("20260824a"), `# lot\n\n${R45}`);
  const c = constat(r, "R-46");
  if (c.statut !== "FAIL") throw new Error(`statut ${c.statut}`);
  if (!/## Retours sur les documents produits/.test(c.remede || "")) throw new Error("le remède ne donne pas le titre EXACT à écrire");
});

// TF-1430 (28/09/2026) — LE REMÈDE NOMME LE GABARIT CANONIQUE, JAMAIS L'ALIAS DE TRANSITION. Il
// nommait `forge\retours\RETOURS-FORGES.md`, alias périmé chez tout produit qui porte aussi la cible
// canonique (TF-0881) : le lot du 28/09 rédigé d'après lui est parti sans classe et hors du sas. Le
// nom attendu se LIT au contrat d'héritage, jamais recopié ici : un renommage futur y fera rougir.
{
  const { readFileSync, existsSync } = await import("node:fs");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const PILOT = join(dirname(fileURLToPath(import.meta.url)), "..");
  const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
  const gabarit = contrat.artefacts.find((a) => a.source === "gabarits/RETOURS-FORGES.md");
  const cheminDuRemede = (remede) => ((/Gabarit : (\S+)/.exec(remede || "") || [])[1] || "").split("\\").join("/");

  check("rouge TF-1430 — le remède de R-45 nomme la cible CANONIQUE du contrat d'héritage, jamais son alias de transition", () => {
    const c = constat(verifier(lot("20260928a"), `# lot\n\n${R46}`), "R-45");
    if (!gabarit || !gabarit.alias_accepte) throw new Error("le contrat ne déclare plus le gabarit et son alias : la recette ne sait plus quoi comparer");
    const nomme = cheminDuRemede(c.remede);
    if (nomme === gabarit.alias_accepte) throw new Error(`le remède envoie encore vers l'alias périmé ${nomme}`);
    if (nomme !== gabarit.cible) throw new Error(`le remède nomme « ${nomme} », le contrat déclare « ${gabarit.cible} »`);
  });

  check("remède joué TF-1430 — le gabarit nommé porte la section demandée, et le lot qui l'ajoute comme le remède le dit PASSE", () => {
    const c = constat(verifier(lot("20260928a"), `# lot\n\n${R46}`), "R-45");
    const source = contrat.artefacts.find((a) => a.cible === cheminDuRemede(c.remede));
    if (!source) throw new Error("le chemin nommé par le remède n'est la cible d'aucun artefact du contrat");
    const texteGabarit = readFileSync(join(PILOT, source.source), "utf8");
    const titre = (/« (## [^»]+?) »/.exec(c.remede) || [])[1];
    const rien = (/L'écrire : « ([^»]+?) »/.exec(c.remede) || [])[1];
    if (!titre || !existsSync(join(PILOT, source.source)) || !texteGabarit.split(/\r?\n/).includes(titre)) throw new Error(`le gabarit ${source.source} ne porte pas le titre « ${titre} » que le remède fait écrire`);
    const r = verifier(lot("20260928a"), `# lot\n\n${titre}\n\n${rien}.\n\n${R46}`);
    if (constat(r, "R-45").statut !== "PASS") throw new Error(`le lot corrigé selon le remède reste en défaut : ${JSON.stringify(constat(r, "R-45"))}`);
  });
}

check("rouge — section R-45 PRÉSENTE mais vide : une section vide se lit comme un oubli", () => {
  const r = verifier(lot("20260824a"), `# lot\n\n## Remarques restées au produit\n\n(rien)\n\n${R46}`);
  const c = constat(r, "R-45");
  if (c.statut !== "FAIL") throw new Error(`statut ${c.statut} — l'omission ne vaut pas décision`);
  if (!/verdict de généralisation/.test(c.message)) throw new Error("le message ne dit pas ce qui manque SOUS la section");
});

check("rouge — section R-46 PRÉSENTE mais ne rattache rien à un gabarit", () => {
  const r = verifier(lot("20260824a"), `# lot\n\n${R45}\n## Retours sur les documents produits\n\n(rien)\n`);
  const c = constat(r, "R-46");
  if (c.statut !== "FAIL") throw new Error(`statut ${c.statut}`);
});

// ---- L'antériorité : une règle qui bouge n'accuse pas le passé --------------------------------
check("borne — un lot ANTÉRIEUR à R-45 n'est jugé par aucune des deux : antériorité DÉCLARÉE", () => {
  const r = verifier(lot("20260820a"), "# lot\n\nrien du tout\n");
  if (r.verdict !== "PASS") throw new Error(`verdict ${r.verdict} — c'est la RÈGLE qui a bougé, pas le lot`);
  for (const regle of ["R-45", "R-46"]) {
    const c = constat(r, regle);
    if (c.statut !== "SANS_OBJET") throw new Error(`${regle} juge un lot antérieur à son entrée en vigueur`);
    if (!/antériorité déclarée/.test(c.message)) throw new Error(`${regle} se tait sans dire pourquoi — un contrôle silencieux est un contrôle absent`);
  }
});

check("borne — la FENÊTRE entre les deux seuils : R-45 juge, R-46 pas encore", () => {
  const r = verifier(lot("20260821a"), "# lot\n\nrien du tout\n");
  if (constat(r, "R-45").statut !== "FAIL") throw new Error("R-45 devrait juger un lot du 21/08");
  if (constat(r, "R-46").statut !== "SANS_OBJET") throw new Error("R-46 ne naît que le 22/08 — un jour d'écart, et il compte");
});

check("borne — un nom SANS DATE : la forme n'est pas jugée, et le contrôle le DIT", () => {
  const r = verifier("notes-en-vrac.md", "# lot\n\nrien\n");
  if (r.verdict !== "SANS_OBJET") throw new Error(`verdict ${r.verdict} — juger au hasard serait pire que ne pas juger`);
  if (!/ne porte pas de date/.test(r.constats[0].message)) throw new Error("le motif du silence n'est pas dit");
});

// ---- La date vient du NOM, jamais du disque ---------------------------------------------------
check("la date se lit dans le NOM du lot — une copie change la date de fichier, pas celle du lot", () => {
  if (dateDuLot("x/PROD - RETOURS - 20260824c.md") !== "20260824") throw new Error("date du .md non lue");
  if (dateDuLot("PROD - RETOURS - 20260824c.tf.jsonl") !== "20260824") throw new Error("date du sidecar non lue");
  if (dateDuLot("PROD - RETOURS - 20260824c.normalise.tf.jsonl") !== "20260824") throw new Error("date du sidecar normalisé non lue");
  if (dateDuLot("sans-date.md") !== null) throw new Error("une date est inventée là où il n'y en a pas");
});

check("les seuils sont ceux des règles publiées, et ils sont EXPORTÉS pour être lisibles", () => {
  if (SEUILS["R-45"] !== "20260821") throw new Error("seuil R-45 dérivé");
  if (SEUILS["R-46"] !== "20260822") throw new Error("seuil R-46 dérivé");
});

// ---- Le lot introuvable ne se devine pas -------------------------------------------------------
check("un lot INTROUVABLE rend SKIP — jamais un PASS de complaisance", () => {
  const r = verifier("chemin/qui/n/existe/pas - RETOURS - 20260824a.md");
  if (r.verdict !== "SKIP") throw new Error(`verdict ${r.verdict} — un fichier absent n'est pas un fichier conforme`);
});

// ---- Le pilot et le produit jugent la MÊME chose ------------------------------------------------
check("la casse et les accents du titre de section ne changent pas le verdict", () => {
  const r = verifier(lot("20260824a"),
    "# lot\n\n## REMARQUES RESTEES AU PRODUIT\n\ngénéralisable : non\n\n## retours sur les documents produits\n\ngd-dat 1.0.0\n");
  if (r.verdict !== "PASS") throw new Error(`verdict ${r.verdict} — un titre en capitales sans accent reste le même titre`);
});

// ---- R-49 (TF-0884) : UN LOT REMIS ET INGÉRÉ NE SE RÉÉCRIT JAMAIS ----------------------------
//
// Le 06/09, un compte rendu a pris l'indice « a » déjà porté par un lot du même produit remis et
// ingéré le matin même ; une écriture ordinaire l'a remplacé, et aucun contrôle ne s'y est opposé.
// Les DEUX SENS se jouent sur le MÊME lot et le MÊME registre jetable : seule l'empreinte change.
// Le registre est détourné par `FORGE_REGISTRE` — jamais le registre réel, qu'aucune recette
// n'a le droit de toucher.
{
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { createHash } = await import("node:crypto");

  const T = mkdtempSync(join(tmpdir(), "lot-r49-"));
  const CORPS = "# lot\n\n" + R45 + "\n" + R46;
  const cheminLot = join(T, "PROD - RETOURS - 20260906a.md");
  const cheminSidecar = join(T, "PROD - RETOURS - 20260906a.tf.jsonl");
  const SIDECAR_ORIGINE = '{"schema":1,"titre":"le constat d origine"}\n';
  writeFileSync(cheminLot, CORPS, "utf8");
  writeFileSync(cheminSidecar, SIDECAR_ORIGINE, "utf8");
  const empreinteOrigine = createHash("sha256").update(SIDECAR_ORIGINE).digest("hex");

  const registre = join(T, "REGISTRE.jsonl");
  writeFileSync(registre, JSON.stringify({
    ev: "ingestion", ts: "2026-09-06T07:12:00.000Z", lot_sha: empreinteOrigine,
    fichier: "input/00-retours/PROD - RETOURS - 20260906a.tf.jsonl", creations: 2,
  }) + "\n", "utf8");
  process.env.FORGE_REGISTRE = registre;

  check("R-49 vert — le lot ingéré porte encore l'empreinte consignée : rien n'a été réécrit", () => {
    const c = constat(verifier(cheminLot), "R-49");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — un lot intact est accusé de réécriture`);
  });

  check("R-49 rouge — le MÊME chemin, une AUTRE empreinte : l'écrasement est refusé et l'indice suivant prescrit", () => {
    writeFileSync(cheminSidecar, '{"schema":1,"titre":"un compte rendu qui a pris la place"}\n', "utf8");
    const r = verifier(cheminLot);
    const c = constat(r, "R-49");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — l'écrasement d'un lot ingéré passe encore`);
    if (r.verdict !== "FAIL") throw new Error("le verdict global ne bascule pas alors qu'une règle échoue");
    if (!/INDICE SUIVANT/.test(c.remede || "")) throw new Error("le remède ne prescrit pas l'indice suivant — un message qui prescrit la moitié du geste conduit à la seconde violation (TF-0552)");
    if (!/allouer-indice/.test(c.remede || "")) throw new Error("le remède ne nomme pas l'outil qui donne l'indice");
  });

  check("R-49 borne — un lot JAMAIS ingéré sous ce nom est une première remise, pas une réécriture", () => {
    const neuf = join(T, "PROD - RETOURS - 20260906b.md");
    writeFileSync(neuf, CORPS, "utf8");
    writeFileSync(join(T, "PROD - RETOURS - 20260906b.tf.jsonl"), '{"schema":1}\n', "utf8");
    const c = constat(verifier(neuf), "R-49");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — une première remise est prise pour un écrasement`);
    if (!/première/.test(c.message)) throw new Error("le constat ne dit pas que la remise est une première");
  });

  check("R-49 borne — hors du pilot (registre injoignable), la règle est SANS_OBJET et le DIT", () => {
    process.env.FORGE_REGISTRE = join(T, "registre-qui-n-existe-pas.jsonl");
    const c = constat(verifier(cheminLot), "R-49");
    if (!c || c.statut !== "SANS_OBJET") throw new Error(`statut ${c ? c.statut : "absent"} — la copie du module chez un produit crierait sur une donnée qu'elle n'a pas`);
  });

  delete process.env.FORGE_REGISTRE;
  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- LOT-SAS (TF-1054) : UN LOT ARRIVE PAR LE SAS, JAMAIS À LA RACINE SOUS UN NOM RÉEL -------
//
// Tables JETABLES, noms INVENTÉS, variables posées dans CE processus seulement — jamais les tables
// du canal confidentiel (incident du 08/09). Le quatrième cas JOUE le remède que le message
// prescrit (TF-1013) : un gardien qui refuserait son propre remède se ferait désactiver.
{
  const { mkdtempSync, mkdirSync, writeFileSync, readdirSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const T = mkdtempSync(join(tmpdir(), "lot-sas-"));
  const avant = { c: process.env.FORGE_NOMS_INTERDITS, p: process.env.FORGE_PRODUITS_PSEUDO };
  writeFileSync(join(T, "_noms.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: { "CalculatriceZorglubZAP": "Produit-01" } }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(T, "_noms.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(T, "_prod.json");
  const boite = join(T, "input", "00-retours"), arrivee = join(boite, "_arrivee");
  mkdirSync(arrivee, { recursive: true });
  const CORPS = "# lot\n\n" + R45 + "\n" + R46;

  check("LOT-SAS rouge — un lot au NOM RÉEL posé à la racine de la boîte : FAIL, et le remède nomme le sas", () => {
    const c = constat(verifier(join(boite, "CalculatriceZorglubZAP - RETOURS - 20260914a.md"), CORPS), "LOT-SAS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — un lot au nom réel dans le répertoire suivi passe encore`);
    if (!/_arrivee/.test(c.remede || "") || !/accueillir-lot/.test(c.remede || "")) throw new Error("le remède ne nomme ni le sas ni le geste qui le vide");
  });

  check("LOT-SAS vert — un lot au nom PSEUDONYMISÉ à la racine : sortie normale du sas, PASS", () => {
    const c = constat(verifier(join(boite, "Produit-01 - RETOURS - 20260914a.md"), CORPS), "LOT-SAS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — un lot accueilli est accusé`);
  });

  check("LOT-SAS vert — le même lot au nom réel DANS le sas : PASS, c'est sa place", () => {
    const c = constat(verifier(join(arrivee, "CalculatriceZorglubZAP - RETOURS - 20260914a.md"), CORPS), "LOT-SAS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  {
    const { accueillir } = await import("../todo/accueillir-lot.mjs");
    writeFileSync(join(arrivee, "CalculatriceZorglubZAP - RETOURS - 20260914b.md"), CORPS, "utf8");
    const r = accueillir({ arrivee, boite });
    const depose = readdirSync(boite).find((n) => /RETOURS - 20260914b\.md$/.test(n));
    check("LOT-SAS remède joué — après `accueillir-lot`, le lot redéposé à la racine rend PASS", () => {
      if (!depose) throw new Error(`le remède n'a rien déposé à la racine — ${JSON.stringify(r).slice(0, 200)}`);
      const c = constat(verifier(join(boite, depose)), "LOT-SAS");
      if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — le gardien refuse le geste qu'il prescrit (classe TF-1013)`);
    });
  }

  check("LOT-SAS borne — tables introuvables : SANS_OBJET, et le motif est DIT", () => {
    process.env.FORGE_NOMS_INTERDITS = join(T, "absente.json");
    const c = constat(verifier(join(boite, "CalculatriceZorglubZAP - RETOURS - 20260914a.md"), CORPS), "LOT-SAS");
    if (!c || c.statut !== "SANS_OBJET" || !/introuvables/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — un juge sans table ne doit ni accuser ni absoudre en silence`);
  });

  check("LOT-SAS borne — un lot hors de la boîte du pilot (chez le produit) : SANS_OBJET", () => {
    const c = constat(verifier(join(T, "forge", "retours", "PROD - RETOURS - 20260914a.md"), CORPS), "LOT-SAS");
    if (!c || c.statut !== "SANS_OBJET") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  for (const [k, v] of [["FORGE_NOMS_INTERDITS", avant.c], ["FORGE_PRODUITS_PSEUDO", avant.p]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- LOT-IDS (TF-1039) : UN IDENTIFIANT DE RETOUR N'EST JAMAIS REPRIS ----------------------
//
// Le cas du 11/09 rejoué en miniature : un lot antérieur définit RT-50, le suivant le reprend.
// Le cas vert est le REMÈDE que le message prescrit, lu dans le message lui-même (TF-1013).
{
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const T = mkdtempSync(join(tmpdir(), "lot-ids-"));
  const CORPS = (lignes) => "# lot\n\n| Réf | gravité | retour |\n|---|---|---|\n" + lignes + "\n" + R45 + "\n" + R46;
  writeFileSync(join(T, "PROD - RETOURS - 20260914a.md"), CORPS("| RT-49 | majeur | un |\n| RT-50 | mineur | deux |"), "utf8");
  const suivant = join(T, "PROD - RETOURS - 20260914b.md");
  let remede = "";

  check("LOT-IDS rouge — un lot reprend RT-50, défini par un lot antérieur du même produit : FAIL, premier libre donné", () => {
    const c = constat(verifier(suivant, CORPS("| RT-50 | majeur | autre chose |")), "LOT-IDS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — la reprise d'un identifiant passe encore`);
    if (!/RT-50 \(PROD - RETOURS - 20260914a\.md\)/.test(c.message)) throw new Error("le message ne nomme pas le lot qui porte déjà l'identifiant");
    if (!/RT-51/.test(c.remede || "")) throw new Error(`le remède ne donne pas le premier libre : ${c.remede}`);
    remede = /RT-\d+/.exec(c.remede)[0];
  });

  check("LOT-IDS remède joué — le lot renuméroté au premier libre qu'on lui a donné : PASS", () => {
    const c = constat(verifier(suivant, CORPS(`| ${remede || "RT-51"} | majeur | autre chose |`)), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — le gardien refuse le numéro qu'il prescrit`);
  });

  check("LOT-IDS vert — un identifiant CITÉ dans la prose n'est pas repris : PASS", () => {
    const c = constat(verifier(suivant, CORPS("| RT-51 | majeur | suite de RT-50, déjà remonté |") + "\nComme dit en RT-50.\n"), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — une citation est prise pour une définition`);
  });

  check("LOT-IDS vert — un tableau de RAPPEL (RT-50 en tête de ligne, sans gravité) ne redéfinit rien : PASS", () => {
    const c = constat(verifier(suivant, CORPS("| RT-51 | majeur | neuf |") + "\n| Retour antérieur | Ce que ce lot ajoute |\n|---|---|\n| **RT-50** | le complète |\n"), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — un rappel est pris pour une reprise (faux positif mesuré sur un lot réel du 26/08)`);
  });

  check("LOT-IDS rouge — la graphie à zéros (RT-050) désigne le même retour", () => {
    const c = constat(verifier(suivant, CORPS("| RT-050 | majeur | x |")), "LOT-IDS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  check("LOT-IDS borne — le lot ANTÉRIEUR n'est pas accusé par son successeur", () => {
    writeFileSync(suivant, CORPS("| RT-50 | majeur | autre chose |"), "utf8");
    const c = constat(verifier(join(T, "PROD - RETOURS - 20260914a.md")), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — c'est le suivant qui reprend, pas le premier`);
  });

  check("LOT-IDS borne — un AUTRE produit peut porter RT-50 : PASS", () => {
    const c = constat(verifier(join(T, "AUTRE - RETOURS - 20260914c.md"), CORPS("| RT-50 | majeur | x |")), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — l'unicité est par produit`);
  });

  check("LOT-IDS borne — un lot antérieur au 14/09 : SANS_OBJET, antériorité dite", () => {
    writeFileSync(join(T, "PROD - RETOURS - 20260910a.md"), CORPS("| RT-50 | x | y |"), "utf8");
    const c = constat(verifier(join(T, "PROD - RETOURS - 20260911a.md"), CORPS("| RT-50 | x | y |")), "LOT-IDS");
    if (!c || c.statut !== "SANS_OBJET" || !/antériorité/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- TF-1458 (28/09/2026) : LOT-IDS AU SAS, OÙ LE LOT PORTE ENCORE SON NOM RÉEL -----------------
//
// Au sas d'arrivée, le lot porte le nom RÉEL de son produit ; la boîte d'entrée (`00-retours\` et
// son `old\`) ne porte que des pseudonymes. Comparer les préfixes TELS QUELS ne trouvait donc
// JAMAIS de voisin, pour aucun produit — `idsEnDouble` pseudonymise désormais le préfixe du lot
// jugé avant de le comparer.
{
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const T = mkdtempSync(join(tmpdir(), "lot-ids-sas-"));
  const avant = { c: process.env.FORGE_NOMS_INTERDITS, p: process.env.FORGE_PRODUITS_PSEUDO };
  writeFileSync(join(T, "_noms.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: { "CalculatriceZorglubZAP": "Produit-01" } }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(T, "_noms.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(T, "_prod.json");
  const boite = join(T, "input", "00-retours"), arrivee = join(boite, "_arrivee");
  mkdirSync(arrivee, { recursive: true });
  const CORPS = (lignes) => "# lot\n\n| Réf | gravité | retour |\n|---|---|---|\n" + lignes + "\n" + R45 + "\n" + R46;
  // Le voisin PSEUDONYMISÉ, déjà ingéré, vit à la racine de la boîte — jamais au sas.
  writeFileSync(join(boite, "Produit-01 - RETOURS - 20260913a.md"), CORPS("| RT-50 | mineur | deux |"), "utf8");

  check("TF-1458 rouge — au sas, le lot au nom RÉEL qui reprend RT-50 d'un voisin PSEUDONYMISÉ est attrapé : FAIL", () => {
    const chemin = join(arrivee, "CalculatriceZorglubZAP - RETOURS - 20260914a.md");
    const c = constat(verifier(chemin, CORPS("| RT-50 | majeur | reprise |")), "LOT-IDS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — au sas, aucun voisin n'était jamais retrouvé`);
    if (!/Produit-01 - RETOURS - 20260913a\.md/.test(c.message)) throw new Error(`le voisin pseudonymisé n'est pas nommé : ${c && c.message}`);
  });

  check("TF-1458 vert — au sas, un identifiant NEUF ne reprend rien : PASS", () => {
    const chemin = join(arrivee, "CalculatriceZorglubZAP - RETOURS - 20260914a.md");
    const c = constat(verifier(chemin, CORPS("| RT-51 | majeur | neuf |")), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  for (const [k, v] of [["FORGE_NOMS_INTERDITS", avant.c], ["FORGE_PRODUITS_PSEUDO", avant.p]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- TF-1813 (15/10/2026) : LOT-IDS CHEZ LE PRODUIT LIT AUSSI LES COPIES REÇUES PAR LE PILOT ------
//
// Le pilot renumérote parfois un identifiant à la réception (R-49, « Note de réception du pilot » en
// tête de SA copie). Mesuré chez Produit-64 : son lot 20261012b porte RT-32 chez lui, RT-58 au pilot ;
// le lot 20261015a reprenait RT-58 et a été refusé. Rouge : le lot du produit qui reprend RT-58, défini
// par la seule copie du pilot (sous pseudonyme), est attrapé. Vert : un numéro neuf passe ; le voisin
// du produit au nom RÉEL est toujours lu quand le préfixe se pseudonymise (cas du relais, TF-1759).
// Bord : pilot introuvable → AVERTISSEMENT « vérification partielle », jamais d'échec.
{
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const T = mkdtempSync(join(tmpdir(), "lot-ids-pilot-"));
  const avant = { c: process.env.FORGE_NOMS_INTERDITS, p: process.env.FORGE_PRODUITS_PSEUDO, r: process.env.FORGE_ROOT };
  writeFileSync(join(T, "_noms.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: { "CalculatriceZorglubZAP": "Produit-01" } }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(T, "_noms.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(T, "_prod.json");
  const CORPS = (lignes) => "# lot\n\n| Réf | gravité | retour |\n|---|---|---|\n" + lignes + "\n" + R45 + "\n" + R46;
  const boite = join(T, "parc", "digit-ai-factory", "input", "00-retours");
  mkdirSync(join(boite, "old"), { recursive: true });
  mkdirSync(join(T, "parc", "digit-ai-factory", "todo"), { recursive: true });
  const retours = join(T, "parc", "CalculatriceZorglubZAP", "forge", "retours");
  mkdirSync(retours, { recursive: true });
  writeFileSync(join(retours, "CalculatriceZorglubZAP - RETOURS - 20261012b.md"), CORPS("| RT-32 | majeur | un |"), "utf8");
  writeFileSync(join(boite, "old", "Produit-01 - RETOURS - 20261012b.md"),
    "> Note de réception du pilot : RT-32 renuméroté RT-58 (R-49).\n\n" + CORPS("| RT-58 | majeur | un |"), "utf8");
  const lotNeuf = join(retours, "CalculatriceZorglubZAP - RETOURS - 20261015a.md");
  process.env.FORGE_ROOT = join(T, "parc");

  check("TF-1813 rouge — le lot du produit reprend RT-58, défini par la seule copie du PILOT (renumérotée) : FAIL", () => {
    const c = constat(verifier(lotNeuf, CORPS("| RT-58 | majeur | reprise |")), "LOT-IDS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
    if (!/Produit-01 - RETOURS - 20261012b\.md/.test(c.message)) throw new Error(`la copie du pilot n'est pas nommée : ${c.message}`);
    if (!/RT-59/.test(c.remede || "")) throw new Error(`premier libre attendu RT-59 : ${c.remede}`);
  });
  check("TF-1813 rouge — RT-32 du voisin au nom RÉEL reste lu, le préfixe pseudonymisé ne le fait pas perdre", () => {
    const c = constat(verifier(lotNeuf, CORPS("| RT-32 | majeur | reprise |")), "LOT-IDS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("TF-1813 vert — un numéro neuf (RT-59) ne reprend rien, chez le produit ni au pilot : PASS", () => {
    const c = constat(verifier(lotNeuf, CORPS("| RT-59 | majeur | neuf |")), "LOT-IDS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("TF-1813 bord — pilot introuvable : AVERTISSEMENT « vérification partielle », le verdict n'échoue pas pour cela", () => {
    process.env.FORGE_ROOT = join(T, "nulle-part");
    const r = verifier(join(T, "seul", "forge", "retours", "SEUL - RETOURS - 20261015a.md"), CORPS("| RT-1 | majeur | x |"));
    const c = constat(r, "LOT-IDS");
    if (!c || c.statut !== "AVERTISSEMENT" || !/partielle/i.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });

  for (const [k, v] of [["FORGE_NOMS_INTERDITS", avant.c], ["FORGE_PRODUITS_PSEUDO", avant.p], ["FORGE_ROOT", avant.r]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- R-57 et LOT-MURS (24/09/2026, au main le 28/09) : UN DOCUMENT MÛR REMONTE, OU SON MAINTIEN S'ÉCRIT
//
// La section se juge comme R-45 et R-46, dans les deux sens. La MESURE se rejoue sur un produit
// jetable : un `output\` où un objet compte cinq versions datées (dont une en `old\`) et un autre
// deux. Le lot est daté après l'entrée en vigueur : le verdict d'ensemble y porte aussi LOT-DATE
// tant que l'horloge n'a pas rejoint la date du nom — les cas lisent donc LEUR constat, jamais le
// verdict d'ensemble.
{
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { SEUIL_MUR, documentsMurs } = await import("./oracle-lot-retours.mjs");
  const P = mkdtempSync(join(tmpdir(), "lot-murs-"));
  const retours = join(P, "forge", "retours");
  mkdirSync(retours, { recursive: true });
  mkdirSync(join(P, "output", "05-Kits"), { recursive: true });
  mkdirSync(join(P, "output", "old"), { recursive: true });
  for (const i of ["a", "b", "c", "d"]) writeFileSync(join(P, "output", "old", `Marque - Guide développeur - 2026090${i === "a" ? 1 : i === "b" ? 2 : i === "c" ? 3 : 4}${i}.html`), "<p>v</p>");
  writeFileSync(join(P, "output", "05-Kits", "Marque - Guide développeur - 20260910a.html"), "<p>v</p>");
  for (const d of ["20260901a", "20260902a"]) writeFileSync(join(P, "output", "05-Kits", `Marque - Note brève - ${d}.html`), "<p>v</p>");
  const R57 = (corps) => `## Documents mûrs\n\n${corps}\n`;
  const CORPS = (r57) => "# lot\n\n" + R45 + "\n" + R46 + "\n" + r57;
  const apres = join(retours, "PROD - RETOURS - 20260930a.md");

  check("R-57 rouge — section absente d'un lot postérieur au seuil : FAIL, le remède donne le TITRE exact", () => {
    const c = constat(verifier(apres, CORPS("")), "R-57");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
    if (!/## Documents mûrs/.test(c.remede || "")) throw new Error("le remède ne donne pas le titre à écrire");
    if (!/aucun document mûr/i.test(c.remede)) throw new Error("le remède ne dit pas quoi écrire quand il n'y a rien");
  });

  check("R-57 rouge — section présente mais VIDE : l'omission ne vaut pas décision", () => {
    const c = constat(verifier(apres, CORPS(R57("(à voir)"))), "R-57");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  check("R-57 vert — la déclaration d'absence vaut réponse (loi n° 3)", () => {
    const c = constat(verifier(join(tmpdir(), "PROD - RETOURS - 20260930b.md"), CORPS(R57("Aucun document mûr sur ce lot."))), "R-57");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  check("mesure — 5 versions datées (dont une en old\\) font un document mûr, 2 n'en font pas", () => {
    const m = documentsMurs(P);
    if (SEUIL_MUR !== 5) throw new Error(`seuil dérivé : ${SEUIL_MUR}`);
    if (!m || m.length !== 1 || m[0].versions !== 5 || !/Guide développeur/.test(m[0].objet)) throw new Error(JSON.stringify(m));
  });

  check("LOT-MURS rouge — chez le produit, un document mûr que le lot TAIT : FAIL, et il est nommé", () => {
    const c = constat(verifier(apres, CORPS(R57("Aucun document mûr."))), "LOT-MURS");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — la déclaration d'absence ne couvre pas un document mesuré`);
    if (!/Guide développeur/.test(c.message) || /Note brève/.test(c.message)) throw new Error(`nomme mal : ${c.message}`);
  });

  check("LOT-MURS vert — le même document NOMMÉ avec son verdict, graphie sans accents : PASS", () => {
    const r = verifier(apres, CORPS(R57("| guide developpeur | 5 versions | remonté : famille gd-guide-de-reference |")));
    const c = constat(r, "LOT-MURS"), s = constat(r, "R-57");
    if (!c || c.statut !== "PASS") throw new Error(`LOT-MURS ${c ? c.statut : "absent"} — ${c && c.message}`);
    if (!s || s.statut !== "PASS") throw new Error(`R-57 ${s ? s.statut : "absent"}`);
  });

  check("LOT-MURS vert — déclaré par un lot ANTÉRIEUR du même produit : la déclaration se fait une fois", () => {
    writeFileSync(join(retours, "PROD - RETOURS - 20260929a.md"), CORPS(R57("Guide développeur — reste au produit, parce que sa forme est celle de gd-guide-de-reference.")), "utf8");
    const c = constat(verifier(apres, CORPS(R57("Aucun document mûr nouveau."))), "LOT-MURS");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });

  check("LOT-MURS borne — à la porte du pilot (lot hors d'un produit) : SANS_OBJET, et dit", () => {
    const c = constat(verifier(join(tmpdir(), "00-retours", "PROD - RETOURS - 20260930a.md"), CORPS(R57("Aucun document mûr."))), "LOT-MURS");
    if (!c || c.statut !== "SANS_OBJET" || !/chez le produit/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  check("R-57 borne — un lot du 28/09, jour où la règle entre au main, n'est pas accusé : antériorité déclarée", () => {
    const r = verifier(join(retours, "PROD - RETOURS - 20260928a.md"), "# lot\n\n" + R45 + "\n" + R46);
    for (const regle of ["R-57", "LOT-MURS"]) {
      const c = constat(r, regle);
      if (!c || c.statut !== "SANS_OBJET" || !/antériorité/.test(c.message)) throw new Error(`${regle} ${c ? c.statut : "absent"}`);
    }
    if (SEUILS["R-57"] !== "20260929") throw new Error("seuil R-57 dérivé");
  });

  try { rmSync(P, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- GFP-LOT (TF-1526) : LE GARDE-FOU DE PLATEFORME RELEVÉ, MÊME FORME QUE R-45/R-46/R-57 -------
{
  const GFP = (corps) => `## Garde-fou de plateforme relevé\n\n${corps}\n`;
  const CORPS_GFP = (gfp) => "# lot\n\n" + R45 + "\n" + R46 + "\n" + GFP(gfp);
  const AUJOURDHUI = "20261002";

  check("GFP-LOT rouge — section absente d'un lot du jour d'entrée en vigueur : FAIL, le remède donne le TITRE exact", () => {
    const c = constat(verifier(lot("20261002a"), "# lot\n\n" + R45 + "\n" + R46, { aujourdhui: AUJOURDHUI }), "GFP-LOT");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
    if (!/## Garde-fou de plateforme relevé/.test(c.remede || "")) throw new Error("le remède ne donne pas le titre à écrire");
    if (!/aucun garde-fou de plateforme relevé/i.test(c.remede)) throw new Error("le remède ne dit pas quoi écrire quand il n'y a rien");
  });

  check("GFP-LOT rouge — section présente mais VIDE : l'omission ne vaut pas décision", () => {
    const c = constat(verifier(lot("20261002a"), CORPS_GFP("(à voir)"), { aujourdhui: AUJOURDHUI }), "GFP-LOT");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  check("GFP-LOT vert — la déclaration d'absence vaut réponse (loi n° 3)", () => {
    const c = constat(verifier(lot("20261002a"), CORPS_GFP("Aucun garde-fou de plateforme relevé sur ce lot."), { aujourdhui: AUJOURDHUI }), "GFP-LOT");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });

  check("GFP-LOT vert — un identifiant GFP-nnn CONFIRMÉ du registre : PASS", () => {
    const c = constat(verifier(lot("20261002a"), CORPS_GFP("GFP-001 confirmé par ce relevé, le 2026-10-02."), { aujourdhui: AUJOURDHUI }), "GFP-LOT");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });

  check("GFP-LOT vert — un garde-fou NOUVEAU décrit par ses champs : PASS", () => {
    const c = constat(verifier(lot("20261002a"),
      CORPS_GFP("nouveau garde-fou — plateforme azure, mécanisme Azure Policy, effet Deny, portée souscription, "
        + "vise Microsoft.Web/sites/config, refuse l'écriture sans authentification active, relevé le 2026-10-01."),
      { aujourdhui: AUJOURDHUI }), "GFP-LOT");
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });

  check("GFP-LOT borne — un lot du 01/10, jour d'AVANT l'entrée en vigueur, n'est pas accusé : antériorité déclarée", () => {
    const c = constat(verifier(lot("20261001a"), "# lot\n\n" + R45 + "\n" + R46, { aujourdhui: AUJOURDHUI }), "GFP-LOT");
    if (!c || c.statut !== "SANS_OBJET" || !/antériorité/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"}`);
    if (SEUILS["GFP-LOT"] !== "20261002") throw new Error("seuil GFP-LOT dérivé");
  });
}

// ---- TF-1570 : LE DÉLAI DE GRÂCE D'UNE RÈGLE NEUVE ---------------------------------------------
// Le fait : R-57 est entrée le 28/09, la porte l'a appliquée dès le 29/09, et deux produits dont l'héritage
// n'était pas encore rafraîchi ont vu refuser le 01/10 des lots conformes à leur outillage. Une règle de
// section dont le seuil est postérieur à DATE_GRACE avertit pendant GRACE_JOURS jours, puis bloque. Aucune
// règle réelle n'est encore dans ce cas : le banc simule l'entrée d'une règle neuve en déplaçant le seuil
// de GFP-LOT (objet exporté), puis le restaure.
{
  const { GRACE_JOURS, DATE_GRACE, jourPlus } = await import("./oracle-lot-retours.mjs");
  const SANS_GFP = "# lot\n\n" + R45 + "\n" + R46 + "\n## Documents mûrs\n\nAucun document mûr.\n";
  const SEUIL_AVANT = SEUILS["GFP-LOT"];
  const NEUF = "20261020";
  const jouer = (jour) => {
    SEUILS["GFP-LOT"] = NEUF;
    try { const r = verifier(lot(`${jour}a`), SANS_GFP, { aujourdhui: "20261101" }); return { c: constat(r, "GFP-LOT"), verdict: r.verdict }; }
    finally { SEUILS["GFP-LOT"] = SEUIL_AVANT; }
  };
  check("TF-1570 — jourPlus : 20261020 + 7 = 20261027, et la fin de mois passe", () => {
    if (jourPlus("20261020", 7) !== "20261027" || jourPlus("20261030", 3) !== "20261102" || jourPlus("20261027", -1) !== "20261026") throw new Error("calcul de date faux");
    if (GRACE_JOURS !== 7 || DATE_GRACE !== "20261013") throw new Error("paramètres de grâce dérivés");
  });
  check("TF-1570 rouge→avertissement — règle neuve, section absente, lot du jour du seuil : AVERTISSEMENT, verdict inchangé, la fin de grâce est dite", () => {
    const { c, verdict } = jouer(NEUF);
    if (!c || c.statut !== "AVERTISSEMENT") throw new Error(`statut ${c ? c.statut : "absent"}`);
    if (!/délai de grâce/.test(c.message) || !/20261026/.test(c.message)) throw new Error(`la grâce ne dit pas jusqu'où : ${c.message}`);
    if (verdict !== "PASS") throw new Error(`un lot en grâce ne doit pas être bloqué : verdict ${verdict}`);
  });
  check("TF-1570 — dernier jour de grâce (seuil + 6 jours) : encore AVERTISSEMENT", () => {
    const { c } = jouer("20261026");
    if (!c || c.statut !== "AVERTISSEMENT") throw new Error(`statut ${c ? c.statut : "absent"}`);
  });
  check("TF-1570 vert→FAIL — la grâce FINIT : un lot daté du seuil + 7 jours est refusé comme avant", () => {
    const { c, verdict } = jouer("20261027");
    if (!c || c.statut !== "FAIL" || /grâce/.test(c.message)) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
    if (verdict !== "FAIL") throw new Error(`verdict ${verdict}`);
  });
  check("TF-1570 borne — une règle d'AVANT DATE_GRACE (GFP-LOT, seuil réel du 02/10) n'a PAS de grâce : le jour du seuil est refusé", () => {
    const r = verifier(lot("20261002a"), SANS_GFP, { aujourdhui: "20261002" });
    const c = constat(r, "GFP-LOT");
    if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"} — une grâce rétroactive affaiblirait ce qui est tenu`);
    if (SEUILS["GFP-LOT"] !== "20261002") throw new Error("le seuil de GFP-LOT n'a pas été restauré");
  });
}

// ---- LOT-SIDECAR (TF-1591, TF-1602) : le sidecar jugé comme la porte le jugera -----------------
// Le fait : les lots Produit-02 du 03/10 ont été refusés pour « classe-a-creer sans classe_proposee »,
// que ce juge ne regardait pas — le produit avait rendu PASS. Chaque règle rejouée a son cas rouge ET
// son cas vert ; la règle entre en AVERTISSEMENT (jamais en blocage, précédent D-70 (b)).
{
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const ICI_S = dirname(fileURLToPath(import.meta.url));
  const { spawnSync: spawnSyncS } = await import("node:child_process");
  const REF = JSON.parse(readFileSync(join(ICI_S, "..", "todo", "CLASSES.json"), "utf8"));
  const EXISTANTE = REF.classes[0], FAMILLE = REF.classes[0].famille;
  const D = mkdtempSync(join(tmpdir(), "lot-sidecar-"));
  const AUJ = "20261013";
  const R57S = "## Documents mûrs\n\nAucun document mûr.\n", GFPS = "## Garde-fou de plateforme relevé\n\nAucun garde-fou de plateforme relevé.\n";
  const lotMd = (extra = "") => `# lot\n\n${R45}\n${R46}\n${R57S}\n${GFPS}\n${extra}`;
  const ligne = (o = {}) => JSON.stringify({ schema: 1, demandeur: "Produit-02-essai", date_demande: "2026-10-13", source: "lot d'essai",
    titre: "factory : un retour d'essai", contenu: "un contenu d'essai", forges_cibles_initiales: ["digit-ai-factory"], classe: EXISTANTE.cle, ...o });
  let n = 0;
  /** Écrit un lot et son sidecar sous un nom frais ; rend le constat LOT-SIDECAR et le verdict. */
  const jouer = (lignes, { md = lotMd(), date = AUJ, sansSidecar = false } = {}) => {
    n++;
    const base = join(D, `PROD - RETOURS - ${date}${String.fromCharCode(96 + n)}`);
    writeFileSync(`${base}.md`, md, "utf8");
    if (!sansSidecar) writeFileSync(`${base}.tf.jsonl`, lignes.join("\n") + "\n", "utf8");
    const r = verifier(`${base}.md`, md, { aujourdhui: AUJ });
    return { c: constat(r, "LOT-SIDECAR"), verdict: r.verdict };
  };
  const avert = (res, motif) => {
    if (!res.c || res.c.statut !== "AVERTISSEMENT") throw new Error(`statut ${res.c ? res.c.statut : "absent"} — ${res.c && res.c.message}`);
    if (motif && !motif.test(res.c.message)) throw new Error(`le motif attendu ${motif} n'est pas dit : ${res.c.message}`);
    if (res.verdict !== "PASS") throw new Error(`un AVERTISSEMENT ne doit jamais bloquer : verdict ${res.verdict}`);
  };
  const passe = (res) => { if (!res.c || res.c.statut !== "PASS") throw new Error(`statut ${res.c ? res.c.statut : "absent"} — ${res.c && res.c.message}`); };

  check("LOT-SIDECAR rouge — le cas du 03/10 : « classe-a-creer » SANS classe_proposee est signalé, et le lot n'est pas bloqué", () => {
    avert(jouer([ligne({ classe: "classe-a-creer" })]), /classe_proposee complète — manque cle, famille, libelle/);
  });
  check("LOT-SIDECAR rouge — une classe_proposee INCOMPLÈTE nomme ce qui manque", () => {
    avert(jouer([ligne({ classe: "classe-a-creer", classe_proposee: { cle: "ma-cle-neuve", famille: FAMILLE } })]), /manque libelle/);
  });
  check("LOT-SIDECAR vert — le remède joué : classe_proposee complète, clé neuve, famille connue, clé nommée dans le .md → PASS", () => {
    const cle = "regle-neuve-essai";
    passe(jouer([ligne({ classe: "classe-a-creer", classe_proposee: { cle, famille: FAMILLE, libelle: "Un défaut neuf d'essai" } })],
      { md: lotMd(`## La règle qui aurait évité le retour\n\n${cle} (${FAMILLE}) : un défaut neuf d'essai\n`) }));
  });
  check("LOT-SIDECAR rouge — la clé proposée n'est pas nommée dans le .md du lot", () => {
    avert(jouer([ligne({ classe: "classe-a-creer", classe_proposee: { cle: "cle-absente-du-md", famille: FAMILLE, libelle: "x" } })]), /n'est pas nommée dans le \.md/);
  });
  check("LOT-SIDECAR rouge — la famille de la classe proposée est inconnue", () => {
    avert(jouer([ligne({ classe: "classe-a-creer", classe_proposee: { cle: "cle-neuve-2", famille: "famille-inventee", libelle: "x" } })],
      { md: lotMd("cle-neuve-2") }), /famille « famille-inventee » .* inconnue/);
  });
  check("LOT-SIDECAR rouge — la clé proposée EXISTE déjà au référentiel", () => {
    avert(jouer([ligne({ classe: "classe-a-creer", classe_proposee: { cle: EXISTANTE.cle, famille: FAMILLE, libelle: "x" } })],
      { md: lotMd(EXISTANTE.cle) }), /EXISTE déjà/);
  });
  check("LOT-SIDECAR vert — une classe existante du référentiel : PASS", () => passe(jouer([ligne()])));
  check("LOT-SIDECAR rouge — une classe INCONNUE, avec la sortie conforme proposée", () => {
    avert(jouer([ligne({ classe: "classe-qui-n-existe-pas" })]), /inconnue du référentiel .*classe-a-creer/);
  });
  check("LOT-SIDECAR rouge — classe MANQUANTE d'un lot daté du 03/09 ou après", () => {
    const sans = JSON.parse(ligne()); delete sans.classe;
    avert(jouer([JSON.stringify(sans)]), /classe manquante/);
  });
  check("LOT-SIDECAR rouge — champ obligatoire manquant, JSON invalide, id présent, caractère de contrôle : chacun nommé", () => {
    const sansDem = JSON.parse(ligne()); delete sansDem.demandeur;
    avert(jouer([JSON.stringify(sansDem), "{ pas du json", ligne({ id: "RT-1" }), ligne({ titre: "avec un octet nul \u0000 dedans" })]),
      /champ demandeur manquant.*JSON invalide.*JAMAIS d'id.*caractère de contrôle U\+0000/);
  });
  check("LOT-SIDECAR vert — une ligne de rectification n'a pas de classe à porter", () => {
    passe(jouer([ligne({ rectifie: "TF-0001", nature_de_la_rectification: "annule", classe: undefined })]));
  });
  check("LOT-SIDECAR borne — un sidecar au format R10 BRUT (sans schema) est normalisé par le pilot : non jugé, et dit", () => {
    const res = jouer([JSON.stringify({ id: "RT-1", gravite: "mineur", titre: "x", preuve: "y", proposition: "z" })]);
    passe(res);
    if (!/non jugées/.test(res.c.message)) throw new Error(`le PASS ne dit pas qu'il n'a rien jugé : ${res.c.message}`);
  });
  check("LOT-SIDECAR borne — sidecar absent : SANS_OBJET, et dit", () => {
    const res = jouer([], { sansSidecar: true });
    if (!res.c || res.c.statut !== "SANS_OBJET" || !/absent/.test(res.c.message)) throw new Error(`statut ${res.c ? res.c.statut : "absent"}`);
  });
  // TF-1814 (2) (15/10/2026) — LA PRÉDICTION N'EST EXEMPTÉE QUE LÀ OÙ LA PORTE L'EST. Le juge rendait
  // SANS_OBJET sur tout lot daté d'avant le 13/10 ; la porte, elle, juge ces lots : un lot daté du 25/09,
  // remis le 15/10 sans classe, a été refusé (classe exigée dès le 03/09). Rouge : ce lot est signalé.
  // Vert : un lot daté d'avant le 03/09 sans classe passe, comme à la porte.
  check("LOT-SIDECAR rouge — TF-1814 : un lot daté du 25/09 SANS classe est signalé, la porte le refusant", () => {
    const sans = JSON.parse(ligne()); delete sans.classe;
    avert(jouer([JSON.stringify(sans)], { date: "20260925" }), /classe manquante/);
  });
  check("LOT-SIDECAR vert — TF-1814 : un lot daté du 02/09 sans classe passe, la porte n'exigeant la classe que dès le 03/09", () => {
    const sans = JSON.parse(ligne()); delete sans.classe;
    passe(jouer([JSON.stringify(sans)], { date: "20260902" }));
  });
  // TF-1814 (1) — le verdict PASS d'un lot que la porte REFUSERA ne se lit plus « PASS » tout court :
  // le résultat porte `refus_predit`, que la ligne de verdict de la CLI dit en toutes lettres.
  check("LOT-SIDECAR rouge — TF-1814 : un refus prédit est porté au résultat (refus_predit) et dit sur la ligne de verdict", () => {
    const base = join(D, "PROD - RETOURS - 20261013y");
    writeFileSync(`${base}.md`, lotMd(), "utf8");
    writeFileSync(`${base}.tf.jsonl`, ligne({ classe: "classe-qui-n-existe-pas" }) + "\n", "utf8");
    const r = verifier(`${base}.md`, lotMd(), { aujourdhui: AUJ });
    if (r.refus_predit !== true) throw new Error(`refus_predit ${r.refus_predit}`);
    const cli = spawnSyncS(process.execPath, [join(ICI_S, "oracle-lot-retours.mjs"), `${base}.md`], { encoding: "utf8" });
    if (!/^verdict : PASS[^\n]*la porte du pilot REFUSERA ce lot/m.test(cli.stdout || "")) throw new Error(`ligne de verdict : ${(cli.stdout || "").split("\n").find((l) => /^verdict/.test(l))}`);
    const ok = join(D, "PROD - RETOURS - 20261013z");
    writeFileSync(`${ok}.md`, lotMd(), "utf8");
    writeFileSync(`${ok}.tf.jsonl`, ligne() + "\n", "utf8");
    if (verifier(`${ok}.md`, lotMd(), { aujourdhui: AUJ }).refus_predit) throw new Error("refus prédit sur un sidecar conforme");
  });
  try { rmSync(D, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

// ---- TF-1473 : un IMPORT sans fichier de script (node -e) ne doit pas exécuter la CLI ---------
// La garde d'exécution directe comparait import.meta.url à endsWith(process.argv[1] || "") : un
// argv[1] VIDE (cas de `node -e "import(...)"`, où aucun fichier n'est passé en argument) rend
// endsWith("") toujours vrai, donc la CLI s'exécutait quand même, affichait l'usage et sortait en 2.
{
  const { spawnSync } = await import("node:child_process");
  const { dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const ICI = dirname(fileURLToPath(import.meta.url));
  check("TF-1473 — importé depuis `node -e` (argv[1] vide), le module ne se prend plus pour la CLI", () => {
    const code = `import(${JSON.stringify("file://" + ICI.split("\\").join("/") + "/oracle-lot-retours.mjs")}).then(m => { console.log("IMPORT_OK", typeof m.verifier); });`;
    const r = spawnSync(process.execPath, ["-e", code], { encoding: "utf8" });
    if (r.status !== 0) throw new Error(`exit ${r.status} — l'import seul déclenche la CLI (usage + exit 2) : ${(r.stdout || "") + (r.stderr || "")}`);
    if (!/IMPORT_OK function/.test(r.stdout || "")) throw new Error(`sortie inattendue : ${r.stdout}`);
  });
}

// ---- TF-1752 (15/10/2026) : « gabarit non marqué » RATTACHE un document à son gabarit (R-46) ----------
// Un gabarit venu d'ailleurs n'émet aucun `gd-…` ; le gabarit des lots prescrit alors la formule
// « gabarit non marqué : <chemin> ». Vert : elle vaut rattachement, même sans le mot « version ». Rouge :
// une section qui ne porte ni rattachement ni déclaration d'absence reste refusée.
check("verte TF-1752 — « gabarit non marqué : <chemin> » vaut rattachement R-46", () => {
  const c = constat(verifier(lot("20261015a"), `# lot\n\n${R45}\n## Retours sur les documents produits\n\n| rapport | gabarit non marqué : kit-audit/rapport.md | section absente |\n`, { aujourdhui: "20261015" }), "R-46");
  if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
});
check("rouge TF-1752 — une section R-46 sans rattachement ni absence déclarée reste refusée", () => {
  const c = constat(verifier(lot("20261015a"), `# lot\n\n${R45}\n## Retours sur les documents produits\n\n| rapport | un gabarit quelconque | section absente |\n`, { aujourdhui: "20261015" }), "R-46");
  if (!c || c.statut !== "FAIL") throw new Error(`statut ${c ? c.statut : "absent"}`);
});

// ---- TF-1757 (15/10/2026) : « aucun item » AU REGISTRE SE PROUVE PAR LA RECHERCHE CITÉE, SANS BORNE -----
// Le 15/10, un retour déclaré « aucun item » doublonnait TF-1201 : `grep … | head -5` avait coupé la
// sixième ligne. Règle LOT-RATTACHEMENT, avertissante. Rouge : « aucun item » sans section Rattachement ;
// section sans commande citée ou sans « N ligne(s) trouvée(s) » ; commande bornée (head, -n,
// --max-count, Select-Object -First) sans total cité. Vert : commande sans borne et compte ; commande
// bornée avec son total ; lot qui ne déclare pas « aucun item » : sans objet.
{
  const base = `# lot\n\n${R45}\n${R46}\n| RT-1 | majeur | un retour, aucun item au registre du pilot |\n`;
  const RAT = (cmd, compte) => `\n## Rattachement\n\nRegistre interrogé le 15/10/2026 : \`${cmd}\` → ${compte}.\nItems recoupés : aucun.\n`;
  const lr = (txt) => constat(verifier(lot("20261015b"), txt, { aujourdhui: "20261015" }), "LOT-RATTACHEMENT");
  const av = (c, re) => { if (!c || c.statut !== "AVERTISSEMENT" || (re && !re.test(c.message))) throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`); };
  check("rouge TF-1757 — « aucun item » sans section Rattachement : avertissement", () => av(lr(base), /Rattachement/));
  check("rouge TF-1757 — section sans le compte « N ligne(s) trouvée(s) » : avertissement", () => av(lr(base + RAT('grep -n "stash" todo/TODO.jsonl', "rien")), /ligne\(s\) trouvée\(s\)/));
  check("rouge TF-1757 — commande bornée par head sans total cité : avertissement (le cas du 15/10)", () => av(lr(base + RAT('grep -n "README" todo/TODO.jsonl | head -5', "5 ligne(s) trouvée(s)")), /borne/));
  check("rouge TF-1757 — Select-Object -First sans total : avertissement", () => av(lr(base + RAT('Select-String README todo/TODO.jsonl | Select-Object -First 3', "3 ligne(s) trouvée(s)")), /borne/));
  check("verte TF-1757 — commande sans borne et compte cité : PASS", () => {
    const c = lr(base + RAT('grep -c "README" todo/TODO.jsonl', "7 ligne(s) trouvée(s)"));
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("verte TF-1757 — commande bornée AVEC son total cité : PASS", () => {
    const c = lr(base + RAT('grep -n "README" todo/TODO.jsonl | head -5', "5 ligne(s) trouvée(s) affichées sur un total de 12"));
    if (!c || c.statut !== "PASS") throw new Error(`statut ${c ? c.statut : "absent"} — ${c && c.message}`);
  });
  check("borne TF-1757 — un lot qui ne déclare pas « aucun item » : sans objet, et le verdict n'est jamais bloqué par la règle", () => {
    const r = verifier(lot("20261015b"), `# lot\n\n${R45}\n${R46}`, { aujourdhui: "20261015" });
    const c = constat(r, "LOT-RATTACHEMENT");
    if (!c || c.statut !== "SANS_OBJET") throw new Error(`statut ${c ? c.statut : "absent"}`);
    if (verifier(lot("20261015b"), base, { aujourdhui: "20261015" }).constats.some((x) => x.regle === "LOT-RATTACHEMENT" && x.statut === "FAIL")) throw new Error("la règle bloque");
  });
}

// ---- TF-1759 (15/10/2026) : LE PRODUIT JOUE LE MODULE DU PILOT PAR UN RELAIS, PLUS UNE COPIE -------
// Recopié chez chaque produit, le module entier dérivait de l'histoire du produit, et une copie jouée
// avant sa recopie a fait refuser deux lots (TF-1568, TF-1569). Vert : le relais posé chez un produit
// jetable rend le MÊME verdict et le même code que le module du pilot, dans les deux sens, en CLI comme
// à l'import. Rouge : pilot introuvable → exit 2 et le dit, jamais un PASS ; le contrat d'héritage fait
// voyager le relais, pas le module.
{
  const { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath, pathToFileURL } = await import("node:url");
  const { spawnSync } = await import("node:child_process");
  const ICI = dirname(fileURLToPath(import.meta.url));
  const T = mkdtempSync(join(tmpdir(), "lot-relais-"));
  const parc = join(T, "parc");
  mkdirSync(join(parc, "digit-ai-factory", "gabarits"), { recursive: true });
  copyFileSync(join(ICI, "oracle-lot-retours.mjs"), join(parc, "digit-ai-factory", "gabarits", "oracle-lot-retours.mjs"));
  const retours = join(parc, "ProduitJouet", "forge", "retours");
  mkdirSync(retours, { recursive: true });
  const relais = join(retours, "oracle-lot.mjs");
  copyFileSync(join(ICI, "oracle-lot-relais.mjs"), relais);
  const bon = join(retours, "PROD - RETOURS - 20260824a.md"), mauvais = join(retours, "PROD - RETOURS - 20260824b.md");
  writeFileSync(bon, `# lot\n\n${R45}\n${R46}`, "utf8");
  writeFileSync(mauvais, `# lot\n\n${R46}`, "utf8");
  const env = { ...process.env, FORGE_ROOT: parc };
  const cli = (f, e = env) => spawnSync(process.execPath, [relais, f, "--json"], { encoding: "utf8", cwd: join(parc, "ProduitJouet"), env: e });
  check("TF-1759 vert — par le relais, le même verdict et le même code que le module du pilot, dans les deux sens", () => {
    for (const [f, code] of [[bon, 0], [mauvais, 1]]) {
      const r = cli(f);
      const direct = verifier(f);
      if (r.status !== code) throw new Error(`exit ${r.status} au lieu de ${code} pour ${f} : ${r.stderr}`);
      if (JSON.parse(r.stdout).verdict !== direct.verdict) throw new Error(`verdict relais ${JSON.parse(r.stdout).verdict} ≠ module ${direct.verdict}`);
    }
  });
  check("TF-1759 vert — importé, le relais rend les fonctions du pilot", () => {
    const code = `import(${JSON.stringify(pathToFileURL(relais).href)}).then(m => console.log("IMPORT", typeof m.verifier, m.VERSION, m.verifier(${JSON.stringify(mauvais)}).verdict))`;
    const r = spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8", env });
    if (!/IMPORT function \d+\.\d+\.\d+ FAIL/.test(r.stdout || "")) throw new Error(`sortie : ${r.stdout}${r.stderr}`);
  });
  if (!require_absent_pilote()) console.log("  [NON JOUÉ] TF-1759 rouge pilot introuvable — ce poste porte c:\\dev\\digit-ai-factory ou ~\\.digit-ai-forge, que le relais trouve en repli");
  else check("TF-1759 rouge — pilot introuvable : exit 2 et le dit, jamais un PASS", () => {
    const seul = join(T, "seul", "forge", "retours");
    mkdirSync(seul, { recursive: true });
    copyFileSync(join(ICI, "oracle-lot-relais.mjs"), join(seul, "oracle-lot.mjs"));
    const r = spawnSync(process.execPath, [join(seul, "oracle-lot.mjs"), bon], { encoding: "utf8", env: { ...process.env, FORGE_ROOT: join(T, "nulle-part") } });
    if (r.status !== 2 || !/pilot introuvable/.test(r.stderr)) throw new Error(`exit ${r.status} : ${r.stdout}${r.stderr}`);
  });
  check("TF-1759 contrat — HERITAGE.json fait voyager le RELAIS sous forge/retours/oracle-lot.mjs", () => {
    const h = JSON.parse(readFileSync(join(ICI, "HERITAGE.json"), "utf8"));
    const a = h.artefacts.find((x) => x.cible === "forge/retours/oracle-lot.mjs");
    if (!a || a.source !== "gabarits/oracle-lot-relais.mjs" || a.mode !== "copie_conforme") throw new Error(`artefact : ${JSON.stringify(a)}`);
  });
  function require_absent_pilote() {
    // Le relais essaie aussi `c:\dev\digit-ai-factory` et `~\.digit-ai-forge` : sur un poste qui les porte,
    // le cas rouge se joue sur la seule résolution prioritaire, déjà prouvée par le cas vert.
    const { existsSync } = process.getBuiltinModule("node:fs");
    const { homedir } = process.getBuiltinModule("node:os");
    return ![join("c:\\dev\\digit-ai-factory", "gabarits", "oracle-lot-retours.mjs"), join(homedir(), ".digit-ai-forge", "digit-ai-factory", "gabarits", "oracle-lot-retours.mjs")].some((p) => existsSync(p));
  }
  try { rmSync(T, { recursive: true, force: true }); } catch { /* verrou toléré */ }
}

console.log(`\noracle-lot-retours (TF-0597) : ${pass} PASS, ${echec} FAIL`);
process.exit(echec ? 1 : 0);
