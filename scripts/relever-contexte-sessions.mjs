#!/usr/bin/env node
/**
 * relever-contexte-sessions.mjs — combien de contexte chaque tour RELIT, session par session (TF-1558, 13/10/2026).
 *
 * LE FAIT. Mesure du 01/10/2026 sur les journaux du pilot : une réponse Opus 5.5 relit en moyenne 473 039 jetons de
 * cache pour 1 339 générés, la latence médiane passe de 4,5 s sous 200 000 jetons à 6,3 s au-delà de 600 000, et
 * 3 sessions ont atteint le million (`output\03-etudes\20261001-etude-opportunite-saut-opus-5-5.md`). Le contexte
 * d'ouverture reste stable : c'est la LONGUEUR des sessions qui gonfle la relecture. La doctrine qui en découle (une
 * session neuve par mandat, un seuil de contexte déclaré : CONTRAT-INTERFACE.md §4 quater) est en avertissement ; ce
 * relevé la rend mesurable, sans rien écrire.
 *
 * CE QUI EST LU, en lecture seule. Les transcriptions de Claude Code (`<profil>\projects\<projet>\*.jsonl`) de chaque
 * profil `~\.claude*` du poste, modifiées dans la fenêtre (`--jours`, 14 par défaut), sous-agents à part. Une réponse
 * se compte une fois (dédoublonnée par `message.id`, la dernière ligne portant l'usage final). Son CONTEXTE RELU vaut
 * `input_tokens + cache_read_input_tokens + cache_creation_input_tokens`. Un TOUR commence à chaque message humain
 * (un message `user` qui n'est pas un résultat d'outil ni un retour de hook) ; le relu d'un tour est la somme du
 * contexte de ses réponses.
 *
 * CE QUI EST RENDU. Par session : réponses, tours, contexte à la première réponse (ouverture), contexte maximal, relu
 * total et relu moyen par tour, réponses au-delà du seuil, efforts servis (champ `effort` de la transcription). Pour
 * l'ensemble : la médiane et le 9e décile du contexte par réponse, et la part du relu portée par les réponses au-delà
 * du seuil. Le seuil se lit au référentiel (`references\MODELES-EN-SERVICE.json`, `sessions.seuil_contexte_jetons`),
 * ou `--seuil`.
 *
 * LES DESCRIPTIONS DE SKILLS (TF-1913, décision humaine D-41 (a) du 19/10/2026, étude
 * `output/03-etudes/20261019-etude-opportunite-packs-agents-skills-tiers.md`, option O3). Le contexte permanent d'un skill
 * est sa description : Claude Code pré-charge le nom et la description de CHAQUE skill installé dans le prompt système
 * (Anthropic, « Equipping agents for the real world with Agent Skills », 2025-10-16). Aucun relevé n'en donnait le cumul,
 * alors que le plafond de 1 024 caractères par skill (`DESCRIPTION_MAX` de quality-oracles) sert de cible : mesure du
 * 2026-10-19, 33 skills du poste, 29 553 caractères, moyenne 896 pour un maximum de 1 024, contre 154 en moyenne pour
 * Superpowers et 142 pour `mattpocock/skills`. Le relevé rend, par dossier de skills (`<profil>\skills\*\SKILL.md`,
 * chaque dossier réel compté une fois) : le nombre de skills, le cumul, la moyenne, le maximum, la part au-dessus de 419
 * caractères (le maximum de `mattpocock/skills`) et le nombre au-dessus du plafond d'import. Quand la moyenne dépasse
 * 419, il rappelle les deux questions de revue d'une description (REVUE_DESCRIPTION). Indicateur seul : il n'entre pas
 * dans le verdict.
 *
 * NON JUGÉ : la latence (les horodatages mêlent le temps des outils et celui de l'humain) ; le nombre de tâches
 * closes (un tour n'est pas une tâche) ; les transcriptions hors de la fenêtre ; l'effet d'une description courte sur
 * le déclenchement du skill ; la part des descriptions réellement chargée dans un sous-agent ; les skills des plugins
 * et des projets (seuls les dossiers `skills` des profils sont lus). Le verdict AVERT nomme les sessions
 * qui ont franchi le seuil : jamais un échec (exit 0), seule une entrée illisible rend 2.
 *
 * Usage : node scripts/relever-contexte-sessions.mjs [--transcripts <dossier>]... [--projet <motif>] [--jours <N>]
 *           [--seuil <jetons>] [--referentiel <fichier>] [--skills <dossier de skills>]... [--json]
 */
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

