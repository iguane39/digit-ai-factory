/**
 * lib-gestes-en-cours.mjs — LE REGISTRE DES GESTES DISTANTS EN COURS, PARTAGÉ PAR LES SESSIONS D'UN
 * PRODUIT (TF-2084, retour RT-39 du lot Produit-84 20261103b).
 *
 * LE FAIT. Le 29/10/2026, deux sessions d'un même produit ont agi sur les mêmes ressources distantes sans
 * se voir : deux compartiments de stockage créés à deux minutes d'écart, un projet d'hébergement recréé
 * pendant le test d'une autre session, une erreur 522 attribuée à tort au fournisseur, deux bancs
 * simultanés faussés. Chaque session lisait l'état distant, jamais l'intention de l'autre. Voisin de
 * TF-2045 (`mobilisation.jsonl` écrit par deux sessions) et de TF-1872 (registre des numéros de décision).
 *
 * LE REGISTRE. Un fichier `forge/gestes-en-cours.jsonl`, ajouté (jamais réécrit), une ligne par événement :
 *   · `debut` : { schema, ev, id, session, ressource, perimetre, geste, ts, expire }
 *   · `fin`   : { schema, ev, id, session, ressource, ts }
 * Un geste est OUVERT tant qu'il a un `debut` sans `fin` et que son `expire` n'est pas passé. L'expiration
 * (15 minutes par défaut, 4 heures au plus) est la seule preuve de vie : une session tuée sans avoir fermé
 * son geste cesse d'être comptée à l'expiration. `ressource` est l'objet visé (`wrangler r2 bucket rapports`),
 * `perimetre` le groupe qui le contient (`wrangler r2 bucket`) : deux sessions sur la MÊME ressource, ou sur le
 * même périmètre avec des noms différents (deux compartiments créés pour le même usage), sont signalées.
 * Le fichier est écrit dans l'arbre PRINCIPAL du dépôt, lu dans tous les arbres de travail liés : deux
 * sessions du même produit, l'une dans un `git worktree`, se voient.
 *
 * CE QUE CE MODULE NE FAIT PAS. Il ne bloque rien : la lecture AVERTIT. Il ne reconnaît aucune commande : la
 * liste fermée des gestes vit dans `hook-gestes-distants.mjs`, qui sait lire une commande. Il ne prouve pas la
 * vie d'une session (voir l'expiration).
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const FICHIER_EN_COURS = "forge/gestes-en-cours.jsonl";
export const DUREE_DEFAUT_MIN = 15;
export const DUREE_MAX_MIN = 240;
const MIN = 60_000;

/** Les lignes lisibles du registre aux racines données (une ligne illisible est ignorée). */
export function lireRegistre(racines) {
  const lignes = [];
  for (const r of racines) {
    const chemin = join(r, ...FICHIER_EN_COURS.split("/"));
    if (!existsSync(chemin)) continue;
    let brut = "";
    try { brut = readFileSync(chemin, "utf8"); } catch { continue; }
    for (const l of brut.split(/\r?\n/)) {
      if (!l.trim()) continue;
      try { const o = JSON.parse(l); if (o && typeof o === "object") lignes.push(o); } catch { /* ligne illisible : ignorée */ }
    }
  }
  return lignes;
}

/** Les `debut` encore ouverts à `maintenant` : sans `fin`, et non expirés. */
export function gestesOuverts(lignes, maintenant = Date.now()) {
  const fermes = new Set(lignes.filter((l) => l.ev === "fin").map((l) => l.id));
  return lignes.filter((l) => l.ev === "debut" && l.id && !fermes.has(l.id) && Date.parse(l.expire) > maintenant);
}

/** Les gestes ouverts d'une AUTRE session sur la même ressource ou le même périmètre. */
export function conflits(ouverts, { ressource, perimetre }, session) {
  const sortie = [];
  for (const g of ouverts) {
    if (g.session === session) continue;
    if (g.ressource === ressource) sortie.push({ geste: g, niveau: "ressource" });
    else if (perimetre && g.perimetre === perimetre) sortie.push({ geste: g, niveau: "perimetre" });
  }
  return sortie;
}

