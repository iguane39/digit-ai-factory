# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=fe04bfbd7bc8 archive=fee5b8362725 · dernier événement: 2026-08-17T09:19:53.961Z -->

**13 actifs** (candidat 13 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **304 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0304 | candidat | 12 | forge-agents : déclarer le câblage de qo-gate-write.mjs dans le settings.json versionné de la forge | **oui** — le gate C7 est mort sur ce poste depuis une date inconnue et AUCUN dépôt ne dit comment le recâbler — la moitié durable du trou que K7 déclare à chaque run |
| TF-0306 | candidat | 8 | forge-agents : _routages-journal.jsonl d'experts-forge est un journal d'exécution TRACKÉ que son self-test salit | **oui** — chaque exécution du self-test crée un diff parasite — le prochain commit pressé l'embarque et le bruit K2 renaît |
| TF-0307 | candidat | 4 | check_html : check_autonomie extrait les <style> sans retirer les commentaires HTML — faux positif A1 latent | **oui** — trois collisions réelles en une seule campagne sur le mécanisme non protégé — la quatrième sera chez un utilisateur |
| TF-0308 | candidat | 4 | forge-agents : 6 gabarits de digit-ai-schemas plus rouges sous les règles TF-0303 — conformité ou exemption déclarée, à trancher | **oui** — des gabarits rouges à l'oracle de leur propre socle fabriquent le bruit permanent que TF-0228 a coûté cher à éteindre |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0313 | candidat | 9 | forge-tests : le pan qualif lit la mire a domcontentloaded — sur une SPA le formulaire n existe pas encore, et le pan conclut qu il n y a pas de mire | **oui** — pan qualif inexploitable sur toute SPA malgre un compte valide : 0 element inventorie contre 91 une fois la session injectee par un autre canal ; le motif publie envoie l operateur corriger une configuration deja correcte |
| TF-0315 | candidat | 9 | forge-tests : champs_requis du pan qualif demande de fournir ce qui est deja fourni — « pas de compte » et « compte fourni, connexion echouee » sont indiscernables | **oui** — le rapport prescrit trois gestes de configuration deja accomplis et tait la cause reelle ; sans lecture du code source du pan, la panne est inattribuable |
| TF-0309 | candidat | 6 | forge-tests : schema_obtenu rend None sans motif propre quand le conteneur manque sur son seul chemin | **oui** — le seul chemin conteneur encore capable de se taire — la maladie que TF-0299 vient d'éradiquer partout ailleurs |
| TF-0312 | candidat | 4.5 | forge-tests : l'écart servi↔versionné compare des espaces de clés différents quand aucune locale n'est déclarée — fausse accusation possible | **oui** — un faux positif sur le contrôle né avant-hier coûterait sa crédibilité avant son premier vrai cas — la maladie documentée par l'étude 20260815e |
| TF-0314 | candidat | 4.5 | forge-tests : la provenance de session du pan qualif est DEDUITE de la configuration et jamais CONSTATEE — le rapport affirme une session qui n existe pas | **oui** — un rapport d audit affirme, en tete de ses declarations, une identite d execution fausse ; deux lignes contradictoires cohabitent dans le meme champ non_juge |
| TF-0316 | candidat | 4.5 | tests : le pan qualif n accepte qu UNE session et son ratio ne declare pas qu un seul role a ete visite | **oui** — verdict 'pan qualif 8/8 ratio 1,00 ZERO finding' du 12/08 lu comme une couverture complete alors que 3 surfaces reservees par role n avaient jamais ete visitees ; ecart decouvert 5 jours plus tard par une question humaine, non par l outil |
| TF-0310 | candidat | 4 | forge-tests : le préfixe de corpus de H-13 (interface:) apparie AUSSI le constat de H-20 — filtrer sur la classe du finding | **oui** — un corpus dont une entrée peut être couverte par le défaut d'une autre mesure moins que ce qu'il affiche |
| TF-0311 | candidat | 4 | forge-tests : deux comptes périmés au README (« 19/19 des défauts », « chacun des 16 défauts plantés ») — le corpus est à 23 | **oui** — un lecteur du README croit à un corpus de 19 quand la recette en mesure 23 — la doc dément l'outil |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0305 | candidat | 3 | oracle-skills : K7 ne vérifie pas qu'une commande câblée pointe un fichier qui EXISTE | **oui** — un câblage vers un chemin mort donne exactement la même assurance qu'un gate câblé, sans en avoir aucune propriété |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
