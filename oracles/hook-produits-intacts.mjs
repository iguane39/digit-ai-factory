#!/usr/bin/env node
/**
 * hook-produits-intacts.mjs — LE PILOT N'ÉCRIT PAS CHEZ UN PRODUIT, et ce n'est plus une consigne.
 *
 * POURQUOI CE HOOK EXISTE (décision humaine du 23/08/2026 : « ne touche pas les produits, seuls
 * les produits se modifient eux-mêmes »). Le garde-fou était écrit dans `CLAUDE.md` depuis
 * l'origine — « produits autonomes : le pilot n'y intervient que sur run demandé » — et rien ne
 * l'exécutait. Une consigne qu'aucun mécanisme ne tient est une consigne qu'on suit par
 * discipline, c'est-à-dire une consigne qu'on finira par ne pas suivre : c'est exactement la
 * maladie que la première loi transverse nomme, appliquée à un garde-fou plutôt qu'à un bouton.
 *
 * CE QUI A ÉTÉ ÉCARTÉ, ET POURQUOI. Un hook `PreToolUse` qui refuserait une écriture d'après le
 * chemin de l'outil ne verrait QUE `Write` et `Edit`. Or l'essentiel des écritures d'une session
 * de pilotage passe par un script lancé en `Bash` — un `python` qui réécrit un fichier, un `sed`,
 * une redirection. Refuser sur le chemin déclaré protégerait donc du cas le plus rare en
 * laissant passer le plus fréquent : une garantie de façade, pire qu'une absence de garantie.
 *
 * CE QUI EST FAIT À LA PLACE : une COMPARAISON D'ÉTAT, insensible à l'outil employé. À
 * l'ouverture, on relève pour chaque dépôt produit son `HEAD` et l'empreinte de son état de
 * travail. À la fin du tour, on recompare. Une modification, un commit, un fichier neuf — quelle
 * que soit la voie — se voit, et il est RAPPORTÉ en fin de tour. Le blocage a été retiré le 24/08
 * sur décision humaine (choix « 2a ») : voir « CE QUE LE 24/08 A APPRIS » ci-dessous.
 *
 * L'ÉCHAPPATOIRE EST NOMMÉE, JAMAIS DEVINÉE : `FORGE_MANDAT_PRODUIT=<nom>` déclare le produit sur
 * lequel un run est demandé. Ce produit-là est alors suivi et RAPPORTÉ, jamais bloqué — un run
 * demandé écrit chez son produit, c'est sa raison d'être.
 *
 * CE QUE LE 24/08 A APPRIS, ET IL A FALLU TROIS DISCRIMINANTS. Le lendemain de son écriture, ce
 * contrôle a accusé le pilot QUATRE FOIS en une heure — alors que c'était la session DU PRODUIT qui
 * travaillait chez lui, exactement comme la décision humaine le prescrit. Comparer un état ne dit
 * jamais QUI a écrit : c'est la limite structurelle du procédé. Ce qui se prouve, en revanche, c'est
 * qu'un mouvement N'EST PAS une écriture de passage du pilot, et chaque signal a sa preuve propre —
 * les mélanger a rouvert le trou deux fois :
 *   · HEAD qui bouge → disculpé si l'histoire est PUBLIÉE sur le distant du produit ;
 *   · arbre de travail qui bouge → disculpé si aucun fichier cité n'a été écrit depuis le relevé,
 *     ou si le JOURNAL DE RÉFÉRENCES du dépôt montre qu'une session y travaillait dans la fenêtre.
 * Les marges d'horloge penchent TOUJOURS vers le blocage : elles élargissent ce qui accuse et
 * resserrent ce qui disculpe. Et le relevé se REMET À JOUR quand rien n'est reproché : sans cela,
 * un mouvement légitime déjà déclaré est re-signalé à chaque tour, indéfiniment.
 *
 * LE TROU QUI RESTE, DÉCLARÉ : un pilot qui commiterait ET pousserait chez un produit serait
 * disculpé par la première règle. Ce n'est pas le mode de défaillance réaliste — une écriture de
 * passage est un script qui réécrit des fichiers, sans commit — et ce cas-là reste bloquant.
 *
 * Usage :
 *   node oracles/hook-produits-intacts.mjs --empreinte   (SessionStart : relève l'état)
 *   node oracles/hook-produits-intacts.mjs               (Stop : compare et RAPPORTE tout mouvement)
 *   node oracles/hook-produits-intacts.mjs --self-test   (les deux sens, sur des dépôts jouets)
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);

/** Un dépôt du parc qui n'est ni le pilot ni une forge est un PRODUIT. */
const EST_FORGE = (nom) => /^digit-ai/.test(nom);
const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build"]);

function depotsProduits(racine) {
  const out = [];
  const visiter = (dossier, prof) => {
    if (prof > 2 || !existsSync(dossier)) return;
    let entrees = [];
    try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (!e.isDirectory() || IGNORES.has(e.name)) continue;
      const chemin = join(dossier, e.name);
      if (existsSync(join(chemin, ".git"))) {
        // Un dépôt. Forge ou pilot : hors sujet. Produit : suivi.
        if (!EST_FORGE(e.name)) out.push(chemin);
        continue;                       // on ne descend pas DANS un dépôt
      }
      visiter(chemin, prof + 1);        // dossier de rangement (`_Client-A\`, etc.)
    }
  };
  visiter(racine, 0);
  return out.sort();
}

