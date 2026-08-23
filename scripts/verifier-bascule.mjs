#!/usr/bin/env node
/**
 * verifier-bascule.mjs — M-6 : une bascule de domaine se vérifie DES DEUX CÔTÉS (TF-0482).
 *
 * L'INCIDENT DU 18/08. Le renommage d'un hôte a été livré avec une redirection 301 DURE vers un
 * domaine QUI NE RÉSOLVAIT PAS ENCORE. Le site est devenu injoignable, rétabli en une vingtaine de
 * secondes en conditionnant la redirection à un drapeau désarmé par défaut.
 *
 * POURQUOI AUCUNE PORTE N'A VU. Les gates M-1…M-5 s'exercent contre UNE SEULE BASE — la NOUVELLE
 * URL. L'ancienne n'est interrogée nulle part. Un déploiement qui la casse rend donc un vert
 * complet, et c'est structurel : ON NE PEUT PAS VOIR CE QU'ON N'INTERROGE PAS. Recherche faite le
 * 22/08 sur 479 items du registre : zéro candidature sur l'hôte sortant. L'angle mort n'était pas
 * connu, il était invisible.
 *
 * DEUX MOMENTS, DEUX QUESTIONS DIFFÉRENTES — c'est pourquoi il y a deux drapeaux et non un seul.
 *   --avant  : la CIBLE répond-elle ? Armer un 301 vers un domaine muet n'est pas un risque pris,
 *              c'est une panne programmée. Verdict BLOQUANT, pas un avertissement.
 *   --apres  : l'ANCIEN hôte répond-il encore ? On accepte un 200, ou un 301 vers un emplacement
 *              qui répond, CHEMIN ET REQUÊTE PRÉSERVÉS — une redirection qui perd le chemin renvoie
 *              tout le trafic profond sur l'accueil, et personne ne s'en plaint tout de suite.
 *
 * Usage :
 *   node scripts\verifier-bascule.mjs --avant  --cible <url>
 *   node scripts\verifier-bascule.mjs --apres  --historique <url> [--cible <url>]
 *   node scripts\verifier-bascule.mjs --apres  --historique <url> --chemin /a/b?c=1
 *   options : --delai <ms> (défaut 8000)
 *
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable (réseau injoignable, argument manquant).
 *
 * CE QU'IL NE FAIT PAS, et c'est délibéré : il ne DEVINE aucun hôte. M-6 ne s'exerce que si le
 * produit DÉCLARE ses hôtes historiques. Un produit sans hôte historique rend SANS OBJET, jamais un
 * échec — inventer une redirection pour avoir quelque chose à juger serait pire que ne rien juger.
 */
import { lookup } from "node:dns/promises";

const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const AVANT = args.includes("--avant");
const APRES = args.includes("--apres");
const DELAI = Number(val("--delai") || 8000);
const historique = val("--historique");
const cible = val("--cible");
const chemin = val("--chemin") || "/";

const findings = [];
const add = (regle, severite, message) => findings.push({ regle, severite, message });

const NON_JUGE = [
  "la PERTINENCE de la bascule : cet outil vérifie que les deux côtés répondent, jamais que le " +
  "nouveau domaine est le bon",
  "le CONTENU servi : un 200 sur une page d'erreur applicative reste un 200 — c'est le domaine de " +
  "M-2 (healthcheck) et M-3 (smoke tests)",
  "les redirections en CHAÎNE au-delà de 5 sauts : au-delà, on déclare la chaîne trop longue " +
  "plutôt que de la suivre indéfiniment",
  "un produit SANS hôte historique déclaré : rien n'est jugé, et c'est un SANS OBJET, pas un vert " +
  "gratuit — inventer une redirection pour avoir quelque chose à juger serait pire",
];

/** Sortie NORMALE, pas une erreur : elle interrompt la suite sans couper le processus. */
class SortieDemandee extends Error {}

function sortir(verdict, code) {
  process.stdout.write(JSON.stringify({
    outil: "verifier-bascule", version: "1.0.0", moment: AVANT ? "avant-armement" : APRES ? "apres-deploiement" : "-",
    historique: historique || null, cible: cible || null, chemin,
    verdict,
    findings: findings.length ? findings : [{ regle: "M-6", severite: "info", message: "les deux côtés de la bascule répondent" }],
    non_juge: NON_JUGE,
  }, null, 1) + "\n");
  // ON NE COUPE PAS LE PROCESSUS. `process.exit()` pendant qu'une connexion HTTP reste ouverte
  // tue Node sur un code Windows 0xC0000409, de façon INTERMITTENTE — constaté le 22/08 : trois
  // contrôles sur huit, le même appel isolé passant, et le harnais soupçonné à tort. On pose le
  // code de sortie et on laisse la boucle d'événements se vider : les sockets se ferment, puis
  // le processus rend la main de lui-même.
  process.exitCode = code;
  throw new SortieDemandee();
}

// Les gardes d'ARGUMENTS sortent AVANT toute requête : aucune socket n'est ouverte, couper le
// processus y est sans risque — et surtout, le `throw` de `sortir()` n'aurait personne pour
// l'absorber ici, hors de la fonction asynchrone. Un premier jet l'a appris : exit 1 au lieu de 2.
const sortirTot = (verdict, code) => {
  try { sortir(verdict, code); } catch (e) { if (!(e instanceof SortieDemandee)) throw e; }
  process.exit(code);
};

if (AVANT === APRES) {
  add("M-6", "erreur", "donner exactement un moment : --avant (la cible répond-elle ?) ou --apres (l'ancien hôte répond-il ?)");
  sortirTot("NON_JUGEABLE", 2);
}
if (AVANT && !cible) { add("M-6", "erreur", "--avant exige --cible <url>"); sortirTot("NON_JUGEABLE", 2); }
if (APRES && !historique) { add("M-6", "erreur", "--apres exige --historique <url>"); sortirTot("NON_JUGEABLE", 2); }

