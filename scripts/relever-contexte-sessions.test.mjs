#!/usr/bin/env node
/**
 * relever-contexte-sessions.test.mjs — le relevé du contexte relu par tour, dans les deux sens (TF-1558).
 *   VERT  : une session courte, sous le seuil, rend PASS ; une réponse répétée sur plusieurs lignes (même
 *           `message.id`) ne se compte qu'une fois ; un résultat d'outil et un retour de hook n'ouvrent pas de tour ;
 *   ROUGE : une session qui franchit le seuil est NOMMÉE (AVERT), jamais un échec (exit 0) ;
 *   BORNES : le seuil se lit au référentiel ; une option inconnue rend 2.
 * TF-1934 — les descriptions de skills (VERT : un corpus court, cumul, moyenne et maximum exacts, sans rappel de revue ;
 *   ROUGE : un corpus aux descriptions longues est nommé et rappelle les deux questions de revue, sans bouger le verdict
 *   du contexte ; BORNES : un dossier de skills lié à un autre profil ne se compte qu'une fois).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { lireTranscription, executer, descriptionDe, dossiersSkillsParDefaut } from "./relever-contexte-sessions.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const humain = (t) => JSON.stringify({ type: "user", message: { role: "user", content: t } });
const outil = () => JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "tool_result", content: "ok" }] } });
const hook = () => JSON.stringify({ type: "user", message: { role: "user", content: "Stop hook feedback: S1 — bloc absent" } });
const reponse = (id, lu, effort = "high") => JSON.stringify({ type: "assistant", effort, message: { id, model: "claude-opus-5-5", role: "assistant", content: [{ type: "text", text: "x" }], usage: { input_tokens: 2, cache_read_input_tokens: lu, cache_creation_input_tokens: 1000, output_tokens: 50 } } });

const T = mkdtempSync(join(tmpdir(), "contexte-"));
try {
  const courte = [humain("fais A"), reponse("m1", 60000), outil(), reponse("m2", 70000), reponse("m2", 70000), hook(), reponse("m3", 71000), humain("fais B"), reponse("m4", 80000)].join("\n");
  const longue = [humain("mandat 1"), reponse("n1", 60000), humain("mandat 2"), reponse("n2", 450000, "max"), outil(), reponse("n3", 900000, "max")].join("\n");
  const projet = join(T, "projects", "c--dev-pilot");
  mkdirSync(join(projet, "aaaaaaaa-1", "subagents"), { recursive: true });
  writeFileSync(join(projet, "aaaaaaaa-1.jsonl"), courte + "\n");
  writeFileSync(join(projet, "bbbbbbbb-2.jsonl"), longue + "\n");
  writeFileSync(join(projet, "aaaaaaaa-1", "subagents", "agent-x.jsonl"), [humain("tâche"), reponse("s1", 500000)].join("\n") + "\n");
  const ref = join(T, "ref.json");
  writeFileSync(ref, JSON.stringify({ sessions: { seuil_contexte_jetons: 400000 } }));

  check("vert : réponse dédoublonnée par message.id, résultat d'outil et retour de hook n'ouvrent pas de tour", () => {
    const lu = lireTranscription(courte);
    if (lu.reponses.length !== 4) throw new Error(`${lu.reponses.length} réponses au lieu de 4`);
    if (lu.tours !== 2) throw new Error(`${lu.tours} tours au lieu de 2`);
    if (lu.reponses[0].contexte !== 61002) throw new Error(`contexte ${lu.reponses[0].contexte} au lieu de 61002 (entrée + cache lu + cache écrit)`);
  });
  check("vert : une session sous le seuil rend PASS", () => {
    const r = executer(["--transcripts", projet, "--referentiel", ref, "--seuil", "2000000"]).rapport;
    if (r.ensemble.verdict !== "PASS") throw new Error(r.ensemble.verdict);
  });
  check("rouge : la session qui franchit le seuil du référentiel est nommée (AVERT), l'autre non ; sous-agent compté à part", () => {
    const { code, rapport: r } = executer(["--transcripts", projet, "--referentiel", ref]);
    if (code !== 0) throw new Error(`exit ${code}`);
    if (r.ensemble.verdict !== "AVERT" || r.ensemble.sessions_au_dela_du_seuil !== 1) throw new Error(JSON.stringify(r.ensemble));
    if (r.seuil_provenance !== "référentiel") throw new Error(r.seuil_provenance);
    const s = r.sessions.find((x) => x.session.endsWith("bbbbbbbb"));
    if (!s || s.reponses_au_dela_du_seuil !== 2 || s.efforts.max !== 2) throw new Error(JSON.stringify(s));
    if (r.sous_agents.nombre !== 1 || r.sous_agents.au_dela_du_seuil !== 1) throw new Error(JSON.stringify(r.sous_agents));
  });
  check("rouge de bout en bout : la ligne de commande nomme la session au-delà, exit 0", () => {
    const c = spawnSync(process.execPath, [join(ICI, "relever-contexte-sessions.mjs"), "--transcripts", projet, "--referentiel", ref], { encoding: "utf8" });
    if (c.status !== 0 || !/\[AVERT\] c--dev-pilot\/bbbbbbbb/.test(c.stdout)) throw new Error(`exit ${c.status} : ${c.stdout}`);
  });
  check("borne : une option inconnue rend 2", () => {
    if (executer(["--inconnue"]).code !== 2) throw new Error("pas 2");
  });

  // TF-1934 (D-48 (a) du 19/10/2026) — les descriptions de skills : cumul, moyenne, maximum, part au-dessus de 419 caractères.
  const skill = (dossier, nom, frontmatter, crlf = false) => {
    mkdirSync(join(dossier, nom), { recursive: true });
    const txt = `---\n${frontmatter}\n---\n\nCorps du skill.\n`;
    writeFileSync(join(dossier, nom, "SKILL.md"), crlf ? txt.replace(/\n/g, "\r\n") : txt);
  };
  const x = (n) => "x".repeat(n);
  const COURTS = join(T, "profil-a", "skills");
  skill(COURTS, "alpha", `name: alpha\ndescription: ${x(100)}`);
  skill(COURTS, "beta", `name: beta\ndescription: "${x(200)}"`);
  // description repliée sur deux lignes : 150 + une espace de pliage + 50 = 201 caractères
  skill(COURTS, "gamma", `name: gamma\ndescription: >\n  ${x(150)}\n  ${x(50)}`, true);
  const LONGS = join(T, "profil-b", "skills");
  skill(LONGS, "un", `name: un\ndescription: ${x(500)}`);
  skill(LONGS, "deux", `name: deux\ndescription: ${x(1100)}`);
  skill(LONGS, "trois", `name: trois\ndescription: ${x(300)}`);
  mkdirSync(join(LONGS, "sans-skill-md"), { recursive: true });
  mkdirSync(join(LONGS, "illisible"), { recursive: true });
  writeFileSync(join(LONGS, "illisible", "SKILL.md"), "pas de frontmatter ici\n");
  const hermetique = (...skills) => executer(["--transcripts", projet, "--referentiel", ref, ...skills.flatMap((s) => ["--skills", s])]);

  check("vert : la description se lit en ligne, entre guillemets, repliée (CRLF compris) ou littérale ; sans frontmatter, null", () => {
    const l = [descriptionDe("---\nname: a\ndescription: abc def\n---\n"), descriptionDe('---\ndescription: "entre guillemets"\n---\n'),
      descriptionDe("---\ndescription: >\n  deux\n  lignes\n---\n"), descriptionDe("---\r\ndescription: |-\r\n  une\r\n  autre\r\n---\r\n"), descriptionDe("rien")];
    if (JSON.stringify(l) !== JSON.stringify(["abc def", "entre guillemets", "deux lignes", "une\nautre", null])) throw new Error(JSON.stringify(l));
  });
  check("vert : un corpus aux descriptions courtes rend cumul, moyenne et maximum exacts, sans rien au-dessus du seuil ni les questions de revue", () => {
    const { rapport: r, sortie } = hermetique(COURTS);
    const c = r.descriptions_de_skills.corpus[0];
    if (c.skills !== 3 || c.cumul !== 501 || c.moyenne !== 167 || c.maximum.nom !== "gamma" || c.maximum.longueur !== 201) throw new Error(JSON.stringify(c));
    if (c.au_dela_du_seuil !== 0 || c.au_dela_du_plafond !== 0) throw new Error(JSON.stringify(c));
    if (!/descriptions de skills \(profil-a\/skills\) : 3 skill\(s\), 501 caractères au cumul, moyenne 167, maximum 201 \(gamma\) ; 0 au-dessus de 419 caractères \(0 %\)/.test(sortie)) throw new Error(sortie);
    if (/deux questions/.test(sortie)) throw new Error("les questions de revue sont rappelées sous le seuil");
  });
  check("rouge : un corpus de descriptions longues est nommé (2 au-dessus de 419, 1 au-dessus du plafond de 1 024) et rappelle les deux questions de revue ; exit 0", () => {
    const { code, rapport: r, sortie } = hermetique(LONGS);
    if (code !== 0) throw new Error(`exit ${code}`);
    const c = r.descriptions_de_skills.corpus[0];
    if (c.skills !== 3 || c.cumul !== 1900 || c.moyenne !== 633 || c.au_dela_du_seuil !== 2 || c.au_dela_du_plafond !== 1 || c.maximum.nom !== "deux") throw new Error(JSON.stringify(c));
    if (c.illisibles.join() !== "illisible") throw new Error(`illisibles ${c.illisibles}`);
    if (!/2 au-dessus de 419 caractères \(67 %\), 1 au-dessus du plafond d'import de 1 024 ; 1 sans description lisible/.test(sortie)) throw new Error(sortie);
    if (!/deux questions/.test(sortie) || !/1\. cette phrase change-t-elle le comportement par défaut/.test(sortie) || !/2\. dit-elle ce qu'il faut faire plutôt que ce qu'il faut éviter/.test(sortie)) throw new Error(sortie);
    if (r.ensemble.verdict !== "AVERT") throw new Error("le verdict du contexte des sessions a bougé : les descriptions n'y entrent pas");
  });
  check("vert : sans aucun dossier de skills lisible, le relevé le dit ; la référence mesurée le 2026-10-19 est citée", () => {
    const vide = hermetique(join(T, "n-existe-pas"));
    if (!/descriptions de skills : aucun dossier de skills lu/.test(vide.sortie)) throw new Error(vide.sortie);
    if (!/référence mesurée le 2026-10-19 par l'étude 20261019d : mattpocock\/skills \(38 skills\) moyenne 142, maximum 419/.test(hermetique(COURTS).sortie)) throw new Error("référence absente");
  });
  check("borne : un dossier de skills lié à un autre profil ne se compte qu'une fois", () => {
    const maison = join(T, "maison");
    mkdirSync(join(maison, ".claude", "skills"), { recursive: true });
    mkdirSync(join(maison, ".claude-b"), { recursive: true });
    try { symlinkSync(join(maison, ".claude", "skills"), join(maison, ".claude-b", "skills"), "junction"); } catch (e) { throw new Error(`lien impossible à créer : ${e.message}`); }
    mkdirSync(join(maison, ".claude-c", "skills"), { recursive: true });
    const d = dossiersSkillsParDefaut({}, maison);
    if (d.length !== 2) throw new Error(`${d.length} dossiers au lieu de 2 : ${d.join(" | ")}`);
  });
} finally { rmSync(T, { recursive: true, force: true }); }
console.log(`\nrelever-contexte-sessions (TF-1558) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
