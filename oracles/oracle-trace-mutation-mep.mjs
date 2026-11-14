#!/usr/bin/env node
/**
 * oracle-trace-mutation-mep — UN DOSSIER DE MEP DIT CE QU'IL EN EST DE LA MUTATION, OU IL MENT
 * PAR OMISSION.
 *
 * LE FAIT QUI OUVRE CET ORACLE (01/09/2026). La décision humaine D-34 du jour a sorti la campagne
 * de mutation de la boucle ordinaire : « les tests sur les mutants sont exécutés à la demande, lors
 * d'un passage en Prod sur proposition de l'IA, et uniquement s'ils n'ont été exécutés depuis
 * plusieurs modifications de code ». La règle a été écrite au bon endroit — `ETAPE-MEP.md` §1 bis —
 * et elle n'avait AUCUN exécutant. Or c'est exactement le défaut que la v1 de la consigne de
 * restitution décrivait d'elle-même : *une convention qu'aucun run ne charge ne s'applique pas,
 * elle décore.*
 *
 * CE QUE COÛTE L'ABSENCE, et c'est asymétrique. Une campagne jouée et non consignée coûte une
 * relecture ; une campagne JAMAIS PROPOSÉE ne coûte rien du tout — sur le moment. Elle se paie
 * plus tard, en production, sur un défaut d'assertion que la mutation aurait nommé. C'est la forme
 * la plus chère du silence : celle qui ne se signale pas, et qui ressemble en tout point à une
 * étape qui s'est bien passée.
 *
 * TROIS RÈGLES, et la troisième est celle qui empêche l'oracle d'être satisfait par une phrase :
 *
 *   TM1  le dossier de MEP NOMME l'état de la campagne — jouée, ou proposée et refusée. Le
 *        vocabulaire est volontairement large (la doctrine ne prescrit aucune formule), mais le
 *        SILENCE est un défaut : un dossier qui ne parle pas de mutation est indiscernable d'un
 *        dossier où personne n'y a pensé, et le lecteur ne peut pas faire la différence.
 *   TM2  une campagne déclarée JOUÉE porte sa PREUVE localisante — un score, un compte de mutants,
 *        une liste de survivants, ou le chemin du marqueur. Jamais un ✓ nu : c'est la loi
 *        transverse du parc, et c'est au dossier de MEP qu'elle compte le plus, parce que c'est la
 *        pièce qu'on relit six mois plus tard.
 *   TM3  une campagne déclarée JOUÉE est ADOSSÉE AU MARQUEUR que la campagne écrit elle-même chez
 *        le produit (`forge\mutation-derniere-campagne.json`). Une déclaration sans marqueur est
 *        une affirmation ; le marqueur, lui, n'existe que si l'adaptateur est allé au bout. C'est
 *        la seule des trois règles qu'une phrase bien tournée ne peut pas satisfaire.
 *   TM4  les verdicts de forge-ops ARCHIVÉS sous ce produit (`.ops-journal.jsonl`) sont confrontés
 *        à l'état PRÉSENT de leur cible — AVERTISSEMENT, jamais un échec.
 *   TM5  les portes qui jugent une base externe (avis de dépendances, base de vulnérabilités) sont
 *        rejouées le JOUR du lancement, sur l'objet lancé, et le feu vert du dossier le prouve —
 *        BLOQUANT (M-10, TF-1498).
 *   TM6  le dossier porte le relevé daté des garde-fous de la plateforme cible, relit chaque
 *        contrainte « Obligatoire ici » du produit et dit avoir lu le registre de la factory —
 *        BLOQUANT (M-11, TF-1495 et TF-1496), câblé comme TM5 sur `scripts\verifier-garde-fous.mjs`.
 *   TM7  les scripts du produit qui accordent un droit nomment des identifiants de permission
 *        Graph justes, ne masquent pas l'échec de l'octroi et relisent l'effet avant de l'annoncer
 *        — BLOQUANT (M-12, TF-1497), câblé sur `scripts\verifier-droits-accordes.mjs`.
 *   TM8  les étapes de la chaîne du produit : un objet d'annuaire créé se lit avant d'être
 *        complété, `az webapp auth` ne s'emploie pas sans extension déclarée, et le dossier porte
 *        la section des étapes remises à l'exploitant — BLOQUANT (M-13, TF-1546, TF-1548,
 *        TF-1549), câblé sur `scripts\verifier-etape-chaine.mjs`.
 *   TM9  un parcours tiers embarqué qui engage l'utilisateur (paiement, réservation) est vérifié de
 *        bout en bout, dans un navigateur, sur l'état exécuté, jusqu'à l'étape qui encaisse, et le
 *        dossier porte la section « Parcours tiers embarqués » — AVERTISSEMENT (M-14, TF-1583), câblé
 *        sur `scripts\verifier-parcours-tiers.mjs`.
 *   TM10 un dossier qui fait voter ou approuver un plan porte une contre-lecture qui compare les
 *        PARAMÈTRES de l'exécution qui a produit le plan à la fiche ou à la décision, tranche chaque
 *        écart et publie ce qu'elle ne compare pas — BLOQUANT (M-15, TF-1681), câblé sur
 *        `scripts\verifier-contre-lecture.mjs`. Entrée en avertissement le 14/10/2026 comme TM9, elle
 *        bloque depuis le même jour : décision humaine « Traite A1 » sur TF-1688, prise sur son bruit
 *        mesuré, 0 dossier accusé sur les 6 dossiers de MEP du poste.
 *   TM11 le dossier porte la section « Chaîne de déploiement » : la chaîne qui déploie et l'exécution
 *        citée, sans commande de déploiement direct depuis un poste (M-16, CTL-D09-01) ;
 *   TM12 le dossier porte la section « Sauvegarde et restauration » : la déclaration de sauvegarde
 *        jugée par O-19 de forge-ops, ou « aucun actif de données critique » motivé (M-17, CTL-D05-09,
 *        CTL-D12-06, CTL-D16-09) ;
 *   TM13 le dossier porte la section « Fournisseur d'identité » : le fournisseur central et le MFA, ou
 *        « aucun accès humain authentifié » motivé (M-18, CTL-D03-01). TM11 à TM13 sont câblés sur
 *        `scripts\verifier-exigences-fatales.mjs` et AVERTISSENT, comme TM9 : règles neuves du
 *        17/10/2026 (TF-1212, décision humaine D-3 (a)), taux d'accusation mesuré à l'entrée 7 sur 7 ;
 *   TM14 le dossier porte la section « Revue de code » : jouée, avec son rapport, ses constats et ses
 *        jetons ; ou proposée puis refusée ; ou non proposée, motivée (M-19, D-162 (a) du 03/11/2026,
 *        ETAPE-MEP.md § 1 quater). AVERTISSEMENT, sans passage en blocage à poser : forge-websec ne
 *        bloque jamais une mise en production ;
 *   TM15 le dossier porte la section « Réglages de plateforme » : chaque réglage du registre
 *        `references\REGLAGES-SURS-PAR-DEFAUT.json` que le produit emploie, avec son état lu daté et son
 *        verdict, un écart accepté nommant sa décision ; ou « Aucun réglage de plateforme : <motif> »
 *        (M-21, D-178 (a) du 06/11/2026, TF-2233, ETAPE-MEP.md § 3 quaterdecies). AVERTISSEMENT ;
 *   TM16 le dossier porte la section « Version servie et inventaire » : le commit lu par
 *        `version-servie.mjs lire`, le verdict d'O-26 et celui d'O-27 de forge-ops (M-22, TF-2243). Absente
 *        ou incomplète : AVERTISSEMENT. Un FAIL d'O-26 ou d'O-27 porté par le dossier : FAIL, puisque la
 *        décision de TF-2243 fait de ce FAIL un refus de la porte « prêt » ;
 *   TM17 le dossier porte le verdict websec du gate (oracle-exposition, oracle-sca), lu AVEC le paramètre
 *        `[gates] websec_bloquant` de `docs\projet\PARAMETRAGE.md` (R-33 bis, TF-2506, ETAPE-MEP.md § 4, M-23).
 *        Paramètre à `false` ou absent, le défaut de l'écosystème : un verdict absent, FAIL ou SKIP AVERTIT
 *        (un manque déclaré, jamais un refus). Paramètre à `true` : un verdict absent, FAIL ou SKIP est un FAIL,
 *        le GO est bloqué. Avant TF-2506, aucun contrôle ne lisait le paramètre ni le verdict : armer le gate
 *        n'avait aucun effet exécutable.
 *
 * TM9 EST UN AVERTISSEMENT, ET C'EST LA DOCTRINE DE LA CAMPAGNE DU 13/10/2026 : une règle NEUVE, opposable
 * à tous les produits, entre en avertissement et jamais en blocage (précédent D-70 (b)). Le verbe rend
 * son refus (exit 1) ; ce câblage le lit comme AVERTISSEMENT, et le passage en blocage est une décision
 * humaine, prise sur les produits réels qu'elle aura vus (aucun dossier de MEP du parc n'a encore passé
 * M-14 : la borne n'est pas mesurée, elle est déclarée).
 *
 * TM5 EST UN CÂBLAGE BLOQUANT, ET LA DIFFÉRENCE AVEC TM4 EST VOULUE (TF-1498, 01/10/2026). Le
 * 30/09/2026, un feu vert de lancement reposait sur les portes de la veille : 3 avis de sécurité
 * publiés dans la nuit ont arrêté la livraison de production à `npm audit`, et le lancement de
 * l'exploitant a été perdu. La règle vit dans le verbe `scripts\verifier-portes-du-jour.mjs`, appelé
 * ici comme TM4 appelle le sien. Elle BLOQUE parce que son remède appartient à qui donne le feu
 * vert et tient en 5 minutes : rejouer la porte ce jour-là. TM4 avertit parce que le sien appartient
 * à un autre dépôt.
 *
 * TM4 EST UN CÂBLAGE, PAS UNE RÈGLE DE PLUS (TF-1084, 20/09/2026). `ETAPE-MEP.md` §4 prescrit depuis
 * le 15/09 qu'« un verdict de forge-ops ARCHIVÉ ne se cite qu'après confrontation à l'état présent de
 * sa cible — `node scripts\verifier-verdict-archive.mjs` ». Le verbe existait ; `relever-appelants`
 * le désignait comme le SEUL contrôle du dépôt « cité en doctrine seulement », c'est-à-dire appelé
 * par personne. *Toute affordance est câblée ou n'existe pas* : il est appelé ICI, sur le produit
 * dont on juge le dossier de MEP, au moment exact où la doctrine l'exige.
 *
 * POURQUOI AVERTISSEMENT ET JAMAIS FAIL, et le choix est le point délicat. Un verdict périmé n'est
 * pas une faute du dossier : c'est un fait à relire avant de citer la pièce, et le remède
 * (« rejouer l'oracle ») appartient à forge-ops. Rendre bloquant un contrôle qui dépend de journaux
 * écrits par un autre dépôt apprendrait à le contourner (motif que R-33 bis donne pour le verdict websec). Un produit sans journal rend
 * SANS_OBJET — l'absence d'un artefact d'un tiers n'est pas un défaut du produit.
 *
 * CE QU'IL NE JUGE PAS, et c'est déclaré plutôt que tu :
 *   · la QUALITÉ du refus. « Proposée et refusée » est une décision humaine (R-29) : l'oracle
 *     vérifie qu'elle est écrite, jamais qu'elle est sage ;
 *   · la FRAÎCHEUR du marqueur par rapport au dossier. Comparer leurs dates supposerait que les
 *     deux soient horodatés dans le même fuseau et par la même main, ce qui n'est pas garanti ;
 *   · un produit SANS dossier de MEP : il n'a pas atteint l'étape, et l'accabler serait juger une
 *     absence d'événement. SANS_OBJET, jamais FAIL.
 *
 *   node oracles\oracle-trace-mutation-mep.mjs <produit>   → verdict JSON
 *   node oracles\oracle-trace-mutation-mep.mjs --self-test → fixtures double sens
 */
