# Revue D8 « Lecture de données » — les trois restitutions migrées du 15/08

Revue outillée prévue par la doctrine (RL-2, RL-6, RL-7 — jugées en revue, jamais par
l'oracle seul), exécutée par le pilot en clôture des campagnes TF-0235/P4. Grille :
`forge-design\skills\critique-le-design\references\grille.md` (D8, barème /5, constats
cités). Les contrôles mécaniques cités ont tous été **rejoués par le pilot** ce jour.

## Artefact 1 — rapport SEO Produit-02 (`20260815c.html`, produit@07b9a8e)

Mécanique (rejouée) : oracle-restitution PASS · check_html PASS · verifier 11/11 ·
runner digit-ai 13 PASS 0 échec (version 20260815a, avant réinstruction).

- **RL-2 (une question par vue)** : tenu — les 6 chapeaux `.ch-apprend` répondent chacun
  à une question distincte de lecteur ; aucune vue fourre-tout constatée.
- **RL-6 (interactions significatives)** : tenu — navigation de vues, tris, filtres
  combinables et recherche changent matériellement le visible (contrôlé au render du
  socle) ; plus aucun repli « 3 lignes sur 400 » du rapport d'origine.
- **RL-7 (texte ancré)** : tenu avec un écart connu — barèmes et méthode vivent une
  fois en vue 6 ; MAIS une citation périmée du manifeste reste visible ×2 (« sinon
  candidat au nœud 74 ») — hors de portée des fiches, consignée TF-0247.

**D8 : 4/5** — écart mineur localisé (citation du manifeste), rien de structurel.

## Artefact 2 — dashboard forge-tests (`banc-rouge - Dashboard tests - 20260815a.html`, tests@4717cc0)

Mécanique (rejouée) : `preuve_dashboard_socle.py` exit 0 (check_html PASS, render_page
PASS, oracle-restitution PASS) · pytest 467 passed 0 échec.

- **RL-2** : tenu — famille « suivi » assumée (`data-restitution="suivi"`), chapeaux par vue.
- **RL-6** : tenu — 20 tables filtrables avec compteurs discrets par table (le cas
  « compteur de chapitre agrégé » a été résolu pendant la campagne : un agrégat ne dit
  pas quelle sous-liste un filtre vient de vider).
- **RL-7** : tenu — le choix le plus honnête de la campagne : **pas de figure de
  tendance sans `--precedent`** ; l'écart est déclaré au manifeste et disparaît quand
  la donnée existe (vérifié dans les deux sens par la campagne).

**D8 : 4/5** — la dérive (cœur de la famille « suivi ») n'est visible qu'avec un run
précédent fourni ; c'est déclaré, pas caché — le 5/5 viendra de l'usage en série.

## Artefact 3 — rapport AuditCore (rendus de fixtures, audit@8dceac3)

Mécanique (rejouée) : batterie `node --test` 63/63 · (campagne : verifier-rapport
exit 0 sur 3 rendus + kit standalone, check_html passé de 53 défauts à 0).

- **RL-2** : tenu — 7 vues nommées remplaçant 12 onglets plats.
- **RL-6** : tenu — recherche libre composée avec les filtres de colonne
  (`data-q-hidden` vs `data-tf-hidden`), affordances pilotées par le vérificateur du
  dépôt (vm, chaque affordance exercée).
- **RL-7** : tenu avec deux reformulations déclarées (« Note » → « Remarque », légende
  ERD) — imposées par le socle et honnêtes sur le fond ; le radar garde ses
  chevauchements de graduation, assumés au manifeste.

**D8 : 4/5** — écarts tous déclarés ; le rendu anglais du kit relève désormais de
l'avertissement (TF-0241), plus du blocage.

## Verdict de revue

Les trois restitutions **tiennent la doctrine en revue comme en oracle** — aucun red
flag, aucun écart non déclaré. Point commun remarquable : les trois manifestes
d'écarts sont **calculés** sur l'état réel des données, pas rédigés à la main — c'est
la loi n° 3 rendue mécanique. Reste ouvert, hors revue : TF-0247 (manifeste forge-seo)
et la preuve d'usage en série de la famille « suivi » (revue du 2026-09-15).
