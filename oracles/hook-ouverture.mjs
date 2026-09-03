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
 * pas leur affaire) · --pilot <dossier> (lanceur produit : chemin du pilot résolu).
 */
import { existsSync, readFileSync, copyFileSync, mkdirSync, appendFileSync } from "node:fs";
import { join, dirname, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iPilot = args.indexOf("--pilot");
const PILOT = iPilot >= 0 ? args[iPilot + 1] : join(ICI, "..");
const lignes = [];

if (!args.includes("--sans-bootstrap")) {
  const b = join(PILOT, "bootstrap.mjs");
  if (existsSync(b)) {
    const r = spawnSync(process.execPath, [b, "--pull"], { encoding: "utf8", timeout: 200000, cwd: PILOT });
    const sortie = (r.stdout || "") + (r.stderr || "");
    const utiles = sortie.split(/\r?\n/).filter((l) => /^\[(DEFAUT|avert|relance)\]|^Poste|^\s{2}digit-ai-/.test(l));
    lignes.push(`## Fraîcheur (bootstrap --pull, exit ${r.status ?? "?"})`, ...utiles.map((l) => l.trimEnd()));
    if (r.status !== 0) lignes.push("→ Poste NON prêt : appliquer les remèdes ci-dessus AVANT tout run (règle Fraîcheur, R-19).");
  } else lignes.push("## Fraîcheur : bootstrap.mjs introuvable dans le pilot — mise à jour NON jouée.");
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
  if (existsSync(o)) {
    const r = spawnSync(process.execPath, [o, PRODUIT], { encoding: "utf8", timeout: 60000 });
    let f = null;
    try {
      const brut = r.stdout || "";
      const j = JSON.parse(brut.slice(brut.indexOf("{")));
      f = (j.findings || []).find((x) => x.regle === "R-47");
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
        `  node "${o}" "${PRODUIT}"`,
        "- Non bloquant : ce contrôle DÉCLARE ce qu'il ne peut pas réparer, il n'arrête pas la session.");
    }
  }
}

if (!args.includes("--sans-readme")) {
  const g = join(PILOT, "scripts", "readme-dossiers.mjs");
  if (existsSync(g)) {
    const r = spawnSync(process.execPath, [g, "--check", "--base", PILOT], { encoding: "utf8" });
    lignes.push("", r.status === 0 ? "## README d'input\\ et output\\ : à jour." : `## README d'input\\ et output\\ : DÉFAUT — ${(r.stderr || "").trim().split("\n").slice(0, 4).join(" ")} → node scripts\\readme-dossiers.mjs puis rédiger les rôles.`);
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
      try {
        appendFileSync(join(PILOT, "todo", "HERITAGE-RELEVES.jsonl"), JSON.stringify({
          ts: new Date().toISOString(), contrat: j.contrat, produits: (j.lignes || []).map((l) => ({
            produit: l.produit, absents: l.absents, divergents: l.divergents, incomplets: l.incomplets, total: l.total,
            artefacts: (l.artefacts || []).map((a) => ({ cible: a.cible, etat: a.etat })),
          })),
        }) + "\n", "utf8");
      } catch (e) { lignes.push(`- relevé NON journalisé (${e.message}) — le délai de descente ne se mesurera pas sur cette ouverture`); }
      for (const l of enDefaut.slice(0, 12)) {
        const lanceur = (l.artefacts || []).find((a) => /hooks\/factory\.mjs$/.test(a.cible || ""));
        const sansLanceur = lanceur && lanceur.etat === "absent";
        lignes.push(`  - ${l.produit} : ${l.absents} absent(s), ${l.divergents} divergent(s), ${l.incomplets} incomplet(s) sur ${l.total}` +
          (sansLanceur ? ` — SANS lanceur de hooks : rien ne se remettra à niveau tout seul ; poser gabarits/hooks-factory.mjs et settings-produit.json chez lui (geste humain, R-29)${famillesDe(l).length ? ` ; NON PROTÉGÉ des familles : ${famillesDe(l).join(", ")}` : ""}`
            : " — remis à niveau à sa prochaine ouverture (copies identiques) ; le reste est un geste du produit"));
      }
      if (enDefaut.length > 12) lignes.push(`  - … et ${enDefaut.length - 12} autre(s) — détail : node scripts/relever-heritage.mjs --md <fichier>`);
      if (!enDefaut.length) lignes.push("- tous les produits relevés portent leur héritage à jour");
    }
  }
}

lignes.push("",
  "## Gates actifs dans cette session (R-44)",
  "- Tout message de fin de tour de TRAVAIL suit gabarits\RESTITUTION.md — bloc 0 + 8 blocs, aucun omis. Bloc 3 : une décision par BLOC DE CITATION, ouverte par son sélecteur `D-N` et une QUESTION, rappel du sujet puis recommandation SOURCÉE, options en tableau `Option | Ce qu'elle coûte | Ce qu'elle exclut` hors citation, ligne de repli « si rien n'est décidé » pour finir. Bloc 8 : UN TABLEAU unique, l'acteur en COLONNE (auto_ia/manuelle_dev/manuelle_utilisateur), trié auto_ia d'abord, chaque action ouverte par son sélecteur `A-N` — les deux familles ne partagent JAMAIS la même numérotation. Effort en complexité × durée, jamais en jours. v2.16.0 (02/09) : aucune action manuelle_utilisateur ne demande à l'humain de CRÉER, AJOUTER ou ÉCRIRE une ligne, une variable ou un fichier (geste d'agent) ; une preuve du bloc 4 est une sortie exécutée, jamais « préparé » ni « voir A-N » ; toute page HTML citée comme livrée porte le verdict de la critique d'implémentation ; une correction restituée nomme son contrôle rouge → vert ou sa classe ; le fichier de synthèse se nomme Synthese ou Restitution — le marqueur `destinataire: humain` est réservé aux restitutions. Le hook Stop le juge par oracle-synthese et REFUSE l'arrêt en cas d'échec.",
  "- Les README d'input\\ et output\\ se régénèrent après chaque écriture (hook PostToolUse) ; un rôle non rédigé est un défaut.",
  "- Quand la factory est impliquée, ses règles priment sur celles du projet (R-43).");
console.log(lignes.join("\n"));
process.exit(0);
