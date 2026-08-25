#!/usr/bin/env node
/**
 * oracle-constantes-externes.mjs — UNE CONSTANTE QUI DÉSIGNE UNE RESSOURCE EXTERNE DIT COMMENT ON
 * L'A VÉRIFIÉE (R-49, TF-0544, 24/08/2026).
 *
 * LE FAIT, ET IL A FONDÉ UNE DÉCISION HUMAINE FAUSSE. Un fichier de configuration portait, au-dessus
 * de sa constante de suivi : « Identifiants de suivi repris de l'ancien site (continuité Analytics à
 * la migration) ». Ni date, ni source, ni moyen de rejouer la vérification — et pourtant traité comme
 * un fait. Sur cette base, l'agent a annoncé à l'humain que les deux identifiants appartenaient à
 * l'autre domaine ; l'humain a décidé que celui-ci devait avoir les siens ; la constante a été vidée ;
 * régression, intégration continue rouge, correctif.
 *
 * L'API faisant autorité disait l'inverse et l'a établi en TRENTE SECONDES : le flux avait été créé
 * le 15/08 à 12:12, `updateTime == createTime` — donc jamais modifié — et son URL par défaut était
 * bien celle de ce domaine. Le conteneur portait même le nom du domaine.
 *
 * *Un commentaire n'est pas une source.* Il vieillit sans prévenir, il survit à ce qu'il décrit, et il
 * se lit avec l'autorité de ce qui est écrit dans le code. C'est la loi transverse n° 1 appliquée aux
 * FAITS et non plus aux affordances : une affirmation est vérifiable ou elle n'existe pas.
 *
 *   CE1 · une constante qui désigne une ressource EXTERNE (URL, identifiant de service, compte,
 *         entrepôt) porte un en-tête à trois champs — DATE de vérification, SOURCE faisant autorité,
 *         COMMANDE pour la rejouer. Deux champs sur trois ne suffisent pas : sans la commande, la
 *         vérification n'est pas rejouable ; sans la date, elle ne périme jamais ; sans la source,
 *         elle n'est qu'une opinion mieux écrite.
 *   CE2 · un commentaire qui AFFIRME un fait externe sans ces trois champs est signalé même quand la
 *         constante, elle, est nue — c'est la forme exacte du défaut fondateur.
 *
 * L'ÉCHAPPATOIRE EST NOMMÉE : `hypothese-assumee` sur la ligne ou juste au-dessus. Une hypothèse
 * déclarée est honnête ; c'est une hypothèse déguisée en fait qui coûte. La règle ne demande pas de
 * tout vérifier, elle demande de ne pas confondre les deux.
 *
 * Usage : node oracle-constantes-externes.mjs <fichier|dossier> [… ] [--json] · --self-test
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé.
 */
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "la VÉRITÉ de ce qu'affirme un en-tête : l'oracle exige une date, une source, une commande et des limites, pas qu'elles disent vrai. Vérifier le fond demanderait d'appeler les API tierces — ce que l'en-tête sert justement à rendre possible pour un humain",
  "les constantes INTERNES au projet (chemins, seuils, libellés) : elles ne désignent aucune autorité extérieure, donc rien à re-vérifier ailleurs",
  "les fichiers qui ne sont pas de la CONFIGURATION : un identifiant cité dans un test ou une note ne prétend pas être la valeur de production",
  "une valeur qui vient d'une variable d'environnement : la ressource est désignée ailleurs, et c'est là que la question se pose",
  "les fichiers déclarés `hypothese-assumee` : une hypothèse écrite comme telle est honnête, et la règle ne demande pas de tout vérifier — elle demande de ne pas déguiser une hypothèse en fait",
];

/** Un fichier de CONFIGURATION : c'est là qu'une constante prétend valoir pour la production. */
const EST_CONFIG = /(^|[\\/])(config|configuration|constantes?|data|env|settings|parametres|params)[.\-_a-z0-9]*\.(mjs|cjs|js|ts|py|json)$/i;

/** Une valeur qui désigne une ressource EXTERNE. Les formes que le parc a réellement portées. */
const VALEUR_EXTERNE = [
  /https?:\/\//i,                     // une URL : la ressource vit ailleurs, par définition
  /\bG(TM)?-[A-Z0-9]{6,}\b/,          // mesure d'audience : GTM-…, G-…
  /\bUA-\d{4,}-\d+\b/,                // ancienne mesure d'audience
  /\bprop(riete|id)\b/i,              // propriété d'un compte tiers
  /\b[a-z0-9-]+\.(fr|com|io|net|org|dev)\b/i, // un domaine nu
];

