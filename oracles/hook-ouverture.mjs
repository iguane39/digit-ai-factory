#!/usr/bin/env node
/**
 * hook-ouverture.mjs — hook `SessionStart` de Claude Code : la règle de fraîcheur s'EXÉCUTE
 * au lieu d'être rappelée. À l'ouverture (ou la reprise) d'une session : `bootstrap.mjs --pull`
 * (pilot, treize forges, skills — versions affichées), contrôle des README d'input\/output\,
 * puis les gates actifs sont dits à l'assistant — ce que ce hook imprime entre dans son
 * contexte.
 *
 * Pourquoi (R-44, mandat humain du 20/08 : « les mises à jour des forges ne sont toujours pas
 * appliquées ») : CLAUDE.md disait « à l'ouverture de tout run — pull + bootstrap --pull » ;
 * aucune session ne le faisait sans y être invitée. La règle a désormais un exécutant.
 *
 * Options : --sans-bootstrap · --sans-readme (sessions produit : les README du pilot ne sont
 * pas leur affaire) · --pilot <dossier> (lanceur produit : chemin du pilot résolu) ·
 * --contexte-json (sortie `hookSpecificOutput.additionalContext`, exigée quand le hook est déclaré
 * `async` — voir la fin du fichier).
 */
import { existsSync, readFileSync, readdirSync, copyFileSync, mkdirSync, appendFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir, hostname } from "node:os";
import { join, dirname, sep, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { passerOuvertureEnAsync, fusionnerHooksDuGabarit } from "./lib-ouverture-async.mjs";
import { borner, BUDGET_CONTEXTE_ASYNC } from "./lib-budget-contexte.mjs";
import { lireEntreeHook, gestesDansFenetre, lignesGestesAvant } from "./lib-gestes-avant-releve.mjs";
import { constatR47 } from "./lib-resume-r47.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
// TF-1635 (c) : l'instant où le relevé commence, et l'entrée du hook (chemin de la transcription),
// lue avant tout geste lent — elle sert à déclarer les gestes faits pendant le tirage.
const DEBUT_RELEVE = Date.now();
const ENTREE_HOOK = args.includes("--contexte-json") ? lireEntreeHook() : null;
const iPilot = args.indexOf("--pilot");
const PILOT = iPilot >= 0 ? args[iPilot + 1] : join(ICI, "..");
// TF-1887 (19/10/2026) : un chemin de COMMANDE prescrite s'écrit avec des barres obliques. Sous Git Bash, la
// barre inverse non protégée est avalée (`--racines output\03-Syntheses` devenait `output03-Syntheses`, exit 2) ;
// Node accepte la barre oblique sous Windows comme sous Bash. La prose des documents garde ses barres inverses.
const enSlash = (p) => String(p).replace(/\\/g, "/");
const lignes = [];

// TF-1635 (13/10/2026) — LE PRODUIT PASSE SON HOOK D'OUVERTURE EN ASYNC, AVANT TOUT GESTE LENT.
// Le gabarit `settings-produit.json` est corrigé, mais `.claude/settings.json` d'un produit n'est
// jamais recopié : mesuré le 13/10, 19 produits sur 19 gardaient le hook synchrone à 240 s, que
// l'extension VS Code coupe à 60 s. La réparation est faite ICI, en premier, parce qu'un hook
// synchrone coupé à 60 s ne laisse rien faire à ce qu'il aurait joué ensuite. Lancé en synchrone
// (sans `--contexte-json`), le hook rend aussitôt la main avec les seules règles de session : le
// relevé complet attend l'ouverture suivante, déjà asynchrone, plutôt que de faire échouer celle-ci.
// TF-1755 (15/10/2026) — ET TOUTE ENTRÉE DU GABARIT QUI MANQUE AU PRODUIT S'Y AJOUTE, au même moment et
// par le même principe : chirurgical, ajout seulement, exclusions déclarées par le produit dans le
// fichier (`_hooks_factory_exclus`). Seulement chez un produit qui porte le lanceur : sans lui, une
// entrée ajoutée appellerait un fichier absent.
const lignesFusion = [];
if (iPilot >= 0 && existsSync(join(process.cwd(), "forge", "hooks", "factory.mjs"))) {
  const fu = fusionnerHooksDuGabarit(join(process.cwd(), ".claude", "settings.json"), join(PILOT, "gabarits", "settings-produit.json"));
  if (fu.etat === "corrige") lignesFusion.push("## Câblage des hooks de la factory (TF-1755)",
    `- \`.claude/settings.json\` : ${fu.ajoutes.length} entrée(s) du gabarit ajoutée(s) — ${fu.ajoutes.join(", ")} ; rien d'autre n'est touché. Actives à la prochaine session. Enregistrer ce changement avec le travail du produit ; pour en écarter une, la déclarer sous \`_hooks_factory_exclus\` avec son motif.`
      + (fu.exclus.length ? ` Exclusion(s) déclarée(s) et respectée(s) : ${fu.exclus.join(", ")}.` : ""), "");
  else if (fu.etat === "illisible" || fu.etat === "gabarit_illisible") lignesFusion.push("## Câblage des hooks de la factory (TF-1755)", `- fusion NON jouée (${fu.etat} : ${fu.detail}) : les entrées neuves du gabarit n'atteignent pas ce produit.`, "");
}
if (iPilot >= 0) {
  const r = passerOuvertureEnAsync(join(process.cwd(), ".claude", "settings.json"));
  if (r.etat === "corrige" && !args.includes("--contexte-json")) {
    console.log([
      "## Ouverture de session (TF-1635)",
      "- `.claude/settings.json` de ce produit déclarait le hook d'ouverture en synchrone, que l'extension VS Code coupe à 60 s. Il vient d'être passé en `async` avec `--contexte-json` ; le reste du fichier est intact. Le relevé complet (fraîcheur, héritage, boîte d'entrée) arrivera à la prochaine ouverture : ne pas supposer le poste à jour d'ici là. Enregistrer ce changement avec le travail du produit.",
      ...lignesFusion,
      ...lignesGates(),
    ].join("\n"));
    process.exit(0);
  }
  lignes.push(...lignesFusion);
  if (r.etat === "corrige") lignes.push("## Ouverture de session (TF-1635)", "- `.claude/settings.json` de ce produit : hook d'ouverture complété (`async`, `--contexte-json`) ; le reste du fichier est intact. Enregistrer ce changement avec le travail du produit.", "");
  if (r.etat === "illisible") lignes.push("## Ouverture de session (TF-1635)", `- \`.claude/settings.json\` illisible (${r.detail}) : le hook d'ouverture n'a pas pu être vérifié en async. S'il est synchrone, l'extension VS Code coupera l'ouverture à 60 s.`, "");
}

if (!args.includes("--sans-bootstrap")) {
  const b = join(PILOT, "bootstrap.mjs");
  if (existsSync(b)) {
    // TF-1657 : chez un produit, un défaut du parc (canal confidentiel) n'empêche pas CE produit de
    // travailler — il est dit en avertissement, à relever au lot, sans rendre le poste « NON prêt ».
    const r = spawnSync(process.execPath, [b, "--pull", ...(iPilot >= 0 ? ["--pour-produit"] : [])], { encoding: "utf8", timeout: 200000, cwd: PILOT });
    const sortie = (r.stdout || "") + (r.stderr || "");
    const utiles = sortie.split(/\r?\n/).filter((l) => /^\[(DEFAUT|avert|relance)\]|^Poste|^Parc|^\s{2}digit-ai-/.test(l));
    lignes.push(`## Fraîcheur (bootstrap --pull, exit ${r.status ?? "?"})`, ...utiles.map((l) => l.trimEnd()));
    if (r.status !== 0) lignes.push("→ Poste NON prêt : appliquer les remèdes ci-dessus AVANT tout run (règle Fraîcheur, R-19).");
  } else lignes.push("## Fraîcheur : bootstrap.mjs introuvable dans le pilot — mise à jour NON jouée.");
  indicesApresRapatriement();
}

// TF-1359 (D-21 (b), 26/09/2026) — L'UNICITÉ DES INDICES SE REJOUE APRÈS TOUT CE QUI A PU AMENER UN
// LIVRABLE : tirage de ce relevé, rebase ou fusion d'une session depuis l'ouverture précédente. Le
// 23/09, deux synthèses ont pris l'indice « d » sur les deux postes, et seul un passage à la main de
// R-4 l'a vu, seize heures plus tard. La tête relevée à chaque ouverture est gardée dans les
// métadonnées LOCALES de git (rien de suivi, rien de publié) ; seules les collisions qui touchent un
// livrable arrivé depuis sont rejugées — le passif ancien se compte, il ne s'accuse pas à chaque
// ouverture. Tant qu'une collision neuve reste, la tête n'avance pas : elle est redite à l'ouverture
// suivante au lieu de glisser dans le passif.
function indicesApresRapatriement() {
  const outil = join(PILOT, "scripts", "indices-uniques.mjs");
  const g = (...a) => spawnSync("git", ["-C", PILOT, ...a], { encoding: "utf8" });
  const tete = g("rev-parse", "HEAD").stdout.trim();
  const cheminEtat = (() => { const p = g("rev-parse", "--git-path", "digit-ai-derniere-ouverture.json").stdout.trim(); return p ? (isAbsolute(p) ? p : join(PILOT, p)) : null; })();
  if (!existsSync(outil) || !tete || !cheminEtat) return;
  let precedente = null;
  try { precedente = JSON.parse(readFileSync(cheminEtat, "utf8")).tete || null; } catch { /* première ouverture sur ce poste */ }
  const jouer = (...extra) => { const r = spawnSync(process.execPath, [outil, PILOT, "--json", ...extra], { encoding: "utf8", cwd: PILOT }); try { return JSON.parse(r.stdout); } catch { return null; } };
  const o = precedente && precedente !== tete ? jouer("--depuis", precedente) : jouer("--depuis", tete);
  if (!o || !Array.isArray(o.collisions)) { lignes.push("", "## Indices des livrables (R-4, TF-1359) : NON JUGÉ — R-4 illisible, ou tête de l'ouverture précédente introuvable."); return; }
  const passif = `passif : ${o.passif} indice(s) partagé(s) antérieur(s), non rejugé(s)`;
  if (o.collisions.length) {
    lignes.push("", `## Indices des livrables (R-4, TF-1359) : DÉFAUT — ${o.collisions.length} indice(s) partagé(s) par un livrable arrivé depuis l'ouverture précédente`,
      ...o.collisions.map((c) => `- ${c.ou} ${String(c.message).split(" : l'indice existe")[0]}`),
      "→ réindexer le plus récent : `node scripts/allouer-indice.mjs`, puis renommer ; la tête relevée n'avance pas avant.");
    return;
  }
  lignes.push("", !precedente
    ? `## Indices des livrables (R-4, TF-1359) : tête de référence posée (${tete.slice(0, 8)}) ; ${passif}.`
    : precedente === tete
      ? `## Indices des livrables (R-4, TF-1359) : aucun enregistrement depuis l'ouverture précédente ; ${passif}.`
      : `## Indices des livrables (R-4, TF-1359) : uniques pour ce qui est arrivé depuis ${precedente.slice(0, 8)} ; ${passif}.`);
  try { writeFileSync(cheminEtat, JSON.stringify({ tete, releve_le: new Date().toISOString() }), "utf8"); } catch { /* état non écrit : la prochaine ouverture repartira de la référence */ }
}

// ---- L'HÉRITAGE SE VÉRIFIE À L'OUVERTURE, ET PLUS SEULEMENT QUAND UN LOT REMONTE (30/08/2026) --
//
// LE FAIT, mesuré le 30/08 : la règle qui compare les artefacts hérités d'un produit à leur source
// du pilot (R-47) EXISTE, elle est exacte, et elle nomme son remède — jouée sur un produit réel,
// elle rend « forge/RESTITUTION.md diverge de gabarits/RESTITUTION.md. Recopier depuis le pilot ».
// Elle n'était appelée qu'à DEUX moments : quand le pilot ingère un lot de retours de ce produit,
// et quand un humain la lance à la main.
//
// CE QUE ÇA PRODUISAIT : un produit qui consomme la Factory sans jamais renvoyer de lot n'était
// JAMAIS contrôlé. Relevé du parc le même jour — 6 produits instanciés, 2 portant les trois pièces
// de la doctrine, 4 n'en portant aucune. La redescente d'une doctrine dépendait donc du trafic
// sortant de chaque produit, ce que le destinataire a décrit d'un mot : « assez aléatoire ».
//
// CE QUI EST FAIT ICI (décision humaine du 30/08, voie « a ») : le contrôle RECOPIE lui-même les
// artefacts déclarés en COPIE IDENTIQUE, dit lesquels, puis se juge. Le signalement seul avait été
// livré d'abord et la mesure a tranché contre lui : quatre produits sur six vivaient depuis des
// jours avec un défaut que personne n'avait traité. Un signalement que personne ne traite est le
// même trou que l'absence de signalement, avec l'illusion en plus.
//
// POURQUOI CE N'EST PAS LE PILOT QUI ÉCRIT CHEZ LE PRODUIT, et c'est ce qui rend la voie légitime :
// ce hook s'exécute DANS le produit, lancé par la configuration du produit. C'est le produit qui se
// met à jour lui-même, ce que la doctrine autorise ; le pilot ne fait que fournir la source.
//
// TROIS BORNES, chacune posée contre un dégât précis :
//   · SEULS les artefacts en mode `copie_conforme` sont touchés. Ce mode dit littéralement que le
//     produit ne les personnalise JAMAIS et que les faire diverger casse le jugement rendu
//     ailleurs. Les modes `presence` et `presence_et_motif` couvrent au contraire des fichiers
//     légitimement adaptés — un `.gitignore`, un `CLAUDE.md` produit — et y toucher détruirait le
//     travail du produit ;
//   · RIEN si le produit n'a pas de `forge\` : il n'a jamais été instancié, et l'instancier par
//     surprise au démarrage d'une session serait une décision prise à la place de l'humain ;
//   · JAMAIS sur le pilot : `--pilot` n'est passé que par le lanceur d'un produit. Le pilot EST la
//     source, se recopier sur soi-même n'a pas de sens.
//
// L'ORDRE COMPTE : on recopie D'ABORD, on juge ENSUITE. Le compte rendu porte donc la liste de ce
// qui a changé ET le verdict de l'état FINAL — sans quoi il annoncerait un défaut déjà réparé, et
// l'agent qui le lit chercherait à corriger ce qui l'est.
if (iPilot >= 0) {
  const o = join(PILOT, "oracles", "oracle-conformite-projet.mjs");
  const PRODUIT = process.cwd();
  const recopies = [];
  const refus = [];
  try {
    const manifeste = join(PILOT, "gabarits", "HERITAGE.json");
    if (existsSync(manifeste) && existsSync(join(PRODUIT, "forge"))) {
      const h = JSON.parse(readFileSync(manifeste, "utf8"));
      const norme = (t) => t.replace(/\r\n/g, "\n");
      for (const a of (h.artefacts || [])) {
        if (a.mode !== "copie_conforme") continue;
        const src = join(PILOT, a.source.replace(/\//g, sep));
        const dst = join(PRODUIT, a.cible.replace(/\//g, sep));
        if (!existsSync(src)) { refus.push(`${a.source} — source absente du pilot, rien à recopier`); continue; }
        const avant = existsSync(dst) ? norme(readFileSync(src, "utf8")) === norme(readFileSync(dst, "utf8")) : false;
        if (avant) continue;
        const etat = existsSync(dst) ? "remplacé" : "créé";
        mkdirSync(dirname(dst), { recursive: true });
        copyFileSync(src, dst);
        recopies.push(`${a.cible} — ${etat} depuis ${a.source}`);
      }
    }
  } catch (e) {
    refus.push(`recopie interrompue : ${e.message} — l'état du produit n'est pas garanti, le verdict ci-dessous fait foi`);
  }
  // TF-0869 — le `.env` local NAÎT à l'ouverture, vide, à côté de son exemple. Le fait mesuré le
  // 06/09 : aucun `.env` n'existait chez le produit et rien ne prescrivait d'en créer un ; le
  // commanditaire a donc saisi sa clé d'API dans le `.env.example`, VERSIONNÉ — un commit de plus
  // et le secret partait. Le fichier créé ici est gitignoré (R-14) : la place où poser une valeur
  // existe AVANT qu'on ait besoin d'en poser une. JAMAIS d'écrasement : un `.env` présent porte
  // des valeurs que personne d'autre ne connaît.
  try {
    const ex = [".env.example", ".env.exemple"].map((n) => join(PRODUIT, n)).find((f) => existsSync(f));
    const local = join(PRODUIT, ".env");
    if (ex && !existsSync(local)) {
      const squelette = readFileSync(ex, "utf8").split(/\r?\n/)
        // une variable déléguée à l'humain (« # à fournir : ») naît VIDE, quoi qu'en dise l'exemple
        .map((l) => (/^[A-Z][A-Z0-9_]*=/.test(l) && /#\s*à\s+fournir/i.test(l) ? l.replace(/^([A-Z][A-Z0-9_]*)=[^#]*/, "$1=") : l))
        .join("\n");
      writeFileSync(local, squelette);
      recopies.push(".env — créé depuis .env.example (valeurs « # à fournir : » vides) ; gitignoré, c'est LA place d'un secret — jamais l'exemple (TF-0869)");
    }
  } catch (e) {
    refus.push(`.env local non créé : ${e.message} — poser les valeurs dans un \`.env\` créé à la main, jamais dans \`.env.example\` (TF-0869)`);
  }
  if (existsSync(o)) {
    const r = spawnSync(process.execPath, [o, PRODUIT], { encoding: "utf8", timeout: 60000 });
    let f = null;
    try {
      const brut = r.stdout || "";
      const j = JSON.parse(brut.slice(brut.indexOf("{")));
      f = constatR47(j.findings); // TF-1829 : le pire constat R-47, pas le premier
    } catch { /* verdict illisible : on le dit, on n'invente pas */ }
    lignes.push("", "## Héritage du pilot (R-47)");
    // CE QUI A ÉTÉ ÉCRIT SE DIT AVANT LE VERDICT, toujours, et même quand tout est vert. Un fichier
    // remplacé sous les pieds d'une session sans que rien ne le dise est le pire des deux mondes :
    // l'agent lit un contenu qu'il n'a pas vu changer et n'a aucun moyen de savoir pourquoi.
    if (recopies.length) {
      lignes.push(`- **${recopies.length} artefact(s) MIS À JOUR à l'instant** depuis le pilot (mode « copie identique » — ces pièces ne se personnalisent pas) :`,
        ...recopies.map((r) => `  - ${r}`),
        "  Si l'un d'eux portait une modification locale, elle a été écrasée : c'est ce que le mode déclare, et la version du pilot fait foi.");
    }
    for (const r of refus) lignes.push(`- non recopié : ${r}`);
    if (!f) lignes.push("- verdict ILLISIBLE — le contrôle n'a pas rendu de résultat exploitable ; ce n'est pas un constat sur ce produit.");
    else if (f.statut === "PASS") lignes.push(`- à jour — ${f.message}`);
    else if (f.statut === "SANS_OBJET") lignes.push(`- sans objet — ${f.message}`);
    else {
      // Ce qui RESTE en défaut après la recopie ne peut être qu'un artefact des modes `presence` ou
      // `presence_et_motif` — des fichiers que le produit personnalise légitimement et auxquels ce
      // hook ne touche jamais. Le remède redevient donc un geste, et il est nommé.
      lignes.push(`- **DÉFAUT PERSISTANT après recopie** — ${f.message}`,
        "- Ce qui reste ne relève PAS de la copie identique : ce sont des pièces que ce produit personnalise",
        "  (fichier de consignes, câblage des hooks, exclusions git). Les compléter est un geste de ce produit,",
        `  la source de chacune étant déclarée dans ${join(PILOT, "gabarits", "HERITAGE.json")}. Puis rejouer :`,
        `  node "${enSlash(o)}" "${enSlash(PRODUIT)}"`,
        "- Non bloquant : ce contrôle DÉCLARE ce qu'il ne peut pas réparer, il n'arrête pas la session.");
    }
  }
}

// TF-1758 et TF-1760 (15/10/2026) — LE PRODUIT VOIT SES LOTS NON REMIS ET CE QUE SONT DEVENUS SES RETOURS.
// Mesuré le 15/10 : quatre lots `a_remettre` de 17 à 50 jours, absents du pilot, qu'aucun contrôle ne lisait ;
// et aucune des 24 sections de ce relevé ne disait au produit le sort de ses TF. Le registre public porte
// des pseudonymes : celui de CE produit se retrouve par la table (oracles/lib-retours-produit.mjs), et seul
// lui est imprimé. L'instant de l'ouverture précédente vit dans les métadonnées git LOCALES du produit.
if (iPilot >= 0 && existsSync(join(process.cwd(), "forge", "retours"))) {
  try {
    const t0 = Date.now();
    const { pseudonymesDuProduit, lotsARemettre, vosRetours, SEUIL_H } = await import(pathToFileURL(join(ICI, "lib-retours-produit.mjs")).href);
    const { pseudos, tables, anon } = await pseudonymesDuProduit(process.cwd(), PILOT);
    const enAttente = await lotsARemettre(process.cwd(), PILOT, { anon });
    if (enAttente.length) {
      const jamais = enAttente.filter((l) => l.parvenu === false), parvenus = enAttente.filter((l) => l.parvenu === true);
      lignes.push("", `## Lots de retours restés « a_remettre » plus de ${SEUIL_H} h (TF-1758)`);
      if (jamais.length) lignes.push(`- **${jamais.length} lot(s) JAMAIS parvenu(s) au pilot** — ${jamais.slice(0, 6).map((l) => `« ${l.nom} » (${l.jours} j)`).join(", ")}${jamais.length > 6 ? ", …" : ""} : jouer \`node forge/retours/oracle-lot.mjs "<lot>.md"\`, copier le lot et son sidecar dans \`${enSlash(join(PILOT, "input", "00-retours", "_arrivee"))}\`, puis passer la ligne de statut à « remis le <date> ».`);
      if (parvenus.length) lignes.push(`- ${parvenus.length} lot(s) déjà reçu(s) par le pilot dont la ligne de statut dit encore « a_remettre » : la passer à « remis le <date> » (seule édition permise d'un lot remis).`);
      const inconnus = enAttente.length - jamais.length - parvenus.length;
      if (inconnus) lignes.push(`- ${inconnus} lot(s) dont l'arrivée au pilot n'a pas pu être vérifiée (boîte du pilot illisible).`);
    }
    const cheminEtat = (() => { const r = spawnSync("git", ["rev-parse", "--git-path", "digit-ai-vos-retours.json"], { encoding: "utf8", cwd: process.cwd() }); const p = (r.stdout || "").trim(); return r.status === 0 && p ? (isAbsolute(p) ? p : join(process.cwd(), p)) : null; })();
    let depuis = null;
    try { depuis = JSON.parse(readFileSync(cheminEtat, "utf8")).ouverture || null; } catch { /* première ouverture, ou hors dépôt git */ }
    const v = vosRetours(pseudos, PILOT, { depuis });
    if (v && v.total) {
      const comptes = Object.entries(v.parStatut).sort((a, b) => b[1] - a[1]).map(([s, n]) => `${n} ${s}`).join(", ");
      lignes.push("", `## Vos retours au registre du pilot (TF-1760)`,
        `- ${v.total} TF désignent ce produit au registre public (pseudonyme : ${pseudos.filter((p) => /^Produit-\d+$/.test(p)).join(", ") || pseudos.join(", ")}) : ${comptes}.`);
      if (depuis) lignes.push(v.closDepuis.length
        ? `- ${v.closDepuis.length} clos depuis votre ouverture précédente (${depuis.slice(0, 16).replace("T", " ")} UTC) : ${v.closDepuis.slice(0, 6).map((x) => `${x.id} ${x.statut} — ${String(x.titre || "").slice(0, 90)}`).join(" ; ")}${v.closDepuis.length > 6 ? " ; …" : ""}`
        : `- aucun clos depuis votre ouverture précédente (${depuis.slice(0, 16).replace("T", " ")} UTC).`);
      lignes.push(`- Détail : \`todo\\TODO.jsonl\` du pilot, ou les lots de travaux reçus sous \`forge\\travaux\\\`.`);
    }
    if (!tables) lignes.push(`- pseudonyme NON résolu (tables du canal confidentiel absentes) : le registre a été lu sous le nom brut seul, ses retours sous pseudonyme ne sont pas comptés.`);
    if (cheminEtat) { try { writeFileSync(cheminEtat, JSON.stringify({ ouverture: new Date().toISOString() }), "utf8"); } catch { /* état non écrit */ } }
    if (Date.now() - t0 > 5000) lignes.push(`- (relevé des retours : ${Date.now() - t0} ms)`);
  } catch (e) { lignes.push("", `- lots et retours du produit : NON relevés (${String(e.message).slice(0, 160)})`); }
}

// TF-1642 (14/10/2026) — LA FRAÎCHEUR NE SE JUGE PLUS SUR LES SEULS DÉPÔTS DE LA FACTORY. Le 12/10, un
// rapport a recommandé un correctif livré 13 jours plus tôt : le clone lu avait 290 commits de retard,
// et l'ouverture ne mesurait que le pilot et les forges. Chez un produit, son propre dépôt est mesuré
// contre son distant ; pour tout autre dépôt lu, la sonde se joue avant de citer son code.
if (iPilot >= 0) {
  try {
    const { mesurerFraicheur } = await import(pathToFileURL(join(PILOT, "scripts", "fraicheur-depot.mjs")).href);
    const f = mesurerFraicheur(process.cwd());
    lignes.push("", "## Fraîcheur du dépôt de ce produit (TF-1642)",
      f.etat === "non_jugeable" ? `- non jugeable — ${f.motif}` : `- ${f.etat === "en_retard" || f.etat === "diverge" ? "**" + f.etat.toUpperCase().replace("_", " ") + "** — " : ""}${f.citation}${f.retard ? ` ; ${f.geste}` : ""}`,
      `- Tout AUTRE dépôt dont le code est lu ou cité se mesure avant : \`node "${enSlash(join(PILOT, "scripts", "fraicheur-depot.mjs"))}" <dépôt>\` (référence lue et écart au distant à citer ; en retard, lire la référence distante).`);
  } catch (e) { lignes.push("", `- fraîcheur du dépôt du produit : NON mesurée (${String(e.message).slice(0, 160)})`); }
}

// TF-1676 (14/10/2026) — LA RÈGLE HUMAINE DU 01/10/2026 SUR LES NOMS DESCEND CHEZ LES PRODUITS. Elle
// n'était écrite qu'au § 3 sexies de CONTRAT-INTERFACE.md : le même jour, chez un produit à dépôt privé,
// une session a anonymisé avant commit et une autre a proposé d'anonymiser la norme de rangement ;
// l'humain a refusé. Le CLAUDE.md d'un produit n'est jamais recopié : l'ouverture, elle, atteint
// chaque produit. La visibilité du dépôt se MESURE (gh), elle ne se suppose pas.
if (iPilot >= 0) {
  const v = spawnSync("gh", ["repo", "view", "--json", "visibility", "-q", ".visibility"], { encoding: "utf8", cwd: process.cwd(), timeout: 15000, windowsHide: true });
  const visibilite = v.status === 0 ? (v.stdout || "").trim().toUpperCase() : "";
  const regle = "règle humaine du 01/10/2026 : « Les dépôts privés peuvent conserver des données de type nom » ; la pseudonymisation ne vaut que pour ce qui sort vers un dépôt PUBLIC (pilot, forge publique), lot de retours compris, que le pilot pseudonymise lui-même à l'accueil";
  lignes.push("", "## Noms réels dans ce dépôt (TF-1676)", visibilite === "PRIVATE"
    ? `- Dépôt PRIVÉ (mesuré par gh) : il versionne les noms réels de clients, de produits et de personnes, sans anonymiser avant commit — ${regle}.`
    : visibilite === "PUBLIC"
      ? `- Dépôt PUBLIC (mesuré par gh) : aucun nom réel de tiers n'y entre ; pseudonymiser avant commit — ${regle}.`
      : `- Visibilité NON mesurée (\`gh repo view --json visibility\` sans réponse) : la mesurer avant de pseudonymiser quoi que ce soit — ${regle}.`);
}

// TF-1658 (14/10/2026) — UN SOCLE POSÉ À CÔTÉ DU DÉPÔT D'UN TIERS SE JUGE À CHAQUE OUVERTURE : rien
// de nouveau sous le clone du tiers depuis son relevé. Sans objet pour tout autre projet.
if (iPilot >= 0 && existsSync(join(process.cwd(), "forge", "DEPOT-TIERS.json"))) {
  try {
    const { verifierDepotTiers } = await import(pathToFileURL(join(PILOT, "scripts", "adopter-projet-existant.mjs")).href);
    const v = verifierDepotTiers(process.cwd());
    lignes.push("", "## Dépôt du tiers en lecture seule (TF-1658)", v.verdict === "FAIL" ? `- **DÉFAUT — ${v.message}**` : `- ${v.verdict === "PASS" ? "intact" : "sans objet"} — ${v.message}`);
  } catch (e) { lignes.push("", `- dépôt du tiers : NON jugé (${String(e.message).slice(0, 160)})`); }
}

if (!args.includes("--sans-readme")) {
  const g = join(PILOT, "scripts", "readme-dossiers.mjs");
  if (existsSync(g)) {
    const r = spawnSync(process.execPath, [g, "--check", "--base", PILOT], { encoding: "utf8" });
    lignes.push("", r.status === 0 ? "## README d'input\\ et output\\ : à jour." : `## README d'input\\ et output\\ : DÉFAUT — ${(r.stderr || "").trim().split("\n").slice(0, 4).join(" ")} → node scripts/readme-dossiers.mjs puis rédiger les rôles.`);
  }
}

// TF-0762 (02/09/2026) — L'HÉRITAGE DES PRODUITS SE LIT À L'OUVERTURE DU PILOT, PAS À L'INGESTION
// DE LEURS LOTS. Le fait : un produit a appris à l'ingestion de son lot que sept artefacts hérités
// lui manquaient — dont l'oracle de forme des lots, qu'il aurait voulu jouer AVANT de remettre.
// « Un avertissement juste, arrivé trop tard, est un avertissement perdu. » Le relevé existe
// (scripts/relever-heritage.mjs, lecture seule, TF-0626) ; il se joue ici, à chaque ouverture du
// pilot, et nomme les produits en défaut avec le geste qui les remet à niveau — geste du PRODUIT
// (son hook d'ouverture recopie les copies identiques) ou geste humain (poser le lanceur quand il
// n'existe pas). Chez le produit, le même contrôle se joue déjà à SON ouverture (30/08) quand le
// lanceur est présent ; ce relevé couvre le cas où il ne l'est pas.
if (iPilot < 0) {
  const relever = join(PILOT, "scripts", "relever-heritage.mjs");
  if (existsSync(relever)) {
    const r = spawnSync(process.execPath, [relever, "--json"], { encoding: "utf8", timeout: 90000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* relevé illisible : dit ci-dessous */ }
    lignes.push("", "## Héritage des produits (R-47, relevé en lecture seule)");
    if (!j) lignes.push("- relevé ILLISIBLE — le contrôle n'a pas rendu de résultat exploitable ; ce n'est pas un constat sur les produits.");
    else {
      const enDefaut = (j.lignes || []).filter((l) => (l.absents || 0) + (l.divergents || 0) + (l.incomplets || 0) > 0);
      lignes.push(`- ${j.produits} produit(s) relevé(s), ${j.manques} manque(s) — contrat ${j.contrat}`);
      // Mandat d'amélioration continue (03/09/2026) : (a) le relevé se JOURNALISE — c'est la seule
      // source du délai « clôture au pilot → descente constatée chez le produit » du tableau de
      // bord todo/RECIDIVES.md ; sans journal, la descente n'est jamais mesurée, seulement
      // supposée ; (b) chez un produit SANS lanceur, on nomme les FAMILLES de défaut dont il n'est
      // pas protégé (familles_protegees des artefacts absents, gabarits/HERITAGE.json) — « il lui
      // manque trois fichiers » ne dit rien à l'humain qui décide de poser le lanceur ; « il n'est
      // protégé ni des restitutions hors gabarit ni des lots hors forme » dit ce que coûte l'attente.
      let famillesDe = () => [];
      try {
        const her = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
        const parCible = new Map((her.artefacts || []).map((a) => [a.cible, a.familles_protegees || []]));
        famillesDe = (l) => [...new Set((l.artefacts || []).filter((a) => a.etat === "absent" || a.etat === "divergent" || a.etat === "incomplet").flatMap((a) => parCible.get(a.cible) || []))].sort();
      } catch { /* héritage illisible : les familles ne sont pas nommées, le manque l'est déjà */ }
      // D-1 (a) du 03/09/2026 — LE JOURNAL EST SUIVI PAR GIT, DONC IL NE PORTE QUE DES PSEUDONYMES.
      // Cinq ouvertures ont écrit ici le chemin RÉEL de chaque produit ; la porte de publication
      // (oracle-nom-client-publie) a rendu 21 constats C1 sur ce fichier et sur todo/RECIDIVES.md
      // qui en est généré — le matin même de la réécriture d'historique qui retirait ces noms.
      // Le pseudonyme sort de scripts/lib-pseudonyme-produit.mjs (référentiels hors dépôt) ; si un
      // référentiel manque, on ne journalise PAS et on le dit : un nom réel de plus n'est jamais
      // le moindre mal. L'affichage à l'écran, lui, garde les chemins réels — il n'est pas suivi.
      try {
        const { pseudonymeProduit } = await import("../scripts/lib-pseudonyme-produit.mjs");
        appendFileSync(join(PILOT, "todo", "HERITAGE-RELEVES.jsonl"), JSON.stringify({
          ts: new Date().toISOString(), contrat: j.contrat, produits: (j.lignes || []).map((l) => ({
            produit: pseudonymeProduit(l.produit), absents: l.absents, divergents: l.divergents, incomplets: l.incomplets, total: l.total,
            artefacts: (l.artefacts || []).map((a) => ({ cible: a.cible, etat: a.etat })),
          })),
        }) + "\n", "utf8");
      } catch (e) { lignes.push(`- relevé NON journalisé (${e.message}) — le délai de descente ne se mesurera pas sur cette ouverture ; aucun nom réel n'a été écrit`); }
      for (const l of enDefaut.slice(0, 12)) {
        const lanceur = (l.artefacts || []).find((a) => /hooks\/factory\.mjs$/.test(a.cible || ""));
        const sansLanceur = lanceur && lanceur.etat === "absent";
        lignes.push(`  - ${l.produit} : ${l.absents} absent(s), ${l.divergents} divergent(s), ${l.incomplets} incomplet(s) sur ${l.total}` +
          (sansLanceur ? ` — SANS lanceur de hooks : rien ne se remettra à niveau tout seul ; poser gabarits/hooks-factory.mjs et settings-produit.json chez lui (geste humain, R-29)${famillesDe(l).length ? ` ; NON PROTÉGÉ des familles : ${famillesDe(l).join(", ")}` : ""}`
            : " — remis à niveau à sa prochaine ouverture (copies identiques) ; le reste est un geste du produit"));
      }
      if (enDefaut.length > 12) lignes.push(`  - … et ${enDefaut.length - 12} autre(s) — détail : node scripts/relever-heritage.mjs --md <fichier>`);
      if (!enDefaut.length) lignes.push("- tous les produits relevés portent leur héritage à jour");

      // TF-1758 (15/10/2026) — LES LOTS RESTÉS « a_remettre » CHEZ LES PRODUITS SE COMPTENT ICI AUSSI. La
      // boîte du pilot (B8, B9) ne voit que ce qui lui est arrivé : un lot écrit et jamais remis n'existait
      // pour personne. Comptes seulement, et le nom de chaque produit tel que le relevé l'affiche déjà.
      try {
        const { lotsARemettre, SEUIL_H } = await import(pathToFileURL(join(ICI, "lib-retours-produit.mjs")).href);
        const parProduit = [];
        for (const l of j.lignes || []) {
          if (!l.dossier || !existsSync(join(l.dossier, "forge", "retours"))) continue;
          const a = await lotsARemettre(l.dossier, PILOT);
          const jamais = a.filter((x) => x.parvenu === false);
          if (a.length) parProduit.push({ produit: l.produit, total: a.length, jamais: jamais.length, plusVieux: Math.max(0, ...jamais.map((x) => x.jours)) });
        }
        const total = parProduit.reduce((s, p) => s + p.total, 0), jamais = parProduit.reduce((s, p) => s + p.jamais, 0);
        lignes.push("", `## Lots restés « a_remettre » chez les produits, plus de ${SEUIL_H} h (TF-1758)`,
          !total ? "- aucun." : `- ${total} lot(s) chez ${parProduit.length} produit(s), dont **${jamais} jamais parvenu(s) au pilot** ; les autres sont reçus, leur ligne de statut n'a pas été mise à jour.`,
          ...parProduit.filter((p) => p.jamais).slice(0, 8).map((p) => `  - ${p.produit} : ${p.jamais} jamais parvenu(s), le plus ancien de ${p.plusVieux} j — nommé à sa prochaine ouverture`));
      } catch (e) { lignes.push(`- lots restés a_remettre chez les produits : NON comptés (${String(e.message).slice(0, 160)})`); }

      // TF-1521 (02/10/2026) — LE REJEU D'UN DÉPLACEMENT EN ATTENTE N'ÉTAIT CÂBLÉ NULLE PART. La
      // règle 7 bis (TF-1503) tolère qu'une version antérieure reste en place tant que le ledger du
      // produit porte un `deplacement_en_attente` non clos — mais rien ne RAPPELAIT cette attente
      // au tour suivant : une consignation oubliée garde deux versions côte à côte sans aucune
      // limite de durée (ce que le `non_juge` de l'oracle de conformité déclare déjà). Même algèbre
      // d'état que `oracle-conformite-projet.mjs` (R-7 bis) : le DERNIER événement du ledger pour un
      // chemin `ancien` donné fait foi, le ledger étant en ajout seul.
      const cheminNorme = (s) => String(s || "").replaceAll("\\", "/").replace(/^\.\//, "").toLowerCase();
      const attentesParProduit = [];
      for (const l of j.lignes || []) {
        const ledgerProduit = join(l.dossier, "forge", "ledger.jsonl");
        if (!existsSync(ledgerProduit)) continue;
        const deplacements = new Map();
        let brut = "";
        try { brut = readFileSync(ledgerProduit, "utf8"); } catch { continue; }
        for (const ligne of brut.split(/\r?\n/)) {
          if (!ligne.trim()) continue;
          let e; try { e = JSON.parse(ligne); } catch { continue; }
          const t = String(e.type || e.ev || "");
          if (t !== "deplacement_en_attente" && t !== "deplacement_effectue") continue;
          if (!cheminNorme(e.ancien)) continue;
          deplacements.set(cheminNorme(e.ancien), { attente: t === "deplacement_en_attente", ancien: e.ancien, nouveau: e.nouveau, ts: e.ts || null, motif: e.motif || null });
        }
        const enAttente = [...deplacements.values()].filter((d) => d.attente);
        if (enAttente.length) attentesParProduit.push({ produit: l.produit, dossier: l.dossier, enAttente });
      }
      if (attentesParProduit.length) {
        lignes.push("", "## Déplacements de version en attente (règle 7 bis, TF-1503) — à rejouer ce tour");
        for (const { produit, enAttente } of attentesParProduit) {
          for (const d of enAttente) {
            lignes.push(`  - ${produit} : \`${d.ancien}\`${d.ts ? ` (en attente depuis le ${d.ts})` : ""}` +
              `${d.motif ? ` — ${d.motif}` : ""} → rejouer : \`git mv "${d.ancien}" "${dirname(d.ancien)}/old/"\` chez le produit, ` +
              "puis consigner `deplacement_effectue` à son ledger (`forge/ledger.jsonl`)");
          }
        }
      }
    }
  }
}

// TF-0788 (décision D-3 (a), 03/09/2026) — UNE MONTÉE DE VERSION D'UN SKILL SE LIT CHEZ QUI LE
// CONSOMME. Le 02/09, une recette de forge-tests a changé de verdict entre deux exécutions sans
// qu'un octet bouge dans son dépôt : le socle installé sous ~/.claude/skills avait été monté de
// version pendant la session, et rien ne le disait côté consommateur. À chaque ouverture — pilot
// comme produit, puisque tous consomment les skills installés — l'empreinte de chaque skill est
// comparée à la dernière consignée sur ce poste, et l'écart est dit en une ligne. Jamais bloquant :
// une montée de version est un fait à lire avant de juger un verdict, pas une faute (R-29).
{
  const relever = join(PILOT, "scripts", "relever-empreintes-skills.mjs");
  lignes.push("", "## Skills installés (TF-0788 : l'empreinte des règles du socle, comparée à l'ouverture précédente)");
  if (!existsSync(relever)) lignes.push("- relevé des empreintes ABSENT du pilot — les montées de version ne sont pas vues");
  else {
    const r = spawnSync(process.execPath, [relever], { encoding: "utf8", cwd: PILOT, timeout: 90000 });
    const sortie = (r.stdout || "").trim();
    if (r.status !== 0 || !sortie) lignes.push(`- relevé NON rendu (exit ${r.status}) — ${(r.stderr || "").trim().slice(0, 200)}`);
    else lignes.push(...sortie.split(/\r?\n/));
  }
}

// TF-0908 (08/09/2026) — UN LOT DÉPOSÉ ET JAMAIS INGÉRÉ SE DIT À L'OUVERTURE, PAS AU HASARD.
//
// LE FAIT : le 07/09, six lots de retours d'un même produit ont été déposés dans `input\00-retours`
// et AUCUN ingéré — `grep -c` sur le registre actif et sur l'archive rendait 0 / 0. Cinq de ces
// lots portaient la même cause racine. Le producteur écrivait « remonté » dans ses synthèses ; le
// destinataire a mesuré la même chose autrement : « remonté plusieurs fois, toujours pas traité ».
//
// LA CAUSE, et elle est structurelle : la remise est un DÉPÔT DE FICHIER, l'ingestion est un
// GESTE DE SESSION. `oracle-boite-entree` sait le dire depuis le 14/08 — le noyau prescrit même
// de le jouer « à l'ouverture de tout run » — mais aucun mécanisme ne le lançait : il fallait y
// penser. C'est la classe de défaut que ce hook existe pour éteindre, prise une fois de plus.
//
// POURQUOI BLOQUANT ICI, alors que les autres sections de ce hook ne le sont pas : les autres
// DÉCLARENT un état qu'elles ne peuvent pas réparer (héritage d'un produit, câblage d'un poste,
// R-29). Celui-ci nomme un travail que LA SESSION QUI LIT peut prendre à l'instant, en une
// commande. Un constat qu'on relit chaque matin sans le traiter cesse d'être lu (motif que R-33 bis donne pour le verdict websec) : le
// seuil de 24 h sépare donc la file d'attente normale de l'oubli, et seul l'oubli passe en tête.
if (iPilot < 0) {
  const ob = join(PILOT, "oracles", "oracle-boite-entree.mjs");
  lignes.push("", "## Boîte d'entrée des retours (TF-0908)");
  if (!existsSync(ob)) lignes.push("- oracle-boite-entree ABSENT du pilot — un lot déposé et non ingéré ne serait vu par personne.");
  else {
    const r = spawnSync(process.execPath, [ob], { encoding: "utf8", cwd: PILOT, timeout: 90000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    const f8 = j && (j.findings || []).find((x) => x.regle === "B8");
    // TF-1214 (13/10/2026) : le verdict vaut pour CE poste. Un dépôt non suivi par git d'un autre poste
    // n'y est pas visible (quinze dépôts, jusqu'à 61 h d'attente le 14/09) ; la ligne le dit.
    if (j && j.poste) lignes.push(`- jugée sur le poste **${j.poste}** : un dépôt non encore enregistré sur un AUTRE poste n'y est pas visible.`);
    if (!j) lignes.push(`- verdict ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur la boîte : ${(r.stderr || "").trim().slice(0, 160)}`);
    else if (j.verdict === "SKIP") lignes.push(`- sans objet — ${j.motif || "répertoire absent"}`);
    else if (!f8) lignes.push("- l'oracle n'a pas rendu B8 — l'ancienneté des lots n'est pas mesurée sur cette ouverture.");
    else if (f8.statut === "PASS") {
      const restants = (j.findings || []).filter((x) => x.statut === "FAIL").length;
      lignes.push(restants
        ? `- ${restants} constat(s) ouvert(s), aucun de plus de 24 h — ${f8.message}`
        : `- boîte à jour — ${f8.message}`);
    } else {
      lignes.push(`- **BLOQUANT — ${f8.message}**`,
        "- À TRAITER AVANT TOUT AUTRE TRAVAIL de cette session : un lot remonté qui n'entre pas au registre",
        "  n'existe pour personne, et le producteur le croit pris. Détail : node oracles/oracle-boite-entree.mjs");
    }
    // B9 (TF-1198, 19/09/2026) — le sas d'arrivée se DIT à l'ouverture. Le 19/09, six lots y ont
    // attendu deux jours sous un « boîte à jour » : une règle que le relevé d'ouverture ne lit pas
    // est une règle que personne ne rencontre (loi n° 1).
    const f9 = j && (j.findings || []).find((x) => x.regle === "B9");
    if (f9 && f9.statut === "FAIL") lignes.push(`- **BLOQUANT — ${f9.message}**`);
    else if (f9 && f9.statut === "AVERTISSEMENT") lignes.push(`- ${f9.message}`);
  }
}

// D-6 (a), 14/09/2026 — UN CONSTAT QUE PERSONNE NE LIT N'EST PAS UN CONSTAT (classe
// constat-non-bloquant-jamais-lu). `oracle-secrets-hors-perimetre` est joué au hook Stop, qui
// n'affiche rien quand il ne bloque pas ; ses constats sur les produits sortent en 0 par
// construction et n'atteignaient aucun lecteur — mesuré le 14/09 : 11 porteurs hors dépôt et 3
// dans des dépôts qui ne les ignorent pas, dont des publiés, relus à chaque fin de tour depuis sa
// pose sans que personne les voie. L'ouverture les RELIT et les dit, en COMPTES seulement : jamais
// un chemin ni une valeur (porte des noms) ; le détail se lit à la demande. Même section : l'état
// du registre de dette du pilot (D-8 (a)), qui sinon ne serait lu par personne (loi n° 1).
// ---- LA PORTÉE DE CETTE SESSION SE DIT À L'OUVERTURE (TF-1047 / TF-0963, option O1, 17/09/2026)
//
// LE FAIT : un hameçon qui ne s'exécute pas ne se distingue pas d'un hameçon qui approuve. Une
// session ouverte au-dessus du produit, ou sur une racine qui n'a repris qu'une PARTIE des
// hameçons, travaille des heures sans qu'aucun contrôle ne parle — trois retours du même produit
// pour trois symptômes d'une seule racine. L'étude du 14/09 tranche O1 : comparer, à l'ouverture,
// le jeu ACTIF au jeu ATTENDU, et le NOMMER. Ni report d'hameçons, ni écriture chez le produit :
// ces deux-là restent un arbitrage humain (R-29, TF-0963).
{
  const op = join(PILOT, "oracles", "oracle-portee-doctrine.mjs");
  if (existsSync(op)) {
    lignes.push("", "## Portée des hameçons pour CETTE racine de session (O1, TF-1047)");
    const r = spawnSync(process.execPath, [op, "--hamecons"], { encoding: "utf8", timeout: 60000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    if (!j) lignes.push(`- verdict ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur la session : ${(r.stderr || "").trim().slice(0, 160)}`);
    else for (const f of j.findings || []) {
      if (f.statut === "PASS") lignes.push(`- ${f.regle} : ${f.message}`);
      else if (f.statut === "SANS_OBJET") lignes.push(`- ${f.regle} sans objet — ${f.message}`);
      else lignes.push(`- **${f.regle} — ${f.message}**`);
    }
  }
}

if (iPilot < 0) {
  const os = join(PILOT, "oracles", "oracle-secrets-hors-perimetre.mjs");
  if (existsSync(os)) {
    lignes.push("", "## Secrets hors périmètre (D-6 (a), classe constat-non-bloquant-jamais-lu)");
    const r = spawnSync(process.execPath, [os], { encoding: "utf8", cwd: PILOT, timeout: 90000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    if (!j) lignes.push(`- verdict ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur les secrets : ${(r.stderr || "").trim().slice(0, 160)}`);
    else if (j.verdict === "PASS") lignes.push("- aucun porteur de secret hors périmètre.");
    else {
      for (const f of (j.findings || []).filter((x) => x.statut === "FAIL")) {
        const n = (String(f.message).match(/^\s*(\d+)/) || [])[1] || "?";
        lignes.push(`- ${f.regle} : ${n} porteur(s) ${f.regle === "SP2" ? "DANS un dépôt qui ne les ignore pas — le plus grave : publiés ; seule une ROTATION de l'identifiant réduit le risque" : "hors de tout dépôt, ni ignorés ni suivis"}`);
      }
      lignes.push("- À TRAITER : rotation des identifiants publiés (geste humain, console de chaque fournisseur), puis rangement ; détail, chemins compris : node oracles/oracle-secrets-hors-perimetre.mjs");
    }
  }
  const rd = join(PILOT, "todo", "registre-dette.json");
  if (existsSync(rd)) {
    try {
      const d = JSON.parse(readFileSync(rd, "utf8"));
      const c = {};
      for (const e of d.entrees || []) c[e.statut] = (c[e.statut] || 0) + 1;
      lignes.push("", "## Registre de dette du pilot (D-8 (a), 14/09/2026)",
        `- ${c.assume || 0} limite(s) assumée(s), ${c.todo || 0} reste(s) à instruire — todo\\registre-dette.json`);
    } catch (e) { lignes.push("", "## Registre de dette du pilot", `- ILLISIBLE : ${e.message}`); }
  }
}

// TF-1285 / TF-1282 (22/09/2026) — LES DEUX CONSTATS NÉS DES LOTS DU 21-22/09 SE LISENT ICI, et
// nulle part ailleurs. Le premier juge le POSTE : un point d'entrée installé par le geste qu'il est
// censé déclencher n'existe pas (loi n° 1). Le second juge les PRESCRIPTIONS du dépôt : une commande
// mise devant un producteur résout, ses options existent, et la recette les a jouées.
//
// POURQUOI ICI et pas à un hameçon bloquant : les deux rendent des CONSTATS que le pilot ne peut
// pas toujours réparer seul — installer un hook au poste et propager un skill d'accueil sont des
// gestes de `bootstrap.mjs`, décidés par l'humain (R-29). Un contrôle câblé à un hameçon qui
// n'affiche qu'en cas de blocage rend un échec que personne ne lit : c'est exactement la classe
// `constat-non-bloquant-jamais-lu`, mesurée le 14/09, et la raison pour laquelle la section
// « Secrets hors périmètre » ci-dessus vit ici plutôt qu'au hook Stop.
//
// L'amorçage se dit MÊME hors du pilot : le poste est le poste, quelle que soit la racine ouverte.
{
  const oa = join(PILOT, "oracles", "oracle-amorcage-poste.mjs");
  if (existsSync(oa)) {
    lignes.push("", "## Amorçage au poste (TF-1285, classe amorcage-factory-sans-declencheur-au-poste)");
    const r = spawnSync(process.execPath, [oa, "--json"], { encoding: "utf8", timeout: 60000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    if (!j) lignes.push(`- verdict ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur le poste : ${(r.stderr || "").trim().slice(0, 160)}`);
    else if (j.verdict === "SANS_OBJET") lignes.push(`- sans objet — ${(j.findings || [])[0]?.message?.slice(0, 200) || "aucun poste à juger"}`);
    else if (j.verdict === "PASS") lignes.push("- le poste porte l'entrée du dispositif : skill d'accueil propagé et hook UserPromptSubmit de portée poste.");
    else {
      for (const f of (j.findings || []).filter((x) => x.statut === "FAIL")) lignes.push(`- **${f.regle} — ${String(f.message).split(". Remède")[0].slice(0, 320)}**`);
      lignes.push("- À DÉCIDER (geste humain, R-29) : faire propager par `bootstrap.mjs` un skill d'accueil et installer le hook `UserPromptSubmit` au poste en fusion non destructive ; détail : node oracles/oracle-amorcage-poste.mjs");
    }
  }
}

if (iPilot < 0) {
  const oc = join(PILOT, "oracles", "oracle-chemin-prescrit.mjs");
  if (existsSync(oc)) {
    lignes.push("", "## Chemins d'usage prescrits par les documents (TF-1282)");
    const r = spawnSync(process.execPath, [oc, PILOT, "--json"], { encoding: "utf8", cwd: PILOT, timeout: 90000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    if (!j) lignes.push(`- verdict ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur les prescriptions : ${(r.stderr || "").trim().slice(0, 160)}`);
    else if (j.verdict === "PASS") lignes.push(`- ${j.jugeables ?? "?"} prescription(s) jugée(s) : toutes résolvent, leurs options existent et la recette les joue.`);
    else if (j.verdict === "SANS_OBJET") lignes.push("- sans objet — aucun document ne prescrit de commande.");
    else for (const f of (j.findings || []).filter((x) => x.statut === "FAIL")) lignes.push(`- **${f.regle} — ${String(f.message).slice(0, 320)}**`);
  }
}

// 01/10/2026 (demande humaine : « validation accélérée, plus fréquente, toutes les semaines ») — LA
// REVUE HEBDOMADAIRE DES PROPOSITIONS EST RAPPELÉE PAR L'OUVERTURE. Même raison que la cadence des
// récidives ci-dessous : sans invocateur, une cadence écrite reste une intention. L'ouverture compte
// les candidatures munies d'une fiche de décision complète et, quand la dernière revue a 7 jours ou
// plus, dit la commande qui rend le dossier. Elle ne l'écrit pas : le rendu est un geste du tour.
if (iPilot < 0) {
  try {
    const { etatCourant, manques } = await import(pathToFileURL(join(PILOT, "todo", "revue-hebdo.mjs")).href);
    const etat = [...etatCourant(readFileSync(join(PILOT, "todo", "TODO.jsonl"), "utf8")).values()].filter((e) => e.statut === "candidat");
    const pretes = etat.filter((e) => !manques(e.fiche_decision).length).length;
    const aInstruire = etat.filter((e) => e.fiche_decision && manques(e.fiche_decision).length).length;
    let derniere = null;
    try { const l = readFileSync(join(PILOT, "todo", "observabilite", "revues-hebdo.jsonl"), "utf8").trim().split("\n").filter(Boolean); derniere = l.length ? JSON.parse(l[l.length - 1]).ts : null; } catch { derniere = null; }
    const age = derniere ? (Date.now() - Date.parse(derniere)) / 86400000 : Infinity;
    lignes.push("", "## Revue hebdomadaire des propositions (references/TODO-FORGE.md, « Revue hebdomadaire accélérée »)");
    if (age < 7) lignes.push(`- dernière revue le ${derniere} (${age.toFixed(1)} j) — prochaine dans ${(7 - age).toFixed(1)} j ; ${pretes} proposition(s) prête(s), ${aInstruire} à instruire`);
    else if (!pretes) lignes.push(`- revue due, mais aucune proposition n'a de fiche de décision complète (${aInstruire} à instruire) : rien à trancher`);
    else lignes.push(`- **revue DUE** (${derniere ? `dernière le ${derniere}` : "jamais jouée"}) : ${pretes} proposition(s) prête(s), ${aInstruire} à instruire — rendre le dossier par node todo/revue-hebdo.mjs --depuis <prochain D-N> --sortie <dossier>, puis en reprendre les décisions au bloc 3 de la restitution`);
  } catch (e) { lignes.push("", `- revue hebdomadaire des propositions : NON mesurée (${String(e.message).slice(0, 160)})`); }
}

// TF-1831 (16/10/2026) — UN PLAN DE REVUE DATÉ SE RAPPELLE À SA DATE. Toute étude porte un plan de
// revue daté (E7) et rien ne le rappelait. Un item qui porte `revue_le` est publié ici dès sa date,
// avec sa commande de mesure ; jouer la mesure et consigner `revue_jouee_le` reste un geste du tour.
if (iPilot < 0) {
  try {
    const { revuesDues, revuesAVenir } = await import(pathToFileURL(join(PILOT, "todo", "revues-datees.mjs")).href);
    const { etatCourant } = await import(pathToFileURL(join(PILOT, "todo", "revue-hebdo.mjs")).href);
    const etat = etatCourant(readFileSync(join(PILOT, "todo", "TODO.jsonl"), "utf8"));
    const jour = new Date().toISOString().slice(0, 10);
    const dues = revuesDues(etat, jour), avenir = revuesAVenir(etat, jour);
    lignes.push("", "## Revues datées (TF-1831, todo/revues-datees.mjs)");
    if (!dues.length) lignes.push(`- aucune revue due${avenir.length ? ` ; prochaine : ${avenir[0].id} le ${avenir[0].revue_le}` : ""}`);
    else for (const d of dues) lignes.push(`- **revue DUE depuis le ${d.revue_le} : ${d.id}** — ${d.titre.slice(0, 140)}${d.commande ? ` ; mesure : \`${d.commande}\`` : ""} ; puis consigner \`revue_jouee_le\` au registre`);
  } catch (e) { lignes.push("", `- revues datées : NON mesurées (${String(e.message).slice(0, 160)})`); }
}

// TF-1301 (13/10/2026) — LE STOCK D'ITEMS OUVERTS SANS CLASSE SE PUBLIE À CHAQUE OUVERTURE. La porte posée
// sur l'écriture du registre refuse les créations sans classe ; elle ne garde pas le stock qui la précède, et ce
// stock devenait invisible au compteur qu'elle existe pour rendre lisible. Le compte est une mesure, jamais un
// blocage : classer un item à la place de son producteur est exactement ce que l'ingesteur refuse.
if (iPilot < 0) {
  try {
    const { stockSansClasse, ligneStock } = await import(pathToFileURL(join(PILOT, "todo", "stock-sans-classe.mjs")).href);
    const { etatCourant } = await import(pathToFileURL(join(PILOT, "todo", "revue-hebdo.mjs")).href);
    const stock = stockSansClasse(etatCourant(readFileSync(join(PILOT, "todo", "TODO.jsonl"), "utf8")));
    lignes.push("", "## Items ouverts sans classe (TF-1301, todo/stock-sans-classe.mjs)", `- ${ligneStock(stock)}`);
  } catch (e) { lignes.push("", `- stock d'items sans classe : NON mesuré (${String(e.message).slice(0, 160)})`); }
}

// TF-0790 (décision D-2 (a), 03/09/2026) — LA CADENCE D'UN PLAN DE SURVEILLANCE EST TENUE PAR QUI
// L'INVOQUE. forge-observability le dit elle-même : « la cadence est documentaire en v0 ». Sans
// invocateur, le plan des récidives serait une intention de plus (N-1). L'ouverture du pilot joue
// donc `todo/observer-recidives.mjs` quand le dernier snapshot a plus de sept jours, ou n'existe
// pas — et rend le verdict de dérive en une ligne, sans jamais bloquer : le FAIL est le signal.
// D-64 (a) du 21/10/2026 (proposition « Oeil critique - 20261021a », §j.6 et §j.8) — LES SECTIONS
// « SURVEILLANCE DES RÉCIDIVES » ET « FLOTTE D'AGENTS » SONT REMPLACÉES PAR LA SECTION « ŒIL CRITIQUE »,
// qui affiche la sortie du skill oeil-critique. N'en restent que leurs ALARMES, une ligne chacune :
// la cadence hebdomadaire des récidives (TF-0790, D-2 (a)) tourne toujours et ne parle que pour une
// dérive ou un passage illisible ; les sources muettes (TF-1166) passent à la mission 4 du skill.
const alarmesOeil = [];
if (iPilot < 0) {
  const plan = join(PILOT, "todo", "observabilite", "plan-recidives.json");
  const ledger = join(PILOT, "todo", "observabilite", "snapshots-recidives.jsonl");
  if (existsSync(plan)) {
    let dernier = null;
    try { const l = readFileSync(ledger, "utf8").trim().split("\n").filter(Boolean); dernier = l.length ? JSON.parse(l[l.length - 1]).ts : null; } catch { dernier = null; }
    const age = dernier ? (Date.now() - Date.parse(dernier)) / 86400000 : Infinity;
    if (age >= 7) {
      const r = spawnSync(process.execPath, [join(PILOT, "todo", "observer-recidives.mjs")], { encoding: "utf8", cwd: PILOT, timeout: 180000 });
      let j = null; try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
      if (!j) alarmesOeil.push(`- récidives : passage hebdomadaire NON rendu (exit ${r.status}) — ${(r.stderr || r.stdout || "").trim().slice(0, 200)}`);
      else if (!["PASS", "donnees_insuffisantes"].includes(j.verdict)) alarmesOeil.push(`- récidives : DÉRIVE (${j.verdict}) : ${(j.derive?.findings || [j.message]).slice(0, 4).join(" ; ")} — lire todo/RECIDIVES.md, décider en revue des classes`);
    }
  }
}

// D-1 (a) du 25/09/2026 (synthèse 20260924b) — UNE NOUVELLE VERSION DE MODÈLE SE VOIT À
// L'OUVERTURE, pas au changement de famille. Le §4 de CONTRAT-INTERFACE.md ne se révisait qu'au
// changement de famille : Fable 5.1 (dès le 02/09) et Opus 5.5 (depuis le 23/09) ont été servies
// sans que rien ne le dise. L'oracle lit les versions réellement servies dans les transcripts du
// poste et les situe par rapport au référentiel daté `references\MODELES-EN-SERVICE.json` : une
// version plus récente que la génération courante déclenche le re-test de la règle de challenge.
// Il ne bloque jamais l'ouverture : son FAIL est le signal, comme la surveillance des récidives.
if (iPilot < 0) {
  const om = join(ICI, "oracle-modeles-en-service.mjs");
  if (existsSync(om)) {
    lignes.push("", "## Modèles en service (D-1 (a) du 25/09/2026, référentiel references\\MODELES-EN-SERVICE.json)");
    const r = spawnSync(process.execPath, [om, "--json"], { encoding: "utf8", cwd: PILOT, timeout: 60000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    if (!j) lignes.push(`- verdict ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur les modèles : ${(r.stderr || "").trim().slice(0, 160)}`);
    else {
      lignes.push(`- ${j.resume}`);
      for (const f of (j.findings || []).filter((x) => x.statut === "FAIL")) lignes.push(`- **DÉCLENCHEUR ${f.regle} — ${String(f.message).slice(0, 320)}**`);
      for (const f of (j.findings || []).filter((x) => x.statut === "AVERT")) lignes.push(`- ${f.regle} — ${String(f.message).slice(0, 320)}`);
    }
  }
}

// D-19 (a) du 18/10/2026 (étude 20261018a) — LA FLOTTE D'AGENTS SE VOIT À L'OUVERTURE. Le 18/10, 191 sous-agents
// génériques sur 201 en 30 jours, aucun appel avec l'effort de sa classe, et aucune consignation au ledger depuis le
// 25/09 : le tableau de routage ne recevait plus de mesure. Le relevé lit les transcriptions des 14 derniers jours
// et dit les 3 critères de la revue du 2026-11-01. Il ne bloque jamais l'ouverture.
// De l'ancienne section « Flotte d'agents » ne reste que l'alarme de l'essai de relecture d'intention
// (D-23 (a) et D-25 du 18/10/2026) : son coût et son seuil d'arrêt se disent tant que l'essai court.
// Les indicateurs de la flotte passent à la mission 5 du skill oeil-critique.
if (iPilot < 0) {
  const rf = join(PILOT, "scripts", "relever-flotte.mjs");
  if (existsSync(rf)) {
    const r = spawnSync(process.execPath, [rf, "--jours", "14", "--json"], { encoding: "utf8", cwd: PILOT, timeout: 60000 });
    let j = null;
    try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* dit ci-dessous */ }
    if (!j) alarmesOeil.push(`- relevé de la flotte ILLISIBLE (exit ${r.status}) — ce n'est pas un constat sur la flotte : ${(r.stderr || "").trim().slice(0, 160)}`);
    else {
      const E = j.indicateurs.essai_relecture_intention;
      if (E) {
        const sp = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        alarmesOeil.push(`- relectures d'intention (essai du ${E.debut} au ${E.fin}, ${E.prolongation}, revue le ${E.revue}, \`references\\RELECTURE-INTENTION.md\`) : ${E.relectures} relecture(s), ${sp(E.jetons)} jetons`
          + `${E.jour_max ? ` ; jour le plus chargé ${E.jour_max.jour} : ${sp(E.jour_max.jetons)} jetons` : ""} — seuil de ${sp(E.seuil_jetons_par_jour)} jetons par jour `
          + (E.seuil_franchi ? "**FRANCHI : arrêter l'essai et demander à l'humain**" : "tenu"));
      }
    }
  }
}

// La section « Œil critique » : le repère de chaque poste, la sortie de la dernière exécution du
// poste courant (10 lignes au plus, écrite par le skill), puis les alarmes ci-dessus.
if (iPilot < 0) {
  lignes.push("", "## Œil critique (D-64 (a) du 21/10/2026, skill oeil-critique)");
  const reperes = [];
  try {
    for (const n of readdirSync(join(PILOT, "todo")).filter((x) => /^oeil-critique-.+\.json$/.test(x))) {
      try { reperes.push(JSON.parse(readFileSync(join(PILOT, "todo", n), "utf8"))); } catch { lignes.push(`- repère illisible : todo/${n}`); }
    }
  } catch { /* dossier todo illisible : dit par l'absence de repère */ }
  const ici = hostname();
  if (!reperes.some((r) => r.poste === ici)) lignes.push(`- poste ${ici} : aucune exécution — lancer « œil critique » ; la première analyse part du 20/10/2026`);
  for (const r of reperes.sort((a, b) => String(a.poste).localeCompare(String(b.poste)))) {
    const age = (Date.now() - Date.parse(r.fin)) / 86400000;
    lignes.push(`- poste ${r.poste} : dernière analyse jusqu'au ${r.fin} (${age.toFixed(1)} j)${r.poste === ici ? "" : " — autre poste, sa sortie se lit sur lui"}`);
    if (r.poste === ici) for (const l of (r.sortie || []).slice(0, 10)) lignes.push(`  - ${l.replace(/^[-*]\s*/, "")}`);
  }
  lignes.push(...alarmesOeil);
}

// TF-1576 (13/10/2026) — L'ANNONCE DIT L'ÉTAT MESURÉ DES CROCHETS, PAS CELUI QU'ON SUPPOSE. Un produit
// dont `.claude/settings.json` ne déclare aucun PostToolUse n'a aucune régénération des README après
// écriture : l'annonce l'affirmait pourtant, et la restitution l'a recopiée avant mesure (index périmé
// du 22 au 26/09 chez un produit). Le crochet se lit dans les réglages du projet ouvert.
// TF-1652 et TF-1667 (14/10/2026) — LE CROCHET SE RECONNAÎT À SA COMMANDE, ET LA CONSIGNE NOMME LA
// COMMANDE VALABLE LÀ OÙ ELLE EST LUE. Un produit déclare des PostToolUse (page-html, écriture, droits)
// sans aucun qui régénère les README : l'annonce affirmait le contraire. Et `node scripts\readme-dossiers.mjs`
// n'existe pas chez un produit (MODULE_NOT_FOUND) ; la session a alors joué le script du pilot sur tout le
// produit, 41 README rédigés à la main écrasés le 13/10. Chez un produit, la commande porte le chemin du
// pilot, `--base .` et `--racines` borné au dossier écrit.
function ligneCrochetReadme() {
  let declare = null;
  try {
    const j = JSON.parse(readFileSync(join(process.cwd(), ".claude", "settings.json"), "utf8"));
    declare = (((j.hooks || {}).PostToolUse) || []).flatMap((g) => g.hooks || []).some((h) => /readme-dossiers/.test(String(h.command || "")));
  } catch { /* réglages absents ou illisibles : dit ci-dessous */ }
  const commande = iPilot >= 0
    ? `\`node "${enSlash(join(PILOT, "scripts", "readme-dossiers.mjs"))}" --base . --racines <dossier écrit, ex. output/03-Syntheses>\` depuis la racine du produit, jamais sur tout le produit ; un README rédigé à la main (sans la marque « Généré par ») est préservé, un dossier gelé se déclare par \`.no-index\` ou dans le CLAUDE.md`
    : "`node scripts/readme-dossiers.mjs`";
  if (declare === true)
    return `- Les README d'input\\ et output\\ se régénèrent après chaque écriture par un outil (hook PostToolUse) ; une écriture par commande (script, mv, redirection) n'en déclenche aucune : rejouer ${commande} avant l'enregistrement. Un rôle non rédigé est un défaut.`;
  return "- ATTENTION, état MESURÉ : `.claude/settings.json` de ce projet " + (declare === false ? "ne déclare aucun crochet PostToolUse qui régénère les README" : "est absent ou illisible") + `. Les README d'input\\ et output\\ NE se régénèrent PAS après une écriture : les rejouer à la main (${commande}) avant l'enregistrement. Un rôle non rédigé est un défaut.`;
}

// TF-1636 (invariant 3, 14/10/2026) — LES RÈGLES QUI CONDITIONNENT LE PREMIER GESTE PASSENT EN TÊTE.
// Elles fermaient le relevé, après dix sections de taille variable : quand le harnais coupe une sortie
// trop longue, c'est la fin qui se perd, et le 13/10 c'était elles.
const GATES = lignesGates().slice(1);
lignes.unshift(...GATES, "");
function lignesGates() { return ["",
  "## Gates actifs dans cette session (R-44)",
  "- Tout message de fin de traitement — tour de TRAVAIL, verdict rendu, ou message de plus de 150 mots — suit gabarits\\RESTITUTION.md — bloc 0 + 8 blocs, aucun omis. v2.47.0 (18/10) : UNE AFFIRMATION D'EXHAUSTIVITÉ PORTE SA LIGNE « Mesuré sur » (TF-1866, RT-126, D-29 (a)) — « tout … est à jour », « entièrement », « rien oublié », « complet », « exhaustif », ou un « oui » à une question de complétude s'accompagne de « Mesuré sur : <source de vérité>, relue à HH:MM, périmètre <n éléments> » (jamais « Mesuré contre ») ; une liste de contrôle écrite par l'auteur n'est pas une source de vérité (S82 et contrôle COMPLÉTUDE du hook de fin de tour, bloquants). UNE D-N NOUVELLE SE RÉSERVE AUSSI AU PILOT, AVANT D'ÊTRE AFFICHÉE (TF-1872, D-32 (a)) — `node scripts/reserver-decision.mjs --question \"<la question ?>\"` rend le prochain numéro libre et l'inscrit à decisions/REGISTRE.jsonl (chez un produit : au ledger du produit) ; une D-N nouvelle absente du registre ou déjà prise pour une autre question est refusée (contrôle RÉSERVATION, avertissant au pilot jusqu'au 25/10/2026 puis bloquant). v2.46.0 (18/10) : LA BOUCLE DE CORRECTION DE LA RELECTURE D'INTENTION (D-26 (a)) — une alerte dont l'écart sort de la demande est corrigée puis relue, 2 passes au plus ; la ligne du bloc 4 peut dire « sert après N passe(s) » (N = 1 ou 2) et ne devient pas une décision ; seul un écart qui demeure ou relève d'un choix de l'humain reste « dérive » et se pose au bloc 3 (S79, `node scripts/relecture-intention.mjs --boucle <identifiant>`, `references/RELECTURE-INTENTION.md`). v2.45.0 (18/10) : UNE D-N NOUVELLE S'INSCRIT AU REGISTRE DU PRODUIT AVANT D'ÊTRE AFFICHÉE (TF-1849, D-25 (a)) — chez un produit, chaque tête « > **D-N — … ?** » du bloc 3 dont le numéro est nouveau (ni l'humain ni le message précédent ne la citent) figure dans une entrée `question_humain` du `forge/ledger.jsonl` (`python forge/ledger.py question_humain --decision D-N --question \"<la question>\"`) ; un rappel d'une ligne (S4) n'est pas une D-N nouvelle ; contrôle RÉSERVATION du hook de fin de tour et de `--prejuger`, AVERTISSANT jusqu'au 01/11/2026 puis BLOQUANT, sans objet au pilot (aucun registre des D-N). v2.44.0 (18/10) : UNE DEMANDE DE DÉTAIL L'EMPORTE SUR LE RAPPEL D'UNE LIGNE (S4) — « 51 détaille » reçoit la décision EN ENTIER, texte exact, options et recommandation, ou des décisions détaillées qui la citent, jamais une ligne de rappel (contrôle DÉTAIL du hook de fin de tour, bloquant, TF-1851). v2.43.0 (18/10) : UNE ÉNUMÉRATION EST UNE LISTE — « 1) … 2) … 3) » ne s'écrit jamais sur une même ligne, dans un paragraphe, une puce ou une cellule de tableau (S80, bloquante, E-11, TF-1847) ; un « Comment faire » est une liste numérotée sous le tableau des options, et un guide s'écrit en sous-puces, une par geste, « Résultat attendu » en dernière sous-puce (S81). v2.42.0 (18/10) : LE BLOC 4 DIT LA RELECTURE D'INTENTION DU TOUR — une ligne « Relecture d'intention : <sert | dérive | sans objet, motif> » ; un `verificateur` compare le travail à la demande citée mot pour mot (`node scripts/relecture-intention.mjs --preparer fin-de-tour`, `references\\RELECTURE-INTENTION.md`), et une dérive majeure devient une décision du bloc 3 : alerte, jamais blocage (S79, essai D-23 (a) du 18/10 au 01/11/2026). v2.41.0 (17/10) : UNE DÉCISION SE COMPREND ET SE TRANCHE SANS RIEN D'AUTRE — format B : « De quoi s'agit-il » (l'objet nommé, une valeur sensible masquée), « Le problème », « Pourquoi vous », la recommandation sourcée, puis « | Option | Ce qui se passe | Coût | Retour arrière | » aux options (a), (b), (c) et « Sans réponse » (S78, décision humaine du 17/10). v2.40.0 (15/10) : CHEZ UN PRODUIT QUI DÉCLARE UN CANAL DE REPRISE, UN TRANSPORT ENTRE POSTES NE SE LAISSE PAS À L'HUMAIN (S77, R-64). v2.39.0 (15/10) : UNE LIVRAISON À INTERFACE DIT SES PARCOURS JOUÉS DANS UN VRAI NAVIGATEUR sur l'adresse publique, ou les avoue non joués (S75) ; UN CHIFFRE RAPPORTÉ PAR UN AGENT SE RECOMPTE À LA SOURCE (S76). v2.38.0 (15/10) : UNE LIVRAISON SE DÉCLARE DU CÔTÉ DE L'UTILISATEUR — adresse cliquable du service et geste d'accès au bloc 0 ou au verdict (S70), ce qu'un utilisateur peut faire à l'instant et ce qui manque (S71), « N exigences sur M tenues » avant « livré » (S72, R-61) ; une part traitée porte sa justesse (S73), un gain sur échantillon ses effets dans la population et sur l'existant (S74, R-63). v2.37.0 (14/10) : PRÉJUGER AVANT D'AFFICHER — `node oracles/hook-restitution.mjs --prejuger <brouillon.md>` rend le verdict du hook sur le brouillon, exit 0 = affichable ; S48 est bloquante chez un produit ; l'heure du bloc 1 se relève par `date` (S69). v2.33.0 (01/10) : LE BLOC 3 NE PORTE QUE LES DÉCISIONS QUI REVIENNENT À L'HUMAIN — les autres s'exécutent dans le tour et se rendent pour information (R-58, décision humaine du 01/10). v2.32.0 (01/10) : UN PARAGRAPHE DE PROSE S'ÉCRIT SUR UNE SEULE LIGNE SOURCE — un paragraphe coupé à la main s'affiche en colonne étroite dans le chat de l'extension VS Code (S54, TF-1494). v2.31.0 (28/09) : UNE DÉCISION DÉJÀ POSÉE ET INCHANGÉE SE RAPPELLE EN UNE LIGNE, ELLE NE SE REPOSE PLUS — sélecteur, sujet, heure de pose, « inchangée » (S4, TF-1429). v2.30.0 (28/09) : LES IDENTIFIANTS DU REGISTRE PRODUIT ET DU LOT DE RETOURS SONT RECONNUS, ET « NEUVE » SE DÉCLARE — « registre A-18 », « RT-2 » (S14, S39, TF-1428, TF-1449). v2.29.0 (28/09) : UNE BARRE VERTICALE DANS UNE CELLULE DE TABLEAU S'ÉCHAPPE, ET LE JUGE NOMME LA COUPURE AU LIEU D'ACCUSER LA COLONNE VOISINE (S18, TF-1427). v2.28.0 (27/09) : UNE ACTION SUR L'ÉCRAN D'UNE PLATEFORME TIERCE CITE SA SOURCE OFFICIELLE ET LA DATE OÙ ELLE A ÉTÉ LUE (S52), ET, LAISSÉE À manuelle_utilisateur, ELLE SE GUIDE EN TÊTE — une section « ## Guide — … » avant le bloc 0 alors titré, des étapes numérotées closes par « Résultat attendu : … » (S53, bloquante quand le dernier message humain demande la procédure ; TF-1362, TF-1361). v2.27.0 (19/09) : UN REFUS PROUVE QU'UNE PORTE EST FERMÉE, JAMAIS QU'IL N'Y EN A QU'UNE — une incapacité d'accès déclarée porte les codes de retour de DEUX FAMILLES de chemins au moins (un préfixe d'URL ou un scope distinct, pas une variante du même), ou cite la source qui établit qu'un seul chemin existe ; « seule voie » ne vaut plus preuve (S25 durcie, TF-1189). v2.26.0 (17/09) : LE BLOC 1 DIT L'INTENTION DE LA DEMANDE — une phrase pour l'intention initiale, puis « Test rétro : » qui dit si le résultat la sert ou n'en sert que la lettre (S51, loi transverse n° 7). v2.25.0 (17/09) : UN TOUR DE TRAVAIL DONT LE RÉSULTAT N'EST PAS ENCORE MESURABLE SE DÉCLARE « POINT D'ÉTAPE » AU BLOC 1 — bloc 2 remplacé par « ce qui reste à mesurer, et par quoi » (la mesure attendue ET l'outil qui la rendra), blocs 1, 4 et 8 PLEINS (S50), les autres admis en une ligne ; et un RELAIS d'avancement de trois lignes, quand rien n'a été écrit depuis ton dernier affichage, ne se rejuge pas et ne reprend pas la synthèse déposée en entier (TF-1182). v2.24.0 (17/09) : UNE OPTION DU BLOC 3 QUI COMMANDE UN GESTE HUMAIN (se connecter, saisir, coller, installer, ouvrir un terminal, lancer une commande, valider un second facteur, publier soi-même) porte SUR PLACE de quoi l'exécuter — la commande entre accents graves, l'écran à ouvrir, ou « Comment faire (b) : » suivi d'une liste numérotée sous le tableau des options (S49, forme en liste depuis la v2.43.0). v2.23.0 (17/09) : CHEZ UN PRODUIT, le bloc 9 porte une ligne « Remontée à la factory : rien à remonter. » ou « Remontée à la factory : lot « <produit> - RETOURS - AAAAMMJJ<indice> » remis. » — « rien à remonter » est une réponse valide, le silence ne l'est pas (S48 ; sans objet au pilot et dans une forge). Bloc 3 : une décision par BLOC DE CITATION, ouverte par son sélecteur `D-N` et une QUESTION, rappel du sujet puis recommandation SOURCÉE, options en tableau hors citation (`Option | Ce qui se passe | Coût | Retour arrière` depuis la v2.41.0), ligne de repli pour finir. Bloc 8 : UN TABLEAU unique, l'acteur en COLONNE (auto_ia/manuelle_dev/manuelle_utilisateur), trié auto_ia d'abord, chaque action ouverte par son sélecteur `A-N` — les deux familles ne partagent JAMAIS la même numérotation. Effort en complexité × durée, jamais en jours. v2.18.0 (08/09) : le VERDICT que tu affiches mesure ce que le fichier jugé mesure — un tour qui n'apporte qu'un delta REDÉPOSE la synthèse à jour et affiche celle-là, il ne retouche pas l'écran seul ; un tour qui n'apporte rien de neuf rend un accusé bref, pas une restitution de plus. v2.17.0 (08/09) : ce que tu AFFICHES est le fichier jugé, jamais son résumé — les blocs 3 et 8 s'y reprennent en entier (tableau des options, sélecteurs A-N, acteurs du vocabulaire gelé) ; et un message final PORTANT UN VERDICT ou dépassant 150 mots est jugé même sans aucune écriture dans le tour. v2.16.0 (02/09) : aucune action manuelle_utilisateur ne demande à l'humain de CRÉER, AJOUTER ou ÉCRIRE une ligne, une variable ou un fichier (geste d'agent) ; une preuve du bloc 4 est une sortie exécutée, jamais « préparé » ni « voir A-N » ; toute page HTML citée comme livrée porte le verdict de la critique d'implémentation ; une correction restituée nomme son contrôle rouge → vert ou sa classe ; le fichier de synthèse se nomme Synthese ou Restitution — le marqueur `destinataire: humain` est réservé aux restitutions. Le hook Stop le juge par oracle-synthese et REFUSE l'arrêt en cas d'échec.",
  ligneCrochetReadme(),
  "- Quand la factory est impliquée, ses règles priment sur celles du projet (R-43).",
  ...lignesPreferences()]; }

// T1 de l'œil critique (TF-1946, D-68 (a) du 26/10/2026) — les préférences du porteur et les conventions
// du client se chargent PARTOUT, en tête du relevé, au lieu de devenir une règle du pilot de plus.
// Le diagnostic 20261021a mesurait 35 corrections répétées par mois, surtout de goût ou de client.
// Plafond de 2 Ko chacune (règle anti-inflation, §f du diagnostic 20261026a) : au-delà, le fichier est
// coupé et la coupure se dit. Le fichier client se cherche dans le dossier `_<client>` qui contient la
// session, à sa racine ou un niveau sous elle (son projet commun) ; absent, sa création se propose.
function corpsPlafonne(chemin) {
  const PLAFOND_PREFERENCES = 2048; // dans la fonction : elle sert avant la fin du module (GATES)
  const brut = readFileSync(chemin, "utf8").replace(/^#[^\n]*\n+/, "").trim();
  if (Buffer.byteLength(brut, "utf8") <= PLAFOND_PREFERENCES) return brut.split(/\r?\n/);
  return [...Buffer.from(brut, "utf8").subarray(0, PLAFOND_PREFERENCES).toString("utf8").split(/\r?\n/).slice(0, -1),
    `- (fichier coupé au plafond de ${PLAFOND_PREFERENCES} octets : le ramener sous le plafond)`];
}
export function dossierClient(cwd, racine) {
  const rel = cwd.slice(racine.length).split(/[\\/]/).filter(Boolean);
  return cwd.toLowerCase().startsWith(racine.toLowerCase()) && rel.length > 1 && rel[0].startsWith("_") ? join(racine, rel[0]) : null;
}
function lignesPreferences() {
  const out = [];
  const pref = join(PILOT, "references", "PREFERENCES-PORTEUR.md");
  if (existsSync(pref)) {
    try { out.push("", "## Préférences du porteur (T1, TF-1946 — references\\PREFERENCES-PORTEUR.md)", ...corpsPlafonne(pref)); } catch { /* illisible : rien d'injecté */ }
  }
  const client = dossierClient(process.cwd(), dirname(PILOT));
  if (!client) return out;
  let fichier = existsSync(join(client, "CONVENTIONS-CLIENT.md")) ? join(client, "CONVENTIONS-CLIENT.md") : null;
  if (!fichier) {
    try {
      for (const d of readdirSync(client, { withFileTypes: true })) {
        if (d.isDirectory() && existsSync(join(client, d.name, "CONVENTIONS-CLIENT.md"))) { fichier = join(client, d.name, "CONVENTIONS-CLIENT.md"); break; }
      }
    } catch { /* dossier client illisible */ }
  }
  if (fichier) {
    try { out.push("", `## Conventions du client (T1, TF-1946 — ${enSlash(fichier)})`, ...corpsPlafonne(fichier)); } catch { /* illisible */ }
  } else out.push("", "## Conventions du client (T1, TF-1946)", `- aucun CONVENTIONS-CLIENT.md sous ${enSlash(client)} ni un niveau dessous : une convention de ce client rappelée par l'humain s'y écrit, dans son projet commun, en une ligne datée (2 Ko au plus)`);
  return out;
}

// SORTIE EN JSON POUR LE MODE ASYNCHRONE (13/10/2026). L'extension VS Code abandonne une session
// dont l'initialisation dépasse 60 s, et le CLI n'annonce sa disponibilité qu'APRÈS la fin de tous
// les hooks SessionStart synchrones : ce hook, avec son `bootstrap --pull` réseau, a fait échouer
// l'ouverture le 12/10 (aucun « finished » au journal, coupure à 60 s, erreur « check authentication
// and network connectivity » sans rapport avec l'authentification). Il tourne donc en `async`.
// MESURÉ AVANT DE CHOISIR LE FORMAT (CLI 2.1.296) : en `async`, une sortie en TEXTE BRUT n'entre
// JAMAIS dans le contexte de l'assistant, même finie avant le premier message ; la forme JSON
// `hookSpecificOutput.additionalContext` y entre — au premier tour si le hook a fini avant, au tour
// suivant sinon. Le texte brut reste le défaut : la recette et les lancements à la main le lisent.
if (args.includes("--contexte-json")) {
  const entete = [
    "## Relevé d'ouverture de la factory (hook SessionStart asynchrone, oracles/hook-ouverture.mjs)",
    "- Ce relevé est produit en arrière-plan : s'il arrive après le premier échange, les gestes faits avant lui l'ont été sur l'état d'AVANT le `bootstrap --pull`. Le reprendre dès réception.",
    "",
  ];
  // TF-1635 (c) : les gestes faits pendant le relevé se DÉCLARENT, en tête, et laissent une trace locale.
  let gestes = [];
  const transcript = ENTREE_HOOK && ENTREE_HOOK.transcript_path;
  if (transcript && existsSync(transcript)) {
    try { gestes = gestesDansFenetre(readFileSync(transcript, "utf8"), DEBUT_RELEVE, Date.now()); } catch { gestes = []; }
  }
  if (gestes.length) {
    try {
      const p = spawnSync("git", ["rev-parse", "--git-path", "digit-ai-gestes-avant-releve.jsonl"], { encoding: "utf8", cwd: process.cwd() }).stdout.trim();
      if (p) appendFileSync(isAbsolute(p) ? p : join(process.cwd(), p), JSON.stringify({ ts: new Date().toISOString(), session: ENTREE_HOOK.session_id || null, debut_releve: new Date(DEBUT_RELEVE).toISOString(), gestes }) + "\n", "utf8");
    } catch { /* trace locale non écrite : la déclaration en tête du relevé reste */ }
  }
  const tete = [...entete, ...lignesGestesAvant(gestes), ...GATES, ""];
  // TF-1636 : le contexte injecté tient dans le budget MESURÉ (lib-budget-contexte.mjs) ; au-delà, les
  // sections de fin sont retirées entières et nommées, la tête (gates compris) est toujours gardée.
  const corps = lignes.slice(GATES.length + 1);
  const { lignes: bornees } = borner([...tete, ...corps], BUDGET_CONTEXTE_ASYNC, tete.length,
    `node "${enSlash(join(PILOT, "oracles", "hook-ouverture.mjs"))}"${iPilot >= 0 ? ` --pilot "${PILOT}" --sans-readme` : ""} depuis la racine de la session rejoue le relevé en entier`);
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: bornees.join("\n") },
  }) + "\n");
} else {
  console.log(lignes.join("\n"));
}
process.exit(0);
