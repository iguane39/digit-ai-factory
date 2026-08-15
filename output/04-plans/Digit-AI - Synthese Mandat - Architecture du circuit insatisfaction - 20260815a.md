# Synthèse de mandat — architecture du circuit de l'insatisfaction (TF-0287)

## En-tête d'identification

**Quoi** : fin de mandat (exécution du prompt réécrit L99 — phase architecture, comme
le prompt le commande). **Sur quoi** : pilot digit-ai-forge-steering. **Quand** :
15/08/2026, fin à 18:55 (Europe/Paris), durée ≈ 20 minutes. **Qui** : session pilot
(Fable), pilot@353c5c4 → à committer.

## Verdict

L'architecture complète est déposée et candidatée (TF-0287), son étude d'opportunité
est jugée PASS 7/7 (E1-E7, verdict O2) — la construction n'attend plus que « décide
TF-0287 », conformément au gate que le prompt lui-même impose.

## Décisions attendues de l'humain

- **GO de construction** — en choix fermé :
  - (a) « décide TF-0287 » : construction en 3 pas (~1,5-2 j) — registre + oracles,
    gabarits + appelants, puis INS-0001 (le cas des menus) instruit en recette ;
  - (b) amender l'architecture d'abord (dire quoi) ;
  - (c) ne rien décider : le circuit reste candidat, les insatisfactions continuent
    de coûter un paragraphe manuscrit chacune.
  - Recommandation : (a) — l'exemplaire réel du jour prouve le coût du statu quo.
  - Par défaut : (c) s'applique.

## Traité — avec sa preuve

- architecture complète en 8 sections — preuve : `output\01-revues-et-propositions\
  Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md`
  (dépôt une-phrase sur canal règle 18, registre INS à réouvertures avec oracle I1-I4,
  instruction six blocs, B4 en appelant mécanique, mesure, périmètre tranché) ;
- étude d'opportunité 20260815d — preuve : oracle E1-E7 PASS (rejoué après
  renumérotation), verdict O2, 7 lignes de non-recouvrement toutes citées ;
- candidature au registre — preuve : TF-0287, oracle R1-R10 PASS, 21 actifs ;
- collision d'identifiant réparée — preuve : ma création frappée TF-0275 pendant
  qu'une ingestion concurrente prenait le même id (R2 détecté par l'oracle) ;
  renumérotée TF-0287 (max relevé : 286), registre PASS, documents alignés.

## Non traité — avec son motif

- la construction du circuit — motif : le prompt exécuté impose lui-même le GO humain
  sur l'architecture avant tout octet de construction ;
- l'instruction du cas des menus (INS-0001) — motif : elle est le pas 3 de la
  construction, et une session vit déjà sur ce produit (composition prévue au §7 de
  l'architecture).

## Écarts à la lettre

Aucun : le prompt commandait « proposition d'architecture d'abord, implémentation
après mon GO » — c'est exactement où nous sommes.

## Risques

- les sessions concurrentes frappent des identifiants pendant que le pilot écrit
  (deux collisions aujourd'hui : ma triple écriture de 10:18, et TF-0275 ce soir) ;
  - signal : R2 « seconde création pour le même id » à l'oracle du registre ;
  - parade immédiate : max relevé (286) juste avant la frappe, oracle rejoué PASS ; parade de fond :
    candidature à consigner — la frappe d'id par ingerer-lot est atomique, celle du
    pilot ne l'est pas (constat en passant, non corrigé spontanément).

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — trancher (a)/(b)/(c), parce que tout le reste du
  circuit en découle et que rien d'autre n'est bloqué.
- Ensuite `auto_ia` — sur « décide TF-0287 » : construire dans l'ordre du §8 de
  l'architecture (le squelette comptable d'abord, parce que tout s'y accroche), puis
  instruire INS-0001 en recette.

## Traces

- `output\01-revues-et-propositions\Digit-AI - Proposition Architecture - Circuit de l insatisfaction - 20260815a.md` ;
- `output\03-etudes\20260815-etude-opportunite-circuit-insatisfaction.md` ;
- `todo\TODO.md` (TF-0287, candidat) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Architecture du circuit insatisfaction - 20260815a.md`.
