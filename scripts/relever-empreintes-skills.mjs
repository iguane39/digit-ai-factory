#!/usr/bin/env node
/**
 * relever-empreintes-skills.mjs — UNE MONTÉE DE VERSION D'UN SKILL SE LIT CHEZ CELUI QUI LE
 * CONSOMME, PAS SEULEMENT CHEZ CELUI QUI LE PUBLIE (TF-0788, décision D-3 (a) du 03/09/2026).
 *
 * LE FAIT PAYÉ. Le 02/09, la section « dashboard » de la recette de forge-tests est passée de
 * vert à rouge entre deux exécutions SANS QU'UN OCTET AIT BOUGÉ dans son dépôt : un autre chantier
 * avait monté `digit-ai-page-html` de version sur le poste pendant la session (31 → 36 règles,
 * 14 → 18 familles de rendu). Côté producteur, `versions-livrees.json` était à jour et
 * `oracle-etat-forge` F1 vert ; côté consommateur, rien ne le disait — le même diagnostic
 * (« le verdict a changé sans que rien ne change ») se refaisait à la main. forge-tests a fermé
 * son volet local (TF-0786 : la recette consigne l'empreinte des oracles qu'elle joue). Ce
 * module ferme le volet TRANSVERSE : à l'ouverture du pilot comme d'un produit, l'empreinte de
 * CHAQUE skill installé est comparée à la dernière consignée, et l'écart est dit en une ligne.
 *
 * CE QU'IL MESURE : pour chaque dossier de `~/.claude/skills`, une empreinte sha256 du contenu
 * de tous ses fichiers (chemin relatif + octets), hors sidecars d'oracles, journaux d'usage et
 * artefacts d'atelier — mêmes exclusions qu'`oracle-skills`, pour ne pas crier sur un cache.
 * Pour le socle `digit-ai-page-html`, il recopie en plus l'identité PUBLIÉE par les oracles
 * eux-mêmes (`check_html.py --version-regles` : nombre de règles et empreinte ;
 * `render_page.py --familles` : nombre de familles) quand Python les rend — c'est ce que
 * forge-tests consigne, et deux consommateurs doivent nommer la même chose.
 *
 * CE QU'IL NE FAIT PAS : bloquer. Une montée de version est un fait à LIRE avant de juger un
 * verdict, pas une faute. Le journal (`.oracles/empreintes-skills.json`, état machine ignoré par
 * git comme `produits-au-demarrage.json`) est réécrit à chaque passage : la ligne rendue compare
 * toujours à l'ouverture précédente de CE poste.
 *
 * Usage :
 *   node scripts\relever-empreintes-skills.mjs [--json] [--skills <dossier>] [--journal <fichier>] [--sans-socle]
 * Sortie texte : une ligne par verdict — `premiere_consignation` · `inchange` · `change` (avec la
 * liste « skill ancienne → nouvelle ») · `absent` (dossier de skills introuvable). Exit 0 toujours :
 * ce relevé informe, il ne juge pas (R-29 : la décision de rejouer une recette reste humaine).
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");

// Mêmes exclusions qu'oracle-skills.mjs (TF-0065, TF-0306) : ce qui est régénéré ou journalisé
// n'est pas une version.
const EXCLU_FICHIER = [/[._]oracles[\w-]*\.jsonl?$/i, /^_routages-journal[\w-]*\.jsonl$/i, /\.bak(?:[-.]\w+)?$/i, /\.pyc$/i];
const EXCLU_DOSSIER = new Set(["__pycache__", ".venv", "node_modules", ".pytest_cache", ".oracles", ".git"]);

function fichiersDe(dossier) {
  const out = [];
  const marcher = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!EXCLU_DOSSIER.has(e.name)) marcher(p); continue; }
      if (EXCLU_FICHIER.some((re) => re.test(e.name))) continue;
      out.push(p);
    }
  };
  marcher(dossier);
  return out.sort();
}

/** Empreinte d'un skill : sha256 sur (chemin relatif, octets) de chaque fichier retenu, fins de ligne normalisées. */
export function empreinteSkill(dossier) {
  const h = createHash("sha256");
  const fichiers = fichiersDe(dossier);
  for (const f of fichiers) {
    h.update(relative(dossier, f).replaceAll("\\", "/") + "\0");
    h.update(readFileSync(f).toString("latin1").replaceAll("\r\n", "\n") + "\0");
  }
  return { empreinte: h.digest("hex").slice(0, 12), fichiers: fichiers.length };
}

/** Identité publiée par le socle digit-ai-page-html (ce que forge-tests consigne aussi). */
export function identiteSocle(dossierSkills) {
  const scripts = join(dossierSkills, "digit-ai-page-html", "scripts");
  const jouer = (script, drapeau) => {
    const p = join(scripts, script);
    if (!existsSync(p)) return { absent: "script non installé" };
    const r = spawnSync("python", [p, drapeau], { encoding: "utf8", timeout: 60000 });
    if (r.status !== 0) return { absent: `${drapeau} illisible (exit ${r.status})` };
    try { return JSON.parse(r.stdout); } catch { return { absent: `${drapeau} : sortie non JSON` }; }
  };
  const ch = jouer("check_html.py", "--version-regles");
  const rp = jouer("render_page.py", "--familles");
  return {
    check_html: ch.absent ? ch : { empreinte: ch.empreinte, regles: ch.nombre ?? (ch.regles || []).length },
    render_page: rp.absent ? rp : {
      empreinte: createHash("sha256").update(JSON.stringify(rp.familles || {}, Object.keys(rp.familles || {}).sort())).digest("hex").slice(0, 12),
      familles: Object.keys(rp.familles || {}).length,
    },
  };
}

