#!/usr/bin/env node
/**
 * journaliser.test.mjs — recette de `journaliser.mjs` (TF-0413).
 * Double sens sur les trois promesses de l'outil : il STAMPE, il REFUSE un `ts` fourni, il
 * ANNULE une écriture qui casserait le registre. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "journaliser.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "journaliser-"));
let nSerie = 0;
const lancer = (evenements, registre, extra = []) => {
  const f = join(T, `ev-${++nSerie}.json`);
  writeFileSync(f, JSON.stringify(evenements), "utf8");
  const r = spawnSync(process.execPath, [OUTIL, "--fichier", f, "--registre", registre, ...extra], { encoding: "utf8" });
  let corps = {};
  try { corps = JSON.parse(r.stdout || "{}"); } catch { /* laissé vide : le code de retour tranche */ }
  return { code: r.status, corps, brut: r.stdout || r.stderr || "" };
};

// La classe par défaut est une clé RÉELLE du référentiel : depuis A-11 (22/09/2026) une création
// sans classe est refusée au chemin d'écriture, et un fixtures qui contournerait la porte qu'on
// vient de poser rendrait vert ce qu'elle existe pour arrêter.
const creation = (sur = {}) => ({
  ev: "creation", id: "TF-9900", titre: "t", contenu: "c", demandeur: "humain — recette",
  source: "recette", date_demande: "2026-08-20", statut: "candidat",
  forges_cibles_initiales: ["digit-ai-factory"], classe: "oracle-faux-positif",
  score: { gain: 1, preuve: 1, effort: 1, valeur: 1 }, ...sur,
});

// ── 1. il stampe, et le ts stampé est du PASSÉ proche ───────────────────────
const r1 = join(T, "registre-1.jsonl");
writeFileSync(r1, "", "utf8");
check("stampe le ts — l'événement entre sans en porter un, il en ressort avec", () => {
  const avantAppel = Date.now();
  const r = lancer([creation()], r1);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.corps.message || r.brut.slice(0, 200)}`);
  const lignes = readFileSync(r1, "utf8").split("\n").filter(Boolean);
  if (lignes.length !== 1) throw new Error(`${lignes.length} ligne(s) écrite(s), 1 attendue`);
  const ts = Date.parse(JSON.parse(lignes[0]).ts);
  if (!Number.isFinite(ts)) throw new Error("ts absent ou illisible");
  if (ts < avantAppel - 1000 || ts > Date.now() + 1000)
    throw new Error(`ts hors de la fenêtre d'exécution — ${new Date(ts).toISOString()}`);
});

// ── 2. il refuse un ts fourni, SANS rien écrire ─────────────────────────────
const r2 = join(T, "registre-2.jsonl");
writeFileSync(r2, "", "utf8");
check("refuse un `ts` fourni — et n'écrit RIEN (le refus ne laisse pas de moitié)", () => {
  const r = lancer([creation(), creation({ id: "TF-9901", ts: "2026-08-20T23:00:00Z" })], r2);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/portent déjà un/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
  if (readFileSync(r2, "utf8").length !== 0) throw new Error("le registre a été touché malgré le refus");
});

