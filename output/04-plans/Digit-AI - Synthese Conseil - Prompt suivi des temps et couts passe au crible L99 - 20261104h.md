---
destinataire: humain
---

# Synthèse Conseil — prompt « suivre temps, délais, charges, jetons et coûts des produits » passé au crible L99 (04/11/2026)

## 0. Synthèse d'ouverture

Votre prompt est réécrit et noté 86 sur 100 par 2 relecteurs aveugles, contre 22 au départ. Deux de vos 5 grandeurs ne se mesurent pas en l'état. Le coût n'existe pas au jeton : la Factory tourne sur l'abonnement, et aucune transcription ne porte de montant. L'historique des produits déjà construits est en partie perdu : les transcriptions conservées commencent le 25/09/2026, les journaux de run le 05/08/2026. Le prompt réécrit fait donc définir chaque grandeur avant de la mesurer, et partir l'étude des 8 traces qui existent. Il garde 10 défauts moyens, listés avec leur correction. Une décision vous revient : montrer ou non, dans l'étude, une démonstration sur un run réel.

Livré : [Revue L99 du prompt de suivi des temps et des coûts](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20suivi%20des%20temps%20et%20couts%20des%20produits%20passe%20au%20crible%20L99%20-%2020261104c.md)

## 1. En-tête d'identification

