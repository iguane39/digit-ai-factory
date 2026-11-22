#!/usr/bin/env node
/**
 * contrat-agent-campagne.test.mjs — les phrases du contrat d'agent (`gabarits/AGENT-CAMPAGNE.md`) que des décisions ont ajoutées
 * se lisent encore au contrat, dans les deux sens : vert sur le fichier réel, rouge sur le même fichier privé de la phrase.
 *   TF-2619 (16/11/2026) : une copie de dossier exclut les fichiers d'environnement, et leur absence se vérifie.
 *   TF-2625 (16/11/2026) : la critique d'implémentation sur l'instance servie pour tout écran écrit, et la rubrique
 *     `relecture_independante` du rapport (déclarée absente quand aucune relecture indépendante n'a eu lieu).
 *   TF-2621 (16/11/2026) : le marqueur d'occupation d'une copie de travail (le code vit dans `oracles/hook-flotte.mjs`).
 *   TF-2663 (16/11/2026) : les quatre rubriques d'une consigne d'agent, contrôlées par `relecture-intention.mjs --preparer consigne`.
 * Un contrat sans sa phrase redevient muet sur le défaut : la phrase est la seule preuve que l'agent sait.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRAT = readFileSync(join(RACINE, "gabarits", "AGENT-CAMPAGNE.md"), "utf8").replace(/\r\n/g, "\n");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const vrai = (c, m) => { if (!c) throw new Error(m); };

/** Le contrat privé du paragraphe ou de la section qui porte `motif` (jusqu'au titre ou paragraphe suivant). */
const sansBloc = (texte, motif) => texte.split(/\n{2,}/).filter((b) => !motif.test(b)).join("\n\n");

// ---- TF-2619 : la copie récursive d'un dossier ----------------------------------------------------------------------
const COPIE = {
  section: /^## Une copie de dossier n'emporte aucun fichier d'environnement \(TF-2619/m,
  exclusion: /Toute copie de dossier exclut les fichiers d'environnement/,
  motifs: /`\.env` et `\.env\.\*`/,
  verification: /L'absence se vérifie après la copie/,
  commande: /Get-ChildItem -Recurse -Force -Filter "\.env\*"/,
  chemin_seul: /son chemin seul, jamais son contenu, entre aux `restes`/,
};
check("vert (TF-2619) — le contrat exclut les fichiers d'environnement de toute copie de dossier et en vérifie l'absence", () => {
  for (const [nom, motif] of Object.entries(COPIE)) vrai(motif.test(CONTRAT), `le contrat ne porte plus « ${nom} » (${motif})`);
});
check("rouge (TF-2619) — le contrat privé de la règle ne la porte plus : le contrôle voit la différence", () => {
  const mutant = sansBloc(CONTRAT, /Toute copie de dossier exclut/);
  vrai(mutant !== CONTRAT, "la chirurgie n'a rien retiré");
  vrai(!COPIE.exclusion.test(mutant), "la règle d'exclusion subsiste dans le mutant");
});

