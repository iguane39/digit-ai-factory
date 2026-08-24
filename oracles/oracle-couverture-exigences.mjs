#!/usr/bin/env node
/**
 * oracle-couverture-exigences.mjs — la couverture se compte en EXIGENCES, jamais en règles.
 *
 * Pourquoi il existe (TF-0548, décidé le 23/08, voie (a) sur mandat humain). La couverture
 * affichait 24 règles sur 26, soit 92 %, pendant que quinze candidatures étaient refusées en
 * trois jours à cause d'une exigence non contrôlée. La règle 18 exige le gabarit de retours
 * depuis le 06/08 — « `forge\retours\` existe (GABARIT INCLUS) » — et son contrôle ne vérifiait
 * que le dossier. Comptée couverte à 100 %, elle l'était à 20 %. Une métrique qui compte des
 * règles là où le travail se fait par exigence peut rester au vert pendant que le trou grandit.
 *
 * Ce qu'il juge (C1-C5, chacune binaire) :
 *   C1 le référentiel `references\EXIGENCES-PROJET.json` est lisible et bien formé ;
 *   C2 toute règle du tableau de REGLES-PROJET.md porte AU MOINS une exigence déclarée —
 *      une règle absente du référentiel est un trou de décomposition, pas une règle couverte ;
 *   C3 chaque exigence `couverte` cite un contrôle qui EXISTE réellement dans
 *      `oracle-conformite-projet.mjs` — une exigence rattachée à un finding fantôme est pire
 *      qu'une exigence déclarée non couverte : elle ment dans le bon sens ;
 *   C4 chaque exigence `non_couverte` ou `couverte_ailleurs` porte un motif ÉCRIT — sans lui,
 *      « non couverte » se lit comme un oubli et non comme une décision ;
 *   C5 les identifiants sont uniques et de la forme `R-<n>.<i>` rattachée à leur règle.
 *
 * Ce qu'il NE juge PAS, et c'est dit plutôt que sous-entendu : la justesse d'un contrôle (le
 * rôle des recettes double sens), et l'exhaustivité de la décomposition elle-même — un énoncé
 * peut porter une exigence que personne n'a vue. Aucun oracle ne rattrape ça ; seule la revue.
 *
 * Usage : node oracle-couverture-exigences.mjs [--self-test]
 * Sortie : JSON { oracle, verdict, taux, findings[], non_juge[] } · exit 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

export function juger({ refPath, reglesPath, oraclePath }) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });

  // C1 — le référentiel est lisible et bien formé
  let ref = null;
  try { ref = JSON.parse(readFileSync(refPath, "utf8")); } catch { /* illisible */ }
  if (!ref || !Array.isArray(ref.exigences) || !ref.exigences.length) {
    return { oracle: "oracle-couverture-exigences", verdict: "NON_JUGEABLE", taux: null,
      findings: [{ regle: "C1", statut: "FAIL", ou: refPath, message: "référentiel des exigences illisible, vide ou mal formé — rien à juger" }],
      non_juge: [] };
  }
  ok("C1", `référentiel lu — ${ref.exigences.length} exigence(s) déclarée(s)`);

  const regles = readFileSync(reglesPath, "utf8");
  const oracle = readFileSync(oraclePath, "utf8");

  // C2 — aucune règle du tableau ne manque au référentiel
  const auTableau = [...new Set([...regles.matchAll(/^\| (\d+) \|/gm)].map((m) => Number(m[1])))];
  const decomposees = new Set(ref.exigences.map((e) => e.regle));
  const oubliees = auTableau.filter((n) => !decomposees.has(n));
  oubliees.length
    ? ko("C2", "REGLES-PROJET.md", `${oubliees.length} règle(s) du tableau sans aucune exigence déclarée : ${oubliees.join(", ")} — une règle absente du référentiel n'est pas une règle couverte, c'est un trou de décomposition`)
    : ok("C2", `les ${auTableau.length} règles du tableau sont décomposées`);

  // C3 — les contrôles cités existent vraiment
  const fantomes = [];
  for (const e of ref.exigences.filter((x) => x.statut === "couverte")) {
    if (!e.controle) { fantomes.push(`${e.id} : statut « couverte » sans contrôle cité`); continue; }
    const [regle] = String(e.controle).split(" / ");
    if (!new RegExp(`"${regle.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(oracle))
      fantomes.push(`${e.id} → ${e.controle} (aucun finding de ce nom dans l'oracle)`);
  }
  fantomes.length
    ? ko("C3", "EXIGENCES-PROJET.json", `${fantomes.length} exigence(s) rattachée(s) à un contrôle qui n'existe pas : ${fantomes.slice(0, 4).join(" · ")}${fantomes.length > 4 ? ` (+${fantomes.length - 4})` : ""} — une exigence rattachée à un finding fantôme ment dans le bon sens, ce qui est pire que de se déclarer non couverte`)
    : ok("C3", "chaque exigence « couverte » cite un contrôle qui existe dans l'oracle");

  // C4 — le non-couvert se motive
  const muettes = ref.exigences
    .filter((e) => (e.statut === "non_couverte" || e.statut === "couverte_ailleurs") && !(e.motif || "").trim())
    .map((e) => e.id);
  muettes.length
    ? ko("C4", "EXIGENCES-PROJET.json", `${muettes.length} exigence(s) non couverte(s) SANS motif : ${muettes.join(", ")} — sans motif, « non couverte » se lit comme un oubli et non comme une décision`)
    : ok("C4", "chaque exigence non couverte porte son motif écrit");

  // C5 — identifiants uniques et cohérents avec leur règle
  const vus = new Set(), malFormes = [];
  for (const e of ref.exigences) {
    if (vus.has(e.id)) malFormes.push(`${e.id} en double`);
    vus.add(e.id);
    if (!new RegExp(`^R-${e.regle}\\.\\d+$`).test(String(e.id))) malFormes.push(`${e.id} ne dérive pas de la règle ${e.regle}`);
  }
  malFormes.length
    ? ko("C5", "EXIGENCES-PROJET.json", `identifiants incohérents : ${malFormes.slice(0, 4).join(" · ")}`)
    : ok("C5", `${vus.size} identifiant(s) uniques, tous dérivés de leur règle`);

  const n = ref.exigences.length;
  const couvertes = ref.exigences.filter((e) => e.statut === "couverte").length;
  const ailleurs = ref.exigences.filter((e) => e.statut === "couverte_ailleurs").length;
  const nues = n - couvertes - ailleurs;
  const taux = {
    exigences: n, couvertes, couvertes_ailleurs: ailleurs, non_couvertes: nues,
    taux_par_exigence: `${Math.round((100 * (couvertes + ailleurs)) / n)} %`,
    // Pour mémoire, et c'est tout l'objet de TF-0548 : la métrique d'avant. Elle se calcule sur
    // les seules règles DU TABLEAU — une règle rédigée en section (19, 43, 44, 47) y est absente,
    // et la compter ferait passer le taux au-dessus de 100 %, ce qui est un défaut et non un exploit.
    taux_par_regle_pour_memoire: `${Math.round((100 * auTableau.filter((n) => decomposees.has(n)).length) / Math.max(auTableau.length, 1))} %`,
    regles_hors_tableau: [...decomposees].filter((n) => !auTableau.includes(n)),
  };

  return {
    oracle: "oracle-couverture-exigences",
    verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS",
    taux,
    findings,
    non_juge: [
      "la JUSTESSE d'un contrôle : on vérifie qu'une exigence a un contrôle rattaché, jamais qu'il juge bien — c'est le rôle des recettes double sens de chaque oracle",
      "l'EXHAUSTIVITÉ de la décomposition : un énoncé peut porter une exigence que personne n'a vue. Aucun oracle ne rattrape cela, seule la revue le peut — et le dire vaut mieux que de laisser croire le contraire",
      "les règles rédigées en sections (43, 44, 47) et non au tableau : elles portent leurs exigences dans leur texte et des findings dédiés",
    ],
  };
}

// ---- self-test : fixtures double sens --------------------------------------------------------
if (process.argv.includes("--self-test")) {
  const T = mkdtempSync(join(tmpdir(), "cov-exig-"));
  let pass = 0, fail = 0;
  const check = (nom, fn) => {
    try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
    catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
  };
  const poser = (ref, regles = "| 1 | énoncé |\n| 2 | énoncé |\n", oracle = 'ok("R-1", "input", "x"); ok("R-2", "output", "y");') => {
    const d = mkdtempSync(join(T, "cas-"));
    writeFileSync(join(d, "ref.json"), JSON.stringify(ref), "utf8");
    writeFileSync(join(d, "regles.md"), regles, "utf8");
    writeFileSync(join(d, "oracle.mjs"), oracle, "utf8");
    return juger({ refPath: join(d, "ref.json"), reglesPath: join(d, "regles.md"), oraclePath: join(d, "oracle.mjs") });
  };
  const VERT = { exigences: [
    { id: "R-1.1", regle: 1, enonce: "a", statut: "couverte", controle: "R-1 / input" },
    { id: "R-2.1", regle: 2, enonce: "b", statut: "couverte", controle: "R-2 / output" },
    { id: "R-2.2", regle: 2, enonce: "c", statut: "non_couverte", motif: "motif écrit" },
  ] };

  check("verte — référentiel complet, contrôles réels, non-couvert motivé → PASS", () => {
    const r = poser(VERT);
    if (r.verdict !== "PASS") throw new Error(`${r.verdict} : ${JSON.stringify(r.findings.filter((f) => f.statut === "FAIL"))}`);
  });

  check("le taux se rend PAR EXIGENCE, et le taux par règle est donné pour mémoire", () => {
    const r = poser(VERT);
    if (r.taux.exigences !== 3 || r.taux.non_couvertes !== 1) throw new Error(JSON.stringify(r.taux));
    if (r.taux.taux_par_exigence !== "67 %") throw new Error(`taux par exigence ${r.taux.taux_par_exigence}, attendu 67 %`);
    if (r.taux.taux_par_regle_pour_memoire !== "100 %") throw new Error("le taux par règle devrait afficher 100 % — c'est tout le sujet de TF-0548");
  });

  check("C2 rouge — une règle du tableau sans aucune exigence déclarée", () => {
    const r = poser(VERT, "| 1 | a |\n| 2 | b |\n| 3 | c |\n");
    if (!r.findings.some((f) => f.regle === "C2" && f.statut === "FAIL")) throw new Error("une règle non décomposée passe pour couverte");
  });

  check("C3 rouge — exigence rattachée à un contrôle FANTÔME", () => {
    const r = poser({ exigences: [{ id: "R-1.1", regle: 1, enonce: "a", statut: "couverte", controle: "R-99 / nulle part" }] }, "| 1 | a |\n");
    if (!r.findings.some((f) => f.regle === "C3" && f.statut === "FAIL")) throw new Error("un finding inexistant est accepté — l'exigence mentirait dans le bon sens");
  });

  check("C4 rouge — non couverte SANS motif", () => {
    const r = poser({ exigences: [{ id: "R-1.1", regle: 1, enonce: "a", statut: "non_couverte" }] }, "| 1 | a |\n");
    if (!r.findings.some((f) => f.regle === "C4" && f.statut === "FAIL")) throw new Error("un non-couvert muet passe");
  });

  check("C5 rouge — identifiant qui ne dérive pas de sa règle", () => {
    const r = poser({ exigences: [{ id: "R-7.1", regle: 1, enonce: "a", statut: "non_couverte", motif: "m" }] }, "| 1 | a |\n");
    if (!r.findings.some((f) => f.regle === "C5" && f.statut === "FAIL")) throw new Error("un identifiant incohérent passe");
  });

  check("C1 borne — référentiel illisible → NON_JUGEABLE, jamais un faux PASS", () => {
    const d = mkdtempSync(join(T, "cas-"));
    writeFileSync(join(d, "ref.json"), "{ pas du json", "utf8");
    writeFileSync(join(d, "regles.md"), "| 1 | a |\n", "utf8");
    writeFileSync(join(d, "oracle.mjs"), "", "utf8");
    const r = juger({ refPath: join(d, "ref.json"), reglesPath: join(d, "regles.md"), oraclePath: join(d, "oracle.mjs") });
    if (r.verdict !== "NON_JUGEABLE") throw new Error(`${r.verdict} — un référentiel cassé ne vaut pas un verdict`);
  });

  rmSync(T, { recursive: true, force: true });
  console.log(`\nCouverture par exigence (C1-C5) : ${pass} PASS, ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
}

// ---- exécution sur le parc réel --------------------------------------------------------------
if (!process.argv.includes("--self-test")) {
  const r = juger({
    refPath: join(ICI, "..", "references", "EXIGENCES-PROJET.json"),
    reglesPath: join(ICI, "..", "REGLES-PROJET.md"),
    oraclePath: join(ICI, "oracle-conformite-projet.mjs"),
  });
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.verdict === "PASS" ? 0 : r.verdict === "NON_JUGEABLE" ? 2 : 1);
}