/** Un nom de constante qui annonce une ressource externe même quand la valeur est opaque. */
const NOM_EXTERNE = /(URL|URI|BASE|ENDPOINT|HOST|DOMAIN|DOMAINE|ACCOUNT|COMPTE|PROPID|PROP_ID|TRACKING|ANALYTICS|GTM|TENANT|WAREHOUSE|CATALOG|BUCKET|API_?KEY|CLIENT_?ID)/i;

/** Les trois champs d'un en-tête vérifiable. Chacun a sa raison, et aucun ne remplace un autre. */
const CHAMP_DATE = /(vérifié le|verifie le|vérifiée le|au\s+\d{2}[\/.]\d{2}[\/.]\d{4}|\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\/\d{2}\/\d{4}\b)/i;
const CHAMP_SOURCE = /(source\s*:|d'après|d apres|selon\s|autorité|autorite|API\s|console\s|tableau de bord|faisant foi)/i;
const CHAMP_REJOUER = /(rejouer|pour (le |la )?revérifier|revérifier|reverifier|commande\s*:|`[^`]*(curl|gcloud|az |aws |gh |node |python)[^`]*`|\$ )/i;
// TF-0587 (lot Produit-02 20260824) — le QUATRIEME champ : les LIMITES STRUCTURELLES.
//
// Le fait fondateur : la redirection DNS d'un hebergeur est le geste naturel quand on tient deja
// la zone par son API, et RIEN dans la reponse de cette API ne signale qu'elle n'ecoute pas le
// port 443 — l'objet retourne ne porte que le sous-domaine, la cible et le type. La limite ne se
// decouvre qu'en testant le port. Consequence payee : sept hostnames sur huit muets en HTTPS, et
// le seul remede complet imposait de recreer les enregistrements de messagerie — un risque sans
// commune mesure avec le confort initial.
//
// « Une limite decouverte apres coup coute un changement d'architecture ; la meme limite ecrite
// avant coute le choix d'un autre mecanisme. »
//
// DECLARER « aucune limite connue » EST GRATUIT et suffit — meme patron que R-45 : l'omission ne
// vaut pas decision, mais l'aveu d'ignorance, lui, est honnete et se date.
const CHAMP_LIMITES = /(limites?\s+(structurelles?|connues?)|limite\s*:|aucune\s+limite\s+connue|ne\s+(sert|ecoute|supporte|couvre)\s+(pas|que))/i;

/** L'échappatoire déclarative. */
const ASSUME = /hypothese-assumee|hypothèse-assumée|hypothese assumee/i;

/** Une AFFIRMATION sur une ressource externe — la forme du défaut fondateur. */
const AFFIRME = /(repris de|provient de|appartient|appartiennent|est celui de|sont ceux de|hérité de|herite de|inchangé depuis|inchange depuis|créé pour|cree pour|fourni par)/i;

const LIGNE_COMMENTAIRE = /^\s*(\/\/|#|\*|\/\*)/;

export function juger(source, nom = "fichier") {
  const constats = [];
  const lignes = source.split(/\r?\n/);
  for (const [i, ligne] of lignes.entries()) {
    // La déclaration d'une constante : `const X = …`, `X = …`, `"X": …`, `X: …`
    const m = /(?:const|let|var)\s+([A-Z][A-Z0-9_]{2,})\s*=|^\s*([A-Z][A-Z0-9_]{2,})\s*[:=]/.exec(ligne);
    if (!m) continue;
    const cle = m[1] || m[2];
    const valeurEtSuite = lignes.slice(i, i + 6).join("\n");
    const externe = NOM_EXTERNE.test(cle) || VALEUR_EXTERNE.some((r) => r.test(valeurEtSuite));
    if (!externe) continue;

    // L'en-tête : les commentaires qui PRÉCÈDENT immédiatement la constante.
    const entete = [];
    for (let k = i - 1; k >= 0 && (LIGNE_COMMENTAIRE.test(lignes[k]) || !lignes[k].trim()); k--) {
      if (lignes[k].trim()) entete.unshift(lignes[k]);
    }
    const texte = entete.join("\n");
    if (ASSUME.test(texte) || ASSUME.test(ligne)) continue;   // hypothèse déclarée : honnête

    const manque = [];
    if (!CHAMP_DATE.test(texte)) manque.push("la DATE de vérification (sans elle, elle ne périme jamais)");
    if (!CHAMP_SOURCE.test(texte)) manque.push("la SOURCE faisant autorité (sans elle, c'est une opinion mieux écrite)");
    if (!CHAMP_REJOUER.test(texte)) manque.push("la COMMANDE pour la rejouer (sans elle, la vérification n'est pas rejouable)");
    if (!CHAMP_LIMITES.test(texte)) manque.push("les LIMITES STRUCTURELLES connues, ou l'aveu « aucune limite connue » (TF-0587 : une limite découverte après coup coûte un changement d'architecture ; écrite avant, elle coûte le choix d'un autre mécanisme)");
    if (!manque.length) continue;

    const affirme = AFFIRME.test(texte);
    if (!texte.trim()) {
      constats.push({ regle: "CE1", ligne: i + 1, cle, ou: `${nom}:${i + 1}`,
        message: `« ${cle} » désigne une ressource EXTERNE sans un mot sur la façon dont sa valeur a ` +
          "été vérifiée. Quatre champs sont attendus au-dessus : date, source faisant autorité, " +
          "commande pour rejouer, limites structurelles connues (ou « aucune limite connue ») " +
          "— ou l'aveu « hypothese-assumee »" });
      continue;
    }
    constats.push({ regle: affirme ? "CE2" : "CE1", ligne: i + 1, cle, ou: `${nom}:${i + 1}`,
      message: (affirme
        ? `« ${cle} » porte un commentaire qui AFFIRME un fait externe — « ${texte.trim().replace(/\s+/g, " ").slice(0, 80)} » — `
        : `« ${cle} » désigne une ressource externe et son en-tête est incomplet — `) +
        `il manque ${manque.join(", ")}. C'est la forme exacte du défaut du 24/08 : un commentaire ` +
        "s'est lu comme une preuve, une décision humaine s'est prise dessus, et l'API disait " +
        "l'inverse en trente secondes" });
  }
  return constats;
}

function fichiers(cible) {
  if (!existsSync(cible)) return [];
  if (statSync(cible).isFile()) return [cible];
  const out = [];
  const IGNORE = new Set([".git", "node_modules", ".venv", "dist", "build", "__pycache__", "vendor", "fixtures"]);
  const marche = (d, prof = 0) => {
    if (prof > 6) return;
    let es = []; try { es = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of es) {
      if (IGNORE.has(e.name)) continue;
      const p = join(d, e.name);
      if (e.isDirectory()) marche(p, prof + 1);
      else if (EST_CONFIG.test(p)) out.push(p);
    }
  };
  marche(cible);
  return out;
}

// ---- recette : les deux sens ------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");

if (lanceEnDirect && args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette de oracle-constantes-externes — les deux sens\n");

  const FONDATEUR = "// Identifiants de suivi repris de l'ancien site (continuité Analytics à la migration)\nexport const TRACKING = { gtm: \"GTM-MW8X3G8X\", ga4: \"G-TM75JS7QHJ\" };\n";
  const c1 = juger(FONDATEUR, "data.mjs");
  att("le défaut FONDATEUR est signalé — un commentaire qui affirme sans date ni source", c1.length === 1);
  att("le constat le classe en CE2 : il AFFIRME un fait externe", c1[0]?.regle === "CE2");
  att("le constat nomme les trois champs manquants",
    /DATE/.test(c1[0]?.message) && /SOURCE/.test(c1[0]?.message) && /COMMANDE/.test(c1[0]?.message));

  // TF-0587 (25/08) : l'en-tête vérifiable porte desormais QUATRE champs — les LIMITES
  // STRUCTURELLES rejoignent la date, la source et la commande. Declarer « aucune limite
  // connue » est gratuit et suffit : meme patron que R-45, l'omission ne vaut pas decision
  // mais l'aveu d'ignorance est honnete et se date.
  const CORRIGE = "// Verifie le 2026-08-24 · source : API Google Analytics Admin · rejouer :\n" +
    "// `gcloud alpha analytics data-streams list --account=APB.com` · aucune limite connue\n" +
    "export const TRACKING = { gtm: \"GTM-MW8X3G8X\" };\n";
  att("le meme fichier, en-tete a QUATRE champs, ne declenche rien", juger(CORRIGE, "data.mjs").length === 0);

  // Le cas fondateur de TF-0587, ecrit tel qu'il aurait du l'etre : la limite qui a coute un
  // changement d'architecture tient en huit mots, et elle n'etait nulle part.
  //
  // ENRICHI LE 25/08, en versant TF-0609 a ce dossier (doublon enrichi, decision humaine). Le
  // second produit qui a paye cette limite avait fait la MESURE DIRECTE que le dossier d'origine
  // n'avait pas : port 443 FERME sur 213.186.33.5. C'est la seconde sonde que N-16 exige, et elle
  // change la forme de la limite : « redirection OVH = HTTP seul » se croit, « port 443 FERME sur
  // 213.186.33.5, mesure du 25/08 » se REJOUE. Une limite qui porte son adresse et sa date est
  // opposable ; une limite qui porte un nom de service demande de faire confiance.
  //
  // Le cout paye par ce second produit est d'un autre ordre que le premier, et l'exemple le dit
  // parce qu'un exemple sans son cout n'enseigne rien : sept hostnames sur huit declares
  // fonctionnels apres une mesure jouee en `http://`, injoignables en `https://`, et cette
  // affirmation publiee a l'exploitant. La cause profonde n'est pas la limite de l'API : c'est
  // une verification jouee sur un protocole et conclue sur un autre — meme famille que N-28.
  const AVEC_LIMITE = "// Verifie le 2026-08-24 · source : API OVH /domain/zone · rejouer :\n" +
    "// `curl -s https://eu.api.ovh.com/1.0/domain/zone/x/redirection` ·\n" +
    "// limites structurelles : port 443 FERME sur 213.186.33.5 (mesure directe du 2026-08-25),\n" +
    "//   donc toute redirection posee par cette API est HTTP SEULEMENT ; types valides :\n" +
    "//   visible, invisible, visiblePermanent\n" +
    "export const OVH_ZONE_API = \"https://eu.api.ovh.com/1.0/domain/zone\";\n";
  att("une limite structurelle ecrite satisfait le quatrieme champ", juger(AVEC_LIMITE, "config.mjs").length === 0);

  const SANS_LIMITE = "// Verifie le 2026-08-24 · source : API OVH /domain/zone · rejouer :\n" +
    "// `curl -s https://eu.api.ovh.com/1.0/domain/zone/x/redirection`\n" +
    "export const OVH_ZONE_API = \"https://eu.api.ovh.com/1.0/domain/zone\";\n";
  att("trois champs sur quatre ne suffisent plus : la limite manquante est NOMMEE (TF-0587)",
    juger(SANS_LIMITE, "config.mjs").some((c) => /LIMITES STRUCTURELLES/.test(c.message)));

  att("une constante nue qui désigne une URL est signalée (CE1)",
    juger("export const SITE_URL = \"https://www.exemple.com\";\n", "config.mjs").some((c) => c.regle === "CE1"));

  att("une hypothèse DÉCLARÉE est honnête et n'est pas jugée",
    juger("// hypothese-assumee : à confirmer auprès du client\nexport const BEDS24_BASE = \"https://api.beds24.com\";\n", "config.mjs").length === 0);

  att("une constante INTERNE n'est pas concernée",
    juger("// le seuil vient de la mesure du 12/08\nconst SEUIL_MAX = 42;\n", "config.mjs").length === 0);

  att("deux champs sur trois ne suffisent pas",
    juger("// Vérifié le 2026-08-24 · source : console Beds24\nexport const BEDS24_BASE = \"https://api.beds24.com\";\n", "config.mjs")
      .some((c) => /COMMANDE/.test(c.message)));

  // BORNE : un fichier qui n'est pas de la configuration n'est pas balayé par la découverte.
  att("la découverte ne retient que les fichiers de CONFIGURATION",
    EST_CONFIG.test("build/data.mjs") && !EST_CONFIG.test("src/composant-carte.mjs"));

  // Le fichier réel, sur disque : la découverte et la lecture, pas seulement le jugement.
  const dir = mkdtempSync(join(tmpdir(), "constantes-externes-"));
  writeFileSync(join(dir, "data.mjs"), FONDATEUR, "utf8");
  writeFileSync(join(dir, "composant.mjs"), FONDATEUR, "utf8");   // même contenu, mais pas un fichier de config
  const trouves = fichiers(dir);
  att("sur disque, seul le fichier de configuration est lu",
    trouves.length === 1 && trouves[0].endsWith("data.mjs"));
  rmSync(dir, { recursive: true, force: true });

  console.log(`\nRecette constantes-externes : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

if (lanceEnDirect) {
  const cibles = args.filter((a) => !a.startsWith("--"));
  if (!cibles.length) so("CE0", "(aucun argument)", "aucune cible — cet oracle juge un fichier ou un dossier qu'on lui passe");
  let lus = 0; const trouves = [];
  for (const cible of cibles) {
    const liste = fichiers(cible);
    if (!liste.length) { so("CE0", cible, "aucun fichier de configuration trouvé — rien à juger, et le dire vaut mieux qu'un PASS trompeur"); continue; }
    for (const f of liste) {
      lus += 1;
      const rel = relative(process.cwd(), f).replaceAll("\\", "/") || f;
      for (const c of juger(readFileSync(f, "utf8"), rel)) trouves.push(c);
    }
  }
  if (lus && !trouves.length) ok("CE1", cibles.join(" · "), `${lus} fichier(s) de configuration lus : toute constante désignant une ressource externe dit comment sa valeur a été vérifiée`);
  for (const t of trouves.slice(0, 20)) ko(t.regle, t.ou, t.message);
  if (trouves.length > 20) ko("CE1", cibles.join(" · "), `+ ${trouves.length - 20} autre(s) constante(s) sans en-tête vérifiable`);

  const verdict = F.some((f) => f.statut === "FAIL") ? "FAIL"
    : F.every((f) => f.statut === "SANS_OBJET") ? "SKIP" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-constantes-externes", version: "1.0.0", verdict,
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
}
