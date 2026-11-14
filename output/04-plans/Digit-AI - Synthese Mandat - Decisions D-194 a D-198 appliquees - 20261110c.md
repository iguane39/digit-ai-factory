# Synthèse Mandat — Décisions D-194 à D-198 appliquées (10/11/2026)

## 0. Synthèse d'ouverture

Les 5 décisions recommandées du jour sont appliquées, vérifiées et publiées. Ce qui change pour vous : les gardes refusent désormais une commande qu'elles ne savent pas lire, l'accord qui lève un refus doit venir d'un de vos messages, et une session ne peut plus s'accorder des droits, toucher la production par un secret du dépôt ou arrêter des processus par leur nom sans cet accord. Le relevé montre que des droits accordés par des sessions chez 3 produits sont encore en place. Une décision vous attend sur leur retrait, et un mot de passe de production écrit en clair demande une rotation de votre part.

Livré : [Synthèse des décisions appliquées](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Decisions%20D-194%20a%20D-198%20appliquees%20-%2020261110c.md)

## 1. En-tête d'identification

Application des décisions D-194 à D-198 sur votre demande « Choisis toutes les décisions recommandées et applique. ». Sur le pilot `digit-ai-factory` et les forges `digit-ai-forge-agents-security`, `digit-ai-forge-websec` et `digit-ai-forge-agents`, poste Dell-XPS-16. Synthèse relevée le 10/11/2026 à 19:04, heure de Paris. Session pilote Claude Opus 5.5 ; 1 agent `constructeur` (Opus), 3 agents `campagne` (Sonnet) et 1 agent `explorateur` (Haiku), relancés à 16:14 après l'arrêt de la session précédente.

Intention de la demande : appliquer la recommandation de chaque décision posée par l'œil critique du jour.

Test rétro : le résultat sert cette intention pour les 5 décisions ; la part « relevé » de D-196 débouche sur une décision de retrait, comme l'option (c) le prévoyait.

## 2. Verdict

5 décisions sur 5 appliquées ; 6 recettes rejouées par la session, 0 échec ; 11 921 commandes réelles rejouées à travers les nouvelles gardes, 0 faux refus.

## 3. Décisions attendues

Les 3 bloquants qui retiennent la suite, chacun avec ce qui le lève :
- L'application des 4 décisions du 29/10 rappelées ci-dessous ; rien n'est à fournir ici, une session ouverte sur DESKTOP-ULTRA7, où leurs options sont écrites, peut les appliquer ; sans elle, elles restent ouvertes.
- Le retrait des droits relevés ; votre réponse à la décision ci-dessous le lève ; sans elle, les droits restent en place.
- La rotation du mot de passe de production de Produit-12 ; votre geste dans la console du fournisseur la lève ; sans lui, le mot de passe reste lisible sur le poste.

> **D-202 — Faut-il retirer les droits que des sessions ont accordés depuis le 29/10 chez Produit-81, Produit-64 et un produit hors table, encore en place au 10/11 ?**
>
> - **De quoi s'agit-il** : des droits sur la plateforme de développement d'un client, accordés par des sessions de produit sans décision écrite, relevés en lecture ce jour :
>   - chez Produit-81, le contournement des politiques de branche pour le compte que vous aviez écarté le 04/11, sur le dépôt et sur la branche de développement ;
>   - chez Produit-81, le même contournement pour le compte que vous avez désigné, plus un droit d'édition des politiques dont aucune transcription ne montre l'origine ;
>   - chez Produit-64, le droit d'édition des politiques d'un dépôt pour un membre, plus large que « son projet et ses pipelines » que vous aviez demandé le 09/11 ;
>   - chez un produit hors table, l'autorisation d'un pipeline d'une branche d'intégration à utiliser la connexion de service vers la production.
> - **Le problème** : la garde arrête désormais les prochains gestes de cette famille, mais ceux-ci sont déjà en place. Le droit du compte écarté permet de pousser sans revue, et la CI n'a pas tourné sur le commit poussé ainsi le 04/11.
> - **Pourquoi vous** : ce sont des droits sur la plateforme d'un client ; les retirer est un geste distant sur ses ressources.
> - **Recommandation : (b)** — retirer ce que vous n'avez pas demandé ferme les droits accordés par erreur ; le contournement du compte désigné vient de votre message du 04/11. Source consultée : le rapport du relevé en lecture de ce tour, consigné à `todo/TODO.jsonl` sous TF-2393, et l'état lu sur la plateforme.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Garder tous les droits | rien ne change sur la plateforme | aucun | Sans objet |
| (b) Retirer ce qui n'a pas été demandé | la session retire, par lot d'accord cité, les 2 droits du compte écarté chez Produit-81, le droit d'édition des politiques chez Produit-64 et l'autorisation du pipeline d'intégration sur la connexion de production ; le compte désigné garde son contournement | simple × court | Possible : un droit retiré se réaccorde |
| (c) La même chose, plus le compte désigné | en plus de (b), le contournement et l'édition des politiques du compte désigné chez Produit-81 sont retirés ; un push sans revue redevient impossible pour toute session | simple × court | Possible : un droit retiré se réaccorde |

