# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=a1b05c7b7de1 archive=e6a1712ed4d4 · dernier événement: 2026-08-17T10:10:18.711Z -->

**21 actifs** (candidat 21 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **304 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0304 | candidat | 12 | forge-agents : déclarer le câblage de qo-gate-write.mjs dans le settings.json versionné de la forge | **oui** — le gate C7 est mort sur ce poste depuis une date inconnue et AUCUN dépôt ne dit comment le recâbler — la moitié durable du trou que K7 déclare à chaque run |
| TF-0306 | candidat | 8 | forge-agents : _routages-journal.jsonl d'experts-forge est un journal d'exécution TRACKÉ que son self-test salit | **oui** — chaque exécution du self-test crée un diff parasite — le prochain commit pressé l'embarque et le bruit K2 renaît |
| TF-0307 | candidat | 4 | check_html : check_autonomie extrait les <style> sans retirer les commentaires HTML — faux positif A1 latent | **oui** — trois collisions réelles en une seule campagne sur le mécanisme non protégé — la quatrième sera chez un utilisateur |
| TF-0308 | candidat | 4 | forge-agents : 6 gabarits de digit-ai-schemas plus rouges sous les règles TF-0303 — conformité ou exemption déclarée, à trancher | **oui** — des gabarits rouges à l'oracle de leur propre socle fabriquent le bruit permanent que TF-0228 a coûté cher à éteindre |
| TF-0323 | candidat | 4 | Gouvernance de mission absente : ni registre de risques, ni parties prenantes, ni mesures de succès suivies | **oui** — revérifié en session le 16/08 : 0 occurrence de « risque » dans pilote-de-mission v1.0.0, 0 hit « parties prenantes » sur les skills installés — une mission client pilotée par la forge ne produit aucun des trois objets qu'un commanditaire attend en premier en comité de pilotage |
| TF-0324 | candidat | 3 | Artefacts périodiques du run de delivery absents : RAID, rapport d'avancement, compte rendu, REX, suivi des bénéfices | **oui** — revérifié en session le 16/08 : 0 occurrence de RAID / compte rendu / rapport d'avancement / lessons learned sur les skills installés — aucun des cinq artefacts que réclame une mission longue n'a d'équivalent dans la forge |

## digit-ai-forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0321 | candidat | 4.5 | forge-design juge le mouvement mais ne le prescrit jamais — ni token de durée, ni règle d'animation dans la marque et la maquette | **oui** — relevé exécuté le 16/08 sur digit-ai-forge-design : 7 règles de mouvement exécutées et câblées, 0 token de mouvement dans la marque, 0 section mouvement dans DESIGN.md, contrôle reduced-motion en avertissement — la maquette est jugée sur des valeurs jamais prescrites |

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
| TF-0319 | candidat | 4.5 | Tout document destiné à l'utilisateur d'une forge se range dans output\ — jamais dans une arborescence de forge à parcourir | **oui** — constat d'usage humain : les documents qui lui sont destinés vivent dans des arborescences de forge complexes ou imbriquées, qu'il doit parcourir pour les retrouver |
| TF-0320 | candidat | 4 | Un produit qui met ses forges à jour n'apprend rien des règles nouvelles ou modifiées — la mise à jour transporte le code, pas la consigne | non |
| TF-0305 | candidat | 3 | oracle-skills : K7 ne vérifie pas qu'une commande câblée pointe un fichier qui EXISTE | **oui** — un câblage vers un chemin mort donne exactement la même assurance qu'un gate câblé, sans en avoir aucune propriété |
| TF-0318 | candidat | 2.7 | Chaque projet porte SA todo en page HTML — décisions attendues, champs de saisie, et un bouton qui envoie en implémentation | non |
| TF-0322 | candidat | 2.3 | Les conventions de la forge sont gravées, pas paramétrables — l'utilisateur final subit dossiers, nommage, formats de date et de version | **oui** — TF-0165 (13/08) : nommage exigé par un entrant inconciliable avec R-4, aucune règle pour trancher — arbitrage pris en session et consigné au ledger faute de paramètre |
| TF-0317 | candidat | 1 | Renommer le pilot en « factory » — nom cohérent avec ce qu'il fait (mobiliser les forges) et avec sa présentation | non |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