export const VERSION = "1.1.0";
const ICI = dirname(fileURLToPath(import.meta.url));
const REF_DEFAUT = join(ICI, "..", "references", "MODELES-EN-SERVICE.json");
const SEUIL_SECOURS = 400000;

/** Mesures de référence des descriptions de skills, relevées le 2026-10-19 par l'étude 20261019d (rapportées, non rejouées ici) : le maximum de `mattpocock/skills` sert de seuil. */
export const REFERENCE_DESCRIPTIONS = {
  seuil_caracteres: 419,
  plafond_import: 1024,
  mesure_le: "2026-10-19",
  source: "output/03-etudes/20261019-etude-opportunite-packs-agents-skills-tiers.md, section « Mesures sur le poste »",
  corpus: [
    { nom: "mattpocock/skills (38 skills)", moyenne: 142, maximum: 419 },
    { nom: "Superpowers 7.0.0 (15 skills)", moyenne: 154, maximum: 375 },
  ],
};
/**
 * Les deux tests de rédaction de Matt Pocock (`mattpocock/skills`, licence MIT, `skills/productivity/writing-for-agents/SKILL.md`,
 * sections « Pruning » et « Leading words », lu le 2026-10-19), repris comme questions de revue d'une description : l'idée seule,
 * aucun fichier du dépôt n'est installé.
 */
export const REVUE_DESCRIPTION = [
  "cette phrase change-t-elle le comportement par défaut de l'agent ? Sinon elle ne dit rien : supprimer la phrase entière, sans la rogner mot à mot",
  "dit-elle ce qu'il faut faire plutôt que ce qu'il faut éviter ? Une interdiction attire le comportement banni dans le contexte : énoncer le comportement visé",
];

const texteHumain = (m) => {
  if (!m) return "";
  if (typeof m.content === "string") return m.content;
  if (Array.isArray(m.content)) {
    if (m.content.some((b) => b && b.type === "tool_result")) return "";
    return m.content.filter((b) => b && b.type === "text").map((b) => b.text || "").join("\n");
  }
  return "";
};
const estTourHumain = (o) => {
  if (o.type !== "user" || o.isMeta) return false;
  const t = texteHumain(o.message).trim();
  return !!t && !/^Stop hook feedback:/.test(t) && !/^<(local-command|command-name|command-message|task-notification)/.test(t);
};

/** Une transcription (texte JSONL) → { reponses: [{ id, contexte, sortie, effort, modele, tour }], tours }. Pur. */
export function lireTranscription(jsonl) {
  const parId = new Map();
  let tour = 0;
  for (const ligne of String(jsonl).split("\n")) {
    if (!ligne.trim()) continue;
    let o; try { o = JSON.parse(ligne); } catch { continue; }
    if (estTourHumain(o)) { tour++; continue; }
    if (o.type !== "assistant" || !o.message || !o.message.usage) continue;
    const u = o.message.usage;
    const id = o.message.id || `${parId.size}`;
    if (String(o.message.model || "").startsWith("<")) continue;
    parId.set(id, {
      id, tour,
      contexte: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0),
      sortie: u.output_tokens || 0,
      effort: o.effort || null,
      modele: o.message.model || null,
    });
  }
  return { reponses: [...parId.values()], tours: tour };
}

const quantile = (xs, q) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1) + 0.5))]; };

/** Le relevé d'une session. Pur. */
export function releverSession(nom, lu, seuil) {
  const r = lu.reponses;
  const relu = r.reduce((s, x) => s + x.contexte, 0);
  const parTour = new Map();
  for (const x of r) parTour.set(x.tour, (parTour.get(x.tour) || 0) + x.contexte);
  const efforts = {};
  for (const x of r) if (x.effort) efforts[x.effort] = (efforts[x.effort] || 0) + 1;
  return {
    session: nom, reponses: r.length, tours: lu.tours,
    ouverture: r.length ? r[0].contexte : null,
    contexte_max: r.length ? Math.max(...r.map((x) => x.contexte)) : null,
    relu_total: relu,
    relu_moyen_par_tour: parTour.size ? Math.round(relu / parTour.size) : null,
    reponses_au_dela_du_seuil: r.filter((x) => x.contexte > seuil).length,
    relu_au_dela_du_seuil: r.filter((x) => x.contexte > seuil).reduce((s, x) => s + x.contexte, 0),
    efforts,
    modeles: [...new Set(r.map((x) => x.modele).filter(Boolean))],
  };
}

