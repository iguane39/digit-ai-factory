---
role: diagnostic d'exploitation des sauvegardes Google Drive des produits (run de conseil, demande du 21/11/2026)
destinataire: humain (porteur de la Factory)
---

# Diagnostic d'exploitation — sauvegardes Drive des produits — 20261121c

## 1. Symptôme et périmètre

Le porteur rapporte le 21/11/2026 « un problème avec les sauvegardes Drive, notamment sur des doublons de dossiers ou des données dans les .env ». Deux faits l'avaient précédé. Le 12/11, une copie fichier contre fichier a perdu des clés d'un `.env` des deux côtés (RT-149, lot de Produit-02). Le 21/11 au matin, l'autre poste a refusé de lancer la sauvegarde de Produit-02, parce que le Drive portait 3 clés absentes de son `.env` (synthèse 20261121b).

Périmètre instruit : le dossier `Mon Drive\dev` du compte personnel, miroir local `%USERPROFILE%\Mon Drive` sur le poste Dell-XPS-16 (le portable). Les 8 dossiers qu'il contient, les produits qui les alimentent et les scripts qui les écrivent sont mesurés. Le second compte Drive (`H:`) est vérifié pour les doublons entre comptes.

Hors périmètre : le contenu des fichiers de secrets, jamais lu (seuls des noms de clés et des comptes sont sortis, par `scripts/fusionner-env.mjs` à blanc). Le contenu des données personnelles des produits. L'autre poste (DESKTOP-ULTRA7), qui n'est lu qu'à travers sa synthèse du matin.

## 2. Mesures exécutées

Toutes les mesures sont en lecture seule, le 21/11/2026 entre 11:10 et 11:40, sur ce poste.

| id | mesure | valeur | source (commande/requête + date) |
|---|---|---|---|
| M-01 | Volume de `Mon Drive\dev` | 8 dossiers, 51 527 fichiers, 113 393 Mio (environ 111 Gio) | `Get-ChildItem -Recurse` par dossier, 21/11 |
| M-02 | Mécanismes qui écrivent dans ces dossiers | 4 : canal de reprise R-64 (3 produits), `build/sauvegarde-drive.py` (Produit-02), `forge/synchro-poste.mjs` (Produit-79), notice `REPRISE.md` à suivre à la main (Produit-12 et 2 dossiers sans produit sur ce poste) | recherche de `forge/REPRISE.json`, `sauvegarde-drive*`, `synchro-poste*` sous `C:\dev`, 21/11 |
| M-03 | Juge du canal R-64 sur les 3 produits déclarés | PASS pour les 3 (RP1 à RP7) ; RP8 avertit chez Produit-85 et chez `factory.digit-ai.fr` (bases dérivées non couvertes) | `node oracles/oracle-reprise.mjs --verifier --racine <produit>`, 21/11 |
| M-04 | Fichiers de secrets sous `Mon Drive\dev`, par nom | 13 : 5 chez Produit-12, 3 chez Produit-02, 2 chez Produit-61, 1 chez Produit-79, 1 chez `factory.digit-ai.fr`, 1 dans un dossier sans produit ; dont un fichier texte de mot de passe d'administration de production | filtre sur les noms (`.env*`, `secret`, `password`, dossier `SECRETS`), 21/11 |
| M-05 | Secrets tenus par une fusion clé par clé | 4 sur 13 (Produit-02 par `sauvegarde-drive.py` ; Produit-79 par `synchro-poste.mjs`) ; les 9 autres ne sont tenus par aucun script | lecture des scripts, `Select-String fusionner`, 21/11 |
| M-06 | Visibilité des secrets sur Google Drive | les 13 fichiers de M-04 sont `PRIVATE` ; la recherche des fichiers à visibilité non restreinte ne rend aucun fichier de secrets | connecteur Google Drive, `search_files` sans extrait de contenu, 21/11 |
| M-07 | `.env` du poste contre copie Drive | 9 paires comparées : mêmes clés, mêmes valeurs, 0 conflit | `node scripts/fusionner-env.mjs fusionner <poste> <drive>` à blanc, 21/11 |
| M-08 | `.env` de Produit-02 sur l'autre poste | 3 clés de moins que le Drive ; copie Drive du 12/11, celle du poste du 09/11 | synthèse 20261121b, bloc 4 |
| M-09 | Coffre de secrets de Produit-79 | 2 clés au coffre et au poste ; 2 clés que la documentation du produit exige sont absentes ; le juge du produit rend PASS (V1 à V6) | `forge/ledger.jsonl` de Produit-79, seq 1246 du 20/11 ; M-07 |
| M-10 | Copies d'un même jeu de données chez Produit-12 | 4 dossiers de 9 819 Mo chacun (39 276 Mo) ; avec la copie courante, 88 %, 97 % et 99,5 % des fichiers des 3 versions figées sont identiques [src: doublons.mjs, 21/11] | `doublons.mjs` (chemin relatif, taille et SHA-256), 21/11 |
| M-11 | Dates de ces 4 copies | 05/10, puis 3 le 14/10 (13:06, 16:43, 17:28) ; rien depuis, alors que le produit a un enregistrement du 08/11 | `CreationTime` des dossiers ; `git log -1`, 21/11 |
| M-12 | Restes d'une ancienne notice chez `factory.digit-ai.fr` | sous-dossier `DONNEES-HORS-GIT` d'1 fichier, différent de sa copie à la racine du canal ; un `.env` posé le 14/11 à la racine du canal, que le manifeste exclut | `doublons.mjs` ; M-04 |
| M-13 | Dossier de Produit-79 | 4 sous-dossiers écrits par 2 outils (canal R-64 dans `DONNEES-HORS-GIT`, coffre `SECRETS` et `MEMOIRE-CLAUDE` par `synchro-poste.mjs`) ; `LIVRETS-REFERENCE` (15 fichiers, 115 Mio) n'est tenu par aucun | `forge/REPRISE.json` et `forge/synchro-poste.mjs` du produit, 21/11 |
| M-14 | Clones de Produit-02 | 2 clones du même dépôt ; le second (dernier enregistrement du 11/10) porte une sauvegarde du 09/10, sans fusion clé par clé, vers `D:\10-Google Drive\…`, l'emplacement du Drive sur l'autre poste | `git remote get-url`, `Select-String fusionner` (0 contre 10), 21/11 |
| M-15 | Fichiers du Drive absents du poste | 3 classeurs de gestion chez Produit-02, listés et jamais supprimés | `python build/sauvegarde-drive.py --verifier`, 21/11 |
| M-16 | Dossiers dupliqués hors `dev` | une paire de dossiers de fiches et sa copie « (1) » à la racine de Mon Drive, toutes deux vides | `doublons.mjs`, 21/11 |
| M-17 | Noms en « (n) » sous `dev` | 686 fichiers, presque tous dans les données sources de Produit-12 | `doublons.mjs`, 21/11 |
| M-18 | Espace disque du poste | 132,4 Gio libres ; le Drive est en mode miroir sur `C:`, donc les 111 Gio de M-01 s'ajoutent aux clones (Produit-85 : 66,5 Gio dans son dossier, 62,6 Gio sur le Drive) | `Get-PSDrive C`, raccourci `G:\Mon Drive.lnk`, 21/11 |
| M-19 | Second compte Drive | aucun dossier de reprise, de sauvegarde ou de secrets | `H:\Mon Drive.lnk` résolu, recherche de noms, 21/11 |