const identifiant = (maintenant) => `${maintenant.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** La ligne `debut` d'un geste. La durée est bornée à `DUREE_MAX_MIN`. */
export function ligneDebut({ session, ressource, perimetre = null, geste = "", dureeMin = DUREE_DEFAUT_MIN }, maintenant = Date.now()) {
  const duree = Math.min(Math.max(Number(dureeMin) || DUREE_DEFAUT_MIN, 1), DUREE_MAX_MIN);
  return {
    schema: "pilot/gestes-en-cours@1", ev: "debut", id: identifiant(maintenant), session: session || "inconnue", ressource, perimetre,
    geste: String(geste).slice(0, 200), ts: new Date(maintenant).toISOString(), expire: new Date(maintenant + duree * MIN).toISOString(),
  };
}

/** La ligne `fin` d'un geste ouvert. */
export const ligneFin = (ouvert, maintenant = Date.now()) => ({
  schema: "pilot/gestes-en-cours@1", ev: "fin", id: ouvert.id, session: ouvert.session, ressource: ouvert.ressource, ts: new Date(maintenant).toISOString(),
});

/** Ajoute une ligne au registre de la racine donnée (l'arbre principal). */
export function ecrireLigne(racine, ligne) {
  const chemin = join(racine, ...FICHIER_EN_COURS.split("/"));
  mkdirSync(dirname(chemin), { recursive: true });
  appendFileSync(chemin, JSON.stringify(ligne) + "\n", "utf8");
  return chemin;
}

/**
 * Ouvre un geste : rend les conflits avec les autres sessions, puis inscrit le `debut`. Un geste déjà ouvert
 * par la MÊME session sur la même ressource n'est pas réinscrit (une boucle de tentatives n'empile rien).
 */
export function ouvrir(racines, racineEcriture, spec, maintenant = Date.now()) {
  const ouverts = gestesOuverts(lireRegistre(racines), maintenant);
  const autres = conflits(ouverts, spec, spec.session || "inconnue");
  const dejaMien = ouverts.some((g) => g.session === (spec.session || "inconnue") && g.ressource === spec.ressource);
  if (!dejaMien) ecrireLigne(racineEcriture, ligneDebut(spec, maintenant));
  return { conflits: autres, ouvert: !dejaMien };
}

/** Ferme les gestes ouverts de la session sur la ressource (toutes les ressources si `ressource` est null). */
export function clore(racines, racineEcriture, { session, ressource = null }, maintenant = Date.now()) {
  const ouverts = gestesOuverts(lireRegistre(racines), maintenant)
    .filter((g) => g.session === (session || "inconnue") && (ressource === null || g.ressource === ressource));
  for (const g of ouverts) ecrireLigne(racineEcriture, ligneFin(g, maintenant));
  return ouverts.length;
}

// ---------------------------------------------------------------------------------------------
// Les créations consignées et le retrait admis sans décision groupée (TF-2128, D-168 (a) du 04/11/2026)
// ---------------------------------------------------------------------------------------------
// Le fait (RP-6, lot Produit-86 20261103d) : changer la région d'un réseau VIDE créé dix minutes plus tôt exigeait une
// décision groupée ; la session l'a dupliqué, et l'original est resté facturé. La décision humaine : « La liste fermée
// des gestes distants admet, sans décision groupée, le retrait d'une ressource créée par la même session, consignée à
// sa création avec son identifiant, et sans aucune dépendance. »
//
// Trois événements s'ajoutent au registre, écrits au retour d'un outil RÉUSSI (PostToolUse) :
//   · `creation`     : { schema, ev, id, session, ressource, perimetre, chemin, identite, id_distant, references, opaque, geste, ts }
//   · `modification` : un geste mutant autre que create/delete qui cite d'autres ressources (références seules) ;
//   · `retrait`      : { schema, ev, id (de la création retirée), session, ressource, ts }.
// `ressource` et `perimetre` sont ceux du `debut` du même geste ; `identite` porte nom, groupe de ressources, abonnement
// et les options `*-name` (réseau parent, compte) qui distinguent deux ressources de même nom ; `id_distant` est l'identifiant
// que la sortie de l'outil donne (champ `id`), quand il le donne ; `references` les valeurs des autres options (les ressources
// que la commande cite).

/** Les groupes dont le contenu n'est pas énumérable par le hook : leur retrait n'est jamais admis. */
export const CONTENEURS = new Set(["az group", "ps azresourcegroup"]);

const minus = (x) => String(x ?? "").trim().toLowerCase();

/** La ligne `creation` d'une ressource créée par la session. */
export function ligneCreation({ session, ressource, perimetre = null, chemin, identite = {}, id_distant = null, references = [], opaque = false, geste = "" }, maintenant = Date.now()) {
  return {
    schema: "pilot/gestes-en-cours@1", ev: "creation", id: identifiant(maintenant), session: session || "inconnue", ressource, perimetre, chemin, identite,
    id_distant: id_distant || null, references, opaque: !!opaque, geste: String(geste).slice(0, 200), ts: new Date(maintenant).toISOString(),
  };
}

/** La ligne `modification` : un geste mutant qui cite d'autres ressources (leur retrait n'est plus sans dépendance). */
export function ligneModification({ session, references = [], opaque = false, geste = "" }, maintenant = Date.now()) {
  return { schema: "pilot/gestes-en-cours@1", ev: "modification", id: identifiant(maintenant), session: session || "inconnue", references, opaque: !!opaque, geste: String(geste).slice(0, 200), ts: new Date(maintenant).toISOString() };
}

/** La ligne `retrait` d'une création retirée. */
export const ligneRetrait = (creation, session, maintenant = Date.now()) => ({
  schema: "pilot/gestes-en-cours@1", ev: "retrait", id: creation.id, session: session || "inconnue", ressource: creation.ressource, ts: new Date(maintenant).toISOString(),
});

/** Les créations consignées et pas encore retirées. */
export function creationsVivantes(lignes) {
  const retires = new Set(lignes.filter((l) => l.ev === "retrait").map((l) => l.id));
  return lignes.filter((l) => l.ev === "creation" && l.id && !retires.has(l.id));
}

/** Une création est-elle la ressource visée ? Par identifiant distant (`--ids`), sinon par chemin de commande + identité. */
export function viseeParCible(creation, cible) {
  if (cible.ids?.length) return !!creation.id_distant && cible.ids.some((i) => minus(i) === minus(creation.id_distant));
  if (!cible.nom || creation.chemin !== cible.chemin) return false;
  const c = creation.identite || {}, v = cible.identite || {};
  if (minus(c.name) !== minus(v.name) || minus(c["resource-group"]) !== minus(v["resource-group"]) || minus(c.subscription) !== minus(v.subscription)) return false;
  return Object.keys(v).every((k) => ["name", "resource-group", "subscription"].includes(k) || minus(c[k]) === minus(v[k]));
}

/** Une valeur de paramètre cite-t-elle cette création ? Le nom comme segment, ou l'identifiant distant comme préfixe. */
function cite(valeur, creation) {
  const v = minus(valeur), nom = minus(creation.identite?.name), id = minus(creation.id_distant);
  return (!!nom && v.split("/").includes(nom)) || (!!id && (v === id || v.startsWith(id + "/")));
}

const refus = (condition, raison) => ({ ok: false, condition, raison });

/**
 * Le retrait de `cible` est-il admis sans décision groupée ? Trois conditions, la première non tenue est nommée :
 *  (b) la création est consignée avec son identifiant, (a) par la même session, (c) sans aucune dépendance consignée.
 * `cible` : { chemin, nom, identite, ids, libelle } ; `session` : l'identifiant de session du hook.
 * Rend { ok: true, creation } ou { ok: false, condition: "a"|"b"|"c", raison }.
 */
export function jugerRetrait(lignes, cible, session) {
  const libelle = cible.libelle || cible.nom || (cible.ids || []).join(" ");
  if (!cible.nom && !(cible.ids || []).length) return refus("b", "l'identifiant de la ressource n'est pas déterminable : la commande ne porte ni --name ni --ids");
  const trouvees = creationsVivantes(lignes).filter((c) => viseeParCible(c, cible));
  if (!trouvees.length) return refus("b", `aucune création consignée pour ${libelle} : le registre des gestes en cours (forge/gestes-en-cours.jsonl) n'a pas la trace d'une création réussie par une session de ce produit`);
  if (!session || session === "inconnue") return refus("a", `la session qui retire n'est pas identifiée (pas de session_id) : impossible de dire si elle a créé ${libelle}`);
  const autres = trouvees.filter((c) => c.session !== session);
  if (autres.length) return refus("a", `${libelle} a été créée ou recréée par la session ${autres[0].session}, pas par celle-ci (${session})`);
  const cree = trouvees.reduce((a, b) => (Date.parse(a.ts) <= Date.parse(b.ts) ? a : b));
  if (CONTENEURS.has(cree.chemin)) return refus("c", `${libelle} est un groupe de ressources : son contenu (terraform, portail, autre session non consignée) n'est pas énumérable par le hook, donc l'absence de dépendance n'est pas constatable`);
  const t0 = Date.parse(cree.ts);
  const retires = new Set(lignes.filter((l) => l.ev === "retrait").map((l) => l.id));
  for (const l of lignes) {
    if (l.id === cree.id || !(Date.parse(l.ts) >= t0)) continue;
    if (l.ev === "debut" && /^terraform /.test(String(l.ressource))) return refus("c", `terraform ou tofu a agi (session ${l.session}) après la création de ${libelle} : les ressources qu'il gère échappent au hook`);
    if ((l.ev !== "creation" && l.ev !== "modification") || retires.has(l.id)) continue;
    if (l.opaque) return refus("c", `« ${l.geste} » (session ${l.session}) a un paramètre par variable, par fichier ou un déploiement : ses dépendances ne sont pas constatables`);
    const dep = (l.references || []).find((r) => cite(r, cree));
    if (dep !== undefined) return refus("c", `« ${l.geste} » (session ${l.session}) cite ${libelle} (paramètre « ${dep} ») : retirer ${libelle} casserait cette ressource`);
  }
  return { ok: true, creation: cree };
}

