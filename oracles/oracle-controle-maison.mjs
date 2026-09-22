#!/usr/bin/env node
/**
 * oracle-controle-maison.mjs — UN CONTRÔLE ÉCRIT À LA MAIN POUR UN DOMAINE DÉJÀ COUVERT.
 *
 * ============================================================================================
 * POURQUOI (TF-1077, proposition P-4b, décision humaine D-4 (a) du 14/09/2026)
 * ============================================================================================
 *
 * LE FAIT EST UN TAUX. Au tableau de bord des récidives du 14/09/2026, la classe
 * `oracle-remplace-par-controle-maison` compte 14 items dont 12 RÉCIDIVES — 86 %, chez six
 * dépôts. Le cas le plus net est écrit en toutes lettres au registre : « un contrôle de sécurité
 * écrit à la main faute d'avoir cherché l'oracle du domaine » (TF-1046). Les autres disent la même
 * chose sous d'autres angles : deux implémentations d'un même jugement qui coexistent et divergent,
 * une liste écrite à la main là où un oracle énumérait déjà.
 *
 * CE QUI MANQUAIT N'ÉTAIT PAS LA RÈGLE. Le skill `quality-oracles` la pose depuis longtemps —
 * chercher l'oracle du domaine avant d'en écrire un — et son registre est une donnée lisible.
 * Ce qui manquait est le MOMENT : personne ne relit un registre au moment précis où il crée un
 * fichier `verifier-quelque-chose.mjs`. *Une règle que le producteur ne rencontre pas au moment où
 * il produit n'existe pas pour lui* (même constat que hook-ecriture, même remède).
 *
 * ============================================================================================
 * CE QU'IL JUGE, ET CE QU'IL NE JUGE PAS
 * ============================================================================================
 *
 * IL NE LIT PAS CE QUE LE SCRIPT FAIT. Décider du domaine d'un programme par son corps demande de
 * l'exécuter ou de le comprendre ; une devinette ferait crier l'oracle sur du travail juste, et un
 * oracle qui crie sur l'usage légitime se fait désactiver dans la semaine (leçon N4). Il lit deux
 * choses vérifiables : le NOM du fichier, que la convention rend porteur (`verifier-…`,
 * `controle-…`, `check-…`, `oracle-…`, `valider-…`), et son EN-TÊTE — les soixante premières
 * lignes, là où un auteur écrit ce qu'il juge.
 *
 * IL RAPPROCHE PAR MOTS SIGNIFIANTS. Chaque domaine du registre porte un libellé ; ses mots de
 * plus de quatre lettres, hors mots outils, forment sa signature. Deux mots partagés entre la
 * signature d'un domaine et le contrôle écrit suffisent à poser la question — un seul mot
 * produirait un rapprochement par hasard, trois n'attraperait presque rien.
 *
 * L'EXEMPTION EST PRÉVUE ET ELLE EST ÉCRITE DANS LE FICHIER, jamais ailleurs : une ligne
 * `oracle-du-socle:` suivie du motif éteint la règle pour ce contrôle. *Un refus qui ne laisse
 * aucune sortie légitime se contourne au lieu de se satisfaire* — c'est ce qui est arrivé à S11
 * avant que `hors_mandat` n'existe, et la leçon est reprise ici plutôt que réapprise.
 *
 * Registre absent de ce poste : SKIP nommé. Le contrôle ne suppose pas le skill installé.
 *
 * Usage : node oracles\oracle-controle-maison.mjs <fichier…> [--registre <json>] | --self-test
 * Exit : 0 PASS ou SKIP · 1 FAIL · 2 erreur.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { tmpdir } from "node:os";
import { racineConfigInstallee } from "../scripts/lib-config-installee.mjs";
import { fileURLToPath } from "node:url";

/**
 * LE REGISTRE SE RÉSOUT PARESSEUSEMENT, ET C'EST TF-1297 QUI L'A EXIGÉ (décision humaine A-21 du
 * 22/09/2026).
 *
 * Cette ligne était `const REGISTRE_PAR_DEFAUT = join(homedir(), …)` AU NIVEAU MODULE. Sur un
 * serveur d'intégration sans répertoire personnel, `homedir()` lève `SystemError:
 * uv_os_homedir returned ENOENT` — et le module plante AVANT d'avoir produit le moindre verdict.
 * Il ne rend alors ni PASS, ni FAIL, ni SKIP : il ne rend RIEN, et son consommateur, la règle CM-1
 * de `hook-ecriture.mjs`, lit cette absence comme un échec de sa propre règle. Le défaut se paie
 * donc chez un TIERS et reste invisible ici : la même recette rend 14 cas verts sur 14 sur ce
 * poste, et échoue en isolement. C'est la simulation du circuit hébergé du 22/09 qui l'a trouvé.
 *
 * La résolution passe désormais par `scripts\lib-config-installee.mjs`, qui rend la racine ET la
 * variable qui l'a décidée, et qui rend `null` plutôt que de lever quand rien n'est résolvable.
 */
