#!/usr/bin/env node
/**
 * oracle-demande-tierce.mjs — juge la FORME d'une demande remise à une équipe tierce
 * (TF-1517, TF-1544, TF-1603, TF-1604, TF-1513 ; lots Produit-03 RA-59, RA-65, RA-71, RA-72, RA-58).
 *
 * POURQUOI CE FICHIER EXISTE. Le 01/10/2026, une demande de droit remise à l'équipe identité a coûté
 * trois allers-retours au commanditaire, qui a fixé la forme lui-même : pourquoi, rien d'un autre
 * projet, aucun nom de personne, aucune ligne sans valeur, aucun droit d'administration. Aucune règle
 * de la consigne de restitution ne la fixait (S49 demande de dire comment faire un geste, S52 et S53
 * encadrent l'écran d'une plateforme tierce). Le produit a écrit un contrôle
 * (`scripts/controler-demande.mjs`) ; ce module en reprend la forme à 4 parties, généralisée, pour
 * que toute demande de tout projet soit jugée par le même code.
 *
 * RÈGLES.
 *   T1 · les 4 parties sont présentes, chacune seule sur sa ligne, dans l'ordre (gabarit
 *        `gabarits\DEMANDE-TIERCE.md`).
 *   T2 · le statut dit la situation d'aujourd'hui et l'effet de l'action (heuristique lexicale).
 *   T3 · le statut tient en 3 phrases et 80 mots au plus (TF-1604).
 *   T4 · la vérification finale porte une adresse complète et un résultat observable.
 *   T5 · aucun motif exclu (liste EXCLUS), dont le renvoi à un message précédent (TF-1603) et le
 *        compte personnel imposé (TF-1513). Les noms de personnes se passent par `noms`.
 *
 * CE QUE CE CONTRÔLE NE JUGE PAS (NON_JUGE) : la justesse du statut (un statut conforme peut être
 * faux), la cause donnée à un geste qui échappe à la chaîne, la pertinence de la demande, un nom de
 * personne absent de la liste `noms`. L'heuristique de T2 est lexicale : elle accepte un statut qui
 * emploie un des mots attendus sans garantir qu'il dise la bonne chose.
 *
 * Usage : node oracle-demande-tierce.mjs <fichier> [--noms Prénom,Nom,...] [--noms-fichier <liste>] [--json]
 *         --noms-fichier : un tableau JSON de noms (ou un objet portant `noms`), ou un texte à un nom par ligne
 *         (virgules et points-virgules admis) ; la variable FORGE_NOMS_PERSONNES (noms séparés par des virgules)
 *         s'ajoute aux deux. Les trois sources se cumulent.
 *         --json : le contrat JSON commun des oracles (oracle, domaine, artefact, verdict, findings, non_juge).
 *         Juge le premier bloc ```text du fichier, ou le fichier entier s'il n'en a pas.
 * Exit  : 0 = forme tenue · 1 = au moins un écart · 2 = fichier absent ou illisible.
 */
import { readFileSync, existsSync } from "node:fs";

export const ORACLE = "oracle-demande-tierce";
export const DOMAINE = "Forme d'une demande remise à une équipe tierce";

export const VERSION = "1.0.0";

export const PARTIES = ["Prochaines étapes", "Statut et impacts des actions", "Étapes suivantes", "Vérification finale"];
export const BORNE_PHRASES = 3;
export const BORNE_MOTS = 80;

export const NON_JUGE = [
  "la justesse du statut : un statut conforme peut être faux (RA-72 portait une conséquence fausse)",
  "la cause donnée à un geste qui échappe à la chaîne, et sa source (TF-1513, partie 2)",
  "la pertinence de la demande et l'ordre de ses gestes",
  "un nom de personne absent de la liste passée par `noms`",
];

