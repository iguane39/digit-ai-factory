---
role: preuve de couverture du 14/09/2026 (proposition P-1, décision humaine D-4 (a)) — chaque contrôle réputé couvrir un défaut du banc a été EXÉCUTÉ sur le livrable fautif, dans son état d'avant correction ; verdict obtenu, ligne probante, type de couverture
methode: session déléguée (modèle Sonnet, 101 appels d'outils, 378 817 tokens), fixtures dans l'espace temporaire de la session, aucun dépôt modifié, aucun fichier de secrets lu ; livrables lus depuis le canal confidentiel
verifie_le: 2026-09-14
---

# Preuve de couverture — le banc joué contre ses propres contrôles (14/09/2026)

Le relevé de couverture du 14/09/2026 comptait 7 défauts sur 10 couverts, en lisant le code et le
registre. Joués sur le livrable fautif, ces contrôles en couvrent exactement **2 sur 9** (les 9
défauts mesurés du banc ; le dixième, hors mesure, est couvert aussi). Trois contrôles laissent passer
leur défaut, dont un par un bug de la règle S13 de l'oracle de restitution du pilot. La couverture
lue n'est pas la couverture jouée.

**Mode de lecture** : une ligne par défaut du banc et par contrôle exécuté ; « verdict » est ce que
le contrôle a rendu sur le livrable FAUTIF (un contrôle qui couvre doit le refuser) ; la dernière
colonne classe la couverture.

| Défaut | Contrôle exécuté | Verdict sur le livrable fautif | Ligne probante | Couverture |
|---|---|---|---|---|
| E-01 (défaut échappé n° 1, fiche d'accès et page de connexion) | R-23 d'`oracle-conformite-projet` | refusé, en partie | « la même valeur finit affichée sur la page de connexion servie sur Internet (TF-0871) » | partielle : R-23 lit la fiche d'accès, jamais la page de connexion |
| E-02 (canevas de fiche sécurité) | FS1-FS7 de `verifier-fiche-securite` (forge-audit) | accepté (instance remplie sans champ d'audience) | `"verdict":"PASS"`, six règles au vert | aucune : les règles FS sont formelles ; la correction a ajouté le champ au canevas, aucun contrôle ne vérifie sa présence |
| E-03 (squelette HTML, sommaire) | L21 de `check_html.py` | refusé | « L21 composant déclaré sans style : la classe « toc » est employée dans le marquage et AUCUNE règle CSS ne la vise » | exacte |
| E-04 (synthèse, action sans chemin) | S12 d'`oracle-synthese` | refusé, pour un autre grief | « 2 action(s) sur 2 — une action laissée à l'humain sans raison d'impossibilité IA » | indirecte : S12 juge le motif, pas le chemin |
| E-04 | S13 d'`oracle-synthese` | accepté | `"S13":"PASS"` — « chaque action humaine est exécutable telle quelle » | aucune : bug, le nettoyage du nom d'acteur laisse des accents graves vides que la règle prend pour un chemin |
| E-05 (porte de fraîcheur) | aucun | non jouable | aucune occurrence de M-8 (fraîcheur de la mise en production) dans les oracles du pilot ni de forge-ops | aucune : règle de dossier jamais outillée |
| E-06 (logos, variantes identiques) | S27 d'`oracle-synthese` | non jouable | S27 ne juge que la prose d'une restitution | aucune |
| E-06 | V9 de `render_page.py` | accepté (fond réaliste, puis fond identique à la couleur dominante) | `"v9_actif_invisible":[]` | aucune pour un logo bicolore : V9 retient le meilleur pixel, et l'accent minoritaire sauve l'actif ; contrôle témoin sur un logo monocolore : refusé |
| E-07 (accords après substitution) | `confronter_genre()` de forge-tests | refusé, 1 fragment sur 7 | `{"vu": "otro casa rural", "determinant": "otro"}` | partielle : « Ningún casa rural » manqué (une garde refuse un déterminant précédé d'un guillemet de début de chaîne) ; les participes après copule sont hors périmètre par construction (`glossaire-009`, todo) |
| E-08 (installateur du hameçon) | aucun | non jouable | la correction a déplacé la résolution des tables dans l'oracle ; aucun contrôle n'aurait refusé l'installateur | aucune : couverture par correction seulement |
| E-15 (badges de statut) | V16 de `render_page.py` | refusé | « écart de couleur (Delta-E CIE76) 19.5 < 20 ET écart de luminance 0.013 < 0.25 », bloquant | exacte |
| E-10 (rapport d'arbitrage, hors mesure) | `oracle-autorite-decision` | refusé | « A2 — décideur … appartient à l'ÉMETTEUR du livrable », plus A3 et A4 | exacte |

## Décompte, sur les 9 défauts mesurés

**Mode de lecture** : une ligne par type de couverture, avec les défauts qui la portent.

| Couverture | Défauts | Nombre |
|---|---|---|
| exacte (le contrôle refuse le livrable pour ce défaut) | E-03, E-15 | 2 |
| partielle ou indirecte | E-01, E-04 (par S12), E-07 | 3 |
| aucune (accepté à tort ou aucun contrôle) | E-02, E-05, E-06, E-08 | 4 |

## Le bug de S13, reproduit dans les deux sens

Le mécanisme se lit dans `oracles\oracle-synthese.mjs` : `ACTEURS` (l. 584) n'a pas le drapeau
`g`, et S13 (l. 613) teste `_LOCALISATEURS` (l. 207), qui accepte tout texte entre accents graves,
après avoir retiré le nom d'acteur ; il reste `` ` ` ``, compté comme un chemin. Reproduction par
l'auteur de l'étude, le 14/09/2026, sur le livrable E-04 : le fichier d'origine rend **S13 PASS** ; la
même synthèse, dont seuls les accents graves entourant l'acteur ont été retirés, rend **S13 FAIL**
(« une action laissée à l'humain sans chemin, commande ni libellé d'écran »). Même contenu, verdict
inversé : la règle juge une typographie, pas l'exécutabilité.

**Corrigé le 14/09/2026 (TF-1085, décision D-9 (a)).** S13 retire désormais le nom d'acteur et ses
accents graves en une seule expression. Rouge → vert sur le défaut réel : le livrable E-04 rend
**S13 FAIL** ; self-test de l'oracle 19/19, dont la paire S13 dans ses deux sens ; taux
d'accusation mesuré avant activation sur 106 synthèses de `output\04-plans\` : 0 bascule. Le défaut
E-04 passe donc de « aucune couverture » à « couverture exacte » : **3 défauts sur 9** sont
désormais couverts exactement.

## Ce qui manque, défaut par défaut

- **E-04** : corriger S13 (ne pas laisser d'accents graves vides après le retrait du nom d'acteur) et
  lui donner une fixture rouge « action au format canonique, sans chemin ni commande ».
- **E-06** : faire juger à V9 la couleur dominante de l'actif, pas son meilleur pixel ; et le contrôle
  des variantes à empreinte identique (TF-1074).
- **E-07** : corriger la garde de `confronter_genre()` pour un déterminant en début de chaîne.
- **E-01** : faire lire à R-23 la page de connexion servie, pas seulement la fiche d'accès.
- **E-02** : une règle qui vérifie la présence du champ d'audience dans l'instance remplie.
- **E-05** : l'oracle M-8 (TF-1075). **E-08** : un contrôle des appelants qui devinent la
  configuration d'un contrôle, inexistant au registre.
