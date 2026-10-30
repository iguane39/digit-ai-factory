---
destinataire: humain
---

# Synthèse Mandat — skill PDF de la Factory, construit et publié, aucune décision attendue (30/10/2026)

## 0. Synthèse d'ouverture

Le skill PDF de la Factory est construit, publié et installé sur ce poste, avec ses 2 lots. Pour vous, un formulaire rempli passe désormais par un contrôle exécuté sur le fichier, qui s'enchaîne au remplissage et juge ce qui s'imprime. Le banc apporte aussi une consigne que je n'attendais pas : un chiffre lu par reconnaissance de caractères (OCR) ne part jamais sans relecture de l'image. Vous n'avez rien à décider ; l'usage réel sera mesuré à la revue du 15/12/2026.

Livré : [Skill digit-ai-pdf](../digit-ai-forge-agents/.claude/skills/digit-ai-pdf/SKILL.md)

## 1. En-tête d'identification

Run de mandat, exécution de la décision D-112 (a), sur `digit-ai-forge-agents` et `digit-ai-forge-conception`, depuis le pilot. Période : 30/10/2026 de 15:21 à 16:26, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, 2 agents génériques Sonnet pour la lecture en aveugle, 1 agent `verificateur` pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : doter la Factory d'un outil PDF qui trie, lit avec ou sans OCR et fiabilise les formulaires à compléter, en commençant par le risque mesuré sur les documents à signer.

Test rétro : le contrôle ferme ce risque pour le prochain formulaire, le tri et la lecture tiennent les 2 autres capacités. Le type métier reste reporté à 3 demandes, comme vous l'avez choisi.

## 2. Verdict en une ligne

Les 2 lots sont livrés : self-test du skill 50/50, aussi depuis la copie installée, et self-test de `quality-oracles` à 553 contrôles PASS à sa 2e passe.

## 3. Décisions attendues

Aucune décision n'attend. D-112 est exécutée par votre réponse « 112a ».

## 4. Traité

Les essais réels viennent du poste Dell-XPS-16, avec des valeurs fictives, et leurs sorties restent au dossier temporaire de la session.

- **Lot 1, formulaires.** `formulaire.py` relève puis remplit, à champs ou à plat, et l'oracle s'enchaîne : son verdict devient le code de sortie.
- **Oracle.** `oracle-formulaire-pdf.py` porte 13 règles et lit le fichier après aplatissement par PDFium, comme à l'impression. Il est inscrit au registre 2.47.0, avec 2 paires de fixtures rouge et verte.
- **Essais sur de vrais formulaires.**
  - Formulaire à 35 champs : 34 remplis et relus sur 34, le 35e étant la signature.
  - 6 PDF plats : 5 au vert, et le 6e en FAIL sur une vraie collision avec une adresse imprimée, confirmée à l'œil.
- **Lot 2, tri et lecture.** `trier-pdf.py` rend la nature de chaque page et la voie à suivre. `lire-pdf.py` choisit la couche de texte ou l'OCR, et déclare les pages illisibles. 6 vrais scans lus, 0 page perdue.
- **Banc d'OCR.** 44 images tirées de 27 fichiers, et 18 d'entre elles lues en aveugle. Sur les mêmes images, part des nombres retrouvés sur scan propre puis dégradé :
  - Windows : 81 % et 45 %.
  - Tesseract : 90 % et 56 %.
  - Lecture d'image par Claude : 93 % et 95 %, pour environ 11 000 jetons par page.
- **Choix du moteur.** Windows reste le défaut : aucune installation, 191 ms par page contre 1 032 pour Tesseract, et il s'accorde mieux avec la lecture Claude sur les vrais scans (F1 de 0,768 contre 0,641).
- **Défauts trouvés en construisant, chacun couvert au self-test.**
  - Une exception avalée mettait la part d'image à 0 : plus aucune page n'était « scan ».
  - Du bruit comme « E 0 O 0 0 » passait pour une page lue.
  - Le texte imprimé sous un champ faisait échouer un formulaire juste.
  - Écrire sur des soulignés passait pour une collision.
  - Le détecteur de formulaire plat signalait les factures à filets.
