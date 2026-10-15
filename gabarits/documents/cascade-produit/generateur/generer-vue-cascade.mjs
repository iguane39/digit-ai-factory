#!/usr/bin/env node
/**
 * generer-vue-cascade — la vue lisible de la cascade ISTO d'un produit, générée depuis sa source.
 *
 * LE FAIT (lot `Produit-12 - RETOURS - 20261002a`, RS-30, TF-1679). Le premier produit qui a écrit sa
 * cascade a dû remplir sa fiche de conception avec « famille: aucune — candidature remontée » : aucune
 * famille du catalogue ne portait ce document. Il a écrit sa vue `CASCADE.md` avec son propre
 * générateur, à son propre format. Depuis le 03/10/2026 la source a un format commun
 * (`pilot/cascade-isto@1`, gabarit `gabarits\CASCADE-ISTO.json`) et un juge
 * (`oracles\oracle-cascade-isto.mjs`), mais `references\INTENTION.md` disait seulement que la vue,
 * « s'il en a une, se génère » : par quoi, rien ne le disait. Chaque produit suivant aurait réécrit
 * ce générateur.
 *
 * CE QU'IL FAIT. Il lit une cascade au format commun et écrit sa vue en six parties, celles de la
 * famille `gd-cascade-produit` : Intention, Stratégie, Tactique, Opérationnel, Test rétro, Tenir la
 * cascade à jour. Le test rétro n'est pas rédigé : il est le verdict de `oracle-cascade-isto`, rejoué
 * à la génération, avec ses mesures. La vue ne porte aucune date de génération : deux générations
 * d'une même source rendent le même octet, et `--verifier` s'en sert pour refuser une vue éditée à
 * la main ou restée en retard sur sa source.
 *
 * Usage :
 *   node generer-vue-cascade.mjs <CASCADE.json> [--exigences <EXIGENCES.json>] [--tests <dossier>]
 *        [--motif <regex>] [--sortie <CASCADE.md>] [--verifier] [--squelette]
 *   node generer-vue-cascade.mjs --self-test
 * Sans `--sortie`, la vue part sur la sortie standard. `--verifier` compare la vue existante à la
 * vue régénérée : exit 0 si identiques, 1 sinon. `--squelette` rend le squelette de la famille depuis
 * le gabarit : le test rétro y reste un emplacement, puisqu'un gabarit n'a pas de verdict.
 * Exit : 0 vue écrite ou à jour · 1 vue en écart · 2 source illisible.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { juger, lireTestsCites, fixtureVerte } from "../../../../oracles/oracle-cascade-isto.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
export const GABARIT = "gd-cascade-produit";
export const VERSION_GABARIT = "1.0.0";

/** Une cellule de tableau Markdown : ni barre verticale ni retour à la ligne. */
const cellule = (v) => (v === undefined || v === null || v === "" ? "—" : String(v)).replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
const liste = (v) => (Array.isArray(v) ? v : []);
const actif = (x) => (x?.statut ?? "active") !== "retiree";
const marqueRetrait = (x) => (actif(x) ? "" : ` *(retirée : ${cellule(x.motif_retrait || `remplacée par ${x.remplacee_par}`)})*`);
/** Une vue se compare sans ses fins de ligne : un dépôt en `core.autocrlf` rend la vue en CRLF à l'extraction. */
export const memeVue = (a, b) => String(a).replace(/\r\n/g, "\n") === String(b).replace(/\r\n/g, "\n");

function valeurActuelle(va) {
  if (!va || typeof va !== "object") return "—";
  if (va.non_mesuree) return `non mesurée : ${va.non_mesuree}`;
  return `${va.valeur} — mesurée le ${va.mesuree_le}, ${va.source}`;
}

function indicateur(ind) {
  if (!ind || typeof ind !== "object") return cellule(ind);
  return `${ind.formule} ; dénominateur : ${ind.denominateur} ; lu : ${ind.source}`;
}

/**
 * La vue Markdown d'une cascade. `jugement` = `{ verdict, findings, mesures }` d'oracle-cascade-isto,
 * ou null en mode squelette. `sources` = les chemins cités en tête, relatifs à la racine du produit.
 */
