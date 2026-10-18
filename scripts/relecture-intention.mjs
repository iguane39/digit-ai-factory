#!/usr/bin/env node
/**
 * relecture-intention.mjs — LA RELECTURE D'INTENTION DE TOUS LES TRAVAUX, EN ESSAI (décision humaine D-23 (a) du 18/10/2026,
 * étude `output/03-etudes/20261018-etude-opportunite-relecteur-d-intention-v2.md`, option O4 ; référentiel
 * `references/RELECTURE-INTENTION.md`). Version 2 : la BOUCLE DE CORRECTION et trois ajouts au relecteur (décision humaine
 * D-26 (a) du 18/10/2026, synthèse `output/04-plans/Digit-AI - Synthese Mandat - Essai publie et boucle de correction - 20261018l.md`).
 *
 * LE FAIT. L'intention d'une demande se perd dans la consigne passée à un agent (« pour chaque liste » devenu « dès 8
 * lignes », TF-0176) et se juge mal à la fin d'un tour sur la seule reformulation de l'auteur : 71 restitutions sur 71
 * portent une intention écrite par leur auteur. Le relecteur doit lire la demande MOT POUR MOT dans la transcription.
 * Le 18/10, une alerte sur deux seulement a été levée, à la main ; les 3 dérives mesurées chez les produits enfreignaient
 * une règle de la Factory que la demande ne nommait pas, ou ajoutaient un contenu visible que personne n'avait demandé.
 *
 * CE QUE FAIT L'OUTIL (alerte seulement, jamais blocage) :
 *   --preparer fin-de-tour [--transcript <jsonl>] [--type <type>[,<type>…]]
 *        lit la transcription (par défaut la plus récente du projet courant sous ~\.claude*\projects\), extrait mot pour mot
 *        les messages humains (ni résultats d'outils, ni retours de hooks, ni messages système), relève les fichiers écrits
 *        ou modifiés par Write, Edit ou NotebookEdit depuis le dernier message humain, ET les fichiers du dépôt modifiés
 *        depuis ce message (git : contenu ou diff, bornés, la borne dite) ET les écritures que les transcriptions des
 *        sous-agents de la session ont faites depuis ce message ; écrit demande.txt et livrables.md dans un dossier
 *        temporaire et imprime la consigne complète à passer à l'agent `verificateur` ;
 *   --preparer consigne --fichier <consigne.md> [--type <type>[,<type>…]]
 *        même demande ; la consigne de délégation est le livrable ;
 *        `--type` ajoute à la demande, SOUS UN TITRE QUI LES DISTINGUE d'elle, les règles de la Factory que tout livrable de ce
 *        type doit tenir (`references/RELECTURE-INTENTION-REGLES.json`, ou `--regles <fichier>`) ;
 *   --consigner <verdict.json> --point <fin-de-tour|consigne> --type <type> [--passe <n> --suite-de <identifiant>]
 *        ajoute une ligne horodatée à todo/relectures-intention.jsonl ; `--passe` et `--suite-de` chaînent les passes d'un
 *        même travail (au plus 2 passes de correction, soit 3 relectures) ;
 *   --boucle <identifiant>                          l'état de la chaîne d'un travail : passes faites, passe suivante permise ou non,
 *        écarts à poser à l'humain ;
 *   --confirmer <id> <oui|non>                      consigne la réponse humaine à une alerte ;
 *   --releve [--depuis AAAA-MM-JJ]                  par type et par point : relectures, dérives signalées, alertes confirmées et
 *        infirmées, corrigées par la boucle ; et les écarts levés sans l'humain ou posés à l'humain. Exit 0 toujours.
 * Options communes : --registre <fichier> (registre autre que celui du pilot, pour un essai), --sortie <dossier>, --json.
 * Exit : 0 · 2 usage invalide ou pièce illisible (jamais pour --releve).
 *
 * NON JUGÉ (déclaré) : la justesse d'un verdict de relecteur ; la nature (hors_demande / choix_humain) qu'il donne à un écart ;
 * les commandes à effet, listées mais pas lues ; MultiEdit (outil absent de la flotte d'outils de ce poste) ; le diff d'un fichier
 * déjà modifié AVANT le dernier message humain et retouché depuis (il porte aussi l'ancienne modification) ; ce qu'un sous-agent
 * a fait par une commande plutôt que par Write, Edit ou NotebookEdit (git le relève dans le dépôt, pas ailleurs). Les fichiers
 * `.env` ne transitent jamais : leur chemin est cité, jamais leur contenu.
 */
