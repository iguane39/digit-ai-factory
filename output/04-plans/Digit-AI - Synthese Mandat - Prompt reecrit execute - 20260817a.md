# Synthèse de mandat — le prompt réécrit L99 exécuté (5 postes, 6 agents, 3 lots avalés)

## En-tête d'identification

**Quoi** : exécution du prompt réécrit par l'analyse L99 (« vas y », écarts validés poste
par poste) + intake de trois lots arrivés en cours. **Sur quoi** : 3 dépôts écrits —
pilot, forge-tests, forge-organization (D-16, sous mandat). **Quand** : 17/08/2026, fin à
19:06 (Europe/Paris), durée ≈ 2 h 50 dont ~1 h de suspension (limite de session, reset
18:40). **Qui** : session pilot (Fable) + 6 agents Opus (2 relancés après la limite ;
escalades : aucune), pilot@c6d6e25.

## Verdict

4 postes sur 5 clos et prouvés (TF-0347, TF-0348, TF-0349, TF-0350 corrigés ; TF-0332
soldé en prime) ; le 5e (TF-0346, renommage) a sa fenêtre A EXÉCUTÉE et attend son
gate n°2 — humain seul. Chiffres rejoués en sondage : pytest tests 807 → 821, S-01 TENU
13/13, self-test todo 19 → 32, agrégateur pilot 11/11 oracles, oracle-adoption premier
tir réel FAIL 1065/0 sur BAV2 ; 3 lots ingérés (8 candidatures TF-0342..0345/0352/0353),
4 candidatures de restes (TF-0354..0357).

## Décisions attendues de l'humain

- **GATE n°2 du renommage — à toi seul** :
  `gh repo rename digit-ai-factory --repo iguane39/digit-ai-forge-pilot --yes` — puis
  dis-moi « renommé » et j'exécute la fenêtre B (25 sites de prose en un lot, les 6 sites
  du motif, remotes, oracles rejoués) puis la C (mandat 14 forges). Ne JAMAIS recréer un
  dépôt à l'ancien nom (les redirections mourraient). Par défaut : rien ne bouge, la
  fenêtre A reste réversible.
- **Toujours pendantes** : retrait de la page publiée (`claude.ai/code/artifact/7d535fbf-…`) ·
  câblage C7 au poste (chemin ABSOLU — TF-0337) · `assume` sur les 2 dettes TF-0292.
- **12 candidats neufs** (TF-0342..0345, 0352/0353 des lots · TF-0351, 0354..0357 des
  restes) : « traite les todo » les routera — les 6 du pan tests convergent avec R-40 et
  mériteraient la prochaine vague ensemble.

## Traité — avec sa preuve