// ---- TF-2621 : le marqueur d'occupation d'une copie de travail ---------------------------------------------------------
const OCCUPATION = {
  section: /^## Une copie de travail occupée porte son marqueur \(TF-2621/m,
  pose: /La session qui crée une copie y pose son marqueur/,
  commande: /node scripts\\occuper-copie\.mjs --poser <copie> --session <identifiant>/,
  hook: /`oracles\\hook-flotte\.mjs` le lit avant tout lancement d'agent/,
  refus: /refuse \(exit 2\) quand une autre session vivante occupe la copie/,
  agent: /L'agent ne pose ni ne retire le marqueur/,
};
check("vert (TF-2621) — le contrat prescrit la pose du marqueur à la création d'une copie et sa lecture par hook-flotte avant tout lancement d'agent", () => {
  for (const [nom, motif] of Object.entries(OCCUPATION)) vrai(motif.test(CONTRAT), `le contrat ne porte plus « ${nom} » (${motif})`);
});
check("vert (TF-2621) — les fichiers que le contrat nomme existent : le script de pose et le hook", () => {
  for (const f of ["scripts/occuper-copie.mjs", "oracles/hook-flotte.mjs"]) vrai(existsSync(join(RACINE, f)), `${f} est prescrit par le contrat et absent`);
  vrai(/export function jugerOccupation/.test(readFileSync(join(RACINE, "oracles", "hook-flotte.mjs"), "utf8")), "hook-flotte ne porte plus jugerOccupation");
});
check("rouge (TF-2621) — le contrat privé de la section ne prescrit plus le marqueur : le contrôle voit la différence", () => {
  const mutant = sansBloc(CONTRAT, /Une copie de travail occupée porte son marqueur|La session qui crée une copie|oracles\\hook-flotte\.mjs` le lit|L'agent ne pose ni ne retire/);
  vrai(mutant !== CONTRAT && !OCCUPATION.pose.test(mutant) && !OCCUPATION.hook.test(mutant), "la chirurgie n'a pas retiré la section");
});

// ---- TF-2625 : la critique d'implémentation d'un écran écrit, et la relecture indépendante déclarée au rapport ------------
const MODELE_RAPPORT = CONTRAT.slice(CONTRAT.indexOf("**Rapport final (le livrable).**"), CONTRAT.indexOf("**Mesurer, et rendre une mesure"));
const CRITIQUE = {
  section: /^## Un écran écrit se juge sur l'instance servie, et le rapport dit s'il a été relu \(TF-2625/m,
  critique: /Tout écran écrit passe la critique d'implémentation sur la page telle que l'instance la sert/,
  commande: /run-oracles-design\.mjs <page> --rendu/,
  relecture: /Le rapport déclare la relecture indépendante/,
  absence: /« absente — non jouée par l'agent »/,
};
const RUBRIQUES_RAPPORT = [/^relecture_independante: /m, /^critique_rendu: /m];
check("vert (TF-2625) — le contrat prescrit la critique d'implémentation de tout écran écrit et la déclaration de la relecture indépendante", () => {
  for (const [nom, motif] of Object.entries(CRITIQUE)) vrai(motif.test(CONTRAT), `le contrat ne porte plus « ${nom} » (${motif})`);
});
check("vert (TF-2625) — le gabarit de rapport porte les rubriques relecture_independante et critique_rendu, dans le bloc du rapport final", () => {
  vrai(MODELE_RAPPORT.length > 200, "le bloc du rapport final n'a pas été retrouvé");
  for (const m of RUBRIQUES_RAPPORT) vrai(m.test(MODELE_RAPPORT), `le gabarit de rapport ne porte plus ${m}`);
  vrai(/absente — non jouée par l'agent/.test(MODELE_RAPPORT), "le gabarit de rapport ne dit plus l'absence déclarée");
});
check("rouge (TF-2625) — le gabarit de rapport d'avant (sans les deux rubriques) est vu : le contrôle ne passe pas", () => {
  const avant = MODELE_RAPPORT.split("\n").filter((l) => !/^(relecture_independante|critique_rendu): /.test(l)).join("\n");
  vrai(avant !== MODELE_RAPPORT, "la chirurgie n'a rien retiré");
  vrai(RUBRIQUES_RAPPORT.every((m) => !m.test(avant)), "les rubriques subsistent dans le gabarit d'avant");
  const sansSection = sansBloc(CONTRAT, /Un écran écrit se juge sur l'instance servie|Tout écran écrit passe la critique|Le rapport déclare la relecture indépendante/);
  vrai(sansSection !== CONTRAT && !CRITIQUE.critique.test(sansSection), "le contrat privé de la section prescrit encore la critique");
});

// ---- TF-2663 : les quatre rubriques d'une consigne d'agent ------------------------------------------------------------
const RUBRIQUES_CONSIGNE = {
  section: /^## La consigne d'un agent porte ses quatre rubriques \(TF-2663/m,
  commande: /node scripts\\relecture-intention\.mjs --preparer consigne --fichier <consigne\.md>` contrôle quatre rubriques/,
  refus: /refuse \(exit 1, rien n'est préparé\)/,
  dossier: /\*\*le dossier temporaire\*\* de l'agent/,
  raison: /\*\*la raison de l'affectation au modèle\*\*, exigée dès que la consigne nomme `constructeur` ou Opus/,
  depart: /\*\*la version de départ\*\*/,
  commit: /\*\*le commit qui la porte\*\*/,
  exemption: /--sans-rubriques "<motif>"/,
};
check("vert (TF-2663) — le contrat nomme les quatre rubriques, le refus et l'exemption déclarée", () => {
  for (const [nom, motif] of Object.entries(RUBRIQUES_CONSIGNE)) vrai(motif.test(CONTRAT), `le contrat ne porte plus « ${nom} » (${motif})`);
});
check("vert (TF-2663) — le script nommé par le contrat porte l'option et le contrôle (rubriquesDeConsigne, --sans-rubriques)", () => {
  const src = readFileSync(join(RACINE, "scripts", "relecture-intention.mjs"), "utf8");
  vrai(/export function rubriquesDeConsigne/.test(src) && /--sans-rubriques/.test(src), "relecture-intention.mjs ne porte plus le contrôle des rubriques");
});
check("rouge (TF-2663) — le contrat privé de la section ne nomme plus les rubriques : le contrôle voit la différence", () => {
  const mutant = sansBloc(CONTRAT, /La consigne d'un agent porte ses quatre rubriques|contrôle quatre rubriques|le dossier temporaire\*\* de l'agent|Une consigne qui n'est pas une délégation d'écriture/);
  vrai(mutant !== CONTRAT && !RUBRIQUES_CONSIGNE.section.test(mutant) && !RUBRIQUES_CONSIGNE.exemption.test(mutant), "la chirurgie n'a pas retiré la section");
});

// ---- TF-2705, TF-2720 : FORGE_ROOT hérité, jugé avant la première recette -----------------------------------------------
const RACINE_HERITEE = {
  titre: /\*\*Variables héritées : `FORGE_ROOT` se juge avant la première recette \(TF-2705, TF-2720/,
  commande: /node <pilot>\\oracles\\lib-racine-parc\.mjs --juger/,
  contournement: /Une racine sans pilot se contourne par la valeur de ta consigne/,
  refus: /`node oracles\\self-tests\.mjs` refuse de se jouer\*\* \(exit 3/,
};
check("vert (TF-2705, TF-2720) — le contrat prescrit de juger FORGE_ROOT avant la première recette, de poser la valeur de la consigne, et dit le refus de la recette agrégée", () => {
  for (const [nom, motif] of Object.entries(RACINE_HERITEE)) vrai(motif.test(CONTRAT), `le contrat ne porte plus « ${nom} » (${motif})`);
});
check("vert (TF-2705, TF-2720) — les fichiers que le contrat nomme existent et portent la garde : la commande --juger et le refus d'exit 3", () => {
  const lib = readFileSync(join(RACINE, "oracles", "lib-racine-parc.mjs"), "utf8");
  vrai(/--juger/.test(lib) && /export function jugerForgeRoot/.test(lib), "lib-racine-parc.mjs ne porte plus --juger");
  vrai(/process\.exit\(3\)/.test(readFileSync(join(RACINE, "oracles", "self-tests.mjs"), "utf8")), "self-tests.mjs ne refuse plus (exit 3) sous une racine sans pilot");
});
check("rouge (TF-2705, TF-2720) — le contrat privé du paragraphe ne prescrit plus de juger FORGE_ROOT : le contrôle voit la différence", () => {
  const mutant = sansBloc(CONTRAT, /Variables héritées : `FORGE_ROOT` se juge/);
  vrai(mutant !== CONTRAT && !RACINE_HERITEE.commande.test(mutant) && !RACINE_HERITEE.refus.test(mutant), "la chirurgie n'a pas retiré le paragraphe");
});

// ---- TF-2721, TF-2689, TF-2731, TF-2725, TF-2735, TF-2703, TF-2693 : les gestes que le contrat interdit ou prescrit, chacun avec le fichier qui l'exécute -----------------
const GESTES = [
  { tf: "TF-2721", titre: /Un relevé de l'environnement ne s'affiche jamais en entier \(TF-2721/, phrases: [/`env`, `printenv` sans nom, `set`, `export -p`, `Get-ChildItem env:`/, /node <pilot>\\scripts\\env-session\.mjs/, /--presente NOM/],
    fichiers: ["scripts/env-session.mjs", "oracles/hook-gardes-commande.mjs"], motif: /Un relevé de l'environnement ne s'affiche jamais/ },
  { tf: "TF-2689 et TF-2731", titre: /Un processus se vise par le PID noté à son lancement \(TF-2689, TF-2731/, phrases: [/\*\*Arrêt par PID seulement\*\*/, /processus-par-pid\.mjs lancer --fichier-pid/, /L'arrêt se vérifie par la liste des processus\*\*, jamais par le statut de la tâche/],
    fichiers: ["scripts/processus-par-pid.mjs", "oracles/hook-gardes-commande.mjs"], motif: /Un processus se vise par le PID noté/ },
  { tf: "TF-2725", titre: /Une table de noms ne se sonde pas \(TF-2725/, phrases: [/node <pilot>\\scripts\\structure-table-noms\.mjs --clients \| --produits \| <fichier>/, /jamais une clé ni une valeur de la table/],
    fichiers: ["scripts/structure-table-noms.mjs"], motif: /Une table de noms ne se sonde pas/ },
  { tf: "TF-2735", titre: /`ListAgents` est absent d'une session `claude -p` : le repli se prévoit \(TF-2735/, phrases: [/sessions-par-transcriptions\.mjs/, /mesuré par inférence sur les transcriptions/],
    fichiers: ["scripts/sessions-par-transcriptions.mjs"], motif: /`ListAgents` est absent d'une session/ },
  { tf: "TF-2703", titre: /Une consigne qui interdit des fichiers déclare les erreurs qu'ils portent déjà \(TF-2703/, phrases: [/« référence admise » \(fichier, règle, nombre\)/, /alerte quand elle ne le fait pas/],
    fichiers: ["scripts/relecture-intention.mjs"], motif: /Une consigne qui interdit des fichiers déclare/ },
  { tf: "TF-2693", titre: /La consigne d'un lot se relit comme une part de la demande \(TF-2693/, phrases: [/--repartition <répartition des lots\.md>/, /attribue à un autre lot/],
    fichiers: ["scripts/relecture-intention.mjs"], motif: /La consigne d'un lot se relit comme une part/ },
];
for (const g of GESTES) {
  check(`vert (${g.tf}) — le contrat porte la règle et ses phrases-clés, et les fichiers qu'il nomme existent`, () => {
    vrai(g.titre.test(CONTRAT), `le contrat ne porte plus le titre (${g.titre})`);
    for (const p of g.phrases) vrai(p.test(CONTRAT), `le contrat ne porte plus la phrase ${p}`);
    for (const f of g.fichiers) vrai(existsSync(join(RACINE, f)), `${f} est nommé par le contrat et absent`);
  });
  check(`rouge (${g.tf}) — le contrat privé du paragraphe ne porte plus la règle : le contrôle voit la différence`, () => {
    const mutant = sansBloc(CONTRAT, g.motif);
    vrai(mutant !== CONTRAT && !g.titre.test(mutant), "la chirurgie n'a pas retiré le paragraphe");
  });
}
check("vert (TF-2689, TF-2721) — le hook que le contrat nomme est câblé au PreToolUse du pilot, sur Bash et PowerShell", () => {
  const reglages = JSON.parse(readFileSync(join(RACINE, ".claude", "settings.json"), "utf8"));
  const groupe = (reglages.hooks?.PreToolUse || []).find((x) => (x.hooks || []).some((h) => /hook-gardes-commande\.mjs/.test(h.command || "")));
  vrai(groupe && /Bash/.test(groupe.matcher) && /PowerShell/.test(groupe.matcher), "hook-gardes-commande.mjs n'est pas câblé sur Bash et PowerShell");
});

console.log(`\ncontrat-agent-campagne.test : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
