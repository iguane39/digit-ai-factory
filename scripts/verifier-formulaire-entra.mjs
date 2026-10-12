#!/usr/bin/env node
/**
 * verifier-formulaire-entra.mjs — un site protégé par Easy Auth + Entra peut-il afficher le
 * formulaire « Approbation requise » à sa première visite ? (M-13, TF-1519 ; 12/10/2026)
 *
 * LE FAIT. Le 30/09/2026, une livraison de production de Produit-03 est déclarée réussie alors que
 * son adresse répond AADSTS700038 : l'application Entra n'existe pas pour ce locataire, donc aucun
 * formulaire ne peut s'afficher et personne ne peut approuver. L'oracle est né chez le produit le
 * 01/10 (`infra/verifier-formulaire-entra.sh`), joué sur 4 adresses : production AADSTS700038,
 * qualification et développement accès ouvert, accès direct de qualification HTTP 403. Ce contrôle
 * le reprend dans le pilot, au contrat JSON commun (verdict, findings, non_juge, exit 0/1/2).
 *
 * CE QU'IL FAIT, en lecture seule, sans identifiant :
 *   1. demande l'adresse sans session et suit les redirections d'Easy Auth jusqu'à l'URL
 *      d'autorisation d'Entra (`/oauth2/v2.0/authorize?client_id=…&redirect_uri=…`) ;
 *   2. rejoue cette URL avec `prompt=none`. Entra ne renvoie `login_required` (ou
 *      `interaction_required`, `consent_required`) vers le site que si l'identifiant d'application
 *      ET l'adresse de retour sont reconnus ; sinon il répond AADSTS… et aucun formulaire n'existe.
 *
 * VERDICTS. PASS : l'application est reconnue, le formulaire est possible (`consent_required` : il
 * s'affichera à la première visite). FAIL : une réponse AADSTS (le code est rendu). SKIP (exit 2) :
 * adresse à accès ouvert, accès direct refusé (403), réponse non reconnue, ou panne réseau — « je ne
 * peux pas juger » n'est jamais un FAIL.
 *
 * L'EN-TÊTE DE LA SONDE, ÉCART TRANCHÉ. Mesuré par le produit : avec un navigateur Chrome, Entra
 * répond AADSTS50168 ; la sonde se présentait donc comme Firefox. Ici elle garde ce jeton mesuré et
 * se DÉCLARE par un second en-tête, `X-Sonde: digit-ai-verifier-formulaire-entra`, au lieu de
 * l'ajouter à l'agent utilisateur : le comportement mesuré reste celui qui a été mesuré. `--user-agent`
 * le remplace. Cette présentation n'a pu être rejouée ici (aucun appel à Azure depuis cette campagne).
 *
 * Usage : node scripts/verifier-formulaire-entra.mjs <adresse> [--hote-entra <origine>] [--user-agent <chaîne>]
 * Sortie : JSON · exit 0 = formulaire possible · 1 = AADSTS (aucun formulaire possible) · 2 = non jugeable.
 */
import { fileURLToPath } from "node:url";

const NON_JUGE = [
  "l'APPROBATION elle-même : lire le consentement de l'organisation demande une session `az` connectée, absente ici ; le contrôle dit si le formulaire PEUT s'afficher, pas si quelqu'un l'a approuvé",
  "une adresse protégée autrement qu'Easy Auth + Entra (autre fournisseur d'identité, protection en amont) : elle se lit « accès ouvert » ou « réponse non reconnue » (exit 2), jamais conforme",
  "le comportement d'Entra à venir : la reconnaissance par prompt=none a été mesurée par le produit le 01/10/2026 sur 4 adresses, pas garantie par la documentation",
  "le jeton Firefox de l'agent utilisateur est celui que le produit a mesuré (Chrome → AADSTS50168) ; il n'a pas été rejoué depuis le pilot",
];

const UA_MESURE = "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0";
const HOTE_ENTRA = /(?:^|\.)login\.(?:microsoftonline|microsoft)\.com$|\.b2clogin\.com$/i;
const SIGNIFICATION = {
  AADSTS700038: "l'identifiant d'application n'existe pas pour ce locataire : l'inscription Entra manque, aucun formulaire ne peut s'afficher",
  AADSTS700016: "application introuvable dans l'annuaire du locataire : l'inscription Entra manque ou vise un autre locataire",
  AADSTS50011: "l'adresse de retour ne figure pas parmi celles de l'inscription Entra",
  AADSTS500113: "aucune adresse de retour n'est inscrite pour l'application",
};

