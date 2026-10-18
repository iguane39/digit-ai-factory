#!/usr/bin/env node
/**
 * lib-enumeration-liste.test.mjs — recette de E-11 sur le Markdown (TF-1847, 18/10/2026).
 *
 * Les deux sens de chaque motif. Rouge : « Comment faire : 1) … 2) … 3) » en ligne, dans une cellule de
 * tableau, dans une puce ; un guide dont l'étape enchaîne trois gestes dans un paragraphe, dont une
 * sous-puce en enchaîne trois, dont la clôture n'est pas la dernière sous-puce. Vert : la MÊME
 * information en liste ; deux éléments seulement ; la forme montrée entre guillemets français ou en code ;
 * une étape de deux gestes avec sa clôture dans le paragraphe (ancienne forme courte, tolérée) ; un
 * guide à une sous-puce par geste. Joué par `oracles\self-tests.mjs` (I2).
 */
import { enumerationsEnLigne, suiteNumerotee, gestesDe, etapesDeGuide, etapesQuiEnchainent, etapesSansClotureEnDerniere } from "./lib-enumeration-liste.mjs";

const casse = [];
let n = 0;
const veut = (cond, quoi) => { n++; if (!cond) casse.push(quoi); };

// ── A. L'énumération numérotée en ligne ────────────────────────────────────────────────────────
veut(suiteNumerotee("Comment faire : 1) ouvrir ; 2) coller ; 3) saisir") === 3, "A1 rouge : 1) 2) 3) n'est pas lue comme une suite de trois");
veut(suiteNumerotee("(1) un ; (2) deux ; (3) trois ; (4) quatre") === 4, "A2 rouge : (1) (2) (3) (4) n'est pas lue comme une suite de quatre");
veut(suiteNumerotee("1) un ; 2) deux") === 2, "A3 vert : deux éléments comptés trois");
veut(suiteNumerotee("2) deux ; 3) trois ; 4) quatre") === 0, "A4 vert : une suite qui ne commence pas à 1 est lue");
veut(suiteNumerotee("a) un ; b) deux ; c) trois") === 0, "A5 vert : une énumération en lettres est lue (les options (a), (b), (c) sont le format)");
veut(enumerationsEnLigne("| (a) Fournir | Le cas : 1) corriger ; 2) relancer ; 3) relire | Faible |").length === 1
  && enumerationsEnLigne("| (a) Fournir | Le cas : 1) corriger ; 2) relancer ; 3) relire | Faible |")[0].cellule === true,
  "A6 rouge : une énumération dans une cellule de tableau n'est pas accusée comme cellule");
veut(enumerationsEnLigne("- Plan : 1) corriger ; 2) relancer ; 3) relire.").length === 1, "A7 rouge : une énumération dans une puce n'est pas accusée");
veut(enumerationsEnLigne("Comment faire (b) :\n\n1. Ouvrir un terminal.\n2. Coller la commande.\n3. Saisir le code.\n").length === 0,
  "A8 vert : la liste numérotée, une ligne par geste, est accusée — le remède échoue");
veut(enumerationsEnLigne("L'ancien gabarit écrivait « 1) corriger ; 2) relancer ; 3) relire » sur une ligne.").length === 0,
  "A9 vert : la forme interdite montrée entre guillemets français est accusée");
veut(enumerationsEnLigne("La forme `1) a 2) b 3) c` est celle qu'on refuse.").length === 0, "A10 vert : la forme montrée en code est accusée");
veut(enumerationsEnLigne("```\nComment faire : 1) a ; 2) b ; 3) c\n```\n").length === 0, "A11 vert : un bloc de code est jugé");
veut(enumerationsEnLigne("---\nnote: 1) a 2) b 3) c\n---\ncorps\n").length === 0, "A12 vert : le front matter est jugé");
veut(enumerationsEnLigne("Ligne 1\nLigne 2\nCe 14 mars (2) fois, la version 1) est restée.").length === 0, "A13 vert : des chiffres isolés sont lus comme une énumération");
veut(enumerationsEnLigne("Voir https://exemple.org/a?x=1) 2) 3) puis rien.").length === 0, "A14 vert : une adresse est lue");

// ── B. Les étapes de guide ─────────────────────────────────────────────────────────────────────
veut(gestesDe("Ouvrez Outils, puis Actions groupées, puis Importations. Résultat attendu : la liste.") === 3,
  `B1 rouge : « Ouvrez A, puis B, puis C » ne compte pas trois gestes (${gestesDe("Ouvrez Outils, puis Actions groupées, puis Importations. Résultat attendu : la liste.")})`);
veut(gestesDe("Ouvrez la console, choisissez le projet, cliquez sur « Activer ». Résultat attendu : l'API est active.") === 3, "B2 rouge : trois verbes d'action ne comptent pas trois gestes");
veut(gestesDe("Déposez le fichier et cliquez sur « Aperçu ». Résultat attendu : zéro erreur, puis la liste, puis le total.") === 2,
  "B3 vert : une étape de deux gestes compte plus, ou la clôture est comptée");
