#!/usr/bin/env node
/**
 * lib-parc.mjs — LES DÉPÔTS DÉCLARÉS DU PARC, en une seule source (TF-1327, D-19 (a) du 26/09/2026).
 *
 * Ces déclarations vivaient dans `bootstrap.mjs`, sans être partagées : les balayages du parc
 * (`oracle-empreintes`, `oracle-pieges-regex`, `hook-produits-intacts`…) décidaient donc qu'un
 * dossier est une forge à la FORME de son nom (`/^digit-ai/`). Le 22/09, le produit de marque
 * `digit-ai-marketing`, gardé sur ce poste par D-11 (a), y est entré : `oracle-empreintes` a compté
 * son script comme un site de scellement NON DÉCLARÉ d'une forge, et la recette complète du pilot
 * est restée rouge pour un fichier qu'aucune forge ne porte. Les produits DÉCLARÉS de l'écosystème
 * sortent désormais de tout balayage de forges : `estDepotEcosysteme` est cette lecture, commune.
 *
 * Déplacé tel quel de `bootstrap.mjs` le 27/09/2026 (commentaires compris) ; `bootstrap.mjs` l'importe.
 */

export const FORGES = [
  { nom: "digit-ai-forge-conception", preuve: "oracles/self-test.mjs" },
  { nom: "digit-ai-forge-design", preuve: "oracles/run-oracles-design.mjs" },
  // forge-development : ex `digit-ai-saas-forge`, renommée sur GitHub — l'alias manquait, et c'est
  // le SEUL renommage de forge qui n'était pas dans cette table. GitHub redirige l'ancienne URL,
  // donc le clone resté dessus `fetch` sans broncher : rien ne le distinguait d'un produit
  // autonome, et il était même exclu nommément du balayage §4 bis sous ce motif faux (retiré le
  // 27/08). Mesure : `git ls-remote` sur les DEUX URL rend le même `refs/heads/main` (015a754) ;
  // le clone dormait à la racine du parc depuis le 09/07, jamais déclaré par aucun contrôle.
  { nom: "digit-ai-forge-development", preuve: "digit-ai-forge-development/pyproject.toml", alias: ["digit-ai-saas-forge"] },
  { nom: "digit-ai-forge-tests", preuve: "forge_tests/__main__.py" },
  { nom: "digit-ai-forge-agents", preuve: ".claude/skills/forge-agents/SKILL.md" },
  // forge-seo-geo : ex forge-seo, renommée le 20/08 (TF-0390) — le volet GEO entre au nom.
  { nom: "digit-ai-forge-seo-geo", preuve: "scripts/validate.py", alias: ["digit-ai-forge-seo"] },
  { nom: "digit-ai-forge-organization", preuve: "output/02-composants/composant-filtres-tableau/oracle-filtres-tableau.mjs" },
  // forge-audit : le PRODUIT AuditCore (public, marque blanche — ex `digit-ai-forge-auditcore`,
  // renommé le 11/08). L'espace d'engagement client (`digit-ai-forge-audit_<engagement>`, privé)
  // est hors bootstrap — voir la convention de suffixe plus bas.
  { nom: "digit-ai-forge-audit", preuve: "core/invariants.json", alias: ["digit-ai-forge-auditcore"] },
  // forge-ops : exploitation — outille l'étape MEP du pilot (TF-0040).
  { nom: "digit-ai-forge-ops", preuve: "oracles/self-test.mjs" },
  // forge-data : discipline de la donnée (TF-0083).
  { nom: "digit-ai-forge-data", preuve: "oracles/self-test.mjs" },
  // forge-agents-security : sécurité agentique (TF-0111) — le juge ne vit pas chez le jugé.
  { nom: "digit-ai-forge-agents-security", preuve: "oracles/self-test.mjs" },
  // forge-observability : observabilité continue entre les runs (TF-0112).
  { nom: "digit-ai-forge-observability", preuve: "oracles/self-test.mjs" },
  // forge-websec : sécurité du produit web livré (TF-0123).
  { nom: "digit-ai-forge-websec", preuve: "oracles/self-test.mjs" },
  // digit-ai-queue : la FILE DE TICKETS versionnée en git que des humains et des agents lisent et
  // écrivent — entrée dans cette liste le 23/08/2026 sur décision humaine (TF-0535). Elle vivait
  // dans le parc depuis un moment, avec son propre dépôt distant, et AUCUN contrôle ne la nommait :
  // ni forge suivie, ni second clone, ni mise de côté, elle tombait entre toutes les branches du
  // balayage. Y entrer, c'est gagner la fraîcheur, la preuve de point d'entrée et la ligne au
  // ledger ; c'est aussi accepter qu'un retard fasse échouer l'ouverture de poste jusqu'au --pull.
  // La preuve est le CONTRAT du protocole, pas un fichier de commodité : `protocole/` se veut
  // autoportant et clonable seul, donc son README est ce qui doit exister pour que la file serve.
  { nom: "digit-ai-queue", preuve: "protocole/README.md" },
];

