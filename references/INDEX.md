# Index des références du pilot

Ce fichier est cité par le noyau `CLAUDE.md` et cite à son tour chaque document de `references\` : c'est
par lui que l'oracle du noyau (`oracles\oracle-claude-md.mjs`, règle N3) reconnaît une référence comme
atteignable — une référence absente d'ici et du noyau est orpheline, donc jamais chargée par un run.
Décision humaine D-3 (b) du 03/09/2026 : le noyau est au plafond (N1, 6 144 octets) ; l'index porte
le détail, le noyau ne porte qu'une ligne. **À tenir à jour à chaque référence ajoutée ou retirée** —
l'oracle refuse l'orphelin dans les deux sens (référence sans entrée ici, entrée ici sans fichier).

| Document | Contenu |
|---|---|
| `references\ACCUEIL.md` | Protocole d'accueil : de l'intention de l'utilisateur au run |
| `references\BEST-PRACTICES-HTML.md` | Référentiel de best practices HTML, forge Digit-AI |
| `references\CHAINE-TRADUCTION.md` | Traduire, auditer : deux chaînes déclarées |
| `references\CONVENTION-DEPOTS-MIS-DE-COTE.md` | Un dépôt mis de côté se RENOMME, il ne s'exclut pas |
| `references\CONVENTION-RECETTES.md` | Convention de nommage des recettes de contrôle — où vit la recette de chaque contrôle du pilot |
| `references\CORRESPONDANCE-RENOMMAGE-FACTORY.md` | Table de correspondance §3 bis — renommage `digit-ai-forge-pilot` → `digit-ai-factory` |
| `references\ECRITURE.md` | Écriture : le plancher transverse des textes de la Factory (règles E-1 à E-12, typologie T1-T5, précédence, mesure) |
| `references\tics-redactionnels.json` | Donnée fermée des familles de tournures creuses (seuils de densité, antériorité), jouée par `oracles\oracle-ecriture.mjs` |
| `references\EMPREINTES.md` | Empreintes : un seul format, et un registre qui le fait tenir |
| `references\ETAPES-RUN.md` | Étapes d'un run produit, détail opérationnel |
| `references\GARDE-FOUS-PLATEFORME.json` | Donnée datée et sourcée des garde-fous de plateforme relevés chez les produits, par client sous pseudonyme ; lue avant de concevoir un déploiement (`ETAPE-MEP.md` § 1 ter, porte M-11) et jugée par `scripts\verifier-garde-fous.mjs` |
| `references\INTEGRATIONS-FOURNISSEURS.md` | Faits mesurés sur les interfaces de fournisseurs |
| `references\INTENTION.md` | ISTO, la cascade de l'intention : Intention → Stratégie → Tactique → Opération, et sa déclinaison par phase du développement |
| `references\RELECTURE-INTENTION.md` | Essai de relecture d'intention sur tous les travaux (D-23 (a) du 18/10/2026) : les quatre points de relecture (consigne, fin de tour, réception de chaque livrable d'agent et cohérence d'une campagne, D-47 (a) du 19/10), l'entrée du relecteur, la consigne du relecteur (v1 stricte, v2 du 18/10 par D-26 (a)), la boucle de correction bornée à 2 passes, l'autorité (alerte), les dates et le seuil d'arrêt (4 000 000 de jetons par jour, D-25) ; outil `scripts\relecture-intention.mjs` |
| `references\RELECTURE-INTENTION-REGLES.json` | Règles de la Factory applicables à chaque type de travail, données au relecteur d'intention avec la demande (D-26 (a) du 18/10/2026) : une phrase, une source rejouée par la recette, le fait fondateur ; datées et sourcées (loi n° 4) |
| `references\JETON-ABONNEMENT.md` | Fiche datée du jeton d'abonnement `claude setup-token` pour les tâches sans écran : commande, variable, priorité des identifiants, `--bare`, trois réserves contractuelles, état de R-34 ; consigné, non adopté, revue le 2026-11-19 (TF-1921, D-48 (a) du 19/10/2026) |
| `references\MODELES-EN-SERVICE.json` | Donnée datée et sourcée de la génération de modèles en service, une version par famille, et du re-test de la règle de challenge qu'une nouvelle version déclenche ; jouée à chaque ouverture par `oracles\oracle-modeles-en-service.mjs` (D-1 (a) du 25/09/2026) |
| `references\PARALLELISME-CLAUDE-CODE.md` | Fonctions officielles de parallélisme de Claude Code (sous-agents, équipes, workflows, sessions cloud, routines, Projects), datées et sourcées, avec la décision « Projects non adopté » et ses conditions de reprise (TF-1928, D-48 (a) du 19/10/2026) |
| `references\PASSERELLES-ENCAISSEMENT.json` | Donnée datée des noms d'hôte de passerelles de paiement et de réservation, et du vocabulaire d'un parcours qui engage l'utilisateur ; lue par `scripts\verifier-parcours-tiers.mjs` (porte M-14, `ETAPE-MEP.md` § 3 undecies) |
| `references\PATRONS-EPROUVES.md` | Patrons éprouvés : mécanismes payés une fois, réutilisables tels quels |
| `references\PERMISSIONS-GRAPH.json` | Table officielle datée des permissions Microsoft Graph et de leurs identifiants, relevée sur la page publiée de la documentation ; lue hors ligne par `scripts\verifier-droits-accordes.mjs` (porte M-12), rafraîchie par son option `--rafraichir` |
| `references\PLATEFORME-LINKEDIN.md` | Plateforme LinkedIn — règles datées (contrat, accès aux chiffres, transparence, portée), péremption déclarée |
| `references\PLATEFORMES-RESEAUX.md` | Plateformes de réseaux sociaux — 9 réseaux, 5 faits chacun (publier, programmer, exporter, déclarer un contenu généré, automatisation), solidité ligne à ligne, péremption déclarée |
| `references\PRODUCTION-OOXML.md` | Production d'un document OOXML depuis une référence client — relevé de charte et gates |
| `references\PRODUITS.md` | Référentiel déclaré des produits suivis — pseudonymes, faits du registre, état déclaré ; compte jugé par `oracle-fraicheur-doc` (TF-1313) |
| `references\REGLES-DE-NON-REPETITION.md` | Règles de non-répétition |
| `references\RUN-AO.md` | Run de réponse à appel d'offres — quand le livrable est une offre à échéance, construite sur des documents tiers |
| `references\RUN-CONSEIL.md` | Run de conseil — quand le livrable est une trajectoire, pas un logiciel ni un seul document |
| `references\RUN-MANDAT.md` | Run de mandat transverse — quand le livrable est un document, pas un logiciel |
| `references\RUN-RESEAU.md` | Run d'animation de réseau — quand le livrable est une présence tenue chaque semaine, pas un document ni une offre |
| `references\RUN-VERSION.md` | Run de version (produit existant), détail opérationnel |
| `references\SEO-RECHERCHE.md` | Expertise SEO : données de recherche multilingues |
| `references\TODO-FORGE.md` | TODO-FORGE : registre des améliorations, mode opératoire |
