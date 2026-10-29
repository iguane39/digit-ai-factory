---
destinataire: humain
---

# Synthèse Mandat — retours du jour ingérés, 19 sujets du registre clos (29/10/2026)

## 0. Synthèse d'ouverture

Le lot de retours arrivé ce matin est traité, et le registre a fondu : 19 sujets sont clos, dont les 4 retours du jour. Votre demande répétée 2 fois est en place : la synthèse d'ouverture d'une restitution se termine désormais par une ligne « Livré : » qui pointe vers chaque fichier produit, avec un lien qui s'ouvre d'un clic. Le contrôle de fin de tour la signale quand elle manque, sans bloquer pour l'instant. Plusieurs faux refus d'outils qui coûtaient des allers-retours aux produits sont corrigés, et le faux constat « 4 identifiants à changer » ne reviendra plus à l'ouverture. Il reste 38 candidats, que je reprends à la session suivante. Une seule décision vous revient : la suite de l'essai du relecteur neuf, qui dépense des jetons au-delà du budget accordé.

## 1. En-tête d'identification

Exécution de votre demande « Traite les retours et les TODOs » du 29/10/2026, sur le pilot `digit-ai-factory`, forge-conception, forge-agents, forge-design et le canal confidentiel. Période : 29/10/2026 de 14:51 à 16:17, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 1 agent de campagne (Sonnet 5.5) et 1 relecteur d'intention.

Intention de la demande : vider la boîte des retours et faire avancer le registre des améliorations, en exécutant tout ce qui ne vous revient pas.

Test rétro : le résultat sert cette intention. Le sas est vide, chaque sujet clos porte sa recette rejouée rouge puis verte, et la seule question posée relève d'une dépense.

## 2. Verdict

19 sujets clos au registre, chacun avec sa recette rejouée par la session ; `oracle-todo` rend PASS après chacune des 14 écritures ; 3 forges publiées, 0 commit en avance après vérification.

## 3. Décisions attendues

> **D-92 — Faut-il lancer l'essai à deux lecteurs d'accord du lecteur neuf de la restitution, pour environ 2 millions de jetons au-delà du budget déjà accordé ?**
>
> - **De quoi s'agit-il** : le relecteur neuf qui lirait chaque restitution comme vous, avant l'affichage, et signalerait une demande que le message seul ne permet pas de tenir (comptage `scripts/compter-lecture-usage.mjs`).
> - **Le problème** : avec un seul lecteur, il voit 4 messages gênants sur 6, mais il en signale à tort 9 sur 27. Cette suite vous a été posée le 26/10 sous le numéro D-85, jamais tranchée, et ce numéro a été frappé 2 fois ce jour-là, un sur chaque poste.
> - **Pourquoi vous** : c'est une dépense de jetons au-delà du budget accordé, 1 985 931 jetons déjà consommés sur 0,7 à 2,1 millions.
> - **Recommandation : (b)** — relire d'abord les 9 signalements dira s'ils sont faux ou s'ils révèlent un vrai défaut, pour quelques dizaines de milliers de jetons. Les réponses du lecteur ne sont pas dans le canal confidentiel de ce poste : cette relecture se fait sur l'autre poste. Source consultée : le pré-enregistrement `references/LECTURE-USAGE-PREENREGISTREMENT-20261026.md` et la note de l'essai au registre, relue le 29/10/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lancer l'essai à deux lecteurs | 33 nouvelles lectures ; un message n'est signalé que si les deux lecteurs s'accordent ; les chiffres vous reviennent | Simple × court, environ 2 millions de jetons | Sans objet : rien n'est mis en service |
| (b) *(recommandée)* Relire d'abord les 9 signalements | La session de l'autre poste classe chacun en vrai défaut ou faux signalement, ligne citée, sans nouvelle lecture ; la suite vous est reposée avec ce classement | Simple × court, quelques dizaines de milliers de jetons | Sans objet |
| (c) Arrêter l'essai | Le relecteur neuf n'entre pas en service ; seule la règle du lien vers le contenu juge l'usage du message | Nul | Possible : l'essai se relance sur le même banc |

> **Sans réponse** : (c), arrêter l'essai.

## 4. Traité

Le tour a d'abord vidé le sas, puis traité le registre par ordre de coût, en décidant par R-58 (la règle qui réserve à l'humain la dépense, la publication, l'irréversible, la doctrine, l'arbitrage et le produit) chaque correctif qui ne vous revenait pas.

- **Lot de retours de Produit-84 du 29/10** : accueilli, pseudonymisé et ingéré, TF-2016 à TF-2019 ; oracle du lot PASS sur 11 règles.
- **Votre demande sur la ligne « Livré : »** (TF-1973 et TF-2016, la même demande les 20 et 29/10) : règle S87 (la ligne « Livré : » qui clôt le bloc 0) au gabarit de restitution 2.53.0, contrôle avertissant au hook de fin de tour, contrat d'héritage 1.42.0. Construit par l'agent (commit 50d916f6), fusionné par la session ; recettes rejouées sur l'arbre fusionné : hook de restitution 61/61, `oracle-synthese` 257/257, relais des produits 30/30. Sur 1 483 tours du poste, 78 auraient été signalés.
- **Écrivains de trace des produits** :
  - `gabarits/ledger.py` accepte les 4 rectifications que les oracles prescrivent et le feu vert de publication, et écrit nombres et booléens dans le type que les juges lisent (TF-2018, TF-1990) ; recette 28/28, 6 cas rouges sur l'ancien gabarit ;
  - `scripts/mobiliser.mjs` lit la demande écrite dans le fichier de verdicts (TF-2017) ; recette 12/12, 2 rouges avant ;
  - la réservation d'un numéro de décision ne reprend plus un numéro déjà affiché dans une restitution (TF-1961) ; recette 109/109, rouge avant.