/** Le relevé d'ensemble, à partir des sessions déjà relevées et des contextes par réponse. Pur. */
export function synthese(sessions, contextes, seuil) {
  const relu = sessions.reduce((s, x) => s + x.relu_total, 0);
  const auDela = sessions.reduce((s, x) => s + x.relu_au_dela_du_seuil, 0);
  const franchies = sessions.filter((s) => s.reponses_au_dela_du_seuil > 0);
  return {
    seuil_contexte_jetons: seuil,
    sessions: sessions.length, reponses: contextes.length,
    contexte_median: quantile(contextes, 0.5), contexte_9e_decile: quantile(contextes, 0.9),
    relu_total: relu,
    part_du_relu_au_dela_du_seuil: relu ? auDela / relu : null,
    sessions_au_dela_du_seuil: franchies.length,
    verdict: franchies.length ? "AVERT" : "PASS",
  };
}

/** Dossiers de projets par défaut : `projects\*` de chaque profil `~\.claude*` (et CLAUDE_CONFIG_DIR). */
export function dossiersParDefaut(env = process.env, maison = homedir()) {
  const racines = new Set([env.CLAUDE_CONFIG_DIR].filter(Boolean));
  try { for (const e of readdirSync(maison, { withFileTypes: true })) if (e.isDirectory() && /^\.claude/.test(e.name)) racines.add(join(maison, e.name)); } catch { /* poste sans profil */ }
  const sortie = [];
  for (const r of racines) {
    const p = join(r, "projects");
    if (!existsSync(p)) continue;
    for (const d of readdirSync(p, { withFileTypes: true })) if (d.isDirectory()) sortie.push(join(p, d.name));
  }
  return sortie;
}

/** Transcriptions d'un dossier de projet : sessions (`*.jsonl` à la racine) et sous-agents (`<session>\subagents\*.jsonl`). */
function* transcriptions(dossier) {
  let entrees; try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    const p = join(dossier, e.name);
    if (e.isFile() && e.name.endsWith(".jsonl")) yield { fichier: p, sous_agent: false };
    else if (e.isDirectory()) {
      const s = join(p, "subagents");
      if (existsSync(s)) for (const f of readdirSync(s)) if (f.endsWith(".jsonl")) yield { fichier: join(s, f), sous_agent: true };
    }
  }
}