veut(gestesDe("Cliquez sur « Créer, puis Ouvrir, puis Coller ».") === 1, "B4 vert : les verbes entre guillemets français sont comptés");
veut(gestesDe("Ouvrez A, puis cliquez sur B.") === 2, "B5 vert : « Ouvrez A, puis cliquez sur B » compte trois gestes au lieu de deux");

const GUIDE_PARAGRAPHE = [
  "## Guide — connecter le compte", "",
  "Source : `docs.exemple.org`, lue le 17/10/2026.", "",
  "1. Ouvrez la console, choisissez le projet, cliquez sur « Activer ». Résultat attendu : l'API est active.",
  "2. Cliquez sur Créer. Résultat attendu : un identifiant apparaît.", "",
  "## 0. Synthèse d'ouverture", "",
].join("\n");
const GUIDE_PUCES = [
  "## Guide — connecter le compte", "",
  "Source : `docs.exemple.org`, lue le 17/10/2026.", "",
  "1. Activer l'API.",
  "   - Ouvrez la console.",
  "   - Choisissez le projet.",
  "   - Cliquez sur « Activer ».",
  "   - Résultat attendu : l'API est active.",
  "2. Créer l'identifiant.",
  "   - Cliquez sur Créer.",
  "   - Résultat attendu : un identifiant apparaît.", "",
  "## 0. Synthèse d'ouverture", "",
].join("\n");
veut(etapesDeGuide(GUIDE_PUCES).length === 2 && etapesDeGuide(GUIDE_PUCES)[0].sousPuces.length === 4, "B6 : les étapes et sous-puces du guide ne sont pas relevées");
veut(etapesDeGuide("# Titre\n\n1. Ouvrez, puis cliquez, puis saisissez.\n").length === 0, "B7 : une liste numérotée hors section « Guide » est lue comme un guide");
veut(etapesQuiEnchainent(GUIDE_PARAGRAPHE).length === 1 && etapesQuiEnchainent(GUIDE_PARAGRAPHE)[0].forme === "etape" && etapesQuiEnchainent(GUIDE_PARAGRAPHE)[0].gestes === 3,
  "B8 rouge : l'étape de trois gestes dans un paragraphe n'est pas accusée une fois avec ses trois gestes");
veut(etapesQuiEnchainent(GUIDE_PUCES).length === 0, "B9 vert : le guide à une sous-puce par geste est accusé — le remède échoue");
veut(etapesSansClotureEnDerniere(GUIDE_PUCES).length === 0, "B10 vert : la clôture en dernière sous-puce est accusée");
veut(etapesQuiEnchainent(GUIDE_PUCES.replace("   - Choisissez le projet.", "   - Choisissez le projet, puis ouvrez Réglages, puis cliquez sur « Activer ».")).length === 1,
  "B11 rouge : une sous-puce de trois gestes n'est pas accusée");
const cloture_tete = GUIDE_PUCES.replace("   - Cliquez sur « Activer ».\n   - Résultat attendu : l'API est active.", "   - Résultat attendu : l'API est active.\n   - Cliquez sur « Activer ».");
veut(etapesSansClotureEnDerniere(cloture_tete).length === 1, "B12 rouge : une clôture placée avant le dernier geste n'est pas accusée");
veut(etapesQuiEnchainent("## Guide — x\n\n1. Déposez le fichier et cliquez sur Aperçu. Résultat attendu : zéro erreur.\n2. Cliquez sur Appliquer. Résultat attendu : terminé.\n").length === 0,
  "B13 vert : l'ancienne forme courte (deux gestes et la clôture dans le paragraphe) est accusée");
veut(etapesDeGuide("## Guide — x\n\n```\n1. Ouvrez, puis cliquez, puis saisissez.\n```\n").length === 0, "B14 vert : un bloc de code du guide est lu comme une étape");
const GUIDE_IMBRIQUE = GUIDE_PUCES.replace("   - Résultat attendu : l'API est active.",
  "   - Résultat attendu : l'API est active.\n     - elle figure dans la liste des API activées ;\n     - son quota du jour est affiché.");
veut(etapesSansClotureEnDerniere(GUIDE_IMBRIQUE).length === 0 && etapesDeGuide(GUIDE_IMBRIQUE)[0].sousPuces.length === 4,
  "B15 vert : une puce imbriquée sous « Résultat attendu » est lue comme une sous-puce de plus, et la clôture est accusée d être mal placée");

if (casse.length) {
  console.log(`Self-test lib-enumeration-liste : ${n - casse.length}/${n} PASS · CASSE : ${casse.join(" · ")}`);
  process.exit(1);
}
console.log(`Self-test lib-enumeration-liste : ${n}/${n} PASS (E-11 sur le Markdown : l'énumération « 1) … 2) … 3) » en ligne, en cellule et en puce est accusée, `
  + "la même information en liste, deux éléments, une citation entre guillemets français, du code, un front matter et une adresse ne le sont pas ; "
  + "le guide dont l'étape enchaîne trois gestes, dont une sous-puce en enchaîne trois, dont la clôture n'est pas la dernière sous-puce est accusé, "
  + "le guide à une sous-puce par geste et l'ancienne forme courte ne le sont pas)");