// Exit : 0 = conforme ou sans objet · 1 = defaut MESURE. Aucun chemin « je ne peux pas mesurer » :
// cet oracle ne depend d'aucun outil externe et lit des fichiers du disque (TF-0648).
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
// LE calcul d'empreinte du pilot, en un seul endroit (E4, TF-0615) : le banc de TM4 scelle ses
// fixtures exactement comme forge-ops scelle les siennes, sinon il mesurerait sa propre convention.
import { empreinteFichier } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const IGNORES = new Set(["node_modules", ".git", ".venv", "venv", "__pycache__", "dist", "build", ".next"]);

/**
 * Les dossiers de MEP d'un produit, cherchés sur QUATRE niveaux — et la borne se DÉCLARE
 * (TF-1267, décision D-15 (a) du 17/09/2026).
 *
 * Ce commentaire disait « où qu'ils vivent — la doctrine n'impose pas leur place » au-dessus d'un
 * `profondeur = 4`. Un dossier au cinquième niveau échappait donc au contrôle, et RIEN ne le
 * disait : ni constat, ni non-jugé, ni avertissement. Un lecteur y lisait une garantie de
 * couverture que le code ne donnait pas — la même classe que la recette de sommaire du socle, où
 * un commentaire promettait une bande repliable que son CSS ne fournissait pas.
 *
 * La borne reste : un parcours sans borne sur un parc de quatorze dépôts ne revient pas. Ce qui
 * change, c'est qu'elle rend désormais les dossiers ATTEINTS **et** les branches coupées, pour que
 * l'appelant puisse le déclarer. Conséquence mesurée au 17/09 : zéro fichier `DOSSIER-MEP*.md`
 * dans le parc, donc zéro branche coupée — la borne n'a encore rien caché, et c'est le moment le
 * moins cher pour la rendre visible.
 */
function dossiersMep(racine, profondeur = 4) {
  const trouves = [];
  const coupees = [];
  const parcourir = (dir, reste) => {
    let entrees;
    try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      if (e.isFile() && /^DOSSIER-MEP.*\.md$/i.test(e.name)) trouves.push(join(dir, e.name));
      else if (e.isDirectory() && !IGNORES.has(e.name) && !e.name.startsWith(".")) {
        if (reste > 0) parcourir(join(dir, e.name), reste - 1);
        else coupees.push(join(dir, e.name));
      }
    }
  };
  parcourir(racine, profondeur);
  trouves.bornesAtteintes = coupees;
  trouves.profondeur = profondeur;
  return trouves;
}

// Les vocabulaires sont LARGES a dessein : la doctrine prescrit qu'on DISE, jamais avec quels mots.
// Une expression etroite ferait echouer un dossier honnete sur une tournure, ce qui apprend a
// recopier une formule au lieu de rendre compte — le contraire de ce que cet oracle cherche.
const PARLE_DE_MUTATION = /\bmutation(s)?\b|\bmutant(s)?\b/i;
const DECLAREE_JOUEE = /(campagne|mutation)[^.\n]{0,80}(jou[ée]e?|ex[ée]cut[ée]e?|lanc[ée]e?|pass[ée]e?|men[ée]e?)|jou[ée]e?[^.\n]{0,40}(campagne|mutation)/i;
// TF-1803 (lot Produit-83 20261015b, RT-15) : DECLAREE_JOUEE lisait « jouée » dans une phrase NIÉE
// (« non jouée », « n'a pas été jouée ») et exigeait preuve et marqueur d'un refus écrit. La campagne
// est dite jouée si UNE proposition (coupée au point, au point-virgule, au retour) l'affirme sans
// négation devant le verbe ; une proposition niée n'affirme rien.
const NEGATION_AVANT_VERBE = /(?:\bnon\b|\bpas\b|\bjamais\b|\bni\b|\baucune?\b|\bsans\b)[^.;\n]{0,30}?(?:jou[ée]|ex[ée]cut[ée]|lanc[ée]|pass[ée]|men[ée])/i;
const affirmeJouee = (texte) => texte.split(/[.;\n]/).some((p) => DECLAREE_JOUEE.test(p) && !NEGATION_AVANT_VERBE.test(p));
const DECLAREE_REFUSEE =/(refus|report|[ée]cart|non retenue|pas jou[ée]e?|non jou[ée]e?|d[ée]clin)/i;
const PROPOSEE = /(propos|recommand|sugg[ée]r)/i;
// La PREUVE d'une campagne : un chiffre qui la localise, ou le chemin du marqueur. Le simple mot
// « mutation » suivi d'un « OK » n'en est pas une, et c'est precisement ce que TM2 refuse.
const PREUVE = /(score[^.\n]{0,30}\d|\d+\s*(mutant|survivant)|survivant[^.\n]{0,30}\d|mutation-derniere-campagne\.json|\d+\s*\/\s*\d+)/i;

/** Le marqueur qu'une campagne ecrit elle-meme chez le produit — la preuve qu'elle est allee au bout. */
function marqueur(racine) {
  const f = join(racine, "forge", "mutation-derniere-campagne.json");
  if (!existsSync(f)) return null;
  try {
    const j = JSON.parse(readFileSync(f, "utf8"));
    return (j && typeof j === "object") ? j : null;
  } catch { return null; }
}

/**
 * TM4 — les verdicts forge-ops archivés sous ce produit, confrontés à l'état présent de leur cible.
 * Délègue au verbe plutôt que de recalculer une empreinte ici : deux calculs d'un même sceau est la
 * classe de défaut qui a été payée cinq fois (TF-0615, `scripts\lib-empreinte.mjs`).
 */
function confronterVerdictsArchives(racine) {
  const verbe = join(ICI, "..", "scripts", "verifier-verdict-archive.mjs");
  if (!existsSync(verbe)) {
    return { statut: "SANS_OBJET", message: "scripts\\verifier-verdict-archive.mjs absent du pilot — "
      + "les verdicts archivés ne sont confrontés à rien, et c'est dit plutôt que tu (ETAPE-MEP.md §4)" };
  }
  const r = spawnSync(process.execPath, [verbe, racine], { encoding: "utf8", timeout: 120000 });
  let j = null;
  try { j = JSON.parse(r.stdout || ""); } catch { /* dit ci-dessous */ }
  if (!j) {
    return { statut: "SANS_OBJET", message: `le verbe n'a pas rendu de verdict lisible (exit ${r.status}) — `
      + `ce n'est PAS un constat sur ce produit : ${(r.stderr || "").trim().slice(0, 160)}` };
  }
  const m = j.mesure || {};
  if (r.status === 2) {
    return { statut: "SANS_OBJET", message: `aucun verdict forge-ops SCELLÉ sous ce produit `
      + `(${m.journaux || 0} journal(aux), ${m.non_scelles || 0} verdict(s) non scellé(s)) — rien à confronter` };
  }
  if (r.status === 0) {
    return { statut: "PASS", message: `${m.frais || 0} verdict(s) forge-ops archivé(s) confronté(s) à leur cible : `
      + "tous FRAIS, ils se citent au dossier de MEP" };
  }
  return { statut: "AVERTISSEMENT", message: `${m.perimes || 0} verdict(s) PÉRIMÉ(S) et ${m.cibles_absentes || 0} cible(s) `
    + `DISPARUE(S) sur ${m.cibles || 0} — ces verdicts ne se citent plus tels quels : rejouer l'oracle de forge-ops avant `
    + `de les porter au dossier. ${(j.findings || []).map((f) => f.ou).filter(Boolean).slice(0, 6).join(" · ")}`
    + " · détail : node scripts\\verifier-verdict-archive.mjs <produit> (ETAPE-MEP.md §4, TF-1084)" };
}

/**
 * Un verbe BLOQUANT du pilot, joué sur le produit : TM5 et TM6 le délèguent ainsi, comme TM4 le
 * sien. La règle vit en un seul endroit, et son banc la prouve. `porte` nomme la règle de l'étape,
 * `pass` dit le vert à partir de la mesure du verbe.
 */
function confronterVerbe(racine, script, porte, pass, options = []) {
  const verbe = join(ICI, "..", "scripts", script);
  if (!existsSync(verbe)) {
    return { statut: "NON_JUGE", message: `scripts\\${script} absent du pilot — ${porte} n'est jugé par rien, et c'est dit plutôt que tu` };
  }
  const r = spawnSync(process.execPath, [verbe, racine, ...options], { encoding: "utf8", timeout: 120000 });
  let j = null;
  try { j = JSON.parse(r.stdout || ""); } catch { /* dit ci-dessous */ }
  if (!j) {
    return { statut: "NON_JUGE", message: `le verbe n'a pas rendu de verdict lisible (exit ${r.status}) — `
      + `ce n'est PAS un constat sur ce produit : ${(r.stderr || "").trim().slice(0, 160)}` };
  }
  if (r.status === 2) return { statut: "SANS_OBJET", message: j.motif || j.message || `${porte} sans objet` };
  if (r.status === 0) return { statut: "PASS", message: pass(j) };
  return { statut: "FAIL", message: `${(j.mesure || {}).refus || 0} refus (${porte}) : `
    + (j.findings || []).filter((f) => f.statut === "FAIL").slice(0, 4).map((f) => `${f.regle} ${f.message}`).join(" · ")
    + ` · détail : node scripts\\${script} <produit> (ETAPE-MEP.md ${porte})` };
}

/** TM5 — les portes à base externe du feu vert, rejouées le jour du lancement (M-10, TF-1498). */
const confronterPortesDuJour = (racine) => confronterVerbe(racine, "verifier-portes-du-jour.mjs", "M-10",
  (j) => `${(j.mesure || {}).portes_feu_vert || 0} porte(s) à base externe rejouée(s) le jour du lancement (${j.lancement}), sur l'objet lancé`);

/** TM6 — les garde-fous de la plateforme relevés, les contraintes connues relues (M-11, TF-1495, TF-1496). */
const confronterGardeFous = (racine) => confronterVerbe(racine, "verifier-garde-fous.mjs", "M-11",
  (j) => `garde-fous relevés et contraintes connues relues (${(j.mesure || {}).contraintes_connues || 0} contrainte(s) « Obligatoire ici », `
    + `cible Azure : ${(j.mesure || {}).cible_azure ? "oui" : "non"})`);

/** TM7 — les scripts qui accordent un droit : identifiants Graph justes, échec visible, effet relu (M-12, TF-1497). */
const confronterDroitsAccordes = (racine) => confronterVerbe(racine, "verifier-droits-accordes.mjs", "M-12",
  (j) => `${(j.mesure || {}).resolus || 0} identifiant(s) de permission Graph conforme(s) à la table du ${(j.table || {}).date}, `
    + `${(j.mesure || {}).octrois || 0} octroi(s) à l'échec visible et à l'effet relu`);

/** TM8 — les étapes de chaîne : annuaire lu avant d'être complété, authV2 par l'API, section du dossier (M-13, TF-1546, TF-1548, TF-1549). */
const confronterEtapeChaine = (racine) => confronterVerbe(racine, "verifier-etape-chaine.mjs", "M-13",
  (j) => `${(j.mesure || {}).creations_annuaire || 0} création(s) d'objet d'annuaire lue(s) avant écriture, `
    + `${(j.mesure || {}).ecritures_de_chaine || 0} fichier(s) de chaîne qui écrivent dans la plateforme, étapes remises déclarées au dossier`);

/**
 * TM9 — un parcours tiers embarqué vérifié de bout en bout, dans un navigateur, sur l'état exécuté
 * (M-14, TF-1583). AVERTISSEMENT : règle neuve, le refus du verbe est rendu sans bloquer.
 */
