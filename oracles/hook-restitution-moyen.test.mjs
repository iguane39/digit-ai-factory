#!/usr/bin/env node
/**
 * hook-restitution-moyen.test.mjs — recette du NIVEAU MOYEN (étape 2 des niveaux d'intervention,
 * en essai depuis le 01/10/2026 à la demande humaine ; étude
 * `output/03-etudes/20260925-etude-opportunite-niveaux-d-intervention.md`, « Le mécanisme qui
 * empêche le raccourci »).
 *
 *   1. VERT — une recherche de 12 commandes de lecture rendue au format Moyen : laisse passer.
 *   2. ROUGE — le cas du 08/09 (TF-0978) : commit et push, message déclaré « Niveau : Moyen » :
 *      jugé Complexe, refus qui nomme l'escalade.
 *   3. Forme : une pièce absente → refus MOYEN, avec le rappel court et non les 8 blocs.
 *   4. Détecteur, dans les deux sens : écriture dans le dossier temporaire et redirections vers le
 *      néant épargnées ; écriture du dépôt, redirection vers un fichier, outil connecté qui envoie,
 *      agent qui peut écrire relevés.
 *   5. Pré-vol : la forme Moyen jugée avant affichage, dans les deux sens.
 *   6. État du dépôt : intact, aucun effet ; un fichier apparu pendant le tour, effet relevé.
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { detecterEffets, effetsGit, jugerFormeMoyen } from "./hook-restitution.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-restitution.mjs");
const base = mkdtempSync(join(tmpdir(), "hook-moyen-"));
let pass = 0;
const echecs = [];
const check = (nom, ok, detail = "") => { if (ok) pass++; else echecs.push(`${nom}${detail ? ` — ${detail}` : ""}`); };

// La réponse de l'exemple de l'étude (21/09/2026), au format Moyen.
const MOYEN = `Niveau : Moyen

**La réponse.** Oui pour l'essentiel. Sur 25 travaux de communication relevés au registre, 16 sont appliqués et publiés, et aucun ne dort sur une branche. Il en reste 9 ouverts : 3 livrés en partie, 3 qui attendent une session chez un produit, 3 candidats non tranchés.

**Preuves.**
- \`todo/TODO.jsonl\` porte 25 travaux, dont 16 corrigés.
- \`git branch -a --no-merged main\` ne rend rien.
- Les 5 skills installés sont identiques à la forge.

**Non vérifié.** Le résultat des oracles sur les travaux corrigés : leur présence est vérifiée, pas leur résultat.

**Décision attendue.** Aucune.`;

const humain = { type: "user", timestamp: new Date(Date.now() - 60_000).toISOString(),
  message: { role: "user", content: "pourquoi les travaux de communication ne sont-ils pas tous appliqués ?" } };
const outil = (name, input) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name, input }] } });
const resultat = { type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } };
const texte = (t) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: t }] } });
const transcript = (outils, final) => [humain, ...outils.flatMap((o) => [o, resultat]), texte(final)].map((e) => JSON.stringify(e)).join("\n");

const jouer = (nom, outils, final, extra = {}) => {
  const p = join(base, nom + ".jsonl");
  writeFileSync(p, transcript(outils, final), "utf8");
  // cwd hors dépôt git : seul le relevé des outils parle, le test ne dépend pas de l'état du pilot.
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: base,
    input: JSON.stringify({ session_id: "test-moyen", transcript_path: p, stop_hook_active: false, cwd: base, ...extra }) });
  try { return JSON.parse(r.stdout || "null"); } catch { return null; }
};

try {
  // 1. VERT
  const lectures = Array.from({ length: 12 }, (_, i) => outil("Bash", { command: `grep -n motif${i} todo/TODO.jsonl 2>/dev/null | head -5` }));
  const v = jouer("vert", lectures, MOYEN);
  check("1 vert : 12 lectures + forme Moyen → laisse passer", v === null, JSON.stringify(v)?.slice(0, 200));

  // 2. ROUGE — le cas du 08/09
  const r = jouer("rouge", [...lectures.slice(0, 3), outil("Bash", { command: "git commit -m correctif" }), outil("Bash", { command: "git push origin main" })], MOYEN);
  check("2 rouge : commit + push déclarés Moyen → jugé Complexe", r?.decision === "block" && /jugé Complexe/.test(r.reason) && /S1/.test(r.reason),
    JSON.stringify(r)?.slice(0, 200));

  // 3. FORME
  const sansNonVerifie = MOYEN.replace(/\*\*Non vérifié\.\*\*[^\n]*\n\n/, "");
  const f = jouer("forme", lectures, sansNonVerifie);
  check("3 forme : pièce absente → refus MOYEN au rappel court", f?.decision === "block" && /MOYEN — pièce\(s\) absente\(s\) : Non vérifié/.test(f.reason)
    && !/8 blocs numérotés/.test(f.reason), JSON.stringify(f)?.slice(0, 200));
  const f2 = jouer("forme-deja", lectures, sansNonVerifie, { stop_hook_active: true });
  check("3 bis : forme en défaut déjà refusée une fois → laisse passer (anti-boucle)", f2 === null);
  const long = MOYEN.replace("Aucune.", "Aucune. " + "mot ".repeat(350));
  check("3 ter : 400 mots dépassés → écart nommé", jugerFormeMoyen(long).ecarts.some((e) => /au-delà des 400/.test(e)));
  const dSansOptions = MOYEN.replace("Aucune.", "D-12 — faut-il publier ?");
  check("3 quater : D-N sans recommandation ni tableau → écart nommé", jugerFormeMoyen(dSansOptions).ecarts.some((e) => /recommandation/.test(e)));
  check("3 quinquies : forme de référence → aucun écart", jugerFormeMoyen(MOYEN).ecarts.length === 0, jugerFormeMoyen(MOYEN).ecarts.join(" ; "));

  // 4. DÉTECTEUR — épargnés
  const tmp = join(tmpdir(), "brouillon.md");
  const epargnes = [
    outil("Write", { file_path: tmp }),
    outil("Bash", { command: "node -e \"const f = (x) => x > 2\" 2>&1 | head" }),
    outil("Bash", { command: `git log -3 > ${join(tmpdir(), "log.txt").replace(/\\/g, "/")}` }),
    outil("PowerShell", { command: "Get-ChildItem 2>$null" }),
    outil("Agent", { subagent_type: "Explore", prompt: "cherche" }),
    outil("mcp__claude_ai_Gmail__search_threads", { q: "x" }),
  ];
  const e0 = detecterEffets(epargnes);
  check("4 détecteur : temporaire, néant, flèche, Explore, lecture connectée → aucun effet", e0.length === 0, e0.join(" ; "));
  // relevés
  const releves = [
    [outil("Write", { file_path: "C:/dev/digit-ai-factory/references/NIVEAUX.md" }), /écriture de/],
    [outil("Bash", { command: "git log -1 > rapport.txt" }), /redirection vers rapport\.txt/],
    [outil("Bash", { command: "sed -i 's/a/b/' x.md" }), /sed -i/],
    [outil("PowerShell", { command: "Remove-Item x.md -Confirm:$false" }), /Remove-Item/],
    [outil("mcp__claude_ai_Gmail__send_message", { to: "x" }), /outil connecté/],
    [outil("Agent", { subagent_type: "general-purpose", prompt: "corrige" }), /Agent lancé/],
  ];
  for (const [o, re] of releves) {
    const e = detecterEffets([o]);
    check(`4 détecteur : ${o.message.content[0].name} relevé`, e.length === 1 && re.test(e[0]), e.join(" ; "));
  }

  // 6. ÉTAT DU DÉPÔT — un fichier écrit par un programme, hors de tout outil d'écriture.
  const depot = join(base, "depot");
  spawnSync("git", ["init", "-q", depot]);
  const avant = new Date(Date.now() - 5_000).toISOString();
  check("6 dépôt intact → aucun effet", effetsGit(depot, avant).length === 0, effetsGit(depot, avant).join(" ; "));
  writeFileSync(join(depot, "ecrit-par-un-script.txt"), "x");
  const eg = effetsGit(depot, avant);
  check("6 bis : fichier apparu pendant le tour → effet relevé", eg.length === 1 && /ecrit-par-un-script/.test(eg[0]), eg.join(" ; "));

  // 5. PRÉ-VOL
  const pv = (t) => spawnSync(process.execPath, [HOOK, "--pre-vol"], { encoding: "utf8", input: t });
  const pvOk = pv(MOYEN), pvKo = pv(sansNonVerifie);
  check("5 pré-vol : forme Moyen de référence → exit 0", pvOk.status === 0, pvOk.stdout);
  check("5 bis pré-vol : pièce absente → exit 1", pvKo.status === 1 && /Non vérifié/.test(pvKo.stdout), pvKo.stdout);
} catch (e) { echecs.push(`harnais : ${String(e).slice(0, 200)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error(`hook-restitution-moyen : FAIL (${pass} PASS)\n  - ` + echecs.join("\n  - ")); process.exit(1); }
console.log(`hook-restitution-moyen : ${pass}/${pass} — niveau Moyen : recherche sans effet acceptée à sa forme, commit et push déclarés Moyen jugés Complexe (cas du 08/09), pièce absente refusée au rappel court, anti-boucle, bornes de 400 mots et de décision complète, détecteur d'effets dans ses deux sens, pré-vol de la forme`);
