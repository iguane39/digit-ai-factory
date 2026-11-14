#!/usr/bin/env node
/**
 * prompt-produit-delegation.test.mjs — recette à double sens de la section « Délégation aux agents » du prompt canonique (TF-2547, 14/11/2026).
 *
 * LE FAIT. Le prompt du run 20261114d d'un produit (4 lots, 15 clips, 15 animations, un studio de trois directions) ne nommait aucun agent par activité :
 * la conception a été tenue par la session seule, ledger seq 69 à 74 sans une seule invocation, et le plan de délégation n'a été ajouté qu'après coup, par
 * amendement du brief. Le gabarit de prompt de run (`PROMPT-PRODUIT.md`) n'imposait aucune section de délégation.
 *
 * CE QUE LA RECETTE JOUE sur le vrai `PROMPT-PRODUIT.md` : la section est DANS le bloc que l'humain colle (entre les deux clôtures), elle nomme CHAQUE agent de la
 * flotte du dépôt (`gabarits\flotte\*.yaml` : la liste se DÉRIVE, un agent de plus sans ligne au prompt rougit), les cinq étapes, la voie « session seule » avec motif,
 * le ledger qu'un agent n'écrit pas, et la condition des écritures en parallèle (arbres `git worktree` disjoints, racine en minuscule, TF-2443). Rouge : la section
 * retirée, un agent retiré, une étape retirée, la section sortie du bloc, un agent neuf de la flotte que le prompt ne nomme pas.
 */
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PROMPT = readFileSync(join(ICI, "..", "PROMPT-PRODUIT.md"), "utf8").replace(/\r\n/g, "\n");
const AGENTS = readdirSync(join(ICI, "..", "gabarits", "flotte")).filter((f) => f.endsWith(".yaml")).map((f) => basename(f, ".yaml")).sort();
const ETAPES = ["conception", "design", "development", "tests", "MEP"];

let ok = 0, ko = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); ok++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); ko++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };

/** Les défauts de la section de délégation d'un prompt, au regard des agents de la flotte donnés. Vide quand la section est complète. */
function defauts(texte, agents) {
  const bloc = texte.split("```")[1] || "";            // le bloc que l'humain colle : entre la première et la deuxième clôture
  const i = bloc.indexOf("Délégation aux agents");
  if (i < 0) return ["la section « Délégation aux agents » n'est pas dans le bloc collé par l'humain"];
  const section = bloc.slice(i, bloc.indexOf("Promesse :", i) > i ? bloc.indexOf("Promesse :", i) : undefined);
  const d = [];
  for (const a of agents) if (!section.includes(`\`${a}\``)) d.push(`l'agent « ${a} » de la flotte n'est pas nommé`);
  for (const e of ETAPES) if (!section.includes(e)) d.push(`l'étape « ${e} » n'est pas nommée`);
  if (!/session seule/.test(section) || !/motif/.test(section)) d.push("la voie « session seule » avec son motif n'est pas dite");
  if (!/ledger/.test(section)) d.push("le ledger qu'un agent n'écrit pas n'est pas dit");
  if (!/git worktree add/.test(section) || !/minuscule/.test(section) || !/TF-2443/.test(section)) d.push("la condition des écritures en parallèle (git worktree, racine en minuscule, TF-2443) n'est pas dite");
  return d;
}

check(`vert — le prompt canonique porte une section de délégation complète : ${AGENTS.length} agents de la flotte (${AGENTS.join(", ")}), 5 étapes, session seule, ledger, arbres disjoints`, () => {
  att(AGENTS.length >= 6 && AGENTS.includes("relecteur") && AGENTS.includes("verificateur"), `flotte lue : ${AGENTS}`);
  const d = defauts(PROMPT, AGENTS);
  att(d.length === 0, d.join(" ; "));
});
check("rouge — la section retirée du prompt : le contrôle la voit manquer", () => {
  const mutant = PROMPT.replace(/Délégation aux agents[\s\S]*?(?=\nPromesse :)/, "");
  att(mutant !== PROMPT, "chirurgie sans effet : le témoin est vide");
  att(defauts(mutant, AGENTS).some((x) => /n'est pas dans le bloc/.test(x)), "section absente non vue");
});
check("rouge — un agent retiré de la section (le relecteur, puis le verificateur) : nommé", () => {
  for (const a of ["relecteur", "verificateur"]) {
    const mutant = PROMPT.replaceAll(`\`${a}\``, a.toUpperCase());
    att(mutant !== PROMPT, `chirurgie sans effet pour ${a}`);
    att(defauts(mutant, AGENTS).some((x) => x.includes(`« ${a} »`)), `${a} retiré sans que le contrôle le voie`);
  }
});
check("rouge — une étape, la voie « session seule », puis la condition des arbres disjoints retirées : chacune est nommée", () => {
  for (const [motif, attendu] of [[/\(conception, design, development, tests, MEP\)/, /étape/], [/ou dit « session seule » avec son motif/, /session seule/], [/`git worktree add`/, /écritures en parallèle/]]) {
    const mutant = PROMPT.replace(motif, "");
    att(mutant !== PROMPT, `chirurgie sans effet : ${motif}`);
    att(defauts(mutant, AGENTS).some((x) => attendu.test(x)), `${motif} retiré sans que le contrôle le voie`);
  }
});
check("rouge — la section sortie du bloc collé (après la clôture) n'est pas dans le prompt : refusée", () => {
  const section = /Délégation aux agents[\s\S]*?(?=\nPromesse :)/.exec(PROMPT)[0];
  const mutant = PROMPT.replace(section, "").replace(/\n```\n\n---/, `\n\`\`\`\n\n${section}\n\n---`);
  att(mutant !== PROMPT && mutant.includes(section), "chirurgie sans effet");
  att(defauts(mutant, AGENTS).some((x) => /n'est pas dans le bloc/.test(x)), "une section hors du bloc passe pour une section du prompt");
});
check("rouge — un agent neuf de la flotte que le prompt ne nomme pas est refusé : la liste se dérive de gabarits\\flotte\\", () => {
  const d = defauts(PROMPT, [...AGENTS, "agent-neuf"]);
  att(d.length === 1 && /agent-neuf/.test(d[0]), d.join(" ; "));
});

console.log(`\nprompt-produit-delegation (TF-2547) : ${ok} PASS, ${ko} FAIL — cas rouges : section, agent, étape, session seule, arbres disjoints, section hors bloc, agent neuf de la flotte`);
process.exit(ko ? 1 : 0);