const hote = (u) => { try { return new URL(u).hostname; } catch { return null; } };

async function resout(u) {
  const h = hote(u);
  if (!h) return { ok: false, motif: `URL illisible : ${u}` };
  try { await lookup(h); return { ok: true }; }
  catch (e) { return { ok: false, motif: `le nom ${h} ne résout pas (${e.code || e.message})` }; }
}

async function interroger(u) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), DELAI);
  try {
    const r = await fetch(u, { redirect: "manual", signal: ctrl.signal });
    // LE CORPS SE CONSOMME, TOUJOURS. Sans cela, `process.exit()` tombe pendant qu'un flux est
    // encore ouvert et Node meurt sur un code Windows 0xC0000409 — constaté de façon INTERMITTENTE
    // le 22/08, ce qui est le pire cas : la recette échouait trois fois sur huit, le même appel
    // isolé passait, et on soupçonnait le harnais. Un flux non lu est une dette qui se paie à la
    // sortie.
    try { await r.arrayBuffer(); } catch { /* corps illisible : le statut suffit */ }
    return { ok: true, statut: r.status, emplacement: r.headers.get("location") };
  } catch (e) {
    return { ok: false, motif: e.name === "AbortError" ? `pas de réponse en ${DELAI} ms` : String(e.message || e) };
  } finally { clearTimeout(t); }
}

// La chaîne de redirection, bornée : au-delà de 5 sauts on DÉCLARE la chaîne trop longue plutôt que
// de la suivre indéfiniment. Une boucle de redirection est un défaut, pas une patience à avoir.
async function suivre(u, max = 5) {
  const sauts = [];
  let courant = u;
  for (let i = 0; i < max; i++) {
    const r = await interroger(courant);
    if (!r.ok) return { sauts, echec: r.motif, dernier: courant };
    sauts.push({ url: courant, statut: r.statut, vers: r.emplacement || null });
    if (r.statut >= 300 && r.statut < 400 && r.emplacement) {
      courant = new URL(r.emplacement, courant).toString();
      continue;
    }
    return { sauts, final: { url: courant, statut: r.statut } };
  }
  return { sauts, echec: `plus de ${max} redirections en chaîne — chaîne déclarée trop longue` };
}

const chemins = (u) => { try { const x = new URL(u); return x.pathname + x.search; } catch { return null; } };

(async () => {
  if (AVANT) {
    const r = await resout(cible);
    if (!r.ok) {
      add("M-6a", "bloquant", `CIBLE non résolvante : ${r.motif}. Armer une redirection vers ce ` +
        "domaine n'est pas un risque pris, c'est une panne programmée — c'est l'incident du 18/08, " +
        "mot pour mot. Basculer en deux temps : armer par drapeau, vérifier, puis basculer.");
      sortir("FAIL", 1);
    }
    const c = await suivre(cible);
    if (c.echec) {
      add("M-6a", "bloquant", `la CIBLE ne répond pas : ${c.echec}. Le domaine résout mais rien ne sert.`);
      sortir("FAIL", 1);
    }
    if (!c.final || c.final.statut >= 400) {
      add("M-6a", "bloquant", `la CIBLE répond ${c.final ? c.final.statut : "?"} — une redirection ` +
        "armée vers cette adresse enverrait tout le trafic sur une erreur.");
      sortir("FAIL", 1);
    }
    sortir("PASS", 0);
  }

  // --apres : l'ANCIEN hôte doit encore mener quelque part.
  const depart = new URL(chemin, historique).toString();
  const r = await resout(depart);
  if (!r.ok) {
    add("M-6b", "bloquant", `ANCIEN hôte non résolvant : ${r.motif}. Le trafic qui connaît encore ` +
      "cette adresse — liens, favoris, index de moteurs — tombe dans le vide.");
    sortir("FAIL", 1);
  }
  const c = await suivre(depart);
  if (c.echec) {
    add("M-6b", "bloquant", `ANCIEN hôte injoignable : ${c.echec}`);
    sortir("FAIL", 1);
  }
  if (!c.final || c.final.statut >= 400) {
    add("M-6b", "bloquant", `ANCIEN hôte : la chaîne finit en ${c.final ? c.final.statut : "?"} — ` +
      `sauts : ${c.sauts.map((s) => `${s.statut} ${s.url}`).join(" -> ")}`);
    sortir("FAIL", 1);
  }
  // Chemin et requête préservés : une redirection qui perd le chemin renvoie tout le trafic profond
  // sur l'accueil. Personne ne s'en plaint tout de suite, et c'est ce qui la rend coûteuse.
  const attendu = chemins(depart);
  const obtenu = chemins(c.final.url);
  if (attendu && obtenu && attendu !== "/" && obtenu !== attendu) {
    add("M-6b", "majeur", `CHEMIN PERDU : « ${attendu} » est arrivé sur « ${obtenu} ». Une ` +
      "redirection qui perd le chemin renvoie tout le trafic profond sur l'accueil — personne ne " +
      "s'en plaint tout de suite, et c'est ce qui la rend coûteuse.");
    sortir("FAIL", 1);
  }
  sortir("PASS", 0);
})().catch((e) => {
  if (e instanceof SortieDemandee) return;   // verdict déjà imprimé, code déjà posé
  process.stdout.write(JSON.stringify({ outil: "verifier-bascule", verdict: "NON_JUGEABLE",
    message: "erreur inattendue : " + (e && e.message ? e.message : String(e)) }, null, 1) + "\n");
  process.exitCode = 2;
});
