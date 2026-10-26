# Revue hebdomadaire des propositions — 2026-10-26

4 proposition(s) vous reviennent cette semaine, classées par valeur au registre. Chacune dit de quoi il s'agit, le problème et pourquoi il vous revient, puis ses 3 options : ce qui se passe après chaque choix, son coût en complexité et durée, et si l'on peut revenir en arrière.

Pour répondre, une ligne suffit, par exemple : « D-81 a, D-82 a, D-83 a, D-84 a ». Une décision sans réponse prend son option (c).

> **D-81 — La règle qui refuse une page dont le contenu occupe moins de 75 % de la fenêtre, publiée par erreur en blocage le 26/10, doit-elle avertir jusqu’à une date, rester bloquante, ou revenir en simple avertissement en attendant ? (TF-1945)**
>
> - **De quoi s'agit-il** : la nouvelle règle du contrôle de rendu des pages : un contenu principal plus étroit que 75 % de la fenêtre, aux largeurs de bureau, est refusé.
> - **Le problème** : elle accuse 6 pages livrables sur 54 au pilot (dont 2 gabarits du guide de référence à 69 %) et 42 fixtures sur 412 ; la synchronisation du 26/10 au soir l’a publiée bloquante, sans échéance, alors qu’elle attendait cette décision : chaque produit la reçoit à sa prochaine ouverture.
> - **Pourquoi vous** : le registre des échéances du socle n'admet une période d'avertissement que sur décision humaine écrite.
> - **Recommandation : (a)** — c’était déjà la recommandation avant la publication, et elle répare l’effet de la publication sans refuser de page déjà livrée. Source consultée : rapport de l'agent forge-agents du 21/10/2026, digit-ai-page-html references/echeances.json (règle d'admission) ; publication forge-agents 97c276a..bc2658a du 26/10/2026, render_page.py ligne 3086 (V23 « bloquant »).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Avertir jusqu’au 04/11/2026, puis bloquer | Une échéance datée est inscrite au registre des échéances du socle et la forge est republiée ; les pages accusées sont signalées sans être refusées, se corrigent au fil des tours, et la règle bloque d’elle-même à la date | Simple × court | Possible : la date se décale dans le registre, sans code |
| (b) Laisser la règle bloquante, comme publiée | Rien ne change ; les 6 pages du pilot et toute page de produit sous 75 % sont refusées à leur prochain rendu | Nul, puis des corrections de pages imprévues | Possible : republier avec une échéance |
| (c) Revenir en simple avertissement, sans date, jusqu’à votre réponse | La règle est ramenée en avertissement sans date de blocage et la forge est republiée : les produits sont dans l’état d’avant la publication, à l’alerte près ; les 4 autres corrections du socle restent publiées | Simple × court | Possible : une échéance s’ajoute à tout moment |

> **Sans réponse** : (c), revenir en simple avertissement, sans date, jusqu’à votre réponse.

> **D-82 — La critique d'implémentation doit-elle être exigée d'office avant la fin de tout tour qui modifie une page servie ? (TF-1913)**
>
> - **De quoi s'agit-il** : la critique d'implémentation des pages (forge-design), aujourd'hui jouée sur demande ou quand une page est citée comme livrée.
> - **Le problème** : le 18/10, une refonte de page a été proposée à la mise en ligne avec l'option « faire juger le rendu par la critique » ; jouée ensuite, elle a trouvé 4 défauts réels (texte rogné : 554 constats, contraste 2,29:1, bouton sans intitulé) que 147 contrôles du site ne voyaient pas. Votre réponse : « Je ne dois pas avoir à la valider manuellement. Elle doit être faite automatiquement. ».
> - **Pourquoi vous** : rendre la critique obligatoire ajoute plusieurs minutes et des jetons à chaque tour qui touche une page, chez tous les produits.
> - **Recommandation : (a)** — elle tient votre consigne (aucune validation manuelle) au moindre coût, et la période d'avertissement mesure les faux positifs avant de bloquer. Source consultée : lot Produit-02 - RETOURS - 20261018 (RT-130), réponse humaine du 18/10/2026.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Exigée par le contrôle de fin de tour | Un tour qui a modifié un fichier servi (HTML, CSS, JS) sans verdict de critique daté du tour est signalé pendant 7 jours, puis refusé ; la session la joue d'elle-même, vous ne la validez jamais | Simple × court | Possible : repasser en avertissement |
| (b) Lancée automatiquement en arrière-plan | Un hook lance la critique dès qu'une page servie est écrite et joint son verdict à la restitution ; plus confortable, mais à construire et plus coûteux à chaque écriture | Complexe × moyen | Possible : retirer le hook |
| (c) Garder la règle actuelle | La critique reste jouée quand une page est citée comme livrée ; une page modifiée sans être citée peut partir sans critique | Nul | Sans objet |