const git = (depot, ...a) => spawnSync("git", ["-C", depot, ...a], { encoding: "utf8" });

/** LE PRODUIT S'EST-IL MODIFIÉ LUI-MÊME ? La question que ce contrôle ne posait pas.
 *
 * LE FAIT, ET IL EST TOMBÉ LE LENDEMAIN DE SON ÉCRITURE (24/08/2026, ~08:32). Une AUTRE session,
 * celle du produit, a créé une branche chez lui, commité « Réponse à l'audit du dépôt du 18/08 »,
 * fait fusionner sa demande de tirage et repris `main`. Ce contrôle a vu bouger le HEAD et a accusé
 * le pilot d'avoir écrit chez un produit — alors que c'est EXACTEMENT ce que la décision humaine
 * prescrit : « seuls les produits se modifient eux-mêmes ». Le contrôle confondait donc les deux
 * choses que la règle sépare, et il accusait de violer la règle celui qui la respectait.
 *
 * LE DISCRIMINANT, mécanique et sans heuristique de message : une écriture non autorisée du pilot
 * laisse des traces LOCALES — du travail non commité, ou des commits que le distant ne connaît pas.
 * À l'inverse, une histoire PUBLIÉE (HEAD est un ancêtre de la branche de suivi distante) ne peut
 * pas être un gribouillage local du pilot : elle est passée par le distant du produit.
 *
 * Ce qu'il reste hors de portée, et c'est déclaré : si le pilot commitait ET poussait chez un
 * produit, cette fonction le tiendrait pour légitime. Le garde-fou du pilot est ailleurs (il ne
 * pousse jamais chez un frère hors mandat journalisé) ; ici on refuse seulement d'accuser à tort,
 * parce qu'une accusation fausse détruit la valeur d'un contrôle plus sûrement qu'un trou avoué.
 */
function histoirePubliee(depot) {
  // ON NE MÊLE PAS LES SIGNAUX, et le premier jet le faisait : il refusait de répondre « publiée »
  // dès que l'arbre de travail était sale. Or un produit a très bien un HEAD publié ET des fichiers
  // de sortie non commités — c'est même son état ordinaire. Le mouvement de HEAD, parfaitement
  // légitime, restait donc accusé à cause de fichiers qui ne le concernent pas. Ici on ne répond
  // QU'À une question : cet historique est-il passé par le distant du produit ?
  const suivi = (git(depot, "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}").stdout || "").trim();
  if (!suivi) return { publiee: false, motif: "aucune branche de suivi distante" };
  const ancetre = git(depot, "merge-base", "--is-ancestor", "HEAD", suivi);
  if (ancetre.status !== 0) return { publiee: false, motif: `HEAD n'est pas publié sur ${suivi}` };
  const auteur = (git(depot, "log", "-1", "--format=%an").stdout || "").trim();
  const sujet = (git(depot, "log", "-1", "--format=%s").stdout || "").trim();
  return { publiee: true, motif: `HEAD publié sur ${suivi} — dernier commit « ${sujet.slice(0, 70)} » par ${auteur}` };
}

/** RIEN N'A ÉTÉ ÉCRIT DEPUIS LE RELEVÉ ? La deuxième question qui manquait (24/08/2026).
 *
 * LE FAIT. Ce contrôle compare l'état d'un produit « entre l'ouverture et la fin du tour ». Mais
 * une session de pilotage peut durer PLUS D'UN JOUR : le relevé de ce tour datait de la veille
 * 13:49, et la session du produit avait travaillé chez lui dans l'intervalle. Le contrôle a donc
 * accusé le tour courant d'écritures faites ailleurs, un jour plus tôt. Un contrôle dont la
 * référence vieillit accuse le dernier arrivé.
 *
 * LE DISCRIMINANT : la DATE DE MODIFICATION des fichiers cités. Un fichier dont l'horodatage est
 * ANTÉRIEUR au relevé ne peut pas avoir été écrit depuis. C'est mécanique, sans heuristique, et
 * ça se vérifie fichier par fichier.
 *
 * Hors de portée, déclaré : un fichier réécrit avec un horodatage forcé dans le passé. Personne ne
 * le fait par accident, et le pilot n'a aucune raison de le faire.
 */