/** Lit la réponse d'autorisation : { classe, code } où classe = reconnue | consentement | aadsts | inconnue. */
export function lireReponse(status, location, corps) {
  const texte = `${location || ""}\n${corps || ""}`;
  const aadsts = /AADSTS(\d{3,6})/.exec(texte);
  if (aadsts) return { classe: "aadsts", code: `AADSTS${aadsts[1]}` };
  const erreur = /(?:[?&#]error=|name=["']error["'][^>]*value=["']|["']error["']\s*:\s*["'])(login_required|interaction_required|consent_required)/i.exec(texte)
    || /value=["'](login_required|interaction_required|consent_required)["'][^>]*name=["']error["']/i.exec(texte);
  if (erreur) return { classe: /consent/i.test(erreur[1]) ? "consentement" : "reconnue", code: erreur[1].toLowerCase() };
  return { classe: "inconnue", code: null, status };
}

async function demander(url, ua, fetchFn) {
  const r = await fetchFn(url, { redirect: "manual", headers: { "User-Agent": ua, "X-Sonde": "digit-ai-verifier-formulaire-entra", "Accept": "text/html,application/xhtml+xml" } });
  const corps = r.status >= 300 && r.status < 400 ? "" : (await r.text()).slice(0, 200000);
  return { status: r.status, location: r.headers.get("location"), corps };
}

export async function verifier(adresse, { hoteEntra = null, userAgent = UA_MESURE, fetchFn = fetch } = {}) {
  const trace = [];
  let url = adresse;
  let autorisation = null;
  try {
    for (let saut = 0; saut < 6 && !autorisation; saut++) {
      const r = await demander(url, userAgent, fetchFn);
      trace.push({ url: url.replace(/\?.*$/, ""), status: r.status });
      if (r.status >= 300 && r.status < 400 && r.location) {
        const suivante = new URL(r.location, url);
        if (HOTE_ENTRA.test(suivante.hostname) || (hoteEntra && suivante.origin === new URL(hoteEntra).origin) || /\/oauth2\/v2\.0\/authorize$/.test(suivante.pathname)) { autorisation = suivante; break; }
        url = suivante.href;
        continue;
      }
      if (r.status === 403) return { verdict: "SKIP", code: 2, motif: "accès direct refusé (HTTP 403) : l'adresse n'est pas servie à un visiteur sans session, aucun formulaire à juger", trace };
      if (r.status >= 200 && r.status < 300) return { verdict: "SKIP", code: 2, motif: `accès ouvert (HTTP ${r.status}, aucune redirection vers Entra) : Easy Auth n'exige pas d'identification ici, aucun formulaire à juger`, trace };
      return { verdict: "SKIP", code: 2, motif: `réponse inattendue de l'adresse (HTTP ${r.status}) avant toute redirection vers Entra`, trace };
    }
  } catch (e) {
    return { verdict: "SKIP", code: 2, motif: `adresse injoignable : ${e.message}`, trace };
  }
  if (!autorisation) return { verdict: "SKIP", code: 2, motif: "six redirections suivies sans atteindre l'autorisation d'Entra", trace };
  const sonde = new URL(autorisation.href);
  if (hoteEntra) { const h = new URL(hoteEntra); sonde.protocol = h.protocol; sonde.host = h.host; }
  sonde.searchParams.set("prompt", "none");
  let rep;
  try { rep = await demander(sonde.href, userAgent, fetchFn); }
  catch (e) { return { verdict: "SKIP", code: 2, motif: `autorisation d'Entra injoignable : ${e.message}`, trace }; }
  trace.push({ url: sonde.href.replace(/\?.*$/, ""), status: rep.status, prompt: "none" });
  const l = lireReponse(rep.status, rep.location, rep.corps);
  const clientId = sonde.searchParams.get("client_id");
  if (l.classe === "aadsts") {
    if (l.code === "AADSTS50168") return { verdict: "SKIP", code: 2, motif: "AADSTS50168 : Entra refuse la présentation de la sonde (le produit l'a mesuré avec un navigateur Chrome) — essayer --user-agent, ce n'est pas un constat sur l'application", trace, client_id: clientId };
    return { verdict: "FAIL", code: 1, aadsts: l.code, client_id: clientId, trace,
      message: `${l.code} : ${SIGNIFICATION[l.code] || "Entra refuse l'autorisation avant tout formulaire"} — aucun formulaire « Approbation requise » ne peut s'afficher à la première visite` };
  }
  if (l.classe === "reconnue") return { verdict: "PASS", code: 0, client_id: clientId, trace, message: `Entra reconnaît l'application et l'adresse de retour (${l.code}) : l'identification est possible` };
  if (l.classe === "consentement") return { verdict: "PASS", code: 0, client_id: clientId, trace, message: "Entra reconnaît l'application et demande un consentement (consent_required) : le formulaire « Approbation requise » s'affichera à la première visite, il reste à l'approuver" };
  return { verdict: "SKIP", code: 2, motif: `réponse d'autorisation non reconnue (HTTP ${rep.status}, ni AADSTS ni login_required) : pas un constat sur l'application`, trace, client_id: clientId };
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
  const adresse = args.filter((a, i) => !a.startsWith("--") && !["--hote-entra", "--user-agent"].includes(args[i - 1]))[0];
  const sortir = (corps, code) => { process.stdout.write(JSON.stringify({ outil: "verifier-formulaire-entra", version: "1.0.0", regle: "M-13 (ETAPE-MEP.md § 3 decies, règle 6)", ...corps, non_juge: NON_JUGE }, null, 1) + "\n", () => {
    // process.exit() immédiat pendant que fetch referme ses connexions plante Node sous Windows (0xC0000409) : on laisse la boucle respirer.
    process.exitCode = code; setTimeout(() => process.exit(code), 150);
  }); };
  if (!adresse || !/^https?:\/\//i.test(adresse)) sortir({ verdict: "NON_JUGEABLE", message: "adresse absente ou sans http(s)://" }, 2);
  const r = await verifier(adresse, { hoteEntra: valeur("--hote-entra"), userAgent: valeur("--user-agent") || UA_MESURE });
  const { code, ...reste } = r;
  const findings = r.verdict === "FAIL" ? [{ regle: "FE-1", statut: "FAIL", ou: adresse, message: r.message }] : [];
  sortir({ adresse, ...reste, findings }, code);
}
