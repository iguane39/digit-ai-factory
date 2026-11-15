#!/usr/bin/env node
/**
 * lib-calendrier.test.mjs — la recette à double sens du calendrier des séances d'un produit (TF-2589, 15/11/2026).
 * La bibliothèque n'avait aucun cas propre : `hook-ecriture --self-test` n'en jouait qu'un coin (date hors forme, séance à J-3).
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import {
  FENETRE_JOURS, dateValide, jourLocal, ecartJours, frontmatter, defautsEntete, cellules, tableau,
  lireCalendrier, seancesProches, lignesSeances, instancierNaissance,
} from "./lib-calendrier.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const ENTETE = "---\ndate: 2026-11-10\nsource: convention du 2026-11-09\nverifie_le: 2026-11-10\n---\n\n# Calendrier\n\n";
const COLONNES = "| Date | Séance | Pour qui | Documents | Revue de préparation | Source |\n| --- | --- | --- | --- | --- | --- |\n";
const calendrier = (...lignes) => ENTETE + COLONNES + lignes.join("\n") + "\n";
const FORMATION = "| 2026-11-13 | Formation de prise en main | Client-A | `output/formation/Kit.md` | à faire | convention |";

// --- dateValide, jourLocal, ecartJours
check("dateValide — vert : une date qui existe ; rouge : un jour qui n'existe pas, un format français, le vide", () => {
  att(dateValide("2026-11-15") && dateValide("2028-02-29"), "date existante refusée");
  att(!dateValide("2026-02-30") && !dateValide("13/11/2026") && !dateValide("") && !dateValide(undefined), "date fausse acceptée");
});
check("jourLocal — le jour LOCAL, avec ses zéros", () => att(jourLocal(new Date(2026, 10, 5, 23, 59)) === "2026-11-05", jourLocal(new Date(2026, 10, 5, 23, 59))));
check("ecartJours — positif vers l'avenir, négatif vers le passé, nul le même jour, juste à travers un changement d'heure", () => {
  att(ecartJours("2026-11-10", "2026-11-13") === 3 && ecartJours("2026-11-13", "2026-11-10") === -3 && ecartJours("2026-11-10", "2026-11-10") === 0, "écart faux");
  att(ecartJours("2026-10-24", "2026-10-26") === 2, "changement d'heure d'octobre : " + ecartJours("2026-10-24", "2026-10-26"));
});

// --- frontmatter, defautsEntete, cellules, tableau
check("frontmatter — vert : les clés lues ; rouge : pas d'ouverture, ou pas de clôture", () => {
  att(frontmatter(ENTETE.split("\n")).cles.source === "convention du 2026-11-09", "clé source");
  att(frontmatter(["# titre", "---"]) === null && frontmatter(["---", "date: 2026-11-10"]) === null, "frontmatter incomplet accepté");
});
check("defautsEntete — vert : en-tête complet ; rouge : absent, date hors forme, source non remplie", () => {
  att(defautsEntete(ENTETE.split("\n"), "x").length === 0, "en-tête complet accusé");
  att(defautsEntete(["# sans en-tête"], "x")[0].message.includes("en-tête daté et sourcé absent"), "en-tête absent non dit");
  const mauvaise = defautsEntete("---\ndate: 10/11/2026\nsource: <à remplir>\nverifie_le: 2026-11-10\n---".split("\n"), "x").map((d) => d.message).join(" | ");
  att(/« date: 10\/11\/2026 » n'est pas une date/.test(mauvaise) && /« source » absente ou non remplie/.test(mauvaise), mauvaise);
});
check("cellules — la barre échappée reste dans sa cellule ; une ligne hors tableau rend null", () => {
  att(JSON.stringify(cellules("| a \\| b | c |")) === JSON.stringify(["a | b", "c"]), JSON.stringify(cellules("| a \\| b | c |")));
  att(cellules("pas un tableau") === null, "ligne hors tableau lue");
});
check("tableau — vert : l'en-tête demandé et ses rangs ; rouge : colonne requise absente", () => {
  const lignes = calendrier(FORMATION).split("\n");
  const t = tableau(lignes, [/^date/, /^seance/]);
  att(t && t.rangs.length === 1 && t.rangs[0].cells[1] === "Formation de prise en main", "tableau non lu");
  att(tableau(lignes, [/^date/, /^colonne-qui-n-existe-pas/]) === null, "colonne absente acceptée");
});

// --- lireCalendrier
check("lireCalendrier — vert : une séance bien formée est lue, avec ses documents et sa revue, sans défaut", () => {
  const c = lireCalendrier(calendrier(FORMATION));
  att(c.defauts.length === 0 && c.seances.length === 1, JSON.stringify(c.defauts));
  const s = c.seances[0];
  att(s.date === "2026-11-13" && s.pourQui === "Client-A" && s.documents[0] === "output/formation/Kit.md" && s.revue.etat === "a_faire", JSON.stringify(s));
});
check("lireCalendrier — vert : « faite le AAAA-MM-JJ » est une revue faite ; une heure après la date est admise ; la ligne « (aucune) » n'est pas une séance", () => {
  const c = lireCalendrier(calendrier(
    "| 2026-11-13 à 14h00 | Séance A | — | — | faite le 2026-11-12 | convention |",
    "| *(aucune)* | — | — | — | — | — |"));
  att(c.defauts.length === 0 && c.seances.length === 1, JSON.stringify(c));
  att(c.seances[0].revue.etat === "faite" && c.seances[0].revue.le === "2026-11-12" && c.seances[0].pourQui === null, JSON.stringify(c.seances[0]));
});
check("lireCalendrier — rouge : une date hors forme est un défaut NUMÉROTÉ, et la séance n'est pas lue", () => {
  const c = lireCalendrier(calendrier("| 13/11/2026 | Formation | Client-A | — | à faire | convention |"));
  att(c.seances.length === 0 && c.defauts.length === 1 && /date « 13\/11\/2026 » hors du format/.test(c.defauts[0].message) && c.defauts[0].ligne > 1, JSON.stringify(c));
});
check("lireCalendrier — rouge : séance non nommée, source absente, revue mal écrite : chacune nommée", () => {
  const messages = (l) => lireCalendrier(calendrier(l)).defauts.map((d) => d.message).join(" | ");
  att(/séance non nommée/.test(messages("| 2026-11-13 | — | Client-A | — | à faire | convention |")), "séance non nommée");
  att(/source de la date absente/.test(messages("| 2026-11-13 | Formation | Client-A | — | à faire | — |")), "source absente");
  att(/revue de préparation « bientôt »/.test(messages("| 2026-11-13 | Formation | Client-A | — | bientôt | convention |")), "revue mal écrite");
});
check("lireCalendrier — rouge : pas de tableau des séances, ou pas d'en-tête daté", () => {
  const sansTableau = lireCalendrier(ENTETE + "Aucun tableau ici.\n");
  att(sansTableau.seances.length === 0 && sansTableau.defauts.some((d) => /aucun tableau des séances/.test(d.message)), JSON.stringify(sansTableau));
  const sansEntete = lireCalendrier(COLONNES + FORMATION + "\n");
  att(sansEntete.defauts.some((d) => /en-tête daté et sourcé absent/.test(d.message)), JSON.stringify(sansEntete.defauts));
});

// --- seancesProches
check("seancesProches — vert : J-0 et J-5 y sont, triées par date ; rouge : une séance passée et une à J-6 n'y sont pas", () => {
  const cal = lireCalendrier(calendrier(
    "| 2026-11-15 | Cinq jours | — | — | à faire | convention |",
    "| 2026-11-10 | Le jour même | — | — | à faire | convention |",
    "| 2026-11-09 | Passée | — | — | à faire | convention |",
    "| 2026-11-16 | Trop loin | — | — | à faire | convention |"));
  const p = seancesProches(cal, "2026-11-10");
  att(FENETRE_JOURS === 5 && p.map((s) => s.seance).join(",") === "Le jour même,Cinq jours" && p[0].j === 0 && p[1].j === 5, JSON.stringify(p.map((s) => [s.seance, s.j])));
});

// --- lignesSeances
check("lignesSeances — vert : une séance à J-3 dont la revue est à faire est nommée avec sa commande et la liste de ce que la revue couvre", () => {
  const l = lignesSeances(lireCalendrier(calendrier(FORMATION)), "2026-11-10", { oracleEngagements: "C:\\pilot\\oracles\\oracle-engagements.mjs" });
  const texte = l.join("\n");
  att(/Séance du 2026-11-13, dans 3 jours \(J-3\) : Formation de prise en main — pour Client-A — revue de préparation À FAIRE/.test(texte), texte.slice(0, 400));
  att(texte.includes('node "C:/pilot/oracles/oracle-engagements.mjs" . --documents "output/formation/Kit.md"') && /La revue couvre : \(1\)/.test(texte), texte.slice(0, 600));
});
check("lignesSeances — une revue faite se dit faite, sans la commande à rejouer", () => {
  const l = lignesSeances(lireCalendrier(calendrier("| 2026-11-13 | Formation | — | — | faite le 2026-11-12 | convention |")), "2026-11-10").join("\n");
  att(/revue de préparation faite le 2026-11-12/.test(l) && !/La revue couvre/.test(l), l);
});
check("lignesSeances — rouge : un calendrier mal formé est dit avec ses lignes ; silencieux quand il n'y a rien à dire", () => {
  const mauvais = lignesSeances(lireCalendrier(calendrier("| 13/11/2026 | Formation | — | — | à faire | convention |")), "2026-11-10").join("\n");
  att(/Calendrier des séances mal formé/.test(mauvais) && /ligne \d+ : date « 13\/11\/2026 »/.test(mauvais), mauvais);
  att(lignesSeances(lireCalendrier(calendrier(FORMATION)), "2026-11-01").length === 0, "séance à J-12 annoncée");
  att(lignesSeances(lireCalendrier(calendrier(FORMATION)), "2026-11-14").length === 0, "séance passée annoncée");
});

// --- instancierNaissance
check("instancierNaissance — les dates AAAA-MM-JJ de l'en-tête deviennent le jour de création, le corps reste, les fins de ligne restent", () => {
  const modele = "---\r\ndate: AAAA-MM-JJ\r\nsource: x\r\nverifie_le: AAAA-MM-JJ\r\n---\r\n\r\nCorps AAAA-MM-JJ gardé.\r\n";
  const n = instancierNaissance(modele, "2026-11-15");
  att(n.includes("date: 2026-11-15") && n.includes("verifie_le: 2026-11-15"), n);
  att(n.includes("Corps AAAA-MM-JJ gardé.") && n.includes("\r\n") && !/[^\r]\n/.test(n), JSON.stringify(n));
  att(instancierNaissance("sans en-tête AAAA-MM-JJ", "2026-11-15") === "sans en-tête AAAA-MM-JJ", "texte sans en-tête modifié");
});

console.log(`\nlib-calendrier (TF-2589) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