function ecritDepuis(depot, iso) {
  // MARGE D'HORLOGE, ET SA VALEUR VIENT D'UNE MESURE, PAS D'UNE PRÉCAUTION VAGUE. Deux horloges
  // sont comparées ici : celle de `Date.now()`, qui datte le relevé, et celle du système de
  // fichiers, qui datte les écritures. Sur ce poste, un fichier écrit APRÈS le relevé s'est mesuré
  // à `mtime = …844,792` contre un seuil `…845` — 0,2 ms AVANT, donc « pas écrit depuis ». La
  // recette l'a attrapé dans la minute. Deux secondes de marge couvrent l'écart entre les deux
  // horloges de plusieurs ordres de grandeur, et le doute profite au BLOCAGE : un fichier douteux
  // est compté comme récent, donc reproché. Se tromper vers l'accusation se corrige en une phrase ;
  // se tromper vers l'absolution laisse passer une écriture chez un produit.
  const MARGE_MS = 2000;
  const seuil = Date.parse(iso || "") - MARGE_MS;
  if (!Number.isFinite(seuil)) return { recent: true, motif: "relevé sans date lisible" };
  // `core.quotepath=false` : sans lui, git ÉCHAPPE les octets non ASCII des chemins cités
  // (des octets en clair au lieu de « Fiche Sécurité »), le fichier devient illisible et
  // son horodatage inconnu. Le contrôle basculait alors vers « écrit depuis le relevé » — la
  // direction prudente, mais pour une mauvaise raison : un accent dans un nom de fichier.
  const lignes = (git(depot, "-c", "core.quotepath=false", "status", "--porcelain").stdout || "").split(/\r?\n/).filter(Boolean);
  const recents = [];
  for (const l of lignes) {
    const chemin = l.slice(3).replace(/^"|"$/g, "").split(" -> ").pop();
    try {
      const st = statSync(join(depot, chemin));
      if (st.mtimeMs > seuil) recents.push(chemin);
    } catch { recents.push(`${chemin} (illisible)`); }
  }
  return recents.length
    ? { recent: true, motif: `${recents.length} fichier(s) écrit(s) depuis le relevé : ${recents.slice(0, 3).join(", ")}` }
    : { recent: false, motif: `aucun des ${lignes.length} fichier(s) non commité(s) n'a été écrit depuis le relevé` };
}

/** LA SESSION DU PRODUIT A-T-ELLE TRAVAILLÉ, ELLE, PENDANT LA FENÊTRE ? (24/08/2026)
 *
 * LE FAIT, ET IL S'EST PRODUIT TROIS FOIS EN VINGT MINUTES. La session du produit a commité,
 * fusionné sa demande de tirage, repris `main`, publié une version, et déposé un livrable dans son
 * dossier de sortie — pendant que ce tour-ci lisait des dépôts. Le contrôle a accusé le pilot à
 * chaque mouvement. Or comparer un ÉTAT ne dit jamais QUI a écrit : c'est la limite structurelle
 * de ce garde-fou, et elle ne se contourne pas par une heuristique de plus.
 *
 * CE QU'ON PEUT PROUVER, en revanche : que le dépôt a été VIVANT de son propre chef pendant la
 * fenêtre. Le journal de références (`reflog`) porte les commits, bascules de branche et tirages
 * avec leur date. S'il bouge après le relevé, une session travaille chez le produit — et les
 * fichiers apparus lui appartiennent selon toute vraisemblance.
 *
 * LE TROU, DÉCLARÉ PLUTÔT QUE MASQUÉ : si le pilot commitait lui-même chez un produit, ce journal
 * bougerait aussi et le mouvement serait RAPPORTÉ au lieu d'être bloqué. Ce n'est pas le mode de
 * défaillance réaliste — une écriture de passage du pilot est un script qui réécrit des fichiers,
 * sans commit — et ce cas-là reste bloquant, puisque le journal ne bouge pas.
 */
