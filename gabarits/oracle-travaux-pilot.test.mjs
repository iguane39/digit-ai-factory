#!/usr/bin/env node
/**
 * oracle-travaux-pilot.test.mjs — recette du juge de forme des lots de travaux (TF-0627).
 *
 * Les DEUX SENS sur chacune des cinq règles : un lot complet passe, et chaque règle a une fixture
 * ROUGE qui la fait échouer seule. Une règle dont la branche rouge n'est jamais jouée est une
 * règle morte qui se croit vivante — et ce module naît le jour même où le canal inverse a montré
 * ce que coûte une forme prescrite en prose et jugée ailleurs.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { verifier, VERSION } from "./oracle-travaux-pilot.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const echoue = (r, regle) => r.constats.some((c) => c.regle === regle && c.statut === "FAIL");

const ELEMENT = (id = "TF-0626") => `### ${id} — artefact absent · gravité majeur

- **Le fait**, mesuré le 25/08/2026 : le fichier n'existe pas.
- **Pourquoi cela vous concerne** : rien ne juge vos comptes rendus.
- **Ce qui est demandé** : recopier le fichier.
- **Effort estimé** : simple × court
- **Comment vous saurez que c'est fait** : le relevé ne liste plus cet artefact.
- **Si ce n'est pas fait** : l'écart reste.`;

const LOT = ({ elements = [ELEMENT()], dejaFait = "- le résolveur a été corrigé, recette 11/11",
  borne = "- rien sur le code applicatif", ordre = "1. le premier — parce que son absence agit à chaque travail rendu",
  sections = {} } = {}) => {
  const s = { travaux: true, dejaFait: true, borne: true, ordre: true, ...sections };
  return [
    "# Travaux confiés par le pilot — produit-recette — 20260825a",
    "", "- **Statut** : a_traiter", "",
    s.travaux ? "## Travaux confiés" : "## Autre titre",
    "", elements.join("\n\n"), "",
    s.dejaFait ? "## Ce que le pilot a déjà fait de son côté" : "## Rien de ce genre",
    "", dejaFait, "",
    s.borne ? "## Ce que le pilot NE demande PAS" : "## Autre chose",
    "", borne, "",
    s.ordre ? "## Ordre recommandé" : "## Fin",
    "", ordre, "",
  ].join("\n");
};

// ── le sens VERT : un lot complet passe les cinq règles ─────────────────────
check("un lot complet PASSE — sans ce cas, une règle trop dure ne se verrait pas", () => {
  const r = verifier(LOT());
  att(r.verdict === "PASS", `verdict ${r.verdict} : ${r.constats.filter((c) => c.statut === "FAIL").map((c) => c.regle).join(", ")}`);
  att(r.version === VERSION, "la version n'est pas rendue");
});

// ── T1 : le moyen de vérification ──────────────────────────────────────────
check("T1 rouge — un élément sans moyen de vérification est REFUSÉ", () => {
  const nu = ELEMENT().split("\n").filter((l) => !/Comment vous saurez/.test(l)).join("\n");
  const r = verifier(LOT({ elements: [nu] }));
  att(echoue(r, "T1"), "T1 n'a pas vu l'absence de vérification");
  const c = r.constats.find((x) => x.regle === "T1");
  att(/intention/.test(c.message), "le motif ne dit pas pourquoi cela compte");
  att(c.remede, "le refus ne dit pas le geste qui répare");
});

check("T1 — la forme alternative « moyen de vérification » est admise aussi", () => {
  const autre = ELEMENT().replace("**Comment vous saurez que c'est fait**", "**Moyen de vérification**");
  att(!echoue(verifier(LOT({ elements: [autre] })), "T1"), "une formulation légitime a été refusée");
});

// ── T2 : le rattachement au registre ───────────────────────────────────────
check("T2 rouge — la section « Travaux confiés » absente est REFUSÉE", () => {
  att(echoue(verifier(LOT({ sections: { travaux: false } })), "T2"), "T2 n'a pas vu la section absente");
});

check("T2 rouge — une section présente mais SANS élément est refusée", () => {
  att(echoue(verifier(LOT({ elements: ["du texte, mais aucun bloc `### TF-xxxx`"] })), "T2"),
    "un lot vide qui ne se déclare pas vide a passé");
});

check("T2 vert — un lot SANS travail est licite s'il le DÉCLARE", () => {
  const r = verifier(LOT({ elements: ["aucun travail confié dans ce lot"] }));
  att(!echoue(r, "T2"), "une déclaration explicite de vacuité a été refusée");
  att(r.verdict === "PASS", `verdict ${r.verdict} sur un lot vide déclaré`);
});

// ── T3 : ce que le pilot a déjà fait ───────────────────────────────────────
check("T3 rouge — la section absente est REFUSÉE, avec son motif", () => {
  const r = verifier(LOT({ sections: { dejaFait: false } }));
  att(echoue(r, "T3"), "T3 n'a pas vu la section absente");
  att(/RESTE|ENTIER/.test(r.constats.find((x) => x.regle === "T3").message),
    "le motif ne dit pas ce que le produit ne peut pas savoir sans cette section");
});

check("T3 rouge — la section PRÉSENTE mais VIDE se lit comme un oubli", () => {
  att(echoue(verifier(LOT({ dejaFait: "" })), "T3"), "une section vide a passé");
});

check("T3 vert — la déclaration explicite qu'il n'y a rien est acceptée", () => {
  att(!echoue(verifier(LOT({ dejaFait: "rien n'a été corrigé au pilot pour ce lot" })), "T3"),
    "une déclaration d'absence légitime a été refusée");
});

// ── T4 : la borne du lot ───────────────────────────────────────────────────
check("T4 rouge — un lot sans borne déclarée est REFUSÉ", () => {
  const r = verifier(LOT({ sections: { borne: false } }));
  att(echoue(r, "T4"), "T4 n'a pas vu la borne absente");
  att(/souhaits/.test(r.constats.find((x) => x.regle === "T4").message),
    "le motif ne dit pas ce qui distingue un lot borné d'une liste de souhaits");
});

check("T4 vert — « rien n'est écarté de ce lot » est une borne valide", () => {
  att(!echoue(verifier(LOT({ borne: "rien n'est écarté de ce lot" })), "T4"),
    "une borne déclarée vide a été refusée");
});

// ── T5 : l'ordre justifié ──────────────────────────────────────────────────
check("T5 rouge — plusieurs travaux et un ordre SANS motif est refusé", () => {
  const r = verifier(LOT({ elements: [ELEMENT("TF-0626"), ELEMENT("TF-0627")], ordre: "1. le premier\n2. le second" }));
  att(echoue(r, "T5"), "T5 n'a pas vu l'ordre non justifié");
  att(/rangement/.test(r.constats.find((x) => x.regle === "T5").message),
    "le motif ne dit pas pourquoi un ordre nu ne sert à rien");
});

check("T5 rouge — plusieurs travaux et AUCUNE section d'ordre est refusé", () => {
  att(echoue(verifier(LOT({ elements: [ELEMENT("TF-0626"), ELEMENT("TF-0627")], sections: { ordre: false } })), "T5"),
    "un lot multiple sans ordre a passé");
});

check("T5 vert — un SEUL travail n'exige aucun ordre : l'exiger serait du bruit", () => {
  att(!echoue(verifier(LOT({ elements: [ELEMENT()], sections: { ordre: false } })), "T5"),
    "un lot à un seul élément a été refusé pour un ordre qu'il n'a pas à porter");
});

// ── T6 : tout module producteur nommé a été lu (TF-0819) ───────────────────
const ELEMENT_PRODUCTEUR = `### TF-0814 — un champ d'écart · gravité majeur

- **Le fait**, mesuré le 05/09/2026 : la section 7 est de la prose.
- **Pourquoi cela vous concerne** : l'oubli est indiscernable de la décision.
- **Ce qui est demandé** : un champ racine transcrit de la section 7 par \`redige-les-exigences\`, porté dans la vue par \`derive-les-vues\`.
- **Effort estimé** : simple × court
- **Comment vous saurez que c'est fait** : le self-test compte les états.
- **Si ce n'est pas fait** : trois lois restent injugeables.`;

check("T6 rouge — un producteur nommé (« transcrit par `x` ») sans lecture déclarée est REFUSÉ, les deux modules nommés", () => {
  const r = verifier(LOT({ elements: [ELEMENT_PRODUCTEUR] }));
  att(echoue(r, "T6"), "T6 n'a pas vu le producteur non lu");
  const c = r.constats.find((x) => x.regle === "T6");
  att(/redige-les-exigences/.test(c.message) && /derive-les-vues/.test(c.message), "les deux modules nommés ne sont pas cités");
  att(/^2 module/.test(c.message), "le compte des modules non lus n'est pas 2 : " + c.message.slice(0, 40));
});

check("T6 rouge — la lecture déclarée d'UN module ne couvre pas l'autre", () => {
  const r = verifier(LOT({ elements: [ELEMENT_PRODUCTEUR],
    dejaFait: "- **Module producteur lu** : `redige-les-exigences` produit EXIGENCES.json (source : `skills/redige-les-exigences/SKILL.md`)" }));
  att(echoue(r, "T6"), "T6 a accepté un module non lu parce qu'un autre l'était");
  att(/derive-les-vues/.test(r.constats.find((x) => x.regle === "T6").message) && !/redige-les-exigences/.test(r.constats.find((x) => x.regle === "T6").message),
    "le constat ne nomme pas exactement le module qui manque");
});

check("T6 vert — chaque module nommé a sa ligne « Module producteur lu » avec sa source", () => {
  const r = verifier(LOT({ elements: [ELEMENT_PRODUCTEUR],
    dejaFait: "- **Module producteur lu** : `redige-les-exigences` produit EXIGENCES.json (source : `skills/redige-les-exigences/SKILL.md`)\n"
      + "- **Module producteur lu** : `derive-les-vues` produit CADRAGE-DESIGN.md (source : `skills/derive-les-vues/references/vues.md`)" }));
  att(!echoue(r, "T6"), "un lot dont les deux producteurs sont lus a été refusé");
  att(/2 module/.test(r.constats.find((x) => x.regle === "T6").message), "le constat vert ne compte pas les deux modules lus");
});

check("T6 vert — un lot qui ne nomme aucun producteur n'a rien à lire", () => {
  const r = verifier(LOT());
  att(!echoue(r, "T6"), "un lot sans producteur nommé a été refusé");
  att(/rien à lire/.test(r.constats.find((x) => x.regle === "T6").message), "le constat ne dit pas qu'il n'y avait rien à lire");
});

console.log(`\noracle-travaux-pilot (TF-0627) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