// ── 3. horodatages strictement croissants au sein d'un lot ──────────────────
const r3 = join(T, "registre-3.jsonl");
writeFileSync(r3, "", "utf8");
check("un lot de 5 événements sort en horodatages STRICTEMENT croissants", () => {
  // Cinq items DISTINCTS (TF-0956) : cinq créations au même titre et au même contenu seraient des
  // doublons stricts, que R14 refuse à bon droit — la fixture doit être fausse sur le point qu'elle
  // teste (l'ordre des horodatages) et juste sur tout le reste.
  const lot = [creation(), creation({ id: "TF-9901", titre: "t1" }), creation({ id: "TF-9902", titre: "t2" }),
    creation({ id: "TF-9903", titre: "t3" }), creation({ id: "TF-9904", titre: "t4" })];
  const r = lancer(lot, r3);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.corps.message}`);
  const ts = readFileSync(r3, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l).ts);
  if (ts.length !== 5) throw new Error(`${ts.length} ligne(s), 5 attendues`);
  for (let i = 1; i < ts.length; i++)
    if (!(ts[i] > ts[i - 1])) throw new Error(`ts non croissant en position ${i} : ${ts[i - 1]} puis ${ts[i]}`);
});

// ── 4. une écriture qui casse le registre est ANNULÉE ───────────────────────
const r4 = join(T, "registre-4.jsonl");
writeFileSync(r4, "", "utf8");
check("écriture qui ferait échouer l'oracle → ANNULÉE, registre repris à l'octet près", () => {
  const bon = lancer([creation()], r4);
  if (bon.code !== 0) throw new Error(`la mise en place a échoué : ${bon.corps.message}`);
  const temoin = readFileSync(r4, "utf8");
  // seconde creation du MÊME id : R2 refuse, l'oracle passe de PASS à FAIL
  const r = lancer([creation()], r4);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ANNULÉE/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
  if (readFileSync(r4, "utf8") !== temoin) throw new Error("le registre n'a PAS été repris à son état d'origine");
});

// ── 5. --essai n'écrit rien et montre ce qui serait écrit ───────────────────
const r5 = join(T, "registre-5.jsonl");
writeFileSync(r5, "", "utf8");
check("--essai montre le stampage et n'écrit rien", () => {
  const r = lancer([creation()], r5, ["--essai"]);
  if (r.code !== 0) throw new Error(`exit ${r.code}`);
  if (!Array.isArray(r.corps.ecrits) || r.corps.ecrits.length !== 1) throw new Error("l'essai ne montre pas ce qu'il écrirait");
  if (!/"ts":/.test(r.corps.ecrits[0])) throw new Error("l'essai ne montre pas de ts stampé");
  if (readFileSync(r5, "utf8").length !== 0) throw new Error("--essai a écrit dans le registre");
});

// ── 6. fichier d'événements absent → refus lisible, aucune écriture ─────────
check("fichier d'événements absent → exit 1 et message, jamais une trace muette", () => {
  const r = spawnSync(process.execPath, [OUTIL, "--fichier", join(T, "inexistant.json")], { encoding: "utf8" });
  if (r.status !== 1) throw new Error(`exit ${r.status} attendu 1`);
  if (!/introuvable/.test(r.stdout || "")) throw new Error("le refus ne dit pas ce qui manque");
});

// -- 7. TF-0621 -- le garde des octets de controle, DANS LES DEUX SENS ------
// La classe a mordu sept fois le 25/08. Trois morsures ont atteint ce registre, et la septieme
// n'a ete attrapee par aucun mecanisme. Chaque octet est compose par `String.fromCharCode` :
// ecrire un antislash litteral ici serait commettre le defaut que la recette juge.
const r7 = join(T, "registre-7.jsonl");
writeFileSync(r7, "", "utf8");
const OCTET = { cloche: 0x07, retourArriere: 0x08, tabulation: 0x09, sautDePage: 0x0c, retourChariot: 0x0d };
const AS = String.fromCharCode(92);
const AS_ECH = AS;
const MSG_OCTET = new RegExp("octet" + AS_ECH + "(s" + AS_ECH + ") de contr");
const MSG_PARADE = new RegExp("chr" + AS_ECH + "(92" + AS_ECH + ")");
const MSG_CHAMP = new RegExp("forges_cibles_initiales" + AS_ECH + "[0" + AS_ECH + "]");

const SL = String.fromCharCode(10);

for (const [nom, code] of Object.entries(OCTET)) {
  check(`un ${nom} dans une valeur est REFUSE, et rien n'est ecrit`, () => {
    const chemin = `c:${AS}dev${String.fromCharCode(code)}ossier${AS}f.md`;
    const r = lancer([creation({ contenu: `le fichier ${chemin} existe` })], r7);
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
    if (!MSG_OCTET.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
    if (!MSG_PARADE.test(r.corps.message || "")) throw new Error("le refus ne donne pas la PARADE — un refus sans parade se contourne au hasard");
    if (readFileSync(r7, "utf8").length !== 0) throw new Error("le registre a ete ecrit malgre le refus");
  });
}

check("le SAUT DE LIGNE reste admis : c'est la seule exception, et elle est legitime en prose", () => {
  const r = lancer([creation({ contenu: `premier paragraphe${SL}${SL}second` })], r7);
  if (r.code !== 0) throw new Error(`exit ${r.code} — un saut de ligne en prose ne doit pas etre refuse`);
});