Analyse de prompt L99 (analyse en 8 couches qui relisent toutes le prompt d'origine) en mode boucle, au pilot `digit-ai-factory`. Période : 04/11/2026 de 16:54 à 17:12, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 6 agents `verificateur` : 4 relecteurs aveugles, 1 vérificateur de clôture et 1 relecteur d'intention ; escalade de modèle : aucune.

Intention de la demande : obtenir un prompt qui lance l'identification de ce qui manque pour suivre finement, produit par produit, le temps, les délais, les charges, les jetons et les coûts, puis de ce qu'il faut ajouter à la Factory pour que chaque projet les suive.

Test rétro : le résultat sert cette intention. Le prompt réécrit cite votre texte mot pour mot et garde ses 2 demandes dans leur ordre. Il y ajoute ce sans quoi les chiffres seraient faux : la définition du coût sous abonnement, la perte de l'historique et la règle qui rattache une session à un produit.

## 2. Verdict en une ligne

Score mesuré à 86 sur 100, contre 22 au départ, en 2 passes. La passe 2 tombe à 74 : elle est rejetée et la passe 1 est livrée, avec 10 majeurs et 0 bloquant. Journal de boucle PASS à `oracle-boucle-l99`.

## 3. Décisions attendues

> **D-173 — Faut-il ajouter à l'étude de suivi des temps et des coûts une démonstration des 5 mesures sur un run réel d'un produit ?**
>
> - **De quoi s'agit-il** : une section de l'étude à venir, rédigée au gabarit `gabarits/ETUDE-OPPORTUNITE.md`, qui calculerait temps, délai, charge, jetons et coût sur un run réel d'un produit, sous pseudonyme.
> - **Le problème** : elle prouve que les définitions se calculent, ce que 2 relecteurs de la passe 2 ont demandé ; mais vous ne l'avez pas demandée, et la relecture d'intention du tour la relève comme une dérive par rapport à votre demande.
> - **Pourquoi vous** : la règle des écarts à la lettre de l'analyse veut que tout contenu visible non demandé se décide à part, par vous ; votre réponse fixe ce que l'étude contiendra.
> - **Recommandation : (b)** — la preuve reste dans l'étude sans l'alourdir, et le détail va dans la restitution du run. Source consultée : chapitre 8 de la revue, `output/03-etudes/`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ajouter la démonstration complète des 5 mesures sur un run réel | l'étude porte une section entière de calcul sur un run, sous pseudonyme | moyen : un run relevé, 2 décomptes de jetons, une section de plus à relire | Possible : retirer la section avant l'enregistrement de l'étude |
| (b) Ajouter une ligne de résultat par preuve : seuil d'inactivité retenu, écart entre les 2 décomptes de jetons, verdict de la règle d'attribution | l'étude montre 3 lignes de résultat ; les calculs vont dans la restitution du run | simple : 3 lignes dans l'étude, le calcul reste le même | Possible : retirer les 3 lignes |
| (c) Ne pas ajouter la démonstration | l'étude définit les grandeurs sans prouver qu'elles se calculent ; le paragraphe et la ligne de contrat suspendus sont retirés du prompt | nul | Possible : la demander dans un second temps |

> **Sans réponse** : (c), le paragraphe de démonstration et sa ligne de contrat sont retirés du prompt avant son lancement.

## 4. Traité

Le tour a analysé le prompt, l'a réécrit en 2 passes notées à l'aveugle, et a joué les oracles sur la revue.

- **Analyse en 8 couches**, écrite dans la revue. Elle part de mesures faites entre 16:54 et 16:58. Les journaux de run des produits ne portent aucun champ de jetons et 1 seul champ de durée ; 12 runs y sont ouverts et 9 clos. Mesuré sur : `c:\dev\*\forge\ledger.jsonl`, relue à 16:56, périmètre 11 journaux. Les transcriptions de Claude Code portent les jetons en 4 catégories, sans aucun montant.
- **Boucle de réécriture.** 2 passes, notées chacune par 2 relecteurs aveugles. Chaque défaut grave a été recompté à la source par une commande : 10 retenus, 0 démenti. Avant la passe 2, un vérificateur qui ne note pas a jugé fermés 7/7 défauts visés et trouvé 2 défauts créés, corrigés 2/2 avant la relecture. La passe 2 a régressé de 86 à 74, en partie à cause de 2 de ses corrections : elle est rejetée.
- **Oracles joués sur la revue.** `check_markdown.py` rend PASS. `oracle-ecriture.mjs` rend exit 0, après le passage en chiffres de 7 nombres et le renommage d'un titre-annonce. `oracle-boucle-l99.mjs` rend PASS sur le journal. Un `diff` prouve que le prompt inclus dans la revue est identique à la copie livrée.
- **Relecture d'intention :** dérive, gravité majeure, nature choix humain (RI-20261104-02) : la démonstration sur un run réel n'était pas demandée ; posée à vous en D-173, rien ne change sans votre réponse.

## 5. Non traité

- **Les 10 majeurs ouverts** — motif : borne_atteinte, la boucle s'arrête sur la régression de la passe 2. Ce sont les commandes de l'existant, le seuil d'inactivité, les décomptes de jetons, un prix introuvable, le résumé de décision et le run de preuve, les usages des chiffres, le temps des agents parallèles, l'unité du coût de construction, l'état de l'art et l'ordre de priorité. Leurs corrections sont écrites au chapitre 8 de la revue, sans relecture aveugle.
- **L'exécution de l'étude** — motif : hors_mandat, vous avez demandé d'améliorer le prompt, pas de le lancer.
- **La publication du pilot** — motif : hors_mandat, non demandée ; l'enregistrement reste local.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « coûts » | l'étude distingue le coût payé, l'équivalent au tarif public et l'hébergement | sous abonnement, aucun coût n'existe au jeton |
| « charges » | l'étude propose 3 lectures au plus et vous laisse choisir | le mot a 3 sens |
| « rajouter … dans chaque projet » | l'étude dit comment chaque produit reçoit l'ajout ; elle n'écrit chez aucun | le pilot n'écrit pas chez un produit hors run demandé |

## 7. Risques

- **Historique qui s'efface.** Énoncé : la plus ancienne transcription du profil principal date du 02/10/2026, et aucun réglage de conservation n'est posé ; chaque jour d'attente peut retirer un jour de jetons relevables. Signal : la date de la plus ancienne transcription avance à la remesure de l'étape 0. Parade : lancer l'étude sans tarder ; la question 4 du prompt traite la conservation.
- **Valeurs qui vieillissent.** Énoncé : les comptes de l'étape 0 dérivent dans la journée ; un relecteur a déjà compté 1 060 transcriptions contre 1 055. Signal : un écart entre le prompt et la remesure. Parade : le prompt fait foi de la valeur remesurée.

## 8. Prochaines actions

Deux façons de lancer l'étude, après votre réponse à D-173.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer l'étude avec le prompt réécrit tel qu'il est, noté 86 | neuve | auto_ia | hors_mandat : vous avez demandé d'améliorer le prompt, et lancer un run attend votre « A1 » | chapitre 8 de la revue, bloc « Prompt réécrit » | si rien n'est fait, l'étude reste à écrire et l'historique des jetons continue de s'effacer |
| A-2 | Appliquer d'abord les 10 corrections au prompt, le faire relire par 2 relecteurs aveugles, puis lancer l'étude | neuve | auto_ia | hors_mandat : attend votre « A2 » ; 1 passe de plus a coûté ici de 31 000 à 41 000 jetons par agent | chapitre 8 de la revue, « Les 10 majeurs ouverts » | si on ne le fait pas, l'étude part avec 10 défauts moyens connus |

## 9. Traces

- Revue : `output/03-etudes/Digit-AI - Revue - Prompt suivi des temps et couts des produits passe au crible L99 - 20261104c.md`.
- Journal de boucle : même chemin, suffixe `.boucle.json`.
- Passes du prompt : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\05fe0f2a-5e75-4306-8ab3-3be1f8a00741\scratchpad\l99-suivi\prompt-p1.md`, puis `prompt-p2.md` et `prompt-p1-livre.md` dans ce même dossier.
- Décision réservée : D-173 au registre `decisions/REGISTRE.jsonl`.
- Enregistrement : commit local au pilot, non publié ; son numéro se lit par `git log -1`.
