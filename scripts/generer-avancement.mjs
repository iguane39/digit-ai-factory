#!/usr/bin/env node
/**
 * generer-avancement.mjs — le rapport d'avancement, DÉRIVÉ du registre (TF-0324, 23/08/2026).
 *
 * POURQUOI CE SCRIPT EXISTE PLUTÔT QU'UN GABARIT DE PLUS. La forge couvrait le build et le
 * pilotage, pas la CADENCE — l'artefact qui revient chaque semaine. Cinq artefacts étaient sans
 * équivalent : revue RAID, rapport d'avancement, compte rendu, retour d'expérience, suivi des
 * bénéfices. Quatre demandent un jugement et vivent en gabarits (`gabarits\cadence\`). Le
 * cinquième porte des CHIFFRES — et c'est précisément celui qu'il ne faut pas écrire à la main.
 *
 * LE CRITÈRE D'ACCEPTATION QUE CE SCRIPT TIENT PAR CONSTRUCTION : « le rapport d'avancement passe
 * le contrôle des affirmations chiffrées sans aucun chiffre non sourcé ». Ici, aucun chiffre n'est
 * saisi : tous sont comptés dans `todo\TODO.jsonl` au moment de la génération. Il n'y a donc rien
 * à sourcer après coup, et rien qui puisse dériver — la seule façon d'être sûr qu'un nombre est
 * juste est de ne jamais l'écrire.
 *
 * ET LE SECOND CRITÈRE : « preuve qu'aucun second porteur d'état n'a été créé ». Le fichier produit
 * est une VUE, au même titre que `TODO.md` : il se régénère, il ne s'édite pas, et il porte le
 * sceau de la source dont il est dérivé.
 *
 * Usage : node scripts/generer-avancement.mjs [--sortie <fichier.md>] [--depuis AAAA-MM-JJ]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const opt = (n, d = null) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const sortie = opt("--sortie", join(PILOT, "todo", "AVANCEMENT.md"));
const depuis = opt("--depuis");

const brut = readFileSync(join(PILOT, "todo", "TODO.jsonl"), "utf8");
const evenements = brut.trim().split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l));
// Le sceau de la SOURCE, normalisé LF : la convention d'empreinte du parc
// (`references\EMPREINTES.md`) — une vue qui ne scelle pas sa source ne se sait pas périmée.
const sceau = createHash("sha256").update(brut.split("\r\n").join("\n")).digest("hex").slice(0, 12);

const items = new Map();
for (const e of evenements) {
  if (e.ev === "creation") items.set(e.id, { ...e });
  else if (items.has(e.id)) Object.assign(items.get(e.id), e);
}
const tous = [...items.values()];
const dansLaFenetre = (i) => !depuis || (i.date_correction || i.date_decision || i.date_demande || "") >= depuis;

const OUVERTS = new Set(["candidat", "decide", "en_cours"]);
const ouverts = tous.filter((i) => OUVERTS.has(i.statut));
const corriges = tous.filter((i) => i.statut === "corrige" && dansLaFenetre(i));
const ecartes = tous.filter((i) => i.statut === "ecarte" && dansLaFenetre(i));
const bloques = ouverts.filter((i) => /acces|presence|decision|depense|irreversible/.test(
  String(i.motif_ecart || i.reste_a_faire || "")) && i.statut === "candidat");

/** Regroupe par forge cible, en préférant la cible RÉELLE à la cible initiale quand elle existe. */
const parForge = (liste) => {
  const m = new Map();
  for (const i of liste) {
    for (const f of (i.forges_cibles_reelles || i.forges_cibles_initiales || ["non attribué"])) {
      const l = m.get(f) || [];
      l.push(i);
      m.set(f, l);
    }
  }
  return [...m].sort((a, b) => b[1].length - a[1].length);
};