Non mesuré : l'état du Drive tel que le voit l'autre poste, au-delà de sa synthèse ; la présence sur l'autre poste du second clone de Produit-02 ; les clés que chaque produit exige, faute de liste déclarée ailleurs que dans sa documentation.

## 3. Causes candidates

**C-1. Quatre mécanismes pour un seul besoin.** Le besoin du porteur est écrit le 12/11 chez Produit-79 : « l'utilisateur ne doit avoir aucun impact dans l'utilisation de son projet d'un poste à l'autre ». Le pilot n'y répond qu'en partie : son canal R-64 refuse les secrets (règle 4), et l'exception D-208 (a) du 12/11 laisse chaque produit écrire sa propre sauvegarde. Chaque produit a donc bâti la sienne, avec sa propre disposition des dossiers (M-02, M-13). Soutenue par M-02, M-05, M-13. Rien ne la contredit.

**C-2. Les secrets voyagent, mais sans fusion obligatoire ni liste des clés attendues.** Sur ce poste, les secrets sont alignés (M-07). L'écart naît quand un poste n'a pas joué la fusion : l'autre poste a 3 clés de retard chez Produit-02 (M-08), et le coffre de Produit-79 est incomplet alors que son juge rend PASS (M-09). Le juge compare le poste au coffre, jamais aux clés que le produit exige : deux copies également incomplètes passent pour justes. D-223, posée le 16/11, porte la fusion automatique et attend sa réponse. Soutenue par M-07, M-08, M-09.

**C-3. Des secrets hors de tout mécanisme.** 9 fichiers de secrets sur 13 ne sont tenus par aucun script (M-05). Ils viennent des notices à suivre à la main, antérieures au canal R-64 (03/10 et 05/10), et d'une copie posée à la main le 14/11 à la racine d'un canal qui les exclut (M-12). Personne ne les met à jour, et une restauration à la main y reprendrait un état périmé. Le risque de fuite reste faible : les 13 fichiers sont privés (M-06). Soutenue par M-04, M-05, M-11, M-12.

**C-4. Une suppression ne se propage jamais.** R-64 le déclare comme limite, et `sauvegarde-drive.py` aussi. Chaque version figée, dossier renommé ou fichier retiré du poste reste sur le Drive (M-10, M-12, M-15). Les 3 copies figées de Produit-12 représentent environ 29 Go de doublons. Soutenue par M-10, M-12, M-15.