export function rendreVue(cascade, { jugement = null, sources = [], citees = null } = {}) {
  const c = cascade || {};
  const strategies = liste(c.strategies);
  const tactiques = liste(c.tactiques);
  const intention = c.intention || {};
  const v = intention.validation || {};
  const L = [];
  L.push("---");
  L.push("role: cascade du produit — intention, stratégie, tactique, opérationnel, puis test rétro (references/INTENTION.md) ; vue générée, jamais éditée à la main");
  L.push(`sources_de_verite: [${sources.join(", ")}]`);
  L.push(`version: ${c.version ?? "—"}`);
  L.push(`verifie_le: ${c.date ?? "—"}`);
  L.push(`gabarit: ${GABARIT}`);
  L.push(`version_du_gabarit: ${VERSION_GABARIT}`);
  L.push("---", "");
  L.push(`# Cascade du produit — ${c.projet ?? "—"}`, "");
  L.push(`**Version ${c.version ?? "—"} du ${c.date ?? "—"} · statut : ${c.statut ?? "—"}.** Règle : ${c.regle ?? "—"}. ` +
    "Vue générée depuis la source de la cascade par `generer-vue-cascade.mjs` (famille `gd-cascade-produit`) : " +
    "la modifier, c'est modifier la source puis régénérer.", "");
  L.push("Ce document rattache chaque exigence du produit à un moyen choisi (une **tactique**), chaque moyen à un effet " +
    "attendu (une **stratégie**), et chaque effet à ce que le demandeur cherche (l'**intention**). Une **alternative " +
    "écartée** est l'autre moyen qu'on aurait pu prendre ; un **indicateur** dit à quoi l'on verra qu'un effet est " +
    "atteint ; une **rupture** est un maillon qui ne remonte pas au niveau du dessus.", "");

  // 1. Intention
  L.push("## Intention", "", "Ce que le demandeur cherche, dans ses mots :", "");
  for (const cit of liste(intention.citations)) L.push(`> « ${cit.texte} »`, ">", `> — ${cit.source}`, "");
  L.push(`**Reformulation** : ${intention.reformulation ?? "—"}`, "");
  L.push(`**Validée** le ${v.date ?? "—"} par ${v.par ?? "—"} (${v.trace ?? "—"}).`, "");
  const parties = liste(c.parties_prenantes);
  if (parties.length) {
    L.push("| Partie prenante | Rôle | Ce qu'elle cherche |", "|---|---|---|");
    for (const p of parties) L.push(`| ${cellule(p.id)} | ${cellule(p.role)} | ${cellule(p.intention)} |`);
    L.push("");
  }
  if (c.arbitrage) L.push(`**Arbitrage** : ${c.arbitrage}`, "");
  L.push("**Contraintes** : " + (liste(c.contraintes).length
    ? liste(c.contraintes).map((x) => `${x.id} ${x.enonce} (${x.source})`).join(" ; ") : "aucune, déclaré.") , "");
  L.push("**Non-objectifs** : " + (liste(c.non_objectifs).length
    ? liste(c.non_objectifs).map((x) => `${x.id} ${x.enonce} (motif : ${x.motif})`).join(" ; ") : "aucun, déclaré."), "");

  // 2. Stratégie
  L.push("## Stratégie", "", "Les effets que le produit doit produire. Le manque fonde chaque effet ; l'indicateur dit comment on le verra, la cible ce qu'on attend.", "");
  L.push("| Stratégie | Effet attendu | Manque qui le fonde | Indicateur | Valeur actuelle | Cible |", "|---|---|---|---|---|---|");
  for (const s of strategies) {
    L.push(`| **${cellule(s.id)}**${marqueRetrait(s)} | ${cellule(s.effet)} | ${cellule(s.manque)} | ${cellule(indicateur(s.indicateur))} | ${cellule(valeurActuelle(s.valeur_actuelle))} | ${cellule(s.cible)} |`);
  }
  L.push("");

  // 3. Tactique
  L.push("## Tactique", "", "Mode de lecture : une ligne par moyen retenu, dans l'ordre de la source ; la colonne « Alternative écartée » dit ce qu'on n'a pas pris et pourquoi, la dernière si ce pourquoi est écrit dans une source (« sourcée ») ou reconstruit par qui a rédigé la cascade (« reconstruite », à ratifier).", "");
  L.push("| Tactique | Stratégie | Moyen retenu | Alternative écartée, et pourquoi | Source | Statut |", "|---|---|---|---|---|---|");
  for (const t of tactiques) {
    L.push(`| **${cellule(t.id)}**${marqueRetrait(t)} | ${cellule(t.strategie)} | ${cellule(t.moyen)} | ${cellule(`${t.alternative_ecartee ?? "—"} — ${t.justification ?? "—"}`)} | ${cellule(t.source)} | ${cellule(t.statut_justification)} |`);
  }
  L.push("");

  // 4. Opérationnel
  L.push("## Opérationnel", "", `Mode de lecture : une ligne par tactique ; la troisième colonne liste les exigences qui la réalisent${citees ? ", la quatrième combien d'entre elles un test cite" : ""}, la dernière les autres éléments qui la mettent en œuvre.`, "");
  L.push(citees ? "| Tactique | Stratégie | Exigences | Citées par un test | Autres éléments |" : "| Tactique | Stratégie | Exigences | Autres éléments |");
  L.push(citees ? "|---|---|---|---|---|" : "|---|---|---|---|");
  for (const t of tactiques) {
    const ex = liste(t.exigences);
    const autres = liste(t.autres_elements).map((e) => (typeof e === "object" ? `${e.id} (${e.type}) ${e.libelle}` : String(e))).join(" ; ");
    const cols = [`**${cellule(t.id)}**`, cellule(t.strategie), cellule(ex.join(", "))];
    if (citees) cols.push(`${ex.filter((e) => citees.has(e)).length} sur ${ex.length}`);
    cols.push(cellule(autres));
    L.push(`| ${cols.join(" | ")} |`);
  }
  L.push("");

  // 5. Test rétro
  L.push("## Test rétro", "");
  if (!jugement) {
    L.push("{Verdict d'`oracle-cascade-isto` rejoué à la génération : règles en échec, exigences rattachées, puis les mesures M1 à M4. Cette partie ne se rédige pas : elle se génère.}", "");
  } else {
    const echecs = jugement.findings.filter((f) => f.statut === "FAIL");
    L.push(`Verdict d'\`oracle-cascade-isto\` à la génération : **${jugement.verdict}**, ${jugement.findings.length - echecs.length} règle(s) tenue(s) sur ${jugement.findings.length}.`, "");
    if (echecs.length) {
      L.push("Ruptures et manques, à corriger avant toute remise :", "");
      for (const f of echecs) L.push(`- ${f.regle} : ${f.message}`);
      L.push("");
    }
    const o1 = jugement.findings.find((f) => f.regle === "O1" && f.statut === "PASS");
    L.push(o1 ? `- Rattachement : ${o1.message}.` : "- Rattachement des exigences : non jugé, le référentiel n'a pas été fourni à la génération.");
    const m = jugement.mesures || {};
    const dire = (ids, vide) => (ids && ids.length ? ids.join(", ") : vide);
    L.push(`- M1, cibles encore à fixer : ${dire(m.M1_cibles_a_fixer, "aucune")}.`);
    L.push(`- M2, justifications reconstruites, à ratifier : ${dire(m.M2_justifications_reconstruites, "aucune")}.`);
    L.push(m.M3_exigences_sans_test ? `- M3, exigences qu'aucun test ne cite : ${dire(m.M3_exigences_sans_test, "aucune")}.` : "- M3, exigences sans test : non mesuré, le dossier des tests n'a pas été fourni à la génération.");
    L.push(`- M4, stratégies non mesurées : ${dire(m.M4_strategies_non_mesurees, "aucune")}.`, "");
  }

  // 6. Tenir la cascade à jour
  L.push("## Tenir la cascade à jour", "");
  L.push("1. Une exigence nouvelle cite sa tactique dans la source de la cascade, jamais dans cette vue.");
  L.push("2. Un changement déclare le plus haut niveau qu'il touche (I, S, T ou O) par une entrée d'historique, avec la décision qui l'a voulu.");
  L.push("3. Un élément qui sort reste dans la source, marqué `retiree`, avec son motif ou son remplaçant.");
  L.push("4. Juger la source : `node <PILOT_ROOT>/oracles/oracle-cascade-isto.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests>`.");
  L.push("5. Régénérer cette vue : `node <PILOT_ROOT>/gabarits/documents/cascade-produit/generateur/generer-vue-cascade.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests> --sortie <CASCADE.md>`.", "");
  L.push("| Version | Date | Niveau touché | Ce qui change | Décision |", "|---|---|---|---|---|");
  for (const h of liste(c.historique)) L.push(`| ${cellule(h.version)} | ${cellule(h.date)} | ${cellule(h.niveau)} | ${cellule(h.resume)} | ${cellule(h.decision)} |`);
  L.push("", `*Gabarit : ${GABARIT} · version du gabarit ${VERSION_GABARIT}*`, "");
  return L.join("\n");
}