// LES PRODUITS DE L'ÉCOSYSTÈME QUI PORTENT SON NOM (décision humaine D-5 (a) du 17/09/2026). Un dépôt
// nommé `digit-ai-…` n'est pas forcément une forge : `digit-ai-marketing` est un PRODUIT — il porte
// `forge\`, `PROMPT-PRODUIT.md`, remet des lots de retours — publié sous le compte de l'écosystème.
// Il tombait dans la question « hors liste » du balayage, et la table des pseudonymes le tenait pour
// un nom à cacher : la porte de publication a refusé le pilot sur 40 occurrences dans 11 fichiers.
// Il n'entre PAS dans `FORGES` : un produit ne se clone ni ne se tire à l'ouverture du poste, le pilot
// n'y intervient que sur run demandé. Il se DÉCLARE ici, et le balayage cesse de poser la question.
export const PRODUITS_DE_L_ECOSYSTEME = new Set(["digit-ai-marketing"]);

// LE PILOT ET SES NOMS D'HIER (TF-0525, mesuré le 25/08/2026). Le pilot n'est pas une forge et ne
// figure pas dans `FORGES` : son nom s'écrivait donc en littéral à chaque endroit qui en avait
// besoin, et ses anciens noms nulle part. Une source unique ici, parce qu'un troisième renommage
// est déjà arrivé deux fois.
export const PILOT = "digit-ai-factory";
//: Les noms de dépôt sous lesquels le pilot a vécu, du plus récent au plus ancien. GitHub redirige
//: les anciens noms, ce qui rend un vieux clone indiscernable d'un dépôt vivant à l'usage : il
//: `fetch` sans broncher. Seule cette table permet de le rapprocher du pilot.
export const ALIAS_PILOT = ["digit-ai-forge-pilot", "digit-ai-forge-steering"];
// LE CANAL CONFIDENTIEL (D-28 (a), 07/09/2026). Un dépôt PRIVÉ, cloné sous un nom de dossier qui ne
// commence pas par « digit-ai » pour qu'aucun balayage ne le prenne pour une forge : il porte les deux
// tables de pseudonymisation (clients, produits) et les entrants confidentiels des produits et des
// forges. Tiré à chaque ouverture comme les forges, il est un DÉFAUT s'il est absent ou en retard —
// deux postes qui étendent chacun leur table finissent par donner un même numéro à deux produits.
// Son oracle (`oracle-confidentiel.mjs`, dans le dépôt) vérifie qu'il est resté privé et sans secret.
export const CANAL = { nom: "digit-ai-confidentiel", dossier: "_confidentiel", preuve: "tables/produits-pseudonymes.json" };

/**
 * Un dossier de la racine que les BALAYAGES du parc jugent comme un dépôt de l'écosystème : le préfixe
 * d'entrée, MOINS les produits déclarés de l'écosystème (D-5 (a) du 17/09/2026). Un produit qui porte le
 * préfixe n'est pas une forge (TF-1327) ; c'est la lecture que `bootstrap.mjs` applique déjà à son
 * propre balayage, désormais partagée. Le préfixe reste le filtre d'ENTRÉE parce que les bancs de ces
 * balayages jouent des parcs jetables aux forges fictives ; un dossier `digit-ai…` que rien ne déclare
 * est signalé à l'ouverture du poste, qui demande de le déclarer.
 */
export const estDepotEcosysteme = (nom) => /^digit-ai/.test(String(nom)) && !PRODUITS_DE_L_ECOSYSTEME.has(String(nom));
