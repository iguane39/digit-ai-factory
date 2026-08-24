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

console.log(`\noracle-lot-retours (TF-0597) : ${pass} PASS, ${echec} FAIL`);
process.exit(echec ? 1 : 0);
