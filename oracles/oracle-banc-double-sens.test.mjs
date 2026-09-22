#!/usr/bin/env node
/**
 * oracle-banc-double-sens.test.mjs — recette à DOUBLE SENS de `oracle-banc-double-sens.mjs`.
 *
 * L'ironie est le sujet même : cet oracle exige de chaque contrôle un banc qui sait échouer, et
 * il rend VERT sur le dépôt réel. Sans ses propres fixtures rouges, il serait exactement ce qu'il
 * dénonce — un contrôle vert dont personne n'a vu le rouge, donc indiscernable d'un contrôle mort.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via la table partagée, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, NON_JUGE, bancDe, porteUnSensRouge, litSonSelfTest, EST_UN_CONTROLE } from "./oracle-banc-double-sens.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "banc-double-sens-"));
let n = 0;
/** Un dépôt jetable portant UN contrôle, et éventuellement son banc. */
const depot = ({ entete = "", corps = "// corps\n", banc = null, nomDuBanc = null } = {}) => {
  const d = join(T, `d${++n}`);
  mkdirSync(join(d, "oracles"), { recursive: true });
  writeFileSync(join(d, "oracles", "oracle-bidon.mjs"), `/**\n * oracle-bidon.mjs — ${entete}\n */\n${corps}`, "utf8");
  if (banc !== null) writeFileSync(join(d, "oracles", nomDuBanc || "oracle-bidon.test.mjs"), banc, "utf8");
  return d;
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);
const BANC_ROUGE = 'check("ROUGE — la forme fautive doit échouer", () => {});\n';
const BANC_VERT = 'check("la forme juste passe", () => {});\n';

// -- BD1 : l'en-tete affirme, le banc repond ----------------------------------------------------
check("ROUGE — un en-tête qui affirme une recette sans qu'il y en ait est un FAIL", () => {
  const f = constat(juger(depot({ entete: "recette a double sens, 23 cas" })), "BD1");
  if (f.statut !== "FAIL") throw new Error(`BD1 ${f.statut} — l'affirmation est crue sur parole`);
  if (!/oracle-bidon/.test(f.message)) throw new Error("le constat ne LOCALISE pas le contrôle");
});

check("VERT — le même en-tête avec un banc voisin qui existe passe BD1", () => {
  const f = constat(juger(depot({ entete: "recette a double sens", banc: BANC_ROUGE })), "BD1");
  if (f.statut !== "PASS") throw new Error(`BD1 ${f.statut} : ${f.message}`);
});

check("VERT — un en-tête qui n'affirme RIEN n'est pas accusé (BD1 juge l'écart, pas l'absence)", () => {
  const f = constat(juger(depot({ entete: "juge les chemins du parc" })), "BD1");
  if (f.statut !== "PASS") throw new Error("BD1 rejoue l'invariant I1 au lieu de juger l'écart");
});

check("VERT — un `--self-test` embarqué vaut banc pour BD1", () => {
  const corps = 'if (args.includes("--self-test")) selfTest();\n';
  const f = constat(juger(depot({ entete: "recette embarquee", corps })), "BD1");
  if (f.statut !== "PASS") throw new Error("la forme embarquée n'est pas reconnue comme un banc");
});

// -- BD2 : le banc sait-il echouer ? ------------------------------------------------------------
check("ROUGE — un banc dont AUCUN cas n'est écrit pour échouer est un FAIL", () => {
  const f = constat(juger(depot({ entete: "recette", banc: BANC_VERT })), "BD2");
  if (f.statut !== "FAIL") throw new Error(`BD2 ${f.statut} — un banc tout vert ne prouve rien`);
  if (!/oracle-bidon.test.mjs/.test(f.message)) throw new Error("le constat ne nomme pas le banc en cause");
});

check("VERT — le même banc avec un cas « doit échouer » passe BD2", () => {
  const f = constat(juger(depot({ entete: "recette", banc: BANC_VERT + BANC_ROUGE })), "BD2");
  if (f.statut !== "PASS") throw new Error(`BD2 ${f.statut} : ${f.message}`);
});

