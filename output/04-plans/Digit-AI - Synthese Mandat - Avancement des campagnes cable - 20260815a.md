# Synthèse de mandat — option (a) : l'avancement des campagnes est câblé (TF-0252)

## En-tête d'identification

**Quoi** : fin de mandat (choix (a) du diagnostic avancement). **Sur quoi** : pilot
digit-ai-forge-steering (gabarits). **Quand** : 15/08/2026, fin à 17:52
(Europe/Paris), durée ≈ 8 minutes. **Qui** : session pilot (Fable), pilot@8d9970c →
à committer.

## Verdict

TF-0252 est corrigé et archivé (oracle R1-R10 PASS, 252 archivés) : le §Avancement
existe dans `AGENT-CAMPAGNE.md` et la convention TF-0094 le référence — l'appelant
manquant est posé.

## Décisions attendues de l'humain

- 14 candidats attendent au registre (TF-0253..0259, lot BdL ; TF-0260..0266, lot
  ingéré par sa session émettrice) — décider quand tu voudras : (a) « décide TF-xxxx »
  item par item, (b) mandat global, (c) via la page TODO.html (cases + export).
  Recommandation : aucune — c'est un arbitrage de contenu, pas de forme. Par défaut :
  ils restent candidats, rien ne se perd.

## Traité — avec sa preuve

- §Avancement au gabarit de campagne — émission vers la session principale au
  démarrage, à chaque frontière de chantier et dès ~3 min d'horloge RELEVÉE entre
  deux outils ; sous-découpe des unités lentes ; relais immédiat par le pilot —
  preuve : `gabarits\AGENT-CAMPAGNE.md` (section présente, chargée par construction :
  le gabarit est collé en tête de chaque prompt de campagne, TF-0050) ;
- renvoi croisé dans la convention — preuve : `gabarits\AVANCEMENT-PROCESS.md`
  (« les campagnes d'AGENTS ont leur appelant depuis le 15/08 ») ;
- cycle registre complet — preuve : TF-0252 décidé (« a », choix fermé) → corrigé →
  archivé, oracle R1-R10 PASS, 252 archivés ;
- lot concurrent absorbé proprement — preuve : boîte d'entrée PASS, 14 candidats
  intègres au registre.

## Non traité — avec son motif

- les 14 candidats TF-0253..0266 — motif : dépendance à une décision humaine (tout
  entre en candidat, la décision est humaine — aucun mandat reçu sur eux) ;
- la preuve d'usage du §Avancement — motif : impossible à prouver ici, elle exige une
  prochaine campagne longue réelle ; inscrite à la revue du 2026-09-15.

## Écarts à la lettre

Aucun : « a » a été appliqué comme décrit dans le choix fermé, rien de plus.

## Risques

- la fenêtre de silence ne disparaît pas : un agent bloqué sur UN outil très long
  n'émet pas, même câblé ;
  - signal : plus de 5 minutes sans émission sur une campagne annoncée longue ;
  - parade : la borne dure reste la notification de fin ou d'échec du moteur — dit à
    la décision, redit ici.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — décider les 14 candidats, parce que c'est l'unique
  bloqueur restant : tout le travail `auto_ia` en aval en découle.
- Ensuite `auto_ia` — à la prochaine campagne longue, émettre et relayer selon le
  §Avancement, puis confronter la première preuve d'usage à la revue du 2026-09-15 —
  l'usage avant le bilan, parce qu'un bilan sans usage n'aurait rien à mesurer.

## Traces

- `gabarits\AGENT-CAMPAGNE.md` (§Avancement) · `gabarits\AVANCEMENT-PROCESS.md`
  (renvoi croisé) ;
- `todo\TODO.md` (14 candidats) · `todo\TODO-ARCHIVE.jsonl` (252) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Avancement des campagnes cable - 20260815a.md`.