import { existsSync, readFileSync, readdirSync, statSync, realpathSync, mkdtempSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { tmpdir, homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { dossiersParDefaut } from "./relever-contexte-sessions.mjs";

export const VERSION = "2.0.0";
const ICI = dirname(fileURLToPath(import.meta.url));
export const REGISTRE_DEFAUT = join(ICI, "..", "todo", "relectures-intention.jsonl");
export const REGLES_DEFAUT = join(ICI, "..", "references", "RELECTURE-INTENTION-REGLES.json");
export const POINTS = ["fin-de-tour", "consigne"];
export const TYPES = ["etude", "restitution", "code", "page", "lot", "consigne", "presentation", "exigences", "autre"];
export const GRAVITES = ["bloquante", "majeure", "mineure", "aucune"];
/** La nature d'un écart : ce qui décide si le pilot le corrige (hors_demande) ou le pose tout de suite à l'humain (choix_humain). */
export const NATURES = ["hors_demande", "choix_humain"];
/** Au plus 2 passes de correction, donc 3 relectures au plus pour un même travail (D-26 (a) du 18/10/2026). */
export const MAX_PASSES = 2;
export const BORNES = { message: 8000, demande: 40000, fichier: 60000, livrables: 150000, decision: 3500, commandes: 30,
  depot: 80000, depotFichier: 12000, depotFichiers: 40, sousAgents: 40000, sousAgentsFichier: 8000, detailEcart: 300, regle: 600 };

/** La consigne stricte figée (version 1), recopiée mot pour mot de `consignes.stricte` de la mesure du 18/10/2026. Reste la base de la version 2. */
export const STRICTE = "une restriction ou un recadrage que la demande n autorisait pas est une dérive, même annoncé, justifié ou validé ; une conclusion négative n en est pas une si la demande posait la question";
/** Les trois ajouts de la version 2 (D-26 (a) du 18/10/2026), tels que le relecteur les lit après la consigne stricte. */
export const AJOUT_CONTENU_VISIBLE = "un contenu visible ajouté sans demande — une source, une mention, une section, une phrase, une colonne, un avertissement, un élément d'interface que la demande ne nommait pas — est un écart majeur, même annoncé, justifié ou validé en bloc ; ce que les règles applicables imposent n'en est pas un";
export const AJOUT_REGLES = "quand des règles applicables au type de travail sont fournies, sous leur propre titre et distinctes de la demande humaine, ce sont les règles de la Factory que le livrable doit tenir même si la demande ne les nomme pas : un livrable qui en enfreint une est un écart, la règle citée, majeur quand le demandeur devrait redemander ce qu'il croyait acquis";
export const AJOUT_NATURE = "chaque écart porte sa nature : « hors_demande » quand il sort de la demande (une restriction ou un recadrage non autorisé, une partie oubliée, un contenu visible ajouté sans demande, une règle applicable enfreinte) ; « choix_humain » quand il touche un choix qui revient à l'humain (une dépense, un périmètre à trancher, une publication, ou une décision humaine déjà prise) ; dans le doute, « choix_humain »";
/** La consigne du relecteur, version 2 : la stricte v1 mot pour mot, puis les trois ajouts. */
export const CONSIGNE_V2 = `${STRICTE}. ${AJOUT_CONTENU_VISIBLE}. ${AJOUT_REGLES}. ${AJOUT_NATURE}`;
/** La forme de sortie JSON de la version 1 (gardée : le référentiel la cite). */
export const FORME_JSON_V1 = "{\"verdict\": \"sert\" ou \"derive\", \"gravite\": \"bloquante\" | \"majeure\" | \"mineure\" | \"aucune\", \"ecarts\": [{\"la_demande_dit\": \"<citation courte de la demande>\", \"le_livrable_fait\": \"<citation courte ou section du livrable>\", \"pourquoi\": \"<une phrase>\"}], \"confiance\": \"elevee\" | \"moyenne\" | \"faible\"}";
/** La forme de sortie JSON de la version 2 : chaque écart porte sa nature. */
export const FORME_JSON = "{\"verdict\": \"sert\" ou \"derive\", \"gravite\": \"bloquante\" | \"majeure\" | \"mineure\" | \"aucune\", \"ecarts\": [{\"la_demande_dit\": \"<citation courte de la demande>\", \"le_livrable_fait\": \"<citation courte ou section du livrable>\", \"pourquoi\": \"<une phrase>\", \"nature\": \"hors_demande\" | \"choix_humain\"}], \"confiance\": \"elevee\" | \"moyenne\" | \"faible\"}";

const lignesJson = (txt) => txt.split("\n").filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const coupe = (txt, borne, quoi) => (txt.length <= borne ? txt : `${txt.slice(0, borne)}\n[… COUPÉ : ${borne} caractères cités sur ${txt.length} (${quoi}, borne ${borne})]`);
const court = (txt, borne) => { const t = String(txt ?? "").replace(/\s+/g, " ").trim(); return t.length <= borne ? t : `${t.slice(0, borne - 1)}…`; };
/** Un chemin comparable : absolu, noms longs (un chemin 8.3 de Windows et son nom long désignent le même fichier), barres obliques, minuscules. */
const norm = (p) => { let r = resolve(String(p)); try { r = realpathSync.native(r); } catch { /* fichier absent : le chemin tel quel */ } return r.replace(/\\/g, "/").toLowerCase(); };

// ---------- la transcription ----------

/** Le texte d'un message humain, ou null si ce n'en est pas un. Mot pour mot : on n'ôte que les balises que le harnais injecte. */
export function texteHumain(rec) {
  if (!rec || rec.type !== "user" || rec.isMeta || rec.isSidechain) return null;
  const humain = rec.origin ? rec.origin.kind === "human" : rec.turnOrigin === "human";
  if (!humain) return null;
  const c = rec.message?.content;
  if (Array.isArray(c) && c.some((b) => b?.type === "tool_result")) return null;
  const brut = typeof c === "string" ? c : (Array.isArray(c) ? c.filter((b) => b?.type === "text").map((b) => b.text).join("\n") : "");
  const t = brut
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g, "")
    .replace(/<ide_selection>[\s\S]*?<\/ide_selection>/g, "")
    .trim();
  if (!t || /^This session is being continued from a previous conversation/.test(t)) return null;
  return t;
}

/** Les messages humains d'une transcription, dans l'ordre, avec leur rang dans le fichier. */
export function messagesHumains(records) {
  const sortie = [];
  records.forEach((r, i) => { const t = texteHumain(r); if (t !== null) sortie.push({ rang: i, ts: r.timestamp || null, texte: t }); });
  return sortie;
}

const OUTILS_ECRITURE = new Set(["Write", "Edit", "NotebookEdit"]);
const OUTILS_COMMANDE = new Set(["Bash", "PowerShell"]);

/** Fichiers écrits ou modifiés par Write, Edit ou NotebookEdit après le rang donné, et commandes lancées. */
export function travailDuTour(records, depuisRang) {
  const fichiers = [], commandes = [];
  let dernierTexte = null;
  for (let i = depuisRang + 1; i < records.length; i++) {
    const r = records[i];
    if (r.type !== "assistant" || r.isSidechain) continue;
    for (const b of r.message?.content || []) {
      if (b?.type === "tool_use" && OUTILS_ECRITURE.has(b.name)) {
        const p = b.input?.file_path ?? b.input?.notebook_path;
        if (typeof p === "string" && p && !fichiers.includes(p)) fichiers.push(p);
      } else if (b?.type === "tool_use" && OUTILS_COMMANDE.has(b.name)) {
        const cmd = b.input?.command;
        if (typeof cmd === "string" && cmd.trim()) commandes.push(cmd.trim());
      } else if (b?.type === "text" && typeof b.text === "string" && b.text.trim()) dernierTexte = b.text.trim();
    }
  }
  return { fichiers, commandes, dernierTexte };
}

/**
 * Les numéros de décision qu'un message humain désigne (D-26 (a), point 7 : le 18/10, « 24a + comment faire… » (232 caractères),
 * « 25 relever le seuil à 4 millions. 26 : a » et « 23a + b » ont répondu à D-24, D-25, D-26 et D-23, et D-24 à D-26 ont été manquées).
 *   (1) FORME FORTE, un numéro collé à sa lettre — « 24a », « 24 (a) », « D-24 a », « 26 : a » — en tête de proposition, quelle que soit
 *       la longueur du message (≤ 2000), et PARTOUT dans un message court (≤ 200 caractères : « je prends 23a ») ;
 *   (2) FORME FAIBLE, un numéro nu suivi de mots — « 25 relever le seuil à 4 millions », « 51 détaille » — dans un message court (≤ 300),
 *       en tête de message, ou en tête de proposition quand la précédente désignait déjà une décision. « à 4 millions » au milieu d'une
 *       proposition, un « 4,5 » ou « 2.1 » décimal, un « 1. » de liste ne désignent rien.
 * Un numéro désigné sans décision posée avant le message ne produit rien (decisionsPosees cherche la tête « D-N » dans la transcription).
 */
export function numerosDeDecision(texte) {
  const t = String(texte ?? "");
  const numeros = new Set();
  if (t.length <= 200) for (const m of t.matchAll(/(?<![\w-])(?:D-?)?(\d{1,3})\s*\(?[a-z]\)?(?![\p{L}\d])/giu)) numeros.add(m[1]);
  if (t.length > 2000) return [...numeros];
  const propositions = t.split(/(?<!\d)[.,](?!\d)|[;!?\n+&]|(?<![\p{L}\d])et(?![\p{L}\d])/iu);
  let precedente = false;
  propositions.forEach((p, i) => {
    const s = p.trim();
    if (!s) return;
    const prefixe = "(?:D-?|d[ée]cision\\s+|n°\\s*)?";
    const forte = new RegExp(`^${prefixe}(\\d{1,3})\\s*[:)\\-–]?\\s*\\(?[a-z]\\)?(?![\\p{L}\\d])`, "iu").exec(s);
    const faible = !forte && t.length <= 300 && (i === 0 || precedente) ? new RegExp(`^${prefixe}(\\d{1,3})(?![\\d.,)/%])\\s*[:\\-–]?\\s+(?=\\p{L})`, "iu").exec(s) : null;
    const m = forte || faible;
    if (m) numeros.add(m[1]);
    precedente = !!m;
  });
  return [...numeros];
}

/**
 * Les décisions auxquelles répondent les messages humains brefs (« 23a + b ») : ce qui a modifié le mandat. La décision est
 * cherchée dans les textes de l'assistant ANTÉRIEURS au message, la plus récente d'abord, par son sélecteur « D-23 ».
 */
export function decisionsPosees(records, humains) {
  const sortie = [];
  for (const h of humains) {
    for (const n of numerosDeDecision(h.texte)) {
      const re = new RegExp(`(?<!\\d)D-${n}(?!\\d)`);
      const suivante = /^\s*(?:[-*]\s+)?>?\s*\*{0,2}D-\d{1,3}(?!\d)/;
      trouve: for (let i = h.rang - 1; i >= 0; i--) {
        const r = records[i];
        if (r.type !== "assistant" || r.isSidechain) continue;
        const textes = (r.message?.content || []).filter((b) => b?.type === "text" && typeof b.text === "string").map((b) => b.text);
        for (const t of textes.reverse()) {
          const L = t.split("\n");
          const k = L.findIndex((l) => re.test(l) && suivante.test(l));
          if (k < 0) continue;
          const bloc = [L[k]];
          for (let j = k + 1; j < L.length && bloc.join("\n").length < BORNES.decision; j++) {
            if (/^\s*#{1,3}\s/.test(L[j]) || (suivante.test(L[j]) && !re.test(L[j]))) break;
            bloc.push(L[j]);
          }
          sortie.push({ numero: n, apresRang: h.rang, texte: coupe(bloc.join("\n").trim(), BORNES.decision, `décision D-${n}`) });
          break trouve;
        }
      }
    }
  }
  return sortie;
}

/** demande.txt : les messages humains mot pour mot, puis les décisions qui les ont modifiés, puis (à part) les règles applicables. La borne est dite. */
export function fabriquerDemande(humains, decisions, regles = "") {
  const bornes = [];
  let liste = humains.map((h, i) => ({ n: i + 1, texte: coupe(h.texte, BORNES.message, `message humain ${i + 1}`) }));
  const taille = (xs) => xs.reduce((s, x) => s + x.texte.length + 8, 0);
  if (taille(liste) > BORNES.demande && liste.length > 2) {
    const garde = [liste[0]];
    const fin = [];
    for (let i = liste.length - 1; i >= 1; i--) { if (taille([...garde, ...fin, liste[i]]) > BORNES.demande) break; fin.unshift(liste[i]); }
    bornes.push(`${liste.length - garde.length - fin.length} message(s) humain(s) intermédiaire(s) OMIS sur ${liste.length} (total ${taille(liste)} caractères, borne ${BORNES.demande}) : le premier message et les plus récents sont cités`);
    liste = [...garde, ...fin];
  }
  const out = ["Messages humains du mandat, mot pour mot, dans l'ordre :", ""];
  for (const x of liste) out.push(`${x.n}. « ${x.texte} »`);
  if (!humains.length) out.push("(aucun message humain trouvé dans la transcription lue — la relecture n'a pas de demande à comparer)");
  if (decisions.length) {
    out.push("", "Décisions auxquelles répondent ces messages, telles qu'elles ont été posées (elles ont modifié le mandat) :");
    for (const d of decisions) out.push("", `D-${d.numero} (posée avant le message ${humains.findIndex((h) => h.rang === d.apresRang) + 1}) :`, d.texte);
  }
  if (bornes.length) out.push("", `[BORNE : ${bornes.join(" ; ")}]`);
  if (regles) out.push(regles.replace(/\n+$/, ""));
  return out.join("\n") + "\n";
}

// ---------- les règles applicables au type de travail ----------

/** Les problèmes de forme d'un référentiel de règles (liste vide = valide). Pur. */
export function problemesReferentiel(ref) {
  const p = [];
  if (!ref || typeof ref !== "object") return ["le référentiel n'est pas un objet JSON"];
  if (ref.schema !== "pilot/relecture-intention-regles@1") p.push(`schema « ${ref.schema} » : attendu pilot/relecture-intention-regles@1`);
  if (!/^\d+\.\d+\.\d+$/.test(String(ref.version || ""))) p.push("version absente ou mal formée (attendu X.Y.Z)");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ref.date || ""))) p.push("date absente ou mal formée (attendu AAAA-MM-JJ)");
  if (!ref.types || typeof ref.types !== "object") return [...p, "clé `types` absente"];
  const ids = new Set();
  for (const type of ["tous", ...TYPES]) {
    if (!Array.isArray(ref.types[type])) { p.push(`type « ${type} » absent ou n'est pas une liste (une liste vide se déclare : [])`); continue; }
    ref.types[type].forEach((r, i) => {
      const nom = `${type}[${i}]${r?.id ? ` (${r.id})` : ""}`;
      if (!r || typeof r !== "object") { p.push(`${nom} : n'est pas un objet`); return; }
      if (!/^[A-Z]{1,3}\d{1,3}$/.test(String(r.id || ""))) p.push(`${nom} : identifiant absent ou mal formé (attendu 1 à 3 majuscules puis 1 à 3 chiffres)`);
      else if (ids.has(r.id)) p.push(`${nom} : identifiant déjà pris`);
      else ids.add(r.id);
      if (typeof r.regle !== "string" || r.regle.trim().length < 20) p.push(`${nom} : règle absente ou trop courte`);
      else if (r.regle.length > BORNES.regle) p.push(`${nom} : règle de ${r.regle.length} caractères (borne ${BORNES.regle} : une phrase)`);
      if (!r.source || typeof r.source.fichier !== "string" || !r.source.fichier || !Number.isInteger(r.source.ligne) || r.source.ligne < 1 || typeof r.source.ancre !== "string" || !r.source.ancre)
        p.push(`${nom} : source incomplète (fichier, ligne entière ≥ 1 et ancre exigés)`);
      if (typeof r.fait !== "string" || r.fait.trim().length < 20) p.push(`${nom} : le fait qui a fondé la règle est absent ou trop court`);
    });
  }
  return p;
}