**C-5. Un second clone porte un outil périmé.** Le second clone de Produit-02 sauvegarde fichier contre fichier vers l'emplacement du Drive de l'autre poste (M-14). Joué sur ce poste-là, il reproduirait la perte de clés du 12/11. Soutenue par M-14 ; non vérifié : la présence de ce clone sur l'autre poste.

**Hypothèse écartée.** Il n'y a pas de doublon entre les deux comptes Drive (M-19). Les 686 noms en « (n) » de M-17 viennent des données sources du produit, pas de conflits de synchronisation du Drive ; cette lecture reste à confirmer par la date de création des fichiers.

## 4. Recommandations

- **R-1. Un seul mécanisme, au pilot (décision D-224).** Le hook `reprise` du pilot porte les trois flux : données hors git par le canal, secrets par un coffre fusionné clé par clé (`fusionner-env.mjs`), mémoire Claude du projet. Il se joue à l'ouverture et en fin de tour, chez tous les produits par l'héritage. `synchro-poste.mjs` de Produit-79 sert de modèle : il fait déjà ces trois flux. Les produits migrent ensuite, un par un, et leurs scripts maison se retirent. Effort : 1 à 2 jours au pilot, puis environ une heure par produit. Mesures : M-02, M-05, M-13. Exclut : la reprise du pilot lui-même, qui passe par git. [décision : R-64 règle 4 et son exception D-208 (a) du 12/11/2026, `REGLES-PROJET.md`, que R-1 réécrit]

- **R-2. Le coffre se juge contre une liste de clés attendues.** Chaque produit déclare les noms des clés qu'il exige, sans valeur, dans son manifeste. Le juge rend FAIL quand une clé attendue manque au poste ou au coffre, même si les deux copies sont égales. C'est le contrôle que le retour du 20/11 de Produit-79 demande. Effort : une demi-journée. Mesures : M-09. Exclut : la validité des jetons, que seule l'API qui les reçoit juge.

- **R-3. La fusion des secrets devient automatique (réponse « 223a » à D-223).** La recommandation du 16/11 était (b), la fusion proposée et non jouée. Les mesures du jour la changent : la fusion à la main n'a pas été jouée chez 2 produits sur 2 (M-08, M-09). Effort : compris dans R-1. Exclut : un conflit de valeur, que la fusion refuse sans choix explicite.

- **R-4. Les secrets orphelins entrent au coffre de leur produit, puis leur copie isolée sort du Drive (décision D-225).** Les 9 fichiers de M-05 se fusionnent clé par clé dans le coffre du produit qui les porte. Sur ce poste, aucune clé n'y serait perdue (M-07). Les 2 dossiers sans produit sur ce poste restent intacts : leur copie Drive est peut-être la seule. Le fichier de mot de passe de production rejoint le coffre ; un changement de ce mot de passe n'est pas nécessaire, puisqu'il n'a jamais été partagé (M-06). Effort : une heure. Exclut : la lecture d'une valeur, que le geste n'imprime jamais.

- **R-5. Les doublons sortent du Drive, de façon réversible (décision D-225).** Les 3 copies figées de Produit-12 (environ 29 Go), le sous-dossier resté chez `factory.digit-ai.fr`, la paire de dossiers vides et le `.env` posé hors coffre passent dans un dossier `_a-retirer-20261121` du Drive. Vous les supprimez vous-même après 30 jours sans réclamation. Effort : une demi-heure. Mesures : M-10, M-12, M-16. Exclut : les 3 classeurs de Produit-02 (M-15), qui viennent peut-être de l'autre poste et restent à votre jugement.

- **R-6. Le second clone de Produit-02 ne sauvegarde plus.** Sa sauvegarde se retire, ou le clone entier se retire s'il n'a plus d'usage. C'est une écriture chez un produit : elle se fait dans une session ouverte chez lui. Effort : quelques minutes. Mesure : M-14.

- **R-7. Le mode miroir du Drive se règle pour les gros dossiers.** Les dossiers de reprise de Produit-85 et de Produit-12 pèsent 99 Gio et restent aussi copiés sur `C:` (M-18). Le mode flux de Google Drive pour ordinateur ne garde sur disque que les fichiers ouverts ; il se règle par dossier, dans les préférences de l'application, et c'est votre réglage. Effort : quelques minutes. Exclut : la reprise hors connexion de ces dossiers, qui demande alors un téléchargement.

L'ordre conseillé : R-6 et R-4 d'abord, parce qu'ils ferment un risque de perte de clés ; R-2 et R-3 ensuite ; R-1 et R-5 enfin, quand le mécanisme unique existe ; R-7 à votre convenance.

## 5. Plan de revue

Le 2026-12-05, les mesures M-02, M-04, M-05, M-07, M-09 et M-10 se rejouent sur les 2 postes. Le diagnostic est confirmé si, après R-1 à R-5, le Drive ne porte plus qu'un mécanisme et aucun secret hors coffre, et si les `.env` des 2 postes ont les mêmes clés. Il est réfuté si une perte de clés survient alors que le coffre et la liste des clés attendues sont en place : la cause serait ailleurs, par exemple dans l'ordre de synchronisation de Google Drive lui-même.