export function registreParDefaut(env = process.env) {
  const r = racineConfigInstallee(env);
  if (!r.racine) return { chemin: null, decide_par: r.decidee_par };
  return {
    chemin: join(r.racine, "skills", "quality-oracles", "references", "registre-oracles.json"),
    decide_par: r.decidee_par,
  };
}

/** Un fichier dont le NOM annonce un contrôle. La convention est celle du parc, pas une devinette. */
const NOM_DE_CONTROLE = /^(oracle|verifier|verificateur|controle|controler|check|checker|valider|validateur|audit|auditer)[-_.]/i;
const EXTENSIONS = /\.(mjs|js|cjs|ts|py|sh|ps1)$/i;

/** L'exemption, écrite DANS le fichier — la seule forme qui voyage avec lui. */
const EXEMPTION = /oracle-du-socle\s*:\s*(\S.{4,})/i;

const MOTS_OUTILS = new Set([
  "dans", "pour", "avec", "sans", "leur", "elle", "cette", "celui", "tout", "tous", "toute",
  "plus", "moins", "entre", "chaque", "selon", "apres", "avant", "depuis", "vers", "sous",
  "structurel", "structure", "general", "generale", "autres", "aussi", "meme", "etre", "avoir",
]);

const NORMALISER = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Les mots signifiants d'un libellé : plus de quatre lettres, hors mots outils. */
export function signature(libelle) {
  return new Set(NORMALISER(libelle).split(/[^a-z0-9]+/).filter((m) => m.length > 4 && !MOTS_OUTILS.has(m)));
}

/** Lit le registre. Rend `[]` si absent ou illisible — l'appelant le DIT, il ne le suppose pas. */
export function lireRegistre(chemin = null) {
  const cible = chemin || registreParDefaut().chemin;
  if (!cible) return [];
  try {
    const j = JSON.parse(readFileSync(cible, "utf8"));
    return (j.oracles || []).filter((o) => o && o.domaine);
  } catch { return []; }
}

/**
 * Juge UN fichier. `{ regle, statut, ou, message }`.
 * `statut` : SKIP (pas un contrôle, ou registre absent) · PASS (aucun domaine couvert reconnu,
 * ou exemption écrite) · FAIL (un domaine du registre couvre déjà ce que ce contrôle annonce).
 */
