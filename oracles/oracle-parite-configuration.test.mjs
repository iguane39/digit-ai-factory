#!/usr/bin/env node
/**
 * oracle-parite-configuration.test.mjs — recette de la parité de configuration (TF-0589, TF-0588).
 *
 * Les deux sens sur chacune des quatre règles, plus les QUATRE faux positifs mesurés sur le parc
 * avant livraison et corrigés — chacun a sa fixture, sans quoi rien n'empêche de les réintroduire :
 *   · une variable du SYSTÈME (`HOME`) n'est pas de la configuration de projet ;
 *   · une clé lue seulement dans un fichier de TEST est une fixture, pas un contrat ;
 *   · un commentaire de FIN DE LIGNE dit où obtenir un secret aussi bien qu'un commentaire au-dessus ;
 *   · un bloc de commentaire couvre TOUTES les clés consécutives qu'il introduit.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, clesDeFichier, clesLuesParLeCode, familiesDeclarees, couvertePar,
  EST_UN_FICHIER_DE_TEST, EST_UN_SECRET, DU_SYSTEME } from "./oracle-parite-configuration.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const regle = (r, id) => r.findings.find((f) => f.regle === id);
const echoue = (r, id) => (regle(r, id) || {}).statut === "FAIL";

const T = mkdtempSync(join(tmpdir(), "parite-conf-"));
let n = 0;
/** Un dépôt fabriqué : gabarit, `.env` optionnel, et des fichiers de code. */
const depot = ({ gabarit = null, env = null, code = {}, nomGabarit = ".env.example" } = {}) => {
  const d = join(T, `d${++n}`);
  mkdirSync(d, { recursive: true });
  if (gabarit !== null) writeFileSync(join(d, nomGabarit), gabarit, "utf8");
  if (env !== null) writeFileSync(join(d, ".env"), env, "utf8");
  for (const [chemin, contenu] of Object.entries(code)) {
    const p = join(d, chemin.replaceAll("/", "\\"));
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, contenu, "utf8");
  }
  return d;
};