check("un saut de ligne DANS une ligne de tableau est refuse (clause 2, la forme mesuree)", () => {
  const coupe = `| A-11 | action | acteur | motif${SL}evue.py | consequence |`;
  const r = lancer([creation({ contenu: coupe })], r7);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — la clause 1 seule ne voit pas ce cas`);
  if (!/COUP/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

const r7b = join(T, "registre-7b.jsonl");
writeFileSync(r7b, "", "utf8");
check("une ligne de tableau ENTIERE n'est pas accusee — sinon aucun tableau ne passerait", () => {
  const entier = `| id | action | acteur |${SL}|---|---|---|${SL}| A-01 | faire | humain |`;
  const r = lancer([creation({ contenu: entier })], r7b);
  if (r.code !== 0) throw new Error(`exit ${r.code} — un tableau bien forme doit passer`);
});

check("le garde visite les valeurs IMBRIQUEES, pas seulement le premier niveau", () => {
  const r = lancer([creation({ forges_cibles_initiales: [`digit-ai${String.fromCharCode(9)}odo`] })], r7);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un octet dans un tableau de valeurs echappe au garde`);
  if (!MSG_CHAMP.test(r.corps.message || "")) throw new Error("le constat ne NOMME pas le champ fautif");
});

// -- 8. A-11 (D-5 (a), 22/09/2026) -- la porte de la classe, DANS LES DEUX SENS -------------
// Le pilot etait le seul producteur exempte de la regle qu'il impose aux lots entrants. Le sens
// VERT compte autant que le rouge : une porte qui refuse aussi les creations bien formees ne
// ferme pas une asymetrie, elle arrete la consignation.
const r8 = join(T, "registre-8.jsonl");
writeFileSync(r8, "", "utf8");