export function jugerControle(chemin, registre, texte = null) {
  const nom = basename(chemin);
  if (!EXTENSIONS.test(nom) || !NOM_DE_CONTROLE.test(nom)) {
    return { regle: "CM-1", statut: "SKIP", ou: nom, message: "le nom n'annonce pas un contrôle — la question ne se pose pas" };
  }
  if (!registre.length) {
    return { regle: "CM-1", statut: "SKIP", ou: nom,
      message: `registre des oracles absent ou illisible (${registreParDefaut().chemin || registreParDefaut().decide_par}) — le domaine n'est pas jugé, il est DIT non jugé` };
  }
  let contenu = texte;
  if (contenu === null) {
    try { contenu = readFileSync(chemin, "utf8"); } catch { contenu = ""; }
  }
  const entete = contenu.split(/\r?\n/).slice(0, 60).join("\n");
  const exemption = EXEMPTION.exec(entete);
  if (exemption) {
    return { regle: "CM-1", statut: "PASS", ou: nom,
      message: `exemption écrite dans le fichier : « ${exemption[1].trim().slice(0, 110)} »` };
  }
  // UN ORACLE DU REGISTRE N'EST PAS UN CONTRÔLE MAISON, et l'oublier retournait la règle contre
  // ceux qu'elle protège. Première mesure sur le pilot : 37 accusations sur 57 fichiers jugés —
  // `oracle-ecriture.mjs` accusé de dupliquer le domaine « Style rédactionnel » dont il EST
  // l'oracle. *Un oracle qui crie à 65 % ne se lit plus, il se désactive.* Le registre nomme les
  // scripts qu'il invoque : ils sortent de la portée par construction, pas par liste tenue à la main.
  const invoques = new Set();
  for (const o of registre) {
    for (const part of [].concat(o.cmd || [], o.invocation || [], o.checklist || []))
      for (const m of String(part).split(/[\\/\s]+/)) if (EXTENSIONS.test(m)) invoques.add(NORMALISER(m));
  }
  if (invoques.has(NORMALISER(nom))) {
    return { regle: "CM-1", statut: "PASS", ou: nom,
      message: "ce fichier EST un oracle du registre quality-oracles — il n'a rien à invoquer d'autre" };
  }
  // LE RAPPROCHEMENT SE FAIT SUR LE NOM, PAS SUR L'EN-TÊTE. Deuxième leçon de la même mesure :
  // l'en-tête d'un oracle bien écrit cite les domaines voisins, les contrôles qu'il délègue et
  // ceux dont il se distingue — donc il touche presque tout le registre. Le NOM, lui, dit le sujet
  // que l'auteur s'est donné, et c'est exactement ce qu'il s'agit de confronter au registre.
  const mots = signature(nom.replace(EXTENSIONS, "").replace(/[-_.]/g, " "));
  const motsEntete = signature(entete);
  const touches = [];
  for (const o of registre) {
    const sig = signature(o.domaine);
    const communs = [...sig].filter((m) => mots.has(m));
    // Deux mots du NOM, ou un mot du nom appuyé par deux de l'en-tête : un seul mot partagé
    // rapproche par hasard (« tests », « donnees »), trois n'attraperait presque rien.
    const appui = communs.length === 1 ? [...sig].filter((m) => motsEntete.has(m) && !mots.has(m)) : [];
    if (communs.length >= 2 || (communs.length === 1 && appui.length >= 2))
      touches.push({ domaine: o.domaine, statut: o.statut, communs: communs.concat(appui) });
  }
  if (!touches.length) {
    return { regle: "CM-1", statut: "PASS", ou: nom,
      message: `aucun des ${registre.length} domaines du registre ne recouvre ce contrôle — il couvre un domaine neuf (règle §4 de quality-oracles : l'y remonter)` };
  }
  touches.sort((a, b) => b.communs.length - a.communs.length);
  return { regle: "CM-1", statut: "FAIL", ou: nom,
    message: `${touches.length} domaine(s) du registre quality-oracles recouvrent déjà ce contrôle : ` +
      touches.slice(0, 3).map((t) => `« ${t.domaine} » (${t.statut}, mots communs : ${t.communs.join(", ")})`).join(" · ") +
      " — invoquer l'oracle du registre, ou écrire l'exemption DANS ce fichier : une ligne `oracle-du-socle: <motif>`. " +
      "Deux implémentations d'un même jugement divergent, et c'est la classe `oracle-remplace-par-controle-maison`, " +
      "12 récidives sur 14 au 14/09/2026." };
}

// ── LA RECETTE ───────────────────────────────────────────────────────────────────────────────

