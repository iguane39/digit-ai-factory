#!/usr/bin/env node
/**
 * emettre-travaux.test.mjs — recette de l'émetteur de lots de travaux (TF-0627).
 *
 * Les promesses qui rendent ce canal acceptable, chacune dans les deux sens :
 *   · il n'écrit QUE dans `input\00-travaux\` — vérifié par empreinte de l'arborescence ;
 *   · il joue son propre juge AVANT d'écrire, et ne dépose pas un lot en défaut ;
 *   · il est idempotent par contenu — deux passages ne s'empilent pas ;
 *   · `--essai` n'écrit rien, nulle part ;
 *   · un produit conforme ne reçoit AUCUN lot : un canal qui parle pour ne rien dire se fait taire.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  lotHeritage, indiceLibre, dateLot,
  blocConstat, constatsDestines, constatsDuRegistre, memeProduit, normaliserProduit,
  orphelins, pseudonymeDe,
} from "./emettre-travaux.mjs";
import { verifier } from "../gabarits/oracle-travaux-pilot.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const LIGNE = (artefacts) => ({ produit: "produit-recette", dossier: "C:\\faux\\produit-recette", artefacts });
const ABSENT = (cible, mode = "copie_conforme") => ({ cible, mode, etat: "absent" });

const T = mkdtempSync(join(tmpdir(), "emettre-travaux-"));
try {
  check("un lot est produit pour chaque artefact manquant, et il PASSE son propre juge", () => {
    const lot = lotHeritage(LIGNE([ABSENT("forge/RESTITUTION.md"), ABSENT("forge/hooks/factory.mjs")]), "20260825", "a");
    att(lot && lot.elements === 2, `${lot && lot.elements} élément(s) au lieu de 2`);
    const r = verifier(lot.md);
    att(r.verdict === "PASS", `le lot émis ne tient pas sa propre forme : ${r.constats.filter((c) => c.statut === "FAIL").map((c) => c.regle).join(", ")}`);
  });

  check("un produit CONFORME ne reçoit AUCUN lot — un canal qui parle pour rien se fait taire", () => {
    const lot = lotHeritage(LIGNE([{ cible: "forge/RESTITUTION.md", mode: "copie_conforme", etat: "conforme" }]), "20260825", "a");
    att(lot === null, "un lot a été produit alors qu'il n'y a rien à confier");
  });

  check("un artefact HORS RACINE demande une DÉCLARATION, jamais une recopie (TF-0654)", () => {
    // Le fait : `robots.txt` compté ABSENT chez un produit où il vit en `site/robots.txt` et
    // répond 200 en production. Appliquer le travail tel qu'il était rédigé aurait déposé un
    // fichier à la racine du dépôt — JAMAIS servi — et fait passer le relevé au vert sur une
    // question restée ouverte. Ce que le produit doit faire est déclarer sa racine web.
    const lot = lotHeritage(LIGNE([{ cible: "robots.txt", source: "gabarits/web/robots.txt",
      mode: "presence", etat: "hors_racine", trouve_a: "site/robots.txt" }]), "20260826", "a");
    att(lot, "aucun lot produit pour un artefact hors racine");
    att(/HORS de la racine/.test(lot.md), "le lot ne distingue pas ce cas d'un artefact absent");
    att(lot.md.includes("site/robots.txt"), "le lot ne dit pas OÙ le fichier a été trouvé");
    att(/DÉCLARER votre racine web/.test(lot.md), "le lot ne demande pas la déclaration attendue");
    att(/Ne recopiez PAS/.test(lot.md),
      "le lot n'interdit pas la recopie — sans quoi le produit crée un fichier mort et le relevé passe au vert");
  });

  check("un artefact PÉRIMÉ est confié comme tel, avec les deux empreintes qui le prouvent", () => {
    // TF-0645 : les empreintes s'appellent `empreinte_pilot` et `empreinte_produit` depuis le
    // 26/08. Elles s'appelaient `source` et `produit` — or `source` porte, AU CONTRAT, le CHEMIN
    // de l'artefact chez le pilot. La collision faisait perdre ce chemin au relevé, et le lot le
    // REFABRIQUAIT par chirurgie de chaîne : trois chemins faux sur neuf dans un lot réellement
    // déposé. Le `source` de cette fixture est donc désormais le chemin, et il est VÉRIFIÉ.
    const lot = lotHeritage(LIGNE([{ cible: "forge/RESTITUTION.md", source: "gabarits/RESTITUTION.md",
      mode: "copie_conforme", etat: "divergent", empreinte_pilot: "aaaaaaaaaaaa", empreinte_produit: "bbbbbbbbbbbb" }]), "20260825", "a");
    att(lot, "aucun lot produit pour un artefact périmé");
    att(/PÉRIMÉ/.test(lot.md), "le lot ne dit pas que l'artefact est périmé plutôt qu'absent");
    att(lot.md.includes("aaaaaaaaaaaa") && lot.md.includes("bbbbbbbbbbbb"),
      "le lot ne cite pas les deux empreintes — le produit ne peut donc pas contredire le constat");
    att(lot.md.includes("recopier `gabarits/RESTITUTION.md`"),
      "le lot ne cite pas le chemin source DÉCLARÉ par le contrat — s'il le déduit de la cible, il invente (TF-0645)");
  });

  check("le sidecar porte une ligne JSON par élément, avec son moyen de vérification", () => {
    const lot = lotHeritage(LIGNE([ABSENT("forge/RESTITUTION.md"), ABSENT("robots.txt", "presence")]), "20260825", "a");
    const lignes = lot.sidecar.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
    att(lignes.length === 2, `${lignes.length} ligne(s) au lieu de 2`);
    att(lignes.every((x) => x.verification && x.origine_tf && x.gravite && x.effort),
      "une ligne du sidecar manque un champ du contrat");
    att(lignes.every((x) => !("id" in x)), "le sidecar porte un id : les ids sont frappés par le destinataire");
  });

  check("la gravité distingue ce qui agit à chaque travail rendu de ce qui gêne au cas par cas", () => {
    const lot = lotHeritage(LIGNE([ABSENT("forge/RESTITUTION.md"), ABSENT("robots.txt", "presence")]), "20260825", "a");
    const par = Object.fromEntries(lot.sidecar.split("\n").filter((l) => l.trim())
      .map((l) => JSON.parse(l)).map((x) => [x.titre.includes("RESTITUTION") ? "restitution" : "web", x.gravite]));
    att(par.restitution === "majeur", `restitution en « ${par.restitution} »`);
    att(par.web === "mineur", `robots.txt en « ${par.web} »`);
  });

  check("l'indice du jour est la première lettre LIBRE de la boîte — deux lots du même jour cohabitent", () => {
    const boite = join(T, "boite");
    mkdirSync(boite, { recursive: true });
    att(indiceLibre(boite, "20260825") === "a", "boîte vide : l'indice devrait être `a`");
    writeFileSync(join(boite, "pilot - TRAVAUX - 20260825a.md"), "x", "utf8");
    att(indiceLibre(boite, "20260825") === "b", "un `a` présent : l'indice devrait être `b`");
    writeFileSync(join(boite, "pilot - TRAVAUX - 20260825b.md"), "x", "utf8");
    att(indiceLibre(boite, "20260825") === "c", "un `b` présent : l'indice devrait être `c`");
    att(indiceLibre(boite, "20260826") === "a", "un autre JOUR repart à `a`");
  });

  check("la date du lot est déterministe : elle vient de l'argument, jamais de l'horloge", () => {
    att(dateLot(new Date(2026, 7, 5)) === "20260805", `rendu ${dateLot(new Date(2026, 7, 5))}`);
    att(dateLot(new Date(2026, 11, 31)) === "20261231", "un mois à deux chiffres est mal rendu");
  });

  // ── LA PROMESSE QUI REND LE CANAL ACCEPTABLE : rien n'est écrit hors de la boîte ──
  check("--essai n'écrit RIEN, nulle part — vérifié par empreinte de l'arborescence", () => {
    const faux = join(T, "parc");
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, "forge", "marqueur.txt"), "intact", "utf8");
    const empreinte = (d) => readdirSync(d, { withFileTypes: true, recursive: true })
      .map((e) => `${e.parentPath || e.path}|${e.name}|${e.isFile() ? statSync(join(e.parentPath || e.path, e.name)).size : "d"}`)
      .sort().join("\n");
    const avant = empreinte(faux);
    const r = spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous", "--essai"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    att(r.status === 0, `exit ${r.status} : ${String(r.stderr).slice(0, 200)}`);
    att(empreinte(faux) === avant, "l'essai a modifié l'arborescence du parc");
    att(!existsSync(join(produit, "input")), "l'essai a créé une boîte d'entrée");
  });

  check("un dépôt réel n'écrit QUE dans `input\\00-travaux\\` — le reste est intact", () => {
    const faux = join(T, "parc2");
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, "forge", "marqueur.txt"), "intact", "utf8");
    writeFileSync(join(produit, "CLAUDE.md"), "consignes du produit", "utf8");
    // Le filtre ECARTE toute la boite d'entree, dossiers intermediaires COMPRIS : `input` et
    // `input\\00-travaux` sont crees par le depot, et les compter ferait echouer la recette sur
    // la seule chose qu'elle autorise. Premier jet : il ne regardait que le chemin PARENT, donc
    // l'entree du dossier `00-travaux` lui-meme passait — la recette accusait l'outil A TORT.
    const horsBoite = (d) => readdirSync(d, { withFileTypes: true, recursive: true })
      .map((e) => `${e.parentPath || e.path}|${e.name}`)
      .filter((l) => !l.includes("00-travaux") && !l.endsWith("|input"))
      .sort().join("\n");
    const avant = horsBoite(faux);
    const r = spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    att(r.status === 0, `exit ${r.status} : ${String(r.stderr).slice(0, 200)}`);
    const boite = join(produit, "input", "00-travaux");
    att(existsSync(boite), "aucun lot déposé");
    att(readdirSync(boite).filter((f) => f.endsWith(".md")).length === 1, "un seul lot `.md` attendu");
    att(readdirSync(boite).filter((f) => f.endsWith(".tf.jsonl")).length === 1, "le sidecar manque");
    // Le marqueur et les consignes du produit n'ont pas bougé : seule la boîte a changé.
    att(horsBoite(faux) === avant, "l'émetteur a touché autre chose que la boîte d'entrée");
  });

  check("IDEMPOTENT par contenu — un second passage ne redépose rien", () => {
    const faux = join(T, "parc3");
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const lancer = () => spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    lancer();
    const boite = join(produit, "input", "00-travaux");
    const apres1 = readdirSync(boite).length;
    const r2 = lancer();
    att(readdirSync(boite).length === apres1, `${readdirSync(boite).length} fichiers après le second passage au lieu de ${apres1}`);
    att(/DÉJÀ DÉPOSÉ/.test(r2.stdout), "le second passage ne DIT pas qu'il n'a rien redéposé");
  });

  // ── TF-0680 — L'INCLUSION, ET SA BORNE. Deux sens, parce que la borne compte autant que la
  // règle : un lot dont les éléments sont TOUS déjà dans un lot NON TRAITÉ n'apporte rien et ne
  // se dépose pas ; le même, face à un lot DÉJÀ TRAITÉ, doit repartir — sans quoi un constat
  // rouvert n'atteindrait plus personne.
  // On reproduit la scène du 26/08 : le produit INSTALLE l'un des artefacts que le lot
  // demandait. Le relevé suivant porte donc un élément de MOINS — un sous-ensemble strict —
  // et c'est ce cas précis que l'égalité d'empreinte laissait passer.
  const monterInclusion = (nomParc, statut) => {
    const faux = join(T, nomParc);
    const produit = join(faux, "_Client", "produit-recette");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const lancer = () => spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    lancer();
    const boite = join(produit, "input", "00-travaux");
    const lot = readdirSync(boite).find((f) => f.endsWith(".md"));
    if (statut !== "a_traiter") {
      const chemin = join(boite, lot);
      writeFileSync(chemin, readFileSync(chemin, "utf8")
        .replace(/-\s+\*\*Statut\*\*\s*:\s*a_traiter/, `- **Statut** : ${statut}`), "utf8");
    }
    // LE GESTE QUI REND LE LOT SUIVANT PLUS PETIT : le produit satisfait UNE demande, et il
    // l'installe VRAIMENT — un fichier bouchon rendrait l'artefact « PÉRIMÉ » au lieu de le
    // faire disparaître, l'élément changerait de libellé, et il n'y aurait plus d'inclusion.
    // Ce faux pas a été payé en écrivant ce cas : il passait au vert sans rien exercer.
    mkdirSync(join(produit, "forge", "retours"), { recursive: true });
    writeFileSync(join(produit, "forge", "retours", "RETOURS-FORGES.md"),
      readFileSync(join(ICI, "..", "gabarits", "RETOURS-FORGES.md"), "utf8"), "utf8");
    return { boite, lancer };
  };

  check("TF-0680 — un lot INCLUS dans un lot NON TRAITÉ ne se redépose pas", () => {
    const { boite, lancer } = monterInclusion("parc-incl-1", "a_traiter");
    const avant = readdirSync(boite).length;
    const r = lancer();
    att(readdirSync(boite).length === avant,
      `${readdirSync(boite).length} fichiers au lieu de ${avant} : un sous-ensemble a été redéposé`);
    att(/INCLUS DANS UN LOT NON TRAITÉ/.test(r.stdout),
      "le refus ne passe PAS par la règle d'inclusion — le cas n'exerce donc pas ce qu'il prétend " +
      "prouver : " + r.stdout.split(String.fromCharCode(10)).filter((x) => x.trim()).slice(-2).join(" | "));
  });

  check("TF-0680 borne — un lot DÉJÀ TRAITÉ ne bloque pas un redépôt", () => {
    const { boite, lancer } = monterInclusion("parc-incl-2", "traite le 2026-08-27");
    const r = lancer();
    att(!/INCLUS DANS UN LOT NON TRAITÉ/.test(r.stdout),
      "un lot déjà traité bloque le redépôt — un constat rouvert n'atteindrait plus personne");
  });

  // ═══════════════════════════════════════════════════════════════════════════════════════════
  // LA SECONDE SOURCE DU CANAL — TF-0673
  //
  // Cet émetteur ne savait confier qu'UNE classe de travail : les artefacts d'héritage. Tout
  // autre constat destiné à un produit n'avait AUCUNE VOIE — le défaut exact que ce script
  // existe pour corriger, son propre en-tête l'écrivant.
  //
  // ET LE PREMIER JET DE CETTE SOURCE A MENTI EN SILENCE : le relevé nomme le produit
  // « Produit-02.com », le registre écrit « Produit-02 ». Le rendez-vous ne se
  // faisait pas, l'émetteur rendait « 1 déjà présent » — message parfaitement normal — et trois
  // constats étaient perdus SANS UN MOT. Seule une empreinte qui n'avait pas bougé l'a montré.
  // ═══════════════════════════════════════════════════════════════════════════════════════════

  const registre = (evenements, nom) => {
    const f = join(T, `registre-${nom}.jsonl`);
    writeFileSync(f, evenements.map((e) => JSON.stringify(e)).join("\n") + "\n", "utf8");
    return f;
  };

  check("le suffixe de domaine du dépôt ne fait pas manquer le rendez-vous", () => {
    att(normaliserProduit("Produit-02.com") === "produit-02", "suffixe mal retiré");
    att(memeProduit("Produit-02", "Produit-02.com"), "le rendez-vous ne se fait pas");
  });

  check("le rapprochement REFUSE l'inclusion — « Foo » n'est pas « FooBar »", () => {
    // Une comparaison lâche qui se trompe dépose du travail chez quelqu'un qui n'en est pas le
    // destinataire. C'est PIRE que ne rien déposer : le vrai destinataire n'apprend rien ET un
    // autre est dérangé.
    att(!memeProduit("Foo", "FooBar"), "« Foo » a été rapproché de « FooBar »");
    att(!memeProduit("Foo", "FooBar.com"), "« Foo » a été rapproché de « FooBar.com »");
  });

  check("un destinataire vide ne se rapproche de RIEN, pas même d'un autre vide", () => {
    att(!memeProduit("", ""), "deux vides se sont rapprochés");
    att(!memeProduit(undefined, "Foo"), "un destinataire absent s'est rapproché d'un produit");
  });

  // ── LE REGISTRE PARLE EN PSEUDONYMES, LE PARC EN NOMS RÉELS (mesure du 31/08/2026) ──
  //
  // Depuis que l'anonymisation est dans la chaîne d'ingestion, `destinataire_produit` porte un
  // pseudonyme quand le parc porte le nom réel. Sans résolution, les TROIS constats au plus haut
  // score du mandat du 28/08 sortaient en [ORPHELINS] alors que leur produit était sur le poste
  // et venait de remettre un lot le matin même. La résolution passe par la table hors dépôt, en
  // LECTURE SEULE — rapprocher n'est pas baptiser.
  const tablePseudo = join(T, "pseudo.json");
  writeFileSync(tablePseudo, JSON.stringify({ produits: { MonProduit: "Produit-77" } }), "utf8");
  const avecTable = (fn) => {
    const avant = process.env.FORGE_PRODUITS_PSEUDO;
    process.env.FORGE_PRODUITS_PSEUDO = tablePseudo;
    try { fn(); } finally {
      if (avant === undefined) delete process.env.FORGE_PRODUITS_PSEUDO;
      else process.env.FORGE_PRODUITS_PSEUDO = avant;
    }
  };

  check("pseudonymeDe résout un nom réel, suffixe de domaine compris — et rend null sans table", () => {
    att(pseudonymeDe("MonProduit.com", tablePseudo) === "Produit-77", "le nom réel suffixé ne résout pas");
    att(pseudonymeDe("Inconnu", tablePseudo) === null, "un produit hors table a reçu un pseudonyme");
    att(pseudonymeDe("MonProduit", join(T, "table-absente.json")) === null, "une table absente n'a pas rendu null");
  });

  check("la résolution est en LECTURE SEULE — un inconnu n'est pas baptisé (pseudoProduit étend, pas elle)", () => {
    const avant = readFileSync(tablePseudo, "utf8");
    pseudonymeDe("JamaisVuNullePart", tablePseudo);
    att(readFileSync(tablePseudo, "utf8") === avant, "un simple rapprochement a ÉTENDU la table");
  });

  check("un constat adressé au PSEUDONYME atteint le produit réel du parc", () => avecTable(() => {
    const f = registre([{ ev: "creation", id: "TF-9011", statut: "decide", destinataire_produit: "Produit-77" }], "g");
    att(constatsDuRegistre("MonProduit.com", f).length === 1,
      "le rendez-vous ne traverse pas le pseudonyme — le constat au registre n'atteint personne");
    att(orphelins([{ produit: "MonProduit.com" }], f).length === 0,
      "le constat est dénoncé orphelin alors que son produit est dans le parc");
  }));

  check("un pseudonyme que la table ne porte PAS reste orphelin — la résolution n'invente rien", () => avecTable(() => {
    const f = registre([{ ev: "creation", id: "TF-9012", statut: "decide", destinataire_produit: "Produit-99" }], "h");
    att(orphelins([{ produit: "MonProduit.com" }], f).length === 1,
      "un pseudonyme inconnu de la table a été rapproché d'un produit quand même");
  }));

  check("un constat destiné au produit est retenu, et le rendez-vous traverse le suffixe", () => {
    const f = registre([{ ev: "creation", id: "TF-9001", statut: "candidat", destinataire_produit: "MonProduit" }], "a");
    att(constatsDuRegistre("MonProduit.com", f).length === 1, "le constat n'a pas été retenu");
  });

  check("un constat CLOS n'est plus confié — sinon le produit le recevrait à chaque exécution", () => {
    const f = registre([
      { ev: "creation", id: "TF-9002", statut: "candidat", destinataire_produit: "MonProduit" },
      { ev: "maj", id: "TF-9002", statut: "corrige" },
    ], "b");
    att(constatsDuRegistre("MonProduit", f).length === 0, "un constat corrigé est encore confié");
  });

  check("l'état se reconstitue par FUSION des événements, jamais sur le dernier vu", () => {
    // Le registre est append-only : le titre écrit à la création n'est pas répété à chaque mise
    // à jour. Lire le seul dernier événement rendrait un constat sans titre ni contenu.
    const f = registre([
      { ev: "creation", id: "TF-9003", statut: "candidat", destinataire_produit: "MonProduit",
        titre: "Le titre d'origine", contenu: "le fait" },
      { ev: "maj", id: "TF-9003", statut: "decide", decideur: "humain" },
    ], "c");
    const [x] = constatsDuRegistre("MonProduit", f);
    att(x.titre === "Le titre d'origine", "le titre de création a été perdu");
    att(x.statut === "decide", "la mise à jour n'a pas été appliquée");
  });

  check("un constat qui désigne un produit absent du parc est DÉNONCÉ", () => {
    const f = registre([{ ev: "creation", id: "TF-9004", statut: "candidat", destinataire_produit: "ProduitDisparu" }], "d");
    const perdus = orphelins([{ produit: "AutreProduit.com" }], f);
    att(perdus.length === 1 && perdus[0].id === "TF-9004", "l'orphelin n'est pas dénoncé");
  });

  check("un constat dont le produit EXISTE n'est pas dénoncé à tort", () => {
    const f = registre([{ ev: "creation", id: "TF-9005", statut: "candidat", destinataire_produit: "MonProduit" }], "e");
    att(orphelins([{ produit: "MonProduit.com" }], f).length === 0, "un constat sain est dénoncé");
  });

  check("un constat orphelin mais CLOS n'est pas dénoncé — il n'attend plus personne", () => {
    const f = registre([
      { ev: "creation", id: "TF-9006", statut: "candidat", destinataire_produit: "ProduitDisparu" },
      { ev: "maj", id: "TF-9006", statut: "ecarte" },
    ], "f");
    att(orphelins([{ produit: "AutreProduit" }], f).length === 0, "un orphelin clos est dénoncé");
  });

  check("un registre introuvable ou abîmé ne lève JAMAIS, et n'emporte pas les lignes saines", () => {
    // Un émetteur qui lève sur un registre absent transformerait une donnée manquante en panne.
    att(constatsDestines(join(T, "il-n-existe-pas.jsonl")).length === 0, "un registre absent a levé");
    const f = join(T, "abime.jsonl");
    writeFileSync(f, '{"ev":"creation","id":"TF-9008","statut":"candidat","destinataire_produit":"MonProduit"}\n'
      + "{ ceci n'est pas du JSON\n", "utf8");
    att(constatsDuRegistre("MonProduit", f).length === 1, "une ligne illisible a emporté une ligne saine");
  });

  check("un champ absent du registre est DIT absent, et l'aveu désigne le REGISTRE", () => {
    // Un lot qui comblerait les trous par de la prose plausible ferait croire au produit qu'on
    // lui a écrit quelque chose de mesuré. L'aveu doit pointer l'endroit où il se corrige.
    const rendu = blocConstat({ id: "TF-9009", titre: "Un constat nu" });
    att(/non renseigné au registre/.test(rendu), "le manque n'est pas avoué");
    att(/aucune demande explicite/.test(rendu), "l'absence de demande n'est pas dite");
    att(/aucune vérification déclarée/.test(rendu), "l'absence de vérification n'est pas dite");
  });

  check("un constat COMPLET ne porte AUCUN aveu de manque", () => {
    const rendu = blocConstat({
      id: "TF-9010", titre: "Un constat complet", gravite: "majeur", contenu: "le fait mesuré",
      pourquoi_produit: "parce que", demande_produit: "faire ceci", effort: "simple × court",
      verification: "la commande rend PASS", consequence: "sinon ceci",
    });
    att(!rendu.includes("non renseigné au registre"), "un constat complet avoue un manque qu'il n'a pas");
    att(/gravité majeur/.test(rendu), "la gravité déclarée n'est pas reprise");
    att(/### TF-9010/.test(rendu), "le bloc ne porte pas l'identifiant — le produit ne peut rien rattacher");
  });

  check("l'avertissement des orphelins se DÉCLARE non jugé quand le parc n'est pas celui du pilot", () => {
    // Ce contrôle confronte le registre DU PILOT au parc SCANNÉ. Sur un parc de fixture, les
    // deux ne parlent pas des mêmes produits et tout constat réel paraîtrait orphelin — c'est
    // ce qui a fait rougir deux cas de cette recette dès que l'avertissement a été branché.
    // Le silence d'une sonde n'est pas un verdict : l'inactivité se DIT.
    const faux = join(T, "parc-etranger");
    mkdirSync(join(faux, "_Client", "produit-recette"), { recursive: true });
    const r = spawnSync(process.execPath, [join(ICI, "emettre-travaux.mjs"), "--tous", "--essai"],
      { encoding: "utf8", env: { ...process.env, FORGE_ROOT: faux } });
    att(r.status === 0, `sortie ${r.status} sur un parc étranger — les constats réels y passent pour orphelins`);
    att(/ORPHELINS — NON JUGÉ/.test(r.stdout),
      "le contrôle est inactif SANS LE DIRE — indiscernable d'un contrôle qui n'a rien trouvé");
  });

} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nemettre-travaux (TF-0627 canal, TF-0673 seconde source) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