> **Sans réponse** : (c), garder la règle actuelle.

> **D-83 — Comment faut-il réserver un numéro de décision pour que deux sessions ou deux arbres de travail d'un même produit ne prennent plus le même ? (TF-1911)**
>
> - **De quoi s'agit-il** : la réservation des numéros de décision D-N chez un produit, aujourd'hui écrite au journal du dossier où tourne la session.
> - **Le problème** : 3 collisions en 24 h chez un même produit (D-155, D-156, D-159, les 18 et 19/10) : chaque arbre de travail a son propre journal, une réservation faite dans l'un est invisible des autres, et l'humain a répondu « 159a » à deux questions différentes.
> - **Pourquoi vous** : le choix fixe où vit la vérité des numéros pour toutes les sessions de tous les produits, et l'option la plus complète suppose une publication à chaque réservation.
> - **Recommandation : (a)** — les 3 collisions mesurées ont toutes eu lieu sur un même poste, entre arbres de travail ; (a) les supprime sans publication. Source consultée : lots Produit-02 - RETOURS - 20261019a (RT-137), 20261018 (RT-131) et 20261019c (RT-139) ; oracles/lib-decisions.mjs reserverChezProduit, qui écrit au journal du dossier courant.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Un registre commun par produit et par poste | La réservation s'écrit sous verrou dans un fichier partagé par tous les arbres de travail du même dépôt sur ce poste (rangé dans le dossier git commun, jamais versionné), et le contrôle de fin de tour refuse un numéro déjà pris là ; ne couvre pas deux postes différents | Moyen × court | Possible : retour au journal local |
| (b) Une réservation publiée sur le dépôt distant | Chaque réservation est poussée sur le dépôt distant avant d'être affichée ; couvre aussi deux postes, mais chaque question posée devient une publication, soumise à votre feu vert | Complexe × moyen | Possible, publications déjà faites conservées |
| (c) Ne rien changer | L'avertissement actuel reste ; les collisions continuent au rythme mesuré, et une réponse peut trancher la mauvaise question | Nul | Sans objet |

> **Sans réponse** : (c), ne rien changer.

> **D-84 — Faut-il essayer, hors service et sur le banc, un relecteur neuf qui lit chaque restitution comme son lecteur avant l'affichage ? (TF-1944)**
>
> - **De quoi s'agit-il** : un agent sans le contexte de la session qui relit la restitution avant affichage et dit si chaque demande peut être tenue avec ce seul message.
> - **Le problème** : le 19/10, deux restitutions jugées affichables vous demandaient un avis sans le contenu ; une règle mécanique ferme ce cas précis (S83), un lecteur neuf viserait les cas qu'aucune règle n'a prévus, pour 0,7 à 2,1 millions de jetons d'essai.
> - **Pourquoi vous** : c'est une dépense de jetons, d'abord pour l'essai, puis chaque jour si le relecteur entre en service.
> - **Recommandation : (a)** — l'étude ne mesure ni le rappel ni les faux signalements d'un lecteur neuf ; l'essai les mesure avant toute dépense quotidienne. Source consultée : étude output/03-etudes/20261021-etude-opportunite-relecteur-de-bon-sens-restitution.md.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Essai hors service sur le banc | Le relecteur rejoue les restitutions du banc avec des seuils écrits d'avance ; rien ne change pour vos sessions ; la mise en service vous sera reposée avec les chiffres | Moyen × court, 0,7 à 2,1 millions de jetons une fois | Sans objet : rien n'est mis en service |
| (b) Mise en service directe en avertissement | Chaque restitution est relue avant affichage ; ses alertes s'ajoutent à celles des contrôles, sans bloquer | Moyen × court, 0,3 à 2,9 millions de jetons par jour | Possible : retirer le branchement |
| (c) S'en tenir à la règle S83 | Seule la règle mécanique du lien vers le contenu juge l'usage du message ; les cas non prévus passent | Nul | Sans objet |

> **Sans réponse** : (c), s'en tenir à la règle S83.