const REGISTRE_ESSAI = [
  { domaine: "Sécurité / secrets", statut: "ok" },
  { domaine: "Accessibilité (WCAG structurel)", statut: "ok" },
  { domaine: "Rendu HTML / visuel", statut: "ok" },
];

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "controle-maison-"));
  const casse = [];
  const f = (nom, contenu) => { const p = join(dir, nom); writeFileSync(p, contenu, "utf8"); return p; };

  // ROUGE — un contrôle de sécurité écrit à la main, sur un domaine que le registre couvre. C'est
  // le cas réel de TF-1046, mot pour mot : « faute d'avoir cherché l'oracle du domaine ».
  const rouge = f("verifier-securite-secrets.mjs", "// Cherche les secrets et les tokens du dépôt.\n");
  const rr = jugerControle(rouge, REGISTRE_ESSAI);
  if (rr.statut !== "FAIL") casse.push(`rouge : un contrôle « securite secrets » écrit à la main passe alors que le registre couvre le domaine — ${rr.statut} : ${rr.message.slice(0, 120)}`);

  // VERTE PAR EXEMPTION — le MÊME fichier, une ligne de motif en plus. Sans cette sortie, la règle
  // se contournerait au lieu de se satisfaire (leçon payée sur S11 avant `hors_mandat`).
  const exempt = f("verifier-securite-secrets-exempt.mjs",
    "// Cherche les secrets et les tokens du dépôt.\n// oracle-du-socle: le socle juge le dépôt entier, ici on juge un seul artefact avant publication.\n");
  const re = jugerControle(exempt, REGISTRE_ESSAI);
  if (re.statut !== "PASS") casse.push(`exemption : la ligne \`oracle-du-socle:\` n'éteint pas la règle — ${re.statut} : ${re.message.slice(0, 120)}`);

  // VERTE PAR DOMAINE NEUF — un contrôle dont aucun domaine du registre ne parle. La règle §4 le
  // dit : un domaine sans oracle en reçoit un, et l'y remonter est le geste attendu.
  const neuf = f("verifier-cadence-ferroviaire.mjs", "// Compte les intervalles entre deux passages.\n");
  const rn = jugerControle(neuf, REGISTRE_ESSAI);
  if (rn.statut !== "PASS") casse.push(`domaine neuf : un contrôle hors registre est accusé — ${rn.statut} : ${rn.message.slice(0, 120)}`);

  // VERTE PAR APPARTENANCE — un fichier que le registre INVOQUE est l'oracle du domaine, pas son
  // doublon. Sans ce cas, la première mesure accusait 37 des 57 contrôles du pilot, dont ceux dont
  // le registre nomme le chemin : la règle se retournait contre ceux qu'elle protège.
  const duSocle = f("oracle-perf.mjs", "// Budgets de poids et de DOM.\n");
  const rs = jugerControle(duSocle, REGISTRE_ESSAI.concat([{ domaine: "Performance / poids", statut: "ok", cmd: ["node", "scripts/oracle-perf.mjs", "{file}"] }]));
  if (rs.statut !== "PASS" || !/EST un oracle du registre/.test(rs.message))
    casse.push(`appartenance : un fichier que le registre INVOQUE est accusé de le dupliquer — ${rs.statut} : ${rs.message.slice(0, 120)}`);

  // HORS PORTÉE — un fichier dont le nom n'annonce aucun contrôle.
  const hors = f("generer-vue.mjs", "// Génère une vue.\n");
  if (jugerControle(hors, REGISTRE_ESSAI).statut !== "SKIP") casse.push("un fichier qui n'annonce pas un contrôle est jugé");

  // REGISTRE ABSENT — SKIP nommé, jamais PASS par silence.
  const sansRegistre = jugerControle(rouge, []);
  if (sansRegistre.statut !== "SKIP" || !/registre/i.test(sansRegistre.message))
    casse.push("registre absent : le contrôle devrait rendre SKIP et le DIRE, jamais passer en silence");

  rmSync(dir, { recursive: true, force: true, maxRetries: 5 });
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test controle-maison : 6/6 PASS (contrôle de sécurité écrit à la main sur un domaine couvert → FAIL ; " +
      "le MÊME fichier avec son exemption écrite → PASS ; contrôle d'un domaine neuf → PASS, règle §4 nommée ; " +
      "fichier que le registre INVOQUE → PASS, il EST l'oracle du domaine ; fichier qui n'annonce pas un contrôle → SKIP ; registre absent → SKIP DIT, jamais PASS par silence)");
  return casse.length ? 1 : 0;
}

// ── LA LIGNE DE COMMANDE ─────────────────────────────────────────────────────────────────────

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replace(/\\/g, "/") === join(dirname(process.argv[1]), basename(process.argv[1])).toLowerCase().replace(/\\/g, "/");
if (lanceEnDirect || process.argv[1]?.endsWith("oracle-controle-maison.mjs")) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  const i = args.indexOf("--registre");
  const registre = lireRegistre(i >= 0 ? args[i + 1] : null);
  const cibles = args.filter((a, k) => !a.startsWith("--") && args[k - 1] !== "--registre");
  if (!cibles.length) {
    console.log(JSON.stringify({ oracle: "oracle-controle-maison", verdict: "ERREUR",
      message: "cible absente — usage : node oracle-controle-maison.mjs <fichier…> [--registre <json>] | --self-test" }, null, 1));
    process.exit(2);
  }
  const findings = cibles.map((c) => jugerControle(c, registre));
  const verdict = findings.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({
    oracle: "oracle-controle-maison", version: "1.0.0", verdict, findings,
    non_juge: [
      "CE QUE LE SCRIPT FAIT : le domaine est rapproché par le NOM et l'EN-TÊTE, jamais par le corps du programme — décider du domaine d'un code demanderait de l'exécuter, et une devinette ferait crier l'oracle sur du travail juste",
      "LA DUPLICATION SÉMANTIQUE entre deux contrôles qui ne partagent aucun mot : deux implémentations d'un même jugement écrites avec des vocabulaires différents lui échappent — c'est la moitié la plus coûteuse de la classe (TF-0921, TF-0940), et elle reste ouverte",
      "la SINCÉRITÉ d'une exemption : une ligne `oracle-du-socle:` posée sur un contrôle qui duplique vraiment le socle satisfait la règle sans rien prouver — seul un lecteur le voit",
      "les contrôles écrits SANS convention de nom : un `mesurer-x.mjs` ou un `garde.py` n'est pas reconnu comme un contrôle",
    ],
  }, null, 1));
  process.exit(verdict === "FAIL" ? 1 : 0);
}