function confronterParcoursTiers(racine) {
  const r = confronterVerbe(racine, "verifier-parcours-tiers.mjs", "M-14",
    (j) => `${(j.mesure || {}).parcours || 0} parcours tiers embarqué(s) chez ${(j.mesure || {}).tiers || 0} tiers, joué(s) dans un navigateur sur l'état exécuté et déclaré(s) au dossier`);
  if (r.statut !== "FAIL") return r;
  return { statut: "AVERTISSEMENT", message: "règle neuve du 13/10/2026, non bloquante (précédent D-70 (b)) — " + r.message };
}

/**
 * TM10 — la contre-lecture d'un plan voté lit les paramètres de lancement et les compare à la fiche
 * (M-15, TF-1681). BLOQUANT depuis la décision humaine sur TF-1688 (14/10/2026) : le refus du verbe est
 * rendu tel quel, en FAIL. Son bruit mesuré à la bascule : 0 dossier accusé sur 6.
 */
const confronterContreLecture = (racine) => confronterVerbe(racine, "verifier-contre-lecture.mjs", "M-15",
  (j) => `${(j.mesure || {}).parametres || 0} paramètre(s) de lancement lus à l'exécution et comparés à la fiche, `
    + `${(j.mesure || {}).ecarts_traites || 0} écart(s) tranché(s), non-comparé publié`);

/**
 * TM11, TM12, TM13 — les trois exigences FATALES du référentiel d'audit que la doctrine contredisait
 * (TF-1212, décision humaine D-3 (a) du 17/10/2026) : déploiement par chaîne exclusive (M-16,
 * CTL-D09-01), sauvegarde des actifs critiques jugée par O-19 de forge-ops (M-17, CTL-D05-09,
 * CTL-D12-06, CTL-D16-09), fournisseur d'identité central avec MFA (M-18, CTL-D03-01). Un seul verbe,
 * `scripts\verifier-exigences-fatales.mjs`, joué une fois par exigence (`--regle`). AVERTISSEMENT :
 * règle neuve opposable à tous les produits (précédent D-70 (b)) ; taux d'accusation mesuré à l'entrée
 * sur les 7 dossiers de MEP du poste : 7 sur 7 pour chacune (aucun ne porte encore la section), et 2 sur
 * 7 prescrivent une commande de déploiement direct non antérieure (ETAPE-MEP.md § 3 terdecies).
 */
function confronterExigenceFatale(racine, regle, porte, pass) {
  const r = confronterVerbe(racine, "verifier-exigences-fatales.mjs", porte, pass, ["--regle", regle]);
  if (r.statut !== "FAIL") return r;
  return { statut: "AVERTISSEMENT", message: "règle neuve du 17/10/2026, non bloquante (précédent D-70 (b)) — " + r.message };
}
const confronterChaine = (racine) => confronterExigenceFatale(racine, "pipeline", "M-16",
  (j) => `déploiement par la chaîne déclaré au dossier (${(j.mesure || {}).chaines || 0} chaîne(s) relevée(s), `
    + `${(j.mesure || {}).commandes_directes || 0} commande de déploiement direct prescrite) — CTL-D09-01`);
const confronterSauvegarde = (racine) => confronterExigenceFatale(racine, "sauvegarde", "M-17",
  (j) => `sauvegarde des actifs critiques déclarée au dossier${(j.mesure || {}).o19 ? `, O-19 ${(j.mesure || {}).o19}` : ""} — CTL-D05-09, CTL-D12-06, CTL-D16-09`);
const confronterIdentite = (racine) => confronterExigenceFatale(racine, "identite", "M-18",
  () => "fournisseur d'identité central et MFA déclarés au dossier (ou aucun accès humain, motivé) — CTL-D03-01");

/**
 * TM14 — la revue de code se propose à l'entrée de la MEP, et le dossier dit ce qu'il en est advenu
 * (M-19, D-162 (a) du 03/11/2026). Même forme que TM1 pour la mutation : jouée avec sa preuve,
 * refusée, ou non proposée avec son motif ; le silence est le défaut. Jugée ici, sans verbe : la règle
 * ne lit que le dossier, jamais le rapport de revue ni le marqueur.
 */