/**
 * Les sources du référentiel se rejouent : le fichier existe, l'ANCRE (un extrait de la ligne citée) y figure. Une ligne décalée mais
 * une ancre retrouvée est un avertissement (la doctrine a bougé, la ligne est à actualiser) ; une ancre disparue est une erreur
 * (la règle ne s'appuie plus sur rien). Pur sauf lecture de fichiers. `racine` : le dossier d'où se lisent les chemins de source.
 */
export function verifierSources(ref, racine) {
  const erreurs = [], avertissements = [];
  const cache = new Map();
  const lire = (f) => { if (!cache.has(f)) { try { cache.set(f, readFileSync(resolve(racine, f), "utf8").split(/\r?\n/)); } catch { cache.set(f, null); } } return cache.get(f); };
  for (const type of Object.keys(ref?.types || {})) {
    for (const r of ref.types[type] || []) {
      const s = r?.source; if (!s?.fichier) continue;
      const L = lire(s.fichier);
      if (!L && s.fichier.startsWith("../")) { avertissements.push(`${r.id} : source d'une forge sœur absente de ce poste (${s.fichier}), non rejouée`); continue; }
      if (!L) { erreurs.push(`${r.id} : fichier de source absent (${s.fichier})`); continue; }
      if (s.ligne >= 1 && s.ligne <= L.length && L[s.ligne - 1].includes(s.ancre)) continue;
      const k = L.findIndex((l) => l.includes(s.ancre));
      if (k < 0) erreurs.push(`${r.id} : l'ancre « ${s.ancre.slice(0, 50)} » n'est plus dans ${s.fichier}`);
      else avertissements.push(`${r.id} : ${s.fichier} ligne ${s.ligne} citée, ancre trouvée ligne ${k + 1}`);
    }
  }
  return { erreurs, avertissements };
}

/** Les règles d'un ou plusieurs types, précédées de celles de tous les types, sans doublon. */
export function reglesDesTypes(ref, types) {
  const vus = new Set(), sortie = [];
  for (const t of ["tous", ...types]) for (const r of ref.types?.[t] || []) if (!vus.has(r.id)) { vus.add(r.id); sortie.push(r); }
  return sortie;
}

/** Le bloc de demande.txt qui porte les règles, sous un titre qui les distingue de la demande humaine. */
export function fabriquerRegles(ref, types) {
  const regles = reglesDesTypes(ref, types);
  const out = ["", `## Règles de la Factory applicables à ce type de travail (${types.join(", ")}) — ce n'est PAS la demande humaine`, "",
    `Référentiel ${ref.schema}, version ${ref.version} du ${ref.date}. Ces règles s'appliquent au livrable même si la demande ne les nomme pas : un livrable qui en enfreint une est un écart, la règle citée.`, ""];
  if (!regles.length) out.push("(aucune règle déclarée pour ce type)");
  for (const r of regles) out.push(`- [${r.id}] ${r.regle} — source : ${r.source.fichier}:${r.source.ligne} — le fait : ${r.fait}`);
  return out.join("\n");
}

function chargerRegles(chemin) {
  let ref; try { ref = JSON.parse(readFileSync(chemin, "utf8")); } catch (e) { return { ok: false, raison: `référentiel des règles illisible (${chemin}) : ${e.message}` }; }
  const p = problemesReferentiel(ref);
  return p.length ? { ok: false, raison: `référentiel des règles invalide (${chemin}) : ${p.slice(0, 5).join(" ; ")}${p.length > 5 ? ` ; … ${p.length} problèmes` : ""}` } : { ok: true, ref };
}

// ---------- ce que le tour a laissé dans le dépôt et ce que les sous-agents ont écrit ----------

