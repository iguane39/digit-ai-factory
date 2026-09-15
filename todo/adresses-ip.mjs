#!/usr/bin/env node
/**
 * adresses-ip.mjs — relève, dans le texte d'un lot, les ADRESSES IP que la pseudonymisation ne voit
 * pas, pour qu'un humain les QUALIFIE avant qu'elles voyagent (TF-1134 (a), 15/09/2026).
 *
 * LE FAIT. Le 15/09, un lot de retours accueilli et le registre portaient l'adresse IPv4 d'un poste
 * en service. L'accueil (`accueillir-lot.mjs`) pseudonymise les noms que les tables du canal
 * connaissent ; une adresse n'est le nom de personne, aucune table ne la porte, et elle a traversé
 * l'accueil, l'ingestion et la porte de publication sans qu'aucun ne la nomme.
 *
 * LE MODÈLE est celui de TF-0966 (`identifiants-techniques.mjs`) : un AVERTISSEMENT, jamais un refus.
 * Un poste ne peut pas savoir seul si une adresse désigne une machine réelle ; le relevé demande, il
 * ne tranche pas. Les adresses sont NOMMÉES à l'écran ; l'événement d'ingestion n'en porte que le
 * NOMBRE, jamais la valeur — elle est peut-être confidentielle, et le registre est publié.
 *
 * CE QUI EST RELEVÉ : toute IPv4 (quatre octets décimaux, validée par `node:net`) et toute IPv6
 * (validée par `node:net`, donc écrite avec `::` ou sur huit groupes), MOINS :
 *   · les plages de DOCUMENTATION : 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (RFC 5737) et
 *     2001:db8::/32 (RFC 3849) — c'est là qu'un exemple, une fixture ou une doctrine prend ses adresses ;
 *   · le BOUCLAGE : 127.0.0.0/8 et ::1 ;
 *   · un NUMÉRO DE VERSION à quatre composants quand son contexte le dit : précédé d'une lettre
 *     (`v1.2.3.4`), d'un mot de version (`version`, `ver.`, `release`, `build`, `rev`) ou d'un `@`
 *     (`paquet@1.2.3.4`), ou suivi d'un suffixe de pré-version (`-rc1`, `-beta`, `+build.7`).
 *
 * CE QUI N'EST PAS DISTINGUÉ (déclaré, et prouvé par la recette) :
 *   · un numéro de version à quatre composants SANS contexte (« passe en 10.0.19041.1 ») est relevé :
 *     rien ne le distingue d'une adresse, un humain le qualifie ;
 *   · une vraie adresse précédée d'un mot de version (« build 10.1.2.3 ») serait prise pour une version ;
 *   · les masques (255.255.255.0) et l'adresse non spécifiée (0.0.0.0) sont relevés : ils ne désignent
 *     aucun poste, mais la règle ne les exclut pas — la liste d'exclusions est celle du mandat ;
 *   · une IPv6 à zone (`fe80::1%eth0`) est relevée sans sa zone ; une adresse coupée par un saut de
 *     ligne n'est pas vue.
 *
 * Usage : node todo/adresses-ip.mjs <fichier> — imprime le relevé (exit 0 vide, 1 sinon).
 */
import { readFileSync } from "node:fs";
import { isIPv4, isIPv6 } from "node:net";
import { fileURLToPath } from "node:url";

// Une IPv4 candidate : ni collée à un mot (`v1.2.3.4`), ni prolongée d'un cinquième composant.
export const MOTIF_IPV4 = /(?<![\w.])(?:\d{1,3}\.){3}\d{1,3}(?![\w]|\.\d)/g;
// Une IPv6 candidate : la plus longue suite de chiffres hexadécimaux, de `:` et de `.` ; `node:net`
// tranche ensuite. Une heure (`12:30:45`) ou une adresse MAC ne sont pas des IPv6 valides.
export const MOTIF_IPV6 = /(?<![\w:.])[0-9A-Fa-f:.]{2,45}(?!\w)/g;
const AVANT_VERSION = /(?:\b(?:version|ver\.?|release|build|rev\.?)\s*[:=]?\s*|@)$/i;
const APRES_VERSION = /^(?:-(?:alpha|beta|rc|pre|dev|snapshot)|\+[0-9A-Za-z])/i;