function depotVivant(depot, iso) {
  // MÊME PIÈGE D'HORLOGE, MAIS LA MARGE VA DANS L'AUTRE SENS, et c'est la recette qui l'a imposé.
  // Les dates du journal sont au format `iso-strict`, TRONQUÉES À LA SECONDE, quand le relevé porte
  // des millisecondes. Une marge est donc nécessaire — mais ici « vivant » DISCULPE, alors que
  // « écrit depuis » ACCUSE. La marge doit toujours pencher vers le blocage : elle ÉLARGIT ce qui
  // accuse et RESSERRE ce qui disculpe. Posée du côté large, elle faisait passer un dépôt endormi
  // pour actif — son commit initial, à quelques millisecondes du relevé, suffisait à l'absoudre.
  // UNE FENÊTRE D'UNE HEURE, PARCE QU'UNE FENÊTRE DE DEUX MINUTES NE MESURE RIEN. Le relevé se
  // remet à jour à chaque tour où rien n'est reproché — excellente chose, mais la fenêtre
  // « depuis le relevé » devient alors minuscule, et l'activité d'une session est PAR RAFALES :
  // elle commite, puis produit des livrables pendant dix minutes sans commiter. Mesuré ce matin :
  // le dépôt avait commité à 08:32, 08:41 et 08:49, et à 08:53 il paraissait endormi pour n'avoir
  // rien commité depuis quatre minutes. Un dépôt dont l'histoire a bougé DANS L'HEURE est un dépôt
  // où une session travaille — ses fichiers non commités lui appartiennent.
  //
  // Le trou est déclaré : si le pilot écrivait dans un produit actif depuis moins d'une heure, ce
  // mouvement serait rapporté au lieu d'être bloqué. C'est le prix d'un contrôle qui ne crie pas au
  // loup à chaque tour — et un contrôle qui crie toujours ne protège plus de rien.
  const MARGE_MS = 2000;
  const FENETRE_MS = 60 * 60 * 1000;
  const releve = Date.parse(iso || "");
  if (!Number.isFinite(releve)) return { vivant: false, motif: "relevé sans date lisible" };
  const seuil = Math.min(releve + MARGE_MS, Date.now() - FENETRE_MS);
  // LA DATE DU GESTE, PAS CELLE DU COMMIT — et c'est la recette qui a tranché entre les deux. Le
  // premier jet lisait `%cI`, la date du commit pointé : pour une bascule de branche, c'est la date
  // d'un commit ancien, si bien qu'un dépôt actif à l'instant passait pour endormi. La date qui
  // compte est celle de l'ENTRÉE du journal, que `%gd` porte sous la forme `HEAD@{…}`.
  const brut = git(depot, "reflog", "--date=iso-strict", "--format=%gd|%gs").stdout || "";
  const lignes = brut.split(/\r?\n/).filter(Boolean);
  const recentes = [];
  for (const l of lignes.slice(0, 40)) {
    const [ref, geste] = l.split("|");
    const dans = /\{([^}]+)\}/.exec(ref || "");
    const t = Date.parse(dans ? dans[1] : "");
    if (Number.isFinite(t) && t > seuil) recentes.push((geste || "").slice(0, 60));
  }
  return recentes.length
    ? { vivant: true, motif: `le dépôt a vécu de son propre chef : ${recentes.length} geste(s) à son journal dans l'heure, dont « ${recentes[0]} »` }
    : { vivant: false, motif: "aucun geste à son journal de références dans l'heure — le dépôt est endormi" };
}

/** HEAD + empreinte de l'état de travail. Deux nombres suffisent : ils bougent à la moindre écriture. */
function etat(depot) {
  const head = (git(depot, "rev-parse", "HEAD").stdout || "").trim() || "(sans commit)";
  const porcelain = (git(depot, "status", "--porcelain").stdout || "");
  return { head, travail: createHash("sha256").update(porcelain).digest("hex").slice(0, 12),
           lignes: porcelain.split("\n").filter(Boolean).length };
}

const racineParc = process.env.FORGE_ROOT || join(PILOT, "..");
const EMPREINTE = join(PILOT, ".oracles", "produits-au-demarrage.json");
const mandat = (process.env.FORGE_MANDAT_PRODUIT || "").trim();

function relever(racine = racineParc, sortie = EMPREINTE) {
  const produits = {};
  for (const d of depotsProduits(racine)) produits[d] = etat(d);
  mkdirSync(dirname(sortie), { recursive: true });
  writeFileSync(sortie, JSON.stringify({
    schema: "pilot/produits-au-demarrage@1", releve_le: new Date().toISOString(),
    racine: String(racine), mandat: mandat || null, produits,
  }, null, 1) + "\n", "utf8");
  return produits;
}