try {
  // ── PC0 : l'absence de gabarit est le sujet de R-13, pas d'ici ─────────────
  check("aucun gabarit → SKIP et RENVOI à R-13, jamais deux vérités sur le même objet", () => {
    const r = juger(depot({ env: "A=1\n" }));
    att(r.verdict === "SKIP", `verdict ${r.verdict}`);
    att(/R-13/.test(regle(r, "PC0").message), "le renvoi à son juge n'est pas écrit");
  });

  // ── PC1 : les clés réelles sont couvertes ─────────────────────────────────
  check("PC1 rouge — une clé du `.env` absente du gabarit est REFUSÉE", () => {
    const r = juger(depot({ gabarit: "A=\n", env: "A=1\nB=2\n" }));
    att(echoue(r, "PC1"), "PC1 n'a pas vu la clé manquante");
    att(/B/.test(regle(r, "PC1").message), "la clé fautive n'est pas NOMMÉE");
    att(/illusion/.test(regle(r, "PC1").message), "le motif ne dit pas pourquoi c'est pire qu'un gabarit absent");
  });

  check("PC1 vert — toutes les clés réelles au gabarit, et l'ORDRE ne compte pas", () => {
    att(!echoue(juger(depot({ gabarit: "B=\nA=\n", env: "A=1\nB=2\n" })), "PC1"),
      "un gabarit complet mais dans un autre ordre a été refusé");
  });

  check("PC1 — aucun `.env` sur le poste n'est PAS un défaut du dépôt", () => {
    const r = juger(depot({ gabarit: "A=\n" }));
    att(regle(r, "PC1").statut === "SANS_OBJET", "l'absence de `.env` local est traitée comme une faute");
  });

  // ── PC2 : les clés lues par le code ───────────────────────────────────────
  check("PC2 rouge — une clé LUE par le code et absente des deux fichiers est REFUSÉE", () => {
    const r = juger(depot({ gabarit: "A=\n", code: { "src/app.mjs": "const x = process.env.SECRETE_CLE;\n" } }));
    att(echoue(r, "PC2"), "PC2 n'a pas vu la clé lue");
    att(/SECRETE_CLE/.test(regle(r, "PC2").message), "la clé n'est pas nommée");
    att(/src\/app\.mjs/.test(regle(r, "PC2").message), "le FICHIER qui la lit n'est pas nommé — un constat sans lieu ne se répare pas");
  });

  check("PC2 — les cinq formes de lecture sont reconnues, JS et Python", () => {
    const lues = clesLuesParLeCode(depot({ code: {
      "a.mjs": 'process.env.UNE; process.env["DEUX"];\n',
      "b.py": 'os.environ.get("TROIS"); os.environ["QUATRE"]; os.getenv("CINQ")\n',
    } }));
    for (const k of ["UNE", "DEUX", "TROIS", "QUATRE", "CINQ"]) att(lues.has(k), `forme non reconnue : ${k}`);
  });

  // ── FAUX POSITIF 1, mesuré : les variables du système ─────────────────────
  check("une variable du SYSTÈME n'est pas de la configuration — faux positif mesuré sur le pilot", () => {
    const r = juger(depot({ gabarit: "A=\n", code: { "src/a.mjs": "process.env.HOME; process.env.USERPROFILE;\n" } }));
    att(!echoue(r, "PC2"), "`HOME` et `USERPROFILE` ont été exigés au gabarit");
    att(DU_SYSTEME.has("HOME") && DU_SYSTEME.has("CI"), "la liste fermée a perdu une entrée");
  });

  // ── FAUX POSITIF 2, mesuré : les fichiers de test ─────────────────────────
  check("une clé lue seulement dans un TEST est une fixture — faux positif mesuré sur une forge", () => {
    const r = juger(depot({ gabarit: "A=\n", code: {
      "tests/test_truc.py": 'os.environ["ZZ_CLE_FABRIQUEE"]\n',
      "recette/verifier.py": 'os.getenv("ZZ_AUTRE")\n',
      "src/vrai.mjs": "process.env.VRAIE_CLE;\n",
    } }));
    att(echoue(r, "PC2"), "la vraie clé n'est plus vue : l'exclusion est trop large");
    const m = regle(r, "PC2").message;
    att(/VRAIE_CLE/.test(m), "la vraie clé n'est pas nommée");
    att(!/ZZ_/.test(m), "une variable de fixture a été exigée au gabarit");
    att(EST_UN_FICHIER_DE_TEST("a/tests/x.py") && EST_UN_FICHIER_DE_TEST("b/test_x.py")
      && EST_UN_FICHIER_DE_TEST("c/x.test.mjs") && !EST_UN_FICHIER_DE_TEST("src/protest.mjs"),
      "le prédicat de fichier de test est faux dans un sens ou dans l'autre");
  });

  // ── PC2 bis : la directive de famille documentée ailleurs ─────────────────
  check("la directive « cles-documentees-ailleurs » est LUE, appliquée et RENDUE", () => {
    const r = juger(depot({
      gabarit: "# cles-documentees-ailleurs: PRESCRITE_* — dérivées du code ailleurs\nA=\n",
      code: { "src/a.mjs": "process.env.PRESCRITE_UNE; process.env.PRESCRITE_DEUX; process.env.A_MOI;\n" },
    }));
    att(!/PRESCRITE_/.test((regle(r, "PC2") || {}).message || ""), "la famille déclarée a été accusée");
    att(/A_MOI/.test((regle(r, "PC2") || {}).message || ""), "une clé hors famille n'est plus vue");
    const bis = regle(r, "PC2 bis");
    att(bis && /2 clé/.test(bis.message), "l'exclusion n'est pas RENDUE avec son compte — une exclusion silencieuse est un angle mort");
    att(/PRESCRITE_\*/.test(bis.message), "la directive appliquée n'est pas nommée");
  });

  check("la directive ne couvre QUE ce qu'elle nomme — un `*` en fin de motif, pas au milieu", () => {
    const f = familiesDeclarees("# cles-documentees-ailleurs: AB_*, EXACTE\n");
    att(couvertePar("AB_X", f) && couvertePar("EXACTE", f), "une clé couverte ne l'est pas");
    att(!couvertePar("ABX", f) && !couvertePar("EXACTEMENT", f), "la directive couvre plus large qu'elle ne dit");
  });

  // ── PC3 : le sens inverse, signalé sans accuser ───────────────────────────
  check("PC3 — une clé du gabarit que rien ne lit est SIGNALÉE, jamais accusée", () => {
    const r = juger(depot({ gabarit: "A=\nMORTE=\n", code: { "src/a.mjs": "process.env.A;\n" } }));
    const pc3 = regle(r, "PC3");
    att(pc3.statut === "AVERTISSEMENT", `statut ${pc3.statut} : accuser ferait crier l'oracle sur un gabarit juste`);
    att(/MORTE/.test(pc3.message), "la clé morte n'est pas nommée");
    att(r.verdict !== "FAIL" || echoue(r, "PC1") || echoue(r, "PC2") || echoue(r, "PC4"),
      "une clé morte à elle seule a fait échouer le verdict");
  });

  // ── PC4 : un secret dit où l'obtenir ─────────────────────────────────────
  check("PC4 rouge — un secret sans DE QUOI l'obtenir est REFUSÉ", () => {
    const r = juger(depot({ gabarit: "MON_API_TOKEN=\n" }));
    att(echoue(r, "PC4"), "PC4 n'a pas vu le secret muet");
    att(/aller-retours/.test(regle(r, "PC4").message), "le motif ne porte pas le coût mesuré");
  });

  check("PC4 — seules les clés de SECRET sont concernées : exiger de toutes serait du bruit", () => {
    att(!echoue(juger(depot({ gabarit: "PORT=\nBASE_URL=\n" })), "PC4"), "une clé ordinaire a été exigée de dire où l'obtenir");
    att(EST_UN_SECRET("X_TOKEN") && EST_UN_SECRET("api_key") && !EST_UN_SECRET("PORT"),
      "le prédicat de secret est faux dans un sens ou dans l'autre");
  });

  // ── FAUX POSITIF 3, mesuré : le commentaire de fin de ligne ───────────────
  check("un commentaire de FIN DE LIGNE dit où l'obtenir — faux positif mesuré sur le pilot", () => {
    const r = juger(depot({ gabarit: "MON_TOKEN= # à fournir : console du fournisseur\n" }));
    att(!echoue(r, "PC4"), "un commentaire de fin de ligne a été ignoré");
  });

  check("le piège du `\\b` ASCII devant un accent est évité — « à fournir » est reconnu", () => {
    const cles = clesDeFichier(join(depot({ gabarit: "T_TOKEN= # à fournir : ailleurs\n" }), ".env.example"));
    att((cles.get("T_TOKEN") || "").includes("à fournir"), "le commentaire n'est pas lu");
    att(!echoue(juger(depot({ gabarit: "T_TOKEN= # à fournir : ailleurs\n" })), "PC4"),
      "le motif ne reconnaît pas « à fournir » — en JS `\\b` est ASCII et ne borne pas un `à`");
  });

  // ── FAUX POSITIF 4, mesuré : un bloc couvre plusieurs clés ────────────────
  check("un BLOC de commentaire couvre les clés consécutives — faux positif mesuré sur une forge", () => {
    const r = juger(depot({ gabarit: "# à fournir : console du fournisseur, portée lecture\nUN_TOKEN=\nUN_SECRET=\n" }));
    att(!echoue(r, "PC4"), "la seconde clé du couple a été accusée de se taire");
  });

  check("une ligne vide FERME le bloc : la clé qui suit ne l'hérite pas", () => {
    const r = juger(depot({ gabarit: "# à fournir : console du fournisseur\nUN_TOKEN=\n\nAUTRE_TOKEN=\n" }));
    att(echoue(r, "PC4"), "un commentaire séparé par une ligne vide a couvert la clé suivante");
    att(/AUTRE_TOKEN/.test(regle(r, "PC4").message) && !/UN_TOKEN/.test(regle(r, "PC4").message),
      "la mauvaise clé est accusée");
  });

  // ── la valeur n'est JAMAIS lue ni rendue ─────────────────────────────────
  check("aucune VALEUR n'est lue ni rendue — un contrôle qui lirait les valeurs serait une fuite", () => {
    const d = depot({ gabarit: "A=\n", env: "A=valeur-tres-secrete-42\n" });
    const r = juger(d);
    att(!JSON.stringify(r).includes("valeur-tres-secrete-42"), "une valeur de `.env` a fui dans le rapport");
    const cles = clesDeFichier(join(d, ".env"));
    att(cles.has("A") && !JSON.stringify([...cles.values()]).includes("valeur-tres-secrete-42"),
      "l'analyseur conserve la valeur d'une clé");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nparite-configuration (TF-0589) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