- **Faux refus et faux constats** :
  - le hook d'identité sortante ne juge plus que la requête, pas le commit local chaîné avant (TF-1978) ; recette 12/12, 2 rouges avant ;
  - le constat des secrets dit « contenu non jugé » et se qualifie par l'empreinte git du fichier publié ; 4 porteurs revérifiés sans afficher de valeur, qualifiés au canal confidentiel (TF-1993) ; recette 17/17, 3 rouges avant ; sur le parc réel, ce constat passe de FAIL à PASS ;
  - `oracle-ecriture` admet un titre imposé par un contrat quand l'en-tête le déclare (TF-1974), signale deux « $ » sur une ligne rendus en formule (TF-1977), et juge la concision d'une proposition commerciale sans en-tête (TF-1976) ; self-test 76/76.
- **Contrôles neufs** :
  - `oracle-catalogues` vérifie qu'un script cité en point d'entrée existe ; 2 points d'entrée cassés réparés (TF-2015) ; self-test 9/9 ;
  - forge-design refuse un octet de contrôle dans une page ou sa feuille de style (TF-1980, commit a5e5143) ; 5 vérifications vertes ;
  - forge-conception nomme le dossier `forge/etapes/conception/` dans ses 4 skills (TF-2019, commit 8bfc856) ; self-test vert ;
  - le skill L99 type son rapport « Revue » (TF-1975, commit e7eefaa) ; recette verte.
- **Sujets construits le 26/10 sans clôture au registre** : TF-1958, TF-1959 et TF-1960, recettes rejouées ce jour (23/23, 74/74, 69/69 puis 76/76) ; TF-1989 corrigé depuis le 26/10.
- **Registre remis d'aplomb** : 9 attentes corrigées (TF-1911, TF-1913 et TF-1949 à l'échéance de leur mesure ; TF-1914 et TF-1939 rattachés à TF-1911 qui les couvre ; TF-1948, TF-1950 et TF-1944 sur ce qui les retient) ; 8 classes de défaut créées, référentiel en 1.53.0 ; TF-2020 proposé (un titre numéroté échappe à la règle des titres, 51 titres dans le pilot).
- **Publication** : forge-conception, forge-agents et forge-design poussées sous le GO permanent des forges (D-53 (b) du 03/10), le canal confidentiel aussi ; le pilot sous le sien (D-54 (b) du 03/10).

Relecture d'intention : sert, gravité aucune, verdict consigné sous RI-20261029-06.

## 5. Non traité

- 38 candidats du registre restent sans fiche de décision, dont 10 défauts du socle HTML et 9 constructions issues de l'étude Cloudflare, GitHub et Supabase — motif : `borne_atteinte`, repris à la session suivante par R-58.
- Armement de S87 en bloquant, proposé par l'agent pour le 06/11 après une semaine d'avertissement — motif : `decision`, à poser à la revue hebdomadaire du 05/11 avec la mesure.
- Quatre livrables du pilot du 28/10 partagent l'indice « 20261028a », publiés et déjà cités par le registre — motif : `hors_mandat`, les renommer fausserait ces citations.
- Recette d'ensemble du pilot : 3 défauts sur 237 relevés par l'agent (banc de mutation à 90 %, compte des produits 31 contre 32, rendu des instances) — motif : `hors_perimetre`, présents avant ce tour d'après sa preuve rejouée.

## 7. Risques

- **Numéro frappé 2 fois entre postes** : TF-2020 et D-92 ont été frappés ici pendant que l'autre poste peut en frapper autant.
  - Signal : `git fetch` montre un `TF-2020` ou un D-92 distant d'une autre question.
  - Parade : renuméroter la version locale par `todo/renumeroter.mjs` avant la fusion.
- **Antislash mangé par le shell** : la fixture verte de forge-design, écrite par une commande, a reçu l'octet 0x15 à la place de « \25F7 » ; le contrôle neuf l'a refusée.
  - Signal : un octet de contrôle dans un fichier écrit par commande.
  - Parade : écrire les fichiers avec l'outil d'écriture, jamais par une commande en ligne.

## 8. Prochaines actions

Ordre : la décision d'abord, la reprise du registre ensuite, car elle n'en dépend pas.

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | D-92 | manuelle_utilisateur | `decision` : dépense de jetons au-delà du budget | répondre « 92a », « 92b » ou « 92c » | si rien n'est fait, l'essai s'arrête et le relecteur neuf n'entre pas en service |
| A-2 | registre | auto_ia | `borne_atteinte` : 38 candidats restants | `node todo/generer-vue.mjs`, puis un correctif par candidat, décidé par R-58 | si rien n'est fait, les défauts signalés par les produits continuent de leur coûter des allers-retours |

## 9. Traces

- Lot reçu : `input/00-retours/Produit-84 - RETOURS - 20261029a.md` et son sidecar.
- Registre : `todo/TODO.jsonl`, 14 écritures par `todo/journaliser.mjs` ; classes `todo/CLASSES.json` 1.53.0 ; relecture RI-20261029-06 dans `todo/relectures-intention.jsonl`.
- Pilot : commits 78ab79b7 à 4d74eafe, dont la fusion de la campagne S87 (50d916f6).
- Forges : forge-conception 8bfc856, forge-agents e7eefaa, forge-design a5e5143 ; canal confidentiel 7574a83.
- Décisions réservées : D-92, posée ici ; D-93, réservée pour une question sur la campagne puis non posée, la reprise du registre ne relevant pas de vous.