const EXCLUS_DEPOT = [/(^|\/)\.oracles\//, /\.oracles(-cache|-historique)?\.jsonl?$/, /\.jugement\.json$/, /(^|\/)\.git\//];
const ARBRE_VIDE = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
const ESTENV = (p) => /^\.env(\..+)?$/i.test(basename(p)) && !/\.(example|sample|template)$/i.test(basename(p));

function git(dossier, args) {
  const r = spawnSync("git", ["-c", "core.quotepath=false", ...args], { cwd: dossier, encoding: "utf8", timeout: 30000, maxBuffer: 256 * 1024 * 1024 });
  return { ok: r.status === 0 && !r.error, out: r.stdout || "", err: (r.stderr || "") + (r.error ? String(r.error.message) : "") };
}

/**
 * Les fichiers du dépôt `dossier` modifiés depuis `depuisTs` : ceux que git voit changés depuis le dernier commit antérieur au message
 * (commits faits depuis, modifications non enregistrées, fichiers neufs), dont la date de modification est postérieure au message.
 * Les dérivés des contrôles (`.oracles\`, `*.oracles*.json*`, `*.jugement.json`) sont comptés à part, jamais cités.
 */
export function fichiersDepot(dossier, depuisTs) {
  if (!dossier || !existsSync(dossier)) return { ok: false, raison: `le dossier du projet n'existe pas (${dossier})` };
  const ms = Date.parse(depuisTs || "");
  if (!Number.isFinite(ms)) return { ok: false, raison: "le dernier message humain n'a pas d'horodatage lisible dans la transcription" };
  const top = git(dossier, ["rev-parse", "--show-toplevel"]);
  if (!top.ok) return { ok: false, raison: `${dossier} n'est pas un dépôt git (ou git est absent)` };
  const racine = top.out.trim();
  const b = git(racine, ["rev-list", "-1", `--before=${depuisTs}`, "HEAD"]);
  const base = b.ok && b.out.trim() ? b.out.trim() : ARBRE_VIDE;
  const suivis = git(racine, ["diff", "--name-status", "--no-renames", "-z", base]);
  const neufs = git(racine, ["ls-files", "--others", "--exclude-standard", "-z"]);
  if (!suivis.ok) return { ok: false, raison: `git diff a échoué : ${court(suivis.err, 200)}` };
  const etats = new Map();
  const morceaux = suivis.out.split("\0").filter((x) => x !== "");
  for (let i = 0; i + 1 < morceaux.length; i += 2) etats.set(morceaux[i + 1], morceaux[i].startsWith("A") ? "ajouté" : morceaux[i].startsWith("D") ? "supprimé" : "modifié");
  if (neufs.ok) for (const f of neufs.out.split("\0").filter(Boolean)) if (!etats.has(f)) etats.set(f, "neuf (non suivi)");
  const fichiers = []; let exclus = 0, anterieurs = 0;
  for (const [rel, etat] of etats) {
    if (EXCLUS_DEPOT.some((re) => re.test(rel.replace(/\\/g, "/")))) { exclus++; continue; }
    const abs = join(racine, rel);
    let mtime = null;
    if (etat !== "supprimé") { try { mtime = statSync(abs).mtimeMs; } catch { continue; } if (mtime < ms) { anterieurs++; continue; } }
    fichiers.push({ rel, abs, etat, mtime });
  }
  fichiers.sort((a, b2) => (b2.mtime ?? 0) - (a.mtime ?? 0));
  return { ok: true, racine, baseRev: base, base: base === ARBRE_VIDE ? "(aucun commit antérieur au message : arbre vide)" : base.slice(0, 10), fichiers, exclus, anterieurs, depuis: depuisTs };
}

/** Les écritures (Write, Edit, NotebookEdit) faites depuis `depuisTs` par les sous-agents d'une session : `<session>\subagents\agent-*.jsonl`. */
export function ecrituresSousAgents(transcript, depuisTs) {
  const dossier = join(dirname(transcript), basename(transcript, ".jsonl"), "subagents");
  if (!existsSync(dossier)) return { ok: true, dossier, agents: 0, ecritures: [], commandes: 0, absent: true };
  const ms = Date.parse(depuisTs || "");
  const ecritures = []; let commandes = 0, agents = 0;
  for (const nom of readdirSync(dossier).filter((n) => /^agent-.*\.jsonl$/.test(n)).sort()) {
    let meta = {}; try { meta = JSON.parse(readFileSync(join(dossier, nom.replace(/\.jsonl$/, ".meta.json")), "utf8")); } catch { /* sans méta */ }
    let records; try { records = lignesJson(readFileSync(join(dossier, nom), "utf8")); } catch { continue; }
    let ecrit = false;
    for (const r of records) {
      if (r.type !== "assistant") continue;
      const t = Date.parse(r.timestamp || "");
      if (Number.isFinite(ms) && Number.isFinite(t) && t < ms) continue;
      for (const b of r.message?.content || []) {
        if (b?.type !== "tool_use") continue;
        if (OUTILS_ECRITURE.has(b.name)) {
          const p = b.input?.file_path ?? b.input?.notebook_path;
          if (typeof p === "string" && p) { ecritures.push({ chemin: p, outil: b.name, agent: meta.description || meta.agentType || basename(nom, ".jsonl"), type: meta.agentType || null, ts: r.timestamp || null }); ecrit = true; }
        } else if (OUTILS_COMMANDE.has(b.name)) commandes++;
      }
    }
    if (ecrit || commandes) agents++;
  }
  return { ok: true, dossier, agents, ecritures, commandes, absent: false };
}

/**
 * La section de livrables.md sur le dépôt. `dejaCites` : chemins (normalisés) dont le contenu figure plus haut.
 * Rend { texte, cites } : `cites` = les chemins (normalisés) dont le contenu ou le diff est cité dans cette section.
 */
export function fabriquerDepot(depot, dejaCites) {
  const out = ["## Fichiers du dépôt modifiés depuis le dernier message humain (relevé par git, pas par la transcription)", ""];
  const cites = new Set();
  if (!depot.ok) return { texte: [...out, `[dépôt non relevé : ${depot.raison}]`, ""].join("\n"), cites };
  out.push(`Dépôt ${depot.racine}, comparé au dernier commit antérieur au message (${depot.base}), message du ${depot.depuis}. Un fichier est retenu s'il a changé par rapport à ce commit ET s'il a été modifié sur le disque après le message.`);
  const surDisque = depot.fichiers.filter((f) => !dejaCites.has(norm(f.abs)));
  const dedoubles = depot.fichiers.length - surDisque.length;
  out.push(`${depot.fichiers.length} fichier(s) retenu(s)${dedoubles ? `, dont ${dedoubles} déjà cité(s) plus haut (Write, Edit, NotebookEdit)` : ""} ; ${depot.exclus} dérivé(s) des contrôles non cité(s) (\`.oracles\\\`, \`*.oracles*.json*\`, \`*.jugement.json\`) ; ${depot.anterieurs} fichier(s) changé(s) par rapport à ce commit mais modifié(s) sur le disque avant le message, non cité(s).`, "");
  let reste = BORNES.depot; const omis = [];
  surDisque.forEach((f, i) => {
    if (i >= BORNES.depotFichiers || reste <= 0) { omis.push(`${f.rel} (${f.etat})`); return; }
    let corps;
    if (ESTENV(f.rel)) corps = "[contenu NON cité : un fichier `.env` ne transite jamais]";
    else if (f.etat === "supprimé") corps = "[supprimé du disque depuis le commit de comparaison ; date de la suppression inconnue]";
    else if (f.etat.startsWith("neuf")) corps = coupe(citerFichier(f.abs), BORNES.depotFichier, "contenu du fichier neuf");
    else { const d = git(depot.racine, ["diff", "--no-color", "--no-ext-diff", depot.base.length === 10 ? depot.base : ARBRE_VIDE, "--", f.rel]); corps = coupe(d.ok ? (d.out || "[diff vide]") : `[diff illisible : ${court(d.err, 150)}]`, BORNES.depotFichier, "diff du fichier"); }
    corps = corps.length > reste ? coupe(corps, reste, "borne globale du dépôt") : corps;
    reste -= corps.length;
    out.push(`### ${f.rel} — ${f.etat}`, "", "```", corps, "```", "");
    cites.add(norm(f.abs));
  });
  if (omis.length) out.push(`[BORNE : ${omis.length} fichier(s) du dépôt cité(s) par leur seul chemin, contenu omis (borne ${BORNES.depotFichiers} fichiers et ${BORNES.depot} caractères) : ${omis.join(" ; ")}]`, "");
  if (!depot.fichiers.length) out.push("Aucun fichier du dépôt modifié depuis ce message.", "");
  return { texte: out.join("\n"), cites };
}

/** La section de livrables.md sur les écritures des sous-agents. */
export function fabriquerSousAgents(sa, citesPlusHaut) {
  const out = ["## Écritures faites par les sous-agents de la session depuis le dernier message humain (transcriptions des sous-agents)", ""];
  if (sa.absent) return [...out, `Aucun dossier de sous-agents pour cette session (${sa.dossier} absent) : aucun sous-agent n'a travaillé, ou la transcription lue n'est pas celle d'une session avec sous-agents.`, ""].join("\n");
  if (!sa.ecritures.length) return [...out, `${sa.agents} sous-agent(s) actif(s) depuis ce message, aucune écriture par Write, Edit ou NotebookEdit${sa.commandes ? ` ; ${sa.commandes} commande(s) lancée(s) par eux, non listées` : ""}.`, ""].join("\n");
  const parChemin = new Map();
  for (const e of sa.ecritures) { const k = norm(e.chemin); if (!parChemin.has(k)) parChemin.set(k, { chemin: e.chemin, agents: new Set(), outils: new Set(), n: 0 }); const x = parChemin.get(k); x.agents.add(e.agent); x.outils.add(e.outil); x.n++; }
  out.push(`${sa.ecritures.length} écriture(s) sur ${parChemin.size} fichier(s) par ${sa.agents} sous-agent(s) actif(s)${sa.commandes ? ` ; ${sa.commandes} commande(s) lancée(s) par eux, non listées (leurs effets dans le dépôt sont relevés par git plus haut)` : ""}.`, "");
  let reste = BORNES.sousAgents; const omis = [];
  for (const x of parChemin.values()) {
    const ent = `- ${x.chemin} — ${[...x.outils].join(", ")} ×${x.n} — par : ${[...x.agents].join(" ; ")}`;
    if (citesPlusHaut.has(norm(x.chemin))) { out.push(`${ent} — contenu cité plus haut`); continue; }
    if (ESTENV(x.chemin)) { out.push(`${ent} — [contenu NON cité : un fichier \`.env\` ne transite jamais]`); continue; }
    if (reste <= 0) { omis.push(x.chemin); out.push(ent); continue; }
    const c = coupe(citerFichier(x.chemin), BORNES.sousAgentsFichier, "contenu d'un fichier écrit par un sous-agent");
    const corps = c.length > reste ? coupe(c, reste, "borne globale des sous-agents") : c;
    reste -= corps.length;
    out.push(ent, "", "```", corps, "```", "");
  }
  if (omis.length) out.push("", `[BORNE : ${omis.length} fichier(s) écrit(s) par des sous-agents cité(s) par leur seul chemin, contenu omis (borne ${BORNES.sousAgents} caractères)]`);
  out.push("");
  return out.join("\n");
}

/** Le contenu d'un fichier écrit, borné, la borne dite. */
export function citerFichier(chemin) {
  if (ESTENV(chemin)) return "[contenu NON cité : un fichier `.env` ne transite jamais]";
  if (!existsSync(chemin)) return "[fichier absent du disque à la préparation (supprimé ou déplacé depuis)]";
  let st; try { st = statSync(chemin); } catch (e) { return `[illisible : ${e.message}]`; }
  if (!st.isFile()) return "[n'est pas un fichier]";
  let buf; try { buf = readFileSync(chemin); } catch (e) { return `[illisible : ${e.message}]`; }
  if (buf.includes(0)) return `[fichier binaire non cité : ${buf.length} octets]`;
  return coupe(buf.toString("utf8"), BORNES.fichier, `fichier de ${buf.length} octets`);
}

/** livrables.md d'un point « fin de tour ». `ajouts` : { depot, sousAgents } (sections déjà fabriquées), absents pour un appel sans dépôt. */
export function fabriquerLivrablesFin(travail, ajouts = {}) {
  const out = ["# Ce que le tour a livré", "", `Fichiers écrits ou modifiés par Write, Edit ou NotebookEdit depuis le dernier message humain : ${travail.fichiers.length}.`, ""];
  let reste = BORNES.livrables;
  const omis = [];
  travail.fichiers.forEach((f, i) => {
    const c = citerFichier(f);
    if (reste <= 0) { omis.push(f); return; }
    const corps = c.length > reste ? coupe(c, reste, "borne globale des livrables") : c;
    reste -= corps.length;
    out.push(`## Fichier ${i + 1} — ${f}`, "", "```", corps, "```", "");
  });
  if (omis.length) out.push(`[BORNE : ${omis.length} fichier(s) cité(s) par leur seul chemin, contenu omis (borne globale ${BORNES.livrables} caractères) : ${omis.join(" ; ")}]`, "");
  if (!travail.fichiers.length) out.push("Aucun fichier écrit par ces trois outils dans ce tour.", "");
  if (travail.commandes.length) {
    const montrees = travail.commandes.slice(0, BORNES.commandes);
    out.push(`## Commandes lancées pendant le tour (${travail.commandes.length}${travail.commandes.length > montrees.length ? `, ${montrees.length} citées : borne ${BORNES.commandes}` : ""}) — citées, pas rejouées`, "");
    for (const c of montrees) out.push("- `" + coupe(c.replace(/\s+/g, " "), 300, "commande").replace(/`/g, "'") + "`");
    out.push("");
  }
  if (ajouts.depot) out.push(ajouts.depot);
  if (ajouts.sousAgents) out.push(ajouts.sousAgents);
  if (travail.dernierTexte) out.push("## Dernier message du tour", "", coupe(travail.dernierTexte, BORNES.message, "dernier message du tour"), "");
  else out.push("## Dernier message du tour", "", "(pas encore écrit dans la transcription lue)", "");
  return out.join("\n");
}

/** livrables.md d'un point « consigne ». */
export function fabriquerLivrablesConsigne(chemin, texte) {
  return ["# La consigne de délégation que le pilot s'apprête à passer à un agent", "", `Source : ${chemin}`, "", "```", coupe(texte, BORNES.fichier, "consigne de délégation"), "```", ""].join("\n");
}

/** La consigne complète à passer au `verificateur` (version 2). `avecRegles` : demande.txt porte un titre de règles applicables. */
export function consigneRelecteur(point, fDemande, fLivrables, avecRegles = false) {
  const consigne = point === "consigne";
  return [
    "Tu es RELECTEUR D'INTENTION (essai du 2026-10-18, references\\RELECTURE-INTENTION.md, consigne version 2). Lecture seule : tu lis EXACTEMENT deux fichiers, et aucun autre (ni le dépôt, ni d'autres dossiers, ni git).",
    `- DEMANDE : ${fDemande}`,
    `- LIVRABLE : ${fLivrables}`,
    "",
    consigne
      ? "La DEMANDE est la demande humaine d'origine (messages mot pour mot, et les décisions qui l'ont modifiée). Le LIVRABLE est la consigne que l'on s'apprête à passer à un agent pour y répondre."
      : "La DEMANDE est la demande humaine d'origine (messages mot pour mot, et les décisions qui l'ont modifiée). Le LIVRABLE est ce que le tour de travail a produit pour y répondre : fichiers écrits par le tour, fichiers du dépôt modifiés depuis le dernier message humain, écritures des sous-agents.",
    avecRegles ? "La DEMANDE se termine par un titre « Règles de la Factory applicables à ce type de travail » : ce ne sont PAS des mots du demandeur, ce sont les règles que le livrable doit tenir même si la demande ne les nomme pas." : "Aucune règle applicable n'est fournie pour ce travail : tu ne juges que l'écart à la demande.",
    "",
    consigne
      ? "Question unique : la consigne sert-elle l'INTENTION de la demande — ce que le demandeur voulait obtenir — ou s'en écarte-t-elle (elle n'en sert que la lettre, elle en restreint ou en élargit le périmètre sans le dire, elle fait répondre à une autre question, elle ajoute ce qui n'était pas demandé, elle laisse sans réponse une partie de la demande) ?"
      : "Question unique : le livrable sert-il l'INTENTION de la demande — ce que le demandeur voulait obtenir — ou s'en écarte-t-il (il n'en sert que la lettre, il en restreint ou en élargit le périmètre sans le dire, il répond à une autre question, il ajoute ce qui n'était pas demandé, il laisse sans réponse une partie de la demande) ?",
    "Ne juge ni le style, ni la qualité technique, ni la forme. Ne juge que l'écart entre ce qui était voulu et ce qui est livré.",
    `Règle de jugement : ${CONSIGNE_V2}`,
    "",
    "Rends UNIQUEMENT ce bloc JSON, sans texte autour :",
    FORME_JSON,
    "« derive » exige au moins un écart de gravité majeure ou bloquante ; sinon « sert », avec les écarts mineurs éventuels. Un contenu visible ajouté sans demande est au moins de gravité majeure. Chaque écart porte sa nature.",
  ].join("\n");
}

// ---------- recherche de la transcription ----------

const slugProjet = (cwd) => String(cwd).replace(/[^A-Za-z0-9]/g, "-");

/** La transcription la plus récente du projet courant, sous les profils `~\.claude*\projects\`. */
export function transcriptionRecente(cwd, env = process.env, maison = homedir()) {
  const slug = slugProjet(cwd).toLowerCase();
  let meilleure = null;
  for (const d of dossiersParDefaut(env, maison)) {
    if (basename(d).toLowerCase() !== slug) continue;
    let entrees; try { entrees = readdirSync(d, { withFileTypes: true }); } catch { continue; }
    for (const e of entrees) {
      if (!e.isFile() || !e.name.endsWith(".jsonl")) continue;
      const p = join(d, e.name);
      let m; try { m = statSync(p).mtimeMs; } catch { continue; }
      if (!meilleure || m > meilleure.m) meilleure = { p, m };
    }
  }
  return meilleure ? meilleure.p : null;
}

// ---------- registre ----------

function lireRegistre(f) { try { return lignesJson(readFileSync(f, "utf8")); } catch { return []; } }
const dateLocale = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

/**
 * Lit le bloc JSON d'un relecteur, même entouré de texte. Rend { ok, verdict } ou { ok: false, raison }.
 * Version 2 : chaque écart porte sa nature (hors_demande ou choix_humain). Une nature ABSENTE (verdict de la version 1) est lue
 * « non_precisee » et traitée comme un choix de l'humain — jamais corrigée sans lui ; une nature HORS VOCABULAIRE est refusée.
 */
export function lireVerdict(brut) {
  let j = null;
  try { j = JSON.parse(brut); } catch {
    const a = brut.indexOf("{"), b = brut.lastIndexOf("}");
    if (a >= 0 && b > a) { try { j = JSON.parse(brut.slice(a, b + 1)); } catch { /* dit ci-dessous */ } }
  }
  if (!j || typeof j !== "object") return { ok: false, raison: "aucun bloc JSON lisible" };
  const verdict = String(j.verdict || "").toLowerCase().replace("dérive", "derive");
  if (!["sert", "derive"].includes(verdict)) return { ok: false, raison: `verdict « ${j.verdict} » : attendu sert ou derive` };
  const gravite = String(j.gravite || "").toLowerCase();
  if (!GRAVITES.includes(gravite)) return { ok: false, raison: `gravité « ${j.gravite} » : attendu ${GRAVITES.join(", ")}` };
  const liste = Array.isArray(j.ecarts) ? j.ecarts : [];
  const detail = [];
  for (const [i, e] of liste.entries()) {
    const brutN = e && typeof e === "object" ? e.nature : undefined;
    const n = brutN === undefined || brutN === null || String(brutN).trim() === "" ? "non_precisee" : String(brutN).toLowerCase().trim();
    if (n !== "non_precisee" && !NATURES.includes(n)) return { ok: false, raison: `écart ${i + 1} : nature « ${brutN} » : attendu ${NATURES.join(" ou ")}` };
    detail.push({ nature: n, la_demande_dit: court(e?.la_demande_dit, BORNES.detailEcart), le_livrable_fait: court(e?.le_livrable_fait, BORNES.detailEcart), pourquoi: court(e?.pourquoi, BORNES.detailEcart) });
  }
  const natures = { hors_demande: 0, choix_humain: 0, non_precisee: 0 };
  for (const d of detail) natures[d.nature]++;
  return { ok: true, verdict: { verdict, gravite, ecarts: liste.length, natures, detail_ecarts: detail, confiance: typeof j.confiance === "string" ? j.confiance : null } };
}

const estAlerte = (l) => l.alerte === true || (l.verdict === "derive" && ["majeure", "bloquante"].includes(l.gravite));
const horsDemande = (l) => (l.detail_ecarts || []).filter((e) => e.nature === "hors_demande");

/**
 * L'état de la chaîne d'un travail : les relectures reliées par `suite_de`, de la première à la dernière. Pur.
 * Rend null si l'identifiant n'est pas une relecture du registre.
 *   etat : « sans_alerte » (une seule relecture, aucune alerte) · « levee » (la dernière relecture n'est plus une alerte) ·
 *          « a_corriger » (alerte avec un écart hors_demande et une passe encore permise) · « a_poser » (alerte à poser à l'humain).
 *   a_poser_a_l_humain : les écarts de nature choix_humain ou non précisée relevés par une relecture de la chaîne qui était une
 *          alerte, sans doublon ; s'y ajoutent, quand la dernière relecture est une alerte qu'aucune passe ne peut plus corriger
 *          (passes épuisées ou aucun écart hors_demande), ses écarts hors_demande : l'écart qui résiste est posé à l'humain.
 */
export function etatChaine(lignes, id) {
  const rels = lignes.filter((l) => l.ev === "relecture");
  const parId = new Map(rels.map((l) => [l.id, l]));
  let courant = parId.get(id);
  if (!courant) return null;
  const vus = new Set();
  while (courant.suite_de && parId.has(courant.suite_de) && !vus.has(courant.id)) { vus.add(courant.id); courant = parId.get(courant.suite_de); }
  const chaine = [courant];
  const suivantes = new Map(); for (const l of rels) if (l.suite_de) { if (!suivantes.has(l.suite_de)) suivantes.set(l.suite_de, []); suivantes.get(l.suite_de).push(l); }
  const dans = new Set([courant.id]);
  for (;;) {
    const s = (suivantes.get(chaine[chaine.length - 1].id) || []).filter((x) => !dans.has(x.id)).sort((a, b) => String(a.ts).localeCompare(String(b.ts)))[0];
    if (!s) break;
    chaine.push(s); dans.add(s.id);
  }
  const derniere = chaine[chaine.length - 1];
  const passesFaites = chaine.length - 1;
  const alerte = estAlerte(derniere);
  const peutCorriger = alerte && horsDemande(derniere).length > 0 && passesFaites < MAX_PASSES;
  const poser = [], vusEcarts = new Set();
  const ajouter = (e, motif) => { const k = `${e.nature}|${e.la_demande_dit}|${e.pourquoi}`; if (vusEcarts.has(k)) return; vusEcarts.add(k); poser.push({ ...e, motif }); };
  for (const l of chaine) if (estAlerte(l)) for (const e of l.detail_ecarts || []) if (e.nature !== "hors_demande") ajouter(e, e.nature === "choix_humain" ? "choix_humain" : "nature_non_precisee");
  if (alerte && !peutCorriger) for (const e of horsDemande(derniere)) ajouter(e, passesFaites >= MAX_PASSES ? "passes_epuisees" : "aucune_passe_possible");
  if (alerte && !peutCorriger && !(derniere.detail_ecarts || []).length) poser.push({ nature: "non_precisee", la_demande_dit: "", le_livrable_fait: "", pourquoi: `alerte sans écart détaillé (${derniere.id}, relecture sans le détail des écarts)`, motif: "nature_non_precisee" });
  let motif;
  if (!alerte) motif = chaine.length > 1 ? "la dernière relecture n'est plus une alerte : l'écart est levé" : "aucune alerte";
  else if (peutCorriger) motif = `${horsDemande(derniere).length} écart(s) hors_demande à corriger : la passe ${passesFaites + 1} est permise`;
  else if (passesFaites >= MAX_PASSES) motif = `${MAX_PASSES} passes de correction faites et l'alerte demeure : l'écart qui résiste est posé à l'humain`;
  else motif = "aucun écart hors_demande à corriger : tout relève du choix de l'humain, rien ne se corrige sans lui";
  return {
    chaine: chaine[0].id, type: chaine[0].type, point: chaine[0].point,
    relectures: chaine.map((l) => ({ id: l.id, passe: l.passe || 0, verdict: l.verdict, gravite: l.gravite, alerte: estAlerte(l), ecarts: l.ecarts })),
    relectures_faites: chaine.length, relectures_max: MAX_PASSES + 1, passes_faites: passesFaites, passes_max: MAX_PASSES,
    derniere: { id: derniere.id, verdict: derniere.verdict, gravite: derniere.gravite, alerte },
    etat: !alerte ? (chaine.length > 1 ? "levee" : "sans_alerte") : (peutCorriger ? "a_corriger" : "a_poser"),
    prochaine_passe: peutCorriger ? passesFaites + 1 : null, prochaine_passe_permise: peutCorriger, motif,
    a_poser_a_l_humain: poser,
  };
}

/** Le relevé par type et par point. */
export function releverRegistre(lignes, depuis = null) {
  const toutes = lignes.filter((l) => l.ev === "relecture");
  const relectures = toutes.filter((l) => !depuis || String(l.ts) >= depuis);
  const ids = new Set(relectures.map((l) => l.id));
  const suivies = new Set(toutes.filter((l) => l.suite_de).map((l) => l.suite_de));
  const conf = new Map();
  for (const l of lignes) if (l.ev === "confirmation" && ids.has(l.id)) conf.set(l.id, l.confirme === true);
  const cle = (l) => `${l.type}\u0000${l.point}`;
  const m = new Map();
  const ligne = (l) => { const k = cle(l); if (!m.has(k)) m.set(k, { type: l.type, point: l.point, relectures: 0, derives: 0, alertes: 0, confirmees: 0, infirmees: 0, sans_reponse: 0, corrigees: 0, chaines: 0, levees: 0, ecarts_leves: 0, ecarts_poses: 0 }); return m.get(k); };
  for (const l of relectures) {
    const x = ligne(l);
    x.relectures++;
    if (l.verdict === "derive") x.derives++;
    if (estAlerte(l)) {
      x.alertes++;
      if (conf.has(l.id)) { if (conf.get(l.id)) x.confirmees++; else x.infirmees++; }
      else if (suivies.has(l.id)) x.corrigees++;
      else x.sans_reponse++;
    }
  }
  // Les chaînes : une par travail relu, comptée à la ligne de sa première relecture (celle qui n'est la suite d'aucune autre).
  for (const racine of relectures.filter((l) => !l.suite_de || !toutes.some((t) => t.id === l.suite_de))) {
    const e = etatChaine(toutes, racine.id);
    if (!e) continue;
    const x = ligne(racine);
    x.chaines++;
    if (e.etat === "levee") { x.levees++; x.ecarts_leves += Number(racine.ecarts) || 0; }
    x.ecarts_poses += e.a_poser_a_l_humain.length;
  }
  const lignesRel = [...m.values()].sort((a, b) => (a.type + a.point).localeCompare(b.type + b.point));
  const CHAMPS = ["relectures", "derives", "alertes", "confirmees", "infirmees", "sans_reponse", "corrigees", "chaines", "levees", "ecarts_leves", "ecarts_poses"];
  const total = lignesRel.reduce((t, x) => { for (const k of CHAMPS) t[k] += x[k]; return t; }, Object.fromEntries(CHAMPS.map((k) => [k, 0])));
  return { depuis, lignes: lignesRel, total };
}

// ---------- exécution ----------

export function executer(argv, env = process.env, maintenant = new Date(), contexte = {}) {
  const cwd = contexte.cwd || process.cwd();
  const projetDir = contexte.projet || env.CLAUDE_PROJECT_DIR || cwd;   // le projet dont on lit la transcription
  const maison = contexte.maison || homedir();
  const a = { mode: null, preparer: null, fichier: null, transcript: null, sortie: null, registre: REGISTRE_DEFAUT, regles: REGLES_DEFAUT, point: null, type: null, session: null, depuis: null, json: false, verdict: null, id: null, reponse: null, passe: null, suiteDe: null, boucle: null };
  const usage = (m) => ({ code: 2, sortie: `relecture-intention : ${m}` });
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    const val = () => { const v = argv[++i]; if (v === undefined || v.startsWith("--")) throw new Error(`${x} attend une valeur`); return v; };
    try {
      if (x === "--preparer") { a.mode = "preparer"; a.preparer = val(); }
      else if (x === "--consigner") { a.mode = "consigner"; a.verdict = val(); }
      else if (x === "--confirmer") { a.mode = "confirmer"; a.id = val(); a.reponse = val(); }
      else if (x === "--boucle") { a.mode = "boucle"; a.boucle = val(); }
      else if (x === "--releve") a.mode = "releve";
      else if (x === "--fichier") a.fichier = val();
      else if (x === "--transcript") a.transcript = val();
      else if (x === "--sortie") a.sortie = val();
      else if (x === "--registre") a.registre = val();
      else if (x === "--regles") a.regles = val();
      else if (x === "--point") a.point = val();
      else if (x === "--type") a.type = val();
      else if (x === "--passe") a.passe = val();
      else if (x === "--suite-de") a.suiteDe = val();
      else if (x === "--session") a.session = val();
      else if (x === "--depuis") a.depuis = val();
      else if (x === "--json") a.json = true;
      else return usage(`option inconnue : ${x}`);
    } catch (e) { return usage(e.message); }
  }
  if (!a.mode) return usage("aucun mode — --preparer, --consigner, --boucle, --confirmer ou --releve");

  if (a.mode === "releve") {
    let depuis = null, avis = "";
    if (a.depuis !== null) { if (/^\d{4}-\d{2}-\d{2}$/.test(a.depuis)) depuis = a.depuis; else avis = `--depuis attend AAAA-MM-JJ (« ${a.depuis} » ignoré : relevé non filtré)\n`; }
    const r = releverRegistre(lireRegistre(a.registre), depuis);
    if (a.json) return { code: 0, sortie: JSON.stringify(r, null, 1), releve: r };
    const sortie = [`${avis}relecture-intention ${VERSION} — relevé${depuis ? ` depuis ${depuis}` : ""} (${a.registre}) : ${r.total.relectures} relecture(s)`];
    if (!r.lignes.length) sortie.push("  aucune relecture consignée");
    else {
      sortie.push("  type          point        relectures  dérives  alertes  confirmées  infirmées  sans réponse  corrigées  chaînes  levées sans l'humain  écarts levés  écarts posés à l'humain");
      for (const x of [...r.lignes, { type: "TOTAL", point: "", ...r.total }])
        sortie.push(`  ${x.type.padEnd(13)} ${x.point.padEnd(12)} ${String(x.relectures).padStart(10)} ${String(x.derives).padStart(8)} ${String(x.alertes).padStart(8)} ${String(x.confirmees).padStart(11)} ${String(x.infirmees).padStart(10)} ${String(x.sans_reponse).padStart(13)} ${String(x.corrigees).padStart(10)} ${String(x.chaines).padStart(8)} ${String(x.levees).padStart(21)} ${String(x.ecarts_leves).padStart(13)} ${String(x.ecarts_poses).padStart(24)}`);
      sortie.push("  (dérive = verdict « derive » ; alerte = dérive majeure ou bloquante ; confirmée/infirmée = réponse de l'humain, --confirmer ; corrigée = alerte suivie d'une passe de correction, --suite-de ;");
      sortie.push("   chaîne = un travail relu, de sa première relecture à sa dernière ; levée sans l'humain = chaîne dont la dernière relecture n'est plus une alerte ; écarts levés = écarts de la première relecture des chaînes levées ;");
      sortie.push("   écarts posés à l'humain = écarts de choix humain ou de nature non précisée relevés par une alerte, et ceux qui résistent à 2 passes — voir --boucle <identifiant>)");
    }
    return { code: 0, sortie: sortie.join("\n"), releve: r };
  }

  if (a.mode === "boucle") {
    const e = etatChaine(lireRegistre(a.registre), a.boucle);
    if (!e) return usage(`aucune relecture d'identifiant « ${a.boucle} » dans ${a.registre}`);
    if (a.json) return { code: 0, sortie: JSON.stringify(e, null, 1), boucle: e };
    const L = [`relecture-intention ${VERSION} — chaîne ${e.chaine} (${e.type}, point ${e.point}) : ${e.relectures_faites} relecture(s) sur ${e.relectures_max} au plus, ${e.passes_faites} passe(s) de correction faite(s) sur ${e.passes_max} au plus`];
    for (const r of e.relectures) L.push(`  passe ${r.passe} — ${r.id} : ${r.verdict}, gravité ${r.gravite}, ${r.ecarts} écart(s)${r.alerte ? " — ALERTE" : ""}`);
    L.push(`  état : ${e.etat} — ${e.motif}`);
    L.push(e.prochaine_passe_permise ? `  passe suivante : PERMISE (passe ${e.prochaine_passe}) : corriger les écarts hors_demande, puis relire avec --consigner … --passe ${e.prochaine_passe} --suite-de ${e.derniere.id}` : "  passe suivante : NON permise");
    if (e.a_poser_a_l_humain.length) {
      L.push(`  à poser à l'humain tout de suite (${e.a_poser_a_l_humain.length}) :`);
      for (const p of e.a_poser_a_l_humain) L.push(`    - [${p.motif}] la demande dit : « ${p.la_demande_dit} » — le livrable fait : « ${p.le_livrable_fait} » — ${p.pourquoi}`);
    } else L.push("  à poser à l'humain : rien");
    return { code: 0, sortie: L.join("\n"), boucle: e };
  }

  if (a.mode === "confirmer") {
    if (!["oui", "non"].includes(String(a.reponse).toLowerCase())) return usage("--confirmer <id> <oui|non>");
    const rel = lireRegistre(a.registre).find((l) => l.ev === "relecture" && l.id === a.id);
    if (!rel) return usage(`aucune relecture d'identifiant « ${a.id} » dans ${a.registre}`);
    if (!rel.alerte) return usage(`la relecture ${a.id} n'a pas posé d'alerte (verdict ${rel.verdict}, gravité ${rel.gravite}) : rien à confirmer`);
    const ligne = { ts: maintenant.toISOString(), ev: "confirmation", id: a.id, confirme: String(a.reponse).toLowerCase() === "oui" };
    appendFileSync(a.registre, JSON.stringify(ligne) + "\n");
    return { code: 0, sortie: `relecture-intention : alerte ${a.id} ${ligne.confirme ? "CONFIRMÉE" : "INFIRMÉE"} (une ligne ajoutée à ${a.registre})`, ligne };
  }

  if (a.mode === "consigner") {
    if (!POINTS.includes(a.point)) return usage(`--point attend ${POINTS.join(" ou ")}`);
    if (!TYPES.includes(a.type)) return usage(`--type attend ${TYPES.join(", ")}`);
    let brut; try { brut = readFileSync(resolve(cwd, a.verdict), "utf8"); } catch (e) { return usage(`verdict illisible : ${e.message}`); }
    const v = lireVerdict(brut);
    if (!v.ok) return usage(`verdict inexploitable (${v.raison}) : rien n'est consigné`);
    // La chaîne d'un travail : --passe et --suite-de vont ensemble ; au plus MAX_PASSES passes ; rien à corriger sans écart hors_demande.
    let passe = 0, suiteDe = null, chaine = null;
    const registre = lireRegistre(a.registre);
    if (a.passe !== null && !/^\d+$/.test(a.passe)) return usage(`--passe attend un entier (0 à ${MAX_PASSES}), reçu « ${a.passe} »`);
    if (a.passe !== null) passe = Number(a.passe);
    if (passe > MAX_PASSES) return usage(`--passe ${passe} : au plus ${MAX_PASSES} passes de correction (soit ${MAX_PASSES + 1} relectures) pour un même travail ; l'écart qui résiste est posé à l'humain`);
    if (a.suiteDe !== null) {
      if (a.passe === null) return usage("--suite-de exige --passe <n> (la passe de correction qui précède cette relecture)");
      const prec = registre.find((l) => l.ev === "relecture" && l.id === a.suiteDe);
      if (!prec) return usage(`--suite-de : aucune relecture d'identifiant « ${a.suiteDe} » dans ${a.registre}`);
      if (!estAlerte(prec)) return usage(`--suite-de : ${prec.id} n'est pas une alerte (verdict ${prec.verdict}, gravité ${prec.gravite}) — il n'y a rien à corriger`);
      const attendue = (prec.passe || 0) + 1;
      if (passe !== attendue) return usage(`--passe ${passe} : la relecture ${prec.id} est de passe ${prec.passe || 0}, celle qui la suit est de passe ${attendue}`);
      if (prec.point !== a.point || prec.type !== a.type) return usage(`--suite-de : ${prec.id} est une relecture ${prec.type} au point ${prec.point}, pas ${a.type} au point ${a.point} — une chaîne est UN travail`);
      if (registre.some((l) => l.ev === "relecture" && l.suite_de === prec.id)) return usage(`--suite-de : ${prec.id} est déjà suivie d'une relecture — une chaîne est linéaire`);
      const etat = etatChaine(registre, prec.id);
      if (!etat.prochaine_passe_permise) return usage(`--suite-de : pas de passe permise après ${prec.id} — ${etat.motif}`);
      suiteDe = prec.id; chaine = etat.chaine;
    } else if (passe !== 0) return usage(`--passe ${passe} exige --suite-de <identifiant de la relecture précédente> : une passe de correction suit une relecture`);
    let session = a.session || env.CLAUDE_SESSION_ID || null;
    if (!session) { const t = transcriptionRecente(projetDir, env, maison); session = t ? basename(t, ".jsonl") : "inconnue"; }
    const jour = dateLocale(maintenant);
    const n = registre.filter((l) => l.ev === "relecture" && String(l.id).startsWith(`RI-${jour}-`)).length + 1;
    const alerte = v.verdict.verdict === "derive" && ["majeure", "bloquante"].includes(v.verdict.gravite);
    const id = `RI-${jour}-${String(n).padStart(2, "0")}`;
    const ligne = { ts: maintenant.toISOString(), ev: "relecture", id, point: a.point, type: a.type, ...v.verdict, alerte, passe, suite_de: suiteDe, chaine: chaine || id, projet: basename(resolve(projetDir)), session };
    mkdirSync(dirname(resolve(a.registre)), { recursive: true });
    appendFileSync(a.registre, JSON.stringify(ligne) + "\n");
    const avis = v.verdict.verdict === "derive" && !alerte ? " — verdict « derive » sans écart majeur ni bloquant : consigné tel quel, pas d'alerte" : "";
    const suiteTexte = suiteDe ? ` (passe ${passe}, suite de ${suiteDe})` : "";
    const apres = etatChaine([...registre, ligne], id);
    let alerteTexte = "";
    if (alerte) alerteTexte = apres.prochaine_passe_permise
      ? ` — ALERTE : passe de correction ${apres.prochaine_passe} permise (corriger les écarts hors_demande, puis relire avec --passe ${apres.prochaine_passe} --suite-de ${id}) ; ${apres.a_poser_a_l_humain.length} écart(s) à poser à l'humain tout de suite`
      : ` — ALERTE : à poser à l'humain (bloc 3), ${apres.motif}, réponse par --confirmer ${id} <oui|non>`;
    const nat = v.verdict.ecarts ? ` [${v.verdict.natures.hors_demande} hors_demande, ${v.verdict.natures.choix_humain} choix_humain${v.verdict.natures.non_precisee ? `, ${v.verdict.natures.non_precisee} de nature non précisée (traité(s) comme choix de l'humain)` : ""}]` : "";
    return { code: 0, sortie: `relecture-intention : ${id} consignée (${a.point}, ${a.type})${suiteTexte} — ${v.verdict.verdict}, gravité ${v.verdict.gravite}, ${v.verdict.ecarts} écart(s)${nat}${alerteTexte}${avis}`, ligne };
  }

  // --preparer
  if (!POINTS.includes(a.preparer)) return usage(`--preparer attend ${POINTS.join(" ou ")}`);
  let types = [];
  if (a.type !== null) {
    types = a.type.split(",").map((t) => t.trim()).filter(Boolean);
    const inconnus = types.filter((t) => !TYPES.includes(t));
    if (!types.length || inconnus.length) return usage(`--type attend ${TYPES.join(", ")}${inconnus.length ? ` (reçu « ${inconnus.join(", ")} »)` : ""}, plusieurs séparés par une virgule`);
  }
  let regles = null;
  if (types.length) {
    regles = chargerRegles(resolve(cwd, a.regles));
    if (!regles.ok) return usage(regles.raison);
  }
  let consigneTexte = null;
  if (a.preparer === "consigne") {
    if (!a.fichier) return usage("--preparer consigne attend --fichier <consigne.md>");
    try { consigneTexte = readFileSync(resolve(cwd, a.fichier), "utf8"); } catch (e) { return usage(`consigne illisible : ${e.message}`); }
  }
  const transcript = a.transcript ? resolve(cwd, a.transcript) : transcriptionRecente(projetDir, env, maison);
  if (!transcript) return usage(`aucune transcription trouvée pour le projet « ${projetDir} » sous les profils .claude* ; --transcript <jsonl> la désigne`);
  let records; try { records = lignesJson(readFileSync(transcript, "utf8")); } catch (e) { return usage(`transcription illisible : ${e.message}`); }
  const humains = messagesHumains(records);
  const decisions = decisionsPosees(records, humains);
  const dossier = a.sortie ? resolve(cwd, a.sortie) : mkdtempSync(join(tmpdir(), "relecture-intention-"));
  mkdirSync(dossier, { recursive: true });
  const fDemande = join(dossier, "demande.txt"), fLivrables = join(dossier, "livrables.md");
  let livrables, resume;
  if (a.preparer === "fin-de-tour") {
    const dernier = humains.length ? humains[humains.length - 1] : null;
    const travail = travailDuTour(records, dernier ? dernier.rang : -1);
    const depot = fichiersDepot(resolve(projetDir), dernier?.ts);
    const sa = ecrituresSousAgents(transcript, dernier?.ts);
    const cites = new Set(travail.fichiers.map(norm));
    const sectionDepot = fabriquerDepot(depot, cites);
    livrables = fabriquerLivrablesFin(travail, { depot: sectionDepot.texte, sousAgents: fabriquerSousAgents(sa, new Set([...cites, ...sectionDepot.cites])) });
    resume = `${travail.fichiers.length} fichier(s) écrit(s), ${travail.commandes.length} commande(s) depuis le dernier message humain ; dépôt : ${depot.ok ? `${depot.fichiers.length} fichier(s) modifié(s)` : "non relevé"} ; sous-agents : ${sa.absent ? "aucun" : `${sa.ecritures.length} écriture(s) de ${sa.agents} sous-agent(s)`}`;
  } else {
    livrables = fabriquerLivrablesConsigne(resolve(cwd, a.fichier), consigneTexte);
    resume = `la consigne ${a.fichier}`;
  }
  const blocRegles = regles ? fabriquerRegles(regles.ref, types) : "";
  writeFileSync(fDemande, fabriquerDemande(humains, decisions, blocRegles), "utf8");
  writeFileSync(fLivrables, livrables, "utf8");
  const consigne = consigneRelecteur(a.preparer, fDemande, fLivrables, !!regles);
  const nbRegles = regles ? reglesDesTypes(regles.ref, types).length : 0;
  const sortie = [
    `relecture-intention ${VERSION} — point « ${a.preparer} » : ${humains.length} message(s) humain(s) cité(s) mot pour mot, ${decisions.length} décision(s) posée(s) retrouvée(s), ${resume}${regles ? `, ${nbRegles} règle(s) applicable(s) au type ${types.join("+")} (référentiel ${regles.ref.version})` : ", aucune règle applicable ajoutée (pas de --type)"}`,
    `transcription lue : ${transcript}`,
    `écrit : ${fDemande} · ${fLivrables}`,
    "",
    `--- CONSIGNE À PASSER À L'AGENT verificateur (description de l'appel : « Relecture d'intention ${a.preparer} » — c'est elle que compte scripts\\relever-flotte.mjs) ---`,
    consigne,
    "--- FIN DE LA CONSIGNE ---",
    `Ensuite : écrire le bloc JSON rendu dans un fichier, puis node scripts\\relecture-intention.mjs --consigner <verdict.json> --point ${a.preparer} --type <${TYPES.join("|")}> [--passe <n> --suite-de <identifiant>]. Un écart majeur de nature hors_demande se corrige (2 passes au plus, chacune relue) ; un écart de nature choix_humain, ou qui résiste, est posé à l'humain : alerte, jamais blocage. L'état d'une chaîne : --boucle <identifiant>.`,
  ].join("\n");
  return { code: 0, sortie, dossier, consigne, demande: fDemande, livrables: fLivrables };
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const r = executer(process.argv.slice(2));
  (r.code === 2 ? console.error : console.log)(r.sortie);
  process.exit(r.code);
}