check("une creation SANS classe est refusee, et rien n'est ecrit", () => {
  const sans = creation();
  delete sans.classe;
  const avant = readFileSync(r8, "utf8").length;
  const r = lancer([sans], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — le pilot resterait exempte de sa propre regle`);
  if (!/SANS classe/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
  if (readFileSync(r8, "utf8").length !== avant) throw new Error("le refus a laisse une ecriture derriere lui");
});

check("le refus NOMME la sortie prevue, sinon le producteur n'a aucune voie qui passe", () => {
  const sans = creation();
  delete sans.classe;
  const r = lancer([sans], r8);
  if (!/classe-a-creer/.test(r.corps.message || "")) throw new Error("le refus ne nomme pas la cle reservee");
  if (!/classe_proposee/.test(r.corps.message || "")) throw new Error("le refus ne dit pas ce que la cle reservee exige");
});

check("une creation dont la classe est INCONNUE est refusee, avec les cles proches", () => {
  const r = lancer([creation({ classe: "oracle-faux-negatif-invente" })], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — une classe inventee fausse le compte des recidives`);
  if (!/inconnue du r/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
  if (!/oracle-faux-positif/.test(r.corps.message || "")) throw new Error("le refus ne propose aucune cle proche");
});

check("une creation dont la classe EXISTE passe — le sens vert de la porte", () => {
  const r = lancer([creation({ id: "TF-9910", titre: "classe reelle", contenu: "sens vert de la porte" })], r8);
  if (r.code !== 0) throw new Error(`exit ${r.code} — une creation bien formee doit passer : ${r.corps.message}`);
});

check("la cle reservee passe quand classe_proposee est COMPLETE et sa famille connue", () => {
  const r = lancer([creation({
    id: "TF-9911", titre: "cle reservee", contenu: "sortie prevue quand aucune cle ne convient", classe: "classe-a-creer",
    classe_proposee: { cle: "classe-de-recette-qui-n-existe-pas", famille: "regle-morte", libelle: "cas de recette" },
  })], r8);
  if (r.code !== 0) throw new Error(`exit ${r.code} — la sortie prevue doit passer : ${r.corps.message}`);
  const ecrit = readFileSync(r8, "utf8").trim().split(SL).map((l) => JSON.parse(l)).find((o) => o.id === "TF-9911");
  if (!ecrit) throw new Error("l'evenement n'a pas ete ecrit");
  if (ecrit.classe !== null) throw new Error(`classe ecrite « ${ecrit.classe} » — la cle reservee doit sortir en null, comme chez l'ingesteur`);
  if (!ecrit.classe_a_creer || ecrit.classe_a_creer.cle !== "classe-de-recette-qui-n-existe-pas") {
    throw new Error("la proposition n'est pas portee par classe_a_creer — les deux ecrivains divergeraient");
  }
  if (ecrit.classe_proposee !== undefined) throw new Error("classe_proposee subsiste : deux champs pour la meme chose");
});

check("la cle reservee SANS classe_proposee complete est refusee", () => {
  const r = lancer([creation({ id: "TF-9912", classe: "classe-a-creer", classe_proposee: { cle: "x" } })], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — une classe proposee vide ne propose rien`);
  if (!/manque famille, libelle/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

check("la cle reservee est refusee quand la classe proposee EXISTE deja", () => {
  const r = lancer([creation({
    id: "TF-9913", classe: "classe-a-creer",
    classe_proposee: { cle: "oracle-faux-positif", famille: "regle-morte", libelle: "deja la" },
  })], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — proposer une classe qui existe cree un doublon`);
  if (!/EXISTE d/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

check("la cle reservee est refusee quand la FAMILLE proposee est inconnue", () => {
  const r = lancer([creation({
    id: "TF-9914", classe: "classe-a-creer",
    classe_proposee: { cle: "classe-de-recette-hors-famille", famille: "famille-qui-n-existe-pas", libelle: "l" },
  })], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — une famille inventee sort du referentiel`);
  if (!/famille/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

// -- 9. D-16 (a) du 22/09/2026 -- une opportunite n'est pas un defaut ------------------------
check("une creation qui porte une NATURE d'opportunite passe SANS classe", () => {
  const sans = creation({ id: "TF-9920", titre: "opportunite", contenu: "un registre a tenir", nature: "opportunite" });
  delete sans.classe;
  const r = lancer([sans], r8);
  if (r.code !== 0) throw new Error(`exit ${r.code} — une opportunite n'a pas de classe de defaut : ${r.corps.message}`);
});

check("une creation qui porte une nature ET une classe est refusee — les deux s'excluent", () => {
  const r = lancer([creation({ id: "TF-9921", titre: "les deux", nature: "opportunite" })], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un item est un defaut ou n'en est pas un`);
  if (!/exclue|s.excluent/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

check("une NATURE inconnue est refusee — elle se pose en doctrine, pas au fil d'un evenement", () => {
  const sans = creation({ id: "TF-9922", titre: "nature inventee", nature: "idee-en-l-air" });
  delete sans.classe;
  const r = lancer([sans], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — une nature inventee echappe au compteur`);
  if (!/nature/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

check("le refus d'une creation sans classe NOMME aussi la sortie par la nature", () => {
  const sans = creation({ id: "TF-9923", titre: "ni l un ni l autre" });
  delete sans.classe;
  const r = lancer([sans], r8);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/opportunite/.test(r.corps.message || "")) throw new Error("le refus ne dit pas qu'une opportunite a sa voie");
});

check("une MAJ sans classe passe — la porte ne juge que les creations", () => {
  const r = lancer([{ ev: "maj", id: "TF-9910", statut: "candidat", note: "mesure de recette" }], r8);
  if (r.code !== 0) throw new Error(`exit ${r.code} — un maj ne porte pas de classe : ${r.corps.message}`);
});

check("un referentiel de classes ILLISIBLE refuse, il ne laisse pas passer en silence", () => {
  const faux = join(T, "classes-absentes.json");
  const r = lancer([creation({ id: "TF-9915" })], r8, ["--classes", faux]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — sans referentiel, on ne juge aucune cle`);
  if (!/illisible/.test(r.corps.message || "")) throw new Error(`message inattendu : ${r.corps.message}`);
});

console.log(`\njournaliser (TF-0413) : ${pass} PASS, ${fail} FAIL`);
if (!existsSync(OUTIL)) console.error("outil introuvable");
process.exit(fail ? 1 : 0);