function comparer(racine = racineParc, empreinte = EMPREINTE) {
  if (!existsSync(empreinte)) {
    // Sans relevé d'ouverture, on ne peut RIEN dire : le dire vaut mieux que de laisser croire
    // à un contrôle qui a tourné. Jamais bloquant — l'absence n'est pas une faute du tour.
    return { verdict: "SKIP", motif: `aucun relevé d'ouverture (${empreinte}) — le contrôle ne s'est pas exécuté au démarrage`, ecarts: [] };
  }
  let avant = null;
  try { avant = JSON.parse(readFileSync(empreinte, "utf8")); }
  catch { return { verdict: "SKIP", motif: "relevé d'ouverture illisible", ecarts: [] }; }
  const ecarts = [];
  const declares = [];
  for (const [depot, etatAvant] of Object.entries(avant.produits || {})) {
    if (!existsSync(depot)) { declares.push(`${depot} : dépôt absent à la fin du tour (déplacé ou retiré)`); continue; }
    const apres = etat(depot);
    const bouge = apres.head !== etatAvant.head || apres.travail !== etatAvant.travail;
    if (!bouge) continue;
    const nom = depot.split(/[\\/]/).pop();
    const quoi = [
      apres.head !== etatAvant.head ? `HEAD ${etatAvant.head.slice(0, 7)} → ${apres.head.slice(0, 7)}` : null,
      apres.travail !== etatAvant.travail ? `état de travail ${etatAvant.lignes} → ${apres.lignes} fichier(s) modifié(s)` : null,
    ].filter(Boolean).join(", ");
    if (mandat && (nom === mandat || depot.endsWith(mandat))) {
      declares.push(`${nom} : ${quoi} — MANDAT DÉCLARÉ (FORGE_MANDAT_PRODUIT)`);
      continue;
    }
    // LE PRODUIT A LE DROIT DE BOUGER TOUT SEUL, et c'est même la règle. Mais CHAQUE SIGNAL a sa
    // propre disculpation, et les mélanger rouvre le trou qu'on ferme : un premier jet acceptait
    // « rien d'écrit depuis le relevé » pour le HEAD aussi — or après un commit l'arbre de travail
    // est PROPRE, donc « rien d'écrit » est vrai par construction, et n'importe quel commit du
    // pilot passait pour légitime. Sa propre recette l'a dit dans la minute.
    //   · HEAD qui bouge → disculpé SEULEMENT par une histoire publiée sur le distant du produit ;
    //   · arbre de travail qui bouge → disculpé SEULEMENT si aucun fichier cité n'a été écrit
    //     depuis le relevé (une session qui dure plus d'un jour voit bouger ce qu'elle n'a pas fait).
    const inexplique = [];
    let preuves = [];
    if (apres.head !== etatAvant.head) {
      const pub = histoirePubliee(depot);
      if (pub.publiee) preuves.push(pub.motif);
      else inexplique.push(`HEAD non publié — ${pub.motif}`);
    }
    if (apres.travail !== etatAvant.travail) {
      const frais = ecritDepuis(depot, avant.releve_le);
      if (!frais.recent) preuves.push(frais.motif);
      else {
        // Des fichiers ont bougé depuis le relevé. Reste à savoir si la session du PRODUIT
        // travaillait, elle, pendant la même fenêtre — son journal de références le dit.
        const vif = depotVivant(depot, avant.releve_le);
        if (vif.vivant) preuves.push(`${frais.motif} — mais ${vif.motif}`);
        else inexplique.push(`${frais.motif} · ${vif.motif}`);
      }
    }
    if (!inexplique.length) {
      declares.push(`${nom} : ${quoi} — LE PRODUIT S'EST MODIFIÉ LUI-MÊME (${preuves.join(" · ")}). Rien n'est reproché : « seuls les produits se modifient eux-mêmes »`);
      continue;
    }
    ecarts.push(`${nom} (${depot}) : ${quoi} — ${inexplique.join(" · ")}`);
  }
  // LA RÉFÉRENCE SE REMET À JOUR QUAND ELLE A ÉTÉ HONORÉE, et cette ligne évite une classe entière
  // de faux blocages : sans elle, un mouvement légitime déjà déclaré est re-signalé à CHAQUE tour
  // suivant, indéfiniment — et un avertissement qui revient sans rien vouloir dire s'apprend à être
  // ignoré. On ne remet à jour QUE si rien n'est reproché : sinon l'écart s'effacerait au second
  // essai et le blocage n'aurait aucune dent.
  const verdict = ecarts.length ? "FAIL" : "PASS";
  if (verdict === "PASS") { try { relever(racine, empreinte); } catch { /* référence non réécrite : le tour suivant reverra le même écart, ce qui est le comportement sûr */ } }
  return { verdict, ecarts, declares,
           motif: `${Object.keys(avant.produits || {}).length} produit(s) suivi(s) depuis ${avant.releve_le}` };
}

