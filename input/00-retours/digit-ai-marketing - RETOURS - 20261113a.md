# Retours forges — digit-ai-marketing — 20261113a

- **Contexte** : autre — ouverture du run d'animation de réseau sur décision D-185 (a) du dirigeant, le 13/11/2026 : la fiche « émetteur et réseaux » et les règles de voix de Digit-AI ont été écrites et jouées par `oracle-run-reseau` sur les 15 semaines de la série LinkedIn.
- **Références ledger** : `forge\ledger.jsonl` seq 798 (entrée `type: retour`), décision seq 794.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 13/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : sur la version 20261112d de la série, la règle RR8 de `oracle-run-reseau` a refusé à tort 1 republication sur 15, faute de reconnaître la forme élidée « j' ». Ce lot remonte 1 retour, tiré de 1 entrée du ledger, au pilot.

---

## Pilot (`digit-ai-factory`)

La porte « voix » du run de réseau ne lit pas l'élision du français.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-223 | mineur | générique | **RR8 ne reconnaît jamais la forme élidée d'un mot.** Faits : le 13/11/2026, une règle `formules_imposees` « je », portée par le profil du dirigeant, a refusé le texte de la semaine du 01/02/2027, qui ouvre sur « Ce que j'attends ». `contientExpression()` de `oracles/oracle-run-reseau.mjs` exige une non-lettre après l'expression : « j' » ne peut donc être ni imposé ni écarté. 1 refus à tort sur 15 republications. Contournement au produit : la première personne est passée en `lecture_humaine`. (ledger seq 798) | Traiter l'apostrophe finale d'une valeur comme une frontière (« j' », « l' », « qu' »), ou admettre « je » pour « j' » ; fixture rouge et verte sur « j'attends ». Classe existante : `oracle-faux-positif`. |

## Rattachement

Registre interrogé le 13/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RP-223 | `grep -i "oracle-run-reseau" todo/TODO.jsonl \| grep -i -c -E "voix\|RR8"` | 2 | voisin : TF-1455 (porte « voix » créée le 28/09/2026) ; aucun ne traite l'élision. `grep -i -c "elision\|élision\|élidée" todo/TODO.jsonl` : 2 lignes, TF-1086, garde d'élision de forge-tests, sans rapport avec RR8 |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le gabarit `VOIX-EMETTEUR.json` s'est instancié en une passe, et ses 6 règles mécanisables ont toutes été relevées sur une semaine altérée : le contrôle positif tient.

## Ordre recommandé

1. RP-223, seul retour du lot.

## La règle qui aurait évité le retour

La garde lexicale existe déjà pour l'accent (classe `garde-lexicale-frontiere-ascii`) ; l'élision en est le cas voisin, que la classe `oracle-faux-positif` couvre.