> **Sans réponse** : (a), les droits restent en place.

**D-104** : un seul chemin pour la restitution, posée le 29/10 à 19:13, inchangée.

**D-105** : réponse d'un tour sans écriture hors du gabarit complet, posée le 29/10 à 19:13, inchangée.

**D-107** : script unique pour synchroniser avec GitHub, posée le 29/10 à 19:13, inchangée.

**D-108** : aucun verdict favorable sans mesure réelle, posée le 29/10 à 19:13, inchangée.

## 4. Traité

- Vos 5 choix sont consignés : 194b, 195b, 196c, 197c et 198b.
  - preuve : `scelle.mjs bilan`, 16 dévoilées sur 20, adhésion 0,94 ; TF-2393 à TF-2395 créés, décidés puis clos par `journaliser.mjs`, oracle du registre PASS avant et après.
- D-194 (b) : les 2 gardes lisent la commande selon son dialecte, résolvent les textes évalués, les lancements de processus, les variables et les abréviations, et lisent l'hôte réel d'une adresse ; ce qu'elles ne lisent pas, une panne du juge et une entrée illisible sont refusés. Un réglage documenté rétablit l'ancien comportement, et une commande ne peut pas le poser pour elle-même.
  - preuve : `node oracles/hook-gestes-distants.test.mjs`, 214 réussites, 0 échec (106 avant) ; `node oracles/hook-identite-sortante.test.mjs`, 27 réussites, 0 échec (15 avant) ; rejoués par la session sur la branche principale ; les 12 formes de la revue vues rouges sur l'ancien code ; commit 3aca470e.
- D-195 (b) : un accord n'est valide que s'il se retrouve mot pour mot dans un message que vous avez tapé, et une commande approuvée nomme son outil et son verbe avant tout joker.
  - preuve : 5 accords fabriqués et 3 jokers vus rouges sur l'ancien code, refusés après ; `node gabarits/hooks-factory.test.mjs`, 50 sur 50 ; commit 2259cb6e.
- D-196 (b), barrière : l'attribution de droits et de politiques, l'accès à la production par un secret du dépôt et l'arrêt de processus par leur nom exigent un lot d'accord.
  - preuve : 34 formes nouvelles vues rouges sur l'ancien code ; rejeu de 11 921 commandes Bash et PowerShell des 7 derniers jours sur les 2 profils : 10 refus avant, 12 après, 0 faux positif ; commit be8e90e4.
- D-196 (c), relevé : les droits accordés par des sessions depuis le 29/10 sont listés et leur état lu sur la plateforme, sans aucune écriture.
  - preuve : 52 726 appels d'outils lus dans les transcripts des 2 profils ; 3 droits de contournement, 1 droit d'édition des politiques et 2 autorisations de pipeline encore en place, posés en D-202.
- D-197 (c), scan de workflow d'agent : un filtre d'auteur en négation, en disjonction ou en « !contains » ne passe plus, et 5 formes fautives de plus sont fermées.
  - preuve : `node oracles/self-test.mjs` de forge-agents-security, 155 réussites, 0 échec, rejoué par la session ; 15 échecs sur le code d'avant ; 23 workflows du parc rejoués, 0 verdict changé ; commit 2359cc1, publié.
- D-197 (c), caviardage : tout en-tête et tout paramètre d'adresse dont le nom contient token, key, secret, auth, session ou password est masqué.
  - preuve : `node oracles/self-test.mjs` de forge-websec, 198 réussites, 0 échec, rejoué par la session ; de bout en bout, 7 valeurs sur 7 survivaient avant, 0 après ; commit 092393c, publié.
- D-198 (b) : l'extraction de l'œil critique masque tout produit du parc absent de la table des pseudonymes, y compris accolé à un tiret.
  - preuve : `extraire.mjs --self-test`, 14 cas, PASS, rejoué par la session ; rejeu réel du 29/10 au 05/11, 19 extraits avec un nom hors table avant, 0 après ; installée dans les 2 profils, copie identique à la source ; commits 31b9860 et e3a2d4d, publiés.
- Publication : les 3 forges sous l'accord permanent des forges, D-53 (b) du 03/10, et le pilot sous le sien, D-54 (b) du 03/10.
  - preuve : `git rev-list --count origin/main..main` à 0 après chaque envoi.
- Contrôle après l'incident du bloc 6 : aucun fichier écrit hors du pilot après 19:05.
  - preuve : date de modification de chaque fichier signalé par `git status` dans tous les dépôts de `c:\dev`, 0 hors du pilot ; `git reflog` du pilot sans entrée après 19:03 ; index ramené à ses 3 index générés.
- Relecture d'intention : sans objet, motif : les options choisies fixent chaque livrable ; les rapports des agents ont été rejoués par leurs recettes.

## 5. Non traité