- **Appel.** `qualifie-l-entrant` 1.3.2 nomme `lire-pdf.py` pour convertir une pièce PDF.
- **Registre.** TF-2031 reste ouvert jusqu'à la revue du 15/12/2026, par `journaliser.mjs` ; le constat TF-2033 entre au statut candidat.
- **Publication des forges** sous le mandat permanent d'écriture et de push : `3a4c410..0f61a23` pour `digit-ai-forge-agents`, `8bfc856..ee91d68` pour `digit-ai-forge-conception`, `git rev-list --left-right --count` rend 0 0 à 16:25. `bootstrap.mjs --pull` a propagé le skill, et sa copie installée est identique octet pour octet.
- **Publication du pilot** sous le GO permanent `D-54 (b) du 03/10` : le registre et cette synthèse partent ensuite par ce geste.

Relecture d'intention : sert, 1 écart mineur consigné (les options `--tableaux` et `--moteur tesseract`, qui restent dans la lecture d'un PDF).

## 5. Non traité

- **Le contrat et le mandat remplis ce matin** — motif : `hors_mandat`, je n'ai pas les valeurs que vous vouliez y voir, et l'oracle compare à ces valeurs.
- **Voie `--moteur tesseract`** — motif : `hors_mandat`, le skill tient sans ce moteur, aucun binaire n'est sur le poste et `winget` en portée utilisateur n'a rien trouvé ; le banc a mesuré ce moteur par `tesserocr`, dans un environnement jetable.
- **Dépendances de l'autre poste** — motif : `hors_mandat`, ce poste ne le lit pas ; sans elles, les scripts rendent un refus motivé.
- **Écart de `references\RUN-AO.md`** — motif : `hors_mandat`, TF-2032 reste candidat pour la revue hebdomadaire, votre réponse portait sur D-112.

## 6. Écarts à la lettre

| Vous avez choisi | J'ai fait | Pourquoi |
|---|---|---|
| un banc sur des scans français | 14 pages réelles à numérisation simulée, et 16 vrais scans jugés par l'accord entre lecteurs | la vérité n'existe que pour le simulé, et un vrai scan n'a pas de texte de référence ; les 2 limites sont écrites au banc |
| un OCR « Windows d'abord » | ce défaut, plus une règle : un chiffre qui engage se relit sur l'image | le banc montre que l'OCR perd de 10 à 55 % des nombres |

## 7. Risques

- **Skill non appelé.** Énoncé : le skill générique `pdf` se déclenche aussi sur tout PDF, et la prochaine demande peut passer par lui. Signal : la revue du 15/12/2026 relève moins de 2 demandes sur 3 passées par `digit-ai-pdf`. Parade : la description lui donne priorité sur ces 3 gestes, et la revue retire ce qui ne sert pas.
- **Caractère mal dessiné.** Énoncé : l'oracle lit le code d'un caractère, pas son dessin. Signal : un glyphe faux sur l'image `--rendu`. Parade : le skill exige cette lecture à l'œil pour un document à signer.
- **Détecteur de formulaire plat.** Énoncé : sur 40 PDF récents il en signale 18, sans vérité terrain, et j'ai regardé 2 des 9 qui ne portent pas un nom de formulaire : 1 vrai questionnaire, 1 tarif sans formulaire. Signal : une voie `remplir_plat` sur un document sans lignes à remplir. Parade : c'est une probabilité, le skill dit que l'œil confirme.
- **Fixture du juge instable.** Énoncé : `judge/red` a rendu PASS à la 1re passe du self-test de `quality-oracles`, puis conforme à la 2e. Je ne l'ai pas touchée et je ne sais pas si la cause est le juge LLM. Signal : un nouveau rouge sur cette ligne. Parade : TF-2033 propose de mesurer le taux sur 10 passes.

## 8. Prochaines actions

Aucune action n'attend : ni vous ni la session n'avez de geste à faire aujourd'hui. La revue du 15/12/2026 est portée au registre par le champ `attente_jusqu_au` de TF-2031. Elle mesure si les demandes PDF passent par le skill et retire ce qui ne sert pas.

## 9. Traces

- Skill : `digit-ai-forge-agents/.claude/skills/digit-ai-pdf/`, version 1.0.0 ; banc dans `references/banc-ocr-20261030.md`.
- Registre des oracles : `quality-oracles/references/registre-oracles.json`, version 2.47.0.
- Appel : `digit-ai-forge-conception/skills/qualifie-l-entrant/references/entrants.md`.
- Registre du pilot : `todo/TODO.jsonl`, TF-2031 et TF-2033 ; relecture RI-20261030-03 dans `todo/relectures-intention.jsonl`.
- Images, lectures et essais réels, noms compris : dossier temporaire de la session, jamais publiés.