/** Les huit groupes d'une IPv6 valide, développés sur quatre chiffres. */
function groupesIpv6(adresse) {
  let a = adresse.toLowerCase();
  const v4 = a.match(/(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (v4) {
    const o = v4[1].split(".").map(Number);
    a = a.slice(0, -v4[1].length) + ((o[0] << 8) | o[1]).toString(16) + ":" + ((o[2] << 8) | o[3]).toString(16);
  }
  const [tete, queue] = a.includes("::") ? a.split("::") : [a, null];
  const t = tete ? tete.split(":") : [];
  const q = queue === null ? [] : queue ? queue.split(":") : [];
  const milieu = queue === null ? [] : Array(8 - t.length - q.length).fill("0");
  return [...t, ...milieu, ...q].map((g) => g.padStart(4, "0"));
}

/** Pourquoi une adresse n'est PAS à qualifier (`documentation`, `bouclage`), ou `null`. */
export function motifExclusion(adresse) {
  if (isIPv4(adresse)) {
    const [a, b, c] = adresse.split(".").map(Number);
    if (a === 127) return "bouclage";
    if ((a === 192 && b === 0 && c === 2) || (a === 198 && b === 51 && c === 100) || (a === 203 && b === 0 && c === 113)) return "documentation";
    return null;
  }
  if (isIPv6(adresse)) {
    const g = groupesIpv6(adresse);
    if (g[0] === "2001" && g[1] === "0db8") return "documentation";
    if (g.slice(0, 7).every((x) => x === "0000") && g[7] === "0001") return "bouclage";
    return null;
  }
  return null;
}

/**
 * Chaque OCCURRENCE d'adresse à qualifier, avec sa position : c'est LA définition des adresses du
 * dépôt (exclusions comprises), que le relevé et le masquage partagent — deux définitions finiraient
 * par dire deux choses différentes du même lot.
 */
export function occurrences(texte) {
  const t = String(texte || "");
  const trouvees = [];
  const plages6 = [];
  for (const m of t.matchAll(MOTIF_IPV6)) {
    const brut = m[0].replace(/\.$/, "");
    if ((brut.match(/:/g) || []).length < 2 || !isIPv6(brut)) continue;
    plages6.push([m.index, m.index + brut.length]);
    trouvees.push({ adresse: brut, index: m.index, fin: m.index + brut.length });
  }
  for (const m of t.matchAll(MOTIF_IPV4)) {
    if (!isIPv4(m[0])) continue;
    if (plages6.some(([d, f]) => m.index >= d && m.index < f)) continue;   // la fin d'une IPv6 mixte
    const avant = t.slice(Math.max(0, m.index - 16), m.index);
    const apres = t.slice(m.index + m[0].length, m.index + m[0].length + 12);
    if (AVANT_VERSION.test(avant) || APRES_VERSION.test(apres)) continue;
    trouvees.push({ adresse: m[0], index: m.index, fin: m.index + m[0].length });
  }
  return trouvees.filter((x) => !motifExclusion(x.adresse)).sort((x, y) => x.index - y.index);
}

/** Les adresses IP d'un texte à qualifier, uniques, dans l'ordre d'apparition. */
export function relever(texte) {
  const vues = new Set();
  return occurrences(texte).map((x) => x.adresse).filter((a) => !vues.has(a) && vues.add(a));
}

/**
 * LE MASQUE d'une adresse retirée sur décision humaine (D-15 a, 15/09/2026). Forme posée ce jour-là :
 * « [adresse IP du poste, masquée le 15/09/2026] ». Le motif accepte cette forme et ses variantes de
 * désignation (« [adresse IP du service, masquée le …] ») ; il exige la date du geste.
 */
export const MOTIF_MASQUE = /\[adresse IP[^\]\n]{0,60}, masquée le \d{2}\/\d{2}\/\d{4}\]/;
/** Les masques distincts qu'un texte porte. */
export const masquesDe = (texte) => [...new Set(String(texte || "").match(new RegExp(MOTIF_MASQUE.source, "g")) || [])];

/** Le texte où chaque occurrence d'adresse à qualifier est remplacée par le masque donné. */
export function masquerAdresses(texte, masque) {
  let t = String(texte || "");
  for (const o of occurrences(t).reverse()) t = t.slice(0, o.index) + masque + t.slice(o.fin);
  return t;
}

/** Ce qui reste à qualifier sur plusieurs textes (titre, contenu, nom de fichier…). */
export function aQualifier(textes) {
  const toutes = new Set();
  for (const t of textes) for (const a of relever(t)) toutes.add(a);
  return [...toutes];
}

/** Le message d'écran : les adresses NOMMÉES, et le geste qui les qualifie. */
export function messageAQualifier(adresses, ou = "") {
  if (!adresses.length) return null;
  return `[ADRESSES IP À QUALIFIER] ${adresses.length} adresse(s) hors plages de documentation et de bouclage${ou ? ` dans ${ou}` : ""} : `
    + `${adresses.join(", ")}\n  Adresse d'un poste ou d'un service réel ? La retirer ou la remplacer par une adresse de documentation `
    + "(192.0.2.x, 198.51.100.x, 203.0.113.x, 2001:db8::) AVANT l'enregistrement du lot ; sinon, rien à faire (TF-1134).";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2]) {
  const reste = relever(readFileSync(process.argv[2], "utf8"));
  console.log(reste.length ? messageAQualifier(reste, process.argv[2]) : "aucune adresse IP à qualifier");
  process.exit(reste.length ? 1 : 0);
}