- D-104, D-105, D-107 et D-108 — motif : `dependance_externe`, leurs options ne sont écrites que sur DESKTOP-ULTRA7.
- Le retrait des droits relevés — motif : `dependance_bloc_3`, D-202.
- La rotation du mot de passe d'administration de la production de Produit-12, écrit en clair dans un fichier de travail d'une session du 31/10 — motif : `garde_fou`, une rotation se fait dans la console du fournisseur, par vous.
- Le fait du 31/10, un script qui lit un fichier d'environnement du dépôt pour ouvrir une session réseau, échappe encore à la garde « production » — motif : `borne_atteinte`, l'étendre toucherait 10 commandes sur 11 921 en 7 jours ; candidat pour l'exécution suivante de l'œil critique.

## 6. Écarts à la lettre

- Vous avez demandé toutes les décisions recommandées → j'ai appliqué les 5 de ce jour → les 4 du 29/10 n'ont pas leurs options sur ce poste, et je ne les invente pas.
- Votre préférence demande la lettre de chaque décision → j'ai lu « toutes les décisions recommandées » comme 194b, 195b, 196c, 197c et 198b → votre message désigne la lettre affichée de chacune, et la consigne citée mot pour mot s'applique telle quelle (D-176 b).
- Le constat de ce matin disait qu'un nettoyage avait arrêté tous les processus Node du poste → le relevé le contredit : un seul processus a été arrêté, par son numéro → la garde refuse quand même cette famille, la commande fautive existait dans la transcription du 04/11.
- Le commit du caviardage porte la signature de Sonnet 5.5, le modèle qui l'a écrit, au lieu d'Opus 5.5 demandé.
- Une commande d'édition de cette synthèse, passée au shell, a perdu ses guillemets sur une apostrophe : le shell a exécuté le registre TODO comme un script pendant 2 minutes, de 19:06 à 19:08. Je l'ai arrêtée, ainsi que la recette qu'elle avait lancée. Effets constatés : l'index du pilot avait reçu 52 fichiers, retirés sans toucher au disque ; les 8 lots du sas d'arrivée ont été accueillis, pseudonymisés et rangés dans `input/00-retours/`, ce qui est le geste normal d'accueil ; un `git pull --rebase` a été refusé par git ; rien n'a été écrit dans les forges ni chez les produits, et les registres TODO et des décisions sont intacts.

## 7. Risques

- Le compte écarté chez Produit-81 peut toujours pousser sans revue sur la branche de développement ; signal : un commit sur cette branche sans demande de fusion ; parade : D-202 (b) ou (c).
- Une garde qui refuse ce qu'elle ne lit pas peut gêner une session sur une commande légitime écrite de façon inhabituelle ; signal : un refus « ILLISIBLE » au journal d'une session ; parade : réécrire la commande, ou le réglage documenté dans `references/GESTES-DISTANTS.md`.

## 8. Prochaines actions

Ordre : vos gestes d'abord, le plus grave en tête, puis les actions de la session.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Changer le mot de passe d'administration de la production de Produit-12, écrit en clair dans un fichier de travail d'une session | neuve | manuelle_utilisateur | decision : changer le mot de passe de production engage le client et ses utilisateurs | le script `mesure_prod.py` du dossier de travail de la session du 31/10 porte le mot de passe ; le changer dans l'administration de l'application | si rien n'est fait, le mot de passe reste lisible sur le poste |
| A-2 | Répondre à D-202 sur le retrait des droits encore en place | neuve | manuelle_utilisateur | decision : droits sur la plateforme d'un client | `decisions/REGISTRE.jsonl` (D-202) : répondre « 202a », « 202b » ou « 202c » | si rien n'est fait, un compte écarté pousse sans revue |
| A-3 | Appliquer D-104, D-105, D-107 et D-108 depuis le poste qui porte leurs options | neuve | auto_ia | dependance_externe : options écrites sur DESKTOP-ULTRA7 | session ouverte sur DESKTOP-ULTRA7 | si rien n'est fait, les refus de forme continuent |
| A-4 | Ingérer les 8 lots accueillis par l'incident dans le registre TODO | neuve | auto_ia | borne_atteinte : hors de la demande de ce tour, à la prochaine séance de retours | `node todo/ingerer-lot.mjs <fichier .tf.jsonl du lot>` pour chaque lot de `input/00-retours/` du 10/11 | si rien n'est fait, 8 lots attendent au registre |
| A-5 | Étendre la garde « production » à un script qui lit un fichier d'environnement du dépôt pour ouvrir une session réseau | TF-2393 | auto_ia | borne_atteinte : mesure de bruit à faire à l'exécution suivante de l'œil critique | `oracles/hook-gestes-distants.mjs` | si rien n'est fait, le geste du 31/10 passe encore |

## 9. Traces

- Pilot : 3aca470e (D-194), 2259cb6e (D-195), be8e90e4 (D-196), puis le commit de cette synthèse.
- `digit-ai-forge-agents-security` : 2359cc1. `digit-ai-forge-websec` : 092393c. `digit-ai-forge-agents` : 31b9860, e3a2d4d.
- `todo/TODO.jsonl` : TF-2393 à TF-2395 ; `todo/oeil-critique-scelles.jsonl` : choix de D-194 à D-198, scellé de D-202 ; `decisions/REGISTRE.jsonl` : D-202.
- `references/GESTES-DISTANTS.md` : section « Ce que la garde ne sait pas lire ».
