#!/usr/bin/env node
/**
 * oracle-domaines-declares.mjs — un domaine DÉCLARÉ répond-il vraiment, et sur le protocole que
 * les visiteurs empruntent ?
 *
 * Pourquoi il existe (TF-0585 / TF-0586 / TF-0587, lot Produit-02 du 24/08).
 *
 * Le fait fondateur, et il fait mal : le 23/08, un tableau de huit lignes a été publié à un
 * exploitant, avec des coches vertes, affirmant que quatre domaines convergeaient vers l'adresse
 * canonique. Toutes ces mesures avaient été faites en `http://`. Le 24/08, la même vérification
 * en `https://` donne le résultat OPPOSÉ : sept hostnames sur huit échouent au TLS, parce que le
 * port 443 est fermé sur le serveur de redirection. Les navigateurs tentent HTTPS en priorité et
 * un lien partagé porte presque toujours `https://` : la sonde portait donc sur un chemin que la
 * quasi-totalité du trafic n'emprunte pas. Le coût n'est pas l'erreur — c'est qu'elle a été
 * PRÉSENTÉE COMME UNE PREUVE.
 *
 * Le trou qu'il comble : aucun contrôle ne regardait les HOSTNAMES. Le seul voisin teste des
 * CHEMINS sur une base unique, et sa valeur par défaut pointait encore sur l'URL technique d'un
 * site qui avait basculé sur son domaine la veille — personne ne s'en était aperçu, parce que
 * rien ne confrontait la liste des domaines à la réalité servie.
 *
 * Règles (D1-D4, chacune binaire) :
 *   D1 chaque URL déclarée dans `docs\projet\PARAMETRAGE.md` répond en **HTTPS** — c'est le
 *      protocole des visiteurs, et le seul sur lequel une mesure vaut preuve ;
 *   D2 son code de réponse est exploitable (2xx, ou 3xx dont la cible est nommée) ;
 *   D3 une redirection annoncée aboutit — la chaîne est suivie et sa fin est dite, jamais
 *      supposée ;
 *   D4 aucune URL déclarée ne pointe sur un hôte technique de plateforme quand un domaine
 *      propre est déclaré à côté : c'est le défaut exact qui a survécu à une bascule.
 *
 * CE QU'IL NE FAIT PAS, et c'est structurant : hors ligne ou sans réseau, il rend NON_JUGEABLE et
 * ne conclut RIEN. Une sonde réseau qui rend PASS quand elle n'a pas pu mesurer est exactement le
 * défaut qu'elle prétend corriger.
 *
 * Usage : node oracle-domaines-declares.mjs <racine-du-projet> [--self-test]
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const TIMEOUT_MS = 8000;

/** Les URLs déclarées par le projet, telles que R-24 les tient déjà. */
export function urlsDeclarees(racine) {
  const p = join(racine, "docs", "projet", "PARAMETRAGE.md");
  if (!existsSync(p)) return { fichier: p, urls: [], absent: true };
  const texte = readFileSync(p, "utf8");
  const urls = [...new Set([...texte.matchAll(/https?:\/\/[^\s`)\]|"'<>]+/g)].map((m) => m[0].replace(/[.,;]+$/, "")))];
  return { fichier: p, urls, absent: false };
}

/** Une URL, sondée en HTTPS. Rend l'état, jamais une supposition. */
async function sonder(httpsUrl) {
  try {
    const reponse = await fetch(httpsUrl, {
      method: "GET", redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { url: httpsUrl, ok: true, statut: reponse.status, vers: reponse.headers.get("location") };
  } catch (erreur) {
    return { url: httpsUrl, ok: false, erreur: String(erreur.cause?.code || erreur.name || erreur).slice(0, 60) };
  }
}

export async function juger(racine, { sonde = sonder } = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });

  const { fichier, urls, absent } = urlsDeclarees(racine);
  if (absent) {
    return { oracle: "oracle-domaines-declares", verdict: "NON_JUGEABLE", findings: [
      { regle: "D1", statut: "SANS_OBJET", message: `pas de ${fichier} — aucune URL déclarée à confronter au réel` }], non_juge: [] };
  }
  if (!urls.length) {
    return { oracle: "oracle-domaines-declares", verdict: "NON_JUGEABLE", findings: [
      { regle: "D1", statut: "SANS_OBJET", message: "aucune URL déclarée dans PARAMETRAGE.md — rien à sonder" }], non_juge: [] };
  }

  // Les adresses de DEVELOPPEMENT LOCAL ne sont pas des domaines publics : sonder localhost
  // depuis le poste du pilot ne dit rien du produit, et le faire crier ferait sortir un FAIL
  // sur tout projet qui documente sa commande de demarrage — mesure sur le parc reel du 25/08.
  const LOCALES = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|[^/]*\.local)([:/]|$)/i;
  const publiques = urls.filter((u) => !LOCALES.test(u));
  const locales = urls.filter((u) => LOCALES.test(u));
  if (!publiques.length) {
    return { oracle: "oracle-domaines-declares", verdict: "NON_JUGEABLE", findings: [
      { regle: "D1", statut: "SANS_OBJET", message: `${locales.length} URL(s) declaree(s), toutes locales — aucun domaine public a confronter au reel` }], non_juge: [] };
  }

  const mesures = [];
  // Le protocole des VISITEURS, decide ici et non dans la sonde : une sonde injectee doit
  // recevoir l'URL deja normalisee, sinon la recette ne prouve pas ce qu'elle croit prouver.
  // C'est tout le sujet de TF-0585 — mesurer en http:// quand le trafic passe en https://.
  for (const u of publiques) mesures.push(await sonde(u.replace(/^http:\/\//i, "https://")));

  // Si RIEN n'a répondu, c'est le réseau qu'on mesure, pas le projet. Le dire, et s'arrêter.
  // La borne hors-ligne exige AU MOINS DEUX URLs muettes : avec une seule, « le reseau est
  // coupe » et « ce domaine ne repond pas » sont indiscernables, et taire un vrai echec au
  // motif qu'il pourrait etre un probleme de reseau serait le defaut que cet oracle corrige.
  if (mesures.length > 1 && mesures.every((m) => !m.ok)) {
    return { oracle: "oracle-domaines-declares", verdict: "NON_JUGEABLE", findings: [
      { regle: "D1", statut: "SANS_OBJET", message:
        `aucune des ${mesures.length} URL(s) n'a répondu — hors ligne ou réseau bloqué. Une sonde qui n'a pas pu mesurer ne conclut RIEN (c'est le défaut même que cet oracle corrige)` }],
      non_juge: ["l'état réel des domaines : non mesuré faute de réseau"] };
  }

  const muets = mesures.filter((m) => !m.ok);
  muets.length
    ? ko("D1", fichier, `${muets.length} URL(s) déclarée(s) NE RÉPONDENT PAS en HTTPS : ${muets.map((m) => `${m.url} (${m.erreur})`).slice(0, 4).join(" · ")} — c'est le protocole des visiteurs, une mesure en http:// ne vaut pas preuve (TF-0585)`)
    : ok("D1", `les ${mesures.length} URL(s) déclarée(s) répondent en HTTPS`);

  const inexploitables = mesures.filter((m) => m.ok && m.statut >= 400);
  inexploitables.length
    ? ko("D2", fichier, `${inexploitables.length} URL(s) en erreur : ${inexploitables.map((m) => `${m.url} → ${m.statut}`).slice(0, 4).join(" · ")}`)
    : ok("D2", "aucune URL déclarée ne rend un code d'erreur");

  const redirections = mesures.filter((m) => m.ok && m.statut >= 300 && m.statut < 400);
  const aveugles = redirections.filter((m) => !m.vers);
  aveugles.length
    ? ko("D3", fichier, `${aveugles.length} redirection(s) sans cible nommée : ${aveugles.map((m) => m.url).slice(0, 3).join(" · ")} — une chaîne dont la fin n'est pas dite est supposée, pas mesurée`)
    : ok("D3", redirections.length ? `${redirections.length} redirection(s), toutes avec leur cible nommée` : "aucune redirection à suivre");

  // D4 — l'hôte technique qui survit à une bascule. Le voisin de cet oracle en portait un en
  // valeur par défaut, un jour après que le site eut basculé sur son domaine.
  const PLATEFORMES = /\.(up\.railway\.app|vercel\.app|netlify\.app|herokuapp\.com|onrender\.com|pages\.dev|github\.io)/i;
  const techniques = mesures.filter((m) => PLATEFORMES.test(m.url));
  const propres = mesures.filter((m) => !PLATEFORMES.test(m.url));
  techniques.length && propres.length
    ? ko("D4", fichier, `${techniques.length} URL(s) d'hôte technique déclarée(s) alors qu'un domaine propre l'est aussi : ${techniques.map((m) => m.url).slice(0, 3).join(" · ")} — c'est le résidu exact qu'une bascule de domaine laisse derrière elle`)
    : ok("D4", techniques.length ? "seuls des hôtes techniques sont déclarés — aucun domaine propre à confronter" : "aucune URL d'hôte technique de plateforme");

  return {
    oracle: "oracle-domaines-declares",
    verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS",
    mesures: mesures.map((m) => ({ url: m.url, ok: m.ok, statut: m.statut ?? null, vers: m.vers ?? null, erreur: m.erreur ?? null })),
    findings,
    non_juge: [
      "la VALIDITÉ du certificat au-delà de l'établissement de la connexion : une chaîne acceptée par Node peut être refusée par un navigateur plus strict",
      "le contenu servi : cet oracle dit qu'un domaine répond, jamais qu'il sert la bonne chose",
      "les domaines NON déclarés dans PARAMETRAGE.md : ce qui n'est pas écrit n'est pas sondé, et c'est pourquoi R-24 exige qu'ils y soient",
    ],
  };
}

// ---- self-test : sonde injectée, aucun accès réseau -------------------------------------------
if (process.argv.includes("--self-test")) {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  let pass = 0, fail = 0;
  const check = async (nom, fn) => {
    try { await fn(); console.log(`  [PASS] ${nom}`); pass++; }
    catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
  };
  const T = mkdtempSync(join(tmpdir(), "domaines-"));
  const projet = (urls) => {
    const d = mkdtempSync(join(T, "p-"));
    mkdirSync(join(d, "docs", "projet"), { recursive: true });
    writeFileSync(join(d, "docs", "projet", "PARAMETRAGE.md"),
      "# Paramétrage\n\n" + urls.map((u) => `- production : ${u}`).join("\n") + "\n", "utf8");
    return d;
  };
  const fausseSonde = (table) => async (u) => table[u.replace(/^http:\/\//i, "https://")] || { url: u, ok: false, erreur: "INCONNU" };

  await check("verte — toutes les URL répondent en HTTPS", async () => {
    const u = "https://produit-02.com/";
    const r = await juger(projet([u]), { sonde: fausseSonde({ [u]: { url: u, ok: true, statut: 200 } }) });
    if (r.verdict !== "PASS") throw new Error(`${r.verdict} : ${JSON.stringify(r.findings.filter((f) => f.statut === "FAIL"))}`);
  });

  await check("D1 rouge — le fait fondateur : ça répond en http mais PAS en https", async () => {
    const u = "https://www.produit-02.fr/";
    const r = await juger(projet(["http://www.produit-02.fr/"]), {
      sonde: fausseSonde({ [u]: { url: u, ok: false, erreur: "ECONNREFUSED" } }) });
    if (!r.findings.some((f) => f.regle === "D1" && f.statut === "FAIL")) throw new Error("une URL muette en HTTPS passe — c'est exactement le tableau de coches vertes du 23/08");
  });

  await check("l'URL déclarée en http:// est SONDÉE en https://", async () => {
    let vue = null;
    await juger(projet(["http://exemple.test/"]), { sonde: async (u) => { vue = u; return { url: u, ok: true, statut: 200 }; } });
    if (!String(vue).startsWith("https://")) throw new Error(`sondé en ${vue} — les visiteurs n'empruntent pas ce chemin`);
  });

  await check("D3 rouge — redirection sans cible nommée", async () => {
    const u = "https://redir.test/";
    const r = await juger(projet([u]), { sonde: fausseSonde({ [u]: { url: u, ok: true, statut: 301, vers: null } }) });
    if (!r.findings.some((f) => f.regle === "D3" && f.statut === "FAIL")) throw new Error("une chaîne dont la fin n'est pas dite passe pour mesurée");
  });

  await check("D4 rouge — hôte technique survivant à une bascule", async () => {
    const a = "https://monsite-production.up.railway.app/", b = "https://monsite.com/";
    const r = await juger(projet([a, b]), { sonde: fausseSonde({ [a]: { url: a, ok: true, statut: 200 }, [b]: { url: b, ok: true, statut: 200 } }) });
    if (!r.findings.some((f) => f.regle === "D4" && f.statut === "FAIL")) throw new Error("le résidu d'URL technique passe — le défaut a survécu à la bascule sans être vu");
  });

  await check("BORNE — hors ligne (TOUTES muettes) : NON_JUGEABLE, JAMAIS un PASS", async () => {
    // Deux URLs, parce que la borne l'exige : avec une seule, « le réseau est coupé » et « ce
    // domaine ne répond pas » sont indiscernables, et taire un vrai échec au motif qu'il POURRAIT
    // être un problème de réseau serait le défaut même que cet oracle corrige.
    const r = await juger(projet(["https://a.test/", "https://b.test/"]),
      { sonde: async (u) => ({ url: u, ok: false, erreur: "ENOTFOUND" }) });
    if (r.verdict !== "NON_JUGEABLE") throw new Error(`${r.verdict} — une sonde qui n'a pas pu mesurer ne conclut RIEN`);
  });

  await check("BORNE — UNE seule muette parmi d'autres qui répondent : FAIL, jamais un silence", async () => {
    const a = "https://vivant.test/", b = "https://muet.test/";
    const r = await juger(projet([a, b]), { sonde: async (u) =>
      (u === a ? { url: a, ok: true, statut: 200 } : { url: b, ok: false, erreur: "ECONNREFUSED" }) });
    if (!r.findings.some((f) => f.regle === "D1" && f.statut === "FAIL"))
      throw new Error("un domaine muet est absous parce que ses voisins répondent — c'est le tableau de coches vertes du 23/08");
  });

  await check("BORNE — un seul hôte technique sans domaine propre n'est pas un défaut", async () => {
    const a = "https://monsite-production.up.railway.app/";
    const r = await juger(projet([a]), { sonde: fausseSonde({ [a]: { url: a, ok: true, statut: 200 } }) });
    if (r.findings.some((f) => f.regle === "D4" && f.statut === "FAIL")) throw new Error("un projet qui n'a pas encore de domaine propre est accusé");
  });

  await check("BORNE — localhost n'est pas un domaine public : jamais sondé, jamais accusé", async () => {
    // Mesuré sur le parc le 25/08 : un projet documentant sa commande de démarrage déclare
    // `https://localhost:3000`. Le sonder depuis le poste du pilot ne dit rien du produit, et
    // le faire crier ferait sortir un FAIL sur tout projet qui documente son démarrage.
    const pub = "https://monsite.com/";
    let sondees = [];
    const r = await juger(projet(["http://localhost:3000", pub]), { sonde: async (u) => {
      sondees.push(u); return { url: u, ok: true, statut: 200 }; } });
    if (sondees.some((u) => /localhost/.test(u))) throw new Error("localhost a été sondé");
    if (r.verdict !== "PASS") throw new Error(`${r.verdict} : ${JSON.stringify(r.findings.filter((f) => f.statut === "FAIL"))}`);
  });

  await check("BORNE — pas de PARAMETRAGE.md : SANS_OBJET, jamais un défaut de produit", async () => {
    const d = mkdtempSync(join(T, "vide-"));
    const r = await juger(d);
    if (r.verdict !== "NON_JUGEABLE") throw new Error(`${r.verdict} — un projet sans URLs déclarées n'est pas un projet fautif`);
  });

  rmSync(T, { recursive: true, force: true });
  console.log(`\nDomaines déclarés (D1-D4) : ${pass} PASS, ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
} else {
  const racine = process.argv[2];
  if (!racine || !existsSync(racine)) {
    console.log(JSON.stringify({ oracle: "oracle-domaines-declares", verdict: "ERREUR", message: "racine de projet introuvable" }));
    process.exit(2);
  }
  const r = await juger(racine);
  console.log(JSON.stringify(r, null, 1));
  process.exit(r.verdict === "PASS" ? 0 : r.verdict === "NON_JUGEABLE" ? 2 : 1);
}