- TF-0347/0348 — R-39 encodée (pilot@949a69c) + D-16 cataloguée chez organization
  (organization@6011a8b, mandat journalisé) : familles `XX-audit`/`XX-tests` au registre,
  numéro stable né à la création, `docs\projet\` intact ;
- TF-0349 — R-40 §T + appelants écrits (la boucle de l'étape 5 ne se clôt pas sur un
  solde non nul, exit 4 au contrat) ; oracle-adoption-tests (pilot@bc65e20, self-test
  12/12, agrégateur 10/10 → 11/11, antériorités < 17/08 jamais jugées) — run réel BAV2 :
  FAIL 1065/0 en 0,13 s, 18 antériorités déclarées ; forge-tests@8df8fb0 (états 1 → 3,
  solde publié en 3 endroits, pytest 821, recette S-01 TENU) ; catalogue cat-tst-02
  requalifié à la source (generer-vues --check PASS, oracle-catalogues PASS) ;
- TF-0350 — TODO-ARCHIVE.html (307 items, recherche plein texte côté client, R-30
  strict, check_html 0 échec) — critère littéral prouvé : « renommage » → 12 items dont
  TF-0062 et ses 5 jalons ; TF-0317 prouvé par fixture post-archivage ;
- TF-0346 fenêtre A (pilot@c6d6e25) — TF-0332 clos (D-14 : « répercuté partout » corrigé
  sur pièces, RUN-VERSION reformulé en fait daté, doctrine « pas de jonction ») ; mesure
  P0 figée au gate n°1 : 25 occurrences / 11 fichiers, classes justifiées énumérées ;
  table §3 bis écrite (`references\CORRESPONDANCE-RENOMMAGE-FACTORY.md`, ids gelés) ;
  liste blanche élargie aux deux noms ;
- intake : 3 lots dénoncés par B1, confrontés, ingérés (Approval2 c : recette
  multi-profils socle, matrice exécutable, 3 pièges à faux vert, données référencées ;
  Approval2 d : définition de fin et traçage de la boucle de correction).

## Non traité — avec son motif

- fenêtres B et C du renommage — motif : gate n°2 humain non franchi (l'étude l'exige :
  l'humain lance le geste) ;
- les 12 candidats neufs — motif : tout entre en candidat, décision humaine ;
- l'archivage des corrigés — motif : fail-closed R10 inchangé (lot Run-Delivery,
  TF-0324 bloqué à condition écrite) ;
- le rattrapage des produits (cahiers non soldés, porteurs caducs) — motif : R-37 al. 3,
  au prochain run de chacun.

## Écarts à la lettre

Tous validés en amont par toi (tableau L99) ou déclarés par les agents (12 au total) ;
les deux qui comptent : les ids de schéma `pilot/*@1` sont GELÉS et non migrés (l'alinéa
« identifiants stables » de R-39 §B le commande — un renommage d'ids aurait cassé la
traçabilité que la journée entière a réparée) ; et trois emplacements « proposition »
chez forge-tests sont restés INTACTS avec motif (doctrine de relecture des correctifs et
convention de chemin en service — TF-0354 les porte).

## Risques

- la fenêtre A reste ouverte tant que le gate n°2 n'est pas franchi — un corpus qui
  annonce factory (description GitHub, README) sur un dépôt encore nommé forge-pilot ;
  - signal : l'écart est VOULU et borné (présentation O2 exécutée avant la décision de
    réouverture) ; parade : la fenêtre B le referme au signal, ou TF-0346 se déclare
    suspendu à la revue du 24/08 si le gate n'est pas franchi.
- le solde d'adoption ne compte pas les éléments non couverts déclarés par le rapport
  (TF-0355) ; signal : solde 0 avec N non couverts ; parade : candidature ouverte, les
  deux colonnes coexistent déjà au tableau.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — franchir (ou différer explicitement) le gate n°2 :
  c'est le seul poste du mandat qui attend, et la fenêtre A se périme à mesure que la
  prose dérive (+33 occurrences avaient été mesurées en 11 commits d'une journée).
- Ensuite `auto_ia` — sur ton signal « renommé » : fenêtre B le jour même, fenêtre C en
  mandat de campagne ; sinon, prochaine vague : les 6 candidats tests (TF-0342..0345,
  0352/0353) ensemble — ils forment la suite naturelle de R-40.
- Enfin `manuelle_dev` — BAV2 : solder les 1065 (l'oracle et le cahier montrent le
  chemin) au prochain run du produit.

## Traces

- études : `20260817-etude-opportunite-{sequencement-factory,tests-bout-en-bout}.md`
  (PASS 7/7) · plan : `output\04-plans\Digit-AI - Plan Renommage - Fenetre A factory - 20260817a.md` ·
  table : `references\CORRESPONDANCE-RENOMMAGE-FACTORY.md` ;
- commits : pilot `68b0cf0`, `bc65e20`, `949a69c`, `c6d6e25` (+ celui-ci) · tests
  `8df8fb0` · organization `6011a8b` ;
- `todo\TODO.md` (50 actifs) · `todo\TODO-ARCHIVE.html` (307, recherche) ·
  `BOUCLE-AMELIORATION.md` (5e vague du 17/08) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Prompt reecrit execute - 20260817a.md`.