// ---- recette : les deux sens, sur des dépôts jouets ------------------------------------------
if (args.includes("--self-test")) {
  const base = mkdtempSync(join(tmpdir(), "produits-intacts-"));
  // LES DÉPÔTS JOUETS NAISSENT ENDORMIS, et sans ça la recette ne mesure plus rien : le contrôle
  // tient un dépôt pour VIVANT si son journal a bougé dans l'heure, or un dépôt créé à l'instant
  // vient forcément de bouger — tous les cas de blocage devenaient verts. On antidate donc leur
  // naissance de deux heures : c'est la seule façon de jouer un dépôt endormi sans attendre.
  const ANCIEN = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const gitVieux = (depot, ...a) => spawnSync("git", ["-C", depot, ...a],
    { encoding: "utf8", env: { ...process.env, GIT_COMMITTER_DATE: ANCIEN, GIT_AUTHOR_DATE: ANCIEN } });
  const faire = (nom, forge = false) => {
    const d = join(base, forge ? nom : join("_produits", nom));
    mkdirSync(d, { recursive: true });
    gitVieux(d, "init", "-q");
    writeFileSync(join(d, "a.txt"), "un\n");
    gitVieux(d, "add", "-A"); gitVieux(d, "-c", "user.email=x@y", "-c", "user.name=x", "commit", "-qm", "initial");
    return d;
  };
  const produit = faire("mon-produit");
  const autre = faire("autre-produit");
  faire("digit-ai-forge-jouet", true);
  const emp = join(base, "empreinte.json");
  let pass = 0; const echecs = [];
  const ok = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };

  console.log("Recette de hook-produits-intacts — les deux sens\n");
  const releves = relever(base, emp);
  ok("les DEUX produits sont suivis, la forge jouet ne l'est pas",
    Object.keys(releves).length === 2 && !Object.keys(releves).some((d) => /digit-ai/.test(d)));

  let r = comparer(base, emp);
  ok("rien touché → PASS", r.verdict === "PASS" && r.ecarts.length === 0);

  // Un fichier modifié SANS commit : c'est le cas le plus courant d'une écriture de passage.
  writeFileSync(join(produit, "a.txt"), "deux\n");
  r = comparer(base, emp);
  ok("un fichier modifié sans commit → FAIL", r.verdict === "FAIL" && r.ecarts.length === 1);
  ok("le constat NOMME le produit et ce qui a bougé",
    /mon-produit/.test(r.ecarts[0]) && /fichier\(s\) modifié\(s\)/.test(r.ecarts[0]));

  // Un COMMIT : la voie qu'un hook d'écriture ne verrait pas non plus.
  git(produit, "add", "-A"); git(produit, "-c", "user.email=x@y", "-c", "user.name=x", "commit", "-qm", "écriture de passage");
  r = comparer(base, emp);
  ok("un commit → FAIL, et le HEAD est cité", r.verdict === "FAIL" && /HEAD /.test(r.ecarts[0]));

  // L'autre produit, intact, ne doit pas être accusé : un contrôle qui accuse tout n'accuse rien.
  ok("le produit intact n'est PAS accusé", !r.ecarts.some((e) => /autre-produit/.test(e)));

  // LE PRODUIT QUI SE MODIFIE LUI-MÊME, et c'est le cas qui a fait entrer ce discriminant
  // (24/08/2026). Une autre session, celle du produit, a commité chez lui, fait fusionner sa
  // demande de tirage et repris `main` : ce contrôle a accusé le pilot d'avoir écrit là où la
  // décision humaine dit « seuls les produits se modifient eux-mêmes ». Il accusait donc de
  // violer la règle celui qui la respectait. Le discriminant est mécanique : une histoire
  // PUBLIÉE sur le distant du produit n'est pas un gribouillage local du pilot.
  {
    const distant = join(base, "_distants", "publie.git");
    mkdirSync(dirname(distant), { recursive: true });
    git(dirname(distant), "init", "-q", "--bare", "--initial-branch=main", "publie.git");
    const seul = faire("produit-publie");
    gitVieux(seul, "branch", "-M", "main");
    gitVieux(seul, "remote", "add", "origin", distant);
    gitVieux(seul, "push", "-q", "-u", "origin", "main");
    const emp2 = join(base, "empreinte-publiee.json");
    relever(base, emp2);
    // Le produit avance CHEZ LUI puis publie : exactement ce que fait sa propre session.
    writeFileSync(join(seul, "a.txt"), "sa propre reponse\n");
    gitVieux(seul, "add", "-A"); gitVieux(seul, "-c", "user.email=x@y", "-c", "user.name=x", "commit", "-qm", "le produit repond a son audit");
    gitVieux(seul, "push", "-q", "origin", "main");
    let rp = comparer(base, emp2);
    ok("le produit qui se modifie LUI-MÊME et publie n'est pas accusé",
      !rp.ecarts.some((e) => /produit-publie/.test(e)));
    ok("son mouvement est tout de même DÉCLARÉ, pas passé sous silence (loi n° 3)",
      (rp.declares || []).some((d) => /produit-publie/.test(d) && /LUI-MÊME/.test(d)));
    // Sens ROUGE du même discriminant : le MÊME dépôt, avec du travail local NON publié, redevient
    // un écart. Sans ce cas, la porte ouverte plus haut ne se refermerait jamais.
    writeFileSync(join(seul, "b.txt"), "ecriture de passage\n");
    rp = comparer(base, emp2);
    ok("le même produit avec du travail local NON publié → FAIL, et le constat NOMME le fichier",
      rp.verdict === "FAIL" && rp.ecarts.some((e) => /produit-publie/.test(e) && /écrit\(s\) depuis le relevé/.test(e) && /b\.txt/.test(e)));
  }

  // LE DÉPÔT VIVANT, dans les deux sens (24/08). Un fichier apparu APRÈS le relevé est suspect —
  // sauf si la session du produit travaillait, elle, pendant la même fenêtre. Son journal de
  // références le dit, et ça se vérifie des deux côtés.
  {
    const vif = faire("produit-vivant");
    // Créé AVANT le relevé, pour le dernier cas de ce bloc : un dépôt qui n'était pas au relevé
    // relève d'une autre règle, et il faut qu'il y soit pour que son mouvement compte comme écart.
    const muet = faire("produit-muet");
    const emp3 = join(base, "empreinte-vivant.json");
    relever(base, emp3);
    // (1) un fichier apparaît, et RIEN au journal : c'est le cas qui doit bloquer.
    writeFileSync(join(vif, "depose-par-le-pilot.txt"), "ecriture de passage\n");
    let rv = comparer(base, emp3);
    ok("un fichier apparu sans aucun geste au journal → FAIL",
      rv.verdict === "FAIL" && rv.ecarts.some((e) => /produit-vivant/.test(e) && /le dépôt est endormi/.test(e)));
    // (2) le même fichier, mais le dépôt a VÉCU depuis le relevé : c'est sa session qui travaille.
    // Le geste choisi ne déplace PAS le HEAD final — deux bascules de branche — parce que sinon on
    // testerait deux choses à la fois : un commit sans distant rendrait le HEAD « non publié », et
    // le cas échouerait pour une raison qui n'est pas celle qu'on mesure. Le premier jet du test
    // faisait exactement cette erreur.
    git(vif, "checkout", "-q", "-b", "sa-branche");
    git(vif, "checkout", "-q", "-");
    // LE RELEVÉ EST ANTIDATÉ DE CINQ SECONDES, et ce n'est pas une commodité : la marge d'horloge
    // exige qu'un geste soit NETTEMENT postérieur au relevé pour disculper. Dans la vraie vie, la
    // session d'un produit travaille des secondes ou des minutes après ; dans une recette, tout
    // tombe dans la même milliseconde. Antidater le relevé reproduit la vraie chronologie au lieu
    // d'affaiblir la règle pour faire passer le test.
    {
      const j = JSON.parse(readFileSync(emp3, "utf8"));
      j.releve_le = new Date(Date.parse(j.releve_le) - 5000).toISOString();
      writeFileSync(emp3, JSON.stringify(j, null, 1) + "\n", "utf8");
    }
    rv = comparer(base, emp3);
    ok("le même fichier, mais le dépôt a VÉCU depuis le relevé → pas d'écart",
      !rv.ecarts.some((e) => /produit-vivant/.test(e)));
    ok("et son mouvement est DÉCLARÉ avec la preuve du journal",
      (rv.declares || []).some((d) => /produit-vivant/.test(d) && /de son propre chef/.test(d)));

    // TF-0685 (31/08) — LES DEUX LISTES ENSEMBLE, SUR LE CHEMIN RÉEL DU RENDU.
    //
    // Le cas fondateur du 27/08 : un mouvement EXPLIQUÉ chez un produit, et des mouvements
    // INEXPLIQUÉS chez d'autres dans le même tour. Le verdict passait FAIL, la branche sortait, et
    // la déclaration disculpante était avalée — le lecteur recevait la liste de ce qu'il devait
    // aller vérifier, amputée de ce qui était déjà réglé.
    //
    // Ce cas ne se joue PAS sur `comparer()` seul : le défaut vivait dans le RENDU, pas dans la
    // comparaison, et les deux cas ci-dessus le manquaient tous les deux pour cette raison. Il se
    // joue donc sur `--rendre-pour-test`, qui traverse exactement le code du hook.
    //
    // Sens rouge implicite : si la ligne d'information repassait après la sortie, `[info]` serait
    // absent de la sortie complète et ce cas tomberait — c'est précisément ce qu'il garde.
    // LE CAS EST AUTONOME, ET IL DOIT L'ÊTRE : `comparer` REMET LE RELEVÉ À JOUR quand le verdict
    // est PASS (voir la ligne qui le fait, et la raison qui l'accompagne). Les comparaisons
    // précédentes de ce bloc ont donc rafraîchi `emp3`, et s'appuyer dessus mesurerait un état qui
    // n'existe plus. Ce cas prend son propre relevé, l'antidate, puis provoque les deux natures de
    // mouvement en une seule fois — un expliqué et un inexpliqué — et ne compare qu'UNE fois.
    const emp4 = join(base, "empreinte-deux-listes.json");
    relever(base, emp4);
    {
      const j = JSON.parse(readFileSync(emp4, "utf8"));
      j.releve_le = new Date(Date.parse(j.releve_le) - 60000).toISOString();
      writeFileSync(emp4, JSON.stringify(j, null, 1) + "\n", "utf8");
    }
    writeFileSync(join(vif, "encore-un-fichier.txt"), "la session du produit travaille\n");
    writeFileSync(join(muet, "ecrit-sans-explication.txt"), "mouvement inexplique\n");
    const rendu = spawnSync(process.execPath,
      [fileURLToPath(import.meta.url), "--rendre-pour-test", base, emp4], { encoding: "utf8" });
    ok("un tour qui ÉCHOUE et DISCULPE à la fois rend les DEUX : l'expliqué d'abord, l'inexpliqué ensuite",
      /\[info\]/.test(rendu.stdout) && /\[avert\]/.test(rendu.stdout)
      && rendu.stdout.indexOf("[info]") < rendu.stdout.indexOf("[avert]")
      && /produit-vivant/.test(rendu.stdout) && /produit-muet/.test(rendu.stdout));
  }

  // Le MANDAT déclaré : le produit est suivi et RAPPORTÉ, jamais bloqué.
  process.env.FORGE_MANDAT_PRODUIT = "mon-produit";
  const module2 = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--comparer-pour-test", base, emp],
    { encoding: "utf8", env: { ...process.env, FORGE_MANDAT_PRODUIT: "mon-produit" } });
  ok("avec un mandat déclaré, l'écart est RAPPORTÉ et non bloquant",
    module2.status === 0 && /MANDAT DÉCLARÉ/.test(module2.stdout));

  rmSync(base, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  console.log(`\nRecette produits-intacts : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// Mode interne de la recette : rejouer la comparaison dans un process portant le mandat.
if (args[0] === "--comparer-pour-test") {
  const r = comparer(args[1], args[2]);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}

if (args.includes("--empreinte")) {
  const p = relever();
  console.log(`[ok] produits suivis : ${Object.keys(p).length} dépôt(s) relevé(s)` +
    (mandat ? ` — mandat déclaré sur « ${mandat} »` : " — aucun mandat déclaré : toute écriture chez eux sera refusée"));
  process.exit(0);
}

// ---- Stop : on compare, et on RAPPORTE si un produit a bougé sans mandat ---------------------
// LE RENDU EST UNE FONCTION, et non le corps du script, pour une seule raison : la recette doit
// pouvoir le JOUER. Avant le 31/08, le mode de recette n'exerçait que `comparer()` et imprimait son
// JSON — il ne traversait jamais le code qui décide quoi afficher, si bien que le défaut d'ordre
// corrigé ici lui était structurellement invisible. Un banc qui ne joue pas le chemin réel ne
// protège pas le chemin réel.
function rendre(r) {
// CE QUI DISCULPE SE DIT TOUJOURS, ET D'ABORD (TF-0685, 31/08/2026).
//
// LE DÉFAUT, et il produisait l'inverse exact de l'intention de ce hook : la ligne qui imprime
// `declares` vivait APRÈS le `process.exit(0)` de la branche FAIL. Elle était donc INATTEIGNABLE
// dès qu'un seul écart existait — c'est-à-dire précisément quand le lecteur a besoin de savoir
// lesquels des mouvements sont déjà expliqués. Plus il y avait de mouvement, moins il recevait
// d'information disculpante ; la disculpation n'apparaissait que lorsqu'il n'y avait rien à
// disculper.
//
// CE QUE ÇA A COÛTÉ, mesuré sur le cas réel du 27/08 : le renommage d'un dépôt produit suivi,
// pourtant explicable, n'a été déclaré NULLE PART — trois autres produits bougeaient le même
// tour, le verdict est passé FAIL, et la sortie anticipée a avalé la déclaration. Le hook
// prescrit dans son propre texte d'aller vérifier si un mouvement vient d'une autre session : il
// retenait justement l'information qui répond à cette question.
//
// LE REMÈDE EST L'ORDRE, pas une branche de plus : ce qui est expliqué se lit AVANT ce qui ne
// l'est pas, dans les deux verdicts. Le lecteur écarte d'abord ce qui est réglé, puis lit ce qui
// reste. La recette joue désormais les deux listes ENSEMBLE, sur un cas qui échoue et disculpe à
// la fois — sans quoi la correction se déferait au premier remaniement.
  if (r.declares && r.declares.length) console.log(`[info] ${r.declares.join(" · ")}`);
  if (r.verdict === "FAIL") {
  const raison = "MOUVEMENT CHEZ UN PRODUIT — le pilot n'y intervient que sur run demandé " +
    "(décision humaine du 23/08 : « ne touche pas les produits, seuls les produits se modifient " +
    "eux-mêmes »). Ce qui a bougé pendant ce tour :\n  - " + r.ecarts.join("\n  - ") +
    "\n\nCE QU'IL FAUT EN FAIRE, et surtout ce qu'il ne faut PAS en faire : si ce mouvement vient " +
    "d'une AUTRE session — celle du produit, qui travaille chez elle — il n'y a rien à corriger, " +
    "c'est exactement ce que la règle prescrit. N'annulez RIEN sans avoir vérifié : le remède que " +
    "ce hook affichait autrefois (`git checkout -- .`) a été à deux doigts de détruire trois " +
    "branches et une version déjà fusionnées. Si le mouvement vient du pilot, il se corrige chez " +
    "le produit par sa propre session, ou se DÉCLARE en posant FORGE_MANDAT_PRODUIT=<nom> et en " +
    "le journalisant. " +
    "Ce contrôle compare l'état des dépôts produits entre l'ouverture et la fin du tour : il ne " +
    "dépend pas de l'outil employé, donc un script lancé en shell est vu comme une édition directe.";
  // MODE VALIDÉ PAR L'HUMAIN (24/08, choix « 2a » après trois explications) : la question a été
  // posée en trois options — signaler, bloquer, ou bloquer sur les seuls fichiers déjà suivis —
  // avec le coût de chacune. Réponse : il SIGNALE. La réduction de garantie est donc assumée par
  // qui l'avait demandée, et elle n'a pas à être re-débattue à chaque lecture. Ce qui la
  // renverserait : une écriture réelle du pilot chez un produit, constatée et journalisée — ce
  // jour-là l'arbitrage se repose avec ce fait en main, et pas avant.
  // RAPPORTÉ, jamais bloqué. Ce hook ne peut pas attribuer une écriture à son auteur — trois
  // discriminants l'ont réduit sans jamais y parvenir — et bloquer sur le travail d'une autre
  // session coûte plus qu'il ne protège : cinq refus en une heure, tous injustifiés, et un remède
  // affiché qui aurait détruit des branches déjà fusionnées.
  console.log(`[avert] ${raison}`);
  }
}

// Mode interne de la recette : jouer le RENDU réel sur une base et un relevé de test.
if (args[0] === "--rendre-pour-test") {
  rendre(comparer(args[1], args[2]));
  process.exit(0);
}

rendre(comparer());
process.exit(0);
