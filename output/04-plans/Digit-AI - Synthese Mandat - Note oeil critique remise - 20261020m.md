---
destinataire: humain
---

# Synthèse Mandat — la note de travail sur l'œil critique des process est remise, prête à être reprise hors de la session (20/10/2026)

## 0. Synthèse d'ouverture

Vous avez une note qui se lit seule, sans accès au dépôt, pour travailler le sujet ailleurs. Elle dit ce que vous cherchez, comment le sujet est né et pourquoi la première étude a été rejetée. Elle donne aussi les 11 constats mesurés, ce que propose l'étude, les 12 scénarios et ce qui reste ouvert. Elle se termine par des questions à creuser et un texte de départ à coller dans un autre assistant. La décision de mise en service reste en attente.

## 1. En-tête d'identification

Note de synthèse sur l'œil critique des process, rédigée à partir des études et mesures du 20/10/2026. Pilot digit-ai-factory, poste Dell-XPS-16. Période : 20/10/2026, de 14:26 à 14:29, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; 1 `verificateur` délégué pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : pouvoir travailler le sujet de l'œil critique hors de la session, avec un document autonome.

Test rétro : le résultat sert cette intention. La note n'exige ni le dépôt ni le contexte de la session ; chaque identifiant interne y est expliqué, et chaque chiffre a sa source.

## 2. Verdict en une ligne

Note de 9 sections et environ 2 100 mots, PASS par `oracle-ecriture` ; 11 constats chiffrés, 12 scénarios, 5 questions ouvertes ; relecture d'intention « sert ».

## 3. Décisions attendues

Aucune décision neuve.

**D-60** : mise en service de l'œil critique et lancement des scénarios 3, 1 et 12, posée le 20/10 à 14:22, inchangée.

## 4. Traité

- **Note autonome rédigée.** Preuve : `output/04-plans/Digit-AI - Note - Oeil critique des process a travailler - 20261020l.md`, nommée selon R-4 et R-25 (type « Note » du registre des types), indice alloué par `allouer-indice.mjs`.
- **Forme jugée.** `node oracles/oracle-ecriture.mjs` rend PASS, après 2 corrections : un en-tête de colonne qui annonçait au lieu de nommer, et une question qui ne nommait pas son objet.
- **Chiffres repris tels quels de l'étude.** Ils avaient été recomptés à la source au tour précédent ; la note n'en ajoute aucun.
- **Aucun nom réel de produit.** Les produits y sont désignés par leur nombre et par leur rôle, jamais par leur nom.
- **Relecture d'intention : sert (RI-20261020-15, gravité mineure).** Le relecteur note un ajout, la section des pistes et du texte de départ ; je le décris dans les écarts à la lettre.

## 5. Non traité

- **Une version publiée en ligne.** Motif : la Factory ne publie aucun livrable sur un service hébergé sans votre feu vert (R-38) ; la note reste un fichier sur disque.
- **Les mesures manquantes de l'étude.** Motif : la note les liste dans sa section 7 sans les combler ; elles relèvent de la mise en service (D-60).

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « une synthèse du sujet » | Une synthèse, plus une section de 5 questions à creuser et un texte de départ pour un autre assistant | Vous voulez le travailler à l'extérieur ; ces 2 ajouts servent ce but, et la section se retire sans rien changer au reste |

## 7. Risques

- **Un chiffre lu hors de son contexte.**
  - Énoncé : « 20 % de reprises » vient d'un échantillon de 60 messages, avec un intervalle de 12 à 32 %.
  - Signal : un raisonnement extérieur qui prend ce chiffre pour exact.
  - Parade : la note donne l'intervalle à côté du chiffre.

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, votre décision ensuite ; A-1 attend D-60.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Mettre en service les relevés et lancer la campagne des scénarios 3, 1 et 12 | auto_ia | dependance_bloc_3 : attend D-60 | Scripts de l'étude, à reprendre comme sondes ; une campagne d'agents par scénario | L'œil critique reste une photographie |
| **A-2** | `neuve` | Enregistrer la note, les études, analyses et synthèses du jour et les items TF-1939 à TF-1941 | auto_ia | hors_mandat : enregistrement non demandé dans ce tour | `git commit --only -- <chemins>` | L'autre poste ne voit pas ce travail |
| **A-3** | `neuve` | Trancher D-60 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `60a` | Rien n'est mis en service |

## 9. Traces

- Note : `output/04-plans/Digit-AI - Note - Oeil critique des process a travailler - 20261020l.md`
- Étude source : `output/03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md`
- Relecture : `RI-20261020-15` dans `todo/relectures-intention.jsonl`
- Rien n'est enregistré ni poussé.