/** L'avertissement qui nomme chaque geste concurrent et ce qu'il faut en faire. Texte vide s'il n'y en a pas. */
export function avertissement(trouves, { ressource }, maintenant = Date.now()) {
  if (!trouves.length) return "";
  const lignes = trouves.map(({ geste: g, niveau }) => {
    const depuis = Math.max(0, Math.round((maintenant - Date.parse(g.ts)) / MIN));
    const jusqua = new Date(Date.parse(g.expire)).toISOString().slice(11, 16);
    return `${niveau === "ressource" ? "même ressource" : "même périmètre"} : la session ${g.session} a ouvert « ${g.geste || g.ressource} » `
      + `sur ${g.ressource} il y a ${depuis} min (compté jusqu'à ${jusqua} UTC)`;
  });
  return `GESTE DISTANT CONCURRENT (TF-2084) — avant d'agir sur ${ressource}, une autre session du produit a un geste distant ouvert : ${lignes.join(" ; ")}. `
    + "Avertissement, rien n'est bloqué. Remède : lire l'état distant (commande de lecture) avant de créer, supprimer ou redéployer ; "
    + "attendre la fin du geste de l'autre session ou lui laisser la ressource ; ne pas attribuer une erreur distante (522, 5xx) au fournisseur "
    + "avant d'avoir exclu l'autre session. Le fait : le 29/10/2026, deux sessions d'un produit ont créé deux compartiments de stockage à deux "
    + "minutes d'écart et recréé un projet d'hébergement pendant le test de l'autre.";
}