/** Lit la source et ses compagnons, juge, et rend `{ vue }` ; lève une erreur si la source est illisible. */
export function generer(cheminCascade, { exigences = null, tests = null, motif = "\\bE-\\d{3}\\b", squelette = false, racine = null } = {}) {
  const cascade = JSON.parse(readFileSync(cheminCascade, "utf8"));
  const referentiel = exigences ? (JSON.parse(readFileSync(exigences, "utf8")).exigences ?? []).map((e) => e.id) : null;
  const citees = tests ? lireTestsCites(tests, motif) : null;
  const rel = (p) => (racine ? relative(racine, p) : p).split("\\").join("/");
  const sources = [cheminCascade, exigences, tests].filter(Boolean).map(rel);
  const jugement = squelette ? null : (() => {
    const { findings, mesures } = juger(cascade, { referentiel, testsCites: citees });
    return { findings, mesures, verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS" };
  })();
  return { vue: rendreVue(cascade, { jugement, sources, citees }), jugement };
}

function selfTest() {
  const cas = [];
  const dir = mkdtempSync(join(tmpdir(), "vue-cascade-"));
  try {
    const src = join(dir, "CASCADE.json");
    const exig = join(dir, "EXIGENCES.json");
    writeFileSync(src, JSON.stringify(fixtureVerte(), null, 1), "utf8");
    writeFileSync(exig, JSON.stringify({ exigences: [{ id: "E-001" }, { id: "E-002" }] }), "utf8");
    const { vue, jugement } = generer(src, { exigences: exig, racine: dir });
    const parties = ["## Intention", "## Stratégie", "## Tactique", "## Opérationnel", "## Test rétro", "## Tenir la cascade à jour"];
    cas.push({ nom: "les six parties de la famille sont rendues", ok: parties.every((p) => vue.includes(`\n${p}\n`)) });
    cas.push({ nom: "chaque identifiant de la source est rendu", ok: ["STR-1", "STR-2", "TAC-1", "E-001", "E-002", "ECR-1", "C-1", "N-1", "PP-2"].every((i) => vue.includes(i)) });
    cas.push({ nom: "le test rétro porte le verdict de l'oracle", ok: jugement.verdict === "PASS" && vue.includes("**PASS**") });
    cas.push({ nom: "le couple gabarit et version est rendu", ok: vue.includes(`gabarit: ${GABARIT}`) && vue.includes(`version du gabarit ${VERSION_GABARIT}`) });
    cas.push({ nom: "une stratégie retirée porte son motif", ok: /STR-2\*\* \*\(retirée : fusionnée dans STR-1\)\*/.test(vue) });
    // Une barre verticale dans un champ ne casse pas le tableau.
    const piege = fixtureVerte(); piege.tactiques[0].moyen = "brouillon | déposé";
    cas.push({ nom: "une barre verticale est échappée dans les tableaux", ok: rendreVue(piege, {}).includes("brouillon \\| déposé") });
    // Rouge : une cascade en rupture rend son FAIL dans la vue, au lieu d'un test rétro décoratif.
    const rompue = fixtureVerte(); rompue.tactiques[0].strategie = "STR-9";
    writeFileSync(src, JSON.stringify(rompue), "utf8");
    const vRompue = generer(src, { exigences: exig }).vue;
    cas.push({ nom: "cas rouge — une rupture T2 est rendue au test rétro, verdict FAIL", ok: vRompue.includes("**FAIL**") && vRompue.includes("- T2 :") });
    // --verifier, dans les deux sens : une vue à jour passe, une vue retouchée à la main est refusée.
    writeFileSync(src, JSON.stringify(fixtureVerte(), null, 1), "utf8");
    const sortie = join(dir, "CASCADE.md");
    const moi = fileURLToPath(import.meta.url);
    const jouer = (...a) => spawnSync(process.execPath, [moi, src, "--exigences", exig, "--sortie", sortie, ...a], { encoding: "utf8" });
    const ecrite = jouer();
    const aJour = jouer("--verifier");
    cas.push({ nom: "--verifier sur une vue régénérée → exit 0", ok: ecrite.status === 0 && aJour.status === 0 });
    writeFileSync(sortie, readFileSync(sortie, "utf8").replace("## Tactique", "## Tactique\n\nAjout écrit à la main."), "utf8");
    const retouchee = jouer("--verifier");
    cas.push({ nom: "cas rouge — --verifier sur une vue retouchée à la main → exit 1", ok: retouchee.status === 1 });
    // La bibliothèque : le squelette et l'instance de la famille sont les sorties de ce générateur.
    const fam = join(ICI, "..");
    const gab = join(ICI, "..", "..", "..", "CASCADE-ISTO.json");
    if (existsSync(join(fam, "INSTANCE.json"))) {
      const inst = generer(join(fam, "INSTANCE.json"), { racine: fam }).vue;
      cas.push({ nom: "INSTANCE.md de la famille = vue régénérée depuis INSTANCE.json", ok: memeVue(readFileSync(join(fam, "INSTANCE.md"), "utf8"), inst) });
      const sq = generer(gab, { squelette: true, racine: fam }).vue;
      cas.push({ nom: "SQUELETTE.md de la famille = vue régénérée depuis gabarits/CASCADE-ISTO.json", ok: memeVue(readFileSync(join(fam, "SQUELETTE.md"), "utf8"), sq) });
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
  for (const c of cas) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.nom}`);
  const casse = cas.filter((c) => !c.ok);
  console.log(`\ngenerer-vue-cascade self-test : ${cas.length - casse.length}/${cas.length} PASS (recette à double sens : rupture rendue, vue retouchée refusée)`);
  process.exit(casse.length ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) selfTest();
  const opt = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const cible = args[0];
  if (!cible || cible.startsWith("--") || !existsSync(cible)) {
    console.error("source introuvable — usage : node generer-vue-cascade.mjs <CASCADE.json> [--exigences <EXIGENCES.json>] [--tests <dossier>] [--sortie <CASCADE.md>] [--verifier] [--squelette] | --self-test");
    process.exit(2);
  }
  let vue;
  try {
    const sortieOpt = opt("--sortie");
    ({ vue } = generer(cible, { exigences: opt("--exigences"), tests: opt("--tests"), motif: opt("--motif") ?? "\\bE-\\d{3}\\b",
      squelette: args.includes("--squelette"), racine: sortieOpt ? dirname(sortieOpt) : null }));
  } catch (e) { console.error(`source illisible : ${e.message}`); process.exit(2); }
  const sortie = opt("--sortie");
  if (args.includes("--verifier")) {
    if (!sortie || !existsSync(sortie)) { console.error("--verifier exige --sortie <vue existante>"); process.exit(2); }
    const identique = memeVue(readFileSync(sortie, "utf8"), vue);
    console.log(identique ? `vue à jour : ${sortie}` : `vue en écart avec sa source : ${sortie} — éditée à la main, ou source modifiée sans régénération. Régénérer sans --verifier.`);
    process.exit(identique ? 0 : 1);
  }
  if (sortie) { writeFileSync(sortie, vue, "utf8"); console.log(`vue écrite : ${sortie}`); } else process.stdout.write(vue);
  process.exit(0);
}