const TITRE_REVUE = /^(#{1,4})\s*Revue de code\s*$/im;
function sectionRevue(texte) {
  const m = TITRE_REVUE.exec(texte);
  if (!m) return null;
  const suite = texte.slice(m.index + m[0].length);
  const fin = suite.search(new RegExp(`^#{1,${m[1].length}}\\s`, "m"));
  return fin < 0 ? suite : suite.slice(0, fin);
}
function confronterRevue(texte) {
  const section = sectionRevue(texte);
  const avertir = (message) => ({ statut: "AVERTISSEMENT", message: "règle neuve du 03/11/2026, non bloquante — " + message });
  if (section === null) return avertir("le dossier n'a pas de section « Revue de code ». Depuis D-162 (a), la revue se "
    + "propose à l'entrée de la MEP : écrire « Revue jouée le <date> : rapport <chemin>, <n> constats, <n> jetons », "
    + "« Revue proposée et refusée le <date> : <motif> » ou « Revue non proposée : dernière revue du <date> » (ETAPE-MEP.md § 1 quater)");
  if (/refus|non propos/i.test(section)) return { statut: "PASS", message: "revue de code dite proposée puis refusée, ou non proposée" };
  if (/\bjou[ée]+/i.test(section)) {
    const manque = [];
    if (!/\.md\b/.test(section)) manque.push("le rapport (chemin .md)");
    if (!/\d+\s*constats?\b|\bconstats?\s*:\s*\d+/i.test(section)) manque.push("le nombre de constats");
    if (!/\d[\d\s  ]*\s*jetons\b/i.test(section)) manque.push("les jetons relevés");
    return manque.length
      ? avertir(`revue déclarée jouée sans ${manque.join(", ")} — un ✓ nu ne mesure pas la part de faux constats`)
      : { statut: "PASS", message: "revue de code jouée, avec son rapport, ses constats et ses jetons" };
  }
  return avertir("la section « Revue de code » ne dit pas ce qu'il en est advenu — ni jouée, ni refusée, ni non proposée. "
    + "Une mention n'est pas un état.");
}

/**
 * TM15 et TM16 — ce que le dossier a LU en vrai avant le GO (M-21 et M-22, D-178 (a) et TF-2243, 06/11/2026).
 * Même forme que TM14 : une section par titre, le silence est le défaut, AVERTISSEMENT pour une règle neuve ;
 * TM16 refuse seulement un dossier qui porte lui-même un FAIL d'O-26 ou d'O-27, parce que la décision de
 * TF-2243 fait de ce FAIL un refus de la porte « prêt ».
 */
const TITRE_REGLAGES = /^(#{1,4})\s*R[ée]glages de plateforme\s*$/im;
const TITRE_VERSION = /^(#{1,4})\s*Version servie et inventaire\s*$/im;
function sectionDe(texte, titre) {
  const m = titre.exec(texte);
  if (!m) return null;
  const suite = texte.slice(m.index + m[0].length);
  const fin = suite.search(new RegExp(`^#{1,${m[1].length}}\\s`, "m"));
  return fin < 0 ? suite : suite.slice(0, fin);
}
const avertirNeuve = (message) => ({ statut: "AVERTISSEMENT", message: "règle neuve du 06/11/2026, non bloquante — " + message });
const DATE_LUE = /\b20\d{2}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/20\d{2}\b/;
function confronterReglages(texte) {
  const section = sectionDe(texte, TITRE_REGLAGES);
  if (section === null) return avertirNeuve("le dossier n'a pas de section « Réglages de plateforme ». Depuis D-178 (a), chaque réglage "
    + "du registre que le produit emploie y figure avec son état lu, sa date et son verdict, ou « Aucun réglage de plateforme : <motif> » "
    + "(ETAPE-MEP.md § 3 quaterdecies, R-66)");
  if (/aucun r[ée]glage de plateforme\s*:\s*\S.{8,}/i.test(section)) return { statut: "PASS", message: "aucun réglage de plateforme, motivé au dossier" };
  const lignes = section.split(/\r?\n/).filter((l) => /^\s*\|/.test(l));
  const separateur = (l) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && /-{2,}/.test(l);
  const lignesDonnees = lignes.filter((l, i) => !separateur(l) && !(lignes[i + 1] && separateur(lignes[i + 1])));
  if (!lignesDonnees.length) return avertirNeuve("la section « Réglages de plateforme » ne porte aucune ligne : une ligne par réglage lu "
    + "(réglage, classement, état lu, date, attendu, verdict ou décision)");
  const defauts = [];
  for (const l of lignesDonnees) {
    const nom = (l.split("|")[1] || "?").trim().slice(0, 40);
    if (!DATE_LUE.test(l)) defauts.push(`« ${nom} » : état lu non daté`);
    else if (/non lu/i.test(l)) defauts.push(`« ${nom} » : réglage non lu, donc non vérifié`);
    else if (!/conforme|[ée]cart/i.test(l)) defauts.push(`« ${nom} » : ni « conforme » ni « écart » au verdict`);
    else if (/[ée]cart/i.test(l) && !/\bD-\d+\b|d[ée]cision du porteur du \d/i.test(l)) defauts.push(`« ${nom} » : écart sans décision nommée (écart nu)`);
  }
  return defauts.length
    ? avertirNeuve(`${defauts.length} ligne(s) de réglage incomplète(s) — ${defauts.slice(0, 3).join(" ; ")}${defauts.length > 3 ? " ; …" : ""}`)
    : { statut: "PASS", message: `${lignesDonnees.length} réglage(s) de plateforme lu(s), datés, chacun avec son verdict` };
}
function confronterVersionServie(texte) {
  const section = sectionDe(texte, TITRE_VERSION);
  if (section === null) return avertirNeuve("le dossier n'a pas de section « Version servie et inventaire ». Depuis TF-2243, il cite la sortie de "
    + "`version-servie.mjs lire`, le verdict d'O-26 et celui d'O-27, ou « Sans objet : <motif> » (ETAPE-MEP.md § 3 quaterdecies, M-22)");
  if (/sans objet\s*:\s*\S.{8,}/i.test(section)) return { statut: "PASS", message: "version servie et inventaire sans objet, motivés au dossier" };
  const dernier = (n) => { const re = new RegExp(`O-?${n}\\b[^\\n]*?\\b(PASS|FAIL|SKIP)\\b`, "g"); let v = null, m; while ((m = re.exec(section)) !== null) v = m[1]; return v; };
  const o26 = dernier(26), o27 = dernier(27);
  const refus = [o26 === "FAIL" ? "O-26" : null, o27 === "FAIL" ? "O-27" : null].filter(Boolean);
  if (refus.length) return { statut: "FAIL", message: `le dossier porte un FAIL de ${refus.join(" et ")} : la porte « prêt » le refuse (TF-2243). `
    + "Corriger (version servie ou inventaire des composants), rejouer, puis écrire le nouveau verdict" };
  const manque = [];
  if (!/\b(?=[0-9a-f]*\d)[0-9a-f]{7,40}\b/.test(section)) manque.push("le commit lu par `version-servie.mjs lire`");
  if (!o26) manque.push("le verdict d'O-26");
  if (!o27) manque.push("le verdict d'O-27");
  if (manque.length) return avertirNeuve(`la section « Version servie et inventaire » ne porte pas ${manque.join(", ")}`);
  return o27 === "SKIP"
    ? avertirNeuve("O-27 rend SKIP : aucune sortie d'état n'a été donnée, l'inventaire des composants n'est pas comparé aux ressources réelles")
    : { statut: "PASS", message: `version servie lue (O-26 ${o26}) et inventaire confronté aux sorties d'état (O-27 ${o27})` };
}

/**
 * TM17 — le verdict websec du gate MEP, lu avec le paramètre qui l'arme (R-33 bis, TF-2506).
 * R-33 bis pose le verdict websec au gate, non bloquant par défaut, armable produit par produit par
 * `[gates] websec_bloquant = true` dans `docs\projet\PARAMETRAGE.md`. Rien ne lisait ce paramètre ni ce
 * verdict : le passer à `true` ne changeait aucun résultat. Les deux se lisent ici, sans verbe ni outil.
 * Un « Websec : sans objet : <motif> » écrit au dossier est reçu (produit sans surface web), dans les deux modes.
 */
function lireWebsecBloquant(racine) {
  const f = join(racine, "docs", "projet", "PARAMETRAGE.md");
  if (!existsSync(f)) return { valeur: false, source: null };
  let texte;
  try { texte = readFileSync(f, "utf8"); } catch { return { valeur: false, source: f, illisible: "fichier illisible" }; }
  const m = /^[ \t]*websec_bloquant[ \t]*=[ \t]*["']?([^\s#"']*)/im.exec(texte);
  if (!m) return { valeur: false, source: f };
  const v = m[1].toLowerCase();
  if (v === "true" || v === "false") return { valeur: v === "true", source: f };
  return { valeur: false, source: f, illisible: m[1] || "(vide)" };
}
const VERDICT_WEBSEC = /\b(oracle-exposition|oracle-sca|forge-websec|websec)\b[^\n]*?\b(PASS|FAIL|SKIP)\b/gi;
function verdictsWebsec(texte) {
  const par = new Map();
  for (const m of texte.matchAll(VERDICT_WEBSEC)) {
    const nom = m[1].toLowerCase();
    par.set(nom === "oracle-exposition" || nom === "oracle-sca" ? nom : "websec", m[2].toUpperCase());   // le dernier verdict d'un oracle compte
  }
  return par;
}
function confronterWebsec(texte, param) {
  const verdicts = [...verdictsWebsec(texte).entries()];
  const dit = verdicts.map(([n, v]) => `${n} ${v}`).join(", ");
  if (/websec[^\n]*sans objet\s*:\s*\S.{8,}/i.test(texte)) return { statut: "PASS", message: "verdict websec sans objet, motivé au dossier" };
  const valeurs = verdicts.map(([, v]) => v);
  const manque = !valeurs.length ? "le dossier ne porte aucun verdict websec"
    : valeurs.includes("FAIL") ? `le dossier porte un FAIL websec (${dit})`
      : valeurs.includes("SKIP") ? `un verdict websec est SKIP (${dit}) : l'audit n'a pas eu lieu, ce n'est pas un PASS` : null;
  if (param.valeur === true) {
    return manque
      ? { statut: "FAIL", message: `le gate websec est ARMÉ (\`websec_bloquant = true\`, docs\\projet\\PARAMETRAGE.md) et ${manque} : le GO est bloqué (R-33 bis). `
        + "Écrire le verdict de `oracle-exposition` et `oracle-sca` (ETAPE-MEP.md § 4), corriger puis rejouer ce qui a échoué, ou « Websec : sans objet : <motif> »" }
      : { statut: "PASS", message: `gate websec armé et verdict porté au dossier (${dit})` };
  }
  const avertir = (m) => ({ statut: "AVERTISSEMENT", message: `R-33 bis, gate websec NON bloquant (${param.source ? "`websec_bloquant = false`" : "défaut de l'écosystème : `websec_bloquant` absent"}) — ${m}` });
  if (param.illisible) return avertir(`la valeur de \`websec_bloquant\` est illisible (« ${param.illisible} », docs\\projet\\PARAMETRAGE.md) : lue comme \`false\`. Écrire \`true\` ou \`false\``);
  if (manque) return avertir(`${manque}. Un manque se déclare au dossier (verdict d'\`oracle-exposition\` et d'\`oracle-sca\`, ou « Websec : sans objet : <motif> »), il ne passe pas en silence ; `
    + "le passage au bloquant se décide par `[gates] websec_bloquant = true` (REGLES-PROJET.md, R-33 bis)");
  return { statut: "PASS", message: `verdict websec porté au dossier (${dit})` };
}

export function juger(racine) {
  const findings = [];
  const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const sansObjet = (regle, ou, message) => findings.push({ regle, statut: "SANS_OBJET", ou, message });

  const dossiers = dossiersMep(racine);
  // TF-1267 — LA BORNE DE RECHERCHE SE DÉCLARE. Un dossier de MEP posé plus profond que la borne
  // échappait à ce contrôle sans qu'aucune ligne du verdict ne le dise, et le silence se lisait
  // comme « rien à signaler ». Il se lit désormais comme ce qu'il est : « non regardé ».
  if (dossiers.bornesAtteintes?.length) {
    findings.push({ regle: "TM0", statut: "NON_JUGE", ou: racine, message:
      `recherche bornée à ${dossiers.profondeur} niveaux : ${dossiers.bornesAtteintes.length} branche(s) `
      + `non descendue(s) — ${dossiers.bornesAtteintes.slice(0, 4).join(", ")}`
      + `${dossiers.bornesAtteintes.length > 4 ? ", …" : ""}. Un DOSSIER-MEP plus profond n'est PAS jugé, `
      + `et ce silence-là est déclaré plutôt que tu` });
  }
  if (!dossiers.length) {
    sansObjet("TM1", racine, "aucun DOSSIER-MEP.md sous ce produit — l'étape de mise en production "
      + "n'a pas été atteinte. Ce n'est pas un défaut : c'est une absence d'événement, et juger une "
      + "absence d'événement reviendrait à accabler un projet pour ne pas être allé assez loin.");
    return findings;
  }

  const note = marqueur(racine);
  for (const chemin of dossiers) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); }
    catch (e) { ko("TM1", chemin, `dossier illisible (${e.code || e.message}) — un dossier qu'on ne peut pas lire ne prouve rien`); continue; }

    // TM1 — le dossier PARLE de la mutation, dans un sens ou dans l'autre.
    const parle = PARLE_DE_MUTATION.test(texte);
    const joueeDite = parle && affirmeJouee(texte);
    const refusDit = parle && (DECLAREE_REFUSEE.test(texte) || PROPOSEE.test(texte));
    if (!parle) {
      ko("TM1", chemin, "le dossier de MEP ne dit RIEN de la campagne de mutation. Depuis D-34 "
        + "(01/09/2026) elle est à la demande et se propose ICI : un dossier muet est indiscernable "
        + "d'une étape où personne n'y a pensé. Écrire « campagne jouée — <preuve> » ou "
        + "« campagne proposée et refusée — <motif> » ; les deux sont recevables, le silence non.");
      continue;
    }
    if (!joueeDite && !refusDit) {
      ko("TM1", chemin, "le dossier mentionne la mutation sans dire ce qu'il en est advenu — ni jouée, "
        + "ni proposée puis refusée. Une mention n'est pas un état.");
      continue;
    }
    ok("TM1", chemin, joueeDite ? "campagne déclarée jouée" : "campagne déclarée proposée puis non jouée");

    if (!joueeDite) {
      sansObjet("TM2", chemin, "campagne non jouée — il n'y a pas de preuve de campagne à exiger ; "
        + "la décision de ne pas la jouer est humaine (R-29) et cet oracle ne la juge pas");
      sansObjet("TM3", chemin, "campagne non jouée — aucun marqueur n'est dû");
      continue;
    }

    // TM2 — une campagne jouee porte sa preuve chiffree ou localisante.
    PREUVE.test(texte)
      ? ok("TM2", chemin, "la campagne déclarée jouée porte une preuve chiffrée ou localisante")
      : ko("TM2", chemin, "campagne déclarée JOUÉE sans preuve : ni score, ni compte de mutants ou de "
          + "survivants, ni chemin du marqueur. Un ✓ nu dans un dossier de MEP est la pièce qu'on "
          + "relit six mois plus tard en croyant qu'elle prouve quelque chose.");

    // TM3 — la declaration s'adosse au marqueur que la campagne ecrit elle-meme.
    if (!note) {
      ko("TM3", chemin, "campagne déclarée JOUÉE, et AUCUN marqueur `forge\\mutation-derniere-campagne.json` "
        + "chez ce produit. Ce fichier n'existe que si l'adaptateur est allé au bout : une déclaration "
        + "sans lui est une affirmation, et c'est la seule des trois règles qu'une phrase bien "
        + "tournée ne peut pas satisfaire.");
    } else if (!note.sha) {
      ko("TM3", chemin, "le marqueur existe mais ne porte aucun point de référence (`sha` absent) — "
        + "sans lui, la condition « depuis plusieurs modifications de code » n'a rien à compter, et "
        + "la prochaine campagne sera proposée à tort ou passée sous silence.");
    } else {
      ok("TM3", chemin, `campagne adossée au marqueur du produit (référence ${String(note.sha).slice(0, 12)})`);
    }
  }

  // TM4 — une fois par produit, pas une fois par dossier : les journaux sont les mêmes.
  const va = confronterVerdictsArchives(racine);
  findings.push({ regle: "TM4", statut: va.statut, ou: racine, message: va.message });
  // TM5 — une fois par produit aussi : le verbe lit ensemble la chaîne et tous les dossiers.
  const pj = confronterPortesDuJour(racine);
  findings.push({ regle: "TM5", statut: pj.statut, ou: racine, message: pj.message });
  // TM6 — de même : le verbe lit ensemble l'infrastructure du produit et tous ses dossiers.
  const gf = confronterGardeFous(racine);
  findings.push({ regle: "TM6", statut: gf.statut, ou: racine, message: gf.message });
  // TM7 — les scripts du produit, jugés hors ligne contre la table officielle datée.
  const da = confronterDroitsAccordes(racine);
  findings.push({ regle: "TM7", statut: da.statut, ou: racine, message: da.message });
  // TM8 — la chaîne du produit et son dossier, jugés ensemble par le verbe.
  const ec = confronterEtapeChaine(racine);
  findings.push({ regle: "TM8", statut: ec.statut, ou: racine, message: ec.message });
  // TM9 — les parcours tiers embarqués du produit, jugés ensemble avec son dossier par le verbe.
  const pt = confronterParcoursTiers(racine);
  findings.push({ regle: "TM9", statut: pt.statut, ou: racine, message: pt.message });
  // TM10 — les contre-lectures de plan des dossiers du produit, jugées ensemble par le verbe.
  const cl = confronterContreLecture(racine);
  findings.push({ regle: "TM10", statut: cl.statut, ou: racine, message: cl.message });
  // TM11 à TM13 — les exigences fatales du référentiel d'audit, jugées une par une par le même verbe.
  for (const [regle, confronter] of [["TM11", confronterChaine], ["TM12", confronterSauvegarde], ["TM13", confronterIdentite]]) {
    const v = confronter(racine);
    findings.push({ regle, statut: v.statut, ou: racine, message: v.message });
  }
  // TM14 — une fois par dossier, comme TM1 : chaque dossier dit ce qu'il en est de la revue de code.
  for (const chemin of dossiers) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); } catch { continue; }
    const rv = confronterRevue(texte);
    findings.push({ regle: "TM14", statut: rv.statut, ou: chemin, message: rv.message });
  }
  // TM15 et TM16 — une fois par dossier : les réglages de plateforme lus, la version servie et l'inventaire.
  for (const chemin of dossiers) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); } catch { continue; }
    const rg = confronterReglages(texte);
    findings.push({ regle: "TM15", statut: rg.statut, ou: chemin, message: rg.message });
    const vs = confronterVersionServie(texte);
    findings.push({ regle: "TM16", statut: vs.statut, ou: chemin, message: vs.message });
  }
  // TM17 — une fois par dossier : le verdict websec du gate, lu avec le paramètre `websec_bloquant` du produit (R-33 bis, TF-2506).
  const parametreWebsec = lireWebsecBloquant(racine);
  for (const chemin of dossiers) {
    let texte;
    try { texte = readFileSync(chemin, "utf8"); } catch { continue; }
    const ws = confronterWebsec(texte, parametreWebsec);
    findings.push({ regle: "TM17", statut: ws.statut, ou: chemin, message: ws.message });
  }
  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL"
  : f.every((x) => x.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS");

const NON_JUGE = [
  "la QUALITÉ d'un refus : « proposée et refusée » est une décision humaine (R-29) — l'oracle "
  + "vérifie qu'elle est écrite, jamais qu'elle est sage",
  "la FRAÎCHEUR du marqueur par rapport au dossier : comparer leurs dates supposerait un même "
  + "fuseau et une même main, ce qui n'est pas garanti",
  "un produit SANS dossier de MEP : SANS_OBJET, jamais FAIL — l'étape n'a pas été atteinte",
  "la véracité d'un score recopié à la main dans le dossier : TM3 adosse la déclaration au "
  + "marqueur, il ne recalcule pas la campagne",
  "la JUSTESSE d'un verdict forge-ops archivé (TM4) : le verbe dit s'il porte encore sur la cible "
  + "présente, jamais s'il était juste — et TM4 AVERTIT sans jamais bloquer, parce que le remède "
  + "(rejouer l'oracle) appartient à forge-ops et qu'un contrôle qui bloque sur ce qu'il ne peut pas "
  + "faire réparer apprend à être contourné",
  "la VÉRACITÉ du parcours déclaré joué (TM9) : le verbe exige la section, sa date, son lieu (un navigateur) et "
  + "son objet (l'état exécuté) ; il ne rejoue pas le clic, et TM9 AVERTIT sans bloquer — règle neuve du 13/10/2026",
  "la VÉRITÉ des paramètres recopiés à la contre-lecture (TM10) : le verbe exige la valeur à l'exécution, sa source, la "
  + "valeur attendue et sa référence, il ne relit pas l'API de la chaîne ; un vote de plan dit en d'autres mots n'est pas "
  + "vu : ce silence-là passe TM10, bien que la règle bloque depuis la décision sur TF-1688 (14/10/2026)",
  "la RÉALITÉ des déploiements, sauvegardes et authentifications déclarés (TM11 à TM13) : le verbe exige la "
  + "section, la chaîne et son exécution, la déclaration de sauvegarde jugée par O-19, le fournisseur et le MFA ; "
  + "l'inventaire des accès de déploiement direct et la capture de la configuration d'identité restent des gestes "
  + "d'audit (forge-audit) — et ces trois règles AVERTISSENT sans bloquer, règles neuves du 17/10/2026",
  "le CONTENU d'un rapport de revue de code (TM14) : la règle lit la section du dossier, ni le rapport, ni le "
  + "marqueur forge\\revue-de-code-derniere.json, ni le compte des commits depuis la dernière revue ; la vérité "
  + "des statuts recopiés n'est pas jugée, et TM14 AVERTIT sans bloquer",
  "la VÉRITÉ des réglages de plateforme recopiés au dossier (TM15) et des verdicts d'O-26 et d'O-27 (TM16) : la règle lit les "
  + "sections du dossier, elle ne rejoue ni la commande de lecture du registre, ni la lecture de la version servie, ni la "
  + "confrontation de l'inventaire ; que le dossier cite tous les réglages des plateformes que le produit emploie n'est pas jugé "
  + "non plus, faute de savoir lesquelles il emploie. TM15 avertit sans bloquer, TM16 ne bloque que le FAIL que le dossier porte lui-même",
  "l'HEURE du rejeu des portes à base externe (TM5) : la règle est le jour du lancement ; une base qui "
  + "change entre le rejeu du matin et un lancement du soir n'est pas vue",
  "la VÉRITÉ du verdict websec recopié au dossier (TM17) et la justesse d'un « Websec : sans objet » : la règle lit le dossier et le "
  + "paramètre `[gates] websec_bloquant` de docs\\projet\\PARAMETRAGE.md, elle ne rejoue ni `oracle-exposition` ni `oracle-sca` ; le passage du "
  + "paramètre à `true` se consigne comme toute décision (qui, quand, sur quel constat), ce que cet oracle ne vérifie pas ; "
  + "TM17 avertit sans bloquer tant que le produit n'a pas armé le gate lui-même",
];

// --- Banc a double sens ------------------------------------------------------------------------
function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "trace-mutation-"));
  const produit = (nom, dossier, note, parametrage) => {
    const racine = join(dir, nom);
    mkdirSync(join(racine, "forge", "etapes", "mep"), { recursive: true });
    if (parametrage !== undefined) { mkdirSync(join(racine, "docs", "projet"), { recursive: true }); writeFileSync(join(racine, "docs", "projet", "PARAMETRAGE.md"), parametrage, "utf8"); }
    if (dossier !== null) writeFileSync(join(racine, "forge", "etapes", "mep", "DOSSIER-MEP.md"), dossier, "utf8");
    if (note) writeFileSync(join(racine, "forge", "mutation-derniere-campagne.json"), JSON.stringify(note), "utf8");
    return racine;
  };
  // Un journal de verdicts forge-ops à côté de sa cible, au format `forge-ops/verdict@1`. `scelle`
  // à faux pose une empreinte qui ne correspond plus : c'est le cas PÉRIMÉ, celui que TM4 existe
  // pour voir. L'empreinte juste est calculée par la fonction PARTAGÉE, comme forge-ops l'écrit.
  const avecJournal = (racine, scelle) => {
    const cible = join(racine, "page.md");
    writeFileSync(cible, "# Page\nligne\n", "utf8");
    writeFileSync(join(racine, ".ops-journal.jsonl"), JSON.stringify({
      format: "forge-ops/verdict@1", ts: "2026-09-20T10:00:00.000Z", cible, verdict: "PASS", exit: 0,
      empreinte: { format: "forge-ops/empreinte@1", release: cible, fichiers: { "page.md": scelle ? empreinteFichier(cible) : "0".repeat(64) } },
    }) + "\n", "utf8");
    return racine;
  };
  const casse = [];
  const attendre = (nom, racine, regle, statut) => {
    const f = juger(racine).filter((x) => x.regle === regle);
    if (!f.length) return casse.push(`${nom} : ${regle} n'a rendu AUCUN verdict — la règle est muette sur un cas qu'elle doit voir`);
    if (f[0].statut !== statut) casse.push(`${nom} : ${regle} rend ${f[0].statut}, attendu ${statut} — ${f[0].message.slice(0, 120)}`);
  };

  // VERT : campagne jouee, chiffree, adossee au marqueur.
  attendre("vert", produit("vert",
    "# Dossier de MEP\n\nCampagne de mutation JOUÉE avant ce passage : score 0,82, 41 mutants viables, 7 survivants nommés.\n",
    { sha: "abc1234def5678", score: 0.82 }), "TM3", "PASS");

  // ROUGE 1 : le dossier ne dit RIEN de la mutation — le silence, le cas fondateur.
  attendre("muet", produit("muet", "# Dossier de MEP\n\nBuild OK, healthcheck ×3 OK, smoke tests OK.\n", null), "TM1", "FAIL");

  // ROUGE 2 : campagne declaree jouee, AUCUNE preuve chiffree.
  attendre("sans-preuve", produit("sans-preuve",
    "# Dossier de MEP\n\nLa campagne de mutation a été jouée, tout est bon.\n",
    { sha: "abc1234def5678" }), "TM2", "FAIL");

  // ROUGE 3 : campagne declaree jouee, AUCUN marqueur — la regle qu'une phrase ne peut pas satisfaire.
  attendre("sans-marqueur", produit("sans-marqueur",
    "# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n", null), "TM3", "FAIL");

  // ROUGE 4 : marqueur present mais SANS point de reference.
  attendre("marqueur-nu", produit("marqueur-nu",
    "# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n",
    { score: 0.91 }), "TM3", "FAIL");

  // VERT 2 : campagne PROPOSEE et refusee — recevable, et TM2/TM3 ne s'appliquent pas.
  const refus = produit("refus",
    "# Dossier de MEP\n\nCampagne de mutation proposée (12 modifications depuis la dernière) puis "
    + "écartée pour ce passage : correctif d'une ligne, décision humaine du jour.\n", null);
  attendre("refus", refus, "TM1", "PASS");
  attendre("refus", refus, "TM2", "SANS_OBJET");
  attendre("refus", refus, "TM3", "SANS_OBJET");

  // TF-1803 (lot Produit-83 20261015b, RT-15) : « jouée » dans une phrase NIÉE n'est pas une campagne
  // jouée. Avant : « non jouée » et « n'a pas été jouée » faisaient exiger preuve et marqueur (TM2/TM3
  // FAIL) à un refus pourtant écrit. Vert : les deux négations rendent TM2 et TM3 SANS_OBJET. Borne :
  // une phrase niée SUIVIE d'une affirmation dans une autre proposition reste une campagne jouée.
  for (const [nom, phrase] of [
    ["nie-non", "Campagne de mutation non jouée : proposée au porteur puis refusée pour ce passage, décision du jour.\n"],
    ["nie-pas", "La campagne de mutation n'a pas été jouée ; elle a été écartée par décision humaine du jour.\n"],
  ]) {
    const r = produit(nom, "# Dossier de MEP\n\n" + phrase, null);
    attendre(nom, r, "TM1", "PASS");
    attendre(nom, r, "TM2", "SANS_OBJET");
    attendre(nom, r, "TM3", "SANS_OBJET");
  }
  attendre("nie-puis-joue", produit("nie-puis-joue",
    "# Dossier de MEP\n\nLa campagne de mutation n'a pas été jouée hier ; la campagne de mutation a été rejouée ce matin : score 0,8 sur 30 mutants.\n",
    { sha: "abc1234def5678" }), "TM2", "PASS");

  // SANS OBJET : produit sans dossier de MEP — une absence d'evenement ne s'accable pas.
  attendre("sans-dossier", produit("sans-dossier", null, null), "TM1", "SANS_OBJET");

  // ---- TM4 : LE CÂBLAGE DU VERBE (TF-1084) ---------------------------------------------------
  const DOSSIER_OK = "# Dossier de MEP\n\nCampagne de mutation jouée : score 0,91 sur 33 mutants.\n";
  const MARQUEUR = { sha: "abc1234def5678" };
  // SANS OBJET : aucun journal forge-ops sous le produit — l'absence d'un artefact d'un TIERS
  // n'est pas un defaut du produit, et TM4 ne doit jamais la compter pour une fraicheur.
  attendre("tm4-sans-journal", produit("tm4-sans-journal", DOSSIER_OK, MARQUEUR), "TM4", "SANS_OBJET");
  // VERT : verdict archive dont la cible n'a pas bouge — il se cite au dossier.
  attendre("tm4-frais", avecJournal(produit("tm4-frais", DOSSIER_OK, MARQUEUR), true), "TM4", "PASS");
  // ROUGE (au sens de TM4 : un AVERTISSEMENT, jamais un echec) : la cible a change depuis le verdict.
  const perime = avecJournal(produit("tm4-perime", DOSSIER_OK, MARQUEUR), false);
  attendre("tm4-perime", perime, "TM4", "AVERTISSEMENT");
  // ET LA PROPRIETE QUI COMPTE : un verdict perime NE MET PAS l'oracle en echec. Sans ce cas, rien
  // ne distinguerait « avertit » de « bloque », et la promesse de l'en-tete serait invérifiable.
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), perime], { encoding: "utf8" });
    if (r.status !== 0) casse.push("un verdict forge-ops PÉRIMÉ fait sortir l'oracle en échec — TM4 devait AVERTIR, pas bloquer");
    if (!/TM4/.test(r.stdout) || !/PÉRIMÉ/.test(r.stdout)) casse.push("TM4 n'apparaît pas au verdict JSON — un avertissement que personne ne lit n'est pas un avertissement");
  }

  // ---- TM5 : LES PORTES DU JOUR (M-10, TF-1498) ------------------------------------------------
  // Une chaîne qui joue `npm audit`, et un feu vert au format de ETAPE-MEP.md § 3 nonies.
  const avecChaine = (racine) => {
    writeFileSync(join(racine, "azure-pipelines.yml"), "steps:\n  - script: npm audit --audit-level=high\n", "utf8");
    return racine;
  };
  const FEU_VERT = (jour) => `${DOSSIER_OK}\n## Feu vert de lancement\n\nLancement : 2026-09-30 · Objet lancé : 630f874\n\n`
    + "| Porte | Rejouée le | Objet jugé | Verdict |\n|---|---|---|---|\n"
    + `| \`npm audit --audit-level=high\` | ${jour} 09:12 | 630f874 | 0 vulnérabilité haute |\n`;
  // SANS OBJET : ni porte à base externe dans la chaîne, ni au dossier.
  attendre("tm5-sans-porte", produit("tm5-sans-porte", DOSSIER_OK, MARQUEUR), "TM5", "SANS_OBJET");
  // VERT : la porte de la chaîne rejouée le jour du lancement, sur l'objet lancé.
  attendre("tm5-du-jour", avecChaine(produit("tm5-du-jour", FEU_VERT("2026-09-30"), MARQUEUR)), "TM5", "PASS");
  // ROUGE : le cas fondateur du 30/09/2026 — la porte datée de la veille.
  const veille = avecChaine(produit("tm5-veille", FEU_VERT("2026-09-29"), MARQUEUR));
  attendre("tm5-veille", veille, "TM5", "FAIL");
  // ET IL BLOQUE : un feu vert sur le verdict de la veille met l'oracle en échec, à la différence de TM4.
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), veille], { encoding: "utf8" });
    if (r.status !== 1) casse.push("un feu vert sur les portes de la VEILLE ne met pas l'oracle en échec — TM5 devait bloquer");
  }

  // ---- TM6 : LES GARDE-FOUS DE LA PLATEFORME ET LES CONTRAINTES CONNUES (M-11, TF-1495, TF-1496) ----
  // Une infrastructure Azure, et la contrainte apprise en qualification, écrite en commentaire.
  const avecInfra = (racine) => {
    mkdirSync(join(racine, "infra"), { recursive: true });
    writeFileSync(join(racine, "infra", "main.tf"), "provider \"azurerm\" {\n  features {}\n}\n", "utf8");
    writeFileSync(join(racine, "infra", "hpr.tfvars"), "# Obligatoire ici : stratégie de la souscription, authentification exigée\n", "utf8");
    return racine;
  };
  const GARDE_FOUS = `${DOSSIER_OK}\n## Garde-fous de la plateforme et contraintes connues\n\n`
    + "Relevé du 2026-09-21 : `az policy assignment list --scope <portée> --disable-scope-strict-match`.\n"
    + "Registre des garde-fous de la factory lu le 2026-09-21 : GFP-001.\n\n"
    + "| Id | Garde-fou | Source | Verdict |\n|---|---|---|---|\n"
    + "| GF-01 | une Web App sans authentification ne s'écrit pas | infra/hpr.tfvars ; GFP-001 | amorçage sans authentification impossible |\n";
  // SANS OBJET : ni infrastructure Azure, ni contrainte connue — les fixtures ci-dessus.
  attendre("tm6-sans-objet", join(dir, "vert"), "TM6", "SANS_OBJET");
  // VERT : relevé daté, contrainte de la qualification relue, registre lu.
  attendre("tm6-releve", avecInfra(produit("tm6-releve", GARDE_FOUS, MARQUEUR)), "TM6", "PASS");
  // ROUGE : le cas fondateur du 21/09/2026 — un dossier conçu sans relevé, la contrainte jamais relue.
  const sansReleve = avecInfra(produit("tm6-sans-releve", DOSSIER_OK, MARQUEUR));
  attendre("tm6-sans-releve", sansReleve, "TM6", "FAIL");
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), sansReleve], { encoding: "utf8" });
    if (r.status !== 1) casse.push("un dossier conçu sans relevé des garde-fous ne met pas l'oracle en échec — TM6 devait bloquer");
  }

  // ---- TM7 : LES SCRIPTS QUI ACCORDENT UN DROIT (M-12, TF-1497) ----------------------------------
  // Le script du cas fondateur, réduit à ses 3 défauts, et son remède.
  const avecScript = (racine, identifiant, remede) => {
    mkdirSync(join(racine, "infra"), { recursive: true });
    writeFileSync(join(racine, "infra", "creer-connexion.sh"), [
      `GRAPH_APP_RW_OWNEDBY="${identifiant}"`,
      `az ad app permission add --id "$APP" --api 00000003-0000-0000-c000-000000000000 --api-permissions "$GRAPH_APP_RW_OWNEDBY=Role"${remede ? "" : " 2>/dev/null || true"}`,
      ...(remede ? ["az ad app permission list --id \"$APP\" -o tsv | grep -q \"$GRAPH_APP_RW_OWNEDBY\""] : []),
      "echo \"Application.ReadWrite.OwnedBy consentie\"",
      "",
    ].join("\n"), "utf8");
    return racine;
  };
  // SANS OBJET : aucun identifiant Graph ni commande d'octroi.
  attendre("tm7-sans-objet", join(dir, "vert"), "TM7", "SANS_OBJET");
  // VERT : l'identifiant officiel, l'échec visible, l'effet relu avant l'annonce.
  attendre("tm7-remede", avecScript(produit("tm7-remede", DOSSIER_OK, MARQUEUR), "18a4783c-866b-4cc7-a460-3d5e5662c884", true), "TM7", "PASS");
  // ROUGE : le cas fondateur du 16/09/2026 — identifiant de mémoire, ajout masqué, « consentie » sans relecture.
  const memoire = avecScript(produit("tm7-memoire", DOSSIER_OK, MARQUEUR), "18a4783c-866b-4cc7-a460-3d0e455740fd", false);
  attendre("tm7-memoire", memoire, "TM7", "FAIL");
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), memoire], { encoding: "utf8" });
    if (r.status !== 1) casse.push("un script qui accorde un droit sur un identifiant de mémoire ne met pas l'oracle en échec — TM7 devait bloquer");
  }

  // ---- TM8 : LES ÉTAPES DE CHAÎNE (M-13, TF-1546, TF-1548, TF-1549) ------------------------------
  // L'étape du cas fondateur du 01/10/2026 : fiche créée puis écrite aussitôt, `az webapp auth update --set`.
  const avecEtape = (racine, remede) => {
    mkdirSync(join(racine, "infra"), { recursive: true });
    writeFileSync(join(racine, "infra", "fiche-entra.sh"), remede
      ? ["APP_ID=$(az ad app create --display-name x --query appId -o tsv)", "for i in $(seq 1 12); do az ad app show --id \"$APP_ID\" -o none && break; sleep 10; done",
        "az ad app update --id \"$APP_ID\" --set web.redirectUris=u", ""].join("\n")
      : ["APP_ID=$(az ad app create --display-name x --query appId -o tsv)", "az ad app update --id \"$APP_ID\" --set web.redirectUris=u",
        "az webapp auth update -g g -n a --set identityProviders.azureActiveDirectory.enabled=true", ""].join("\n"), "utf8");
    return racine;
  };
  // SANS OBJET : ni objet d'annuaire créé, ni az webapp auth, ni chaîne qui écrit.
  attendre("tm8-sans-objet", join(dir, "vert"), "TM8", "SANS_OBJET");
  // VERT : l'objet lu en boucle avant d'être complété.
  attendre("tm8-remede", avecEtape(produit("tm8-remede", DOSSIER_OK, MARQUEUR), true), "TM8", "PASS");
  // ROUGE : le cas fondateur — la fiche écrite aussitôt créée, l'authentification par az webapp auth.
  const etape = avecEtape(produit("tm8-etape", DOSSIER_OK, MARQUEUR), false);
  attendre("tm8-etape", etape, "TM8", "FAIL");
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), etape], { encoding: "utf8" });
    if (r.status !== 1) casse.push("une fiche d'annuaire écrite aussitôt créée ne met pas l'oracle en échec — TM8 devait bloquer");
  }

  // ---- TM9 : LES PARCOURS TIERS EMBARQUÉS (M-14, TF-1583) ----------------------------------------
  // Le produit du cas fondateur du 25/08/2026, réduit à son fait : un cadre de réservation intégré et la
  // politique de contenu qui nomme la passerelle de paiement.
  const avecParcours = (racine, dossier) => {
    mkdirSync(join(racine, "site"), { recursive: true });
    writeFileSync(join(racine, "site", "reservation.html"), '<iframe src="https://www.beds24.com/booking2.php" title="Réservation"></iframe>\n', "utf8");
    writeFileSync(join(racine, "staticwebapp.config.json"), '{ "value": "frame-src \'self\' https://www.beds24.com https://js.stripe.com" }\n', "utf8");
    writeFileSync(join(racine, "forge", "etapes", "mep", "DOSSIER-MEP.md"), dossier, "utf8");
    return racine;
  };
  const PARCOURS_DITS = `${DOSSIER_OK}\n## Parcours tiers embarqués\n\n- Tiers : beds24 (réservation) et stripe (paiement de l'acompte).\n`
    + "- Joué dans un navigateur le 2026-10-13, sur l'état exécuté (DOM après chargement), pas sur le HTML servi.\n"
    + "- Étape atteinte : jusqu'à l'étape qui encaisse ; l'encaissement lui-même est à confirmer par un paiement réel.\n";
  // SANS OBJET : aucun parcours tiers embarqué dans le produit.
  attendre("tm9-sans-objet", join(dir, "vert"), "TM9", "SANS_OBJET");
  // VERT : le parcours nommé, joué dans un navigateur sur l'état exécuté, étape déclarée.
  attendre("tm9-remede", avecParcours(produit("tm9-remede", DOSSIER_OK, MARQUEUR), PARCOURS_DITS), "TM9", "PASS");
  // ROUGE : le cas fondateur — un dossier muet sur un parcours de paiement embarqué.
  const muetParcours = avecParcours(produit("tm9-muet", DOSSIER_OK, MARQUEUR), DOSSIER_OK);
  attendre("tm9-muet", muetParcours, "TM9", "AVERTISSEMENT");
  // ET IL N'EST PAS BLOQUANT : règle neuve, sortie 0 — sans ce cas, « avertit » ne se distingue pas de « bloque ».
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), muetParcours], { encoding: "utf8" });
    if (r.status !== 0) casse.push("un parcours tiers embarqué sans section au dossier fait sortir l'oracle en échec — TM9 devait AVERTIR, règle neuve du 13/10/2026");
    if (!/TM9/.test(r.stdout) || !/Parcours tiers embarqués/.test(r.stdout)) casse.push("TM9 n'apparaît pas au verdict JSON — un avertissement que personne ne lit n'est pas un avertissement");
  }

  // ---- TM10 : LA CONTRE-LECTURE D'UN PLAN VOTÉ (M-15, TF-1681) -----------------------------------
  // Le cas fondateur du 29/09/2026, réduit à son fait : un plan soumis au vote, une contre-lecture qui
  // n'a lu que le plan, un paramètre de lancement à 12 quand la décision disait 11.
  const VOTE_PLAN = `${DOSSIER_OK}\nLe plan d'infrastructure est soumis au vote de l'exploitant avant application : 11 créations.\n`;
  const CONTRE_LECTURE = `${VOTE_PLAN}\n## Contre-lecture du plan\n\n| Paramètre | Valeur à l'exécution | Lue où | Valeur attendue | Référence | Concorde |\n`
    + "|---|---|---|---|---|---|\n| seuilCreations | 12 | API de la chaîne, exécution 15452 | 11 | décision D-54 (a) | non — exécution annulée, relancée à 11 |\n\n"
    + "Non comparé : les variables de la bibliothèque de la chaîne, que l'exécution ne publie pas.\n";
  // SANS OBJET : aucun plan voté, aucune contre-lecture.
  attendre("tm10-sans-objet", join(dir, "vert"), "TM10", "SANS_OBJET");
  // VERT : le paramètre lu à l'exécution, comparé à la décision, l'écart tranché, le non-comparé publié.
  attendre("tm10-remede", produit("tm10-remede", CONTRE_LECTURE, MARQUEUR), "TM10", "PASS");
  // ROUGE : le cas fondateur — un plan voté sans contre-lecture des paramètres.
  const muetPlan = produit("tm10-muet", VOTE_PLAN, MARQUEUR);
  attendre("tm10-muet", muetPlan, "TM10", "FAIL");
  // ET IL BLOQUE depuis la décision sur TF-1688 (14/10/2026) : sortie 1, comme TM5 à TM8.
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), muetPlan], { encoding: "utf8" });
    if (r.status !== 1) casse.push("un plan voté sans contre-lecture ne met pas l'oracle en échec — TM10 devait bloquer depuis la décision sur TF-1688");
    if (!/TM10/.test(r.stdout) || !/Contre-lecture/.test(r.stdout)) casse.push("TM10 n'apparaît pas au verdict JSON — un refus que personne ne lit ne protège rien");
  }

  // ---- TM11 à TM13 : LES EXIGENCES FATALES DU RÉFÉRENTIEL D'AUDIT (M-16 à M-18, TF-1212) -------------
  // Le cas fondateur du 09/09/2026, réduit à son fait : un dossier de MEP qui prescrit `railway up`
  // depuis le poste et ne dit rien de la sauvegarde ni du fournisseur d'identité. Le remède : les trois
  // sections, avec la chaîne nommée et son exécution, et des « aucun » motivés.
  const MANUEL = `${DOSSIER_OK}\n## Production : commandes exactes\n\n\`\`\`bash\nrailway up --detach --service app --environment production\n\`\`\`\n`;
  const ALIGNE = `${DOSSIER_OK}\n## Chaîne de déploiement\n\nChaîne : \`.github/workflows/deploiement.yml\`, porte d'approbation de l'environnement production. `
    + "Exécution 15452 du 2026-10-17 : auteur, version 6f78b88, cible production, résultat succès.\n\n"
    + "## Sauvegarde et restauration\n\nAucun actif de données critique : site statique, le dépôt git est la source de tout le contenu servi.\n\n"
    + "## Fournisseur d'identité\n\nAucun accès humain authentifié : site public sans compte ni espace d'administration.\n";
  const avecWorkflow = (racine) => {
    mkdirSync(join(racine, ".github", "workflows"), { recursive: true });
    writeFileSync(join(racine, ".github", "workflows", "deploiement.yml"), "on: push\njobs:\n  d:\n    steps:\n      - run: railway up --ci\n", "utf8");
    return racine;
  };
  const manuel = avecWorkflow(produit("tm11-manuel", MANUEL, MARQUEUR));
  attendre("tm11-manuel", manuel, "TM11", "AVERTISSEMENT");
  attendre("tm12-muet", manuel, "TM12", "AVERTISSEMENT");
  attendre("tm13-muet", manuel, "TM13", "AVERTISSEMENT");
  const aligne = avecWorkflow(produit("tm11-aligne", ALIGNE, MARQUEUR));
  attendre("tm11-aligne", aligne, "TM11", "PASS");
  attendre("tm12-aligne", aligne, "TM12", "PASS");
  attendre("tm13-aligne", aligne, "TM13", "PASS");
  // ET ILS NE BLOQUENT PAS : règles neuves, sortie 0, et le refus se lit au verdict JSON.
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), manuel], { encoding: "utf8" });
    if (r.status !== 0) casse.push("un dossier qui prescrit un déploiement direct sans sauvegarde ni fournisseur d'identité fait sortir l'oracle en échec — TM11 à TM13 devaient AVERTIR, règles neuves du 17/10/2026");
    if (!/TM11/.test(r.stdout) || !/railway up/.test(r.stdout) || !/CTL-D03-01/.test(r.stdout)) casse.push("TM11 à TM13 n'apparaissent pas au verdict JSON avec la commande et l'exigence d'audit — un avertissement que personne ne lit n'est pas un avertissement");
  }

  // ---- TM14 : LA REVUE DE CODE PROPOSÉE À L'ENTRÉE DE LA MEP (M-19, D-162 (a)) -------------------
  // Le cas fondateur du 03/11/2026 : aucune revue de la chaîne ne vise les failles, et un dossier muet
  // sur la revue ne se distingue pas d'une étape où personne ne l'a proposée.
  const REVUE_JOUEE = `${DOSSIER_OK}\n## Revue de code\n\nRevue jouée le 2026-12-01 : rapport \`output/p - Revue de code - 20261201a.md\`. `
    + "2 tranches, 268 000 jetons relevés. Constats : 9 (0 critique, 1 élevé, 3 moyens, 5 faibles).\n";
  attendre("tm14-muet", produit("tm14-muet", DOSSIER_OK, MARQUEUR), "TM14", "AVERTISSEMENT");
  attendre("tm14-jouee", produit("tm14-jouee", REVUE_JOUEE, MARQUEUR), "TM14", "PASS");
  attendre("tm14-refusee", produit("tm14-refusee", `${DOSSIER_OK}\n## Revue de code\n\nRevue proposée et refusée le 2026-12-01 : aucun code modifié depuis la dernière.\n`, MARQUEUR), "TM14", "PASS");
  attendre("tm14-sans-preuve", produit("tm14-sans-preuve", `${DOSSIER_OK}\n## Revue de code\n\nRevue jouée, rien de grave.\n`, MARQUEUR), "TM14", "AVERTISSEMENT");
  attendre("tm14-sans-etat", produit("tm14-sans-etat", `${DOSSIER_OK}\n## Revue de code\n\nÀ voir avec le porteur.\n\n## Suite\n\nRevue jouée ailleurs : rapport x.md, 3 constats, 10 jetons.\n`, MARQUEUR), "TM14", "AVERTISSEMENT");
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "tm14-muet")], { encoding: "utf8" });
    if (r.status !== 0) casse.push("un dossier muet sur la revue de code fait sortir l'oracle en échec — TM14 devait AVERTIR, forge-websec ne bloque jamais une MEP");
  }

  // ---- TM15 et TM16 : CE QUE LE DOSSIER A LU EN VRAI AVANT LE GO (M-21, M-22 ; D-178 (a), TF-2233, TF-2243) ----
  // Le cas fondateur de TM15 : l'étude du 06/11/2026 ne trouve aucun des 8 réglages dans ETAPE-MEP.md. Celui de
  // TM16 : un dossier de MEP citait deux commits servis, reconstitués, et un inventaire resté au texte du premier
  // commit pendant trois déploiements (mesures rapportées par forge-ops, TF-2201 et TF-2209).
  const TABLE = "| Réglage | Classement | État lu | Lu le | Attendu | Verdict ou décision |\n|---|---|---|---|---|---|\n";
  const REGLAGES = (lignes) => `${DOSSIER_OK}\n## Réglages de plateforme\n\nRegistre lu le 2026-11-06.\n\n${TABLE}${lignes}\n`;
  const L_DEFAUT = "| Supabase, TLS imposé | defaut | true | 2026-11-06 | true | conforme |\n";
  const L_DECISION = "| Supabase, double vérification des membres | decision | 2 membres sur 3 | 2026-11-06 | true pour chaque membre | écart accepté, D-123 du 2026-11-02 |\n";
  attendre("tm15-muet", produit("tm15-muet", DOSSIER_OK, MARQUEUR), "TM15", "AVERTISSEMENT");
  attendre("tm15-conforme", produit("tm15-conforme", REGLAGES(L_DEFAUT + L_DECISION), MARQUEUR), "TM15", "PASS");
  attendre("tm15-ecart-nu", produit("tm15-ecart-nu", REGLAGES(L_DEFAUT + L_DECISION.replace(", D-123 du 2026-11-02", "")), MARQUEUR), "TM15", "AVERTISSEMENT");
  attendre("tm15-non-lu", produit("tm15-non-lu", REGLAGES(L_DEFAUT.replace("| true | 2026-11-06 | true | conforme |", "| non lu | 2026-11-06 | true | non lu |")), MARQUEUR), "TM15", "AVERTISSEMENT");
  attendre("tm15-sans-date", produit("tm15-sans-date", REGLAGES(L_DEFAUT.replace("2026-11-06 ", "")), MARQUEUR), "TM15", "AVERTISSEMENT");
  attendre("tm15-sans-ligne", produit("tm15-sans-ligne", REGLAGES(""), MARQUEUR), "TM15", "AVERTISSEMENT");
  attendre("tm15-aucun", produit("tm15-aucun", `${DOSSIER_OK}\n## Réglages de plateforme\n\nAucun réglage de plateforme : produit local, aucun compte chez Supabase, GitHub ni Cloudflare.\n`, MARQUEUR), "TM15", "PASS");
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "tm15-ecart-nu")], { encoding: "utf8" });
    if (r.status !== 0) casse.push("un écart de réglage sans décision nommée fait sortir l'oracle en échec — TM15 devait AVERTIR, règle neuve du 06/11/2026");
  }
  const VERSION = (corps) => `${DOSSIER_OK}\n## Version servie et inventaire\n\n${corps}\n`;
  const LU = "Version servie : commit 6f78b88 lu le 2026-11-06 par `version-servie.mjs lire`.\n";
  attendre("tm16-muet", produit("tm16-muet", DOSSIER_OK, MARQUEUR), "TM16", "AVERTISSEMENT");
  attendre("tm16-ok", produit("tm16-ok", VERSION(`${LU}O-26 : PASS\nO-27 : PASS`), MARQUEUR), "TM16", "PASS");
  attendre("tm16-fail-o27", produit("tm16-fail-o27", VERSION(`${LU}O-26 : PASS\nO-27 : FAIL, composant présent non inventorié`), MARQUEUR), "TM16", "FAIL");
  attendre("tm16-fail-o26", produit("tm16-fail-o26", VERSION(`${LU}O-26 : FAIL, commit servi absent du dépôt\nO-27 : PASS`), MARQUEUR), "TM16", "FAIL");
  attendre("tm16-rejoue", produit("tm16-rejoue", VERSION(`${LU}O-26 : PASS\nO-27 : FAIL le 2026-11-05, composant non inventorié\nO-27 : PASS, rejoué le 2026-11-06 après mise à jour de l'inventaire`), MARQUEUR), "TM16", "PASS");
  attendre("tm16-sans-o27", produit("tm16-sans-o27", VERSION(`${LU}O-26 : PASS`), MARQUEUR), "TM16", "AVERTISSEMENT");
  attendre("tm16-skip-o27", produit("tm16-skip-o27", VERSION(`${LU}O-26 : PASS\nO-27 : SKIP, aucune sortie d'état donnée`), MARQUEUR), "TM16", "AVERTISSEMENT");
  attendre("tm16-sans-commit", produit("tm16-sans-commit", VERSION("O-26 : PASS\nO-27 : PASS"), MARQUEUR), "TM16", "AVERTISSEMENT");
  attendre("tm16-sans-objet", produit("tm16-sans-objet", VERSION("Sans objet : produit statique servi par fichiers, aucun point de santé."), MARQUEUR), "TM16", "PASS");
  {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "tm16-fail-o27")], { encoding: "utf8" });
    if (r.status !== 1) casse.push("un dossier qui porte un FAIL d'O-27 ne sort pas en 1 — la porte « prêt » devait le refuser (TF-2243)");
    const m = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "tm16-muet")], { encoding: "utf8" });
    if (m.status !== 0) casse.push("un dossier muet sur la version servie fait sortir l'oracle en échec — TM16 devait AVERTIR");
  }
  // Le remède que la doctrine prescrit se joue : les deux formes écrites à ETAPE-MEP.md § 3 quaterdecies passent leur oracle.
  {
    const etape = join(dirname(fileURLToPath(import.meta.url)), "..", "ETAPE-MEP.md");
    const doc = existsSync(etape) ? readFileSync(etape, "utf8").replace(/\r\n/g, "\n") : "";
    const forme = (titre) => { const m = new RegExp("```\\n(## " + titre + "\\n[\\s\\S]*?)```").exec(doc); return m ? m[1] : null; };
    const fReglages = forme("Réglages de plateforme"), fVersion = forme("Version servie et inventaire");
    if (!fReglages || !fVersion) casse.push("ETAPE-MEP.md ne porte pas la forme du dossier pour « Réglages de plateforme » et « Version servie et inventaire »");
    else {
      attendre("tm15-forme-doctrine", produit("tm15-forme-doctrine", `${DOSSIER_OK}\n${fReglages}`, MARQUEUR), "TM15", "PASS");
      attendre("tm16-forme-doctrine", produit("tm16-forme-doctrine", `${DOSSIER_OK}\n${fVersion}`, MARQUEUR), "TM16", "PASS");
    }
  }

  // ---- TM17 : LE VERDICT WEBSEC DU GATE, LU AVEC LE PARAMÈTRE QUI L'ARME (R-33 bis, TF-2506) ----------
  // Le cas fondateur du 13/11/2026 : `git grep` du pilot, aucun contrôle ne lit `websec_bloquant` ni le verdict du gate.
  // Même dossier, deux sens : paramètre à false, le manque se déclare (AVERTISSEMENT) ; à true, il bloque (FAIL).
  const PARAM = (v) => `# Paramétrage\n\n[gates]\nwebsec_bloquant = ${v}   # R-33 bis\n`;
  const WS_PASS = "\n## Verdict websec du gate\n\nOrigine déployée : oracle-exposition PASS le 2026-11-14. Dépendances : oracle-sca PASS le 2026-11-14.\n";
  const WS_FAIL = "\n## Verdict websec du gate\n\nOrigine déployée : oracle-exposition FAIL (EX-3, en-tête absent). Dépendances : oracle-sca PASS.\n";
  const WS_SKIP = "\n## Verdict websec du gate\n\nOrigine déployée : oracle-exposition PASS. Dépendances : oracle-sca SKIP, registre injoignable.\n";
  attendre("tm17-muet", produit("tm17-muet", DOSSIER_OK, MARQUEUR), "TM17", "AVERTISSEMENT");
  attendre("tm17-muet-false", produit("tm17-muet-false", DOSSIER_OK, MARQUEUR, PARAM("false")), "TM17", "AVERTISSEMENT");
  attendre("tm17-pass", produit("tm17-pass", DOSSIER_OK + WS_PASS, MARQUEUR, PARAM("false")), "TM17", "PASS");
  attendre("tm17-fail-non-bloquant", produit("tm17-fail-non-bloquant", DOSSIER_OK + WS_FAIL, MARQUEUR, PARAM("false")), "TM17", "AVERTISSEMENT");
  attendre("tm17-skip-non-bloquant", produit("tm17-skip-non-bloquant", DOSSIER_OK + WS_SKIP, MARQUEUR, PARAM("false")), "TM17", "AVERTISSEMENT");
  attendre("tm17-sans-objet", produit("tm17-sans-objet", `${DOSSIER_OK}\nWebsec : sans objet : produit sans surface web, aucun service servi.\n`, MARQUEUR, PARAM("true")), "TM17", "PASS");
  attendre("tm17-arme-muet", produit("tm17-arme-muet", DOSSIER_OK, MARQUEUR, PARAM("true")), "TM17", "FAIL");
  attendre("tm17-arme-fail", produit("tm17-arme-fail", DOSSIER_OK + WS_FAIL, MARQUEUR, PARAM("true")), "TM17", "FAIL");
  attendre("tm17-arme-skip", produit("tm17-arme-skip", DOSSIER_OK + WS_SKIP, MARQUEUR, PARAM("true")), "TM17", "FAIL");
  attendre("tm17-arme-pass", produit("tm17-arme-pass", DOSSIER_OK + WS_PASS, MARQUEUR, PARAM("true")), "TM17", "PASS");
  attendre("tm17-arme-rejoue", produit("tm17-arme-rejoue", DOSSIER_OK + WS_FAIL + "\nRejeu après correction : oracle-exposition PASS le 2026-11-14.\n", MARQUEUR, PARAM("true")), "TM17", "PASS");
  attendre("tm17-illisible", produit("tm17-illisible", DOSSIER_OK + WS_PASS, MARQUEUR, PARAM("oui")), "TM17", "AVERTISSEMENT");
  {
    const arme = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "tm17-arme-muet")], { encoding: "utf8" });
    if (arme.status !== 1) casse.push("un gate websec armé sans verdict au dossier ne sort pas en 1 — armer `websec_bloquant` doit bloquer (R-33 bis)");
    const desarme = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "tm17-muet-false")], { encoding: "utf8" });
    if (desarme.status !== 0) casse.push("le MÊME dossier muet, gate non armé, fait sortir l'oracle en échec — TM17 devait AVERTIR sans bloquer (R-33 bis)");
  }

  // Le VERDICT d'ensemble se lit aussi : un vert doit sortir en 0, un rouge en 1.
  const rv = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "vert")], { encoding: "utf8" });
  const rr = spawnSync(process.execPath, [fileURLToPath(import.meta.url), join(dir, "muet")], { encoding: "utf8" });
  if (rv.status !== 0) casse.push("le produit conforme ne sort pas en 0 — la règle crie sur un travail juste");
  if (rr.status !== 1) casse.push("le dossier MUET ne sort pas en 1 — le silence passe, et c'est le cas fondateur");

  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length
    ? `Self-test trace-mutation-MEP : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test trace-mutation-MEP : 83/83 PASS (campagne jouée, chiffrée et adossée au marqueur PASS ; "
      + "dossier MUET FAIL — le cas fondateur ; campagne jouée SANS preuve chiffrée FAIL ; campagne jouée "
      + "SANS marqueur FAIL — la règle qu'une phrase ne peut pas satisfaire ; marqueur SANS point de "
      + "référence FAIL ; campagne PROPOSÉE puis refusée PASS avec TM2 et TM3 sans objet ; produit sans "
      + "dossier de MEP SANS_OBJET et jamais FAIL ; codes de sortie 0 et 1 vérifiés ; TM4 sans journal "
      + "forge-ops SANS_OBJET ; TM4 verdict archivé FRAIS PASS ; TM4 cas rouge — verdict PÉRIMÉ — rendu "
      + "en AVERTISSEMENT ; TM4 un verdict périmé ne met PAS l'oracle en échec, code de sortie 0 vérifié ; "
      + "TM5 sans porte à base externe SANS_OBJET ; TM5 porte rejouée le jour du lancement PASS ; TM5 porte "
      + "datée de la VEILLE FAIL — le cas fondateur du 30/09/2026 ; TM5 bloque, code de sortie 1 vérifié ; "
      + "TM6 sans infrastructure Azure ni contrainte SANS_OBJET ; TM6 relevé daté et contrainte relue PASS ; TM6 "
      + "dossier conçu sans relevé FAIL — le cas fondateur du 21/09/2026 ; TM6 bloque, code de sortie 1 vérifié ; "
      + "TM7 sans identifiant Graph ni octroi SANS_OBJET ; TM7 identifiant officiel, échec visible et effet relu "
      + "PASS ; TM7 identifiant de mémoire, ajout masqué et « consentie » sans relecture FAIL — le cas fondateur "
      + "du 16/09/2026 ; TM7 bloque, code de sortie 1 vérifié ; TM8 sans objet SANS_OBJET ; TM8 objet lu en boucle "
      + "avant d'être complété PASS ; TM8 fiche écrite aussitôt créée et az webapp auth FAIL — le cas fondateur "
      + "du 01/10/2026 ; TM8 bloque, code de sortie 1 vérifié ; TM9 sans parcours tiers embarqué SANS_OBJET ; TM9 parcours "
      + "nommé, joué dans un navigateur sur l'état exécuté et étape déclarée PASS ; TM9 dossier muet sur un parcours de "
      + "paiement embarqué AVERTISSEMENT — le cas fondateur du 25/08/2026 ; TM9 ne bloque PAS, code de sortie 0 vérifié ; "
      + "TM10 sans plan voté SANS_OBJET ; TM10 paramètre lu à l'exécution, écart tranché et non-comparé publié PASS ; TM10 cas "
      + "rouge — plan voté sans contre-lecture des paramètres — FAIL, le cas fondateur du 29/09/2026 ; "
      + "TM10 bloque depuis TF-1688, code de sortie 1 vérifié ; TM11 à TM13 dossier qui prescrit `railway up` "
      + "et ne dit rien de la sauvegarde ni du fournisseur d'identité AVERTISSEMENT ×3 — le cas fondateur du "
      + "09/09/2026 (TF-1212) ; TM11 à TM13 chaîne nommée avec son exécution, « aucun » motivés PASS ×3 ; TM11 à "
      + "TM13 ne bloquent PAS, code de sortie 0 vérifié ; TM14 dossier muet sur la revue de code AVERTISSEMENT — le "
      + "cas fondateur du 03/11/2026 ; TM14 revue jouée avec rapport, constats et jetons PASS ; TM14 revue proposée "
      + "et refusée PASS ; TM14 revue jouée sans preuve AVERTISSEMENT ; TM14 section sans état, preuve placée hors "
      + "section AVERTISSEMENT ; TM14 ne bloque PAS, code de sortie 0 vérifié ; TM15 dossier muet sur les réglages de plateforme "
      + "AVERTISSEMENT — le cas fondateur du 06/11/2026 ; TM15 réglages lus, datés, écart accepté avec sa décision PASS ; TM15 écart "
      + "sans décision, réglage non lu, ligne sans date, section sans ligne AVERTISSEMENT ×4 ; TM15 « Aucun réglage de plateforme » "
      + "motivé PASS ; TM15 ne bloque PAS, code de sortie 0 vérifié ; TM16 dossier muet sur la version servie AVERTISSEMENT ; "
      + "TM16 commit lu, O-26 et O-27 PASS ; TM16 FAIL d'O-26 ou d'O-27 porté par le dossier FAIL, code de sortie 1 vérifié ; "
      + "TM16 O-27 rejoué PASS après un FAIL, le dernier verdict compte ; TM16 O-27 absent, SKIP, commit absent AVERTISSEMENT ×3 ; "
      + "TM16 « Sans objet » motivé PASS ; TM16 muet ne bloque PAS ; les deux formes écrites à ETAPE-MEP.md passent TM15 et TM16 ; "
      + "TM17 dossier muet sur le verdict websec AVERTISSEMENT, paramètre absent ou à false ; TM17 verdicts PASS PASS ; TM17 FAIL ou SKIP "
      + "websec, gate non armé, AVERTISSEMENT ; TM17 « sans objet » motivé PASS ; TM17 gate ARMÉ — dossier muet, FAIL, SKIP — FAIL, "
      + "le même dossier muet n'étant qu'un AVERTISSEMENT à false ; TM17 armé, verdict PASS ou rejoué après un FAIL, PASS ; TM17 valeur "
      + "illisible AVERTISSEMENT ; codes de sortie 1 (armé) et 0 (non armé) vérifiés)");
  return casse.length ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  if (arg === "--self-test") process.exit(selfTest());
  const racine = arg || process.cwd();
  const findings = juger(racine);
  const verdict = verdictDe(findings);
  process.stdout.write(JSON.stringify({
    oracle: "oracle-trace-mutation-mep",
    version: "1.0.0",
    regle: "D-34 (01/09/2026) — la campagne de mutation est à la demande, proposée au passage en "
      + "production : le dossier de MEP dit ce qu'il en est advenu (ETAPE-MEP.md §1 bis)",
    verdict,
    produit: racine,
    findings,
    non_juge: NON_JUGE,
  }, null, 1) + "\n");
  process.exit(verdict === "FAIL" ? 1 : 0);
}