const echapper = (t) => String(t ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const ligne = (i) => `| ${i.id} | ${echapper((i.titre || "").slice(0, 110))} | ${i.statut} | ` +
  `${(i.forges_cibles_reelles || i.forges_cibles_initiales || ["—"]).join(", ")} | ` +
  `${i.score?.valeur ?? "—"} |`;

const md = [];
md.push("---");
md.push("role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main");
md.push(`sources_de_verite: [todo/TODO.jsonl (sceau ${sceau})]`);
md.push("verifie_le: " + new Date().toISOString().slice(0, 10));
md.push("---");
md.push("");
md.push("# Rapport d'avancement — TODO-FORGE");
md.push("");
md.push(`> **Vue générée** par \`node scripts\\generer-avancement.mjs\`, jamais éditée à la main.`);
md.push(`> Source : \`todo\\TODO.jsonl\`, sceau \`${sceau}\`. Aucun chiffre de ce document n'est`);
md.push("> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule");
md.push("> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.");
if (depuis) md.push(`> Fenêtre : ce qui a bougé depuis le **${depuis}**.`);
md.push("");
md.push("## Où en est-on");
md.push("");
md.push("Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur");
md.push("gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que");
md.push("les corrections donnerait l'illusion d'un progrès net.");
md.push("");
md.push("| Grandeur | Compte | Ce que ça dit |");
md.push("|---|---|---|");
md.push(`| Ouverts | ${ouverts.length} | candidats, décidés ou en cours — le reste à faire réel |`);
md.push(`| Clos sur gains constatés | ${corriges.length} | corrigés avec leur mesure avant/après |`);
md.push(`| Écartés avec motif | ${ecartes.length} | décidés non faits, motif écrit — jamais un silence |`);
md.push(`| Total suivi | ${tous.length} | tout ce que le registre a jamais porté |`);
md.push("");
md.push("## Ce qui reste ouvert, par forge");
md.push("");
md.push("La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se");
md.push("livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la");
md.push("priorité vit dans la colonne de score.");
md.push("");
for (const [forge, liste] of parForge(ouverts)) {
  md.push(`### ${forge} — ${liste.length} item(s)`);
  md.push("");
  // M7 du socle : un chapitre de donnees dit ce que le lecteur va y apprendre. Une vue generee
  // n'y echappe pas — le controle de Markdown du socle a refuse la premiere version.
  md.push(`Les items ouverts ciblant ${forge}, du score le plus fort au plus faible. Le score est`);
  md.push("celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.");
  md.push("");
  md.push("| Id | Titre | Statut | Forge(s) | Score |");
  md.push("|---|---|---|---|---|");
  for (const i of liste.sort((a, b) => (b.score?.valeur || 0) - (a.score?.valeur || 0))) md.push(ligne(i));
  md.push("");
}
if (bloques.length) {
  md.push("## Ce qui est suspendu à quelqu'un");
  md.push("");
  md.push("Un item suspendu n'est pas un item en retard : il attend un accès, une décision ou une");
  md.push("dépense qui n'appartient pas à la forge. Le motif est écrit dans l'item.");
  md.push("");
  md.push("| Id | Titre |");
  md.push("|---|---|");
  for (const i of bloques) md.push(`| ${i.id} | ${echapper((i.titre || "").slice(0, 110))} |`);
  md.push("");
}
md.push("## Ce que ce rapport ne dit pas");
md.push("");
md.push("- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.");
md.push("  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.");
md.push("- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance");
md.push("  (`gabarits\\cadence\\README.md`), jamais une valeur codée dans ce script.");
md.push("- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur");
md.push("  vérification est le travail de l'oracle du registre, pas de cette vue.");
md.push("");
writeFileSync(sortie, md.join("\n") + "\n", "utf8");
console.log(`AVANCEMENT généré → ${sortie}  (${ouverts.length} ouverts, ${corriges.length} clos, ` +
  `${ecartes.length} écartés, sceau source ${sceau})`);