/** Relève, compare au journal, réécrit le journal. Rend { verdict, changes[], releve, precedent }. */
export function relever({ dossierSkills, journal, avecSocle = true, maintenant = new Date().toISOString() }) {
  if (!existsSync(dossierSkills)) return { verdict: "absent", changes: [], message: `dossier des skills introuvable : ${dossierSkills}` };
  const skills = {};
  for (const e of readdirSync(dossierSkills, { withFileTypes: true })) {
    if (!e.isDirectory() || EXCLU_DOSSIER.has(e.name)) continue;
    skills[e.name] = empreinteSkill(join(dossierSkills, e.name));
  }
  const releve = { schema: "pilot/empreintes-skills@1", releve_le: maintenant, dossier: dossierSkills, skills };
  if (avecSocle) releve.socle = identiteSocle(dossierSkills);
  let precedent = null;
  if (existsSync(journal)) { try { precedent = JSON.parse(readFileSync(journal, "utf8")); } catch { precedent = null; } }
  const changes = [];
  if (precedent && precedent.skills) {
    for (const nom of new Set([...Object.keys(precedent.skills), ...Object.keys(skills)])) {
      const a = precedent.skills[nom], b = skills[nom];
      if (!a) changes.push({ skill: nom, de: null, vers: b.empreinte, quoi: "installé depuis le relevé précédent" });
      else if (!b) changes.push({ skill: nom, de: a.empreinte, vers: null, quoi: "retiré depuis le relevé précédent" });
      else if (a.empreinte !== b.empreinte) changes.push({ skill: nom, de: a.empreinte, vers: b.empreinte, quoi: `${a.fichiers} → ${b.fichiers} fichier(s)` });
    }
  }
  mkdirSync(dirname(journal), { recursive: true });
  writeFileSync(journal, JSON.stringify(releve, null, 1) + "\n", "utf8");
  const verdict = !precedent ? "premiere_consignation" : changes.length ? "change" : "inchange";
  return { verdict, changes, releve, precedent };
}

export function rendre(r) {
  if (r.verdict === "absent") return [`- skills installés : ${r.message} — rien n'est comparé`];
  const n = Object.keys(r.releve.skills).length;
  const socle = r.releve.socle && !r.releve.socle.check_html.absent
    ? ` ; socle digit-ai-page-html : check_html ${r.releve.socle.check_html.regles} règles (${r.releve.socle.check_html.empreinte})${r.releve.socle.render_page.absent ? "" : `, render_page ${r.releve.socle.render_page.familles} familles (${r.releve.socle.render_page.empreinte})`}`
    : "";
  if (r.verdict === "premiere_consignation") return [`- ${n} skill(s) installé(s), empreintes consignées pour la première fois sur ce poste${socle} — l'écart se lira à la prochaine ouverture`];
  if (r.verdict === "inchange") return [`- ${n} skill(s) installé(s), aucune montée de version depuis le relevé du ${r.precedent.releve_le}${socle}`];
  const lignes = [`- RÈGLES DU SOCLE CHANGÉES depuis le relevé du ${r.precedent.releve_le} — ${r.changes.length} skill(s) : ` +
    r.changes.map((c) => `${c.skill} ${c.de || "∅"} → ${c.vers || "∅"} (${c.quoi})`).join(" ; ") +
    ` — un verdict de recette qui change aujourd'hui peut venir de là, pas du dépôt jugé : relire la recette avec cette identité en main, rien n'est rejoué automatiquement${socle}`];
  const ps = r.precedent.socle, ns = r.releve.socle;
  if (ps && ns && ps.check_html && ns.check_html && ps.check_html.empreinte && ns.check_html.empreinte && ps.check_html.empreinte !== ns.check_html.empreinte) {
    lignes.push(`  - check_html : ${ps.check_html.regles} règles (${ps.check_html.empreinte}) → ${ns.check_html.regles} règles (${ns.check_html.empreinte})`);
  }
  return lignes;
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const r = relever({
    dossierSkills: val("--skills") || process.env.FORGE_SKILLS_INSTALLES || join(homedir(), ".claude", "skills"),
    journal: val("--journal") || join(PILOT, ".oracles", "empreintes-skills.json"),
    avecSocle: !args.includes("--sans-socle"),
  });
  if (args.includes("--json")) process.stdout.write(JSON.stringify({ verdict: r.verdict, changes: r.changes, releve_le: r.releve?.releve_le, precedent_le: r.precedent?.releve_le || null }, null, 1) + "\n");
  else process.stdout.write(rendre(r).join("\n") + "\n");
  process.exit(0);
}
