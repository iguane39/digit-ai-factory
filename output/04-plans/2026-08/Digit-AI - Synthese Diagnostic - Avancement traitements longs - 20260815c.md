# Synthèse de diagnostic — pourquoi aucun avancement toutes les 3 minutes (TF-0252)

## En-tête d'identification

**Quoi** : diagnostic (remarque humaine sur la convention d'avancement TF-0094).
**Sur quoi** : pilot digit-ai-forge-steering, campagnes d'agents du jour. **Quand** :
15/08/2026, fin à 17:40 (Europe/Paris), durée ≈ 10 minutes. **Qui** : session pilot
(Fable), pilot@17b21b1 → à committer.

## Verdict

La règle existe et est dure (TF-0094 : > 2 min ⇒ émission toutes les 3 min) mais
0 émission sur les 10 campagnes d'agents du 15/08 (durées 3 à 41 min) — deux causes
constatées, aucune n'est un oubli ponctuel.

## Décisions attendues de l'humain

- Câbler l'avancement des campagnes d'agents (TF-0252, candidat) — en choix fermé :
  - (a) §Avancement dans `AGENT-CAMPAGNE.md` : l'agent émet vers la session principale
    à chaque frontière de chantier ET dès ~3 min d'horloge relevée entre deux outils
    (tableau 8 champs adapté, unité = chantier/preuve), le pilot relaie immédiatement —
    coût ~1 h, réduit la fenêtre de silence à la cadence d'émission sans la supprimer ;
  - (b) statu quo assumé : l'avancement reste l'affaire des process instrumentés
    (scripts), les campagnes d'agents restent silencieuses — coût nul, et ta remarque
    de ce soir se reproduira à chaque longue campagne.
  - Recommandation : (a) — c'est la même leçon que la restitution (TF-0249) : une
    règle sans appelant sur un chemin d'exécution ne s'applique pas sur ce chemin.
  - Par défaut (rien décidé) : (b) s'applique d'office.

## Traité — avec sa preuve

- lecture de la convention — preuve : `gabarits\AVANCEMENT-PROCESS.md` (TF-0094,
  décidée le 11/08, tableau 8 champs, émetteurs `avancement.py`/`.mjs`) ;
- diagnostic cause 1 : la convention vise les PROCESS instrumentés, aucun appelant ne
  l'étend aux campagnes d'AGENTS — preuve : `AGENT-CAMPAGNE.md` ne contient aucune
  mention d'avancement (grep), et les 10 briefs de campagne du jour non plus ;
- diagnostic cause 2 : pendant qu'un agent de fond travaille, l'orchestrateur est
  SUSPENDU et n'est réveillé qu'à la fin — preuve : le déroulé du 15/08, où chaque
  rapport d'agent est arrivé d'un bloc à sa complétion ; même un `avancement.jsonl`
  écrit par l'agent n'aurait été relayé par personne pendant la fenêtre ;
- constat consigné — preuve : TF-0252 au registre (oracle R1-R10 PASS, 1 actif).

## Non traité — avec son motif

- le câblage lui-même — motif : dépendance à une décision humaine (choix (a)/(b)
  ci-dessus) ; consigner sans corriger est la règle du constat en passant.

## Écarts à la lettre

Aucun : tu as demandé « comment ça se fait » — la réponse est un diagnostic, le
correctif attend ton choix.

## Risques

- même avec (a), une fenêtre de silence subsiste (précision d'horloge approximative
  entre deux outils, et rien ne s'émet si l'agent est bloqué sur UN outil très long) ;
  - signal : plus de 5 minutes sans émission pendant une campagne annoncée longue ;
  - parade : la borne dure reste la notification de fin ou d'échec du moteur — dite
    ici pour ne pas survendre (a).

## Prochaines actions — ordonnées, et par acteur

- `manuelle_utilisateur` — trancher TF-0252 (a)/(b) : c'est l'unique bloqueur, tout
  le reste en découle.
- `auto_ia` — sur décision (a) : écrire le §Avancement, l'injecter aux briefs types,
  relayer chaque émission reçue — dans cet ordre, le gabarit d'abord parce que les
  briefs le référencent.

## Traces

- `gabarits\AVANCEMENT-PROCESS.md` (la convention, TF-0094) ;
- `todo\TODO.md` (TF-0252, candidat) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Diagnostic - Avancement des traitements longs - 20260815a.md`.