//: Les motifs exclus. `zone` dit où le motif est cherché : le texte entier, ou le texte hors vérification finale
//: (une commande citée en vérification est un constat, pas un geste imposé).
export const EXCLUS = [
  { cle: "renvoi-personne", libelle: "renvoi vers une personne",
    re: /\b[Dd]emande(?:r|z|s)? à (?!l['’]|la |le |les |votre |vos )[A-ZÉ]|si tu ne sais pas|si tu n['’]as pas les droits|\b[Cc]ontacte(?:r|z|s)? (?!l['’]|la |le |les )[A-ZÉ]/ },
  { cle: "droits-admin", libelle: "droits d'administration ou temporaires",
    re: /droits? d['’]administrat|rôle d['’]administrat|\btemporaire(ment)?\b|élévation de privilèges|\bPIM\b|Global Administrator/i },
  { cle: "autre-projet", libelle: "situation d'un autre projet",
    re: /autre (projet|produit)|produit voisin|application voisine|comme (au|chez|pour) (le )?(compte|produit|projet)/i },
  { cle: "ligne-sans-valeur", libelle: "ligne sans valeur",
    re: /rien d['’ ]autre|merci d['’]avance|n['’]hésitez pas|cordialement|^\s*merci\s*!?\s*$/im, brut: true },
  { cle: "compte-impose", libelle: "compte imposé ou commande à jouer avec un compte personnel", horsVerification: true,
    re: /avec votre compte|votre compte (administrateur|personnel)|compte personnel|connectez-vous|\baz (ad|rest|login|role)\b|\baws sso\b|\bgcloud auth\b|\bConnect-\w+/i },
  { cle: "tournure-ce-que", libelle: "tournure « Ce que… »", re: /\bce qu(?:e|['’])/i },
  { cle: "liste-du-non-fait", libelle: "liste de ce qui ne sera pas fait",
    re: /\bni\b[^.]{0,80}\bni\b|rien de plus|\bsans (secret|certificat|consentement|approbation)\b|\baucun(e)? (secret|certificat|consentement|approbation|commande)\b/i },
  { cle: "commanditaire", libelle: "« commanditaire » comme sujet (écrire l'étape à l'infinitif)", re: /commanditaire/i },
  { cle: "adresse-abregee", libelle: "adresse abrégée (écrire l'adresse complète)", re: /(?<![\w./-])-(prd|hpr|dev)\b/i },
  { cle: "etage", libelle: "« étage » (écrire « étape »)", re: /(?<![\p{L}])étages?(?![\p{L}])/iu },
  { cle: "renvoi-message", libelle: "renvoi à un message précédent (redonner les gestes exacts)",
    re: /\b(?:relance|demande|message)\s+(?:de|du)\s+\d{1,2}h\d{2}\b|\b(?:demandée?s?|envoyée?s?|publiée?s?|prévue?s?)\s+(?:à|le)\s+\d{1,2}h\d{2}\b|\bcomme (?:demandé|indiqué|prévu|convenu)\b|\b(?:message|mail|courriel) précédent\b/i },
];

const norm = (t) => t.replace(/\s+/g, " ");

/** Phrases et mots d'un statut : un retour à la ligne ne coupe pas une phrase. */
export function mesurerStatut(texte) {
  const t = norm(texte).trim();
  const phrases = t ? t.split(/(?<=[.!?…])\s+/).filter((s) => s.trim()).length : 0;
  const mots = t ? t.split(/\s+/).length : 0;
  return { phrases, mots };
}

/** La partie `i` : lignes entre son titre et le titre suivant. Un titre peut porter un « ## », du gras, un numéro. */
function decouper(bloc) {
  const lignes = bloc.split("\n");
  const titre = (l) => l.trim().replace(/^#+\s*/, "").replace(/^\d+[.)]\s*/, "").replace(/\*\*/g, "").replace(/\s*:\s*$/, "").trim();
  const positions = PARTIES.map((p) => lignes.findIndex((l) => titre(l).toLowerCase() === p.toLowerCase()));
  const partie = (i) => {
    if (positions[i] < 0) return "";
    const fin = positions.slice(i + 1).find((x) => x > positions[i]) ?? lignes.length;
    return lignes.slice(positions[i] + 1, fin).join("\n");
  };
  return { lignes, positions, partie };
}

export function verifier(source, { noms = [] } = {}) {
  const texte = String(source).replace(/\r\n/g, "\n");
  const bloc = (texte.match(/```text\n([\s\S]*?)```/) || [null, texte])[1];
  const constats = [];
  const ko = (regle, message, remede) => constats.push({ regle, statut: "FAIL", message, remede });
  const ok = (regle, message) => constats.push({ regle, statut: "PASS", message });

  const { lignes, positions, partie } = decouper(bloc);

  // ---- T1 : les 4 parties, dans l'ordre -------------------------------------------------
  const absentes = PARTIES.filter((_, i) => positions[i] < 0);
  if (absentes.length) {
    ko("T1", `partie(s) absente(s) : ${absentes.map((p) => `« ${p} »`).join(" · ")}`,
      "ajouter les parties du gabarit gabarits\\DEMANDE-TIERCE.md, chacune seule sur sa ligne");
  } else if (!positions.every((x, i) => i === 0 || x > positions[i - 1])) {
    ko("T1", "les 4 parties ne sont pas dans l'ordre : Prochaines étapes, Statut et impacts des actions, Étapes suivantes, Vérification finale",
      "remettre les parties dans l'ordre du gabarit");
  } else ok("T1", "les 4 parties sont présentes et dans l'ordre");

  // ---- T2 / T3 : le statut ------------------------------------------------------------------
  // Sans les 4 parties dans l'ordre, les bornes d'une partie ne sont pas fiables : T2 à T4 ne sont pas jugées.
  const structureTenue = constats.every((c) => c.statut === "PASS");
  const statut = norm(partie(1));
  if (!structureTenue) {
    for (const r of ["T2", "T3", "T4"]) constats.push({ regle: r, statut: "SANS_OBJET", message: "structure en défaut (T1) : les bornes des parties ne sont pas fiables" });
  } else if (positions[1] >= 0) {
    const situation = /aujourd['’]hui|actuellement|\bencore\b|\bdepuis\b|pour l['’]instant|AADSTS\d+|erreur \w+/i.test(statut);
    const effet = /\b(crée|créera|branche|brancheront|affiche|affichera|ouvre|ouvrira|permet|permettra|débloque|débloquera|rétablit|rétablira|publie|publiera|enregistre|enregistrera)\b/i.test(statut);
    if (!situation) ko("T2", "le statut ne dit pas la situation d'aujourd'hui (mot attendu : aujourd'hui, actuellement, encore, depuis, pour l'instant)", "ouvrir le statut par l'état présent et sa cause");
    else if (!effet) ko("T2", "le statut ne dit pas l'effet de l'action (verbe attendu : crée, affiche, ouvre, permet, débloque, rétablit…)", "terminer le statut par ce que les gestes changent");
    else ok("T2", "le statut dit la situation d'aujourd'hui et l'effet de l'action");
    const m = mesurerStatut(statut);
    if (m.phrases > BORNE_PHRASES || m.mots > BORNE_MOTS) {
      ko("T3", `le statut est trop long : ${m.phrases} phrase(s) et ${m.mots} mot(s), au plus ${BORNE_PHRASES} et ${BORNE_MOTS}`,
        "ne garder que la situation et sa cause, puis l'effet des gestes ; le récit de l'équipe produit sort du statut");
    } else ok("T3", `le statut tient en ${m.phrases} phrase(s) et ${m.mots} mot(s) (au plus ${BORNE_PHRASES} et ${BORNE_MOTS})`);
  }

  // ---- T4 : la vérification finale --------------------------------------------------------
  if (structureTenue && positions[3] >= 0) {
    const v = norm(partie(3));
    const adresse = /https?:\/\/\S+/.test(v);
    const resultat = /\b(s['’]affiche|affiche|apparaît|rend|répond|retourne|liste|ouvre|montre)\b/i.test(v);
    if (!adresse) ko("T4", "la vérification finale ne porte aucune adresse complète (https://…)", "écrire l'adresse entière à ouvrir");
    else if (!resultat) ko("T4", "la vérification finale ne dit pas le résultat observable attendu (s'affiche, répond, liste…)", "dire ce que le lecteur doit constater à cette adresse");
    else ok("T4", "la vérification finale porte une adresse complète et un résultat observable");
  }

  // ---- T5 : les motifs exclus -----------------------------------------------------------------
  const horsVerification = norm(positions[3] >= 0 ? lignes.slice(0, positions[3]).join("\n") : bloc);
  const entier = norm(bloc);
  const trouves = [];
  for (const e of EXCLUS) {
    const cible = e.brut ? bloc : e.horsVerification ? horsVerification : entier;
    const m = cible.match(e.re);
    if (m) trouves.push({ cle: e.cle, libelle: e.libelle, extrait: m[0].trim() });
  }
  for (const nom of noms) {
    const echappe = nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?<![\\p{L}])${echappe}(?![\\p{L}])`, "iu").test(entier)) trouves.push({ cle: "nom-personne", libelle: "nom de personne", extrait: nom });
  }
  if (trouves.length) {
    for (const t of trouves) ko("T5", `motif exclu « ${t.libelle} » : « ${t.extrait} »`, "retirer ou réécrire ce passage (gabarits\\DEMANDE-TIERCE.md, « Exclu de toute demande »)");
  } else ok("T5", `aucun des ${EXCLUS.length} motifs exclus${noms.length ? `, aucun des ${noms.length} noms déclarés` : " (noms de personnes non jugés : aucune liste fournie)"}`);

  return { version: VERSION, constats, verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS", non_juge: NON_JUGE };
}

// ---- LES NOMS DE PERSONNES ET LE CONTRAT COMMUN (TF-1520, décision du 02/10/2026 : combler les deux écarts du contrôle repris du produit) ----

/**
 * Les noms de personnes à refuser dans une demande, de trois sources cumulées : la ligne de commande,
 * un fichier de liste, la variable FORGE_NOMS_PERSONNES. Le contrôle du produit ne connaissait que la
 * première : sans liste passée à la main, T5 ne jugeait aucun nom, et personne ne tenait la liste.
 * Une liste illisible LÈVE : un nom qu'on croit refusé et qui ne l'est pas est pire qu'une liste absente.
 */
export function lireNoms({ noms = [], fichier = null, env = process.env } = {}) {
  const decoupe = (t) => String(t).split(/[\n,;]/).map((n) => n.trim()).filter(Boolean);
  let deFichier = [];
  if (fichier) {
    if (!existsSync(fichier)) throw new Error(`liste de noms introuvable : ${fichier}`);
    const brut = readFileSync(fichier, "utf8").replace(/^\uFEFF/, "");
    if (/^\s*[\[{]/.test(brut)) {
      const j = JSON.parse(brut);
      const liste = Array.isArray(j) ? j : j && Array.isArray(j.noms) ? j.noms : null;
      if (!liste) throw new Error(`liste de noms illisible : ${fichier} (attendu : un tableau, ou un objet portant « noms »)`);
      deFichier = liste.map(String).map((n) => n.trim()).filter(Boolean);
    } else deFichier = decoupe(brut);
  }
  const deEnv = env && env.FORGE_NOMS_PERSONNES ? decoupe(env.FORGE_NOMS_PERSONNES) : [];
  return [...new Set([...noms, ...deFichier, ...deEnv])];
}

/** Le verdict de `verifier` au contrat JSON commun des oracles (verdict, findings localisants, non_juge). */
export function enContrat(fichier, r, nbNoms = 0) {
  const findings = r.constats.map((c) => ({
    sev: c.statut === "FAIL" ? "bloquant" : "info",
    regle: c.regle,
    msg: c.statut === "SANS_OBJET" ? `non jugé — ${c.message}` : c.remede ? `${c.message} — remède : ${c.remede}` : c.message,
    where: fichier,
  }));
  const nonJuge = nbNoms
    ? r.non_juge
    : [...r.non_juge, "les noms de personnes : aucune liste fournie (--noms, --noms-fichier ou FORGE_NOMS_PERSONNES), T5 n'en refuse aucun"];
  return { oracle: ORACLE, domaine: DOMAINE, artefact: fichier, verdict: r.verdict, findings, non_juge: nonJuge };
}

// ---- CLI --------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("oracle-demande-tierce.mjs");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeurDe = (opt) => { const i = args.indexOf(opt); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null; };
  const fichier = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--noms" && args[i - 1] !== "--noms-fichier");
  const usage = "usage : node oracle-demande-tierce.mjs <fichier> [--noms Prénom,Nom,...] [--noms-fichier <liste>] [--json]";
  if (!fichier || !existsSync(fichier)) {
    console.error(usage);
    process.exit(2);
  }
  let noms;
  try {
    noms = lireNoms({ noms: (valeurDe("--noms") || "").split(",").map((n) => n.trim()).filter(Boolean), fichier: valeurDe("--noms-fichier") });
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  const r = verifier(readFileSync(fichier, "utf8"), { noms });
  if (args.includes("--json")) console.log(JSON.stringify(enContrat(fichier, r, noms.length), null, 1));
  else {
    console.log(`oracle-demande-tierce ${VERSION} — ${fichier}`);
    for (const c of r.constats) {
      console.log(`  [${c.statut}] ${c.regle} — ${c.message}`);
      if (c.statut === "FAIL" && c.remede) console.log(`      → ${c.remede}`);
    }
    console.log(`verdict : ${r.verdict}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