/** La description d'un SKILL.md (frontmatter YAML : en ligne, entre guillemets, repliée `>` ou littérale `|`), ou null. Pur. */
export function descriptionDe(texte) {
  const m = String(texte).replace(/\r\n/g, "\n").match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return null;
  const l = m[1].split("\n");
  for (let i = 0; i < l.length; i++) {
    const d = l[i].match(/^description:\s*(.*)$/);
    if (!d) continue;
    const v = d[1].trim();
    if (/^[>|]-?$/.test(v)) {
      const buf = [];
      for (let j = i + 1; j < l.length; j++) { if (/^\S/.test(l[j])) break; buf.push(l[j].trim()); }
      return buf.filter(Boolean).join(v[0] === "|" ? "\n" : " ");
    }
    return v.replace(/^["']|["']$/g, "");
  }
  return null;
}

/** Les skills d'un dossier de skills (`<dossier>\<skill>\SKILL.md`) : { nom, longueur } pour chaque description lue ; les illisibles à part. */
export function lireDescriptions(dossier) {
  const skills = [], illisibles = [];
  let entrees; try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return { skills, illisibles }; }
  for (const e of entrees) {
    const f = join(dossier, e.name, "SKILL.md");
    if (!existsSync(f)) continue;
    let d = null; try { d = descriptionDe(readFileSync(f, "utf8")); } catch { /* illisible */ }
    if (d === null) illisibles.push(e.name); else skills.push({ nom: e.name, longueur: d.length });
  }
  return { skills, illisibles };
}

/** Le relevé d'un corpus de descriptions : nombre, cumul, moyenne, maximum, part au-dessus du seuil et du plafond d'import. Pur. */
export function syntheseDescriptions(skills, seuil = REFERENCE_DESCRIPTIONS.seuil_caracteres, plafond = REFERENCE_DESCRIPTIONS.plafond_import) {
  const cumul = skills.reduce((s, x) => s + x.longueur, 0);
  const max = skills.reduce((m, x) => (m === null || x.longueur > m.longueur ? x : m), null);
  const au = skills.filter((x) => x.longueur > seuil).length;
  return {
    skills: skills.length, cumul,
    moyenne: skills.length ? Math.round(cumul / skills.length) : null,
    maximum: max ? { nom: max.nom, longueur: max.longueur } : null,
    seuil_caracteres: seuil, au_dela_du_seuil: au,
    part_au_dela_du_seuil: skills.length ? au / skills.length : null,
    plafond_import: plafond, au_dela_du_plafond: skills.filter((x) => x.longueur > plafond).length,
  };
}

/** Les dossiers `skills` des profils `~\.claude*` du poste (et CLAUDE_CONFIG_DIR), chaque dossier réel une seule fois (un lien vers un autre profil ne double pas le compte). */
export function dossiersSkillsParDefaut(env = process.env, maison = homedir()) {
  const racines = new Set([env.CLAUDE_CONFIG_DIR].filter(Boolean));
  try { for (const e of readdirSync(maison, { withFileTypes: true })) if (e.isDirectory() && /^\.claude/.test(e.name)) racines.add(join(maison, e.name)); } catch { /* poste sans profil */ }
  const vus = new Set(), sortie = [];
  for (const r of racines) {
    const s = join(r, "skills");
    if (!existsSync(s)) continue;
    let reel = s; try { reel = realpathSync(s); } catch { /* chemin tel quel */ }
    if (vus.has(reel.toLowerCase())) continue;
    vus.add(reel.toLowerCase());
    sortie.push(s);
  }
  return sortie;
}

/** Les lignes du relevé sur les descriptions de skills : un corpus par ligne, la référence, et les deux questions de revue si la moyenne dépasse le seuil. */
export function lignesDescriptions(corpus) {
  const n = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const R = REFERENCE_DESCRIPTIONS;
  if (!corpus.length) return ["  descriptions de skills : aucun dossier de skills lu"];
  const l = [];
  for (const c of corpus) {
    l.push(`  descriptions de skills (${c.nom}) : ${c.skills} skill(s), ${n(c.cumul)} caractères au cumul, moyenne ${c.moyenne ?? "—"}, maximum ${c.maximum ? `${n(c.maximum.longueur)} (${c.maximum.nom})` : "—"} ; `
      + `${c.au_dela_du_seuil} au-dessus de ${c.seuil_caracteres} caractères (${c.part_au_dela_du_seuil === null ? "—" : Math.round(c.part_au_dela_du_seuil * 100) + " %"}), ${c.au_dela_du_plafond} au-dessus du plafond d'import de ${n(c.plafond_import)}`
      + (c.illisibles.length ? ` ; ${c.illisibles.length} sans description lisible` : ""));
  }
  l.push(`  référence mesurée le ${R.mesure_le} par l'étude 20261019d : ${R.corpus.map((x) => `${x.nom} moyenne ${x.moyenne}, maximum ${x.maximum}`).join(" ; ")}`);
  if (corpus.some((c) => c.moyenne !== null && c.moyenne > R.seuil_caracteres)) {
    l.push(`  moyenne au-dessus de ${R.seuil_caracteres} caractères : à la revue d'une description, deux questions (Matt Pocock, mattpocock/skills, MIT) —`);
    REVUE_DESCRIPTION.forEach((q, i) => l.push(`    ${i + 1}. ${q}`));
  }
  return l;
}

export function lireSeuil(referentiel) {
  try { const j = JSON.parse(readFileSync(referentiel, "utf8")); const v = j.sessions && j.sessions.seuil_contexte_jetons; return Number.isFinite(v) && v > 0 ? v : null; } catch { return null; }
}

export function executer(argv, env = process.env) {
  const a = { transcripts: [], projet: null, jours: 14, seuil: null, referentiel: REF_DEFAUT, json: false, skills: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--transcripts") a.transcripts.push(val());
      else if (x === "--projet") a.projet = val().toLowerCase();
      else if (x === "--jours") a.jours = Number(val());
      else if (x === "--seuil") a.seuil = Number(val());
      else if (x === "--referentiel") a.referentiel = val();
      else if (x === "--skills") a.skills.push(val());
      else if (x === "--json") a.json = true;
      else return { code: 2, sortie: `relever-contexte-sessions : option inconnue : ${x}` };
    } catch (e) { return { code: 2, sortie: `relever-contexte-sessions : ${e.message}` }; }
  }
  if (!Number.isFinite(a.jours) || a.jours <= 0 || (a.seuil !== null && !(a.seuil > 0))) return { code: 2, sortie: "relever-contexte-sessions : --jours et --seuil attendent un nombre positif" };
  const seuilRef = lireSeuil(a.referentiel);
  const seuil = a.seuil || seuilRef || SEUIL_SECOURS;
  const provenance = a.seuil ? "--seuil" : seuilRef ? "référentiel" : "valeur de secours du script";
  let dossiers = a.transcripts.length ? a.transcripts : dossiersParDefaut(env);
  if (a.projet) dossiers = dossiers.filter((d) => basename(d).toLowerCase().includes(a.projet));
  const limite = Date.now() - a.jours * 86400000;
  const sessions = [];
  const agents = [];
  const contextes = [];
  for (const d of dossiers) for (const t of transcriptions(d)) {
    let st; try { st = statSync(t.fichier); } catch { continue; }
    if (st.mtimeMs < limite) continue;
    const lu = lireTranscription(readFileSync(t.fichier, "utf8"));
    if (!lu.reponses.length) continue;
    const nom = `${basename(d)}/${t.sous_agent ? `${basename(dirname(dirname(t.fichier))).slice(0, 8)}/${basename(t.fichier, ".jsonl")}` : basename(t.fichier, ".jsonl").slice(0, 8)}`;
    const r = releverSession(nom, lu, seuil);
    r.date = new Date(st.mtimeMs).toISOString().slice(0, 10);
    (t.sous_agent ? agents : sessions).push(r);
    if (!t.sous_agent) contextes.push(...lu.reponses.map((x) => x.contexte));
  }
  const ensemble = synthese(sessions, contextes, seuil);
  const corpusSkills = (a.skills.length ? a.skills : dossiersSkillsParDefaut(env)).map((d) => {
    const lu = lireDescriptions(d);
    return { dossier: d, nom: `${basename(dirname(d))}/${basename(d)}`, ...syntheseDescriptions(lu.skills), illisibles: lu.illisibles };
  }).filter((c) => c.skills || c.illisibles.length);
  const rapport = { outil: "relever-contexte-sessions", version: VERSION, fenetre_jours: a.jours, seuil_provenance: provenance, dossiers: dossiers.length, ensemble, sessions: sessions.sort((x, y) => y.contexte_max - x.contexte_max), sous_agents: { nombre: agents.length, au_dela_du_seuil: agents.filter((x) => x.reponses_au_dela_du_seuil).length }, descriptions_de_skills: { reference: REFERENCE_DESCRIPTIONS, questions_de_revue: REVUE_DESCRIPTION, corpus: corpusSkills }, non_juge: ["la latence", "le nombre de tâches closes : un tour n'est pas une tâche", "les transcriptions hors de la fenêtre", "l'effet d'une description courte sur le déclenchement d'un skill", "la part des descriptions réellement chargée dans un sous-agent", "les skills des plugins et des projets : seuls les dossiers skills des profils sont lus"] };
  if (a.json) return { code: 0, sortie: JSON.stringify(rapport, null, 1), rapport };
  const k = (n) => (n === null ? "—" : `${Math.round(n / 1000)} k`);
  const lignes = [
    `relever-contexte-sessions ${VERSION} — ${ensemble.sessions} session(s), ${ensemble.reponses} réponse(s) sur ${a.jours} jour(s), seuil ${k(seuil)} jetons (${provenance})`,
    `  contexte relu par réponse : médiane ${k(ensemble.contexte_median)}, 9e décile ${k(ensemble.contexte_9e_decile)} ; relu total ${k(ensemble.relu_total)}, dont ${ensemble.part_du_relu_au_dela_du_seuil === null ? "—" : Math.round(ensemble.part_du_relu_au_dela_du_seuil * 100) + " %"} au-delà du seuil`,
    `  verdict : ${ensemble.verdict} — ${ensemble.sessions_au_dela_du_seuil} session(s) au-delà du seuil ; sous-agents : ${agents.length}, dont ${rapport.sous_agents.au_dela_du_seuil} au-delà`,
  ];
  for (const s of rapport.sessions.filter((x) => x.reponses_au_dela_du_seuil).slice(0, 15)) lignes.push(`  [AVERT] ${s.session} (${s.date}) : ${s.tours} tour(s), ${s.reponses} réponse(s), ouverture ${k(s.ouverture)}, max ${k(s.contexte_max)}, ${k(s.relu_moyen_par_tour)} relus par tour, ${s.reponses_au_dela_du_seuil} réponse(s) au-delà`);
  const restantes = rapport.sessions.filter((x) => x.reponses_au_dela_du_seuil).length - 15;
  if (restantes > 0) lignes.push(`  … et ${restantes} autre(s) session(s) au-delà du seuil (liste complète : --json)`);
  lignes.push(...lignesDescriptions(corpusSkills));
  return { code: 0, sortie: lignes.join("\n"), rapport };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  console.log(r.sortie);
  process.exit(r.code);
}
