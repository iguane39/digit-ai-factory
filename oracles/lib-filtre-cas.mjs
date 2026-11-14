/**
 * lib-filtre-cas.mjs — jouer quelques cas d'une recette, pas toute la recette (TF-2256, 06/11/2026).
 *
 * LE FAIT. Le 06/11/2026, une campagne a mesuré trois recettes sans sélecteur : `oracle-synthese --self-test`
 * 13 min 22 s à vide, `hook-restitution.test` 6 min 34 s, `hook-ouverture.test` 13 min sous charge. Un agent
 * qui corrige une règle n'a besoin que de ses cas ; faute de sélecteur, chacun extrayait les siens dans un
 * script jetable, hors de la recette qui les porte.
 *
 * LE DISPOSITIF. Chaque recette découpe son corps en TRANCHES, une par cas (ou par groupe de cas liés), et
 * garde chaque tranche par `if (filtre.veut(<numéros>))`. Une variable d'environnement PROPRE À LA RECETTE
 * porte la sélection : `FORGE_CAS_RESTITUTION` (hook-restitution.test, numéro du cas), `FORGE_CAS_SYNTHESE`
 * (oracle-synthese --self-test, numéro de la règle S), `FORGE_CAS_OUVERTURE` (hook-ouverture.test, numéro du TF
 * de la section). Une variable par recette : les numéros ne désignent pas la même chose d'une recette à l'autre.
 *
 * Formes admises : « 66 », « 65,66 », « 60-66 », « S93 », « TF-2214 » (le préfixe de lettres est ignoré, seul le
 * nombre compte), séparés par des virgules, points-virgules ou espaces.
 *
 * LES TROIS GARDES, parce qu'un filtre qui se trompe en silence rend une recette verte sur rien :
 *   · un numéro qu'aucune tranche ne déclare (faute de frappe, cas disparu) est une ERREUR, exit 2, jamais un vert
 *     sur zéro cas ;
 *   · une sélection illisible est une ERREUR, exit 2 ;
 *   · une recette filtrée dit qu'elle est PARTIELLE et n'écrit jamais son total ordinaire (« 68/68 »), que le
 *     cliquet du nombre de cas (`lib-baseline-recettes.mjs`) lirait comme un compte complet. `self-tests.mjs`
 *     retire de plus ces variables de l'environnement des recettes qu'il joue : le total du dépôt ne se mesure
 *     jamais sur une sélection.
 */

const PLAFOND_PLAGE = 5000;

/**
 * Lit une sélection de numéros. Rend `{ numeros, invalides }` : `numeros` est `null` quand aucune sélection n'est
 * posée (chaîne vide ou absente), jamais un ensemble vide.
 */
export function analyserSelection(brut) {
  const texte = typeof brut === "string" ? brut.trim() : "";
  if (!texte) return { numeros: null, invalides: [] };
  const numeros = new Set();
  const invalides = [];
  for (const jeton of texte.split(/[\s,;]+/).filter(Boolean)) {
    const m = jeton.match(/^(?:[A-Za-z]+-?)?(\d+)(?:-(\d+))?$/);
    if (!m) { invalides.push(jeton); continue; }
    const a = Number(m[1]);
    const b = m[2] === undefined ? a : Number(m[2]);
    if (b < a || b - a > PLAFOND_PLAGE) { invalides.push(jeton); continue; }
    for (let n = a; n <= b; n++) numeros.add(n);
  }
  return { numeros: numeros.size ? numeros : null, invalides };
}

/**
 * Crée le filtre d'une recette. `variable` est le nom de la variable d'environnement qui porte la sélection.
 */
export function creerFiltre(variable, env = process.env) {
  const { numeros, invalides } = analyserSelection(env[variable]);
  const declares = new Set();
  let tranches = 0;
  let jouees = 0;
  return {
    variable,
    actif: numeros !== null || invalides.length > 0,
    selection: numeros,
    /**
     * Vrai quand la tranche doit être jouée. Sans sélection, toute tranche est jouée. Une sélection illisible ne
     * joue rien : l'erreur est rendue par `bilan()` en fin de recette.
     */
    veut(...ids) {
      tranches += 1;
      for (const id of ids) declares.add(Number(id));
      const joue = invalides.length > 0 ? false : numeros === null || ids.some((id) => numeros.has(Number(id)));
      if (joue) jouees += 1;
      return joue;
    },
    /**
     * Question sans effet de bord : la sélection retient-elle l'un de ces numéros ? Sert à garder un relevé COÛTEUX que
     * plusieurs tranches se partagent, sans compter une tranche de plus. Une sélection illisible ne retient rien.
     */
    voudrait(...ids) {
      if (invalides.length > 0) return false;
      return numeros === null || ids.some((id) => numeros.has(Number(id)));
    },
    /**
     * Bilan de fin de recette : `erreur` non nulle quand la sélection est illisible ou nomme un numéro qu'aucune
     * tranche ne porte ; `partielle` vrai quand un filtre valide a restreint la recette.
     */
    bilan() {
      if (!this.actif) return { actif: false, partielle: false, erreur: null, tranches, jouees };
      if (invalides.length > 0) {
        return { actif: true, partielle: false, tranches, jouees,
          erreur: `${variable} illisible : « ${invalides.join(" ")} » — formes admises : 66, 65,66, 60-66, S93, TF-2214` };
      }
      const absents = [...numeros].filter((n) => !declares.has(n)).sort((a, b) => a - b);
      if (absents.length > 0) {
        const connus = [...declares].sort((a, b) => a - b);
        return { actif: true, partielle: false, tranches, jouees,
          erreur: `${variable} : aucun cas ne porte le numéro ${absents.join(", ")} — rien n'a été jugé de ce numéro. Numéros connus : ${connus.join(" ")}` };
      }
      return { actif: true, partielle: true, erreur: null, tranches, jouees };
    },
  };
}

/**
 * La ligne finale d'une recette filtrée et son code de sortie. `echecs` est la liste des échecs relevés.
 * Une recette non filtrée n'est pas concernée : l'appelant garde sa ligne et son code habituels.
 */
export function conclureFiltre(nom, filtre, echecs) {
  const b = filtre.bilan();
  if (b.erreur) return { code: 2, ligne: `${nom} : FILTRE INVALIDE — ${b.erreur}` };
  if (echecs.length) return { code: 1, ligne: `${nom} : FAIL (${b.jouees} tranche(s) jouée(s) sur ${b.tranches}, filtre ${filtre.variable}=${[...filtre.selection].join(",")})\n  - ${echecs.join("\n  - ")}` };
  return { code: 0, ligne: `${nom} : recette PARTIELLE — ${b.jouees} tranche(s) jouée(s) sur ${b.tranches} par ${filtre.variable}=${[...filtre.selection].join(",")}, aucun échec relevé ; cette ligne ne vaut pas le total de la recette, qui se joue sans filtre` };
}