check("les trois familles de sens rouge sont reconnues, et le mot « échec » ne l'est pas", () => {
  if (!porteUnSensRouge("cas ROUGE")) throw new Error("« rouge » non reconnu");
  if (!porteUnSensRouge("double sens")) throw new Error("« double sens » non reconnu");
  if (!porteUnSensRouge("doit échouer")) throw new Error("« doit échouer » non reconnu");
  if (porteUnSensRouge("0 FAIL, aucun échec")) throw new Error("un résumé vert compte pour un sens rouge");
});

// -- BD3 : annoncer un geste qu'on n'offre pas --------------------------------------------------
check("ROUGE — annoncer `--self-test` sans le lire est un FAIL", () => {
  const f = constat(juger(depot({ entete: "usage : node oracle-bidon.mjs --self-test", banc: BANC_ROUGE })), "BD3");
  if (f.statut !== "FAIL") throw new Error(`BD3 ${f.statut} — le lecteur joue une commande qui ne fait rien`);
});

check("VERT — annoncer `--self-test` et le lire passe BD3", () => {
  const corps = 'if (args.includes("--self-test")) selfTest();\n';
  const f = constat(juger(depot({ entete: "usage : node oracle-bidon.mjs --self-test", corps })), "BD3");
  if (f.statut !== "PASS") throw new Error(`BD3 ${f.statut} : ${f.message}`);
});

check("une annonce n'est pas une lecture", () => {
  if (litSonSelfTest(" * usage : --self-test")) throw new Error("une annonce en commentaire passe pour une lecture");
  if (!litSonSelfTest('args.includes("--self-test")')) throw new Error("une lecture réelle n'est pas vue");
});

// -- la table partagee ---------------------------------------------------------------------------
check("VERT — un banc DÉDIÉ, nommé par la table partagée, est trouvé", () => {
  const d = depot({ entete: "recette dediee", banc: BANC_ROUGE, nomDuBanc: "self-test-bidon.mjs" });
  const table = { "oracle-bidon.mjs": "self-test-bidon.mjs" };
  const r = juger(d, { dedies: table });
  if (constat(r, "BD1").statut !== "PASS") throw new Error("la table partagée n'est pas lue");
  if (constat(r, "BD2").statut !== "PASS") throw new Error("le banc dédié n'est pas relu pour son sens rouge");
});

check("ROUGE — une entrée de table qui pointe sur un fichier ABSENT ne vaut pas banc", () => {
  const d = depot({ entete: "recette dediee" });
  const r = juger(d, { dedies: { "oracle-bidon.mjs": "self-test-inexistant.mjs" } });
  if (constat(r, "BD1").statut !== "FAIL") throw new Error("une entrée de table suffit à faire croire au banc");
  if (bancDe(join(d, "oracles", "oracle-bidon.mjs"), "oracle-bidon.mjs", { "oracle-bidon.mjs": "absent.mjs" })) {
    throw new Error("un banc introuvable est rendu comme trouvé");
  }
});

// -- portee et contrat ---------------------------------------------------------------------------
check("une RECETTE n'est pas un contrôle — sinon la régression est infinie", () => {
  if (EST_UN_CONTROLE("oracle-bidon.test.mjs")) throw new Error("un banc est pris pour un contrôle à éprouver");
  if (!EST_UN_CONTROLE("hook-bidon.mjs")) throw new Error("un hameçon n'est pas vu comme un contrôle");
});

check("SANS OBJET — un dépôt sans contrôle est déclaré hors portée, jamais accusé", () => {
  const d = join(T, "vide");
  mkdirSync(d, { recursive: true });
  if (juger(d).verdict !== "SANS_OBJET") throw new Error("un dépôt vide est accusé au lieu d'être écarté");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé, et dit qu'il ne rejoue pas l'invariant du harnais", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
  if (!NON_JUGE.some((x) => /I1/.test(x))) throw new Error("la frontière avec le harnais n'est pas déclarée");
});

console.log(`\noracle-banc-double-sens : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
